'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Send, 
  Mic, 
  Sparkles,
  TrendingUp,
  Target,
  Lightbulb,
  Home,
  Search,
  MapPin,
  DollarSign,
  Star,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Zap,
  Eye,
  Heart,
  Camera,
  FileText,
  Settings,
  Wand2
} from 'lucide-react';

interface PropertyListingSuggestion {
  title: string;
  description: string;
  field: string;
  priority: 'high' | 'medium' | 'low';
  example?: string;
}

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: PropertyListingSuggestion[];
}

interface PropertyListingAIAssistantProps {
  propertyType: 'premium' | 'normal' | 'luxury';
  onFieldUpdate?: (field: string, value: string) => void;
  currentData?: Record<string, any>;
}

export function PropertyListingAIAssistant({ 
  propertyType, 
  onFieldUpdate, 
  currentData = {} 
}: PropertyListingAIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<PropertyListingSuggestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: AIMessage = {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI Property Listing Assistant. I'll help you create an irresistible ${propertyType} property listing that attracts buyers.

🎯 **What I can help with:**
• **Compelling titles** that grab attention
• **Persuasive descriptions** that sell the property
• **Optimal pricing** strategies
• **Highlighting key features** buyers love
• **Marketing keywords** that boost visibility
• **Professional photo tips**
• **Legal compliance** reminders

💡 **Let's start!** Tell me about your property or ask me for help with any section of the listing.`,
      timestamp: new Date(),
      suggestions: [
        {
          title: 'Create an attractive title',
          description: 'Generate a compelling property title that stands out',
          field: 'title',
          priority: 'high',
          example: 'Premium Highway-Front Plot with Metro Access - Kamareddy'
        },
        {
          title: 'Write a persuasive description',
          description: 'Craft a description that emotionally connects with buyers',
          field: 'description',
          priority: 'high',
          example: 'Strategically located premium plot with excellent connectivity...'
        },
        {
          title: 'Optimize pricing strategy',
          description: 'Get AI-powered pricing recommendations based on market data',
          field: 'price',
          priority: 'high'
        },
        {
          title: 'Highlight key features',
          description: 'Identify and emphasize the most attractive property features',
          field: 'features',
          priority: 'medium'
        }
      ]
    };
    setMessages([welcomeMessage]);
    setSuggestions(welcomeMessage.suggestions || []);
  }, [propertyType]);

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
    let newSuggestions: PropertyListingSuggestion[] = [];

    // Pattern matching for different query types
    if (lowerMessage.includes('title') || lowerMessage.includes('headline')) {
      response = `🎯 **Crafting an Irresistible Property Title**

Based on your ${propertyType} property type, here are powerful title options:

**🏆 Top Recommendations:**
1. **"Premium Highway-Front Plot | Metro Access | Kamareddy Growth Zone"**
2. **"Investment-Grade Land | IT Corridor Access | Immediate Appreciation"**
3. **"HMDA Approved Premium Plot | 40% Growth Potential | Ready to Build"**

**✨ Title Formula:**
[Location] + [Key Feature] + [Investment Benefit] + [Status]

**🔥 Power Words to Include:**
- Premium, Investment-Grade, Strategic
- Metro, Highway, IT Corridor
- Growth Zone, Appreciation, Ready-to-Build
- HMDA Approved, DTCP Approved

Would you like me to create a custom title based on your specific property details?`;
      
      newSuggestions = [
        {
          title: 'Generate custom title',
          description: 'Create a personalized title based on your property details',
          field: 'title',
          priority: 'high'
        },
        {
          title: 'Add urgency elements',
          description: 'Include scarcity and time-sensitive elements',
          field: 'title',
          priority: 'medium'
        }
      ];
    } else if (lowerMessage.includes('description') || lowerMessage.includes('details')) {
      response = `📝 **Crafting a Compelling Property Description**

Here's a proven structure for ${propertyType} property descriptions:

**🎯 Opening Hook (First 2 lines):**
"Discover this exceptional premium plot in Kamareddy's fastest-growing corridor, where infrastructure development meets investment opportunity."

**✨ Key Features Section:**
• **Strategic Location:** 500m from proposed metro station
• **Connectivity:** 2km from Hyderabad highway, excellent road access  
• **Investment Potential:** 40% appreciation expected in 24 months
• **Legal Clarity:** HMDA approved, clear title, ready for registration
• **Development Ready:** All utilities available, immediate construction possible

**💰 Investment Appeal:**
"This isn't just land; it's your gateway to Telangana's real estate boom. With the new metro extension and IT park development, early investors are seeing 25-35% annual returns."

**🏗️ Development Vision:**
"Perfect for both immediate construction and long-term investment. Build your dream home or develop a commercial property in this emerging business hub."

**⚡ Call-to-Action:**
"Only 3 premium plots remaining in this phase. Schedule your site visit today and secure your piece of Telangana's growth story."

Would you like me to customize this description for your specific property?`;
      
      newSuggestions = [
        {
          title: 'Customize description',
          description: 'Personalize the description with your property details',
          field: 'description',
          priority: 'high'
        },
        {
          title: 'Add emotional appeal',
          description: 'Include emotional triggers that connect with buyers',
          field: 'description',
          priority: 'medium'
        }
      ];
    } else if (lowerMessage.includes('price') || lowerMessage.includes('pricing')) {
      response = `💰 **AI-Powered Pricing Strategy for ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} Properties**

**📊 Market Analysis:**
• **Kamareddy Average:** ₹800-1200 per sq yard
• **Premium Hotspots:** ₹1200-1800 per sq yard  
• **Growth Areas:** ₹600-900 per sq yard (high appreciation potential)

**🎯 Pricing Recommendations:**

**Option 1: Market Penetration (Quick Sale)**
- Price: 10% below market average
- Benefit: Faster sale, higher buyer interest
- Best for: Quick liquidity needs

**Option 2: Market Positioning (Balanced)**
- Price: At market average
- Benefit: Good balance of speed and value
- Best for: Most sellers

**Option 3: Premium Positioning (Maximum Value)**
- Price: 15-20% above market average
- Benefit: Maximum returns, targets premium buyers
- Best for: Unique properties with special features

**💡 Pricing Psychology Tips:**
• Use odd numbers (₹19,99,999 instead of ₹20,00,000)
• Highlight value proposition in description
• Show comparable properties with higher prices
• Emphasize future infrastructure impact

**📈 Value-Boosting Strategies:**
• Highlight metro connectivity impact (+15-20% value)
• Mention IT park proximity (+12-18% value)  
• Emphasize HMDA approval (+8-12% value)
• Showcase development readiness (+5-10% value)

What's your property size and location? I'll give you a specific price recommendation!`;
      
      newSuggestions = [
        {
          title: 'Get specific price',
          description: 'Provide exact pricing based on your property details',
          field: 'price',
          priority: 'high'
        },
        {
          title: 'Create pricing tiers',
          description: 'Set up multiple pricing options for different buyer types',
          field: 'price',
          priority: 'medium'
        }
      ];
    } else if (lowerMessage.includes('features') || lowerMessage.includes('amenities')) {
      response = `⭐ **Highlighting Irresistible Property Features**

**🏆 Premium Property Features That Sell:**

**📍 Location Features (High Impact):**
• **Metro Access:** "5-min walk to proposed metro station"
• **Highway Connectivity:** "Direct access to Hyderabad highway"
• **IT Park Proximity:** "15-min drive to new IT hub"
• **Educational Hub:** "Near international schools and colleges"

**🏗️ Development Features:**
• **HMDA/DTCP Approved:** "Fully approved residential plot"
• **Clear Title:** "100% legal clarity, ready for registration"
• **Utilities Ready:** "Water, electricity, drainage connections available"
• **Road Access:** "40-ft blacktop road approach"

**💰 Investment Features:**
• **Growth Potential:** "40% appreciation expected in 24 months"
• **Rental Yield:** "High rental demand from IT professionals"
• **Development Timeline:** "Infrastructure completion in 18 months"
• **Exit Strategy:** "Easy resale with increasing demand"

**🌟 Lifestyle Features:**
• **Green Environment:** "Surrounded by parks and green spaces"
• **Security:** "Gated community with 24/7 security"
• **Community:** "Premium neighborhood with modern amenities"
• **Future-Ready:** "Smart city infrastructure planned"

**📸 Photo Opportunities:**
• Sunrise/sunset shots from the plot
• Road approach and accessibility
• Nearby landmarks and developments
• Underground utilities and connections

**✨ Feature Presentation Tips:**
• Use bullet points for easy reading
• Lead with the most impressive features
• Include specific measurements and distances
• Add emotional benefit to each feature

Which features does your property have? I'll help you present them compellingly!`;
      
      newSuggestions = [
        {
          title: 'Prioritize features',
          description: 'Identify your top 5 most valuable features',
          field: 'features',
          priority: 'high'
        },
        {
          title: 'Add benefit statements',
          description: 'Convert features into buyer benefits',
          field: 'features',
          priority: 'medium'
        }
      ];
    } else if (lowerMessage.includes('photo') || lowerMessage.includes('image')) {
      response = `📸 **Professional Property Photography Guide**

**🎯 Essential Shots for ${propertyType} Properties:**

**📐 Must-Have Photos:**
1. **Aerial View:** Drone shot showing location and surroundings
2. **Road Approach:** Wide shot showing accessibility
3. **Plot Boundaries:** Clear view of plot dimensions
4. **Nearby Landmarks:** Schools, hospitals, metro stations
5. **Infrastructure:** Road quality, utility connections

**🌅 Golden Hour Photography:**
• **Best Time:** 6-8 AM or 5-7 PM
• **Lighting:** Soft, warm light enhances appeal
• **Shadows:** Creates depth and dimension
• **Sky:** Beautiful blue or golden sky backgrounds

**📱 Mobile Photography Tips:**
• Use portrait mode for depth
• Clean lens before shooting
• Enable grid lines for straight horizons
• Shoot from multiple angles
• Include scale references (person/car)

**🎨 Photo Enhancement:**
• Brighten shadows slightly
• Enhance sky colors
• Remove temporary clutter
• Add subtle warmth to tones
• Ensure consistent lighting across photos

**📱 Video Content Ideas:**
• 360-degree plot tour
• Drone flyover of area
• Road approach video
• Time-lapse of sunrise/sunset
• Interview with local expert

**📝 Photo Descriptions:**
"Premium plot with metro access - 5 min walk to station"
"Ready-to-build land with all utilities available"
"Strategic location in Kamareddy growth corridor"

Would you like specific tips for photographing your property type?`;
      
      newSuggestions = [
        {
          title: 'Photo checklist',
          description: 'Get a complete shot list for your property',
          field: 'photos',
          priority: 'high'
        },
        {
          title: 'Video script',
          description: 'Create a compelling video walkthrough script',
          field: 'video',
          priority: 'medium'
        }
      ];
    } else {
      response = `🤖 **I'm here to help you create the perfect property listing!**

**🎯 What I can assist you with:**

**📝 Content Creation:**
• Compelling titles that grab attention
• Persuasive descriptions that sell
• Feature highlights that attract buyers
• Investment appeal that justifies price

**💰 Pricing Strategy:**
• Market-based pricing recommendations
• Competitive analysis
• Value proposition framing
• Psychology pricing techniques

**📸 Visual Content:**
• Professional photography guidance
• Video content ideas
• Image enhancement tips
• Visual storytelling

**🔍 Marketing Optimization:**
• SEO keywords for better visibility
• Buyer psychology insights
• Competitive positioning
• Conversion optimization

**⚡ Quick Start Options:**
• "Help me write a title"
• "Create a property description"  
• "Suggest a pricing strategy"
• "What photos should I take?"
• "How to highlight investment value"

**💡 Pro Tip:** Start with your property's most unique feature - that's what will make buyers stop scrolling!

What aspect of your property listing would you like help with first?`;
      
      newSuggestions = [
        {
          title: 'Start with title',
          description: 'Create an attention-grabbing property title',
          field: 'title',
          priority: 'high'
        },
        {
          title: 'Write description',
          description: 'Craft a compelling property description',
          field: 'description',
          priority: 'high'
        },
        {
          title: 'Set pricing',
          description: 'Get AI-powered pricing recommendations',
          field: 'price',
          priority: 'high'
        },
        {
          title: 'Photo guidance',
          description: 'Professional photography tips and shot list',
          field: 'photos',
          priority: 'medium'
        }
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions: newSuggestions
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

  const handleSuggestionClick = (suggestion: PropertyListingSuggestion) => {
    if (onFieldUpdate) {
      // Create a targeted message based on the suggestion
      let targetedMessage = '';
      switch (suggestion.field) {
        case 'title':
          targetedMessage = 'Help me create an attractive title for my premium property';
          break;
        case 'description':
          targetedMessage = 'Write a compelling description that will attract buyers';
          break;
        case 'price':
          targetedMessage = 'What is the best pricing strategy for my property?';
          break;
        case 'features':
          targetedMessage = 'Help me highlight the key features of my property';
          break;
        case 'photos':
          targetedMessage = 'What photos should I take for my property listing?';
          break;
        default:
          targetedMessage = `Help me with ${suggestion.title.toLowerCase()}`;
      }
      setInput(targetedMessage);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* AI Assistant Header */}
      <Card className="border-2 border-primary/20 mb-4">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary animate-pulse" />
              <span>Property Listing AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800">
                <Sparkles className="h-3 w-3 mr-1" />
                Active
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {propertyType} Expert
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-primary/5 rounded-lg">
              <Target className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-xs font-medium">Titles</div>
            </div>
            <div className="p-3 bg-emerald-5 rounded-lg">
              <FileText className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-xs font-medium">Descriptions</div>
            </div>
            <div className="p-3 bg-blue-5 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-medium">Pricing</div>
            </div>
            <div className="p-3 bg-purple-5 rounded-lg">
              <Camera className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <div className="text-xs font-medium">Photos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions Panel */}
      {suggestions.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>
                  {suggestion.example && (
                    <div className="text-xs bg-muted p-2 rounded italic">
                      Example: {suggestion.example}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Wand2 className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary">Click to apply</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                      <span className="text-xs font-medium text-primary">AI Assistant</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
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
                placeholder="Ask me anything about creating your property listing..."
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
              onClick={() => setInput("Help me create an attractive title")}
              className="text-xs"
            >
              <Target className="h-3 w-3 mr-1" />
              Title Help
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Write a compelling description")}
              className="text-xs"
            >
              <FileText className="h-3 w-3 mr-1" />
              Description
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("What's the best pricing strategy?")}
              className="text-xs"
            >
              <DollarSign className="h-3 w-3 mr-1" />
              Pricing
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("What photos should I take?")}
              className="text-xs"
            >
              <Camera className="h-3 w-3 mr-1" />
              Photos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
