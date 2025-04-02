<script lang="ts">
  import { currentStep } from '$lib/stores/algorithm';
  
  $: graph = $currentStep?.data;
  $: highlightedNodes = $currentStep?.highlightNodes || [];
  $: highlightedEdges = $currentStep?.highlightEdges || [];
  $: startNode = $currentStep?.startNode || null;
  
  // Calculate node positions and edges
  $: if (graph && graph.nodes) {
    const svgWidth = 800;
    const svgHeight = 500;
    const padding = 80;
    
    try {
      // Find min and max coordinates for proper scaling
      const nodeValues = Object.values(graph.nodes);
      
      if (nodeValues.length > 0) {
        // Ensure all nodes have x and y properties
        nodeValues.forEach(node => {
          if (typeof node.x === 'undefined') node.x = Math.random() * 500;
          if (typeof node.y === 'undefined') node.y = Math.random() * 400;
        });
        
        // Identify the start node or main node for centering
        let mainNodeId = startNode || (highlightedNodes.length > 0 ? highlightedNodes[0] : null);
        let mainNode = null;
        
        if (mainNodeId) {
          // Find the main node in the graph
          const mainNodeObj = graph.nodes[mainNodeId];
          if (mainNodeObj) {
            mainNode = {...mainNodeObj, id: mainNodeId};
          }
        }
        
        // If no main node identified yet, try to find a root or central node in the graph
        if (!mainNode) {
          // Look for a node with most connections as a fallback
          let maxConnections = -1;
          let centralNodeId = null;
          
          Object.entries(graph.nodes).forEach(([id, node]) => {
            const connections = node.adjacent ? node.adjacent.length : 0;
            if (connections > maxConnections) {
              maxConnections = connections;
              centralNodeId = id;
            }
          });
          
          if (centralNodeId) {
            mainNode = {...graph.nodes[centralNodeId], id: centralNodeId};
          } else {
            // If still no central node found, just use the first node
            const firstNodeId = Object.keys(graph.nodes)[0];
            mainNode = {...graph.nodes[firstNodeId], id: firstNodeId};
          }
        }
        
        // If we have a main node, adjust coordinates to center it
        if (mainNode) {
          // Center the main node and adjust all other nodes relative to it
          const mainNodeX = mainNode.x || 0;
          const mainNodeY = mainNode.y || 0;
          
          // Adjust all node positions relative to main node
          nodeValues.forEach(node => {
            node.x = node.x - mainNodeX + svgWidth / 2;
            node.y = node.y - mainNodeY + svgHeight / 2;
          });
        }
        
        const minX = Math.min(...nodeValues.map(n => n.x || 0));
        const maxX = Math.max(...nodeValues.map(n => n.x || 0));
        const minY = Math.min(...nodeValues.map(n => n.y || 0));
        const maxY = Math.max(...nodeValues.map(n => n.y || 0));
        
        // Calculate scale factors to fit the graph
        const rangeX = maxX - minX || 1; // Avoid division by zero
        const rangeY = maxY - minY || 1; // Avoid division by zero
        
        const scaleX = (svgWidth - 2 * padding) / rangeX;
        const scaleY = (svgHeight - 2 * padding) / rangeY;
        const scale = Math.min(scaleX, scaleY, 2); // Use the smaller scale to maintain aspect ratio, cap at 2
        
        // Transform node positions
        nodes = nodeValues.map(node => ({
          ...node,
          x: (node.x - minX) * scale + padding,
          y: (node.y - minY) * scale + padding
        }));
        
        // Generate edges from adjacency lists
        edges = [];
        
        // Check each node and its adjacent nodes
        Object.entries(graph.nodes).forEach(([id, node]) => {
          if (node.adjacent && Array.isArray(node.adjacent)) {
            node.adjacent.forEach(adjId => {
              // Only add each edge once for undirected graphs
              if (!graph.directed && id > adjId) return;
              
              const fromNode = nodes.find(n => n.id === id);
              const toNode = nodes.find(n => n.id === adjId);
              
              if (fromNode && toNode) {
                edges.push({
                  from: fromNode,
                  to: toNode
                });
              }
            });
          }
        });
      }
    } catch (error) {
      console.error("Error processing graph data:", error);
    }
  }
  
  let nodes = [];
  let edges = [];
  
  // Helper function to check if an edge is highlighted
  function isEdgeHighlighted(fromId, toId) {
    if (!highlightedEdges || !Array.isArray(highlightedEdges)) return false;
    
    return highlightedEdges.some(edge => {
      if (!Array.isArray(edge) || edge.length < 2) return false;
      return (edge[0] === fromId && edge[1] === toId) || 
             (!graph?.directed && edge[0] === toId && edge[1] === fromId);
    });
  }
  
  // Helper function to check if a node is highlighted
  function isNodeHighlighted(nodeId) {
    if (!highlightedNodes || !Array.isArray(highlightedNodes)) return false;
    return highlightedNodes.includes(nodeId);
  }
  
  // Helper function to determine the node class based on its state
  function getNodeClass(nodeId) {
    if (startNode === nodeId) return 'start-node';
    if (isNodeHighlighted(nodeId)) return 'highlighted';
    return '';
  }
</script>

<div class="graph-visualizer">
  {#if graph && nodes.length > 0}
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
      <!-- Draw edges -->
      {#each edges as edge}
        <line
          x1={edge.from.x}
          y1={edge.from.y}
          x2={edge.to.x}
          y2={edge.to.y}
          stroke={isEdgeHighlighted(edge.from.id, edge.to.id) ? '#3b82f6' : '#e2e8f0'}
          stroke-width="3"
          class={isEdgeHighlighted(edge.from.id, edge.to.id) ? 'edge highlighted' : 'edge'}
        />
      {/each}
      
      <!-- Draw nodes -->
      {#each nodes as node}
        <g class="node {getNodeClass(node.id)}">
          <circle
            cx={node.x}
            cy={node.y}
            r="25"
            fill={startNode === node.id ? '#10b981' : (isNodeHighlighted(node.id) ? '#3b82f6' : '#ffffff')}
            stroke={startNode === node.id ? '#059669' : (isNodeHighlighted(node.id) ? '#2563eb' : '#94a3b8')}
            stroke-width="2"
          />
          <text
            x={node.x}
            y={node.y}
            text-anchor="middle"
            dominant-baseline="middle"
            fill={startNode === node.id || isNodeHighlighted(node.id) ? '#ffffff' : '#1e293b'}
            font-size="16"
            font-weight="500"
          >
            {node.id}
          </text>
        </g>
      {/each}
    </svg>
  {:else}
    <div class="empty-state">
      <p>No graph data available</p>
    </div>
  {/if}
</div>

<style>
  .graph-visualizer {
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }
  
  svg {
    width: 100%;
    height: 100%;
    max-height: 500px;
    max-width: 100%;
  }
  
  .edge {
    transition: stroke 0.3s ease, stroke-width 0.3s ease;
  }
  
  .edge.highlighted {
    stroke-width: 4px;
    filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4));
  }
  
  .node {
    transition: all 0.3s ease;
  }
  
  .node.highlighted circle {
    filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.6));
  }
  
  .node.start-node circle {
    filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.6));
  }
  
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #94a3b8;
    font-size: 1rem;
  }
</style> 