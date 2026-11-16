/* Nawah prototype — supplier workspace, operations console, global actions. */
'use strict';

/* ================= SUPPLIER ================= */
const ME = () => sup('sw1');
function supHeader(title, sub) {
  return `<div class="row-between" style="margin-bottom:20px"><div class="row">${supLogo(ME())}<div><p class="eyebrow">${tx('Supplier workspace', 'مساحة المورد')} · ${L(ME())} ${demoTag()}</p><h1 style="font-size:1.6rem;margin-top:4px">${title}</h1>${sub ? `<p class="muted small">${sub}</p>` : ''}</div></div></div>`;
}
const certState = exp => { const days = (new Date(exp) - new Date(TODAY)) / 864e5; return days < 0 ? ['bad', tx('Expired', 'منتهية')] : days < 60 ? ['warn', tx(`Expires in ${Math.round(days)} days`, `تنتهي خلال ${Math.round(days)} يوم`)] : ['ok', tx('Valid', 'سارية')]; };

VIEWS['supplier-home'] = () => {
  const pr = S.supplier.profile; const exp = pr.certs.filter(c => certState(c.exp)[0] !== 'ok');
  const myOrder = S.accepted === 'sw1';
  return `<div class="wrap section">${supHeader(tx('Overview', 'نظرة عامة'))}
  <div class="grid g4">${[
    [tx('Matching RFQs open', 'طلبات مناسبة مفتوحة'), proj('p-nuts').stage !== 'draft' && !S.supplier.submitted ? 3 : 2, 'search'],
    [tx('Quotes sent · 30 days', 'عروض اتبعتت · ٣٠ يوم'), 7 + (S.supplier.submitted ? 1 : 0), 'tag'],
    [tx('Quote → sample rate', 'نسبة العرض ← عينة'), '29%', 'box'],
    [tx('Median first response', 'متوسط أول رد'), tx('1.6 days', '١٫٦ يوم'), 'clock']].map(k => `<div class="card kpi"><span class="faint row">${ic(k[2])} ${k[0]}</span><span class="v">${k[1]}</span></div>`).join('')}</div>
  <p class="faint" style="margin-top:6px">${tx('Demo metrics. In production they are computed from platform activity only.', 'أرقام تجريبية. في النسخة الفعلية بتتحسب من نشاط المنصة بس.')}</p>
  <div class="grid g2" style="margin-top:18px">
    <div class="card"><div class="card-head"><h3>${tx('Action needed', 'مطلوب منك')}</h3></div>
      ${proj('p-nuts').stage !== 'draft' && !S.supplier.submitted ? `<div class="assist-item miss">${ic('alert')}<span class="grow">${tx('New matching RFQ: mixed nuts, 100 kg', 'طلب جديد مناسب: مكسرات مشكلة، ١٠٠ كجم')}</span><a class="btn btn-primary btn-sm" href="#supplier-quote">${tx('Quote', 'سعّر')}</a></div>` : ''}
      ${exp.map(c => `<div class="assist-item miss">${ic('alert')}<span class="grow">${esc(c.name)} — ${certState(c.exp)[1]}</span><a class="btn btn-secondary btn-sm" href="#supplier-profile">${tx('Update', 'حدّث')}</a></div>`).join('')}
      ${myOrder && S.order.milestone >= 2 && S.order.milestone < 8 && ![6].includes(S.order.milestone) ? `<div class="assist-item">${ic('factory')}<span class="grow">${tx('Order PO-2611-014 — post your next production update', 'أمر PO-2611-014 — ابعت تحديث الإنتاج الجاي')}</span><button class="btn btn-primary btn-sm" data-act="simMilestone">${tx('Post update', 'ابعت تحديث')}</button></div>` : ''}
      ${S.sample.status === 'requested' && S.sample.supplier === 'sw1' ? `<div class="assist-item">${ic('box')}<span class="grow">${tx('Sample requested for PRJ-2611-014', 'عينة مطلوبة للمشروع PRJ-2611-014')}</span><button class="btn btn-primary btn-sm" data-act="simShip">${tx('Mark shipped', 'علّمها اتشحنت')}</button></div>` : ''}</div>
    <div class="card"><div class="card-head"><h3>${tx('Profile & verification', 'الملف والتحقق')}</h3><a class="btn btn-ghost btn-sm" href="#supplier-profile">${tx('Edit', 'تعديل')}</a></div>
      <div class="progress" style="margin-bottom:8px"><i style="width:85%"></i></div><p class="faint">${tx('Profile 85% complete — add production photos to reach 100%.', 'الملف مكتمل ٨٥٪ — ضيف صور الإنتاج عشان يكمل.')}</p>
      <div style="margin-top:12px">${verifyBadge(ME())}</div></div>
  </div></div>`;
};

const DEMO_RFQS = [
  { id: 'x1', en: 'Pistachio 100 g PET jars × 1,000', ar: 'فستق برطمانات ١٠٠ جم × ١٬٠٠٠', gov: { en: 'Alexandria', ar: 'الإسكندرية' }, due: '2026-11-21', score: 81, why: [['Jar filling', 'تعبئة برطمانات'], ['MOQ fits', 'الحد الأدنى مناسب']] },
  { id: 'x2', en: 'Spiced peanuts 50 g × 5,000 (flavoured)', ar: 'سوداني متبّل ٥٠ جم × ٥٬٠٠٠ (بنكهات)', gov: { en: 'Mansoura', ar: 'المنصورة' }, due: '2026-11-24', score: 74, why: [['Flavouring', 'تنكيه'], ['Roasting', 'تحميص']] }
];
VIEWS['supplier-rfqs'] = () => {
  const p = proj('p-nuts'); const kg = p.spec.packs * p.spec.packG / 1000;
  return `<div class="wrap section">${supHeader(tx('Matching RFQs', 'الطلبات المناسبة'), tx('Requests are matched to your declared categories, capabilities and MOQ. Buyer identity is shared after they accept your quote.', 'الطلبات بتتطابق مع أقسامك وإمكانياتك والحد الأدنى. هوية العميل بتظهر بعد ما يقبل عرضك.'))}
  <div class="stack">
    <article class="card row" style="align-items:flex-start"><div class="grow stack" style="gap:6px"><div class="row"><h3>${tx(`Mixed nuts, ${optLabel('process', p.spec.process).toLowerCase()} — ${nf(p.spec.packs)} × ${p.spec.packG} g`, `مكسرات مشكلة، ${optLabel('process', p.spec.process)} — ${nf(p.spec.packs)} × ${p.spec.packG} جم`)}</h3>
      ${p.stage === 'draft' ? `<span class="pill">${tx('Preview — buyer has not submitted yet', 'معاينة — العميل لسه مبعتش')}</span>` : S.supplier.submitted ? `<span class="pill ok">${tx(`Quoted v${S.quotes.sw1.ver}`, `اتسعّر نسخة ${S.quotes.sw1.ver}`)}</span>` : `<span class="pill warn">${tx('Awaiting your quote', 'في انتظار عرضك')}</span>`}</div>
      <p class="faint"><bdi class="mono">${p.code}</bdi> · ${tx('Buyer', 'العميل')} <bdi class="mono">B-2041</bdi> · ${esc(p.spec.city) || tx('Greater Cairo', 'القاهرة الكبرى')} · ${nf(kg)} kg</p>
      <div class="match">${matchSuppliers(p).find(m => m.s.id === 'sw1').why.map(w => `<span>${L(w)}</span>`).join('')}</div></div>
      <a class="btn btn-primary" href="#supplier-quote">${S.supplier.submitted ? tx('Revise quote', 'عدّل العرض') : tx('Build quote', 'جهّز العرض')} ${ic('arrow', 'flip')}</a></article>
    ${DEMO_RFQS.map(x => `<article class="card row" style="align-items:flex-start"><div class="grow stack" style="gap:6px"><div class="row"><h3>${L(x)}</h3><span class="pill">${x.score}% ${tx('match', 'توافق')}</span></div><p class="faint">${L(x.gov)} · ${tx('quotes due', 'آخر ميعاد')} ${fdate(x.due)}</p><div class="match">${x.why.map(w => `<span>${isAr() ? w[1] : w[0]}</span>`).join('')}</div></div><button class="btn btn-secondary" data-act="demoOnly">${tx('View', 'عرض')}</button></article>`).join('')}
  </div></div>`;
};

