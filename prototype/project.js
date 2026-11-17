/* Nawah prototype — project workspace (quotes, comparison, messages, samples, order, documents). */
'use strict';

const PAY_SPLIT = { sw1: [50, 50], sw2: [30, 70], sw3: [0, 100] };

/* Normalise a quote to the buyer's requested quantity and a single VAT basis. */
function normQuote(id) {
  const q = S.quotes[id]; const s = proj('p-nuts').spec;
  const kg = (q.packs * q.packG) / 1000; const reqKg = (s.packs * s.packG) / 1000;
  const product = q.basis === 'kg' ? q.product * kg : q.product * q.packs;
  const packaging = q.packaging * q.packs;
  const sampleNet = q.sampleDeductible ? 0 : q.sample;
  const delivery = q.delivery == null ? 0 : q.delivery;
  const sub = product + packaging + q.setup + sampleNet + delivery;
  const exVat = q.vatIncluded ? sub / (1 + VAT) : sub; const incVat = q.vatIncluded ? sub : sub * (1 + VAT);
  const total = S.ui.vatIncl ? incVat : exVat;
  const match = Math.max(0, 100 - 15 * q.deviations.length);
  return { id, q, kg, reqKg, product, packaging, sampleNet, delivery, exVat, incVat, total, perKg: total / kg, perReqPack: (total / kg) * (s.packG / 1000),
    complete: q.delivery != null, match, sameQty: Math.abs(kg - reqKg) < 0.01, samePack: q.packG === Number(s.packG) };
}
function quoteLabels() {
  const ids = Object.keys(S.quotes); const N = ids.map(normQuote); const out = {}; ids.forEach(i => (out[i] = []));
  const complete = N.filter(n => n.complete);
  if (complete.length) { const b = complete.reduce((a, c) => (c.total < a.total ? c : a)); out[b.id].push(['ok', tx('Lowest comparable total', 'أقل إجمالي قابل للمقارنة'), tx('Lowest total among complete quotes, same quantity and VAT basis. Incomplete quotes are excluded.', 'أقل إجمالي بين العروض الكاملة، بنفس الكمية والضريبة. العروض الناقصة مستبعدة.')]); }
  const moq = N.reduce((a, c) => (c.q.moqKg < a.q.moqKg ? c : a)); out[moq.id].push(['info', tx('Lowest MOQ', 'أقل حد أدنى'), tx('Smallest minimum order in kg — easiest to start small or reorder.', 'أقل حد أدنى بالكيلو — الأسهل للبداية الصغيرة أو إعادة الطلب.')]);
  const fast = N.reduce((a, c) => (c.q.leadDays < a.q.leadDays ? c : a)); out[fast.id].push(['info', tx('Fastest delivery', 'أسرع تسليم'), tx('Shortest supplier-stated production lead time. Not a guarantee.', 'أقصر مدة إنتاج حسب المورد. مش ضمان.')]);
  const close = N.reduce((a, c) => (c.match > a.match ? c : a)); out[close.id].push(['brand', tx('Closest specification match', 'الأقرب للمواصفات'), tx('Fewest deviations from your spec sheet.', 'أقل اختلافات عن ملف المواصفات.')]);
  return out;
}
const labelPills = (arr) => arr.map(l => `<span class="pill ${l[0]}" title="${esc(l[2])}">${l[1]}</span>`).join('');

/* ---------- workspace shell ---------- */
const PTABS = [['project-overview', 'Overview', 'نظرة عامة'], ['project-quotes', 'Quotations', 'العروض'], ['project-compare', 'Compare', 'المقارنة'], ['project-messages', 'Messages', 'الرسائل'], ['project-samples', 'Samples', 'العينات'], ['project-order', 'Order & payments', 'الطلب والمدفوعات'], ['project-launch', 'Pricing & launch', 'التسعير والإطلاق'], ['project-docs', 'Documents', 'المستندات']];
function wsShell(route, title, body) {
  const p = proj(); const full = p.id === 'p-nuts';
  const tabs = full ? PTABS : PTABS.filter(t => ['project-overview', 'project-launch', 'project-docs'].includes(t[0]));
  const counts = { 'project-quotes': S.quotesArrived ? Object.keys(S.quotes).length : 0, 'project-messages': 0 };
  return `<div class="wrap section">
  ${crumbs([[tx('My projects', 'مشاريعي'), 'dashboard'], [L(p.title), 'project-overview'], [title]])}
  <div class="ws-head"><div><p class="eyebrow"><bdi class="mono">${p.code}</bdi> · ${L(cat(p.cat))}</p><div class="row" style="margin-top:4px"><h1 style="font-size:1.6rem">${L(p.title)}</h1>${stagePill(p.stage)}</div></div>
  <div class="row"><button class="btn btn-secondary btn-sm" data-act="viewSpec">${ic('file')} ${tx('Spec sheet', 'ملف المواصفات')}</button><button class="btn btn-ghost btn-sm" data-act="issue">${ic('flag')} ${tx('Report issue', 'بلّغ عن مشكلة')}</button></div></div>
  <nav class="tabs" aria-label="${tx('Project sections', 'أقسام المشروع')}">${tabs.map(t => `<a href="#${t[0]}" ${route === t[0] ? 'aria-current="page"' : ''}>${isAr() ? t[2] : t[1]}${counts[t[0]] ? `<span class="count">${counts[t[0]]}</span>` : ''}</a>`).join('')}</nav>
  ${body}</div>`;
}

/* ---------- overview ---------- */
function checklistItems() {
  const p = proj('p-nuts');
  return [
    [p.stage !== 'draft' || p.step >= 4, tx('Specification completed', 'المواصفات اكتملت'), p.builder],
    [p.stage !== 'draft', tx('RFQ sent to matched suppliers', 'الطلب اتبعت للموردين المرشحين'), p.builder],
    [S.quotesArrived, tx('At least two comparable quotes', 'عرضين قابلين للمقارنة على الأقل'), 'project-quotes'],
    [S.shortlist.length > 0, tx('Suppliers shortlisted', 'تم اختيار قائمة مختصرة'), 'project-compare'],
    [S.sample.status !== 'none', tx('Sample requested', 'تم طلب العينة'), 'project-samples'],
    [S.sample.status === 'approved', tx('Sample approved in writing', 'العينة اتعتمدت كتابيًا'), 'project-samples'],
    [!!S.accepted, tx('Quotation accepted in writing', 'العرض اتقبل كتابيًا'), 'project-order'],
    [S.order.paid[0] || (S.accepted && PAY_SPLIT[S.accepted][0] === 0), tx('Deposit invoice settled (demo)', 'فاتورة المقدم اتسددت (تجريبي)'), 'project-order'],
    [S.order.milestone >= 7, tx('Production completed & dispatched', 'الإنتاج خلص واتشحن'), 'project-order'],
    [p.stage === 'delivered', tx('Delivery received', 'تم الاستلام'), 'project-order']
  ];
}
VIEWS['project-overview'] = r => {
  const p = proj();
  if (p.id !== 'p-nuts') {
    return wsShell(r, tx('Overview', 'نظرة عامة'), `<div class="grid" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr)" id="ov">
      <div class="card"><div class="card-head"><h3>${tx('Specification', 'المواصفات')}</h3>${p.stage === 'draft' ? `<a class="btn btn-secondary btn-sm" href="#${p.builder}">${tx('Edit', 'تعديل')}</a>` : `<span class="pill">${ic('lock')} ${tx('Locked — v1 sent', 'مقفولة — النسخة ١ اتبعتت')}</span>`}</div>${kvList(specRows(p))}</div>
      <div class="stack">${p.stage === 'draft' ? emptyState('file', tx('Not sent yet', 'لسه متبعتش'), tx('Finish the builder to send this RFQ.', 'كمّل النموذج عشان تبعت الطلب.'), `<a class="btn btn-primary" href="#${p.builder}">${tx('Continue builder', 'كمّل النموذج')}</a>`)
        : `<div class="note ok">${ic('check')}<span>${tx(`RFQ sent on ${fdate(p.sentOn)} to ${p.invited.length} supplier(s).`, `الطلب اتبعت يوم ${fdate(p.sentOn)} لـ ${p.invited.length} مورد.`)}</span></div>
        <div class="card"><h3>${tx('Invited suppliers', 'الموردين المدعوين')}</h3>${p.invited.map(id => `<div class="row" style="padding:8px 0">${supLogo(sup(id))}<span class="grow small"><b>${L(sup(id))}</b><br><span class="faint">${tx('Viewed · preparing quote', 'شاف الطلب · بيجهز العرض')}</span></span></div>`).join('')}</div>
        <div class="note">${ic('info')}<span>${tx('In this prototype, the full quote → sample → order flow is simulated on the nuts project. This request shows how other categories capture structured specs.', 'في النموذج ده، مسار العروض والعينة والطلب كامل متمثّل على مشروع المكسرات. الطلب ده بيوضح إزاي الأقسام التانية بتجمع مواصفات منظمة.')}</span></div>
        <button class="btn btn-primary" data-act="openProject" data-id="p-nuts" data-to="project-overview">${tx('Open the nuts project', 'افتح مشروع المكسرات')}</button>`}</div></div>
      <style>@media (max-width:900px){#ov{grid-template-columns:minmax(0,1fr)!important}}</style>`);
  }
  const items = checklistItems(); const nextIdx = items.findIndex(i => !i[0]); const done = items.filter(i => i[0]).length;
  const na = nextAction(p);
  return wsShell(r, tx('Overview', 'نظرة عامة'), `<div class="grid" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)" id="ov">
    <div class="stack">
      <div class="card" style="border-color:var(--brand)"><p class="eyebrow">${tx('Next step', 'الخطوة الجاية')}</p><div class="row-between" style="margin-top:6px"><h2 style="font-size:1.25rem">${nextIdx >= 0 ? items[nextIdx][1] : tx('Project complete', 'المشروع خلص')}</h2>
      <button class="btn btn-primary" data-act="openProject" data-id="p-nuts" data-to="${na[1]}">${na[0]} ${ic('arrow', 'flip')}</button></div></div>
      <div class="card"><div class="card-head"><h3>${tx('Project checklist', 'قائمة المشروع')}</h3><span class="small num">${done}/${items.length}</span></div>
      <div class="progress" style="margin-bottom:10px"><i style="width:${done / items.length * 100}%"></i></div>
      <ul class="checklist">${items.map((it, i) => `<li class="${it[0] ? 'done' : i === nextIdx ? 'next' : ''}"><span class="box">${it[0] ? ic('check') : ''}</span><a href="#${it[2]}" style="color:inherit;text-decoration:none" class="grow">${it[1]}</a></li>`).join('')}</ul></div>
    </div>
    <div class="stack">
      <div class="card"><div class="card-head"><h3>${tx('Specification', 'المواصفات')} <span class="faint">v1</span></h3>${p.stage === 'draft' ? `<a class="btn btn-secondary btn-sm" href="#builder-nuts">${tx('Edit', 'تعديل')}</a>` : `<button class="btn btn-ghost btn-sm" data-act="change">${tx('Request change', 'طلب تعديل')}</button>`}</div>${kvList(specRows(p).slice(0, 6))}</div>
      <div class="card"><h3>${tx('Trust process', 'خطوات الثقة')}</h3><ul class="checklist" style="margin-top:6px">${[
        [tx('Supplier identity documents reviewed', 'مستندات هوية المورد اتراجعت'), true],
        [tx('Specification confirmed by supplier in quote', 'المورد أكد المواصفات في العرض'), S.quotesArrived],
        [tx('Sample approved before production', 'العينة اتعتمدت قبل الإنتاج'), S.sample.status === 'approved'],
        [tx('Written quotation acceptance', 'قبول العرض كتابيًا'), !!S.accepted],
        [tx('Agreed production milestones', 'مراحل إنتاج متفق عليها'), !!S.accepted]].map(x => `<li class="${x[1] ? 'done' : ''}"><span class="box">${x[1] ? ic('check') : ''}</span>${x[0]}</li>`).join('')}</ul></div>
    </div></div><style>@media (max-width:900px){#ov{grid-template-columns:minmax(0,1fr)!important}}</style>`);
};

