import type { Algorithm, AlgorithmStep, TreeNode } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

// Helper function to create a step in the algorithm
function createStep(
  tree: TreeNode | null,
  highlightNodes: string[] = [],
  lines: number[] = [],
  description: string = ''
): AlgorithmStep {
  return {
    data: tree ? calculateNodePositions(tree) : { value: 0, id: 'empty', depth: 0, horizontalPosition: 0 },
    highlightNodes,
    highlightLines: lines,
    description,
  };
}

// Calculate x and y positions for all nodes in the tree
function calculateNodePositions(root: TreeNode): TreeNode {
  const spacing = 60; // Horizontal spacing between nodes
  const verticalSpacing = 80; // Vertical spacing between levels
  
  function calculatePositions(node: TreeNode, depth: number, leftBound: number, rightBound: number): void {
    // Calculate horizontal position
    const x = (leftBound + rightBound) / 2;
    
    // Update node positions
    node.horizontalPosition = x;
    node.depth = depth;
    node.x = x * spacing;
    node.y = depth * verticalSpacing;
    
    // Recursively calculate positions for children
    if (node.left) {
      calculatePositions(node.left, depth + 1, leftBound, x);
    }
    if (node.right) {
      calculatePositions(node.right, depth + 1, x, rightBound);
    }
  }
  
  calculatePositions(root, 0, -1, 1);
  return root;
}

// Create a node for the sample tree
function createNode(value: number, depth: number = 0): TreeNode {
  return {
    value,
    id: uuidv4(),
    depth,
    horizontalPosition: 0,
  };
}

// Create a balanced sample binary tree
function createSampleTree(): TreeNode {
  const root = createNode(1);
  root.left = createNode(2);
  root.right = createNode(3);
  root.left.left = createNode(4);
  root.left.right = createNode(5);
  root.right.left = createNode(6);
  root.right.right = createNode(7);
  
  return calculateNodePositions(root);
}

/**
 * Preorder Traversal: Root -> Left -> Right
 */
function* preorderTraversal(
  root: TreeNode | null,
  visitedNodes: string[] = []
): Generator<AlgorithmStep, string[], unknown> {
  if (!root) {
    return visitedNodes;
  }

  // Visit the root node first
  visitedNodes.push(root.value.toString());
  yield createStep(root, [root.id], [1, 2], `Visit node ${root.value}`);

  // Then traverse the left subtree
  if (root.left) {
    yield createStep(root, [root.id, root.left.id], [4, 5], `Moving to left child of ${root.value}`);
    visitedNodes = yield* preorderTraversal(root.left, visitedNodes);
  } else {
    yield createStep(root, [root.id], [7], `Node ${root.value} has no left child`);
  }

  // Finally traverse the right subtree
  if (root.right) {
    yield createStep(root, [root.id, root.right.id], [10, 11], `Moving to right child of ${root.value}`);
    visitedNodes = yield* preorderTraversal(root.right, visitedNodes);
  } else {
    yield createStep(root, [root.id], [13], `Node ${root.value} has no right child`);
  }

  return visitedNodes;
}

/**
 * Inorder Traversal: Left -> Root -> Right
 */
function* inorderTraversal(
  root: TreeNode | null,
  visitedNodes: string[] = []
): Generator<AlgorithmStep, string[], unknown> {
  if (!root) {
    return visitedNodes;
  }

  // Traverse the left subtree first
  if (root.left) {
    yield createStep(root, [root.id, root.left.id], [1, 2], `Moving to left child of ${root.value}`);
    visitedNodes = yield* inorderTraversal(root.left, visitedNodes);
  } else {
    yield createStep(root, [root.id], [4], `Node ${root.value} has no left child`);
  }

  // Then visit the root node
  visitedNodes.push(root.value.toString());
  yield createStep(root, [root.id], [7, 8], `Visit node ${root.value}`);

  // Finally traverse the right subtree
  if (root.right) {
    yield createStep(root, [root.id, root.right.id], [10, 11], `Moving to right child of ${root.value}`);
    visitedNodes = yield* inorderTraversal(root.right, visitedNodes);
  } else {
    yield createStep(root, [root.id], [13], `Node ${root.value} has no right child`);
  }

  return visitedNodes;
}

/**
 * Postorder Traversal: Left -> Right -> Root
 */
