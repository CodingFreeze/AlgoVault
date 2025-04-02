<script lang="ts">
  import { selectedAlgorithm } from '$lib/stores/algorithm';
  
  // Get algorithm details
  $: name = $selectedAlgorithm?.name || 'No Algorithm Selected';
  $: description = $selectedAlgorithm?.description || '';
  $: category = $selectedAlgorithm?.category || '';
  $: timeComplexity = $selectedAlgorithm?.timeComplexity || 'N/A';
  $: spaceComplexity = $selectedAlgorithm?.spaceComplexity || 'N/A';
  $: bestCase = $selectedAlgorithm?.bestCase || null;
  $: worstCase = $selectedAlgorithm?.worstCase || null;
</script>

<div class="algorithm-info-container">
  <div class="header">
    <h2>{name}</h2>
    <div class="category-badge">{category}</div>
  </div>
  
  <div class="description">
    <p>{description}</p>
  </div>
  
  <div class="complexity-info">
    <div class="complexity-row">
      <span class="complexity-label">Time:</span>
      <span class="complexity-value">{timeComplexity}</span>
    </div>
    <div class="complexity-row">
      <span class="complexity-label">Space:</span>
      <span class="complexity-value">{spaceComplexity}</span>
    </div>
    {#if bestCase}
      <div class="complexity-row">
        <span class="complexity-label">Best:</span>
        <span class="complexity-value">{bestCase}</span>
      </div>
    {/if}
    {#if worstCase}
      <div class="complexity-row">
        <span class="complexity-label">Worst:</span>
        <span class="complexity-value">{worstCase}</span>
      </div>
    {/if}
  </div>
  
  <slot />
</div>

<style>
  .algorithm-info-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  
  .header h2 {
    margin: 0;
    color: #2c3e50;
    font-size: 24px;
  }
  
  .category-badge {
    background-color: #3498db;
    color: white;
    text-transform: capitalize;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
  }
  
  .description {
    color: #555;
    line-height: 1.5;
    margin-bottom: 16px;
  }
  
  .description p {
    margin: 0;
  }
  
  .complexity-info {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    font-size: 0.85rem;
    border-top: 1px solid #eaeaea;
    padding-top: 12px;
  }
  
  .complexity-row {
    display: flex;
    gap: 4px;
  }
  
  .complexity-label {
    color: #64748b;
    font-weight: 600;
  }
  
  .complexity-value {
    color: #334155;
    font-family: 'Courier New', monospace;
  }
</style> 