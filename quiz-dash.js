/* ===== Fasting (Sawm) quiz — teacher dashboard ===== */
"use strict";

function renderDash() {
  const attempts = loadAttempts().slice().sort(function (a, b) { return b.ts - a.ts; });

  /* stats */
  const st = $('#dashStats');
  if (!attempts.length) {
    st.innerHTML = '<div class="sbox" style="grid-column:1/-1"><b>—</b><span>No attempts yet. Students appear here after they finish the quiz.</span></div>';
  } else {
    const avg = Math.round(attempts.reduce(function (s, a) { return s + a.pct; }, 0) / attempts.length);
    const best = Math.max.apply(null, attempts.map(function (a) { return a.score; }));
    const b1 = attempts.filter(function (a) { return a.score >= 8; }).length;
    st.innerHTML = '<div class="sbox"><b>' + attempts.length + '</b><span>Attempts</span></div>' +
      '<div class="sbox"><b>' + avg + '%</b><span>Average score</span></div>' +
      '<div class="sbox"><b>' + best + '/10</b><span>Best score</span></div>' +
      '<div class="sbox"><b>' + b1 + '</b><span>Students with 8–10</span></div>';
  }

  /* attempts list */
  const box = $('#dashAttempts'); box.innerHTML = '';
  if (!attempts.length) {
    box.innerHTML = '<p class="hint">No student attempts saved yet in this browser.</p>';
  }
  attempts.forEach(function (a, i) {
    const d = new Date(a.ts);
    const div = document.createElement('div'); div.className = 'attempt';
    let cells = '';
    (a.per || []).forEach(function (p, idx) { cells += '<span class="gq ' + (p.ok ? 'ok' : 'bad') + '">' + (idx + 1) + '</span>'; });
    div.innerHTML = '<div class="ahead"><b>' + esc(a.name) + '</b>' +
      '<span class="hint">' + d.toLocaleString() + '</span>' +
      '<span class="bandchip ' + (a.score >= 8 ? 'b1' : a.score >= 5 ? 'b2' : 'b3') + '" style="font-size:.8rem;padding:4px 12px">' +
      (a.score >= 8 ? 'Strong' : a.score >= 5 ? 'Developing' : 'Guided intro') + '</span>' +
      '<span class="score">' + a.score + '/10 · ' + a.pct + '%</span></div>' +
      '<div class="gridq">' + cells + '</div>' +
      '<div class="btnrow" style="margin-top:6px;justify-content:flex-start">' +
      '<button class="btn ghost" data-exp="' + i + '" style="padding:8px 16px;font-size:.95rem">🔎 Review responses</button>' +
      '<button class="btn ghost" data-del="' + i + '" style="padding:8px 16px;font-size:.95rem">🗑️ Remove</button>' +
      '</div><div class="details hidden"></div>';
    box.appendChild(div);
  });
  box.querySelectorAll('[data-exp]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const card = btn.closest('.attempt');
      const det = card.querySelector('.details');
      const idx = parseInt(btn.getAttribute('data-exp'), 10);
      const att = attempts[idx];
      if (!det.classList.contains('hidden')) { det.classList.add('hidden'); return; }
      det.innerHTML = (att.per || []).map(function (p, n) {
        return '<div class="detrow"><span>' + (p.ok ? '✅' : '❌') + '</span><span>' +
          '<b>Q' + att.per[n].q + ' — ' + esc(att.per[n].topic) + '</b><br>' +
          'Student: ' + esc(p.chosen || '—') + '<br>Correct: ' + esc(p.answer || '—') + '</span></div>';
      }).join('');
      det.classList.remove('hidden');
    });
  });
  box.querySelectorAll('[data-del]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!confirm('Remove this attempt from the saved results on this computer?')) return;
      const list = loadAttempts().slice().sort(function (a, b) { return b.ts - a.ts; });
      list.splice(parseInt(btn.getAttribute('data-del'), 10), 1);
      saveAllAttempts(list); renderDash();
    });
  });

  /* performance by topic */
  const tq = $('#dashTopics'); tq.innerHTML = '';
  if (attempts.length) {
    const stats = {};
    attempts.forEach(function (a) { (a.per || []).forEach(function (p) { const s = stats[p.topic] || (stats[p.topic] = { ok: 0, n: 0 }); s.n++; if (p.ok) s.ok++; }); });
    Object.keys(stats).sort(function (a, b) { return (stats[a].ok / stats[a].n) - (stats[b].ok / stats[b].n); })
      .forEach(function (tname) {
        const s = stats[tname]; const pct = Math.round(s.ok / s.n * 100); const weak = pct < 70;
        const bar = document.createElement('div'); bar.className = 'topicbar' + (weak ? ' weak' : '');
        bar.innerHTML = '<div class="tname"><span>' + (weak ? '⭐ ' : '') + esc(tname) + '</span><span>' + pct + '% (' + s.ok + '/' + s.n + ')</span></div>' +
          '<div class="ttrack"><div class="tfill" style="width:' + pct + '%"></div></div>';
        tq.appendChild(bar);
      });
  } else { tq.innerHTML = '<p class="hint">Data appears once students complete the quiz.</p>'; }

  /* misconceptions */
  const mi = $('#dashMiscon'); mi.innerHTML = '';
  if (attempts.length) {
    const mc = {};
    attempts.forEach(function (a) { (a.per || []).forEach(function (p) { if (!p.ok) { const q = QUESTIONS.find(function (qq) { return qq.id === p.q; }); if (q) mc[q.misconception] = (mc[q.misconception] || 0) + 1; } }); });
    const keys = Object.keys(mc).sort(function (a, b) { return mc[b] - mc[a]; });
    if (!keys.length) mi.innerHTML = '<li>No misconceptions yet — everyone answered correctly 🌟</li>';
    keys.forEach(function (k) { const li = document.createElement('li'); li.textContent = k + ' — seen ' + mc[k] + ' time(s)'; mi.appendChild(li); });
  } else { mi.innerHTML = '<li>Nothing yet.</li>'; }

  /* lesson focus */
  const fo = $('#dashFocus'); fo.innerHTML = '';
  if (attempts.length) {
    const stats = {};
    attempts.forEach(function (a) { (a.per || []).forEach(function (p) { const s = stats[p.topic] || (stats[p.topic] = { ok: 0, n: 0 }); s.n++; if (p.ok) s.ok++; }); });
    const weak = Object.keys(stats).filter(function (t) { return stats[t].ok / stats[t].n < .7; })
      .sort(function (a, b) { return (stats[a].ok / stats[a].n) - (stats[b].ok / stats[b].n); });
    if (!weak.length) fo.innerHTML = '<li>All topics at or above 70% — revise briefly, then extend with the Activities on p. 47.</li>';
    weak.forEach(function (t) {
      const li = document.createElement('li');
      li.textContent = (FOCUS_TIPS[t] ? FOCUS_TIPS[t] : 'Revise: ' + t);
      fo.appendChild(li);
    });
  } else { fo.innerHTML = '<li>Complete the quiz with your class to see suggested focus areas.</li>'; }

  /* answer key */
  const key = $('#dashKey'); key.innerHTML = '';
  QUESTIONS.forEach(function (q) {
    const div = document.createElement('div'); div.className = 'keyitem';
    let ans = '';
    if (q.type === 'mcq') { const o = q.options.find(function (x) { return x.key === q.correct; }); ans = o.key + ' — ' + o.label; }
    else if (q.type === 'tf') ans = q.correct;
    else if (q.type === 'picture') { const o = q.picOptions.find(function (x) { return x.key === q.correct; }); ans = o.key + ' — ' + o.label; }
    else if (q.type === 'dragBins') ans = q.cards.map(function (c) { return '“' + c.label + '” → ' + q.bins.find(function (b) { return b.id === c.bin; }).label; }).join('; ');
    else if (q.type === 'dragTerms') ans = q.boxes.map(function (b) { return b.term + ' → ' + b.meaning; }).join('; ');
    else if (q.type === 'match') ans = q.left.map(function (l) { return l.label + ' ↔ ' + q.right.find(function (r) { return r.id === q.pairs[l.id]; }).label; }).join('; ');
    div.innerHTML = '<b>Q' + q.id + '</b> (' + esc(TYPE_META[q.type]) + ') — ' + esc(stripTags(q.text)) +
      '<br><b>Answer:</b> ' + esc(stripTags(ans)) +
      '<br><span class="hint">' + stripTags(q.explain) + '</span>';
    key.appendChild(div);
  });

  /* recording sheet */
  const tbl = $('#sheetTable');
  let html = '<tr><th>Student name</th>';
  for (let i = 1; i <= 10; i++) html += '<th>Q' + i + '</th>';
  html += '<th>Score /10</th></tr>';
  for (let r = 0; r < 14; r++) { html += '<tr><td></td>'; for (let i = 0; i < 11; i++) html += '<td style="height:22px"></td>'; html += '</tr>'; }
  tbl.innerHTML = html;
}

