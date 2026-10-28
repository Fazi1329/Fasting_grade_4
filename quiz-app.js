/* ===== Fasting (Sawm) quiz — core engine ===== */
"use strict";

/* tiny helpers */
const $ = function (s) { return document.querySelector(s); };
const $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
const STOREKEY = 'grade4FastingQuiz.v1';
function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function loadAttempts() { try { return JSON.parse(localStorage.getItem(STOREKEY)) || []; } catch (e) { return []; } }
function saveAllAttempts(list) { try { localStorage.setItem(STOREKEY, JSON.stringify(list)); } catch (e) { } }
function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
/* find a draggable card by data-id without relying on querySelector
   (term labels contain characters like & that break attribute selectors) */
function ddById(root, id) {
  let found = null;
  root.querySelectorAll('.ddcard').forEach(function (d) { if (!found && d.getAttribute('data-id') === id) found = d; });
  return found;
}

const TYPE_META = {
  mcq: 'Multiple choice — choose the correct answer',
  tf: 'True or False',
  picture: 'Picture selection — choose the correct picture',
  dragBins: 'Drag & drop — sort into baskets',
  dragTerms: 'Drag & drop — match terms with meanings',
  match: 'Match the pairs'
};
const REF_TXT = 'Source: Islamic Studies Grade 4 — Chapter 10, Fasting (Sawm), textbook pp. 45–46.';
const PRAISE = ['Mashaa’Allah — that’s right! 🌟', 'Wonderful! You already know this! 🎉', 'Super work! 💫', 'Excellent thinking! 🌙'];
const CHEER = ['Good try — this is exactly what our lesson will explore 💡', 'Almost! This is what we will learn together 🌱', 'Everyone learns something new every day 🌟', 'Keep going — our lesson will make it clear 💡'];

/* screen switching */
function show(id) { $$('.screen').forEach(function (s) { s.classList.remove('active'); }); $('#' + id).classList.add('active'); window.scrollTo(0, 0); }

/* the quiz state */
const S = { i: 0, results: [], name: 'Star Learner', done: false };
let RUN = null;

function startQuiz() {
  const nm = ($('#studentName').value || '').trim();
  S.name = nm ? nm : 'Star Learner';
  S.i = 0; S.done = false;
  S.results = new Array(QUESTIONS.length).fill(null);
  $('#helloLine').textContent = 'Hello, ' + S.name + '! Do your best — there are no tricks here. 🙂';
  show('screen-quiz');
  renderQ();
}

function updateProgress() {
  const total = QUESTIONS.length;
  $('#progressLabel').textContent = 'Question ' + (S.i + 1) + ' of ' + total;
  $('#progressFill').style.width = ((S.i + 1) / total * 100) + '%';
  const okN = S.results.filter(function (r) { return r && r.ok; }).length;
  $('#scoreLine').textContent = 'Score so far: ' + okN + ' / ' + total;
  const dots = $('#dots'); dots.innerHTML = '';
  for (let d = 0; d < total; d++) {
    const dot = document.createElement('span'); dot.className = 'dot';
    if (d === S.i) dot.classList.add('cur');
    const r = S.results[d];
    if (r) dot.classList.add(r.ok ? 'ok' : 'bad');
    dots.appendChild(dot);
  }
}

/* ---------- per-type question HTML ---------- */
function qHeadHtml(q) {
  return '<div class="qhead"><span class="qnum">Question ' + (q.id) + '</span>' +
    '<span class="qtype">' + esc(TYPE_META[q.type]) + '</span>' +
    '<span class="topicchip">' + esc(q.topic) + '</span></div>';
}
function optBtn(key, label, iconKey) {
  const inner = '<span class="key">' + esc(key) + '</span>' +
    (iconKey && ICONS[iconKey] ? ICONS[iconKey] : '') +
    '<span>' + esc(label) + '</span>';
  return '<button class="opt" data-key="' + esc(key) + '">' + inner + '</button>';
}
function picBtn(o) {
  return '<button class="pic" data-key="' + esc(o.key) + '"><span class="key">' + esc(o.key) + '</span>' +
    o.svg + '<div class="cap">' + esc(o.label) + '</div></button>';
}
function ddCard(c) {
  return '<div class="ddcard" data-id="' + esc(c.id) + '" draggable="true">' +
    (ICONS[c.icon] || '') + '<span>' + esc(c.label) + '</span></div>';
}

