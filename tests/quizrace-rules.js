// 학급 순위전 규칙(game-hub-server/quizrace.js)을 서버 없이 바로 돌려 본다.
// 새로고침 한 번에 반 전체 경기가 끝나 버리던 일을 막는다.
const assert = require("node:assert/strict");
const path = require("node:path");
const Quizrace = require(path.join(__dirname, "..", "game-hub-server", "quizrace.js"));

const questions = [1, 2, 3].map((number) => ({
    id: `q-${number}`,
    sentence: `${number}번 문장 ___.`,
    choices: ["맞는 말", "틀린 말"],
    answer: "맞는 말",
    explanation: "해설"
}));

function act(game, playerId, message, isHost = false) {
    return Quizrace.handleAction(game, { playerId, isHost, message, avatarExists: () => true });
}

function solve(game, playerId, from = 0) {
    const sessionId = game.sessionId;
    for (let index = from; index < questions.length; index += 1) {
        const result = act(game, playerId, { action: "ANSWER", sessionId, index, choice: "맞는 말" });
        assert.equal(result.reply.correct, true);
    }
}

const game = Quizrace.createGame();
assert.equal(Quizrace.addPlayer(game, "a", "하늘").ok, true);
assert.equal(Quizrace.addPlayer(game, "b", "바다").ok, true);
assert.equal(act(game, "host", { action: "START", appId: "x", appTitle: "x", questions }, true).sendQuestions, true);

// 하늘이 다 풀고, 바다는 한 문제 풀다 새로고침으로 나간다.
solve(game, "a");
act(game, "b", { action: "ANSWER", sessionId: game.sessionId, index: 0, choice: "맞는 말" });
Quizrace.removePlayer(game, "b");
assert.equal(game.phase, "running", "남은 학생이 모두 끝났어도 나간 학생 때문에 경기가 저절로 끝나면 안 된다.");

// 같은 이름으로 다시 들어오면 이어 풀고, 다 풀면 그때 끝난다.
const back = Quizrace.addPlayer(game, "b2", "바다");
assert.deepEqual(back, { ok: true, resumed: true });
assert.equal(Quizrace.questionsPayload(game, "b2").resumeIndex, 1);
solve(game, "b2", 1);
assert.equal(game.phase, "ended", "모두 다 풀면 경기가 끝나야 한다.");

// 끝난 뒤 새로고침한 학생도 같은 이름으로 결과를 다시 본다.
Quizrace.removePlayer(game, "a");
const again = Quizrace.addPlayer(game, "a2", "하늘");
assert.deepEqual(again, { ok: true, resumed: true });
assert.equal(Quizrace.questionsPayload(game, "a2").resumeIndex, questions.length);

// 모르는 이름은 끝난 경기에 들어오지 못한다.
assert.equal(Quizrace.addPlayer(game, "c", "구름").ok, false);

// 모둠 순위는 반올림하기 전 평균으로 가른다.
const teamGame = Quizrace.createGame();
["가람", "나래", "다솜", "라희", "마루", "바름", "사랑"].forEach((name, index) => Quizrace.addPlayer(teamGame, `p${index}`, name));
act(teamGame, "host", { action: "MODE", mode: "team", teamSize: 4 }, true);
assert.equal(teamGame.teams.length, 2);
assert.deepEqual(teamGame.teams.map((team) => team.memberIds.length).sort(), [3, 4]);
const state = Quizrace.publicState(teamGame);
assert.ok(state.teams.every((team) => !("exact" in team)));

console.log("quizrace-rules: leaving does not end the race, rejoin after end, team split ok");
