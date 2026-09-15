(function () {
    "use strict";

    const core = window.InstrumentRoomCore;
    const PIANO_SAMPLES = [
        { midi: 36, file: "C2.ogg" }, { midi: 42, file: "Fs2.ogg" },
        { midi: 48, file: "C3.ogg" }, { midi: 54, file: "Fs3.ogg" },
        { midi: 60, file: "C4.ogg" }, { midi: 66, file: "Fs4.ogg" },
        { midi: 72, file: "C5.ogg" }, { midi: 78, file: "Fs5.ogg" },
        { midi: 84, file: "C6.ogg" }
    ];
    const GRAND_SAMPLE_STEP = 1;
    const KEYBOARD_SAMPLE_CACHE_LIMIT = 112;
    const RANGE_PRELOAD_CONCURRENCY = 3;
    // Each decoded file gets its own onset measurement.
    // Keep a generous lead-in so breath, bow and pick transients are not shaved.
    const SAMPLED_NOTE_ATTACK_LEAD = .012;

    const KEYBOARD_SAMPLE_SETS = Object.freeze({
        "concert-grand": Object.freeze({ id: "concert-grand", root: "assets/audio/concert-grand/", min: 21, max: 108, fileMin: 21, step: 1, gainDb: 6.03 }),
        "upright-piano": Object.freeze({ id: "upright-piano", root: "assets/audio/upright-piano/", min: 21, max: 108, fileMin: 21, step: 1, gainDb: 9.0 }),
        "harpsichord": Object.freeze({ id: "harpsichord", root: "assets/audio/harpsichord/", min: 48, max: 86, fileMin: 21, step: 1, gainDb: 20.0 }),
        "tine-ep": Object.freeze({ id: "tine-ep", root: "assets/audio/fender-rhodes/", min: 21, max: 108, fileMin: 21, step: 1, gainDb: 1.89 }),
        "reed-ep": Object.freeze({ id: "reed-ep", root: "assets/audio/wurlitzer/", min: 21, max: 108, fileMin: 21, step: 1, gainDb: 1.68 }),
        "clavinet": Object.freeze({ id: "clavinet", root: "assets/audio/clavinet/", min: 21, max: 108, fileMin: 21, step: 1, gainDb: 9.0 }),
        "fm-dx7": Object.freeze({ id: "fm-dx7", root: "assets/audio/fm-dx7/", min: 21, max: 108, fileMin: 21, step: 1, gainDb: 7.07 }),
        "jd800": Object.freeze({ id: "jd800", root: "assets/audio/jd800/", min: 21, max: 108, fileMin: 21, step: 1, gainDb: 6.58 }),
        "hybrid-la-rhodes": Object.freeze({ id: "hybrid-la-rhodes", root: "assets/audio/hybrid-la-rhodes/", min: 21, max: 108, fileMin: 21, step: 1, gainDb: 6.04 }),
        "hybrid-la-mks": Object.freeze({ id: "hybrid-la-mks", root: "assets/audio/hybrid-la-mks/", min: 21, max: 108, fileMin: 21, step: 1, gainDb: 5.82 }),
        "hammond-organ": Object.freeze({ id: "hammond-organ", root: "assets/audio/hammond-organ/", min: 36, max: 96, fileMin: 21, step: 1, gainDb: 4.94 }),
        "pipe-organ": Object.freeze({ id: "pipe-organ", root: "assets/audio/pipe-organ/", min: 36, max: 96, fileMin: 21, step: 1, gainDb: 7.72 }),
        "haegeum": Object.freeze({ id: "haegeum", root: "assets/audio/haegeum/", min: 55, max: 79, fileMin: 21, step: 1, gainDb: -1.46, startOffset: 0, loopStart: 1.1, loopEnd: 3.85 }),
        "haegeum-vibrato": Object.freeze({ id: "haegeum-vibrato", root: "assets/audio/haegeum-vibrato/", min: 59, max: 79, fileMin: 21, step: 1, gainDb: -1.63, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "daegeum": Object.freeze({ id: "daegeum", root: "assets/audio/daegeum/", min: 59, max: 89, fileMin: 21, step: 1, gainDb: -5.69, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "daegeum-vibrato": Object.freeze({ id: "daegeum-vibrato", root: "assets/audio/daegeum-vibrato/", min: 59, max: 89, fileMin: 21, step: 1, gainDb: -2.91, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "hyangpiri": Object.freeze({ id: "hyangpiri", root: "assets/audio/hyangpiri/", min: 59, max: 77, fileMin: 21, step: 1, gainDb: 6.5, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "hyangpiri-vibrato": Object.freeze({ id: "hyangpiri-vibrato", root: "assets/audio/hyangpiri-vibrato/", min: 59, max: 77, fileMin: 21, step: 1, gainDb: 6.18, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "taepyeongso": Object.freeze({ id: "taepyeongso", root: "assets/audio/taepyeongso/", min: 68, max: 89, fileMin: 21, step: 1, gainDb: -4.5, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "gayageum": Object.freeze({ id: "gayageum", root: "assets/audio/gayageum-sanjo/", min: 43, max: 77, fileMin: 21, step: 1, gainDb: 6.43, startOffset: 0 }),
        "gayageum-slow-vibrato": Object.freeze({ id: "gayageum-slow-vibrato", root: "assets/audio/gayageum-sanjo-slow-vibrato/", min: 43, max: 77, fileMin: 21, step: 1, gainDb: 2.25, startOffset: 0 }),
        "gayageum-fast-vibrato": Object.freeze({ id: "gayageum-fast-vibrato", root: "assets/audio/gayageum-sanjo-fast-vibrato/", min: 43, max: 77, fileMin: 21, step: 1, gainDb: 1.84, startOffset: 0 }),
        "gayageum-roll": Object.freeze({ id: "gayageum-roll", root: "assets/audio/gayageum-sanjo-roll/", min: 43, max: 77, fileMin: 21, step: 1, gainDb: 4.07, startOffset: 0 }),
        "gayageum-bend-down": Object.freeze({ id: "gayageum-bend-down", root: "assets/audio/gayageum-sanjo-bend-down/", min: 43, max: 77, fileMin: 21, step: 1, gainDb: 4.23, startOffset: 0 }),
        "gayageum-bend-up": Object.freeze({ id: "gayageum-bend-up", root: "assets/audio/gayageum-sanjo-bend-up/", min: 43, max: 77, fileMin: 21, step: 1, gainDb: 9, startOffset: 0 }),
        "geomungo": Object.freeze({ id: "geomungo", root: "assets/audio/geomungo/", min: 46, max: 77, fileMin: 21, step: 1, gainDb: 9, startOffset: 0 }),
        "geomungo-light-vibrato": Object.freeze({ id: "geomungo-light-vibrato", root: "assets/audio/geomungo-light-vibrato/", min: 46, max: 77, fileMin: 21, step: 1, gainDb: 13, startOffset: 0 }),
        "geomungo-deep-vibrato": Object.freeze({ id: "geomungo-deep-vibrato", root: "assets/audio/geomungo-deep-vibrato/", min: 46, max: 77, fileMin: 21, step: 1, gainDb: 13, startOffset: 0 }),
        "gayageum-25": Object.freeze({ id: "gayageum-25", root: "assets/audio/gayageum-25/", min: 43, max: 81, fileMin: 21, step: 1, gainDb: 18.6, startOffset: 0 }),
        "yanggeum": Object.freeze({ id: "yanggeum", root: "assets/audio/yanggeum/", min: 51, max: 80, fileMin: 21, step: 1, gainDb: 9, startOffset: 0 }),
        "yanggeum-tremolo": Object.freeze({ id: "yanggeum-tremolo", root: "assets/audio/yanggeum-tremolo/", min: 51, max: 80, fileMin: 21, step: 1, gainDb: 9, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "ajaeng": Object.freeze({ id: "ajaeng", root: "assets/audio/ajaeng/", min: 43, max: 78, fileMin: 21, step: 1, gainDb: 7.46, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "ajaeng-vibrato": Object.freeze({ id: "ajaeng-vibrato", root: "assets/audio/ajaeng-vibrato/", min: 43, max: 78, fileMin: 21, step: 1, gainDb: 17.1, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "sogeum": Object.freeze({ id: "sogeum", root: "assets/audio/sogeum/", min: 70, max: 93, fileMin: 21, step: 1, gainDb: -0.91, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "danso": Object.freeze({ id: "danso", root: "assets/audio/danso/", min: 66, max: 92, fileMin: 21, step: 1, gainDb: 2.26, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "danso-vibrato": Object.freeze({ id: "danso-vibrato", root: "assets/audio/danso-vibrato/", min: 66, max: 92, fileMin: 21, step: 1, gainDb: 0.25, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "hun": Object.freeze({ id: "hun", root: "assets/audio/hun/", min: 60, max: 71, fileMin: 21, step: 1, gainDb: 3.62, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "pyeonjong": Object.freeze({ id: "pyeonjong", root: "assets/audio/pyeonjong/", min: 60, max: 75, fileMin: 21, step: 1, gainDb: 9, startOffset: 0 }),
        "pyeongyeong": Object.freeze({ id: "pyeongyeong", root: "assets/audio/pyeongyeong/", min: 72, max: 87, fileMin: 21, step: 1, gainDb: 9, startOffset: 0 }),
        // RMS-only calibration made the rounded ocarina tone feel recessed; keep a perceptual lift with ample peak headroom.
        "ocarina": Object.freeze({ id: "ocarina", root: "assets/audio/ocarina/", min: 60, max: 86, fileMin: 21, step: 1, gainDb: -4.5, startOffset: 0, loopStart: 1.1, loopEnd: 3.8 }),
        "recorder-piccolo": Object.freeze({ id: "recorder-piccolo", root: "assets/audio/recorder-piccolo/", min: 77, max: 104, fileMin: 21, step: 1, gainDb: 0.7 }),
        "recorder-soprano": Object.freeze({ id: "recorder-soprano", root: "assets/audio/recorder-soprano/", min: 72, max: 101, fileMin: 21, step: 1, gainDb: 2.0 }),
        "recorder-alto": Object.freeze({ id: "recorder-alto", root: "assets/audio/recorder-alto/", min: 65, max: 89, fileMin: 21, step: 1, gainDb: 7.1 }),
        "recorder-tenor": Object.freeze({ id: "recorder-tenor", root: "assets/audio/recorder-tenor/", min: 60, max: 84, fileMin: 21, step: 1, gainDb: 6.2 }),
        "flute": Object.freeze({ id: "flute", root: "assets/audio/flute/", min: 60, max: 96, fileMin: 21, step: 1, gainDb: 6.83 }),
        "oboe": Object.freeze({ id: "oboe", root: "assets/audio/oboe/", min: 58, max: 91, fileMin: 21, step: 1, gainDb: 4.35 }),
        "trumpet": Object.freeze({ id: "trumpet", root: "assets/audio/trumpet/", min: 52, max: 97, fileMin: 21, step: 1, gainDb: -2.92 }),
        "clarinet": Object.freeze({ id: "clarinet", root: "assets/audio/clarinet/", min: 50, max: 88, fileMin: 21, step: 1, gainDb: 2.89 }),
        "bass-clarinet": Object.freeze({ id: "bass-clarinet", root: "assets/audio/bass-clarinet/", min: 44, max: 95, fileMin: 21, step: 1, gainDb: 0.05 }),
        "piccolo-flute": Object.freeze({ id: "piccolo-flute", root: "assets/audio/piccolo-flute/", min: 72, max: 108, fileMin: 21, step: 1, gainDb: 9.0 }),
        "french-horn": Object.freeze({ id: "french-horn", root: "assets/audio/french-horn/", min: 47, max: 93, fileMin: 21, step: 1, gainDb: -2.93 }),
        "english-horn": Object.freeze({ id: "english-horn", root: "assets/audio/english-horn/", min: 52, max: 83, fileMin: 21, step: 1, gainDb: 4.38 }),
        "soprano-sax": Object.freeze({ id: "soprano-sax", root: "assets/audio/soprano-sax/", min: 53, max: 94, fileMin: 21, step: 1, gainDb: -1.38 }),
        "saxophone": Object.freeze({ id: "saxophone", root: "assets/audio/alto-sax/", min: 46, max: 92, fileMin: 21, step: 1, gainDb: -0.11 }),
        "tenor-sax": Object.freeze({ id: "tenor-sax", root: "assets/audio/tenor-sax/", min: 53, max: 102, fileMin: 21, step: 1, gainDb: 0.37 }),
        "baritone-sax": Object.freeze({ id: "baritone-sax", root: "assets/audio/baritone-sax/", min: 45, max: 100, fileMin: 21, step: 1, gainDb: -0.93 }),
        "bassoon": Object.freeze({ id: "bassoon", root: "assets/audio/bassoon/", min: 34, max: 75, fileMin: 21, step: 1, gainDb: 6.91 }),
        "contrabassoon": Object.freeze({ id: "contrabassoon", root: "assets/audio/contrabassoon/", min: 32, max: 80, fileMin: 21, step: 1, gainDb: -2.46 }),
        "alto-trombone": Object.freeze({ id: "alto-trombone", root: "assets/audio/alto-trombone/", min: 45, max: 88, fileMin: 21, step: 1, gainDb: -4.59 }),
        "trombone": Object.freeze({ id: "trombone", root: "assets/audio/tenor-trombone/", min: 52, max: 97, fileMin: 21, step: 1, gainDb: -5.68 }),
        "bass-trombone": Object.freeze({ id: "bass-trombone", root: "assets/audio/bass-trombone/", min: 35, max: 92, fileMin: 21, step: 1, gainDb: -3.85 }),
        "tuba": Object.freeze({ id: "tuba", root: "assets/audio/bass-tuba/", min: 40, max: 96, fileMin: 21, step: 1, gainDb: -4.31 }),
        "euphonium": Object.freeze({ id: "euphonium", root: "assets/audio/euphonium/", min: 40, max: 94, fileMin: 21, step: 1, gainDb: -2.93 }),
        "flugelhorn": Object.freeze({ id: "flugelhorn", root: "assets/audio/flugelhorn/", min: 52, max: 92, fileMin: 21, step: 1, gainDb: -5.56 }),
        "viola": Object.freeze({ id: "viola", root: "assets/audio/viola/", min: 48, max: 108, fileMin: 21, step: 1, gainDb: 0.59, revision: "20260901-viola-v2" }),
        "viola-pizz": Object.freeze({ id: "viola-pizz", root: "assets/audio/viola-pizz/", min: 48, max: 89, fileMin: 21, step: 1, gainDb: 9.0 }),
        "violin": Object.freeze({ id: "violin", root: "assets/audio/violin/", min: 55, max: 108, fileMin: 21, step: 1, gainDb: 1.45, revision: "20260901-violin-v2" }),
        "violin-pizz": Object.freeze({ id: "violin-pizz", root: "assets/audio/violin-pizz/", min: 55, max: 100, fileMin: 21, step: 1, gainDb: 9.0 }),
        "cello": Object.freeze({ id: "cello", root: "assets/audio/cello/", min: 48, max: 108, fileMin: 21, step: 1, gainDb: -3.85 }),
        "cello-pizz": Object.freeze({ id: "cello-pizz", root: "assets/audio/cello-pizz/", min: 48, max: 73, fileMin: 21, step: 1, gainDb: 9.0 }),
        "upright-bass": Object.freeze({ id: "upright-bass", root: "assets/audio/upright-bass/", min: 52, max: 108, fileMin: 21, step: 1, gainDb: -4.1 }),
        "upright-bass-pizz": Object.freeze({ id: "upright-bass-pizz", root: "assets/audio/upright-bass-pizz/", min: 52, max: 108, fileMin: 21, step: 1, gainDb: 1.16 }),
        "timpani": Object.freeze({ id: "timpani", root: "assets/audio/timpani/", min: 36, max: 53, fileMin: 21, step: 1, gainDb: 6.5 }),
        "marimba": Object.freeze({ id: "marimba", root: "assets/audio/marimba/", min: 36, max: 96, fileMin: 21, step: 1, gainDb: 7.0 }),
        "vibraphone": Object.freeze({ id: "vibraphone", root: "assets/audio/vibraphone/", min: 53, max: 89, fileMin: 21, step: 1, gainDb: 5.5 }),
        "xylophone": Object.freeze({ id: "xylophone", root: "assets/audio/xylophone/", min: 48, max: 89, fileMin: 21, step: 1, gainDb: 6.5 }),
        "p-bass-finger": Object.freeze({ id: "p-bass-finger", root: "assets/audio/p-bass-finger-v4/", min: 28, max: 63, fileMin: 21, step: 1, gainDb: 2.6, revision: "20260901-p-finger-v4" }),
        "p-bass-pick": Object.freeze({ id: "p-bass-pick", root: "assets/audio/p-bass-pick-v4/", min: 28, max: 63, fileMin: 21, step: 1, gainDb: 0.4, revision: "20260901-p-pick-v4" }),
        "p-bass-slap": Object.freeze({ id: "p-bass-slap", root: "assets/audio/p-bass-slap-v4/", min: 28, max: 62, fileMin: 21, step: 1, gainDb: 8.6, revision: "20260901-p-slap-v4" }),
        "j-bass-finger": Object.freeze({ id: "j-bass-finger", root: "assets/audio/j-bass-finger-v4/", min: 28, max: 63, fileMin: 21, step: 1, gainDb: 1.7, revision: "20260901-j-finger-v4" }),
        "j-bass-pick": Object.freeze({ id: "j-bass-pick", root: "assets/audio/j-bass-pick-v4/", min: 28, max: 62, fileMin: 21, step: 1, gainDb: 0.4, revision: "20260901-j-pick-v4" }),
        "j-bass-slap": Object.freeze({ id: "j-bass-slap", root: "assets/audio/j-bass-slap-v4/", min: 28, max: 62, fileMin: 21, step: 1, gainDb: 8.1, revision: "20260901-j-slap-v4" }),
        "active-bass-finger": Object.freeze({ id: "active-bass-finger", root: "assets/audio/active-bass-finger/", min: 23, max: 62, fileMin: 21, step: 1, gainDb: 0.0 }),
        "active-bass-pick": Object.freeze({ id: "active-bass-pick", root: "assets/audio/active-bass-pick/", min: 23, max: 62, fileMin: 21, step: 1, gainDb: 0.0 }),
        "active-bass-slap": Object.freeze({ id: "active-bass-slap", root: "assets/audio/active-bass-slap/", min: 23, max: 62, fileMin: 21, step: 1, gainDb: 10.0 }),
        "fretless-bass-finger": Object.freeze({ id: "fretless-bass-finger", root: "assets/audio/fretless-bass-finger/", min: 28, max: 63, fileMin: 21, step: 1, gainDb: 4.0, revision: "20260901-fretless-finger-v3" }),
        "fretless-bass-pick": Object.freeze({ id: "fretless-bass-pick", root: "assets/audio/fretless-bass-pick/", min: 28, max: 62, fileMin: 21, step: 1, gainDb: 2.5 }),
        "fretless-bass-slap": Object.freeze({ id: "fretless-bass-slap", root: "assets/audio/fretless-bass-slap/", min: 28, max: 62, fileMin: 21, step: 1, gainDb: 10.0 }),
        "guitar-s-clean": Object.freeze({ id: "guitar-s-clean", root: "assets/audio/guitar-s-clean/", min: 40, max: 86, fileMin: 21, step: 1, gainDb: 5.5, startOffset: 0, revision: "20260902-clean-tone-v4", anchors: Object.freeze([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86]) }),
        "guitar-s-blues": Object.freeze({ id: "guitar-s-blues", root: "assets/audio/guitar-s-blues/", min: 40, max: 86, fileMin: 21, step: 1, gainDb: 4.0, startOffset: 0, revision: "20260902-blues-tone-v4", anchors: Object.freeze([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86]) }),
        "guitar-s-funk": Object.freeze({ id: "guitar-s-funk", root: "assets/audio/guitar-s-funk/", min: 40, max: 86, fileMin: 21, step: 1, gainDb: 25.1, startOffset: 0, revision: "20260902-funk-tone-v4", anchors: Object.freeze([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86]) }),
        "guitar-s-rock": Object.freeze({ id: "guitar-s-rock", root: "assets/audio/guitar-s-rock/", min: 40, max: 86, fileMin: 21, step: 1, gainDb: 2.0, startOffset: 0, revision: "20260902-rock-tone-v4", anchors: Object.freeze([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86]) }),
        "guitar-superstrat": Object.freeze({ id: "guitar-superstrat", root: "assets/audio/guitar-superstrat/", min: 40, max: 84, fileMin: 21, step: 1, gainDb: -1.5, startOffset: 0, revision: "20260902-superstrat-tone-v4", anchors: Object.freeze([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84]) }),
        "guitar-hollow": Object.freeze({ id: "guitar-hollow", root: "assets/audio/guitar-hollow/", min: 40, max: 86, fileMin: 21, step: 1, gainDb: 13.0, startOffset: 0, revision: "20260902-hollow-tone-v4", anchors: Object.freeze([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86]) }),
        "guitar-nylon": Object.freeze({ id: "guitar-nylon", root: "assets/audio/guitar-nylon/", min: 40, max: 84, fileMin: 21, step: 1, gainDb: 16.5, startOffset: 0, revision: "20260902-nylon-tone-v4", anchors: Object.freeze([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84]) }),
        "guitar-steel": Object.freeze({ id: "guitar-steel", root: "assets/audio/guitar-steel/", min: 40, max: 84, fileMin: 21, step: 1, gainDb: 25.0, startOffset: 0, revision: "20260902-steel-tone-v2", anchors: Object.freeze([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84]) }),
        "harp": Object.freeze({ id: "harp", root: "assets/audio/harp/", min: 25, max: 102, fileMin: 21, step: 1, gainDb: 14.0 }),
        "piccolo-trumpet": Object.freeze({ id: "piccolo-trumpet", root: "assets/audio/piccolo-trumpet/", min: 52, max: 100, fileMin: 21, step: 1, gainDb: 1.5 }),
        "glockenspiel": Object.freeze({ id: "glockenspiel", root: "assets/audio/glockenspiel/", min: 79, max: 95, fileMin: 21, step: 1, gainDb: 33.1 })
    });
    const ONE_SHOT_SAMPLE_SETS = new Set(["timpani", "glockenspiel", "marimba", "vibraphone", "xylophone", "harp", "gayageum", "gayageum-slow-vibrato", "gayageum-fast-vibrato", "gayageum-roll", "gayageum-bend-down", "gayageum-bend-up", "geomungo", "geomungo-light-vibrato", "geomungo-deep-vibrato", "gayageum-25", "yanggeum", "pyeonjong", "pyeongyeong"]);
    const COMPUTER_KEYS = [
        ["KeyA", 0, "A"], ["KeyW", 1, "W"], ["KeyS", 2, "S"], ["KeyE", 3, "E"],
        ["KeyD", 4, "D"], ["KeyF", 5, "F"], ["KeyT", 6, "T"], ["KeyG", 7, "G"],
        ["KeyY", 8, "Y"], ["KeyH", 9, "H"], ["KeyU", 10, "U"], ["KeyJ", 11, "J"],
        ["KeyK", 12, "K"], ["KeyO", 13, "O"], ["KeyL", 14, "L"], ["KeyP", 15, "P"],
        ["Semicolon", 16, ";"], ["Quote", 17, "'"]
    ];
    const DISPLAY_RANGE = { start: 21, end: 108 };
    const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);
    const COMPUTER_KEY_SPAN = COMPUTER_KEYS[COMPUTER_KEYS.length - 1][1];
    const PIANO_WHITE_KEY_MM = { width: 23.5, length: 150 };
    const PIANO_BLACK_KEY_MM = { width: 13.7, length: 95 };
    const WHITE_KEY_LENGTH_SCALE = 0.726;
    const BLACK_KEY_LENGTH_SCALE = 0.62;
    const REFERENCE_CARD_MM = 85.6;
    const CSS_PX_PER_MM = 96 / 25.4;
    const KEY_SIZE_STORAGE = "instrument-room-key-size-v1";

    const DRUMS = [
        { id: "kick", name: "킥", family: "MEMBRANE", key: "A", code: "KeyA", color: "#8ef0c6" },
        { id: "snare", name: "스네어", family: "WIRE + SHELL", key: "S", code: "KeyS", color: "#ff9d66" },
        { id: "ghost", name: "스네어 고스트노트", family: "LOW VELOCITY SNARE", key: "W", code: "KeyW", color: "#d88a72" },
        { id: "sidestick", name: "사이드스틱", family: "CROSS STICK", key: "E", code: "KeyE", color: "#d8b87a" },
        { id: "rimshot", name: "림샷", family: "RIM + HEAD", key: "R", code: "KeyR", color: "#ff7d66" },
        { id: "rimclick", name: "림클릭", family: "RIM CLICK", key: "Q", code: "KeyQ", color: "#ffb27a" },
        { id: "hat", name: "닫힌 하이햇", family: "METAL", key: "D", code: "KeyD", color: "#e5ff75" },
        { id: "pedalhat", name: "풋 하이햇", family: "PEDAL HI-HAT", key: "C", code: "KeyC", color: "#d3ef83" },
        { id: "openhat", name: "열린 하이햇", family: "METAL", key: "F", code: "KeyF", color: "#f7db80" },
        { id: "hightom", name: "하이 탐", family: "MEMBRANE", key: "G", code: "KeyG", color: "#9c91ff" },
        { id: "midtom", name: "미드 탐", family: "MEMBRANE", key: "H", code: "KeyH", color: "#77d4ff" },
        { id: "lowtom", name: "플로어 탐", family: "MEMBRANE", key: "J", code: "KeyJ", color: "#7bb7ff" },

        { id: "crash", name: "크래시", family: "METAL", key: "K", code: "KeyK", color: "#ffcf5c" },
        { id: "ride", name: "라이드", family: "METAL", key: "L", code: "KeyL", color: "#f09cff" },
        { id: "ridebell", name: "라이드 벨", family: "BELL", key: "O", code: "KeyO", color: "#efb5ff" }
    ];

    const AD2_DRUM_ARTICULATIONS = Object.freeze([
        "kick", "snare", "ghost", "rimshot", "sidestick", "rimclick",
        "hat", "pedalhat", "openhat", "hightom", "midtom", "lowtom",
        "crash", "ride", "ridebell"
    ]);
    const DRUM_KIT_PARTS = {
        "rock-kit": AD2_DRUM_ARTICULATIONS,
        "pop-kit": AD2_DRUM_ARTICULATIONS,
        "funk-kit": AD2_DRUM_ARTICULATIONS,
        "jazz-kit": AD2_DRUM_ARTICULATIONS,
        "metal-kit": AD2_DRUM_ARTICULATIONS,
        "drum-808": AD2_DRUM_ARTICULATIONS,
        "linn-machine": AD2_DRUM_ARTICULATIONS
    };

    // The official XLN Audio AD2 keymap assigns note 49 to HiHat Closed 1 Tip.
    // Keep this revision in the URL so a previously cached, mis-mapped hat cannot survive a remap.
    const AUDIO_SAMPLE_REVISION = "20260905-original-timbre-v3";
    const AD2_DRUM_SAMPLE_REVISION = "20260902-ad2-original-balance-v2";

    // One uniform scalar per kit preserves the relative balance printed in the source mix.
    // Values place the loudest pad at or below 0.56 peak before the shared velocity scalar.
    const DRUM_KIT_GAIN_DB = Object.freeze({
        "drums-rock": 2.38,
        "drums-metal": -2.33,
        "drums-pop": 1.91,
        "drums-jazz": -0.79,
        "drums-funk": -1.24,
        "drums-linn": 6.58,
        "drums-808": 4.10
    });

    // Measured peak level of each source file puts closed hi-hat 20+ dB under the
    // kick/snare in several kits, well past the rest of the kit's spread. Nudge just
    // that piece back up rather than re-touching the whole kit's printed balance.
    const DRUM_PIECE_BOOST_DB = Object.freeze({
        "drums-rock": Object.freeze({ hat: 8 }),
        "drums-metal": Object.freeze({ hat: 8 }),
        "drums-pop": Object.freeze({ hat: 8, openhat: 8 }),
        "drums-funk": Object.freeze({ hat: 8 }),
        "drums-linn": Object.freeze({ hat: 8 })
    });

    const DRUM_SAMPLE_SETS = Object.freeze({
        "rock-kit": Object.freeze({ id: "drums-rock", root: "assets/audio/drums-rock/", gainDb: DRUM_KIT_GAIN_DB["drums-rock"], pieceBoostDb: DRUM_PIECE_BOOST_DB["drums-rock"] }),
        "metal-kit": Object.freeze({ id: "drums-metal", root: "assets/audio/drums-metal/", gainDb: DRUM_KIT_GAIN_DB["drums-metal"], pieceBoostDb: DRUM_PIECE_BOOST_DB["drums-metal"] }),
        "pop-kit": Object.freeze({ id: "drums-pop", root: "assets/audio/drums-pop/", gainDb: DRUM_KIT_GAIN_DB["drums-pop"], pieceBoostDb: DRUM_PIECE_BOOST_DB["drums-pop"] }),
        "jazz-kit": Object.freeze({ id: "drums-jazz", root: "assets/audio/drums-jazz/", gainDb: DRUM_KIT_GAIN_DB["drums-jazz"] }),
        "funk-kit": Object.freeze({ id: "drums-funk", root: "assets/audio/drums-funk/", gainDb: DRUM_KIT_GAIN_DB["drums-funk"], pieceBoostDb: DRUM_PIECE_BOOST_DB["drums-funk"] }),
        "linn-machine": Object.freeze({ id: "drums-linn", root: "assets/audio/drums-linn/", gainDb: DRUM_KIT_GAIN_DB["drums-linn"], pieceBoostDb: DRUM_PIECE_BOOST_DB["drums-linn"] }),
        "drum-808": Object.freeze({ id: "drums-808", root: "assets/audio/drums-808/", gainDb: DRUM_KIT_GAIN_DB["drums-808"] }),
        "orchestral-percussion": Object.freeze({ id: "orchestral-percussion", root: "assets/audio/orchestral-percussion/", available: Object.freeze(["ride"]), gainDb: Object.freeze({ ride: 3 }) })
    });
    const KOREAN_PERCUSSION_PADS = window.KOREAN_PERCUSSION_DATA ? window.KOREAN_PERCUSSION_DATA.pads : Object.freeze({});
    const KOREAN_PERCUSSION_SAMPLE_SETS = window.KOREAN_PERCUSSION_DATA ? window.KOREAN_PERCUSSION_DATA.samples : Object.freeze({});

    const STATION_DRUMS = {
        "orchestral-percussion": [
            { id: "orchestral-snare", sound: "snare", name: "스네어드럼", family: "CONCERT SNARE", key: "A", code: "KeyA", color: "#ff9d66" },
            { id: "orchestral-bass-drum", sound: "kick", name: "베이스드럼", family: "CONCERT BASS DRUM", key: "S", code: "KeyS", color: "#8ef0c6" },
            { id: "orchestral-suspended-cymbal", sound: "crash", name: "서스펜디드 심벌", family: "SUSPENDED CYMBAL", key: "D", code: "KeyD", color: "#e5ff75" },
            { id: "orchestral-tamtam", sound: "ride", name: "탐탐", family: "TAM-TAM", key: "F", code: "KeyF", color: "#ffcf5c" },
            { id: "orchestral-triangle", sound: "hat", name: "트라이앵글", family: "TRIANGLE", key: "G", code: "KeyG", color: "#9c91ff" }
        ],
        "ritual-signals": [
            { id: "bak", sound: "snare", name: "박", family: "WOOD CLAPPER", key: "A", code: "KeyA", color: "#ff9d66" },
            { id: "chuk", sound: "lowtom", name: "축", family: "WOOD BOX", key: "S", code: "KeyS", color: "#8ef0c6" },
            { id: "eo", sound: "hightom", name: "어", family: "TIGER SCRAPER", key: "D", code: "KeyD", color: "#e5ff75" }
        ],
        "daechwita-station": [
            { id: "nabal", sound: "ride", name: "나발", family: "BRASS HORN", key: "A", code: "KeyA", color: "#ffcf5c" },
            { id: "nagak", sound: "lowtom", name: "나각", family: "CONCH HORN", key: "S", code: "KeyS", color: "#f09cff" },
            { id: "yonggo", sound: "kick", name: "용고", family: "MARCH DRUM", key: "D", code: "KeyD", color: "#8ef0c6" },
            { id: "jabara", sound: "crash", name: "자바라", family: "BRASS CYMBALS", key: "F", code: "KeyF", color: "#e5ff75" },
            { id: "jing", sound: "ride", name: "징", family: "LARGE GONG", key: "G", code: "KeyG", color: "#ff9d66" },
            { id: "taepyeongso", sound: "hat", name: "태평소", family: "DOUBLE REED", key: "H", code: "KeyH", color: "#9c91ff" }
        ]
    };

    function activeDrums() {
        const defaultParts = ["kick", "snare", "hat", "openhat", "hightom", "lowtom", "crash", "ride"];
        const modelId = state.currentModel && state.currentModel.id;
        if (KOREAN_PERCUSSION_PADS[modelId]) return KOREAN_PERCUSSION_PADS[modelId];
        if (STATION_DRUMS[modelId]) return STATION_DRUMS[modelId];
        const parts = DRUM_KIT_PARTS[modelId] || defaultParts;
        return parts.map(function (id) { return DRUMS.find(function (drum) { return drum.id === id; }); }).filter(Boolean);
    }
    const INSTRUMENT_COPY = {
        piano: { name: "피아노", badge: "88건반", family: "KEYBOARD", model: "A0–C8", description: "A0–C8 전 음역을 건반마다 연주할 수 있어요." },
        bass: { name: "샘플 베이스", badge: "MULTI-ARTICULATION OGG", family: "ELECTRIC BASS", model: "FINGER · PICK · SLAP", description: "악기마다 따로 녹음한 핑거·피크·슬랩 원음을 주법별로 바꾸어 연주해요." },
        guitar: { name: "샘플 기타", badge: "OGG MULTISAMPLE", family: "GUITAR", model: "MODEL-SPECIFIC SOURCE", description: "악기 모델마다 따로 녹음한 원음으로 단음과 코드 스트로크를 연주해요." },
        drums: { name: "모델링 드럼", badge: "MODAL RESONATOR", family: "ACOUSTIC KIT", model: "8 PIECE", description: "막과 금속의 여러 공진 모드를 합성해요. 패드 또는 A–K 키로 바로 연주하세요." }
    };

    const FAMILY_COPY = {
        keyboard: ["KEYBOARD", "건반방"], guitar: ["GUITAR", "기타방"], bass: ["BASS", "베이스방"], drums: ["DRUMS", "드럼방"],
        strings: ["STRINGS", "현악방"], woodwind: ["WOODWIND", "목관방"], brass: ["BRASS", "금관방"], percussion: ["PERCUSSION", "타악방"], korean: ["KOREAN", "국악방"]
    };
    const MODEL_LIBRARY = {
        keyboard: [
            { id: "concert-grand", name: "콘서트 그랜드", tag: "AP · ACOUSTIC", engine: "piano", stage: "piano", art: "assets/instruments/keyboard-concert-grand.webp", badge: "88-NOTE OGG", model: "88 GRAND", range: [21, 108], description: "콘서트 그랜드 원음을 건반마다 따로 담아 A0–C8 전 음역을 연주해요." },
            { id: "upright-piano", name: "업라이트 피아노", tag: "AP · ACOUSTIC", engine: "piano", stage: "piano", art: "assets/instruments/keyboard-upright-piano.webp", badge: "88-NOTE OGG", model: "STUDIO UPRIGHT", range: [21, 108], description: "업라이트 피아노 원음을 건반마다 따로 담아 A0–C8 전 음역을 연주해요." },
            { id: "harpsichord", name: "하프시코드", tag: "ACOUSTIC · PLUCKED", engine: "piano", stage: "harpsichord", art: "assets/instruments/keyboard-harpsichord.webp", badge: "39-NOTE SOURCE · EXTENDED", model: "HARPSICHORD", range: [21, 108], description: "현을 뜯어 내는 새 하프시코드 원음 C3–D6을 바탕으로 88건반 전체를 연주해요." },
            { id: "tine-ep", name: "펜더 로즈", tag: "EP · TINE", engine: "piano", stage: "ep", art: "assets/instruments/keyboard-tine-ep.webp", badge: "88-NOTE OGG", model: "FENDER RHODES", range: [21, 108], description: "금속 타인 특유의 둥근 울림을 A0–C8 전 음역에서 연주해요." },
            { id: "reed-ep", name: "월리처", tag: "EP · REED", engine: "piano", stage: "ep", art: "assets/instruments/keyboard-reed-ep.webp", badge: "88-NOTE OGG", model: "WURLITZER", range: [21, 108], description: "금속 리드의 단단하고 거친 어택을 A0–C8 전 음역에서 연주해요." },
            { id: "clavinet", name: "클라비넷", tag: "ELECTROMECHANICAL", engine: "piano", stage: "clavinet", art: "assets/instruments/keyboard-clavinet.webp", badge: "88-NOTE OGG", model: "CLAVINET", range: [21, 108], description: "현을 고무 패드로 눌러 튕기는 짧고 펑키한 소리를 전 음역에서 연주해요." },
            { id: "fm-dx7", name: "FM 피아노 · DX7", tag: "DIGITAL · FM", engine: "piano", stage: "digital", art: "assets/instruments/keyboard-fm-dx7.webp", badge: "88-NOTE OGG", model: "FM · DX7", range: [21, 108], description: "FM 합성 특유의 벨 같은 전기피아노 음색을 전 음역에서 연주해요." },
            { id: "jd800", name: "JD-800", tag: "DIGITAL · PCM", engine: "piano", stage: "digital", art: "assets/instruments/keyboard-jd800.webp", badge: "88-NOTE OGG", model: "JD-800", range: [21, 108], description: "PCM 파형과 감산 합성이 결합된 밝고 넓은 디지털 건반 음색이에요." },
            { id: "hybrid-la-rhodes", name: "LA 피아노 + LA 로즈", tag: "HYBRID · LA", engine: "piano", stage: "hybrid", art: "assets/instruments/keyboard-grand-tine-duo.webp", badge: "88-NOTE OGG", model: "LA PIANO + LA RHODES", range: [21, 108], description: "LA 방식 피아노와 로즈 계열의 따뜻한 배음을 한 음색으로 겹쳤어요." },
            { id: "hybrid-la-mks", name: "LA 피아노 + MKS", tag: "HYBRID · LA", engine: "piano", stage: "hybrid", art: "assets/instruments/keyboard-ballad-digital.webp", badge: "88-NOTE OGG", model: "LA PIANO + MKS", range: [21, 108], description: "LA 피아노의 어택과 MKS 계열 디지털 피아노의 넓은 몸통을 겹쳤어요." },
            { id: "hammond-organ", name: "해먼드 오르간", tag: "ORGAN · TONEWHEEL", engine: "piano", stage: "organ", art: "assets/instruments/keyboard-tonewheel-organ.webp", badge: "61-NOTE SOURCE · EXTENDED", model: "HAMMOND ORGAN", range: [21, 108], description: "C2–C7 해먼드 원음을 바탕으로 88건반 전체를 연주하며 드로바 구조를 살펴봐요." },
            { id: "pipe-organ", name: "파이프오르간", tag: "ORGAN · PIPE", engine: "piano", stage: "organ", art: "assets/instruments/keyboard-pipe-organ.webp", badge: "61-NOTE SOURCE · EXTENDED", model: "PIPE ORGAN", range: [21, 108], description: "C2–C7 파이프오르간 원음을 바탕으로 88건반 전체를 연주해요." }
        ],
        strings: [
            { id: "p-bass", name: "P-Style 4", tag: "ELECTRIC BASS", engine: "bass", stage: "bass", art: "assets/instruments/bass-p-style.png", badge: "FINGER · PICK · SLAP", model: "P-STYLE 4", range: [28, 67], size: "전체 길이 약 116 cm", visualScale: .82, scalePercent: 64, description: "P-Style은 Fender Precision Bass에서 유래한 계열명입니다. 전용 핑거·피크·슬랩 원음을 주법별로 연주해요." },
            { id: "j-bass", name: "J-Style 4", tag: "ELECTRIC BASS", engine: "bass", stage: "bass", art: "assets/instruments/bass-j-style.png", badge: "FINGER · PICK · SLAP", model: "J-STYLE 4", range: [28, 67], size: "전체 길이 약 117 cm", visualScale: .83, scalePercent: 65, description: "J-Style은 Fender Jazz Bass에서 유래한 계열명입니다. 전용 핑거·피크·슬랩 원음을 주법별로 연주해요." },
            { id: "active-bass", name: "Modern Active 5", tag: "ELECTRIC BASS", engine: "bass", stage: "bass", art: "assets/instruments/bass-active-five.png", badge: "FINGER · PICK · SLAP", model: "MODERN ACTIVE 5", range: [23, 72], size: "전체 길이 약 118 cm", visualScale: .84, scalePercent: 66, description: "5현 액티브 베이스의 핑거·피크·슬랩 원음을 낮은 B음부터 연주해요." },
            { id: "fretless-bass", name: "Fretless 4", tag: "ELECTRIC BASS", engine: "bass", stage: "bass", art: "assets/instruments/bass-fretless.png", badge: "FINGER · PICK · SLAP", model: "FRETLESS 4", range: [28, 67], size: "전체 길이 약 116 cm", visualScale: .82, scalePercent: 64, description: "프렛리스 베이스의 핑거·피크·슬랩 원음을 주법별로 바꾸어 연주해요." },
            { id: "upright-bass", name: "콘트라베이스", tag: "ORCHESTRAL", engine: "guitar", stage: "classical", art: "assets/instruments/double-bass-expressive.png", badge: "57-NOTE SUSTAIN · 57-NOTE PIZZ", model: "DOUBLE BASS", range: [52, 108], size: "전체 높이 약 180 cm", visualScale: 1, scalePercent: 100, expression: "보우 압력", description: "콘트라베이스 서스테인과 피치카토를 실제 샘플로 바꾸어 연주해요." },
            { id: "s-style", name: "Rock S-Style", tag: "ELECTRIC GUITAR", engine: "guitar", stage: "guitar", art: "assets/instruments/guitar-s-style.png", badge: "4 × 47-NOTE OGG · EXTENDED", model: "ROCK S-STYLE", range: [40, 88], size: "전체 길이 약 100 cm", visualScale: .7, scalePercent: 56, guitar: true, description: "S-Style 기타의 클린·블루스·펑크·록 원음 47개씩을 E2–D6에 정확히 대응하고 위 음역만 확장해 연주해요." },
            { id: "metal-seven", name: "Modern Metal 7", tag: "ELECTRIC GUITAR", engine: "guitar", stage: "guitar", art: "assets/instruments/guitar-metal-seven.png", badge: "45-NOTE OGG · EXTENDED", model: "MODERN METAL 7", range: [35, 88], size: "전체 길이 약 103 cm", visualScale: .72, scalePercent: 57, guitar: true, description: "Superstrat 원음 45개를 E2–C6에 정확히 대응하고 7현 기타의 연주 음역까지 확장해 연주해요." },
            { id: "hollow-jazz", name: "Hollowbody Jazz", tag: "ELECTRIC GUITAR", engine: "guitar", stage: "guitar", art: "assets/instruments/guitar-hollowbody-jazz.png", badge: "47-NOTE OGG · EXTENDED", model: "JAZZ ARCHTOP", range: [40, 88], size: "전체 길이 약 105 cm", visualScale: .73, scalePercent: 58, guitar: true, description: "할로우바디 원음 47개를 E2–D6에 정확히 대응하고 높은 음역만 확장해 연주해요." },
            { id: "dreadnought", name: "Dreadnought", tag: "ACOUSTIC GUITAR", engine: "guitar", stage: "guitar", art: "assets/instruments/guitar-dreadnought.png", badge: "45-NOTE STEEL OGG · EXTENDED", model: "DREADNOUGHT", range: [40, 88], size: "전체 길이 약 104 cm", visualScale: .72, scalePercent: 58, guitar: true, description: "스틸 스트링 통기타 원음 45개를 E2–C6에 정확히 대응하고 높은 음역만 확장해 연주해요." },
            { id: "classical-guitar", name: "Classical Nylon", tag: "ACOUSTIC GUITAR", engine: "guitar", stage: "guitar", art: "assets/instruments/guitar-classical-nylon.png", badge: "45-NOTE OGG · EXTENDED", model: "CLASSICAL", range: [40, 88], size: "전체 길이 약 99 cm", visualScale: .69, scalePercent: 55, guitar: true, description: "나일론 기타 원음 45개를 E2–C6에 정확히 대응하고 높은 음역만 확장해 연주해요." },
            { id: "violin", name: "바이올린", tag: "BOWED STRING", engine: "guitar", stage: "classical", art: "assets/instruments/violin-expressive-v2.webp", badge: "54-NOTE SUSTAIN · 46-NOTE PIZZ", model: "VIOLIN", range: [55, 108], size: "전체 길이 약 59 cm", visualScale: .48, scalePercent: 33, expression: "보우 압력", description: "바이올린 서스테인과 피치카토를 실제 샘플로 바꾸어 연주해요." },
            { id: "viola", name: "비올라", tag: "BOWED STRING", engine: "guitar", stage: "classical", art: "assets/instruments/viola-expressive-v2.webp", badge: "61-NOTE SUSTAIN · 42-NOTE PIZZ", model: "VIOLA", range: [48, 108], size: "전체 길이 약 66 cm", visualScale: .53, scalePercent: 37, expression: "보우 압력", description: "비올라 서스테인과 피치카토를 주법 버튼으로 바꾸어 실제 샘플로 연주해요." },
            { id: "cello", name: "첼로", tag: "BOWED STRING", engine: "guitar", stage: "classical", art: "assets/instruments/cello-expressive.png", badge: "61-NOTE SUSTAIN · 26-NOTE PIZZ", model: "CELLO", range: [48, 108], size: "전체 높이 약 121 cm", visualScale: .78, scalePercent: 67, expression: "보우 압력", description: "첼로 서스테인과 피치카토를 실제 샘플로 바꾸어 연주해요." },
            { id: "harp", name: "하프", tag: "PLUCKED STRING", engine: "guitar", stage: "classical", art: "assets/instruments/harp-concert-v2.webp", badge: "78-NOTE OGG", model: "CONCERT PEDAL HARP", range: [25, 102], size: "전체 높이 약 180 cm", visualScale: .82, scalePercent: 100, expression: "뜯는 강도", description: "콘서트 하프 원음 C♯1–F♯7을 반음마다 연주하며 자연 감쇠를 그대로 들어요." }
        ],
        woodwind: [
            { id: "piccolo-flute", name: "피콜로", tag: "AIR JET · HIGH", engine: "guitar", stage: "wind", art: "assets/instruments/piccolo-flute-expressive-v2.webp", badge: "37-NOTE OGG", model: "PICCOLO FLUTE", range: [72, 108], size: "전체 길이 약 33 cm", visualScale: .28, scalePercent: 18, expression: "호흡 압력", description: "새 피콜로 원음 C5–C8을 반음마다 연주해요." },
            { id: "flute", name: "플루트", tag: "AIR JET", engine: "guitar", stage: "wind", art: "assets/instruments/flute-expressive.png", badge: "37-NOTE OGG", model: "CONCERT FLUTE", range: [60, 96], size: "전체 길이 약 67 cm", visualScale: .46, scalePercent: 37, expression: "호흡 압력", description: "플루트 원음 C4–C7을 반음마다 연주해요." },
            { id: "ocarina", name: "오카리나", tag: "VESSEL FLUTE", engine: "guitar", stage: "wind", art: "assets/instruments/ocarina-concert-v1.webp", badge: "27-NOTE OGG", model: "OCARINA", range: [60, 86], size: "본체 길이 약 17 cm", visualScale: .38, scalePercent: 9, expression: "호흡 압력", description: "오카리나 원음 C4–D6을 반음마다 연주하고 누르는 동안 소리를 이어 가요." },
            { id: "recorder-piccolo", name: "피콜로 리코더", tag: "DUCT FLUTE · PICCOLO", engine: "guitar", stage: "wind", art: "assets/instruments/recorder-piccolo-v1.webp", badge: "28-NOTE OGG", model: "PICCOLO RECORDER", range: [77, 104], size: "전체 길이 약 24 cm", visualScale: .3, scalePercent: 13, expression: "호흡 압력", description: "피콜로 리코더 원음 F5–G♯7을 반음마다 연주해요." },
            { id: "recorder-soprano", name: "소프라노 리코더", tag: "DUCT FLUTE · SOPRANO", engine: "guitar", stage: "wind", art: "assets/instruments/recorder-soprano-v1.webp", badge: "30-NOTE OGG", model: "SOPRANO RECORDER", range: [72, 101], size: "전체 길이 약 32 cm", visualScale: .36, scalePercent: 18, expression: "호흡 압력", description: "소프라노 리코더 원음 C5–F7을 반음마다 연주해요." },
            { id: "recorder-alto", name: "알토 리코더", tag: "DUCT FLUTE · ALTO", engine: "guitar", stage: "wind", art: "assets/instruments/recorder-alto-v1.webp", badge: "25-NOTE OGG", model: "ALTO RECORDER", range: [65, 89], size: "전체 길이 약 48 cm", visualScale: .43, scalePercent: 27, expression: "호흡 압력", description: "알토 리코더 원음 F4–F6을 반음마다 연주해요." },
            { id: "recorder-tenor", name: "테너 리코더", tag: "DUCT FLUTE · TENOR", engine: "guitar", stage: "wind", art: "assets/instruments/recorder-tenor-v1.webp", badge: "25-NOTE OGG", model: "TENOR RECORDER", range: [60, 84], size: "전체 길이 약 65 cm", visualScale: .52, scalePercent: 36, expression: "호흡 압력", description: "테너 리코더 원음 C4–C6을 반음마다 연주해요." },
            { id: "oboe", name: "오보에", tag: "DOUBLE REED", engine: "guitar", stage: "wind", art: "assets/instruments/oboe-expressive.png", badge: "34-NOTE OGG", model: "OBOE", range: [58, 91], size: "전체 길이 약 65 cm", visualScale: .45, scalePercent: 36, expression: "호흡 압력", description: "새 오보에 원음 A♯3–G6을 반음마다 연주해요." },
            { id: "english-horn", name: "잉글리시 호른", tag: "DOUBLE REED · ALTO", engine: "guitar", stage: "wind", art: "assets/instruments/english-horn-expressive-v2.webp", badge: "42-NOTE OGG", model: "ENGLISH HORN", range: [49, 90], size: "전체 길이 약 81 cm", visualScale: .54, scalePercent: 45, expression: "호흡 압력", description: "오보에보다 낮고 어두운 잉글리시 호른 원음을 연주해요." },
            { id: "clarinet", name: "클라리넷", tag: "SINGLE REED", engine: "guitar", stage: "wind", art: "assets/instruments/clarinet-expressive.png", badge: "48-NOTE OGG", model: "CLARINET", range: [48, 95], size: "전체 길이 약 66 cm", visualScale: .46, scalePercent: 37, expression: "호흡 압력", description: "클라리넷 원음 C3–B6을 반음마다 연주해요." },
            { id: "bass-clarinet", name: "베이스 클라리넷", tag: "SINGLE REED · BASS", engine: "guitar", stage: "wind", art: "assets/instruments/bass-clarinet-expressive-v2.webp", badge: "52-NOTE OGG", model: "BASS CLARINET", range: [44, 95], size: "전체 높이 약 95 cm", visualScale: .61, scalePercent: 53, expression: "호흡 압력", description: "깊은 저음부터 높은 음까지 베이스 클라리넷 원음을 연주해요." },
            { id: "bassoon", name: "바순", tag: "DOUBLE REED · BASS", engine: "guitar", stage: "wind", art: "assets/instruments/bassoon-expressive.png", badge: "48-NOTE OGG", model: "BASSOON", range: [44, 91], size: "전체 높이 약 134 cm", visualScale: .78, scalePercent: 74, expression: "호흡 압력", description: "바순 원음 G♯2–G6을 반음마다 연주해요." },
            { id: "contrabassoon", name: "콘트라바순", tag: "DOUBLE REED · CONTRABASS", engine: "guitar", stage: "wind", art: "assets/instruments/contrabassoon-expressive.webp", badge: "49-NOTE OGG", model: "CONTRABASSOON", range: [32, 80], size: "전체 높이 약 160 cm", visualScale: .91, scalePercent: 88, expression: "호흡 압력", description: "콘트라바순 원음 G♯1–G♯5을 반음마다 연주해요." },
            { id: "soprano-sax", name: "소프라노 색소폰", tag: "SINGLE REED · SOPRANO", engine: "guitar", stage: "wind", art: "assets/instruments/soprano-sax-expressive-v2.webp", badge: "42-NOTE OGG", model: "SOPRANO SAX", range: [53, 94], size: "전체 길이 약 65 cm", visualScale: .45, scalePercent: 36, expression: "호흡 압력", description: "곧고 밝은 소프라노 색소폰 원음을 연주해요." },
            { id: "saxophone", name: "알토 색소폰", tag: "SINGLE REED · ALTO", engine: "guitar", stage: "wind", art: "assets/instruments/alto-sax-expressive.png", badge: "47-NOTE OGG", model: "ALTO SAX", range: [46, 92], size: "전체 높이 약 65 cm", visualScale: .46, scalePercent: 36, expression: "호흡 압력", description: "알토 색소폰 원음 A♯2–G♯6을 반음마다 연주해요." },
            { id: "tenor-sax", name: "테너 색소폰", tag: "SINGLE REED · TENOR", engine: "guitar", stage: "wind", art: "assets/instruments/tenor-sax-expressive-v2.webp", badge: "50-NOTE OGG", model: "TENOR SAX", range: [53, 102], size: "전체 높이 약 79 cm", visualScale: .53, scalePercent: 44, expression: "호흡 압력", description: "테너 색소폰 원음 F3–F♯7을 반음마다 연주해요." },
            { id: "baritone-sax", name: "바리톤 색소폰", tag: "SINGLE REED · BARITONE", engine: "guitar", stage: "wind", art: "assets/instruments/baritone-sax-expressive-v2.webp", badge: "56-NOTE OGG", model: "BARITONE SAX", range: [45, 100], size: "전체 높이 약 110 cm", visualScale: .68, scalePercent: 61, expression: "호흡 압력", description: "바리톤 색소폰 원음 A2–E7을 반음마다 연주해요." }
        ],
        brass: [
            { id: "trumpet", name: "트럼펫", tag: "HIGH BRASS", engine: "guitar", stage: "brass", art: "assets/instruments/trumpet-expressive.png", badge: "46-NOTE OGG", model: "TRUMPET", range: [52, 97], size: "외형 길이 약 48 cm", visualScale: .38, scalePercent: 27, expression: "호흡 압력", description: "트럼펫 원음 E3–C♯7을 반음마다 연주해요." },
            { id: "piccolo-trumpet", name: "피콜로 트럼펫", tag: "HIGH BRASS · PICCOLO", engine: "guitar", stage: "brass", art: "assets/instruments/piccolo-trumpet-expressive.webp", badge: "49-NOTE OGG", model: "PICCOLO TRUMPET", range: [52, 100], size: "외형 길이 약 46 cm", visualScale: .34, scalePercent: 26, expression: "호흡 압력", description: "피콜로 트럼펫 원음 E3–E7을 반음마다 연주해요." },
            { id: "flugelhorn", name: "플뤼겔호른", tag: "CONICAL BRASS · SOPRANO", engine: "guitar", stage: "brass", art: "assets/instruments/flugelhorn-expressive.webp", badge: "41-NOTE OGG", model: "FLUGELHORN", range: [52, 92], size: "외형 길이 약 47 cm", visualScale: .4, scalePercent: 29, expression: "호흡 압력", description: "넓은 원뿔관의 부드러운 플뤼겔호른 원음 E3–G♯6을 연주해요." },
            { id: "french-horn", name: "호른", tag: "ORCHESTRAL BRASS", engine: "guitar", stage: "brass", art: "assets/instruments/french-horn-expressive.png", badge: "47-NOTE OGG", model: "FRENCH HORN", range: [47, 93], size: "벨 포함 너비 약 58 cm", visualScale: .42, scalePercent: 32, expression: "호흡 압력", description: "호른 원음 B2–A6을 반음마다 연주해요." },
            { id: "alto-trombone", name: "알토 트롬본", tag: "SLIDE BRASS · ALTO", engine: "guitar", stage: "brass", art: "assets/instruments/alto-trombone-expressive-v2.webp", badge: "44-NOTE OGG", model: "ALTO TROMBONE", range: [45, 88], size: "전체 길이 약 90 cm", visualScale: .58, scalePercent: 50, expression: "호흡 압력", description: "가볍고 높은 알토 트롬본 원음을 연주해요." },
            { id: "trombone", name: "테너 트롬본", tag: "SLIDE BRASS · TENOR", engine: "guitar", stage: "brass", art: "assets/instruments/trombone-expressive.png", badge: "46-NOTE OGG", model: "TENOR TROMBONE", range: [52, 97], size: "슬라이드 닫힘 약 114 cm", visualScale: .7, scalePercent: 63, expression: "호흡 압력", description: "테너 트롬본 원음 E3–C♯7을 반음마다 연주해요." },
            { id: "bass-trombone", name: "베이스 트롬본", tag: "SLIDE BRASS · BASS", engine: "guitar", stage: "brass", art: "assets/instruments/bass-trombone-expressive-v2.webp", badge: "58-NOTE OGG", model: "BASS TROMBONE", range: [35, 92], size: "전체 길이 약 120 cm", visualScale: .74, scalePercent: 67, expression: "호흡 압력", description: "넓고 무거운 베이스 트롬본 원음을 연주해요." },
            { id: "euphonium", name: "유포니움", tag: "CONICAL BRASS · TENOR", engine: "guitar", stage: "brass", art: "assets/instruments/euphonium-expressive.webp", badge: "55-NOTE OGG", model: "EUPHONIUM", range: [40, 94], size: "전체 높이 약 66 cm", visualScale: .5, scalePercent: 41, expression: "호흡 압력", description: "둥글고 유연한 유포니움 원음 E2–A♯6을 반음마다 연주해요." },
            { id: "tuba", name: "베이스 튜바", tag: "LOW BRASS", engine: "guitar", stage: "brass", art: "assets/instruments/tuba-expressive-v2.webp", badge: "57-NOTE OGG", model: "BASS TUBA", range: [40, 96], size: "전체 높이 약 100 cm", visualScale: .62, scalePercent: 56, expression: "호흡 압력", description: "베이스 튜바 원음 E2–C7을 반음마다 연주해요." }
        ],
        percussion: [
            { id: "rock-kit", name: "Rock Kit", tag: "DRUM SET", engine: "drums", stage: "drums", art: "assets/instruments/drum-rock-kit.webp", badge: "15-PAD", model: "ROCK", description: "Rock 킷의 고스트노트·사이드스틱·림샷·풋/오픈 하이햇과 3개의 탐까지 실제 원샷으로 연주해요." },
            { id: "metal-kit", name: "Metal Kit", tag: "DRUM SET", engine: "drums", stage: "drums", art: "assets/instruments/drum-metal-kit.webp", badge: "15-PAD", model: "METAL", description: "Metal 킷의 고스트노트·사이드스틱·림샷·풋/오픈 하이햇과 4개의 탐까지 실제 원샷으로 연주해요." },
            { id: "pop-kit", name: "Pop Kit", tag: "DRUM SET", engine: "drums", stage: "drums", art: "assets/instruments/drum-pop-kit.webp", badge: "15-PAD", model: "POP", description: "Pop 킷의 고스트노트·사이드스틱·림샷·풋/오픈 하이햇과 3개의 탐까지 실제 원샷으로 연주해요." },
            { id: "jazz-kit", name: "Jazz Kit", tag: "DRUM SET", engine: "drums", stage: "drums", art: "assets/instruments/drum-jazz-kit.webp", badge: "15-PAD", model: "JAZZ", description: "Jazz 킷의 고스트노트·사이드스틱·림샷·풋/오픈 하이햇과 2개의 탐까지 실제 원샷으로 연주해요." },
            { id: "funk-kit", name: "Funk Kit", tag: "DRUM SET", engine: "drums", stage: "drums", art: "assets/instruments/drum-funk-kit.webp", badge: "15-PAD", model: "FUNK", description: "Funk 킷의 고스트노트·사이드스틱·림샷·풋/오픈 하이햇과 3개의 탐까지 실제 원샷으로 연주해요." },
            { id: "timpani", name: "팀파니", tag: "ORCHESTRAL", engine: "drums", stage: "timpani", art: "assets/instruments/timpani-bank.png", pitched: true, range: [36, 53], size: "4대 배치 너비 약 290 cm", visualScale: .94, scalePercent: 83, badge: "18-NOTE OGG", model: "TIMPANI", description: "실제 팀파니 타격 원음 C2–F3을 건반으로 연주해요." },
            { id: "glockenspiel", name: "글로켄슈필", tag: "KEYBOARD PERC.", engine: "drums", stage: "metal", art: "assets/instruments/glockenspiel-concert.png", pitched: true, range: [79, 108], size: "본체 너비 약 80 cm", visualScale: .54, scalePercent: 23, badge: "17-NOTE SOURCE · EXTENDED", model: "GLOCKENSPIEL", description: "글로켄슈필 원음 G5–B6을 바탕으로 악기의 높은 음역까지 확장해 연주해요." },
            { id: "marimba", name: "마림바", tag: "KEYBOARD PERC.", engine: "drums", stage: "mallet", art: "assets/instruments/marimba-concert.png", pitched: true, range: [36, 96], size: "본체 너비 약 250 cm", visualScale: .9, scalePercent: 71, badge: "61-NOTE OGG", model: "MARIMBA", description: "마림바 원음 C2–C7을 반음마다 연주해요." },
            { id: "vibraphone", name: "비브라폰", tag: "KEYBOARD PERC.", engine: "drums", stage: "metal", art: "assets/instruments/vibraphone-concert.png", pitched: true, range: [53, 89], size: "본체 너비 약 140 cm", visualScale: .72, scalePercent: 40, badge: "37-NOTE OGG", model: "VIBRAPHONE", description: "비브라폰 원음 F3–F6을 반음마다 연주해요." },
            { id: "xylophone", name: "실로폰", tag: "KEYBOARD PERC.", engine: "drums", stage: "mallet", art: "assets/instruments/xylophone-compact-concert.webp", pitched: true, range: [48, 89], size: "본체 너비 약 140 cm", visualScale: .72, scalePercent: 40, badge: "42-NOTE OGG", model: "XYLOPHONE", description: "실로폰 원음 C3–F6을 반음마다 연주해요." },
            { id: "orchestral-percussion", name: "오케스트라 타악 스테이션", tag: "ORCHESTRAL", engine: "drums", stage: "orchestral", station: "orchestral", size: "전체 배치 너비 약 350 cm", scalePercent: 100, badge: "ORCHESTRAL PERCUSSION", model: "SNARE · BASS DRUM · CYMBAL · TAM-TAM · TRIANGLE", parts: [
                { id: "orchestral-snare", name: "스네어드럼", art: "assets/instruments/orchestral-snare.webp", scale: .88 },
                { id: "orchestral-bass-drum", name: "베이스드럼", art: "assets/instruments/orchestral-bass-drum.webp", scale: 1.04 },
                { id: "orchestral-suspended-cymbal", name: "서스펜디드 심벌", art: "assets/instruments/orchestral-suspended-cymbal.webp", scale: .94 },
                { id: "orchestral-tamtam", name: "탐탐", art: "assets/instruments/orchestral-tamtam.webp", scale: 1 },
                { id: "orchestral-triangle", name: "트라이앵글", art: "assets/instruments/orchestral-triangle.webp", scale: .86 }
            ], description: "오케스트라 타악기를 개별 레이어로 배치해, 연주되는 악기만 빛으로 확인해요." },
            { id: "drum-808", name: "808 Machine", tag: "ELECTRONIC", engine: "drums", stage: "machine", art: "assets/instruments/drum-808-machine.webp", badge: "15-PAD", model: "808 STYLE", description: "808 킷의 림샷·클랩·풋/오픈 하이햇까지 실제 원샷으로 분리해 연주해요." },
            { id: "linn-machine", name: "Linn Machine", tag: "ELECTRONIC", engine: "drums", stage: "linn", art: "assets/instruments/drum-linn-machine.webp", badge: "15-PAD", model: "LINN STYLE", description: "Linn 계열 킷의 림샷·클랩·풋/오픈 하이햇까지 실제 원샷으로 분리해 연주해요." },
        ]
    };
    const mixedStrings = MODEL_LIBRARY.strings.slice();
    const mixedPercussion = MODEL_LIBRARY.percussion.slice();
    MODEL_LIBRARY.guitar = mixedStrings.filter(function (model) { return Boolean(model.guitar); });
    MODEL_LIBRARY.bass = mixedStrings.filter(function (model) { return model.engine === "bass" || model.id === "upright-bass"; });
    MODEL_LIBRARY.strings = mixedStrings.filter(function (model) { return ["violin", "viola", "cello", "upright-bass", "harp"].includes(model.id); });
    MODEL_LIBRARY.drums = mixedPercussion.filter(function (model) { return ["drums", "machine", "linn"].includes(model.stage); });
    MODEL_LIBRARY.percussion = mixedPercussion.filter(function (model) { return !["drums", "machine", "linn", "samul"].includes(model.stage); });
    MODEL_LIBRARY.korean = [
        { id: "gayageum", room: "melody", name: "산조가야금", tag: "PLUCKED STRING", engine: "guitar", stage: "korean-string", art: "assets/instruments/korean-gayageum.png", expressive: true, range: [43, 77], size: "전체 길이 약 160 cm", visualScale: .9, scalePercent: 89, badge: "35-NOTE · 6 ARTICULATIONS", model: "산조가야금", expression: "농현 깊이", description: "실제 산조가야금 원음 G2–F5를 기본 뜯기·느린 농현·빠른 농현·트레몰로·퇴성·추성 여섯 주법으로 연주해요." },
        { id: "gayageum-25", room: "melody", name: "25현가야금", tag: "MODERN PLUCKED STRING", engine: "guitar", stage: "korean-string", art: "assets/instruments/korean-gayageum-25-v1.webp", expressive: true, range: [43, 81], size: "전체 길이 약 185 cm", visualScale: .94, scalePercent: 100, badge: "39-NOTE OGG", model: "25현가야금", expression: "뜯는 강도", description: "25현가야금 원음 G2–A5를 반음마다 연주하며 넓어진 음역과 풍부한 화음을 살펴봐요." },
        { id: "geomungo", room: "melody", name: "거문고", tag: "PLUCKED STRING", engine: "guitar", stage: "korean-string", art: "assets/instruments/korean-geomungo.png", expressive: true, range: [46, 77], size: "전체 길이 약 162 cm", visualScale: .92, scalePercent: 90, badge: "32-NOTE · 3 ARTICULATIONS", model: "6현 거문고", expression: "술대 강도", description: "거문고 원음 A♯2–F5를 기본 뜯기·잔농현·깊은 농현 세 주법으로 바꾸어 반음마다 연주해요." },
        { id: "yanggeum", room: "melody", name: "양금", tag: "HAMMERED STRING", engine: "guitar", stage: "korean-string", art: "assets/instruments/korean-yanggeum-v1.webp", expressive: true, range: [51, 80], size: "본체 너비 약 100 cm", visualScale: .76, scalePercent: 56, badge: "30-NOTE · 2 ARTICULATIONS", model: "양금", expression: "채 타격 강도", description: "양금 원음 D♯3–G♯5를 기본 타현과 트레몰로 두 주법으로 바꾸어 연주해요." },
        { id: "haegeum", room: "melody", name: "해금", tag: "BOWED STRING", engine: "guitar", stage: "korean-string", art: "assets/instruments/korean-haegeum.png", expressive: true, range: [55, 79], size: "전체 높이 약 70 cm", visualScale: .58, scalePercent: 39, badge: "2 ARTICULATIONS", model: "2현 해금", expression: "활 압력", description: "실제 해금 기본음 G3–G5와 비브라토 B3–G5를 주법별 원음으로 바꾸어 연주해요." },
        { id: "ajaeng", room: "melody", name: "아쟁", tag: "BOWED ZITHER", engine: "guitar", stage: "korean-string", art: "assets/instruments/korean-ajaeng.png", expressive: true, range: [43, 78], size: "전체 길이 약 160 cm", visualScale: .96, scalePercent: 89, badge: "36-NOTE · 2 ARTICULATIONS", model: "아쟁", expression: "활 압력", description: "아쟁 원음 G2–F♯5를 기본 활긋기와 비브라토 두 주법으로 바꾸어 반음마다 연주해요." },
        { id: "daegeum", room: "melody", name: "대금", tag: "TRANSVERSE FLUTE", engine: "guitar", stage: "korean-wind", art: "assets/instruments/korean-daegeum.png", expressive: true, range: [59, 89], size: "전체 길이 약 80 cm", visualScale: .68, scalePercent: 44, badge: "31-NOTE · 2 ARTICULATIONS", model: "대금", expression: "호흡 압력", description: "실제 대금 원음 B3–F6를 기본음과 비브라토 두 주법으로 바꾸어 반음마다 연주해요." },
        { id: "sogeum", room: "melody", name: "소금", tag: "SMALL TRANSVERSE FLUTE", engine: "guitar", stage: "korean-wind", art: "assets/instruments/korean-sogeum-v1.webp", expressive: true, range: [70, 93], size: "전체 길이 약 38 cm", visualScale: .44, scalePercent: 21, badge: "24-NOTE OGG", model: "소금", expression: "호흡 압력", description: "소금 원음 A♯4–A6을 반음마다 연주하며 작고 맑은 대나무 가로피리의 고음을 들어요." },
        { id: "danso", room: "melody", name: "단소", tag: "NOTCHED FLUTE", engine: "guitar", stage: "korean-wind", art: "assets/instruments/korean-danso-v1.webp", expressive: true, range: [66, 92], size: "전체 길이 약 40 cm", visualScale: .45, scalePercent: 22, badge: "27-NOTE · 2 ARTICULATIONS", model: "단소", expression: "호흡 압력", description: "단소 원음 F♯4–G♯6을 기본음과 비브라토 두 주법으로 바꾸어 연주해요." },
        { id: "hun", room: "melody", name: "훈", tag: "VESSEL FLUTE", engine: "guitar", stage: "korean-wind", art: "assets/instruments/korean-hun-v1.webp", expressive: true, range: [60, 71], size: "본체 높이 약 12 cm", visualScale: .34, scalePercent: 7, badge: "12-NOTE OGG", model: "훈", expression: "호흡 압력", description: "흙으로 빚은 훈의 원음 C4–B4를 반음마다 연주하며 어둡고 둥근 공명음을 들어요." },
        { id: "hyangpiri", room: "melody", name: "향피리", tag: "DOUBLE REED", engine: "guitar", stage: "korean-wind", art: "assets/instruments/korean-hyangpiri.png", expressive: true, range: [59, 77], size: "전체 길이 약 27 cm", visualScale: .4, scalePercent: 15, badge: "19-NOTE · 2 ARTICULATIONS", model: "향피리", expression: "호흡 압력", description: "실제 향피리 원음 B3–F5를 기본음과 비브라토 두 주법으로 바꾸어 반음마다 연주해요." },
        { id: "taepyeongso", room: "melody", name: "태평소", tag: "DOUBLE REED HORN", engine: "guitar", stage: "korean-wind", art: "assets/instruments/korean-taepyeongso.webp", expressive: true, range: [68, 89], size: "전체 길이 약 40 cm", visualScale: .48, scalePercent: 22, badge: "22-NOTE OGG", model: "태평소", expression: "호흡 압력", description: "실제 태평소 원음 G♯4–F6를 반음마다 연주하고, 누르는 동안 강한 겹서 소리를 이어 가요." },
        { id: "janggu-samul", room: "folk", name: "사물장구", tag: "13 ARTICULATIONS", engine: "drums", stage: "korean-percussion", art: "assets/instruments/korean-janggu-samul.webp", badge: "13-HIT OGG", model: "사물장구", description: "궁채와 열채를 사용하는 사물장구의 궁편·채편·양편 주법 13가지를 실제 원샷으로 연주해요." },
        { id: "janggu-sanjo", room: "folk", name: "산조장구", tag: "15 ARTICULATIONS", engine: "drums", stage: "korean-percussion", art: "assets/instruments/korean-janggu-sanjo.webp", badge: "15-HIT OGG", model: "산조장구", description: "열채와 왼손을 사용하는 산조장구의 궁편·채편·양편 주법 15가지를 실제 원샷으로 연주해요." },
        { id: "buk-samul", room: "folk", name: "사물북", tag: "19 ARTICULATIONS", engine: "drums", stage: "korean-percussion", art: "assets/instruments/korean-buk-samul.webp", badge: "19-HIT OGG", model: "사물북", description: "줄로 가죽을 조인 사물북의 북면·가장자리·북통·막음 주법 19가지를 연주해요." },
        { id: "buk-sori", room: "folk", name: "소리북", tag: "21 ARTICULATIONS", engine: "drums", stage: "korean-percussion", art: "assets/instruments/korean-buk-sori.webp", badge: "21-HIT OGG", model: "소리북 · 판소리북", description: "가죽을 쇠못으로 고정한 소리북의 왼손·오른손·가장자리·복합 주법 21가지를 연주해요." },
        { id: "sogo", detailId: "sogo", room: "folk", name: "소고", tag: "17 ARTICULATIONS", engine: "drums", stage: "korean-percussion", art: "assets/instruments/korean-sogo.webp", badge: "17-HIT OGG", model: "소고", description: "소고의 기본 타격·가장자리·강세·막음·여린 주법 17가지를 실제 원샷으로 연주해요." },
        { id: "kkwaenggwari", detailId: "kkwaenggwari", room: "folk", name: "꽹과리", tag: "9 ARTICULATIONS", engine: "drums", stage: "korean-percussion", art: "assets/instruments/korean-kkwaenggwari.webp", badge: "9-HIT OGG", model: "꽹과리", description: "꽹과리의 열어치기·막기·가장자리·굴림 주법 9가지를 실제 원샷으로 연주해요." },
        { id: "jing", detailId: "jing", room: "folk", name: "징", tag: "6 ARTICULATIONS", engine: "drums", stage: "korean-percussion", art: "assets/instruments/korean-jing.webp", badge: "6-HIT OGG", model: "징", description: "징의 열어치기·느리거나 빠르게 막기·고스트·막아치기 주법 6가지를 실제 원샷으로 연주해요." },
        { id: "pyeonjong", room: "court", name: "편종", tag: "COURT BELL CHIME", engine: "drums", stage: "metal", art: "assets/instruments/korean-pyeonjong.webp", pitched: true, toneMarkers: true, range: [60, 75], size: "전체 너비 약 210 cm", visualScale: .92, scalePercent: 82, badge: "16-NOTE OGG", model: "16 BRONZE BELLS", description: "편종 원음 C4–D♯5를 열여섯 건반으로 연주하고, 울린 종을 빛으로 확인해요." },
        { id: "pyeongyeong", room: "court", name: "편경", tag: "COURT STONE CHIME", engine: "drums", stage: "metal", art: "assets/instruments/korean-pyeongyeong.webp", pitched: true, toneMarkers: true, range: [72, 87], size: "전체 너비 약 210 cm", visualScale: .92, scalePercent: 82, badge: "16-NOTE OGG", model: "16 STONE CHIMES", description: "편경 원음 C5–D♯6을 열여섯 건반으로 연주합니다. 정면 크기는 같고 두께가 다르며 두꺼울수록 높은음이 나요." },
        { id: "ritual-signals", room: "court", name: "의식 신호 악기", tag: "박 · 축 · 어", engine: "drums", stage: "korean-station", station: "ritual", size: "제례악 지휘·신호 악기 구성", scalePercent: 70, badge: "COURT SIGNALS", model: "박 · 축 · 어", parts: [
            { id: "bak", name: "박", art: "assets/instruments/korean-bak.webp", scale: .82 },
            { id: "chuk", name: "축", art: "assets/instruments/korean-chuk.webp", scale: .95 },
            { id: "eo", name: "어", art: "assets/instruments/korean-eo.webp", scale: 1.08 }
        ], description: "음악의 시작과 마침을 알리는 박·축·어를 묶고, 연주된 악기를 형광 표시해요." },
        { id: "daechwita-station", room: "court", name: "대취타 스테이션", tag: "ROYAL PROCESSION", engine: "drums", stage: "korean-station", station: "daechwita", size: "행진 편성 기준", scalePercent: 100, badge: "DAECHWITA", model: "나발 · 나각 · 용고 · 자바라 · 징 · 태평소", parts: [
            { id: "nabal", name: "나발", art: "assets/instruments/korean-nabal.webp", scale: 1.12 },
            { id: "nagak", name: "나각", art: "assets/instruments/korean-nagak.webp", scale: .82 },
            { id: "yonggo", name: "용고", art: "assets/instruments/korean-yonggo.webp", scale: 1 },
            { id: "jabara", name: "자바라", art: "assets/instruments/korean-jabara.webp", scale: .82 },
            { id: "jing", name: "징", art: "assets/instruments/korean-jing.webp", scale: .88 },
            { id: "taepyeongso", name: "태평소", art: "assets/instruments/korean-taepyeongso.webp", scale: .7 }
        ], description: "대취타 편성을 한 화면에 묶되, 태평소와 징은 기존 악기 자산을 공유해 중복을 줄였어요." }
    ];
    const state = {
        instrument: "piano",
        guitarMode: "keyboard",
        guitarChord: "C",
        articulation: "finger",
        stringPreset: "clean",
        keyboardStartMidi: 60,
        keyboardScale: 1,
        pixelsPerMm: CSS_PX_PER_MM,
        screenCalibrated: false,
        displayKey: "",
        audioContext: null,
        masterGain: null,
        compressor: null,
        masterLowShelf: null,
        masterPresence: null,
        limiter: null,
        reverb: null,
        reverbGain: null,
        noiseBuffer: null,
        pianoSamples: new Map(),
        pianoLoading: null,
        pianoVoices: new Map(),
        keyboardSamples: new Map(),
        samplePeaks: new WeakMap(),
        sampleActiveRms: new WeakMap(),
        sampleStartOffsets: new WeakMap(),
        keyboardSampleLoads: new Map(),
        sampleCacheOpening: null,
        rangePreloadToken: 0,
        drumSamples: new Map(),
        drumSampleLoads: new Map(),
        openHatVoices: new Set(),
        koreanMetalVoices: new Map(),
        sustain: false,
        sustainLatched: false,
        stringNode: null,
        family: "keyboard",
        modelId: "concert-grand",
        koreanRoom: "melody",
        stringLoading: null,
        stringUnavailable: false,
        workletModuleLoading: null,
        currentModel: null,
        drumNode: null,
        drumLoading: null,
        drumUnavailable: false,
        stringPreGain: null,
        stringTone: null,
        stringBody: null,
        stringDrive: null,
        stringOutput: null,
        activeNotes: new Set(),
        pointerNotes: new Map(),
        pressedCodes: new Map(),
        visualEnergy: 0,
        visualPitch: 0,
        toastTimer: 0,
        detailOpen: false,
        detailId: null,
        detailParentId: null,
        detailReturnFocus: null
    };
    const elements = {};

    function cacheElements() {
        [
            "audioButton", "modelBadge", "instrumentName", "instrumentDescription", "guitarModeSwitch", "instrumentVisual", "familyEyebrow", "familyName", "modelChooser", "koreanRoomSwitch",
            "visualFamily", "visualModel", "studioStage", "instrumentArtwork", "instrumentLayers", "scaleGuide", "scaleBar", "scaleValue", "scaleNote", "classicalRender", "machineDeck", "malletRender", "stringCanvas", "pianoControls", "keyboardPatchControls", "stringControls", "classicalControls", "classicalArticulationButtons", "classicalArticulationHint", "guitarFxControls", "drumControls", "drumSystemLabel", "drumSystemDescription", "drumResonanceLabel", "drumToneLabel", "sustainButton",
            "articulationButtons", "articulationHint", "soundPresetGroup", "soundPresetButtons", "soundPresetHint", "physicalStringControls", "toneSlider", "toneOutput", "muteSlider", "muteOutput", "pickSlider", "pickOutput",
            "driveSlider", "driveOutput", "drumResonanceSlider", "drumResonanceOutput", "drumToneSlider", "drumToneOutput",
            "noteReadout", "rangeLegend", "rangeReadout", "keySizeButton", "keySizeReadout", "keyboardRangeControls", "keyboardRangeReadout", "octaveDown", "whiteKeyDown", "whiteKeyUp", "octaveUp", "keyboardViewport",
            "keyboard", "chordSurface", "chordPads", "drumPads", "toast", "instrumentInfoButton", "instrumentDetailModal", "instrumentDetailDialog", "detailFamily", "detailTitle", "detailSubtitle", "detailPrevious", "detailNext", "detailClose", "detailArtworkFrame", "detailArtwork", "detailArtworkLayers", "detailArtworkFallback", "detailPartPicker", "detailFacts", "detailArticle",
            "keySizeModal", "keySizeDialog", "calibrationCard", "calibrationSlider", "calibrationStatus", "calibrationReset", "calibrationSave", "keyScaleSlider", "keyScaleOutput"
        ].forEach(function (id) { elements[id] = document.getElementById(id); });
    }

    function isTouchKeyboardDevice() {
        return navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
    }

    function currentDisplayKey() {
        const shortSide = Math.min(window.screen.width, window.screen.height);
        const longSide = Math.max(window.screen.width, window.screen.height);
        return shortSide + "x" + longSide + "@" + Number(window.devicePixelRatio || 1).toFixed(2);
    }

    function loadKeyboardSize() {
        state.displayKey = currentDisplayKey();
        state.keyboardScale = 1;
        state.pixelsPerMm = CSS_PX_PER_MM;
        state.screenCalibrated = false;
        try {
            const saved = JSON.parse(window.localStorage.getItem(KEY_SIZE_STORAGE) || "null");
            const profile = saved && saved.profiles ? saved.profiles[state.displayKey] : null;
            if (!profile) return;
            if (profile.calibrated && Number.isFinite(profile.pixelsPerMm) && profile.pixelsPerMm > .5 && profile.pixelsPerMm < 12) {
                state.pixelsPerMm = profile.pixelsPerMm;
                state.screenCalibrated = true;
            }
            if (Number.isFinite(profile.scale)) state.keyboardScale = Math.max(.5, Math.min(1, profile.scale));
        } catch (error) { /* 저장을 막은 브라우저에서는 현재 세션 값만 사용한다. */ }
    }

    function saveKeyboardSize() {
        try {
            const saved = JSON.parse(window.localStorage.getItem(KEY_SIZE_STORAGE) || "null") || {};
            if (!saved.profiles) saved.profiles = {};
            saved.profiles[state.displayKey || currentDisplayKey()] = { pixelsPerMm: state.pixelsPerMm, scale: state.keyboardScale, calibrated: state.screenCalibrated };
            window.localStorage.setItem(KEY_SIZE_STORAGE, JSON.stringify(saved));
        } catch (error) { /* 저장을 막은 브라우저에서는 현재 세션 값만 사용한다. */ }
    }

    function applyKeyboardSize(shouldRender) {
        const root = document.documentElement;
        const factor = state.pixelsPerMm * state.keyboardScale;
        root.style.setProperty("--key-width", (PIANO_WHITE_KEY_MM.width * factor).toFixed(2) + "px");
        root.style.setProperty("--key-height", (PIANO_WHITE_KEY_MM.length * WHITE_KEY_LENGTH_SCALE * factor).toFixed(2) + "px");
        root.style.setProperty("--black-width", (PIANO_BLACK_KEY_MM.width * factor).toFixed(2) + "px");
        root.style.setProperty("--black-height", (PIANO_BLACK_KEY_MM.length * BLACK_KEY_LENGTH_SCALE * factor).toFixed(2) + "px");
        const percent = Math.round(state.keyboardScale * 100) + "%";
        if (elements.keySizeReadout) elements.keySizeReadout.textContent = state.screenCalibrated ? percent : "보정 필요";
        if (elements.keyScaleOutput) elements.keyScaleOutput.textContent = percent;
        if (elements.keyScaleSlider) elements.keyScaleSlider.value = String(Math.round(state.keyboardScale * 100));
        if (shouldRender && elements.keyboard && elements.keyboard.children.length) renderKeyboard();
    }

    function syncCalibrationUi() {
        const cardPixels = state.pixelsPerMm * REFERENCE_CARD_MM;
        const maxPixels = Math.max(160, Math.min(640, Math.floor(window.innerWidth - 64)));
        elements.calibrationSlider.max = String(maxPixels);
        elements.calibrationSlider.value = String(Math.max(80, Math.min(maxPixels, Math.round(cardPixels))));
        elements.calibrationCard.style.width = elements.calibrationSlider.value + "px";
        elements.calibrationStatus.textContent = state.screenCalibrated ? "이 기기 보정됨" : "보정 전 추정값";
        elements.calibrationStatus.classList.toggle("saved", state.screenCalibrated);
    }

    function openKeySizeDialog() {
        syncCalibrationUi();
        elements.keySizeModal.classList.remove("hidden");
        elements.keySizeModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("key-size-open");
        window.requestAnimationFrame(function () { elements.keySizeDialog.focus(); });
    }

    function closeKeySizeDialog() {
        if (elements.keySizeModal.classList.contains("hidden")) return;
        elements.keySizeModal.classList.add("hidden");
        elements.keySizeModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("key-size-open");
        elements.keySizeButton.focus();
    }

    function saveScreenCalibration() {
        state.pixelsPerMm = Number(elements.calibrationSlider.value) / REFERENCE_CARD_MM;
        state.screenCalibrated = true;
        saveKeyboardSize();
        syncCalibrationUi();
        applyKeyboardSize(true);
        showToast("이 기기의 실물 건반 가로폭을 저장했어요.");
    }

    function resetScreenCalibration() {
        state.pixelsPerMm = CSS_PX_PER_MM;
        state.screenCalibrated = false;
        saveKeyboardSize();
        syncCalibrationUi();
        applyKeyboardSize(true);
        showToast("화면 크기 추정값으로 초기화했어요.");
    }

    function showToast(message) {
        elements.toast.textContent = message;
        elements.toast.classList.add("show");
        window.clearTimeout(state.toastTimer);
        state.toastTimer = window.setTimeout(function () { elements.toast.classList.remove("show"); }, 1800);
    }

    function ensureAudio() {
        if (!state.audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                showToast("이 브라우저에서는 소리를 만들 수 없어요.");
                return null;
            }
            const context = new AudioContextClass({ latencyHint: .003 });
            state.audioContext = context;
            state.masterGain = context.createGain();
            state.compressor = context.createDynamicsCompressor();
            state.masterLowShelf = context.createBiquadFilter();
            state.masterPresence = context.createBiquadFilter();
            state.limiter = context.createDynamicsCompressor();
            state.reverb = context.createConvolver();
            state.reverbGain = context.createGain();

            state.masterGain.gain.value = 1;
            state.compressor.threshold.value = -18;
            state.compressor.knee.value = 14;
            state.compressor.ratio.value = 3.5;
            state.compressor.attack.value = .012;
            state.compressor.release.value = .22;
            state.masterLowShelf.type = "lowshelf";
            state.masterLowShelf.frequency.value = 190;
            state.masterLowShelf.gain.value = 3.5;
            state.masterPresence.type = "peaking";
            state.masterPresence.frequency.value = 2700;
            state.masterPresence.Q.value = .75;
            state.masterPresence.gain.value = 1.8;
            state.limiter.threshold.value = -3;
            state.limiter.knee.value = 1;
            state.limiter.ratio.value = 20;
            state.limiter.attack.value = .002;
            state.limiter.release.value = .1;
            state.reverbGain.gain.value = .1;

            const impulseLength = Math.floor(context.sampleRate * 1.7);
            const impulse = context.createBuffer(2, impulseLength, context.sampleRate);
            for (let channel = 0; channel < 2; channel += 1) {
                const data = impulse.getChannelData(channel);
                for (let index = 0; index < data.length; index += 1) {
                    data[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / data.length, 2.8);
                }
            }
            state.reverb.buffer = impulse;
            const noiseLength = Math.floor(context.sampleRate * 2.4);
            state.noiseBuffer = context.createBuffer(1, noiseLength, context.sampleRate);
            const noise = state.noiseBuffer.getChannelData(0);
            for (let index = 0; index < noise.length; index += 1) noise[index] = Math.random() * 2 - 1;

            state.reverb.connect(state.reverbGain).connect(state.compressor);
            state.compressor.connect(state.masterLowShelf).connect(state.masterPresence).connect(state.limiter).connect(state.masterGain).connect(context.destination);
        }
        if (state.audioContext.state === "suspended") state.audioContext.resume();
        elements.audioButton.classList.add("hidden");
        return state.audioContext;
    }

    function connectToMix(source, reverbAmount) {
        if (!source || !state.audioContext) return;
        source.connect(state.compressor);
        if (reverbAmount) {
            const send = state.audioContext.createGain();
            send.gain.value = reverbAmount;
            source.connect(send).connect(state.reverb);
        }
    }

    function connectFastToMix(source, reverbAmount) {
        if (!source || !state.audioContext) return;
        // Skip the tone-shaping compressor/EQ when requested, but never bypass
        // the shared peak guard; direct-to-master voices caused loud outliers.
        source.connect(state.limiter);
        if (reverbAmount) {
            const send = state.audioContext.createGain();
            send.gain.value = reverbAmount;
            source.connect(send).connect(state.reverb);
        }
    }

    function decodedBufferPeak(buffer) {
        if (!buffer) return 1;
        const cached = state.samplePeaks.get(buffer);
        if (Number.isFinite(cached)) return cached;
        let peak = .0001;
        for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
            const data = buffer.getChannelData(channel);
            for (let index = 0; index < data.length; index += 1) peak = Math.max(peak, Math.abs(data[index]));
        }
        state.samplePeaks.set(buffer, peak);
        return peak;
    }

    function volumeOnlyGain(buffer, requestedGain) {
        const safeGain = .92 / decodedBufferPeak(buffer);
        return Math.max(.0001, Math.min(requestedGain, safeGain));
    }

    function decodedBufferActiveRms(buffer) {
        if (!buffer) return 1;
        const cached = state.sampleActiveRms.get(buffer);
        if (Number.isFinite(cached)) return cached;
        const gate = Math.max(.0008, decodedBufferPeak(buffer) * .002);
        const scanLength = Math.min(buffer.length, Math.ceil(buffer.sampleRate * 4.5));
        let sumSquares = 0;
        let count = 0;
        for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
            const data = buffer.getChannelData(channel);
            for (let index = 0; index < scanLength; index += 1) {
                const sample = data[index];
                if (Math.abs(sample) < gate) continue;
                sumSquares += sample * sample;
                count += 1;
            }
        }
        const rms = count ? Math.sqrt(sumSquares / count) : decodedBufferPeak(buffer);
        state.sampleActiveRms.set(buffer, rms);
        return rms;
    }

    function upwardBalancedGain(buffer, requestedGain, performanceGain) {
        const performanceScale = Math.max(.08, Math.min(1.4, performanceGain / 1.22));
        const quietSampleFloor = (.085 * performanceScale) / decodedBufferActiveRms(buffer);
        return volumeOnlyGain(buffer, Math.max(requestedGain, quietSampleFloor));
    }

    function decodedBufferStartOffset(buffer) {
        if (!buffer) return 0;
        const cached = state.sampleStartOffsets.get(buffer);
        if (Number.isFinite(cached)) return cached;
        const threshold = Math.max(.00004, decodedBufferPeak(buffer) * .00008);
        const scanLength = Math.min(buffer.length, Math.ceil(buffer.sampleRate * .12));
        let onset = 0;
        scan: for (let index = 0; index < scanLength; index += 1) {
            for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
                if (Math.abs(buffer.getChannelData(channel)[index]) >= threshold) {
                    onset = index;
                    break scan;
                }
            }
        }
        const offset = Math.max(0, onset / buffer.sampleRate - SAMPLED_NOTE_ATTACK_LEAD);
        state.sampleStartOffsets.set(buffer, offset);
        return offset;
    }

    function loadPianoSamples() {
        const context = ensureAudio();
        if (!context) return Promise.reject(new Error("AudioContext unavailable"));
        if (state.pianoSamples.size === PIANO_SAMPLES.length) return Promise.resolve(state.pianoSamples);
        if (state.pianoLoading) return state.pianoLoading;
        state.pianoLoading = Promise.all(PIANO_SAMPLES.map(function (sample) {
            return fetchSampleData("../music-studio/assets/piano/" + sample.file)
                .then(function (data) { return context.decodeAudioData(data); })
                .then(function (buffer) { state.pianoSamples.set(sample.midi, buffer); });
        })).then(function () { return state.pianoSamples; }).catch(function (error) {
            state.pianoLoading = null;
            throw error;
        });
        return state.pianoLoading;
    }

    function nearestPianoSample(midi) {
        return PIANO_SAMPLES.reduce(function (nearest, sample) {
            return Math.abs(sample.midi - midi) < Math.abs(nearest.midi - midi) ? sample : nearest;
        }, PIANO_SAMPLES[0]);
    }

    function releasePianoVoice(voice, quick) {
        if (!voice || voice.released || !state.audioContext) return;
        voice.released = true;
        const now = state.audioContext.currentTime;
        const release = quick ? (voice.sampledPiano ? .035 : .08) : (voice.sampledPiano ? .16 : .86);
        if (typeof voice.gain.gain.cancelAndHoldAtTime === "function") voice.gain.gain.cancelAndHoldAtTime(now);
        else voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setTargetAtTime(.0001, now, release / 5);
        window.setTimeout(function () { try { voice.source.stop(); } catch (error) {} }, Math.ceil(release * 1200));
    }

    function samplePianoNoteOn(midi, velocity) {
        const context = ensureAudio();
        const sample = nearestPianoSample(midi);
        const buffer = state.pianoSamples.get(sample.midi);
        if (!context || !buffer) return false;
        const existing = state.pianoVoices.get(midi);
        if (existing) releasePianoVoice(existing, true);
        const source = context.createBufferSource();
        const gain = context.createGain();
        const panner = typeof context.createStereoPanner === "function" ? context.createStereoPanner() : null;
        const peak = Math.min(.62, Math.max(.16, velocity * .58));
        const now = context.currentTime;
        source.buffer = buffer;
        source.playbackRate.value = Math.pow(2, (midi - sample.midi) / 12);
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(peak, now + .004);
        gain.gain.exponentialRampToValueAtTime(peak * .82, now + .18);
        source.connect(gain);
        if (panner) {
            panner.pan.value = Math.max(-.32, Math.min(.32, (midi - 60) / 80));
            gain.connect(panner);
            connectToMix(panner, .12);
        } else connectToMix(gain, .12);
        const voice = { source, gain, released: false, held: false };
        state.pianoVoices.set(midi, voice);
        source.onended = function () { if (state.pianoVoices.get(midi) === voice) state.pianoVoices.delete(midi); };
        source.start(now, Math.min(decodedBufferStartOffset(buffer), Math.max(0, buffer.duration - .01)));
        return true;
    }

    function fallbackPiano(midi, velocity) {
        const context = ensureAudio();
        if (!context) return;
        const now = context.currentTime;
        const output = context.createGain();
        const filter = context.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 4600;
        output.gain.setValueAtTime(Math.max(.04, velocity * .18), now);
        output.gain.exponentialRampToValueAtTime(.0001, now + 1.5);
        [1, 2.01, 3.98].forEach(function (ratio, index) {
            const oscillator = context.createOscillator();
            const partial = context.createGain();
            oscillator.type = index ? "sine" : "triangle";
            oscillator.frequency.value = core.midiToFrequency(midi) * ratio;
            partial.gain.value = [1, .22, .07][index];
            oscillator.connect(partial).connect(filter);
            oscillator.start(now);
            oscillator.stop(now + 1.55);
        });
        filter.connect(output);
        connectToMix(output, .08);
    }

    function pianoNoteOn(midi, velocity) {
        if (isSampledPiano()) {
            const config = sampledPianoConfig();
            const anchor = concertGrandAnchor(midi, config);
            const key = sampledPianoKey(config, anchor);
            const cached = state.keyboardSamples.get(key);
            if (cached) {
                rememberConcertGrandSample(config, anchor, cached);
                startConcertGrandSample(midi, velocity, anchor, cached, config.id);
                return;
            }
            loadConcertGrandSample(midi).then(function (sample) {
                if (!sampledPianoConfig() || sampledPianoConfig().id !== sample.sampleSet) return;
                if (!state.activeNotes.has(midi) && !state.sustain) return;
                const voice = startConcertGrandSample(midi, velocity, sample.anchor, sample.buffer, sample.sampleSet);
                if (voice && !state.activeNotes.has(midi)) voice.held = true;
            }).catch(function () { showToast("건반 음색을 불러오지 못했어요. iPadOS 18.4 이상인지 확인하세요."); });
            return;
        }
        if (samplePianoNoteOn(midi, velocity)) return;
        fallbackPiano(midi, velocity);
        loadPianoSamples().catch(function () { showToast("피아노 음원을 불러오지 못했어요."); });
    }

    function pianoNoteOff(midi) {
        const voice = state.pianoVoices.get(midi);
        if (!voice) return;
        if (ONE_SHOT_SAMPLE_SETS.has(voice.sampleSet)) return;
        if (state.sustain) voice.held = true;
        else releasePianoVoice(voice, false);
    }
    function makeDriveCurve(amount) {
        const samples = 1024;
        const curve = new Float32Array(samples);
        const shape = 1 + amount * 18;
        for (let index = 0; index < samples; index += 1) {
            const x = index * 2 / (samples - 1) - 1;
            curve[index] = Math.tanh(x * shape) / Math.tanh(shape);
        }
        return curve;
    }

    function updateStringChain() {
        if (!state.stringNode) return;
        const context = state.audioContext;
        const tone = Number(elements.toneSlider.value) / 100;
        const drive = Number(elements.driveSlider.value) / 100;
        const bass = state.instrument === "bass";
        state.stringTone.frequency.setTargetAtTime(bass ? 700 + tone * 4300 : 1200 + tone * 7200, context.currentTime, .025);
        state.stringBody.frequency.setTargetAtTime(bass ? 145 : 235, context.currentTime, .025);
        state.stringBody.gain.setTargetAtTime(bass ? 4.2 : 3.1, context.currentTime, .025);
        state.stringPreGain.gain.setTargetAtTime(1 + drive * 1.8, context.currentTime, .025);
        state.stringDrive.curve = makeDriveCurve(drive);
        state.stringOutput.gain.setTargetAtTime(1 - drive * .22, context.currentTime, .025);
        state.stringNode.port.postMessage({ type: "model", model: bass ? "bass" : "guitar" });
    }

    function loadInstrumentWorklet() {
        const context = ensureAudio();
        if (!context) return Promise.reject(new Error("AudioContext unavailable"));
        if (!context.audioWorklet || typeof window.AudioWorkletNode !== "function") return Promise.reject(new Error("AudioWorklet unavailable"));
        if (!state.workletModuleLoading) {
            state.workletModuleLoading = context.audioWorklet.addModule("instrument-worklet-v2.js?v=20260825-drum-map");
        }
        return state.workletModuleLoading;
    }

    function isConcertGrand() {
        return Boolean(state.currentModel && state.currentModel.id === "concert-grand");
    }

    function sampledPianoConfig() {
        if (!state.currentModel) return null;
        if (["p-bass", "j-bass", "active-bass", "fretless-bass"].includes(state.currentModel.id)) {
            return KEYBOARD_SAMPLE_SETS[state.currentModel.id + "-" + state.articulation] || null;
        }
        if (state.currentModel.id === "s-style") return KEYBOARD_SAMPLE_SETS["guitar-s-" + state.stringPreset] || null;
        if (state.currentModel.id === "metal-seven") return KEYBOARD_SAMPLE_SETS["guitar-superstrat"];
        if (state.currentModel.id === "hollow-jazz") return KEYBOARD_SAMPLE_SETS["guitar-hollow"];
        if (state.currentModel.id === "dreadnought") return KEYBOARD_SAMPLE_SETS["guitar-steel"];
        if (state.currentModel.id === "classical-guitar") return KEYBOARD_SAMPLE_SETS["guitar-nylon"];
        if (state.currentModel.id === "gayageum") return KEYBOARD_SAMPLE_SETS[state.articulation === "pluck" ? "gayageum" : "gayageum-" + state.articulation];
        if (state.currentModel.id === "geomungo") return KEYBOARD_SAMPLE_SETS[state.articulation === "pluck" ? "geomungo" : "geomungo-" + state.articulation];
        if (state.currentModel.id === "haegeum") return KEYBOARD_SAMPLE_SETS[state.articulation === "vibrato" ? "haegeum-vibrato" : "haegeum"];
        if (state.currentModel.id === "daegeum") return KEYBOARD_SAMPLE_SETS[state.articulation === "vibrato" ? "daegeum-vibrato" : "daegeum"];
        if (state.currentModel.id === "hyangpiri") return KEYBOARD_SAMPLE_SETS[state.articulation === "vibrato" ? "hyangpiri-vibrato" : "hyangpiri"];
        if (state.currentModel.id === "yanggeum") return KEYBOARD_SAMPLE_SETS[state.articulation === "tremolo" ? "yanggeum-tremolo" : "yanggeum"];
        if (state.currentModel.id === "ajaeng") return KEYBOARD_SAMPLE_SETS[state.articulation === "vibrato" ? "ajaeng-vibrato" : "ajaeng"];
        if (state.currentModel.id === "danso") return KEYBOARD_SAMPLE_SETS[state.articulation === "vibrato" ? "danso-vibrato" : "danso"];
        const pizzicatoModel = ["violin", "viola", "cello", "upright-bass"].includes(state.currentModel.id) && state.articulation === "pizzicato";
        const sampleId = pizzicatoModel ? state.currentModel.id + "-pizz" : state.currentModel.id;
        return KEYBOARD_SAMPLE_SETS[sampleId] || null;
    }

    function isSampledPiano() {
        return Boolean(sampledPianoConfig());
    }

    function sampledPianoKey(config, anchor) {
        return config.id + ":" + anchor;
    }

    function concertGrandAnchor(midi, config) {
        const sampleConfig = config || sampledPianoConfig();
        if (Array.isArray(sampleConfig.anchors) && sampleConfig.anchors.length) {
            return sampleConfig.anchors.reduce(function (nearest, anchor) {
                return Math.abs(anchor - midi) < Math.abs(nearest - midi) ? anchor : nearest;
            }, sampleConfig.anchors[0]);
        }
        const clamped = Math.max(sampleConfig.min, Math.min(sampleConfig.max, Number(midi)));
        return sampleConfig.min + Math.round((clamped - sampleConfig.min) / sampleConfig.step) * sampleConfig.step;
    }

    function concertGrandSampleFile(anchor, config) {
        const sampleConfig = config || sampledPianoConfig();
        const index = String(anchor - (sampleConfig.fileMin || sampleConfig.min) + 1).padStart(3, "0");
        const note = core.noteLabel(anchor).toLowerCase().replace("♯", "s");
        return index + "_" + note + ".ogg";
    }

    function rememberConcertGrandSample(config, anchor, buffer) {
        const key = sampledPianoKey(config, anchor);
        state.keyboardSamples.delete(key);
        state.keyboardSamples.set(key, buffer);
        while (state.keyboardSamples.size > KEYBOARD_SAMPLE_CACHE_LIMIT) {
            const removable = Array.from(state.keyboardSamples.keys()).find(function (candidate) {
                return !Array.from(state.pianoVoices.values()).some(function (voice) {
                    return voice.sampledPiano && voice.sampleKey === candidate && !voice.released;
                });
            });
            if (!removable) break;
            state.keyboardSamples.delete(removable);
        }
    }

    function loadConcertGrandSample(midi) {
        const context = ensureAudio();
        const config = sampledPianoConfig();
        if (!context || !config) return Promise.reject(new Error("Sampled piano unavailable"));
        const anchor = concertGrandAnchor(midi, config);
        const key = sampledPianoKey(config, anchor);
        const cached = state.keyboardSamples.get(key);
        if (cached) {
            rememberConcertGrandSample(config, anchor, cached);
            return Promise.resolve({ anchor, buffer: cached, sampleSet: config.id });
        }
        if (state.keyboardSampleLoads.has(key)) return state.keyboardSampleLoads.get(key);
        const revision = "?v=" + encodeURIComponent(
            [AUDIO_SAMPLE_REVISION, config.revision].filter(Boolean).join("-")
        );
        const task = fetchSampleData(config.root + concertGrandSampleFile(anchor, config) + revision)
            .then(function (data) { return context.decodeAudioData(data); })
            .then(function (buffer) {
                rememberConcertGrandSample(config, anchor, buffer);
                state.keyboardSampleLoads.delete(key);
                return { anchor, buffer, sampleSet: config.id };
            })
            .catch(function (error) {
                state.keyboardSampleLoads.delete(key);
                throw error;
            });
        state.keyboardSampleLoads.set(key, task);
        return task;
    }

    // 자판 18개 음을 먼저 받고, 그다음 그 악기 음역 전체를 가운데부터 뒤에서 차례로 받아 둔다.
    function preloadConcertGrandRange() {
        const config = sampledPianoConfig();
        if (!config) return Promise.resolve([]);
        const first = state.keyboardStartMidi;
        const last = first + COMPUTER_KEY_SPAN;
        const anchors = new Set();
        for (let midi = first; midi <= last; midi += 1) anchors.add(concertGrandAnchor(midi, config));
        const ready = Promise.allSettled(Array.from(anchors).map(loadConcertGrandSample));
        ready.then(function () { preloadRemainingRange(config, (first + last) / 2); });
        return ready;
    }

    function preloadRemainingRange(config, center) {
        const token = state.rangePreloadToken += 1;
        const range = currentPitchRange();
        const start = Math.max(range.start, config.min);
        const end = Math.min(range.end, config.max);
        const anchors = new Set();
        for (let midi = start; midi <= end; midi += 1) anchors.add(concertGrandAnchor(midi, config));
        const queue = Array.from(anchors).filter(function (anchor) {
            return !state.keyboardSamples.has(sampledPianoKey(config, anchor));
        }).sort(function (a, b) { return Math.abs(a - center) - Math.abs(b - center); });
        function next() {
            if (state.rangePreloadToken !== token) return;
            const current = sampledPianoConfig();
            if (!current || current.id !== config.id) return;
            if (!queue.length) return;
            loadConcertGrandSample(queue.shift()).catch(function () {}).then(next);
        }
        for (let lane = 0; lane < RANGE_PRELOAD_CONCURRENCY; lane += 1) next();
    }

    // 소리 파일은 앱 전용 저장소에 넣어 두고, 거기 있으면 서버에 묻지 않고 바로 꺼내 쓴다.
    // 판 번호가 바뀌면 저장소 이름이 달라지므로 옛 판 저장소는 지운다.
    function openSampleCache() {
        if (!("caches" in window)) return Promise.resolve(null);
        if (!state.sampleCacheOpening) {
            const prefix = "instrument-room-samples-";
            const name = prefix + AUDIO_SAMPLE_REVISION + "-" + AD2_DRUM_SAMPLE_REVISION;
            state.sampleCacheOpening = window.caches.keys().then(function (names) {
                return Promise.all(names.filter(function (candidate) {
                    return candidate.indexOf(prefix) === 0 && candidate !== name;
                }).map(function (stale) { return window.caches.delete(stale); }));
            }).then(function () { return window.caches.open(name); }).catch(function () { return null; });
        }
        return state.sampleCacheOpening;
    }

    function fetchSampleData(url) {
        function download(cache) {
            return fetch(url).then(function (response) {
                if (!response.ok) throw new Error(response.url);
                if (cache) cache.put(url, response.clone()).catch(function () {});
                return response.arrayBuffer();
            });
        }
        return openSampleCache().then(function (cache) {
            if (!cache) return download(null);
            return cache.match(url).then(function (hit) {
                return hit ? hit.arrayBuffer() : download(cache);
            });
        });
    }

    function pluckedKeyboardDecay(sampleSet) {
        if (sampleSet === "clavinet") return 1.65;
        if (["violin-pizz", "viola-pizz", "cello-pizz", "upright-bass-pizz"].includes(sampleSet)) return 2.2;
        if (sampleSet === "harpsichord") return 3.4;
        return 0;
    }

    function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet) {
        const context = ensureAudio();
        if (!context || !buffer) return;
        const existing = state.pianoVoices.get(midi);
        if (existing) releasePianoVoice(existing, true);
        const source = context.createBufferSource();
        const gain = context.createGain();
        const now = context.currentTime;
        const highNoteCompensation = 1 + Math.max(0, midi - 60) / 64;
        const sampleConfig = KEYBOARD_SAMPLE_SETS[sampleSet];
        const calibratedGain = Math.pow(10, ((sampleConfig && sampleConfig.gainDb) || 0) / 20);
        const velocityGain = Math.max(.08, Math.min(1.7, Math.pow(velocity, .9) * 1.22 * highNoteCompensation));
        const peak = upwardBalancedGain(buffer, velocityGain * calibratedGain, velocityGain);
        const decay = pluckedKeyboardDecay(sampleSet);
        const heldTone = sampleSet === "hammond-organ" || sampleSet === "pipe-organ" || ["flute", "oboe", "trumpet", "piccolo-trumpet", "clarinet", "bass-clarinet", "piccolo-flute", "french-horn", "english-horn", "soprano-sax", "saxophone", "tenor-sax", "baritone-sax", "bassoon", "contrabassoon", "flugelhorn", "alto-trombone", "trombone", "bass-trombone", "euphonium", "tuba", "violin", "viola", "cello", "upright-bass", "haegeum", "haegeum-vibrato", "daegeum", "daegeum-vibrato", "hyangpiri", "hyangpiri-vibrato", "taepyeongso", "yanggeum-tremolo", "ajaeng", "ajaeng-vibrato", "sogeum", "danso", "danso-vibrato", "hun", "ocarina", "recorder-piccolo", "recorder-soprano", "recorder-alto", "recorder-tenor"].includes(sampleSet);
        source.buffer = buffer;
        source.playbackRate.value = Math.pow(2, (midi - anchor) / 12);
        if (heldTone && buffer.duration > 1.25) {
            source.loop = true;
            source.loopStart = Math.min((sampleConfig && sampleConfig.loopStart) || 1.2, buffer.duration * .72);
            source.loopEnd = Math.max(source.loopStart + .25, Math.min((sampleConfig && sampleConfig.loopEnd) || buffer.duration - .08, buffer.duration - .08));
        }
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(peak, now + .0025);
        if (decay) {
            gain.gain.exponentialRampToValueAtTime(Math.max(.0001, peak * .68), now + .045);
            gain.gain.exponentialRampToValueAtTime(.0001, now + decay);
        }
        source.connect(gain);
        // Preserve the dry sample's level and tone, add the original short room,
        // and leave only peak protection after the upward-only calibration.
        connectFastToMix(gain, .035);
        const voice = { source, gain, anchor, sampleSet, sampleKey: sampleSet + ":" + anchor, sampledPiano: true, released: false, held: false, percussiveDecay: decay };
        state.pianoVoices.set(midi, voice);
        source.onended = function () { if (state.pianoVoices.get(midi) === voice) state.pianoVoices.delete(midi); };
        const configuredOffset = sampleConfig && Number.isFinite(sampleConfig.startOffset) ? Math.max(0, sampleConfig.startOffset) : null;
        const startOffset = configuredOffset === null ? decodedBufferStartOffset(buffer) : configuredOffset;
        source.start(now, Math.min(startOffset, Math.max(0, buffer.duration - .01)));
        if (decay) source.stop(now + decay + .08);
        return voice;
    }
    function ensureStringEngine() {
        const context = ensureAudio();
        if (!context) return Promise.reject(new Error("AudioContext unavailable"));
        if (state.stringNode) return Promise.resolve(state.stringNode);
        if (state.stringUnavailable) return Promise.resolve(null);
        if (state.stringLoading) return state.stringLoading;
        if (!context.audioWorklet || typeof window.AudioWorkletNode !== "function") {
            state.stringUnavailable = true;
            return Promise.resolve(null);
        }
        state.stringLoading = loadInstrumentWorklet().then(function () {
            state.stringNode = new AudioWorkletNode(context, "resonant-string-processor", { outputChannelCount: [2] });
            state.stringPreGain = context.createGain();
            state.stringTone = context.createBiquadFilter();
            state.stringBody = context.createBiquadFilter();
            state.stringDrive = context.createWaveShaper();
            state.stringOutput = context.createGain();
            state.stringTone.type = "lowpass";
            state.stringTone.Q.value = .58;
            state.stringBody.type = "peaking";
            state.stringBody.Q.value = 1.1;
            state.stringDrive.oversample = "2x";
            state.stringNode.connect(state.stringPreGain).connect(state.stringTone).connect(state.stringBody).connect(state.stringDrive).connect(state.stringOutput);
            connectFastToMix(state.stringOutput, state.instrument === "bass" ? .025 : .06);
            updateStringChain();
            return state.stringNode;
        }).catch(function () {
            state.stringUnavailable = true;
            state.stringLoading = null;
            return null;
        });
        return state.stringLoading;
    }

    function ensureDrumEngine() {
        const context = ensureAudio();
        if (!context) return Promise.reject(new Error("AudioContext unavailable"));
        if (state.drumNode) return Promise.resolve(state.drumNode);
        if (state.drumUnavailable) return Promise.resolve(null);
        if (state.drumLoading) return state.drumLoading;
        if (!context.audioWorklet || typeof window.AudioWorkletNode !== "function") {
            state.drumUnavailable = true;
            return Promise.resolve(null);
        }
        state.drumLoading = loadInstrumentWorklet().then(function () {
            state.drumNode = new AudioWorkletNode(context, "resonant-drum-processor", { outputChannelCount: [2] });
            connectFastToMix(state.drumNode, .045);
            return state.drumNode;
        }).catch(function () {
            state.drumUnavailable = true;
            state.drumLoading = null;
            return null;
        });
        return state.drumLoading;
    }

    function currentStringParams() {
        return {
            articulation: state.articulation,
            tone: Number(elements.toneSlider.value) / 100,
            mute: Number(elements.muteSlider.value) / 100,
            pickPosition: Number(elements.pickSlider.value) / 100
        };
    }

    function fallbackStringNote(midi, velocity, model, when) {
        const context = ensureAudio();
        if (!context) return;
        const start = Math.max(context.currentTime, when || 0);
        const output = context.createGain();
        const filter = context.createBiquadFilter();
        const oscillator = context.createOscillator();
        const overtone = context.createOscillator();
        oscillator.type = "sawtooth";
        overtone.type = "triangle";
        oscillator.frequency.value = core.midiToFrequency(midi);
        overtone.frequency.value = core.midiToFrequency(midi) * 2.005;
        filter.type = "lowpass";
        filter.frequency.value = model === "bass" ? 1900 : 3600;
        output.gain.setValueAtTime(.0001, start);
        output.gain.exponentialRampToValueAtTime(velocity * .24, start + .00012);
        output.gain.exponentialRampToValueAtTime(.0001, start + (model === "bass" ? 2.4 : 1.35));
        oscillator.connect(filter); overtone.connect(filter); filter.connect(output); connectToMix(output, .04);
        oscillator.start(start); overtone.start(start); oscillator.stop(start + 2.5); overtone.stop(start + 2.5);
    }

    function playImmediateStringExcitation(midi, velocity, model, when) {
        const context = ensureAudio();
        if (!context || !state.noiseBuffer) return;
        const start = Math.max(context.currentTime, when || context.currentTime);
        const source = createNoiseSource();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();
        filter.type = "bandpass";
        filter.frequency.value = (model === "bass" ? 950 : 2100) + core.midiToFrequency(midi) * 2.2;
        filter.Q.value = model === "bass" ? .72 : 1.05;
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(.008, velocity * (model === "bass" ? .052 : .044)), start + .00012);
        gain.gain.exponentialRampToValueAtTime(.0001, start + (model === "bass" ? .016 : .012));
        source.connect(filter).connect(gain).connect(state.masterGain);
        source.start(start, Math.random() * Math.max(.01, state.noiseBuffer.duration - .04), .024);
    }

    function stringNoteOn(midi, velocity, when) {
        const model = state.instrument === "bass" ? "bass" : "guitar";
        const sendNote = function (node) {
            node.port.postMessage({
                type: "noteOn", note: midi, frequency: core.midiToFrequency(midi), velocity,
                model, params: currentStringParams(), time: when || state.audioContext.currentTime
            });
        };
        playImmediateStringExcitation(midi, velocity, model, when);
        if (state.stringNode) {
            sendNote(state.stringNode);
            return;
        }
        ensureStringEngine().then(function (node) {
            if (!node) {
                fallbackStringNote(midi, velocity, model, when);
                return;
            }
            if (!state.activeNotes.has(midi) && !when) return;
            sendNote(node);
        });
    }

    function stringNoteOff(midi) {
        if (state.stringNode) state.stringNode.port.postMessage({ type: "noteOff", note: midi });
    }

    function createNoiseSource() {
        const source = state.audioContext.createBufferSource();
        source.buffer = state.noiseBuffer;
        return source;
    }

    function modalTone(frequency, decay, level, velocity, start, sweep) {
        const context = state.audioContext;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency * (sweep || 1), start);
        oscillator.frequency.exponentialRampToValueAtTime(frequency, start + Math.min(.09, decay * .35));
        gain.gain.setValueAtTime(Math.max(.0001, level * velocity), start);
        gain.gain.exponentialRampToValueAtTime(.0001, start + decay);
        oscillator.connect(gain);
        connectToMix(gain, .025);
        oscillator.start(start);
        oscillator.stop(start + decay + .04);
    }

    function metalModes(base, decay, velocity, start) {
        [1, 1.342, 1.815, 2.487, 3.116, 4.23].forEach(function (ratio, index) {
            const oscillator = state.audioContext.createOscillator();
            const gain = state.audioContext.createGain();
            oscillator.type = index % 2 ? "square" : "triangle";
            oscillator.frequency.value = base * ratio;
            gain.gain.setValueAtTime(velocity * (.032 / (1 + index * .22)), start);
            gain.gain.exponentialRampToValueAtTime(.0001, start + decay * (1 + index * .05));
            oscillator.connect(gain);
            connectToMix(gain, decay > .5 ? .08 : .02);
            oscillator.start(start);
            oscillator.stop(start + decay * 1.3);
        });
    }

    function noiseBurst(decay, velocity, highpass, start, reverbAmount) {
        const context = state.audioContext;
        const source = createNoiseSource();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();
        filter.type = "highpass";
        filter.frequency.value = highpass;
        gain.gain.setValueAtTime(Math.max(.0001, velocity * .22), start);
        gain.gain.exponentialRampToValueAtTime(.0001, start + decay);
        source.connect(filter).connect(gain);
        connectToMix(gain, reverbAmount || 0);
        source.start(start, 0, Math.min(decay + .05, state.noiseBuffer.duration));
    }

    function triggerDrum(id, velocity) {
        const context = ensureAudio();
        if (!context) return;
        const now = context.currentTime;
        const resonance = Number(elements.drumResonanceSlider.value) / 100;
        const tone = Number(elements.drumToneSlider.value) / 100;
        const scale = .65 + resonance * .75;
        if (id === "kick") {
            modalTone(48, .62 * scale, .82, velocity, now, 3.4);
            modalTone(79, .22 * scale, .19, velocity, now, 1.4);
        } else if (id === "snare") {
            modalTone(184, .28 * scale, .25, velocity, now, 1.15);
            modalTone(331, .19 * scale, .12, velocity, now, 1);
            noiseBurst(.24 * scale, velocity, 900 + tone * 900, now, .045);
        } else if (id === "hat" || id === "openhat") {
            const decay = (id === "hat" ? .11 : .72) * scale;
            metalModes(2950 + tone * 900, decay, velocity, now);
            noiseBurst(decay * .72, velocity * .65, 5200 + tone * 1800, now, id === "openhat" ? .05 : .01);
        } else if (id === "subtom" || id === "lowtom" || id === "midtom" || id === "hightom") {
            const base = id === "subtom" ? 72 : id === "lowtom" ? 92 : id === "midtom" ? 116 : 142;
            modalTone(base, .58 * scale, .58, velocity, now, 1.58);
            modalTone(base * 1.47, .31 * scale, .15, velocity, now, 1.12);
        } else {
            const crash = id === "crash";
            const decay = (crash ? 1.35 : 1.05) * scale;
            metalModes(crash ? 620 : 760, decay, velocity, now);
            noiseBurst(decay * .82, velocity * .48, 3300 + tone * 1200, now, .11);
            if (!crash) modalTone(2250, .55 * scale, .08, velocity, now, 1);
        }
        noteActivity(id, velocity);
    }

    function playImmediateDrumExcitation(id, velocity, when) {
        const context = ensureAudio();
        if (!context || !state.noiseBuffer) return;
        const start = Math.max(context.currentTime, when || context.currentTime);
        const source = createNoiseSource();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();
        const low = id === "kick" || id === "subtom" || id === "lowtom" || id === "midtom" || id === "hightom";
        filter.type = low ? "lowpass" : "highpass";
        filter.frequency.value = low ? (id === "kick" ? 1250 : 1900) : 2400;
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(.01, velocity * (low ? .065 : .052)), start + .0001);
        gain.gain.exponentialRampToValueAtTime(.0001, start + (low ? .014 : .009));
        source.connect(filter).connect(gain).connect(state.masterGain);
        source.start(start, Math.random() * Math.max(.01, state.noiseBuffer.duration - .03), .02);
    }

    function drumSampleConfig() {
        if (!state.currentModel) return null;
        return DRUM_SAMPLE_SETS[state.currentModel.id] || KOREAN_PERCUSSION_SAMPLE_SETS[state.currentModel.id] || null;
    }

    function loadDrumSample(id) {
        const context = ensureAudio();
        const config = drumSampleConfig();
        if (!context || !config) return Promise.reject(new Error("Drum sample unavailable"));
        const key = config.id + ":" + id;
        if (state.drumSamples.has(key)) return Promise.resolve({ buffer: state.drumSamples.get(key), sampleSet: config.id, id });
        if (state.drumSampleLoads.has(key)) return state.drumSampleLoads.get(key);
        const sampleRevision = "?v=" + encodeURIComponent(
            [AUDIO_SAMPLE_REVISION, config.id.startsWith("drums-") ? AD2_DRUM_SAMPLE_REVISION : ""].filter(Boolean).join("-")
        );
        const task = fetchSampleData(config.root + id + ".ogg" + sampleRevision)
            .then(function (data) { return context.decodeAudioData(data); })
            .then(function (buffer) {
                state.drumSamples.set(key, buffer);
                state.drumSampleLoads.delete(key);
                return { buffer, sampleSet: config.id, id };
            })
            .catch(function (error) { state.drumSampleLoads.delete(key); throw error; });
        state.drumSampleLoads.set(key, task);
        return task;
    }

    function preloadDrumSamples() {
        if (!drumSampleConfig()) return Promise.resolve([]);
        const config = drumSampleConfig();
        const ids = new Set(activeDrums().map(function (drum) { return drum.sound || drum.id; }).filter(function (id) {
            return !config.available || config.available.includes(id);
        }));
        return Promise.allSettled(Array.from(ids).map(loadDrumSample));
    }

    function chokeOpenHat() {
        if (!state.audioContext || !state.openHatVoices.size) return;
        const now = state.audioContext.currentTime;
        state.openHatVoices.forEach(function (voice) {
            voice.gain.gain.cancelScheduledValues(now);
            voice.gain.gain.setValueAtTime(Math.max(.0001, voice.gain.gain.value), now);
            voice.gain.gain.exponentialRampToValueAtTime(.0001, now + .025);
            try { voice.source.stop(now + .03); } catch (error) { /* already stopped */ }
        });
        state.openHatVoices.clear();
    }
    function koreanPercussionTargetDb(id) {
        if (/ghost|soft/.test(id)) return -18;
        if (/damp|mute/.test(id)) return -15;
        if (/accent/.test(id)) return -7;
        return -10;
    }

    function chokeKoreanMetal(sampleSet) {
        if (!state.audioContext) return;
        const voices = state.koreanMetalVoices.get(sampleSet);
        if (!voices || !voices.size) return;
        const now = state.audioContext.currentTime;
        voices.forEach(function (voice) {
            voice.gain.gain.cancelScheduledValues(now);
            voice.gain.gain.setValueAtTime(Math.max(.0001, voice.gain.gain.value), now);
            voice.gain.gain.exponentialRampToValueAtTime(.0001, now + .025);
            try { voice.source.stop(now + .03); } catch (error) { /* already stopped */ }
        });
        voices.clear();
    }

    function playSampledDrum(id, velocity) {
        const selected = drumSampleConfig();
        if (!selected || selected.available && !selected.available.includes(id)) return false;
        if (["hat", "pedalhat", "openhat"].includes(id)) chokeOpenHat();
        const koreanMetal = selected.id === "korean-kkwaenggwari" || selected.id === "korean-jing";
        if (koreanMetal && (id === "damp" || id === "mute")) chokeKoreanMetal(selected.id);
        loadDrumSample(id).then(function (sample) {
            const current = drumSampleConfig();
            if (!current || current.id !== sample.sampleSet) return;
            const context = ensureAudio();
            const source = context.createBufferSource();
            const gain = context.createGain();
            const baseGainDb = typeof current.gainDb === "number" ? current.gainDb : Number(current.gainDb[id] || 0);
            const gainDb = baseGainDb + Number((current.pieceBoostDb && current.pieceBoostDb[id]) || 0);
            source.buffer = sample.buffer;
            const sampledVelocity = Math.max(.08, Math.min(1.2, velocity));
            const koreanPercussion = current.id.indexOf("korean-") === 0;
            const requestedGain = koreanPercussion
                ? sampledVelocity * Math.pow(10, koreanPercussionTargetDb(id) / 20) / decodedBufferPeak(sample.buffer)
                : sampledVelocity * Math.pow(10, gainDb / 20);
            gain.gain.value = volumeOnlyGain(sample.buffer, requestedGain);
            source.connect(gain);
            connectFastToMix(gain, 0);
            if (id === "openhat") {
                const voice = { source, gain };
                state.openHatVoices.add(voice);
                source.onended = function () { state.openHatVoices.delete(voice); };
            }
            if (koreanMetal && id !== "damp" && id !== "mute" && id !== "muted") {
                const voices = state.koreanMetalVoices.get(current.id) || new Set();
                const voice = { source, gain };
                voices.add(voice);
                state.koreanMetalVoices.set(current.id, voices);
                const previousOnEnded = source.onended;
                source.onended = function () {
                    voices.delete(voice);
                    if (previousOnEnded) previousOnEnded();
                };
            }
            source.start(context.currentTime);
        }).catch(function () {
            const current = drumSampleConfig();
            if (current && current.id === selected.id) triggerDrum(id, velocity);
        });
        return true;
    }
    function triggerDrumV2(id, velocity) {
        const context = ensureAudio();
        if (!context) return;
        if (playSampledDrum(id, velocity)) {
            noteActivity(id, velocity);
            return;
        }
        playImmediateDrumExcitation(id, velocity, context.currentTime);
        const resonance = Number(elements.drumResonanceSlider.value) / 100;
        const tone = Number(elements.drumToneSlider.value) / 100;
        if (state.drumNode) {
            state.drumNode.port.postMessage({ type: "hit", id, velocity, resonance, tone, time: context.currentTime });
            noteActivity(id, velocity);
            return;
        }
        ensureDrumEngine().then(function (node) {
            if (!node) {
                triggerDrum(id, velocity);
                return;
            }
            node.port.postMessage({ type: "hit", id, velocity, resonance, tone, time: context.currentTime });
        });
        noteActivity(id, velocity);
    }

    const NO_PIANO_SUSTAIN_MODELS = new Set(["harpsichord", "clavinet", "hammond-organ", "pipe-organ"]);

    function supportsPianoSustain() {
        return Boolean(state.instrument === "piano" && state.currentModel && !NO_PIANO_SUSTAIN_MODELS.has(state.currentModel.id));
    }

    function updateSustainAvailability() {
        const supported = supportsPianoSustain();
        elements.sustainButton.classList.toggle("hidden", !supported);
        elements.sustainButton.disabled = !supported;
        elements.sustainButton.setAttribute("aria-hidden", String(!supported));
        if (elements.sustainButton.nextElementSibling) elements.sustainButton.nextElementSibling.classList.toggle("hidden", !supported);
        if (!supported && state.sustain) setSustain(false, false);
    }

    function setSustain(on, latched) {
        state.sustain = supportsPianoSustain() && Boolean(on);
        if (typeof latched === "boolean") state.sustainLatched = state.sustain && latched;
        elements.sustainButton.classList.toggle("active", state.sustain);
        elements.sustainButton.setAttribute("aria-pressed", String(state.sustain));
        if (!state.sustain) {
            state.pianoVoices.forEach(function (voice) { if (voice.held) releasePianoVoice(voice, false); });
        }
    }

    const DETAIL_SECTIONS = [
        ["overview", "AT A GLANCE", "한눈에 보는 악기"],
        ["mechanism", "HOW IT WORKS", "구조와 소리의 원리"],
        ["technique", "HOW TO PLAY", "연주법과 표현"],
        ["role", "IN THE MUSIC", "음악 속 역할"],
        ["history", "CONTEXT", "역사와 다른 악기 비교"]
    ];

    function instrumentDetails() {
        return window.INSTRUMENT_DETAILS || {};
    }

    function modelById(modelId) {
        const families = Object.keys(MODEL_LIBRARY);
        for (let index = 0; index < families.length; index += 1) {
            const model = MODEL_LIBRARY[families[index]].find(function (item) { return item.id === modelId; });
            if (model) return model;
        }
        return null;
    }

    function detailParentModel() {
        return modelById(state.detailParentId) || state.currentModel;
    }

    function renderDetailArtwork(entry, parent) {
        elements.detailArtwork.classList.add("hidden");
        elements.detailArtwork.classList.remove("corrected-handedness");
        elements.detailArtwork.removeAttribute("src");
        elements.detailArtworkLayers.innerHTML = "";
        elements.detailArtworkLayers.className = "detail-artwork-layers hidden";
        elements.detailArtworkFallback.classList.add("hidden");

        if (parent && parent.id === state.detailId && Array.isArray(parent.parts)) {
            elements.detailArtworkLayers.classList.remove("hidden");
            elements.detailArtworkLayers.dataset.layout = parent.station || "";
            const columns = parent.station === "daechwita" ? 3 : Math.min(5, parent.parts.length);
            elements.detailArtworkLayers.style.setProperty("--detail-part-count", String(columns));
            parent.parts.forEach(function (part) {
                const image = document.createElement("img");
                image.src = part.art;
                image.alt = "";
                elements.detailArtworkLayers.appendChild(image);
            });
            return;
        }

        let art = entry.art;
        if (!art && parent) {
            if (parent.id === state.detailId) art = parent.art;
            else if (Array.isArray(parent.parts)) {
                const part = parent.parts.find(function (item) { return item.id === state.detailId; });
                if (part) art = part.art;
            }
        }
        if (art) {
            elements.detailArtwork.src = art;
            elements.detailArtwork.alt = entry.name + " 악기 모습";
            elements.detailArtwork.classList.toggle("corrected-handedness", Boolean(parent && [
                "p-bass", "j-bass", "active-bass", "fretless-bass",
                "s-style", "metal-seven", "hollow-jazz", "dreadnought", "classical-guitar"
            ].includes(parent.id)));
            elements.detailArtwork.classList.remove("hidden");
            return;
        }
        elements.detailArtworkFallback.querySelector("b").textContent = entry.name;
        elements.detailArtworkFallback.classList.remove("hidden");
    }

    function renderDetailPartPicker(parent) {
        const parts = parent && Array.isArray(parent.parts) ? parent.parts : [];
        elements.detailPartPicker.innerHTML = "";
        elements.detailPartPicker.classList.toggle("hidden", !parts.length);
        if (!parts.length) return;
        [{ id: parent.id, name: "전체 구성" }].concat(parts).forEach(function (part) {
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("role", "listitem");
            button.textContent = part.name;
            button.classList.toggle("active", part.id === state.detailId);
            button.addEventListener("click", function () {
                state.detailId = part.id;
                renderInstrumentDetail();
            });
            elements.detailPartPicker.appendChild(button);
        });
    }

    function renderInstrumentDetail() {
        const entry = instrumentDetails()[state.detailId];
        const parent = detailParentModel();
        if (!entry || !parent) return;
        elements.detailFamily.textContent = entry.family;
        elements.detailTitle.textContent = entry.name;
        elements.detailSubtitle.textContent = entry.subtitle;
        renderDetailArtwork(entry, parent);
        renderDetailPartPicker(parent);

        const facts = [];
        if (state.detailId === parent.id && parent.size) facts.push(["실제 크기", parent.size]);
        if (state.detailId === parent.id && Array.isArray(parent.range)) {
            facts.push(["연주 음역", core.noteLabel(parent.range[0]) + " – " + core.noteLabel(parent.range[1])]);
        }
        entry.facts.forEach(function (fact) { facts.push(fact); });
        elements.detailFacts.innerHTML = "";
        facts.slice(0, 6).forEach(function (fact) {
            const box = document.createElement("div");
            const term = document.createElement("dt");
            const value = document.createElement("dd");
            term.textContent = fact[0];
            value.textContent = fact[1];
            box.append(term, value);
            elements.detailFacts.appendChild(box);
        });

        elements.detailArticle.innerHTML = "";
        DETAIL_SECTIONS.forEach(function (sectionCopy) {
            const section = document.createElement("section");
            section.className = "detail-section";
            const eyebrow = document.createElement("span");
            const title = document.createElement("h3");
            eyebrow.textContent = sectionCopy[1];
            title.textContent = sectionCopy[2];
            section.append(eyebrow, title);
            String(entry.sections[sectionCopy[0]] || "").split(/\n\s*\n/).filter(Boolean).forEach(function (paragraph) {
                const item = document.createElement("p");
                item.textContent = paragraph;
                section.appendChild(item);
            });
            elements.detailArticle.appendChild(section);
        });
        elements.detailArticle.scrollTop = 0;
    }

    function openInstrumentDetail(detailId) {
        if (!state.currentModel) return;
        const id = detailId || state.currentModel.detailId || state.currentModel.id;
        if (!instrumentDetails()[id]) {
            showToast("이 악기의 설명을 준비하고 있어요.");
            return;
        }
        state.detailReturnFocus = document.activeElement;
        state.detailParentId = state.currentModel.id;
        state.detailId = id;
        state.detailOpen = true;
        renderInstrumentDetail();
        elements.instrumentDetailModal.classList.remove("hidden");
        elements.instrumentDetailModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("detail-open");
        window.requestAnimationFrame(function () { elements.instrumentDetailDialog.focus(); });
    }

    function closeInstrumentDetail() {
        if (!state.detailOpen) return;
        state.detailOpen = false;
        elements.instrumentDetailModal.classList.add("hidden");
        elements.instrumentDetailModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("detail-open");
        const returnTarget = state.detailReturnFocus;
        state.detailReturnFocus = null;
        if (returnTarget && typeof returnTarget.focus === "function") returnTarget.focus();
    }

    function moveInstrumentDetail(direction) {
        const models = visibleModels();
        const currentIndex = Math.max(0, models.findIndex(function (model) { return model.id === state.detailParentId; }));
        const nextIndex = (currentIndex + direction + models.length) % models.length;
        const model = models[nextIndex];
        selectModel(model.id);
        state.detailParentId = model.id;
        state.detailId = model.detailId || model.id;
        renderInstrumentDetail();
    }

    function handleDetailKeydown(event) {
        if (!state.detailOpen) return;
        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            closeInstrumentDetail();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = Array.from(elements.instrumentDetailDialog.querySelectorAll("button:not([disabled]),a[href],[tabindex]:not([tabindex=\"-1\"])"))
            .filter(function (node) { return node.offsetParent !== null; });
        if (!focusable.length) {
            event.preventDefault();
            elements.instrumentDetailDialog.focus();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function visibleModels() {
        const models = MODEL_LIBRARY[state.family] || [];
        return state.family === "korean" ? models.filter(function (model) { return model.room === state.koreanRoom; }) : models;
    }

    function selectedModel() {
        const models = visibleModels();
        return models.find(function (model) { return model.id === state.modelId; }) || models[0];
    }

    function renderModelBrowser() {
        const familyCopy = FAMILY_COPY[state.family];
        elements.familyEyebrow.textContent = familyCopy[0];
        const koreanRoomNames = { melody: "국악 선율악기방", folk: "풍물·민속 타악기방", court: "궁중·의식 악기방" };
        elements.familyName.textContent = state.family === "korean" ? koreanRoomNames[state.koreanRoom] : familyCopy[1];
        elements.koreanRoomSwitch.classList.toggle("hidden", state.family !== "korean");
        elements.koreanRoomSwitch.parentElement.classList.toggle("korean-open", state.family === "korean");
        elements.modelChooser.innerHTML = "";
        visibleModels().forEach(function (model) {
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("role", "listitem");
            button.classList.toggle("active", model.id === state.modelId);
            button.innerHTML = "<span>" + model.tag + "</span><b>" + model.name + "</b>";
            button.addEventListener("click", function () { selectModel(model.id); });
            elements.modelChooser.appendChild(button);
        });
    }

    function renderMallet(stage) {
        elements.malletRender.innerHTML = "";
        elements.malletRender.className = "mallet-render";
        if (stage === "timpani") {
            elements.malletRender.classList.add("timpani");
            [["kick", "큰 팀파니"], ["lowtom", "작은 팀파니"]].forEach(function (entry) {
                const piece = document.createElement("span"); piece.dataset.drum = entry[0];
                elements.malletRender.appendChild(piece);
            });
        }
        else if (stage === "samul") {
            elements.malletRender.classList.add("samul");
            [["snare", "장구"], ["kick", "북"], ["hightom", "소고"], ["hat", "꽹과리"], ["ride", "징"]].forEach(function (entry) {
                const piece = document.createElement("span"); piece.dataset.drum = entry[0]; piece.dataset.name = entry[1];
                elements.malletRender.appendChild(piece);
            });
        } else {
            if (stage === "metal") elements.malletRender.classList.add("metal");
            for (let index = 0; index < 13; index += 1) { const piece = document.createElement("span"); piece.dataset.drum = DRUMS[index % DRUMS.length].id; elements.malletRender.appendChild(piece); }
        }
    }

    function renderMachine(stage) {
        const linn = stage === "linn";
        elements.machineDeck.className = "machine-deck " + (linn ? "linn" : "rhythm-808");
        elements.machineDeck.innerHTML = linn
            ? '<div class="linn-head"><b>DIGITAL DRUM COMPUTER</b><i>120.0</i></div><div class="linn-screen">PATTERN 01 · 12 BIT</div><div class="machine-pads"></div><div class="linn-transport"><span>REW</span><span>STOP</span><span>PLAY</span><span>REC</span></div>'
            : '<div class="machine-head"><b>ANALOG RHYTHM</b><small>PATTERN 01</small></div><div class="analog-knobs"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="machine-pads"></div><div class="step-row"></div>';
        const padBox = elements.machineDeck.querySelector(".machine-pads");
        activeDrums().forEach(function (drum) {
            const pad = document.createElement("span"); pad.textContent = drum.name; padBox.appendChild(pad);
        });
        const stepRow = elements.machineDeck.querySelector(".step-row");
        if (stepRow) for (let index = 0; index < 16; index += 1) stepRow.appendChild(document.createElement("i"));
    }

    function renderInstrumentLayers(model) {
        elements.instrumentLayers.innerHTML = "";
        elements.instrumentLayers.className = "instrument-layers";
        if (Array.isArray(model.parts)) {
            elements.instrumentLayers.dataset.layout = model.station || "";
            model.parts.forEach(function (part) {
                const layer = document.createElement("div");
                layer.className = "instrument-layer";
                layer.dataset.part = part.id;
                layer.style.setProperty("--part-scale", String(part.scale || 1));
                const image = document.createElement("img");
                image.src = part.art;
                image.alt = "";
                const label = document.createElement("span");
                label.textContent = part.name;
                layer.append(image, label);
                elements.instrumentLayers.appendChild(layer);
            });
            return;
        }
        if (model.toneMarkers) {
            elements.instrumentLayers.classList.add("tone-markers");
            elements.instrumentLayers.dataset.layout = model.id;
            for (let index = 0; index < 16; index += 1) {
                const tone = document.createElement("i");
                tone.className = "tone-marker";
                tone.dataset.tone = String(index);
                elements.instrumentLayers.appendChild(tone);
            }
        }
    }

    function pulseInstrumentPart(partId, midi) {
        let target = null;
        if (partId) target = elements.instrumentLayers.querySelector('[data-part="' + partId + '"]');
        if (!target && Number.isFinite(midi) && state.currentModel && state.currentModel.toneMarkers) {
            const tone = Math.max(0, Math.min(15, midi - state.currentModel.range[0]));
            target = elements.instrumentLayers.querySelector('[data-tone="' + tone + '"]');
        }
        if (!target && !elements.instrumentArtwork.classList.contains("hidden")) target = elements.instrumentArtwork;
        if (!target) return;
        target.classList.remove("active");
        void target.offsetWidth;
        target.classList.add("active");
        window.setTimeout(function () { target.classList.remove("active"); }, 260);
    }

    function updateInstrumentStage(model) {
        const hasLayers = Array.isArray(model.parts) || Boolean(model.toneMarkers);
        elements.instrumentVisual.className = "instrument-visual stage-" + model.stage + ((model.art || hasLayers) ? " has-artwork" : "");
        elements.instrumentVisual.dataset.model = model.id;
        elements.instrumentVisual.style.setProperty("--object-scale", String(model.visualScale || 1));
        elements.instrumentArtwork.classList.toggle("hidden", !model.art);
        if (model.art) {
            elements.instrumentArtwork.src = model.art;
            elements.instrumentArtwork.alt = model.name + " 실제 악기 형태";
        }
        renderInstrumentLayers(model);
        elements.instrumentLayers.classList.toggle("hidden", !hasLayers);
        elements.scaleGuide.classList.toggle("hidden", !model.size);
        elements.scaleValue.textContent = model.size || "";
        elements.scaleBar.style.width = (model.scalePercent || 100) + "%";
        elements.classicalRender.className = "classical-render hidden";
        elements.machineDeck.classList.add("hidden");
        elements.malletRender.classList.add("hidden");
        if (["classical", "wind", "brass"].includes(model.stage) && !model.art) {
            elements.classicalRender.className = "classical-render" + (model.stage === "wind" ? " render-wind" : model.stage === "brass" ? " render-wind render-brass" : "");
        } else if ((model.stage === "machine" || model.stage === "linn") && !model.art) {
            renderMachine(model.stage); elements.machineDeck.classList.remove("hidden");
        } else if (["timpani", "mallet", "metal", "samul"].includes(model.stage) && !model.art) {
            renderMallet(model.stage); elements.malletRender.classList.remove("hidden");
        }
    }

    function renderKeyboardPatchControls(model) {
        const box = elements.keyboardPatchControls;
        box.innerHTML = "";
        const controlMap = {
            ep: [["어택의 거칠기", 46], ["트레몰로", 28]],
            clavinet: [["픽업 혼합", 56], ["뮤트", 18]],
            digital: [["밝기", 62], ["코러스", 34]],
            hybrid: [["레이어 균형", 48], ["스테레오 폭", 68]],
            organ: model.id === "hammond-organ" ? [["드로바 바디", 72], ["로터리 속도", 32]] : [["스톱 혼합", 64], ["익스프레션", 72]]
        };
        const controls = controlMap[model.stage] || null;
        box.classList.toggle("hidden", !controls);
        if (!controls) return;
        controls.forEach(function (entry) {
            const label = document.createElement("label");
            label.innerHTML = `<span>${entry[0]} <output>${entry[1]}</output></span><input type="range" min="0" max="100" value="${entry[1]}">`;
            const slider = label.querySelector("input"); const output = label.querySelector("output");
            slider.addEventListener("input", function () { output.textContent = slider.value; });
            box.appendChild(label);
        });
        if (model.id === "hammond-organ") {
            const drawbars = document.createElement("div"); drawbars.className = "drawbars";
            [8,8,6,5,4,3,2,2,1].forEach(function (value) { const bar = document.createElement("i"); bar.style.setProperty("--draw", value); drawbars.appendChild(bar); }); box.prepend(drawbars);
        }
    }
    function renderDrumControlCopy(model) {
        if (model.engine !== "drums") return;
        const koreanSampled = Boolean(KOREAN_PERCUSSION_SAMPLE_SETS[model.id]);
        const sampled = Boolean(DRUM_SAMPLE_SETS[model.id]) || koreanSampled;
        const machine = model.stage === "machine" || model.stage === "linn";
        const mallet = model.stage === "mallet" || model.stage === "metal";
        const copy = koreanSampled ? ["KOREAN PERCUSSION ARTICULATIONS", "", "", ""]
            : model.station === "orchestral" ? ["ORCHESTRAL PERCUSSION", "", "", ""]
            : machine ? [model.stage === "linn" ? "12-BIT DRUM COMPUTER" : "ANALOG RHYTHM", "", "디케이", "톤"]
            : sampled ? ["ACOUSTIC DRUM KIT", "", "", ""]
            : model.stage === "timpani" ? ["TUNED MEMBRANE", "음높이와 헤드의 감쇠를 조절해요.", "댐핑", "말렛 경도"]

            : model.station === "samul" ? ["KOREAN FOLK PERCUSSION", "풍물·사물놀이 악기를 패드로 연주해요.", "울림", "채 경도"]
            : model.station === "ritual" ? ["COURT SIGNALS", "박·축·어의 시작과 마침 신호를 살펴봐요.", "울림", "채 경도"]
            : model.station === "daechwita" ? ["ROYAL PROCESSION", "대취타 편성의 대표 악기를 패드로 살펴봐요.", "울림", "밝기"]
            : mallet ? ["KEYBOARD PERCUSSION", "음판 구조를 살펴보고 건반으로 연주해요.", "댐핑", "말렛 경도"]
            : ["ACOUSTIC DRUM KIT", "세트 구성을 살펴보고 아래 패드로 연주해요.", "공명", "밝기"];
        elements.drumControls.classList.toggle("sampled-kit", sampled);
        elements.drumSystemLabel.textContent = copy[0];
        elements.drumSystemDescription.textContent = copy[1];
        elements.drumSystemDescription.classList.toggle("hidden", !copy[1]);
        elements.drumResonanceLabel.textContent = copy[2];
        elements.drumToneLabel.textContent = copy[3];
    }

    function selectModel(modelId) {
        const model = visibleModels().find(function (item) { return item.id === modelId; });
        if (!model) return;
        state.currentModel = model;
        if (!model.guitar) state.guitarMode = "keyboard";
        state.modelId = model.id;
        selectInstrument(model.engine);
        elements.modelBadge.textContent = model.badge;
        elements.instrumentName.textContent = model.name;
        elements.instrumentDescription.textContent = model.description;
        elements.instrumentInfoButton.setAttribute("aria-label", model.name + " 자세한 설명 열기");
        elements.visualFamily.textContent = state.family === "korean" ? "KOREAN · " + state.koreanRoom.toUpperCase() : FAMILY_COPY[state.family][0];
        elements.visualModel.textContent = model.model;
        const expressive = Boolean(model.expressive) || model.stage === "classical" || model.stage === "wind" || model.stage === "brass";
        elements.pianoControls.classList.toggle("hidden", model.engine !== "piano");
        elements.stringControls.classList.toggle("hidden", expressive || model.engine !== "bass" && model.engine !== "guitar");
        elements.classicalControls.classList.toggle("hidden", !expressive);
        elements.drumControls.classList.toggle("hidden", model.engine !== "drums");
        elements.guitarModeSwitch.classList.toggle("hidden", !model.guitar);
        elements.guitarFxControls.classList.toggle("hidden", !model.guitar);

        updateInstrumentStage(model);
        renderKeyboardPatchControls(model);
        renderClassicalArticulations(model);
        updateSustainAvailability();
        renderDrumControlCopy(model);
        renderDrumPads();
        if (drumSampleConfig()) preloadDrumSamples();
        if (isSampledPiano()) preloadConcertGrandRange();
        renderModelBrowser();
    }

    function selectFamily(family) {
        if (!MODEL_LIBRARY[family]) return;
        state.family = family;
        document.body.dataset.family = family;
        state.modelId = visibleModels()[0].id;
        document.querySelectorAll("[data-family]").forEach(function (button) {
            const active = button.dataset.family === family; button.classList.toggle("active", active); button.setAttribute("aria-selected", String(active));
        });
        renderModelBrowser();
        selectModel(state.modelId);
    }

    function selectKoreanRoom(room) {
        if (!["melody", "folk", "court"].includes(room)) return;
        allNotesOff();
        state.koreanRoom = room;
        document.querySelectorAll("[data-korean-room]").forEach(function (button) {
            const active = button.dataset.koreanRoom === room;
            button.classList.toggle("active", active);
            button.setAttribute("aria-selected", String(active));
        });
        state.modelId = visibleModels()[0].id;
        renderModelBrowser();
        selectModel(state.modelId);
    }

    function noteActivity(label, velocity, midi) {
        state.visualEnergy = Math.max(state.visualEnergy, velocity || .7);
        if (Number.isFinite(midi)) state.visualPitch = midi;
        elements.noteReadout.textContent = Number.isFinite(midi) ? core.noteLabel(midi) : String(label);
        pulseInstrumentPart(null, midi);
    }

    function noteOn(midi, velocity) {
        if (!isPitchPlayable(midi)) {
            showToast("이 악기의 연주 음역 밖이에요.");
            return;
        }
        if (state.activeNotes.has(midi)) return;
        state.activeNotes.add(midi);
        const key = elements.keyboard.querySelector('[data-midi="' + midi + '"]');
        if (key) key.classList.add("active");
        if (isSampledPiano() || state.instrument === "piano") pianoNoteOn(midi, velocity);
        else stringNoteOn(midi, velocity);
        noteActivity(core.noteLabel(midi), velocity, midi);
    }

    function noteOff(midi) {
        state.activeNotes.delete(midi);
        const key = elements.keyboard.querySelector('[data-midi="' + midi + '"]');
        if (key) key.classList.remove("active");
        if (isSampledPiano() || state.instrument === "piano") pianoNoteOff(midi);
        else stringNoteOff(midi);
    }

    function allNotesOff() {
        Array.from(state.activeNotes).forEach(noteOff);
        state.activeNotes.clear();
        state.pointerNotes.clear();
        state.pressedCodes.clear();
        chokeOpenHat();
        Array.from(state.koreanMetalVoices.keys()).forEach(chokeKoreanMetal);
        state.pianoVoices.forEach(function (voice) { releasePianoVoice(voice, true); });
        if (state.stringNode) state.stringNode.port.postMessage({ type: "allOff" });
        if (state.drumNode) state.drumNode.port.postMessage({ type: "allOff" });
        document.querySelectorAll(".key.active,.drum-pad.active").forEach(function (item) { item.classList.remove("active"); });
    }

    function pointerVelocity(event, key) {
        const rect = key.getBoundingClientRect();
        const relativeY = (event.clientY - rect.top) / Math.max(1, rect.height);
        return event.pressure > .05 ? Math.max(.38, event.pressure) : core.pointerVelocity(relativeY);
    }

    function movePointerToKey(event) {
        if (!state.pointerNotes.has(event.pointerId)) return;
        const hit = document.elementFromPoint(event.clientX, event.clientY);
        const key = hit && hit.closest ? hit.closest(".key") : null;
        if (!key || key.disabled || !elements.keyboard.contains(key)) return;
        const nextMidi = Number(key.dataset.midi);
        const previousMidi = state.pointerNotes.get(event.pointerId);
        if (nextMidi === previousMidi) return;
        noteOff(previousMidi);
        state.pointerNotes.set(event.pointerId, nextMidi);
        noteOn(nextMidi, pointerVelocity(event, key));
    }

    function releasePointer(event) {
        if (!state.pointerNotes.has(event.pointerId)) return;
        noteOff(state.pointerNotes.get(event.pointerId));
        state.pointerNotes.delete(event.pointerId);
    }

    function currentPitchRange() {
        if (state.family === "korean") {
            const sampleConfig = sampledPianoConfig();
            if (sampleConfig) return { start: sampleConfig.min, end: sampleConfig.max };
        }
        if (state.family === "keyboard") return { start: DISPLAY_RANGE.start, end: DISPLAY_RANGE.end };
        if (state.currentModel && Array.isArray(state.currentModel.range)) return { start: state.currentModel.range[0], end: state.currentModel.range[1] };
        return core.getInstrumentRange(state.instrument === "guitar" ? "guitar" : state.instrument);
    }

    function isPitchPlayable(midi) {
        const range = currentPitchRange();
        return midi >= range.start && midi <= range.end;
    }

    function isPitchedPercussion() {
        return state.instrument === "drums" && Boolean(state.currentModel && state.currentModel.pitched);
    }

    function renderKeyboard() {
        const range = currentPitchRange();
        const layout = core.keyboardLayout(DISPLAY_RANGE.start, DISPLAY_RANGE.end);
        const whiteWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--key-width")) || 48;
        const blackWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--black-width")) || 31;
        const shortcutByMidi = new Map(COMPUTER_KEYS.map(function (entry) { return [state.keyboardStartMidi + entry[1], entry[2]]; }));
        elements.keyboard.innerHTML = "";
        elements.keyboard.style.width = (layout.whiteCount * whiteWidth) + "px";
        layout.notes.forEach(function (note) {
            const key = document.createElement("button");
            key.type = "button";
            const unavailable = note.midi < range.start || note.midi > range.end;
            const edge = note.midi === range.start || note.midi === range.end;
            key.className = "key " + (note.black ? "black-key" : "white-key") + (note.midi % 12 === 0 ? " c-note" : "") + (unavailable ? " unavailable" : "") + (edge ? " range-edge" : "");
            key.dataset.midi = note.midi;
            key.dataset.shortcut = unavailable ? "" : shortcutByMidi.get(note.midi) || "";
            if (edge) key.dataset.rangeLabel = note.midi === range.start ? "최저 " + note.label : "최고 " + note.label;
            key.disabled = unavailable;
            key.setAttribute("aria-label", note.label + (unavailable ? " · 연주 음역 밖" : ""));
            key.style.left = note.black ? ((note.whiteIndex + 1) * whiteWidth - blackWidth / 2) + "px" : (note.whiteIndex * whiteWidth) + "px";
            key.addEventListener("pointerdown", function (event) {
                if (unavailable) return;
                event.preventDefault();
                key.setPointerCapture(event.pointerId);
                state.pointerNotes.set(event.pointerId, note.midi);
                noteOn(note.midi, pointerVelocity(event, key));
            });
            key.addEventListener("pointermove", movePointerToKey);
            key.addEventListener("pointerup", releasePointer);
            key.addEventListener("pointercancel", releasePointer);
            key.addEventListener("lostpointercapture", releasePointer);
            elements.keyboard.appendChild(key);
        });
        elements.keyboardRangeReadout.textContent = core.noteLabel(state.keyboardStartMidi) + "–" + core.noteLabel(state.keyboardStartMidi + COMPUTER_KEY_SPAN);
        const minimum = minimumKeyboardStart();
        const maximum = maximumKeyboardStart();
        elements.whiteKeyDown.disabled = state.keyboardStartMidi <= minimum;
        elements.octaveDown.disabled = state.keyboardStartMidi - 12 < minimum;
        elements.whiteKeyUp.disabled = state.keyboardStartMidi >= maximum;
        elements.octaveUp.disabled = state.keyboardStartMidi + 12 > maximum;
        elements.rangeLegend.classList.remove("hidden");
        elements.rangeReadout.textContent = "연주 음역 " + core.noteLabel(range.start) + "–" + core.noteLabel(range.end);
        window.requestAnimationFrame(centerKeyboardOnComputerOctave);
    }

    function centerKeyboardOnComputerOctave() {
        const centerMidi = Math.round(state.keyboardStartMidi + COMPUTER_KEY_SPAN / 2);
        const target = elements.keyboard.querySelector('[data-midi="' + centerMidi + '"]');
        if (!target) return;
        const desired = target.offsetLeft + target.offsetWidth * .5 - elements.keyboardViewport.clientWidth * .5;
        elements.keyboardViewport.scrollLeft = Math.max(0, desired);
    }

    function renderChordPads() {
        elements.chordPads.innerHTML = "";
        Object.keys(core.GUITAR_CHORDS).forEach(function (name) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = name;
            button.classList.toggle("active", name === state.guitarChord);
            button.setAttribute("aria-pressed", String(name === state.guitarChord));
            button.addEventListener("pointerdown", function (event) {
                event.preventDefault();
                state.guitarChord = name;
                strum("down");
                renderChordPads();
            });
            elements.chordPads.appendChild(button);
        });
    }

    function strum(direction) {
        const context = ensureAudio();
        if (!context) return;
        const notes = core.getStrumOrder(core.getGuitarChord(state.guitarChord), direction);
        const sampled = isSampledPiano();
        const start = context.currentTime;
        notes.forEach(function (midi, index) {
            const delay = index * (direction === "down" ? 9 : 8);
            if (sampled) {
                window.setTimeout(function () {
                    state.activeNotes.add(midi);
                    pianoNoteOn(midi, .7 + index * .035);
                    window.setTimeout(function () {
                        state.activeNotes.delete(midi);
                        pianoNoteOff(midi);
                    }, 1250);
                }, delay);
                return;
            }
            const when = start + delay / 1000;
            state.activeNotes.add(midi);
            stringNoteOn(midi, .7 + index * .035, when);
            window.setTimeout(function () { state.activeNotes.delete(midi); }, 1300 + index * 24);
        });
        noteActivity(state.guitarChord + " · " + (direction === "down" ? "다운" : "업"), .88, notes[0]);
    }

    const drumPadFlashTimers = new WeakMap();
    function setDrumPadActive(button, active) {
        if (!button) return;
        const pending = drumPadFlashTimers.get(button);
        if (pending) window.clearTimeout(pending);
        if (active) {
            button.classList.add("active");
            button.dataset.activeSince = String(performance.now());
            return;
        }
        const elapsed = performance.now() - Number(button.dataset.activeSince || 0);
        const timer = window.setTimeout(function () {
            button.classList.remove("active");
            drumPadFlashTimers.delete(button);
        }, Math.max(0, 180 - elapsed));
        drumPadFlashTimers.set(button, timer);
    }

    function renderDrumPads() {
        elements.drumPads.innerHTML = "";
        const drums = activeDrums();
        elements.drumPads.classList.toggle("extended", drums.length >= 9);
        elements.drumPads.classList.toggle("korean-articulations", Boolean(state.currentModel && KOREAN_PERCUSSION_PADS[state.currentModel.id]));
        drums.forEach(function (drum) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "drum-pad";
            button.dataset.drum = drum.id;
            if (drum.sourceName) button.title = drum.sourceName;
            button.style.setProperty("--pad-color", drum.color);
            button.innerHTML = "<span>" + drum.family + "</span><b>" + drum.name + "</b><small>키보드 " + drum.key + "</small>";
            button.addEventListener("pointerdown", function (event) {
                event.preventDefault();
                setDrumPadActive(button, true);
                const rect = button.getBoundingClientRect();
                const velocity = event.pressure > .05 ? Math.max(.4, event.pressure) : core.pointerVelocity((event.clientY - rect.top) / rect.height);
                triggerDrumV2(drum.sound || drum.id, velocity);
                pulseInstrumentPart(drum.id);
            });
            ["pointerup", "pointercancel", "pointerleave"].forEach(function (type) { button.addEventListener(type, function () { setDrumPadActive(button, false); }); });
            elements.drumPads.appendChild(button);
        });
    }

    function renderClassicalArticulations(model) {
        const box = elements.classicalArticulationButtons;
        box.innerHTML = "";
        const expressive = Boolean(model.expressive) || ["classical", "wind", "brass"].includes(model.stage);
        if (!expressive) {
            elements.classicalArticulationHint.textContent = "";
            return;
        }
        const bowed = ["violin", "viola", "cello", "upright-bass"].includes(model.id);
        const plucked = model.id === "harp" || ["gayageum", "gayageum-25", "geomungo", "yanggeum"].includes(model.id);
        const koreanBowed = ["haegeum", "ajaeng"].includes(model.id);
        const daegeum = model.id === "daegeum";
        const hyangpiri = model.id === "hyangpiri";
        const gayageum = model.id === "gayageum";
        const geomungo = model.id === "geomungo";
        const yanggeum = model.id === "yanggeum";
        const danso = model.id === "danso";
        const wind = model.stage === "wind" || model.stage === "brass" || model.stage === "korean-wind";
        const options = bowed ? [["sustain", "활긋기"], ["pizzicato", "피치카토"]]
            : gayageum ? [["pluck", "기본 뜯기"], ["slow-vibrato", "느린 농현"], ["fast-vibrato", "빠른 농현"], ["roll", "트레몰로"], ["bend-down", "퇴성"], ["bend-up", "추성"]]
            : geomungo ? [["pluck", "기본 뜯기"], ["light-vibrato", "잔농현"], ["deep-vibrato", "깊은 농현"]]
            : yanggeum ? [["pluck", "기본 타현"], ["tremolo", "트레몰로"]]
            : plucked ? [["pluck", "뜯기"]]
            : model.id === "haegeum" ? [["sustain", "기본 활긋기"], ["vibrato", "비브라토"]]
            : model.id === "ajaeng" ? [["sustain", "기본 활긋기"], ["vibrato", "비브라토"]]
            : koreanBowed ? [["sustain", "활긋기"]]
            : daegeum ? [["sustain", "기본음"], ["vibrato", "비브라토"]]
            : hyangpiri ? [["sustain", "기본음"], ["vibrato", "비브라토"]]
            : danso ? [["sustain", "기본음"], ["vibrato", "비브라토"]]
            : wind ? [["sustain", "지속음"]]
            : [["sustain", "기본 주법"]];
        const hint = bowed ? "활로 긋는 지속음과 손가락으로 뜯는 피치카토 원음을 바꿉니다."
            : gayageum ? "뜯기와 농현의 빠르기, 트레몰로, 음을 흘려 내리거나 밀어 올리는 주법 원음을 바꿉니다."
            : geomungo ? "술대로 튕기는 기본음과 폭이 다른 두 농현 원음을 주법별로 바꿉니다."
            : yanggeum ? "채로 한 번 치는 기본 타현과 빠르게 되풀이하는 트레몰로 원음을 바꿉니다."
            : plucked ? "현을 뜯거나 쳐 낸 뒤 자연스럽게 줄어드는 실제 악기 특성을 따릅니다."
            : model.id === "haegeum" ? "곧게 긋는 기본음과 농현이 담긴 비브라토 활긋기 원음을 바꿉니다."
            : model.id === "ajaeng" ? "기본 활긋기와 농현이 담긴 비브라토 원음을 바꿉니다."
            : koreanBowed ? "활로 현을 마찰해 소리를 이어 가는 기본 주법입니다."
            : daegeum ? "곧게 이어 부는 기본음과 농음이 담긴 비브라토 원음을 바꿉니다."
            : hyangpiri ? "곧게 이어 부는 기본음과 농음이 담긴 비브라토 원음을 바꿉니다."
            : danso ? "곧게 이어 부는 기본음과 비브라토 원음을 바꿉니다."
            : wind ? "한 번의 호흡으로 음을 이어 내는 기본 지속음입니다."
            : "현재 제공되는 기본 주법입니다.";
        if (!options.some(function (item) { return item[0] === state.articulation; })) state.articulation = options[0][0];
        options.forEach(function (option) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = option[1];
            button.classList.toggle("active", option[0] === state.articulation);
            button.setAttribute("aria-pressed", String(option[0] === state.articulation));
            button.disabled = options.length === 1;
            button.addEventListener("click", function () {
                allNotesOff();
                state.articulation = option[0];
                renderClassicalArticulations(model);
                renderKeyboard();
                preloadConcertGrandRange();
            });
            box.appendChild(button);
        });
        elements.classicalArticulationHint.textContent = hint;
        box.classList.remove("hidden");
    }

    function renderSoundPresets() {
        const sStyle = Boolean(state.currentModel && state.currentModel.id === "s-style");
        elements.soundPresetGroup.classList.toggle("hidden", !sStyle);
        elements.soundPresetButtons.innerHTML = "";
        if (!sStyle) return;
        const presets = [["clean", "클린"], ["blues", "블루스"], ["funk", "펑크"], ["rock", "록"]];
        if (!presets.some(function (item) { return item[0] === state.stringPreset; })) state.stringPreset = "clean";
        presets.forEach(function (preset) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = preset[1];
            button.classList.toggle("active", preset[0] === state.stringPreset);
            button.setAttribute("aria-pressed", String(preset[0] === state.stringPreset));
            button.addEventListener("click", function () {
                allNotesOff();
                state.stringPreset = preset[0];
                renderSoundPresets();
                preloadConcertGrandRange();
            });
            elements.soundPresetButtons.appendChild(button);
        });
        elements.soundPresetHint.textContent = "같은 기타를 서로 다르게 녹음한 실제 음색 세트입니다. 주법과 구분해 선택합니다.";
    }

    function renderArticulations() {
        const modelId = state.currentModel && state.currentModel.id;
        const sampledGuitar = ["s-style", "metal-seven", "hollow-jazz", "dreadnought", "classical-guitar"].includes(modelId);
        const physicalGuitar = state.instrument === "guitar" && !sampledGuitar;
        const options = state.instrument === "bass"
            ? [["finger", "핑거"], ["pick", "피크"], ["slap", "슬랩"]]
            : modelId === "classical-guitar" ? [["finger", "핑거"]]
            : physicalGuitar ? [["pick", "피크"], ["finger", "핑거"], ["mute", "뮤트"], ["harmonic", "하모닉"]]
            : [["pick", "피킹"]];
        const hints = {
            bass: "손가락·피크·슬랩으로 따로 녹음한 원음을 즉시 바꿉니다.",
            sampled: modelId === "classical-guitar" ? "나일론 현을 손가락으로 뜯은 원음입니다." : modelId === "dreadnought" ? "스틸 현 통기타의 원음을 그대로 사용합니다." : "피크로 현을 튕긴 원음입니다.",
            physical: "철현 기타 원본의 음 배열이 불완전해 이 모델만 실시간 현 모델링 주법을 사용합니다."
        };
        if (!options.some(function (item) { return item[0] === state.articulation; })) state.articulation = options[0][0];
        elements.articulationButtons.innerHTML = "";
        options.forEach(function (option) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = option[1];
            button.classList.toggle("active", option[0] === state.articulation);
            button.setAttribute("aria-pressed", String(option[0] === state.articulation));
            button.disabled = options.length === 1;
            button.addEventListener("click", function () {
                allNotesOff();
                state.articulation = option[0];
                renderArticulations();
                preloadConcertGrandRange();
            });
            elements.articulationButtons.appendChild(button);
        });
        elements.articulationHint.textContent = state.instrument === "bass" ? hints.bass : sampledGuitar ? hints.sampled : hints.physical;
        elements.physicalStringControls.classList.toggle("hidden", !physicalGuitar);
        renderSoundPresets();
    }

    function updatePlaySurface() {
        const drums = state.instrument === "drums" && !isPitchedPercussion();
        const pitchedPercussion = isPitchedPercussion();
        const chords = state.instrument === "guitar" && state.guitarMode === "chords";
        elements.keyboardViewport.classList.toggle("hidden", drums || chords);
        elements.chordSurface.classList.toggle("hidden", !chords);
        elements.drumPads.classList.toggle("hidden", !drums);
        elements.drumPads.style.display = drums ? "grid" : "";
        elements.keyboardRangeControls.classList.toggle("hidden", drums || chords);
        elements.rangeLegend.classList.toggle("hidden", drums || chords);
        elements.keySizeButton.classList.toggle("hidden", drums || chords);
    }

    function selectInstrument(instrument) {
        allNotesOff();
        state.instrument = instrument;
        const copy = INSTRUMENT_COPY[instrument];
        elements.modelBadge.textContent = copy.badge;
        elements.instrumentName.textContent = copy.name;
        elements.instrumentDescription.textContent = copy.description;
        elements.visualFamily.textContent = copy.family;
        elements.visualModel.textContent = copy.model;
        elements.pianoControls.classList.toggle("hidden", instrument !== "piano");
        elements.stringControls.classList.toggle("hidden", instrument !== "bass" && instrument !== "guitar");
        elements.drumControls.classList.toggle("hidden", instrument !== "drums");
        elements.guitarModeSwitch.classList.toggle("hidden", instrument !== "guitar");
        if (instrument === "bass") {
            state.keyboardStartMidi = 36;
            state.articulation = "finger";
            elements.toneSlider.value = 58; elements.muteSlider.value = 8; elements.pickSlider.value = 34; elements.driveSlider.value = 6;
        } else if (instrument === "guitar") {
            state.keyboardStartMidi = 48;
            state.articulation = "pick";
            state.stringPreset = "clean";
            elements.toneSlider.value = 69; elements.muteSlider.value = 5; elements.pickSlider.value = 24; elements.driveSlider.value = 12;
        } else if (instrument === "piano") state.keyboardStartMidi = 60;
        if (state.family === "keyboard") {
            state.keyboardStartMidi = 60;
        } else if (state.currentModel && Array.isArray(state.currentModel.range)) {
            const start = state.currentModel.range[0];
            const end = state.currentModel.range[1];
            const target = start + Math.round((end - start) * 0.2);
            const cMidi = Math.max(0, Math.min(108, Math.round(target / 12) * 12));
            state.keyboardStartMidi = clampKeyboardStart(cMidi);
        }
        renderArticulations();
        syncRangeOutputs();
        if (instrument !== "drums" || isPitchedPercussion()) renderKeyboard();
        updatePlaySurface();
        updateStringChain();
        // 음원 악기의 미리 받기는 selectModel에서 주법이 정해진 뒤에 한다.
        if (!isSampledPiano()) {
            if (instrument === "bass" || instrument === "guitar") ensureStringEngine();
            else if (instrument === "drums" && !isPitchedPercussion()) ensureDrumEngine();
        }
        else if (isPitchedPercussion()) ensureStringEngine();
        elements.noteReadout.textContent = "준비됨";
    }

    function syncRangeOutputs() {
        elements.toneOutput.value = elements.toneSlider.value;
        elements.toneOutput.textContent = elements.toneSlider.value;
        elements.muteOutput.value = elements.muteSlider.value;
        elements.muteOutput.textContent = elements.muteSlider.value;
        elements.pickOutput.value = elements.pickSlider.value;
        elements.pickOutput.textContent = elements.pickSlider.value;
        elements.driveOutput.value = elements.driveSlider.value;
        elements.driveOutput.textContent = elements.driveSlider.value;
        elements.drumResonanceOutput.value = elements.drumResonanceSlider.value;
        elements.drumResonanceOutput.textContent = elements.drumResonanceSlider.value;
        elements.drumToneOutput.value = elements.drumToneSlider.value;
        elements.drumToneOutput.textContent = elements.drumToneSlider.value;
        updateStringChain();
    }

    function setGuitarMode(mode) {
        allNotesOff();
        state.guitarMode = mode;
        document.querySelectorAll("[data-guitar-mode]").forEach(function (button) {
            button.classList.toggle("active", button.dataset.guitarMode === mode);
        });
        updatePlaySurface();
    }

    function isWhiteMidi(midi) {
        return WHITE_PITCH_CLASSES.has(((midi % 12) + 12) % 12);
    }

    function minimumKeyboardStart() {
        let midi = DISPLAY_RANGE.start;
        while (!isWhiteMidi(midi)) midi += 1;
        return midi;
    }

    function maximumKeyboardStart() {
        let midi = DISPLAY_RANGE.end - COMPUTER_KEY_SPAN;
        while (!isWhiteMidi(midi)) midi -= 1;
        return midi;
    }

    function clampKeyboardStart(midi) {
        return Math.max(minimumKeyboardStart(), Math.min(maximumKeyboardStart(), midi));
    }

    function setKeyboardStart(midi) {
        const nextStart = clampKeyboardStart(midi);
        if (nextStart === state.keyboardStartMidi) return;
        allNotesOff();
        state.keyboardStartMidi = nextStart;
        renderKeyboard();
        preloadConcertGrandRange();
    }

    function moveKeyboardByWhiteKey(direction) {
        let nextStart = state.keyboardStartMidi + direction;
        while (nextStart >= minimumKeyboardStart() && nextStart <= maximumKeyboardStart() && !isWhiteMidi(nextStart)) nextStart += direction;
        setKeyboardStart(nextStart);
    }

    function changeKeyboardOctave(delta) {
        setKeyboardStart(state.keyboardStartMidi + delta * 12);
    }

    function handleComputerKeyDown(event) {
        if (state.detailOpen) return;
        if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
        const tag = event.target && event.target.tagName;
        const textEntry = tag === "TEXTAREA" || tag === "SELECT" || (tag === "INPUT" && event.target.type !== "range");
        if (textEntry) return;
        const keyboardDirection = event.code === "ArrowLeft" ? -1 : event.code === "ArrowRight" ? 1 : 0;
        const octaveUnavailable = state.instrument === "drums" && !isPitchedPercussion() || state.instrument === "guitar" && state.guitarMode === "chords";
        if (keyboardDirection && tag !== "INPUT" && !octaveUnavailable && elements.keySizeModal.classList.contains("hidden")) {
            event.preventDefault();
            if (event.shiftKey) changeKeyboardOctave(keyboardDirection);
            else moveKeyboardByWhiteKey(keyboardDirection);
            return;
        }
        if (event.code === "Space" && supportsPianoSustain()) {
            event.preventDefault();
            setSustain(true);
            return;
        }
        if (state.instrument === "drums" && !isPitchedPercussion()) {
            const drum = activeDrums().find(function (item) { return item.code === event.code; });
            if (!drum) return;
            event.preventDefault();
            triggerDrumV2(drum.sound || drum.id, .82);
            pulseInstrumentPart(drum.id);
            const pad = elements.drumPads.querySelector('[data-drum="' + drum.id + '"]');
            if (pad) setDrumPadActive(pad, true);
            state.pressedCodes.set(event.code, drum.id);
            return;
        }
        if (state.instrument === "guitar" && state.guitarMode === "chords") return;
        const mapping = COMPUTER_KEYS.find(function (item) { return item[0] === event.code; });
        if (!mapping) return;
        event.preventDefault();
        const midi = state.keyboardStartMidi + mapping[1];
        if (!isPitchPlayable(midi)) {
            showToast("이 악기의 연주 음역 밖이에요.");
            return;
        }
        state.pressedCodes.set(event.code, midi);
        noteOn(midi, .78);
    }

    function handleComputerKeyUp(event) {
        if (event.code === "Space" && supportsPianoSustain()) {
            if (!state.sustainLatched) setSustain(false);
            return;
        }
        if (!state.pressedCodes.has(event.code)) return;
        const value = state.pressedCodes.get(event.code);
        state.pressedCodes.delete(event.code);
        if (state.instrument === "drums" && !isPitchedPercussion()) {
            const pad = elements.drumPads.querySelector('[data-drum="' + value + '"]');
            if (pad) setDrumPadActive(pad, false);
        } else noteOff(value);
    }

    function bindEvents() {
        elements.keySizeButton.addEventListener("click", openKeySizeDialog);
        document.querySelectorAll("[data-key-size-close]").forEach(function (button) { button.addEventListener("click", closeKeySizeDialog); });
        elements.calibrationSlider.addEventListener("input", function () { elements.calibrationCard.style.width = elements.calibrationSlider.value + "px"; });
        elements.calibrationSave.addEventListener("click", saveScreenCalibration);
        elements.calibrationReset.addEventListener("click", resetScreenCalibration);
        elements.keyScaleSlider.addEventListener("input", function () {
            state.keyboardScale = Number(elements.keyScaleSlider.value) / 100;
            saveKeyboardSize();
            applyKeyboardSize(true);
        });
        elements.instrumentInfoButton.addEventListener("click", function () { openInstrumentDetail(); });
        document.querySelectorAll("[data-detail-close]").forEach(function (button) { button.addEventListener("click", closeInstrumentDetail); });
        elements.detailPrevious.addEventListener("click", function () { moveInstrumentDetail(-1); });
        elements.detailNext.addEventListener("click", function () { moveInstrumentDetail(1); });
        document.addEventListener("keydown", handleDetailKeydown, true);
        document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeKeySizeDialog(); }, true);
        elements.audioButton.addEventListener("click", function () {
            ensureAudio();
            elements.audioButton.textContent = "준비 중…";
            const tasks = [preloadConcertGrandRange(), preloadDrumSamples(), loadPianoSamples(), ensureStringEngine(), ensureDrumEngine()];
            Promise.all(tasks).then(function () {
                elements.audioButton.classList.add("hidden");
                showToast("소리가 준비됐어요.");
            }).catch(function () {
                elements.audioButton.textContent = "소리 다시 켜기";
                elements.audioButton.classList.remove("hidden");
            });
        });
        document.querySelectorAll("[data-family]").forEach(function (button) {
            button.addEventListener("click", function () { selectFamily(button.dataset.family); });
        });
        document.querySelectorAll("[data-korean-room]").forEach(function (button) {
            button.addEventListener("click", function () { selectKoreanRoom(button.dataset.koreanRoom); });
        });
        document.querySelectorAll("[data-guitar-mode]").forEach(function (button) {
            button.addEventListener("click", function () { setGuitarMode(button.dataset.guitarMode); });
        });
        document.querySelectorAll("[data-strum]").forEach(function (button) {
            button.addEventListener("pointerdown", function (event) { event.preventDefault(); strum(button.dataset.strum); });
        });
        elements.sustainButton.addEventListener("click", function () { if (supportsPianoSustain()) setSustain(!state.sustain, !state.sustain); });
        [elements.toneSlider, elements.muteSlider, elements.pickSlider, elements.driveSlider, elements.drumResonanceSlider, elements.drumToneSlider]
            .forEach(function (slider) { slider.addEventListener("input", syncRangeOutputs); });
        elements.octaveDown.addEventListener("click", function () { changeKeyboardOctave(-1); });
        elements.whiteKeyDown.addEventListener("click", function () { moveKeyboardByWhiteKey(-1); });
        elements.whiteKeyUp.addEventListener("click", function () { moveKeyboardByWhiteKey(1); });
        elements.octaveUp.addEventListener("click", function () { changeKeyboardOctave(1); });
        elements.keyboard.addEventListener("contextmenu", function (event) { event.preventDefault(); });
        elements.keyboard.addEventListener("dragstart", function (event) { event.preventDefault(); });
        document.addEventListener("keydown", handleComputerKeyDown);
        document.addEventListener("keyup", handleComputerKeyUp);
        window.addEventListener("blur", allNotesOff);
        document.addEventListener("visibilitychange", function () { if (document.hidden) allNotesOff(); });
        window.addEventListener("resize", function () {
            if (currentDisplayKey() !== state.displayKey) { loadKeyboardSize(); applyKeyboardSize(false); }
            syncCalibrationUi();
            if (state.instrument !== "drums") renderKeyboard();
        });
    }

    function animateVisual() {
        const canvas = elements.stringCanvas;
        const rect = canvas.getBoundingClientRect();
        const ratio = Math.min(2, window.devicePixelRatio || 1);
        const width = Math.max(1, Math.floor(rect.width * ratio));
        const height = Math.max(1, Math.floor(rect.height * ratio));
        if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
        document.querySelectorAll(".fx-strip input,.classical-controls input").forEach(function (slider) {
            slider.addEventListener("input", function () { const output = slider.parentElement.querySelector("output"); if (output) output.textContent = slider.value; });
        });
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, width, height);
        context.save();
        context.scale(ratio, ratio);
        const cssWidth = width / ratio;
        const cssHeight = height / ratio;
        const lines = state.instrument === "bass" ? 4 : state.instrument === "guitar" ? 6 : 0;
        const centerY = cssHeight / 2;
        for (let line = 0; line < lines; line += 1) {
            const y = centerY + (line - (lines - 1) / 2) * (state.instrument === "piano" ? 8 : 15);
            context.beginPath();
            for (let x = 0; x <= cssWidth; x += 8) {
                const envelope = Math.sin(Math.PI * x / cssWidth);
                const wave = Math.sin(x * (.045 + line * .004) + performance.now() * .018 + line) * state.visualEnergy * envelope * (5 + line * .35);
                if (x === 0) context.moveTo(x, y + wave); else context.lineTo(x, y + wave);
            }
            context.strokeStyle = line % 2 ? "rgba(229,255,117,.36)" : "rgba(142,240,198,.42)";
            context.lineWidth = line === 0 ? 1.5 : 1;
            context.stroke();
        }
        context.restore();
        state.visualEnergy *= .962;
        const meterBars = document.querySelectorAll(".signal-meter i");
        meterBars.forEach(function (bar, index) {
            const live = state.visualEnergy * 9 > index;
            bar.classList.toggle("live", live);
            bar.style.height = live ? (8 + index * 2) + "px" : "6px";
        });
        const envelope = document.querySelector(".dynamic-envelope i");
        if (envelope) envelope.style.width = (8 + state.visualEnergy * 64) + "%";
        window.requestAnimationFrame(animateVisual);
    }

    function init() {
        cacheElements();
        loadKeyboardSize();
        applyKeyboardSize(false);
        renderChordPads();
        renderDrumPads();
        bindEvents();
        selectFamily("korean");
        if (isTouchKeyboardDevice() && !state.screenCalibrated) window.requestAnimationFrame(openKeySizeDialog);
        animateVisual();
    }

    document.addEventListener("DOMContentLoaded", init);
})();
