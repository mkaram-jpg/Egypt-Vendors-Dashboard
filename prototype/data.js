/* Nawah prototype — demo data.
   Every company, price, certificate and metric in this file is FICTIONAL demo data. */
'use strict';

const REQUEST_TYPES = [
  { id: 'private', icon: 'tag',
    en: 'Private label', ar: 'منتج بعلامتك (برايفت ليبل)',
    den: 'A manufacturer makes a product from its existing range or formula, packed under your brand.',
    dar: 'المصنع يجهّز منتج من تشكيلته أو تركيبته الحالية، ويعبّيه باسمك وتصميمك.',
    exen: 'Roasted nuts in your pouch · dish liquid from a ready formula',
    exar: 'مكسرات محمصة في كيسك · سائل أطباق من تركيبة جاهزة' },
  { id: 'contract', icon: 'wrench',
    en: 'Custom / contract manufacturing', ar: 'تصنيع حسب الطلب',
    den: 'The product is built to your own design, formula or specification. Usually needs development and a prototype.',
    dar: 'المنتج بيتعمل على تصميمك أو مواصفاتك الخاصة، وغالبًا محتاج تطوير ونموذج أولي.',
    exen: 'Tables to your drawings · a new fragrance concept',
    exar: 'ترابيزات على رسوماتك · منتج بريحة وتركيبة جديدة' },
  { id: 'raw', icon: 'layers',
    en: 'Raw materials & components', ar: 'خامات ومكونات',
    den: 'You buy inputs and produce yourself or with a workshop: ingredients, timber, fabric, hardware.',
    dar: 'بتشتري المدخلات وتصنّع بنفسك أو مع ورشة: مكونات غذائية، خشب، أقمشة، إكسسوارات.',
    exen: 'Beech boards by m³ · cashews by the 25 kg carton',
    exar: 'خشب زان بالمتر المكعب · كاجو بالكرتونة ٢٥ كجم' },
  { id: 'packaging', icon: 'pouch',
    en: 'Packaging & printing', ar: 'تغليف وطباعة',
    den: 'Pouches, bottles, jars, cartons and labels, sourced and printed separately from the product.',
    dar: 'أكياس وعبوات وبرطمانات وكراتين وستيكرات، بتتطلب وتتطبع منفصلة عن المنتج.',
    exen: '5,000 printed stand-up pouches · 750 ml PET bottles',
    exar: '٥٬٠٠٠ كيس واقف مطبوع · عبوات PET ٧٥٠ مل' },
  { id: 'wholesale', icon: 'cart', secondary: true,
    en: 'Ready-made wholesale', ar: 'منتجات جاهزة بالجملة',
    den: 'Optional: buy existing finished goods in bulk, without your brand. A secondary service.',
    dar: 'خدمة إضافية: شراء منتجات جاهزة بالجملة من غير علامتك.',
    exen: 'Unbranded mixed nuts in bulk',
    exar: 'مكسرات مشكلة بالجملة من غير براند' }
];

