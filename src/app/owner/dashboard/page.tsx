'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Home, 
  Database, 
  TrendingUp,
  Activity,
  FileText,
  Settings,
  Crown
} from 'lucide-react';
import Link from 'next/link';

export default function OwnerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalInquiries: 0,
    recentActivity: 0
  });

  useEffect(() => {
    // Load dashboard statistics
    const loadStats = async () => {
      try {
        // Fetch properties count
        const propertiesResponse = await fetch('/api/properties');
        if (propertiesResponse.ok) {
          const properties = await propertiesResponse.json();
          setStats(prev => ({ ...prev, totalProperties: properties.length || 0 }));
        }

        // Fetch users count
        const usersResponse = await fetch('/api/users');
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          setStats(prev => ({ ...prev, totalUsers: users.length || 0 }));
        }

        // Fetch inquiries count
        const inquiriesResponse = await fetch('/api/inquiries');
        if (inquiriesResponse.ok) {
          const inquiries = await inquiriesResponse.json();
          setStats(prev => ({ ...prev, totalInquiries: inquiries.length || 0 }));
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-500" />
              Owner Dashboard
            </h1>
            <p className="text-slate-400">Manage your real estate empire</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <Database className="mr-2 h-4 w-4" />
                Main Dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link href="/upload">
                <Home className="mr-2 h-4 w-4" />
                Add Property
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalProperties}</div>
            <p className="text-xs text-slate-400">Active listings</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-slate-400">Registered users</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Inquiries</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalInquiries}</div>
            <p className="text-xs text-slate-400">Customer inquiries</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.recentActivity}</div>
            <p className="text-xs text-slate-400">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-slate-400">
              Manage your properties and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Link href="/properties">
                  <Home className="mr-2 h-4 w-4" />
                  View Properties
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Link href="/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Link href="/inquiries">
                  <FileText className="mr-2 h-4 w-4" />
                  View Inquiries
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              System Status
            </CardTitle>
            <CardDescription className="text-slate-400">
              Application health and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Database Status</span>
              <Badge variant="default" className="bg-green-600">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">API Status</span>
              <Badge variant="default" className="bg-green-600">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Last Backup</span>
              <Badge variant="outline" className="border-slate-600 text-slate-300">2 hours ago</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
