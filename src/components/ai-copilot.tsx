'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Loader2, Sparkles, Send, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_QUESTIONS = [
  "What plots are available?",
  "What is the price range?",
  "How to book a site visit?",
  "Are plots DTCP approved?",
];

// Simple rule-based AI for when no API key is configured
function getSmartReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes('price') || q.includes('cost') || q.includes('rate')) {
    return `Our plots are priced starting from ₹8 Lakhs onwards depending on location and size.\n\n**Typical ranges:**\n- Open Plots: ₹8L – ₹25L\n- Villa Plots: ₹20L – ₹60L\n- Farm Lands: ₹5L – ₹15L\n\nWould you like me to help you schedule a **free site visit** to see the plots in person?`;
  }
  if (q.includes('dtcp') || q.includes('legal') || q.includes('approved') || q.includes('verify')) {
    return `✅ **Yes, all our plots are 100% DTCP approved.**\n\nEvery property listed by AS Trusted Consultancy comes with:\n- DTCP Layout Approval\n- Clear Title & Legal Verification\n- No encumbrances\n- Proper road access\n\nYour investment is completely safe with us.`;
  }
  if (q.includes('site visit') || q.includes('visit') || q.includes('see') || q.includes('tour')) {
    return `🗺️ **Book a Free Site Visit!**\n\nOur team will personally take you to the property. We offer:\n- **Free transportation** from Kamareddy\n- **Expert guide** who explains investment potential\n- **No pressure** environment\n\nJust tap the **"Book Site Visit"** button in the Quick Actions menu, or call us directly at **+91 98664 04090**!`;
  }
  if (q.includes('location') || q.includes('where') || q.includes('kamareddy') || q.includes('hyderabad')) {
    return `📍 **Our primary locations:**\n\n1. **Kamareddy** – NH-44 corridor, 90km from Hyderabad\n2. **Nizamabad Road** – High growth zone\n3. **Hyderabad Highway** – Near upcoming RRR route\n\nAll properties are within a **2-hour drive from Hyderabad** making them perfect weekend homes or long-term investments.`;
  }
  if (q.includes('invest') || q.includes('roi') || q.includes('return') || q.includes('profit')) {
    return `📈 **Investment Potential in Our Zones:**\n\nKamareddy has seen **35-50% price appreciation** in the last 3 years due to:\n- NH-44 expansion\n- Regional Ring Road (RRR) proximity\n- Government infrastructure projects\n\n**Expected ROI: 18-25% annually** in our prime zones.\n\nWould you like a **personalized investment analysis**? Book a consultation!`;
  }
  if (q.includes('plot') || q.includes('land') || q.includes('property') || q.includes('available')) {
    return `🏡 **We have 3 types of properties:**\n\n1. **Open Plots** – Ready for construction, DTCP approved\n2. **Villa Plots** – Gated community, premium amenities\n3. **Farm Lands** – For agri-investment and weekend farms\n\nAll are available for **immediate registration**. Check our Properties page or I can help you filter based on your budget!`;
  }
  if (q.includes('contact') || q.includes('call') || q.includes('phone') || q.includes('whatsapp')) {
    return `📞 **Contact AS Trusted:**\n\n- **Phone/WhatsApp:** +91 98664 04090\n- **Email:** swamygoud2775@gmail.com\n- **Office:** Nizamsagar Rd, Kamareddy, Telangana 503111\n\nOr use the **Quick Actions** floating button on the left side of your screen to directly open WhatsApp!`;
  }
  return `Thank you for your question! 😊\n\nI'm the AS Trusted AI assistant. I can help you with:\n\n- 🏡 **Property availability & pricing**\n- 📍 **Location details**\n- ✅ **Legal verification status**\n- 📅 **Booking site visits**\n- 📈 **Investment analysis**\n\nWhat would you like to know? Or call us directly at **+91 98664 04090**!`;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AICoPilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AS Trusted Property Assistant!\n\nI can help you find the perfect plot, check prices, book site visits, or answer any real estate questions.\n\n**What would you like to know?**"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userText = (text || input).trim();
    if (!userText) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Try the real AI first
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
        signal: AbortSignal.timeout(8000)
      });

      if (res.ok) {
        // Stream the response
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        const aiMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '' }]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            // Parse AI SDK data stream format
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('0:')) {
                try {
                  const parsed = JSON.parse(line.slice(2));
                  fullText += parsed;
                  setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: fullText } : m));
                } catch {}
              }
            }
          }
        }
      } else {
        throw new Error('API not available');
      }
    } catch {
      // Fallback to smart rule-based reply
      const reply = getSmartReply(userText);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: reply }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-foreground">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
        return <p key={i} className="ml-2 text-sm">{line}</p>;
      }
      if (line === '') return <br key={i} />;
      // Handle inline bold
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-sm leading-relaxed">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9980] h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-amber-500 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 hover:shadow-primary/40"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed z-[9980] bottom-0 right-0 sm:bottom-4 sm:right-4 w-full sm:w-[380px] h-[85vh] sm:h-[600px] max-h-[700px] flex flex-col rounded-t-2xl sm:rounded-2xl shadow-2xl border border-primary/20 overflow-hidden bg-background"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-amber-500/10 border-b border-primary/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-xl">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm">AS Trusted Assistant</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
                    Online · Ready to help
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1 shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 space-y-1 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted/60 border border-border/50 rounded-bl-sm'
                  }`}>
                    {msg.role === 'assistant' ? renderContent(msg.content) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="bg-muted/60 border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="px-4 pb-2 shrink-0">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/50 bg-background/80 backdrop-blur-md shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  className="flex-1 bg-muted/50 border border-input rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/60"
                  placeholder="Ask about plots, prices..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-40"
                >
                  <Send className="h-4 w-4 text-primary-foreground" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
