<script lang="ts">
  import ArrayVisualizer from '$lib/components/ArrayVisualizer.svelte';
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
  import { sortingAlgorithms } from '$lib/algorithms/sorting/index.js';
  import { onMount } from 'svelte';
  
  let arrayInput = '';
  
  // Force initialize with first sorting algorithm
  if (sortingAlgorithms.length > 0) {
    const firstAlgorithm = sortingAlgorithms[0];
    selectedAlgorithm.set(firstAlgorithm);
    inputData.set([...firstAlgorithm.defaultInput]);
    arrayInput = firstAlgorithm.defaultInput.join(', ');
    reset();
    setTimeout(() => {
      runAlgorithm();
    }, 100);
  }
  
  // Automatically select the first algorithm on mount as backup
  onMount(() => {
    if (sortingAlgorithms.length > 0 && !$selectedAlgorithm) {
      selectAlgorithm(sortingAlgorithms[0]);
    }
  });
  
  $: if ($selectedAlgorithm && $selectedAlgorithm.category === 'sorting' && $inputData) {
    arrayInput = Array.isArray($inputData) ? $inputData.join(', ') : '';
  }
  
  // Handle input data change for sorting algorithms
  function handleInputChange(event) {
    try {
      const newData = JSON.parse(`[${arrayInput}]`);
      if (Array.isArray(newData) && newData.every(n => typeof n === 'number')) {
        inputData.set(newData);
        reset();
      }
    } catch (error) {
      // Invalid input, ignore
      console.error('Invalid input data:', error);
    }
  }
  
  // Set the selected algorithm
  function selectAlgorithm(algorithm) {
    selectedAlgorithm.set(algorithm);
    if (algorithm.category === 'sorting') {
      inputData.set([...algorithm.defaultInput]);
      arrayInput = algorithm.defaultInput.join(', ');
      reset();
      runAlgorithm();
    }
  }
  
  // Generate random array for sorting
  function generateRandomArray() {
    // Create a random array with 10-20 elements
    const length = Math.floor(Math.random() * 11) + 10;
    const array = [];
    
    // Generate random values between 5-100
    for (let i = 0; i < length; i++) {
      array.push(Math.floor(Math.random() * 96) + 5);
    }
    
    // Update inputs
    arrayInput = array.join(', ');
    
    // Update store and run algorithm
    inputData.set([...array]);
    
    reset();
    runAlgorithm();
  }
  
  // Handle step slider change
  function handleStepSliderChange(event) {
    const value = parseInt(event.target.value, 10);
    const index = Math.round((value / 100) * ($steps.length - 1));
    currentStepIndex.set(index);
  }
</script>

<div class="algorithm-page sorting-page">
  <header class="page-header">
    <div class="header-content">
      <h1>Sorting Algorithms</h1>
      <p>
        Explore how different sorting algorithms organize data step-by-step. 
        See the algorithms in action, visualize the comparisons and swaps,
        and understand their time and space complexity.
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
              {#each sortingAlgorithms as algorithm}
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
            <ArrayVisualizer />
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
            <button class="random-button" on:click={generateRandomArray}>
              Generate Random Array
            </button>
          </div>
          
          <div class="input-controls-content">
            <div class="controls-layout">
              <div class="controls-row">
                <!-- Main controls (play buttons) on the left -->
                <div class="main-controls">
                  <ControlPanel />
                </div>
                
                <!-- Input field on the right, taking up half the space -->
                <div class="input-field">
                  <label for="array">Array Input</label>
                  <input 
                    type="text" 
                    id="array" 
                    bind:value={arrayInput} 
                    on:change={handleInputChange} 
                    placeholder="e.g. 38, 27, 43, 3, 9, 82, 10"
                  />
                </div>
              </div>
              
              <div class="algorithm-performance">
                <div class="performance-detail">
                  <span class="detail-label">Array size:</span>
                  <span class="detail-value">{Array.isArray($inputData) ? $inputData.length : 0} elements</span>
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
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    padding: 2.5rem 2rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    box-shadow: 0 4px 20px rgba(52, 152, 219, 0.15);
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
    color: #3b82f6;
    box-shadow: inset 0 -2px 0 #3b82f6;
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
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
    outline: none;
  }
  
  .algorithm-performance {
    display: flex;
    gap: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid #e2e8f0;
  }
  
  .performance-detail {
    display: flex;
    gap: 0.5rem;
    font-size: 14px;
  }
  
  .detail-label {
    color: #6b7280;
    font-weight: 500;
  }
  
  .detail-value {
    color: #111827;
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
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 3h5v5'%3E%3C/path%3E%3Cpath d='M4 20L21 3'%3E%3C/path%3E%3Cpath d='M21 16v5h-5'%3E%3C/path%3E%3Cpath d='M15 15l6 6'%3E%3C/path%3E%3Cpath d='M4 4l5 5'%3E%3C/path%3E%3C/svg%3E");
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
  :global(.array-bar) {
    transition: height 0.3s, background-color 0.3s;
  }
  
  :global(.pseudocode-line.active) {
    background-color: rgba(59, 130, 246, 0.1);
    border-left: 3px solid #3b82f6;
    padding-left: 1rem;
  }
</style> 