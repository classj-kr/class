(() => {
    "use strict";
    const $ = id => document.getElementById(id);
    const teamName = ["청팀", "홍팀"];
    const corners = [[88,88], [88,12], [12,12], [12,88]];
    const points = corners.flatMap(([x,y], side) => {
        const [nextX,nextY] = corners[(side + 1) % 4];
        return Array.from({length:5}, (_, i) => [x + (nextX-x)*i/5, y + (nextY-y)*i/5]);
    }).concat([[75.3,24.7],[62.7,37.3],[50,50],[37.3,62.7],[24.7,75.3],
        [24.7,24.7],[37.3,37.3],[62.7,62.7],[75.3,75.3],[97,92]]);
    const board = $("board");
    const nodes = points.slice(0,29).map(([x,y], index) => {
        const node = document.createElement("span");
        node.className = "node";
        if (index % 5 === 0 && index < 20 || index === 22) node.classList.add("junction");
        node.style.left = x + "%";
        node.style.top = y + "%";
        board.append(node);
        return node;
    });
    let lobby, state, selected, selectedResult = 0, noticeTimer, animation, turnTimer, waiting = false;

    function notice(text) {
        clearTimeout(noticeTimer);
        $("notice").textContent = text;
        $("notice").hidden = false;
        noticeTimer = setTimeout(() => { $("notice").hidden = true; }, 2600);
    }

    function token(piece, walking = false) {
        const el = document.createElement("span");
        el.className = "token team-" + piece.team;
        const player = state.players[piece.owner];
        if (player.avatarKey) el.append(ClassroomAvatars.create(player.avatarKey, {walking}));
        else el.classList.add("plain");
        const number = document.createElement("b");
        number.textContent = piece.id % 4 + 1;
        el.append(number);
        return el;
    }

    function isMyTurn() {
        return state.winner === null && state.players[state.turn].id === lobby.snapshot().myId;
    }

    function render() {
        if (!state) return;
        const event = state.event;
        const myTurn = isMyTurn();
        const move = selected == null ? null : YutRules.preview(state, selected, selectedResult);
        const piecesAtNode = new Map();
        board.querySelectorAll(".board-token").forEach(node => node.remove());
        nodes.forEach((node, index) => {
            node.classList.toggle("trail", !!move?.path.includes(index));
            node.classList.toggle("target", move?.node === index);
        });
        board.classList.toggle("finish-target", !!move && move.node === null);
        for (const piece of state.pieces) {
            if (piece.node === null || piece.finished || animation && event.group.includes(piece.id)) continue;
            const offset = piecesAtNode.get(piece.node) || 0;
            piecesAtNode.set(piece.node, offset + 1);
            const [x,y] = points[piece.node];
            const el = token(piece);
            el.classList.add("board-token");
            el.style.left = `calc(${x}% + ${offset * 7}px)`;
            el.style.top = `calc(${y}% - ${offset * 8}px)`;
            if (myTurn && !state.throwing && piece.team === state.turn % 2) {
                const pick = document.createElement("button");
                pick.type = "button";
                pick.className = "board-token pick-token";
                pick.style.cssText = el.style.cssText;
                pick.setAttribute("aria-label", `${piece.id % 4 + 1}번 말 고르기`);
                pick.append(el);
                el.classList.remove("board-token");
                pick.onclick = () => { selected = piece.id; render(); $("moveBtn").focus(); };
                board.append(pick);
            } else board.append(el);
        }
        $("score").replaceChildren(...teamName.map((name, team) => {
            const text = document.createElement("span");
            text.className = "team-score team-" + team;
            const finished = state.pieces.filter(piece => piece.team === team && piece.finished).length;
            const names = state.players.filter((_, index) => index % 2 === team).map(player => player.name);
            text.textContent = `${name} ${finished}/4 · ${names.join(" / ")}`;
            return text;
        }));
        $("turn").textContent = state.winner === null
            ? myTurn ? "내 차례" : state.players[state.turn].name + "님의 차례"
            : teamName[state.winner] + " 승리!";
        if (event?.kind === "roll") $("result").textContent = `${YutRules.names[event.roll.steps]} · ${event.roll.steps}칸${state.throwing ? " · 한 번 더!" : ""}`;
        else $("result").textContent = event?.kind === "move"
            ? [event.caught && `${event.caught}개 잡았다!`, event.stacked && "업었다!", event.finished && "완주!",
                event.bonus && state.winner === null && "한 번 더!"].filter(Boolean).join(" ") || "이동 완료"
            : "윷을 던져 시작하세요";
        $("throwBtn").disabled = !myTurn || !state.throwing || waiting || !!animation;
        $("results").replaceChildren(...state.results.map((roll, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = `${YutRules.names[roll.steps]} · ${roll.steps}칸`;
            button.disabled = !myTurn || state.throwing || waiting || !!animation;
            button.setAttribute("aria-pressed", String(!state.throwing && index === selectedResult));
            button.onclick = () => { selectedResult = index; render(); $("results").children[index]?.focus(); };
            return button;
        }));
        $("pieces").replaceChildren();
        if (myTurn && !state.throwing) {
            const team = state.turn % 2;
            for (const piece of state.pieces.filter(item => item.team === team && !item.finished)) {
                const button = document.createElement("button");
                button.type = "button";
                button.setAttribute("aria-pressed", String(selected === piece.id));
                button.append(token(piece), document.createTextNode(piece.node === null ? "출발 전" : "윷판 위"));
                button.onclick = () => {
                    selected = piece.id;
                    render();
                    $("pieces").querySelector('[aria-pressed="true"]')?.focus();
                };
                $("pieces").append(button);
            }
        }
        $("moveBtn").classList.toggle("hidden", !move || !myTurn);
        $("moveBtn").disabled = waiting || !!animation;
        $("rematchBtn").classList.toggle("hidden", state.winner === null || lobby.snapshot().role !== "host");
    }

    function tickClock() {
        if (!state || state.winner !== null || !state.deadline) {
            $("turnClock").textContent = "";
            return;
        }
        const remaining = state.deadline - Date.now();
        const label = state.throwing ? "윷 던지기" : "결과와 말 고르기";
        $("turnClock").textContent = `${label} · ${Math.max(0, Math.ceil(remaining / 1000))}초`;
        if (remaining <= 0 && lobby.snapshot().role === "host") {
            const player = state.players[state.turn];
            const localTurn = isMyTurn();
            apply(player.id, YutRules.timeoutAction(state, localTurn ? selected : null, localTurn ? selectedResult : 0), true);
        }
    }

    function setDeadline(game) {
        const phase = game.throwing ? "throw" : "move";
        game.deadline = game.winner === null ? Date.now() + YutRules.seconds[phase] * 1000 : null;
        return game;
    }

    function showSticks(roll) {
        $("sticks").replaceChildren(...Array.from({length:4}, (_, index) => {
            const stick = document.createElement("span");
            if (roll && !roll.sticks[index]) stick.className = "back";
            stick.style.setProperty("--stick", index);
            if (roll) stick.classList.add("toss");
            return stick;
        }));
    }

    function update(next, animate = true) {
        animation?.cancel();
        animation = null;
        state = next;
        selected = null;
        selectedResult = 0;
        waiting = false;
        const event = state.event;
        if (!event || event.kind === "roll") showSticks(event?.roll);
        if (animate && event?.kind === "move" && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const el = token(state.pieces.find(piece => piece.id === event.id), true);
            el.classList.add("walking-token");
            board.append(el);
            const path = [event.from ?? 0, ...event.path];
            animation = el.animate(path.map(index => ({left:points[index][0]+"%", top:points[index][1]+"%"})),
                {duration: Math.min(960, 175 * (path.length - 1)), easing:"linear", fill:"forwards"});
            const current = animation;
            current.finished.then(() => { if (animation === current) { animation = null; render(); } })
                .catch(() => {}).finally(() => el.remove());
        }
        render();
        tickClock();
    }

    function apply(sender, action, timedOut = false) {
        if (!state || !timedOut && Date.now() >= state.deadline) return;
        if (!YutRules.act(state, sender, action)) return;
        setDeadline(state);
        lobby.broadcast({type:"YUT_STATE", state});
        update(state);
    }

    function submit(kind) {
        const snapshot = lobby.snapshot();
        if (!isMyTurn() || waiting || animation) return;
        const action = {kind, piece:selected, result:selectedResult, revision:state.revision};
        if (snapshot.role === "host") apply(snapshot.myId, action);
        else if (lobby.send({type:"YUT_ACTION", action})) {
            const revision = state.revision;
            waiting = true;
            render();
            setTimeout(() => { if (state?.revision === revision && waiting) { waiting = false; render(); } }, 2500);
        }
    }

    function returnToLobby() {
        clearInterval(turnTimer);
        animation?.cancel();
        animation = null;
        state = null;
        $("gameScreen").classList.add("hidden");
        $("lobbyScreen").classList.remove("hidden");
        lobby.returnToLobby();
    }

    const savedName = String(window.CLASS_PLAYER_NAME || "").trim();
    lobby = ClassroomMultiplayerLobby.create({
        gameId:"yutnori", initialMode:"guest", maxPlayers:4, allowedPlayerCounts:[2,4],
        getPlayerName:() => savedName,
        canStart:({count}) => count === Number($("mode").value),
        getLobbyData:() => ({mode:$("mode").value}),
        onLobbyData:data => { if (["2","4"].includes(data?.mode)) $("mode").value = data.mode; },
        onStateChange:({role}) => { $("mode").disabled = role !== "host"; },
        getLobbyPresentation:({role, canStart}) => ({
            canStart,
            guideText: role === "host" ? `이 모드는 ${$("mode").value}명이 모이면 시작해요.` : "방장이 시작하면 윷을 던질 수 있어요."
        }),
        rulesButtonIds:["rulesBtnLobby","rulesBtnGame"],
        leaveButtonIds:["leaveBtn"],
        onRules:() => $("rulesDialog").showModal(),
        onLeave:() => { location.href = "/"; },
        onNotice:notice,
        createStartData:({players, myId}) => ({state:setDeadline(YutRules.create(
            [myId, ...Object.keys(players).filter(id => id !== myId)].map(id => ({
                id, name:players[id].name, avatarKey:players[id].avatarKey
            })))) }),
        onStarted:({data}) => {
            $("lobbyScreen").classList.add("hidden");
            $("gameScreen").classList.remove("hidden");
            update(data.state, false);
            clearInterval(turnTimer);
            turnTimer = setInterval(tickClock, 200);
        },
        onGameMessage:(sender, payload, snapshot) => {
            if (payload.type === "YUT_ACTION" && snapshot.role === "host") apply(sender, payload.action);
            if (snapshot.role !== "host" && sender === lobby.hostId) {
                if (payload.type === "YUT_STATE" && state && payload.state?.revision > state.revision) update(payload.state);
                if (payload.type === "YUT_REMATCH") returnToLobby();
            }
        },
        onAbort:({message}) => {
            clearInterval(turnTimer);
            $("abortMessage").textContent = message;
            if (!$("abortDialog").open) $("abortDialog").showModal();
        }
    }).mount();
    $("mode").onchange = () => lobby.publishLobbyState();
    $("throwBtn").onclick = () => submit("throw");
    $("moveBtn").onclick = () => submit("move");
    $("reloadBtn").onclick = () => location.reload();
    $("rematchBtn").onclick = () => { lobby.broadcast({type:"YUT_REMATCH"}); returnToLobby(); };
})();
