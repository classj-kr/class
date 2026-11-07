(() => {
    "use strict";
    // 학교 공용 채팅 위젯. 같은 학교 학생·교사만 쓴다(게스트는 입장권을 못 받아 아무것도 안 뜬다).
    // 채널: 학교 전체방 + 학생들이 만든 방(4자리 번호). 서버가 학교 이름을 내려 주지 않으므로 화면에도 학교 이름은 없다.
    if (window.self !== window.top || window.__schoolChatLoaded) return;
    window.__schoolChatLoaded = true;

    const REJECT_TEXT = {
        TOO_FAST: "천천히 보내 주세요.", MUTED: "잠시 채팅이 막혀 있어요.", EMPTY: "",
        NO_DATABASE: "지금은 채팅을 쓸 수 없어요.", NOT_MEMBER: "이 방에 들어가 있지 않아요.", NO_CHANNEL: "없는 방이에요.", ERROR: "보내지 못했어요."
    };
    const MAX_SHOWN = 200;
    const SCHOOL = "school";

    let me = null;
    let socket = null;
    let retryTimer = null;
    let open = false;
    let channels = [{ id: SCHOOL, name: "학교" }];
    let active = SCHOOL;
    let messagesBy = { [SCHOOL]: [] };
    let unreadBy = {};
    let logMode = false;        // 선생님: 지운 줄까지 보이는 기록 보기
    let logChannel = SCHOOL;
    let logMessages = [];
    let call = null;            // 방 통화(assets/school-call.js, 방에 들어가면 그때 불러온다)
    let callScript = null;
    const CALL_TAB_KEY = "schoolChatCallChannel";   // 같은 탭에서 쪽을 옮겨도 통화를 이어 가려고 탭에만 적어 둔다
    const ui = {};

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function injectStyle() {
        const style = el("style");
        style.textContent = `
            .sc-toggle{position:fixed;left:14px;bottom:14px;z-index:70;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:#27303d;color:#eef2f7;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;box-shadow:0 4px 14px rgba(0,0,0,.35)}
            .sc-toggle:hover{background:#334052}
            .sc-badge{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#d8352d;color:#fff;font-size:11px;line-height:18px;text-align:center}
            .sc-badge[hidden]{display:none}
            .sc-panel{position:fixed;left:14px;bottom:70px;z-index:70;width:min(330px,calc(100vw - 28px));height:min(440px,calc(100vh - 100px));display:none;flex-direction:column;background:rgba(14,18,25,.96);border:1px solid rgba(255,255,255,.16);color:#e6ebf2;font:13px/1.5 "Malgun Gothic",sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.45)}
            .sc-panel.open{display:flex}
            .sc-head{display:flex;align-items:center;gap:6px;padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.12);font-weight:700}
            .sc-head .title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
            .sc-head .code{color:#f0d77c;font-weight:400;margin-left:6px}
            .sc-head button,.sc-tabs button,.sc-rooms button{background:none;border:1px solid rgba(255,255,255,.2);color:#cfd8e3;padding:3px 8px;font-size:12px;cursor:pointer;font-family:inherit}
            .sc-head button.on,.sc-tabs button.on{background:#3b4a60;color:#fff}
            .sc-tabs{display:flex;gap:4px;padding:6px 10px;border-bottom:1px solid rgba(255,255,255,.12);overflow-x:auto;white-space:nowrap}
            .sc-tabs button{position:relative;flex:none}
            .sc-tabs .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#d8352d;margin-left:5px}
            .sc-rooms{display:none;padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.12)}
            .sc-rooms.open{display:block}
            .sc-rooms .row{display:grid;grid-template-columns:1fr auto;gap:6px;margin-bottom:6px}
            .sc-rooms input,.sc-form input{min-width:0;background:#0a0d12;border:1px solid #4a5568;color:#e6ebf2;padding:6px 8px;font:inherit;outline:none}
            .sc-rooms input:focus,.sc-form input:focus{border-color:#f0d77c}
            .sc-rooms select{width:100%;background:#0a0d12;border:1px solid #4a5568;color:#e6ebf2;padding:6px 8px;font:inherit}
            .sc-call{display:none;padding:6px 10px;border-bottom:1px solid rgba(255,255,255,.12);background:rgba(40,60,50,.35)}
            .sc-call.open{display:block}
            .sc-call .bar{display:flex;align-items:center;gap:6px}
            .sc-call .info{flex:1;min-width:0;font-size:12px;color:#bfe8cf;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
            .sc-call .bar button{width:34px;height:30px;border:1px solid rgba(255,255,255,.22);background:#2a323f;color:#eef2f7;cursor:pointer;position:relative;padding:0;font-size:14px}
            .sc-call .bar button.off{background:#4a2320;border-color:#7a3630}
            .sc-call .bar button.off::after{content:"";position:absolute;left:15%;right:15%;top:50%;height:2px;background:#f0847c;transform:rotate(-30deg)}
            .sc-call .bar button.wait{opacity:.6}
            .sc-call .bar .end{width:auto;padding:0 8px;font-size:12px}
            .sc-call .note{min-height:0;color:#f0a39c;font-size:12px;margin-top:4px}
            .sc-call .note:empty{display:none}
            .sc-videos{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
            .sc-videos:empty{display:none}
            .sc-video{position:relative;width:96px;height:72px;background:#0a0d12;border:1px solid rgba(255,255,255,.16);overflow:hidden}
            .sc-video video{width:100%;height:100%;object-fit:cover;display:block}
            .sc-video span{position:absolute;left:0;right:0;bottom:0;padding:1px 4px;font-size:10px;background:linear-gradient(transparent,rgba(0,0,0,.75));color:#e9edf3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
            .sc-list{flex:1;overflow-y:auto;padding:8px 10px;user-select:text}
            .sc-empty{color:#8794a6;padding:6px 0}
            .sc-msg{margin-bottom:7px;overflow-wrap:anywhere}
            .sc-msg .who{color:#9fc6ee;font-weight:700;margin-right:5px}
            .sc-msg.teacher .who{color:#f0d77c}
            .sc-msg.mine .who{color:#8fe0a8}
            .sc-msg.deleted{opacity:.45;text-decoration:line-through}
            .sc-msg .tools{display:none;margin-left:6px}
            .sc-msg:hover .tools{display:inline}
            .sc-msg .tools button{background:none;border:1px solid rgba(255,255,255,.22);color:#cfd8e3;font-size:11px;padding:0 5px;margin-right:3px;cursor:pointer}
            .sc-msg .keep{color:#f0d77c;margin-left:4px;font-size:11px}
            .sc-status{min-height:18px;padding:0 12px;color:#f0a39c;font-size:12px}
            .sc-form{display:grid;grid-template-columns:1fr auto;gap:6px;padding:8px 10px;border-top:1px solid rgba(255,255,255,.12)}
            .sc-form button{background:#3b4a60;border:1px solid #55657d;color:#fff;padding:0 12px;cursor:pointer;font:inherit}
        `;
        document.head.appendChild(style);
    }

    function labelFor(message) {
        if (message.role === "teacher") return `${message.name} 선생님`;
        return message.grade && message.classNumber ? `${message.grade}-${message.classNumber} ${message.name}` : message.name;
    }

    function setStatus(text) { ui.status.textContent = text || ""; }
    function channelInfo(id) { return channels.find(channel => channel.id === id); }
    function currentChannel() { return logMode ? logChannel : active; }

    async function api(path, method, body) {
        const response = await fetch(`/api/school-chat/${path}`, {
            method: method || "GET", credentials: "same-origin",
            headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined
        });
        let data = null;
        try { data = await response.json(); } catch (_) {}
        return { ok: response.ok, data };
    }

    function renderMessage(message, channelId) {
        const mine = me && message.userId === me.userId;
        const row = el("div", `sc-msg${message.role === "teacher" ? " teacher" : ""}${mine ? " mine" : ""}${message.deleted ? " deleted" : ""}`);
        row.dataset.id = message.id;
        row.appendChild(el("span", "who", labelFor(message)));
        row.appendChild(el("span", "text", message.text));
        if (message.preserved) row.appendChild(el("span", "keep", "보존"));
        if (me && me.role === "teacher") {
            const tools = el("span", "tools");
            const keep = el("button", "", message.preserved ? "보존 해제" : "보존");
            keep.type = "button";
            keep.addEventListener("click", async () => {
                const result = await api(`teacher/messages/${message.id}/preserve`, "POST", { preserved: !message.preserved });
                if (result.ok) { message.preserved = !message.preserved; render(); } else setStatus("처리하지 못했어요.");
            });
            const remove = el("button", "", "삭제");
            remove.type = "button";
            remove.addEventListener("click", async () => {
                const result = await api(`teacher/messages/${message.id}/delete`, "POST");
                if (!result.ok) return setStatus("처리하지 못했어요.");
                message.deleted = true;
                if (!logMode) messagesBy[channelId] = (messagesBy[channelId] || []).filter(item => item.id !== message.id);
                render();
            });
            tools.append(keep, remove);
            if (message.role !== "teacher") {
                const mute = el("button", "", "10분 막기");
                mute.type = "button";
                mute.addEventListener("click", async () => {
                    const result = await api("teacher/mute", "POST", { userId: message.userId, minutes: 10 });
                    setStatus(result.ok ? `${message.name} 학생을 10분 막았어요.` : "처리하지 못했어요.");
                });
                tools.appendChild(mute);
            }
            row.appendChild(tools);
        }
        return row;
    }

    function renderTabs() {
        const tabs = ui.tabs;
        tabs.replaceChildren();
        for (const channel of channels) {
            const tab = el("button", channel.id === active && !logMode ? "on" : "", channel.id === callChannelId ? `${channel.name} ●` : channel.name);
            tab.type = "button";
            if (unreadBy[channel.id] && channel.id !== active) tab.appendChild(el("span", "dot"));
            tab.addEventListener("click", () => { if (logMode) toggleLog(); switchTo(channel.id); });
            tabs.appendChild(tab);
        }
        const add = el("button", ui.rooms.classList.contains("open") ? "on" : "", "+ 방");
        add.type = "button";
        add.setAttribute("aria-label", "방 만들기 또는 번호로 들어가기");
        add.addEventListener("click", () => { ui.rooms.classList.toggle("open"); renderTabs(); });
        tabs.appendChild(add);
    }

    function renderHead() {
        const info = channelInfo(active);
        ui.titleText.textContent = logMode ? "기록" : (info ? info.name : "학교");
        ui.code.textContent = !logMode && info && info.code ? `번호 ${info.code}` : "";
        ui.leaveButton.style.display = !logMode && info && info.code ? "" : "none";
    }

    function render() {
        renderTabs();
        renderHead();
        const list = ui.list;
        const nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 60;
        const channelId = currentChannel();
        const shown = (logMode ? logMessages : (messagesBy[channelId] || [])).slice(-MAX_SHOWN);
        list.replaceChildren(...(shown.length ? shown.map(message => renderMessage(message, channelId)) : [el("div", "sc-empty", "아직 메시지가 없어요.")]));
        if (nearBottom) list.scrollTop = list.scrollHeight;
        updateBadge();
    }

    function totalUnread() { return Object.values(unreadBy).reduce((sum, count) => sum + count, 0); }

    function updateBadge() {
        const total = totalUnread();
        ui.badge.textContent = total > 99 ? "99+" : String(total);
        ui.badge.hidden = total === 0;
    }

    function switchTo(channelId) {
        active = channelId;
        unreadBy[channelId] = 0;
        setStatus("");
        render();
        ui.list.scrollTop = ui.list.scrollHeight;
        // 학생이 만든 방을 열면 그 방 통화에 자동으로 들어간다(학교 전체방에는 통화가 없다)
        const info = channelInfo(channelId);
        if (info && info.code && callChannelId !== channelId) startCall(channelId);
    }

    function onEvent(event) {
        const channelId = event.channel || SCHOOL;
        if (event.type === "message") {
            (messagesBy[channelId] = messagesBy[channelId] || []).push(event.message);
            const mine = me && event.message.userId === me.userId;
            if (!mine && (!open || channelId !== active || logMode)) unreadBy[channelId] = (unreadBy[channelId] || 0) + 1;
            render();
        } else if (event.type === "deleted") {
            messagesBy[channelId] = (messagesBy[channelId] || []).filter(item => item.id !== event.id);
            render();
        }
    }

    function sendPacket(packet) {
        if (!socket || socket.readyState !== WebSocket.OPEN) return false;
        socket.send(JSON.stringify(packet));
        return true;
    }

    // ---- 방 통화(음성 6명·카메라 동시에 4명). 방 탭을 열면 연결은 자동, 마이크·카메라는 직접 켠다 ----
    let callChannelId = null;
    const videoTiles = new Map();

    function loadCallScript() {
        if (window.SchoolCall) return Promise.resolve(true);
        if (!callScript) {
            callScript = new Promise(resolve => {
                const script = document.createElement("script");
                script.src = "/assets/school-call.js?v=20261107-first";
                script.onload = () => resolve(Boolean(window.SchoolCall));
                script.onerror = () => resolve(false);
                document.head.appendChild(script);
            });
        }
        return callScript;
    }

    async function startCall(channelId) {
        if (!(await loadCallScript()) || !window.SchoolCall.supported) return;
        if (!call) call = window.SchoolCall.create({ send: sendPacket, getMyId: () => me.userId, onChange: renderCall });
        call.join(channelId);
        try { sessionStorage.setItem(CALL_TAB_KEY, channelId); } catch (_) {}
        renderCall();
    }

    function endCall() {
        if (call) call.leave();
        try { sessionStorage.removeItem(CALL_TAB_KEY); } catch (_) {}
        renderCall();
    }

    function renderCall() {
        if (!ui.callBox) return;
        const view = call ? call.view() : null;
        callChannelId = view && view.channel ? view.channel : null;
        if (!callChannelId) {
            ui.callBox.classList.remove("open");
            ui.videos.replaceChildren();
            videoTiles.clear();
            renderTabs();
            return;
        }
        ui.callBox.classList.add("open");
        const info = channelInfo(callChannelId);
        const camCount = view.members.filter(member => member.cam).length;
        ui.callInfo.textContent = `${info ? info.name : "방"} 통화 ${view.members.length}/${view.limits.call}명 · 카메라 ${camCount}/${view.limits.cams}`;
        ui.micButton.classList.toggle("off", !view.micOn);
        ui.camButton.classList.toggle("off", !view.camOn);
        ui.camButton.classList.toggle("wait", view.camWanted && !view.camOn);
        ui.callNote.textContent = view.status;
        const wanted = view.members.filter(member => member.cam && member.stream);
        for (const [id, tile] of [...videoTiles]) {
            if (!wanted.some(member => member.userId === id)) { tile.box.remove(); videoTiles.delete(id); }
        }
        for (const member of wanted) {
            let tile = videoTiles.get(member.userId);
            if (!tile) {
                const box = el("div", "sc-video");
                const video = document.createElement("video");
                video.autoplay = true;
                video.playsInline = true;
                video.muted = true;       // 소리는 따로 재생하므로 영상 칸은 소리를 내지 않는다
                const label = el("span");
                box.append(video, label);
                ui.videos.appendChild(box);
                tile = { box, video, label };
                videoTiles.set(member.userId, tile);
            }
            if (tile.video.srcObject !== member.stream) { tile.video.srcObject = member.stream; tile.video.play().catch(() => {}); }
            tile.label.textContent = member.me ? "나" : member.name;
        }
        renderTabs();
    }

    function connect() {
        clearTimeout(retryTimer);
        fetch("/api/school-chat/ticket", { credentials: "same-origin" })
            .then(response => (response.ok ? response.json() : null))
            .then(data => {
                if (!data) return;
                if (!me) { me = data.me; buildUi(); }
                const url = `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}`;
                socket = new WebSocket(url);
                socket.addEventListener("open", () => socket.send(JSON.stringify({ type: "SCHOOLCHAT_JOIN", ticket: data.ticket })));
                socket.addEventListener("message", event => {
                    let packet;
                    try { packet = JSON.parse(event.data); } catch (_) { return; }
                    if (call && call.handle(packet)) return;
                    if (packet.type === "SCHOOLCHAT_JOINED") {
                        channels = packet.channels || channels;
                        messagesBy = packet.history || {};
                        for (const channel of channels) messagesBy[channel.id] = messagesBy[channel.id] || [];
                        if (!channelInfo(active)) active = SCHOOL;
                        render();
                        // 새로 접속했으면 하던 통화를 이어 간다(쪽을 옮겼거나 연결이 잠시 끊겼을 때)
                        let remembered = null;
                        try { remembered = sessionStorage.getItem(CALL_TAB_KEY); } catch (_) {}
                        if (call && call.inCall()) call.rejoin();
                        else if (remembered && channelInfo(remembered)) startCall(remembered);
                    } else if (packet.type === "SCHOOLCHAT_HISTORY") {
                        messagesBy[packet.channel] = packet.messages || [];
                        render();
                    } else if (packet.type === "SCHOOLCHAT_EVENT") onEvent(packet.event);
                    else if (packet.type === "SCHOOLCHAT_REJECTED") setStatus(REJECT_TEXT[packet.reason] ?? "보내지 못했어요.");
                    else if (packet.type === "SCHOOLCHAT_AUTH_REQUIRED") socket.close();
                });
                socket.addEventListener("close", () => { retryTimer = setTimeout(connect, 4000); });
            })
            .catch(() => { retryTimer = setTimeout(connect, 15000); });
    }

    function send() {
        const text = ui.input.value.trim();
        if (!text || logMode) return;
        setStatus("");
        if (sendPacket({ type: "SCHOOLCHAT_SEND", channel: active, text })) ui.input.value = "";
    }

    function addChannel(channel) {
        if (!channelInfo(channel.id)) channels.push(channel);
        messagesBy[channel.id] = messagesBy[channel.id] || [];
        sendPacket({ type: "SCHOOLCHAT_SUBSCRIBE", channel: channel.id });
    }

    async function createRoom() {
        const result = await api("rooms", "POST", { name: ui.roomName.value });
        if (!result.ok) return setStatus(roomError(result.data));
        ui.roomName.value = "";
        addChannel(result.data.channel);
        ui.rooms.classList.remove("open");
        switchTo(result.data.channel.id);
    }

    async function joinRoom() {
        const result = await api("rooms/join", "POST", { code: ui.roomCode.value });
        if (!result.ok) return setStatus(roomError(result.data));
        ui.roomCode.value = "";
        addChannel(result.data.channel);
        ui.rooms.classList.remove("open");
        switchTo(result.data.channel.id);
    }

    async function leaveRoom() {
        const info = channelInfo(active);
        if (!info || !info.code) return;
        const result = await api(`rooms/${info.code}/leave`, "POST");
        if (!result.ok) return setStatus("나가지 못했어요.");
        if (callChannelId === info.id) endCall();
        sendPacket({ type: "SCHOOLCHAT_UNSUBSCRIBE", channel: info.id });
        channels = channels.filter(channel => channel.id !== info.id);
        delete messagesBy[info.id];
        switchTo(SCHOOL);
    }

    function roomError(data) {
        const messages = {
            TOO_MANY_OWNED_ROOMS: "방은 3개까지 만들 수 있어요.", TOO_MANY_JOINED_ROOMS: "들어갈 수 있는 방은 8개까지예요.",
            ROOM_NOT_FOUND: "방을 찾지 못했어요. 번호를 확인하세요.", CODE_REQUIRED: "4자리 방 번호를 입력하세요.",
            NO_FREE_ROOM_CODE: "지금은 새 방을 만들 수 없어요."
        };
        return messages[data && data.error] || "처리하지 못했어요.";
    }

    async function loadLog(channelId) {
        logChannel = channelId;
        const result = await api(`teacher/messages?channel=${encodeURIComponent(channelId)}`);
        logMessages = result.ok ? result.data.messages : [];
        render();
    }

    async function toggleLog() {
        logMode = !logMode;
        ui.logButton.classList.toggle("on", logMode);
        ui.logChannelRow.style.display = logMode ? "" : "none";
        if (logMode) {
            const rooms = await api("teacher/rooms");
            const options = [{ id: SCHOOL, name: "학교 전체방" }, ...(rooms.ok ? rooms.data.rooms.map(room => ({ id: room.id, name: `${room.name} (${room.code})` })) : [])];
            ui.logChannel.replaceChildren(...options.map(option => { const node = el("option", "", option.name); node.value = option.id; return node; }));
            ui.logChannel.value = logChannel;
            await loadLog(options.some(option => option.id === logChannel) ? logChannel : SCHOOL);
        } else {
            render();
        }
    }

    function buildUi() {
        injectStyle();
        const toggle = el("button", "sc-toggle", "💬");
        toggle.type = "button";
        toggle.setAttribute("aria-label", "학교 채팅 열기");
        ui.badge = el("span", "sc-badge", "0");
        ui.badge.hidden = true;
        toggle.appendChild(ui.badge);

        const panel = el("div", "sc-panel");
        const head = el("div", "sc-head");
        ui.title = el("span", "title");
        ui.titleText = el("span");
        ui.code = el("span", "code");
        ui.title.append(ui.titleText, ui.code);
        head.appendChild(ui.title);
        ui.leaveButton = el("button", "", "나가기");
        ui.leaveButton.type = "button";
        ui.leaveButton.style.display = "none";
        ui.leaveButton.addEventListener("click", leaveRoom);
        head.appendChild(ui.leaveButton);
        if (me.role === "teacher") {
            ui.logButton = el("button", "", "기록");
            ui.logButton.type = "button";
            ui.logButton.addEventListener("click", toggleLog);
            head.appendChild(ui.logButton);
        }
        const close = el("button", "", "닫기");
        close.type = "button";
        head.appendChild(close);

        ui.tabs = el("div", "sc-tabs");

        ui.rooms = el("div", "sc-rooms");
        const createRow = el("div", "row");
        ui.roomName = el("input");
        ui.roomName.maxLength = 20;
        ui.roomName.placeholder = "새 방 이름";
        const createButton = el("button", "", "만들기");
        createButton.type = "button";
        createButton.addEventListener("click", createRoom);
        createRow.append(ui.roomName, createButton);
        const joinRow = el("div", "row");
        ui.roomCode = el("input");
        ui.roomCode.maxLength = 4;
        ui.roomCode.inputMode = "numeric";
        ui.roomCode.placeholder = "방 번호 4자리";
        ui.roomCode.addEventListener("input", () => { ui.roomCode.value = ui.roomCode.value.replace(/\D/g, "").slice(0, 4); });
        const joinButton = el("button", "", "들어가기");
        joinButton.type = "button";
        joinButton.addEventListener("click", joinRoom);
        joinRow.append(ui.roomCode, joinButton);
        ui.rooms.append(createRow, joinRow);

        ui.logChannelRow = el("div", "sc-rooms open");
        ui.logChannelRow.style.display = "none";
        ui.logChannel = el("select");
        ui.logChannel.addEventListener("change", () => loadLog(ui.logChannel.value));
        ui.logChannelRow.appendChild(ui.logChannel);

        // 방 통화 띠: 연결은 자동, 마이크·카메라는 직접 켠다
        ui.callBox = el("div", "sc-call");
        const callBar = el("div", "bar");
        ui.callInfo = el("span", "info");
        ui.micButton = el("button", "off", "🎤");
        ui.micButton.type = "button";
        ui.micButton.setAttribute("aria-label", "마이크 켜기/끄기");
        ui.micButton.addEventListener("click", () => call && call.toggleMic());
        ui.camButton = el("button", "off", "📷");
        ui.camButton.type = "button";
        ui.camButton.setAttribute("aria-label", "카메라 켜기/끄기");
        ui.camButton.addEventListener("click", () => call && call.toggleCam());
        const endButton = el("button", "end", "통화 나가기");
        endButton.type = "button";
        endButton.addEventListener("click", endCall);
        callBar.append(ui.callInfo, ui.micButton, ui.camButton, endButton);
        ui.callNote = el("div", "note");
        ui.videos = el("div", "sc-videos");
        ui.callBox.append(callBar, ui.callNote, ui.videos);

        ui.list = el("div", "sc-list");
        ui.status = el("div", "sc-status");
        const form = el("form", "sc-form");
        ui.input = el("input");
        ui.input.maxLength = 200;
        ui.input.autocomplete = "off";
        ui.input.placeholder = "메시지 입력";
        const submit = el("button", "", "보내기");
        submit.type = "submit";
        form.append(ui.input, submit);
        form.addEventListener("submit", event => { event.preventDefault(); send(); });

        panel.append(head, ui.tabs, ui.rooms, ui.logChannelRow, ui.callBox, ui.list, ui.status, form);
        const setOpen = value => {
            open = value;
            panel.classList.toggle("open", open);
            if (open) { unreadBy[active] = 0; render(); ui.list.scrollTop = ui.list.scrollHeight; ui.input.focus(); }
        };
        toggle.addEventListener("click", () => setOpen(!open));
        close.addEventListener("click", () => setOpen(false));
        document.body.append(toggle, panel);
        render();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", connect);
    else connect();
})();
