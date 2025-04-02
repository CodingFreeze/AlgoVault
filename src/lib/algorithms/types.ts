export interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  id: string; // Unique identifier for animation
  depth?: number; // For visualization
  horizontalPosition?: number; // For visualization
  x?: number; // For visualization
  y?: number; // For visualization
}

export interface GraphNode {
  id: string;
  value: number | string;
  x?: number; // For visualization
  y?: number; // For visualization
  adjacent: string[]; // IDs of adjacent nodes
  visited?: boolean; // For traversal algorithms
  distance?: number; // For path-finding algorithms
  previous?: string; // For path-finding algorithms
}

export interface Graph {
  nodes: Record<string, GraphNode>;
  directed: boolean;
  weighted: boolean;
}

export interface AlgorithmStep {
  data: number[] | TreeNode | Graph;
  pointer?: number | number[];
  highlightIndices?: number[];
  highlightNodes?: string[];
  highlightEdges?: string[][];
  highlightLines?: number[];
  description?: string;
  isComplete?: boolean;
  startNode?: string; // For graph traversals, to identify the start node
  custom?: Record<string, any>; // For additional algorithm-specific data
}

export interface Algorithm {
  name: string;
  category: 'sorting' | 'graph' | 'tree' | 'search';
  run: (input: any) => Generator<AlgorithmStep>;
  pseudocode: string[];
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  defaultInput: any;
  implementation?: string; // The actual code implementation
  implementationLanguage?: 'typescript' | 'javascript'; // Language of the implementation
  bestCase?: string; // For sorting algorithms
  worstCase?: string; // For sorting algorithms
} 