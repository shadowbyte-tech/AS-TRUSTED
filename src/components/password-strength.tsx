'use client';

import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { validatePasswordStrength, type PasswordStrengthResult } from '@/lib/enhanced-auth';
import { useEffect, useState } from 'react';

interface PasswordStrengthProps {
  password: string;
  showFeedback?: boolean;
  className?: string;
}

export function PasswordStrength({ password, showFeedback = true, className = '' }: PasswordStrengthProps) {
  const [strength, setStrength] = useState<PasswordStrengthResult | null>(null);

  useEffect(() => {
    if (password) {
      const result = validatePasswordStrength(password);
      setStrength(result);
    } else {
      setStrength(null);
    }
  }, [password]);

  if (!strength || !password) {
    return null;
  }

  const getStrengthColor = (strengthLevel: string) => {
    switch (strengthLevel) {
      case 'Very Strong': return 'text-green-600';
      case 'Strong': return 'text-green-500';
      case 'Good': return 'text-blue-500';
      case 'Fair': return 'text-yellow-500';
      case 'Weak': return 'text-orange-500';
      case 'Very Weak': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStrengthIcon = (strengthLevel: string) => {
    switch (strengthLevel) {
      case 'Very Strong':
      case 'Strong':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Good':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'Fair':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        {getStrengthIcon(strength.strength)}
        <span className={`text-sm font-medium ${getStrengthColor(strength.strength)}`}>
          {strength.strength}
        </span>
        <span className="text-sm text-muted-foreground">
          ({strength.score}/100)
        </span>
      </div>
      
      <div className="relative">
        <Progress value={strength.score} className="h-2" />
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${getProgressColor(strength.score)}`}
          style={{ width: `${strength.score}%` }}
        />
      </div>
      
      {showFeedback && strength.feedback.length > 0 && (
        <Alert className={strength.isValid ? 'border-blue-200' : 'border-orange-200'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {strength.feedback.join(', ')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default PasswordStrength;