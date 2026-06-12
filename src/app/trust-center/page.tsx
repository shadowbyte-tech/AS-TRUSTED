import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, FileCheck, BookOpen, Users, MapPinned, Megaphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trust Center | AS Trusted Consultancy',
  description: 'How AS Trusted Consultancy verifies properties, publishes content, and protects user trust on the website.',
};

const principles = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    text: 'We publish properties only after title, approval, and location checks are completed by our team.',
  },
  {
    icon: FileCheck,
    title: 'Clear Disclosures',
    text: 'Property details, pricing guidance, and investment projections are presented with context and clear limitations.',
  },
  {
    icon: BookOpen,
    title: 'Educational Content',
    text: 'Our blog and guides focus on practical real-estate education rather than keyword stuffing or duplicated pages.',
  },
  {
    icon: Users,
    title: 'Human Support',
    text: 'We provide a real office address, direct phone support, and a consultation workflow for interested buyers.',
  },
];

const reviewSteps = [
  'We review ownership records and available title documents before a property is listed.',
  'We check the location, access road, surrounding development, and basic usability of the site.',
  'We verify whether the property has the appropriate local approvals or approvals in progress.',
  'We keep utility pages, admin pages, and account screens out of search indexes so crawlers focus on public content.',
];

export default function TrustCenterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <section className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-4 text-center">
              <Badge className="mx-auto bg-gold/10 text-gold border-gold/20">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Trust Center
              </Badge>
              <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl">
                How we protect buyers, readers, and the quality of our site
              </h1>
              <p className="mx-auto max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                AS Trusted Consultancy is built around a simple idea: useful property guidance should be clear, verifiable, and easy to understand.
                This page explains how we review content, how we handle listings, and how we keep public pages focused on real value.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {principles.map((item) => (
                <Card key={item.title} className="border-border/60 bg-card/80 shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h2 className="mb-2 text-xl font-bold">{item.title}</h2>
                    <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
              <Card className="border-gold/10 bg-gradient-to-br from-gold/5 via-card to-transparent">
                <CardContent className="space-y-6 p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                      <MapPinned className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Listing review workflow</h2>
                      <p className="text-sm text-muted-foreground">A quick look at the checks behind our public property pages.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {reviewSteps.map((step, index) => (
                      <div key={step} className="flex gap-4 rounded-2xl border border-border/60 bg-background/60 p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/80">
                <CardContent className="space-y-5 p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                      <Megaphone className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Ad and content policy</h2>
                      <p className="text-sm text-muted-foreground">What we do to keep monetized pages useful.</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                    <li>• AdSense only loads on public content pages that have editorial or informational value.</li>
                    <li>• Private portal pages, dashboards, and setup routes are marked `noindex`.</li>
                    <li>• Our sitemap focuses on public pages and blog posts so crawlers land on real content first.</li>
                    <li>• We separate service descriptions, legal pages, and listings so readers can find what they need quickly.</li>
                  </ul>
                  <Button asChild className="w-full bg-gold text-black hover:bg-gold/90">
                    <Link href="/blog">Read the blog</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/60 bg-card/80">
              <CardContent className="space-y-4 p-8">
                <h2 className="text-2xl font-bold">Contact information</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  We keep our contact details visible so buyers, partners, and reviewers can reach a real business representative.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
                    <a href="tel:+919866404090" className="mt-2 block font-semibold text-foreground hover:text-gold">
                      +91 98664 04090
                    </a>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                    <a href="mailto:swamygoud2775@gmail.com" className="mt-2 block font-semibold text-foreground hover:text-gold">
                      swamygoud2775@gmail.com
                    </a>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Office</p>
                    <p className="mt-2 font-semibold text-foreground">
                      Nizamsagar Rd, Vidhya Nagar Colony, Kamareddy, Telangana 503111
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
