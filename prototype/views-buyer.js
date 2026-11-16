/* Nawah prototype — buyer-facing pages. */
'use strict';

function catCard(c) {
  const kind = { finished: tx('Finished products', 'منتجات نهائية'), packaging: tx('Packaging', 'تغليف'), raw: tx('Raw materials', 'خامات'), custom: tx('Custom', 'طلب خاص') }[c.kind];
  return `<a class="cat-card" href="#cat-${c.id}" style="--cat:${c.hue}">
    <div class="cat-art"><span class="pill kind">${kind}</span>${ic(c.icon, 'big')}</div>
    <div class="cat-body"><h3>${L(c)}</h3><p class="small muted">${isAr() ? c.dar : c.den}</p>
    <p class="subs">${c.subs.slice(0, 5).map(L).join(' · ')}${c.subs.length > 5 ? ' …' : ''}</p></div></a>`;
}

VIEWS.home = () => {
  const p = proj('p-nuts');
  const steps = [
    ['Describe your product', 'اوصف منتجك', p.stage !== 'draft' || p.step > 0],
    ['Get comparable quotes', 'استلم عروض قابلة للمقارنة', S.quotesArrived],
    ['Approve a sample', 'اعتمد عينة', S.sample.status === 'approved'],
    ['Track production to delivery', 'تابع الإنتاج لحد التسليم', p.stage === 'delivered']
  ];
  return `
  <section class="hero"><div class="wrap hero-grid">
    <div>
      <p class="eyebrow">${tx('Product sourcing for Egyptian brands', 'تصنيع وتوريد للبراندات المصرية')}</p>
      <h1 style="margin-top:10px">${tx('Turn your product idea into stock on the shelf.', 'حوّل فكرة منتجك لبضاعة جاهزة على الرف.')}</h1>
      <p class="lead">${tx('Nawah helps you specify your product, reach suitable manufacturers and suppliers, compare like-for-like quotations, approve samples and follow production through delivery.',
        'نواة بتساعدك تحدد مواصفات منتجك، توصل لمصانع وموردين مناسبين، تقارن عروض أسعار على نفس الأساس، تعتمد العينة، وتتابع الإنتاج لحد ما البضاعة توصلك.')}</p>
      <div class="cta-grid">
        <a class="cta primary" href="#start">${ic('sparkle')}<span><b>${tx('Start my product', 'ابدأ منتجك')}</b><span class="s">${tx('Guided, step by step', 'خطوة بخطوة')}</span></span></a>
        <a class="cta" href="#suppliers">${ic('factory')}<span><b>${tx('Find a manufacturer', 'ابحث عن مصنع')}</b><span class="s">${tx('Filter by category & MOQ', 'فلترة بالقسم والحد الأدنى')}</span></span></a>
        <a class="cta" href="#cat-raw">${ic('layers')}<span><b>${tx('Source materials', 'اطلب خامات')}</b><span class="s">${tx('Ingredients, timber, fabric', 'مكونات، خشب، أقمشة')}</span></span></a>
        <button class="cta" data-act="joinSupplier">${ic('user')}<span><b>${tx('Join as a supplier', 'انضم كمورد')}</b><span class="s">${tx('Receive matching RFQs', 'استقبل طلبات مناسبة')}</span></span></button>
      </div>
    </div>
    <div class="journey-card">
      <div class="row-between"><div><p class="eyebrow">${tx('Demo project', 'مشروع تجريبي')}</p><h3 style="margin-top:4px">${L(p.title)}</h3></div>${stagePill(p.stage)}</div>
      <div class="calc" style="margin:14px 0 6px"><span>${nf(p.spec.packs || 0)} packs × ${nf(p.spec.packG || 0)} g =</span><b>${nf((p.spec.packs || 0) * (p.spec.packG || 0) / 1000, 1)} kg</b></div>
      <p class="faint">${tx('Illustrative calculation of finished product to be quoted.', 'حساب توضيحي لكمية المنتج النهائي المطلوب تسعيرها.')}</p>
      <div style="margin-top:10px">${steps.map((s, i) => `<div class="journey-step ${s[2] ? 'done' : ''}"><span class="n">${s[2] ? ic('check') : i + 1}</span><span>${isAr() ? s[1] : s[0]}</span>${s[2] ? `<span class="pill ok">${tx('Done', 'تم')}</span>` : ''}</div>`).join('')}</div>
      <button class="btn btn-primary" style="width:100%;margin-top:12px" data-act="continueDemo">${tx('Continue the nuts-brand demo', 'كمّل ديمو براند المكسرات')} ${ic('arrow', 'flip')}</button>
    </div>
  </div></section>

  <section class="section-tight"><div class="wrap">
    <div class="row-between" style="margin-bottom:16px"><div><h2>${tx('What can I create here?', 'أقدر أعمل إيه هنا؟')}</h2><p class="muted">${tx('Pick a category. Each one has its own specification builder and filters.', 'اختار القسم. كل قسم له نموذج مواصفات وفلاتر خاصة بيه.')}</p></div><a class="btn btn-secondary" href="#categories">${tx('All categories', 'كل الأقسام')}</a></div>
    <div class="grid g4">${CATEGORIES.map(catCard).join('')}</div>
  </div></section>

  <section class="section"><div class="wrap">
    <h2>${tx('Five ways to source — know what you are asking for', 'خمس طرق للتوريد — اعرف إنت طالب إيه')}</h2>
    <p class="muted" style="margin:6px 0 18px;max-width:70ch">${tx('Most failed sourcing starts with a mismatched request. Nawah separates them so the right suppliers quote the right thing.', 'أغلب مشاكل التوريد بتبدأ من طلب مش واضح. نواة بتفصل الأنواع دي عشان الموردين الصح يسعّروا الحاجة الصح.')}</p>
    <div class="grid g3" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr))">${REQUEST_TYPES.map(r => `<div class="type-card"><div class="row-between"><span class="ic">${ic(r.icon)}</span>${r.secondary ? `<span class="pill">${tx('Secondary', 'خدمة إضافية')}</span>` : ''}</div><h3>${L(r)}</h3><p class="small muted">${isAr() ? r.dar : r.den}</p><p class="ex">${isAr() ? r.exar : r.exen}</p></div>`).join('')}</div>
  </div></section>

  <section class="section" style="background:var(--surface);border-block:1px solid var(--line)"><div class="wrap">
    <h2>${tx('How a project moves', 'المشروع بيمشي إزاي')}</h2>
    <ol class="steps-line" style="margin:22px 0 0;padding:0">${[
      ['Specify', 'حدد المواصفات', 'Guided builder turns your idea into a spec sheet.', 'نموذج موجّه بيحوّل فكرتك لملف مواصفات.'],
      ['Match', 'ترشيح الموردين', 'We shortlist suppliers by category, MOQ, capability and location.', 'بنرشح موردين حسب القسم والحد الأدنى والإمكانيات والمكان.'],
      ['Compare', 'قارن', 'Quotes are normalised to the same quantity and VAT basis.', 'العروض بتتوحد على نفس الكمية ونفس معاملة الضريبة.'],
      ['Sample', 'العينة', 'Approve a sample in writing before any production.', 'اعتمد العينة كتابيًا قبل أي إنتاج.'],
      ['Produce', 'الإنتاج', 'Agreed milestones, updates and change requests in one place.', 'مراحل متفق عليها وتحديثات وطلبات تعديل في مكان واحد.'],
      ['Deliver & reorder', 'استلم وأعد الطلب', 'Confirm receipt, report issues, reorder in one click.', 'أكد الاستلام، بلّغ عن مشكلة، وأعد الطلب بضغطة.']
    ].map(s => `<li><h3>${isAr() ? s[1] : s[0]}</h3><p class="small muted" style="margin-top:4px">${isAr() ? s[3] : s[2]}</p></li>`).join('')}</ol>
  </div></section>

  <section class="section"><div class="wrap">
    <h2>${tx('Who is responsible for what', 'مين مسؤول عن إيه')}</h2>
    <div class="resp" style="margin-top:18px">
      <div class="card"><div class="row">${ic('user')}<h3>${tx('You, the brand owner', 'إنت، صاحب البراند')}</h3></div><ul>${[
        ['Final specification and artwork approval', 'اعتماد المواصفات والتصميم النهائي'], ['Approving the sample in writing', 'اعتماد العينة كتابيًا'], ['Your brand’s registrations and claims', 'تسجيلات علامتك والادعاءات على المنتج'], ['Paying per agreed milestones', 'الدفع حسب المراحل المتفق عليها']].map(x => `<li>${isAr() ? x[1] : x[0]}</li>`).join('')}</ul></div>
      <div class="card" style="border-color:var(--brand)"><div class="row">${logo(22)}<h3>${tx('Nawah', 'نواة')}</h3></div><ul>${[
        ['Structured spec and RFQ', 'مواصفات وطلب عرض سعر منظم'], ['Supplier document review (scope shown on each badge)', 'مراجعة مستندات الموردين (النطاق مكتوب على كل شارة)'], ['Like-for-like quote comparison', 'مقارنة عروض على نفس الأساس'], ['Project record: messages, samples, milestones, issues', 'سجل المشروع: رسائل، عينات، مراحل، مشاكل'], ['Optional managed follow-up and inspection booking', 'متابعة مُدارة وحجز فحص (اختياري)']].map(x => `<li>${isAr() ? x[1] : x[0]}</li>`).join('')}</ul></div>
      <div class="card"><div class="row">${ic('factory')}<h3>${tx('The manufacturer', 'المصنع / المورد')}</h3></div><ul>${[
        ['Production quality and matching the approved sample', 'جودة الإنتاج ومطابقة العينة المعتمدة'], ['Food safety, formulation and product compliance', 'سلامة الغذاء والتركيبة ومطابقة المنتج'], ['Accurate quotes, lead times and documents', 'دقة الأسعار ومدد التنفيذ والمستندات'], ['Timely production updates', 'تحديثات الإنتاج في مواعيدها']].map(x => `<li>${isAr() ? x[1] : x[0]}</li>`).join('')}</ul></div>
    </div>
  </div></section>

  <section class="section-tight"><div class="wrap">
    <h2 style="margin-bottom:16px">${tx('Try a guided builder', 'جرّب نموذج مواصفات')}</h2>
    <div class="grid g3">${[
      ['builder-nuts', 'nut', '#B7791F', 'Launch a nuts brand', 'اعمل براند مكسرات', 'Private label · roast, pack, print', 'برايفت ليبل · تحميص وتعبئة وطباعة'],
      ['builder-dish', 'bottle', '#2F855A', 'Launch a dishwashing liquid', 'اعمل سائل أطباق باسمك', 'Ready formula or custom development', 'تركيبة جاهزة أو تطوير خاص'],
      ['builder-table', 'table', '#975A16', 'Produce wooden tables', 'صنّع ترابيزات خشب', 'Finished furniture or timber sourcing', 'أثاث جاهز أو توريد خشب']
    ].map(b => `<a class="card cat-card" style="--cat:${b[2]};padding:0" href="#${b[0]}"><div class="cat-art" style="height:84px">${ic(b[1], 'big')}</div><div class="cat-body"><h3>${isAr() ? b[4] : b[3]}</h3><p class="small muted">${isAr() ? b[6] : b[5]}</p><span class="row small" style="color:var(--brand);font-weight:600">${tx('Open builder', 'افتح النموذج')} ${ic('arrow', 'flip')}</span></div></a>`).join('')}</div>
  </div></section>`;
};

