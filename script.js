    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        var isOpen = navLinks.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        mobileToggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
      });
      // Fermer le menu mobile quand on clique un lien (sauf le toggle dropdown)
      navLinks.querySelectorAll('a:not(.nav-dropdown-toggle)').forEach(l => {
        l.addEventListener('click', () => navLinks.classList.remove('active'));
      });
    }


    // Close mobile menu on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '&#9776;';
        mobileToggle.focus();
      }
    });

    // ══════════ DROPDOWN PRODUITS — Toggle & accessibilité ══════════
    (function() {
      const dropdown = document.querySelector('.nav-dropdown');
      const toggle = document.querySelector('.nav-dropdown-toggle');
      if (!dropdown || !toggle) return;

      // Toggle au clic (mobile tap + desktop clic)
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const expanded = dropdown.getAttribute('aria-expanded') === 'true';
        dropdown.setAttribute('aria-expanded', String(!expanded));
        toggle.setAttribute('aria-expanded', String(!expanded));
      });

      // Fermer quand on clique un sous-lien
      dropdown.querySelectorAll('.nav-dropdown-menu a').forEach(function(link) {
        link.addEventListener('click', function() {
          dropdown.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-expanded', 'false');
          // Fermer aussi le menu mobile
          if (navLinks) navLinks.classList.remove('active');
        });
      });

      // Fermer quand on clique en dehors (desktop)
      document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
          dropdown.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Navigation clavier : Escape pour fermer, flèches pour naviguer
      dropdown.addEventListener('keydown', function(e) {
        var items = dropdown.querySelectorAll('.nav-dropdown-menu a');
        var idx = Array.prototype.indexOf.call(items, document.activeElement);

        if (e.key === 'Escape') {
          dropdown.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
          e.preventDefault();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (dropdown.getAttribute('aria-expanded') !== 'true') {
            dropdown.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-expanded', 'true');
          }
          var next = idx < items.length - 1 ? idx + 1 : 0;
          items[next].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (idx <= 0) {
            toggle.focus();
          } else {
            items[idx - 1].focus();
          }
        } else if (e.key === 'Enter' && document.activeElement === toggle) {
          // Enter sur le toggle ouvre le menu
          e.preventDefault();
          dropdown.setAttribute('aria-expanded', 'true');
          toggle.setAttribute('aria-expanded', 'true');
          items[0].focus();
        }
      });
    })();

    // Throttled scroll handler
    let ticking = false;
    const backToTop = document.getElementById('backToTop');
    const navInner = document.querySelector('.nav-inner');
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
          } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
          }
          if (navInner) navInner.style.padding = window.scrollY > 60 ? '.75rem 5rem' : '1rem 5rem';
          ticking = false;
        });
        ticking = true;
      }
    });

    // Reveal animations (IntersectionObserver)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Copyright year
    const y = document.getElementById('copyYear');
    if (y) y.textContent = new Date().getFullYear();

    // ═══════════════ LANGUAGE SWITCHER ═══════════════
    const translations = {
      en: {

        // Navigation (previously hardcoded)
        'nav.faq': 'FAQ',
        'nav.contact': 'Contact',
        'contact.email.label': 'Email',
        'spec.shelf': 'Shelf life',
        'spec.transport': 'Transport',

        // Skip & Nav
        'skip': 'Skip to main content',
        'nav.about': 'About',
        'nav.avantages': 'Why us',
        'nav.produits': 'Products',
        'nav.prod.ananas': 'Sugar Loaf Pineapple',
        'nav.prod.mangue': 'Kent Mango',
        'nav.prod.papaye': 'Solo Papaya',
        'nav.prod.cajou': 'Cashew Nuts',
        'nav.prod.karite': 'Shea Butter',
        'nav.logistique': 'Logistics',
        'nav.cta': 'Request a quote',

        // Hero
        'hero.title': 'From Benin to your warehouse.<br>No intermediary.',
        'hero.sub': 'PGI pineapple from Allada, Kent mango, Solo papaya, W240 cashew, Grade A shea butter — shipped from Cotonou, inspected batch by batch, delivered with full customs documentation.',
        'hero.cta': 'Request a quote',
        'hero.products': 'View our products',

        // Key figures
        'chiffres.1': 'Tonnes of annual export capacity',
        'chiffres.2': 'Qualified partner cooperatives',
        'chiffres.3.num': '3–5d',
        'chiffres.3': 'Days average air freight delivery time',
        'chiffres.4': 'Product ranges from Benin',

        // About
        'about.label': 'The company',
        'about.title': 'Our expertise',
        'about.lead': 'AST Trade International exports tropical fruits and agricultural products from West Africa to professional European buyers.',
        'about.body': 'Our office is in Paris. Our partner cooperatives are in Benin — in Allada for pineapple, in the north for mango and cashew. We monitor the harvest, oversee the packing, and coordinate freight from Cotonou. When a batch leaves the orchard, we know exactly what\'s in it.<br><br>Every shipment leaves with complete documentation: phytosanitary certificate, certificate of origin, packing list. Full compliance with EU import standards on every batch.',
        'about.v1.name': 'Direct supply chain',
        'about.v1.desc': 'Direct purchasing from our cooperatives in Benin. No agent between them and you. Net prices, plot-by-plot traceability.',
        'about.v2.name': 'Consistent quality',
        'about.v2.desc': 'Inspection happens at the source: size, ripeness, absence of defects. What ships matches what you ordered.',
        'about.v3.name': 'International logistics',
        'about.v3.desc': 'Air freight for fresh produce, sea freight for volume. Tracked from Paris or our Swiss office.',
        'about.quote': 'Our work starts at the orchard. The batch a buyer receives in Rotterdam or Rungis — we watched it leave Cotonou.',
        'about.cert1': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>PGI Designation',
        'about.cert2': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Phytosanitary compliant',
        'about.cert3': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Pesticide-free farming',

        // Advantages
        'av.label': 'Why choose us',
        'av.title': 'Why AST?',
        'av.1.title': 'Direct supply, best price',
        'av.1.text': 'Our producers are in Benin, our offices in Paris. No one in between. You access the direct purchase price with full traceability from plot to delivery note.',
        'av.2.title': 'Consistent, compliant quality',
        'av.2.text': 'We inspect at the source: size, ripeness, skin integrity. Phytosanitary and customs documentation is provided with every shipment, ready for EU import clearance.',
        'av.3.title': 'Packaging to your specs',
        'av.3.text': 'Boxes in your choice of sizes, private label, custom labelling. Have a spec sheet? Send it — we\'ll apply it.',
        'av.4.title': 'One contact, not a call centre',
        'av.4.text': 'Quote within 24 hours. Your contact is the same from first enquiry to delivery. No handoffs between departments.',
        'av.5.title': 'Complete shipping file',
        'av.5.text': 'Phytosanitary certificate, certificate of origin, packing list, pro forma invoice — everything prepared in advance. Nothing to chase at customs.',
        'av.6.title': 'Volumes planned ahead',
        'av.6.text': 'We plan campaigns with our producers in advance. Before each season, you receive the availability schedule: volumes, departure dates, ripeness stage. No stockouts at peak demand.',

        // Ananas
        'ananas.h2': 'Sugarloaf<br><em>Pineapple</em>',
        'ananas.commercial.val': 'Sugarloaf Pineapple',
        'ananas.botanical.val': '<em>Ananas comosus</em> var. Sugarloaf',
        'ananas.label': 'Flagship product &middot; PGI Label',
        'ananas.tagline': 'Protected Geographical Indication from Allada. White flesh, low acidity, high sugar content. The premium of Beninese pineapple.',
        'ananas.badge1': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:3px"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>PGI Designation',
        'ananas.badge2': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:3px"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>Sizes A to D',
        'price.devis': 'On request',
        'price.label': 'Price based on volume and Incoterm',
        'spec.title': 'Technical sheet',
        'spec.commercial': 'Trade name',
        'spec.botanical': 'Botanical name',
        'spec.origin': 'Origin / Terroir',
        'spec.calibres': 'Sizes',
        'spec.packaging': 'Packaging',
        'spec.moq': 'Suggested MOQ',
        'spec.certif': 'Certifications',
        'spec.origin2': 'Origin',
        'ananas.origin.val': 'Benin — PGI Label',
        'ananas.packaging.val': 'Box 6 kg or 12 kg · Rigid export packaging',
        'ananas.shelf.val': '14–21 days after harvest (optimal conditions)',
        'ananas.transport.val': '8–10 °C · Humidity 85–90% · Ventilation required',
        'ananas.moq.val': '500 kg (air) · 1 pallet (sea)',
        'ananas.certif.val': 'PGI Designation · Phytosanitary compliant',
        'season.label': 'Seasonality',
        'season.peak': 'Peak',
        'season.available': 'Available',
        'season.off': 'Off season',
        'ananas.tag1': 'PGI Designation',
        'ananas.tag2': 'White flesh',
        'ananas.tag3': 'Low acidity',
        'ananas.tag4': 'Pesticide-free',
        'btn.devis': 'Request a quote',
        'ananas.desc.title': 'Product description',
        'ananas.desc.text': 'Rare PGI variety: its white flesh offers exceptional natural sweetness (Brix >14) with virtually no acidity.<br>Traditionally grown without pesticides, our premium selection guarantees uniform sizing and extended shelf life.',
        'ananas.atouts.title': 'Commercial advantages',
        'ananas.atouts.text': 'Shelf differentiation with PGI label · Superior shelf life vs. Cayenne · High demand in organic and premium segments · Low rejection rate',

        // Mangue
        'mangue.label': 'Export mango',
        'mangue.h2': 'Mango<br><em style="font-family:\'Playfair Display\';color:var(--ocre)">Kent</em>',
        'origin.benin': 'Benin',
        'mangue.packaging.val': 'Box 4 kg or 6 kg · Individual trays',
        'mangue.shelf.val': '10–14 days (transport 10–12 °C)',
        'mangue.moq.val': '500 kg (air) · 1 x 20\' container (sea)',
        'mangue.desc': 'World-reference export variety. Its melt-in-the-mouth flesh, almost fibre-free, combines with highly resilient skin that ensures damage-free long-distance transport.',
        'mangue.tag1': 'Melting flesh',

        // Papaye
        'papaye.h2': 'Papaya<br><em style="font-family:\'Playfair Display\';color:var(--ocre)">Solo</em>',
        'form.prod.papaye': 'Solo Papaya',
        'papaye.label': 'Export fruit',
        'papaye.weight': 'Average weight',
        'papaye.weight.val': '300–500 g (individual format)',
        'papaye.packaging.val': 'Box 4 kg · Protective trays',
        'papaye.shelf.val': '7–10 days (transport 10–12 °C)',
        'papaye.moq.val': '300 kg (air)',
        'papaye.desc': 'Compact variety prized for its highly fragrant orange flesh. Shaped for air transport, it minimises losses and is perfectly suited for individual consumption.',
        'papaye.tag1': 'Individual format',
        'papaye.tag2': 'Orange flesh',
        'papaye.tag3': 'Air export',

        // Cajou
        'cajou.label': 'Exceptional dried fruit',
        'cajou.title': 'Cashew<br><em style="font-family:\'Playfair Display\';color:var(--ocre)">Nuts</em>',
        'cajou.grade': 'Grade',
        'cajou.grade.val': 'Kernels W240 · Extra or Grade I',
        'cajou.kor': 'Average KOR',
        'cajou.kor.val': '48 (Kernel Output Ratio)',
        'cajou.packaging.val': 'Bags 25 kg (raw) · Boxes 10 kg (kernels) · Vacuum-sealed',
        'cajou.shelf.val': '12 months (dried kernels · stored at <25 °C)',
        'cajou.moq.val': '1 tonne (raw) · 500 kg (kernels)',
        'cajou.campagne': 'Harvest season',
        'cajou.desc': 'Raw dried W240 kernels (Grade Extra/I). Also available as raw cashew nuts (RCN). Mild taste and ivory colour for a premium snacking product.',
        'cajou.tag1': 'Kernels and raw',
        'cajou.tag2': 'Long shelf life',

        // Karité
        'karite.label': 'Cosmetics and Food',
        'karite.title': 'Shea<br><em style="font-family:\'Playfair Display\';color:var(--ocre)">Butter</em>',
        'karite.origin.val': 'Bénin',
        'karite.grade.val': 'A (unrefined, raw) — traditional extraction',
        'karite.usages': 'Applications',
        'karite.usages.val': 'Cosmetics · Pharmaceuticals · Food industry',
        'karite.packaging.val': 'Drums 25 kg, 50 kg or 200 kg · Custom sizes available',
        'karite.shelf.val': '18–24 months (stored cool, away from light)',
        'karite.dispo': 'Availability',
        'karite.allyear': 'Year-round',
        'karite.desc': '100% pure raw butter (Grade A) from the traditional expertise of women\'s cooperatives. Ideal for your high-end cosmetic or food formulations.',
        'karite.tag1': 'Unrefined',
        'karite.tag2': 'Cosmetic and food grade',

        // Logistique
        'log.label': 'Logistics and Shipping',
        'log.title': 'From producer to your warehouse',
        'log.sc1': 'Partner<br>producers',
        'log.sc2': 'Packing<br>station',
        'log.sc3': 'Quality<br>control',
        'log.sc4': 'Shipping<br>Cotonou',
        'log.sc5': 'Reception',
        'log.air.title': 'Air Freight',
        'log.air.1': 'Departure: Cotonou Airport (COO)',
        'log.air.2': 'Pineapple and Mango: delivery in 3 to 5 days',
        'log.air.3': 'Cold chain maintained end-to-end',
        'log.air.4': 'Recommended for orders < 5 tonnes',
        'log.sea.title': 'Sea Freight',
        'log.sea.1': 'Departure: Port of Cotonou',
        'log.sea.2': 'Refrigerated container at ±8 °C · 20% ventilation',
        'log.sea.3': 'Pineapple: 11 to 15 days · up to 1,800 boxes',
        'log.sea.4': 'Cost-effective solution for volumes > 5 tonnes',
        'log.pack.title': 'Packaging and Sizing',
        'log.pack.1': 'Boxes of 4 kg, 6 kg or 12 kg depending on the fruit',
        'log.pack.2': 'Sizes to choose at order (A, B, C, D)',
        'log.pack.3': 'Rigid packaging for international transport',
        'log.pack.4': 'Custom labelling / private label available',
        'log.pack.5': 'Shea butter: custom packaging (drums, IBC)',
        'log.inco.title': 'Incoterms and Documentation',
        'log.inco.1': 'Incoterms offered: FOB Cotonou · CIF · DDP',
        'log.inco.2': 'Payment: bank transfer · L/C for large volumes',
        'log.inco.3': 'Documents provided: phytosanitary certificate, certificate of origin, packing list, pro forma invoice',
        'log.inco.4': 'Real-time temperature tracking (data logger)',
        'log.inco.5': 'Transport insurance available on request',

        // FAQ
        'faq.label': 'Frequently asked questions',
        'faq.title': 'What our clients ask before placing an order',
        'faq.1.q': 'What are your delivery lead times?',
        'faq.1.a': 'By air: 3 to 5 business days from Cotonou for fresh fruit (pineapple, mango, papaya). By sea: 11 to 15 days for refrigerated containers. Cashew nuts and shea butter: 15 to 30 days depending on transport mode.',
        'faq.2.q': 'What is the minimum order quantity (MOQ)?',
        'faq.2.a': 'It depends on the product and transport mode. Air freight: from 300 kg. Sea freight: from one pallet or one 20\' container. Contact us for a quote tailored to your volumes.',
        'faq.3.q': 'Which Incoterms do you offer?',
        'faq.3.a': 'FOB Cotonou, CIF destination port or airport, DDP delivered duty paid. We advise on the right Incoterm for your setup — some clients prefer to handle freight themselves, others want delivery included.',
        'faq.4.q': 'Do you offer private label / white label?',
        'faq.4.a': 'Yes. Your brand labelling, regulatory information, barcodes. Packaging can also be adapted to your formats. Send your brief and we\'ll come back with a feasibility assessment.',
        'faq.5.q': 'How are quality disputes handled?',
        'faq.5.a': 'Every batch leaves with a pre-shipment inspection (size, ripeness, absence of defects). If you find a non-conformity on receipt, send us photos within 48h. We process the claim and offer a credit note or replacement as appropriate.',

        // Contact
        'contact.label': 'Let\'s talk business',
        'contact.title': 'Need a quote? We reply within 24h.',
        'contact.lead': 'Samples available, volumes and seasonal schedules shared on request. Response within 24 business hours.',
        'contact.phone': 'Phone / WhatsApp',
        'contact.swiss': '+41 78 309 53 17 (Switzerland)',
        'contact.hq': 'Headquarters',
        'contact.address': '40, rue de Ménilmontant · 75020 Paris',
        'contact.dl1': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download product catalogue (PDF)',
        'contact.dl2': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download general terms of sale',

        // Form
        'form.title': 'Your professional enquiry',
        'form.company': 'Company *',
        'form.company.ph': 'Your company name',
        'form.position': 'Position / Title',
        'form.position.ph': 'Purchasing Director, etc.',
        'form.firstname': 'First name *',
        'form.lastname': 'Last name *',
        'form.email': 'Professional email *',
        'form.phone': 'Phone',
        'form.country': 'Country',
        'form.select': 'Select',
        'form.pays.suisse': 'Switzerland',
        'form.pays.belgique': 'Belgium',
        'form.pays.paysbas': 'Netherlands',
        'form.pays.allemagne': 'Germany',
        'form.pays.italie': 'Italy',
        'form.pays.autre': 'Other',
        'form.volume': 'Estimated volume',
        'form.frequency': 'Frequency',
        'form.freq.once': 'One-off / Trial',
        'form.freq.monthly': 'Monthly',
        'form.freq.weekly': 'Weekly',
        'form.product': 'Desired product(s) *',
        'form.selectproduct': 'Select a product',
        'form.prod.mangue': 'Kent Mango',
        'form.prod.cajou': 'Cashew Nuts',
        'form.prod.karite': 'Shea Butter',
        'form.prod.multi': 'Multiple products',
        'form.message': 'Your message',
        'form.message.ph': 'Desired sizes, preferred Incoterm, packaging constraints, technical questions...',
        'form.submit': 'Send my quote request &rarr;',

        // Footer
        'footer.legal': 'Legal notice',
        'footer.cgv': 'T&C',
        'footer.privacy': 'Privacy policy',

        // Product preview cards (landing page)
        'preview.ananas.name': 'Sugarloaf Pineapple',
        'preview.ananas.desc': 'PGI-labelled white-fleshed pineapple from Allada, Benin. Low acidity, high Brix, extended shelf life.',
        'preview.mangue.name': 'Kent Mango',
        'preview.mangue.desc': 'World-reference export mango. Melting, fibre-free flesh and resilient skin for long-distance transport.',
        'preview.papaye.name': 'Solo Papaya',
        'preview.papaye.desc': 'Compact individual-format papaya with fragrant orange flesh, ideal for air freight.',
        'preview.cajou.name': 'Cashew Nuts',
        'preview.cajou.desc': 'W240 raw dried kernels (Extra/Grade I). Mild taste, ivory colour, for snacking and specialist distribution.',
        'preview.karite.name': 'Shea Butter',
        'preview.karite.desc': '100% pure unrefined Grade A butter from women\'s cooperatives. Cosmetic and food grade.',
        'preview.cta': 'View full product sheet →',
        'breadcrumb.home': 'Home',
        'breadcrumb.products': 'Products',
      }
    };

    // Store original FR texts
    const frTexts = {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
      frTexts[el.getAttribute('data-i18n')] = el.innerHTML;
    });
    const frPlaceholders = {};
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      frPlaceholders[el.getAttribute('data-i18n-placeholder')] = el.getAttribute('placeholder');
    });

    function setLang(lang) {
      const html = document.getElementById('htmlRoot');
      html.setAttribute('lang', lang);

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (lang === 'en' && translations.en[key]) {
          el.innerHTML = translations.en[key];
        } else if (lang === 'fr' && frTexts[key]) {
          el.innerHTML = frTexts[key];
        }
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (lang === 'en' && translations.en[key]) {
          el.setAttribute('placeholder', translations.en[key]);
        } else if (lang === 'fr' && frPlaceholders[key]) {
          el.setAttribute('placeholder', frPlaceholders[key]);
        }
      });

      // Form language attribute updated
      const form = document.querySelector('.contact-form');
      if (form) {
        // Add hidden language field for Formspree
        let langField = form.querySelector('input[name="_language"]');
        if (!langField) {
          langField = document.createElement('input');
          langField.type = 'hidden';
          langField.name = '_language';
          form.appendChild(langField);
        }
        langField.value = lang;
      }

      // Toggle active button state
      document.getElementById('btnFR').classList.toggle('active', lang === 'fr');
      document.getElementById('btnEN').classList.toggle('active', lang === 'en');

      localStorage.setItem('ast-lang', lang);
    }

    // Language switcher listeners
    document.getElementById('btnFR').addEventListener('click', () => setLang('fr'));
    document.getElementById('btnEN').addEventListener('click', () => setLang('en'));

    // Load saved language preference
    const savedLang = localStorage.getItem('ast-lang');
    if (savedLang && savedLang === 'en') setLang('en');


    (function() {
      var contactForm = document.getElementById('contactForm');
      if (!contactForm) return;

      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = contactForm.querySelector('.form-submit');
        var origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '⏳ Envoi en cours…';

        fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        }).then(function(response) {
          if (response.ok) {
            var lang = document.getElementById('htmlRoot').getAttribute('lang');
            contactForm.reset();
            btn.innerHTML = lang === 'en'
              ? '✓ Sent! We will respond within 24h.'
              : '✓ Envoyé ! Réponse sous 24h.';
            btn.style.background = 'var(--vert2)';
            btn.style.color = '#fff';
            setTimeout(function() {
              btn.innerHTML = origText;
              btn.disabled = false;
              btn.style.background = '';
              btn.style.color = '';
            }, 5000);
          } else {
            throw new Error('Server error');
          }
        }).catch(function() {
          var lang = document.getElementById('htmlRoot').getAttribute('lang');
          btn.innerHTML = lang === 'en'
            ? '✗ Error — please try again'
            : '✗ Erreur — veuillez réessayer';
          btn.style.background = '#a13544';
          btn.style.color = '#fff';
          btn.disabled = false;
          setTimeout(function() {
            btn.innerHTML = origText;
            btn.style.background = '';
            btn.style.color = '';
          }, 4000);
        });
      });
    })();
