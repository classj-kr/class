(function () {
    "use strict";

    const SAMPLE_NOTES = [
        { midi: 36, file: "C2.ogg" }, { midi: 42, file: "Fs2.ogg" },
        { midi: 48, file: "C3.ogg" }, { midi: 54, file: "Fs3.ogg" },
        { midi: 60, file: "C4.ogg" }, { midi: 66, file: "Fs4.ogg" },
        { midi: 72, file: "C5.ogg" }, { midi: 78, file: "Fs5.ogg" },
        { midi: 84, file: "C6.ogg" }
    ];
    const state = {
        context: null,
        compressor: null,
        masterGain: null,
        reverb: null,
        reverbGain: null,
        samples: new Map(),
        loading: null
    };

    function ensureAudio() {
        if (!state.context) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;
            const context = new AudioContextClass({ latencyHint: "interactive" });
            const lowShelf = context.createBiquadFilter();
            const presence = context.createBiquadFilter();
            const limiter = context.createDynamicsCompressor();
            state.context = context;
            state.compressor = context.createDynamicsCompressor();
            state.masterGain = context.createGain();
            state.reverb = context.createConvolver();
            state.reverbGain = context.createGain();

            state.masterGain.gain.value = .82;
            state.compressor.threshold.value = -14;
            state.compressor.knee.value = 14;
            state.compressor.ratio.value = 3.5;
            state.compressor.attack.value = .012;
            state.compressor.release.value = .22;
            lowShelf.type = "lowshelf";
            lowShelf.frequency.value = 190;
            lowShelf.gain.value = 1.2;
            presence.type = "peaking";
            presence.frequency.value = 2700;
            presence.Q.value = .75;
            presence.gain.value = .7;
            limiter.threshold.value = -3;
            limiter.knee.value = 1;
            limiter.ratio.value = 20;
            limiter.attack.value = .002;
            limiter.release.value = .1;
            state.reverbGain.gain.value = .045;

            const impulseLength = Math.floor(context.sampleRate * 1.7);
            const impulse = context.createBuffer(2, impulseLength, context.sampleRate);
            for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
                const data = impulse.getChannelData(channel);
                for (let index = 0; index < impulseLength; index += 1) {
                    data[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / impulseLength, 2.8);
                }
            }
            state.reverb.buffer = impulse;
            state.reverb.connect(state.reverbGain).connect(state.compressor);
            state.compressor.connect(lowShelf).connect(presence).connect(limiter).connect(state.masterGain).connect(context.destination);
        }
        if (state.context.state === "suspended") state.context.resume();
        return state.context;
    }

    function connectToMix(source, reverbAmount) {
        const context = ensureAudio();
        if (!context || !source) return;
        const dry = context.createGain();
        dry.gain.value = 1;
        source.connect(dry).connect(state.compressor);
        if (reverbAmount) {
            const send = context.createGain();
            send.gain.value = reverbAmount;
            source.connect(send).connect(state.reverb);
        }
    }

    function loadSamples() {
        const context = ensureAudio();
        if (!context) return Promise.reject(new Error("AudioContext unavailable"));
        if (state.samples.size === SAMPLE_NOTES.length) return Promise.resolve();
        if (state.loading) return state.loading;
        state.loading = Promise.all(SAMPLE_NOTES.map(function (sample) {
            return fetch("assets/piano/" + sample.file)
                .then(function (response) {
                    if (!response.ok) throw new Error("Piano sample load failed");
                    return response.arrayBuffer();
                })
                .then(function (data) { return context.decodeAudioData(data); })
                .then(function (buffer) { state.samples.set(sample.midi, buffer); });
        })).catch(function (error) {
            state.loading = null;
            throw error;
        });
        return state.loading;
    }

    function nearestSample(midi) {
        return SAMPLE_NOTES.reduce(function (nearest, sample) {
            return Math.abs(sample.midi - midi) < Math.abs(nearest.midi - midi) ? sample : nearest;
        }, SAMPLE_NOTES[0]);
    }

    function playLoadedMidi(midi, when, duration, volume, panAmount) {
        const context = ensureAudio();
        const sample = nearestSample(midi);
        const buffer = state.samples.get(sample.midi);
        if (!context || !buffer) return false;
        const start = Math.max(context.currentTime, when || context.currentTime);
        const hold = Math.max(.16, duration || .72);
        const release = .38;
        const output = context.createGain();
        const panner = typeof context.createStereoPanner === "function" ? context.createStereoPanner() : null;
        const source = context.createBufferSource();
        const peak = Math.min(.17, Math.max(.018, volume || .09));
        source.buffer = buffer;
        source.playbackRate.value = Math.pow(2, (midi - sample.midi) / 12);
        output.gain.setValueAtTime(.0001, start);
        output.gain.exponentialRampToValueAtTime(peak, start + .004);
        output.gain.exponentialRampToValueAtTime(peak * .72, start + Math.min(.16, hold * .45));
        output.gain.setValueAtTime(peak * .72, start + hold);
        output.gain.exponentialRampToValueAtTime(.0001, start + hold + release);
        source.connect(output);
        if (panner) {
            panner.pan.value = Math.max(-.35, Math.min(.35, panAmount || 0));
            output.connect(panner);
            connectToMix(panner, .055);
        } else {
            connectToMix(output, .055);
        }
        source.start(start, Math.min(.012, Math.max(0, buffer.duration - .01)));
        source.stop(start + Math.min(buffer.duration / source.playbackRate.value, hold + release + .1));
        return true;
    }

    function playSynthetic(midi, when, duration, volume) {
        const context = ensureAudio();
        if (!context) return;
        const start = Math.max(context.currentTime, when || context.currentTime);
        const frequency = 440 * Math.pow(2, (midi - 69) / 12);
        const length = duration || .65;
        const envelope = context.createGain();
        const filter = context.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = Math.min(4800, frequency * 11);
        envelope.gain.setValueAtTime(.0001, start);
        envelope.gain.exponentialRampToValueAtTime(Math.min(.09, volume || .055), start + .004);
        envelope.gain.exponentialRampToValueAtTime(.0001, start + length + .28);
        filter.connect(envelope);
        connectToMix(envelope, .035);
        [1, 2, 3].forEach(function (ratio, index) {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = frequency * ratio;
            gain.gain.value = [1, .16, .045][index];
            oscillator.connect(gain).connect(filter);
            oscillator.start(start);
            oscillator.stop(start + length + .3);
        });
    }

    function playMidi(midi, options) {
        const settings = options || {};
        const context = ensureAudio();
        if (!context) return Promise.reject(new Error("이 브라우저는 오디오를 지원하지 않습니다."));
        return loadSamples().then(function () {
            playLoadedMidi(midi, settings.when, settings.duration, settings.volume, settings.pan);
        }).catch(function () {
            playSynthetic(midi, settings.when, settings.duration, settings.volume);
        });
    }

    function playNotes(midis, options) {
        const settings = options || {};
        const context = ensureAudio();
        if (!context) return Promise.reject(new Error("이 브라우저는 오디오를 지원하지 않습니다."));
        return loadSamples().then(function () {
            const start = context.currentTime + (settings.delay || .04);
            const gap = settings.arpeggio || 0;
            midis.forEach(function (midi, index) {
                const pan = midis.length > 1 ? -0.18 + index * (.36 / Math.max(1, midis.length - 1)) : 0;
                const voiceVolume = settings.volume || Math.min(.13, .2 / Math.sqrt(Math.max(1, midis.length)));
                playLoadedMidi(midi, start + index * gap, settings.duration || .72, voiceVolume, pan);
            });
        }).catch(function () {
            midis.forEach(function (midi, index) { playSynthetic(midi, context.currentTime + index * (settings.arpeggio || 0), settings.duration, settings.volume); });
        });
    }

    function playSequence(groups, beatSeconds) {
        const context = ensureAudio();
        if (!context) return Promise.reject(new Error("이 브라우저는 오디오를 지원하지 않습니다."));
        return loadSamples().then(function () {
            const start = context.currentTime + .05;
            groups.forEach(function (group, index) {
                const chord = group.length > 1;
                // 화음 문제는 여러 음이 겹쳐도 충분히 또렷하게 들리도록 한다.
                // 기존 값은 3~4음 화음에서 지나치게 작게 제한됐다.
                const volume = chord ? Math.min(.11, .22 / Math.sqrt(group.length)) : .13;
                const length = chord ? Math.max(.28, beatSeconds * .68) : Math.max(.18, beatSeconds * .72);
                group.forEach(function (midi, noteIndex) {
                    const pan = group.length > 1 ? -.2 + noteIndex * (.4 / Math.max(1, group.length - 1)) : 0;
                    playLoadedMidi(midi, start + index * beatSeconds, length, volume, pan);
                });
            });
        }).catch(function () {
            groups.forEach(function (group, index) {
                const volume = group.length > 1 ? .045 / Math.sqrt(group.length) : .06;
                group.forEach(function (midi) { playSynthetic(midi, context.currentTime + index * beatSeconds, beatSeconds * .65, volume); });
            });
        });
    }

    /*
     * 메트로놈 소리. 나무를 때리는 마른 「똑」이라, 아주 짧은 잡음 한 방을 좁은
     * 띠로 걸러 공명만 남긴다. 잡음이 길거나 띠가 넓으면 메트로놈이 아니라
     * 하이햇처럼 들린다. 첫 박에는 종을 얹는다 — 메트로놈의 그 「띵」이다.
     * 울림(reverb)은 거의 주지 않는다. 메트로놈은 마른 소리여야 박이 또렷하다.
     */
    function tick(when, strong) {
        const context = ensureAudio();
        if (!context) return;
        const start = Math.max(context.currentTime, when);

        const body = context.createBiquadFilter();
        body.type = "bandpass";
        body.frequency.value = strong ? 2200 : 1350;
        body.Q.value = 4.5;
        const bodyGain = context.createGain();
        bodyGain.gain.setValueAtTime(.0001, start);
        bodyGain.gain.exponentialRampToValueAtTime(strong ? .55 : .38, start + .001);
        bodyGain.gain.exponentialRampToValueAtTime(.0001, start + (strong ? .065 : .05));
        body.connect(bodyGain);
        connectToMix(bodyGain, .004);

        const noise = context.createBufferSource();
        const length = Math.floor(context.sampleRate * .04);
        const buffer = context.createBuffer(1, length, context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let index = 0; index < length; index += 1) {
            data[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / length, 6);
        }
        noise.buffer = buffer;
        noise.connect(body);
        noise.start(start);
        noise.stop(start + .05);

        if (!strong) return;
        const bell = context.createOscillator();
        const bellGain = context.createGain();
        bell.type = "sine";
        bell.frequency.value = 2637;
        bellGain.gain.setValueAtTime(.0001, start);
        bellGain.gain.exponentialRampToValueAtTime(.11, start + .003);
        bellGain.gain.exponentialRampToValueAtTime(.0001, start + .26);
        bell.connect(bellGain);
        connectToMix(bellGain, .012);
        bell.start(start);
        bell.stop(start + .29);
    }

    /*
     * 리듬을 울리는 소리는 피아노 도(C4)다. 메트로놈과 같은 타격음으로 울리면
     * 박을 세어 주는 소리와 리듬이 섞여 어느 것이 문제인지 알 수 없다.
     * 표본을 아직 못 받았으면 합성음으로 대신 울린다(다음 번에는 피아노가 된다).
     */
    const RHYTHM_MIDI = 60;

    function rhythmNote(when, strong) {
        loadSamples();
        if (playLoadedMidi(RHYTHM_MIDI, when, .5, strong ? .14 : .105, 0)) return;
        playSynthetic(RHYTHM_MIDI, when, .45, strong ? .075 : .055);
    }

    /*
     * 리듬을 울린다. beats는 4분음표 하나를 1로 센 치는 자리이며
     * countIn만큼 미리 박을 세어 준다. 첫 박이 울리는 시각을 돌려준다.
     */
    function playRhythm(beats, beatSeconds, options) {
        const settings = options || {};
        const context = ensureAudio();
        if (!context) return null;
        const countIn = settings.countIn === undefined ? 4 : settings.countIn;
        const lead = context.currentTime + .18;
        for (let beat = 0; beat < countIn; beat += 1) {
            tick(lead + beat * beatSeconds, beat === 0);
        }
        const zero = lead + countIn * beatSeconds;
        beats.forEach(position => rhythmNote(zero + position * beatSeconds,
            position === 0 && settings.accentFirst !== false));
        return zero;
    }

    function metronome(count, beatSeconds) {
        const context = ensureAudio();
        if (!context) return null;
        const lead = context.currentTime + .18;
        for (let beat = 0; beat < count; beat += 1) tick(lead + beat * beatSeconds, beat % 4 === 0);
        return lead;
    }

    function audioNow() {
        const context = ensureAudio();
        return context ? context.currentTime : 0;
    }

    window.PianoEngine = {
        playMidi: playMidi,
        playNotes: playNotes,
        playSequence: playSequence,
        playRhythm: playRhythm,
        metronome: metronome,
        now: audioNow,
        preload: loadSamples
    };
})();
