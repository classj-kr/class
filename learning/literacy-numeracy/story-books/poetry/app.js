(() => {
    "use strict";

    const POEM_PROGRESS_KEY = "poetryPoemProgressV1";

    // 색인 데이터: poems-index.js에서 POETRY_POEM_INDEX, lessons.js에서 POETRY_BOOKS를 받음
    const poems = Array.isArray(window.POETRY_POEM_INDEX) ? window.POETRY_POEM_INDEX : [];
    const poemById = new Map(poems.map((p) => [p.id, p]));
    const books = Array.isArray(window.POETRY_BOOKS) ? window.POETRY_BOOKS : [];

    const questionsByPoem = new Map();
    const quizWrongChoices = new Map();
    const quizPickedChoices = new Map();

    const currentScriptEl = document.currentScript || document.querySelector('script[src*="app.js"]');
    const here = currentScriptEl ? currentScriptEl.src.replace(/[^/]*$/, "") : "";
    const version = (currentScriptEl?.src.split("?v=")[1] || "");
    const loading = new Map();

    function fetchScript(file) {
        if (loading.has(file)) return loading.get(file);
        const job = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = here + file + (version ? "?v=" + version : "");
            script.onload = resolve;
            script.onerror = () => reject(new Error(file + "을 불러오지 못했습니다."));
            document.head.append(script);
        });
        loading.set(file, job);
        return job;
    }

    // 시 한 편의 본문, 낱말, 해설, 문제 로드
    async function loadPoem(poem) {
        if (!poem) return null;
        if (poem.lines && questionsByPoem.has(poem.id)) return poem;
        try {
            await fetchScript(`poems/${poem.id}/poem.js`);
            const part = (window.POETRY_PART || {})[poem.id];
            if (part) {
                Object.assign(poem, part.poem);
                if (!poem.lines) poem.lines = [];
                questionsByPoem.set(poem.id, part.questions || []);
            }
        } catch (e) {
            console.error(e);
        }
        return poem;
    }

    // 진도 저장 및 확인
    function getProgress() {
        try {
            return JSON.parse(localStorage.getItem(POEM_PROGRESS_KEY)) || {};
        } catch {
            return {};
        }
    }

    function savePoemSolved(poemId, questionId) {
        const prog = getProgress();
        const cur = prog[poemId] || { solved: [], wrong: {} };
        if (!cur.solved.includes(questionId)) {
            cur.solved.push(questionId);
        }
        if (!cur.wrong) cur.wrong = {};
        if (quizWrongChoices.has(questionId)) {
            cur.wrong[questionId] = Array.from(quizWrongChoices.get(questionId));
        }
        const qs = questionsByPoem.get(poemId) || [];
        if (qs.length > 0 && cur.solved.length >= qs.length) {
            cur.done = true;
        }
        prog[poemId] = cur;
        try {
            localStorage.setItem(POEM_PROGRESS_KEY, JSON.stringify(prog));
        } catch (e) {}
    }

    function isPoemDone(poemId) {
        const prog = getProgress();
        return Boolean(prog[poemId]?.done);
    }

    function isBookDone(book) {
        if (!book || !book.poemIds || book.poemIds.length === 0) return false;
        return book.poemIds.every((id) => isPoemDone(id));
    }

    // 소재별 목록
    const TOPICS = [
        "봄", "여름", "가을", "겨울", "가족", "동물", "밤과 달", "고향",
        "그리움", "이별", "자연", "다짐", "시대", "나라", "사랑", "옛이야기", "놀이", "기다림"
    ];
    const poemsByTopic = new Map(
        TOPICS.map((topic) => [topic, poems.filter((poem) => (poem.topics || []).includes(topic))])
    );

    // DOM 요소 캐시
    const $ = (id) => document.getElementById(id);
    const tocBtn = $("tocBtn");
    const shelfScreen = $("shelfScreen");
    const orderTabBtn = $("orderTabBtn");
    const topicTabBtn = $("topicTabBtn");
    const orderView = $("orderView");
    const topicView = $("topicView");
    const bookShelf = $("bookShelf");
    const topicChips = $("topicChips");
    const topicPoemList = $("topicPoemList");

    const bookScreen = $("bookScreen");
    const bgm = $("bgm");
    let resumeMusicOnShelf = false;
    const spreadEl = $("spread");
    const folioLeftEl = $("folioLeft");
    const folioRightEl = $("folioRight");
    const prevBtn = $("prevBtn");
    const nextBtn = $("nextBtn");
    const pageIndicator = $("pageIndicator");

    // 앱 상태
    let currentBookIndex = -1;
    let currentSpreadIndex = 0;
    let spreads = [];
    let currentBookPoems = [];
    let activeTopic = TOPICS[0];

    /* ── 책갈피 & 펼침면 생성 ─────────────────────────────────── */
    function buildSpreads(book, bookPoems) {
        const list = [];

        // 1. 표지 + 차례 (Spread 0)
        list.push({
            kind: "cover",
            book,
            poems: bookPoems
        });

        // 2. 각 시마다 3개의 펼침면:
        //    (1) 시 읽기: 왼쪽(본문) / 오른쪽(감상 길잡이 & 시어 사전)
        //    (2) 문제 풀기: 왼쪽(1, 2번 문제) / 오른쪽(3, 4번 문제)
        //    (3) 작품 해설: 왼쪽(해설 전반부) / 오른쪽(해설 후반부 & 생각해 볼 거리)
        bookPoems.forEach((poem, pIdx) => {
            const qs = questionsByPoem.get(poem.id) || [];
            list.push({
                kind: "read",
                book,
                poem,
                pIdx,
                poems: bookPoems
            });
            list.push({
                kind: "quiz",
                book,
                poem,
                pIdx,
                questions: qs,
                poems: bookPoems
            });
            list.push({
                kind: "note",
                book,
                poem,
                pIdx,
                poems: bookPoems
            });
        });

        return list;
    }

    /* ── 렌더링 헬퍼 ────────────────────────────────────────── */
    function escapeHtml(text) {
        return (text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    // 시 본문 행/연 분리
    function formatPoemLines(lines) {
        if (!lines || lines.length === 0) {
            return `<div class="poem-stanza"><p>본문을 준비하고 있습니다.</p></div>`;
        }
        let html = '<div class="poem-stanza">';
        let prevEmpty = false;
        lines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) {
                if (!prevEmpty) {
                    html += '</div><div class="poem-stanza">';
                    prevEmpty = true;
                }
            } else {
                html += `<div class="poem-line">${escapeHtml(line)}</div>`;
                prevEmpty = false;
            }
        });
        html += "</div>";
        return html;
    }

    /* ── 펼침면 렌더링 함수들 ─────────────────────────────────── */

    // 1. 표지 & 목차
    function renderCoverSpread(s) {
        const { book, poems } = s;
        const volumeBadge = `제 ${currentBookIndex + 1} 권`;

        const leftHtml = `
            <div class="story-page-left-full">
                <div class="cover-art-box">
                    <span class="cover-badge">${escapeHtml(volumeBadge)}</span>
                    <h2 class="cover-title">${escapeHtml(book.title)}</h2>
                </div>
            </div>
        `;

        const tocItemsHtml = poems.map((p, idx) => {
            const done = isPoemDone(p.id);
            return `
                <li>
                    <button class="book-toc-btn" type="button" data-jump-spread="${idx * 3 + 1}">
                        <span class="toc-num">${idx + 1}</span>
                        <div class="toc-info">
                            <span class="toc-title">${escapeHtml(p.title)} ${done ? "✓" : ""}</span>
                            <span class="toc-poet">${escapeHtml(p.poet || "")}</span>
                        </div>
                    </button>
                </li>
            `;
        }).join("");

        const rightHtml = `
            <div class="story-page-right">
                <div class="toc-header">
                    <h2>차례</h2>
                </div>
                <ul class="book-toc-list">
                    ${tocItemsHtml}
                </ul>
            </div>
        `;

        return leftHtml + rightHtml;
    }

    // 2. 시 읽기
    function renderReadSpread(s) {
        const { poem } = s;

        const leftHtml = `
            <div class="story-page-left">
                <h2 class="poem-reading-title">${escapeHtml(poem.title)}</h2>
                <div class="poem-reading-byline">${escapeHtml(poem.poet || "")}${poem.year ? ` · ${poem.year}` : ""}</div>
                <div class="poem-body-container">
                    ${formatPoemLines(poem.lines)}
                </div>
            </div>
        `;

        // 오른쪽 페이지: 감상 길잡이 & 시어 사전
        let wordsHtml = "";
        if (poem.words && poem.words.length > 0) {
            const dlInner = poem.words.map(w => `
                <dt>${escapeHtml(w.word)}</dt>
                <dd>${escapeHtml(w.mean)}</dd>
            `).join("");
            wordsHtml = `
                <div class="poem-words-box">
                    <dl class="poem-words-dl">${dlInner}</dl>
                </div>
            `;
        }

        const rightHtml = `
            <div class="story-page-right">
                <div class="poem-point-box">
                    <p class="point-text">${escapeHtml(poem.point || "시의 분위기와 시인의 마음을 가만히 헤아려 보세요.")}</p>
                </div>
                ${wordsHtml}
            </div>
        `;

        let artHtml = "";
        if (poem.illustration) {
            artHtml = `
                <div class="read-spread-art" aria-hidden="true">
                    <img class="read-spread-art-img" src="${escapeHtml(poem.illustration)}?v=20260910-rightcorner" alt="" />
                </div>
            `;
        }

        return leftHtml + rightHtml + artHtml;
    }

    // 3. 문제 풀기 (왼쪽 Q1~Q2, 오른쪽 Q3~Q4)
    function renderQuizSpread(s) {
        const { questions = [] } = s;
        const qLeft = questions.slice(0, 2);
        const qRight = questions.slice(2, 4);

        const prog = getProgress()[s.poem.id]?.solved || [];

        function renderQuestionCard(q, num) {
            if (!q) return "";
            const isSolved = prog.includes(q.id) || quizPickedChoices.has(q.id);
            const savedWrongs = getProgress()[s.poem.id]?.wrong?.[q.id] || [];
            const memoryWrongs = quizWrongChoices.get(q.id) ? Array.from(quizWrongChoices.get(q.id)) : [];
            const wrongSet = new Set([...savedWrongs, ...memoryWrongs]);

            const choicesHtml = (q.choices || []).map((c) => {
                const isCorrect = c === q.answer;
                let stateCls = "";
                if (isSolved && isCorrect) {
                    stateCls = " correct";
                } else if (wrongSet.has(c)) {
                    stateCls = " incorrect";
                }
                return `
                    <button class="quiz-choice${stateCls}" type="button"
                            data-qid="${q.id}" data-choice="${escapeHtml(c)}" data-correct="${isCorrect ? '1' : '0'}">
                        ${escapeHtml(c)}
                    </button>
                `;
            }).join("");

            return `
                <div class="quiz-item${isSolved ? ' graded' : ''}" data-qid="${q.id}">
                    <p class="quiz-question">${num}. ${escapeHtml(q.sentence || q.prompt || "")}</p>
                    <div class="quiz-choices">
                        ${choicesHtml}
                    </div>
                </div>
            `;
        }

        const leftCardsHtml = qLeft.map((q, idx) => renderQuestionCard(q, idx + 1)).join("");
        const rightCardsHtml = qRight.map((q, idx) => renderQuestionCard(q, idx + 3)).join("");

        const leftHtml = `
            <div class="story-page-left page-quiz-col">
                ${leftCardsHtml || '<p>등록된 문제가 없습니다.</p>'}
            </div>
        `;

        const rightHtml = `
            <div class="story-page-right page-quiz-col">
                ${rightCardsHtml}
            </div>
        `;

        return leftHtml + rightHtml;
    }

    // 4. 작품 해설 (왼쪽 전반부, 오른쪽 후반부)
    function renderNoteSpread(s) {
        const { poem } = s;
        const notes = Array.isArray(poem.note) ? poem.note : (poem.note ? [poem.note] : []);

        const half = Math.ceil(notes.length / 2);
        const leftParas = notes.slice(0, half);
        const rightParas = notes.slice(half);

        const leftHtml = `
            <div class="story-page-left">
                <h3 class="note-head-title">작품 해설</h3>
                <div class="note-paras">
                    ${leftParas.map(p => `<p class="note-p">${escapeHtml(p)}</p>`).join("") || '<p class="note-p">해설을 준비하고 있습니다.</p>'}
                </div>
            </div>
        `;

        const rightHtml = `
            <div class="story-page-right">
                <div class="note-paras">
                    ${rightParas.map(p => `<p class="note-p">${escapeHtml(p)}</p>`).join("")}
                </div>
            </div>
        `;

        return leftHtml + rightHtml;
    }

    /* ── 화면 갱신 (Paint) ─────────────────────────────────────── */
    function paint() {
        if (!spreads.length || currentSpreadIndex < 0 || currentSpreadIndex >= spreads.length) {
            return;
        }

        const s = spreads[currentSpreadIndex];

        // 1. 펼침면 본문 HTML 주입
        let html = "";
        switch (s.kind) {
            case "cover":
                html = renderCoverSpread(s);
                break;
            case "read":
                html = renderReadSpread(s);
                break;
            case "quiz":
                html = renderQuizSpread(s);
                break;
            case "note":
                html = renderNoteSpread(s);
                break;
        }
        spreadEl.innerHTML = html;

        // 2. 인디케이터 및 쪽수(Folio)
        pageIndicator.textContent = `${currentSpreadIndex + 1} / ${spreads.length}`;

        if (s.kind === "cover") {
            folioLeftEl.textContent = "";
            folioRightEl.textContent = "";
        } else {
            folioLeftEl.textContent = String(currentSpreadIndex * 2);
            folioRightEl.textContent = String(currentSpreadIndex * 2 + 1);
        }

        // 3. 이전/다음 버튼 활성/비활성
        prevBtn.disabled = currentSpreadIndex === 0;
        nextBtn.disabled = currentSpreadIndex === spreads.length - 1;

        // 4. 이벤트 바인딩
        attachSpreadEvents(s);

    }

    function attachSpreadEvents(s) {
        // A. 표지 시작 버튼
        const startBtn = $("startReadingBtn");
        if (startBtn) {
            startBtn.onclick = () => goTo(1, "next");
        }

        // B. 차례 목록 점프 버튼
        spreadEl.querySelectorAll("[data-jump-spread]").forEach((btn) => {
            btn.onclick = () => {
                const target = parseInt(btn.getAttribute("data-jump-spread"), 10);
                if (!isNaN(target)) goTo(target, target > currentSpreadIndex ? "next" : "prev");
            };
        });

        // C. 시 읽기 -> 문제 풀기 버튼
        const goQuizBtn = $("btnGoQuiz");
        if (goQuizBtn) {
            goQuizBtn.onclick = () => goTo(currentSpreadIndex + 1, "next");
        }

        // D. 문제 풀기 -> 해설 읽기 버튼
        const goNoteBtn = $("btnGoNote");
        if (goNoteBtn) {
            goNoteBtn.onclick = () => goTo(currentSpreadIndex + 1, "next");
        }

        // E. 퀴즈 보기 클릭 시 채점
        if (s.kind === "quiz") {
            spreadEl.querySelectorAll(".quiz-choice").forEach((btn) => {
                btn.onclick = () => {
                    const item = btn.closest(".quiz-item");
                    if (!item || item.classList.contains("graded")) return;

                    const isCorrect = btn.getAttribute("data-correct") === "1";
                    const qid = btn.getAttribute("data-qid");
                    const choice = btn.getAttribute("data-choice");

                    if (!isCorrect) {
                        // 틀리면 그 보기만 빨갛게 남기고, 맞는 것을 고를 때까지 다시 고르게 한다. (오답 색칠 유지)
                        btn.classList.add("incorrect");
                        if (!quizWrongChoices.has(qid)) {
                            quizWrongChoices.set(qid, new Set());
                        }
                        quizWrongChoices.get(qid).add(choice);
                        savePoemSolved(s.poem.id, qid);
                        return;
                    }

                    // 정답을 맞추면 정답 초록색 표시 및 채점 완료(graded) 처리, 기존 오답 빨간색은 그대로 유지!
                    btn.classList.add("correct");
                    item.classList.add("graded");
                    quizPickedChoices.set(qid, choice);

                    savePoemSolved(s.poem.id, qid);
                };
            });
        }

        // F. 해설 -> 다음 시 또는 권 마무리
        const goNextAfterNote = $("btnGoNextAfterNote");
        if (goNextAfterNote) {
            goNextAfterNote.onclick = () => goTo(currentSpreadIndex + 1, "next");
        }

    }

    // 페이지 이동
    function goTo(targetSpreadIndex, animDirection) {
        if (targetSpreadIndex < 0 || targetSpreadIndex >= spreads.length) return;
        const dir = animDirection || (targetSpreadIndex > currentSpreadIndex ? "next" : "prev");

        spreadEl.classList.remove("flip-next", "flip-prev");
        // 트리거 리플로우
        void spreadEl.offsetWidth;
        spreadEl.classList.add(dir === "next" ? "flip-next" : "flip-prev");

        currentSpreadIndex = targetSpreadIndex;
        paint();
    }

    /* ── 책 열기 ─────────────────────────────────────────────── */
    async function openBook(bookIndex, targetPoemIndex = -1) {
        const book = books[bookIndex];
        if (!book) return;

        resumeMusicOnShelf = Boolean(bgm && !bgm.paused);
        document.body.dataset.musicPausedForReading = "true";
        bgm?.pause();

        currentBookIndex = bookIndex;

        // UI 모드 전환: 책장 숨김, 책 뷰 표시
        shelfScreen.hidden = true;
        shelfScreen.classList.add("hidden");
        bookScreen.hidden = false;
        bookScreen.classList.remove("hidden");
        if (tocBtn) tocBtn.hidden = false;
        window.scrollTo(0, 0);

        try {
            history.pushState({ book: bookIndex }, "");
        } catch (e) {}

        // 로딩 화면 표시
        spreadEl.innerHTML = `
            <div class="story-page-left-full" style="grid-column: 1 / -1; align-items:center; justify-content:center;">
                <p style="font-size: 18px; color: var(--wood); font-weight: 700;">시집을 펼치는 중입니다...</p>
            </div>
        `;
        pageIndicator.textContent = "";

        // 해당 책에 수록된 시들을 모두 로드
        const poemsInBook = book.poemIds.map((id) => poemById.get(id)).filter(Boolean);
        await Promise.all(poemsInBook.map((p) => loadPoem(p)));
        currentBookPoems = poemsInBook;

        // 펼침면 생성
        spreads = buildSpreads(book, poemsInBook);

        if (targetPoemIndex >= 0 && targetPoemIndex < poemsInBook.length) {
            currentSpreadIndex = targetPoemIndex * 3 + 1;
        } else {
            currentSpreadIndex = 0;
        }

        paint();
    }

    /* ── 책장 화면 (Shelf Lobby) ──────────────────────────────── */
    function showShelf(activeTab = "order") {
        delete document.body.dataset.musicPausedForReading;
        bookScreen.hidden = true;
        bookScreen.classList.add("hidden");
        shelfScreen.hidden = false;
        shelfScreen.classList.remove("hidden");
        if (tocBtn) tocBtn.hidden = true;
        window.scrollTo(0, 0);

        if (resumeMusicOnShelf && bgm) bgm.play().catch(() => {});
        resumeMusicOnShelf = false;

        setShelfTab(activeTab);
    }

    function setShelfTab(tab) {
        if (tab === "order") {
            orderTabBtn.classList.add("is-active");
            orderTabBtn.setAttribute("aria-selected", "true");
            topicTabBtn.classList.remove("is-active");
            topicTabBtn.setAttribute("aria-selected", "false");
            orderView.classList.remove("hidden");
            topicView.classList.add("hidden");
            renderBookShelf();
        } else {
            topicTabBtn.classList.add("is-active");
            topicTabBtn.setAttribute("aria-selected", "true");
            orderTabBtn.classList.remove("is-active");
            orderTabBtn.setAttribute("aria-selected", "false");
            topicView.classList.remove("hidden");
            orderView.classList.add("hidden");
            renderTopicView();
        }
    }

    // 책장 그리드 렌더링
    function renderBookShelf() {
        bookShelf.innerHTML = books.map((b, bIdx) => {
            const done = isBookDone(b);
            const volumeBadge = `제 ${bIdx + 1} 권`;

            // 해당 책의 시 목록 가져오기
            const bookPoems = b.poemIds.map((id) => poemById.get(id)).filter(Boolean);

            const poemItemsHtml = bookPoems.map((p, idx) => `
                <li class="cover-poem-item">
                    <div class="cover-poem-title-row">
                        <span class="cover-poem-num">${idx + 1}.</span>
                        <span class="cover-poem-title">${escapeHtml(p.title)}</span>
                    </div>
                    <div class="cover-poem-author-row">
                        <span class="cover-poem-poet">${escapeHtml(p.poet || "")}</span>
                    </div>
                </li>
            `).join("");

            return `
                <div class="book-card ${done ? 'is-done' : ''}" role="button" tabindex="0" data-book-idx="${bIdx}">
                    <div class="book-cover">
                        <div class="book-cover-header">
                            <span class="book-cover-badge">${escapeHtml(volumeBadge)}</span>
                            ${done ? '<span class="book-cover-done-badge">완독 ✓</span>' : ""}
                        </div>
                        <ol class="book-cover-poem-list">
                            ${poemItemsHtml}
                        </ol>
                    </div>
                    <div class="book-title-meta">
                        <p class="book-card-title">${escapeHtml(b.title)}</p>
                    </div>
                </div>
            `;
        }).join("");

        bookShelf.querySelectorAll("[data-book-idx]").forEach((card) => {
            const idx = parseInt(card.getAttribute("data-book-idx"), 10);
            const open = () => openBook(idx);
            card.onclick = open;
            card.onkeydown = (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open();
                }
            };
        });
    }

    // 소재별 찾기 뷰 렌더링
    function renderTopicView() {
        topicChips.innerHTML = TOPICS.map((t) => `
            <button class="topic-chip ${t === activeTopic ? 'is-active' : ''}" type="button" data-topic="${t}">
                ${t}
            </button>
        `).join("");

        topicChips.querySelectorAll("[data-topic]").forEach((btn) => {
            btn.onclick = () => {
                activeTopic = btn.getAttribute("data-topic");
                renderTopicView();
            };
        });

        const list = poemsByTopic.get(activeTopic) || [];
        if (list.length === 0) {
            topicPoemList.innerHTML = `<li style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 30px;">등록된 시가 없습니다.</li>`;
            return;
        }

        topicPoemList.innerHTML = list.map((p) => {
            const done = isPoemDone(p.id);
            return `
                <li class="topic-poem-card" role="button" tabindex="0" data-poem-id="${p.id}">
                    <div>
                        <div class="topic-poem-title">${escapeHtml(p.title)} ${done ? "✓" : ""}</div>
                        <div class="topic-poem-poet">${escapeHtml(p.poet || "")}</div>
                    </div>
                </li>
            `;
        }).join("");

        topicPoemList.querySelectorAll("[data-poem-id]").forEach((card) => {
            const poemId = card.getAttribute("data-poem-id");
            const handleSelect = () => {
                // 이 시가 속한 책 찾기
                let bIdx = books.findIndex((b) => b.poemIds.includes(poemId));
                if (bIdx < 0) bIdx = 0;
                const book = books[bIdx];
                const pIdxInBook = book.poemIds.indexOf(poemId);
                openBook(bIdx, pIdxInBook >= 0 ? pIdxInBook : 0);
            };
            card.onclick = handleSelect;
            card.onkeydown = (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect();
                }
            };
        });
    }

    /* ── 상단 네비게이션 & 키보드 & 터치 제스처 ───────────────── */
    orderTabBtn.onclick = () => setShelfTab("order");
    topicTabBtn.onclick = () => setShelfTab("topic");

    tocBtn.onclick = () => goTo(0, "prev");

    // 브라우저 뒤로가기 시 책 읽는 중이면 책장으로 돌아가기
    window.addEventListener("popstate", () => {
        if (!bookScreen.hidden && !bookScreen.classList.contains("hidden")) {
            showShelf();
        }
    });

    // 공용 뒤로가기 단추(assets/site-back-navigation.js) 연동
    // 책을 보고 있는 중이면 책장으로 돌아가고, 책장이면 사이트 메인으로 돌아감
    window.addEventListener("sitebackrequest", (e) => {
        if (!bookScreen.hidden && !bookScreen.classList.contains("hidden")) {
            e.preventDefault();
            showShelf();
        }
    });

    // 화면 왼쪽 위 화살표 링크가 직접 눌렸을 때의 대비
    document.querySelector(".top-bar a.back-link")?.addEventListener("click", (e) => {
        if (!bookScreen.hidden && !bookScreen.classList.contains("hidden")) {
            e.preventDefault();
            showShelf();
        }
    });

    prevBtn.onclick = () => goTo(currentSpreadIndex - 1, "prev");
    nextBtn.onclick = () => goTo(currentSpreadIndex + 1, "next");

    // 키보드 방향키 이동
    window.addEventListener("keydown", (e) => {
        if (bookScreen.hidden) return;
        if (e.key === "ArrowLeft" || e.key === "PageUp") {
            e.preventDefault();
            goTo(currentSpreadIndex - 1, "prev");
        } else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
            e.preventDefault();
            goTo(currentSpreadIndex + 1, "next");
        }
    });

    // 모바일 터치 스와이프
    let touchStartX = 0;
    let touchStartY = 0;
    spreadEl.addEventListener("touchstart", (e) => {
        if (e.touches && e.touches[0]) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    spreadEl.addEventListener("touchend", (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                if (dx > 0) {
                    goTo(currentSpreadIndex - 1, "prev");
                } else {
                    goTo(currentSpreadIndex + 1, "next");
                }
            }
        }
    }, { passive: true });

    /* ── 초기 실행 ─────────────────────────────────────────────── */
    showShelf("order");

})();
