(() => {
    "use strict";

    const GAME_ID = "quizrace";
    const PLAYER_NAME_KEY = "classPlayerName";

    const elements = {
        backLink: document.querySelector(".back-link"),
        missingScreen: document.getElementById("missingScreen"),
        lobbyScreen: document.getElementById("lobbyScreen"),
        quizScreen: document.getElementById("quizScreen"),
        resultScreen: document.getElementById("resultScreen"),
        joinPane: document.getElementById("joinPane"),
        createRaceLink: document.getElementById("createRaceLink"),
        joinCode: document.getElementById("joinCode"),
        joinButton: document.getElementById("joinBtn"),
        waitingPane: document.getElementById("waitingPane"),
        studentRoomCode: document.getElementById("studentRoomCode"),
        joinStatus: document.getElementById("joinStatus"),
        lobbyGuide: document.getElementById("lobbyGuide"),
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
        nextButton: document.getElementById("nextButton"),
        finalScore: document.getElementById("finalScore"),
        finalTotal: document.getElementById("finalTotal"),
        resultMessage: document.getElementById("resultMessage"),
        myRankCard: document.getElementById("myRankCard"),
        classRankingList: document.getElementById("classRankingList"),
        rankingWaiting: document.getElementById("rankingWaiting"),
        perfectReview: document.getElementById("perfectReview"),
        missedList: document.getElementById("missedList"),
        announcer: document.getElementById("announcer")
    };

    const screens = [elements.missingScreen, elements.lobbyScreen, elements.quizScreen, elements.resultScreen];

    const state = {
        questions: [],
        currentIndex: 0,
        score: 0,
        answered: false,
        hadWrong: false,
        firstWrongChoice: "",
        answers: [],
        sessionId: "",
        resultSubmitted: false,
        race: null
    };

    let lobby = null;

    function getPlayerName() {
        try {
            return (localStorage.getItem(PLAYER_NAME_KEY) || "").trim();
        } catch (error) {
            return "";
        }
    }

    function hasValidPlayerName() {
        return /^[가-힣]{2,6}$/.test(getPlayerName());
    }

    function setScreen(activeScreen) {
        screens.forEach((screen) => screen?.classList.toggle("hidden", screen !== activeScreen));
    }

    function total() {
        return state.questions.length;
    }

    function syncLobby(snapshot) {
        if (!snapshot) return;
        const connected = snapshot.connected && snapshot.roomCode;
        elements.joinPane.classList.toggle("hidden", Boolean(connected));
        elements.waitingPane.classList.toggle("hidden", !connected);
        // 코드를 넣는 자리는 좁은 카드, 대기실은 이름이 늘어서니 넓은 카드.
        elements.lobbyScreen.classList.toggle("is-compact", !connected);
        if (connected) {
            elements.studentRoomCode.textContent = snapshot.roomCode;
            elements.lobbyGuide.textContent = `현재 ${Object.keys(snapshot.players).length}명 접속 · 선생님이 시작하면 동시에 문제가 열립니다.`;
        }
    }

    function handleServerMessage(message, snapshot) {
        if (message.type === "QUIZRACE_ERROR") {
            elements.joinStatus.textContent = message.message || "학급 순위전 요청을 처리하지 못했습니다.";
            elements.announcer.textContent = elements.joinStatus.textContent;
            return;
        }
        if (message.type !== "QUIZRACE_STATE" || !message.state) return;

        const previousSessionId = state.sessionId;
        state.race = message.state;
        renderClassRanking(message.state, snapshot?.myId || lobby?.snapshot().myId);

        if (message.state.phase === "running" && message.state.sessionId && message.state.sessionId !== previousSessionId) {
            state.sessionId = message.state.sessionId;
            startQuiz(message.state);
            return;
        }

        if (message.state.phase === "lobby" && previousSessionId) {
            state.sessionId = "";
            state.resultSubmitted = false;
            setScreen(elements.lobbyScreen);
            syncLobby(lobby.snapshot());
            elements.announcer.textContent = "새 학급 순위전을 기다립니다.";
        }
    }

    function startQuiz(race) {
        const questions = Array.isArray(race.questions) ? race.questions : [];
        if (!questions.length) {
            elements.joinStatus.textContent = "문항을 받지 못했어요.";
            return;
        }
        state.questions = questions;
        state.currentIndex = 0;
        state.score = 0;
        state.answered = false;
        state.answers = [];
        state.resultSubmitted = false;
        elements.currentScore.textContent = "0";
        elements.questionTotal.textContent = String(total());
        elements.quizModeLabel.textContent = [race.appTitle, race.rangeTitle].filter(Boolean).join(" · ") || "학급 순위전";
        setScreen(elements.quizScreen);
        renderQuestion();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // 수학 문항에는 $수식$ 이 섞여 있다. KaTeX 가 실렸을 때만 그린다.
    function renderMath(element) {
        if (!element || !window.renderMathInElement) return;
        window.renderMathInElement(element, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false }
            ],
            throwOnError: false
        });
    }

    function renderQuestion() {
        const question = state.questions[state.currentIndex];
        state.answered = false;
        state.hadWrong = false;
        state.firstWrongChoice = "";

        elements.questionNumber.textContent = String(state.currentIndex + 1);
        elements.progressFill.style.width = `${((state.currentIndex + 1) / total()) * 100}%`;
        elements.questionCategory.textContent = question.category || "";
        elements.questionCategory.classList.toggle("hidden", !question.category);
        elements.questionPrompt.textContent = question.prompt || "";
        elements.questionText.textContent = question.sentence;
        renderMath(elements.questionText);
        elements.choiceList.replaceChildren();
        elements.choiceList.className = `choice-list ${["", "", "is-two", "is-three", "is-four"][question.choices.length] || ""}`;
        elements.feedback.classList.add("hidden");
        elements.feedback.classList.remove("is-wrong");
        elements.nextButton.textContent = state.currentIndex === total() - 1 ? "결과 보기" : "다음 문제";

        question.choices.forEach((choice, index) => {
            const button = document.createElement("button");
            const number = document.createElement("span");
            button.type = "button";
            button.className = "choice-button";
            button.dataset.choice = choice;
            button.append(document.createTextNode(choice));
            number.className = "choice-number";
            number.setAttribute("aria-hidden", "true");
            number.textContent = String(index + 1);
            button.append(number);
            button.addEventListener("click", () => selectAnswer(choice, button));
            elements.choiceList.append(button);
        });

        elements.choiceList.querySelector("button")?.focus({ preventScroll: true });
    }

    function selectAnswer(selectedChoice, selectedButton) {
        if (state.answered) return;
        const question = state.questions[state.currentIndex];
        const isCorrect = selectedChoice === question.answer;
        const buttons = [...elements.choiceList.querySelectorAll("button")];

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
        elements.feedbackTitle.textContent = "정답이에요!";
        elements.feedback.classList.remove("is-wrong");
        elements.correctAnswer.textContent = `정답: ${question.answer}`;
        elements.explanation.textContent = question.explanation || "";
        renderMath(elements.explanation);
        elements.feedback.classList.remove("hidden");
        elements.announcer.textContent = `정답이에요. 정답은 ${question.answer}입니다. ${question.explanation || ""}`;
        elements.nextButton.focus({ preventScroll: true });
    }

    function goToNextQuestion() {
        if (!state.answered) return;
        if (state.currentIndex >= total() - 1) {
            showResults();
            return;
        }
        state.currentIndex += 1;
        renderQuestion();
    }

    function getResultMessage(score, count) {
        const name = getPlayerName();
        const subject = name ? `${name} 님, ` : "";
        const ratio = count > 0 ? score / count : 0;
        if (score === count) return `${subject}완벽해요!`;
        if (ratio >= 0.8) return `${subject}훌륭해요! 거의 다 알고 있어요.`;
        if (ratio >= 0.6) return `${subject}좋아요! 헷갈린 것만 다시 살펴봐요.`;
        return `${subject}괜찮아요. 오답노트를 읽고 다음에 다시 도전해 봐요.`;
    }

    function appendReviewItem(record) {
        const item = document.createElement("li");
        const sentence = document.createElement("span");
        const chosen = document.createElement("span");
        const answer = document.createElement("span");
        const explanation = document.createElement("span");
        sentence.className = "review-sentence";
        sentence.textContent = record.question.sentence.includes("___")
            ? record.question.sentence.replace("___", record.question.answer)
            : record.question.sentence;
        chosen.className = "review-chosen";
        chosen.textContent = `내가 고른 답: ${record.selectedChoice}`;
        answer.className = "review-answer";
        answer.textContent = `정답: ${record.question.answer}`;
        explanation.className = "review-explanation";
        explanation.textContent = record.question.explanation || "";
        item.append(sentence, chosen, answer, explanation);
        elements.missedList.append(item);
        renderMath(sentence);
        renderMath(explanation);
    }

    function showResults() {
        const missed = state.answers.filter((answer) => !answer.isCorrect);
        elements.finalScore.textContent = String(state.score);
        elements.finalTotal.textContent = String(total());
        elements.resultMessage.textContent = getResultMessage(state.score, total());
        elements.missedList.replaceChildren();
        missed.forEach(appendReviewItem);
        elements.perfectReview.classList.toggle("hidden", missed.length !== 0);
        elements.missedList.classList.toggle("hidden", missed.length === 0);

        if (!state.resultSubmitted && lobby) {
            state.resultSubmitted = true;
            lobby.sendServer({ type: "QUIZRACE_ACTION", action: "SUBMIT", sessionId: state.sessionId, score: state.score });
        }
        renderClassRanking(state.race, lobby?.snapshot().myId);
        setScreen(elements.resultScreen);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function formatElapsed(milliseconds) {
        const totalTenths = Math.max(0, Math.round(Number(milliseconds || 0) / 100));
        const minutes = Math.floor(totalTenths / 600);
        const seconds = ((totalTenths % 600) / 10).toFixed(1);
        return minutes > 0 ? `${minutes}분 ${seconds.padStart(4, "0")}초` : `${seconds}초`;
    }

    function renderClassRanking(race, myId) {
        if (!race) return;
        const rankings = Array.isArray(race.rankings) ? race.rankings : [];
        const participants = Array.isArray(race.participants) ? race.participants : [];
        const count = Number(race.questionCount) || total();
        const mine = rankings.find((entry) => String(entry.id) === String(myId));

        elements.myRankCard.textContent = mine
            ? `나의 순위 ${mine.rank}위 · ${mine.score}/${count}점 · ${formatElapsed(mine.elapsedMs)}`
            : state.resultSubmitted ? "결과를 집계하고 있어요." : "문제를 모두 풀면 내 순위가 표시됩니다.";
        elements.classRankingList.replaceChildren();

        rankings.forEach((entry) => {
            const row = document.createElement("li");
            const rank = document.createElement("span");
            const name = document.createElement("span");
            const score = document.createElement("span");
            const time = document.createElement("span");
            row.className = "ranking-row";
            row.classList.toggle("is-me", String(entry.id) === String(myId));
            rank.className = "rank-number";
            rank.textContent = `${entry.rank}위`;
            name.className = "rank-name";
            name.textContent = entry.name;
            score.className = "rank-score";
            score.textContent = `${entry.score}점`;
            time.className = "rank-time";
            time.textContent = formatElapsed(entry.elapsedMs);
            row.append(rank, name, score, time);
            elements.classRankingList.append(row);
        });

        const waitingCount = Math.max(0, participants.length - rankings.length);
        elements.rankingWaiting.textContent = race.phase === "ended"
            ? `최종 순위 · ${participants.length}명 모두 완료`
            : waitingCount > 0
                ? `${rankings.length}명 완료 · ${waitingCount}명 풀이 중`
                : "첫 번째 완료자를 기다리고 있어요.";
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

    async function revealCreateForTeacher() {
        if (!elements.createRaceLink) return;
        try {
            const response = await fetch("/api/auth/me", { credentials: "same-origin" });
            if (!response.ok) return;
            const session = await response.json();
            const canCreate = session?.isTeacher === true || session?.user?.role === "admin";
            elements.createRaceLink.classList.toggle("hidden", !canCreate);
        } catch (_) {
            // 서버가 답하지 않으면 단추를 숨긴 채로 둔다.
        }
    }

    function initialize() {
        if (!hasValidPlayerName()) {
            setScreen(elements.missingScreen);
            return;
        }
        setScreen(elements.lobbyScreen);
        if (!window.ClassroomMultiplayerLobby || !window.ClassroomNetwork) {
            elements.joinStatus.textContent = "학급 서버를 불러오지 못했습니다. 잠시 후 다시 시도하세요.";
            return;
        }
        lobby = window.ClassroomMultiplayerLobby.create({
            gameId: GAME_ID,
            getPlayerName,
            initialMode: "guest",
            minPlayers: 2,
            maxPlayers: 61,
            ids: { startButton: "studentStartButtonUnused" },
            leaveButtonIds: ["leaveClassButton"],
            onLeave: () => { location.href = "/"; },
            onStateChange: syncLobby,
            onServerMessage: handleServerMessage,
            onAbort: ({ message }) => {
                elements.joinStatus.textContent = message || "학급 연결이 종료되었습니다.";
                elements.announcer.textContent = elements.joinStatus.textContent;
                setScreen(elements.lobbyScreen);
            },
            getLobbyPresentation: ({ count }) => ({
                canStart: false,
                startText: "교사 시작 대기",
                guideText: `현재 ${Math.max(1, count)}명 접속 · 선생님이 시작하면 동시에 문제가 열립니다.`
            })
        }).mount();
        // 공용 대기실 스크립트가 참가 안내를 비우므로 여기서 다시 채운다.
        elements.joinStatus.textContent = "선생님이 알려 준 네 자리 학급 코드를 넣으세요.";
        revealCreateForTeacher();
        const requestedRoom = new URLSearchParams(location.search).get("room")?.replace(/\D/g, "").slice(0, 4);
        if (requestedRoom?.length === 4 && elements.joinCode && elements.joinButton) {
            elements.joinCode.value = requestedRoom;
            setTimeout(() => elements.joinButton.click(), 0);
        }
    }

    elements.nextButton.addEventListener("click", goToNextQuestion);
    document.addEventListener("keydown", handleKeyboard);

    // 공용 뒤로가기 단추(assets/site-back-navigation.js)가 눌리면 먼저 물어본다.
    // 문제를 푸는 중이거나 결과 화면이면 사이트 밖으로 나가지 않고 방금 상태로 새로고침해
    // 참가 화면으로 돌아간다. 참가를 기다리는 중이라면 그냥 메인으로 나간다.
    window.addEventListener("sitebackrequest", (event) => {
        const inQuiz = !elements.quizScreen.classList.contains("hidden") || !elements.resultScreen.classList.contains("hidden");
        if (!inQuiz) return;
        event.preventDefault();
        location.reload();
    });

    // 화면 왼쪽 위 화살표는 공용 뒤로가기 단추가 안 떠도 항상 같은 규칙으로 움직인다.
    elements.backLink?.addEventListener("click", (event) => {
        const inQuiz = !elements.quizScreen.classList.contains("hidden") || !elements.resultScreen.classList.contains("hidden");
        if (!inQuiz) return;
        event.preventDefault();
        location.reload();
    });

    initialize();
})();
