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
          if (navInner) {
            const isDesktop = window.innerWidth > 1080;
            navInner.style.padding = isDesktop
              ? (window.scrollY > 60 ? '.75rem 5rem' : '1rem 5rem')
              : (window.scrollY > 60 ? '.65rem 1.5rem' : '1rem 1.5rem');
          }
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
        'hero.title': 'Your partner<br>for tropical fruits',
        'hero.sub': 'Direct supply chain from West Africa: Sugarloaf pineapple, Kent mango, Solo papaya, cashew nuts and shea butter. Certified quality, tailored support and international delivery.',
        'hero.cta': 'Request a quote',
        'hero.products': 'View our products',

        // Key figures
        'chiffres.1': 'Tonnes of export capacity / year',
        'chiffres.2': 'Qualified partner cooperatives',
        'chiffres.3.num': '3 to 5 days',
        'chiffres.3': 'Average air freight delivery time',
        'chiffres.4': 'Premium product ranges from Benin',

        // About
        'about.label': 'The company',
        'about.title': 'Our expertise',
        'about.lead': 'Expert in premium agricultural exports from West Africa, partner to professionals worldwide.',
        'about.body': 'Based in Paris, AST Trade International connects the finest West African producers with international buyers. With no intermediaries, we control every step of the value chain, from harvest to shipment.<br><br>Our commitment: impeccable quality, rigorous traceability and strict compliance with international phytosanitary and food-safety standards.',
        'about.v1.name': 'Direct supply chain',
        'about.v1.desc': 'No intermediary between our producers and your warehouse. Competitive pricing and guaranteed traceability.',
        'about.v2.name': 'Consistent quality',
        'about.v2.desc': 'Quality controls at every stage: harvest, sorting, packaging and shipping. High compliance rate.',
        'about.v3.name': 'Global logistics',
        'about.v3.desc': 'International shipping by air and sea. Managed from our offices in France (Paris) and Switzerland.',
        'about.quote': 'We build lasting partnerships with professionals worldwide, providing them with reliable access to exceptional products from West African agriculture.',
        'about.cert1': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>PGI label',
        'about.cert2': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Phytosanitary compliant',
        'about.cert3': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>Controlled farming practices',

        // Advantages
        'av.label': 'Why choose us',
        'av.title': 'Why AST?',
        'av.1.title': 'Direct supply, best price',
        'av.1.text': 'No intermediary between our partner producers and your warehouse. You benefit from competitive pricing and full traceability, from farm to delivery.',
        'av.2.title': 'Consistent, compliant quality',
        'av.2.text': 'Rigorous quality controls at every stage. Phytosanitary and customs documentation included. Compliance with international fresh produce import standards.',
        'av.3.title': 'Custom packaging',
        'av.3.text': 'Cartons in your choice of sizes, private label and tailored labelling available. We adapt packaging to your specifications.',
        'av.4.title': 'Responsiveness & a dedicated contact',
        'av.4.text': 'Quotation within 24 hours. A single point of contact for smooth commercial follow-up.',
        'av.5.title': 'Complete documentation',
        'av.5.text': 'Phytosanitary certificates, certificates of origin, packing lists and pro forma invoices. All documents required for seamless customs clearance.',
        'av.6.title': 'Reliable supply',
        'av.6.text': 'Season-long planning with our producers to secure consistent volumes. Availability calendar shared at the start of each season.',

        // Ananas
        'ananas.h2': 'Sugarloaf<br><em>Pineapple</em>',
        'ananas.commercial.val': 'Sugarloaf Pineapple',
        'ananas.botanical.val': '<em>Ananas comosus</em> var. Sugarloaf',
        'ananas.label': 'Flagship product &middot; PGI Label',
        'ananas.tagline': 'Protected Geographical Indication from Allada. White flesh, low acidity, high natural sugar content. The premium of Beninese pineapple.',
        'ananas.badge1': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:3px"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>PGI label',
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
        'ananas.origin.val': 'Benin — PGI label',
        'ananas.packaging.val': '6 kg or 12 kg cartons · Rigid export packaging',
        'ananas.shelf.val': '14–21 days after harvest (under optimal conditions)',
        'ananas.transport.val': '8–10 °C · Humidity 85–90% · Ventilation required',
        'ananas.moq.val': '500 kg (air freight) · 1 pallet (sea freight)',
        'ananas.certif.val': 'PGI label · Phytosanitary compliant',
        'season.label': 'Seasonality',
        'season.peak': 'Peak',
        'season.available': 'Available',
        'season.off': 'Off season',
        'ananas.tag1': 'PGI label',
        'ananas.tag2': 'White flesh',
        'ananas.tag3': 'Low acidity',
        'ananas.tag4': 'Controlled farming practices',
        'btn.devis': 'Request a quote',
        'ananas.desc.title': 'Product description',
        'ananas.desc.text': 'Rare PGI variety: its white flesh delivers pronounced natural sweetness (target Brix >14) with very low acidity.<br>Grown under controlled farming practices, our selection targets uniform sizing and strong shelf performance.',
        'ananas.atouts.title': 'Commercial advantages',
        'ananas.atouts.text': 'Shelf differentiation thanks to PGI label · Longer shelf life than Cayenne · Premium positioning · Low rejection rate',

        // Mangue
        'mangue.label': 'Export mango',
        'mangue.h2': 'Mango<br><em style="font-family:\'Playfair Display\';color:var(--ocre)">Kent</em>',
        'origin.benin': 'Benin',
        'mangue.packaging.val': '4 kg or 6 kg cartons · Individual trays',
        'mangue.shelf.val': '10–14 days (transport at 10–12 °C)',
        'mangue.moq.val': '500 kg (air freight) · 1 x 20\' container (sea freight)',
        'mangue.desc': 'A world-reference export variety. Its melt-in-the-mouth, nearly fibre-free flesh, combined with a highly resilient skin, ensures damage-free long-distance transport.',
        'mangue.tag1': 'Melt-in-the-mouth flesh',

        // Papaye
        'papaye.h2': 'Papaya<br><em style="font-family:\'Playfair Display\';color:var(--ocre)">Solo</em>',
        'form.prod.papaye': 'Solo Papaya',
        'papaye.label': 'Export fruit',
        'papaye.weight': 'Average weight',
        'papaye.weight.val': '300–500 g (single-serve size)',
        'papaye.packaging.val': '4 kg cartons · Protective trays',
        'papaye.shelf.val': '7–10 days (transport at 10–12 °C)',
        'papaye.moq.val': '300 kg (air freight)',
        'papaye.desc': 'A compact variety prized for its highly fragrant orange flesh. Sized for air freight, it minimises losses and is ideally suited to single-serve consumption.',
        'papaye.tag1': 'Single-serve size',
        'papaye.tag2': 'Orange flesh',
        'papaye.tag3': 'Air freight',

        // Cajou
        'cajou.label': 'Premium tree nut',
        'cajou.title': 'Cashew<br><em style="font-family:\'Playfair Display\';color:var(--ocre)">Nuts</em>',
        'cajou.grade': 'Grade',
        'cajou.grade.val': 'W240 kernels · Extra or Grade I',
        'cajou.kor': 'Average KOR',
        'cajou.kor.val': '48 (Kernel Output Ratio)',
        'cajou.packaging.val': '25 kg bags (RCN) · 10 kg cartons (kernels) · Vacuum-sealed',
        'cajou.shelf.val': '12 months (dried kernels · stored below 25 °C)',
        'cajou.moq.val': '1 tonne (RCN) · 500 kg (kernels)',
        'cajou.campagne': 'Harvest season',
        'cajou.desc': 'Dried W240 kernels (Grade Extra/I). Also available as raw cashew nuts (RCN). Mild flavour and ivory colour, ideal for premium snacking.',
        'cajou.tag1': 'Kernels & RCN',
        'cajou.tag2': 'Long shelf life',

        // Karité
        'karite.label': 'Cosmetic & food grade',
        'karite.title': 'Shea<br><em style="font-family:\'Playfair Display\';color:var(--ocre)">Butter</em>',
        'karite.origin.val': 'Benin',
        'karite.grade.val': 'Grade A (unrefined) — traditional extraction',
        'karite.usages': 'Applications',
        'karite.usages.val': 'Cosmetics · Pharmaceuticals · Food industry',
        'karite.packaging.val': '25 kg, 50 kg or 200 kg drums · Custom sizes available',
        'karite.shelf.val': '18–24 months (store cool, away from light)',
        'karite.dispo': 'Availability',
        'karite.allyear': 'Year-round',
        'karite.desc': 'Raw unrefined shea butter (Grade A), produced through the traditional expertise of women\'s cooperatives. Suitable for cosmetic or food-grade formulations, with no added blends when specified at order time.',
        'karite.tag1': 'Unrefined',
        'karite.tag2': 'Cosmetic & food grade',

        // Logistique
        'log.label': 'Logistics & shipping',
        'log.title': 'From producer to your warehouse',
        'log.sc1': 'Partner<br>producers',
        'log.sc2': 'Packing<br>station',
        'log.sc3': 'Quality<br>control',
        'log.sc4': 'Shipping from<br>Cotonou',
        'log.sc5': 'Delivery',
        'log.air.title': 'Air freight',
        'log.air.1': 'Departure: Cotonou Airport (COO)',
        'log.air.2': 'Pineapple and mango: delivery within 3 to 5 days',
        'log.air.3': 'Cold chain maintained end-to-end',
        'log.air.4': 'Minimum order of 5 tonnes recommended',
        'log.sea.title': 'Sea freight',
        'log.sea.1': 'Departure: Port of Cotonou',
        'log.sea.2': 'Refrigerated container at ±8 °C, 20% ventilation',
        'log.sea.3': 'Pineapple: 11 to 15 days, up to 1,800 cartons per container',
        'log.sea.4': 'Cost-effective solution for volumes above 5 tonnes',
        'log.pack.title': 'Packaging & sizing',
        'log.pack.1': '4 kg, 6 kg or 12 kg cartons depending on the fruit',
        'log.pack.2': 'Sizes selected at the time of order',
        'log.pack.3': 'Rigid packaging for international transport',
        'log.pack.4': 'Custom labelling / private label available',
        'log.pack.5': 'Shea butter: custom packaging (drums, IBC)',
        'log.inco.title': 'Incoterms & documentation',
        'log.inco.1': 'Incoterms available: FOB Cotonou, CIF, DDP',
        'log.inco.2': 'Payment by bank transfer or L/C for large volumes',
        'log.inco.3': 'Documents provided: phytosanitary certificate, certificate of origin, packing list, pro forma invoice',
        'log.inco.4': 'Real-time temperature tracking (data logger)',
        'log.inco.5': 'Transport insurance available on request',

        // FAQ
        'faq.label': 'Frequently asked questions',
        'faq.title': 'FAQ',
        'faq.1.q': 'What are your delivery lead times?',
        'faq.1.a': 'By air freight: 3 to 5 business days for fresh fruit (pineapple, mango, papaya). By sea: 11 to 15 days for refrigerated containers. Cashew nuts and shea butter: 15 to 30 days depending on the transport mode.',
        'faq.2.q': 'What is the minimum order quantity (MOQ)?',
        'faq.2.a': 'The MOQ varies by product and transport mode. Air freight: from 300 kg. Sea freight: from one pallet or one 20\' container. Contact us for a quote tailored to your volumes.',
        'faq.3.q': 'Do you provide phytosanitary documents?',
        'faq.3.a': 'Yes. We systematically provide a phytosanitary certificate, certificate of origin, detailed packing list and pro forma invoice. All documents required for EU customs clearance are included.',
        'faq.4.q': 'Which Incoterms do you offer?',
        'faq.4.a': 'We mainly work with FOB Cotonou, CIF (destination port/airport) and DDP (delivered duty paid). The Incoterm is agreed when preparing the quotation, based on your preferences.',
        'faq.5.q': 'Do you offer private label / white label?',
        'faq.5.a': 'Yes. We provide custom labelling to your specifications: brand, design, regulatory information and barcodes. Packaging can also be adapted to your formats.',
        'faq.6.q': 'How are quality disputes handled?',
        'faq.6.a': 'Each lot is inspected before shipping (sizing, ripeness, defect-free). If a non-conformity is observed on arrival, we process the claim within 48 hours with photo evidence and offer a credit note or replacement as appropriate.',

        // Contact
        'contact.label': 'Let\'s talk business',
        'contact.title': 'Request your quote',
        'contact.lead': 'Samples, volumes and seasonal planning: our team replies within 24 business hours. Order in 6 simple steps, all the way to delivery.',
        'contact.phone': 'Phone / WhatsApp',
        'contact.hq': 'Headquarters',
        'contact.address': '40, rue de Ménilmontant · 75020 Paris',
        'contact.dl1': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Product catalogue &mdash; coming soon',

        // Form
        'form.title': 'Your enquiry',
        'form.company': 'Company *',
        'form.company.ph': 'Your company name',
        'form.position': 'Position / Job title',
        'form.position.ph': 'e.g. Purchasing Director',
        'form.firstname': 'First name *',
        'form.lastname': 'Last name *',
        'form.email': 'Email *',
        'form.phone': 'Phone',
        'form.country': 'Country',
        'form.country.ph': 'e.g. France, Belgium, Switzerland',
        'form.select': 'Select',
        'form.volume': 'Estimated volume',
        'form.frequency': 'Frequency',
        'form.freq.once': 'One-off / Trial order',
        'form.freq.monthly': 'Monthly',
        'form.freq.weekly': 'Weekly',
        'form.product': 'Product(s) of interest *',
        'form.selectproduct': 'Select a product',
        'form.prod.mangue': 'Kent Mango',
        'form.prod.cajou': 'Cashew Nuts',
        'form.prod.karite': 'Shea Butter',
        'form.prod.ananas': 'Sugarloaf Pineapple',
        'form.prod.multi': 'Multiple products',
        'form.prod.autre': 'Other',
        'form.message': 'Your message',
        'form.message.ph': 'Sizes required, preferred Incoterm, packaging constraints, technical questions...',
        'form.submit': 'Send my quote request &rarr;',

        // Footer
        'footer.legal': 'Legal notice',
        'footer.cgv': 'General terms',
        'footer.privacy': 'Privacy policy',

        // Product preview cards (landing page)
        'preview.ananas.name': 'Sugarloaf Pineapple',
        'preview.ananas.desc': 'PGI-labelled white-fleshed pineapple from Allada, Benin. Low acidity, high Brix and extended shelf life.',
        'preview.mangue.name': 'Kent Mango',
        'preview.mangue.desc': 'World-reference export mango. Melt-in-the-mouth, fibre-free flesh and a resilient skin built for long-distance transport.',
        'preview.papaye.name': 'Solo Papaya',
        'preview.papaye.desc': 'Compact single-serve papaya with fragrant orange flesh, ideal for air freight.',
        'preview.cajou.name': 'Cashew Nuts',
        'preview.cajou.desc': 'W240 dried kernels (Grade Extra/I). Mild flavour, ivory colour — premium snacking.',
        'preview.karite.name': 'Shea Butter',
        'preview.karite.desc': 'Raw unrefined Grade A butter from women\'s cooperatives. Cosmetic and food grade.',
        'preview.cta': 'View full product sheet →',
        'products.title': 'Our premium products',
        'breadcrumb.home': 'Home',
        'breadcrumb.products': 'Products',

        // RGPD / Cookie consent
        'form.consent': 'I agree that my data may be used to respond to my request, in accordance with the <a href="/politique-confidentialite">privacy policy</a>.',
        'cookie.text': 'We use audience measurement cookies to improve the site. You can accept or refuse them. See our <a href="/politique-confidentialite">privacy policy</a>.',
        'cookie.accept': 'Accept',
        'cookie.refuse': 'Refuse',

        // Product SEO sections — shared
        'pseo.after.label': 'After your enquiry',
        'pseo.after.title': 'How we handle your enquiry',
        'pseo.after.li1': 'Review of your needs: product, volume, destination and preferred schedule.',
        'pseo.after.li2': 'Reply within 24 business hours with initial available options.',
        'pseo.after.li3': 'Confirmation of product terms, documentation and logistics arrangements before booking.',
        'pseo.docs.label': 'Documentation and possible controls',
        'pseo.docs.title': 'Export preparation',
        'pseo.docs.text.fruit': 'Depending on the product, destination and operation, AST Trade International can support the preparation of commercial and export documents: commercial invoice, packing list, certificate of origin and phytosanitary certificate for fresh fruit. Controls are confirmed on a case-by-case basis before shipment.',
        'pseo.docs.text.dry': 'Depending on the product, destination and operation, AST Trade International can support the preparation of commercial and export documents: commercial invoice, packing list, certificate of origin and a certificate of analysis when available. Controls are confirmed on a case-by-case basis before shipment.',
        'pseo.faq.label': 'Frequently asked questions',
        'pseo.faq.title': 'Product FAQ',
        'pseo.see.label': 'See also',
        'pseo.see.title': 'Our other products',
        'pseo.see.ananas': 'Sugarloaf Pineapple',
        'pseo.see.mangue': 'Kent Mango',
        'pseo.see.papaye': 'Solo Papaya',
        'pseo.see.cajou': 'Cashew Nuts',
        'pseo.see.karite': 'Shea Butter',

        // Ananas FAQ
        'pseo.ananas.q1': 'What is the origin and variety of the pineapple offered?',
        'pseo.ananas.a1': 'We offer Sugarloaf pineapple grown in Benin, in the Allada area that benefits from a Protected Geographical Indication (PGI). The variety is prized for its white flesh, low acidity and naturally sweet profile. Sizes are confirmed according to the lot and current availability.',
        'pseo.ananas.q2': 'What is the seasonality and what volumes can be considered?',
        'pseo.ananas.a2': 'Availability follows the harvest calendar, with stronger and weaker windows where volumes are confirmed lot by lot. For a meaningful conversation, please share the target period, sizes, destination and target volume.',
        'pseo.ananas.q3': 'Which export documents and quality controls can accompany shipments?',
        'pseo.ananas.a3': 'Depending on the destination and the operation, export preparation may include a commercial invoice, packing list, certificate of origin and phytosanitary certificate. Quality controls are confirmed case by case before shipment, particularly on visual appearance, sizing and documentary compliance.',
        'pseo.ananas.q4': 'What are the transport conditions and product shelf life?',
        'pseo.ananas.a4': 'As an indication, transport runs at 8–10 °C with 85–90% humidity and appropriate ventilation, for a shelf life of 14–21 days after harvest. Exact conditions and the applicable Incoterm are confirmed at the time of quotation, depending on the destination.',
        'pseo.ananas.q5': 'Can a sample be sent before a first commitment?',
        'pseo.ananas.a5': 'A sample or initial trial shipment can be considered depending on the period, the destination and logistical feasibility. Please indicate the volume eventually targeted and the purpose of the test so we can prepare a suitable proposal.',

        // Mangue FAQ
        'pseo.mangue.q1': 'Which mango variety is offered and for what uses?',
        'pseo.mangue.a1': 'We offer Kent mango from Benin, a variety recognised for its melt-in-the-mouth flesh and strong transport performance. It suits fresh-fruit channels, importers, wholesalers and distributors looking for a mango well adapted to export.',
        'pseo.mangue.q2': 'Which sizes and packaging formats are available?',
        'pseo.mangue.a2': 'As an indication, sizes break down into A (≥650 g), B (450–650 g), C (350–450 g) and D (250–350 g). Packaging is 4 kg or 6 kg cartons with individual trays. Final selection is confirmed according to the lot, the transport mode and your specifications.',
        'pseo.mangue.q3': 'What is the seasonality of Kent mango from Benin?',
        'pseo.mangue.a3': 'Availability depends on the harvest calendar and the pace of picking. For a buying programme or a one-off operation, share your preferred shipping window so we can confirm mobilisable volumes and planning.',
        'pseo.mangue.q4': 'What are the transport conditions and shelf life?',
        'pseo.mangue.a4': 'As an indication, transport runs at 10–12 °C, for a shelf life of 10–14 days depending on the ripeness stage. Logistics conditions and the Incoterm used are validated case by case before booking.',
        'pseo.mangue.q5': 'Which export documents and contractual terms apply?',
        'pseo.mangue.a5': 'Depending on the operation, export preparation may include a commercial invoice, packing list, certificate of origin and phytosanitary certificate. Documents, controls and contractual terms are agreed before shipment based on the customer\'s requirements and the country of entry.',

        // Papaye FAQ
        'pseo.papaye.q1': 'Which papaya variety and format are offered?',
        'pseo.papaye.a1': 'We offer Solo papaya from Benin, a single-serve fruit suited to channels looking for a differentiating tropical product. Formats and packaging are confirmed according to lot availability and logistical constraints.',
        'pseo.papaye.q2': 'Why does Solo papaya require special attention in logistics?',
        'pseo.papaye.a2': 'Papaya is a delicate fruit whose performance depends on the ripeness stage at departure, packaging and the logistics chain. Careful upstream preparation helps limit risks linked to transport and reception.',
        'pseo.papaye.q3': 'What is the shelf life and what transport conditions apply?',
        'pseo.papaye.a3': 'As an indication, shelf life is 7–10 days with transport at 10–12 °C, depending on the ripeness stage, the transport mode and proper storage conditions. Exact parameters are studied case by case based on the destination and the target commercial window.',
        'pseo.papaye.q4': 'What is the seasonality of Solo papaya?',
        'pseo.papaye.a4': 'Availability varies with the production calendar and the volumes mobilisable at the time of the enquiry. For a serious assessment, please indicate the target period, the destination, expected packaging and the target volume.',
        'pseo.papaye.q5': 'Which export documents and controls can be prepared?',
        'pseo.papaye.a5': 'Depending on the operation, export preparation may include a commercial invoice, packing list, certificate of origin and phytosanitary certificate. Quality controls and the applicable Incoterm are defined case by case before shipment.',

        // Cajou FAQ
        'pseo.cajou.q1': 'Which cashew nut formats are available?',
        'pseo.cajou.a1': 'We offer cashew kernels as well as the possibility to work with raw cashew nuts depending on your needs. Formats, grades and packaging are confirmed according to lot availability and the buyer\'s specifications.',
        'pseo.cajou.q2': 'What is the origin and what MOQ can be considered?',
        'pseo.cajou.a2': 'The cashew offered is sourced from Benin. As an indication, the MOQ is around 1 tonne for raw cashew nuts (RCN) and 500 kg for kernels. Final volumes depend on the format, packaging and period, and are confirmed when the enquiry is reviewed.',
        'pseo.cajou.q3': 'What is the shelf life of cashew kernels and how should they be stored?',
        'pseo.cajou.a3': 'As an indication, dried kernels have a shelf life of 12 months when stored below 25 °C, in dry conditions and away from humidity. Exact conditions depend on the lot and packaging, and are confirmed for the relevant lot.',
        'pseo.cajou.q4': 'Which export documents and quality controls can be prepared?',
        'pseo.cajou.a4': 'Depending on the product, destination and operation, export preparation may include a commercial invoice, packing list, certificate of origin and a certificate of analysis when available. Quality controls are confirmed before shipment.',
        'pseo.cajou.q5': 'Can a sample or a trial lot be requested?',
        'pseo.cajou.a5': 'A sample or trial lot can be considered depending on product availability and the buying objective. To frame the request, please indicate the format, target grade, destination and projected volume.',

        // Karité FAQ
        'pseo.karite.q1': 'What is the origin and grade of the shea butter offered?',
        'pseo.karite.a1': 'We offer raw unrefined shea butter from Benin. Grade, specifications and packaging are confirmed according to lot availability and the buyer\'s specifications.',
        'pseo.karite.q2': 'Which applications is this butter suited to?',
        'pseo.karite.a2': 'Shea butter can be considered for cosmetic, pharmaceutical or food uses depending on the expected specifications. Technical and regulatory requirements must be clarified before any commercial proposal.',
        'pseo.karite.q3': 'Which packaging formats and what MOQ are available?',
        'pseo.karite.a3': 'Standard packaging includes 25, 50 or 200 kg drums, with the option of custom formats as needed. As an indication, the MOQ is around 100 kg; the final format is confirmed according to the intended use and specifications.',
        'pseo.karite.q4': 'What is the shelf life and what are the storage conditions?',
        'pseo.karite.a4': 'As an indication, shelf life is 18–24 months when the product is stored in a cool, dry, clean environment away from excessive light. Exact conditions depend on the lot and packaging.',
        'pseo.karite.q5': 'Which export documents and contractual terms can be considered?',
        'pseo.karite.a5': 'Depending on the destination and the operation, export preparation may include a commercial invoice, packing list, certificate of origin and a certificate of analysis when available. Commercial terms, controls and Incoterms are agreed case by case before booking.',

        // Legal notice (mentions-legales)
        'legal.breadcrumb': 'Legal notice',
        'legal.label': 'Legal information',
        'legal.title': 'Legal <em style="font-family:\'Playfair Display\';color:var(--ocre)">notice</em>',
        'legal.intro': 'AST Trade International is a French company specialised in the import and export of agricultural products and raw materials sourced from Benin.',
        'legal.editor.title': 'Website publisher',
        'legal.editor.body': 'AST Trade International SARL<br>40, rue de Ménilmontant<br>75020 Paris, France<br>SIRET: 980 406 011 00026<br>EU VAT number: FR50980406011<br>Email: <a href="mailto:contact@ast-trade.com">contact@ast-trade.com</a><br>Phone: <a href="tel:+33184161824">+33 1 84 16 18 24</a>',
        'legal.director.title': 'Publication director',
        'legal.director.body': 'The legal representative of AST Trade International.',
        'legal.hosting.title': 'Hosting',
        'legal.hosting.body': 'The site is hosted by Cloudflare, Inc.',
        'legal.ip.title': 'Intellectual property',
        'legal.ip.body': 'All content on this site, including text, images, logos, graphic elements and page structure, is the property of AST Trade International or its partners. Any reproduction, representation, modification or use without prior authorisation is prohibited.',
        'legal.liability.title': 'Liability',
        'legal.liability.body': 'AST Trade International strives to provide accurate and up-to-date information. However, the information presented on the site is provided for reference only and may change without notice, in particular depending on product availability, logistics conditions, seasons, volumes and applicable regulations.',
        'legal.cta': 'Contact us',

        // General terms (conditions-generales)
        'terms.breadcrumb': 'General terms',
        'terms.label': 'Commercial framework',
        'terms.title': 'General <em style="font-family:\'Playfair Display\';color:var(--ocre)">terms</em>',
        'terms.intro': 'These general terms govern commercial enquiries sent to AST Trade International via the ast-trade.com website.',
        'terms.purpose.title': 'Purpose',
        'terms.purpose.body': 'AST Trade International presents on its site agricultural products and raw materials available for export, in particular from Benin to Europe and other markets.',
        'terms.nosale.title': 'No online sales',
        'terms.nosale.body': 'The site does not allow orders to be placed directly. Every enquiry sent through the form is handled as a tailored commercial exchange.',
        'terms.quotes.title': 'Quotes and availability',
        'terms.quotes.body': 'Information about products, volumes, packaging, lead times, availability and export documents is provided for reference. It must be confirmed by AST Trade International before any order or commercial commitment.',
        'terms.prices.title': 'Prices',
        'terms.prices.body': 'Prices are not displayed on the site. They are shared on request, based on the product, volume, packaging, availability, destination, required documents and logistics conditions.',
        'terms.orders.title': 'Orders',
        'terms.orders.body': 'Every order must be confirmed in writing between the parties, specifying in particular the product, quantities, packaging, payment terms, expected documents, the applicable Incoterm and delivery arrangements.',
        'terms.logistics.title': 'Logistics and lead times',
        'terms.logistics.body': 'Lead times shown on the site are estimates. They may vary with the season, product availability, quality controls, export formalities, transport and customs conditions.',
        'terms.quality.title': 'Quality and compliance',
        'terms.quality.body': 'Product specifications, quality documents and any controls are defined case by case before order confirmation.',
        'terms.law.title': 'Governing law',
        'terms.law.body': 'Commercial relations with AST Trade International are governed by French law, unless otherwise agreed in writing between the parties.',
        'terms.cta': 'Request a quote',

        // Privacy policy (politique-confidentialite)
        'privacy.breadcrumb': 'Privacy policy',
        'privacy.label': 'Data protection',
        'privacy.title': 'Privacy <em style="font-family:\'Playfair Display\';color:var(--ocre)">policy</em>',
        'privacy.intro': 'AST Trade International pays particular attention to protecting the personal data shared through its website.',
        'privacy.data.title': 'Data collected',
        'privacy.data.body': 'When you use the contact form, AST Trade International may collect the following information: last name, first name, company, job title, email address, phone number, country, product of interest, estimated volume and message content.',
        'privacy.purpose.title': 'Purpose of processing',
        'privacy.purpose.body': 'This data is used only to respond to commercial enquiries, prepare a quote, discuss an import-export need or follow up on a professional relationship.',
        'privacy.basis.title': 'Legal basis',
        'privacy.basis.body': 'Data is processed on the basis of the user\'s voluntary request and the legitimate interest of AST Trade International in responding to professional enquiries received.',
        'privacy.retention.title': 'Retention period',
        'privacy.retention.body': 'Data is kept for as long as needed to handle the enquiry and follow up on the commercial relationship, unless a legal obligation requires a longer period.',
        'privacy.recipients.title': 'Data recipients',
        'privacy.recipients.body': 'Data is intended solely for AST Trade International. It is not sold to third parties.',
        'privacy.form.title': 'Contact form',
        'privacy.form.body': 'The site uses an external service to transmit forms. Information sent through the form is used solely to allow AST Trade International to receive and process enquiries.',
        'privacy.rights.title': 'Your rights',
        'privacy.rights.body': 'You may request access to, correction of, or deletion of your personal data by writing to: <a href="mailto:contact@ast-trade.com">contact@ast-trade.com</a>.',
        'privacy.cookies.title': 'Cookies and audience measurement',
        'privacy.cookies.body': 'The site may use audience measurement tools to understand site traffic and improve its content. This data is used for statistical purposes.',
        'privacy.cta': 'Contact us',
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

    // ═══════════════ COOKIE CONSENT BANNER (RGPD) ═══════════════
    (function() {
      function currentLang() {
        try {
          var root = document.getElementById('htmlRoot') || document.documentElement;
          return root.getAttribute('lang') === 'en' ? 'en' : 'fr';
        } catch(e) { return 'fr'; }
      }

      var COPY = {
        fr: {
          text: 'Nous utilisons des cookies de mesure d’audience pour améliorer le site. Vous pouvez les accepter ou les refuser. Voir notre <a href="/politique-confidentialite">politique de confidentialité</a>.',
          accept: 'Accepter',
          refuse: 'Refuser'
        },
        en: {
          text: 'We use audience measurement cookies to improve the site. You can accept or refuse them. See our <a href="/politique-confidentialite">privacy policy</a>.',
          accept: 'Accept',
          refuse: 'Refuse'
        }
      };

      function getStored() {
        try { return localStorage.getItem('ast-cookie-consent'); } catch(e) { return null; }
      }
      function setStored(v) {
        try { localStorage.setItem('ast-cookie-consent', v); } catch(e) {}
      }

      function updateConsent(granted) {
        if (typeof window.gtag === 'function') {
          window.gtag('consent', 'update', {
            'analytics_storage': granted ? 'granted' : 'denied'
          });
        }
      }

      function buildBanner() {
        var lang = currentLang();
        var copy = COPY[lang] || COPY.fr;
        var banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', lang === 'en' ? 'Cookie consent' : 'Consentement aux cookies');
        banner.innerHTML =
          '<div class="cookie-banner-inner">' +
            '<p class="cookie-banner-text" data-i18n="cookie.text">' + copy.text + '</p>' +
            '<div class="cookie-banner-actions">' +
              '<button type="button" class="cookie-btn cookie-btn-refuse" id="cookieRefuse" data-i18n="cookie.refuse">' + copy.refuse + '</button>' +
              '<button type="button" class="cookie-btn cookie-btn-accept" id="cookieAccept" data-i18n="cookie.accept">' + copy.accept + '</button>' +
            '</div>' +
          '</div>';
        document.body.appendChild(banner);

        document.getElementById('cookieAccept').addEventListener('click', function() {
          setStored('granted');
          updateConsent(true);
          banner.remove();
        });
        document.getElementById('cookieRefuse').addEventListener('click', function() {
          setStored('denied');
          updateConsent(false);
          // Best-effort: remove any GA cookies that may have slipped through
          try {
            document.cookie.split(';').forEach(function(c) {
              var n = c.split('=')[0].trim();
              if (n.indexOf('_ga') === 0 || n === '_gid' || n === '_gat') {
                document.cookie = n + '=; Max-Age=0; path=/';
                document.cookie = n + '=; Max-Age=0; path=/; domain=' + location.hostname;
                document.cookie = n + '=; Max-Age=0; path=/; domain=.' + location.hostname;
              }
            });
          } catch(e) {}
          banner.remove();
        });
      }

      // Only show banner if choice not yet made
      if (!getStored()) {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', buildBanner);
        } else {
          buildBanner();
        }
      }
    })();

    // ═══════════════ RGPD CHECKBOX — Block submit if unchecked ═══════════════
    (function() {
      document.querySelectorAll('form.contact-form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
          var cb = form.querySelector('input[name="rgpd_consent"]');
          if (cb && !cb.checked) {
            e.preventDefault();
            e.stopImmediatePropagation();
            cb.focus();
            var lang = (document.getElementById('htmlRoot') || document.documentElement).getAttribute('lang') === 'en' ? 'en' : 'fr';
            cb.setCustomValidity(lang === 'en'
              ? 'You must agree to the privacy policy.'
              : 'Vous devez accepter la politique de confidentialité.');
            cb.reportValidity();
          } else if (cb) {
            cb.setCustomValidity('');
          }
        }, true);
      });
    })();
