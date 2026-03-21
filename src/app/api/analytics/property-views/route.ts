export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { readProperties } from '@/lib/mongodb-database';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const days = parseInt(searchParams.get('days') || '30');

    const allProperties = await readProperties();
    
    // Filter by property ID if specified
    const targetProperties = propertyId 
      ? allProperties.filter(p => p.id === propertyId) 
      : allProperties;

    // Transform and sort by views
    const transformedProperties = targetProperties.map((p: any) => ({
      id: p.id,
      propertyNumber: p.propertyNumber,
      propertyType: p.propertyType,
      villageName: p.villageName,
      areaName: p.areaName,
      views: p.views || 0,
      lastViewedAt: p.lastViewedAt,
      price: p.price,
      status: p.status,
      category: p.category
    })).sort((a, b) => (b.views || 0) - (a.views || 0));

    // Calculate summary statistics
    const totalViews = transformedProperties.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
    const uniqueRecords = transformedProperties.length;

    // Category statistics
    const categoryStats: Record<string, { count: number, total_views: number, avg_views: number }> = {};
    allProperties.forEach(p => {
      const cat = p.category || 'Normal';
      if (!categoryStats[cat]) categoryStats[cat] = { count: 0, total_views: 0, avg_views: 0 };
      categoryStats[cat].count++;
      categoryStats[cat].total_views += (p as any).views || 0;
    });
    
    const formattedCategoryStats = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      count: stats.count,
      total_views: stats.total_views,
      avg_views: stats.total_views / stats.count
    }));

    // Location (Village) statistics
    const locationStats: Record<string, { count: number, total_views: number, avg_price: number, totalPrice: number }> = {};
    allProperties.forEach(p => {
      const loc = p.villageName;
      if (!locationStats[loc]) locationStats[loc] = { count: 0, total_views: 0, avg_price: 0, totalPrice: 0 };
      locationStats[loc].count++;
      locationStats[loc].total_views += (p as any).views || 0;
      locationStats[loc].totalPrice += p.price || 0;
    });

    const formattedLocationStats = Object.entries(locationStats).map(([village_name, stats]) => ({
      village_name,
      count: stats.count,
      total_views: stats.total_views,
      avg_price: stats.totalPrice / stats.count
    })).sort((a, b) => b.total_views - a.total_views).slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        properties: transformedProperties,
        dailyViews: [], // Empty for now as we don't store time-series yet
        topProperties: transformedProperties.slice(0, 10),
        categoryStats: formattedCategoryStats,
        locationStats: formattedLocationStats,
        summary: {
          totalProperties: allProperties.length,
          totalViews: totalViews,
          uniqueVisitors: uniqueRecords,
          period: `${days} days`
        }
      }
    });

  } catch (error) {
    logger.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
