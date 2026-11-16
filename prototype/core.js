/* Nawah prototype — core runtime: state, i18n, icons, router, layout, shared components. */
'use strict';

const STORE_KEY = 'nawah-demo-v1';
const VAT = 0.14; // illustrative normalisation rate
const TODAY = '2026-11-16';

/* ---------------- state ---------------- */
function initialState() {
  return {
    lang: 'en', langChosen: false, role: 'buyer', current: 'p-nuts',
    projects: {
      'p-nuts': { id: 'p-nuts', code: 'PRJ-2611-014', cat: 'food', sub: 'nuts', builder: 'builder-nuts', type: 'private',
        title: { en: 'Mixed nuts — 200 g pouch', ar: 'مكسرات مشكلة — كيس ٢٠٠ جم' }, stage: 'draft', step: 0,
        spec: { nuts: ['cashew', 'almond', 'hazelnut'], process: 'roasted-salted', flavour: '', grade: 'std', packG: 200, packs: 500,
          pack: 'standup', print: 'printed', artwork: 'logo', shelf: '6', labelLang: 'both', sample: true, samplePacks: 3,
          city: '', addrType: 'warehouse', date: '', budget: 50000, scope: ['nuts', 'processing', 'packaging', 'printing', 'delivery'], notes: '' },
        invited: ['sw1', 'sw2', 'sw3'] },
      'p-dish': { id: 'p-dish', code: 'PRJ-2611-015', cat: 'cleaning', sub: 'dish', builder: 'builder-dish', type: 'private',
        title: { en: 'Dishwashing liquid — 750 ml', ar: 'سائل أطباق — ٧٥٠ مل' }, stage: 'draft', step: 0,
        spec: { route: 'existing', tier: 'standard', fragrance: ['lemon'], color: 'green', size: '750', bottle: 'pet-clear', cap: 'flip', units: 3000,
          label: 'front-back', design: 'have', carton: '12', bottleSource: 'manufacturer', sample: true, docs: ['cr', 'reg', 'sds', 'coa'], city: '', date: '' },
        invited: ['sw4'] },
      'p-table': { id: 'p-table', code: 'PRJ-2611-016', cat: 'furniture', sub: 'tables', builder: 'builder-table', type: 'contract',
        title: { en: 'Solid-wood dining tables', ar: 'ترابيزات سفرة خشب طبيعي' }, stage: 'draft', step: 0,
        spec: { mode: 'finished', ttype: 'dining', shape: 'rect', L: 180, W: 90, H: 75, unit: 'cm', wood: 'beech', thick: '30', finish: 'pu-matte', color: 'natural',
          qty: 40, images: [], notes: '', assembly: 'assembled', install: false, city: '', date: '', prototype: true,
          materials: [{ m: 'beech', t: 30, w: 200, l: 2400, u: 'mm', q: 60 }, { m: 'legs', t: 0, w: 0, l: 0, u: 'pcs', q: 160 }],
          services: ['cut'], moisture: '8–12%' },
        invited: ['sw6'] },
      'p-custom': { id: 'p-custom', code: 'PRJ-2611-017', cat: 'textiles', sub: 'tshirts', builder: 'builder-custom', type: 'private',
        title: { en: 'Cotton T-shirts with print', ar: 'تيشيرتات قطن مطبوعة' }, stage: 'draft', step: 0,
        spec: { tpl: 'tshirt', vals: { fabric: 'cotton100', gsm: '180', fit: ['regular'], print: 'screen', sizes: ['m', 'l', 'xl'], qty: 300, designs: 2 }, city: '', date: '' },
        invited: ['sw8'] },
      'p-coffee': { id: 'p-coffee', code: 'PRJ-2608-003', cat: 'food', sub: 'coffee', builder: 'builder-custom', type: 'private',
        title: { en: 'Turkish coffee with cardamom — 250 g', ar: 'بن تركي محوّج — ٢٥٠ جم' }, stage: 'delivered', step: 0, past: true, deliveredOn: '2026-08-28',
        spec: { tpl: 'coffee', vals: { bean: 'blend', roast: ['medium'], form: 'turkish', addon: ['cardamom'], packG: 250, qty: 800, valve: true }, city: 'Nasr City, Cairo', date: '' },
        invited: [] }
    },
    quotes: defaultQuotes(), quotesArrived: false, shortlist: [], accepted: null,
    saved: ['sw1', 'sw6'],
    threads: {
      sw1: [{ from: 'sys', en: 'Conversation linked to PRJ-2611-014. Keep agreements here so they stay on the project record.', ar: 'المحادثة مربوطة بالمشروع PRJ-2611-014. خلّي الاتفاقات هنا عشان تفضل مسجلة.' }],
      sw2: [{ from: 'sys', en: 'Conversation linked to PRJ-2611-014.', ar: 'المحادثة مربوطة بالمشروع PRJ-2611-014.' }],
      sw3: [{ from: 'sys', en: 'Conversation linked to PRJ-2611-014.', ar: 'المحادثة مربوطة بالمشروع PRJ-2611-014.' }]
    },
    thread: 'sw1',
    sample: { status: 'none', supplier: null, packs: 3, eval: {}, notes: '', decidedOn: null },
    order: { milestone: 0, paid: [false, false], changes: [], issues: [], delivery: null, received: false },
    uploads: [],
    notifs: [
      { id: 'n0', icon: 'sparkle', read: false, en: 'Welcome to Nawah. Your nuts project draft is ready to finish.', ar: 'أهلًا بيك في نواة. مسودة مشروع المكسرات جاهزة تكمّلها.', go: 'builder-nuts', t: TODAY }
    ],
    supplier: { submitted: false, draft: null, profileStep: 0, profile: { name: 'Al-Waha Roasting Co.', nameAr: 'شركة الواحة للتحميص', cr: '45781', tax: '512-338-901', gov: 'qalyubia',
      cats: ['food'], procs: ['roasting', 'salting', 'flavouring', 'pouch-filling'], capKg: 1500, moq: 60, lead: '15–20',
      certs: [{ name: 'Food-safety certificate', exp: '2027-03-31' }, { name: 'Factory operating licence', exp: '2026-12-20' }], status: 'approved' } },
    admin: { applicants: JSON.parse(JSON.stringify(ADMIN_APPLICANTS)), sel: 'ap1', siteVisit: {}, reqSel: 'r1', nudged: {} },
    templates: defaultTemplates(),
    ui: { sup: { q: '', cat: 'all', gov: 'all', maxMoq: '', verified: false, savedOnly: false }, catFilters: {}, startPath: null, startType: null, idea: '', vatIncl: true, onlyDiff: false, tplSel: 'tshirt', docQuery: '' }
  };
}