/* ---------- quotations ---------- */
VIEWS['project-quotes'] = r => {
  S.current = 'p-nuts'; const p = proj();
  let body;
  if (p.stage === 'draft') body = emptyState('file', tx('No quotations yet', 'لسه مفيش عروض'), tx('Complete and submit your specification. Suppliers price exactly what you specify.', 'كمّل المواصفات وابعتها. الموردين بيسعّروا اللي إنت حددته بالظبط.'), `<a class="btn btn-primary" href="#builder-nuts">${tx('Finish specification', 'كمّل المواصفات')}</a>`);
  else if (S.ui.loadingQuotes) body = `<div class="stack" aria-busy="true" aria-label="${tx('Loading quotations', 'جاري تحميل العروض')}">${[1, 2, 3].map(() => `<div class="card"><div class="row"><div class="skel" style="width:44px;height:44px"></div><div class="grow stack" style="gap:8px"><div class="skel" style="height:16px;width:40%"></div><div class="skel" style="height:12px;width:60%"></div></div><div class="skel" style="width:120px;height:28px"></div></div></div>`).join('')}</div>`;
  else if (!S.quotesArrived) body = `<div class="card"><div class="row-between"><div><h3>${tx('Waiting for quotations', 'في انتظار العروض')}</h3><p class="muted small" style="margin-top:4px">${tx('Suppliers typically respond within 2–4 business days (illustrative).', 'الموردين عادة بيردوا خلال ٢–٤ أيام عمل (توضيحي).')}</p></div>
    <button class="btn btn-primary" data-act="simQuotes">${ic('refresh')} ${tx('Simulate supplier responses', 'محاكاة ردود الموردين')} ${demoTag()}</button></div>
    <div class="stack" style="margin-top:16px">${p.invited.map((id, i) => `<div class="row">${supLogo(sup(id))}<span class="grow"><b>${L(sup(id))}</b><br><span class="faint">${[tx('Viewed your RFQ', 'شاف طلبك'), tx('Asked a question', 'سأل سؤال'), tx('Preparing quote', 'بيجهز العرض')][i % 3]}</span></span><span class="pill">${ic('clock')} ${tx('Pending', 'في الانتظار')}</span></div>`).join('')}</div></div>`;
  else { const labels = quoteLabels(); const s = p.spec;
    body = `<div class="note" style="margin-bottom:16px">${ic('scale')}<span>${tx(`Totals are normalised to your ${nf(s.packs * s.packG / 1000)} kg and shown ${S.ui.vatIncl ? 'including' : 'excluding'} 14% VAT. Labels explain their basis on hover; the cheapest offer is not automatically the best supplier.`, `الإجماليات متوحدة على ${nf(s.packs * s.packG / 1000)} كجم و${S.ui.vatIncl ? 'شاملة' : 'من غير'} ضريبة ١٤٪. كل شارة بتوضح أساسها؛ وأرخص عرض مش بالضرورة أفضل مورد.`)}</span></div>
    <div class="stack">${Object.keys(S.quotes).map(id => { const n = normQuote(id); const x = sup(id); const sl = S.shortlist.includes(id);
      return `<article class="card"><div class="quote-card"><div class="stack" style="gap:8px"><div class="row">${supLogo(x)}<div><div class="row"><h3>${L(x)}</h3>${demoTag()}</div><p class="faint"><bdi class="mono">${n.q.ref}</bdi> · v${n.q.ver} · ${tx('valid', 'صالح')} ${n.q.validity} ${tx('days', 'يوم')}</p></div></div>
        <div class="labels">${labelPills(labels[id])}</div>
        ${n.q.deviations.map(d => `<div class="assist-item miss">${ic('alert')}<span>${tx('Different spec', 'مواصفات مختلفة')}: ${L(d)}</span></div>`).join('')}
        ${n.q.missing.map(d => `<div class="assist-item miss">${ic('info')}<span>${L(d)}</span></div>`).join('')}</div>
        <div style="text-align:end" class="stack"><span class="faint">${tx('Comparable total', 'الإجمالي القابل للمقارنة')}</span><span style="font-family:var(--f-display);font-size:1.4rem;font-weight:600">${egp(n.total)}${n.complete ? '' : '<span class="faint" style="font-size:.8rem"> + ' + tx('delivery', 'توصيل') + '</span>'}</span>
        <span class="faint num"><span class="ltr">${egp(n.perReqPack, 2)} / ${s.packG} g</span> · ${n.q.leadDays} ${tx('days', 'يوم')}</span>
        <div class="row" style="justify-content:flex-end"><button class="btn btn-sm ${sl ? 'btn-primary' : 'btn-secondary'}" data-act="shortlist" data-id="${id}" aria-pressed="${sl}">${ic(sl ? 'check' : 'bookmark')} ${sl ? tx('Shortlisted', 'في القائمة المختصرة') : tx('Shortlist', 'أضف للقائمة')}</button><button class="btn btn-ghost btn-sm" data-act="openThread" data-id="${id}">${ic('msg')} ${tx('Message', 'رسالة')}</button></div></div></div></article>`; }).join('')}</div>
    <div class="row" style="margin-top:18px;justify-content:flex-end"><a class="btn btn-primary" href="#project-compare">${ic('compare')} ${tx('Compare side by side', 'قارن جنب بعض')}</a></div>`; }
  return wsShell(r, tx('Quotations', 'العروض'), body);
};

