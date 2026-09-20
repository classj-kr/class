// 생활기록부 화면을 진짜 크롬으로 열어, 키 저장부터 결과 그리기까지 돌려 본다.
// 구글 API 와 학급 명단은 가짜 답으로 바꿔치기해서 실제로 부르지 않는다.
const fs = require('fs');
const http = require('http');
const path = require('path');
const assert = require('assert/strict');
const pp = require('puppeteer-core');

const ROOT = path.join(__dirname, '..');
const PAGE = fs.readFileSync(path.join(ROOT, 'classtools/record-ai.html'), 'utf8');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PROMPT_LOG = path.join(require('os').tmpdir(), 'record-ai-prompt.log');

const STUDENTS = [
  { number: '1', name: '김하늘' },
  { number: '2', name: '박서준' },
  { number: '3', name: '이도윤' }
];

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(PAGE);
});

// 구글은 제 서버에서 내줄 때 다른 곳에서 불러도 된다는 머리말을 붙인다.
// 흉내 낼 때 이걸 빼면 브라우저가 답을 막아 버린다.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
};

const json = (body) => ({
  status: 200,
  contentType: 'application/json; charset=utf-8',
  headers: CORS,
  body: JSON.stringify(body)
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  let browser;
  let page;
  const state = { generateCalls: 0, consoleErrors: [], pageErrors: [] };

  try {
    browser = await pp.launch({
      executablePath: CHROME,
      headless: true,
      args: ['--no-first-run', '--no-default-browser-check']
    });
    page = await browser.newPage();
    page.on('console', m => { if (m.type() === 'error') state.consoleErrors.push(m.text()); });
    page.on('pageerror', e => state.pageErrors.push(String(e)));

    await page.setRequestInterception(true);
    page.on('request', request => {
      const url = request.url();
      if (request.method() === 'OPTIONS' && url.includes('generativelanguage')) {
        return request.respond({ status: 204, headers: CORS, body: '' });
      }
      if (url.includes('/api/teacher/available-classes')) {
        return request.respond(json({ classes: [{ id: '10', academicYear: 2026, grade: 6, classNumber: 2 }] }));
      }
      if (url.includes('/api/teacher/class')) {
        return request.respond(json({ classroom: { grade: 6, classNumber: 2, students: STUDENTS } }));
      }
      if (url.includes('generativelanguage.googleapis.com') && url.includes('/models?')) {
        return request.respond(json({
          models: [{ name: 'models/gemini-2.5-flash', supportedGenerationMethods: ['generateContent'] }]
        }));
      }
      if (url.includes(':generateContent')) {
        state.generateCalls += 1;
        const body = JSON.parse(request.postData() || '{}');
        fs.appendFileSync(PROMPT_LOG, body.contents[0].parts[0].text + '\n=====\n');
        return request.respond(json({
          candidates: [{ content: { parts: [{ text: '1. 첫째 문장임.\n2. 둘째 문장임.\n3. 셋째 문장임.' }] } }]
        }));
      }
      return request.continue();
    });

    await page.goto(`http://127.0.0.1:${port}/classtools/record-ai`, { waitUntil: 'networkidle0' });

    // 1) 명단이 뜨는가
    await page.waitForFunction("document.getElementById('roster-list').children.length > 0", { timeout: 5000 });
    const rosterText = await page.$eval('#roster-list', el => el.textContent);
    const rosterStatus = await page.$eval('#roster-status', el => el.textContent);
    assert.ok(rosterText.includes('김하늘') && rosterText.includes('이도윤'), '명단 이름이 안 보임: ' + rosterText);
    assert.ok(rosterStatus.includes('3명'), '명단 인원 표시가 이상함: ' + rosterStatus);
    assert.ok(await page.$eval('#manual-count-group', el => getComputedStyle(el).display === 'none'),
      '명단이 있는데 인원수 칸이 떠 있음');
    assert.ok(await page.$eval('#class-group', el => getComputedStyle(el).display === 'none'),
      '반이 하나인데 학급 고르는 칸이 떠 있음');

    // 2) 첫 화면이 과목별이고 학기·과목 칸이 열려 있는가
    assert.equal(await page.$eval('#area-select', el => el.value), 'subject');
    assert.ok(await page.$eval('#semester-group', el => getComputedStyle(el).display !== 'none'),
      '과목별인데 학기 칸이 안 열림');
    assert.ok(await page.$eval('#sub-group', el => getComputedStyle(el).display !== 'none'),
      '과목별인데 과목 칸이 안 열림');
    assert.ok((await page.$eval('#topics-hint', el => el.textContent)).includes('수행평가'),
      '수행평가 안내가 안 보임');

    // 3) 키 저장
    await page.type('#api-key-input', 'AIzaSyFAKEKEYFORTEST');
    await page.click('#save-key-btn');
    await page.waitForFunction("document.getElementById('key-status').textContent.includes('저장')", { timeout: 3000 });

    // 4) 수행평가 두 줄 적고 돌리기
    await page.type('#sub-input', '수학');
    await page.click('#topics-input');
    await page.type('#topics-input', '분수의 덧셈과 뺄셈 계산하기\n도형의 넓이 구하기');
    await page.click('#generate-btn');
    await page.waitForFunction("document.getElementById('result-section').style.display === 'block'", { timeout: 20000 });

    const status = await page.$eval('#gen-status', el => el.textContent);
    assert.ok(!status.includes('오류'), '오류가 났음: ' + status);
    assert.ok(status.includes('3명분'), '결과 안내가 이상함: ' + status);
    assert.equal(state.generateCalls, 2, '수행평가 두 줄이면 두 번 불러야 함. 실제: ' + state.generateCalls);

    // 5) 결과가 이름에 붙었는가
    const rows = await page.$$eval('#result-list > div', els => els.map(el => el.textContent));
    assert.equal(rows.length, 3, '학생 수만큼 나오지 않음: ' + rows.length);
    assert.ok(rows[0].includes('1번 김하늘'), '첫 줄에 이름이 없음: ' + rows[0]);
    assert.ok(rows[2].includes('3번 이도윤'), '셋째 줄에 이름이 없음: ' + rows[2]);
    const body0 = rows[0].replace('1번 김하늘', '').replace('복사', '').trim();
    assert.equal(body0.split('문장임.').length - 1, 2, '수행평가 두 개가 이어 붙지 않음: ' + body0);
    assert.ok((await page.$eval('#result-area', el => el.value)).includes('2번 박서준'),
      '전체 복사 글에 이름이 없음');

    // 6) 적어 둔 수행평가가 학기·과목마다 따로 남는가
    await page.select('#semester-select', '2학기');
    assert.equal(await page.$eval('#topics-input', el => el.value), '',
      '2학기로 옮겼는데 1학기 내용이 남아 있음');
    await page.select('#semester-select', '1학기');
    const back = await page.$eval('#topics-input', el => el.value);
    assert.ok(back.includes('분수의 덧셈'), '1학기로 돌아왔는데 적어 둔 것이 사라짐: ' + JSON.stringify(back));

    // 7) 행발로 옮기면 학기 칸이 닫히는가
    await page.select('#area-select', 'behavior');
    assert.ok(await page.$eval('#semester-group', el => getComputedStyle(el).display === 'none'),
      '행발인데 학기 칸이 남아 있음');

    assert.equal(state.pageErrors.length, 0, '스크립트 오류: ' + state.pageErrors.join(' | '));
    console.log('생활기록부 화면: 모두 통과');
    if (state.consoleErrors.length) console.log('(콘솔에 찍힌 오류: ' + state.consoleErrors.join(' | ') + ')');
  } catch (err) {
    console.log('--- 그때 화면 상태 ---');
    if (page) {
      for (const id of ['gen-status', 'key-status', 'roster-status']) {
        try { console.log(id + ':', await page.$eval('#' + id, el => el.textContent)); } catch (_) {}
      }
      try { console.log('topics:', JSON.stringify(await page.$eval('#topics-input', el => el.value))); } catch (_) {}
    }
    console.log('구글 부른 횟수:', state.generateCalls);
    console.log('스크립트 오류:', state.pageErrors.join(' | ') || '없음');
    console.log('콘솔 오류:', state.consoleErrors.join(' | ') || '없음');
    throw err;
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(e => { console.error('실패:', e.message); process.exit(1); });
