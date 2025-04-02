import { bstInsertion as binarySearchTree } from './binary-search-tree.js';
import { preorderTraversalAlgorithm, inorderTraversalAlgorithm, postorderTraversalAlgorithm } from './tree-traversals.js';
import { avlTreeBalancingAlgorithm } from './avl-tree-balancing.js';
import { redBlackTreeAlgorithm } from './red-black-tree.js';

// Create a combined tree traversals algorithm
const treeTraversals = {
  ...preorderTraversalAlgorithm,
  name: "Tree Traversals",
  category: "Tree",
  description: "Tree traversal algorithms for visiting each node in a tree data structure exactly once." + 
  "Includes Preorder (Root→Left→Right), Inorder (Left→Root→Right), and Postorder (Left→Right→Root) traversals.",
  run: preorderTraversalAlgorithm.run // Ensure we use the preorder traversal implementation
};

// Rename algorithms to match requested names
const binarySearchTreeInsertion = {
  ...binarySearchTree,
  name: "Binary Search Tree Insertion"
};

const avlTreeBalancing = {
  ...avlTreeBalancingAlgorithm,
  name: "AVL Tree Balancing"
};

const redBlackTree = {
  ...redBlackTreeAlgorithm,
  name: "Red-Black Trees"
};

// Export the complete algorithm objects with run methods
export const treeAlgorithms = [
  // The four requested tree algorithms
  binarySearchTreeInsertion,
  treeTraversals,
  avlTreeBalancing,
  redBlackTree
];

// Export individual algorithms
export { 
  binarySearchTreeInsertion,
  treeTraversals,
  avlTreeBalancing,
  redBlackTree
}; 