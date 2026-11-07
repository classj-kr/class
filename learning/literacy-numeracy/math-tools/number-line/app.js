(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = NumberLine,
    $ = U.$;
  let selected = "a";
  const x = (n, s) =>
    70 + (860 * (n / s.denominator - s.min)) / (s.max - s.min);
  const at = (p, s) =>
    Math.round(
      M.clamp((p.x - 70) / 860, 0, 1) * (s.max - s.min) * s.denominator +
        s.min * s.denominator,
    );
  function render(s) {
    U.value("mode", s.mode);
    U.value("range", `${s.min},${s.max}`);
    U.value("denominator", s.denominator);
    $("denominator").hidden = s.mode !== "fraction";
    U.value("a", C.label(s.a, s));
    U.value("b", C.label(s.b, s));
    U.pressed("labels", s.labels);
    $("repeat").disabled = !s.jumps.length;
    $("clear-jumps").disabled = !s.jumps.length;
    let svg =
      '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#658675"/></marker></defs>' +
      U.line(
        45,
        320,
        955,
        320,
        'stroke="#668472" stroke-width="2.5" marker-end="url(#arrow)"',
      );
    const total = (s.max - s.min) * s.denominator,
      minor = Math.max(1, Math.ceil(total / 80)),
      labelEvery = Math.max(
        1,
        Math.ceil(total / (matchMedia("(max-width:600px)").matches ? 8 : 16)),
      );
    for (let i = 0; i <= total; i += minor) {
      const n = s.min * s.denominator + i,
        px = x(n, s),
        whole = n % s.denominator === 0;
      svg += U.line(
        px,
        320 - (whole ? 12 : 7),
        px,
        332,
        'stroke="#668472" stroke-width="1.5"',
      );
      if (s.labels && (i % labelEvery === 0 || i === total))
        svg += U.text(px, 362, C.label(n, s), 'class="number" font-size="20"');
    }
    s.jumps.forEach((j, i) => {
      const a = x(j.from, s),
        b = x(j.to, s),
        height = 45 + (i % 3) * 27;
      svg += `<path d="M${a} 310 Q${(a + b) / 2} ${310 - height * 2} ${b} 310" fill="none" stroke="${M.colors[i % 6]}" stroke-width="3" marker-end="url(#arrow)"/>`;
      if (s.labels)
        svg += U.text(
          (a + b) / 2,
          303 - height,
          `${j.to >= j.from ? "+" : ""}${C.label(j.to - j.from, s)}`,
          'class="number" font-size="18"',
        );
    });
    for (const [key, color, y] of [
      ["a", M.colors[0], 405],
      ["b", M.colors[1], 445],
    ]) {
      const px = x(s[key], s);
      svg +=
        U.line(
          px,
          320,
          px,
          y - 14,
          `stroke="${color}" stroke-width="1.5" stroke-dasharray="4 4"`,
        ) +
        `<circle cx="${px}" cy="320" r="${matchMedia("(max-width:600px)").matches ? 20 : selected === key ? 13 : 10}" fill="${color}" stroke="#fffefa" stroke-width="3"/>` +
        U.text(
          px,
          y,
          `${key.toUpperCase()}${s.labels ? " = " + C.label(s[key], s) : ""}`,
          `style="fill:${color}" class="number"`,
        );
    }
    $("stage").innerHTML = svg;
    $("result").textContent = s.labels
      ? `${C.label(s.a, s)} ${s.b >= s.a ? "+" : "−"} ${C.label(Math.abs(s.b - s.a), s)} = ${C.label(s.b, s)}`
      : "";
  }
  const app = U.app({
    name: "number-line",
    initial: C.initial,
    validate: C.validate,
    render,
  });
  U.bind("mode", "change", () =>
    app.commit((s) => C.changeMode(s, $("mode").value)),
  );
  U.bind("range", "change", () =>
    app.commit((s) => {
      [s.min, s.max] = $("range").value.split(",").map(Number);
      s.a = M.clamp(s.a, s.min * s.denominator, s.max * s.denominator);
      s.b = M.clamp(s.b, s.min * s.denominator, s.max * s.denominator);
      s.jumps = [];
    }),
  );
  U.bind("denominator", "change", () =>
    app.commit((s) => {
      const d = Number($("denominator").value);
      s.a = Math.round((s.a * d) / s.denominator);
      s.b = Math.round((s.b * d) / s.denominator);
      s.denominator = d;
      s.jumps = [];
    }),
  );
  for (const key of ["a", "b"])
    U.bind(key, "change", () => {
      try {
        const n = C.parse($(key).value, app.state.denominator);
        app.commit((s) => {
          s[key] = n;
        });
      } catch (e) {
        app.notice(e.message);
        app.render();
      }
    });
  U.bind("labels", "click", () =>
    app.commit((s) => (s.labels = !s.labels), false),
  );
  U.bind("clear-jumps", "click", () => app.commit((s) => (s.jumps = [])));
  U.bind("jump", "click", () =>
    app.commit((s) => {
      if (s.a !== s.b) {
        s.jumps.push({ from: s.a, to: s.b });
        s.jumps = s.jumps.slice(-12);
      }
    }),
  );
  U.bind("repeat", "click", () => {
    const s = app.state,
      j = s.jumps.at(-1);
    if (!j) return;
    const to = j.to + j.to - j.from;
    if (to < s.min * s.denominator || to > s.max * s.denominator) {
      app.notice("수직선 범위를 넓혀 주세요.");
      return;
    }
    app.commit((s) => {
      s.a = j.to;
      s.b = to;
      s.jumps.push({ from: j.to, to });
      s.jumps = s.jumps.slice(-12);
    });
  });
  U.pointer($("stage"), {
    start(p) {
      const s = app.state;
      if (Math.abs(p.y - 320) > 100) return false;
      const da = Math.abs(p.x - x(s.a, s)),
        db = Math.abs(p.x - x(s.b, s));
      selected =
        da === db ? (selected === "a" ? "b" : "a") : da < db ? "a" : "b";
      app.begin();
      app.preview((s) => (s[selected] = at(p, s)));
      return selected;
    },
    move(p, key) {
      app.preview((s) => (s[key] = at(p, s)));
    },
    end() {
      app.end();
    },
    cancel() {
      app.abort();
    },
  });
  U.bind("stage", "keydown", (e) => {
    if (["a", "b"].includes(e.key.toLowerCase())) {
      selected = e.key.toLowerCase();
      app.render();
    }
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      app.commit(
        (s) =>
          (s[selected] = M.clamp(
            s[selected] + (e.key === "ArrowLeft" ? -1 : 1),
            s.min * s.denominator,
            s.max * s.denominator,
          )),
      );
    }
  });
  app.start();
})();
