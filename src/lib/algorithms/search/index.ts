import { linearSearch } from './linear-search.js';
import { binarySearch } from './binary-search.js';
import { hashBasedSearch } from './hash-based-search.js';
import { substringSearch } from './substring-search.js';

export const searchAlgorithms = [linearSearch, binarySearch, hashBasedSearch, substringSearch];
export { linearSearch, binarySearch, hashBasedSearch, substringSearch }; 