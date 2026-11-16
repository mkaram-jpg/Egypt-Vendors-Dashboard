/* Nawah prototype — category-specific product builders + reusable template form. */
'use strict';

/* option lists: [value, en, ar, descEn, descAr] */
const OPT = {
  nuts: [['almond', 'Almonds', 'لوز'], ['cashew', 'Cashews', 'كاجو'], ['hazelnut', 'Hazelnuts', 'بندق'], ['pistachio', 'Pistachios', 'فستق'], ['peanut', 'Peanuts', 'فول سوداني'], ['walnut', 'Walnuts', 'عين جمل']],
  process: [['raw', 'Raw', 'ني', 'Natural, not roasted', 'طبيعي من غير تحميص'], ['roasted', 'Roasted', 'محمص', 'No salt', 'من غير ملح'], ['roasted-salted', 'Roasted & salted', 'محمص ومملح', 'Most common retail option', 'الأكثر انتشارًا في البيع'], ['flavoured', 'Flavoured', 'بنكهات', 'Coated or seasoned', 'متغطي أو متبّل']],
  flavour: [['smoked', 'Smoked', 'مدخن'], ['chili', 'Chili & lime', 'شطة وليمون'], ['honey', 'Honey', 'عسل'], ['bbq', 'Barbecue', 'باربكيو'], ['other', 'Other — describe in notes', 'أخرى — اكتبها في الملاحظات']],
  grade: [['std', 'Manufacturer’s standard grade', 'الدرجة القياسية عند المصنع'], ['medium', 'Medium whole kernels (e.g. cashew W320)', 'حبات كاملة متوسطة (مثلًا كاجو W320)'], ['large', 'Large whole kernels (e.g. cashew W240)', 'حبات كاملة كبيرة (مثلًا كاجو W240)'], ['pieces', 'Pieces / splits', 'كسر / أنصاص']],
  packG: [['100', '100 g', '١٠٠ جم'], ['150', '150 g', '١٥٠ جم'], ['200', '200 g', '٢٠٠ جم'], ['250', '250 g', '٢٥٠ جم'], ['500', '500 g', '٥٠٠ جم'], ['1000', '1 kg', '١ كجم']],
  pack: [['standup', 'Stand-up pouch with zipper', 'كيس واقف بسوستة', 'Retail shelf standard', 'الشائع على الرفوف'], ['flat', 'Flat pouch', 'كيس مسطح', 'Lower cost, no zipper', 'أرخص، من غير سوستة'], ['jar', 'PET jar', 'برطمان بلاستيك PET', 'Premium, reusable', 'شكل مميز وبيتعاد استخدامه'], ['glass', 'Glass jar', 'برطمان زجاج', 'Gift / premium', 'هدايا / فاخر'], ['bulk', 'Bulk carton (no retail pack)', 'كرتونة جملة (بدون عبوة بيع)', 'For repacking or horeca', 'لإعادة التعبئة أو المطاعم']],
  print: [['printed', 'Printed pack', 'عبوة مطبوعة', 'Plates may be needed', 'ممكن تحتاج أكلاشيهات'], ['label', 'Plain pack + sticker label', 'عبوة سادة + ستيكر', 'Lower setup, short runs', 'تجهيز أقل، كميات صغيرة']],
  artwork: [['ready', 'I have print-ready artwork', 'عندي تصميم جاهز للطباعة'], ['logo', 'I have a logo, need pack design', 'عندي لوجو ومحتاج تصميم العبوة'], ['none', 'I need logo and pack design', 'محتاج لوجو وتصميم عبوة']],
  shelf: [['3', '3 months', '٣ شهور'], ['6', '6 months', '٦ شهور'], ['9', '9 months', '٩ شهور'], ['12', '12 months', '١٢ شهر']],
  labelLang: [['ar', 'Arabic', 'عربي'], ['both', 'Arabic + English', 'عربي + إنجليزي']],
  addrType: [['warehouse', 'Warehouse', 'مخزن'], ['office', 'Office', 'مكتب'], ['retail', 'Retail store', 'محل']],
  scope: [['nuts', 'Nuts (raw material)', 'المكسرات (الخامة)'], ['processing', 'Roasting / seasoning', 'التحميص / التتبيل'], ['packaging', 'Packaging', 'العبوة'], ['printing', 'Printing & plates', 'الطباعة والأكلاشيهات'], ['delivery', 'Delivery to my address', 'التوصيل لعنواني']],
  route: [['existing', 'Manufacturer’s existing formula', 'تركيبة جاهزة من المصنع', 'Faster, lower cost, proven by the manufacturer', 'أسرع وأقل تكلفة، ومجربة عند المصنع'], ['custom', 'Custom development request', 'طلب تطوير تركيبة خاصة', 'Longer; manufacturer proposes a development plan and fee', 'أطول؛ المصنع بيقترح خطة وتكلفة التطوير']],
  tier: [['economy', 'Economy', 'اقتصادي', 'Lowest shelf price', 'أقل سعر على الرف'], ['standard', 'Standard', 'قياسي', 'Mainstream supermarket', 'سوبر ماركت عادي'], ['premium', 'Premium', 'فاخر', 'Stronger fragrance, nicer pack', 'ريحة أقوى وعبوة أشيك']],
  fragrance: [['lemon', 'Lemon', 'ليمون'], ['apple', 'Green apple', 'تفاح أخضر'], ['lavender', 'Lavender', 'لافندر'], ['fresh', 'Fresh / ocean', 'فريش'], ['none', 'Unscented', 'بدون ريحة']],
  color: [['clear', 'Clear', 'شفاف'], ['green', 'Green', 'أخضر'], ['yellow', 'Yellow', 'أصفر'], ['pink', 'Pink', 'وردي'], ['mfr', 'Manufacturer’s suggestion', 'حسب اقتراح المصنع']],
  size: [['500', '500 ml', '٥٠٠ مل'], ['750', '750 ml', '٧٥٠ مل'], ['1000', '1 L', '١ لتر'], ['1250', '1.25 L', '١٫٢٥ لتر'], ['4000', '4 L gallon', 'جركن ٤ لتر']],
  bottle: [['pet-clear', 'Clear PET', 'PET شفاف'], ['pet-tint', 'Tinted PET', 'PET ملون'], ['hdpe', 'Opaque HDPE', 'HDPE معتم']],
  cap: [['flip', 'Flip-top', 'فليب توب'], ['push', 'Push-pull', 'بوش بول'], ['pump', 'Pump', 'بامب'], ['screw', 'Screw cap', 'غطا قلاووظ']],
  label: [['wrap', 'Wrap-around label', 'ليبل لفّة كاملة'], ['front-back', 'Front + back labels', 'ليبل أمامي وخلفي'], ['sleeve', 'Shrink sleeve', 'شرنك سليف'], ['screen', 'Printed on bottle', 'طباعة على العبوة']],
  design: [['have', 'I have label artwork', 'عندي تصميم الليبل'], ['need', 'I need label design', 'محتاج تصميم ليبل']],
  carton: [['12', 'Shipper carton of 12', 'كرتونة ١٢ عبوة'], ['6', 'Shipper carton of 6', 'كرتونة ٦ عبوات'], ['none', 'No outer carton', 'بدون كرتونة']],
  bottleSource: [['manufacturer', 'Manufacturer supplies bottles', 'المصنع يوفّر العبوات'], ['own', 'I will supply bottles', 'أنا هوفّر العبوات'], ['nawah', 'Source bottles through Nawah', 'توريد العبوات عن طريق نواة']],
  docs: [['cr', 'Commercial registry & tax card', 'سجل تجاري وبطاقة ضريبية'], ['reg', 'Product registration / notification status', 'حالة تسجيل أو إخطار المنتج'], ['sds', 'Safety data sheet (SDS)', 'نشرة بيانات السلامة (SDS)'], ['coa', 'Batch test report / COA', 'تقرير تحليل الدفعة / COA'], ['labelrev', 'Label information review', 'مراجعة بيانات الليبل']],
  mode: [['finished', 'Finished furniture', 'أثاث جاهز', 'A manufacturer delivers finished tables', 'مصنع يسلّمك الترابيزات جاهزة'], ['material', 'Material sourcing', 'توريد خامات', 'Timber, boards and parts for your workshop', 'خشب وألواح ومكونات لورشتك']],
  ttype: [['dining', 'Dining table', 'ترابيزة سفرة'], ['coffee', 'Coffee table', 'ترابيزة صالون'], ['desk', 'Office desk', 'مكتب'], ['side', 'Side table', 'ترابيزة جانبية'], ['cafe', 'Café table', 'ترابيزة كافيه']],
  shape: [['rect', 'Rectangular', 'مستطيلة'], ['square', 'Square', 'مربعة'], ['round', 'Round', 'دائرية'], ['oval', 'Oval', 'بيضاوي']],
  unit: [['cm', 'Centimetres (cm)', 'سنتيمتر (سم)'], ['in', 'Inches (in)', 'بوصة (in)']],
  thick: [['18', '18 mm', '١٨ مم'], ['25', '25 mm', '٢٥ مم'], ['30', '30 mm', '٣٠ مم'], ['40', '40 mm', '٤٠ مم']],
  wood: [['beech', 'Solid beech', 'زان طبيعي'], ['oak', 'Solid oak', 'أرو طبيعي'], ['pine', 'Swedish pine', 'موسكي'], ['walnut', 'Walnut', 'جوز'], ['mdf', 'MDF with wood veneer', 'MDF بقشرة خشب'], ['mixed', 'Wood top + metal legs', 'سطح خشب + أرجل معدن']],
  finish: [['oil', 'Natural oil', 'زيت طبيعي'], ['pu-matte', 'Matte PU lacquer', 'دهان PU مطفي'], ['pu-gloss', 'Gloss lacquer', 'دهان لامع'], ['stain', 'Stain + lacquer', 'صبغة + ورنيش']],
  wcolor: [['natural', 'Natural', 'طبيعي'], ['walnut', 'Walnut tone', 'لون جوز'], ['dark', 'Dark brown', 'بني غامق'], ['white', 'White-wash', 'أبيض مطفي']],
  assembly: [['assembled', 'Delivered assembled', 'تتسلم مركبة'], ['flat', 'Flat-pack (assembly by me)', 'مفككة (التركيب عليّا)']],
  material: [['beech', 'Beech boards', 'ألواح زان'], ['oak', 'Oak boards', 'ألواح أرو'], ['pine', 'Swedish pine', 'خشب موسكي'], ['mdf', 'MDF sheet', 'لوح MDF'], ['ply', 'Plywood sheet', 'لوح أبلكاش'], ['legs', 'Table legs', 'أرجل ترابيزات'], ['hardware', 'Hardware set', 'طقم إكسسوارات']],
  munit: [['mm', 'boards (pcs)', 'ألواح (قطعة)'], ['m3', 'm³', 'م³'], ['sheet', 'sheets', 'لوح'], ['pcs', 'pieces', 'قطعة'], ['lm', 'linear m', 'متر طولي']],
  services: [['cut', 'Cut to size', 'تقطيع بالمقاس'], ['plane', 'Planing', 'رندة'], ['cnc', 'CNC shaping', 'تشكيل CNC'], ['edge', 'Edge banding', 'شريط حرف'], ['kiln', 'Kiln-dried confirmation', 'تأكيد تجفيف بالفرن']]
};
const optLabel = (list, v) => { const o = OPT[list].find(x => String(x[0]) === String(v)); return o ? (isAr() ? o[2] : o[1]) : (v || '—'); };
const optLabels = (list, arr) => (arr && arr.length ? arr.map(v => optLabel(list, v)).join(isAr() ? '، ' : ', ') : '—');