/* ---------- comparison ---------- */
VIEWS['project-compare'] = r => {
  S.current = 'p-nuts'; const p = proj();
  if (!S.quotesArrived) return wsShell(r, tx('Compare', 'المقارنة'), emptyState('compare', tx('Nothing to compare yet', 'لسه مفيش حاجة للمقارنة'), tx('Comparison opens once at least two quotations arrive.', 'المقارنة بتفتح لما يوصل عرضين على الأقل.'), `<a class="btn btn-primary" href="#project-quotes">${tx('Go to quotations', 'روح للعروض')}</a>`));
  const ids = Object.keys(S.quotes); const N = ids.map(normQuote); const labels = quoteLabels(); const s = p.spec; const budget = Number(s.budget) || 0;
  const minBy = f => { const c = N.filter(n => n.complete); return c.length ? c.reduce((a, b) => (f(b) < f(a) ? b : a)).id : null; };
  const bestTotal = minBy(n => n.total);
  const row = (label, cells, opt = {}) => { const vals = N.map((n, i) => cells(n, i)); if (S.ui.onlyDiff && opt.diff !== false && vals.every(v => v.replace(/<[^>]+>/g, '') === vals[0].replace(/<[^>]+>/g, ''))) return '';
    return `<tr class="${opt.cls || ''}"><th scope="row">${label}${opt.sub ? `<span class="sub">${opt.sub}</span>` : ''}</th>${vals.map((v, i) => `<td class="${opt.tdc ? opt.tdc(N[i]) : ''}">${v}</td>`).join('')}</tr>`; };
  const group = t => `<tr class="group"><th colspan="${N.length + 1}">${t}</th></tr>`;
  const yes = tx('Yes', 'أيوه'), no = tx('No', 'لأ');
  const table = `<div class="table-wrap"><table class="cmp"><caption class="sr-only">${tx('Quotation comparison', 'مقارنة العروض')}</caption>
  <thead><tr><th>${tx('Normalised to', 'متوحد على')} <span class="sub num ltr">${nf(s.packs)} × ${s.packG} g = ${nf(s.packs * s.packG / 1000)} kg</span></th>${N.map(n => `<th scope="col"><div class="row">${supLogo(sup(n.id))}<div><b>${L(sup(n.id))}</b><span class="sub"><bdi class="mono">${n.q.ref}</bdi> · v${n.q.ver}</span></div></div><div class="labels" style="margin-top:8px">${labelPills(labels[n.id])}</div></th>`).join('')}</tr></thead><tbody>
  ${group(tx('Specification', 'المواصفات'))}
  ${row(tx('Specification match', 'مطابقة المواصفات'), n => `<b class="num">${n.match}%</b>${n.q.deviations.map(d => `<span class="sub">${L(d)}</span>`).join('')}`, { tdc: n => (n.q.deviations.length ? 'dev' : 'best') })}
  ${row(tx('Quoted quantity', 'الكمية في العرض'), n => `<span class="num ltr">${nf(n.q.packs)} × ${n.q.packG} g = ${nf(n.kg)} kg</span>${n.samePack ? '' : `<span class="sub">${tx('Different pack size — flagged', 'حجم عبوة مختلف — متعلّم')}</span>`}`, { tdc: n => (n.samePack ? '' : 'dev') })}
  ${row(tx('MOQ', 'الحد الأدنى'), n => `<span class="num ltr">${n.q.moqKg} kg</span>`, { tdc: n => (labels[n.id].some(l => l[1] === tx('Lowest MOQ', 'أقل حد أدنى')) ? 'best' : '') })}
  ${row(tx('Shelf life (supplier-stated)', 'الصلاحية (حسب المورد)'), n => (n.q.shelfLife ? L(n.q.shelfLife) : tx('Not provided', 'غير محدد')), { tdc: n => (n.q.shelfLife ? '' : 'miss') })}
  ${group(tx('Cost breakdown (as quoted, converted to your quantity)', 'تفاصيل التكلفة (زي العرض، محوّلة لكميتك)'))}
  ${row(tx('Unit price as quoted', 'سعر الوحدة في العرض'), n => `<span class="ltr">${egp(n.q.product, 2)} / ${n.q.basis === 'kg' ? 'kg' : `${n.q.packG} g`}</span><span class="sub">${L(n.q.productNote)}</span>`)}
  ${row(tx('Product & processing', 'المنتج والتصنيع'), n => egp(n.product))}
  ${row(tx('Packaging & printing', 'العبوة والطباعة'), n => (n.packaging ? egp(n.packaging) : tx('Included above', 'مشمول فوق')) + `<span class="sub">${L(n.q.packagingNote)}</span>`)}
  ${row(tx('Setup / tooling', 'تكاليف التجهيز'), n => egp(n.q.setup) + `<span class="sub">${L(n.q.setupNote)}</span>`)}
  ${row(tx('Sample charge', 'تكلفة العينة'), n => `${n.q.sample ? egp(n.q.sample) : tx('Free', 'مجانية')}<span class="sub">${n.q.sample ? (n.q.sampleDeductible ? tx('Deductible from order — counted as 0', 'بتتخصم من الطلب — محسوبة صفر') : tx('Not deductible — added to total', 'مش بتتخصم — مضافة للإجمالي')) : ''}</span>`)}
  ${row(tx('Delivery', 'التوصيل'), n => (n.q.delivery == null ? tx('Not quoted', 'غير مسعّر') : n.q.delivery === 0 ? tx('Included', 'مشمول') : egp(n.q.delivery)), { tdc: n => (n.complete ? '' : 'miss') })}
  ${row(tx('Tax treatment', 'المعاملة الضريبية'), n => (n.q.vatIncluded ? tx('Prices include 14% VAT', 'الأسعار شاملة ضريبة ١٤٪') : tx('Prices exclude VAT', 'الأسعار من غير ضريبة')))}
  ${row(`${tx('Total comparable cost', 'إجمالي التكلفة القابل للمقارنة')}`, n => `${egp(n.total)}${n.complete ? '' : `<span class="sub">${tx('+ delivery (not quoted)', '+ توصيل (غير مسعّر)')}</span>`}<span class="sub num ltr">${egp(n.perKg, 2)} / kg · ${egp(n.perReqPack, 2)} / ${s.packG} g</span>`, { cls: 'total', sub: S.ui.vatIncl ? tx('incl. 14% VAT', 'شامل ضريبة ١٤٪') : tx('excl. VAT', 'من غير ضريبة'), diff: false, tdc: n => (n.id === bestTotal ? 'best' : '') })}
  ${budget ? row(tx('Budget fit', 'مناسبة الميزانية'), n => { const d = budget - n.total; return n.complete ? (d >= 0 ? `<span class="pill ok">${tx('Within budget', 'داخل الميزانية')}</span><span class="sub">${egp(d)} ${tx('under', 'أقل')}</span>` : `<span class="pill warn">${tx('Over budget', 'فوق الميزانية')}</span><span class="sub">${egp(-d)} ${tx('over', 'زيادة')}</span>`) : `<span class="pill">${tx('Cannot tell — incomplete', 'مش واضح — العرض ناقص')}</span>`; }, { sub: `${tx('Your target', 'هدفك')}: ${egpT(budget)}`, diff: false }) : ''}
  ${group(tx('Terms', 'الشروط'))}
  ${row(tx('Production lead time', 'مدة الإنتاج'), n => `<span class="num">${n.q.leadDays} ${tx('days', 'يوم')}</span><span class="sub">${tx('supplier-stated', 'حسب المورد')}</span>`, { tdc: n => (labels[n.id].some(l => l[1] === tx('Fastest delivery', 'أسرع تسليم')) ? 'best' : '') })}
  ${row(tx('Payment terms', 'شروط الدفع'), n => L(n.q.payment))}
  ${row(tx('Quote validity', 'صلاحية العرض'), n => `<span class="num">${n.q.validity} ${tx('days', 'يوم')}</span><span class="sub">${tx('until', 'لحد')} ${fdate(addDays(TODAY, n.q.validity))}</span>`, { tdc: n => (n.q.validity <= 7 ? 'miss' : '') })}
  ${row(tx('Included documents', 'المستندات المرفقة'), n => n.q.docs.map(d => L(DOC_LABELS[d])).join('<br>'))}
  ${row(tx('Exclusions', 'الاستثناءات'), n => L(n.q.exclusions))}
  ${row(tx('Missing information', 'معلومات ناقصة'), n => (n.q.missing.length ? n.q.missing.map(L).join('<br>') : `<span style="color:var(--ok)">${tx('None', 'لا يوجد')}</span>`), { tdc: n => (n.q.missing.length ? 'miss' : ''), diff: false })}
  ${group(tx('Actions', 'إجراءات'))}
  <tr><th scope="row">${tx('Decide', 'القرار')}</th>${N.map(n => { const sl = S.shortlist.includes(n.id); return `<td><div class="stack" style="gap:6px"><button class="btn btn-sm ${sl ? 'btn-primary' : 'btn-secondary'}" data-act="shortlist" data-id="${n.id}" aria-pressed="${sl}">${ic(sl ? 'check' : 'bookmark')} ${sl ? tx('Shortlisted', 'في القائمة') : tx('Shortlist', 'أضف للقائمة')}</button>
    <button class="btn btn-sm btn-secondary" data-act="reqSample" data-id="${n.id}">${ic('box')} ${tx('Request sample', 'اطلب عينة')}</button>${n.q.missing.length ? `<button class="btn btn-sm btn-ghost" data-act="askComplete" data-id="${n.id}">${ic('msg')} ${tx('Ask to complete', 'اطلب استكمال')}</button>` : ''}</div></td>`; }).join('')}</tr>
  </tbody></table></div>`;
  return wsShell(r, tx('Compare', 'المقارنة'), `<div class="row-between" style="margin-bottom:14px"><div><h2>${tx('Side-by-side comparison', 'مقارنة جنب بعض')}</h2><p class="faint">${tx('Units, quantities and VAT are normalised before comparing. Red cells differ from your spec; amber cells are missing or short-dated.', 'الوحدات والكميات والضريبة متوحدة قبل المقارنة. الخانات الحمرا مختلفة عن مواصفاتك؛ والصفرا ناقصة أو قريبة الانتهاء.')}</p></div>
    <div class="row"><label class="switch small"><input type="checkbox" data-bind-bool="ui.vatIncl" ${S.ui.vatIncl ? 'checked' : ''}><span>${tx('Include VAT', 'شامل الضريبة')}</span></label><label class="switch small"><input type="checkbox" data-bind-bool="ui.onlyDiff" ${S.ui.onlyDiff ? 'checked' : ''}><span>${tx('Only differences', 'الاختلافات بس')}</span></label></div></div>
  ${table}
  <div class="grid g2" style="margin-top:18px"><div class="card"><h3>${tx('How labels are decided', 'الشارات بتتحدد إزاي')}</h3>${Object.values(labels).flat().filter((l, i, a) => a.findIndex(z => z[1] === l[1]) === i).map(l => `<div class="assist-item"><span class="pill ${l[0]}">${l[1]}</span><span class="small muted">${l[2]}</span></div>`).join('')}</div>
  <div class="card"><h3>${tx('Before you decide', 'قبل ما تقرر')}</h3><div class="assist-item">${ic('info')}<span class="small">${tx('The lowest total uses a flat pouch without zipper; ask for the zipper price before comparing again.', 'أقل إجمالي بكيس مسطح من غير سوستة؛ اسأل عن سعر السوستة قبل ما تقارن تاني.')}</span></div><div class="assist-item">${ic('info')}<span class="small">${tx('A short validity (7 days) can expire while you wait for a sample.', 'صلاحية قصيرة (٧ أيام) ممكن تخلص وإنت مستني العينة.')}</span></div><div class="assist-item">${ic('info')}<span class="small">${tx('Request samples from your top two to compare taste and pack quality.', 'اطلب عينات من أفضل اتنين عشان تقارن الطعم وجودة العبوة.')}</span></div></div></div>`);
};

