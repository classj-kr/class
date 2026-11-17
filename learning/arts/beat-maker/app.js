(() => {
  "use strict";
  const B = BeatCore, E = BeatEngine, U = ToolUI, $ = U.$;
  const RH = 20, ROWS = 25; // 줄 높이, 가락 악기는 두 옥타브(25줄)씩 본다.
  // 칸 너비(확대 단계). 돋보기로 고른다.
  const ZOOMS = [10, 14, 19, 26, 34, 44];
  let zoom = 3, CW = ZOOMS[zoom];
  const RULER = 24; // 마디 번호 자 높이
  let rh = RH; // 타악 줄은 편집 칸 높이를 채우도록 늘린다(최대 40px).
  // 스윙만큼 뒤쪽 16분 칸이 늦게 시작하도록 그린다. 소리가 늦는 만큼 칸도 밀려서 재생선과 맞는다.
  let swingPx = 0;
  const colX = (step) => step * CW + (step % 2 ? swingPx : 0);
  const stepAtX = (x) => { const s = Math.floor(x / CW); return s % 2 && x < colX(s) ? s - 1 : s; };
  let selected = "t1";
  const viewTop = {}; // 트랙별로 보고 있는 맨 위 음
  let lastLen = 2;

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
    const lk = [snd.key, snd.pads ? "" : top(t), s.key, s.scale].join("|");
    if (lk !== labelKey) {
      labelKey = lk;
      $("labels").innerHTML = list.map((r) => {
        if (r.pad) return `<button class="label pad${r.pad.minor ? " minor" : ""}" data-pitch="${r.pitch}" tabindex="-1" title="${esc(r.pad.title || r.label)}">${padIcon(r.pad)}<span>${esc(r.label)}</span></button>`;
        // 세로 피아노 건반: 검은 건반은 짧게 얹고, 흰 건반끼리 맞닿는 곳(E–F, B–C)에만 선을 긋는다.
        // 글자: 조에 맞춘 계이름, C에는 옥타브를 알 수 있게 음이름도 작게.
        const pc = r.pitch % 12, black = [1, 3, 6, 8, 10].includes(pc), seam = pc === 5 || pc === 0;
        const cls = `label key${black ? " black" : ""}${seam ? " seam" : ""}${r.out ? " out" : ""}`;
        const sol = B.solfege(r.pitch, s.key, s.scale);
        return `<button class="${cls}" data-pitch="${r.pitch}" tabindex="-1" title="${r.label}${sol ? " · " + sol : ""}"${r.out ? " disabled" : ""}>` +
          `${pc === 0 ? `<small>${r.label}</small>` : ""}${sol ? `<b>${sol}</b>` : ""}</button>`;
      }).join("");
    }
    rh = snd.pads ? Math.max(RH, Math.min(40, Math.floor(($("roll").clientHeight - RULER) / Math.max(1, list.length)))) : RH;
    $("roll").style.setProperty("--rh", rh + "px");
    const per = B.stepsPerBar(s), beat = B.beatSteps(s);
    swingPx = B.swingable(s) ? (s.swing / 100) * CW / 3 : 0;
    const W = steps * CW, H = Math.max(1, list.length) * rh, svg = $("grid");
    // 좁게 보면 마디 번호가 겹치지 않게 1·3·5…만 적는다.
    const label = (b) => (per * CW < 90 && b % 2 ? "" : b + 1);
    $("ruler").style.width = W + "px";
    $("ruler").innerHTML = Array.from({ length: s.bars }, (_, b) =>
      `<button type="button" data-bar="${b}" tabindex="-1" style="width:${per * CW}px" title="${b + 1}마디부터 재생">${label(b)}</button>`).join("");
    $("zoom-out").disabled = zoom === 0;
    $("zoom-in").disabled = zoom === ZOOMS.length - 1;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);
    let out = "";
    list.forEach((r, i) => {
      // 악기 음역 밖은 검게, 조성 밖의 음 줄과 드럼 세트의 보조 줄은 어둡게, 으뜸음 줄은 살짝 밝게.
      const off = r.pad ? !!r.pad.minor : !B.inKey(r.pitch, s.key, s.scale), root = !r.pad && r.pitch % 12 === s.key;
      out += `<rect x="0" y="${i * rh}" width="${W}" height="${rh}" class="row${r.out ? " out" : off ? " off" : root ? " root" : ""}"/>`;
    });
    for (let x = 0; x <= steps; x++)
      out += `<line x1="${colX(x)}" x2="${colX(x)}" y1="0" y2="${H}" class="${x % per === 0 ? "bar" : x % beat === 0 ? "beat" : "step"}"/>`;
    for (let i = 1; i < list.length; i++) out += `<line x1="0" x2="${W}" y1="${i * rh}" y2="${i * rh}" class="hline"/>`;
    const color = B.COLORS[index];
    for (const n of t.notes) {
      const i = list.findIndex((r) => r.pitch === n.pitch);
      if (i < 0) continue;
      if (snd.pads)
        out += `<rect x="${colX(n.step) + 3}" y="${i * rh + 3}" width="${colX(n.step + 1) - colX(n.step) - 6}" height="${rh - 6}" rx="4" fill="${list[i].pad.color}" class="hit"/>`;
      else {
        // 페달을 밟은 동안 이어지는 울림을 옅게 보여 준다.
        const ring = B.soundingSteps(t, n, per);
        const x0 = colX(n.step), x1 = colX(n.step + n.len);
        if (ring > n.len) out += `<rect x="${x1}" y="${i * RH + 7}" width="${colX(n.step + ring) - x1 - 2}" height="${RH - 14}" fill="${color}" opacity=".3"/>`;
        out += `<rect x="${x0 + 1}" y="${i * RH + 2}" width="${x1 - x0 - 2}" height="${RH - 4}" rx="4" fill="${color}" class="note"/>` +
          `<rect x="${x1 - 6}" y="${i * RH + 5}" width="2" height="${RH - 10}" class="grip"/>`;
      }
    }
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
    renderTracks(s);
    renderEditor(s);
    E.sync(s);
  }

  const app = U.app({ name: "beat-maker", initial: B.initial, validate: B.validate, render });
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
    const row = list[Math.max(0, Math.min(list.length - 1, Math.floor(p.y / rh)))];
    const snd = B.sound(currentTrack());
    // 음역 밖 줄로 끌어도 음역 끝에 머문다.
    return { step, pitch: snd.pads ? row.pitch : Math.max(snd.lo, Math.min(snd.hi, row.pitch)), out: !!row.out };
  }
  U.pointer($("grid"), {
    start(p) {
      const t = currentTrack(), snd = B.sound(t);
      if (!rows(t).length) return false;
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
    cancel() { app.abort(); },
  });
  $("labels").addEventListener("pointerdown", (e) => {
    const b = e.target.closest(".label");
    if (b) E.preview(currentTrack(), Number(b.dataset.pitch), currentTrack().volume);
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
  // 마디 번호를 누르면 그 마디부터 재생한다.
  $("ruler").addEventListener("click", (e) => {
    const b = e.target.closest("[data-bar]");
    if (b) start(Number(b.dataset.bar) * B.stepsPerBar(app.state));
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
    if (e.code !== "Space" || e.target.closest("input,select,textarea,button")) return;
    e.preventDefault();
    $("play").click();
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
