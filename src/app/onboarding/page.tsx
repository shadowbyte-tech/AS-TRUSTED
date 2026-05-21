'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion, AnimatePresence } from 'framer-motion';
import { ASLogo } from '@/components/as-logo';

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState('');
  const [goal, setGoal] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleComplete = async () => {
    setIsSubmitting(true);
    // In a real application, you would save these preferences to the user's profile via an API.
    // For now, we simulate saving preferences.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    
    toast({
      title: "Preferences Saved!",
      description: "We have customized your property feed.",
    });
    
    router.push('/normal-properties');
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <ASLogo className="h-16 w-16 text-primary" />
        </div>
        
        <Card className="glass shadow-2xl border-primary/20 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-muted">
            <motion.div 
              className="h-full bg-primary" 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-headline text-primary">Let's Personalize Your Experience</CardTitle>
            <CardDescription>Tell us what you're looking for so we can find the perfect match.</CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium text-foreground">What is your primary investment goal?</h3>
                  <RadioGroup value={goal} onValueChange={setGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="investment" id="investment" />
                      <Label htmlFor="investment" className="cursor-pointer font-medium">Long-term Investment</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="building" id="building" />
                      <Label htmlFor="building" className="cursor-pointer font-medium">Building a Home</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="commercial" id="commercial" />
                      <Label htmlFor="commercial" className="cursor-pointer font-medium">Commercial Development</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="farm" id="farm" />
                      <Label htmlFor="farm" className="cursor-pointer font-medium">Farm / Weekend Home</Label>
                    </div>
                  </RadioGroup>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium text-foreground">What is your budget range?</h3>
                  <RadioGroup value={budget} onValueChange={setBudget} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="under-10l" id="under-10l" />
                      <Label htmlFor="under-10l" className="cursor-pointer font-medium">Under 10 Lakhs</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="10l-25l" id="10l-25l" />
                      <Label htmlFor="10l-25l" className="cursor-pointer font-medium">10 Lakhs - 25 Lakhs</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="25l-50l" id="25l-50l" />
                      <Label htmlFor="25l-50l" className="cursor-pointer font-medium">25 Lakhs - 50 Lakhs</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="above-50l" id="above-50l" />
                      <Label htmlFor="above-50l" className="cursor-pointer font-medium">Above 50 Lakhs</Label>
                    </div>
                  </RadioGroup>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium text-foreground">Preferred Location?</h3>
                  <RadioGroup value={location} onValueChange={setLocation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="kamareddy" id="kamareddy" />
                      <Label htmlFor="kamareddy" className="cursor-pointer font-medium">Kamareddy District</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="hyderabad-highway" id="hyderabad-highway" />
                      <Label htmlFor="hyderabad-highway" className="cursor-pointer font-medium">Hyderabad Highway</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="nizamabad" id="nizamabad" />
                      <Label htmlFor="nizamabad" className="cursor-pointer font-medium">Nizamabad Route</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any" className="cursor-pointer font-medium">Open to Suggestions</Label>
                    </div>
                  </RadioGroup>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-10">
              <Button 
                variant="outline" 
                onClick={step === 1 ? () => router.push('/normal-properties') : handlePrev}
                disabled={isSubmitting}
              >
                {step === 1 ? 'Skip' : 'Back'}
              </Button>
              
              {step < 3 ? (
                <Button onClick={handleNext} disabled={(step === 1 && !goal) || (step === 2 && !budget)}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={!location || isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Finish Setup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