const P = id => `projects.${id}.spec.`;
const MSG = { req: () => tx('Required to get comparable quotes.', 'مطلوب عشان العروض تبقى قابلة للمقارنة.'), pick: () => tx('Choose at least one option.', 'اختار اختيار واحد على الأقل.'), pos: () => tx('Enter a quantity above zero.', 'اكتب كمية أكبر من صفر.'), date: () => tx('Pick a date at least 14 days from today; production and sampling need time.', 'اختار تاريخ بعد ١٤ يوم على الأقل؛ العينة والإنتاج محتاجين وقت.') };
function vReq(errs, path, v) { if (v === '' || v == null || (Array.isArray(v) && !v.length)) errs[path] = Array.isArray(v) ? MSG.pick() : MSG.req(); }
function vPos(errs, path, v) { if (!(Number(v) > 0)) errs[path] = MSG.pos(); }
function vDate(errs, path, v) { if (!v) errs[path] = MSG.req(); else if (v < addDays(TODAY, 14)) errs[path] = MSG.date(); }

/* ---------- builder definitions ---------- */
const BUILDERS = {
  'builder-nuts': { pid: 'p-nuts', steps: [
    { en: 'Product', ar: 'المنتج', r: () => { const s = proj('p-nuts').spec, b = P('p-nuts');
      return `${fChips(b + 'nuts', tx('Nut type or mix', 'نوع المكسرات أو الخلطة'), OPT.nuts, { req: 1, hint: tx('Pick more than one to request a mix.', 'اختار أكتر من نوع لو عايز خلطة.') })}
      ${s.nuts.length > 1 ? fText(b + 'mix', tx('Mix ratio (optional)', 'نسبة الخلطة (اختياري)'), { ph: '40% cashew / 30% almond / 30% hazelnut', hint: tx('Leave empty to let suppliers propose.', 'سيبها فاضية والمورد يقترح.') }) : ''}
      ${fRadio(b + 'process', tx('Processing', 'المعالجة'), OPT.process, { req: 1 })}
      ${s.process === 'flavoured' ? fSelect(b + 'flavour', tx('Flavour', 'النكهة'), OPT.flavour, { req: 1 }) : ''}
      ${fSelect(b + 'grade', tx('Grade / kernel size', 'الدرجة / حجم الحبة'), OPT.grade, { hint: tx('Suppliers name grades differently; each quote states its equivalent.', 'كل مورد بيسمي الدرجات بطريقة مختلفة؛ وكل عرض بيوضح المقابل عنده.') })}`; },
      v: e => { const s = proj('p-nuts').spec, b = P('p-nuts'); vReq(e, b + 'nuts', s.nuts); vReq(e, b + 'process', s.process); if (s.process === 'flavoured') vReq(e, b + 'flavour', s.flavour); } },
    { en: 'Pack & quantity', ar: 'العبوة والكمية', r: () => { const s = proj('p-nuts').spec, b = P('p-nuts');
      return `${fRadio(b + 'packG', tx('Pack weight', 'وزن العبوة'), OPT.packG, { req: 1 })}
      ${fNum(b + 'packs', tx('Number of packs', 'عدد العبوات'), tx('packs', 'عبوة'), { req: 1, step: 50 })}
      <div data-live="nutsCalc"></div>
      ${fRadio(b + 'pack', tx('Packaging', 'نوع العبوة'), OPT.pack, { req: 1, wide: 1 })}
      ${s.pack !== 'bulk' ? fRadio(b + 'print', tx('Printing', 'الطباعة'), OPT.print, { wide: 1 }) : ''}`; },
      v: e => { const s = proj('p-nuts').spec, b = P('p-nuts'); vReq(e, b + 'packG', s.packG); vPos(e, b + 'packs', s.packs); vReq(e, b + 'pack', s.pack); } },
    { en: 'Brand & shelf life', ar: 'البراند والصلاحية', r: () => { const b = P('p-nuts');
      return `${fRadio(b + 'artwork', tx('Brand artwork', 'تصميم البراند'), OPT.artwork, { req: 1, wide: 1 })}
      <div class="note">${ic('info')}<span>${tx('Need design help? Packaging design is a paid add-on service (planned). Suppliers price printing only from final artwork.', 'محتاج تصميم؟ تصميم التغليف خدمة إضافية مدفوعة (مخططة). المورد بيسعّر الطباعة على التصميم النهائي بس.')}</span></div>
      ${fRadio(b + 'shelf', tx('Shelf-life target', 'مدة الصلاحية المستهدفة'), OPT.shelf, { req: 1, hint: tx('A target only. The manufacturer confirms what is achievable for this process and pack.', 'ده هدف بس. المصنع هو اللي يأكد المدة الممكنة حسب التصنيع والعبوة.') })}
      ${fRadio(b + 'labelLang', tx('Label language', 'لغة الليبل'), OPT.labelLang)}
      <div class="note warn">${ic('alert')}<span>${tx('Labelling and food-safety requirements are confirmed by the manufacturer and your regulatory advisor. Selecting options here does not establish compliance.', 'متطلبات الليبل وسلامة الغذاء بيأكدها المصنع ومستشارك القانوني/التنظيمي. اختيارك هنا مش معناه إن المنتج مطابق.')}</span></div>`; },
      v: e => { const s = proj('p-nuts').spec, b = P('p-nuts'); vReq(e, b + 'artwork', s.artwork); vReq(e, b + 'shelf', s.shelf); } },
    { en: 'Sample & delivery', ar: 'العينة والتسليم', r: () => { const s = proj('p-nuts').spec, b = P('p-nuts');
      return `<div class="field">${fToggle(b + 'sample', tx('Request a sample before production', 'اطلب عينة قبل الإنتاج'), { hint: tx('Strongly recommended. Sample charges and whether they are deductible appear in each quote.', 'ننصح بيها جدًا. تكلفة العينة وهل بتتخصم بتظهر في كل عرض.') })}</div>
      ${s.sample ? fNum(b + 'samplePacks', tx('Sample packs', 'عدد عبوات العينة'), tx('packs', 'عبوة'), { min: 1 }) : ''}
      <div class="grid g2">${fText(b + 'city', tx('Delivery city / area', 'مدينة / منطقة التسليم'), { req: 1, ph: tx('e.g. Nasr City, Cairo', 'مثال: مدينة نصر، القاهرة') })}
      ${fText(b + 'date', tx('Target delivery date', 'تاريخ التسليم المستهدف'), { req: 1, type: 'date' })}</div>
      ${fRadio(b + 'addrType', tx('Delivery to', 'التسليم في'), OPT.addrType)}
      ${fChips(b + 'scope', tx('What should quotes include?', 'العرض يشمل إيه؟'), OPT.scope, { req: 1, wide: 1, hint: tx('Each included item must be priced on its own line, so quotes can be compared.', 'كل بند مشمول لازم يتسعّر في سطر لوحده عشان المقارنة.') })}
      ${fNum(b + 'budget', tx('Target budget (optional, private)', 'الميزانية المستهدفة (اختياري، خاص بيك)'), isAr() ? 'ج.م' : 'EGP', { step: 1000, hint: tx('Only used to show budget fit against real quotes. Not shared with suppliers.', 'بتستخدم بس لمقارنة العروض الفعلية بميزانيتك. مش بتتبعت للموردين.') })}
      ${fArea(b + 'notes', tx('Notes for suppliers (optional)', 'ملاحظات للموردين (اختياري)'), { ph: tx('Anything else suppliers should know', 'أي حاجة تانية المورد لازم يعرفها') })}`; },
      v: e => { const s = proj('p-nuts').spec, b = P('p-nuts'); vReq(e, b + 'city', s.city); vDate(e, b + 'date', s.date); vReq(e, b + 'scope', s.scope); } },
    { en: 'Review & invite', ar: 'مراجعة ودعوة', review: true }
  ] },

  'builder-dish': { pid: 'p-dish', steps: [
    { en: 'Formula', ar: 'التركيبة', r: () => { const s = proj('p-dish').spec, b = P('p-dish');
      return `${fRadio(b + 'route', tx('Formula route', 'مصدر التركيبة'), OPT.route, { req: 1, wide: 1 })}
      ${s.route === 'custom' ? `<div class="note warn">${ic('info')}<span>${tx('Custom development adds time for trials and stability checks, and may carry a development fee. The manufacturer owns the formulation work; Nawah does not provide recipes.', 'التطوير الخاص بياخد وقت للتجارب واختبارات الثبات، وممكن يكون له تكلفة. شغل التركيبة مسؤولية المصنع؛ ونواة مش بتقدم تركيبات.')}</span></div>` : ''}
      ${fRadio(b + 'tier', tx('Market positioning', 'مستوى المنتج في السوق'), OPT.tier, { req: 1, hint: tx('Guides the manufacturer’s proposal on concentration, fragrance and pack finish.', 'بيوجّه اقتراح المصنع للتركيز والريحة وشكل العبوة.') })}`; },
      v: e => { const s = proj('p-dish').spec, b = P('p-dish'); vReq(e, b + 'route', s.route); vReq(e, b + 'tier', s.tier); } },
    { en: 'Fragrance & colour', ar: 'الريحة واللون', r: () => { const b = P('p-dish');
      return `${fChips(b + 'fragrance', tx('Fragrance preference', 'الريحة المفضلة'), OPT.fragrance, { req: 1 })}${fRadio(b + 'color', tx('Colour preference', 'اللون المفضل'), OPT.color)}`; },
      v: e => { const s = proj('p-dish').spec; vReq(e, P('p-dish') + 'fragrance', s.fragrance); } },
    { en: 'Bottle & quantity', ar: 'العبوة والكمية', r: () => { const b = P('p-dish');
      return `${fRadio(b + 'size', tx('Bottle size', 'حجم العبوة'), OPT.size, { req: 1 })}${fRadio(b + 'bottle', tx('Bottle type', 'نوع العبوة'), OPT.bottle, { req: 1 })}${fRadio(b + 'cap', tx('Cap', 'الغطا'), OPT.cap, { req: 1 })}
      ${fNum(b + 'units', tx('Number of units', 'عدد العبوات'), tx('bottles', 'عبوة'), { req: 1, step: 500 })}<div data-live="dishCalc"></div>`; },
      v: e => { const s = proj('p-dish').spec, b = P('p-dish'); vReq(e, b + 'size', s.size); vReq(e, b + 'bottle', s.bottle); vReq(e, b + 'cap', s.cap); vPos(e, b + 'units', s.units); } },
    { en: 'Labelling & packing', ar: 'الليبل والتغليف', r: () => { const b = P('p-dish');
      return `${fRadio(b + 'label', tx('Label type', 'نوع الليبل'), OPT.label, { wide: 1 })}${fRadio(b + 'design', tx('Label artwork', 'تصميم الليبل'), OPT.design)}${fRadio(b + 'carton', tx('Outer packing', 'التغليف الخارجي'), OPT.carton)}
      ${fRadio(b + 'bottleSource', tx('Who supplies the bottles?', 'مين يوفّر العبوات؟'), OPT.bottleSource, { wide: 1 })}
      ${proj('p-dish').spec.bottleSource === 'nawah' ? `<div class="note">${ic('layers')}<span>${tx('A linked packaging RFQ will be created for bottles and caps (planned feature). Packaging suppliers like Borg Plast (demo) can quote it.', 'هيتعمل طلب تغليف مربوط للعبوات والأغطية (خاصية مخططة). موردين تغليف زي برج بلاست (تجريبي) يقدروا يسعّروه.')}</span></div>` : ''}`; } },
    { en: 'Sample & documents', ar: 'العينة والمستندات', r: () => { const b = P('p-dish');
      return `<div class="field">${fToggle(b + 'sample', tx('Request samples before production', 'اطلب عينات قبل الإنتاج'))}</div>
      ${fChips(b + 'docs', tx('Documents to request from the manufacturer', 'المستندات المطلوبة من المصنع'), OPT.docs, { wide: 1 })}
      <div class="note warn">${ic('alert')}<span>${tx('Product safety and regulatory compliance are the manufacturer’s and brand owner’s responsibility, confirmed by documents and, where required, by the relevant authority. Choosing options here does not establish safety or compliance.', 'سلامة المنتج ومطابقته للوائح مسؤولية المصنع وصاحب البراند، وبتتأكد بالمستندات ومن الجهة المختصة لو مطلوب. اختيارك هنا مش معناه إن المنتج آمن أو مطابق.')}</span></div>
      <div class="grid g2">${fText(b + 'city', tx('Delivery city / area', 'مدينة / منطقة التسليم'), { req: 1, ph: tx('e.g. Sheikh Zayed, Giza', 'مثال: الشيخ زايد، الجيزة') })}${fText(b + 'date', tx('Target delivery date', 'تاريخ التسليم المستهدف'), { req: 1, type: 'date' })}</div>`; },
      v: e => { const s = proj('p-dish').spec, b = P('p-dish'); vReq(e, b + 'city', s.city); vDate(e, b + 'date', s.date); } },
    { en: 'Review & invite', ar: 'مراجعة ودعوة', review: true }
  ] },

  'builder-table': { pid: 'p-table', get steps() { return proj('p-table').spec.mode === 'material' ? TABLE_MAT : TABLE_FIN; } },
  'builder-custom': { pid: 'p-custom', steps: [
    { en: 'Details', ar: 'التفاصيل', r: () => renderTemplateForm(), v: e => validateTemplate(e) },
    { en: 'Review & submit', ar: 'مراجعة وإرسال', review: true }
  ] }
};
const modeField = () => `${fRadio(P('p-table') + 'mode', tx('What do you need?', 'محتاج إيه؟'), OPT.mode, { req: 1, wide: 1 })}`;
const TABLE_FIN = [
  { en: 'Type', ar: 'النوع', r: () => { const b = P('p-table'); return `${modeField()}${fRadio(b + 'ttype', tx('Table type', 'نوع الترابيزة'), OPT.ttype, { req: 1 })}${fRadio(b + 'shape', tx('Shape', 'الشكل'), OPT.shape)}`; },
    v: e => vReq(e, P('p-table') + 'ttype', proj('p-table').spec.ttype) },
  { en: 'Dimensions', ar: 'المقاسات', r: () => { const s = proj('p-table').spec, b = P('p-table'), u = s.unit === 'in' ? 'in' : tx('cm', 'سم');
    return `${fRadio(b + 'unit', tx('Measurement unit', 'وحدة القياس'), OPT.unit)}
    <div class="grid g3">${fNum(b + 'L', tx('Length', 'الطول'), u, { req: 1 })}${fNum(b + 'W', s.shape === 'round' ? tx('Diameter', 'القطر') : tx('Width', 'العرض'), u, { req: 1 })}${fNum(b + 'H', tx('Height', 'الارتفاع'), u, { req: 1 })}</div>
    <div data-live="tableCalc"></div>${fRadio(b + 'thick', tx('Top thickness', 'سُمك السطح'), OPT.thick)}`; },
    v: e => { const s = proj('p-table').spec, b = P('p-table'); vPos(e, b + 'L', s.L); vPos(e, b + 'W', s.W); vPos(e, b + 'H', s.H); } },
  { en: 'Material & finish', ar: 'الخامة والتشطيب', r: () => { const b = P('p-table'); return `${fRadio(b + 'wood', tx('Wood / material', 'الخشب / الخامة'), OPT.wood, { req: 1 })}${fRadio(b + 'finish', tx('Finish', 'التشطيب'), OPT.finish, { req: 1 })}${fRadio(b + 'color', tx('Colour', 'اللون'), OPT.wcolor)}`; },
    v: e => { const s = proj('p-table').spec, b = P('p-table'); vReq(e, b + 'wood', s.wood); vReq(e, b + 'finish', s.finish); } },
  { en: 'Quantity & design', ar: 'الكمية والتصميم', r: () => { const s = proj('p-table').spec, b = P('p-table');
    return `${fNum(b + 'qty', tx('Quantity', 'الكمية'), tx('tables', 'ترابيزة'), { req: 1 })}
    <div class="field"><span class="label">${tx('Reference images or drawings', 'صور مرجعية أو رسومات')}</span>
    <label class="drop">${ic('upload')} ${tx('JPG, PNG or PDF up to 10 MB. Stored in this browser only.', 'JPG أو PNG أو PDF لحد ١٠ ميجا. بتتحفظ في المتصفح ده بس.')}<input type="file" accept="image/*,.pdf" multiple data-upload="table-images"></label>
    ${s.images.length ? `<div class="thumbs">${s.images.map(im => im.preview ? `<img src="${im.preview}" alt="${esc(im.name)}">` : `<span class="pill">${ic('file')} ${esc(im.name)}</span>`).join('')}</div>` : ''}</div>
    ${fArea(b + 'notes', tx('Design notes', 'ملاحظات التصميم'), { ph: tx('Edge profile, leg style, drawer…', 'شكل الحرف، شكل الرجل، درج…') })}`; },
    v: e => vPos(e, P('p-table') + 'qty', proj('p-table').spec.qty) },
  { en: 'Assembly & delivery', ar: 'التركيب والتسليم', r: () => { const b = P('p-table');
    return `${fRadio(b + 'assembly', tx('Assembly', 'التركيب'), OPT.assembly, { wide: 1 })}<div class="field">${fToggle(b + 'install', tx('Include on-site installation', 'يشمل التركيب في الموقع'))}</div>
    <div class="grid g2">${fText(b + 'city', tx('Delivery city / area', 'مدينة / منطقة التسليم'), { req: 1, ph: tx('e.g. New Cairo', 'مثال: القاهرة الجديدة') })}${fText(b + 'date', tx('Target delivery date', 'تاريخ التسليم المستهدف'), { req: 1, type: 'date' })}</div>
    <div class="field">${fToggle(b + 'prototype', tx('Request one prototype table before bulk production', 'اطلب ترابيزة نموذج قبل الإنتاج الكامل'), { hint: tx('Prototype cost and time are quoted by the manufacturer.', 'تكلفة ووقت النموذج بيحددهم المصنع.') })}</div>`; },
    v: e => { const s = proj('p-table').spec, b = P('p-table'); vReq(e, b + 'city', s.city); vDate(e, b + 'date', s.date); } },
  { en: 'Review & invite', ar: 'مراجعة ودعوة', review: true }
];
const TABLE_MAT = [
  { en: 'Type', ar: 'النوع', r: () => `${modeField()}<div class="note">${ic('layers')}<span>${tx('Material sourcing collects quantities and units for timber and parts, and invites timber and component suppliers instead of furniture makers.', 'توريد الخامات بيجمع الكميات والوحدات للخشب والمكونات، وبيدعو موردين خشب ومكونات بدل مصانع الأثاث.')}</span></div>` },
  { en: 'Materials list', ar: 'قائمة الخامات', r: () => { const s = proj('p-table').spec;
    return `<div class="stack">${s.materials.map((m, i) => { const b = `projects.p-table.spec.materials.${i}.`; const board = ['beech', 'oak', 'pine'].includes(m.m) && m.u === 'mm';
      return `<div class="mat-row">${fSelect(b + 'm', tx('Material', 'الخامة'), OPT.material)}
      ${fNum(b + 't', tx('Thickness', 'السُمك'), tx('mm', 'مم'))}${fNum(b + 'w', tx('Width', 'العرض'), tx('mm', 'مم'))}${fNum(b + 'l', tx('Length', 'الطول'), tx('mm', 'مم'))}
      <div class="field"><label for="${fid(b + 'q')}">${tx('Qty', 'الكمية')}</label><div class="input-unit"><input class="input num" type="number" min="0" id="${fid(b + 'q')}" data-bind="${b}q" data-num value="${m.q}"><select class="unit" data-bind="${b}u" aria-label="${tx('Unit', 'الوحدة')}">${OPT.munit.map(u => `<option value="${u[0]}" ${m.u === u[0] ? 'selected' : ''}>${isAr() ? u[2] : u[1]}</option>`).join('')}</select></div></div>
      <button class="icon-btn" data-act="matDel" data-i="${i}" aria-label="${tx('Remove row', 'حذف السطر')}">${ic('x')}</button>
      ${!board && ['beech', 'oak', 'pine'].includes(m.m) ? `<span class="faint" style="grid-column:1/-1">${tx('Dimensions are used for volume only when the unit is boards (pcs).', 'المقاسات بتتحسب في الحجم بس لما الوحدة تكون ألواح (قطعة).')}</span>` : ''}</div>`; }).join('')}
    <button class="btn btn-secondary btn-sm" data-act="matAdd" style="align-self:flex-start">${ic('plus')} ${tx('Add material', 'إضافة خامة')}</button>
    <div data-live="matCalc"></div></div>`; },
    v: e => { const s = proj('p-table').spec; if (!s.materials.length) e['projects.p-table.spec.materials'] = MSG.pick(); s.materials.forEach((m, i) => { vReq(e, `projects.p-table.spec.materials.${i}.m`, m.m); vPos(e, `projects.p-table.spec.materials.${i}.q`, m.q); }); } },
  { en: 'Services & delivery', ar: 'الخدمات والتسليم', r: () => { const b = P('p-table');
    return `${fChips(b + 'services', tx('Processing services', 'خدمات التشغيل'), OPT.services)}${fText(b + 'moisture', tx('Target moisture content', 'نسبة الرطوبة المستهدفة'), { hint: tx('Supplier confirms what they can certify.', 'المورد بيأكد اللي يقدر يضمنه.'), dir: 'ltr' })}
    <div class="grid g2">${fText(b + 'city', tx('Delivery city / area', 'مدينة / منطقة التسليم'), { req: 1 })}${fText(b + 'date', tx('Needed by', 'مطلوب قبل'), { req: 1, type: 'date' })}</div>`; },
    v: e => { const s = proj('p-table').spec, b = P('p-table'); vReq(e, b + 'city', s.city); vDate(e, b + 'date', s.date); } },
  { en: 'Review & invite', ar: 'مراجعة ودعوة', review: true }
];

