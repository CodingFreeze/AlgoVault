# AlgoVault - Visual Algorithm Explorer

## Overview

AlgoVault is an interactive web platform designed to visualize and animate fundamental computer science algorithms. The project aims to make algorithm concepts more intuitive and accessible by providing step-by-step visual representations of how algorithms work. It was created as a personal learning tool and a resource for computer science students who benefit from visual demonstrations.

## Features

- **Interactive Visualizations**: Control algorithm execution with step-forward, step-backward, and variable speed animations
- **Multiple Algorithm Categories**: Sorting, Graph, Tree, and Search algorithms implemented
- **Algorithm Information**: Detailed descriptions, time/space complexity analysis, and pseudocode for each algorithm
- **Responsive Design**: Works on desktop and mobile devices

## Algorithms Implemented

AlgoVault currently includes 16 algorithms across 4 categories:

### Sorting Algorithms
- QuickSort
- MergeSort
- BubbleSort
- Insertion Sort

### Graph Algorithms
- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Dijkstra's Algorithm
- A* Pathfinding

### Tree Algorithms
- Binary Search Tree Insertion
- Tree Traversals
- AVL Tree Balancing
- Red-Black Trees

### Search Algorithms
- Linear Search
- Binary Search
- Hash-based Search
- Substring Search

## Technologies Used

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Animation**: GSAP (GreenSock Animation Platform)
- **Visualization**: SVG for rendering algorithm states
- **Styling**: Custom CSS with responsive design
- **State Management**: Svelte Stores

## Purpose & Motivation

I built AlgoVault for two primary reasons:

1. **Educational Tool**: As a computer science student, I found that visualizing algorithms helped tremendously with understanding their mechanics and behavior. AlgoVault allows users to slow down and examine each step of an algorithm's execution.

2. **Skill Development**: This project served as a practical way to improve my web development skills, particularly with SvelteKit, TypeScript, and interactive visualizations.

## Future Development

While the current scope of AlgoVault is complete with 16 algorithms implemented, future enhancements may include:

- Algorithm comparison tool to directly compare performance
- Code walkthrough mode highlighting corresponding code as algorithms execute
- Additional algorithm categories (dynamic programming, greedy algorithms)
- Performance metrics showing real-time analysis

## Local Development

```bash
# Clone the repository
git clone https://github.com/CodingFreeze/AlgoVault.git
cd AlgoVault

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Demo

Visit the live version at: [https://algovault.vercel.app/](https://algovault.vercel.app/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

This project was inspired by algorithm visualizers encountered in computer science courses and online resources. Special thanks to all the open-source projects that made this work possible.
