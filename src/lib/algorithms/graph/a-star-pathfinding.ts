import { createStep } from '../utils.js';
import type { Algorithm, AlgorithmStep, Graph } from '../types.js';

interface AStarState {
  openSet: Set<string>;
  closedSet: Set<string>;
  gScore: Record<string, number>; // Cost from start to current node
  fScore: Record<string, number>; // Estimated total cost from start to goal through current node
  cameFrom: Record<string, string | null>;
  currentNode: string | null;
  path: string[];
}

/**
 * Creates a graph with physical coordinates for A* heuristic calculation
 */
function createPositionedGraph(): Graph {
  return {
    nodes: {
      'A': { id: 'A', value: 1, x: 50, y: 50, adjacent: ['B', 'D'] },
      'B': { id: 'B', value: 2, x: 150, y: 50, adjacent: ['A', 'C', 'E'] },
      'C': { id: 'C', value: 3, x: 250, y: 50, adjacent: ['B', 'F'] },
      'D': { id: 'D', value: 4, x: 50, y: 150, adjacent: ['A', 'E', 'G'] },
      'E': { id: 'E', value: 5, x: 150, y: 150, adjacent: ['B', 'D', 'F', 'H'] },
      'F': { id: 'F', value: 6, x: 250, y: 150, adjacent: ['C', 'E', 'I'] },
      'G': { id: 'G', value: 7, x: 50, y: 250, adjacent: ['D', 'H'] },
      'H': { id: 'H', value: 8, x: 150, y: 250, adjacent: ['E', 'G', 'I'] },
      'I': { id: 'I', value: 9, x: 250, y: 250, adjacent: ['F', 'H'] }
    },
    directed: false,
    weighted: true
  };
}

/**
 * Calculates the Euclidean distance between two nodes
 */
function heuristic(graph: Graph, nodeId1: string, nodeId2: string): number {
  const node1 = graph.nodes[nodeId1];
  const node2 = graph.nodes[nodeId2];
  
  if (!node1 || !node2 || node1.x === undefined || node1.y === undefined || 
      node2.x === undefined || node2.y === undefined) {
    return 0;
  }
  
  // Euclidean distance
  return Math.sqrt(Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node1.y, 2));
}

/**
 * Gets the edge weight between two adjacent nodes
 */
function getEdgeWeight(graph: Graph, fromNode: string, toNode: string): number {
  if (!graph.weighted) return 1; // Default to 1 for unweighted graphs
  
  // For this implementation, we'll calculate the distance based on coordinates
  return heuristic(graph, fromNode, toNode);
}

/**
 * Gets the node with the lowest fScore from the open set
 */
function getLowestFScoreNode(openSet: Set<string>, fScore: Record<string, number>): string | null {
  if (openSet.size === 0) return null;
  
  let lowestScore = Infinity;
  let lowestNode = null;
  
  for (const nodeId of openSet) {
    const score = fScore[nodeId] || Infinity;
    if (score < lowestScore) {
      lowestScore = score;
      lowestNode = nodeId;
    }
  }
  
  return lowestNode;
}

/**
 * Reconstructs the path from start to goal using the cameFrom map
 */
function reconstructPath(cameFrom: Record<string, string | null>, current: string): string[] {
  const path = [current];
  while (cameFrom[current]) {
    current = cameFrom[current]!;
    path.unshift(current);
  }
  return path;
}

/**
 * Performs A* pathfinding algorithm on a graph from startNode to endNode
 * 
 * @param graph - The graph to search through
 * @param startNodeId - The ID of the node to start from
 * @param endNodeId - The ID of the goal node
 * @returns A generator that yields algorithm steps for visualization
 */
