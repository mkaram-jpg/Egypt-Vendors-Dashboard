/* Nawah prototype — Pricing & launch kit: unit economics, recommended price list, offers, differentiation, sales channels.
   All costs, market references and platform fees here are ILLUSTRATIVE planning assumptions unless taken from a real quote in the project. */
'use strict';

function econ() { return (S.econ ??= { prod: 'nuts', margin: 25, channel: 'noon', price: {}, over: {}, offers: [] }); }
const NUTS_PACK = () => Number(proj('p-nuts').spec.packG) || 200;

/* components: [en, ar, cost per unit EGP (ex VAT), qty note en, qty note ar] — max 6 per product */
const ECON = {
  nuts: { en: 'Mixed nuts pouch', ar: 'كيس مكسرات مشكلة', item: 'nuts-pouch', unit: () => tx(`${NUTS_PACK()} g pack`, `كيس ${NUTS_PACK()} جم`), scale: () => NUTS_PACK() / 200, feeScale: 1, perOrder: 3,
    comps: [['Nuts (raw material)', 'المكسرات (الخامة)', 50, '≈ EGP 250/kg blend', '≈ ٢٥٠ ج.م/كجم للخلطة'], ['Roasting & seasoning', 'التحميص والتتبيل', 6, 'toll processing', 'تشغيل لدى الغير'], ['Stand-up zip pouch', 'كيس واقف بسوستة', 6.5, '1 pouch', 'كيس واحد'], ['Printing (plates spread over run)', 'الطباعة (الأكلاشيه موزّع)', 3, '4 colours', '٤ ألوان'], ['Outer carton & handling', 'كرتونة خارجية وتداول', 1.5, '1/24 carton', '١/٢٤ كرتونة'], ['Transport to your store', 'النقل لمخزنك', 3, 'Greater Cairo', 'القاهرة الكبرى']],
    market: [110, 150, 210] },
  dish: { en: 'Dishwashing liquid 750 ml', ar: 'سائل أطباق ٧٥٠ مل', item: 'dish', unit: () => tx('750 ml bottle', 'عبوة ٧٥٠ مل'), scale: () => 1, feeScale: 1, perOrder: 4,
    comps: [['Liquid (manufacturer’s formula)', 'السائل (تركيبة المصنع)', 10, 'per 750 ml', 'لكل ٧٥٠ مل'], ['Filling & processing', 'التعبئة والتشغيل', 2, '', ''], ['Bottle + flip cap', 'العبوة + الغطا', 6, 'PET + PP', 'PET + PP'], ['Front & back labels', 'ليبل أمامي وخلفي', 1, '', ''], ['Shipper carton share', 'نصيب الكرتونة', 0.5, '1/12 carton', '١/١٢ كرتونة'], ['Transport to your store', 'النقل لمخزنك', 1, '', '']],
    market: [32, 48, 70] },
  table: { en: 'Solid beech dining table', ar: 'ترابيزة سفرة زان طبيعي', item: 'dining', unit: () => tx('1 table', 'ترابيزة واحدة'), scale: () => 1, feeScale: 8, perOrder: 1,
    comps: [['Beech timber', 'خشب زان', 2900, '≈ 0.09 m³', '≈ ٠٫٠٩ م³'], ['Legs & hardware', 'أرجل وإكسسوارات', 280, '', ''], ['PU lacquer finish', 'دهان PU', 380, '', ''], ['Labour & machining', 'مصنعية وتشغيل', 1900, '', ''], ['Protective packing', 'تغليف حماية', 220, '', ''], ['Delivery to your showroom', 'التوصيل لمعرضك', 350, '', '']],
    market: [7000, 11000, 16000] },
  tshirt: { en: 'Printed cotton T-shirt', ar: 'تيشيرت قطن مطبوع', item: 'tshirt', unit: () => tx('1 T-shirt', 'تيشيرت واحد'), scale: () => 1, feeScale: 1, perOrder: 1.5,
    comps: [['Cotton fabric 180 GSM', 'قماش قطن ١٨٠ جم', 55, '≈ 0.25 kg', '≈ ٠٫٢٥ كجم'], ['Cut & sew', 'قص وخياطة', 38, '', ''], ['Screen print', 'طباعة سلك سكرين', 22, '1 colour, chest', 'لون واحد، صدر'], ['Neck label & hang tag', 'ليبل رقبة وتاج', 6, '', ''], ['Folding & polybag', 'تطبيق وكيس', 3, '', ''], ['Transport to your store', 'النقل لمخزنك', 4, '', '']],
    market: [299, 449, 699] },
  coffee: { en: 'Turkish coffee 250 g', ar: 'بن تركي ٢٥٠ جم', item: 'coffee', unit: () => tx('250 g bag', 'كيس ٢٥٠ جم'), scale: () => 1, feeScale: 1, perOrder: 2,
    comps: [['Coffee beans & roasting', 'بن وتحميص', 85, 'blend', 'خلطة'], ['Cardamom', 'حبهان', 9, '', ''], ['Pouch with valve', 'كيس بصمام', 10, '', ''], ['Printing', 'الطباعة', 3.5, '', ''], ['Grinding & packing', 'الطحن والتعبئة', 6, '', ''], ['Transport to your store', 'النقل لمخزنك', 3, '', '']],
    market: [180, 240, 320] }
};
/* Channel fee levels are planning assumptions — NOT the platforms' published rates. */
const CHANNELS = [
  { id: 'own', en: 'Own online store', ar: 'متجرك الإلكتروني', comm: 0, pay: .03, mkt: .12, fee: 25, conn: 'Shopify / WooCommerce', sync: ['catalog', 'stock', 'orders'] },
  { id: 'social', en: 'Instagram & WhatsApp (cash on delivery)', ar: 'إنستجرام وواتساب (دفع عند الاستلام)', comm: 0, pay: 0, mkt: .15, fee: 35, conn: 'Meta Commerce · WhatsApp Business', sync: ['catalog'] },
  { id: 'amazon', en: 'Amazon.eg', ar: 'أمازون مصر', comm: .10, pay: 0, mkt: .05, fee: 28, conn: 'Seller API', sync: ['catalog', 'stock', 'orders'] },
  { id: 'noon', en: 'Noon', ar: 'نون', comm: .10, pay: 0, mkt: .05, fee: 25, conn: 'Seller API', sync: ['catalog', 'stock', 'orders'] },
  { id: 'jumia', en: 'Jumia', ar: 'جوميا', comm: .12, pay: 0, mkt: .04, fee: 22, conn: 'Vendor API', sync: ['catalog', 'stock', 'orders'] },
  { id: 'qcom', en: 'Quick commerce (e.g. Breadfast, Talabat Mart)', ar: 'توصيل سريع (زي بريدفاست وطلبات مارت)', comm: .25, pay: 0, mkt: .02, fee: 0, conn: 'Supplier onboarding (no public API assumed)', sync: ['catalog'] },
  { id: 'retail', en: 'Supermarket chains', ar: 'سلاسل السوبر ماركت', comm: .28, pay: 0, mkt: .03, fee: 3, conn: 'Buyer meeting · listing agreement', sync: [] }
];
const SLOT = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)'];