function supDraft() { if (!S.supplier.draft) { const q = S.quotes.sw1; S.supplier.draft = { basis: q.basis, product: q.product, packaging: q.packaging, setup: q.setup, sample: q.sample, sampleDeductible: q.sampleDeductible, vatIncluded: q.vatIncluded, delivery: q.delivery ?? '', leadDays: q.leadDays, moqKg: q.moqKg, pay: 'p5050', validity: q.validity, shelf: '6', docs: [...q.docs], exclusions: q.exclusions.en, deviation: '' }; } return S.supplier.draft; }
const PAY_OPTS = [['p5050', '50% deposit · 50% before dispatch', '٥٠٪ مقدم · ٥٠٪ قبل الشحن'], ['p3070', '30% deposit · 70% on delivery', '٣٠٪ مقدم · ٧٠٪ عند الاستلام'], ['p100', '100% before dispatch', '١٠٠٪ قبل الشحن']];
VIEWS['supplier-quote'] = () => {
  const p = proj('p-nuts'); supDraft(); const D = 'supplier.draft.';
  return `<div class="wrap section">${crumbs([[tx('Matching RFQs', 'الطلبات المناسبة'), 'supplier-rfqs'], [p.code]])}${supHeader(tx('Structured quotation', 'عرض سعر منظم'), tx('Every quote uses the same structure, so buyers compare like for like. Do not include costs the buyer excluded.', 'كل العروض بنفس الشكل عشان العميل يقارن صح. متحطش تكاليف العميل استبعدها.'))}
  <div class="builder"><div class="stack">
    <div class="card"><h3>${tx('1 · Pricing', '١ · التسعير')}</h3><div class="fieldset" style="margin-top:14px">
      ${fRadio(D + 'basis', tx('Price basis', 'أساس السعر'), [['pack', `Per ${p.spec.packG} g pack`, `للعبوة ${p.spec.packG} جم`], ['kg', 'Per kg', 'للكيلو']])}
      <div class="grid g2">${fNum(D + 'product', tx('Product + processing price', 'سعر المنتج + التصنيع'), isAr() ? 'ج.م' : 'EGP', { req: 1, step: 0.5 })}${fNum(D + 'packaging', tx('Packaging & printing per pack', 'العبوة والطباعة للعبوة'), isAr() ? 'ج.م' : 'EGP', { step: 0.5 })}
      ${fNum(D + 'setup', tx('One-off setup / plates', 'تجهيز / أكلاشيهات (مرة واحدة)'), isAr() ? 'ج.م' : 'EGP')}${fNum(D + 'delivery', tx('Delivery to buyer area', 'التوصيل لمنطقة العميل'), isAr() ? 'ج.م' : 'EGP', { hint: tx('Leave empty only if you cannot quote it yet — it will be flagged as missing.', 'سيبها فاضية بس لو مش قادر تسعّرها دلوقتي — هتظهر كناقصة.') })}
      ${fNum(D + 'sample', tx('Sample charge', 'تكلفة العينة'), isAr() ? 'ج.م' : 'EGP')}<div class="field" style="justify-content:flex-end;gap:10px">${fToggle(D + 'sampleDeductible', tx('Sample charge deductible from order', 'تكلفة العينة بتتخصم من الطلب'))}${fToggle(D + 'vatIncluded', tx('Prices include 14% VAT', 'الأسعار شاملة ضريبة ١٤٪'))}</div></div></div></div>
    <div class="card"><h3>${tx('2 · Terms', '٢ · الشروط')}</h3><div class="grid g2" style="margin-top:14px">
      ${fNum(D + 'leadDays', tx('Production lead time', 'مدة الإنتاج'), tx('days', 'يوم'), { req: 1 })}${fNum(D + 'moqKg', tx('Your MOQ', 'الحد الأدنى عندك'), 'kg')}
      ${fSelect(D + 'pay', tx('Payment terms', 'شروط الدفع'), PAY_OPTS)}${fNum(D + 'validity', tx('Quote validity', 'صلاحية العرض'), tx('days', 'يوم'), { req: 1 })}
      ${fSelect(D + 'shelf', tx('Shelf life you can confirm', 'الصلاحية اللي تقدر تأكدها'), OPT.shelf)}${fText(D + 'exclusions', tx('Exclusions', 'الاستثناءات'), { dir: 'auto' })}</div>
      <div style="margin-top:14px">${fChips(D + 'docs', tx('Documents you will provide', 'المستندات اللي هتقدمها'), Object.entries(DOC_LABELS).map(([k, v]) => [k, v.en, v.ar]), { wide: 1 })}</div>
      <div style="margin-top:14px">${fArea(D + 'deviation', tx('Any deviation from the buyer’s spec?', 'في أي اختلاف عن مواصفات العميل؟'), { ph: tx('Leave empty if you quote exactly to spec', 'سيبها فاضية لو بتسعّر على المواصفات بالظبط') })}</div></div>
    <div class="row" style="justify-content:flex-end"><a class="btn btn-secondary" href="#supplier-rfqs">${tx('Save draft', 'حفظ مسودة')}</a><button class="btn btn-primary btn-lg" data-act="submitQuote">${ic('send', 'flip')} ${tx('Submit quotation', 'إرسال العرض')} ${demoTag()}</button></div>
  </div>
  <aside class="builder-side"><div class="card" data-live="supTotal"></div><div class="card"><h3>${tx('Buyer specification', 'مواصفات العميل')} <span class="faint">v1</span></h3><div style="margin-top:10px" class="small">${kvList(specRows(p))}</div><p class="faint" style="margin-top:10px">${ic('lock')} ${tx('Buyer name and contacts are hidden until your quote is accepted.', 'اسم العميل وبيانات التواصل مخفية لحد ما عرضك يتقبل.')}</p></div></aside></div></div>`;
};
PARTIALS.supTotal = () => {
  const d = supDraft(); const s = proj('p-nuts').spec; const kg = s.packs * s.packG / 1000;
  const prod = d.basis === 'kg' ? (d.product || 0) * kg : (d.product || 0) * s.packs; const sub = prod + (d.packaging || 0) * s.packs + (d.setup || 0) + (d.sampleDeductible ? 0 : d.sample || 0) + (Number(d.delivery) || 0);
  const inc = d.vatIncluded ? sub : sub * 1.14;
  const miss = []; if (d.delivery === '' || d.delivery == null) miss.push(tx('Delivery charge', 'سعر التوصيل')); if (!d.shelf) miss.push(tx('Shelf-life statement', 'بيان الصلاحية')); if (!d.docs.includes('foodsafety')) miss.push(tx('Food-safety document', 'مستند سلامة الغذاء')); if (!(d.product > 0)) miss.push(tx('Product price', 'سعر المنتج'));
  const pct = Math.round((4 - miss.length) / 4 * 100);
  return `<h3>${tx('Quote preview', 'معاينة العرض')}</h3><p class="faint" style="margin-top:4px">${tx('As the buyer will see it after normalisation', 'زي ما العميل هيشوفه بعد التوحيد')}</p>
  <div style="font-family:var(--f-display);font-size:1.6rem;font-weight:600;margin:10px 0 2px">${egp(inc)}</div><p class="faint num">${tx('incl. VAT', 'شامل الضريبة')} · <span class="ltr">${egp(inc / kg, 2)} / kg · ${nf(kg)} kg</span></p>
  <div class="row-between" style="margin-top:14px"><span class="small"><b>${tx('Completeness', 'الاكتمال')}</b></span><span class="num small">${pct}%</span></div><div class="progress accent" style="margin:6px 0 8px"><i style="width:${pct}%"></i></div>
  ${miss.length ? miss.map(m => `<div class="assist-item miss">${ic('alert')}<span>${m}</span></div>`).join('') + `<p class="faint">${tx('Incomplete quotes are excluded from “lowest total”.', 'العروض الناقصة مستبعدة من “أقل إجمالي”.')}</p>` : `<div class="assist-item ok">${ic('check')}<span>${tx('Complete — eligible for every comparison label.', 'مكتمل — مؤهل لكل شارات المقارنة.')}</span></div>`}`;
};
ACTIONS.submitQuote = () => {
  const d = supDraft(); const e = {}; vPos(e, 'supplier.draft.product', d.product); vPos(e, 'supplier.draft.leadDays', d.leadDays); vPos(e, 'supplier.draft.validity', d.validity);
  if (Object.keys(e).length) { ERRORS = e; render(true); toast(tx('Complete the required fields.', 'كمّل الحقول المطلوبة.'), 'alert'); return; }
  const q = S.quotes.sw1; const po = PAY_OPTS.find(x => x[0] === d.pay);
  Object.assign(q, { basis: d.basis, product: d.product, packaging: d.packaging || 0, setup: d.setup || 0, sample: d.sample || 0, sampleDeductible: d.sampleDeductible, vatIncluded: d.vatIncluded,
    delivery: d.delivery === '' ? null : Number(d.delivery), leadDays: d.leadDays, moqKg: d.moqKg, validity: d.validity, docs: [...d.docs], payment: { en: po[1], ar: po[2] },
    exclusions: { en: d.exclusions, ar: d.exclusions }, shelfLife: d.shelf ? { en: `${d.shelf} months stated`, ar: `${d.shelf} شهور (حسب المورد)` } : null,
    deviations: d.deviation ? [{ en: d.deviation, ar: d.deviation }] : [], missing: [d.delivery === '' ? { en: 'Delivery charge not quoted', ar: 'لم يسعّر التوصيل' } : null, !d.docs.includes('foodsafety') ? { en: 'Food-safety document not attached', ar: 'لم يرفق مستند سلامة الغذاء' } : null].filter(Boolean),
    productNote: d.basis === 'kg' ? { en: 'per kg — nuts + processing', ar: 'للكيلو — مكسرات + تصنيع' } : { en: `per ${proj('p-nuts').spec.packG} g pack — nuts + processing`, ar: `للعبوة ${proj('p-nuts').spec.packG} جم — مكسرات + تصنيع` } });
  if (S.supplier.submitted || S.quotesArrived) q.ver++;
  PAY_SPLIT.sw1 = d.pay === 'p3070' ? [30, 70] : d.pay === 'p100' ? [0, 100] : [50, 50];
  S.supplier.submitted = true; ERRORS = {};
  notify(`${ME().en} ${q.ver > 1 ? 'revised' : 'submitted'} quotation ${q.ref} (v${q.ver}).`, `${ME().ar} ${q.ver > 1 ? 'عدّل' : 'بعت'} العرض ${q.ref} (نسخة ${q.ver}).`, 'tag', 'project-compare');
  save(); toast(tx('Quotation submitted. The buyer’s comparison updates automatically.', 'العرض اتبعت. مقارنة العميل بتتحدث تلقائيًا.'), 'send'); go('supplier-rfqs');
};