export function* aStarPathfinding(
  graph: Graph,
  startNodeId: string,
  endNodeId: string
): Generator<AlgorithmStep, { path: string[], fScore: Record<string, number> }, void> {
  if (!graph || !graph.nodes || !graph.nodes[startNodeId] || !graph.nodes[endNodeId]) {
    yield createStep({
      data: graph,
      description: 'Invalid graph or start/end nodes not found in graph',
      highlightedNodes: [],
      highlightedEdges: []
    });
    return { path: [], fScore: {} };
  }

  // Create a working copy of the graph
  const workingGraph = JSON.parse(JSON.stringify(graph));
  
  // Initialize state
  const state: AStarState = {
    openSet: new Set<string>([startNodeId]),
    closedSet: new Set<string>(),
    gScore: { [startNodeId]: 0 }, // Cost from start to node
    fScore: { [startNodeId]: heuristic(workingGraph, startNodeId, endNodeId) }, // Estimated total cost
    cameFrom: {},
    currentNode: null,
    path: []
  };
  
  // Create an initial step
  const initialStep = createStep({
    data: workingGraph,
    description: `Begin A* pathfinding from ${startNodeId} to ${endNodeId}`,
    highlightedNodes: [startNodeId],
    highlightedEdges: [],
    startNode: startNodeId
  });
  initialStep.highlightLines = [1, 2];
  initialStep.custom = {
    openSet: [...state.openSet],
    closedSet: [...state.closedSet],
    gScore: {...state.gScore},
    fScore: {...state.fScore}
  };
  yield initialStep;
  
  // Main algorithm loop
  while (state.openSet.size > 0) {
    // Get node with lowest fScore
    state.currentNode = getLowestFScoreNode(state.openSet, state.fScore);
    
    if (!state.currentNode) {
      const failStep = createStep({
        data: workingGraph,
        description: 'No path exists between start and goal nodes',
        highlightedNodes: [...state.closedSet],
        highlightedEdges: [],
        startNode: startNodeId
      });
      failStep.highlightLines = [16];
      failStep.isComplete = true;
      failStep.custom = {
        openSet: [...state.openSet],
        closedSet: [...state.closedSet],
        gScore: {...state.gScore},
        fScore: {...state.fScore}
      };
      yield failStep;
      return { path: [], fScore: state.fScore };
    }
    
    // Current node selection step
    const selectNodeStep = createStep({
      data: workingGraph,
      description: `Select node ${state.currentNode} (f = ${state.fScore[state.currentNode]?.toFixed(2)})`,
      highlightedNodes: [state.currentNode, ...state.closedSet],
      highlightedEdges: [],
      startNode: startNodeId
    });
    selectNodeStep.highlightLines = [3];
    selectNodeStep.custom = {
      openSet: [...state.openSet],
      closedSet: [...state.closedSet],
      gScore: {...state.gScore},
      fScore: {...state.fScore},
      currentNode: state.currentNode
    };
    yield selectNodeStep;
    
    // If we've reached the goal, reconstruct the path
    if (state.currentNode === endNodeId) {
      state.path = reconstructPath(state.cameFrom, endNodeId);
      
      // Create path edges for visualization
      const pathEdges: string[][] = [];
      for (let i = 0; i < state.path.length - 1; i++) {
        pathEdges.push([state.path[i], state.path[i + 1]]);
      }
      
      // Goal reached step
      const goalReachedStep = createStep({
        data: workingGraph,
        description: `Goal reached! Path: ${state.path.join(' → ')}`,
        highlightedNodes: [...state.path],
        highlightedEdges: pathEdges,
        startNode: startNodeId
      });
      goalReachedStep.highlightLines = [4, 5];
      goalReachedStep.isComplete = true;
      goalReachedStep.custom = {
        openSet: [...state.openSet],
        closedSet: [...state.closedSet],
        gScore: {...state.gScore},
        fScore: {...state.fScore},
        path: [...state.path]
      };
      yield goalReachedStep;
      
      return { path: state.path, fScore: state.fScore };
    }
    
    // Move current from open to closed set
    state.openSet.delete(state.currentNode);
    state.closedSet.add(state.currentNode);
    
    // Update node status step
    const updateSetStep = createStep({
      data: workingGraph,
      description: `Move ${state.currentNode} from open set to closed set`,
      highlightedNodes: [state.currentNode, ...state.closedSet],
      highlightedEdges: [],
      startNode: startNodeId
    });
    updateSetStep.highlightLines = [6, 7];
    updateSetStep.custom = {
      openSet: [...state.openSet],
      closedSet: [...state.closedSet],
      gScore: {...state.gScore},
      fScore: {...state.fScore}
    };
    yield updateSetStep;
    
    // Process neighbors
    const neighbors = workingGraph.nodes[state.currentNode].adjacent;
    
    for (const neighborId of neighbors) {
      // Skip if already in closed set
      if (state.closedSet.has(neighborId)) continue;
      
      // Calculate tentative gScore
      const edgeWeight = getEdgeWeight(workingGraph, state.currentNode, neighborId);
      const tentativeGScore = (state.gScore[state.currentNode] || 0) + edgeWeight;
      
      // Consider neighbor step
      const considerNeighborStep = createStep({
        data: workingGraph,
        description: `Consider neighbor ${neighborId} (edge weight: ${edgeWeight.toFixed(2)})`,
        highlightedNodes: [state.currentNode, neighborId],
        highlightedEdges: [[state.currentNode, neighborId]],
        startNode: startNodeId
      });
      considerNeighborStep.highlightLines = [8, 9];
      considerNeighborStep.custom = {
        openSet: [...state.openSet],
        closedSet: [...state.closedSet],
        gScore: {...state.gScore},
        fScore: {...state.fScore},
        tentativeGScore
      };
      yield considerNeighborStep;
      
      // Check if this path is better
      const isNewNode = !state.openSet.has(neighborId);
      if (isNewNode || tentativeGScore < (state.gScore[neighborId] || Infinity)) {
        // Update path and scores
        state.cameFrom[neighborId] = state.currentNode;
        state.gScore[neighborId] = tentativeGScore;
        state.fScore[neighborId] = tentativeGScore + heuristic(workingGraph, neighborId, endNodeId);
        
        // If it's a new node, add to open set
        if (isNewNode) {
          state.openSet.add(neighborId);
          
          // New node step
          const newNodeStep = createStep({
            data: workingGraph,
            description: `Add ${neighborId} to open set (f = ${state.fScore[neighborId]?.toFixed(2)})`,
            highlightedNodes: [state.currentNode, neighborId, ...state.openSet],
            highlightedEdges: [[state.currentNode, neighborId]],
            startNode: startNodeId
          });
          newNodeStep.highlightLines = [10, 11, 12];
          newNodeStep.custom = {
            openSet: [...state.openSet],
            closedSet: [...state.closedSet],
            gScore: {...state.gScore},
            fScore: {...state.fScore}
          };
          yield newNodeStep;
        } else {
          // Update existing node step
          const updateNodeStep = createStep({
            data: workingGraph,
            description: `Update ${neighborId}: found better path (f = ${state.fScore[neighborId]?.toFixed(2)})`,
            highlightedNodes: [state.currentNode, neighborId],
            highlightedEdges: [[state.currentNode, neighborId]],
            startNode: startNodeId
          });
          updateNodeStep.highlightLines = [13, 14, 15];
          updateNodeStep.custom = {
            openSet: [...state.openSet],
            closedSet: [...state.closedSet],
            gScore: {...state.gScore},
            fScore: {...state.fScore}
          };
          yield updateNodeStep;
        }
      } else {
        // No improvement step
        const noImprovementStep = createStep({
          data: workingGraph,
          description: `No improvement for ${neighborId}, current path is better`,
          highlightedNodes: [state.currentNode, neighborId],
          highlightedEdges: [[state.currentNode, neighborId]],
          startNode: startNodeId
        });
        noImprovementStep.highlightLines = [17];
        noImprovementStep.custom = {
          openSet: [...state.openSet],
          closedSet: [...state.closedSet],
          gScore: {...state.gScore},
          fScore: {...state.fScore}
        };
        yield noImprovementStep;
      }
    }
  }
  
  // No path found
  const noPathStep = createStep({
    data: workingGraph,
    description: `No path found from ${startNodeId} to ${endNodeId}`,
    highlightedNodes: [...state.closedSet],
    highlightedEdges: [],
    startNode: startNodeId
  });
  noPathStep.highlightLines = [18];
  noPathStep.isComplete = true;
  noPathStep.custom = {
    openSet: [],
    closedSet: [...state.closedSet],
    gScore: {...state.gScore},
    fScore: {...state.fScore}
  };
  yield noPathStep;
  
  return { path: [], fScore: state.fScore };
}

