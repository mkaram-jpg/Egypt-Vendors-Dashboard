/* Nawah prototype — product portfolio + brand studio.
   Mockups are drawn in the browser as SVG concepts. They are NOT supplier photos and NOT final print artwork. */
'use strict';

S.brand ??= { name: '', tagline: '', color: '', style: 'modern', seed: 0, saved: [] };
S.sampleBasket ??= [];
S.ui.studioCat ??= 'all';

/* ---------- colour helpers ---------- */
function hslHex(h, s, l) { s /= 100; l /= 100; const k = n => (n + h / 30) % 12; const a = s * Math.min(l, 1 - l);
  const f = n => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))).toString(16).padStart(2, '0'); return `#${f(0)}${f(8)}${f(4)}`; }
function lum(hex) { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; }
const onColor = bg => (lum(bg) > .45 ? '#14201C' : '#FFFFFF');
const shade = (hex, amt) => { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(v + amt))).toString(16).padStart(2, '0'); return `#${f(n >> 16)}${f((n >> 8) & 255)}${f(n & 255)}`; };
const isArText = s => /[؀-ۿ]/.test(s || '');

/* ---------- design styles ("new designs") ---------- */
const STYLES = [
  { id: 'modern', en: 'Modern', ar: 'مودرن', font: '"Readex Pro", sans-serif', bg: [164, 70, 22], acc: [39, 80, 55], pat: 'dots', layout: 'band', rot: true },
  { id: 'classic', en: 'Classic', ar: 'كلاسيك', font: 'Amiri, serif', bg: [40, 50, 90], acc: [30, 60, 32], pat: 'none', layout: 'frame', rot: true },
  { id: 'minimal', en: 'Minimal', ar: 'بسيط', font: '"IBM Plex Sans Arabic", sans-serif', bg: [0, 0, 98], acc: [0, 0, 12], pat: 'none', layout: 'minimal', rot: false },
  { id: 'bold', en: 'Bold', ar: 'جريء', font: 'Lalezar, "Readex Pro", sans-serif', bg: [8, 78, 50], acc: [46, 95, 58], pat: 'stripes', layout: 'big', rot: true },
  { id: 'kraft', en: 'Natural kraft', ar: 'كرافت طبيعي', font: 'Amiri, serif', bg: [32, 42, 64], acc: [145, 35, 26], pat: 'grain', layout: 'stamp', rot: false },
  { id: 'pastel', en: 'Soft pastel', ar: 'باستيل هادي', font: '"Readex Pro", sans-serif', bg: [200, 65, 88], acc: [340, 65, 62], pat: 'waves', layout: 'band', rot: true }
];
const BRAND_COLORS = ['', '#0E5A4B', '#B83227', '#1F4E9C', '#6B3FA0', '#C77D0A', '#1A1A1A', '#2E8B57', '#D9467A'];
function design(styleId) {
  const st = STYLES.find(s => s.id === styleId) || STYLES[0]; const sh = st.rot ? (S.brand.seed * 47) % 360 : 0;
  let bg = hslHex((st.bg[0] + sh) % 360, st.bg[1], st.bg[2]); let acc = hslHex((st.acc[0] + sh) % 360, st.acc[1], st.acc[2]);
  const c = S.brand.color; if (c) { if (['modern', 'bold', 'pastel'].includes(st.id)) bg = st.id === 'pastel' ? shade(c, 150) : c; else acc = c; }
  return { ...st, bg, acc, ink: onColor(bg) };
}

/* ---------- text fitting ---------- */
function txt(x, y, str, size, fill, font, maxW, weight = 600) {
  if (!str) return ''; const ar = isArText(str); const est = str.length * size * (ar ? .5 : .6);
  const fs = est > maxW ? Math.max(6, size * maxW / est) : size;
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family='${font}' font-size="${fs.toFixed(1)}" font-weight="${weight}" fill="${fill}"${ar ? ' direction="rtl"' : ''}>${esc(str)}</text>`;
}
const brandName = () => S.brand.name.trim() || tx('Your Brand', 'علامتك');

/* ---------- label artwork applied to any surface ---------- */
let UID = 0;
function labelArt(x, y, w, h, d, item, uid) {
  const cx = x + w / 2; const name = brandName(); const tag = S.brand.tagline.trim(); const line = L(item.line); const size = item.size ? (isAr() ? item.size[1] : item.size[0]) : '';
  const accInk = onColor(d.acc); const font = d.font; let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${d.bg}"/>`;
  if (d.pat !== 'none') s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#pt${uid})"/>`;
  const mono = (cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${d.acc}"/>${txt(cx, cy + r * .36, [...name][0].toUpperCase(), r * 1.05, accInk, font, r * 1.6, 700)}`;
  if (d.layout === 'band') {
    s += mono(y + h * .2, h * .07) + txt(cx, y + h * .43, name, h * .13, d.ink, font, w * .86, 700) + txt(cx, y + h * .52, tag, h * .05, d.ink, font, w * .8, 400)
      + `<rect x="${x}" y="${y + h * .62}" width="${w}" height="${h * .15}" fill="${d.acc}"/>` + txt(cx, y + h * .72, line, h * .065, accInk, font, w * .86) + txt(cx, y + h * .9, size, h * .06, d.ink, font, w * .5, 500);
  } else if (d.layout === 'frame') {
    s += `<rect x="${x + w * .07}" y="${y + h * .06}" width="${w * .86}" height="${h * .88}" fill="none" stroke="${d.acc}" stroke-width="1.6"/><rect x="${x + w * .1}" y="${y + h * .085}" width="${w * .8}" height="${h * .83}" fill="none" stroke="${d.acc}" stroke-width=".6"/>`
      + txt(cx, y + h * .22, tx('EST. 2026', 'منذ ٢٠٢٦'), h * .045, d.acc, font, w * .6, 400) + txt(cx, y + h * .42, name, h * .14, d.ink, font, w * .76, 700) + txt(cx, y + h * .51, tag, h * .05, d.acc, font, w * .7, 400)
      + `<path d="M${cx - w * .25} ${y + h * .6} h${w * .5}" stroke="${d.acc}" stroke-width="1"/><circle cx="${cx}" cy="${y + h * .6}" r="2.4" fill="${d.acc}"/>` + txt(cx, y + h * .72, line, h * .07, d.ink, font, w * .72) + txt(cx, y + h * .86, size, h * .055, d.acc, font, w * .5, 500);
  } else if (d.layout === 'minimal') {
    s += txt(cx, y + h * .3, name, h * .11, d.ink, font, w * .82, 600) + `<rect x="${cx - w * .12}" y="${y + h * .36}" width="${w * .24}" height="1.4" fill="${d.ink}"/>`
      + txt(cx, y + h * .46, tag, h * .045, d.ink, font, w * .8, 400) + txt(cx, y + h * .66, line, h * .06, d.ink, font, w * .8, 500) + txt(cx, y + h * .88, size, h * .05, d.ink, font, w * .5, 400);
  } else if (d.layout === 'big') {
    s += `<circle cx="${cx + w * .28}" cy="${y + h * .2}" r="${h * .13}" fill="${d.acc}"/>` + txt(cx + w * .28, y + h * .22, tx('NEW', 'جديد'), h * .05, accInk, font, h * .2, 700)
      + txt(cx, y + h * .5, name, h * .2, d.ink, font, w * .92, 700) + txt(cx, y + h * .6, tag, h * .055, d.ink, font, w * .85, 400)
      + `<rect x="${x + w * .1}" y="${y + h * .68}" width="${w * .8}" height="${h * .12}" rx="${h * .06}" fill="${d.acc}"/>` + txt(cx, y + h * .765, line, h * .06, accInk, font, w * .74) + txt(cx, y + h * .93, size, h * .055, d.ink, font, w * .5, 500);
  } else { // stamp
    s += `<circle cx="${cx}" cy="${y + h * .38}" r="${Math.min(w, h) * .3}" fill="none" stroke="${d.acc}" stroke-width="1.6" stroke-dasharray="3 2"/><circle cx="${cx}" cy="${y + h * .38}" r="${Math.min(w, h) * .26}" fill="none" stroke="${d.acc}" stroke-width=".7"/>`
      + txt(cx, y + h * .4, name, h * .11, d.ink, font, Math.min(w, h) * .46, 700) + txt(cx, y + h * .47, tag, h * .04, d.acc, font, Math.min(w, h) * .44, 400)
      + txt(cx, y + h * .78, line, h * .07, d.ink, font, w * .8) + txt(cx, y + h * .9, size, h * .055, d.acc, font, w * .5, 500);
  }
  return s;
}
function patternDef(d, uid) {
  const a = d.ink === '#FFFFFF' ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.08)';
  if (d.pat === 'dots') return `<pattern id="pt${uid}" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="${a}"/></pattern>`;
  if (d.pat === 'stripes') return `<pattern id="pt${uid}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="4" height="10" fill="${a}"/></pattern>`;
  if (d.pat === 'waves') return `<pattern id="pt${uid}" width="24" height="10" patternUnits="userSpaceOnUse"><path d="M0 6 q6 -5 12 0 t12 0" fill="none" stroke="${a}" stroke-width="1.4"/></pattern>`;
  if (d.pat === 'grain') return `<pattern id="pt${uid}" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".7" fill="rgba(60,30,0,.18)"/><circle cx="5" cy="5" r=".5" fill="rgba(60,30,0,.14)"/></pattern>`;
  return '';
}