/* ---------- messages ---------- */
const SUP_MSGS = {
  sw1: [{ from: 'sup', orig: 'ar', ar: 'أهلًا، الأكلاشيهات بتفضل عندنا ونستخدمها في إعادة الطلب من غير تكلفة إضافية.', en: 'Hello, the printing plates stay with us and are reused on reorders at no extra cost.' }],
  sw2: [{ from: 'sup', orig: 'ar', ar: 'نقدر نغيّر لكيس واقف بسوستة بزيادة ٢ جنيه للكيس. الطباعة ديجيتال فمفيش أكلاشيهات.', en: 'We can switch to a stand-up zipper pouch for +2 EGP per pack. Printing is digital, so no plates.' }],
  sw3: [{ from: 'sup', orig: 'en', en: 'Hello, we can also do 200 g packs if you accept 15 days instead of 10. Delivery quote to follow.', ar: 'أهلًا، نقدر كمان نعمل عبوات ٢٠٠ جم لو قبلت ١٥ يوم بدل ١٠. سعر التوصيل هيوصلك.' }]
};
VIEWS['project-messages'] = r => {
  S.current = 'p-nuts'; const p = proj();
  if (p.stage === 'draft') return wsShell(r, tx('Messages', 'الرسائل'), emptyState('msg', tx('No conversations yet', 'لسه مفيش محادثات'), tx('Each invited supplier gets a thread linked to this project after you send the RFQ.', 'كل مورد مدعو هيبقى له محادثة مربوطة بالمشروع بعد إرسال الطلب.')));
  const th = S.thread; const msgs = [...(S.threads[th] || []), ...(S.quotesArrived ? SUP_MSGS[th] || [] : [])].concat(S.threads[th + '-x'] || []);
  return wsShell(r, tx('Messages', 'الرسائل'), `<div class="chat"><div class="threads" role="tablist">${p.invited.map(id => `<button role="tab" aria-pressed="${th === id}" data-act="openThread" data-id="${id}">${supLogo(sup(id))}<span class="grow small" style="min-width:0"><b>${L(sup(id))}</b><span class="faint" style="display:block">${S.quotesArrived ? tx('Quote received', 'وصل العرض') : tx('RFQ sent', 'الطلب اتبعت')}</span></span></button>`).join('')}</div>
  <div class="conv"><div class="msgs" id="msgs" aria-live="polite">${msgs.map(m => {
    if (m.from === 'sys') return `<div class="msg sys">${ic('lock')} ${L(m)}</div>`;
    if (m.from === 'me') return `<div class="msg me" dir="auto">${esc(m.text)}${m.file ? `<br><span class="pill">${ic('file')} ${esc(m.file)}</span>` : ''}<span class="meta">${tx('You', 'إنت')} · ${fdate(TODAY)}</span></div>`;
    const translated = m.orig && m.orig !== S.lang; const showOrig = S.ui['orig-' + th + m.en.slice(0, 8)];
    return `<div class="msg">${translated ? `<span class="mt">${ic('globe')} ${tx(`Machine-translated from ${m.orig === 'ar' ? 'Arabic' : 'English'} (demo)`, `ترجمة آلية من ${m.orig === 'ar' ? 'العربي' : 'الإنجليزي'} (تجريبي)`)}</span><br>` : ''}
      <span dir="auto">${esc(translated && showOrig ? m[m.orig] : m[S.lang] || m.text)}</span>${m.auto ? `<span class="meta">${tx('Auto-reply (demo)', 'رد آلي (تجريبي)')}</span>` : ''}
      <span class="meta">${L(sup(th))} · ${fdate(TODAY)}${translated ? ` · <button class="btn btn-ghost btn-sm" style="padding:0 4px" data-act="toggleOrig" data-k="${'orig-' + th + m.en.slice(0, 8)}">${showOrig ? tx('Show translation', 'اعرض الترجمة') : tx('Show original', 'اعرض الأصل')}</button>` : ''}</span></div>`; }).join('')}</div>
  <form class="composer" data-form="msg"><label class="sr-only" for="msg-in">${tx('Message', 'رسالة')}</label><input id="msg-in" class="input" dir="auto" placeholder="${tx('Write a message…', 'اكتب رسالة…')}" autocomplete="off">
  <label class="icon-btn" title="${tx('Attach file', 'إرفاق ملف')}">${ic('upload')}<input type="file" data-upload="msg" class="sr-only"></label><button class="btn btn-primary" type="submit">${ic('send', 'flip')}<span class="sr-only">${tx('Send', 'إرسال')}</span></button></form></div></div>
  <p class="faint" style="margin-top:10px">${tx('Your own messages are shown exactly as typed. Supplier messages in another language are machine-translated and labelled; the original is one click away.', 'رسايلك بتظهر زي ما كتبتها بالظبط. رسايل الموردين بلغة تانية بتتترجم آليًا وعليها علامة، والأصل متاح بضغطة.')}</p>`);
};

