import { breadthFirstSearch, bfsAlgorithm } from './breadth-first-search.js';
import { depthFirstSearch, dfsAlgorithm } from './depth-first-search.js';
import { dijkstraAlgorithm as dijkstraAlgo, dijkstraAlgorithmObj } from './dijkstra-algorithm.js';
import { aStarPathfinding, aStarAlgorithm } from './a-star-pathfinding.js';

export { 
  breadthFirstSearch, 
  bfsAlgorithm,
  depthFirstSearch,
  dfsAlgorithm,
  dijkstraAlgo,
  dijkstraAlgorithmObj,
  aStarPathfinding,
  aStarAlgorithm
};

// Export the complete algorithm objects with run methods
export const graphAlgorithms = [
  bfsAlgorithm,
  dfsAlgorithm,
  dijkstraAlgorithmObj,
  aStarAlgorithm
]; 