import type { Algorithm, AlgorithmStep, TreeNode } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

// Define colors
enum NodeColor {
  RED = 'red',
  BLACK = 'black'
}

// Interface for Red-Black Tree Node (extends TreeNode)
interface RBTreeNode extends TreeNode {
  color: NodeColor;
  parent: RBTreeNode | null;
}

// Helper function to create a step in the algorithm
function createStep(
  tree: RBTreeNode | null,
  highlightNodes: string[] = [],
  lines: number[] = [],
  description: string = ''
): AlgorithmStep {
  return {
    data: tree ? calculateNodePositions(tree) : { value: 0, id: 'empty', depth: 0, horizontalPosition: 0 },
    highlightNodes,
    highlightLines: lines,
    description,
    custom: {
      nodeColors: tree ? getNodeColors(tree) : {}
    }
  };
}

// Calculate x and y positions for all nodes in the tree
function calculateNodePositions(root: RBTreeNode): RBTreeNode {
  const spacing = 60; // Horizontal spacing between nodes
  const verticalSpacing = 80; // Vertical spacing between levels
  
  function calculatePositions(node: RBTreeNode, depth: number, leftBound: number, rightBound: number): void {
    // Calculate horizontal position
    const x = (leftBound + rightBound) / 2;
    
    // Update node positions
    node.horizontalPosition = x;
    node.depth = depth;
    node.x = x * spacing;
    node.y = depth * verticalSpacing;
    
    // Recursively calculate positions for children
    if (node.left) {
      calculatePositions(node.left as RBTreeNode, depth + 1, leftBound, x);
    }
    if (node.right) {
      calculatePositions(node.right as RBTreeNode, depth + 1, x, rightBound);
    }
  }
  
  calculatePositions(root, 0, -1, 1);
  return root;
}

// Get colors of all nodes for visualization
function getNodeColors(root: RBTreeNode): Record<string, string> {
  const colors: Record<string, string> = {};
  
  function traverse(node: RBTreeNode | null) {
    if (!node) return;
    
    colors[node.id] = node.color;
    
    if (node.left) traverse(node.left as RBTreeNode);
    if (node.right) traverse(node.right as RBTreeNode);
  }
  
  traverse(root);
  return colors;
}

// Create a new Red-Black Tree node
function createNode(
  value: number,
  color: NodeColor = NodeColor.RED,
  parent: RBTreeNode | null = null,
  depth: number = 0
): RBTreeNode {
  return {
    value,
    id: uuidv4(),
    color,
    parent,
    depth,
    horizontalPosition: 0
  };
}

// Left rotation
function* leftRotate(
  tree: RBTreeNode | null,
  x: RBTreeNode
): Generator<AlgorithmStep, RBTreeNode | null, unknown> {
  if (!x.right) {
    yield createStep(tree, [x.id], [], 'Cannot perform left rotation without a right child');
    return x;
  }
  
  yield createStep(tree, [x.id], [1, 2], `Starting left rotation on node ${x.value}`);
  
  const y = x.right as RBTreeNode;
  
  // Update parent pointers
  x.right = y.left;
  if (y.left) {
    (y.left as RBTreeNode).parent = x;
  }
  
  y.parent = x.parent;
  
  if (!x.parent) {
    // x was the root
    tree = y;
  } else if (x === x.parent.left) {
    x.parent.left = y;
  } else {
    x.parent.right = y;
  }
  
  y.left = x;
  x.parent = y;
  
  yield createStep(tree, [x.id, y.id], [3, 4, 5], `Completed left rotation. New parent: ${y.value}, left child: ${x.value}`);
  
  return tree;
}