const TIPS = {
  nuts: [['Print the roast date on every pack — freshness is visible proof.', 'اطبع تاريخ التحميص على كل كيس — الطزاجة دليل واضح.'], ['Signature Egyptian flavours: dukkah, chili-lime, honey-sesame.', 'نكهات مصرية مميزة: دقة، شطة وليمون، عسل وسمسم.'], ['30 g portion packs for gyms, offices and cafés.', 'عبوات ٣٠ جم للجيم والمكاتب والكافيهات.'], ['Clear window + zipper so buyers see and reseal.', 'شباك شفاف وسوستة عشان العميل يشوف ويقفل.']],
  dish: [['A refill pouch lowers price per litre and builds repeat buys.', 'كيس ريفيل بيقلل سعر اللتر وبيخلي العميل يرجع.'], ['A scent line-up (lemon, apple, lavender) instead of one SKU.', 'تشكيلة روايح بدل منتج واحد.'], ['No-drip cap and a grip-friendly bottle shape.', 'غطا مبيسربش وعبوة سهلة المسك.'], ['Concentration claims only with the manufacturer’s test evidence.', 'ادعاءات التركيز بس لو المصنع عنده اختبارات تثبتها.']],
  table: [['Made-to-measure in three standard sizes.', 'مقاسات حسب الطلب في ٣ مقاسات أساسية.'], ['Damietta craftsmanship story with maker photos.', 'قصة الصنعة الدمياطي بصور الصنايعية.'], ['A written warranty agreed with the manufacturer.', 'ضمان مكتوب متفق عليه مع المصنع.'], ['Flat-pack with tool-free assembly cuts delivery cost.', 'تصميم مفكك يتركب من غير عدة بيقلل تكلفة التوصيل.']],
  tshirt: [['Limited drops with Arabic typography.', 'كوليكشنات محدودة بخط عربي.'], ['Heavier 220 GSM option for a premium feel.', 'اختيار قماش ٢٢٠ جم لإحساس فاخر.'], ['Size guide based on real Egyptian measurements.', 'دليل مقاسات مبني على مقاسات مصرية حقيقية.'], ['Free first exchange to remove sizing risk.', 'أول استبدال مجاني عشان العميل ميقلقش من المقاس.']],
  coffee: [['Roast date and grind date on the bag.', 'تاريخ التحميص والطحن على الكيس.'], ['Cardamom levels: light, medium, strong.', 'درجات الحبهان: خفيف، وسط، تقيل.'], ['Monthly subscription with a small saving.', 'اشتراك شهري بتوفير بسيط.'], ['Rotating single-origin limited editions.', 'إصدارات محدودة من منشأ واحد بالتناوب.']]
};
const OFFERS = [
  { id: 'launch', en: 'Launch discount 15%', ar: 'خصم افتتاح ١٥٪', disc: .15, units: 1, extra: 0, when: ['First 4 weeks to get reviews and trial.', 'أول ٤ أسابيع عشان تجيب تقييمات وتجربة.'] },
  { id: 'bundle', en: 'Bundle of 3 — 10% off', ar: 'باقة ٣ قطع — خصم ١٠٪', disc: .10, units: 3, extra: 0, when: ['Raises order size; the delivery fee is shared by 3 units.', 'بيكبّر الطلب؛ ورسوم التوصيل بتتقسم على ٣ قطع.'] },
  { id: 'subscribe', en: 'Subscribe & save 10%', ar: 'اشترك ووفّر ١٠٪', disc: .10, units: 1, extra: 0, only: ['own', 'social'], when: ['Repeat products (nuts, coffee, cleaning) on your own store.', 'للمنتجات المتكررة على متجرك.'] },
  { id: 'freeship', en: 'Free delivery', ar: 'توصيل مجاني', disc: 0, units: 1, extra: 20, when: ['Use above a minimum order; you absorb the courier cost.', 'استخدمه فوق حد أدنى للطلب؛ إنت بتتحمل تكلفة الشحن.'] },
  { id: 'gift', en: 'Free branded gift', ar: 'هدية بالبراند', disc: 0, units: 1, extra: 12, when: ['Social media launches and influencer boxes.', 'إطلاق على السوشيال وبوكسات المؤثرين.'] }
];

