<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
</script>

<div class="app">
	<header>
		<div class="container">
			<div class="logo">
				<a href="/" class="logo-link">
					<h1 class="text-gradient">AlgoVault</h1>
					<span class="tagline">Visual Algorithm Explorer</span>
				</a>
			</div>
			<nav>
				<ul>
					<li><a href="/" class:active={$page.url.pathname === "/"}>Home</a></li>
					<li><a href="/algorithms" class:active={$page.url.pathname.startsWith("/algorithms")}>Algorithms</a></li>
					<li><a href="/sorting" class:active={$page.url.pathname.startsWith("/sorting")}>Sorting</a></li>
					<li><a href="/graph" class:active={$page.url.pathname.startsWith("/graph")}>Graph</a></li>
					<li><a href="/tree" class:active={$page.url.pathname.startsWith("/tree")}>Tree</a></li>
					<li><a href="/search" class:active={$page.url.pathname.startsWith("/search")}>Search</a></li>
					<li><a href="/about" class:active={$page.url.pathname.startsWith("/about")}>About</a></li>
				</ul>
			</nav>
		</div>
	</header>
	
	<main>
		<slot />
	</main>
	
	<footer>
		<div class="footer-content">
			<div class="footer-logo">
				<h2 class="text-gradient">AlgoVault</h2>
			</div>
			
			<div class="footer-links">
				<a href="/sorting">Sorting</a>
				<a href="/graph">Graph</a>
				<a href="/tree">Tree</a>
				<a href="/search">Search</a>
			</div>
			
			<div class="footer-copyright">
				<p>&copy; {new Date().getFullYear()} CodingFreeze</p>
				<a href="https://github.com/CodingFreeze/AlgoVault" class="github-link" target="_blank" rel="noopener noreferrer">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
					</svg>
				</a>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}
	
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	
	header {
		background-color: var(--header-color);
		color: white;
		padding: 1.25rem 0;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 100;
	}
	
	.container {
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.logo {
		display: flex;
		flex-direction: column;
	}
	
	.logo-link {
		text-decoration: none;
		color: white;
		transition: opacity 0.2s;
	}
	
	.logo-link:hover {
		opacity: 0.9;
	}
	
	.logo h1 {
		margin: 0;
		font-size: 1.8rem;
		font-weight: 700;
	}
	
	.tagline {
		font-size: 0.9rem;
		opacity: 0.8;
	}
	
	nav ul {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 2rem;
	}
	
	@media (max-width: 768px) {
		nav ul {
			gap: 1.25rem;
		}
	}
	
	@media (max-width: 640px) {
		.container {
			flex-direction: column;
			gap: 1rem;
		}
		
		nav ul {
			justify-content: center;
			flex-wrap: wrap;
		}
	}
	
	nav a {
		color: white;
		text-decoration: none;
		font-weight: 500;
		padding: 0.5rem 0;
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
		position: relative;
	}
	
	nav a:hover {
		opacity: 0.9;
	}
	
	nav a:after {
		content: '';
		position: absolute;
		width: 0;
		height: 2px;
		bottom: 0;
		left: 0;
		background-color: var(--primary-color);
		transition: width 0.3s;
	}
	
	nav a:hover:after {
		width: 100%;
	}
	
	nav a.active:after {
		width: 100%;
		background-color: var(--primary-color);
	}
	
	main {
		flex: 1;
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
	}
	
	footer {
		background-color: var(--header-color);
		color: white;
		padding: 1rem 0;
		margin-top: auto;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.footer-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}
	
	.footer-logo h2 {
		margin: 0;
		font-size: 1.3rem;
	}
	
	.footer-links {
		display: flex;
		gap: 1.5rem;
	}
	
	.footer-links a {
		color: white;
		opacity: 0.8;
		transition: all 0.2s;
		font-size: 0.85rem;
		text-decoration: none;
	}
	
	.footer-links a:hover {
		opacity: 1;
	}
	
	.footer-copyright {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}
	
	.footer-copyright p {
		margin: 0;
		opacity: 0.8;
		font-size: 0.8rem;
	}
	
	.github-link {
		color: white;
		opacity: 0.8;
		transition: opacity 0.2s;
	}
	
	.github-link:hover {
		opacity: 1;
	}
	
	@media (max-width: 768px) {
		.footer-content {
			flex-direction: column;
			padding: 0.8rem 2rem;
			gap: 0.8rem;
			text-align: center;
		}
	}
</style>
