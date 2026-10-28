/* ===== Fasting (Sawm) — Grade 4 pre-lesson quiz: illustrations + questions =====
   Source: "fasting grade 4.pdf" (Islamic Studies Grade 4, Chapter 10, pp. 45–47) */
"use strict";

const CR = 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM14.5 4.6a7.4 7.4 0 1 0 0 14.8 7.4 7.4 0 0 0 0-14.8Z';
const SHIELD = 'M12 2l8 3v6c0 5.4-3.3 9-8 11-4.7-2-8-5.6-8-11V5Z';
const STAR = 'M12 2l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17l-6 3.3 1.3-6.7-5-4.6 6.8-.8Z';
const SPARK = 'M12 2C13 8 16 11 22 12 16 13 13 16 12 22 11 16 8 13 2 12 8 11 11 8 12 2Z';
const HEART = 'M12 21S3 15.4 3 9.5C3 6.5 5.4 4 8.4 4c1.5 0 2.8.7 3.6 1.9C12.8 4.7 14.1 4 15.6 4 18.6 4 21 6.5 21 9.5 21 15.4 12 21 12 21Z';
const BUBBLE = 'M12 6c-5 0-9 3.4-9 7.6 0 4.2 4 7.6 9 7.6 1 0 2-.1 2.9-.4l4.6 1.8-1-3.4c2.7-1.4 4.5-3.9 4.5-6.6 0-4.2-4-7.6-9-7.6Z';
const RIBBON = 'M12 2l9.5 6.9-3.6 10.1H8.1L4.5 5.9Z';

function svgW(w, h, inner) {
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + '</svg>';
}
function iStar(x, y, s, f) {
  return '<g transform="translate(' + (x - 12 * s) + ' ' + (y - 12 * s) + ') scale(' + s + ')"><path fill="' + f + '" d="' + STAR + '"/></g>';
}
function iSpark(x, y, s, f) {
  return '<g transform="translate(' + (x - 12 * s) + ' ' + (y - 12 * s) + ') scale(' + s + ')"><path fill="' + f + '" d="' + SPARK + '"/></g>';
}
function iCrescent(x, y, s, f) {
  return '<g transform="translate(' + (x - 12 * s) + ' ' + (y - 12 * s) + ') scale(' + s + ')"><path fill="' + f + '" fill-rule="evenodd" d="' + CR + '"/></g>';
}
function iShield(x, y, s, f, inside) {
  let out = '<g transform="translate(' + (x - 12 * s) + ' ' + (y - 12 * s) + ') scale(' + s + ')">' +
    '<path fill="' + f + '" d="' + SHIELD + '"/>';
  if (inside === 'crescent') out += '<path fill="' + f + '" fill-rule="evenodd" transform="translate(0 5) scale(.62)" d="' + CR.replace(/fill="[^"]*"/g, '') + '"/>';
  return out + '</g>';
}
function sunIcon(cx, cy, r, f, rays) {
  let out = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"/>';
  if (rays) {
    for (let i = 0; i < 8; i++) {
      const a = Math.PI * 2 * i / 8;
      out += '<line x1="' + (cx + Math.cos(a) * (r + 4)).toFixed(1) + '" y1="' + (cy + Math.sin(a) * (r + 4)).toFixed(1)
        + '" x2="' + (cx + Math.cos(a) * (r + 10)).toFixed(1) + '" y2="' + (cy + Math.sin(a) * (r + 10)).toFixed(1)
        + '" stroke="' + f + '" stroke-width="2.6" stroke-linecap="round"/>';
    }
  }
  return out;
}
function cloudIcon(cx, cy, s, f) {
  return '<g fill="' + f + '"><circle cx="' + cx + '" cy="' + cy + '" r="' + (8 * s) + '"/>' +
    '<circle cx="' + (cx + 9 * s) + '" cy="' + (cy + 2 * s) + '" r="' + (6 * s) + '"/>' +
    '<circle cx="' + (cx - 9 * s) + '" cy="' + (cy + 2 * s) + '" r="' + (5 * s) + '"/>' +
    '<rect x="' + (cx - 12 * s) + '" y="' + (cy + 1 * s) + '" width="' + (24 * s) + '" height="' + (6 * s) + '" rx="' + (3 * s) + '"/></g>';
}

/* ------------------------- scene SVGs ------------------------- */
const ILL = {};
ILL.cal = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#eef4fb"/>' +
  '<rect x="55" y="24" width="140" height="86" rx="14" fill="#fff" stroke="#e0a02b" stroke-width="3.5"/>' +
  '<path fill="#0e6b4f" d="M69 24h112a14 14 0 0 1 14 14v13H55V38a14 14 0 0 1 14-14Z"/>' +
  '<line x1="86" y1="15" x2="86" y2="30" stroke="#b9821f" stroke-width="4" stroke-linecap="round"/>' +
  '<line x1="164" y1="15" x2="164" y2="30" stroke="#b9821f" stroke-width="4" stroke-linecap="round"/>' +
  iCrescent(88, 74, 2.4, '#e0a02b') + iStar(140, 62, 1.3, '#e0a02b') + iSpark(166, 78, 1, '#c8a24b') + iSpark(146, 98, .9, '#c8a24b') +
  iCrescent(206, 100, .8, '#e6f0ff') +
  (function () { let d = ''; for (let i = 0; i < 5; i++) d += '<circle cx="' + (78 + i * 13) + '" cy="98" r="3.6" fill="#dde7e1"/>'; return d; })() +
  (function () { let d = ''; for (let i = 0; i < 5; i++) d += '<circle cx="' + (170 + i * 13) + '" cy="98" r="3.6" fill="#dde7e1"/>'; return d; })());

ILL.sandbox = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#fdf8ec"/>' +
  '<line x1="125" y1="10" x2="125" y2="30" stroke="#b9821f" stroke-width="3"/>' + iCrescent(125, 24, 1.4, '#e0a02b') +
  '<g stroke="#b9821f" stroke-width="6" stroke-linecap="round">' +
  '<line x1="30" y1="96" x2="216" y2="96"/><line x1="80" y1="96" x2="80" y2="112"/><line x1="146" y1="96" x2="146" y2="112"/></g>' +
  '<circle cx="30" cy="96" r="7" fill="#e0a02b"/><circle cx="216" cy="96" r="7" fill="#e0a02b"/>' +
  '<path d="M110 62c-8-30 34-30 28-3m-28 3h7m40-3h-33" stroke="#8a5f30" stroke-width="5" fill="none" stroke-linecap="round"/>' +
  '<circle cx="124" cy="52" r="13" fill="#8a5f30" stroke="#b9821f" stroke-width="0"/>' +
  '<circle cx="114" cy="46" r="5" fill="#8a5f30"/><circle cx="134" cy="46" r="5" fill="#8a5f30"/>' +
  '<path d="M118 66q9 8 20 0" stroke="#b9821f" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  '<circle cx="119" cy="62" r="1.8" fill="#3b2a16"/><circle cx="129" cy="62" r="1.8" fill="#3b2a16"/>');