/* ---------- maths ---------- */
function quoteBasis() { if (!S.quotesArrived) return null; const id = S.accepted || S.sample.supplier || S.shortlist[0]; return id && S.quotes[id] ? id : null; }
function components(key) {
  const E = ECON[key]; const ov = econ().over[key] || {};
  if (key === 'nuts') { const qid = quoteBasis(); if (qid) { const n = normQuote(qid); const s = proj('p-nuts').spec; const f = (s.packG / 1000) / n.kg; const ex = n.q.vatIncluded ? 1 / 1.14 : 1;
    return { src: qid, list: [['Nuts + roasting (from quote)', 'المكسرات + التحميص (من العرض)', n.product * f * ex], ['Pouch & printing (from quote)', 'الكيس والطباعة (من العرض)', n.packaging * f * ex], ['Setup / plates ÷ quantity', 'التجهيز / الأكلاشيه ÷ الكمية', n.q.setup * f * ex], ['Delivery ÷ quantity', 'التوصيل ÷ الكمية', n.delivery * f * ex], ['Sample (not deducted) ÷ quantity', 'العينة (مش مخصومة) ÷ الكمية', n.sampleNet * f * ex], ['Storage & handling (your estimate)', 'التخزين والتداول (تقديرك)', ov.h !== undefined && ov.h !== '' ? Number(ov.h) : 1.5]].filter((c, i) => c[2] > 0 || i === 5) }; } }
  return { src: null, list: E.comps.map((c, i) => [c[0], c[1], ov[i] !== undefined && ov[i] !== '' ? Number(ov[i]) : +(c[2] * E.scale()).toFixed(2), c[3], c[4]]) };
}
const landed = key => components(key).list.reduce((a, c) => a + (Number(c[2]) || 0), 0);
const marketRef = key => ECON[key].market.map(v => v * ECON[key].scale());
const kOf = ch => ch.comm + ch.pay + ch.mkt;
function chFee(ch, key, units = 1) { return (ch.fee * ECON[key].feeScale) / ((ECON[key].perOrder || 1) * units); }
function netAt(P, ch, key, opt = {}) { const L = landed(key); const rev = P / (1 + VAT); const net = rev - P * kOf(ch) - chFee(ch, key, opt.units || 1) - L - (opt.extra || 0) * ECON[key].feeScale; return { net, pct: rev > 0 ? net / rev : 0 }; }
function requiredPrice(ch, key, m) { const d = (1 - m) / (1 + VAT) - kOf(ch); return d <= 0 ? null : (landed(key) + chFee(ch, key)) / d; }
function psych(p) { const st = p >= 1000 ? 100 : p >= 50 ? 5 : 0; if (!st) return Math.ceil(p); let r = Math.ceil(p / st) * st - 1; if (r < p) r += st; return r; }
function suggest(ch, key) { const m = econ().margin / 100; const req = requiredPrice(ch, key, m); const [lo, mid, hi] = marketRef(key);
  if (req == null) return { price: null, pos: 'na', req };
  if (req <= mid) return { price: psych(mid), pos: 'mid', req }; if (req <= hi) return { price: psych(req), pos: 'upper', req }; return { price: psych(req), pos: 'above', req }; }
