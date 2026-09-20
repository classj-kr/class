(() => {
    "use strict";

    const course = window.SENTENCE_COURSE;
    if (!course || !Array.isArray(course.lessons)) return;

    const STORAGE_KEY = "classj-sentence-building-progress-v2";
    const elements = {
        courseScreen: document.getElementById("courseScreen"),
        lessonScreen: document.getElementById("lessonScreen"),
        resultScreen: document.getElementById("resultScreen"),
        lessonList: document.getElementById("lessonList"),
        missionNumber: document.getElementById("missionNumber"),
        missionTotal: document.getElementById("missionTotal"),
        missionProgressFill: document.getElementById("missionProgressFill"),
        lessonTitle: document.getElementById("lessonTitle"),
        lessonMeta: document.getElementById("lessonMeta"),
        taskPrompt: document.getElementById("taskPrompt"),
        taskScene: document.getElementById("taskScene"),
        activityArea: document.getElementById("activityArea"),
        feedback: document.getElementById("feedback"),
        feedbackTitle: document.getElementById("feedbackTitle"),
        feedbackText: document.getElementById("feedbackText"),
        hintButton: document.getElementById("hintButton"),
        checkButton: document.getElementById("checkButton"),
        nextButton: document.getElementById("nextButton"),
        resultMessage: document.getElementById("resultMessage"),
        resultScore: document.getElementById("resultScore"),
        nextLessonButton: document.getElementById("nextLessonButton"),
        retryButton: document.getElementById("retryButton"),
        announcer: document.getElementById("announcer")
    };

    let saved = loadProgress();
    let currentLessonIndex = 0;
    let taskIndex = 0;
    let score = 0;
    let selectedChoice = null;
    let selectedChoices = new Set();
    let orderTokens = [];
    let selectedOrder = [];
    let checked = false;

    function loadProgress() {
        try {
            const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
            if (value && value.lessons && typeof value.lessons === "object") return value;
        } catch (_) {}
        return { lessons: {}, lastLesson: null };
    }

    function saveProgress() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (_) {}
    }

    function showOnly(screen) {
        [elements.courseScreen, elements.lessonScreen, elements.resultScreen].forEach((item) => {
            item.hidden = item !== screen;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function lessonRecord(id) {
        return saved.lessons[id] || { bestScore: 0, completed: false };
    }

    function currentSuggestedIndex() {
        const unfinished = course.lessons.findIndex((item) => !lessonRecord(item.id).completed);
        return unfinished < 0 ? course.lessons.length - 1 : unfinished;
    }

    function renderCourse() {
        elements.lessonList.replaceChildren();
        const suggested = currentSuggestedIndex();

        course.units.forEach((unit) => {
            const unitLessons = course.lessons.filter((item) => item.unit === unit.id);
            const unitComplete = unitLessons.filter((item) => lessonRecord(item.id).completed).length;
            const section = document.createElement("section");
            section.className = "unit-section";
            section.innerHTML = `
                <header class="unit-header">
                    <h2></h2>
                    <span class="unit-count"></span>
                </header>
                <div class="lesson-grid"></div>`;
            section.querySelector("h2").textContent = unit.title;
            section.querySelector(".unit-count").textContent = `${unitComplete}/${unitLessons.length} 완료`;
            const grid = section.querySelector(".lesson-grid");

            unitLessons.forEach((item) => {
                const index = course.lessons.indexOf(item);
                const record = lessonRecord(item.id);
                const button = document.createElement("button");
                button.type = "button";
                button.className = "lesson-card";
                if (record.completed) button.classList.add("is-complete");
                if (index === suggested && !record.completed) button.classList.add("is-current");
                button.setAttribute("aria-label", `${index + 1}차시 ${item.title}${record.completed ? ", 완료" : ""}`);
                button.innerHTML = `
                    <span class="lesson-number"></span>
                    <strong></strong>`;
                button.querySelector(".lesson-number").textContent = record.completed ? "✓" : String(index + 1).padStart(2, "0");
                button.querySelector("strong").textContent = item.title;
                button.addEventListener("click", () => startLesson(index));
                grid.append(button);
            });
            elements.lessonList.append(section);
        });

    }

    function startLesson(index) {
        currentLessonIndex = Math.max(0, Math.min(index, course.lessons.length - 1));
        taskIndex = 0;
        score = 0;
        saved.lastLesson = course.lessons[currentLessonIndex].id;
        saveProgress();
        showOnly(elements.lessonScreen);
        renderTask();
    }

    function shuffle(values) {
        const copy = values.slice();
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function renderTask() {
        const lesson = course.lessons[currentLessonIndex];
        const task = lesson.tasks[taskIndex];
        checked = false;
        selectedChoice = null;
        selectedChoices = new Set();
        selectedOrder = [];
        elements.feedback.hidden = true;
        elements.feedback.className = "feedback";
        elements.checkButton.hidden = false;
        elements.nextButton.hidden = true;
        elements.hintButton.hidden = false;
        elements.activityArea.replaceChildren();
        elements.lessonTitle.textContent = `${currentLessonIndex + 1}차시 ${lesson.title}`;
        elements.lessonMeta.textContent = `교사용 · ${lesson.gradeBand} · ${lesson.standards.map((code) => `[${code}]`).join(" · ")} · ${lesson.goal}`;
        elements.missionNumber.textContent = String(taskIndex + 1);
        elements.missionTotal.textContent = String(lesson.tasks.length);
        elements.missionProgressFill.style.width = `${(taskIndex / lesson.tasks.length) * 100}%`;
        elements.taskPrompt.textContent = task.prompt;
        elements.taskScene.textContent = task.scene || "";
        if (task.type === "choice") renderChoices(task, false);
        if (task.type === "multi") renderChoices(task, true);
        if (task.type === "order") renderOrder(task);
        if (task.type === "write") renderWriting(task);
        elements.announcer.textContent = `${taskIndex + 1}번째 문제. ${task.prompt}`;
    }

    function renderChoices(task, allowMultiple) {
        const list = document.createElement("div");
        list.className = "choice-list";
        if (allowMultiple) {
            const guide = document.createElement("p");
            guide.className = "multi-guide";
            guide.textContent = "정답을 모두 선택하세요.";
            list.append(guide);
        }
        const indexedOptions = task.options.map((option, optionIndex) => ({ option, optionIndex }));
        const optionEntries = task.shuffleOptions === false ? indexedOptions : shuffle(indexedOptions);
        optionEntries.forEach(({ option, optionIndex }, displayIndex) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "choice-button";
            button.dataset.optionIndex = String(optionIndex);
            button.textContent = `${displayIndex + 1}. ${option}`;
            if (allowMultiple) button.setAttribute("aria-pressed", "false");
            button.addEventListener("click", () => {
                if (checked) return;
                if (allowMultiple) {
                    if (selectedChoices.has(optionIndex)) selectedChoices.delete(optionIndex);
                    else selectedChoices.add(optionIndex);
                    button.classList.toggle("is-selected", selectedChoices.has(optionIndex));
                    button.setAttribute("aria-pressed", String(selectedChoices.has(optionIndex)));
                    return;
                }
                selectedChoice = optionIndex;
                list.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
                button.classList.add("is-selected");
            });
            list.append(button);
        });
        elements.activityArea.append(list);
    }

    function renderOrder(task) {
        orderTokens = shuffle(task.tokens.map((value, index) => ({ id: `${index}-${value}`, value })));
        const board = document.createElement("div");
        board.className = "order-board";
        board.innerHTML = `<p>${task.boardLabel || "내가 정한 순서"}</p><div class="token-row selected-tokens"></div>`;
        const bank = document.createElement("div");
        bank.className = "token-bank";
        bank.innerHTML = `<p>${task.bankLabel || "문장 카드"}</p><div class="token-row bank-tokens"></div>`;
        elements.activityArea.append(board, bank);

        function refresh() {
            const selected = board.querySelector(".selected-tokens");
            const available = bank.querySelector(".bank-tokens");
            selected.replaceChildren();
            available.replaceChildren();
            selectedOrder.forEach((token, selectedIndex) => {
                const button = tokenButton(token.value);
                button.setAttribute("aria-label", `${token.value} 카드 되돌리기`);
                button.addEventListener("click", () => {
                    if (checked) return;
                    selectedOrder.splice(selectedIndex, 1);
                    refresh();
                });
                selected.append(button);
            });
            orderTokens.forEach((token) => {
                const button = tokenButton(token.value);
                const used = selectedOrder.some((item) => item.id === token.id);
                button.disabled = used || checked;
                button.addEventListener("click", () => {
                    if (checked || used) return;
                    selectedOrder.push(token);
                    refresh();
                });
                available.append(button);
            });
        }
        refresh();
    }

    function tokenButton(text) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "word-token";
        button.textContent = text;
        return button;
    }

    function renderWriting(task) {
        const wrapper = document.createElement("div");
        wrapper.className = "write-area";
        const textarea = document.createElement("textarea");
        textarea.id = "reportText";
        textarea.placeholder = task.placeholder || "조건을 확인하며 글을 쓰세요.";
        textarea.setAttribute("aria-label", `${task.minSentences}문장 이상 글쓰기`);
        const rubric = document.createElement("ul");
        rubric.className = "rubric-list";
        (task.criteria || []).forEach((criterion) => {
            const item = document.createElement("li");
            const label = document.createElement("label");
            label.className = "rubric-check";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "rubric-checkbox";
            const text = document.createElement("span");
            text.textContent = criterion;
            checkbox.addEventListener("change", () => {
                item.classList.toggle("is-checked", checkbox.checked);
            });
            label.append(checkbox, text);
            item.append(label);
            rubric.append(item);
        });
        const count = document.createElement("div");
        count.className = "writing-count";
        const updateCount = () => {
            const length = textarea.value.trim().length;
            count.textContent = `${sentenceCount(textarea.value)} / ${task.minSentences}문장 · ${length} / ${task.minChars || 20}자`;
        };
        textarea.addEventListener("input", updateCount);
        wrapper.append(rubric, textarea, count);
        elements.activityArea.append(wrapper);
        updateCount();
    }

    function sentenceCount(value) {
        const text = String(value || "").trim();
        if (!text) return 0;
        const ended = text.match(/[^.!?。！？\n]+[.!?。！？]+/g) || [];
        const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
        return Math.max(ended.length, lines.length);
    }

    function currentTask() {
        return course.lessons[currentLessonIndex].tasks[taskIndex];
    }

    function showFeedback(kind, title, text) {
        elements.feedback.hidden = false;
        elements.feedback.className = `feedback ${kind}`;
        elements.feedbackTitle.textContent = title;
        elements.feedbackText.textContent = text;
    }

    function validateTask(task) {
        if (task.type === "choice") {
            if (selectedChoice === null) return null;
            return selectedChoice === task.answer;
        }
        if (task.type === "multi") {
            if (selectedChoices.size === 0) return null;
            return selectedChoices.size === task.answers.length && task.answers.every((answer) => selectedChoices.has(answer));
        }
        if (task.type === "order") {
            if (selectedOrder.length !== task.answer.length) return null;
            return selectedOrder.every((token, index) => token.value === task.answer[index]);
        }
        const textarea = document.getElementById("reportText");
        if (!textarea || !textarea.value.trim()) return null;
        if (sentenceCount(textarea.value) < task.minSentences || textarea.value.trim().length < (task.minChars || 20)) return null;
        const rubricChecks = [...elements.activityArea.querySelectorAll(".rubric-checkbox")];
        if (rubricChecks.some((input) => !input.checked)) return null;
        return true;
    }

    function checkAnswer() {
        if (checked) return;
        const task = currentTask();
        const correct = validateTask(task);
        if (correct === null) {
            const incomplete = task.type === "order"
                ? "모든 문장 카드를 순서 칸에 놓아 보세요."
                : task.type === "write"
                    ? `${task.minSentences}문장, ${task.minChars || 20}자 이상 쓰고 작성 기준을 모두 확인해 체크해 주세요.`
                    : task.type === "multi"
                        ? "정답이라고 생각하는 항목을 모두 골라 보세요."
                        : "정답이라고 생각하는 문장을 먼저 골라 보세요.";
            showFeedback("hint", "답을 완성해 주세요", incomplete);
            elements.announcer.textContent = elements.feedbackText.textContent;
            return;
        }

        checked = true;
        elements.hintButton.hidden = true;
        elements.checkButton.hidden = true;
        elements.nextButton.hidden = false;
        if (correct) {
            score += 1;
            showFeedback("good", task.type === "write" ? "작성 기준을 충족했어요" : "정답입니다", task.explain);
        } else {
            showFeedback("bad", "정답을 확인해 보세요", task.explain);
        }

        if (task.type === "choice") {
            elements.activityArea.querySelectorAll(".choice-button").forEach((button) => {
                const optionIndex = Number(button.dataset.optionIndex);
                button.disabled = true;
                if (optionIndex === task.answer) button.classList.add("is-correct");
                if (optionIndex === selectedChoice && optionIndex !== task.answer) button.classList.add("is-wrong");
            });
        }
        if (task.type === "multi") {
            elements.activityArea.querySelectorAll(".choice-button").forEach((button) => {
                const optionIndex = Number(button.dataset.optionIndex);
                button.disabled = true;
                if (task.answers.includes(optionIndex)) button.classList.add("is-correct");
                if (selectedChoices.has(optionIndex) && !task.answers.includes(optionIndex)) button.classList.add("is-wrong");
            });
        }
        elements.nextButton.textContent = taskIndex === course.lessons[currentLessonIndex].tasks.length - 1 ? "학습 완료 →" : "다음 문제 →";
        elements.announcer.textContent = `${elements.feedbackTitle.textContent}. ${task.explain}`;
    }

    function showHint() {
        const task = currentTask();
        showFeedback("hint", "힌트", task.hint);
        elements.announcer.textContent = task.hint;
    }

    function nextTask() {
        const lesson = course.lessons[currentLessonIndex];
        if (taskIndex < lesson.tasks.length - 1) {
            taskIndex += 1;
            renderTask();
        } else {
            finishLesson();
        }
    }

    function finishLesson() {
        const lesson = course.lessons[currentLessonIndex];
        const old = lessonRecord(lesson.id);
        saved.lessons[lesson.id] = {
            completed: true,
            bestScore: Math.max(old.bestScore || 0, score)
        };
        saveProgress();
        elements.resultScore.textContent = `${score}/${lesson.tasks.length}`;
        elements.resultMessage.textContent = score === lesson.tasks.length
            ? "모든 문제를 맞혔습니다."
            : "틀린 문제는 다시 도전해서 확인해 보세요.";
        elements.nextLessonButton.hidden = currentLessonIndex >= course.lessons.length - 1;
        showOnly(elements.resultScreen);
    }

    elements.hintButton.addEventListener("click", showHint);
    elements.checkButton.addEventListener("click", checkAnswer);
    elements.nextButton.addEventListener("click", nextTask);
    window.addEventListener("sitebackrequest", (event) => {
        if (!elements.courseScreen.hidden) return;
        event.preventDefault();
        renderCourse();
        showOnly(elements.courseScreen);
    });
    elements.retryButton.addEventListener("click", () => startLesson(currentLessonIndex));
    elements.nextLessonButton.addEventListener("click", () => startLesson(currentLessonIndex + 1));

    renderCourse();
    showOnly(elements.courseScreen);
})();
