<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { currentStep, animationSpeed } from '$lib/stores/algorithm';
  import { calculateArrayItemPosition, animateArraySwap } from '$lib/utils/visualization';
  
  // Array item styling - make bars narrower if needed
  const BASE_ITEM_WIDTH = 40;
  const ITEM_HEIGHT = 100;
  const BOTTOM_PADDING = 60; // Ensure space at bottom
  
  let containerElement: HTMLDivElement;
  let arrayElements: HTMLDivElement[] = [];
  let prevArray: number[] | null = null;
  let dynamicItemWidth = BASE_ITEM_WIDTH;
  
  // Handle regular numeric arrays and text visualization
  $: customData = $currentStep?.custom || null;
  $: isSubstringSearch = customData?.displayMode === 'substring';
  $: textData = isSubstringSearch ? { text: customData?.text || '', pattern: customData?.pattern || '', textIndex: customData?.textIndex || 0, patternIndex: customData?.patternIndex || 0 } : null;
  
  $: array = ($currentStep?.data as number[]) || [];
  $: highlightIndices = $currentStep?.highlightIndices || [];
  $: speed = $animationSpeed;
  
  // Calculate the animation duration based on speed
  $: animationDuration = Math.max(600, 1000 / speed);
  
  onMount(() => {
    // Resize observer to handle responsive layout
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        positionArrayItems();
      }
    });
    
    if (containerElement) {
      resizeObserver.observe(containerElement);
    }
    
    return () => {
      if (containerElement) {
        resizeObserver.unobserve(containerElement);
      }
    };
  });
  
  afterUpdate(() => {
    if (array.length > 0) {
      // If array elements have been updated, reposition them
      if (arrayElements.length !== array.length) {
        // Wait for DOM to update with new elements
        setTimeout(positionArrayItems, 0);
      } else {
        // Check if array has changed (from previous step)
        if (prevArray && JSON.stringify(prevArray) !== JSON.stringify(array)) {
          const changes = findChanges(prevArray, array);
          if (changes.length === 2) {
            // Animate swap with proper duration based on speed
            animateArraySwap(arrayElements, changes[0], changes[1], animationDuration);
          } else {
            // Just reposition with a smooth transition
            positionArrayItems(true);
          }
        } else {
          positionArrayItems();
        }
      }
    }
    
    prevArray = [...array];
  });
  
  function positionArrayItems(animate = false) {
    if (!containerElement) return;
    
    const containerWidth = containerElement.clientWidth;
    
    // Adjust item width and add spacing between items
    const spacing = 5; // Add spacing between bars
    const leftPadding = 10; // Reduced padding from the left edge
    
    // Special handling for substring search visualization
    if (isSubstringSearch) {
      dynamicItemWidth = Math.min(30, Math.floor((containerWidth * 0.92) / array.length));
      
      // For text visualization, position each character as a cell
      arrayElements.forEach((el, i) => {
        // Apply smooth transition for repositioning if animate is true
        if (animate) {
          el.style.transition = `transform ${animationDuration/3000}s ease-in-out, background-color 0.3s ease`;
        } else {
          el.style.transition = 'background-color 0.3s ease';
        }
        
        // Position elements in a grid
        const x = leftPadding + (i * (dynamicItemWidth + 2));
        el.style.transform = `translateX(${x}px)`;
        el.style.width = `${dynamicItemWidth}px`;
        el.style.height = `${dynamicItemWidth}px`;
        
        // Get the character
        const valueEl = el.querySelector('.value') as HTMLElement;
        if (valueEl) {
          valueEl.style.fontSize = '14px';
          valueEl.style.transform = 'none';
          valueEl.style.position = 'static';
        }
      });
      
      return;
    }
    
    // For regular numeric arrays
    // Adjust item width for large arrays
    if (array.length > 15) {
      // Calculate maximum width that will fit all bars with spacing
      const availableWidth = containerWidth * 0.95 - leftPadding;
      dynamicItemWidth = Math.max(10, Math.min(BASE_ITEM_WIDTH, Math.floor((availableWidth - (spacing * (array.length - 1))) / array.length)));
    } else {
      dynamicItemWidth = BASE_ITEM_WIDTH;
    }
    
    // Start from the left with padding
    const startX = leftPadding;
    
    arrayElements.forEach((el, i) => {
      // Position each element with adjusted width and spacing
      const x = startX + (i * (dynamicItemWidth + spacing));
      
      // Apply smooth transition for repositioning if animate is true
      if (animate) {
        el.style.transition = `transform ${animationDuration/3000}s ease-in-out, height ${animationDuration/3000}s ease-in-out`;
      } else {
        el.style.transition = 'none';
      }
      
      el.style.transform = `translateX(${x}px)`;
      el.style.width = `${dynamicItemWidth}px`;
      
      // Scale height based on value, but limit maximum height
      const maxValue = Math.max(...array);
      const minValue = Math.min(...array);
      const range = maxValue - minValue;
      
      // Limit height to avoid overflow
      const maxHeight = containerElement.clientHeight - BOTTOM_PADDING;
      const normalizedHeight = range > 0 
        ? ((array[i] - minValue) / range) * 0.7 + 0.2 // Min height of 20%, max 90%
        : 0.5; // Default to 50% height if all values are the same
      
      const scaledHeight = Math.min(normalizedHeight * ITEM_HEIGHT, maxHeight);
      el.style.height = `${scaledHeight}px`;
      
      // Ensure value is visible for short bars
      const valueEl = el.querySelector('.value') as HTMLElement;
      if (valueEl) {
        if (scaledHeight < 30) {
          valueEl.style.position = 'absolute';
          valueEl.style.top = '-20px';
          valueEl.style.backgroundColor = 'transparent';
          valueEl.style.boxShadow = 'none';
          valueEl.style.border = 'none';
          valueEl.style.textShadow = '0px 0px 2px white, 0px 0px 3px white';
        } else {
          valueEl.style.position = 'static';
          valueEl.style.top = 'auto';
          valueEl.style.backgroundColor = 'transparent';
          valueEl.style.boxShadow = 'none';
          valueEl.style.border = 'none';
          valueEl.style.textShadow = '0px 0px 2px white, 0px 0px 3px white';
        }
        
        // Handle long values with narrow bars
        if (dynamicItemWidth < 30) {
          valueEl.style.fontSize = '10px';
          valueEl.style.transform = 'rotate(-90deg)';
          valueEl.style.whiteSpace = 'nowrap';
          valueEl.style.transformOrigin = 'center';
          valueEl.style.width = 'auto';
          valueEl.style.height = 'auto';
        } else {
          valueEl.style.fontSize = '12px';
          valueEl.style.transform = 'none';
          valueEl.style.whiteSpace = 'normal';
        }
      }
    });
    
    // Remove transitions after a short delay
    if (animate) {
      setTimeout(() => {
        arrayElements.forEach(el => {
          el.style.transition = 'none';
        });
      }, animationDuration/2);
    }
  }
  
  function findChanges(oldArr: number[], newArr: number[]): number[] {
    if (oldArr.length !== newArr.length) return [];
    
    const changes: number[] = [];
    
    for (let i = 0; i < oldArr.length; i++) {
      if (oldArr[i] !== newArr[i]) {
        changes.push(i);
      }
    }
    
    return changes;
  }
