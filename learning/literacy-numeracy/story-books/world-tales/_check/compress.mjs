/* 압축 서술 검사 — 쓰기: node _check/compress.mjs [책...] [--top N]
   한 쪽에 사건이 몰려 문장마다 이야기가 한 칸씩 넘어가는 자리를 고른다.
   빨간 구두 7쪽(고치기 전)이 본보기다.
       카렌은 그 신을 아주 아꼈습니다. … 그런데 얼마 뒤 어머니가 몸져누웠습니다.
       카렌은 곁에서 밤을 새웠지요. 하지만 어머니는 끝내 일어나지 못했습니다.
       카렌은 그만 혼자가 되었지요.
   재는 것 세 가지
     1. 서술 문장 수 — 따옴표 안 대사를 빼고 센다. 대사는 장면을 멈춰 세운다.
     2. 시간 건너뛰기 — "얼마 뒤·며칠 뒤·이듬해·그날부터…"는 둘, "어느 날·끝내·마침내…"는 하나.
     3. 대사가 한 줄도 없는 쪽 — 둘을 더한다.
   기계는 후보만 낸다. 걸린 쪽은 사람이 읽고 가린다. */
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const ROOT = path.join(DIR, '..');
const args = process.argv.slice(2);
const topAt = args.indexOf('--top');
const TOP = topAt >= 0 ? Number(args[topAt + 1]) : 40;
const names = args.filter((a, i) => !a.startsWith('--') && (topAt < 0 || i !== topAt + 1));
const books = names.length ? names
    : fs.readdirSync(ROOT).filter(d => d !== '_check' && fs.existsSync(path.join(ROOT, d, 'app.js')));

const 큰건너뛰기 = ['얼마 뒤', '얼마 후', '며칠 뒤', '며칠 만에', '몇 해', '몇 달', '이듬해', '세월이', '그 뒤로',
    '그날부터', '여러 날', '다음 날', '이튿날', '오랫동안', '해마다', '날마다', '한 해', '그 해', '그해'];
const 작은건너뛰기 = ['어느 날', '이윽고', '마침내', '끝내', '드디어', '그러던', '그길로', '곧바로', '금세'];

const grab = (src, name) => {
    const i = src.indexOf('const ' + name + ' = [');
    if (i < 0) return null;
    try { return eval('(' + src.slice(src.indexOf('[', i), src.indexOf('\n];', i) + 2) + ')'); } catch (e) { return null; }
};
const T = x => (typeof x === 'string' ? x : x.t);

function measure(paras) {
    const text = paras.map(T).join(' ');
    const quotes = (text.match(/"[^"]*"|'[^']*'/g) || []).length;
    const narr = text.replace(/"[^"]*"|'[^']*'/g, ' ');
    const sentences = narr.split(/(?<=[.!?…])\s+/).map(s => s.trim()).filter(s => s.length > 3);
    let jump = 0;
    const hits = [];
    for (const k of 큰건너뛰기) if (narr.includes(k)) { jump += 2; hits.push(k); }
    for (const k of 작은건너뛰기) if (narr.includes(k)) { jump += 1; hits.push(k); }
    const score = sentences.length + jump + (quotes === 0 ? 2 : 0);
    return { score, sentences: sentences.length, quotes, jump, hits };
}

const rows = [];
for (const b of books) {
    const src = fs.readFileSync(path.join(ROOT, b, 'app.js'), 'utf8');
    const CH = grab(src, 'CHAPTERS') || grab(src, 'FABLES');
    if (!CH) continue;
    let folio = 5;
    CH.forEach(c => c.beats.forEach(bt => {
        for (const [side, paras] of [['왼', bt.left], ['오른', bt.right]]) {
            const m = measure(paras);
            rows.push({ b, folio: side === '왼' ? folio : folio + 1, art: bt.art, ...m, first: T(paras[0]).slice(0, 34) });
        }
        folio += 2;
    }));
}
rows.sort((x, y) => y.score - x.score);
console.log('점수 = 서술 문장 + 건너뛰기 + (대사 없으면 2)\n');
rows.slice(0, TOP).forEach(r => console.log(
    String(r.score).padStart(3) + '  ' + r.b.padEnd(17) + String(r.folio).padStart(2) + '쪽  문장' + r.sentences
    + ' 대사' + r.quotes + ' 건너뛰기[' + r.hits.join('·') + ']  ' + r.first));
const n = rows.length;
const s = rows.map(r => r.score).sort((a, b) => a - b);
console.log('\n쪽 ' + n + '개 · 가운뎃값 ' + s[Math.floor(n / 2)] + ' · 위 10% ' + s[Math.floor(n * 0.9)]);