ILL.medal = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#fdf8ec"/>' +
  '<path d="M96 20l29 12 29-12v34l-29 12-29-12Z" fill="none" stroke="#c8a24b" stroke-width="2.6" stroke-dasharray="6 5"/>' +
  '<circle cx="125" cy="84" r="30" fill="#e0a02b" stroke="#b9821f" stroke-width="3"/>' +
  '<circle cx="125" cy="84" r="21" fill="none" stroke="#fff" stroke-width="2.4"/>' +
  iCrescent(125, 84, 1.5, '#fff') + iSpark(74, 36, 1.1, '#c8a24b') + iSpark(182, 30, 1, '#c8a24b') + iStar(56, 68, 1, '#c8a24b') +
  iCrescent(206, 96, .9, '#f3e7cf'));

ILL.heartQ = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#fdf8ec"/>' + iStar(210, 30, 1, '#e0bb62') + iSpark(48, 30, 1.1, '#e0bb62') + iSpark(70, 104, .9, '#e0bb62') + iSpark(196, 108, .9, '#e0bb62') +
  '<g transform="translate(50 14) scale(6.2)"><path fill="#e08b9b" d="' + HEART + '"/></g>' +
  iCrescent(113, 55, 1.4, '#fff') +
  '<path d="M186 52c11 0 17 6 17 13" stroke="#c8a24b" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  '<path d="M186 40h17" stroke="#c8a24b" stroke-width="3" stroke-linecap="round"/>' +
  '<text x="210" y="56" font-size="30" font-weight="800" fill="#c8a24b" font-family="Segoe UI,sans-serif">?</text>');

ILL.duaUp = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#10435f"/>' +
  (function () { let s = ''; [30, 74, 118, 165, 213].forEach((x, i) => { s += '<circle cx="' + x + '" cy="' + (20 + (i % 3) * 6) + '" r="2" fill="#e6f0ff" opacity=".8"/>'; }); return s; })() +
  iCrescent(196, 34, 1.7, '#e6f0ff') + iStar(228, 58, .9, '#e6f0ff') + iSpark(26, 40, 1, '#e6f0ff') +
  '<g transform="translate(100 36) scale(4.4)"><path fill="#e0a02b" d="' + HEART + '"/></g>' +
  '<path d="M106 92c30 22 46-36 84-44" stroke="#cfe6db" stroke-width="2.4" fill="none" stroke-dasharray="7 6"/>' +
  '<rect x="98" y="100" width="14" height="26" rx="6" fill="#c9d8c3"/>' +
  '<rect x="138" y="100" width="14" height="26" rx="6" fill="#c9d8c3"/>' +
  '<path d="M112 100v-8m4 0a2.6 2.6 0 0 1 6 0" stroke="#c9d8c3" stroke-width="2" fill="none"/>');

ILL.shieldBig = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#fdf8ec"/>' +
  (function () {
    let s = '';
    for (let i = 0; i < 10; i++) {
      const a = Math.PI * (1.04 + i * .216);
      const x1 = 125 + Math.cos(a) * 48, y1 = 68 + Math.sin(a) * 48;
      const x2 = 125 + Math.cos(a) * 68, y2 = 68 + Math.sin(a) * 68;
      s += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#e6d9ae" stroke-width="3.4" stroke-linecap="round"/>';
    }
    return s;
  })() +
  '<g transform="translate(89 26) scale(3.5)"><path fill="#e0a02b" stroke="#b9821f" stroke-width=".9" d="' + SHIELD + '"/>' +
  '<path fill="#fff" fill-rule="evenodd" transform="translate(-11 -3) scale(.52)" d="' + CR.replace(/^.*?d="/, 'd="').replace(/" fill="[^"]*"/, '') + '"/></g>' +
  iStar(58, 34, 1.1, '#c8a24b') + iStar(196, 32, 1, '#c8a24b') + iSpark(180, 102, 1, '#c8a24b') + iCrescent(206, 108, .8, '#f3e7cf'));

function mouthOpen(cx, cy, s, f, fUnicode) {
  return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')">' +
    '<path d="M-6 0C-3-4 3-4 6 0 3 4-3 4-6 0Z" fill="' + f + '"/>' +
    '<path d="M0 1.4v3" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>' +
    '<g transform="translate(-.6 3.4) scale(.3)"><text y="0" font-size="26" fill="#fff" font-weight="800" font-family="Segoe UI,sans-serif">' + fUnicode + '</text></g></g>';
}
ILL.kidsSchool = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#eaf4fb"/>' +
  sunIcon(38, 30, 11, '#f4b942', true) +
  cloudIcon(206, 28, .85, '#ffffffb3') +
  '<rect x="58" y="42" width="134" height="60" rx="6" fill="#fff" stroke="#c9d8df" stroke-width="2"/>' +
  '<rect x="30" y="102" width="190" height="14" rx="7" fill="#cfc1a2"/>' +
  '<rect x="58" y="42" width="134" height="14" rx="6" fill="#9db8ac"/>' +
  '<rect x="94" y="78" width="20" height="24" rx="3" fill="#8a5f30"/>' +
  '<rect x="122" y="78" width="20" height="24" rx="3" fill="#8a5f30"/>' +
  '<path d="M94 102l6 14 6-14Z" fill="#fff"/>' +
  iCrescent(148, 64, .9, '#e0a02b') + iStar(60, 64, .9, '#9db8ac') + iStar(76, 64, .7, '#9db8ac') + iStar(170, 64, .8, '#9db8ac') +
  mouthOpen(70, 92, 1.7, '#a8382b', 'ا') + mouthOpen(82, 100, 1.15, '#e08b3d', 'ل') +
  mouthOpen(172, 92, 1.55, '#0e6b4f', 'ص') + mouthOpen(160, 100, 1.1, '#149671', 'و') + mouthOpen(185, 102, .95, '#1d9e63', 'م'));