let S;
try { S = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { S = null; }
if (!S || !S.projects || !S.projects['p-nuts']) S = initialState();

let saveTimer = null;
function persist() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* storage blocked: demo keeps working in memory */ } }
function save(showIndicator) {
  persist();
  if (!showIndicator) return;
  document.querySelectorAll('.save-ind').forEach(el => { el.classList.add('saving'); el.querySelector('.txt').textContent = tx('Saving draft…', 'جاري حفظ المسودة…'); });
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => document.querySelectorAll('.save-ind').forEach(el => { el.classList.remove('saving'); el.querySelector('.txt').textContent = tx('Draft saved · just now', 'المسودة محفوظة · الآن'); }), 650);
}

/* ---------------- i18n & format ---------------- */
const isAr = () => S.lang === 'ar';
const tx = (en, ar) => (isAr() ? ar : en);
const L = o => (o == null ? '' : typeof o === 'string' ? o : (isAr() ? (o.ar ?? o.en) : o.en));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nf = (n, d = 0) => new Intl.NumberFormat('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(n);
const egp = (n, d = 0) => `<span class="num" dir="ltr">${isAr() ? '' : 'EGP '}${nf(n, d)}${isAr() ? ' ج.م' : ''}</span>`;
const egpT = (n, d = 0) => (isAr() ? `${nf(n, d)} ج.م` : `EGP ${nf(n, d)}`);
const fdate = iso => { if (!iso) return '—'; const d = new Date(iso + 'T12:00:00'); return new Intl.DateTimeFormat(isAr() ? 'ar-EG-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d); };
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const ltr = s => `<bdi dir="ltr">${esc(s)}</bdi>`;
const sup = id => SUPPLIERS.find(s => s.id === id);
const cat = id => CATEGORIES.find(c => c.id === id);
const proj = (id = S.current) => S.projects[id];
const initials = s => s.en.split(/\s+/).filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('');

const STAGES = {
  draft: { en: 'Draft', ar: 'مسودة', c: '' },
  rfq: { en: 'RFQ sent', ar: 'تم إرسال الطلب', c: 'info' },
  quotes: { en: 'Quotes received', ar: 'وصلت العروض', c: 'info' },
  sample: { en: 'Sample stage', ar: 'مرحلة العينة', c: 'warn' },
  approved: { en: 'Sample approved', ar: 'العينة معتمدة', c: 'ok' },
  order: { en: 'In production', ar: 'تحت الإنتاج', c: 'brand' },
  delivered: { en: 'Delivered', ar: 'تم التسليم', c: 'ok' }
};
const stagePill = st => `<span class="pill ${STAGES[st].c}">${L(STAGES[st])}</span>`;

/* ---------------- icons (24px stroke set) ---------------- */
const IC = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  folder: '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
  bell: '<path d="M6 16V11a6 6 0 1112 0v5l2 2H4z"/><path d="M10 20a2 2 0 004 0"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  factory: '<path d="M3 21V10l6 4V10l6 4V6l6 3v12z"/><path d="M7 17h2M12 17h2M17 17h1"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"/>',
  file: '<path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8z"/><path d="M14 3v5h5M8 13h8M8 17h5"/>',
  msg: '<path d="M4 5h16v11H8l-4 4z"/>',
  box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17.5v.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/>',
  compare: '<path d="M8 3v18M16 3v18M3 8h5M16 8h5M3 16h5M16 16h5"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/><path d="M7.5 15h9"/>',
  nut: '<path d="M12 3c4 0 7 4 7 9s-3 9-7 9-7-4-7-9 3-9 7-9z"/><path d="M12 3c-1.5 3-1.5 15 0 18M8 8c2 1 6 1 8 0"/>',
  bottle: '<path d="M10 2h4v3l1 2v2a3 3 0 012 3v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8a3 3 0 012-3V7l1-2z"/><path d="M7 14h10"/>',
  table: '<path d="M3 8h18M5 8v12M19 8v12M3 8l2-3h14l2 3M8 12h8"/>',
  shirt: '<path d="M8 3l-5 3 2 5 3-1v11h8V10l3 1 2-5-5-3c-1 2-2 3-4 3s-3-1-4-3z"/>',
  pouch: '<path d="M6 4h12l-1 4c2 2 3 5 3 8a5 5 0 01-5 5H9a5 5 0 01-5-5c0-3 1-6 3-8z"/><path d="M7 8h10"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 17l9 5 9-5" opacity=".7"/>',
  wand: '<path d="M4 20L16 8M14 4v3M18 6h3M19 10v3M11 6H8"/>',
  wrench: '<path d="M14.5 6a4.5 4.5 0 00-5.8 5.8L3 17.5 6.5 21l5.7-5.7A4.5 4.5 0 0018 9.5l-2.7 2.7-3.5-3.5z"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  cart: '<path d="M3 4h3l2 12h11l2-8H7"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
  chart: '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  send: '<path d="M4 12l16-8-6 16-2-7z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  refresh: '<path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-6-6-9 9"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  wallet: '<path d="M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M3 7l12-4v4M16 13h2"/>',
  scale: '<path d="M12 3v18M5 21h14M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 .5c0 2-2.5 2-2.5 4M12 17.5v.5"/>',
  flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
  repeat: '<path d="M4 12V9a3 3 0 013-3h12M16 3l3 3-3 3M20 12v3a3 3 0 01-3 3H5M8 21l-3-3 3-3"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>'
};
const ic = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || IC.info}</svg>`;
const logo = (s = 34) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="var(--brand)"/><path d="M20 8c6 4 8.5 9 8.5 13.5A8.5 8.5 0 0120 30a8.5 8.5 0 01-8.5-8.5C11.5 17 14 12 20 8z" fill="var(--accent)"/><path d="M20 30V17.5M20 22l4-3.5" stroke="var(--brand)" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>`;

/* ---------------- shared components ---------------- */
function crumbs(items) {
  return `<nav class="crumbs" aria-label="${tx('Breadcrumb', 'مسار التنقل')}">${items.map((it, i) => {
    const last = i === items.length - 1;
    return (last ? `<span aria-current="page">${it[0]}</span>` : `<a href="#${it[1]}">${it[0]}</a>${ic('chev', 'flip')}`);
  }).join('')}</nav>`;
}
function emptyState(icon, title, body, action) {
  return `<div class="empty"><div class="ic">${ic(icon)}</div><h3>${title}</h3><p>${body}</p>${action || ''}</div>`;
}
function verifyBadge(s) {
  if (!s.checks.length) return `<span class="pill">${tx('Not yet reviewed', 'لم تتم المراجعة بعد')}</span>`;
  const last = s.checks.map(c => c.d).sort().pop();
  return `<details class="verify"><summary class="pill ok">${ic('shield')} ${tx('Documents reviewed', 'تمت مراجعة المستندات')} · ${fdate(last)}</summary>
    <div class="verify-pop" role="dialog"><b>${tx('What Nawah checked', 'نواة راجعت إيه')}</b>
    <ul>${s.checks.map(c => `<li>${L(c)} — ${fdate(c.d)}</li>`).join('')}</ul>
    ${s.certs.length ? `<b>${tx('Supplier-uploaded certificates', 'شهادات رفعها المورد')}</b><ul>${s.certs.map(c => `<li>${L(c)} · ${tx('expires', 'تنتهي')} ${fdate(c.exp)}</li>`).join('')}</ul>` : ''}
    <p class="faint">${tx('A document review confirms the papers we saw on those dates. It does not guarantee product quality, capacity or delivery. Approve a sample before production.', 'مراجعة المستندات بتأكد الأوراق اللي شفناها في التواريخ دي بس. مش ضمان لجودة المنتج أو الطاقة أو التسليم. اعتمد عينة قبل الإنتاج.')}</p></div></details>`;
}
function demoTag() { return `<span class="demo-tag">${tx('DEMO', 'تجريبي')}</span>`; }
function supLogo(s) { return `<div class="sup-logo" aria-hidden="true">${initials(s)}</div>`; }

/* form controls bound to state paths */
function getPath(path) { return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), S); }
function setPath(path, v) { const ks = path.split('.'); const last = ks.pop(); const o = ks.reduce((a, k) => (a[k] ??= {}), S); o[last] = v; }
const fid = path => 'f-' + path.replace(/[^a-z0-9]/gi, '-');
function fieldWrap(path, label, inner, o = {}) {
  const err = ERRORS[path];
  return `<div class="field ${err ? 'invalid' : ''}" ${o.span ? 'style="grid-column:1/-1"' : ''}>
    ${o.group ? `<span class="label" id="${fid(path)}-l">${label}${o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}</span>` : `<label for="${fid(path)}">${label}${o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}</label>`}
    ${o.hint ? `<span class="hint">${o.hint}</span>` : ''}${inner}
    ${err ? `<span class="err" role="alert">${ic('alert')} ${err}</span>` : ''}</div>`;
}
function fRadio(path, label, opts, o = {}) {
  const v = getPath(path);
  return fieldWrap(path, label, `<div class="opts ${o.wide ? 'wide' : ''}" role="radiogroup" aria-labelledby="${fid(path)}-l">${opts.map(op => `
    <label class="opt"><input type="radio" name="${fid(path)}" value="${op[0]}" data-bind="${path}" ${String(v) === String(op[0]) ? 'checked' : ''}><span class="mark"></span>
    <span><span class="t">${isAr() ? op[2] : op[1]}</span>${op[3] ? `<span class="d">${isAr() ? op[4] : op[3]}</span>` : ''}</span></label>`).join('')}</div>`, { ...o, group: true });
}
function fChips(path, label, opts, o = {}) {
  const v = getPath(path) || [];
  return fieldWrap(path, label, `<div class="opts ${o.wide ? 'wide' : ''}" role="group" aria-labelledby="${fid(path)}-l">${opts.map(op => `
    <label class="opt multi"><input type="checkbox" value="${op[0]}" data-bind-multi="${path}" ${v.includes(op[0]) ? 'checked' : ''}><span class="mark"></span>
    <span><span class="t">${isAr() ? (op[2] || op[1]) : op[1]}</span>${op[3] ? `<span class="d">${isAr() ? op[4] : op[3]}</span>` : ''}</span></label>`).join('')}</div>`, { ...o, group: true });
}
function fSelect(path, label, opts, o = {}) {
  const v = getPath(path);
  return fieldWrap(path, label, `<select class="select" id="${fid(path)}" data-bind="${path}">
    <option value="">${tx('Select…', 'اختر…')}</option>${opts.map(op => `<option value="${op[0]}" ${String(v) === String(op[0]) ? 'selected' : ''}>${isAr() ? (op[2] || op[1]) : op[1]}</option>`).join('')}</select>`, o);
}
function fNum(path, label, unit, o = {}) {
  const v = getPath(path);
  return fieldWrap(path, label, `<div class="input-unit"><input class="input num" type="number" inputmode="decimal" min="${o.min ?? 0}" step="${o.step ?? 1}" id="${fid(path)}" data-bind="${path}" data-num value="${v ?? ''}"><span class="unit">${unit}</span></div>`, o);
}
function fText(path, label, o = {}) {
  const v = getPath(path);
  return fieldWrap(path, label, `<input class="input" type="${o.type || 'text'}" id="${fid(path)}" data-bind="${path}" value="${esc(v)}" placeholder="${esc(o.ph || '')}" ${o.dir ? `dir="${o.dir}"` : ''}>`, o);
}
function fArea(path, label, o = {}) {
  return fieldWrap(path, label, `<textarea class="textarea" id="${fid(path)}" data-bind="${path}" placeholder="${esc(o.ph || '')}">${esc(getPath(path))}</textarea>`, o);
}
function fToggle(path, label, o = {}) {
  return `<label class="switch"><input type="checkbox" data-bind-bool="${path}" ${getPath(path) ? 'checked' : ''}> <span>${label}</span></label>${o.hint ? `<span class="hint faint">${o.hint}</span>` : ''}`;
}
let ERRORS = {};

