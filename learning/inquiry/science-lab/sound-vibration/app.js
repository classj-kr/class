document.addEventListener('DOMContentLoaded', () => {
    const barButtons = [...document.querySelectorAll('[data-bar]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const strengthRange = document.getElementById('strengthRange');
    const strengthOutput = document.getElementById('strengthOutput');
    const strikeButton = document.getElementById('strikeBtn');
    const barBadge = document.getElementById('barBadge');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultPitch = document.getElementById('resultPitch');
    const resultLoudness = document.getElementById('resultLoudness');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const mallet = document.getElementById('mallet');
    const malletAnchor = document.getElementById('malletAnchor');
    const wavePath = document.getElementById('wavePath');
    const envelopeTop = document.getElementById('envelopeTop');
    const envelopeBottom = document.getElementById('envelopeBottom');

    // Bar lengths are not chosen by eye: for a bar vibrating transversely the
    // frequency goes as 1/L², so L ∝ 1/√f. Taking the 262 Hz bar as 180 units,
    // √(262/392) → 147 and √(262/523) → 127, which is what the markup uses.
    const BARS = {
        do:   { note: '도',      hz: 262, group: 'barDo',   barY: 55 },
        sol:  { note: '솔',      hz: 392, group: 'barSol',  barY: 130 },
        hido: { note: '높은 도', hz: 523, group: 'barHido', barY: 205 },
    };
    const REFERENCE = 'sol';

    // One slow-motion factor for the oscillation itself. The decay is
    // separately compressed — a real bar rings for hundreds of cycles, which
    // no viewable animation can show at the same scale — so the badge says
    // only "느리게 표현" rather than claiming a single honest multiplier.
    // What IS exact here: the 262 : 392 : 523 ratio between the three bars,
    // and amplitude depending on strike strength while frequency does not.
    const SLOWDOWN = 100;
    const T_WIN = 2;      // display seconds shown across the scope
    const TAU = 1.6;      // display seconds for the amplitude to fall to 1/e
    const CUTOFF = .02;   // treat quieter than this as silent

    const SCOPE_X0 = 10, SCOPE_X1 = 410, SCOPE_W = SCOPE_X1 - SCOPE_X0;
    const CENTER_Y = 80, MAX_AMP = 62;
    const BAR_MAX = 11;
    const SAMPLES = 220;

    let selectedBar = 'sol';
    let prediction = null;
    let strikeAt = null;     // display-clock time of mallet contact
    let ringAmp = 0.5;       // normalised strike strength of the current ring
    let ringHz = BARS.sol.hz;
    let rafId = null;

    const now = () => performance.now() / 1000;

    // The single source of truth for "where is the bar right now". The scope
    // trace and the bar's own displacement both read from this, so what the
    // waveform draws and what the bar does are guaranteed to be the same
    // vibration rather than two animations that merely look related.
    function displacementAt(t) {
        if (strikeAt === null || t < strikeAt) return 0;
        const dt = t - strikeAt;
        const fd = ringHz / SLOWDOWN;
        return ringAmp * Math.exp(-dt / TAU) * Math.sin(2 * Math.PI * fd * dt);
    }

    function envelopeAt(t) {
        if (strikeAt === null || t < strikeAt) return 0;
        return ringAmp * Math.exp(-(t - strikeAt) / TAU);
    }

    function ringDuration() {
        // How long until the ring is inaudible, plus the time for that tail
        // to scroll off the left edge of the scope.
        if (ringAmp <= CUTOFF) return 0;
        return TAU * Math.log(ringAmp / CUTOFF) + T_WIN;
    }

    function drawScope(t) {
        let wave = '';
        let top = '';
        let bottom = '';
        for (let i = 0; i <= SAMPLES; i += 1) {
            const x = SCOPE_X0 + (SCOPE_W * i) / SAMPLES;
            // Left edge is the oldest sample, right edge is the present, so
            // the trace scrolls the way an oscilloscope's does.
            const sampleTime = t - (1 - i / SAMPLES) * T_WIN;
            const y = CENTER_Y - displacementAt(sampleTime) * MAX_AMP;
            const env = envelopeAt(sampleTime) * MAX_AMP;
            wave += `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
            top += `${i ? 'L' : 'M'}${x.toFixed(1)},${(CENTER_Y - env).toFixed(1)}`;
            bottom += `${i ? 'L' : 'M'}${x.toFixed(1)},${(CENTER_Y + env).toFixed(1)}`;
        }
        wavePath.setAttribute('d', wave);
        envelopeTop.setAttribute('d', top);
        envelopeBottom.setAttribute('d', bottom);
    }

    function moveBar(key, offset) {
        document.getElementById(BARS[key].group)
            .setAttribute('transform', `translate(0 ${offset.toFixed(2)})`);
    }

    function frame() {
        const t = now();
        drawScope(t);
        // Only the bar that was actually struck moves; the others stay put.
        Object.keys(BARS).forEach(key => moveBar(key, key === selectedBar ? displacementAt(t) * BAR_MAX : 0));

        if (strikeAt !== null && t - strikeAt > ringDuration()) {
            stopRing();
            return;
        }
        rafId = requestAnimationFrame(frame);
    }

    let audioCtx = null;
    let currentToneNodes = [];
    let strikeAudioTimer = null;

    function stopTone() {
        if (!audioCtx) return;
        currentToneNodes.forEach(({ gain, osc }) => {
            try {
                gain.gain.cancelScheduledValues(audioCtx.currentTime);
                gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
                setTimeout(() => {
                    try { osc.stop(); osc.disconnect(); } catch (_) {}
                }, 50);
            } catch (_) {}
        });
        currentToneNodes = [];
    }

    function playTone(freq, strength) {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            stopTone();

            const startTime = audioCtx.currentTime;
            const duration = 2.0;

            // Amplitude scaled by strike strength (1~10)
            const masterGain = Math.max(0.06, Math.min(0.85, (strength / 10) * 0.7));

            // Fundamental tone
            const fundGain = audioCtx.createGain();
            fundGain.connect(audioCtx.destination);
            fundGain.gain.setValueAtTime(0.001, startTime);
            fundGain.gain.exponentialRampToValueAtTime(masterGain, startTime + 0.008);
            fundGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            const fundOsc = audioCtx.createOscillator();
            fundOsc.type = 'sine';
            fundOsc.frequency.setValueAtTime(freq, startTime);
            fundOsc.connect(fundGain);
            fundOsc.start(startTime);
            fundOsc.stop(startTime + duration);
            currentToneNodes.push({ gain: fundGain, osc: fundOsc });

            // Metallic chime inharmonic overtone (~2.756f for transverse metal bar)
            const overtoneGain = audioCtx.createGain();
            overtoneGain.connect(audioCtx.destination);
            overtoneGain.gain.setValueAtTime(0.001, startTime);
            overtoneGain.gain.exponentialRampToValueAtTime(masterGain * 0.35, startTime + 0.004);
            overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.55);

            const overtoneOsc = audioCtx.createOscillator();
            overtoneOsc.type = 'sine';
            overtoneOsc.frequency.setValueAtTime(freq * 2.756, startTime);
            overtoneOsc.connect(overtoneGain);
            overtoneOsc.start(startTime);
            overtoneOsc.stop(startTime + 0.55);
            currentToneNodes.push({ gain: overtoneGain, osc: overtoneOsc });

            // High strike transient sparkle (5.4x)
            const sparkleGain = audioCtx.createGain();
            sparkleGain.connect(audioCtx.destination);
            sparkleGain.gain.setValueAtTime(0.001, startTime);
            sparkleGain.gain.exponentialRampToValueAtTime(masterGain * 0.1, startTime + 0.002);
            sparkleGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.2);

            const sparkleOsc = audioCtx.createOscillator();
            sparkleOsc.type = 'sine';
            sparkleOsc.frequency.setValueAtTime(freq * 5.4, startTime);
            sparkleOsc.connect(sparkleGain);
            sparkleOsc.start(startTime);
            sparkleOsc.stop(startTime + 0.2);
            currentToneNodes.push({ gain: sparkleGain, osc: sparkleOsc });
        } catch (_) {}
    }

    function stopRing() {
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
        strikeAt = null;
        clearTimeout(strikeAudioTimer);
        Object.keys(BARS).forEach(key => moveBar(key, 0));
        Object.values(BARS).forEach(info => {
            const el = document.getElementById(info.group);
            if (el) el.classList.remove('vibrating');
        });
        drawScope(now());
        stageCaption.textContent = '떨림이 멈추면서 소리도 멈췄습니다. 다시 쳐 보세요.';
    }

    function silence() {
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
        strikeAt = null;
        clearTimeout(strikeAudioTimer);
        stopTone();
        Object.keys(BARS).forEach(key => moveBar(key, 0));
        Object.values(BARS).forEach(info => {
            const el = document.getElementById(info.group);
            if (el) el.classList.remove('vibrating');
        });
        drawScope(now());
    }

    function syncSelection() {
        const data = BARS[selectedBar];
        barButtons.forEach(btn => btn.classList.toggle('selected', btn.dataset.bar === selectedBar));
        Object.entries(BARS).forEach(([key, info]) => {
            document.getElementById(info.group).classList.toggle('active', key === selectedBar);
        });
        barBadge.textContent = `${data.note} · ${data.hz} Hz`;
        malletAnchor.setAttribute('transform', `translate(0 ${data.barY - BARS.do.barY})`);
    }

    function clearResult() {
        resultEmpty.hidden = false;
        resultContent.hidden = true;
    }

    function strike() {
        const data = BARS[selectedBar];
        const strength = Number(strengthRange.value);
        ringAmp = strength / 10;
        ringHz = data.hz;

        mallet.classList.remove('striking');
        void mallet.getBoundingClientRect();
        mallet.classList.add('striking');

        // The mallet keyframes reach the bar at 38% of a .52s animation, so
        // the vibration starts on contact rather than on the click.
        const contactDelay = .52 * .38;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
        strikeAt = now() + contactDelay;
        stageCaption.textContent = `${data.note} 음판이 떨리면서 소리가 납니다.`;
        rafId = requestAnimationFrame(frame);

        clearTimeout(strikeAudioTimer);
        strikeAudioTimer = setTimeout(() => {
            playTone(data.hz, strength);
            const activeGroup = document.getElementById(data.group);
            if (activeGroup) {
                activeGroup.classList.remove('vibrating');
                void activeGroup.getBoundingClientRect();
                activeGroup.classList.add('vibrating');
            }
        }, contactDelay * 1000);

        const actual = data.hz > BARS[REFERENCE].hz ? 'higher' : data.hz < BARS[REFERENCE].hz ? 'lower' : 'same';
        resultPitch.innerHTML = `<span class="metric-number">${data.hz} Hz</span><span class="metric-context">${data.note}</span>`;
        resultLoudness.textContent = `진폭 ${strength}`;
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';

        if (actual === 'higher') {
            explanation.textContent = `${data.note} 음판은 기준 음판(솔)보다 짧아서 더 빠르게 떨리고, 그래서 더 높은 소리가 납니다. 세기를 바꾸면 소리의 크기만 달라지고 높낮이는 그대로입니다.`;
        } else if (actual === 'lower') {
            explanation.textContent = `${data.note} 음판은 기준 음판(솔)보다 길어서 더 느리게 떨리고, 그래서 더 낮은 소리가 납니다. 세기를 바꾸면 소리의 크기만 달라지고 높낮이는 그대로입니다.`;
        } else {
            explanation.textContent = '기준 음판과 같은 음판이므로 높낮이도 같습니다. 세게 칠수록 크게 떨려서 소리만 커집니다.';
        }
    }

    barButtons.forEach(button => button.addEventListener('click', () => {
        selectedBar = button.dataset.bar;
        syncSelection();
        silence();
        clearResult();
        stageCaption.textContent = '음판을 치면 떨림이 시작됩니다.';
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    strengthRange.addEventListener('input', () => {
        strengthOutput.textContent = strengthRange.value;
        silence();
        clearResult();
        stageCaption.textContent = '음판을 치면 떨림이 시작됩니다.';
    });
    strikeButton.addEventListener('click', strike);

    Object.entries(BARS).forEach(([key, info]) => {
        const groupEl = document.getElementById(info.group);
        if (groupEl) {
            groupEl.style.cursor = 'pointer';
            groupEl.addEventListener('click', () => {
                selectedBar = key;
                syncSelection();
                strike();
            });
        }
    });

    function shuffleQuizOptions(card) {
        const optionGroup = card.querySelector('.quiz-options');
        const options = Array.from(optionGroup.children);
        for (let index = options.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [options[index], options[randomIndex]] = [options[randomIndex], options[index]];
        }
        optionGroup.append(...options);
    }

    document.querySelectorAll('.quiz-card').forEach(card => {
        shuffleQuizOptions(card);
        const answerButton = card.querySelector('.answer-button');
        const answerResult = card.querySelector('.answer-result');
        const answerExplanation = card.querySelector('.answer-explanation');
        answerButton.addEventListener('click', () => {
            const selected = card.querySelector('input:checked');
            if (!selected) {
                delete card.dataset.state;
                answerResult.textContent = '답을 먼저 선택하세요.';
                return;
            }
            const correct = selected.value === card.dataset.answer;
            card.dataset.state = correct ? 'correct' : 'incorrect';
            answerResult.textContent = correct ? '맞았습니다.' : '다시 생각해 보세요.';
            answerExplanation.hidden = !correct;
            if (!correct) {
                selected.checked = false;
                selected.disabled = true;
                answerResult.textContent = '다시 생각하고 다른 답을 골라보세요.';
            }
        });
    });

    // Exposed only so the physics can be checked by exact numbers rather than
    // by sampling animation frames — requestAnimationFrame is paused whenever
    // the page isn't being composited, so a frame-based check would prove
    // nothing about whether the model itself is right.
    window.__soundModel = {
        BARS, SLOWDOWN, T_WIN, TAU, REFERENCE, displacementAt, envelopeAt, ringDuration,
        state: () => ({ selectedBar, ringAmp, ringHz, strikeAt, running: rafId !== null }),
        // Render the scope and bars exactly `elapsed` display-seconds after a
        // strike, with no dependence on the animation clock.
        renderAt(elapsed) {
            drawScope(elapsed);
            Object.keys(BARS).forEach(key => moveBar(key, key === selectedBar ? displacementAt(elapsed) * BAR_MAX : 0));
        },
        forceRing({ bar, strength, elapsed }) {
            selectedBar = bar;
            syncSelection();
            ringAmp = strength / 10;
            ringHz = BARS[bar].hz;
            if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
            strikeAt = 0;
            this.renderAt(elapsed);
            return { ringAmp, ringHz, barDisplacement: displacementAt(elapsed) * BAR_MAX };
        },
    };

    syncSelection();
    silence();
    clearResult();
});
