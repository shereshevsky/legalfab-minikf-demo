import { useMemo } from 'react';
import type { AnimationStep } from '../types';

interface PipelineVisualizationProps {
  step: AnimationStep | null;
  currentStep: number;
  totalSteps: number;
}

interface PipelineStage {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'complete';
  detail?: string;
}

export function PipelineVisualization({ step, currentStep, totalSteps }: PipelineVisualizationProps) {
  const stages = useMemo((): PipelineStage[] => {
    if (!step || currentStep < 0) {
      return [
        { id: 'query', label: 'Query', icon: <QueryIcon />, status: 'pending' },
        { id: 'analyze', label: 'Analyze', icon: <AnalyzeIcon />, status: 'pending' },
        { id: 'retrieve', label: 'Retrieve', icon: <RetrieveIcon />, status: 'pending' },
        { id: 'process', label: 'Process', icon: <ProcessIcon />, status: 'pending' },
        { id: 'respond', label: 'Respond', icon: <RespondIcon />, status: 'pending' },
      ];
    }

    const phase = step.phase;

    return [
      {
        id: 'query',
        label: 'Query',
        icon: <QueryIcon />,
        status: currentStep >= 0 ? 'complete' : 'pending',
        detail: currentStep === 0 ? 'Received' : undefined
      },
      {
        id: 'analyze',
        label: 'Analyze',
        icon: <AnalyzeIcon />,
        status: phase === 'QUERY_ANALYSIS' ? 'active' : currentStep >= 1 ? 'complete' : 'pending',
        detail: phase === 'QUERY_ANALYSIS' ? 'Decomposing...' : currentStep >= 1 ? '4 sub-queries' : undefined
      },
      {
        id: 'retrieve',
        label: 'Retrieve',
        icon: <RetrieveIcon />,
        status: ['MATTER_RETRIEVAL', 'BILLING_ANALYSIS'].includes(phase) ? 'active' : currentStep >= 3 ? 'complete' : 'pending',
        detail: ['MATTER_RETRIEVAL', 'BILLING_ANALYSIS'].includes(phase)
          ? `${step.sources.filter(s => s.status === 'querying').length} source(s)...`
          : currentStep >= 3 ? `${step.sources.length} sources` : undefined
      },
      {
        id: 'process',
        label: 'Process',
        icon: <ProcessIcon />,
        status: ['WIP_CALCULATION', 'CLIENT_ENRICHMENT'].includes(phase) ? 'active' : currentStep >= 5 ? 'complete' : 'pending',
        detail: ['WIP_CALCULATION', 'CLIENT_ENRICHMENT'].includes(phase)
          ? 'Filtering & enriching...'
          : currentStep >= 5 ? '12 matters qualified' : undefined
      },
      {
        id: 'respond',
        label: 'Respond',
        icon: <RespondIcon />,
        status: phase === 'RESPONSE_SYNTHESIS' ? 'active' : currentStep >= totalSteps - 1 ? 'complete' : 'pending',
        detail: phase === 'RESPONSE_SYNTHESIS' ? 'Synthesizing...' : currentStep >= totalSteps - 1 ? 'Complete!' : undefined
      },
    ];
  }, [step, currentStep, totalSteps]);

  // Get active agents and sources for the detail panels
  const activeAgents = step?.agents.filter(a => a.status === 'active') || [];
  const activeSources = step?.sources.filter(s => s.status === 'querying' || s.status === 'connected') || [];
  const completeSources = step?.sources.filter(s => s.status === 'complete') || [];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Pipeline */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="flex items-center gap-2 w-full max-w-4xl">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center flex-1">
              {/* Stage Node */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative
                    ${stage.status === 'active'
                      ? 'bg-amber-500/20 border-2 border-amber-500 shadow-lg shadow-amber-500/20'
                      : stage.status === 'complete'
                        ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                        : 'bg-slate-800/50 border-2 border-slate-700/50'}
                  `}
                >
                  {/* Pulse animation for active */}
                  {stage.status === 'active' && (
                    <div className="absolute inset-0 rounded-2xl bg-amber-500/20 animate-ping" />
                  )}
                  <div className={`
                    w-8 h-8 relative z-10
                    ${stage.status === 'active'
                      ? 'text-amber-400'
                      : stage.status === 'complete'
                        ? 'text-emerald-400'
                        : 'text-slate-500'}
                  `}>
                    {stage.icon}
                  </div>
                </div>
                <span className={`
                  mt-2 text-sm font-medium transition-colors duration-300
                  ${stage.status === 'active'
                    ? 'text-amber-400'
                    : stage.status === 'complete'
                      ? 'text-emerald-400'
                      : 'text-slate-500'}
                `}>
                  {stage.label}
                </span>
                {stage.detail && (
                  <span className="text-xs text-slate-400 mt-1">{stage.detail}</span>
                )}
              </div>

              {/* Connector */}
              {index < stages.length - 1 && (
                <div className="flex-shrink-0 w-12 h-1 relative mx-2">
                  <div className="absolute inset-0 bg-slate-700/50 rounded-full" />
                  <div
                    className={`
                      absolute inset-y-0 left-0 rounded-full transition-all duration-500
                      ${stage.status === 'complete' ? 'bg-emerald-500/70 w-full' :
                        stage.status === 'active' ? 'bg-amber-500/70 w-1/2' : 'w-0'}
                    `}
                  />
                  {/* Animated dot for active connections */}
                  {stage.status === 'active' && (
                    <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-400 rounded-full animate-flow-dot" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="h-48 border-t border-slate-700/50 bg-slate-900/30 p-4">
        <div className="grid grid-cols-3 gap-4 h-full">
          {/* Agents Panel */}
          <div className="glass rounded-lg p-3 overflow-hidden">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Active Agents
            </h4>
            <div className="space-y-2">
              {activeAgents.length > 0 ? (
                activeAgents.map(agent => (
                  <div key={agent.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <span className="text-sm text-slate-300">{agent.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No active agents</p>
              )}
            </div>
          </div>

          {/* Sources Panel */}
          <div className="glass rounded-lg p-3 overflow-hidden">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Data Sources
            </h4>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {[...activeSources, ...completeSources].map(source => (
                <div key={source.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      source.status === 'querying' ? 'bg-amber-400 animate-pulse' :
                      source.status === 'complete' ? 'bg-emerald-400' : 'bg-blue-400'
                    }`} />
                    <span className="text-sm text-slate-300">{source.name}</span>
                  </div>
                  {source.recordsReturned && (
                    <span className="text-xs text-slate-500">{source.recordsReturned} records</span>
                  )}
                </div>
              ))}
              {activeSources.length === 0 && completeSources.length === 0 && (
                <p className="text-sm text-slate-500 italic">No sources queried</p>
              )}
            </div>
          </div>

          {/* Current Action Panel */}
          <div className="glass rounded-lg p-3 overflow-hidden">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Current Action
            </h4>
            {step ? (
              <div>
                <p className="text-sm text-slate-200 mb-1">{step.message}</p>
                <p className="text-xs text-slate-400">{step.details}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Press play to start demo</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function QueryIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

function AnalyzeIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function RetrieveIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  );
}

function ProcessIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function RespondIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  );
}
