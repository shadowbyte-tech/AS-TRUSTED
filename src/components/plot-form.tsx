
'use client';

import { useActionState, useEffect, useState } from 'react';
import { createPlot, updatePlot } from '@/lib/actions';
import type { Plot, PlotFacing, State } from '@/lib/definitions';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, FileUp, Save, Loader2, Image as ImageIcon, ArrowLeft, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Textarea } from './ui/textarea';
import { useRouter } from 'next/navigation';

const plotFacings: PlotFacing[] = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const propertyTypes = [
  { value: 'plot', label: 'Plot/Land' },
  { value: 'house', label: 'Independent House' },
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment/Flat' },
  { value: 'farmhouse', label: 'Farm House' },
  { value: 'commercial', label: 'Commercial Property' },
  { value: 'studio', label: 'Studio Room' },
];

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Saving...' : 'Uploading...'}
                </>
            ) : (
                <>
                    {isEditing ? <Save className="mr-2 h-4 w-4" /> : <FileUp className="mr-2 h-4 w-4" />}
                    {isEditing ? 'Save Changes' : 'Upload Property'}
                </>
            )}
        </Button>
    )
}

export default function PlotForm({ plot, plotType }: { plot?: Plot; plotType?: 'premium' | 'normal' }) {
  const { toast } = useToast();
  const router = useRouter();
  const [description, setDescription] = useState(plot?.description || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(plot?.images || []);
  const [selectedPropertyType, setSelectedPropertyType] = useState(plot?.propertyType || 'plot');
  const isApiKeyConfigured = process.env.NEXT_PUBLIC_GEMINI_API_KEY_CONFIGURED === 'true';

  const initialState: State = { message: null, errors: {}, success: false, plotId: null };
  const action = plot ? updatePlot.bind(null, plot.id) : createPlot;
  const [state, dispatch] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      const successMessage = state.message || (plot ? 'Plot updated successfully!' : 'Plot created successfully!');
      toast({
        title: 'Success!',
        description: successMessage,
      });
      router.push('/dashboard');
    } else if (state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, router, plot]);

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).slice(0, 5); // Max 5 images
    const newPreviews: string[] = [];
    
    newFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            if (newPreviews.length === newFiles.length) {
              setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 5));
              setImageFiles(prev => [...prev, ...newFiles].slice(0, 5));
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };
  const handleGenerateDescription = async (formData: FormData) => {
    if (!isApiKeyConfigured) {
      toast({
        title: 'Feature Temporarily Disabled',
        description: 'AI description generation is temporarily disabled. Please write your own description.',
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const plotNumber = formData.get('plotNumber') as string;
      const villageName = formData.get('villageName') as string;
      const areaName = formData.get('areaName') as string;
      const plotSize = formData.get('plotSize') as string;
      const plotFacing = formData.get('plotFacing') as string;

      const prompt = `Write a premium, attractive real estate description for a ${selectedPropertyType} with the following details:
      Number: ${plotNumber}
      Location: ${areaName}, ${villageName}
      Size: ${plotSize}
      Facing: ${plotFacing}
      
      The description should highlight the investment potential and luxury aspect. Keep it under 150 words.`;

      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        setDescription(data.text);
        toast({ title: 'Success', description: 'AI description generated!' });
      } else {
        throw new Error('Failed to generate description');
      }
    } catch (error) {
      toast({
        title: 'AI Unavailable',
        description: 'Failed to generate description. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // All hooks are called above, now we can safely have conditional logic
  return (
    <form action={dispatch}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="plotNumber">Plot Number</Label>
              <Input id="plotNumber" name="plotNumber" placeholder="e.g., A-101" defaultValue={plot?.plotNumber} required />
              {state.errors?.plotNumber && <p className="text-sm text-destructive">{state.errors.plotNumber[0]}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="plotSize">Plot Size</Label>
              <Input id="plotSize" name="plotSize" placeholder="e.g., 2400 sqft" defaultValue={plot?.plotSize} required />
              {state.errors?.plotSize && <p className="text-sm text-destructive">{state.errors.plotSize[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select name="propertyType" value={selectedPropertyType} onValueChange={(value: string) => setSelectedPropertyType(value)} required>
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Plot">Plot/Land</SelectItem>
                  <SelectItem value="House">Independent House</SelectItem>
                  <SelectItem value="Land">Agricultural Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="villageName">Village Name</Label>
              <Input id="villageName" name="villageName" placeholder="e.g., Greenwood" defaultValue={plot?.villageName} required />
              {state.errors?.villageName && <p className="text-sm text-destructive">{state.errors.villageName[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="areaName">Area Name</Label>
              <Input id="areaName" name="areaName" placeholder="e.g., Sunrise Valley" defaultValue={plot?.areaName} required />
              {state.errors?.areaName && <p className="text-sm text-destructive">{state.errors.areaName[0]}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="plotFacing">Plot Facing</Label>
            <Select name="plotFacing" defaultValue={plot?.plotFacing} required>
              <SelectTrigger id="plotFacing">
                <SelectValue placeholder="Select a direction" />
              </SelectTrigger>
              <SelectContent>
                {plotFacings.map((facing) => (
                  <SelectItem key={facing} value={facing}>{facing}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.plotFacing && <p className="text-sm text-destructive">{state.errors.plotFacing[0]}</p>}
          </div>

          {/* New Price and Status Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                placeholder="e.g., 2500000" 
                defaultValue={plot?.price?.toString() || ''} 
              />
              {state.errors?.price && <p className="text-sm text-destructive">{state.errors.price[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Plot Status</Label>
              <Select name="status" defaultValue={plot?.status || 'Available'}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="Under Negotiation">Under Negotiation</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.status && <p className="text-sm text-destructive">{state.errors.status[0]}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Plot Category</Label>
              <Select name="category" defaultValue={plot?.category || plotType === 'premium' ? 'Premium' : 'Normal'}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.category && <p className="text-sm text-destructive">{state.errors.category[0]}</p>}
            </div>

            <div className="flex items-center space-x-2 pt-8">
            <input 
              type="checkbox" 
              id="priceNegotiable" 
              name="priceNegotiable" 
              value="true"
              defaultChecked={plot?.priceNegotiable || false}
              className="rounded border-gray-300"
            />
            <Label htmlFor="priceNegotiable" className="text-sm">Price is negotiable</Label>
          </div>
          </div>

          <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="A compelling description of the plot..." 
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                disabled={isGenerating || !isApiKeyConfigured}
                onClick={(e) => handleGenerateDescription(new FormData(e.currentTarget.form!))}
              >
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  {isApiKeyConfigured ? 'Generate with AI' : 'AI generation disabled'}
              </Button>
          </div>

          <div className="space-y-4">
            <Label>
                <div className='flex items-center gap-2'>
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    Property Images
                </div>
            </Label>
            
            {/* Image Upload Input */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <Input 
                id="images" 
                name="images" 
                type="file" 
                accept="image/png, image/jpeg, image/jpg, image/webp"
                multiple 
                className="border-0 bg-transparent"
                onChange={(e) => handleImageChange(e.target.files)}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Upload multiple images (PNG, JPG, WebP). Max 5 images.
              </p>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            
          </div>
          
          {state.message && !state.success && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button asChild variant="outline">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Link>
            </Button>
            <SubmitButton isEditing={!!plot} />
        </CardFooter>
      </Card>
    </form>
  );
}