/* ---------- onboarding: start ---------- */
const IDEA_RULES = [
  [/nut|cashew|almond|pistachio|مكسر|كاجو|لوز|فستق|بندق|سوداني/i, 'builder-nuts', 'food', 'private'],
  [/dish|detergent|clean|soap|صابون|منظف|سائل|أطباق|مواعين|غسيل/i, 'builder-dish', 'cleaning', 'private'],
  [/table|wood|furniture|chair|ترابيز|طاول|خشب|أثاث|كرسي|موبيليا/i, 'builder-table', 'furniture', 'contract'],
  [/shirt|t-shirt|hoodie|uniform|تيشيرت|هودي|يونيفورم|ملابس/i, 'builder-custom:tshirt', 'textiles', 'private'],
  [/coffee|tea|بن|قهوة|شاي/i, 'builder-custom:coffee', 'food', 'private'],
  [/shampoo|hair|شامبو|شعر/i, 'builder-custom:shampoo', 'personal', 'private'],
  [/pouch|bag|packag|كيس|أكياس|تغليف|عبوات/i, 'builder-custom:pouch', 'packaging', 'packaging']
];
function ideaMatch(text) { for (const r of IDEA_RULES) if (r[0].test(text)) return r; return null; }

VIEWS.start = () => {
  const u = S.ui; const m = u.idea ? ideaMatch(u.idea) : null;
  return `<div class="wrap section" style="max-width:920px">
  ${crumbs([[tx('Home', 'الرئيسية'), 'home'], [tx('Start my product', 'ابدأ منتجك')]])}
  <h1>${tx('Let’s start your product', 'يلا نبدأ منتجك')}</h1>
  <p class="muted" style="margin-top:8px">${tx('Three quick choices. You can change any of them later; nothing is sent to suppliers until you submit an RFQ.', 'تلات اختيارات سريعة. تقدر تغيرهم بعدين، ومفيش حاجة بتتبعت للموردين قبل ما تبعت طلب عرض السعر.')}</p>

  <div class="card" style="margin-top:22px"><h3>${tx('1 · How far along are you?', '١ · إنت وصلت لفين؟')}</h3>
  <div class="opts wide" style="margin-top:12px">
    <label class="opt"><input type="radio" name="sp" value="idea" data-bind="ui.startPath" ${u.startPath === 'idea' ? 'checked' : ''}><span class="mark"></span><span><span class="t">${tx('I have an idea', 'عندي فكرة')}</span><span class="d">${tx('The assistant asks questions and suggests the request type.', 'المساعد هيسألك أسئلة ويقترح نوع الطلب.')}</span></span></label>
    <label class="opt"><input type="radio" name="sp" value="spec" data-bind="ui.startPath" ${u.startPath === 'spec' ? 'checked' : ''}><span class="mark"></span><span><span class="t">${tx('I know my specifications', 'أنا عارف المواصفات')}</span><span class="d">${tx('Go straight to the category builder, or upload your spec sheet.', 'ادخل على نموذج القسم على طول، أو ارفع ملف المواصفات.')}</span></span></label>
  </div></div>

  ${u.startPath === 'idea' ? `<div class="card" style="margin-top:16px"><h3>${tx('2 · Describe your idea in a sentence', '٢ · اوصف فكرتك في جملة')}</h3>
    <div class="field" style="margin-top:12px"><label for="idea" class="sr-only">${tx('Your idea', 'فكرتك')}</label><textarea id="idea" class="textarea" data-bind="ui.idea" placeholder="${tx('e.g. I want to sell roasted cashews and almonds in 200 g bags under my own brand', 'مثال: عايز أبيع كاجو ولوز محمص في أكياس ٢٠٠ جرام باسم البراند بتاعي')}">${esc(u.idea)}</textarea></div>
    <div data-live="ideaHint" style="margin-top:12px"></div></div>` : ''}

  ${u.startPath === 'spec' ? `<div class="card" style="margin-top:16px"><h3>${tx('2 · What do you need?', '٢ · محتاج إيه؟')}</h3>
    <div class="opts wide" style="margin-top:12px">${REQUEST_TYPES.map(r => `<label class="opt"><input type="radio" name="st" value="${r.id}" data-bind="ui.startType" ${u.startType === r.id ? 'checked' : ''}><span class="mark"></span><span><span class="t">${L(r)}</span><span class="d">${isAr() ? r.dar : r.den}</span></span></label>`).join('')}</div></div>
    <div class="card" style="margin-top:16px"><h3>${tx('3 · Pick a category', '٣ · اختار القسم')}</h3>
    <div class="grid g4" style="margin-top:12px">${CATEGORIES.filter(c => !u.startType || u.startType === 'wholesale' || (u.startType === 'raw' ? c.kind === 'raw' : u.startType === 'packaging' ? c.kind === 'packaging' : c.kind === 'finished' || c.kind === 'custom')).map(catCard).join('')}</div>
    <div class="drop" style="margin-top:16px">${ic('upload')} ${tx('Already have a spec sheet? Attach it and our team will map it to a builder.', 'عندك ملف مواصفات جاهز؟ ارفعه وفريقنا هيحوّله للنموذج المناسب.')}<input type="file" data-upload="spec" aria-label="${tx('Upload spec sheet', 'رفع ملف المواصفات')}"></div></div>` : ''}
  </div>`;
};
PARTIALS.ideaHint = () => {
  const t = S.ui.idea || ''; if (t.trim().length < 6) return `<p class="faint">${tx('Write a few words — product, quantity, packaging.', 'اكتب كام كلمة — المنتج، الكمية، التغليف.')}</p>`;
  const m = ideaMatch(t);
  if (!m) return `<div class="note warn">${ic('help')}<span>${tx('I could not match this to a category yet. Try naming the product type, or send it as a custom request and our team will qualify it.', 'لسه مش قادر أحدد القسم. جرّب تكتب نوع المنتج، أو ابعته كطلب خاص وفريقنا هيراجعه.')}<br><a href="#builder-custom" data-act="openTpl" data-tpl="other">${tx('Send as custom request', 'ابعته كطلب خاص')}</a></span></div>`;
  const c = cat(m[2]); const rt = REQUEST_TYPES.find(r => r.id === m[3]);
  const qty = t.match(/(\d[\d,]*)\s*(g|gm|gram|جم|جرام|kg|كيلو|pcs|قطعة|bottles|زجاجة|عبوة)/i);
  return `<div class="note ok">${ic('sparkle')}<span><b>${tx('Suggested start', 'البداية المقترحة')}:</b> ${L(c)} · ${L(rt)}${qty ? ` · ${tx('detected', 'لاحظت')} <bdi dir="ltr">${esc(qty[0])}</bdi>` : ''}<br>
    <span class="faint">${tx('Rules-based suggestion in this demo. In production an AI assistant drafts the brief; it never invents prices or supplier capabilities.', 'اقتراح بقواعد ثابتة في الديمو. في النسخة الفعلية مساعد ذكاء اصطناعي بيكتب المسودة، ومش بيألّف أسعار أو إمكانيات موردين.')}</span></span></div>
    <button class="btn btn-primary" style="margin-top:12px" data-act="openBuilder" data-b="${m[1]}">${tx('Open the guided builder', 'افتح النموذج الموجّه')} ${ic('arrow', 'flip')}</button>`;
};

