
'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createContact, updateContact } from '@/lib/actions';
import type { Contact, State } from '@/lib/definitions';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, Save, Loader2, User, Mail, Phone, Landmark, ShoppingCart, StickyNote, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Saving...' : 'Creating...'}
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Save Changes' : 'Create Contact'}
                </>
            )}
        </Button>
    )
}

export default function ContactForm({ contact }: { contact?: Contact }) {
  const { toast } = useToast();
  const router = useRouter();
  const initialState: State = { message: null, errors: {}, success: false };
  
  const action = contact ? updateContact.bind(null, contact.id) : createContact;
  const [state, dispatch] = useActionState(action, initialState);

  useEffect(() => {
    if (state?.message && !state.success) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    } else if (state?.success && state?.message) {
      toast({
        title: 'Success',
        description: state.message,
      });
      // Redirect after successful submission
      setTimeout(() => {
        router.push('/dashboard/contacts');
      }, 1500);
    }
  }, [state, toast, router]);
  

  return (
    <form action={dispatch}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Name</Label>
              <Input id="name" name="name" placeholder="e.g., John Doe" defaultValue={contact?.name} required />
              {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="e.g., +1 234 567 890" defaultValue={contact?.phone} required />
              {state.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email</Label>
              <Input id="email" name="email" type="email" placeholder="e.g., john.doe@example.com" defaultValue={contact?.email} required />
              {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="type" className="flex items-center"><Landmark className="mr-2 h-4 w-4 text-muted-foreground" />Contact Type</Label>
                <Select name="type" defaultValue={contact?.type} required>
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select contact type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Seller"><div className="flex items-center"><Landmark className="mr-2 h-4 w-4" />Seller</div></SelectItem>
                        <SelectItem value="Buyer"><div className="flex items-center"><ShoppingCart className="mr-2 h-4 w-4" />Buyer</div></SelectItem>
                    </SelectContent>
                </Select>
                {state.errors?.type && <p className="text-sm text-destructive">{state.errors.type[0]}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
             <Label htmlFor="notes" className="flex items-center"><StickyNote className="mr-2 h-4 w-4 text-muted-foreground" />Notes</Label>
             <Textarea id="notes" name="notes" placeholder="e.g., Interested in plots in the Greenwood area. Budget is around..." defaultValue={contact?.notes} />
             {state.errors?.notes && <p className="text-sm text-destructive">{state.errors.notes[0]}</p>}
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
                <Link href="/dashboard/contacts">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Link>
            </Button>
            <SubmitButton isEditing={!!contact} />
        </CardFooter>
      </Card>
    </form>
  );
}