ILL.numBooth = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#fdf8ec"/>' +
  '<line x1="40" y1="104" x2="40" y2="42" stroke="#b9821f" stroke-width="4" stroke-linecap="round"/>' +
  '<path d="M40 42h56l-12 10 12 10H40Z" fill="#0e6b4f"/>' +
  '<g transform="scale(.66)"><text x="128" y="102" font-size="46" font-weight="800" fill="#149671" font-family="Segoe UI,sans-serif">1, 2, 3, …</text></g>' +
  iCrescent(206, 40, 1.5, '#e0a02b') + iSpark(228, 70, 1, '#c8a24b') + iStar(190, 92, .9, '#c8a24b') +
  '<circle cx="206" cy="94" r="15" fill="#fff" stroke="#e0a02b" stroke-width="2.4"/>' +
  '<text x="206" y="100" text-anchor="middle" font-size="18" font-weight="800" fill="#a24f2d" font-family="Segoe UI,sans-serif">?</text>' +
  '<line x1="186" y1="104" x2="186" y2="38" stroke="#b9821f" stroke-width="3.4" stroke-linecap="round"/>');

ILL.plateCup = svgW(110, 92,
  '<rect width="110" height="92" rx="14" fill="#fdf8ec"/>' +
  '<g transform="translate(2 2) scale(2.2)">' +
  '<ellipse cx="14" cy="24" rx="13" ry="5" fill="#fff" stroke="#c8a24b" stroke-width="1"/><ellipse cx="14" cy="24" rx="8" ry="3" fill="none" stroke="#e0bb62"/>' +
  '<rect x="28" y="18" width="7" height="11" rx="2.4" fill="#0e6b4f"/><rect x="29.9" y="20" width="3.2" height="6" rx="1.2" fill="#d2ece前面"/>' +
  '</g>' + '<circle cx="86" cy="70" r="12" fill="#fff" stroke="#d67c5b" stroke-width="2.6"/>' +
  '<line x1="78" y1="78" x2="94" y2="62" stroke="#d67c5b" stroke-width="2.6" stroke-linecap="round"/>');

ILL.upsetKid = svgW(200, 92,
  '<rect width="200" height="92" rx="14" fill="#fdeeee"/>' +
  '<circle cx="46" cy="46" r="21" fill="#a8382b"/><circle cx="38" cy="42" r="3" fill="#fff"/><circle cx="54" cy="42" r="3" fill="#fff"/>' +
  '<path d="M37 57q9-7 18 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
  '<g transform="translate(0 -2)"><path d="M30 24l-7 5 7 4Z" fill="#a8382b"/></g>' +
  '<path d="M78 50q8-8 16 0t16 0" stroke="#c98f7e" stroke-width="2.4" fill="none"/>' +
  '<g transform="translate(94 122) scale(4)"><path fill="#c04b1f" fill-rule="evenodd" d="' + CR + '"/></g>' +
  '<path stroke="#a24f2d" stroke-width="3" fill="none" d="M132 42c6 13 16 18 28 20m-10-24l16 14" opacity=".9"/><circle cx="116" cy="38" r="10" fill="#a8382b"/>'
);

ILL.kindKid = svgW(200, 92,
  '<rect width="200" height="92" rx="14" fill="#eefaf3"/>' +
  '<circle cx="62" cy="46" r="21" fill="#2e8f78"/><circle cx="54" cy="42" r="3" fill="#fff"/><circle cx="70" cy="42" r="3" fill="#fff"/>' +
  '<path d="M53 57q9 7 18 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
  '<g transform="translate(0 -2)"><path d="M46 24l-7 5 7 4Z" fill="#2e8f78"/></g>' +
  '<path d="M94 50q8-8 16 0t16 0" stroke="#8fbfae" stroke-width="2.4" fill="none"/>' +
  '<g transform="translate(118 122) scale(4)"><path fill="#e08b3d" fill-rule="evenodd" d="' + CR + '"/></g>' +
  '<g transform="translate(136 88) scale(2.6)"><path fill="#e08b3d" d="' + HEART + '"/></g>' +
  iSpark(180, 28, 1.1, '#161111'.replace('#161111', '#17a06d')) + iSpark(160, 70, .8, '#17a06d'));

ILL.castle = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#fdf8ec"/>' + iCrescent(200, 30, 1.5, '#e6f0ff') + iStar(228, 46, .9, '#e6f0ff') + iSpark(42, 26, 1, '#e6f0ff') +
  '<g fill="#0b5741">' +
  '<rect x="62" y="36" width="26" height="90" rx="5"/><rect x="112" y="28" width="30" height="98" rx="5"/><rect x="164" y="36" width="26" height="90" rx="5"/></g>' +
  '<rect x="50" y="96" width="152" height="30" rx="6" fill="#0e6b4f"/>' +
  '<g fill="#e0a02b">' +
  '<path d="M69 58a7 7 0 0 1 14 0v10H69Z"/><path d="M121 50a8 8 0 0 1 16 0v12h-16Z"/><path d="M170 58a7 7 0 0 1 14 0v10h-14Z"/></g>' +
  '<path d="M85 116a13 13 0 0 1 26 0Z" fill="#e23c3c"/>' +
  '<line x1="127" y1="28" x2="127" y2="14" stroke="#b9821f" stroke-width="2.4"/><path d="M127 14h14l-5 4 5 4h-14Z" fill="#e23c3c"/>' +
  '<g fill="#e6f0ff" opacity=".55"><rect x="57" y="104" width="6" height="10" rx="3"/><rect x="187" y="104" width="6" height="10" rx="3"/></g>');

ILL.nightLantern = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#0f3550"/>' +
  iCrescent(96, 34, 2.2, '#e6f0ff') + iStar(140, 32, 1, '#e6f0ff') + iSpark(62, 66, .9, '#e6f0ff') + iStar(168, 62, .8, '#e6f0ff') + iSpark(206, 30, 1, '#e6f0ff') + iCrescent(190, 84, .7, '#cfe0f5') +
  '<g transform="translate(126 8) scale(2.4)"><path stroke="#e0a02b" stroke-width="1.4" fill="none" d="M12 0v3.6h.0"/>' +
  '<circle cx="12" cy="4.6" r="1.4" fill="#e0a02b"/><rect x="10.1" y="5.8" width="3.8" height="2.2" rx=".9" fill="#e0a02b"/>' +
  '<rect x="8.6" y="8" width="6.8" height="9" rx="1.8" fill="#e0a02b"/><rect x="10.6" y="9.4" width="2.8" height="6.2" rx="1" fill="#feefc9"/>' +
  '<rect x="9.4" y="17" width="5.2" height="1.7" rx=".8" fill="#e0a02b"/><path fill="#e0a02b" d="M12 19.4l1.6 1.8h-3.2Z"/></g>' +
  '<path d="M28 132V96q34-16 97-6t97-2v44Z" fill="#0a3d30"/>');

