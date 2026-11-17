(function () {
  "use strict";
  const B = window.BeatCore;
  const buffers = new Map(), loads = new Map();
  let ctx = null, mix = null;

  // 악기실과 같은 출력: 샘플은 원래 소리 그대로 피크 보호(리미터)만 거치고, 짧은 방 울림을 조금 섞는다.
  function mixer(audio) {
    const limiter = audio.createDynamicsCompressor();
    limiter.threshold.value = -3; limiter.knee.value = 1; limiter.ratio.value = 20;
    limiter.attack.value = 0.002; limiter.release.value = 0.1;
    limiter.connect(audio.destination);
    const reverb = audio.createConvolver(), wet = audio.createGain();
    const length = Math.floor(audio.sampleRate * 1.7), impulse = audio.createBuffer(2, length, audio.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = impulse.getChannelData(c);
      for (let i = 0; i < length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.8);
    }
    reverb.buffer = impulse;
    wet.gain.value = 0.1;
    reverb.connect(wet).connect(limiter);
    return { input: limiter, reverb, chokes: new Map() };
  }
  function context() {
    if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); mix = mixer(ctx); }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // ---------- 음량 맞춤(악기실 app.js와 같은 계산) ----------
  const peaks = new WeakMap(), actives = new WeakMap(), bodies = new WeakMap(), starts = new WeakMap();
  function peak(buffer) {
    if (peaks.has(buffer)) return peaks.get(buffer);
    let p = 0.0001;
    for (let c = 0; c < buffer.numberOfChannels; c++) { const d = buffer.getChannelData(c); for (let i = 0; i < d.length; i++) p = Math.max(p, Math.abs(d[i])); }
    peaks.set(buffer, p);
    return p;
  }
  const volumeOnly = (buffer, gain) => Math.max(0.0001, Math.min(gain, 0.92 / peak(buffer)));
  function activeRms(buffer) {
    if (actives.has(buffer)) return actives.get(buffer);
    const gate = Math.max(0.0008, peak(buffer) * 0.002), n = Math.min(buffer.length, Math.ceil(buffer.sampleRate * 4.5));
    let sum = 0, count = 0;
    for (let c = 0; c < buffer.numberOfChannels; c++) { const d = buffer.getChannelData(c); for (let i = 0; i < n; i++) { const s = d[i]; if (Math.abs(s) >= gate) { sum += s * s; count++; } } }
    const rms = count ? Math.sqrt(sum / count) : peak(buffer);
    actives.set(buffer, rms);
    return rms;
  }
  // 조용하게 녹음된 음은 올리고, 큰 음은 녹음 균형을 그대로 둔다.
  function upwardGain(buffer, requested, performance) {
    const scale = Math.max(0.08, Math.min(1.4, performance / 1.22));
    return volumeOnly(buffer, Math.max(requested, (0.085 * scale) / activeRms(buffer)));
  }
  // 타악기는 가장 큰 0.1초 구간의 크기로 맞춘다(긴 꼬리·무음은 빼고).
  function bodyRms(buffer) {
    if (bodies.has(buffer)) return bodies.get(buffer);
    const w = Math.max(1, Math.round(buffer.sampleRate * 0.1));
    let best = 0;
    for (let s = 0; s < buffer.length; s += w) {
      const e = Math.min(buffer.length, s + w);
      let energy = 0;
      for (let c = 0; c < buffer.numberOfChannels; c++) { const d = buffer.getChannelData(c); for (let i = s; i < e; i++) energy += d[i] * d[i]; }
      best = Math.max(best, Math.sqrt(energy / ((e - s) * buffer.numberOfChannels)));
    }
    bodies.set(buffer, best);
    return best;
  }
  function drumGain(buffer, requested, velocity, id, kit) {
    const body = bodyRms(buffer);
    if (body < 0.000001) return volumeOnly(buffer, requested);
    const bounds = kit && B.DRUM_LEVELS[id];
    if (bounds) return 0.9 * volumeOnly(buffer, Math.min(bounds[1] * velocity / body, Math.max(requested, bounds[0] * velocity / body)));
    const target = /ghost|soft/.test(id) ? 0.024 : /damp|mute/.test(id) ? 0.035 : /accent/.test(id) ? 0.1 : 0.08;
    return volumeOnly(buffer, Math.max(requested, target * velocity / body));
  }
  const koreanTargetDb = (id) => (/ghost|soft/.test(id) ? -18 : /damp|mute/.test(id) ? -15 : /accent/.test(id) ? -7 : -10);
  // 녹음 앞의 빈 부분은 첫 소리 12ms 앞까지 건너뛴다.
  function startOffset(buffer) {
    if (starts.has(buffer)) return starts.get(buffer);
    const threshold = Math.max(0.00004, peak(buffer) * 0.00008);
    const chans = [...Array(buffer.numberOfChannels)].map((_, c) => buffer.getChannelData(c));
    let onset = 0;
    scan: for (let i = 0; i < buffer.length; i++) for (const d of chans) if (Math.abs(d[i]) >= threshold) { onset = i; break scan; }
    const at = Math.max(0, onset / buffer.sampleRate - 0.012);
    starts.set(buffer, at);
    return at;
  }

  // ---------- 소리 받기 ----------
  const fileNote = (snd, pitch) => (snd.pads ? snd.rows[pitch]?.id : B.anchor(snd, pitch));
  const keyOf = (snd, note) => snd.key + ":" + note;
  function load(snd, pitch) {
    const note = fileNote(snd, pitch);
    if (note === undefined) return Promise.reject(Error("no sound"));
    const k = keyOf(snd, note);
    if (buffers.has(k)) return Promise.resolve(buffers.get(k));
    if (loads.has(k)) return loads.get(k);
    const task = fetch(B.sampleUrl(snd, note))
      .then((r) => { if (!r.ok) throw Error(r.status); return r.arrayBuffer(); })
      .then((data) => context().decodeAudioData(data))
      .then((buffer) => { buffers.set(k, buffer); loads.delete(k); return buffer; })
      .catch((error) => { loads.delete(k); throw error; });
    loads.set(k, task);
    return task;
  }
  function preload(song) {
    const jobs = [];
    for (const t of song.tracks) {
      const snd = B.sound(t);
      for (const pitch of new Set(t.notes.map((n) => n.pitch))) jobs.push(load(snd, pitch).catch(() => null));
    }
    return Promise.all(jobs);
  }

  // ---------- 한 음 내기 ----------
  // out: 트랙 출력, m: 그 오디오의 믹서, at: 시작 시각, seconds: 울릴 길이
  function voice(audio, m, out, snd, pitch, at, seconds, gain = 1) {
    const buffer = buffers.get(keyOf(snd, fileNote(snd, pitch)));
    if (!buffer) return;
    const src = audio.createBufferSource(), env = audio.createGain();
    src.buffer = buffer;
    src.connect(env).connect(out);
    if (snd.pads) {
      const id = snd.rows[pitch].id, velocity = 0.9;
      const requested = snd.korean
        ? velocity * Math.pow(10, koreanTargetDb(id) / 20) / peak(buffer)
        : velocity * Math.pow(10, ((snd.gainDb || 0) + (snd.boost[id] || 0)) / 20);
      env.gain.setValueAtTime(drumGain(buffer, requested, velocity, id, snd.kit) * gain, at);
      // 하이햇을 다시 치거나 페달을 밟으면 울리던 열린 하이햇은 멈춘다.
      if (snd.kit && (id === "hat" || id === "pedalhat" || id === "openhat")) {
        const prev = m.chokes.get(out);
        if (prev && prev.at < at) prev.env.gain.setTargetAtTime(0.0001, at, 0.008);
        if (id === "openhat") m.chokes.set(out, { env, at });
      }
      src.start(at, snd.kit ? 0 : startOffset(buffer));
      return;
    }
    const a = B.anchor(snd, pitch), velocity = 0.8;
    const high = 1 + Math.max(0, pitch - 60) / 64;
    const perf = Math.max(0.08, Math.min(1.7, Math.pow(velocity, 0.9) * 1.22 * high));
    const level = upwardGain(buffer, perf * Math.pow(10, (snd.gainDb || 0) / 20), perf) * gain;
    src.playbackRate.value = Math.pow(2, (pitch - a) / 12);
    if (snd.held && buffer.duration > 1.25) {
      src.loop = true;
      src.loopStart = Math.min(snd.loopStart, buffer.duration * 0.72);
      src.loopEnd = Math.max(src.loopStart + 0.25, Math.min(snd.loopEnd || buffer.duration - 0.08, buffer.duration - 0.08));
    }
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(level, at + 0.0025);
    // 전기 베이스는 한 번에 한 음: 새 음이 나오면 울리던 앞 음을 멈춘다(악기실과 같음).
    const bass = /bass-(finger|pick|slap)$/.test(snd.set);
    if (bass) {
      const prev = m.chokes.get(out);
      if (prev && prev.at < at) prev.env.gain.setTargetAtTime(0.0001, at, 0.008);
      m.chokes.set(out, { env, at });
    }
    const send = audio.createGain();
    send.gain.value = 0.035;
    env.connect(send).connect(m.reverb);
    src.start(at, snd.startAtZero ? 0 : Math.min(startOffset(buffer), Math.max(0, buffer.duration - 0.01)));
    if (snd.decay) {
      env.gain.exponentialRampToValueAtTime(Math.max(0.0001, level * 0.68), at + 0.045);
      env.gain.exponentialRampToValueAtTime(0.0001, at + snd.decay);
      src.stop(at + snd.decay + 0.08);
    } else if (!snd.oneShot) {
      // 피아노처럼 저절로 잦아드는 소리는 손을 뗀 뒤에도 0.6초쯤 울려야 음이 들린다(짧게 끊으면 "똑" 소리만 남는다).
      const stop = at + Math.max(bass ? 0.25 : 0.05, seconds), release = snd.held ? 0.12 : bass ? 0.18 : 0.6;
      env.gain.setValueAtTime(level, stop);
      env.gain.setTargetAtTime(0.0001, stop, release / 3);
      src.stop(stop + release * 2);
    }
  }

  // 미리 듣기: 칸을 눌렀을 때 한 음.
  function preview(t, pitch, volume = 0.8) {
    const audio = context(), snd = B.sound(t);
    load(snd, pitch).then(() => {
      const g = audio.createGain();
      g.gain.value = volume;
      g.connect(mix.input);
      voice(audio, mix, g, snd, pitch, audio.currentTime + 0.01, snd.pads ? 0.45 : 0.9);
    }).catch(() => window.dispatchEvent(new Event("beatsoundfail")));
  }

  // ---------- 재생 ----------
  // 0.15초 앞까지 미리 예약하는 방식이라 화면이 바빠도 박자가 밀리지 않는다.
  // range: 반복할 칸 [처음, 끝). 비어 있으면 곡 전체. click: 메트로놈.
  const player = { playing: false, startAt: 0, nextStep: 0, timer: 0, song: null, gains: new Map(), range: null, click: false };
  function span(song) {
    const total = B.totalSteps(song), r = player.range;
    return r && r[0] < r[1] && r[1] <= total ? r : [0, total];
  }
  const stepSeconds = (song) => 60 / song.bpm / 4;
  function trackGain(t) {
    let g = player.gains.get(t.id);
    if (!g) { g = ctx.createGain(); g.connect(mix.input); player.gains.set(t.id, g); }
    return g;
  }
  function sync(song) {
    // 재생 중 빠르기를 바꾸면 지금 칸에서 그대로 이어지게 시작 시각을 다시 잡는다.
    if (player.playing && player.song && player.song.bpm !== song.bpm) {
      const pos = (ctx.currentTime - player.startAt) / stepSeconds(player.song);
      player.startAt = ctx.currentTime - pos * stepSeconds(song);
    }
    player.song = song;
    if (!ctx || !player.playing) return;
    const live = new Set(B.audible(song.tracks).map((t) => t.id));
    for (const t of song.tracks) trackGain(t).gain.setTargetAtTime(live.has(t.id) ? t.volume : 0, ctx.currentTime, 0.02);
  }
  // 메트로놈: 박마다 짧은 소리, 마디 첫 박은 높게.
  function tickSound(at, accent) {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.frequency.value = accent ? 1760 : 1175;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(accent ? 0.35 : 0.22, at + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    osc.connect(g).connect(mix.input);
    osc.start(at);
    osc.stop(at + 0.06);
  }
  function schedule() {
    const song = player.song, dt = stepSeconds(song), [a, b] = span(song);
    while (player.startAt + player.nextStep * dt < ctx.currentTime + 0.15) {
      const step = a + (player.nextStep % (b - a)), base = player.startAt + player.nextStep * dt;
      if (player.click && step % B.beatSteps(song) === 0) tickSound(base, step % B.stepsPerBar(song) === 0);
      const at = base + B.swingDelay(song, step, dt);
      for (const t of song.tracks) {
        const snd = B.sound(t);
        for (const n of t.notes) if (n.step === step) voice(ctx, mix, trackGain(t), snd, n.pitch, at, B.soundingSteps(t, n, B.stepsPerBar(song)) * dt, B.velGain(n));
      }
      player.nextStep++;
    }
  }
  async function play(song, fromStep = 0) {
    stop();
    context();
    player.song = song;
    await preload(song);
    player.playing = true;
    sync(song);
    // 반복 구간 밖에서 시작하라고 하면 구간 처음부터 튼다.
    const [a, b] = span(song), from = fromStep >= a && fromStep < b ? fromStep - a : 0;
    player.nextStep = from;
    player.startAt = ctx.currentTime + 0.08 - from * stepSeconds(song);
    schedule();
    player.timer = setInterval(schedule, 25);
  }
  function stop() {
    player.playing = false;
    clearInterval(player.timer);
    for (const g of player.gains.values()) g.disconnect();
    player.gains.clear();
    if (mix) mix.chokes.clear();
  }
  function position() {
    if (!player.playing) return null;
    const song = player.song, [a, b] = span(song);
    const at = (ctx.currentTime - player.startAt) / stepSeconds(song);
    return at < 0 ? null : a + (at % (b - a));
  }
  function setRange(range) { player.range = range; }
  function setClick(on) { player.click = on; }

  // ---------- 파일로 내보내기 ----------
  // MP3용으로 한 바퀴를 모노 22kHz로 그린다(작은 파일이면 충분).
  async function render(song, rate = 22050, channels = 1) {
    context();
    await preload(song);
    const dt = stepSeconds(song), length = B.totalSteps(song) * dt + 2.5;
    const off = new OfflineAudioContext(channels, Math.ceil(length * rate), rate);
    const m = mixer(off);
    for (const t of B.audible(song.tracks)) {
      const g = off.createGain();
      g.gain.value = t.volume;
      g.connect(m.input);
      const snd = B.sound(t);
      for (const n of [...t.notes].sort((x, y) => x.step - y.step)) voice(off, m, g, snd, n.pitch, n.step * dt + B.swingDelay(song, n.step, dt) + 0.05, B.soundingSteps(t, n, B.stepsPerBar(song)) * dt, B.velGain(n));
    }
    return off.startRendering();
  }
  // lamejs(vendor/lame.min.js, LGPL-3.0)로 64kbps MP3를 만든다. 인코더는 저장할 때만 불러온다.
  let lame = null;
  function loadLame() {
    if (window.lamejs) return Promise.resolve(window.lamejs);
    lame ??= new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "vendor/lame.min.js?v=1.2.1";
      s.onload = () => (window.lamejs ? resolve(window.lamejs) : reject(Error("lamejs")));
      s.onerror = () => { lame = null; reject(Error("lamejs")); };
      document.head.appendChild(s);
    });
    return lame;
  }
  async function mp3(song) {
    const [L, buffer] = await Promise.all([loadLame(), render(song)]);
    const data = buffer.getChannelData(0), pcm = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) pcm[i] = Math.max(-1, Math.min(1, data[i])) * 32767;
    const enc = new L.Mp3Encoder(1, buffer.sampleRate, 64), parts = [];
    for (let i = 0; i < pcm.length; i += 1152) { const chunk = enc.encodeBuffer(pcm.subarray(i, i + 1152)); if (chunk.length) parts.push(chunk); }
    const end = enc.flush();
    if (end.length) parts.push(end);
    return new Blob(parts, { type: "audio/mpeg" });
  }

  window.BeatEngine = { preview, play, stop, sync, position, setRange, setClick, render, mp3, preload, get playing() { return player.playing; } };
})();
