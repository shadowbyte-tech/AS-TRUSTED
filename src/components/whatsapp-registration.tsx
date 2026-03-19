'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CheckCircle, User, Mail, Phone } from 'lucide-react';

interface WhatsAppRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
}

export default function WhatsAppRegistration({ isOpen, onClose, userData }: WhatsAppRegistrationProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const ownerWhatsApp = "9866404090"; // Owner's WhatsApp number
  const registrationMessage = userData 
    ? `🎉 NEW PREMIUM REGISTRATION! 🎉\n\n👤 Name: ${userData.name}\n📧 Email: ${userData.email}\n📱 Phone: ${userData.phone}\n💬 Message: ${userData.message}\n\n🔐 Ready to activate premium access for this user!\n\nAS TRUSTED CONSULTANCY - Premium Land Investments`
    : "🏠 Interested in Premium Land Investment!\n\nI would like to learn more about exclusive property opportunities with AS TRUSTED CONSULTANCY.\n\nPlease send me details about premium membership benefits.";

  const whatsappURL = `https://wa.me/${ownerWhatsApp.replace('+', '')}?text=${encodeURIComponent(registrationMessage)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registrationMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-md bg-white border-emerald-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-primary/10 rounded-lg" />
        
        <CardHeader className="relative border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-emerald-600">Connect via WhatsApp</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {userData && (
            <div className="space-y-4 p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-600">Registration Details</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium text-foreground">{userData.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium text-foreground">{userData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium text-foreground">{userData.phone}</span>
                </div>
                {userData.message && (
                  <div className="mt-2">
                    <span className="text-muted-foreground">Message:</span>
                    <p className="mt-1 text-sm text-foreground italic">{userData.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Click below to send your information directly to the owner via WhatsApp for immediate premium activation.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.open(whatsappURL, '_blank')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                size="lg"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Send via WhatsApp
              </Button>
              
              <Button 
                variant="outline" 
                onClick={copyToClipboard}
                className="w-full border-emerald-500/30 hover:bg-emerald-500/10"
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Copy Message
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
                <MessageCircle className="h-3 w-3 mr-1" />
                Instant Response Guaranteed
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Owner will activate your premium access within 5 minutes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
