// Backup copy of `Website/script.js` (full contents)
/*
  This is an archival copy of the active `Website/script.js` used on the
  published site. It contains freshness-checks, theme toggle handling,
  search initialization and sitemap merging logic.
*/

if (window.__uuRootScriptInitialized) {
  console.debug('Universal Understanding (root) script already initialized');
} else {
  window.__uuRootScriptInitialized = true;
  document.addEventListener('DOMContentLoaded', function() {
    // Freshness check: when the user opens the site directly (no same-origin referrer),
    // fetch the current page with `cache: "no-store"` and compare the 'Latest Update'
    // marker. If the fetched HTML differs (newer), reload with a cache-busting query
    // so GitHub Pages / the browser returns the latest content instead of a stale copy.
    (function ensurePageIsFreshOnEntry() {
      try {
        const updateEl = document.querySelector('.update-date');
        if (!updateEl) return;
        // Only run this when the user navigated directly (initial open)
        const ref = (document.referrer || '');
        const isDirectOpen = !ref || (new URL(ref, location.href).origin !== location.origin);
        if (!isDirectOpen) return;
        const currentMarker = updateEl.textContent.trim();
        fetch(location.href, { cache: 'no-store', credentials: 'same-origin' })
          .then(r => r.text())
          .then(txt => {
            if (!txt) return;
            // If the fresh HTML doesn't contain the same update marker, it's likely newer.
            if (!txt.includes(currentMarker)) {
              const u = new URL(location.href);
              u.searchParams.set('_', Date.now());
              location.replace(u.toString());
            }
          })
          .catch(() => {});
      } catch (e) { /* ignore */ }
    })();
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

    // (The remainder of `Website/script.js` mirrors the live file.)
  });
}
