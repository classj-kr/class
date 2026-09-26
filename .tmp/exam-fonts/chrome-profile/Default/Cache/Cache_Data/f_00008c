(() => {
    "use strict";

    if (window.ClassGameSfx) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const SFX_LEVEL_KEY = "classSfxVolumeLevel";
    const SFX_VOLUME_KEY = "classSfxVolumeValue";
    const SFX_MUTED_KEY = "classSfxMuted";
    const DEFAULT_VOLUME = 0.65;
    const SOUND_NAMES = new Set([
        "click", "select", "back", "bell", "card", "stone", "success",
        "error", "tick", "turn", "timeout"
    ]);
    const SYNTH_FALLBACKS = Object.freeze({
                select: "click", back: "click", turn: "bell", timeout: "error"
    });
    const scriptUrl = document.currentScript?.src || new URL("/assets/sound/game-sfx.js", window.location.href).href;
    const FILE_SOUND_NAMES = new Set([...SOUND_NAMES].filter(name => name !== "click"));
    const soundUrls = Object.fromEntries([...FILE_SOUND_NAMES].map(name => [
        name,
        new URL(`sfx/${name}.ogg`, scriptUrl).href
    ]));

    let context = null;
    let output = null;
    let noiseBuffer = null;
    const fileTemplates = new Map();
    const failedFiles = new Set();
    const activeFiles = new Set();
    let muted = readStored(SFX_MUTED_KEY) === "1";
    let volume = readInitialVolume();
    let lastInteractionAt = 0;
    let semanticSuppressedUntil = 0;
    let lastSemanticName = "";
    let lastSemanticAt = 0;
    const semanticSignatures = new WeakMap();
    const pendingSemanticElements = new Set();
    let semanticFlushScheduled = false;

    const POSITIVE_OUTCOMES = new Set(["correct", "success", "succeeded", "complete", "completed", "passed"]);
    const NEGATIVE_OUTCOMES = new Set(["wrong", "incorrect", "error", "failed", "failure", "invalid"]);
    const FEEDBACK_TEXT_SELECTOR = ".feedback, .result, .answer-result, .quiz-feedback, [class*='feedback' i], [id*='feedback' i], [id*='result' i], [aria-live], [role='status'], [role='alert']";

    function readStored(key) {
        try {
            return window.localStorage.getItem(key) || "";
        } catch (_) {
            return "";
        }
    }

    function readInitialVolume() {
        const storedSfxVal = Number(readStored(SFX_VOLUME_KEY));
        if (Number.isFinite(storedSfxVal) && storedSfxVal > 0 && storedSfxVal <= 1) {
            return storedSfxVal;
        }
        const storedSfx = readStored(SFX_LEVEL_KEY);
        const level = Number(storedSfx);
        return Number.isInteger(level) && level >= 1 && level <= 5
            ? level / 5
            : DEFAULT_VOLUME;
    }

    function ensureContext() {
        if (!AudioContextClass) return null;
        if (!context) {
            try {
                context = new AudioContextClass({ latencyHint: "interactive" });
            } catch (_) {
                context = new AudioContextClass();
            }

            const compressor = context.createDynamicsCompressor();
            output = context.createGain();
            compressor.threshold.value = -16;
            compressor.knee.value = 8;
            compressor.ratio.value = 5;
            compressor.attack.value = 0.002;
            compressor.release.value = 0.12;
            output.connect(compressor);
            compressor.connect(context.destination);
            updateOutputGain();
        }
        if (context.state === "suspended") context.resume().catch(() => {});
        return context;
    }

    function updateOutputGain() {
        if (!output || !context) return;
        const target = muted ? 0.0001 : Math.max(0.0001, Math.min(1, volume));
        output.gain.cancelScheduledValues(context.currentTime);
        output.gain.setTargetAtTime(target, context.currentTime, 0.008);
    }

    function getNoiseBuffer(ctx) {
        if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
        noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.09), ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let index = 0; index < data.length; index += 1) {
            data[index] = Math.random() * 2 - 1;
        }
        return noiseBuffer;
    }

    function makeGain(ctx, start, peak, end, duration) {
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), start + 0.003);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, end), start + duration);
        gain.connect(output);
        return gain;
    }

    function tone(ctx, options) {
        const start = options.start ?? ctx.currentTime;
        const duration = options.duration ?? 0.08;
        const oscillator = ctx.createOscillator();
        const gain = makeGain(ctx, start, options.gain ?? 0.08, 0.0001, duration);
        oscillator.type = options.type || "sine";
        oscillator.frequency.setValueAtTime(options.from, start);
        oscillator.frequency.exponentialRampToValueAtTime(options.to || options.from, start + duration);
        oscillator.connect(gain);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
    }

    function noise(ctx, options = {}) {
        const start = options.start ?? ctx.currentTime;
        const duration = Math.min(0.085, options.duration ?? 0.04);
        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = makeGain(ctx, start, options.gain ?? 0.05, 0.0001, duration);
        source.buffer = getNoiseBuffer(ctx);
        filter.type = options.filterType || "bandpass";
        filter.frequency.setValueAtTime(options.frequency || 2200, start);
        filter.Q.setValueAtTime(options.q || 1.2, start);
        source.connect(filter);
        filter.connect(gain);
        source.start(start, 0, duration);
        source.stop(start + duration + 0.01);
    }

    function playClick(ctx) {
        const now = ctx.currentTime;
        tone(ctx, { start: now, from: 980, to: 540, duration: 0.05, gain: 0.38, type: "triangle" });
        tone(ctx, { start: now + 0.003, from: 1700, to: 1020, duration: 0.03, gain: 0.24, type: "sine" });
        noise(ctx, { start: now, duration: 0.02, frequency: 3400, q: 0.8, gain: 0.18 });
    }

    function playBell(ctx) {
        const now = ctx.currentTime;
        const highpass = ctx.createBiquadFilter();
        const bellGain = ctx.createGain();
        highpass.type = "highpass";
        highpass.frequency.setValueAtTime(820, now);
        bellGain.gain.setValueAtTime(0.0001, now);
        bellGain.gain.exponentialRampToValueAtTime(0.42, now + 0.003);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
        highpass.connect(bellGain);
        bellGain.connect(output);

        [
            [1760, 1, "sine", 0],
            [2635, 0.62, "sine", 0.002],
            [3518, 0.34, "triangle", 0.004],
            [4720, 0.2, "sine", 0.006],
            [6120, 0.1, "sine", 0.008]
        ].forEach(([frequency, strength, type, delay]) => {
            const start = now + delay;
            const oscillator = ctx.createOscillator();
            const partialGain = ctx.createGain();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, start);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.992, start + 0.3);
            partialGain.gain.setValueAtTime(0.0001, start);
            partialGain.gain.exponentialRampToValueAtTime(strength, start + 0.002);
            partialGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
            oscillator.connect(partialGain);
            partialGain.connect(highpass);
            oscillator.start(start);
            oscillator.stop(start + 0.54);
        });

        const strike = ctx.createBufferSource();
        const strikeFilter = ctx.createBiquadFilter();
        const strikeGain = ctx.createGain();
        strike.buffer = getNoiseBuffer(ctx);
        strikeFilter.type = "bandpass";
        strikeFilter.frequency.setValueAtTime(5400, now);
        strikeFilter.Q.setValueAtTime(1.8, now);
        strikeGain.gain.setValueAtTime(0.18, now);
        strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);
        strike.connect(strikeFilter);
        strikeFilter.connect(strikeGain);
        strikeGain.connect(highpass);
        strike.start(now, 0, 0.04);
        strike.stop(now + 0.045);
    }

    function playCard(ctx) {
        const now = ctx.currentTime;
        noise(ctx, { start: now, duration: 0.065, frequency: 2850, q: 0.65, gain: 0.22 });
        tone(ctx, { start: now + 0.008, from: 410, to: 290, duration: 0.055, gain: 0.12, type: "triangle" });
    }

    function playStone(ctx) {
        const now = ctx.currentTime;
        tone(ctx, { start: now, from: 245, to: 155, duration: 0.055, gain: 0.26, type: "sine" });
        noise(ctx, { start: now, duration: 0.025, frequency: 1250, q: 1.1, gain: 0.18 });
    }

    function playSuccess(ctx) {
        const now = ctx.currentTime;
        [659.25, 830.61, 987.77].forEach((frequency, index) => {
            tone(ctx, {
                start: now + index * 0.075,
                from: frequency,
                to: frequency * 1.01,
                duration: 0.18,
                gain: 0.22,
                type: "sine"
            });
        });
    }

    function playError(ctx) {
        const now = ctx.currentTime;
        tone(ctx, { start: now, from: 210, to: 155, duration: 0.14, gain: 0.24, type: "square" });
        tone(ctx, { start: now + 0.08, from: 165, to: 125, duration: 0.15, gain: 0.18, type: "square" });
    }

    function playTick(ctx) {
        const now = ctx.currentTime;
        tone(ctx, { start: now, from: 1180, to: 930, duration: 0.025, gain: 0.16, type: "square" });
    }

    const players = {
        click: playClick,
        bell: playBell,
        card: playCard,
        stone: playStone,
        success: playSuccess,
        error: playError,
        tick: playTick
    };

    function getFileTemplate(name) {
        if (failedFiles.has(name) || typeof Audio === "undefined") return null;
        if (!fileTemplates.has(name)) {
            const audio = new Audio(soundUrls[name]);
            audio.preload = "auto";
            fileTemplates.set(name, audio);
        }
        return fileTemplates.get(name);
    }

    function playSynth(name) {
        const ctx = ensureContext();
        if (!ctx || !output) return false;
        players[SYNTH_FALLBACKS[name] || name](ctx);
        return true;
    }

    function play(name = "click") {
        const soundName = SOUND_NAMES.has(name) ? name : "click";
        if (muted) return false;
        if (soundName === "click") return playSynth(soundName);
        const template = getFileTemplate(soundName);
        if (!template) return playSynth(soundName);
        const audio = template.cloneNode();
        audio.volume = volume;
        activeFiles.add(audio);
        const clear = () => activeFiles.delete(audio);
        audio.addEventListener("ended", clear, { once: true });
        audio.play().catch(() => {
            clear();
            failedFiles.add(soundName);
            playSynth(soundName);
        });
        return true;
    }

    function unlock() {
        return Boolean(ensureContext());
    }

    function setMuted(nextMuted) {
        muted = Boolean(nextMuted);
        if (muted) {
            activeFiles.forEach(audio => audio.pause());
            activeFiles.clear();
        }
        updateOutputGain();
    }

    function setVolume(nextVolume) {
        const parsed = Number(nextVolume);
        if (Number.isFinite(parsed)) volume = Math.max(0, Math.min(1, parsed));
        activeFiles.forEach(audio => { audio.volume = volume; });
        updateOutputGain();
    }

    function interactiveFromTarget(target) {
        if (!(target instanceof Element)) return null;
        return target.closest("button, a[href], input[type='button'], input[type='submit'], [role='button'], summary, [data-sfx]");
    }

    function soundForElement(element) {
        if (!element || element.matches(":disabled, [aria-disabled='true']")) return "";
        const requested = String(element.dataset.sfx || "").toLowerCase();
        if (requested === "none") return "";
        if (requested) return requested;
        if (element.closest("[data-sfx-clicks='none']")) return "";
        if (element.matches("[data-midi]")) return "";
        return "click";
    }

    function noteInteraction(element) {
        lastInteractionAt = Date.now();
        if (element?.dataset.sfx === "none") semanticSuppressedUntil = lastInteractionAt + 1200;
    }

    function handlePress(event) {
        if (event.isPrimary === false || (typeof event.button === "number" && event.button > 0)) return;
        const element = interactiveFromTarget(event.target);
        noteInteraction(element);
        const soundName = soundForElement(element);
        if (soundName) play(soundName);
    }

    function handleKeyboardClick(event) {
        if (event.detail !== 0) return;
        const element = interactiveFromTarget(event.target);
        noteInteraction(element);
        const soundName = soundForElement(element);
        if (soundName) play(soundName);
    }

    function semanticOutcome(element) {
        if (!(element instanceof Element) || element.closest("[data-sfx-feedback='none']")) return "";
        const values = [
            ...element.classList,
            element.dataset.state,
            element.dataset.status,
            element.dataset.result,
            element.dataset.outcome,
            element.getAttribute("aria-invalid") === "true" ? "invalid" : ""
        ].filter(Boolean).flatMap(value => String(value).toLowerCase().split(/[-_\s]+/).filter(Boolean));
        if (values.some(value => NEGATIVE_OUTCOMES.has(value))) return "error";
        if (values.some(value => POSITIVE_OUTCOMES.has(value))) return "success";
        if (!element.matches(FEEDBACK_TEXT_SELECTOR)) return "";

        const text = String(element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 180).toLowerCase();
        if (/다시 생각|다시 해|한 번 더|아쉬워|아직 아니|정답[^.!?]{0,12}아닙|오답(?:입니다|이에요|이야|!|\s|$)|틀렸|실패(?:했습니다|!|\s|$)|\bincorrect\b|\bwrong answer\b|\btry again\b|\bnot quite\b/.test(text)) return "error";
        if (/맞았습니다|맞혔|모두 맞|잘했|훌륭|정답(?:입니다|이에요|이야|!|\s|$)|성공(?:했습니다|!|\s|$)|완료(?:했습니다|!|\s|$)|\bcorrect\b|\bwell done\b/.test(text)) return "success";
        return "";
    }

    function semanticSignature(element, outcome) {
        return [
            outcome,
            element.getAttribute("class") || "",
            element.dataset.state || "",
            element.dataset.status || "",
            element.dataset.result || "",
            element.dataset.outcome || "",
            element.matches(FEEDBACK_TEXT_SELECTOR) ? String(element.textContent || "").trim().slice(0, 180) : ""
        ].join("|");
    }

    function checkSemanticElement(element) {
        if (!(element instanceof Element)) return "";
        const outcome = semanticOutcome(element);
        const signature = semanticSignature(element, outcome);
        if (semanticSignatures.get(element) === signature) return "";
        semanticSignatures.set(element, signature);

        const now = Date.now();
        if (!outcome || now - lastInteractionAt > 5000 || now < semanticSuppressedUntil) return "";
        return outcome;
    }

    function playSemanticOutcome(outcome) {
        if (!outcome) return;
        const now = Date.now();
        if (outcome === lastSemanticName && now - lastSemanticAt < 180) return;
        lastSemanticName = outcome;
        lastSemanticAt = now;
        play(outcome);
    }

    function queueSemanticElement(element) {
        if (!(element instanceof Element)) return;
        pendingSemanticElements.add(element);
        if (semanticFlushScheduled) return;
        semanticFlushScheduled = true;
        queueMicrotask(() => {
            semanticFlushScheduled = false;
            const outcomes = [...pendingSemanticElements].map(checkSemanticElement).filter(Boolean);
            pendingSemanticElements.clear();
            playSemanticOutcome(outcomes.includes("error") ? "error" : outcomes[0]);
        });
    }

    function watchSemanticFeedback() {
        if (typeof MutationObserver !== "function") return;
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const target = mutation.target.nodeType === Node.ELEMENT_NODE
                    ? mutation.target
                    : mutation.target.parentElement;
                queueSemanticElement(target);
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;
                        queueSemanticElement(node);
                        node.querySelectorAll?.(FEEDBACK_TEXT_SELECTOR).forEach(queueSemanticElement);
                    });
                }
            });
        });
        observer.observe(document.documentElement, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ["class", "data-state", "data-status", "data-result", "data-outcome", "aria-invalid"]
        });
    }

    if (window.PointerEvent) {
        document.addEventListener("pointerdown", handlePress, { capture: true, passive: true });
    } else {
        document.addEventListener("touchstart", handlePress, { capture: true, passive: true });
        document.addEventListener("mousedown", handlePress, { capture: true, passive: true });
    }
    document.addEventListener("click", handleKeyboardClick, { capture: true });
    watchSemanticFeedback();
    window.addEventListener("classsfxchange", (event) => {
        if (!event.detail) return;
        setMuted(event.detail.muted);
        setVolume(event.detail.volume);
    });

    window.ClassGameSfx = {
        play,
        unlock,
        setMuted,
        setVolume,
        isMuted: () => muted,
        isSupported: () => typeof Audio !== "undefined" || Boolean(AudioContextClass)
    };
    const preloadFiles = () => FILE_SOUND_NAMES.forEach(getFileTemplate);
    if (document.readyState === "complete") preloadFiles();
    else window.addEventListener("load", preloadFiles, { once: true });
    window.dispatchEvent(new CustomEvent("classsfxready"));
})();
