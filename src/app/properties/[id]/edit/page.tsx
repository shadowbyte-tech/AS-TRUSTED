'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Upload, Image as ImageIcon, Home, Trees, Building, Plus, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import type { PropertyType } from '@/lib/definitions';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [property, setProperty] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    propertyType: 'Plot' as PropertyType,
    title: '',
    description: '',
    location: '',
    price: '',
    size: '',
    approvalType: 'None',
    bedrooms: '',
    bathrooms: '',
    isPremium: false,
    plotFacing: 'North',
    houseType: 'Independent',
    landType: 'Residential',
    zoning: '',
    furnished: false,
    parking: false,
    yearBuilt: '',
  });

  // Check if user is authenticated (all authenticated users can edit)
  useEffect(() => {
    if (user) {
      
    }
  }, [user]);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
          
          // Populate form with existing data
          setFormData({
            propertyType: data.propertyType || 'Plot',
            title: data.title || '',
            description: data.description || '',
            location: `${data.villageName}, ${data.areaName}`,
            price: data.price?.toString() || '',
            size: data.propertyType === 'Plot' ? data.plotSize || '' :
                  data.propertyType === 'House' ? data.houseSize || '' :
                  data.landSize || '',
            approvalType: data.approvalType || 'None',
            bedrooms: data.bedrooms?.toString() || '',
            bathrooms: data.bathrooms?.toString() || '',
            isPremium: data.category === 'Premium',
            plotFacing: data.plotFacing || 'North',
            houseType: data.houseType || 'Independent',
            landType: data.landType || 'Residential',
            zoning: data.zoning || '',
            furnished: data.furnished || false,
            parking: data.parking || false,
            yearBuilt: data.yearBuilt?.toString() || '',
          });
          
          setUploadedImages(data.images || []);
          setAmenities(data.amenities || []);
        } else {
          console.error('Failed to fetch property');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        router.push('/dashboard');
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        if (result.success) {
          setUploadedImages(prev => [...prev, result.url]);
        } else {
          console.error('Upload failed:', result.error);
          alert(`Upload failed: ${result.error}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities(prev => [...prev, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        propertyNumber: property?.propertyNumber || `${formData.propertyType.toUpperCase()}-${Date.now()}`,
        propertyType: formData.propertyType,
        villageName: formData.location.split(',')[0] || formData.location,
        areaName: formData.location,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        imageUrl: uploadedImages[0] || property?.imageUrl || '/api/placeholder/400/300',
        imageHint: 'admin edit',
        status: property?.status || 'Available',
        category: formData.isPremium ? 'Premium' : 'Normal' as const,
        images: uploadedImages,
        priceNegotiable: property?.priceNegotiable || false,
        // Plot-specific
        plotSize: formData.propertyType === 'Plot' ? formData.size : undefined,
        plotFacing: formData.propertyType === 'Plot' ? formData.plotFacing : undefined,
        pricePerSqft: formData.propertyType === 'Plot' && formData.size && formData.price ? 
          parseFloat(formData.price) / parseFloat(formData.size.split(' ')[0]) : undefined,
        // House-specific
        houseSize: formData.propertyType === 'House' ? formData.size : undefined,
        bedrooms: formData.propertyType === 'House' ? parseInt(formData.bedrooms) || 1 : undefined,
        bathrooms: formData.propertyType === 'House' ? parseInt(formData.bathrooms) || 1 : undefined,
        houseType: formData.propertyType === 'House' ? formData.houseType : undefined,
        furnished: formData.propertyType === 'House' ? formData.furnished : undefined,
        parking: formData.propertyType === 'House' ? formData.parking : undefined,
        floors: formData.propertyType === 'House' ? 1 : undefined,
        amenities: formData.propertyType === 'House' ? amenities : [],
        yearBuilt: formData.propertyType === 'House' ? parseInt(formData.yearBuilt) : undefined,
        // Land-specific
        landSize: formData.propertyType === 'Land' ? formData.size : undefined,
        landType: formData.propertyType === 'Land' ? formData.landType : undefined,
        zoning: formData.propertyType === 'Land' ? formData.zoning || 'R1' : undefined,
        roadAccess: formData.propertyType === 'Land' ? true : undefined,
        waterConnection: formData.propertyType === 'Land' ? false : undefined,
        electricityConnection: formData.propertyType === 'Land' ? false : undefined,
      };

      const response = await fetch('/api/property/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...propertyData, id }),
      });

      if (response.ok) {
        alert('Property updated successfully!');
        router.push('/dashboard?success=Property updated successfully');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to update property'}`);
      }
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error updating property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPropertyIcon = (type: PropertyType) => {
    switch (type) {
      case 'Plot': return <Trees className="h-5 w-5" />;
      case 'House': return <Home className="h-5 w-5" />;
      case 'Land': return <Building className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Authentication Required</h1>
            <p className="text-muted-foreground">Please login to edit properties.</p>
            <Button asChild>
              <Link href="/user-login">Login</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // User is authenticated, proceed to edit form

  if (fetching) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Property</h1>
            <p className="text-muted-foreground">Update property details and information</p>
          </div>
        </div>

        {/* Property Type Badge */}
        <div className="flex items-center gap-2 mb-6">
          {getPropertyIcon(formData.propertyType)}
          <Badge variant="outline" className="text-sm">
            {formData.propertyType}
          </Badge>
          <Badge variant={formData.isPremium ? "default" : "secondary"}>
            {formData.isPremium ? "Premium" : "Normal"}
          </Badge>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Type */}
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Select value={formData.propertyType} onValueChange={(value: PropertyType) => handleInputChange('propertyType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plot">Plot</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location (Village, Area)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Kamareddy, Sitaramnagar Colony"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the property..."
                  rows={3}
                />
              </div>

              {/* Price and Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="2500000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    placeholder="e.g., 2400 sqft"
                    required
                  />
                </div>
              </div>

              {/* Premium Toggle */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPremium"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => handleInputChange('isPremium', checked)}
                />
                <Label htmlFor="isPremium">Mark as Premium Property</Label>
              </div>

              {/* Type-specific fields */}
              {formData.propertyType === 'Plot' && (
                <div>
                  <Label htmlFor="plotFacing">Plot Facing</Label>
                  <Select value={formData.plotFacing} onValueChange={(value) => handleInputChange('plotFacing', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="North-East">North-East</SelectItem>
                      <SelectItem value="North-West">North-West</SelectItem>
                      <SelectItem value="South-East">South-East</SelectItem>
                      <SelectItem value="South-West">South-West</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.propertyType === 'House' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      placeholder="2"
                    />
                  </div>
                </div>
              )}

              {/* Images */}
              <div>
                <Label>Property Images</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-4"
                  />
                  
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Updating...' : 'Update Property'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
