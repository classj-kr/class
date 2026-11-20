/**
 * 세계 명작 동화 — 책 만들기 도구
 *
 * 사용법:  node _build-book.mjs <책정의.mjs>
 *
 * 책 정의 파일은 default export 로 아래 모양의 객체를 내보냅니다.
 * {
 *   slug, title, titleEn, emoji,
 *   cover: [문단1, 문단2],          // 표지 오른쪽에 들어갈 배경 설명
 *   coverEmoji, coverPrompt,        // 표지 그림 프롬프트 (세로 2:3)
 *   artStyle,                       // 제미나이 공통 스타일 지시문
 *   characters,                     // 인물 설명 (없으면 생략)
 *   chapters: [
 *     // 한 장에 펼침면 하나
 *     { title: "1장 · ...", art: "01-xxx.png", emoji: "🐰",
 *       left: [...], right: [...], prompt: "그림 설명(영문)" },
 *     // 한 장에 펼침면 여럿 (그림도 그만큼 필요)
 *     { title: "2장 · ...", emoji: "🐰", beats: [
 *         { art: "02-xxx.png",   left: [...], right: [...], prompt: "..." },
 *         { art: "02-xxx-2.png", left: [...], right: [...], prompt: "..." }
 *     ] }
 *   ],
 *
 * 글 분량 기준 (재서 얻은 값):
 *   글상자 한 칸은 7.6줄, 한 줄에 18자(공백 제외)까지 들어간다.
 *   그러므로 left·right 각각 18자 이하 문단 6개가 알맞다.
 *   check-lines 도구로 미리 걸러 낼 수 있다.
 *   moral,                          // 마지막 펼침면 끝에 붙는 한 줄
 *   quiz: [{ q, choices:[3], answer }]
 * }
 *
 * 엔진(레이아웃·문항 채점·쪽번호)은 모든 책이 똑같이 씁니다.
 * 그림 비율: 본문 가로 2:1, 표지 세로 2:3, 마무리 가로 3:2.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const specPath = process.argv[2];
if (!specPath) {
    console.error('사용법: node _build-book.mjs <책정의.mjs>');
    process.exit(1);
}

const book = (await import(pathToFileURL(path.resolve(specPath)).href)).default;
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, '')), book.slug);

fs.mkdirSync(path.join(dir, 'images'), { recursive: true });

/* ---------------- 보기 섞기 ----------------
 * 정답을 늘 첫 번째에 두면 아이들이 내용을 읽지 않고 맨 위만 누른다.
 * 책 이름과 문항 번호로 자리를 정해서, 다시 만들어도 같은 자리에 오게 한다. */

