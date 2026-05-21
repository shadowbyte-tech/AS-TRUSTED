'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MessageSquare } from 'lucide-react';
import type { Property } from '@/lib/definitions';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export default function InquiryModal({ isOpen, onClose, property }: InquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(`I am interested in ${property.propertyType} ${property.propertyNumber} located at ${property.villageName}, ${property.areaName}. Please provide more details.`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      toast({ title: 'Error', description: 'Please fill out all fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plotNumber: property.propertyNumber,
          name,
          email,
          phone,
          message
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({ title: 'Success', description: 'Your inquiry has been saved. Redirecting to WhatsApp...' });
        
        // Form the WhatsApp message
        const whatsappMessage = `*New Inquiry*\nName: ${name}\nPhone: ${phone}\nProperty: ${property.propertyNumber} (${property.propertyType})\nLocation: ${property.villageName}\n\nMessage: ${message}`;
        const whatsappUrl = `https://wa.me/919866404090?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        onClose();
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to submit inquiry', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit inquiry. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md glass border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline text-primary">Inquire About This Property</DialogTitle>
          <DialogDescription>
            Enter your details so our team can follow up with you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <input
              id="phone"
              type="tel"
              required
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              required
              rows={3}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? 'Processing...' : 'Continue to WhatsApp'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
