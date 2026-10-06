// 확인 문제가 "안 읽고도 찍히는 꼴"이 아닌지 잰다. 문제를 새로 쓰거나 고친 뒤에 돌린다.
//   node tools/check-questions.mjs              poems/*/poem.js 전부
//   node tools/check-questions.mjs --ids a,b    이 시들만
//   node tools/check-questions.mjs --dump F     사람이 읽을 목록(물음·보기·★정답·해설)을 F 에 적는다
//
// 2026-10-06 사용자 지적: "한글 몰라도 미국인도 풀겠다", "착한 내용만 찍으면 다 정답이던데? 그러면 시를 뭐하러 읽냐".
// 그때 551문제 전부 정답이 1번이었고(화면은 보기를 섞지 않는다), 절반은 정답만 길었고, 오답은 엉뚱하거나 한심한 말이었다.
// 막힘(exit 1)은 꼴의 문제, "눈여겨볼 것"은 사람이 읽어 판단할 것. 말투(착한 말=정답)는 기계로 못 재니 --dump 로 뽑아 눈으로 본다.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import vm from "node:vm";

const ROOT = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const dumpTo = args.includes("--dump") ? args[args.indexOf("--dump") + 1] : null;
const onlyIds = args.includes("--ids") ? new Set(args[args.indexOf("--ids") + 1].split(",")) : null;

