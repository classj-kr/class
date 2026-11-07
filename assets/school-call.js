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
            const peer = { pc, audioTransceiver, videoTransceiver, stream, audioEl };
            peers.set(userId, peer);

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
            if (audioTrack) { audioTrack.stop(); audioTrack = null; }
            stopVideo();
            channel = null; members = []; cams = new Set(); micOn = false; wantCam = false; status = "";
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
                audioTrack.enabled = true;
                micOn = true;
            } else {
                audioTrack.enabled = false;
                micOn = false;
            }
            setStatus("");
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
                    stream: member.userId === myId ? localStream : (peers.get(member.userId)?.stream || null)
                }))
            };
        }

        return { join, rejoin, leave, toggleMic, toggleCam, resumeMedia, handle, view, inCall: () => Boolean(channel) };
    }

    window.SchoolCall = Object.freeze({ create, supported });
})();