const myPrice = key => { const v = econ().price[key]; if (v) return Number(v); const s = suggest(CHANNELS.find(c => c.id === econ().channel), key); return s.price || psych(marketRef(key)[1]); };
const health = (pct, m) => (pct < 0 ? ['bad', tx('Loss', 'خسارة')] : pct < .10 ? ['bad', tx('Very thin', 'ضعيف جدًا')] : pct < m ? ['warn', tx('Below target', 'أقل من الهدف')] : ['ok', tx('Healthy', 'كويس')]);

/* ---------- view ---------- */
function launchBody(key, embedded) {
  econ(); const E = ECON[key]; const C = components(key); const qid = C.src;
  const prodChips = embedded ? '' : `<div class="row" role="group" aria-label="${tx('Product', 'المنتج')}" style="margin-bottom:16px">${Object.entries(ECON).map(([k, v]) => `<button class="chip-btn" data-act="econProd" data-k="${k}" aria-pressed="${k === key}">${L(v)}</button>`).join('')}</div>`;
  return `${prodChips}
  <div class="note ${qid ? 'ok' : ''}" style="margin-bottom:16px">${ic(qid ? 'check' : 'info')}<span>${qid ? tx(`Manufacturing cost is taken from your real quotation ${S.quotes[qid].ref} (${sup(qid).en}). Other figures are planning assumptions.`, `تكلفة التصنيع مأخوذة من عرض السعر الفعلي ${S.quotes[qid].ref} (${sup(qid).ar}). باقي الأرقام افتراضات للتخطيط.`)
    : tx('Illustrative demo assumptions. Edit any cost, or get real quotes — once quotes arrive, Nawah replaces these with your actual numbers.', 'افتراضات توضيحية للديمو. عدّل أي تكلفة، أو اطلب عروض حقيقية — أول ما العروض توصل، نواة بتحط أرقامك الفعلية مكانها.')}</span></div>
  <div class="grid" style="grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)" id="econ-top">
    <div class="card"><div class="card-head"><div><h2 style="font-size:1.2rem">${tx('What goes into each unit', 'إيه اللي جوه كل وحدة')}</h2><p class="faint">${L(E)} · ${E.unit()} · ${tx('EGP, excl. VAT', 'ج.م، من غير ضريبة')}</p></div></div>
      <div data-live="econBar" style="margin-bottom:14px"></div>
      <div class="table-wrap" style="border:0"><table class="list" style="min-width:420px"><thead><tr><th>${tx('Component', 'البند')}</th><th>${tx('Basis', 'الأساس')}</th><th style="text-align:end">${tx('Cost / unit', 'التكلفة / وحدة')}</th></tr></thead><tbody>
      ${C.list.map((c, i) => { const editable = !qid || i === C.list.length - 1; const path = `econ.over.${key}.${qid ? 'h' : i}`;
        return `<tr><td><span class="row" style="gap:8px"><i class="sw" style="background:${SLOT[i]}"></i>${isAr() ? c[1] : c[0]}</span></td><td class="faint small">${(isAr() ? c[4] : c[3]) || (qid && i < C.list.length - 1 ? tx('quote', 'العرض') : '')}</td>
        <td style="text-align:end">${editable ? `<input class="input num econ-in" type="number" min="0" step="0.5" data-bind="${path}" data-num value="${(+c[2]).toFixed(2).replace(/\.00$/, '')}" aria-label="${esc(isAr() ? c[1] : c[0])}">` : egp(c[2], 2)}</td></tr>`; }).join('')}
      <tr class="sel"><td colspan="2"><b>${tx('Landed cost per unit', 'التكلفة الواصلة للوحدة')}</b></td><td style="text-align:end"><b data-live="econTotal"></b></td></tr></tbody></table></div></div>
    <div class="card"><h2 style="font-size:1.2rem">${tx('Market reference & your price', 'سعر السوق وسعرك')}</h2><p class="faint" style="margin-top:2px">${tx('Shelf prices incl. VAT for similar products — demo reference, verify with a store check.', 'أسعار رف شاملة الضريبة لمنتجات مشابهة — مرجع تجريبي، اتأكد بزيارة للسوق.')}</p>
      <div data-live="econMarket" style="margin:14px 0"></div>
      <div class="grid g2"><div class="field"><label for="econ-price">${tx('Your shelf price (incl. VAT)', 'سعرك على الرف (شامل الضريبة)')}</label><div class="input-unit"><input id="econ-price" class="input num" type="number" min="1" step="1" data-bind="econ.price.${key}" data-num value="${myPrice(key)}"><span class="unit">${isAr() ? 'ج.م' : 'EGP'}</span></div></div>
      <div class="field"><label for="econ-margin">${tx('Target margin', 'هامش الربح المستهدف')}</label><div class="input-unit"><input id="econ-margin" class="input num" type="number" min="5" max="70" step="1" data-bind="econ.margin" data-num value="${econ().margin}"><span class="unit">%</span></div></div></div>
      <div data-live="econRec" style="margin-top:12px"></div></div>
  </div>

  <div class="card" style="margin-top:18px"><div class="card-head"><div><h2 style="font-size:1.2rem">${tx('Recommended price list by channel', 'قائمة الأسعار المقترحة لكل قناة بيع')}</h2><p class="faint">${tx(`Price needed for your ${econ().margin}% target margin after channel fees and 14% VAT, and what you keep at your shelf price. Delivery fees are split across an average order of ${ECON[key].perOrder} unit(s).`, `السعر اللازم عشان هامش ${econ().margin}٪ بعد رسوم القناة وضريبة ١٤٪، واللي بيفضلك بسعرك الحالي. رسوم التوصيل متقسمة على متوسط طلب ${ECON[key].perOrder} وحدة.`)}</p></div></div>
    <div class="table-wrap" style="border:0" data-live="econChannels"></div>
    <p class="faint" style="margin-top:8px">${tx('Channel fee levels are planning assumptions, not the platforms’ published rates. Check each platform’s current seller terms. Nawah is not affiliated with these platforms.', 'مستويات رسوم القنوات افتراضات للتخطيط، مش الأسعار الرسمية للمنصات. راجع شروط البائعين الحالية لكل منصة. نواة مش تابعة للمنصات دي.')}</p></div>

  <div class="grid g2" style="margin-top:18px" id="econ-bottom">
    <div class="card"><div class="card-head"><h2 style="font-size:1.2rem">${tx('Offers you can afford', 'عروض تقدر تعملها')}</h2>
      <label class="small row">${tx('Channel', 'القناة')} <select class="select" style="width:auto" data-bind="econ.channel">${CHANNELS.map(c => `<option value="${c.id}" ${econ().channel === c.id ? 'selected' : ''}>${L(c)}</option>`).join('')}</select></label></div>
      <div data-live="econOffers"></div></div>
    <div class="card"><h2 style="font-size:1.2rem">${tx('How to stand out', 'إزاي تبقى مختلف')}</h2>
      <ul class="checklist" style="margin-top:8px">${TIPS[key].map(t => `<li><span class="box" style="border-color:var(--accent)">${ic('sparkle')}</span>${isAr() ? t[1] : t[0]}</li>`).join('')}
      <li><span class="box" style="border-color:var(--accent)">${ic('sparkle')}</span>${tx('One consistent look on every channel — use the same design from Brand studio.', 'شكل واحد ثابت على كل القنوات — استخدم نفس تصميم استوديو البراند.')}</li></ul>
      <a class="btn btn-secondary btn-sm" href="#studio" style="margin-top:10px">${ic('wand')} ${tx('Open brand studio', 'افتح استوديو البراند')}</a>
      <p class="faint" style="margin-top:10px">${tx('Any health, origin or performance claim must be backed by the manufacturer’s documents.', 'أي ادعاء صحي أو عن المنشأ أو الأداء لازم يكون عليه مستندات من المصنع.')}</p></div></div>

  <div class="card" style="margin-top:18px"><div class="card-head"><div><h2 style="font-size:1.2rem">${tx('Sell online — channel connections', 'بيع أونلاين — ربط قنوات البيع')}</h2><p class="faint">${tx('Planned integrations. Nothing is connected in this demo; you can already generate a ready listing.', 'ربط مخطط. مفيش أي حاجة متوصلة في الديمو؛ بس تقدر تجهز إعلان المنتج من دلوقتي.')}</p></div>
      <button class="btn btn-primary btn-sm" data-act="listing" data-k="${key}">${ic('file')} ${tx('Generate product listing', 'جهّز إعلان المنتج')}</button></div>
    <div class="grid g3">${CHANNELS.map(c => `<div class="card-flat stack" style="gap:8px"><div class="row-between"><b>${L(c)}</b><span class="pill">${tx('Planned', 'مخطط')}</span></div>
      <span class="faint small">${esc(c.conn)}</span><div class="match">${c.sync.length ? c.sync.map(s => `<span>${{ catalog: tx('Catalogue sync', 'مزامنة المنتجات'), stock: tx('Stock sync', 'مزامنة المخزون'), orders: tx('Orders import', 'استيراد الطلبات') }[s]}</span>`).join('') : `<span>${tx('Manual / offline', 'يدوي / أوفلاين')}</span>`}</div>
      <button class="btn btn-secondary btn-sm" data-act="connectCh" data-id="${c.id}" style="align-self:flex-start">${ic('globe')} ${tx('Connect', 'اربط')}</button></div>`).join('')}</div></div>
  <style>@media (max-width:900px){#econ-top,#econ-bottom{grid-template-columns:minmax(0,1fr)!important}}</style>`;
}
VIEWS.launch = () => { const key = econ().prod; return `<div class="wrap section">${crumbs([[tx('Home', 'الرئيسية'), 'home'], [tx('Pricing & launch', 'التسعير والإطلاق')]])}
  <h1>${tx('Pricing & launch kit', 'التسعير وخطة الإطلاق')}</h1><p class="muted" style="margin:8px 0 18px;max-width:72ch">${tx('Know exactly what you pay for: raw materials, packaging, printing and transport per unit — then a recommended price for each sales channel, offers you can afford, and how to stand out.', 'اعرف بالظبط إنت بتدفع في إيه: الخامات والتغليف والطباعة والنقل لكل وحدة — وبعدين سعر مقترح لكل قناة بيع، وعروض تقدر عليها، وإزاي تبقى مختلف.')}</p>
  ${launchBody(key)}</div>`; };