</script>

<div 
  class="array-visualizer" 
  class:substring-mode={isSubstringSearch}
  bind:this={containerElement}
>
  {#if isSubstringSearch && textData}
    <!-- Substring search visualization - text characters -->
    <div class="substring-container">
      <div class="text-info">
        <span class="label">Text:</span>
        <div class="text-display">
          {#each textData.text.split('') as char, i}
            <div 
              class="array-item text-item" 
              class:active={i === textData.textIndex}
              class:highlighted={highlightIndices.includes(i)}
              bind:this={arrayElements[i]}
            >
              <div class="value">{char}</div>
              <div class="index">{i}</div>
            </div>
          {/each}
        </div>
      </div>
      
      <div class="pattern-info">
        <span class="label">Pattern:</span>
        <div class="pattern-display">
          {#each textData.pattern.split('') as char, i}
            <div class="pattern-item" class:active={i === textData.patternIndex}>
              <div class="value">{char}</div>
              <div class="index">{i}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <!-- Regular array visualization -->
    {#each array as value, i}
      <div 
        class="array-item" 
        class:highlighted={highlightIndices.includes(i)}
        bind:this={arrayElements[i]}
      >
        <div class="value">{value}</div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .array-visualizer {
    position: relative;
    width: 100%;
    height: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
  }
  
  .array-visualizer.substring-mode {
    align-items: flex-start;
    justify-content: center;
    padding: 30px 20px;
  }
  
  .substring-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 50px;
  }
  
  .text-info, .pattern-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .label {
    font-weight: bold;
    font-size: 16px;
    color: #4b5563;
  }
  
  .text-display, .pattern-display {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
  }
  
  .text-item, .pattern-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .text-item.active, .pattern-item.active {
    background-color: #dbeafe;
    border-color: #3b82f6;
  }
  
  .index {
    position: absolute;
    top: -18px;
    font-size: 10px;
    color: #64748b;
  }
  
  .array-item {
    position: absolute;
    bottom: 50px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    background-color: #3498db;
    border-radius: 4px 4px 0 0;
    will-change: transform, height;
    z-index: 1;
    overflow: visible;
    border: 1px solid #2980b9;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .array-item.highlighted {
    background-color: #e74c3c;
    box-shadow: 0 0 10px rgba(231, 76, 60, 0.7);
    z-index: 10;
    border: 1px solid #c0392b;
  }
  
  .array-item.animating {
    z-index: 20;
    background-color: #f39c12;
    border: 1px solid #d35400;
  }
  
  .array-item.highlighted .value {
    font-weight: 900;
    text-shadow: 0px 0px 2px white, 0px 0px 4px white;
  }
  
  .value {
    padding: 4px;
    font-size: 12px;
    color: black;
    font-weight: bold;
    min-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: transparent;
    border-radius: 3px;
    margin: 2px;
    text-shadow: 0px 0px 2px white, 0px 0px 3px white;
    /* Better anti-aliasing for text */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style> 
