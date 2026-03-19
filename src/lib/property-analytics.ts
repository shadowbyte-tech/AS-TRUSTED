import { createClient } from '@libsql/client';
import { logger } from './logger';

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./database.db',
});

interface PropertyView {
  id?: string;
  propertyId: string;
  userId?: string;
  sessionId: string;
  timestamp: string;
  duration?: number;
  source: string;
  userAgent?: string;
  referrer?: string;
}

interface PropertyInquiry {
  id?: string;
  propertyId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  message?: string;
  timestamp: string;
  status: 'pending' | 'contacted' | 'converted';
  source: string;
}

interface PropertyAnalytics {
  totalViews: number;
  uniqueViews: number;
  totalInquiries: number;
  avgViewDuration: number;
  conversionRate: number;
  viewsByDate: { date: string; views: number }[];
  inquiriesByDate: { date: string; inquiries: number }[];
  topProperties: { propertyId: string; views: number; inquiries: number }[];
}

// Initialize analytics tables
export async function initializeAnalyticsTables() {
  try {
    // Property views table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS property_views (
        id TEXT PRIMARY KEY,
        property_id TEXT NOT NULL,
        user_id TEXT,
        session_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        duration INTEGER,
        source TEXT NOT NULL,
        user_agent TEXT,
        referrer TEXT,
        FOREIGN KEY (property_id) REFERENCES properties (id)
      )
    `);

    // Property inquiries table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS property_inquiries (
        id TEXT PRIMARY KEY,
        property_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_email TEXT NOT NULL,
        user_phone TEXT,
        message TEXT,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        source TEXT NOT NULL,
        FOREIGN KEY (property_id) REFERENCES properties (id)
      )
    `);

    // Property analytics summary table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS property_analytics (
        property_id TEXT PRIMARY KEY,
        total_views INTEGER DEFAULT 0,
        unique_views INTEGER DEFAULT 0,
        total_inquiries INTEGER DEFAULT 0,
        avg_view_duration REAL DEFAULT 0,
        conversion_rate REAL DEFAULT 0,
        last_updated TEXT NOT NULL,
        FOREIGN KEY (property_id) REFERENCES properties (id)
      )
    `);

    logger.info('Analytics tables initialized successfully');
  } catch (error) {
    logger.error('Error initializing analytics tables:', error);
    throw error;
  }
}

// Track property view
export async function trackPropertyView(view: Omit<PropertyView, 'id' | 'timestamp'>) {
  try {
    const id = `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    await client.execute(`
        INSERT INTO property_views (id, property_id, user_id, session_id, timestamp, duration, source, user_agent, referrer)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, view.propertyId, view.userId || null, view.sessionId, timestamp, view.duration || null, view.source, view.userAgent || null, view.referrer || null]);

    // Update analytics summary
    await updatePropertyAnalytics(view.propertyId);
    
    return { success: true, viewId: id };
  } catch (error) {
    logger.error('Error tracking property view:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Track property inquiry
export async function trackPropertyInquiry(inquiry: Omit<PropertyInquiry, 'id' | 'timestamp' | 'status'>) {
  try {
    const id = `inquiry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    await client.execute(`
        INSERT INTO property_inquiries (id, property_id, user_name, user_email, user_phone, message, timestamp, status, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, inquiry.propertyId, inquiry.userName, inquiry.userEmail, inquiry.userPhone || null, inquiry.message || null, timestamp, 'pending', inquiry.source]);

    // Update analytics summary
    await updatePropertyAnalytics(inquiry.propertyId);
    
    return { success: true, inquiryId: id };
  } catch (error) {
    logger.error('Error tracking property inquiry:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Update property analytics summary
async function updatePropertyAnalytics(propertyId: string) {
  try {
    // Get current stats
    const viewsResult = await client.execute({
      sql: 'SELECT COUNT(*) as total_views, COUNT(DISTINCT session_id) as unique_views, AVG(duration) as avg_duration FROM property_views WHERE property_id = ?',
      args: [propertyId]
    });

    const inquiriesResult = await client.execute({
      sql: 'SELECT COUNT(*) as total_inquiries FROM property_inquiries WHERE property_id = ?',
      args: [propertyId]
    });

    const stats = viewsResult.rows[0] as any;
    const inquiryStats = inquiriesResult.rows[0] as any;
    
    const totalViews = stats.total_views || 0;
    const uniqueViews = stats.unique_views || 0;
    const totalInquiries = inquiryStats.total_inquiries || 0;
    const avgViewDuration = stats.avg_duration || 0;
    const conversionRate = totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0;

    // Upsert analytics summary
    await client.execute(`
        INSERT OR REPLACE INTO property_analytics (property_id, total_views, unique_views, total_inquiries, avg_view_duration, conversion_rate, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [propertyId, totalViews, uniqueViews, totalInquiries, avgViewDuration, conversionRate, new Date().toISOString()]);

  } catch (error) {
    logger.error('Error updating property analytics:', error);
  }
}

