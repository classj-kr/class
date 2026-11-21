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
  // 박자: 한 칸은 언제나 16분음표. steps는 한 마디 칸 수, beat는 굵은 박 선 간격(겹박자는 점4분음표 = 6칸).
  const METERS = {
    "4/4": { steps: 16, beat: 4 },
    "3/4": { steps: 12, beat: 4 },
    "6/8": { steps: 12, beat: 6 },
    "12/8": { steps: 24, beat: 6 },
  };
  const stepsPerBar = (s) => METERS[s.meter]?.steps || STEPS_PER_BAR;
  const beatSteps = (s) => METERS[s.meter]?.beat || 4;
  // 겹박자는 이미 셋잇단 느낌이라 스윙을 걸지 않는다.
  const swingable = (s) => beatSteps(s) === 4;
  const MAX_TRACKS = 5;
  const COLORS = ["#f2b84b", "#ef8354", "#3fbf8f", "#3fb6c8", "#a68cf2"];
  const PAD_COLORS = ["#f2c94c", "#ff9d66", "#6fb4ff", "#4fc39a", "#c9a0ff", "#e8e06a"];

  const noteName = (midi) => NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
  const inKey = (midi, key, scale) => SCALES[scale].includes((((midi - key) % 12) + 12) % 12);
  const totalSteps = (s) => s.bars * stepsPerBar(s);
  // 계이름: 장조는 으뜸음이 도, 단조는 으뜸음이 라(학교 방식). 조에 없는 음은 빈 글자.
  const SOLFEGE = { 0: "도", 2: "레", 4: "미", 5: "파", 7: "솔", 9: "라", 11: "시" };
  function solfege(midi, key, scale) {
    const doPc = scale === "minor" ? (key + 3) % 12 : key;
    return SOLFEGE[(((midi - doPc) % 12) + 12) % 12] || "";
  }
  // 계이름 색: 도부터 빨·주·노·초·파·남·보. 조에 없는 음은 회색.
  const SOLFEGE_COLORS = { 도: "#e53935", 레: "#fb8c00", 미: "#fdd835", 파: "#43a047", 솔: "#1e88e5", 라: "#2346b0", 시: "#a020f0" };
  const OFF_KEY_COLOR = "#8a93a1";
  const solfegeColor = (midi, key, scale) => SOLFEGE_COLORS[solfege(midi, key, scale)] || OFF_KEY_COLOR;

  // 트랙의 악기·주법으로 실제 소리 정보를 만든다.
  const cache = new Map();
  function sound(t) {
    const k = t.instrument + "|" + t.art;
    if (!cache.has(k)) cache.set(k, buildSound(t, k));
    const snd = cache.get(k);
    // Versions 2 and 3 allowed MIDI 88 for every guitar. Keep those notes
    // editable in existing songs, using the closest recorded sample.
    if (snd.guitar && snd.hi < 88) {
      for (let pitch = 88; pitch > snd.hi; pitch--) {
        if (t.notes?.some((note) => note.pitch === pitch)) return { ...snd, hi: pitch };
      }
    }
    return snd;
  }
  function buildSound(t, k) {
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
      out = { pads: false, key: k, set: art.set, dir, min, max, lo, hi, gainDb, rev: opt.rev, guitar: opt.guitar,
        held: K.HELD.has(art.set), loopStart: opt.loop ? 1.1 : 1.2, loopEnd: opt.loop ? 3.8 : 0,
        startAtZero: K.START_AT_ZERO.test(art.set), decay: K.DECAY[art.set] || 0,
        oneShot: K.ONE_SHOT.has(art.set), view: Math.round((lo + hi) / 2) };
    }
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
  const kitRow = (id) => K.KIT_ROWS.findIndex((r) => r.id === id);
  // 박자마다 기본 드럼(킥·스네어 칸 위치). 하이햇은 8분음표마다.
  const BEAT_PATTERNS = {
    "4/4": { kick: [0, 8], snare: [4, 12] },
    "3/4": { kick: [0], snare: [4, 8] },
    "6/8": { kick: [0], snare: [6] },
    "12/8": { kick: [0, 12], snare: [6, 18] },
  };
  function basicBeat(meter = "4/4", bars = 4) {
    const notes = [], kick = kitRow("kick"), snare = kitRow("snare"), hat = kitRow("hat");
    const per = METERS[meter].steps, p = BEAT_PATTERNS[meter];
    for (let bar = 0; bar < bars; bar++) {
      const o = bar * per;
      for (const i of p.kick) notes.push({ step: o + i, pitch: kick, len: 1 });
      for (const i of p.snare) notes.push({ step: o + i, pitch: snare, len: 1 });
      for (let i = 0; i < per; i += 2) notes.push({ step: o + i, pitch: hat, len: 1 });
    }
    return notes;
  }
  const noteKey = (notes) => notes.map((n) => `${n.step}:${n.pitch}:${n.len}`).sort().join(",");
  // 박자를 바꾸면 음을 마디 안 위치 그대로 새 마디에 옮기고, 새 마디에 없는 칸의 음은 버린다.
  // 기본 드럼을 손대지 않고 그대로 둔 트랙은 새 박자의 기본 드럼으로 바꿔 넣는다.
  function changeMeter(s, meter) {
    const from = stepsPerBar(s), to = METERS[meter].steps;
    const plain = noteKey(basicBeat(s.meter || "4/4", s.bars));
    for (const t of s.tracks) {
      if (sound(t).kit && t.notes.length && noteKey(t.notes) === plain) { t.notes = basicBeat(meter, s.bars); continue; }
      t.notes = t.notes.flatMap((n) => {
        const bar = Math.floor(n.step / from), at = n.step % from;
        return at < to ? [{ ...n, step: bar * to + at, len: Math.min(n.len, to - at) }] : [];
      });
    }
    s.meter = meter;
    if (!swingable(s)) s.swing = 0;
    return s;
  }
  const initial = {
    version: 3,
    title: "",
    bpm: 90,
    swing: 0,
    meter: "4/4",
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

  // version 2 곡의 드럼 세트는 8줄이었다. 줄 번호를 15줄 순서로 옮긴다.
  function upgrade(s) {
    // 박자를 넣기 전에 저장한 곡은 4/4로 연다.
    if (s && typeof s === "object" && s.meter === undefined) s = { ...s, meter: "4/4" };
    if (s?.version !== 2 || !Array.isArray(s.tracks)) return s;
    const tracks = s.tracks.map((t) => {
      if (!K.MODELS[t?.instrument]?.pads?.kit || !Array.isArray(t.notes)) return t;
      return { ...t, notes: t.notes.map((n) => ({ ...n, pitch: kitRow(K.OLD_KIT_ROW_IDS[n?.pitch]) })) };
    });
    return { ...s, version: 3, swing: 0, tracks };
  }
  // 스윙: 8분박마다 뒤쪽 16분 칸만 늦춘다. 100%면 셋잇단(칸 길이의 1/3만큼 늦게).
  const swingDelay = (song, step, stepSeconds) => (step % 2 && swingable(song) ? (song.swing / 100) * stepSeconds / 3 : 0);

  function validate(s) {
    s = upgrade(s);
    const ok =
      s && s.version === 3 &&
      Number.isInteger(s.bpm) && s.bpm >= 40 && s.bpm <= 200 &&
      Number.isInteger(s.swing) && s.swing >= 0 && s.swing <= 100 &&
      Object.hasOwn(METERS, s.meter) &&
      [1, 2, 4, 8, 16, 32].includes(s.bars) &&
      Number.isInteger(s.key) && s.key >= 0 && s.key < 12 &&
      Object.hasOwn(SCALES, s.scale) &&
      Array.isArray(s.tracks) && s.tracks.length >= 1 && s.tracks.length <= MAX_TRACKS;
    if (!ok) throw Error("곡을 읽을 수 없어요.");
    s.title = typeof s.title === "string" ? s.title.slice(0, 20) : "";
    const ids = new Set();
    for (const t of s.tracks) {
      const m = K.MODELS[t?.instrument];
      if (t?.instrument === "guitar/s-style" && ["clean", "blues", "funk", "rock"].includes(t.art)) t.art = "";
      if (!m || typeof t.id !== "string" || !/^[a-z0-9-]{1,40}$/.test(t.id) || ids.has(t.id) ||
        typeof t.art !== "string" || (m.arts && !m.arts.some((a) => a.id === t.art)) ||
        !(t.volume >= 0 && t.volume <= 1) || typeof t.mute !== "boolean" || typeof t.solo !== "boolean" ||
        typeof t.pedal !== "boolean" || !Array.isArray(t.notes) || t.notes.length > 4000)
        throw Error("트랙을 읽을 수 없어요.");
      ids.add(t.id);
      const steps = totalSteps(s), snd = sound(t);
      // 마디 수를 줄이면 넘치는 음은 잘라 낸다.
      t.notes = t.notes.filter((n) => n.step < steps).map((n) => ({ ...n, len: Math.min(n.len, steps - n.step) }));
      for (const n of t.notes) {
        const pitchOk = Number.isInteger(n.pitch) && (snd.pads ? n.pitch >= 0 && n.pitch < Math.max(1, snd.rows.length) : n.pitch >= snd.lo && n.pitch <= snd.hi);
        if (!Number.isInteger(n.step) || n.step < 0 || !Number.isInteger(n.len) || n.len < 1 || !pitchOk ||
          (n.vel !== undefined && ![1, 2, 3].includes(n.vel)))
          throw Error("음을 읽을 수 없어요.");
        if (n.vel === 2) delete n.vel; // 조금 세게(보통)는 적지 않는다.
      }
    }
    return JSON.parse(JSON.stringify(s));
  }

  // 악기를 바꾸면 새 음역 밖의 음은 옥타브를 옮겨 넣고, 타악 줄과 음 높이 사이에서는 지운다.
  function changeInstrument(t, instrument, art) {
    const from = sound(t);
    const next = { ...t, instrument, art: art ?? (K.MODELS[instrument].arts ? K.MODELS[instrument].arts[0].id : "") };
    const to = sound({ ...next, notes: [] });
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

  // 음 세기 세 단계: 1 여리게(p), 2 조금 세게(mf, 적지 않음), 3 세게(f). 소리 크기에 곱하는 값.
  const VEL_GAIN = { 1: 0.4, 2: 1, 3: 1.5 };
  const velOf = (n) => n.vel || 2;
  const velGain = (n) => VEL_GAIN[velOf(n)];

  // 같은 줄에서 겹치는 음은 새 음이 이긴다.
  function placeNote(notes, note) {
    const end = note.step + note.len;
    return notes.filter((n) => n.pitch !== note.pitch || n.step + n.len <= note.step || n.step >= end).concat(note);
  }

  // 페달을 밟으면 음이 다음 마디 시작까지 울린다(마디마다 페달을 다시 밟는 셈).
  function soundingSteps(t, n, perBar = STEPS_PER_BAR) {
    if (!t.pedal) return n.len;
    const nextBar = (Math.floor(n.step / perBar) + 1) * perBar;
    return Math.max(n.len, nextBar - n.step);
  }

  function audible(tracks) {
    const solo = tracks.some((t) => t.solo);
    return tracks.filter((t) => !t.mute && (!solo || t.solo));
  }

  // 녹음된 음 가운데 가장 가까운 것(악기실 concertGrandAnchor와 같음).
  const anchor = (snd, midi) => Math.max(snd.min, Math.min(snd.max, midi));

  return { DRUM_LEVELS: K.DRUM_LEVELS, anchor, CATEGORIES: K.CATEGORIES, MODELS: K.MODELS, SCALES, NOTE_NAMES, KEY_NAMES, STEPS_PER_BAR, METERS, MAX_TRACKS, COLORS,
    noteName, inKey, solfege, solfegeColor, totalSteps, stepsPerBar, beatSteps, swingable, changeMeter, swingDelay, sound, model, hasPedal, sampleUrl, track, initial, validate, changeInstrument, placeNote, soundingSteps, audible, velOf, velGain };
});
