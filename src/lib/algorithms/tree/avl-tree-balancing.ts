import type { Algorithm, AlgorithmStep, TreeNode } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

// Interface for AVL Tree Node (extending TreeNode)
interface AVLTreeNode extends TreeNode {
  height: number;
  balanceFactor: number;
}

// Helper function to create a step in the algorithm
function createStep(
  tree: AVLTreeNode | null,
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
function calculateNodePositions(root: AVLTreeNode): AVLTreeNode {
  const spacing = 60; // Horizontal spacing between nodes
  const verticalSpacing = 80; // Vertical spacing between levels
  
  function calculatePositions(node: AVLTreeNode, depth: number, leftBound: number, rightBound: number): void {
    // Calculate horizontal position
    const x = (leftBound + rightBound) / 2;
    
    // Update node positions
    node.horizontalPosition = x;
    node.depth = depth;
    node.x = x * spacing;
    node.y = depth * verticalSpacing;
    
    // Recursively calculate positions for children
    if (node.left) {
      calculatePositions(node.left as AVLTreeNode, depth + 1, leftBound, x);
    }
    if (node.right) {
      calculatePositions(node.right as AVLTreeNode, depth + 1, x, rightBound);
    }
  }
  
  calculatePositions(root, 0, -1, 1);
  return root;
}

// Create a new AVL tree node
function createNode(value: number, depth: number = 0): AVLTreeNode {
  return {
    value,
    id: uuidv4(),
    depth,
    horizontalPosition: 0,
    height: 1,
    balanceFactor: 0
  };
}

// Get the height of a node
function getHeight(node: AVLTreeNode | null): number {
  if (!node) return 0;
  return node.height;
}

// Calculate the balance factor of a node (left subtree height - right subtree height)
function getBalanceFactor(node: AVLTreeNode | null): number {
  if (!node) return 0;
  const leftHeight = node.left ? getHeight(node.left as AVLTreeNode) : 0;
  const rightHeight = node.right ? getHeight(node.right as AVLTreeNode) : 0;
  return leftHeight - rightHeight;
}

// Update the height and balance factor of a node
function updateHeightAndBalance(node: AVLTreeNode): void {
  if (!node) return;
  
  const leftHeight = node.left ? getHeight(node.left as AVLTreeNode) : 0;
  const rightHeight = node.right ? getHeight(node.right as AVLTreeNode) : 0;
  
  node.height = Math.max(leftHeight, rightHeight) + 1;
  node.balanceFactor = leftHeight - rightHeight;
}

// Right rotation
function* rightRotate(
  y: AVLTreeNode
): Generator<AlgorithmStep, AVLTreeNode, unknown> {
  if (!y.left) {
    yield createStep(y, [y.id], [], 'Cannot perform right rotation without a left child');
    return y;
  }
  
  yield createStep(y, [y.id], [1, 2], `Starting right rotation on node ${y.value}`);
  
  const x = y.left as AVLTreeNode;
  const T2 = x.right;
  
  yield createStep(y, [y.id, x.id], [3, 4, 5], `Setting ${x.value} as the new root and ${y.value} as its right child`);
  
  // Perform rotation
  x.right = y;
  y.left = T2;
  
  // Update heights
  updateHeightAndBalance(y);
  updateHeightAndBalance(x);
  
  yield createStep(x, [x.id, y.id], [6, 7, 8], `Completed right rotation. New root: ${x.value}, right child: ${y.value}`);
  
  return x;
}

// Left rotation
function* leftRotate(
  x: AVLTreeNode
): Generator<AlgorithmStep, AVLTreeNode, unknown> {
  if (!x.right) {
    yield createStep(x, [x.id], [], 'Cannot perform left rotation without a right child');
    return x;
  }
  
  yield createStep(x, [x.id], [1, 2], `Starting left rotation on node ${x.value}`);
  
  const y = x.right as AVLTreeNode;
  const T2 = y.left;
  
  yield createStep(x, [x.id, y.id], [3, 4, 5], `Setting ${y.value} as the new root and ${x.value} as its left child`);
  
  // Perform rotation
  y.left = x;
  x.right = T2;
  
  // Update heights
  updateHeightAndBalance(x);
  updateHeightAndBalance(y);
  
  yield createStep(y, [y.id, x.id], [6, 7, 8], `Completed left rotation. New root: ${y.value}, left child: ${x.value}`);
  
  return y;
}

// Insert a node into the AVL tree
function* insertNode(
  root: AVLTreeNode | null,
  value: number,
  depth: number = 0
): Generator<AlgorithmStep, AVLTreeNode, unknown> {
  // Step 1: Perform standard BST insert
  if (!root) {
    const newNode = createNode(value, depth);
    yield createStep(newNode, [newNode.id], [1, 2], `Creating new node with value ${value}`);
    return newNode;
  }
  
  yield createStep(root, [root.id], [5, 6], `Comparing ${value} with ${root.value}`);
  
  if (value < root.value) {
    yield createStep(root, [root.id], [8, 9], `${value} is less than ${root.value}, going left`);
    if (!root.left) {
      root.left = createNode(value, depth + 1);
      yield createStep(root, [root.left.id], [11, 12], `Created left child with value ${value}`);
    } else {
      yield createStep(root, [root.id, root.left.id], [14], `Traversing to left child with value ${(root.left as AVLTreeNode).value}`);
      root.left = yield* insertNode(root.left as AVLTreeNode, value, depth + 1);
    }
  } else if (value > root.value) {
    yield createStep(root, [root.id], [17, 18], `${value} is greater than ${root.value}, going right`);
    if (!root.right) {
      root.right = createNode(value, depth + 1);
      yield createStep(root, [root.right.id], [20, 21], `Created right child with value ${value}`);
    } else {
      yield createStep(root, [root.id, root.right.id], [23], `Traversing to right child with value ${(root.right as AVLTreeNode).value}`);
      root.right = yield* insertNode(root.right as AVLTreeNode, value, depth + 1);
    }
  } else {
    // Duplicate values are not allowed
    yield createStep(root, [root.id], [27], `Value ${value} already exists in the tree, not inserting`);
    return root;
  }
  
  // Step 2: Update height and balance factor
  updateHeightAndBalance(root);
  yield createStep(root, [root.id], [31, 32], `Updated height: ${root.height}, balance factor: ${root.balanceFactor}`);
  
  // Step 3: If the node is unbalanced, then there are 4 cases
  if (root.balanceFactor > 1) {
    // Left subtree is higher
    
    // Left-Left Case
    if (root.left && (root.left as AVLTreeNode).balanceFactor >= 0) {
      yield createStep(root, [root.id, root.left.id], [36, 37], 
        `Left-Left case detected: balance factor of ${root.value} is ${root.balanceFactor} and balance factor of ${(root.left as AVLTreeNode).value} is ${(root.left as AVLTreeNode).balanceFactor}`);
      return yield* rightRotate(root);
    }
    
    // Left-Right Case
    if (root.left && (root.left as AVLTreeNode).balanceFactor < 0) {
      yield createStep(root, [root.id, root.left.id], [42, 43], 
        `Left-Right case detected: balance factor of ${root.value} is ${root.balanceFactor} and balance factor of ${(root.left as AVLTreeNode).value} is ${(root.left as AVLTreeNode).balanceFactor}`);
      
      yield createStep(root, [root.id, root.left.id], [45], `First, performing left rotation on ${(root.left as AVLTreeNode).value}`);
      root.left = yield* leftRotate(root.left as AVLTreeNode);
      
      yield createStep(root, [root.id, root.left.id], [47], `Then, performing right rotation on ${root.value}`);
      return yield* rightRotate(root);
    }
  }
  
  if (root.balanceFactor < -1) {
    // Right subtree is higher
    
    // Right-Right Case
    if (root.right && (root.right as AVLTreeNode).balanceFactor <= 0) {
      yield createStep(root, [root.id, root.right.id], [54, 55], 
        `Right-Right case detected: balance factor of ${root.value} is ${root.balanceFactor} and balance factor of ${(root.right as AVLTreeNode).value} is ${(root.right as AVLTreeNode).balanceFactor}`);
      return yield* leftRotate(root);
    }
    
    // Right-Left Case
    if (root.right && (root.right as AVLTreeNode).balanceFactor > 0) {
      yield createStep(root, [root.id, root.right.id], [60, 61], 
        `Right-Left case detected: balance factor of ${root.value} is ${root.balanceFactor} and balance factor of ${(root.right as AVLTreeNode).value} is ${(root.right as AVLTreeNode).balanceFactor}`);
      
      yield createStep(root, [root.id, root.right.id], [63], `First, performing right rotation on ${(root.right as AVLTreeNode).value}`);
      root.right = yield* rightRotate(root.right as AVLTreeNode);
      
      yield createStep(root, [root.id, root.right.id], [65], `Then, performing left rotation on ${root.value}`);
      return yield* leftRotate(root);
    }
  }
  
  // No rotation needed
  yield createStep(root, [root.id], [69, 70], `Node ${root.value} is balanced (balance factor: ${root.balanceFactor})`);
  return root;
}

// Create a sample AVL tree
function createSampleAVLTree(): AVLTreeNode {
  const root = createNode(10);
  return root;
}

// Algorithm object for AVL Tree Insertion and Balancing
export const avlTreeBalancingAlgorithm: Algorithm = {
  name: 'AVL Tree Balancing',
  category: 'tree',
  description: 
    'AVL trees are self-balancing binary search trees where the difference between heights of left and right subtrees ' +
    'cannot exceed one for all nodes. After each operation (insertion or deletion), heights of affected nodes are updated ' +
    'and the balance factors (height of left subtree - height of right subtree) are checked. If any node has a balance factor ' +
    'greater than 1 or less than -1, rotations are performed to restore balance. These rotations – single or double – ensure ' +
    'that the tree maintains its balanced property, guaranteeing O(log n) height even in the worst case and thus O(log n) time ' +
    'complexity for search, insertion, and deletion operations. This self-balancing characteristic makes AVL trees efficient for ' +
    'applications requiring frequent data lookups.',
  defaultInput: createSampleAVLTree(),
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(log n)',
  pseudocode: [
    'function insert(tree, key):',
    '    // Step 1: Standard BST insertion',
    '    if tree is null:',
    '        return new Node(key)',
    '    ',
    '    if key < tree.key:',
    '        tree.left = insert(tree.left, key)',
    '    else if key > tree.key:',
    '        tree.right = insert(tree.right, key)',
    '    else:',
    '        return tree  // Duplicate keys not allowed',
    '    ',
    '    // Step 2: Update height',
    '    tree.height = 1 + max(height(tree.left), height(tree.right))',
    '    ',
    '    // Step 3: Get the balance factor',
    '    balanceFactor = height(tree.left) - height(tree.right)',
    '    ',
    '    // Step 4: If unbalanced, there are 4 cases',
    '    ',
    '    // Left Left Case',
    '    if balanceFactor > 1 and key < tree.left.key:',
    '        return rightRotate(tree)',
    '    ',
    '    // Right Right Case',
    '    if balanceFactor < -1 and key > tree.right.key:',
    '        return leftRotate(tree)',
    '    ',
    '    // Left Right Case',
    '    if balanceFactor > 1 and key > tree.left.key:',
    '        tree.left = leftRotate(tree.left)',
    '        return rightRotate(tree)',
    '    ',
    '    // Right Left Case',
    '    if balanceFactor < -1 and key < tree.right.key:',
    '        tree.right = rightRotate(tree.right)',
    '        return leftRotate(tree)',
    '    ',
    '    return tree  // Balanced case'
  ],
  run: function(root) {
    // The run function simulates inserting a series of values into an AVL tree
    // We'll use a fixed set of values that demonstrate rotations
    const values = [30, 20, 40, 10, 25, 35, 50];
    const generator = (function* () {
      let currentRoot = root || null;
      
      yield createStep(currentRoot, [], [1], 'Starting AVL tree insertion and balancing demonstration');
      
      for (const value of values) {
        // Highlight the current root before insertion
        yield createStep(currentRoot, currentRoot ? [currentRoot.id] : [], [2], `Inserting value ${value} into the AVL tree`);
        
        // insertNode function already has proper highlighting
        currentRoot = yield* insertNode(currentRoot, value);
        
        // After insertion, highlight the newly inserted node or the node that was balanced
        const highlightInserted = findNodeWithValue(currentRoot, value);
        yield createStep(
          currentRoot, 
          highlightInserted ? [highlightInserted.id] : [], 
          [3], 
          `Tree after inserting ${value}`
        );
      }
      
      yield createStep(currentRoot, [], [4], 'AVL tree construction and balancing completed');
      return currentRoot;
    })();
    
    return generator;
  }
};

// Helper function to find a node with a specific value
function findNodeWithValue(root: AVLTreeNode | null, value: number): AVLTreeNode | null {
  if (!root) return null;
  
  if (root.value === value) return root;
  
  if (value < root.value) {
    return findNodeWithValue(root.left as AVLTreeNode, value);
  } else {
    return findNodeWithValue(root.right as AVLTreeNode, value);
  }
} 