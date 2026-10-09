(function vocabularyStudyApp() {
    "use strict";

    const DATA_URL = "assets/data/english-vocabulary-3000-v2.json";
    const CURATED_EXAMPLES_URL = "assets/data/curated-examples-v1.json?v=20260910a";
    const IMAGE_MANIFEST_URL = "assets/data/vocabulary-word-images-v1.json?v=20260908a";
    const SPELLING_GAME_URL = "assets/data/vocabulary-spelling-game-v1.json";
    const DETAIL_URL_TEMPLATE = "assets/data/details/level-{level}.json?v=20260928a";
    const IMAGE_BASE_URL = "assets/images/";
    const GAME_TIME_LIMIT = 15;
    const LESSON_SIZE = 20;
    const STAGES = [
        { code: "elementary", name: "Elementary School", description: "800 words · LEVEL 01-04", cardLabel: "Elementary School Word", levels: [1, 2, 3, 4] },
        { code: "middle_common", name: "Middle & High Common", description: "1,200 words · LEVEL 05-10", cardLabel: "Middle & High Common Word", levels: [5, 6, 7, 8, 9, 10] },
        { code: "advanced", name: "High School Electives", description: "1,000 words · LEVEL 11-15", cardLabel: "High School Elective Word", levels: [11, 12, 13, 14, 15] },
    ];
    const STAGE_CARD_LABELS = Object.fromEntries(STAGES.map((stage) => [stage.code, stage.cardLabel]));
    const POS_NAMES = {
        "명사": "noun", "동사": "verb", "형용사": "adjective", "부사": "adverb",
        "대명사": "pronoun", "전치사": "preposition", "접속사": "conjunction",
        "감탄사": "exclamation", "관사": "article", "한정사": "determiner", "수사": "number",
    };
    const RELATED_MEANING_OVERRIDES = new Map(Object.entries({
        "roofer": "지붕을 이는 사람",
        "roofing": "지붕 재료; 지붕 공사",
        "lifter": "들어 올리는 사람이나 장치",
        "lift up": "들어 올리다",
    }));

    const RELATED_TYPE_NAMES = {
        "유의어": "similar", "반의어": "opposite", "관련어": "related", "파생어": "word family",
        "다른 표기": "other spelling", "변화형": "word form",
    };

    function levelName(level) {
        return `Level ${level}`;
    }

    function applyCuratedExamples(data, curatedData) {
        const entries = Array.isArray(curatedData?.examples) ? curatedData.examples : [];
        if (!Array.isArray(data?.words) || !entries.length) return 0;
        const wordsById = new Map(data.words.map((word) => [String(word.id), word]));
        let appliedCount = 0;
        entries.forEach((entry) => {
            const word = wordsById.get(String(entry?.id));
            const en = String(entry?.en || "").trim();
            const ko = String(entry?.ko || "").trim();
            const meanings = Array.isArray(entry?.meanings)
                ? entry.meanings.map((meaning) => String(meaning || "").trim()).filter(Boolean)
                : [];
            if (!word) return;
            let changed = false;
            if (meanings.length) {
                word.meanings = meanings;
                changed = true;
            }
            if (en && ko) {
                word.example = {
                    en,
                    ko,
                    source: "curated_school_example",
                    translationType: "translation",
                };
                changed = true;
            }
            if (changed) appliedCount += 1;
        });
        return appliedCount;
    }

    const core = window.VocabularyCore;
    const elements = Object.fromEntries([
        "levelScreen", "lessonScreen", "studyScreen", "bandListScreen", "stageGroups", "loadingState", "toast",
        "totalKnown", "overallPercent", "overallBar", "totalUnknown", "backToLevels",
        "shuffleButton", "lessonQuizStartButton", "studyStage", "studyTitle", "cardPosition", "levelStatus", "sessionBar",
        "flashcard", "cardBadge", "wordText", "posText", "meaningText", "exampleBlock", "exampleLabel", "exampleText",
        "exampleKo", "relatedBlock", "relatedWords", "answerLayout", "wordImageBlock", "wordImage",
        "detailPanel", "detailToggle", "detailToggleWord", "detailBody",
        "previousButton", "speakButton", "exampleSpeakButton",
        "nextButton", "unknownButton", "knownButton", "reviewUnknownButton", "studyMessage",
        "lessonQuizScreen", "backFromLessonQuiz", "lessonQuizStage", "lessonQuizTitle", "lessonQuizRestartButton",
        "lessonQuizStats", "lessonQuizQuestionNumber", "lessonQuizQuestionTotal", "lessonQuizScore", "lessonQuizStreak",
        "lessonQuizQuestionPanel", "lessonQuizWord", "lessonQuizSpeakButton", "lessonQuizChoices", "lessonQuizFeedback", "lessonQuizNextButton",
        "lessonQuizResultPanel", "lessonQuizResultTitle", "lessonQuizResultScore", "lessonQuizResultAccuracy",
        "lessonQuizResultBestStreak", "lessonQuizWrongList", "lessonQuizRetryWrongButton", "lessonQuizContinueButton",
        "gameScreen", "backFromGame", "gameLevelButtons",
        "gameQuestionNumber", "gameScore", "gameStreak", "gameTimer", "gameTimerBar",
        "gameWord", "gameSpeakButton", "gameChoices", "gameFeedback", "gameNextButton", "gameResetButton",
        "gameQuestionPanel", "gameResultPanel", "gameResultScore", "gameResultAccuracy",
        "gameResultBestStreak", "gameWrongList", "gameRetryWrongButton", "gamePlayAgainButton",
        "spellingGameStartButton", "spellingScreen", "backFromSpelling",
        "spellingResetButton", "spellingLevelSelect", "spellingQuestionNumber", "spellingScore",
        "spellingStreak", "spellingQuestionPanel", "spellingClueCard", "spellingImage", "spellingMeaning", "spellingHint", "spellingInput", "spellingBuiltWord", "spellingTileRack",
        "spellingHintButton", "spellingSpeakButton", "spellingCheckButton", "spellingFeedback",
        "spellingNextButton", "spellingResultPanel", "spellingResultScore", "spellingResultAccuracy",
        "spellingResultBestStreak", "spellingWrongList", "spellingRetryWrongButton", "spellingPlayAgainButton",
        "spellingReviewButton", "spellingStoredWrongCount", "spellingModeLabel", "spellingTitle",
        "viewAllWordsButton", "backFromBandList", "bandListTitle", "bandSearchInput", "bandListCount", "bandListBody",
        "recommendedLessonButton", "recommendedLessonTitle", "recommendedLessonMeta",
        "backFromLessons", "lessonStage", "lessonScreenTitle", "lessonGrid",
    ].map((id) => [id, document.getElementById(id)]));
    elements.backLink = document.querySelector(".back-link");

    const state = {
        data: null,
        imageMap: new Map(),
        levels: new Map(),
        progress: loadProgress(),
        currentLevel: null,
        currentLesson: 0,
        recommendedLesson: null,
        currentWords: [],
        currentIndex: 0,
        revealed: false,
        unknownOnly: false,
        shuffleEnabled: false,
        detailOpen: true,
        detailCache: new Map(),
        detailLoading: new Map(),
        lessonQuizPool: [],
        lessonQuizTarget: null,
        lessonQuizChoices: [],
        lessonQuizQuestionNumber: 0,
        lessonQuizScore: 0,
        lessonQuizStreak: 0,
        lessonQuizBestStreak: 0,
        lessonQuizAnswered: false,
        lessonQuizHadWrong: false,
        lessonQuizWrongWords: [],
        gameLevel: 0,
        gamePool: [],
        gameTargetPool: [],
        gameTarget: null,
        gameChoices: [],
        gamePreviousId: null,
        gameRoundLength: 10,
        gameAskedIds: new Set(),
        gameWrongWords: [],
        gameQuestionNumber: 0,
        gameScore: 0,
        gameStreak: 0,
        gameBestStreak: 0,
        gameTimeLeft: GAME_TIME_LIMIT,
        gameAnswered: false,
        gameHadWrong: false,
        gameTimerId: null,
        spellingIds: new Set(),
        spellingLevel: 0,
        spellingPool: [],
        spellingTargetPool: [],
        spellingTarget: null,
        spellingRoundLength: 10,
        spellingAskedIds: new Set(),
        spellingWrongEntries: [],
        spellingQuestionNumber: 0,
        spellingScore: 0,
        spellingStreak: 0,
        spellingBestStreak: 0,
        spellingAnswered: false,
        spellingWrongProgress: loadSpellingWrongProgress(),
        spellingReviewMode: false,
        wordMeaningMap: new Map(),
        currentBandWords: [],
    };

    function loadProgress() { return {}; }

    function saveProgress() {}

    function loadSpellingWrongProgress() { return {}; }

    function saveSpellingWrongProgress() {}

    function showToast(message) {
        elements.toast.textContent = message;
        elements.toast.classList.add("show");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => elements.toast.classList.remove("show"), 1800);
    }

    function renderOverallProgress() {
        if (!state.data) return;
        const summary = core.summarizeWords(state.data.words, state.progress);
        const percent = Math.round((summary.known / state.data.totalWords) * 100);
        elements.totalKnown.textContent = summary.known.toLocaleString("ko-KR");
        elements.totalUnknown.textContent = summary.unknown.toLocaleString("ko-KR");
        elements.overallPercent.textContent = `${percent}%`;
        elements.overallBar.style.width = `${percent}%`;
    }

    function lessonsForLevel(level) {
        const words = state.levels.get(Number(level)) || [];
        const lessons = [];
        for (let index = 0; index < words.length; index += LESSON_SIZE) {
            lessons.push(words.slice(index, index + LESSON_SIZE));
        }
        return lessons;
    }

    function currentLessonWords() {
        return lessonsForLevel(state.currentLevel)[state.currentLesson] || [];
    }

    function findRecommendedLesson(level = null) {
        const levels = level ? [Number(level)] : STAGES.flatMap((stage) => stage.levels);
        let reviewFallback = null;
        for (const candidateLevel of levels) {
            const lessons = lessonsForLevel(candidateLevel);
            for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex += 1) {
                const summary = core.summarizeWords(lessons[lessonIndex], state.progress);
                if (summary.unseen > 0) return { level: candidateLevel, lessonIndex };
                if (!reviewFallback && summary.unknown > 0) reviewFallback = { level: candidateLevel, lessonIndex };
            }
        }
        const lastLevel = levels[levels.length - 1];
        return reviewFallback || { level: lastLevel, lessonIndex: lessonsForLevel(lastLevel).length - 1 };
    }

    function renderRecommendedLesson() {
        state.recommendedLesson = findRecommendedLesson();
        const { level, lessonIndex } = state.recommendedLesson;
        const words = lessonsForLevel(level)[lessonIndex] || [];
        const summary = core.summarizeWords(words, state.progress);
        elements.recommendedLessonTitle.textContent = `${levelName(level)} · ${lessonIndex + 1}차시`;
        elements.recommendedLessonMeta.textContent = summary.unseen > 0
            ? `${words.length}단어 · 약 10분 · 새 단어 ${summary.unseen}개`
            : `${words.length}단어 · 복습할 단어 ${summary.unknown}개`;
    }

    function createLevelButton(level, words) {
        const summary = core.summarizeWords(words, state.progress);
        const lessons = lessonsForLevel(level);
        const completedLessons = lessons.filter((lesson) => core.summarizeWords(lesson, state.progress).unseen === 0).length;
        const percent = Math.round(((summary.known + summary.unknown) / words.length) * 100);
        const button = document.createElement("button");
        button.type = "button";
        button.className = `level-button ${core.stageClass(words[0].stageCode)}`;
        button.setAttribute("aria-label", `${levelName(level)}, ${lessons.length}차시 중 ${completedLessons}차시 완료`);
        button.innerHTML = `
            <span class="level-number">LEVEL ${String(level).padStart(2, "0")}</span>
            <strong class="level-name">${levelName(level)}</strong>
            <span class="level-plan">${lessons.length}차시 · 차시당 ${LESSON_SIZE}단어</span>
            <span class="level-progress" aria-hidden="true"><span style="width:${percent}%"></span></span>
            <span class="level-count">${completedLessons}/${lessons.length}차시 완료 · 복습 ${summary.unknown}</span>
        `;
        button.addEventListener("click", () => openLevelPicker(level));
        return button;
    }

    function renderLevelGroups() {
        elements.stageGroups.replaceChildren();
        STAGES.forEach((stage) => {
            const section = document.createElement("details");
            section.className = "stage-group";
            section.open = false;

            const heading = document.createElement("summary");
            heading.className = "stage-heading";
            heading.innerHTML = `
                <div class="stage-heading-copy">
                    <h2>${stage.name}</h2>
                    <p>${stage.description}</p>
                </div>
            `;

            const grid = document.createElement("div");
            grid.className = "level-grid";
            stage.levels.forEach((level) => grid.appendChild(createLevelButton(level, state.levels.get(level))));
            section.append(heading, grid);
            section.addEventListener("toggle", () => {
                if (!section.open) return;
                elements.stageGroups.querySelectorAll(".stage-group[open]").forEach((other) => {
                    if (other !== section) other.open = false;
                });
            });
            elements.stageGroups.appendChild(section);
        });
    }

    function renderBandList(filter = "") {
        const query = String(filter || "").trim().toLowerCase();
        const visibleWords = query
            ? state.currentBandWords.filter((word) => (
                word.word.toLowerCase().includes(query)
                || word.meanings.some((meaning) => meaning.toLowerCase().includes(query))
            ))
            : state.currentBandWords;
        const originalPositions = new Map(state.currentBandWords.map((word, index) => [String(word.id), index + 1]));
        const fragment = document.createDocumentFragment();
        visibleWords.forEach((word) => {
            const row = document.createElement("tr");
            const rowNumber = document.createElement("th");
            rowNumber.scope = "row";
            rowNumber.textContent = String(originalPositions.get(String(word.id)));
            const level = document.createElement("td");
            level.className = "sheet-level";
            level.textContent = `Level ${word.globalLevel}`;
            const english = document.createElement("td");
            english.className = "sheet-word";
            english.lang = "en";
            const wordLabel = document.createElement("span");
            wordLabel.textContent = word.word;
            const pronunciationButton = document.createElement("button");
            pronunciationButton.type = "button";
            pronunciationButton.className = "sheet-speak-button";
            pronunciationButton.textContent = "🔊";
            pronunciationButton.setAttribute("aria-label", `${word.word} 듣기`);
            pronunciationButton.addEventListener("click", () => speakText(word.word));
            english.append(wordLabel, pronunciationButton);
            const meaning = document.createElement("td");
            meaning.textContent = word.meanings.join("; ");
            row.append(rowNumber, level, english, meaning);
            fragment.appendChild(row);
        });
        elements.bandListBody.replaceChildren(fragment);
        elements.bandListCount.textContent = query
            ? `${visibleWords.length.toLocaleString("en-US")} of ${state.currentBandWords.length.toLocaleString("en-US")} words`
            : `${state.currentBandWords.length.toLocaleString("en-US")} words`;
    }

    function openBandList() {
        state.currentBandWords = [...state.data.words];
        elements.bandListTitle.textContent = "All 3,000 Words";
        elements.bandSearchInput.value = "";
        elements.levelScreen.hidden = true;
        elements.bandListScreen.hidden = false;
        renderBandList();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function backFromBandList() {
        elements.bandListScreen.hidden = true;
        elements.levelScreen.hidden = false;
        state.currentBandWords = [];
        renderLevelGroups();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    function renderLessonPicker(level) {
        const words = state.levels.get(Number(level)) || [];
        const lessons = lessonsForLevel(level);
        const recommended = findRecommendedLesson(level);
        const levelOffset = [...state.levels.keys()]
            .filter((key) => key < Number(level))
            .reduce((sum, key) => sum + state.levels.get(key).length, 0);
        elements.lessonStage.textContent = STAGE_CARD_LABELS[words[0]?.stageCode] || "Official 2022 List";
        elements.lessonScreenTitle.textContent = levelName(level);
        elements.lessonGrid.replaceChildren(...lessons.map((lessonWords, lessonIndex) => {
            const summary = core.summarizeWords(lessonWords, state.progress);
            const touched = summary.known + summary.unknown;
            const percent = Math.round((touched / lessonWords.length) * 100);
            const isRecommended = recommended.lessonIndex === lessonIndex;
            const card = document.createElement("article");
            card.className = "lesson-card";
            const studyButton = document.createElement("button");
            studyButton.type = "button";
            studyButton.className = `lesson-button ${summary.unseen === 0 ? "complete" : ""} ${isRecommended ? "recommended" : ""}`.trim();
            studyButton.setAttribute("aria-label", `${lessonIndex + 1}차시 단어 학습, ${lessonWords.length}단어, ${touched}개 확인`);
            studyButton.innerHTML = `
                <span class="lesson-number">${lessonIndex + 1}차시 ${isRecommended ? '<b>추천</b>' : ''}</span>
                <strong>${levelOffset + lessonIndex * LESSON_SIZE + 1}–${levelOffset + lessonIndex * LESSON_SIZE + lessonWords.length}번 단어</strong>
                <span class="lesson-progress" aria-hidden="true"><span style="width:${percent}%"></span></span>
                <small>${summary.unseen === 0 ? "완료" : `${touched}/${lessonWords.length} 확인`} · 복습 ${summary.unknown}</small>
            `;
            studyButton.addEventListener("click", () => openLesson(level, lessonIndex));
            const quizButton = document.createElement("button");
            quizButton.type = "button";
            quizButton.className = "lesson-quiz-launch-button";
            quizButton.textContent = `${lessonWords.length}문제 바로 풀기`;
            quizButton.setAttribute("aria-label", `${lessonIndex + 1}차시 ${lessonWords.length}문제 바로 풀기`);
            quizButton.addEventListener("click", () => openLessonQuiz(level, lessonIndex));
            card.append(studyButton, quizButton);
            return card;
        }));
    }

    function openLevelPicker(level) {
        state.currentLevel = Number(level);
        renderLessonPicker(state.currentLevel);
        elements.levelScreen.hidden = true;
        elements.studyScreen.hidden = true;
        elements.lessonScreen.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function openLesson(level, lessonIndex, options = {}) {
        state.currentLevel = Number(level);
        state.currentLesson = Number(lessonIndex);
        const baseWords = currentLessonWords();
        const unknownOnly = Boolean(options.unknownOnly);
        const unknownWords = baseWords.filter((word) => state.progress[String(word.id)]?.status === "unknown");
        if (unknownOnly && !unknownWords.length) {
            showToast("이 차시에 ‘아직 어려워요’로 표시한 단어가 없습니다.");
            return;
        }
        state.unknownOnly = unknownOnly;
        const lessonWords = unknownOnly ? unknownWords : [...baseWords];
        state.currentWords = state.shuffleEnabled ? core.shuffleWords(lessonWords) : lessonWords;
        state.currentIndex = 0;
        state.revealed = false;
        elements.levelScreen.hidden = true;
        elements.lessonScreen.hidden = true;
        elements.studyScreen.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
        renderStudyCard();
        renderStoredSpellingWrong();
    }

    function backFromLessons() {
        elements.lessonScreen.hidden = true;
        elements.levelScreen.hidden = false;
        renderLevelGroups();
        renderRecommendedLesson();
        renderOverallProgress();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function currentWord() {
        return state.currentWords[state.currentIndex] || null;
    }

    function updateRevealState() {
        const word = currentWord();
        if (!word) return;
        elements.flashcard.classList.toggle("revealed", state.revealed);
        elements.detailPanel.hidden = !state.revealed || !detailFor(word);
        elements.flashcard.setAttribute("aria-pressed", String(state.revealed));
        elements.flashcard.setAttribute(
            "aria-label",
            state.revealed ? `${word.word}, meaning and example shown` : `${word.word}, tap to see the meaning and example`,
        );
        elements.meaningText.setAttribute("aria-hidden", String(!state.revealed));
        elements.exampleBlock.setAttribute("aria-hidden", String(!state.revealed));
        elements.relatedBlock.setAttribute("aria-hidden", String(!state.revealed || elements.relatedBlock.hidden));
        elements.wordImageBlock.setAttribute("aria-hidden", String(!state.revealed || elements.wordImageBlock.hidden));
        elements.exampleSpeakButton.disabled = !state.revealed || !word.example?.en;
    }

    function updateShuffleToggle() {
        elements.shuffleButton.setAttribute("aria-checked", String(state.shuffleEnabled));
        elements.shuffleButton.setAttribute("aria-label", `순서 섞기 ${state.shuffleEnabled ? "켜짐" : "꺼짐"}`);
    }

    function loadDetailLevel(level) {
        const key = Number(level);
        if (state.detailCache.has(key)) return Promise.resolve(state.detailCache.get(key));
        if (state.detailLoading.has(key)) return state.detailLoading.get(key);
        const url = DETAIL_URL_TEMPLATE.replace("{level}", String(key).padStart(2, "0"));
        const request = fetch(url)
            .then((response) => (response.ok ? response.json() : null))
            .then((payload) => {
                const entries = payload && typeof payload.entries === "object" ? payload.entries : {};
                const map = new Map(Object.entries(entries));
                state.detailCache.set(key, map);
                return map;
            })
            .catch(() => {
                const map = new Map();
                state.detailCache.set(key, map);
                return map;
            })
            .finally(() => state.detailLoading.delete(key));
        state.detailLoading.set(key, request);
        return request;
    }

    function detailFor(word) {
        if (!word) return null;
        const map = state.detailCache.get(Number(word.globalLevel));
        return map?.get(String(word.id)) || null;
    }

    const DETAIL_TAG_CLASS = { "반의어": "antonym", "변화형": "form", "파생어": "form" };

    function detailSection(title, items, buildItem) {
        const list = (Array.isArray(items) ? items : []).filter(Boolean);
        if (!list.length) return null;
        const section = document.createElement("section");
        section.className = "detail-section";
        const heading = document.createElement("h3");
        heading.textContent = title;
        const ul = document.createElement("ul");
        list.forEach((item) => {
            const li = document.createElement("li");
            buildItem(li, item);
            ul.append(li);
        });
        section.append(heading, ul);
        return section;
    }

    function appendPair(li, en, ko) {
        if (en) {
            const enNode = document.createElement("span");
            enNode.className = "detail-en";
            enNode.textContent = en;
            li.append(enNode);
        }
        if (ko) {
            const koNode = document.createElement("span");
            koNode.className = "detail-ko";
            koNode.textContent = ko;
            li.append(koNode);
        }
    }

    function buildDetailBody(detail) {
        const fragment = document.createDocumentFragment();
        const sections = [
            detailSection("개요", detail.overview, (li, text) => { li.textContent = text; }),
            detailSection("다른 쉬운 표현", detail.easy, (li, item) => {
                const label = document.createElement("b");
                label.textContent = item.word;
                li.append(label);
                appendPair(li, item.en, item.ko);
            }),
            detailSection("어원", detail.etymology, (li, text) => { li.textContent = text; }),
            detailSection("뜻", detail.meanings, (li, text) => { li.textContent = text; }),
            detailSection("예문", detail.examples, (li, item) => appendPair(li, item.en, item.ko)),
            detailSection("함께 익히기", detail.together, (li, item) => {
                const tag = document.createElement("span");
                tag.className = `detail-tag ${DETAIL_TAG_CLASS[item.type] || ""}`.trim();
                tag.textContent = item.type || "연관어";
                const label = document.createElement("b");
                label.textContent = item.word;
                li.append(tag, label);
                if (item.ko) li.append(document.createTextNode(` - ${item.ko}`));
                if (item.en) {
                    const enNode = document.createElement("span");
                    enNode.className = "detail-en";
                    enNode.textContent = item.en;
                    li.append(document.createTextNode(" / "), enNode);
                }
            }),
        ].filter(Boolean);
        sections.forEach((section) => {
            if (section.querySelector("h3").textContent === "뜻") section.classList.add("detail-meanings");
            if (section.querySelector("h3").textContent === "다른 쉬운 표현") section.classList.add("detail-easy");
        });
        sections.forEach((section) => fragment.append(section));
        return fragment;
    }

    function renderDetailPanel(word) {
        const detail = detailFor(word);
        elements.detailPanel.hidden = !detail || !state.revealed;
        if (!detail) {
            elements.detailBody.replaceChildren();
            return;
        }
        elements.detailToggleWord.textContent = word.word;
        elements.detailToggle.setAttribute("aria-expanded", String(state.detailOpen));
        elements.detailBody.hidden = !state.detailOpen;
        elements.detailBody.replaceChildren(buildDetailBody(detail));
    }

    function toggleDetailPanel() {
        state.detailOpen = !state.detailOpen;
        elements.detailToggle.setAttribute("aria-expanded", String(state.detailOpen));
        elements.detailBody.hidden = !state.detailOpen;
    }

    function renderWordImage(word) {
        const image = state.imageMap.get(String(word.id));
        elements.wordImageBlock.hidden = !image;
        elements.answerLayout.classList.toggle("has-image", Boolean(image));
        if (!image) {
            elements.wordImage.removeAttribute("src");
            return;
        }
        elements.wordImage.src = `${IMAGE_BASE_URL}${image.file}`;
    }

    function renderStudyCard() {
        const word = currentWord();
        if (!word) return;
        const status = state.progress[String(word.id)]?.status || "unseen";
        const baseWords = currentLessonWords();
        const summary = core.summarizeWords(baseWords, state.progress);
        const completion = Math.round(((state.currentIndex + 1) / state.currentWords.length) * 100);

        elements.studyStage.textContent = `${STAGE_CARD_LABELS[word.stageCode] || word.stage} · 2022 개정 교육과정`;
        elements.studyTitle.textContent = `${levelName(word.globalLevel)} · ${state.currentLesson + 1}차시${state.unknownOnly ? " 복습" : ""}`;
        elements.cardPosition.textContent = `${state.currentIndex + 1} / ${state.currentWords.length}`;
        elements.levelStatus.textContent = `확인 ${summary.known + summary.unknown}/${baseWords.length} · 복습 ${summary.unknown}`;
        elements.sessionBar.style.width = `${completion}%`;
        elements.wordText.textContent = word.word;
        elements.posText.textContent = word.pos.map((pos) => POS_NAMES[pos] || pos).join(" · ");
        elements.meaningText.textContent = word.meanings.join(" · ");
        renderWordImage(word);
        elements.exampleBlock.hidden = !word.example;
        elements.exampleLabel.textContent = "Example";
        elements.exampleText.textContent = word.example?.en || "";
        elements.exampleKo.textContent = word.example?.ko || "";
        const sourceRelated = word.relatedWords || [
            ...word.alternate.map((relatedWord) => ({ word: relatedWord, type: "other spelling" })),
            ...word.relatedForms.map((relatedWord) => ({ word: relatedWord, type: "word form" })),
        ];
        const seenRelated = new Set();
        const related = sourceRelated.map((relatedWord) => {
            const key = String(relatedWord.word || "").trim().toLowerCase();
            const meaning = RELATED_MEANING_OVERRIDES.get(key) || state.wordMeaningMap.get(key);
            if (!key || !meaning || key === word.word.toLowerCase() || seenRelated.has(key)) return null;
            seenRelated.add(key);
            return { ...relatedWord, meaning };
        }).filter(Boolean);
        elements.relatedWords.replaceChildren(...related.map((relatedWord) => {
            const chip = document.createElement("span");
            chip.className = "related-word";
            const label = document.createElement("strong");
            label.textContent = relatedWord.word;
            const meaning = document.createElement("span");
            meaning.className = "related-meaning";
            meaning.textContent = relatedWord.meaning;
            const type = document.createElement("small");
            type.textContent = RELATED_TYPE_NAMES[relatedWord.type] || relatedWord.type;
            chip.append(label, meaning, type);
            return chip;
        }));
        const detail = detailFor(word);
        elements.relatedBlock.hidden = related.length === 0 || Boolean(detail);
        renderDetailPanel(word);
        if (!state.detailCache.has(Number(word.globalLevel))) {
            loadDetailLevel(word.globalLevel).then(() => {
                if (currentWord() === word) renderStudyCard();
            });
        }
        elements.cardBadge.textContent = status === "known" ? "외웠어요" : status === "unknown" ? "다시 보기" : "새 단어";
        elements.cardBadge.className = `card-badge ${status === "unseen" ? "" : status}`.trim();
        updateRevealState();
        elements.previousButton.disabled = state.currentIndex === 0;
        elements.nextButton.disabled = state.currentIndex === state.currentWords.length - 1;
        elements.studyMessage.textContent = state.unknownOnly ? "‘아직 어려워요’로 표시한 단어를 복습하고 있어요." : "카드를 누르거나 Space를 눌러 뜻을 보세요.";
    }

    function toggleMeaning() {
        state.revealed = !state.revealed;
        updateRevealState();
    }

    function moveCard(direction) {
        const nextIndex = Math.max(0, Math.min(state.currentWords.length - 1, state.currentIndex + direction));
        if (nextIndex === state.currentIndex) return;
        state.currentIndex = nextIndex;
        state.revealed = false;
        renderStudyCard();
    }

    function markWord(status) {
        const word = currentWord();
        if (!word) return;
        state.progress[String(word.id)] = { status, updatedAt: new Date().toISOString() };
        saveProgress();
        renderOverallProgress();
        if (state.currentIndex < state.currentWords.length - 1) {
            moveCard(1);
        } else {
            renderStudyCard();
            showToast("마지막 단어예요. 위의 ‘20문제 풀기’로 바로 확인할 수 있어요.");
        }
    }

    function primaryMeaning(word) {
        return (word?.meanings || []).find((meaning) => String(meaning || "").trim()) || "뜻 정보 없음";
    }

    function createLessonQuizChoices(target) {
        const targetMeaning = primaryMeaning(target);
        const seenMeanings = new Set([targetMeaning]);
        const distractors = [];
        const candidates = core.shuffleWords([
            ...currentLessonWords(),
            ...state.data.words,
        ]);
        for (const candidate of candidates) {
            const meaning = primaryMeaning(candidate);
            if (String(candidate.id) === String(target.id) || seenMeanings.has(meaning) || meaning === "뜻 정보 없음") continue;
            seenMeanings.add(meaning);
            distractors.push({ wordId: String(candidate.id), meaning, correct: false });
            if (distractors.length === 3) break;
        }
        return core.shuffleWords([
            { wordId: String(target.id), meaning: targetMeaning, correct: true },
            ...distractors,
        ]);
    }

    function updateLessonQuizStats() {
        elements.lessonQuizQuestionNumber.textContent = String(Math.max(1, state.lessonQuizQuestionNumber));
        elements.lessonQuizQuestionTotal.textContent = String(state.lessonQuizPool.length);
        elements.lessonQuizScore.textContent = String(state.lessonQuizScore);
        elements.lessonQuizStreak.textContent = String(state.lessonQuizStreak);
    }

    function renderLessonQuizQuestion() {
        const target = state.lessonQuizTarget;
        elements.lessonQuizWord.textContent = target.word;
        elements.lessonQuizFeedback.textContent = "뜻을 하나 고르세요.";
        elements.lessonQuizFeedback.className = "game-feedback";
        elements.lessonQuizNextButton.disabled = true;
        elements.lessonQuizNextButton.textContent = "다음";
        elements.lessonQuizChoices.replaceChildren(...state.lessonQuizChoices.map((choice, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "lesson-quiz-choice";
            button.dataset.wordId = choice.wordId;
            button.dataset.correct = String(choice.correct);
            const number = document.createElement("span");
            number.className = "lesson-quiz-choice-number";
            number.textContent = String(index + 1);
            const meaning = document.createElement("span");
            meaning.textContent = choice.meaning;
            button.append(number, meaning);
            button.addEventListener("click", () => answerLessonQuiz(button));
            return button;
        }));
        updateLessonQuizStats();
        speakText(target.word);
    }

    function nextLessonQuizQuestion() {
        if (state.lessonQuizQuestionNumber >= state.lessonQuizPool.length) {
            showLessonQuizResult();
            return;
        }
        state.lessonQuizTarget = state.lessonQuizPool[state.lessonQuizQuestionNumber];
        state.lessonQuizChoices = createLessonQuizChoices(state.lessonQuizTarget);
        state.lessonQuizQuestionNumber += 1;
        state.lessonQuizAnswered = false;
        state.lessonQuizHadWrong = false;
        renderLessonQuizQuestion();
    }

    function answerLessonQuiz(selectedButton) {
        if (state.lessonQuizAnswered || !state.lessonQuizTarget) return;
        const isCorrect = selectedButton.dataset.correct === "true";
        const targetMeaning = primaryMeaning(state.lessonQuizTarget);
        // 틀리면 정답을 알려 주지 않고 그 보기만 잠근 뒤 다시 고르게 한다. 점수는 첫 번에 맞힌 것만 센다.
        if (!isCorrect) {
            selectedButton.classList.add("incorrect");
            selectedButton.disabled = true;
            state.lessonQuizStreak = 0;
            if (!state.lessonQuizHadWrong) {
                state.lessonQuizHadWrong = true;
                state.lessonQuizWrongWords.push(state.lessonQuizTarget);
                state.progress[String(state.lessonQuizTarget.id)] = { status: "unknown", updatedAt: new Date().toISOString() };
                saveProgress();
                renderOverallProgress();
            }
            elements.lessonQuizFeedback.textContent = "다시 생각하고 다른 답을 골라보세요.";
            elements.lessonQuizFeedback.className = "game-feedback incorrect";
            updateLessonQuizStats();
            return;
        }
        state.lessonQuizAnswered = true;
        elements.lessonQuizChoices.querySelectorAll(".lesson-quiz-choice").forEach((button) => {
            button.disabled = true;
            if (button.dataset.correct === "true") button.classList.add("correct");
        });
        if (!state.lessonQuizHadWrong) {
            state.progress[String(state.lessonQuizTarget.id)] = { status: "known", updatedAt: new Date().toISOString() };
            state.lessonQuizScore += 1;
            state.lessonQuizStreak += 1;
            state.lessonQuizBestStreak = Math.max(state.lessonQuizBestStreak, state.lessonQuizStreak);
        }
        elements.lessonQuizFeedback.textContent = `정답! ${state.lessonQuizTarget.word} — ${targetMeaning}`;
        elements.lessonQuizFeedback.className = "game-feedback correct";
        saveProgress();
        renderOverallProgress();
        elements.lessonQuizNextButton.disabled = false;
        elements.lessonQuizNextButton.textContent = state.lessonQuizQuestionNumber >= state.lessonQuizPool.length ? "결과 보기" : "다음";
        updateLessonQuizStats();
    }

    function continueLessonQuiz() {
        if (!state.lessonQuizAnswered) return;
        nextLessonQuizQuestion();
    }

    function showLessonQuizResult() { completeRequested = true; clearGameTimer(); }

    function openLessonQuiz(level, lessonIndex) {
        state.currentLevel = Number(level);
        state.currentLesson = Number(lessonIndex);
        state.unknownOnly = false;
        const words = lessonsForLevel(state.currentLevel)[state.currentLesson] || [];
        startLessonQuiz(words);
    }

    function startLessonQuiz(words = currentLessonWords()) {
        const quizWords = words.filter((word) => primaryMeaning(word) !== "뜻 정보 없음");
        if (!quizWords.length) {
            showToast("퀴즈로 낼 수 있는 단어가 없습니다.");
            return;
        }
        state.lessonQuizPool = core.shuffleWords([...quizWords]);
        state.lessonQuizTarget = null;
        state.lessonQuizChoices = [];
        state.lessonQuizQuestionNumber = 0;
        state.lessonQuizScore = 0;
        state.lessonQuizStreak = 0;
        state.lessonQuizBestStreak = 0;
        state.lessonQuizAnswered = false;
        state.lessonQuizHadWrong = false;
        state.lessonQuizWrongWords = [];
        elements.studyScreen.hidden = true;
        elements.lessonScreen.hidden = true;
        elements.lessonQuizScreen.hidden = false;
        elements.lessonQuizStats.hidden = false;
        elements.lessonQuizQuestionPanel.hidden = false;
        elements.lessonQuizResultPanel.hidden = true;
        elements.lessonQuizStage.textContent = `${state.lessonQuizPool.length}단어 확인 퀴즈`;
        elements.lessonQuizTitle.textContent = `${levelName(state.currentLevel)} · ${state.currentLesson + 1}차시`;
        window.scrollTo({ top: 0, behavior: "smooth" });
        nextLessonQuizQuestion();
    }

    function backFromLessonQuiz() {
        elements.lessonQuizScreen.hidden = true;
        elements.lessonScreen.hidden = false;
        renderLessonPicker(state.currentLevel);
        renderOverallProgress();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function continueAfterLessonQuiz() {
        const nextLessonIndex = state.currentLesson + 1;
        if (nextLessonIndex < lessonsForLevel(state.currentLevel).length) {
            elements.lessonQuizScreen.hidden = true;
            openLesson(state.currentLevel, nextLessonIndex);
            return;
        }
        backFromLessonQuiz();
    }

    function speakText(text, rate = 0.85) {
        if (!text || !("speechSynthesis" in window)) {
            showToast("이 브라우저에서는 소리를 들을 수 없어요.");
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
    }

    function speakCurrentWord() {
        speakText(currentWord()?.word);
    }

    function speakCurrentExample() {
        speakText(currentWord()?.example?.en, 0.78);
    }

    function toggleShuffle() {
        state.shuffleEnabled = !state.shuffleEnabled;
        const baseWords = currentLessonWords();
        const levelWords = state.unknownOnly
            ? baseWords.filter((word) => state.progress[String(word.id)]?.status === "unknown")
            : [...baseWords];
        state.currentWords = state.shuffleEnabled ? core.shuffleWords(levelWords) : levelWords;
        state.currentIndex = 0;
        state.revealed = false;
        updateShuffleToggle();
        renderStudyCard();
        showToast(state.shuffleEnabled ? "순서 섞기를 켰어요." : "순서 섞기를 껐어요.");
    }

    function backToLevels() {
        elements.studyScreen.hidden = true;
        elements.lessonScreen.hidden = false;
        renderLessonPicker(state.currentLevel);
        renderOverallProgress();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function clearGameTimer() {
        if (state.gameTimerId) clearInterval(state.gameTimerId);
        state.gameTimerId = null;
    }

    function updateGameStats() {
        elements.gameQuestionNumber.textContent = String(Math.max(1, state.gameQuestionNumber));
        elements.gameScore.textContent = String(state.gameScore);
        elements.gameStreak.textContent = String(state.gameStreak);
        elements.gameTimer.textContent = String(state.gameTimeLeft);
        elements.gameTimerBar.style.width = `${Math.max(0, (state.gameTimeLeft / GAME_TIME_LIMIT) * 100)}%`;
        elements.gameTimerBar.classList.toggle("urgent", state.gameTimeLeft <= 5);
    }

    function answerGame(selectedId, timedOut = false) {
        if (state.gameAnswered || !state.gameTarget) return;
        const targetId = String(state.gameTarget.id);
        const isCorrect = String(selectedId) === targetId;
        if (!isCorrect) {
            state.gameHadWrong = true;
            if (!state.gameWrongWords.some((word) => String(word.id) === targetId)) state.gameWrongWords.push(state.gameTarget);
            if (!timedOut) {
                const selected = elements.gameChoices.querySelector(`[data-word-id="${selectedId}"]`);
                if (selected) { selected.classList.add("incorrect"); selected.disabled = true; }
            }
            elements.gameFeedback.textContent = timedOut
                ? "Time is up. Look again and pick the right picture."
                : "Try again. Pick a different picture.";
            elements.gameFeedback.className = "game-feedback incorrect";
            if (timedOut) startGameTimer();
            return;
        }
        state.gameAnswered = true;
        clearGameTimer();
        if (isCorrect) {
            if (!state.gameHadWrong) state.gameScore += 1;
            state.gameStreak += 1;
            state.gameBestStreak = Math.max(state.gameBestStreak, state.gameStreak);
        }
        elements.gameChoices.querySelectorAll(".game-choice").forEach((button) => {
            const choiceId = button.dataset.wordId;
            button.disabled = true;
            if (choiceId === targetId) button.classList.add("correct");
            else if (String(selectedId) === choiceId) button.classList.add("incorrect");
        });
        const meaning = state.gameTarget.meanings[0] || "";
        if (isCorrect) {
            elements.gameFeedback.textContent = `정답! ${state.gameTarget.word} — ${meaning}`;
            elements.gameFeedback.className = "game-feedback correct";
        }
        elements.gameNextButton.disabled = false;
        elements.gameNextButton.textContent = state.gameQuestionNumber >= state.gameRoundLength
            ? "결과 보기"
            : "다음";
        updateGameStats();
    }

    function startGameTimer() {
        clearGameTimer();
        state.gameTimeLeft = GAME_TIME_LIMIT;
        updateGameStats();
        state.gameTimerId = setInterval(() => {
            state.gameTimeLeft -= 1;
            updateGameStats();
            if (state.gameTimeLeft <= 0) answerGame(null, true);
        }, 1000);
    }

    function renderGameQuestion() {
        elements.gameWord.textContent = state.gameTarget.word;
        elements.gameFeedback.textContent = "그림을 하나 고르세요.";
        elements.gameFeedback.className = "game-feedback";
        elements.gameNextButton.disabled = true;
        elements.gameNextButton.textContent = "다음";
        elements.gameChoices.replaceChildren(...state.gameChoices.map((word, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "game-choice";
            button.dataset.wordId = String(word.id);
            button.setAttribute("aria-label", `Picture ${index + 1}`);
            const image = document.createElement("img");
            image.src = `${IMAGE_BASE_URL}${state.imageMap.get(String(word.id)).file}`;
            image.alt = "";
            image.width = 420;
            image.height = 420;
            const number = document.createElement("span");
            number.className = "game-choice-number";
            number.textContent = String(index + 1);
            button.append(image, number);
            button.addEventListener("click", () => answerGame(word.id));
            return button;
        }));
        updateGameStats();
        startGameTimer();
        speakText(state.gameTarget.word);
    }

    function nextGameQuestion() {
        const availableTargets = state.gameTargetPool.filter(
            (word) => !state.gameAskedIds.has(String(word.id)),
        );
        const question = core.createPictureQuestion(
            state.gamePool,
            state.gamePreviousId,
            Math.random,
            availableTargets,
        );
        if (!question) {
            if (state.gameQuestionNumber > 0) showGameResult();
            return;
        }
        state.gamePreviousId = question.target.id;
        state.gameAskedIds.add(String(question.target.id));
        state.gameTarget = question.target;
        state.gameChoices = question.choices;
        state.gameQuestionNumber += 1;
        state.gameAnswered = false;
        state.gameHadWrong = false;
        renderGameQuestion();
    }

    function showGameResult() { completeRequested = true; clearGameTimer(); }

    function startGameRound(targetPool = state.gamePool) {
        clearGameTimer();
        state.gameTargetPool = [...targetPool];
        state.gameRoundLength = Math.min(10, state.gameTargetPool.length);
        state.gameTarget = null;
        state.gamePreviousId = null;
        state.gameAskedIds = new Set();
        state.gameWrongWords = [];
        state.gameQuestionNumber = 0;
        state.gameScore = 0;
        state.gameStreak = 0;
        state.gameBestStreak = 0;
        elements.gameQuestionPanel.hidden = false;
        elements.gameResultPanel.hidden = true;
        nextGameQuestion();
    }

    function continueGame() {
        if (!state.gameAnswered) return;
        if (state.gameQuestionNumber >= state.gameRoundLength) showGameResult();
        else nextGameQuestion();
    }

    function selectGameLevel(level) {
        state.gameLevel = Number(level);
        state.gamePool = core.pictureGamePool(
            state.data.words,
            new Set(state.imageMap.keys()),
            state.gameLevel,
        );
        elements.gameLevelButtons.querySelectorAll("[data-level]").forEach((button) => {
            button.setAttribute("aria-pressed", String(Number(button.dataset.level) === state.gameLevel));
        });
        startGameRound(state.gamePool);
    }

    function openGame() {
        elements.levelScreen.hidden = true;
        elements.studyScreen.hidden = true;
        elements.gameScreen.hidden = false;
        selectGameLevel(state.gameLevel);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function backFromGame() {
        clearGameTimer();
        elements.gameScreen.hidden = true;
        elements.levelScreen.hidden = false;
        renderLevelGroups();
        renderOverallProgress();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function storedSpellingWrongWords() {
        if (!state.data) return [];
        const wordsById = new Map(currentLessonWords().map((word) => [String(word.id), word]));
        return Object.keys(state.spellingWrongProgress)
            .filter((id) => state.spellingIds.has(id) && wordsById.has(id))
            .map((id) => wordsById.get(id));
    }

    function renderStoredSpellingWrong() {
        const validIds = new Set(storedSpellingWrongWords().map((word) => String(word.id)));
        Object.keys(state.spellingWrongProgress).forEach((id) => {
            if (!state.spellingIds.has(id)) delete state.spellingWrongProgress[id];
        });
        const count = validIds.size;
        elements.spellingStoredWrongCount.textContent = count.toLocaleString("ko-KR");
        elements.spellingReviewButton.hidden = count === 0;
        saveSpellingWrongProgress();
    }

    function setSpellingReviewMode(isReview) {
        state.spellingReviewMode = isReview;
        elements.spellingModeLabel.textContent = isReview ? "틀린 단어를 다시 풀어 봐요." : "뜻을 보고 영어 단어를 완성해요.";
        elements.spellingTitle.textContent = `${levelName(state.currentLevel)} · ${state.currentLesson + 1}차시 · ${isReview ? "철자 오답 복습" : "철자 완성하기"}`;
        if (isReview) {
            elements.spellingLevelSelect.disabled = true;
        }
    }

    function updateSpellingStats() {
        elements.spellingQuestionNumber.textContent = String(Math.max(1, state.spellingQuestionNumber));
        elements.spellingScore.textContent = String(state.spellingScore);
        elements.spellingStreak.textContent = String(state.spellingStreak);
    }

    function renderSpellingQuestion() {
        const image = state.imageMap.get(String(state.spellingTarget.id));
        const meaning = (state.spellingTarget.meanings || []).find((item) => String(item || "").trim()) || "No meaning available.";
        elements.spellingMeaning.textContent = meaning;
        elements.spellingClueCard.classList.toggle("no-image", !image);
        if (image) {
            elements.spellingImage.src = `${IMAGE_BASE_URL}${image.file}`;
            elements.spellingImage.alt = `Picture clue for ${state.spellingTarget.word}`;
        } else {
            elements.spellingImage.removeAttribute("src");
            elements.spellingImage.alt = "";
        }
        elements.spellingInput.value = "";
        elements.spellingInput.disabled = false;
        elements.spellingInput.className = "spelling-input";
        elements.spellingHint.textContent = core.spellingHint(state.spellingTarget.word, false);
        elements.spellingFeedback.textContent = "단어를 완성하세요.";
        elements.spellingFeedback.className = "game-feedback";
        elements.spellingHintButton.disabled = false;
        elements.spellingCheckButton.disabled = false;
        elements.spellingNextButton.disabled = true;
        elements.spellingNextButton.textContent = "다음";
        updateSpellingStats();
        renderSpellingTiles();
        speakText(state.spellingTarget.word);
    }

    function renderSpellingTiles() {
        const letters = core.shuffleWords([...state.spellingTarget.word.toLowerCase()].map((letter, index) => ({ letter, index })));
        elements.spellingBuiltWord.textContent = "";
        elements.spellingTileRack.replaceChildren(...letters.map(({ letter, index }) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "letter-tile";
            button.textContent = letter;
            button.dataset.tileIndex = String(index);
            button.setAttribute("aria-label", `Letter ${letter}`);
            button.addEventListener("click", () => selectSpellingTile(button));
            return button;
        }));
        elements.spellingBuiltWord.onclick = removeLastSpellingLetter;
    }

    function selectSpellingTile(button) {
        if (state.spellingAnswered || button.disabled) return;
        button.disabled = true;
        elements.spellingInput.value += button.textContent;
        elements.spellingBuiltWord.textContent = elements.spellingInput.value;
        maybeAutoCheckSpelling();
    }

    function removeLastSpellingLetter() {
        if (state.spellingAnswered || !elements.spellingInput.value) return;
        const removed = elements.spellingInput.value.at(-1);
        elements.spellingInput.value = elements.spellingInput.value.slice(0, -1);
        elements.spellingBuiltWord.textContent = elements.spellingInput.value;
        const candidates = [...elements.spellingTileRack.querySelectorAll(".letter-tile[disabled]")];
        candidates.reverse().find((tile) => tile.textContent === removed)?.removeAttribute("disabled");
        elements.spellingFeedback.textContent = "Keep going.";
        elements.spellingFeedback.className = "game-feedback";
    }

    function maybeAutoCheckSpelling() {
        const answer = core.normalizeSpellingAnswer(elements.spellingInput.value);
        const correctAnswer = core.normalizeSpellingAnswer(state.spellingTarget?.word || "");
        if (!correctAnswer || answer.length < correctAnswer.length) return;
        if (answer === correctAnswer) {
            checkSpellingAnswer();
            return;
        }
        elements.spellingFeedback.textContent = "아직 아니에요. 마지막 글자를 지우고 다시 해 보세요.";
        elements.spellingFeedback.className = "game-feedback incorrect";
        elements.spellingBuiltWord.animate(
            [{ transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "none" }],
            { duration: 180 },
        );
    }

    function nextSpellingQuestion() {
        const availableTargets = state.spellingTargetPool.filter(
            (word) => !state.spellingAskedIds.has(String(word.id)),
        );
        if (!availableTargets.length) {
            if (state.spellingQuestionNumber > 0) showSpellingResult();
            return;
        }
        const target = core.shuffleWords(availableTargets)[0];
        state.spellingTarget = target;
        state.spellingAskedIds.add(String(target.id));
        state.spellingQuestionNumber += 1;
        state.spellingAnswered = false;
        renderSpellingQuestion();
    }

    function checkSpellingAnswer() {
        if (state.spellingAnswered || !state.spellingTarget) return;
        const answer = core.normalizeSpellingAnswer(elements.spellingInput.value);
        if (!answer) {
            elements.spellingFeedback.textContent = "Type some letters first.";
            elements.spellingFeedback.className = "game-feedback incorrect";
            elements.spellingBuiltWord.animate([{ transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "none" }], { duration: 180 });
            return;
        }
        state.spellingAnswered = true;
        const targetId = String(state.spellingTarget.id);
        const correctAnswer = core.normalizeSpellingAnswer(state.spellingTarget.word);
        const isCorrect = answer === correctAnswer;
        if (isCorrect) {
            state.spellingScore += 1;
            state.spellingStreak += 1;
            state.spellingBestStreak = Math.max(state.spellingBestStreak, state.spellingStreak);
            delete state.spellingWrongProgress[targetId];
        } else {
            state.spellingStreak = 0;
            state.spellingWrongEntries.push({ word: state.spellingTarget, answer });
            const previous = state.spellingWrongProgress[targetId];
            state.spellingWrongProgress[targetId] = {
                count: (previous?.count || 0) + 1,
                lastAnswer: answer,
                updatedAt: new Date().toISOString(),
            };
        }
        renderStoredSpellingWrong();
        elements.spellingInput.disabled = true;
        elements.spellingInput.classList.add(isCorrect ? "correct" : "incorrect");
        elements.spellingHintButton.disabled = true;
        elements.spellingCheckButton.disabled = true;
        elements.spellingFeedback.textContent = isCorrect
            ? `정답! ${state.spellingTarget.word}`
            : `아쉬워요. 정답은 ${state.spellingTarget.word}예요.`;
        elements.spellingFeedback.className = `game-feedback ${isCorrect ? "correct" : "incorrect"}`;
        elements.spellingNextButton.disabled = false;
        elements.spellingNextButton.textContent = state.spellingQuestionNumber >= state.spellingRoundLength
            ? "결과 보기"
            : "다음";
        updateSpellingStats();
    }

    function showSpellingHint() {
        if (!state.spellingTarget || state.spellingAnswered) return;
        elements.spellingHint.textContent = core.spellingHint(state.spellingTarget.word);
        const firstLetter = state.spellingTarget.word[0].toLowerCase();
        if (!elements.spellingInput.value) {
            [...elements.spellingTileRack.querySelectorAll(".letter-tile:not([disabled])")].find((tile) => tile.textContent === firstLetter)?.click();
        }
    }

    function showSpellingResult() { completeRequested = true; clearGameTimer(); }

    function startSpellingRound(targetPool = state.spellingPool) {
        state.spellingTargetPool = [...targetPool];
        state.spellingRoundLength = state.spellingTargetPool.length;
        state.spellingTarget = null;
        state.spellingAskedIds = new Set();
        state.spellingWrongEntries = [];
        state.spellingQuestionNumber = 0;
        state.spellingScore = 0;
        state.spellingStreak = 0;
        state.spellingBestStreak = 0;
        state.spellingAnswered = false;
        elements.spellingQuestionPanel.hidden = false;
        elements.spellingResultPanel.hidden = true;
        nextSpellingQuestion();
    }

    function continueSpelling() {
        if (!state.spellingAnswered) return;
        if (state.spellingQuestionNumber >= state.spellingRoundLength) showSpellingResult();
        else nextSpellingQuestion();
    }

    function restartSpellingMode() {
        if (state.spellingReviewMode) {
            const storedWords = storedSpellingWrongWords();
            if (storedWords.length) {
                startSpellingRound(storedWords);
                return;
            }
            setSpellingReviewMode(false);
        }
        selectSpellingLevel(state.spellingLevel);
    }

    function selectSpellingLevel() {
        setSpellingReviewMode(false);
        state.spellingLevel = state.currentLevel;
        state.spellingPool = core.spellingGamePool(currentLessonWords(), state.spellingIds, state.currentLevel);
        elements.spellingLevelSelect.disabled = true;
        elements.spellingLevelSelect.value = String(state.currentLevel);
        startSpellingRound(state.spellingPool);
    }

    function openSpellingGame() {
        clearGameTimer();
        elements.levelScreen.hidden = true;
        elements.studyScreen.hidden = true;
        elements.gameScreen.hidden = true;
        elements.spellingScreen.hidden = false;
        selectSpellingLevel(state.spellingLevel);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function openSpellingReview() {
        const storedWords = storedSpellingWrongWords();
        if (!storedWords.length) {
            renderStoredSpellingWrong();
            showToast("No saved words to try again.");
            return;
        }
        clearGameTimer();
        elements.levelScreen.hidden = true;
        elements.studyScreen.hidden = true;
        elements.gameScreen.hidden = true;
        elements.spellingScreen.hidden = false;
        setSpellingReviewMode(true);
        startSpellingRound(storedWords);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function backFromSpelling() {
        elements.spellingScreen.hidden = true;
        elements.studyScreen.hidden = false;
        renderStoredSpellingWrong();
        renderStudyCard();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function bindEvents() {
        elements.recommendedLessonButton.addEventListener("click", () => {
            const lesson = state.recommendedLesson || findRecommendedLesson();
            openLesson(lesson.level, lesson.lessonIndex);
        });
        elements.viewAllWordsButton.addEventListener("click", openBandList);
        elements.backFromBandList.addEventListener("click", backFromBandList);
        elements.bandSearchInput.addEventListener("input", () => renderBandList(elements.bandSearchInput.value));
        elements.flashcard.addEventListener("click", toggleMeaning);
        elements.detailToggle.addEventListener("click", toggleDetailPanel);
        elements.previousButton.addEventListener("click", () => moveCard(-1));
        elements.nextButton.addEventListener("click", () => moveCard(1));
        elements.unknownButton.addEventListener("click", () => markWord("unknown"));
        elements.knownButton.addEventListener("click", () => markWord("known"));
        elements.speakButton.addEventListener("click", speakCurrentWord);
        elements.exampleSpeakButton.addEventListener("click", speakCurrentExample);
        elements.lessonQuizStartButton.addEventListener("click", () => startLessonQuiz(currentLessonWords()));
        elements.shuffleButton.addEventListener("click", toggleShuffle);
        elements.wordImage.addEventListener("error", () => {
            elements.wordImageBlock.hidden = true;
            elements.answerLayout.classList.remove("has-image");
        });
        elements.backFromLessons.addEventListener("click", backFromLessons);
        elements.backToLevels.addEventListener("click", backToLevels);
        elements.reviewUnknownButton.addEventListener("click", () => openLesson(state.currentLevel, state.currentLesson, { unknownOnly: true }));
        elements.backFromLessonQuiz.addEventListener("click", backFromLessonQuiz);
        elements.lessonQuizRestartButton.addEventListener("click", () => startLessonQuiz(currentLessonWords()));
        elements.lessonQuizSpeakButton.addEventListener("click", () => speakText(state.lessonQuizTarget?.word));
        elements.lessonQuizNextButton.addEventListener("click", continueLessonQuiz);
        elements.lessonQuizRetryWrongButton.addEventListener("click", () => {
            const retryWords = [...state.lessonQuizWrongWords];
            startLessonQuiz(retryWords);
        });
        elements.lessonQuizContinueButton.addEventListener("click", continueAfterLessonQuiz);

        elements.backFromGame.addEventListener("click", backFromGame);
        elements.gameNextButton.addEventListener("click", continueGame);
        elements.gameResetButton.addEventListener("click", () => startGameRound(state.gamePool));
        elements.gameSpeakButton.addEventListener("click", () => speakText(state.gameTarget?.word));
        elements.gamePlayAgainButton.addEventListener("click", () => startGameRound(state.gamePool));
        elements.gameRetryWrongButton.addEventListener("click", () => {
            const retryWords = [...state.gameWrongWords];
            startGameRound(retryWords);
        });
        elements.gameLevelButtons.addEventListener("click", (event) => {
            const button = event.target.closest("[data-level]");
            if (button) selectGameLevel(button.dataset.level);
        });
        elements.spellingGameStartButton.addEventListener("click", openSpellingGame);
        elements.spellingReviewButton.addEventListener("click", openSpellingReview);
        elements.backFromSpelling.addEventListener("click", backFromSpelling);

        // 화면 단계를 한 걸음씩만 되돌리고, 맨 처음 화면(레벨 고르기)에서만 사이트 밖으로 나간다.
        // true를 돌려주면 실제로 한 걸음 되돌린 것이고, false면 이미 맨 처음 화면이라는 뜻이다.
        function stepBackOneScreen() {
            if (!elements.studyScreen.hidden) { backToLevels(); return true; }
            if (!elements.lessonQuizScreen.hidden) { backFromLessonQuiz(); return true; }
            if (!elements.lessonScreen.hidden) { backFromLessons(); return true; }
            if (!elements.bandListScreen.hidden) { backFromBandList(); return true; }
            if (!elements.gameScreen.hidden) { backFromGame(); return true; }
            if (!elements.spellingScreen.hidden) { backFromSpelling(); return true; }
            return false;
        }

        // 공용 뒤로가기 단추(assets/site-back-navigation.js)가 눌리면 먼저 물어본다.
        window.addEventListener("sitebackrequest", (event) => {
            if (stepBackOneScreen()) event.preventDefault();
        });

        // 화면 왼쪽 위 화살표는 공용 뒤로가기 단추가 안 떠도 항상 같은 규칙으로 움직인다.
        elements.backLink?.addEventListener("click", (event) => {
            if (stepBackOneScreen()) event.preventDefault();
        });
        elements.spellingResetButton.addEventListener("click", restartSpellingMode);
        elements.spellingHintButton.addEventListener("click", showSpellingHint);
        elements.spellingSpeakButton.addEventListener("click", () => speakText(state.spellingTarget?.word));
        elements.spellingCheckButton.addEventListener("click", checkSpellingAnswer);
        elements.spellingNextButton.addEventListener("click", continueSpelling);
        elements.spellingPlayAgainButton.addEventListener("click", restartSpellingMode);
        elements.spellingRetryWrongButton.addEventListener("click", () => {
            const retryWords = state.spellingWrongEntries.map((entry) => entry.word);
            startSpellingRound(retryWords);
        });
        elements.spellingLevelSelect.addEventListener("change", () => selectSpellingLevel(elements.spellingLevelSelect.value));
        window.addEventListener("keydown", (event) => {
            if (recordBusy || event.altKey || event.ctrlKey || event.metaKey) return;
            if (!elements.spellingScreen.hidden) {
                if (elements.spellingQuestionPanel.hidden) return;
                if (/^[a-z]$/i.test(event.key) && !state.spellingAnswered) {
                    const key = event.key.toLowerCase();
                    const tile = [...elements.spellingTileRack.querySelectorAll(".letter-tile:not([disabled])")]
                        .find((candidate) => candidate.textContent === key);
                    if (tile) {
                        event.preventDefault();
                        selectSpellingTile(tile);
                    }
                } else if (event.key === "Backspace" && !state.spellingAnswered) {
                    event.preventDefault();
                    removeLastSpellingLetter();
                } else if (event.key === "Enter") {
                    event.preventDefault();
                    if (state.spellingAnswered) continueSpelling();
                    else checkSpellingAnswer();
                }
                return;
            }
            if (!elements.lessonQuizScreen.hidden) {
                if (elements.lessonQuizQuestionPanel.hidden) return;
                const choiceIndex = Number(event.key) - 1;
                if (choiceIndex >= 0 && choiceIndex < 4 && !state.lessonQuizAnswered) {
                    event.preventDefault();
                    elements.lessonQuizChoices.querySelectorAll(".lesson-quiz-choice")[choiceIndex]?.click();
                } else if (event.key === "Enter" && state.lessonQuizAnswered) {
                    event.preventDefault();
                    continueLessonQuiz();
                }
                return;
            }
            if (!elements.gameScreen.hidden) {
                const choiceIndex = Number(event.key) - 1;
                if (choiceIndex >= 0 && choiceIndex < 4 && !state.gameAnswered) {
                    event.preventDefault();
                    elements.gameChoices.querySelectorAll(".game-choice")[choiceIndex]?.click();
                } else if (event.key === "Enter" && state.gameAnswered && !elements.gameQuestionPanel.hidden) {
                    event.preventDefault();
                    continueGame();
                }
                return;
            }
            if (elements.studyScreen.hidden) return;
            if (event.code === "Space") { event.preventDefault(); toggleMeaning(); }
            else if (event.key === "ArrowLeft") moveCard(-1);
            else if (event.key === "ArrowRight") moveCard(1);
            else if (event.key === "1") markWord("unknown");
            else if (event.key === "2") markWord("known");
        });
    }

    async function initialize() {
        try {
            const [response, curatedExamplesResponse, imageResponse, spellingResponse] = await Promise.all([
                fetch(DATA_URL),
                fetch(CURATED_EXAMPLES_URL).catch(() => null),
                fetch(IMAGE_MANIFEST_URL).catch(() => null),
                fetch(SPELLING_GAME_URL).catch(() => null),
            ]);
            if (!response.ok) throw new Error(`Vocabulary data request failed: ${response.status}`);
            state.data = await response.json();
            if (curatedExamplesResponse?.ok) {
                const curatedExamples = await curatedExamplesResponse.json();
                const appliedCount = applyCuratedExamples(state.data, curatedExamples);
                console.info(`Applied ${appliedCount} curated vocabulary examples.`);
            }
            if (imageResponse?.ok) {
                const manifest = await imageResponse.json();
                const imageEntries = Object.entries(manifest.images || {}).filter(([id, image]) => (
                    /^\d+$/.test(id)
                    && image?.word
                    && /^[a-z0-9-]+\.(?:webp|png)$/.test(image?.file || "")
                ));
                state.imageMap = new Map(imageEntries);
            }
            if (state.data.totalWords !== 3000 || !Array.isArray(state.data.words)) throw new Error("Invalid vocabulary data");
            if (!state.data.words.every((word) => (
                (word.example === null || (
                    word.example?.en
                    && word.example?.ko
                    && word.example?.source !== "generated_learning_prompt"
                ))
                && Array.isArray(word.relatedWords)
            ))) {
                throw new Error("Vocabulary learning data is incomplete");
            }
            state.wordMeaningMap = new Map(state.data.words.map((word) => [
                word.word.toLowerCase(),
                (word.meanings || []).find((meaning) => String(meaning || "").trim()) || "",
            ]));
            state.levels = core.groupByLevel(state.data.words);
            if (state.levels.size !== 15) throw new Error("Invalid vocabulary levels");
            if (spellingResponse?.ok) await spellingResponse.json();
            state.spellingIds = new Set(state.data.words
                .filter((word) => /^[a-z -]+$/i.test(word.word || "") && word.meanings?.some((meaning) => String(meaning || "").trim()))
                .map((word) => String(word.id)));
            elements.gameLevelButtons.querySelectorAll("[data-level]").forEach((button) => {
                const levelPool = core.pictureGamePool(
                    state.data.words,
                    new Set(state.imageMap.keys()),
                    button.dataset.level,
                );
                button.disabled = levelPool.length < 4;
            });
            const spellingPool = core.spellingGamePool(state.data.words, state.spellingIds);

            elements.spellingGameStartButton.hidden = spellingPool.length === 0;
            elements.spellingLevelSelect.disabled = spellingPool.length === 0;
            renderStoredSpellingWrong();
            updateShuffleToggle();
            renderOverallProgress();
            renderLevelGroups();
            renderRecommendedLesson();
            await initializeRecords();
            bindEvents();
            elements.loadingState.hidden = true;
        } catch (error) {
            console.error(error);
            elements.loadingState.querySelector("p").textContent = "We could not load the words. Please try again soon.";
        }
    }

    const records = window.LearningRecords.create('vocabulary', { label: '영단어' });
    let recordBusy = false, recordDepth = 0, recordMode = 'study', completeRequested = false, pendingEvents = [];
    const recordExcluded = new Set(['data','progress','spellingWrongProgress','imageMap','levels','detailCache','detailLoading','gameTimerId','spellingIds','wordMeaningMap','currentBandWords']);
    const recordScreens = ['levelScreen','lessonScreen','studyScreen','bandListScreen','lessonQuizScreen','gameScreen','spellingScreen'];
    function lockRecords(busy) {
        recordBusy = busy;
        recordScreens.forEach(key => { elements[key].inert = busy; });
        finishReading.disabled = busy || records.session?.status !== 'active';
    }
    function pack(value) {
        if (value instanceof Set) return { $set: [...value] };
        if (Array.isArray(value)) return value.map(pack);
        if (value && typeof value === 'object') {
            if (value.id != null && value.word && Array.isArray(value.meanings)) return { $word: String(value.id) };
            return Object.fromEntries(Object.entries(value).map(([k,v]) => [k,pack(v)]));
        }
        return value;
    }
    function unpack(value) {
        if (value?.$set) return new Set(value.$set);
        if (value?.$word) return state.data.words.find(word => String(word.id) === value.$word);
        if (Array.isArray(value)) return value.map(unpack);
        if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k,unpack(v)]));
        return value;
    }
    function recordCheckpoint() {
        return { mode: recordMode, state: pack(Object.fromEntries(Object.entries(state).filter(([k]) => !recordExcluded.has(k)))),
            spelling: { value: elements.spellingInput.value, tiles: [...elements.spellingTileRack.children].map(b => ({ text: b.textContent, index: b.dataset.tileIndex, disabled: b.disabled })) } };
    }
    function recordProgress() {
        if (recordMode === 'study') return { current: state.currentWords.filter(w => state.progress[w.id]).length, total: state.currentWords.length };
        const prefix = recordMode === 'quiz' ? 'lessonQuiz' : recordMode;
        return { current: Math.max(0,state[prefix+'QuestionNumber'] - (state[prefix+'Answered'] ? 0 : 1)), total: recordMode === 'quiz' ? state.lessonQuizPool.length : state[prefix+'RoundLength'] };
    }
    function recordAnswer(kind, word, response, correct, choices) {
        if (!word) return;
        const key = recordMode + ':' + word.id;
        pendingEvents.push({kind,questionKey:key,response,correct,snapshot:{prompt:word.word,meaning:primaryMeaning(word),choices}});
        if (kind === 'answer') {
            state.recordAttempts ||= {};
            (state.recordAttempts[key] ||= []).push({ response, correct });
        }
    }
    function restoreRecord(cp) {
        const accountProgress=state.progress, wrongProgress=state.spellingWrongProgress;
        Object.assign(state,unpack(cp.state)); state.progress=accountProgress; state.spellingWrongProgress=wrongProgress; recordMode = cp.mode;
        recordScreens.forEach(k => { elements[k].hidden = true; });
        const attempts = state.recordAttempts || {};
        if (recordMode === 'study') { elements.studyScreen.hidden=false; renderStudyCard(); updateShuffleToggle(); }
        if (recordMode === 'quiz' || recordMode === 'game') {
            const quiz=recordMode==='quiz', prefix=quiz?'lessonQuiz':'game';
            elements[prefix+'Screen'].hidden=false; elements[prefix+'QuestionPanel'].hidden=false; elements[prefix+'ResultPanel'].hidden=true;
            if(quiz){elements.lessonQuizStats.hidden=false;elements.lessonQuizTitle.textContent=`${levelName(state.currentLevel)} · ${state.currentLesson+1}차시`;renderLessonQuizQuestion();}else renderGameQuestion();
            const tried=attempts[recordMode+':'+state[prefix+'Target'].id] || [];
            elements[prefix+'Choices'].querySelectorAll('button').forEach(b=>{
                const entry=tried.find(t=>String(t.response?.id)===b.dataset.wordId);
                b.disabled=state[prefix+'Answered'] || !!entry;
                if(entry)b.classList.add(entry.correct?'correct':'incorrect');
            });
            elements[prefix+'NextButton'].disabled=!state[prefix+'Answered'];
            if(tried.length)elements[prefix+'Feedback'].textContent=state[prefix+'Answered']?'저장된 답안을 이어서 볼 수 있어요.':'다른 답을 골라 다시 풀어보세요.';
            if(state.gameAnswered || recordMode!=='game')clearGameTimer();
        }
        if(recordMode==='spelling') {
            elements.spellingScreen.hidden=false;elements.spellingQuestionPanel.hidden=false;elements.spellingResultPanel.hidden=true;
            elements.spellingLevelSelect.value=String(state.spellingLevel);renderSpellingQuestion();
            const saved=cp.spelling || {value:'',tiles:[]};
            elements.spellingInput.value=saved.value;elements.spellingBuiltWord.textContent=saved.value;
            elements.spellingTileRack.replaceChildren(...saved.tiles.map(t=>{const b=document.createElement('button');b.type='button';b.className='letter-tile';b.textContent=t.text;b.dataset.tileIndex=t.index;b.disabled=t.disabled||state.spellingAnswered;b.onclick=()=>selectSpellingTile(b);return b;}));
            elements.spellingInput.disabled=state.spellingAnswered;elements.spellingNextButton.disabled=!state.spellingAnswered;
            elements.spellingCheckButton.disabled=elements.spellingHintButton.disabled=state.spellingAnswered;
            if(state.spellingAnswered)elements.spellingFeedback.textContent='저장된 답안: '+saved.value+' · 정답: '+state.spellingTarget.word;
        }
        renderOverallProgress(); renderStoredSpellingWrong();
    }
    async function recordOperation(run, beginMode) {
        if (recordDepth) return run();
        if (recordBusy) return;
        if (!beginMode && records.session?.status !== 'active') return;
        lockRecords(true); pendingEvents=[];completeRequested=false;recordDepth++;
        try {
            if(beginMode){ recordMode=beginMode;state.recordAttempts={}; }
            run();
            clearGameTimer();
            if(beginMode) {
                const level=recordMode==='game'?state.gameLevel:recordMode==='spelling'?state.spellingLevel:state.currentLevel;
                const key=recordMode+':'+level+':'+(recordMode==='study'||recordMode==='quiz'||recordMode==='spelling'?state.currentLesson+(recordMode==='spelling'&&state.spellingReviewMode?':review':''): 'all');
                const label={study:'단어 익히기',quiz:'뜻 퀴즈',game:'그림 퀴즈',spelling:'철자 퀴즈'}[recordMode];
                const session=await records.start({contentKey:key,title:`영단어 · ${label} · ${levelName(level)}${recordMode==='study'||recordMode==='quiz'||recordMode==='spelling'?' · '+(state.currentLesson+1)+'차시':''}`,version:'20261002',checkpoint:recordCheckpoint()});
                if(session.revision>0)restoreRecord(session.checkpoint);
            }
            await records.save({checkpoint:recordCheckpoint(),progress:recordProgress(),events:pendingEvents,complete:completeRequested});
            if(completeRequested){recordScreens.forEach(k=>{elements[k].hidden=k!=='levelScreen';});renderLevelGroups();renderRecommendedLesson();await records.showResult();}
        } finally { recordDepth--;lockRecords(false);if(recordMode==='game'&&!state.gameAnswered&&!elements.gameScreen.hidden&&records.session?.status==='active')startGameTimer(); }
    }
    const finishReading=records.addAction('이번 학습 마치기',()=>recordOperation(()=>{completeRequested=true;}));
    finishReading.disabled=true;
    function wrapRecord(fn, before) { return (...args)=>recordOperation(()=>{before?.(...args);return fn(...args);}); }
    // Nested learning actions form one checkpoint and one immutable answer batch.
    const originalOpenLesson=openLesson, originalStartQuiz=startLessonQuiz, originalStartGame=startGameRound, originalStartSpelling=startSpellingRound;
    openLesson=(...args)=>recordOperation(()=>originalOpenLesson(...args),'study');
    startLessonQuiz=(...args)=>recordOperation(()=>originalStartQuiz(...args),'quiz');
    startGameRound=(...args)=>recordOperation(()=>originalStartGame(...args),'game');
    startSpellingRound=(...args)=>recordOperation(()=>originalStartSpelling(...args),'spelling');
    moveCard=wrapRecord(moveCard);toggleMeaning=wrapRecord(toggleMeaning);toggleDetailPanel=wrapRecord(toggleDetailPanel);toggleShuffle=wrapRecord(toggleShuffle);
    markWord=wrapRecord(markWord,status=>recordAnswer('self-assessment',currentWord(),status,null));
    answerLessonQuiz=wrapRecord(answerLessonQuiz,b=>{if(!state.lessonQuizAnswered&&!b.disabled)recordAnswer('answer',state.lessonQuizTarget,{id:b.dataset.wordId,text:b.textContent},b.dataset.correct==='true',state.lessonQuizChoices.map(c=>c.meaning));});
    answerGame=wrapRecord(answerGame,(id,timedOut)=>{if(!state.gameAnswered&&!timedOut)recordAnswer('answer',state.gameTarget,{id:String(id),text:state.gameChoices.find(w=>String(w.id)===String(id))?.word},String(id)===String(state.gameTarget.id),state.gameChoices.map(w=>w.word));});
    checkSpellingAnswer=wrapRecord(checkSpellingAnswer,()=>{if(!state.spellingAnswered&&elements.spellingInput.value.trim())recordAnswer('answer',state.spellingTarget,elements.spellingInput.value,core.normalizeSpellingAnswer(elements.spellingInput.value)===core.normalizeSpellingAnswer(state.spellingTarget.word));});
    showSpellingHint=wrapRecord(showSpellingHint,()=>recordAnswer('hint',state.spellingTarget,'첫 글자 도움',null));
    selectSpellingTile=wrapRecord(selectSpellingTile);removeLastSpellingLetter=wrapRecord(removeLastSpellingLetter);
    nextLessonQuizQuestion=wrapRecord(nextLessonQuizQuestion);nextGameQuestion=wrapRecord(nextGameQuestion);nextSpellingQuestion=wrapRecord(nextSpellingQuestion);
    showLessonQuizResult=wrapRecord(showLessonQuizResult);showGameResult=wrapRecord(showGameResult);showSpellingResult=wrapRecord(showSpellingResult);
    async function initializeRecords() {
        await records.ready;
        const {sessions}=await records.history();
        if(!records.preview){
            const {entries}=await window.LearningRecords.request('/word-progress?activity=vocabulary');
            for(const e of entries){const [mode,id]=e.question_key.split(':');
                if(e.kind==='self-assessment')state.progress[id]={status:e.response,updatedAt:e.recorded_at};
                else if(mode==='quiz')state.progress[id]={status:e.correct?'known':'unknown',updatedAt:e.recorded_at};
                else if(mode==='spelling'){if(e.correct)delete state.spellingWrongProgress[id];else state.spellingWrongProgress[id]={count:1,lastAnswer:e.response,updatedAt:e.recorded_at};}
            }
        }
        renderOverallProgress();renderLevelGroups();renderRecommendedLesson();renderStoredSpellingWrong();
        const key=new URLSearchParams(location.search).get('record')||sessions.find(s=>s.status==='active')?.contentKey;
        if(key){const [mode,level,lesson]=key.split(':');
            if(mode==='study')await openLesson(Number(level),Number(lesson));
            else if(mode==='quiz'){state.currentLevel=Number(level);state.currentLesson=Number(lesson);await startLessonQuiz();}
            else if(mode==='game'){state.gameLevel=Number(level);state.gamePool=core.pictureGamePool(state.data.words,new Set(state.imageMap.keys()),state.gameLevel);await startGameRound();}
            else if(mode==='spelling' && /^\d+$/.test(lesson)){state.currentLevel=Number(level);state.currentLesson=Number(lesson);state.currentWords=[...currentLessonWords()];state.spellingLevel=state.currentLevel;setSpellingReviewMode(key.split(':')[3]==='review');state.spellingPool=core.spellingGamePool(currentLessonWords(),state.spellingIds,state.currentLevel);await startSpellingRound(state.spellingReviewMode?storedSpellingWrongWords():state.spellingPool);}
        }
    }

    initialize();
})();
