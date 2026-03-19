'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MessageSquare, ArrowRight, Crown } from 'lucide-react';
import WhatsAppRegistration from './whatsapp-registration';
import { toast } from '@/hooks/use-toast';

export default function PremiumRegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'I want to become a premium member and access exclusive land investment opportunities.'
  });
  
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Store registration data
      const registrationData = {
        ...formData,
        timestamp: new Date().toISOString(),
        type: 'premium_registration'
      };

      // Save to localStorage for tracking
      localStorage.setItem('premiumRegistration', JSON.stringify(registrationData));

      toast({
        title: 'Registration Submitted!',
        description: 'Your details have been captured. Click "Send via WhatsApp" to contact the owner.',
      });

      // Show WhatsApp modal
      setShowWhatsApp(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit registration. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="relative overflow-hidden border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-primary">Premium Registration</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Register for premium access and get immediate response from the owner via WhatsApp.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                required
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleTextAreaChange}
                placeholder="Tell us why you want to join premium..."
                rows={4}
                className="w-full h-24 px-4 py-2 border border-input bg-background rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold h-12"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white/30 border-t-transparent animate-spin rounded-full" />
                  Processing...
                </>
              ) : (
                <>
                  Register for Premium
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Crown className="h-3 w-3 mr-1" />
              Instant WhatsApp Connection
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              After registration, you'll connect directly with the owner for immediate premium activation
            </p>
          </div>
        </CardContent>
      </Card>

      <WhatsAppRegistration 
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        userData={formData}
      />
    </>
  );
}
