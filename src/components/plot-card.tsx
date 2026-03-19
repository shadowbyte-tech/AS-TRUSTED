import type { Plot } from '@/lib/definitions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, Ruler, Compass, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { PlotStatusBadge } from './plot-status-badge';
import { PlotPriceDisplay } from './plot-price-display';

type PlotCardProps = {
  plot: Plot;
};

export default function PlotCard({ plot }: PlotCardProps) {
  return (
    <Link href={`/properties/${plot.id}`} className="group block">
      <Card className="glass overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-primary/10 hover:border-primary/30 group">
        <CardHeader className="p-0 relative h-64 overflow-hidden">
          <Image
            src={plot.imageUrl}
            alt={`Plot ${plot.plotNumber} in ${plot.villageName}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            data-ai-hint={plot.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-4 right-4 animate-reveal">
            <PlotStatusBadge status={plot.status || 'Available'} size="sm" />
          </div>
          {plot.price && (
            <div className="absolute bottom-4 left-4 glass dark:glass-dark px-3 py-1.5 rounded-full animate-fade-in-up">
              <PlotPriceDisplay price={plot.price} size="small" className="text-white dark:text-foreground" />
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold font-headline tracking-tight group-hover:text-primary transition-colors">
              Plot No: {plot.plotNumber}
            </CardTitle>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1.5 text-accent" />
              <span className="text-sm font-medium">{plot.areaName}, {plot.villageName}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2 border-y border-primary/5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/5 text-primary">
                <Ruler className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Size</span>
                <span className="text-xs font-semibold">{plot.plotSize}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Compass className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Facing</span>
                <span className="text-xs font-semibold">{plot.plotFacing}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-primary/5 flex justify-between items-center group-hover:bg-primary/10 transition-colors gap-3">
          <Button asChild size="sm" variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5 text-primary font-bold text-[10px] uppercase tracking-wider">
            <Link href="/book-site-visit">Book Site Visit</Link>
          </Button>
          <div className="flex items-center text-sm font-bold text-primary transition-transform duration-500">
            EXPLORE <ArrowRight className="ml-2 h-4 w-4 animate-bounce-horizontal" />
          </div>
        </CardFooter>

      </Card>
    </Link>
  );
}
