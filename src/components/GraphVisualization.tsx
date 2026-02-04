import { useEffect, useRef, useCallback } from 'react';
import cytoscape, { Core, ElementDefinition } from 'cytoscape';
import type { GraphNode, GraphEdge } from '../types';
import { NODE_COLORS, STATUS_COLORS } from '../types';

interface GraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function GraphVisualization({ nodes, edges }: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // Convert nodes and edges to cytoscape format
  const convertToCytoscapeElements = useCallback((): ElementDefinition[] => {
    const elements: ElementDefinition[] = [];

    // Add nodes
    nodes.forEach((node) => {
      elements.push({
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          status: node.status,
        },
        classes: `node-${node.type.toLowerCase()} status-${node.status}`,
      });
    });

    // Add edges
    edges.forEach((edge) => {
      elements.push({
        data: {
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          type: edge.type,
        },
        classes: `edge-${edge.type.toLowerCase().replace(/_/g, '-')}`,
      });
    });

    return elements;
  }, [nodes, edges]);

  // Initialize cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [],
      style: [
        // Base node style
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 8,
            'font-size': '10px',
            'font-family': 'Inter, sans-serif',
            'color': '#94a3b8',
            'text-outline-color': '#0f172a',
            'text-outline-width': 2,
            'width': 40,
            'height': 40,
            'border-width': 2,
            'border-opacity': 0.8,
            'transition-property': 'background-color, border-color, width, height',
            'transition-duration': '0.3s',
          },
        },
        // Node types
        {
          selector: '.node-query',
          style: {
            'background-color': NODE_COLORS.Query,
            'border-color': '#818cf8',
            'shape': 'diamond',
            'width': 50,
            'height': 50,
          },
        },
        {
          selector: '.node-subquery',
          style: {
            'background-color': NODE_COLORS.SubQuery,
            'border-color': '#a78bfa',
            'shape': 'round-rectangle',
            'width': 35,
            'height': 35,
          },
        },
        {
          selector: '.node-agent',
          style: {
            'background-color': NODE_COLORS.Agent,
            'border-color': '#fbbf24',
            'shape': 'hexagon',
            'width': 45,
            'height': 45,
          },
        },
        {
          selector: '.node-source',
          style: {
            'background-color': NODE_COLORS.Source,
            'border-color': '#34d399',
            'shape': 'barrel',
            'width': 40,
            'height': 40,
          },
        },
        {
          selector: '.node-client',
          style: {
            'background-color': NODE_COLORS.Client,
            'border-color': '#60a5fa',
            'shape': 'round-rectangle',
            'width': 50,
            'height': 35,
          },
        },
        {
          selector: '.node-matter',
          style: {
            'background-color': NODE_COLORS.Matter,
            'border-color': '#22d3ee',
            'shape': 'round-rectangle',
            'width': 35,
            'height': 25,
          },
        },
        {
          selector: '.node-filter',
          style: {
            'background-color': NODE_COLORS.Filter,
            'border-color': '#fb923c',
            'shape': 'rhomboid',
            'width': 45,
            'height': 35,
          },
        },
        {
          selector: '.node-metric',
          style: {
            'background-color': NODE_COLORS.Metric,
            'border-color': '#f87171',
            'shape': 'ellipse',
            'width': 30,
            'height': 30,
          },
        },
        {
          selector: '.node-lineage',
          style: {
            'background-color': NODE_COLORS.Lineage,
            'border-color': '#a3e635',
            'shape': 'round-rectangle',
            'width': 45,
            'height': 30,
          },
        },
        {
          selector: '.node-response',
          style: {
            'background-color': NODE_COLORS.Response,
            'border-color': '#4ade80',
            'shape': 'star',
            'width': 55,
            'height': 55,
          },
        },
        // Status styles
        {
          selector: '.status-active, .status-querying',
          style: {
            'border-width': 3,
            'border-color': '#fbbf24',
            'border-opacity': 1,
          },
        },
        {
          selector: '.status-complete, .status-final, .status-answered, .status-verified',
          style: {
            'border-color': '#22c55e',
            'border-opacity': 0.8,
          },
        },
        {
          selector: '.status-pending',
          style: {
            'opacity': 0.6,
          },
        },
        // Edge styles
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#475569',
            'target-arrow-color': '#475569',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.8,
            'opacity': 0.7,
            'transition-property': 'line-color, target-arrow-color, opacity',
            'transition-duration': '0.3s',
          },
        },
        {
          selector: '.edge-assigned-to, .edge-queries',
          style: {
            'line-color': '#f59e0b',
            'target-arrow-color': '#f59e0b',
            'line-style': 'solid',
          },
        },
        {
          selector: '.edge-has-matter, .edge-contains',
          style: {
            'line-color': '#3b82f6',
            'target-arrow-color': '#3b82f6',
          },
        },
        {
          selector: '.edge-qualifies, .edge-returns',
          style: {
            'line-color': '#22c55e',
            'target-arrow-color': '#22c55e',
          },
        },
        {
          selector: '.edge-decomposes-to, .edge-precedes',
          style: {
            'line-style': 'dashed',
            'line-color': '#8b5cf6',
            'target-arrow-color': '#8b5cf6',
          },
        },
      ],
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 500,
        nodeRepulsion: () => 8000,
        idealEdgeLength: () => 80,
        gravity: 0.5,
        padding: 50,
      },
      minZoom: 0.3,
      maxZoom: 2,
      wheelSensitivity: 0.3,
    });

    // Fit to container on resize
    const resizeObserver = new ResizeObserver(() => {
      cyRef.current?.resize();
      cyRef.current?.fit(undefined, 50);
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      cyRef.current?.destroy();
    };
  }, []);

  // Update elements when nodes/edges change
  useEffect(() => {
    if (!cyRef.current) return;

    const cy = cyRef.current;
    const newElements = convertToCytoscapeElements();
    
    // Get existing element IDs
    const existingIds = new Set(cy.elements().map(ele => ele.id()));
    const newIds = new Set(newElements.map(ele => ele.data?.id));

    // Add new elements
    const toAdd = newElements.filter(ele => !existingIds.has(ele.data?.id || ''));
    if (toAdd.length > 0) {
      cy.add(toAdd);
    }

    // Update existing elements
    newElements.forEach((ele) => {
      const existingNode = cy.getElementById(ele.data?.id || '');
      if (existingNode.length > 0 && ele.classes) {
        existingNode.classes(ele.classes);
      }
    });

    // Run layout if we added nodes
    if (toAdd.some(ele => !ele.data?.source)) {
      cy.layout({
        name: 'cose',
        animate: true,
        animationDuration: 500,
        nodeRepulsion: () => 6000,
        idealEdgeLength: () => 70,
        gravity: 0.4,
        padding: 40,
        randomize: false,
        fit: true,
      }).run();
    }
  }, [nodes, edges, convertToCytoscapeElements]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3">
        <p className="text-xs text-slate-400 mb-2 font-medium">Node Types</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {[
            { type: 'Query', color: NODE_COLORS.Query },
            { type: 'Agent', color: NODE_COLORS.Agent },
            { type: 'Source', color: NODE_COLORS.Source },
            { type: 'Client', color: NODE_COLORS.Client },
            { type: 'Matter', color: NODE_COLORS.Matter },
            { type: 'Filter', color: NODE_COLORS.Filter },
          ].map(({ type, color }) => (
            <div key={type} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-slate-400">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-800/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">Knowledge graph will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
}