/* ---------- reusable template form ---------- */
function renderTemplateForm() {
  const p = proj('p-custom'); const T = S.templates; const t = T[p.spec.tpl] || T.tshirt;
  return `${fieldWrap('projects.p-custom.spec.tpl', tx('Product template', 'قالب المنتج'), `<div class="opts">${Object.entries(T).map(([k, v]) => `<label class="opt"><input type="radio" name="tpl" value="${k}" data-bind="projects.p-custom.spec.tpl" ${p.spec.tpl === k ? 'checked' : ''}><span class="mark"></span><span class="t">${L(v)}</span></label>`).join('')}</div>`, { group: true, hint: tx('Every category has a template managed by the ops team. The form below is generated from it.', 'كل قسم له قالب بيديره فريق التشغيل، والنموذج اللي تحت بيتولد منه.') })}
  <div class="grid g2">${t.fields.map(f => tplField(f)).join('')}</div>
  <div class="grid g2">${fText('projects.p-custom.spec.city', tx('Delivery city / area', 'مدينة / منطقة التسليم'), { req: 1 })}${fText('projects.p-custom.spec.date', tx('Target delivery date', 'تاريخ التسليم المستهدف'), { req: 1, type: 'date' })}</div>`;
}
function tplField(f) {
  const path = `projects.p-custom.spec.vals.${f.k}`; const lab = L(f); const o = { req: f.req };
  const opts = (f.opts || []).map(x => [x[0], x[1], x[2] || x[1]]);
  if (f.type === 'select') return fSelect(path, lab, opts, o);
  if (f.type === 'chips') return `<div style="grid-column:1/-1">${fChips(path, lab, opts, o)}</div>`;
  if (f.type === 'number') return fNum(path, lab, L(f.unit) || '#', o);
  if (f.type === 'textarea') return `<div style="grid-column:1/-1">${fArea(path, lab, { ...o, ph: f.ph })}</div>`;
  if (f.type === 'toggle') return `<div class="field" style="justify-content:flex-end">${fToggle(path, lab)}</div>`;
  return fText(path, lab, { ...o, ph: f.ph });
}
function validateTemplate(e) {
  const p = proj('p-custom'); const t = S.templates[p.spec.tpl];
  t.fields.filter(f => f.req).forEach(f => { const v = p.spec.vals[f.k]; const path = `projects.p-custom.spec.vals.${f.k}`; f.type === 'number' ? vPos(e, path, v) : vReq(e, path, v); });
  vReq(e, 'projects.p-custom.spec.city', p.spec.city); vDate(e, 'projects.p-custom.spec.date', p.spec.date);
}