/* ---------- categories ---------- */
VIEWS.categories = () => {
  const group = (title, desc, list) => `<div class="stack" style="margin-top:28px"><div><h2>${title}</h2><p class="muted">${desc}</p></div><div class="grid g4">${list.map(catCard).join('')}</div></div>`;
  return `<div class="wrap section">${crumbs([[tx('Home', 'الرئيسية'), 'home'], [tx('Categories', 'الأقسام')]])}
  <h1>${tx('Category map', 'خريطة الأقسام')}</h1>
  <p class="muted" style="margin-top:8px;max-width:70ch">${tx('Finished products, raw materials and services are kept separate so you always know what you are requesting. The taxonomy is managed from templates and can grow without code changes.', 'المنتجات النهائية والخامات والخدمات منفصلين عشان تبقى عارف إنت طالب إيه. الأقسام بتتدار من القوالب وتقدر تكبر من غير تعديل برمجي.')}</p>
  ${group(tx('Finished products', 'منتجات نهائية'), tx('A manufacturer delivers the finished, packed product.', 'المصنع بيسلّمك المنتج جاهز ومعبأ.'), CATEGORIES.filter(c => c.kind === 'finished'))}
  ${group(tx('Packaging, raw materials & components', 'تغليف وخامات ومكونات'), tx('Inputs you buy separately, priced per unit of sale.', 'مدخلات بتشتريها لوحدها، بسعر وحدة البيع.'), CATEGORIES.filter(c => c.kind === 'packaging' || c.kind === 'raw'))}
  <div class="stack" style="margin-top:28px"><div><h2>${tx('Production services', 'خدمات الإنتاج')}</h2><p class="muted">${tx('Add-ons booked on a project. Shown as planned services in this demo.', 'خدمات بتتضاف على المشروع. معروضة كخدمات مخططة في الديمو.')}</p></div>
    <div class="grid g4" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">${SERVICES.map(s => `<div class="card row">${ic(s.icon)}<span class="grow"><b>${L(s)}</b></span><span class="pill">${tx('Planned', 'مخطط')}</span></div>`).join('')}</div></div>
  ${group(tx('Not listed?', 'مش لاقي قسمك؟'), tx('Describe it and the operations team qualifies it by hand.', 'اوصفه وفريق التشغيل هيراجعه.'), CATEGORIES.filter(c => c.kind === 'custom'))}
  </div>`;
};

