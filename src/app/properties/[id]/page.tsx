'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SimpleHeader } from '@/components/simple-header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  IndianRupee,
  Share2,
  Heart,
  Phone,
  Mail,
  Building,
  Home,
  Trees,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Clock,
  Info
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Image from 'next/image';
import PropertyAIAdvisor from '@/components/property-ai-advisor';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  villageName: string;
  areaName: string;
  description: string;
  category: string;
  status: string;
  images: string[];
  propertyType: string;
  plotSize?: string;
  houseSize?: string;
  landSize?: string;
  bedrooms?: number;
  bathrooms?: number;
  featured?: boolean;
  postedAt: string;
  owner?: {
    name: string;
    email: string;
    phone: string;
  };
}

// ── PREMIUM ANIMATIONS ──────────────────────────────────────────
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const propertyId = params.id as string;

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${propertyId}`);
      
      if (response.ok) {
        const data = await response.json();
        const propertyData = data.property || data;
        setProperty(propertyData);
      } else if (response.status === 404) {
        toast({
          variant: 'destructive',
          title: 'Property Not Found',
          description: 'The property you are looking for does not exist.',
        });
        router.push('/properties');
      } else {
        throw new Error('Failed to fetch property details');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load property details.',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'plot': return <Trees className="h-5 w-5" />;
      case 'house': return <Home className="h-5 w-5" />;
      case 'land': return <MapPin className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  const handleContactOwner = () => {
    // Use actual owner phone number
    const phoneNumber = property?.owner?.phone || "9866404090";
    
    toast({
      title: 'Owner Contact Information',
      description: `📞 Phone: ${phoneNumber}`,
      className: "bg-slate-900 text-white border-cyan-500/30 backdrop-blur-xl shadow-2xl"
    });
    
    // Also copy phone number to clipboard
    navigator.clipboard.writeText(phoneNumber);
  };

  const handleSendMessage = () => {
    // Use actual owner phone number
    const phoneNumber = property?.owner?.phone || "9866404090";
    const message = `Hi! I'm interested in your property: ${property?.title || 'this plot'}. Located at ${property?.location || ''}, ${property?.villageName || ''}. Price: ${formatPrice(property?.price || 0)}. Please provide more details.`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareProperty = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Property link has been copied to clipboard.',
        className: "bg-slate-900 text-white border-cyan-500/30 backdrop-blur-xl"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#03070f] items-center justify-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-cyan-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-r-4 border-l-4 border-purple-500 animate-spin-slow"></div>
          </div>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-cyan-400 font-bold tracking-widest uppercase text-sm mt-8 animate-pulse"
        >
          Loading Premium Assets...
        </motion.p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen bg-[#03070f]">
        <SimpleHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-slate-900/50 backdrop-blur-xl p-10 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4">Property Not Found</h1>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We couldn't locate the property details you're looking for. It might have been sold or removed.
            </p>
            <Button 
              onClick={() => router.push('/premium-dashboard')}
              className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-6 rounded-xl font-bold transition-all hover:scale-105"
            >
              Back to Properties
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-[#03070f] text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-200">
      <SimpleHeader />

      <main className="relative">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        {/* Header Section */}
        <div className="relative z-10 border-b border-white/5 bg-slate-900/20 backdrop-blur-md">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="ghost"
                onClick={() => router.push('/premium-dashboard')}
                className="mb-8 hover:bg-white/5 text-slate-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Collection
              </Button>
            </motion.div>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-400">
                    {getPropertyIcon(property.propertyType)}
                  </div>
                  <Badge variant="outline" className="px-4 py-1.5 rounded-full border-cyan-500/30 bg-cyan-500/5 text-cyan-400 font-bold tracking-wide uppercase text-[10px]">
                    {property.propertyType}
                  </Badge>
                  {property.category === 'Premium' && (
                    <Badge className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black border-0 uppercase text-[10px] shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                      Premium Listing
                    </Badge>
                  )}
                  <Badge variant="outline" className={`px-4 py-1.5 rounded-full uppercase text-[10px] font-bold ${
                    property.status === 'Available' 
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' 
                      : 'border-red-500/30 bg-red-500/5 text-red-400'
                  }`}>
                    {property.status}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                  {property.title}
                </h1>
                
                <div className="flex flex-wrap items-center text-slate-400 text-lg gap-4">
                  <div className="flex items-center group cursor-pointer">
                    <MapPin className="h-5 w-5 mr-2 text-cyan-500 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-slate-200">{property.location}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4 bg-white/10 hidden sm:block" />
                  <span>{property.villageName}</span>
                  <Separator orientation="vertical" className="h-4 bg-white/10 hidden sm:block" />
                  <span>{property.areaName}</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-start lg:items-end gap-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-sm font-bold text-cyan-400/60 uppercase tracking-[0.2em] mb-1">Price Guide</div>
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
                  {formatPrice(property.price)}
                </div>
                <div className="flex items-center gap-2 text-slate-500 mt-2">
                  <Clock className="h-4 w-4" />
                  <span>Listed {formatPostedDate(property.postedAt)}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column - 8/12 */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Premium Image Gallery */}
              <motion.div 
                {...fadeIn}
                className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-black/40"
              >
                {property.images && property.images.length > 0 ? (
                  <div className="relative aspect-[16/10] sm:aspect-video overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={property.images[currentImageIndex]}
                          alt={property.title}
                          fill
                          priority
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Navigation Buttons */}
                    {property.images.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage}
                          className="absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button 
                          onClick={nextImage}
                          className="absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                        
                        {/* Indicators */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/10">
                          {property.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === currentImageIndex 
                                  ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' 
                                  : 'w-1.5 bg-white/30 hover:bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute top-6 right-6 px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center gap-4">
                    <Building className="h-20 w-20 text-slate-800 animate-pulse" />
                    <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Visuals Unavailable</p>
                  </div>
                )}
              </motion.div>

              {/* Specs Grid */}
              <motion.div 
                {...staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { icon: <Square />, label: 'Plot Size', val: property.plotSize },
                  { icon: <Home />, label: 'Built Area', val: property.houseSize },
                  { icon: <Trees />, label: 'Total Land', val: property.landSize },
                  { icon: <Bed />, label: 'Lifestyle', val: property.bedrooms ? `${property.bedrooms} Bed` : null },
                ].filter(s => s.val).map((spec, i) => (
                  <motion.div 
                    key={i}
                    variants={fadeIn}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-6 rounded-[1.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 flex flex-col gap-3 group transition-all"
                  >
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                      {spec.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{spec.label}</div>
                      <div className="text-lg font-bold text-white">{spec.val}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* AI Property Advisor */}
              <motion.div {...fadeIn}>
                <PropertyAIAdvisor property={property} />
              </motion.div>

              {/* Description Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="rounded-[2.5rem] overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-white/5 to-transparent p-10 border-b border-white/5">
                    <CardTitle className="text-3xl font-black text-white">Luxury Overview</CardTitle>
                    <CardDescription className="text-cyan-500/60 font-medium uppercase tracking-[0.2em] text-[10px] mt-2">Executive Summary</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-xl font-medium">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Specifications Detail */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5">
                  <CardHeader className="p-10 border-b border-white/5">
                    <CardTitle className="text-2xl font-black text-white flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Info className="h-5 w-5 text-emerald-400" />
                      </div>
                      Technical Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {[
                         { icon: <Square className="h-5 w-5" />, label: "Plot Area", value: property.plotSize, color: "text-blue-400", bg: "bg-blue-400/10" },
                         { icon: <Home className="h-5 w-5" />, label: "Living Space", value: property.houseSize, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                         { icon: <Trees className="h-5 w-5" />, label: "Outdoor/Land", value: property.landSize, color: "text-amber-400", bg: "bg-amber-400/10" },
                         { icon: <Bed className="h-5 w-5" />, label: "Sanitary/Bath", value: property.bathrooms ? `${property.bathrooms} Units` : null, color: "text-pink-400", bg: "bg-pink-400/10" }
                       ].filter(x => x.value).map((item, i) => (
                         <div key={i} className="flex items-center gap-6 group">
                            <div className={`h-14 w-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center transition-all group-hover:scale-110 shadow-lg`}>
                              {item.icon}
                            </div>
                            <div>
                               <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.label}</div>
                               <div className="text-xl font-bold text-white tracking-tight">{item.value}</div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Sidebar (4/12) */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-28 space-y-8">
                
                {/* Contact Card - PREMIUM */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900 to-black border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    <div className="h-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600" />
                    <CardHeader className="p-8 pb-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                          <Phone className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-black text-white">Concierge</CardTitle>
                          <CardDescription className="text-slate-400">Direct Property Access</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-4">
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Interested in a private viewing or need detailed investment insights? Our advisors are ready to help.
                      </p>
                      
                      <Button 
                        onClick={handleContactOwner} 
                        className="w-full bg-white text-black hover:bg-slate-200 h-16 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] shadow-xl group"
                      >
                        <Phone className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                        Call Representative
                      </Button>
                      
                      <Button 
                        onClick={handleSendMessage} 
                        variant="outline" 
                        className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 h-16 rounded-2xl font-black text-lg transition-all group"
                      >
                        <MessageCircle className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                        WhatsApp Inquire
                      </Button>
                      
                      <div className="pt-6 flex justify-center">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>Typically responds in &lt; 1 hour</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <Button 
                    variant="outline" 
                    onClick={handleShareProperty}
                    className="flex-1 rounded-2xl h-16 border-white/5 bg-slate-900/40 text-slate-300 font-bold hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                    <Share2 className="h-4 w-4 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-[10px] uppercase tracking-widest">Share</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex-1 rounded-2xl h-16 border-white/5 bg-slate-900/40 font-bold hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-1 group ${isLiked ? 'text-red-500 bg-red-500/5' : 'text-slate-300'}`}
                  >
                    <Heart className={`h-4 w-4 transition-all ${isLiked ? 'fill-red-500 scale-110' : 'group-hover:text-red-400'}`} />
                    <span className="text-[10px] uppercase tracking-widest">{isLiked ? 'Saved' : 'Save'}</span>
                  </Button>
                </motion.div>

                {/* Location Insight */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card className="rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 overflow-hidden">
                    <div className="h-40 relative">
                       <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                          <MapPin className="h-10 w-10 text-slate-700" />
                       </div>
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                       <div className="absolute bottom-4 left-6">
                         <Badge className="bg-cyan-500 text-black font-black uppercase text-[9px] border-0">Geographic Insight</Badge>
                       </div>
                    </div>
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-white">{property.location}</div>
                        <div className="text-slate-400 font-bold opacity-80 uppercase tracking-widest text-xs">
                          {property.villageName} • {property.areaName}
                        </div>
                      </div>
                      <Separator className="bg-white/5" />
                      <div className="flex items-center gap-4 text-emerald-400">
                         <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-sm font-bold uppercase tracking-widest">High Growth Zone</span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Strategically located in one of Kamareddy's fastest-appreciating development corridors.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