/* hue is a mid-saturation colour that reads on light and dark surfaces */
const CATEGORIES = [
  { id: 'food', kind: 'finished', icon: 'nut', hue: '#B7791F',
    en: 'Food & beverages', ar: 'أغذية ومشروبات',
    den: 'Packaged foods under your brand, from roasting to filling.',
    dar: 'أغذية معبأة باسمك، من التحميص للتعبئة.',
    subs: [
      { id: 'nuts', en: 'Nuts', ar: 'مكسرات', builder: 'builder-nuts' },
      { id: 'coffee', en: 'Coffee & tea', ar: 'بن وشاي', builder: 'builder-custom', tpl: 'coffee' },
      { id: 'spices', en: 'Spices & herbs', ar: 'توابل وأعشاب' },
      { id: 'dried', en: 'Dried fruits & dates', ar: 'فواكه مجففة وتمور' },
      { id: 'snacks', en: 'Snacks & chips', ar: 'سناكس وشيبسي' },
      { id: 'sauces', en: 'Sauces & spreads', ar: 'صوصات ومعجونات' },
      { id: 'honey', en: 'Honey & jams', ar: 'عسل ومربى' },
      { id: 'grains', en: 'Rice, grains & legumes', ar: 'أرز وحبوب وبقوليات' }
    ],
    filters: [
      { cap: 'cert', en: 'Food-safety certificate (supplier-stated)', ar: 'شهادة سلامة غذاء (حسب المورد)' },
      { cap: 'pouch-printing', en: 'In-house pouch printing', ar: 'طباعة أكياس داخل المصنع' },
      { cap: 'flavouring', en: 'Flavouring capability', ar: 'إمكانية التنكيه' },
      { cap: 'fast-sample', en: 'Sample within 7 days', ar: 'عينة خلال ٧ أيام' }
    ] },
  { id: 'cleaning', kind: 'finished', icon: 'bottle', hue: '#2F855A',
    en: 'Household cleaning & laundry', ar: 'منظفات منزلية وغسيل',
    den: 'Liquids and powders from ready formulas or custom development.',
    dar: 'سوائل وبودرة من تركيبات جاهزة أو تطوير خاص.',
    subs: [
      { id: 'dish', en: 'Dishwashing liquid', ar: 'سائل غسيل أطباق', builder: 'builder-dish' },
      { id: 'laundry-l', en: 'Laundry detergent — liquid', ar: 'منظف غسيل سائل' },
      { id: 'laundry-p', en: 'Laundry detergent — powder', ar: 'مسحوق غسيل' },
      { id: 'softener', en: 'Fabric softener', ar: 'منعم أقمشة' },
      { id: 'floor', en: 'Floor cleaner', ar: 'منظف أرضيات' },
      { id: 'glass', en: 'Glass cleaner', ar: 'منظف زجاج' },
      { id: 'multi', en: 'Multipurpose cleaner', ar: 'منظف متعدد الاستخدامات' },
      { id: 'handsoap', en: 'Hand soap', ar: 'صابون أيدي' }
    ],
    filters: [
      { cap: 'ready-formula', en: 'Ready formula library', ar: 'تركيبات جاهزة' },
      { cap: 'custom-formula', en: 'Custom development', ar: 'تطوير تركيبة خاصة' },
      { cap: 'bottle-filling', en: 'Fills 500 ml – 4 L', ar: 'تعبئة من ٥٠٠ مل لـ ٤ لتر' },
      { cap: 'registration', en: 'Supports registration paperwork (supplier-stated)', ar: 'يساعد في أوراق التسجيل (حسب المورد)' }
    ] },
  { id: 'personal', kind: 'finished', icon: 'flask', hue: '#B83280',
    en: 'Personal care & beauty', ar: 'عناية شخصية وتجميل',
    den: 'Hair, body, skin and fragrance products.',
    dar: 'منتجات الشعر والجسم والبشرة والعطور.',
    subs: [
      { id: 'shampoo', en: 'Shampoo & conditioner', ar: 'شامبو وبلسم', builder: 'builder-custom', tpl: 'shampoo' },
      { id: 'bodywash', en: 'Body wash', ar: 'شاور جل' },
      { id: 'skincare', en: 'Skincare', ar: 'عناية بالبشرة' },
      { id: 'perfume', en: 'Perfume & body mist', ar: 'عطور وبودي ميست' }
    ],
    filters: [
      { cap: 'ready-formula', en: 'Formula library', ar: 'تركيبات جاهزة' },
      { cap: 'tube-filling', en: 'Tube & pump filling', ar: 'تعبئة أنابيب وبامب' },
      { cap: 'lowmoq', en: 'Low MOQ (< 1,000 units)', ar: 'حد أدنى قليل (أقل من ١٬٠٠٠ قطعة)' }
    ] },
  { id: 'furniture', kind: 'finished', icon: 'table', hue: '#975A16',
    en: 'Furniture & wood', ar: 'أثاث وأخشاب',
    den: 'Finished furniture, or timber and parts for your own workshop.',
    dar: 'أثاث جاهز، أو خشب ومكونات لورشتك.',
    subs: [
      { id: 'tables', en: 'Tables', ar: 'ترابيزات', builder: 'builder-table' },
      { id: 'chairs', en: 'Chairs', ar: 'كراسي' },
      { id: 'shelving', en: 'Shelving & storage', ar: 'أرفف ووحدات تخزين' },
      { id: 'homeoffice', en: 'Home & office furniture', ar: 'أثاث منزلي ومكتبي' },
      { id: 'timber', en: 'Timber & boards', ar: 'أخشاب وألواح', builder: 'builder-table', mode: 'material' },
      { id: 'customfurn', en: 'Custom furniture production', ar: 'تصنيع أثاث حسب الطلب' }
    ],
    filters: [
      { cap: 'cnc', en: 'CNC cutting', ar: 'قص CNC' },
      { cap: 'solid-wood', en: 'Solid wood', ar: 'خشب طبيعي' },
      { cap: 'delivery-install', en: 'Delivery & installation', ar: 'توصيل وتركيب' },
      { cap: 'damietta', en: 'Damietta cluster', ar: 'منطقة دمياط' }
    ] },
  { id: 'textiles', kind: 'finished', icon: 'shirt', hue: '#3C64B1',
    en: 'Clothing & textiles', ar: 'ملابس ومنسوجات',
    den: 'Garments and home textiles with print or embroidery.',
    dar: 'ملابس ومفروشات بطباعة أو تطريز.',
    subs: [
      { id: 'tshirts', en: 'T-shirts', ar: 'تيشيرتات', builder: 'builder-custom', tpl: 'tshirt' },
      { id: 'hoodies', en: 'Hoodies', ar: 'هوديز' },
      { id: 'sportswear', en: 'Sportswear', ar: 'ملابس رياضية' },
      { id: 'uniforms', en: 'Work uniforms', ar: 'يونيفورم عمل' },
      { id: 'hometex', en: 'Home textiles', ar: 'مفروشات منزلية' }
    ],
    filters: [
      { cap: 'screen-print', en: 'Screen print', ar: 'طباعة سلك سكرين' },
      { cap: 'dtf', en: 'DTF print', ar: 'طباعة DTF' },
      { cap: 'embroidery', en: 'Embroidery', ar: 'تطريز' },
      { cap: 'cut-sew', en: 'MOQ ≤ 200 per design', ar: 'حد أدنى ≤ ٢٠٠ للتصميم' }
    ] },
  { id: 'packaging', kind: 'packaging', icon: 'pouch', hue: '#6B46C1',
    en: 'Packaging & printing', ar: 'تغليف وطباعة',
    den: 'Pouches, bottles, jars, cartons and labels.',
    dar: 'أكياس، عبوات، برطمانات، كراتين وستيكرات.',
    subs: [
      { id: 'pouches', en: 'Pouches', ar: 'أكياس', builder: 'builder-custom', tpl: 'pouch' },
      { id: 'bottles', en: 'Bottles & containers', ar: 'زجاجات وعبوات' },
      { id: 'jars', en: 'Jars', ar: 'برطمانات' },
      { id: 'cartons', en: 'Cartons', ar: 'كراتين' },
      { id: 'labels', en: 'Labels & stickers', ar: 'ليبلات وستيكرات' },
      { id: 'bags', en: 'Shopping bags', ar: 'شنط تسوق' }
    ],
    filters: [
      { cap: 'foodcontact', en: 'Food-contact material (supplier-stated)', ar: 'خامة ملامسة للغذاء (حسب المورد)' },
      { cap: 'digital-print', en: 'Digital print (no plates)', ar: 'طباعة ديجيتال (بدون أكلاشيه)' },
      { cap: 'gravure', en: 'Gravure / flexo', ar: 'روتوجرافير / فلكسو' }
    ] },
  { id: 'raw', kind: 'raw', icon: 'layers', hue: '#4A5568',
    en: 'Raw materials & components', ar: 'خامات ومكونات',
    den: 'Inputs sold by weight, volume, roll or piece.',
    dar: 'مدخلات بتتباع بالوزن أو الحجم أو الرول أو القطعة.',
    subs: [
      { id: 'foodingr', en: 'Food ingredients', ar: 'مكونات غذائية' },
      { id: 'cleaningingr', en: 'Cleaning-product ingredients', ar: 'مكونات منظفات' },
      { id: 'wood', en: 'Wood', ar: 'أخشاب', builder: 'builder-table', mode: 'material' },
      { id: 'fabrics', en: 'Fabrics', ar: 'أقمشة' },
      { id: 'packmat', en: 'Packaging materials', ar: 'خامات تغليف' },
      { id: 'furncomp', en: 'Furniture components', ar: 'مكونات أثاث' }
    ],
    filters: [
      { cap: 'per-ton', en: 'Sold per ton', ar: 'بيع بالطن' },
      { cap: 'per-m3', en: 'Sold per m³', ar: 'بيع بالمتر المكعب' },
      { cap: 'delivered', en: 'Delivered price', ar: 'سعر شامل التوصيل' }
    ] },
  { id: 'custom', kind: 'custom', icon: 'sparkle', hue: '#2C7A7B',
    en: 'Something else', ar: 'طلب مختلف',
    den: 'Describe a product that does not fit a category. We qualify it by hand.',
    dar: 'اوصف منتج مش موجود في الأقسام، وفريقنا يراجعه.',
    subs: [ { id: 'other', en: 'Describe your product', ar: 'اوصف منتجك', builder: 'builder-custom', tpl: 'other' } ],
    filters: [] }
];

