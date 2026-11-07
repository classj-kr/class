(() => {
    "use strict";
    // 학교 공용 채팅 위젯. 같은 학교 학생·교사만 쓴다(게스트는 입장권을 못 받아 아무것도 안 뜬다).
    // 서버가 학교 이름을 내려 주지 않으므로 화면에도 학교 이름은 없다.
    if (window.self !== window.top || window.__schoolChatLoaded) return;
    window.__schoolChatLoaded = true;

    const REJECT_TEXT = { TOO_FAST: "천천히 보내 주세요.", MUTED: "잠시 채팅이 막혀 있어요.", EMPTY: "", NO_DATABASE: "지금은 채팅을 쓸 수 없어요.", ERROR: "보내지 못했어요." };
    const MAX_SHOWN = 200;

    let me = null;
    let socket = null;
    let retryTimer = null;
    let open = false;
    let unread = 0;
    let logMode = false;        // 선생님: 지운 줄까지 보이는 기록 보기
    let messages = [];
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
            .sc-panel{position:fixed;left:14px;bottom:70px;z-index:70;width:min(320px,calc(100vw - 28px));height:min(420px,calc(100vh - 100px));display:none;flex-direction:column;background:rgba(14,18,25,.96);border:1px solid rgba(255,255,255,.16);color:#e6ebf2;font:13px/1.5 "Malgun Gothic",sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.45)}
            .sc-panel.open{display:flex}
            .sc-head{display:flex;align-items:center;gap:8px;padding:9px 12px;border-bottom:1px solid rgba(255,255,255,.12);font-weight:700}
            .sc-head span{flex:1}
            .sc-head button{background:none;border:1px solid rgba(255,255,255,.2);color:#cfd8e3;padding:3px 8px;font-size:12px;cursor:pointer}
            .sc-head button.on{background:#3b4a60}
            .sc-list{flex:1;overflow-y:auto;padding:8px 10px;user-select:text}
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
            .sc-form input{min-width:0;background:#0a0d12;border:1px solid #4a5568;color:#e6ebf2;padding:7px 8px;font:inherit;outline:none}
            .sc-form input:focus{border-color:#f0d77c}
            .sc-form button{background:#3b4a60;border:1px solid #55657d;color:#fff;padding:0 12px;cursor:pointer;font:inherit}
        `;
        document.head.appendChild(style);
    }

    function labelFor(message) {
        if (message.role === "teacher") return `${message.name} 선생님`;
        return message.grade && message.classNumber ? `${message.grade}-${message.classNumber} ${message.name}` : message.name;
    }

    function setStatus(text) { ui.status.textContent = text || ""; }

    async function teacherCall(path, body) {
        const response = await fetch(`/api/school-chat/${path}`, {
            method: "POST", credentials: "same-origin",
            headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {})
        });
        if (!response.ok) setStatus("처리하지 못했어요.");
        return response.ok;
    }

    function renderMessage(message) {
        const row = el("div", `sc-msg${message.role === "teacher" ? " teacher" : ""}${me && message.userId === me.userId ? " mine" : ""}${message.deleted ? " deleted" : ""}`);
        row.dataset.id = message.id;
        row.appendChild(el("span", "who", labelFor(message)));
        row.appendChild(el("span", "text", message.text));
        if (message.preserved) row.appendChild(el("span", "keep", "보존"));
        if (me && me.role === "teacher") {
            const tools = el("span", "tools");
            const keep = el("button", "", message.preserved ? "보존 해제" : "보존");
            keep.type = "button";
            keep.addEventListener("click", async () => {
                if (await teacherCall(`teacher/messages/${message.id}/preserve`, { preserved: !message.preserved })) { message.preserved = !message.preserved; render(); }
            });
            const remove = el("button", "", "삭제");
            remove.type = "button";
            remove.addEventListener("click", async () => {
                if (await teacherCall(`teacher/messages/${message.id}/delete`)) { message.deleted = true; if (!logMode) messages = messages.filter(item => item.id !== message.id); render(); }
            });
            const mute = el("button", "", "10분 막기");
            mute.type = "button";
            mute.addEventListener("click", async () => {
                if (await teacherCall("teacher/mute", { userId: message.userId, minutes: 10 })) setStatus(`${message.name} 학생을 10분 막았어요.`);
            });
            tools.append(keep, remove);
            if (message.role !== "teacher") tools.appendChild(mute);
            row.appendChild(tools);
        }
        return row;
    }

    function render() {
        const list = ui.list;
        const nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 60;
        list.replaceChildren(...messages.slice(-MAX_SHOWN).map(renderMessage));
        if (nearBottom) list.scrollTop = list.scrollHeight;
    }

    function updateBadge() {
        ui.badge.textContent = String(unread > 99 ? "99+" : unread);
        ui.badge.hidden = unread === 0;
    }

    function onEvent(event) {
        if (event.type === "message") {
            if (logMode) return;
            messages.push(event.message);
            if (!open && !(me && event.message.userId === me.userId)) { unread += 1; updateBadge(); }
            render();
        } else if (event.type === "deleted" && !logMode) {
            messages = messages.filter(item => item.id !== event.id);
            render();
        }
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
                    if (packet.type === "SCHOOLCHAT_JOINED") {
                        if (!logMode) { messages = packet.history || []; render(); }
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
        if (!text || !socket || socket.readyState !== WebSocket.OPEN) return;
        setStatus("");
        socket.send(JSON.stringify({ type: "SCHOOLCHAT_SEND", text }));
        ui.input.value = "";
    }

    async function toggleLog() {
        logMode = !logMode;
        ui.logButton.classList.toggle("on", logMode);
        if (logMode) {
            const response = await fetch("/api/school-chat/teacher/messages", { credentials: "same-origin" });
            if (response.ok) messages = (await response.json()).messages;
        } else if (socket && socket.readyState === WebSocket.OPEN) {
            // 실시간 보기로 돌아가면 접속할 때처럼 최근 대화를 다시 받는다.
            socket.close();
        }
        render();
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
        head.appendChild(el("span", "", "채팅"));
        if (me.role === "teacher") {
            ui.logButton = el("button", "", "기록");
            ui.logButton.type = "button";
            ui.logButton.addEventListener("click", toggleLog);
            head.appendChild(ui.logButton);
        }
        const close = el("button", "", "닫기");
        close.type = "button";
        head.appendChild(close);
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
        panel.append(head, ui.list, ui.status, form);
        const setOpen = value => {
            open = value;
            panel.classList.toggle("open", open);
            if (open) { unread = 0; updateBadge(); ui.list.scrollTop = ui.list.scrollHeight; ui.input.focus(); }
        };
        toggle.addEventListener("click", () => setOpen(!open));
        close.addEventListener("click", () => setOpen(false));
        document.body.append(toggle, panel);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", connect);
    else connect();
})();
