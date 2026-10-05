"use strict";

// 시 읽기 검사.
//   (1) 저작권 — 본문을 실은 시가 정말 실어도 되는 시인지
//   (2) 시마다 갖출 것 — 작품 설명(note)과 제 문제를 가지고 있는지
//   (3) 시집 — 실린 시가 실제로 있고, 시집 안에서 겹치지 않는지
//   (4) 참조 — 문제가 가리키는 시가 실제로 있는지, 모든 시가 어느 시집엔가는 실려 있는지
// 저작권 쪽은 눈으로 훑다 놓치면 그대로 사고라 기계가 막는다.
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// 사후 70년. 2013년에 50년에서 70년으로 늘릴 때 이미 풀린 것은 그대로 두었으므로,
// 1962년 12월 31일까지 돌아가신 분의 작품은 만료된 것으로 본다.
const EXPIRY_CUTOFF_YEAR = 1962;
// classic은 1900년 이전에 지어진 옛 작품(시조·고전시가·옛 한시)이다.
// 지은이의 사망 연도를 모르는 경우가 많지만 보호 기간이 끝난 것은 분명하다.
// included는 저작권이 아직 안 끝났지만(만료가 아니다) 사이트 운영자가 직접 판단해 싣기로 한 것이다.
// 다른 넷과 달리 "권리가 끝났다"는 뜻이 전혀 아니므로 poetDied 검사를 하지 않는다.
const ALLOWED_BASIS = new Set(["expired", "oral", "own-translation", "classic", "included"]);

const poetryDir = path.join(__dirname, "..", "learning", "literacy-numeracy", "story-books", "poetry");
const read = (name) => fs.readFileSync(path.join(poetryDir, name), "utf8");

const context = { window: {} };
vm.createContext(context);
for (const name of ["poems-index.js", "lessons.js"]) {
    vm.runInContext(read(name), context, { filename: name });
}

// 시는 차례표(제목·지은이·저작권)와 낱낱의 시 파일(본문·낱말·설명·문제)로 나뉘어 있다.
// 검사는 예전처럼 시 한 편을 통째로 놓고 봐야 하므로 여기서 도로 합친다.
const partsDir = path.join(poetryDir, "poems");
const poems = context.window.POETRY_POEM_INDEX.map((entry) => {
    const file = path.join(partsDir, entry.id, "poem.js");
    assert.ok(fs.existsSync(file), `시 ${entry.id}: poems/${entry.id}/poem.js가 없습니다.`);
    vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: `${entry.id}/poem.js` });
    const part = context.window.POETRY_PART[entry.id];
    assert.ok(part, `시 ${entry.id}: 본문 파일이 자기 자리에 등록되지 않았습니다.`);
    return { ...entry, ...part.poem, lines: part.poem.lines || [] };
});
const questions = context.window.POETRY_POEM_INDEX.flatMap((entry) => context.window.POETRY_PART[entry.id].questions || []);

// 차례표에 적어 둔 문제 수가 실제 문제 수와 어긋나면 목록 화면이 거짓말을 한다.
for (const entry of context.window.POETRY_POEM_INDEX) {
    const actual = (context.window.POETRY_PART[entry.id].questions || []).length;
    assert.strictEqual(entry.questionCount, actual,
        `시 ${entry.id}: 차례표의 문제 수(${entry.questionCount})와 실제 문제 수(${actual})가 다릅니다.`);
}

const books = context.window.POETRY_BOOKS;

assert.ok(Array.isArray(poems) && poems.length > 0, "시 창고가 비어 있습니다.");
assert.ok(Array.isArray(questions) && questions.length > 0, "문제 은행이 비어 있습니다.");
assert.ok(Array.isArray(books) && books.length > 0, "시집 차례표가 비어 있습니다.");

