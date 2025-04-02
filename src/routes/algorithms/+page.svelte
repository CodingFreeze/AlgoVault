<script lang="ts">
  // Import any components as needed
</script>

<div class="algorithms-page">
  <header class="page-header">
    <div class="header-content">
      <h1>Algorithm Visualizations</h1>
      <p>
        Explore our collection of interactive algorithm visualizations across different 
        categories. Select a category below to begin your learning journey.
      </p>
    </div>
    <div class="header-pattern"></div>
  </header>

  <section class="algorithm-categories">
    <div class="category-card sorting">
      <div class="category-content">
        <div class="category-badge">Sorting</div>
        <h2>Sorting Algorithms</h2>
        <p>
          Explore algorithms that organize data in a specific order, such as numerical 
          or lexicographical. Understand the trade-offs between different sorting methods.
        </p>
        <div class="algorithm-tags">
          <span class="algorithm-tag">Bubble Sort</span>
          <span class="algorithm-tag">Quick Sort</span>
          <span class="algorithm-tag">Merge Sort</span>
          <span class="algorithm-tag">Insertion Sort</span>
        </div>
        <div class="complexity-info">
          <div class="complexity-item">
            <span class="complexity-label">Time:</span>
            <span class="complexity-value">O(n log n) - O(n²)</span>
          </div>
          <div class="complexity-item">
            <span class="complexity-label">Space:</span>
            <span class="complexity-value">O(1) - O(n)</span>
          </div>
        </div>
        <a href="/sorting" class="explore-button">Explore Sorting</a>
      </div>
      <div class="category-visual">
        <div class="sorting-visual"></div>
      </div>
    </div>

    <div class="category-card graph">
      <div class="category-content">
        <div class="category-badge">Graph</div>
        <h2>Graph Algorithms</h2>
        <p>
          Visualize algorithms that operate on graph data structures, including traversal
          and pathfinding techniques used in networks, maps, and social connections.
        </p>
        <div class="algorithm-tags">
          <span class="algorithm-tag">Breadth-First Search</span>
          <span class="algorithm-tag">Depth-First Search</span>
          <span class="algorithm-tag">Dijkstra's Algorithm</span>
          <span class="algorithm-tag">A* Pathfinding</span>
        </div>
        <div class="complexity-info">
          <div class="complexity-item">
            <span class="complexity-label">Time:</span>
            <span class="complexity-value">O(V + E) - O(V²)</span>
          </div>
          <div class="complexity-item">
            <span class="complexity-label">Space:</span>
            <span class="complexity-value">O(V)</span>
          </div>
        </div>
        <a href="/graph" class="explore-button">Explore Graphs</a>
      </div>
      <div class="category-visual">
        <div class="graph-visual"></div>
      </div>
    </div>

    <div class="category-card tree">
      <div class="category-content">
        <div class="category-badge">Tree</div>
        <h2>Tree Algorithms</h2>
        <p>
          Understand hierarchical data structures and operations performed on trees, 
          including balancing, traversal, and search techniques.
        </p>
        <div class="algorithm-tags">
          <span class="algorithm-tag">Binary Search Tree Insertion</span>
          <span class="algorithm-tag">Tree Traversals</span>
          <span class="algorithm-tag">AVL Tree Balancing</span>
          <span class="algorithm-tag">Red-Black Trees</span>
        </div>
        <div class="complexity-info">
          <div class="complexity-item">
            <span class="complexity-label">Time:</span>
            <span class="complexity-value">O(log n) - O(n)</span>
          </div>
          <div class="complexity-item">
            <span class="complexity-label">Space:</span>
            <span class="complexity-value">O(h) - O(n)</span>
          </div>
        </div>
        <a href="/tree" class="explore-button">Explore Trees</a>
      </div>
      <div class="category-visual">
        <div class="tree-visual"></div>
      </div>
    </div>

    <div class="category-card search">
      <div class="category-content">
        <div class="category-badge">Search</div>
        <h2>Search Algorithms</h2>
        <p>
          Discover various techniques to find specific items in datasets, from basic
          linear search to advanced indexing and hashing strategies.
        </p>
        <div class="algorithm-tags">
          <span class="algorithm-tag">Linear Search</span>
          <span class="algorithm-tag">Binary Search</span>
          <span class="algorithm-tag">Hash-based Search</span>
          <span class="algorithm-tag">Substring Search</span>
        </div>
        <div class="complexity-info">
          <div class="complexity-item">
            <span class="complexity-label">Time:</span>
            <span class="complexity-value">O(1) - O(n)</span>
          </div>
          <div class="complexity-item">
            <span class="complexity-label">Space:</span>
            <span class="complexity-value">O(1)</span>
          </div>
        </div>
        <a href="/search" class="explore-button">Explore Search</a>
      </div>
      <div class="category-visual">
        <div class="search-visual"></div>
      </div>
    </div>
  </section>

  <section class="learning-path">
    <h2>Learning Path Suggestion</h2>
    <div class="path-container">
      <div class="path-step">
        <div class="path-marker">1</div>
        <div class="path-content">
          <h3>Start with Searching</h3>
          <p>Begin with simple search algorithms to understand basic algorithm concepts.</p>
        </div>
      </div>
      <div class="path-arrow"></div>
      <div class="path-step">
        <div class="path-marker">2</div>
        <div class="path-content">
          <h3>Move to Sorting</h3>
          <p>Learn how data can be organized efficiently with various sorting techniques.</p>
        </div>
      </div>
      <div class="path-arrow"></div>
      <div class="path-step">
        <div class="path-marker">3</div>
        <div class="path-content">
          <h3>Explore Trees</h3>
          <p>Understand hierarchical data structures and operations.</p>
        </div>
      </div>
      <div class="path-arrow"></div>
      <div class="path-step">
        <div class="path-marker">4</div>
        <div class="path-content">
          <h3>Master Graphs</h3>
          <p>Apply your knowledge to the most complex and versatile data structures.</p>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .algorithms-page {
    display: flex;
    flex-direction: column;
    gap: 5rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Header styling */
  .page-header {
    text-align: center;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border-radius: 16px;
    color: white;
    box-shadow: 0 10px 25px rgba(139, 92, 246, 0.15);
    position: relative;
    overflow: hidden;
  }
  
  .header-content {
    position: relative;
    z-index: 2;
  }
  
  .header-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 25%),
      radial-gradient(circle at 80% 30%, rgba(255,255,255,0.15) 0%, transparent 30%);
    z-index: 1;
  }

  .page-header h1 {
    font-size: 3.2rem;
    margin-bottom: 1.2rem;
    font-weight: 700;
  }

  .page-header p {
    font-size: 1.3rem;
    line-height: 1.6;
    opacity: 0.9;
    max-width: 700px;
    margin: 0 auto;
  }

  /* Algorithm categories section */
  .algorithm-categories {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding: 0 1rem;
  }

  .category-card {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 2rem;
    background-color: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative;
  }
  
  .category-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 0;
  }

  .category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }
  
  .category-card:hover::before {
    opacity: 1;
  }

  @media (max-width: 920px) {
    .category-card {
      grid-template-columns: 1fr;
    }

    .category-visual {
      height: 250px;
      order: -1;
    }
  }

  .category-content {
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    position: relative;
    z-index: 2;
  }
  
  .category-badge {
    background-color: rgba(139, 92, 246, 0.1);
    color: #7c3aed;
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.4rem 1rem;
    border-radius: 30px;
    align-self: flex-start;
    margin-bottom: 0.5rem;
  }
  
  .sorting .category-badge {
    background-color: rgba(52, 152, 219, 0.1);
    color: #3498db;
  }
  
  .graph .category-badge {
    background-color: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
  }
  
  .tree .category-badge {
    background-color: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
  }
  
  .search .category-badge {
    background-color: rgba(243, 156, 18, 0.1);
    color: #f39c12;
  }

  .category-card h2 {
    font-size: 2rem;
    margin: 0;
    color: #2c3e50;
  }

  .category-card p {
    font-size: 1.1rem;
    color: #555;
    line-height: 1.6;
    margin: 0;
  }

  .algorithm-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .algorithm-tag {
    background-color: #f7f8fa;
    color: #555;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .complexity-info {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.5rem;
    padding: 1rem;
    background-color: #f8fafc;
    border-radius: 8px;
    border-left: 3px solid #e2e8f0;
  }
  
  .sorting .complexity-info {
    border-left-color: #3498db;
  }
  
  .graph .complexity-info {
    border-left-color: #e74c3c;
  }
  
  .tree .complexity-info {
    border-left-color: #2ecc71;
  }
  
  .search .complexity-info {
    border-left-color: #f39c12;
  }
  
  .complexity-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  
  .complexity-label {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 500;
  }
  
  .complexity-value {
    font-size: 0.95rem;
    color: #334155;
    font-family: monospace;
  }

  .category-visual {
    background-color: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    padding: 1rem;
    position: relative;
    z-index: 1;
  }
  
  .category-visual::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.025) 0%, transparent 50%);
    z-index: 0;
  }
  
  .sorting .category-visual::before {
    background-image: 
      radial-gradient(circle at 80% 20%, rgba(52, 152, 219, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(52, 152, 219, 0.025) 0%, transparent 50%);
  }
  
  .graph .category-visual::before {
    background-image: 
      radial-gradient(circle at 80% 20%, rgba(231, 76, 60, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(231, 76, 60, 0.025) 0%, transparent 50%);
  }
  
  .tree .category-visual::before {
    background-image: 
      radial-gradient(circle at 80% 20%, rgba(46, 204, 113, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(46, 204, 113, 0.025) 0%, transparent 50%);
  }
  
  .search .category-visual::before {
    background-image: 
      radial-gradient(circle at 80% 20%, rgba(243, 156, 18, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(243, 156, 18, 0.025) 0%, transparent 50%);
  }

  .sorting-visual, .graph-visual, .tree-visual, .search-visual {
    width: 85%;
    height: 85%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    position: relative;
    z-index: 2;
  }

  .sorting-visual {
    background-image: url('/images/sorting-visualization.svg');
  }

  .graph-visual {
    background-image: url('/images/graph-visualization.svg');
  }

  .tree-visual {
    background-image: url('/images/tree-visualization.svg');
  }

  .search-visual {
    background-image: url('/images/search-visualization.svg');
  }

  .explore-button {
    background: linear-gradient(45deg, #8b5cf6, #7c3aed);
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    align-self: flex-start;
    margin-top: 1rem;
    position: relative;
    overflow: hidden;
  }
  
  .explore-button::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
    opacity: 0;
    transition: opacity 0.3s;
  }

  .explore-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  }
  
  .explore-button:hover::after {
    opacity: 1;
  }
  
  .sorting .explore-button {
    background: linear-gradient(45deg, #3498db, #2980b9);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  }
  
  .sorting .explore-button:hover {
    box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
  }
  
  .graph .explore-button {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  }
  
  .graph .explore-button:hover {
    box-shadow: 0 8px 20px rgba(231, 76, 60, 0.4);
  }
  
  .tree .explore-button {
    background: linear-gradient(45deg, #2ecc71, #27ae60);
    box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
  }
  
  .tree .explore-button:hover {
    box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
  }
  
  .search .explore-button {
    background: linear-gradient(45deg, #f39c12, #d35400);
    box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
  }
  
  .search .explore-button:hover {
    box-shadow: 0 8px 20px rgba(243, 156, 18, 0.4);
  }

  /* Learning path section */
  .learning-path {
    margin: 2rem auto 4rem;
    max-width: 1000px;
    padding: 3rem;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    text-align: center;
  }
  
  .learning-path h2 {
    font-size: 2.2rem;
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 2.5rem;
    position: relative;
    display: inline-block;
  }
  
  .learning-path h2::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(45deg, #8b5cf6, #7c3aed);
    border-radius: 2px;
  }
  
  .path-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  
  @media (max-width: 900px) {
    .path-container {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .path-arrow {
      transform: rotate(90deg);
    }
  }
  
  .path-step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    max-width: 200px;
    text-align: center;
  }
  
  .path-marker {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(45deg, #8b5cf6, #7c3aed);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    box-shadow: 0 4px 10px rgba(139, 92, 246, 0.3);
  }
  
  .path-content h3 {
    font-size: 1.2rem;
    margin: 0 0 0.5rem;
    color: #2c3e50;
  }
  
  .path-content p {
    font-size: 0.95rem;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }
  
  .path-arrow {
    width: 24px;
    height: 24px;
    position: relative;
  }
  
  .path-arrow::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0; 
    height: 0; 
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 12px solid #8b5cf6;
  }
  
  .path-arrow::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-75%, -50%);
    width: 20px;
    height: 2px;
    background-color: #8b5cf6;
  }
</style> 