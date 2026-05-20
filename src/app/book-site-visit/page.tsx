'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  CheckCircle,
  Users,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BookSiteVisitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to MongoDB so no booking is ever lost
      await fetch('/api/site-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error('Failed to save site visit to DB:', err);
      // Continue even if DB save fails — WhatsApp is the backup
    }

    // 2. Also send WhatsApp notification
    const message = `🏗️ *Site Visit Request*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Preferred Date:* ${formData.preferredDate}\n*Preferred Time:* ${formData.preferredTime}\n*Location:* ${formData.location}\n*Message:* ${formData.message}\n\nPlease confirm the site visit details. Thank you!`;
    window.open(`https://wa.me/919866404090?text=${encodeURIComponent(message)}`, '_blank');

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        <Header />
        <div className="container px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-black font-headline mb-4">
                  Site Visit Requested!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Thank you for your interest! We've received your site visit request and will contact you shortly to confirm the details.
                </p>
                <div className="space-y-3 text-left bg-primary/5 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span>WhatsApp message sent to +91 98664 04090</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Expected response time: Within 2 hours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>You'll receive a confirmation call</span>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push('/properties')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Properties
                  </Button>
                  <Button 
                    onClick={() => window.open(`https://wa.me/919866404090`, '_blank')}
                    variant="outline"
                    className="border-primary/20"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      
      <div className="container px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 mb-4">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-600">Book Site Visit</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mb-4">
              Schedule Your <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">Site Visit</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Visit our premium plot locations and see the investment potential firsthand. 
              Our team will guide you through the property and answer all your questions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold font-headline flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-primary" />
                    Visit Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name *</label>
                        <Input
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          className="border-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number *</label>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          className="border-primary/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="border-primary/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Preferred Date *</label>
                        <Input
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                          required
                          className="border-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Preferred Time *</label>
                        <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                          <SelectTrigger className="border-primary/20">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</SelectItem>
                            <SelectItem value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</SelectItem>
                            <SelectItem value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</SelectItem>
                            <SelectItem value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preferred Location *</label>
                      <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                        <SelectTrigger className="border-primary/20">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kamareddy">Kamareddy</SelectItem>
                          <SelectItem value="hyderabad">Hyderabad</SelectItem>
                          <SelectItem value="sangareddy">Sangareddy</SelectItem>
                          <SelectItem value="siddipet">Siddipet</SelectItem>
                          <SelectItem value="multiple">Multiple Locations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Additional Message</label>
                      <Textarea
                        placeholder="Any specific requirements or questions..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={4}
                        className="border-primary/20"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-500/90 hover:to-blue-500/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Site Visit
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold font-headline mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">+91 98664 04090</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">WhatsApp</div>
                        <div className="text-sm text-muted-foreground">Available 24/7</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Response Time</div>
                        <div className="text-sm text-muted-foreground">Within 2 hours</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What to Expect */}
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold font-headline mb-4">What to Expect</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Property Tour</div>
                        <div className="text-sm text-muted-foreground">Complete site walkthrough</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Investment Analysis</div>
                        <div className="text-sm text-muted-foreground">ROI projections and growth potential</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Legal Documentation</div>
                        <div className="text-sm text-muted-foreground">DTCP approvals and paperwork</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Q&A Session</div>
                        <div className="text-sm text-muted-foreground">All your questions answered</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Locations */}
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold font-headline mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Popular Locations
                  </h3>
                  <div className="space-y-2">
                    <Badge variant="outline" className="border-primary/20">Kamareddy Industrial Area</Badge>
                    <Badge variant="outline" className="border-primary/20">Hyderabad Corridor</Badge>
                    <Badge variant="outline" className="border-primary/20">Sangareddy Highway</Badge>
                    <Badge variant="outline" className="border-primary/20">Siddipet Development Zone</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
