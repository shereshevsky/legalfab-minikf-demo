import { motion } from 'framer-motion';
import { PHASE_ICONS, PHASE_TITLES, StepPhase } from '../types';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick: (step: number) => void;
}

const phases: StepPhase[] = [
  'QUERY_ANALYSIS',
  'MATTER_RETRIEVAL',
  'BILLING_ANALYSIS',
  'WIP_CALCULATION',
  'CLIENT_ENRICHMENT',
  'RESPONSE_SYNTHESIS',
];

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="glass rounded-xl p-4 flex-shrink-0">
      <p className="text-xs text-slate-400 mb-3">Execution Pipeline</p>
      <div className="flex items-center gap-2">
        {phases.map((phase, index) => {
          const isActive = currentStep === index;
          const isComplete = currentStep > index;
          const isPending = currentStep < index;
          
          return (
            <div key={phase} className="flex items-center">
              <button
                onClick={() => onStepClick(index)}
                className={`
                  relative w-10 h-10 rounded-lg flex items-center justify-center
                  transition-all duration-300 cursor-pointer
                  ${isActive ? 'bg-amber-500/20 border-2 border-amber-500 scale-110' : ''}
                  ${isComplete ? 'bg-emerald-500/20 border border-emerald-500/50' : ''}
                  ${isPending ? 'bg-slate-700/50 border border-slate-600/50' : ''}
                  hover:scale-105
                `}
                title={PHASE_TITLES[phase]}
              >
                <span className="text-lg">{PHASE_ICONS[phase]}</span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-amber-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </button>
              {index < phases.length - 1 && (
                <div 
                  className={`
                    w-6 h-0.5 mx-1
                    ${isComplete ? 'bg-emerald-500' : 'bg-slate-600'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
