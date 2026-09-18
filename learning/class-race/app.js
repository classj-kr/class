(() => {
    "use strict";

    const GAME_ID = "quizrace";
    const PLAYER_NAME_KEY = "classPlayerName";
    // 답을 보냈는데 이만큼 기다려도 서버가 말이 없으면 다시 누를 수 있게 풀어 준다.
    const ANSWER_WAIT_MS = 6000;

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
        myAvatar: document.getElementById("myAvatar"),
        myName: document.getElementById("myName"),
        myTeamBadge: document.getElementById("myTeamBadge"),
        myTeamBox: document.getElementById("myTeamBox"),
        classmateList: document.getElementById("classmateList"),
        quizAvatar: document.getElementById("quizAvatar"),
        quizModeLabel: document.getElementById("quizModeLabel"),
        questionNumber: document.getElementById("questionNumber"),
        questionTotal: document.getElementById("questionTotal"),
        liveRank: document.getElementById("liveRank"),
        scoreBox: document.getElementById("scoreBox"),
        currentScore: document.getElementById("currentScore"),
        progressFill: document.getElementById("progressFill"),
        questionCategory: document.getElementById("questionCategory"),
        questionPrompt: document.getElementById("questionPrompt"),
        questionText: document.getElementById("questionText"),
        choiceList: document.getElementById("choiceList"),
        feedback: document.getElementById("feedback"),
        streakBadge: document.getElementById("streakBadge"),
        feedbackTitle: document.getElementById("feedbackTitle"),
        correctAnswer: document.getElementById("correctAnswer"),
        explanation: document.getElementById("explanation"),
        nextButton: document.getElementById("nextButton"),
        finalScore: document.getElementById("finalScore"),
        finalTotal: document.getElementById("finalTotal"),
        resultMessage: document.getElementById("resultMessage"),
        rankRule: document.getElementById("rankRule"),
        myRankCard: document.getElementById("myRankCard"),
        teamRankCard: document.getElementById("teamRankCard"),
        classRankingList: document.getElementById("classRankingList"),
        rankingWaiting: document.getElementById("rankingWaiting"),
        perfectReview: document.getElementById("perfectReview"),
        missedList: document.getElementById("missedList"),
        announcer: document.getElementById("announcer")
    };

    const screens = [elements.missingScreen, elements.lobbyScreen, elements.quizScreen, elements.resultScreen];

    // 정답과 해설은 서버가 들고 있다. 학생 화면은 보기를 보내고, 맞혔을 때 돌아온 정답만 보여 준다.
    const state = {
        questions: [],
        currentIndex: 0,
        score: 0,
        answered: false,
        pending: false,
        pendingButton: null,
        pendingTimer: 0,
        review: [],
        sessionId: "",
        finished: false,
        race: null,
        avatarKey: "",
        avatarSentFor: ""
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

    function isShown(screen) {
        return !screen.classList.contains("hidden");
    }

    function total() {
        return state.questions.length;
    }

    function myId() {
        return String(lobby?.snapshot().myId ?? "");
    }

    function me() {
        return state.race?.participants?.find((entry) => String(entry.id) === myId()) || null;
    }

    function myTeam() {
        const mine = me();
        return mine?.teamId ? state.race.teams.find((team) => team.id === mine.teamId) || null : null;
    }

    function avatarUrl(key) {
        return window.ClassroomMultiplayerLobby?.avatarUrl?.(key) || "";
    }

    // 아바타가 없는 학생(로그인하지 않은 경우)은 이름 끝 두 글자를 동그라미에 담아 보여 준다.
    function paintAvatar(box, key, name) {
        if (!box) return;
        const url = avatarUrl(key);
        if (box.dataset.key === (url || `name:${name}`)) return;
        box.dataset.key = url || `name:${name}`;
        box.replaceChildren();
        box.classList.toggle("is-initial", !url);
        if (url) {
            const image = document.createElement("img");
            image.src = url;
            image.alt = "";
            image.decoding = "async";
            box.append(image);
        } else {
            box.textContent = String(name || "").slice(-2);
        }
    }

    // ── 대기실 ─────────────────────────────────────────
    function syncLobby(snapshot) {
        if (!snapshot) return;
        const connected = snapshot.connected && snapshot.roomCode;
        elements.joinPane.classList.toggle("hidden", Boolean(connected));
        elements.waitingPane.classList.toggle("hidden", !connected);
        // 코드를 넣는 자리는 좁은 카드, 대기실은 이름이 늘어서니 넓은 카드.
        elements.lobbyScreen.classList.toggle("is-compact", !connected);
        if (connected) {
            elements.studentRoomCode.textContent = snapshot.roomCode;
            renderWaiting();
        }
    }

    function renderWaiting() {
        const race = state.race;
        const mine = me();
        const name = mine?.name || getPlayerName();
        elements.myName.textContent = name;
        paintAvatar(elements.myAvatar, mine?.avatarKey || state.avatarKey, name);
        paintAvatar(elements.quizAvatar, mine?.avatarKey || state.avatarKey, name);
        if (!race || !isShown(elements.lobbyScreen)) return;

        const team = myTeam();
        const teamMode = race.mode === "team" && team;
        elements.myTeamBadge.classList.toggle("hidden", !teamMode);
        elements.myTeamBox.classList.toggle("hidden", !teamMode);
        if (teamMode) {
            elements.myTeamBadge.textContent = team.name;
            elements.myTeamBadge.style.setProperty("--team", team.color);
            elements.myTeamBox.style.setProperty("--team", team.color);
            const mates = race.participants.filter((entry) => entry.teamId === team.id && String(entry.id) !== myId());
            elements.myTeamBox.replaceChildren(...mates.map((mate) => {
                const item = document.createElement("span");
                const face = document.createElement("span");
                const label = document.createElement("span");
                item.className = "my-team-mate";
                face.className = "race-avatar is-medium";
                paintAvatar(face, mate.avatarKey, mate.name);
                label.textContent = mate.name;
                item.append(face, label);
                return item;
            }));
            if (!mates.length) elements.myTeamBox.textContent = "모둠 친구를 기다리고 있어요.";
        }

        // 반 친구들은 이름만 보여 준다. 크롬북 서른 대가 아바타 그림을 서른 장씩 받지 않게.
        const teamColor = (entry) => race.teams.find((item) => item.id === entry.teamId)?.color || "";
        elements.classmateList.replaceChildren(...race.participants.map((entry) => {
            const chip = document.createElement("span");
            chip.className = "mp-lobby-player";
            chip.classList.toggle("me", String(entry.id) === myId());
            if (race.mode === "team" && teamColor(entry)) {
                chip.classList.add("has-team");
                chip.style.setProperty("--team", teamColor(entry));
            }
            chip.textContent = String(entry.id) === myId() ? `${entry.name} (나)` : entry.name;
            return chip;
        }));
        elements.lobbyGuide.textContent = race.mode === "team"
            ? `현재 ${race.participants.length}명 · 모둠전 · 선생님이 시작하면 모두 함께 문제가 열려요.`
            : `현재 ${race.participants.length}명 · 개인전 · 선생님이 시작하면 모두 함께 문제가 열려요.`;
    }

    // 학생마다 정해 둔 아바타를 경기장에 올린다. 서버는 있는 그림인지 확인하고 받는다.
    function loadMyAvatar() {
        fetch("/api/student/profile", { credentials: "same-origin" })
            .then((response) => (response.ok ? response.json() : null))
            .then((data) => {
                state.avatarKey = String(data?.profile?.avatar?.key || "");
                sendAvatar();
                renderWaiting();
            })
            .catch(() => {});
    }

    function sendAvatar() {
        const id = myId();
        const mine = me();
        if (!lobby || !id || !mine || !state.avatarKey) return;
        if (mine.avatarKey === state.avatarKey || state.avatarSentFor === id) return;
        state.avatarSentFor = id;
        lobby.sendServer({ type: "QUIZRACE_ACTION", action: "AVATAR", avatarKey: state.avatarKey });
    }

    // ── 서버 메시지 ─────────────────────────────────────
    function handleServerMessage(message) {
        if (message.type === "QUIZRACE_ERROR") {
            const text = message.message || "학급 순위전 요청을 처리하지 못했습니다.";
            if (state.pending) {
                clearPending();
                showWrongFeedback(text, "");
            } else {
                elements.joinStatus.textContent = text;
            }
            elements.announcer.textContent = text;
            return;
        }
        if (message.type === "QUIZRACE_QUESTIONS") {
            startQuiz(message);
            return;
        }
        if (message.type === "QUIZRACE_ANSWER") {
            handleAnswer(message);
            return;
        }
        if (message.type === "QUIZRACE_REVIEW") {
            if (message.sessionId !== state.sessionId) return;
            takeReview(message.review);
            if (isShown(elements.resultScreen)) renderReview();
            return;
        }
        if (message.type !== "QUIZRACE_STATE" || !message.state) return;

        state.race = message.state;
        sendAvatar();
        renderWaiting();

        const race = message.state;
        if (race.phase === "lobby") {
            if (state.sessionId) {
                state.sessionId = "";
                state.questions = [];
                clearPending();
                setScreen(elements.lobbyScreen);
                syncLobby(lobby.snapshot());
                elements.announcer.textContent = "새 학급 순위전을 기다립니다.";
            }
            return;
        }
        if (race.sessionId !== state.sessionId) return;
        if (race.phase === "ended" && isShown(elements.quizScreen)) {
            // 선생님이 경기를 끝냈다. 푼 데까지로 결과를 보여 준다.
            showResults(true);
            return;
        }
        if (isShown(elements.quizScreen)) {
            updateModeLabel();
            renderLiveRank();
        }
        if (isShown(elements.resultScreen)) renderClassRanking();
    }

    function startQuiz(payload) {
        const questions = Array.isArray(payload.questions) ? payload.questions : [];
        if (!questions.length) {
            elements.joinStatus.textContent = "문항을 받지 못했어요.";
            return;
        }
        const newSession = payload.sessionId !== state.sessionId;
        const resumeIndex = Math.max(0, Math.min(Number(payload.resumeIndex) || 0, questions.length));
        // 잠깐 끊겼다 이어진 경우: 보던 문제를 그대로 두면 된다.
        if (!newSession && isShown(elements.quizScreen) && resumeIndex === state.currentIndex) {
            clearPending();
            return;
        }
        state.sessionId = payload.sessionId;
        takeReview(payload.review);
        state.questions = questions;
        state.currentIndex = resumeIndex;
        state.score = Number(payload.score) || 0;
        state.finished = resumeIndex >= questions.length;
        clearPending();
        elements.currentScore.textContent = String(state.score);
        elements.questionTotal.textContent = String(total());
        updateModeLabel();
        // 경기가 끝난 뒤에 다시 들어온 학생에게는 결과를 바로 보여 준다.
        const ended = state.race?.phase === "ended" && state.race.sessionId === payload.sessionId;
        if (state.finished || ended) {
            showResults(ended && !state.finished);
            return;
        }
        setScreen(elements.quizScreen);
        renderQuestion();
        renderLiveRank();
        if (newSession && resumeIndex === 0) flashStart();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // 문제는 상태 알림보다 먼저 온다. 앱 이름은 상태가 오면 다시 채운다.
    function updateModeLabel() {
        const race = state.race?.sessionId === state.sessionId ? state.race : null;
        elements.quizModeLabel.textContent = [race?.appTitle, race?.rangeTitle].filter(Boolean).join(" · ") || "학급 순위전";
    }

    function flashStart() {
        const flash = document.createElement("div");
        flash.className = "start-flash";
        flash.textContent = "출발!";
        flash.setAttribute("aria-hidden", "true");
        document.body.append(flash);
        flash.addEventListener("animationend", () => flash.remove());
        elements.announcer.textContent = "출발! 첫 문제입니다.";
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
        elements.streakBadge.classList.add("hidden");
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
        renderMath(elements.choiceList);

        elements.choiceList.querySelector("button")?.focus({ preventScroll: true });
    }

    function choiceButtons() {
        return [...elements.choiceList.querySelectorAll("button")];
    }

    // 틀린 보기는 계속 잠가 두고, 나머지만 다시 누를 수 있게 한다.
    function unlockChoices() {
        choiceButtons().forEach((button) => {
            button.classList.remove("is-pending");
            button.disabled = button.classList.contains("is-wrong");
        });
    }

    function clearPending() {
        clearTimeout(state.pendingTimer);
        state.pending = false;
        state.pendingButton = null;
        if (!state.answered) unlockChoices();
    }

    function selectAnswer(selectedChoice, selectedButton) {
        if (state.answered || state.pending || !lobby) return;
        state.pending = true;
        state.pendingButton = selectedButton;
        choiceButtons().forEach((button) => { button.disabled = true; });
        selectedButton.classList.add("is-pending");
        lobby.sendServer({
            type: "QUIZRACE_ACTION",
            action: "ANSWER",
            sessionId: state.sessionId,
            index: state.currentIndex,
            choice: selectedChoice
        });
        state.pendingTimer = setTimeout(() => {
            if (!state.pending) return;
            clearPending();
            showWrongFeedback("답이 서버에 닿지 않았어요.", "연결을 확인하고 다시 골라 보세요.");
        }, ANSWER_WAIT_MS);
    }

    function showWrongFeedback(title, detail) {
        elements.feedbackTitle.textContent = title;
        elements.explanation.textContent = detail;
        elements.correctAnswer.textContent = "";
        elements.streakBadge.classList.add("hidden");
        elements.nextButton.classList.add("hidden");
        elements.feedback.classList.add("is-wrong");
        elements.feedback.classList.remove("hidden");
    }

    function replay(element, className) {
        element.classList.remove(className);
        void element.offsetWidth;
        element.classList.add(className);
    }

    function handleAnswer(reply) {
        if (reply.stale) {
            // 다른 창에서 이미 풀었거나 답이 엇갈렸다. 서버가 알려 준 자리로 맞춘다.
            clearPending();
            const index = Number(reply.currentIndex);
            if (Number.isInteger(index) && index !== state.currentIndex && total()) {
                state.currentIndex = Math.min(index, total());
                if (state.currentIndex >= total()) showResults(false);
                else renderQuestion();
            }
            return;
        }
        if (Number(reply.index) !== state.currentIndex || state.answered) return;
        const button = state.pendingButton;
        clearTimeout(state.pendingTimer);
        state.pending = false;
        state.pendingButton = null;

        if (!reply.correct) {
            if (button) {
                button.classList.add("is-wrong");
                replay(button, "shake");
            }
            unlockChoices();
            showWrongFeedback("다시 생각해 보세요.", "다른 답을 골라 보세요.");
            elements.announcer.textContent = "다시 생각하고 다른 답을 골라 보세요.";
            return;
        }

        state.answered = true;
        state.finished = Boolean(reply.finished);
        choiceButtons().forEach((choice) => {
            choice.classList.remove("is-pending");
            choice.disabled = true;
            if (choice.dataset.choice === reply.answer) choice.classList.add("is-correct");
        });
        if (reply.firstTry) {
            state.score = Number(reply.score) || state.score + 1;
            elements.currentScore.textContent = String(state.score);
            replay(elements.scoreBox, "pop");
        }
        if (reply.finished) takeReview(reply.review);
        const streak = Number(reply.streak) || 0;
        elements.streakBadge.classList.toggle("hidden", !(reply.firstTry && streak >= 3));
        if (reply.firstTry && streak >= 3) {
            elements.streakBadge.textContent = `${streak}연속 정답!`;
            replay(elements.streakBadge, "pop");
        }
        elements.feedbackTitle.textContent = reply.firstTry ? "정답이에요! 한 칸 앞으로!" : "맞았어요. 처음에 틀린 문제라 이번엔 칸이 늘지 않아요.";
        elements.feedback.classList.remove("is-wrong");
        elements.correctAnswer.textContent = `정답: ${reply.answer}`;
        elements.explanation.textContent = reply.explanation || "";
        renderMath(elements.correctAnswer);
        renderMath(elements.explanation);
        elements.nextButton.classList.remove("hidden");
        elements.nextButton.textContent = state.finished ? "결과 보기" : "다음 문제";
        elements.feedback.classList.remove("hidden");
        elements.announcer.textContent = `정답이에요. 정답은 ${reply.answer}입니다. ${reply.explanation || ""}`;
        elements.nextButton.focus({ preventScroll: true });
    }

    function goToNextQuestion() {
        if (!state.answered) return;
        if (state.finished || state.currentIndex >= total() - 1) {
            showResults(false);
            return;
        }
        state.currentIndex += 1;
        renderQuestion();
    }

    // 문제를 푸는 동안 지금 몇 등인지 알려 준다. 모둠전이면 우리 모둠 순위.
    function renderLiveRank() {
        const race = state.race;
        const mine = me();
        if (!race || !mine) {
            elements.liveRank.textContent = "";
            return;
        }
        if (race.mode === "team") {
            const team = race.teams.find((entry) => entry.id === mine.teamId);
            if (!team) { elements.liveRank.textContent = ""; return; }
            const ahead = race.teams.filter((entry) => entry.score > team.score).length;
            elements.liveRank.textContent = `${team.name} ${ahead + 1}위`;
            elements.liveRank.style.setProperty("--team", team.color);
            elements.liveRank.classList.add("is-team");
            return;
        }
        const ahead = race.participants.filter((entry) => entry.score > mine.score).length;
        elements.liveRank.textContent = `지금 ${ahead + 1}위 / ${race.participants.length}명`;
        elements.liveRank.classList.remove("is-team");
    }

    // ── 결과 ───────────────────────────────────────────
    function getResultMessage(score, count, stoppedEarly) {
        const name = getPlayerName();
        const subject = name ? `${name} 님, ` : "";
        if (stoppedEarly) return `${subject}선생님이 경기를 마쳤어요. 푼 데까지 점수로 순위를 냈어요.`;
        const ratio = count > 0 ? score / count : 0;
        if (score === count) return `${subject}완벽해요!`;
        if (ratio >= 0.8) return `${subject}훌륭해요! 거의 다 알고 있어요.`;
        if (ratio >= 0.6) return `${subject}좋아요! 헷갈린 것만 다시 살펴봐요.`;
        return `${subject}괜찮아요. 오답노트를 읽고 다음에 다시 도전해 봐요.`;
    }

    // 오답노트는 서버가 준다. 새로고침해도 처음에 틀린 문제가 남는다.
    function takeReview(rows) {
        if (!Array.isArray(rows)) return;
        state.review = rows.map((row) => ({
            sentence: String(row.sentence || ""),
            chosen: String(row.chosen || ""),
            answer: String(row.answer || ""),
            explanation: String(row.explanation || "")
        }));
    }

    function renderReview() {
        elements.missedList.replaceChildren();
        state.review.forEach(appendReviewItem);
        elements.perfectReview.classList.toggle("hidden", state.review.length !== 0);
        elements.missedList.classList.toggle("hidden", state.review.length === 0);
    }

    function appendReviewItem(record) {
        const item = document.createElement("li");
        const sentence = document.createElement("span");
        const chosen = document.createElement("span");
        const answer = document.createElement("span");
        const explanation = document.createElement("span");
        sentence.className = "review-sentence";
        sentence.textContent = record.sentence.includes("___")
            ? record.sentence.replace("___", record.answer)
            : record.sentence;
        chosen.className = "review-chosen";
        chosen.textContent = `내가 처음 고른 답: ${record.chosen}`;
        answer.className = "review-answer";
        answer.textContent = `정답: ${record.answer}`;
        explanation.className = "review-explanation";
        explanation.textContent = record.explanation;
        item.append(sentence, chosen, answer, explanation);
        elements.missedList.append(item);
        renderMath(item);
    }

    function showResults(stoppedEarly) {
        clearPending();
        elements.finalScore.textContent = String(state.score);
        elements.finalTotal.textContent = String(total());
        elements.resultMessage.textContent = getResultMessage(state.score, total(), stoppedEarly);
        elements.rankRule.textContent = state.race?.mode === "team"
            ? "처음에 맞힌 문제만 점수가 돼요. 모둠 점수는 모둠 친구들 점수의 평균이에요."
            : "처음에 맞힌 문제만 점수가 돼요. 점수가 같으면 먼저 마친 학생이 앞서요.";
        renderReview();
        renderClassRanking();
        setScreen(elements.resultScreen);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function formatElapsed(milliseconds) {
        const totalTenths = Math.max(0, Math.round(Number(milliseconds || 0) / 100));
        const minutes = Math.floor(totalTenths / 600);
        const seconds = ((totalTenths % 600) / 10).toFixed(1);
        return minutes > 0 ? `${minutes}분 ${seconds.padStart(4, "0")}초` : `${seconds}초`;
    }

    function renderClassRanking() {
        const race = state.race;
        if (!race) return;
        const rankings = Array.isArray(race.rankings) ? race.rankings : [];
        const participants = Array.isArray(race.participants) ? race.participants : [];
        const count = Number(race.questionCount) || total();
        const mine = rankings.find((entry) => String(entry.id) === myId());

        elements.myRankCard.textContent = mine
            ? `나의 순위 ${mine.rank}위 · ${mine.score}/${count}점 · ${mine.finished ? formatElapsed(mine.elapsedMs) : "다 못 풂"}`
            : "친구들이 다 풀면 내 순위가 나와요.";

        const team = myTeam();
        const teamEntry = team ? (race.teamRankings || []).find((entry) => entry.id === team.id) : null;
        elements.teamRankCard.classList.toggle("hidden", race.mode !== "team" || !team);
        if (race.mode === "team" && team) {
            elements.teamRankCard.style.setProperty("--team", team.color);
            elements.teamRankCard.textContent = teamEntry
                ? `${team.name} ${teamEntry.rank}위 · 평균 ${teamEntry.score}점`
                : `${team.name} · 모둠 친구들이 다 풀면 모둠 순위가 나와요.`;
        }

        elements.classRankingList.replaceChildren(...rankings.map((entry) => {
            const row = document.createElement("li");
            const rank = document.createElement("span");
            const name = document.createElement("span");
            const score = document.createElement("span");
            const time = document.createElement("span");
            row.className = "ranking-row";
            row.classList.toggle("is-me", String(entry.id) === myId());
            const teamColor = race.teams.find((item) => item.id === entry.teamId)?.color;
            if (race.mode === "team" && teamColor) {
                row.classList.add("has-team");
                row.style.setProperty("--team", teamColor);
            }
            rank.className = "rank-number";
            rank.textContent = `${entry.rank}위`;
            name.className = "rank-name";
            name.textContent = entry.name;
            score.className = "rank-score";
            score.textContent = `${entry.score}점`;
            time.className = "rank-time";
            time.textContent = entry.finished ? formatElapsed(entry.elapsedMs) : "다 못 풂";
            row.append(rank, name, score, time);
            return row;
        }));

        const waitingCount = Math.max(0, participants.length - rankings.length);
        elements.rankingWaiting.textContent = race.phase === "ended"
            ? "최종 순위"
            : waitingCount > 0
                ? `${rankings.length}명 완료 · ${waitingCount}명 풀이 중`
                : "첫 번째 완료자를 기다리고 있어요.";
    }

    function handleKeyboard(event) {
        if (!isShown(elements.quizScreen)) return;
        if (!state.answered && /^[1-4]$/.test(event.key)) {
            const choice = choiceButtons()[Number(event.key) - 1];
            if (choice && !choice.disabled) {
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
            ids: { startButton: "studentStartButtonUnused", playerList: "studentLobbyChipsUnused" },
            leaveButtonIds: ["leaveClassButton"],
            onLeave: () => { location.href = "/"; },
            onStateChange: syncLobby,
            onServerMessage: handleServerMessage,
            onAbort: ({ message }) => {
                clearPending();
                elements.joinStatus.textContent = message || "학급 연결이 종료되었습니다.";
                elements.announcer.textContent = elements.joinStatus.textContent;
                setScreen(elements.lobbyScreen);
            },
            getLobbyPresentation: ({ count }) => ({
                canStart: false,
                startText: "교사 시작 대기",
                guideText: `현재 ${Math.max(1, count)}명 접속 · 선생님이 시작하면 모두 함께 문제가 열려요.`
            })
        }).mount();
        // 공용 대기실 스크립트가 참가 안내를 비우므로 여기서 다시 채운다.
        elements.joinStatus.textContent = "선생님이 알려 준 네 자리 학급 코드를 넣으세요.";
        revealCreateForTeacher();
        loadMyAvatar();
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
        const inQuiz = isShown(elements.quizScreen) || isShown(elements.resultScreen);
        if (!inQuiz) return;
        event.preventDefault();
        location.reload();
    });

    // 화면 왼쪽 위 화살표는 공용 뒤로가기 단추가 안 떠도 항상 같은 규칙으로 움직인다.
    elements.backLink?.addEventListener("click", (event) => {
        const inQuiz = isShown(elements.quizScreen) || isShown(elements.resultScreen);
        if (!inQuiz) return;
        event.preventDefault();
        location.reload();
    });

    initialize();
})();
