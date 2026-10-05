import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
// Only executable scripts are syntax-checked; data blocks such as
// type="application/ld+json" are not JavaScript.
const JAVASCRIPT_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module']);
const inlineScripts = [...html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .filter((match) => {
        const type = /\stype\s*=\s*["']?([^"'\s>]*)/i.exec(match[1] || '');
        return JAVASCRIPT_TYPES.has(type ? type[1].toLowerCase() : '');
    })
    .map((match) => match[2])
    .filter((script) => script.trim());
assert.ok(inlineScripts.length > 0, 'The page must still have inline JavaScript to syntax-check.');

for (const script of inlineScripts) {
    new Function(script);
}

assert.match(
    html,
    /id="guestName"[^>]*maxlength="30"/,
    'The guest name field must allow enough raw QWERTY keystrokes for a six-syllable Korean name.',
);
assert.doesNotMatch(
    html,
    /guestNameInput\.oninput\s*=/,
    'Do not rewrite the guest name field during input; that destroys the QWERTY composition buffer.',
);
assert.doesNotMatch(
    html,
    /studentNameInput\.oninput\s*=/,
    'Do not rewrite the student name field during Korean IME composition.',
);
assert.equal(
    [...html.matchAll(/guestForm\.addEventListener\(['"]submit['"]/g)].length,
    1,
    'Guest login must have exactly one submit handler.',
);
assert.match(
    html,
    /const name = normalizePlayerName\(guestNameInput\.value\.trim\(\)\);/,
    'QWERTY input must be composed into a completed Korean name at submit time.',
);
assert.match(
    html,
    /JSON\.stringify\(\{ name, passcode \}\)/,
    'The single guest request must include both the normalized name and passcode.',
);

const conversionStart = html.indexOf('function convertQwertyToHangul');
const conversionEnd = html.indexOf('function isValidPlayerName', conversionStart);
assert.ok(conversionStart >= 0 && conversionEnd > conversionStart, 'Korean name conversion helpers are missing.');
const conversionSource = html.slice(conversionStart, conversionEnd);
const { normalizePlayerName } = new Function(
    conversionSource + '\nreturn { normalizePlayerName };',
)();

assert.equal(normalizePlayerName('alal'), '미미');
assert.equal(normalizePlayerName('ALAL'), '미미');
assert.equal(normalizePlayerName('rladmsqlc'), '김은빛');
assert.equal(normalizePlayerName('qkrghktjd'), '박화성');
assert.equal(normalizePlayerName('미미'), '미미');

console.log('Index Korean name input contract passed.');