/* ---------- product shapes (viewBox 0 0 200 240) ---------- */
const WOOD = { beech: '#D9B48A', oak: '#C59A63', pine: '#E9CFA2', walnut: '#6E4A2F', mdf: '#CDB89A', mixed: '#C59A63' };
const LIQUID = { clear: '#D7ECF1', green: '#8FC85A', yellow: '#EFD15A', pink: '#F2A6C0', mfr: '#9ED3E6', blue: '#8CCBE9', amber: '#D8962B' };
const OUT = 'stroke="rgba(0,0,0,.18)" stroke-width="1"';
function clipLabel(uid, shape, x, y, w, h, d, item) { return `<clipPath id="cl${uid}">${shape}</clipPath><g clip-path="url(#cl${uid})">${labelArt(x, y, w, h, d, item, uid)}</g>`; }
const gloss = (x, y, w, h, r = 6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#fff" opacity=".18"/>`;
const SHAPES = {
  pouch: (d, it, u) => { const p = 'M50 30 h100 q6 0 6 6 v150 q0 18 -14 24 q-42 10 -84 0 q-14 -6 -14 -24 v-150 q0 -6 6 -6z';
    return `${clipLabel(u, `<path d="${p}"/>`, 44, 36, 112, 176, d, it)}<path d="${p}" fill="none" ${OUT}/><rect x="44" y="30" width="112" height="7" fill="rgba(0,0,0,.1)"/><path d="M48 47 h104" stroke="rgba(0,0,0,.2)" stroke-dasharray="3 2"/>${gloss(52, 40, 8, 160, 4)}${it.valve ? `<circle cx="132" cy="62" r="6" fill="${d.ink === '#FFFFFF' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.15)'}"/><circle cx="132" cy="62" r="2.4" fill="rgba(0,0,0,.25)"/>` : ''}`; },
  jar: (d, it, u) => `<rect x="62" y="38" width="76" height="24" rx="5" fill="${shade(d.acc, -20)}"/><rect x="62" y="38" width="76" height="6" rx="3" fill="rgba(255,255,255,.2)"/><rect x="52" y="60" width="96" height="146" rx="20" fill="${LIQUID[it.fill] || it.fill || '#CDA06A'}" opacity=".85"/>
    ${clipLabel(u, '<rect x="52" y="96" width="96" height="80"/>', 52, 96, 96, 80, d, it)}<rect x="52" y="60" width="96" height="146" rx="20" fill="none" ${OUT}/>${gloss(60, 66, 9, 130, 5)}`,
  bottle: (d, it, u) => { const liq = LIQUID[it.liquid] || it.liquid || '#8FC85A'; const b = 'M80 62 q20 -10 40 0 l12 30 v112 q0 14 -14 14 h-36 q-14 0 -14 -14 v-112z';
    return `<rect x="88" y="26" width="24" height="24" rx="4" fill="${shade(d.acc, -10)}"/><rect x="84" y="46" width="32" height="10" rx="3" fill="${shade(d.acc, -30)}"/><path d="${b}" fill="${liq}"/>${clipLabel(u, '<rect x="70" y="112" width="60" height="86" rx="6"/>', 70, 112, 60, 86, d, it)}<path d="${b}" fill="none" ${OUT}/>${gloss(74, 96, 6, 110, 3)}`; },
  pump: (d, it, u) => { const liq = LIQUID[it.liquid] || '#F2A6C0';
    return `<path d="M96 44 h30 v7 h-22 v14 h-8z" fill="${shade(d.acc, -25)}"/><rect x="84" y="62" width="32" height="14" rx="4" fill="${shade(d.acc, -10)}"/><rect x="62" y="76" width="76" height="136" rx="16" fill="${liq}"/>${clipLabel(u, '<rect x="62" y="104" width="76" height="90"/>', 62, 104, 76, 90, d, it)}<rect x="62" y="76" width="76" height="136" rx="16" fill="none" ${OUT}/>${gloss(68, 84, 7, 118, 3)}`; },
  spray: (d, it, u) => `<path d="M86 50 h44 l8 12 h-14 l-4 8 h-34z" fill="${shade(d.acc, -15)}"/><path d="M100 70 v14 h18 v-14z" fill="${shade(d.acc, -30)}"/><path d="M96 84 h28 l10 24 v100 q0 6 -6 6 h-56 q-6 0 -6 -6 v-100z" fill="${LIQUID[it.liquid] || '#8CCBE9'}"/>
    ${clipLabel(u, '<rect x="66" y="128" width="68" height="76"/>', 66, 128, 68, 76, d, it)}<path d="M96 84 h28 l10 24 v100 q0 6 -6 6 h-56 q-6 0 -6 -6 v-100z" fill="none" ${OUT}/>`,
  gallon: (d, it, u) => `<path d="M60 60 h50 v-18 h18 v18 h14 q8 0 8 8 v138 q0 8 -8 8 h-82 q-8 0 -8 -8 v-138 q0 -8 8 -8z" fill="${LIQUID[it.liquid] || '#EFD15A'}"/><path d="M118 70 h18 v34 h-18z" fill="rgba(255,255,255,.4)"/><rect x="108" y="32" width="22" height="12" rx="3" fill="${shade(d.acc, -15)}"/>
    ${clipLabel(u, '<rect x="52" y="112" width="98" height="86"/>', 52, 112, 98, 86, d, it)}<path d="M60 60 h50 v-18 h18 v18 h14 q8 0 8 8 v138 q0 8 -8 8 h-82 q-8 0 -8 -8 v-138 q0 -8 8 -8z" fill="none" ${OUT}/>`,
  box: (d, it, u) => `<path d="M40 74 l26 -24 h100 l-26 24z" fill="${shade(d.bg, -25)}"/><path d="M140 74 l26 -24 v138 l-26 24z" fill="${shade(d.bg, -45)}"/>${clipLabel(u, '<rect x="40" y="74" width="100" height="138"/>', 40, 74, 100, 138, d, it)}<rect x="40" y="74" width="100" height="138" fill="none" ${OUT}/>`,
  tin: (d, it, u) => `${clipLabel(u, '<rect x="58" y="70" width="84" height="134"/>', 58, 70, 84, 134, d, it)}<ellipse cx="100" cy="70" rx="42" ry="10" fill="${shade(d.acc, -10)}"/><ellipse cx="100" cy="70" rx="34" ry="6" fill="rgba(255,255,255,.25)"/><path d="M58 204 q42 16 84 0" fill="none" ${OUT}/><rect x="58" y="70" width="84" height="134" fill="none" ${OUT}/>${gloss(64, 80, 7, 116, 3)}`,
  tube: (d, it, u) => `<rect x="66" y="22" width="68" height="12" fill="${shade(d.bg, -30)}"/>${clipLabel(u, '<path d="M66 34 h68 l-8 146 h-52z"/>', 66, 34, 68, 146, d, it)}<path d="M66 34 h68 l-8 146 h-52z" fill="none" ${OUT}/><rect x="80" y="180" width="40" height="30" rx="5" fill="${shade(d.acc, -10)}"/>`,
  perfume: (d, it, u) => `<rect x="86" y="42" width="28" height="40" rx="4" fill="${shade(d.acc, -5)}"/><rect x="92" y="80" width="16" height="12" fill="#c9c9c9"/><rect x="56" y="92" width="88" height="116" rx="12" fill="${LIQUID[it.liquid] || '#F3DDB0'}" opacity=".9"/>
    ${clipLabel(u, '<rect x="72" y="122" width="56" height="60" rx="4"/>', 72, 122, 56, 60, d, it)}<rect x="56" y="92" width="88" height="116" rx="12" fill="none" ${OUT}/>${gloss(62, 98, 8, 100, 4)}`,
  bag: (d, it, u) => `<path d="M76 84 q0 -36 24 -36 t24 36" fill="none" stroke="${shade(d.acc, -10)}" stroke-width="5"/>${clipLabel(u, '<path d="M48 84 h104 l8 130 h-120z"/>', 44, 84, 112, 130, d, it)}<path d="M48 84 h104 l8 130 h-120z" fill="none" ${OUT}/>`,
  label: (d, it, u) => `<rect x="48" y="58" width="112" height="140" rx="14" fill="rgba(0,0,0,.08)" transform="translate(6 6)"/>${clipLabel(u, '<rect x="44" y="54" width="112" height="140" rx="14"/>', 44, 54, 112, 140, d, it)}<path d="M156 168 l-26 26 v-14 q0 -12 12 -12z" fill="#eee" ${OUT}/>`,
  tshirt: (d, it) => { const p = 'M70 40 l-38 18 l14 34 l20 -9 v122 h68 v-122 l20 9 l14 -34 l-38 -18 q-14 14 -30 14 q-16 0 -30 -14z';
    return `<path d="${p}" fill="${d.bg}" ${OUT}/><path d="M70 40 q30 22 60 0" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="3"/>${txt(100, 108, brandName(), 22, d.ink, d.font, 66, 700)}${txt(100, 122, S.brand.tagline.trim(), 7, d.acc === d.bg ? d.ink : d.acc, d.font, 60, 400)}<circle cx="100" cy="84" r="7" fill="${d.acc}"/>`; },
  hoodie: (d, it) => { const p = 'M70 48 l-38 18 l10 120 h20 l4 -88 v120 h68 v-120 l4 88 h20 l10 -120 l-38 -18 q-30 20 -60 0z';
    return `<path d="M72 50 q28 -40 56 0 q-28 16 -56 0z" fill="${shade(d.bg, -18)}" ${OUT}/><path d="${p}" fill="${d.bg}" ${OUT}/><path d="M78 168 h44 v22 h-44z" fill="${shade(d.bg, -12)}"/>${txt(100, 118, brandName(), 20, d.ink, d.font, 62, 700)}<path d="M96 60 v20 M104 60 v20" stroke="${d.acc}" stroke-width="2"/>`; },
  sack: (d, it, u) => `<path d="M52 46 h96 l8 166 h-112z" fill="#E7DFCB" ${OUT}/><pattern id="wv${u}" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3 h6 M3 0 v6" stroke="rgba(0,0,0,.05)"/></pattern><path d="M52 46 h96 l8 166 h-112z" fill="url(#wv${u})"/><path d="M52 56 h96" stroke="rgba(0,0,0,.25)" stroke-dasharray="4 3"/>
    ${clipLabel(u, '<rect x="62" y="82" width="76" height="100" rx="4"/>', 62, 82, 76, 100, d, it)}`,
  timber: (d, it, u) => { let s = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const x = 34 + c * 44 + (r % 2) * 6, y = 186 - r * 30; s += `<rect x="${x}" y="${y}" width="42" height="28" rx="3" fill="${WOOD[it.wood] || '#D9B48A'}" ${OUT}/><ellipse cx="${x + 21}" cy="${y + 14}" rx="9" ry="6" fill="none" stroke="rgba(90,50,10,.25)"/>`; }
    return s + `<path d="M150 70 v24" stroke="#888"/>${clipLabel(u, '<rect x="124" y="94" width="56" height="56" rx="4"/>', 124, 94, 56, 56, d, it)}`; },
  fabric: (d, it, u) => `<rect x="36" y="100" width="128" height="74" fill="${shade(d.bg, 10)}"/><rect x="36" y="100" width="128" height="74" fill="url(#pt${u})"/><ellipse cx="36" cy="137" rx="12" ry="37" fill="${shade(d.bg, -20)}"/><ellipse cx="164" cy="137" rx="12" ry="37" fill="${shade(d.bg, 25)}" ${OUT}/><ellipse cx="164" cy="137" rx="4" ry="12" fill="#999"/>
    <path d="M100 100 v-30" stroke="#888"/>${clipLabel(u, '<rect x="72" y="22" width="56" height="48" rx="4"/>', 72, 22, 56, 48, d, it)}`,
  table: (d, it, u) => { const w = WOOD[it.wood] || '#C59A63';
    return `<rect x="26" y="104" width="148" height="14" rx="3" fill="${w}" ${OUT}/><rect x="36" y="118" width="128" height="12" fill="${shade(w, -25)}"/><rect x="40" y="130" width="10" height="80" fill="${shade(w, -15)}"/><rect x="150" y="130" width="10" height="80" fill="${shade(w, -15)}"/><rect x="62" y="130" width="7" height="70" fill="${shade(w, -35)}"/><rect x="131" y="130" width="7" height="70" fill="${shade(w, -35)}"/>
      <path d="M156 118 v18" stroke="#777"/>${clipLabel(u, '<rect x="134" y="136" width="44" height="50" rx="4"/>', 134, 136, 44, 50, d, it)}`; },
  chair: (d, it, u) => { const w = WOOD[it.wood] || '#C59A63';
    return `<rect x="70" y="40" width="60" height="70" rx="6" fill="${w}" ${OUT}/><rect x="64" y="110" width="72" height="14" rx="3" fill="${shade(w, -15)}"/><rect x="68" y="124" width="8" height="86" fill="${shade(w, -25)}"/><rect x="124" y="124" width="8" height="86" fill="${shade(w, -25)}"/>
      <path d="M136 124 v14" stroke="#777"/>${clipLabel(u, '<rect x="122" y="138" width="44" height="50" rx="4"/>', 122, 138, 44, 50, d, it)}`; },
  shelf: (d, it, u) => { const w = WOOD[it.wood] || '#D9B48A'; let s = `<rect x="40" y="30" width="8" height="184" fill="${shade(w, -20)}"/><rect x="132" y="30" width="8" height="184" fill="${shade(w, -20)}"/>`;
    [44, 92, 140, 188].forEach(y => (s += `<rect x="36" y="${y}" width="108" height="9" rx="2" fill="${w}" ${OUT}/>`)); s += `<rect x="56" y="70" width="14" height="22" fill="${d.acc}"/><rect x="74" y="74" width="10" height="18" fill="${shade(d.acc, 40)}"/><circle cx="110" cy="128" r="11" fill="${d.bg}" ${OUT}/>`;
    return s + `<path d="M144 100 v16" stroke="#777"/>${clipLabel(u, '<rect x="140" y="116" width="44" height="50" rx="4"/>', 140, 116, 44, 50, d, it)}`; }
};
function mockup(item, styleId, cls = '') {
  const d = design(styleId || S.brand.style); const u = ++UID;
  return `<svg class="mock ${cls}" viewBox="0 0 200 240" role="img" aria-label="${esc(L(item))} — ${esc(brandName())}"><defs>${patternDef(d, u)}</defs>
    <ellipse cx="100" cy="222" rx="66" ry="7" fill="rgba(0,0,0,.12)"/>${SHAPES[item.type](d, item, u)}</svg>`;
}
/* Brand identity sheet: logo lockups */
function brandLogo(styleId, variant) {
  const d = design(styleId); const n = brandName(); const t = S.brand.tagline.trim(); const ai = onColor(d.acc); const u = ++UID;
  const bg = variant === 1 ? d.acc : variant === 2 ? '#FFFFFF' : d.bg; const ink = variant === 1 ? ai : variant === 2 ? '#14201C' : d.ink; const mk = variant === 1 ? d.bg : d.acc;
  return `<svg viewBox="0 0 320 160" class="mock-logo" role="img" aria-label="${esc(n)} logo concept"><defs>${patternDef(d, u)}</defs><rect width="320" height="160" rx="14" fill="${bg}" stroke="rgba(0,0,0,.08)"/>
    <circle cx="70" cy="80" r="34" fill="${mk}"/>${txt(70, 93, [...n][0].toUpperCase(), 36, onColor(mk), d.font, 50, 700)}
    ${txt(196, 84, n, 34, ink, d.font, 200, 700)}${txt(196, 108, t, 12, ink, d.font, 190, 400)}</svg>`;
}

