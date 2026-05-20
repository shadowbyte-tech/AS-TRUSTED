// src/app/admin/page.tsx
import { Suspense } from 'react';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Home, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  Database,
  Activity
} from 'lucide-react';
import PropertyAnalyticsDashboard from '@/components/property-analytics-dashboard';
import { connectDB, User, Property, Inquiry, Lead } from '@/lib/models';

interface Stats {
  totalPlots: number;
  totalUsers: number;
  totalInquiries: number;
  totalRegistrations: number;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

async function getAdminStats(): Promise<Stats> {
  try {
    await connectDB();
    const [totalPlots, totalUsers, totalInquiries, totalRegistrations] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments({ role: { $ne: 'Owner' } }),
      Inquiry.countDocuments(),
      Lead.countDocuments(),
    ]);
    return {
      totalPlots,
      totalUsers,
      totalInquiries,
      totalRegistrations,
      recentActivity: [
        { type: 'plot', description: `${totalPlots} properties listed`, timestamp: new Date().toISOString() },
        { type: 'user', description: `${totalUsers} registered users`, timestamp: new Date().toISOString() },
        { type: 'inquiry', description: `${totalInquiries} inquiries received`, timestamp: new Date().toISOString() },
      ],
    };
  } catch (err) {
    console.error('Admin stats error:', err);
    return { totalPlots: 0, totalUsers: 0, totalInquiries: 0, totalRegistrations: 0, recentActivity: [] };
  }
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center mb-8 pt-4">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 font-outfit">
              Admin <span className="text-amber-500">Dashboard</span>
            </h1>
            <p className="text-slate-400">
              Complete platform management for AS Trusted Consultancy
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Plots" value={stats.totalPlots} icon={<Home className="h-8 w-8 text-blue-200" />} color="bg-blue-600" />
            <StatCard label="Total Users" value={stats.totalUsers} icon={<Users className="h-8 w-8 text-green-200" />} color="bg-green-600" />
            <StatCard label="Total Inquiries" value={stats.totalInquiries} icon={<MessageSquare className="h-8 w-8 text-purple-200" />} color="bg-purple-600" />
            <StatCard label="Registrations" value={stats.totalRegistrations} icon={<Calendar className="h-8 w-8 text-orange-200" />} color="bg-orange-600" />
          </div>

          {/* Property Analytics Dashboard - CLIENT COMPONENT */}
          <div className="mb-8" id="analytics-section">
            <PropertyAnalyticsDashboard />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard title="Manage Plots" desc="Add, edit, or delete listings" icon={<Home className="h-5 w-5" />} link="/dashboard" />
            <ActionCard title="User Management" desc="View accounts" icon={<Users className="h-5 w-5" />} link="/dashboard/users" variant="outline" />
            <ActionCard title="Inquiries" desc="Customer messages" icon={<MessageSquare className="h-5 w-5" />} link="/dashboard/inquiries" variant="outline" />
          </div>

          {/* Recent Activity */}
          <Card className="bg-slate-800/50 border-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-amber-500" />
                Live Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                      <span className="text-slate-100 text-sm font-medium">{activity.description}</span>
                    </div>
                    <Badge variant="secondary" className="bg-white/5 text-slate-400 border-white/10">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card 
      className={`${color} text-white border-0 shadow-xl shadow-black/20 hover:scale-[1.02] transition-transform`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-bold uppercase tracking-wider">{label}</p>
            <p className="text-4xl font-black mt-1">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function ActionCard({ title, desc, icon, link, variant = 'default' }: { title: string; desc: string; icon: React.ReactNode; link: string; variant?: 'default' | 'outline' }) {
  return (
    <Card 
      className="bg-slate-800/40 border-white/5 hover:bg-slate-800/60 transition-colors"
    >
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          {desc}
        </p>
        <Button asChild className="w-full" variant={variant}>
          <Link href={link}>Go to {title}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
