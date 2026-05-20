'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { User, Mail, Phone, StickyNote, Send, MessageCircle } from 'lucide-react';

export default function RegistrationForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await fetch('/api/registrations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    phone: phone.trim(),
                    notes: notes.trim(),
                }),
            });
        } catch (error) {
            console.error('Error saving registration lead:', error);
        }

        const message = `Hello Sri Swamy Goud,\n\nI'm interested in AS Trusted Consultancy.\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Requirements:* ${notes || 'None'}\n\nPlease share the property investment details.`;
        const whatsappUrl = `https://wa.me/919866404090?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="overflow-hidden border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-bold text-slate-500 ml-1">FULL NAME</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="pl-12 h-14 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-cyan-500 font-medium" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-slate-500 ml-1">EMAIL ADDRESS</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-12 h-14 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-cyan-500 font-medium" required />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-bold text-slate-500 ml-1">PHONE NUMBER</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 00000 00000" className="pl-12 h-14 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-cyan-500 font-medium" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-bold text-slate-500 ml-1">REQUIREMENTS (OPTIONAL)</Label>
                            <div className="relative">
                                <StickyNote className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tell us about your budget or preferred location..." className="pl-12 min-h-[120px] bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-cyan-500 font-medium resize-none pt-4" />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                    <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white h-16 rounded-2xl text-xl font-black shadow-xl shadow-green-500/20 active:scale-95 transition-all">
                        <MessageCircle className="mr-3 h-7 w-7" />
                        CONNECT VIA WHATSAPP
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
