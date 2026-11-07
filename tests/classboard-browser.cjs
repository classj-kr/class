const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const { classboardItemReadSchema, createClassboardReadState } = require('../game-hub-server/classboard-read-state');

async function harness() {
    const db = new PGlite();
    await db.exec(`
      CREATE TABLE classroom_users(id BIGINT PRIMARY KEY);
      INSERT INTO classroom_users VALUES(1),(2),(3),(4);
      CREATE TABLE classroom_classboard_posts(id BIGINT PRIMARY KEY, class_id BIGINT, group_id BIGINT, author_user_id BIGINT, content TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
      CREATE TABLE classroom_classboard_reads(user_id BIGINT, board_key TEXT, last_read_at TIMESTAMPTZ);
    `);
    await db.exec(classboardItemReadSchema);
    const seeded = [
        [101, 100, null, 1, '월요일에는 체육복을 입고 오세요.\n국어 책과 필통도 챙겨 주세요.', '2026-11-07T10:00Z'],
        [102, 100, null, 4, '다음 주 활동 안내\n' + Array.from({ length: 50 }, (_, i) => `${i + 1}. 모둠별 활동에 필요한 준비물을 확인해 주세요.`).join('\n'), '2026-11-07T09:00Z'],
        [103, 100, null, 1, '금요일 미술 시간에는 색연필을 준비해 주세요.', '2026-11-07T08:00Z'],
        [201, null, 55, 4, '화요일 합주는 음악실에서 시작합니다. 악보를 준비해 주세요.', '2026-11-07T10:00Z']
    ];
    for (const row of seeded) await db.query('INSERT INTO classroom_classboard_posts VALUES ($1,$2,$3,$4,$5,$6)', row);
    const state = createClassboardReadState({ pool: db, noticeTargetSql: 'FALSE' });
    const boards = [
        { key: 'class:100', kind: 'class', id: '100', label: '6학년 2반', typeLabel: '학급', memberCount: 25 },
        { key: 'group:55', kind: 'group', id: '55', label: '오케스트라', typeLabel: '동아리', memberCount: 32 },
        { key: 'group:56', kind: 'group', id: '56', label: '방송부', typeLabel: '동아리', memberCount: 8 }
    ];
    const app = express();
    app.use(express.json());
    const requests = { posts: 0, reads: 0 };
    app.use((req, res, next) => {
        const id = Number(/(?:^|;\s*)test_user=(\d+)/.exec(req.headers.cookie || '')?.[1] || 1);
        req.viewer = { id, role: id === 1 ? 'teacher' : 'student', name: id === 1 ? '박화승' : '김민서' };
        next();
    });
    const route = fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
    app.get('/api/auth/me', (req, res) => res.json({ signedIn: true, user: req.viewer, isTeacher: req.viewer.id === 1, membership: { classId: 100 } }));
    app.get('/api/push/key', (_req, res) => res.json({ enabled: false }));
    app.get('/api/classboard/boards', route(async (req, res) => {
        const unread = await state.counts(req.viewer, boards);
        res.json({ viewerAvatar: `/assets/avatars/animal-${req.viewer.id === 1 ? 'bear' : 'cat'}.webp`, boards: boards.map(b => ({ ...b, canPost: req.viewer.id === 1, unreadCount: unread.get(b.key) || 0 })) });
    }));
    app.get('/api/classboard/posts', route(async (req, res) => {
        requests.posts++;
        const board = boards.find(b => b.key === req.query.board);
        if (!board) return res.status(403).json({ error: 'FORBIDDEN' });
        const result = await db.query('SELECT * FROM classroom_classboard_posts WHERE class_id IS NOT DISTINCT FROM $1::BIGINT AND group_id IS NOT DISTINCT FROM $2::BIGINT ORDER BY created_at DESC', [board.kind === 'class' ? board.id : null, board.kind === 'group' ? board.id : null]);
        res.json({ board, readIds: await state.readIds(req.viewer, board), posts: result.rows.map(p => ({
            id: String(p.id), content: p.content, authorName: p.author_user_id === 1 ? '박화승' : '이선생',
            authorRole: 'teacher', authorLabel: p.author_user_id === 1 ? '담임' : '음악', authorSubject: p.author_user_id === 1 ? '' : '음악',
            authorAvatar: '/assets/avatars/animal-bear.webp', createdAt: p.created_at,
            isMine: p.author_user_id === req.viewer.id, canDelete: req.viewer.id === 1,
            comments: p.id === 101 ? [{ id: '51', authorName: '박화승', authorRole: 'teacher', authorAvatar: '/assets/avatars/animal-bear.webp', content: '준비물은 가방에 미리 넣어 두세요.' }] : []
        })) });
    }));
    app.post('/api/classboard/read', route(async (req, res) => {
        requests.reads++;
        const board = boards.find(b => b.key === req.body.board);
        if (!board) return res.status(403).end();
        const readIds = await state.markRead(req.viewer, board, req.body.ids);
        res.json({ readIds, unreadCount: (await state.counts(req.viewer, [board])).get(board.key) || 0 });
    }));
    app.post('/api/classboard/posts/:id/comments', (_req, res) => res.json({ id: '52' }));
    app.use('/classboard', express.static(path.join(__dirname, '../apps/classboard')));
    app.use('/assets/avatars', express.static(path.join(__dirname, '../apps/classtools/assets/avatars')));
    app.use('/assets', express.static(path.join(__dirname, '../assets')));
    app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ error: error.message }); });
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    return { base, db, requests, boards, state, close: async () => { await new Promise(resolve => server.close(resolve)); await db.close(); } };
}

