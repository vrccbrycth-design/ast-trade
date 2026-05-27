#!/usr/bin/env node
// Build /en/ pages from FR templates by applying the EN translations
// defined in script.js. Writes server-rendered English HTML so search
// engines see English content in the initial response.

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const scriptSrc = fs.readFileSync(path.join(REPO, 'script.js'), 'utf8');

// Extract the translations.en object literal between "translations = {" and the matching "};"
function extractTranslations(src) {
  const startMarker = 'const translations = {';
  const start = src.indexOf(startMarker);
  if (start < 0) throw new Error('translations block not found');
  let i = start + startMarker.length;
  let depth = 1;
  let inStr = null;
  let esc = false;
  while (i < src.length && depth > 0) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === inStr) inStr = null;
    } else {
      if (c === '"' || c === "'" || c === '`') inStr = c;
      else if (c === '/' && src[i + 1] === '/') {
        while (i < src.length && src[i] !== '\n') i++;
        continue;
      } else if (c === '{') depth++;
      else if (c === '}') depth--;
    }
    i++;
  }
  const body = '({' + src.slice(start + startMarker.length, i - 1) + '})';
  // eslint-disable-next-line no-eval
  const obj = eval(body);
  return obj.en;
}

const EN = extractTranslations(scriptSrc);

// FR -> EN page mapping (slug only). Each FR slug => EN slug.
const PAGES = [
  { fr: 'index.html',                       en: 'en/index.html',         frPath: '/',                       enPath: '/en/',                              kind: 'home' },
  { fr: 'ananas.html',                      en: 'en/pineapple.html',     frPath: '/ananas',                 enPath: '/en/pineapple',                     kind: 'product', product: 'ananas' },
  { fr: 'mangue.html',                      en: 'en/mango.html',         frPath: '/mangue',                 enPath: '/en/mango',                         kind: 'product', product: 'mangue' },
  { fr: 'papaye.html',                      en: 'en/papaya.html',        frPath: '/papaye',                 enPath: '/en/papaya',                        kind: 'product', product: 'papaye' },
  { fr: 'cajou.html',                       en: 'en/cashew.html',        frPath: '/cajou',                  enPath: '/en/cashew',                        kind: 'product', product: 'cajou' },
  { fr: 'karite.html',                      en: 'en/shea-butter.html',   frPath: '/karite',                 enPath: '/en/shea-butter',                   kind: 'product', product: 'karite' },
  { fr: 'mentions-legales.html',            en: 'en/legal-notice.html',  frPath: '/mentions-legales',       enPath: '/en/legal-notice',                  kind: 'legal' },
  { fr: 'conditions-generales.html',        en: 'en/terms.html',         frPath: '/conditions-generales',   enPath: '/en/terms',                         kind: 'legal' },
  { fr: 'politique-confidentialite.html',   en: 'en/privacy-policy.html',frPath: '/politique-confidentialite', enPath: '/en/privacy-policy',             kind: 'legal' },
];

const FR_TO_EN_PATH = Object.fromEntries(PAGES.map(p => [p.frPath, p.enPath]));

