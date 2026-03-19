export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/property-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const days = parseInt(searchParams.get('days') || '30');

    // Get basic property analytics
    let query = `
      SELECT 
        p.id,
        p.property_number,
        p.property_type,
        p.village_name,
        p.area_name,
        p.views as total_views,
        p.last_viewed_at,
        p.price,
        p.status,
        p.category
      FROM properties p
    `;

    let params: any[] = [];

    if (propertyId) {
      query += ' WHERE p.id = ?';
      params.push(propertyId);
    }

    query += ' ORDER BY p.views DESC';

    const result = await db.execute(query, params);

    // Transform database rows to frontend format
    const transformedProperties = result.rows.map((row: any) => ({
      id: row.id,
      propertyNumber: row.property_number,
      propertyType: row.property_type,
      villageName: row.village_name,
      areaName: row.area_name,
      views: row.total_views || 0,
      lastViewedAt: row.last_viewed_at,
      price: row.price,
      status: row.status,
      category: row.category
    }));

    // Calculate summary statistics
    const totalViews = transformedProperties.reduce((sum: number, property: any) => sum + (property.views || 0), 0);
    const uniqueVisitors = new Set(transformedProperties.map((property: any) => property.id)).size; // Simplified unique count

    // Get category statistics
    const categoryStatsQuery = `
      SELECT 
        category,
        COUNT(*) as count,
        SUM(views) as total_views,
        AVG(views) as avg_views
      FROM properties
      GROUP BY category
      ORDER BY total_views DESC
    `;

    const categoryStatsResult = await db.execute(categoryStatsQuery);

    // Get location statistics
    const locationStatsQuery = `
      SELECT 
        village_name,
        COUNT(*) as count,
        SUM(views) as total_views,
        AVG(price) as avg_price
      FROM properties
      GROUP BY village_name
      ORDER BY total_views DESC
      LIMIT 10
    `;

    const locationStatsResult = await db.execute(locationStatsQuery);

    return NextResponse.json({
      success: true,
      data: {
        properties: transformedProperties,
        dailyViews: [], // Empty for now
        topProperties: transformedProperties.slice(0, 10),
        categoryStats: categoryStatsResult.rows,
        locationStats: locationStatsResult.rows,
        summary: {
          totalProperties: transformedProperties.length,
          totalViews: totalViews,
          uniqueVisitors: uniqueVisitors,
          period: `${days} days`
        }
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
