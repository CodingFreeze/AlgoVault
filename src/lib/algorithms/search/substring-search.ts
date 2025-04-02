import type { Algorithm, AlgorithmStep } from '../types.js';

// Special type for substring search that uses strings instead of numbers
interface SubstringSearchInput {
  text: string;
  pattern: string;
}

// Generate a step for the visualization
function createStep(
  text: string,
  pattern: string,
  textIndex: number = 0,
  patternIndex: number = 0,
  highlightIndices: number[] = [],
  lines: number[] = [],
  description: string = ''
): AlgorithmStep {
  // For substring search, we convert the string to an array representation
  // Each character is represented as its character code
  const data = Array.from(text).map(char => char.charCodeAt(0));
  const customData = {
    text,
    pattern,
    textIndex,
    patternIndex,
    displayMode: 'substring'
  };
  
  return {
    data,
    highlightIndices,
    highlightLines: lines,
    description,
    custom: customData
  };
}

function* substringSearchAlgorithm(
  text: string,
  pattern: string
): Generator<AlgorithmStep, number, unknown> {
  yield createStep(
    text,
    pattern,
    0,
    0,
    [],
    [0],
    `Starting substring search for "${pattern}" in the text "${text}"`
  );
  
  // Empty pattern edge case
  if (pattern.length === 0) {
    yield createStep(
      text,
      pattern,
      0,
      0,
      [],
      [1, 2],
      `Pattern is empty, returning 0`
    );
    return 0;
  }
  
  // Main search loop - using the naive approach
  for (let i = 0; i <= text.length - pattern.length; i++) {
    yield createStep(
      text,
      pattern,
      i,
      0,
      [i],
      [4, 5],
      `Trying to match pattern starting at position ${i} in the text`
    );
    
    let j;
    // Pattern matching loop
    for (j = 0; j < pattern.length; j++) {
      // Highlight the current comparison
      let highlightIndices = Array.from({ length: j+1 }, (_, idx) => i + idx);
      
      yield createStep(
        text,
        pattern,
        i,
        j,
        highlightIndices,
        [8, 9],
        `Comparing text[${i + j}]="${text[i + j]}" with pattern[${j}]="${pattern[j]}"`
      );
      
      if (text[i + j] !== pattern[j]) {
        yield createStep(
          text,
          pattern,
          i,
          j,
          highlightIndices,
          [11, 12],
          `Mismatch at position ${i + j}: "${text[i + j]}" ≠ "${pattern[j]}". Moving to next position.`
        );
        break;
      }
    }
    
    // If we matched the entire pattern
    if (j === pattern.length) {
      // Highlight the full match
      const matchIndices = Array.from({ length: pattern.length }, (_, idx) => i + idx);
      
      yield createStep(
        text,
        pattern,
        i,
        j,
        matchIndices,
        [16, 17],
        `Found match at position ${i}!`
      );
      
      return i;
    }
  }
  
  // Pattern not found
  yield createStep(
    text,
    pattern,
    text.length,
    0,
    [],
    [22, 23],
    `Pattern "${pattern}" not found in the text`
  );
  
  return -1;
}

export const substringSearch: Algorithm = {
  name: 'Substring Search',
  category: 'search',
  description: 
    'Substring Search (also known as string matching) is the process of finding occurrences of a ' +
    'pattern string within a larger text. This implementation uses the simplest approach—the naive ' +
    'or brute force algorithm—which works by checking every possible position in the text where the ' +
    'pattern could match. For each position, it compares characters one by one until either a mismatch ' +
    'is found or the entire pattern is matched. While conceptually simple with O(n*m) worst-case time ' +
    'complexity (where n is the text length and m is the pattern length), this approach can be inefficient ' +
    'for large texts or patterns. More advanced algorithms like Knuth-Morris-Pratt (KMP), Boyer-Moore, ' +
    'or Rabin-Karp offer better performance by reducing redundant comparisons. However, the naive approach ' +
    'is often sufficient for short patterns or when the text contains few partial matches. This algorithm ' +
    'demonstrates the fundamentals of string pattern matching, which is essential in text editors, search ' +
    'engines, and bioinformatics applications.',
  timeComplexity: 'O(n*m) where n is text length and m is pattern length',
  spaceComplexity: 'O(1)',
  pseudocode: [
    'function substringSearch(text, pattern):',
    '  // Edge case: empty pattern',
    '  if pattern.length == 0:',
    '    return 0',
    '',
    '  // Check each possible starting position in the text',
    '  for i from 0 to text.length - pattern.length:',
    '    // Try to match the pattern at position i',
    '    j = 0',
    '    while j < pattern.length and text[i+j] == pattern[j]:',
    '      j = j + 1',
    '',
    '    // If we matched the entire pattern',
    '    if j == pattern.length:',
    '      return i  // Return the index where the pattern begins',
    '',
    '  // Pattern not found',
    '  return -1'
  ],
  implementation: `function substringSearch(text: string, pattern: string): number {
  // Edge case: empty pattern
  if (pattern.length === 0) return 0;
  
  // Check each possible starting position in text
  for (let i = 0; i <= text.length - pattern.length; i++) {
    let found = true;
    
    // Try to match pattern at current position
    for (let j = 0; j < pattern.length; j++) {
      if (text[i + j] !== pattern[j]) {
        found = false;
        break;
      }
    }
    
    // If pattern was fully matched
    if (found) {
      return i;
    }
  }
  
  // Pattern not found
  return -1;
}`,
  implementationLanguage: 'typescript',
  run: (input: SubstringSearchInput) => {
    const { text, pattern } = input;
    return substringSearchAlgorithm(text, pattern);
  },
  defaultInput: { text: "hello world", pattern: "world" }
}; 