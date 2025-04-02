import type { Algorithm, AlgorithmStep } from '../types.js';

// Generate a step for the visualization
function createStep(
  array: number[],
  currentIndex: number | undefined = undefined,
  highlightIndices: number[] = [],
  lines: number[] = [],
  description: string = ''
): AlgorithmStep {
  return {
    data: [...array],
    pointer: currentIndex,
    highlightIndices,
    highlightLines: lines,
    description,
  };
}

function* linearSearchAlgorithm(
  array: number[],
  target: number
): Generator<AlgorithmStep, number, unknown> {
  yield createStep(
    array,
    undefined,
    [],
    [0],
    `Starting linear search for value ${target} in the array`
  );
  
  for (let i = 0; i < array.length; i++) {
    // Highlight the current element being examined
    yield createStep(
      array,
      i,
      [i],
      [3, 4],
      `Checking element at index ${i}: ${array[i]}`
    );
    
    // If the current element is the target
    if (array[i] === target) {
      yield createStep(
        array,
        i,
        [i],
        [7, 8],
        `Found target ${target} at index ${i}!`
      );
      return i;
    }
    
    // Move to the next element
    if (i < array.length - 1) {
      yield createStep(
        array,
        i + 1,
        [],
        [12],
        `Moving to the next element`
      );
    }
  }
  
  // If we reach here, the element was not found
  yield createStep(
    array,
    undefined,
    [],
    [16, 17],
    `Target ${target} not found in the array`
  );
  
  return -1;
}

export const linearSearch: Algorithm = {
  name: 'Linear Search',
  category: 'search',
  description: 
    'Linear Search is the simplest searching algorithm that examines each element in a sequence ' +
    'one-by-one until the target is found or the entire collection is traversed. While not efficient ' +
    'for large datasets with O(n) time complexity, it has several advantages: it works on unsorted ' +
    'data, requires no preprocessing, and is easy to implement. Linear Search is ideal for small ' +
    'arrays or when the search operation is infrequent. It performs best when the target is likely ' +
    'to be at the beginning of the list, and worst when the target is absent or at the end. Unlike ' +
    'more complex algorithms, Linear Search requires minimal extra memory (O(1) space complexity) ' +
    'and can be applied to linked lists and other non-indexed collections where random access is ' +
    'not available.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  pseudocode: [
    'function linearSearch(array, target):',
    '  for i from 0 to array.length - 1:',
    '    // Check if current element is target',
    '    if array[i] == target:',
    '      return i',
    '',
    '  // Target not found',
    '  return -1'
  ],
  implementation: `function linearSearch(array: number[], target: number): number {
  // Iterate through each element in the array
  for (let i = 0; i < array.length; i++) {
    // Check if the current element equals the target
    if (array[i] === target) {
      return i; // Found the target, return its index
    }
  }
  
  // If we reach here, the target was not found
  return -1;
}`,
  implementationLanguage: 'typescript',
  run: (input: { array: number[]; target: number }) => {
    const { array, target } = input;
    return linearSearchAlgorithm(array, target);
  },
  defaultInput: { array: [42, 23, 8, 16, 4, 15], target: 16 }
}; 