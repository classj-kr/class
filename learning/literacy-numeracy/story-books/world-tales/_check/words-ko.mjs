/* 우리말 낱말 검사 — 쓰기: node _check/words-ko.mjs [책...]
   보는 것 다섯 가지
     1. 쪽마다 낱말이 있는가 (표지·펼침면·읽고 나서)
     2. 예문이 그 쪽 우리말 본문에 글자 그대로 있는가
     3. 뜻풀이가 제 낱말을 그대로 되풀이하지 않는가
     4. 한 책에서 같은 낱말을 두 번 풀지 않았는가
     5. 영어 목록을 그대로 옮겨 적지 않았는가

   다섯째는 낱말 하나하나를 막는 것이 아니다. 영어에서 funeral을 '장례'로 풀었다고
   우리말에서 '장례'를 못 고를 까닭은 없다. 아이는 우리말 '장례'도 모른다.
   막아야 할 것은 목록을 통째로 옮겨 적는 일이라, 겹치는 비율이 높을 때만 짖는다. */
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const ROOT = path.join(DIR, '..');

const books = process.argv.slice(2).length
    ? process.argv.slice(2)
    : fs.readdirSync(ROOT).filter(d => d !== '_check' && fs.existsSync(path.join(ROOT, d, 'app.js')));

const grab = (src, name) => {
    if (new RegExp('const ' + name + ' = \\{\\};').test(src)) return {};   // 아직 안 채운 책
    const m = src.match(new RegExp('const ' + name + ' = ([\\[{][\\s\\S]*?\\n[\\]}]);'));
    if (!m) return null;
    try { return eval('(' + m[1] + ')'); } catch (e) { return null; }
};

let bad = 0;
let seenBooks = 0;
let wordCount = 0;

for (const b of books) {
    const p = path.join(ROOT, b, 'app.js');
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, 'utf8');
    const W = grab(src, 'WORDS_KO');
    if (!W || !Object.keys(W).length) { console.log(`## ${b} — 우리말 낱말이 비어 있다`); bad++; continue; }
    seenBooks++;

    // 이솝 이야기는 장 대신 이야기 묶음(FABLES)으로 되어 있다. 둘 다 beats를 가진다.
    const CH = grab(src, 'CHAPTERS') || grab(src, 'FABLES');
    const COVER = grab(src, 'COVER');
    const AFTER = grab(src, 'AFTERWORD');
    const EN = grab(src, 'EN');

    // 쪽마다 그 쪽 글을 모아 둔다
    const textOf = {};
    if (COVER) textOf['cover.webp'] = COVER.intro.join(' ');
    (CH || []).forEach(ch => ch.beats.forEach(bt => { textOf[bt.art] = bt.left.concat(bt.right).join(' '); }));
    (AFTER ? AFTER.spreads : []).forEach(sp => { if (sp.art) textOf[sp.art] = sp.left.concat(sp.right).join(' '); });

    const enMeans = new Set();
    if (EN && EN.words) Object.values(EN.words).forEach(list => list.forEach(w => enMeans.add((w.meaning || '').trim())));

    const say = m => { console.log(`## ${b} — ${m}`); bad++; };

    for (const key of Object.keys(textOf)) {
        if (!W[key] || !W[key].length) say(`낱말이 없는 쪽: ${key}`);
    }
    for (const key of Object.keys(W)) {
        if (!textOf[key]) { say(`책에 없는 쪽 이름: ${key}`); continue; }
        const body = textOf[key];
        for (const w of W[key]) {
            wordCount++;
            const sent = (w.s || '').trim();
            if (!sent || !body.includes(sent)) say(`예문이 본문에 없다 — ${key} / ${w.w} / ${sent.slice(0, 30)}`);
            if (!/[.?!]$/.test((w.k || '').trim())) say(`뜻이 마침표로 끝나지 않는다 — ${key} / ${w.w}`);
            if ((w.k || '').includes(w.w)) say(`뜻이 제 낱말을 되풀이한다 — ${key} / ${w.w}: ${w.k}`);
        }
    }

    // 목록을 통째로 옮겨 적었는지 — 낱낱이 겹치는 것은 흠이 아니다
    const heads = Object.values(W).flat().map(w => (w.w || '').trim());
    const same = heads.filter(h => enMeans.has(h));
    if (heads.length && same.length / heads.length > 0.5) {
        say(`영어 목록을 옮겨 적은 듯하다 — ${same.length}/${heads.length}이 영어 뜻과 같다`);
    }
    const all = Object.values(W).flat().map(w => w.w);
    const dup = all.filter((w, i) => all.indexOf(w) !== i);
    if (dup.length) say(`한 책에서 되풀이된 낱말: ${[...new Set(dup)].join(', ')}`);
}

console.log(`\n본 책 ${seenBooks}권 (${books.length}권 가운데). 낱말 ${wordCount}개.`);
console.log(bad ? `걸린 것 ${bad}가지.` : '걸린 것 없다.');
