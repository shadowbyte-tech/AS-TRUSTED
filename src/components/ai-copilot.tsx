'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Bot, X, MessageSquare, Maximize2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export default function AICoPilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your AS Trusted AI Co-Pilot. I can help you find properties, analyze investments, or answer any real estate questions. What are you looking for today?"
      }
    ]
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-amber-500 hover:shadow-primary/50 transition-all duration-300 group"
            >
              <Sparkles className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed z-50 transition-all duration-300 ease-in-out ${
              isExpanded 
                ? 'inset-4 md:inset-10' 
                : 'bottom-6 right-6 w-[380px] h-[600px] max-h-[85vh]'
            }`}
          >
            <Card className="h-full flex flex-col shadow-2xl border-primary/20 glass overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-amber-500/10 border-b border-primary/10 p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary text-primary-foreground rounded-lg">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">AI Co-Pilot</CardTitle>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/5" onClick={() => setIsExpanded(!isExpanded)}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/5" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted/50 border border-border/50 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-sm px-4 py-2 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              <CardFooter className="p-4 bg-background/50 border-t border-border/50 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <input
                    className="flex-1 bg-background border border-input px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ask about plots, prices, or areas..."
                    value={input}
                    onChange={handleInputChange}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full shadow-md">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