function buildQuestion(q) {
  let body = '';
  if (q.type === 'mcq') {
    body = '<div class="opts">' + q.options.map(function (o) { return optBtn(o.key, o.label); }).join('') + '</div>';
  } else if (q.type === 'tf') {
    body = '<div class="opts tf">' + q.options.map(function (o) { return '<button class="opt tfbtn" data-key="' + esc(o.key) + '">' + (ICONS[o.icon] || '') + '<span>' + esc(o.key) + '</span></button>'; }).join('') + '</div>';
  } else if (q.type === 'picture') {
    body = '<div class="pics">' + q.picOptions.map(picBtn).join('') + '</div>';
  } else if (q.type === 'dragBins') {
    const binCards = shuffle(q.cards).map(ddCard).join('');
    body = '<div class="tray" data-drop="tray" title="Cards to sort">' + binCards + '</div>' +
      '<div class="bins">' + q.bins.map(function (b) {
        return '<div class="bin ' + b.id + '" data-bin="' + esc(b.id) + '"><div class="binhead">' + (ICONS[b.icon] || '') + '<span>' + esc(b.label) + '</span></div><div class="cardyard"></div></div>';
      }).join('') + '</div>';
  } else if (q.type === 'dragTerms') {
    const termCards = shuffle(q.boxes.map(function (b) {
      return { id: b.term, label: b.term, icon: b.icon };
    })).map(ddCard).join('');
    body = '<div class="tray" data-drop="tray" title="Term cards">' + termCards + '</div>' +
      '<div class="boxes">' + q.boxes.map(function (b) {
        return '<div class="box" data-box="' + esc(b.id) + '"><div class="meaning">' + (ICONS[b.icon] ? ICONS[b.icon] : '') + ' ' + esc(b.meaning) + '</div><div class="cardyard"></div></div>';
      }).join('') + '</div>';
  } else if (q.type === 'match') {
    const colL = q.left.map(function (n) {
      return '<button class="mitem" data-side="L" data-id="' + esc(n.id) + '">' + (ICONS[n.icon] || '') + '<span>' + esc(n.label) + '</span></button>';
    }).join('');
    const colR = q.right.map(function (n) {
      return '<button class="mitem" data-side="R" data-id="' + esc(n.id) + '"><span>' + esc(n.label) + '</span></button>';
    }).join('');
    body = '<div class="match"><div class="mcol"><div class="mcolhead">Term cards</div>' + colL + '</div>' +
      '<div class="mcol"><div class="mcolhead">Meanings</div>' + colR + '</div></div>';
  }
  let illo = '';
  if (q.illo) illo = '<div class="illo">' + q.illo + '</div>';
  else if (q.iconScene) illo = '<div class="illo" style="gap:18px">' + q.iconScene.map(function (k) { return '<span style="width:70px;display:inline-block">' + (ICONS[k] || '') + '</span>'; }).join('') + '</div>';
  return qHeadHtml(q) + illo +
    '<div class="qtext">' + q.text + '</div>' +
    '<div class="instruct">👉 ' + esc(q.instruct) + '</div>' +
    body;
}

function renderQ() {
  const q = QUESTIONS[S.i];
  RUN = { sel: null, selCard: null, pairs: [] };
  $('#qcard').innerHTML = '<div class="qcard" id="theCard">' + buildQuestion(q) + '</div>' +
    '<div id="fbWrap"></div>';
  $('#btnCheck').disabled = true;
  $('#btnNext').disabled = true;
  $('#btnCheck').textContent = '✅ Check Answer';
  $('#placeHint').textContent = '';
  updateProgress();
  wireQuestion(q);
}

