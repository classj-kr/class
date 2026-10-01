/* 읽어 주기용 문단 뽑기.
 *
 *   node _tools/tools-say-dump.mjs dangun > out.json
 *
 * 책 코드를 가짜 화면에서 실제로 돌려, 쪽마다 읽을 문단을 화면에 보이는 차례
 * 그대로 뽑는다(pageParts). 우리말과 영어를 둘 다 뽑아 두면 영어 쪽의 말하는 이
 * 표시(v)를 우리말 대사에 옮겨 붙일 수 있다. 정규식으로 긁지 않는 까닭은
 * 책마다 적는 모양이 조금씩 달라서다. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.slice(1)), '..');
const book = process.argv[2];
if (!book) { console.error('book folder name required'); process.exit(2); }

function fakeDom() {
    const el = () => ({
        style: {}, classList: { add() {}, remove() {}, contains: () => false, toggle() {} },
        dataset: {}, children: [], scrollHeight: 100, clientHeight: 100,
        offsetHeight: 100, offsetWidth: 100, textContent: '', innerHTML: '',
        addEventListener() {}, removeEventListener() {}, remove() {},
        appendChild: (c) => c, removeChild: (c) => c, replaceChild: (c) => c,
        insertBefore: (c) => c, contains: () => false,
        firstChild: null, lastChild: null, parentNode: null, nextSibling: null,
        querySelector: () => el(), querySelectorAll: () => [],
        getBoundingClientRect: () => ({ width: 100, height: 100, top: 0, left: 0 }),
        focus() {}, click() {}, setAttribute() {}, getAttribute: () => null,
        insertAdjacentHTML() {}, closest: () => null, scrollTo() {}, cloneNode: () => el(),
    });
    return {
        getElementById: () => el(), querySelector: () => el(), querySelectorAll: () => [],
        createElement: () => el(), addEventListener() {}, removeEventListener() {},
        body: el(), documentElement: el(), head: el(), fonts: { ready: Promise.resolve() },
        readyState: 'complete', title: '',
    };
}

const src = fs.readFileSync(path.join(ROOT, book, 'app.js'), 'utf8');
const tail = `
;(() => {
    const strip = s => String(s).replace(/<[^>]+>/g, '').replace(/\\s+/g, ' ').trim();
    const dump = () => {
        buildPages();
        return PAGES.map((p, idx) => ({
            idx, kind: p.kind,
            art: p.kind === 'spread' ? p.beat.art : (p.kind === 'after' ? (p.spread.art || '') : (p.kind === 'cover' ? 'cover' : '')),
            parts: pageParts(p).map(x => ({ t: strip(textOf(x)), v: roleOf(x) }))
        })).filter(p => p.parts.length);
    };
    const out = { book: ${JSON.stringify(book)}, ko: null, en: null };
    LANG = 'ko'; out.ko = dump();
    if (typeof HAS_EN !== 'undefined' && HAS_EN) { LANG = 'en'; out.en = dump(); }
    __out(JSON.stringify(out));
})();`;
let result = null;
const sandbox = {
    document: fakeDom(), console: { log() {}, warn() {}, error() {} },
    addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
    getComputedStyle: () => ({ getPropertyValue: () => '', fontSize: '16px', lineHeight: '24px' }),
    innerWidth: 900, innerHeight: 1200, devicePixelRatio: 1, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    requestAnimationFrame: () => 0, cancelAnimationFrame() {},
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    location: { href: '', hash: '', search: '', reload() {} },
    navigator: { language: 'ko', userAgent: 'node' },
    speechSynthesis: undefined, SpeechSynthesisUtterance: undefined,
    matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
    ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
    IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
    Image: class { set src(v) {} },
    fetch: () => Promise.resolve({ ok: true, text: () => Promise.resolve('') }),
    Math, JSON, Date, Array, Object, String, Number, Boolean, Set, Map, Promise,
    RegExp, Error, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
    __out: (s) => { result = s; },
};
sandbox.window = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
new vm.Script(src + tail, { filename: book + '/app.js' }).runInContext(sandbox, { timeout: 5000 });
process.stdout.write(result + '\n');