// Right rotation
function* rightRotate(
  tree: RBTreeNode | null,
  y: RBTreeNode
): Generator<AlgorithmStep, RBTreeNode | null, unknown> {
  if (!y.left) {
    yield createStep(tree, [y.id], [], 'Cannot perform right rotation without a left child');
    return y;
  }
  
  yield createStep(tree, [y.id], [1, 2], `Starting right rotation on node ${y.value}`);
  
  const x = y.left as RBTreeNode;
  
  // Update parent pointers
  y.left = x.right;
  if (x.right) {
    (x.right as RBTreeNode).parent = y;
  }
  
  x.parent = y.parent;
  
  if (!y.parent) {
    // y was the root
    tree = x;
  } else if (y === y.parent.left) {
    y.parent.left = x;
  } else {
    y.parent.right = x;
  }
  
  x.right = y;
  y.parent = x;
  
  yield createStep(tree, [y.id, x.id], [3, 4, 5], `Completed right rotation. New parent: ${x.value}, right child: ${y.value}`);
  
  return tree;
}

// Fix Red-Black Tree properties after insertion
function* fixInsert(
  tree: RBTreeNode | null,
  node: RBTreeNode
): Generator<AlgorithmStep, RBTreeNode | null, unknown> {
  let currNode = node;
  
  // Case 1: If node is the root, color it black and return
  if (currNode.parent === null) {
    yield createStep(tree, [currNode.id], [1, 2], `Node ${currNode.value} is the root, coloring it black`);
    currNode.color = NodeColor.BLACK;
    return tree;
  }
  
  // If parent is black, we're done (tree is still valid)
  if (currNode.parent.color === NodeColor.BLACK) {
    yield createStep(tree, [currNode.id, currNode.parent.id], [5, 6], 
      `Parent of ${currNode.value} is already black, no fix needed`);
    return tree;
  }
  
  // While node is not root and node's parent is red
  while (currNode.parent && currNode.parent.color === NodeColor.RED) {
    // Get references to parent, grandparent, and uncle
    let parent = currNode.parent;
    const grandparent = parent.parent;
    
    if (!grandparent) {
      // Shouldn't happen in a valid RB tree
      break;
    }
    
    yield createStep(tree, [currNode.id, parent.id, grandparent.id], [10, 11], 
      `Node ${currNode.value} has red parent ${parent.value} and black grandparent ${grandparent.value}`);
    
    let uncle: RBTreeNode | null | undefined;
    
    // If parent is a left child of grandparent
    if (parent === grandparent.left) {
      uncle = grandparent.right as RBTreeNode | null | undefined;
      
      // Case 2: Uncle is red, recolor
      if (uncle && uncle.color === NodeColor.RED) {
        yield createStep(tree, [currNode.id, parent.id, grandparent.id, uncle.id], [15, 16, 17, 18], 
          `Case 2: Uncle ${uncle.value} is red. Recoloring parent, uncle, and grandparent`);
        
        parent.color = NodeColor.BLACK;
        uncle.color = NodeColor.BLACK;
        grandparent.color = NodeColor.RED;
        currNode = grandparent; // Move up to grandparent for next iteration
        
        yield createStep(tree, [parent.id, uncle.id, grandparent.id], [19], 
          `After recoloring: Parent and uncle are black, grandparent is red`);
      } else {
        // Case 3: Node is a right child, left rotate to transform into case 4
        if (currNode === parent.right) {
          yield createStep(tree, [currNode.id, parent.id], [23, 24], 
            `Case 3: Node ${currNode.value} is a right child of red parent. Left rotation needed.`);
          
          tree = yield* leftRotate(tree, parent);
          currNode = parent;
          parent = currNode.parent as RBTreeNode; // Update parent after rotation
          
          yield createStep(tree, [currNode.id, parent.id], [26], 
            `After left rotation: ${currNode.value} is now left child of ${parent.value}`);
        }
        
        // Case 4: Node is a left child, right rotate grandparent and recolor
        yield createStep(tree, [currNode.id, parent.id, grandparent.id], [30, 31, 32], 
          `Case 4: Recoloring and right rotating grandparent ${grandparent.value}`);
        
        parent.color = NodeColor.BLACK;
        grandparent.color = NodeColor.RED;
        tree = yield* rightRotate(tree, grandparent);
        
        yield createStep(tree, [parent.id, grandparent.id], [33], 
          `After right rotation and recoloring: ${parent.value} is black and ${grandparent.value} is red`);
      }
    } else {
      // If parent is a right child of grandparent
      uncle = grandparent.left as RBTreeNode | null | undefined;
      
      // Case 2: Uncle is red, recolor
      if (uncle && uncle.color === NodeColor.RED) {
        yield createStep(tree, [currNode.id, parent.id, grandparent.id, uncle.id], [40, 41, 42, 43], 
          `Case 2: Uncle ${uncle.value} is red. Recoloring parent, uncle, and grandparent`);
        
        parent.color = NodeColor.BLACK;
        uncle.color = NodeColor.BLACK;
        grandparent.color = NodeColor.RED;
        currNode = grandparent; // Move up to grandparent for next iteration
        
        yield createStep(tree, [parent.id, uncle.id, grandparent.id], [44], 
          `After recoloring: Parent and uncle are black, grandparent is red`);
      } else {
        // Case 3: Node is a left child, right rotate to transform into case 4
        if (currNode === parent.left) {
          yield createStep(tree, [currNode.id, parent.id], [48, 49], 
            `Case 3: Node ${currNode.value} is a left child of red parent. Right rotation needed.`);
          
          tree = yield* rightRotate(tree, parent);
          currNode = parent;
          parent = currNode.parent as RBTreeNode; // Update parent after rotation
          
          yield createStep(tree, [currNode.id, parent.id], [51], 
            `After right rotation: ${currNode.value} is now right child of ${parent.value}`);
        }
        
        // Case 4: Node is a right child, left rotate grandparent and recolor
        yield createStep(tree, [currNode.id, parent.id, grandparent.id], [55, 56, 57], 
          `Case 4: Recoloring and left rotating grandparent ${grandparent.value}`);
        
        parent.color = NodeColor.BLACK;
        grandparent.color = NodeColor.RED;
        tree = yield* leftRotate(tree, grandparent);
        
        yield createStep(tree, [parent.id, grandparent.id], [58], 
          `After left rotation and recoloring: ${parent.value} is black and ${grandparent.value} is red`);
      }
    }
    
    // Break if we've moved up to the root
    if (!currNode.parent) {
      break;
    }
  }
  
  // Ensure root is black (property 2)
  if (tree) {
    tree.color = NodeColor.BLACK;
    yield createStep(tree, [tree.id], [65, 66], `Ensuring root ${tree.value} is black`);
  }
  
  return tree;
}