/* ---------- portfolio data (concept items; "sup" = demo supplier offering it) ---------- */
const PORTFOLIO = [
  { id: 'nuts-pouch', cat: 'food', type: 'pouch', en: 'Mixed nuts stand-up pouch', ar: 'مكسرات مشكلة كيس واقف', line: { en: 'Roasted Mixed Nuts', ar: 'مكسرات مشكلة محمصة' }, size: ['200 g', '200 جم'], sup: 'sw1', use: 'nuts-standup' },
  { id: 'nuts-jar', cat: 'food', type: 'jar', fill: '#CDA06A', en: 'Premium cashew jar', ar: 'كاجو برطمان فاخر', line: { en: 'Premium Cashews', ar: 'كاجو فاخر' }, size: ['250 g', '250 جم'], sup: 'sw1', use: 'nuts-jar' },
  { id: 'coffee', cat: 'food', type: 'pouch', valve: true, en: 'Turkish coffee bag', ar: 'كيس بن تركي', line: { en: 'Turkish Coffee · Cardamom', ar: 'بن تركي محوّج' }, size: ['250 g', '250 جم'], sup: 'sw2', use: 'tpl-coffee' },
  { id: 'spice', cat: 'food', type: 'tin', en: 'Spice tin', ar: 'علبة توابل', line: { en: 'Cumin · Ground', ar: 'كمون مطحون' }, size: ['100 g', '100 جم'], sup: 'sw2', use: 'other' },
  { id: 'honey', cat: 'food', type: 'jar', fill: 'amber', en: 'Honey jar', ar: 'برطمان عسل', line: { en: 'Pure Clover Honey', ar: 'عسل برسيم' }, size: ['450 g', '450 جم'], sup: 'sw3', use: 'other' },
  { id: 'dates', cat: 'food', type: 'box', en: 'Dates gift box', ar: 'علبة تمر هدايا', line: { en: 'Siwa Dates', ar: 'تمر سيوي' }, size: ['500 g', '500 جم'], sup: 'sw3', use: 'other' },
  { id: 'dish', cat: 'cleaning', type: 'bottle', liquid: 'green', en: 'Dishwashing liquid', ar: 'سائل أطباق', line: { en: 'Dishwashing Liquid · Lemon', ar: 'سائل أطباق · ليمون' }, size: ['750 ml', '750 مل'], sup: 'sw4', use: 'dish' },
  { id: 'handsoap', cat: 'cleaning', type: 'pump', liquid: 'pink', en: 'Hand soap pump', ar: 'صابون أيدي بامب', line: { en: 'Hand Wash · Rose', ar: 'صابون أيدي · ورد' }, size: ['500 ml', '500 مل'], sup: 'sw4', use: 'other' },
  { id: 'glass', cat: 'cleaning', type: 'spray', liquid: 'blue', en: 'Glass cleaner spray', ar: 'منظف زجاج بخاخ', line: { en: 'Glass Cleaner', ar: 'منظف زجاج' }, size: ['650 ml', '650 مل'], sup: 'sw4', use: 'other' },
  { id: 'powder', cat: 'cleaning', type: 'box', en: 'Laundry powder box', ar: 'علبة مسحوق غسيل', line: { en: 'Laundry Powder · Automatic', ar: 'مسحوق غسيل أوتوماتيك' }, size: ['2.5 kg', '2.5 كجم'], sup: 'sw4', use: 'other' },
  { id: 'floor', cat: 'cleaning', type: 'gallon', liquid: 'yellow', en: 'Floor cleaner gallon', ar: 'منظف أرضيات جركن', line: { en: 'Floor Cleaner · Fresh', ar: 'منظف أرضيات · فريش' }, size: ['4 L', '4 لتر'], sup: 'sw4', use: 'other' },
  { id: 'shampoo', cat: 'personal', type: 'bottle', liquid: '#E9C46A', en: 'Shampoo bottle', ar: 'عبوة شامبو', line: { en: 'Argan Shampoo', ar: 'شامبو أرجان' }, size: ['400 ml', '400 مل'], sup: 'sw10', use: 'tpl-shampoo' },
  { id: 'bodywash', cat: 'personal', type: 'pump', liquid: '#B9E4D6', en: 'Body wash pump', ar: 'شاور جل بامب', line: { en: 'Body Wash · Aloe', ar: 'شاور جل · صبار' }, size: ['1 L', '1 لتر'], sup: 'sw10', use: 'other' },
  { id: 'cream', cat: 'personal', type: 'tube', en: 'Face cream tube', ar: 'كريم وش أنبوبة', line: { en: 'Daily Face Cream', ar: 'كريم وش يومي' }, size: ['50 ml', '50 مل'], sup: 'sw10', use: 'other' },
  { id: 'perfume', cat: 'personal', type: 'perfume', en: 'Body mist bottle', ar: 'زجاجة بودي ميست', line: { en: 'Body Mist · Oud', ar: 'بودي ميست · عود' }, size: ['100 ml', '100 مل'], sup: 'sw10', use: 'other' },
  { id: 'dining', cat: 'furniture', type: 'table', wood: 'beech', en: 'Solid beech dining table', ar: 'ترابيزة سفرة زان', line: { en: 'Dining Table', ar: 'ترابيزة سفرة' }, size: ['180 × 90 cm', '180 × 90 سم'], sup: 'sw6', use: 'table' },
  { id: 'coffeetable', cat: 'furniture', type: 'table', wood: 'walnut', en: 'Walnut coffee table', ar: 'ترابيزة صالون جوز', line: { en: 'Coffee Table', ar: 'ترابيزة صالون' }, size: ['110 × 60 cm', '110 × 60 سم'], sup: 'sw6', use: 'table' },
  { id: 'chair', cat: 'furniture', type: 'chair', wood: 'oak', en: 'Oak dining chair', ar: 'كرسي سفرة أرو', line: { en: 'Dining Chair', ar: 'كرسي سفرة' }, size: ['45 cm seat', 'قعدة 45 سم'], sup: 'sw6', use: 'other' },
  { id: 'shelf', cat: 'furniture', type: 'shelf', wood: 'pine', en: 'Pine shelving unit', ar: 'وحدة أرفف موسكي', line: { en: 'Shelving Unit', ar: 'وحدة أرفف' }, size: ['4 shelves', '4 أرفف'], sup: 'sw6', use: 'other' },
  { id: 'tshirt', cat: 'textiles', type: 'tshirt', en: 'Cotton T-shirt with print', ar: 'تيشيرت قطن مطبوع', line: { en: 'T-shirt', ar: 'تيشيرت' }, size: ['180 GSM', '180 جم/م²'], sup: 'sw8', use: 'tpl-tshirt' },
  { id: 'hoodie', cat: 'textiles', type: 'hoodie', en: 'Fleece hoodie', ar: 'هودي فليس', line: { en: 'Hoodie', ar: 'هودي' }, size: ['320 GSM', '320 جم/م²'], sup: 'sw8', use: 'other' },
  { id: 'tote', cat: 'textiles', type: 'bag', en: 'Canvas tote bag', ar: 'شنطة قماش', line: { en: 'Canvas Tote', ar: 'شنطة قماش' }, size: ['38 × 42 cm', '38 × 42 سم'], sup: 'sw8', use: 'other' },
  { id: 'pk-pouch', cat: 'packaging', type: 'pouch', en: 'Printed stand-up pouch', ar: 'كيس واقف مطبوع', line: { en: 'Stand-up Pouch', ar: 'كيس واقف' }, size: ['140 × 220 mm', '140 × 220 مم'], sup: 'sw9', use: 'tpl-pouch' },
  { id: 'pk-carton', cat: 'packaging', type: 'box', en: 'Mailer carton', ar: 'كرتونة شحن مطبوعة', line: { en: 'Shipping Carton', ar: 'كرتونة شحن' }, size: ['30 × 20 × 15 cm', '30 × 20 × 15 سم'], sup: 'sw9', use: 'other' },
  { id: 'pk-label', cat: 'packaging', type: 'label', en: 'Product label / sticker', ar: 'ليبل / ستيكر منتج', line: { en: 'Front Label', ar: 'ليبل أمامي' }, size: ['80 × 100 mm', '80 × 100 مم'], sup: 'sw9', use: 'other' },
  { id: 'pk-bag', cat: 'packaging', type: 'bag', en: 'Paper shopping bag', ar: 'شنطة ورق للمحل', line: { en: 'Shopping Bag', ar: 'شنطة تسوق' }, size: ['32 × 40 cm', '32 × 40 سم'], sup: 'sw9', use: 'other' },
  { id: 'pk-bottle', cat: 'packaging', type: 'bottle', liquid: 'clear', en: 'PET bottle with flip cap', ar: 'عبوة PET بغطا فليب', line: { en: 'PET Bottle', ar: 'عبوة PET' }, size: ['750 ml', '750 مل'], sup: 'sw5', use: 'other' },
  { id: 'raw-sack', cat: 'raw', type: 'sack', en: 'Ingredient sack (private-branded)', ar: 'شوال خامات باسمك', line: { en: 'Raw Cashews W320', ar: 'كاجو خام W320' }, size: ['25 kg', '25 كجم'], sup: 'sw1', use: 'other' },
  { id: 'raw-timber', cat: 'raw', type: 'timber', wood: 'beech', en: 'Beech boards bundle', ar: 'ربطة ألواح زان', line: { en: 'Beech · Kiln-dried', ar: 'زان · مجفف' }, size: ['1 m³', '1 م³'], sup: 'sw7', use: 'timber' },
  { id: 'raw-fabric', cat: 'raw', type: 'fabric', en: 'Cotton jersey roll', ar: 'رول قماش جيرسيه', line: { en: 'Cotton Jersey', ar: 'جيرسيه قطن' }, size: ['180 GSM', '180 جم/م²'], sup: 'sw8', use: 'other' }
];
const pitem = id => PORTFOLIO.find(p => p.id === id);