/* ---------- wiring ---------- */
function wireQuestion(q) {
  const card = $('#theCard');
  if (q.type === 'mcq' || q.type === 'tf' || q.type === 'picture') {
    card.querySelectorAll('[data-key]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (RUN.locked) return;
        RUN.sel = btn.getAttribute('data-key');
        card.querySelectorAll('[data-key]').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        $('#btnCheck').disabled = false;
      });
    });
  } else if (q.type === 'dragBins' || q.type === 'dragTerms') {
    const yardSel = '.cardyard';
    card.querySelectorAll('.ddcard').forEach(function (el) {
      el.addEventListener('dragstart', function (ev) {
        ev.dataTransfer.setData('text/plain', el.getAttribute('data-id'));
        el.classList.add('selected');
        if (ev.dataTransfer.setData) { try { ev.dataTransfer.effectAllowed = 'move'; } catch (e2) { } }
      });
      el.addEventListener('dragend', function () { el.classList.remove('selected'); RUN.selCard = null; });
      el.addEventListener('click', function (ev) {
        if (RUN.locked) return;
        ev.stopPropagation();
        if (RUN.selCard === el) { el.classList.remove('selected'); RUN.selCard = null; return; }
        card.querySelectorAll('.ddcard').forEach(function (d) { d.classList.remove('selected'); });
        el.classList.add('selected'); RUN.selCard = el;
      });
    });
    card.querySelectorAll('[data-drop],.bin,.box').forEach(function (zone) {
      zone.addEventListener('dragover', function (ev) { if (RUN.locked) return; ev.preventDefault(); zone.classList.add('dragover'); });
      zone.addEventListener('dragleave', function () { zone.classList.remove('dragover'); });
      zone.addEventListener('drop', function (ev) {
        ev.preventDefault(); zone.classList.remove('dragover');
        if (RUN.locked) return;
        const id = ev.dataTransfer.getData('text/plain');
        const el = ddById(card, id);
        if (el) moveCard(card, zone, el, q);
      });
      zone.addEventListener('click', function () {
        if (RUN.locked) return;
        if (RUN.selCard) { moveCard(card, zone, RUN.selCard, q); RUN.selCard = null; }
      });
    });
  } else if (q.type === 'match') {
    card.querySelectorAll('.mitem').forEach(function (it) {
      it.addEventListener('click', function () {
        if (RUN.locked) return;
        const side = it.getAttribute('data-side'), id = it.getAttribute('data-id');
        const existing = RUN.pairs.find(function (p) { return p.l === id || p.r === id; });
        if (existing) { RUN.pairs = RUN.pairs.filter(function (p) { return p !== existing; }); refreshMatchBadges(card); $('#btnCheck').disabled = true; updateHint(q); return; }
        if (RUN.pending && RUN.pending.el !== it) {
          const other = RUN.pending;
          if (other.side !== side) {
            RUN.pairs = RUN.pairs.filter(function (p) { return p.l !== other.id && p.r !== other.id && p.l !== id && p.r !== id; });
            RUN.pairs.push({ l: other.id, r: id });
            other.el.classList.remove('pending'); RUN.pending = null;
            refreshMatchBadges(card);
            $('#btnCheck').disabled = RUN.pairs.length !== q.left.length;
            updateHint(q);
          } else {
            other.el.classList.remove('pending'); RUN.pending = { side: side, id: id, el: it }; it.classList.add('pending');
          }
        } else if (RUN.pending && RUN.pending.el === it) {
          it.classList.remove('pending'); RUN.pending = null;
        } else {
          RUN.pending = { side: side, id: id, el: it }; it.classList.add('pending');
        }
      });
    });
  }
  updateHint(q);
  refreshMatchBadges(card);
}

function moveCard(card, zone, el, q) {
  if (q.type === 'dragTerms' && !zone.classList.contains('tray')) {
    const yard = zone.querySelector('.cardyard');
    const tucked = zone.querySelector('.ddcard');
    if (tucked && tucked !== el) {
      $('#theCard').querySelector('[data-drop="tray"]').appendChild(tucked);
    }
    yard.appendChild(el);
  } else {
    const yard = zone.classList.contains('tray') ? zone : zone.querySelector('.cardyard');
    yard.appendChild(el);
  }
  el.classList.remove('selected');
  refreshCheckState(q);
  updateHint(q);
}