// Insert a node into the Red-Black Tree
function* insertNode(
  tree: RBTreeNode | null,
  value: number
): Generator<AlgorithmStep, RBTreeNode | null, unknown> {
  // Step 1: Standard BST insertion
  if (!tree) {
    // First node - must be black (root property)
    const newNode = createNode(value, NodeColor.BLACK);
    yield createStep(newNode, [newNode.id], [1, 2], `Creating new root node with value ${value} (colored black)`);
    return newNode;
  }
  
  let curr: RBTreeNode | null = tree;
  let parent: RBTreeNode | null = null;
  
  // Find the position to insert the new node
  while (curr) {
    yield createStep(tree, [curr.id], [6, 7], `Comparing ${value} with ${curr.value}`);
    
    parent = curr;
    
    if (value < curr.value) {
      yield createStep(tree, [curr.id], [10], `${value} is less than ${curr.value}, going left`);
      curr = curr.left as RBTreeNode | null;
    } else if (value > curr.value) {
      yield createStep(tree, [curr.id], [12], `${value} is greater than ${curr.value}, going right`);
      curr = curr.right as RBTreeNode | null;
    } else {
      // Value already exists, do nothing
      yield createStep(tree, [curr.id], [15], `Value ${value} already exists in the tree, not inserting`);
      return tree;
    }
  }
  
  // Create new red node
  const newNode = createNode(value, NodeColor.RED, parent);
  yield createStep(tree, [newNode.id], [19, 20], `Creating new red node with value ${value}`);
  
  // Insert the new node as a child of parent
  if (parent) {
    if (value < parent.value) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
  }
  
  // Fix Red-Black Tree properties
  yield createStep(tree, [newNode.id], [28, 29], `Fixing Red-Black Tree properties after insertion of ${value}`);
  tree = yield* fixInsert(tree, newNode);
  
  return tree;
}

