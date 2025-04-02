<script lang="ts">
  import PseudocodeViewer from './PseudocodeViewer.svelte';
  import CodeViewer from './CodeViewer.svelte';
  
  // Selected tab (pseudocode or implementation)
  let selectedTab = 'pseudocode';
  
  // Handle tab change
  function selectTab(tab: string) {
    selectedTab = tab;
  }
</script>

<div class="code-tabs-container">
  <div class="tab-header">
    <button 
      class="tab-button" 
      class:active={selectedTab === 'pseudocode'} 
      on:click={() => selectTab('pseudocode')}
    >
      Pseudocode
    </button>
    <button 
      class="tab-button" 
      class:active={selectedTab === 'implementation'} 
      on:click={() => selectTab('implementation')}
    >
      Implementation
    </button>
  </div>
  
  <div class="tab-content">
    {#if selectedTab === 'pseudocode'}
      <div class="pseudocode-container">
        <PseudocodeViewer />
      </div>
    {:else}
      <div class="implementation-container">
        <CodeViewer />
      </div>
    {/if}
  </div>
</div>

<style>
  .code-tabs-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
  
  .tab-header {
    display: flex;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .tab-button {
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    color: #64748b;
    transition: all 0.2s;
  }
  
  .tab-button:hover {
    color: #334155;
  }
  
  .tab-button.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }
  
  .tab-content {
    padding: 0.5rem 0;
  }
  
  .pseudocode-container, .implementation-container {
    background-color: #f8fafc;
    border-radius: 8px;
  }
</style> 