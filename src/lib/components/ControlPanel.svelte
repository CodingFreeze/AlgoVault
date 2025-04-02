<script lang="ts">
  import { currentStepIndex, steps, isPlaying, animationSpeed, selectedAlgorithm, inputData, runAlgorithm, play, pause, nextStep, previousStep, reset } from '$lib/stores/algorithm';
  import { onDestroy } from 'svelte';
  import { sortingAlgorithms } from '$lib/algorithms/sorting/index.js';
  import { treeAlgorithms } from '$lib/algorithms/tree/index.js';
  import { searchAlgorithms } from '$lib/algorithms/search/index.js';
  import { graphAlgorithms } from '$lib/algorithms/graph/index.js';
  
  // Auto-play timer
  let playTimer: ReturnType<typeof setTimeout> | null = null;
  
  // Get current algorithm name and category
  $: algorithmName = $selectedAlgorithm?.name || 'Select Algorithm';
  $: category = $selectedAlgorithm?.category || 'sorting';
  
  // Get appropriate algorithms based on category
  $: algorithms = 
    category === 'sorting' ? sortingAlgorithms :
    category === 'tree' ? treeAlgorithms :
    category === 'search' ? searchAlgorithms :
    category === 'graph' ? graphAlgorithms :
    [];
  
  // Get progress percentage
  $: progress = $steps.length ? ($currentStepIndex / ($steps.length - 1)) * 100 : 0;
  
  // Get auto-play delay
  $: autoPlayDelay = getAutoPlayDelay($animationSpeed);
  
  // Set the colors based on algorithm category
  $: categoryColor = 
    category === 'sorting' ? { primary: '#3498db', light: '#e0f7ff', hover: '#2980b9' } :
    category === 'tree' ? { primary: '#2ecc71', light: '#e0ffd5', hover: '#27ae60' } :
    category === 'search' ? { primary: '#f39c12', light: '#fff6e0', hover: '#d35400' } :
    category === 'graph' ? { primary: '#e74c3c', light: '#ffeeee', hover: '#c0392b' } :
    { primary: '#3498db', light: '#e0f7ff', hover: '#2980b9' };
  
  // Handle play state changes
  $: {
    if ($isPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  }
  
  // Clean up on component destroy
  onDestroy(() => {
    stopAutoPlay();
  });
  
  // Start auto-play timer
  function startAutoPlay() {
    stopAutoPlay(); // Clear any existing timer
    
    playTimer = setInterval(() => {
      if ($currentStepIndex >= $steps.length - 1) {
        // Reached the end, stop playing
        pause();
      } else {
        nextStep();
      }
    }, autoPlayDelay);
  }
  
  // Stop auto-play timer
  function stopAutoPlay() {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
  }
  
  // Handle algorithm change
  function handleAlgorithmChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const algorithm = algorithms.find(a => a.name === select.value);
    
    if (algorithm) {
      selectedAlgorithm.set(algorithm);
      
      if (category === 'sorting') {
        inputData.set([...algorithm.defaultInput]);
      } else {
        inputData.set(algorithm.defaultInput);
      }
      
      reset();
      runAlgorithm();
    }
  }
  
  // Enhanced play function that also runs the algorithm if needed
  function enhancedPlay() {
    // If we don't have steps or we're at the end, run the algorithm first
    if ($steps.length === 0 || $currentStepIndex >= $steps.length - 1) {
      runAlgorithm();
    }
    play();
  }
  
  // Handle slider change for animation speed
  function handleSpeedChange(event: Event) {
    const input = event.target as HTMLInputElement;
    animationSpeed.set(Number(input.value));
    
    // If algorithm is currently playing, restart with new speed
    if ($isPlaying) {
      startAutoPlay();
    }
  }
  
  // Handle manual stepping with the progress bar
  function handleProgressChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    const index = Math.round((value / 100) * ($steps.length - 1));
    
    currentStepIndex.set(index);
  }
  
  // Format input data for display based on algorithm category
  $: formattedInputData = 
    !$inputData ? '' :
    category === 'sorting' ? $inputData.join(', ') :
    category === 'search' ? `[${$inputData.array?.join(', ')}], target: ${$inputData.target}` :
    category === 'tree' ? 'Tree visualization' :
    '';
  
  // Handle input data change for sorting algorithms
  function handleSortingInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    try {
      const newData = JSON.parse(`[${input.value}]`);
      if (Array.isArray(newData) && newData.every(n => typeof n === 'number')) {
        inputData.set(newData);
        reset();
        runAlgorithm();
      }
    } catch (error) {
      // Invalid input, ignore
      console.error('Invalid input data:', error);
    }
  }
  
  // Get appropriate delay based on animation speed
  function getAutoPlayDelay(speed: number) {
    // Non-linear scaling for better control at lower speeds
    if (speed <= 1) {
      // Slower speeds (0.5 to 1x): 1000ms to 500ms
      return 1000 / speed;
    } else if (speed <= 2) {
      // Medium speeds (1x to 2x): 500ms to 350ms
      return 500 - ((speed - 1) * 150);
    } else {
      // Faster speeds (2x to 10x): 350ms to 100ms
      return Math.max(100, 350 - ((speed - 2) * 25));
    }
  }