function projKey(p) { return p.id === 'p-nuts' ? 'nuts' : p.id === 'p-dish' ? 'dish' : p.id === 'p-table' ? 'table' : p.spec.tpl === 'coffee' ? 'coffee' : p.spec.tpl === 'tshirt' ? 'tshirt' : 'nuts'; }
VIEWS['project-launch'] = r => wsShell(r, tx('Pricing & launch', 'التسعير والإطلاق'), launchBody(projKey(proj()), true));

/* ---------- live partials ---------- */
const curKey = () => (currentRoute() === 'project-launch' ? projKey(proj()) : econ().prod);
PARTIALS.econTotal = () => egp(landed(curKey()), 2);
PARTIALS.econBar = () => { const key = curKey(); const list = components(key).list; const T = landed(key) || 1;
  return `<div class="stackbar" role="img" aria-label="${tx('Cost composition', 'تكوين التكلفة')}">${list.map((c, i) => { const v = Number(c[2]) || 0; return v > 0 ? `<span style="flex:${v};background:${SLOT[i]}" title="${esc(isAr() ? c[1] : c[0])}: ${egpT(v, 2)} (${Math.round(v / T * 100)}%)"></span>` : ''; }).join('')}</div>
  <div class="legend">${list.map((c, i) => `<span><i class="sw" style="background:${SLOT[i]}"></i>${isAr() ? c[1] : c[0]} <b class="num">${Math.round((Number(c[2]) || 0) / T * 100)}%</b></span>`).join('')}</div>`; };
