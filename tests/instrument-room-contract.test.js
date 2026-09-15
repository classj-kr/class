const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', 'learning', 'arts', 'instrument-room');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const worklet = fs.readFileSync(path.join(root, 'instrument-worklet-v2.js'), 'utf8');
const detailSource = fs.readFileSync(path.join(root, 'instrument-details.js'), 'utf8');
const koreanPercussionSource = fs.readFileSync(path.join(root, 'korean-percussion-data.js'), 'utf8');
const drumSplitSource = fs.readFileSync(path.join(__dirname, '..', 'tools', 'split_drum_grid_ogg.py'), 'utf8');
const detailContext = { window: {} };
require('node:vm').createContext(detailContext);
require('node:vm').runInContext(detailSource, detailContext);
const instrumentDetails = detailContext.window.INSTRUMENT_DETAILS;
const koreanContext = { window: {} };
require('node:vm').createContext(koreanContext);
require('node:vm').runInContext(koreanPercussionSource, koreanContext);
const koreanPercussion = koreanContext.window.KOREAN_PERCUSSION_DATA;

test('corrects guitar and bass artwork orientation in the stage and detail views', () => {
  assert.match(css, /\.stage-bass \.instrument-artwork, \.stage-guitar \.instrument-artwork \{[^}]*scale: -1 1;/);
  assert.match(css, /\.detail-artwork-frame > img\.corrected-handedness \{ scale: -1 1; \}/);
  assert.match(app, /elements\.detailArtwork\.classList\.toggle\("corrected-handedness"/);
});

test('keeps the instrument details button inside the control panel flow', () => {
  assert.match(html, /<aside class="control-panel"[^>]*>[\s\S]*?<div class="console-head">[\s\S]*?id="instrumentInfoButton"/);
  assert.match(css, /\.control-panel \{[^}]*display: grid;[^}]*grid-template-rows: auto minmax\(0,1fr\);/);
  assert.doesNotMatch(css, /\.instrument-info-button \{ position: fixed;/);
});
test('uses dedicated rooms for the nine primary instrument groups', () => {
  for (const family of ['keyboard', 'guitar', 'bass', 'drums', 'strings', 'woodwind', 'brass', 'percussion', 'korean']) {
    assert.match(html, new RegExp(`data-family="${family}"`));
  }
});

test('orders instrument families from Korean traditions to keyboard instruments', () => {
  const order = ['korean', 'strings', 'woodwind', 'brass', 'percussion', 'drums', 'bass', 'guitar', 'keyboard'];
  const positions = order.map((family) => html.indexOf('data-family="' + family + '"'));
  assert.equal(positions.every((position) => position >= 0), true);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.match(html, /class="active"[^>]*data-family="korean"[^>]*aria-selected="true"/);
  assert.match(app, /selectFamily\("korean"\)/);
});

test('keeps the instrument header compact and hides normal audio status', () => {
  assert.doesNotMatch(html, /LOCAL PHYSICAL INSTRUMENTS|level-bars/);
  assert.doesNotMatch(app, /소리 준비됨/);
  assert.match(html, /id="audioButton"[^>]*>소리 켜기<\/button>/);
  assert.match(css, /\.topbar \{ position: fixed;/);
  assert.match(app, /audioButton\.classList\.add\("hidden"\)/);
  assert.match(app, /audioButton\.classList\.remove\("hidden"\)/);
});

test('keyboard library matches the twelve supplied keyboard instruments', () => {
  for (const model of [
    'concert-grand', 'upright-piano', 'harpsichord', 'tine-ep', 'reed-ep', 'clavinet',
    'fm-dx7', 'jd800', 'hybrid-la-rhodes', 'hybrid-la-mks', 'hammond-organ', 'pipe-organ'
  ]) {
    assert.match(app, new RegExp(`id: "${model}"`));
  }
  assert.match(app, /AP · ACOUSTIC/);
  assert.match(app, /EP · TINE/);
  assert.match(app, /HYBRID · LA/);
  assert.match(app, /ORGAN · TONEWHEEL/);
});

test('keyboard models use compact per-note Ogg multisamples with recorded range metadata', () => {
  const fullRange = ['concert-grand', 'upright-piano', 'fender-rhodes', 'wurlitzer', 'clavinet', 'fm-dx7', 'jd800', 'hybrid-la-rhodes', 'hybrid-la-mks'];
  for (const folder of fullRange) {
    const sampleRoot = path.join(root, 'assets', 'audio', folder);
    const samples = fs.readdirSync(sampleRoot).filter((name) => name.endsWith('.ogg')).sort();
    const totalBytes = samples.reduce((sum, name) => sum + fs.statSync(path.join(sampleRoot, name)).size, 0);
    assert.equal(samples.length, 88, folder);
    assert.equal(samples[0], '001_a0.ogg', folder);
    assert.equal(samples.at(-1), '088_c8.ogg', folder);
    assert.ok(totalBytes < 6 * 1024 * 1024, folder);
  }
  for (const [folder, count, first, last] of [
    ['harpsichord', 39, '028_c3.ogg', '066_d6.ogg'],
    ['hammond-organ', 61, '016_c2.ogg', '076_c7.ogg'],
    ['pipe-organ', 61, '016_c2.ogg', '076_c7.ogg']
  ]) {
    const sampleRoot = path.join(root, 'assets', 'audio', folder);
    const samples = fs.readdirSync(sampleRoot).filter((name) => name.endsWith('.ogg')).sort();
    const totalBytes = samples.reduce((sum, name) => sum + fs.statSync(path.join(sampleRoot, name)).size, 0);
    assert.equal(samples.length, count, folder);
    assert.equal(samples[0], first, folder);
    assert.equal(samples.at(-1), last, folder);
    assert.ok(totalBytes < 6 * 1024 * 1024, folder);
  }
  assert.match(app, /fileMin: 21/);
  assert.match(app, /GRAND_SAMPLE_STEP = 1/);
  assert.match(app, /KEYBOARD_SAMPLE_CACHE_LIMIT = 112/);
  assert.match(app, /range: \[21, 108\]/);
  assert.match(app, /state\.family === "keyboard"/);
  assert.match(app, /const first = state\.keyboardStartMidi/);
});

test('plucked keyboards decay without an ADSR sustain stage', () => {
  assert.match(app, /sampleSet === "clavinet"/);
  assert.match(app, /sampleSet === "harpsichord"/);
  assert.match(app, /gain\.gain\.exponentialRampToValueAtTime\(\.0001, now \+ decay\)/);
  assert.match(app, /NO_PIANO_SUSTAIN_MODELS = new Set\(\["harpsichord", "clavinet", "hammond-organ", "pipe-organ"\]\)/);
  assert.match(app, /event\.code === "Space" && supportsPianoSustain\(\)/);
});
test('haegeum uses the exact 25-note recorded range without synthetic extension', () => {
  const sampleRoot = path.join(root, 'assets', 'audio', 'haegeum');
  const samples = fs.readdirSync(sampleRoot).filter((name) => name.endsWith('.ogg')).sort();
  const totalBytes = samples.reduce((sum, name) => sum + fs.statSync(path.join(sampleRoot, name)).size, 0);
  assert.equal(samples.length, 25);
  assert.equal(samples[0], '035_g3.ogg');
  assert.equal(samples.at(-1), '059_g5.ogg');
  assert.ok(totalBytes < 4 * 1024 * 1024);
  assert.match(app, /"haegeum": Object\.freeze\(\{ id: "haegeum", root: "assets\/audio\/haegeum\/", min: 55, max: 79/);
  assert.match(app, /gainDb: -1\.46, startOffset: 0, loopStart: 1\.1, loopEnd: 3\.85/);
  assert.match(app, /Number\.isFinite\(sampleConfig\.startOffset\)/);
  assert.match(app, /id: "haegeum"[\s\S]*?range: \[55, 79\][\s\S]*?badge: "2 ARTICULATIONS"/);
  assert.match(app, /state\.articulation === "vibrato" \? "haegeum-vibrato" : "haegeum"/);
});
test('daegeum switches between complete basic and vibrato multisample sets', () => {
  for (const folder of ['daegeum', 'daegeum-vibrato']) {
    const sampleRoot = path.join(root, 'assets', 'audio', folder);
    const samples = fs.readdirSync(sampleRoot).filter((name) => name.endsWith('.ogg')).sort();
    const totalBytes = samples.reduce((sum, name) => sum + fs.statSync(path.join(sampleRoot, name)).size, 0);
    assert.equal(samples.length, 31, folder);
    assert.equal(samples[0], '039_b3.ogg', folder);
    assert.equal(samples.at(-1), '069_f6.ogg', folder);
    assert.ok(totalBytes < 6 * 1024 * 1024, folder);
  }
  assert.match(app, /"daegeum": Object\.freeze\(\{ id: "daegeum", root: "assets\/audio\/daegeum\/", min: 59, max: 89/);
  assert.match(app, /"daegeum-vibrato": Object\.freeze\(\{ id: "daegeum-vibrato", root: "assets\/audio\/daegeum-vibrato\/", min: 59, max: 89/);
  assert.match(app, /state\.articulation === "vibrato" \? "daegeum-vibrato" : "daegeum"/);
  assert.match(app, /id: "daegeum"[\s\S]*?range: \[59, 89\][\s\S]*?badge: "31-NOTE · 2 ARTICULATIONS"/);
  assert.match(app, /\[\["sustain", "기본음"\], \["vibrato", "비브라토"\]\]/);
  assert.match(app, /"haegeum", "haegeum-vibrato", "daegeum", "daegeum-vibrato"/);
});
test('new Korean melodic recordings expose their exact ranges and techniques', () => {
  for (const [folder, count, first, last] of [
    ['haegeum-vibrato', 21, '039_b3.ogg', '059_g5.ogg'],
    ['hyangpiri', 19, '039_b3.ogg', '057_f5.ogg'],
    ['hyangpiri-vibrato', 19, '039_b3.ogg', '057_f5.ogg'],
    ['taepyeongso', 22, '048_gs4.ogg', '069_f6.ogg'],
    ['gayageum-sanjo', 35, '023_g2.ogg', '057_f5.ogg'],
    ['gayageum-sanjo-slow-vibrato', 35, '023_g2.ogg', '057_f5.ogg'],
    ['gayageum-sanjo-fast-vibrato', 35, '023_g2.ogg', '057_f5.ogg'],
    ['gayageum-sanjo-roll', 35, '023_g2.ogg', '057_f5.ogg'],
    ['gayageum-sanjo-bend-down', 35, '023_g2.ogg', '057_f5.ogg'],
    ['gayageum-sanjo-bend-up', 35, '023_g2.ogg', '057_f5.ogg'],
  ]) {
    const sampleRoot = path.join(root, 'assets', 'audio', folder);
    const samples = fs.readdirSync(sampleRoot).filter((name) => name.endsWith('.ogg')).sort();
    const totalBytes = samples.reduce((sum, name) => sum + fs.statSync(path.join(sampleRoot, name)).size, 0);
    assert.equal(samples.length, count, folder);
    assert.equal(samples[0], first, folder);
    assert.equal(samples.at(-1), last, folder);
    assert.ok(totalBytes < 6 * 1024 * 1024, folder);
  }
  assert.match(app, /state\.currentModel\.id === "gayageum"/);
  assert.match(app, /\[\["pluck", "기본 뜯기"\],[\s\S]*?\["bend-up", "추성"\]\]/);
  assert.match(app, /id: "hyangpiri"[\s\S]*?range: \[59, 77\][\s\S]*?badge: "19-NOTE · 2 ARTICULATIONS"/);
  assert.match(app, /id: "taepyeongso"[\s\S]*?range: \[68, 89\][\s\S]*?badge: "22-NOTE OGG"/);
  assert.match(app, /state\.family === "korean"[\s\S]*?sampleConfig\.min[\s\S]*?sampleConfig\.max/);
  assert.match(app, /"hyangpiri", "hyangpiri-vibrato", "taepyeongso"/);
});

test('new Korean, ocarina, court chime, and tam-tam sources use their recorded ranges', () => {
  for (const [folder, count, first, last] of [
    ['geomungo', 32, '026_as2.ogg', '057_f5.ogg'],
    ['geomungo-light-vibrato', 32, '026_as2.ogg', '057_f5.ogg'],
    ['geomungo-deep-vibrato', 32, '026_as2.ogg', '057_f5.ogg'],
    ['yanggeum', 30, '031_ds3.ogg', '060_gs5.ogg'],
    ['yanggeum-tremolo', 30, '031_ds3.ogg', '060_gs5.ogg'],
    ['sogeum', 24, '050_as4.ogg', '073_a6.ogg'],
    ['danso', 27, '046_fs4.ogg', '072_gs6.ogg'],
    ['danso-vibrato', 27, '046_fs4.ogg', '072_gs6.ogg'],
    ['ajaeng', 36, '023_g2.ogg', '058_fs5.ogg'],
    ['ajaeng-vibrato', 36, '023_g2.ogg', '058_fs5.ogg'],
    ['gayageum-25', 39, '023_g2.ogg', '061_a5.ogg'],
    ['hun', 12, '040_c4.ogg', '051_b4.ogg'],
    ['pyeonjong', 16, '040_c4.ogg', '055_ds5.ogg'],
    ['pyeongyeong', 16, '052_c5.ogg', '067_ds6.ogg'],
    ['ocarina', 27, '040_c4.ogg', '066_d6.ogg']
  ]) {
    const sampleRoot = path.join(root, 'assets', 'audio', folder);
    const samples = fs.readdirSync(sampleRoot).filter((name) => name.endsWith('.ogg')).sort();
    const totalBytes = samples.reduce((sum, name) => sum + fs.statSync(path.join(sampleRoot, name)).size, 0);
    assert.equal(samples.length, count, folder);
    assert.equal(samples[0], first, folder);
    assert.equal(samples.at(-1), last, folder);
    assert.ok(totalBytes < 6 * 1024 * 1024, folder);
  }
  assert.match(app, /id: "geomungo"[\s\S]*?range: \[46, 77\][\s\S]*?badge: "32-NOTE · 3 ARTICULATIONS"/);
  assert.match(app, /state\.currentModel\.id === "geomungo"[\s\S]*?"geomungo-" \+ state\.articulation/);
  assert.match(app, /\[\["pluck", "기본 뜯기"\], \["light-vibrato", "잔농현"\], \["deep-vibrato", "깊은 농현"\]\]/);
  for (const asset of [
    'korean-yanggeum-v1.webp', 'korean-sogeum-v1.webp', 'korean-danso-v1.webp',
    'korean-hun-v1.webp', 'korean-gayageum-25-v1.webp', 'ocarina-concert-v1.webp'
  ]) {
    assert.equal(fs.existsSync(path.join(root, 'assets', 'instruments', asset)), true, asset);
    assert.match(app, new RegExp(asset.replace('.', '\\.')));
  }
  assert.match(app, /state\.currentModel\.id === "yanggeum"[\s\S]*?"yanggeum-tremolo"/);
  assert.match(app, /state\.currentModel\.id === "ajaeng"[\s\S]*?"ajaeng-vibrato"/);
  assert.match(app, /state\.currentModel\.id === "danso"[\s\S]*?"danso-vibrato"/);
  assert.match(app, /id: "pyeongyeong"[\s\S]*?range: \[72, 87\]/);
  assert.match(app, /id: "ocarina"[\s\S]*?range: \[60, 86\]/);
  const tamTam = path.join(root, 'assets', 'audio', 'orchestral-percussion', 'ride.ogg');
  assert.equal(fs.existsSync(tamTam), true);
  assert.ok(fs.statSync(tamTam).size > 32 * 1024);
  assert.match(app, /"orchestral-percussion": Object\.freeze\(\{ id: "orchestral-percussion"[\s\S]*?ride: 3/);
});

test('completed orchestral renders use compact note-grid Ogg samples', () => {
  for (const [folder, count, first, last] of [
    ['recorder-piccolo', 28, '057_f5.ogg', '084_gs7.ogg'],
    ['recorder-soprano', 30, '052_c5.ogg', '081_f7.ogg'],
    ['recorder-alto', 25, '045_f4.ogg', '069_f6.ogg'],
    ['recorder-tenor', 25, '040_c4.ogg', '064_c6.ogg'],
    ['flute', 37, '040_c4.ogg', '076_c7.ogg'],
    ['oboe', 34, '038_as3.ogg', '071_g6.ogg'],
    ['trumpet', 46, '032_e3.ogg', '077_cs7.ogg'],
    ['clarinet', 39, '030_d3.ogg', '068_e6.ogg'],
    ['bass-clarinet', 52, '024_gs2.ogg', '075_b6.ogg'],
    ['piccolo-flute', 37, '052_c5.ogg', '088_c8.ogg'],
    ['french-horn', 47, '027_b2.ogg', '073_a6.ogg'],
    ['english-horn', 32, '032_e3.ogg', '063_b5.ogg'],
    ['soprano-sax', 42, '033_f3.ogg', '074_as6.ogg'],
    ['alto-trombone', 44, '025_a2.ogg', '068_e6.ogg'],
    ['alto-sax', 47, '026_as2.ogg', '072_gs6.ogg'],
    ['tenor-sax', 50, '033_f3.ogg', '082_fs7.ogg'],
    ['baritone-sax', 56, '025_a2.ogg', '080_e7.ogg'],
    ['bassoon', 42, '014_as1.ogg', '055_ds5.ogg'],
    ['contrabassoon', 49, '012_gs1.ogg', '060_gs5.ogg'],
    ['tenor-trombone', 46, '032_e3.ogg', '077_cs7.ogg'],
    ['bass-trombone', 58, '015_b1.ogg', '072_gs6.ogg'],
    ['flugelhorn', 41, '032_e3.ogg', '072_gs6.ogg'],
    ['euphonium', 55, '020_e2.ogg', '074_as6.ogg'],
    ['bass-tuba', 57, '020_e2.ogg', '076_c7.ogg'],
    ['viola', 61, '028_c3.ogg', '088_c8.ogg'],
    ['viola-pizz', 42, '028_c3.ogg', '069_f6.ogg'],
    ['violin', 54, '035_g3.ogg', '088_c8.ogg'],
    ['violin-pizz', 46, '035_g3.ogg', '080_e7.ogg'],
    ['cello', 61, '028_c3.ogg', '088_c8.ogg'],
    ['cello-pizz', 26, '028_c3.ogg', '053_cs5.ogg'],
    ['upright-bass', 57, '032_e3.ogg', '088_c8.ogg'],
    ['upright-bass-pizz', 57, '032_e3.ogg', '088_c8.ogg'],
    ['timpani', 18, '016_c2.ogg', '033_f3.ogg'],
    ['marimba', 61, '016_c2.ogg', '076_c7.ogg'],
    ['vibraphone', 37, '033_f3.ogg', '069_f6.ogg'],
    ['xylophone', 42, '028_c3.ogg', '069_f6.ogg'],
    ['glockenspiel', 17, '059_g5.ogg', '075_b6.ogg'],
    ['p-bass-finger-v4', 36, '008_e1.ogg', '043_ds4.ogg'],
    ['p-bass-pick-v4', 36, '008_e1.ogg', '043_ds4.ogg'],
    ['p-bass-slap-v4', 35, '008_e1.ogg', '042_d4.ogg'],
    ['j-bass-finger-v4', 36, '008_e1.ogg', '043_ds4.ogg'],
    ['j-bass-pick-v4', 35, '008_e1.ogg', '042_d4.ogg'],
    ['j-bass-slap-v4', 35, '008_e1.ogg', '042_d4.ogg'],
    ['active-bass-finger', 40, '003_b0.ogg', '042_d4.ogg'],
    ['active-bass-pick', 40, '003_b0.ogg', '042_d4.ogg'],
    ['active-bass-slap', 40, '003_b0.ogg', '042_d4.ogg'],
    ['fretless-bass-finger', 36, '008_e1.ogg', '043_ds4.ogg'],
    ['fretless-bass-pick', 35, '008_e1.ogg', '042_d4.ogg'],
    ['fretless-bass-slap', 35, '008_e1.ogg', '042_d4.ogg'],
    ['guitar-s-clean', 47, '020_e2.ogg', '066_d6.ogg'],
    ['guitar-s-blues', 47, '020_e2.ogg', '066_d6.ogg'],
    ['guitar-s-funk', 47, '020_e2.ogg', '066_d6.ogg'],
    ['guitar-s-rock', 47, '020_e2.ogg', '066_d6.ogg'],
    ['guitar-superstrat', 45, '020_e2.ogg', '064_c6.ogg'],
    ['guitar-hollow', 47, '020_e2.ogg', '066_d6.ogg'],
    ['guitar-nylon', 45, '020_e2.ogg', '064_c6.ogg'],
    ['guitar-steel', 45, '020_e2.ogg', '064_c6.ogg'],
    ['harp', 78, '005_cs1.ogg', '082_fs7.ogg'],
    ['piccolo-trumpet', 49, '032_e3.ogg', '080_e7.ogg']
  ]) {
    const sampleRoot = path.join(root, 'assets', 'audio', folder);
    const samples = fs.readdirSync(sampleRoot).filter((name) => name.endsWith('.ogg')).sort();
    assert.equal(samples.length, count, folder);
    assert.equal(samples[0], first, folder);
    assert.equal(samples.at(-1), last, folder);
  }
  for (const [articulation, sample] of [
    ['finger', '008_e1.ogg'],
    ['pick', '008_e1.ogg'],
    ['slap', '008_e1.ogg']
  ]) {
    const pBass = fs.readFileSync(path.join(root, 'assets', 'audio', `p-bass-${articulation}-v4`, sample));
    const jBass = fs.readFileSync(path.join(root, 'assets', 'audio', `j-bass-${articulation}-v4`, sample));
    assert.notDeepEqual(pBass, jBass, `${articulation}: P/J samples must remain distinct`);
  }
  assert.match(app, /root: "assets\/audio\/p-bass-finger-v4\/"/);
  assert.match(app, /root: "assets\/audio\/j-bass-finger-v4\/"/);
  assert.match(app, /isSampledPiano\(\) \|\| state\.instrument === "piano"/);
  assert.match(app, /sampleSet === "hammond-organ"[\s\S]*?"tuba"/);
  assert.match(app, /"contrabassoon"[\s\S]*?"flugelhorn"[\s\S]*?"euphonium"/);
  assert.match(app, /ONE_SHOT_SAMPLE_SETS = new Set\(\[[^\]]*"harp"[^\]]*"geomungo"[^\]]*"pyeongyeong"\]\)/);
  assert.match(app, /const peak = upwardBalancedGain\(buffer, velocityGain \* calibratedGain, velocityGain\)/);
  assert.match(app, /function decodedBufferPeak\(buffer\)/);
  assert.match(app, /function decodedBufferActiveRms\(buffer\)/);
  assert.match(app, /Math\.max\(requestedGain, quietSampleFloor\)/, 'quiet samples must be raised without lowering louder samples');
  assert.match(app, /const safeGain = \.92 \/ decodedBufferPeak\(buffer\)/);
  assert.match(app, /source\.connect\(state\.limiter\)/, 'every dry voice must retain shared peak protection');
  assert.doesNotMatch(app, /source\.connect\(state\.masterGain\)/);
  assert.match(app, /connectFastToMix\(gain, \.035\)/, 'sampled instruments must retain the original room send');
  assert.doesNotMatch(app, /Recorded samples already contain their own body and room tone/);
  assert.match(app, /const calibratedGain = Math\.pow/);
  assert.match(app, /gainDb: -5\.68/);
  assert.match(app, /gainDb: 20\.0/);
  assert.match(app, /id: "ocarina"[^\n]*gainDb: -4\.5/, 'ocarina must retain its perceptual loudness lift');
  assert.match(app, /id: "gayageum-25"[^\n]*gainDb: 18\.6/);
  assert.match(app, /id: "ajaeng-vibrato"[^\n]*gainDb: 17\.1/);
  assert.match(app, /id: "guitar-s-funk"[^\n]*gainDb: 25\.1/);
  assert.match(app, /id: "guitar-steel"[^\n]*gainDb: 25\.0/);
  assert.match(app, /id: "glockenspiel"[^\n]*gainDb: 33\.1/);
  assert.match(app, /\["violin", "viola", "cello", "upright-bass"\]\.includes\(state\.currentModel\.id\) && state\.articulation === "pizzicato"/);
  assert.match(app, /\[\["sustain", "활긋기"\], \["pizzicato", "피치카토"\]\]/);
});

test('guitar sample maps contain every supplied MIDI note exactly once', () => {
  for (const folder of [
    'guitar-s-clean', 'guitar-s-blues', 'guitar-s-funk', 'guitar-s-rock',
    'guitar-superstrat', 'guitar-hollow', 'guitar-nylon', 'guitar-steel'
  ]) {
    const sampleRoot = path.join(root, 'assets', 'audio', folder);
    const expectedMidi = fs.readdirSync(sampleRoot)
      .filter((name) => name.endsWith('.ogg'))
      .sort()
      .map((name) => Number(name.slice(0, 3)) + 20);
    const escapedFolder = folder.replaceAll('-', '\\-');
    const configMatch = app.match(new RegExp(`"${escapedFolder}": Object\\.freeze\\(\\{[^\\n]+anchors: Object\\.freeze\\(\\[([^\\]]+)\\]\\)`));
    assert.ok(configMatch, `${folder}: missing explicit anchor map`);
    const anchors = configMatch[1].split(',').map((value) => Number(value.trim()));
    assert.deepEqual(anchors, expectedMidi, `${folder}: config anchors must match supplied files`);
    assert.match(configMatch[0], new RegExp(`min: ${expectedMidi[0]}, max: ${expectedMidi.at(-1)}`), `${folder}: recorded range`);
  }
});
test('keyboard and electronic machines use non-interactive premium artwork', () => {
  for (const asset of [
    'keyboard-concert-grand.webp', 'keyboard-upright-piano.webp',
    'keyboard-harpsichord.webp', 'keyboard-tine-ep.webp', 'keyboard-reed-ep.webp',
    'keyboard-clavinet.webp', 'keyboard-fm-dx7.webp', 'keyboard-jd800.webp',
    'keyboard-grand-tine-duo.webp', 'keyboard-ballad-digital.webp',
    'keyboard-tonewheel-organ.webp', 'keyboard-pipe-organ.webp', 'drum-808-machine.webp',
    'drum-linn-machine.webp'
  ]) {
    assert.match(app, new RegExp(asset.replace('.', '\\.')));
    assert.equal(fs.existsSync(path.join(root, 'assets', 'instruments', asset)), true, asset);
  }
  assert.match(app, /model\.art \|\| hasLayers/);
  assert.match(app, /\(model\.stage === "machine" \|\| model\.stage === "linn"\) && !model\.art/);
  assert.match(css, /\.instrument-visual\.has-artwork \.studio-stage::before/);
  assert.match(css, /pointer-events: none/);
});

test('percussion library includes dedicated kits and essential orchestral instruments', () => {
  for (const model of ['rock-kit', 'metal-kit', 'pop-kit', 'jazz-kit', 'funk-kit', 'timpani', 'glockenspiel', 'marimba', 'vibraphone', 'xylophone', 'orchestral-percussion', 'drum-808', 'linn-machine']) {
    assert.match(app, new RegExp(`id: "${model}"`));
  }
  assert.match(app, /renderMachine/);
  assert.doesNotMatch(app, /renderKitHotspots|triggerVisualDrum|kitHotspots/);
  assert.doesNotMatch(html, /kitHotspots|inputHint/);
  for (const asset of ['drum-rock-kit.webp', 'drum-metal-kit.webp', 'drum-pop-kit.webp', 'drum-jazz-kit.webp', 'drum-funk-kit.webp']) {
    assert.match(app, new RegExp(asset.replace('.', '\\.')));
  }
  assert.match(app, /id: "midtom"/);
  assert.match(app, /function activeDrums/);
  assert.match(app, /const AD2_DRUM_ARTICULATIONS = Object\.freeze/);
  for (const kit of ['rock-kit', 'metal-kit', 'pop-kit', 'jazz-kit', 'funk-kit', 'drum-808', 'linn-machine']) {
    assert.match(app, new RegExp(`"${kit}": AD2_DRUM_ARTICULATIONS`));
  }
  assert.match(app, /drums\.length >= 9/);
  assert.match(css, /\.drum-pads\.extended/);
  for (const folder of ['drums-rock', 'drums-metal', 'drums-pop', 'drums-jazz', 'drums-funk', 'drums-linn', 'drums-808']) {
    const files = fs.readdirSync(path.join(root, 'assets', 'audio', folder)).filter((name) => name.endsWith('.ogg')).sort();
    assert.equal(files.length, 15, folder);
    assert.equal(files[0], 'crash.ogg', folder);
    assert.equal(files.at(-1), 'snare.ogg', folder);
  }
  for (const id of ['ghost', 'sidestick', 'rimshot', 'rimclick', 'pedalhat', 'openhat', 'ridebell']) {
    assert.match(app, new RegExp(`id: "${id}"`));
  }
  assert.doesNotMatch(app, /id: "clap"/);
  assert.doesNotMatch(app, /id: "subtom"/);
  assert.match(drumSplitSource, /"kick": 1,[\s\S]*?"snare": 2,[\s\S]*?"rimshot": 3,[\s\S]*?"sidestick": 4,[\s\S]*?"rimclick": 5/);
  assert.match(drumSplitSource, /"pedalhat": 8,[\s\S]*?"hat": 9,[\s\S]*?"openhat": 17/);
  assert.match(drumSplitSource, /"ride": 20,[\s\S]*?"ridebell": 21/);
  assert.match(app, /function chokeOpenHat/);
  assert.match(app, /\["hat", "pedalhat", "openhat"\]\.includes\(id\)/);
  assert.match(app, /const DRUM_SAMPLE_SETS/);
  assert.match(app, /const DRUM_KIT_GAIN_DB = Object.freeze/);
  for (const folder of ['drums-rock', 'drums-metal', 'drums-pop', 'drums-jazz', 'drums-funk', 'drums-linn', 'drums-808']) {
    assert.match(app, new RegExp(`gainDb: DRUM_KIT_GAIN_DB\\["${folder}"\\]`));
  }
  assert.doesNotMatch(app, /DRUM_PERCEPTUAL_TRIM_DB|perceptualTrimDb/);
  assert.match(app, /sampledVelocity \* Math\.pow\(10, gainDb \/ 20\)/);
  assert.match(drumSplitSource, /parser\.add_argument\("--bitrate", default="192k"\)/);
  assert.match(app, /const AUDIO_SAMPLE_REVISION = "20260905-original-timbre-v3"/);
  assert.match(app, /const AD2_DRUM_SAMPLE_REVISION = "20260902-ad2-original-balance-v2"/);
  assert.match(app, /config\.root \+ id \+ "\.ogg" \+ sampleRevision/);
  assert.match(app, /function playSampledDrum/);
  assert.match(app, /preloadDrumSamples\(\)/);
  assert.match(app, /typeof current\.gainDb === "number"/);
  assert.match(app, /ACOUSTIC DRUM KIT/);
  assert.match(app, /drumSystemDescription\.classList\.toggle\("hidden", !copy\[1\]\)/);
  assert.doesNotMatch(app, /Cubase|AD2 MAP/);
  assert.doesNotMatch(app, /사용자가 제공한|AD2 MIDI 키맵/);
  assert.match(css, /#drumControls\.sampled-kit label \{ display: none; \}/);
});

test('Korean folk percussion exposes each instrument and official articulation as an independent recorded pad', () => {
  const expected = {
    'janggu-samul': 13,
    'janggu-sanjo': 15,
    'buk-samul': 19,
    'buk-sori': 21,
    sogo: 17,
    kkwaenggwari: 9,
    jing: 6
  };
  assert.deepEqual(Object.keys(koreanPercussion.pads).sort(), Object.keys(expected).sort());
  for (const [id, count] of Object.entries(expected)) {
    const pads = koreanPercussion.pads[id];
    assert.equal(pads.length, count, id + ' articulation count');
    assert.equal(new Set(pads.map((pad) => pad.id)).size, count, id + ' unique ids');
    assert.equal(new Set(pads.map((pad) => pad.code)).size, count, id + ' unique keyboard bindings');
    const sampleRoot = path.join(root, 'assets', 'audio', 'korean-percussion', id);
    const samples = fs.readdirSync(sampleRoot).filter((name) => name.endsWith('.ogg'));
    assert.equal(samples.length, count, id + ' sample count');
    for (const pad of pads) {
      assert.equal(typeof pad.sourceName, 'string', id + ' official source name');
      assert.equal(fs.existsSync(path.join(sampleRoot, pad.id + '.ogg')), true, id + '/' + pad.id);
    }
    assert.match(app, new RegExp('id: "' + id + '"'));
  }
  assert.doesNotMatch(app, /id: "samulnori", name: "사물놀이"/);
  assert.match(app, /KOREAN_PERCUSSION_PADS/);
  assert.match(app, /KOREAN_PERCUSSION_SAMPLE_SETS/);
  assert.match(app, /korean-articulations/);
  assert.match(css, /\.drum-pads\.korean-articulations/);
  assert.match(app, /function koreanPercussionTargetDb/);
  assert.match(app, /function chokeKoreanMetal/);
  assert.match(app, /decodedBufferPeak\(sample\.buffer\)/);
  assert.match(css, /user-select: none/);
});
test('keeps the recorded bass finger articulation active on first model selection', () => {
  const start = app.indexOf('function renderClassicalArticulations(model)');
  const end = app.indexOf('function renderSoundPresets()', start);
  const articulationRenderer = app.slice(start, end);
  assert.ok(start >= 0 && end > start);
  assert.match(articulationRenderer, /const expressive = Boolean\(model\.expressive\)/);
  assert.ok(articulationRenderer.indexOf('if (!expressive)') < articulationRenderer.indexOf('state.articulation = options[0][0]'));
  assert.match(app, /state\.currentModel\.id \+ "-" \+ state\.articulation/);
});

test('explains the model-name origins for P, J, and guitar styles', () => {
  assert.match(app, /P-Style은 Fender Precision Bass에서 유래한 계열명/);
  assert.match(app, /J-Style은 Fender Jazz Bass에서 유래한 계열명/);
  assert.match(detailSource, /P는 Fender가 1951년에 선보인 Precision Bass/);
  assert.match(detailSource, /J는 Fender가 1960년에 선보인 Jazz Bass/);
  assert.match(detailSource, /S-Style의 S는 Fender가 1954년에 선보인 Stratocaster/);
  assert.match(detailSource, /Superstrat은 Fender Stratocaster 계열/);
  assert.match(detailSource, /C\. F\. Martin이 1916년 Oliver Ditson을 위해 만든/);
});
test('string and expressive families expose virtual-instrument presentation', () => {
  for (const model of ['p-bass', 's-style', 'metal-seven', 'dreadnought', 'upright-bass', 'violin', 'harp', 'flute', 'contrabassoon', 'trumpet', 'piccolo-trumpet', 'flugelhorn', 'euphonium']) {
    assert.match(app, new RegExp(`id: "${model}"`));
  }
  assert.match(html, /id="classicalControls"/);
  assert.match(html, /id="guitarFxControls"/);
  assert.match(html, /id="soundPresetGroup"/);
  assert.match(html, /id="physicalStringControls"/);
  assert.doesNotMatch(html, /expression-tabs|expression-actions/);
  assert.match(app, /\[\["finger", "핑거"\], \["pick", "피크"\], \["slap", "슬랩"\]\]/);
  assert.match(app, /\[\["clean", "클린"\], \["blues", "블루스"\], \["funk", "펑크"\], \["rock", "록"\]\]/);
  assert.match(app, /"guitar-steel": Object\.freeze/);
  assert.match(app, /id === "dreadnought"\) return KEYBOARD_SAMPLE_SETS\["guitar-steel"\]/);
  assert.match(app, /anchors: Object\.freeze\(\[40,/);
  assert.match(css, /\.classical-render/);
  assert.match(css, /\.machine-deck/);
});

test('project-bound instrument artwork exists', () => {
  for (const asset of ['bass-p-style.png', 'bass-j-style.png', 'bass-active-five.png', 'bass-fretless.png', 'guitar-s-style.png', 'guitar-metal-seven.png', 'guitar-hollowbody-jazz.png', 'guitar-dreadnought.png', 'guitar-classical-nylon.png', 'drum-rock-kit.webp', 'drum-metal-kit.webp', 'drum-pop-kit.webp', 'drum-jazz-kit.webp', 'drum-funk-kit.webp', 'violin-expressive-v2.webp', 'viola-expressive-v2.webp', 'cello-expressive.png', 'double-bass-expressive.png', 'flute-expressive.png', 'oboe-expressive.png', 'clarinet-expressive.png', 'bassoon-expressive.png', 'contrabassoon-expressive.webp', 'alto-sax-expressive.png', 'soprano-sax-expressive-v2.webp', 'tenor-sax-expressive-v2.webp', 'baritone-sax-expressive-v2.webp', 'bass-clarinet-expressive-v2.webp', 'piccolo-flute-expressive-v2.webp', 'english-horn-expressive-v2.webp', 'trumpet-expressive.png', 'flugelhorn-expressive.webp', 'euphonium-expressive.webp', 'trombone-expressive.png', 'alto-trombone-expressive-v2.webp', 'bass-trombone-expressive-v2.webp', 'french-horn-expressive.png', 'tuba-expressive-v2.webp', 'harp-concert-v2.webp', 'piccolo-trumpet-expressive.webp', 'timpani-bank.png', 'glockenspiel-concert.png', 'marimba-concert.png', 'vibraphone-concert.png', 'xylophone-compact-concert.webp', 'orchestral-percussion-station.png', 'korean-gayageum.png', 'korean-geomungo.png', 'korean-haegeum-v2.webp', 'korean-ajaeng.png', 'korean-daegeum.png', 'korean-hyangpiri.png', 'korean-taepyeongso.png', 'korean-samulnori-station.png', 'korean-janggu-samul.webp', 'korean-janggu-sanjo.webp', 'korean-buk-samul.webp', 'korean-buk-sori.webp', 'recorder-piccolo-v1.webp', 'recorder-soprano-v1.webp', 'recorder-alto-v1.webp', 'recorder-tenor-v1.webp']) {
    assert.equal(fs.existsSync(path.join(root, 'assets', 'instruments', asset)), true, asset);
  }
});

test('range controls keep computer-keyboard performance available', () => {
  assert.match(app, /event\.target\.type !== "range"/);
  assert.match(app, /id: "viola"[\s\S]*?viola-expressive-v2\.webp/);
});

test('shows actual-size guidance and keeps related instruments at different visual scales', () => {
  assert.match(html, /id="scaleGuide"/);
  assert.match(html, /id="scaleValue"/);
  assert.match(css, /--object-scale/);
  assert.match(app, /전체 높이 약 180 cm/);
  assert.match(app, /전체 길이 약 59 cm/);
  assert.match(app, /외형 길이 약 48 cm/);
  assert.match(app, /슬라이드 닫힘 약 114 cm/);
});

test('renders a full keyboard and disables notes outside each model range', () => {
  assert.match(app, /DISPLAY_RANGE = \{ start: 21, end: 108 \}/);
  assert.match(app, /\["KeyO", 13, "O"\]/);
  assert.match(app, /\["KeyP", 15, "P"\]/);
  assert.match(app, /\["Semicolon", 16, ";"\]/);
  assert.match(app, /\["Quote", 17, "'"\]/);
  assert.match(app, /key\.disabled = unavailable/);
  assert.match(app, /isPitchPlayable/);
  assert.match(app, /pitched: true, range:/);
  assert.match(html, /id="rangeLegend"/);
  assert.match(css, /\.key\.unavailable/);
});

test('defaults to full physical piano dimensions and supports per-device shrinking', () => {
  assert.match(html, /id="keySizeButton"/);
  assert.match(html, /id="calibrationCard"/);
  assert.match(html, /id="keyScaleSlider"[^>]*min="50"[^>]*max="100"[^>]*value="100"/);
  assert.match(app, /PIANO_WHITE_KEY_MM = \{ width: 23\.5, length: 150 \}/);
  assert.match(app, /PIANO_BLACK_KEY_MM = \{ width: 13\.7, length: 95 \}/);
  assert.match(app, /REFERENCE_CARD_MM = 85\.6/);
  assert.match(app, /CSS_PX_PER_MM = 96 \/ 25\.4/);
  assert.match(app, /instrument-room-key-size-v1/);
  assert.match(app, /function saveScreenCalibration\(\)/);
  assert.match(app, /function currentDisplayKey\(\)/);
  assert.match(app, /saved\.profiles\[state\.displayKey\]/);
  assert.match(app, /state\.keyboardScale = Math\.max\(\.5, Math\.min\(1, profile\.scale\)\)/);
  assert.match(css, /--key-width: 88\.82px/);
  assert.match(css, /--key-height: 566\.93px/);
  assert.match(css, /height: var\(--key-height\)/);
});

test('offers a single-scroll accessible encyclopedia dialog without external links', () => {
  assert.match(html, /instrument-details\.js[^>]*defer/);
  assert.ok(html.indexOf('instrument-details.js') < html.indexOf('app.js'));
  assert.match(html, /id="instrumentInfoButton"[^>]*aria-haspopup="dialog"/);
  assert.match(html, /id="instrumentDetailDialog"[^>]*role="dialog"[^>]*aria-modal="true"/);
  assert.doesNotMatch(html, /data-detail-tab|detailSourceList|더 확인하기/);
  assert.match(app, /const DETAIL_SECTIONS/);
  assert.match(app, /section\.className = "detail-section"/);
  assert.doesNotMatch(app, /target = "_blank"|source\.url|DETAIL_TABS/);
  assert.match(app, /function openInstrumentDetail/);
  assert.match(app, /function closeInstrumentDetail/);
  assert.match(app, /function handleDetailKeydown/);
  assert.match(app, /if \(state\.detailOpen\) return;/);
  assert.match(css, /\.instrument-detail-dialog/);
  assert.match(css, /min-height: 44px/);
});

test('provides complete long-form guides for every model and grouped instrument', () => {
  const required = [
    'concert-grand', 'upright-piano', 'harpsichord', 'tine-ep', 'reed-ep', 'clavinet',
    'fm-dx7', 'jd800', 'hybrid-la-rhodes', 'hybrid-la-mks', 'hammond-organ', 'pipe-organ',
    'p-bass', 'j-bass', 'active-bass',
    'fretless-bass', 'upright-bass', 's-style', 'metal-seven', 'hollow-jazz', 'dreadnought',
    'classical-guitar', 'violin', 'viola', 'cello', 'harp', 'recorder-piccolo', 'recorder-soprano', 'recorder-alto', 'recorder-tenor', 'piccolo-flute', 'flute', 'oboe',
    'english-horn', 'clarinet', 'bass-clarinet', 'bassoon', 'contrabassoon', 'soprano-sax', 'saxophone', 'tenor-sax', 'baritone-sax',
    'trumpet', 'piccolo-trumpet', 'flugelhorn', 'alto-trombone', 'trombone', 'bass-trombone', 'french-horn', 'euphonium', 'tuba',
    'rock-kit', 'metal-kit',
    'pop-kit', 'jazz-kit', 'funk-kit', 'drum-808', 'linn-machine', 'timpani', 'glockenspiel',
    'marimba', 'vibraphone', 'xylophone', 'orchestral-percussion', 'orchestral-snare',
    'orchestral-bass-drum', 'orchestral-suspended-cymbal', 'orchestral-tamtam',
    'orchestral-triangle', 'gayageum', 'gayageum-25', 'geomungo', 'yanggeum', 'haegeum', 'ajaeng', 'daegeum',
    'sogeum', 'danso', 'hun', 'hyangpiri', 'taepyeongso', 'ocarina', 'samulnori', 'janggu', 'buk', 'janggu-samul', 'janggu-sanjo', 'buk-samul', 'buk-sori', 'sogo', 'kkwaenggwari',
    'jing', 'pyeonjong', 'pyeongyeong', 'ritual-signals', 'bak', 'chuk', 'eo',
    'daechwita-station', 'nabal', 'nagak', 'yonggo', 'jabara'
  ];
  assert.equal(Object.keys(instrumentDetails).length, required.length);
  for (const id of required) {
    const entry = instrumentDetails[id];
    assert.ok(entry, id);
    assert.equal(entry.facts.length >= 3, true, id + ' facts');
    assert.equal(entry.sources.length >= 1, true, id + ' sources');
    for (const section of ['overview', 'mechanism', 'technique', 'role', 'history']) {
      assert.equal(typeof entry.sections[section], 'string', id + ' ' + section);
      assert.equal(entry.sections[section].length >= 45, true, id + ' ' + section + ' depth');
    }
  }
});

test('sample playback preserves attacks with per-file onset detection', () => {
  assert.match(app, /function decodedBufferStartOffset/);
  assert.match(app, /SAMPLED_NOTE_ATTACK_LEAD = \.012/);
  assert.match(app, /Number\.isFinite\(sampleConfig\.startOffset\) \? Math\.max\(0, sampleConfig\.startOffset\) : null/);
  assert.match(app, /configuredOffset === null \? decodedBufferStartOffset\(buffer\)/);
  assert.doesNotMatch(app, /SAMPLED_NOTE_START_OFFSET|source\.start\(now, Math\.min\(\.012/);
});

test('pitched ranges align computer keys and hide shortcuts outside the range', () => {
  assert.match(app, /state\.family === "keyboard"[\s\S]*?state\.keyboardStartMidi = 60/);
  assert.match(app, /start \+ Math\.round\(\(end - start\) \* 0\.2\)/);
  assert.match(app, /key\.dataset\.shortcut = unavailable \? ""/);
});

test('moves the computer keyboard by white keys and by octaves', () => {
  assert.match(html, /id="octaveDown"[^>]*>−8<\/button>/);
  assert.match(html, /id="octaveUp"[^>]*>\+8<\/button>/);
  assert.match(html, /id="whiteKeyDown"[^>]*>←<\/button>/);
  assert.match(html, /id="whiteKeyUp"[^>]*>→<\/button>/);
  assert.match(app, /function moveKeyboardByWhiteKey\(direction\)/);
  assert.match(app, /function changeKeyboardOctave\(delta\)/);
  assert.match(app, /keyboardDirection && tag !== "INPUT"/);
  assert.match(app, /if \(event\.shiftKey\) changeKeyboardOctave\(keyboardDirection\)/);
  assert.match(app, /elements\.keyboard\.addEventListener\("contextmenu"/);
  assert.match(app, /changeKeyboardOctave\(1\)/);
});

test('browser app source is syntactically valid', () => {
  assert.doesNotThrow(() => new Function(app));
});

test('separates Korean melody, folk, and court instrument rooms', () => {
  for (const room of ['melody', 'folk', 'court']) {
    assert.match(html, new RegExp('data-korean-room="' + room + '"'));
    assert.match(app, new RegExp('room: "' + room + '"'));
  }
  assert.match(app, /function selectKoreanRoom/);
  assert.doesNotMatch(app, /model: "장구 · 북 · 소고 · 꽹과리 · 징"/);
  assert.match(app, /model: "박 · 축 · 어"/);
  assert.match(app, /model: "나발 · 나각 · 용고 · 자바라 · 징 · 태평소"/);
  assert.doesNotMatch(app, /model: "(?:SAMULNORI|JANGGU|BAK · CHUK|NABAL · NAGAK|AJAENG|DAEGEUM|HYANGPIRI|TAEPYEONGSO)"/);
  for (const model of ['gayageum', 'geomungo', 'haegeum', 'ajaeng', 'daegeum', 'hyangpiri', 'taepyeongso', 'janggu-samul', 'janggu-sanjo', 'buk-samul', 'buk-sori', 'sogo', 'kkwaenggwari', 'jing', 'pyeonjong', 'pyeongyeong', 'ritual-signals', 'daechwita-station']) {
    assert.match(app, new RegExp('id: "' + model + '"'));
  }
});

test('renders grouped percussion as independent glowing artwork layers', () => {
  assert.match(html, /id="instrumentLayers"/);
  assert.match(app, /function renderInstrumentLayers/);
  assert.match(app, /function pulseInstrumentPart/);
  assert.match(app, /toneMarkers: true/);
  assert.match(app, /drum\.sound \|\| drum\.id/);
  assert.match(css, /\.instrument-layer\.active/);
  assert.match(css, /\.tone-marker\.active/);
  for (const asset of [
    'orchestral-snare.webp', 'orchestral-bass-drum.webp',
    'orchestral-suspended-cymbal.webp', 'orchestral-tamtam.webp',
    'orchestral-triangle.webp',

    'korean-pyeonjong.webp', 'korean-pyeongyeong.webp'
  ]) {
    assert.match(app, new RegExp(asset.replace('.', '\\.')));
    assert.equal(fs.existsSync(path.join(root, 'assets', 'instruments', asset)), true, asset);
  }
  assert.doesNotMatch(app, /art: "assets\/instruments\/orchestral-percussion-station\.png"/);
});
