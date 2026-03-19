'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Home, Building, MapPin } from 'lucide-react';

export default function UploadPropertyPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to select-type page
    router.push('/upload-property/select-type');
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to property upload...</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
