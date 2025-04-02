import { writable, derived, get } from 'svelte/store';
import type { Algorithm, AlgorithmStep } from '../algorithms/types.js';

// Selected algorithm
export const selectedAlgorithm = writable<Algorithm | null>(null);

// Input data for the algorithm
export const inputData = writable<any>(null);

// Generated steps from the algorithm
export const steps = writable<AlgorithmStep[]>([]);

// Current step index
export const currentStepIndex = writable(0);

// Animation controls
export const isPlaying = writable(false);
export const animationSpeed = writable(1);

// Derived store for current step
export const currentStep = derived(
  [steps, currentStepIndex],
  ([$steps, $currentStepIndex]) => {
    if ($steps.length === 0) return null;
    return $steps[$currentStepIndex];
  }
);

// Function to run the selected algorithm with the provided input
export function runAlgorithm() {
  const algorithm = get(selectedAlgorithm);
  const input = get(inputData);
  
  if (!algorithm || input === null) return;
  
  const generatedSteps: AlgorithmStep[] = [];
  const generator = algorithm.run(input);
  
  let result = generator.next();
  while (!result.done) {
    generatedSteps.push(result.value);
    result = generator.next();
  }
  
  steps.set(generatedSteps);
  currentStepIndex.set(0);
}

// Player controls
export function play() {
  isPlaying.set(true);
}

export function pause() {
  isPlaying.set(false);
}

export function nextStep() {
  currentStepIndex.update((index) => {
    const currentSteps = get(steps);
    return index < currentSteps.length - 1 ? index + 1 : index;
  });
}

export function previousStep() {
  currentStepIndex.update((index) => (index > 0 ? index - 1 : index));
}

export function reset() {
  currentStepIndex.set(0);
  isPlaying.set(false);
} 