/* ---------- spec summary (shared by review, project, supplier and admin views) ---------- */
function specRows(p) { const rows = specRowsBase(p); if (p.design || S.brand.name) { const d = p.design; rows.push([tx('Brand & design concept', 'البراند وتصوّر التصميم'), `<bdi dir="auto">${esc(d ? d.name : S.brand.name)}</bdi> · ${L(STYLES.find(x => x.id === (d ? d.style : S.brand.style)))}${d ? ' · ' + L(pitem(d.item)) : ''} <span class="faint">(${tx('concept reference', 'مرجع مبدئي')})</span>`]); } return rows; }
function specRowsBase(p) {
  const s = p.spec;
  if (p.id === 'p-nuts') return [
    [tx('Product', 'المنتج'), optLabels('nuts', s.nuts) + (s.nuts.length > 1 ? ` (${tx('mix', 'خلطة')}${s.mix ? ': ' + esc(s.mix) : ''})` : '')],
    [tx('Processing', 'المعالجة'), optLabel('process', s.process) + (s.process === 'flavoured' ? ' — ' + optLabel('flavour', s.flavour) : '')],
    [tx('Grade', 'الدرجة'), optLabel('grade', s.grade)],
    [tx('Quantity', 'الكمية'), `<span class="num ltr">${nf(s.packs || 0)} × ${nf(s.packG || 0)} g = ${nf((s.packs * s.packG) / 1000 || 0, 1)} kg</span>`],
    [tx('Packaging', 'العبوة'), optLabel('pack', s.pack) + (s.pack !== 'bulk' ? ' · ' + optLabel('print', s.print) : '')],
    [tx('Artwork', 'التصميم'), optLabel('artwork', s.artwork)],
    [tx('Shelf-life target', 'الصلاحية المستهدفة'), optLabel('shelf', s.shelf) + ` <span class="faint">(${tx('to be confirmed by manufacturer', 'يأكدها المصنع')})</span>`],
    [tx('Sample', 'العينة'), s.sample ? tx(`Yes — ${s.samplePacks} packs`, `أيوه — ${s.samplePacks} عبوات`) : tx('No', 'لأ')],
    [tx('Delivery', 'التسليم'), `${esc(s.city) || '—'} · ${optLabel('addrType', s.addrType)} · ${fdate(s.date)}`],
    [tx('Quote must include', 'العرض يشمل'), optLabels('scope', s.scope)]
  ];
  if (p.id === 'p-dish') return [
    [tx('Formula route', 'مصدر التركيبة'), optLabel('route', s.route)], [tx('Positioning', 'المستوى'), optLabel('tier', s.tier)],
    [tx('Fragrance · colour', 'الريحة · اللون'), `${optLabels('fragrance', s.fragrance)} · ${optLabel('color', s.color)}`],
    [tx('Bottle', 'العبوة'), `${optLabel('size', s.size)} · ${optLabel('bottle', s.bottle)} · ${optLabel('cap', s.cap)}`],
    [tx('Quantity', 'الكمية'), `<span class="num ltr">${nf(s.units || 0)} × ${nf(s.size || 0)} ml = ${nf((s.units * s.size) / 1000 || 0)} L</span>`],
    [tx('Labelling', 'الليبل'), `${optLabel('label', s.label)} · ${optLabel('design', s.design)} · ${optLabel('carton', s.carton)}`],
    [tx('Bottles supplied by', 'العبوات من'), optLabel('bottleSource', s.bottleSource)], [tx('Documents requested', 'المستندات المطلوبة'), optLabels('docs', s.docs)],
    [tx('Delivery', 'التسليم'), `${esc(s.city) || '—'} · ${fdate(s.date)}`]
  ];
  if (p.id === 'p-table') return s.mode === 'material' ? [
    [tx('Request', 'الطلب'), optLabel('mode', 'material')],
    ...s.materials.map((m, i) => [`${tx('Item', 'بند')} ${i + 1}`, `${optLabel('material', m.m)} · ${m.u === 'mm' ? `<span class="num" dir="ltr">${m.t}×${m.w}×${m.l} mm</span> · ` : ''}<span class="num ltr">${nf(m.q || 0)}</span> ${optLabel('munit', m.u)}`]),
    [tx('Services', 'الخدمات'), optLabels('services', s.services)], [tx('Moisture target', 'الرطوبة المستهدفة'), ltr(s.moisture || '—')], [tx('Delivery', 'التسليم'), `${esc(s.city) || '—'} · ${fdate(s.date)}`]
  ] : [
    [tx('Request', 'الطلب'), optLabel('mode', 'finished')], [tx('Type', 'النوع'), `${optLabel('ttype', s.ttype)} · ${optLabel('shape', s.shape)}`],
    [tx('Dimensions', 'المقاسات'), `<span class="num" dir="ltr">${s.L} × ${s.W} × ${s.H} ${s.unit}</span> · ${tx('top', 'سطح')} ${s.thick} ${tx('mm', 'مم')}`],
    [tx('Material · finish', 'الخامة · التشطيب'), `${optLabel('wood', s.wood)} · ${optLabel('finish', s.finish)} · ${optLabel('wcolor', s.color)}`],
    [tx('Quantity', 'الكمية'), `<span class="num ltr">${nf(s.qty || 0)}</span> ${tx('tables', 'ترابيزة')}`], [tx('References', 'المراجع'), s.images.length ? tx(`${s.images.length} file(s)`, `${s.images.length} ملف`) : '—'],
    [tx('Assembly', 'التركيب'), optLabel('assembly', s.assembly) + (s.install ? ' · ' + tx('with installation', 'مع التركيب') : '')], [tx('Prototype', 'نموذج أولي'), s.prototype ? tx('Requested', 'مطلوب') : tx('No', 'لأ')],
    [tx('Delivery', 'التسليم'), `${esc(s.city) || '—'} · ${fdate(s.date)}`]
  ];
  const t = S.templates[s.tpl] || S.templates.other;
  return [[tx('Template', 'القالب'), L(t)], ...t.fields.map(f => { const v = s.vals[f.k]; let out = v;
    if (f.opts) out = (Array.isArray(v) ? v : [v]).filter(Boolean).map(x => { const o = f.opts.find(z => z[0] === x); return o ? (isAr() ? (o[2] || o[1]) : o[1]) : x; }).join(isAr() ? '، ' : ', ');
    else if (f.type === 'toggle') out = v ? tx('Yes', 'أيوه') : tx('No', 'لأ'); else if (f.type === 'number' && v !== '' && v != null) out = `<span class="num ltr">${nf(v)}</span> ${L(f.unit)}`; else out = esc(v);
    return [L(f), out || '—']; }), [tx('Delivery', 'التسليم'), `${esc(s.city) || '—'} · ${fdate(s.date)}`]];
}
const kvList = rows => `<dl class="kv">${rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('')}</dl>`;

