'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  X, 
  Send, 
  Camera,
  Image,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get current user info if available
      const userData = {
        userName: 'Anonymous', // You can get this from auth context if needed
        userEmail: 'anonymous@user.com' // You can get this from auth context if needed
      };
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback: feedback.trim(),
          type: 'User Feedback',
          ...userData
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        setFeedback('');
        
        // Reset after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
          setIsOpen(false);
        }, 3000);
      } else {
        console.error('Feedback submission failed:', result);
        alert('Failed to send feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error sending feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickActions = [
    { icon: <Camera className="h-4 w-4" />, text: 'Screenshot', color: 'bg-blue-500' },
    { icon: <Image className="h-4 w-4" />, text: 'Element Issue', color: 'bg-orange-500' },
    { icon: <AlertCircle className="h-4 w-4" />, text: 'Bug Report', color: 'bg-red-500' },
    { icon: <CheckCircle className="h-4 w-4" />, text: 'Feature Request', color: 'bg-green-500' },
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg rounded-full px-6 gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="hidden sm:inline">Send Feedback</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send Feedback
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!submitted ? (
            <>
              <div className="text-sm text-muted-foreground">
                Describe the element you want to change or upload a screenshot. 
                I'll help you make the necessary modifications.
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2"
                    onClick={() => setFeedback(prev => prev + `[${action.text}] `)}
                  >
                    <Badge className={`${action.color} text-white text-xs`}>
                      {action.icon}
                    </Badge>
                    {action.text}
                  </Button>
                ))}
              </div>
              
              {/* Feedback Textarea */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Describe the element you want to change...
Example: 'Fix the upload button color' or 'Change the header layout'"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={!feedback.trim() || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Feedback
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    // In a real app, this would open file picker
                    alert('Screenshot feature would open file picker here');
                  }}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                💡 Tip: You can also press Ctrl+Shift+S to capture a screenshot
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-green-600 mb-1">Feedback Sent!</h3>
              <p className="text-sm text-muted-foreground">
                Your feedback has been sent to swamy@consult.com
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                📧 Check your email for a copy of the submission
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
