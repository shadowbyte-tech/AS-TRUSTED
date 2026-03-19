
import AuthGuard from '@/components/auth-guard';
import ContactForm from '@/components/contact-form-simple';

export default function AddContactPage() {
  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto p-4">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Add New Contact</h1>
          <p className="text-muted-foreground">
            Fill in the details below to add a new contact to your records.
          </p>
        </div>
        <ContactForm />
      </div>
    </AuthGuard>
  );
}
