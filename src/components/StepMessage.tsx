import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { AnimationStep } from '../types';
import { PHASE_ICONS, PHASE_TITLES } from '../types';

interface StepMessageProps {
  step: AnimationStep | null;
  isAnimating: boolean;
}

export function StepMessage({ step, isAnimating }: StepMessageProps) {
  if (!step) {
    return (
      <div className="glass rounded-xl p-4 h-20 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Click Play to start the demo</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.stepNumber}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="glass rounded-xl p-4"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-2xl
              ${isAnimating ? 'bg-amber-500/20 animate-pulse' : 'bg-indigo-500/20'}
            `}>
              {PHASE_ICONS[step.phase]}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
                Step {step.stepNumber} / 6
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                {PHASE_TITLES[step.phase]}
              </span>
              {isAnimating && (
                <Loader2 className="w-3 h-3 text-amber-400 animate-spin ml-auto" />
              )}
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {step.message}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {step.details}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
