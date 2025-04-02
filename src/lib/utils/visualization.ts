import gsap from 'gsap';
import type { Graph, TreeNode, GraphNode } from '../algorithms/types.js';

// Array visualization utilities
export function calculateArrayItemPosition(
  index: number,
  arrayLength: number,
  containerWidth: number,
  itemWidth: number
) {
  // Add padding on each side to ensure bars don't overflow
  const sidePadding = 40;
  const availableWidth = containerWidth - (sidePadding * 2);
  
  // If array is too large, dynamically reduce item width
  let adjustedItemWidth = itemWidth;
  if (arrayLength * itemWidth > availableWidth * 0.8) {
    adjustedItemWidth = Math.max(10, Math.floor((availableWidth * 0.8) / arrayLength));
  }
  
  const totalItemsWidth = adjustedItemWidth * arrayLength;
  
  // Calculate spacing between items (minimum space 2px)
  const spacing = Math.max(
    Math.min((availableWidth - totalItemsWidth) / (arrayLength + 1), 15),
    2
  );
  
  // Calculate total width with spacing
  const totalWidthWithSpacing = totalItemsWidth + spacing * (arrayLength - 1);
  
  // Center the array in the available space
  const startOffset = sidePadding + (availableWidth - totalWidthWithSpacing) / 2;
  
  // Return position with padding and spacing
  return startOffset + index * (adjustedItemWidth + spacing);
}

// Tree visualization utilities
export function layoutTree(root: TreeNode, width: number, height: number) {
  if (!root) return;

  // First pass: Determine tree depth and horizontal position
  const setDepthAndPosition = (
    node: TreeNode,
    depth: number = 0,
    position: number = 0
  ) => {
    if (!node) return;

    node.depth = depth;
    node.horizontalPosition = position;

    // Recursively process left and right children
    if (node.left) {
      setDepthAndPosition(node.left, depth + 1, position * 2);
    }
    if (node.right) {
      setDepthAndPosition(node.right, depth + 1, position * 2 + 1);
    }
  };

  // Second pass: Adjust positions based on tree width
  const normalizePositions = (node: TreeNode, maxDepth: number) => {
    if (!node) return;

    // Number of possible positions at this depth
    const positionsAtDepth = Math.pow(2, node.depth || 0);
    
    // Calculate x position as a percentage of width
    const horizontalSpacing = 1 / (positionsAtDepth + 1);
    const x = ((node.horizontalPosition || 0) + 1) * horizontalSpacing * width;
    
    // Calculate y position
    const verticalSpacing = height / (maxDepth + 1);
    const y = ((node.depth || 0) + 0.5) * verticalSpacing;
    
    // Update node positions
    node.x = x;
    node.y = y;
    
    // Process children
    if (node.left) normalizePositions(node.left, maxDepth);
    if (node.right) normalizePositions(node.right, maxDepth);
  };

  // Find the maximum depth in the tree
  const findMaxDepth = (node: TreeNode | null): number => {
    if (!node) return 0;
    return Math.max(
      findMaxDepth(node.left || null),
      findMaxDepth(node.right || null)
    ) + 1;
  };

  // Execute layout algorithm
  setDepthAndPosition(root);
  const maxDepth = findMaxDepth(root) - 1;
  normalizePositions(root, maxDepth);

  return root;
}

// Graph visualization utilities
export function layoutGraph(graph: Graph, width: number, height: number) {
  const nodeCount = Object.keys(graph.nodes).length;
  
  // For small graphs, arrange in a circle
  if (nodeCount <= 10) {
    const radius = Math.min(width, height) * 0.4;
    const centerX = width / 2;
    const centerY = height / 2;
    
    Object.values(graph.nodes).forEach((node: GraphNode, i) => {
      const angle = (i / nodeCount) * 2 * Math.PI;
      node.x = centerX + radius * Math.cos(angle);
      node.y = centerY + radius * Math.sin(angle);
    });
  } else {
    // For larger graphs, use a force-directed layout (simplified version)
    // In a real implementation, you'd use a proper force-directed algorithm
    // This is just a placeholder
    Object.values(graph.nodes).forEach((node: GraphNode, i) => {
      node.x = width * (0.2 + Math.random() * 0.6);
      node.y = height * (0.2 + Math.random() * 0.6);
    });
    
    // Run a few iterations of force simulation
    for (let i = 0; i < 100; i++) {
      simulateForces(graph, width, height);
    }
  }
  
  return graph;
}