const PROFILE_STEPS = [['Company', 'الشركة'], ['Documents', 'المستندات'], ['Capabilities', 'الإمكانيات'], ['Capacity & MOQ', 'الطاقة والحد الأدنى'], ['Certificates', 'الشهادات']];
const PROCS = [['roasting', 'Roasting', 'تحميص'], ['salting', 'Salting', 'تمليح'], ['flavouring', 'Flavouring', 'تنكيه'], ['pouch-filling', 'Pouch filling', 'تعبئة أكياس'], ['jar-filling', 'Jar filling', 'تعبئة برطمانات'], ['pouch-printing', 'Pouch printing', 'طباعة أكياس'], ['labelling', 'Labelling', 'لزق ليبل']];
VIEWS['supplier-profile'] = () => {
  const pr = S.supplier.profile; const st = S.supplier.profileStep; const B = 'supplier.profile.';
  const bodies = [
    () => `<div class="grid g2">${fText(B + 'name', tx('Company name (English)', 'اسم الشركة (إنجليزي)'), { req: 1, dir: 'ltr' })}${fText(B + 'nameAr', tx('Company name (Arabic)', 'اسم الشركة (عربي)'), { req: 1, dir: 'rtl' })}
      ${fText(B + 'cr', tx('Commercial registry no.', 'رقم السجل التجاري'), { req: 1, dir: 'ltr' })}${fText(B + 'tax', tx('Tax registration no.', 'رقم التسجيل الضريبي'), { req: 1, dir: 'ltr' })}
      ${fSelect(B + 'gov', tx('Governorate', 'المحافظة'), [['cairo', 'Cairo', 'القاهرة'], ['giza', 'Giza', 'الجيزة'], ['qalyubia', 'Qalyubia', 'القليوبية'], ['sharqia', 'Sharqia', 'الشرقية'], ['alex', 'Alexandria', 'الإسكندرية'], ['damietta', 'Damietta', 'دمياط']])}</div>`,
    () => `<div class="stack">${[['Commercial registry extract', 'مستخرج السجل التجاري', 'ok'], ['Tax card', 'البطاقة الضريبية', 'ok'], ['Factory operating licence', 'رخصة تشغيل المصنع', 'ok'], ['Production photos', 'صور خط الإنتاج', 'none']].map(d => `<div class="row-between card-flat"><span class="row">${ic('file')}<b>${isAr() ? d[1] : d[0]}</b></span>${d[2] === 'ok' ? `<span class="pill ok">${ic('check')} ${tx('Reviewed', 'اتراجع')}</span>` : `<label class="btn btn-secondary btn-sm" style="cursor:pointer">${ic('upload')} ${tx('Upload', 'رفع')}<input type="file" class="sr-only" data-upload="supdoc"></label>`}</div>`).join('')}
      <p class="faint">${tx('Nawah reviews documents for authenticity and validity on the date shown. This is not a quality certification.', 'نواة بتراجع المستندات للتأكد من صحتها وساريتها في التاريخ الموضح. ده مش شهادة جودة.')}</p></div>`,
    () => `${fChips(B + 'cats', tx('Categories', 'الأقسام'), CATEGORIES.filter(c => c.id !== 'custom').map(c => [c.id, c.en, c.ar]))}${fChips(B + 'procs', tx('Processes & packaging options', 'العمليات وخيارات التعبئة'), PROCS)}`,
    () => `<div class="grid g3">${fNum(B + 'capKg', tx('Monthly capacity', 'الطاقة الشهرية'), 'kg', { req: 1 })}${fNum(B + 'moq', tx('Minimum order', 'الحد الأدنى للطلب'), 'kg', { req: 1 })}${fText(B + 'lead', tx('Typical lead time (days)', 'مدة التنفيذ المعتادة (يوم)'), { dir: 'ltr' })}</div>
      <div class="note">${ic('info')}<span>${tx('Capacity and MOQ drive which RFQs you receive. Keep them current to avoid irrelevant requests.', 'الطاقة والحد الأدنى بيحددوا الطلبات اللي بتوصلك. خليهم محدثين عشان متجيلكش طلبات مش مناسبة.')}</span></div>`,
    () => `<div class="table-wrap"><table class="list"><thead><tr><th>${tx('Certificate', 'الشهادة')}</th><th>${tx('Expiry', 'الانتهاء')}</th><th>${tx('Status', 'الحالة')}</th><th></th></tr></thead><tbody>${pr.certs.map((c, i) => { const cs = certState(c.exp);
      return `<tr><td><input class="input" data-bind="supplier.profile.certs.${i}.name" value="${esc(c.name)}" aria-label="${tx('Certificate name', 'اسم الشهادة')}" dir="auto"></td><td><input class="input" type="date" data-bind="supplier.profile.certs.${i}.exp" value="${c.exp}" aria-label="${tx('Expiry date', 'تاريخ الانتهاء')}"></td><td><span class="pill ${cs[0]}">${cs[1]}</span></td><td><button class="icon-btn" data-act="certDel" data-i="${i}" aria-label="${tx('Remove', 'حذف')}">${ic('x')}</button></td></tr>`; }).join('')}</tbody></table></div>
      <button class="btn btn-secondary btn-sm" data-act="certAdd" style="margin-top:10px">${ic('plus')} ${tx('Add certificate', 'إضافة شهادة')}</button><p class="faint" style="margin-top:8px">${tx('You will be reminded 60 days before expiry. Expired certificates are hidden from buyers.', 'هيوصلك تنبيه قبل الانتهاء بـ ٦٠ يوم. الشهادات المنتهية بتتخفي عن العملاء.')}</p>`
  ];
  return `<div class="wrap section" style="max-width:980px">${supHeader(tx('Company profile', 'ملف الشركة'))}
  <div class="note ${pr.status === 'review' ? 'warn' : 'ok'}" style="margin-bottom:16px">${ic(pr.status === 'review' ? 'clock' : 'shield')}<span>${pr.status === 'review' ? tx('Changes submitted — under review by Nawah ops (demo).', 'التعديلات اتبعتت — تحت المراجعة من فريق نواة (تجريبي).') : tx('Approved. Documents reviewed 12–20 Oct 2026. Edits to documents trigger a new review.', 'معتمد. المستندات اتراجعت ١٢–٢٠ أكتوبر ٢٠٢٦. أي تعديل في المستندات بيعمل مراجعة جديدة.')}</span></div>
  <div class="card"><nav class="stepper">${PROFILE_STEPS.map((s, i) => `<button data-act="profStep" data-i="${i}" ${i === st ? 'aria-current="step"' : ''} class="${i < st ? 'done' : ''}"><span class="n">${i < st ? ic('check') : i + 1}</span>${isAr() ? s[1] : s[0]}</button>`).join('')}</nav>
  <h2 style="margin-bottom:16px">${isAr() ? PROFILE_STEPS[st][1] : PROFILE_STEPS[st][0]}</h2><div class="fieldset">${bodies[st]()}</div>
  <div class="builder-foot"><button class="btn btn-secondary" data-act="profStep" data-i="${Math.max(0, st - 1)}" ${st === 0 ? 'disabled' : ''}>${ic('back', 'flip')} ${tx('Back', 'رجوع')}</button>${st < 4 ? `<button class="btn btn-primary" data-act="profStep" data-i="${st + 1}">${tx('Continue', 'التالي')} ${ic('arrow', 'flip')}</button>` : `<button class="btn btn-primary" data-act="profSubmit">${tx('Submit for review', 'إرسال للمراجعة')}</button>`}</div></div></div>`;
};
ACTIONS.profStep = el => { S.supplier.profileStep = Number(el.dataset.i); save(); render(); };
ACTIONS.profSubmit = () => { S.supplier.profile.status = 'review'; save(); render(); toast(tx('Submitted for review.', 'اتبعت للمراجعة.'), 'shield'); };
ACTIONS.certAdd = () => { S.supplier.profile.certs.push({ name: '', exp: addDays(TODAY, 365) }); save(); render(true); };
ACTIONS.certDel = el => { S.supplier.profile.certs.splice(Number(el.dataset.i), 1); save(); render(true); };
ACTIONS.demoOnly = () => toast(tx('Demo listing — only the nuts RFQ is fully interactive.', 'طلب تجريبي — طلب المكسرات بس هو اللي تفاعلي بالكامل.'), 'info');

