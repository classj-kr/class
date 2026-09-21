// 생활기록부 화면을 진짜 크롬으로 열어, 키 저장부터 결과 그리기까지 돌려 본다.
// 학급 명단과 구글 API 는 가짜 답으로 바꿔치기해서 실제로 부르지 않는다.
//
// 구글이 주소도 모델 이름도 바꾸는 중이라 세 가지를 다 본다.
//  - 'new'     : 새 주소가 살아 있는 경우
//  - 'legacy'  : 새 주소가 404 라서 옛 주소로 돌아가야 하는 경우
//  - 'retired' : 고른 모델이 은퇴해서, 구글이 알려 준 이름으로 갈아타야 하는 경우
const fs = require('fs');
const http = require('http');
const path = require('path');
const assert = require('assert/strict');
const pp = require('puppeteer-core');

const ROOT = path.join(__dirname, '..');
const PAGE = fs.readFileSync(path.join(ROOT, 'classtools/record-ai.html'), 'utf8');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

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

const json = (body, status) => ({
  status: status || 200,
  contentType: 'application/json; charset=utf-8',
  headers: CORS,
  body: JSON.stringify(body)
});

const SENTENCES = '1. 첫째 문장임.\n2. 둘째 문장임.\n3. 셋째 문장임.';

// 은퇴한 모델을 부르면 구글이 대신 쓸 이름을 적어 보낸다.
const SUCCESSOR = 'gemini-3.6-flash';
const retiredMessage = (name) => 'This model models/' + name
  + ' is no longer available to new users. Please update your code to use models/'
  + SUCCESSOR + ' for the latest features and improvements.';

