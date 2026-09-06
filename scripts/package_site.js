// Build a static-only publication folder. Never publish dependencies or source tools.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
execFileSync(process.execPath, [path.join(__dirname, 'build_en.js')], { stdio: 'inherit' });
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output);
const allowed = new Set(['script.js', 'forms.js', 'analytics.js', 'style.css', 'style.v3.css', 'robots.txt', 'sitemap.xml', '_headers']);
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && (allowed.has(entry.name) || /\.(html|png|jpg|webp|ico|svg)$/.test(entry.name))) {
    fs.copyFileSync(path.join(root, entry.name), path.join(output, entry.name));
  }
}
for (const dir of ['en', 'assets']) fs.cpSync(path.join(root, dir), path.join(output, dir), { recursive: true });
if (!fs.existsSync(path.join(output, 'index.html'))) throw new Error('Missing homepage');
console.log('Static publication folder ready: dist/');
