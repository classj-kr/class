const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs', 'teacher-settings-review');
const avatarKeys = fs.readdirSync(path.join(root, 'apps/classtools/assets/avatars')).filter(key => key.endsWith('.webp')).slice(0, 16);
const avatar = key => ({ key, url: key ? '/assets/avatars/' + key : '', canChange: true,
    changePeriodLabel: '2학기', options: avatarKeys.map(key => ({ key, url: '/assets/avatars/' + key, available: true })) });

async function main() {
    fs.mkdirSync(output, { recursive: true });
    const app = express();
    app.use('/assets/avatars', express.static(path.join(root, 'apps/classtools/assets/avatars')));
    app.use(express.static(path.join(root, 'apps'), { extensions: ['html'] }));
    app.use(express.static(root, { extensions: ['html'] }));
    const server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
    const base = `http://127.0.0.1:${server.address().port}`;
    let browser;
    try {
        browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
        const context = await browser.newContext({ viewport: { width: 1100, height: 850 } });
        let role = 'teacher', email = 'teacher@example.kr', googleCalls = 0, generationCalls = 0, profileWrites = 0, connectionChecks = 0;
        const accountKeys = new Map();
        let profile = { birthdayMmdd: '', birthdayVisible: false, avatar: avatar('') };
        const errors = [];
        await context.route('**/api/**', async route => {
            const url = new URL(route.request().url());
            const method = route.request().method();
            const body = ['PATCH', 'PUT', 'POST'].includes(method) ? route.request().postDataJSON() : {};
            let data = {};
            if (url.pathname === '/api/auth/me') data = { signedIn: true, isTeacher: role === 'teacher',
                user: { name: role === 'teacher' ? '김교사' : '김학생', role, email }, membership: role === 'student' ? { classId: '100' } : null };
            else if (url.pathname === '/api/teacher/profile') data = { profiles: [{ name: '김교사', schoolName: '테스트초등학교', active: true, grade: 4, classNumber: 1 }] };
            else if (['/api/teacher/settings', '/api/student/profile'].includes(url.pathname)) {
                if (method === 'PATCH') { profileWrites++; profile.birthdayMmdd = body.birthdayMmdd; profile.birthdayVisible = body.birthdayVisible; }
                data = { profile: { ...profile, name: '김학생', studentNumber: '1', grade: 4, classNumber: 1 } };
            } else if (['/api/teacher/avatar', '/api/student/avatar'].includes(url.pathname)) {
                profile.avatar = avatar(body.avatarKey); data = { profile };
            } else if (url.pathname === '/api/teacher/available-classes') data = { classes: [{ id: '100', academicYear: 2026, grade: 4, classNumber: 1 }] };
            else if (url.pathname === '/api/teacher/class') data = { classroom: { grade: 4, classNumber: 1, students: [{ number: '1', name: '김학생' }, { number: '2', name: '이학생' }] } };
            else if (url.pathname === '/api/teacher/groups') data = { groups: [] };
            else if (url.pathname === '/api/teacher-ai/key') {
                if (method === 'PUT') accountKeys.set(email, body.key);
                if (method === 'DELETE') accountKeys.delete(email);
                data = { registered: accountKeys.has(email), last4: (accountKeys.get(email) || '').slice(-4) };
            } else if (url.pathname === '/api/teacher-ai/check') {
                connectionChecks++;
                assert.ok(accountKeys.has(email) || body.key);
                data = { ok: true };
            } else if (url.pathname === '/api/teacher-ai/generate') {
                assert.ok(accountKeys.has(email));
                generationCalls++;
                data = { text: '1. 활동 내용을 이해하고 설명함.\n2. 문제를 해결하고 풀이를 확인함.' };
            }
            await route.fulfill({ json: data });
        });
        await context.route('https://generativelanguage.googleapis.com/**', async route => {
            googleCalls++;
            await route.abort(); // The browser must only call the account-scoped server API.
        });
        const page = await context.newPage();
        page.on('pageerror', error => errors.push(error.message));
        page.on('dialog', dialog => dialog.accept());
        await page.goto(base + '/classtools/profile');
        await page.locator('#saveAiKey').waitFor();
        await page.waitForFunction(() => !document.querySelector('#saveAiKey').disabled);
        assert.equal(await page.locator('#identityRole').textContent(), '교사');
        assert.equal(await page.locator('#birthdayVisible').isChecked(), false);
        await page.locator('#birthdayVisible').check();
        await page.locator('#saveButton').click();
        assert.match(await page.locator('#status').textContent(), /먼저 선택/);
        assert.equal(profileWrites, 0);
        await page.locator('#birthdayMonth').selectOption('2');
        await page.locator('#birthdayDay').selectOption('29');
        await page.locator('#saveButton').click();
        await page.waitForFunction(() => document.querySelector('#status').textContent.includes('저장했습니다'));
        assert.equal(profile.birthdayMmdd, '0229');
        await page.reload();
        await page.locator('#profileForm').waitFor();
        assert.equal(await page.locator('#birthdayDay').inputValue(), '29');
        assert.equal(await page.locator('#birthdayVisible').isChecked(), true);
        await page.locator('#birthdayVisible').uncheck(); await page.locator('#saveButton').click();
        await page.waitForFunction(() => document.querySelector('#status').textContent.includes('저장했습니다'));
        assert.equal(profile.birthdayVisible, false);
        await page.locator('#openAvatarPicker').click();
        await page.locator('#recommendedAvatars button').first().click();
        await page.locator('#saveAvatar').click();
        await page.waitForFunction(() => !document.querySelector('#currentAvatarImage').hidden);
        assert.ok(profile.avatar.key);
        await page.evaluate(() => localStorage.setItem('gemini_api_key', 'fake-legacy-key'));
        // Previously saved keys work from a feature directly; no settings visit
        // or import action is required.
        await page.goto(base + '/classtools/record-ai');
        await page.waitForFunction(() => Boolean(window.ClassroomAI));
        assert.equal(await page.evaluate(async () => { await ClassroomAI.init(); return ClassroomAI.hasKey(); }), true);
        await page.goto(base + '/classtools/profile');
        await page.waitForFunction(() => !document.querySelector('#saveAiKey').disabled);
        assert.equal(await page.locator('#importAiKey').count(), 0);
        assert.equal(await page.locator('#geminiKey').inputValue(), '');
        assert.match(await page.locator('#geminiKey').getAttribute('placeholder'), /등록된 키/);
        assert.equal(accountKeys.get(email), 'fake-legacy-key');
        assert.equal(await page.evaluate(() => localStorage.getItem('gemini_api_key')), null);
        assert.equal(googleCalls, 0, 'recognizing saved keys never sends Google a request');
        await page.locator('#checkAiKey').click();
        await page.waitForFunction(() => document.querySelector('#aiStatus').textContent.includes('연결을 확인했습니다'));
        assert.equal(connectionChecks, 1);
        assert.equal(generationCalls, 0, 'connection check does not generate text');
        await page.screenshot({ path: path.join(output, 'teacher-desktop.png'), fullPage: true });
        await page.setViewportSize({ width: 390, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.screenshot({ path: path.join(output, 'teacher-mobile.png'), fullPage: true });
        await page.goto(base + '/classtools/record-ai');
        await page.waitForFunction(() => Boolean(window.ClassroomAI));
        assert.equal(await page.locator('#api-key-input').count(), 0);
        await page.locator('#sub-input').selectOption({ label: '수학' });
        await page.locator('#topics-input').fill('분수의 덧셈 계산하기');
        await page.locator('#generate-btn').click();
        await page.locator('#result-section').waitFor({ timeout: 10000 });
        assert.ok(generationCalls > 0);
        assert.match(await page.locator('#gen-status').textContent(), /명분을 만들었습니다/);
        await page.goto(base + '/classtools/profile#ai-settings');
        await page.locator('#deleteAiKey').click();
        await page.waitForFunction(() => document.querySelector('#aiStatus').textContent.includes('삭제했습니다'));
        assert.equal(await page.locator('#geminiKey').inputValue(), '');
        await page.locator('#geminiKey').fill('teacher-one-key'); await page.locator('#saveAiKey').click();
        await page.waitForFunction(() => document.querySelector('#aiStatus').textContent.includes('저장했습니다'));
        await page.evaluate(() => localStorage.setItem('gemini_api_key', 'older-key'));
        await page.reload();
        await page.waitForFunction(() => !document.querySelector('#saveAiKey').disabled);
        assert.equal(await page.locator('#geminiKey').inputValue(), '', 'server never returns the saved key');
        assert.equal(accountKeys.get(email), 'teacher-one-key', 'existing server setting takes priority');
        assert.equal(await page.evaluate(() => localStorage.getItem('gemini_api_key')), null);
        email = 'other@example.kr'; await page.reload();
        await page.waitForFunction(() => !document.querySelector('#saveAiKey').disabled);
        assert.equal(await page.locator('#geminiKey').inputValue(), '', 'other teacher cannot inherit saved key');
        assert.equal(await page.evaluate(() => ClassroomAI.hasKey()), false);
        email = 'teacher@example.kr'; await page.reload();
        await page.waitForFunction(() => !document.querySelector('#saveAiKey').disabled);
        assert.equal(await page.locator('#geminiKey').inputValue(), '');
        assert.equal(await page.evaluate(() => ClassroomAI.hasKey()), true);
        role = 'student'; email = 'child@example.kr'; await page.reload();
        await page.locator('#profileForm').waitFor();
        assert.equal(await page.locator('#ai-settings').isVisible(), false);
        assert.equal(await page.locator('#identityRole').textContent(), '학생');
        assert.match(await page.locator('#avatarPolicy').textContent(), /1회/);
        await page.screenshot({ path: path.join(output, 'student-mobile.png'), fullPage: true });
        assert.deepEqual(errors, []);
        assert.equal(googleCalls, 0, 'AI requests and API keys never go directly from the browser to Google');
        console.log('PASS desktop/mobile teacher profile, birthday persistence, avatar change, automatic saved-key compatibility, AI check/delete, record generation, account isolation and student regression');
        await context.close();
    } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
