
if (window.__uuRootScriptInitialized) {
	console.debug('Universal Understanding (root) script already initialized');
} else {
	window.__uuRootScriptInitialized = true;
	document.addEventListener('DOMContentLoaded', function() {
	// Theme toggle functionality (ensure a toggle exists)
	let themeToggle = document.getElementById('themeToggle');
	const htmlElement = document.documentElement;
	const body = document.body;

	// Load saved theme preference
	const savedTheme = (function() { try { return localStorage.getItem('theme') || 'dark'; } catch (e) { return 'dark'; } })();
	if (savedTheme === 'light') {
		body.classList.add('light-mode');
		htmlElement.classList.add('light-mode');
	} else {
		body.classList.remove('light-mode');
		htmlElement.classList.remove('light-mode');
	}

	// Unified toggle function (outer-scoped so mobile/Safari can access it reliably)
	let __uuToggleLock = false;
	function toggleTheme(e) {
		if (e && e.preventDefault) e.preventDefault();
		if (__uuToggleLock) return;
		__uuToggleLock = true;
		try {
			const isLightMode = body.classList.toggle('light-mode');
			htmlElement.classList.toggle('light-mode', isLightMode);
			const btn = document.getElementById('themeToggle');
			if (btn) {
				btn.textContent = isLightMode ? 'Light' : 'Dark';
				btn.setAttribute('aria-pressed', isLightMode ? 'true' : 'false');
				btn.disabled = false;
				btn.style.pointerEvents = 'auto';
			}
			try { localStorage.setItem('theme', isLightMode ? 'light' : 'dark'); } catch (err) {}
		} finally {
			setTimeout(function(){ __uuToggleLock = false; }, 300);
		}
	}

	if (!themeToggle) {
		const nav = document.querySelector('.top-nav ul');
		if (nav) {
			const li = document.createElement('li');
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'theme-toggle';
			btn.id = 'themeToggle';
			btn.textContent = body.classList.contains('light-mode') ? 'Light' : 'Dark';
			btn.setAttribute('aria-pressed', body.classList.contains('light-mode') ? 'true' : 'false');
			btn.setAttribute('tabindex', '0');
			li.appendChild(btn);
			nav.appendChild(li);
			themeToggle = btn;
		}
	}

	if (themeToggle) {
		const isLight = body.classList.contains('light-mode');
		themeToggle.textContent = isLight ? 'Light' : 'Dark';
		themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
		themeToggle.setAttribute('tabindex', '0');
		// Attach events that all call the same outer-scoped toggle. Use both click and touchend
		// for compatibility; the toggle function has a short lock to avoid double-firing.
		themeToggle.addEventListener('click', toggleTheme, { passive: false });
		themeToggle.addEventListener('touchend', function(e) { if (e && e.preventDefault) e.preventDefault(); toggleTheme(e); }, { passive: false });
		themeToggle.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { if (e && e.preventDefault) e.preventDefault(); toggleTheme(e); } });
	}

	// Search functionality
	const searchBar = document.getElementById('siteSearch');
	const searchResults = document.getElementById('searchResults');
  
	// Define searchable topics (base list). We'll merge with generated sitemap when available.
	const topics = [
		{ title: 'Mathematical Foundations', path: 'Scientia/1-Mathematical-Foundations/index.html', section: 'Scientia', ref: 'SC1' },
		{ title: 'Algebra & Functions', path: 'Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.1' },
		{ title: 'Basic Algebraic Manipulations', path: 'Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/1-1-1-Basic-Algebraic-Manipulations/index.html', section: 'Scientia > Mathematical Foundations > Algebra & Functions', ref: 'SC1.1.1' },
		{ title: 'Exponents, Logarithms & Identities', path: 'Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/1-1-2-Exponents-Logarithms-Identities/index.html', section: 'Scientia > Mathematical Foundations > Algebra & Functions', ref: 'SC1.1.2' },
		{ title: 'Trigonometric & Inverse Functions', path: 'Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/1-1-3-Trigonometric-Inverse-Functions/index.html', section: 'Scientia > Mathematical Foundations > Algebra & Functions', ref: 'SC1.1.3' },
		{ title: 'Graphs & Transformations', path: 'Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/1-1-4-Graphs-Transformations/index.html', section: 'Scientia > Mathematical Foundations > Algebra & Functions', ref: 'SC1.1.4' },
		{ title: 'Combinations & Permutations', path: 'Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/1-1-5-Combinations-Permutations/index.html', section: 'Scientia > Mathematical Foundations > Algebra & Functions', ref: 'SC1.1.5' },
		{ title: 'Binomial Theorem (Binomial Expansion)', path: 'Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/1-1-6-Binomial-Theorem/index.html', section: 'Scientia > Mathematical Foundations > Algebra & Functions', ref: 'SC1.1.6' },
		{ title: 'Sigma Notation & Summation', path: 'Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/1-1-7-Sigma-Notation-Summation/index.html', section: 'Scientia > Mathematical Foundations > Algebra & Functions', ref: 'SC1.1.7' },
		{ title: 'Inequalities & Modulus', path: 'Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/1-1-8-Inequalities-Modulus/index.html', section: 'Scientia > Mathematical Foundations > Algebra & Functions', ref: 'SC1.1.8' },
		{ title: 'Calculus', path: 'Website/Scientia/1-Mathematical-Foundations/1-2-Calculus/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.2' },
		{ title: 'Linear Algebra', path: 'Website/Scientia/1-Mathematical-Foundations/1-3-Linear-Algebra/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.3' },
		{ title: 'Differential Equations', path: 'Website/Scientia/1-Mathematical-Foundations/1-4-Differential-Equations/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.4' },
		{ title: 'Complex Numbers & Complex Analysis', path: 'Website/Scientia/1-Mathematical-Foundations/1-5-Complex-Numbers/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.5' },
		{ title: 'Vector & Tensor Calculus', path: 'Website/Scientia/1-Mathematical-Foundations/1-6-Vector-and-Tensor-Calculus/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.6' },
		{ title: 'Differential Geometry', path: 'Website/Scientia/1-Mathematical-Foundations/1-7-Differential-Geometry/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.7' },
		{ title: 'Probability & Statistics', path: 'Website/Scientia/1-Mathematical-Foundations/1-8-Probability-and-Statistics/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.8' },
		{ title: 'Fourier & Transform Methods', path: 'Website/Scientia/1-Mathematical-Foundations/1-9-Fourier-and-Transform-Methods/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.9' },
		{ title: 'Group Theory Basics', path: 'Website/Scientia/1-Mathematical-Foundations/1-10-Group-Theory-Basics/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.10' },
		{ title: 'Number Theory', path: 'Website/Scientia/1-Mathematical-Foundations/1-11-Number-Theory/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.11' },
		{ title: 'Topology Basics', path: 'Website/Scientia/1-Mathematical-Foundations/1-12-Topology-Basics/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.12' },
		{ title: 'Advanced Linear Algebra & Functional Analysis', path: 'Website/Scientia/1-Mathematical-Foundations/1-13-Advanced-Linear-Algebra/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.13' },
		{ title: 'Transcendental Functions', path: 'Website/Scientia/1-Mathematical-Foundations/1-14-Transcendental-Functions/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.14' },
		{ title: 'Physics Foundations', path: 'Website/Scientia/2-Physics-Foundations/index.html', section: 'Scientia', ref: 'SC2' },
		{ title: 'Quantum Mechanics', path: 'Website/Scientia/3-Quantum-Mechanics/index.html', section: 'Scientia', ref: 'SC3' },
		{ title: 'Relativity', path: 'Website/Scientia/4-Relativity/index.html', section: 'Scientia', ref: 'SC4' },
		{ title: 'Foundational Biomedical Sciences', path: 'Vitalis/1-Foundational-Biomedical-Sciences/index.html', section: 'Vitalis', ref: 'VI1' },
		{ title: 'Biochemistry', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/index.html', section: 'Vitalis > Foundational Biomedical Sciences', ref: 'VI1.2' },
		{ title: 'Lipid and Fatty Acid Metabolism', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-4-Lipid-and-Fatty-Acid-Metabolism/index.html', section: 'Vitalis > Biochemistry', ref: 'VI1.2.4' },
		{ title: 'Beta Oxidation and Ketogenesis', displayTitle: 'Lipid and Fatty Acid Metabolism', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-4-Lipid-and-Fatty-Acid-Metabolism/1-2-4-1-Beta-Oxidation-and-Ketogenesis/index.html', section: 'Vitalis > Biochemistry > Lipid and Fatty Acid Metabolism', ref: 'VI1.2.4.1' },
		{ title: 'Lipoprotein Metabolism', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-4-Lipid-and-Fatty-Acid-Metabolism/1-2-4-3-Lipoprotein-Metabolism/index.html', section: 'Vitalis > Biochemistry > Lipid and Fatty Acid Metabolism', ref: 'VI1.2.4.3' },
		{ title: 'Cholesterol Synthesis', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-4-Lipid-and-Fatty-Acid-Metabolism/1-2-4-2-Cholesterol-Synthesis/index.html', section: 'Vitalis > Biochemistry > Lipid and Fatty Acid Metabolism', ref: 'VI1.2.4.2' },
		{ title: 'Anatomy & Human Structure', path: 'Vitalis/2-Anatomy-and-Human-Structure/index.html', section: 'Vitalis', ref: 'VI2' },
		{ title: 'Physiology', path: 'Vitalis/3-Physiology/index.html', section: 'Vitalis', ref: 'VI3' },
		{ title: 'Pathology', path: 'Vitalis/4-Pathology/index.html', section: 'Vitalis', ref: 'VI4' },
		{ title: 'Pharmacology', path: 'Vitalis/5-Pharmacology/index.html', section: 'Vitalis', ref: 'VI5' },
		{ title: 'Clinical Medicine', path: 'Vitalis/6-Clinical-Medicine/index.html', section: 'Vitalis', ref: 'VI6' },
		{ title: 'Medical Specialties & Subspecialties', path: 'Vitalis/7-Medical-Specialties/index.html', section: 'Vitalis', ref: 'VI7' },
		{ title: 'Advanced & Research Medicine', path: 'Vitalis/8-Advanced-Research-Medicine/index.html', section: 'Vitalis', ref: 'VI8' }
	];

	// Map path -> canonical title from sitemap.json (used to prefer sitemap titles)
	const sitemapTitleMap = Object.create(null);

	// Try to load a generated sitemap (Website/sitemap.json) to include deep/nested pages.
	(async function loadSitemapAndMerge() {
		try {
			// Try multiple locations for sitemap.json so pages served from subpaths
			// (e.g. /Website/Vitalis/) still load the canonical sitemap.
			const candidates = ['sitemap.json', '/sitemap.json', '/Website/sitemap.json'];
			let resp = null;
			let pages = null;
			for (let i = 0; i < candidates.length; i++) {
				try {
					resp = await fetch(candidates[i], { cache: 'no-store' });
					if (resp && resp.ok) {
						pages = await resp.json();
						break;
					}
				} catch (err) {
					// ignore and try next
				}
			}
			if (!pages) return;
			// Map pages into topic shape and merge, avoiding duplicates by path
			const existingPaths = new Set(topics.map(t => normalizePath(t.path)));
			let counter = 1;
			pages.forEach(p => {
				const normalized = normalizePath(p.path || p.rawPath || p.dir || '');
				if (!normalized) return;
				// derive a clean page title: many sitemap entries include " — Section" suffix.
				const rawTitle = (p.title || '');
				const mainTitle = rawTitle.split(' — ')[0].trim() || rawTitle;
				// Save canonical sitemap title for this normalized path (preserve symbols)
				sitemapTitleMap[normalized] = mainTitle;

				if (existingPaths.has(normalized)) {
					// Update existing static topic to use the sitemap's canonical page title
					for (let i = 0; i < topics.length; i++) {
						if (normalizePath(topics[i].path) === normalized) {
							if (mainTitle) topics[i].title = mainTitle;
							topics[i].path = normalized;
							break;
						}
					}
					return;
				}
				existingPaths.add(normalized);
				const parts = (p.dir || p.path || '').split('/');
				const top = parts[0] || '';
				const section = top || (p.section || '');
				const codeMap = { scientia: 'SC', vitalis: 'VI', logos: 'LO', sensus: 'SE' };
				const abbrev = codeMap[top.toLowerCase()] || top.slice(0,2).toUpperCase() || 'PG';
				const ref = `${abbrev}${counter++}`;
				topics.push({ title: mainTitle || parts[parts.length-1] || normalized, path: normalized, section, ref });
			});
			// If the user has an active query, re-run the input event so results include merged pages
			if (searchBar && searchBar.value && searchBar.value.trim().length > 0) {
				try { searchBar.dispatchEvent(new Event('input', { bubbles: true })); } catch (err) { /* ignore */ }
			}
		} catch (err) {
			console.debug('No sitemap.json found or failed to load:', err);
		}
	})();

	function normalizePath(p) {
		if (!p) return '';
		// Remove any leading Website/ or ./, convert windows backslashes
		return p.replace(/^Website[\\\/]?/i, '').replace(/^\.\//, '').replace(/\\/g, '/');
	}

	if (searchBar && searchResults) {
		// Detect current page context
		const currentPath = window.location.pathname;
		let currentContext = 'all';
    
		if (currentPath.includes('Scientia') || currentPath.includes('scientia')) {
			currentContext = 'scientia';
			searchBar.placeholder = 'Search Scientia topics (SC)...';
		} else if (currentPath.includes('Vitalis') || currentPath.includes('vitalis')) {
			currentContext = 'vitalis';
			searchBar.placeholder = 'Search Vitalis topics (VI)...';
		} else if (currentPath.includes('Logos') || currentPath.includes('logos')) {
			currentContext = 'logos';
			searchBar.placeholder = 'Search Logos topics (LO)...';
		} else if (currentPath.includes('Sensus') || currentPath.includes('sensus')) {
			currentContext = 'sensus';
			searchBar.placeholder = 'Search Sensus topics (SE)...';
		}
    
		searchBar.addEventListener('input', function(e) {
			const query = e.target.value.toLowerCase().trim();
      
			if (query.length === 0) {
				searchResults.classList.remove('active');
				searchResults.innerHTML = '';
				return;
			}

			// Filter topics based on current page context (use path/section match so deep pages are included)
			let contextTopics = topics;
			if (currentContext !== 'all') {
				contextTopics = topics.filter(t => (t.path || '').toLowerCase().includes(currentContext) || (t.section || '').toLowerCase().includes(currentContext));
			}

			const matches = contextTopics.filter(topic => {
				// Prefer displayTitle for matching so subpages can present the main title
				// while still being searchable by their specific subtitle.
				const title = ((topic.displayTitle ? topic.displayTitle + ' ' : '') + (topic.title || '')).toLowerCase();
				const section = (topic.section || '').toLowerCase();
				const path = (topic.path || '').toLowerCase();
				const ref = (topic.ref || '').toLowerCase();
				return title.includes(query) || section.includes(query) || path.includes(query) || ref.includes(query);
			});

			if (matches.length > 0) {
				searchResults.innerHTML = matches.map(match => {
					// Prefer sitemap canonical title if available (preserves symbols like β),
					// otherwise fall back to the topic's configured title.
					const titleToShow = sitemapTitleMap[normalizePath(match.path || '')] || match.title || '';
					// Always navigate to the specific page for this match (subsection path).
					const navPath = match.path || '';
					const depth = match.ref ? (match.ref.split('.').length) : 1;
					return `\n          <div class="search-result-item" data-path="${navPath}">\n            <div class="search-result-content">\n              <div class="search-result-title">${titleToShow}</div>\n              <div class="search-result-path">${match.section || ''}</div>\n            </div>\n            <span class="search-ref" data-depth="${depth}">${match.ref || ''}</span>\n          </div>\n        `;
				}).join('');
				searchResults.classList.add('active');

				// We'll use delegated handlers for navigation and toggles (see below)
			} else {
				searchResults.innerHTML = '<div class="search-result-item" style="cursor: default; pointer-events: none;">No results found</div>';
				searchResults.classList.add('active');
			}
		});

		// Close search results when clicking outside
		document.addEventListener('click', function(e) {
			if (!searchBar.contains(e.target) && !searchResults.contains(e.target)) {
				searchResults.classList.remove('active');
			}
		});
    
		// Keep search open when focusing on search bar
		searchBar.addEventListener('focus', function() {
			if (this.value.trim().length > 0) {
				searchResults.classList.add('active');
			}
		});
	}

	// Delegated handler for toggles, theme button, and search results (works even for dynamically-inserted elements)
	if (!window.__uuDelegatedEventsInstalled) {
		window.__uuDelegatedEventsInstalled = true;
		document.body.addEventListener('click', function(e) {
			const toggleBtn = e.target.closest('.toggle-btn');
			if (toggleBtn) {
				e.preventDefault();
				let nextDiv = toggleBtn.nextElementSibling;
				while (nextDiv && !nextDiv.classList.contains('toggle-content')) {
					nextDiv = nextDiv.nextElementSibling;
				}
				if (nextDiv) {
					const isExpanded = nextDiv.classList.contains('expanded');
					if (isExpanded) {
						nextDiv.classList.remove('expanded');
						toggleBtn.classList.remove('expanded');
					} else {
						nextDiv.classList.add('expanded');
						toggleBtn.classList.add('expanded');
					}
				}
				return;
			}

			const resultItem = e.target.closest('.search-result-item');
			if (resultItem) {
				e.preventDefault();
				let targetPath = resultItem.dataset.path || '';
				if (!targetPath) return;
				// Normalize any leading 'Website/' prefix and backslashes so paths resolve from site root
				targetPath = targetPath.replace(/^Website[\\\/]/i, '').replace(/\\/g, '/').replace(/^\/+/, '');
				// Determine whether the site is being served from a '/Website/' subpath and
				// include that prefix if present so links work whether the site is served
				// from the repo root or from within the Website folder.
				let basePrefix = '/';
				const loc = window.location.pathname || '';
				const lower = loc.toLowerCase();
				if (lower.includes('/website/') || lower.startsWith('/website')) {
					basePrefix = '/Website/';
				} else {
					// Also check for common hosting where index.html sits at /Website/index.html
					if (lower.endsWith('/website') || lower === '/website') basePrefix = '/Website/';
				}
				const href = (basePrefix === '/' ? '/' : basePrefix) + targetPath.replace(/^\/+/, '');
				window.location.href = href;
				return;
			}

			const themeBtn = e.target.closest('#themeToggle');
			if (themeBtn) {
				e.preventDefault();
				if (console && console.debug) console.debug('Root theme toggle clicked:', themeBtn, 'target:', e.target);
				try { toggleTheme(e); } catch (err) { console.error(err); }
				return;
			}
		}, false);
	}

	// Pointerup fallback for touch
	document.body.addEventListener('pointerup', function(e) {
		const themeBtn = e.target.closest('#themeToggle');
		if (themeBtn) {
				e.preventDefault();
				if (console && console.debug) console.debug('Root theme toggle pointerup:', themeBtn, 'target:', e.target);
				try { toggleTheme(e); } catch (err) { console.error(err); }
		}
	}, false);

	const form = document.getElementById('contactForm');
	const result = document.getElementById('formResult');
	const submitBtn = form && form.querySelector('button[type="submit"]');

	form && form.addEventListener('submit', async (e)=> {
		e.preventDefault();
		result.textContent = '';
		if (!submitBtn) return;
		submitBtn.disabled = true;

		const email = document.getElementById('email')?.value || '';
		const message = document.getElementById('message')?.value || '';

		try {
			const resp = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, message })
			});

			if (resp.ok) {
				result.textContent = 'Thanks — your message was received.';
				form.reset();
			} else {
				const text = await resp.text().catch(()=>resp.statusText||'Error');
				result.textContent = 'Submission failed: ' + text;
			}
		} catch (err) {
			result.textContent = 'Could not contact server — message not saved locally.';
			console.error(err);
		}

		submitBtn.disabled = false;
	});
	});
}