/* ---------- shared UI ---------- */
function brandBar(compact) {
  return `<div class="card brand-bar"><div class="grid ${compact ? 'g2' : 'g3'}" style="align-items:end">
    <div class="field"><label for="brand-name">${tx('Your brand name', 'اسم البراند بتاعك')}</label><input id="brand-name" class="input" data-bind="brand.name" value="${esc(S.brand.name)}" placeholder="${tx('e.g. Karma Snacks or كرمة', 'مثال: كرمة أو Karma')}" dir="auto" maxlength="28"></div>
    <div class="field"><label for="brand-tag">${tx('Tagline (optional)', 'شعار قصير (اختياري)')}</label><input id="brand-tag" class="input" data-bind="brand.tagline" value="${esc(S.brand.tagline)}" placeholder="${tx('e.g. Roasted daily', 'مثال: طازة كل يوم')}" dir="auto" maxlength="34"></div>
    ${compact ? '' : `<div class="field"><span class="label">${tx('Brand colour', 'لون البراند')}</span><div class="row" role="radiogroup" aria-label="${tx('Brand colour', 'لون البراند')}">${BRAND_COLORS.map(c => `<button class="swatch-btn" data-act="brandColor" data-c="${c}" aria-pressed="${S.brand.color === c}" title="${c || tx('Style default', 'لون التصميم')}" style="${c ? `background:${c}` : ''}">${c ? '' : ic('refresh')}</button>`).join('')}</div></div>`}</div>
    <div class="row-between" style="margin-top:14px"><div class="row" role="radiogroup" aria-label="${tx('Design style', 'شكل التصميم')}">${STYLES.map(s => `<button class="chip-btn" data-act="brandStyle" data-s="${s.id}" aria-pressed="${S.brand.style === s.id}">${L(s)}</button>`).join('')}</div>
    <button class="btn btn-secondary btn-sm" data-act="newDesigns">${ic('sparkle')} ${tx('Generate new designs', 'اعمل تصميمات جديدة')}</button></div></div>`;
}
function portfolioCard(it) {
  const s = sup(it.sup);
  return `<button class="pf-card" data-act="openItem" data-id="${it.id}" aria-label="${esc(L(it))}"><div class="pf-art" data-live="pf-${it.id}">${mockup(it)}</div>
    <div class="pf-body"><b>${L(it)}</b><span class="faint">${L(s)} · ${tx('MOQ', 'الحد الأدنى')} ${L(s.moq)}</span></div></button>`;
}
const PF_NOTE = () => `<div class="note">${ic('info')}<span>${tx('Concept mockups drawn from your brand name — not supplier photos and not print-ready artwork. Suppliers upload real product photos in production, and final artwork is prepared by a designer before printing.', 'دي تصوّرات مرسومة من اسم البراند بتاعك — مش صور منتجات حقيقية ولا تصميم جاهز للطباعة. في النسخة الفعلية الموردين بيرفعوا صور منتجاتهم، والتصميم النهائي بيجهزه مصمم قبل الطباعة.')}</span></div>`;

