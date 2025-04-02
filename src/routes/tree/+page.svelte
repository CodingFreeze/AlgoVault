<script lang="ts">
  import TreeVisualizer from '$lib/components/TreeVisualizer.svelte';
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
  import { treeAlgorithms } from '$lib/algorithms/tree/index.js';
  import { onMount } from 'svelte';
  
  let inputValue = '45'; // Default value to insert or search in BST
  
  // Force initialize with first tree algorithm
  if (treeAlgorithms.length > 0) {
    const firstAlgorithm = treeAlgorithms[0];
    selectedAlgorithm.set(firstAlgorithm);
    inputData.set(firstAlgorithm.defaultInput);
    if (firstAlgorithm.name.includes('Insertion') || firstAlgorithm.name.includes('Search')) {
      inputValue = '45';
    }
    reset();
    setTimeout(() => {
      runAlgorithm();
    }, 100);
  }
  
  // Automatically select the first algorithm on mount as backup
  onMount(() => {
    if (treeAlgorithms.length > 0 && !$selectedAlgorithm) {
      selectAlgorithm(treeAlgorithms[0]);
    }
  });
  
  // Handle algorithm input change
  function handleInputChange() {
    if (!$selectedAlgorithm) return;
    
    // For tree algorithms that take a value (like insert or search)
    if ($selectedAlgorithm.name.includes('Insertion') || $selectedAlgorithm.name.includes('Search')) {
      const value = parseInt(inputValue);
      if (!isNaN(value)) {
        inputData.set({
          tree: $inputData?.tree || $selectedAlgorithm.defaultInput.tree,
          value
        });
      }
    } 
    // For traversal algorithms that only need the tree
    else {
      inputData.set($inputData?.tree || $selectedAlgorithm.defaultInput);
    }
    
    // Set the algorithm as changed so the next play will re-run it
    reset();
  }
  
  // Run algorithm when button is clicked
  function handleRunClick() {
    handleInputChange();
    runAlgorithm();
  }
  
  // Set the selected algorithm
  function selectAlgorithm(algorithm) {
    selectedAlgorithm.set(algorithm);
    if (algorithm.category === 'tree') {
      inputData.set(algorithm.defaultInput);
      if (algorithm.name.includes('Insertion') || algorithm.name.includes('Search')) {
        inputValue = '45';
      }
      reset();
      runAlgorithm();
    }
  }
  
  // Generate random BST
  function generateRandomTree() {
    // Create a random BST with 5-10 nodes
    const nodeCount = Math.floor(Math.random() * 6) + 5;
    const usedValues = new Set();
    const values = [];
    
    // Generate unique random values between 1-100
    while (values.length < nodeCount) {
      const val = Math.floor(Math.random() * 100) + 1;
      if (!usedValues.has(val)) {
        usedValues.add(val);
        values.push(val);
      }
    }
    
    // Create a balanced tree by sorting first
    values.sort((a, b) => a - b);
    
    // Create BST structure (this is simplified; actual BST would be built by inserting values)
    const rootValue = values[Math.floor(values.length / 2)];
    
    // Generate a random value for search/insertion that's not in the tree
    const randomValue = Math.floor(Math.random() * 100) + 1;
    inputValue = String(randomValue);
    
    if ($selectedAlgorithm) {
      if ($selectedAlgorithm.name.includes('Insertion') || $selectedAlgorithm.name.includes('Search')) {
        inputData.set({
          tree: {
            value: rootValue,
            left: buildRandomBST(values, 0, Math.floor(values.length / 2) - 1),
            right: buildRandomBST(values, Math.floor(values.length / 2) + 1, values.length - 1)
          },
          value: randomValue
        });
      } else {
        inputData.set({
          value: rootValue,
          left: buildRandomBST(values, 0, Math.floor(values.length / 2) - 1),
          right: buildRandomBST(values, Math.floor(values.length / 2) + 1, values.length - 1)
        });
      }
      
      reset();
      runAlgorithm();
    }
  }
  
  // Helper function to build a balanced BST from sorted array
  function buildRandomBST(values, start, end) {
    if (start > end) return null;
    
    const mid = Math.floor((start + end) / 2);
    return {
      value: values[mid],
      left: buildRandomBST(values, start, mid - 1),
      right: buildRandomBST(values, mid + 1, end)
    };
  }
  
  // Handle step slider change
  function handleStepSliderChange(event) {
    const value = parseInt(event.target.value, 10);
    const index = Math.round((value / 100) * ($steps.length - 1));
    currentStepIndex.set(index);
  }
</script>

<div class="algorithm-page tree-page">
  <header class="page-header">
    <div class="header-content">
      <h1>Tree Algorithms</h1>
      <p>
        Explore tree-based algorithms for operations such as insertion, search, and traversal. 
        Visualize how data is organized and accessed in Binary Search Tree Insertion and other tree structures.
      </p>
    </div>
  </header>
  
  <div class="page-content">
    <div class="content-layout">
      <!-- Main content area -->
      <main class="main-content">
        <!-- Algorithm selection and description - Full width -->
        <div class="algorithm-info">
          <h2 class="section-title">Algorithm</h2>
          <div class="algorithm-selector-info">
            <div class="algorithm-tabs">
              {#each treeAlgorithms as algorithm}
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
            <TreeVisualizer />
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
            <button class="random-button" on:click={generateRandomTree}>
              Generate Random Tree
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
                <div class="tree-input-container">
                  {#if $selectedAlgorithm?.name.includes('Insertion') || $selectedAlgorithm?.name.includes('Search')}
                    <div class="input-field">
                      <label for="treeValue">Value to {$selectedAlgorithm?.name.includes('Search') ? 'search for' : 'insert'}</label>
                      <input 
                        type="number" 
                        id="treeValue" 
                        bind:value={inputValue} 
                        on:change={handleInputChange}
                        min="0"
                        max="100"
                      />
                    </div>
                  {:else}
                    <div class="input-message">
                      <p>This algorithm traverses the entire tree. Use the controls to visualize the process.</p>
                    </div>
                  {/if}
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
    background: linear-gradient(135deg, #2ecc71, #27ae60);
    color: white;
    padding: 2.5rem 2rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    box-shadow: 0 4px 20px rgba(46, 204, 113, 0.15);
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
    color: #2ecc71;
    box-shadow: inset 0 -2px 0 #2ecc71;
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
  
  .tree-input-container {
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
  
  .input-field input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    background-color: #fff;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  }
  
  .input-field input:hover {
    border-color: #cbd5e1;
  }
  
  .input-field input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
    outline: none;
  }
  
  .input-message {
    color: #64748b;
    font-style: italic;
    background-color: #f8fafc;
    padding: 0.75rem;
    border-radius: 6px;
    border-left: 3px solid #f59e0b;
  }
  
  .input-message p {
    margin: 0;
  }
  
  .random-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #ecfdf5;
    color: #10b981;
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
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3v18'%3E%3C/path%3E%3Cpath d='M17 8l-5-5-5 5'%3E%3C/path%3E%3Cpath d='M17 16l-5 5-5-5'%3E%3C/path%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  
  .random-button:hover {
    background-color: #d1fae5;
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
  
  .random-button:active {
    transform: translateY(0);
  }
  
  /* Visualization section */
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
    background: #3b82f6;
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
  
  /* Code section */
  .code-section {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  /* Component specific styling */
  :global(.pseudocode-line.active) {
    background-color: rgba(34, 197, 94, 0.1);
    border-left: 3px solid #22c55e;
    padding-left: 1rem;
  }
</style> 