function refreshCheckState(q) {
  let ready = false;
  const card = $('#theCard');
  if (q.type === 'mcq' || q.type === 'tf' || q.type === 'picture') {
    ready = RUN.sel != null;
  } else if (q.type === 'dragBins' || q.type === 'dragTerms') {
    const tray = card.querySelector('[data-drop="tray"]');
    ready = tray.querySelectorAll('.ddcard').length === 0;
  } else if (q.type === 'match') {
    ready = RUN.pairs.length === q.left.length;
  }
  $('#btnCheck').disabled = !ready;
}

function updateHint(q) {
  const card = $('#theCard');
  if (q.type === 'dragBins' || q.type === 'dragTerms') {
    const tray = card.querySelector('[data-drop="tray"]');
    const left = tray.querySelectorAll('.ddcard').length;
    const total = card.querySelectorAll('.ddcard').length;
    $('#placeHint').textContent = 'Placed ' + (total - left) + ' of ' + total + ' cards.';
  } else if (q.type === 'match') {
    $('#placeHint').textContent = 'Matched ' + RUN.pairs.length + ' of ' + q.left.length + ' pairs.';
  } else {
    $('#placeHint').textContent = '';
  }
}

function refreshMatchBadges(card) {
  const colors = ['#149671', '#e0a02b', '#3f7fbf', '#b85c8f'];
  card.querySelectorAll('.mitem').forEach(function (m) { const b = m.querySelector('.badge'); if (b) b.remove(); });
  RUN.pairs.forEach(function (p, n) {
    const c = colors[n % colors.length];
    const le = card.querySelector('.mitem[data-side="L"][data-id="' + p.l + '"]');
    const re = card.querySelector('.mitem[data-side="R"][data-id="' + p.r + '"]');
    [le, re].forEach(function (el) {
      if (!el) return;
      const b = document.createElement('span'); b.className = 'badge';
      b.style.background = c; b.textContent = String(n + 1); el.appendChild(b);
    });
  });
}

/* label text of the correct answer, for feedback + records */
function correctAnswerText(q) {
  if (q.type === 'mcq') { const o = q.options.find(function (x) { return x.key === q.correct; }); return o ? o.key + ' — ' + o.label : q.correct; }
  if (q.type === 'tf') return q.correct;
  if (q.type === 'picture') { const o = q.picOptions.find(function (x) { return x.key === q.correct; }); return o ? o.key + ' — ' + o.label : q.correct; }
  if (q.type === 'dragBins') return q.cards.map(function (c) { const b = q.bins.find(function (bb) { return bb.id === c.bin; }); return '“' + c.label + '” → ' + (b ? b.label : c.bin); }).join('  ·  ');
  if (q.type === 'dragTerms') return q.boxes.map(function (b) { return b.term + ' → ' + b.meaning; }).join('  ·  ');
  if (q.type === 'match') return q.left.map(function (l) { const r = q.right.find(function (rr) { return rr.id === q.pairs[l.id]; }); return l.label + ' ↔ ' + (r ? r.label : ''); }).join('  ·  ');
  return '';
}
function chosenAnswerText(q) {
  if (q.type === 'mcq') { const o = q.options.find(function (x) { return x.key === RUN.sel; }); return o ? o.key + ' — ' + o.label : ''; }
  if (q.type === 'tf' || q.type === 'picture') {
    if (q.type === 'picture') { const o = q.picOptions.find(function (x) { return x.key === RUN.sel; }); return o ? o.key + ' — ' + o.label : ''; }
    return RUN.sel;
  }
  if (q.type === 'dragBins' || q.type === 'dragTerms' || q.type === 'match') return RUN.lastChosenText || '';
  return '';
}

/* ---------- checking ---------- */
function markLocked(card) {
  card.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
  card.classList.add('lockedPlain');
  document.querySelectorAll('#theCard .ddcard').forEach(function (d) { d.draggable = false; d.style.cursor = 'default'; });
  RUN.locked = true;
}

