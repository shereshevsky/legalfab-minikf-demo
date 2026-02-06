import { useMemo, useEffect, useState } from 'react';
import type { GraphNode, GraphEdge } from '../types';

interface FixedGraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Modern color palette with gradients
const NODE_STYLES: Record<string, { gradient: [string, string]; glow: string; icon: string }> = {
  Query: {
    gradient: ['#8b5cf6', '#6366f1'],
    glow: 'rgba(139, 92, 246, 0.5)',
    icon: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
  },
  SubQuery: {
    gradient: ['#a78bfa', '#8b5cf6'],
    glow: 'rgba(167, 139, 250, 0.4)',
    icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z'
  },
  Agent: {
    gradient: ['#f59e0b', '#d97706'],
    glow: 'rgba(245, 158, 11, 0.5)',
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z'
  },
  Source: {
    gradient: ['#10b981', '#059669'],
    glow: 'rgba(16, 185, 129, 0.5)',
    icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375'
  },
  Filter: {
    gradient: ['#f97316', '#ea580c'],
    glow: 'rgba(249, 115, 22, 0.5)',
    icon: 'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z'
  },
  Client: {
    gradient: ['#3b82f6', '#2563eb'],
    glow: 'rgba(59, 130, 246, 0.5)',
    icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
  },
  Matter: {
    gradient: ['#06b6d4', '#0891b2'],
    glow: 'rgba(6, 182, 212, 0.4)',
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
  },
  Metric: {
    gradient: ['#ef4444', '#dc2626'],
    glow: 'rgba(239, 68, 68, 0.4)',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z'
  },
  Lineage: {
    gradient: ['#84cc16', '#65a30d'],
    glow: 'rgba(132, 204, 22, 0.4)',
    icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244'
  },
  Response: {
    gradient: ['#22c55e', '#16a34a'],
    glow: 'rgba(34, 197, 94, 0.6)',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z'
  },
  MarketData: {
    gradient: ['#ec4899', '#db2777'],
    glow: 'rgba(236, 72, 153, 0.5)',
    icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
  },
};

// Column-based layout for clear hierarchy
const COLUMNS = {
  Query: { x: 80, width: 60 },
  SubQuery: { x: 200, width: 50 },
  Agent: { x: 340, width: 55 },
  Source: { x: 480, width: 55 },
  MarketData: { x: 550, width: 50 },
  Filter: { x: 620, width: 50 },
  Client: { x: 760, width: 55 },
  Matter: { x: 900, width: 45 },
  Metric: { x: 1000, width: 40 },
  Lineage: { x: 760, width: 50 },
  Response: { x: 1050, width: 65 },
};

// Node sizes by type
const NODE_SIZES: Record<string, number> = {
  Query: 48,
  SubQuery: 36,
  Agent: 44,
  Source: 42,
  MarketData: 42,
  Filter: 38,
  Client: 42,
  Matter: 32,
  Metric: 28,
  Lineage: 36,
  Response: 52,
};

const getNodePosition = (node: GraphNode, nodesOfType: GraphNode[]): { x: number; y: number } => {
  const col = COLUMNS[node.type as keyof typeof COLUMNS] || { x: 500, width: 50 };
  const indexInType = nodesOfType.findIndex(n => n.id === node.id);
  const total = nodesOfType.length;

  // Center vertically, spread based on count
  const centerY = 200;
  const spacing = Math.min(70, 400 / Math.max(total, 1));
  const startY = centerY - ((total - 1) * spacing) / 2;

  return {
    x: col.x,
    y: startY + indexInType * spacing,
  };
};

