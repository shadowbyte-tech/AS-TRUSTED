import { generateObject } from 'ai';
import { getCoreAIModel, CORE_SYSTEM_PROMPT } from '@/lib/ai/ai-core';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const maxDuration = 60; // Allow up to 60s for AI response

const investmentSchema = z.object({
  overall: z.number().describe('Overall investment score from 0 to 100'),
  growth: z.number().describe('Estimated base CAGR percentage (e.g. 15 for 15%)'),
  risk: z.enum(['Low', 'Medium', 'High']).describe('Assessed risk level'),
  recommendation: z.enum(['BUY_NOW', 'BUY_SOON', 'WAIT', 'AVOID']).describe('Final investment verdict'),
  confidence: z.number().describe('AI confidence score in this prediction from 0 to 100'),
  factors: z.object({
    infrastructure: z.number().describe('Score 0-100'),
    location: z.number().describe('Score 0-100'),
    price: z.number().describe('Score 0-100'),
    development: z.number().describe('Score 0-100'),
    demand: z.number().describe('Score 0-100')
  }),
  insights: z.array(z.string()).describe('List of 3-4 key analytical insights'),
  risks: z.array(z.string()).describe('List of 1-3 potential risks'),
  opportunities: z.array(z.string()).describe('List of 1-3 future opportunities or catalysts')
});

export async function POST(req: NextRequest) {
  try {
    const { property, highwayDist, rrrDist, historicalGrowth } = await req.json();

    let model;
    try {
      model = await getCoreAIModel();
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'AI not configured' }, { status: 503 });
    }

    const prompt = `
Analyze the following property and its parameters to generate a sophisticated investment score matrix.
Property Data: ${JSON.stringify(property)}
Manual Parameters:
- Distance to NH-44: ${highwayDist} km
- Distance to Regional Ring Road: ${rrrDist} km
- Base Historical Growth: ${historicalGrowth}%

Based on proptech valuation logic, calculate the scores and provide a comprehensive Bloomberg-style analysis.
`;

    const { object } = await generateObject({
      model: model,
      schema: investmentSchema,
      system: CORE_SYSTEM_PROMPT,
      prompt: prompt,
    });

    return NextResponse.json({ success: true, score: object });

  } catch (error: any) {
    logger.error('API /api/ai/investment-score failed:', error);
    return NextResponse.json({ error: 'Failed to generate investment score' }, { status: 500 });
  }
}
