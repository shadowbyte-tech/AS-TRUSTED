'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Settings, 
  Key, 
  Shield, 
  Zap, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function AIManagementDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [premiumFeatures, setPremiumFeatures] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAIStatus();
    }
  }, [user]);

  const fetchAIStatus = async () => {
    try {
      const response = await fetch('/api/ai-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_ai_status', userEmail: user?.email || '' })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiStatus(data);
        setPremiumFeatures(data.hasPremiumAI);
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
      }
    } catch (error) {
      console.error('Failed to fetch AI status:', error);
    }
  };

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      alert('Please enter an API key');
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch('/api/ai-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'validate_api_key', 
          apiKey: apiKey.trim(),
          userEmail: user?.email || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        if (data.valid) {
          enablePremiumAI(data.apiKey);
        }
      } else {
        const errorData = await response.json();
        alert(`Validation failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Validation error:', error);
      alert('Failed to validate API key');
    } finally {
      setIsValidating(false);
    }
  };

  const enablePremiumAI = async (key: string) => {
    try {
      const response = await fetch('/api/ai-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'enable_premium_ai', 
          apiKey: key.trim(),
          userEmail: user?.email || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Premium AI features enabled successfully!');
        setPremiumFeatures(true);
        fetchAIStatus(); // Refresh status
      } else {
        alert('Failed to enable premium AI features');
      }
    } catch (error) {
      console.error('Enable premium AI error:', error);
      alert('Failed to enable premium AI features');
    }
  };

  const generateVastuAnalysis = async () => {
    try {
      const response = await fetch('/api/ai-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'generate_vastu_analysis', 
          feature: 'property_value',
          userEmail: user?.email || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`VASTU Analysis: ${data.analysis}`);
      } else {
        alert('Failed to generate VASTU analysis');
      }
    } catch (error) {
      console.error('VASTU analysis error:', error);
      alert('Failed to generate VASTU analysis');
    }
  };

  if (!user || user.role !== 'Owner') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">This dashboard is only available for system owners.</p>
            <Button asChild>
              <Link href="/user-login">Login</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black font-headline mb-2">
                🤖 AI Management Center
              </h1>
              <p className="text-muted-foreground">
                Manage AI features, API keys, and premium services for your real estate platform
              </p>
            </div>
            <Badge variant={premiumFeatures ? "default" : "secondary"} className="text-sm">
              {premiumFeatures ? "Premium AI Active" : "Basic AI"}
            </Badge>
          </div>

          {/* AI Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Service Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiStatus ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Service:</span>
                      <Badge variant={aiStatus.service ? "default" : "secondary"}>
                        {aiStatus.service || "Not Configured"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Key:</span>
                      <Badge variant={aiStatus.apiKey ? "default" : "destructive"}>
                        {aiStatus.apiKey ? "Configured" : "Not Set"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Validated:</span>
                      <span className="text-sm text-muted-foreground">
                        {aiStatus.lastValidated ? new Date(aiStatus.lastValidated).toLocaleDateString() : "Never"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Loading AI status...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Available Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiStatus?.availableFeatures?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">{feature}</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={generateVastuAnalysis}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Generate VASTU Analysis
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* API Key Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Key Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="apiKey" className="text-sm font-medium">
                    Enter API Key (sk-xxx format)
                  </label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk-antropic-xxx or sk-openai-xxx"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={validateApiKey}
                    disabled={isValidating}
                    className="flex-1"
                  >
                    {isValidating ? 'Validating...' : 'Validate & Enable'}
                  </Button>
                  
                  {aiStatus?.apiKey && (
                    <Button 
                      variant="outline"
                      onClick={() => setApiKey(aiStatus.apiKey)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Show Current
                    </Button>
                  )}
                </div>

                {aiStatus?.apiKey && (
                  <Alert>
                    <AlertDescription>
                      <strong>Current API Key:</strong> {aiStatus.apiKey.replace(/sk-\w+/, 'sk-***')}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mt-4 p-3 bg-muted/50 rounded-md">
                  <h4 className="font-medium mb-2">Supported AI Services:</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• <strong>Anthropic Claude:</strong> sk-antropic-xxx</div>
                    <div>• <strong>OpenAI GPT:</strong> sk-openai-xxx</div>
                    <div>• <strong>Google Gemini:</strong> sk-gemini-xxx</div>
                    <div>• <strong>HuggingFace:</strong> sk-huggingface-xxx</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Premium Features Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {premiumFeatures ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-800">Premium AI Active</div>
                        <div className="text-sm text-green-600">All advanced features enabled</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>VASTU Analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>Advanced Property Analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>Market Insights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>Automated Valuation</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="font-medium text-yellow-800">Basic AI Only</div>
                        <div className="text-sm text-yellow-600">Limited features available</div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => enablePremiumAI(apiKey)}
                      className="w-full"
                      disabled={!apiKey.trim()}
                    >
                      Enable Premium AI Features
                    </Button>
                    
                    <div className="text-sm text-muted-foreground mt-2">
                      Enter a valid API key above to unlock premium features
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                How AI Features Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">For Property Uploads</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Fill in property details (type, location, price, size)</li>
                    <li>Click "🤖 AI Generate" button for automatic description</li>
                    <li>Review and edit AI-generated description as needed</li>
                    <li>Upload property with images</li>
                  </ol>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">For VASTU Analysis</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Go to property details page</li>
                    <li>Click "Generate VASTU Analysis" in AI Management</li>
                    <li>Get detailed property insights and valuations</li>
                    <li>Receive investment recommendations</li>
                  </ol>
                </div>
              </div>
              
              <Alert>
                <AlertDescription>
                  <strong>🔒 Security Note:</strong> API keys are securely stored and only visible to system owners. 
                  Never share your API keys with unauthorized users.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