function portfolioSection(catId) {
  const items = PORTFOLIO.filter(p => p.cat === catId); if (!items.length) return '';
  return `<section style="margin-top:32px"><div class="row-between" style="margin-bottom:12px"><div><h2>${tx('Portfolio — see it with your brand', 'المعرض — شوفه باسم البراند بتاعك')}</h2><p class="muted small">${tx('Pick a product, try designs, then request a sample or use it in your request.', 'اختار منتج، جرّب التصميمات، وبعدين اطلب عينة أو استخدمه في طلبك.')}</p></div><a class="btn btn-secondary btn-sm" href="#studio">${ic('wand')} ${tx('Open brand studio', 'افتح استوديو البراند')}</a></div>
  ${brandBar(true)}<div class="pf-grid" style="margin-top:16px">${items.map(portfolioCard).join('')}</div><div style="margin-top:12px">${PF_NOTE()}</div></section>`;
}

/* ---------- brand studio page ---------- */
VIEWS.studio = () => {
  const items = PORTFOLIO.filter(p => S.ui.studioCat === 'all' || p.cat === S.ui.studioCat);
  return `<div class="wrap section">${crumbs([[tx('Home', 'الرئيسية'), 'home'], [tx('Brand studio', 'استوديو البراند')]])}
  <div class="row-between"><div><h1>${tx('Brand studio', 'استوديو البراند')}</h1><p class="muted" style="margin-top:6px;max-width:70ch">${tx('Type your brand name once and see it on every product we can source. Switch styles or generate new designs, then request samples.', 'اكتب اسم البراند مرة واحدة وشوفه على كل المنتجات اللي نقدر نوفّرها. غيّر الستايل أو اعمل تصميمات جديدة، وبعدين اطلب عينات.')}</p></div></div>
  <div style="margin-top:18px">${brandBar(false)}</div>
  <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);margin-top:16px" id="logo-row" data-live="logos"></div>
  <div class="row" style="margin:22px 0 12px">${[['all', 'All products', 'كل المنتجات'], ...CATEGORIES.filter(c => PORTFOLIO.some(p => p.cat === c.id)).map(c => [c.id, c.en, c.ar])].map(c => `<button class="chip-btn" data-act="studioCat" data-c="${c[0]}" aria-pressed="${S.ui.studioCat === c[0]}">${isAr() ? c[2] : c[1]}</button>`).join('')}</div>
  <div class="pf-grid">${items.map(portfolioCard).join('')}</div>
  ${S.brand.saved.length ? `<h2 style="margin-top:30px">${tx('Saved designs', 'التصميمات المحفوظة')}</h2><div class="pf-grid" style="margin-top:12px">${S.brand.saved.map((sv, i) => `<div class="pf-card" style="cursor:default"><div class="pf-art">${mockupSaved(sv)}</div><div class="pf-body"><b>${L(pitem(sv.item))}</b><span class="faint">${esc(sv.name)} · ${L(STYLES.find(s => s.id === sv.style))}</span><button class="btn btn-ghost btn-sm" data-act="delSaved" data-i="${i}">${ic('x')} ${tx('Remove', 'حذف')}</button></div></div>`).join('')}</div>` : ''}
  <div style="margin-top:18px">${PF_NOTE()}</div>
  <style>@media (max-width:760px){#logo-row{grid-template-columns:minmax(0,1fr)!important}}</style></div>`;
};
function mockupSaved(sv) { const keep = { ...S.brand }; Object.assign(S.brand, { name: sv.name, tagline: sv.tagline, color: sv.color, seed: sv.seed }); const out = mockup(pitem(sv.item), sv.style); Object.assign(S.brand, keep); return out; }
PARTIALS.logos = () => [0, 1, 2].map(v => `<div class="card" style="padding:12px">${brandLogo(S.brand.style, v)}<p class="faint" style="margin-top:6px">${[tx('Primary logo', 'اللوجو الأساسي'), tx('On brand colour', 'على لون البراند'), tx('On white', 'على أبيض')][v]}</p></div>`).join('');
PORTFOLIO.forEach(it => { PARTIALS['pf-' + it.id] = () => mockup(it); });

