import { createClient } from '@libsql/client';
import { logger } from './logger';

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./database.db',
});

interface Lead {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'interested' | 'negotiating' | 'converted' | 'lost';
  propertyId?: string;
  propertyType?: string;
  budget?: number;
  location?: string;
  message?: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastContacted?: string;
  followUpDate?: string;
}

interface LeadActivity {
  id?: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  description: string;
  createdBy: string;
  createdAt: string;
}

// Initialize lead management tables
export async function initializeLeadTables() {
  try {
    // Leads table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        source TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        property_id TEXT,
        property_type TEXT,
        budget INTEGER,
        location TEXT,
        message TEXT,
        assigned_to TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        last_contacted TEXT,
        follow_up_date TEXT,
        FOREIGN KEY (property_id) REFERENCES properties (id)
      )
    `);

    // Lead activities table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS lead_activities (
        id TEXT PRIMARY KEY,
        lead_id TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (lead_id) REFERENCES leads (id)
      )
    `);

    logger.info('Lead management tables initialized successfully');
  } catch (error) {
    console.error('Error initializing lead tables:', error);
    throw error;
  }
}

// Create new lead
export async function createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await client.execute(`
      INSERT INTO leads (id, name, email, phone, source, status, property_id, property_type, budget, location, message, assigned_to, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, lead.name, lead.email, lead.phone || null, lead.source, lead.status, lead.propertyId || null, lead.propertyType || null, lead.budget || null, lead.location || null, lead.message || null, lead.assignedTo || null, lead.notes || null, now, now]);

    return { success: true, leadId: id };
  } catch (error) {
    console.error('Error creating lead:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Update lead
export async function updateLead(id: string, updates: Partial<Lead>) {
  try {
    const now = new Date().toISOString();
    const setClause = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt') {
        setClause.push(`${key} = ?`);
        values.push(value);
      }
    });

    setClause.push('updated_at = ?');
    values.push(now);
    values.push(id);

    await client.execute(`
      UPDATE leads SET ${setClause.join(', ')} WHERE id = ?
    `, values);

    return { success: true };
  } catch (error) {
    console.error('Error updating lead:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get all leads
export async function getLeads(filters?: {
  status?: string;
  source?: string;
  assignedTo?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = `
      SELECT 
        l.*,
        p.property_number,
        p.village_name,
        p.price
      FROM leads l
      LEFT JOIN properties p ON l.property_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (filters?.status) {
      query += ' AND l.status = ?';
      params.push(filters.status);
    }

    if (filters?.source) {
      query += ' AND l.source = ?';
      params.push(filters.source);
    }

    if (filters?.assignedTo) {
      query += ' AND l.assigned_to = ?';
      params.push(filters.assignedTo);
    }

    query += ' ORDER BY l.created_at DESC';

    if (filters?.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters?.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    const result = await client.execute(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting leads:', error);
    return [];
  }
}

// Get lead by ID
export async function getLeadById(id: string) {
  try {
    const result = await client.execute(`
      SELECT 
        l.*,
        p.property_number,
        p.village_name,
        p.price
      FROM leads l
      LEFT JOIN properties p ON l.property_id = p.id
      WHERE l.id = ?
    `, [id]);

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting lead:', error);
    return null;
  }
}

// Add lead activity
export async function addLeadActivity(activity: Omit<LeadActivity, 'id' | 'createdAt'>) {
  try {
    const id = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await client.execute(`
      INSERT INTO lead_activities (id, lead_id, type, description, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, activity.leadId, activity.type, activity.description, activity.createdBy, now]);

    return { success: true, activityId: id };
  } catch (error) {
    console.error('Error adding lead activity:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get lead activities
export async function getLeadActivities(leadId: string) {
  try {
    const result = await client.execute(`
      SELECT * FROM lead_activities 
      WHERE lead_id = ? 
      ORDER BY created_at DESC
    `, [leadId]);

    return result.rows;
  } catch (error) {
    console.error('Error getting lead activities:', error);
    return [];
  }
}

// Get lead statistics
export async function getLeadStats() {
  try {
    const result = await client.execute(`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
        COUNT(CASE WHEN status = 'interested' THEN 1 END) as interested_leads,
        COUNT(CASE WHEN status = 'negotiating' THEN 1 END) as negotiating_leads,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads,
        COUNT(CASE WHEN status = 'lost' THEN 1 END) as lost_leads,
        COUNT(CASE WHEN created_at >= datetime('now', '-30 days') THEN 1 END) as leads_this_month
      FROM leads
    `);

    const sourceResult = await client.execute(`
      SELECT source, COUNT(*) as count 
      FROM leads 
      GROUP BY source 
      ORDER BY count DESC
    `);

    const stats = result.rows[0] as any;
    return {
      ...stats,
      conversionRate: stats.total_leads > 0 ? (stats.converted_leads / stats.total_leads) * 100 : 0,
      sources: sourceResult.rows
    };
  } catch (error) {
    console.error('Error getting lead stats:', error);
    return null;
  }
}

// Get follow-up reminders
export async function getFollowUpReminders() {
  try {
    const result = await client.execute(`
      SELECT 
        l.*,
        p.property_number,
        p.village_name
      FROM leads l
      LEFT JOIN properties p ON l.property_id = p.id
      WHERE l.follow_up_date <= datetime('now', '+7 days')
      AND l.status NOT IN ('converted', 'lost')
      ORDER BY l.follow_up_date ASC
    `);

    return result.rows;
  } catch (error) {
    console.error('Error getting follow-up reminders:', error);
    return [];
  }
}

// Convert property inquiry to lead
export async function convertInquiryToLead(inquiryId: string, leadData: Partial<Lead>) {
  try {
    // Get inquiry details
    const inquiryResult = await client.execute(`
      SELECT * FROM property_inquiries WHERE id = ?
    `, [inquiryId]);

    const inquiry = inquiryResult.rows[0] as any;
    if (!inquiry) {
      return { success: false, error: 'Inquiry not found' };
    }

    // Create lead from inquiry
    const lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
      name: inquiry.user_name,
      email: inquiry.user_email,
      phone: inquiry.user_phone,
      source: 'property_inquiry',
      status: 'new',
      propertyId: inquiry.property_id,
      message: inquiry.message,
      ...leadData
    };

    const createResult = await createLead(lead);
    if (!createResult.success) {
      return createResult;
    }

    // Add activity
    await addLeadActivity({
      leadId: createResult.leadId!,
      type: 'note',
      description: 'Lead created from property inquiry',
      createdBy: 'system'
    });

    return { success: true, leadId: createResult.leadId };
  } catch (error) {
    logger.error('Error converting inquiry to lead:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Delete lead
export async function deleteLead(id: string) {
  try {
    await client.execute('DELETE FROM lead_activities WHERE lead_id = ?', [id]);
    await client.execute('DELETE FROM leads WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting lead:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
