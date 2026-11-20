/* 「읽고 나서」가 세로 화면에서 쪽을 넘는지 재는 판을 만든다.
 *
  *   node _tools/tools-after-fit.mjs [810x1080]   → _tools/_after-fit.html 을 새로 쓴다
 *
 * 만든 판을 브라우저로 열면 책마다 넘친 픽셀이 표에 찍힌다.
 * 책을 한 권씩 넘겨 가며 재면 쪽 넘김 잠금(480ms) 때문에 한없이 걸린다.
 * 그래서 「읽고 나서」 쪽만 똑같은 틀에 그대로 찍어 한자리에서 잰다. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.slice(1)), '..');
const OUT = path.join(ROOT, '_tools', '_after-fit.html');

/* 그 화면에서 책이 갖는 실제 크기.
 *   세로: width = min(900px, 96vw, (100dvh - 46px) * 3/4),  height = width * 4/3
 *   가로: width = min(1300px, 96vw, (100dvh - 46px) * 4/3), height = width * 3/4 */
const [VW, VH] = (process.argv[2] || '810x1080').split('x').map(Number);
const PORTRAIT = VW <= 820 || (VH > VW && VW <= 1100);
const BOOK_W = PORTRAIT
  ? Math.min(900, VW * 0.96, (VH - 46) * 3 / 4)
  : Math.min(1300, VW * 0.96, (VH - 46) * 4 / 3);
const BOOK_H = PORTRAIT ? BOOK_W * 4 / 3 : BOOK_W * 3 / 4;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const books = fs.readdirSync(ROOT)
  .filter(d => !d.startsWith('_') && fs.existsSync(path.join(ROOT, d, 'app.js')))
  .sort();

const cards = [];
for (const b of books) {
  const src = fs.readFileSync(path.join(ROOT, b, 'app.js'), 'utf8');
  const m = src.match(/const AFTERWORD = \{[\s\S]*?\n\};/);
  if (!m) continue;
  let A;
  try { A = eval(m[0] + ';AFTERWORD'); } catch (e) { console.log('  ' + b + ' 읽기 실패: ' + e.message); continue; }
  if (!A || !Array.isArray(A.spreads)) continue;

  A.spreads.forEach((sp, i) => {
    const head = i === 0 ? `<h2>${esc(A.title)}</h2>` : '';
    const art = sp.art
      ? `<div class="after-art"><div class="art-frame"><img src="../${b}/images/${sp.art}" alt=""></div></div>`
      : '';
    const foot = i === A.spreads.length - 1
      ? `<p class="after-home"><a class="home-btn" href="#">학습 허브로 돌아가기</a></p>` : '';
    const col = ps => ps.map(t => `<p>${esc(t)}</p>`).join('');
    cards.push(`<figure class="case" data-book="${b}" data-spread="${i + 1}">
  <figcaption>${b} · 펼침 ${i + 1}/${A.spreads.length}</figcaption>
  <div class="book"><div class="book-spread">
    <div class="page page-after">
      <div class="after-col after-col-left">${head}${col(sp.left)}</div>
      <div class="after-col after-col-right${sp.art ? ' after-col-image' : ''}">${art}${col(sp.right)}${foot}</div>
    </div>
  </div></div>
</figure>`);
  });
}

fs.writeFileSync(OUT, `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>읽고 나서 — 세로 화면 넘침 검사</title>
<link rel="stylesheet" href="../../../../../assets/fonts/google/gowun-batang.css?v=20261120">
<link rel="stylesheet" href="../../../../../assets/fonts/google/noto-serif-kr-400-500-600-700.css?v=20261120">
<link rel="stylesheet" href="../dangun/styles.css">
<style>
  /* 세로 화면(${VW}×${VH})에서 책이 갖는 크기를 그대로 못 박는다.
     화면을 좁히지 않고도 세로 배치를 재려는 것이므로 폭·높이를 직접 준다. */
  body { margin: 0; padding: 12px; background: #ddd; }
  .case { margin: 0 0 18px; }
  .case figcaption { font: 13px/1.4 monospace; margin-bottom: 4px; }
  .book { width: ${BOOK_W}px; height: ${BOOK_H}px; aspect-ratio: auto; container-type: size; position: relative; }
  .book-spread { position: absolute; inset: 0; }
</style>
</head>
<body>
${cards.join('\n')}
<script>
/* 세로 배치 규칙은 (max-width: 820px) 미디어쿼리 안에 있다.
   그러니 이 판은 반드시 810px 폭 창에서 열어야 한다. */
/* app.js 의 fitAfterword 와 같은 판단.
   세로에서는 끝그림이 접혀 있는 것이 기본이고, 켜 보아 자리가 남을 때만 둔다. */
window.fitAll = function () {
  document.querySelectorAll('.page-after').forEach(p => {
    p.classList.add('after-roomy');
    const spills = [...p.querySelectorAll('.after-col')]
      .some(c => c.scrollHeight > c.clientHeight);
    if (spills) p.classList.remove('after-roomy');
  });
};

window.report = function () {
  window.fitAll();
  const rows = [];
  document.querySelectorAll('.case').forEach(c => {
    const over = [...c.querySelectorAll('.after-col')].map(x => x.scrollHeight - x.clientHeight);
    if (over.some(v => v > 0)) rows.push(c.dataset.book + ' #' + c.dataset.spread + ' ' + over.join('/'));
  });
  const roomy = document.querySelectorAll('.page-after.after-roomy').length;
  const cases = document.querySelectorAll('.case').length;
  return { total: cases, 그림살림: roomy, 그림접힘: cases - roomy, bad: rows.length, rows };
};
</script>
</body>
</html>
`);
console.log('만든 판: _tools/_after-fit.html   책 ' + books.length + '권 · 펼침 ' + cards.length + '개');
console.log('세로 책 크기 ' + Math.round(BOOK_W) + '×' + Math.round(BOOK_H) + 'px (화면 ' + VW + '×' + VH + ' 기준)');
