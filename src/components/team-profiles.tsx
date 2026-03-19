'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Mail, Phone, Star, Award, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  experience: number;
  email: string;
  phone: string;
  location: string;
  education: string;
  achievements: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: 'swamy-goud',
    name: 'Sri Swamy Goud',
    role: 'Founder & CEO',
    photo: '', // Use placeholder
    bio: 'With over 15 years of experience in real estate investment and land development, Sri Swamy Goud has established AS Trusted Consultancy as a premium land investment advisory firm. He specializes in identifying high-potential locations before market recognition.',
    experience: 15,
    email: 'swamy@as-trusted.com',
    phone: '+91 98664 04090',
    location: 'Kamareddy, Telangana',
    education: 'B.E. Civil Engineering, Osmania University',
    achievements: ['Successfully developed 47+ premium plots', '80% average ROI for clients', 'DTCP approved projects']
  },
  {
    id: 'mani',
    name: 'Mani',
    role: 'Website Creator',
    photo: '', // Use placeholder
    bio: 'Contact him if you have any issue. Mani is the website creator and technical expert responsible for developing and maintaining the AS Trusted Consultancy platform.',
    experience: 8,
    email: 'sukkamanikantagoud',
    phone: '8008990902',
    location: 'Hyderabad, Telangana',
    education: 'MBA Real Estate Management, IIM Bangalore',
    achievements: ['₹50L+ total investments managed', '15% average ROI', '100% legal compliance']
  }
];

export default function TeamProfiles() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 mb-4">
            <Users className="h-3 w-3 mr-1" />
            Meet Our Team
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">
            Expert <span className="text-primary">Leadership</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our team of seasoned professionals brings decades of combined experience in real estate, law, finance, and market analysis.
          </p>
        </div>

        {/* Featured Team Member */}
        {selectedMember ? (
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/30 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  {selectedMember.photo ? (
                    <img
                      src={selectedMember.photo}
                      alt={selectedMember.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-amber-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-amber-200 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {selectedMember.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold font-headline">{selectedMember.name}</h3>
                  <p className="text-muted-foreground">{selectedMember.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedMember.bio}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      {selectedMember.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4 text-primary" />
                      {selectedMember.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-primary" />
                      {selectedMember.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-600">
                      {selectedMember.experience} years experience
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <Card 
                key={member.id}
                className="group hover:scale-[1.02] transition-all duration-500 cursor-pointer border border-primary/20 hover:border-primary/40"
                onClick={() => setSelectedMember(member)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-primary/200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full border-4 border-primary/200 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.experience} years experience</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
            <div className="text-2xl font-black text-primary">2</div>
            <p className="text-sm text-muted-foreground">Expert Team Members</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl border border-emerald-500/20">
            <div className="text-2xl font-black text-emerald-500">23+</div>
            <p className="text-sm text-muted-foreground">Combined Years Experience</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border-purple-500/20">
            <div className="text-2xl font-black text-purple-500">47+</div>
            <p className="text-sm text-muted-foreground">Premium Plots Listed</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl border-amber-500/20">
            <div className="text-2xl font-black text-amber-500">4.9/5</div>
            <p className="text-sm text-muted-foreground">Client Rating</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Ready to Invest in <span className="text-primary">Premium</span> Real Estate?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our exclusive network of HNI investors and access premium investment opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-16 px-12 rounded-full gold-shimmer font-black uppercase tracking-widest text-sm">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-12 rounded-full glass-2 border-primary/20 font-bold uppercase tracking-widest text-sm">
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
