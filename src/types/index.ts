// LegalFab MiniKF Demo Types

export interface DemoAnimation {
  query: string;
  totalSteps: number;
  steps: AnimationStep[];
  finalAnswer: FinalAnswer;
  metadata: AnimationMetadata;
}

export interface AnimationStep {
  stepNumber: number;
  phase: StepPhase;
  message: string;
  details: string;
  duration: number;
  graph: GraphState;
  agents: AgentState[];
  sources: SourceState[];
  result: StepResult | null;
}

export type StepPhase = 
  | 'QUERY_ANALYSIS'
  | 'MATTER_RETRIEVAL'
  | 'BILLING_ANALYSIS'
  | 'WIP_CALCULATION'
  | 'CLIENT_ENRICHMENT'
  | 'RESPONSE_SYNTHESIS';

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  status: NodeStatus;
  properties: Record<string, unknown>;
}

export type NodeType = 
  | 'Query'
  | 'SubQuery'
  | 'Agent'
  | 'Source'
  | 'Client'
  | 'Matter'
  | 'Filter'
  | 'Metric'
  | 'Lineage'
  | 'Response';

export type NodeStatus = 
  | 'pending'
  | 'active'
  | 'querying'
  | 'discovered'
  | 'checking'
  | 'qualified'
  | 'enriched'
  | 'calculated'
  | 'final'
  | 'complete'
  | 'answered'
  | 'verified';

export interface GraphEdge {
  source: string;
  target: string;
  type: EdgeType;
}

export type EdgeType = 
  | 'DECOMPOSES_TO'
  | 'PRECEDES'
  | 'ASSIGNED_TO'
  | 'QUERIES'
  | 'RETURNS'
  | 'HAS_MATTER'
  | 'HANDS_OFF_TO'
  | 'APPLIES'
  | 'EVALUATES'
  | 'FEEDS'
  | 'QUALIFIES'
  | 'HAS_METRIC'
  | 'ENRICHES'
  | 'TRACED_BY'
  | 'PRODUCES'
  | 'CONTRIBUTES_TO'
  | 'CONTAINS'
  | 'BACKED_BY';

export interface AgentState {
  id: string;
  name: string;
  status: 'active' | 'complete';
  action: string;
}

export interface SourceState {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'querying' | 'complete';
  recordsReturned: number | null;
}

export interface StepResult {
  status: string;
  [key: string]: unknown;
}

export interface FinalAnswer {
  summary: string;
  results: Record<string, MatterResult[]>;
  lineage: LineageInfo;
}

export interface MatterResult {
  matterId: string;
  name: string;
  avgWipAge: number;
  daysSinceLastBilled: number;
}

export interface LineageInfo {
  sources: string[];
  agents: string[];
  queryPath: string;
  confidence: number;
}

export interface AnimationMetadata {
  totalDuration: number;
  graphOperations: number;
  sourcesQueried: number;
  agentsUsed: number;
  entitiesResolved: number;
}

// Color mappings
export const NODE_COLORS: Record<NodeType, string> = {
  Query: '#6366f1',
  SubQuery: '#8b5cf6',
  Agent: '#f59e0b',
  Source: '#10b981',
  Client: '#3b82f6',
  Matter: '#06b6d4',
  Filter: '#f97316',
  Metric: '#ef4444',
  Lineage: '#84cc16',
  Response: '#22c55e',
};

export const STATUS_COLORS: Record<NodeStatus, string> = {
  pending: '#64748b',
  active: '#fbbf24',
  querying: '#60a5fa',
  discovered: '#34d399',
  checking: '#fbbf24',
  qualified: '#22c55e',
  enriched: '#a78bfa',
  calculated: '#fb923c',
  final: '#22c55e',
  complete: '#22c55e',
  answered: '#22c55e',
  verified: '#22c55e',
};

export const PHASE_ICONS: Record<StepPhase, string> = {
  QUERY_ANALYSIS: '🔍',
  MATTER_RETRIEVAL: '📋',
  BILLING_ANALYSIS: '💰',
  WIP_CALCULATION: '⏱️',
  CLIENT_ENRICHMENT: '👥',
  RESPONSE_SYNTHESIS: '✅',
};

export const PHASE_TITLES: Record<StepPhase, string> = {
  QUERY_ANALYSIS: 'Query Analysis',
  MATTER_RETRIEVAL: 'Matter Retrieval',
  BILLING_ANALYSIS: 'Billing Analysis',
  WIP_CALCULATION: 'WIP Calculation',
  CLIENT_ENRICHMENT: 'Client Enrichment',
  RESPONSE_SYNTHESIS: 'Response Synthesis',
};
