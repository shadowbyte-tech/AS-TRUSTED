
'use client';

import { useActionState, useEffect } from 'react';
import { createUserAction, type State } from '@/lib/user-actions';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, KeyRound, Loader2, Mail, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
         <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
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
    )
}


export default function CreateUserForm() {
    const { toast } = useToast();
    const router = useRouter();
    const initialState: State = { message: null, errors: {}, success: false };
    const [state, dispatch] = useActionState(createUserAction, initialState);

    useEffect(() => {
        if (state.success) {
            toast({
                title: 'Success!',
                description: 'User created successfully.',
            });
            // Redirect to the users list in the dashboard
            router.push('/dashboard/users');
        } else if (state.message) {
            toast({
                title: 'Error',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast, router]);

    return (
        <form action={dispatch}>
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
                                required
                                className="pl-10"
                            />
                        </div>
                        {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
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
                                required
                                className="pl-10"
                            />
                        </div>
                        {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
                    </div>

                    {state.message && !state.success && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.message}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </Card>
        </form>
    );
}