/* ---------- samples ---------- */
const EVAL = [['taste', 'Taste & freshness', 'الطعم والطزاجة'], ['roast', 'Roast level', 'درجة التحميص'], ['salt', 'Salt / seasoning level', 'نسبة الملح / التتبيل'], ['seal', 'Pouch seal & zipper', 'لحام الكيس والسوستة'], ['print', 'Print quality & colours', 'جودة الطباعة والألوان'], ['weight', 'Net weight check', 'مراجعة الوزن الصافي']];
VIEWS['project-samples'] = r => {
  S.current = 'p-nuts'; const sm = S.sample;
  if (!S.quotesArrived) return wsShell(r, tx('Samples', 'العينات'), emptyState('box', tx('No samples yet', 'لسه مفيش عينات'), tx('Request samples after comparing quotations.', 'اطلب عينات بعد مقارنة العروض.'), `<a class="btn btn-primary" href="#project-quotes">${tx('Go to quotations', 'روح للعروض')}</a>`));
  const track = [['requested', tx('Requested', 'اتطلبت')], ['preparing', tx('Preparing', 'بتتجهز')], ['shipped', tx('Shipped', 'اتشحنت')], ['received', tx('Received', 'اتسلمت')], ['approved', tx('Approved', 'اتعتمدت')]];
  const order = ['none', 'requested', 'preparing', 'shipped', 'received', 'approved'];
  let body;
  if (sm.status === 'none') {
    const cand = S.shortlist.length ? S.shortlist : Object.keys(S.quotes); if (!sm.supplier || !cand.includes(sm.supplier)) sm.supplier = cand[0];
    const q = S.quotes[sm.supplier];
    body = `<div class="grid" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)" id="smg"><div class="card"><h2 style="font-size:1.2rem;margin-bottom:14px">${tx('Request a sample', 'اطلب عينة')}</h2>
      ${!S.shortlist.length ? `<div class="note warn" style="margin-bottom:14px">${ic('info')}<span>${tx('Tip: shortlist suppliers first. Showing all quotes for now.', 'نصيحة: اختار قائمة مختصرة الأول. معروض كل العروض دلوقتي.')}</span></div>` : ''}
      <div class="fieldset">${fRadio('sample.supplier', tx('Supplier', 'المورد'), cand.map(id => [id, sup(id).en, sup(id).ar]), { wide: 1 })}
      ${fNum('sample.packs', tx('Sample packs', 'عدد عبوات العينة'), tx('packs', 'عبوة'), { min: 1 })}
      <div class="kv small"><dt>${tx('Ship to', 'الشحن لـ')}</dt><dd>${esc(proj('p-nuts').spec.city) || '—'}</dd><dt>${tx('Sample charge', 'تكلفة العينة')}</dt><dd>${q.sample ? egp(q.sample) + ' · ' + (q.sampleDeductible ? tx('deductible from order', 'بتتخصم من الطلب') : tx('not deductible', 'مش بتتخصم')) : tx('Free', 'مجانية')}</dd><dt>${tx('Must match', 'لازم تطابق')}</dt><dd>${tx('Spec sheet v1', 'ملف المواصفات نسخة ١')}</dd></div>
      <button class="btn btn-primary" data-act="sendSample">${ic('send', 'flip')} ${tx('Send sample request', 'ابعت طلب العينة')} ${demoTag()}</button></div></div>
      <div class="card"><h3>${tx('Why samples matter', 'ليه العينة مهمة')}</h3><p class="small muted" style="margin-top:6px">${tx('The approved sample becomes the reference production must match. It is recorded with date, version and your notes, and is the basis for any quality claim later.', 'العينة المعتمدة بتبقى المرجع اللي الإنتاج لازم يطابقه. بتتسجل بالتاريخ والنسخة وملاحظاتك، وهي الأساس لأي شكوى جودة بعد كده.')}</p></div></div>`;
  } else if (sm.status === 'approved') body = sampleRecord();
  else {
    const idx = order.indexOf(sm.status);
    body = `<div class="card"><div class="row-between"><div><h2 style="font-size:1.2rem">${tx('Sample from', 'عينة من')} ${L(sup(sm.supplier))}</h2><p class="faint">${tx('Version', 'نسخة')} ${sm.ver || 1} · ${nf(sm.packs)} ${tx('packs', 'عبوة')}</p></div>
      ${sm.status === 'requested' || sm.status === 'preparing' ? `<button class="btn btn-secondary" data-act="simShip">${ic('truck')} ${tx('Simulate: supplier ships sample', 'محاكاة: المورد شحن العينة')} ${demoTag()}</button>` : sm.status === 'shipped' ? `<button class="btn btn-primary" data-act="sampleReceived">${ic('check')} ${tx('Mark as received', 'تم الاستلام')}</button>` : ''}</div>
      <ol class="timeline" style="margin-top:18px">${track.map((t, i) => `<li class="${order.indexOf(t[0]) <= idx ? 'done' : order.indexOf(t[0]) === idx + 1 ? 'current' : ''}"><span class="tdot">${order.indexOf(t[0]) <= idx ? ic('check') : ''}</span><span class="t">${t[1]}</span></li>`).join('')}</ol></div>
      ${sm.status === 'received' ? `<div class="card" style="margin-top:16px"><h2 style="font-size:1.2rem">${tx('Evaluate the sample', 'قيّم العينة')}</h2><p class="faint" style="margin:4px 0 14px">${tx('Your evaluation becomes part of the approval record.', 'تقييمك بيبقى جزء من سجل الاعتماد.')}</p>
      <div class="stack">${EVAL.map(e => `<div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:10px"><span class="grow"><b>${isAr() ? e[2] : e[1]}</b></span>
        <div class="row" role="radiogroup" aria-label="${isAr() ? e[2] : e[1]}">${[['pass', tx('Pass', 'مقبول')], ['change', tx('Needs change', 'محتاج تعديل')]].map(o => `<label class="opt" style="padding:6px 10px"><input type="radio" name="ev-${e[0]}" value="${o[0]}" data-bind="sample.eval.${e[0]}" ${sm.eval[e[0]] === o[0] ? 'checked' : ''}><span class="mark"></span><span class="t">${o[1]}</span></label>`).join('')}</div></div>`).join('')}
      ${fNum('sample.weight', tx('Measured net weight (one pack)', 'الوزن الصافي المقاس (عبوة واحدة)'), 'g', { hint: tx('Target 200 g', 'المستهدف ٢٠٠ جم') })}
      ${fArea('sample.notes', tx('Notes for the supplier', 'ملاحظات للمورد'), { ph: tx('e.g. slightly less salt, darker roast on almonds', 'مثال: ملح أقل شوية، تحميص أغمق للوز') })}
      ${ERRORS.eval ? `<div class="note bad">${ic('alert')}<span>${ERRORS.eval}</span></div>` : ''}
      <div class="row" style="justify-content:flex-end"><button class="btn btn-secondary" data-act="sampleChanges">${ic('refresh')} ${tx('Request changes', 'اطلب تعديل')}</button><button class="btn btn-primary" data-act="approveSample">${ic('check')} ${tx('Approve sample', 'اعتمد العينة')}</button></div></div></div>` : ''}`;
  }
  return wsShell(r, tx('Samples', 'العينات'), body + '<style>@media (max-width:900px){#smg{grid-template-columns:minmax(0,1fr)!important}}</style>');
};
function sampleRecord() {
  const sm = S.sample;
  return `<div class="card" style="border-color:var(--ok)"><div class="row-between"><div class="row">${ic('shield')}<h2 style="font-size:1.2rem">${tx('Sample approval record', 'سجل اعتماد العينة')}</h2></div><span class="pill ok">${tx('Approved', 'معتمدة')}</span></div>
    <dl class="kv" style="margin-top:14px"><dt>${tx('Record', 'السجل')}</dt><dd><bdi class="mono">SAR-2611-014-${sm.ver || 1}</bdi></dd><dt>${tx('Supplier', 'المورد')}</dt><dd>${L(sup(sm.supplier))}</dd><dt>${tx('Approved on', 'تاريخ الاعتماد')}</dt><dd>${fdate(sm.decidedOn)}</dd><dt>${tx('Against', 'مقابل')}</dt><dd>${tx('Spec sheet v1', 'ملف المواصفات نسخة ١')} · <bdi class="mono">${S.quotes[sm.supplier].ref}</bdi></dd>
    ${EVAL.map(e => `<dt>${isAr() ? e[2] : e[1]}</dt><dd>${sm.eval[e[0]] === 'pass' ? `<span class="pill ok">${tx('Pass', 'مقبول')}</span>` : sm.eval[e[0]] === 'change' ? `<span class="pill warn">${tx('Accepted with note', 'مقبول بملاحظة')}</span>` : '—'}</dd>`).join('')}
    <dt>${tx('Net weight measured', 'الوزن المقاس')}</dt><dd class="num">${sm.weight ? sm.weight + ' g' : '—'}</dd><dt>${tx('Notes', 'ملاحظات')}</dt><dd>${esc(sm.notes) || '—'}</dd></dl>
    <div class="note ok" style="margin-top:14px">${ic('info')}<span>${tx('This sample is the reference production must match. Keep the physical sample sealed and labelled with this record number.', 'العينة دي المرجع اللي الإنتاج لازم يطابقه. احتفظ بالعينة الفعلية مقفولة ومكتوب عليها رقم السجل ده.')}</span></div>
    <div class="row" style="justify-content:flex-end;margin-top:14px"><a class="btn btn-primary" href="#project-order">${tx('Accept quotation & create order', 'اقبل العرض واعمل الطلب')} ${ic('arrow', 'flip')}</a></div></div>`;
}

