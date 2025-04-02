<script lang="ts">
  // Import any needed assets or components
</script>

<div class="landing-page">
  <section class="hero">
    <div class="hero-content">
      <div class="logo-container">
        <div class="logo-icon"></div>
      </div>
      <h1 class="text-gradient">AlgoVault</h1>
      <p class="tagline">Interactive algorithm visualization platform</p>
      <p class="description">
        Visualize, understand, and master computer science algorithms through
        step-by-step interactive demonstrations and detailed explanations.
      </p>
      <div class="cta-buttons">
        <a href="/algorithms" class="primary-button">Explore Algorithms</a>
        <a href="/about" class="secondary-button">Learn More</a>
      </div>
    </div>
    <div class="hero-backdrop">
      <div class="backdrop-shape shape-1"></div>
      <div class="backdrop-shape shape-2"></div>
      <div class="backdrop-shape shape-3"></div>
    </div>
  </section>

  <section class="features">
    <h2>Learn Through Visualization</h2>
    
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon sorting-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="9" x2="20" y2="9"></line>
            <line x1="4" y1="15" x2="20" y2="15"></line>
            <line x1="10" y1="3" x2="8" y2="21"></line>
            <line x1="16" y1="3" x2="14" y2="21"></line>
          </svg>
        </div>
        <h3>Sorting Algorithms</h3>
        <p>Watch how sorting algorithms like QuickSort, MergeSort, and BubbleSort organize data with dynamic visualizations.</p>
        <a href="/sorting" class="feature-link">Explore Sorting</a>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon graph-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="18" r="3"></circle>
            <line x1="6" y1="9" x2="6" y2="15"></line>
            <line x1="9" y1="6" x2="15" y2="6"></line>
            <line x1="9" y1="18" x2="15" y2="18"></line>
            <line x1="18" y1="9" x2="18" y2="15"></line>
          </svg>
        </div>
        <h3>Graph Algorithms</h3>
        <p>Understand pathfinding and traversal algorithms like Dijkstra's, A*, BFS and DFS with interactive graph visualizations.</p>
        <a href="/graph" class="feature-link">Explore Graphs</a>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon tree-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22V6"></path>
            <path d="M6 12l6-6 6 6"></path>
            <path d="M8 9h8"></path>
            <path d="M5 16h14"></path>
          </svg>
        </div>
        <h3>Tree Algorithms</h3>
        <p>Visualize tree operations, balancing algorithms, and traversal methods with step-by-step animations.</p>
        <a href="/tree" class="feature-link">Explore Trees</a>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3>Search Algorithms</h3>
        <p>Learn about linear and binary search techniques with interactive visualizations that demonstrate efficiency differences.</p>
        <a href="/search" class="feature-link">Explore Searching</a>
      </div>
    </div>
  </section>

  <section class="benefits">
    <h2>Why AlgoVault?</h2>
    
    <div class="benefits-container">
      <div class="benefit-item">
        <div class="benefit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
        </div>
        <h3>Interactive Learning</h3>
        <p>Control the speed, step through algorithms, and customize inputs to deepen your understanding.</p>
      </div>
      
      <div class="benefit-item">
        <div class="benefit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <h3>Synchronized Code</h3>
        <p>Watch pseudocode highlight in real-time with each algorithm step to connect theory with practice.</p>
      </div>
      
      <div class="benefit-item">
        <div class="benefit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="4"></circle>
            <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
            <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
            <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
            <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
          </svg>
        </div>
        <h3>Detailed Explanations</h3>
        <p>Understand the theory, complexity analysis, and practical applications of each algorithm.</p>
      </div>
      
      <div class="benefit-item">
        <div class="benefit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <h3>Visual Clarity</h3>
        <p>Clear, intuitive visualizations that make complex concepts accessible to beginners and experts alike.</p>
      </div>
    </div>
  </section>

  <section class="get-started">
    <div class="get-started-content">
      <h2>Ready to Dive In?</h2>
      <p>Explore our collection of algorithm visualizations and enhance your computer science knowledge today.</p>
      <a href="/algorithms" class="primary-button">Get Started</a>
    </div>
    <div class="decorative-pattern"></div>
  </section>
</div>

