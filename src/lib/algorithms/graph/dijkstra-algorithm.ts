import { createStep } from '../utils.js';
import type { Algorithm, AlgorithmStep, Graph, GraphNode } from '../types.js';

interface DijkstraState {
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  unvisited: Set<string>;
  visited: Set<string>;
  currentNode: string | null;
  path: string[];
}

/**
 * Creates a weighted graph for Dijkstra's algorithm demonstration.
 * Including weights between nodes.
 */
function createWeightedGraph(): Graph {
  return {
    nodes: {
      'A': { id: 'A', value: 1, x: 100, y: 100, adjacent: ['B', 'C'] },
      'B': { id: 'B', value: 2, x: 200, y: 100, adjacent: ['A', 'D', 'E'] },
      'C': { id: 'C', value: 3, x: 100, y: 200, adjacent: ['A', 'F'] },
      'D': { id: 'D', value: 4, x: 300, y: 100, adjacent: ['B'] },
      'E': { id: 'E', value: 5, x: 200, y: 200, adjacent: ['B', 'F'] },
      'F': { id: 'F', value: 6, x: 100, y: 300, adjacent: ['C', 'E'] }
    },
    directed: false,
    weighted: true,
    // Edge weights for Dijkstra's algorithm
    weights: {
      'A-B': 4,
      'B-A': 4,
      'A-C': 2,
      'C-A': 2,
      'B-D': 5,
      'D-B': 5,
      'B-E': 1,
      'E-B': 1,
      'C-F': 3,
      'F-C': 3,
      'E-F': 6,
      'F-E': 6
    }
  };
}

/**
 * Gets the weight of an edge between two nodes.
 */
function getEdgeWeight(graph: Graph, fromNode: string, toNode: string): number {
  if (!graph.weighted) return 1; // Default to 1 for unweighted graphs
  
  const edgeKey = `${fromNode}-${toNode}`;
  const weights = (graph as any).weights || {};
  
  return weights[edgeKey] || Infinity;
}

/**
 * Performs Dijkstra's algorithm on a graph starting from a given node.
 * 
 * @param graph - The graph to traverse (will be modified to include weights if not present)
 * @param startNodeId - The ID of the node to start from
 * @param endNodeId - Optional ID of the destination node
 * @returns A generator that yields algorithm steps for visualization
 */