/* ---------- order & payments ---------- */
const MILESTONES = [
  ['Order confirmed & PO issued', 'تأكيد الطلب وإصدار أمر الشراء', 0], ['Deposit invoice settled (demo)', 'سداد فاتورة المقدم (تجريبي)', 1], ['Raw materials secured', 'تجهيز الخامات', 3], ['Roasting & seasoning', 'التحميص والتتبيل', 8],
  ['Packing & labelling', 'التعبئة والليبل', 12], ['Pre-dispatch check: photos/video (optional inspection)', 'فحص قبل الشحن: صور/فيديو (فحص اختياري)', 15], ['Balance invoice settled (demo)', 'سداد باقي الفاتورة (تجريبي)', 16], ['Dispatched', 'تم الشحن', 17], ['Delivered & received', 'تم التسليم والاستلام', 18]
];
VIEWS['project-order'] = r => {
  S.current = 'p-nuts'; const p = proj();
  if (!S.quotesArrived) return wsShell(r, tx('Order & payments', 'الطلب والمدفوعات'), emptyState('wallet', tx('No order yet', 'لسه مفيش طلب'), tx('Orders are created when you accept a quotation in writing.', 'الطلب بيتعمل لما تقبل عرض كتابيًا.'), `<a class="btn btn-primary" href="#project-quotes">${tx('Go to quotations', 'روح للعروض')}</a>`));
  if (!S.accepted) {
    const cand = S.sample.status === 'approved' ? [S.sample.supplier] : (S.shortlist.length ? S.shortlist : Object.keys(S.quotes));
    if (!S.ui.acceptSup || !cand.includes(S.ui.acceptSup)) S.ui.acceptSup = cand[0];
    const n = normQuote(S.ui.acceptSup); const q = n.q;
    return wsShell(r, tx('Order & payments', 'الطلب والمدفوعات'), `<div class="card" style="max-width:760px"><h2 style="font-size:1.25rem">${tx('Accept a quotation in writing', 'اقبل العرض كتابيًا')}</h2>
      ${S.sample.status !== 'approved' ? `<div class="note warn" style="margin-top:12px">${ic('alert')}<span>${tx('No sample has been approved. We strongly recommend approving a sample before production; without it, quality disputes are hard to resolve.', 'مفيش عينة معتمدة. ننصحك جدًا تعتمد عينة قبل الإنتاج؛ من غيرها أي خلاف على الجودة صعب يتحل.')}</span></div>` : `<div class="note ok" style="margin-top:12px">${ic('check')}<span>${tx('Sample approved — production must match record', 'العينة معتمدة — الإنتاج لازم يطابق السجل')} <bdi class="mono">SAR-2611-014-${S.sample.ver || 1}</bdi></span></div>`}
      <div class="fieldset" style="margin-top:16px">${cand.length > 1 ? fRadio('ui.acceptSup', tx('Supplier', 'المورد'), cand.map(id => [id, sup(id).en, sup(id).ar]), { wide: 1 }) : ''}
      <div class="card-flat"><dl class="kv"><dt>${tx('Supplier', 'المورد')}</dt><dd>${L(sup(n.id))}</dd><dt>${tx('Quotation', 'العرض')}</dt><dd><bdi class="mono">${q.ref}</bdi> · v${q.ver}</dd><dt>${tx('Comparable total', 'الإجمالي')}</dt><dd>${egp(n.incVat)} <span class="faint">${tx('incl. VAT', 'شامل الضريبة')}${n.complete ? '' : ' + ' + tx('delivery TBD', 'التوصيل لاحقًا')}</span></dd>
        <dt>${tx('Payment terms', 'شروط الدفع')}</dt><dd>${L(q.payment)}</dd><dt>${tx('Lead time', 'مدة التنفيذ')}</dt><dd>${q.leadDays} ${tx('days from deposit', 'يوم من المقدم')}</dd><dt>${tx('Valid until', 'صالح لحد')}</dt><dd>${fdate(addDays(TODAY, q.validity))}</dd><dt>${tx('Exclusions', 'الاستثناءات')}</dt><dd>${L(q.exclusions)}</dd>
        <dt>${tx('Nawah fee (illustrative)', 'رسوم نواة (توضيحي)')}</dt><dd>${tx('5% commission shown separately on your invoice', 'عمولة ٥٪ ظاهرة لوحدها في الفاتورة')} — ${egp(n.exVat * 0.05)}</dd></dl></div>
      <label class="switch"><input type="checkbox" data-bind-bool="ui.acceptOk" ${S.ui.acceptOk ? 'checked' : ''}><span>${tx(`I accept quotation ${q.ref} v${q.ver} in writing, including its exclusions and payment terms.`, `أنا موافق كتابيًا على العرض ${q.ref} نسخة ${q.ver}، شامل الاستثناءات وشروط الدفع.`)}</span></label>
      ${S.sample.status !== 'approved' ? `<label class="switch"><input type="checkbox" data-bind-bool="ui.noSampleOk" ${S.ui.noSampleOk ? 'checked' : ''}><span>${tx('I understand production will proceed without an approved sample.', 'أنا فاهم إن الإنتاج هيبدأ من غير عينة معتمدة.')}</span></label>` : ''}
      ${ERRORS.accept ? `<div class="note bad" role="alert">${ic('alert')}<span>${ERRORS.accept}</span></div>` : ''}
      <button class="btn btn-primary btn-lg" data-act="acceptQuote">${ic('check')} ${tx('Accept & create order', 'اقبل واعمل الطلب')} ${demoTag()}</button></div></div>`);
  }
  const n = normQuote(S.accepted); const ms = S.order.milestone; const split = PAY_SPLIT[S.accepted]; const o = S.order;
  const total = n.incVat; const inv = [split[0] ? { k: 0, en: `Deposit ${split[0]}%`, ar: `مقدم ${split[0]}٪`, amt: total * split[0] / 100, due: TODAY } : null, { k: 1, en: `Balance ${split[1]}%`, ar: `باقي ${split[1]}٪`, amt: total * split[1] / 100, due: addDays(TODAY, 16) }].filter(Boolean);
  const canPay = k => (k === 0 && ms === 1) || (k === 1 && ms === 6);
  const canSim = [2, 3, 4, 5, 7].includes(ms) || (ms === 1 && !split[0]) || (ms === 6 && false);
  return wsShell(r, tx('Order & payments', 'الطلب والمدفوعات'), `<div class="grid" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)" id="org">
    <div class="stack"><div class="card"><div class="row-between"><div><p class="eyebrow">${tx('Purchase order', 'أمر الشراء')}</p><h2 style="font-size:1.2rem;margin-top:4px"><bdi class="mono">PO-2611-014</bdi> · ${L(sup(S.accepted))}</h2></div>
      ${ms < 8 ? `<button class="btn btn-secondary btn-sm" data-act="simMilestone" ${canSim ? '' : 'disabled'}>${ic('refresh')} ${tx('Simulate supplier update', 'محاكاة تحديث المورد')} ${demoTag()}</button>` : ''}</div>
      <div class="progress" style="margin:14px 0 18px"><i style="width:${ms / 8 * 100}%"></i></div>
      <ol class="timeline">${MILESTONES.map((m, i) => `<li class="${i < ms || (i === 8 && ms === 8 && o.received) ? 'done' : i === ms ? 'current' : ''}"><span class="tdot">${i < ms ? ic('check') : ''}</span><div class="row-between"><span class="t">${isAr() ? m[1] : m[0]}</span><span class="faint num">${i < ms ? tx('Done', 'تم') : tx('Planned', 'متوقع')} · ${fdate(addDays(TODAY, m[2]))}</span></div>
        ${i === ms && (i === 1 || i === 6) ? `<p class="faint">${tx('Waiting for invoice payment below.', 'في انتظار سداد الفاتورة تحت.')}</p>` : ''}
        ${i === 5 && ms >= 5 ? `<p class="small muted">${tx('Supplier shared 6 photos and a 40-second video of packed cartons (demo). Optional third-party inspection is a planned paid service.', 'المورد بعت ٦ صور وفيديو ٤٠ ثانية للكراتين (تجريبي). الفحص بطرف ثالث خدمة مدفوعة مخططة.')}</p>` : ''}</li>`).join('')}</ol>
      ${ms === 8 && !o.received ? `<div class="row" style="justify-content:flex-end"><button class="btn btn-secondary" data-act="issue">${ic('flag')} ${tx('Report a problem', 'بلّغ عن مشكلة')}</button><button class="btn btn-primary" data-act="confirmReceipt">${ic('check')} ${tx('Confirm receipt', 'أكد الاستلام')}</button></div>` : ''}
      ${o.received ? `<div class="note ok">${ic('check')}<span>${tx('Delivery confirmed. Plates and approved sample are on record for a faster reorder.', 'الاستلام اتأكد. الأكلاشيهات والعينة المعتمدة متسجلين لإعادة طلب أسرع.')}</span></div><div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn btn-primary" data-act="reorder" data-id="p-nuts">${ic('repeat')} ${tx('Reorder this product', 'أعد طلب المنتج ده')}</button></div>` : ''}</div>
      <div class="card"><div class="card-head"><h3>${tx('Changes & issues', 'التعديلات والمشاكل')}</h3><div class="row"><button class="btn btn-secondary btn-sm" data-act="change">${ic('wrench')} ${tx('Change request', 'طلب تعديل')}</button><button class="btn btn-secondary btn-sm" data-act="issue">${ic('flag')} ${tx('Report issue', 'بلّغ عن مشكلة')}</button></div></div>
      ${[...o.changes.map(c => ({ ...c, k: 'c' })), ...o.issues.map(c => ({ ...c, k: 'i' }))].map(c => `<div class="assist-item">${ic(c.k === 'c' ? 'wrench' : 'flag')}<span class="grow"><b>${c.k === 'c' ? tx('Change request', 'طلب تعديل') : tx('Issue', 'مشكلة')}:</b> <span dir="auto">${esc(c.text)}</span><br><span class="faint">${fdate(c.at)} · ${c.k === 'c' ? tx('Awaiting supplier confirmation of cost and time impact', 'في انتظار رد المورد على التكلفة والوقت') : tx('Opened — Nawah ops reviews within 1 business day (demo)', 'مفتوحة — فريق نواة بيراجع خلال يوم عمل (تجريبي)')}</span></span></div>`).join('') || `<p class="faint">${tx('No change requests or issues. Changes after acceptance need supplier confirmation and may affect price and time.', 'مفيش طلبات تعديل أو مشاكل. أي تعديل بعد القبول محتاج موافقة المورد وممكن يأثر على السعر والوقت.')}</p>`}</div></div>
    <div class="stack"><div class="card"><h3>${tx('Invoices', 'الفواتير')} ${demoTag()}</h3>
      ${inv.map(v => `<div class="row-between" style="padding:12px 0;border-bottom:1px solid var(--line)"><div><b>${L(v)}</b><br><span class="faint">${tx('Due', 'مستحقة')} ${fdate(v.due)}</span></div><div style="text-align:end">${egp(v.amt)}<br>${o.paid[v.k] ? `<span class="pill ok">${tx('Marked paid', 'متعلّمة مدفوعة')}</span>` : `<button class="btn btn-sm btn-secondary" data-act="payInv" data-k="${v.k}" ${canPay(v.k) ? '' : 'disabled'}>${tx('Mark paid (demo)', 'علّمها مدفوعة (تجريبي)')}</button>`}</div></div>`).join('')}
      <p class="faint" style="margin-top:10px">${tx('Demo only — no money moves and Nawah holds no funds. Planned: payment through a licensed Egyptian payment provider and e-invoice integration. No escrow, refunds or insurance are offered in this prototype.', 'تجريبي — مفيش فلوس بتتحرك ونواة مش ماسكة أي أموال. المخطط: الدفع عن طريق مزود دفع مصري مرخص وربط بالفاتورة الإلكترونية. مفيش ضمان أو استرداد أو تأمين في النموذج ده.')}</p></div>
      <div class="card"><h3>${tx('Delivery coordination', 'تنسيق التسليم')}</h3>${o.delivery ? `<dl class="kv small" style="margin-top:8px"><dt>${tx('Address', 'العنوان')}</dt><dd dir="auto">${esc(o.delivery.addr)}</dd><dt>${tx('Window', 'الميعاد')}</dt><dd>${esc(o.delivery.win)}</dd><dt>${tx('Contact', 'التواصل')}</dt><dd dir="auto">${esc(o.delivery.contact)}</dd></dl><span class="pill info" style="margin-top:8px">${tx('Sent to supplier', 'اتبعت للمورد')}</span>`
        : `<p class="small muted" style="margin:6px 0 12px">${tx('Share unloading details and a delivery window with the supplier.', 'ابعت للمورد تفاصيل التنزيل وميعاد التسليم.')}</p><button class="btn btn-secondary btn-sm" data-act="delivery">${ic('truck')} ${tx('Request delivery coordination', 'اطلب تنسيق التسليم')}</button>`}</div></div></div>
  <style>@media (max-width:900px){#org{grid-template-columns:minmax(0,1fr)!important}}</style>`);
};

/* ---------- documents ---------- */
VIEWS['project-docs'] = r => {
  const p = proj(); const docs = [];
  if (p.stage !== 'draft') { docs.push({ ic: 'file', en: `Spec sheet v1 — ${p.code}`, ar: `ملف المواصفات نسخة ١ — ${p.code}`, d: p.sentOn || TODAY, act: 'viewSpec', kind: tx('Generated', 'مولّد') }); docs.push({ ic: 'send', en: `RFQ ${p.code}`, ar: `طلب عرض سعر ${p.code}`, d: p.sentOn || TODAY, kind: tx('Generated', 'مولّد') }); }
  if (p.id === 'p-nuts' && S.quotesArrived) Object.values(S.quotes).forEach((q, i) => docs.push({ ic: 'tag', en: `Quotation ${q.ref} v${q.ver} — ${sup(Object.keys(S.quotes)[i]).en}`, ar: `عرض سعر ${q.ref} نسخة ${q.ver} — ${sup(Object.keys(S.quotes)[i]).ar}`, d: TODAY, kind: tx('Supplier', 'من المورد') }));
  if (p.id === 'p-nuts' && S.sample.status === 'approved') docs.push({ ic: 'shield', en: `Sample approval record SAR-2611-014-${S.sample.ver || 1}`, ar: `سجل اعتماد العينة SAR-2611-014-${S.sample.ver || 1}`, d: S.sample.decidedOn, act: 'viewSample', kind: tx('Record', 'سجل') });
  if (p.id === 'p-nuts' && S.accepted) { docs.push({ ic: 'file', en: 'Purchase order PO-2611-014', ar: 'أمر شراء PO-2611-014', d: TODAY, kind: tx('Generated', 'مولّد') }); S.quotes[S.accepted].docs.forEach(d => docs.push({ ic: 'shield', en: `${DOC_LABELS[d].en} — ${sup(S.accepted).en}`, ar: `${DOC_LABELS[d].ar} — ${sup(S.accepted).ar}`, d: TODAY, kind: tx('Supplier', 'من المورد') })); }
  S.uploads.forEach(u => docs.push({ ic: 'upload', en: u.name, ar: u.name, d: u.at, kind: tx('Uploaded by you', 'رفعته إنت'), raw: true }));
  return wsShell(r, tx('Documents', 'المستندات'), `<div class="row-between" style="margin-bottom:14px"><h2 style="font-size:1.2rem">${tx('Document center', 'مركز المستندات')}</h2><label class="btn btn-secondary btn-sm" style="cursor:pointer">${ic('upload')} ${tx('Upload file', 'رفع ملف')}<input type="file" data-upload="docs" class="sr-only"></label></div>
  ${docs.length ? `<div class="table-wrap"><table class="list"><thead><tr><th>${tx('Document', 'المستند')}</th><th>${tx('Source', 'المصدر')}</th><th>${tx('Date', 'التاريخ')}</th><th></th></tr></thead><tbody>${docs.map(d => `<tr><td><span class="row">${ic(d.ic)}${d.raw ? ltr(d.en) : L(d)}</span></td><td><span class="pill">${d.kind}</span></td><td class="num">${fdate(d.d)}</td><td>${d.act ? `<button class="btn btn-ghost btn-sm" data-act="${d.act}">${tx('View', 'عرض')}</button>` : `<span class="faint small">${tx('Preview in production', 'المعاينة في النسخة الفعلية')}</span>`}</td></tr>`).join('')}</tbody></table></div>`
    : emptyState('file', tx('No documents yet', 'لسه مفيش مستندات'), tx('Your spec sheet, quotations, sample records, POs and invoices collect here automatically.', 'ملف المواصفات والعروض وسجلات العينة وأوامر الشراء والفواتير بيتجمعوا هنا تلقائيًا.'))}
  <p class="faint" style="margin-top:10px">${tx('Uploads in this demo stay in your browser. Files over 10 MB show an error.', 'الملفات في الديمو بتفضل في المتصفح بتاعك. الملفات الأكبر من ١٠ ميجا بتطلع رسالة خطأ.')}</p>`);
};

/* ---------- project actions ---------- */
ACTIONS.simQuotes = () => {
  S.ui.loadingQuotes = true; render(true);
  setTimeout(() => {
    S.ui.loadingQuotes = false; S.quotesArrived = true; proj('p-nuts').stage = 'quotes';
    Object.keys(S.quotes).forEach(id => notify(`New quotation from ${sup(id).en} (${S.quotes[id].ref}).`, `عرض سعر جديد من ${sup(id).ar} (${S.quotes[id].ref}).`, 'tag', 'project-quotes'));
    save(); render(true); toast(tx('3 quotations received. Totals normalised for comparison.', 'وصل ٣ عروض. الإجماليات اتوحدت للمقارنة.'), 'tag');
  }, 1600);
};
ACTIONS.shortlist = el => { const id = el.dataset.id; const i = S.shortlist.indexOf(id); i >= 0 ? S.shortlist.splice(i, 1) : S.shortlist.push(id); save(); render(true); toast(i >= 0 ? tx('Removed from shortlist', 'اتشال من القائمة') : tx(`${sup(id).en} shortlisted`, `${sup(id).ar} اتضاف للقائمة المختصرة`), 'bookmark'); };
ACTIONS.reqSample = el => { if (!S.shortlist.includes(el.dataset.id)) S.shortlist.push(el.dataset.id); if (S.sample.status === 'none') S.sample.supplier = el.dataset.id; save(); go('project-samples'); };
ACTIONS.askComplete = el => { const id = el.dataset.id; (S.threads[id + '-x'] ??= []).push({ from: 'me', text: tx('Could you complete the missing items in your quotation (delivery charge / documents)? Thank you.', 'ممكن تستكمل البنود الناقصة في العرض (سعر التوصيل / المستندات)؟ شكرًا.') }); S.thread = id; save(); toast(tx('Request sent to supplier in the project thread.', 'الطلب اتبعت للمورد في محادثة المشروع.'), 'msg'); go('project-messages'); };
ACTIONS.openThread = el => { S.thread = el.dataset.id; save(); go('project-messages'); };
ACTIONS.toggleOrig = el => { S.ui[el.dataset.k] = !S.ui[el.dataset.k]; render(true); };
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form="msg"]'); if (!f) return; e.preventDefault();
  const inp = f.querySelector('#msg-in'); const text = inp.value.trim(); if (!text) { inp.focus(); return; }
  const th = S.thread; (S.threads[th + '-x'] ??= []).push({ from: 'me', text }); save(); render(true); document.getElementById('msg-in')?.focus();
  setTimeout(() => { S.threads[th + '-x'].push({ from: 'sup', auto: true, en: 'Thanks, noted. We will reply within one business day.', ar: 'شكرًا، وصلتنا رسالتك. هنرد خلال يوم عمل.', orig: 'ar' }); save(); if (currentRoute() === 'project-messages') render(true); }, 1400);
});
ACTIONS.sendSample = () => { const sm = S.sample; if (!(sm.packs > 0)) { ERRORS['sample.packs'] = MSG.pos(); render(true); return; } sm.status = 'requested'; sm.ver = sm.ver || 1; proj('p-nuts').stage = 'sample'; if (!S.shortlist.includes(sm.supplier)) S.shortlist.push(sm.supplier);
  notify(`Sample requested from ${sup(sm.supplier).en}.`, `تم طلب عينة من ${sup(sm.supplier).ar}.`, 'box', 'project-samples'); save(); render(true); toast(tx('Sample request sent (demo).', 'طلب العينة اتبعت (تجريبي).'), 'box'); };