const ctx = { window: {}, console }; vm.createContext(ctx);
for (const n of ["poems-index.js", "lessons.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT, n), "utf8"), ctx);
const index = ctx.window.POETRY_POEM_INDEX; const books = ctx.window.POETRY_BOOKS;
const titleOf = Object.fromEntries(index.map(e => [e.id, e.title]));

const sets = [];
for (const e of index) {
    if (onlyIds && !onlyIds.has(e.id)) continue;
    vm.runInContext(fs.readFileSync(path.join(ROOT, "poems", e.id, "poem.js"), "utf8"), ctx);
    sets.push({ poemId: e.id, questions: ctx.window.POETRY_PART[e.id].questions || [] });
}

const CATS = new Set(["장면 확인", "표현 찾기", "마음 읽기", "견주어 읽기"]);
// 엉뚱한 오답의 전형. 이런 보기는 안 읽어도 걸러진다.
const BAD_CHOICE = ["잘못 적", "잘못 쓴", "글자 수", "아무 차이", "뜻이 반대", "실제로 일어", "진짜 ", "일 뿐", "뿐이에요", "뿐이다", "뿐이라", "그냥 ", "아무 뜻", "장난"];
// 낱말 찾기·세기 물음. 시가 하는 일을 묻지 않는다.
const BAD_STEM = ["몇 번", "몇 줄", "몇 수", "몇 개", "어떤 말로 시작", "어떤 말로 끝", "무엇으로 시작", "무엇으로 끝"];
const problems = []; const warns = [];
const ids = new Map(); const stems = new Map();
const posHist = [0, 0, 0, 0]; const rankHist = { longest: 0, shortest: 0, middle: 0 };
let total = 0; const dump = [];

for (const s of sets) {
    const where = `${s.poemId}(${titleOf[s.poemId] || "?"})`;
    const qs = s.questions || [];
    if (qs.length < 2) problems.push(`${where}: 문제가 ${qs.length}개`);
    if (qs.length > 4) problems.push(`${where}: 문제가 ${qs.length}개 — 화면은 넷까지만 보여 준다`);
    dump.push(`\n### ${s.poemId} | ${titleOf[s.poemId]} | q=${qs.length}`);
    const posInPoem = [];
    const answerTexts = qs.map(q => q.answer);
    qs.forEach((q, qi) => {
        total++;
        const w = `${where} #${qi + 1} [${q.id}]`;
        if (!q.id || !/^[a-z0-9-]+$/.test(q.id)) problems.push(`${w}: id 꼴`);
        if (ids.has(q.id)) problems.push(`${w}: id 겹침 (${ids.get(q.id)})`); ids.set(q.id, where);
        if (!CATS.has(q.category)) problems.push(`${w}: category "${q.category}"`);
        if (!q.sentence?.trim()) problems.push(`${w}: 물음 없음`);
        if (stems.has(q.sentence)) problems.push(`${w}: 물음 글 겹침 (${stems.get(q.sentence)})`); stems.set(q.sentence, where);
        if (!Array.isArray(q.choices) || q.choices.length < 3 || q.choices.length > 4) problems.push(`${w}: 보기 ${q.choices?.length}개`);
        else {
            if (new Set(q.choices).size !== q.choices.length) problems.push(`${w}: 보기 겹침`);
            const ai = q.choices.indexOf(q.answer);
            if (ai < 0) problems.push(`${w}: 정답이 보기에 없음`);
            else { posHist[ai]++; posInPoem.push(ai); }
            const lens = q.choices.map(c => c.length);
            const maxL = Math.max(...lens), minL = Math.min(...lens);
            if (maxL > 34) problems.push(`${w}: 보기 ${maxL}자 — 34자 넘음(한 줄에 안 들어간다)`);
            else if (maxL > 30) warns.push(`${w}: 보기 ${maxL}자 (30자 넘음)`);
            if (maxL - minL > 10) problems.push(`${w}: 보기 길이 차 ${maxL - minL}자 (${lens.join("/")})`);
            else if (maxL - minL > 8) warns.push(`${w}: 보기 길이 차 ${maxL - minL}자 (${lens.join("/")})`);
            const aL = q.answer.length; const others = lens.filter((_, i) => i !== ai);
            if (aL > Math.max(...others)) { rankHist.longest++; if (aL - Math.max(...others) >= 4) warns.push(`${w}: 정답이 가장 길다 (+${aL - Math.max(...others)}자)`); }
            else if (aL < Math.min(...others)) rankHist.shortest++; else rankHist.middle++;
            for (const c of q.choices) for (const b of BAD_CHOICE) if (c.includes(b)) problems.push(`${w}: 금지 보기 "${b}" — ${c}`);
            const negs = q.choices.filter(c => /지 않|안 |없어요$|못해요$|없다는 것$/.test(c));
            if (negs.length === 1 && negs[0] !== q.answer) warns.push(`${w}: 오답 하나만 부정문 — ${negs[0]}`);
            if (/다른 점|다르|차이/.test(q.sentence)) for (const c of q.choices) if (c !== q.answer && /둘 다|모두|셋 다|똑같/.test(c)) problems.push(`${w}: '다른 점' 물음에 오답 "${c}"`);
            const tail = c => c.replace(/[.!?]$/, "").slice(-2);
            const tails = q.choices.map(tail); const aT = tail(q.answer);
            if (tails.filter(t => t === aT).length === 1 && new Set(tails.filter(t => t !== aT)).size === 1) warns.push(`${w}: 정답만 말끝이 다르다 (${tails.join("/")})`);
            const stemWords = (q.sentence.match(/[가-힣]{2,}/g) || []).filter(x => x.length >= 3);
            const hits = q.choices.map(c => stemWords.filter(x => c.includes(x)).length);
            if (ai >= 0 && hits[ai] >= 2 && hits.every((h, i) => i === ai || h === 0)) warns.push(`${w}: 물음 낱말이 정답에만 (${stemWords.filter(x => q.answer.includes(x)).join(",")})`);
            answerTexts.forEach((a, j) => { if (j !== qi && a && (q.sentence.includes(a) || q.choices.some(c => c !== q.answer && c.includes(a)))) warns.push(`${w}: #${j + 1}의 답을 흘림`); });
        }
        if ((q.sentence || "").length > 60) problems.push(`${w}: 물음 ${q.sentence.length}자 — 60자 넘음`);
        else if ((q.sentence || "").length > 48) warns.push(`${w}: 물음 ${q.sentence.length}자`);
        for (const b of BAD_STEM) if ((q.sentence || "").includes(b)) problems.push(`${w}: 금지 물음 "${b}"`);
        if (!q.explanation || q.explanation.trim().length < 15) problems.push(`${w}: 해설 짧음`);
        if (q.explanation && q.answer && q.explanation.includes(q.answer)) warns.push(`${w}: 해설이 정답 글을 그대로 되풀이`);
        if (q.category === "견주어 읽기") {
            // 견주는 시는 같은 시집에서 앞에 실린 시여야 한다(아직 안 읽은 시와 견줄 수 없다). 같은 제목(눈·꽃)은 같은 시집 것을 먼저 찾는다.
            const refs = [...(q.sentence + q.choices.join("")).matchAll(/「([^」]+)」/g)].map(m => m[1]).filter(t => t !== titleOf[s.poemId]);
            for (const t of refs) {
                const mates = new Set(books.filter(b => b.poemIds.includes(s.poemId)).flatMap(b => b.poemIds));
                const refId = (index.find(e => e.title === t && mates.has(e.id)) || index.find(e => e.title === t))?.id;
                if (!refId) { warns.push(`${w}: 견주는 시 「${t}」가 차례표에 없음`); continue; }
                const ok = books.filter(b => b.poemIds.includes(s.poemId) && b.poemIds.includes(refId)).every(b => b.poemIds.indexOf(refId) < b.poemIds.indexOf(s.poemId));
                const shared = books.some(b => b.poemIds.includes(s.poemId) && b.poemIds.includes(refId));
                if (!shared) problems.push(`${w}: 「${t}」는 같은 시집에 없음`);
                else if (!ok) problems.push(`${w}: 「${t}」가 이 시보다 뒤에 실림`);
            }
        }
        dump.push(`[${q.category}] ${q.sentence}`);
        (q.choices || []).forEach((c) => dump.push(`   ${c === q.answer ? "★" : "-"} ${c}`));
        dump.push(`   » ${q.explanation}`);
    });
    const cnt = {}; for (const p of posInPoem) cnt[p] = (cnt[p] || 0) + 1;
    for (const [p, c] of Object.entries(cnt)) if (c >= 3) problems.push(`${where}: 정답 자리 ${+p + 1}번이 ${c}번`);
}
if (dumpTo) fs.writeFileSync(dumpTo, dump.join("\n"), "utf8");
console.log(`시 ${sets.length}편, 문제 ${total}개`);
console.log(`정답 자리: 1번 ${posHist[0]} / 2번 ${posHist[1]} / 3번 ${posHist[2]} / 4번 ${posHist[3]}`);
console.log(`정답 길이 순위: 가장 긺 ${rankHist.longest} / 가운데 ${rankHist.middle} / 가장 짧음 ${rankHist.shortest}`);
console.log(`\n== 막힘 ${problems.length}`); problems.forEach(p => console.log("  " + p));
console.log(`\n== 눈여겨볼 것 ${warns.length}`); warns.forEach(p => console.log("  " + p));
process.exitCode = problems.length ? 1 : 0;