export function* dijkstraAlgorithm(
  graph: Graph, 
  startNodeId: string,
  endNodeId?: string
): Generator<AlgorithmStep, {distances: Record<string, number>, path: string[]}, void> {
  if (!graph || !graph.nodes || !graph.nodes[startNodeId]) {
    yield createStep({
      data: graph,
      description: `Invalid graph or start node ${startNodeId} not found in graph`,
      highlightedNodes: [],
      highlightedEdges: []
    });
    return { distances: {}, path: [] };
  }

  // Ensure the graph is set as weighted
  const workingGraph = JSON.parse(JSON.stringify(graph));
  workingGraph.weighted = true;
  if (!(workingGraph as any).weights) {
    (workingGraph as any).weights = {};
    
    // Create default weights if none exist
    Object.keys(workingGraph.nodes).forEach(nodeId => {
      const node = workingGraph.nodes[nodeId];
      node.adjacent.forEach((adjId: string) => {
        const edgeKey = `${nodeId}-${adjId}`;
        if (!(workingGraph as any).weights[edgeKey]) {
          (workingGraph as any).weights[edgeKey] = 1; // Default weight
        }
      });
    });
  }
  
  // Initialize state
  const state: DijkstraState = {
    distances: {},
    previous: {},
    unvisited: new Set<string>(),
    visited: new Set<string>(),
    currentNode: null,
    path: []
  };
  
  // Initialize distances
  Object.keys(workingGraph.nodes).forEach(nodeId => {
    state.distances[nodeId] = nodeId === startNodeId ? 0 : Infinity;
    state.previous[nodeId] = null;
    state.unvisited.add(nodeId);
    
    // Update the node's distance and previous properties
    workingGraph.nodes[nodeId].distance = state.distances[nodeId];
    if (state.previous[nodeId] !== null) {
      workingGraph.nodes[nodeId].previous = state.previous[nodeId];
    }
  });
  
  // Create an initial step showing the state before we begin
  const initialStep = createStep({
    data: workingGraph,
    description: `Begin Dijkstra's algorithm from node ${startNodeId}`,
    highlightedNodes: [startNodeId],
    highlightedEdges: [],
    startNode: startNodeId
  });
  initialStep.highlightLines = [1, 2, 3];
  initialStep.custom = {
    distances: {...state.distances},
    previous: {...state.previous},
    unvisited: [...state.unvisited],
    visited: [...state.visited]
  };
  yield initialStep;
  
  // Main algorithm loop
  while (state.unvisited.size > 0) {
    // Find node with smallest distance
    let minDistance = Infinity;
    let minNode: string | null = null;
    
    for (const nodeId of state.unvisited) {
      if (state.distances[nodeId] < minDistance) {
        minDistance = state.distances[nodeId];
        minNode = nodeId;
      }
    }
    
    // If min distance is infinity, remaining nodes are unreachable
    if (minDistance === Infinity || minNode === null) {
      const unreachableStep = createStep({
        data: workingGraph,
        description: 'Remaining nodes are unreachable, algorithm complete',
        highlightedNodes: [...state.visited],
        highlightedEdges: [],
        startNode: startNodeId
      });
      unreachableStep.highlightLines = [4];
      unreachableStep.isComplete = true;
      unreachableStep.custom = {
        distances: {...state.distances},
        previous: {...state.previous},
        unvisited: [...state.unvisited],
        visited: [...state.visited]
      };
      yield unreachableStep;
      break;
    }
    
    // If we've reached the end node (if specified), we can stop
    if (endNodeId && minNode === endNodeId) {
      // Build the path from start to end
      let current: string | null = endNodeId;
      while (current) {
        state.path.unshift(current);
        current = state.previous[current];
      }
      
      // Create a step to show the shortest path
      const pathEdges: string[][] = [];
      for (let i = 0; i < state.path.length - 1; i++) {
        pathEdges.push([state.path[i], state.path[i + 1]]);
      }
      
      const endReachedStep = createStep({
        data: workingGraph,
        description: `Found shortest path to ${endNodeId}: ${state.path.join(' → ')} (total distance: ${state.distances[endNodeId]})`,
        highlightedNodes: [...state.path],
        highlightedEdges: pathEdges,
        startNode: startNodeId
      });
      endReachedStep.highlightLines = [5, 6];
      endReachedStep.isComplete = true;
      endReachedStep.custom = {
        distances: {...state.distances},
        previous: {...state.previous},
        unvisited: [...state.unvisited],
        visited: [...state.visited],
        path: [...state.path]
      };
      yield endReachedStep;
      
      return { 
        distances: state.distances, 
        path: state.path 
      };
    }
    
    // Set current node and move from unvisited to visited
    state.currentNode = minNode;
    state.unvisited.delete(minNode);
    state.visited.add(minNode);
    
    // Show the current node selection
    const currentNodeStep = createStep({
      data: workingGraph,
      description: `Select node ${minNode} (distance: ${state.distances[minNode]})`,
      highlightedNodes: [minNode, ...state.visited],
      highlightedEdges: [],
      startNode: startNodeId
    });
    currentNodeStep.highlightLines = [7, 8];
    currentNodeStep.custom = {
      distances: {...state.distances},
      previous: {...state.previous},
      unvisited: [...state.unvisited],
      visited: [...state.visited]
    };
    yield currentNodeStep;
    
    // Process neighbors of current node
    const currentAdjacent = workingGraph.nodes[minNode].adjacent;
    
    for (const neighborId of currentAdjacent) {
      // Skip if already visited
      if (state.visited.has(neighborId)) continue;
      
      // Calculate new distance to neighbor
      const edgeWeight = getEdgeWeight(workingGraph, minNode, neighborId);
      const distance = state.distances[minNode] + edgeWeight;
      
      // Show edge being considered
      const considerEdgeStep = createStep({
        data: workingGraph,
        description: `Consider edge from ${minNode} to ${neighborId} (weight: ${edgeWeight})`,
        highlightedNodes: [minNode, neighborId],
        highlightedEdges: [[minNode, neighborId]],
        startNode: startNodeId
      });
      considerEdgeStep.highlightLines = [9, 10];
      considerEdgeStep.custom = {
        distances: {...state.distances},
        previous: {...state.previous},
        unvisited: [...state.unvisited],
        visited: [...state.visited],
        currentEdge: {
          from: minNode,
          to: neighborId,
          weight: edgeWeight
        }
      };
      yield considerEdgeStep;
      
      // If new path is shorter, update distance and previous node
      if (distance < state.distances[neighborId]) {
        state.distances[neighborId] = distance;
        state.previous[neighborId] = minNode;
        
        // Update the node properties in the graph for visualization
        workingGraph.nodes[neighborId].distance = distance;
        workingGraph.nodes[neighborId].previous = minNode;
        
        // Show the distance update
        const updateDistanceStep = createStep({
          data: workingGraph,
          description: `Update distance to ${neighborId}: ${state.distances[neighborId]}`,
          highlightedNodes: [minNode, neighborId],
          highlightedEdges: [[minNode, neighborId]],
          startNode: startNodeId
        });
        updateDistanceStep.highlightLines = [11, 12, 13];
        updateDistanceStep.custom = {
          distances: {...state.distances},
          previous: {...state.previous},
          unvisited: [...state.unvisited],
          visited: [...state.visited]
        };
        yield updateDistanceStep;
      } else {
        // Show that no update was needed
        const noUpdateStep = createStep({
          data: workingGraph,
          description: `No update needed for ${neighborId}, current distance (${state.distances[neighborId]}) is shorter`,
          highlightedNodes: [minNode, neighborId],
          highlightedEdges: [[minNode, neighborId]],
          startNode: startNodeId
        });
        noUpdateStep.highlightLines = [14];
        noUpdateStep.custom = {
          distances: {...state.distances},
          previous: {...state.previous},
          unvisited: [...state.unvisited],
          visited: [...state.visited]
        };
        yield noUpdateStep;
      }
    }
  }
  
  // Build paths for all nodes
  for (const nodeId in state.distances) {
    if (state.distances[nodeId] < Infinity) {
      let current: string | null = nodeId;
      const nodePath = [];
      while (current) {
        nodePath.unshift(current);
        current = state.previous[current];
      }
      
      // Update all nodes with path and distance info
      if (workingGraph.nodes[nodeId]) {
        workingGraph.nodes[nodeId].distance = state.distances[nodeId];
        if (state.previous[nodeId] !== null) {
          workingGraph.nodes[nodeId].previous = state.previous[nodeId];
        }
      }
    }
  }
  
  // Final step showing the completed algorithm
  const finalStep = createStep({
    data: workingGraph,
    description: `Dijkstra's algorithm complete. All shortest paths from ${startNodeId} calculated.`,
    highlightedNodes: [...state.visited],
    highlightedEdges: [],
    startNode: startNodeId
  });
  finalStep.highlightLines = [15];
  finalStep.isComplete = true;
  finalStep.custom = {
    distances: {...state.distances},
    previous: {...state.previous},
    unvisited: [...state.unvisited],
    visited: [...state.visited]
  };
  yield finalStep;
  
  return { 
    distances: state.distances, 
    path: state.path 
  };
}

