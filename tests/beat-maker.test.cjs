"use strict";
const test = require("node:test"), assert = require("node:assert/strict");
const B = require("../learning/arts/beat-maker/core.js");

test("initial song is valid and limited to five tracks", () => {
  const s = B.validate(JSON.parse(JSON.stringify(B.initial)));
  assert.equal(s.tracks.length, 4);
  const six = JSON.parse(JSON.stringify(B.initial));
  while (six.tracks.length < 6) six.tracks.push(B.track("x" + six.tracks.length, "keyboard/concert-grand"));
  assert.throws(() => B.validate(six), /곡/);
});

test("catalog keeps the instrument room categories in order", () => {
  assert.deepEqual(B.CATEGORIES.map((c) => c.name), ["국악기", "현악기", "목관악기", "금관악기", "타악기", "드럼", "베이스", "기타", "건반"]);
});

test("saved Rock techniques use the shared track name without losing notes", () => {
  for (const art of ["clean", "blues", "funk", "rock"]) {
    const notes = [{ step: 0, pitch: 55, len: 1 }, { step: 2, pitch: 88, len: 3 }];
    const tracks = [{ ...B.track("g1", "guitar/s-style", art, notes), volume: .45 }];
    const [track] = B.validate({ ...B.initial, tracks }).tracks;
    assert.equal(B.model(track).name, "Rock");
    assert.equal(track.art, "");
    assert.equal(track.volume, .45);
    assert.deepEqual(track.notes, notes);
    assert.equal(B.anchor(B.sound(track), 88), 86);
  }
});

test("a new note replaces overlapping notes on the same row only", () => {
  const notes = [{ step: 0, pitch: 60, len: 4 }, { step: 0, pitch: 62, len: 4 }];
  const out = B.placeNote(notes, { step: 2, pitch: 60, len: 2 });
  assert.deepEqual(out.map((n) => n.pitch).sort(), [60, 62]);
  assert.equal(out.find((n) => n.pitch === 60).step, 2);
});

test("sustain pedal rings each note to the next bar", () => {
  const t = { ...B.track("p", "keyboard/concert-grand"), pedal: true };
  assert.equal(B.soundingSteps(t, { step: 3, pitch: 60, len: 2 }), 13);
  assert.equal(B.soundingSteps(t, { step: 3, pitch: 60, len: 20 }), 20);
  assert.equal(B.soundingSteps({ ...t, pedal: false }, { step: 3, pitch: 60, len: 2 }), 2);
  assert.equal(B.hasPedal(B.track("b", "bass/p-bass")), false);
});

test("changing instrument moves notes into range and clears notes between pitched and drum tracks", () => {
  const t = B.track("a", "keyboard/concert-grand", "", [{ step: 0, pitch: 84, len: 2 }]);
  B.changeInstrument(t, "bass/p-bass");
  assert.equal(t.notes[0].pitch, 60);
  assert.equal(t.art, "finger");
  B.changeInstrument(t, "drums/pop-kit");
  assert.deepEqual(t.notes, []);
});

test("pitched tracks use the instrument room playable range and the nearest recorded note", () => {
  const timpani = B.sound(B.track("a", "percussion/timpani"));
  assert.deepEqual([timpani.lo, timpani.hi], [36, 53]);
  const bassoon = B.sound(B.track("b", "woodwind/bassoon"));
  assert.deepEqual([bassoon.lo, bassoon.hi], [44, 91]);
  assert.equal(B.anchor(bassoon, 91), 75);
  const pizz = B.sound(B.track("c", "strings/cello", "pizzicato"));
  assert.equal(pizz.hi, 108);
  assert.equal(B.anchor(pizz, 90), 73);
});

test("movable-do solfege follows the key; minor keys are la-based", () => {
  assert.equal(B.solfege(60, 0, "major"), "도");
  assert.equal(B.solfege(67, 7, "major"), "도"); // 사장조 G
  assert.equal(B.solfege(66, 7, "major"), "시"); // F♯
  assert.equal(B.solfege(65, 7, "major"), "");   // 사장조에 없는 F
  assert.equal(B.solfege(57, 9, "minor"), "라"); // 가단조 A
  assert.equal(B.solfege(64, 4, "minor"), "라"); // 마단조 E
  assert.equal(B.solfege(67, 4, "minor"), "도");
});

test("shrinking the song trims notes past the end", () => {
  const s = JSON.parse(JSON.stringify(B.initial));
  s.tracks[0].notes = [{ step: 10, pitch: 60, len: 20 }, { step: 40, pitch: 60, len: 2 }];
  s.bars = 1;
  const v = B.validate(s);
  assert.deepEqual(v.tracks[0].notes, [{ step: 10, pitch: 60, len: 6 }]);
});
