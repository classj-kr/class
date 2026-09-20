const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sfxPath = path.join(root, "assets", "sound", "game-sfx.js");
const sfxDir = path.join(root, "assets", "sound", "sfx");
const musicControlPath = path.join(root, "assets", "sound", "music-control.js");
const musicControlCssPath = path.join(root, "assets", "sound", "music-control.css");
const hubPath = path.join(root, "index.html");
const fruitBellPath = path.join(root, "learning", "games", "fruitbell", "fruitbell.html");
const voyagePath = path.join(root, "learning", "inquiry", "age-of-exploration", "public", "index.html");
const earTrainingPath = path.join(root, "learning", "arts", "music-theory", "ear-training", "index.html");
const earTrainingEnginePath = path.join(root, "learning", "arts", "music-theory", "ear-training", "piano-engine.js");
const arithmeticLayoutPath = path.join(root, "learning", "literacy-numeracy", "arithmetics", "app", "layout.tsx");
const sfxVersion = "20260912-feedback-scope-1";

for (const filePath of [sfxPath, musicControlPath, musicControlCssPath, hubPath, fruitBellPath, voyagePath]) {
    assert.ok(fs.existsSync(filePath), `Missing sound effect file: ${filePath}`);
}

const sfxSource = fs.readFileSync(sfxPath, "utf8");
new vm.Script(sfxSource, { filename: sfxPath });
const sharedSoundNames = [
    "select", "back", "bell", "card", "stone", "success",
    "error", "tick", "turn", "timeout",
];
for (const soundName of sharedSoundNames) {
    const filePath = path.join(sfxDir, `${soundName}.ogg`);
    assert.ok(fs.existsSync(filePath), `Missing file-backed ${soundName} sound.`);
    assert.ok(fs.statSync(filePath).size > 1_000, `${soundName}.ogg is unexpectedly small.`);
}
for (const soundName of ["click", "bell", "card", "stone", "success", "error", "tick"]) {
    assert.ok(sfxSource.includes(`${soundName}:`), `Missing synthesized fallback for ${soundName}.`);
}
assert.ok(sfxSource.includes("const soundUrls"), "Shared effects should resolve OGG asset URLs.");
assert.ok(sfxSource.includes("template.cloneNode()"), "Concurrent effects should use independent audio elements.");
assert.ok(sfxSource.includes("playSynth(soundName)"), "File playback failures should retain synthesized fallbacks.");
assert.ok(sfxSource.includes('if (soundName === "click") return playSynth(soundName);'), "Generic clicks should use the short synthesized tap sound.");
assert.ok(sfxSource.includes('element.matches("[data-midi]")'), "Playable MIDI keys should not add a generic click over their instrument sound.");
assert.ok(sfxSource.includes("[data-sfx-clicks='none']"), "Music interfaces should be able to suppress generic clicks without suppressing answer feedback.");
assert.ok(sfxSource.includes('latencyHint: "interactive"'), "Sound effects should request an interactive low-latency audio context.");
assert.ok(sfxSource.includes('document.addEventListener("pointerdown"'), "Pointer feedback should begin on pointerdown.");
assert.ok(sfxSource.includes("watchSemanticFeedback()"), "Shared effects should watch quiz feedback across learning pages.");
assert.ok(sfxSource.includes('outcomes.includes("error") ? "error"'), "Wrong-answer feedback should win when a quiz reveals both wrong and correct choices.");
assert.ok(sfxSource.includes("맞았습니다") && sfxSource.includes("다시 생각"), "Korean quiz feedback should map to success and error sounds.");
assert.ok(sfxSource.includes("아쉬워") && sfxSource.includes("아직 아니"), "Alternative Korean retry feedback should map to the error sound.");
assert.ok(sfxSource.includes("[id*='feedback' i]") && sfxSource.includes("[id*='result' i]"), "Feedback elements without a shared class should still be observed.");
assert.ok(sfxSource.includes("split(/[-_\\s]+/)"), "Compound state classes such as answer-wrong and is-correct should be recognized.");
assert.ok(sfxSource.includes("semanticSuppressedUntil"), "Custom sound controls should be able to suppress automatic semantic feedback.");
assert.ok(sfxSource.includes("[data-sfx-feedback='none']"), "Apps with explicit result sounds should be able to exclude their feedback subtree from automatic semantic sounds.");
assert.ok(sfxSource.includes('DEFAULT_VOLUME = 0.65;'), "Default SFX volume should be set to 65%.");

