"use strict";

// 공용 학급 순위전(quizrace) 서버 검사: 교사가 문제 묶음을 보내면 모든 학생이 정답 없는 같은 문제를 받고,
// 서버가 답마다 채점해 순위를 매기며, 모둠전·끊겼다 이어 풀기·교사의 경기 끝내기·초기화를 본다.
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawn } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
const serverRoot = path.join(projectRoot, "game-hub-server");
const { WebSocket } = require(path.join(serverRoot, "node_modules", "ws"));
const port = 23000 + Math.floor(Math.random() * 9000);
const ROOM = "6193";

function waitForServer(process) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("서버 시작 시간이 초과되었습니다.")), 8000);
        let errors = "";
        process.stderr.on("data", (chunk) => { errors += chunk.toString(); });
        process.stdout.on("data", (chunk) => {
            if (!chunk.toString().includes("listening on port")) return;
            clearTimeout(timer);
            resolve();
        });
        process.once("exit", (code) => {
            clearTimeout(timer);
            reject(new Error(`서버가 일찍 종료되었습니다. (${code}) ${errors}`));
        });
    });
}

function connectClient() {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket(`ws://127.0.0.1:${port}`);
        const queue = [];
        const waiters = [];
        socket.on("message", (raw) => {
            const message = JSON.parse(raw.toString());
            const index = waiters.findIndex((waiter) => waiter.predicate(message));
            if (index >= 0) {
                const [waiter] = waiters.splice(index, 1);
                clearTimeout(waiter.timer);
                waiter.resolve(message);
            } else {
                queue.push(message);
            }
        });
        socket.once("error", reject);
        socket.once("open", () => {
            resolve({
                socket,
                send(message) { socket.send(JSON.stringify(message)); },
                waitFor(predicate, label = "메시지") {
                    const queuedIndex = queue.findIndex(predicate);
                    if (queuedIndex >= 0) return Promise.resolve(queue.splice(queuedIndex, 1)[0]);
                    return new Promise((waitResolve, waitReject) => {
                        const waiter = { predicate, resolve: waitResolve, timer: null };
                        waiter.timer = setTimeout(() => {
                            const waiterIndex = waiters.indexOf(waiter);
                            if (waiterIndex >= 0) waiters.splice(waiterIndex, 1);
                            waitReject(new Error(`${label} 수신 시간이 초과되었습니다.`));
                        }, 5000);
                        waiters.push(waiter);
                    });
                }
            });
        });
    });
}

async function joinStudent(name, clients) {
    const client = await connectClient();
    clients.push(client);
    await client.waitFor((message) => message.type === "CONNECTED", `${name} 연결`);
    client.send({ type: "JOIN_ROOM", gameId: "quizrace", roomCode: ROOM, name });
    const joined = await client.waitFor((message) => message.type === "ROOM_JOINED", `${name} 입장`);
    return { client, playerId: String(joined.playerId) };
}

function makeQuestions(count) {
    return Array.from({ length: count }, (_, index) => ({
        id: `q-${index + 1}`,
        category: "표준어",
        prompt: "빈칸에 들어갈 알맞은 말을 고르세요.",
        sentence: `${index + 1}번 문장 ___.`,
        choices: ["맞는 말", "틀린 말", "다른 말"],
        answer: "맞는 말",
        explanation: "해설"
    }));
}


// 학생 한 명이 문제를 차례로 푼다. wrongFirst 에 든 번호는 먼저 틀리고 나서 맞힌다.
async function solveAll(student, sessionId, questions, wrongFirst = new Set()) {
    let last = null;
    for (let index = 0; index < questions.length; index += 1) {
        if (wrongFirst.has(index)) {
            student.client.send({ type: "QUIZRACE_ACTION", action: "ANSWER", sessionId, index, choice: "틀린 말" });
            const miss = await student.client.waitFor((message) => message.type === "QUIZRACE_ANSWER" && message.index === index, `${index}번 오답 응답`);
            assert.equal(miss.correct, false);
            assert.equal(miss.answer, undefined, "틀렸을 때는 정답을 알려 주지 않아야 합니다.");
        }
        student.client.send({ type: "QUIZRACE_ACTION", action: "ANSWER", sessionId, index, choice: "맞는 말" });
        const hit = await student.client.waitFor((message) => message.type === "QUIZRACE_ANSWER" && message.index === index && message.correct, `${index}번 정답 응답`);
        assert.equal(hit.firstTry, !wrongFirst.has(index));
        assert.equal(hit.answer, "맞는 말");
        last = hit;
    }
    return last;
}

