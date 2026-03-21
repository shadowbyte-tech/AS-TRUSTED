export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { readProperties, readInquiries, readUsers } from '@/lib/mongodb-database';

export async function GET() {
  try {
    const [properties, inquiries, users] = await Promise.all([
      readProperties().catch(() => []),
      readInquiries().catch(() => []),
      readUsers().catch(() => []),
    ]);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 86400000);
    const weekStart = new Date(todayStart.getTime() - 7 * 86400000);

    // ─── Inquiry Analysis ───
    const todayInquiries = inquiries.filter((i: any) => new Date(i.createdAt || i.receivedAt || 0) >= todayStart);
    const yesterdayInquiries = inquiries.filter((i: any) => {
      const d = new Date(i.createdAt || i.receivedAt || 0);
      return d >= yesterdayStart && d < todayStart;
    });
    const weekInquiries = inquiries.filter((i: any) => new Date(i.createdAt || i.receivedAt || 0) >= weekStart);

    const inquiryChange = yesterdayInquiries.length > 0
      ? Math.round(((todayInquiries.length - yesterdayInquiries.length) / yesterdayInquiries.length) * 100)
      : 0;

    // ─── User Analysis ───
    const regularUsers = users.filter((u: any) => u.role !== 'Owner');
    const todayUsers = regularUsers.filter((u: any) => new Date(u.createdAt || 0) >= todayStart);
    const weekUsers = regularUsers.filter((u: any) => new Date(u.createdAt || 0) >= weekStart);

    // ─── Property Analysis ───
    const availableProperties = properties.filter((p: any) => p.status === 'Available' || !p.status);
    const soldProperties = properties.filter((p: any) => p.status === 'Sold');

    // Price range analysis
    const priceRanges = [
      { label: '₹5L–₹9L', min: 500000, max: 900000 },
      { label: '₹9L–₹12L', min: 900000, max: 1200000 },
      { label: '₹12L–₹20L', min: 1200000, max: 2000000 },
      { label: '₹20L+', min: 2000000, max: Infinity },
    ];

    const priceRangeData = priceRanges.map(range => ({
      label: range.label,
      count: properties.filter((p: any) => p.price >= range.min && p.price < range.max).length,
    }));

    const topPriceRange = priceRangeData.reduce((a, b) => (a.count > b.count ? a : b), priceRangeData[0]);

    // Location analysis
    const locationMap: Record<string, number> = {};
    properties.forEach((p: any) => {
      const loc = p.areaName || p.villageName || 'Unknown';
      locationMap[loc] = (locationMap[loc] || 0) + 1;
    });
    const topLocation = Object.entries(locationMap).sort((a, b) => b[1] - a[1])[0];

    // Property type breakdown
    const typeCounts = { Plot: 0, House: 0, Land: 0 };
    properties.forEach((p: any) => {
      const t = p.propertyType as keyof typeof typeCounts;
      if (t in typeCounts) typeCounts[t]++;
    });

    // Lead classification (simple heuristic: recent inquiries = hot, older = warm/cold)
    const hotLeads = inquiries.filter((i: any) => new Date(i.createdAt || i.receivedAt || 0) >= todayStart);
    const warmLeads = weekInquiries.filter((i: any) => new Date(i.createdAt || i.receivedAt || 0) < todayStart);
    const coldLeads = inquiries.filter((i: any) => new Date(i.createdAt || i.receivedAt || 0) < weekStart);

    // Conversion rate
    const conversionRate = properties.length > 0 && inquiries.length > 0
      ? Math.round((soldProperties.length / inquiries.length) * 100)
      : 0;

    return NextResponse.json({
      summary: {
        totalProperties: properties.length,
        availableProperties: availableProperties.length,
        soldProperties: soldProperties.length,
        totalUsers: regularUsers.length,
        todayUsers: todayUsers.length,
        weekUsers: weekUsers.length,
        totalInquiries: inquiries.length,
        todayInquiries: todayInquiries.length,
        yesterdayInquiries: yesterdayInquiries.length,
        weekInquiries: weekInquiries.length,
        inquiryChange,
        conversionRate,
      },
      propertyInsights: {
        typeCounts,
        priceRangeData,
        topPriceRange: topPriceRange || null,
        topLocation: topLocation ? { name: topLocation[0], count: topLocation[1] } : null,
        locationMap,
      },
      leads: {
        hot: hotLeads.length,
        warm: warmLeads.length,
        cold: coldLeads.length,
        hotLeadDetails: hotLeads.slice(0, 3).map((i: any) => ({ name: i.name, phone: i.phone || i.mobile || 'N/A' })),
      },
      generatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Buddy Analytics Error:', error);
    return NextResponse.json({
      summary: {
        totalProperties: 0, availableProperties: 0, soldProperties: 0,
        totalUsers: 0, todayUsers: 0, weekUsers: 0,
        totalInquiries: 0, todayInquiries: 0, yesterdayInquiries: 0, weekInquiries: 0,
        inquiryChange: 0, conversionRate: 0,
      },
      propertyInsights: { typeCounts: { Plot: 0, House: 0, Land: 0 }, priceRangeData: [], topPriceRange: null, topLocation: null, locationMap: {} },
      leads: { hot: 0, warm: 0, cold: 0, hotLeadDetails: [] },
      generatedAt: new Date().toISOString(),
    });
  }
}
