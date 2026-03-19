'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">You're Offline</CardTitle>
          <CardDescription>
            It looks like you've lost your internet connection. Some features may not be available until you're back online.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Cached pages are still available</p>
            <p>• Your data will sync when you're back online</p>
            <p>• Try refreshing the page to reconnect</p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