/* ---------- studio modal ---------- */
function studioModal() {
  const it = pitem(S.ui.studioItem); const s = sup(it.sup);
  return `<div class="row-between"><div><p class="eyebrow">${L(cat(it.cat))} · ${tx('Concept', 'تصوّر')} ${demoTag()}</p><h2 style="margin-top:4px">${L(it)}</h2></div><button class="icon-btn" data-act="closeModal" aria-label="${tx('Close', 'إغلاق')}">${ic('x')}</button></div>
  <div class="studio-grid"><div class="studio-big" data-live="studioBig">${mockup(it, S.brand.style)}</div>
  <div class="stack"><div class="field"><label for="m-brand">${tx('Brand name', 'اسم البراند')}</label><input id="m-brand" class="input" data-bind="brand.name" value="${esc(S.brand.name)}" dir="auto" maxlength="28" placeholder="${tx('Type your brand', 'اكتب اسم البراند')}"></div>
    <div class="field"><label for="m-tag">${tx('Tagline', 'الشعار')}</label><input id="m-tag" class="input" data-bind="brand.tagline" value="${esc(S.brand.tagline)}" dir="auto" maxlength="34"></div>
    <div><span class="label small"><b>${tx('Designs', 'التصميمات')}</b></span><div class="studio-thumbs" data-live="studioThumbs" style="margin-top:6px"></div>
    <button class="btn btn-ghost btn-sm" data-act="newDesigns" style="margin-top:6px">${ic('sparkle')} ${tx('Generate new designs', 'تصميمات جديدة')}</button></div>
    <dl class="kv small"><dt>${tx('Offered by', 'بيوفّره')}</dt><dd>${L(s)} ${demoTag()}</dd><dt>${tx('MOQ', 'الحد الأدنى')}</dt><dd>${L(s.moq)}</dd><dt>${tx('Lead time', 'مدة التنفيذ')}</dt><dd>${L(s.lead)}</dd></dl>
    <div class="stack" style="gap:8px"><button class="btn btn-primary" data-act="useDesign">${ic('arrow', 'flip')} ${tx('Use this design in my request', 'استخدم التصميم ده في طلبي')}</button>
    <div class="row"><button class="btn btn-secondary grow" data-act="sampleItem">${ic('box')} ${tx('Request a sample', 'اطلب عينة')}</button><button class="btn btn-secondary grow" data-act="saveDesign">${ic('bookmark')} ${tx('Save design', 'احفظ التصميم')}</button></div></div>
    <p class="faint">${tx('The physical sample is the supplier’s existing product. Your brand design stays a concept until artwork is approved and printed.', 'العينة الفعلية من منتج المورد الحالي. تصميم البراند يفضل تصوّر لحد ما التصميم النهائي يتعتمد ويتطبع.')}</p></div></div>`;
}
PARTIALS.studioThumbs = () => { const it = pitem(S.ui.studioItem); if (!it) return ''; return STYLES.map(s => `<button class="thumb" data-act="brandStyle" data-s="${s.id}" aria-pressed="${S.brand.style === s.id}" aria-label="${L(s)}">${mockup(it, s.id)}<span>${L(s)}</span></button>`).join(''); };
PARTIALS.studioBig = () => { const it = pitem(S.ui.studioItem); return it ? mockup(it, S.brand.style) : ''; };