/* ---------- live partials ---------- */
PARTIALS.nutsCalc = () => { const s = proj('p-nuts').spec; const kg = (Number(s.packs) || 0) * (Number(s.packG) || 0) / 1000;
  return `<div class="calc" aria-live="polite"><span>${nf(s.packs || 0)} packs × ${nf(s.packG || 0)} g =</span><b>${nf(kg, 1)} kg</b><span>${tx('of finished product', 'منتج نهائي')}</span></div>
  <p class="faint" style="margin-top:6px">${tx('Illustrative calculation. Suppliers may quote per kg or per pack; Nawah converts both to this quantity before comparing.', 'حساب توضيحي. الموردين ممكن يسعّروا بالكيلو أو بالعبوة؛ ونواة بتحوّل الاتنين لنفس الكمية قبل المقارنة.')}</p>`; };
PARTIALS.dishCalc = () => { const s = proj('p-dish').spec; const L_ = (Number(s.units) || 0) * (Number(s.size) || 0) / 1000; const per = s.carton === 'none' ? 0 : Number(s.carton);
  return `<div class="calc" aria-live="polite"><span>${nf(s.units || 0)} × ${nf(s.size || 0)} ml =</span><b>${nf(L_)} L</b>${per ? `<span>· ${nf(Math.ceil((s.units || 0) / per))} cartons of ${per}</span>` : ''}</div>`; };
