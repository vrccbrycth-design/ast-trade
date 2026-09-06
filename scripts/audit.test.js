const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync, readdirSync } = require('node:fs');
const { resolve, join } = require('node:path');
const { JSDOM } = require('jsdom');
const root = resolve(__dirname, '..');
const read = name => readFileSync(join(root, name), 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));

function fixture(page = 'ananas.html') {
  const dom = new JSDOM(read(page), { url: 'https://ast-trade.com/' + page.replace('.html', ''), runScripts: 'outside-only' });
  const { window: w } = dom;
  const form = w.document.getElementById('contactForm');
  const events = [];
  w.astTrack = (...args) => events.push(args);
  w.fetch = async () => ({ ok: true, json: async () => ({ ok: true }) });
  const values = { societe: 'Test société', nom: 'Test privé', email: 'test@example.invalid', pays: 'France', volume: 'a-definir' };
  for (const [name,value] of Object.entries(values)) form.elements[name].value = value;
  form.elements.rgpd_consent.checked = true;
  w.eval(read('forms.js'));
  return { dom, w, form, events, submit: () => form.dispatchEvent(new w.Event('submit', { cancelable: true, bubbles: true })) };
}

test('a confirmed success sends one lead without identity fields and preserves product selection', async () => {
  const f = fixture(); let requests = 0; let finish;
  f.w.fetch = () => { requests++; return new Promise(resolve => { finish=resolve; }); };
  f.submit(); f.submit();
  assert.equal(requests, 1);
  assert.equal(f.form.querySelector('button[type=submit]').disabled, true);
  finish({ ok: true, json: async () => ({ ok: true }) }); await tick();
  assert.equal(f.events.length, 1); assert.equal(f.events[0][0], 'generate_lead');
  assert.deepEqual(Object.keys(f.events[0][1]).sort(), ['form_id','language','page_path','product']);
  assert.equal(f.events[0][1].product, 'ananas');
  assert.equal(f.form.elements.produit.value, 'ananas'); assert.equal(f.form.elements.email.value, '');
  assert.match(f.w.document.getElementById('form-status').textContent, /envoyée/);
  f.dom.window.close();
});

for (const failure of ['server','network','unconfirmed','timeout']) {
  test(failure+' does not count a lead or discard the enquiry', async () => {
    const f=fixture('en/pineapple.html');
    f.w.fetch = async () => {
      if (failure==='network') throw new Error('offline');
      if (failure==='timeout') { const e=new Error('aborted'); e.name='AbortError'; throw e; }
      return { ok: failure !== 'server', json: async () => ({ ok: false }) };
    };
    f.submit(); await tick();
    assert.equal(f.events.filter(e=>e[0]==='generate_lead').length,0);
    assert.equal(f.form.elements.email.value,'test@example.invalid');
    assert.equal(f.form.querySelector('button[type=submit]').disabled,false);
    assert.match(f.w.document.getElementById('form-status').textContent, failure==='timeout' ? /may have been received/ : /could not confirm/);
    f.dom.window.close();
  });
}

test('invalid, unchecked and spam requests never reach Formspree', async () => {
  for (const scenario of ['email','consent','spam']) {
    const f=fixture(); let count=0; f.w.fetch=async()=>{count++;};
    if(scenario==='email') f.form.elements.email.value='';
    if(scenario==='consent') f.form.elements.rgpd_consent.checked=false;
    if(scenario==='spam') f.form.elements._gotcha.value='bot';
    f.submit(); await tick(); assert.equal(count,0); f.dom.window.close();
  }
});

