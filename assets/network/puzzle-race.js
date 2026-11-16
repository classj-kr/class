/* 개인 퍼즐 순위전: 혼자 푸는 퍼즐에 「순위전」 단추를 달아, 방에 모인 사람이 같은 판을 동시에 풀고 순위를 겨룬다.
 *
 * 게임 쪽이 할 일
 *   const race = ClassroomPuzzleRace.create({
 *     gameId: 'sachunseong',            // 서버 방 이름(server.js MAX_ROOM_PLAYERS·MULTIPLAYER_CONTENT_PATHS에 등록)
 *     title: 'SHISEN-SHO',
 *     settings: [{ key, label, options: [{ value, label }] }],   // 방장이 대기실에서 고른다
 *     getSettings: () => ({ ... }),      // 대기실을 열 때 처음 고른 값(혼자 하기 화면의 값)
 *     createPuzzle: settings => data,    // 방장 화면에서 한 번 만들어 모두에게 보낸다
 *     start: (data, settings) => {},     // 모든 화면에서 판을 띄운다(셋·둘·하나 뒤)
 *     exit: () => {},                    // 순위전을 그만두고 혼자 하기 시작 화면으로
 *     standingsHost: () => element       // 경기 중 순위표를 넣을 자리
 *   });
 *   race.open();                          // 「순위전」 단추
 *   race.progress(done, total);           // 판을 풀 때마다
 *   race.finish(seconds);                 // 다 풀었을 때
 *   race.active                           // 순위전 경기 중이면 true(혼자 하기 기록·명단에 올리지 않는다)
 */
