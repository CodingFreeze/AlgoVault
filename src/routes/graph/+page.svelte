<script lang="ts">
  import GraphVisualizer from '$lib/components/GraphVisualizer.svelte';
  import ControlPanel from '$lib/components/ControlPanel.svelte';
  import CodeTabs from '$lib/components/CodeTabs.svelte';
  import AlgorithmInfo from '$lib/components/AlgorithmInfo.svelte';
  import { 
    selectedAlgorithm, 
    inputData, 
    runAlgorithm, 
    reset,
    steps,
    currentStepIndex
  } from '$lib/stores/algorithm';
  import { graphAlgorithms, bfsAlgorithm } from '$lib/algorithms/graph/index.js';
  import { onMount } from 'svelte';
  
  let startNode = 'A'; // Default start node
  
  // Force initialize with the BFS algorithm
  // This ensures the algorithm is set when the page loads
  selectedAlgorithm.set(bfsAlgorithm);
  inputData.set({
    graph: bfsAlgorithm.defaultInput,
    startNode
  });
  reset();
  setTimeout(() => {
    runAlgorithm();
  }, 100);
  
  // Handle algorithm input change
  function handleInputChange() {
    if (!$selectedAlgorithm) return;
    
    // Update input data with the current graph and start node
    inputData.set({
      graph: $inputData?.graph || $selectedAlgorithm.defaultInput,
      startNode
    });
    
    // Set the algorithm as changed so the next play will re-run it
    reset();
  }
  
  // Set the selected algorithm
  function selectAlgorithm(algorithm) {
    selectedAlgorithm.set(algorithm);
    if (algorithm.category === 'graph') {
      inputData.set({
        graph: algorithm.defaultInput,
        startNode: 'A'
      });
      startNode = 'A';
      reset();
      runAlgorithm();
    }
  }
  
  // Generate random graph
  function generateRandomGraph() {
    // Create a random graph with 6-10 nodes
    const nodeCount = Math.floor(Math.random() * 5) + 6;
    const nodes = {};
    
    // Generate nodes with random positions
    for (let i = 0; i < nodeCount; i++) {
      const id = String.fromCharCode(65 + i); // A, B, C, etc.
      nodes[id] = {
        id,
        value: i + 1,
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        adjacent: []
      };
    }
    
    // Generate random edges
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() > 0.5) { // 50% chance to create an edge
          const fromId = String.fromCharCode(65 + i);
          const toId = String.fromCharCode(65 + j);
          nodes[fromId].adjacent.push(toId);
          nodes[toId].adjacent.push(fromId);
        }
      }
    }
    
    // Ensure the graph is connected
    for (let i = 0; i < nodeCount - 1; i++) {
      const fromId = String.fromCharCode(65 + i);
      const toId = String.fromCharCode(65 + i + 1);
      if (!nodes[fromId].adjacent.includes(toId)) {
        nodes[fromId].adjacent.push(toId);
        nodes[toId].adjacent.push(fromId);
      }
    }
    
    // Update inputs
    startNode = 'A';
    
    // Update store and run algorithm
    inputData.set({
      graph: {
        nodes,
        directed: false,
        weighted: false
      },
      startNode
    });
    
    reset();
    runAlgorithm();
  }
  
  // Handle step slider change
  function handleStepSliderChange(event) {
    const value = parseInt(event.target.value, 10);
    const index = Math.round((value / 100) * ($steps.length - 1));
    currentStepIndex.set(index);
  }

  // Automatically select the first algorithm on mount
  onMount(() => {
    if (graphAlgorithms.length > 0) {
      selectAlgorithm(graphAlgorithms[0]);
    }
  });
</script>

