(() => {
    "use strict";

    const GAME_ID = "bomb77";
    const NAME_KEY = "classPlayerName";
    const SERVER_MESSAGE = Object.freeze({ STATE: "BOMB77_STATE", ERROR: "BOMB77_ERROR" });
    const CARD_NAMES = { reverse: "방향 전환", double: "×2 · 다음 사람 두 장" };
    const $ = id => document.getElementById(id);
    const params = new URLSearchParams(location.search);
    const previewName = params.get("name");
    const savedName = String(localStorage.getItem(NAME_KEY) || previewName || "").trim();

    const ROOM_KEY = "bomb77ActiveRoom";
    let savedRoom = null;
    try {
        const value = JSON.parse(sessionStorage.getItem(ROOM_KEY));
        if (/^\d{4}$/.test(value?.roomCode) && value.name === savedName) savedRoom = value;
    } catch (_) {}
    let restoringRoom = Boolean(savedRoom);
    function forgetRoom() { savedRoom = null; restoringRoom = false; try { sessionStorage.removeItem(ROOM_KEY); } catch (_) {} }
    let lobby = null;
    let gameState = null;
    let selectedCardId = null;
    let actionPending = false;
    let lastActionNumber = -1;
    let toastTimer = null;
    let audioContext = null;

    function myId() { return lobby?.snapshot().myId || "preview-me"; }
    function myTurn() { return gameState?.phase === "playing" && gameState.turnPlayerId === myId(); }
    function playerById(id) { return gameState?.players.find(player => player.id === id) || null; }

    function cardLabel(card) {
        if (!card) return "카드";
        if (card.kind === "number") return card.value === 0 ? "0 · 합계 유지" : `${card.value > 0 ? "+" : ""}${card.value}`;
        return CARD_NAMES[card.kind] || "장비";
    }

    function legalCard(card) { return !gameState.legalCardIds || gameState.legalCardIds.includes(card.id); }
    function projectedTotal(card) { return gameState.total + (card.kind === "number" ? card.value : 0); }
    function penaltyTotal(total) { return total >= 77 || (total > 0 && total % 11 === 0); }
    function nextPlayerAfter(card) {
        const index = gameState.players.findIndex(player => player.id === gameState.turnPlayerId);
        const direction = gameState.direction * (card.kind === "reverse" ? -1 : 1);
        for (let step = 1; step < gameState.players.length; step++) {
            const player = gameState.players[(index + direction * step + gameState.players.length) % gameState.players.length];
            if (!player.eliminated) return player;
        }
        return null;
    }

    function showToast(message) {
        clearTimeout(toastTimer);
        $("toast").textContent = message;
        $("toast").classList.remove("hidden");
        toastTimer = setTimeout(() => $("toast").classList.add("hidden"), 2600);
    }

    function tone(kind) {
        try {
            audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.connect(gain).connect(audioContext.destination);
            oscillator.type = kind === "explosion" ? "sawtooth" : "square";
            oscillator.frequency.setValueAtTime(kind === "explosion" ? 130 : 520, now);
            oscillator.frequency.exponentialRampToValueAtTime(kind === "explosion" ? 42 : 760, now + (kind === "explosion" ? .45 : .12));
            gain.gain.setValueAtTime(.0001, now);
            gain.gain.exponentialRampToValueAtTime(kind === "explosion" ? .16 : .045, now + .015);
            gain.gain.exponentialRampToValueAtTime(.0001, now + (kind === "explosion" ? .52 : .16));
            oscillator.start(now);
            oscillator.stop(now + (kind === "explosion" ? .55 : .18));
        } catch (_) {}
    }

    function renderPlayers() {
        const seats = gameState.players.map(player => {
            const seat = document.createElement("article");
            seat.className = "player-seat";
            seat.dataset.playerId = player.id;
            seat.classList.toggle("is-current", gameState.turnPlayerId === player.id);
            seat.classList.toggle("is-out", player.eliminated);
            seat.classList.toggle("is-swimming", player.swimming);
            seat.classList.toggle("is-hit", Boolean(gameState.lastEvent?.penalty && gameState.lastEvent.actorId === player.id));
            const top = document.createElement("div");
            top.className = "player-seat__top";
            const face = lobby?.playerAvatar(player.id);
            if (face) {
                const image = document.createElement("img");
                image.className = "mp-face";
                image.src = face;
                image.alt = "";
                top.append(image);
            }
            const name = document.createElement("span");
            name.className = "player-seat__name";
            name.textContent = `${player.name}${player.id === myId() ? " · 나" : ""}`;
            const status = document.createElement("span");
            status.className = "player-seat__turn";
            status.textContent = player.eliminated ? "탈락" : gameState.turnPlayerId === player.id ? (gameState.turnCardsRemaining === 2 ? "×2 차례" : "차례") : `${player.handCount}장`;
            top.append(name, status);
            const fuses = document.createElement("div");
            fuses.className = "player-seat__fuses";
            fuses.setAttribute("aria-label", player.swimming ? "칩 0개 · 마지막 기회" : `칩 ${player.fuses}개`);
            for (let index = 0; index < 3; index += 1) {
                const fuse = document.createElement("span");
                fuse.textContent = "●";
                fuse.classList.toggle("off", index >= player.fuses);
                fuses.append(fuse);
            }
            const life = document.createElement("small");
            life.textContent = player.eliminated ? "관전 중" : player.swimming ? "마지막 기회" : `칩 ${player.fuses}`;
            fuses.append(life);
            seat.append(top, fuses);
            return seat;
        });
        $("playerSeats").replaceChildren(...seats);
    }

    function renderTable() {
        const limit = gameState.limit || 77;
        const total = gameState.total || 0;
        const remaining = Math.max(0, limit - total);
        const danger = Math.max(0, Math.min(100, total / limit * 100));
        $("totalText").textContent = String(total);
        $("deckText").textContent = String(gameState.deckCount || 0);
        $("deckCount").textContent = String(gameState.deckCount || 0);
        $("dangerLabel").textContent = total >= limit ? "폭발!" : penaltyTotal(total) ? "벌칙 합계 · 유지해도 칩 −1" : `77까지 ${remaining}`;
        $("roundLabel").textContent = `${gameState.round}라운드`;
        $("directionLabel").textContent = `${gameState.direction === 1 ? "↻ 정방향" : "↺ 역방향"}${gameState.nextPlayerId ? ` · 다음 ${playerById(gameState.nextPlayerId)?.name || ""}` : ""}`;
        document.querySelectorAll("[data-penalty-total]").forEach(element => element.classList.toggle("is-active", Number(element.dataset.penaltyTotal) === total));
        $("dangerFill").style.setProperty("--danger", `${danger}%`);
        $("totalCore").classList.toggle("is-danger", remaining <= 15);
        $("totalCore").replaceChildren();
        const coreLabel = document.createElement("small");
        coreLabel.textContent = gameState.lastEvent ? `${gameState.lastEvent.before} → 현재 합계` : "현재 합계";
        const coreValue = document.createElement("strong");
        coreValue.textContent = String(total);
        const cardEffect = document.createElement("span");
        cardEffect.textContent = gameState.lastEvent?.penalty ? (gameState.lastEvent.eliminated ? "탈락!" : "칩 −1") : gameState.lastCard ? cardLabel(gameState.lastCard) : "첫 카드를 내세요";
        $("totalCore").append(coreLabel, coreValue, cardEffect);
        $("lastCard").replaceChildren(gameState.lastCard ? window.Bomb77Cards.createCard(gameState.lastCard) : document.createTextNode("-"));
        const current = playerById(gameState.turnPlayerId);
        const obligation = gameState.turnCardsRemaining === 2 ? " · 두 장 내기!" : gameState.turnCardsPlayed === 1 ? " · 한 장 더!" : "";
        $("turnBanner").textContent = gameState.phase === "playing"
            ? `${myTurn() ? "내 차례" : `${current?.name || "다음 플레이어"}님의 차례`}${obligation}`
            : gameState.phase === "roundEnd" ? "폭발! 다음 라운드를 준비합니다" : "마지막 생존자 결정!";
        $("turnBanner").classList.toggle("double-turn", Boolean(obligation));
        $("actionLog").textContent = gameState.lastAction || "서버 상태를 기다리고 있습니다.";
        renderTurnClock();
    }

    function renderTurnClock() {
        const clock = $("turnClock");
        if (gameState?.phase === "roundEnd") {
            const seconds = Math.max(0, Math.ceil((gameState.roundDeadline - Date.now()) / 1000));
            $("turnBanner").textContent = `폭발! ${seconds}초 뒤 새 카드로 ${gameState.round + 1}라운드`;
        }
        const deadline = gameState?.turnDeadline;
        if (gameState?.phase !== "playing" || !deadline) {
            clock.classList.add("hidden");
            return;
        }
        clock.classList.remove("hidden");
        const totalMs = (gameState.turnSeconds || 25) * 1000;
        const remainingMs = Math.max(0, deadline - Date.now());
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        $("turnSeconds").textContent = `${remainingSeconds}초`;
        $("turnTimerBar").style.width = `${Math.max(0, Math.min(100, remainingMs / totalMs * 100))}%`;
        clock.classList.toggle("urgent", remainingSeconds <= 5);
    }

    function selectCard(cardId) {
        if (!myTurn() || actionPending) return;
        selectedCardId = selectedCardId === cardId ? null : cardId;
        renderHand();
        renderControls();
        tone("select");
    }

    function renderHand() {
        const canAct = myTurn() && !actionPending;
        const buttons = gameState.hand.map(card => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "hand-option";
            button.dataset.cardId = card.id;
            button.classList.toggle("is-selected", selectedCardId === card.id);
            button.disabled = !canAct || !legalCard(card);
            button.setAttribute("aria-label", `${cardLabel(card)} 카드 선택${myTurn() && !legalCard(card) ? " · 첫 장에는 ×2 불가" : ""}`);
            if (myTurn() && !legalCard(card)) button.title = "×2를 받은 첫 장에는 사용할 수 없어요.";
            button.append(window.Bomb77Cards.createCard(card));
            button.addEventListener("click", () => selectCard(card.id));
            return button;
        });
        $("hand").replaceChildren(...buttons);
        $("handCount").textContent = `${gameState.hand.length}장`;
    }

    function renderControls() {
        const card = gameState?.hand.find(item => item.id === selectedCardId) || null;
        const canPlay = myTurn() && !actionPending && Boolean(card) && legalCard(card);
        $("playButton").disabled = !canPlay;
        $("playButton").textContent = actionPending ? "카드를 내는 중..." : card && canPlay ? `${cardLabel(card)} 내기` : myTurn() ? "카드를 선택하세요" : gameState.phase === "roundEnd" ? "새 손패를 준비합니다" : "차례를 기다리세요";
        const hint = $("selectionHint");
        hint.classList.remove("is-risk", "is-attack");
        if (!myTurn()) {
            hint.textContent = playerById(myId())?.eliminated ? "관전 중 · 마지막 생존자를 지켜보세요." : gameState.phase === "roundEnd" ? "남은 칩은 유지하고, 모두 새 카드 5장으로 시작합니다." : "11·22·33·44·55·66은 칩 −1 · 77 이상은 폭발";
        } else if (!card) {
            hint.textContent = gameState.turnCardsRemaining === 2 ? "×2 공격! 첫 장에는 ×2를 낼 수 없어요. 두 장을 모두 낸 뒤 보충합니다." : gameState.turnCardsPlayed === 1 ? "한 장 더! 이번에는 ×2로 다음 사람을 공격할 수도 있어요." : "카드를 골라 결과를 확인하세요. 어떤 합계를 넘길까요?";
        } else {
            const total = projectedTotal(card);
            const penalty = penaltyTotal(total);
            const next = nextPlayerAfter(card)?.name || "다음 사람";
            let effect = gameState.turnCardsRemaining === 2 ? "이어서 한 장 더 내기" : card.kind === "double" ? `${next}님에게 두 장 공격!` : card.kind === "reverse" ? `방향 반대 · ${next}님 차례` : `${next}님에게 넘기기`;
            if (penalty) effect = `${total >= 77 ? "폭발 · 라운드 종료" : "벌칙 합계"} · ${playerById(myId())?.swimming ? "내가 탈락합니다" : "내 칩 −1"}`;
            hint.textContent = `${gameState.total} → ${total} · ${effect}`;
            hint.classList.toggle("is-risk", penalty);
            hint.classList.toggle("is-attack", !penalty && card.kind === "double");
        }
    }

    function renderFinish() {
        const finished = gameState.phase === "finished";
        $("finishPanel").classList.toggle("hidden", !finished);
        $("hand").closest(".hand-zone").classList.toggle("hidden", finished);
        if (!finished) return;
        const winner = playerById(gameState.winnerId);
        $("winnerTitle").textContent = gameState.winnerId === myId() ? "끝까지 살아남았다!" : `${winner?.name || "생존자"} 승리`;
        $("winnerMessage").textContent = gameState.lastAction;
        const actions = [];
        if (lobby?.snapshot().role === "host") {
            const again = document.createElement("button");
            again.type = "button";
            again.className = "primary-button";
            again.textContent = "한 판 더";
            again.addEventListener("click", () => lobby.sendServer({ type: "BOMB77_ACTION", action: "NEW_GAME" }));
            const back = document.createElement("button");
            back.type = "button";
            back.className = "secondary-button";
            back.textContent = "대기실로";
            back.addEventListener("click", () => lobby.sendServer({ type: "BOMB77_ACTION", action: "RETURN_LOBBY" }));
            actions.push(again, back);
        } else {
            const waiting = document.createElement("span");
            waiting.textContent = "방장이 다음 게임을 준비할 때까지 기다려 주세요.";
            actions.push(waiting);
        }
        $("finishActions").replaceChildren(...actions);
    }

    function renderGame() {
        if (!gameState) return;
        renderPlayers();
        renderTable();
        renderHand();
        renderControls();
        renderFinish();
    }

    function installState(state) {
        const previous = gameState;
        // Clock-only snapshots must not replace cards in the middle of a move.
        const withoutClock = value => JSON.stringify(value, (key, item) => key === "turnDeadline" ? 0 : item);
        if(previous && withoutClock(previous) === withoutClock(state)) { gameState=state; renderTurnClock(); return; }
        const before = window.ClassGameMotion?.captureCards();
        const changed = state.actionNumber !== lastActionNumber;
        const exploded = changed && state.lastEvent?.exploded;
        gameState = state;
        actionPending = false;
        if (changed) {
            lastActionNumber = state.actionNumber;
            selectedCardId = null;
        }
        if (lobby) {
            lobby.players = Object.fromEntries(state.players.map(player => [player.id, { ...lobby.players[player.id], name: player.name }]));
            lobby.render();
        }
        if (state.phase === "lobby") {
            if (lobby?.snapshot().started) {
                $("gameScreen").classList.add("hidden");
                $("lobbyScreen").classList.remove("hidden");
                lobby.returnToLobby();
            }
            return;
        }
        if (lobby) lobby.started = true;
        $("lobbyScreen").classList.add("hidden");
        $("gameScreen").classList.remove("hidden");
        renderGame();
        if(before)window.ClassGameMotion.cards(previous,state,before,"lastCard","lastCard");
        if (exploded) {
            document.body.classList.remove("explosion-flash");
            requestAnimationFrame(() => document.body.classList.add("explosion-flash"));
            setTimeout(() => document.body.classList.remove("explosion-flash"), 620);
            tone("explosion");
        }
    }

    function handleServerMessage(message) {
        if (["ROOM_NOT_FOUND", "ROOM_CLOSED", "ERROR"].includes(message.type)) forgetRoom();
        if (message.type === SERVER_MESSAGE.STATE && message.state) {
            installState(message.state);
            return;
        }
        if (message.type === SERVER_MESSAGE.ERROR) {
            actionPending = false;
            renderHand();
            renderControls();
            showToast(message.message || "행동을 처리하지 못했습니다.");
        }
    }

    function submitPlay() {
        const card = gameState?.hand.find(item => item.id === selectedCardId);
        if (!card || !myTurn() || actionPending || !legalCard(card)) return;
        actionPending = true;
        renderControls();
        if (!lobby.sendServer({ type: "BOMB77_ACTION", action: "PLAY", cardId: card.id })) {
            actionPending = false;
            renderControls();
            showToast("서버에 행동을 보내지 못했습니다.");
        }
    }

    function showRules() { $("rulesOverlay").classList.remove("hidden"); }
    function hideRules() { $("rulesOverlay").classList.add("hidden"); }

    function previewState() {
        const now = Date.now();
        return {
            phase: "playing", round: 2, limit: 77, total: 43, direction: 1,
            turnPlayerId: "preview-me", deckCount: 31, winnerId: null,
            lastCard: { id: "preview-last", kind: "number", value: 8 },
            turnCardsRemaining: 1, turnCardsPlayed: 0, nextPlayerId: "preview-2",
            lastAction: "위험한 합계를 넘겨 상대의 선택지를 줄여 보세요.", lastActionKind: "number",
            turnDeadline: now + 24000, turnSeconds: 25, actionNumber: 1,
            players: [
                { id: "preview-me", name: "김하늘", fuses: 3, eliminated: false, handCount: 5 },
                { id: "preview-2", name: "이도윤", fuses: 2, eliminated: false, handCount: 5 },
                { id: "preview-3", name: "박서아", fuses: 3, eliminated: false, handCount: 5 },
                { id: "preview-4", name: "최지호", fuses: 1, eliminated: false, handCount: 5 }
            ],
            hand: [
                { id: "preview-4a", kind: "number", value: 4 },
                { id: "preview-76", kind: "number", value: 76 },
                { id: "preview-minus", kind: "number", value: -10 },
                { id: "preview-double", kind: "double", value: null },
                { id: "preview-reverse", kind: "reverse", value: null }
            ]
        };
    }

    function init() {
        setInterval(renderTurnClock, 250);
        window.addEventListener("sitebackrequest", forgetRoom);
        $("playButton").addEventListener("click", submitPlay);
        $("closeRulesButton").addEventListener("click", hideRules);
        $("rulesOverlay").addEventListener("click", event => { if (event.target === $("rulesOverlay")) hideRules(); });
        $("reloadButton").addEventListener("click", () => location.reload());
        document.querySelectorAll("[data-go-home]").forEach(button => button.addEventListener("click", () => { forgetRoom(); location.href = "../../../index.html"; }));

        if (params.get("preview") === "1") {
            installState(previewState());
            return;
        }

        lobby = window.ClassroomMultiplayerLobby.create({
            gameId: GAME_ID,
            initialMode: savedRoom?.role === "host" ? "host" : "guest",
            keepRoomOnReload: "all",
            getPreferredRoomCode: () => savedRoom?.roomCode || "",
            getRoomRequestData: () => {
                const resumeOnly = restoringRoom;
                restoringRoom = false;
                return resumeOnly ? { resumeOnly: true } : {};
            },
            getPlayerName: () => /^[가-힣]{2,6}$/.test(savedName) ? savedName : "",
            allowedPlayerCounts: [2,3,4,5,6,7,8],
            maxPlayers: 8,
            rulesButtonIds: ["rulesBtnLobby", "rulesBtnGame"],
            leaveButtonIds: ["leaveBtnLobby", "leaveBtnGame"],
            onRules: showRules,
            onLeave: () => { forgetRoom(); location.href = "../../../index.html"; },
            onNotice: showToast,
            onInvalidStart: () => showToast("2명부터 8명까지 모여야 시작할 수 있습니다."),
            onStateChange: snapshot => {
                $("gameRoomCode").textContent = snapshot.roomCode || "----";
                if (snapshot.connected) {
                    restoringRoom = false;
                    try { sessionStorage.setItem(ROOM_KEY, JSON.stringify({ roomCode: snapshot.roomCode, role: snapshot.role, name: savedName })); } catch (_) {}
                }
            },
            getLobbyPresentation: ({ count, role, canStart }) => ({
                canStart,
                startText: role === "host" && canStart ? `작전 시작 · ${count}명` : "플레이어 기다리는 중",
                guideText: role === "host" ? `현재 ${count}명 · 2~8명일 때 시작 가능` : "방장이 게임을 시작할 때까지 기다리세요."
            }),
            createStartData: () => ({ serverAuthoritative: true }),
            onStarted: () => {
                $("lobbyScreen").classList.add("hidden");
                $("gameScreen").classList.remove("hidden");
                if (lobby.snapshot().role === "host") lobby.sendServer({ type: "BOMB77_ACTION", action: "START" });
            },
            onServerMessage: handleServerMessage,
            onPlayerLeftDuringGame: () => showToast("플레이어가 나가 대기실로 돌아갑니다."),
            onAbort: ({ title, message }) => {
                forgetRoom();
                $("abortTitle").textContent = title;
                $("abortMessage").textContent = message;
                $("abortOverlay").classList.remove("hidden");
            }
        }).mount();
        if (savedRoom?.role === "guest") {
            $("joinCode").value = savedRoom.roomCode;
            lobby.joinRoom();
        }
    }

    window.addEventListener("DOMContentLoaded", init);
})();
