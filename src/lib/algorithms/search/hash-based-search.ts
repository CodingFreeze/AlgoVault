import type { Algorithm, AlgorithmStep } from '../types.js';

// Generate a step for the visualization
function createStep(
  array: number[],
  hashMap: Record<number, number> = {},
  highlightIndices: number[] = [],
  lines: number[] = [],
  description: string = ''
): AlgorithmStep {
  // Add hashMap to the custom data field
  return {
    data: [...array],
    highlightIndices,
    highlightLines: lines,
    description,
    custom: { hashMap }
  };
}

function* hashBasedSearchAlgorithm(
  array: number[],
  target: number
): Generator<AlgorithmStep, number, unknown> {
  yield createStep(
    array,
    {},
    [],
    [0],
    `Starting hash-based search for value ${target} in the array`
  );
  
  // Step 1: Create a hash map
  const hashMap: Record<number, number> = {};
  
  yield createStep(
    array,
    hashMap,
    [],
    [1, 2],
    `Creating a hash map to store array elements and their indices`
  );
  
  // Step 2: Populate the hash map
  for (let i = 0; i < array.length; i++) {
    // Highlight the current element being added to hash map
    yield createStep(
      array,
      {...hashMap},
      [i],
      [5, 6],
      `Adding element ${array[i]} at index ${i} to the hash map`
    );
    
    // Add to hash map
    hashMap[array[i]] = i;
  }
  
  yield createStep(
    array,
    hashMap,
    [],
    [9],
    `Hash map created: ${JSON.stringify(hashMap)}`
  );
  
  // Step 3: Look up the target in the hash map
  yield createStep(
    array,
    hashMap,
    [],
    [11, 12],
    `Looking up target ${target} in the hash map`
  );
  
  if (target in hashMap) {
    const index = hashMap[target];
    
    yield createStep(
      array,
      hashMap,
      [index],
      [14, 15],
      `Found target ${target} at index ${index}!`
    );
    
    return index;
  }
  
  // If we reach here, the element was not found
  yield createStep(
    array,
    hashMap,
    [],
    [19, 20],
    `Target ${target} not found in the array`
  );
  
  return -1;
}

export const hashBasedSearch: Algorithm = {
  name: 'Hash-based Search',
  category: 'search',
  description: 
    'Hash-based Search leverages a hash map (dictionary) data structure to achieve average O(1) time ' +
    'complexity for lookups. The algorithm works in two phases: first, it builds a hash map where keys ' +
    'are the array elements and values are their indices; second, it simply looks up the target value ' +
    'in this hash map. This approach significantly outperforms both Linear Search and Binary Search for ' +
    'one-time lookups in unsorted data. However, the trade-off is increased memory usage (O(n) space ' +
    'complexity) and the initial overhead of building the hash map. Hash-based Search is ideal when ' +
    'multiple lookups are needed on the same dataset, effectively amortizing the initial cost of ' +
    'creating the hash map. It works best with unique values; for duplicates, it typically returns ' +
    'the index of the last occurrence. Unlike Binary Search, it doesn\'t require the data to be sorted, ' +
    'making it versatile for various datasets.',
  timeComplexity: 'Average: O(1), Worst: O(n)',
  spaceComplexity: 'O(n)',
  pseudocode: [
    'function hashBasedSearch(array, target):',
    '  // Create a hash map to store values and their indices',
    '  hashMap = new HashMap()',
    '',
    '  // Populate the hash map with array elements',
    '  for i from 0 to array.length - 1:',
    '    hashMap[array[i]] = i',
    '',
    '  // Look up the target in the hash map',
    '  if target in hashMap:',
    '    return hashMap[target]',
    '',
    '  // Target not found',
    '  return -1'
  ],
  implementation: `function hashBasedSearch(array: number[], target: number): number {
  // Create a hash map to store values and their indices
  const hashMap: Record<number, number> = {};
  
  // Populate the hash map with array elements
  for (let i = 0; i < array.length; i++) {
    hashMap[array[i]] = i;
  }
  
  // Look up the target in the hash map
  if (target in hashMap) {
    return hashMap[target];
  }
  
  // Target not found
  return -1;
}`,
  implementationLanguage: 'typescript',
  run: (input: { array: number[]; target: number }) => {
    const { array, target } = input;
    return hashBasedSearchAlgorithm(array, target);
  },
  defaultInput: { array: [42, 23, 8, 16, 4, 15], target: 16 }
}; 