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
    let lobby, state, selected, selectedResult = 0, noticeTimer, animation, turnTimer, waiting = false, lastTick;
    let rollTimer, rolling = false;
    const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    function renderBench() {
        $("teamBench").replaceChildren(...teamName.map((name, team) => {
            const card = document.createElement("section");
            card.className = `bench-card team-${team}`;
            card.classList.toggle("active", state.winner === null && state.turn % 2 === team);
            const heading = document.createElement("h2");
            const pieces = state.pieces.filter(piece => piece.team === team);
            heading.textContent = `${name} · ${pieces.filter(piece => piece.finished).length}/4`;
            const roster = document.createElement("div");
            roster.className = "bench-pieces";
            for (const piece of pieces) {
                const slot = document.createElement("div");
                slot.className = "bench-slot";
                const label = document.createElement("span");
                label.textContent = state.players[piece.owner].name;
                const status = document.createElement("small");
                status.textContent = piece.finished ? "완주" : piece.node === null ? "대기" : "이동 중";
                slot.append(token(piece), label, status);
                roster.append(slot);
            }
            card.append(heading, roster);
            return card;
        }));
    }

    function announce(event) {
        const callout = $("boardCallout");
        if (!event) { callout.replaceChildren(); return; }
        let label = "";
        if (state.winner !== null) label = teamName[state.winner] + " 승리!";
        else if (event?.kind === "roll") label = `${YutRules.names[event.roll.steps]}!`;
        else if (event?.caught) label = `${event.caught}개 잡았다!`;
        else if (event?.stacked) label = "업었다!";
        else if (event?.finished) label = "완주!";
        callout.replaceChildren();
        if (!label) return;
        const badge = document.createElement("strong");
        badge.textContent = label;
        badge.className = `team-${event?.kind === "move" ? state.pieces.find(piece => piece.id === event.id).team : state.turn % 2}`;
        if (state.winner !== null) badge.classList.add("victory");
        callout.append(badge);
        const detail = document.createElement("small");
        detail.textContent = state.winner !== null ? "네 말 모두 도착!" : event?.kind === "roll"
            ? `${event.roll.steps}칸 ${event.roll.steps >= 4 ? "· 한 번 더 던져요!" : "· 움직일 말을 골라요"}`
            : event?.caught ? "출발점으로 돌려보냈어요!" : event?.stacked ? "이제 함께 달려요!" : "도착 성공!";
        badge.append(detail);
        if (state.winner !== null) {
            const winners = document.createElement("span");
            winners.className = "victory-roster";
            for (const piece of state.pieces.filter(piece => piece.team === state.winner)) {
                const avatar = token(piece);
                avatar.style.setProperty("--celebration-delay", `${piece.id % 4 * 100}ms`);
                winners.append(avatar);
            }
            badge.append(winners);
        }
        if (event?.kind === "move") {
            const end = points[event.path.at(-1)] || points[0];
            burst(end, state.winner !== null ? 30 : 14);
        } else if (event?.roll.steps >= 4) burst([50, 50], 20);
    }

    function burst([x,y], count) {
        if (reducedMotion()) return;
        const layer = $("boardEffects");
        for (let i = 0; i < count; i++) {
            const spark = document.createElement("i");
            spark.className = "spark";
            spark.style.cssText = `left:${x}%;top:${y}%;background:${["#ffd05d", "#fff4b0", "#65d5ef", "#ff8c82"][i%4]}`;
            layer.append(spark);
            const angle = i * Math.PI * 2 / count;
            const radius = 40 + i % 4 * 17;
            const motion = spark.animate([
                {transform:"translate(-50%,-50%) scale(.4)", opacity:1},
                {transform:`translate(${Math.cos(angle)*radius}px,${Math.sin(angle)*radius-20}px) rotate(${i*51}deg)`, opacity:1, offset:.55},
                {transform:`translate(${Math.cos(angle)*radius*1.2}px,${Math.sin(angle)*radius+50}px) rotate(${i*91}deg) scale(.3)`, opacity:0}
            ], {duration:800, easing:"ease-out"});
            motion.finished.then(() => spark.remove(), () => spark.remove());
        }
    }

    function render() {
        if (!state) return;
        const event = state.event;
        renderBench();
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
            el.dataset.piece = piece.id;
            el.style.left = `calc(${x}% + ${offset * 7}px)`;
            el.style.top = `calc(${y}% - ${offset * 8}px)`;
            if (myTurn && !state.throwing && piece.team === state.turn % 2) {
                const pick = document.createElement("button");
                pick.type = "button";
                pick.className = "board-token pick-token";
                pick.classList.toggle("selected", selected === piece.id);
                pick.style.cssText = el.style.cssText;
                pick.setAttribute("aria-label", `${piece.id % 4 + 1}번 말 고르기`);
                pick.disabled = waiting || !!animation || rolling;
                pick.append(el);
                el.classList.remove("board-token");
                el.style.left = "";
                el.style.top = "";
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
        $("throwBtn").disabled = !myTurn || !state.throwing || waiting || !!animation || rolling;
        $("throwBtn").textContent = rolling ? "데굴데굴…" : state.throwing && state.results.length ? "한 번 더 던지기!" : "윷 던지기";
        $("results").replaceChildren(...state.results.map((roll, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = `${YutRules.names[roll.steps]} · ${roll.steps}칸`;
            button.disabled = !myTurn || state.throwing || waiting || !!animation || rolling;
            button.className = "result-card";
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
                button.disabled = waiting || !!animation || rolling;
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
        $("moveBtn").disabled = waiting || !!animation || rolling;
        $("turnHint").textContent = !myTurn ? "" : state.throwing
            ? state.results.length ? "결과를 모아 뒀어요. 윷을 한 번 더 던져요." : "윷 던지기를 눌러요."
            : move ? "빛나는 칸으로 이 말을 옮겨요."
                : state.results.length > 1 ? "쓸 결과를 고르고, 움직일 말을 눌러요." : "움직일 우리 팀 말을 눌러요.";
        $("rematchBtn").classList.toggle("hidden", state.winner === null || lobby.snapshot().role !== "host");
    }

    function tickClock() {
        if (!state || state.winner !== null || !state.deadline) {
            $("yutClock").textContent = "";
            $("yutClock").classList.remove("urgent");
            return;
        }
        const remaining = state.deadline - Date.now();
        const label = state.throwing ? "윷 던지기" : "결과와 말 고르기";
        const seconds = Math.max(0, Math.ceil(remaining / 1000));
        const clock = $("yutClock");
        const display = `${label} · ${seconds}초`;
        if (clock.textContent !== display) clock.textContent = display;
        const urgent = isMyTurn() && seconds > 0 && seconds <= 5;
        clock.classList.toggle("urgent", urgent);
        const tick = `${state.revision}:${seconds}`;
        if (urgent && !state.throwing && tick !== lastTick && !$("rulesDialog").open) window.ClassGameSfx?.play("tick");
        lastTick = tick;
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

    function showSticks(roll, container = $("sticks"), toss = true) {
        container.replaceChildren(...Array.from({length:4}, (_, index) => {
            const stick = document.createElement("span");
            if (roll && !roll.sticks[index]) stick.className = "back";
            stick.style.setProperty("--stick", index);
            for (const side of ["flat", "round"]) {
                const face = document.createElement("i");
                face.className = side;
                stick.append(face);
            }
            if (roll && toss) stick.classList.add("toss");
            return stick;
        }));
    }

    function update(next, animate = true) {
        animation?.cancel();
        animation = null;
        clearTimeout(rollTimer);
        rolling = false;
        $("rollStage").hidden = true;
        $("boardEffects").replaceChildren();
        state = next;
        selected = null;
        selectedResult = 0;
        waiting = false;
        const event = state.event;
        const captured = animate && event?.caught ? [...board.querySelectorAll("[data-piece]")]
            .filter(el => {
                const piece = state.pieces.find(item => item.id === Number(el.dataset.piece));
                return piece && piece.team !== state.pieces[event.id].team && piece.node === null;
            }).map(el => el.cloneNode(true)) : [];
        if (!event || event.kind === "roll") showSticks(event?.roll);
        announce(animate ? null : event);
        if (animate && event?.kind === "roll") {
            if (reducedMotion()) announce(event);
            else {
                rolling = true;
                $("rollStage").hidden = false;
                showSticks(event.roll, $("stageSticks"));
                rollTimer = setTimeout(() => {
                    rolling = false;
                    $("rollStage").hidden = true;
                    announce(event);
                    render();
                }, 850);
            }
        }
        if (animate && event?.kind === "move" && !reducedMotion()) {
            const el = token(state.pieces.find(piece => piece.id === event.id), true);
            if (event.group.length > 1) el.querySelector("b").textContent = `×${event.group.length}`;
            el.classList.add("walking-token");
            board.append(el);
            const path = [event.from ?? 0, ...event.path];
            const frames = [{left:points[path[0]][0]+"%", top:points[path[0]][1]+"%", transform:"translateY(0)"}];
            for (let step = 1; step < path.length; step++) {
                const a = points[path[step-1]], b = points[path[step]];
                frames.push({left:(a[0]+b[0])/2+"%", top:(a[1]+b[1])/2+"%", transform:"translateY(-15px) rotate(-5deg)"},
                    {left:b[0]+"%", top:b[1]+"%", transform:"translateY(0) rotate(0)"});
            }
            animation = el.animate(frames,
                {duration: Math.min(1150, 220 * (path.length - 1)), easing:"linear", fill:"forwards"});
            const current = animation;
            current.finished.then(() => {
                if (animation === current) {
                    animation = null;
                    render();
                    announce(event);
                    for (const ghost of captured) {
                        ghost.classList.remove("board-token");
                        ghost.classList.add("returning-token");
                        board.append(ghost);
                        const retreat = ghost.animate([
                            {transform:"rotate(0) scale(1)", opacity:1},
                            {transform:"translateY(-30px) rotate(-18deg) scale(1.1)", opacity:1, offset:.3},
                            {transform:"translate(-95px,45px) rotate(-35deg) scale(.2)", opacity:0}
                        ], {duration:550, easing:"ease-in", fill:"forwards"});
                        retreat.finished.then(() => ghost.remove(), () => ghost.remove());
                    }
                }
            })
                .catch(() => {}).finally(() => el.remove());
        } else if (event?.kind === "move") announce(event);
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
        if (!isMyTurn() || waiting || animation || rolling) return;
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
        clearTimeout(rollTimer);
        rolling = false;
        $("rollStage").hidden = true;
        animation?.cancel();
        animation = null;
        state = null;
        $("gameScreen").classList.add("hidden");
        $("lobbyScreen").classList.remove("hidden");
        lobby.returnToLobby();
    }

    function showPractice() {
        const dialog = $("rulesDialog");
        const available = [];
        let throws = 0, position = 0, chosen = -1;
        let avatarKey = lobby.snapshot().players[lobby.snapshot().myId]?.avatarKey;
        function draw() {
            const actions = $("practiceActions");
            const hint = $("practiceHint");
            actions.replaceChildren();
            function addButton(text, onClick, pressed) {
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = text;
                button.onclick = onClick;
                if (pressed !== undefined) button.setAttribute("aria-pressed", String(pressed));
                actions.append(button);
            }
            if (throws < 2) {
                hint.textContent = throws === 0 ? "윷을 던져 볼까요?" : "모! 5칸을 모아 두고, 한 번 더 던져요.";
                addButton(throws === 0 ? "윷 던지기" : "한 번 더 던지기", () => {
                    available.push(throws === 0 ? 5 : 2);
                    throws++;
                    draw();
                    actions.firstElementChild.focus();
                });
            } else if (available.length) {
                hint.textContent = chosen < 0
                    ? "모아 둔 결과 중 먼저 쓸 것을 골라요."
                    : `빛나는 칸까지 ${available[chosen]}칸 옮겨요.`;
                available.forEach((steps, index) => addButton(`${YutRules.names[steps]} · ${steps}칸`, () => {
                    chosen = index;
                    draw();
                    $("practiceMove").focus();
                }, chosen === index));
                if (chosen >= 0) {
                    addButton("말 옮기기", () => {
                        position += available.splice(chosen, 1)[0];
                        chosen = -1;
                        draw();
                        (actions.firstElementChild || dialog.querySelector("form button")).focus();
                    });
                    actions.lastElementChild.id = "practiceMove";
                }
            } else hint.textContent = "잘했어요! 모와 개를 골라 말 하나를 두 번 옮겼어요.";
            const target = chosen < 0 ? -1 : position + available[chosen];
            $("practiceTrack").replaceChildren(...Array.from({length:8}, (_, index) => {
                const cell = document.createElement("span");
                cell.classList.toggle("target", index === target);
                if (index === position) {
                    if (avatarKey) cell.append(ClassroomAvatars.create(avatarKey));
                    else cell.textContent = "●";
                    cell.setAttribute("aria-label", index === 0 ? "출발 칸의 말" : `${index}번째 칸의 말`);
                }
                return cell;
            }));
        }
        draw();
        dialog.showModal();
        if (!avatarKey) ClassroomAvatars.loadKey().then(key => {
            if (!dialog.open || !key) return;
            avatarKey = key;
        });
    }

    function syncMode(role) {
        if (role) $("mode").disabled = role !== "host";
        document.querySelectorAll("[data-mode]").forEach(button => {
            button.disabled = $("mode").disabled;
            button.setAttribute("aria-pressed", String(button.dataset.mode === $("mode").value));
        });
        $("modeDescription").textContent = $("mode").value === "4"
            ? "둘이 한 팀! 각자 아바타 말 2개씩, 함께 4개를 완주해요."
            : "내 아바타 말 4개로 상대와 겨뤄요.";
    }

    const savedName = String(window.CLASS_PLAYER_NAME || "").trim();
    lobby = ClassroomMultiplayerLobby.create({
        gameId:"yutnori", initialMode:"guest", maxPlayers:4, allowedPlayerCounts:[2,4],
        getPlayerName:() => savedName,
        canStart:({count}) => count === Number($("mode").value),
        getLobbyData:() => ({mode:$("mode").value}),
        onLobbyData:data => { if (["2","4"].includes(data?.mode)) $("mode").value = data.mode; syncMode(); },
        onStateChange:({role}) => syncMode(role),
        getLobbyPresentation:({role, canStart}) => ({
            canStart,
            guideText: role === "host" ? `이 모드는 ${$("mode").value}명이 모이면 시작해요.` : "방장이 시작하면 윷을 던질 수 있어요."
        }),
        rulesButtonIds:["rulesBtnLobby","rulesBtnGame"],
        leaveButtonIds:["leaveBtn"],
        onRules:showPractice,
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
    $("mode").onchange = () => { syncMode(); lobby.publishLobbyState(); };
    document.querySelectorAll("[data-mode]").forEach(button => {
        button.onclick = () => {
            if (lobby.snapshot().role !== "host") return;
            $("mode").value = button.dataset.mode;
            $("mode").onchange();
        };
    });
    $("throwBtn").onclick = () => submit("throw");
    $("moveBtn").onclick = () => submit("move");
    $("reloadBtn").onclick = () => location.reload();
    $("rematchBtn").onclick = () => { lobby.broadcast({type:"YUT_REMATCH"}); returnToLobby(); };
})();