function seedOf(text) {
    let h = 2166136261;
    for (const ch of text) {
        h ^= ch.codePointAt(0);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

let quizSeed = seedOf(book.slug);
const nextRand = (n) => {
    quizSeed = (Math.imul(quizSeed, 1103515245) + 12345) >>> 0;
    return quizSeed % n;
};

// 첫째·둘째·셋째 자리가 고르게 정답이 되도록 자리표를 먼저 만들고, 그 자리표를 섞는다.
// 고르게만 하면 0-1-2-0-1-2 처럼 눈에 보이는 규칙이 생겨서, 섞는 과정이 꼭 필요하다.
// 대신 같은 자리가 세 번 잇따라 나오면 그것도 눈에 띄므로, 그런 결과는 버리고 다시 섞는다.
const slots = book.quiz.map((_, i) => i % 3);
const hasRun = (a) => a.some((v, i) => i >= 2 && v === a[i - 1] && v === a[i - 2]);
for (let attempt = 0; attempt < 200; attempt++) {
    for (let i = slots.length - 1; i > 0; i--) {
        const j = nextRand(i + 1);
        [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    if (!hasRun(slots)) break;
}

book.quiz = book.quiz.map((item, qi) => {
    const rest = item.choices.filter((_, i) => i !== item.answer);
    const correct = item.choices[item.answer];
    if (nextRand(2) === 1) rest.reverse();
    const answer = slots[qi] % item.choices.length;
    const choices = [...rest.slice(0, answer), correct, ...rest.slice(answer)];
    return { ...item, choices, answer };
});

/* ---------------- app.js ---------------- */

// 한 장은 펼침면 하나로도, 여럿으로도 만들 수 있다.
// beats 배열을 주면 그대로 쓰고, 없으면 art/left/right 한 벌을 한 펼침면으로 본다.
function beatsOf(c) {
    const list = c.beats || [{ art: c.art, emoji: c.emoji, left: c.left, right: c.right, prompt: c.prompt }];
    return list.map(b => ({
        art: b.art,
        emoji: b.emoji || c.emoji || book.emoji,
        left: b.left,
        right: b.right,
        prompt: b.prompt
    }));
}

const chaptersData = book.chapters.map((c, i) => ({
    num: i + 1,
    title: c.title,
    beats: beatsOf(c).map(({ art, emoji, left, right }) => ({ art, emoji, left, right })),
    ...(i === book.chapters.length - 1 ? { moral: book.moral } : {})
}));

const appJs = `const CHAPTERS = ${JSON.stringify(chaptersData, null, 4)};

function artFrame(src, emoji) {
    return \`
        <div class="art-frame">
            <img src="images/\${src}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="art-fallback" style="display:none">\${emoji}</div>
        </div>\`;
}

function coverPage() {
    return \`
        <div class="page page-cover">
            <div class="story-page-left story-page-left-full">
                \${artFrame('cover.png', '${book.coverEmoji || book.emoji}')}
            </div>
            <div class="story-page-right">
                <h1>${book.title}</h1>
${book.cover.map(p => `                <p>${p}</p>`).join('\n')}
            </div>
        </div>\`;
}

function tocPage() {
    const itemHtml = s => \`
        <li>
            <button type="button" data-goto="\${s.num}">
                <span class="toc-num">\${s.num}</span>
                <span>
                    <strong>\${s.title.replace(/^\\d+장 · /, '')}</strong>
                </span>
            </button>
        </li>\`;
    const quizItemHtml = \`
        <li>
            <button type="button" data-goto-kind="quiz">
                <span class="toc-num">❓</span>
                <span>
                    <strong>이야기 문제</strong>
                </span>
            </button>
        </li>\`;
    const half = Math.ceil(CHAPTERS.length / 2);
    const leftItems = CHAPTERS.slice(0, half).map(itemHtml).join('');
    const rightItems = CHAPTERS.slice(half).map(itemHtml).join('') + quizItemHtml;
    return \`
        <div class="page page-toc">
            <div class="story-page-left">
                <h2>차례</h2>
                <ul class="toc-list">\${leftItems}</ul>
            </div>
            <div class="story-page-right">
                <ul class="toc-list">\${rightItems}</ul>
            </div>
        </div>\`;
}

function spreadPage(chapter, beat, isFirst, isLast) {
    const badgeHtml = isFirst ? \`<div class="spread-chapter-badge">\${chapter.title}</div>\` : '';
    const leftHtml = beat.left.map(p => \`<p>\${p}</p>\`).join('');
    let rightHtml = beat.right.map(p => \`<p>\${p}</p>\`).join('');
    // 교훈은 오른쪽 칸이 아니라 두 칸 아래 제 자리에 놓는다. 칸 안에 밀어 넣으면 넘친다.
    const moralHtml = isLast && chapter.moral ? \`<p class="fable-moral">\${chapter.moral}</p>\` : '';
    return \`
        <div class="page page-story\${moralHtml ? ' spread-final' : ''}">
            <div class="spread-art">
                \${badgeHtml}
                \${artFrame(beat.art, beat.emoji)}
            </div>
            <div class="spread-text">
                <div class="spread-text-left">\${leftHtml}</div>
                <div class="spread-text-right">\${rightHtml}</div>
                \${moralHtml}
            </div>
        </div>\`;
}

const QUIZ = ${JSON.stringify(book.quiz, null, 4)};

function quizPage() {
    const items = QUIZ.map((item, i) => \`
        <div class="quiz-item" data-qindex="\${i}">
            <p class="quiz-question">\${i + 1}. \${item.q}</p>
            <div class="quiz-choices">
                \${item.choices.map((c, ci) => \`<button type="button" class="quiz-choice" data-choice="\${ci}">\${c}</button>\`).join('')}
            </div>
        </div>\`).join('');
    return \`
        <div class="page page-quiz">
            <h2>이야기 문제</h2>
            <p class="quiz-intro-text" id="quizProgress">0 / 총 \${QUIZ.length}문항 완료</p>
            <div class="quiz-list">\${items}</div>
        </div>\`;
}

function endPage() {
    return \`
        <div class="page page-end">
            \${artFrame('end.png', '🌟')}
            <h2>${book.title}를 다 읽었어요!</h2>
            <a class="home-btn" href="../../../../../">학습 허브로 돌아가기</a>
        </div>\`;
}

const PAGES = [
    { kind: 'cover' },
    { kind: 'toc' },
    ...CHAPTERS.flatMap((chapter, ci) => chapter.beats.map((beat, i) => ({
        kind: 'spread', chapter, beat,
        isFirst: i === 0,
        isLast: ci === CHAPTERS.length - 1 && i === chapter.beats.length - 1
    }))),
    { kind: 'quiz' },
    { kind: 'end' }
];

const TWO_PAGE_KINDS = new Set(['spread', 'toc', 'cover']);

let folioCounter = 0;
const FOLIOS = PAGES.map(p => {
    const width = TWO_PAGE_KINDS.has(p.kind) ? 2 : 1;
    const start = folioCounter + 1;
    folioCounter += width;
    return { start, width };
});

function renderPage(page) {
    switch (page.kind) {
        case 'cover':
            return coverPage();
        case 'toc':
            return tocPage();
        case 'spread':
            return spreadPage(page.chapter, page.beat, page.isFirst, page.isLast);
        case 'quiz':
            return quizPage();
        case 'end':
            return endPage();
        default:
            return '';
    }
}

let current = 0;
let animating = false;

const spreadEl = document.getElementById('spread');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorEl = document.getElementById('pageIndicator');
const folioLeftEl = document.getElementById('folioLeft');
const folioRightEl = document.getElementById('folioRight');

function paint() {
    spreadEl.innerHTML = renderPage(PAGES[current]);
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === PAGES.length - 1;
    indicatorEl.textContent = \`\${current + 1} / \${PAGES.length}\`;

    const folio = FOLIOS[current];
    folioLeftEl.classList.toggle('folio-center', folio.width === 1);
    if (folio.width === 2) {
        folioLeftEl.textContent = folio.start;
        folioRightEl.textContent = folio.start + 1;
        folioLeftEl.hidden = false;
        folioRightEl.hidden = false;
    } else {
        folioLeftEl.textContent = folio.start;
        folioLeftEl.hidden = false;
        folioRightEl.hidden = true;
    }

    spreadEl.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => {
            const chapterNum = Number(btn.dataset.goto);
            const idx = PAGES.findIndex(p => p.kind === 'spread' && p.chapter.num === chapterNum && p.isFirst);
            if (idx >= 0) goTo(idx);
        });
    });
    spreadEl.querySelectorAll('[data-goto-kind]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = PAGES.findIndex(p => p.kind === btn.dataset.gotoKind);
            if (idx >= 0) goTo(idx);
        });
    });

    if (PAGES[current].kind === 'quiz') {
        initQuiz();
    }
}

function initQuiz() {
    let answeredCount = 0;
    const progressEl = document.getElementById('quizProgress');

    spreadEl.querySelectorAll('.quiz-item').forEach(item => {
        const qi = Number(item.dataset.qindex);
        const q = QUIZ[qi];
        item.querySelectorAll('.quiz-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                if (item.classList.contains('graded')) return;
                item.classList.add('graded');
                const chosen = Number(btn.dataset.choice);
                item.querySelectorAll('.quiz-choice').forEach(b => {
                    const ci = Number(b.dataset.choice);
                    if (ci === q.answer) b.classList.add('correct');
                    else if (ci === chosen) b.classList.add('incorrect');
                });
                answeredCount++;
                progressEl.textContent = \`\${answeredCount} / 총 \${QUIZ.length}문항 완료\`;
            });
        });
    });
}

function goTo(index) {
    if (animating || index === current || index < 0 || index >= PAGES.length) return;
    animating = true;
    const dir = index > current ? 'flip-next' : 'flip-prev';
    spreadEl.classList.add(dir);
    setTimeout(() => {
        current = index;
        paint();
    }, 230);
    setTimeout(() => {
        spreadEl.classList.remove('flip-next', 'flip-prev');
        animating = false;
    }, 480);
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

document.getElementById('tocLink').addEventListener('click', () => {
    const idx = PAGES.findIndex(p => p.kind === 'toc');
    if (idx >= 0) goTo(idx);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
});

paint();
`;

fs.writeFileSync(path.join(dir, 'app.js'), appJs);

/* ---------------- index.html ---------------- */

const indexHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${book.title}</title>
<link rel="stylesheet" href="../../../../../assets/fonts/google/gowun-batang.css?v=20261120">
<link rel="stylesheet" href="../../../../../assets/fonts/google/noto-serif-kr-400-500-600-700.css?v=20261120">
<link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="top-bar">
        <a class="back-link" href="../../../../../" aria-label="메인 화면으로 돌아가기">← 메인</a>
        <button class="toc-link" id="tocLink" type="button" aria-label="차례로 이동">☰ 차례</button>
    </div>

    <div class="book-stage">
        <div class="book" id="book">
            <div class="book-spread" id="spread"></div>
            <span class="folio folio-left" id="folioLeft"></span>
            <span class="folio folio-right" id="folioRight"></span>

            <button class="nav-btn nav-prev" id="prevBtn" type="button" aria-label="이전 페이지">‹</button>
            <button class="nav-btn nav-next" id="nextBtn" type="button" aria-label="다음 페이지">›</button>
        </div>

        <div class="page-indicator" id="pageIndicator"></div>
    </div>

    <script src="app.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);

/* ---------------- styles.css ---------------- */

const styleSrc = path.join(path.dirname(dir), 'jack-beanstalk', 'styles.css');
fs.copyFileSync(styleSrc, path.join(dir, 'styles.css'));

/* ---------------- IMAGE-PROMPTS.md ---------------- */

const prompts = `# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 ${book.chapters.length}개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
${book.chapters.reduce((a, c) => a + beatsOf(c).length, 0)}개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
그림이 펼침면 전체 폭을 가득 채우고, 그 아래에 이야기가 왼쪽·오른쪽으로 나뉘어 들어갑니다.

아래 프롬프트를 제미나이에 그대로 넣어서 생성한 뒤, 파일명을 정확히 맞춰서
\`images/\` 폴더에 저장하면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

권장 크기: **본문 그림은 가로 2 : 세로 1 비율**(가로로 아주 길쭉한 모양)로 만들어 주세요, PNG. 펼침면 전체 폭을 채우는 자리라 이렇게 길어야 잘리지 않아요. **표지(\`cover.png\`)는 세로 2 : 3 비율**, 마무리(\`end.png\`)는 가로 3 : 세로 2 정도면 됩니다.

마지막 장의 그림만 아래에 교훈 한 줄이 더 붙는 자리 때문에 위아래가 조금
잘려 나갑니다. 그림은 똑같이 2:1로 만들되, 중요한 것(얼굴 등)은 너무
위쪽이나 아래쪽에 두지 말고 가운데에 놓아 주세요.

## 공통 스타일 지시문 (모든 프롬프트 앞에 붙여서 사용하세요)

\`\`\`
${book.artStyle}
\`\`\`
${book.characters ? `
## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

\`\`\`
${book.characters}
\`\`\`
` : ''}
## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| \`images/cover.png\` (세로 2:3 비율) | ${book.coverPrompt} |
| \`images/end.png\` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

${book.chapters.map(c => `## ${c.title}

| 파일명 | 장면 |
|---|---|
${beatsOf(c).map(b => `| \`images/${b.art}\` | ${b.prompt} |`).join('\n')}
`).join('\n')}
## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
`;
fs.writeFileSync(path.join(dir, 'IMAGE-PROMPTS.md'), prompts);

/* ---------------- 목록 페이지에 등록 ---------------- */

const listPath = path.join(path.dirname(dir), 'index.html');
let list = fs.readFileSync(listPath, 'utf8');
if (!list.includes(`href="${book.slug}/"`)) {
    const card = `            <a class="book-card" href="${book.slug}/">
                <span class="book-cover" data-title="${book.title}"><img src="${book.slug}/images/cover.webp" alt="" loading="lazy"></span>
                <span class="book-title">${book.title}</span>
            </a>
`;
    // 모음집(<b>모음집</b>) 카드들 앞에 끼워 넣는다
    const anchor = list.indexOf('            <a class="book-card"');
    const collectionIdx = list.indexOf('<b>모음집</b>');
    let insertAt;
    if (collectionIdx > 0) {
        insertAt = list.lastIndexOf('            <a class="book-card"', collectionIdx);
    } else {
        insertAt = list.indexOf('    </div>', anchor);
    }
    list = list.slice(0, insertAt) + card + list.slice(insertAt);
    // 다른 창이 index.html을 붙들고 있으면 쓰기가 실패한다. 몇 번 다시 해 보고,
    // 그래도 안 되면 책 자체는 이미 만들어졌으니 알려만 주고 넘어간다.
    let shelved = false;
    for (let tries = 0; tries < 20 && !shelved; tries++) {
        try {
            fs.writeFileSync(listPath, list);
            shelved = true;
        } catch {
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150);
        }
    }
    if (!shelved) console.log(`  ⚠ 책장 등록 실패 — index.html에 ${book.slug} 카드를 손으로 넣어야 함`);
}

/* ---------------- 결과 ---------------- */

const chars = book.chapters.reduce(
    (a, c) => a + beatsOf(c).reduce((s, b) => s + b.left.join('').length + b.right.join('').length, 0), 0);
console.log(`✔ ${book.title} (${book.slug})`);
const spreads = book.chapters.reduce((a, c) => a + beatsOf(c).length, 0);
console.log(`  장 ${book.chapters.length} · 펼침면 ${spreads} · 본문 ${chars}자 · 그림 ${spreads + 2}장 · 문항 ${book.quiz.length}개`);
