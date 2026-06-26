
'use client';

import { useState, useEffect } from 'react';
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
import { Upload, Image as ImageIcon, Home, Trees, Building, Plus, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import type { PropertyType } from '@/lib/definitions';

export default function UploadPropertyPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
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

  // Check if user is allowed to upload
  useEffect(() => {
    if (user && user.role !== 'Owner' && user.role !== 'Premium') {
      router.push('/');
    }
  }, [user, router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      try {
        const fileName = file.name.toLowerCase();
        const isImageType = file.type.startsWith('image/');
        const isHeicOrHeif = file.type === '' && (fileName.endsWith('.heic') || fileName.endsWith('.heif'));
        if (!isImageType && !isHeicOrHeif) continue;

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
      // Debug: Log form data
      
      
      

      const propertyData = {
        propertyNumber: `${formData.propertyType.toUpperCase()}-${Date.now()}`,
        propertyType: formData.propertyType,
        villageName: formData.location.split(',')[0] || formData.location,
        areaName: formData.location,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        imageUrl: uploadedImages[0] || '/api/placeholder/400/300',
        imageHint: 'admin upload',
        status: 'Available' as const,
        category: formData.isPremium ? 'Premium' : 'Normal' as const,
        images: uploadedImages,
        priceNegotiable: false,
        // Plot-specific
        plotSize: formData.propertyType === 'Plot' ? formData.size : undefined,
        plotFacing: formData.propertyType === 'Plot' ? formData.plotFacing : undefined,
        pricePerSqft: formData.propertyType === 'Plot' && formData.size && formData.price 
          ? (() => {
              const parsed = parseFloat(formData.price) / parseFloat(formData.size.split(' ')[0]);
              return isNaN(parsed) ? undefined : parsed;
            })() 
          : undefined,
        // House-specific
        houseSize: formData.propertyType === 'House' ? formData.size : undefined,
        bedrooms: formData.propertyType === 'House' ? parseInt(formData.bedrooms) || 1 : undefined,
        bathrooms: formData.propertyType === 'House' ? parseInt(formData.bathrooms) || 1 : undefined,
        houseType: formData.propertyType === 'House' ? formData.houseType : undefined,
        furnished: formData.propertyType === 'House' ? formData.furnished : undefined,
        parking: formData.propertyType === 'House' ? formData.parking : undefined,
        floors: formData.propertyType === 'House' ? 1 : undefined,
        amenities: formData.propertyType === 'House' ? amenities : [],
        yearBuilt: formData.propertyType === 'House' 
          ? (() => {
              const parsed = parseInt(formData.yearBuilt);
              return isNaN(parsed) ? undefined : parsed;
            })()
          : undefined,
        // Land-specific
        landSize: formData.propertyType === 'Land' ? formData.size : undefined,
        landType: formData.propertyType === 'Land' ? formData.landType : undefined,
        zoning: formData.propertyType === 'Land' ? formData.zoning || 'R1' : undefined,
        roadAccess: formData.propertyType === 'Land' ? true : undefined,
        waterConnection: formData.propertyType === 'Land' ? false : undefined,
        electricityConnection: formData.propertyType === 'Land' ? false : undefined,
      };

      

      const response = await fetch('/api/property/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });


      
      

      if (response.ok) {
        const result = await response.json();
        
        alert(`Property uploaded successfully! Property ID: ${result.data.id}`);

        router.push('/dashboard?success=Property uploaded successfully');
      } else {
        const error = await response.json();
        console.error('❌ Upload Error:', error);
        alert(`Error: ${error.error || 'Failed to upload property'}`);
      }
    } catch (error) {
      console.error('❌ Upload Exception:', error);
      alert('Error uploading property. Please try again.');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center">
        <Header />
        <div className="flex flex-col items-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
           <p className="text-muted-foreground">Loading your profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Authentication Required</h1>
            <p className="text-muted-foreground">Please login to upload properties.</p>
            <Button asChild>
              <Link href="/user-login">Login</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (user.role !== 'Owner' && user.role !== 'Premium') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">Property upload is only available for Owner and Premium users.</p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current role: {user.role}</p>
              <Button asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      
      <div className="container px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black font-headline mb-2">
                Upload New Property
              </h1>
              <p className="text-muted-foreground">
                Add a new property to your real estate portfolio
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Logged in as:</p>
              <p className="font-semibold">{user?.email}</p>
              <Badge variant={user?.role === 'Owner' ? 'default' : 'secondary'}>
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Type Selection */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Property Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={formData.propertyType} 
                onValueChange={(value: PropertyType) => handleInputChange('propertyType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Plot">
                    <div className="flex items-center gap-2">
                      <Trees className="h-4 w-4" />
                      Plot
                    </div>
                  </SelectItem>
                  <SelectItem value="House">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      House
                    </div>
                  </SelectItem>
                  <SelectItem value="Land">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Land
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter property title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description">Description *</Label>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe property features, location benefits, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Kamareddy, Hyderabad"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 2500000"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="size">Size *</Label>
                  <Input
                    id="size"
                    placeholder={formData.propertyType === 'Plot' ? 'e.g., 2400 sqft' : formData.propertyType === 'House' ? 'e.g., 1200 sqft' : 'e.g., 5000 sq yards'}
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="approvalType">Approval Type</Label>
                <Select 
                  value={formData.approvalType} 
                  onValueChange={(value) => handleInputChange('approvalType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select approval type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DTCP">DTCP</SelectItem>
                    <SelectItem value="HMDA">HMDA</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPremium"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => handleInputChange('isPremium', checked)}
                />
                <Label htmlFor="isPremium">Mark as Premium Property</Label>
              </div>
            </CardContent>
          </Card>

          {/* Type-specific fields */}
          {formData.propertyType === 'Plot' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trees className="h-5 w-5" />
                  Plot Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="plotFacing">Plot Facing</Label>
                  <Select 
                    value={formData.plotFacing} 
                    onValueChange={(value) => handleInputChange('plotFacing', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plot facing" />
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
              </CardContent>
            </Card>
          )}

          {formData.propertyType === 'House' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  House Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="1"
                      placeholder="e.g., 3"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="1"
                      placeholder="e.g., 2"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="houseType">House Type</Label>
                    <Select 
                      value={formData.houseType} 
                      onValueChange={(value) => handleInputChange('houseType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select house type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Independent">Independent</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Duplex">Duplex</SelectItem>
                        <SelectItem value="Penthouse">Penthouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="e.g., 2020"
                      value={formData.yearBuilt}
                      onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="furnished"
                      checked={formData.furnished}
                      onCheckedChange={(checked) => handleInputChange('furnished', checked)}
                    />
                    <Label htmlFor="furnished">Furnished</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parking"
                      checked={formData.parking}
                      onCheckedChange={(checked) => handleInputChange('parking', checked)}
                    />
                    <Label htmlFor="parking">Parking Available</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {formData.propertyType === 'Land' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Land Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="landType">Land Type</Label>
                    <Select 
                      value={formData.landType} 
                      onValueChange={(value) => handleInputChange('landType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select land type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Agricultural">Agricultural</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="zoning">Zoning *</Label>
                    <Input
                      id="zoning"
                      placeholder="e.g., R1, C2, A1"
                      value={formData.zoning}
                      onChange={(e) => handleInputChange('zoning', e.target.value)}
                      required={formData.propertyType === 'Land'}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Amenities */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add amenity (e.g., Parking, Garden, Security)"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <Button type="button" onClick={addAmenity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeAmenity(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WebP, HEIC, HEIF up to 10MB each
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,.heic,.heif,image/heic,image/heif"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button type="button" variant="outline" className="mt-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    Select Images
                  </label>
                </Button>
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Uploading...' : 'Upload Property'}
            </Button>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
}
