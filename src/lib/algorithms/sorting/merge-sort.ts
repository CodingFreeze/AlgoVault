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

function* mergeSortAlgorithm(
  inputArray: number[],
  startIdx: number = 0,
  endIdx: number = inputArray.length - 1,
  workingArray: number[] = [...inputArray]
): Generator<AlgorithmStep> {
  // Base case: if the array has 1 or 0 elements, it's already sorted
  if (startIdx >= endIdx) {
    yield createStep(
      workingArray,
      [startIdx],
      [1, 2],
      `Base case: subarray of size 1 or less is already sorted`
    );
    return;
  }

  // Find the middle of the array
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  yield createStep(
    workingArray,
    [startIdx, middleIdx, endIdx],
    [5, 6],
    `Dividing array at index ${middleIdx}`
  );

  // Recursively sort the left half
  yield createStep(
    workingArray,
    Array.from({ length: middleIdx - startIdx + 1 }, (_, i) => startIdx + i),
    [9],
    `Sorting left half [${startIdx}...${middleIdx}]`
  );
  yield* mergeSortAlgorithm(inputArray, startIdx, middleIdx, workingArray);

  // Recursively sort the right half
  yield createStep(
    workingArray,
    Array.from({ length: endIdx - middleIdx }, (_, i) => middleIdx + 1 + i),
    [12],
    `Sorting right half [${middleIdx + 1}...${endIdx}]`
  );
  yield* mergeSortAlgorithm(inputArray, middleIdx + 1, endIdx, workingArray);

  // Create temporary arrays for merging
  const leftArray = workingArray.slice(startIdx, middleIdx + 1);
  const rightArray = workingArray.slice(middleIdx + 1, endIdx + 1);

  let i = 0; // Index for left array
  let j = 0; // Index for right array
  let k = startIdx; // Index for merged array

  // Compare elements from both arrays and merge them in sorted order
  while (i < leftArray.length && j < rightArray.length) {
    yield createStep(
      workingArray,
      [startIdx + i, middleIdx + 1 + j],
      [23, 24],
      `Comparing ${leftArray[i]} and ${rightArray[j]}`
    );

    if (leftArray[i] <= rightArray[j]) {
      workingArray[k] = leftArray[i];
      yield createStep(
        workingArray,
        [k],
        [25, 26],
        `Placing ${leftArray[i]} at position ${k}`
      );
      i++;
    } else {
      workingArray[k] = rightArray[j];
      yield createStep(
        workingArray,
        [k],
        [28, 29],
        `Placing ${rightArray[j]} at position ${k}`
      );
      j++;
    }
    k++;
  }

  // Copy remaining elements from left array, if any
  while (i < leftArray.length) {
    workingArray[k] = leftArray[i];
    yield createStep(
      workingArray,
      [k],
      [34, 35],
      `Copying remaining left element ${leftArray[i]} to position ${k}`
    );
    i++;
    k++;
  }

  // Copy remaining elements from right array, if any
  while (j < rightArray.length) {
    workingArray[k] = rightArray[j];
    yield createStep(
      workingArray,
      [k],
      [41, 42],
      `Copying remaining right element ${rightArray[j]} to position ${k}`
    );
    j++;
    k++;
  }

  // Show the merged result
  yield createStep(
    workingArray,
    Array.from({ length: endIdx - startIdx + 1 }, (_, i) => startIdx + i),
    [47],
    `Merged subarray [${startIdx}...${endIdx}] is now sorted`
  );

  // Copy the merged result back to the input array
  for (let i = startIdx; i <= endIdx; i++) {
    inputArray[i] = workingArray[i];
  }
}

export const mergeSort: Algorithm = {
  name: 'Merge Sort',
  category: 'sorting',
  run: function* (arr: number[]) {
    const workingArray = [...arr];
    yield* mergeSortAlgorithm(arr, 0, arr.length - 1, workingArray);
  },
  pseudocode: [
    'function mergeSort(array, start, end):',
    '  if start >= end then return',
    '',
    '  // Divide the array into two halves',
    '  mid = floor((start + end) / 2)',
    '  mergeSort(array, start, mid)',
    '  mergeSort(array, mid + 1, end)',
    '',
    '  // Merge the sorted halves',
    '  merge(array, start, mid, end)',
    '',
    'function merge(array, start, mid, end):',
    '  leftArr = array[start...mid]',
    '  rightArr = array[mid+1...end]',
    '',
    '  i = 0, j = 0, k = start',
    '',
    '  while i < length(leftArr) and j < length(rightArr):',
    '    if leftArr[i] <= rightArr[j] then',
    '      array[k] = leftArr[i]',
    '      i = i + 1',
    '    else',
    '      array[k] = rightArr[j]',
    '      j = j + 1',
    '    k = k + 1',
    '',
    '  // Copy remaining elements',
    '  while i < length(leftArr):',
    '    array[k] = leftArr[i]',
    '    i = i + 1',
    '    k = k + 1',
    '',
    '  while j < length(rightArr):',
    '    array[k] = rightArr[j]',
    '    j = j + 1',
    '    k = k + 1',
  ],
  implementation: `function mergeSort(array) {
  if (array.length <= 1) return array;
  
  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);
  
  return merge(
    mergeSort(left),
    mergeSort(right)
  );
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  return result
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
}`,
  implementationLanguage: 'javascript',
  description:
    'Merge Sort is a stable, divide-and-conquer algorithm that consistently performs at O(n log n)' + 
    'time complexity. It works by recursively dividing the array into halves until each subarray' + 
    'contains just one element (which is inherently sorted). Then it merges these subarrays back' + 
    'together in sorted order, comparing elements from each half. This algorithm offers predictable' + 
    'performance regardless of the initial order of elements, making it ideal for large datasets where' + 
    'consistent performance is critical. While Merge Sort requires additional memory for the merging process,' + 
    'its stability preserves the relative order of equal elements, which is important for multi-key' + 
    'sorting applications.',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(n)',
  defaultInput: [38, 27, 43, 3, 9, 82, 10],
}; 