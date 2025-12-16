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
  const topics = [
    { title: 'Mathematical Foundations', path: 'Website/Scientia/1-Mathematical-Foundations/index.html', section: 'Scientia', ref: 'SC1' },
    { title: 'Algebra & Functions', path: 'Website/Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.1' },
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
    { title: 'Foundational Biomedical Sciences', path: 'Website/Vitalis/1-Foundational-Biomedical-Sciences/index.html', section: 'Vitalis', ref: 'VI1' },
    { title: 'Anatomy & Human Structure', path: 'Vitalis/2-Anatomy-and-Human-Structure/index.html', section: 'Vitalis', ref: 'VI2' },
    { title: 'Physiology', path: 'Vitalis/3-Physiology/index.html', section: 'Vitalis', ref: 'VI3' },
    { title: 'Pathology', path: 'Vitalis/4-Pathology/index.html', section: 'Vitalis', ref: 'VI4' },
    { title: 'Pharmacology', path: 'Vitalis/5-Pharmacology/index.html', section: 'Vitalis', ref: 'VI5' },
    { title: 'Clinical Medicine', path: 'Vitalis/6-Clinical-Medicine/index.html', section: 'Vitalis', ref: 'VI6' },
    { title: 'Medical Specialties & Subspecialties', path: 'Vitalis/7-Medical-Specialties/index.html', section: 'Vitalis', ref: 'VI7' },
    { title: 'Advanced & Research Medicine', path: 'Vitalis/8-Advanced-Research-Medicine/index.html', section: 'Vitalis', ref: 'VI8' }
  ];

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

      // Filter topics based on context by ref code
      let contextTopics = topics;
      if (currentContext === 'scientia') {
        contextTopics = topics.filter(t => t.ref.startsWith('SC'));
      } else if (currentContext === 'vitalis') {
        contextTopics = topics.filter(t => t.ref.startsWith('VI'));
      } else if (currentContext === 'logos') {
        contextTopics = topics.filter(t => t.ref.startsWith('LO'));
      } else if (currentContext === 'sensus') {
        contextTopics = topics.filter(t => t.ref.startsWith('SE'));
      }

      const matches = contextTopics.filter(topic => 
        topic.title.toLowerCase().includes(query) || 
        topic.section.toLowerCase().includes(query) ||
        topic.ref.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        searchResults.innerHTML = matches.map(match => `
          <div class="search-result-item" data-path="${match.path}">
            <div class="search-result-content">
              <div class="search-result-title">${match.title}</div>
              <div class="search-result-path">${match.section}</div>
            </div>
            <span class="search-ref">${match.ref}</span>
          </div>
        `).join('');
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
        const targetPath = resultItem.dataset.path;
        if (!targetPath) return;
        const currentPath = window.location.pathname;
        const pathWithoutFile = currentPath.substring(0, currentPath.lastIndexOf('/'));
        const cleanPath = pathWithoutFile.replace(/^\/+|\/+$/g, '');
        const depth = cleanPath === '' ? 0 : cleanPath.split('/').length;
        let relativePath = '';
        for (let i = 0; i < depth; i++) relativePath += '../';
        relativePath += targetPath;
        window.location.href = relativePath;
        return;
      }

      const themeBtn = e.target.closest('#themeToggle');
      if (themeBtn) {
        e.preventDefault();
        console.debug('Root theme toggle clicked:', themeBtn, 'target:', e.target);
        const isLightMode = body.classList.toggle('light-mode');
        themeBtn.textContent = isLightMode ? 'Light' : 'Dark';
        themeBtn.setAttribute('aria-pressed', isLightMode ? 'true' : 'false');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        return;
      }
    }, false);
  }

  // Pointerup fallback for touch
  document.body.addEventListener('pointerup', function(e) {
    const themeBtn = e.target.closest('#themeToggle');
    if (themeBtn) {
      e.preventDefault();
      console.debug('Root theme toggle pointerup:', themeBtn, 'target:', e.target);
      const isLightMode = body.classList.toggle('light-mode');
      themeBtn.textContent = isLightMode ? 'Light' : 'Dark';
      themeBtn.setAttribute('aria-pressed', isLightMode ? 'true' : 'false');
      localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
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