// Get property analytics
export async function getPropertyAnalytics(propertyId?: string): Promise<PropertyAnalytics | { properties: any[] }> {
  try {
    if (propertyId) {
      // Single property analytics
      const result = await client.execute({
        sql: 'SELECT * FROM property_analytics WHERE property_id = ?',
        args: [propertyId]
      });

      const analytics = result.rows[0] as any;
      
      if (!analytics) {
        return {
          totalViews: 0,
          uniqueViews: 0,
          totalInquiries: 0,
          avgViewDuration: 0,
          conversionRate: 0,
          viewsByDate: [],
          inquiriesByDate: [],
          topProperties: []
        };
      }

      // Get views by date (last 30 days)
      const viewsByDateResult = await client.execute({
        sql: `
          SELECT DATE(timestamp) as date, COUNT(*) as views 
          FROM property_views 
          WHERE property_id = ? AND timestamp >= datetime('now', '-30 days')
          GROUP BY DATE(timestamp)
          ORDER BY date DESC
        `,
        args: [propertyId]
      });

      // Get inquiries by date (last 30 days)
      const inquiriesByDateResult = await client.execute({
        sql: `
          SELECT DATE(timestamp) as date, COUNT(*) as inquiries 
          FROM property_inquiries 
          WHERE property_id = ? AND timestamp >= datetime('now', '-30 days')
          GROUP BY DATE(timestamp)
          ORDER BY date DESC
        `,
        args: [propertyId]
      });

      return {
        totalViews: analytics.total_views,
        uniqueViews: analytics.unique_views,
        totalInquiries: analytics.total_inquiries,
        avgViewDuration: analytics.avg_view_duration,
        conversionRate: analytics.conversion_rate,
        viewsByDate: viewsByDateResult.rows as any[],
        inquiriesByDate: inquiriesByDateResult.rows as any[],
        topProperties: []
      };
    } else {
      // All properties analytics
      const result = await client.execute(`
        SELECT 
          pa.property_id,
          pa.total_views,
          pa.unique_views,
          pa.total_inquiries,
          pa.conversion_rate,
          p.property_number,
          p.village_name,
          p.property_type
        FROM property_analytics pa
        JOIN properties p ON pa.property_id = p.id
        ORDER BY pa.total_views DESC
        LIMIT 50
      `);

      return { properties: result.rows };
    }
  } catch (error) {
    logger.error('Error getting property analytics:', error);
    throw error;
  }
}

// Get top performing properties
export async function getTopProperties(limit: number = 10) {
  try {
    const result = await client.execute(`
        SELECT 
          pa.property_id,
          pa.total_views,
          pa.unique_views,
          pa.total_inquiries,
          pa.conversion_rate,
          p.property_number,
          p.village_name,
          p.property_type,
          p.price,
          p.image_url
        FROM property_analytics pa
        JOIN properties p ON pa.property_id = p.id
        ORDER BY pa.total_views DESC
        LIMIT ?
      `, [limit]);

    return result.rows;
  } catch (error) {
    logger.error('Error getting top properties:', error);
    return [];
  }
}

// Get recent inquiries
export async function getRecentInquiries(limit: number = 20) {
  try {
    const result = await client.execute(`
        SELECT 
          pi.*,
          p.property_number,
          p.village_name,
          p.property_type,
          p.price
        FROM property_inquiries pi
        JOIN properties p ON pi.property_id = p.id
        ORDER BY pi.timestamp DESC
        LIMIT ?
      `, [limit]);

    return result.rows;
  } catch (error) {
    logger.error('Error getting recent inquiries:', error);
    return [];
  }
}

// Update inquiry status
export async function updateInquiryStatus(inquiryId: string, status: 'pending' | 'contacted' | 'converted') {
  try {
    await client.execute({
      sql: 'UPDATE property_inquiries SET status = ? WHERE id = ?',
      args: [status, inquiryId]
    });

    return { success: true };
  } catch (error) {
    logger.error('Error updating inquiry status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