/* ================= ADMIN / OPS ================= */
function opsHeader(title, sub) { return `<div style="margin-bottom:20px"><p class="eyebrow">${tx('Nawah operations', 'تشغيل نواة')} ${demoTag()}</p><h1 style="font-size:1.6rem;margin-top:4px">${title}</h1>${sub ? `<p class="muted small" style="margin-top:4px">${sub}</p>` : ''}</div>`; }

VIEWS['admin-home'] = () => {
  const pending = S.admin.applicants.filter(a => !a.decision).length;
  const nuts = proj('p-nuts'); const accepted = S.accepted ? normQuote(S.accepted) : null;
  const funnel = [[tx('Buyer requests', 'طلبات العملاء'), 48], [tx('Qualified', 'مؤهلة'), 36], [tx('RFQs sent', 'طلبات اتبعتت'), 31], [tx('≥ 2 quotes', '≥ عرضين'), 24], [tx('Samples', 'عينات'), 12], [tx('Orders', 'طلبات شراء'), 7]];
  const issues = [...S.order.issues.map(i => ({ ...i, p: nuts.code, live: true })), { text: tx('[Delivery delay] Coffee batch arrived 3 days late', '[تأخير] شحنة البن وصلت متأخرة ٣ أيام'), at: '2026-08-30', p: 'PRJ-2608-003', closed: true }];
  return `<div class="wrap section">${opsHeader(tx('Marketplace overview', 'نظرة على المنصة'), tx('Last 30 days · demo figures', 'آخر ٣٠ يوم · أرقام تجريبية'))}
  <div class="grid g4">${[[tx('Suppliers awaiting review', 'موردين في انتظار المراجعة'), pending, 'shield', 'admin-suppliers'], [tx('Requests to qualify', 'طلبات محتاجة تأهيل'), 2, 'search', 'admin-requests'], [tx('Median time to first quote', 'متوسط أول عرض'), tx('2.3 days', '٢٫٣ يوم'), 'clock'], [tx('Quotes complete on first try', 'عروض كاملة من أول مرة'), '62%', 'check']].map(k => `<div class="card kpi">${k[3] ? `<a href="#${k[3]}" style="text-decoration:none;color:inherit">` : ''}<span class="faint row">${ic(k[2])} ${k[0]}</span><span class="v">${k[1]}</span>${k[3] ? '</a>' : ''}</div>`).join('')}</div>
  <div class="grid g2" style="margin-top:18px">
    <div class="card"><h3>${tx('Project funnel', 'مسار المشاريع')}</h3><p class="faint" style="margin-bottom:10px">${tx('Where projects stop tells ops where to help.', 'المشاريع بتقف فين بيقول للفريق يساعد فين.')}</p>${funnel.map(f => `<div class="bar"><span>${f[0]}</span><span class="track"><i style="width:${f[1] / 48 * 100}%"></i></span><span class="num" style="text-align:end">${f[1]}</span></div>`).join('')}</div>
    <div class="card"><h3>${tx('Issues & disputes', 'المشاكل والخلافات')}</h3><div style="margin-top:10px">${issues.map(i => `<div class="assist-item">${ic('flag')}<span class="grow"><b class="mono small">${i.p}</b> <span dir="auto">${esc(i.text)}</span><br><span class="faint">${fdate(i.at)}</span></span><span class="pill ${i.closed ? '' : 'warn'}">${i.closed ? tx('Resolved', 'اتحلت') : tx('Open', 'مفتوحة')}</span></div>`).join('')}</div>
      <p class="faint" style="margin-top:8px">${tx('Resolution uses the project record: spec version, approved sample, messages and milestones.', 'الحل بيعتمد على سجل المشروع: نسخة المواصفات، العينة المعتمدة، الرسائل والمراحل.')}</p></div></div>
  <div class="card" style="margin-top:18px"><div class="card-head"><h3>${tx('Service fees & commission (illustrative)', 'رسوم الخدمة والعمولة (توضيحي)')}</h3></div><div class="table-wrap" style="border:0"><table class="list"><thead><tr><th>${tx('Project', 'المشروع')}</th><th>${tx('Preparation fee', 'رسوم التجهيز')}</th><th>${tx('Order value (ex VAT)', 'قيمة الطلب (من غير ضريبة)')}</th><th>${tx('Commission 5%', 'عمولة ٥٪')}</th><th>${tx('Status', 'الحالة')}</th></tr></thead><tbody>
    <tr><td><bdi class="mono">${nuts.code}</bdi> · ${L(nuts.title)}</td><td>${egp(2000)}</td><td>${accepted ? egp(accepted.exVat) : '—'}</td><td>${accepted ? egp(accepted.exVat * 0.05) : '—'}</td><td><span class="pill ${accepted ? 'info' : ''}">${accepted ? tx('Accrues at delivery', 'تستحق عند التسليم') : nuts.stage === 'draft' ? tx('Not started', 'لم يبدأ') : tx('Prep fee invoiced', 'رسوم التجهيز اتفوترت')}</span></td></tr>
    <tr><td><bdi class="mono">PRJ-2608-003</bdi> · ${L(proj('p-coffee').title)}</td><td>${egp(1500)}</td><td>${egp(61400)}</td><td>${egp(3070)}</td><td><span class="pill ok">${tx('Collected (demo)', 'اتحصلت (تجريبي)')}</span></td></tr></tbody></table></div>
    <p class="faint">${tx('Preparation fee is credited against commission when an order is placed. All amounts are planning assumptions.', 'رسوم التجهيز بتتخصم من العمولة لما الطلب يتنفذ. كل المبالغ افتراضات تخطيط.')}</p></div></div>`;
};

