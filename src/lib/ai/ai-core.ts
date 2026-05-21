import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { SystemSettings } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * Initializes and returns the best available AI model provider based on SystemSettings.
 * Supports OpenAI (gpt-4o), Anthropic (claude-3-5-sonnet), and Google (gemini-1.5-pro).
 */
export async function getCoreAIModel() {
  const apiKeySetting = await SystemSettings.findOne({ key: 'AI_API_KEY' }).lean();
  
  if (!apiKeySetting || !apiKeySetting.value) {
    throw new Error('AI API Key is not configured in SystemSettings. Please configure it in the admin dashboard.');
  }

  const keyStr = String(apiKeySetting.value);

  // Anthropic Claude
  if (keyStr.startsWith('sk-ant')) {
    logger.info('Initializing Anthropic Claude provider');
    const anthropic = createAnthropic({ apiKey: keyStr });
    return anthropic('claude-3-5-sonnet-20241022');
  }
  
  // Google Gemini
  if (keyStr.startsWith('sk-gemini') || keyStr.startsWith('AIza')) {
    logger.info('Initializing Google Gemini provider');
    const google = createGoogleGenerativeAI({ apiKey: keyStr });
    return google('gemini-1.5-pro-latest');
  }

  // Default to OpenAI
  logger.info('Initializing OpenAI GPT provider');
  const openai = createOpenAI({ apiKey: keyStr });
  return openai('gpt-4o');
}

/**
 * Base system prompt injecting Bloomberg/BlackRock tone.
 */
export const CORE_SYSTEM_PROMPT = `
You are a highly sophisticated, elite AI Real Estate Investment Advisor.
You operate as the "brain" of a luxury PropTech platform, providing BlackRock/Bloomberg-level insights.
Your tone should be:
- Professional, concise, and highly analytical.
- Data-driven and objective.
- Luxury and exclusive (but not overly poetic or cheesy).

Always prioritize factual analysis, ROI calculations, and market trends.
When discussing properties, use structured formatting (bullet points, bold text for key metrics).
If you lack specific market data, use your general knowledge of real estate economics to estimate safely, but clearly state it is an estimate.
`;