/* ---------------- toasts / modals / drawer ---------------- */
function toast(msg, icon = 'check') {
  const box = document.getElementById('toasts');
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
  el.innerHTML = `${ic(icon)}<span>${msg}</span>`; box.appendChild(el);
  setTimeout(() => el.remove(), 3800);
}
let lastFocus = null;
function openModal(html, wide) {
  lastFocus = document.activeElement;
  const root = document.getElementById('overlay');
  root.innerHTML = `<div class="scrim" data-act="closeModal"></div><div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" tabindex="-1">${html}</div>`;
  const m = root.querySelector('.modal'); (m.querySelector('input,select,textarea,button:not([data-act=closeModal])') || m).focus();
}
function closeModal() { document.getElementById('overlay').innerHTML = ''; if (lastFocus && lastFocus.isConnected) lastFocus.focus(); }
function notify(en, ar, icon = 'bell', go = '') {
  S.notifs.unshift({ id: 'n' + Date.now() + Math.random().toString(36).slice(2, 5), icon, read: false, en, ar, go, t: TODAY });
  const dot = document.querySelector('#bell .dot'); const n = S.notifs.filter(x => !x.read).length;
  const bell = document.getElementById('bell'); if (bell) bell.innerHTML = ic('bell') + (n ? `<span class="dot">${n}</span>` : '');
  void dot;
}
function drawerNotifs() {
  return `<div class="scrim" data-act="closeModal"></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="${tx('Notifications', 'الإشعارات')}" tabindex="-1">
    <div class="drawer-head"><h3>${tx('Notifications', 'الإشعارات')}</h3><div class="row"><button class="btn btn-ghost btn-sm" data-act="readAll">${tx('Mark all read', 'تحديد الكل كمقروء')}</button><button class="icon-btn" data-act="closeModal" aria-label="${tx('Close', 'إغلاق')}">${ic('x')}</button></div></div>
    <div class="drawer-body">${S.notifs.length ? S.notifs.map(n => `<button class="notif ${n.read ? '' : 'unread'}" data-act="openNotif" data-id="${n.id}"><span class="ic">${ic(n.icon)}</span><span class="grow"><span style="display:block;font-size:.9rem">${L(n)}</span><span class="faint">${fdate(n.t)}</span></span></button>`).join('')
      : emptyState('bell', tx('No notifications', 'مفيش إشعارات'), tx('Updates on quotes, samples and production will appear here.', 'تحديثات العروض والعينات والإنتاج هتظهر هنا.'))}</div></aside>`;
}

