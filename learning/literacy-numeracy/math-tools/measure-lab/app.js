(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = MeasureLab,
    $ = U.$;
  // 추는 무거울수록 크게. 100 g·500 g·1 kg (크기는 실제 비율이 아니라 구별용)
  const WEIGHT_SIZE = [
      { w: 44, h: 28, font: 12 },
      { w: 56, h: 40, font: 14 },
      { w: 66, h: 52, font: 16 },
    ],
    WEIGHT_LABEL = ["100 g", "500 g", "1 kg"];
  let tokens = [],
    dragToken = null,
    shownTilt = C.tilt(C.initial.left, C.initial.right),
    tiltFrame,
    previousTilt = shownTilt;
  const pan = (side, angle) => ({
    x: 500 + (side === "left" ? -245 : 245) * Math.cos((angle * Math.PI) / 180),
    y: 180 + (side === "left" ? -245 : 245) * Math.sin((angle * Math.PI) / 180),
  });
  function render(s) {
    U.value("mode", s.mode);
    U.value("capacity", s.capacity);
    U.value("amount", s.amount);
    U.pressed("values", s.values);
    $("mass-controls").hidden = s.mode !== "mass";
    $("volume-controls").hidden = s.mode !== "volume";
    for (const [id, i] of [
      ["water-a", 0],
      ["water-b", 1],
    ]) {
      $(id).max = s.capacity;
      U.value(id, s.water[i]);
    }
    let svg = "";
    tokens = [];
    if (s.mode === "mass") {
      const target = C.tilt(s.left, s.right);
      if (target !== previousTilt) {
        previousTilt = target;
        const from = shownTilt,
          start = performance.now();
        cancelAnimationFrame(tiltFrame);
        const animate = (now) => {
          const t = matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 1
            : Math.min(1, (now - start) / 450);
          shownTilt = from + (target - from) * (t * t * (3 - 2 * t));
          app.render();
          if (t < 1) tiltFrame = requestAnimationFrame(animate);
        };
        tiltFrame = requestAnimationFrame(animate);
      }
      svg =
        '<path d="M470 170 445 500h110l-25-330Z" fill="#b4bca9" stroke="#8a9b84"/><rect x="350" y="495" width="300" height="32" rx="15" fill="#7d9480"/>' +
        U.line(
          255,
          180,
          745,
          180,
          `stroke="#406d58" stroke-width="14" stroke-linecap="round" transform="rotate(${shownTilt} 500 180)"`,
        ) +
        '<circle cx="500" cy="180" r="16" fill="#f8f4df" stroke="#406d58" stroke-width="5"/>';
      for (const side of ["left", "right"]) {
        const p = pan(side, shownTilt),
          bottom = p.y + 215;
        svg += `<path d="M${p.x} ${p.y} ${p.x - 105} ${bottom}H${p.x + 105}Z" fill="none" stroke="#8a9b84" stroke-width="2"/><path d="M${p.x - 110} ${bottom}Q${p.x} ${bottom + 58} ${p.x + 110} ${bottom}Z" fill="#e3dfc9" stroke="#8a9b84" stroke-width="2"/>`;
        // 무거운 추부터 접시 바닥에 놓고, 한 줄이 차면 위 줄에 쌓는다.
        const pieces = [];
        for (const weight of [2, 1, 0])
          for (let k = 0; k < s[side][weight]; k++) pieces.push(weight);
        let rowX = 0, rowY = bottom - 2, rowH = 0;
        const rows = [[]];
        for (const weight of pieces) {
          const w = WEIGHT_SIZE[weight].w;
          if (rowX && rowX + w > 196) { rows.push([]); rowX = 0; }
          rows[rows.length - 1].push(weight);
          rowX += w + 4;
        }
        for (const row of rows) {
          const width = row.reduce((t, k) => t + WEIGHT_SIZE[k].w + 4, -4);
          let x = p.x - width / 2;
          rowH = Math.max(0, ...row.map((k) => WEIGHT_SIZE[k].h));
          for (const weight of row) {
            const { w, h } = WEIGHT_SIZE[weight],
              top = rowY - h,
              color = M.colors[weight];
            svg +=
              `<rect x="${x + w / 2 - 6}" y="${top - 7}" width="12" height="9" rx="3" fill="${color}" stroke="#fffefa" stroke-width="1.5"/>` +
              `<rect x="${x}" y="${top}" width="${w}" height="${h}" rx="6" fill="${color}" stroke="#fffefa" stroke-width="1.5"/>` +
              U.text(
                x + w / 2,
                top + h / 2 + 1,
                WEIGHT_LABEL[weight],
                `class="number weight-label" style="font-size:${WEIGHT_SIZE[weight].font}px;fill:white"`,
              );
            tokens.push({ side, weight, x: x + w / 2, y: top + h / 2, r: Math.max(w, h) / 2 + 4 });
            x += w + 4;
          }
          rowY -= rowH + 9;
        }
        svg += U.text(
          p.x,
          bottom + 82,
          side === "left" ? "왼쪽" : "오른쪽",
          'style="font-size:21px"',
        );
        if (s.values)
          svg += U.text(
            p.x,
            bottom + 115,
            C.grams(C.mass(s[side])),
            'class="number" style="font-size:25px"',
          );
      }
      if (dragToken)
        svg += `<circle cx="${dragToken.x}" cy="${dragToken.y}" r="${WEIGHT_SIZE[dragToken.weight].h / 2 + 4}" fill="${M.colors[dragToken.weight]}" stroke="#fffefa" stroke-width="3"/>`;
      const left = C.mass(s.left),
        right = C.mass(s.right);
      $("result").textContent = s.values
        ? `${left} g ${left === right ? "=" : left > right ? ">" : "<"} ${right} g`
        : "";
    } else {
      for (let i = 0; i < 2; i++) {
        const x = 220 + i * 370,
          waterY = 460 - (s.water[i] / s.capacity) * 340;
        svg += `<defs><clipPath id="vessel-${i}"><rect x="${x}" y="120" width="190" height="340"/></clipPath></defs><path d="M${x - 8} 105v355q0 14 14 14h178q14 0 14-14V105" fill="#e8f1ed" fill-opacity=".3" stroke="#6a9b94" stroke-width="4"/><g clip-path="url(#vessel-${i})"><rect x="${x}" y="${waterY}" width="190" height="${460 - waterY}" fill="${M.colors[i]}" fill-opacity=".5"/><path d="M${x} ${waterY}q45-7 95 0t95 0" fill="none" stroke="${M.colors[i]}" stroke-width="3"/></g>`;
        for (let n = 0; n <= s.capacity; n += 100) {
          const y = 460 - (n / s.capacity) * 340;
          svg += U.line(
            x + 150,
            y,
            x + 190,
            y,
            'stroke="#6a9b94" stroke-width="1.4"',
          );
          if (n % 500 === 0)
            svg += U.text(
              x + 135,
              y,
              n,
              'class="number" text-anchor="end" style="font-size:18px"',
            );
        }
        svg += U.text(x + 95, 510, i ? "B" : "A", 'style="font-size:26px"');
        if (s.values)
          svg += U.text(
            x + 95,
            550,
            C.liters(Math.round(s.water[i])),
            'class="number" style="font-size:25px"',
          );
      }
      $("result").textContent = s.values
        ? `${Math.round(s.water[0])} mL + ${Math.round(s.water[1])} mL = ${Math.round(s.water[0] + s.water[1])} mL`
        : "";
    }
    $("stage").innerHTML = svg;
  }
  const app = U.app({
    name: "measure-lab",
    initial: C.initial,
    validate: C.validate,
    reset(s) { if (s.mode === "mass") { s.left = M.copy(C.initial.left); s.right = M.copy(C.initial.right); } else { s.water = M.copy(C.initial.water); s.capacity = C.initial.capacity; s.amount = C.initial.amount; } },
    render,
  });
  U.bind("mode", "change", () => app.commit((s) => (s.mode = $("mode").value)));
  U.bind("values", "click", () =>
    app.commit((s) => (s.values = !s.values), false),
  );
  document
    .querySelectorAll("[data-weight]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          app.commit((s) => s[$("side").value][Number(b.dataset.weight)]++)),
    );
  U.bind("remove", "click", () =>
    app.commit((s) => {
      const side = $("side").value,
        i = Number($("remove-weight").value);
      s[side][i] = Math.max(0, s[side][i] - 1);
    }),
  );
  U.bind("empty", "click", () =>
    app.commit((s) => (s[$("side").value] = [0, 0, 0])),
  );
  U.bind("capacity", "change", () => {
    const cap = Number($("capacity").value);
    if (app.state.water.some((n) => n > cap)) {
      app.notice("물을 줄인 뒤 작은 용기로 바꿔 주세요.");
      app.render();
      return;
    }
    app.commit((s) => (s.capacity = cap));
  });
  U.bind("amount", "change", () =>
    app.commit((s) => (s.amount = Number($("amount").value)), false),
  );
  for (const [id, i] of [
    ["water-a", 0],
    ["water-b", 1],
  ])
    U.bind(id, "input", () =>
      app.commit((s) => (s.water[i] = Number($(id).value)), false),
    );
  for (const [id, from] of [
    ["pour-right", 0],
    ["pour-left", 1],
  ])
    U.bind(id, "click", () => {
      app.end(false);
      const initial = [...app.state.water],
        target = C.pour(initial, from, app.state.amount, app.state.capacity);
      if (initial[from] === target[from]) {
        app.notice("옮길 물이나 빈 공간이 없어요.");
        return;
      }
      app.begin();
      app.animate(
        850,
        (t) => {
          const moved = Math.round((initial[from] - target[from]) * t);
          app.state.water = initial.map(
            (n, i) => n + (i === from ? -moved : moved),
          );
        },
        () => {
          app.state.water = target;
          app.end();
        },
      );
    });
  U.pointer($("stage"), {
    start(p) {
      if (app.state.mode === "mass") {
        const token = [...tokens].reverse().find((q) => M.distance(p, q) < q.r);
        if (!token) return false;
        dragToken = { ...token };
        app.begin();
        return { ...token };
      }
      const i = p.x < 500 ? 0 : 1;
      if (p.x < 190 || p.x > 820 || p.y < 100 || p.y > 475) return false;
      app.begin();
      return { i };
    },
    move(p, d) {
      if (d.side) {
        dragToken = { ...d, x: p.x, y: p.y };
        app.render();
      } else
        app.preview(
          (s) =>
            (s.water[d.i] = M.clamp(
              Math.round((((460 - p.y) / 340) * s.capacity) / 50) * 50,
              0,
              s.capacity,
            )),
        );
    },
    end(p, d) {
      if (d.side) {
        const target = p.x < 500 ? "left" : "right";
        dragToken = null;
        if (target !== d.side && p.y > 180 && p.y < 500)
          app.preview((s) => {
            s[d.side][d.weight]--;
            s[target][d.weight]++;
          });
      }
      app.end();
    },
    cancel() {
      dragToken = null;
      app.abort();
    },
  });
  app.start();
})();