<div class="algorithm-page graph-page">
  <header class="page-header">
    <div class="header-content">
      <h1>Graph Algorithms</h1>
      <p>
        Explore graph traversal algorithms like Breadth-First Search.
        Visualize how these algorithms explore and process nodes in a graph.
      </p>
    </div>
  </header>
  
  <div class="page-content">
    <div class="content-layout">
      <main class="main-content">
        <!-- Algorithm selection and description - Full width -->
        <div class="algorithm-info">
          <h2 class="section-title">Algorithm</h2>
          <div class="algorithm-selector-info">
            <div class="algorithm-tabs">
              {#each graphAlgorithms as algorithm}
                <button 
                  class="algorithm-tab" 
                  class:active={$selectedAlgorithm?.name === algorithm.name}
                  on:click={() => selectAlgorithm(algorithm)}
                >
                  {algorithm.name}
                </button>
              {/each}
            </div>
            
            <div class="algorithm-description">
              <AlgorithmInfo />
            </div>
          </div>
        </div>
        
        <!-- Visualization section -->
        <div class="visualization-section">
          <h2 class="section-title">Visualization</h2>
          <div class="visualization-container">
            <GraphVisualizer />
          </div>
          <div class="visualization-footer">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={$steps.length ? ($currentStepIndex / ($steps.length - 1)) * 100 : 0} 
              on:input={handleStepSliderChange}
              disabled={$steps.length <= 1}
              class="progress-slider"
            />
            <div class="step-counter">
              Step {$currentStepIndex + 1} of {$steps.length}
            </div>
          </div>
        </div>
        
        <!-- Controls and Input section - Moved below visualization -->
        <section class="controls-container">
          <div class="controls-header">
            <h2 class="section-title">Controls & Input</h2>
            <button class="random-button" on:click={generateRandomGraph}>
              Generate Random Graph
            </button>
          </div>
          
          <div class="input-controls-content">
            <div class="controls-layout">
              <div class="controls-row">
                <!-- Main controls (play buttons) on the left -->
                <div class="main-controls">
                  <ControlPanel />
                </div>
                
                <!-- Input fields on the right, taking up half the space -->
                <div class="graph-input-container">
                  <div class="input-field">
                    <label for="startNode">Start Node</label>
                    <select 
                      id="startNode" 
                      bind:value={startNode} 
                      on:change={handleInputChange}
                    >
                      {#each Object.keys($inputData?.graph?.nodes || {}) as nodeId}
                        <option value={nodeId}>{nodeId}</option>
                      {/each}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Code section (pseudocode and implementation) -->
        <div class="code-section">
          <h2 class="section-title">Implementation</h2>
          <CodeTabs />
        </div>
      </main>
    </div>
  </div>
</div>

<style>
  /* === Page structure === */
  .algorithm-page {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  /* === Top section grid layout - Removed as we now have full width sections === */
  
  @media (max-width: 900px) {
    .top-section-grid {
      grid-template-columns: 1fr;
    }
  }
  
  /* === Header styling === */
  .page-header {
    background: linear-gradient(135deg, #9333ea, #7e22ce);
    color: white;
    padding: 2.5rem 2rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    box-shadow: 0 4px 20px rgba(147, 51, 234, 0.15);
  }
  
  .header-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    margin-top: 0;
    font-weight: 700;
  }
  
  .page-header p {
    font-size: 1.1rem;
    line-height: 1.6;
    opacity: 0.9;
    margin: 0;
  }
  
  /* === Content layout === */
  .content-layout {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  /* === Section titles === */
  .section-title {
    font-size: 1.25rem;
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 600;
  }
  
  /* === Main content === */
  .main-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  /* === Algorithm selection and info === */
  .algorithm-info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .algorithm-selector-info {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .algorithm-tabs {
    display: flex;
    overflow-x: auto;
    padding: 0;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .algorithm-tab {
    padding: 0.75rem 1.25rem;
    border: none;
    background: none;
    cursor: pointer;
    font-weight: 500;
    color: #64748b;
    white-space: nowrap;
    transition: all 0.2s;
  }
  
  .algorithm-tab:hover {
    background-color: #f1f5f9;
    color: #334155;
  }
  
  .algorithm-tab.active {
    color: #8b5cf6;
    box-shadow: inset 0 -2px 0 #8b5cf6;
    background-color: white;
  }
  
  .algorithm-description {
    padding: 1.25rem;
    flex-grow: 1;
    overflow-y: auto;
  }
  
  /* === Controls container === */
  .controls-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .controls-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .controls-header h2 {
    margin: 0;
    border: none;
    padding: 0;
  }
  
  .input-controls-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }
  
  .controls-layout {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .controls-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-items: center;
  }
  
  .main-controls {
    flex: 1;
  }
  
  .graph-input-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .input-field {
    width: 100%;
  }
  
  .input-field label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
    color: #334155;
  }
  
  .input-field select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    background-color: #fff;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%238b5cf6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;
  }
  
  .input-field select:hover {
    border-color: #cbd5e1;
  }
  
  .input-field select:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
    outline: none;
  }
  
  .random-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #f5f3ff;
    color: #8b5cf6;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .random-button::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 4h-4l2 2-2 2h4'%3E%3C/path%3E%3Cpath d='M6 4v4'%3E%3C/path%3E%3Cpath d='M14 8l-8 8M9 8a5 5 0 0 0 5 5'%3E%3C/path%3E%3Cpath d='M6 20v-4'%3E%3C/path%3E%3Cpath d='M14 16l-8-8'%3E%3C/path%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  
  .random-button:hover {
    background-color: #ede9fe;
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
  
  .random-button:active {
    transform: translateY(0);
  }
  
  /* === Visualization section === */
  .visualization-section {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
  }
  
  .visualization-container {
    height: 400px;
    flex-grow: 1;
    margin-bottom: 0.5rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .visualization-footer {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .progress-slider {
    flex: 1;
    -webkit-appearance: none;
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  
  .progress-slider:hover {
    opacity: 1;
  }
  
  .progress-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #8b5cf6;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .progress-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
  
  .progress-slider:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .step-counter {
    font-size: 0.875rem;
    color: #64748b;
    min-width: 100px;
    text-align: right;
  }
  
  /* === Code section === */
  .code-section {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  /* === Complexity info === */
  .complexity-info {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  .complexity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }
  
  .complexity-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    border-radius: 8px;
    background-color: #f8fafc;
    border-left: 3px solid #8b5cf6;
  }
  
  .complexity-label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .complexity-value {
    font-size: 1.1rem;
    color: #334155;
    font-weight: 700;
    font-family: 'Courier New', monospace;
  }
  
  /* Component specific styling */
  :global(.pseudocode-line.active) {
    background-color: rgba(139, 92, 246, 0.1);
    border-left: 3px solid #8b5cf6;
    padding-left: 1rem;
  }
</style> 