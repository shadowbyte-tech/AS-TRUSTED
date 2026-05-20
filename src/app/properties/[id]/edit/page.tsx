'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, CheckCircle, Loader2, Image as ImageIcon, X, Upload } from 'lucide-react';
import Link from 'next/link';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/property/${id}`);
        if (!res.ok) throw new Error('Property not found');
        const data = await res.json();
        setFormData(data.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const set = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setIsUploading(true);
    const newImages: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if ((formData.images?.length || 0) + newImages.length >= 5) break;
        if (!file.type.startsWith('image/')) continue;
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const result = await res.json();
          if (result.success) newImages.push(result.url);
        }
      }
      if (newImages.length > 0) {
        set('images', [...(formData.images || []), ...newImages].slice(0, 5));
      }
    } catch { /* silent */ }
    finally { setIsUploading(false); }
  };

  const removeImage = (index: number) => {
    set('images', (formData.images || []).filter((_: any, i: number) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/property/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Update failed');
      }
      setSaved(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (error && !formData) return (
    <div className="text-center py-16">
      <p className="text-destructive text-lg mb-4">{error}</p>
      <Button asChild variant="outline"><Link href="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Link></Button>
    </div>
  );

  if (saved) return (
    <div className="max-w-xl mx-auto text-center py-16">
      <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-emerald-500" />
      </div>
      <h2 className="text-3xl font-black font-headline mb-2">Property Updated!</h2>
      <p className="text-muted-foreground mb-8">Your changes have been saved successfully.</p>
      <div className="flex gap-4 justify-center">
        <Button asChild className="bg-gradient-to-r from-primary to-accent text-white">
          <Link href="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Link>
        </Button>
        <Button variant="outline" onClick={() => setSaved(false)}>Continue Editing</Button>
      </div>
    </div>
  );

  const baseType = formData?.propertyType === 'Plot' ? 'Plot'
    : ['House', 'Villa', 'Apartment', 'Farmhouse', 'Studio'].includes(formData?.propertyType) ? 'House'
    : 'Land';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link href="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Link>
          </Button>
          <h1 className="text-2xl font-black font-headline">Edit Property</h1>
          <p className="text-muted-foreground text-sm">Property #{formData?.propertyNumber} · <Badge variant="outline">{formData?.propertyType}</Badge></p>
        </div>
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSave} className="space-y-6">

        {/* Core Details */}
        <Card className="border border-border shadow-md bg-card">
          <CardHeader><CardTitle className="text-foreground">Core Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Property Number</Label>
              <Input value={formData?.propertyNumber || ''} onChange={e => set('propertyNumber', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData?.status || 'Available'} onValueChange={v => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Available', 'Reserved', 'Sold', 'Under Negotiation', 'Under Construction'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Village Name</Label>
              <Input value={formData?.villageName || ''} onChange={e => set('villageName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Area / Mandal</Label>
              <Input value={formData?.areaName || ''} onChange={e => set('areaName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input type="number" value={formData?.price || ''} onChange={e => set('price', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData?.category || 'Normal'} onValueChange={v => set('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Normal', 'Premium', 'Luxury'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea value={formData?.description || ''} onChange={e => set('description', e.target.value)} rows={4} />
            </div>
          </CardContent>
        </Card>

        {/* Type-specific fields */}
        {baseType === 'Plot' && (
          <Card className="border border-border shadow-md bg-card">
            <CardHeader><CardTitle className="text-foreground">Plot Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Plot Size (e.g. 200 Sq Yards)</Label>
                <Input value={formData?.plotSize || ''} onChange={e => set('plotSize', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Facing Direction</Label>
                <Select value={formData?.plotFacing || 'North'} onValueChange={v => set('plotFacing', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price per Sqft (₹)</Label>
                <Input value={formData?.pricePerSqft || ''} onChange={e => set('pricePerSqft', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        )}

        {baseType === 'House' && (
          <Card className="border border-border shadow-md bg-card">
            <CardHeader><CardTitle className="text-foreground">House Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>House Size (e.g. 1200 Sq Ft)</Label>
                <Input value={formData?.houseSize || ''} onChange={e => set('houseSize', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Input type="number" value={formData?.bedrooms || ''} onChange={e => set('bedrooms', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Input type="number" value={formData?.bathrooms || ''} onChange={e => set('bathrooms', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Floors</Label>
                <Input type="number" value={formData?.floors || ''} onChange={e => set('floors', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        )}

        {baseType === 'Land' && (
          <Card className="border border-border shadow-md bg-card">
            <CardHeader><CardTitle className="text-foreground">Land Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Land Size (e.g. 2 Acres)</Label>
                <Input value={formData?.landSize || ''} onChange={e => set('landSize', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Land Type</Label>
                <Select value={formData?.landType || 'Residential'} onValueChange={v => set('landType', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Residential', 'Agricultural', 'Commercial', 'Industrial'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Images */}
        <Card className="border border-border shadow-md bg-card">
          <CardHeader><CardTitle className="flex items-center gap-2 text-foreground"><ImageIcon className="h-5 w-5 text-primary" /> Property Images</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {(formData?.images || []).map((img: string, i: number) => (
                <div key={i} className="relative h-24 w-24 rounded-xl overflow-hidden border border-border group">
                  <img src={img} alt={`property-${i}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              ))}
              {(formData?.images?.length || 0) < 5 && (
                <label className="h-24 w-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 transition-colors">
                  {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
                  <span className="text-xs text-muted-foreground mt-1">{isUploading ? 'Uploading...' : 'Add Image'}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Up to 5 images. Click an image to remove it.</p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4 pb-8">
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-2xl h-12 px-8"
          >
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