export const dijkstraAlgorithmObj: Algorithm = {
  name: "Dijkstra's Algorithm",
  category: 'graph',
  description: 
    "Dijkstra's Algorithm is a graph search algorithm that efficiently finds the shortest path from a start node to all other nodes in a weighted graph. " +
    "It uses a greedy approach, always selecting the node with the smallest known distance from the start. " +
    "The algorithm maintains two sets of nodes: visited and unvisited. Initially, all nodes have distance infinity except the start node (distance 0). " +
    "At each step, it selects the unvisited node with the smallest distance, marks it as visited, and updates the distances to all its unvisited neighbors. " +
    "This process continues until all nodes are visited or the remaining nodes are unreachable. " +
    "Dijkstra's algorithm is widely used in network routing protocols, GPS navigation systems, and transportation networks, " +
    "though it cannot handle negative edge weights and is less efficient than specialized algorithms for some problems.",
  defaultInput: {
    graph: createWeightedGraph(),
    startNode: 'A',
    endNode: 'F'
  },
  timeComplexity: 'O(V²) or O((V+E)log V) with a priority queue',
  spaceComplexity: 'O(V)',
  bestCase: 'When the target node is close to the start node',
  worstCase: 'When all nodes must be visited',
  pseudocode: [
    "function Dijkstra(Graph, source):",
    "    // Initialize",
    "    for each vertex v in Graph:",
    "        distance[v] = INFINITY",
    "        previous[v] = UNDEFINED",
    "        add v to unvisited set Q",
    "    distance[source] = 0",
    "    ",
    "    while Q is not empty:",
    "        u = vertex in Q with min distance[u]",
    "        remove u from Q",
    "        ",
    "        if u is target:",
    "            break  // Found shortest path to target",
    "        ",
    "        for each neighbor v of u:",
    "            if v is in Q:",
    "                alt = distance[u] + length(u, v)",
    "                if alt < distance[v]:",
    "                    distance[v] = alt",
    "                    previous[v] = u",
    "    ",
    "    return distance[], previous[]"
  ],
  run: function(input) {
    if (!input || !input.graph) {
      console.error('Invalid input for Dijkstra:', input);
      return (function* () { 
        yield createStep({
          data: { nodes: {}, directed: false, weighted: false },
          description: 'Invalid input: missing graph',
          highlightedNodes: [],
          highlightedEdges: []
        });
        return { distances: {}, path: [] };
      })();
    }
    
    return dijkstraAlgorithm(input.graph, input.startNode, input.endNode);
  }
}; 