</script>

<div class="control-panel">
  <div class="controls-grid">
    <div class="playback-controls" style="--primary: {categoryColor.primary}; --light: {categoryColor.light}; --hover: {categoryColor.hover};">
      <button on:click={reset} aria-label="Reset" class="control-button reset-button" title="Reset">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 2v6h6"></path>
          <path d="M3 8L12 15"></path>
          <circle cx="12" cy="12" r="9"></circle>
        </svg>
      </button>
      <button on:click={previousStep} aria-label="Previous Step" class="control-button" disabled={$currentStepIndex <= 0} title="Previous Step">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 20L9 12l10-8v16z"></path>
          <path d="M5 19V5"></path>
        </svg>
      </button>
      {#if $isPlaying}
        <button on:click={pause} aria-label="Pause" class="control-button play-button" title="Pause">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        </button>
      {:else}
        <button on:click={enhancedPlay} aria-label="Play" class="control-button play-button" title="Play">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M8 5v14l11-7z"></path>
          </svg>
        </button>
      {/if}
      <button on:click={nextStep} aria-label="Next Step" class="control-button" disabled={$currentStepIndex >= $steps.length - 1} title="Next Step">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 4l10 8-10 8V4z"></path>
          <path d="M19 5v14"></path>
        </svg>
      </button>
    </div>
    
    <div class="speed-control" style="--primary: {categoryColor.primary}; --light: {categoryColor.light}; --hover: {categoryColor.hover};">
      <label for="speed-control">Speed:</label>
      <input 
        type="range" 
        id="speed-control" 
        min="0.5" 
        max="10" 
        step="0.5" 
        value={$animationSpeed} 
        on:input={handleSpeedChange}
      />
      <div class="speed-value">{$animationSpeed}x</div>
    </div>
  </div>
  
  <!-- Removed the duplicate Input Array section for sorting algorithms -->

  <!-- Progress bar is removed from here and will be added to visualization section -->
</div>

<style>
  .control-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  
  .controls-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 16px;
    align-items: center;
  }
  
  @media (max-width: 768px) {
    .controls-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
  
  .playback-controls {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  
  .control-button {
    width: 40px;
    height: 40px;
    border: none;
    background-color: #f8fafc;
    color: #64748b;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  .control-button::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .control-button:hover:not(:disabled)::after {
    opacity: 1;
  }
  
  .control-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    color: #334155;
  }
  
  .control-button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  .control-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .play-button {
    width: 48px;
    height: 48px;
    background-color: var(--primary);
    color: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .play-button:hover:not(:disabled) {
    background-color: var(--hover);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .speed-control {
    display: flex;
    align-items: center;
    gap: 12px;
    background-color: #f8fafc;
    padding: 6px 12px;
    border-radius: 8px;
  }
  
  .speed-control label {
    white-space: nowrap;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
  }
  
  .speed-control input {
    flex: 1;
    min-width: 80px;
    max-width: 200px;
  }
  
  .speed-value {
    font-size: 14px;
    color: var(--primary);
    font-weight: 600;
    min-width: 36px;
    background-color: var(--light);
    padding: 4px 8px;
    border-radius: 6px;
    text-align: center;
  }
  
  /* Custom range slider */
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: #e2e8f0;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: var(--primary);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }
</style> 