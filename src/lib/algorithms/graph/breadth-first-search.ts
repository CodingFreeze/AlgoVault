import { createStep } from '../utils.js';
import type { Algorithm, AlgorithmStep, Graph } from '../types.js';

interface BFSState {
  visited: Set<string>;
  queue: string[];
  currentNode: string | null;
  result: string[];
}

export function* breadthFirstSearch(graph: Graph, startNode: string): Generator<AlgorithmStep, string[], unknown> {
  // Initialize data structures
  const visited = new Set<string>();
  const queue: string[] = [startNode];
  const result: string[] = [];
  let currentNode: string | null = null;

  // Create initial step
  yield createStep({
    data: graph,
    description: 'Starting breadth-first search from node ' + startNode,
    highlightedNodes: [startNode],
    highlightedEdges: [],
    startNode: startNode
  });

  // Main BFS loop
  while (queue.length > 0) {
    currentNode = queue.shift()!;
    
    if (!visited.has(currentNode)) {
      visited.add(currentNode);
      result.push(currentNode);

      // Create step for current node
      yield createStep({
        data: graph,
        description: `Processing node ${currentNode}`,
        highlightedNodes: Array.from(visited),
        highlightedEdges: Object.entries(graph.nodes)
          .filter(([id]) => visited.has(id))
          .flatMap(([id, node]) => 
            node.adjacent
              .filter(adjId => visited.has(adjId))
              .map(adjId => [id, adjId])
          ),
        startNode: startNode
      });

      // Add unvisited neighbors to queue
      const currentNodeData = graph.nodes[currentNode];
      if (currentNodeData) {
        for (const neighborId of currentNodeData.adjacent) {
          if (!visited.has(neighborId)) {
            queue.push(neighborId);
            
            // Create step for adding neighbor to queue
            yield createStep({
              data: graph,
              description: `Adding unvisited neighbor ${neighborId} to queue`,
              highlightedNodes: Array.from(visited).concat([currentNode]),
              highlightedEdges: [
                ...Object.entries(graph.nodes)
                  .filter(([id]) => visited.has(id))
                  .flatMap(([id, node]) => 
                    node.adjacent
                      .filter(adjId => visited.has(adjId))
                      .map(adjId => [id, adjId])
                  ),
                [currentNode, neighborId]
              ],
              startNode: startNode
            });
          }
        }
      }
    }
  }

  // Create final step
  yield createStep({
    data: graph,
    description: 'Breadth-first search completed',
    highlightedNodes: Array.from(visited),
    highlightedEdges: Object.entries(graph.nodes)
      .filter(([id]) => visited.has(id))
      .flatMap(([id, node]) => 
        node.adjacent
          .filter(adjId => visited.has(adjId))
          .map(adjId => [id, adjId])
      ),
    startNode: startNode
  });

  return result;
}

export const bfsAlgorithm: Algorithm = {
  name: 'Breadth-First Search',
  category: 'graph',
  description: 
    'Breadth-First Search (BFS) is a fundamental graph traversal algorithm that systematically explores ' +
    'a graph by visiting all neighbors at the current depth level before moving to nodes at the next ' +
    'depth. Starting from a source node, BFS uses a queue data structure to maintain the order of ' +
    'exploration, ensuring that nodes are visited in order of their distance from the source. This ' +
    'level-by-level exploration creates a breadth-first tree that reveals the shortest path (in terms ' +
    'of number of edges) from the source to any reachable node. BFS is essential in numerous applications, ' +
    'including finding shortest paths in unweighted graphs, testing bipartiteness, computing network ' +
    'flow, and solving puzzles like the 15-puzzle or Rubik\'s cube. Its O(V+E) time complexity makes ' +
    'it efficient for both dense and sparse graphs, though it requires O(V) space to store the queue ' +
    'and visited nodes. Unlike Depth-First Search, BFS guarantees finding the shortest path in ' +
    'unweighted graphs and tends to be more useful for finding nodes close to the starting point.',
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
  bestCase: 'When the target node is at the first level',
  worstCase: 'When the target node is at the last level or not present',
  pseudocode: [
    'function Breadth-First Search(graph, startNode):',
    '    // Initialize data structures',
    '    visited = new Set()',
    '    queue = [startNode]',
    '    result = []',
    '    ',
    '    // Main BFS loop',
    '    while queue is not empty:',
    '        currentNode = queue.shift()',
    '        ',
    '        if currentNode not in visited:',
    '            visited.add(currentNode)',
    '            result.append(currentNode)',
    '            ',
    '            // Add unvisited neighbors to queue',
    '            for neighbor in currentNode.neighbors:',
    '                if neighbor not in visited:',
    '                    queue.append(neighbor)',
    '    ',
    '    return result'
  ],
  implementation: `function breadthFirstSearch(graph, startNode) {
    const visited = new Set();
    const queue = [startNode];
    const result = [];
    
    while (queue.length > 0) {
      const currentNode = queue.shift();
      
      if (!visited.has(currentNode)) {
        visited.add(currentNode);
        result.push(currentNode);
        
        const currentNodeData = graph.nodes[currentNode];
        if (currentNodeData) {
          for (const neighborId of currentNodeData.adjacent) {
            if (!visited.has(neighborId)) {
              queue.push(neighborId);
            }
          }
        }
      }
    }
    
    return result;
  }`,
  implementationLanguage: 'typescript',
  run: function(input) {
    console.log('BFS run with input:', input);
    if (!input || !input.graph) {
      console.error('Invalid input, missing graph:', input);
      // Create a dummy generator that returns an empty array
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
    return breadthFirstSearch(input.graph, input.startNode);
  }
}; 