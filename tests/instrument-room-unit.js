"use strict";

const assert = require("node:assert/strict");
const core = require("../learning/arts/instrument-room/instrument-core.js");

assert.ok(Math.abs(core.midiToFrequency(69) - 440) < .0001);
assert.equal(core.noteLabel(60), "C4");
assert.equal(core.isBlackKey(61), true);
assert.equal(core.isBlackKey(60), false);

const pianoLayout = core.keyboardLayout(48, 84);
assert.equal(pianoLayout.notes.length, 37);
assert.equal(pianoLayout.whiteCount, 22);
assert.equal(pianoLayout.notes.filter((note) => note.black).length, 15);

assert.deepEqual(core.getInstrumentRange("bass"), { start: 28, end: 60 });
assert.deepEqual(core.getGuitarChord("C"), [48, 52, 55, 60, 64]);
assert.deepEqual(core.getStrumOrder([48, 52, 55], "down"), [48, 52, 55]);
assert.deepEqual(core.getStrumOrder([48, 52, 55], "up"), [55, 52, 48]);
assert.equal(core.pointerVelocity(0), .38);
assert.equal(core.pointerVelocity(1), 1);

const mutableChord = core.getGuitarChord("Am");
mutableChord[0] = 1;
assert.equal(core.getGuitarChord("Am")[0], 45);

assert.deepEqual(core.getGuitarKeyChords("D", "major").map(chord => chord.name), ["D", "Em", "F♯m", "G", "A", "Bm", "C♯dim"]);
assert.deepEqual(core.getGuitarKeyChords("A", "minor").map(chord => chord.name), ["Am", "Bdim", "C", "Dm", "Em", "F", "G"]);
assert.deepEqual(core.getGuitarKeyChords("D", "major", 40).map(chord => chord.name), ["D5", "E5", "F♯5", "G5", "A5", "B5"]);
assert.deepEqual(core.getGuitarKeyChords("B", "minor", 35)[0].notes, [35, 42, 47]);
for (const [mode, keys] of Object.entries(core.GUITAR_KEYS)) {
    for (const key of keys) {
        for (const chord of core.getGuitarKeyChords(key, mode)) {
            const offsets = [...new Set(chord.notes.map(midi => (midi - chord.notes[0]) % 12))].sort((a, b) => a - b);
            const expected = chord.name.endsWith("dim") ? [0, 3, 6] : chord.name.endsWith("m") ? [0, 3, 7] : [0, 4, 7];
            assert.deepEqual(offsets, expected, key + " " + chord.name);
        }
        for (const floor of [35, 40]) {
            const chords = core.getGuitarKeyChords(key, mode, floor);
            assert.equal(chords.length, 6);
            for (const chord of chords) {
                const root = chord.notes[0];
                assert.ok(root >= floor && root < floor + 12);
                assert.deepEqual(chord.notes, [root, root + 7, root + 12]);
            }
        }
    }
}

console.log("instrument-room-unit: ok");