ACTIONS.simShip = () => { S.sample.status = 'shipped'; notify(`${sup(S.sample.supplier).en} shipped your sample.`, `${sup(S.sample.supplier).ar} شحن العينة.`, 'truck', 'project-samples'); save(); render(true); toast(tx('Supplier marked the sample as shipped.', 'المورد علّم العينة إنها اتشحنت.'), 'truck'); };
ACTIONS.sampleReceived = () => { S.sample.status = 'received'; save(); render(true); };
ACTIONS.approveSample = () => { const sm = S.sample; if (EVAL.some(e => !sm.eval[e[0]])) { ERRORS.eval = tx('Rate every criterion before approving.', 'قيّم كل البنود قبل الاعتماد.'); render(true); return; }
  sm.status = 'approved'; sm.decidedOn = TODAY; proj('p-nuts').stage = 'approved'; ERRORS = {}; notify('Sample approved — approval record created.', 'العينة اتعتمدت — اتعمل سجل اعتماد.', 'shield', 'project-samples'); save(); render(true); toast(tx('Sample approved and recorded.', 'العينة اتعتمدت واتسجلت.'), 'shield'); };
ACTIONS.sampleChanges = () => { const sm = S.sample; if (!sm.notes) { ERRORS['sample.notes'] = tx('Describe what should change.', 'اكتب إيه اللي محتاج يتعدل.'); render(true); return; }
  sm.ver = (sm.ver || 1) + 1; sm.status = 'preparing'; sm.eval = {}; ERRORS = {}; notify(`Change request sent; sample v${sm.ver} in preparation.`, `طلب التعديل اتبعت؛ عينة نسخة ${sm.ver} بتتجهز.`, 'refresh', 'project-samples'); save(); render(true); toast(tx(`Requested a revised sample (v${sm.ver}).`, `اتطلبت عينة معدلة (نسخة ${sm.ver}).`), 'refresh'); };
