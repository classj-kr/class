'use strict';
// Local fixtures use the real race API and shared controls without production accounts.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createTypingRace } = require('../game-hub-server/typing-race');
const { createRoomCodes } = require('../game-hub-server/room-codes');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/typing-settings');
const typingPath = '/learning/inquiry/information-computing/typing/';

async function screenshot(page, name) {
  fs.mkdirSync(output, { recursive: true });
  // Let fixed controls repaint after resizing or scrolling before capturing.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const png = await page.screenshot({ fullPage: true, animations: 'disabled' });
  execFileSync('python', ['-c', [
    'import io, sys',
    'from PIL import Image, ImageChops',
    'original = Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA")',
    'original.save(sys.argv[1], "WEBP", lossless=True, exact=True)',
    'saved = Image.open(sys.argv[1]).convert("RGBA")',
    'assert original.size == saved.size',
    'assert ImageChops.difference(original, saved).getbbox() is None',
  ].join('\n'), path.join(output, name + '.webp')], { input: png });
}

async function main() {
  const app = express();
  app.use(express.json());
  app.get('/api/me/storage/:app', (_, res) => res.status(401).json({ error: 'guest' }));
  app.get('/api/student/profile', (_, res) => res.json({ profile: null }));
  app.get('/api/home-content-access', (_, res) => res.json({ globallyDisabledPaths: [] }));
  const platform = {
    roomCodes: createRoomCodes({ isActive: async e => race.hasRoomCode(e.code) }),
    isTeacherRequest: async () => false,
    isContentGloballyDisabled: async () => false,
    canBypassGlobalContentLock: async () => false,
    displayNameFor: async req => ({ name: decodeURIComponent(req.get('x-name') || '가람') }),
  };
  const race = createTypingRace({ platform });
  app.use('/api/typing-race', race.router);
  app.get('/settings-sfx', (_, res) => res.send('<!doctype html><html lang="ko"><body><script src="/assets/sound/music-control.js" data-sfx-controls></script></body></html>'));
  app.get('/settings-external', (_, res) => res.send('<!doctype html><html lang="ko"><body><script>window.ClassMusicController={setVolume(value){this.volume=value},setMuted(value){this.muted=value},unlock(){this.unlocked=true}}</script><script src="/assets/sound/music-control.js"></script></body></html>'));
  app.use(express.static(root));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + typingPath);
    const open = async () => page.getByRole('button', { name: '설정 열기', exact: true }).click();
    const setVolume = async (id, value) => page.locator(id).evaluate((el, next) => {
      el.value = next;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, String(value));
    await open();
    await setVolume('#musicVolumeSlider', 0.27);
    await setVolume('#sfxVolumeSlider', 0.42);
    assert.equal(await page.locator('#musicVolumeValue').innerText(), '27%');
    assert.equal(await page.locator('#sfxVolumeValue').innerText(), '42%');
    assert.equal(await page.locator('#bgm').evaluate(el => el.volume), 0.27);
    await page.locator('#musicMuteBtn').click();
    assert.equal(await page.locator('#bgm').evaluate(el => el.muted), true);
    assert.equal(await page.locator('#musicVolumeSlider').inputValue(), '0');
    await page.locator('#musicMuteBtn').click();
    assert.equal(await page.locator('#musicVolumeSlider').inputValue(), '0.27');
    await page.locator('#sfxMuteBtn').click();
    assert.equal(await page.evaluate(() => ClassGameSfx.getAudioBus()), null);
    await page.locator('#sfxMuteBtn').click();
    assert.equal(await page.evaluate(() => ClassGameSfx.getAudioBus().output.gain.value > 0), true);
    await page.locator('.unified-settings-help summary').click();
    assert.match(await page.locator('.unified-settings-help').innerText(), /자리 익히기/);
    await screenshot(page, 'practice-settings-desktop');
    await page.locator('#settingsFullscreen').click();
    await page.waitForFunction(() => Boolean(document.fullscreenElement));
    await page.locator('#settingsFullscreen').click();
    await page.waitForFunction(() => !document.fullscreenElement);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.unified-audio-panel').isVisible(), false);
    assert.equal(await page.locator('.unified-audio-menu-toggle').evaluate(el => el === document.activeElement), true);
    await page.getByRole('button', { name: '자리 익히기', exact: true }).click();
    const guideCount = await page.locator('#guideCount').innerText();
    await open();
    await page.locator('#musicVolumeSlider').focus();
    await page.keyboard.press('f');
    assert.equal(await page.locator('#guideCount').innerText(), guideCount, 'settings keys must not answer the typing lesson');
    await page.reload();
    await open();
    assert.equal(await page.locator('#musicVolumeSlider').inputValue(), '0.27');
    assert.equal(await page.locator('#sfxVolumeSlider').inputValue(), '0.42');
    await page.locator('.unified-audio-menu-toggle').click();
    await page.getByRole('link', { name: '🏁 순위전' }).click();
    await page.locator('[data-settings="create"] .option').first().waitFor();
    assert.equal(await page.getByRole('heading', { name: '타자 RACE', exact: true }).count(), 1);
    assert.doesNotMatch(await page.locator('#entryScreen').innerText(), /새 레이스 열기|타자 레이스/);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const motion = await page.locator('.keycaps i').evaluateAll(caps => caps.map(cap => {
      const animation = cap.getAnimations()[0];
      return { state: animation.playState, duration: animation.effect.getTiming().duration, delay: animation.effect.getTiming().delay };
    }));
    assert.equal(motion.length, 6);
    assert.ok(motion.every(animation => animation.state === 'running' && animation.duration === 1800));
    assert.equal(new Set(motion.map(animation => animation.delay)).size, 6);
    await page.waitForFunction(() => [...document.querySelectorAll('.keycaps i')].some(cap => {
      const transform = getComputedStyle(cap).transform;
      return transform !== 'none' && new DOMMatrix(transform).m42 < -2;
    }));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('#createPanel').getByRole('button', { name: '팀전', exact: true }).click();
    assert.doesNotMatch(await page.locator('#createPanel').innerText(), /평균|팀 점수 합계/);
    await screenshot(page, 'race-entry-desktop');
    await open();
    // 순위전은 공용 순위전 음악(race-music.js)을 쓰고, 방 만들기 화면은 대기 곡이다.
    const raceAudio = page.locator('audio[data-race-music]');
    assert.equal(await raceAudio.evaluate(el => el.volume), 0.27);
    assert.match(await raceAudio.getAttribute('src'), /\/assets\/sound\/race-music\/lobby-brisk-pursuit\.ogg$/);
    assert.equal(await page.locator('#sfxVolumeSlider').inputValue(), '0.42');
    await page.locator('h1').click();
    assert.equal(await page.locator('.unified-audio-panel').isVisible(), false);
    const created = page.waitForResponse(r => r.url().endsWith('/api/typing-race/rooms') && r.request().method() === 'POST');
    await page.locator('#createButton').click();
    const room = await (await created).json();
    assert.equal(room.state.config.teamScore, 'sum');
    await page.locator('#teamColumns').waitFor();
    assert.doesNotMatch(await page.locator('[data-settings="lobby"]').innerText(), /평균/);
    await open();
    await page.locator('#sfxMuteBtn').click();
    assert.equal(await page.evaluate(() => ClassGameSfx.getAudioBus()), null, 'race tones share the muted output bus');
    await page.locator('#sfxMuteBtn').click();
    await setVolume('#sfxVolumeSlider', 0.19);
    await page.waitForFunction(() => Math.abs(ClassGameSfx.getAudioBus().output.gain.value - 0.19) < 0.005);
    await page.locator('.unified-audio-menu-toggle').click();
    await page.goto(origin + typingPath + 'race/');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#createPanel').getByRole('button', { name: '팀전', exact: true }).click();
    await page.evaluate(() => scrollTo(0, 0));
    assert.ok((await page.locator('.unified-audio-menu-toggle').boundingBox()).y >= 0);
    await screenshot(page, 'race-entry-mobile');
    await open();
    await screenshot(page, 'race-settings-mobile');
    const panelBox = await page.locator('.unified-audio-panel').boundingBox();
    assert.ok(panelBox.x >= 0 && panelBox.x + panelBox.width <= 390);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.goto(origin + '/settings-sfx');
    await open();
    assert.equal(await page.locator('#musicVolumeSlider').isVisible(), false);
    assert.equal(await page.locator('#sfxVolumeSlider').isVisible(), true);
    await page.goto(origin + '/settings-external');
    await open();
    await setVolume('#musicVolumeSlider', 0.36);
    assert.equal(await page.evaluate(() => ClassMusicController.volume), 0.36);
    await page.locator('#musicMuteBtn').click();
    assert.equal(await page.evaluate(() => ClassMusicController.muted), true);
    assert.deepEqual(errors, []);
    console.log('PASS: volumes, mute, persistence, fullscreen, help, keyboard dismissal, race creation, totals, shared race audio, mobile layout, effects-only controls.');
    console.log('Lossless WebP captures: ' + output);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