/* ---------------- layout ---------------- */
const NAV = {
  buyer: [['home', 'Home', 'الرئيسية'], ['categories', 'Categories', 'الأقسام'], ['suppliers', 'Suppliers', 'الموردين'], ['dashboard', 'My projects', 'مشاريعي'], ['help', 'Help', 'المساعدة']],
  supplier: [['supplier-home', 'Overview', 'نظرة عامة'], ['supplier-rfqs', 'Matching RFQs', 'الطلبات المناسبة'], ['supplier-profile', 'Company profile', 'ملف الشركة'], ['help', 'Help', 'المساعدة']],
  admin: [['admin-home', 'Overview', 'نظرة عامة'], ['admin-suppliers', 'Supplier review', 'مراجعة الموردين'], ['admin-requests', 'Requests & matching', 'الطلبات والترشيح'], ['admin-templates', 'Templates', 'القوالب'], ['help', 'Help', 'المساعدة']]
};
function layout(route, body) {
  const unread = S.notifs.filter(n => !n.read).length;
  const navActive = r => route === r || (r === 'dashboard' && (route.startsWith('project') || route.startsWith('builder'))) || (r === 'categories' && route.startsWith('cat-'))
    || (r === 'supplier-rfqs' && route === 'supplier-quote') ? 'aria-current="page"' : '';
  return `<a class="sr-only" href="#main">${tx('Skip to content', 'انتقل للمحتوى')}</a>
  <header class="topbar"><div class="wrap">
    <a class="brand" href="#${S.role === 'buyer' ? 'home' : S.role === 'supplier' ? 'supplier-home' : 'admin-home'}" aria-label="Nawah">${logo()}<span class="brand-name">${tx('Nawah', 'نواة')}<small>${tx('From idea to product', 'من الفكرة للمنتج')}</small></span></a>
    <nav class="nav" id="nav" aria-label="${tx('Main', 'الرئيسية')}">${NAV[S.role].map(n => `<a href="#${n[0]}" ${navActive(n[0])}>${isAr() ? n[2] : n[1]}</a>`).join('')}</nav>
    <div class="top-actions">
      <label class="role-select"><span class="lbl">${tx('View as', 'العرض كـ')}</span>
        <select data-act-change="role" aria-label="${tx('Switch workspace', 'تغيير مساحة العمل')}">
          <option value="buyer" ${S.role === 'buyer' ? 'selected' : ''}>${tx('Brand owner', 'صاحب براند')}</option>
          <option value="supplier" ${S.role === 'supplier' ? 'selected' : ''}>${tx('Supplier', 'مورد / مصنع')}</option>
          <option value="admin" ${S.role === 'admin' ? 'selected' : ''}>${tx('Nawah ops', 'فريق نواة')}</option></select></label>
      <button class="lang-btn" data-act="lang" lang="${isAr() ? 'en' : 'ar'}" aria-label="${tx('Switch to Arabic', 'التحويل للإنجليزية')}">${isAr() ? 'English' : 'عربي'}</button>
      <button class="icon-btn" id="bell" data-act="notifs" aria-label="${tx('Notifications', 'الإشعارات')}">${ic('bell')}${unread ? `<span class="dot">${unread}</span>` : ''}</button>
      <button class="icon-btn menu-btn" data-act="menu" aria-label="${tx('Menu', 'القائمة')}" aria-controls="nav">${ic('menu')}</button>
    </div></div></header>
  <div class="demo-ribbon"><div class="wrap">${ic('info')}<span>${tx('Prototype with fictional demo companies, prices and documents. No real payments, escrow or certifications.', 'نموذج أولي بشركات وأسعار ومستندات وهمية للعرض. مفيش مدفوعات أو ضمانات أو شهادات حقيقية.')} <a href="#help-simulated">${tx('What is simulated?', 'إيه اللي متمثّل؟')}</a></span></div></div>
  <main id="main" class="view-enter" tabindex="-1">${body}</main>
  <footer class="site"><div class="wrap row-between"><div class="row">${logo(26)}<span>${tx('Nawah — demo prototype · Egypt', 'نواة — نموذج تجريبي · مصر')}</span></div>
    <div class="row"><a href="#about">${tx('How Nawah works', 'إزاي نواة بتشتغل')}</a><a href="#brand">${tx('Brand', 'الهوية')}</a><a href="#help">${tx('Glossary', 'المصطلحات')}</a><a href="#help-simulated">${tx('What is simulated', 'إيه المتمثّل')}</a><button class="btn btn-ghost btn-sm" data-act="reset">${ic('refresh')} ${tx('Reset demo', 'إعادة الديمو')}</button></div></div></footer>`;
}