PARTIALS.econMarket = () => { const key = curKey(); const [lo, mid, hi] = marketRef(key); const P = myPrice(key); const Lc = landed(key) * (1 + VAT);
  const min = Math.min(lo * .75, Lc * .9), max = Math.max(hi * 1.15, P * 1.05); const x = v => ((v - min) / (max - min) * 100).toFixed(1) + '%';
  return `<div class="mband"><div class="mtrack"><span class="seg" style="left:${x(lo)};width:calc(${x(mid)} - ${x(lo)})"></span><span class="seg s2" style="left:${x(mid)};width:calc(${x(hi)} - ${x(mid)})"></span>
    <span class="mk cost" style="left:${x(Lc)}" title="${tx('Landed cost incl. VAT', 'التكلفة شاملة الضريبة')}"></span><span class="mk you" style="left:${x(P)}"></span></div>
    <div class="mlabels"><span style="left:${x(lo)}">${tx('Economy', 'اقتصادي')}<br><b>${egp(lo)}</b></span><span style="left:${x(mid)}">${tx('Mainstream', 'متوسط')}<br><b>${egp(mid)}</b></span><span style="left:${x(hi)}">${tx('Premium', 'فاخر')}<br><b>${egp(hi)}</b></span></div>
    <div class="legend" style="margin-top:34px"><span><i class="sw" style="background:var(--ink-3)"></i>${tx('Your cost incl. VAT', 'تكلفتك شاملة الضريبة')} ${egp(Lc, 2)}</span><span><i class="sw" style="background:var(--brand)"></i>${tx('Your price', 'سعرك')} ${egp(P)}</span></div></div>`; };
PARTIALS.econRec = () => { const key = curKey(); const ch = CHANNELS.find(c => c.id === econ().channel); const s = suggest(ch, key); const P = myPrice(key); const n = netAt(P, ch, key); const h = health(n.pct, econ().margin / 100);
  const posTxt = { mid: tx('at the mainstream market price — room above your target margin', 'على سعر السوق المتوسط — فيه مساحة فوق هامشك المستهدف'), upper: tx('between mainstream and premium — make the premium visible', 'بين المتوسط والفاخر — لازم الفخامة تبان'), above: tx('above the premium band — cut costs or differentiate strongly', 'فوق الفئة الفاخرة — قلّل التكاليف أو اتميّز بقوة'), na: tx('not reachable on this channel at this margin', 'مش ممكن على القناة دي بالهامش ده') }[s.pos];
  return `<div class="card-flat"><div class="row-between"><span class="small">${tx('Recommended on', 'المقترح على')} <b>${L(ch)}</b></span>${s.price ? `<b style="font-family:var(--f-display);font-size:1.3rem">${egp(s.price)}</b>` : '—'}</div><p class="faint" style="margin-top:4px">${posTxt}</p>
    <div class="row-between" style="margin-top:10px"><span class="small">${tx('At your price you keep', 'بسعرك بيفضلك')} <b>${egp(n.net, 2)}</b> ${tx('per unit', 'للوحدة')}</span><span class="pill ${h[0]}">${Math.round(n.pct * 100)}% · ${h[1]}</span></div>
    ${s.price && P !== s.price ? `<button class="btn btn-ghost btn-sm" data-act="usePrice" data-k="${key}" data-p="${s.price}" style="margin-top:6px">${tx('Use recommended price', 'استخدم السعر المقترح')}</button>` : ''}</div>`; };
