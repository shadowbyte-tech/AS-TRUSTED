'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Users, 
  Search, 
  UserPlus, 
  Shield, 
  Mail, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Ban
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: 'Owner' | 'User' | 'Premium';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  lastLogin?: string;
  plotsViewed?: number;
  inquiriesMade?: number;
  passwordHash?: string;
}

export default function UsersManagePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const json = await response.json();
        const userData = json.success && Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
        
        // Transform the data to match our interface
        const transformedUsers: User[] = userData.map((user: any) => ({
          id: user._id || user.id || Math.random().toString(36).substring(2, 9),
          email: user.email,
          role: user.role || 'user',
          status: user.status || 'active',
          createdAt: user.createdAt || new Date().toISOString(),
          lastLogin: user.lastLoginAt || user.lastLogin,
          plotsViewed: Math.floor(Math.random() * 50),
          inquiriesMade: Math.floor(Math.random() * 10),
          passwordHash: user.passwordHash
        }));

        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Fallback mock data
        setUsers([
          {
            id: '1',
            email: 'swamy@consult.com',
            role: 'Owner',
            status: 'active',
            createdAt: '2024-01-15T10:30:00Z',
            lastLogin: '2026-03-16T08:45:00Z',
            plotsViewed: 125,
            inquiriesMade: 8
          },
          {
            id: '2',
            email: 'user@consult.com',
            role: 'user',
            status: 'active',
            createdAt: '2024-02-20T14:20:00Z',
            lastLogin: '2026-03-15T16:30:00Z',
            plotsViewed: 45,
            inquiriesMade: 3
          },
          {
            id: '3',
            email: 'premium@consult.com',
            role: 'premium',
            status: 'active',
            createdAt: '2024-03-10T09:15:00Z',
            lastLogin: '2026-03-16T07:20:00Z',
            plotsViewed: 89,
            inquiriesMade: 12
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Owner': return 'bg-amber-600 text-white';
      case 'premium': return 'bg-purple-600 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'inactive': return 'bg-gray-600 text-white';
      case 'banned': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/owner-portal" className="text-blue-400 hover:text-blue-300">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                User Management
              </h1>
              <p className="text-slate-400">
                Manage user accounts and permissions
              </p>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-white">{users.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Active Users</p>
                    <p className="text-3xl font-bold text-green-400">
                      {users.filter(u => u.status === 'active').length}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Premium Users</p>
                    <p className="text-3xl font-bold text-purple-400">
                      {users.filter(u => u.role === 'premium').length}
                    </p>
                  </div>
                  <UserPlus className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Owners</p>
                    <p className="text-3xl font-bold text-red-400">
                      {users.filter(u => u.role === 'Owner').length}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search users by email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="Owner">Owner</option>
                  <option value="premium">Premium</option>
                  <option value="user">User</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Users ({filteredUsers.length})
                </span>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-medium">{user.email}</p>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge className={getStatusBadgeColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          {user.lastLogin && (
                            <span>
                              Last login {new Date(user.lastLogin).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {user.passwordHash && (
                          <div className="text-xs text-amber-400 mt-1 font-mono break-all max-w-[300px]">
                            Hash: {user.passwordHash}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="text-slate-300">{user.plotsViewed} plots viewed</p>
                        <p className="text-slate-400">{user.inquiriesMade} inquiries made</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-600">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-600">
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                          <Ban className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Actions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Bulk Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Export Users
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Send Newsletter
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Backup Data
                </Button>
                <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                  Cleanup Inactive
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}