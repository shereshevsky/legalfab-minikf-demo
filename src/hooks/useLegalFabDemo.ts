import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { DemoAnimation, AnimationStep, GraphNode, GraphEdge } from '../types';
import demoDataBilling from '../data/demoData.json';
import demoDataEngagement from '../data/demoClientEngagement.json';

export type DemoType = 'billing' | 'engagement';

interface UseLegalFabDemoReturn {
  // State
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  step: AnimationStep | null;
  visibleNodes: GraphNode[];
  visibleEdges: GraphEdge[];
  activeAgents: string[];
  activeSources: string[];
  isAnimating: boolean;

  // Data
  query: string;
  finalAnswer: DemoAnimation['finalAnswer'];
  metadata: DemoAnimation['metadata'];

  // Controls
  play: () => void;
  pause: () => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Computed
  isComplete: boolean;
  progress: number;
}

export function useLegalFabDemo(demoType: DemoType = 'billing'): UseLegalFabDemoReturn {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleNodes, setVisibleNodes] = useState<GraphNode[]>([]);
  const [visibleEdges, setVisibleEdges] = useState<GraphEdge[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [activeSources, setActiveSources] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const animationTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isAnimatingRef = useRef(false);
  const prevDemoType = useRef(demoType);

  // Select demo data based on type
  const data = useMemo(() => {
    return demoType === 'engagement'
      ? (demoDataEngagement as DemoAnimation)
      : (demoDataBilling as DemoAnimation);
  }, [demoType]);

  const totalSteps = data.totalSteps;
  const step = currentStep >= 0 ? data.steps[currentStep] : null;

  // Clear all animation timeouts
  const clearAnimations = useCallback(() => {
    animationTimeouts.current.forEach(clearTimeout);
    animationTimeouts.current = [];
  }, []);

  // Reset when demo type changes
  useEffect(() => {
    if (prevDemoType.current !== demoType) {
      clearAnimations();
      isAnimatingRef.current = false;
      setCurrentStep(-1);
      setIsPlaying(false);
      setVisibleNodes([]);
      setVisibleEdges([]);
      setActiveAgents([]);
      setActiveSources([]);
      setIsAnimating(false);
      prevDemoType.current = demoType;
    }
  }, [demoType, clearAnimations]);

  // Animate nodes and edges appearing
  useEffect(() => {
    if (!step || currentStep < 0) return;

    clearAnimations();
    isAnimatingRef.current = true;
    setIsAnimating(true);

    const nodeDelay = 120;
    const edgeDelay = 60;

    // Animate nodes
    step.graph.nodes.forEach((node, index) => {
      const timeout = setTimeout(() => {
        setVisibleNodes(prev => {
          const existing = prev.find(n => n.id === node.id);
          if (existing) {
            return prev.map(n => n.id === node.id ? { ...node } : n);
          }
          return [...prev, node];
        });
      }, index * nodeDelay);
      animationTimeouts.current.push(timeout);
    });

    // Animate edges after nodes
    const edgeStartDelay = step.graph.nodes.length * nodeDelay + 200;
    step.graph.edges.forEach((edge, index) => {
      const timeout = setTimeout(() => {
        setVisibleEdges(prev => {
          const existing = prev.find(
            e => e.source === edge.source && e.target === edge.target
          );
          if (existing) return prev;
          return [...prev, edge];
        });
      }, edgeStartDelay + index * edgeDelay);
      animationTimeouts.current.push(timeout);
    });

    // Update agents and sources
    setActiveAgents(step.agents.filter(a => a.status === 'active').map(a => a.name));
    setActiveSources(step.sources.filter(s => s.status === 'querying').map(s => s.name));

    // Mark animation as complete
    const totalAnimationTime = edgeStartDelay + step.graph.edges.length * edgeDelay + 200;
    const doneTimeout = setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimating(false);
    }, totalAnimationTime);
    animationTimeouts.current.push(doneTimeout);

    return () => clearAnimations();
  }, [currentStep, step, clearAnimations]);

  // Auto-play functionality
  useEffect(() => {
    // Use ref for synchronous check to avoid race condition
    if (!isPlaying || currentStep >= totalSteps - 1 || isAnimating || isAnimatingRef.current) {
      if (currentStep >= totalSteps - 1) setIsPlaying(false);
      return;
    }

    // Add small buffer after animation completes before advancing
    const duration = step?.duration || 2000;
    const timer = setTimeout(() => {
      if (!isAnimatingRef.current) {
        setCurrentStep(prev => prev + 1);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps, step?.duration, isAnimating]);

  // Control functions
  const play = useCallback(() => {
    if (currentStep < 0) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    clearAnimations();
    isAnimatingRef.current = false;
    setCurrentStep(-1);
    setIsPlaying(false);
    setVisibleNodes([]);
    setVisibleEdges([]);
    setActiveAgents([]);
    setActiveSources([]);
    setIsAnimating(false);
  }, [clearAnimations]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      // Reset to beginning of previous step
      const targetStep = currentStep - 1;
      setVisibleNodes([]);
      setVisibleEdges([]);

      // Rebuild graph state up to target step
      setTimeout(() => {
        const allNodes: GraphNode[] = [];
        const allEdges: GraphEdge[] = [];

        for (let i = 0; i <= targetStep; i++) {
          const s = data.steps[i];
          s.graph.nodes.forEach(node => {
            if (!allNodes.find(n => n.id === node.id)) {
              allNodes.push(node);
            }
          });
          s.graph.edges.forEach(edge => {
            if (!allEdges.find(e => e.source === edge.source && e.target === edge.target)) {
              allEdges.push(edge);
            }
          });
        }

        setVisibleNodes(allNodes);
        setVisibleEdges(allEdges);
        setCurrentStep(targetStep);
      }, 50);
    }
  }, [currentStep, data.steps]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      // Reset and rebuild to target step
      setVisibleNodes([]);
      setVisibleEdges([]);

      setTimeout(() => {
        const allNodes: GraphNode[] = [];
        const allEdges: GraphEdge[] = [];

        for (let i = 0; i <= stepIndex; i++) {
          const s = data.steps[i];
          s.graph.nodes.forEach(node => {
            const existing = allNodes.findIndex(n => n.id === node.id);
            if (existing >= 0) {
              allNodes[existing] = node;
            } else {
              allNodes.push(node);
            }
          });
          s.graph.edges.forEach(edge => {
            if (!allEdges.find(e => e.source === edge.source && e.target === edge.target)) {
              allEdges.push(edge);
            }
          });
        }

        setVisibleNodes(allNodes);
        setVisibleEdges(allEdges);
        setCurrentStep(stepIndex);
      }, 50);
    }
  }, [totalSteps, data.steps]);

  return {
    currentStep,
    totalSteps,
    isPlaying,
    step,
    visibleNodes,
    visibleEdges,
    activeAgents,
    activeSources,
    isAnimating,

    query: data.query,
    finalAnswer: data.finalAnswer,
    metadata: data.metadata,

    play,
    pause,
    reset,
    nextStep,
    prevStep,
    goToStep,

    isComplete: currentStep >= totalSteps - 1,
    progress: currentStep < 0 ? 0 : ((currentStep + 1) / totalSteps) * 100,
  };
}