function sceneFrame(inner) { return svgW(210, 148, inner); }
ILL.sceneDawn = sceneFrame(
  '<defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe9f7"/><stop offset="1" stop-color="#fdf2d8"/></linearGradient></defs>' +
  '<rect width="210" height="148" rx="12" fill="url(#gA)"/>' +
  sunIcon(52, 116, 20, '#f4b13f', true) +
  '<path d="M148 44q7-7 14 0M168 54q6-6 12 0" stroke="#5a7d92" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
  iSpark(170, 82, .8, '#9db8ac') +
  '<path d="M10 116q42-12 96-4t94 0V140H10Z" fill="#4f9d69"/><path d="M10 132q60-10 200-4v20H10Z" fill="#3f8557"/>');
ILL.sceneNoon = sceneFrame(
  '<rect width="210" height="148" rx="12" fill="#f7ecd2"/>' +
  sunIcon(105, 44, 22, '#f4b13f', true) + cloudIcon(58, 82, .9, '#ffffffc2') + cloudIcon(166, 92, .7, '#ffffffa6') +
  '<path d="M10 118q50-10 100-2t90 2V140H10Z" fill="#5aa06c"/>');
ILL.sceneSunset = sceneFrame(
  '<defs><linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5d9e"/><stop offset=".5" stop-color="#f7b76b"/><stop offset="1" stop-color="#f8d59a"/></linearGradient></defs>' +
  '<rect width="210" height="148" rx="12" fill="url(#gC)"/>' +
  sunIcon(96, 112, 19, '#ed7c34', true) +
  iCrescent(170, 36, 1.1, '#fdf3d8') + iStar(140, 30, .8, '#fdf3d8') + iSpark(58, 40, .8, '#fdf3d8') +
  '<g transform="translate(160 56) scale(2)"><path stroke="#5c3a6e" stroke-width="1.2" fill="none" d="M12 0v3.2h.0"/>' +
  '<circle cx="12" cy="4" r="1.2" fill="#5c3a6e"/><rect x="10.7" y="4.8" width="2.6" height="1.8" rx=".7" fill="#5c3a6e"/>' +
  '<rect x="9.4" y="6.4" width="5.2" height="7.4" rx="1.4" fill="#5c3a6e"/><rect x="10.8" y="7.6" width="2.4" height="5" rx=".8" fill="#feefc9"/>' +
  '<rect x="10" y="13.8" width="4" height="1.4" rx=".7" fill="#5c3a6e"/><path fill="#5c3a6e" d="M12 15.2l1.4 1.6h-2.8Z"/></g>' +
  '<ellipse cx="52" cy="116" rx="17" ry="5.5" fill="#fdf3d8"/><ellipse cx="52" cy="112" rx="8" ry="3.4" fill="#8a4b30"/><circle cx="49" cy="108" r="2.6" fill="#6b3a24"/>' +
  '<rect x="60" y="103" width="6" height="9" rx="2" fill="#0e6b4f"/>' +
  '<path d="M10 118q50-10 100-2t90 2V140H10Z" fill="#5c3a6e"/>');
ILL.sceneAnytime = sceneFrame(
  '<rect width="210" height="148" rx="12" fill="#fdf8ec"/>' +
  '<circle cx="105" cy="62" r="34" fill="#fff" stroke="#0e6b4f" stroke-width="6"/>' +
  '<g stroke="#c8b78d" stroke-width="2.4">' +
  (function () { let s = ''; for (let i = 0; i < 12; i++) { const a = Math.PI * 2 * i / 12; s += '<line x1="' + (105 + Math.cos(a) * 27).toFixed(1) + '" y1="' + (62 + Math.sin(a) * 27).toFixed(1) + '" x2="' + (105 + Math.cos(a) * 31).toFixed(1) + '" y2="' + (62 + Math.sin(a) * 31).toFixed(1) + '" stroke="#c8b78d" stroke-width="2.4"/>'; } return s; })() + '</g>' +
  '<g stroke="#0e6b4f" stroke-width="4" stroke-linecap="round"><line x1="105" y1="62" x2="105" y2="40"/><line x1="105" y1="62" x2="122" y2="76"/></g>' +
  '<circle cx="105" cy="62" r="4" fill="#e0a02b"/>' +
  '<g transform="translate(16 106) scale(1.5)">' + '<ellipse cx="14" cy="24" rx="13" ry="5" fill="#fff" stroke="#c8a24b" stroke-width="1"/><rect x="30" y="18" width="7" height="11" rx="2.4" fill="#0e6b4f"/></g>' +
  '<text x="52" y="122" font-size="20" font-weight="800" fill="#c8a24b" font-family="Segoe UI,sans-serif">?</text>' +
  '<text x="150" y="120" font-size="22" font-weight="800" fill="#c8a24b" font-family="Segoe UI,sans-serif">?</text>' + iSpark(184, 34, 1, '#e0bb62'));

ILL.trayArt = svgW(250, 132, '<rect width="250" height="132" rx="16" fill="#fdf8ec"/>' +
  iStar(36, 30, 1, '#c8a24b') + iStar(196, 26, .9, '#c8a24b') + iSpark(228, 62, .9, '#c8a24b') + iSpark(20, 84, .9, '#c8a24b') +
  iCrescent(125, 40, 1.4, '#e0a02b') +
  '<g stroke="#0e6b4f" stroke-width="3.2" fill="none" stroke-linecap="round"><path d="M74 104h22M74 96h22"/><path d="M156 104h20"/></g>' +
  '<g stroke="#b9821f" stroke-width="5" stroke-linecap="round"><line x1="66" y1="92" x2="66" y2="114"/><line x1="184" y1="92" x2="184" y2="114"/></g>' +
  '<path d="M76 113q23 10 46 0t44 0" stroke="#c8a24b" stroke-width="2.6" fill="none"/>');

