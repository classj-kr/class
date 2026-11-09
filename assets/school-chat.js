(() => {
    "use strict";
    // 학교 공용 채팅 위젯. 같은 학교 학생·교사만 쓴다(게스트는 입장권을 못 받아 아무것도 안 뜬다).
    // 채널: 학교 전체방 + 학생들이 만든 방(4자리 번호). 서버가 학교 이름을 내려 주지 않으므로 화면에도 학교 이름은 없다.
    if (window.self !== window.top || window.__schoolChatLoaded) return;
    window.__schoolChatLoaded = true;

    const REJECT_TEXT = {
        TOO_FAST: "천천히 보내 주세요.", EMPTY: "",
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
    let presenceBy = {};        // 채널 -> Map(계정 -> 접속자): 지금 그 채널에 들어와 있는 사람
    let peopleOpen = true;
    let unreadBy = {};
    let logMode = false;        // 선생님: 지운 줄까지 보이는 기록 보기
    let logChannel = SCHOOL;
    let logMessages = [];
    let enabled = false;        // 설정에서 "채팅 사용"을 켠 학생만 연결하고 💬를 보인다(계정에 저장, 기본 꺼짐)
    let call = null;            // 방 통화(assets/school-call.js, 방에 들어가면 그때 불러온다)
    let callScript = null;
    const CALL_TAB_KEY = "schoolChatCallChannel";
    const CALL_MEDIA_KEY = "schoolChatCallMedia";    // 쪽을 넘기기 전에 마이크·카메라를 켜 뒀는지(이 탭에만)   // 같은 탭에서 쪽을 옮겨도 통화를 이어 가려고 탭에만 적어 둔다
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
            .sc-panel{position:fixed;left:14px;bottom:70px;z-index:70;width:min(330px,calc(100vw - 28px));height:min(560px,calc(100vh - 90px));display:none;flex-direction:column;background:rgba(14,18,25,.96);border:1px solid rgba(255,255,255,.16);color:#e6ebf2;font:13px/1.5 "Malgun Gothic",sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.45)}
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
            .sc-panel{text-align:left}
            .sc-rooms .row{display:grid;grid-template-columns:1fr 76px;gap:6px;margin-bottom:6px}
            .sc-rooms .row button{width:100%;padding:6px 4px}
            .sc-rooms .row .wide{grid-column:1/-1}
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
            .sc-videos{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;max-height:68px;overflow-y:auto}
            .sc-videos:empty{display:none}
            .sc-video{position:relative;width:80px;height:60px;background:#0a0d12;border:1px solid rgba(255,255,255,.16);overflow:hidden}
            .sc-video video{width:100%;height:100%;object-fit:cover;display:block}
            .sc-video span{position:absolute;left:0;right:0;bottom:0;padding:1px 4px;font-size:10px;background:linear-gradient(transparent,rgba(0,0,0,.75));color:#e9edf3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
            .sc-people{padding:5px 10px;border-bottom:1px solid rgba(255,255,255,.12)}
            .sc-people .sum{width:100%;display:flex;justify-content:space-between;background:none;border:none;color:#cfd8e3;padding:0;font:inherit;font-size:12px;cursor:pointer}
            .sc-people-list{display:flex;flex-wrap:wrap;gap:2px 10px;max-height:60px;overflow-y:auto;margin-top:4px;font-size:12px;color:#c3cddb}
            .sc-people-list .t{color:#f0d77c}
            .sc-people-list .me{color:#8fe0a8}
            .sc-list{flex:1 1 auto;min-height:140px;overflow-y:auto;padding:8px 10px;user-select:text}
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
        // 한 번에 방 하나라서, 방에 있는 동안은 만들기·들어가기 칸이 필요 없다.
        if (channels.some(channel => channel.code)) { ui.rooms.classList.remove("open"); return; }
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

    // 접속자 목록: 선생님 먼저, 그다음 학년·반·이름 순
    function renderPeople() {
        if (!ui.people) return;
        const users = logMode ? [] : [...(presenceBy[active] ? presenceBy[active].values() : [])];
        ui.people.style.display = logMode ? "none" : "";
        users.sort((a, b) =>
            (b.role === "teacher") - (a.role === "teacher")
            || (a.grade || 99) - (b.grade || 99) || (a.classNumber || 99) - (b.classNumber || 99)
            || String(a.name).localeCompare(String(b.name), "ko"));
        ui.peopleSum.firstChild.textContent = `접속 ${users.length}명`;
        ui.peopleCaret.textContent = peopleOpen ? "▾" : "▸";
        ui.peopleList.style.display = peopleOpen ? "" : "none";
        ui.peopleList.replaceChildren(...users.map(user => {
            const mine = me && user.userId === me.userId;
            return el("span", `${user.role === "teacher" ? "t" : ""}${mine ? " me" : ""}`.trim(), `${labelFor(user)}${mine ? " (나)" : ""}`);
        }));
        renderStrip();
    }

    // 메인 화면의 접속자 줄(#schoolChatPresence 자리가 있는 쪽에서만): 채팅을 켜고 접속 중인 같은 학교 학생 아바타.
    // 같은 계정이 탭을 여러 개 열어도 서버가 한 사람으로 보내 준다. 누르면 채팅 창이 열린다.
    function renderStrip() {
        const slot = document.getElementById("schoolChatPresence");
        if (!slot) return;
        const users = enabled && presenceBy[SCHOOL]
            ? [...presenceBy[SCHOOL].values()].filter(user => user.role === "student" && !(me && user.userId === me.userId))
            : [];
        users.sort((a, b) => (a.grade || 99) - (b.grade || 99) || (a.classNumber || 99) - (b.classNumber || 99)
            || String(a.name).localeCompare(String(b.name), "ko"));
        slot.hidden = users.length === 0;
        slot.replaceChildren(...users.map(user => {
            const button = el("button", "chat-presence-avatar");
            button.type = "button";
            const label = labelFor(user);
            button.title = label;
            button.setAttribute("aria-label", `${label} 채팅 열기`);
            const face = el("span", "face");
            if (user.avatar) {
                const img = el("img");
                img.src = user.avatar;
                img.alt = "";
                img.loading = "lazy";
                img.addEventListener("error", () => img.replaceWith(el("span", "initial", String(user.name || "?").slice(0, 1))));
                face.appendChild(img);
            } else face.appendChild(el("span", "initial", String(user.name || "?").slice(0, 1)));
            button.append(el("span", "name", String(user.name || "")), face);
            button.addEventListener("click", () => {
                if (!ui.setOpen) return;
                if (logMode) toggleLog();
                if (active !== SCHOOL) switchTo(SCHOOL);
                ui.setOpen(true);
            });
            return button;
        }));
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
        renderPeople();
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
        if (channelId === SCHOOL && callChannelId) endCall();
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
                script.src = "/assets/school-call.js?v=20261107-resume";
                script.onload = () => resolve(Boolean(window.SchoolCall));
                script.onerror = () => resolve(false);
                document.head.appendChild(script);
            });
        }
        return callScript;
    }

    async function startCall(channelId, resume = false) {
        if (!(await loadCallScript()) || !window.SchoolCall.supported) return;
        if (!call) call = window.SchoolCall.create({ send: sendPacket, getMyId: () => me.userId, onChange: renderCall });
        call.join(channelId);
        try { sessionStorage.setItem(CALL_TAB_KEY, channelId); } catch (_) {}
        if (resume) {
            let saved = null;
            try { saved = JSON.parse(sessionStorage.getItem(CALL_MEDIA_KEY) || "null"); } catch (_) {}
            call.resumeMedia(saved);
        }
        renderCall();
    }

    function endCall() {
        if (call) call.leave();
        try { sessionStorage.removeItem(CALL_TAB_KEY); sessionStorage.removeItem(CALL_MEDIA_KEY); } catch (_) {}
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
        try { sessionStorage.setItem(CALL_MEDIA_KEY, JSON.stringify({ mic: view.micOn, cam: view.camWanted })); } catch (_) {}
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
                if (!data || !enabled) return;
                me = me || data.me;
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
                        presenceBy = {};
                        for (const [channelId, users] of Object.entries(packet.presence || {})) presenceBy[channelId] = new Map(users.map(user => [user.userId, user]));
                        for (const channel of channels) messagesBy[channel.id] = messagesBy[channel.id] || [];
                        if (!channelInfo(active)) active = SCHOOL;
                        render();
                        // 새로 접속했으면 하던 통화를 이어 간다(쪽을 옮겼거나 연결이 잠시 끊겼을 때)
                        let remembered = null;
                        try { remembered = sessionStorage.getItem(CALL_TAB_KEY); } catch (_) {}
                        if (call && call.inCall()) call.rejoin();
                        else if (remembered && channelInfo(remembered)) { active = remembered; render(); startCall(remembered, true); }
                    } else if (packet.type === "SCHOOLCHAT_PRESENCE") {
                        presenceBy[packet.channel] = new Map((packet.users || []).map(user => [user.userId, user]));
                        renderPeople();
                    } else if (packet.type === "SCHOOLCHAT_PRESENCE_DELTA") {
                        const users = presenceBy[packet.channel] = presenceBy[packet.channel] || new Map();
                        if (packet.joined) users.set(packet.joined.userId, packet.joined);
                        if (packet.left) users.delete(packet.left);
                        renderPeople();
                    } else if (packet.type === "SCHOOLCHAT_HISTORY") {
                        messagesBy[packet.channel] = packet.messages || [];
                        render();
                    } else if (packet.type === "SCHOOLCHAT_EVENT") onEvent(packet.event);
                    else if (packet.type === "SCHOOLCHAT_REJECTED") setStatus(REJECT_TEXT[packet.reason] ?? "보내지 못했어요.");
                    else if (packet.type === "SCHOOLCHAT_AUTH_REQUIRED") socket.close();
                });
                socket.addEventListener("close", () => {
                    // 내 연결이 끊긴 동안 옛 접속자 목록이 남아 유령처럼 보이지 않게 비운다.
                    presenceBy = {};
                    renderPeople();
                    if (enabled) retryTimer = setTimeout(connect, 4000);
                });
            })
            .catch(() => { if (enabled) retryTimer = setTimeout(connect, 15000); });
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
        const result = await api("rooms", "POST", {});
        if (!result.ok) return setStatus(roomError(result.data));
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
            ALREADY_IN_ROOM: "이미 다른 방에 있어요. 먼저 그 방에서 나가세요.",
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
        ui.toggle = toggle;
        toggle.type = "button";
        toggle.setAttribute("aria-label", "학교 채팅 열기");
        ui.badge = el("span", "sc-badge", "0");
        ui.badge.hidden = true;
        toggle.appendChild(ui.badge);

        const panel = el("div", "sc-panel");
        ui.panel = panel;
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
        const createButton = el("button", "wide", "내 방 만들기");   // 방 이름은 서버가 "○○의 방"으로 붙인다
        createButton.type = "button";
        createButton.addEventListener("click", createRoom);
        createRow.append(createButton);
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

        // 접속자 목록(배틀넷처럼 지금 이 채널에 누가 있는지)
        ui.people = el("div", "sc-people");
        ui.peopleSum = el("button", "sum");
        ui.peopleSum.type = "button";
        ui.peopleSum.append(document.createTextNode("접속 0명"));
        ui.peopleCaret = el("span", "", "▾");
        ui.peopleSum.appendChild(ui.peopleCaret);
        ui.peopleSum.addEventListener("click", () => { peopleOpen = !peopleOpen; renderPeople(); });
        ui.peopleList = el("div", "sc-people-list");
        ui.people.append(ui.peopleSum, ui.peopleList);

        panel.append(head, ui.tabs, ui.rooms, ui.logChannelRow, ui.callBox, ui.people, ui.list, ui.status, form);
        const setOpen = value => {
            open = value;
            panel.classList.toggle("open", open);
            if (open) { unreadBy[active] = 0; render(); ui.list.scrollTop = ui.list.scrollHeight; ui.input.focus(); }
        };
        ui.setOpen = setOpen;
        toggle.addEventListener("click", () => setOpen(!open));
        close.addEventListener("click", () => setOpen(false));
        document.body.append(toggle, panel);
        render();
    }

    // ---- 설정의 "채팅 사용" 항목: 켜야 💬가 나타나고 연결이 열린다 ----
    function loadStorageScript() {
        if (window.SiteStorage) return Promise.resolve();
        return new Promise(resolve => {
            const script = document.createElement("script");
            script.src = "/assets/site-storage.js?v=20261006-1";
            script.onload = () => resolve();
            script.onerror = () => resolve();
            document.head.appendChild(script);
        });
    }

    function enableChat() {
        enabled = true;
        if (!ui.toggle) buildUi();
        ui.toggle.style.display = "";
        connect();
    }

    function disableChat() {
        enabled = false;
        clearTimeout(retryTimer);
        endCall();
        if (socket) { const closing = socket; socket = null; closing.close(); }
        if (ui.toggle) {
            open = false;
            ui.panel.classList.remove("open");
            ui.toggle.style.display = "none";
        }
        presenceBy = {};
        renderStrip();
    }

    // 스위치 모양은 채팅을 켜기 전에도 설정 창에 보여야 해서 채팅 창 스타일과 따로 넣는다.
    function injectSettingStyle() {
        if (document.getElementById("sc-setting-style")) return;
        const style = el("style");
        style.id = "sc-setting-style";
        style.textContent = `
            .sc-setting-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 2px;font-size:14px;color:inherit}
            .sc-switch{position:relative;flex:none;width:46px;height:26px;border-radius:13px;border:1px solid rgba(255,255,255,.35);background:#4a5568;cursor:pointer;padding:0;transition:background .15s,border-color .15s}
            .sc-switch span{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .15s}
            .sc-switch[aria-checked="true"]{background:#2e9d62;border-color:#2e9d62}
            .sc-switch[aria-checked="true"] span{transform:translateX(20px)}
            .sc-switch:focus-visible{outline:2px solid #f0d77c;outline-offset:2px}
        `;
        document.head.appendChild(style);
    }

    // 설정 창(공용 소리 스크립트가 만든 #unifiedSettingsPanel)에 항목을 끼운다. 창이 아직 없으면 생길 때까지 기다린다.
    function installSetting(store) {
        const put = panel => {
            if (panel.querySelector("#settingsChat")) return;
            injectSettingStyle();
            // "채팅 사용: 켜짐" 같은 글자 단추는 지금 상태인지 누르면 바뀌는 것인지 헷갈린다. 켜고 끄는 스위치로 보인다.
            const row = el("div", "sc-setting-row");
            const label = el("span", "", "채팅 사용");
            label.id = "settingsChatLabel";
            const button = el("button", "sc-switch");
            button.id = "settingsChat";
            button.type = "button";
            button.setAttribute("role", "switch");
            button.setAttribute("aria-labelledby", "settingsChatLabel");
            button.appendChild(el("span"));
            const paint = () => button.setAttribute("aria-checked", String(enabled));
            button.addEventListener("click", () => {
                if (enabled) disableChat(); else enableChat();
                store.set("chatEnabled", enabled);
                paint();
            });
            paint();
            row.append(label, button);
            const status = panel.querySelector(".unified-settings-status");
            if (status) panel.insertBefore(row, status); else panel.appendChild(row);
        };
        const existing = document.getElementById("unifiedSettingsPanel");
        if (existing) return put(existing);
        const watcher = new MutationObserver(() => {
            const panel = document.getElementById("unifiedSettingsPanel");
            if (panel) { watcher.disconnect(); put(panel); }
        });
        watcher.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }

    async function boot() {
        // 입장권을 받을 수 있는 계정(같은 학교 학생·교사)만 항목을 본다. 게스트는 아무것도 안 뜬다.
        const ticket = await fetch("/api/school-chat/ticket", { credentials: "same-origin" })
            .then(response => (response.ok ? response.json() : null)).catch(() => null);
        if (!ticket) return;
        me = ticket.me;
        await loadStorageScript();
        const store = window.SiteStorage ? await window.SiteStorage.open("site-settings") : null;
        if (!store || !store.persistent) return;   // 계정에 저장할 수 없으면 켜고 끌 수도 없다
        // 켜져 있던 상태를 먼저 반영한 뒤 항목을 그려야 글자가 실제 상태와 맞는다.
        if (store.get("chatEnabled") === true) enableChat();
        installSetting(store);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
})();
