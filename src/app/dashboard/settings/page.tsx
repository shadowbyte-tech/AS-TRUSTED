
'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  KeyRound, 
  Palette, 
  Bell, 
  Shield, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  CreditCard, 
  Download, 
  Trash2, 
  Crown,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
    const { toast } = useToast();
    const { user, updateUser } = useAuth();
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        location: user?.location || ''
    });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    
    const handleProfileUpdate = async () => {
        setIsUpdatingProfile(true);
        try {
            const response = await fetch('/api/auth/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            const result = await response.json();

            if (result.success) {
                // Update local auth context
                updateUser(result.user);
                toast({
                    title: "Profile Updated!",
                    description: "Your profile has been updated successfully.",
                });
            } else {
                toast({
                    title: "Error",
                    description: result.error || 'Failed to update profile',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: "Error",
                description: 'Failed to update profile',
                variant: 'destructive',
            });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleProfileInputChange = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        sms: false,
        marketing: false
    });
    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        showEmail: false,
        showPhone: false,
        twoFactor: false
    });
    const [preferences, setPreferences] = useState({
        language: 'en',
        timezone: 'UTC',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY'
    });

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toast({
                title: 'Error',
                description: 'New passwords do not match.',
                variant: 'destructive',
            });
            return;
        }
        if (passwords.new.length < 6) {
             toast({
                title: 'Error',
                description: 'Password must be at least 6 characters long.',
                variant: 'destructive',
            });
            return;
        }
        
        toast({
            title: 'Success!',
            description: 'Your password has been changed (simulated).',
        });
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const handleNotificationChange = (key: string, value: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: value }));
        toast({
            title: 'Settings Updated',
            description: `Notification preferences updated.`,
        });
    };

    const handlePrivacyChange = (key: string, value: boolean) => {
        setPrivacy(prev => ({ ...prev, [key]: value }));
        toast({
            title: 'Settings Updated',
            description: `Privacy settings updated.`,
        });
    };

    const handlePreferenceChange = (key: string, value: string) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
        toast({
            title: 'Settings Updated',
            description: `Preferences updated.`,
        });
    };

  return (
      <div className="space-y-8 max-w-4xl">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 rounded-lg" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-primary to-accent">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                {user?.role === 'Premium' && <Crown className="h-3 w-3 mr-1 text-yellow-500" />}
                {user?.role} Account
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your premium account settings, security, and preferences.
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <Card className="relative overflow-hidden border border-border shadow-md bg-card">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-foreground">
              <div className="p-2 rounded-full bg-gradient-to-r from-primary to-accent">
                <User className="h-4 w-4 text-white" />
              </div>
              Profile Information
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Update your personal information and contact details.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/90">Full Name</Label>
                <Input 
                  placeholder="John Doe" 
                  value={profileData.name}
                  onChange={(e) => handleProfileInputChange('name', e.target.value)}
                  className="bg-background border-input text-foreground" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/90">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="pl-10 bg-background border-input text-foreground" 
                    value={user?.email}
                    readOnly
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/90">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="tel" 
                    placeholder="+1 234 567 8900" 
                    value={profileData.phone}
                    onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                    className="pl-10 bg-background border-input text-foreground" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/90">Location</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="City, Country" 
                    value={profileData.location}
                    onChange={(e) => handleProfileInputChange('location', e.target.value)}
                    className="pl-10 bg-background border-input text-foreground" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="relative z-10">
            <Button 
              onClick={handleProfileUpdate}
              disabled={isUpdatingProfile}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
            >
              {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
            </Button>
          </CardFooter>
        </Card>

        {/* Security Settings */}
        <Card className="relative overflow-hidden border border-border shadow-md bg-card">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-foreground">
              <div className="p-2 rounded-full bg-gradient-to-r from-primary to-accent">
                <Lock className="h-4 w-4 text-white" />
              </div>
              Security Settings
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your password and security preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground/90">Current Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="currentPassword" 
                      type={showPasswords.current ? "text" : "password"} 
                      placeholder="••••••••" 
                      required 
                      className="pl-10 pr-10 bg-background border-input text-foreground" 
                      value={passwords.current} 
                      onChange={e => setPasswords({...passwords, current: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/90">New Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="newPassword" 
                      type={showPasswords.new ? "text" : "password"} 
                      placeholder="••••••••" 
                      required 
                      className="pl-10 pr-10 bg-background border-input text-foreground" 
                      value={passwords.new} 
                      onChange={e => setPasswords({...passwords, new: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/90">Confirm New Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="confirmPassword" 
                      type={showPasswords.confirm ? "text" : "password"} 
                      placeholder="••••••••" 
                      required 
                      className="pl-10 pr-10 bg-background border-input text-foreground" 
                      value={passwords.confirm} 
                      onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <Button type="submit" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                Update Password
              </Button>
            </form>
            
            <Separator className="bg-border" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center text-foreground">
                  <Smartphone className="mr-2 h-4 w-4 text-primary" />
                  Two-Factor Authentication
                </Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch 
                checked={privacy.twoFactor}
                onCheckedChange={(checked) => handlePrivacyChange('twoFactor', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="relative overflow-hidden border border-border shadow-md bg-card">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-foreground">
              <div className="p-2 rounded-full bg-gradient-to-r from-primary to-accent">
                <Bell className="h-4 w-4 text-white" />
              </div>
              Notification Preferences
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Control how and when you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center text-foreground">
                  <Mail className="mr-2 h-4 w-4 text-primary" />
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive updates and alerts via email</p>
              </div>
              <Switch 
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center text-foreground">
                  <Smartphone className="mr-2 h-4 w-4 text-primary" />
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Get instant updates on your device</p>
              </div>
              <Switch 
                checked={notifications.push}
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center text-foreground">
                  <Phone className="mr-2 h-4 w-4 text-primary" />
                  SMS Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive text message alerts</p>
              </div>
              <Switch 
                checked={notifications.sms}
                onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center text-foreground">
                  <CreditCard className="mr-2 h-4 w-4 text-primary" />
                  Marketing Communications
                </Label>
                <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
              </div>
              <Switch 
                checked={notifications.marketing}
                onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="relative overflow-hidden border border-border shadow-md bg-card">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-foreground">
              <div className="p-2 rounded-full bg-gradient-to-r from-primary to-accent">
                <Palette className="h-4 w-4 text-white" />
              </div>
              Appearance & Preferences
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Customize the look and feel of your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/90">Language</Label>
                <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                  <SelectTrigger className="bg-background border-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/90">Timezone</Label>
                <Select value={preferences.timezone} onValueChange={(value) => handlePreferenceChange('timezone', value)}>
                  <SelectTrigger className="bg-background border-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="IST">India Standard Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/90">Currency</Label>
                <Select value={preferences.currency} onValueChange={(value) => handlePreferenceChange('currency', value)}>
                  <SelectTrigger className="bg-background border-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/90">Date Format</Label>
                <Select value={preferences.dateFormat} onValueChange={(value) => handlePreferenceChange('dateFormat', value)}>
                  <SelectTrigger className="bg-background border-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator className="bg-border" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center text-foreground">
                  <Moon className="mr-2 h-4 w-4 text-primary" />
                  Theme
                </Label>
                <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="relative overflow-hidden border border-red-500/20 shadow-md bg-red-500/5">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2 rounded-full bg-gradient-to-r from-red-500 to-red-600">
                <Trash2 className="h-4 w-4 text-white" />
              </div>
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-500 dark:text-red-300">
              Irreversible actions that affect your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5 gap-4">
              <div>
                <h4 className="font-semibold text-red-600 dark:text-red-400">Delete Account</h4>
                <p className="text-sm text-red-500 dark:text-red-300">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                Delete Account
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-orange-500/20 bg-orange-500/5 gap-4">
              <div>
                <h4 className="font-semibold text-orange-600 dark:text-orange-400">Export Data</h4>
                <p className="text-sm text-orange-500 dark:text-orange-300">Download all your personal data</p>
              </div>
              <Button variant="outline" className="border-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
  );
}
