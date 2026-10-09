(() => {
    "use strict";

    // 탐사 효과는 직접 합성하되 출력과 실시간 음소거는 공용 효과음 버스를 쓴다.
    let ctx = null;
    let master = null;
    let noiseBuffer = null;

    function ensure() {
        const bus = window.ClassGameSfx?.getAudioBus();
        if (!bus) return null;
        ctx = bus.context;
        master = bus.output;
        return ctx;
    }

    // 2초짜리 흰 잡음 하나를 만들어 두고 필요할 때 잘라 쓴다.
    function getNoise() {
        if (noiseBuffer) return noiseBuffer;
        const length = ctx.sampleRate * 2;
        noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
        return noiseBuffer;
    }

    // 필터를 건 잡음 한 덩이. 돌 부딪는 소리, 쉭 하는 소리의 재료다.
    function burst({ at, duration, type = "bandpass", from, to = from, q = 1, gain = 0.3 }) {
        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const amp = ctx.createGain();
        source.buffer = getNoise();
        source.loop = true;
        filter.type = type;
        filter.frequency.setValueAtTime(from, at);
        filter.frequency.exponentialRampToValueAtTime(Math.max(40, to), at + duration);
        filter.Q.setValueAtTime(q, at);
        amp.gain.setValueAtTime(0.0001, at);
        amp.gain.exponentialRampToValueAtTime(gain, at + Math.min(0.02, duration * 0.2));
        amp.gain.exponentialRampToValueAtTime(0.0001, at + duration);
        source.connect(filter); filter.connect(amp); amp.connect(master);
        source.start(at); source.stop(at + duration + 0.02);
    }

    function tone({ at, duration, from, to = from, gain = 0.3, type = "sine" }) {
        const osc = ctx.createOscillator();
        const amp = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(from, at);
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), at + duration);
        amp.gain.setValueAtTime(0.0001, at);
        amp.gain.exponentialRampToValueAtTime(gain, at + Math.min(0.015, duration * 0.25));
        amp.gain.exponentialRampToValueAtTime(0.0001, at + duration);
        osc.connect(amp); amp.connect(master);
        osc.start(at); osc.stop(at + duration + 0.02);
    }

    // 무거운 것이 바닥을 때리는 소리: 급히 떨어지는 사인 + 잡음 파편.
    function thud(at, strength = 1) {
        tone({ at, duration: 0.26 * strength, from: 150 * strength, to: 42, gain: 0.5, type: "sine" });
        burst({ at, duration: 0.16, from: 1600, to: 320, q: 0.7, gain: 0.34 });
    }

    const RECIPES = {
        // 위험 5종. 순서는 서버의 hazards 배열과 같다.
        // 0 낙석 / 함정 / 운석 — 돌덩이가 연달아 떨어진다.
        hazard0(now) {
            [0, 0.085, 0.155, 0.235, 0.34].forEach((offset, index) => {
                thud(now + offset, 1 - index * 0.13);
            });
            burst({ at: now + 0.02, duration: 0.55, from: 2600, to: 260, q: 0.5, gain: 0.22 });
        },
        // 1 유독가스 / 독충 / 태양풍 — 차오르다 흩어지는 쉭 소리.
        hazard1(now) {
            burst({ at: now, duration: 0.85, type: "bandpass", from: 380, to: 2400, q: 2.4, gain: 0.3 });
            burst({ at: now + 0.1, duration: 0.7, type: "highpass", from: 900, to: 3200, q: 0.6, gain: 0.16 });
            tone({ at: now + 0.05, duration: 0.6, from: 220, to: 130, gain: 0.12, type: "triangle" });
        },
        // 2 갱도 붕괴 / 봉인 파손 / 연료 누출 — 쩍 갈라지고 오래 우르릉거린다.
        hazard2(now) {
            burst({ at: now, duration: 0.09, from: 3800, to: 900, q: 1.4, gain: 0.42 });
            tone({ at: now + 0.02, duration: 1.1, from: 74, to: 28, gain: 0.55, type: "sine" });
            burst({ at: now + 0.06, duration: 1.0, type: "lowpass", from: 900, to: 130, q: 0.8, gain: 0.36 });
            [0.18, 0.31, 0.47, 0.66].forEach(offset => thud(now + offset, 0.7));
        },
        // 3 지하수 / 모래 붕괴 / 통신 두절 — 물방울과 쏟아지는 흐름.
        hazard3(now) {
            [0, 0.13, 0.29].forEach((offset, index) => {
                tone({ at: now + offset, duration: 0.13, from: 1500 - index * 260, to: 520, gain: 0.3, type: "sine" });
            });
            burst({ at: now + 0.12, duration: 0.75, type: "bandpass", from: 700, to: 2100, q: 1.1, gain: 0.26 });
        },
        // 4 박쥐 떼 / 저주 / 중력 이상 — 날갯짓 퍼덕임과 높은 끽 소리.
        hazard4(now) {
            for (let i = 0; i < 11; i += 1) {
                burst({ at: now + i * 0.055, duration: 0.045, from: 1500, to: 700, q: 1.6, gain: 0.2 });
            }
            [0.06, 0.19, 0.33].forEach((offset, index) => {
                tone({ at: now + offset, duration: 0.09, from: 3100 + index * 380, to: 5200, gain: 0.14, type: "square" });
            });
        },
        // 보물이 갈릴 때: 금속 조각이 쏟아지는 소리.
        treasure(now) {
            [0, 0.045, 0.085, 0.125].forEach((offset, index) => {
                tone({ at: now + offset, duration: 0.2, from: 1180 + index * 210, gain: 0.2, type: "triangle" });
                burst({ at: now + offset, duration: 0.06, from: 5200, to: 2600, q: 2, gain: 0.12 });
            });
        },
        // 희귀 보물: 길게 남는 맑은 울림.
        relic(now) {
            [1046, 1568, 2093, 3136].forEach((frequency, index) => {
                tone({ at: now + index * 0.05, duration: 1.5 - index * 0.2, from: frequency, gain: 0.2 - index * 0.03, type: "sine" });
            });
            burst({ at: now, duration: 0.5, type: "highpass", from: 4200, to: 9000, q: 0.6, gain: 0.1 });
        },
        // 동시 공개 직전의 훅 하는 긴장.
        showdown(now) {
            burst({ at: now, duration: 0.42, type: "bandpass", from: 300, to: 2600, q: 1.5, gain: 0.26 });
            tone({ at: now + 0.24, duration: 0.16, from: 520, to: 880, gain: 0.2, type: "triangle" });
        },
        // 무사 귀환: 따뜻하게 올라가는 세 음.
        bank(now) {
            [523.25, 659.25, 783.99].forEach((frequency, index) => {
                tone({ at: now + index * 0.085, duration: 0.4, from: frequency, gain: 0.24, type: "triangle" });
            });
        },
        // 전멸: 아래로 꺼지는 소리에 잔해가 깔린다.
        wipe(now) {
            tone({ at: now, duration: 0.9, from: 320, to: 55, gain: 0.4, type: "sawtooth" });
            tone({ at: now + 0.08, duration: 0.9, from: 240, to: 41, gain: 0.3, type: "sine" });
            burst({ at: now + 0.05, duration: 0.8, type: "lowpass", from: 1200, to: 110, q: 0.7, gain: 0.32 });
        }
    };

    function play(name) {
        const recipe = RECIPES[name];
        if (!recipe) return false;
        if (!ensure()) return false;
        try { recipe(ctx.currentTime + 0.005); } catch (_) { return false; }
        return true;
    }

    window.ExpeditionSfx = { play, names: () => Object.keys(RECIPES) };
})();