PARTIALS.econChannels = () => { const key = curKey(); const m = econ().margin / 100; const P = myPrice(key);
  return `<table class="list"><thead><tr><th>${tx('Channel', 'القناة')}</th><th>${tx('Fees (assumed)', 'الرسوم (افتراض)')}</th><th style="text-align:end">${tx('Min. price for target', 'أقل سعر للهدف')}</th><th style="text-align:end">${tx('Recommended', 'المقترح')}</th><th style="text-align:end">${tx('You keep at', 'بيفضلك بسعر')} ${egpT(P)}</th><th>${tx('Margin', 'الهامش')}</th></tr></thead><tbody>
  ${CHANNELS.map(c => { const s = suggest(c, key); const n = netAt(P, c, key); const h = health(n.pct, m); return `<tr ${c.id === econ().channel ? 'class="sel"' : ''}><td><b>${L(c)}</b></td><td class="small faint"><span class="ltr">${Math.round(kOf(c) * 100)}% + ${egpT(chFee(c, key), 2)}</span> ${tx('/unit', '/وحدة')}</td>
    <td style="text-align:end">${s.req ? egp(s.req, 2) : '—'}</td><td style="text-align:end">${s.price ? egp(s.price) : '—'}${s.pos === 'above' ? `<br><span class="pill warn">${tx('Above market', 'فوق السوق')}</span>` : ''}</td><td style="text-align:end">${egp(n.net, 2)}</td><td><span class="pill ${h[0]}">${Math.round(n.pct * 100)}%</span></td></tr>`; }).join('')}</tbody></table>`; };
PARTIALS.econOffers = () => { const key = curKey(); const ch = CHANNELS.find(c => c.id === econ().channel); const P = myPrice(key); const m = econ().margin / 100;
  return OFFERS.filter(o => !o.only || o.only.includes(ch.id)).map(o => { const eff = P * (1 - o.disc); const n = netAt(eff, ch, key, { units: o.units, extra: o.extra }); const h = health(n.pct, m); const on = econ().offers.includes(o.id);
    return `<div class="row-between" style="padding:10px 0;border-bottom:1px solid var(--line);align-items:flex-start"><div class="grow"><b>${L(o)}</b><br><span class="faint small">${isAr() ? o.when[1] : o.when[0]}</span><br><span class="small">${tx('Effective price', 'السعر الفعلي')} ${egp(eff, 2)} · ${tx('you keep', 'بيفضلك')} ${egp(n.net, 2)}</span></div>
      <div class="stack" style="gap:6px;align-items:flex-end"><span class="pill ${h[0]}">${Math.round(n.pct * 100)}% · ${h[1]}</span><button class="btn btn-sm ${on ? 'btn-primary' : 'btn-secondary'}" data-act="toggleOffer" data-id="${o.id}" aria-pressed="${on}">${on ? ic('check') + ' ' + tx('In plan', 'في الخطة') : tx('Add to plan', 'أضف للخطة')}</button></div></div>`; }).join('');
};

