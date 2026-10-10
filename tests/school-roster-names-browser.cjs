const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const output = path.resolve(__dirname, '../outputs/school-roster-row-spacing-2026-10-07');
const baseline = process.argv.includes('--baseline');
const html = baseline
  ? execFileSync('git', ['show', 'HEAD:classtools/school-roster.html'], { cwd: path.resolve(__dirname, '..') })
  : fs.readFileSync(path.resolve(__dirname, '../apps/classtools/school-roster.html'));
const teachers = [
  { name: '가상관리자', type: '관리자', nameSource: '', nameMismatch: true, googleName: '관리용 계정' },
  { name: '홍길동', type: '담임', nameSource: '', nameMismatch: false },
  { name: '가나다', type: '담임', nameSource: 'google', nameMismatch: false },
  { name: '남궁가나다라', type: '담임', nameSource: '', nameMismatch: true, googleName: '다른 계정 이름' },
  { name: '테스트이름', type: '담임', nameSource: 'google', nameMismatch: true, googleName: '학교 계정' },
  { name: 'pending@example.invalid', type: '담임', nameSource: 'pending', nameMismatch: false }
].map((row, i) => ({ ...row, id: i + 1, email: `teacher${i}@example.invalid`, grade: 3, classNumber: i + 1, linked: true }));
const students = teachers.slice(1).map((row, i) => ({ id: i + 1, grade: 3, class_number: 1, student_number: String(i + 1), roster_name: row.name,
  name_source: row.nameSource, name_mismatch: row.nameMismatch, google_name: row.googleName,
  user_id: row.nameSource === 'google' || row.nameMismatch ? 100 + i : null,
  gender: '남', student_email: `student${i}@example.invalid`, guardian1_email: '', guardian2_email: '', custom_fields: {} }));

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const unexpected = [], errors = [], results = [];
  let isAdmin = true;
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://local');
    if (req.method !== 'GET') { unexpected.push(`${req.method} ${url.pathname}`); res.writeHead(405).end(); return; }
    const replies = {
      '/api/auth/me': { signedIn: true, isTeacher: true, user: { role: 'teacher', name: '검증용 관리자' } },
      '/api/school/settings': { isAdmin, columns: [], specialRooms: [], approvalLines: {} },
      '/api/school/students': { students },
      '/api/school/teachers': { isAdmin, teachers }
    };
    if (replies[url.pathname]) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(replies[url.pathname])); return; }
    if (url.pathname === '/classtools/school-roster') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); return; }
    res.writeHead(404).end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  try {
    for (const role of ['admin', 'teacher']) {
      isAdmin = role === 'admin';
      for (const width of [1920, 1365, 1024, 768, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/classtools/school-roster`);
      await page.locator('#rosterBody .roster-name-cell').first().waitFor();
      for (const [tab, selector] of [['roster', '#rosterBody .roster-name-cell'], ['teachers', '#teacherRosterBody .roster-name-cell']]) {
        await page.locator(`#tab-${tab}`).click();
        await page.locator(selector).first().waitFor();
        const measurements = await page.locator(selector).evaluateAll(wrappers => wrappers.map(wrapper => {
          const node = wrapper.firstChild;
          const input = node.nodeType === Node.ELEMENT_NODE ? node : null;
          const style = getComputedStyle(input || wrapper), context = document.createElement('canvas').getContext('2d');
          context.font = style.font;
          const text = input?.value || input?.placeholder || node.textContent;
          const range = document.createRange();
          range.selectNodeContents(node);
          const rect = input ? input.getBoundingClientRect() : range.getBoundingClientRect();
          const available = input ? input.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) : rect.width;
          const needed = context.measureText(text).width;
          const cell = wrapper.closest('td').getBoundingClientRect();
          const badges = [...wrapper.querySelectorAll('.name-chip')];
          const sameLine = badges.every(badge => {
            const box = badge.getBoundingClientRect();
            return Math.abs((box.top + box.bottom) / 2 - (rect.top + rect.bottom) / 2) < 1;
          });
          const contained = [rect, ...badges.map(badge => badge.getBoundingClientRect())]
            .every(box => box.left >= cell.left && box.right <= cell.right);
          const badgeOverlap = badges.some(badge => {
            const box = badge.getBoundingClientRect();
            return box.left < rect.right && box.right > rect.left && box.top < rect.bottom && box.bottom > rect.top;
          });
          return { value: input?.value, text, available, needed, badgeOverlap, sameLine, contained,
            rowHeight: wrapper.closest('tr').getBoundingClientRect().height, fits: needed <= available + 1 };
        }));
        results.push({ role, width, tab, measurements });
        await page.screenshot({ path: path.join(output, `${baseline ? 'before' : 'after'}-${role}-${tab}-${width}.png`) });
      }
      await page.close();
      }
    }
    fs.writeFileSync(path.join(output, `${baseline ? 'before' : 'after'}.json`), JSON.stringify(results, null, 2));
    const clipped = results.flatMap(row => row.measurements.filter(m => !m.fits || m.badgeOverlap || !m.contained || !m.sameLine).map(m => ({ role: row.role, width: row.width, tab: row.tab, ...m })));
    const uneven = results.filter(row => row.tab === 'roster' && Math.max(...row.measurements.map(m => m.rowHeight)) - Math.min(...row.measurements.map(m => m.rowHeight)) > 1)
      .map(row => ({ role: row.role, width: row.width, heights: row.measurements.map(m => m.rowHeight) }));
    console.log(JSON.stringify({ viewports: 5, screens: results.length, clipped, uneven, errors, unexpected }, null, 2));
    assert.deepEqual(errors, []);
    assert.deepEqual(unexpected, []);
    if (!baseline) {
      assert.deepEqual(clipped, [], 'Names and badges must remain readable on the same line within the name column');
      assert.deepEqual(uneven, [], 'Google and pending badges must not increase student row heights');
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