function matchSuppliers(p) {
  const s = p.spec; const kg = p.id === 'p-nuts' ? (s.packs * s.packG) / 1000 : null;
  return SUPPLIERS.filter(x => x.cat.includes(p.cat)).map(x => {
    let score = 40; const why = [{ en: L(cat(p.cat)), ar: L(cat(p.cat)) }];
    if (x.subs.includes(p.sub)) { score += 20; why.push({ en: 'Makes ' + cat(p.cat).subs.find(z => z.id === p.sub).en.toLowerCase(), ar: 'بيصنع ' + cat(p.cat).subs.find(z => z.id === p.sub).ar }); }
    if (kg != null && x.moqKg != null) { if (x.moqKg <= kg) { score += 15; why.push({ en: `MOQ ${x.moqKg} kg ≤ your ${nf(kg)} kg`, ar: `الحد الأدنى ${x.moqKg} كجم ≤ ${nf(kg)} كجم` }); } else { score -= 20; why.push({ en: `MOQ ${x.moqKg} kg above your ${nf(kg)} kg`, ar: `الحد الأدنى ${x.moqKg} كجم أكبر من ${nf(kg)} كجم` }); } }
    if (p.id === 'p-nuts' && s.process === 'flavoured') { if (x.caps.includes('flavouring')) { score += 10; why.push({ en: 'Flavouring', ar: 'تنكيه' }); } else score -= 10; }
    if (p.id === 'p-nuts' && s.print === 'printed' && x.caps.includes('pouch-printing')) { score += 5; why.push({ en: 'In-house pouch print', ar: 'طباعة أكياس داخلية' }); }
    if (x.govId === 'cairo') { score += 5; why.push({ en: 'Near Greater Cairo', ar: 'قريب من القاهرة الكبرى' }); }
    if (x.checks.length >= 3) score += 5;
    return { s: x, score: Math.max(5, Math.min(99, score)), why };
  }).sort((a, b) => b.score - a.score);
}

const supHas = (x, cap) => cap === 'cert' ? x.certs.length > 0 : cap === 'damietta' ? /Damietta/.test(x.gov.en) : x.caps.includes(cap);
function supCard(x, extra = '') {
  const saved = S.saved.includes(x.id);
  return `<article class="card sup-card">
    <div class="row" style="align-items:flex-start">${supLogo(x)}<div class="grow"><div class="row"><h3>${L(x)}</h3>${demoTag()}</div><p class="faint">${L(x.gov)} · ${tx('since', 'منذ')} ${x.since}</p></div>
      <button class="icon-btn" data-act="toggleSave" data-id="${x.id}" aria-pressed="${saved}" aria-label="${saved ? tx('Remove from saved', 'إزالة من المحفوظات') : tx('Save supplier', 'حفظ المورد')}" style="${saved ? 'color:var(--brand);border-color:var(--brand)' : ''}">${ic('bookmark')}</button></div>
    <p class="small">${L(x.capsLabel)}</p>
    <dl class="kv small"><dt>${tx('MOQ', 'الحد الأدنى')}</dt><dd>${L(x.moq)}</dd><dt>${tx('Typical lead time', 'مدة التنفيذ المعتادة')}</dt><dd>${L(x.lead)} <span class="faint">(${tx('supplier-stated', 'حسب المورد')})</span></dd></dl>
    <div class="row">${verifyBadge(x)}</div>${extra}</article>`;
}

VIEWS.category = route => {
  const c = cat(route.slice(4)); if (!c) return VIEWS.notfound();
  const fkey = c.id; const active = S.ui.catFilters[fkey] || [];
  let list = SUPPLIERS.filter(x => x.cat.includes(c.id));
  return `<div class="wrap section">${crumbs([[tx('Home', 'الرئيسية'), 'home'], [tx('Categories', 'الأقسام'), 'categories'], [L(c)]])}
  <div class="card" style="--cat:${c.hue};padding:0;overflow:hidden"><div class="cat-art" style="height:120px">${ic(c.icon, 'big')}</div>
  <div style="padding:20px" class="row-between"><div><h1 style="font-size:1.8rem">${L(c)}</h1><p class="muted" style="margin-top:6px">${isAr() ? c.dar : c.den}</p></div>
  ${c.subs.find(s => s.builder) ? `<button class="btn btn-primary btn-lg" data-act="openSub" data-cat="${c.id}" data-sub="${c.subs.find(s => s.builder).id}">${tx('Start a request', 'ابدأ طلب')} ${ic('arrow', 'flip')}</button>` : ''}</div></div>

  <h2 style="margin:28px 0 12px">${tx('Subcategories', 'الأقسام الفرعية')}</h2>
  <div class="grid g4" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${c.subs.map(s => `<button class="card row" style="text-align:start;cursor:pointer" data-act="openSub" data-cat="${c.id}" data-sub="${s.id}"><span class="grow"><b>${L(s)}</b><span class="faint" style="display:block">${s.builder ? (s.builder === 'builder-custom' ? tx('Template form', 'نموذج من قالب') : tx('Guided builder', 'نموذج موجّه')) : tx('Request via general form', 'طلب بالنموذج العام')}</span></span>${s.builder && s.builder !== 'builder-custom' ? `<span class="pill brand">${ic('sparkle')}</span>` : ''}${ic('chev', 'flip')}</button>`).join('')}</div>

  ${c.filters.length ? `<div class="layout-side" style="margin-top:32px"><aside class="card filters"><h3>${tx('Filter suppliers', 'فلترة الموردين')}</h3>
    ${c.filters.map((f, i) => `<label class="switch"><input type="checkbox" data-act-change="catFilter" data-cat="${c.id}" data-i="${i}" ${active.includes(i) ? 'checked' : ''}><span class="small">${L(f)}</span></label>`).join('')}
    <p class="faint">${tx('Filters use what suppliers declared in their profile. Nawah checks documents, not every capability claim.', 'الفلاتر بتعتمد على اللي المورد كتبه في ملفه. نواة بتراجع المستندات، مش كل إمكانية مكتوبة.')}</p></aside>
    <div class="stack">${active.length ? `<div class="note">${ic('info')}<span>${tx(`${active.length} filter(s) applied, based on declared capabilities and uploaded certificates.`, `تم تطبيق ${active.length} فلتر، حسب الإمكانيات المعلنة والشهادات المرفوعة.`)}</span></div>` : ''}
    ${list.filter(x => active.every(i => supHas(x, c.filters[i].cap))).map(x => supCard(x)).join('') ||
      emptyState('search', tx('No suppliers match all filters', 'مفيش موردين بيطابقوا كل الفلاتر'), tx('Remove a filter, or submit your request anyway — the ops team can invite suppliers who are not listed yet.', 'شيل فلتر، أو ابعت طلبك على أي حال — فريق التشغيل يقدر يدعو موردين لسه مش موجودين.'), `<button class="btn btn-secondary" data-act="clearCatFilter" data-cat="${c.id}">${tx('Clear filters', 'مسح الفلاتر')}</button>`)}</div></div>`
  : `<div style="margin-top:24px">${emptyState('sparkle', tx('Custom requests are qualified by hand', 'الطلبات الخاصة بتتراجع يدويًا'), tx('Describe your product and the operations team will find suitable suppliers.', 'اوصف منتجك وفريق التشغيل هيدور على موردين مناسبين.'), `<a class="btn btn-primary" href="#builder-custom" data-act="openTpl" data-tpl="other">${tx('Describe my product', 'اوصف منتجي')}</a>`)}</div>`}
  </div>`;
};

