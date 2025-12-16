const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'Website');
const out = path.join(root, 'sitemap.json');

function walk(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) {
      results.push(...walk(full));
    } else if (it.isFile() && it.name.toLowerCase() === 'index.html') {
      const rel = path.relative(root, full).replace(/\\/g, '/');
      // Read title from file if present
      let title = '';
      try {
        const html = fs.readFileSync(full, 'utf8');
        const m = html.match(/<title>([^<]+)<\/title>/i) || html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        if (m) title = m[1].trim();
      } catch (e) {}
      if (!title) {
        // derive title from path segments
        const parts = path.dirname(rel).split('/');
        title = parts[parts.length - 1] || 'Home';
      }
      results.push({ title, path: rel, dir: path.dirname(rel).replace(/\\/g, '/'), rawPath: rel });
    }
  }
  return results;
}

const pages = walk(root).sort((a,b)=> a.title.localeCompare(b.title));
fs.writeFileSync(out, JSON.stringify(pages, null, 2), 'utf8');
console.log('Wrote', out, 'with', pages.length, 'entries');