ILL.mapPath = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#eaf4fb"/>' +
  '<g stroke="#0e6b4f" stroke-width="3.4" fill="none" stroke-dasharray="7 6">' +
  '<path d="M40 106C60 84 84 58 96 46"/><path d="M40 106C60 96 66 84 74 70"/><path d="M96 116q50-14 88-44"/><path d="M96 116q60 0 106-64"/></g>' +
  '<circle cx="40" cy="106" r="9" fill="#e0a02b"/>' +
  '<g transform="translate(88 38) scale(1.4)"><path fill="#e23c3c" d="M12 2C6 2 2 6 2 11.6 2 17.4 12 22 12 22s10-4.6 10-10.4C22 6 18 2 12 2Z"/><circle cx="12" cy="10.6" r="3" fill="#fff"/></g>' +
  (['74 70', '172 70', '206 52'].map(function (p) { const t = p.split(' '); return '<g stroke="#e23c3c" stroke-width="12" stroke-linecap="round"><line x1="' + (t[0] - 5) + '" y1="' + (t[1] - 5) + '" x2="' + (+t[0] + 5) + '" y2="' + (+t[1] + 5) + '"/><line x1="' + (+t[0] + 5) + '" y1="' + (t[1] - 5) + '" x2="' + (t[0] - 5) + '" y2="' + (+t[1] + 5) + '"/></g>'; }).join('')) +
  iCrescent(226, 22, .9, '#9db8ac') + iSpark(24, 40, .9, '#9db8ac'));

ILL.basketArt = svgW(250, 132,
  '<rect width="250" height="132" rx="16" fill="#fdf8ec"/>' +
  '<path d="M64 70q-18 60 60 56 78-4 58-56" fill="#e0a02b" stroke="#b9821f" stroke-width="5"/>' +
  '<path d="M64 72q61 18 118 0" stroke="#fff" stroke-width="3" fill="none"/>' +
  '<g stroke="#fff" stroke-width="3" fill="none"><path d="M84 76l4 46M104 74l4 50M124 73v52M144 74l-4 50M164 76l-4 46"/></g>' +
  '<path d="M82 70a42 42 0 0 1 80 0" stroke="#b9821f" stroke-width="5" fill="none"/>' +
  iCrescent(160, 30, 1.2, '#e0a02b') + iStar(196, 66, .8, '#c8a24b') + iSpark(96, 88, .8, '#fff') + iSpark(150, 96, .7, '#fff') +
  '<g transform="translate(52 -40) scale(3.6)"><path fill="#e08b3d" d="' + HEART + '"/></g>' + iSpark(116, 76, .8, '#fff'));

