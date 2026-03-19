'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  TrendingUp, 
  Shield,
  Trees,
  Home,
  Building,
  Ruler,
  IndianRupee,
  Eye,
  Heart,
  Phone,
  MessageCircle,
  Bed,
  Bath,
  Layers,
  Car,
  Droplets,
  Lightbulb,
  Zap,
  Share2,
  Calendar,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePropertyView } from '@/hooks/use-property-view';
import type { Property } from '@/lib/definitions';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const idString = params.id as string;
    if (idString) {
      fetchProperty();
    }
  }, [params.id]);

  // Track property view
  usePropertyView(property?.id || '');

  const fetchProperty = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const propertiesResponse = await response.json();
        const findId = params.id as string;
        const foundProperty = propertiesResponse.data?.find((p: Property) => p.id === findId);
        setProperty(foundProperty || null);
      } else {
        console.error('Failed to fetch property:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch property:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'Plot': return <Trees className="h-5 w-5" />;
      case 'House': return <Home className="h-5 w-5" />;
      case 'Land': return <Building className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'Plot': return 'bg-green-500';
      case 'House': return 'bg-blue-500';
      case 'Land': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const renderPropertyDetails = () => {
    if (!property) return null;

    if (property.propertyType === 'Plot') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Size:</span>
            <span>{property.plotSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Facing:</span>
            <span>{property.plotFacing}</span>
          </div>
          {property.pricePerSqft && (
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Price/sqft:</span>
              <span>₹{property.pricePerSqft}</span>
            </div>
          )}
        </div>
      );
    } else if (property.propertyType === 'House') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Size:</span>
            <span>{property.houseSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Bedrooms:</span>
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Bathrooms:</span>
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Floors:</span>
            <span>{property.floors}</span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Type:</span>
            <span>{property.houseType}</span>
          </div>
          {property.yearBuilt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Year Built:</span>
              <span>{property.yearBuilt}</span>
            </div>
          )}
          {property.furnished && (
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Furnished:</span>
              <span>Yes</span>
            </div>
          )}
          {property.parking && (
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Parking:</span>
              <span>Available</span>
            </div>
          )}
        </div>
      );
    } else if (property.propertyType === 'Land') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Size:</span>
            <span>{property.landSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Type:</span>
            <span>{property.landType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Zoning:</span>
            <span>{property.zoning}</span>
          </div>
          {property.roadAccess && (
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Road Access:</span>
              <span>Available</span>
            </div>
          )}
          {property.waterConnection && (
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Water:</span>
              <span>Available</span>
            </div>
          )}
          {property.electricityConnection && (
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Electricity:</span>
              <span>Available</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Property not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [property.imageUrl || '/api/placeholder/600/400'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      
      <div className="container px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/properties" className="text-muted-foreground hover:text-primary">
            ← Back to Properties
          </Link>
        </div>

        {/* Property Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge className={`${getPropertyTypeColor(property.propertyType)} text-white`}>
              <div className="flex items-center gap-1">
                {getPropertyIcon(property.propertyType)}
                <span>{property.propertyType}</span>
              </div>
            </Badge>
            {property.status && (
              <Badge variant={property.status === 'Available' ? 'default' : 'secondary'}>
                {property.status}
              </Badge>
            )}
            {property.category && (
              <Badge variant="outline">
                {property.category}
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black font-headline mb-2">
            {property.propertyNumber} - {property.villageName}
          </h1>
          
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{property.areaName}</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              ₹{property.price ? property.price.toLocaleString('en-IN') : 'Price on Request'}
            </div>
            {property.priceNegotiable && (
              <span className="text-sm text-muted-foreground">Negotiable</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="relative">
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <Image
                      src={images[currentImageIndex]}
                      alt={`Property image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {images.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-primary' : 'bg-muted'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPropertyDetails()}
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description || 'No description available for this property.'}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {property.propertyType === 'House' && property.amenities && property.amenities.length > 0 && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(property as any).amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Actions */}
            <Card className="border-primary/20 sticky top-4">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg border-0" 
                  size="lg"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all" 
                  size="lg"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all" 
                  size="lg"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Inquiry
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all" 
                  size="lg"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Property
                </Button>
              </CardContent>
            </Card>

            {/* Investment Info */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Investment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expected ROI</span>
                  <span className="font-bold text-primary">15% annually</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Appreciation</span>
                  <span className="font-bold text-green-600">+12% YoY</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rental Yield</span>
                  <span className="font-bold text-primary">3-4% annually</span>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Property Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Legal Clearances
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Approval Papers
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
