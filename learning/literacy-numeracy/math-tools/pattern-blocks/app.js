(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = PatternBlocks,
    $ = U.$;
  const names = {
    triangle: "정삼각형",
    square: "정사각형",
    rhombus: "마름모",
    thin: "가느다란 마름모",
    trapezoid: "사다리꼴",
    hexagon: "정육각형",
  };
  let selected = "";
  const rows = () => app.state.scenes[app.state.mode],
    current = () => rows().find((p) => p.id === selected);
  let selectionKey = "";
  function render(s) {
    const pieces = s.scenes[s.mode];
    if (!pieces.some((p) => p.id === selected)) selected = "";
    U.value("mode", s.mode);
    for (const key of ["grid", "snap", "axis", "outline"])
      U.pressed(key, s[key]);
    $("palette").hidden = s.mode === "tangram";
    $("outline").hidden = s.mode !== "tangram";
    for (const id of ["copy", "mirror", "remove"])
      $(id).disabled = !selected || s.mode === "tangram";
    for (const id of ["left", "right", "flip"]) $(id).disabled = !selected;
    const key = s.mode + pieces.map((p) => p.id).join(",");
    if (key !== selectionKey) {
      selectionKey = key;
      $("selection").replaceChildren(
        new Option("조각 선택", ""),
        ...pieces.map(
          (p, i) =>
            new Option(`${i + 1} · ${names[p.type] || "칠교 조각"}`, p.id),
        ),
      );
    }
    U.value("selection", selected);
    let svg = "";
    if (s.grid)
      for (let x = 0; x <= 1000; x += 25)
        svg += U.line(x, 0, x, 600, 'class="grid"');
    if (s.grid)
      for (let y = 0; y <= 600; y += 25)
        svg += U.line(0, y, 1000, y, 'class="grid"');
    if (s.axis)
      svg += U.line(500, 10, 500, 590, 'class="guide" stroke-width="2"');
    if (s.mode === "tangram" && s.outline)
      svg +=
        '<rect x="404" y="204" width="192" height="192" fill="#e9eddf" stroke="#a3b59b" stroke-width="2"/>';
    for (const p of pieces) {
      const points = C.points(p);
      svg += `<path d="${M.path(points)}" fill="${p.color}" fill-opacity=".78" stroke="${p.id === selected ? "#314d40" : "#fffefa"}" stroke-width="${p.id === selected ? 3 : 2}" stroke-linejoin="round"/>`;
      if (p.id === selected && s.axis)
        svg += `<path d="${M.path(points.map((q) => ({ x: 1000 - q.x, y: q.y })))}" fill="${p.color}" fill-opacity=".12" stroke="${p.color}" stroke-width="2" stroke-dasharray="7 6"/>`;
    }
    $("stage").innerHTML = svg;
    $("colors")
      .querySelectorAll("button")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          pieces.find((p) => p.id === selected)?.color === b.dataset.color,
        ),
      );
  }
  const app = U.app({
    name: "pattern-blocks",
    initial: C.initial,
    validate: C.validate,
    render,
  });
  function change(fn) {
    if (current())
      app.commit((s) => {
        const p = s.scenes[s.mode].find((p) => p.id === selected);
        fn(p);
        C.constrain(p);
      });
  }
  function add(type) {
    if (rows().length >= 48) {
      app.notice("조각은 48개까지 놓을 수 있어요.");
      return;
    }
    selected = `p-${crypto.randomUUID()}`;
    app.commit((s) =>
      s.scenes.pattern.push(
        C.piece(
          selected,
          type,
          350 + (rows().length % 5) * 50,
          240 + (rows().length % 3) * 35,
        ),
      ),
    );
  }
  Object.entries(names).forEach(([type, name], i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.title = name;
    b.setAttribute("aria-label", name + " 놓기");
    b.dataset.shape = type;
    const p = { ...C.piece("preview", type, 0, 0), size: 15 };
    b.innerHTML = `<svg viewBox="-20 -18 40 36" aria-hidden="true"><path d="${M.path(C.points(p))}" fill="${M.colors[i % 6]}" stroke="#526951" stroke-width=".7"/></svg>`;
    b.onclick = () => add(type);
    $("palette").append(b);
  });
  M.colors.forEach((color, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.color = color;
    b.style.setProperty("--color", color);
    b.setAttribute(
      "aria-label",
      ["초록", "주황", "파랑", "보라", "노랑", "분홍"][i],
    );
    b.onclick = () => change((p) => (p.color = color));
    $("colors").append(b);
  });
  U.bind("mode", "change", () => {
    selected = "";
    app.commit((s) => (s.mode = $("mode").value));
  });
  for (const key of ["grid", "snap", "axis", "outline"])
    U.bind(key, "click", () => app.commit((s) => (s[key] = !s[key]), false));
  U.bind("selection", "change", () => {
    selected = $("selection").value;
    app.render();
  });
  for (const [id, d] of [
    ["left", -1],
    ["right", 1],
  ])
    U.bind(id, "click", () =>
      change(
        (p) =>
          (p.angle =
            M.mod(
              p.angle + d * (app.state.mode === "pattern" ? 15 : 45) + 180,
              360,
            ) - 180),
      ),
    );
  U.bind("flip", "click", () => change((p) => (p.flip = !p.flip)));
  U.bind("remove", "click", () => {
    if (app.state.mode === "pattern")
      app.commit(
        (s) =>
          (s.scenes.pattern = s.scenes.pattern.filter(
            (p) => p.id !== selected,
          )),
      );
  });
  for (const [id, mirror] of [
    ["copy", false],
    ["mirror", true],
  ])
    U.bind(id, "click", () => {
      const source = current();
      if (!source || app.state.mode === "tangram") return;
      if (rows().length >= 48) {
        app.notice("조각은 48개까지 놓을 수 있어요.");
        return;
      }
      const p = M.copy(source);
      p.id = `p-${crypto.randomUUID()}`;
      p.x = mirror ? 1000 - p.x : M.clamp(p.x + 30, 0, 1000);
      p.y = M.clamp(p.y + (mirror ? 0 : 30), 0, 600);
      if (mirror) {
        p.flip = !p.flip;
        p.angle = -p.angle;
      }
      C.constrain(p);
      selected = p.id;
      app.commit((s) => s.scenes.pattern.push(p));
    });
  U.pointer($("stage"), {
    start(p) {
      const found = [...rows()].reverse().find((q) => M.inside(p, C.points(q)));
      if (!found) {
        selected = "";
        app.render();
        return false;
      }
      selected = found.id;
      app.begin();
      const offset = { x: p.x - found.x, y: p.y - found.y };
      app.preview((s) => {
        const ps = s.scenes[s.mode],
          i = ps.findIndex((q) => q.id === selected);
        ps.push(ps.splice(i, 1)[0]);
      });
      return offset;
    },
    move(p, d) {
      app.preview((s) => {
        const q = s.scenes[s.mode].find((p) => p.id === selected);
        q.x = M.clamp(p.x - d.x, 40, 960);
        q.y = M.clamp(p.y - d.y, 40, 560);
        C.constrain(q);
      });
    },
    end() {
      if (app.state.snap)
        app.preview((s) => {
          const ps = s.scenes[s.mode],
            i = ps.findIndex((p) => p.id === selected);
          ps[i] = C.snap(
            ps[i],
            ps.filter((_, j) => j !== i),
          );
        });
      app.end();
    },
    cancel() {
      app.abort();
    },
  });
  U.bind("stage", "keydown", (e) => {
    const d = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }[e.key];
    if (d) {
      e.preventDefault();
      change((p) => {
        p.x = M.clamp(p.x + d[0] * (e.shiftKey ? 20 : 5), 0, 1000);
        p.y = M.clamp(p.y + d[1] * (e.shiftKey ? 20 : 5), 0, 600);
      });
    }
    if (e.key === "Delete") $("remove").click();
  });
  app.start();
})();