VIEWS['admin-suppliers'] = () => {
  const A = S.admin; const a = A.applicants.find(x => x.id === A.sel) || A.applicants[0];
  const docState = d => { if (d.exp && d.exp < TODAY) return ['bad', tx('Expired', 'منتهية') + ' ' + fdate(d.exp)]; return d.st === 'verified' ? ['ok', tx('Verified', 'اتأكدت')] : d.st === 'resubmit' ? ['warn', tx('Resubmission requested', 'مطلوب إعادة رفع')] : d.st === 'missing' ? ['bad', tx('Not provided', 'غير مرفوعة')] : ['', tx('Pending check', 'في انتظار المراجعة')]; };
  const verified = a.docs.filter(d => d.st === 'verified' && !(d.exp && d.exp < TODAY));
  const canApprove = ['cr', 'tax'].every(k => a.docs.find(d => d.k === k)?.st === 'verified');
  const sv = A.siteVisit[a.id] || 'none';
  return `<div class="wrap section">${opsHeader(tx('Supplier review queue', 'طابور مراجعة الموردين'), tx('Check documents, record the verification scope, then approve, request information or reject.', 'راجع المستندات، سجّل نطاق التحقق، وبعدين وافق أو اطلب معلومات أو ارفض.'))}
  <div class="layout-side l300"><div class="stack">${A.applicants.map(x => `<button class="card row" style="text-align:start;cursor:pointer;${x.id === a.id ? 'border-color:var(--brand);background:var(--brand-soft)' : ''}" data-act="admSel" data-id="${x.id}"><span class="grow"><b>${L(x)}</b><br><span class="faint">${L(x.gov)} · ${L(cat(x.cat))} · ${fdate(x.submitted)}</span></span>${x.decision ? `<span class="pill ${x.decision === 'approved' ? 'ok' : x.decision === 'info' ? 'warn' : 'bad'}">${{ approved: tx('Approved', 'اتوافق'), info: tx('Info requested', 'مطلوب معلومات'), rejected: tx('Rejected', 'مرفوض') }[x.decision]}</span>` : `<span class="pill">${tx('New', 'جديد')}</span>`}</button>`).join('')}</div>
  <div class="stack"><div class="card"><div class="card-head"><div><h2 style="font-size:1.25rem">${L(a)} ${demoTag()}</h2><p class="faint">${L(a.gov)} · ${L(cat(a.cat))}</p></div></div>
    <div class="table-wrap"><table class="list"><thead><tr><th>${tx('Document', 'المستند')}</th><th>${tx('File', 'الملف')}</th><th>${tx('Status', 'الحالة')}</th><th>${tx('Check', 'المراجعة')}</th></tr></thead><tbody>
    ${a.docs.map((d, i) => { const ds = docState(d); return `<tr><td><b>${L(d)}</b>${d.exp ? `<br><span class="faint">${tx('Expiry', 'الانتهاء')} ${fdate(d.exp)}</span>` : ''}</td><td>${d.file ? `<span class="mono small">${ltr(d.file)}</span>` : '—'}</td><td><span class="pill ${ds[0]}">${ds[1]}</span>${d.checkedOn ? `<br><span class="faint">${fdate(d.checkedOn)}</span>` : ''}</td>
      <td>${d.file ? `<div class="row"><button class="btn btn-sm btn-secondary" data-act="docMark" data-i="${i}" data-v="verified" ${d.exp && d.exp < TODAY ? 'disabled' : ''}>${ic('check')} ${tx('Verify', 'تأكيد')}</button><button class="btn btn-sm btn-ghost" data-act="docMark" data-i="${i}" data-v="resubmit">${tx('Ask again', 'اطلب تاني')}</button></div>` : `<button class="btn btn-sm btn-ghost" data-act="docMark" data-i="${i}" data-v="resubmit">${tx('Request', 'اطلب')}</button>`}</td></tr>`; }).join('')}</tbody></table></div>
    <div class="grid g2" style="margin-top:16px">${fieldWrap('admin.siteVisit.' + a.id, tx('Site check', 'زيارة الموقع'), `<select class="select" id="${fid('admin.siteVisit.' + a.id)}" data-bind="admin.siteVisit.${a.id}"><option value="none" ${sv === 'none' ? 'selected' : ''}>${tx('Not done', 'لم تتم')}</option><option value="video" ${sv === 'video' ? 'selected' : ''}>${tx('Video walkthrough', 'جولة فيديو')}</option><option value="visit" ${sv === 'visit' ? 'selected' : ''}>${tx('In-person visit', 'زيارة ميدانية')}</option></select>`)}
    <div class="card-flat"><b class="small">${tx('Verification scope', 'نطاق التحقق')}</b><p class="faint" style="margin-top:4px">${tx('We confirm that documents appear authentic and valid on the check date. We do not test products, audit hygiene or guarantee capacity.', 'بنأكد إن المستندات شكلها سليم وسارية في يوم المراجعة. مش بنختبر المنتجات ولا بنفتش على النظافة ولا بنضمن الطاقة الإنتاجية.')}</p></div></div></div>
    <div class="card"><h3>${tx('Badge preview (what buyers will see)', 'معاينة الشارة (اللي العميل هيشوفه)')}</h3><div class="card-flat" style="margin-top:10px">${verified.length || sv !== 'none' ? `<span class="pill ok">${ic('shield')} ${tx('Documents reviewed', 'تمت مراجعة المستندات')} · ${fdate(TODAY)}</span><ul class="small" style="margin:8px 0 0;padding-inline-start:18px">${verified.map(d => `<li>${L(d)} — ${fdate(d.checkedOn || TODAY)}</li>`).join('')}${sv !== 'none' ? `<li>${sv === 'video' ? tx('Video site walkthrough', 'جولة فيديو في المصنع') : tx('In-person site visit', 'زيارة ميدانية')} — ${fdate(TODAY)}</li>` : ''}</ul><p class="faint" style="margin-top:6px">${tx('Not checked: product quality, capacity, delivery performance.', 'متراجعش: جودة المنتج، الطاقة، الالتزام بالتسليم.')}</p>` : `<span class="faint">${tx('No checks completed yet — no badge shown.', 'لسه مفيش مراجعات — مفيش شارة.')}</span>`}</div>
    ${a.docs.some(d => d.exp && d.exp < TODAY) ? `<div class="note bad" style="margin-top:12px">${ic('alert')}<span>${tx('A certificate has expired. It cannot be verified or shown to buyers until renewed.', 'في شهادة منتهية. مش هتتأكد ولا هتظهر للعملاء لحد ما تتجدد.')}</span></div>` : ''}
    <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-danger" data-act="admDecide" data-v="rejected">${tx('Reject', 'رفض')}</button><button class="btn btn-secondary" data-act="admDecide" data-v="info">${tx('Request information', 'اطلب معلومات')}</button><button class="btn btn-primary" data-act="admDecide" data-v="approved" ${canApprove ? '' : 'disabled title="CR and tax card must be verified"'}>${ic('check')} ${tx('Approve supplier', 'اعتماد المورد')}</button></div>
    ${!canApprove ? `<p class="faint" style="text-align:end;margin-top:6px">${tx('Commercial registry and tax card must be verified before approval.', 'لازم السجل التجاري والبطاقة الضريبية يتأكدوا قبل الاعتماد.')}</p>` : ''}</div></div></div></div>`;
};
ACTIONS.admSel = el => { S.admin.sel = el.dataset.id; save(); render(true); };
ACTIONS.docMark = el => { const a = S.admin.applicants.find(x => x.id === S.admin.sel); const d = a.docs[Number(el.dataset.i)]; d.st = el.dataset.v; d.checkedOn = TODAY; save(); render(true); toast(d.st === 'verified' ? tx(`${d.en} verified`, `${d.ar} اتأكد`) : tx('Resubmission requested from supplier', 'اتطلب من المورد إعادة الرفع'), d.st === 'verified' ? 'check' : 'refresh'); };
ACTIONS.admDecide = el => { const a = S.admin.applicants.find(x => x.id === S.admin.sel); a.decision = el.dataset.v; save(); render(true); toast({ approved: tx(`${a.en} approved — badge published with scope and date.`, `${a.ar} اتعتمد — الشارة اتنشرت بالنطاق والتاريخ.`), info: tx('Information request sent to supplier.', 'طلب المعلومات اتبعت للمورد.'), rejected: tx('Application rejected; supplier notified with reasons.', 'الطلب اترفض؛ والمورد وصله السبب.') }[a.decision], 'shield'); };

