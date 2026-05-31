#!/usr/bin/env node
// Static checks to verify the multilingual setup.

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
let failed = 0;
let passed = 0;

function check(label, cond, details = '') {
  if (cond) {
    passed++;
    console.log(`  OK  ${label}`);
  } else {
    failed++;
    console.log(`FAIL  ${label}${details ? ' — ' + details : ''}`);
  }
}

const PAGES = [
  { fr: 'index.html',                        en: 'en/index.html',         frUrl: 'https://ast-trade.com/',                       enUrl: 'https://ast-trade.com/en/' },
  { fr: 'ananas.html',                       en: 'en/pineapple.html',     frUrl: 'https://ast-trade.com/ananas',                 enUrl: 'https://ast-trade.com/en/pineapple' },
  { fr: 'mangue.html',                       en: 'en/mango.html',         frUrl: 'https://ast-trade.com/mangue',                 enUrl: 'https://ast-trade.com/en/mango' },
  { fr: 'papaye.html',                       en: 'en/papaya.html',        frUrl: 'https://ast-trade.com/papaye',                 enUrl: 'https://ast-trade.com/en/papaya' },
  { fr: 'cajou.html',                        en: 'en/cashew.html',        frUrl: 'https://ast-trade.com/cajou',                  enUrl: 'https://ast-trade.com/en/cashew' },
  { fr: 'karite.html',                       en: 'en/shea-butter.html',   frUrl: 'https://ast-trade.com/karite',                 enUrl: 'https://ast-trade.com/en/shea-butter' },
  { fr: 'mentions-legales.html',             en: 'en/legal-notice.html',  frUrl: 'https://ast-trade.com/mentions-legales',       enUrl: 'https://ast-trade.com/en/legal-notice' },
  { fr: 'conditions-generales.html',         en: 'en/terms.html',         frUrl: 'https://ast-trade.com/conditions-generales',   enUrl: 'https://ast-trade.com/en/terms' },
  { fr: 'politique-confidentialite.html',    en: 'en/privacy-policy.html',frUrl: 'https://ast-trade.com/politique-confidentialite', enUrl: 'https://ast-trade.com/en/privacy-policy' },
];

console.log('=== FR pages ===');
for (const p of PAGES) {
  const h = fs.readFileSync(path.join(REPO, p.fr), 'utf8');
  console.log(`\n${p.fr}`);
  check(`<html lang="fr">`, /<html\s+lang="fr"/i.test(h));
  check(`canonical points to self (${p.frUrl})`, h.includes(`<link rel="canonical" href="${p.frUrl}"`));
  check(`hreflang fr -> self`, h.includes(`<link rel="alternate" hreflang="fr" href="${p.frUrl}"`));
  check(`hreflang en -> clean EN URL (${p.enUrl})`, h.includes(`<link rel="alternate" hreflang="en" href="${p.enUrl}"`));
  check(`hreflang x-default -> FR`, h.includes(`<link rel="alternate" hreflang="x-default" href="${p.frUrl}"`));
  check(`no ?lang=en in head`, !/\?lang=en/.test(h.split('</head>')[0]));
  check(`lang switcher is <a> anchors`, /<a class="lang-btn[^"]*" href="[^"]*" id="btnFR"/.test(h));
}

console.log('\n=== EN pages ===');
for (const p of PAGES) {
  const h = fs.readFileSync(path.join(REPO, p.en), 'utf8');
  console.log(`\n${p.en}`);
  check(`<html lang="en">`, /<html\s+lang="en"/i.test(h));
  check(`canonical points to self (${p.enUrl})`, h.includes(`<link rel="canonical" href="${p.enUrl}"`));
  check(`hreflang fr -> FR counterpart (${p.frUrl})`, h.includes(`<link rel="alternate" hreflang="fr" href="${p.frUrl}"`));
  check(`hreflang en -> self`, h.includes(`<link rel="alternate" hreflang="en" href="${p.enUrl}"`));
  check(`hreflang x-default -> FR`, h.includes(`<link rel="alternate" hreflang="x-default" href="${p.frUrl}"`));
  check(`no ?lang=en anywhere`, !/\?lang=en/.test(h));
  check(`no link to FR slug (except in hreflang/switcher)`, true /* covered by per-page link check below */);

  // Resource URLs must be root-relative (so they resolve correctly from /en/...)
  check(`script.js loads from /script.js`, /src="\/script\.js/.test(h));
  check(`stylesheet from /style.v3.css`, /href="\/style\.v3\.css/.test(h));
  check(`logo from /logo.png`, /src="\/logo\.png"/.test(h));

  // No accidental FR-slug links remaining in body (except in lang switcher/hreflang).
  // Strip head and lang-switcher, then check.
  const head = h.split('</head>')[0];
  const body = h.split('</head>')[1] || '';
  const cleanBody = body.replace(/<div class="lang-switcher"[\s\S]*?<\/div>/, '');
  const frSlugs = ['/ananas', '/mangue', '/papaye', '/cajou', '/karite', '/mentions-legales', '/conditions-generales', '/politique-confidentialite'];
  for (const s of frSlugs) {
    // It's OK for FR slug to appear in og:url? No — og:url should be the EN URL. We replaced it.
    // Look for it as a link target.
    const re = new RegExp(`href="${s.replace(/\//g, '\\/')}"`, 'g');
    const m = cleanBody.match(re);
    if (m) {
      check(`no link to ${s} in body`, false, `found ${m.length}x in ${p.en}`);
    }
  }
}

console.log('\n=== Sitemap ===');
const sitemap = fs.readFileSync(path.join(REPO, 'sitemap.xml'), 'utf8');
const requiredUrls = [
  'https://ast-trade.com/',
  'https://ast-trade.com/en/',
  'https://ast-trade.com/ananas',
  'https://ast-trade.com/en/pineapple',
  'https://ast-trade.com/mangue',
  'https://ast-trade.com/en/mango',
  'https://ast-trade.com/papaye',
  'https://ast-trade.com/en/papaya',
  'https://ast-trade.com/cajou',
  'https://ast-trade.com/en/cashew',
  'https://ast-trade.com/karite',
  'https://ast-trade.com/en/shea-butter',
];
for (const url of requiredUrls) {
  check(`sitemap contains ${url}`, sitemap.includes(`<loc>${url}</loc>`));
}
check(`sitemap declares xhtml namespace`, sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
check(`sitemap has hreflang annotations`, sitemap.includes('<xhtml:link rel="alternate" hreflang='));

// Pricing is never public on this B2B export site, so Product/Offer structured
// data that requires a price must never reappear — it triggers a Google
// "missing price/priceSpecification.price in offers" rich-result error.
console.log('\n=== Structured data: no price-requiring schema ===');
const FORBIDDEN_SCHEMA = [
  /"@type"\s*:\s*"Product"/,
  /"@type"\s*:\s*"Offer"/,
  /"offers"\s*:/,
  /"priceSpecification"/,
  /"price"\s*:/,
  /property="og:price/,
  /property="product:price/,
];
for (const p of PAGES) {
  for (const rel of [p.fr, p.en]) {
    const h = fs.readFileSync(path.join(REPO, rel), 'utf8');
    const hit = FORBIDDEN_SCHEMA.find((re) => re.test(h));
    check(`${rel} has no Product/Offer/price schema`, !hit, hit ? `matched ${hit}` : '');
  }
}

console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===`);
process.exit(failed ? 1 : 0);
