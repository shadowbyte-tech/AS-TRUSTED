
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  UserPlus, 
  Key, 
  Loader2, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from 'lucide-react';
import { 
  validatePasswordStrength, 
  type PasswordStrengthResult 
} from '@/lib/enhanced-auth-client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  role: 'User' | 'Owner' | 'Premium';
  blocked?: boolean;
  blockedAt?: string;
  createdAt?: string;
  lastLogin?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'User' | 'Premium' | 'Owner'>('User');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthResult | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const usersData = await response.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handlePasswordChange = (password: string) => {
    setNewUserPassword(password);
    setPasswordStrength(password ? validatePasswordStrength(password) : null);
  };

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword) return;
    setCreating(true);
    try {
      const resp = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUserEmail, password: newUserPassword, role: newUserRole })
      });
      if (resp.ok) {
        toast({ title: "Success", description: "User created" });
        setShowCreateDialog(false);
        loadUsers();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create user", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    const newPassword = Math.random().toString(36).slice(-10);
    try {
      const resp = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      if (resp.ok) toast({ title: "Reset Success", description: `New password: ${newPassword}` });
    } catch (e) {
      toast({ title: "Error", description: "Reset failed", variant: "destructive" });
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const resp = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (resp.ok) loadUsers();
    } catch (e) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const getStrengthIcon = (strength: string) => {
    if (['Very Strong', 'Strong', 'Good'].includes(strength)) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStrengthColor = (strength: string) => {
    if (['Very Strong', 'Strong'].includes(strength)) return 'text-green-500';
    if (strength === 'Good') return 'text-blue-500';
    return 'text-yellow-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button><UserPlus className="mr-2 h-4 w-4" /> Create User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newUserRole} onValueChange={(value: any) => setNewUserRole(value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={newUserPassword} 
                    onChange={(e) => handlePasswordChange(e.target.value)} 
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {passwordStrength && (
                  <p className={`text-xs ${getStrengthColor(passwordStrength.strength)}`}>
                    {passwordStrength.strength} Password
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUser} disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div> :
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleResetPassword(user.email)}>Reset</Button>
                    {user.role !== 'Owner' && (
                      <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.email)} className="text-red-500">Delete</Button>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
