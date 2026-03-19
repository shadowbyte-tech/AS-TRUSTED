import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/mongodb-database';

// Enhanced AI system with API key management and premium features
export async function POST(request: NextRequest) {
  try {
    const { action, apiKey, feature, userEmail } = await request.json();

    // Get current user for authorization
    const users = await readUsers();
    const currentUser = users.find(u => u.email === userEmail);

    if (!currentUser || currentUser.role !== 'Owner') {
      return NextResponse.json({ error: 'Unauthorized: Only owner can manage AI settings' }, { status: 403 });
    }

    switch (action) {
      case 'validate_api_key':
        return validateApiKey(apiKey);
      
      case 'enable_premium_ai':
        return enablePremiumAI(currentUser, apiKey);
        
      case 'get_ai_status':
        return getAIStatus(currentUser);
        
      case 'generate_vastu_analysis':
        return generateVastuAnalysis(feature, currentUser);
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('AI management error:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}

async function validateApiKey(apiKey: string): Promise<NextResponse> {
  // Simulate API key validation (in production, this would validate against actual AI service)
  const validKeys = [
    'sk-antropic-demo',
    'sk-openai-demo', 
    'sk-gemini-demo',
    'sk-huggingface-demo'
  ];

  const isValid = validKeys.includes(apiKey);
  
  return NextResponse.json({
    valid: isValid,
    service: isValid ? detectAIService(apiKey) : null,
    message: isValid ? 'API key is valid' : 'Invalid API key format',
    suggestions: !isValid ? [
      'Use format: sk-antropic-xxx',
      'Use format: sk-openai-xxx', 
      'Use format: sk-gemini-xxx',
      'Use format: sk-huggingface-xxx'
    ] : []
  });
}

async function enablePremiumAI(user: any, apiKey: string): Promise<NextResponse> {
  // Update user with premium AI features
  const users = await readUsers();
  const updatedUsers = users.map(u => 
    u.email === user.email 
      ? { ...u, premiumAI: true, aiApiKey: apiKey, aiFeatures: ['vastu', 'advanced_analysis', 'market_insights'] }
      : u
  );

  await writeUsers(updatedUsers);

  return NextResponse.json({
    success: true,
    message: 'Premium AI features enabled',
    features: ['VASTU Analysis', 'Advanced Property Analysis', 'Market Insights'],
    apiKey: apiKey.replace(/sk-\w+/, 'sk-***') // Hide sensitive part
  });
}

async function getAIStatus(user: any): Promise<NextResponse> {
  const hasPremiumAI = user.premiumAI || false;
  const apiKey = user.aiApiKey || null;
  
  return NextResponse.json({
    hasPremiumAI,
    apiKey: apiKey ? apiKey.replace(/sk-\w+/, 'sk-***') : null,
    availableFeatures: hasPremiumAI ? [
      'VASTU Analysis',
      'Advanced Property Analysis', 
      'Market Insights',
      'AI Description Generator',
      'Automated Valuation'
    ] : [
      'Basic AI Description Generator'
    ],
    lastValidated: apiKey ? new Date().toISOString() : null
  });
}

async function generateVastuAnalysis(feature: string, user: any): Promise<NextResponse> {
  // Simulate VASTU analysis (in production, this would call actual VASTU API)
  const analyses = {
    'property_value': 'Based on current market trends, this property shows 15-20% appreciation potential over the next 2 years',
    'location_score': 'Excellent connectivity with upcoming infrastructure projects',
    'investment_rating': 'A-Grade investment opportunity',
    'market_demand': 'High demand in this area with low supply',
    'recommendation': 'Strong BUY recommendation with expected ROI of 12-15% annually'
  };

  return NextResponse.json({
    success: true,
    analysis: analyses[feature as keyof typeof analyses] || 'Analysis feature not available',
    confidence: 0.85,
    generated_at: new Date().toISOString(),
    data_source: 'VASTU AI Analysis Engine'
  });
}

function detectAIService(apiKey: string): string {
  if (apiKey.startsWith('sk-antropic')) return 'Anthropic Claude';
  if (apiKey.startsWith('sk-openai')) return 'OpenAI GPT';
  if (apiKey.startsWith('sk-gemini')) return 'Google Gemini';
  if (apiKey.startsWith('sk-huggingface')) return 'HuggingFace';
  return 'Unknown';
}
