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

// Generate a unique ID for each node
function generateNodeId(): string {
  return uuidv4();
}

// Create a new tree node
function createNode(value: number, depth: number = 0): TreeNode {
  return {
    value,
    id: generateNodeId(),
    depth,
    horizontalPosition: 0,
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

// Insert a value into the tree
function* insertIntoBST(
  root: TreeNode | null,
  value: number,
  depth: number = 0
): Generator<AlgorithmStep, TreeNode, unknown> {
  // If the tree is empty, create a new node
  if (!root) {
    const newNode = createNode(value, depth);
    yield createStep(newNode, [newNode.id], [1, 2], `Creating new node with value ${value}`);
    return newNode;
  }

  // Compare with the current node's value
  yield createStep(root, [root.id], [6, 7], `Comparing ${value} with ${root.value}`);

  // If the value is less than the current node, go left
  if (value < root.value) {
    yield createStep(root, [root.id], [9, 10], `${value} is less than ${root.value}, going left`);
    
    // Recursively insert into the left subtree
    if (!root.left) {
      root.left = createNode(value, depth + 1);
      yield createStep(root, [root.left.id], [12, 13], `Created new left child with value ${value}`);
    } else {
      yield createStep(root, [root.id, root.left.id], [15], `Traversing to left child with value ${root.left.value}`);
      root.left = yield* insertIntoBST(root.left, value, depth + 1);
    }
  } 
  // If the value is greater than the current node, go right
  else if (value > root.value) {
    yield createStep(root, [root.id], [20, 21], `${value} is greater than ${root.value}, going right`);
    
    // Recursively insert into the right subtree
    if (!root.right) {
      root.right = createNode(value, depth + 1);
      yield createStep(root, [root.right.id], [23, 24], `Created new right child with value ${value}`);
    } else {
      yield createStep(root, [root.id, root.right.id], [26], `Traversing to right child with value ${root.right.value}`);
      root.right = yield* insertIntoBST(root.right, value, depth + 1);
    }
  } 
  // If the value already exists, do nothing
  else {
    yield createStep(root, [root.id], [31], `Value ${value} already exists in the tree, not inserting`);
  }

  return root;
}

// Search for a value in the tree
function* searchInBST(
  root: TreeNode | null,
  value: number
): Generator<AlgorithmStep, TreeNode | null, unknown> {
  // If the tree is empty or we've reached a leaf node
  if (!root) {
    yield createStep(null, [], [1, 2], `Value ${value} not found in the tree`);
    return null;
  }

  // Check the current node
  yield createStep(root, [root.id], [6, 7], `Checking node with value ${root.value}`);

  // If we found the value
  if (value === root.value) {
    yield createStep(root, [root.id], [10, 11], `Found ${value} at current node!`);
    return root;
  }
  // If the value is less than the current node, search left
  else if (value < root.value && root.left) {
    yield createStep(root, [root.id, root.left.id], [14, 15], `${value} is less than ${root.value}, searching left subtree`);
    return yield* searchInBST(root.left, value);
  }
  // If the value is greater than the current node, search right
  else if (value > root.value && root.right) {
    yield createStep(root, [root.id, root.right.id], [19, 20], `${value} is greater than ${root.value}, searching right subtree`);
    return yield* searchInBST(root.right, value);
  }
  // Value not found
  else {
    yield createStep(root, [root.id], [23], `Value ${value} not found`);
    return null;
  }
}

// Perform inorder traversal of the tree
function* inorderTraversal(
  root: TreeNode | null
): Generator<AlgorithmStep, void, unknown> {
  if (!root) {
    return;
  }

  // Traverse the left subtree
  yield createStep(root, [root.id], [1, 2, 3], `Starting inorder traversal at node ${root.value}`);
  if (root.left) {
    yield createStep(root, [root.id, root.left.id], [5], `Moving to left child of ${root.value}`);
    yield* inorderTraversal(root.left);
  } else {
    yield createStep(root, [root.id], [7], `Node ${root.value} has no left child`);
  }

  // Visit the current node
  yield createStep(root, [root.id], [10, 11], `Visiting node ${root.value}`);

  // Traverse the right subtree
  if (root.right) {
    yield createStep(root, [root.id, root.right.id], [14], `Moving to right child of ${root.value}`);
    yield* inorderTraversal(root.right);
  } else {
    yield createStep(root, [root.id], [16], `Node ${root.value} has no right child`);
  }
}

// Create a sample BST with some nodes
function createSampleBST(): TreeNode {
  const root = createNode(50);
  root.left = createNode(30);
  root.right = createNode(70);
  root.left.left = createNode(20);
  root.left.right = createNode(40);
  root.right.left = createNode(60);
  root.right.right = createNode(80);
  
  return calculateNodePositions(root);
}

// BST Insertion Algorithm
export const bstInsertion: Algorithm = {
  name: 'BST Insertion',
  category: 'tree',
  description: 
    'BST Insertion adds a new node to a Binary Search Tree while maintaining the essential BST ' +
    'property: all values in any node\'s left subtree are less than the node\'s value, and all values ' +
    'in the right subtree are greater. The algorithm traverses the tree starting from the root, making ' +
    'comparisons at each node to determine whether to go left or right. When it reaches a null pointer, ' +
    'it creates a new node in that position. This process leverages the BST structure to achieve ' +
    'O(log n) insertion time in balanced trees. However, in worst cases (like inserting already-sorted ' +
    'data), the tree can degenerate into a linked list, degrading performance to O(n). BST insertion ' +
    'is fundamental to building search trees and supports operations like finding minimum/maximum values, ' +
    'successor/predecessor relationships, and maintaining sorted data in a dynamic structure that allows ' +
    'for efficient insertions and deletions.',
  timeComplexity: 'O(log n) average, O(n) worst case',
  spaceComplexity: 'O(h) where h is the height of the tree',
  pseudocode: [
    'function insert(root, value):',
    '  if root is null:',
    '    return new Node(value)',
    '',
    '  // Compare with current node',
    '  if value < root.value:',
    '    // Insert into left subtree',
    '    if root.left is null:',
    '      root.left = new Node(value)',
    '    else:',
    '      root.left = insert(root.left, value)',
    '  ',
    '  else if value > root.value:',
    '    // Insert into right subtree',
    '    if root.right is null:',
    '      root.right = new Node(value)',
    '    else:',
    '      root.right = insert(root.right, value)',
    '',
    '  // Value already exists, do nothing',
    '  else:',
    '    // Value already exists in the tree',
    '',
    '  return root'
  ],
  implementation: `function insert(root, value) {
  // If tree is empty, create a new node as root
  if (!root) {
    return {
      value: value,
      left: null,
      right: null
    };
  }

  // Compare with current node's value
  if (value < root.value) {
    // Insert into left subtree
    root.left = insert(root.left, value);
  } 
  else if (value > root.value) {
    // Insert into right subtree
    root.right = insert(root.right, value);
  }
  // Value already exists, do nothing (BST typically doesn't allow duplicates)
  
  return root;
}`,
  implementationLanguage: 'javascript',
  run: (input: { tree: TreeNode | null; value: number }) => {
    const { tree, value } = input;
    return insertIntoBST(tree, value);
  },
  defaultInput: { tree: createSampleBST(), value: 45 }
};

// BST Search Algorithm
export const bstSearch: Algorithm = {
  name: 'BST Search',
  category: 'tree',
  description: 
    'BST Search is an elegant algorithm that finds a specific value in a Binary Search Tree by ' +
    'exploiting the BST property (left subtree values < node value < right subtree values). Starting ' +
    'at the root, the algorithm compares the target with the current node\'s value and follows the ' +
    'appropriate branch: left if target < node value, right if target > node value, or returns the ' +
    'node if the values match. This hierarchical decision-making process eliminates approximately ' +
    'half of the remaining nodes with each comparison, resulting in O(log n) average time complexity ' +
    'for balanced trees. Unlike array-based binary search, BST search requires no preprocessing and ' +
    'can efficiently handle dynamic data with insertions and deletions. However, in unbalanced trees ' +
    '(worst case), search performance can degrade to O(n) if the tree resembles a linked list. BST ' +
    'search forms the foundation for more complex operations like range queries, finding successors/' +
    'predecessors, and is essential in applications requiring ordered data with frequent modifications.',
  timeComplexity: 'O(log n) average, O(n) worst case',
  spaceComplexity: 'O(h) where h is the height of the tree',
  pseudocode: [
    'function search(root, value):',
    '  if root is null or root.value == value:',
    '    return root',
    '',
    '  if value < root.value:',
    '    return search(root.left, value)',
    '',
    '  return search(root.right, value)'
  ],
  implementation: `function search(root, value) {
  // Base case: root is null or value is found
  if (!root || root.value === value) {
    return root;
  }
  
  // If value is less than root, search left subtree
  if (value < root.value) {
    return search(root.left, value);
  }
  
  // If value is greater than root, search right subtree
  return search(root.right, value);
}`,
  implementationLanguage: 'javascript',
  run: (input: { tree: TreeNode | null; value: number }) => {
    const { tree, value } = input;
    return searchInBST(tree, value);
  },
  defaultInput: { tree: createSampleBST(), value: 60 }
};

// BST Inorder Traversal Algorithm
export const bstInorderTraversal: Algorithm = {
  name: 'BST Inorder Traversal',
  category: 'tree',
  description: 
    'Inorder Traversal visits all nodes in a Binary Search Tree in ascending order of their values, ' +
    'a unique property that makes this traversal particularly valuable for BSTs. The algorithm ' +
    'recursively processes nodes by exploring the left subtree first, then visiting the current node, ' +
    'and finally exploring the right subtree. This left-root-right approach naturally outputs the ' +
    'tree\'s elements in sorted order without requiring any explicit sorting step—a powerful ' +
    'demonstration of how data structure choice can simplify operations. Inorder traversal has ' +
    'applications in producing sorted output, checking if a tree satisfies the BST property, and ' +
    'implementing operations like finding the k-th smallest element. The algorithm uses O(h) space ' +
    'for the recursive call stack, where h is the tree height, and visits each node exactly once for ' +
    'O(n) time complexity. Understanding inorder traversal is crucial for grasping more complex tree ' +
    'algorithms and for efficiently processing ordered data in hierarchical structures.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(h) where h is the height of the tree',
  pseudocode: [
    'function inorderTraversal(root):',
    '  if root is null:',
    '    return',
    '',
    '  // Traverse the left subtree',
    '  inorderTraversal(root.left)',
    '',
    '  // Visit the current node',
    '  visit(root)',
    '',
    '  // Traverse the right subtree',
    '  inorderTraversal(root.right)'
  ],
  implementation: `function inorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    // Base case: if node is null, return
    if (!node) return;
    
    // First, visit left subtree
    traverse(node.left);
    
    // Then, visit current node
    result.push(node.value);
    
    // Finally, visit right subtree
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}`,
  implementationLanguage: 'javascript',
  run: (tree: TreeNode | null) => {
    return inorderTraversal(tree);
  },
  defaultInput: createSampleBST()
}; 