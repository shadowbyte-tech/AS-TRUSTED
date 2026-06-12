import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Lock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Premium Club | AS Trusted Consultancy',
  description: 'Learn what premium access includes and how to request investor portal access.',
};

const benefits = [
  'Early visibility into selected property opportunities.',
  'Private deal summaries and curated investment guidance.',
  'Priority support for site visits and documentation questions.',
  'A structured login workflow to keep premium materials organized.',
];

export default function PremiumClubPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        <section className="container px-4 md:px-6">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="space-y-4 text-center">
              <Badge className="mx-auto bg-gold/10 text-gold border-gold/20">
                <Crown className="mr-1 h-3.5 w-3.5" />
                Premium Access
              </Badge>
              <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl">
                Premium Club for serious investors
              </h1>
              <p className="mx-auto max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                This is the public explanation page for premium access. It gives visitors a clear idea of what premium membership includes before they request a login.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="border-gold/10 bg-gradient-to-br from-gold/5 via-card to-transparent">
                <CardContent className="space-y-6 p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">What premium members get</h2>
                      <p className="text-sm text-muted-foreground">Useful access, not just a locked page.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        <p className="text-sm leading-6 text-muted-foreground">{benefit}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 text-sm leading-6 text-muted-foreground">
                    Premium access is intended for qualified buyers, repeat visitors, and investors who want a more curated browsing experience.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/80">
                <CardContent className="space-y-6 p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                      <Lock className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">How to get access</h2>
                      <p className="text-sm text-muted-foreground">A simple path to the investor portal.</p>
                    </div>
                  </div>

                  <ol className="space-y-3 text-sm leading-6 text-muted-foreground">
                    <li className="rounded-2xl border border-border/60 bg-background/60 p-4">1. Create or update your user profile.</li>
                    <li className="rounded-2xl border border-border/60 bg-background/60 p-4">2. Speak with our team about the access level you need.</li>
                    <li className="rounded-2xl border border-border/60 bg-background/60 p-4">3. Log in to see premium resources and selected listings.</li>
                  </ol>

                  <Button asChild className="w-full bg-gold text-black hover:bg-gold/90">
                    <Link href="/user-login" className="flex items-center gap-2">
                      Go to Investor Login
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <p className="text-xs leading-5 text-muted-foreground">
                    If you are only browsing, the public pages and blog already include a lot of useful information about our market and process.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
