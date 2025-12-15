# Fix all Biochemistry HTML files to match the correct template

$files = @(
    "Website/Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-2-Enzyme-Kinetics-and-Regulation/index.html",
    "Website/Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-3-Carbohydrate-Metabolism/index.html",
    "Website/Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-4-Lipid-and-Fatty-Acid-Metabolism/index.html",
    "Website/Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-5-Nucleotide-and-Nucleic-Acid-Metabolism/index.html",
    "Website/Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-6-Energy-Metabolism-and-Bioenergetics/index.html",
    "Website/Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-7-Clinical-Metabolic-Disorders/index.html"
)

foreach ($file in $files) {
    $fullPath = Join-Path "c:\Users\Tanish!\OneDrive\Universal Understanding" $file
    $content = Get-Content $fullPath -Raw
    
    # Replace the old navbar structure with top-nav
    $content = $content -replace '<nav class="navbar">.*?</nav>', @'
<nav class="top-nav">
    <ul>
      <li><a href="../../../../index.html">Home</a></li>
      <li><a href="../../../../Scientia/index.html">Scientia</a></li>
      <li><a href="../../../index.html" class="active">Vitalis</a></li>
      <li><a href="../../../../Logos/index.html">Logos</a></li>
      <li><a href="../../../../Sensus/index.html">Sensus</a></li>
      <li class="search-container">
        <input type="text" id="siteSearch" class="search-bar" placeholder="Search topics..." autocomplete="off">
        <div id="searchResults" class="search-results"></div>
      </li>
      <li><button class="theme-toggle" id="themeToggle">Dark</button></li>
    </ul>
  </nav>
'@
    
    # Replace page-header with site-header
    $content = $content -replace '<header class="page-header">.*?</header>', @'
<header class="site-header container">
    <div>
      <a class="back-link" href="../index.html">← Back to Biochemistry</a>
      <h1>TITLE_PLACEHOLDER</h1>
    </div>
  </header>
'@
    
    # Replace section-grid structure
    $content = $content -replace '<div class="section-grid">', '<div class="section-grid">'
    $content = $content -replace '<span class="card-ref">(.*?)</span>\s*<h3>', '<h3>'
    $content = $content -replace '</p>\s*</a>', '</p><div class="section-actions"><span class="btn">Open</span><span class="card-ref">REF_PLACEHOLDER</span></div></a>'
    
    # Fix footer
    $content = $content -replace '<footer>.*?</footer>', @'
<footer>
    <p>Developer: Tanish Paul</p>
  </footer>
'@
    
    # Fix DOCTYPE and meta
    $content = $content -replace '<!DOCTYPE html>', '<!doctype html>'
    $content = $content -replace '<meta charset="UTF-8">', '<meta charset="utf-8" />'
    $content = $content -replace '<meta name="viewport" content="width=device-width, initial-scale=1.0">', '<meta name="viewport" content="width=device-width,initial-scale=1" />'
    
    # Remove standalone script tag and add defer
    $content = $content -replace '<script src="../../../../script.js"></script>', ''
    $content = $content -replace '</head>', '  <script defer src="../../../../script.js"></script></head>'
    
    Set-Content $fullPath $content -NoNewline
}

Write-Host "Fixed subcategory files"