function doCheck() {
  const q = QUESTIONS[S.i];
  const card = $('#theCard');
  if (!q || $('#btnCheck').disabled) return;
  let ok = false, lines = [], chosen = '';
  if (q.type === 'mcq' || q.type === 'tf' || q.type === 'picture') {
    ok = RUN.sel === q.correct;
    card.querySelectorAll('[data-key]').forEach(function (b) {
      const k = b.getAttribute('data-key');
      if (k === q.correct) b.classList.add('correct');
      else if (k === RUN.sel) b.classList.add('wrongsel');
      else b.classList.add('dim');
    });
    lines.push('<div>✔️ Correct answer: <b>' + esc(correctAnswerText(q)) + '</b></div>');
  } else if (q.type === 'dragBins') {
    let rights = 0; const map = [];
    q.cards.forEach(function (c) {
      const el = card.querySelector('.ddcard[data-id="' + c.id + '"]');
      const bin = el.closest('[data-bin]');
      const good = bin && bin.getAttribute('data-bin') === c.bin;
      if (good) rights++; el.classList.add(good ? 'ok' : 'bad');
      const binEl = bin ? q.bins.find(function (bb) { return bb.id === bin.getAttribute('data-bin'); }) : null;
      map.push('“' + c.label + '” went to "' + (binEl ? binEl.label : 'not placed') + '" — correct basket: "' + (q.bins.find(function (bb) { return bb.id === c.bin; }) || {}).label + '"');
    });
    ok = rights === q.cards.length;
    lines.push('<div>✔️ Correct sort: <b>' + esc(correctAnswerText(q)) + '</b></div>');
    chosen = rights + ' of ' + q.cards.length + ' cards in the right basket';
    RUN.lastChosenText = chosen + ' — ' + map.join(' · ');
  } else if (q.type === 'dragTerms') {
    let rights = 0; const map = [];
    q.boxes.forEach(function (b) {
      const area = card.querySelector('.box[data-box="' + b.id + '"] .cardyard');
      const el = area ? area.querySelector('.ddcard') : null;
      const good = el && el.getAttribute('data-id') === b.term;
      if (good) rights++;
      const c = q.cards && q.cards.find ? q.cards.find(function (cc) { return cc.id === b.term; }) : null;
      if (el) el.classList.add(good ? 'ok' : 'bad');
      map.push((good ? '✔ ' : '✗ ') + (el ? el.textContent.trim() : '(empty)') + ' → "' + b.term + '"');
    });
    ok = rights === q.boxes.length;
    lines.push('<div>✔️ Correct matching: <b>' + esc(correctAnswerText(q)) + '</b></div>');
    chosen = rights + ' of ' + q.boxes.length + ' terms placed correctly';
    RUN.lastChosenText = chosen + ' — ' + map.join(' · ');
  } else if (q.type === 'match') {
    let rights = 0; const map = [];
    q.left.forEach(function (l) {
      const p = RUN.pairs.find(function (pp) { return pp.l === l.id; });
      const good = p && q.pairs[l.id] === p.r;
      if (good) rights++;
      const le = card.querySelector('.mitem[data-side="L"][data-id="' + l.id + '"]');
      const re = p ? card.querySelector('.mitem[data-side="R"][data-id="' + p.r + '"]') : null;
      [le, re].forEach(function (el) { if (el) el.classList.add(good ? 'ok' : 'bad'); });
      const rObj = q.right.find(function (rr) { return rr.id === (good ? q.pairs[l.id] : (p ? p.r : '?')); });
      map.push((good ? '✔ ' : '✗ ') + l.label + ' ↔ "' + (rObj ? rObj.label.slice(0, 60) : '') + '"');
    });
    ok = rights === q.left.length;
    lines.push('<div>✔️ Correct pairs: <b>' + esc(correctAnswerText(q)) + '</b></div>');
    chosen = rights + ' of ' + q.left.length + ' pairs matched correctly';
    RUN.lastChosenText = chosen + ' — ' + map.join(' · ');
  }
  chosen = chosen || chosenAnswerText(q);
  S.results[S.i] = { ok: ok, chosen: chosen, answer: correctAnswerText(q), detail: RUN.lastChosenText || chosen, topic: q.topic };
  markLocked(card);
  const praise = ok ? PRAISE[S.i % PRAISE.length] : CHEER[S.i % CHEER.length];
  $('#fbWrap').innerHTML = '<div class="fb ' + (ok ? 'good' : 'bad') + '">' +
    '<div class="title">' + (ok ? '🎉 ' : '💪 ') + esc(praise) + '</div>' +
    '<div class="lines"><div>Your answer: <b>' + esc(chosen || '—') + '</b></div>' + lines.join('') + '</div>' +
    '<div class="exp">' + q.explain + '</div>' +
    '<div class="ref">' + REF_TXT + '</div></div>';
  $('#btnCheck').disabled = true;
  const nextBtn = $('#btnNext');
  nextBtn.disabled = false;
  nextBtn.textContent = S.i === QUESTIONS.length - 1 ? 'See My Results 🎉' : 'Next Question ➜';
  $('#placeHint').textContent = '';
  updateProgress();
}

