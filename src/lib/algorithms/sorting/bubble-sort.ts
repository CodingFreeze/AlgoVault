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

function* bubbleSortAlgorithm(
  inputArray: number[],
  workingArray: number[] = [...inputArray]
): Generator<AlgorithmStep> {
  const n = workingArray.length;
  let swapped = false;
  
  // Display initial state
  yield createStep(
    workingArray,
    [],
    [1],
    `Starting Bubble Sort on ${n} elements`
  );
  
  // Outer loop - each pass places one element in its final position
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    
    yield createStep(
      workingArray,
      [],
      [6, 7],
      `Starting pass ${i + 1} of ${n - 1}`
    );
    
    // Inner loop - compare adjacent elements and swap if necessary
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight current comparison
      yield createStep(
        workingArray,
        [j, j + 1],
        [12, 13],
        `Comparing ${workingArray[j]} and ${workingArray[j + 1]}`
      );
      
      // If the elements are in the wrong order, swap them
      if (workingArray[j] > workingArray[j + 1]) {
        swapped = true;
        
        // Highlight swap
        yield createStep(
          workingArray,
          [j, j + 1],
          [17, 18, 19],
          `${workingArray[j]} > ${workingArray[j + 1]}, swapping elements`
        );
        
        // Perform the swap
        [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];
        
        // Show the result after swapping
        yield createStep(
          workingArray,
          [j, j + 1],
          [20, 21],
          `After swap: ${workingArray[j]} and ${workingArray[j + 1]}`
        );
      } else {
        yield createStep(
          workingArray,
          [j, j + 1],
          [24, 25],
          `${workingArray[j]} <= ${workingArray[j + 1]}, no swap needed`
        );
      }
    }
    
    // After each pass, the largest element is at the end
    yield createStep(
      workingArray,
      [n - i - 1],
      [30],
      `Element ${workingArray[n - i - 1]} is now in its final position`
    );
    
    // If no swaps were made, the array is already sorted
    if (!swapped) {
      yield createStep(
        workingArray,
        Array.from({ length: n }, (_, idx) => idx),
        [34, 35],
        `No swaps made in this pass, array is already sorted`
      );
      break;
    }
  }
  
  // Show the final sorted array
  yield createStep(
    workingArray,
    Array.from({ length: n }, (_, idx) => idx),
    [40],
    `Array is now fully sorted`
  );
  
  // Copy the sorted array back to the input array
  for (let i = 0; i < n; i++) {
    inputArray[i] = workingArray[i];
  }
}

export const bubbleSort: Algorithm = {
  name: 'Bubble Sort',
  category: 'sorting',
  run: function* (arr: number[]) {
    const workingArray = [...arr];
    yield* bubbleSortAlgorithm(arr, workingArray);
  },
  pseudocode: [
    'function bubbleSort(array):',
    '  n = length(array)',
    '  ',
    '  // Outer loop: iterate through the entire array',
    '  for i = 0 to n-2:',
    '    swapped = false',
    '    ',
    '    // Inner loop: compare adjacent elements',
    '    for j = 0 to n-i-2:',
    '      // If elements are in wrong order, swap them',
    '      if array[j] > array[j+1] then',
    '        swap array[j] and array[j+1]',
    '        swapped = true',
    '    ',
    '    // If no elements were swapped in this pass,',
    '    // the array is already sorted',
    '    if not swapped then',
    '      break',
  ],
  implementation: `function bubbleSort(array) {
  const n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    // Last i elements are already in place
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (array[j] > array[j + 1]) {
        // Swap them if they are in wrong order
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
      }
    }
    
    // If no swapping occurred in this pass, array is sorted
    if (!swapped) break;
  }
  
  return array;
}`,
  implementationLanguage: 'javascript',
  description:
    'Bubble Sort is one of the simplest sorting algorithms that repeatedly steps through the list, ' +
    'compares adjacent elements, and swaps them if they are in the wrong order. The algorithm gets its name ' +
    'because smaller elements "bubble" to the top of the list with each iteration. While conceptually simple, ' +
    'Bubble Sort is primarily used for educational purposes due to its inefficiency with large datasets. Its ' +
    'average and worst-case time complexity is O(n²), making it impractical for real-world applications with ' +
    'significant data. However, it has the advantage of being able to detect if the list is already sorted ' +
    '(best-case O(n) with optimization) and requires minimal extra memory space.',
  timeComplexity: 'Best: O(n), Average/Worst: O(n²)',
  spaceComplexity: 'O(1)',
  defaultInput: [38, 27, 43, 3, 9, 82, 10],
}; 