PARTIALS.tableCalc = () => { const s = proj('p-table').spec; const f = s.unit === 'in' ? 2.54 : 1 / 2.54; const o = s.unit === 'in' ? 'cm' : 'in';
  return `<div class="calc"><span>${tx('Converted', 'بالتحويل')}:</span><b>${[s.L, s.W, s.H].map(v => nf((Number(v) || 0) * f, 1)).join(' × ')} ${o}</b></div>`; };
PARTIALS.matCalc = () => { const s = proj('p-table').spec; let vol = 0; s.materials.forEach(m => { if (m.u === 'mm') vol += (m.t * m.w * m.l * m.q) / 1e9; if (m.u === 'm3') vol += Number(m.q) || 0; });
  return `<div class="calc"><span>${tx('Timber volume', 'حجم الخشب')} =</span><b>${nf(vol, 3)} m³</b><span>${tx('(boards: thickness × width × length × qty)', '(الألواح: سُمك × عرض × طول × عدد)')}</span></div><p class="faint" style="margin-top:6px">${tx('Suppliers usually price timber per m³; add a waste allowance agreed with your workshop.', 'الموردين غالبًا بيسعّروا الخشب بالمتر المكعب؛ زوّد نسبة هالك تتفق عليها مع الورشة.')}</p>`; };

