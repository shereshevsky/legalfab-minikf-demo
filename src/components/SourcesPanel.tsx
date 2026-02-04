import { motion, AnimatePresence } from 'framer-motion';
import { Database, CheckCircle2, Loader2, Server } from 'lucide-react';
import type { AnimationStep } from '../types';

interface SourcesPanelProps {
  step: AnimationStep | null;
  activeSources: string[];
}

const SOURCE_INFO: Record<string, { icon: string; color: string }> = {
  'Elite (PMS)': { icon: '⚖️', color: '#3b82f6' },
  'Elite (Billing)': { icon: '💵', color: '#22c55e' },
  'Intapp Time': { icon: '⏱️', color: '#8b5cf6' },
  'PeopleSoft (CRM)': { icon: '👥', color: '#f97316' },
};

export function SourcesPanel({ step, activeSources }: SourcesPanelProps) {
  const sources = step?.sources || [];

  return (
    <div className="glass rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-medium text-slate-200">Data Sources</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-auto">
        <AnimatePresence>
          {sources.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-8">
              No sources connected yet
            </div>
          ) : (
            sources.map((source, index) => {
              const info = SOURCE_INFO[source.name] || {
                icon: '📁',
                color: '#6366f1',
              };
              const isActive = activeSources.includes(source.name);

              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    p-3 rounded-lg border transition-all duration-300
                    ${isActive 
                      ? 'bg-blue-500/10 border-blue-500/50' 
                      : source.status === 'complete'
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-slate-800/50 border-slate-700/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${info.color}20` }}
                    >
                      {info.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-200 truncate">
                          {source.name}
                        </span>
                        {isActive ? (
                          <Loader2 className="w-3 h-3 text-blue-400 animate-spin flex-shrink-0" />
                        ) : source.status === 'complete' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {source.type}
                      </p>
                    </div>
                  </div>

                  {/* Records count */}
                  {source.recordsReturned !== null && source.status === 'complete' && (
                    <motion.div 
                      className="mt-2 flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Server className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-400">
                        {source.recordsReturned.toLocaleString()} records
                      </span>
                    </motion.div>
                  )}

                  {/* Loading animation */}
                  {isActive && (
                    <motion.div 
                      className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: info.color }}
                        animate={{ width: ['0%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Lineage Preview */}
      {sources.length > 1 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 mb-2">Data Lineage</p>
          <div className="flex items-center gap-1 flex-wrap">
            {sources.filter(s => s.status === 'complete').map((source, index, arr) => (
              <span key={source.id} className="flex items-center">
                <span className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-300">
                  {SOURCE_INFO[source.name]?.icon || '📁'}
                </span>
                {index < arr.length - 1 && (
                  <span className="text-slate-600 mx-1">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