async function run() {
    const server = spawn(process.execPath, [path.join(serverRoot, "server.js")], {
        cwd: serverRoot,
        env: { ...process.env, PORT: String(port), NODE_ENV: "test" },
        stdio: ["ignore", "pipe", "pipe"]
    });
    const clients = [];

    try {
        await waitForServer(server);
        let host = await connectClient();
        clients.push(host);
        await host.waitFor((message) => message.type === "CONNECTED", "교사 연결");
        host.send({ type: "CREATE_ROOM", gameId: "quizrace", roomCode: ROOM, name: "교사", clientToken: "teacher-tab-token" });
        await host.waitFor((message) => message.type === "ROOM_CREATED", "방 생성");
        await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.phase === "lobby", "초기 상태");

        const first = await joinStudent("하늘", clients);
        const second = await joinStudent("바다", clients);
        await second.client.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.participants.length === 2, "2명 상태");

        // 아바타는 서버에 있는 그림만 받는다.
        first.client.send({ type: "QUIZRACE_ACTION", action: "AVATAR", avatarKey: "animal-bear.webp" });
        const withAvatar = await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.participants.some((p) => p.avatarKey === "animal-bear.webp"), "아바타 반영");
        assert.equal(withAvatar.state.participants.find((p) => p.name === "하늘").avatarKey, "animal-bear.webp");
        second.client.send({ type: "QUIZRACE_ACTION", action: "AVATAR", avatarKey: "../../server.js" });

        // 학생은 경기 방식을 바꿀 수 없다.
        first.client.send({ type: "QUIZRACE_ACTION", action: "MODE", mode: "team", teamSize: 2 });
        const modeDenied = await first.client.waitFor((message) => message.type === "QUIZRACE_ERROR", "학생 방식 변경 거절");
        assert.match(modeDenied.message, /교사/);

        // 잘못된 묶음은 거절한다 (답이 보기에 없음).
        host.send({ type: "QUIZRACE_ACTION", action: "START", appId: "spelling", appTitle: "한글 맞춤법", questions: [{ id: "bad", sentence: "x", choices: ["a", "b"], answer: "c" }] });
        const rejected = await host.waitFor((message) => message.type === "QUIZRACE_ERROR", "잘못된 묶음 거절");
        assert.match(rejected.message, /문제 묶음/);

        // ── 개인전 ──
        const questions = makeQuestions(7);
        host.send({ type: "QUIZRACE_ACTION", action: "START", appId: "spelling", appTitle: "한글 맞춤법", rangeTitle: "3차시", questions });
        const hostStart = await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.phase === "running", "교사 시작 상태");
        const firstQuestions = await first.client.waitFor((message) => message.type === "QUIZRACE_QUESTIONS", "첫 학생 문제");
        const secondQuestions = await second.client.waitFor((message) => message.type === "QUIZRACE_QUESTIONS", "둘째 학생 문제");
        assert.equal(firstQuestions.questions.length, 7, "문제 수는 교사가 보낸 대로여야 합니다.");
        assert.deepEqual(firstQuestions.questions.map((q) => q.id), questions.map((q) => q.id), "모든 학생에게 같은 문제가 같은 순서로 가야 합니다.");
        assert.deepEqual(secondQuestions.questions.map((q) => q.id), questions.map((q) => q.id));
        assert.equal(firstQuestions.questions[0].choices.length, 3, "보기 셋짜리 문제도 그대로 전달돼야 합니다.");
        assert.ok(firstQuestions.questions.every((q) => q.answer === undefined && q.explanation === undefined), "학생에게는 정답과 해설을 미리 보내지 않아야 합니다.");
        assert.equal(hostStart.state.appTitle, "한글 맞춤법");
        assert.equal(hostStart.state.rangeTitle, "3차시");
        assert.equal(firstQuestions.sessionId, hostStart.state.sessionId);
        assert.equal(hostStart.state.rankings.length, 0);
        assert.ok(!("questions" in hostStart.state), "상태 알림에는 문제 묶음을 싣지 않아야 합니다.");
        const sessionId = hostStart.state.sessionId;

        const late = await connectClient();
        clients.push(late);
        await late.waitFor((message) => message.type === "CONNECTED", "늦은 학생 연결");
        late.send({ type: "JOIN_ROOM", gameId: "quizrace", roomCode: ROOM, name: "노을" });
        const lateError = await late.waitFor((message) => message.type === "ERROR", "진행 중 입장 거절");
        assert.match(lateError.message, /이미 시작한/);

        // 차례를 건너뛴 답은 받지 않는다.
        first.client.send({ type: "QUIZRACE_ACTION", action: "ANSWER", sessionId, index: 3, choice: "맞는 말" });
        const stale = await first.client.waitFor((message) => message.type === "QUIZRACE_ANSWER" && message.stale, "건너뛴 답");
        assert.equal(stale.currentIndex, 0);

        // 하늘: 0번·4번을 먼저 틀림 → 첫 시도 정답 5개
        const firstLast = await solveAll(first, sessionId, questions, new Set([0, 4]));
        // 다 풀면 서버가 오답노트를 준다: 처음 고른 답이 틀린 문제만.
        assert.equal(firstLast.finished, true);
        assert.deepEqual(firstLast.review.map((row) => [row.index, row.chosen, row.answer]), [[0, "틀린 말", "맞는 말"], [4, "틀린 말", "맞는 말"]]);
        const firstResult = await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.rankings.length === 1, "첫 결과");
        assert.equal(firstResult.state.rankings[0].name, "하늘");
        assert.equal(firstResult.state.rankings[0].score, 5);
        assert.ok(Number.isFinite(firstResult.state.rankings[0].elapsedMs));

        // 바다: 모두 한 번에
        await solveAll(second, sessionId, questions);
        const finalState = await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.phase === "ended", "최종 순위");
        assert.deepEqual(finalState.state.rankings.map((entry) => [entry.rank, entry.name, entry.score]), [
            [1, "바다", 7],
            [2, "하늘", 5]
        ]);
        // 반 전체가 많이 틀린 문제: 0번과 4번(둘 중 하나가 틀림)
        assert.deepEqual(finalState.state.missed.map((row) => row.index).sort(), [0, 4]);
        assert.equal(finalState.state.missed[0].counts["틀린 말"], 1);

        // ── 모둠전 ──
        host.send({ type: "QUIZRACE_ACTION", action: "RESET" });
        await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.phase === "lobby" && message.state.questionCount === 0, "초기화");
        const third = await joinStudent("구름", clients);
        const fourth = await joinStudent("나무", clients);
        host.send({ type: "QUIZRACE_ACTION", action: "MODE", mode: "team", teamSize: 2 });
        const teamLobby = await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.mode === "team" && message.state.teams.length === 2 && message.state.participants.length === 4, "모둠 편성");
        assert.deepEqual(teamLobby.state.teams.map((team) => team.memberIds.length), [2, 2], "네 명을 두 명씩 두 모둠으로 나눠야 합니다.");
        assert.ok(teamLobby.state.participants.every((p) => p.teamId), "모든 학생이 모둠에 들어가야 합니다.");

        const teamQuestions = makeQuestions(2);
        host.send({ type: "QUIZRACE_ACTION", action: "START", appId: "spelling", appTitle: "한글 맞춤법", rangeTitle: "모둠", questions: teamQuestions });
        const teamStart = await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.phase === "running" && message.state.rangeTitle === "모둠", "모둠전 시작");
        const teamSession = teamStart.state.sessionId;
        for (const student of [first, second, third, fourth]) {
            await student.client.waitFor((message) => message.type === "QUIZRACE_QUESTIONS" && message.sessionId === teamSession, `모둠전 문제 ${student.playerId}`);
        }

        // 구름이 한 문제를 풀다가 연결이 끊기고, 같은 이름으로 다시 들어와 이어 푼다.
        third.client.send({ type: "QUIZRACE_ACTION", action: "ANSWER", sessionId: teamSession, index: 0, choice: "틀린 말" });
        await third.client.waitFor((message) => message.type === "QUIZRACE_ANSWER" && message.index === 0 && message.correct === false, "구름 0번 오답");
        third.client.send({ type: "QUIZRACE_ACTION", action: "ANSWER", sessionId: teamSession, index: 0, choice: "맞는 말" });
        await third.client.waitFor((message) => message.type === "QUIZRACE_ANSWER" && message.correct, "구름 0번");
        third.client.socket.close(4000, "LEAVE");
        const whileAway = await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.participants.some((p) => p.name === "구름" && p.left), "구름 끊김 표시");
        // 나간 학생 때문에 경기가 저절로 끝나지 않는다.
        assert.equal(whileAway.state.phase, "running");
        const back = await joinStudent("구름", clients);
        const resume = await back.client.waitFor((message) => message.type === "QUIZRACE_QUESTIONS" && message.sessionId === teamSession, "이어 풀기 문제");
        assert.equal(resume.resumeIndex, 1, "끊기기 전까지 푼 자리부터 이어야 합니다.");
        assert.equal(resume.score, 0, "처음에 틀린 문제는 점수가 되지 않습니다.");
        assert.deepEqual(resume.review.map((row) => row.index), [0], "다시 들어와도 오답노트가 남아 있어야 합니다.");

        // 교사가 경기를 끝내면 푼 만큼으로 모둠 순위를 낸다.
        await solveAll(first, teamSession, teamQuestions);
        // 나무는 1번을 틀린 채로 멈춰 있다. 끝나면 풀던 문제도 오답노트에 들어간다.
        fourth.client.send({ type: "QUIZRACE_ACTION", action: "ANSWER", sessionId: teamSession, index: 0, choice: "맞는 말" });
        await fourth.client.waitFor((message) => message.type === "QUIZRACE_ANSWER" && message.index === 0 && message.correct, "나무 0번");
        fourth.client.send({ type: "QUIZRACE_ACTION", action: "ANSWER", sessionId: teamSession, index: 1, choice: "틀린 말" });
        await fourth.client.waitFor((message) => message.type === "QUIZRACE_ANSWER" && message.index === 1 && message.correct === false, "나무 1번 오답");
        host.send({ type: "QUIZRACE_ACTION", action: "END" });
        const fourthReview = await fourth.client.waitFor((message) => message.type === "QUIZRACE_REVIEW" && message.sessionId === teamSession, "끝난 뒤 오답노트");
        assert.deepEqual(fourthReview.review.map((row) => [row.index, row.answer]), [[1, "맞는 말"]]);
        const teamEnd = await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.phase === "ended" && message.state.sessionId === teamSession, "모둠전 끝");
        assert.equal(teamEnd.state.teamRankings.length, 2);
        assert.ok(teamEnd.state.teamRankings[0].score >= teamEnd.state.teamRankings[1].score, "모둠 점수가 높은 쪽이 앞서야 합니다.");
        // 끝난 뒤 새로고침한 학생도 같은 이름으로 들어와 제 결과를 본다.
        fourth.client.socket.close(4000, "RELOAD");
        await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.participants.some((p) => p.name === "나무" && p.left), "나무 끊김 표시");
        const fourthBack = await joinStudent("나무", clients);
        const afterEnd = await fourthBack.client.waitFor((message) => message.type === "QUIZRACE_QUESTIONS" && message.sessionId === teamSession, "끝난 뒤 다시 들어온 학생");
        assert.equal(afterEnd.resumeIndex, 1);
        assert.deepEqual(afterEnd.review.map((row) => row.index), [1]);
        assert.ok(teamEnd.state.teamRankings.every((team) => !("exact" in team)) && teamEnd.state.teams.every((team) => !("exact" in team)), "정렬용 값은 밖으로 보내지 않습니다.");
        assert.equal(teamEnd.state.rankings.length, 4, "끝낸 뒤에는 모든 학생이 순위에 들어가야 합니다.");

        // 교사 화면 새로고침: '떠남'(4000)이 아니라 '잠깐 끊김'으로 닫고, 같은 탭 표로 같은 방 번호를 다시 열면 방을 되찾는다.
        host.socket.close(4005, "PAGE_RELOAD");
        await new Promise((resolve) => setTimeout(resolve, 200));
        host = await connectClient();
        clients.push(host);
        await host.waitFor((message) => message.type === "CONNECTED", "교사 다시 연결");
        host.send({ type: "CREATE_ROOM", gameId: "quizrace", roomCode: ROOM, name: "교사", clientToken: "teacher-tab-token" });
        await host.waitFor((message) => message.type === "ROOM_RESUMED", "교사 방 되찾기");
        const resumedBoard = await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.sessionId === teamSession, "되찾은 경기장");
        assert.equal(resumedBoard.state.phase, "ended");
        assert.equal(resumedBoard.state.participants.length, 4, "새로고침 뒤에도 학생들이 그대로 있어야 합니다.");
        // 다른 탭(표가 다름)은 같은 번호로 방을 가로채지 못한다.
        const stranger = await connectClient();
        clients.push(stranger);
        await stranger.waitFor((message) => message.type === "CONNECTED", "다른 탭 연결");
        stranger.send({ type: "CREATE_ROOM", gameId: "quizrace", roomCode: ROOM, name: "교사", clientToken: "other-tab-token" });
        await stranger.waitFor((message) => message.type === "ROOM_EXISTS", "다른 탭 거절");

        host.send({ type: "QUIZRACE_ACTION", action: "RESET" });
        const resetState = await host.waitFor((message) => message.type === "QUIZRACE_STATE" && message.state.phase === "lobby" && message.state.questionCount === 0 && message.state.sessionId === "", "초기화 상태");
        assert.equal(resetState.state.appTitle, "");

        console.log("quizrace-server-integration: server scoring, hidden answers, teams, resume, end and reset ok");
    } finally {
        for (const client of clients) {
            try { client.socket.close(4000, "TEST_COMPLETE"); } catch (error) {}
        }
        server.kill();
    }
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
