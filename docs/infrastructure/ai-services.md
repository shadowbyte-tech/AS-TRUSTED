# AI Services Integration
# FREE AI MODELS AND APIS

## Setup Free AI Services

### 1. HuggingFace Free API
```bash
# Install HuggingFace client
npm install @huggingface/inference
```

### 2. OpenAI Free Credits
```bash
# Install OpenAI client
npm install openai
```

### 3. Google Gemini Free API
```bash
# Install Google AI client
npm install @google/generative-ai
```

## AI Service Configuration
# src/shared/utils/ai-services.ts
```typescript
import { HfInference } from '@huggingface/inference';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize AI clients
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export class AIService {
  // Property Description Generator
  static async generatePropertyDescription(property: {
    type: string;
    size: string;
    location: string;
    features: string[];
    price: number;
  }): Promise<string> {
    try {
      const prompt = `
        Generate a compelling real estate description for the following property:
        
        Type: ${property.type}
        Size: ${property.size}
        Location: ${property.location}
        Features: ${property.features.join(', ')}
        Price: ₹${property.price.toLocaleString('en-IN')}
        
        Requirements:
        - Make it engaging and professional
        - Highlight key features
        - Include location benefits
        - Keep it under 200 words
        - Use emojis sparingly for appeal
        - Focus on investment potential
        
        Description:
      `;

      // Try HuggingFace first (free)
      try {
        const response = await hf.textGeneration({
          model: 'mistralai/Mistral-7B-Instruct-v0.2',
          inputs: prompt,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9,
          }
        });
        
        return response.generated_text.trim();
      } catch (hfError) {
        console.warn('HuggingFace failed, trying Gemini:', hfError.message);
        
        // Fallback to Gemini (free tier)
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
    } catch (error) {
      console.error('AI description generation failed:', error);
      return this.generateFallbackDescription(property);
    }
  }
  
  // Property Recommendation System
  static async getPropertyRecommendations(userPreferences: {
    budget: number;
    propertyType: string;
    location: string;
    features: string[];
  }, availableProperties: any[]): Promise<any[]> {
    try {
      const prompt = `
        Based on the following user preferences, recommend the top 5 properties:
        
        User Preferences:
        - Budget: ₹${userPreferences.budget.toLocaleString('en-IN')}
        - Property Type: ${userPreferences.propertyType}
        - Location: ${userPreferences.location}
        - Features: ${userPreferences.features.join(', ')}
        
        Available Properties:
        ${availableProperties.map(p => `
          ID: ${p.id}
          Type: ${p.type}
          Size: ${p.size}
          Location: ${p.location}
          Price: ₹${p.price.toLocaleString('en-IN')}
          Features: ${p.features.join(', ')}
        `).join('\n')}
        
        Instructions:
        - Score each property from 0-100 based on match
        - Consider budget, location, features, and type
        - Return top 5 recommendations
        - Include brief reasoning for each
        
        Format as JSON:
        {
          "recommendations": [
            {
              "propertyId": "id",
              "score": 85,
              "reasoning": "Perfect match for budget and location",
              "priority": "high"
            }
          ]
        }
      `;

      // Use Gemini for complex reasoning
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]).recommendations;
      }
      
      return this.generateFallbackRecommendations(userPreferences, availableProperties);
    } catch (error) {
      console.error('AI recommendation failed:', error);
      return this.generateFallbackRecommendations(userPreferences, availableProperties);
    }
  }
  
  // Smart Search Enhancement
  static async enhanceSearchQuery(query: string): Promise<{
    enhancedQuery: string;
    suggestions: string[];
    filters: Record<string, any>;
  }> {
    try {
      const prompt = `
        Enhance this real estate search query: "${query}"
        
        Provide:
        1. Enhanced search query (more specific)
        2. Alternative search suggestions (3-5)
        3. Inferred filters (property type, budget range, etc.)
        
        Format as JSON:
        {
          "enhancedQuery": "2 BHK apartments in Hyderabad under 50 lakhs",
          "suggestions": [
            "2 BHK flats Hyderabad",
            "Hyderabad apartments 50 lakhs",
            "Budget 2 BHK Hyderabad"
          ],
          "filters": {
            "propertyType": "apartment",
            "bedrooms": 2,
            "maxPrice": 5000000,
            "location": "Hyderabad"
          }
        }
      `;

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        enhancedQuery: query,
        suggestions: [],
        filters: {}
      };
    } catch (error) {
      console.error('Search enhancement failed:', error);
      return {
        enhancedQuery: query,
        suggestions: [],
        filters: {}
      };
    }
  }
  
  // Lead Scoring
  static async scoreLead(leadData: {
    name: string;
    email: string;
    phone: string;
    budget: string;
    timeline: string;
    propertyType: string;
    location: string;
    message: string;
  }): Promise<{
    score: number;
    category: 'hot' | 'warm' | 'cold';
    reasoning: string[];
  }> {
    try {
      const prompt = `
        Score this real estate lead based on conversion potential:
        
        Lead Data:
        Name: ${leadData.name}
        Email: ${leadData.email}
        Phone: ${leadData.phone}
        Budget: ${leadData.budget}
        Timeline: ${leadData.timeline}
        Property Type: ${leadData.propertyType}
        Location: ${leadData.location}
        Message: ${leadData.message}
        
        Scoring Criteria:
        - Budget clarity and realism (0-25 points)
        - Timeline urgency (0-20 points)
        - Contact information completeness (0-15 points)
        - Message detail and intent (0-20 points)
        - Property type specificity (0-10 points)
        - Location specificity (0-10 points)
        
        Total score: 0-100
        Category: hot (80-100), warm (50-79), cold (0-49)
        
        Provide reasoning for scoring.
        
        Format as JSON:
        {
          "score": 75,
          "category": "warm",
          "reasoning": [
            "Clear budget range specified",
            "Urgent timeline indicated",
            "Detailed inquiry message"
          ]
        }
      `;

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.generateFallbackLeadScore(leadData);
    } catch (error) {
      console.error('Lead scoring failed:', error);
      return this.generateFallbackLeadScore(leadData);
    }
  }
  
  // Market Analysis
  static async analyzeMarketTrends(location: string, propertyType: string): Promise<{
    priceTrend: 'rising' | 'stable' | 'declining';
    averagePrice: number;
    demandLevel: 'high' | 'medium' | 'low';
    investmentAdvice: string;
  }> {
    try {
      const prompt = `
        Analyze real estate market trends for:
        Location: ${location}
        Property Type: ${propertyType}
        
        Provide analysis on:
        1. Price trend (rising/stable/declining)
        2. Average price range
        3. Demand level (high/medium/low)
        4. Investment advice
        
        Consider current market conditions, infrastructure development, and future prospects.
        
        Format as JSON:
        {
          "priceTrend": "rising",
          "averagePrice": 4500000,
          "demandLevel": "high",
          "investmentAdvice": "Good investment opportunity with expected appreciation"
        }
      `;

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.generateFallbackMarketAnalysis();
    } catch (error) {
      console.error('Market analysis failed:', error);
      return this.generateFallbackMarketAnalysis();
    }
  }
  
  // Fallback methods
  private static generateFallbackDescription(property: any): string {
    const templates = [
      `🏠 ${property.type} in ${property.location} - ${property.size} available at ₹${property.price.toLocaleString('en-IN')}. Features include ${property.features.join(', ')}. Perfect for your dream home! 🌟`,
      `🔑 Premium ${property.type} in ${property.location} offering ${property.size}. Priced at ₹${property.price.toLocaleString('en-IN')} with excellent amenities: ${property.features.join(', ')}. Book your visit today! 📅`,
      `🌟 Spacious ${property.type} in prime ${property.location} location. ${property.size} property with ${property.features.join(', ')}. Great investment at ₹${property.price.toLocaleString('en-IN')}! 💰`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  private static generateFallbackRecommendations(preferences: any, properties: any[]): any[] {
    return properties
      .filter(p => p.price <= preferences.budget * 1.1)
      .slice(0, 5)
      .map((property, index) => ({
        propertyId: property.id,
        score: 80 - (index * 10),
        reasoning: `Matches budget and location preferences`,
        priority: index === 0 ? 'high' : 'medium'
      }));
  }
  
  private static generateFallbackLeadScore(leadData: any): any {
    let score = 30; // Base score
    
    if (leadData.budget && leadData.budget !== 'any') score += 20;
    if (leadData.timeline && leadData.timeline !== 'any') score += 15;
    if (leadData.phone) score += 15;
    if (leadData.message && leadData.message.length > 50) score += 10;
    if (leadData.propertyType && leadData.propertyType !== 'any') score += 5;
    if (leadData.location && leadData.location !== 'any') score += 5;
    
    const category = score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'cold';
    
    return {
      score,
      category,
      reasoning: [`Score: ${score} based on provided information`]
    };
  }
  
  private static generateFallbackMarketAnalysis(): any {
    return {
      priceTrend: 'stable',
      averagePrice: 3500000,
      demandLevel: 'medium',
      investmentAdvice: 'Market conditions are stable for investment'
    };
  }
}
```

