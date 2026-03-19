'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PropertyListingAIAssistant } from '@/components/property-listing-ai-assistant';
import { 
  ArrowLeft, 
  Upload, 
  Home, 
  Building, 
  MapPin, 
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Zap,
  Bot,
  Sparkles
} from 'lucide-react';

function PropertyDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyType = searchParams.get('type') as 'premium' | 'normal' | null;
  
  const [formData, setFormData] = useState({
    propertyNumber: '',
    propertyType: 'Plot',
    villageName: '',
    areaName: '',
    description: '',
    price: '',
    priceNegotiable: false,
    status: 'Available',
    category: propertyType === 'premium' ? 'Premium' : 'Normal',
    // Plot specific
    plotSize: '',
    plotFacing: 'North',
    pricePerSqft: '',
    // House specific
    houseSize: '',
    bedrooms: '',
    bathrooms: '',
    floors: '',
    houseType: 'Independent',
    furnished: false,
    parking: false,
    amenities: '',
    yearBuilt: '',
    // Land specific
    landSize: '',
    landType: 'Residential',
    zoning: '',
    roadAccess: false,
    waterConnection: false,
    electricityConnection: false,
    soilType: '',
    topography: '',
    // Images
    images: [] as string[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAIAssistant, setShowAIAssistant] = useState(true);

  useEffect(() => {
    if (!propertyType) {
      router.push('/upload-property/select-type');
    }
  }, [propertyType, router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    let processedCount = 0;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && formData.images.length + newImages.length < 5) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            processedCount++;
            
            if (processedCount === Math.min(files.length, 5 - formData.images.length)) {
              setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages].slice(0, 5)
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAIFieldUpdate = (field: string, value: string) => {
    handleInputChange(field, value);
  };

  const generateAIDescription = async () => {
    if (!formData.propertyType || !formData.villageName || !formData.areaName || !formData.price) {
      setErrors({ 
        generate: 'Please fill in property type, location, and price first' 
      });
      return;
    }

    setIsGeneratingDescription(true);
    setErrors(prev => ({ ...prev, generate: '' }));

    try {
      // Extract features from form data
      const features = [];
      
      if (formData.propertyType === 'Plot') {
        if (formData.plotSize) features.push(`Plot size: ${formData.plotSize}`);
        if (formData.plotFacing) features.push(`Facing: ${formData.plotFacing}`);
        if (formData.pricePerSqft) features.push(`Price per sqft: ${formData.pricePerSqft}`);
      } else if (formData.propertyType === 'House') {
        if (formData.houseSize) features.push(`House size: ${formData.houseSize}`);
        if (formData.bedrooms) features.push(`${formData.bedrooms} bedrooms`);
        if (formData.bathrooms) features.push(`${formData.bathrooms} bathrooms`);
        if (formData.furnished) features.push('Fully furnished');
        if (formData.parking) features.push('Parking available');
      } else if (formData.propertyType === 'Land') {
        if (formData.landSize) features.push(`Land size: ${formData.landSize}`);
        if (formData.landType) features.push(`Land type: ${formData.landType}`);
        if (formData.roadAccess) features.push('Road access available');
        if (formData.waterConnection) features.push('Water connection');
        if (formData.electricityConnection) features.push('Electricity connection');
      }

      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyType: formData.propertyType,
          villageName: formData.villageName,
          areaName: formData.areaName,
          price: parseFloat(formData.price),
          features
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(prev => ({ ...prev, description: result.description }));
      } else {
        throw new Error('Failed to generate description');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      setErrors({ 
        generate: error instanceof Error ? error.message : 'Failed to generate AI description' 
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertyNumber.trim()) {
      newErrors.propertyNumber = 'Property number is required';
    }
    if (!formData.villageName.trim()) {
      newErrors.villageName = 'Village name is required';
    }
    if (!formData.areaName.trim()) {
      newErrors.areaName = 'Area name is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    // Type-specific validation
    if (formData.propertyType === 'Plot') {
      if (!formData.plotSize.trim()) {
        newErrors.plotSize = 'Plot size is required';
      }
      if (!formData.pricePerSqft || parseFloat(formData.pricePerSqft) <= 0) {
        newErrors.pricePerSqft = 'Valid price per sqft is required';
      }
    } else if (formData.propertyType === 'House') {
      if (!formData.houseSize.trim()) {
        newErrors.houseSize = 'House size is required';
      }
      if (!formData.bedrooms || parseInt(formData.bedrooms) <= 0) {
        newErrors.bedrooms = 'Valid number of bedrooms is required';
      }
    } else if (formData.propertyType === 'Land') {
      if (!formData.landSize.trim()) {
        newErrors.landSize = 'Land size is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare property data
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        pricePerSqft: formData.pricePerSqft ? parseFloat(formData.pricePerSqft) : undefined,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        floors: formData.floors ? parseInt(formData.floors) : undefined,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
      };

      // Call property creation API
      const response = await fetch('/api/property/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Redirect to appropriate properties page based on type
        const redirectPage = propertyType === 'premium' ? '/premium-properties' : '/normal-properties';
        router.push(redirectPage);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create property');
      }
    } catch (error) {
      console.error('Property creation error:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to create property' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!propertyType) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gray-800"></div>
      </div>
      
      {/* Animated Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8 pt-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/upload-property/select-type')}
              className="text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Type Selection
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="text-gray-300 border-gray-600 hover:text-white hover:bg-gray-700"
            >
              {showAIAssistant ? (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Hide AI Assistant
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Show AI Assistant
                </>
              )}
            </Button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge className={`${
                propertyType === 'premium' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
              }`}>
                {propertyType === 'premium' ? 'Premium Property' : 'Standard Property'}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
              Property Details
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Fill in the comprehensive details for your {propertyType} property listing
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Form */}
          <div className={`flex-1 ${showAIAssistant ? 'max-w-4xl' : 'max-w-full'}`}>
            <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border-gray-700 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                Basic Information
              </CardTitle>
              <CardDescription className="text-gray-400 text-base">
                General property information and location details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyNumber" className="text-gray-300 font-medium">Property Number *</Label>
                  <Input
                    id="propertyNumber"
                    value={formData.propertyNumber}
                    onChange={(e) => handleInputChange('propertyNumber', e.target.value)}
                    placeholder="e.g., PLOT-001"
                    className={`bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 ${errors.propertyNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.propertyNumber && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.propertyNumber}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="text-gray-300 font-medium">Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleInputChange('propertyType', value)}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="Plot" className="text-white">Plot/Land</SelectItem>
                      <SelectItem value="House" className="text-white">Independent House</SelectItem>
                      <SelectItem value="Villa" className="text-white">Villa</SelectItem>
                      <SelectItem value="Apartment" className="text-white">Apartment/Flat</SelectItem>
                      <SelectItem value="Farmhouse" className="text-white">Farm House</SelectItem>
                      <SelectItem value="Commercial" className="text-white">Commercial Property</SelectItem>
                      <SelectItem value="Studio" className="text-white">Studio Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="villageName" className="text-gray-300 font-medium">Village Name *</Label>
                  <Input
                    id="villageName"
                    value={formData.villageName}
                    onChange={(e) => handleInputChange('villageName', e.target.value)}
                    placeholder="e.g., Kamareddy"
                    className={`bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 ${errors.villageName ? 'border-red-500' : ''}`}
                  />
                  {errors.villageName && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.villageName}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="areaName" className="text-gray-300 font-medium">Area Name *</Label>
                  <Input
                    id="areaName"
                    value={formData.areaName}
                    onChange={(e) => handleInputChange('areaName', e.target.value)}
                    placeholder="e.g., Hitech City"
                    className={`bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 ${errors.areaName ? 'border-red-500' : ''}`}
                  />
                  {errors.areaName && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.areaName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-gray-300 font-medium">
                    Property Description
                  </Label>
                  <Button
                    type="button"
                    onClick={generateAIDescription}
                    disabled={isGeneratingDescription || !formData.propertyType || !formData.villageName || !formData.areaName || !formData.price}
                    variant="outline"
                    size="sm"
                    className="text-gray-300 border-gray-600 hover:text-white hover:bg-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingDescription ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        AI Generate
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your property in detail - include key features, amenities, location advantages, etc. (Or use AI Generate above!)"
                  rows={4}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                />
                {errors.generate && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.generate}
                  </p>
                )}
                {formData.description && (
                  <p className="text-gray-400 text-xs mt-1">
                    {formData.description.length} characters
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300 font-medium">Price (INR) *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="e.g., 5000000"
                      className={`pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 ${errors.price ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.price}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-300 font-medium">Property Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="Available" className="text-white">Available</SelectItem>
                      <SelectItem value="Reserved" className="text-white">Reserved</SelectItem>
                      <SelectItem value="Sold" className="text-white">Sold</SelectItem>
                      <SelectItem value="Under Negotiation" className="text-white">Under Negotiation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Options */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                  <input
                    type="checkbox"
                    id="priceNegotiable"
                    checked={formData.priceNegotiable}
                    onChange={(e) => handleInputChange('priceNegotiable', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="priceNegotiable" className="text-gray-300 cursor-pointer">
                    Price is negotiable
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Type-specific fields */}
          {formData.propertyType === 'Plot' && (
            <Card className="bg-gradient-to-br from-amber-800/50 to-orange-900/50 backdrop-blur-md border-amber-700 shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-white">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  Plot Specific Details
                </CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  Detailed information about the plot dimensions and characteristics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="plotSize" className="text-gray-300 font-medium">Plot Size *</Label>
                    <Input
                      id="plotSize"
                      value={formData.plotSize}
                      onChange={(e) => handleInputChange('plotSize', e.target.value)}
                      placeholder="e.g., 200 sq.yards"
                      className={`bg-gray-800/50 border-amber-600/50 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500/20 ${errors.plotSize ? 'border-red-500' : ''}`}
                    />
                    {errors.plotSize && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.plotSize}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="plotFacing" className="text-gray-300 font-medium">Plot Facing</Label>
                    <Select
                      value={formData.plotFacing}
                      onValueChange={(value) => handleInputChange('plotFacing', value)}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-amber-600/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-amber-600/50">
                        <SelectItem value="North" className="text-white">North</SelectItem>
                        <SelectItem value="South" className="text-white">South</SelectItem>
                        <SelectItem value="East" className="text-white">East</SelectItem>
                        <SelectItem value="West" className="text-white">West</SelectItem>
                        <SelectItem value="North-East" className="text-white">North-East</SelectItem>
                        <SelectItem value="North-West" className="text-white">North-West</SelectItem>
                        <SelectItem value="South-East" className="text-white">South-East</SelectItem>
                        <SelectItem value="South-West" className="text-white">South-West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerSqft" className="text-gray-300 font-medium">Price per Sqft (INR) *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="pricePerSqft"
                      type="number"
                      value={formData.pricePerSqft}
                      onChange={(e) => handleInputChange('pricePerSqft', e.target.value)}
                      placeholder="e.g., 5000"
                      className={`pl-10 bg-gray-800/50 border-amber-600/50 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500/20 ${errors.pricePerSqft ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.pricePerSqft && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.pricePerSqft}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* House specific fields */}
          {formData.propertyType === 'House' && (
            <Card className="bg-gradient-to-br from-blue-800/50 to-indigo-900/50 backdrop-blur-md border-blue-700 shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-white">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  House Specific Details
                </CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  Information about the house structure, rooms, and amenities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="houseSize" className="text-gray-300 font-medium">House Size *</Label>
                    <Input
                      id="houseSize"
                      value={formData.houseSize}
                      onChange={(e) => handleInputChange('houseSize', e.target.value)}
                      placeholder="e.g., 1500 sq.ft"
                      className={`bg-gray-800/50 border-blue-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 ${errors.houseSize ? 'border-red-500' : ''}`}
                    />
                    {errors.houseSize && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.houseSize}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms" className="text-gray-300 font-medium">Bedrooms *</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      placeholder="e.g., 3"
                      className={`bg-gray-800/50 border-blue-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 ${errors.bedrooms ? 'border-red-500' : ''}`}
                    />
                    {errors.bedrooms && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.bedrooms}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms" className="text-gray-300 font-medium">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      placeholder="e.g., 2"
                      className="bg-gray-800/50 border-blue-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="floors" className="text-gray-300 font-medium">Floors</Label>
                    <Input
                      id="floors"
                      type="number"
                      value={formData.floors}
                      onChange={(e) => handleInputChange('floors', e.target.value)}
                      placeholder="e.g., 2"
                      className="bg-gray-800/50 border-blue-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                    <input
                      type="checkbox"
                      id="furnished"
                      checked={formData.furnished}
                      onChange={(e) => handleInputChange('furnished', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="furnished" className="text-gray-300 cursor-pointer">
                      Fully Furnished
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                    <input
                      type="checkbox"
                      id="parking"
                      checked={formData.parking}
                      onChange={(e) => handleInputChange('parking', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="parking" className="text-gray-300 cursor-pointer">
                      Parking Available
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Land specific fields */}
          {formData.propertyType === 'Land' && (
            <Card className="bg-gradient-to-br from-green-800/50 to-emerald-900/50 backdrop-blur-md border-green-700 shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-white">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  Land Specific Details
                </CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  Information about the land type, zoning, and development potential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="landSize" className="text-gray-300 font-medium">Land Size *</Label>
                    <Input
                      id="landSize"
                      value={formData.landSize}
                      onChange={(e) => handleInputChange('landSize', e.target.value)}
                      placeholder="e.g., 1000 sq.yards"
                      className={`bg-gray-800/50 border-green-600/50 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 ${errors.landSize ? 'border-red-500' : ''}`}
                    />
                    {errors.landSize && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.landSize}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landType" className="text-gray-300 font-medium">Land Type</Label>
                    <Select
                      value={formData.landType}
                      onValueChange={(value) => handleInputChange('landType', value)}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-green-600/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-green-600/50">
                        <SelectItem value="Residential" className="text-white">Residential</SelectItem>
                        <SelectItem value="Commercial" className="text-white">Commercial</SelectItem>
                        <SelectItem value="Agricultural" className="text-white">Agricultural</SelectItem>
                        <SelectItem value="Industrial" className="text-white">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                    <input
                      type="checkbox"
                      id="roadAccess"
                      checked={formData.roadAccess}
                      onChange={(e) => handleInputChange('roadAccess', e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                    />
                    <Label htmlFor="roadAccess" className="text-gray-300 cursor-pointer">
                      Road Access Available
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                    <input
                      type="checkbox"
                      id="waterConnection"
                      checked={formData.waterConnection}
                      onChange={(e) => handleInputChange('waterConnection', e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                    />
                    <Label htmlFor="waterConnection" className="text-gray-300 cursor-pointer">
                      Water Connection
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {errors.submit && (
            <Card className="border-red-500/50 bg-red-900/20 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Submission Error</p>
                    <p className="text-sm">{errors.submit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Upload Section */}
          <Card className="bg-gradient-to-br from-purple-800/50 to-pink-900/50 backdrop-blur-md border-purple-700 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                Property Images
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                Upload high-quality images to showcase your property (Max 5 images)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-purple-500/50 rounded-lg p-6 text-center hover:border-purple-400/70 transition-colors">
                <input
                  type="file"
                  id="propertyImages"
                  multiple
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="propertyImages" 
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Click to upload images</p>
                    <p className="text-gray-400 text-sm">or drag and drop</p>
                    <p className="text-gray-500 text-xs mt-1">PNG, JPG, WebP up to 10MB each</p>
                  </div>
                </label>
              </div>

              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-purple-500/30">
                        <img 
                          src={image} 
                          alt={`Property image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formData.images.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-gray-400">No images uploaded yet</p>
                  <p className="text-gray-500 text-sm">Add at least one image to showcase your property</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className={`px-12 py-4 text-lg font-bold transition-all duration-300 ${
                propertyType === 'premium'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/40'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Creating Property...
                </>
              ) : (
                <>
                  <Upload className="mr-3 h-5 w-5" />
                  Upload Property
                </>
              )}
            </Button>
          </div>
        </form>
          </div>

          {/* AI Assistant Sidebar */}
          {showAIAssistant && (
            <div className="w-96 flex-shrink-0">
              <PropertyListingAIAssistant
                propertyType={propertyType || 'normal'}
                onFieldUpdate={handleAIFieldUpdate}
                currentData={formData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <PropertyDetailsContent />
    </Suspense>
  );
}