/* ---------------- router ---------------- */
const VIEWS = {};
const PARTIALS = {}; // live regions re-rendered on input without losing focus
function currentRoute() { const h = location.hash.slice(1); return h || (S.role === 'buyer' ? 'home' : S.role === 'supplier' ? 'supplier-home' : 'admin-home'); }
function render(keepScroll) {
  const route = currentRoute();
  document.documentElement.lang = S.lang; document.documentElement.dir = isAr() ? 'rtl' : 'ltr';
  document.title = tx('Nawah — Product Sourcing', 'نواة — من الفكرة للمنتج');
  const fn = VIEWS[route] || (route.startsWith('cat-') ? VIEWS.category : route.startsWith('help') ? VIEWS.help : VIEWS.notfound);
  let body; try { body = fn(route); } catch (e) { console.error(e); body = `<div class="wrap section">${emptyState('alert', tx('Something went wrong', 'حصلت مشكلة'), esc(e.message), `<a class="btn btn-primary" href="#home">${tx('Back home', 'الرجوع للرئيسية')}</a>`)}</div>`; }
  const y = window.scrollY; let focusSel = null; const a = document.activeElement;
  if (keepScroll && a && a !== document.body && document.getElementById('app').contains(a)) {
    if (a.id) focusSel = '#' + CSS.escape(a.id);
    else if (a.name && a.type === 'radio') focusSel = `input[name="${a.name}"][value="${CSS.escape(a.value)}"]`;
    else if (a.dataset.bindMulti) focusSel = `input[data-bind-multi="${a.dataset.bindMulti}"][value="${CSS.escape(a.value)}"]`;
    else if (a.dataset.bindBool) focusSel = `input[data-bind-bool="${a.dataset.bindBool}"]`;
    else if (a.dataset.act) focusSel = `[data-act="${a.dataset.act}"]` + (a.dataset.id ? `[data-id="${a.dataset.id}"]` : '') + (a.dataset.i ? `[data-i="${a.dataset.i}"]` : '');
  }
  document.getElementById('app').innerHTML = layout(route, body);
  if (keepScroll) document.getElementById('main').classList.remove('view-enter');
  if (!S.langChosen) openLangGate();
  if (keepScroll) window.scrollTo(0, y); else { window.scrollTo(0, 0); if (S.langChosen && document.activeElement === document.body) document.getElementById('main').focus({ preventScroll: true }); }
  if (focusSel) { try { document.querySelector(focusSel)?.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  if (route === 'help-simulated') setTimeout(() => document.getElementById('simulated')?.scrollIntoView(), 0);
  refreshPartials();
}
function refreshPartials() { document.querySelectorAll('[data-live]').forEach(el => { const f = PARTIALS[el.dataset.live]; if (f) el.innerHTML = f(); }); }
function go(route) { if (location.hash.slice(1) === route) render(); else location.hash = route; }
window.addEventListener('hashchange', () => { ERRORS = {}; render(); });

function openLangGate() {
  openModal(`<div class="lang-gate">${logo(52)}<div><h2>Nawah · نواة</h2><p class="muted" style="margin-top:6px">Choose your language · اختر اللغة</p></div>
    <div class="choices"><button data-act="pickLang" data-v="ar" lang="ar" dir="rtl">العربية<small>واجهة من اليمين لليسار</small></button><button data-act="pickLang" data-v="en" lang="en">English<small>Left-to-right interface</small></button></div>
    <p class="faint">You can switch at any time from the top bar · تقدر تغيّر في أي وقت من الشريط العلوي</p></div>`);
}

/* ---------------- event delegation ---------------- */
const ACTIONS = {};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const fn = ACTIONS[el.dataset.act]; if (!fn) return;
  if (el.tagName === 'A' && !el.getAttribute('href')?.startsWith('#')) return;
  e.preventDefault(); fn(el, e);
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.actChange && ACTIONS[el.dataset.actChange]) { ACTIONS[el.dataset.actChange](el, e); return; }
  if (el.dataset.bindMulti) {
    const arr = new Set(getPath(el.dataset.bindMulti) || []); el.checked ? arr.add(el.value) : arr.delete(el.value);
    setPath(el.dataset.bindMulti, [...arr]); afterBind(el.dataset.bindMulti, el);
  } else if (el.dataset.bindBool) { setPath(el.dataset.bindBool, el.checked); afterBind(el.dataset.bindBool, el); }
  else if (el.dataset.bind && (el.type === 'radio' || el.tagName === 'SELECT')) { setPath(el.dataset.bind, el.value); afterBind(el.dataset.bind, el); }
  if (el.type === 'file' && el.dataset.upload) handleUpload(el);
});
document.addEventListener('input', e => {
  const el = e.target; if (!el.dataset.bind || el.type === 'radio' || el.tagName === 'SELECT') return;
  setPath(el.dataset.bind, el.dataset.num !== undefined ? (el.value === '' ? '' : Number(el.value)) : el.value); afterBind(el.dataset.bind, el, true);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('overlay').innerHTML) { if (!S.langChosen) return; closeModal(); } });