/* ---------- small inline icons for cards (24×24) ---------- */
function ic(inner) { return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + '</svg>'; }
function crIc(f) { return '<g transform="scale(1)"><path fill="' + f + '" fill-rule="evenodd" d="' + CR + '"/></g>'; }
const ICONS = {
  crescent: ic('<path fill="#e0a02b" fill-rule="evenodd" d="' + CR + '"/>'),
  shield: ic('<path fill="#e0a02b" stroke="#b9821f" stroke-width=".6" d="' + SHIELD + '"/><path fill="#fff" fill-rule="evenodd" transform="translate(4 5) scale(.66)" d="' + CR + '"/>'),
  noPlate: ic('<rect x="1.5" y="2" width="21" height="21" rx="3" stroke="#dcd3b6" fill="none"/>' +
    '<ellipse cx="10" cy="17" rx="5.4" ry="2.2" fill="#fff" stroke="#c8a24b"/><rect x="17" y="14.6" width="3" height="4.6" rx="1.2" fill="#0e6b4f"/>' +
    '<path stroke="#c04b1f" stroke-width="1.9" fill="none" stroke-linecap="round" d="M4.5 4.5l15 15"/>'),
  eed: ic('<path d="M9 15.2c-4.6-4-9-1.4-6.4 2.4l1.2 1.8" fill="none"/>' +
    '<g transform="translate(1.5 1) scale(.92)"><path fill="#0e6b4f" d="M9 15.2C4.5 11 .6 13.8 3 17.6c.6 1 1.8 1.9 3.4 2.4l9-3.6c-1.8-2.6-4-3.4-6.4-1.2Z"/>' +
    '<rect x="12.8" y="15.4" width="7" height="5.6" rx="1.4" fill="#e0a02b"/><path fill="#e0a02b" d="M13.6 18.2h6.4"/><path fill="#fff" d="M16.1 15.4v5.6"/></g>' +
    '<rect x="9" y="4.6" width="2" height="3.6" ry="1" fill="#b9821f"/>' +
    '<path d="M10 8.6l8.3-.2c1.7-1.3 1-6-2.3-6.2-2.3-.2-3.4 2.3-3.3 3.4.2-1.2-.8-3.7-3.2-3.5-3.4.2-4 5-1.8 6.3" fill="#e23c3c" stroke="#a83c3c" stroke-width=".8"/>'),
  calCheck: ic('<rect x="2.8" y="4.5" width="18.4" height="16" rx="3" fill="#fff" stroke="#c8a24b" stroke-width="1.7"/>' +
    '<rect x="2.8" y="4.5" width="18.4" height="4.6" rx="2.3" fill="#e0a02b"/>' +
    '<path stroke="#b9821f" stroke-width="1.8" stroke-linecap="round" d="M7 2.8v3M17 2.8v3"/>' +
    '<path stroke="#158f5e" stroke-width="2" fill="none" d="M7 13.6l1.6 1.7 3.2-3.6M12.8 13.6l1.6 1.7 3.2-3.6"/>'),
  calHeart: ic('<rect x="2.8" y="4.5" width="18.4" height="16" rx="3" fill="#fff" stroke="#c8a24b" stroke-width="1.7"/>' +
    '<rect x="2.8" y="4.5" width="18.4" height="4.6" rx="2.3" fill="#e0a02b"/>' +
    '<path stroke="#b9821f" stroke-width="1.8" stroke-linecap="round" d="M7 2.8v3M17 2.8v3"/>' +
    '<g transform="translate(6.6 11.2) scale(.48)"><path fill="#d67c5b" d="' + HEART + '"/></g><path stroke="#9db8ac" stroke-width="1.8" fill="none" d="M13.6 15.4h5.4M13.6 18.2h5.4"/>'),
  calBack: ic('<rect x="2.8" y="4.5" width="18.4" height="16" rx="3" fill="#fff" stroke="#c8a24b" stroke-width="1.7"/>' +
    '<rect x="2.8" y="4.5" width="18.4" height="4.6" rx="2.3" fill="#e0a02b"/>' +
    '<path stroke="#b9821f" stroke-width="1.8" stroke-linecap="round" d="M7 2.8v3M17 2.8v3"/>' +
    '<g transform="translate(5.8 11.4) scale(.9)"><path fill="#0e6b4f" fill-rule="evenodd" d="' + CR + '"/></g>' +
    '<path stroke="#3f7fbf" stroke-width="1.7" fill="none" d="M19.4 12.4l1.6-1.6M19.4 12.4v-2.6M19.4 12.4h-2.6"/>'),
  balloon: ic('<path d="M11.6 14.4l-.6 1.8h3.4l-.6-1.8" fill="#b9821f"/>' +
    '<path d="M12 16.2q-2.6 1.8 0 4t0 3.6" fill="none" stroke="#b9821f" stroke-width="1.2"/>' +
    '<ellipse cx="12" cy="8.4" rx="5.6" ry="6.8" fill="#158f5e"/><ellipse cx="10" cy="6" rx="1.6" ry="2.4" fill="#ffffff9c"/>'),
  lie: ic('<path d="M4 12q8-7 16 0q-8 7-16 0Z" fill="#d67c5b"/><path d="M12 12.4v2.8m0 0L10.6 17M12 15.2l1.4 1.8M8.6 12.2l1 2.6M15.4 12.2l-1 2.6" stroke="#fff" stroke-width="1" fill="none" stroke-linecap="round"/>'),
  backbite: ic('<g fill="#a24f2d"><circle cx="5.6" cy="10" r="4.6"/><circle cx="18" cy="10" r="4.6"/>' +
    '<path d="M1 22c0-3 2-5.4 4.6-5.4S10.2 19 10.2 22Z"/><path d="M13.4 22c0-3 2-5.4 4.6-5.4S22.8 19 22.8 22Z"/></g>' +
    '<path d="M10.6 8.2q1.5-1.1 2.8-.4M10.6 10.6q1.6-.3 3 .3" stroke="#a24f2d" stroke-width="1" fill="none" stroke-linecap="round"/>'),
  quarrel: ic('<path d="M1.8 4.6h7.8a2 2 0 0 1 2 2v3.8a2 2 0 0 1-2 2H8l-2.6 3.4-.2-3.4h-3.4a2 2 0 0 1-2-2Z" fill="#c8a24b" stroke="none" transform="translate(1 .6)"/>' +
    '<path d="M13.4 8.6h7.8a2 2 0 0 1 2 2v3.8a2 2 0 0 1-2 2h-1.4l-.2 3.4-2.6-3.4h-3.6a2 2 0 0 1-2-2Z" fill="#d67c5b"/>' +
    '<path d="M16.4 7.4l-2 2.6h1.8L14.6 13" stroke="#e0a22b" stroke-width="1.5" fill="none" stroke-linecap="round" transform="translate(2.4 -1.4)"/>'),
  foul: ic('<path d="M12 3l1.8 2.4 2.9-.7.6 3 2.7 1.2-1.2 2.7 1.8 2.4-1.8 2.4L19 19.6l-2.7 1.2-.6 3-2.9-.7L12 25.4" fill="none"/>' +
    '<path d="M12 2.6l1.7 2.2 2.8-.5.5 2.9 2.6 1-1.1 2.7 1.9 2.1-1.9 2.1 1.1 2.7-2.6 1-.5 2.9-2.8-.5L12 21.4l-1.7 2.2-2.8-.5-.5-2.9-2.6-1 1.1-2.7L3.6 14.3 5.5 12.2 4.4 9.5l2.6-1 .5-2.9 2.8.5Z" fill="#a24f2d"/>' +
    '<path d="M8.4 10.2l1.8 1.8-1.8 1.8M15.6 10.2L13.8 12l1.8 1.8" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M12 8v8" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>'),
  shieldSay: ic('<path fill="#158f5e" d="' + SHIELD + '"/>' +
    '<path fill="none" stroke="#fff" stroke-width="1.2" d="M7.4 10h9.2M7.4 13.2h9.2" stroke-linecap="round"/><circle cx="10" cy="8" r=".9" fill="#fff"/><circle cx="14" cy="8" r=".9" fill="#fff"/>' +
    '<path d="M9.4 16.2q2.6 1.6 5.2 0" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/>'),
  thought: ic('<circle cx="10.6" cy="9.4" r="6.6" fill="#0e6b4f"/><path d="M10.6 5l1.2 2.2 2.3.3-1.7 1.6.4 2.4-2.2-1.1-2.2 1.1.4-2.4L7.1 7.5l2.3-.3Z" fill="#fff"/>' +
    '<path d="M16.6 13.2l1.2.2.2 1.8 2.4 1.4-2.2 2.4-3-1.8-.2-2.6Z" fill="#0e6b4f"/>'),
  helpBin: ic('<path fill="#158f5e" d="' + SHIELD + '"/><path fill="#fff" fill-rule="evenodd" transform="translate(4 5) scale(.66)" d="' + CR + '"/>'),
  lowerBin: ic('<path fill="#b9bdc4" d="' + SHIELD + '"/><path stroke="#8a4b30" stroke-width="1.6" fill="none" d="M12 4l-1 3 2 2.6-2 3 1.5 3.4"/>'),
  suitcase: ic('<path d="M9 4.8a3 3 0 0 1 6 0v2.4" fill="none" stroke="#8a5f30" stroke-width="2"/>' +
    '<rect x="3.4" y="7.2" width="17.2" height="13" rx="3" fill="#b9814a"/>' +
    '<rect x="8.8" y="7.2" width="2.6" height="13" fill="#8a5f30"/><rect x="12.6" y="7.2" width="2.6" height="13" fill="#8a5f30"/>'),
  medkit: ic('<rect x="4" y="6" width="16" height="13.4" rx="3" fill="#e25555"/>' +
    '<path d="M9 6V4.6a3 3 0 0 1 6 0V6" fill="none" stroke="#a83c3c" stroke-width="2"/>' +
    '<rect x="10.4" y="9.4" width="3.2" height="8" rx="1" fill="#fff"/><rect x="8" y="11.8" width="8" height="3.2" rx="1" fill="#fff"/>'),
  heartMini: ic('<path fill="#e08b3d" d="' + HEART + '"/>')
};

/* helper: sun used by scenes is sunIcon(); maps below keep refs tidy */
const EX_BAD_IDS = [];