VIEWS['admin-requests'] = () => {
  const reqs = [['r1', 'p-nuts'], ['r2', 'p-dish'], ['r3', 'p-table'], ['r5', 'p-custom']].map(([id, pid]) => ({ id, p: proj(pid) }));
  const vague = { id: 'r4', en: '“I want to start a juice brand”', ar: '“عايز أعمل براند عصير”' };
  const sel = S.admin.reqSel; const cur = reqs.find(r => r.id === sel);
  let detail;
  if (sel === 'r4') detail = `<div class="card"><h2 style="font-size:1.2rem">${L(vague)}</h2><p class="faint">${tx('Submitted via “I have an idea” · no category matched', 'اتبعت من “عندي فكرة” · مفيش قسم مطابق')}</p>
    <div class="stack" style="margin-top:14px">${[['Product type (fresh, long-life, concentrate)?', 'نوع المنتج (فريش، طويل الصلاحية، مركز)؟'], ['First-order quantity and pack size?', 'كمية أول طلب وحجم العبوة؟'], ['Packaging: bottle, carton or pouch?', 'التغليف: زجاجة، كرتونة ولا كيس؟'], ['Where will it be sold?', 'هيتباع فين؟']].map(q => `<div class="assist-item miss">${ic('help')}<span>${isAr() ? q[1] : q[0]}</span></div>`).join('')}</div>
    <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-primary" data-act="nudge" data-id="r4">${ic('send', 'flip')} ${S.admin.nudged.r4 ? tx('Questions sent', 'الأسئلة اتبعتت') : tx('Send clarifying questions', 'ابعت أسئلة توضيحية')}</button></div></div>`;
  else { const p = cur.p; const chk = briefChecks(p); const pct = Math.round(chk.filter(c => c.ok).length / chk.length * 100); const m = matchSuppliers(p);
    detail = `<div class="card"><div class="card-head"><div><h2 style="font-size:1.2rem">${L(p.title)}</h2><p class="faint"><bdi class="mono">${p.code}</bdi> · ${L(cat(p.cat))}</p></div>${stagePill(p.stage)}</div>
      <div class="row-between"><b class="small">${tx('Brief completeness', 'اكتمال المواصفات')}</b><span class="num small">${pct}%</span></div><div class="progress accent" style="margin:6px 0 10px"><i style="width:${pct}%"></i></div>
      ${chk.filter(c => !c.ok).map(c => `<div class="assist-item miss">${ic('alert')}<span>${isAr() ? c.ar : c.en}</span></div>`).join('') || `<div class="assist-item ok">${ic('check')}<span>${tx('Qualified — ready for matching', 'مؤهل — جاهز للترشيح')}</span></div>`}</div>
    <div class="card"><h3>${tx('Supplier matching', 'ترشيح الموردين')}</h3><p class="faint" style="margin:4px 0 10px">${tx('Score = category + subcategory + MOQ fit + declared capabilities + location + verification depth. Ops can override.', 'التقييم = القسم + القسم الفرعي + الحد الأدنى + الإمكانيات المعلنة + المكان + عمق التحقق. الفريق يقدر يعدّل.')}</p>
      ${m.length ? m.map(x => `<label class="opt multi" style="align-items:center;margin-bottom:8px"><input type="checkbox" value="${x.s.id}" data-bind-multi="projects.${p.id}.invited" ${p.invited.includes(x.s.id) ? 'checked' : ''} ${p.stage !== 'draft' ? 'disabled' : ''}><span class="mark"></span><span class="grow"><span class="t">${L(x.s)}</span><span class="match">${x.why.map(w => `<span>${L(w)}</span>`).join('')}</span></span><span class="pill ${x.score >= 70 ? 'ok' : 'info'}">${x.score}%</span></label>`).join('') : `<p class="faint">${tx('No listed suppliers — recruit or source offline.', 'مفيش موردين — لازم ندوّر أوفلاين.')}</p>`}</div>
    ${p.id === 'p-nuts' && S.quotesArrived ? `<div class="card"><h3>${tx('Quotation completeness checks', 'مراجعة اكتمال العروض')}</h3><div style="margin-top:10px">${Object.keys(S.quotes).map(id => { const q = S.quotes[id]; return `<div class="row-between" style="padding:8px 0;border-bottom:1px solid var(--line)"><span><b>${L(sup(id))}</b> <span class="mono small">${q.ref} v${q.ver}</span><br>${q.missing.length || q.deviations.length ? [...q.missing, ...q.deviations].map(x => `<span class="faint">• ${L(x)}</span>`).join('<br>') : `<span class="faint" style="color:var(--ok)">${tx('Complete', 'مكتمل')}</span>`}</span>${q.missing.length ? `<button class="btn btn-sm btn-secondary" data-act="nudge" data-id="${id}">${S.admin.nudged[id] ? tx('Reminder sent', 'التذكير اتبعت') : tx('Nudge supplier', 'ذكّر المورد')}</button>` : `<span class="pill ok">${ic('check')}</span>`}</div>`; }).join('')}</div></div>` : ''}`; }
  return `<div class="wrap section">${opsHeader(tx('Requests & matching', 'الطلبات والترشيح'), tx('Qualify buyer requests, match suppliers and check quotation completeness.', 'أهّل طلبات العملاء، رشّح موردين، وراجع اكتمال العروض.'))}
  <div class="layout-side l300"><div class="stack">${reqs.map(r => `<button class="card" style="text-align:start;cursor:pointer;${r.id === sel ? 'border-color:var(--brand);background:var(--brand-soft)' : ''}" data-act="reqSel" data-id="${r.id}"><b>${L(r.p.title)}</b><br><span class="row" style="margin-top:4px">${stagePill(r.p.stage)}<span class="faint mono">${r.p.code}</span></span></button>`).join('')}
    <button class="card" style="text-align:start;cursor:pointer;${sel === 'r4' ? 'border-color:var(--brand);background:var(--brand-soft)' : ''}" data-act="reqSel" data-id="r4"><b>${L(vague)}</b><br><span class="pill warn" style="margin-top:4px">${tx('Needs clarification', 'محتاج توضيح')}</span></button></div>
  <div class="stack">${detail}</div></div></div>`;
};
ACTIONS.reqSel = el => { S.admin.reqSel = el.dataset.id; save(); render(true); };
ACTIONS.nudge = el => { S.admin.nudged[el.dataset.id] = true; save(); render(true); toast(tx('Message sent (demo).', 'الرسالة اتبعتت (تجريبي).'), 'send'); };