// Per-page meta translations (title, description, og:title, og:description, twitter:*).
// Hand-curated because translations dict doesn't include these.
const META = {
  '/': {
    title: 'AST Trade International — Tropical produce export from Benin to Europe',
    description: 'AST Trade International helps importers, wholesalers and distributors source tropical produce from Benin: pineapple, mango, papaya, cashew and shea butter.',
    ogTitle: 'AST Trade International — Your tropical fruit import partner from West Africa',
    ogDescription: 'Direct supply chain from West Africa: Sugarloaf pineapple, Kent mango, cashew, shea butter. Certified quality, controlled delivery.',
    twitterTitle: 'AST Trade International — West Africa tropical fruit export',
    twitterDescription: 'B2B exporter of premium West African agricultural produce to the world.',
  },
  '/ananas': {
    title: 'Sugarloaf Pineapple from Benin — Supplier for European importers',
    description: 'Import Sugarloaf pineapple from Benin with AST Trade International. Direct supply chain, quality control, export documentation and logistics support for B2B buyers.',
    ogTitle: 'Sugarloaf Pineapple PGI — AST Trade International',
    ogDescription: 'Sugarloaf Pineapple PGI from Allada, Benin. White flesh, low acidity, high sugar content. Supplier for importers and wholesalers.',
    twitterTitle: 'Sugarloaf Pineapple PGI — AST Trade International',
    twitterDescription: 'Sugarloaf Pineapple PGI from Allada, Benin. White flesh, low acidity, high sugar content. Supplier for importers and wholesalers.',
  },
  '/mangue': {
    title: 'Kent Mango from Benin — Supplier for European importers',
    description: 'Import Kent mango from Benin with AST Trade International. Direct supply chain, quality control, export documents and logistics support for B2B buyers.',
    ogTitle: 'Kent Mango — AST Trade International',
    ogDescription: 'Kent Mango from Benin. Melt-in-the-mouth flesh, resilient skin, ideal for long-distance export. Supplier for importers and wholesalers.',
    twitterTitle: 'Kent Mango — AST Trade International',
    twitterDescription: 'Kent Mango from Benin. Melt-in-the-mouth flesh, resilient skin, ideal for long-distance export.',
  },
  '/papaye': {
    title: 'Solo Papaya from Benin — Supplier for European importers',
    description: 'Import Solo papaya from Benin with AST Trade International. Direct supply chain, quality control, export documents and logistics support for B2B buyers.',
    ogTitle: 'Solo Papaya — AST Trade International',
    ogDescription: 'Solo Papaya from Benin. Single-serve size, fragrant orange flesh, suited to air freight. Supplier for importers and wholesalers.',
    twitterTitle: 'Solo Papaya — AST Trade International',
    twitterDescription: 'Solo Papaya from Benin. Single-serve size, fragrant orange flesh, suited to air freight.',
  },
  '/cajou': {
    title: 'Cashew Nuts from Benin — Supplier for European importers',
    description: 'Import cashew nuts (kernels and RCN) from Benin with AST Trade International. Direct supply chain, grading, export documents and logistics support for B2B buyers.',
    ogTitle: 'Cashew Nuts — AST Trade International',
    ogDescription: 'W240 dried cashew kernels (Grade Extra/I) and raw cashew nuts from Benin. Mild flavour, ivory colour, long shelf life.',
    twitterTitle: 'Cashew Nuts — AST Trade International',
    twitterDescription: 'W240 dried cashew kernels and raw cashew nuts from Benin. Mild flavour, ivory colour, long shelf life.',
  },
  '/karite': {
    title: 'Shea Butter from Benin — Supplier for European importers',
    description: 'Import raw unrefined Grade A shea butter from Benin with AST Trade International. Cosmetic and food grade, traditional extraction by women\'s cooperatives.',
    ogTitle: 'Shea Butter — AST Trade International',
    ogDescription: 'Raw unrefined Grade A shea butter from Benin. Cosmetic, pharmaceutical and food applications.',
    twitterTitle: 'Shea Butter — AST Trade International',
    twitterDescription: 'Raw unrefined Grade A shea butter from Benin. Cosmetic, pharmaceutical and food applications.',
  },
  '/mentions-legales': {
    title: 'Legal notice — AST Trade International',
    description: 'Legal notice for AST Trade International SARL: site publisher, hosting, intellectual property and liability.',
    ogTitle: 'Legal notice — AST Trade International',
    ogDescription: 'Legal information for ast-trade.com: publisher, hosting, intellectual property and liability.',
  },
  '/conditions-generales': {
    title: 'General terms — AST Trade International',
    description: 'General commercial terms applicable to enquiries sent to AST Trade International via ast-trade.com.',
    ogTitle: 'General terms — AST Trade International',
    ogDescription: 'Commercial framework for AST Trade International enquiries: scope, quotes, prices, orders, logistics and applicable law.',
  },
  '/politique-confidentialite': {
    title: 'Privacy policy — AST Trade International',
    description: 'Privacy policy of AST Trade International: data collected via the contact form, purpose, retention, your rights and contact for any request.',
    ogTitle: 'Privacy policy — AST Trade International',
    ogDescription: 'Personal data processing on ast-trade.com: data collected, purpose, retention and rights.',
  },
};

function escapeHtmlAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Apply EN translations to a single HTML string.
function translateHtml(html, page) {
  // 1. Set <html lang="en">
  html = html.replace(/<html\s+lang="fr"/i, '<html lang="en"');

  // 2. Replace [data-i18n] elements' inner HTML with EN translations.
  // Handles <tag ... data-i18n="key" ...>...</tag>
  html = html.replace(
    /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?\bdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g,
    (m, tag, attrs, key, inner) => {
      if (EN[key] === undefined) return m; // leave as-is
      // Self-closing-ish tags are fine here since the regex required a closing tag
      return `<${tag}${attrs}>${EN[key]}</${tag}>`;
    }
  );

  // 3. Replace placeholders for [data-i18n-placeholder]
  html = html.replace(
    /(<[^>]*?\bdata-i18n-placeholder="([^"]+)"[^>]*?\bplaceholder=")([^"]*)("[^>]*>)/g,
    (m, pre, key, _ph, post) => {
      if (EN[key] === undefined) return m;
      return pre + escapeHtmlAttr(EN[key]) + post;
    }
  );
  // Also the reverse order (placeholder before data-i18n-placeholder)
  html = html.replace(
    /(<[^>]*?\bplaceholder=")([^"]*)("[^>]*?\bdata-i18n-placeholder="([^"]+)"[^>]*>)/g,
    (m, pre, _ph, post, key) => {
      if (EN[key] === undefined) return m;
      return pre + escapeHtmlAttr(EN[key]) + post;
    }
  );

  // 4. Update <title> and <meta name="description">
  const meta = META[page.frPath];
  if (meta) {
    if (meta.title) {
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
    }
    if (meta.description) {
      html = html.replace(
        /(<meta\s+name="description"\s+content=")[^"]*(")/,
        `$1${escapeHtmlAttr(meta.description)}$2`
      );
      // Also accept content first attribute form
      html = html.replace(
        /(<meta\s+name="description"[^>]*content=")[^"]*(")/,
        `$1${escapeHtmlAttr(meta.description)}$2`
      );
    }
    if (meta.ogTitle) {
      html = html.replace(
        /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
        `$1${escapeHtmlAttr(meta.ogTitle)}$2`
      );
    }
    if (meta.ogDescription) {
      html = html.replace(
        /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
        `$1${escapeHtmlAttr(meta.ogDescription)}$2`
      );
    }
    if (meta.twitterTitle) {
      html = html.replace(
        /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
        `$1${escapeHtmlAttr(meta.twitterTitle)}$2`
      );
    }
    if (meta.twitterDescription) {
      html = html.replace(
        /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
        `$1${escapeHtmlAttr(meta.twitterDescription)}$2`
      );
    }
  }

  // 5. Update og:locale to en_US
  html = html.replace(
    /(<meta\s+property="og:locale"\s+content=")[^"]*(")/,
    `$1en_US$2`
  );

  // 6. Update og:url to the EN absolute URL
  html = html.replace(
    /(<meta\s+property="og:url"\s+content="https:\/\/ast-trade\.com)[^"]*(")/,
    `$1${page.enPath}$2`
  );

  // 7. Canonical & hreflang. Strip existing canonical + alternate links, then inject correct block.
  html = html.replace(/\s*<link\s+rel="canonical"[^>]*>\s*/g, '\n  ');
  html = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]+"[^>]*>\s*/g, '\n  ');

  const canonicalAbs = `https://ast-trade.com${page.enPath}`;
  const frAbs = `https://ast-trade.com${page.frPath}`;
  const seoBlock =
    `  <link rel="canonical" href="${canonicalAbs}" />\n` +
    `  <link rel="alternate" hreflang="fr" href="${frAbs}" />\n` +
    `  <link rel="alternate" hreflang="en" href="${canonicalAbs}" />\n` +
    `  <link rel="alternate" hreflang="x-default" href="${frAbs}" />\n`;

  // Insert seo block before the </head> — actually right after the meta description for tidiness.
  html = html.replace(
    /(<meta\s+name="description"[^>]*>)/,
    `$1\n${seoBlock.trimEnd()}`
  );

  // 8. Rewrite resource URLs to root-relative absolute paths so they resolve from /en/...
  // Map: script.js -> /script.js, style.v3.css -> /style.v3.css, logo.png -> /logo.png,
  // any image referenced by bare filename in src.
  const rootRelativeAssets = [
    'script.js', 'style.v3.css', 'style.css',
    'logo.png', 'logo_modern.png',
    'ananas-champ.jpg', 'ananas-produit.png', 'ananas.png',
    'cajou.png', 'karite.png', 'mangue.png', 'papaye.png',
    'hero-bg.jpg', 'ast_modern_logo_1773252286394.png',
  ];
  for (const asset of rootRelativeAssets) {
    const esc = asset.replace(/\./g, '\\.');
    // href="asset" or href="asset?..."
    html = html.replace(new RegExp(`href="${esc}(\\?[^"]*)?"`, 'g'), (_, q) => `href="/${asset}${q || ''}"`);
    // src="asset" or src="asset?..."
    html = html.replace(new RegExp(`src="${esc}(\\?[^"]*)?"`, 'g'), (_, q) => `src="/${asset}${q || ''}"`);
  }

  // 9. Rewrite internal links from FR slugs to EN slugs.
  for (const [fr, en] of Object.entries(FR_TO_EN_PATH)) {
    // Exact URL match: href="/ananas"
    const reExact = new RegExp(`href="${fr.replace(/\//g, '\\/')}"`, 'g');
    html = html.replace(reExact, `href="${en}"`);
    // With hash: href="/ananas#contact" (rare)
    const reHash = new RegExp(`href="${fr.replace(/\//g, '\\/')}(#[^"]*)"`, 'g');
    html = html.replace(reHash, (_, h) => `href="${en}${h}"`);
  }
  // Home-relative anchors like href="/#about" should point to /en/#about
  html = html.replace(/href="\/(#[^"]+)"/g, 'href="/en/$1"');

  // 10. Update consent privacy-policy links in inline JS / data-i18n strings.
  // Skip the canonical/hreflang block — handled via explicit FR_TO_EN_PATH replace above.
  // We need to rewrite remaining "/politique-confidentialite" mentions to "/en/privacy-policy"
  // but ONLY outside of canonical/hreflang lines. Since FR_TO_EN_PATH already handled href="...",
  // we constrain to bare-string occurrences inside JS / text content.
  html = html.split('\n').map(line => {
    if (/rel="(canonical|alternate)"/i.test(line)) return line;
    return line.replace(/\/politique-confidentialite/g, '/en/privacy-policy');
  }).join('\n');

  // 11. Update the lang switcher: in FR pages, btnEN toggles via JS. For EN pages,
  // we want btnFR to be a real link to the FR counterpart and btnEN to be the active state.
  // Replace the lang-switcher block.
  html = html.replace(
    /<div class="lang-switcher" id="langSwitcher">[\s\S]*?<\/div>/,
    `<div class="lang-switcher" id="langSwitcher">\n` +
    `        <a class="lang-btn" href="${page.frPath}" id="btnFR" hreflang="fr" rel="alternate">FR</a>\n` +
    `        <a class="lang-btn active" href="${page.enPath}" id="btnEN" hreflang="en" rel="alternate" aria-current="page">EN</a>\n` +
    `      </div>`
  );

  // 12. Rebuild FAQPage JSON-LD with English Q/A from the translations dictionary.
  if (page.kind === 'product' && page.product) {
    const p = page.product;
    const qa = [];
    for (let i = 1; i <= 5; i++) {
      const q = EN[`pseo.${p}.q${i}`];
      const a = EN[`pseo.${p}.a${i}`];
      if (!q || !a) continue;
      qa.push({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      });
    }
    if (qa.length) {
      const jsonLd = JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: qa,
        },
        null,
        2
      );
      html = html.replace(
        /<script type="application\/ld\+json">[\s\S]*?"@type":\s*"FAQPage"[\s\S]*?<\/script>/,
        `<script type="application/ld+json">\n${jsonLd}\n  </script>`
      );
    }
  }

  // For homepage: rebuild Organization + FAQPage JSON-LD in English. Process each
  // <script type="application/ld+json">...</script> block individually so the regex
  // can't accidentally span two adjacent blocks.
  if (page.kind === 'home') {
    const orgJsonLd = JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'AST Trade International',
        description: 'Tropical produce export from Benin to Europe — pineapple, mango, papaya, cashew and shea butter.',
        url: 'https://ast-trade.com/en/',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '40, rue de Ménilmontant',
          addressLocality: 'Paris',
          postalCode: '75020',
          addressCountry: 'FR',
        },
        telephone: '+33184161824',
        sameAs: ['https://www.linkedin.com/company/ast-trade-international'],
      },
      null,
      2
    );
    const homeFaqs = [
      ['faq.1.q', 'faq.1.a'],
      ['faq.2.q', 'faq.2.a'],
      ['faq.3.q', 'faq.3.a'],
      ['faq.4.q', 'faq.4.a'],
      ['faq.5.q', 'faq.5.a'],
      ['faq.6.q', 'faq.6.a'],
    ].map(([qk, ak]) => ({
      '@type': 'Question',
      name: EN[qk],
      acceptedAnswer: { '@type': 'Answer', text: EN[ak] },
    }));
    const faqJsonLd = JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: homeFaqs,
      },
      null,
      2
    );

    // Walk through each script.ld+json block and replace by detected @type.
    html = html.replace(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      (m, body) => {
        if (/"@type"\s*:\s*"Organization"/.test(body)) {
          return `<script type="application/ld+json">\n${orgJsonLd}\n  </script>`;
        }
        if (/"@type"\s*:\s*"FAQPage"/.test(body)) {
          return `<script type="application/ld+json">\n${faqJsonLd}\n  </script>`;
        }
        return m;
      }
    );
  }

  return html;
}

if (!fs.existsSync(path.join(REPO, 'en'))) {
  fs.mkdirSync(path.join(REPO, 'en'));
}

for (const page of PAGES) {
  const src = fs.readFileSync(path.join(REPO, page.fr), 'utf8');
  const out = translateHtml(src, page);
  fs.writeFileSync(path.join(REPO, page.en), out);
  console.log(`wrote ${page.en}  (${out.length} bytes)`);
}

console.log('done.');
