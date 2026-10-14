/* 책이 실제로 열리는지 본다.
 *
 *   node _tools/tools-boot.mjs            전권
 *   node _tools/tools-boot.mjs dangun     한 권
 *
 * 문법 검사(node --check)는 파일을 읽기만 하고 돌려 보지는 않는다. 그래서
 * "아래에서 만든 것을 위에서 부르는" 잘못을 못 잡는다. 실제로 그것 때문에
 * 소설 7권이 한동안 안 열렸다. 여기서는 가짜 화면을 하나 만들어 놓고
 * app.js 를 처음부터 끝까지 돌려 본다. 첫 화면이 그려지는 데까지 가면 통과다.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.slice(1)), '..');
const only = process.argv.slice(2);

/* 책이 쓰는 만큼만 흉내 낸 화면. 없는 것을 물으면 빈 것을 돌려준다. */
function fakeDom() {
    const el = () => {
        const e = {
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
        };
        return e;
    };
    const doc = {
        getElementById: () => el(), querySelector: () => el(), querySelectorAll: () => [],
        createElement: () => el(), addEventListener() {}, removeEventListener() {},
        body: el(), documentElement: el(), head: el(), fonts: { ready: Promise.resolve() },
        readyState: 'complete', title: '',
    };
    return doc;
}

function boot(book) {
    const src = fs.readFileSync(path.join(ROOT, book, 'app.js'), 'utf8');
    const doc = fakeDom();
    const sandbox = {
        document: doc, console: { log() {}, warn() {}, error() {} },
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
        // 책 끝에서 부르는 공용 기록 연결(/assets/learning-book.js). 여기서는 빈 것으로 둔다.
        connectBookRecords: () => Promise.resolve(),
        Math, JSON, Date, Array, Object, String, Number, Boolean, Set, Map, Promise,
        RegExp, Error, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    new vm.Script(src, { filename: book + '/app.js' }).runInContext(sandbox, { timeout: 5000 });
}

const books = fs.readdirSync(ROOT).sort()
    .filter(b => !b.startsWith('_') && fs.existsSync(path.join(ROOT, b, 'app.js')))
    .filter(b => !only.length || only.includes(b));

let bad = 0;
for (const b of books) {
    try {
        boot(b);
    } catch (e) {
        bad++;
        console.log('## ' + b);
        console.log('   ' + String(e.message).split('\n')[0]);
    }
}

console.log('\n돌려 본 책 ' + books.length + '권, 안 열리는 책 ' + bad + '권.');
console.log('가짜 화면이라 그림이나 소리까지는 못 본다. 첫 화면이 그려지는 데까지만 본다.');
if (bad) process.exitCode = 1;
