(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = SolidNets,
    $ = U.$;
  function shade(color, light) {
    const n = parseInt(color.slice(1), 16),
      r = Math.round((n >> 16) * light),
      g = Math.round(((n >> 8) & 255) * light),
      b = Math.round((n & 255) * light);
    return `rgb(${r},${g},${b})`;
  }
  function render(s) {
    U.value("shape", s.shape);
    U.value("net", s.net);
    $("net").hidden = s.shape !== "cube";
    U.value("fold", Math.round((1 - s.fold) * 100));
    $("fold-controls").hidden = !C.canUnfold(s.shape);
    U.pressed("colors", s.colors);
    U.pressed("details", s.details);
    for (const k of ["width", "depth", "height", "radius"]) {
      U.value(k, s[k]);
      $(k + "-value").textContent = s[k];
    }
    const box = ["cube", "cuboid"].includes(s.shape);
    $("width-control").hidden = !box;
    $("width-label").textContent = s.shape === "cube" ? "모서리" : "가로";
    $("depth-control").hidden = s.shape !== "cuboid";
    $("height-control").hidden = ["cube", "sphere"].includes(s.shape);
    $("radius-control").hidden = box;
    $("radius-label").textContent =
      s.shape.startsWith("prism") || s.shape.startsWith("pyramid")
        ? "밑면 크기"
        : "반지름";
    const faces = C.project(C.mesh(s), s.yaw, s.pitch);
    $("stage").innerHTML = faces
      .map((f) => {
        const color = shade(M.colors[s.colors ? f.color % 6 : 0], f.light);
        return `<path d="${M.path(f.points)}" fill="${color}" stroke="${f.curved ? color : "#f9f7ed"}" stroke-width="${f.curved ? 0.6 : 1.6}" stroke-linejoin="round"/>`;
      })
      .join("");
    const p = C.properties(s);
    $("properties").textContent = s.details
      ? p.faces
        ? `면 ${p.faces} · 모서리 ${p.edges} · 꼭짓점 ${p.vertices}${p.area ? ` · 겉넓이 ${p.area} · 부피 ${p.volume}` : ""}`
        : s.shape === "cylinder"
          ? "밑면 2개 · 옆면은 굽은 면"
          : s.shape === "cone"
            ? "밑면 1개 · 꼭짓점 1개"
            : "굽은 면으로 둘러싸인 구"
      : "";
  }
  const app = U.app({
    name: "solid-nets",
    initial: C.initial,
    validate: C.validate,
    render,
  });
  C.NETS.forEach((_, i) => $("net").append(new Option(`전개도 ${i + 1}`, i)));
  U.bind("shape", "change", () =>
    app.commit((s) => {
      s.shape = $("shape").value;
      s.fold = 1;
    }),
  );
  U.bind("net", "change", () =>
    app.commit((s) => (s.net = Number($("net").value))),
  );
  for (const k of ["colors", "details"])
    U.bind(k, "click", () => app.commit((s) => (s[k] = !s[k]), false));
  for (const k of ["width", "depth", "height", "radius"])
    U.bind(k, "input", () =>
      app.commit((s) => (s[k] = Number($(k).value)), false),
    );
  U.bind("fold", "input", () =>
    app.commit((s) => (s.fold = 1 - Number($("fold").value) / 100), false),
  );
  function fold(to) {
    app.begin();
    const from = app.state.fold,
      yaw = app.state.yaw,
      pitch = app.state.pitch,
      targetYaw = to ? C.initial.yaw : 0,
      targetPitch = to
        ? C.initial.pitch
        : app.state.shape === "cylinder"
          ? 0
          : 1.4;
    app.animate(
      1600,
      (t) => {
        const ease = t * t * (3 - 2 * t);
        app.state.fold = from + (to - from) * ease;
        app.state.yaw = yaw + (targetYaw - yaw) * ease;
        app.state.pitch = pitch + (targetPitch - pitch) * ease;
      },
      () => app.end(),
    );
  }
  U.bind("solid", "click", () => fold(1));
  U.bind("unfold", "click", () => fold(0));
  U.bind("view", "click", () => {
    app.begin();
    const yaw = app.state.yaw,
      pitch = app.state.pitch;
    app.animate(
      700,
      (t) => {
        const ease = t * t * (3 - 2 * t);
        app.state.yaw = yaw + (C.initial.yaw - yaw) * ease;
        app.state.pitch = pitch + (C.initial.pitch - pitch) * ease;
      },
      () => app.end(false),
    );
  });
  U.pointer($("stage"), {
    start(p) {
      app.begin();
      return { p, yaw: app.state.yaw, pitch: app.state.pitch };
    },
    move(p, d) {
      app.preview((s) => {
        s.yaw =
          M.mod(d.yaw + (p.x - d.p.x) * 0.009 + Math.PI, Math.PI * 2) - Math.PI;
        s.pitch = M.clamp(d.pitch + (p.y - d.p.y) * 0.009, -1.4, 1.4);
      });
    },
    end() {
      app.end(false);
    },
    cancel() {
      app.abort();
    },
  });
  U.bind("stage", "keydown", (e) => {
    const d = {
      ArrowLeft: [-0.12, 0],
      ArrowRight: [0.12, 0],
      ArrowUp: [0, -0.12],
      ArrowDown: [0, 0.12],
    }[e.key];
    if (d) {
      e.preventDefault();
      app.commit((s) => {
        s.yaw = M.mod(s.yaw + d[0] + Math.PI, Math.PI * 2) - Math.PI;
        s.pitch = M.clamp(s.pitch + d[1], -1.4, 1.4);
      }, false);
    }
  });
  app.start();
})();
