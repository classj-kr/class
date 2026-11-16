(() => {
    "use strict";

    const {boards, initial, legal, play} = window.GonuRules;
    const $ = id => document.getElementById(id);
    const namespace = "http://www.w3.org/2000/svg";
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const team = ["", "team-one", "team-two"];
    const name = String(window.CLASS_PLAYER_NAME || "").trim();
    let variant = "well";
    let lobby, match = null, selected = null, pending = false;
    let selectionTimer, animation = null;
    // 한 수의 시간. 말이 적은 우물·호박고누는 10초, 놓을 자리와 잡을 말을 따지는 참고누는 20초. 넘기면 진다.
    const TURN_SECONDS = {well:10, pumpkin:10, cham:20};
    let deadline = null, lastTick = "";

    function svg(tag, attributes) {
        const node = document.createElementNS(namespace, tag);
        for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
        return node;
    }

    function drawLines(board) {
        $("lines").replaceChildren(...board.edges.map(([from,to], index) => {
            const [[x1,y1],[x2,y2]] = [board.points[from],board.points[to]];
            if (index < (board.arcs || 0)) {
                return svg("path", {d:`M ${x1} ${y1} A 32 32 0 0 1 ${x2} ${y2}`});
            }
            return svg("line", {x1,y1,x2,y2});
        }));
    }

    function avatar(player) {
        const url = ClassroomMultiplayerLobby.avatarUrl(player.avatarKey);
        const image = document.createElement("img");
        image.alt = "";
        if (url) image.src = url;
        return url ? image : document.createTextNode(player.name.slice(0,1));
    }

    function syncChoice(snapshot) {
        const joined = snapshot.connected || snapshot.role === "host";
        $("gameChoice").hidden = !joined;
        $("gameChoice").disabled = snapshot.role !== "host";
        for (const button of $("variants").children) {
            button.setAttribute("aria-pressed", String(button.dataset.variant === variant));
        }
    }

    function showRules() {
        const board = boards[match?.state.kind || variant];
        $("ruleTitle").textContent = board.name;
        $("ruleText").textContent = board.rule;
        $("ruleTime").textContent = `한 수를 ${TURN_SECONDS[match?.state.kind || variant]}초 안에 두지 못하면 져요. 남은 시간이 5초가 되면 째깍 소리가 나요.`;
        $("help").showModal();
    }

    for (const [key, board] of Object.entries(boards)) {
        const button = document.createElement("button");
        const title = document.createElement("strong");
        const text = document.createElement("span");
        button.type = "button";
        button.dataset.variant = key;
        title.textContent = board.name;
        text.textContent = board.description;
        button.append(title, text);
        button.onclick = () => {
            const snapshot = lobby.snapshot();
            if (snapshot.role !== "host" || snapshot.started) return;
            variant = key;
            syncChoice(snapshot);
            lobby.publishLobbyState();
        };
        $("variants").append(button);
    }

    function render() {
        const {state, people} = match;
        const current = people[state.turn - 1];
        const mine = current.id === lobby.myId;
        const myTurn = mine && state.winner === null && !pending && !animation;
        const moves = legal(state);
        const destinations = new Set(moves.filter(move => move.from === (selected ?? undefined)).map(move => move.to));
        const sources = new Set(moves.map(move => move.from));
        $("status").textContent = state.winner === 0 ? "같은 판이 반복되어 비겼어요." :
            state.timedOut ? `${people[state.timedOut - 1].name}님이 ${TURN_SECONDS[state.kind]}초 안에 두지 못해 ${people[state.winner - 1].name}님이 이겼어요!` :
            state.winner ? `${people[state.winner - 1].name}님이 이겼어요!` :
            animation ? "말이 움직이는 중이에요." :
            !mine ? `${current.name}님 차례예요.` :
            state.phase === "take" ? "세 말을 이었어요. 잡을 상대 말을 고르세요." :
            state.phase === "place" ? `빈 점에 말을 놓으세요. 남은 말 ${state.reserves[state.turn]}개` :
            selected === null ? "움직일 내 말을 고르세요." : "표시된 점에 말을 옮기세요.";
        $("rematch").classList.toggle("hidden",state.winner === null || lobby.role !== "host");
        for (const element of $("players").children) element.classList.toggle("active",element.dataset.id === current.id && state.winner === null);
        $("cells").replaceChildren(...boards[state.kind].points.map(([x,y],index) => {
            const cell = document.createElement("button");
            const owner = state.board[index];
            const available = myTurn && destinations.has(index);
            cell.type = "button";
            cell.dataset.point = index;
            cell.className = "cell";
            cell.style.setProperty("--x",`${x}%`);
            cell.style.setProperty("--y",`${y}%`);
            cell.disabled = !(available || (myTurn && state.phase === "move" && sources.has(index)));
            cell.classList.toggle("selected",index === selected);
            cell.classList.toggle("legal",available);
            cell.classList.toggle("blocked",state.blocked.includes(index));
            cell.setAttribute("aria-label",`${index + 1}번 점 · ${owner ? people[owner-1].name+"의 말" : state.blocked.includes(index) ? "막힌 점" : "빈 점"}${available ? " · 선택 가능" : ""}`);
            if (owner) {
                const piece = document.createElement("span");
                piece.className = "piece "+team[owner];
                piece.setAttribute("aria-hidden","true");
                piece.append(avatar(people[owner-1]));
                cell.append(piece);
            }
            cell.onclick = () => {
                if (available) submit(moves.find(move => move.from === (selected ?? undefined) && move.to === index));
                else { selected = selected === index ? null : index; render(); $("cells").children[index].focus(); }
            };
            return cell;
        }));
    }

    // 두 점 사이 길을 따라 찍은 점들(말판 % 좌표). 곡선(원호) 길이면 원을 따라, 아니면 곧게.
    function routeBetween(kind, from, to, steps) {
        const board = boards[kind];
        const [x0,y0] = board.points[from], [x1,y1] = board.points[to];
        const arcIndex = board.edges.findIndex(([a,b]) => (a === from && b === to) || (a === to && b === from));
        const onArc = arcIndex >= 0 && arcIndex < (board.arcs || 0);
        const start = Math.atan2(y0 - 50, x0 - 50), radius = Math.hypot(x0 - 50, y0 - 50);
        let turn = Math.atan2(y1 - 50, x1 - 50) - start;
        if (turn > Math.PI) turn -= 2 * Math.PI;
        if (turn <= -Math.PI) turn += 2 * Math.PI;
        return Array.from({length:steps + 1}, (_, i) => {
            const t = i / steps;
            return onArc ? [50 + radius * Math.cos(start + turn * t), 50 + radius * Math.sin(start + turn * t), t]
                : [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, t];
        });
    }

    function startClock() {
        deadline = match && match.state.winner === null ? performance.now() + TURN_SECONDS[match.state.kind] * 1000 : null;
        lastTick = "";
    }

    function endByTimeout(loser) {
        animation?.cancel();
        animation = null;
        clearTimeout(selectionTimer);
        match.state = {...match.state, winner:3 - loser, timedOut:loser, revision:match.state.revision + 1};
        selected = null;
        pending = false;
        deadline = null;
        render();
        tickClock();
        window.ClassGameSfx?.play("timeout");
    }

    // 시간은 방장 화면이 잰다. 넘기면 방장이 알리고 모두 같은 결과로 끝낸다.
    function timeout() {
        const state = match.state;
        if (state.winner !== null) return;
        lobby.broadcast({type:"GONU_TIMEOUT", revision:state.revision, loser:state.turn});
        endByTimeout(state.turn);
    }

    function tickClock() {
        const box = $("turnClockBox");
        if (!match || match.state.winner !== null || deadline === null) {
            box.classList.add("hidden");
            box.classList.remove("urgent");
            return;
        }
        const total = TURN_SECONDS[match.state.kind] * 1000;
        const remaining = Math.max(0, deadline - performance.now());
        const seconds = Math.ceil(remaining / 1000);
        const current = match.people[match.state.turn - 1];
        const mine = current.id === lobby.myId;
        const text = `${mine ? "내" : current.name + "님"} 차례 · ${seconds}초`;
        box.classList.remove("hidden");
        if ($("gonuClock").textContent !== text) $("gonuClock").textContent = text;
        $("gonuClockBar").style.transform = `scaleX(${remaining / total})`;
        const urgent = seconds > 0 && seconds <= 5;
        box.classList.toggle("urgent", urgent);
        const key = `${match.state.revision}:${seconds}`;
        if (urgent && mine && key !== lastTick && !$("help").open) window.ClassGameSfx?.play("tick");
        lastTick = key;
        if (remaining <= 0 && lobby.role === "host") timeout();
    }
    setInterval(tickClock, 100);

    function accept(state, action) {
        const phase = match.state.phase;
        const from = action.from === undefined ? null : $("cells").children[action.from]?.getBoundingClientRect();
        match.state = state;
        selected = null;
        pending = false;
        clearTimeout(selectionTimer);
        animation?.cancel();
        animation = null;
        startClock();
        render();

        const piece = $("cells").children[action.to]?.querySelector(".piece");
        if (reducedMotion.matches || !piece) {
            window.ClassGameSfx?.play(phase === "take" ? "capture" : "stone");
            return;
        }
        const area = $("cells").getBoundingClientRect();
        const [tx,ty] = boards[state.kind].points[action.to];
        const route = from ? routeBetween(state.kind, action.from, action.to, 16) : null;
        const onArc = route && Math.abs(route[8][0] - (route[0][0] + route[16][0]) / 2) + Math.abs(route[8][1] - (route[0][1] + route[16][1]) / 2) > 1;
        const frames = route ? route.map(([x,y,t]) => ({
            transform:`translate(${(x - tx) / 100 * area.width}px,${(y - ty) / 100 * area.height}px) scale(${1 + 0.14 * Math.sin(Math.PI * t)})`
        })) : [{transform:"translateY(-10px) scale(1.12)",opacity:.45},{transform:"none",opacity:1}];
        piece.parentElement.style.zIndex = "3";
        const movement = piece.animate(frames,{duration:route ? (onArc ? 420 : 320) : 180,easing:"ease-in-out"});
        animation = movement;
        for (const cell of $("cells").children) cell.disabled = true;
        $("status").textContent = "말이 움직이는 중이에요.";
        movement.onfinish = () => {
            if (animation !== movement) return;
            animation = null;
            window.ClassGameSfx?.play("stone");
            render();
        };
    }

    function apply(sender, action, revision) {
        if (!match || revision !== match.state.revision || sender !== match.people[match.state.turn-1].id) return;
        const next = play(match.state, action);
        if (!next) return;
        lobby.broadcast({type:"GONU_MOVE", action, revision, sender});
        accept(next,action);
    }

    function submit(action) {
        const revision = match.state.revision;
        if (lobby.role === "host") {
            apply(lobby.myId,action,revision);
        } else if (lobby.send({type:"GONU_ACTION", action, revision})) {
            pending = true;
            render();
            selectionTimer = setTimeout(() => { pending = false; if (match) render(); }, 1800);
        }
    }

    function returnToLobby() {
        clearTimeout(selectionTimer);
        animation?.cancel();
        animation = null;
        match = null;
        deadline = null;
        selected = null;
        pending = false;
        $("gameScreen").classList.add("hidden");
        $("lobbyScreen").classList.remove("hidden");
        lobby.returnToLobby();
    }

    lobby = ClassroomMultiplayerLobby.create({
        gameId:"gonu", initialMode:"guest", minPlayers:2, maxPlayers:2,
        getPlayerName:() => /^[가-힣]{2,6}$/.test(name) ? name : "",
        getLobbyData:() => ({variant}),
        onLobbyData:(data,snapshot) => {
            if (Object.hasOwn(boards,data?.variant)) variant = data.variant;
            syncChoice(snapshot || lobby.snapshot());
        },
        onStateChange:syncChoice,
        getLobbyPresentation:({role,canStart}) => ({
            canStart,
            guideText:role === "host" ? "종류를 고르고 두 명이 모이면 시작하세요." : "방장이 종류를 고르고 시작해요."
        }),
        rulesButtonIds:["rulesBtnLobby","rulesBtnGame"], onRules:showRules, preserveRulesUi:true,
        createStartData:({players,myId}) => ({
            kind:variant, order:[myId,...Object.keys(players).filter(id => id !== myId)]
        }),
        onStarted:({data,players}) => {
            match = {state:initial(data.kind),people:data.order.map(id => ({...players[id],id}))};
            $("variantName").textContent = boards[data.kind].name;
            $("players").replaceChildren(...match.people.map((person,index) => {
                const row = document.createElement("div");
                row.className = "player "+team[index+1];
                row.dataset.id = person.id;
                row.append(avatar(person),document.createTextNode(person.name+(person.id === lobby.myId ? " (나)" : "")));
                return row;
            }));
            drawLines(boards[data.kind]);
            $("lobbyScreen").classList.add("hidden");
            $("gameScreen").classList.remove("hidden");
            startClock();
            render();
        },
        onGameMessage:(sender,data,{role}) => {
            if (role === "host" && data.type === "GONU_ACTION") apply(sender,data.action,data.revision);
            if (role !== "guest" || sender !== lobby.hostId || !match) return;
            if (data.type === "GONU_REMATCH" && match.state.winner !== null) returnToLobby();
            if (data.type === "GONU_TIMEOUT" && data.revision === match.state.revision &&
                match.state.winner === null && data.loser === match.state.turn) endByTimeout(data.loser);
            if (data.type !== "GONU_MOVE" || data.revision !== match.state.revision ||
                data.sender !== match.people[match.state.turn-1].id) return;
            const next = play(match.state,data.action);
            if (next) accept(next,data.action);
        },
        onAbort:({message}) => {
            $("notice").textContent = message;
            if (!$("disconnect").open) $("disconnect").showModal();
        }
    });
    lobby.mount();

    $("rematch").onclick = () => {
        if (lobby.role !== "host" || !match || match.state.winner === null) return;
        lobby.broadcast({type:"GONU_REMATCH"});
        returnToLobby();
    };
})();
