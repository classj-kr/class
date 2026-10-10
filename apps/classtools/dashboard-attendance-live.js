/* Live attendance updates and a short, gesture-enabled notification sound. */
window.createDashboardAttendanceLive = function ({ soundButton, onChange, onArrival, onConnectionChange }) {
    let stream = null;
    let currentClassId = null;
    let audio = null;
    let soundEnabled = localStorage.getItem("dashboardAttendanceSound") !== "off";
    let changeTimer;
    const seen = new Set();

    function updateSoundButton() {
        const ready = audio?.state === "running";
        soundButton.textContent = soundEnabled ? "🔔" : "🔕";
        soundButton.setAttribute("aria-pressed", String(soundEnabled));
        soundButton.title = !soundEnabled ? "학부모 알림 소리 켜기"
            : ready ? "학부모 알림 소리 끄기" : "알림 소리 활성화: 화면을 한 번 눌러 주세요";
        soundButton.setAttribute("aria-label", soundButton.title);
    }

    async function unlockSound() {
        if (!soundEnabled) return;
        try {
            const Audio = window.AudioContext || window.webkitAudioContext;
            if (!Audio) return;
            if (!audio) {
                audio = new Audio();
                audio.addEventListener("statechange", updateSoundButton);
            }
            if (audio.state !== "running") await audio.resume();
        } catch { /* The visible notice still works if audio is unavailable. */ }
        updateSoundButton();
    }

    function playSound() {
        if (!soundEnabled || audio?.state !== "running") return;
        const now = audio.currentTime;
        for (const [frequency, offset] of [[880, 0], [660, 0.18]]) {
            const oscillator = audio.createOscillator();
            const gain = audio.createGain();
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(frequency, now + offset);
            gain.gain.setValueAtTime(0, now + offset);
            gain.gain.linearRampToValueAtTime(0.14, now + offset + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.38);
            oscillator.connect(gain);
            gain.connect(audio.destination);
            oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
            oscillator.start(now + offset);
            oscillator.stop(now + offset + 0.4);
        }
    }

    // Creating/resuming audio must happen in an actual user interaction.
    for (const type of ["pointerdown", "keydown"]) {
        document.addEventListener(type, event => {
            if (!soundButton.contains(event.target)) unlockSound();
        }, { passive: true });
    }
    soundButton.addEventListener("click", async () => {
        if (soundEnabled && audio?.state === "running") {
            soundEnabled = false;
        } else {
            soundEnabled = true;
            await unlockSound();
            playSound();
        }
        localStorage.setItem("dashboardAttendanceSound", soundEnabled ? "on" : "off");
        updateSoundButton();
    });
    updateSoundButton();

    function stop() {
        stream?.close();
        stream = null;
        clearTimeout(changeTimer);
    }

    function selectClass(classId) {
        stop();
        currentClassId = classId ? String(classId) : null;
        seen.clear();
        if (!currentClassId) { onConnectionChange(false); return; }
        if (!window.EventSource) { onConnectionChange(true); return; }
        const connection = new EventSource("/api/teacher/class-attendance/events?classId=" + encodeURIComponent(currentClassId));
        stream = connection;
        connection.addEventListener("ready", () => {
            if (stream !== connection) return;
            onConnectionChange(false);
            onChange(); // Initial/reconnected snapshot is silent.
        });
        connection.addEventListener("attendance", message => {
            if (stream !== connection) return;
            let event;
            try { event = JSON.parse(message.data); } catch { return; }
            if (!event.id || !["arrival", "changed"].includes(event.kind) || seen.has(event.id)) return;
            seen.add(event.id);
            if (seen.size > 200) seen.delete(seen.values().next().value);
            clearTimeout(changeTimer);
            changeTimer = setTimeout(onChange, 150);
            if (event.kind === "arrival") {
                playSound();
                onArrival(event, soundEnabled && audio?.state !== "running");
            }
        });
        connection.onerror = () => {
            if (stream === connection) onConnectionChange(true);
        };
    }
    window.addEventListener("pagehide", stop);
    window.addEventListener("pageshow", event => {
        if (event.persisted) selectClass(currentClassId);
    });
    return { selectClass, stop };
};