/* ---------- supplier discovery ---------- */
VIEWS.suppliers = () => {
  const f = S.ui.sup;
  return `<div class="wrap section">${crumbs([[tx('Home', 'الرئيسية'), 'home'], [tx('Suppliers', 'الموردين')]])}
  <div class="row-between"><div><h1>${tx('Find a manufacturer or supplier', 'ابحث عن مصنع أو مورد')}</h1><p class="muted" style="margin-top:6px">${tx('All companies below are fictional demo profiles.', 'كل الشركات اللي تحت ملفات وهمية للعرض.')}</p></div></div>
  <div class="layout-side" style="margin-top:22px">
    <aside class="card filters">
      <div class="field"><label for="sq">${tx('Search', 'بحث')}</label><input id="sq" class="input" data-bind="ui.sup.q" value="${esc(f.q)}" placeholder="${tx('Name, product, city…', 'اسم، منتج، مدينة…')}"></div>
      <div class="field"><label for="sc">${tx('Category', 'القسم')}</label><select id="sc" class="select" data-bind="ui.sup.cat"><option value="all">${tx('All categories', 'كل الأقسام')}</option>${CATEGORIES.filter(c => c.id !== 'custom').map(c => `<option value="${c.id}" ${f.cat === c.id ? 'selected' : ''}>${L(c)}</option>`).join('')}</select></div>
      <div class="field"><label for="sg">${tx('Region', 'المنطقة')}</label><select id="sg" class="select" data-bind="ui.sup.gov"><option value="all">${tx('All regions', 'كل المناطق')}</option><option value="cairo" ${f.gov === 'cairo' ? 'selected' : ''}>${tx('Greater Cairo', 'القاهرة الكبرى')}</option><option value="delta" ${f.gov === 'delta' ? 'selected' : ''}>${tx('Delta & Canal', 'الدلتا والقناة')}</option><option value="alex" ${f.gov === 'alex' ? 'selected' : ''}>${tx('Alexandria', 'الإسكندرية')}</option></select></div>
      <div class="field"><label for="sm">${tx('Max MOQ for food (kg)', 'أقصى حد أدنى للأغذية (كجم)')}</label><input id="sm" class="input num" type="number" min="0" data-bind="ui.sup.maxMoq" data-num value="${f.maxMoq}"></div>
      <label class="switch"><input type="checkbox" data-bind-bool="ui.sup.verified" ${f.verified ? 'checked' : ''}><span class="small">${tx('3+ document checks', '٣ مراجعات مستندات أو أكتر')}</span></label>
      <label class="switch"><input type="checkbox" data-bind-bool="ui.sup.savedOnly" ${f.savedOnly ? 'checked' : ''}><span class="small">${tx('Saved suppliers only', 'الموردين المحفوظين بس')}</span></label>
    </aside>
    <div data-live="supList" class="grid g2"></div>
  </div></div>`;
};
PARTIALS.supList = () => {
  const f = S.ui.sup; const q = (f.q || '').toLowerCase().trim();
  const list = SUPPLIERS.filter(x => (f.cat === 'all' || x.cat.includes(f.cat)) && (f.gov === 'all' || x.govId === f.gov)
    && (!f.maxMoq || x.moqKg == null || x.moqKg <= f.maxMoq) && (!f.verified || x.checks.length >= 3) && (!f.savedOnly || S.saved.includes(x.id))
    && (!q || [x.en, x.ar, x.gov.en, x.gov.ar, x.capsLabel.en, x.capsLabel.ar].join(' ').toLowerCase().includes(q)));
  if (!list.length) return `<div style="grid-column:1/-1">${f.savedOnly && !S.saved.length ? emptyState('bookmark', tx('No saved suppliers yet', 'لسه مفيش موردين محفوظين'), tx('Use the bookmark on any supplier card to keep it here.', 'استخدم علامة الحفظ على كارت أي مورد عشان يظهر هنا.'))
    : emptyState('search', tx('No suppliers match', 'مفيش نتائج'), tx('Try a broader search or remove a filter.', 'جرّب بحث أوسع أو شيل فلتر.'), `<button class="btn btn-secondary" data-act="clearSup">${tx('Clear filters', 'مسح الفلاتر')}</button>`)}</div>`;
  return `<p class="faint" style="grid-column:1/-1">${tx(`${list.length} suppliers`, `${list.length} مورد`)}</p>` + list.map(x => supCard(x)).join('');
};