async function capture(page, name) {
    const output = path.resolve('outputs/classboard');
    fs.mkdirSync(output, { recursive: true });
    const result = spawnSync('python', ['-c', 'import sys,io;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read()));im.save(sys.argv[1],format="WEBP",lossless=True);out=Image.open(sys.argv[1]);assert out.size==im.size;assert out.convert("RGBA").tobytes()==im.convert("RGBA").tobytes()', path.join(output, `${name}.webp`)], { input: await page.screenshot({ fullPage: false }) });
    assert.equal(result.status, 0, result.stderr?.toString());
}

(async () => {
    const h = await harness();
    if (process.argv.includes('--preview')) { console.log(h.base + '/classboard/'); return; }
    let browser;
    try {
        browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
        const errors = [];
        const newViewer = async (id, viewport, reducedMotion = 'no-preference') => {
            const context = await browser.newContext({ viewport, serviceWorkers: 'block', reducedMotion });
            await context.addCookies([{ name: 'test_user', value: String(id), url: h.base }]);
            const page = await context.newPage();
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(h.base + '/classboard/');
            await page.locator('.group-card').first().waitFor();
            return page;
        };
        const teacher = await newViewer(1, { width: 1440, height: 960 });
        assert.equal(await teacher.locator('.group-card').count(), 3);
        assert.equal(h.requests.posts, 0, 'the landing list never fetches a feed');
        assert.equal(h.requests.reads, 0);
        assert.equal(await teacher.locator('#composerSection').isVisible(), false);
        assert.match(await teacher.locator('.profile-avatar img').getAttribute('src'), /animal-bear.webp$/);
        await capture(teacher, 'teacher-groups');

        const student = await newViewer(2, { width: 1440, height: 960 });
        const classCard = () => student.locator('.group-card[data-board-key="class:100"]');
        assert.equal(await classCard().locator('.group-unread').textContent(), '3');
        await capture(student, 'student-groups');
        await classCard().click();
        await student.locator('.post-card').first().waitFor();
        await student.getByRole('button', { name: '그룹 목록', exact: true }).click();
        assert.equal(await classCard().locator('.group-unread').textContent(), '3', 'a brief group visit cannot clear badges');
        await classCard().click();
        await student.waitForFunction(() => readIds.has('101'));
        assert.equal(await student.locator('#composerSection').isVisible(), false);
        assert.equal(await student.locator('[data-type="post-avatar"] img').first().getAttribute('src'), await student.locator('[data-type="comment-avatar"] img').first().getAttribute('src'));
        const comment = student.locator('.comment-input').first();
        await comment.fill('확인했습니다.');
        await student.locator('.comment-btn').first().click();
        await student.locator('.comment').filter({ hasText: '확인했습니다.' }).waitFor();
        assert.match(await student.locator('.comment').filter({ hasText: '확인했습니다.' }).locator('img').getAttribute('src'), /animal-cat.webp$/);
        await capture(student, 'student-feed');
        await student.getByRole('button', { name: '그룹 목록', exact: true }).click();
        assert.equal(await classCard().locator('.group-unread').textContent(), '2', 'off-screen and long unread posts retain their count');
        await student.reload();
        await classCard().waitFor();
        assert.equal(await classCard().locator('.group-unread').textContent(), '2', 'reads persist across reloads');

        const mobile = await newViewer(3, { width: 390, height: 844 }, 'reduce');
        assert.equal(await mobile.locator('.group-card[data-board-key="class:100"] .group-unread').textContent(), '3', 'a different student has independent unread state');
        assert.equal(await mobile.locator('.unread-pulse').first().evaluate(el => getComputedStyle(el).animationName), 'none');
        assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await capture(mobile, 'student-mobile-groups');
        await mobile.locator('.group-card[data-board-key="group:55"]').focus();
        await mobile.keyboard.press('Enter');
        await mobile.locator('.post-card').waitFor();
        await mobile.waitForFunction(() => readIds.has('201'));
        assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await capture(mobile, 'student-mobile-feed');
        await mobile.goBack();
        await mobile.locator('.group-card').first().waitFor();
        assert.equal(await mobile.locator('.group-card[data-board-key="group:55"] .group-unread').count(), 0);
        await mobile.goto(h.base + '/classboard/?board=group%3A56');
        await mobile.getByText('아직 올라온 글이 없습니다.', { exact: true }).waitFor();
        assert.equal(await mobile.locator('.group-select').inputValue(), 'group:56', 'notification deep links retain their destination');

        // A failed read write never clears the count; the visible item retries.
        await student.route('**/api/classboard/read', route => route.fulfill({ status: 503, body: '{}' }));
        await student.locator('.group-card[data-board-key="group:55"]').click();
        await student.waitForResponse(response => response.url().includes('/classboard/read') && response.status() === 503);
        await student.getByRole('button', { name: '그룹 목록', exact: true }).click();
        assert.equal(await student.locator('.group-card[data-board-key="group:55"] .group-unread').textContent(), '1');
        await student.unroute('**/api/classboard/read');

        // The received-notice feed can reach old unread items after page 1.
        const offsets = [];
        await student.route('**/api/notice/list?*', route => {
            const offset = Number(new URL(route.request().url()).searchParams.get('offset'));
            offsets.push(offset);
            const notices = Array.from({ length: offset === 0 ? 50 : 2 }, (_, i) => ({ id: String(offset + i + 1) }));
            return route.fulfill({ json: { notices, nextOffset: offset === 0 ? 50 : null } });
        });
        const noticeBoard = { key: 'notice:6-2-7', kind: 'notice', label: '가정통신문', typeLabel: '학교', child: { grade: 6, classNumber: 2, studentNumber: '7' } };
        await student.route('**/api/classboard/boards', async route => {
            const response = await route.fetch();
            const data = await response.json();
            return route.fulfill({ json: { ...data, boards: [...data.boards, noticeBoard] } });
        });
        await student.route('**/api/classboard/posts?board=notice*', route => route.fulfill({ json: {
            board: noticeBoard, posts: [], readIds: Array.from({ length: 52 }, (_, i) => String(i + 1))
        } }));
        await student.reload();
        await student.locator('.group-card[data-board-key="notice:6-2-7"]').click();
        await student.waitForFunction(() => document.querySelectorAll('.notice-card').length === 52);
        assert.deepEqual(offsets, [0, 50]);

        // No fake welcome copy and no responsive overflow on teacher controls.
        await teacher.setViewportSize({ width: 390, height: 844 });
        await teacher.locator('.group-card[data-board-key="class:100"]').click();
        await teacher.locator('#composerSection').waitFor();
        assert.equal(await teacher.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await capture(teacher, 'teacher-mobile-feed');
        assert.equal(await teacher.locator('h1, h2').count(), 0);
        assert.deepEqual(errors, []);
        console.log('Classboard browser: teacher/student group entry, partial reads, persistence, avatars, mobile, keyboard, reduced motion and failed writes OK');
    } finally { await browser?.close(); await h.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
