'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
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
import { Shield, CheckCircle, XCircle, RefreshCw, UserPlus, Key, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  _id?: string;
  email: string;
  role: 'User' | 'Owner' | 'Premium' | 'Elite';
  blocked?: boolean;
  blockedAt?: string;
  createdAt?: string;
  lastLogin?: string;
  passwordHash?: string;
}

interface PasswordStrengthResult {
  isValid: boolean;
  strength: string;
  score: number;
  feedback: string[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'User' | 'Premium' | 'Elite' | 'Owner'>('User');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthResult | null>(null);
  const [creating, setCreating] = useState(false);
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false);
  const [selectedUserForRoleChange, setSelectedUserForRoleChange] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<'User' | 'Premium' | 'Elite' | 'Owner'>('User');
  // Password reset dialog state
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedUserForPasswordReset, setSelectedUserForPasswordReset] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);
  const [isBlocking, setIsBlocking] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server error (${response.status}). Please try again later.`);
      }
      if (response.ok) {
        const json = await response.json();
        const rawUsers = json.success && Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
        const usersArray = rawUsers.map((user: any) => ({
          ...user,
          id: user.id || user._id,
        }));
        setUsers(usersArray);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load users');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Validate password strength
  const validatePasswordStrength = (password: string): PasswordStrengthResult => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push("Password should be at least 8 characters long");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("Include lowercase letters");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("Include uppercase letters");

    if (/\d/.test(password)) score += 1;
    else feedback.push("Include numbers");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push("Include special characters");

    let strength = "Very Weak";
    if (score >= 4) strength = "Very Strong";
    else if (score >= 3) strength = "Good";
    else if (score >= 2) strength = "Fair";
    else if (score >= 1) strength = "Weak";

    return {
      isValid: score >= 3,
      strength,
      score,
      feedback
    };
  };

  // Handle password change
  useEffect(() => {
    if (newUserPassword) {
      const strength = validatePasswordStrength(newUserPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, [newUserPassword]);

  // Change Role – now expects user ID
  const handleChangeRole = async (userId: string, currentRole: string) => {
    setSelectedUserForRoleChange(userId);
    setNewRole(currentRole as 'User' | 'Premium' | 'Elite' | 'Owner');
    setShowRoleChangeDialog(true);
  };

  // Confirm Role Change
  const handleConfirmRoleChange = async () => {
    if (!selectedUserForRoleChange) return;

    try {
      const response = await fetch('/api/owner/update-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        // The backend expects `userId` and `newRole`
        body: JSON.stringify({ userId: selectedUserForRoleChange, newRole: newRole }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success!",
          description: `User role updated to ${newRole}`,
        });
        
        setShowRoleChangeDialog(false);
        setSelectedUserForRoleChange(null);
        loadUsers();
      } else {
        toast({
          title: "Error",
          description: result.error || 'Failed to update user role',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  // Open Reset Password Dialog
  const openResetPasswordDialog = (userId: string) => {
    setSelectedUserForPasswordReset(userId);
    setNewPassword('');
    setShowResetDialog(true);
  };

  // Confirm Password Reset
  const handleConfirmPasswordReset = async () => {
    if (!selectedUserForPasswordReset) return;
    if (!newPassword || newPassword.length < 8) {
      toast({
        title: "Error",
        description: 'Password must be at least 8 characters.',
        variant: 'destructive',
      });
      return;
    }
    setResetting(true);
    try {
      const response = await fetch('/api/owner/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: selectedUserForPasswordReset, newPassword }),
      });
      const result = await response.json();
      if (result.success) {
        toast({ title: "Success!", description: result.message || 'Password reset successfully' });
        setShowResetDialog(false);
        setSelectedUserForPasswordReset(null);
        loadUsers();
      } else {
        toast({ title: "Error", description: result.error || 'Failed to reset password', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({ title: "Error", description: 'Failed to reset password', variant: 'destructive' });
    } finally {
      setResetting(false);
    }
  };

  // Block/Unblock User
  const handleBlockUser = async (userId: string, isCurrentlyBlocked: boolean) => {
    setIsBlocking(userId);
    try {
      const response = await fetch('/api/owner/block-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, blocked: !isCurrentlyBlocked }),
      });
      const result = await response.json();
      if (result.success) {
        toast({ title: "Success", description: result.message || 'User status updated' });
        loadUsers();
      } else {
        toast({ title: "Error", description: result.error || 'Failed to update user', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: "Error", description: 'Failed to update user status', variant: 'destructive' });
    } finally {
      setIsBlocking(null);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    setIsDeleting(userId);
    try {
      const response = await fetch('/api/owner/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();
      if (result.success) {
        toast({ title: "Success", description: 'User deleted successfully' });
        loadUsers();
      } else {
        toast({ title: "Error", description: result.error || 'Failed to delete user', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: "Error", description: 'Failed to delete user', variant: 'destructive' });
    } finally {
      setIsDeleting(null);
    }
  };

  // Get strength color
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Very Strong': return 'text-green-500';
      case 'Strong': return 'text-green-500';
      case 'Good': return 'text-blue-500';
      case 'Fair': return 'text-yellow-500';
      case 'Weak': return 'text-orange-500';
      case 'Very Weak': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'Very Strong':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Strong':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Good':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'Fair':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const handleCreateUser = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!newUserEmail || !newUserPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

      setCreating(true);

        try {
          const response = await fetch('/api/users/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              email: newUserEmail,
              password: newUserPassword,
              role: newUserRole,
            }),
          });

        const result = await response.json();

        if (result.success) {
          toast({
            title: "Success!",
            description: `User ${newUserEmail} created successfully`,
          });

          setShowCreateDialog(false);
          setNewUserEmail('');
          setNewUserPassword('');
          setNewUserRole('User');
          loadUsers();
        } else {
          toast({
            title: "Error",
            description: result.message || result.error || 'Failed to create user',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error creating user:', error);
        toast({
          title: "Error",
          description: 'Failed to create user',
          variant: 'destructive',
        });
      } finally {
        setCreating(false);
      }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with a secure password.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newUserEmail">Email Address</Label>
                  <input
                    id="newUserEmail"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newUserRole">Role</Label>
                  <Select value={newUserRole} onValueChange={(value: 'User' | 'Premium' | 'Elite' | 'Owner') => setNewUserRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Elite">Elite</SelectItem>
                      <SelectItem value="Owner">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newUserPassword">Password</Label>
                  <div className="relative">
                    <input
                      id="newUserPassword"
                      type={showPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="Enter password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="button" disabled={creating} onClick={handleCreateUser}>
                  {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  {creating ? 'Creating...' : 'Create User'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            onClick={() => loadUsers()}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* User List */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium truncate max-w-[200px] sm:max-w-none">{user.email}</p>
                    <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                    {user.passwordHash && (
                      <p className="text-xs text-amber-500 font-mono break-all mt-1">
                        Hash: {user.passwordHash}
                      </p>
                    )}
                    {user.blocked && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                        Blocked
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => openResetPasswordDialog(user.id)}
                  >
                    <Key className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  
                  {user.role !== 'Owner' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 sm:flex-none"
                        onClick={() => handleChangeRole(user.id, user.role)}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Role
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 sm:flex-none"
                        disabled={isBlocking === user.id}
                        onClick={() => handleBlockUser(user.id, !!user.blocked)}
                      >
                        {isBlocking === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />}
                        {user.blocked ? 'Unblock' : 'Block'}
                      </Button>

                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex-1 sm:flex-none"
                        disabled={isDeleting === user.id}
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        {isDeleting === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={showRoleChangeDialog} onOpenChange={setShowRoleChangeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select a new role for this user. This will change their access permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newRole} onValueChange={(value: 'User' | 'Premium' | 'Elite' | 'Owner') => setNewRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Elite">Elite</SelectItem>
                <SelectItem value="Owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleChangeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRoleChange}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              Enter a new password for the selected user. Minimum 8 characters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetPassword">New Password</Label>
              <input
                id="resetPassword"
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)} disabled={resetting}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPasswordReset} disabled={resetting}>
              {resetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
