import type { Algorithm, AlgorithmStep } from '../types.js';

// Generate a step for the visualization
function createStep(
  array: number[],
  indices: number[] = [],
  lines: number[] = [],
  description: string = ''
): AlgorithmStep {
  return {
    data: [...array],
    highlightIndices: indices,
    highlightLines: lines,
    description,
  };
}

function* insertionSortAlgorithm(
  inputArray: number[],
  workingArray: number[] = [...inputArray]
): Generator<AlgorithmStep> {
  const n = workingArray.length;
  
  // Display initial state
  yield createStep(
    workingArray,
    [],
    [1],
    `Starting Insertion Sort on ${n} elements`
  );
  
  // First element is always considered sorted
  yield createStep(
    workingArray,
    [0],
    [4, 5],
    `Element at index 0 (${workingArray[0]}) is initially considered sorted`
  );
  
  // Outer loop - iterates through unsorted elements
  for (let i = 1; i < n; i++) {
    // Current element to be inserted into the sorted region
    const key = workingArray[i];
    
    yield createStep(
      workingArray,
      [i],
      [9, 10],
      `Inserting element ${key} from index ${i} into the sorted portion`
    );
    
    // Inner loop - shift elements of the sorted region that are greater than key
    let j = i - 1;
    
    // Highlight the sorted region
    yield createStep(
      workingArray,
      Array.from({ length: i }, (_, idx) => idx),
      [15, 16],
      `Sorted region: [${workingArray.slice(0, i).join(', ')}]`
    );
    
    while (j >= 0 && workingArray[j] > key) {
      // Compare current key with sorted elements
      yield createStep(
        workingArray,
        [j, i],
        [19, 20],
        `${workingArray[j]} > ${key}, shifting ${workingArray[j]} to the right`
      );
      
      // Shift elements
      workingArray[j + 1] = workingArray[j];
      
      // Show after shifting
      yield createStep(
        workingArray,
        [j + 1],
        [22, 23],
        `Shifted ${workingArray[j + 1]} to index ${j + 1}`
      );
      
      j--;
    }
    
    // Place key in its correct position
    workingArray[j + 1] = key;
    
    yield createStep(
      workingArray,
      [j + 1],
      [28, 29],
      `Placed ${key} at its correct position (index ${j + 1})`
    );
    
    // Show the array after inserting this element
    yield createStep(
      workingArray,
      Array.from({ length: i + 1 }, (_, idx) => idx),
      [32, 33],
      `After inserting ${key}: [${workingArray.slice(0, i + 1).join(', ')}]`
    );
  }
  
  // Show the final sorted array
  yield createStep(
    workingArray,
    Array.from({ length: n }, (_, idx) => idx),
    [37],
    `Array is now fully sorted`
  );
  
  // Copy the sorted array back to the input array
  for (let i = 0; i < n; i++) {
    inputArray[i] = workingArray[i];
  }
}

export const insertionSort: Algorithm = {
  name: 'Insertion Sort',
  category: 'sorting',
  run: function* (arr: number[]) {
    const workingArray = [...arr];
    yield* insertionSortAlgorithm(arr, workingArray);
  },
  pseudocode: [
    'function insertionSort(array):',
    '  n = length(array)',
    '  ',
    '  // Start from the second element (index 1)',
    '  for i = 1 to n-1:',
    '    // Element to be inserted into sorted region',
    '    key = array[i]',
    '    ',
    '    // Move elements that are greater than key',
    '    // to one position ahead of their current position',
    '    j = i - 1',
    '    while j >= 0 and array[j] > key:',
    '      array[j + 1] = array[j]',
    '      j = j - 1',
    '    ',
    '    // Insert the key at its correct position',
    '    array[j + 1] = key',
  ],
  implementation: `function insertionSort(array) {
  const n = array.length;
  
  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    
    // Move elements greater than key to one position ahead
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
    }
    
    // Place key at its correct position
    array[j + 1] = key;
  }
  
  return array;
}`,
  implementationLanguage: 'javascript',
  description:
    'Insertion Sort builds the sorted array one element at a time by comparing each new element with ' +
    'the already sorted elements and inserting it at the correct position. This algorithm is efficient ' +
    'for small data sets and nearly sorted arrays, with a best-case time complexity of O(n) when the ' +
    'array is already sorted. It operates by dividing the array into sorted and unsorted regions, ' +
    'gradually expanding the sorted region by inserting unsorted elements at their proper position. ' +
    'Insertion Sort is stable (preserving the relative order of equal elements), adaptive (performs better ' +
    'on partially sorted arrays), and works well for continuous input streams where new elements can be ' +
    'efficiently inserted into an already sorted sequence. Despite its O(n²) average-case complexity, ' +
    'its simplicity and low overhead make it practical for small arrays or as part of more complex algorithms.',
  timeComplexity: 'Best: O(n), Average/Worst: O(n²)',
  spaceComplexity: 'O(1)',
  defaultInput: [38, 27, 43, 3, 9, 82, 10],
}; 