'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, KeyRound, Loader2, Mail, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CreateUserFormSimple() {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear errors for this field
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const response = await fetch('/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Success!',
                    description: 'User created successfully.',
                });
                // Reset form
                setFormData({ email: '', password: '' });
                // Redirect to users list
                router.push('/dashboard/users');
            } else {
                setErrors(data.errors || {});
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: data.message || 'Failed to create user',
                });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Network error. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                 <CardHeader>
                    <CardTitle>User Credentials</CardTitle>
                    <CardDescription>
                        Set the email and password for the new user. They can use these to sign in to view plots.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="pl-10"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email[0]}</p>
                        )}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="pl-10"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password[0]}</p>
                        )}
                    </div>

                    {errors.general && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errors.general[0]}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating User...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Create User Account
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