/* ---------- buyer dashboard ---------- */
function nextAction(p) {
  if (p.past) return [tx('Reorder', 'أعد الطلب'), 'reorder'];
  if (p.stage === 'draft') return [tx('Finish specification', 'كمّل المواصفات'), p.builder];
  if (p.id !== 'p-nuts') return [tx('View request', 'عرض الطلب'), 'project-overview'];
  if (p.stage === 'rfq') return [tx('Check quotations', 'شوف العروض'), 'project-quotes'];
  if (p.stage === 'quotes') return [tx('Compare & request sample', 'قارن واطلب عينة'), 'project-compare'];
  if (p.stage === 'sample') return [tx('Review sample', 'راجع العينة'), 'project-samples'];
  if (p.stage === 'approved') return [tx('Accept quotation', 'اقبل العرض'), 'project-order'];
  return [tx('Track production', 'تابع الإنتاج'), 'project-order'];
}
VIEWS.dashboard = () => {
  const active = Object.values(S.projects).filter(p => !p.past); const past = Object.values(S.projects).filter(p => p.past);
  return `<div class="wrap section">${crumbs([[tx('Home', 'الرئيسية'), 'home'], [tx('My projects', 'مشاريعي')]])}
  <div class="row-between"><h1>${tx('My projects', 'مشاريعي')}</h1><a class="btn btn-primary" href="#start">${ic('plus')} ${tx('New project', 'مشروع جديد')}</a></div>
  <div class="grid" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr);margin-top:20px" id="dash-grid">
    <div class="stack">${active.map(p => { const na = nextAction(p); const c = cat(p.cat);
      return `<article class="card row" style="align-items:flex-start;--cat:${c.hue}"><div class="cat-art" style="width:56px;height:56px;border-radius:12px;flex:none">${ic(c.icon, 'big')}</div>
      <div class="grow stack" style="gap:6px"><div class="row"><h3>${L(p.title)}</h3>${stagePill(p.stage)}</div><p class="faint"><bdi class="mono">${p.code}</bdi> · ${L(c)} · ${L(REQUEST_TYPES.find(r => r.id === p.type))}</p></div>
      <button class="btn btn-secondary btn-sm" data-act="openProject" data-id="${p.id}" data-to="${na[1]}">${na[0]} ${ic('arrow', 'flip')}</button></article>`; }).join('')}
      <h2 style="margin-top:12px">${tx('Completed', 'مكتملة')}</h2>
      ${past.map(p => `<article class="card row"><div class="grow"><div class="row"><h3>${L(p.title)}</h3>${stagePill('delivered')}</div><p class="faint"><bdi class="mono">${p.code}</bdi> · ${tx('Delivered', 'اتسلم')} ${fdate(p.deliveredOn)} · ${nf(p.spec.vals.qty)} ${tx('packs', 'عبوة')}</p></div>
        <button class="btn btn-primary btn-sm" data-act="reorder" data-id="${p.id}">${ic('repeat')} ${tx('Reorder', 'أعد الطلب')}</button></article>`).join('')}
    </div>
    <aside class="stack">
      <div class="card"><div class="card-head"><h3>${tx('Latest updates', 'آخر التحديثات')}</h3><button class="btn btn-ghost btn-sm" data-act="notifs">${tx('All', 'الكل')}</button></div>
        ${S.notifs.slice(0, 4).map(n => `<div class="assist-item">${ic(n.icon)}<span>${L(n)}</span></div>`).join('')}</div>
      <div class="card"><div class="card-head"><h3>${tx('Saved suppliers', 'موردين محفوظين')}</h3></div>
        ${S.saved.length ? S.saved.map(id => `<div class="row" style="padding:6px 0">${supLogo(sup(id))}<span class="grow small"><b>${L(sup(id))}</b><br><span class="faint">${L(sup(id).gov)}</span></span></div>`).join('') : `<p class="faint">${tx('Nothing saved yet.', 'لسه مفيش حاجة محفوظة.')}</p>`}</div>
      <div class="card"><h3>${tx('Need help?', 'محتاج مساعدة؟')}</h3><p class="small muted" style="margin:6px 0 12px">${tx('Report a problem on any project or ask the operations team.', 'بلّغ عن مشكلة في أي مشروع أو اسأل فريق التشغيل.')}</p><button class="btn btn-secondary btn-sm" data-act="issue">${ic('flag')} ${tx('Report an issue', 'بلّغ عن مشكلة')}</button></div>
    </aside>
  </div></div>
  <style>@media (max-width:900px){#dash-grid{grid-template-columns:minmax(0,1fr)!important}}</style>`;
};

