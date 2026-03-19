'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Database, Table, Users, FileText, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface DatabaseStats {
  plots: { count: number; size: string };
  users: { count: number; size: string };
  inquiries: { count: number; size: string };
  registrations: { count: number; size: string };
  totalSize: string;
  status: 'connected' | 'disconnected';
}

export default function DatabaseManagePage() {
  const [stats, setStats] = useState<DatabaseStats>({
    plots: { count: 0, size: '0 KB' },
    users: { count: 0, size: '0 KB' },
    inquiries: { count: 0, size: '0 KB' },
    registrations: { count: 0, size: '0 KB' },
    totalSize: '0 KB',
    status: 'disconnected'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatabaseStats = async () => {
      try {
        // Fetch database status
        const statusRes = await fetch('/api/admin/db-status');
        const statusData = await statusRes.json();
        
        // Fetch table counts
        const [plotsRes, usersRes, inquiriesRes] = await Promise.all([
          fetch('/api/plots'),
          fetch('/api/users'),
          fetch('/api/inquiries')
        ]);

        const plots = await plotsRes.json();
        const users = await usersRes.json();
        const inquiries = await inquiriesRes.json();

        setStats({
          plots: { count: plots.length || 0, size: '2.5 MB' },
          users: { count: users.length || 0, size: '45 KB' },
          inquiries: { count: inquiries.length || 0, size: '128 KB' },
          registrations: { count: 0, size: '32 KB' },
          totalSize: '2.7 MB',
          status: statusData.mongodb ? 'connected' : 'disconnected'
        });
      } catch (error) {
        console.error('Error fetching database stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabaseStats();
  }, []);

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
                Database Management
              </h1>
              <p className="text-slate-400">
                Monitor and manage database tables and schema
              </p>
            </div>
          </div>

          {/* Database Status */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Database className="h-5 w-5" />
                Database Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {stats.status === 'connected' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                )}
                <span className="text-white font-medium">
                  {stats.status === 'connected' ? 'MongoDB Connected' : 'Using JSON Fallback'}
                </span>
                <Badge variant={stats.status === 'connected' ? 'default' : 'secondary'}>
                  {stats.status === 'connected' ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tables Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Table className="h-8 w-8 text-blue-500" />
                  <Badge variant="outline" className="text-slate-400 border-slate-600">
                    Table
                  </Badge>
                </div>
                <h3 className="text-white font-bold mb-1">Plots</h3>
                <p className="text-2xl font-bold text-blue-400 mb-1">{stats.plots.count}</p>
                <p className="text-slate-400 text-sm">Size: {stats.plots.size}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-green-500" />
                  <Badge variant="outline" className="text-slate-400 border-slate-600">
                    Table
                  </Badge>
                </div>
                <h3 className="text-white font-bold mb-1">Users</h3>
                <p className="text-2xl font-bold text-green-400 mb-1">{stats.users.count}</p>
                <p className="text-slate-400 text-sm">Size: {stats.users.size}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="h-8 w-8 text-purple-500" />
                  <Badge variant="outline" className="text-slate-400 border-slate-600">
                    Table
                  </Badge>
                </div>
                <h3 className="text-white font-bold mb-1">Inquiries</h3>
                <p className="text-2xl font-bold text-purple-400 mb-1">{stats.inquiries.count}</p>
                <p className="text-slate-400 text-sm">Size: {stats.inquiries.size}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="h-8 w-8 text-orange-500" />
                  <Badge variant="outline" className="text-slate-400 border-slate-600">
                    Table
                  </Badge>
                </div>
                <h3 className="text-white font-bold mb-1">Registrations</h3>
                <p className="text-2xl font-bold text-orange-400 mb-1">{stats.registrations.count}</p>
                <p className="text-slate-400 text-sm">Size: {stats.registrations.size}</p>
              </CardContent>
            </Card>
          </div>

          {/* Database Actions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Database Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Backup Database
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Optimize Tables
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  View Schema
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Storage Summary */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Storage Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Total Database Size</span>
                  <span className="text-white font-bold">{stats.totalSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Storage Type</span>
                  <span className="text-white font-bold">
                    {stats.status === 'connected' ? 'MongoDB Atlas' : 'JSON Files'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Last Backup</span>
                  <span className="text-slate-400">Never</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}