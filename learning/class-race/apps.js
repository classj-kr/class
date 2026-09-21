(() => {
    "use strict";

    // 학급 순위전에 낼 수 있는 앱 목록.
    // 앱마다 다른 것은 "문제를 꺼내 오는 부분"뿐이다. 나머지(방, 참가, 순위)는 전부 공용이다.
    // 공용 문제 모양: { id, category, prompt, sentence, choices[2~4], answer, explanation }
    // 공용 차시 모양: { id, title, note, ids[] }

    const loadedScripts = new Map();
    const loadedData = new Map();

    function loadScript(url) {
        if (loadedScripts.has(url)) return loadedScripts.get(url);
        const promise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = url;
            script.async = false;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`불러오지 못했습니다: ${url}`));
            document.head.append(script);
        });
        loadedScripts.set(url, promise);
        return promise;
    }

    // 자료가 script 가 아니라 JSON 파일인 앱도 있다.
    function loadJson(url) {
        if (loadedData.has(url)) return loadedData.get(url);
        const promise = fetch(url).then((response) => {
            if (!response.ok) throw new Error(`불러오지 못했습니다: ${url}`);
            return response.json();
        });
        loadedData.set(url, promise);
        return promise;
    }

    function shuffle(items) {
        const copy = [...items];
        for (let index = copy.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
        }
        return copy;
    }

    // 정답 하나에 다른 항목에서 뽑은 보기 둘을 더한다. 글자가 같은 보기는 피한다.
    function withDistractors(answer, pool, count = 2) {
        const others = shuffle(pool.filter((text) => text && text !== answer));
        const picked = [];
        for (const text of others) {
            if (picked.includes(text)) continue;
            picked.push(text);
            if (picked.length === count) break;
        }
        return shuffle([answer, ...picked]);
    }

    // 뜻은 사전에서 온 글이라 괄호 풀이가 붙어 있고 여러 갈래로 늘어진다.
    // 문제에 낼 만큼만 남긴다.
    function shortMeaning(text) {
        let value = String(text || "").trim();
        value = value.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
        value = value.replace(/[.;,]+$/, "").trim();
        if (value.length <= 60) return value;
        const cut = value.slice(0, 60);
        const comma = cut.lastIndexOf(",");
        return (comma > 20 ? cut.slice(0, comma) : cut).trim();
    }

    // 예문에 낱말이 그대로 들어 있을 때만 그 자리를 빈칸으로 바꾼다. 모양이 바뀐
    // 낱말(begin → began)까지 지우려 들면 엉뚱한 자리를 지운다.
    function blankOut(sentence, word) {
        const text = String(sentence || "").trim();
        if (!text || !word) return "";
        const escaped = String(word).replace(/[.*+?^${}()|[\]\\]/g, (mark) => "\\" + mark);
        const pattern = new RegExp("(^|[^A-Za-z])" + escaped + "([^A-Za-z]|$)", "i");
        if (!pattern.test(text)) return "";
        return text.replace(pattern, (match, before, after) => `${before}____${after}`);
    }

    // 별표로 적은 굵은 글씨를 떼어 낸다.
    function plainText(text) {
        return String(text || "").replace(/\*\*/g, "").trim();
    }

    function chunkLessons(ids, size, titleFor, noteFor) {
        const lessons = [];
        for (let start = 0; start < ids.length; start += size) {
            const slice = ids.slice(start, start + size);
            const number = lessons.length + 1;
            // 끝에 몇 개만 남으면 새 묶음을 만들지 않고 앞 묶음에 붙인다.
            if (slice.length < size / 2 && lessons.length > 0) {
                lessons[lessons.length - 1].ids.push(...slice);
                break;
            }
            lessons.push({ id: `part-${number}`, title: titleFor(number), note: noteFor(slice), ids: slice });
        }
        return lessons;
    }

    const apps = [
        {
            id: "spelling",
            title: "한글 맞춤법",
            subject: "국어",
            scripts: [
                "/learning/literacy-numeracy/spelling/questions.js",
                "/learning/literacy-numeracy/spelling/questions-extra.js",
                "/learning/literacy-numeracy/spelling/lessons.js"
            ],
            getBank() {
                const questions = new Map((window.SPELLING_QUESTIONS || []).map((question) => [question.id, {
                    id: question.id,
                    category: question.category,
                    prompt: question.prompt,
                    sentence: question.sentence,
                    choices: [...question.choices],
                    answer: question.answer,
                    explanation: question.explanation
                }]));
                const lessons = (window.SPELLING_LESSONS || []).map((lesson) => ({
                    id: lesson.id, title: lesson.title, note: lesson.note, ids: [...lesson.ids]
                }));
                return { questions, lessons };
            }
        },
        {
            id: "proverbs",
            title: "속담",
            subject: "국어",
            scripts: [
                "/learning/literacy-numeracy/proverbs/proverbs-data.js",
                "/learning/literacy-numeracy/proverbs/proverbs-essential-additions.js"
            ],
            getBank() {
                // 자료는 배열 모양([속담, 뜻, 예문, 상황])과 객체 모양({proverb, meaning, example, question}) 둘 다 있다.
                const entries = (window.PROVERB_BANKS?.ko || []).map((entry) => (Array.isArray(entry)
                    ? { proverb: entry[0], meaning: entry[1], example: entry[2], question: entry[3] }
                    : entry));
                const allProverbs = entries.map((entry) => entry.proverb);
                const questions = new Map();
                entries.forEach((entry, index) => {
                    const { proverb, meaning, example, question: situation } = entry;
                    const id = `ko-${index + 1}`;
                    questions.set(id, {
                        id,
                        category: "속담",
                        prompt: "이 상황에 어울리는 속담을 고르세요.",
                        sentence: situation || example,
                        choices: withDistractors(proverb, allProverbs),
                        answer: proverb,
                        explanation: `${proverb}: ${meaning}`
                    });
                });
                const lessons = chunkLessons([...questions.keys()], 10,
                    (number) => `속담 ${number}묶음`,
                    (ids) => ids.slice(0, 3).map((id) => questions.get(id).answer).join(" · "));
                return { questions, lessons };
            }
        },
        {
            id: "idioms",
            title: "관용어",
            subject: "국어",
            scripts: ["/learning/literacy-numeracy/idiomatic-expressions/idiomatic-expressions-data.js"],
            getBank() {
                // 자료는 객체 모양({expression, category, meaning, example, question, lesson})이다. 옛 배열 모양도 받아 준다.
                const entries = (window.IDIOMATIC_EXPRESSION_BANK || []).map((entry) => (Array.isArray(entry)
                    ? { expression: entry[0], category: entry[1], meaning: entry[2], example: entry[3], question: entry[4] }
                    : entry));
                const allExpressions = entries.map((entry) => entry.expression);
                const questions = new Map();
                const lessonMap = new Map();
                entries.forEach((entry, index) => {
                    const { expression, category, meaning, example, question: situation } = entry;
                    const id = `ie-${index + 1}`;
                    questions.set(id, {
                        id,
                        category: category || "관용어",
                        prompt: "이 상황에 어울리는 관용어를 고르세요.",
                        sentence: situation || example,
                        choices: withDistractors(expression, allExpressions),
                        answer: expression,
                        explanation: `${expression}: ${meaning}`
                    });
                    const lessonNumber = Number(entry.lesson);
                    if (Number.isInteger(lessonNumber) && lessonNumber > 0) {
                        if (!lessonMap.has(lessonNumber)) lessonMap.set(lessonNumber, []);
                        lessonMap.get(lessonNumber).push(id);
                    }
                });
                const lessons = [...lessonMap.entries()]
                    .sort((a, b) => a[0] - b[0])
                    .map(([number, ids]) => ({
                        id: `lesson-${number}`,
                        title: `관용어 ${number}차시`,
                        note: ids.slice(0, 3).map((id) => questions.get(id).answer).join(" · "),
                        ids
                    }));
                return { questions, lessons: lessons.length ? lessons : chunkLessons([...questions.keys()], 10, (n) => `관용어 ${n}묶음`, () => "") };
            }
        },
        {
            id: "cci",
            title: "한자성어",
            subject: "국어",
            scripts: [
                "/learning/literacy-numeracy/classical-chinese-idioms/idioms-data.js",
                "/learning/literacy-numeracy/classical-chinese-idioms/idioms-lessons-data.js"
            ],
            getBank() {
                const entries = Array.isArray(window.IDIOM_DATA) ? window.IDIOM_DATA : [];
                const allWords = entries.map((entry) => entry.word);
                const questions = new Map(entries.map((entry) => [entry.id, {
                    id: entry.id,
                    category: entry.theme || "한자성어",
                    prompt: "이 뜻에 맞는 한자성어를 고르세요.",
                    sentence: entry.meaning,
                    choices: withDistractors(entry.word, allWords),
                    answer: entry.word,
                    explanation: `${entry.word}(${entry.hanja}) · ${entry.hanjaExpl || ""}`.trim()
                }]));
                const lessons = (window.IDIOM_LESSONS || []).map((lesson, index) => ({
                    id: `lesson-${index + 1}`,
                    title: lesson.title,
                    note: lesson.description || "",
                    ids: lesson.ids.filter((id) => questions.has(id))
                })).filter((lesson) => lesson.ids.length > 0);
                return { questions, lessons };
            }
        },
        {
            id: "hanja",
            title: "한자",
            subject: "한자",
            scripts: ["/learning/literacy-numeracy/hanja-meaning/v2/quiz/race-data.js?v=20260918-quiz2"],
            getBank() {
                // 자료는 단계별 문제 풀기 화면에서 모아 둔 것이다.
                // 고치려면 hanja-meaning/_build-race-data.js 를 다시 돌린다.
                const entries = Array.isArray(window.HANJA_RACE) ? window.HANJA_RACE : [];
                const questions = new Map();
                const byStage = new Map();
                entries.forEach((entry) => {
                    if (!entry?.prompt || !Array.isArray(entry.words) || !entry.words.includes(entry.answer)) return;
                    questions.set(entry.id, {
                        id: entry.id,
                        category: `${entry.stage}단계 · ${entry.target}(${entry.reading})`.slice(0, 40),
                        prompt: "보기 넷 가운데 하나를 고르세요.",
                        sentence: entry.prompt,
                        choices: [...entry.words],
                        answer: entry.answer,
                        explanation: entry.note
                    });
                    if (!byStage.has(entry.stage)) byStage.set(entry.stage, []);
                    byStage.get(entry.stage).push(entry.id);
                });
                const lessons = [...byStage.entries()]
                    .sort((a, b) => a[0] - b[0])
                    .map(([stage, ids]) => ({
                        id: `stage-${stage}`,
                        title: `${stage}단계`,
                        note: `${ids.length}문제`,
                        ids
                    }));
                return { questions, lessons };
            }
        },
        {
            id: "mathox",
            title: "수학 OX",
            subject: "수학",
            scripts: ["/learning/literacy-numeracy/math-ox/data.js?v=20260909-2"],
            getBank() {
                const entries = Array.isArray(window.MATH_OX_DATA) ? window.MATH_OX_DATA : [];
                const questions = new Map();
                const unitOrder = [];
                const byUnit = new Map();
                entries.forEach((entry) => {
                    if (!entry?.prompt || (entry.answer !== "O" && entry.answer !== "X")) return;
                    const id = `ox-${entry.id}`;
                    const unitKey = `${entry.subject} · ${entry.unit}`;
                    questions.set(id, {
                        id,
                        category: unitKey.slice(0, 40),
                        prompt: "맞으면 O, 틀리면 X를 고르세요.",
                        sentence: entry.prompt,
                        choices: ["O", "X"],
                        answer: entry.answer,
                        // 원래 앱은 굵은 글씨를 별표로 적는다. 순위전 화면은 글자 그대로
                        // 보여 주므로 별표를 떼어 낸다.
                        explanation: plainText(entry.reason)
                    });
                    if (!byUnit.has(unitKey)) { byUnit.set(unitKey, []); unitOrder.push(unitKey); }
                    byUnit.get(unitKey).push(id);
                });
                const lessons = unitOrder.map((unitKey, index) => ({
                    id: `unit-${index + 1}`,
                    title: unitKey,
                    note: `${byUnit.get(unitKey).length}문제`,
                    ids: byUnit.get(unitKey)
                }));
                return { questions, lessons };
            }
        },
        {
            id: "english",
            title: "영단어",
            subject: "영어",
            data: { words: "/learning/literacy-numeracy/vocabulary/assets/data/english-vocabulary-3000-v2.json" },
            getBank(fetched) {
                const words = Array.isArray(fetched.words?.words) ? fetched.words.words : [];
                // 오답은 같은 단계, 되도록 같은 품사에서 뽑는다. 초급 낱말 옆에 고급
                // 낱말이 서면 뜻을 몰라도 눈에 띄고, 품사가 다르면 빈칸에 넣어 보는
                // 것만으로 답이 걸러진다.
                const byLevel = new Map();
                const byLevelAndPos = new Map();
                words.forEach((word) => {
                    const level = Number(word.globalLevel) || 0;
                    if (!byLevel.has(level)) byLevel.set(level, []);
                    byLevel.get(level).push(word.word);
                    const key = `${level}|${word.pos?.[0] || ""}`;
                    if (!byLevelAndPos.has(key)) byLevelAndPos.set(key, []);
                    byLevelAndPos.get(key).push(word.word);
                });

                const poolFor = (entry) => {
                    const level = Number(entry.globalLevel) || 0;
                    const samePos = byLevelAndPos.get(`${level}|${entry.pos?.[0] || ""}`) || [];
                    // 정답을 뺀 뒤에도 오답 둘을 채울 수 있을 때만 품사를 맞춘다.
                    if (samePos.filter((word) => word !== entry.word).length >= 2) return samePos;
                    return byLevel.get(level) || [];
                };

                const questions = new Map();
                words.forEach((entry) => {
                    const meaning = shortMeaning(entry.meanings?.[0]);
                    if (!entry.word || !meaning) return;
                    const id = `en-${entry.id}`;
                    const pool = poolFor(entry);
                    const example = entry.example || null;
                    const blanked = blankOut(example?.en, entry.word);
                    questions.set(id, {
                        id,
                        category: entry.levelLabel || "영단어",
                        prompt: blanked ? "빈칸에 알맞은 낱말을 고르세요." : "뜻에 맞는 낱말을 고르세요.",
                        sentence: blanked
                            ? `${blanked}${example?.ko ? ` (${example.ko})` : ""}`
                            : meaning,
                        choices: withDistractors(entry.word, pool),
                        answer: entry.word,
                        explanation: `${entry.word} · ${meaning}`
                    });
                });

                // 차시는 단계 안에서 익히는 차례대로 스무 낱말씩 끊는다.
                const lessons = [];
                const levels = [...new Set(words.map((word) => Number(word.globalLevel) || 0))].sort((a, b) => a - b);
                levels.forEach((level) => {
                    const inLevel = words
                        .filter((word) => (Number(word.globalLevel) || 0) === level)
                        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
                        .map((word) => `en-${word.id}`)
                        .filter((id) => questions.has(id));
                    const label = words.find((word) => (Number(word.globalLevel) || 0) === level)?.levelLabel || `${level}단계`;
                    chunkLessons(inLevel, 20,
                        (number) => `${label} · ${number}묶음`,
                        (ids) => ids.slice(0, 3).map((id) => questions.get(id).answer).join(" · ")
                    ).forEach((lesson, index) => {
                        lessons.push({ ...lesson, id: `level-${level}-${index + 1}` });
                    });
                });
                return { questions, lessons };
            }
        }
    ];

    const bankCache = new Map();

    async function load(appId) {
        const app = apps.find((entry) => entry.id === appId);
        if (!app) throw new Error("알 수 없는 앱입니다.");
        if (bankCache.has(appId)) return bankCache.get(appId);
        for (const url of app.scripts || []) await loadScript(url);
        const fetched = {};
        for (const [key, url] of Object.entries(app.data || {})) fetched[key] = await loadJson(url);
        const bank = app.getBank(fetched);
        if (!bank.questions.size) throw new Error(`${app.title} 문제를 불러오지 못했습니다.`);
        bankCache.set(appId, bank);
        return bank;
    }

    window.ClassRaceApps = Object.freeze({
        list: () => apps.map(({ id, title, subject }) => ({ id, title, subject })),
        get: (appId) => apps.find((entry) => entry.id === appId) || null,
        load,
        shuffle
    });
})();
