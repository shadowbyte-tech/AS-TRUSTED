
import AuthGuard from '@/components/auth-guard';
import ContactForm from '@/components/contact-form-server';
import { getContacts } from '@/lib/supabase-actions';
import { notFound } from 'next/navigation';

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contacts = await getContacts();
  const contact = contacts.find(c => c.id === id);

  if (!contact) {
    notFound();
  }

  return (
    <AuthGuard>
       <div className="max-w-2xl mx-auto p-4">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Edit Contact Details</h1>
          <p className="text-muted-foreground">
            Update the information for {contact.name}. Click "Save Changes" when you're done.
          </p>
        </div>
        <ContactForm contact={contact} />
      </div>
    </AuthGuard>
  );
}
