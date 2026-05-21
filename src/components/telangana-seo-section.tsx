import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, ShieldCheck, Map } from 'lucide-react';

export default function TelanganaSeoSection() {
  const reasons = [
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Explosive Growth",
      desc: "Kamareddy and the NH-44 corridor are experiencing massive infrastructure development, driving land values up consistently year-over-year."
    },
    {
      icon: <Map className="h-6 w-6 text-primary" />,
      title: "Regional Ring Road (RRR)",
      desc: "Proximity to the upcoming RRR means properties here are perfectly positioned for future commercial and residential demand."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "DTCP Approved & Legal",
      desc: "We ensure every plot is 100% legally verified, DTCP approved, and clear-titled, eliminating investment risks."
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Strategic Location",
      desc: "Easy highway access to Hyderabad and Nizamabad makes this the prime sweet spot for weekend homes and high-ROI investments."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-headline text-foreground px-2">
            Why Invest in <span className="text-primary">Telangana Real Estate?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-base md:text-lg px-2">
            Discover why smart investors are securing plots in Kamareddy, Hyderabad Highway, and Nizamabad routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full glass border-primary/10 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    {reason.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{reason.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {reason.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 prose prose-base md:prose-lg dark:prose-invert max-w-4xl mx-auto px-2">
          <h3 className="text-xl md:text-2xl font-bold font-headline">The Kamareddy Investment Advantage</h3>
          <p>
            Kamareddy is rapidly emerging as the premier destination for strategic land investments in Telangana. With the expansion of <strong>NH-44 (Hyderabad-Nagpur Highway)</strong> and the impending execution of the <strong>Regional Ring Road (RRR)</strong>, connectivity to Hyderabad has never been better.
          </p>
          <p>
            For investors, this means the opportunity to purchase <em>open plots, villa plots, and farm lands</em> at competitive rates before the impending price boom. Whether you're looking for a short-term flip, a generational wealth-building asset, or a serene spot for a weekend farmhouse, AS Trusted Consultancy offers a curated selection of properties tailored to your goals.
          </p>
        </div>
      </div>
    </section>
  );
}
