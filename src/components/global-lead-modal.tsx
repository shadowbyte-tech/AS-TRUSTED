'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ASLogo } from '@/components/as-logo';

export default function GlobalLeadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we've already captured this lead or if they dismissed it recently
    const hasCaptured = localStorage.getItem('as_trusted_lead_captured');
    
    if (!hasCaptured) {
      // Show the popup 3 seconds after they visit the website
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    setIsSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          phone, 
          source: 'Global Website Popup',
          goal: 'General Inquiry'
        })
      });
      
      localStorage.setItem('as_trusted_lead_captured', 'true');
      setIsOpen(false);
      
      toast({
        title: "Welcome to AS Trusted!",
        description: "Our experts will get in touch with you shortly.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // If they close it without submitting, don't ask again for this session
      sessionStorage.setItem('as_trusted_lead_dismissed', 'true');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl glass border-primary/20 p-0 overflow-hidden mx-auto">
        <div className="bg-gradient-to-r from-primary/20 to-amber-500/20 p-6 flex flex-col items-center justify-center border-b border-primary/10">
          <ASLogo className="h-12 w-12 text-primary mb-2" />
          <DialogTitle className="text-2xl font-headline text-center">Welcome to AS Trusted</DialogTitle>
          <DialogDescription className="text-center text-foreground/80 mt-1">
            Unlock exclusive property deals and early-bird access to premium plots. <br/>
            <span className="font-bold text-rose-500 mt-2 inline-block">Only for the first 2000 users!</span>
          </DialogDescription>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="global-name">Full Name</Label>
            <Input 
              id="global-name" 
              placeholder="Enter your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="global-phone">Phone Number</Label>
            <Input 
              id="global-phone" 
              type="tel"
              placeholder="e.g. 9876543210" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 mt-2 font-bold" 
            disabled={isSubmitting || !name || !phone}
          >
            {isSubmitting ? 'Saving...' : 'Unlock VIP Access for Free'}
          </Button>
          
          <p className="text-[10px] text-center text-muted-foreground mt-4">
            By continuing, you agree to receive property updates from AS Trusted Consultancy.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