function nextQ() {
  if (S.i < QUESTIONS.length - 1) { S.i++; renderQ(); }
  else finishQuiz();
}

/* ---------- results ---------- */
function bandOf(score) {
  if (score >= 8) return { cls: 'b1', label: 'Strong prior knowledge (8–10)' , msg: 'Mashaa’Allah! You already know a lot about fasting. Our lesson will build on what you know.' };
  if (score >= 5) return { cls: 'b2', label: 'Developing prior knowledge (5–7)', msg: 'Good start! You know some things about fasting — our lesson will make the rest clear, step by step.' };
  return { cls: 'b3', label: 'Needs more guided introduction (0–4)', msg: 'Every star begins small! This is what we will learn together in our lesson — do not worry at all.' };
}

function confetti() {
  const colors = ['#e0a02b', '#149671', '#e08b3d', '#f3d98a', '#b85c8f'];
  for (let i = 0; i < 46; i++) {
    const sp = document.createElement('span');
    sp.className = 'confetti';
    const sz = 8 + Math.random() * 10;
    sp.style.left = (Math.random() * 100) + 'vw';
    sp.style.width = sz + 'px';
    sp.style.height = (sz * (Math.random() < .5 ? 1.6 : .7)) + 'px';
    sp.style.background = colors[i % colors.length];
    sp.style.borderRadius = Math.random() < .5 ? '50%' : '2px';
    sp.style.animationDuration = (2.4 + Math.random() * 2.6) + 's';
    sp.style.animationDelay = (Math.random() * .8) + 's';
    document.body.appendChild(sp);
    setTimeout(function () { sp.remove(); }, 6200);
  }
}

function finishQuiz() {
  const score = S.results.filter(function (r) { return r && r.ok; }).length;
  const pct = Math.round(score / QUESTIONS.length * 100);
  const band = bandOf(score);
  const attempt = {
    name: S.name, ts: Date.now(), score: score, pct: pct,
    per: QUESTIONS.map(function (q, idx) {
      const r = S.results[idx] || { ok: false, chosen: '(no answer)', answer: correctAnswerText(q), detail: '' };
      return { q: q.id, ok: r.ok, chosen: r.chosen, answer: r.answer, topic: q.topic };
    })
  };
  const all = loadAttempts(); all.push(attempt); saveAllAttempts(all);

  $('#resHello').textContent = 'Well done, ' + S.name + '! You completed the pre-lesson quiz.';
  $('#scoreBig').textContent = score + '/10';
  $('#pctBig').textContent = pct + '%';
  const ring = $('#ringFg'); ring.style.strokeDashoffset = 452;
  setTimeout(function () { ring.style.strokeDashoffset = String(452 * (1 - score / QUESTIONS.length)); }, 60);
  const chip = $('#bandChip'); chip.className = 'bandchip ' + band.cls; chip.textContent = band.label;
  $('#bandMsg').textContent = band.msg;

  const rl = $('#reviewList'); rl.innerHTML = '';
  QUESTIONS.forEach(function (q, idx) {
    const r = S.results[idx] || { ok: false, chosen: '—', answer: correctAnswerText(q) };
    const row = document.createElement('div');
    row.className = 'rrow ' + (r.ok ? 'good' : 'bad');
    row.innerHTML = '<span class="qn">' + (idx + 1) + '</span>' +
      '<span class="txt">Q' + (idx + 1) + ' — ' + esc(q.topic) +
      (r.ok ? '' : '<div class="sub">Your answer: ' + esc(r.chosen) + ' · Correct: ' + esc(r.answer) + '</div>') +
      '</span><span class="rn ' + (r.ok ? 'good' : 'bad') + '">' + (r.ok ? '✔ Correct' : '✗ Not yet') + '</span>';
    rl.appendChild(row);
  });
  const rv = $('#reviseList'); rv.innerHTML = '';
  const seen = {};
  QUESTIONS.forEach(function (q, idx) {
    const r = S.results[idx];
    if (r && !r.ok && !seen[q.concept]) { seen[q.concept] = 1; const li = document.createElement('li'); li.textContent = q.concept; rv.appendChild(li); }
  });
  if (!rv.hasChildNodes()) { const li = document.createElement('li'); li.textContent = 'Nothing to revise — you knew them all! 🌟'; rv.appendChild(li); }
  show('screen-results');
  if (pct >= 50) confetti();
}

