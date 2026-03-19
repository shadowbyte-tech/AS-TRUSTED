'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  Send, 
  Mic, 
  Sparkles,
  TrendingUp,
  Target,
  Clock,
  MapPin,
  DollarSign,
  Shield,
  Lightbulb,
  Home,
  Search,
  Filter,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  User,
  Zap
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  propertyRecommendations?: any[];
}

interface PersonalAIAdvisorProps {
  userId: string;
  userPreferences?: {
    investmentRange: [number, number];
    preferredLocations: string[];
    propertyTypes: string[];
    riskTolerance: 'low' | 'medium' | 'high';
  };
}

export function PersonalAIAdvisor({ userId, userPreferences }: PersonalAIAdvisorProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: AIMessage = {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your personal AI Property Advisor. I can help you:

🔍 Find the perfect property based on your preferences
📈 Analyze investment opportunities
🧮 Calculate ROI projections
🏆 Compare properties side-by-side
📊 Track market trends in your areas of interest

Try asking me: "Show me plots under ₹20L near highway" or "Which is safer - Plot A or B?"`,
      timestamp: new Date(),
      suggestions: [
        "Find properties under ₹20L",
        "Show high-growth areas",
        "Compare investment options",
        "Analyze market trends"
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = async (userMessage: string): Promise<AIMessage> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let response = '';
    let propertyRecommendations: any[] = [];
    let suggestions: string[] = [];

    // Pattern matching for different query types
    if (lowerMessage.includes('under') || lowerMessage.includes('below') || lowerMessage.includes('less than')) {
      const priceMatch = userMessage.match(/₹?(\d+)l/i);
      if (priceMatch) {
        const budget = parseInt(priceMatch[1]) * 100000;
        response = `I found several excellent properties under ₹${priceMatch[1]}L. Based on market analysis, these areas offer the best value in your budget range:

🏆 **Top Recommendations:**
1. **Kamareddy** - ₹${(budget * 0.8).toLocaleString()} avg, 18% growth potential
2. **Sircilla** - ₹${(budget * 0.7).toLocaleString()} avg, 22% growth potential  
3. **Nizamabad** - ₹${(budget * 0.9).toLocaleString()} avg, 15% growth potential

Would you like me to show specific plots in any of these areas?`;
        suggestions = ["Show Kamareddy plots", "Analyze Sircilla growth", "Compare these areas"];
      }
    } else if (lowerMessage.includes('compare') || lowerMessage.includes('better') || lowerMessage.includes('safer')) {
      response = `I'd be happy to help you compare properties! To give you the most accurate analysis, I'll need:

📋 **Property Details:**
- Property IDs or locations
- Your investment budget
- Investment timeline (1yr, 3yr, 5yr+)
- Risk preference (conservative/moderate/aggressive)

🔍 **I can compare:**
- Investment scores & ROI projections
- Infrastructure development potential
- Risk factors & legal safety
- Market appreciation trends
- Location advantages

Could you share the specific properties you'd like me to analyze?`;
      suggestions = ["Compare Plot A vs Plot B", "Analyze investment safety", "Show ROI comparison"];
    } else if (lowerMessage.includes('growth') || lowerMessage.includes('trend') || lowerMessage.includes('hot')) {
      response = `🔥 **Current Hot Zones for Investment:**

**🥇 #1 Kamareddy Corridor**
- Growth: 18-22% annually
- Catalysts: Metro extension, IT park development
- Entry price: ₹8-15L for plots

**🥈 #2 Sircilla Industrial Belt**  
- Growth: 20-25% annually
- Catalysts: New highway, industrial expansion
- Entry price: ₹6-12L for plots

**🥉 #3 Nizamabad Periphery**
- Growth: 15-18% annually
- Catalysts: Infrastructure upgrades, connectivity
- Entry price: ₹10-20L for plots

📊 **My Recommendation:** Kamareddy offers the best balance of growth potential and infrastructure development for 2024-2025.

Would you like detailed analysis of any specific area?`;
      suggestions = ["Analyze Kamareddy", "Compare all 3 areas", "Show entry-level options"];
    } else if (lowerMessage.includes('show') || lowerMessage.includes('find') || lowerMessage.includes('search')) {
      response = `🔍 I'll help you find the perfect property! Let me know:

💰 **Budget:** What's your investment range?
📍 **Location:** Any preferred areas?
🏗️ **Property Type:** Plot, House, or Land?
⏰ **Timeline:** When are you planning to invest?

**Quick Options I can show:**
- Best properties under ₹20L
- Highway-adjacent plots
- High-growth potential areas
- Ready-to-build plots

What would you like to explore?`;
      suggestions = ["Show under ₹20L", "Highway plots", "High growth areas", "Ready to build"];
    } else {
      response = `I understand you're interested in property investment. Let me help you make the best decision!

🤖 **What I can do for you:**
- Find properties matching your exact criteria
- Analyze investment potential & risks
- Compare multiple properties side-by-side  
- Calculate ROI projections with different scenarios
- Track market trends and infrastructure development
- Provide personalized recommendations based on your goals

💡 **Try asking me:**
- "Find plots under ₹15L near highway"
- "Which area has better growth - Kamareddy or Sircilla?"
- "Show me properties with 20%+ growth potential"
- "What's the best investment for ₹25L?"

What specific aspect of property investment would you like to explore?`;
      suggestions = ["Find investment properties", "Analyze growth areas", "Calculate ROI", "Compare locations"];
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions,
      propertyRecommendations
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setSuggestions(aiResponse.suggestions || []);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      
      recognition.start();
    } else {
      alert('Voice input is not supported in your browser');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* AI Advisor Header */}
      <Card className="border-2 border-primary/20 mb-4">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary animate-pulse" />
              <span>Personal AI Property Advisor</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800">
                <Sparkles className="h-3 w-3 mr-1" />
                Online
              </Badge>
              <Badge variant="outline" className="text-xs">
                GPT-4 Powered
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-primary/5 rounded-lg">
              <Target className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-xs font-medium">Smart Search</div>
            </div>
            <div className="p-3 bg-emerald-5 rounded-lg">
              <BarChart3 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-xs font-medium">ROI Analysis</div>
            </div>
            <div className="p-3 bg-blue-5 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-medium">Market Trends</div>
            </div>
            <div className="p-3 bg-amber-5 rounded-lg">
              <Shield className="h-5 w-5 text-amber-600 mx-auto mb-1" />
              <div className="text-xs font-medium">Risk Assessment</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-primary">AI Advisor</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs h-6"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary animate-pulse" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input Area */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about property investment..."
                className="pr-12"
              />
              {input.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setInput('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  ×
                </Button>
              )}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              className={`relative ${isListening ? 'bg-red-50 text-red-600' : ''}`}
            >
              <Mic className="h-4 w-4" />
              {isListening && (
                <div className="absolute inset-0 border-2 border-red-400 rounded animate-pulse" />
              )}
            </Button>
            
            <Button 
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Find properties under ₹20L")}
              className="text-xs"
            >
              <Search className="h-3 w-3 mr-1" />
              Under ₹20L
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Show high-growth areas")}
              className="text-xs"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Hot Zones
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Compare investment options")}
              className="text-xs"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Compare
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Analyze market trends")}
              className="text-xs"
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
