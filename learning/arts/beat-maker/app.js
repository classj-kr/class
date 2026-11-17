(() => {
  "use strict";
  const B = BeatCore, E = BeatEngine, U = ToolUI, $ = U.$;
  const RH = 20, ROWS = 25; // 줄 높이, 가락 악기는 두 옥타브(25줄)씩 본다.
  // 칸 너비(확대 단계). 돋보기로 고른다.
  const ZOOMS = [10, 14, 19, 26, 34, 44];
  let zoom = 3, CW = ZOOMS[zoom];
  const RULER = 24; // 마디 번호 자 높이
  let rh = RH; // 타악 줄은 편집 칸 높이를 채우도록 늘린다(최대 40px).
  // 가락 악기: 조의 일곱 음 줄은 넓게, 나머지 다섯 음 줄은 아주 좁게. rowTop/rowH 가 줄마다 위치·높이다.
  const NARROW = 8;
  let rowTop = [], rowH = [];
  const rowIndexAt = (y) => {
    for (let i = 0; i < rowH.length; i++) if (y < rowTop[i] + rowH[i]) return i;
    return rowH.length - 1;
  };
  // 세로 피아노 건반(그리드와 따로, 실제 건반 비율): 흰 건반은 한 옥타브를 일곱으로 똑같이 나누고,
  // 검은 건반은 흰 건반 높이의 0.6만큼 자기 음 줄 가운데에 얹는다. 계이름은 색 딱지로 건반 오른쪽 끝에.
  function keyboardSVG(list, s) {
    const W = 64, BW = 38, H = rowTop[list.length - 1] + rowH[list.length - 1];
    const idx = new Map(list.map((r, i) => [r.pitch, i]));
    const bottomOf = (p) => (idx.has(p) ? rowTop[idx.get(p)] + rowH[idx.get(p)] : null);
    const centerOf = (p) => (idx.has(p) ? rowTop[idx.get(p)] + rowH[idx.get(p)] / 2 : null);
    const octave = 7 * RH + 5 * NARROW; // 어느 조든 한 옥타브에 넓은 줄 일곱·좁은 줄 다섯
    const whiteH = octave / 7, WHITE = [0, 2, 4, 5, 7, 9, 11];
    const hi = list[0].pitch, lo = list[list.length - 1].pitch;
    // 화면에 걸친 옥타브의 C 줄 바닥을 기준으로 흰 건반을 쌓는다(맨 아래 C가 화면 밖이면 위 C에서 거꾸로 잰다).
    const cBottom = (c) => {
      const b = bottomOf(c);
      if (b !== null) return b;
      const up = bottomOf(c + 12);
      return up !== null ? up + octave : bottomOf(c - 12) - octave;
    };
    const chip = (p, x, y) => {
      const sol = B.solfege(p, s.key, s.scale);
      if (!sol) return "";
      const dark = sol === "미" || sol === "레";
      return `<rect x="${x - 17}" y="${y - 7}" width="17" height="14" rx="3" fill="${B.solfegeColor(p, s.key, s.scale)}" pointer-events="none"/>` +
        `<text x="${x - 8.5}" y="${y + 4}" text-anchor="middle" class="sol${dark ? " dark" : ""}" pointer-events="none">${sol}</text>`;
    };
    let whites = "", blacks = "", marks = "";
    for (let c = Math.floor(lo / 12) * 12 - 12; c <= hi + 12; c += 12) {
      const base = cBottom(c);
      WHITE.forEach((pc, k) => {
        const p = c + pc, y1 = base - k * whiteH, y0 = y1 - whiteH;
        if (y1 < 0 || y0 > H) return;
        const out = !idx.has(p) || list[idx.get(p)].out;
        whites += `<rect x="0.5" y="${y0}" width="${W - 1}" height="${whiteH}" rx="2" class="wk${out ? " out" : ""}"${out ? "" : ` data-pitch="${p}"`}/>`;
        if (out) return;
        marks += chip(p, W - 4, (y0 + y1) / 2);
        if (pc === 0) marks += `<text x="4" y="${y1 - 4}" class="cname" pointer-events="none">${B.noteName(p)}</text>`;
      });
    }
    for (const r of list) {
      if (![1, 3, 6, 8, 10].includes(r.pitch % 12)) continue;
      const cy = centerOf(r.pitch), h = whiteH * 0.6;
      blacks += `<rect x="0" y="${cy - h / 2}" width="${BW}" height="${h}" rx="2" class="bk${r.out ? " out" : ""}"${r.out ? "" : ` data-pitch="${r.pitch}"`}/>`;
      if (!r.out) blacks += chip(r.pitch, BW - 3, cy);
    }
    return `<svg class="keyboard" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${whites}${marks}${blacks}</svg>`;
  }
  // 스윙만큼 뒤쪽 16분 칸이 늦게 시작하도록 그린다. 소리가 늦는 만큼 칸도 밀려서 재생선과 맞는다.
  let swingPx = 0;
  const colX = (step) => step * CW + (step % 2 ? swingPx : 0);
  const stepAtX = (x) => { const s = Math.floor(x / CW); return s % 2 && x < colX(s) ? s - 1 : s; };
  let selected = "t1";
  const viewTop = {}; // 트랙별로 보고 있는 맨 위 음
  let lastLen = 2;
  // 반복 구간(마디 [처음, 끝)). 곡에 저장하지 않는 보기 설정이다.
  let loop = null, loopOn = false, loopDraft = null;
  // 고른 음: 지금 트랙의 "칸:높이" 모음. 고르기 모드에서 끌면 네모 안의 음을 고른다.
  const picked = new Set();
  let pickedTrack = "", selectMode = false, band = null;
  const noteKey = (n) => n.step + ":" + n.pitch;

  const currentTrack = (s = app.state) => s.tracks.find((t) => t.id === selected) || s.tracks[0];
  const narrow = (snd) => snd.hi - snd.lo + 1 < ROWS;
  function top(t) {
    const snd = B.sound(t);
    // 음역이 두 옥타브보다 좁으면 가운데에 두고, 바깥 줄은 검게 보여 준다.
    if (narrow(snd)) return Math.min(127, Math.round((snd.lo + snd.hi) / 2) + 12);
    const key = t.id + "|" + snd.key;
    if (!viewTop[key]) viewTop[key] = Math.min(snd.hi, Math.max(snd.lo + ROWS - 1, snd.view + 12));
    return viewTop[key];
  }
  function rows(t) {
    const snd = B.sound(t);
    if (snd.pads) return snd.rows.map((r, i) => ({ pitch: i, label: r.name, pad: r }));
    const out = [];
    for (let p = top(t); p > top(t) - ROWS && p >= 0; p--) out.push({ pitch: p, label: B.noteName(p), out: p < snd.lo || p > snd.hi });
    return out;
  }

  // 타악 줄 이름 옆 작은 그림(드럼 세트만).
  const ICONS = {
    cymbal: '<ellipse cx="9" cy="6" rx="8" ry="2.2"/><line x1="9" y1="7" x2="9" y2="17"/>',
    hat: '<ellipse cx="9" cy="5" rx="7" ry="1.8"/><ellipse cx="9" cy="7" rx="7" ry="1.8"/><line x1="9" y1="8" x2="9" y2="17"/>',
    openhat: '<ellipse cx="9" cy="3.5" rx="7" ry="1.8"/><ellipse cx="9" cy="8" rx="7" ry="1.8"/><line x1="9" y1="9" x2="9" y2="17"/>',
    tom: '<ellipse cx="9" cy="5" rx="7" ry="2.2"/><path d="M2 5v8c0 1.2 3.1 2.2 7 2.2s7-1 7-2.2V5"/>',
    snare: '<ellipse cx="9" cy="7" rx="8" ry="2"/><path d="M1 7v4c0 1.1 3.6 2 8 2s8-.9 8-2V7"/><line x1="4" y1="9" x2="4" y2="12.6"/><line x1="14" y1="9" x2="14" y2="12.6"/>',
    kick: '<circle cx="9" cy="9" r="7.5"/><circle cx="9" cy="9" r="2"/>',
  };
  const padIcon = (r) => r.icon
    ? `<svg viewBox="0 0 18 18" aria-hidden="true" style="color:${r.color}">${ICONS[r.icon]}</svg>`
    : `<i class="swatch" style="background:${r.color}" aria-hidden="true"></i>`;

  // ---------- 트랙 목록 ----------
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  // 악기실과 같은 대분류 순서로 묶는다.
  const instOptions = B.CATEGORIES.map((cat) =>
    `<optgroup label="${cat.name}">${cat.models.map((m) => `<option value="${cat.id}/${m.id}">${esc(m.name)}</option>`).join("")}</optgroup>`).join("");
  let trackKey = "";
  function buildTracks(s) {
    $("tracks").innerHTML = s.tracks.map((t, i) => {
      const m = B.model(t), arts = m.arts && m.arts.length > 1 ? m.arts : null;
      return `
      <div class="track" data-id="${t.id}" style="--c:${B.COLORS[i]}">
        <div class="track-controls">
          <span class="dot" aria-hidden="true">${i + 1}</span>
          <select class="inst" aria-label="${i + 1}번 트랙 악기">${instOptions}</select>
          ${arts ? `<select class="art" aria-label="${i + 1}번 트랙 주법">${arts.map((a) => `<option value="${a.id}">${a.name}</option>`).join("")}</select>` : ""}
          ${B.hasPedal(t) ? `<button class="pedal small wide" aria-label="${i + 1}번 트랙 서스테인 페달">페달</button>` : ""}
          <button class="mute small" aria-label="${i + 1}번 트랙 끄기">M</button
          ><button class="solo small" aria-label="${i + 1}번 트랙만 듣기">S</button>
          <input class="vol" type="range" min="0" max="1" step="0.05" aria-label="${i + 1}번 트랙 소리 크기" />
          <button class="remove small" aria-label="${i + 1}번 트랙 지우기">×</button>
        </div>
        <svg class="lane" preserveAspectRatio="none" aria-hidden="true"></svg>
        <div class="lane-head" hidden></div>
      </div>`;
    }).join("");
  }
  function renderTracks(s) {
    const key = s.tracks.map((t) => t.id + t.instrument).join(",") + s.tracks.length;
    if (key !== trackKey) { trackKey = key; buildTracks(s); }
    const steps = B.totalSteps(s);
    for (const t of s.tracks) {
      const row = $("tracks").querySelector(`[data-id="${t.id}"]`), snd = B.sound(t);
      row.classList.toggle("selected", t.id === currentTrack(s).id);
      for (const [cls, v] of [[".inst", t.instrument], [".art", t.art], [".vol", t.volume]]) {
        const el = row.querySelector(cls);
        if (el && document.activeElement !== el) el.value = v;
      }
      row.querySelector(".mute").setAttribute("aria-pressed", t.mute);
      row.querySelector(".solo").setAttribute("aria-pressed", t.solo);
      row.querySelector(".pedal")?.setAttribute("aria-pressed", t.pedal);
      row.querySelector(".remove").hidden = s.tracks.length <= 1;
      // 미리 보기: 음 높이를 줄 높이에 맞춰 눌러 담는다.
      const count = snd.pads ? Math.max(1, snd.rows.length) : 0;
      const lo = snd.pads ? 0 : Math.min(...t.notes.map((n) => n.pitch), 60) - 1;
      const hi = snd.pads ? count : Math.max(...t.notes.map((n) => n.pitch), 72) + 1;
      const lane = row.querySelector(".lane");
      lane.setAttribute("viewBox", `0 0 ${steps} 100`);
      let svg = "";
      const per = B.stepsPerBar(s);
      for (let bar = 1; bar < s.bars; bar++) svg += `<line x1="${bar * per}" x2="${bar * per}" y1="0" y2="100" class="bar"/>`;
      for (const n of t.notes) {
        const y = snd.pads ? (n.pitch / count) * 100 : ((hi - n.pitch) / (hi - lo)) * 100;
        svg += `<rect x="${n.step}" y="${y}" width="${Math.max(0.6, n.len - 0.15)}" height="${snd.pads ? Math.max(3, 100 / count - 2) : 7}"/>`;
      }
      lane.innerHTML = svg;
    }
    $("add-track").hidden = s.tracks.length >= B.MAX_TRACKS;
  }

  // ---------- 편집 칸 ----------
  let labelKey = "";
  function renderEditor(s) {
    const t = currentTrack(s), snd = B.sound(t), list = rows(t), steps = B.totalSteps(s);
    const index = s.tracks.indexOf(t), m = B.model(t);
    const art = m.arts && m.arts.length > 1 ? " · " + m.arts.find((a) => a.id === t.art).name : "";
    $("editor-title").textContent = `${index + 1} · ${m.name}${art}`;
    $("editor-title").style.color = B.COLORS[index];
    $("octave").hidden = snd.pads;
    $("octave-up").disabled = snd.pads || narrow(snd) || top(t) >= snd.hi;
    $("octave-down").disabled = snd.pads || narrow(snd) || top(t) - ROWS < snd.lo;
    $("roll").classList.toggle("pads", snd.pads);
    rh = snd.pads ? Math.max(RH, Math.min(40, Math.floor(($("roll").clientHeight - RULER) / Math.max(1, list.length)))) : RH;
    rowH = list.map((r) => (snd.pads || B.inKey(r.pitch, s.key, s.scale) ? rh : NARROW));
    rowTop = [];
    rowH.reduce((y, h, i) => ((rowTop[i] = y), y + h), 0);
    const lk = [snd.key, snd.pads ? rh : top(t), s.key, s.scale].join("|");
    if (lk !== labelKey) {
      labelKey = lk;
      if (!snd.pads) $("labels").innerHTML = keyboardSVG(list, s);
      else $("labels").innerHTML = list.map((r) => {
        if (r.pad) return `<button class="label pad${r.pad.minor ? " minor" : ""}" data-pitch="${r.pitch}" tabindex="-1" title="${esc(r.pad.title || r.label)}">${padIcon(r.pad)}<span>${esc(r.label)}</span></button>`;
        // 세로 피아노 건반: 검은 건반은 짧게 얹고, 흰 건반끼리 맞닿는 곳(E–F, B–C)에만 선을 긋는다.
        // 글자: 조에 맞춘 계이름, C에는 옥타브를 알 수 있게 음이름도 작게.
        const pc = r.pitch % 12, black = [1, 3, 6, 8, 10].includes(pc), seam = pc === 5 || pc === 0;
        const cls = `label key${black ? " black" : ""}${seam ? " seam" : ""}${r.out ? " out" : ""}`;
        const sol = B.solfege(r.pitch, s.key, s.scale);
        const tint = sol && !r.out ? ` style="--sc:${B.solfegeColor(r.pitch, s.key, s.scale)}"` : "";
        return `<button class="${cls}${tint ? " sol" : ""}${sol === "미" || sol === "레" ? " light" : ""}" data-pitch="${r.pitch}" tabindex="-1" title="${r.label}${sol ? " · " + sol : ""}"${r.out ? " disabled" : ""}${tint}>` +
          `${pc === 0 ? `<small>${r.label}</small>` : ""}${sol ? `<b>${sol}</b>` : ""}</button>`;
      }).join("");
    }
    $("roll").style.setProperty("--rh", rh + "px");
    const per = B.stepsPerBar(s), beat = B.beatSteps(s);
    swingPx = B.swingable(s) ? (s.swing / 100) * CW / 3 : 0;
    const W = steps * CW, H = list.length ? rowTop[list.length - 1] + rowH[list.length - 1] : rh, svg = $("grid");
    // 좁게 보면 마디 번호가 겹치지 않게 1·3·5…만 적는다.
    const label = (b) => (per * CW < 90 && b % 2 ? "" : b + 1);
    $("ruler").style.width = W + "px";
    const shown = loopDraft || (loopOn && loop);
    $("ruler").innerHTML = Array.from({ length: s.bars }, (_, b) =>
      `<button type="button" data-bar="${b}" tabindex="-1" style="width:${per * CW}px"${shown && b >= shown[0] && b < shown[1] ? ' class="in-loop"' : ""} title="${b + 1}마디부터 재생">${label(b)}</button>`).join("");
    // 트랙을 바꾸면 고른 음을 놓고, 없어진 음은 고른 목록에서 뺀다.
    if (pickedTrack !== t.id) { picked.clear(); pickedTrack = t.id; }
    const keys = new Set(t.notes.map(noteKey));
    for (const k of [...picked]) if (!keys.has(k)) picked.delete(k);
    $("pick-tools").hidden = !picked.size;
    $("select-mode").setAttribute("aria-pressed", selectMode);
    $("grid").classList.toggle("selecting", selectMode);
    $("zoom-out").disabled = zoom === 0;
    $("zoom-in").disabled = zoom === ZOOMS.length - 1;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);
    let out = "";
    list.forEach((r, i) => {
      // 악기 음역 밖은 검게, 조성 밖의 음 줄과 드럼 세트의 보조 줄은 어둡게, 으뜸음 줄은 살짝 밝게.
      const off = r.pad ? !!r.pad.minor : !B.inKey(r.pitch, s.key, s.scale), root = !r.pad && r.pitch % 12 === s.key;
      out += `<rect x="0" y="${rowTop[i]}" width="${W}" height="${rowH[i]}" class="row${r.out ? " out" : off ? " off" : root ? " root" : ""}"/>`;
    });
    for (let x = 0; x <= steps; x++)
      out += `<line x1="${colX(x)}" x2="${colX(x)}" y1="0" y2="${H}" class="${x % per === 0 ? "bar" : x % beat === 0 ? "beat" : "step"}"/>`;
    for (let i = 1; i < list.length; i++) out += `<line x1="0" x2="${W}" y1="${rowTop[i]}" y2="${rowTop[i]}" class="hline"/>`;
    for (const n of t.notes) {
      const i = list.findIndex((r) => r.pitch === n.pitch);
      if (i < 0) continue;
      const sel = picked.has(noteKey(n)) ? " sel" : "";
      if (snd.pads)
        out += `<rect x="${colX(n.step) + 3}" y="${rowTop[i] + 3}" width="${colX(n.step + 1) - colX(n.step) - 6}" height="${rowH[i] - 6}" rx="4" fill="${list[i].pad.color}" class="hit${sel}"/>`;
      else {
        // 음표는 계이름 색으로 칠한다(조에 없는 음은 회색).
        const color = B.solfegeColor(n.pitch, s.key, s.scale);
        // 페달을 밟은 동안 이어지는 울림을 옅게 보여 준다.
        const ring = B.soundingSteps(t, n, per);
        const x0 = colX(n.step), x1 = colX(n.step + n.len);
        // 좁은 줄의 음표는 줄을 거의 꽉 채워야 보인다.
        const y = rowTop[i], h = rowH[i], wide = h >= RH, pad = wide ? 2 : 1;
        if (ring > n.len) out += `<rect x="${x1}" y="${y + h * 0.35}" width="${colX(n.step + ring) - x1 - 2}" height="${h * 0.3}" fill="${color}" opacity=".3"/>`;
        out += `<rect x="${x0 + 1}" y="${y + pad}" width="${x1 - x0 - 2}" height="${h - pad * 2}" rx="${wide ? 4 : 2}" fill="${color}" class="note${sel}"/>` +
          (wide ? `<rect x="${x1 - 6}" y="${y + 5}" width="2" height="${h - 10}" class="grip"/>` : "");
      }
    }
    if (band) out += `<rect x="${Math.min(band.x0, band.x1)}" y="${Math.min(band.y0, band.y1)}" width="${Math.abs(band.x1 - band.x0)}" height="${Math.abs(band.y1 - band.y0)}" class="band"/>`;
    svg.innerHTML = out;
  }

  function render(s) {
    if (!s.tracks.some((t) => t.id === selected)) selected = s.tracks[0].id;
    U.value("bpm", s.bpm);
    U.value("swing", s.swing);
    $("swing").disabled = !B.swingable(s);
    U.value("meter", s.meter);
    U.value("bars", s.bars);
    U.value("key", s.key);
    U.value("scale", s.scale);
    renderSongs();
    renderTracks(s);
    renderEditor(s);
    $("loop").setAttribute("aria-pressed", loopOn);
    const per = B.stepsPerBar(s);
    E.setRange(loopOn && loop && loop[0] < s.bars ? [loop[0] * per, Math.min(loop[1], s.bars) * per] : null);
    E.sync(s);
  }

  // 저장한 곡 다섯 칸. 빈 칸은 「비어 있음」으로 보여 준다.
  const SONGS = 5;
  function renderSongs() {
    const html = Array.from({ length: SONGS }, (_, i) =>
      `<option value="${i}">${i + 1}번 곡${app.slotFilled(i) ? "" : " (비어 있음)"}</option>`).join("");
    if ($("song").innerHTML !== html) $("song").innerHTML = html;
    $("song").value = String(app.slot);
  }
  function songChanged() {
    if (E.playing) { E.stop(); setPlaying(false); }
    loop = null; loopOn = false; loopDraft = null;
    picked.clear();
  }
  const app = U.app({ name: "beat-maker", initial: B.initial, validate: B.validate, render, slots: SONGS, slotChanged: () => songChanged() });
  U.bind("song", "change", () => app.useSlot(Number($("song").value)));
  // 소리 파일(ogg)을 못 풀면 소리 없이 조용히 지나가지 않게 한 번 알려 준다(아이패드는 iPadOS 18.4부터 된다).
  let soundWarned = false;
  window.addEventListener("beatsoundfail", () => {
    if (soundWarned) return;
    soundWarned = true;
    app.notice("악기 소리를 불러오지 못했어요. 아이패드는 iPadOS 18.4 이상인지 확인하세요.");
  });
  const editTrack = (s) => s.tracks.find((t) => t.id === currentTrack(app.state).id);
  const byId = (s, id) => s.tracks.find((t) => t.id === id);

  // ---------- 곡 설정 ----------
  $("key").innerHTML = B.NOTE_NAMES.map((n, i) => `<option value="${i}">${n} (${B.KEY_NAMES[i]})</option>`).join("");
  U.bind("bpm", "input", () => {
    const v = Number($("bpm").value);
    if (Number.isInteger(v) && v >= 40 && v <= 200) app.preview((s) => (s.bpm = v));
  });
  U.bind("bpm", "change", () => app.end());
  U.bind("swing", "input", () => {
    const v = Number($("swing").value);
    if (Number.isInteger(v) && v >= 0 && v <= 100) app.preview((s) => (s.swing = v));
  });
  U.bind("swing", "change", () => app.end());
  // 숫자 칸은 누른 채 위로 끌면 커지고 아래로 끌면 작아진다. 끌지 않고 떼면 바로 입력할 수 있다.
  function dragNumber(input, pxPerStep = 4) {
    let start = null;
    input.addEventListener("pointerdown", (e) => {
      if (input.disabled || e.button !== 0 || document.activeElement === input) return;
      e.preventDefault();
      input.setPointerCapture(e.pointerId);
      start = { y: e.clientY, value: Number(input.value), moved: false };
    });
    input.addEventListener("pointermove", (e) => {
      if (!start) return;
      const delta = Math.round((start.y - e.clientY) / pxPerStep);
      if (!start.moved && Math.abs(start.y - e.clientY) < 4) return;
      start.moved = true;
      const step = Number(input.step) || 1, min = Number(input.min), max = Number(input.max);
      const next = Math.max(min, Math.min(max, start.value + delta * step));
      if (next === Number(input.value)) return;
      input.value = String(next);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const finish = () => {
      if (!start) return;
      const moved = start.moved;
      start = null;
      if (moved) input.dispatchEvent(new Event("change", { bubbles: true }));
      else { input.focus(); input.select(); }
    };
    input.addEventListener("pointerup", finish);
    input.addEventListener("pointercancel", finish);
  }
  dragNumber($("bpm"));
  dragNumber($("swing"), 8);
  U.bind("meter", "change", () => app.commit((s) => B.changeMeter(s, $("meter").value)));
  U.bind("bars", "change", () => app.commit((s) => (s.bars = Number($("bars").value))));
  // 창 크기가 바뀌면 타악 줄 높이를 다시 맞춘다.
  window.addEventListener("resize", () => renderEditor(app.state));
  U.bind("key", "change", () => app.commit((s) => (s.key = Number($("key").value)), false));
  U.bind("scale", "change", () => app.commit((s) => (s.scale = $("scale").value), false));

  // ---------- 트랙 조작 ----------
  $("tracks").addEventListener("click", (e) => {
    const row = e.target.closest(".track");
    if (!row) return;
    const id = row.dataset.id;
    const toggle = (key) => app.commit((s) => { const t = byId(s, id); t[key] = !t[key]; }, false);
    if (e.target.closest(".mute")) toggle("mute");
    else if (e.target.closest(".solo")) toggle("solo");
    else if (e.target.closest(".pedal")) toggle("pedal");
    else if (e.target.closest(".remove")) app.commit((s) => (s.tracks = s.tracks.filter((t) => t.id !== id)));
    else if (!e.target.closest("select,input")) { selected = id; app.render(); }
  });
  $("tracks").addEventListener("change", (e) => {
    const row = e.target.closest(".track");
    if (!row) return;
    const id = row.dataset.id;
    if (e.target.matches(".inst, .art")) {
      selected = id;
      const art = e.target.matches(".art") ? e.target.value : undefined;
      const instrument = e.target.matches(".inst") ? e.target.value : byId(app.state, id).instrument;
      app.commit((s) => B.changeInstrument(byId(s, id), instrument, art));
      const t = byId(app.state, id), snd = B.sound(t);
      E.preview(t, snd.pads ? snd.rows.length - 1 : snd.view, t.volume);
    }
    if (e.target.matches(".vol")) app.end();
  });
  $("tracks").addEventListener("input", (e) => {
    if (!e.target.matches(".vol")) return;
    const id = e.target.closest(".track").dataset.id, v = Number(e.target.value);
    app.preview((s) => (byId(s, id).volume = v));
  });
  U.bind("add-track", "click", () => {
    if (app.state.tracks.length >= B.MAX_TRACKS) return;
    const id = "t" + Date.now().toString(36);
    selected = id;
    app.commit((s) => s.tracks.push(B.track(id, "keyboard/concert-grand")));
  });

  // ---------- 칸 찍기 ----------
  function cellAt(p) {
    const list = rows(currentTrack());
    const step = Math.max(0, Math.min(B.totalSteps(app.state) - 1, stepAtX(p.x)));
    const row = list[rowIndexAt(p.y)];
    const snd = B.sound(currentTrack());
    // 음역 밖 줄로 끌어도 음역 끝에 머문다.
    return { step, pitch: snd.pads ? row.pitch : Math.max(snd.lo, Math.min(snd.hi, row.pitch)), out: !!row.out };
  }
  // 네모 안에 걸친 음을 고른다(누르기만 하면 그 자리의 음 하나).
  function pickInBand(b, add) {
    const t = currentTrack(), list = rows(t), snd = B.sound(t);
    const x0 = Math.min(b.x0, b.x1), x1 = Math.max(b.x0, b.x1), y0 = Math.min(b.y0, b.y1), y1 = Math.max(b.y0, b.y1);
    if (!add) picked.clear();
    for (const n of t.notes) {
      const i = list.findIndex((r) => r.pitch === n.pitch);
      if (i < 0) continue;
      const nx1 = colX(n.step + (snd.pads ? 1 : n.len));
      if (colX(n.step) <= x1 && nx1 >= x0 && rowTop[i] <= y1 && rowTop[i] + rowH[i] >= y0) {
        const k = noteKey(n);
        if (add && x0 === x1 && picked.has(k)) picked.delete(k); else picked.add(k);
      }
    }
  }
  U.pointer($("grid"), {
    start(p, e) {
      const t = currentTrack(), snd = B.sound(t);
      if (!rows(t).length) return false;
      if (selectMode || e.shiftKey) {
        band = { x0: p.x, y0: p.y, x1: p.x, y1: p.y, add: e.shiftKey };
        return { box: true };
      }
      if (picked.size) picked.clear();
      const c = cellAt(p);
      if (c.out) return false;
      app.begin();
      const live = editTrack(app.state);
      if (snd.pads) {
        const hit = live.notes.find((n) => n.step === c.step && n.pitch === c.pitch);
        const paint = !hit;
        app.preview((s) => {
          const tr = editTrack(s);
          tr.notes = paint ? B.placeNote(tr.notes, { step: c.step, pitch: c.pitch, len: 1 }) : tr.notes.filter((n) => n !== hit);
        });
        if (paint) E.preview(t, c.pitch, live.volume);
        return { pads: true, paint, seen: new Set([c.step + ":" + c.pitch]) };
      }
      const found = live.notes.find((n) => n.pitch === c.pitch && n.step <= c.step && c.step < n.step + n.len);
      if (found) {
        const nearEnd = p.x > colX(found.step + found.len) - CW * 0.45;
        return { note: found, mode: nearEnd ? "resize" : "move", grab: c.step - found.step, moved: false };
      }
      const note = { step: c.step, pitch: c.pitch, len: Math.min(lastLen, B.totalSteps(app.state) - c.step) };
      app.preview((s) => { const tr = editTrack(s); tr.notes = B.placeNote(tr.notes, note); });
      E.preview(t, c.pitch, live.volume);
      return { note, mode: "resize", moved: true };
    },
    move(p, d) {
      if (d.box) { band.x1 = p.x; band.y1 = p.y; renderEditor(app.state); return; }
      const c = cellAt(p), t = currentTrack();
      if (d.pads) {
        const k = c.step + ":" + c.pitch;
        if (d.seen.has(k)) return;
        d.seen.add(k);
        app.preview((s) => {
          const tr = editTrack(s);
          tr.notes = d.paint ? B.placeNote(tr.notes, { step: c.step, pitch: c.pitch, len: 1 })
            : tr.notes.filter((n) => !(n.step === c.step && n.pitch === c.pitch));
        });
        if (d.paint) E.preview(t, c.pitch, t.volume);
        return;
      }
      const steps = B.totalSteps(app.state);
      app.preview(() => {
        if (d.mode === "resize") {
          const len = Math.max(1, Math.min(steps - d.note.step, c.step - d.note.step + 1));
          if (len !== d.note.len) { d.note.len = len; d.moved = true; }
        } else {
          const step = Math.max(0, Math.min(steps - d.note.len, c.step - d.grab));
          if (step !== d.note.step || c.pitch !== d.note.pitch) {
            d.note.step = step;
            if (c.pitch !== d.note.pitch) { d.note.pitch = c.pitch; E.preview(t, c.pitch, t.volume); }
            d.moved = true;
          }
        }
      });
    },
    end(p, d) {
      if (d.box) { pickInBand(band, band.add); band = null; renderEditor(app.state); return; }
      if (!d.pads) {
        app.preview((s) => {
          const tr = editTrack(s);
          const others = tr.notes.filter((n) => n !== d.note);
          // 옮기지 않고 한 번 누른 음은 지운다.
          tr.notes = d.mode === "move" && !d.moved ? others : B.placeNote(others, d.note);
        });
        if (d.mode === "resize") lastLen = d.note.len;
      }
      app.end();
    },
    cancel() {
      if (band) { band = null; renderEditor(app.state); } else app.abort();
    },
  });

  // 고른 음 옮기기: dStep 칸 옆으로, dRow 줄 위(+)·아래(−)로. 하나라도 칸 밖으로 나가면 옮기지 않는다.
  function movePicked(dStep, dRow) {
    if (!picked.size) return;
    const t = currentTrack(), snd = B.sound(t), steps = B.totalSteps(app.state);
    // 타악은 줄 번호가 위에서부터 0이라 위로 가면 번호가 작아진다.
    const dPitch = snd.pads ? -dRow : dRow, lo = snd.pads ? 0 : snd.lo, hi = snd.pads ? snd.rows.length - 1 : snd.hi;
    const chosen = t.notes.filter((n) => picked.has(noteKey(n)));
    const moved = chosen.map((n) => ({ ...n, step: n.step + dStep, pitch: n.pitch + dPitch }));
    if (moved.some((n) => n.step < 0 || n.step + n.len > steps || n.pitch < lo || n.pitch > hi)) return;
    app.commit((s) => {
      const tr = editTrack(s);
      tr.notes = moved.reduce((all, n) => B.placeNote(all, n), tr.notes.filter((n) => !picked.has(noteKey(n))));
    });
    picked.clear();
    for (const n of moved) picked.add(noteKey(n));
    if (dPitch) E.preview(t, moved[0].pitch, t.volume);
    renderEditor(app.state);
  }
  function deletePicked() {
    if (!picked.size) return;
    app.commit((s) => { const tr = editTrack(s); tr.notes = tr.notes.filter((n) => !picked.has(noteKey(n))); });
    picked.clear();
    renderEditor(app.state);
  }
  // 화면 버튼(아이패드처럼 키보드가 없을 때)과 키보드 화살표가 같은 일을 한다.
  for (const [id, fn] of [["pick-up", () => movePicked(0, 1)], ["pick-down", () => movePicked(0, -1)],
    ["pick-left", () => movePicked(-1, 0)], ["pick-right", () => movePicked(1, 0)], ["pick-delete", deletePicked]])
    U.bind(id, "click", fn);
  U.bind("select-mode", "click", () => { selectMode = !selectMode; if (!selectMode) picked.clear(); renderEditor(app.state); });
  $("grid").addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
      e.preventDefault();
      for (const n of currentTrack().notes) picked.add(noteKey(n));
      renderEditor(app.state);
      return;
    }
    if (!picked.size) return;
    const per = B.stepsPerBar(app.state), oct = B.sound(currentTrack()).pads ? 1 : 12;
    const keys = {
      ArrowUp: () => movePicked(0, e.shiftKey ? oct : 1), ArrowDown: () => movePicked(0, e.shiftKey ? -oct : -1),
      ArrowLeft: () => movePicked(e.shiftKey ? -per : -1, 0), ArrowRight: () => movePicked(e.shiftKey ? per : 1, 0),
      Delete: deletePicked, Backspace: deletePicked,
      Escape: () => { picked.clear(); renderEditor(app.state); },
    };
    if (!keys[e.key]) return;
    e.preventDefault();
    keys[e.key]();
  });
  $("labels").addEventListener("pointerdown", (e) => {
    const b = e.target.closest("[data-pitch]");
    if (!b) return;
    E.preview(currentTrack(), Number(b.dataset.pitch), currentTrack().volume);
    // 누른 건반이 잠깐 눌린 빛깔로.
    b.classList.add("down");
    setTimeout(() => b.classList.remove("down"), 180);
  });
  for (const [id, d] of [["octave-up", 12], ["octave-down", -12]])
    U.bind(id, "click", () => {
      const t = currentTrack(), snd = B.sound(t);
      viewTop[t.id + "|" + snd.key] = Math.max(snd.lo + ROWS - 1, Math.min(snd.hi, top(t) + d));
      app.render();
    });

  // ---------- 재생 ----------
  let frame = 0;
  function tick() {
    const pos = E.position();
    if (pos !== null) {
      const head = $("playhead");
      head.hidden = false;
      head.style.transform = `translateX(${pos * CW}px)`;
      const steps = B.totalSteps(app.state);
      document.querySelectorAll(".lane-head").forEach((el) => { el.hidden = false; el.style.left = `calc(var(--controls) + (100% - var(--controls)) * ${pos / steps})`; });
      // 재생선이 보이는 칸을 벗어나면 따라간다.
      const roll = $("roll"), lw = $("labels").offsetWidth, x = pos * CW + lw;
      if (x < roll.scrollLeft + lw || x > roll.scrollLeft + roll.clientWidth - 40) roll.scrollLeft = x - lw;
    }
    frame = requestAnimationFrame(tick);
  }
  function setPlaying(on) {
    $("play").textContent = on ? "■ 정지" : "▶ 재생";
    $("play").setAttribute("aria-pressed", on);
    if (!on) {
      cancelAnimationFrame(frame);
      $("playhead").hidden = true;
      document.querySelectorAll(".lane-head").forEach((el) => (el.hidden = true));
    }
  }
  async function start(fromStep) {
    $("play").disabled = true;
    $("play").textContent = "불러오는 중…";
    try {
      await E.play(app.state, fromStep);
      setPlaying(true);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    } catch (_) {
      app.notice("소리를 불러오지 못했어요.");
      setPlaying(false);
    } finally {
      $("play").disabled = false;
    }
  }
  U.bind("play", "click", () => {
    if (E.playing) { E.stop(); setPlaying(false); } else start(0);
  });
  // 마디 번호를 누르면 그 마디부터 재생하고, 옆으로 끌면 끈 마디들을 반복 구간으로 정한다.
  {
    const ruler = $("ruler");
    const barAt = (e) => Math.max(0, Math.min(app.state.bars - 1, Math.floor((e.clientX - ruler.getBoundingClientRect().left) / (B.stepsPerBar(app.state) * CW))));
    let from = null;
    ruler.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      ruler.setPointerCapture(e.pointerId);
      from = barAt(e);
    });
    ruler.addEventListener("pointermove", (e) => {
      if (from === null) return;
      const b = barAt(e);
      if (b === from && !loopDraft) return;
      loopDraft = [Math.min(from, b), Math.max(from, b) + 1];
      renderEditor(app.state);
    });
    const finish = (e, cancelled) => {
      if (from === null) return;
      const bar = from, draft = loopDraft;
      from = null;
      loopDraft = null;
      if (cancelled) { renderEditor(app.state); return; }
      if (draft) { loop = draft; loopOn = true; app.render(); start(loop[0] * B.stepsPerBar(app.state)); }
      else start(bar * B.stepsPerBar(app.state));
    };
    ruler.addEventListener("pointerup", (e) => finish(e, false));
    ruler.addEventListener("pointercancel", (e) => finish(e, true));
  }
  U.bind("loop", "click", () => {
    if (!loop) { app.notice("마디 번호를 옆으로 끌어서 반복할 구간을 고르세요."); return; }
    loopOn = !loopOn;
    app.render();
    if (E.playing) start(loopOn ? loop[0] * B.stepsPerBar(app.state) : 0);
  });
  U.bind("metronome", "click", () => {
    const on = $("metronome").getAttribute("aria-pressed") !== "true";
    $("metronome").setAttribute("aria-pressed", on);
    E.setClick(on);
  });
  // 돋보기: 보고 있던 가운데 칸이 그대로 가운데 오게 칸 너비를 바꾼다.
  for (const [id, d] of [["zoom-out", -1], ["zoom-in", 1]])
    U.bind(id, "click", () => {
      const next = Math.max(0, Math.min(ZOOMS.length - 1, zoom + d));
      if (next === zoom) return;
      const roll = $("roll"), lw = $("labels").offsetWidth, view = roll.clientWidth - lw;
      const center = (roll.scrollLeft + view / 2) / CW;
      zoom = next;
      CW = ZOOMS[zoom];
      renderEditor(app.state);
      roll.scrollLeft = Math.max(0, center * CW - view / 2);
    });
  U.bind("rewind", "click", () => {
    $("roll").scrollLeft = 0;
    if (E.playing) start(0);
  });
  document.addEventListener("keydown", (e) => {
    // 스페이스 바는 어디에 초점이 있든(글 칸·고르는 칸 빼고) 재생·멈춤. 방금 누른 단추가 다시 눌리지 않게 막는다.
    if (e.code !== "Space" || e.target.closest("input,select,textarea")) return;
    e.preventDefault();
    if (!e.repeat) $("play").click();
  });
  document.addEventListener("keyup", (e) => {
    if (e.code === "Space" && e.target.closest("button")) e.preventDefault();
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && E.playing) { E.stop(); setPlaying(false); } });

  U.bind("export", "click", async () => {
    $("export").disabled = true;
    $("export").textContent = "만드는 중…";
    try {
      const blob = await E.mp3(app.state);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "비트메이커.mp3";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    } catch (_) {
      app.notice("파일을 만들지 못했어요.");
    } finally {
      $("export").disabled = false;
      $("export").textContent = "MP3 저장";
    }
  });

  app.start();
})();