function backToStart() { show('screen-start'); }

/* ---------- start screen decorations ---------- */
(function decorate() {
  function tw(x, y, s, delay) {
    const t = document.createElement('span'); t.className = 'tw';
    t.style.left = x; t.style.top = y;
    t.innerHTML = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24"><path fill="#e0bb62" d="' + STAR + '"/></svg>';
    t.style.animationDelay = delay; $('#sky').appendChild(t);
  }
  [[ '6%', '70%' ], [ '12%', '24%' ], [ '88%', '18%' ], [ '94%', '66%' ], [ '4%', '40%' ], [ '80%', '82%' ]].forEach(function (p, i) {
    tw(p[0], p[1], 14 + (i % 3) * 8, (i * .5) + 's');
  });
  const lant = document.createElement('div');
  lant.className = 'fl'; lant.style.cssText = 'left:2%;top:24px';
  lant.innerHTML = '<svg width="34" height="64" viewBox="0 0 40 74"><path stroke="#e0a02b" stroke-width="1.5" fill="none" d="M20 0v6"/><circle cx="20" cy="8" r="2" fill="#e0a02b"/><path fill="#e0a02b" d="M20 10c-7 0-11 4-11 10 0 7 4 10 5 14h12c1-4 5-7 5-14 0-6-4-10-11-10Z"/><ellipse cx="20" cy="26" rx="6" ry="10" fill="#feefc9"/><rect x="14" y="34" width="12" height="3" rx="1.5" fill="#e0a02b"/><circle cx="20" cy="40" r="2.4" fill="#e0a02b"/><path stroke="#e0a02b" stroke-width="1.4" fill="none" d="M17 42l3 4 3-4"/><path fill="#e0a02b" d="M18 46h4l1.5 4h-7Z"/></svg>';
  $('#sky').appendChild(lant);
  const moon = document.createElement('div');
  moon.className = 'fl'; moon.style.cssText = 'right:3%;top:34px;animation-duration:15s';
  moon.innerHTML = '<svg width="52" height="52" viewBox="0 0 24 24"><path fill="#e0bb62" fill-rule="evenodd" d="' + CR + '"/></svg>';
  $('#sky').appendChild(moon);
  const dm = $('#deco-moon'); if (dm) dm.innerHTML = '<svg width="46" height="46" viewBox="0 0 24 24" style="opacity:.95"><path fill="#e0bb62" fill-rule="evenodd" d="' + CR + '"/></svg>';
  function bannerLantern(id, w, delay) {
    const d = document.getElementById(id); if (!d) return;
    d.innerHTML = '<svg width="' + w + '" height="' + Math.round(w * 1.85) + '" viewBox="0 0 40 74">' +
      '<path stroke="#e0a02b" stroke-width="1.5" fill="none" d="M20 0v6"/><circle cx="20" cy="8" r="2" fill="#e0a02b"/>' +
      '<path fill="#e0a02b" d="M20 10c-7 0-11 4-11 10 0 7 4 10 5 14h12c1-4 5-7 5-14 0-6-4-10-11-10Z"/>' +
      '<ellipse cx="20" cy="26" rx="6" ry="10" fill="#feefc9"/><rect x="14" y="34" width="12" height="3" rx="1.5" fill="#e0a02b"/>' +
      '<circle cx="20" cy="40" r="2.4" fill="#e0a02b"/><path stroke="#e0a02b" stroke-width="1.4" fill="none" d="M17 42l3 4 3-4"/>' +
      '<path fill="#e0a02b" d="M18 46h4l1.5 4h-7Z"/></svg>';
    d.style.animation = 'floaty 9s ease-in-out infinite'; d.style.animationDelay = delay;
  }
  bannerLantern('deco-lant1', 30, '0s');
  bannerLantern('deco-lant2', 20, '1.2s');
})();

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', function () {
  $('#btnStart').addEventListener('click', startQuiz);
  $('#btnCheck').addEventListener('click', doCheck);
  $('#btnNext').addEventListener('click', nextQ);
  $('#btnHome1').addEventListener('click', backToStart);
  $('#btnDash1').addEventListener('click', function () { show('screen-dash'); if (window.renderDash) renderDash(); });
  $('#btnDash2').addEventListener('click', function () { show('screen-dash'); if (window.renderDash) renderDash(); });
  $('#btnBackStart').addEventListener('click', backToStart);
  $('#studentName').addEventListener('keydown', function (e) { if (e.key === 'Enter') startQuiz(); });
});

