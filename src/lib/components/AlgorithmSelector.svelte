<script lang="ts">
  import { selectedAlgorithm, inputData, runAlgorithm, reset } from '$lib/stores/algorithm';
  import { sortingAlgorithms } from '$lib/algorithms/sorting/index.js';
  import { treeAlgorithms } from '$lib/algorithms/tree/index.js';
  import { searchAlgorithms } from '$lib/algorithms/search/index.js';
  import { graphAlgorithms } from '$lib/algorithms/graph/index.js';
  import { onMount } from 'svelte';
  
  export let category: 'sorting' | 'tree' | 'search' | 'graph' = 'sorting';
  
  // Get appropriate algorithms based on category
  $: algorithms = 
    category === 'sorting' ? sortingAlgorithms :
    category === 'tree' ? treeAlgorithms :
    category === 'search' ? searchAlgorithms :
    category === 'graph' ? graphAlgorithms :
    [];
  
  // Get current algorithm name
  $: algorithmName = $selectedAlgorithm?.name || '';
  
  // Initialize on mount
  onMount(() => {
    if ((!$selectedAlgorithm || $selectedAlgorithm.category !== category) && algorithms.length) {
      selectedAlgorithm.set(algorithms[0]);
      
      if (category === 'sorting') {
        inputData.set([...algorithms[0].defaultInput]);
      } else if (category === 'search') {
        inputData.set({
          array: [...algorithms[0].defaultInput.array],
          target: algorithms[0].defaultInput.target
        });
      } else {
        inputData.set(algorithms[0].defaultInput);
      }
      
      reset();
      runAlgorithm();
    }
  });
  
  // Handle algorithm change
  function handleAlgorithmChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const algorithm = algorithms.find(a => a.name === select.value);
    
    if (algorithm) {
      selectedAlgorithm.set(algorithm);
      
      if (category === 'sorting') {
        inputData.set([...algorithm.defaultInput]);
      } else if (category === 'search') {
        inputData.set({
          array: [...algorithm.defaultInput.array],
          target: algorithm.defaultInput.target
        });
      } else {
        inputData.set(algorithm.defaultInput);
      }
      
      reset();
      runAlgorithm();
    }
  }
</script>

<div class="algorithm-selector">
  <label for="algorithm-select">Algorithm:</label>
  <select id="algorithm-select" on:change={handleAlgorithmChange} value={algorithmName}>
    {#each algorithms as algorithm}
      <option value={algorithm.name}>{algorithm.name}</option>
    {/each}
  </select>
</div>

<style>
  .algorithm-selector {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;
    width: 100%;
    margin-bottom: 16px;
  }
  
  select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
  }
  
  label {
    font-weight: 500;
    color: #555;
  }
</style> 