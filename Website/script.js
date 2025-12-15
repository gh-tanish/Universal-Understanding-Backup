document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;
  const body = document.body;
  
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    if (themeToggle) themeToggle.textContent = 'Light';
  } else {
    body.classList.remove('light-mode');
    if (themeToggle) themeToggle.textContent = 'Dark';
  }
  
  // Theme toggle function
  function toggleTheme(e) {
    e.preventDefault();
    e.stopPropagation();
    const isLightMode = body.classList.toggle('light-mode');
    themeToggle.textContent = isLightMode ? 'Light' : 'Dark';
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  }
  
  // Theme toggle button handlers - support both click and touch
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme, { passive: false });
    themeToggle.addEventListener('touchend', toggleTheme, { passive: false });
  }

  // Search functionality
  const searchBar = document.getElementById('siteSearch');
  const searchResults = document.getElementById('searchResults');
  
  // Define searchable topics with relative paths (no leading slash)
  const topics = [
    { title: 'Mathematical Foundations', path: 'Scientia/1-Mathematical-Foundations/index.html', section: 'Scientia', ref: 'SC1' },
    { title: 'Algebra & Functions', path: 'Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.1' },
    { title: 'Calculus', path: 'Scientia/1-Mathematical-Foundations/1-2-Calculus/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.2' },
    { title: 'Linear Algebra', path: 'Scientia/1-Mathematical-Foundations/1-3-Linear-Algebra/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.3' },
    { title: 'Differential Equations', path: 'Scientia/1-Mathematical-Foundations/1-4-Differential-Equations/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.4' },
    { title: 'Complex Numbers & Complex Analysis', path: 'Scientia/1-Mathematical-Foundations/1-5-Complex-Numbers/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.5' },
    { title: 'Vector & Tensor Calculus', path: 'Scientia/1-Mathematical-Foundations/1-6-Vector-and-Tensor-Calculus/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.6' },
    { title: 'Differential Geometry', path: 'Scientia/1-Mathematical-Foundations/1-7-Differential-Geometry/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.7' },
    { title: 'Probability & Statistics', path: 'Scientia/1-Mathematical-Foundations/1-8-Probability-and-Statistics/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.8' },
    { title: 'Fourier & Transform Methods', path: 'Scientia/1-Mathematical-Foundations/1-9-Fourier-and-Transform-Methods/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.9' },
    { title: 'Group Theory Basics', path: 'Scientia/1-Mathematical-Foundations/1-10-Group-Theory-Basics/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.10' },
    { title: 'Number Theory', path: 'Scientia/1-Mathematical-Foundations/1-11-Number-Theory/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.11' },
    { title: 'Topology Basics', path: 'Scientia/1-Mathematical-Foundations/1-12-Topology-Basics/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.12' },
    { title: 'Advanced Linear Algebra & Functional Analysis', path: 'Scientia/1-Mathematical-Foundations/1-13-Advanced-Linear-Algebra/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.13' },
    { title: 'Transcendental Functions', path: 'Scientia/1-Mathematical-Foundations/1-14-Transcendental-Functions/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.14' },
    { title: 'Physics Foundations', path: 'Scientia/2-Physics-Foundations/index.html', section: 'Scientia', ref: 'SC2' },
    { title: 'Quantum Mechanics', path: 'Scientia/3-Quantum-Mechanics/index.html', section: 'Scientia', ref: 'SC3' },
    { title: 'Relativity', path: 'Scientia/4-Relativity/index.html', section: 'Scientia', ref: 'SC4' },
    { title: 'Foundational Biomedical Sciences', path: 'Vitalis/1-Foundational-Biomedical-Sciences/index.html', section: 'Vitalis', ref: 'VI1' },
    { title: 'Cellular & Molecular Biology', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/index.html', section: 'Vitalis > Foundational Biomedical Sciences', ref: 'VI1.1' },
    { title: 'Biochemistry', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/index.html', section: 'Vitalis > Foundational Biomedical Sciences', ref: 'VI1.2' },
    { title: 'Molecular Genetics', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-3-Molecular-Genetics/index.html', section: 'Vitalis > Foundational Biomedical Sciences', ref: 'VI1.3' },
    { title: 'Chemistry For Medicine', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-4-Chemistry-For-Medicine/index.html', section: 'Vitalis > Foundational Biomedical Sciences', ref: 'VI1.4' },
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

        // Add click handlers to results
        document.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', function() {
            const targetPath = this.dataset.path;
            
            // Get current URL and normalize to forward slashes
            const currentUrl = window.location.href.replace(/\\/g, '/');
            
            // Find where "Website" folder is in the path (case-insensitive)
            const lowerUrl = currentUrl.toLowerCase();
            const websiteIdx = lowerUrl.lastIndexOf('/website/');
            
            if (websiteIdx === -1) {
              // Can't find Website folder, try direct navigation
              window.location.href = targetPath;
              return;
            }
            
            // Get the part after /website/ (this is our current location relative to Website root)
            const afterWebsite = currentUrl.substring(websiteIdx + 9); // 9 = length of '/website/'
            
            // Split by slashes and count directories (exclude the .html file and empty parts)
            const parts = afterWebsite.split('/').filter(part => {
              return part && part.trim() !== '' && !part.match(/\.html?$/i);
            });
            
            const depth = parts.length;
            
            console.log('Current URL:', currentUrl);
            console.log('After Website:', afterWebsite);
            console.log('Parts:', parts);
            console.log('Depth:', depth);
            console.log('Target:', targetPath);
            
            // Build relative path: go up 'depth' levels, then navigate to target
            let relativePath = '';
            for (let i = 0; i < depth; i++) {
              relativePath += '../';
            }
            relativePath += targetPath;
            
            console.log('Final relative path:', relativePath);
            
            window.location.href = relativePath;
          });
        });
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

  // Toggle function for expandable content
  var toggleButtons = document.querySelectorAll('.toggle-btn');
  
  toggleButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var nextDiv = this.nextElementSibling;
      while (nextDiv && !nextDiv.classList.contains('toggle-content')) {
        nextDiv = nextDiv.nextElementSibling;
      }
      
      if (nextDiv) {
        var isExpanded = nextDiv.classList.contains('expanded');
        if (isExpanded) {
          nextDiv.classList.remove('expanded');
          this.classList.remove('expanded');
        } else {
          nextDiv.classList.add('expanded');
          this.classList.add('expanded');
        }
      }
    });
  });

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