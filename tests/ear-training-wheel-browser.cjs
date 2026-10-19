const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const {chromium, webkit} = require('../game-hub-server/node_modules/playwright');
const capture = require('./screenshot-webp.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/qa/ear-training-wheel');
fs.mkdirSync(output, {recursive:true});
const app = express();
let stored = {};
app.use(express.json());
app.get('/api/me/storage/ear-training', (_req, res) => res.json({items:stored}));
app.put('/api/me/storage/ear-training/saved', (req, res) => { stored.saved = req.body.value; res.json({ok:true}); });
app.use(express.static(root));
const server = app.listen(0, '127.0.0.1');
const back = page => page.locator('.page-back').click();
async function noOverflow(page, label, vertical = false) {
    const sizes = await page.evaluate(() => ({width:innerWidth, height:innerHeight,
        scrollWidth:document.documentElement.scrollWidth, scrollHeight:document.documentElement.scrollHeight}));
    assert.ok(sizes.scrollWidth <= sizes.width, label + ': horizontal overflow ' + JSON.stringify(sizes));
    if (vertical) assert.ok(sizes.scrollHeight <= sizes.height, label + ': vertical overflow ' + JSON.stringify(sizes));
}

(async () => {
    if (!server.listening) await new Promise(resolve => server.once('listening', resolve));
    const url = `http://127.0.0.1:${server.address().port}/learning/arts/music-theory/ear-training/`;
    for (const [engine, launcher] of [['chromium',chromium], ['webkit',webkit]]) {
        const browser = await launcher.launch({headless:true, ...(engine === 'chromium' ? {
            executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'
        } : {})});
        try {
            for (const [width,height] of [[1790,853],[1366,768],[1024,768],[1180,820],[768,1024],[390,844]]) {
                stored = {};
                const page = await browser.newPage({viewport:{width,height}, hasTouch:true, reducedMotion:'reduce'});
                const errors = [];
                page.on('pageerror', error => errors.push(error.message));
                page.on('response', response => { if (response.status() >= 400) errors.push(response.status() + ' ' + response.url()); });
                await page.goto(url, {waitUntil:'networkidle'});
                await page.locator('#courseList .genre-card').first().waitFor();
                assert.deepEqual(await page.locator('#courseList .genre-en').allTextContents(), ['Intervals','Chords','Chord Progressions','Scales','Rhythm','Circle of Fifths']);
                assert.deepEqual(await page.locator('#courseList .genre-ko').allTextContents(), ['(음정)','(화음)','(화음 진행)','(음계)','(리듬)','(5도권 활용)']);
                assert.equal(await page.locator('#toolList, .section-badge').count(), 0);
                const cards = await page.locator('#courseList .genre-card').evaluateAll(nodes => nodes.map(node => {
                    const rect = node.getBoundingClientRect();
                    return {width:rect.width, height:rect.height, font:getComputedStyle(node.querySelector('strong')).fontFamily};
                }));
                for (const card of cards) {
                    assert.ok(Math.abs(card.width - cards[0].width) < 1);
                    assert.equal(card.height, cards[0].height);
                    assert.ok(!/Georgia|Noto Serif|(?:^|[ ,])serif(?:$|[ ,])/i.test(card.font), card.font);
                }
                await noOverflow(page, 'menu', true);
                await capture(page, {path:path.join(output,`${engine}-${width}-menu.webp`),fullPage:true});
                await page.getByRole('button', {name:'Circle of Fifths (5도권 활용)', exact:true}).click();
                assert.equal(await page.locator('#courseTitle').textContent(), 'Circle of Fifths​(5도권 활용)');
                assert.equal(await page.locator('.lesson-row').count(), 6);
                assert.equal(await page.locator('.row-act.is-practice').count(), 6);
                await page.locator('.row-act.is-text').first().click();
                assert.equal(await page.locator('#wheelTitle').textContent(), '5도씩 돌아가기');
                await page.locator('#wheelNext').click();
                assert.match(await page.locator('.wheel-hub-major').first().textContent(), /^G major/);
                await page.locator('#wheelPrev').click();
                assert.match(await page.locator('.wheel-hub-major').first().textContent(), /^C major/);
                assert.equal(await page.locator('#wheelBoard .wheel-signature-count').textContent(), '조표 없음');
                for (let step = 0; step < 6; step++) await page.locator('#wheelNext').click();
                assert.match(await page.locator('#wheelBoard .wheel-hub-major').textContent(), /^F♯ major/);
                assert.equal(await page.locator('#wheelBoard .wheel-signature-mark[data-glyph="266f"]').count(), 6);
                await page.locator('#wheelFlat').click();
                assert.match(await page.locator('#wheelBoard .wheel-hub-major').textContent(), /^G♭ major/);
                assert.equal(await page.locator('#wheelBoard .wheel-signature-mark[data-glyph="266d"]').count(), 6);
                assert.equal(await page.locator('#wheelBoard .sheet-clef, #wheelBoard .sheet-staff').count(), 0);
                for (let lesson = 0; lesson < 5; lesson++) {
                    await noOverflow(page, 'wheel lesson ' + lesson, width >= 768);
                    assert.equal(await page.locator('#wheelChords button').count(), 7);
                    if (lesson === 0 || lesson === 4) await capture(page, {
                        path:path.join(output,`${engine}-${width}-lesson-${lesson + 1}.webp`),fullPage:true
                    });
                    await page.locator('#wheelLessonNext').click();
                }
                await page.locator('.row-act.is-practice').last().click();
                await noOverflow(page, 'practice', width >= 768);
                assert.equal(await page.locator('#wheelHint').getAttribute('open'), null);
                if (width === 1790) {
                    for (let index = 0; index < 10; index++) {
                        const answer = await page.evaluate(() => WheelPractice.questionBank().find(q =>
                            q.prompt === document.querySelector('#wheelQuestion').textContent).answer);
                        if (index === 0) {
                            await page.locator('#wheelHint summary').click();
                            await page.locator('#wheelHintBoard .wheel').waitFor();
                            await page.locator('#wheelHint summary').click();
                        }
                        const options = page.locator('#wheelChoices button');
                        const values = await options.allTextContents();
                        const wrong = [0,4,7].includes(index);
                        const choice = wrong ? values.find(value => value !== answer) : answer;
                        await page.getByRole('button', {name:choice, exact:true}).click();
                        assert.equal(await page.locator('#wheelChoices button:disabled').count(), 4);
                        assert.equal(await page.locator('#wheelChoices .right').textContent(), answer);
                        assert.ok((await page.locator('#wheelFeedback').textContent()).length > 15);
                        if (index === 1) await capture(page, {path:path.join(output,`${engine}-answer.webp`),fullPage:true});
                        await page.locator('#wheelQuestionNext').click();
                        if (index < 9) assert.equal(await page.locator('#wheelHint').getAttribute('open'), null);
                    }
                    assert.equal(await page.locator('#wheelPracticeScore').textContent(), '10문제 중 7문제 정답');
                    assert.equal(await page.locator('#wheelReview li').count(), 3);
                    assert.equal(await page.locator('#wheelHintCount').textContent(), '원판 힌트 사용: 1문제');
                    await capture(page, {path:path.join(output,`${engine}-result.webp`),fullPage:true});
                    await page.evaluate(async () => (await SiteStorage.open('ear-training')).flush());
                    assert.equal(Object.values(stored.saved.stats.wheel).reduce((sum,row) => sum + row.total, 0), 10);
                    assert.equal(Object.values(stored.saved.stats.wheel).reduce((sum,row) => sum + row.right, 0), 7);
                    await page.locator('#wheelPracticeAgain').click();
                    assert.equal(await page.locator('#wheelPracticeProgress').textContent(), '1 / 10');
                    await back(page);
                    assert.equal(await page.locator('#wheelPracticeScore').textContent(), '푼 문제가 없습니다');
                    await back(page);
                } else {
                    await capture(page, {path:path.join(output,`${engine}-${width}-question.webp`),fullPage:true});
                    await page.locator('#wheelPracticeStop').click();
                    await page.locator('#wheelPracticeBack').click();
                }
                assert.ok(await page.locator('#courseScreen').isVisible());
                // 각 차시의 문제 아이콘도 해당 유형으로 바로 연결된다.
                for (let index = 0; index < 5; index++) {
                    await page.locator('.row-act.is-practice').nth(index).click();
                    const match = await page.evaluate(() => WheelPractice.questionBank().find(q =>
                        q.prompt === document.querySelector('#wheelQuestion').textContent).type);
                    assert.equal(match, ['fifths','signature','relative','neighbors','diatonic'][index]);
                    await back(page);
                    await back(page);
                }
                await back(page);
                assert.ok(await page.locator('#menuScreen').isVisible());
                // 기존 청음의 차시·건반과 리듬 링크도 그대로 동작한다.
                assert.equal(await page.getByRole('link', {name:'Rhythm (리듬)',exact:true}).getAttribute('href'), '../rhythm-training/');
                await page.getByRole('button', {name:'Intervals (음정)',exact:true}).click();
                await page.locator('.row-act.is-keys').first().click();
                await page.locator('#staff svg').waitFor();
                assert.ok(await page.locator('#pianoKeys button').count() > 0);
                assert.deepEqual(errors, []);
                console.log(`${engine} ${width}×${height}: menu, five lessons, quizzes, navigation and existing ear training passed`);
                await page.close();
            }
        } finally { await browser.close(); }
    }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