(() => {
    "use strict";

    const MSG = Object.freeze({ PROGRESS: "PR_PROGRESS", FINISH: "PR_FINISH", STANDINGS: "PR_STANDINGS", AGAIN: "PR_AGAIN" });
    const COUNTDOWN = 3;

    const script = document.currentScript;
    function ensureStyle() {
        if (document.querySelector("link[data-puzzle-race-style]")) return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.dataset.puzzleRaceStyle = "true";
        link.href = new URL("puzzle-race.css?v=20261117-3", script?.src || location.href).href;
        document.head.appendChild(link);
    }

    function el(tag, attrs = {}, children = []) {
        const node = document.createElement(tag);
        Object.entries(attrs).forEach(([key, value]) => {
            if (value == null) return;
            if (key === "class") node.className = value;
            else if (key === "text") node.textContent = value;
            else node.setAttribute(key, value);
        });
        children.forEach(child => node.append(child));
        return node;
    }

    const formatTime = seconds => {
        const s = Math.max(0, Math.round(seconds));
        return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    };

    function create(options) {
        ensureStyle();
        const playerName = () => {
            const name = String(window.CLASS_PLAYER_NAME || "").replace(/[^가-힣]/g, "").slice(0, 6);
            return /^[가-힣]{2,6}$/.test(name) ? name : "";
        };

        let lobby = null;
        let root = null;
        let overlay = null;
        let settings = {};
        let racers = {};          // id → { name, avatarKey, done, total, time, left }
        let finishOrder = [];
        let racing = false;
        let iFinished = false;
        let countdownTimer = null;

        const settingsKey = () => options.settings.map(item => item.key);

        /* ---------- 대기실 ---------- */
        function buildLobby() {
            const id = name => `pr-${name}`;
            const title = el("h1", { text: options.title });
            const nameLine = el("p", {}, ["PLAYER · ", el("strong", { id: id("savedName") })]);
            const tabs = el("div", { class: "mp-lobby-tabs" }, [
                el("button", { id: id("hostTab"), class: "primary", type: "button" }),
                el("button", { id: id("joinTab"), class: "secondary", type: "button" })
            ]);
            const hostPane = el("section", { id: id("hostPane"), class: "panel mp-lobby-card hidden" }, [
                el("div", { class: "row spread" }, [el("div", {}, [
                    el("div", { class: "eyebrow", text: "방 번호" }),
                    el("div", { id: id("roomCode"), class: "code", text: "----" })
                ])]),
                el("div", { id: id("hostStatus"), class: "mp-lobby-status" })
            ]);
            const joinPane = el("section", { id: id("joinPane"), class: "panel mp-lobby-card hidden" }, [
                el("div", { class: "mp-lobby-row" }, [
                    el("input", { id: id("joinCode"), class: "mp-lobby-code-input", inputmode: "numeric", maxlength: "4" }),
                    el("button", { id: id("joinBtn"), class: "primary", type: "button" })
                ]),
                el("div", { id: id("joinStatus"), class: "mp-lobby-status" })
            ]);
            const settingBox = el("div", { class: "pr-settings", id: id("settings") });
            const players = el("section", { class: "panel" }, [
                settingBox,
                el("div", { id: id("lobbyPlayers"), class: "mp-lobby-players" }),
                el("p", { id: id("lobbyGuide"), class: "mp-lobby-guide" }),
                el("button", { id: id("startBtn"), class: "primary", type: "button", disabled: "" }),
                el("div", { class: "row pr-lobby-actions" }, [
                    el("button", { id: id("leaveBtn"), class: "secondary", type: "button", text: "혼자 하기" })
                ])
            ]);
            root = el("section", { class: "pr-lobby hidden mp-lobby-compact mp-lobby-standard", "data-multiplayer-lobby": "" },
                [el("header", { class: "panel" }, [title, nameLine, tabs]), hostPane, joinPane, players]);
            // 대기실 판은 내용만큼의 크기로 화면 가운데에 띄우고, 뒤(혼자 하기 화면)는 어둡게 덮는다.
            document.body.append(el("div", { class: "pr-shade" }, [root]));
            return {
                lobbyScreen: root.id = id("lobby"), savedName: id("savedName"), hostTab: id("hostTab"), joinTab: id("joinTab"),
                hostPane: id("hostPane"), joinPane: id("joinPane"), roomCode: id("roomCode"), hostStatus: id("hostStatus"),
                joinCode: id("joinCode"), joinButton: id("joinBtn"), joinStatus: id("joinStatus"),
                playerList: id("lobbyPlayers"), guide: id("lobbyGuide"), startButton: id("startBtn"), missingScreen: null
            };
        }

        function renderSettings() {
            const box = document.getElementById("pr-settings");
            if (!box) return;
            const isHost = lobby?.snapshot().role === "host";
            box.replaceChildren(...options.settings.map(item => {
                const value = settings[item.key];
                if (!isHost) {
                    const chosen = item.options.find(option => String(option.value) === String(value));
                    return el("div", { class: "pr-setting" }, [el("span", { text: item.label }), el("strong", { text: chosen?.label || "" })]);
                }
                const select = el("select", { "aria-label": item.label });
                item.options.forEach(option => {
                    const node = el("option", { value: String(option.value), text: option.label });
                    if (String(option.value) === String(value)) node.selected = true;
                    select.append(node);
                });
                select.addEventListener("change", () => {
                    const chosen = item.options.find(option => String(option.value) === select.value);
                    settings = { ...settings, [item.key]: chosen ? chosen.value : select.value };
                    lobby.publishLobbyState();
                });
                return el("label", { class: "pr-setting" }, [el("span", { text: item.label }), select]);
            }));
        }

        function cleanSettings(raw) {
            const next = {};
            options.settings.forEach(item => {
                const found = item.options.find(option => String(option.value) === String(raw?.[item.key]));
                next[item.key] = (found || item.options[0]).value;
            });
            return next;
        }

        function open() {
            if (!playerName()) return;
            settings = cleanSettings(options.getSettings?.() || {});
            quietOwnMusic();
            ensureRaceMusic();
            if (!root) {
                const ids = buildLobby();
                window.addEventListener("sitebackrequest", onSiteBack);
                lobby = window.ClassroomMultiplayerLobby.create({
                    gameId: options.gameId,
                    ids,
                    initialMode: "guest",
                    getPlayerName: playerName,
                    allowedPlayerCounts: Array.from({ length: (options.maxPlayers || 8) - 1 }, (_, i) => i + 2),
                    maxPlayers: options.maxPlayers || 8,
                    leaveButtonIds: ["pr-leaveBtn"],
                    onLeave: () => leave(false),
                    onNotice: message => toast(message),
                    onStateChange: snapshot => {
                        renderSettings();
                        if (!racing && root && !root.classList.contains("hidden")) music("lobby", snapshot.role);
                    },
                    getLobbyData: () => ({ settings }),
                    onLobbyData: data => { settings = cleanSettings(data?.settings); renderSettings(); },
                    getLobbyPresentation: ({ count, role, canStart }) => ({
                        canStart,
                        guideText: role !== "host" ? "방장이 시작할 때까지 기다리세요."
                            : count < 2 ? "같이 겨룰 사람이 방 번호로 들어오면 시작할 수 있습니다." : `${count}명이 같은 판을 풉니다.`
                    }),
                    createStartData: () => ({ settings, puzzle: options.createPuzzle(settings) }),
                    onStarted: ({ data, players }) => begin(data, players),
                    onGameMessage: handleMessage,
                    onPlayerLeftDuringGame: ({ playerId }) => markLeft(playerId),
                    onAbort: ({ title, message }) => { stopRace(); showNotice(title, message); }
                });
                // 대기실 장치가 뒤로가기를 메인 화면으로 보내지 않게, 장치보다 먼저 받은 위 처리기가 막는다.
                lobby.mount();
            } else {
                root.classList.remove("hidden");
                lobby.setMode("guest");
            }
            options.hideSolo?.();
            document.body.classList.add("pr-in-lobby");
            renderSettings();
        }

        // 학습 앱 순위전과 같은 음악(race-music.js): 대기실·결과는 대기실 곡, 경기 중에는 경기 곡. 방장 기기에서만 기본으로 들린다.
        let pendingMusic = null;
        function music(kind, role = lobby?.snapshot().role) {
            pendingMusic = [kind, { host: role !== "guest" }];
            window.RaceMusic?.set(...pendingMusic);
        }

        // 혼자 하기 화면의 원래 배경 음악(#bgm)은 공용 스피커가 잡고 있다. 그래서 순위전 음악 장치는
        // 처음부터 같이 부르지 않고(스피커가 그쪽으로 넘어가 원래 음악 조절이 깨진다) 순위전 단추를 누를 때 부른다.
        // 스피커의 음량·음소거 바뀜(classmusicchange)은 순위전 음악에 그대로 넘겨준다.
        let raceMusicLoading = null;
        function ensureRaceMusic() {
            if (window.RaceMusic) return Promise.resolve();
            if (raceMusicLoading) return raceMusicLoading;
            raceMusicLoading = new Promise(resolve => {
                const tag = document.createElement("script");
                tag.src = "/assets/sound/race-music.js?v=20261106-1";
                tag.onload = tag.onerror = () => resolve();
                document.head.append(tag);
            }).then(() => {
                window.addEventListener("classmusicchange", event => {
                    const detail = event.detail || {};
                    window.ClassMusicController?.setVolume?.(Number(detail.volume) || 0);
                    window.ClassMusicController?.setMuted?.(Boolean(detail.muted));
                });
                if (pendingMusic) window.RaceMusic?.set(...pendingMusic);
            });
            return raceMusicLoading;
        }

        const ownMusic = () => document.getElementById("bgm");
        let ownMusicWasPlaying = false;
        const keepOwnMusicQuiet = () => { if (inRace()) ownMusic()?.pause(); };
        function inRace() { return !!root; }
        function quietOwnMusic() {
            const bgm = ownMusic();
            if (!bgm) return;
            ownMusicWasPlaying = ownMusicWasPlaying || !bgm.paused;
            bgm.pause();
            // 공용 스피커가 다시 틀지 않게 막고, 게임 코드가 직접 틀어도 곧바로 멈춘다.
            document.body.dataset.musicPausedForReading = "true";
            bgm.addEventListener("play", keepOwnMusicQuiet);
        }
        function restoreOwnMusic() {
            const bgm = ownMusic();
            window.RaceMusic?.set(null);
            pendingMusic = null;
            if (!bgm) return;
            bgm.removeEventListener("play", keepOwnMusicQuiet);
            delete document.body.dataset.musicPausedForReading;
            if (ownMusicWasPlaying) bgm.play().catch(() => {});
            ownMusicWasPlaying = false;
        }

        function onSiteBack(event) {
            if (!root || root.classList.contains("hidden") && !racing && !overlay) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            // 한 단계 뒤 = 방을 나가 혼자 하기 시작 화면. 경기 중이면 다른 사람 경주로에는 「나감」으로 남는다.
            leave(false);
        }

        /* ---------- 경기 ---------- */
        function begin(data, players) {
            settings = cleanSettings(data?.settings);
            racers = {};
            Object.entries(players || {}).forEach(([id, player]) => {
                racers[id] = { name: player.name, avatarKey: player.avatarKey || "", done: 0, total: 1, time: null, left: false };
            });
            finishOrder = [];
            iFinished = false;
            racing = true;
            root.classList.add("hidden");
            document.body.classList.remove("pr-in-lobby");
            document.body.classList.add("pr-racing");
            closeOverlay();
            music("race");
            options.start(data.puzzle, settings);
            renderStandings();
            countdown();
        }

        function countdown() {
            const layer = el("div", { class: "pr-countdown", "aria-live": "assertive" });
            document.body.append(layer);
            options.pause?.(true);
            let n = COUNTDOWN;
            const tick = () => {
                if (n === 0) {
                    layer.remove();
                    countdownTimer = null;
                    options.pause?.(false);
                    return;
                }
                layer.replaceChildren(el("span", { text: String(n) }));
                n -= 1;
                countdownTimer = setTimeout(tick, 800);
            };
            tick();
        }

        function me() { return lobby?.snapshot().myId; }
        function isHost() { return lobby?.snapshot().role === "host"; }

        function progress(done, total) {
            if (!racing || iFinished) return;
            const mine = racers[me()];
            if (mine && mine.done === done && mine.total === Math.max(1, Number(total) || 1)) return; // 바뀐 것이 없으면 보내지 않는다
            applyProgress(me(), done, total);
            if (isHost()) broadcastStandings();
            else lobby.send({ type: MSG.PROGRESS, done, total });
            renderStandings();
        }

        function finish(seconds) {
            if (!racing || iFinished) return;
            iFinished = true;
            applyFinish(me(), seconds);
            if (isHost()) broadcastStandings();
            else lobby.send({ type: MSG.FINISH, time: seconds });
            renderStandings();
            checkAllDone();
        }

        function applyProgress(id, done, total) {
            const racer = racers[id];
            if (!racer || racer.time != null) return;
            racer.total = Math.max(1, Number(total) || 1);
            racer.done = Math.min(racer.total, Math.max(0, Number(done) || 0));
        }

        function applyFinish(id, seconds) {
            const racer = racers[id];
            if (!racer || racer.time != null) return;
            racer.done = racer.total;
            racer.time = Math.max(0, Number(seconds) || 0);
            finishOrder.push(id);
        }

        function markLeft(id) {
            if (racers[id]) racers[id].left = true;
            broadcastStandings();
            renderStandings();
            checkAllDone();
        }

        function broadcastStandings() {
            if (!isHost()) return;
            lobby.broadcast({ type: MSG.STANDINGS, racers, finishOrder });
        }

        function handleMessage(senderId, payload) {
            if (!payload || !racing && payload.type !== MSG.AGAIN) return;
            if (payload.type === MSG.PROGRESS && isHost()) {
                applyProgress(senderId, payload.done, payload.total);
                broadcastStandings();
                renderStandings();
            } else if (payload.type === MSG.FINISH && isHost()) {
                applyFinish(senderId, payload.time);
                broadcastStandings();
                renderStandings();
                checkAllDone();
            } else if (payload.type === MSG.STANDINGS && !isHost()) {
                const mine = racers[me()];
                racers = payload.racers || racers;
                // 내 진행은 내 화면 것이 가장 새것이다.
                if (mine && racers[me()] && mine.time == null) racers[me()] = { ...racers[me()], done: Math.max(mine.done, racers[me()].done) };
                finishOrder = payload.finishOrder || finishOrder;
                renderStandings();
                checkAllDone();
            } else if (payload.type === MSG.AGAIN && !isHost()) {
                backToLobby(true);
            }
        }

        function ranked() {
            return Object.entries(racers).sort(([a, x], [b, y]) => {
                const fa = finishOrder.indexOf(a), fb = finishOrder.indexOf(b);
                if (fa >= 0 || fb >= 0) return (fa < 0 ? 1e9 : fa) - (fb < 0 ? 1e9 : fb);
                if (x.left !== y.left) return x.left ? 1 : -1;
                return y.done / y.total - x.done / x.total;
            });
        }

        function renderStandings() {
            const host = typeof options.standingsHost === "function" ? options.standingsHost() : options.standingsHost;
            if (!host) return;
            let board = host.querySelector(".pr-standings");
            if (!board) {
                board = el("ol", { class: "pr-standings", "aria-label": "순위" });
                host.append(board);
            }
            host.hidden = false;
            const rows = ranked();
            const existing = new Map([...board.children].map(node => [node.dataset.id, node]));
            rows.forEach(([id, racer], index) => {
                let row = existing.get(id);
                if (!row) {
                    row = el("li", { class: "pr-runner" });
                    row.dataset.id = id;
                    const track = el("div", { class: "pr-track" }, [el("span", { class: "pr-fill" }), el("span", { class: "pr-walker" })]);
                    row.append(el("span", { class: "pr-rank" }), el("span", { class: "pr-name" }), track, el("span", { class: "pr-mark" }));
                    const walker = row.querySelector(".pr-walker");
                    walker.append(window.ClassroomAvatars?.create(racer.avatarKey, { walking: true }) || el("span"));
                }
                const share = racer.time != null ? 1 : racer.done / racer.total;
                row.style.setProperty("--share", share.toFixed(3));
                row.classList.toggle("me", id === me());
                row.classList.toggle("done", racer.time != null);
                row.classList.toggle("left", !!racer.left);
                row.querySelector(".pr-rank").textContent = String(index + 1);
                row.querySelector(".pr-name").textContent = racer.name;
                row.querySelector(".pr-mark").textContent = racer.time != null ? formatTime(racer.time) : racer.left ? "나감" : `${Math.round(share * 100)}%`;
                board.append(row);
            });
            existing.forEach((node, id) => { if (!racers[id]) node.remove(); });
        }

        function checkAllDone() {
            if (!racing) return;
            const live = Object.entries(racers).filter(([, racer]) => !racer.left);
            if (!live.length || live.some(([, racer]) => racer.time == null)) {
                if (iFinished && !overlay) showWaiting();
                return;
            }
            showResults();
        }

        function showWaiting() {
            const place = finishOrder.indexOf(me()) + 1;
            overlay = el("div", { class: "pr-result pr-waiting", role: "status" }, [
                el("div", { class: "pr-result-card" }, [
                    el("strong", { class: "pr-place", text: `${place}등` }),
                    el("span", { text: formatTime(racers[me()]?.time || 0) })
                ])
            ]);
            document.body.append(overlay);
        }

        function showResults() {
            closeOverlay();
            music("lobby");
            const rows = ranked().filter(([, racer]) => racer.time != null);
            const podium = el("ol", { class: "pr-podium" }, rows.map(([id, racer], index) => {
                const item = el("li", { class: `pr-step pr-step-${Math.min(index + 1, 4)}${id === me() ? " me" : ""}` }, [
                    window.ClassroomAvatars?.create(racer.avatarKey, { walking: index === 0 }) || el("span"),
                    el("span", { class: "pr-step-block" }, [
                        el("strong", { text: `${index + 1}` }),
                        el("span", { class: "pr-step-name", text: racer.name }),
                        el("span", { class: "pr-step-time", text: formatTime(racer.time) })
                    ])
                ]);
                return item;
            }));
            const actions = el("div", { class: "pr-result-actions" });
            if (isHost()) {
                const again = el("button", { class: "primary", type: "button", text: "다시 하기" });
                again.addEventListener("click", () => { lobby.broadcast({ type: MSG.AGAIN }); backToLobby(true); });
                actions.append(again);
            } else {
                actions.append(el("p", { text: "방장이 다시 하기를 누르면 대기실로 돌아갑니다." }));
            }
            const out = el("button", { class: "secondary", type: "button", text: "혼자 하기" });
            out.addEventListener("click", () => leave(true));
            actions.append(out);
            overlay = el("div", { class: "pr-result", role: "dialog", "aria-modal": "true", "aria-label": "순위전 결과" }, [
                el("div", { class: "pr-result-card pr-final" }, [podium, actions])
            ]);
            document.body.append(overlay);
            overlay.querySelector("button")?.focus();
        }

        function closeOverlay() {
            overlay?.remove();
            overlay = null;
        }

        function stopRace() {
            clearTimeout(countdownTimer);
            countdownTimer = null;
            document.querySelector(".pr-countdown")?.remove();
            racing = false;
            iFinished = false;
            document.body.classList.remove("pr-racing");
            closeOverlay();
            options.stop?.();
            const host = typeof options.standingsHost === "function" ? options.standingsHost() : options.standingsHost;
            host?.querySelector(".pr-standings")?.remove();
            if (host) host.hidden = true;
        }

        // 다시 하기: 같은 방 그대로 대기실로.
        function backToLobby(keepRoom = true) {
            stopRace();
            if (!keepRoom) { leave(false); return; }
            lobby.returnToLobby();
            root.classList.remove("hidden");
            document.body.classList.add("pr-in-lobby");
            options.hideSolo?.();
            renderSettings();
        }

        // 혼자 하기: 방을 나가 원래 시작 화면으로.
        function leave(fromResult) {
            stopRace();
            try { lobby?.destroy(); } catch (_) {}
            lobby = null;
            (root?.closest(".pr-shade") || root)?.remove();
            root = null;
            window.removeEventListener("sitebackrequest", onSiteBack);
            document.body.classList.remove("pr-in-lobby");
            restoreOwnMusic();
            options.exit?.({ fromResult });
        }

        function showNotice(title, message) {
            closeOverlay();
            const ok = el("button", { class: "primary", type: "button", text: "혼자 하기" });
            ok.addEventListener("click", () => leave(false));
            overlay = el("div", { class: "pr-result", role: "alertdialog", "aria-modal": "true" }, [
                el("div", { class: "pr-result-card" }, [el("strong", { text: title }), el("p", { text: message }), ok])
            ]);
            document.body.append(overlay);
            ok.focus();
        }

        let toastTimer = null;
        function toast(message) {
            let node = document.querySelector(".pr-toast");
            if (!node) { node = el("div", { class: "pr-toast", role: "status" }); document.body.append(node); }
            node.textContent = message;
            node.classList.add("show");
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => node.classList.remove("show"), 2400);
        }

        return {
            open, progress, finish, settingsKey,
            get active() { return racing; },
            get settings() { return { ...settings }; }
        };
    }

    window.ClassroomPuzzleRace = Object.freeze({ create });
})();
