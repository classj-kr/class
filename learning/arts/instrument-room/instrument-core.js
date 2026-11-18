(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.InstrumentRoomCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
    const RANGES = {
        piano: { start: 48, end: 84 },
        bass: { start: 28, end: 60 },
        guitar: { start: 40, end: 76 }
    };
    const GUITAR_CHORDS = {
        C: [48, 52, 55, 60, 64],
        D: [50, 57, 62, 66],
        Dm: [50, 57, 62, 65],
        E: [40, 47, 52, 56, 59, 64],
        Em: [40, 47, 52, 55, 59, 64],
        F: [41, 48, 53, 57, 60, 65],
        G: [43, 47, 50, 55, 59, 67],
        A: [45, 52, 57, 61, 64],
        Am: [45, 52, 57, 60, 64],
        Bdim: [47, 53, 59, 62]
    };
    const GUITAR_KEYS = {
        major: ["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"],
        minor: ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"]
    };
    const GUITAR_SCALES = {
        major: [[0, "", "I"], [2, "m", "ii"], [4, "m", "iii"], [5, "", "IV"], [7, "", "V"], [9, "m", "vi"], [11, "dim", "vii°"]],
        minor: [[0, "m", "i"], [2, "dim", "ii°"], [3, "", "III"], [5, "m", "iv"], [7, "m", "v"], [8, "", "VI"], [10, "", "VII"]]
    };
    const LETTERS = "CDEFGAB";
    const NATURAL_PITCHES = [0, 2, 4, 5, 7, 9, 11];
    const GUITAR_STRINGS = [40, 45, 50, 55, 59, 64];

    function midiToFrequency(midi) {
        return 440 * Math.pow(2, (Number(midi) - 69) / 12);
    }

    function noteLabel(midi) {
        const value = Number(midi);
        return NOTE_NAMES[((value % 12) + 12) % 12] + (Math.floor(value / 12) - 1);
    }

    function isBlackKey(midi) {
        return [1, 3, 6, 8, 10].includes(((Number(midi) % 12) + 12) % 12);
    }

    function keyboardLayout(start, end) {
        const notes = [];
        let whiteIndex = 0;
        for (let midi = start; midi <= end; midi += 1) {
            const black = isBlackKey(midi);
            notes.push({ midi, black, whiteIndex: black ? whiteIndex - 1 : whiteIndex, label: noteLabel(midi) });
            if (!black) whiteIndex += 1;
        }
        return { notes, whiteCount: whiteIndex };
    }

    function getInstrumentRange(instrument) {
        const range = RANGES[instrument] || RANGES.piano;
        return { start: range.start, end: range.end };
    }

    function getGuitarChord(name) {
        return (GUITAR_CHORDS[name] || GUITAR_CHORDS.C).slice();
    }

    function getGuitarKeyChords(tonic, mode, powerChordFloor) {
        const scale = GUITAR_SCALES[mode];
        const root = GUITAR_KEYS[mode].indexOf(tonic);
        const firstLetter = LETTERS.indexOf(tonic[0]);
        return scale.map(function ([offset, quality, degree], index) {
            const pitch = (root + offset) % 12;
            const letter = (firstLetter + index) % 7;
            const accidental = (pitch - NATURAL_PITCHES[letter] + 18) % 12 - 6;
            const noteName = LETTERS[letter] + (accidental === 1 ? "♯" : accidental === -1 ? "♭" : "");
            if (Number.isInteger(powerChordFloor)) {
                const lowestRoot = powerChordFloor + (pitch - powerChordFloor % 12 + 12) % 12;
                return { name: noteName + "5", degree, notes: [lowestRoot, lowestRoot + 7, lowestRoot + 12] };
            }
            const name = noteName + quality;
            const open = GUITAR_CHORDS[name];
            if (open) return { name, degree, notes: open.slice() };
            const eFret = (pitch - 4 + 12) % 12;
            const aFret = (pitch - 9 + 12) % 12;
            const useA = quality === "dim" || aFret < eFret;
            const fret = useA ? aFret : eFret;
            const shape = quality === "dim" ? [0, 1, 2, 1]
                : useA ? [0, 2, 2, quality === "m" ? 1 : 2, 0]
                : [0, 2, 2, quality === "m" ? 0 : 1, 0, 0];
            return { name, degree, notes: shape.map(function (relativeFret, string) {
                return GUITAR_STRINGS[string + Number(useA)] + fret + relativeFret;
            }) };
        }).filter(function (chord) {
            return !Number.isInteger(powerChordFloor) || !chord.degree.endsWith("°");
        });
    }

    function getStrumOrder(notes, direction) {
        const ordered = notes.slice().sort(function (a, b) { return a - b; });
        return direction === "up" ? ordered.reverse() : ordered;
    }

    function pointerVelocity(relativeY) {
        const y = Math.max(0, Math.min(1, Number(relativeY) || 0));
        return Math.max(.38, Math.min(1, .38 + y * .62));
    }

    return {
        NOTE_NAMES,
        GUITAR_CHORDS,
        midiToFrequency,
        noteLabel,
        isBlackKey,
        keyboardLayout,
        getInstrumentRange,
        getGuitarChord,
        GUITAR_KEYS,
        getGuitarKeyChords,
        getStrumOrder,
        pointerVelocity
    };
});