function stripTags(t) { const d = document.createElement('div'); d.innerHTML = t; return d.textContent || d.innerText || ''; }

/* exports */
function download(fname, content, mime) {
  const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const aEl = document.createElement('a');
  aEl.href = url; aEl.download = fname;
  document.body.appendChild(aEl); aEl.click();
  setTimeout(function () { URL.revokeObjectURL(url); aEl.remove(); }, 400);
}
function exportCsv() {
  const attempts = loadAttempts().slice().sort(function (a, b) { return b.ts - a.ts; });
  if (!attempts.length) { alert('No results to export yet.'); return; }
  let csv = 'Name,Date,Score,Percent,Band,' + QUESTIONS.map(function (q) { return 'Q' + q.id; }).join(',') + '\n';
  attempts.forEach(function (a) {
    const band = a.score >= 8 ? 'Strong (8-10)' : a.score >= 5 ? 'Developing (5-7)' : 'Guided intro (0-4)';
    const row = [a.name, new Date(a.ts).toLocaleString(), a.score, a.pct, band];
    QUESTIONS.forEach(function (q, i) {
      const p = (a.per || []).find(function (x) { return x.q === q.id; });
      row.push(p ? (p.ok ? 1 : 0) : '');
    });
    csv += row.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(',') + '\n';
  });
  download('fasting-quiz-results.csv', csv, 'text/csv;charset=utf-8');
}
function exportJson() {
  const attempts = loadAttempts();
  if (!attempts.length) { alert('No results to export yet.'); return; }
  download('fasting-quiz-results.json', JSON.stringify({ quiz: 'Fasting (Sawm) — Grade 4 pre-lesson diagnostic', exported: new Date().toISOString(), attempts: attempts }, null, 2), 'application/json');
}
function printKeySheet() {
  try {
    const w = window.open('', '_blank');
    if (!w) { throw new Error('popup'); }
    const tblHtml = $('#sheetTable').outerHTML;
    let body = '<h1 style="font-family:Segoe UI,Arial;color:#0e6b4f">Fasting (Sawm) — Grade 4 Pre-Lesson Quiz</h1>' +
      '<h2 style="font-family:Segoe UI,Arial;color:#0e6b4f">Teacher answer key</h2><ol style="font-family:Segoe UI,Arial;font-size:14px;line-height:1.5">';
    QUESTIONS.forEach(function (q) {
      let ans = '';
      if (q.type === 'mcq') { const o = q.options.find(function (x) { return x.key === q.correct; }); ans = o.key + ' — ' + o.label; }
      else if (q.type === 'tf') ans = q.correct;
      else if (q.type === 'picture') { const o = q.picOptions.find(function (x) { return x.key === q.correct; }); ans = o.key + ' — ' + o.label; }
      else if (q.type === 'dragBins') ans = q.cards.map(function (c) { return '“' + c.label + '” → ' + q.bins.find(function (b) { return b.id === c.bin; }).label; }).join('; ');
      else if (q.type === 'dragTerms') ans = q.boxes.map(function (b) { return b.term + ' → ' + b.meaning; }).join('; ');
      else if (q.type === 'match') ans = q.left.map(function (l) { return l.label + ' ↔ ' + q.right.find(function (r) { return r.id === q.pairs[l.id]; }).label; }).join('; ');
      body += '<li><b>' + q.text.replace(/<[^>]*>/g, '') + '</b><br>Answer: ' + ans.replace(/<[^>]*>/g, '') + '</li>';
    });
    body += '</ol><h2 style="font-family:Segoe UI,Arial;color:#0e6b4f">Results-recording sheet</h2>' + tblHtml +
      '<p style="font-family:Segoe UI,Arial;font-size:12px">Topic bands: 8–10 strong prior knowledge · 5–7 developing · 0–4 needs guided introduction.</p>';
    w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Fasting quiz — key &amp; sheet</title></head><body>' + body +
      '<script>print();<\/script></body></html>');
    w.document.close();
  } catch (e) {
    window.print();
  }
}
function clearResults() {
  if (!confirm('Delete ALL saved quiz results from this browser? This cannot be undone.')) return;
  saveAllAttempts([]); renderDash();
}

document.addEventListener('DOMContentLoaded', function () {
  renderDash();
  $('#btnExportCsv').addEventListener('click', exportCsv);
  $('#btnExportJson').addEventListener('click', exportJson);
  $('#btnPrintSheet').addEventListener('click', printKeySheet);
  $('#btnClear').addEventListener('click', clearResults);
});