/* ---------- about / business model ---------- */
VIEWS.about = () => `<div class="wrap section" style="max-width:980px">${crumbs([[tx('Home', 'الرئيسية'), 'home'], [tx('How Nawah works', 'إزاي نواة بتشتغل')]])}
  <h1>${tx('How Nawah works', 'إزاي نواة بتشتغل')}</h1>
  <p class="lead muted" style="margin-top:10px;font-size:1.05rem;max-width:70ch">${tx('Nawah is a managed sourcing workflow: structured specifications, suitable suppliers, comparable quotations and execution support. It is not a directory and does not promise the lowest price in the market.', 'نواة منظومة توريد مُدارة: مواصفات منظمة، موردين مناسبين، عروض قابلة للمقارنة، ودعم في التنفيذ. مش دليل موردين، ومش بنوعد بأرخص سعر في السوق.')}</p>
  <div class="grid g2" style="margin-top:24px">
    <div class="card"><h3>${tx('The problem', 'المشكلة')}</h3><p class="muted small" style="margin-top:6px">${tx('First-time brand owners lose weeks calling factories, get quotes that cannot be compared, skip samples, and have no record when something goes wrong.', 'أصحاب البراندات الجديدة بيضيعوا أسابيع في التليفونات مع المصانع، وبتجيلهم عروض مش قابلة للمقارنة، وبيتخطوا العينة، ومفيش سجل لما حاجة تبوظ.')}</p></div>
    <div class="card"><h3>${tx('Why suppliers join', 'ليه الموردين ينضموا')}</h3><p class="muted small" style="margin-top:6px">${tx('Qualified, complete requests instead of vague chats; buyers who already know quantity and packaging; filled spare capacity; repeat orders.', 'طلبات جادة ومكتملة بدل محادثات مبهمة؛ عملاء عارفين الكمية والتغليف؛ استغلال الطاقة الفاضية؛ وطلبات متكررة.')}</p></div>
  </div>
  <h2 style="margin-top:32px">${tx('Revenue model (illustrative assumptions)', 'نموذج الإيراد (افتراضات توضيحية)')}</h2>
  <div class="table-wrap" style="margin-top:12px"><table class="list"><thead><tr><th>${tx('Stream', 'المصدر')}</th><th>${tx('Illustrative assumption', 'افتراض توضيحي')}</th><th>${tx('When', 'إمتى')}</th></tr></thead><tbody>
    <tr><td><b>${tx('Project preparation fee', 'رسوم تجهيز المشروع')}</b></td><td>${egp(1500)} – ${egp(3000)} ${tx('per project, credited against commission if an order is placed', 'للمشروع، بتتخصم من العمولة لو الطلب اتنفذ')}</td><td><span class="pill ok">${tx('Launch', 'من البداية')}</span></td></tr>
    <tr><td><b>${tx('Transparent commission', 'عمولة واضحة')}</b></td><td>${tx('4–7% of order value, shown on the quote', '٤–٧٪ من قيمة الطلب، ظاهرة في العرض')}</td><td><span class="pill ok">${tx('Launch', 'من البداية')}</span></td></tr>
    <tr><td><b>${tx('Managed production', 'إنتاج مُدار')}</b></td><td>${tx('+3–5% for follow-up visits and coordination', '+٣–٥٪ للمتابعة والتنسيق')}</td><td><span class="pill info">${tx('Pilot', 'التجربة')}</span></td></tr>
    <tr><td><b>${tx('Paid services', 'خدمات مدفوعة')}</b></td><td>${tx('Inspection, packaging design, logistics — fixed fee', 'فحص، تصميم تغليف، نقل — سعر ثابت')}</td><td><span class="pill info">${tx('Month 3+', 'من الشهر ٣')}</span></td></tr>
    <tr><td><b>${tx('Supplier subscription', 'اشتراك الموردين')}</b></td><td>${tx('Featured profile & analytics', 'ملف مميز وتحليلات')}</td><td><span class="pill">${tx('Later', 'لاحقًا')}</span></td></tr>
  </tbody></table></div>
  <p class="faint" style="margin-top:8px">${tx('All figures are planning assumptions, not established market rates.', 'كل الأرقام افتراضات للتخطيط، مش أسعار سوق مثبتة.')}</p>
  <h2 style="margin-top:32px">${tx('Why customers stay on the platform', 'ليه العميل يفضل على المنصة')}</h2>
  <div class="grid g3" style="margin-top:12px">${[
    ['repeat', 'One-click reorders with the approved spec, plates and sample record', 'إعادة طلب بضغطة بنفس المواصفات والأكلاشيهات وسجل العينة'],
    ['file', 'A complete record for disputes: quote versions, approvals, messages', 'سجل كامل لأي خلاف: نسخ العروض، الموافقات، الرسائل'],
    ['compare', 'Fresh competing quotes each reorder, so the price stays honest', 'عروض منافسة جديدة مع كل إعادة طلب، فالسعر يفضل عادل'],
    ['layers', 'Packaging, materials and services coordinated in the same project', 'التغليف والخامات والخدمات متنسقة في نفس المشروع'],
    ['wallet', 'Milestone invoices and (later) licensed payment protection', 'فواتير بالمراحل و(لاحقًا) حماية دفع من مزود مرخص'],
    ['lock', 'Buyer identity shared after quote acceptance, not before', 'هوية العميل بتظهر للمورد بعد قبول العرض، مش قبلها']
  ].map(x => `<div class="card-flat row" style="align-items:flex-start">${ic(x[0])}<span class="small">${isAr() ? x[2] : x[1]}</span></div>`).join('')}</div>
</div>`;

/* ---------- brand ---------- */
VIEWS.brand = () => {
  const names = [
    ['Nawah', 'نواة', 'Kernel, seed — the core a brand grows from. Short, soft in both languages.', 'النواة — البذرة اللي البراند بيطلع منها. قصير وسهل في اللغتين.', true],
    ['Mansha', 'منشأ', 'Origin, “made in”. Strong sourcing meaning.', 'المنشأ — “صنع في”. معنى قوي للتوريد.'],
    ['Qalib', 'قالب', 'Mould — shaping a product. The Q is harder in English.', 'القالب — تشكيل المنتج. حرف القاف صعب شوية بالإنجليزي.'],
    ['Wasla', 'وصلة', 'The link between buyer and maker. Very common word.', 'الوصلة بين العميل والمصنع. كلمة منتشرة جدًا.'],
    ['Sanad', 'سند', 'Backing, support. Widely used in fintech.', 'السند والدعم. مستخدم كتير في شركات التمويل.'],
    ['Darb', 'درب', 'Path — idea to shelf. Feels traditional.', 'الدرب — من الفكرة للرف. إحساس تراثي.'],
    ['Bazra', 'بذرة', 'Seed. Friendly but less B2B.', 'البذرة. ودودة بس أقل رسمية.'],
    ['Khatt', 'خط', 'Production line. Hard “kh” for English speakers.', 'خط الإنتاج. حرف الخاء صعب على المتحدث بالإنجليزي.']
  ];
  return `<div class="wrap section" style="max-width:1040px">${crumbs([[tx('Home', 'الرئيسية'), 'home'], [tx('Brand', 'الهوية')]])}
  <div class="card row" style="gap:24px;padding:28px">${logo(84)}<div class="grow"><h1>Nawah · نواة</h1><p class="lead muted" style="margin-top:6px">From idea to product. · من الفكرة للمنتج.</p></div></div>
  <div class="grid g2" style="margin-top:18px">
    <div class="card"><h3>${tx('Value proposition', 'القيمة المقدمة')}</h3><p class="muted" style="margin-top:6px">${tx('We turn a product idea into a supplied product: a clear spec, the right manufacturers, quotes you can compare, a sample you approve, and production you can follow.', 'بنحوّل فكرة المنتج لمنتج متورد فعلًا: مواصفات واضحة، المصانع المناسبة، عروض تقدر تقارنها، عينة تعتمدها، وإنتاج تتابعه.')}</p></div>
    <div class="card"><h3>${tx('Personality', 'الشخصية')}</h3><p class="muted" style="margin-top:6px">${tx('A calm, experienced sourcing partner: precise with numbers, plain-spoken, honest about what is checked and what is not. Practical, never flashy.', 'شريك توريد هادي وخبير: دقيق في الأرقام، كلامه واضح، وصريح في اللي اتراجع واللي لأ. عملي ومش استعراضي.')}</p></div>
    <div class="card"><h3>${tx('Logo direction', 'اتجاه الشعار')}</h3><p class="muted" style="margin-top:6px">${tx('A kernel shape in saffron inside a deep-green tile, with a single sprout line: the seed of a brand growing upward. Works as a 16 px favicon and an embossed carton mark.', 'شكل نواة بلون الزعفران جوه مربع أخضر غامق، وخط برعم واحد: بذرة البراند وهي بتكبر. ينفع كأيقونة ١٦ بكسل وكختم على الكرتونة.')}</p></div>
    <div class="card"><h3>${tx('Typography', 'الخطوط')}</h3><p style="margin-top:6px;font-family:var(--f-display);font-size:1.3rem">Readex Pro · ريدكس برو</p><p class="muted small">${tx('Display — geometric, bilingual.', 'للعناوين — هندسي وثنائي اللغة.')}</p><p style="margin-top:8px;font-size:1.1rem">IBM Plex Sans Arabic · بلكس عربي</p><p class="muted small">${tx('Text — highly legible in forms and tables.', 'للنصوص — واضح جدًا في النماذج والجداول.')}</p></div>
  </div>
  <h2 style="margin-top:28px">${tx('Palette', 'الألوان')}</h2>
  <div class="grid g4" style="margin-top:12px">${[['Delta green', 'أخضر الدلتا', '#0E5A4B', '#fff'], ['Saffron', 'زعفران', '#B97D12', '#fff'], ['Ink', 'حبر', '#13211D', '#fff'], ['Mist', 'ضباب', '#F4F7F5', '#13211D']].map(c => `<div><div class="swatch" style="background:${c[2]};color:${c[3]};border:1px solid var(--line)">${c[2]}</div><p class="small" style="margin-top:6px"><b>${isAr() ? c[1] : c[0]}</b></p></div>`).join('')}</div>
  <h2 style="margin-top:28px">${tx('Name options', 'اقتراحات الاسم')}</h2>
  <div class="table-wrap" style="margin-top:12px"><table class="list"><thead><tr><th>${tx('Name', 'الاسم')}</th><th>${tx('Meaning & notes', 'المعنى والملاحظات')}</th><th>${tx('Domain / trademark', 'الدومين / العلامة')}</th></tr></thead><tbody>
  ${names.map(n => `<tr ${n[4] ? 'class="sel"' : ''}><td><b>${n[0]}</b> · ${n[1]} ${n[4] ? `<span class="pill brand">${tx('Selected', 'المختار')}</span>` : ''}</td><td class="small">${isAr() ? n[3] : n[2]}</td><td><span class="pill warn">${tx('Unchecked', 'لم يتم التحقق')}</span></td></tr>`).join('')}</tbody></table></div>
  </div>`;
};