const musicControlSource = fs.readFileSync(musicControlPath, "utf8");
new vm.Script(musicControlSource, { filename: musicControlPath });
assert.ok(musicControlSource.includes('new URL("game-sfx.js", currentScript.src)'), "Music-enabled games should load the shared effect module.");
assert.ok(musicControlSource.includes('sfxScriptUrl.searchParams.set("v", "20260912-feedback-scope-1")'), "Music-enabled games should cache-bust the current shared effect module.");
assert.ok(musicControlSource.includes("classmusicchange"), "Music controls should publish the shared mute and volume state.");
assert.ok(musicControlSource.includes('id="musicVolumeSlider"'), "Shared music volume should use the compact linear slider.");
assert.ok(musicControlSource.includes('id="sfxVolumeSlider"'), "Shared effect volume should use the compact linear slider.");
assert.ok(musicControlSource.includes('step="0.01"'), "Shared audio sliders should adjust continuously.");
assert.ok(musicControlSource.includes('DEFAULT_MUSIC_VOLUME = 0.3'), "Default music volume for initial visitors should be 30%.");
assert.ok(musicControlSource.includes('DEFAULT_SFX_VOLUME = 0.65'), "Default SFX volume for initial visitors should be 65%.");
assert.ok(!musicControlSource.includes("unified-music-segment"), "The oversized segmented volume bar should not return.");

const musicControlCss = fs.readFileSync(musicControlCssPath, "utf8");
assert.ok(musicControlCss.includes(".unified-audio-slider"), "Shared audio controls need the compact linear slider styling.");
assert.ok(musicControlCss.includes("::-webkit-slider-thumb"), "Shared audio sliders need a draggable knob.");
assert.ok(!/@media[\s\S]*?\.unified-music-control\s*\{[^}]*display:\s*none/.test(musicControlCss), "Compact sliders should remain available on touch devices.");

const voyage = fs.readFileSync(voyagePath, "utf8");
assert.ok(voyage.includes('/assets/sound/music-control.js'), "World Voyage should load the complete shared sound menu.");
assert.ok(voyage.includes('window.ClassMusicController=backgroundMusic'), "Shared sound controls should control the regional music engine.");
assert.ok(!voyage.includes('id="bgmVolume"'), "World Voyage should not keep its old oversized volume slider.");

const hub = fs.readFileSync(hubPath, "utf8");
const gameLinks = [...hub.matchAll(/href="(learning\/games\/[^"]+)"/g)].map((match) => {
    const href = match[1].split(/[?#]/, 1)[0];
    return href.endsWith("/") ? `${href}index.html` : `${href}.html`;
});
assert.ok(gameLinks.length >= 15, "Expected the local game catalog in the hub.");
for (const relativePath of gameLinks) {
    const gameHtml = fs.readFileSync(path.join(root, ...relativePath.split("/")), "utf8");
    const hasSharedEffects = gameHtml.includes("assets/sound/game-sfx.js") || gameHtml.includes("assets/sound/music-control.js");
    assert.ok(hasSharedEffects, `${relativePath} does not load shared button effects.`);
}
for (const relativePath of ["learning/games/drawrelay/drawrelay.html", "learning/games/lastcard/lastcard.html"]) {
    const gameHtml = fs.readFileSync(path.join(root, ...relativePath.split("/")), "utf8");
    assert.ok(gameHtml.includes(`game-sfx.js?v=${sfxVersion}`), `${relativePath} should cache-bust the shared effects.`);
}

const earTraining = fs.readFileSync(earTrainingPath, "utf8");
const earTrainingEngine = fs.readFileSync(earTrainingEnginePath, "utf8");
const arithmeticLayout = fs.readFileSync(arithmeticLayoutPath, "utf8");
assert.ok(earTraining.includes('data-sfx-clicks="none"'), "Ear training should not mix generic button clicks into musical playback.");
assert.ok(earTraining.includes("piano-engine.js?v=20260910-countin-1"), "Ear training should load the stronger count-in without stale caching.");
assert.ok(earTrainingEngine.includes("strong ? .55 : .38") && earTrainingEngine.includes(".11, start + .003"), "The count-in transient and first-beat bell should remain clearly audible.");
assert.ok(arithmeticLayout.includes(`/assets/sound/game-sfx.js?v=${sfxVersion}`), "The proxied arithmetic and fraction app should load shared button effects directly.");
assert.ok(voyage.includes(`/assets/sound/game-sfx.js?v=${sfxVersion}`), "The proxied voyage app should load shared button effects directly.");

const fruitBell = fs.readFileSync(fruitBellPath, "utf8");
assert.ok(fruitBell.includes('id="bellBtn" class="bell" type="button" data-sfx="none"'), "The bell should not also play a generic click.");
assert.ok(fruitBell.includes('id="flipBtn" class="flip" data-sfx="none"'), "Fruit Bell should avoid the synthesized shared card effect.");
assert.ok(fruitBell.includes('playFruitSfx("bell");'), "Fruit Bell should play its recorded bell variants immediately.");
assert.ok(fruitBell.includes('state.sfxCue=makeSfxCue("flip"'), "Card sounds should follow the authoritative flip state.");
assert.ok(!fruitBell.includes("data:audio/wav;base64"), "Fruit Bell should not embed a large WAV data URL.");
assert.ok(!fruitBell.includes("createOscillator"), "Fruit Bell should not synthesize its dedicated effects with oscillators.");

console.log(`game-sfx-unit: ${gameLinks.length} local games keep the established click and load file-backed semantic effects`);
