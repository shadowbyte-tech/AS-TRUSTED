
'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  MapPin, 
  IndianRupee, 
  Square, 
  Trees, 
  Home, 
  Building,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';

interface PropertySearchFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export default function PropertySearchFilters({ onFiltersChange }: PropertySearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = () => {
    onFiltersChange({
      searchTerm,
      propertyType,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setPropertyType('all');
    setPriceRange([0, 10000000]);
    onFiltersChange({});
  };

  return (
    <Card className="border-primary/10 bg-white/50 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by location, plot no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-white/80 border-primary/10 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-lg"
            />
          </div>
          
          <div className="w-full md:w-64">
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-14 bg-white/80 border-primary/10 rounded-2xl text-lg">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-primary/10 shadow-2xl">
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="Plot">
                  <div className="flex items-center gap-2">
                    <Trees className="h-4 w-4" /> Plots
                  </div>
                </SelectItem>
                <SelectItem value="House">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" /> Houses
                  </div>
                </SelectItem>
                <SelectItem value="Land">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" /> Land
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleApply}
            className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/20 text-lg font-bold"
          >
            Find Properties
          </Button>
        </div>

        {isExpanded && (
          <div className="pt-6 border-t border-primary/5 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="space-y-4">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <IndianRupee className="h-4 w-4" /> Price Range (₹)
              </label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={50000000}
                  step={100000}
                  className="py-4"
                />
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>₹{(priceRange[0] / 100000).toFixed(1)}L</span>
                <span>₹{(priceRange[1] / 10000000).toFixed(1)}Cr</span>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1 h-12 rounded-xl border-primary/10 hover:bg-primary/5 font-bold"
              >
                Reset All
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary font-bold gap-2 hover:bg-primary/5 rounded-full px-6"
          >
            {isExpanded ? 'Fewer Filters' : 'More Filters'}
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
