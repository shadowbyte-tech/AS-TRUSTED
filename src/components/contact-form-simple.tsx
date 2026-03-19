'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createContact, updateContact } from '@/lib/actions';
import type { Contact } from '@/lib/definitions';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Save, Loader2, User, Mail, Phone, Landmark, ShoppingCart, StickyNote, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ContactForm({ contact }: { contact?: Contact }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const action = contact ? updateContact.bind(null, contact.id) : createContact;
      
      // Call the server action with proper error handling
      let result;
      try {
        result = await action({}, formData);
      } catch (serverActionError) {
        console.error('Server action error:', serverActionError);
        toast({
          title: 'Server Error',
          description: 'Failed to process your request. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || 'Contact saved successfully!',
        });
        
        // Redirect after successful submission
        setTimeout(() => {
          router.push('/dashboard/contacts');
        }, 1500);
      } else {
        setErrors(result.errors || {});
        toast({
          title: 'Error',
          description: result.message || 'Failed to save contact',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Name</Label>
              <Input id="name" name="name" placeholder="e.g., John Doe" defaultValue={contact?.name} required />
              {errors.name?.map((error, index) => (
                <p key={index} className="text-sm text-red-600">{error}</p>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email</Label>
              <Input id="email" name="email" type="email" placeholder="e.g., john@example.com" defaultValue={contact?.email} required />
              {errors.email?.map((error, index) => (
                <p key={index} className="text-sm text-red-600">{error}</p>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Phone</Label>
              <Input id="phone" name="phone" placeholder="e.g., +91 98765 43210" defaultValue={contact?.phone} required />
              {errors.phone?.map((error, index) => (
                <p key={index} className="text-sm text-red-600">{error}</p>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center"><ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />Type</Label>
              <Select name="type" defaultValue={contact?.type || 'Buyer'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contact type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buyer">Buyer</SelectItem>
                  <SelectItem value="Seller">Seller</SelectItem>
                  <SelectItem value="Investor">Investor</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.type?.map((error, index) => (
                <p key={index} className="text-sm text-red-600">{error}</p>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center"><StickyNote className="mr-2 h-4 w-4 text-muted-foreground" />Notes</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              placeholder="Add any additional notes about this contact..."
              rows={4}
              defaultValue={contact?.notes}
            />
            {errors.notes?.map((error, index) => (
              <p key={index} className="text-sm text-red-600">{error}</p>
            ))}
          </div>

          {errors.message && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/dashboard/contacts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contacts
            </Link>
          </Button>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {contact ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {contact ? 'Save Changes' : 'Create Contact'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
