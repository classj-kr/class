(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = ModelClock,
    $ = U.$;
  let running = false,
    runFrame,
    last = 0,
    runBefore;
  const center = { x: 350, y: 295 };
  const pos = (angle, r) => ({
    x: center.x + r * Math.sin((angle * Math.PI) / 180),
    y: center.y - r * Math.cos((angle * Math.PI) / 180),
  });
  // 잡는 동그라미는 숫자 고리(반지름 176~210) 안쪽에 둬서 숫자를 가리지 않는다.
  const KNOB = { hour: 100, minute: 158, second: 221 };
  const angle = (p) =>
    M.mod((Math.atan2(p.x - center.x, center.y - p.y) * 180) / Math.PI, 360);
  function render(s) {
    const p = C.parts(s.seconds),
      a = C.angles(s.seconds);
    U.value("hour", p.h);
    U.value("minute", p.m);
    U.value("second", p.s);
    $("second").hidden = !s.secondsHand;
    $("second-label").hidden = !s.secondsHand;
    $("time-form").hidden = !s.digital;
    U.pressed("minutes", s.minutes);
    U.pressed("seconds-hand", s.secondsHand);
    U.pressed("digital-toggle", s.digital);
    U.pressed("run", running);
    $("run").textContent = running ? "멈추기" : "움직이기";
    $("digital").textContent = s.digital
      ? C.format(s.seconds, s.secondsHand)
      : "";
    $("clear-start").hidden = s.start === null;
    let svg =
      '<circle cx="350" cy="301" r="268" fill="#d7d7c9"/><circle cx="350" cy="295" r="268" class="paper"/><circle cx="350" cy="295" r="248" fill="none" stroke="#e6e7dc"/>';
    for (let i = 0; i < 60; i++) {
      const q = pos(i * 6, 240),
        r = pos(i * 6, i % 5 ? 231 : 221);
      svg += U.line(
        q.x,
        q.y,
        r.x,
        r.y,
        `stroke="${i % 5 ? "#a9b3a5" : "#547567"}" stroke-width="${i % 5 ? 1.5 : 3}"`,
      );
      if (i % 5 === 0) {
        const t = pos(i * 6, 193);
        svg += U.text(
          t.x,
          t.y,
          i / 5 || 12,
          'class="number" style="font-size:34px"',
        );
        if (s.minutes) {
          const m = pos(i * 6, 282);
          svg += U.text(
            m.x,
            m.y,
            i,
            'class="number" style="font-size:17px;fill:#8b9687"',
          );
        }
      }
    }
    if (s.start !== null) {
      const old = C.angles(s.start);
      for (const [key, r] of [
        ["hour", 130],
        ["minute", 205],
      ]) {
        const p = pos(old[key], r);
        svg += U.line(
          center.x,
          center.y,
          p.x,
          p.y,
          'stroke="#a6b4a5" stroke-width="9" stroke-linecap="round" stroke-dasharray="8 8"',
        );
      }
    }
    for (const [key, r, width, color] of [
      ["hour", 138, 14, "#315f50"],
      ["minute", 207, 10, "#d57c50"],
      ...(s.secondsHand ? [["second", 221, 3, "#a56ca0"]] : []),
    ]) {
      const p = pos(a[key], r),
        k = pos(a[key], KNOB[key]);
      svg +=
        U.line(
          center.x,
          center.y,
          p.x,
          p.y,
          `stroke="${color}" stroke-width="${width}" stroke-linecap="round"`,
        ) +
        `<circle cx="${k.x}" cy="${k.y}" r="${key === "second" ? 8 : 13}" fill="${color}" stroke="#fffefa" stroke-width="3"/>`;
    }
    svg +=
      '<circle cx="350" cy="295" r="13" fill="#fffefa" stroke="#315f50" stroke-width="6"/>';
    $("stage").innerHTML = svg;
    if (s.start !== null) {
      const elapsed = C.parts(C.elapsed(s.start, s.seconds));
      $("elapsed").textContent =
        `${C.format(s.start, s.secondsHand)} → ${s.digital ? C.format(s.seconds, s.secondsHand) : "현재"} · ${elapsed.h ? elapsed.h + "시간 " : ""}${elapsed.m}분${s.secondsHand ? " " + elapsed.s + "초" : ""}`;
    } else $("elapsed").textContent = "";
  }
  const app = U.app({
    name: "model-clock",
    initial: C.initial,
    validate: C.validate,
    render,
  });
  function stop() {
    if (running) {
      running = false;
      cancelAnimationFrame(runFrame);
      app.end(false);
      app.render();
    }
  }
  for (const key of ["minutes", "seconds-hand", "digital-toggle"])
    U.bind(key, "click", () => {
      stop();
      app.commit((s) => {
        const name = {
          minutes: "minutes",
          "seconds-hand": "secondsHand",
          "digital-toggle": "digital",
        }[key];
        s[name] = !s[name];
      }, false);
    });
  U.bind("time-form", "submit", (e) => {
    e.preventDefault();
    stop();
    const h = Number($("hour").value),
      m = Number($("minute").value),
      sec = Number($("second").value);
    if (
      !M.integer(h, 0, 23) ||
      !M.integer(m, 0, 59) ||
      !M.integer(sec, 0, 59)
    ) {
      app.notice("시·분·초의 범위를 확인해 주세요.");
      return;
    }
    app.commit(
      (s) => (s.seconds = h * 3600 + m * 60 + (s.secondsHand ? sec : 0)),
    );
  });
  for (const [id, delta] of [
    ["back-five", -300],
    ["forward-five", 300],
  ])
    U.bind(id, "click", () => {
      stop();
      app.commit((s) => (s.seconds = M.mod(s.seconds + delta, C.DAY)));
    });
  U.bind("mark", "click", () => {
    stop();
    app.commit((s) => (s.start = s.seconds));
  });
  U.bind("clear-start", "click", () => {
    stop();
    app.commit((s) => (s.start = null));
  });
  U.bind("time-form", "focusin", stop);
  U.bind("run", "click", () => {
    if (running) {
      stop();
      return;
    }
    app.begin();
    running = true;
    last = performance.now();
    runBefore = app.state.seconds;
    const start = last;
    const tick = (now) => {
      if (!running) return;
      app.preview(
        (s) =>
          (s.seconds = M.mod(
            runBefore + Math.floor((now - start) * 0.3),
            C.DAY,
          )),
      );
      runFrame = requestAnimationFrame(tick);
    };
    app.render();
    runFrame = requestAnimationFrame(tick);
  });
  // Any history/reset action ends playback before the shared handler changes state.
  for (const id of ["undo", "redo", "reset"])
    $(id).addEventListener("click", stop, { capture: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  document.addEventListener(
    "keydown",
    (e) => {
      if (
        e.key === "Escape" ||
        ((e.ctrlKey || e.metaKey) && ["z", "y"].includes(e.key.toLowerCase()))
      )
        stop();
    },
    { capture: true },
  );
  U.pointer($("stage"), {
    start(p) {
      stop();
      const a = C.angles(app.state.seconds),
        hands = ["hour", "minute", ...(app.state.secondsHand ? ["second"] : [])].map((h) => [h, KNOB[h]]);
      const nearest = hands.sort(
        (x, y) =>
          M.distance(p, pos(a[x[0]], x[1])) - M.distance(p, pos(a[y[0]], y[1])),
      )[0];
      if (M.distance(p, pos(a[nearest[0]], nearest[1])) > 65) return false;
      app.begin();
      return { hand: nearest[0], angle: angle(p), total: app.state.seconds };
    },
    move(p, d) {
      const next = angle(p);
      d.total +=
        C.delta(d.angle, next) *
        { hour: 120, minute: 10, second: 1 / 6 }[d.hand];
      d.angle = next;
      app.preview((s) => {
        const unit = s.secondsHand ? 1 : 60;
        s.seconds = M.mod(Math.round(d.total / unit) * unit, C.DAY);
      });
    },
    end() {
      app.end();
    },
    cancel() {
      app.abort();
    },
  });
  U.bind("stage", "keydown", (e) => {
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      stop();
      app.commit(
        (s) =>
          (s.seconds = M.mod(
            s.seconds +
              (e.key === "ArrowLeft" ? -1 : 1) * (e.shiftKey ? 3600 : 60),
            C.DAY,
          )),
      );
    }
  });
  app.start();
})();
