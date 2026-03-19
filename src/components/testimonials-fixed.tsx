'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, TrendingUp, Calendar, Quote, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  investment: string;
  roi: string;
  timeline: string;
  testimonial: string;
  photo: string;
  plotNumber: string;
  investmentDate: string;
  currentValue: string;
}

// Generate avatar placeholder with initials
const AvatarPlaceholder = ({ name, size = 48 }: { name: string; size?: number }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
  const colorIndex = name.charCodeAt(0) % colors.length;
  
  return (
    <div 
      className={`${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-bold`}
      style={{ width: size, height: size, fontSize: size / 3 }}
    >
      {initials}
    </div>
  );
};

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ravi Kumar',
    location: 'Hyderabad, Telangana',
    investment: '₹15 Lakhs',
    roi: '82%',
    timeline: '3 years',
    testimonial: 'I invested in Kamareddy land through AS Trusted Consultancy in 2021. Today my investment is worth ₹27.3 Lakhs. The team provided excellent legal verification and market insights that helped me make the right decision.',
    photo: '/testimonials/ravi-kumar.jpg',
    plotNumber: 'Plot #A-42',
    investmentDate: 'March 2021',
    currentValue: '₹27.3 Lakhs'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    location: 'Bangalore, Karnataka',
    investment: '₹20 Lakhs',
    roi: '75%',
    timeline: '2.5 years',
    testimonial: 'As a first-time land investor, I was nervous about the process. The AS Trusted team guided me through every step and ensured complete legal compliance. My investment has grown to ₹35 Lakhs, and I\'m planning my next investment with them.',
    photo: '/testimonials/priya-sharma.jpg',
    plotNumber: 'Plot #B-18',
    investmentDate: 'September 2021',
    currentValue: '₹35 Lakhs'
  },
  {
    id: '3',
    name: 'Arjun Reddy',
    location: 'Delhi, NCR',
    investment: '₹25 Lakhs',
    roi: '88%',
    timeline: '3 years',
    testimonial: 'The ROI projections were conservative - I actually achieved 88% returns! The team\'s market intelligence and infrastructure analysis helped me identify the best plots before the prices skyrocketed. Truly professional service.',
    photo: '/testimonials/arjun-reddy.jpg',
    plotNumber: 'Plot #C-07',
    investmentDate: 'January 2021',
    currentValue: '₹47 Lakhs'
  },
  {
    id: '4',
    name: 'Sneha Patel',
    location: 'Mumbai, Maharashtra',
    investment: '₹12 Lakhs',
    roi: '71%',
    timeline: '2 years',
    testimonial: 'I invested in DTCP approved plots through AS Trusted and the documentation was flawless. The team handled everything from title verification to registration. My investment has grown to ₹20.5 Lakhs in just 2 years.',
    photo: '/testimonials/sneha-patel.jpg',
    plotNumber: 'Plot #D-33',
    investmentDate: 'June 2022',
    currentValue: '₹20.5 Lakhs'
  },
  {
    id: '5',
    name: 'Mahesh Kumar',
    location: 'Chennai, Tamil Nadu',
    investment: '₹18 Lakhs',
    roi: '79%',
    timeline: '2.5 years',
    testimonial: 'The team at AS Trusted Consultancy has deep knowledge of the Telangana real estate market. They identified emerging locations before others and my investment in Kamareddy has grown to ₹32.2 Lakhs. Excellent service and support.',
    photo: '/testimonials/mahesh-kumar.jpg',
    plotNumber: 'Plot #E-15',
    investmentDate: 'August 2021',
    currentValue: '₹32.2 Lakhs'
  }
];

// Image component with fallback
const SafeImage = ({ src, alt, className, fallbackSize = 48 }: { src: string; alt: string; className?: string; fallbackSize?: number }) => {
  const [hasError, setHasError] = useState(false);
  const name = alt;

  if (hasError) {
    return <AvatarPlaceholder name={name} size={fallbackSize} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default function Testimonials() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-500/10 via-background to-emerald-500/5">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 mb-4">
            <Star className="h-3 w-3 mr-1" />
            Real Success Stories
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">
            Client <span className="text-emerald-600">Testimonials</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from our satisfied investors who have achieved exceptional returns through strategic land investments
          </p>
        </div>

        {/* Featured Testimonial */}
        {selectedTestimonial ? (
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/30 shadow-2xl">
              <CardContent className="p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <SafeImage
                        src={selectedTestimonial.photo}
                        alt={selectedTestimonial.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-emerald-200"
                        fallbackSize={80}
                      />
                      <div>
                        <h3 className="text-2xl font-bold">{selectedTestimonial.name}</h3>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {selectedTestimonial.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Investment</p>
                          <p className="text-xl font-bold text-primary">{selectedTestimonial.investment}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">ROI</p>
                          <p className="text-xl font-bold text-emerald-500">{selectedTestimonial.roi}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Timeline</p>
                          <p className="text-xl font-bold text-purple-500">{selectedTestimonial.timeline}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-5 h-5 text-amber-500 fill-current" />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">5.0/5 Rating</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-emerald-500" />
                      <p className="text-lg leading-relaxed italic text-muted-foreground pl-8">
                        "{selectedTestimonial.testimonial}"
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg border border-emerald-200">
                        <p className="text-sm text-muted-foreground">Plot Number</p>
                        <p className="font-bold text-emerald-600">{selectedTestimonial.plotNumber}</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-emerald-200">
                        <p className="text-sm text-muted-foreground">Investment Date</p>
                        <p className="font-bold text-emerald-600">{selectedTestimonial.investmentDate}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-lg border border-emerald-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Value</p>
                          <p className="text-2xl font-bold text-emerald-600">{selectedTestimonial.currentValue}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button variant="outline" onClick={() => setSelectedTestimonial(null)}>
                    Back to All Testimonials
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card 
                key={testimonial.id}
                className="group hover:scale-[1.02] transition-all duration-500 cursor-pointer border border-emerald-500/20 hover:border-emerald-500/40"
                onClick={() => setSelectedTestimonial(testimonial)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <SafeImage
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200"
                        fallbackSize={48}
                      />
                      <div>
                        <h3 className="font-bold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-amber-500 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Investment:</span>
                      <span className="font-bold text-primary">{testimonial.investment}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ROI:</span>
                      <span className="font-bold text-emerald-500">{testimonial.roi}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Timeline:</span>
                      <span className="font-bold text-purple-500">{testimonial.timeline}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      "{testimonial.testimonial}"
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{testimonial.plotNumber}</span>
                      <span className="text-xs text-emerald-600 font-medium">View Details →</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl border border-emerald-500/20">
            <div className="text-2xl font-black text-emerald-500">79%</div>
            <p className="text-sm text-muted-foreground">Average ROI</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
            <div className="text-2xl font-black text-primary">2.5</div>
            <p className="text-sm text-muted-foreground">Years Average</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/20">
            <div className="text-2xl font-black text-purple-500">100%</div>
            <p className="text-sm text-muted-foreground">Satisfaction</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl border border-amber-500/20">
            <div className="text-2xl font-black text-amber-500">5.0</div>
            <p className="text-sm text-muted-foreground">Star Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