const SERVICES = [
  { id: 'inspect', icon: 'eye', en: 'Pre-shipment inspection', ar: 'فحص قبل الشحن' },
  { id: 'design', icon: 'wand', en: 'Packaging & label design', ar: 'تصميم تغليف وليبل' },
  { id: 'logistics', icon: 'truck', en: 'Logistics coordination', ar: 'تنسيق نقل' },
  { id: 'lab', icon: 'flask', en: 'Lab-test coordination', ar: 'تنسيق تحاليل معملية' },
  { id: 'photo', icon: 'image', en: 'Product photography', ar: 'تصوير منتجات' }
];

/* verification: list of checks with dates; scope is what was NOT checked */
const SUPPLIERS = [
  { id: 'sw1', cat: ['food'], subs: ['nuts', 'dried'],
    en: 'Al-Waha Roasting Co.', ar: 'شركة الواحة للتحميص',
    gov: { en: 'Obour City, Qalyubia', ar: 'العبور، القليوبية' }, govId: 'cairo',
    moq: { v: 60, u: 'kg', en: '300 packs (60 kg)', ar: '٣٠٠ كيس (٦٠ كجم)' }, moqKg: 60,
    lead: { en: '15–20 days', ar: '١٥–٢٠ يوم' },
    caps: ['roasting', 'salting', 'flavouring', 'pouch-filling', 'jar-filling', 'fast-sample'],
    capsLabel: { en: 'Roasting · salting · flavouring · pouch & jar filling', ar: 'تحميص · تمليح · تنكيه · تعبئة أكياس وبرطمانات' },
    checks: [
      { en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', d: '2026-10-12' },
      { en: 'Tax card', ar: 'البطاقة الضريبية', d: '2026-10-12' },
      { en: 'Factory operating licence', ar: 'رخصة تشغيل المصنع', d: '2026-10-14' },
      { en: 'Video site walkthrough', ar: 'جولة فيديو في المصنع', d: '2026-10-20' }
    ],
    certs: [{ en: 'Food-safety certificate (supplier-uploaded)', ar: 'شهادة سلامة غذاء (مرفوعة من المورد)', exp: '2027-03-31' }],
    since: 2011, staff: '40–60' },
  { id: 'sw2', cat: ['food'], subs: ['nuts', 'snacks', 'dried'],
    en: 'Nile Pack Foods', ar: 'نايل باك للأغذية',
    gov: { en: '6th of October, Giza', ar: '٦ أكتوبر، الجيزة' }, govId: 'cairo',
    moq: { v: 100, u: 'kg', en: '100 kg', ar: '١٠٠ كجم' }, moqKg: 100,
    lead: { en: '18–24 days', ar: '١٨–٢٤ يوم' },
    caps: ['roasting', 'salting', 'pouch-filling', 'pouch-printing'],
    capsLabel: { en: 'Roasting · salting · in-house digital pouch print', ar: 'تحميص · تمليح · طباعة أكياس ديجيتال داخلية' },
    checks: [
      { en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', d: '2026-09-03' },
      { en: 'Tax card', ar: 'البطاقة الضريبية', d: '2026-09-03' }
    ],
    certs: [{ en: 'Food-safety certificate (supplier-uploaded)', ar: 'شهادة سلامة غذاء (مرفوعة من المورد)', exp: '2026-12-15' }],
    since: 2017, staff: '20–40' },
  { id: 'sw3', cat: ['food'], subs: ['nuts', 'dried'],
    en: 'Sinai Harvest', ar: 'حصاد سيناء',
    gov: { en: '10th of Ramadan, Sharqia', ar: 'العاشر من رمضان، الشرقية' }, govId: 'delta',
    moq: { v: 100, u: 'kg', en: '100 kg', ar: '١٠٠ كجم' }, moqKg: 100,
    lead: { en: '8–12 days', ar: '٨–١٢ يوم' },
    caps: ['roasting', 'salting', 'pouch-filling'],
    capsLabel: { en: 'Roasting · salting · standard 250 g packs', ar: 'تحميص · تمليح · عبوات قياسية ٢٥٠ جم' },
    checks: [{ en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', d: '2026-11-02' }],
    certs: [],
    since: 2020, staff: '10–20' },
  { id: 'sw4', cat: ['cleaning'], subs: ['dish', 'floor', 'multi', 'handsoap'],
    en: 'Delta Home Care', ar: 'دلتا هوم كير',
    gov: { en: 'Sadat City, Monufia', ar: 'مدينة السادات، المنوفية' }, govId: 'delta',
    moq: { v: 3000, u: 'units', en: '3,000 bottles', ar: '٣٬٠٠٠ عبوة' }, moqKg: null,
    lead: { en: '20–30 days', ar: '٢٠–٣٠ يوم' },
    caps: ['ready-formula', 'custom-formula', 'bottle-filling', 'labelling'],
    capsLabel: { en: 'Ready formulas · custom development · filling 500 ml–4 L', ar: 'تركيبات جاهزة · تطوير خاص · تعبئة ٥٠٠ مل–٤ لتر' },
    checks: [
      { en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', d: '2026-08-21' },
      { en: 'Tax card', ar: 'البطاقة الضريبية', d: '2026-08-21' },
      { en: 'Factory operating licence', ar: 'رخصة تشغيل المصنع', d: '2026-08-25' }
    ],
    certs: [{ en: 'Quality management certificate (supplier-uploaded)', ar: 'شهادة نظام إدارة جودة (مرفوعة من المورد)', exp: '2027-06-30' }],
    since: 2009, staff: '60–100' },
  { id: 'sw5', cat: ['packaging'], subs: ['bottles', 'jars'],
    en: 'Borg Plast', ar: 'برج بلاست',
    gov: { en: 'Borg El Arab, Alexandria', ar: 'برج العرب، الإسكندرية' }, govId: 'alex',
    moq: { v: 5000, u: 'pcs', en: '5,000 pcs', ar: '٥٬٠٠٠ قطعة' }, moqKg: null,
    lead: { en: '14–21 days', ar: '١٤–٢١ يوم' },
    caps: ['pet-bottles', 'hdpe', 'caps'],
    capsLabel: { en: 'PET & HDPE bottles · flip-top and pump caps', ar: 'عبوات PET و HDPE · أغطية فليب توب وبامب' },
    checks: [{ en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', d: '2026-07-30' }, { en: 'Tax card', ar: 'البطاقة الضريبية', d: '2026-07-30' }],
    certs: [], since: 2014, staff: '40–60' },
  { id: 'sw6', cat: ['furniture'], subs: ['tables', 'chairs', 'homeoffice', 'customfurn'],
    en: 'Damietta Craft Furniture', ar: 'دمياط كرافت للأثاث',
    gov: { en: 'Damietta', ar: 'دمياط' }, govId: 'delta',
    moq: { v: 20, u: 'pcs', en: '20 pieces', ar: '٢٠ قطعة' }, moqKg: null,
    lead: { en: '25–35 days', ar: '٢٥–٣٥ يوم' },
    caps: ['solid-wood', 'cnc', 'lacquer', 'delivery-install'],
    capsLabel: { en: 'Solid beech & oak · CNC · PU lacquer · delivery & install', ar: 'زان وأرو طبيعي · CNC · دهان PU · توصيل وتركيب' },
    checks: [
      { en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', d: '2026-10-01' },
      { en: 'Tax card', ar: 'البطاقة الضريبية', d: '2026-10-01' },
      { en: 'In-person workshop visit', ar: 'زيارة ميدانية للورشة', d: '2026-10-09' }
    ],
    certs: [], since: 2005, staff: '20–40' },
  { id: 'sw7', cat: ['furniture', 'raw'], subs: ['timber', 'wood', 'furncomp'],
    en: 'New Damietta Timber', ar: 'أخشاب دمياط الجديدة',
    gov: { en: 'New Damietta', ar: 'دمياط الجديدة' }, govId: 'delta',
    moq: { v: 1, u: 'm³', en: '1 m³', ar: '١ م³' }, moqKg: null,
    lead: { en: '3–7 days', ar: '٣–٧ أيام' },
    caps: ['timber', 'cut-to-size', 'kiln-dried', 'components', 'per-m3', 'delivered', 'cnc'],
    capsLabel: { en: 'Beech, pine, oak boards · cut-to-size · legs & hardware', ar: 'ألواح زان وموسكي وأرو · تقطيع بالمقاس · أرجل وإكسسوارات' },
    checks: [{ en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', d: '2026-09-17' }],
    certs: [], since: 1998, staff: '10–20' },
  { id: 'sw8', cat: ['textiles'], subs: ['tshirts', 'hoodies', 'uniforms', 'sportswear'],
    en: 'Mahalla Weave Garments', ar: 'المحلة للملابس الجاهزة',
    gov: { en: 'El Mahalla El Kubra, Gharbia', ar: 'المحلة الكبرى، الغربية' }, govId: 'delta',
    moq: { v: 150, u: 'pcs', en: '150 per design', ar: '١٥٠ قطعة للتصميم' }, moqKg: null,
    lead: { en: '20–28 days', ar: '٢٠–٢٨ يوم' },
    caps: ['cut-sew', 'screen-print', 'dtf', 'embroidery'],
    capsLabel: { en: 'Cotton jersey cut & sew · screen, DTF, embroidery', ar: 'قص وخياطة قطن · سلك سكرين، DTF، تطريز' },
    checks: [{ en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', d: '2026-06-11' }, { en: 'Tax card', ar: 'البطاقة الضريبية', d: '2026-06-11' }],
    certs: [], since: 2012, staff: '100+' },
  { id: 'sw9', cat: ['packaging'], subs: ['pouches', 'labels', 'cartons'],
    en: 'Obour Print & Pack', ar: 'العبور للطباعة والتغليف',
    gov: { en: 'Obour City, Qalyubia', ar: 'العبور، القليوبية' }, govId: 'cairo',
    moq: { v: 2000, u: 'pcs', en: '2,000 pouches', ar: '٢٬٠٠٠ كيس' }, moqKg: null,
    lead: { en: '10–15 days', ar: '١٠–١٥ يوم' },
    caps: ['pouch-printing', 'labels', 'digital-print', 'gravure'],
    capsLabel: { en: 'Stand-up pouches · labels · digital & gravure print', ar: 'أكياس واقفة · ليبلات · طباعة ديجيتال وروتوجرافير' },
    checks: [{ en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', d: '2026-10-28' }],
    certs: [], since: 2016, staff: '20–40' },
  { id: 'sw10', cat: ['personal'], subs: ['shampoo', 'bodywash', 'skincare'],
    en: 'Glow Lab Cosmetics', ar: 'جلو لاب لمستحضرات التجميل',
    gov: { en: 'Badr City, Cairo', ar: 'مدينة بدر، القاهرة' }, govId: 'cairo',
    moq: { v: 1000, u: 'units', en: '1,000 units', ar: '١٬٠٠٠ عبوة' }, moqKg: null,
    lead: { en: '25–40 days', ar: '٢٥–٤٠ يوم' },
    caps: ['ready-formula', 'custom-formula', 'tube-filling', 'pump'],
    capsLabel: { en: 'Formula library · tubes & pump bottles', ar: 'تركيبات جاهزة · أنابيب وعبوات بامب' },
    checks: [{ en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', d: '2026-05-19' }],
    certs: [], since: 2019, staff: '20–40' }
];

/* Fictional quotations for the nuts RFQ. Structured so the app can normalise them. */
function defaultQuotes() {
  return {
    sw1: { ref: 'Q-2611-031', ver: 1, basis: 'pack', packG: 200, packs: 500,
      product: 78, productNote: { en: 'per 200 g pack — nuts + roasting + salting', ar: 'للكيس ٢٠٠ جم — مكسرات + تحميص + تمليح' },
      packaging: 9.5, packagingNote: { en: 'per pack — printed stand-up zip pouch, 4 colours', ar: 'للكيس — كيس واقف بسوستة، طباعة ٤ ألوان' },
      setup: 3500, setupNote: { en: 'Printing plates (one-off, reusable on reorder)', ar: 'أكلاشيهات الطباعة (مرة واحدة، تُستخدم في إعادة الطلب)' },
      sample: 1200, sampleDeductible: true, vatIncluded: false, delivery: 1500,
      leadDays: 18, moqKg: 60, payment: { en: '50% deposit · 50% before dispatch', ar: '٥٠٪ مقدم · ٥٠٪ قبل الشحن' },
      validity: 14, docs: ['cr', 'tax', 'foodsafety', 'shelflife', 'invoice'],
      exclusions: { en: 'Artwork design not included', ar: 'تصميم الجرافيك غير مشمول' },
      deviations: [], missing: [], shelfLife: { en: '6 months stated', ar: '٦ شهور (حسب المورد)' } },
    sw2: { ref: 'Q-2611-044', ver: 1, basis: 'kg', packG: 200, packs: 500,
      product: 360, productNote: { en: 'per kg — nuts + roasting + salting', ar: 'للكيلو — مكسرات + تحميص + تمليح' },
      packaging: 11, packagingNote: { en: 'per pack — digitally printed flat pouch, no zipper', ar: 'للكيس — كيس مسطح مطبوع ديجيتال، بدون سوستة' },
      setup: 0, setupNote: { en: 'No plates (digital print)', ar: 'بدون أكلاشيهات (طباعة ديجيتال)' },
      sample: 800, sampleDeductible: false, vatIncluded: true, delivery: 0,
      leadDays: 21, moqKg: 100, payment: { en: '30% deposit · 70% on delivery', ar: '٣٠٪ مقدم · ٧٠٪ عند الاستلام' },
      validity: 7, docs: ['cr', 'tax', 'foodsafety', 'invoice'],
      exclusions: { en: 'Delivery free inside Greater Cairo only', ar: 'التوصيل مجاني داخل القاهرة الكبرى فقط' },
      deviations: [{ en: 'Flat pouch without zipper (you asked for stand-up zip pouch)', ar: 'كيس مسطح بدون سوستة (طلبك كيس واقف بسوستة)' }],
      missing: [{ en: 'Shelf-life statement not provided', ar: 'لم يحدد مدة الصلاحية' }], shelfLife: null },
    sw3: { ref: 'Q-2611-052', ver: 1, basis: 'pack', packG: 250, packs: 400,
      product: 95, productNote: { en: 'per 250 g pack — all-in incl. standard printed pouch', ar: 'للكيس ٢٥٠ جم — شامل الكيس المطبوع القياسي' },
      packaging: 0, packagingNote: { en: 'Included in product price', ar: 'مشمول في سعر المنتج' },
      setup: 2000, setupNote: { en: 'Artwork adaptation to their 250 g pouch', ar: 'تعديل التصميم على كيسهم ٢٥٠ جم' },
      sample: 0, sampleDeductible: true, vatIncluded: false, delivery: null,
      leadDays: 10, moqKg: 100, payment: { en: '100% before dispatch', ar: '١٠٠٪ قبل الشحن' },
      validity: 10, docs: ['cr', 'invoice'],
      exclusions: { en: 'Delivery to be quoted separately', ar: 'التوصيل يتسعّر لوحده' },
      deviations: [{ en: 'Proposes 400 × 250 g packs instead of 500 × 200 g (same 100 kg)', ar: 'بيقترح ٤٠٠ كيس × ٢٥٠ جم بدل ٥٠٠ × ٢٠٠ جم (نفس الـ ١٠٠ كجم)' }],
      missing: [{ en: 'Delivery charge not quoted', ar: 'لم يسعّر التوصيل' }, { en: 'Food-safety document not attached', ar: 'لم يرفق مستند سلامة الغذاء' }],
      shelfLife: { en: '9 months stated', ar: '٩ شهور (حسب المورد)' } }
  };
}

const DOC_LABELS = {
  cr: { en: 'Commercial registry', ar: 'سجل تجاري' },
  tax: { en: 'Tax card', ar: 'بطاقة ضريبية' },
  foodsafety: { en: 'Food-safety certificate', ar: 'شهادة سلامة غذاء' },
  shelflife: { en: 'Shelf-life statement', ar: 'بيان مدة الصلاحية' },
  invoice: { en: 'Tax invoice', ar: 'فاتورة ضريبية' }
};

/* Category templates drive the reusable dynamic form (builder-custom). Admin can add fields. */
function defaultTemplates() {
  return {
    tshirt: { en: 'T-shirts', ar: 'تيشيرتات', cat: 'textiles', fields: [
      { k: 'fabric', type: 'select', req: true, en: 'Fabric', ar: 'الخامة', opts: [['cotton100', '100% cotton', 'قطن ١٠٠٪'], ['cvc', 'CVC cotton/poly', 'قطن/بوليستر CVC'], ['poly', 'Polyester (sport)', 'بوليستر (رياضي)']] },
      { k: 'gsm', type: 'select', req: true, en: 'Fabric weight', ar: 'وزن القماش', opts: [['160', '160 GSM — light', '١٦٠ جم/م² — خفيف'], ['180', '180 GSM — standard', '١٨٠ جم/م² — قياسي'], ['220', '220 GSM — heavy', '٢٢٠ جم/م² — تقيل']] },
      { k: 'fit', type: 'chips', en: 'Fit', ar: 'القصّة', opts: [['regular', 'Regular', 'عادي'], ['oversize', 'Oversize', 'أوفر سايز'], ['slim', 'Slim', 'سليم']] },
      { k: 'print', type: 'select', req: true, en: 'Decoration', ar: 'الطباعة / التطريز', opts: [['screen', 'Screen print', 'سلك سكرين'], ['dtf', 'DTF print', 'طباعة DTF'], ['embroidery', 'Embroidery', 'تطريز'], ['none', 'Blank', 'سادة']] },
      { k: 'sizes', type: 'chips', en: 'Size range', ar: 'المقاسات', opts: [['s', 'S'], ['m', 'M'], ['l', 'L'], ['xl', 'XL'], ['xxl', 'XXL']] },
      { k: 'qty', type: 'number', req: true, unit: { en: 'pieces', ar: 'قطعة' }, en: 'Total quantity', ar: 'الكمية الإجمالية' },
      { k: 'designs', type: 'number', unit: { en: 'designs', ar: 'تصميم' }, en: 'Number of designs', ar: 'عدد التصميمات' }
    ] },
    coffee: { en: 'Coffee', ar: 'بن', cat: 'food', fields: [
      { k: 'bean', type: 'select', req: true, en: 'Bean', ar: 'نوع البن', opts: [['arabica', 'Arabica', 'أرابيكا'], ['blend', 'Arabica/Robusta blend', 'خلطة أرابيكا وروبوستا']] },
      { k: 'roast', type: 'chips', req: true, en: 'Roast level', ar: 'درجة التحميص', opts: [['light', 'Light', 'فاتح'], ['medium', 'Medium', 'وسط'], ['dark', 'Dark', 'غامق']] },
      { k: 'form', type: 'select', req: true, en: 'Form', ar: 'الشكل', opts: [['beans', 'Whole beans', 'حبوب'], ['turkish', 'Ground — Turkish', 'مطحون — تركي'], ['espresso', 'Ground — espresso', 'مطحون — إسبريسو']] },
      { k: 'addon', type: 'chips', en: 'Add-ons', ar: 'إضافات', opts: [['cardamom', 'Cardamom', 'محوّج / حبهان'], ['none', 'None', 'سادة']] },
      { k: 'packG', type: 'number', req: true, unit: { en: 'g per pack', ar: 'جم للعبوة' }, en: 'Pack weight', ar: 'وزن العبوة' },
      { k: 'qty', type: 'number', req: true, unit: { en: 'packs', ar: 'عبوة' }, en: 'Number of packs', ar: 'عدد العبوات' },
      { k: 'valve', type: 'toggle', en: 'One-way degassing valve on pouch', ar: 'صمام تهوية في الكيس' }
    ] },
    pouch: { en: 'Stand-up pouches', ar: 'أكياس واقفة', cat: 'packaging', fields: [
      { k: 'material', type: 'select', req: true, en: 'Material structure', ar: 'تركيب الخامة', opts: [['petpe', 'PET/PE — glossy', 'PET/PE — لامع'], ['matte', 'Matte BOPP/PE', 'BOPP مطفي/PE'], ['kraft', 'Kraft paper/PE', 'ورق كرافت/PE'], ['foil', 'With aluminium barrier', 'بطبقة ألومنيوم']] },
      { k: 'size', type: 'text', req: true, en: 'Size (W × H × gusset, mm)', ar: 'المقاس (عرض × طول × قاعدة، مم)', ph: '140 × 220 × 80' },
      { k: 'zip', type: 'toggle', en: 'Resealable zipper', ar: 'سوستة قفل' },
      { k: 'window', type: 'toggle', en: 'Clear window', ar: 'شباك شفاف' },
      { k: 'colors', type: 'select', en: 'Print colours', ar: 'ألوان الطباعة', opts: [['4', '4 colours (CMYK)', '٤ ألوان'], ['6', 'Up to 6 colours', 'لحد ٦ ألوان'], ['digital', 'Digital (short run)', 'ديجيتال (كمية صغيرة)']] },
      { k: 'qty', type: 'number', req: true, unit: { en: 'pouches', ar: 'كيس' }, en: 'Quantity', ar: 'الكمية' }
    ] },
    shampoo: { en: 'Shampoo', ar: 'شامبو', cat: 'personal', fields: [
      { k: 'route', type: 'select', req: true, en: 'Formula route', ar: 'مصدر التركيبة', opts: [['ready', 'Manufacturer’s existing formula', 'تركيبة جاهزة من المصنع'], ['custom', 'Custom development request', 'طلب تطوير تركيبة خاصة']] },
      { k: 'hair', type: 'chips', en: 'Hair type focus', ar: 'نوع الشعر', opts: [['normal', 'Normal', 'عادي'], ['dry', 'Dry', 'جاف'], ['oily', 'Oily', 'دهني'], ['curly', 'Curly', 'كيرلي']] },
      { k: 'claims', type: 'textarea', en: 'Desired claims (manufacturer must substantiate)', ar: 'الادعاءات المطلوبة (المصنع لازم يثبتها)', ph: 'e.g. sulfate-free' },
      { k: 'size', type: 'select', req: true, en: 'Bottle size', ar: 'حجم العبوة', opts: [['250', '250 ml', '٢٥٠ مل'], ['400', '400 ml', '٤٠٠ مل'], ['1000', '1 L pump', '١ لتر بامب']] },
      { k: 'qty', type: 'number', req: true, unit: { en: 'units', ar: 'عبوة' }, en: 'Quantity', ar: 'الكمية' }
    ] },
    other: { en: 'Other / custom request', ar: 'طلب آخر', cat: 'custom', fields: [
      { k: 'desc', type: 'textarea', req: true, en: 'Describe the product', ar: 'اوصف المنتج', ph: 'What is it, who is it for, what makes it different?' },
      { k: 'ref', type: 'text', en: 'Similar product on the market (optional)', ar: 'منتج مشابه في السوق (اختياري)' },
      { k: 'qty', type: 'number', req: true, unit: { en: 'units', ar: 'وحدة' }, en: 'First-order quantity', ar: 'كمية أول طلب' },
      { k: 'budget', type: 'number', unit: { en: 'EGP', ar: 'ج.م' }, en: 'Budget (optional)', ar: 'الميزانية (اختياري)' }
    ] }
  };
}

const ADMIN_APPLICANTS = [
  { id: 'ap1', en: 'Upper Egypt Spice Mills', ar: 'مطاحن الصعيد للتوابل', gov: { en: 'Assiut', ar: 'أسيوط' }, cat: 'food', submitted: '2026-11-12',
    docs: [
      { k: 'cr', en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', file: 'cr_extract.pdf', st: 'pending' },
      { k: 'tax', en: 'Tax card', ar: 'البطاقة الضريبية', file: 'tax_card.jpg', st: 'pending' },
      { k: 'lic', en: 'Factory operating licence', ar: 'رخصة تشغيل المصنع', file: null, st: 'missing' },
      { k: 'fs', en: 'Food-safety certificate', ar: 'شهادة سلامة غذاء', file: 'fs_cert.pdf', st: 'pending', exp: '2026-09-30' }
    ] },
  { id: 'ap2', en: 'Alex Bottle Works', ar: 'ورشة إسكندرية للعبوات', gov: { en: 'Alexandria', ar: 'الإسكندرية' }, cat: 'packaging', submitted: '2026-11-14',
    docs: [
      { k: 'cr', en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', file: 'CR-2026.pdf', st: 'pending' },
      { k: 'tax', en: 'Tax card', ar: 'البطاقة الضريبية', file: 'tax.pdf', st: 'pending' },
      { k: 'lic', en: 'Factory operating licence', ar: 'رخصة تشغيل المصنع', file: 'licence.pdf', st: 'pending' }
    ] },
  { id: 'ap3', en: 'Fayoum Linen House', ar: 'بيت الفيوم للمفروشات', gov: { en: 'Fayoum', ar: 'الفيوم' }, cat: 'textiles', submitted: '2026-11-15',
    docs: [
      { k: 'cr', en: 'Commercial registry extract', ar: 'مستخرج السجل التجاري', file: 'cr.pdf', st: 'pending' },
      { k: 'tax', en: 'Tax card', ar: 'البطاقة الضريبية', file: null, st: 'missing' }
    ] }
];

const GLOSSARY = [
  ['RFQ', 'طلب عرض سعر (RFQ)', 'Request for quotation: your structured request sent to selected suppliers so they price the same thing.', 'طلب منظم بيتبعت لموردين مختارين عشان يسعّروا نفس المواصفات بالظبط.'],
  ['MOQ', 'الحد الأدنى للطلب (MOQ)', 'Minimum order quantity: the smallest batch a supplier will produce.', 'أقل كمية المصنع يقبل يشتغلها في الطلب الواحد.'],
  ['Private label', 'برايفت ليبل', 'A manufacturer’s existing product packed under your brand.', 'منتج موجود عند المصنع بيتعبّى باسمك وتصميمك.'],
  ['Contract manufacturing', 'تصنيع حسب الطلب', 'Production to your own specification, formula or design.', 'تصنيع على مواصفاتك أو تصميمك الخاص.'],
  ['Lead time', 'مدة التنفيذ', 'Days from written order (and deposit, if any) to goods ready.', 'عدد الأيام من تأكيد الطلب كتابيًا (والمقدم لو موجود) لحد ما البضاعة تجهز.'],
  ['Comparable total', 'الإجمالي القابل للمقارنة', 'All quote lines for the same quantity, with VAT treated the same way, so offers can be compared fairly.', 'كل بنود العرض لنفس الكمية، مع حساب الضريبة بنفس الطريقة، عشان المقارنة تبقى عادلة.'],
  ['VAT', 'ضريبة القيمة المضافة', 'Value-added tax. The demo uses 14% to normalise quotes; confirm treatment with your accountant.', 'الديمو بيستخدم ١٤٪ لتوحيد العروض؛ اتأكد من المعاملة الضريبية مع المحاسب.'],
  ['Setup / tooling', 'تكاليف تجهيز', 'One-off costs such as printing plates or moulds. Often reusable on reorder.', 'تكاليف بتتدفع مرة واحدة زي الأكلاشيهات أو الاسطمبات، وغالبًا بتتستخدم تاني في إعادة الطلب.'],
  ['Deductible sample', 'عينة بتتخصم', 'The sample fee is subtracted from the order if you go ahead.', 'تمن العينة بيتخصم من الطلب لو كمّلت مع نفس المورد.'],
  ['Golden sample', 'العينة المعتمدة', 'The approved sample production must match. Recorded with date and notes.', 'العينة اللي اتوافق عليها والإنتاج لازم يطابقها، ومسجلة بالتاريخ والملاحظات.'],
  ['Spec sheet', 'ملف المواصفات', 'One document listing everything about your product. Every quote is priced against it.', 'مستند واحد فيه كل تفاصيل منتجك، وكل عرض سعر بيتحسب عليه.'],
  ['Shelf life', 'مدة الصلاحية', 'How long the product stays fit for sale. Only the manufacturer can confirm it, usually with testing.', 'المدة اللي المنتج يفضل صالح فيها للبيع؛ المصنع بس يقدر يأكدها وغالبًا بتحاليل.'],
  ['GSM', 'وزن القماش (GSM)', 'Grams per square metre — fabric weight.', 'جرام لكل متر مربع — بيعبر عن تقل القماش.'],
  ['m³', 'متر مكعب', 'Cubic metre, the usual unit for buying timber.', 'الوحدة المعتادة لشراء الخشب.'],
  ['COA', 'شهادة تحليل (COA)', 'Certificate of analysis for a batch, issued by the manufacturer or a lab.', 'شهادة نتائج تحليل لدفعة إنتاج، من المصنع أو معمل.']
];
