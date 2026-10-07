/* 우리말 낱말 풀이(WORDS_KO)가 제자리에 붙었는지 본다. 그림책 틀 61권.

     node _tools/tools-words-ko.mjs            전부
     node _tools/tools-words-ko.mjs heungbujeon jopssal-han-tol

   쪽 이름은 세 가지다. 이야기 쪽은 그림 파일 이름("03-mouse.webp"), 표지는 "cover",
   「읽고 나서」는 "after". 이 책들은 해설(AFTERWORD)이 영어판 뒤에 있어서,
   본문을 찾을 때 영어판을 건너뛰어야 한다.

   잰다:
     예문이 본문 어디에도 없다       — 글을 고친 뒤 예문을 안 따라 고친 것
     예문이 다른 쪽 글이다           — 카드가 엉뚱한 쪽에 뜬다
     낱말이 예문에 안 보인다          — 예문만 바뀌고 낱말은 옛것
     한 책에서 같은 낱말을 두 번 풀었다 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.slice(1)), '..');
const only = process.argv.slice(2);
const books = fs.readdirSync(ROOT).filter(b => fs.existsSync(path.join(ROOT, b, 'app.js')) && (!only.length || only.includes(b)));

let seen = 0, total = 0, bad = 0;
for (const book of books) {
    const s = fs.readFileSync(path.join(ROOT, book, 'app.js'), 'utf8');
    const ko = s.indexOf('const WORDS_KO');
    if (ko < 0) continue;
    seen++;
    const cover = s.indexOf('const COVER'), en = s.indexOf('const EN'), after = s.indexOf('const AFTERWORD');
    const chapEnd = Math.min(...[cover, en, after, ko].filter(i => i > 0));
    const pages = {};
    const arts = [...s.slice(0, chapEnd).matchAll(/art: "([^"]+)"/g)];
    arts.forEach((m, i) => { pages[m[1]] = s.slice(m.index, i + 1 < arts.length ? arts[i + 1].index : chapEnd); });
    if (cover > 0) pages.cover = s.slice(cover, [en, after, ko].filter(i => i > cover).sort((a, b) => a - b)[0]);
    if (after > 0) pages.after = s.slice(after, ko);
    const body = Object.values(pages).join('\n');
    const block = s.slice(ko, s.indexOf('\n};', ko));
    const words = {};
    const problems = [];
    for (const pm of block.matchAll(/^    "([^"]+)": \[([\s\S]*?)\n    \]/gm)) {
        const key = pm[1];
        for (const g of pm[2].matchAll(/\{ w: "([^"]+)", k: "(?:[^"\\]|\\.)*", s: "((?:[^"\\]|\\.)*)" \}/g)) {
            total++;
            const [, w, sent] = g;
            (words[w] ||= []).push(key);
            if (!body.includes(sent)) problems.push(`예문이 본문에 없다 — ${key} / ${w} / ${sent.slice(0, 40)}`);
            else if (!(pages[key] || '').includes(sent)) problems.push(`예문이 다른 쪽 글이다 — ${key} / ${w}`);
            // 움직씨는 끝 글자가 바뀌고(터지다→터져, 긷다→길어, 트다→틀) 말 사이에 다른 말이 끼기도 한다
            // (무릎을 탁 쳤다, 발만 굴렀다). 그래서 앞 낱말은 토씨를 떼고, 끝 움직씨는 머리만 본다.
            const cho = ch => { const c = ch.charCodeAt(0) - 0xAC00; return c >= 0 && c < 11172 ? Math.floor(c / 588) : -1; };
            const parts = w.split(' ');
            const ok = parts.every((x, i) => {
                if (i < parts.length - 1 || !x.endsWith('다')) {
                    const base = i < parts.length - 1 ? x.replace(/(으로|을|를|이|가|은|는|만|도|에|의|로)$/, '') : x;
                    return sent.includes(base.slice(0, 2)) || (base.length === 1 && sent.includes(base));
                }
                let st = x.slice(0, -1).replace(/(하|되)$/, '') || x.slice(0, -1);
                if (st.length > 1 && st.endsWith('르')) st = st.slice(0, -1);   // 차오르다→차올라, 모르다→몰라
                if (st.length >= 2) return sent.includes(st.slice(0, -1));
                return [...sent].some(ch => cho(ch) === cho(st));
            });
            if (!ok) problems.push(`낱말이 예문에 안 보인다 — ${key} / ${w} / ${sent.slice(0, 40)}`);
        }
    }
    for (const [w, keys] of Object.entries(words)) if (keys.length > 1) problems.push(`같은 낱말을 두 번 풀었다 — ${w} (${keys.join(', ')})`);
    if (problems.length) { bad += problems.length; console.log('## ' + book); problems.forEach(p => console.log('   ' + p)); }
}
console.log(`\n본 책 ${seen}권, 낱말 ${total}개. 걸린 것 ${bad || '없다'}${bad ? '가지' : ''}.`);
