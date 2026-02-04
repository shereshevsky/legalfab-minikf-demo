import { motion } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Building2, 
  FileText, 
  Clock, 
  DollarSign,
  GitBranch,
  Bot,
  Database,
  AlertTriangle
} from 'lucide-react';
import type { DemoAnimation } from '../types';

interface ResultsPanelProps {
  finalAnswer: DemoAnimation['finalAnswer'];
  metadata: DemoAnimation['metadata'];
  onClose: () => void;
}

export function ResultsPanel({ finalAnswer, metadata, onClose }: ResultsPanelProps) {
  const clients = Object.entries(finalAnswer.results);
  
  // Calculate totals
  const totalMatters = clients.reduce((acc, [, matters]) => acc + matters.length, 0);
  const totalWip = clients.reduce((acc, [, matters]) => {
    return acc + matters.length; // Simplified - in real app would sum actual values
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[85vh] glass rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Query Complete</h2>
                <p className="text-sm text-slate-400 mt-1">
                  {finalAnswer.lineage.confidence * 100}% confidence • {metadata.entitiesResolved} entities resolved
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 
                         flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400">{clients.length}</div>
              <div className="text-xs text-slate-400 mt-1">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{totalMatters}</div>
              <div className="text-xs text-slate-400 mt-1">Matters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">$2.7M</div>
              <div className="text-xs text-slate-400 mt-1">WIP at Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{metadata.sourcesQueried}</div>
              <div className="text-xs text-slate-400 mt-1">Data Sources</div>
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Summary */}
          <div className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            <p className="text-sm text-slate-300 leading-relaxed">
              {finalAnswer.summary}
            </p>
          </div>

          {/* Client Results */}
          <div className="space-y-4">
            {clients.map(([clientName, matters]) => (
              <div 
                key={clientName}
                className="rounded-xl border border-slate-700/50 overflow-hidden"
              >
                {/* Client Header */}
                <div className="p-4 bg-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-slate-200">{clientName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400">
                      {matters.length} matters
                    </span>
                    <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-medium">
                      WIP at Risk
                    </span>
                  </div>
                </div>

                {/* Matters List */}
                <div className="divide-y divide-slate-700/30">
                  {matters.map((matter) => (
                    <div 
                      key={matter.matterId}
                      className="p-4 hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            <span className="text-xs font-mono text-slate-400">
                              {matter.matterId}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 truncate">
                            {matter.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-amber-400">
                              <Clock className="w-3 h-3" />
                              <span className="text-sm font-medium">{matter.avgWipAge}d</span>
                            </div>
                            <span className="text-xs text-slate-500">WIP Age</span>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-red-400">
                              <AlertTriangle className="w-3 h-3" />
                              <span className="text-sm font-medium">{matter.daysSinceLastBilled}d</span>
                            </div>
                            <span className="text-xs text-slate-500">Since Billed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Lineage */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Data Sources */}
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Sources:</span>
                <div className="flex items-center gap-1">
                  {finalAnswer.lineage.sources.map((source, idx) => (
                    <span key={source}>
                      <span className="text-xs text-slate-300">{source}</span>
                      {idx < finalAnswer.lineage.sources.length - 1 && (
                        <span className="text-slate-600 mx-1">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Agents */}
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">Agents:</span>
              <span className="text-xs text-slate-300">
                {finalAnswer.lineage.agents.join(', ')}
              </span>
            </div>
          </div>

          {/* Query Path */}
          <div className="mt-3 pt-3 border-t border-slate-700/30">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">Query Path:</span>
              <code className="text-xs text-slate-300 font-mono bg-slate-800/50 px-2 py-1 rounded">
                {finalAnswer.lineage.queryPath}
              </code>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
