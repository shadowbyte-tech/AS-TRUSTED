
'use client';

import React, { useState } from 'react';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Mail, ShieldQuestion, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ASLogo } from './as-logo';
import { Alert, AlertDescription } from '@/components/ui/alert';

type View = 'manual' | 'forgot-password' | 'reset-password';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [view, setView] = useState<View>('manual');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState<{ locked: boolean; remainingTime?: number } | null>(null);

  // State for manual login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLockoutInfo(null);

    // Use the main login endpoint
    const loginEndpoint = '/api/auth/login';
    
    try {
      // Ensure proper JSON formatting
      const loginData = {
        email: email.trim(),
        password: password
      };
      
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      

      if (response.ok && data.success) {
        toast({
          title: 'Login Successful',
          description: 'Redirecting to dashboard...',
        });
        
        // Redirect based on user role
        if (data.user?.role === 'Owner') {
          window.location.href = '/dashboard';
        } else if (data.user?.role === 'Premium') {
          window.location.href = '/premium-dashboard';
        } else {
          window.location.href = '/properties';
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: data.error || 'Invalid email or password. Please try again.',
        });
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Network error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityAnswer.toLowerCase() === 'mani') {
        toast({
            title: 'Success!',
            description: 'Security question answered correctly. Please reset your password.',
        });
        setView('reset-password');
    } else {
        toast({
            title: 'Incorrect Answer',
            description: 'The answer to the security question is not correct. Please try again.',
            variant: 'destructive',
        });
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
        toast({
            title: 'Passwords Mismatch',
            description: 'The new passwords do not match. Please try again.',
            variant: 'destructive',
        });
        return;
    }
    
    if (newPassword.length < 8) {
        toast({
            title: 'Password Too Short',
            description: 'Your new password must be at least 8 characters long.',
            variant: 'destructive',
        });
        return;
    }

    try {
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                securityAnswer: securityAnswer,
                newPassword: newPassword,
            }),
        });

        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        }

        if (response.ok && data?.success) {
            toast({
                title: 'Password Reset!',
                description: 'Your password has been successfully changed. Please log in with your new password.',
            });
            
            // Clear form and return to login
            setNewPassword('');
            setConfirmPassword('');
            setSecurityAnswer('');
            setView('manual');
        } else {
            const errorMessage = data?.error || `Reset Failed (${response.status}). Please try again.`;
            toast({
                title: 'Reset Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    } catch (error) {
        console.error('Password reset error:', error);
        toast({
            title: 'Error',
            description: 'An error occurred while resetting your password. Please try again.',
            variant: 'destructive',
        });
    }
  }

  const renderContent = () => {
    switch (view) {
        case 'reset-password':
            return (
                <form onSubmit={handlePasswordReset}>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>Enter and confirm your new password.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="newPassword" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    required 
                                    className="pl-10" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="confirmPassword" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    required 
                                    className="pl-10" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        <Button type="submit" className="w-full">
                            Set New Password
                        </Button>
                         <Button variant="link" type="button" onClick={() => setView('manual')} className="p-0 h-auto">
                            Back to Login
                        </Button>
                    </CardFooter>
                </form>
            );
        case 'forgot-password':
            return (
                 <form onSubmit={handleSecurityQuestionSubmit}>
                    <CardHeader className="items-center text-center space-y-4">
    <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-amber-500/20 rounded-full blur-xl"></div>
        <ASLogo className="h-16 w-16 mb-2 relative z-10" />
    </div>
    <div className="space-y-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent dark:from-white dark:to-purple-200">
            Password Recovery
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-purple-200/80">
            Enter your email and answer the security question to reset your password.
        </CardDescription>
    </div>
</CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="resetEmail">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="resetEmail"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder:text-purple-300/60 dark:focus:border-purple-400 dark:focus:ring-purple-400/20"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="securityQuestion">Who is your favorite person?</Label>
                            <div className="relative">
                                <ShieldQuestion className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="securityQuestion" 
                                    type="text" 
                                    placeholder="Enter your answer" 
                                    required 
                                    className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder:text-purple-300/60 dark:focus:border-purple-400 dark:focus:ring-purple-400/20" 
                                    value={securityAnswer}
                                    onChange={(e) => setSecurityAnswer(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        <Button type="submit" className="w-full">
                            Submit Answer
                        </Button>
                        <Button variant="link" type="button" onClick={() => setView('manual')} className="p-0 h-auto">
                            Back to Login
                        </Button>
                    </CardFooter>
                </form>
            );
        case 'manual':
        default:
             return (
                 <form onSubmit={handleManualLogin} autoComplete="off">
                    <CardHeader className="items-center text-center space-y-4">
    <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-amber-500/20 rounded-full blur-xl"></div>
        <ASLogo className="h-16 w-16 mb-2 relative z-10" />
    </div>
    <div className="space-y-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent dark:from-white dark:to-purple-200">
            Executive Portal Access
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-purple-200/80">
            Enter your credentials to access the administrative dashboard.
        </CardDescription>
    </div>
</CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="font-medium dark:text-purple-200">Email Address</Label>
                        <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-purple-300/60" />
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="Enter your email address" 
                            required 
                            className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder:text-purple-300/60 dark:focus:border-purple-400 dark:focus:ring-purple-400/20" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            autoComplete="off" 
                            autoCorrect="off" 
                            autoCapitalize="off" 
                            spellCheck="false" 
                        />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="font-medium dark:text-purple-200">Password</Label>
                        <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-purple-300/60" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            required
                            className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder:text-purple-300/60 dark:focus:border-purple-400 dark:focus:ring-purple-400/20"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                        />
                        </div>
                    </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        {lockoutInfo?.locked && (
                            <Alert className="w-full">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Account temporarily locked due to multiple failed login attempts. 
                                    Please try again in {Math.ceil((lockoutInfo.remainingTime || 0) / 60)} minutes.
                                </AlertDescription>
                            </Alert>
                        )}
                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 border-0"
                            disabled={isLoading || lockoutInfo?.locked}
                        >
                            {isLoading ? 'Authenticating...' : 'Access Executive Portal'}
                        </Button>
                         <Button variant="link" type="button" onClick={() => setView('forgot-password')} className="p-0 h-auto text-sm text-muted-foreground dark:text-purple-200/80 hover:text-foreground dark:hover:text-purple-200">
                            Forgot Password?
                        </Button>
                    </CardFooter>
                </form>
            );
    }
  }

  return (
    <Card className="w-full">
        {renderContent()}
    </Card>
  );
}
