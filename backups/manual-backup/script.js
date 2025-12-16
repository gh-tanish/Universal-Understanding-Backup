// Backup copy of root `script.js` (full contents)
/*
	This is an archival copy of the current repository root `script.js`.
	It includes the root freshness guard, theme-toggle guard, and search logic.
*/

if (window.__uuRootScriptInitialized) {
	console.debug('Universal Understanding (root) script already initialized');
} else {
	window.__uuRootScriptInitialized = true;
	document.addEventListener('DOMContentLoaded', function() {
	// Root-level freshness guard: when the site is opened directly (no referrer),
	// fetch the current URL with `no-store` and compare HTML. If the server
	// returns a different version, reload with a cache-busting query so the
	// browser / CDN yields the newest content. Run at most once per session.
	(function rootFreshnessGuard() {
		try {
			if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('__uuFreshnessChecked')) return;
			const ref = (document.referrer || '');
			const isDirectOpen = !ref || (new URL(ref, location.href).origin !== location.origin);
			if (!isDirectOpen) return;
			fetch(location.href, { cache: 'no-store', credentials: 'same-origin' })
				.then(r => r.text())
				.then(txt => {
					if (!txt) return;
					try {
						const current = document.documentElement.outerHTML;
						if (txt !== current) {
							try { if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('__uuFreshnessChecked', '1'); } catch (e) {}
							const u = new URL(location.href);
							u.searchParams.set('_', Date.now());
							location.replace(u.toString());
						}
					} catch (e) { /* ignore comparison errors */ }
				}).catch(()=>{});
		} catch (e) { /* ignore */ }
	})();
	// Theme toggle functionality (ensure a toggle exists)
	let themeToggle = document.getElementById('themeToggle');
	const htmlElement = document.documentElement;
	const body = document.body;

	// Load saved theme preference
	const savedTheme = localStorage.getItem('theme') || 'dark';
	if (savedTheme === 'light') {
		body.classList.add('light-mode');
	} else {
		body.classList.remove('light-mode');
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
		function toggleTheme(e) {
			if (e && e.preventDefault) { e.preventDefault(); }
			const isLightMode = body.classList.toggle('light-mode');
			htmlElement.classList.toggle('light-mode', isLightMode);
			themeToggle.textContent = isLightMode ? 'Light' : 'Dark';
			themeToggle.setAttribute('aria-pressed', isLightMode ? 'true' : 'false');
			localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
		}
		themeToggle.addEventListener('click', toggleTheme, { passive: false });
		themeToggle.addEventListener('touchend', function(e) { e.preventDefault(); toggleTheme(); }, { passive: false });
		themeToggle.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); } });
	}
		// Fail-safe: only attach direct listeners when both the toggle element and
		// the toggle function are available. This prevents runtime exceptions on
		// pages where the nav or button was not present at load.
		if (typeof toggleTheme === 'function' && themeToggle) {
			themeToggle.style.pointerEvents = 'auto';
			themeToggle.disabled = false;
			function directToggleHandler(e) {
				console.debug('Direct theme toggle fired (Root):', e.type, e.target);
				e.stopPropagation();
				if (e.preventDefault) e.preventDefault();
				try { toggleTheme(e); } catch (err) { console.error(err); }
			}
			themeToggle.addEventListener('pointerup', directToggleHandler, {passive: false});
			themeToggle.addEventListener('click', directToggleHandler, {passive: false});
		}

	// Search functionality
	const searchBar = document.getElementById('siteSearch');
	const searchResults = document.getElementById('searchResults');
  
	// Define searchable topics
	const topics = [ /* trimmed in backup */ ];

	// rest of script mirrored in Website backup
	});
}