// Create a sample Red-Black tree
function createSampleRBTree(): RBTreeNode | null {
  // Start with an empty tree
  return null;
}

// Algorithm object for Red-Black Tree
export const redBlackTreeAlgorithm: Algorithm = {
  name: 'Red-Black Tree',
  category: 'tree',
  description: 
    'Red-Black Trees are self-balancing binary search trees where each node is colored either red or black according to specific rules. ' +
    'These rules ensure the tree remains approximately balanced, guaranteeing O(log n) time complexity for insertion, deletion, and search operations. ' +
    'The key properties are: 1) Every node is either red or black, 2) The root is black, 3) All leaves (NIL nodes) are black, ' +
    '4) If a node is red, both its children are black, and 5) Every path from a node to any of its descendant NIL nodes contains the same number of black nodes. ' +
    'While AVL trees maintain stricter balance, Red-Black Trees require fewer rotations during modification operations, making them more efficient in applications ' +
    'with frequent insertions and deletions, such as in implementing maps, sets, and priority queues in many programming languages.',
  defaultInput: createSampleRBTree(),
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(n)',
  pseudocode: [
    'function insert(tree, key):',
    '    // Step 1: Standard BST insertion',
    '    node = new RedNode(key)',
    '    bst_insert(tree, node)',
    '    ',
    '    // Step 2: Fix Red-Black Tree properties',
    '    while node is not root and node.parent is red:',
    '        if node.parent is left child of grandparent:',
    '            uncle = grandparent.right',
    '            ',
    '            // Case 1: Uncle is red - recolor',
    '            if uncle is red:',
    '                node.parent.color = BLACK',
    '                uncle.color = BLACK',
    '                grandparent.color = RED',
    '                node = grandparent',
    '            else:',
    '                // Case 2: Node is right child - left rotate',
    '                if node is right child:',
    '                    node = node.parent',
    '                    left_rotate(tree, node)',
    '                ',
    '                // Case 3: Node is left child - right rotate',
    '                node.parent.color = BLACK',
    '                grandparent.color = RED',
    '                right_rotate(tree, grandparent)',
    '        ',
    '        // Symmetric cases for right child',
    '        ...',
    '    ',
    '    // Ensure root is black',
    '    tree.root.color = BLACK'
  ],
  run: function(root) {
    // The run function simulates inserting a series of values into a Red-Black tree
    // We'll use values that demonstrate different balancing cases
    const values = [10, 20, 30, 15, 25, 5, 35];
    const generator = (function* () {
      let currentRoot = root || null;
      
      yield createStep(currentRoot, [], [1], 'Starting Red-Black Tree insertion demonstration');
      
      for (const value of values) {
        // Don't highlight any nodes before insertion
        yield createStep(currentRoot, [], [2], `Inserting value ${value} into the Red-Black Tree`);
        
        // insertNode function already has proper node highlighting during operations
        currentRoot = yield* insertNode(currentRoot, value);
        
        // After insertion, highlight the newly inserted node
        const highlightInserted = findNodeWithValue(currentRoot, value);
        const highlightNodes = highlightInserted ? [highlightInserted.id] : [];
        
        yield createStep(currentRoot, highlightNodes, [3], `Tree after inserting ${value}`);
      }
      
      yield createStep(currentRoot, [], [4], 'Red-Black Tree construction completed');
      return currentRoot;
    })();
    
    return generator;
  }
};

// Helper function to find a node with a specific value
function findNodeWithValue(root: RBTreeNode | null, value: number): RBTreeNode | null {
  if (!root) return null;
  
  if (root.value === value) return root;
  
  if (value < root.value) {
    return findNodeWithValue(root.left as RBTreeNode, value);
  } else {
    return findNodeWithValue(root.right as RBTreeNode, value);
  }
} 