/* ---------- help & glossary ---------- */
VIEWS.help = () => {
  const q = (S.ui.docQuery || '').toLowerCase();
  return `<div class="wrap section" style="max-width:980px">${crumbs([[tx('Home', 'الرئيسية'), 'home'], [tx('Help & glossary', 'المساعدة والمصطلحات')]])}
  <h1>${tx('Help & glossary', 'المساعدة والمصطلحات')}</h1>
  <div class="field" style="margin-top:18px;max-width:420px"><label for="gq">${tx('Search terms', 'ابحث في المصطلحات')}</label><input id="gq" class="input" data-bind="ui.docQuery" value="${esc(S.ui.docQuery)}" placeholder="MOQ, RFQ…"></div>
  <div data-live="gloss" class="grid g2" style="margin-top:16px"></div>
  <h2 style="margin-top:36px" id="simulated">${tx('What is simulated in this prototype', 'إيه اللي متمثّل في النموذج ده')}</h2>
  <div class="table-wrap" style="margin-top:12px"><table class="list"><thead><tr><th>${tx('Feature', 'الخاصية')}</th><th>${tx('In this demo', 'في الديمو')}</th><th>${tx('Needed for production', 'المطلوب للتشغيل الفعلي')}</th></tr></thead><tbody>
  ${[
    ['Suppliers, quotes, certificates', 'الموردين والعروض والشهادات', 'Fictional data in the browser', 'بيانات وهمية في المتصفح', 'Supplier onboarding + database', 'تسجيل موردين + قاعدة بيانات'],
    ['Supplier responses & replies', 'ردود الموردين', 'Timed simulation', 'محاكاة بتوقيت', 'Real supplier accounts, email/WhatsApp notifications', 'حسابات موردين حقيقية، إشعارات إيميل/واتساب'],
    ['Brief assistant & matching', 'المساعد والترشيح', 'Rules-based', 'قواعد ثابتة', 'LLM drafting with guardrails + scoring service', 'مساعد ذكاء اصطناعي بضوابط + خدمة تقييم'],
    ['Payments & invoices', 'المدفوعات والفواتير', 'Buttons mark invoices as paid; no money moves', 'زرار بيعلّم الفاتورة مدفوعة؛ مفيش فلوس بتتحرك', 'Licensed payment provider, e-invoicing integration', 'مزود دفع مرخص، ربط الفاتورة الإلكترونية'],
    ['File uploads', 'رفع الملفات', 'Kept in this browser only', 'محفوظة في المتصفح ده بس', 'Object storage with virus scanning', 'تخزين ملفات مع فحص فيروسات'],
    ['Machine translation', 'الترجمة الآلية', 'Pre-written sample', 'نص مكتوب مسبقًا', 'Translation API, original always available', 'خدمة ترجمة، والنص الأصلي متاح دايمًا'],
    ['Escrow, insurance, legal compliance', 'الضمان والتأمين والمطابقة القانونية', 'Not offered', 'غير متاح', 'Only via suitable licensed partners', 'فقط عن طريق شركاء مرخصين']
  ].map(r => `<tr><td><b>${isAr() ? r[1] : r[0]}</b></td><td class="small">${isAr() ? r[3] : r[2]}</td><td class="small">${isAr() ? r[5] : r[4]}</td></tr>`).join('')}</tbody></table></div>
  <div class="card" style="margin-top:28px"><h3>${tx('Contact support', 'تواصل مع الدعم')}</h3><p class="muted small" style="margin:6px 0 12px">${tx('Demo form — messages are not sent anywhere.', 'نموذج تجريبي — الرسائل مش بتتبعت لأي مكان.')}</p><button class="btn btn-secondary" data-act="issue">${ic('flag')} ${tx('Report an issue', 'بلّغ عن مشكلة')}</button></div>
  </div>`;
};
PARTIALS.gloss = () => {
  const q = (S.ui.docQuery || '').toLowerCase().trim();
  const list = GLOSSARY.filter(g => !q || g.join(' ').toLowerCase().includes(q));
  return list.length ? list.map(g => `<div class="card"><h3>${isAr() ? g[1] : g[0]}</h3><p class="small muted" style="margin-top:4px">${isAr() ? g[3] : g[2]}</p></div>`).join('')
    : `<div style="grid-column:1/-1">${emptyState('search', tx('No matching term', 'مفيش مصطلح مطابق'), tx('Try another word.', 'جرّب كلمة تانية.'))}</div>`;
};

VIEWS.notfound = () => `<div class="wrap section">${emptyState('alert', tx('Page not found', 'الصفحة مش موجودة'), tx('The link may be outdated.', 'ممكن اللينك يكون قديم.'), `<a class="btn btn-primary" href="#home">${tx('Back home', 'الرجوع للرئيسية')}</a>`)}</div>`;
