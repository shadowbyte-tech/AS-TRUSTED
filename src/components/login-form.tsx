
'use client';

import React, { useState } from 'react';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, ArrowLeft, KeyRound, LockKeyhole, Mail, ShieldQuestion } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ASLogo } from './as-logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getPostLoginPath } from '@/lib/roles';

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

    try {
      // Use the auth context login function
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: 'Login Successful',
          description: 'Redirecting to dashboard...',
        });
        
        router.push(getPostLoginPath(result.user));
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: result.error || 'Invalid email or password. Please try again.',
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
                    <CardHeader className="space-y-3 px-6 pt-6 text-center sm:px-8">
                        <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
                        <CardDescription className="text-zinc-400">Enter and confirm your new password.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 sm:px-8">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-zinc-200">New Password</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <Input 
                                    id="newPassword" 
                                    type="password" 
                                    placeholder="Enter new password" 
                                    required 
                                    className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-zinc-500 focus-visible:ring-amber-400/30" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-zinc-200">Confirm New Password</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <Input 
                                    id="confirmPassword" 
                                    type="password" 
                                    placeholder="Confirm new password" 
                                    required 
                                    className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-zinc-500 focus-visible:ring-amber-400/30" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-4 px-6 pb-6 sm:px-8">
                        <Button type="submit" className="h-12 w-full rounded-xl bg-amber-500 font-bold text-black hover:bg-amber-400">
                            Set New Password
                        </Button>
                         <Button variant="ghost" type="button" onClick={() => setView('manual')} className="h-auto p-0 text-sm text-zinc-400 hover:bg-transparent hover:text-amber-200">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Login
                        </Button>
                    </CardFooter>
                </form>
            );
        case 'forgot-password':
            return (
                 <form onSubmit={handleSecurityQuestionSubmit}>
                    <CardHeader className="items-center space-y-4 px-6 pt-6 text-center sm:px-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-black/50 shadow-lg shadow-amber-500/5">
                            <ASLogo className="h-12 w-12" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold text-white">Password Recovery</CardTitle>
                            <CardDescription className="text-zinc-400">
                                Enter your email and answer the security question to reset your password.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 sm:px-8">
                        <div className="space-y-2">
                            <Label htmlFor="resetEmail" className="text-zinc-200">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <Input
                                    id="resetEmail"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-zinc-500 focus-visible:ring-amber-400/30"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="securityQuestion" className="text-zinc-200">Who is your favorite person?</Label>
                            <div className="relative">
                                <ShieldQuestion className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <Input 
                                    id="securityQuestion" 
                                    type="text" 
                                    placeholder="Enter your answer" 
                                    required 
                                    className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-zinc-500 focus-visible:ring-amber-400/30" 
                                    value={securityAnswer}
                                    onChange={(e) => setSecurityAnswer(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-4 px-6 pb-6 sm:px-8">
                        <Button type="submit" className="h-12 w-full rounded-xl bg-amber-500 font-bold text-black hover:bg-amber-400">
                            Submit Answer
                        </Button>
                        <Button variant="ghost" type="button" onClick={() => setView('manual')} className="h-auto p-0 text-sm text-zinc-400 hover:bg-transparent hover:text-amber-200">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Login
                        </Button>
                    </CardFooter>
                </form>
            );
        case 'manual':
        default:
             return (
                 <form onSubmit={handleManualLogin} autoComplete="off">
                    <CardHeader className="items-center space-y-4 px-6 pt-6 text-center sm:px-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-black/50 shadow-lg shadow-amber-500/5">
                            <ASLogo className="h-12 w-12" />
                        </div>
                        <div className="space-y-2">
                            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-400/15 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
                                <LockKeyhole className="h-3.5 w-3.5" />
                                Secure Owner Login
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight text-white">
                                Executive Portal
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Enter your credentials to access the owner dashboard.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 sm:px-8">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="font-medium text-zinc-200">Email Address</Label>
                        <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="Enter your email address" 
                            required 
                            className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-zinc-500 focus-visible:ring-amber-400/30" 
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
                        <Label htmlFor="password" className="font-medium text-zinc-200">Password</Label>
                        <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            required
                            className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-zinc-500 focus-visible:ring-amber-400/30"
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
                    <CardFooter className="flex-col gap-4 px-6 pb-6 sm:px-8">
                        {lockoutInfo?.locked && (
                            <Alert className="w-full border-red-400/20 bg-red-500/10 text-red-100">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Account temporarily locked due to multiple failed login attempts. 
                                    Please try again in {Math.ceil((lockoutInfo.remainingTime || 0) / 60)} minutes.
                                </AlertDescription>
                            </Alert>
                        )}
                        <Button 
                            type="submit" 
                            className="h-12 w-full rounded-xl bg-amber-500 font-bold text-black shadow-lg shadow-amber-500/15 transition-all duration-300 hover:bg-amber-400 hover:shadow-amber-500/25"
                            disabled={isLoading || lockoutInfo?.locked}
                        >
                            {isLoading ? 'Authenticating...' : 'Access Executive Portal'}
                        </Button>
                         <Button variant="ghost" type="button" disabled className="h-auto p-0 text-sm text-zinc-500">
                            Password reset requires owner support
                        </Button>
                    </CardFooter>
                </form>
            );
    }
  }

  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
        {renderContent()}
    </Card>
  );
}