async function run(browser, port, mode) {
  const state = { calls: 0, wrongFallback: false, badBody: null, modelsUsed: [], keySeen: [], consoleErrors: [], pageErrors: [] };
  // 판마다 새 방을 쓴다. 한 방을 같이 쓰면 앞 판이 브라우저에 남긴 키와
  // 수행평가가 뒤 판에 그대로 딸려 와 엉뚱한 수를 센다.
  const context = browser.createBrowserContext
    ? await browser.createBrowserContext()
    : await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  page.on('console', m => { if (m.type() === 'error') state.consoleErrors.push(m.text()); });
  page.on('pageerror', e => state.pageErrors.push(String(e)));

  try {
    await page.setRequestInterception(true);
    page.on('request', request => {
      const url = request.url();
      const google = url.includes('generativelanguage.googleapis.com');
      if (request.method() === 'OPTIONS' && google) {
        return request.respond({ status: 204, headers: CORS, body: '' });
      }
      if (google) state.keySeen.push({ url, header: request.headers()['x-goog-api-key'] || null });

      if (url.includes('/api/teacher/available-classes')) {
        return request.respond(json({ classes: [{ id: '10', academicYear: 2026, grade: 6, classNumber: 2 }] }));
      }
      if (url.includes('/api/teacher/class')) {
        return request.respond(json({ classroom: { grade: 6, classNumber: 2, students: STUDENTS } }));
      }
      if (google && url.endsWith('/v1beta/models')) {
        // 목록에는 은퇴한 옛 모델이 앞에 섞여 있다. 순서대로 집으면 안 된다.
        return request.respond(json({
          models: [
            { name: 'models/gemini-2.5-flash' },
            { name: 'models/gemini-3.8-flash-image' },
            { name: 'models/gemini-3.6-flash' },
            { name: 'models/gemini-3.8-flash' },
            { name: 'models/gemini-3.8-pro' }
          ]
        }));
      }
      if (url.endsWith('/v1beta/interactions')) {
        if (mode === 'legacy') {
          return request.respond(json({ error: { message: '흉내: 이 주소는 없습니다.' } }, 404));
        }
        // 구글은 temperature 를 바깥에 두면 Unknown parameter 라며 400 을 낸다.
        const sent = JSON.parse(request.postData() || '{}');
        if ('temperature' in sent || 'max_output_tokens' in sent) {
          state.badBody = Object.keys(sent).join(', ');
          return request.respond(json({ error: { message: "흉내: Unknown parameter 'temperature'." } }, 400));
        }
        state.modelsUsed.push(sent.model);
        if (mode === 'retired' && sent.model !== SUCCESSOR) {
          return request.respond(json({ error: { message: retiredMessage(sent.model) } }, 400));
        }
        state.calls += 1;
        // 새 주소는 steps 안에 글을 담아 보낸다. 훑어서 찾아내야 한다.
        return request.respond(json({ steps: [{ content: [{ text: SENTENCES }] }] }));
      }
      if (url.includes(':generateContent')) {
        const used = (url.match(/models\/([^:]+):generateContent/) || [])[1] || '';
        state.modelsUsed.push(used);
        if (mode === 'retired') {
          // 은퇴한 모델은 어느 주소로 불러도 거절당한다.
          if (used !== SUCCESSOR) {
            return request.respond(json({ error: { message: retiredMessage(used) } }, 400));
          }
        } else if (mode !== 'legacy') {
          state.wrongFallback = true;
        }
        state.calls += 1;
        return request.respond(json({ candidates: [{ content: { parts: [{ text: SENTENCES }] } }] }));
      }
      return request.continue();
    });

    await page.goto(`http://127.0.0.1:${port}/classtools/record-ai`, { waitUntil: 'networkidle0' });

    // 1) 명단이 뜨는가
    await page.waitForFunction("document.getElementById('roster-list').children.length > 0", { timeout: 5000 });
    const rosterText = await page.$eval('#roster-list', el => el.textContent);
    assert.ok(rosterText.includes('김하늘') && rosterText.includes('이도윤'), '명단 이름이 안 보임: ' + rosterText);
    assert.ok((await page.$eval('#roster-status', el => el.textContent)).includes('3명'), '명단 인원 표시가 이상함');
    // 한 줄에 한 명씩 내려 적혀야 한다. 옆으로 늘어놓으면 줄 맨 위 자리가 같아진다.
    const rowTops = await page.evaluate(() => Array.from(document.getElementById('roster-list').children)
      .map(el => Math.round(el.getBoundingClientRect().top)));
    assert.ok(rowTops.length === 3 && rowTops[0] < rowTops[1] && rowTops[1] < rowTops[2],
      '명단이 세로로 쌓이지 않음: ' + JSON.stringify(rowTops));
    assert.ok(await page.$eval('#manual-count-group', el => getComputedStyle(el).display === 'none'),
      '명단이 있는데 인원수 칸이 떠 있음');
    assert.ok(await page.$eval('#class-group', el => getComputedStyle(el).display === 'none'),
      '반이 하나인데 학급 고르는 칸이 떠 있음');

    // 사진으로 확인하고 싶을 때만 찍는다.
    if (process.env.RECORD_SHOT && mode === 'new') {
      const main = await page.evaluateHandle(() => document.querySelector('main'));
      await main.asElement().screenshot({ path: process.env.RECORD_SHOT });
    }

    // 2) 첫 화면이 과목별이고 학기·과목 칸이 열려 있는가
    assert.equal(await page.$eval('#area-select', el => el.value), 'subject');
    assert.ok(await page.$eval('#semester-group', el => getComputedStyle(el).display !== 'none'),
      '과목별인데 학기 칸이 안 열림');
    assert.ok(await page.$eval('#sub-group', el => getComputedStyle(el).display !== 'none'),
      '과목별인데 과목 칸이 안 열림');
    assert.ok((await page.$eval('#topics-hint', el => el.textContent)).includes('수행평가'),
      '수행평가 안내가 안 보임');

    // 3) 키 저장
    await page.type('#api-key-input', 'AQ.AbFAKEKEYFORTEST');
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
    assert.equal(state.badBody, null,
      'temperature·max_output_tokens 는 generation_config 안에 넣어야 한다. 보낸 바깥 칸: ' + state.badBody);
    assert.ok(!state.wrongFallback, '새 주소가 되는데도 옛 주소로 넘어갔음');
    // 목록에서 가장 새 판을 골라야 한다. 은퇴한 2.5 를 집으면 안 된다.
    assert.ok(!state.modelsUsed.includes('gemini-2.5-flash'),
      '은퇴한 모델을 골랐음: ' + state.modelsUsed.join(', '));
    if (mode === 'retired') {
      assert.ok(state.modelsUsed.includes(SUCCESSOR),
        '구글이 알려 준 모델로 갈아타지 않았음: ' + state.modelsUsed.join(', '));
    } else {
      assert.equal(state.modelsUsed[0], 'gemini-3.8-flash',
        '가장 새 모델을 고르지 않았음: ' + state.modelsUsed.join(', '));
    }
    assert.equal(state.calls, 2, '수행평가 두 줄이면 두 번 불러야 함. 실제: ' + state.calls);

    // 키는 주소가 아니라 머리말로 가야 한다
    assert.ok(state.keySeen.length > 0, '구글을 부른 적이 없음');
    for (const call of state.keySeen) {
      assert.ok(!call.url.includes('key='), '키가 주소에 실려 나감: ' + call.url);
      assert.equal(call.header, 'AQ.AbFAKEKEYFORTEST', '키가 머리말에 없음: ' + call.url);
    }
    // 글을 다루지 못하는 모델은 고르지 않는다
    assert.ok(state.keySeen.some(c => c.url.includes('gemini-3.8-flash') && !c.url.includes('image'))
      || mode !== 'legacy', '그림 모델을 골랐음');

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
    assert.ok((await page.$eval('#topics-input', el => el.value)).includes('분수의 덧셈'),
      '1학기로 돌아왔는데 적어 둔 것이 사라짐');

    // 7) 행발로 옮기면 학기 칸이 닫히는가
    await page.select('#area-select', 'behavior');
    assert.ok(await page.$eval('#semester-group', el => getComputedStyle(el).display === 'none'),
      '행발인데 학기 칸이 남아 있음');

    assert.equal(state.pageErrors.length, 0, '스크립트 오류: ' + state.pageErrors.join(' | '));
    console.log('  ' + mode + ': 통과');
  } catch (err) {
    console.log('  --- ' + mode + ' 에서 멈춤. 그때 화면 상태 ---');
    for (const id of ['gen-status', 'key-status', 'roster-status']) {
      try { console.log('  ' + id + ':', await page.$eval('#' + id, el => el.textContent)); } catch (_) {}
    }
    console.log('  구글 부른 횟수:', state.calls);
    console.log('  스크립트 오류:', state.pageErrors.join(' | ') || '없음');
    console.log('  콘솔 오류:', state.consoleErrors.join(' | ') || '없음');
    throw err;
  } finally {
    await page.close();
    await context.close();
  }
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  let browser;
  try {
    browser = await pp.launch({
      executablePath: CHROME,
      headless: true,
      args: ['--no-first-run', '--no-default-browser-check']
    });
    console.log('생활기록부 화면');
    for (const mode of ['new', 'legacy', 'retired']) {
      await run(browser, port, mode);
    }
    console.log('모두 통과');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(e => { console.error('실패:', e.message); process.exit(1); });
