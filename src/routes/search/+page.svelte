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
  import { searchAlgorithms } from '$lib/algorithms/search/index.js';
  import { onMount } from 'svelte';
  
  let searchInput = '15'; // Default value to search
  let arrayInput = '4, 8, 15, 16, 23, 42'; // Default array
  let textInput = 'hello world'; // Text for substring search
  let patternInput = 'world'; // Pattern for substring search
  
  // Force initialize with first search algorithm
  if (searchAlgorithms.length > 0) {
    const firstAlgorithm = searchAlgorithms[0];
    selectedAlgorithm.set(firstAlgorithm);
    
    if (firstAlgorithm.name === 'Substring Search') {
      const defaultInput = firstAlgorithm.defaultInput;
      textInput = defaultInput.text;
      patternInput = defaultInput.pattern;
      inputData.set({
        text: defaultInput.text,
        pattern: defaultInput.pattern
      });
    } else {
      const defaultInput = firstAlgorithm.defaultInput;
      searchInput = defaultInput.target.toString();
      arrayInput = defaultInput.array.join(', ');
      inputData.set({
        array: [...defaultInput.array],
        target: defaultInput.target
      });
    }
    
    reset();
    setTimeout(() => {
      runAlgorithm();
    }, 100);
  }
  
  // Automatically select the first algorithm on mount as backup
  onMount(() => {
    if (searchAlgorithms.length > 0 && !$selectedAlgorithm) {
      selectAlgorithm(searchAlgorithms[0]);
    }
  });
  
  // Check if current algorithm is substring search
  $: isSubstringSearch = $selectedAlgorithm?.name === 'Substring Search';
  
  // Handle algorithm input change for numeric searches
  function handleNumericInputChange() {
    if (!$selectedAlgorithm || isSubstringSearch) return;
    
    // Parse array input
    const array = arrayInput
      .split(',')
      .map(item => parseInt(item.trim()))
      .filter(num => !isNaN(num));
    
    // Parse target value
    const target = parseInt(searchInput);
    
    if (array.length > 0 && !isNaN(target)) {
      inputData.set({
        array,
        target
      });
      
      // Set the algorithm as changed so the next play will re-run it
      reset();
    }
  }
  
  // Handle algorithm input change for substring search
  function handleSubstringInputChange() {
    if (!$selectedAlgorithm || !isSubstringSearch) return;
    
    if (textInput && patternInput) {
      inputData.set({
        text: textInput,
        pattern: patternInput
      });
      
      // Set the algorithm as changed so the next play will re-run it
      reset();
    }
  }
  
  // Run algorithm when button is clicked
  function handleRunClick() {
    if (isSubstringSearch) {
      handleSubstringInputChange();
    } else {
      handleNumericInputChange();
    }
    runAlgorithm();
  }
  
  // Set the selected algorithm
  function selectAlgorithm(algorithm) {
    selectedAlgorithm.set(algorithm);
    
    if (algorithm.name === 'Substring Search') {
      const defaultInput = algorithm.defaultInput;
      textInput = defaultInput.text;
      patternInput = defaultInput.pattern;
      inputData.set({
        text: defaultInput.text,
        pattern: defaultInput.pattern
      });
    } else if (algorithm.category === 'search') {
      const defaultInput = algorithm.defaultInput;
      searchInput = defaultInput.target.toString();
      arrayInput = defaultInput.array.join(', ');
      inputData.set({
        array: [...defaultInput.array],
        target: defaultInput.target
      });
    }
    
    reset();
    runAlgorithm();
  }
  
  // Generate random array for numeric search
  function generateRandomArray() {
    if (isSubstringSearch) {
      generateRandomText();
      return;
    }
    
    // Create a random array with 8-15 elements
    const length = Math.floor(Math.random() * 8) + 8;
    const array = [];
    
    // Generate random values between 1-100
    for (let i = 0; i < length; i++) {
      array.push(Math.floor(Math.random() * 100) + 1);
    }
    
    // Sort array if binary search is selected
    if ($selectedAlgorithm?.name === 'Binary Search') {
      array.sort((a, b) => a - b);
    }
    
    // Pick a random target (50% chance to be in the array)
    const pickFromArray = Math.random() > 0.5;
    let target;
    
    if (pickFromArray && array.length > 0) {
      const randomIndex = Math.floor(Math.random() * array.length);
      target = array[randomIndex];
    } else {
      target = Math.floor(Math.random() * 100) + 1;
    }
    
    // Update inputs
    arrayInput = array.join(', ');
    searchInput = target.toString();
    
    // Update store and run algorithm
    inputData.set({
      array: [...array],
      target
    });
    
    reset();
    runAlgorithm();
  }
  
  // Generate random text for substring search
  function generateRandomText() {
    const words = ["hello", "world", "algorithm", "search", "programming", "javascript", "typescript", "substring", "pattern", "matching"];
    const randomTextLength = Math.floor(Math.random() * 4) + 3; // 3-6 words
    
    // Generate random text
    const randomText = [];
    for (let i = 0; i < randomTextLength; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      randomText.push(randomWord);
    }
    const text = randomText.join(" ");
    
    // Pick a random pattern (50% chance to be in the text)
    const useWordFromText = Math.random() > 0.5;
    let pattern;
    
    if (useWordFromText && randomText.length > 0) {
      // Pick a random word from the text
      pattern = randomText[Math.floor(Math.random() * randomText.length)];
    } else {
      // Pick a random word not necessarily in the text
      pattern = words[Math.floor(Math.random() * words.length)];
    }
    
    // Update inputs
    textInput = text;
    patternInput = pattern;
    
    // Update store and run algorithm
    inputData.set({
      text,
      pattern
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
</script>

<div class="algorithm-page search-page">
  <header class="page-header">
    <div class="header-content">
      <h1>Search Algorithms</h1>
      <p>
        Explore different search algorithms that find a target element in a collection.
        Compare various search approaches to understand their efficiency and use cases.
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
              {#each searchAlgorithms as algorithm}
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
              Generate Random {isSubstringSearch ? 'Text' : 'Array'}
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
                <div class="search-inputs">
                  {#if isSubstringSearch}
                    <div class="input-field">
                      <label for="text">Text</label>
                      <input 
                        type="text" 
                        id="text" 
                        bind:value={textInput} 
                        on:change={handleSubstringInputChange}
                        placeholder="e.g., hello world"
                      />
                    </div>
                    
                    <div class="input-field target-input">
                      <label for="pattern">Pattern</label>
                      <input 
                        type="text" 
                        id="pattern" 
                        bind:value={patternInput} 
                        on:change={handleSubstringInputChange}
                        placeholder="e.g., world"
                      />
                    </div>
                  {:else}
                    <div class="input-field">
                      <label for="array">Array Input</label>
                      <input 
                        type="text" 
                        id="array" 
                        bind:value={arrayInput} 
                        on:change={handleNumericInputChange}
                        placeholder="e.g., 4, 8, 15, 16, 23, 42"
                      />
                    </div>
                    
                    <div class="input-field target-input">
                      <label for="target">Target Value</label>
                      <input 
                        type="number" 
                        id="target" 
                        bind:value={searchInput} 
                        on:change={handleNumericInputChange}
                        placeholder="e.g., 15"
                      />
                    </div>
                  {/if}
                </div>
              </div>
              
              {#if $selectedAlgorithm?.name === 'Binary Search'}
                <div class="algorithm-note">
                  <p><strong>Note:</strong> Binary search requires a sorted array. Your input will be automatically sorted.</p>
                </div>
              {/if}
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
  
  /* === Header styling === */
  .page-header {
    background: linear-gradient(135deg, #f39c12, #d35400);
    color: white;
    padding: 2.5rem 2rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    box-shadow: 0 4px 20px rgba(243, 156, 18, 0.15);
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
  
  /* === Visualization Section === */
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
  
  /* === Controls & Input Section === */
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
    gap: 0.75rem;
  }
  
  .controls-layout {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .controls-row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.5rem;
    align-items: center;
  }
  
  @media (max-width: 768px) {
    .controls-row {
      grid-template-columns: 1fr;
    }
  }
  
  .search-inputs {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
    align-items: center;
  }
  
  @media (max-width: 768px) {
    .search-inputs {
      grid-template-columns: 1fr;
    }
  }
  
  .input-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
  
  .input-field label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #334155;
  }
  
  .input-field input {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    background-color: #fff;
    border-radius: 8px;
    font-size: 0.875rem;
    width: 100%;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  }
  
  .input-field input:hover {
    border-color: #cbd5e1;
  }
  
  .input-field input:focus {
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
    outline: none;
  }
  
  .random-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #fff6e0;
    color: #f39c12;
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
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23f39c12' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'%3E%3C/path%3E%3Cpolyline points='7.5 4.21 12 6.81 16.5 4.21'%3E%3C/polyline%3E%3Cpolyline points='7.5 19.79 7.5 14.6 3 12'%3E%3C/polyline%3E%3Cpolyline points='21 12 16.5 14.6 16.5 19.79'%3E%3C/polyline%3E%3Cpolyline points='3.27 6.96 12 12.01 20.73 6.96'%3E%3C/polyline%3E%3Cline x1='12' y1='22.08' x2='12' y2='12'%3E%3C/line%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  
  .random-button:hover {
    background-color: #ffecb3;
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
  
  .random-button:active {
    transform: translateY(0);
  }
  
  .algorithm-note {
    background-color: #fffbeb;
    border: 1px solid #fef3c7;
    padding: 0.75rem;
    border-radius: 8px;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
  
  .algorithm-note p {
    margin: 0;
    color: #92400e;
  }
  
  /* === Code Section === */
  .code-section {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  /* Component specific styling */
  :global(.pseudocode-line.active) {
    background-color: rgba(59, 130, 246, 0.1);
    border-left: 3px solid #3b82f6;
    padding-left: 1rem;
  }
</style> 