test('cookies can be refused, reopened, accepted and withdrawn without duplicate Google tags', () => {
  const dom=new JSDOM(read('en/index.html'), {url:'https://ast-trade.com/en/', runScripts:'outside-only'}); const w=dom.window;
  w.eval(read('analytics.js'));
  assert.equal(w.document.getElementById('ast-google-tag'),null);
  w.astTrack('generate_lead',{}); assert.equal(w.dataLayer,undefined);
  w.document.getElementById('cookieRefuse').click();
  assert.equal(w.document.getElementById('cookie-banner'),null);
  w.document.querySelector('[data-cookie-settings]').click();
  assert.equal(w.document.querySelector('#cookie-description a').pathname,'/en/privacy-policy');
  w.document.getElementById('cookieAccept').click();
  assert.equal(w.document.querySelectorAll('#ast-google-tag').length,1);
  w.astTrack('generate_lead',{product:'ananas'});
  assert.equal(w.dataLayer.filter(x=>x[0]==='event').length,1);
  w.document.cookie='_ga=test; path=/';
  w.document.querySelector('[data-cookie-settings]').click(); w.document.getElementById('cookieRefuse').click();
  assert.equal(w['ga-disable-G-KJX42G51Q4'],true); assert.equal(w.document.cookie.includes('_ga='),false);
  w.astTrack('generate_lead',{}); assert.equal(w.dataLayer.filter(x=>x[0]==='event').length,1);
  w.document.querySelector('[data-cookie-settings]').click(); w.document.getElementById('cookieAccept').click();
  assert.equal(w.document.querySelectorAll('#ast-google-tag').length,1);
  dom.window.close();
});

test('expired consent is requested again and unavailable storage does not block the form', () => {
  for (const mode of ['expired','unavailable']) {
    const f=fixture();
    if(mode==='expired') {
      f.w.localStorage.setItem('ast-cookie-consent','granted');
      f.w.localStorage.setItem('ast-cookie-consent-at',String(Date.now()-181*86400000));
    } else Object.defineProperty(f.w,'localStorage',{get(){throw new Error('blocked');}});
    f.w.eval(read('analytics.js'));
    assert.ok(f.w.document.getElementById('cookie-banner'));
    assert.equal(f.w.document.getElementById('ast-google-tag'),null);
    f.w.document.getElementById('cookieRefuse').click(); f.dom.window.close();
  }
});

test('a visitor who refuses analytics can still send a successful quote', async () => {
  const f=fixture(); f.w.eval(read('analytics.js'));
  f.w.document.getElementById('cookieRefuse').click();
  f.submit(); await tick();
  assert.match(f.w.document.getElementById('form-status').textContent,/envoyée/);
  assert.equal(f.w.dataLayer,undefined);
  assert.equal(f.w.document.getElementById('ast-google-tag'),null);
  f.dom.window.close();
});

test('all 18 pages have resolvable local assets, one H1, correct language and aligned FAQs', () => {
  const pages=[...readdirSync(root).filter(x=>x.endsWith('.html')), ...readdirSync(join(root,'en')).filter(x=>x.endsWith('.html')).map(x=>'en/'+x)];
  assert.equal(pages.length,18);
  for(const page of pages) {
    const dom=new JSDOM(read(page),{url:'https://ast-trade.com/'+page}); const d=dom.window.document;
    assert.equal(d.querySelectorAll('h1').length,1,page);
    assert.ok(d.querySelector('[data-cookie-settings]'),page);
    assert.equal(d.querySelectorAll('script[src*="googletagmanager"]').length,0,page);
    assert.equal(d.querySelectorAll('script[data-pplx-inline-edit]').length,0,page);
    assert.equal([...d.querySelectorAll('script:not([src])')].filter(s => s.type !== 'application/ld+json').length,0,page);
    assert.equal(d.querySelectorAll('link[href*="fonts.googleapis.com"]').length,0,page);
    for(const el of d.querySelectorAll('img[src],script[src],link[rel=stylesheet]')) {
      const url=new URL(el.getAttribute('src')||el.getAttribute('href'),dom.window.location.href);
      if(url.hostname==='ast-trade.com') assert.ok(existsSync(join(root,decodeURI(url.pathname))), page+' '+url.pathname);
    }
    if(page.startsWith('en/')) {
      assert.equal(d.querySelectorAll('[title^="Janvier"],img[alt="Beurre de karité"]').length,0,page);
      if(d.querySelector('form')) assert.equal(d.querySelector('[name="_language"]').value,'en',page);
    }
    for(const block of d.querySelectorAll('script[type="application/ld+json"]')) {
      const data=JSON.parse(block.textContent);
      if(data['@type']!=='FAQPage') continue;
      const faqs=[...d.querySelectorAll('details.faq-item')];
      assert.equal(data.mainEntity.length,faqs.length,page);
      data.mainEntity.forEach((qa,i)=>{
        assert.equal(qa.name,faqs[i].querySelector('summary').textContent.trim(),page);
        assert.equal(qa.acceptedAnswer.text,faqs[i].querySelector('.faq-a').textContent.trim(),page);
      });
    }
    dom.window.close();
  }
});