## AI API Routes
# src/services/ai-service/routes/ai.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/shared/utils/ai-services';
import { validateInput } from '@/shared/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();
    
    // Validate input
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      );
    }
    
    let result;
    
    switch (type) {
      case 'generate-description':
        result = await AIService.generatePropertyDescription(data);
        break;
        
      case 'get-recommendations':
        result = await AIService.getPropertyRecommendations(data.preferences, data.properties);
        break;
        
      case 'enhance-search':
        result = await AIService.enhanceSearchQuery(data.query);
        break;
        
      case 'score-lead':
        result = await AIService.scoreLead(data);
        break;
        
      case 'analyze-market':
        result = await AIService.analyzeMarketTrends(data.location, data.propertyType);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid AI service type' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    console.error('AI service error:', error);
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 500 }
    );
  }
}
```

## Frontend AI Integration
# src/components/ai-property-generator.tsx
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';

interface AIPropertyGeneratorProps {
  onDescriptionGenerated: (description: string) => void;
  propertyData: any;
}

export function AIPropertyGenerator({ onDescriptionGenerated, propertyData }: AIPropertyGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  
  const generateDescription = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generate-description',
          data: propertyData
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setGeneratedDescription(result.data);
        onDescriptionGenerated(result.data);
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Description Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate a compelling property description using AI
        </p>
        
        <Button 
          onClick={generateDescription}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Description
            </>
          )}
        </Button>
        
        {generatedDescription && (
          <Textarea
            value={generatedDescription}
            onChange={(e) => setGeneratedDescription(e.target.value)}
            placeholder="AI-generated description will appear here..."
            className="min-h-[100px]"
          />
        )}
      </CardContent>
    </Card>
  );
}
```