VIEWS['admin-templates'] = () => {
  const T = S.templates; const k = T[S.ui.tplSel] ? S.ui.tplSel : 'tshirt'; const t = T[k];
  const nf_ = S.ui.newField || (S.ui.newField = { en: '', ar: '', type: 'text', req: false });
  return `<div class="wrap section">${opsHeader(tx('Category & specification templates', 'قوالب الأقسام والمواصفات'), tx('Templates generate buyer forms. Add a field here and it appears in the buyer’s form immediately — no code change.', 'القوالب بتولّد نماذج العملاء. ضيف حقل هنا وهيظهر في نموذج العميل فورًا — من غير برمجة.'))}
  <div class="layout-side"><div class="stack">${Object.entries(T).map(([key, v]) => `<button class="card row" style="text-align:start;cursor:pointer;${key === k ? 'border-color:var(--brand);background:var(--brand-soft)' : ''}" data-act="tplSel" data-k="${key}"><span class="grow"><b>${L(v)}</b><br><span class="faint">${L(cat(v.cat))} · ${v.fields.length} ${tx('fields', 'حقل')}</span></span></button>`).join('')}
    <div class="card-flat small muted">${tx('Nuts, dishwashing liquid and wooden tables use hand-built guided builders; all other categories use templates.', 'المكسرات وسائل الأطباق والترابيزات ليهم نماذج موجهة مخصوصة؛ وباقي الأقسام بتستخدم القوالب.')}</div></div>
  <div class="stack"><div class="card"><div class="card-head"><h2 style="font-size:1.2rem">${L(t)}</h2><button class="btn btn-secondary btn-sm" data-act="previewTpl" data-k="${k}">${ic('eye')} ${tx('Preview as buyer', 'معاينة كعميل')}</button></div>
    <div class="table-wrap"><table class="list"><thead><tr><th>${tx('Field', 'الحقل')}</th><th>${tx('Key', 'المفتاح')}</th><th>${tx('Type', 'النوع')}</th><th>${tx('Required', 'إجباري')}</th><th>${tx('Unit / options', 'الوحدة / الاختيارات')}</th></tr></thead><tbody>${t.fields.map(f => `<tr><td><b>${L(f)}</b></td><td class="mono small">${ltr(f.k)}</td><td><span class="pill">${f.type}</span></td><td>${f.req ? `<span class="pill ok">${tx('Yes', 'أيوه')}</span>` : '—'}</td><td class="small">${f.unit ? L(f.unit) : f.opts ? f.opts.length + ' ' + tx('options', 'اختيارات') : '—'}</td></tr>`).join('')}</tbody></table></div></div>
    <div class="card"><h3>${tx('Add a field', 'إضافة حقل')}</h3><div class="grid g4" style="margin-top:12px;align-items:end">${fText('ui.newField.en', tx('Label (English)', 'الاسم (إنجليزي)'), { dir: 'ltr', ph: 'Neck style' })}${fText('ui.newField.ar', tx('Label (Arabic)', 'الاسم (عربي)'), { dir: 'rtl', ph: 'شكل الرقبة' })}
      ${fSelect('ui.newField.type', tx('Type', 'النوع'), [['text', 'Text', 'نص'], ['number', 'Number', 'رقم'], ['textarea', 'Long text', 'نص طويل'], ['toggle', 'Yes / no', 'نعم / لا']])}<div class="field">${fToggle('ui.newField.req', tx('Required', 'إجباري'))}</div></div>
      ${ERRORS.tpl ? `<p class="err" style="color:var(--bad);margin-top:8px">${ic('alert')} ${ERRORS.tpl}</p>` : ''}<div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn btn-primary" data-act="tplAdd">${ic('plus')} ${tx('Add field', 'أضف الحقل')}</button></div></div>
    <details class="card"><summary style="cursor:pointer;font-weight:600">${tx('Template JSON', 'JSON القالب')}</summary><pre class="schema" style="margin-top:12px">${esc(JSON.stringify({ key: k, category: t.cat, fields: t.fields.map(f => ({ key: f.k, type: f.type, required: !!f.req, label: { en: f.en, ar: f.ar }, ...(f.unit ? { unit: f.unit } : {}), ...(f.opts ? { options: f.opts.map(o => o[0]) } : {}) })) }, null, 2))}</pre></details></div></div></div>`;
};
ACTIONS.tplSel = el => { S.ui.tplSel = el.dataset.k; save(); render(true); };
ACTIONS.tplAdd = () => { const f = S.ui.newField; if (!f.en || !f.ar) { ERRORS.tpl = tx('Enter both English and Arabic labels.', 'اكتب الاسم بالإنجليزي والعربي.'); render(true); return; }
  const key = f.en.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'field'; S.templates[S.ui.tplSel].fields.push({ k: key, type: f.type, req: f.req, en: f.en, ar: f.ar, ...(f.type === 'number' ? { unit: { en: 'units', ar: 'وحدة' } } : {}) });
  S.ui.newField = { en: '', ar: '', type: 'text', req: false }; ERRORS = {}; save(); render(true); toast(tx('Field added. It now appears in the buyer form.', 'الحقل اتضاف. وبيظهر دلوقتي في نموذج العميل.'), 'plus'); };