function* postorderTraversal(
  root: TreeNode | null,
  visitedNodes: string[] = []
): Generator<AlgorithmStep, string[], unknown> {
  if (!root) {
    return visitedNodes;
  }

  // Traverse the left subtree first
  if (root.left) {
    yield createStep(root, [root.id, root.left.id], [1, 2], `Moving to left child of ${root.value}`);
    visitedNodes = yield* postorderTraversal(root.left, visitedNodes);
  } else {
    yield createStep(root, [root.id], [4], `Node ${root.value} has no left child`);
  }

  // Then traverse the right subtree
  if (root.right) {
    yield createStep(root, [root.id, root.right.id], [7, 8], `Moving to right child of ${root.value}`);
    visitedNodes = yield* postorderTraversal(root.right, visitedNodes);
  } else {
    yield createStep(root, [root.id], [10], `Node ${root.value} has no right child`);
  }

  // Finally visit the root node
  visitedNodes.push(root.value.toString());
  yield createStep(root, [root.id], [13, 14], `Visit node ${root.value}`);

  return visitedNodes;
}

// Algorithm object for preorder traversal
export const preorderTraversalAlgorithm: Algorithm = {
  name: 'Preorder Traversal',
  category: 'tree',
  description: 
    'Preorder traversal is a depth-first tree traversal algorithm that follows the Root-Left-Right pattern. ' +
    'It first visits the current node, then recursively traverses the left subtree, and finally recursively traverses the right subtree. ' +
    'This approach is useful for creating a copy of the tree or for getting a prefix expression from an expression tree. ' +
    'The traversal order provides a way to visit nodes in a hierarchical manner, starting from the root and exploring deeper levels. ' +
    'With a time complexity of O(n) where n is the number of nodes, preorder traversal efficiently processes each node exactly once.',
  defaultInput: createSampleTree(),
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(h) where h is the height of the tree',
  pseudocode: [
    'function preorderTraversal(node):',
    '    if node is null:',
    '        return',
    '    ',
    '    // Visit the current node',
    '    process(node)',
    '    ',
    '    // Recursively traverse left subtree',
    '    preorderTraversal(node.left)',
    '    ',
    '    // Recursively traverse right subtree',
    '    preorderTraversal(node.right)'
  ],
  run: function(root) {
    return preorderTraversal(root);
  }
};

// Algorithm object for inorder traversal
export const inorderTraversalAlgorithm: Algorithm = {
  name: 'Inorder Traversal',
  category: 'tree',
  description: 
    'Inorder traversal is a depth-first tree traversal algorithm that follows the Left-Root-Right pattern. ' +
    'It first recursively traverses the left subtree, then visits the current node, and finally recursively traverses the right subtree. ' +
    'For binary search trees, inorder traversal visits nodes in ascending order of their values. ' +
    'This property makes it useful for sorting applications and for validating whether a binary tree is a valid binary search tree. ' +
    'With a time complexity of O(n) where n is the number of nodes, inorder traversal efficiently processes each node exactly once.',
  defaultInput: createSampleTree(),
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(h) where h is the height of the tree',
  pseudocode: [
    'function inorderTraversal(node):',
    '    if node is null:',
    '        return',
    '    ',
    '    // Recursively traverse left subtree',
    '    inorderTraversal(node.left)',
    '    ',
    '    // Visit the current node',
    '    process(node)',
    '    ',
    '    // Recursively traverse right subtree',
    '    inorderTraversal(node.right)'
  ],
  run: function(root) {
    return inorderTraversal(root);
  }
};

// Algorithm object for postorder traversal
export const postorderTraversalAlgorithm: Algorithm = {
  name: 'Postorder Traversal',
  category: 'tree',
  description: 
    'Postorder traversal is a depth-first tree traversal algorithm that follows the Left-Right-Root pattern. ' +
    'It first recursively traverses the left subtree, then recursively traverses the right subtree, and finally visits the current node. ' +
    'This approach is particularly useful for operations requiring processing child nodes before parent nodes, such as deletion operations or ' +
    'evaluating expressions in expression trees. In the case of deletion, postorder ensures that child nodes are deleted before their parents. ' +
    'With a time complexity of O(n) where n is the number of nodes, postorder traversal efficiently processes each node exactly once.',
  defaultInput: createSampleTree(),
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(h) where h is the height of the tree',
  pseudocode: [
    'function postorderTraversal(node):',
    '    if node is null:',
    '        return',
    '    ',
    '    // Recursively traverse left subtree',
    '    postorderTraversal(node.left)',
    '    ',
    '    // Recursively traverse right subtree',
    '    postorderTraversal(node.right)',
    '    ',
    '    // Visit the current node',
    '    process(node)'
  ],
  run: function(root) {
    return postorderTraversal(root);
  }
}; 