
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createRegistration } from '@/lib/actions';
import type { Registration, State } from '@/lib/definitions';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, Loader2, User, Mail, Phone, StickyNote, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                </>
            ) : (
                <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Registration
                </>
            )}
        </Button>
    )
}

export default function RegistrationForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const initialState: State & { registration?: Registration | null } = { message: null, errors: {}, success: false, registration: null };
    const [state, dispatch] = useActionState(createRegistration, initialState);

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
        } else if (state.message && !state.success) {
            toast({
                title: 'Error',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);


    return (
        <form action={dispatch} ref={formRef}>
            <Card>
                <CardContent className="p-6 space-y-4">
                    {state.success && state.registration ? (
                        <div className="space-y-6">
                             <Alert variant="default" className="border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-400">
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Registration Submitted Successfully!</AlertTitle>
                                <AlertDescription>
                                    <p>Thank you for your interest in AS Trusted Consultancy. The owner has been notified and will contact you shortly with login details and investment opportunities.</p>
                                </AlertDescription>
                            </Alert>

                             <div className="p-4 rounded-lg bg-muted border">
                                <p className="text-sm font-semibold text-muted-foreground mb-4">📱 WhatsApp notification sent to owner:</p>
                                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/50 shadow-sm w-full max-w-sm mx-auto">
                                    <div className="flex items-start gap-2.5">
                                        <div className="flex-shrink-0 bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                                            <MessageCircle className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">🏠 New Registration Alert!</span>
                                            </div>
                                            <div className="flex flex-col leading-1.5 p-3 border-gray-200 bg-gray-50 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                                <p className="text-sm font-normal text-gray-900 dark:text-white">
                                                    Name: {state.registration.name}<br />
                                                    Phone: {state.registration.phone}<br />
                                                    Email: {state.registration.email}
                                                </p>
                                            </div>
                                             <div className="mt-2 space-y-2">
                                                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 w-full">
                                                    <a 
                                                        href={`https://wa.me/919866404090?text=${encodeURIComponent(`Hello Sri Swamy Goud from AS Trusted Consultancy,\n\nI'm interested in your property investment opportunities. Here are my details:\n\nName: ${state.registration.name}\nPhone: ${state.registration.phone}\nEmail: ${state.registration.email}\n\nPlease contact me with more information about available properties and investment options.`)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <MessageCircle className="mr-2 h-4 w-4" />
                                                        Contact Owner via WhatsApp
                                                    </a>
                                                </Button>
                                                <p className="text-xs text-muted-foreground text-center">
                                                    📞 Owner: +91 98664 04090
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Your Name</Label>
                                <Input id="name" name="name" placeholder="e.g., Jane Smith" required />
                                {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Your Email</Label>
                                <Input id="email" name="email" type="email" placeholder="e.g., jane.smith@example.com" required />
                                {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Your Phone Number</Label>
                                <Input id="phone" name="phone" type="tel" placeholder="e.g., +91 987 654 3210" required />
                                {state.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone[0]}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="flex items-center"><StickyNote className="mr-2 h-4 w-4 text-muted-foreground" />Additional Notes (Optional)</Label>
                                <Textarea id="notes" name="notes" placeholder="Tell us what you're looking for, e.g., budget, specific locations, etc." />
                                {state.errors?.notes && <p className="text-sm text-destructive">{state.errors.notes[0]}</p>}
                            </div>
                        </>
                    )}

                    {state.message && !state.success && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Submission Failed</AlertTitle>
                            <AlertDescription>{state.message}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                {(!state.success || !state.registration) && (
                     <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                )}
            </Card>
        </form>
    );
}