interface ForceNode extends GraphNode {
  fx?: number;
  fy?: number;
}

function simulateForces(graph: Graph, width: number, height: number) {
  const repulsionForce = 1000;
  const attractionForce = 0.1;
  const nodesList = Object.values(graph.nodes) as ForceNode[];
  
  // Calculate repulsion forces between all nodes
  for (let i = 0; i < nodesList.length; i++) {
    const nodeA = nodesList[i];
    nodeA.fx = 0;
    nodeA.fy = 0;
    
    for (let j = 0; j < nodesList.length; j++) {
      if (i === j) continue;
      
      const nodeB = nodesList[j];
      const dx = (nodeA.x || 0) - (nodeB.x || 0);
      const dy = (nodeA.y || 0) - (nodeB.y || 0);
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);
      
      // Avoid division by zero
      if (dist === 0) continue;
      
      // Repulsion force (inverse square law)
      const force = repulsionForce / distSq;
      nodeA.fx += (dx / dist) * force;
      nodeA.fy += (dy / dist) * force;
    }
  }
  
  // Apply attraction forces along edges
  for (const nodeId in graph.nodes) {
    const node = graph.nodes[nodeId] as ForceNode;
    
    for (const adjId of node.adjacent) {
      const adjNode = graph.nodes[adjId] as ForceNode;
      if (!adjNode) continue;
      
      const dx = (node.x || 0) - (adjNode.x || 0);
      const dy = (node.y || 0) - (adjNode.y || 0);
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Avoid division by zero
      if (dist === 0) continue;
      
      // Attraction force (like a spring)
      const force = dist * attractionForce;
      node.fx = (node.fx || 0) - (dx / dist) * force;
      node.fy = (node.fy || 0) - (dy / dist) * force;
    }
  }
  
  // Update positions and enforce boundaries
  for (const node of nodesList) {
    if (node.fx !== undefined && node.fy !== undefined) {
      node.x = (node.x || 0) + node.fx;
      node.y = (node.y || 0) + node.fy;
      
      // Keep within bounds
      node.x = Math.max(50, Math.min(width - 50, node.x));
      node.y = Math.max(50, Math.min(height - 50, node.y));
      
      // Clean up temporary properties
      delete node.fx;
      delete node.fy;
    }
  }
}

// Animation utilities
export function animateArrayElements(
  elements: HTMLElement[],
  positions: number[],
  duration: number
) {
  return gsap.to(elements, {
    duration: duration / 1000,
    x: (i) => positions[i],
    ease: 'power2.inOut',
  });
}

export function animateArraySwap(
  elements: HTMLElement[],
  i: number,
  j: number,
  duration: number
) {
  // Clear any existing animations
  gsap.killTweensOf([elements[i], elements[j]]);
  
  // Get the current positions of the elements
  const pos1 = elements[i].getBoundingClientRect();
  const pos2 = elements[j].getBoundingClientRect();
  
  // Calculate the distance between elements
  const xDistance = pos2.left - pos1.left;
  
  // Use a smoother animation timeline
  return gsap.timeline({
    defaults: { ease: "power3.inOut" },
    onStart: () => {
      // Add a highlight class during animation
      elements[i].classList.add('animating');
      elements[j].classList.add('animating');
    },
    onComplete: () => {
      // Remove the highlight class after animation
      elements[i].classList.remove('animating');
      elements[j].classList.remove('animating');
    }
  })
    // First, move elements up simultaneously with slight delay between them
    .to(elements[i], {
      duration: duration / 3000,
      y: -50,
      ease: "power2.out",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    })
    .to(elements[j], {
      duration: duration / 3000,
      y: -25,
      ease: "power2.out",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    }, "<0.05") // Start slightly after first element
    
    // Then, move elements horizontally
    .to(elements[i], {
      duration: duration / 1500,
      x: `+=${xDistance}`,
      ease: "power2.inOut",
    }, "<0.1")
    .to(elements[j], {
      duration: duration / 1500,
      x: `-=${xDistance}`,
      ease: "power2.inOut",
    }, "<")
    
    // Finally, move elements down to their original vertical position
    .to([elements[i], elements[j]], {
      duration: duration / 3000,
      y: 0,
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      ease: "power3.in",
      stagger: 0.05
    }, "<0.8");
}

// Utility to create a delay promise
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
} 