## Environment Variables
```env
# AI Service Keys (FREE)
HUGGINGFACE_API_KEY=your_huggingface_api_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key

# AI Configuration
AI_SERVICE_PRIMARY=gemini
AI_SERVICE_FALLBACK=huggingface
AI_MAX_TOKENS=250
AI_TEMPERATURE=0.7
```

## Usage Examples
```typescript
// Generate property description
const description = await AIService.generatePropertyDescription({
  type: '2 BHK Apartment',
  size: '1200 sqft',
  location: 'Hyderabad, Gachibowli',
  features: ['Parking', 'Power Backup', 'Gym', 'Security'],
  price: 4500000
});

// Get property recommendations
const recommendations = await AIService.getPropertyRecommendations(
  {
    budget: 5000000,
    propertyType: 'apartment',
    location: 'Hyderabad',
    features: ['parking', 'gym']
  },
  availableProperties
);

// Enhance search query
const enhanced = await AIService.enhanceSearchQuery('2 bhk flat hyderabad');

// Score lead
const leadScore = await AIService.scoreLead({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 9876543210',
  budget: '50-60 lakhs',
  timeline: '3 months',
  propertyType: 'apartment',
  location: 'Hyderabad',
  message: 'Looking for 2 BHK apartment in Hyderabad with parking and gym facilities.'
});
```
