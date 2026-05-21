export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, SystemSettings } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

// Helper to determine service name from key format
function getServiceName(apiKey: string): string {
  if (apiKey.startsWith('sk-ant')) return 'Anthropic Claude';
  if (apiKey.startsWith('sk-proj-') || apiKey.startsWith('sk-') && !apiKey.startsWith('sk-ant') && !apiKey.startsWith('sk-gemini')) return 'OpenAI GPT';
  if (apiKey.startsWith('sk-gemini')) return 'Google Gemini';
  return 'Unknown AI Service';
}

export async function POST(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'get_ai_status': {
        const apiKeySetting = await SystemSettings.findOne({ key: 'AI_API_KEY' }).lean();
        const hasPremium = await SystemSettings.findOne({ key: 'HAS_PREMIUM_AI' }).lean();

        let maskedKey = null;
        let service = null;
        
        if (apiKeySetting && apiKeySetting.value) {
          const keyStr = String(apiKeySetting.value);
          maskedKey = keyStr.substring(0, 7) + '...' + keyStr.substring(keyStr.length - 4);
          service = getServiceName(keyStr);
        }

        return NextResponse.json({
          apiKey: maskedKey,
          service: service,
          hasPremiumAI: hasPremium ? hasPremium.value : false,
          lastValidated: apiKeySetting ? apiKeySetting.updatedAt : null,
          availableFeatures: [
            'Basic Property Description',
            'VASTU Analysis',
            'Automated Valuation',
            'Market Insights'
          ]
        });
      }

      case 'validate_api_key': {
        const { apiKey } = body;
        if (!apiKey || !apiKey.startsWith('sk-')) {
          return NextResponse.json({ valid: false, message: 'Invalid API key format. Must start with sk-' }, { status: 400 });
        }
        
        // Mock validation: normally you'd ping the OpenAI/Anthropic endpoint here.
        return NextResponse.json({ 
          valid: true, 
          apiKey: apiKey,
          message: 'API Key successfully validated format!' 
        });
      }

      case 'enable_premium_ai': {
        const { apiKey } = body;
        if (!apiKey) {
          return NextResponse.json({ error: 'API key is required' }, { status: 400 });
        }

        // Upsert the API key
        await SystemSettings.findOneAndUpdate(
          { key: 'AI_API_KEY' },
          { value: apiKey, isSecret: true, description: 'Main AI API Key' },
          { upsert: true, new: true }
        );

        // Turn on Premium features
        await SystemSettings.findOneAndUpdate(
          { key: 'HAS_PREMIUM_AI' },
          { value: true, isSecret: false, description: 'Flag to enable premium AI features' },
          { upsert: true, new: true }
        );

        logger.info('Premium AI features enabled by Owner.');
        
        return NextResponse.json({ success: true, message: 'Premium AI enabled successfully' });
      }

      case 'generate_vastu_analysis': {
        // Mock VASTU analysis generator
        const apiKeySetting = await SystemSettings.findOne({ key: 'AI_API_KEY' }).lean();
        if (!apiKeySetting || !apiKeySetting.value) {
          return NextResponse.json({ error: 'AI API Key not configured' }, { status: 400 });
        }

        const mockAnalysis = "Based on our AI analysis, the North-East entrance provides excellent energy flow and natural light. Consider placing water elements in the East for maximum prosperity.";
        
        return NextResponse.json({ 
          success: true, 
          analysis: mockAnalysis 
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error: any) {
    logger.error('POST /api/ai-management failed:', error);
    return NextResponse.json({
      error: 'Failed to process AI management request',
      details: error.message
    }, { status: 500 });
  }
}
