'use client';

import { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  Send, 
  Sparkles,
  TrendingUp,
  Target,
  BarChart3,
  Shield,
  Search,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalAIAdvisorProps {
  userId: string;
}

export function PersonalAIAdvisor({ userId }: PersonalAIAdvisorProps) {
  // Integrate Vercel AI SDK useChat
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: '/api/ai/chat',
    body: { userId },
    initialMessages: [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `Welcome to the AS Trusted Elite Portal. I am your advanced AI Investment Advisor.\n\nI analyze market trends, predict ROI, and locate high-growth assets tailored to your portfolio goals.\n\nHow can I optimize your real estate strategy today?`,
      }
    ]
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSuggestionClick = (suggestion: string) => {
    // Vercel useChat doesn't have a direct setInput method exposed that triggers submit automatically.
    // We simulate a synthetic event for handleInputChange, then submit.
    const fakeEvent = { target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(fakeEvent);
    
    // Slight delay to allow state update before submitting
    setTimeout(() => {
      const formEvent = new Event('submit', { cancelable: true }) as any;
      handleSubmit(formEvent);
    }, 50);
  };

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-xl">
      {/* Luxury AI Advisor Header */}
      <Card className="border-b border-white/10 bg-black/40 shadow-2xl backdrop-blur-2xl rounded-none md:rounded-t-xl mb-4">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-md opacity-50 rounded-full animate-pulse"></div>
                <div className="relative bg-black border border-white/20 p-2 rounded-full">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-white">Elite AI Advisor</h3>
                <p className="text-xs text-zinc-400 font-medium">Bloomberg-Grade Market Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                <Sparkles className="h-3 w-3 mr-1" />
                Live Feed
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 pt-0">
          <div className="grid grid-cols-4 gap-2 text-center mt-2">
            <div className="p-2 bg-white/5 border border-white/5 rounded-lg backdrop-blur-sm transition-colors hover:bg-white/10 cursor-default">
              <Target className="h-4 w-4 text-zinc-300 mx-auto mb-1" />
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Predictive</div>
            </div>
            <div className="p-2 bg-white/5 border border-white/5 rounded-lg backdrop-blur-sm transition-colors hover:bg-white/10 cursor-default">
              <BarChart3 className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider">ROI Analysis</div>
            </div>
            <div className="p-2 bg-white/5 border border-white/5 rounded-lg backdrop-blur-sm transition-colors hover:bg-white/10 cursor-default">
              <TrendingUp className="h-4 w-4 text-blue-400 mx-auto mb-1" />
              <div className="text-[10px] font-semibold text-blue-400/80 uppercase tracking-wider">Market Data</div>
            </div>
            <div className="p-2 bg-white/5 border border-white/5 rounded-lg backdrop-blur-sm transition-colors hover:bg-white/10 cursor-default">
              <Shield className="h-4 w-4 text-amber-400 mx-auto mb-1" />
              <div className="text-[10px] font-semibold text-amber-400/80 uppercase tracking-wider">Risk Assessed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={\`flex \${message.role === 'user' ? 'justify-end' : 'justify-start'}\`}
            >
              <div
                className={\`max-w-[85%] rounded-2xl p-4 shadow-sm backdrop-blur-md \${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-zinc-900/80 border border-white/10 text-zinc-100 rounded-tl-sm'
                }\`}
              >
                {message.role !== 'user' && (
                  <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">System Response</span>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-zinc-900/80 border border-white/10 rounded-2xl rounded-tl-sm p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Analyzing Datasets...</span>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2 rounded-full backdrop-blur-md">
                Connection lost. Please try again.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/60 border-t border-white/10 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative group">
            <Input
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Ask for high-growth areas, ROI analysis, or budget optimization..."
              className="pr-12 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-xl h-12"
            />
          </div>
          
          <Button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 rounded-xl shrink-0 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Send className="h-5 w-5 ml-1" />
          </Button>
        </form>
        
        {/* Elite Quick Prompts */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => handleSuggestionClick("Identify top 3 locations poised for 20%+ capital appreciation next year.")}
              className="text-[10px] uppercase tracking-wider h-7 bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white rounded-full"
            >
              <TrendingUp className="h-3 w-3 mr-2" />
              High Appreciation Zones
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => handleSuggestionClick("Generate a risk-adjusted ROI comparison for Kamareddy vs Sircilla.")}
              className="text-[10px] uppercase tracking-wider h-7 bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white rounded-full"
            >
              <BarChart3 className="h-3 w-3 mr-2" />
              Compare ROI Risk
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => handleSuggestionClick("Find off-market distress deals or undervalued plots under ₹15 Lakhs.")}
              className="text-[10px] uppercase tracking-wider h-7 bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white rounded-full"
            >
              <Search className="h-3 w-3 mr-2" />
              Find Undervalued Deals
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
