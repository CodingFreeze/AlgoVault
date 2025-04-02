<script lang="ts">
  import { currentStep } from '$lib/stores/algorithm';
  import type { TreeNode } from '$lib/algorithms/types';
  import { onMount, afterUpdate } from 'svelte';
  
  // Tree display dimensions
  const NODE_RADIUS = 25;
  const VERTICAL_SPACING = 80;
  const HORIZONTAL_SCALE = 40;
  
  // Canvas dimensions
  let width = 800;
  let height = 400;
  
  // Derived tree data
  $: tree = $currentStep?.data as TreeNode | null;
  $: highlightNodes = $currentStep?.highlightNodes || [];
  
  // Calculate positions for all nodes to draw them on the canvas
  function calculateNodePositions(node: TreeNode | null | undefined, depth = 0, pos = 0) {
    if (!node) return;
    
    // Calculate x, y coordinates for the node
    node.x = width / 2 + pos * HORIZONTAL_SCALE;
    node.y = 80 + depth * VERTICAL_SPACING; // Reduced top padding to keep tree centered
    
    // Recursively calculate positions for child nodes
    calculateNodePositions(node.left, depth + 1, pos - Math.pow(2, 3 - depth));
    calculateNodePositions(node.right, depth + 1, pos + Math.pow(2, 3 - depth));
  }
  
  // Draw the tree
  function drawTree(node: TreeNode | null | undefined, ctx: CanvasRenderingContext2D) {
    if (!node) return;
    
    // Draw edges to children first (so they're behind the nodes)
    if (node.left) {
      ctx.beginPath();
      ctx.moveTo(node.x!, node.y!);
      ctx.lineTo(node.left.x!, node.left.y!);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    if (node.right) {
      ctx.beginPath();
      ctx.moveTo(node.x!, node.y!);
      ctx.lineTo(node.right.x!, node.right.y!);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    const isHighlighted = highlightNodes.includes(node.id);
    
    // Draw drop shadow for highlighted nodes
    if (isHighlighted) {
      ctx.save();
      ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw node with shadow
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.restore();
      
      // Draw outer glow effect
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, NODE_RADIUS + 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw node
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, NODE_RADIUS, 0, Math.PI * 2);
    
    // Fill based on whether node is highlighted
    if (isHighlighted) {
      ctx.fillStyle = '#ef4444';
    } else {
      ctx.fillStyle = '#ffffff';
    }
    
    ctx.fill();
    ctx.strokeStyle = isHighlighted ? '#b91c1c' : '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw value text
    ctx.fillStyle = isHighlighted ? '#ffffff' : '#1e293b';
    ctx.font = '16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value.toString(), node.x!, node.y!);
    
    // Recursively draw children
    drawTree(node.left, ctx);
    drawTree(node.right, ctx);
  }
  
  // Draw the tree on the canvas
  function renderTree(ctx: CanvasRenderingContext2D) {
    try {
      if (!tree) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('No tree data available', width / 2, height / 2);
        return;
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Calculate positions for all nodes
      calculateNodePositions(tree);
      
      // Draw the tree
      drawTree(tree, ctx);
    } catch (error) {
      console.error('Error rendering tree:', error);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ef4444';
      ctx.font = '16px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Error rendering tree visualization', width / 2, height / 2);
    }
  }
  
  // Canvas element and rendering
  let canvas: HTMLCanvasElement;
  
  function updateCanvas() {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    try {
      // Update canvas dimensions based on container size
      const container = canvas.parentElement;
      if (container) {
        width = container.clientWidth;
        height = container.clientHeight;
      }
      
      // Set high-DPI canvas if device is high-DPI
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      
      renderTree(ctx);
    } catch (error) {
      console.error('Error updating canvas:', error);
    }
  }
  
  onMount(() => {
    updateCanvas();
    window.addEventListener('resize', updateCanvas);
    
    return () => {
      window.removeEventListener('resize', updateCanvas);
    };
  });
  
  // Simple update approach without animations for more reliability
  $: if ($currentStep) {
    setTimeout(updateCanvas, 0);
  }
</script>

<div class="tree-visualizer">
  <canvas
    bind:this={canvas}
    width={width}
    height={height}
  ></canvas>
</div>

<style>
  .tree-visualizer {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 0;
    overflow: hidden;
  }
  
  canvas {
    max-width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 8px;
  }
</style> 
