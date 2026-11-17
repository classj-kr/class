(function (root, factory) {
  const api = factory(typeof module === "object" && module.exports ? require("./catalog.js") : root.BeatCatalog, root);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.BeatCore = api;
})(globalThis, function (K, root) {
  "use strict";
  const AUDIO = "../instrument-room/assets/audio/";
  const SCALES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10] };
  const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
  const KEY_NAMES = ["다", "올림다", "라", "올림라", "마", "바", "올림바", "사", "올림사", "가", "올림가", "나"];
  const STEPS_PER_BAR = 16;
  const MAX_TRACKS = 5;
  const COLORS = ["#f2b84b", "#ef8354", "#3fbf8f", "#3fb6c8", "#a68cf2"];
  const PAD_COLORS = ["#f2c94c", "#ff9d66", "#6fb4ff", "#4fc39a", "#c9a0ff", "#e8e06a"];

  const noteName = (midi) => NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
  const inKey = (midi, key, scale) => SCALES[scale].includes((((midi - key) % 12) + 12) % 12);
  const totalSteps = (s) => s.bars * STEPS_PER_BAR;
  // 계이름: 장조는 으뜸음이 도, 단조는 으뜸음이 라(학교 방식). 조에 없는 음은 빈 글자.
  const SOLFEGE = { 0: "도", 2: "레", 4: "미", 5: "파", 7: "솔", 9: "라", 11: "시" };
  function solfege(midi, key, scale) {
    const doPc = scale === "minor" ? (key + 3) % 12 : key;
    return SOLFEGE[(((midi - doPc) % 12) + 12) % 12] || "";
  }

  // 트랙의 악기·주법으로 실제 소리 정보를 만든다.
  const cache = new Map();
  function sound(t) {
    const k = t.instrument + "|" + t.art;
    if (cache.has(k)) return cache.get(k);
    const model = K.MODELS[t.instrument];
    let out;
    if (model.pads) {
      const p = model.pads;
      const data = p.korean && root.KOREAN_PERCUSSION_DATA;
      const rows = p.korean
        // 줄 이름은 구음(덩·쿵·덕…)만 짧게, 자세한 주법은 title로 보여 준다.
        ? (data ? data.pads[p.korean].map((r) => ({ id: r.id, name: r.gueum || r.name, title: r.name, color: r.color })) : [])
        : p.rows.map((r, i) => ({ ...r, color: r.color || PAD_COLORS[i % PAD_COLORS.length] }));
      out = { pads: true, key: k, dir: p.dir, rows, kit: !!p.kit, korean: !!p.korean, boost: p.boost || {},
        gainDb: p.korean ? 0 : p.gainDb };
    } else {
      const art = model.arts.find((a) => a.id === t.art) || model.arts[0];
      const [dir, min, max, gainDb, opt = {}] = K.SETS[art.set];
      // lo~hi: 찍을 수 있는 음역(악기실과 같음), min~max: 실제로 녹음된 음.
      const [lo, hi] = K.RANGES[model.id] || [min, max];
      out = { pads: false, key: k, set: art.set, dir, min, max, lo, hi, gainDb, rev: opt.rev,
        held: K.HELD.has(art.set), loopStart: opt.loop ? 1.1 : 1.2, loopEnd: opt.loop ? 3.8 : 0,
        startAtZero: K.START_AT_ZERO.test(art.set), decay: K.DECAY[art.set] || 0,
        oneShot: K.ONE_SHOT.has(art.set), view: Math.round((lo + hi) / 2) };
    }
    cache.set(k, out);
    return out;
  }
  const model = (t) => K.MODELS[t.instrument];
  const hasPedal = (t) => !!model(t)?.cat.pedal;

  function sampleUrl(snd, note) {
    const query = "?v=" + encodeURIComponent(["20260905-original-timbre-v3", snd.kit ? "20260902-ad2-original-balance-v2" : snd.rev].filter(Boolean).join("-"));
    if (snd.pads) return AUDIO + snd.dir + "/" + note + ".ogg" + query;
    const index = String(note - 21 + 1).padStart(3, "0");
    const label = NOTE_NAMES[note % 12].toLowerCase().replace("♯", "s") + (Math.floor(note / 12) - 1);
    return AUDIO + snd.dir + "/" + index + "_" + label + ".ogg" + query;
  }

  function track(id, instrument, art = "", notes = []) {
    const m = K.MODELS[instrument];
    return { id, instrument, art: art || (m.arts ? m.arts[0].id : ""), volume: 0.8, mute: false, solo: false, pedal: false, notes };
  }
  function basicBeat() {
    const notes = [];
    for (let bar = 0; bar < 4; bar++) {
      const o = bar * 16;
      notes.push({ step: o, pitch: 7, len: 1 }, { step: o + 8, pitch: 7, len: 1 });
      notes.push({ step: o + 4, pitch: 6, len: 1 }, { step: o + 12, pitch: 6, len: 1 });
      for (let i = 0; i < 16; i += 2) notes.push({ step: o + i, pitch: 3, len: 1 });
    }
    return notes;
  }
  const initial = {
    version: 2,
    bpm: 90,
    bars: 4,
    key: 0,
    scale: "major",
    tracks: [
      track("t1", "keyboard/concert-grand"),
      track("t2", "keyboard/tine-ep"),
      track("t3", "bass/p-bass", "finger"),
      track("t4", "drums/pop-kit", "", basicBeat()),
    ],
  };

  function validate(s) {
    const ok =
      s && s.version === 2 &&
      Number.isInteger(s.bpm) && s.bpm >= 40 && s.bpm <= 200 &&
      [1, 2, 4, 8].includes(s.bars) &&
      Number.isInteger(s.key) && s.key >= 0 && s.key < 12 &&
      Object.hasOwn(SCALES, s.scale) &&
      Array.isArray(s.tracks) && s.tracks.length >= 1 && s.tracks.length <= MAX_TRACKS;
    if (!ok) throw Error("곡을 읽을 수 없어요.");
    const ids = new Set();
    for (const t of s.tracks) {
      const m = K.MODELS[t?.instrument];
      if (!m || typeof t.id !== "string" || !/^[a-z0-9-]{1,40}$/.test(t.id) || ids.has(t.id) ||
        typeof t.art !== "string" || (m.arts && !m.arts.some((a) => a.id === t.art)) ||
        !(t.volume >= 0 && t.volume <= 1) || typeof t.mute !== "boolean" || typeof t.solo !== "boolean" ||
        typeof t.pedal !== "boolean" || !Array.isArray(t.notes) || t.notes.length > 2000)
        throw Error("트랙을 읽을 수 없어요.");
      ids.add(t.id);
      const steps = totalSteps(s), snd = sound(t);
      // 마디 수를 줄이면 넘치는 음은 잘라 낸다.
      t.notes = t.notes.filter((n) => n.step < steps).map((n) => ({ ...n, len: Math.min(n.len, steps - n.step) }));
      for (const n of t.notes) {
        const pitchOk = Number.isInteger(n.pitch) && (snd.pads ? n.pitch >= 0 && n.pitch < Math.max(1, snd.rows.length) : n.pitch >= snd.lo && n.pitch <= snd.hi);
        if (!Number.isInteger(n.step) || n.step < 0 || !Number.isInteger(n.len) || n.len < 1 || !pitchOk)
          throw Error("음을 읽을 수 없어요.");
      }
    }
    return JSON.parse(JSON.stringify(s));
  }

  // 악기를 바꾸면 새 음역 밖의 음은 옥타브를 옮겨 넣고, 타악 줄과 음 높이 사이에서는 지운다.
  function changeInstrument(t, instrument, art) {
    const from = sound(t);
    const next = { ...t, instrument, art: art ?? (K.MODELS[instrument].arts ? K.MODELS[instrument].arts[0].id : "") };
    const to = sound(next);
    if (from.pads || to.pads) t.notes = from.pads && to.pads && from.rows.length === to.rows.length && from.kit === to.kit ? t.notes : [];
    else
      t.notes = t.notes.map((n) => {
        let p = n.pitch;
        while (p < to.lo) p += 12;
        while (p > to.hi) p -= 12;
        return { ...n, pitch: p };
      }).filter((n) => n.pitch >= to.lo && n.pitch <= to.hi);
    t.instrument = next.instrument;
    t.art = next.art;
    if (!hasPedal(t)) t.pedal = false;
    return t;
  }

  // 같은 줄에서 겹치는 음은 새 음이 이긴다.
  function placeNote(notes, note) {
    const end = note.step + note.len;
    return notes.filter((n) => n.pitch !== note.pitch || n.step + n.len <= note.step || n.step >= end).concat(note);
  }

  // 페달을 밟으면 음이 다음 마디 시작까지 울린다(마디마다 페달을 다시 밟는 셈).
  function soundingSteps(t, n) {
    if (!t.pedal) return n.len;
    const nextBar = (Math.floor(n.step / STEPS_PER_BAR) + 1) * STEPS_PER_BAR;
    return Math.max(n.len, nextBar - n.step);
  }

  function audible(tracks) {
    const solo = tracks.some((t) => t.solo);
    return tracks.filter((t) => !t.mute && (!solo || t.solo));
  }

  // 녹음된 음 가운데 가장 가까운 것(악기실 concertGrandAnchor와 같음).
  const anchor = (snd, midi) => Math.max(snd.min, Math.min(snd.max, midi));

  return { DRUM_LEVELS: K.DRUM_LEVELS, anchor, CATEGORIES: K.CATEGORIES, MODELS: K.MODELS, SCALES, NOTE_NAMES, KEY_NAMES, STEPS_PER_BAR, MAX_TRACKS, COLORS,
    noteName, inKey, solfege, totalSteps, sound, model, hasPedal, sampleUrl, track, initial, validate, changeInstrument, placeNote, soundingSteps, audible };
});
