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

    function accept(state, action) {
        const phase = match.state.phase;
        const from = action.from === undefined ? null : $("cells").children[action.from]?.getBoundingClientRect();
        match.state = state;
        selected = null;
        pending = false;
        clearTimeout(selectionTimer);
        animation?.cancel();
        animation = null;
        render();

        const piece = $("cells").children[action.to]?.querySelector(".piece");
        if (reducedMotion.matches || !piece) {
            window.ClassGameSfx?.play(phase === "take" ? "capture" : "stone");
            return;
        }
        const to = piece.getBoundingClientRect();
        const frames = from ? [
            {transform:`translate(${from.left-to.left}px,${from.top-to.top}px)`},
            {transform:"translate(0,0)"}
        ] : [{transform:"translateY(-10px) scale(1.12)",opacity:.45},{transform:"none",opacity:1}];
        const movement = piece.animate(frames,{duration:from ? 280 : 180,easing:"ease-out"});
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
            render();
        },
        onGameMessage:(sender,data,{role}) => {
            if (role === "host" && data.type === "GONU_ACTION") apply(sender,data.action,data.revision);
            if (role !== "guest" || sender !== lobby.hostId || !match) return;
            if (data.type === "GONU_REMATCH" && match.state.winner !== null) returnToLobby();
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
