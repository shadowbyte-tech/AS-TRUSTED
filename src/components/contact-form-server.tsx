
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Contact } from '@/lib/definitions';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, Save, Loader2, User, Mail, Phone, Landmark, ShoppingCart, StickyNote, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ContactForm({ contact }: { contact?: Contact }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const body = {
      name:  formData.get('name')  as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      type:  formData.get('type')  as string,
      notes: formData.get('notes') as string,
    };
    try {
      const url = contact ? `/api/contacts/${contact.id}` : '/api/contacts';
      const res = await fetch(url, { method: contact ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await res.json();
      if (res.ok && result.success) {
        toast({ title: 'Success', description: contact ? 'Contact updated!' : 'Contact created!' });
        setTimeout(() => router.push('/dashboard/contacts'), 1200);
      } else {
        setErrors(result.errors || {});
        toast({ title: 'Error', description: result.error || 'Failed to save contact', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Name</Label>
              <Input id="name" name="name" placeholder="e.g., John Doe" defaultValue={contact?.name} required />
              {errors.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="e.g., +91 98765 43210" defaultValue={contact?.phone} required />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email</Label>
              <Input id="email" name="email" type="email" placeholder="e.g., john@example.com" defaultValue={contact?.email} required />
              {errors.email && <p className="text-sm text-destructive">{errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center"><Landmark className="mr-2 h-4 w-4 text-muted-foreground" />Contact Type</Label>
              <Select name="type" defaultValue={contact?.type || 'Buyer'}>
                <SelectTrigger id="type"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Seller"><div className="flex items-center"><Landmark className="mr-2 h-4 w-4" />Seller</div></SelectItem>
                  <SelectItem value="Buyer"><div className="flex items-center"><ShoppingCart className="mr-2 h-4 w-4" />Buyer</div></SelectItem>
                  <SelectItem value="Investor">Investor</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center"><StickyNote className="mr-2 h-4 w-4 text-muted-foreground" />Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Additional notes..." defaultValue={contact?.notes} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/contacts"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{contact ? 'Saving...' : 'Creating...'}</> : <><Save className="mr-2 h-4 w-4" />{contact ? 'Save Changes' : 'Create Contact'}</>}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

