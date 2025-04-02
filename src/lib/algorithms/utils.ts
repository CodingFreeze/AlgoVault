import type { AlgorithmStep } from './types.js';

interface Step {
  data: any;
  description: string;
  highlightedNodes?: string[];
  highlightedEdges?: string[][];
  startNode?: string;
}

export function createStep(step: Step): AlgorithmStep {
  return {
    data: step.data,
    description: step.description,
    highlightNodes: step.highlightedNodes || [],
    highlightEdges: step.highlightedEdges || [],
    startNode: step.startNode
  };
} 