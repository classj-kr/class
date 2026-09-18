(() => {
    "use strict";

    const GAME_ID = "quizrace";
    const registry = window.ClassRaceApps;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

    const elements = {
        portalBackLink: document.querySelector('.back-link[href="/classtools/"]'),
        setupPanel: document.getElementById("setupPanel"),
        racePanel: document.getElementById("racePanel"),
        appGrid: document.getElementById("appGrid"),
        randomCount: document.getElementById("randomCount"),
        lessonSelect: document.getElementById("lessonSelect"),
        rangeSummary: document.getElementById("rangeSummary"),
        teamSize: document.getElementById("teamSize"),
        shuffleTeamsButton: document.getElementById("shuffleTeamsButton"),
        roomCode: document.getElementById("roomCode"),
        raceRoomCode: document.getElementById("raceRoomCode"),
        raceTitle: document.getElementById("raceTitle"),
        raceSubject: document.getElementById("raceSubject"),
        raceClock: document.getElementById("raceClock"),
        raceProgress: document.getElementById("raceProgress"),
        lobbyStudentCount: document.getElementById("lobbyStudentCount"),
        questionCountLabel: document.getElementById("questionCountLabel"),
        rankRuleLabel: document.getElementById("rankRuleLabel"),
        lobbyRoster: document.getElementById("lobbyRoster"),
        teacherStartButton: document.getElementById("teacherStartButton"),
        teacherNotice: document.getElementById("teacherNotice"),
        raceNotice: document.getElementById("raceNotice"),
        raceTrack: document.getElementById("raceTrack"),
        raceToasts: document.getElementById("raceToasts"),
        finishArea: document.getElementById("finishArea"),
        podium: document.getElementById("podium"),
        missedBoard: document.getElementById("missedBoard"),
        missedEmpty: document.getElementById("missedEmpty"),
        teamRankingList: document.getElementById("teamRankingList"),
        rankingList: document.getElementById("teacherRankingList"),
        endRaceButton: document.getElementById("endRaceButton"),
        resetRaceButton: document.getElementById("resetRaceButton")
    };

    const state = {
        appId: "",
        bank: null,
        loading: false,
        race: null,
        clockOffset: 0,
        seenIds: new Set(),
        // 앞 상태와 견주어 누가 방금 맞혔는지, 누가 도착했는지 가려낸다.
        previous: { sessionId: "", phase: "", players: new Map(), teams: new Map(), leader: "" },
        lanes: new Map(),
        runners: new Map(),
        trackKey: "",
        finishShownFor: "",
        lastLeadToast: 0
    };

    let lobby = null;

    // ── 준비 화면: 앱·범위 ────────────────────────────────
    function rangeMode() {
        return document.querySelector('input[name="rangeMode"]:checked')?.value || "random";
    }

    // 지금 고른 앱·범위로 실제로 낼 문제 묶음을 만든다. 서버에는 이 묶음이 통째로 간다.
    function buildBundle() {
        if (!state.bank) return null;
        const app = registry.get(state.appId);
        const allIds = [...state.bank.questions.keys()];
        let ids = [];
        let rangeTitle = "";
        if (rangeMode() === "lesson") {
            const lesson = state.bank.lessons.find((entry) => entry.id === elements.lessonSelect.value);
            if (!lesson) return null;
            ids = registry.shuffle(lesson.ids);
            rangeTitle = lesson.title;
        } else {
            const count = Number(elements.randomCount.value) || 10;
            ids = registry.shuffle(allIds).slice(0, count);
            rangeTitle = `전체 무작위 ${ids.length}문제`;
        }
        const questions = ids.map((id) => state.bank.questions.get(id)).filter(Boolean);
        return { appId: app.id, appTitle: app.title, rangeTitle, questions };
    }

    function updateRangeSummary() {
        const lessonMode = rangeMode() === "lesson";
        elements.lessonSelect.disabled = !lessonMode || !state.bank;
        elements.randomCount.disabled = lessonMode;
        if (!state.bank) {
            elements.rangeSummary.textContent = state.loading ? "문제를 불러오는 중입니다." : "앱을 고르면 문제 수가 여기에 나옵니다.";
            elements.questionCountLabel.textContent = "-";
            syncStartButton();
            return;
        }
        const app = registry.get(state.appId);
        const total = state.bank.questions.size;
        if (lessonMode) {
            const lesson = state.bank.lessons.find((entry) => entry.id === elements.lessonSelect.value);
            const count = lesson ? lesson.ids.length : 0;
            elements.rangeSummary.textContent = lesson
                ? `${app.title} · ${lesson.title} · ${count}문제 (${lesson.note})`
                : `${app.title} · 차시를 고르세요.`;
            elements.questionCountLabel.textContent = `${count}문제`;
        } else {
            const count = Math.min(Number(elements.randomCount.value) || 10, total);
            elements.rangeSummary.textContent = `${app.title} · 전체 ${total}문제 중 무작위 ${count}문제`;
            elements.questionCountLabel.textContent = `${count}문제`;
        }
        syncStartButton();
    }

    function renderLessonOptions() {
        elements.lessonSelect.replaceChildren();
        if (!state.bank || !state.bank.lessons.length) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "이 앱은 차시가 없어요";
            elements.lessonSelect.append(option);
            return;
        }
        state.bank.lessons.forEach((lesson, index) => {
            const option = document.createElement("option");
            option.value = lesson.id;
            option.textContent = `${index + 1}. ${lesson.title} (${lesson.ids.length}문제)`;
            elements.lessonSelect.append(option);
        });
    }

    function renderAppGrid() {
        elements.appGrid.replaceChildren(...registry.list().map((app) => {
            const button = document.createElement("button");
            const title = document.createElement("strong");
            button.type = "button";
            button.className = "app-card";
            button.dataset.appId = app.id;
            button.classList.toggle("is-selected", app.id === state.appId);
            button.setAttribute("aria-pressed", String(app.id === state.appId));
            title.textContent = app.title;
            button.append(title);
            button.addEventListener("click", () => selectApp(app.id));
            return button;
        }));
    }

    async function selectApp(appId) {
        if (state.loading) return;
        state.appId = appId;
        state.bank = null;
        state.loading = true;
        renderAppGrid();
        updateRangeSummary();
        try {
            state.bank = await registry.load(appId);
            elements.teacherNotice.textContent = "";
        } catch (error) {
            elements.teacherNotice.textContent = error.message || "문제를 불러오지 못했습니다.";
        } finally {
            state.loading = false;
        }
        renderLessonOptions();
        updateRangeSummary();
    }

    // ── 준비 화면: 경기 방식·대기실 ───────────────────────
    function selectedMode() {
        return document.querySelector('input[name="raceMode"]:checked')?.value === "team" ? "team" : "solo";
    }

    function sendMode() {
        if (!lobby) return;
        lobby.sendServer({ type: "QUIZRACE_ACTION", action: "MODE", mode: selectedMode(), teamSize: Number(elements.teamSize.value) || 4 });
    }

    function syncModeControls(race) {
        const mode = race?.mode === "team" ? "team" : "solo";
        const radio = document.querySelector(`input[name="raceMode"][value="${mode}"]`);
        if (radio) radio.checked = true;
        if (race?.teamSize) elements.teamSize.value = String(race.teamSize);
        elements.teamSize.disabled = mode !== "team";
        elements.shuffleTeamsButton.classList.toggle("hidden", mode !== "team");
        elements.rankRuleLabel.textContent = mode === "team" ? "모둠 평균" : "처음 맞힌 수";
    }

    function studentCountFromSnapshot(snapshot) {
        return Math.max(0, Object.keys(snapshot?.players || {}).length - 1);
    }

    function currentStudentCount() {
        return state.race?.phase === "lobby"
            ? state.race.participants.length
            : studentCountFromSnapshot(lobby?.snapshot());
    }

    function syncStartButton() {
        const count = currentStudentCount();
        const teamMode = state.race?.mode === "team";
        const needed = teamMode ? 2 : 1;
        const ready = Boolean(state.bank) && (rangeMode() !== "lesson" || Boolean(elements.lessonSelect.value));
        elements.teacherStartButton.disabled = count < needed || !ready || state.race?.phase === "running";
        elements.teacherStartButton.textContent = count < needed
            ? (teamMode ? "모둠전은 두 명부터" : "학생 참가 대기")
            : !state.bank
                ? "앱을 먼저 고르세요"
                : `${teamMode ? "모둠전" : "개인전"} 시작 · ${count}명`;
    }

    function syncLobby(snapshot) {
        elements.lobbyStudentCount.textContent = `${currentStudentCount()}명`;
        elements.raceRoomCode.textContent = snapshot?.roomCode || elements.roomCode.textContent || "----";
        syncStartButton();
    }

    function avatarUrl(key) {
        return window.ClassroomMultiplayerLobby?.avatarUrl?.(key) || "";
    }

    // 아바타가 없는 학생(로그인하지 않은 경우)은 이름 끝 두 글자를 동그라미에 담는다.
    function makeAvatar(participant, sizeClass) {
        const box = document.createElement("span");
        box.className = `race-avatar ${sizeClass || ""}`.trim();
        paintAvatar(box, participant);
        return box;
    }

    function paintAvatar(box, participant) {
        const url = avatarUrl(participant.avatarKey);
        const key = url || `name:${participant.name}`;
        if (box.dataset.key === key) return;
        box.dataset.key = key;
        box.replaceChildren();
        box.classList.toggle("is-initial", !url);
        if (url) {
            const image = document.createElement("img");
            image.src = url;
            image.alt = "";
            image.decoding = "async";
            box.append(image);
        } else {
            box.textContent = String(participant.name || "").slice(-2);
        }
    }

    function rosterCard(participant) {
        const card = document.createElement("div");
        const name = document.createElement("span");
        card.className = "roster-card";
        if (!state.seenIds.has(participant.id)) {
            card.classList.add("is-new");
            state.seenIds.add(participant.id);
        }
        name.className = "roster-name";
        name.textContent = participant.name;
        card.append(makeAvatar(participant, "is-standing"), name);
        return card;
    }

    function renderLobbyRoster(race) {
        const participants = race.participants || [];
        elements.lobbyRoster.classList.toggle("is-team", race.mode === "team");
        if (!participants.length) {
            elements.lobbyRoster.replaceChildren();
            return;
        }
        if (race.mode !== "team") {
            elements.lobbyRoster.replaceChildren(...participants.map(rosterCard));
            return;
        }
        elements.lobbyRoster.replaceChildren(...race.teams.map((team) => {
            const box = document.createElement("section");
            const head = document.createElement("h3");
            const members = document.createElement("div");
            box.className = "roster-team";
            box.style.setProperty("--team", team.color);
            head.textContent = `${team.name} · ${team.memberIds.length}명`;
            members.className = "roster-team-members";
            team.memberIds
                .map((id) => participants.find((entry) => entry.id === id))
                .filter(Boolean)
                .forEach((participant) => members.append(rosterCard(participant)));
            box.append(head, members);
            return box;
        }));
    }

    function startCompetition() {
        const bundle = buildBundle();
        if (!bundle || bundle.questions.length < 1) {
            elements.teacherNotice.textContent = "출제 문항을 만들지 못했습니다. 앱과 범위를 다시 고르세요.";
            return;
        }
        if (currentStudentCount() < 1) {
            elements.teacherNotice.textContent = "학생이 한 명 이상 참가해야 합니다.";
            return;
        }
        elements.teacherStartButton.disabled = true;
        elements.teacherStartButton.textContent = "시작하는 중...";
        elements.teacherNotice.textContent = "";
        lobby.sendServer({ type: "QUIZRACE_ACTION", action: "START", ...bundle });
    }

    function endCompetition() {
        if (!window.confirm("지금까지 푼 만큼으로 순위를 낼까요?")) return;
        lobby.sendServer({ type: "QUIZRACE_ACTION", action: "END" });
    }

    function resetCompetition() {
        const message = state.race?.phase === "running"
            ? "진행 중인 경기를 지우고 새 순위전을 준비할까요?"
            : "결과를 지우고 새 순위전을 준비할까요?";
        if (!window.confirm(message)) return;
        lobby.sendServer({ type: "QUIZRACE_ACTION", action: "RESET" });
    }

    // ── 경기장 ─────────────────────────────────────────
    function formatClock(milliseconds) {
        const seconds = Math.max(0, Math.floor(Number(milliseconds || 0) / 1000));
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    }

    function formatElapsed(milliseconds) {
        const totalTenths = Math.max(0, Math.round(Number(milliseconds || 0) / 100));
        const minutes = Math.floor(totalTenths / 600);
        const seconds = ((totalTenths % 600) / 10).toFixed(1);
        return minutes > 0 ? `${minutes}분 ${seconds.padStart(4, "0")}초` : `${seconds}초`;
    }

    // 모둠 평균은 소수 둘째 자리까지 온다. 3.50은 3.5로, 3.00은 3으로 줄여 보인다.
    function formatScore(value) {
        const number = Math.round((Number(value) || 0) * 100) / 100;
        return String(number);
    }

    function tickClock() {
        const race = state.race;
        if (!race || race.phase === "lobby" || !race.startedAt) return;
        const now = race.endedAt || Date.now() + state.clockOffset;
        elements.raceClock.textContent = formatClock(now - race.startedAt);
    }

    function replay(element, className) {
        if (!element || reduceMotion) return;
        element.classList.remove(className);
        void element.offsetWidth;
        element.classList.add(className);
    }

    function toast(text, tone) {
        const item = document.createElement("div");
        item.className = `race-toast ${tone || ""}`.trim();
        item.textContent = text;
        elements.raceToasts.prepend(item);
        while (elements.raceToasts.children.length > 2) elements.raceToasts.lastElementChild.remove();
        setTimeout(() => {
            item.classList.add("is-leaving");
            setTimeout(() => item.remove(), 450);
        }, 3200);
    }

    function flashStart() {
        if (reduceMotion) return;
        const flash = document.createElement("div");
        flash.className = "start-flash is-board";
        flash.textContent = "출발!";
        flash.setAttribute("aria-hidden", "true");
        elements.racePanel.append(flash);
        flash.addEventListener("animationend", () => flash.remove());
    }

    function crownSvg() {
        const span = document.createElement("span");
        span.className = "runner-crown";
        span.setAttribute("aria-hidden", "true");
        span.innerHTML = '<svg viewBox="0 0 24 16"><path d="M2 14 L1 3 L7 8 L12 1 L17 8 L23 3 L22 14 Z" fill="#f2c230" stroke="#8a5a0b" stroke-width="1.4" stroke-linejoin="round"/></svg>';
        return span;
    }

    function makeRunner(participant) {
        const runner = document.createElement("div");
        const fx = document.createElement("span");
        const body = document.createElement("span");
        const streak = document.createElement("span");
        runner.className = "runner";
        runner.dataset.id = participant.id;
        fx.className = "runner-fx";
        body.className = "runner-body";
        body.append(makeAvatar(participant, "is-runner"));
        streak.className = "runner-streak";
        runner.append(fx, body, crownSvg(), streak);
        return { runner, body, streak, avatar: body.firstChild };
    }

    function floatText(host, text, tone) {
        if (reduceMotion) return;
        const pop = document.createElement("span");
        pop.className = `runner-pop ${tone || ""}`.trim();
        pop.textContent = text;
        host.append(pop);
        pop.addEventListener("animationend", () => pop.remove());
    }

    function laneLayout(count, team) {
        const cols = team ? (count > 8 ? 2 : 1) : count > 20 ? 3 : count > 8 ? 2 : 1;
        return { cols, rows: Math.max(1, Math.ceil(count / cols)) };
    }

    function buildLane(key, team) {
        const lane = document.createElement("div");
        const label = document.createElement("div");
        const name = document.createElement("strong");
        const sub = document.createElement("span");
        const track = document.createElement("div");
        const rail = document.createElement("span");
        const finish = document.createElement("span");
        const score = document.createElement("div");
        lane.className = `lane${team ? " is-team" : ""}`;
        lane.dataset.key = key;
        label.className = "lane-label";
        name.className = "lane-name";
        sub.className = "lane-sub";
        label.append(name, sub);
        track.className = "lane-track";
        rail.className = "lane-rail";
        finish.className = "lane-finish";
        track.append(rail, finish);
        score.className = "lane-score";
        lane.append(label, track, score);
        return { lane, name, sub, track, score, pack: null, soloRunner: null };
    }

    // 레인 목록이 바뀌었을 때만 새로 짓는다. 그대로면 아바타가 제자리에서 미끄러지게 둔다.
    function ensureLanes(race) {
        const team = race.mode === "team";
        const keys = team ? race.teams.map((entry) => entry.id) : race.participants.map((entry) => entry.id);
        const trackKey = `${race.sessionId}|${race.mode}|${keys.join(",")}`;
        if (trackKey === state.trackKey) return;
        state.trackKey = trackKey;
        const keep = new Map();
        const nodes = keys.map((key) => {
            const lane = state.lanes.get(key) || buildLane(key, team);
            keep.set(key, lane);
            return lane.lane;
        });
        state.lanes = keep;
        const layout = laneLayout(keys.length, team);
        elements.raceTrack.className = `race-track ${team ? "is-team" : "is-solo"}`;
        elements.raceTrack.style.setProperty("--cols", String(layout.cols));
        elements.raceTrack.style.setProperty("--rows", String(layout.rows));
        elements.raceTrack.style.setProperty("--steps", String(Math.max(1, race.questionCount)));
        // 모둠 덩어리 너비를 가장 큰 모둠에 맞춰야 레인마다 결승선이 한 줄로 선다.
        const biggest = team ? Math.max(1, ...race.teams.map((entry) => entry.memberIds.length)) : 1;
        elements.raceTrack.style.setProperty("--members", String(biggest));
        elements.raceTrack.replaceChildren(...nodes);
    }

    function runnerFor(participant) {
        let entry = state.runners.get(participant.id);
        if (!entry) {
            entry = makeRunner(participant);
            state.runners.set(participant.id, entry);
        }
        paintAvatar(entry.avatar, participant);
        return entry;
    }

    function updateRunner(entry, participant, previous, leaderId) {
        const { runner, body, streak } = entry;
        runner.classList.toggle("on-fire", participant.streak >= 3);
        runner.classList.toggle("is-done", participant.status === "finished");
        runner.classList.toggle("is-left", participant.left && participant.status !== "finished");
        runner.classList.toggle("is-leader", participant.id === leaderId);
        streak.textContent = participant.streak >= 3 ? `${participant.streak}연속` : "";
        runner.title = participant.name;
        if (!previous || participant.lastSeq === previous.lastSeq) return;
        if (participant.lastResult === "correct") {
            replay(body, "hop");
            floatText(runner, "+1", "is-plus");
        } else if (participant.lastResult === "wrong") {
            replay(body, "stumble");
        } else if (participant.lastResult === "late") {
            replay(body, "nod");
        }
    }

    function uniqueLeader(entries) {
        const best = Math.max(0, ...entries.map((entry) => entry.score));
        if (best <= 0) return "";
        const leaders = entries.filter((entry) => entry.score === best);
        return leaders.length === 1 ? leaders[0].id : "";
    }

    function renderTrack(race) {
        ensureLanes(race);
        const steps = Math.max(1, race.questionCount);
        const previous = state.previous.sessionId === race.sessionId ? state.previous.players : new Map();
        const active = new Set();

        if (race.mode === "team") {
            const leaderTeam = uniqueLeader(race.teams);
            race.teams.forEach((team) => {
                const lane = state.lanes.get(team.id);
                if (!lane) return;
                const members = team.memberIds.map((id) => race.participants.find((entry) => entry.id === id)).filter(Boolean);
                lane.lane.style.setProperty("--team", team.color);
                lane.lane.classList.toggle("is-done", team.finished);
                lane.lane.classList.toggle("is-leader", team.id === leaderTeam);
                lane.name.textContent = team.name;
                lane.sub.textContent = members.map((entry) => entry.name).join(" · ");
                lane.score.textContent = formatScore(team.score);
                if (!lane.pack) {
                    // 모둠원은 한 덩어리로 함께 달린다. 덩어리의 자리는 모둠 평균 점수.
                    lane.pack = document.createElement("div");
                    lane.pack.className = "team-pack";
                    lane.packRunners = document.createElement("div");
                    lane.packRunners.className = "team-pack-runners";
                    const crown = crownSvg();
                    crown.classList.add("is-team");
                    lane.pack.append(crown, lane.packRunners);
                    lane.track.append(lane.pack);
                }
                lane.pack.style.setProperty("--pos", String(Math.min(1, team.score / steps)));
                const runners = members.map((participant) => {
                    active.add(participant.id);
                    const entry = runnerFor(participant);
                    updateRunner(entry, participant, previous.get(participant.id), "");
                    return entry.runner;
                });
                // 모둠원이 그대로면 다시 끼우지 않는다. 다시 끼우면 뛰던 몸짓이 끊긴다.
                const current = lane.packRunners.children;
                const same = runners.length === current.length && runners.every((node, index) => current[index] === node);
                if (!same) lane.packRunners.replaceChildren(...runners);
                lane.pack.classList.toggle("is-leader", team.id === leaderTeam);
            });
        } else {
            const leaderId = uniqueLeader(race.participants);
            race.participants.forEach((participant) => {
                const lane = state.lanes.get(participant.id);
                if (!lane) return;
                active.add(participant.id);
                const entry = runnerFor(participant);
                if (lane.soloRunner !== entry.runner) {
                    lane.soloRunner = entry.runner;
                    lane.track.append(entry.runner);
                }
                entry.runner.style.setProperty("--pos", String(Math.min(1, participant.score / steps)));
                updateRunner(entry, participant, previous.get(participant.id), leaderId);
                const color = race.teams.find((team) => team.id === participant.teamId)?.color;
                if (color) lane.lane.style.setProperty("--team", color);
                lane.lane.classList.toggle("is-done", participant.status === "finished");
                lane.lane.classList.toggle("is-left", participant.left && participant.status !== "finished");
                lane.name.textContent = participant.name;
                lane.sub.textContent = participant.status === "finished"
                    ? "도착"
                    : participant.left ? "연결 끊김" : `${participant.answered}/${steps} 풂`;
                lane.score.textContent = String(participant.score);
            });
        }
        for (const id of [...state.runners.keys()]) {
            if (!active.has(id)) {
                state.runners.get(id).runner.remove();
                state.runners.delete(id);
            }
        }
    }

    // 선두는 자주 바뀐다. 6초에 한 번만 알린다.
    function leadToast(text) {
        const now = Date.now();
        if (now - state.lastLeadToast < 6000) return;
        state.lastLeadToast = now;
        toast(text, "is-lead");
    }

    // 앞 상태와 견주어 전광판에 짧은 알림을 띄운다.
    function announceChanges(race) {
        const previous = state.previous;
        if (previous.sessionId !== race.sessionId || race.phase !== "running") return;
        let finishedCount = race.participants.filter((entry) => entry.status === "finished").length;
        race.participants.forEach((participant) => {
            const before = previous.players.get(participant.id);
            if (!before) return;
            if (participant.status === "finished" && before.status !== "finished" && finishedCount <= 3) {
                toast(finishedCount === 1 ? `${participant.name} 가장 먼저 도착!` : `${participant.name} 도착! (${finishedCount}번째)`, "is-finish");
            }
            if (participant.streak > before.streak && [3, 5, 10].includes(participant.streak)) {
                toast(`${participant.name} ${participant.streak}연속 정답!`, "is-fire");
            }
        });
        if (race.mode === "team") {
            race.teams.forEach((team) => {
                const before = previous.teams.get(team.id);
                if (before && team.finished && !before.finished) toast(`${team.name} 모두 도착!`, "is-finish");
            });
            const leader = uniqueLeader(race.teams);
            if (leader && leader !== previous.leader) {
                const team = race.teams.find((entry) => entry.id === leader);
                if (team && team.score >= 1) leadToast(`${team.name} 선두!`);
            }
        } else {
            const leader = uniqueLeader(race.participants);
            if (leader && leader !== previous.leader) {
                const player = race.participants.find((entry) => entry.id === leader);
                if (player && player.score >= 2) leadToast(`${player.name} 선두!`);
            }
        }
    }

    function rememberState(race) {
        state.previous = {
            sessionId: race.sessionId,
            phase: race.phase,
            players: new Map(race.participants.map((entry) => [entry.id, { score: entry.score, lastSeq: entry.lastSeq, streak: entry.streak, status: entry.status }])),
            teams: new Map(race.teams.map((team) => [team.id, { score: team.score, finished: team.finished }])),
            leader: race.mode === "team" ? uniqueLeader(race.teams) : uniqueLeader(race.participants)
        };
    }

    // ── 끝난 뒤: 시상대·많이 틀린 문제·순위 ───────────────
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

    function renderPodium(race) {
        const team = race.mode === "team";
        const top = (team ? race.teamRankings : race.rankings).slice(0, 3);
        const order = [top[1], top[0], top[2]];
        const places = [2, 1, 3];
        elements.podium.replaceChildren(...order.map((entry, slot) => {
            const column = document.createElement("div");
            column.className = `podium-place place-${places[slot]}`;
            if (!entry) {
                column.classList.add("is-empty");
                return column;
            }
            const stage = document.createElement("div");
            const who = document.createElement("div");
            const name = document.createElement("strong");
            const score = document.createElement("span");
            const block = document.createElement("div");
            who.className = "podium-who";
            if (team) {
                column.style.setProperty("--team", entry.color);
                const faces = document.createElement("div");
                faces.className = "podium-team-faces";
                entry.memberIds
                    .map((id) => race.participants.find((participant) => participant.id === id))
                    .filter(Boolean)
                    .forEach((participant) => faces.append(makeAvatar(participant, "is-podium-mini")));
                who.append(faces);
                name.textContent = entry.name;
                score.textContent = `평균 ${formatScore(entry.score)}점`;
            } else {
                who.append(makeAvatar(entry, "is-podium"));
                name.textContent = entry.name;
                score.textContent = `${entry.score}점 · ${entry.finished ? formatElapsed(entry.elapsedMs) : "다 못 풂"}`;
            }
            stage.className = "podium-stage";
            stage.append(who, name, score);
            block.className = "podium-block";
            block.textContent = `${places[slot]}`;
            column.append(stage, block);
            return column;
        }));
    }

    function renderMissed(race) {
        const rows = Array.isArray(race.missed) ? race.missed : [];
        elements.missedEmpty.classList.toggle("hidden", rows.length > 0);
        elements.missedBoard.replaceChildren(...rows.map((row) => {
            const item = document.createElement("li");
            const head = document.createElement("p");
            const sentence = document.createElement("p");
            const bars = document.createElement("div");
            const wrong = row.answered - (row.counts[row.answer] || 0);
            head.className = "missed-head";
            head.textContent = `${row.index + 1}번 문제 · ${row.answered}명 중 ${wrong}명이 처음에 틀렸어요`;
            sentence.className = "missed-sentence";
            sentence.textContent = [row.prompt, row.sentence].filter(Boolean).join(" ");
            bars.className = "missed-bars";
            const most = Math.max(1, ...Object.values(row.counts));
            row.choices.forEach((choice) => {
                const count = row.counts[choice] || 0;
                const line = document.createElement("div");
                const label = document.createElement("span");
                const bar = document.createElement("span");
                const fill = document.createElement("span");
                const number = document.createElement("span");
                line.className = "missed-bar";
                line.classList.toggle("is-answer", choice === row.answer);
                label.className = "missed-choice";
                label.textContent = choice === row.answer ? `✓ ${choice}` : choice;
                bar.className = "missed-track";
                fill.className = "missed-fill";
                fill.style.setProperty("--share", String(count / most));
                bar.append(fill);
                number.className = "missed-count";
                number.textContent = `${count}명`;
                line.append(label, bar, number);
                bars.append(line);
            });
            item.append(head, sentence, bars);
            if (row.explanation) {
                const note = document.createElement("p");
                note.className = "missed-explanation";
                note.textContent = row.explanation;
                item.append(note);
            }
            renderMath(item);
            return item;
        }));
    }

    function renderFinalRankings(race) {
        const total = Number(race.questionCount) || 0;
        const team = race.mode === "team";
        elements.teamRankingList.classList.toggle("hidden", !team);
        if (team) {
            elements.teamRankingList.replaceChildren(...race.teamRankings.map((entry) => {
                const row = document.createElement("li");
                const rank = document.createElement("span");
                const name = document.createElement("span");
                const score = document.createElement("span");
                row.className = "ranking-row team-row";
                row.style.setProperty("--team", entry.color);
                rank.className = "rank-number";
                rank.textContent = `${entry.rank}위`;
                name.className = "rank-name";
                name.textContent = entry.name;
                score.className = "rank-score";
                score.textContent = `평균 ${formatScore(entry.score)}점`;
                row.append(rank, name, score);
                return row;
            }));
        }
        elements.rankingList.replaceChildren(...race.rankings.map((entry) => {
            const row = document.createElement("li");
            const rank = document.createElement("span");
            const name = document.createElement("span");
            const score = document.createElement("span");
            const time = document.createElement("span");
            row.className = "ranking-row has-face";
            const color = race.teams.find((item) => item.id === entry.teamId)?.color;
            if (team && color) {
                row.classList.add("has-team");
                row.style.setProperty("--team", color);
            }
            rank.className = "rank-number";
            rank.textContent = `${entry.rank}위`;
            name.className = "rank-name";
            name.append(makeAvatar(entry, "is-tiny"), document.createTextNode(entry.name));
            score.className = "rank-score";
            score.textContent = `${entry.score}/${total}점`;
            time.className = "rank-time";
            time.textContent = entry.finished ? formatElapsed(entry.elapsedMs) : "다 못 풂";
            row.append(rank, name, score, time);
            return row;
        }));
    }

    function throwConfetti() {
        if (reduceMotion) return;
        const colors = ["#e0523f", "#2f7fd1", "#2f9e5b", "#e3b021", "#8a5bd6", "#ee8a2f"];
        const layer = document.createElement("div");
        layer.className = "confetti";
        layer.setAttribute("aria-hidden", "true");
        for (let index = 0; index < 90; index += 1) {
            const piece = document.createElement("span");
            piece.style.setProperty("--x", `${Math.random() * 100}%`);
            piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 240}px`);
            piece.style.setProperty("--spin", `${(Math.random() - 0.5) * 1440}deg`);
            piece.style.setProperty("--delay", `${Math.random() * 0.9}s`);
            piece.style.setProperty("--fall", `${2.2 + Math.random() * 1.6}s`);
            piece.style.background = colors[index % colors.length];
            layer.append(piece);
        }
        document.body.append(layer);
        setTimeout(() => layer.remove(), 5200);
    }

    function renderFinish(race) {
        const firstTime = state.finishShownFor !== race.sessionId;
        state.finishShownFor = race.sessionId;
        renderMissed(race);
        renderFinalRankings(race);
        if (firstTime) {
            renderPodium(race);
            elements.podium.classList.remove("is-rising");
            replay(elements.podium, "is-rising");
            if (state.previous.phase === "running") setTimeout(throwConfetti, 1300);
        }
    }

    function renderBoard(race) {
        const team = race.mode === "team";
        const total = Number(race.questionCount) || 0;
        const participants = race.participants || [];
        const finished = participants.filter((entry) => entry.status === "finished").length;
        elements.raceTitle.textContent = team ? "학급 순위전 · 모둠전" : "학급 순위전 · 개인전";
        const countText = String(race.rangeTitle || "").includes(`${total}문제`) ? "" : `${total}문제`;
        elements.raceSubject.textContent = [race.appTitle, race.rangeTitle, countText].filter(Boolean).join(" · ");
        elements.raceProgress.textContent = `${finished}명 도착 / ${participants.length}명`;
        elements.endRaceButton.classList.toggle("hidden", race.phase !== "running");
        tickClock();

        const ended = race.phase === "ended";
        elements.raceTrack.classList.toggle("hidden", ended);
        elements.finishArea.classList.toggle("hidden", !ended);
        if (ended) {
            renderFinish(race);
            elements.raceNotice.textContent = finished === participants.length
                ? `${participants.length}명 모두 도착했습니다.`
                : `${finished}명 도착 · ${participants.length - finished}명은 다 풀지 못한 채 끝났습니다.`;
        } else {
            renderTrack(race);
            announceChanges(race);
            elements.raceNotice.textContent = "";
        }
    }

    function handleServerMessage(message, snapshot) {
        if (message.type === "QUIZRACE_ERROR") {
            const target = state.race?.phase === "running" || state.race?.phase === "ended"
                ? elements.raceNotice
                : elements.teacherNotice;
            target.textContent = message.message || "순위전 요청을 처리하지 못했습니다.";
            syncLobby(snapshot);
            return;
        }
        if (message.type !== "QUIZRACE_STATE" || !message.state) return;

        const race = message.state;
        const previousPhase = state.previous.phase;
        state.race = race;
        if (Number.isFinite(race.serverNow)) state.clockOffset = race.serverNow - Date.now();
        syncLobby(snapshot);
        syncModeControls(race);
        document.body.classList.toggle("is-board", race.phase !== "lobby");

        if (race.phase === "lobby") {
            elements.racePanel.classList.add("hidden");
            elements.setupPanel.classList.remove("hidden");
            if (previousPhase && previousPhase !== "lobby") elements.teacherNotice.textContent = "";
            renderLobbyRoster(race);
            state.trackKey = "";
            rememberState(race);
            return;
        }
        elements.setupPanel.classList.add("hidden");
        elements.racePanel.classList.remove("hidden");
        if (race.phase === "running" && previousPhase === "lobby") flashStart();
        renderBoard(race);
        rememberState(race);
    }

    function initialize() {
        renderAppGrid();
        updateRangeSummary();
        syncModeControls(null);

        if (!window.ClassroomMultiplayerLobby || !window.ClassroomNetwork) {
            elements.teacherNotice.textContent = "학급 서버를 불러오지 못했습니다. 잠시 후 다시 시도하세요.";
            return;
        }

        lobby = window.ClassroomMultiplayerLobby.create({
            gameId: GAME_ID,
            getPlayerName: () => "교사",
            initialMode: "host",
            minPlayers: 2,
            maxPlayers: 61,
            ids: { startButton: "teacherStartButtonUnused", playerList: "teacherLobbyChipsUnused" },
            onStateChange: syncLobby,
            onServerMessage: handleServerMessage,
            onPlayerLeftDuringGame: () => {},
            onNotice: (message) => { elements.teacherNotice.textContent = message; },
            onAbort: ({ message }) => { elements.teacherNotice.textContent = message || "학급 연결이 종료되었습니다."; },
            getLobbyPresentation: ({ count }) => {
                const students = Math.max(0, count - 1);
                return {
                    canStart: false,
                    startText: "교사 전용 시작",
                    guideText: students > 0 ? `현재 ${students}명 참가` : "학생 참가를 기다리는 중입니다."
                };
            }
        }).mount();
        setInterval(tickClock, 250);
    }

    document.querySelectorAll('input[name="rangeMode"]').forEach((input) => input.addEventListener("change", updateRangeSummary));
    document.querySelectorAll('input[name="raceMode"]').forEach((input) => input.addEventListener("change", sendMode));
    elements.teamSize.addEventListener("change", sendMode);
    elements.shuffleTeamsButton.addEventListener("click", () => lobby?.sendServer({ type: "QUIZRACE_ACTION", action: "SHUFFLE_TEAMS" }));
    elements.randomCount.addEventListener("change", updateRangeSummary);
    elements.lessonSelect.addEventListener("change", updateRangeSummary);
    elements.teacherStartButton.addEventListener("click", startCompetition);
    elements.endRaceButton.addEventListener("click", endCompetition);
    elements.resetRaceButton.addEventListener("click", resetCompetition);

    // 공용 뒤로가기 단추(assets/site-back-navigation.js)가 눌리면 먼저 물어본다.
    // 순위전이 진행 중일 때는 사이트 밖으로 나가지 않고 방금 상태로 새로고침한다.
    window.addEventListener("sitebackrequest", (event) => {
        if (elements.racePanel.classList.contains("hidden")) return;
        event.preventDefault();
        location.reload();
    });

    // 왼쪽 위 "← 교사 포털" 화살표는 공용 뒤로가기 단추가 안 떠도 같은 규칙으로 움직인다.
    // 옆의 "학생 화면" 단추는 다른 화면으로 가는 진짜 이동이라 그대로 둔다.
    elements.portalBackLink?.addEventListener("click", (event) => {
        if (elements.racePanel.classList.contains("hidden")) return;
        event.preventDefault();
        location.reload();
    });

    initialize();
})();
