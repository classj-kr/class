(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = GeometryTools,
    $ = U.$;
  let zoomed = matchMedia("(max-width:600px)").matches,
    viewportMode = "";
  function viewport(s = app.state) {
    viewportMode = s.mode;
    const box = zoomed
      ? s.mode === "angle"
        ? `${s.tool.x - 285} ${s.tool.y - 275} 570 430`
        : `${s.tool.x - 55} ${s.tool.y - 180} 720 400`
      : "0 0 1000 600";
    $("stage").setAttribute("viewBox", box);
    U.pressed("zoom", zoomed);
    $("zoom").textContent = zoomed ? "전체 보기" : "확대 보기";
  }
  function render(s) {
    if (viewportMode !== s.mode) viewport(s);
    U.value("mode", s.mode);
    U.value("tool-angle", s.tool.angle);
    $("rotation").textContent = `${Math.round(s.tool.angle)}°`;
    U.pressed("show", s.show);
    U.pressed("visible", s.visible);
    U.value("angle", s.angle);
    U.value("length", s.length);
    $("angle-control").hidden = !s.show || s.mode !== "angle";
    $("length-control").hidden = !s.show || s.mode !== "ruler";
    let svg = "";
    const pts = C.endpoints(s);
    svg += `<path d="${M.path(s.mode === "angle" ? [pts[1], pts[0], pts[2]] : pts, false)}" fill="none" stroke="#d47b52" stroke-width="5" stroke-linecap="round"/>`;
    if (s.mode === "angle")
      svg += `<path d="${M.arc(s.center.x, s.center.y, 58, s.base, s.base + s.angle)}" fill="none" stroke="#d47b52" stroke-width="2"/>`;
    if (s.visible) {
      svg += `<g transform="translate(${s.tool.x} ${s.tool.y}) rotate(${-s.tool.angle})">`;
      if (s.mode === "angle") {
        svg +=
          '<path d="M-240 0A240 240 0 0 1 240 0V55H-240Z" fill="#c0dfcf" fill-opacity=".45" stroke="#769b88" stroke-width="1.5"/>';
        for (let a = 0; a <= 180; a++) {
          const r = a % 10 === 0 ? 215 : a % 5 === 0 ? 223 : 232,
            p = M.circlePoint(0, 0, 240, a),
            q = M.circlePoint(0, 0, r, a);
          svg += U.line(
            p.x,
            p.y,
            q.x,
            q.y,
            'stroke="#567f6b" stroke-width="1"',
          );
          if (a % 10 === 0) {
            const t = M.circlePoint(0, 0, 199, a),
              v = M.circlePoint(0, 0, 171, a);
            if (a === 0 || a === 180) {
              t.y = -10;
              v.y = 18;
            }
            svg +=
              U.text(t.x, t.y, a, 'class="number" style="font-size:15px"') +
              U.text(
                v.x,
                v.y,
                180 - a,
                'class="number" style="font-size:14px;fill:#778d7c"',
              );
          }
        }
        svg +=
          U.line(-245, 0, 245, 0, 'stroke="#567f6b" stroke-width="2"') +
          U.line(0, -15, 0, 15, 'stroke="#567f6b" stroke-width="2"') +
          '<circle cx="0" cy="0" r="5" fill="#fffefa" stroke="#567f6b"/>';
      } else {
        svg +=
          '<rect x="-25" y="0" width="650" height="83" rx="9" fill="#c0dfcf" fill-opacity=".55" stroke="#769b88"/>';
        for (let mm = 0; mm <= 120; mm++) {
          const p = mm * 5;
          svg += U.line(
            p,
            0,
            p,
            mm % 10 === 0 ? 30 : mm % 5 === 0 ? 22 : 13,
            'stroke="#567f6b"',
          );
          if (mm % 10 === 0)
            svg += U.text(
              p,
              43,
              mm / 10,
              'class="number" style="font-size:19px"',
            );
        }
        svg += U.text(597, 69, "cm", 'style="font-size:15px"');
      }
      const gripX = s.mode === "ruler" ? 300 : 0,
        gripY = s.mode === "ruler" ? 57 : 29;
      svg += `<g transform="translate(${gripX} ${gripY})"><rect x="-28" width="56" height="22" rx="9" fill="#fffefa" stroke="#769b88"/><path d="M-13 8h26m-26 6h26" stroke="#769b88"/></g></g>`;
    }
    pts.forEach(
      (p, i) =>
        (svg += `<circle cx="${p.x}" cy="${p.y}" r="${i ? 11 : 9}" fill="${i ? "#d47b52" : "#315f50"}" stroke="#fffefa" stroke-width="3"/>`),
    );
    $("stage").innerHTML = svg;
    $("measurement").textContent = s.show
      ? s.mode === "angle"
        ? `${s.angle}°`
        : `${M.round(s.length / 10, 1)} cm = ${s.length} mm`
      : "";
  }
  const app = U.app({
    name: "geometry-tools",
    initial: C.initial,
    validate: C.validate,
    reset(s) { const mode = s.mode; Object.assign(s, M.copy(C.initial), {mode}); if (mode === "ruler") { s.center.x = 230; s.tool.x = 230; } },
    render,
  });
  U.bind("mode", "change", () =>
    app.commit((s) => {
      s.mode = $("mode").value;
      s.center = { x: s.mode === "ruler" ? 230 : 430, y: 340 };
      s.tool = { ...s.center, angle: 0 };
      s.base = 0;
    }),
  );
  U.bind("mode", "change", () => viewport());
  U.bind("zoom", "click", () => {
    zoomed = !zoomed;
    viewport();
  });
  for (const key of ["show", "visible"])
    U.bind(key, "click", () => app.commit((s) => (s[key] = !s[key]), false));
  U.bind("align", "click", () =>
    app.commit((s) => (s.tool = { ...s.center, angle: s.base })),
  );
  U.bind("align", "click", () => viewport());
  U.bind("new", "click", () =>
    app.commit((s) => {
      s.angle = 15 + Math.floor(Math.random() * 31) * 5;
      s.length = 20 + Math.floor(Math.random() * 81);
      s.base = -25 + Math.floor(Math.random() * 11) * 5;
    }),
  );
  for (const key of ["angle", "length"])
    U.bind(key, "change", () =>
      app.commit((s) => (s[key] = Number($(key).value))),
    );
  U.bind("tool-angle", "input", () => {
    app.begin();
    app.preview((s) => (s.tool.angle = Number($("tool-angle").value)));
    app.end(false);
  });
  U.pointer($("stage"), {
    start(p) {
      const s = app.state,
        points = C.endpoints(s),
        index = points.findIndex((v) => M.distance(p, v) < 24);
      app.begin();
      if (index >= 0)
        return {
          kind: "point",
          index,
          offset: { x: p.x - s.center.x, y: p.y - s.center.y },
        };
      const local = C.local(p, s.tool);
      if (
        s.visible &&
        ((s.mode === "angle" &&
          local.y >= 0 &&
          local.y <= 58 &&
          Math.abs(local.x) < 240) ||
          (s.mode === "ruler" &&
            local.y >= 0 &&
            local.y <= 83 &&
            local.x >= -25 &&
            local.x <= 625))
      )
        return {
          kind: "tool",
          offset: { x: p.x - s.tool.x, y: p.y - s.tool.y },
        };
      app.abort();
      return false;
    },
    move(p, d) {
      app.preview((s) => {
        if (d.kind === "tool") {
          s.tool.x = M.clamp(p.x - d.offset.x, 80, 920);
          s.tool.y = M.clamp(p.y - d.offset.y, 90, 510);
        } else if (d.index === 0) {
          s.center.x = M.clamp(p.x - d.offset.x, 80, 920);
          s.center.y = M.clamp(p.y - d.offset.y, 90, 510);
        } else {
          const a =
            (Math.atan2(s.center.y - p.y, p.x - s.center.x) * 180) / Math.PI;
          if (s.mode === "ruler") {
            s.length = M.clamp(
              Math.round(M.distance(p, s.center) / 5),
              10,
              120,
            );
            s.base = Math.round(a);
          } else if (d.index === 1) s.base = Math.round(a);
          else s.angle = Math.round(M.clamp(s.angle + M.mod(a - s.base - s.angle + 180, 360) - 180, 0, 180));
        }
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
    const d = {
      ArrowLeft: [-5, 0],
      ArrowRight: [5, 0],
      ArrowUp: [0, -5],
      ArrowDown: [0, 5],
    }[e.key];
    if (d) {
      e.preventDefault();
      app.commit((s) => {
        s.tool.x = M.clamp(s.tool.x + d[0], 80, 920);
        s.tool.y = M.clamp(s.tool.y + d[1], 90, 510);
      }, false);
    }
  });
  app.start();
  viewport();
  U.bind("reset", "click", () => viewport());
})();
