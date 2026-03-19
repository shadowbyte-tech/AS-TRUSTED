
'use client';

import { Wand2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AIFallbackProps {
  featureName: string;
  onRetry?: () => void;
  isLoading?: boolean;
}

export default function AIFallback({ featureName, onRetry, isLoading = false }: AIFallbackProps) {
  return (
    <Card className="border-dashed border-primary/20 bg-primary/5 shadow-none overflow-hidden group">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Wand2 className="h-6 w-6" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full animate-pulse border-2 border-background">
              !
            </Badge>
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-bold text-lg">{featureName} Temporarily Unavailable</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Our AI engine is currently under maintenance or encountering heavy load. We're working on restoring this feature.
          </p>
        </div>

        <div className="flex gap-2">
          {onRetry && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRetry} 
              disabled={isLoading}
              className="rounded-full border-primary/20 hover:bg-primary/10 transition-colors"
            >
              {isLoading ? (
                <RefreshCcw className="h-3.5 w-3.5 mr-2 animate-spin" />
              ) : (
                <RefreshCcw className="h-3.5 w-3.5 mr-2" />
              )}
              Try Again
            </Button>
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            className="rounded-full text-xs font-medium hover:bg-transparent hover:text-primary transition-colors"
            asChild
          >
            <a href="https://wa.me/919866404090?text=I'm%20experiencing%20issues%20with%20the%20AI%20features." target="_blank" rel="noopener noreferrer">
              Support
            </a>
          </Button>
        </div>
      </CardContent>
      
      {/* Decorative gradient corners */}
      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-16 w-16 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
    </Card>
  );
}