/* ------------------------- questions ------------------------- */
/* Every question references an illustration (ILL.x) and card icons (ICONS.x). */
const QUESTIONS = [
  {
    id: 1, type: 'mcq', topic: 'Ramadan in the Islamic calendar',
    concept: 'Ramadan is the ninth month of the Islamic calendar.',
    misconception: 'Confuses where Ramadan falls in the Islamic calendar',
    instruct: 'Choose ONE answer, then press “Check Answer”.',
    text: 'Ramadan is a very special month for Muslims. Which month of the Islamic calendar is Ramadan?',
    illo: ILL.cal,
    options: [
      { key: 'A', label: 'The first month' },
      { key: 'B', label: 'The sixth month' },
      { key: 'C', label: 'The ninth month' },
      { key: 'D', label: 'The twelfth month' }
    ],
    correct: 'C',
    explain: 'Ramadan is the <b>ninth month</b> of the Islamic calendar. During Ramadan, Muslims fast from dawn to sunset. <i>(Textbook p. 45)</i>'
  },
  {
    id: 2, type: 'tf', topic: 'What fasting means',
    concept: 'A fast lasts from dawn to sunset, not all day and night.',
    misconception: 'Thinks the fast covers the whole day and night',
    instruct: 'Read the statement. Choose True or False, then press “Check Answer”.',
    text: '“During Ramadan, Muslims fast all day and all night.”',
    illo: ILL.sandbox,
    options: [{ key: 'True' }, { key: 'False' }],
    correct: 'False',
    explain: 'During Ramadan, Muslims fast from <b>dawn to sunset</b> — the night is not part of the fast. <i>(Textbook p. 45)</i>'
  },
  {
    id: 3, type: 'mcq', topic: 'Intention (niyyah) for fasting',
    concept: 'Fasting begins with an intention made in the heart, not said loudly.',
    misconception: 'Believes the intention to fast should be spoken out loudly',
    instruct: 'Choose ONE answer, then press “Check Answer”.',
    text: 'Every fast begins with an intention (a clear wish in the heart). How should a Muslim make this intention?',
    illo: ILL.heartQ,
    options: [
      { key: 'A', label: 'By shouting it loudly so everyone hears' },
      { key: 'B', label: 'Clearly, in the heart — not said loudly' },
      { key: 'C', label: 'By telling friends so they remind you later' },
      { key: 'D', label: 'An intention is not needed when fasting' }
    ],
    correct: 'B',
    explain: 'The fast should begin with the <b>intention</b> of fasting — whether it is the compulsory fast of Ramadan, a voluntary fast, or a fast for a special reason. This intention should <b>not be expressed loudly</b>. <i>(Textbook p. 45)</i>'
  },
  {
    id: 4, type: 'mcq', topic: 'Why Muslims fast',
    concept: 'Muslims fast to seek nearness to Allah and His Pleasure.',
    misconception: 'Does not yet link fasting with seeking nearness to Allah',
    instruct: 'Choose ONE answer, then press “Check Answer”.',
    text: 'Why do Muslims fast?',
    illo: ILL.duaUp,
    options: [
      { key: 'A', label: 'To get strong for sports' },
      { key: 'B', label: 'Because it is like a fun diet' },
      { key: 'C', label: 'To seek nearness to Allah and His Pleasure' },
      { key: 'D', label: 'Because my friends are fasting too' }
    ],
    correct: 'C',
    explain: 'Muslims fast to <b>seek nearness to Allah and His Pleasure</b>. They fast because Allah wants them to do so. <i>(Textbook p. 45)</i>'
  },
  {
    id: 5, type: 'dragBins', topic: 'Behaviour while fasting',
    concept: 'Fasting includes good behaviour — avoiding lying, backbiting, quarrelling and foul talk.',
    misconception: 'Mixes up actions that strengthen the fast with those that lower its value',
    instruct: 'Drag each card into the correct basket — or tap a card first, then tap a basket.',
    text: 'The Prophet ﷺ said: “Fasting is a shield.” <i>(Al-Bukharee and Muslim)</i> Which actions help a fasting person, and which lower the value of the fast?',
    illo: ILL.medal,
    bins: [
      { id: 'helps', label: 'Helps my fasting', icon: 'helpBin' },
      { id: 'lowers', label: 'Lowers the value of my fasting', icon: 'lowerBin' }
    ],
    cards: [
      { id: 'ca', label: 'Telling lies', icon: 'lie', bin: 'lowers' },
      { id: 'cb', label: 'Backbiting', icon: 'backbite', bin: 'lowers' },
      { id: 'cc', label: 'Quarrelling', icon: 'quarrel', bin: 'lowers' },
      { id: 'cd', label: 'Using foul or foolish talk', icon: 'foul', bin: 'lowers' },
      { id: 'ce', label: 'Saying “I am fasting” when someone insults me', icon: 'shieldSay', bin: 'helps' },
      { id: 'cf', label: 'Keeping my head clean of useless thoughts', icon: 'thought', bin: 'helps' }
    ],
    explain: 'Allah’s Messenger ﷺ said: “Fasting is a shield, so when one of you fasts he should not use foul or foolish talk. If someone attacks him or insults him, let him say, ‘I am fasting, I am fasting.’” <i>(Al-Bukharee and Muslim)</i> Lying and backbiting lower the value of fasting, and a Muslim should avoid all shameful acts such as quarrelling, backbiting and telling lies. <i>(Textbook pp. 45–46)</i>'
  },
  {
    id: 6, type: 'picture', topic: 'The time of breaking the fast',
    concept: 'A fasting person may eat and drink again only after sunset.',
    misconception: 'Confuses dawn, noon and sunset — the times a fast begins and ends',
    instruct: 'Choose ONE picture, then press “Check Answer”.',
    text: 'A fasting person may not eat or drink while the fast is on. Choose the picture that shows when a fasting person may eat and drink again.',
    picOptions: [
      { key: 'A', svg: ILL.sceneDawn, label: 'The sun is rising (dawn)' },
      { key: 'B', svg: ILL.sceneNoon, label: 'The middle of the day (noon)' },
      { key: 'C', svg: ILL.sceneSunset, label: 'The sun is going down (sunset)' },
      { key: 'D', svg: ILL.sceneAnytime, label: 'Any time I feel like it!' }
    ],
    correct: 'C',
    explain: 'Fasting means to stay away from eating and drinking <b>from dawn until sunset</b> — so a fasting person eats and drinks again at <b>sunset</b>. <i>(Textbook p. 45)</i>'
  },
  {
    id: 7, type: 'dragTerms', topic: 'Islamic terms',
    concept: 'The meanings of Sawm, Ramadan, “a shield”, and the days of Eed.',
    misconception: 'Mixes up Islamic terms with their meanings',
    instruct: 'Drag each golden word card onto the box that matches its meaning — or tap a card first, then tap a box.',
    text: 'Match each Islamic term to the box with its meaning.',
    illo: ILL.trayArt,
    boxes: [
      { id: 'm1', meaning: 'Fasting — staying away from eating and drinking from dawn until sunset', term: 'Sawm', icon: 'noPlate' },
      { id: 'm2', meaning: 'The ninth month of the Islamic calendar', term: 'Ramadan', icon: 'crescent' },
      { id: 'm3', meaning: 'What the Prophet ﷺ said fasting is like, in the hadith', term: 'A shield', icon: 'shield' },
      { id: 'm4', meaning: 'Days when fasting is not allowed', term: 'Eed-ul-Fitr & Eed-ul-Adh-haa', icon: 'eed' }
    ],
    explain: '<b>Sawm</b> is fasting. <b>Ramadan</b> is the ninth month of the Islamic calendar. Fasting is <b>“a shield”</b> <i>(Al-Bukharee and Muslim)</i>, and fasting is not allowed on the days of <b>Eed-ul-Fitr and Eed-ul-Adh-haa</b>. <i>(Textbook pp. 45–46)</i>'
  },
  {
    id: 8, type: 'match', topic: 'Kinds of fasting',
    concept: 'The two kinds of fasting (compulsory & voluntary) and making up missed fasts.',
    misconception: 'Confuses compulsory and voluntary fasting, the days of Eed and making up missed fasts',
    instruct: 'Click one card on the left, then its partner on the right. Match all four pairs, then press “Check Answer”.',
    text: 'Match the pairs about the kinds of fasting.',
    illo: ILL.mapPath,
    left: [
      { id: 'L1', label: 'Compulsory fasting', icon: 'calCheck' },
      { id: 'L2', label: 'Voluntary fasting', icon: 'calHeart' },
      { id: 'L3', label: 'Days of Eed-ul-Fitr & Eed-ul-Adh-haa', icon: 'balloon' },
      { id: 'L4', label: 'Missed fasts (sick or travelling)', icon: 'calBack' }
    ],
    right: [
      { id: 'R4', label: 'Fasts kept on other days after Ramadan, to make up for the days missed', icon: '' },
      { id: 'R2', label: 'Extra fasting recommended on other days of the year', icon: '' },
      { id: 'R3', label: 'Days when fasting is not allowed', icon: '' },
      { id: 'R1', label: 'The fast of Ramadan, compulsory for all adult Muslims', icon: '' }
    ],
    pairs: { L1: 'R1', L2: 'R2', L3: 'R3', L4: 'R4' },
    explain: 'Generally, fasting is of <b>two kinds</b>: <b>compulsory fasting</b> (all adult Muslims, throughout Ramadan) and <b>voluntary fasting</b> (recommended on other days of the year). The <b>sick</b> and the <b>traveller</b> may break the fast, and later fast an equal number of missed days. Fasting is <b>not allowed</b> on the days of Eed-ul-Fitr and Eed-ul-Adh-haa. <i>(Textbook p. 46)</i>'
  },
  {
    id: 9, type: 'tf', topic: 'Breaking the fast for a valid reason',
    concept: 'The sick and the traveller may break the fast and make the days up later.',
    misconception: 'Does not know the sick and the traveller may break the fast and make it up later',
    instruct: 'Read the statement. Choose True or False, then press “Check Answer”.',
    text: '“A sick person or a traveller may break the fast, and should later fast an equal number of missed days after Ramadan.”',
    illo: null,
    iconScene: ['suitcase', 'medkit', 'crescent'],
    options: [{ key: 'True' }, { key: 'False' }],
    correct: 'True',
    explain: 'Those allowed to break their fast because of a valid reason include the <b>sick</b> and the <b>traveller</b>. They should fast an <b>equal number of missed fasts</b> on other days after Ramadan, when they are able to do so. <i>(Textbook p. 46)</i>'
  },
  {
    id: 10, type: 'mcq', topic: 'The hadith “nothing from the fast but hunger”',
    concept: 'A fast loses its value with bad deeds — avoid lying, backbiting and quarrelling.',
    misconception: 'Has not heard the hadith about getting “nothing from the fast but hunger”',
    instruct: 'Choose ONE answer, then press “Check Answer”.',
    text: 'The Prophet ﷺ said: “Many are those who fast but get nothing from their fast but ___.” <i>(Ibn Majah)</i>',
    illo: ILL.shieldBig,
    options: [
      { key: 'A', label: 'rewards' },
      { key: 'B', label: 'hunger' },
      { key: 'C', label: 'thirst' },
      { key: 'D', label: 'sleep' }
    ],
    correct: 'B',
    explain: 'This has been taken to mean those who break their fast with <b>unlawful food</b>, or those who fast but <b>do not keep away from backbiting, lying and other evil acts</b>. So a Muslim avoids all shameful acts, such as quarrelling, backbiting and telling lies. <i>(Textbook p. 46)</i>'
  }
];

