(async () => {
    "use strict";

    const SESSION_SIZE = 10;
    const records = LearningRecords.create('spelling', { label: '한글 맞춤법' });
    await records.ready;
    const lessonProgress = {};
    let busy = false;
    const setBusy = value => { busy = value; document.querySelector('main').inert = value; };
    const questionBank = Array.isArray(window.SPELLING_QUESTIONS)
        ? window.SPELLING_QUESTIONS
        : [];
    const questionById = new Map(questionBank.map((question) => [question.id, question]));
    const lessons = Array.isArray(window.SPELLING_LESSONS) ? window.SPELLING_LESSONS : [];

    document.querySelectorAll("[data-question-count]").forEach((node) => { node.textContent = String(questionBank.length); });
    document.querySelectorAll("[data-lesson-count]").forEach((node) => { node.textContent = String(lessons.length); });

    const elements = {
        lessonScreen: document.getElementById("lessonScreen"),
        quizScreen: document.getElementById("quizScreen"),
        resultScreen: document.getElementById("resultScreen"),
        lessonProgressSummary: document.getElementById("lessonProgressSummary"),
        lessonList: document.getElementById("lessonList"),
        restartButton: document.getElementById("restartButton"),
        nextLessonButton: document.getElementById("nextLessonButton"),
        lessonListButton: document.getElementById("lessonListButton"),
        nextButton: document.getElementById("nextButton"),
        backLink: document.querySelector(".back-link"),
        headerBestScore: document.getElementById("headerBestScore"),
        quizModeLabel: document.getElementById("quizModeLabel"),
        questionNumber: document.getElementById("questionNumber"),
        questionTotal: document.getElementById("questionTotal"),
        currentScore: document.getElementById("currentScore"),
        progressFill: document.getElementById("progressFill"),
        questionCategory: document.getElementById("questionCategory"),
        questionPrompt: document.getElementById("questionPrompt"),
        questionText: document.getElementById("questionText"),
        choiceList: document.getElementById("choiceList"),
        feedback: document.getElementById("feedback"),
        feedbackTitle: document.getElementById("feedbackTitle"),
        correctAnswer: document.getElementById("correctAnswer"),
        explanation: document.getElementById("explanation"),
        resultEyebrow: document.getElementById("resultEyebrow"),
        resultTitle: document.getElementById("resultTitle"),
        finalScore: document.getElementById("finalScore"),
        finalTotal: document.getElementById("finalTotal"),
        resultMessage: document.getElementById("resultMessage"),
        bestMessage: document.getElementById("bestMessage"),
        reviewArea: document.getElementById("reviewArea"),
        perfectReview: document.getElementById("perfectReview"),
        missedList: document.getElementById("missedList"),
        announcer: document.getElementById("announcer")
    };

    const screens = [
        elements.lessonScreen,
        elements.quizScreen,
        elements.resultScreen
    ];

    const state = {
        mode: "",
        lessonIndex: -1,
        questions: [],
        currentIndex: 0,
        score: 0,
        answered: false,
        hadWrong: false,
        firstWrongChoice: "",
        answers: []
    };

    function readLessonProgress() {
        return lessonProgress;
    }

    function save(events = [], complete = false) {
        return records.save({ checkpoint: state, events, complete, progress: { current: state.answers.length, total: state.questions.length } });
    }

    function shuffle(items) {
        const copy = [...items];
        for (let index = copy.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
        }
        return copy;
    }

    function sessionSize() {
        return state.questions.length;
    }

    function currentLesson() {
        return lessons[state.lessonIndex] || null;
    }

    function takePersonalQuestionIds() {
        return shuffle(questionBank).slice(0, SESSION_SIZE).map(q => q.id);
    }

    function buildSession(questionIds, limit) {
        const selected = questionIds.map((id) => questionById.get(id)).filter(Boolean);
        const trimmed = limit ? selected.slice(0, limit) : selected;
        return trimmed.map((question) => ({
            ...question,
            choices: shuffle(question.choices)
        }));
    }

    function setScreen(activeScreen) {
        screens.forEach((screen) => screen?.classList.toggle("hidden", screen !== activeScreen));
    }

    function buildLessonCard({ numberText, title, note, metaText, isDone, isPerfect, extraClass, onClick }) {
        const item = document.createElement("li");
        const button = document.createElement("button");
        const number = document.createElement("span");
        const copy = document.createElement("span");
        const titleEl = document.createElement("strong");
        const noteEl = document.createElement("small");
        const meta = document.createElement("span");

        button.type = "button";
        button.className = "lesson-card";
        if (extraClass) button.classList.add(extraClass);
        if (isDone) button.classList.add("is-done");
        if (isPerfect) button.classList.add("is-perfect");
        number.className = "lesson-number";
        number.textContent = numberText;
        copy.className = "lesson-copy";
        titleEl.textContent = title;
        noteEl.textContent = note;
        copy.append(titleEl, noteEl);
        meta.className = "lesson-meta";
        meta.textContent = metaText;
        button.append(number, copy, meta);
        button.addEventListener("click", onClick);
        item.append(button);
        return item;
    }

    function buildRandomCard() {
        const best = 0;
        return buildLessonCard({
            numberText: "무작위",
            title: "전체 무작위 10문제",
            note: `${questionBank.length}문제 중 10문제, 매번 다르게 나와요`,
            metaText: best > 0 ? `${best === SESSION_SIZE ? "✓ 완벽" : "✓ 최고"} · ${best}/${SESSION_SIZE}` : `${SESSION_SIZE}문제`,
            isDone: best > 0,
            isPerfect: best === SESSION_SIZE,
            extraClass: "is-random",
            onClick: startRandomQuiz
        });
    }

    function renderLessonList() {
        const progress = readLessonProgress();
        const completedCount = lessons.filter((lesson) => progress[lesson.id]).length;
        elements.lessonProgressSummary.textContent = `${lessons.length}차시 중 ${completedCount}차시를 끝냈어요. 차시를 골라 문제를 풀어요.`;
        elements.lessonList.replaceChildren(buildRandomCard(), ...lessons.map((lesson, index) => {
            const record = progress[lesson.id];
            return buildLessonCard({
                numberText: `${index + 1}차시`,
                title: lesson.title,
                note: lesson.note,
                metaText: record
                    ? '완료'
                    : `${lesson.ids.length}문제`,
                isDone: Boolean(record),
                isPerfect: false,
                onClick: () => startLesson(index)
            });
        }));
    }

    function selectLessonMode() {
        state.mode = "lesson";
        renderLessonList();
        setScreen(elements.lessonScreen);
        elements.lessonList.querySelector("button")?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function startLesson(lessonIndex) {
        state.mode = "lesson";
        state.lessonIndex = lessonIndex;
        startLessonQuiz();
    }

    function startLessonQuiz() {
        const lesson = currentLesson();
        if (!lesson) return;
        startQuiz(shuffle(lesson.ids));
    }

    function startRandomQuiz() {
        state.mode = "personal";
        state.lessonIndex = -1;
        startQuiz();
    }

    async function startQuiz(questionIds) {
        if (busy) return; setBusy(true);
        const isLesson = state.mode === "lesson";
        const ids = Array.isArray(questionIds) ? questionIds : takePersonalQuestionIds();
        const session = buildSession(ids, isLesson ? 0 : SESSION_SIZE);
        const expected = isLesson ? ids.length : SESSION_SIZE;
        if (session.length === 0 || session.length !== expected) {
            elements.lessonProgressSummary.textContent = "문항을 불러오지 못했어요. 새로고침해 주세요.";
            setBusy(false);
            return;
        }

        state.questions = session;
        state.currentIndex = 0;
        state.score = 0;
        state.answered = false;
        state.answers = [];
        state.tried = {};
        const saved = await records.start({ contentKey: isLesson ? currentLesson().id : 'random', title: isLesson ? '맞춤법 · ' + currentLesson().title : '맞춤법 · 무작위 10문제', version: '20261002', checkpoint: state });
        Object.assign(state, saved.checkpoint);
        elements.currentScore.textContent = "0";
        elements.questionTotal.textContent = String(sessionSize());
        elements.quizModeLabel.textContent = isLesson ? `${state.lessonIndex + 1}차시 확인` : "무작위 10문제";
        setScreen(elements.quizScreen);
        renderQuestion();
        setBusy(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderQuestion() {
        const question = state.questions[state.currentIndex];
        const tried = state.tried[question.id] || [];
        state.answered = tried.includes(question.answer);
        state.hadWrong = tried.some(choice => choice !== question.answer);
        state.firstWrongChoice = tried.find(choice => choice !== question.answer) || '';

        elements.questionNumber.textContent = String(state.currentIndex + 1);
        elements.progressFill.style.width = `${((state.currentIndex + 1) / sessionSize()) * 100}%`;
        elements.questionCategory.textContent = question.category;
        elements.questionPrompt.textContent = question.prompt;
        elements.questionText.textContent = question.sentence;
        elements.choiceList.replaceChildren();
        elements.feedback.classList.add("hidden");
        elements.feedback.classList.remove("is-wrong");
        elements.nextButton.textContent = state.currentIndex === sessionSize() - 1
            ? "결과 보기"
            : "다음 문제";

        question.choices.forEach((choice, index) => {
            const button = document.createElement("button");
            const number = document.createElement("span");

            button.type = "button";
            button.className = "choice-button";
            button.dataset.choice = choice;
            button.disabled = state.answered || tried.includes(choice);
            if (tried.includes(choice)) button.classList.add(choice === question.answer ? 'is-correct' : 'is-wrong');
            button.append(document.createTextNode(choice));

            number.className = "choice-number";
            number.setAttribute("aria-hidden", "true");
            number.textContent = String(index + 1);
            button.append(number);

            button.addEventListener("click", () => selectAnswer(choice, button));
            elements.choiceList.append(button);
        });

        if (state.answered) { elements.feedbackTitle.textContent = '정답이에요!'; elements.correctAnswer.textContent = '정답: ' + question.answer; elements.explanation.textContent = question.explanation; elements.feedback.classList.remove('hidden'); }
        elements.choiceList.querySelector('button:not(:disabled)')?.focus({ preventScroll: true });
    }

    async function selectAnswer(selectedChoice, selectedButton) {
        if (state.answered || busy) return;
        setBusy(true);
        const question = state.questions[state.currentIndex];
        const isCorrect = selectedChoice === question.answer;
        const buttons = [...elements.choiceList.querySelectorAll("button")];
        (state.tried[question.id] ||= []).push(selectedChoice);
        const event = { kind: 'answer', questionKey: String(question.id), response: selectedChoice, correct: isCorrect, snapshot: { prompt: question.prompt, sentence: question.sentence, choices: question.choices } };

        if (!isCorrect) {
            state.hadWrong = true;
            if (!state.firstWrongChoice) state.firstWrongChoice = selectedChoice;
            selectedButton.classList.add("is-wrong");
            selectedButton.disabled = true;
            elements.feedbackTitle.textContent = "다시 생각해 보세요.";
            elements.explanation.textContent = "다른 답을 골라보세요.";
            elements.correctAnswer.textContent = "";
            elements.feedback.classList.add("is-wrong");
            elements.feedback.classList.remove("hidden");
            elements.announcer.textContent = "다시 생각하고 다른 답을 골라보세요.";
            await save([event]); setBusy(false);
            return;
        }

        state.answered = true;

        buttons.forEach((button) => {
            button.disabled = true;
            if (button.dataset.choice === question.answer) button.classList.add("is-correct");
        });

        if (!state.hadWrong) {
            state.score += 1;
            elements.currentScore.textContent = String(state.score);
        }

        state.answers.push({
            question,
            selectedChoice: state.hadWrong ? state.firstWrongChoice : selectedChoice,
            isCorrect: !state.hadWrong
        });
        await save([event]); setBusy(false);
        elements.feedbackTitle.textContent = "정답이에요!";
        elements.feedback.classList.remove("is-wrong");
        elements.correctAnswer.textContent = `정답: ${question.answer}`;
        elements.explanation.textContent = question.explanation;
        elements.feedback.classList.remove("hidden");
        elements.announcer.textContent = `${elements.feedbackTitle.textContent} 정답은 ${question.answer}입니다. ${question.explanation}`;
        elements.nextButton.focus({ preventScroll: true });
    }

    async function goToNextQuestion() {
        if (!state.answered || busy) return;
        if (state.currentIndex >= sessionSize() - 1) {
            showResults();
            return;
        }
        state.currentIndex += 1;
        renderQuestion();
        await save();
    }

    async function showResults() {
        setBusy(true); await save([],true);
        if(state.mode==='lesson') lessonProgress[currentLesson().id]={completed:true};
        selectLessonMode(); records.showResult(); setBusy(false);
    }

    function restartCurrent() {
        if (state.mode === "lesson") {
            startLessonQuiz();
            return;
        }
        startQuiz();
    }

    function goToNextLesson() {
        if (state.lessonIndex + 1 >= lessons.length) {
            selectLessonMode();
            return;
        }
        startLesson(state.lessonIndex + 1);
    }

    function handleKeyboard(event) {
        if (elements.quizScreen.classList.contains("hidden")) return;
        if (!state.answered && /^[1-4]$/.test(event.key)) {
            const choice = elements.choiceList.querySelectorAll("button")[Number(event.key) - 1];
            if (choice) {
                event.preventDefault();
                choice.click();
            }
            return;
        }
        if (state.answered && event.key === "Enter" && document.activeElement !== elements.nextButton) {
            event.preventDefault();
            goToNextQuestion();
        }
    }

    // 공용 뒤로가기 단추(assets/site-back-navigation.js)가 눌리면 먼저 물어본다.
    // 차시 목록(집)이 아니면 사이트 밖으로 나가지 않고 차시 목록으로만 돌아간다.
    window.addEventListener("sitebackrequest", (event) => {
        if (elements.lessonScreen.classList.contains("hidden")) {
            event.preventDefault();
            selectLessonMode();
        }
    });

    // 화면 왼쪽 위 화살표는 공용 뒤로가기 단추가 안 떠도 항상 같은 규칙으로 움직인다.
    // 차시 목록이 아니면 그 목록으로만 돌아가고, 이미 목록이면 그때 메인 화면으로 나간다.
    elements.backLink?.addEventListener("click", (event) => {
        if (elements.lessonScreen.classList.contains("hidden")) {
            event.preventDefault();
            selectLessonMode();
        }
    });

    elements.restartButton.addEventListener("click", restartCurrent);
    elements.nextLessonButton.addEventListener("click", goToNextLesson);
    elements.lessonListButton.addEventListener("click", selectLessonMode);
    elements.nextButton.addEventListener("click", goToNextQuestion);
    document.addEventListener("keydown", handleKeyboard);

    elements.headerBestScore?.parentElement?.remove();
    if (elements.currentScore) elements.currentScore.parentElement.hidden = true;
    let offset = 0;
    do { const page = await records.history('&offset=' + offset); for (const row of page.sessions) if (row.status === 'completed') lessonProgress[row.contentKey] = { completed: true }; offset = page.nextOffset; } while (offset != null);
    selectLessonMode();
    const resume = new URLSearchParams(location.search).get('record');
    if (resume === 'random') startRandomQuiz(); else if (resume) { const index = lessons.findIndex(l => l.id === resume); if (index >= 0) startLesson(index); }
})();
