'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Home, 
  MessageSquare, 
  Calendar,
  Eye,
  MousePointer,
  Clock,
  BarChart3
} from 'lucide-react';

interface AnalyticsData {
  pageViews: { total: number; today: number; thisWeek: number };
  userActivity: { activeUsers: number; newUsers: number; returningUsers: number };
  plotMetrics: { totalViews: number; inquiries: number; conversionRate: string };
  popularPages: Array<{ page: string; views: number; percentage: number }>;
  trafficSources: Array<{ source: string; visitors: number; percentage: number }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: { total: 0, today: 0, thisWeek: 0 },
    userActivity: { activeUsers: 0, newUsers: 0, returningUsers: 0 },
    plotMetrics: { totalViews: 0, inquiries: 0, conversionRate: '0%' },
    popularPages: [],
    trafficSources: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Simulate analytics data (in real app, this would come from analytics service)
        const mockData: AnalyticsData = {
          pageViews: { total: 15420, today: 234, thisWeek: 1680 },
          userActivity: { activeUsers: 89, newUsers: 23, returningUsers: 66 },
          plotMetrics: { totalViews: 8750, inquiries: 145, conversionRate: '1.66%' },
          popularPages: [
            { page: '/plots', views: 4520, percentage: 29.3 },
            { page: '/premium-dashboard', views: 3210, percentage: 20.8 },
            { page: '/', views: 2890, percentage: 18.7 },
            { page: '/services', views: 1650, percentage: 10.7 },
            { page: '/about', views: 1240, percentage: 8.0 }
          ],
          trafficSources: [
            { source: 'Direct', visitors: 6180, percentage: 40.1 },
            { source: 'Google Search', visitors: 4320, percentage: 28.0 },
            { source: 'Social Media', visitors: 2890, percentage: 18.7 },
            { source: 'Referrals', visitors: 1560, percentage: 10.1 },
            { source: 'Email', visitors: 470, percentage: 3.1 }
          ]
        };

        setAnalytics(mockData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="text-blue-400 hover:text-blue-300">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-slate-400">
                View platform analytics and insights
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Page Views</p>
                    <p className="text-3xl font-bold">{analytics.pageViews.total.toLocaleString()}</p>
                    <p className="text-blue-200 text-xs">+{analytics.pageViews.today} today</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active Users</p>
                    <p className="text-3xl font-bold">{analytics.userActivity.activeUsers}</p>
                    <p className="text-green-200 text-xs">{analytics.userActivity.newUsers} new users</p>
                  </div>
                  <Users className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Plot Views</p>
                    <p className="text-3xl font-bold">{analytics.plotMetrics.totalViews.toLocaleString()}</p>
                    <p className="text-purple-200 text-xs">{analytics.plotMetrics.inquiries} inquiries</p>
                  </div>
                  <Home className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Conversion Rate</p>
                    <p className="text-3xl font-bold">{analytics.plotMetrics.conversionRate}</p>
                    <p className="text-orange-200 text-xs">Inquiries to views</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Pages */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5" />
                Popular Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popularPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{page.page}</p>
                        <p className="text-slate-400 text-sm">{page.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-slate-400 border-slate-600">
                      {page.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MousePointer className="h-5 w-5" />
                Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-orange-500' :
                        'bg-slate-500'
                      }`} />
                      <div>
                        <p className="text-white font-medium">{source.source}</p>
                        <p className="text-slate-400 text-sm">{source.visitors.toLocaleString()} visitors</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-slate-400 border-slate-600">
                      {source.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time-based Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Page Views</span>
                    <span className="text-white font-bold">{analytics.pageViews.thisWeek.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">New Users</span>
                    <span className="text-white font-bold">{analytics.userActivity.newUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Returning Users</span>
                    <span className="text-white font-bold">{analytics.userActivity.returningUsers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5" />
                  Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Page Views</span>
                    <span className="text-white font-bold">{analytics.pageViews.today}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Active Users</span>
                    <span className="text-white font-bold">{analytics.userActivity.activeUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Bounce Rate</span>
                    <span className="text-white font-bold">32.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Actions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Analytics Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Export Report
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Set Up Goals
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Configure Tracking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}