/* topic → suggestion for the lesson focus list (dashboard) */
const FOCUS_TIPS = {
  'Ramadan in the Islamic calendar': 'Start the lesson by revising the Islamic (Hijri) calendar and the place of Ramadan as its ninth month (p. 45).',
  'What fasting means': 'Re-teach the definition of fasting from the book: staying away from eating and drinking from dawn until sunset (p. 45).',
  'Intention (niyyah) for fasting': 'Discuss the intention for fasting: compulsory, voluntary or for a special reason — kept in the heart, not said loudly (p. 45).',
  'Why Muslims fast': 'Talk about the purpose of fasting: seeking nearness to Allah and His Pleasure, and keeping the organs free from sins (p. 45).',
  'Behaviour while fasting': 'Read the hadith “Fasting is a shield…” together and practise polite responses when someone insults a fasting person (pp. 45–46).',
  'The time of breaking the fast': 'Use a sun-position diagram to fix the times: fast begins at dawn, breaks at sunset (p. 45).',
  'Islamic terms': 'Build a word wall: Sawm, Ramadan, shield, Eed-ul-Fitr, Eed-ul-Adh-haa (pp. 45–46).',
  'Kinds of fasting': 'Sort examples into compulsory and voluntary fasting, and where making up missed fasts belongs (p. 46).',
  'Breaking the fast for a valid reason': 'Discuss valid reasons to break the fast (sickness, travel) and making up missed days later (p. 46).',
  'The hadith “nothing from the fast but hunger”': 'Explore the hadith of Ibn Majah and what it means to lose the reward of the fast (p. 46).'
};