/* ============ HEADLESS SELF-TEST (?autotest=1) ============ */
/* Runs the whole quiz twice — once all-correct, once mostly-wrong —
   then publishes a machine-readable summary into the DOM for --dump-dom. */
(function autotest() {
  if (!/autotest/.test(location.search + location.pathname)) return;
  document.addEventListener('DOMContentLoaded', function () {
    function runOnce(mode) {
      startQuiz();
      for (let i = 0; i < QUESTIONS.length; i++) {
        const q = QUESTIONS[S.i];
        const card = $('#theCard');
        if (q.type === 'mcq' || q.type === 'tf' || q.type === 'picture') {
          RUN.sel = (mode === 'right') ? q.correct : {
            mcq: 'A', tf: (q.correct === 'True' ? 'False' : 'True'), picture: 'A'
          }[q.type];
          refreshCheckState(q);
        } else if (q.type === 'dragBins') {
          q.cards.forEach(function (c) {
            const el = ddById(card, c.id);
            const binId = (mode === 'right') ? c.bin : 'helps';
            const zone = card.querySelector('.bin[data-bin="' + binId + '"]');
            moveCard(card, zone, el, q);
          });
        } else if (q.type === 'dragTerms') {
          q.boxes.forEach(function (b, bi) {
            let termId;
            if (mode === 'right') termId = b.term;
            else termId = q.boxes[(bi + 1) % q.boxes.length].term; /* circular shift = all wrong */
            const el = ddById(card, termId);
            const zone = card.querySelector('.box[data-box="' + b.id + '"]');
            moveCard(card, zone, el, q);
          });
        } else if (q.type === 'match') {
          q.left.forEach(function (l, li) {
            const rId = (mode === 'right') ? q.pairs[l.id] : q.right[(li + 1) % q.right.length].id;
            RUN.pairs.push({ l: l.id, r: rId });
          });
          refreshMatchBadges(card);
          $('#btnCheck').disabled = RUN.pairs.length !== q.left.length;
        }
        doCheck();
        nextQ();
      }
      return S.results.filter(function (r) { return r && r.ok; }).length;
    }
    const s1 = runOnce('right');
    const s2 = runOnce('wrong');
    renderDash();
    const att = loadAttempts();
    const probe = document.createElement('div');
    probe.id = 'autotest-result';
    probe.setAttribute('data-run1', String(s1));
    probe.setAttribute('data-run2', String(s2));
    probe.setAttribute('data-attempts', String(att.length));
    probe.setAttribute('data-screens', String($$('.screen').length));
    probe.setAttribute('data-ready', 'ok');
    document.body.appendChild(probe);
    document.title = 'AUTOTEST ' + s1 + '/' + s2 + '/' + att.length;
  });
})();
