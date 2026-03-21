
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
import { AlertCircle, Loader2, User, Mail, Phone, StickyNote, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full h-12 text-lg font-bold shadow-lg active:scale-[0.98] transition-all">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    <Send className="mr-2 h-5 w-5" />
                    Submit Registration
                </>
            )}
        </Button>
    )
}

export default function RegistrationForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const initialState: State = { message: null, errors: {}, success: false, registration: null };
    const [state, dispatch] = useActionState(createRegistration, initialState);

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
        } else if (state.message && !state.success) {
            toast({
                title: 'Submission Update',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    return (
        <form action={dispatch} ref={formRef}>
            <Card className="overflow-hidden border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardContent className="p-8 space-y-6">
                    {state.success ? (
                        <div className="space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-2xl">
                                <CheckCircle2 className="h-8 w-8" />
                                <div className="ml-4">
                                    <AlertTitle className="text-2xl font-black mb-2">Registration Successful!</AlertTitle>
                                    <AlertDescription className="text-lg font-medium opacity-90">
                                        {state.message || "Welcome to the elite circle. Your inquiry has been prioritized."}
                                    </AlertDescription>
                                </div>
                            </Alert>

                            {state.registration && (
                                <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -mr-16 -mt-16"></div>
                                    
                                    <div className="flex items-center gap-6 relative">
                                        <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                            <User className="h-8 w-8 text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-cyan-400/60 uppercase tracking-[0.2em] mb-1">REGISTERED CLIENT</p>
                                            <p className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent capitalize">
                                                {state.registration.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 relative">
                                        <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 h-16 rounded-2xl text-xl font-black shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                                            <a 
                                                href={`https://wa.me/919866404090?text=${encodeURIComponent(`Hello Sri Swamy Goud,\n\nI've just registered on AS Trusted Consultancy.\n\nName: ${state.registration.name}\nPhone: ${state.registration.phone}\n\nPlease share the property investment details.`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MessageCircle className="mr-3 h-7 w-7" />
                                                CONNECT NOW
                                            </a>
                                        </Button>
                                        
                                        <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-sm tracking-wider">
                                            <Phone className="h-4 w-4" />
                                            DIRECT: +91 98664 04090
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-bold text-slate-500 ml-1">FULL NAME</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input id="name" name="name" placeholder="Enter your full name" className="pl-12 h-14 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-cyan-500 font-medium" required />
                                </div>
                                {state.errors?.name && <p className="text-xs font-bold text-red-500 ml-1">{state.errors.name[0]}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-bold text-slate-500 ml-1">EMAIL ADDRESS</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-12 h-14 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-cyan-500 font-medium" required />
                                </div>
                                {state.errors?.email && <p className="text-xs font-bold text-red-500 ml-1">{state.errors.email[0]}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-bold text-slate-500 ml-1">PHONE NUMBER</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input id="phone" name="phone" type="tel" placeholder="+91 00000 00000" className="pl-12 h-14 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-cyan-500 font-medium" required />
                                </div>
                                {state.errors?.phone && <p className="text-xs font-bold text-red-500 ml-1">{state.errors.phone[0]}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-bold text-slate-500 ml-1">REQUIREMENTS (OPTIONAL)</Label>
                                <div className="relative">
                                    <StickyNote className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                    <Textarea id="notes" name="notes" placeholder="Tell us about your budget or preferred location..." className="pl-12 min-h-[120px] bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-cyan-500 font-medium resize-none pt-4" />
                                </div>
                                {state.errors?.notes && <p className="text-xs font-bold text-red-500 ml-1">{state.errors.notes[0]}</p>}
                            </div>
                        </div>
                    )}

                    {state.message && !state.success && (
                        <Alert variant="destructive" className="rounded-xl border-red-500/20 bg-red-500/10">
                            <AlertCircle className="h-5 w-5" />
                            <AlertTitle className="font-bold">Submission Update</AlertTitle>
                            <AlertDescription className="font-medium">{state.message}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                {(!state.success || !state.registration) && (
                     <CardFooter className="p-8 pt-0">
                        <SubmitButton />
                    </CardFooter>
                )}
            </Card>
        </form>
    );
}
