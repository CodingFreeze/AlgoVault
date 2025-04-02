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

function* quickSortAlgorithm(
  inputArray: number[],
  startIdx: number = 0,
  endIdx: number = inputArray.length - 1,
  workingArray: number[] = [...inputArray]
): Generator<AlgorithmStep> {
  // Base case: If the partition size is 1 or less, it's already sorted
  if (startIdx >= endIdx) {
    if (startIdx === endIdx) {
      yield createStep(
        workingArray,
        [startIdx],
        [1, 2],
        `Base case: partition of size 1 is already sorted`
      );
    }
    return;
  }

  // Choose the pivot as the last element
  const pivotIdx = endIdx;
  const pivotValue = workingArray[pivotIdx];

  yield createStep(
    workingArray,
    [pivotIdx],
    [5, 6],
    `Choosing pivot: ${pivotValue} at index ${pivotIdx}`
  );

  // Partition the array
  let i = startIdx - 1; // Index of smaller element

  for (let j = startIdx; j < endIdx; j++) {
    yield createStep(
      workingArray,
      [j, pivotIdx, i + 1],
      [11, 12],
      `Comparing element at index ${j} (${workingArray[j]}) with pivot ${pivotValue}`
    );

    if (workingArray[j] <= pivotValue) {
      i++;
      
      // Swap elements if needed
      if (i !== j) {
        yield createStep(
          workingArray,
          [i, j],
          [14, 15, 16],
          `${workingArray[j]} <= ${pivotValue}, swapping elements at indices ${i} and ${j}`
        );

        // Swap elements
        [workingArray[i], workingArray[j]] = [workingArray[j], workingArray[i]];
      } else {
        yield createStep(
          workingArray,
          [i],
          [14, 15, 16],
          `${workingArray[j]} <= ${pivotValue}, element already in position`
        );
      }
    } else {
      yield createStep(
        workingArray,
        [j],
        [19],
        `${workingArray[j]} > ${pivotValue}, no swap needed`
      );
    }
  }

  // Place pivot in its final position
  i++;
  yield createStep(
    workingArray,
    [i, pivotIdx],
    [24, 25, 26],
    `Moving pivot to its correct position: swapping elements at indices ${i} and ${pivotIdx}`
  );

  // Swap pivot to its final position
  [workingArray[i], workingArray[pivotIdx]] = [workingArray[pivotIdx], workingArray[i]];

  // Now, pivot is at position i
  const newPivotIdx = i;

  yield createStep(
    workingArray,
    [newPivotIdx],
    [32],
    `Pivot ${pivotValue} is now at its correct position ${newPivotIdx}`
  );

  // Recursively sort the partitions
  if (startIdx < newPivotIdx - 1) {
    yield createStep(
      workingArray,
      Array.from({ length: newPivotIdx - startIdx }, (_, idx) => startIdx + idx),
      [35],
      `Sorting left partition [${startIdx}...${newPivotIdx - 1}]`
    );
    yield* quickSortAlgorithm(inputArray, startIdx, newPivotIdx - 1, workingArray);
  }

  if (newPivotIdx + 1 < endIdx) {
    yield createStep(
      workingArray,
      Array.from({ length: endIdx - newPivotIdx }, (_, idx) => newPivotIdx + 1 + idx),
      [40],
      `Sorting right partition [${newPivotIdx + 1}...${endIdx}]`
    );
    yield* quickSortAlgorithm(inputArray, newPivotIdx + 1, endIdx, workingArray);
  }

  // Copy the current partition back to the input array
  for (let idx = startIdx; idx <= endIdx; idx++) {
    inputArray[idx] = workingArray[idx];
  }

  // Show sorted partition
  if (startIdx === 0 && endIdx === workingArray.length - 1) {
    yield createStep(
      workingArray,
      Array.from({ length: workingArray.length }, (_, idx) => idx),
      [45],
      `Array is now fully sorted`
    );
  }
}

export const quickSort: Algorithm = {
  name: 'Quick Sort',
  category: 'sorting',
  run: function* (arr: number[]) {
    const workingArray = [...arr];
    yield* quickSortAlgorithm(arr, 0, arr.length - 1, workingArray);
  },
  pseudocode: [
    'function quickSort(array, low, high):',
    '  if low < high then',
    '    // pi is partitioning index',
    '    pi = partition(array, low, high)',
    '    ',
    '    // Recursively sort elements before and after the partition',
    '    quickSort(array, low, pi - 1)',
    '    quickSort(array, pi + 1, high)',
    '',
    'function partition(array, low, high):',
    '  // Choose the rightmost element as pivot',
    '  pivot = array[high]',
    '  ',
    '  // Index of smaller element',
    '  i = low - 1',
    '  ',
    '  for j = low to high-1:',
    '    // If current element is smaller than or equal to pivot',
    '    if array[j] <= pivot then',
    '      i = i + 1',
    '      swap array[i] and array[j]',
    '',
    '  // Swap the pivot element with the element at i+1',
    '  // This puts pivot in its correct position',
    '  swap array[i + 1] and array[high]',
    '  return i + 1',
  ],
  implementation: `function quickSort(array, low = 0, high = array.length - 1) {
  if (low < high) {
    const pi = partition(array, low, high);
    quickSort(array, low, pi - 1);
    quickSort(array, pi + 1, high);
  }
  return array;
}

function partition(array, low, high) {
  const pivot = array[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (array[j] <= pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  return i + 1;
}`,
  implementationLanguage: 'javascript',
  description:
    'Quick Sort is a highly efficient divide-and-conquer algorithm that selects a "pivot" element ' +
    'and partitions the array around it. Elements smaller than the pivot go to the left, while larger ' +
    'elements go to the right. This process recursively continues on each partition until the entire ' +
    'array is sorted. With an average time complexity of O(n log n), Quick Sort typically outperforms ' +
    'other O(n log n) algorithms like Merge Sort in practice due to its cache efficiency and lower ' +
    'constant factors. However, its performance can degrade to O(n²) in worst-case scenarios (such as ' +
    'when the array is already sorted and the pivot selection is poor). Quick Sort is an in-place ' +
    'algorithm with low memory requirements, but unlike Merge Sort, it is not stable and may change ' +
    'the relative order of equal elements.',
  timeComplexity: 'Average: O(n log n), Worst: O(n²)',
  spaceComplexity: 'O(log n)',
  defaultInput: [38, 27, 43, 3, 9, 82, 10],
}; 