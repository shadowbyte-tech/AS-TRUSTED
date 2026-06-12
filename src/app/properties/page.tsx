import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Building2, MapPinned, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Properties | AS Trusted Consultancy',
  description: 'Browse verified land, plot, and property categories with clear guidance on what each listing type means.',
};

const categories = [
  {
    title: 'Normal Properties',
    text: 'Public listings with basic details, location context, and the most important facts a buyer needs before shortlisting.',
    href: '/normal-properties',
    icon: Building2,
  },
  {
    title: 'Plots',
    text: 'Open plots and layout options for long-term land investors who want location-driven appreciation potential.',
    href: '/plots',
    icon: MapPinned,
  },
  {
    title: 'Premium Properties',
    text: 'Private listings and curated opportunities that require account access so we can keep the full details organized.',
    href: '/premium-properties',
    icon: Sparkles,
  },
];

export default function PropertiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <section className="container px-4 md:px-6">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="space-y-4 text-center">
              <Badge className="mx-auto bg-gold/10 text-gold border-gold/20">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Property Categories
              </Badge>
              <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl">
                Start with the right property category
              </h1>
              <p className="mx-auto max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                Instead of sending visitors to a blank redirect, this page helps them understand where each listing type lives and what to expect before they browse.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.title} className="border-border/60 bg-card/80 shadow-sm">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                      <category.icon className="h-6 w-6" />
                    </div>
                    <h2 className="mb-2 text-xl font-bold">{category.title}</h2>
                    <p className="mb-6 flex-1 text-sm leading-6 text-muted-foreground">{category.text}</p>
                    <Button asChild className="mt-auto bg-gold text-black hover:bg-gold/90">
                      <Link href={category.href} className="flex items-center gap-2">
                        View listings
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-gold/10 bg-gradient-to-r from-gold/5 via-background to-background">
              <CardContent className="grid gap-6 p-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                <div>
                  <h2 className="text-2xl font-bold">Need help choosing?</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    If you are unsure whether to start with plots, premium listings, or public property categories, the Services and Trust Center pages explain how we review and present properties.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                  <Button asChild variant="outline" className="border-border/70">
                    <Link href="/trust-center">Trust Center</Link>
                  </Button>
                  <Button asChild className="bg-gold text-black hover:bg-gold/90">
                    <Link href="/services">Services</Link>
                  </Button>
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
