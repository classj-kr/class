"use strict";
// Real Chromium decoding and OfflineAudioContext rendering; no production accounts.
const fs = require("node:fs"), path = require("node:path"), http = require("node:http");
const assert = require("node:assert/strict");
const { chromium } = require("../game-hub-server/node_modules/playwright");
const root = path.resolve(__dirname, ".."), out = path.join(root, "outputs/sound-audit-2026-10-09");
fs.mkdirSync(out, { recursive: true });
const report = { synthesized: [], files: [], controls: [], events: [], mixes: [] };
const shared = fs.readFileSync(path.join(root, "assets/sound/game-sfx.js"), "utf8");
const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/sound-test") return res.end("<!doctype html><body></body>");
    const file = path.resolve(root, "." + decodeURIComponent(url.pathname));
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(file, (error, data) => {
        if (error) return res.writeHead(404).end();
        res.setHeader("Content-Type", ({ ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".ogg": "audio/ogg", ".m4a": "audio/mp4" })[path.extname(file)] || "application/octet-stream");
        res.end(data);
    });
});
function writeWav(file, samples) {
    const b = Buffer.alloc(44 + samples.length * 2);
    b.write("RIFF"); b.writeUInt32LE(b.length - 8, 4); b.write("WAVEfmt ", 8);
    b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
    b.writeUInt32LE(48000, 24); b.writeUInt32LE(96000, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
    b.write("data", 36); b.writeUInt32LE(samples.length * 2, 40);
    samples.forEach((n, i) => b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, n)) * 32767), 44 + i * 2));
    fs.writeFileSync(file, b);
}
async function main() {
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    try {
        // Render the production recipes, including every missing-file fallback.
        for (const name of ["click", "select", "back", "bell", "card", "stone", "success", "error", "tick", "turn", "timeout", "capture", "explosion"]) {
            const page = await browser.newPage(); await page.goto(origin + "/sound-test");
            const result = await page.evaluate(async ({ source, name }) => {
                let seed = 4729; Math.random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 4294967296);
                const ctx = new OfflineAudioContext(1, 96000, 48000);
                window.AudioContext = function () { return ctx; }; window.Audio = undefined;
                localStorage.setItem("classSfxVolumeValue", "1");
                (0, eval)(source); ClassGameSfx.play(name);
                const data = (await ctx.startRendering()).getChannelData(0);
                let peak = 0, sum = 0, last = 0, clipped = 0;
                for (let i = 0; i < data.length; i++) {
                    peak = Math.max(peak, Math.abs(data[i])); sum += data[i] ** 2;
                    if (Math.abs(data[i]) > 0.001) last = i / 48000;
                    if (Math.abs(data[i]) >= 1) clipped++;
                }
                return { name, peak, rms: Math.sqrt(sum / data.length), lastAudibleSecond: last, clipped, samples: name === "explosion" ? Array.from(data) : null };
            }, { source: shared, name });
            assert.ok(result.peak > 0.001 && result.peak < 1, JSON.stringify({ ...result, samples: null }));
            assert.equal(result.clipped, 0); assert.ok(result.lastAudibleSecond < 1.8);
            if (result.samples) writeWav(path.join(out, "bomb77-explosion-fallback.wav"), result.samples);
            delete result.samples; report.synthesized.push(result); await page.close();
        }
        console.log("PASS 13 synthesized effects: actual signal, headroom and tail");

        // Mute/zero suppress new audio; a mute during an explosion fades its existing tail.
        for (const mode of ["stored-zero", "stored-muted", "live-mute"]) {
            const page = await browser.newPage(); await page.goto(origin + "/sound-test");
            const result = await page.evaluate(async ({ source, mode }) => {
                const ctx = new OfflineAudioContext(1, 96000, 48000);
                window.AudioContext = function () { return ctx; }; window.Audio = undefined;
                if (mode === "stored-zero") localStorage.setItem("classSfxVolumeValue", "0");
                if (mode === "stored-muted") localStorage.setItem("classSfxMuted", "true");
                (0, eval)(source);
                const played = ClassGameSfx.play("explosion");
                if (mode === "live-mute") ctx.suspend(0.1).then(() => { ClassGameSfx.setMuted(true); ctx.resume(); });
                const data = (await ctx.startRendering()).getChannelData(0);
                const tail = data.slice(mode === "live-mute" ? 12000 : 0);
                return { mode, played, tailPeak: tail.reduce((peak, x) => Math.max(peak, Math.abs(x)), 0) };
            }, { source: shared, mode });
            assert.ok(result.tailPeak < 0.000001, JSON.stringify(result));
            if (mode !== "live-mute") assert.equal(result.played, false);
            report.controls.push(result); await page.close();
        }

        // Every deployed shared/game audio file must decode, contain audio and be finite.
        const files = [];
        function collect(dir) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) collect(p); else if (/\.(ogg|m4a|mp3|wav)$/i.test(p)) files.push(p); } }
        collect(path.join(root, "assets/sound")); collect(path.join(root, "learning/games"));
        const decoder = await browser.newPage(); await decoder.goto(origin + "/sound-test");
        for (const file of files) {
            const url = "/" + path.relative(root, file).split(path.sep).join("/");
            const result = await decoder.evaluate(async url => {
                window.decodeCtx ||= new AudioContext();
                const response = await fetch(url); if (!response.ok) throw Error(`${response.status}: ${url}`);
                const buffer = await decodeCtx.decodeAudioData(await response.arrayBuffer());
                let peak = 0, sum = 0, clipped = 0, nonfinite = 0;
                for (let c = 0; c < buffer.numberOfChannels; c++) {
                    const a = buffer.getChannelData(c);
                    for (let i = 0; i < a.length; i++) { const x = a[i]; if (!Number.isFinite(x)) nonfinite++; peak = Math.max(peak, Math.abs(x)); sum += x*x; if (Math.abs(x) >= 1) clipped++; }
                }
                const count = buffer.length * buffer.numberOfChannels;
                return { url, duration: buffer.duration, peak, rms: Math.sqrt(sum / count), clippingFraction: clipped / count, nonfinite };
            }, url);
            assert.ok(result.peak > 0, url); assert.equal(result.nonfinite, 0, url);
            report.files.push(result);
            console.log(`decoded ${report.files.length}/${files.length} ${url}`);
        }
        await decoder.addScriptTag({ url: origin + '/learning/games/bomb77/music.js' });
        const mixes = await decoder.evaluate(async () => {
            const musicGain = Number(document.getElementById('bgm').dataset.musicGain);
            const decode = async url => decodeCtx.decodeAudioData(await (await fetch(url)).arrayBuffer());
            const effect = await decode('/assets/sound/sfx/explosion.ogg');
            const results = [];
            for (const name of ['stone-road-time.m4a', 'midnight-pulse.m4a']) {
                const music = await decode('/learning/games/bomb77/assets/sound/' + name);
                for (const [musicLevel, effectLevel] of [[0.3, 0.65], [1, 1]]) {
                    let peak = 0, clipped = 0, weakestEffectDb = Infinity;
                    for (let offset = 0; offset < music.duration - effect.duration; offset += 0.5) {
                        let me = 0, se = 0;
                        for (let c = 0; c < music.numberOfChannels; c++) {
                            const m = music.getChannelData(c), s = effect.getChannelData(0);
                            const start = Math.floor(offset * music.sampleRate);
                            for (let i = 0; i < s.length; i++) {
                                const a = m[start + i] * musicLevel * musicGain, b = s[i] * effectLevel, x = a + b;
                                peak = Math.max(peak, Math.abs(x)); if (Math.abs(x) >= 1) clipped++;
                                me += a*a; se += b*b;
                            }
                        }
                        weakestEffectDb = Math.min(weakestEffectDb, 10 * Math.log10(se / Math.max(1e-15, me)));
                    }
                    results.push({ track: name, musicGain, musicLevel, effectLevel, peak, clipped, weakestEffectDb });
                }
                const sample = new Float32Array(8 * 48000);
                const m = music.getChannelData(0), s = effect.getChannelData(0);
                for (let i = 0; i < sample.length; i++) sample[i] = m[i + 15 * 48000] * 0.3 * musicGain;
                for (const second of [2, 4, 6]) for (let i = 0; i < s.length; i++) sample[second * 48000 + i] += s[i] * 0.65;
                results.push({ track: name, preview: Array.from(sample) });
            }
            return results;
        });
        for (const mix of mixes) {
            if (mix.preview) writeWav(path.join(out, mix.track.replace('.m4a', '-mix.wav')), mix.preview);
            else { report.mixes.push(mix); assert.equal(mix.clipped, 0, JSON.stringify(mix)); }
        }
        await decoder.close();

        // File effects keep per-sound headroom as the slider changes, and mute cancels them.
        const fruit = await browser.newPage();
        await fruit.addInitScript(() => {
            window.CLASS_PLAYER_NAME = "검증가람";
            window.effectFiles = [];
            const play = HTMLMediaElement.prototype.play;
            HTMLMediaElement.prototype.play = function () {
                if (this.src.includes("/sfx/")) effectFiles.push(this);
                return play.call(this);
            };
        });
        await fruit.goto(origin + "/learning/games/fruitbell/fruitbell.html");
        await fruit.waitForFunction(() => window.ClassGameSfx?.playFile);
        const fruitResult = await fruit.evaluate(async () => {
            ClassGameSfx.setMuted(false); ClassGameSfx.setVolume(0.5);
            playFruitSfx("bell"); const initialVolume = effectFiles[0].volume;
            ClassGameSfx.setVolume(0.25); const changedVolume = effectFiles[0].volume;
            playFruitSfx("collect", { delay: 50 }); ClassGameSfx.setMuted(true);
            await new Promise(resolve => setTimeout(resolve, 100));
            const countAfterMute = effectFiles.length, paused = effectFiles.every(a => a.paused);
            setMusicLevel(5); // Changing music must not unmute effects.
            playFruitSfx("bell");
            return { initialVolume, changedVolume, countAfterMute, paused, stillMuted: ClassGameSfx.isMuted(), countAfterMusic: effectFiles.length };
        });
        assert.equal(fruitResult.initialVolume, 0.4); assert.equal(fruitResult.changedVolume, 0.2);
        assert.equal(fruitResult.countAfterMute, 1); assert.equal(fruitResult.countAfterMusic, 1);
        assert.ok(fruitResult.paused && fruitResult.stillMuted);
        report.controls.push({ game: "fruitbell", ...fruitResult }); await fruit.close();

        for (const rejection of ["AbortError", "NotAllowedError"]) {
            const page = await browser.newPage(); await page.goto(origin + "/sound-test");
            const count = await page.evaluate(async ({ source, rejection }) => {
                let count = 0; const Native = AudioContext;
                window.AudioContext = function () { count++; return new Native(); };
                HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException("expected test rejection", rejection));
                (0, eval)(source); ClassGameSfx.play("card");
                await new Promise(resolve => setTimeout(resolve, 0)); return count;
            }, { source: shared, rejection });
            assert.equal(count, 0, `No unexpected synth fallback after ${rejection}`);
            report.controls.push({ rejection, fallbackContexts: count }); await page.close();
        }

        // The real pages' custom sound functions must use a single shared AudioContext.
        for (const [game, calls] of [
            ["hanoitower", ["playSound(1)", "playSound(8)"]],
            ["coinweighing", ["playCoinSound()"]],
            ["setgame", ["playTapSound(true, 1)", "playSuccessSound()", "playFailSound()"]],
            ["nimgame", ["playGemSelectSound(true, 2)"]],
            ["expedition", ["ExpeditionSfx.play('hazard2')", "ExpeditionSfx.play('wipe')"]]
        ]) {
            const page = await browser.newPage();
            await page.addInitScript(() => {
                window.CLASS_PLAYER_NAME = "검증가람";
                const Native = window.AudioContext; window.contexts = []; window.oscillators = 0; window.directOutputs = 0;
                window.AudioContext = class extends Native { constructor(...args) { super(...args); contexts.push(this); } };
                const osc = BaseAudioContext.prototype.createOscillator;
                BaseAudioContext.prototype.createOscillator = function () { oscillators++; return osc.call(this); };
                const connect = AudioNode.prototype.connect;
                AudioNode.prototype.connect = function (destination, ...args) { if (destination instanceof AudioDestinationNode && !(this instanceof DynamicsCompressorNode)) directOutputs++; return connect.call(this, destination, ...args); };
            });
            await page.goto(`${origin}/learning/games/${game}/${game}.html`, { waitUntil: "load" });
            await page.waitForFunction(() => window.ClassGameSfx?.getAudioBus);
            const result = await page.evaluate(calls => {
                ClassGameSfx.setMuted(false); ClassGameSfx.setVolume(0.5);
                const before = oscillators; for (const call of calls) (0, eval)(call);
                const after = oscillators; ClassGameSfx.setMuted(true);
                for (const call of calls) (0, eval)(call);
                const mutedCount = oscillators; ClassGameSfx.setMuted(false); ClassGameSfx.setVolume(0);
                for (const call of calls) (0, eval)(call);
                return { before, after, mutedCount, zeroCount: oscillators, contexts: contexts.length, directOutputs };
            }, calls);
            assert.ok(result.after > result.before, game); assert.equal(result.mutedCount, result.after, game); assert.equal(result.zeroCount, result.after, game);
            assert.equal(result.contexts, 1, game); assert.equal(result.directOutputs, 0, game);
            report.controls.push({ game, ...result });
            if (game === 'nimgame') {
                for (const mode of ['nim', 'coin']) {
                    await page.evaluate(mode => {
                        Object.assign(state, { mode, nimRows: [1, 3, 5], coinTotal: 12, coinTaken: 0, currentPlayer: 1, started: true, over: false });
                        myRole = 'host'; selection = { row: null, count: 0 };
                        showGameScreen(); renderStage(); ClassGameSfx.setMuted(false); ClassGameSfx.setVolume(0.65);
                    }, mode);
                    const before = await page.evaluate(() => oscillators);
                    await page.locator(mode === 'nim' ? '.gem:not(:disabled)' : '.coin:not(:disabled)').last().click();
                    assert.equal(await page.evaluate(before => oscillators - before, before), 3, 'Only three crystal partials, no extra click oscillator');
                    report.events.push(`nimgame ${mode}: pointer selection has no generic click overlay`);
                }
            }
            await page.close(); console.log(`PASS ${game} shared mute/volume/context`);
        }

        // Inject only access to the private functions; production state/render logic is unchanged.
        const bomb = await browser.newPage();
        await bomb.route("**/bomb77/game.js*", route => route.fulfill({ contentType: "text/javascript", body: fs.readFileSync(path.join(root, "learning/games/bomb77/game.js"), "utf8").replace('window.addEventListener("DOMContentLoaded", init);', 'window.soundFixture = { installState, previewState };') }));
        await bomb.goto(origin + "/learning/games/bomb77/bomb77.html?preview=1");
        await bomb.waitForFunction(() => window.ClassGameSfx && window.soundFixture);
        await bomb.evaluate(() => {
            window.played = []; const play = ClassGameSfx.play;
            ClassGameSfx.play = name => { played.push(name); return play(name); };
            const state = soundFixture.previewState(); state.lastEvent = { exploded: true }; state.actionNumber = 5;
            soundFixture.installState(state); // Reconnect/initial snapshot: silent.
        });
        assert.deepEqual(await bomb.evaluate(() => played), []);
        await bomb.evaluate(() => { const s = soundFixture.previewState(); s.lastEvent = { exploded: true }; s.actionNumber = 6; soundFixture.installState(s); soundFixture.installState(structuredClone(s)); });
        assert.deepEqual(await bomb.evaluate(() => played), ["explosion"]);
        await bomb.evaluate(() => { played.length = 0; ClassGameSfx.setMuted(false); ClassGameSfx.setVolume(0.65); });
        await bomb.locator("#hand [data-card-id]").first().click();
        assert.deepEqual(await bomb.evaluate(() => played), ["card"]);
        report.events.push("initial snapshot silent", "one explosion per action", "one card effect per selection");
        await bomb.evaluate(() => {
            localStorage.setItem("classSfxVolumeValue", "0");
            localStorage.setItem("classSfxMuted", "0");
        });
        await bomb.reload(); await bomb.waitForFunction(() => window.ClassGameSfx?.getAudioBus);
        assert.equal(await bomb.evaluate(() => ClassGameSfx.getAudioBus()), null, "music controls preserve stored zero on reload");
        report.controls.push({ game: "bomb77", storedZeroAfterReload: true });
        await bomb.close();
        console.log("PASS bomb77 state replay and click overlap");
    } finally {
        fs.writeFileSync(path.join(out, "verification.json"), JSON.stringify(report, null, 2));
        await browser.close(); await new Promise(resolve => server.close(resolve));
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