// ── 1. 시와 저작권 ───────────────────────────────────────────────
const poemIds = new Set();
for (const poem of poems) {
    const where = `시 ${poem.id || "(id 없음)"}`;
    assert.ok(poem.id && /^[a-z0-9-]+$/.test(poem.id), `${where}: id가 올바르지 않습니다.`);
    assert.ok(!poemIds.has(poem.id), `${where}: id가 겹칩니다.`);
    poemIds.add(poem.id);
    assert.ok(typeof poem.title === "string" && poem.title.trim(), `${where}: 제목이 없습니다.`);
    assert.ok(typeof poem.poet === "string" && poem.poet.trim(), `${where}: 지은이가 없습니다.`);
    assert.ok(typeof poem.point === "string" && poem.point.trim(), `${where}: 배울 점이 없습니다.`);
    // 시를 읽고 문제를 푼 뒤에 읽는 작품 설명. 이것이 없으면 마지막 화면이 텅 빈다.
    assert.ok(Array.isArray(poem.note) && poem.note.length >= 2,
        `${where}: 작품 설명(note)이 두 문단 이상 있어야 합니다 (지금 ${poem.note ? poem.note.length : 0}문단).`);
    for (const paragraph of poem.note) {
        assert.ok(typeof paragraph === "string" && paragraph.trim(),
            `${where}: 작품 설명에 빈 문단이 있습니다.`);
    }
    // 현대어 버전은 있어도 되고 없어도 된다. 있다면 원문과 같은 모양이어야 한다.
    if (poem.modern !== undefined) {
        assert.ok(Array.isArray(poem.modern) && poem.modern.length > 0,
            `${where}: modern을 두려면 줄이 하나 이상 있는 배열이어야 합니다.`);
        for (const line of poem.modern) {
            assert.strictEqual(typeof line, "string", `${where}: modern의 줄은 문자열이어야 합니다.`);
        }
    }
    assert.ok(["public", "protected"].includes(poem.rights), `${where}: rights는 public 또는 protected여야 합니다.`);

    if (poem.rights === "protected") {
        assert.strictEqual(poem.lines.length, 0,
            `${where}: 보호 기간 안에 있는 시인데 본문이 들어 있습니다. lines를 비워야 합니다.`);
        continue;
    }

    assert.ok(ALLOWED_BASIS.has(poem.basis),
        `${where}: 본문을 실으려면 basis가 expired·oral·own-translation 중 하나여야 합니다 (지금 ${poem.basis}).`);
    assert.ok(poem.lines.length > 0, `${where}: 본문이 비어 있습니다.`);

    if (poem.basis === "oral") {
        assert.strictEqual(poem.poetDied, null, `${where}: 구전 노래는 poetDied가 null이어야 합니다.`);
        continue;
    }

    if (poem.basis === "classic") {
        // 옛 작품은 지은이의 사망 연도를 모를 수 있다. 알면 적되, 근래 사람이면 막는다.
        assert.ok(poem.poetDied === null || (Number.isInteger(poem.poetDied) && poem.poetDied <= EXPIRY_CUTOFF_YEAR),
            `${where}: 옛 작품으로 두려면 poetDied가 null이거나 ${EXPIRY_CUTOFF_YEAR}년 이전이어야 합니다 (지금 ${poem.poetDied}).`);
        continue;
    }

    if (poem.basis === "included") {
        // 저작권이 끝나지 않은 걸 알면서 싣는 것이므로 사망 연도는 따지지 않는다.
        // 다만 실수로 이 갈래를 남용하지 않도록, 정말 사망 연도가 만료 이전이면(그럼 expired여야 맞다) 막아 둔다.
        assert.ok(!(Number.isInteger(poem.poetDied) && poem.poetDied <= EXPIRY_CUTOFF_YEAR),
            `${where}: poetDied(${poem.poetDied})가 이미 만료 연도 이전입니다. basis를 included가 아니라 expired로 적으세요.`);
        continue;
    }

    // expired와 own-translation은 둘 다 원작자의 보호 기간이 끝나 있어야 한다.
    assert.ok(Number.isInteger(poem.poetDied),
        `${where}: 사망 연도가 없습니다. 확인하지 않은 시는 본문을 실을 수 없습니다.`);
    assert.ok(poem.poetDied <= EXPIRY_CUTOFF_YEAR,
        `${where}: ${poem.poet}는 ${poem.poetDied}년에 돌아가셔서 아직 보호 기간 안입니다. rights를 protected로 바꾸고 본문을 빼세요.`);
}