/* ---------- builder side preview ---------- */
function builderItem(p) {
  const s = p.spec;
  if (p.id === 'p-nuts') return { ...pitem(s.pack === 'jar' || s.pack === 'glass' ? 'nuts-jar' : 'nuts-pouch'), line: { en: s.nuts.length > 1 ? 'Mixed Nuts' : optLabel('nuts', s.nuts[0]).replace(/^./, c => c), ar: s.nuts.length > 1 ? 'مكسرات مشكلة' : optLabel('nuts', s.nuts[0]) }, size: [`${s.packG} g`, `${s.packG} جم`] };
  if (p.id === 'p-dish') { const base = pitem('dish'); const sz = OPT.size.find(o => o[0] === s.size); return { ...base, type: s.size === '4000' ? 'gallon' : 'bottle', liquid: s.color || 'green', line: { en: 'Dishwashing Liquid', ar: 'سائل أطباق' }, size: sz ? [sz[1], sz[2]] : base.size }; }
  if (p.id === 'p-table') return s.mode === 'material' ? { ...pitem('raw-timber'), wood: s.materials[0]?.m || 'beech' } : { ...pitem(s.ttype === 'coffee' ? 'coffeetable' : 'dining'), wood: s.wood === 'mdf' ? 'mdf' : s.wood, size: [`${s.L} × ${s.W} ${s.unit}`, `${s.L} × ${s.W} ${s.unit === 'cm' ? 'سم' : 'in'}`] };
  return pitem({ tshirt: 'tshirt', coffee: 'coffee', pouch: 'pk-pouch', shampoo: 'shampoo' }[s.tpl] || 'pk-label');
}
function builderBrandCard(p) {
  return `<div class="card"><h3 class="row">${ic('image')} ${tx('Your product, your brand', 'منتجك باسمك')}</h3>
    <div class="studio-big" style="margin:10px 0" data-live="builderMock"></div>
    <div class="field"><label for="b-brand">${tx('Brand name', 'اسم البراند')}</label><input id="b-brand" class="input" data-bind="brand.name" value="${esc(S.brand.name)}" dir="auto" maxlength="28" placeholder="${tx('Type to preview', 'اكتب عشان تشوف')}"></div>
    <div class="row" style="margin-top:10px">${STYLES.map(s => `<button class="chip-btn sm" data-act="brandStyle" data-s="${s.id}" aria-pressed="${S.brand.style === s.id}">${L(s)}</button>`).join('')}</div>
    <p class="faint" style="margin-top:8px">${tx('Concept preview. Updates with your packaging and size choices.', 'تصوّر مبدئي. بيتغيّر مع اختيارك للعبوة والحجم.')}</p></div>`;
}
PARTIALS.builderMock = () => { const B = BUILDERS[currentRoute()]; return B ? mockup(builderItem(proj(B.pid))) : ''; };

