#!/usr/bin/env node
// Update FR pages: change ?lang=en hreflang to clean /en/... URLs, and update
// the language switcher to be cross-page anchor links instead of in-place toggles.

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');

const FR_PAGES = [
  { file: 'index.html',                    frPath: '/',                       enPath: '/en/' },
  { file: 'ananas.html',                   frPath: '/ananas',                 enPath: '/en/pineapple' },
  { file: 'mangue.html',                   frPath: '/mangue',                 enPath: '/en/mango' },
  { file: 'papaye.html',                   frPath: '/papaye',                 enPath: '/en/papaya' },
  { file: 'cajou.html',                    frPath: '/cajou',                  enPath: '/en/cashew' },
  { file: 'karite.html',                   frPath: '/karite',                 enPath: '/en/shea-butter' },
  { file: 'mentions-legales.html',         frPath: '/mentions-legales',       enPath: '/en/legal-notice' },
  { file: 'conditions-generales.html',     frPath: '/conditions-generales',   enPath: '/en/terms' },
  { file: 'politique-confidentialite.html',frPath: '/politique-confidentialite', enPath: '/en/privacy-policy' },
];

for (const p of FR_PAGES) {
  const filePath = path.join(REPO, p.file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Strip existing canonical + alternate links, then re-inject the right block.
  html = html.replace(/\s*<link\s+rel="canonical"[^>]*>\s*/g, '\n  ');
  html = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]+"[^>]*>\s*/g, '\n  ');

  const canonicalAbs = `https://ast-trade.com${p.frPath}`;
  const enAbs = `https://ast-trade.com${p.enPath}`;
  const seoBlock =
    `  <link rel="canonical" href="${canonicalAbs}" />\n` +
    `  <link rel="alternate" hreflang="fr" href="${canonicalAbs}" />\n` +
    `  <link rel="alternate" hreflang="en" href="${enAbs}" />\n` +
    `  <link rel="alternate" hreflang="x-default" href="${canonicalAbs}" />\n`;

  html = html.replace(
    /(<meta\s+name="description"[^>]*>)/,
    `$1\n${seoBlock.trimEnd()}`
  );

  // Update language switcher: convert <button>s into cross-page <a> links.
  html = html.replace(
    /<div class="lang-switcher" id="langSwitcher">[\s\S]*?<\/div>/,
    `<div class="lang-switcher" id="langSwitcher">\n` +
    `        <a class="lang-btn active" href="${p.frPath}" id="btnFR" hreflang="fr" rel="alternate" aria-current="page">FR</a>\n` +
    `        <a class="lang-btn" href="${p.enPath}" id="btnEN" hreflang="en" rel="alternate">EN</a>\n` +
    `      </div>`
  );

  fs.writeFileSync(filePath, html);
  console.log(`updated ${p.file}`);
}

console.log('done.');