function afterBind(path, el, typing) {
  if (ERRORS[path]) { delete ERRORS[path]; const f = el.closest('.field'); if (f) { f.classList.remove('invalid'); f.querySelector('.err')?.remove(); } }
  save(true);
  if (!typing) render(true); else refreshPartials();
}

/* uploads: kept in this browser only */
function handleUpload(el) {
  const files = [...el.files]; const target = el.dataset.upload;
  files.forEach(f => {
    if (f.size > 10 * 1024 * 1024) { toast(tx(`“${esc(f.name)}” is over 10 MB. Compress it or share a link instead.`, `الملف “${esc(f.name)}” أكبر من ١٠ ميجا. صغّره أو ابعت لينك.`), 'alert'); return; }
    const rec = { name: f.name, size: f.size, type: f.type, at: TODAY, target };
    const finish = () => { if (target === 'table-images') proj('p-table').spec.images.push(rec); else { S.uploads.push(rec); if (target === 'msg') (S.threads[S.thread + '-x'] ??= []).push({ from: 'me', text: '', file: f.name }); } save(); render(true); toast(tx(`Uploaded ${esc(f.name)} (stored in this browser only)`, `تم رفع ${esc(f.name)} (محفوظ في المتصفح ده بس)`), 'upload'); };
    if (f.type.startsWith('image/') && f.size < 1.5 * 1024 * 1024) { const r = new FileReader(); r.onload = () => { rec.preview = r.result; finish(); }; r.readAsDataURL(f); } else finish();
  });
}