/* ---------- listing generator ---------- */
function listingText(key, lang) {
  const E = ECON[key]; const b = S.brand?.name?.trim() || (lang === 'ar' ? 'علامتك' : 'Your Brand'); const P = myPrice(key); const t = S.brand?.tagline?.trim();
  const tips = TIPS[key].slice(0, 3).map(x => '• ' + (lang === 'ar' ? x[1] : x[0])).join('\n');
  return lang === 'ar'
    ? `العنوان: ${b} — ${E.ar}\nالسعر: ${nf(P)} ج.م (شامل الضريبة)\n${t ? 'الشعار: ' + t + '\n' : ''}المميزات:\n${tips}\nالوصف: ${E.ar} من ${b}، متصنّع في مصر لدى مصنع متراجع على نواة.\nكود المنتج (SKU): ${key.toUpperCase()}-001\nالباركود: مطلوب باركود GS1 قبل الرفع على المنصات`
    : `Title: ${b} — ${E.en}\nPrice: EGP ${nf(P)} (incl. VAT)\n${t ? 'Tagline: ' + t + '\n' : ''}Highlights:\n${tips}\nDescription: ${E.en} by ${b}, made in Egypt with a Nawah-reviewed manufacturer.\nSKU: ${key.toUpperCase()}-001\nBarcode: a GS1 barcode is required before listing on marketplaces`;
}
ACTIONS.listing = el => { const key = el.dataset.k;
  openModal(`<div class="row-between"><h2>${tx('Product listing draft', 'مسودة إعلان المنتج')}</h2><button class="icon-btn" data-act="closeModal" aria-label="${tx('Close', 'إغلاق')}">${ic('x')}</button></div>
  <p class="faint" style="margin:6px 0 14px">${tx('Drafted from your product, brand and price. Edit before using; marketplaces each have their own content rules.', 'مكتوب من منتجك والبراند والسعر. عدّله قبل الاستخدام؛ كل منصة ليها قواعدها.')}</p>
  <div class="studio-grid" style="margin-top:0"><div class="studio-big" style="aspect-ratio:auto;max-height:320px">${typeof mockup === 'function' ? mockup(pitem(ECON[key].item)) : ''}</div>
  <div class="stack"><label class="small" for="lst-ar"><b>العربية</b></label><textarea id="lst-ar" class="textarea" dir="rtl" style="min-height:150px">${esc(listingText(key, 'ar'))}</textarea>
  <label class="small" for="lst-en"><b>English</b></label><textarea id="lst-en" class="textarea" dir="ltr" style="min-height:150px">${esc(listingText(key, 'en'))}</textarea>
  <div class="row" style="justify-content:flex-end"><button class="btn btn-secondary" data-act="copyListing">${tx('Copy both', 'انسخ الاتنين')}</button></div></div></div>`, true); };
ACTIONS.copyListing = () => { const t = document.getElementById('lst-ar').value + '\n\n' + document.getElementById('lst-en').value; const fb = () => { document.getElementById('lst-en').select(); toast(tx('Select and copy manually', 'حدد وانسخ يدويًا'), 'info'); };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(t).then(() => toast(tx('Listing copied', 'الإعلان اتنسخ')), fb); else fb(); };
ACTIONS.connectCh = el => { const c = CHANNELS.find(x => x.id === el.dataset.id);
  openModal(`<h2>${tx('Connect', 'ربط')} ${L(c)}</h2><span class="pill" style="margin-top:8px">${tx('Planned integration — not connected', 'ربط مخطط — غير متصل')}</span>
  <p class="muted" style="margin-top:12px">${tx('What this connection will do:', 'الربط ده هيعمل إيه:')}</p><ul class="small">${(c.sync.length ? c.sync : ['manual']).map(s => `<li>${{ catalog: tx('Publish your product, photos and price from Nawah', 'ينشر منتجك وصوره وسعره من نواة'), stock: tx('Keep stock in sync with your deliveries', 'يظبط المخزون مع شحناتك'), orders: tx('Bring orders back to plan your reorders', 'يرجّع الطلبات عشان تخطط إعادة الطلب'), manual: tx('Prepare a listing pack for the buyer meeting', 'يجهز ملف المنتج لاجتماع المشتري') }[s]}</li>`).join('')}</ul>
  <p class="muted" style="margin-top:8px">${tx('What you need first:', 'محتاج الأول:')}</p><ul class="small"><li>${tx('Your own seller account on the platform', 'حساب بائع باسمك على المنصة')}</li><li>${tx('Commercial registry, tax card and GS1 barcodes', 'سجل تجاري وبطاقة ضريبية وباركود GS1')}</li><li>${tx('Platform approval of API access (where offered)', 'موافقة المنصة على الربط (لو متاح)')}</li></ul>
  <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-secondary" data-act="closeModal">${tx('Close', 'إغلاق')}</button><button class="btn btn-primary" data-act="notifyCh" data-id="${c.id}">${tx('Notify me when available', 'بلّغني لما يبقى متاح')}</button></div>`); };
ACTIONS.notifyCh = el => { const c = CHANNELS.find(x => x.id === el.dataset.id); closeModal(); notify(`You will be notified when the ${c.en} connection is available.`, `هنبلغك لما ربط ${c.ar} يبقى متاح.`, 'globe'); save(); toast(tx('Saved — we will let you know (demo).', 'اتسجل — هنبلغك (تجريبي).'), 'globe'); };
ACTIONS.econProd = el => { econ().prod = el.dataset.k; save(); render(true); };
ACTIONS.usePrice = el => { econ().price[el.dataset.k] = Number(el.dataset.p); save(); render(true); };
ACTIONS.toggleOffer = el => { const o = econ().offers; const i = o.indexOf(el.dataset.id); i >= 0 ? o.splice(i, 1) : o.push(el.dataset.id); save(); refreshPartials(); };
