
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Mail, Loader2, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getPostLoginPath } from '@/lib/roles';

type FormMode = 'login' | 'register';

export default function UserLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<FormMode>('login');
  
  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'login') {
      const result = await login(email, password);

      if (result.success && (result as any).user) {
        toast({
          title: 'Login Successful',
          description: 'Welcome! Taking you to available properties...',
        });
        
        router.push(getPostLoginPath((result as any).user));
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: result.error || 'Invalid email or password. Please try again.',
        });
      }
      setIsLoading(false);
    } else {
      // Register mode
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          toast({
            title: 'Account Created Successfully!',
            description: 'Logging you in now...',
          });

          // Auto-login
          const loginResult = await login(email, password);
          if (loginResult.success) {
            router.push('/normal-properties');
          } else {
            setMode('login');
          }
        } else {
          toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: result.error || result.message || 'Failed to create account.',
          });
        }
      } catch (err) {
        console.error('Registration failed:', err);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Network error. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="on">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</CardTitle>
          <CardDescription>
            {mode === 'login'
              ? 'Enter your credentials to continue.'
              : 'Sign up to access exclusive property details.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="user-name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="user-name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="user-email">Email Address</Label>
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
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'login' ? 'Signing In...' : 'Registering...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Register'
            )}
          </Button>

          <Button
            type="button"
            variant="link"
            className="text-xs text-muted-foreground"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setName('');
            }}
          >
            {mode === 'login'
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
