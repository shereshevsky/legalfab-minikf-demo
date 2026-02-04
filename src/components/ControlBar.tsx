import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  FileText,
  Sparkles
} from 'lucide-react';

interface ControlBarProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  progress: number;
  isComplete: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
  onShowResults: () => void;
}

export function ControlBar({
  isPlaying,
  currentStep,
  totalSteps,
  progress,
  isComplete,
  onPlay,
  onPause,
  onReset,
  onNext,
  onPrev,
  onShowResults,
}: ControlBarProps) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-6">
        {/* Progress Bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">
              {currentStep < 0 ? 'Ready' : `Step ${currentStep + 1} of ${totalSteps}`}
            </span>
            <span className="text-xs text-slate-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 
                       flex items-center justify-center transition-all duration-200
                       border border-slate-700/50 hover:border-slate-600/50"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </button>

          {/* Previous */}
          <button
            onClick={onPrev}
            disabled={currentStep <= 0}
            className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 
                       flex items-center justify-center transition-all duration-200
                       border border-slate-700/50 hover:border-slate-600/50
                       disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4 text-slate-400" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            className={`
              w-14 h-14 rounded-xl flex items-center justify-center
              transition-all duration-300 transform hover:scale-105
              ${isPlaying 
                ? 'bg-amber-500 hover:bg-amber-400' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400'
              }
            `}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1}
            className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 
                       flex items-center justify-center transition-all duration-200
                       border border-slate-700/50 hover:border-slate-600/50
                       disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4 text-slate-400" />
          </button>

          {/* Separator */}
          <div className="w-px h-8 bg-slate-700/50 mx-2" />

          {/* Show Results */}
          <button
            onClick={onShowResults}
            disabled={!isComplete}
            className={`
              px-4 h-10 rounded-lg flex items-center gap-2
              transition-all duration-300
              ${isComplete 
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400' 
                : 'bg-slate-800/50 border border-slate-700/50 text-slate-500 cursor-not-allowed'
              }
            `}
            title="View Results"
          >
            {isComplete ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">Results</span>
          </button>
        </div>
      </div>
    </div>
  );
}
