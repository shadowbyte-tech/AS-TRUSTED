import { streamText, Message } from 'ai';
import { getCoreAIModel, CORE_SYSTEM_PROMPT } from '@/lib/ai/ai-core';
import { AIMemoryService } from '@/lib/ai/ai-memory';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const maxDuration = 60; // Allow up to 60s for AI response

export async function POST(req: NextRequest) {
  try {
    const { messages, userId: clientUserId } = await req.json();

    // In a real app, you'd get the userId from the session token.
    // For now, we fall back to a generic user ID if not provided.
    const userId = clientUserId || 'anonymous_investor_1';

    // 1. Fetch user preferences from DB
    const preferences = await AIMemoryService.loadUserPreferences(userId);
    
    // 2. Build the context-aware system prompt
    const contextPrompt = `
${CORE_SYSTEM_PROMPT}

USER CONTEXT:
${Object.keys(preferences).length > 0 
  ? `Known Preferences: ${JSON.stringify(preferences)}` 
  : 'New user. No saved preferences yet. Ask clarifying questions to learn their budget and goals.'}
`;

    // 3. Initialize the model securely
    let model;
    try {
      model = await getCoreAIModel();
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'AI not configured' }, { status: 503 });
    }

    // 4. Stream the text response
    const result = streamText({
      model: model,
      messages: [
        { role: 'system', content: contextPrompt },
        ...messages,
      ],
      async onFinish({ text, toolCalls, toolResults, finishReason, usage }) {
        logger.info(\`AI Chat completed. Tokens: \${usage.totalTokens}. Reason: \${finishReason}\`);
        
        // Save the updated history in the background
        const newHistory = [
          ...messages,
          { role: 'assistant', content: text }
        ];
        
        // Keep last 10 messages for memory limits
        const trimmedHistory = newHistory.slice(-10);
        await AIMemoryService.saveChatHistory(userId, trimmedHistory);
      },
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    logger.error('API /api/ai/chat failed:', error);
    return NextResponse.json({ error: 'Failed to process AI chat request' }, { status: 500 });
  }
}
