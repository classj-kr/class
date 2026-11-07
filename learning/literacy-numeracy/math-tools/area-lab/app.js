(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = AreaLab,
    $ = U.$;
  let animating = false;
  function render(s) {
    U.value("shape", s.shape);
    U.value("sectors", s.sectors);
    U.value("progress", Math.round(s.progress * 100));
    for (const key of ["base", "height", "top", "offset", "radius"]) {
      U.value(key, s[key]);
      $(key + "-value").textContent = s.values ? s[key] : "";
    }
    U.pressed("grid", s.grid);
    U.pressed("values", s.values);
    const circle = s.shape === "circle";
    $("base-control").hidden = circle;
    $("height-control").hidden = circle;
    $("radius-control").hidden = !circle;
    $("sectors").hidden = !circle;
    $("top-control").hidden = s.shape !== "trapezoid";
    $("offset-control").hidden = !["triangle", "parallelogram"].includes(
      s.shape,
    );
    $("base-label").textContent =
      s.shape === "rhombus" ? "가로 대각선" : "밑변";
    $("height-label").textContent =
      s.shape === "rhombus" ? "세로 대각선" : "높이";
    $("offset").min = s.shape === "triangle" ? -3 : 0;
    $("offset").max = s.shape === "triangle" ? 13 : s.base;
    $("transform").disabled = animating;
    const box = C.bounds(s),
      scale = Math.min(
        65,
        820 / (box.maxX - box.minX + 1),
        440 / (box.maxY - box.minY + 1),
      );
    const origin = {
      x: 500 - ((box.minX + box.maxX) * scale) / 2,
      y: 275 - ((box.minY + box.maxY) * scale) / 2,
    };
    let svg = "";
    if (s.grid) {
      for (let x = origin.x % scale; x < 1000; x += scale)
        svg += U.line(x, 30, x, 500, 'class="grid"');
      for (let y = origin.y % scale; y < 520; y += scale)
        svg += U.line(40, y, 960, y, 'class="grid"');
    }
    svg += `<g transform="translate(${origin.x} ${origin.y}) scale(${scale})">`;
    C.pieces(s).forEach((part, i) => {
      const color = M.colors[i % 6];
      if (part.sector) {
        const alpha = part.alpha,
          r = part.r,
          a = { x: -r * Math.sin(alpha), y: r * Math.cos(alpha) },
          b = { x: r * Math.sin(alpha), y: r * Math.cos(alpha) };
        let turn = M.mod(part.endAngle - part.startAngle + 180, 360) - 180;
        const angle = part.startAngle + turn * s.progress;
        svg += `<path d="M0 0L${a.x} ${a.y}A${r} ${r} 0 0 0 ${b.x} ${b.y}Z" transform="translate(${part.dx * s.progress} ${part.dy * s.progress}) rotate(${angle})" fill="${i % 2 ? M.colors[1] : M.colors[0]}" fill-opacity=".8" stroke="#fffefa" stroke-width="${0.9 / scale}"/>`;
      } else
        svg += `<path d="${M.path(C.transformed(part, s.progress))}" fill="${color}" fill-opacity="${part.duplicate ? 0.65 * s.progress : 0.8}" stroke="#fffefa" stroke-width="${1.8 / scale}" stroke-linejoin="round"/>`;
    });
    if (s.values && !circle && s.progress < 0.03) {
      const bx =
        s.shape === "triangle"
          ? s.offset
          : s.shape === "parallelogram"
            ? M.clamp(s.offset, 0, s.base)
            : s.base / 2;
      svg += `<path d="M${bx} 0V${s.height}M${Math.min(0, bx)} ${s.height}H${s.base}" fill="none" stroke="#315f50" stroke-dasharray="${4 / scale} ${4 / scale}" stroke-width="${1.5 / scale}"/>`;
    }
    svg += "</g>";
    $("stage").innerHTML = svg;
    let formula = "";
    if (s.values) {
      if (circle) formula = `π × ${s.radius}² ≈ ${M.round(C.area(s), 2)}`;
      else if (s.shape === "trapezoid")
        formula = `(${s.top} + ${s.base}) × ${s.height} ÷ 2 = ${C.area(s)}`;
      else
        formula = `${s.base} × ${s.height}${["triangle", "rhombus"].includes(s.shape) ? " ÷ 2" : ""} = ${C.area(s)}`;
    }
    $("formula").textContent = formula;
    $("context").hidden =
      s.progress === 0 ||
      !["triangle", "trapezoid", "circle"].includes(s.shape);
    $("context").textContent = circle
      ? "조각이 많아질수록 직사각형에 가까워져요."
      : "같은 도형 2개 · 처음 넓이의 2배";
  }
  const app = U.app({
    name: "area-lab",
    initial: C.initial,
    validate: C.validate,
    render,
    stopped() {
      animating = false;
    },
  });
  function stop() {
    animating = false;
    app.stop();
    app.end(false);
  }
  U.bind("shape", "change", () => {
    stop();
    app.commit((s) => {
      s.shape = $("shape").value;
      s.progress = 0;
    });
  });
  for (const key of ["grid", "values"])
    U.bind(key, "click", () => {
      stop();
      app.commit((s) => (s[key] = !s[key]), false);
    });
  for (const key of ["base", "height", "top", "offset", "radius", "sectors"])
    U.bind(key, "input", () => {
      stop();
      app.commit((s) => {
        s[key] = Number($(key).value);
        if (s.shape === "parallelogram")
          s.offset = M.clamp(s.offset, 0, s.base);
        s.progress = 0;
      }, false);
    });
  U.bind("progress", "input", () => {
    stop();
    app.commit((s) => (s.progress = Number($("progress").value) / 100), false);
  });
  function animate(to) {
    stop();
    app.begin();
    const from = app.state.progress;
    animating = true;
    app.animate(
      1800,
      (t) => {
        app.state.progress = from + (to - from) * (t * t * (3 - 2 * t));
      },
      () => {
        animating = false;
        app.end(false);
      },
    );
  }
  U.bind("transform", "click", () =>
    animate(app.state.progress > 0.99 ? 0 : 1),
  );
  U.bind("original", "click", () => animate(0));
  app.start();
})();
