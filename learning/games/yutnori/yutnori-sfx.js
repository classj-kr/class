(() => {
    "use strict";
    // Short procedural effects: no extra audio downloads, one shared volume/mute bus.
    const voices = new Set();
    let noiseBuffer;
    function cancel() {
        for (const source of voices) { try { source.stop(); } catch (_) {} }
        voices.clear();
    }
    function bus() {
        if (document.hidden) return null;
        return window.ClassGameSfx?.getAudioBus() || null;
    }
    function voice(b, source, at, length, level, filter) {
        const gain = b.context.createGain();
        gain.gain.setValueAtTime(0, at);
        gain.gain.linearRampToValueAtTime(level, at + .003);
        gain.gain.exponentialRampToValueAtTime(.0001, at + length);
        if (filter) { source.connect(filter); filter.connect(gain); }
        else source.connect(gain);
        gain.connect(b.output);
        voices.add(source);
        source.onended = () => { voices.delete(source); source.disconnect(); filter?.disconnect(); gain.disconnect(); };
        source.start(at);
        source.stop(at + length + .015);
    }
    function tone(b, at, from, to, length, level, type = "sine") {
        const oscillator = b.context.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(from, at);
        oscillator.frequency.exponentialRampToValueAtTime(to, at + length);
        voice(b, oscillator, at, length, level);
    }
    function air(b, at, length, level, from, to) {
        const ctx = b.context;
        if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
            noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
            const samples = noiseBuffer.getChannelData(0);
            for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
        }
        const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter();
        source.buffer = noiseBuffer;
        filter.type = "bandpass";
        filter.Q.value = .8;
        filter.frequency.setValueAtTime(from, at);
        filter.frequency.exponentialRampToValueAtTime(to, at + length);
        voice(b, source, at, length, level, filter);
    }
    function wood(b, at, pitch, level = .12) {
        tone(b, at, pitch, pitch * .86, .085, level);
        tone(b, at, pitch * 2.71, pitch * 2.58, .045, level * .3);
        tone(b, at, pitch * 4.07, pitch * 3.91, .026, level * .14);
        air(b, at, .022, level * .55, 2300, 1100);
    }
    function chime(b, at, notes, gap = .09, level = .075) {
        notes.forEach((frequency, i) => {
            tone(b, at + i * gap, frequency, frequency, .22, level);
            tone(b, at + i * gap, frequency * 2, frequency * 2, .09, level * .18);
        });
    }
    function roll(steps, duration = .85) {
        const b = bus(); if (!b) return;
        const now = b.context.currentTime + .008;
        air(b, now, .16, .07, 650, 1900);
        // Landing and small rebounds coincide with the four animated sticks.
        [.49, .54, .60, .66, .73].forEach((offset, i) =>
            wood(b, now + duration * offset / .85, [620, 810, 560, 730, 960][i], i < 3 ? .15 : .09));
        if (steps >= 4) chime(b, now + duration, steps === 5 ? [523, 659, 784, 1047] : [587, 740, 880]);
        else wood(b, now + duration, 1150, .055);
    }
    function move(count, durationMs) {
        const b = bus(); if (!b) return;
        const now = b.context.currentTime + .008, steps = Math.max(1, Math.min(6, count));
        const duration = Math.max(.06, durationMs / 1000);
        for (let i = 1; i <= steps; i++) {
            const landing = now + duration * i / steps;
            tone(b, Math.max(now, landing - .09), 260 + i * 18, 360 + i * 18, .07, .022);
            wood(b, landing, i % 2 ? 480 : 560, .085);
        }
    }
    function arrive(event, winner) {
        const b = bus(); if (!b) return;
        const now = b.context.currentTime + .008;
        if (winner !== null) { chime(b, now, [523, 659, 784, 1047, 784, 1047], .11, .09); return; }
        if (event.caught) {
            wood(b, now, 320, .17);
            tone(b, now + .025, 180, 780, .18, .13, "triangle");
            tone(b, now + .13, 710, 290, .27, .075);
            air(b, now + .18, .45, .075, 1800, 400);
            // Soft arrival in the bench, once per capture event rather than per avatar.
            wood(b, now + .85, 850, .08);
        } else if (event.stacked) chime(b, now, [440, 554, 659], .065, .07);
        else if (event.finished) chime(b, now, [659, 784, 1047], .09, .08);
    }
    document.addEventListener("visibilitychange", () => { if (document.hidden) cancel(); });
    window.addEventListener("classsfxchange", event => { if (event.detail?.muted || event.detail?.volume === 0) cancel(); });
    window.YutSounds = {roll, move, arrive, cancel};
})();
