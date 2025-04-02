<script lang="ts">
  import { selectedAlgorithm } from '$lib/stores/algorithm';
  import { onMount } from 'svelte';
  import pkg from 'prismjs';
  const { highlight, languages } = pkg;
  import 'prismjs/components/prism-typescript';
  import 'prismjs/components/prism-javascript';
  import 'prismjs/themes/prism.css';
  
  // Store the highlighted code
  let highlightedCode = '';
  
  // Update the highlighted code when the selected algorithm changes
  $: if ($selectedAlgorithm) {
    updateHighlightedCode();
  }
  
  // Function to update the highlighted code
  function updateHighlightedCode() {
    if (!$selectedAlgorithm) return;
    
    const code = $selectedAlgorithm.implementation || '';
    
    // Determine language based on file extension or default to typescript
    const lang = $selectedAlgorithm.implementationLanguage || 'typescript';
    
    // Choose the appropriate Prism language
    const prismLang = lang === 'javascript' ? languages.javascript : languages.typescript;
    
    // Highlight the code
    highlightedCode = highlight(code, prismLang, lang);
  }
  
  // Initialize on mount
  onMount(() => {
    updateHighlightedCode();
  });
</script>

<div class="code-viewer">
  {#if $selectedAlgorithm?.implementation}
    <pre class="language-{$selectedAlgorithm.implementationLanguage || 'typescript'}"><code>{@html highlightedCode}</code></pre>
  {:else}
    <div class="no-code-message">
      <p>Implementation code not available for this algorithm.</p>
    </div>
  {/if}
</div>

<style>
  .code-viewer {
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    overflow-x: auto;
    border-radius: 8px;
    background-color: #f8fafc;
    padding: 1rem;
  }
  
  .no-code-message {
    padding: 1rem;
    color: #64748b;
    font-style: italic;
    text-align: center;
  }
  
  /* Override Prism styles for better readability */
  :global(.code-viewer .token.comment) {
    color: #6c7793;
  }
  
  :global(.code-viewer .token.function) {
    color: #6f42c1;
  }
  
  :global(.code-viewer .token.keyword) {
    color: #d73a49;
  }
  
  :global(.code-viewer .token.string) {
    color: #032f62;
  }
  
  :global(.code-viewer .token.number) {
    color: #005cc5;
  }
</style> 