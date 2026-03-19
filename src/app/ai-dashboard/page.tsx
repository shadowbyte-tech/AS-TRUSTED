'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Star, 
  TrendingUp,
  Shield,
  Rocket,
  Home,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function AIDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [propertyDescription, setPropertyDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [hasAIAccess, setHasAIAccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/ai-access');
      return;
    }

    // Check if user has AI access
    const checkAIAccess = async () => {
      try {
        const response = await fetch('/api/ai-access/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail: user.email })
        });
        
        if (response.ok) {
          const data = await response.json();
          setHasAIAccess(data.hasAIAccess);
          if (!data.hasAIAccess) {
            router.push('/ai-access');
          }
        } else {
          router.push('/ai-access');
        }
      } catch (error) {
        console.error('Failed to check AI access:', error);
        router.push('/ai-access');
      }
    };

    checkAIAccess();
  }, [user, router]);

  const generateAIDescription = async () => {
    if (!propertyDescription.trim() || !location.trim() || !price.trim()) {
      alert('Please fill in all property details');
      return;
    }

    setLoading(true);
    setAiResult('');

    try {
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'property-description',
          propertyDescription,
          location,
          price: parseFloat(price),
          userEmail: user?.email || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiResult(data.result);
      } else {
        const errorData = await response.json();
        alert(`AI generation failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate AI content');
    } finally {
      setLoading(false);
    }
  };

  const generateVastuAnalysis = async () => {
    if (!propertyDescription.trim() || !location.trim()) {
      alert('Please fill in property description and location');
      return;
    }

    setLoading(true);
    setAiResult('');

    try {
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'vastu-analysis',
          propertyDescription,
          location,
          userEmail: user?.email || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiResult(data.result);
      } else {
        const errorData = await response.json();
        alert(`AI generation failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate AI content');
    } finally {
      setLoading(false);
    }
  };

  const generateInvestmentInsights = async () => {
    if (!location.trim() || !price.trim()) {
      alert('Please fill in location and price');
      return;
    }

    setLoading(true);
    setAiResult('');

    try {
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'investment-insights',
          location,
          price: parseFloat(price),
          userEmail: user?.email || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiResult(data.result);
      } else {
        const errorData = await response.json();
        alert(`AI generation failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate AI content');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !hasAIAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p>Loading AI Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* AI Dashboard Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8" />
                <h1 className="text-2xl font-bold">AI Dashboard</h1>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                Premium AI Active
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm opacity-90">Welcome back,</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Property Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate compelling property descriptions using AI
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                onClick={() => setAiResult('')}
              >
                Generate Description
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                AI VASTU Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Get VASTU analysis and recommendations
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                onClick={() => setAiResult('')}
              >
                VASTU Analysis
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                AI Investment Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                AI-powered investment recommendations
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                onClick={() => setAiResult('')}
              >
                Investment Insights
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Input Form */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Property Description</label>
                <Textarea
                  placeholder="Describe the property (size, type, features, etc.)"
                  value={propertyDescription}
                  onChange={(e) => setPropertyDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="e.g., Kamareddy, Sitaramnagar Colony"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Price (₹)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 2500000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                onClick={generateAIDescription}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate Description
                  </div>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={generateVastuAnalysis}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    VASTU Analysis
                  </div>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={generateInvestmentInsights}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Investment Insights
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Results */}
        {aiResult && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                AI Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg border border-primary/20">
                <div className="whitespace-pre-wrap text-sm">{aiResult}</div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(aiResult)}
                >
                  Copy Results
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAiResult('')}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