export const aStarAlgorithm: Algorithm = {
  name: "A* Pathfinding",
  category: 'graph',
  description: 
    "A* (pronounced 'A-star') is an informed search algorithm that efficiently finds the shortest path between nodes in a graph. " +
    "It combines the advantages of Dijkstra's algorithm (which guarantees the shortest path) and greedy best-first search (which uses heuristics to speed up the search). " +
    "A* maintains two sets: an open set of nodes to be evaluated and a closed set of nodes already evaluated. " +
    "For each node, it calculates f(n) = g(n) + h(n), where g(n) is the cost from start to the node, and h(n) is a heuristic estimating the cost from the node to the goal. " +
    "At each step, it selects the node with the lowest f-score from the open set. " +
    "The heuristic must be admissible (never overestimating the actual cost) for A* to find the optimal path. " +
    "A* is widely used in pathfinding for games, GPS navigation, robotics, and any problem where finding the shortest path is important.",
  defaultInput: {
    graph: createPositionedGraph(),
    startNode: 'A',
    endNode: 'I'
  },
  timeComplexity: 'O(|E|) = O(b^d) where b is the branching factor and d is the path depth',
  spaceComplexity: 'O(|V|) = O(b^d) in the worst case',
  bestCase: 'When the heuristic guides directly to the goal',
  worstCase: 'When the heuristic provides no useful information',
  pseudocode: [
    "function A_Star(start, goal, h):",
    "    // Open set - nodes to be evaluated",
    "    // Closed set - nodes already evaluated",
    "    openSet = {start}",
    "    closedSet = {}",
    "    ",
    "    // For node n, gScore[n] is the cost from start to n",
    "    gScore = {start: 0}",
    "    ",
    "    // For node n, fScore[n] = gScore[n] + h(n)",
    "    // h(n) is the heuristic function: estimated cost from n to goal",
    "    fScore = {start: h(start)}",
    "    ",
    "    // For node n, cameFrom[n] is the node preceding n on the path",
    "    cameFrom = {}",
    "    ",
    "    while openSet is not empty:",
    "        current = node in openSet with lowest fScore",
    "        ",
    "        if current = goal:",
    "            return reconstruct_path(cameFrom, current)",
    "        ",
    "        remove current from openSet",
    "        add current to closedSet",
    "        ",
    "        for each neighbor of current:",
    "            if neighbor in closedSet:",
    "                continue",
    "                ",
    "            // d(current, neighbor) is the weight/distance between current and neighbor",
    "            tentative_gScore = gScore[current] + d(current, neighbor)",
    "            ",
    "            if neighbor not in openSet:",
    "                add neighbor to openSet",
    "            else if tentative_gScore >= gScore[neighbor]:",
    "                continue  // This is not a better path",
    "                ",
    "            // This path is the best until now. Record it",
    "            cameFrom[neighbor] = current",
    "            gScore[neighbor] = tentative_gScore",
    "            fScore[neighbor] = gScore[neighbor] + h(neighbor)",
    "    ",
    "    // No path found",
    "    return failure"
  ],
  run: function(input) {
    if (!input || !input.graph || !input.startNode || !input.endNode) {
      console.error('Invalid input for A*:', input);
      return (function* () { 
        yield createStep({
          data: { nodes: {}, directed: false, weighted: false },
          description: 'Invalid input: missing graph, start node, or end node',
          highlightedNodes: [],
          highlightedEdges: []
        });
        return { path: [], fScore: {} };
      })();
    }
    
    return aStarPathfinding(input.graph, input.startNode, input.endNode);
  }
}; 