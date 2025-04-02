<script lang="ts">
  import { selectedAlgorithm, currentStep } from '$lib/stores/algorithm';
  
  // Pseudocode lines from the selected algorithm
  $: pseudocode = $selectedAlgorithm?.pseudocode || [];
  
  // Currently highlighted lines
  $: highlightedLines = $currentStep?.highlightLines || [];
  
  // Current step description
  $: description = $currentStep?.description || '';
</script>

<div class="pseudocode-container">
  <div class="pseudocode-header">
    <h3>Pseudocode</h3>
  </div>
  
  <div class="code-view">
    {#each pseudocode as line, index}
      <div class="code-line" class:highlighted={highlightedLines.includes(index)}>
        <span class="line-number">{index}</span>
        <span class="line-content">{line}</span>
      </div>
    {/each}
  </div>
  
  {#if description}
    <div class="description">
      <strong>Current step:</strong> {description}
    </div>
  {/if}
</div>

<style>
  .pseudocode-container {
    font-family: 'Fira Code', monospace;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }
  
  .pseudocode-header {
    background-color: #2c3e50;
    color: white;
    padding: 8px 16px;
  }
  
  .pseudocode-header h3 {
    margin: 0;
    font-size: 16px;
  }
  
  .code-view {
    background-color: #f8f9fa;
    overflow-y: auto;
    max-height: 400px;
  }
  
  .code-line {
    display: flex;
    padding: 2px 8px;
    font-size: 14px;
    border-left: 3px solid transparent;
    transition: background-color 0.2s;
  }
  
  .code-line.highlighted {
    background-color: rgba(255, 213, 79, 0.3);
    border-left: 3px solid #f39c12;
  }
  
  .line-number {
    color: #aaa;
    width: 24px;
    text-align: right;
    padding-right: 8px;
    user-select: none;
  }
  
  .line-content {
    flex: 1;
    white-space: pre-wrap;
  }
  
  .description {
    padding: 12px 16px;
    background-color: #ecf0f1;
    border-top: 1px solid #ddd;
    font-size: 14px;
  }
</style> 