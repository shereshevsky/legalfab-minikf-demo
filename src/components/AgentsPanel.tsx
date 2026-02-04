import { motion, AnimatePresence } from 'framer-motion';
import { Bot, CheckCircle2, Loader2 } from 'lucide-react';
import type { AnimationStep } from '../types';

interface AgentsPanelProps {
  step: AnimationStep | null;
  activeAgents: string[];
}

const AGENT_INFO: Record<string, { icon: string; color: string; description: string }> = {
  'Matter Finance Agent': {
    icon: '📊',
    color: '#f59e0b',
    description: 'Matter & Financial Data Analysis',
  },
  'Revenue Protection Agent': {
    icon: '💰',
    color: '#10b981',
    description: 'Billing & Revenue Analysis',
  },
};

export function AgentsPanel({ step, activeAgents }: AgentsPanelProps) {
  const agents = step?.agents || [];

  return (
    <div className="glass rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-medium text-slate-200">AI Agents</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-auto">
        <AnimatePresence>
          {agents.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-8">
              No agents active yet
            </div>
          ) : (
            agents.map((agent, index) => {
              const info = AGENT_INFO[agent.name] || {
                icon: '🤖',
                color: '#6366f1',
                description: 'AI Agent',
              };
              const isActive = activeAgents.includes(agent.name);

              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    p-3 rounded-lg border transition-all duration-300
                    ${isActive 
                      ? 'bg-amber-500/10 border-amber-500/50' 
                      : agent.status === 'complete'
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
                          {agent.name}
                        </span>
                        {isActive ? (
                          <Loader2 className="w-3 h-3 text-amber-400 animate-spin flex-shrink-0" />
                        ) : agent.status === 'complete' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {agent.action}
                      </p>
                    </div>
                  </div>
                  
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
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 mb-2">Status</p>
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Active
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Complete
          </span>
        </div>
      </div>
    </div>
  );
}