// Animated data particle component
function DataParticle({
  startX, startY, endX, endY, delay, color
}: {
  startX: number; startY: number; endX: number; endY: number; delay: number; color: string;
}) {
  return (
    <circle r="3" fill={color}>
      <animate
        attributeName="cx"
        values={`${startX};${endX}`}
        dur="1.5s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
      <animate
        attributeName="cy"
        values={`${startY};${endY}`}
        dur="1.5s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        dur="1.5s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
}

export function FixedGraphVisualization({ nodes, edges }: FixedGraphVisualizationProps) {
  const [animatedNodes, setAnimatedNodes] = useState<Set<string>>(new Set());

  // Animate nodes appearing
  useEffect(() => {
    const nodeIds = nodes.map(n => n.id);
    const newNodes = nodeIds.filter(id => !animatedNodes.has(id));

    if (newNodes.length > 0) {
      newNodes.forEach((id, index) => {
        setTimeout(() => {
          setAnimatedNodes(prev => new Set([...prev, id]));
        }, index * 80);
      });
    }
  }, [nodes, animatedNodes]);

  // Group nodes by type
  const nodesByType = useMemo(() => {
    const grouped: Record<string, GraphNode[]> = {};
    nodes.forEach(node => {
      if (!grouped[node.type]) grouped[node.type] = [];
      grouped[node.type].push(node);
    });
    return grouped;
  }, [nodes]);

  // Calculate positions
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    nodes.forEach(node => {
      const nodesOfType = nodesByType[node.type] || [];
      positions[node.id] = getNodePosition(node, nodesOfType);
    });
    return positions;
  }, [nodes, nodesByType]);

  // Generate unique gradient IDs
  const gradientIds = useMemo(() => {
    const ids: Record<string, string> = {};
    Object.keys(NODE_STYLES).forEach(type => {
      ids[type] = `grad-${type}-${Math.random().toString(36).substr(2, 9)}`;
    });
    return ids;
  }, []);

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <svg
        viewBox="0 0 1150 400"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient definitions */}
          {Object.entries(NODE_STYLES).map(([type, style]) => (
            <linearGradient key={type} id={gradientIds[type]} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={style.gradient[0]} />
              <stop offset="100%" stopColor={style.gradient[1]} />
            </linearGradient>
          ))}

          {/* Glow filters */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Drop shadow */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3"/>
          </filter>

          {/* Arrow markers */}
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#475569" />
          </marker>
          <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
          </marker>
          <marker id="arrow-complete" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#22c55e" />
          </marker>
        </defs>

        {/* Column labels */}
        <g className="column-labels" opacity="0.4">
          {Object.entries(COLUMNS).map(([type, col]) => {
            if (!nodesByType[type]?.length) return null;
            return (
              <text
                key={type}
                x={col.x}
                y={30}
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
                fontWeight="500"
                letterSpacing="0.05em"
              >
                {type.toUpperCase()}
              </text>
            );
          })}
        </g>

        {/* Edges with animations */}
        <g className="edges">
          {edges.map((edge, edgeIndex) => {
            const sourcePos = nodePositions[edge.source];
            const targetPos = nodePositions[edge.target];
            if (!sourcePos || !targetPos) return null;

            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            const isActive = sourceNode?.status === 'active' || sourceNode?.status === 'querying' ||
                            targetNode?.status === 'active' || targetNode?.status === 'querying';
            const isComplete = sourceNode?.status === 'complete' && targetNode?.status === 'complete';

            // Calculate curved path
            const dx = targetPos.x - sourcePos.x;
            const dy = targetPos.y - sourcePos.y;
            const midX = sourcePos.x + dx * 0.5;
            const curveStrength = Math.abs(dy) > 50 ? 30 : 15;
            const controlY = sourcePos.y + dy * 0.5 + (dy > 0 ? -curveStrength : curveStrength);

            const pathD = `M ${sourcePos.x} ${sourcePos.y} Q ${midX} ${controlY} ${targetPos.x} ${targetPos.y}`;

            const strokeColor = isActive ? '#f59e0b' : isComplete ? '#22c55e' : '#334155';
            const markerEnd = isActive ? 'url(#arrow-active)' : isComplete ? 'url(#arrow-complete)' : 'url(#arrow)';

            return (
              <g key={`${edge.source}-${edge.target}`}>
                {/* Edge glow for active */}
                {isActive && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="6"
                    strokeOpacity="0.2"
                    filter="url(#glow)"
                  />
                )}

                {/* Main edge */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isActive ? 2 : 1.5}
                  strokeOpacity={isActive ? 0.9 : isComplete ? 0.6 : 0.3}
                  strokeDasharray={edge.type === 'DECOMPOSES_TO' || edge.type === 'PRECEDES' ? '6 4' : 'none'}
                  markerEnd={markerEnd}
                  className="transition-all duration-700"
                />

                {/* Animated particles for active edges */}
                {isActive && (
                  <>
                    <DataParticle
                      startX={sourcePos.x}
                      startY={sourcePos.y}
                      endX={targetPos.x}
                      endY={targetPos.y}
                      delay={(edgeIndex % 5) * 0.3}
                      color="#fbbf24"
                    />
                    <DataParticle
                      startX={sourcePos.x}
                      startY={sourcePos.y}
                      endX={targetPos.x}
                      endY={targetPos.y}
                      delay={(edgeIndex % 5) * 0.3 + 0.5}
                      color="#f59e0b"
                    />
                  </>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const size = NODE_SIZES[node.type] || 40;
            const style = NODE_STYLES[node.type] || NODE_STYLES.Query;
            const isActive = node.status === 'active' || node.status === 'querying';
            const isComplete = node.status === 'complete' || node.status === 'final' ||
                              node.status === 'answered' || node.status === 'verified';
            const isVisible = animatedNodes.has(node.id);

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="transition-all duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: `translate(${pos.x}px, ${pos.y}px) scale(${isVisible ? 1 : 0.5})`,
                }}
              >
                {/* Outer glow ring for active */}
                {isActive && (
                  <>
                    <circle
                      r={size / 2 + 12}
                      fill="none"
                      stroke={style.gradient[0]}
                      strokeWidth="2"
                      strokeOpacity="0.3"
                      className="animate-ping"
                    />
                    <circle
                      r={size / 2 + 6}
                      fill={style.glow}
                      filter="url(#glow-strong)"
                    />
                  </>
                )}

                {/* Complete indicator ring */}
                {isComplete && (
                  <circle
                    r={size / 2 + 4}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeOpacity="0.6"
                  />
                )}

                {/* Main node circle */}
                <circle
                  r={size / 2}
                  fill={`url(#${gradientIds[node.type]})`}
                  filter={isActive ? 'url(#glow)' : 'url(#shadow)'}
                  className="transition-all duration-300"
                />

                {/* Inner highlight */}
                <circle
                  r={size / 2 - 2}
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />

                {/* Icon */}
                <g transform={`translate(${-size/4}, ${-size/4}) scale(${size/48})`}>
                  <path
                    d={style.icon}
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                </g>

                {/* Label */}
                <text
                  y={size / 2 + 16}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontWeight="500"
                  className="pointer-events-none"
                >
                  {node.label.length > 18 ? node.label.substring(0, 15) + '...' : node.label}
                </text>

                {/* Status indicator dot */}
                <circle
                  cx={size / 2 - 4}
                  cy={-size / 2 + 4}
                  r="5"
                  fill={isActive ? '#fbbf24' : isComplete ? '#22c55e' : '#475569'}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Modern Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-xl p-4 backdrop-blur-xl border border-slate-700/50">
        <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Node Types</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {['Query', 'Agent', 'Source', 'MarketData', 'Client', 'Filter'].map(type => {
            const style = NODE_STYLES[type];
            return (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${style.gradient[0]}, ${style.gradient[1]})`,
                    boxShadow: `0 0 8px ${style.glow}`
                  }}
                />
                <span className="text-xs text-slate-300 font-medium">{type}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Legend */}
      <div className="absolute bottom-4 right-4 glass rounded-xl p-4 backdrop-blur-xl border border-slate-700/50">
        <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Status</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50" />
            <span className="text-xs text-slate-300">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            <span className="text-xs text-slate-300">Complete</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            <span className="text-xs text-slate-300">Pending</span>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
              <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">Knowledge Graph</p>
            <p className="text-slate-500 text-xs mt-1">Press play to visualize the query flow</p>
          </div>
        </div>
      )}
    </div>
  );
}