// ── 2. 문제 ──────────────────────────────────────────────────────
// 이제 문제는 전부 어느 시엔가 붙어 있다. 시 없이 떠도는 문제는 없다.
const questionIds = new Set();
const seenSentences = new Map();
for (const question of questions) {
    const where = `문제 ${question.id || "(id 없음)"}`;
    assert.ok(question.id && /^[a-z0-9-]+$/.test(question.id), `${where}: id가 올바르지 않습니다.`);
    assert.ok(!questionIds.has(question.id), `${where}: id가 겹칩니다.`);
    questionIds.add(question.id);
    assert.ok(typeof question.category === "string" && question.category.trim(), `${where}: 영역이 없습니다.`);
    assert.ok(typeof question.prompt === "string" && question.prompt.trim(), `${where}: 안내문이 없습니다.`);
    assert.ok(typeof question.sentence === "string" && question.sentence.trim(), `${where}: 물음이 없습니다.`);
    assert.ok(typeof question.explanation === "string" && question.explanation.trim(), `${where}: 해설이 없습니다.`);
    assert.ok(Array.isArray(question.choices) && question.choices.length >= 2 && question.choices.length <= 4,
        `${where}: 보기는 2~4개여야 합니다 (지금 ${question.choices?.length}).`);
    assert.strictEqual(new Set(question.choices).size, question.choices.length, `${where}: 보기가 겹칩니다.`);
    assert.ok(question.choices.includes(question.answer), `${where}: 정답이 보기 안에 없습니다.`);
    // 물음 글이 겹치면 아이가 같은 물음을 두 번 보게 되고, 해설도 어느 쪽 것인지 헷갈린다.
    assert.ok(!seenSentences.has(question.sentence),
        `${where}: 물음 글이 ${seenSentences.get(question.sentence)}와 똑같습니다. 다르게 고쳐 주세요: "${question.sentence}"`);
    seenSentences.set(question.sentence, question.id);
    assert.ok(typeof question.poemId === "string" && question.poemId,
        `${where}: poemId가 없습니다. 문제는 반드시 시 하나에 붙어야 합니다.`);
    assert.ok(poemIds.has(question.poemId), `${where}: 없는 시를 가리킵니다: ${question.poemId}`);
}

// ── 3. 시집 ──────────────────────────────────────────────────────
const bookIds = new Set();
for (const book of books) {
    const where = `시집 ${book.id || "(id 없음)"}`;
    assert.ok(book.id && /^[a-z0-9-]+$/.test(book.id), `${where}: id가 올바르지 않습니다.`);
    assert.ok(!bookIds.has(book.id), `${where}: id가 겹칩니다.`);
    bookIds.add(book.id);
    assert.ok(typeof book.title === "string" && book.title.trim(), `${where}: 이름이 없습니다.`);
    assert.ok(Array.isArray(book.poemIds) && book.poemIds.length > 0, `${where}: 실린 시가 없습니다.`);
    assert.strictEqual(new Set(book.poemIds).size, book.poemIds.length, `${where}: 같은 시가 두 번 실려 있습니다.`);

    for (const id of book.poemIds) {
        assert.ok(poemIds.has(id), `${where}: 없는 시를 가리킵니다: ${id}`);
    }
}

// ── 4. 남은 것이 없는지 ──────────────────────────────────────────
const usedPoems = new Set(books.flatMap((book) => book.poemIds));
const questionCount = new Map();
for (const question of questions) {
    questionCount.set(question.poemId, (questionCount.get(question.poemId) || 0) + 1);
}
for (const poem of poems) {
    assert.ok(usedPoems.has(poem.id), `어느 시집에도 실리지 않은 시가 있습니다: ${poem.id}`);
    // 시 하나가 읽기 → 문제 → 작품 설명으로 이어지므로, 문제가 없으면 그 흐름이 끊긴다.
    assert.ok((questionCount.get(poem.id) || 0) >= 2,
        `시 ${poem.id}: 제 문제가 ${questionCount.get(poem.id) || 0}개뿐입니다. 두 개 이상이어야 합니다.`);
}

const publicPoems = poems.filter((poem) => poem.rights === "public");
const modernPoems = poems.filter((poem) => Array.isArray(poem.modern) && poem.modern.length > 0);
console.log(
    `시 읽기 검사 통과 — 시 ${poems.length}편(본문 게재 ${publicPoems.length}편, 현대어 병기 ${modernPoems.length}편), `
    + `문제 ${questions.length}개, 시집 ${books.length}권`
);
