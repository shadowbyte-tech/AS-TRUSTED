import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createAuditTrail } from '@/lib/audit';
import { globalRateLimiter } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const clientIP = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'unknown';
    
    // 🚦 RATE LIMIT: 60 AI requests per hour per IP (Cost Control)
    if (!globalRateLimiter.isAllowed(`ai-chat:${clientIP}`, 60, 60 * 60 * 1000)) {
      logger.warn('AI: Rate limit exceeded', { ip: clientIP });
      return NextResponse.json({ error: 'AI limit reached. Please try again in an hour.' }, { status: 429 });
    }

    const { messages, model, temperature, response_format } = await req.json();
    logger.info('AI: Request received', { ip: clientIP, model: model || 'grok-beta' });
    
    const GROK_KEY = process.env.NEXT_PUBLIC_GROK_API_KEY || process.env.GROK_API_KEY;
    const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    // --- ENGINE 1: GROK (PRIMARY) ---
    if (GROK_KEY && GROK_KEY !== 'your-grok-api-key-here') {
      try {
        const grokRes = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROK_KEY.trim()}` },
          body: JSON.stringify({ model: model || 'grok-beta', messages, temperature: temperature ?? 0.7, response_format }),
        });
        if (grokRes.ok) {
          const result = await grokRes.json();
          await createAuditTrail({
            action: 'AI_CHAT_COMPLETION',
            category: 'ADMIN',
            details: { engine: 'GROK', model: model || 'grok-beta' },
            request: req
          });
          return NextResponse.json(result);
        }
      } catch (e) { logger.error('Grok Error:', e); }
    }

    // --- ENGINE 2: DEEPSEEK (SECONDARY) ---
    if (DEEPSEEK_KEY && DEEPSEEK_KEY !== 'your-deepseek-api-key-here') {
      try {
        const dsRes = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_KEY.trim()}` },
          body: JSON.stringify({ model: 'deepseek-chat', messages, temperature: temperature ?? 0.7, response_format }),
        });
        if (dsRes.ok) {
          const result = await dsRes.json();
          await createAuditTrail({
            action: 'AI_CHAT_COMPLETION',
            category: 'ADMIN',
            details: { engine: 'DEEPSEEK', model: 'deepseek-chat' },
            request: req
          });
          return NextResponse.json(result);
        }
      } catch (e) { logger.error('DeepSeek Error:', e); }
    }

    // --- ENGINE 3: GEMINI (TERTIARY) ---
    if (GEMINI_KEY && GEMINI_KEY !== 'your-gemini-api-key-here') {
      try {
        const sys = messages.find((m: any) => m.role === 'system')?.content || '';
        const userMsgs = messages.filter((m: any) => m.role !== 'system').map((m: any) => `${m.role}: ${m.content}`).join('\n');
        
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${sys}\n\nUser History/Input:\n${userMsgs}` }] }],
            generationConfig: { temperature: temperature ?? 0.7 }
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          
          await createAuditTrail({
            action: 'AI_CHAT_COMPLETION',
            category: 'ADMIN',
            details: { engine: 'GEMINI', model: 'gemini-2.0-flash' },
            request: req
          });

          return NextResponse.json({
            choices: [{ message: { content: text } }]
          });
        }
      } catch (e) { logger.error('Gemini Error:', e); }
    }

    await createAuditTrail({
      action: 'AI_CHAT_FAILURE',
      category: 'ADMIN',
      status: 'FAILURE',
      details: { reason: 'ALL_ENGINES_UNAVAILABLE' },
      request: req
    });

    return NextResponse.json({ error: 'All AI Engines Unavailable' }, { status: 503 });

  } catch (error) {
    logger.error('Critical Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