<style>
  .landing-page {
    display: flex;
    flex-direction: column;
    gap: 5rem;
    padding: 0 1rem;
    overflow-x: hidden;
  }
  
  /* Hero section */
  .hero {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    text-align: center;
    min-height: 80vh;
    padding: 4rem 0 6rem;
    position: relative;
    overflow: hidden;
  }
  
  .hero-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
  }
  
  .backdrop-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.6;
  }
  
  .shape-1 {
    width: 500px;
    height: 500px;
    background: rgba(52, 152, 219, 0.15);
    top: -100px;
    left: -200px;
  }
  
  .shape-2 {
    width: 400px;
    height: 400px;
    background: rgba(155, 89, 182, 0.1);
    top: 10%;
    right: -150px;
  }
  
  .shape-3 {
    width: 600px;
    height: 600px;
    background: rgba(46, 204, 113, 0.1);
    bottom: -200px;
    left: 30%;
    transform: translateX(-50%);
  }
  
  .logo-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .logo-icon {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 24px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(52, 152, 219, 0.3);
  }
  
  .logo-icon::before {
    content: '';
    position: absolute;
    width: 70px;
    height: 70px;
    background: white;
    border-radius: 15px;
  }
  
  .logo-icon::after {
    content: 'A';
    position: absolute;
    font-family: sans-serif;
    font-size: 48px;
    font-weight: bold;
    color: var(--primary-color);
  }
  
  @media (max-width: 992px) {
    .hero {
      min-height: auto;
      padding: 4rem 0 8rem;
    }
    
    .logo-icon {
      width: 100px;
      height: 100px;
    }
    
    .logo-icon::before {
      width: 60px;
      height: 60px;
    }
    
    .logo-icon::after {
      font-size: 40px;
    }
  }
  
  .hero-content {
    display: flex;
    flex-direction: column;
    gap: 1.8rem;
    max-width: 800px;
    position: relative;
    z-index: 2;
  }
  
  .hero h1 {
    font-size: 5rem;
    font-weight: 800;
    margin: 0;
    line-height: 1;
    letter-spacing: -0.02em;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color) 70%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  
  @media (max-width: 768px) {
    .hero h1 {
      font-size: 3.5rem;
    }
  }
  
  .tagline {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
  }
  
  .description {
    font-size: 1.3rem;
    line-height: 1.7;
    color: var(--light-text-color);
    margin: 0;
    max-width: 600px;
    align-self: center;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1.2rem;
    margin-top: 1rem;
    justify-content: center;
  }
  
  @media (max-width: 576px) {
    .cta-buttons {
      flex-direction: column;
      width: 100%;
      max-width: 300px;
      margin: 1rem auto 0;
    }
  }
  
  .primary-button {
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1.1rem;
    text-decoration: none;
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    display: inline-block;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .primary-button::after {
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
  
  .primary-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(52, 152, 219, 0.5);
  }
  
  .primary-button:hover::after {
    opacity: 1;
  }
  
  .secondary-button {
    background: transparent;
    color: var(--primary-color);
    padding: 1rem 2rem;
    border-radius: 50px;
    border: 2px solid var(--primary-color);
    font-weight: 600;
    font-size: 1.1rem;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s, transform 0.3s;
    display: inline-block;
    text-align: center;
  }
  
  .secondary-button:hover {
    background-color: rgba(52, 152, 219, 0.1);
    transform: translateY(-3px);
  }
  
  /* Features section */
  .features {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding: 1rem 0;
    position: relative;
  }
  
  .features h2, .benefits h2, .get-started h2 {
    text-align: center;
    font-size: 2.8rem;
    color: var(--text-color);
    margin: 0;
    position: relative;
    padding-bottom: 1.5rem;
  }
  
  .features h2:after, .benefits h2:after, .get-started h2:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    border-radius: 2px;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    width: 100%;
  }
  
  @media (max-width: 992px) {
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 576px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .feature-card {
    background-color: var(--card-background);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    padding: 2.5rem;
    transition: transform 0.3s, box-shadow 0.3s;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    height: 100%;
    border-top: 5px solid transparent;
    position: relative;
    overflow: hidden;
  }
  
  .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(255,255,255,0.8), transparent);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 0;
  }
  
  .feature-card > * {
    position: relative;
    z-index: 1;
  }
  
  .feature-card:nth-child(1) {
    border-top-color: var(--primary-color);
  }
  
  .feature-card:nth-child(2) {
    border-top-color: var(--accent-color-1);
  }
  
  .feature-card:nth-child(3) {
    border-top-color: var(--accent-color-2);
  }
  
  .feature-card:nth-child(4) {
    border-top-color: var(--accent-color-3);
  }
  
  .feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
  
  .feature-card:hover::before {
    opacity: 0.3;
  }
  
  .feature-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    position: relative;
  }
  
  .feature-icon svg {
    width: 35px;
    height: 35px;
    stroke: white;
  }
  
  .feature-icon:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: inherit;
    opacity: 0.2;
    filter: blur(10px);
    z-index: -1;
    transform: scale(1.2);
  }
  
  .sorting-icon {
    background: linear-gradient(45deg, var(--primary-color), #2980b9);
  }
  
  .graph-icon {
    background: linear-gradient(45deg, var(--accent-color-1), #c0392b);
  }
  
  .tree-icon {
    background: linear-gradient(45deg, var(--accent-color-2), #27ae60);
  }
  
  .search-icon {
    background: linear-gradient(45deg, var(--accent-color-3), #9b59b6);
  }
  
  .feature-card h3 {
    margin: 0;
    font-size: 1.6rem;
    color: var(--text-color);
  }
  
  .feature-card p {
    margin: 0;
    color: var(--light-text-color);
    line-height: 1.7;
    flex-grow: 1;
    font-size: 1.1rem;
  }
  
  .feature-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    margin-top: 1rem;
    font-size: 1.1rem;
    transition: transform 0.2s;
    position: relative;
  }
  
  .feature-link:after {
    content: '→';
    margin-left: 0.5rem;
    transition: transform 0.2s;
  }
  
  .feature-link:hover:after {
    transform: translateX(5px);
  }
  
  /* Benefits section */
  .benefits {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding: 1rem 0;
    position: relative;
  }
  
  .benefits::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 80% 20%, rgba(52, 152, 219, 0.05), transparent 70%),
                radial-gradient(circle at 20% 80%, rgba(46, 204, 113, 0.05), transparent 70%);
    z-index: -1;
  }
  
  .benefits-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2.5rem;
  }
  
  .benefit-item {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 2rem;
    border-left: 5px solid var(--primary-color);
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    overflow: hidden;
  }
  
  .benefit-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(52, 152, 219, 0.1);
  }
  
  .benefit-icon svg {
    width: 28px;
    height: 28px;
    stroke: var(--primary-color);
  }
  
  .benefit-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  .benefit-item::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255,255,255,0.8), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 0;
  }
  
  .benefit-item:hover::after {
    opacity: 0.5;
  }
  
  .benefit-item:nth-child(1) {
    border-left-color: var(--primary-color);
  }
  
  .benefit-item:nth-child(1) .benefit-icon {
    background: rgba(52, 152, 219, 0.1);
  }
  
  .benefit-item:nth-child(1) .benefit-icon svg {
    stroke: var(--primary-color);
  }
  
  .benefit-item:nth-child(2) {
    border-left-color: var(--accent-color-1);
  }
  
  .benefit-item:nth-child(2) .benefit-icon {
    background: rgba(231, 76, 60, 0.1);
  }
  
  .benefit-item:nth-child(2) .benefit-icon svg {
    stroke: var(--accent-color-1);
  }
  
  .benefit-item:nth-child(3) {
    border-left-color: var(--accent-color-2);
  }
  
  .benefit-item:nth-child(3) .benefit-icon {
    background: rgba(46, 204, 113, 0.1);
  }
  
  .benefit-item:nth-child(3) .benefit-icon svg {
    stroke: var(--accent-color-2);
  }
  
  .benefit-item:nth-child(4) {
    border-left-color: var(--accent-color-3);
  }
  
  .benefit-item:nth-child(4) .benefit-icon {
    background: rgba(155, 89, 182, 0.1);
  }
  
  .benefit-item:nth-child(4) .benefit-icon svg {
    stroke: var(--accent-color-3);
  }
  
  .benefit-item h3 {
    margin: 0;
    color: var(--text-color);
    font-size: 1.4rem;
    position: relative;
    z-index: 1;
  }
  
  .benefit-item p {
    margin: 0;
    color: var(--light-text-color);
    line-height: 1.7;
    font-size: 1.1rem;
    position: relative;
    z-index: 1;
  }
  
  /* Get started section */
  .get-started {
    text-align: center;
    background: linear-gradient(135deg, #f8fafc, #edf2f7);
    padding: 4rem 2rem;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
  }
  
  .decorative-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0.4;
    background-image: 
      radial-gradient(circle at 25% 25%, var(--primary-color) 1px, transparent 1px),
      radial-gradient(circle at 75% 75%, var(--primary-color) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  
  .get-started-content {
    position: relative;
    z-index: 1;
    max-width: 600px;
  }
  
  .get-started p {
    margin: 1.5rem 0;
    color: var(--light-text-color);
    font-size: 1.3rem;
    line-height: 1.7;
  }
  
  .get-started .primary-button {
    margin-top: 1rem;
    min-width: 200px;
  }
</style>