ACTIONS.acceptQuote = () => { if (!S.ui.acceptOk || (S.sample.status !== 'approved' && !S.ui.noSampleOk)) { ERRORS.accept = tx('Tick the confirmation(s) above to accept in writing.', 'علّم على التأكيد فوق عشان تقبل كتابيًا.'); render(true); return; }
  S.accepted = S.ui.acceptSup; S.order.milestone = 1; proj('p-nuts').stage = 'order'; ERRORS = {};
  notify(`Order PO-2611-014 created with ${sup(S.accepted).en}.`, `اتعمل أمر الشراء PO-2611-014 مع ${sup(S.accepted).ar}.`, 'file', 'project-order'); save(); render(); toast(tx('Quotation accepted. Purchase order created.', 'العرض اتقبل. اتعمل أمر شراء.'), 'check'); };
ACTIONS.payInv = el => { const k = Number(el.dataset.k); S.order.paid[k] = true; S.order.milestone = k === 0 ? 2 : 7; notify(k === 0 ? 'Deposit marked paid (demo). Production can start.' : 'Balance marked paid (demo). Supplier can dispatch.', k === 0 ? 'المقدم اتعلّم مدفوع (تجريبي). الإنتاج يقدر يبدأ.' : 'الباقي اتعلّم مدفوع (تجريبي). المورد يقدر يشحن.', 'wallet', 'project-order'); save(); render(true); toast(tx('Invoice marked as paid — demo only, no money moved.', 'الفاتورة اتعلّمت مدفوعة — تجريبي، مفيش فلوس اتحركت.'), 'wallet'); };
ACTIONS.simMilestone = () => { const o = S.order; const split = PAY_SPLIT[S.accepted];
  if (o.milestone === 1 && !split[0]) o.milestone = 2; else if (o.milestone === 5) o.milestone = 6; else if (o.milestone === 7) o.milestone = 8; else o.milestone++;
  const m = MILESTONES[o.milestone - 1]; notify(`${sup(S.accepted).en}: ${m[0]}.`, `${sup(S.accepted).ar}: ${m[1]}.`, 'factory', 'project-order'); save(); render(true); toast(tx(`Supplier update: ${m[0]}`, `تحديث من المورد: ${m[1]}`), 'factory'); };
ACTIONS.confirmReceipt = () => { S.order.received = true; proj('p-nuts').stage = 'delivered'; notify('Delivery confirmed. Project complete.', 'الاستلام اتأكد. المشروع خلص.', 'check', 'project-order'); save(); render(true); toast(tx('Receipt confirmed. You can reorder anytime.', 'الاستلام اتأكد. تقدر تعيد الطلب في أي وقت.')); };
ACTIONS.viewSpec = () => { const p = proj(); openModal(`<div class="spec-doc"><div class="row-between"><div class="row">${logo(28)}<b>${tx('Specification sheet', 'ملف المواصفات')}</b></div><span class="mono small">${p.code} · v1</span></div><hr class="divider" style="margin:14px 0"><h2 style="font-size:1.2rem;margin-bottom:12px">${L(p.title)}</h2>${kvList(specRows(p))}<hr class="divider" style="margin:14px 0"><p class="faint">${tx('Every quotation is priced against this version. Changes create a new version and are shared with all invited suppliers.', 'كل عرض بيتسعّر على النسخة دي. أي تعديل بيعمل نسخة جديدة وبتتبعت لكل الموردين المدعوين.')}</p></div><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-primary" data-act="closeModal">${tx('Close', 'إغلاق')}</button></div>`, true); };
ACTIONS.viewSample = () => openModal(sampleRecord() + `<div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-secondary" data-act="closeModal">${tx('Close', 'إغلاق')}</button></div>`, true);
function formModal(title, fields, submit, note) {
  openModal(`<h2>${title}</h2>${note ? `<p class="faint" style="margin:6px 0 0">${note}</p>` : ''}<form class="stack" data-form="modal" style="margin-top:16px">${fields}<div class="row" style="justify-content:flex-end"><button type="button" class="btn btn-secondary" data-act="closeModal">${tx('Cancel', 'إلغاء')}</button><button class="btn btn-primary" type="submit">${submit}</button></div></form>`);
}
let modalSubmit = null;
document.addEventListener('submit', e => { const f = e.target.closest('[data-form="modal"]'); if (!f) return; e.preventDefault(); if (modalSubmit) modalSubmit(f); });
ACTIONS.change = () => { formModal(tx('Change request', 'طلب تعديل'), `<div class="field"><label for="cr-t">${tx('What should change?', 'إيه اللي محتاج يتعدل؟')}</label><textarea id="cr-t" class="textarea" dir="auto" required></textarea></div><p class="note warn">${ic('info')}<span>${tx('The supplier confirms cost and time impact before the change applies. The original spec stays on record.', 'المورد بيأكد تأثير التكلفة والوقت قبل ما التعديل يتطبق. المواصفات الأصلية بتفضل متسجلة.')}</span></p>`, tx('Send change request', 'ابعت طلب التعديل'));
  modalSubmit = f => { const t = f.querySelector('#cr-t').value.trim(); if (!t) return; S.order.changes.push({ text: t, at: TODAY }); notify('Change request sent to supplier.', 'طلب التعديل اتبعت للمورد.', 'wrench', 'project-order'); save(); closeModal(); render(true); toast(tx('Change request logged on the project.', 'طلب التعديل اتسجل في المشروع.'), 'wrench'); }; };
ACTIONS.issue = () => { formModal(tx('Report an issue', 'بلّغ عن مشكلة'), `<div class="field"><label for="is-k">${tx('Type', 'النوع')}</label><select id="is-k" class="select">${[['quality', 'Quality vs approved sample', 'الجودة مقارنة بالعينة'], ['qty', 'Quantity / weight', 'الكمية / الوزن'], ['late', 'Delivery delay', 'تأخير التسليم'], ['damage', 'Damage in transit', 'تلف أثناء النقل'], ['docs', 'Documents', 'المستندات'], ['other', 'Other', 'أخرى']].map(o => `<option value="${o[0]}">${isAr() ? o[2] : o[1]}</option>`).join('')}</select></div>
  <div class="field"><label for="is-t">${tx('What happened?', 'إيه اللي حصل؟')}</label><textarea id="is-t" class="textarea" dir="auto" required></textarea></div><label class="drop">${ic('image')} ${tx('Add photos (optional)', 'أضف صور (اختياري)')}<input type="file" accept="image/*" multiple data-upload="issue"></label>`, tx('Submit report', 'إرسال البلاغ'), tx('Reports are linked to the project record and reviewed by Nawah ops. Nawah mediates using the record; it does not guarantee refunds.', 'البلاغ بيتربط بسجل المشروع وفريق نواة بيراجعه. نواة بتتوسط بناءً على السجل؛ ومش بتضمن استرداد فلوس.'));
  modalSubmit = f => { const t = f.querySelector('#is-t').value.trim(); if (!t) return; const k = f.querySelector('#is-k'); S.order.issues.push({ text: `[${k.options[k.selectedIndex].text}] ${t}`, at: TODAY }); notify('Issue reported. Ops will respond within 1 business day (demo).', 'البلاغ اتسجل. الفريق هيرد خلال يوم عمل (تجريبي).', 'flag'); save(); closeModal(); render(true); toast(tx('Issue reported — ticket opened.', 'البلاغ اتسجل — اتفتحت تذكرة.'), 'flag'); }; };
ACTIONS.delivery = () => { formModal(tx('Delivery coordination', 'تنسيق التسليم'), `<div class="field"><label for="dl-a">${tx('Delivery address', 'عنوان التسليم')}</label><input id="dl-a" class="input" dir="auto" required value="${esc(proj('p-nuts').spec.city)}"></div><div class="field"><label for="dl-w">${tx('Preferred window', 'الميعاد المفضل')}</label><select id="dl-w" class="select"><option>${tx('Sun–Thu, 9:00–13:00', 'الأحد–الخميس، ٩–١ الظهر')}</option><option>${tx('Sun–Thu, 13:00–17:00', 'الأحد–الخميس، ١–٥ العصر')}</option><option>${tx('Saturday morning', 'السبت الصبح')}</option></select></div><div class="field"><label for="dl-c">${tx('Contact on site', 'المسؤول في الموقع')}</label><input id="dl-c" class="input" dir="auto" placeholder="${tx('Name and mobile', 'الاسم والموبايل')}" required></div><label class="switch"><input type="checkbox" id="dl-u"><span>${tx('Ground floor, unloading labour needed', 'دور أرضي، محتاج عمال تنزيل')}</span></label>`, tx('Send to supplier', 'ابعت للمورد'));
  modalSubmit = f => { const a = f.querySelector('#dl-a').value.trim(), c = f.querySelector('#dl-c').value.trim(); if (!a || !c) return; S.order.delivery = { addr: a, win: f.querySelector('#dl-w').value, contact: c }; save(); closeModal(); render(true); toast(tx('Delivery details sent to the supplier.', 'تفاصيل التسليم اتبعتت للمورد.'), 'truck'); }; };