/* ---------- actions ---------- */
ACTIONS.openItem = el => { S.ui.studioItem = el.dataset.id; save(); openModal(studioModal(), true); refreshPartials(); };
ACTIONS.brandStyle = el => { S.brand.style = el.dataset.s; save(); refreshPartials(); document.querySelectorAll('[data-act="brandStyle"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.s === S.brand.style)); };
ACTIONS.brandColor = el => { S.brand.color = el.dataset.c; save(); refreshPartials(); document.querySelectorAll('[data-act="brandColor"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.c === S.brand.color)); };
ACTIONS.newDesigns = () => { S.brand.seed++; save(); refreshPartials(); toast(tx('New colour variations applied to every product.', 'اتعملت ألوان جديدة على كل المنتجات.'), 'sparkle'); };
ACTIONS.studioCat = el => { S.ui.studioCat = el.dataset.c; save(); render(true); };
ACTIONS.saveDesign = () => { const it = pitem(S.ui.studioItem); S.brand.saved.unshift({ item: it.id, style: S.brand.style, name: brandName(), tagline: S.brand.tagline, color: S.brand.color, seed: S.brand.seed }); save(); toast(tx('Design saved to Brand studio.', 'التصميم اتحفظ في استوديو البراند.'), 'bookmark'); };
ACTIONS.delSaved = el => { S.brand.saved.splice(Number(el.dataset.i), 1); save(); render(true); };
ACTIONS.sampleItem = () => { const it = pitem(S.ui.studioItem); const s = sup(it.sup);
  S.sampleBasket.unshift({ item: it.id, sup: it.sup, style: S.brand.style, name: brandName(), at: TODAY });
  notify(`Sample requested: ${it.en} from ${s.en}.`, `اتطلبت عينة: ${it.ar} من ${s.ar}.`, 'box', 'dashboard'); save(); closeModal(); render(true);
  toast(tx(`Sample request sent to ${s.en} (demo). Track it in My projects.`, `طلب العينة اتبعت لـ ${s.ar} (تجريبي). تابعه في مشاريعي.`), 'box'); };
ACTIONS.useDesign = () => {
  const it = pitem(S.ui.studioItem); const u = it.use; let pid = 'p-custom', route = 'builder-custom';
  if (u.startsWith('nuts')) { pid = 'p-nuts'; route = 'builder-nuts'; if (proj(pid).stage === 'draft') proj(pid).spec.pack = u === 'nuts-jar' ? 'jar' : 'standup'; }
  else if (u === 'dish') { pid = 'p-dish'; route = 'builder-dish'; }
  else if (u === 'table' || u === 'timber') { pid = 'p-table'; route = 'builder-table'; if (proj(pid).stage === 'draft') { proj(pid).spec.mode = u === 'timber' ? 'material' : 'finished'; if (it.id === 'coffeetable') proj(pid).spec.ttype = 'coffee'; } }
  else { const p = proj('p-custom'); if (p.stage === 'draft') { if (u.startsWith('tpl-')) p.spec.tpl = u.slice(4); else { p.spec.tpl = 'other'; p.spec.vals.desc = `${L(it)} — ${tx('branded as', 'باسم')} ${brandName()}`; } p.step = 0; } }
  proj(pid).design = { item: it.id, style: S.brand.style, name: brandName(), tagline: S.brand.tagline };
  save(); closeModal(); go(route); toast(tx('Design attached to your request. Suppliers see it as a reference.', 'التصميم اتربط بطلبك. الموردين هيشوفوه كمرجع.'), 'check');
};
