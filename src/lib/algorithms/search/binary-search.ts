import type { Algorithm, AlgorithmStep } from '../types.js';

// Generate a step for the visualization
function createStep(
  array: number[],
  left: number = 0,
  right: number = array.length - 1,
  mid: number | undefined = undefined,
  highlightIndices: number[] = [],
  lines: number[] = [],
  description: string = ''
): AlgorithmStep {
  return {
    data: [...array],
    pointer: mid,
    highlightIndices,
    highlightLines: lines,
    description,
  };
}

function* binarySearchAlgorithm(
  inputArray: number[],
  target: number
): Generator<AlgorithmStep, number, unknown> {
  // Create a working copy of the array
  const array = [...inputArray];
  
  // Sort the array first, since binary search requires a sorted array
  array.sort((a, b) => a - b);
  
  // Update the input array with the sorted version
  for (let i = 0; i < array.length; i++) {
    inputArray[i] = array[i];
  }
  
  yield createStep(
    array,
    0,
    array.length - 1,
    undefined,
    Array.from({ length: array.length }, (_, i) => i),
    [0],
    `Array has been sorted for binary search: [${array.join(', ')}]`
  );
  
  yield createStep(
    array,
    0,
    array.length - 1,
    undefined,
    [],
    [1],
    `Starting binary search for value ${target}`
  );
  
  let left = 0;
  let right = array.length - 1;
  
  yield createStep(
    array,
    left,
    right,
    undefined,
    [left, right],
    [2, 3],
    `Initial search range: left=${left}, right=${right}`
  );
  
  while (left <= right) {
    // Calculate the middle index
    const mid = Math.floor((left + right) / 2);
    
    yield createStep(
      array,
      left,
      right,
      mid,
      [left, mid, right],
      [6, 7],
      `Checking middle element at index ${mid}: ${array[mid]}`
    );
    
    // Check if we found the target
    if (array[mid] === target) {
      yield createStep(
        array,
        left,
        right,
        mid,
        [mid],
        [10, 11],
        `Found target ${target} at index ${mid}!`
      );
      return mid;
    }
    
    // If target is greater, ignore left half
    if (array[mid] < target) {
      yield createStep(
        array,
        left,
        right,
        mid,
        [mid, ...Array.from({ length: mid - left + 1 }, (_, i) => left + i)],
        [15, 16],
        `${array[mid]} < ${target}, eliminating left half`
      );
      left = mid + 1;
      
      yield createStep(
        array,
        left,
        right,
        undefined,
        [left, right],
        [17],
        `New search range: [${left}...${right}]`
      );
    }
    // If target is smaller, ignore right half
    else {
      yield createStep(
        array,
        left,
        right,
        mid,
        [mid, ...Array.from({ length: right - mid + 1 }, (_, i) => mid + i)],
        [21, 22],
        `${array[mid]} > ${target}, eliminating right half`
      );
      right = mid - 1;
      
      yield createStep(
        array,
        left,
        right,
        undefined,
        [left, right],
        [23],
        `New search range: [${left}...${right}]`
      );
    }
  }
  
  // If we reach here, the element was not found
  yield createStep(
    array,
    left,
    right,
    undefined,
    [],
    [28, 29],
    `Target ${target} not found in the array`
  );
  
  return -1;
}

export const binarySearch: Algorithm = {
  name: 'Binary Search',
  category: 'search',
  description: 
    'Binary Search is a highly efficient algorithm that locates an element in a sorted array by ' +
    'repeatedly dividing the search interval in half. With each step, it compares the target value ' +
    'to the middle element of the current range, eliminating half of the remaining elements based ' +
    'on the comparison. This divide-and-conquer approach yields a logarithmic time complexity of ' +
    'O(log n), making it significantly faster than Linear Search for large datasets. For example, ' +
    'finding an element in a sorted array of 1 million items requires at most 20 comparisons. The ' +
    'key prerequisite is that the array must be sorted beforehand, which can be a limitation if the ' +
    'array changes frequently. While Binary Search is extremely efficient for random access data ' +
    'structures like arrays, it cannot be directly applied to linked lists or other sequential access ' +
    'structures due to its reliance on direct access to the middle element at each step. This algorithm ' +
    'demonstrates how exploiting ordered data can dramatically improve search efficiency.',
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1)',
  pseudocode: [
    'function binarySearch(array, target):',
    '  // Ensure array is sorted',
    '  array = sort(array)',
    '',
    '  left = 0',
    '  right = array.length - 1',
    '',
    '  while left <= right:',
    '    mid = floor((left + right) / 2)',
    '',
    '    // Check if target is at mid',
    '    if array[mid] == target:',
    '      return mid',
    '',
    '    // If target is greater, ignore left half',
    '    if array[mid] < target:',
    '      left = mid + 1',
    '',
    '    // If target is smaller, ignore right half',
    '    else:',
    '      right = mid - 1',
    '',
    '  // Target not found',
    '  return -1'
  ],
  implementation: `function binarySearch(array: number[], target: number): number {
  // Binary search requires a sorted array
  array = [...array].sort((a, b) => a - b);
  
  let left = 0;
  let right = array.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (array[mid] === target) {
      return mid;
    }
    
    if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
  implementationLanguage: 'typescript',
  run: (input: { array: number[]; target: number }) => {
    const { array, target } = input;
    return binarySearchAlgorithm(array, target);
  },
  defaultInput: { array: [4, 8, 15, 16, 23, 42], target: 15 }
}; 