/* ---------- brief assistant ---------- */
function briefChecks(p) {
  const s = p.spec; const c = [];
  const add = (ok, en, ar, tip) => c.push({ ok, en, ar, tip });
  if (p.id === 'p-nuts') {
    add(s.nuts.length, 'Nut type selected', 'تم اختيار نوع المكسرات');
    add(!(s.nuts.length > 1) || s.mix, 'Mix ratio stated (or left to supplier)', 'نسبة الخلطة محددة (أو متروكة للمورد)', 1);
    add(s.process && (s.process !== 'flavoured' || s.flavour), 'Processing defined', 'المعالجة محددة');
    add(s.packG && s.packs > 0, 'Pack weight and quantity', 'وزن العبوة والكمية');
    add(s.pack, 'Packaging type', 'نوع العبوة');
    add(s.artwork, 'Artwork status — suppliers need it to price printing', 'حالة التصميم — المورد محتاجها لتسعير الطباعة');
    add(s.shelf, 'Shelf-life target', 'الصلاحية المستهدفة');
    add(s.city, 'Delivery location — needed to price delivery', 'مكان التسليم — مطلوب لتسعير التوصيل');
    add(s.date, 'Target date', 'التاريخ المستهدف');
    add(s.packs * s.packG / 1000 >= 60, 'Quantity above the lowest MOQ we see (60 kg)', 'الكمية أكبر من أقل حد أدنى عندنا (٦٠ كجم)', 1);
  } else if (p.id === 'p-dish') {
    add(s.route, 'Formula route', 'مصدر التركيبة'); add(s.tier, 'Positioning', 'المستوى'); add(s.fragrance.length, 'Fragrance', 'الريحة');
    add(s.size && s.bottle && s.cap, 'Bottle, size and cap', 'العبوة والحجم والغطا'); add(s.units >= 3000, 'Quantity meets typical MOQ (3,000 units in demo data)', 'الكمية مناسبة للحد الأدنى المعتاد (٣٬٠٠٠ عبوة في بيانات الديمو)', 1);
    add(s.docs.includes('reg'), 'Registration status requested', 'تم طلب حالة التسجيل', 1); add(s.city && s.date, 'Delivery place and date', 'مكان وتاريخ التسليم');
  } else if (p.id === 'p-table') {
    if (s.mode === 'material') { add(s.materials.length, 'At least one material', 'خامة واحدة على الأقل'); add(s.materials.every(m => m.q > 0), 'Quantities for all rows', 'كميات لكل البنود'); add(s.moisture, 'Moisture target', 'نسبة الرطوبة', 1); add(s.city && s.date, 'Delivery place and date', 'مكان وتاريخ التسليم'); }
    else { add(s.ttype, 'Table type', 'نوع الترابيزة'); add(s.L && s.W && s.H, 'Dimensions with unit', 'المقاسات بالوحدة'); add(s.wood && s.finish, 'Material and finish', 'الخامة والتشطيب'); add(s.images.length, 'Reference image — reduces back-and-forth', 'صورة مرجعية — بتقلل الأسئلة', 1); add(s.qty >= 20, 'Quantity meets typical MOQ (20 pcs in demo data)', 'الكمية مناسبة للحد الأدنى (٢٠ قطعة في الديمو)', 1); add(s.city && s.date, 'Delivery place and date', 'مكان وتاريخ التسليم'); }
  } else {
    const t = S.templates[s.tpl]; t.fields.forEach(f => add(f.type === 'toggle' || (Array.isArray(s.vals[f.k]) ? s.vals[f.k].length : s.vals[f.k]), L(f), L(f), !f.req)); add(s.city && s.date, 'Delivery place and date', 'مكان وتاريخ التسليم');
  }
  return c;
}
PARTIALS.assist = () => {
  const p = proj(BUILDERS[currentRoute()]?.pid || S.current); const c = briefChecks(p); const done = c.filter(x => x.ok).length; const pct = Math.round(done / c.length * 100);
  const miss = c.filter(x => !x.ok);
  return `<div class="row-between"><h3 class="row">${ic('sparkle')} ${tx('Brief assistant', 'مساعد المواصفات')}</h3><span class="num small"><b>${pct}%</b></span></div>
  <div class="progress accent" style="margin:10px 0 8px"><i style="width:${pct}%"></i></div>
  ${miss.length ? `<p class="faint">${tx('Suppliers will ask about these:', 'الموردين هيسألوا عن دول:')}</p>${miss.map(x => `<div class="assist-item miss">${ic(x.tip ? 'info' : 'alert')}<span>${isAr() ? x.ar : x.en}${x.tip ? ` <span class="faint">(${tx('tip', 'نصيحة')})</span>` : ''}</span></div>`).join('')}`
    : `<div class="assist-item ok">${ic('check')}<span>${tx('Your brief is complete enough for comparable quotes.', 'المواصفات كاملة كفاية لعروض قابلة للمقارنة.')}</span></div>`}
  ${c.filter(x => x.ok).slice(0, 3).map(x => `<div class="assist-item ok">${ic('check')}<span>${isAr() ? x.ar : x.en}</span></div>`).join('')}
  <button class="btn btn-ghost btn-sm" data-act="draftBrief" style="margin-top:6px">${ic('wand')} ${tx('Draft supplier-ready summary', 'اكتب ملخص للموردين')}</button>
  <p class="faint" style="margin-top:6px">${tx('Rules-based in this demo. It never invents prices, capabilities or certifications.', 'بقواعد ثابتة في الديمو. مش بيألّف أسعار أو إمكانيات أو شهادات.')}</p>`;
};

/* ---------- builder shell ---------- */
function builderView(route) {
  const B = BUILDERS[route]; const p = proj(B.pid); S.current = B.pid; const steps = B.steps; if (p.step >= steps.length) p.step = steps.length - 1;
  const st = steps[p.step]; const c = cat(p.cat);
  if (p.stage !== 'draft') return `<div class="wrap section">${crumbs([[tx('My projects', 'مشاريعي'), 'dashboard'], [L(p.title)]])}${emptyState('lock', tx('This request has been sent', 'الطلب ده اتبعت خلاص'), tx('Changes after sending go through a change request, so every supplier quotes the same version.', 'أي تعديل بعد الإرسال بيبقى عن طريق طلب تعديل، عشان كل الموردين يسعّروا نفس النسخة.'), `<button class="btn btn-primary" data-act="openProject" data-id="${p.id}" data-to="project-overview">${tx('Open project', 'افتح المشروع')}</button>`)}</div>`;
  const side = `<aside class="builder-side"><div class="card" data-live="assist"></div>${builderBrandCard(p)}
    ${p.id === 'p-nuts' ? `<div class="card"><h3 class="row">${ic('calc')} ${tx('Quantity', 'الكمية')}</h3><div style="margin-top:10px" data-live="nutsCalc"></div></div>
      <div class="card"><h3 class="row">${ic('file')} ${tx('Your quotes will separate', 'العروض هتفصل')}</h3><div data-live="scopeList" style="margin-top:8px"></div></div>
      <div class="card"><h3 class="row">${ic('wallet')} ${tx('Budget fit', 'مناسبة الميزانية')}</h3><p class="small muted" style="margin-top:6px">${tx('Shown only after real quotes arrive. Nawah does not estimate prices from the spec.', 'بتظهر بس بعد ما العروض الحقيقية توصل. نواة مش بتقدّر أسعار من المواصفات.')}</p></div>` : ''}
    ${p.id === 'p-custom' ? `<div class="card"><h3 class="row">${ic('settings')} ${tx('Template-driven form', 'نموذج من قالب')}</h3><p class="small muted" style="margin-top:6px">${tx(`Generated from the “${L(S.templates[p.spec.tpl])}” template (${S.templates[p.spec.tpl].fields.length} fields). Ops can add fields in Templates without code changes.`, `متولّد من قالب “${L(S.templates[p.spec.tpl])}” (${S.templates[p.spec.tpl].fields.length} حقل). فريق التشغيل يقدر يضيف حقول من القوالب من غير برمجة.`)}</p><button class="btn btn-ghost btn-sm" data-act="viewAs" data-role="admin" data-to="admin-templates" style="margin-top:8px">${tx('Open Templates (ops view)', 'افتح القوالب (عرض الفريق)')}</button></div>` : ''}
  </aside>`;
  const reviewBody = () => { const m = matchSuppliers(p);
    return `<div class="stack-lg"><div class="card-flat">${kvList(specRows(p))}</div>
    <div><h3>${tx('Invite matched suppliers', 'ادعو الموردين المرشحين')}</h3><p class="faint" style="margin:4px 0 12px">${tx('Matching uses category, MOQ, declared capabilities and location. Your identity is shared only after you accept a quote.', 'الترشيح بيعتمد على القسم والحد الأدنى والإمكانيات المعلنة والمكان. هويتك بتظهر بس بعد قبول عرض.')}</p>
    ${m.length ? `<div class="stack">${m.map(x => `<label class="opt multi" style="align-items:center"><input type="checkbox" value="${x.s.id}" data-bind-multi="projects.${p.id}.invited" ${p.invited.includes(x.s.id) ? 'checked' : ''}><span class="mark"></span>${supLogo(x.s)}
      <span class="grow"><span class="t">${L(x.s)} ${demoTag()}</span><span class="d">${L(x.s.gov)} · ${tx('MOQ', 'الحد الأدنى')} ${L(x.s.moq)}</span><span class="match" style="margin-top:4px">${x.why.map(w => `<span>${L(w)}</span>`).join('')}</span></span>
      <span class="pill ${x.score >= 70 ? 'ok' : x.score >= 50 ? 'info' : 'warn'}">${x.score}% ${tx('match', 'توافق')}</span></label>`).join('')}</div>`
      : emptyState('search', tx('No listed suppliers yet', 'لسه مفيش موردين'), tx('Submit anyway — the operations team will find and invite suitable suppliers.', 'ابعت على أي حال — فريق التشغيل هيدور ويدعو موردين مناسبين.'))}
    ${ERRORS.invite ? `<p class="err" role="alert" style="color:var(--bad);margin-top:8px">${ic('alert')} ${ERRORS.invite}</p>` : ''}</div>
    <div class="note">${ic('shield')}<span>${tx('Submitting sends a demo RFQ. Suppliers see the specification, quantity, delivery area and date — not your budget or contact details.', 'الإرسال بيبعت طلب تجريبي. المورد بيشوف المواصفات والكمية ومنطقة وتاريخ التسليم — مش ميزانيتك ولا بيانات التواصل.')}</span></div></div>`; };
  return `<div class="wrap section">
  ${crumbs([[tx('Home', 'الرئيسية'), 'home'], [L(c), 'cat-' + c.id], [L(p.title)]])}
  <div class="row-between" style="margin-bottom:14px"><div><p class="eyebrow">${L(REQUEST_TYPES.find(r => r.id === (p.id === 'p-table' && p.spec.mode === 'material' ? 'raw' : p.type)))} · <bdi class="mono">${p.code}</bdi></p><h1 style="font-size:1.7rem;margin-top:4px">${L(p.title)}</h1></div>
    <span class="save-ind"><span class="d"></span><span class="txt">${tx('Draft saved', 'المسودة محفوظة')}</span></span></div>
  <div class="builder"><div class="card">
    <nav class="stepper" aria-label="${tx('Steps', 'الخطوات')}">${steps.map((s, i) => `<button data-act="goStep" data-i="${i}" ${i === p.step ? 'aria-current="step"' : ''} class="${i < p.step ? 'done' : ''}"><span class="n">${i < p.step ? ic('check') : i + 1}</span>${L(s)}</button>`).join('')}</nav>
    <div class="progress" style="margin-bottom:22px" role="progressbar" aria-valuenow="${p.step + 1}" aria-valuemin="1" aria-valuemax="${steps.length}" aria-label="${tx('Progress', 'التقدم')}"><i style="width:${(p.step + 1) / steps.length * 100}%"></i></div>
    <h2 style="margin-bottom:18px">${L(st)}</h2>
    ${Object.keys(ERRORS).length ? `<div class="note bad" role="alert" style="margin-bottom:16px">${ic('alert')}<span>${tx(`Please complete ${Object.keys(ERRORS).length} highlighted field(s) to continue.`, `من فضلك كمّل ${Object.keys(ERRORS).length} حقل محدد عشان تكمل.`)}</span></div>` : ''}
    <div class="fieldset">${st.review ? reviewBody() : st.r()}</div>
    <div class="builder-foot"><button class="btn btn-secondary" data-act="stepBack" ${p.step === 0 ? 'disabled' : ''}>${ic('back', 'flip')} ${tx('Back', 'رجوع')}</button>
      ${st.review ? `<button class="btn btn-primary btn-lg" data-act="submitRfq">${ic('send', 'flip')} ${tx('Submit RFQ', 'إرسال طلب عرض السعر')} ${demoTag()}</button>` : `<button class="btn btn-primary" data-act="stepNext">${tx('Continue', 'التالي')} ${ic('arrow', 'flip')}</button>`}</div>
  </div>${side}</div></div>`;
}
PARTIALS.scopeList = () => { const s = proj('p-nuts').spec; return OPT.scope.map(o => `<div class="assist-item ${s.scope.includes(o[0]) ? 'ok' : ''}">${ic(s.scope.includes(o[0]) ? 'check' : 'x')}<span>${isAr() ? o[2] : o[1]}${s.scope.includes(o[0]) ? '' : ` <span class="faint">— ${tx('excluded; you arrange it', 'مستبعد؛ إنت هتوفّره')}</span>`}</span></div>`).join(''); };
['builder-nuts', 'builder-dish', 'builder-table', 'builder-custom'].forEach(r => { VIEWS[r] = builderView; });

