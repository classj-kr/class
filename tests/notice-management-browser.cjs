const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createHarness } = require('./notice-management-harness.cjs');

async function capture(page, name) {
    const folder = path.resolve('outputs/notice-management');
    fs.mkdirSync(folder, { recursive: true });
    const result = spawnSync('python', ['-c', 'import sys,io;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read()));im.save(sys.argv[1],"WEBP",lossless=True);out=Image.open(sys.argv[1]);assert out.size==im.size;assert out.convert("RGBA").tobytes()==im.convert("RGBA").tobytes()', path.join(folder, name + '.webp')], { input: await page.screenshot({ fullPage: false }) });
    assert.equal(result.status, 0, result.stderr?.toString());
}

(async () => {
    const h = await createHarness(); let browser;
    try {
        browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
        const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
        await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(h.base + '/teacher/');
        await page.locator('.tab-btn').filter({ hasText: '가정통신문 회신 수합 현황' }).click();
        const row = id => page.locator(`.notice-row[data-notice-id="${id}"]`);
        await row(101).waitFor();
        assert.equal(await row(101).locator('[data-notice-action]').count(), 2);
        assert.equal(await row(102).locator('[data-notice-action]').count(), 0);
        await capture(page, 'sent-notices');

        await row(101).getByRole('button', { name: '수정', exact: true }).click();
        await page.waitForFunction(() => !document.getElementById('noticeEditTitle').disabled);
        assert.equal(await page.locator('#noticeEditTitle').inputValue(), '현장체험학습 안내');
        assert.equal(await page.locator('#noticeEditDialog select, #noticeEditDialog input[type=checkbox], #noticeEditDialog .survey-item').count(), 0);
        await page.locator('#noticeEditTitle').fill('현장체험학습 안내 (시간 정정)');
        await page.locator('#noticeEditBody').fill('금요일 8시 50분까지 교실로 모여 주세요.');
        await capture(page, 'edit-notice');
        await page.route('**/api/teacher/notices/101', async route => {
            if (route.request().method() === 'PATCH') return route.fulfill({ status: 503, json: { message: '저장에 실패했습니다. 다시 시도해 주세요.' } });
            return route.continue();
        });
        await page.getByRole('button', { name: '수정 저장', exact: true }).click();
        await page.locator('#noticeEditError').filter({ hasText: '저장에 실패' }).waitFor();
        assert.equal(await page.locator('#noticeEditBody').inputValue(), '금요일 8시 50분까지 교실로 모여 주세요.', 'failed saves preserve the draft');
        await page.unroute('**/api/teacher/notices/101');
        await page.getByRole('button', { name: '수정 저장', exact: true }).click();
        await page.locator('#noticeEditDialog').waitFor({ state: 'hidden' });
        await row(101).getByText('현장체험학습 안내 (시간 정정)', { exact: true }).waitFor();
        assert.match(await row(101).innerText(), /수정됨/);
        assert.equal((await h.db.query('SELECT COUNT(*)::INTEGER AS n FROM classroom_notice_answers')).rows[0].n, 1);

        page.once('dialog', dialog => dialog.dismiss());
        await row(101).getByRole('button', { name: '삭제', exact: true }).click();
        assert.equal(await row(101).count(), 1, 'cancelling deletion keeps the notice');
        page.once('dialog', async dialog => { assert.match(dialog.message(), /회신과 설문 응답도 함께 삭제/); await dialog.accept(); });
        await row(101).getByRole('button', { name: '삭제', exact: true }).click();
        await row(101).waitFor({ state: 'detached' });
        assert.equal((await h.db.query('SELECT COUNT(*)::INTEGER AS n FROM classroom_notice_answers')).rows[0].n, 0);

        // A second editor cannot silently overwrite an administrator's update.
        await row(106).getByRole('button', { name: '수정', exact: true }).click();
        await page.waitForFunction(() => !document.getElementById('noticeEditTitle').disabled);
        await page.locator('#noticeEditTitle').fill('작성 중인 수정 제목');
        await context.request.patch(h.base + '/api/teacher/notices/106', { headers: { 'x-test-user': '3' }, data: { title: '관리자가 정정한 제목', contentBody: '색연필을 준비해 주세요.', version: 0 } });
        await page.getByRole('button', { name: '수정 저장', exact: true }).click();
        await page.locator('#noticeEditError').filter({ hasText: '다른 곳에서 수정' }).waitFor();
        assert.equal(await page.locator('#noticeEditTitle').inputValue(), '작성 중인 수정 제목');
        await page.getByRole('button', { name: '취소', exact: true }).click();
        await page.evaluate(() => loadNoticeReplies());
        await row(106).getByText('관리자가 정정한 제목', { exact: true }).waitFor();
        await page.setViewportSize({ width: 390, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await capture(page, 'mobile-notices');
        await row(106).getByRole('button', { name: '수정', exact: true }).click();
        await page.waitForFunction(() => !document.getElementById('noticeEditTitle').disabled);
        assert.equal(await page.locator('#noticeEditDialog').evaluate(el => el.scrollWidth <= el.clientWidth), true);
        await capture(page, 'mobile-edit');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#noticeEditDialog').isVisible(), false);
        assert.deepEqual(errors, []);
        console.log('Notice management browser: ownership controls, title/body edit, immutable fields, save failure, delete/cancel, concurrent edits and mobile passed');
    } finally { await browser?.close(); await h.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
