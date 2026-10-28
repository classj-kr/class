const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const source = fs.readFileSync(path.join(__dirname, '../learning/inquiry/math/stacking-cubes/sound.js'), 'utf8');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  try {
    const page = await browser.newPage();
    const rendered = [];
    for (const [kind, height] of [['add', 1], ['add', 6], ['erase', 1], ['undo', 1], ['clear', 1], ['success', 1], ['found', 1], ['retry', 1], ['save', 1], ['view', 1]]) {
      await page.goto('about:blank');
      await page.evaluate(() => {
        window.soundContext = new OfflineAudioContext(2, 96000, 48000);
        window.soundOutput = soundContext.createGain();
        soundOutput.connect(soundContext.destination);
        window.ClassGameSfx = { getAudioBus: () => ({ context: soundContext, output: soundOutput }) };
      });
      await page.addScriptTag({ content: source });
      const metrics = await page.evaluate(async ({ kind, height }) => {
        if (kind === 'success' || kind === 'found') {
          if (!StackingSounds.play('add', height)) throw new Error('Preceding cube sound did not start');
        }
        if (!StackingSounds.play(kind, height)) throw new Error('Sound did not start');
        const throttled = !StackingSounds.play(kind, height);
        const buffer = await soundContext.startRendering();
        let peak = 0, energy = 0, tail = 0, fanfareTail = 0, crossings = 0;
        const samples = buffer.getChannelData(0);
        for (let i = 0; i < samples.length; i++) {
          const sample = samples[i];
          if (!Number.isFinite(sample)) throw new Error('Invalid audio sample');
          peak = Math.max(peak, Math.abs(sample)); energy += sample * sample;
          if (i > 80000) tail = Math.max(tail, Math.abs(sample));
          if (i > 43200 && i < 52800) fanfareTail += sample * sample;
          if (i > 0 && samples[i - 1] < 0 && sample >= 0) crossings++;
        }
        ClassGameSfx.getAudioBus = () => null;
        const silentWhenMuted = !StackingSounds.play(kind);
        return { peak, rms: Math.sqrt(energy / samples.length), tail, fanfareTail, crossings, throttled, silentWhenMuted };
      }, { kind, height });
      assert.ok(metrics.peak > .05 && metrics.peak < 1, `${kind}: audible without clipping`);
      assert.ok(metrics.rms > .002, `${kind}: non-silent waveform (${metrics.rms})`);
      assert.equal(metrics.tail, 0, `${kind}: no sound left after the short envelope`);
      assert.ok(metrics.throttled && metrics.silentWhenMuted, `${kind}: mute and rapid duplicate protection`);
      if (kind === 'success') assert.ok(metrics.fanfareTail > .001, 'success fanfare lasts beyond the initial chime');
      rendered.push({ kind, height, ...metrics });
    }
    assert.ok(rendered[1].crossings > rendered[0].crossings, 'higher stacks have a higher pitch');
    console.log(JSON.stringify({ ok: true, rendered }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