/* ---------- builder actions ---------- */
function validateStep() { const B = BUILDERS[currentRoute()]; const p = proj(B.pid); const st = B.steps[p.step]; const e = {}; if (st.v) st.v(e); ERRORS = e; return !Object.keys(e).length; }
ACTIONS.stepNext = () => { const p = proj(BUILDERS[currentRoute()].pid); if (!validateStep()) { render(true); document.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea')?.focus(); return; } p.step++; save(); render(); };
ACTIONS.stepBack = () => { const p = proj(BUILDERS[currentRoute()].pid); ERRORS = {}; p.step = Math.max(0, p.step - 1); save(); render(); };
ACTIONS.goStep = el => { const p = proj(BUILDERS[currentRoute()].pid); const i = Number(el.dataset.i); if (i > p.step) { for (let k = p.step; k < i; k++) { if (!validateStep()) { render(true); return; } p.step++; } } else { ERRORS = {}; p.step = i; } save(); render(); };
ACTIONS.matAdd = () => { proj('p-table').spec.materials.push({ m: '', t: 0, w: 0, l: 0, u: 'pcs', q: 0 }); save(); render(true); };
ACTIONS.matDel = el => { proj('p-table').spec.materials.splice(Number(el.dataset.i), 1); save(); render(true); };
ACTIONS.draftBrief = () => {
  const p = proj(BUILDERS[currentRoute()]?.pid || S.current);
  const text = specRows(p).map(r => `${r[0]}: ${r[1].replace(/<[^>]+>/g, '')}`).join('\n');
  openModal(`<h2>${tx('Supplier-ready summary', 'ملخص جاهز للموردين')}</h2><p class="faint" style="margin:6px 0 12px">${tx('Drafted from your answers only. Edit freely before sending.', 'مكتوب من إجاباتك بس. عدّل براحتك قبل الإرسال.')}</p>
  <textarea class="textarea" id="brief-out" style="min-height:240px">${esc(text)}</textarea><div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn btn-secondary" data-act="copyBrief">${tx('Copy', 'نسخ')}</button><button class="btn btn-primary" data-act="closeModal">${tx('Done', 'تم')}</button></div>`);
};
ACTIONS.copyBrief = () => { const t = document.getElementById('brief-out'); navigator.clipboard?.writeText(t.value).then(() => toast(tx('Copied', 'تم النسخ')), () => { t.select(); toast(tx('Press Ctrl+C to copy', 'اضغط Ctrl+C للنسخ'), 'info'); }) ?? t.select(); };
ACTIONS.submitRfq = () => {
  const B = BUILDERS[currentRoute()]; const p = proj(B.pid);
  // validate every step before sending
  const e = {}; B.steps.forEach(st => st.v && st.v(e));
  const m = matchSuppliers(p); if (m.length && !p.invited.filter(id => m.some(x => x.s.id === id)).length) e.invite = tx('Invite at least one supplier.', 'ادعو مورد واحد على الأقل.');
  if (Object.keys(e).length) { const firstBad = B.steps.findIndex(st => { const x = {}; st.v && st.v(x); return Object.keys(x).length; }); if (firstBad >= 0) p.step = firstBad; ERRORS = e; save(); render(); toast(tx('A few details are missing — we took you to them.', 'في تفاصيل ناقصة — وديناك ليها.'), 'alert'); return; }
  p.stage = 'rfq'; p.sentOn = TODAY; S.current = p.id; ERRORS = {};
  notify(`RFQ ${p.code} sent to ${p.invited.length} supplier(s).`, `تم إرسال الطلب ${p.code} لـ ${p.invited.length} مورد.`, 'send', p.id === 'p-nuts' ? 'project-quotes' : 'project-overview');
  save(); toast(tx('RFQ submitted. Suppliers have been notified (demo).', 'تم إرسال الطلب. الموردين وصلهم إشعار (تجريبي).'));
  go(p.id === 'p-nuts' ? 'project-quotes' : 'project-overview');
};
