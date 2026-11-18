(() => {
    "use strict";
    // 학교 채팅 방 통화. 학생 기기끼리 직접 연결(서버는 인원 세기와 연결 신호 전달만 한다).
    // 방에 들어가면 연결은 자동이고 마이크·카메라는 학생이 직접 켠다. 카메라는 서버가 센 자리(동시에 4명)를
    // 받은 뒤에만 켜고 작은 화면(320×240)으로 보낸다. 화면 공유는 없다.
    const ICE_SERVERS = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        // 직접 연결이 안 되는 학교망을 위한 무료 공용 중계. 렌더 서버 밖에 있어 렌더 사용량에 안 잡힌다.
        { urls: ["turn:openrelay.metered.ca:80", "turn:openrelay.metered.ca:443", "turn:openrelay.metered.ca:443?transport=tcp"], username: "openrelayproject", credential: "openrelayproject" }
    ];
    const VIDEO = { width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 15, max: 15 } };
    const VIDEO_MAX_BITRATE = 250000;
    // 같은 교실 알아보기. 한 교실의 여러 기기가 서로의 소리를 스피커로 틀면, 그 소리가 다른 기기 마이크로 들어가
    // 0.1~0.3초 늦게 돌고 돌며(말한 사람에게도) 울린다. 반향 제거는 자기 스피커 소리만 지워서 이건 못 막는다.
    // 그래서 기기끼리 마이크 소리 크기(데시벨)와 잰 시각을 0.025초마다 주고받고, 핑으로 두 기기의 시계 차이를 맞춘다.
    // 음절이 시작하고 끝나는 순간(크기가 커지고 작아진 양)이 내 마이크와 친구 마이크에서 같은 때(±0.05초)에 겹치면 같은
    // 교실이다 — 소리가 공기로 바로 가기 때문이다. 내 목소리가 인터넷으로 가서 친구 스피커로 나온 뒤 친구 마이크에 남은 것
    // (반향 찌꺼기)은 소리를 줄이고 보내고 다시 트는 데 0.1초 넘게 걸려 같은 때에 겹치지 않으므로 같은 교실로 보지 않는다.
    // 같은 교실 친구 소리는 틀지 않고(교실에서 직접 들린다), 그 친구가 나보다 크게 말하는 동안에는 내 마이크도 보내지
    // 않는다(멀리 있는 친구에게 같은 목소리가 겹쳐 가지 않게).
    const NEAR = { tick: 25, fft: 1024, keep: 3500, window: 3000, spread: 50, match: 0.45, release: 0.15, keepAvg: 0.6, clip: 12, theirRange: 15, myRange: 8, speech: -50, louder: 3, recent: 300, hold: 400, ping: 2000 };

    const supported = typeof RTCPeerConnection === "function" && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    function create({ send, getMyId, onChange }) {
        let channel = null;
        let members = [];          // [{userId, name}]
        let cams = new Set();
        let limits = { call: 6, cams: 4 };
        let audioTrack = null;
        let videoTrack = null;
        let localStream = null;    // 내 화면 미리보기용(화면이 다시 그려져도 같은 것을 쓴다)
        let micOn = false;
        let wantCam = false;
        let status = "";
        const peers = new Map();   // userId -> { pc, audioTransceiver, videoTransceiver, stream, audioEl }
        const audioHost = document.createElement("div");
        audioHost.style.display = "none";
        document.body.appendChild(audioHost);

        const changed = () => onChange && onChange();
        const setStatus = text => { status = text || ""; changed(); };

        function sendSignal(to, data) { send({ type: "SCHOOLCHAT_SIGNAL", channel, to, data }); }

        function openPeer(userId) {
            let pc;
            try { pc = new RTCPeerConnection({ iceServers: ICE_SERVERS }); } catch (_) { return; }
            // 제안하는 쪽(번호가 작은 쪽)만 소리·영상 자리를 미리 열어 둔다. 나중에 켤 때는 트랙만 바꿔 끼우면
            // 되어 다시 협상하지 않는다. 받는 쪽이 미리 자리를 만들면 협상에 안 쓰여 그쪽 소리가 안 나가므로,
            // 받는 쪽은 제안을 받은 뒤 만들어진 자리를 쓴다(onSignal).
            const initiator = String(getMyId()) < String(userId);
            let audioTransceiver = null;
            let videoTransceiver = null;
            if (initiator) {
                audioTransceiver = pc.addTransceiver("audio", { direction: "sendrecv" });
                videoTransceiver = pc.addTransceiver("video", { direction: "sendrecv" });
                if (audioTrack) audioTransceiver.sender.replaceTrack(audioTrack).catch(() => {});
                if (videoTrack) attachVideo(videoTransceiver);
            }
            const stream = new MediaStream();
            const audioEl = document.createElement("audio");
            audioEl.autoplay = true;
            audioHost.appendChild(audioEl);
            const peer = { pc, audioTransceiver, videoTransceiver, stream, audioEl, dc: null, levels: [], avg: 0, near: false, syncs: [], sync: null, pingAt: 0 };
            peers.set(userId, peer);
            // 소리 크기 통로: 양쪽이 같은 번호로 미리 만들어 두면 다시 협상하지 않아도 열린다(옛 화면과도 연결은 된다).
            try {
                peer.dc = pc.createDataChannel("level", { negotiated: true, id: 7, ordered: false, maxRetransmits: 0 });
                peer.dc.onmessage = event => {
                    const text = String(event.data);
                    // 핑: "p내시각"을 받으면 "q그시각,친구시각"으로 돌려준다. 돌아온 것으로 왕복 시간과 시계 차이를 잰다
                    // (왕복이 가장 짧았던 것이 가장 정확하다).
                    if (text[0] === "p") { try { peer.dc.send("q" + text.slice(1) + "," + performance.now().toFixed(1)); } catch (_) {} return; }
                    if (text[0] === "q") {
                        const [sent, theirs] = text.slice(1).split(",").map(Number), rtt = performance.now() - sent;
                        if (!(rtt >= 0 && rtt < 5000) || !Number.isFinite(theirs)) return;
                        peer.syncs.push({ rtt, offset: theirs - (sent + rtt / 2) });
                        if (peer.syncs.length > 8) peer.syncs.shift();
                        peer.sync = peer.syncs.reduce((a, b) => (b.rtt < a.rtt ? b : a));
                        return;
                    }
                    // 소리 크기: "데시벨@친구시각". 시계 차이를 알기 전에는 쓰지 않는다.
                    const [db, at] = text.split("@").map(Number);
                    if (peer.sync && Number.isFinite(db) && Number.isFinite(at)) remember(peer.levels, { t: at - peer.sync.offset, db: Math.max(-90, Math.min(0, db)) });
                };
            } catch (_) {}

            pc.ontrack = event => {
                stream.addTrack(event.track);
                if (event.track.kind === "audio") {
                    audioEl.srcObject = new MediaStream([event.track]);
                    audioEl.play().catch(() => {});
                }
                for (const type of ["mute", "unmute", "ended"]) event.track.addEventListener(type, changed);
                changed();
            };
            pc.onicecandidate = event => { if (event.candidate) sendSignal(userId, { kind: "ice", candidate: event.candidate }); };
            pc.onconnectionstatechange = changed;
            // 번호가 작은 쪽만 먼저 제안해서 서로 동시에 제안하는 일(충돌)을 막는다.
            if (initiator) {
                pc.onnegotiationneeded = async () => {
                    try {
                        await pc.setLocalDescription(await pc.createOffer());
                        sendSignal(userId, { kind: "offer", sdp: pc.localDescription });
                    } catch (_) {}
                };
            }
        }

        function closePeer(userId) {
            const peer = peers.get(userId);
            if (!peer) return;
            try { peer.pc.close(); } catch (_) {}
            peer.audioEl.srcObject = null;
            peer.audioEl.remove();
            peers.delete(userId);
        }

        function attachVideo(transceiver) {
            transceiver.sender.replaceTrack(videoTrack).then(() => {
                // 보내는 양을 작게 묶어 두면 여러 명에게 보내도 학교 인터넷이 덜 버겁다.
                const parameters = transceiver.sender.getParameters();
                if (!parameters.encodings || !parameters.encodings.length) parameters.encodings = [{}];
                parameters.encodings[0].maxBitrate = VIDEO_MAX_BITRATE;
                return transceiver.sender.setParameters(parameters);
            }).catch(() => {});
        }

        function closeAllPeers() { for (const userId of [...peers.keys()]) closePeer(userId); }

        function stopVideo() {
            if (videoTrack) { videoTrack.stop(); videoTrack = null; }
            localStream = null;
            for (const peer of peers.values()) if (peer.videoTransceiver) peer.videoTransceiver.sender.replaceTrack(null).catch(() => {});
        }

        function join(nextChannel) {
            if (!supported) return;
            if (channel && channel !== nextChannel) leave();
            channel = nextChannel;
            send({ type: "SCHOOLCHAT_CALL_JOIN", channel });
            changed();
        }

        // 서버 접속이 새로 맺어진 뒤 같은 방에 다시 들어간다(서버는 끊긴 사람을 통화에서 뺀다).
        function rejoin() {
            if (!channel) return;
            closeAllPeers();
            send({ type: "SCHOOLCHAT_CALL_JOIN", channel });
        }

        function leave() {
            if (channel) send({ type: "SCHOOLCHAT_CALL_LEAVE", channel });
            closeAllPeers();
            stopMeter();
            if (audioTrack) { audioTrack.stop(); audioTrack = null; }
            stopVideo();
            channel = null; members = []; cams = new Set(); micOn = false; wantCam = false; status = ""; quietUntil = 0;
            changed();
        }

        // 한 번 "차단"하면 사이트는 다시 물을 수 없다. 막힌 경우에만 풀어 주는 법을 알려 준다
        // (크롬은 막힌 사이트의 주소창에 마이크·카메라 모양 표시를 띄운다).
        async function permissionState(name) {
            try { return (await navigator.permissions.query({ name })).state; } catch (_) { return null; }
        }

        async function permissionHelp(name, label) {
            const state = await permissionState(name);
            return state === "denied"
                ? `${label}가 막혀 있어요. 주소창 왼쪽의 ${label} 모양(또는 자물쇠)을 눌러 '허용'으로 바꾸고 새로고침해 주세요.`
                : `${label}를 쓰려면 허락 창에서 '허용'을 눌러 주세요.`;
        }

        async function toggleMic() {
            if (!channel) return;
            if (!micOn) {
                if (!audioTrack) {
                    try {
                        const media = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
                        audioTrack = media.getAudioTracks()[0];
                    } catch (_) { return setStatus(await permissionHelp("microphone", "마이크")); }
                    for (const peer of peers.values()) if (peer.audioTransceiver) peer.audioTransceiver.sender.replaceTrack(audioTrack).catch(() => {});
                }
                micOn = true;
                startMeter();
            } else {
                micOn = false;
            }
            audioTrack.enabled = micOn;
            setStatus("");
        }

        // ---- 같은 교실 알아보기(위 NEAR 설명) ----
        const myLevels = [];
        let meter = null;
        let judgedAt = 0;
        let quietUntil = 0;
        // 시각 순서대로 쌓는다. 친구 소식은 순서 없이 올 수 있어(빨리 보내려고 다시 보내기·순서 맞추기를 끔) 제자리에 끼운다.
        function remember(list, sample) {
            let i = list.length;
            while (i > 0 && list[i - 1].t > sample.t) i--;
            list.splice(i, 0, sample);
            const last = list[list.length - 1].t;
            while (list.length && last - list[0].t > NEAR.keep) list.shift();
        }
        // 소리 크기는 보내는 마이크와 따로 복제한 마이크에서 잰다(보내기를 잠시 멈춰도 계속 잴 수 있게).
        function startMeter() {
            if (meter || !audioTrack) return;
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const copy = audioTrack.clone();
                copy.enabled = true;
                const analyser = ctx.createAnalyser();
                analyser.fftSize = NEAR.fft;
                ctx.createMediaStreamSource(new MediaStream([copy])).connect(analyser);
                meter = { ctx, copy, analyser, samples: new Float32Array(analyser.fftSize), timer: setInterval(tickMeter, NEAR.tick) };
                // 소리 재생 허락 전이면(쪽을 넘긴 직후) 처음 누를 때 깨운다.
                if (ctx.state === "suspended") {
                    ctx.resume().catch(() => {});
                    document.addEventListener("pointerdown", () => ctx.resume().catch(() => {}), { once: true, capture: true });
                }
            } catch (_) { meter = null; }
        }
        function stopMeter() {
            if (!meter) return;
            clearInterval(meter.timer);
            meter.copy.stop();
            meter.ctx.close().catch(() => {});
            meter = null;
            myLevels.length = 0;
        }
        function tickMeter() {
            const now = performance.now();
            meter.analyser.getFloatTimeDomainData(meter.samples);
            let sum = 0;
            for (const v of meter.samples) sum += v * v;
            const db = Math.max(-90, 10 * Math.log10(sum / meter.samples.length + 1e-12));
            remember(myLevels, { t: now, db });
            // 마이크를 켠 사람만 소리 크기를 알린다(끈 사람은 아무것도 내보내지 않는다). 핑은 2초마다.
            for (const peer of peers.values()) {
                if (!peer.dc || peer.dc.readyState !== "open") continue;
                try {
                    if (micOn) peer.dc.send(Math.round(db) + "@" + now.toFixed(0));
                    if (now - peer.pingAt >= NEAR.ping) { peer.pingAt = now; peer.dc.send("p" + now.toFixed(1)); }
                } catch (_) {}
            }
            if (now - judgedAt >= 500) { judgedAt = now; judgeNearby(); }
            // 같은 교실 친구가 내 최근 0.3초 가장 큰 소리보다 크게 말하는 동안(그리고 0.4초 더) 내 마이크는 보내지 않는다.
            // (지금 한 칸과 견주면 내 음절이 끝나는 순간 늦게 온 친구 소식이 더 커 보여 내 말까지 끊긴다.)
            let mine = -90;
            for (let i = myLevels.length - 1; i >= 0 && now - myLevels[i].t <= NEAR.recent; i--) mine = Math.max(mine, myLevels[i].db);
            for (const peer of peers.values()) {
                if (!peer.near) continue;
                const last = peer.levels[peer.levels.length - 1];
                if (last && now - last.t < 250 && last.db > NEAR.speech && last.db > mine + NEAR.louder) quietUntil = now + NEAR.hold;
            }
            if (audioTrack) audioTrack.enabled = micOn && now >= quietUntil;
        }
        // 내 마이크와 친구 마이크의 소리 크기가 같은 때에 같이 오르내리는 정도(피어슨 상관, -1~1). 두 시계를 맞춘 뒤
        // ±0.05초(왕복이 길면 조금 더) 안에서 가장 큰 값을 본다. 둘 다 오르내림이 있어야(누군가 말했어야) 판단한다.
        // 판단할 것이 없으면 null.
        function likeness(mine, theirs, sync) {
            if (!sync) return null;
            const from = performance.now() - NEAR.window;
            const own = mine.filter(sample => sample.t >= from);
            if (own.length < 60 || theirs.length < 60) return null;
            const spread = NEAR.spread + Math.min(100, Math.round(sync.rtt / 4 / NEAR.tick) * NEAR.tick);
            let best = null;
            for (let lag = -spread; lag <= spread; lag += NEAR.tick) {
                const pairs = [];
                let j = 0;
                for (const sample of own) {
                    const want = sample.t + lag;
                    while (j + 1 < theirs.length && Math.abs(theirs[j + 1].t - want) <= Math.abs(theirs[j].t - want)) j++;
                    if (Math.abs(theirs[j].t - want) <= NEAR.tick / 2) pairs.push([sample.db, theirs[j].db]);
                }
                if (pairs.length < 60) continue;
                const range = k => Math.max(...pairs.map(p => p[k])) - Math.min(...pairs.map(p => p[k]));
                if (range(1) < NEAR.theirRange || range(0) < NEAR.myRange) continue;
                // 크기 자체가 아니라 한 칸마다 커지고 작아진 양(음절이 시작하고 끝나는 순간)끼리 견준다. 크기 자체는
                // 말하는 덩어리·음절이 길어서, 멀리 있는 두 사람이 우연히 같이 말할 때나 조금 늦은 반향도 비슷해 보인다.
                let sab = 0, saa = 0, sbb = 0;
                for (let i = 1; i < pairs.length; i++) {
                    // 한 칸 변화는 12 dB까지만 센다(내 목소리처럼 아주 큰 오르내림이 맞음 정도를 휘두르지 않게).
                    const clip = v => Math.max(-NEAR.clip, Math.min(NEAR.clip, v));
                    const a = clip(pairs[i][0] - pairs[i - 1][0]), b = clip(pairs[i][1] - pairs[i - 1][1]);
                    sab += a * b; saa += a * a; sbb += b * b;
                }
                const r = saa && sbb ? sab / Math.sqrt(saa * sbb) : 0;
                if (best === null || r > best) best = r;
            }
            return best;
        }
        // 0.5초마다 맞음 정도를 고르게 쌓아(한 번 우연히 맞은 것에 흔들리지 않게) 같은 교실인지 정한다. 교실은 쉽게
        // 바뀌지 않으므로 한번 같은 교실로 본 뒤에는 맞음 정도가 아주 낮아져야(0.15 아래) 놓는다.
        function judgeNearby() {
            for (const peer of peers.values()) {
                const r = likeness(myLevels, peer.levels, peer.sync);
                if (r === null) continue;
                peer.avg = NEAR.keepAvg * peer.avg + (1 - NEAR.keepAvg) * r;
                const near = peer.avg >= NEAR.match ? true : peer.avg <= NEAR.release ? false : peer.near;
                if (near !== peer.near) {
                    peer.near = near;
                    peer.audioEl.muted = near;   // 같은 교실이면 그 친구 소리는 틀지 않는다
                    changed();
                }
            }
        }

        // 쪽을 넘기면 화면이 새로 열려서 마이크·카메라가 꺼진다. 이미 허락해 둔 경우에만, 넘기기 전에 켜 둔 것을
        // 사용자 조작 없이 다시 켠다(허락이 없으면 아무것도 하지 않아서 허락 창이 갑자기 뜨는 일이 없다).
        async function resumeMedia(saved) {
            if (!saved || !channel) return;
            if (saved.mic && !micOn && await permissionState("microphone") === "granted") await toggleMic();
            if (saved.cam && !wantCam && await permissionState("camera") === "granted") await toggleCam();
        }

        // 카메라는 서버에 자리를 먼저 청한다. 받으면(상태에 내가 들어옴) 그때 켠다.
        async function toggleCam() {
            if (!channel) return;
            if (wantCam) {
                wantCam = false;
                send({ type: "SCHOOLCHAT_CAM", channel, on: false });
                stopVideo();
                return setStatus("");
            }
            wantCam = true;
            send({ type: "SCHOOLCHAT_CAM", channel, on: true });
            changed();
        }

        async function startVideoIfGranted() {
            if (!wantCam || videoTrack || !cams.has(String(getMyId()))) return;
            try {
                const media = await navigator.mediaDevices.getUserMedia({ video: VIDEO });
                videoTrack = media.getVideoTracks()[0];
                localStream = new MediaStream([videoTrack]);
            } catch (_) {
                wantCam = false;
                send({ type: "SCHOOLCHAT_CAM", channel, on: false });
                return setStatus(await permissionHelp("camera", "카메라"));
            }
            for (const peer of peers.values()) if (peer.videoTransceiver) attachVideo(peer.videoTransceiver);
            changed();
        }

        function onState(packet) {
            if (packet.channel !== channel) return;
            members = packet.members || [];
            cams = new Set(packet.cams || []);
            limits = packet.limits || limits;
            const myId = String(getMyId());
            const others = members.map(member => member.userId).filter(userId => userId !== myId);
            for (const userId of [...peers.keys()]) if (!others.includes(userId)) closePeer(userId);
            for (const userId of others) if (!peers.has(userId)) openPeer(userId);
            if (!cams.has(myId) && videoTrack) { stopVideo(); wantCam = false; }
            startVideoIfGranted();
            changed();
        }

        async function onSignal(packet) {
            if (packet.channel !== channel) return;
            const peer = peers.get(packet.from);
            if (!peer || !packet.data) return;
            const { pc } = peer;
            try {
                if (packet.data.kind === "offer") {
                    await pc.setRemoteDescription(packet.data.sdp);
                    // 제안으로 만들어진 소리·영상 자리를 내 것으로 삼고 양방향으로 연다.
                    for (const transceiver of pc.getTransceivers()) {
                        transceiver.direction = "sendrecv";
                        if (transceiver.receiver.track.kind === "audio") {
                            peer.audioTransceiver = transceiver;
                            if (audioTrack) transceiver.sender.replaceTrack(audioTrack).catch(() => {});
                        } else {
                            peer.videoTransceiver = transceiver;
                            if (videoTrack) attachVideo(transceiver);
                        }
                    }
                    await pc.setLocalDescription(await pc.createAnswer());
                    sendSignal(packet.from, { kind: "answer", sdp: pc.localDescription });
                } else if (packet.data.kind === "answer") await pc.setRemoteDescription(packet.data.sdp);
                else if (packet.data.kind === "ice") await pc.addIceCandidate(packet.data.candidate);
            } catch (_) {}
        }

        // 서버가 보낸 통화 소식을 받는다. 통화 소식이면 true.
        function handle(packet) {
            if (packet.type === "SCHOOLCHAT_CALL_STATE") { onState(packet); return true; }
            if (packet.type === "SCHOOLCHAT_SIGNAL") { onSignal(packet); return true; }
            // 같은 계정이 다른 창·기기에서 이 통화에 들어왔다. 이 창은 연결을 모두 끊고 빠진다(남아 있으면 소리가 엉킨다).
            if (packet.type === "SCHOOLCHAT_CALL_TAKEN") {
                if (packet.channel === channel) leave();
                return true;
            }
            if (packet.type === "SCHOOLCHAT_CALL_FULL") {
                if (packet.channel === channel) { channel = null; setStatus(`통화는 ${limits.call}명까지 할 수 있어요.`); }
                return true;
            }
            if (packet.type === "SCHOOLCHAT_CAM_DENIED") {
                if (packet.channel === channel) { wantCam = false; setStatus(`카메라는 동시에 ${limits.cams}명까지 켤 수 있어요.`); }
                return true;
            }
            return false;
        }

        // 화면에 그릴 정보: 참가자와, 영상이 실제로 오는 사람
        function view() {
            const myId = String(getMyId());
            return {
                channel, status, micOn, camWanted: wantCam, camOn: Boolean(videoTrack), limits, supported,
                linked: [...peers.values()].filter(peer => peer.pc.connectionState === "connected").length,
                members: members.map(member => ({
                    userId: member.userId, name: member.name, me: member.userId === myId, cam: cams.has(member.userId),
                    near: Boolean(peers.get(member.userId)?.near),
                    stream: member.userId === myId ? localStream : (peers.get(member.userId)?.stream || null)
                }))
            };
        }

        return { join, rejoin, leave, toggleMic, toggleCam, resumeMedia, handle, view, inCall: () => Boolean(channel) };
    }

    window.SchoolCall = Object.freeze({ create, supported });
})();