ACTIONS.previewTpl = el => { S.role = 'buyer'; const p = proj('p-custom'); p.spec.tpl = el.dataset.k; p.spec.vals = p.spec.vals || {}; if (p.stage !== 'draft') { p.stage = 'draft'; } p.step = 0; save(); go('builder-custom'); };

/* ================= GLOBAL ACTIONS ================= */
ACTIONS.lang = () => { S.lang = isAr() ? 'en' : 'ar'; save(); render(true); toast(tx('Language: English. Your entries were kept.', 'اللغة: العربية. بياناتك اتحفظت زي ما هي.'), 'globe'); };
ACTIONS.pickLang = el => { S.lang = el.dataset.v; S.langChosen = true; save(); closeModal(); render(); };
ACTIONS.role = el => { S.role = el.value; save(); go(S.role === 'buyer' ? 'home' : S.role === 'supplier' ? 'supplier-home' : 'admin-home'); };
ACTIONS.viewAs = el => { S.role = el.dataset.role; save(); go(el.dataset.to); };
ACTIONS.joinSupplier = () => { S.role = 'supplier'; S.supplier.profileStep = 0; save(); go('supplier-profile'); toast(tx('Supplier onboarding — demo profile prefilled.', 'تسجيل المورد — ملف تجريبي متعبّي مسبقًا.'), 'user'); };
ACTIONS.menu = () => document.getElementById('nav').classList.toggle('open');
ACTIONS.notifs = () => { lastFocus = document.activeElement; document.getElementById('overlay').innerHTML = drawerNotifs(); document.querySelector('.drawer').focus(); };
ACTIONS.readAll = () => { S.notifs.forEach(n => (n.read = true)); save(); document.getElementById('overlay').innerHTML = drawerNotifs(); const b = document.getElementById('bell'); if (b) b.innerHTML = ic('bell'); };
ACTIONS.openNotif = el => { const n = S.notifs.find(x => x.id === el.dataset.id); n.read = true; save(); closeModal(); if (n.go) { S.role = n.go.startsWith('supplier') ? 'supplier' : n.go.startsWith('admin') ? 'admin' : 'buyer'; if (n.go.startsWith('project')) S.current = 'p-nuts'; go(n.go); } else render(true); };
ACTIONS.closeModal = () => closeModal();
ACTIONS.reset = () => { openModal(`<h2>${tx('Reset the demo?', 'إعادة الديمو من الأول؟')}</h2><p class="muted" style="margin-top:8px">${tx('All projects, quotes and settings in this browser go back to the starting state.', 'كل المشاريع والعروض والإعدادات في المتصفح ده هترجع لحالة البداية.')}</p><div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-secondary" data-act="closeModal">${tx('Cancel', 'إلغاء')}</button><button class="btn btn-danger" data-act="doReset">${tx('Reset demo', 'إعادة الديمو')}</button></div>`); };
ACTIONS.doReset = () => { const lang = S.lang; S = initialState(); S.lang = lang; S.langChosen = true; save(); closeModal(); go('home'); toast(tx('Demo reset.', 'الديمو اترجع لأوله.'), 'refresh'); };
ACTIONS.continueDemo = () => { S.role = 'buyer'; S.current = 'p-nuts'; const p = proj('p-nuts'); go(p.stage === 'draft' ? 'builder-nuts' : nextAction(p)[1]); };
ACTIONS.openBuilder = el => { const [b, tpl] = el.dataset.b.split(':'); if (tpl) { const p = proj('p-custom'); if (p.stage === 'draft') { p.spec.tpl = tpl; } } save(); go(b); };
ACTIONS.openTpl = el => { const p = proj('p-custom'); if (p.stage === 'draft') { p.spec.tpl = el.dataset.tpl; p.step = 0; } save(); go('builder-custom'); };
ACTIONS.openSub = el => { const c = cat(el.dataset.cat); const s = c.subs.find(x => x.id === el.dataset.sub);
  if (s.builder === 'builder-table') { proj('p-table').spec.mode = s.mode || 'finished'; save(); go('builder-table'); return; }
  if (s.builder === 'builder-custom') { const p = proj('p-custom'); if (p.stage === 'draft') { p.spec.tpl = s.tpl; p.step = 0; } save(); go('builder-custom'); return; }
  if (s.builder) { go(s.builder); return; }
  const p = proj('p-custom'); if (p.stage === 'draft') { p.spec.tpl = 'other'; p.spec.vals.desc = p.spec.vals.desc || (isAr() ? s.ar : s.en) + ' — '; p.step = 0; } save(); go('builder-custom');
  toast(tx(`No dedicated builder for ${s.en} yet — using the general template.`, `لسه مفيش نموذج مخصوص لـ ${s.ar} — بنستخدم القالب العام.`), 'info'); };
ACTIONS.openProject = el => { S.current = el.dataset.id; save(); const to = el.dataset.to; if (to === 'reorder') { ACTIONS.reorder(el); return; } go(to); };
ACTIONS.reorder = el => { const src = proj(el.dataset.id); const p = proj('p-custom');
  if (src.id === 'p-nuts') { toast(tx('Reorder: in production this clones the approved spec, plates and sample record into a new RFQ to the same and competing suppliers.', 'إعادة الطلب: في النسخة الفعلية بتنسخ المواصفات والأكلاشيهات وسجل العينة في طلب جديد لنفس المورد ومنافسين.'), 'repeat'); return; }
  p.spec = JSON.parse(JSON.stringify(src.spec)); p.spec.date = ''; p.title = { en: src.title.en + ' — reorder', ar: src.title.ar + ' — إعادة طلب' }; p.cat = src.cat; p.sub = src.sub; p.stage = 'draft'; p.step = 0; p.invited = [];
  save(); go('builder-custom'); toast(tx('Previous specification copied. Pick a new delivery date and send.', 'المواصفات القديمة اتنسخت. اختار تاريخ تسليم جديد وابعت.'), 'repeat'); };
ACTIONS.toggleSave = el => { const id = el.dataset.id; const i = S.saved.indexOf(id); i >= 0 ? S.saved.splice(i, 1) : S.saved.push(id); save(); render(true); toast(i >= 0 ? tx('Removed from saved', 'اتشال من المحفوظات') : tx('Supplier saved', 'المورد اتحفظ'), 'bookmark'); };
ACTIONS.clearSup = () => { S.ui.sup = { q: '', cat: 'all', gov: 'all', maxMoq: '', verified: false, savedOnly: false }; save(); render(true); };
ACTIONS.catFilter = el => { const k = el.dataset.cat; const i = Number(el.dataset.i); const a = new Set(S.ui.catFilters[k] || []); el.checked ? a.add(i) : a.delete(i); S.ui.catFilters[k] = [...a]; save(); render(true); };
ACTIONS.clearCatFilter = el => { S.ui.catFilters[el.dataset.cat] = []; save(); render(true); };

render();
