
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function UserLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    
    
    // Call the actual auth context login method
    const result = await login(email, password);

    

    if (result.success && (result as any).user) {
      toast({
        title: 'Login Successful',
        description: 'Welcome! Taking you to available properties...',
      });
      
      // Use router.push (client-side nav) — preserves React/AuthProvider state
      const role = (result as any).user?.role?.toLowerCase();
      if (role === 'owner') {
        router.push('/dashboard');
      } else if (role === 'premium' || role === 'elite') {
        router.push('/premium-properties');
      } else {
        router.push('/normal-properties');
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result.error || 'Invalid email or password. Please try again.',
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="on">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Enter your credentials to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="user-email" 
                type="email" 
                placeholder="user@email.com" 
                required 
                className="pl-10" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-password">Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="user-password"
                type="password"
                placeholder="••••••••"
                required
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : 'Sign In'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
