"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type JourneyStep = "browsed" | "registered" | "inquired" | "premium" | "invested";

const STEPS: {
  key: JourneyStep;
  label: string;
  desc: string;
  action?: { label: string; href: string };
}[] = [
  {
    key: "browsed",
    label: "Explore Normal Plots",
    desc: "Browse verified listings",
    action: { label: "View Normal Properties", href: "/normal-properties" },
  },
  {
    key: "registered",
    label: "Register",
    desc: "Create your free account",
    action: { label: "Register Free", href: "/register" },
  },
  {
    key: "inquired",
    label: "Inquire",
    desc: "Express interest in a plot",
    action: { label: "Browse & Inquire", href: "/properties" },
  },
  {
    key: "premium",
    label: "Go Premium",
    desc: "Unlock full investment tools",
    action: { label: "Upgrade Now →", href: "/premium" },
  },
  {
    key: "invested",
    label: "Invest",
    desc: "Complete your acquisition",
  },
];

interface Props {
  currentStep: JourneyStep;
  userName?: string;
  user?: any; // For dynamic step detection
}

// Dynamic step detection function
const getCurrentStep = (user: any): JourneyStep => {
  if (user?.investments?.length > 0) return "invested";
  if (user?.isPremium) return "premium";
  if (user?.inquiries?.length > 0) return "inquired";
  if (user?.registered) return "registered";
  return "browsed";
};

export default function InvestmentJourney({ currentStep, userName, user }: Props) {
  // Auto-detect step if user provided
  const detectedStep = user ? getCurrentStep(user) : currentStep;
  const currentIdx = STEPS.findIndex((s) => s.key === detectedStep);
  const pct = Math.round(((currentIdx + 1) / STEPS.length) * 100);
  
  const [celebration, setCelebration] = useState(false);
  const [previousStep, setPreviousStep] = useState(currentIdx);

  // Celebration effect when step changes
  useEffect(() => {
    if (currentIdx > previousStep) {
      setCelebration(true);
      setTimeout(() => setCelebration(false), 2000);
    }
    setPreviousStep(currentIdx);
  }, [currentIdx, previousStep]);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl border border-blue-800/40 p-6 text-white relative overflow-hidden">
      {/* Celebration overlay */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-green-400/20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        className="flex items-start justify-between mb-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h3 className="font-black text-lg text-white">
            {userName ? `${userName}'s` : "Your"} Investment Journey
          </h3>
          <p className="text-slate-400 text-sm mt-0.5">
            Step {currentIdx + 1} of {STEPS.length} complete
          </p>
        </div>
        <motion.div 
          className="text-right"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="text-3xl font-black text-yellow-400"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {pct}%
          </motion.div>
          <div className="text-slate-400 text-xs">done</div>
        </motion.div>
      </motion.div>

      {/* Progress bar */}
      <div className="h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          const locked = idx > currentIdx;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-yellow-400/10 border border-yellow-400/30"
                  : done
                  ? "bg-white/5"
                  : "opacity-35"
              }`}
            >
              {/* Step icon */}
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  done
                    ? "bg-green-500/20"
                    : active
                    ? "bg-yellow-400"
                    : "bg-white/10"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {done ? (
                  <motion.svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : active ? (
                  <motion.div 
                    className="w-2.5 h-2.5 bg-slate-900 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                ) : (
                  <div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
                )}
              </motion.div>

              {/* Labels */}
              <div className="flex-1 min-w-0">
                <motion.div
                  className={`font-semibold text-sm ${
                    active ? "text-yellow-300" : done ? "text-white" : "text-slate-500"
                  }`}
                  animate={{ 
                    color: active ? "#fde047" : done ? "#ffffff" : "#64748b"
                  }}
                >
                  {step.label}
                </motion.div>
                <div className="text-slate-500 text-xs truncate">{step.desc}</div>
              </div>

              {/* CTA or badge */}
              {step.action ? (
                <motion.a
                  href={step.action.href}
                  className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    active 
                      ? "bg-yellow-400 hover:bg-yellow-300 text-slate-900" 
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step.action.label}
                </motion.a>
              ) : done ? (
                <motion.span 
                  className="shrink-0 text-xs text-green-400 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Done ✓
                </motion.span>
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Export the step detection function for use in other components
export { getCurrentStep };
