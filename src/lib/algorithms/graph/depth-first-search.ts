import { createStep } from '../utils.js';
import type { Algorithm, AlgorithmStep, Graph } from '../types.js';

interface DFSState {
  visited: Set<string>;
  stack: string[];
  currentNode: string | null;
  result: string[];
}

/**
 * Performs a depth-first search traversal on a graph starting from a given node.
 * 
 * @param graph - The graph to traverse
 * @param startNode - The ID of the node to start from
 * @returns A generator that yields algorithm steps for visualization
 */
export function* depthFirstSearch(graph: Graph, startNodeId: string): Generator<AlgorithmStep, string[], void> {
  if (!graph || !graph.nodes || !graph.nodes[startNodeId]) {
    yield createStep({
      data: graph,
      description: `Invalid graph or start node ${startNodeId} not found in graph`,
      highlightedNodes: [],
      highlightedEdges: []
    });
    return [];
  }

  const state: DFSState = {
    visited: new Set<string>(),
    stack: [startNodeId],
    currentNode: null,
    result: []
  };

  // Deep copy the graph to avoid modifying the original
  const workingGraph = JSON.parse(JSON.stringify(graph));
  
  // Create an initial step showing the state before we begin
  const initialStep = createStep({
    data: workingGraph,
    description: `Begin DFS traversal from node ${startNodeId}`,
    highlightedNodes: [startNodeId],
    highlightedEdges: [],
    startNode: startNodeId
  });
  initialStep.highlightLines = [1, 2];
  yield initialStep;

  // Process nodes until the stack is empty
  while (state.stack.length > 0) {
    // Get the next node from the stack (LIFO - Last In, First Out)
    state.currentNode = state.stack.pop()!;
    
    // If we've already visited this node, skip it
    if (state.visited.has(state.currentNode)) {
      continue;
    }
    
    // Mark the current node as visited
    state.visited.add(state.currentNode);
    state.result.push(state.currentNode);
    
    // Update the working graph to show the node as visited
    if (workingGraph.nodes[state.currentNode]) {
      workingGraph.nodes[state.currentNode].visited = true;
    }
    
    // Show the current step - processing the current node
    const visitStep = createStep({
      data: workingGraph,
      description: `Visit node ${state.currentNode}`,
      highlightedNodes: [state.currentNode],
      highlightedEdges: [],
      startNode: startNodeId
    });
    visitStep.highlightLines = [3, 4, 5];
    visitStep.custom = {
      stack: [...state.stack],
      visited: [...state.visited],
      result: [...state.result]
    };
    yield visitStep;
    
    // Get all adjacent nodes
    const adjacentNodes = workingGraph.nodes[state.currentNode]?.adjacent || [];
    const unvisitedAdjacent = adjacentNodes.filter((nodeId: string) => !state.visited.has(nodeId));
    
    // If there are no unvisited adjacent nodes, backtrack
    if (unvisitedAdjacent.length === 0) {
      const backtrackStep = createStep({
        data: workingGraph,
        description: `No unvisited neighbors for node ${state.currentNode}, backtrack`,
        highlightedNodes: [state.currentNode],
        highlightedEdges: [],
        startNode: startNodeId
      });
      backtrackStep.highlightLines = [6, 7, 8];
      backtrackStep.custom = {
        stack: [...state.stack],
        visited: [...state.visited],
        result: [...state.result]
      };
      yield backtrackStep;
      continue;
    }
    
    // Add all unvisited neighbors to the stack (in reverse order to maintain traditional DFS order)
    const currentHighlightEdges: string[][] = [];
    for (let i = unvisitedAdjacent.length - 1; i >= 0; i--) {
      const neighborId = unvisitedAdjacent[i];
      state.stack.push(neighborId);
      currentHighlightEdges.push([state.currentNode, neighborId]);
    }
    
    const addNeighborsStep = createStep({
      data: workingGraph,
      description: `Add unvisited neighbors of ${state.currentNode} to the stack: ${unvisitedAdjacent.reverse().join(', ')}`,
      highlightedNodes: [state.currentNode, ...unvisitedAdjacent],
      highlightedEdges: currentHighlightEdges,
      startNode: startNodeId
    });
    addNeighborsStep.highlightLines = [9, 10, 11];
    addNeighborsStep.custom = {
      stack: [...state.stack],
      visited: [...state.visited],
      result: [...state.result]
    };
    yield addNeighborsStep;
  }
  
  // Final step showing the completed traversal
  const finalStep = createStep({
    data: workingGraph,
    description: `DFS traversal complete. Visit order: ${state.result.join(' → ')}`,
    highlightedNodes: [...state.result],
    highlightedEdges: [],
    startNode: startNodeId
  });
  finalStep.highlightLines = [12];
  finalStep.isComplete = true;
  finalStep.custom = {
    stack: [],
    visited: [...state.visited],
    result: [...state.result]
  };
  yield finalStep;
  
  return state.result;
}

export const dfsAlgorithm: Algorithm = {
  name: 'Depth-First Search',
  category: 'graph',
  description: 
    'Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. ' +
    'Starting from a source node, DFS uses a stack (often implemented recursively) to track the exploration path. ' +
    'It dives deep into the graph, visiting a node and then recursively visiting all its unvisited neighbors before backtracking. ' +
    'This creates a depth-first tree that can reveal information about the graph structure. ' +
    'DFS is fundamental for topological sorting, finding connected components, maze generation, and cycle detection. ' +
    'With O(V+E) time complexity, it efficiently works with both dense and sparse graphs, though it may not find the shortest path. ' +
    'Unlike Breadth-First Search, DFS tends to be more useful for exploring distant nodes and analyzing graph properties like connectivity.',
  defaultInput: {
    graph: {
      nodes: {
        'A': { id: 'A', value: 1, x: 100, y: 100, adjacent: ['B', 'C'] },
        'B': { id: 'B', value: 2, x: 200, y: 100, adjacent: ['A', 'D', 'E'] },
        'C': { id: 'C', value: 3, x: 100, y: 200, adjacent: ['A', 'F'] },
        'D': { id: 'D', value: 4, x: 300, y: 100, adjacent: ['B'] },
        'E': { id: 'E', value: 5, x: 200, y: 200, adjacent: ['B', 'F'] },
        'F': { id: 'F', value: 6, x: 100, y: 300, adjacent: ['C', 'E'] }
      },
      directed: false,
      weighted: false
    },
    startNode: 'A'
  },
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  bestCase: 'When the target node is along the first explored path',
  worstCase: 'When the target node is the last one to be explored',
  pseudocode: [
    'function DFS(graph, start_node):',
    '    create empty set visited',
    '    create empty stack S',
    '    add start_node to S',
    '    while S is not empty:',
    '        node = S.pop()',
    '        if node is not in visited:',
    '            add node to visited',
    '            for each neighbor of node:',
    '                if neighbor is not in visited:',
    '                    add neighbor to S',
    '    return visited'
  ],
  run: function(input) {
    if (!input || !input.graph) {
      console.error('Invalid input, missing graph:', input);
      return (function* () { 
        yield createStep({
          data: { nodes: {}, directed: false, weighted: false },
          description: 'Invalid input: missing graph',
          highlightedNodes: [],
          highlightedEdges: []
        });
        return [];
      })();
    }
    return depthFirstSearch(input.graph, input.startNode);
  }
}; 