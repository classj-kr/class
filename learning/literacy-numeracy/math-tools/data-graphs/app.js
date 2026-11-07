(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = DataGraphs,
    $ = U.$;
  let rowKey = "",
    selected = 0,
    plotAxis = null;
  const data = () => C.data(app.state);
  const percent = (v) =>
    Number.isInteger(M.round(v * 100, 8))
      ? `${Math.round(v * 100)}%`
      : `약 ${M.round(v * 100, 1)}%`;
  function render(s) {
    const d = C.data(s),
      rows = d.rows,
      sum = C.total(rows),
      shares = C.shares(rows),
      axis = plotAxis || C.axis(rows),
      n = rows.length;
    selected = M.clamp(selected, 0, n - 1);
    U.value("mode", s.mode);
    U.value("unit", d.unit);
    for (const k of ["values", "mean", "table"]) U.pressed(k, s[k]);
    $("mean").hidden = !["bar", "line"].includes(s.mode);
    $("data-panel").hidden = !s.table;
    $("data-controls").hidden = !s.table;
    $("add").disabled = n >= 8;
    const key = (s.mode === "line" ? "time" : "categories") + n;
    if (rowKey !== key) {
      rowKey = key;
      $("data-panel").replaceChildren(
        ...rows.map((r, i) => {
          const row = document.createElement("div");
          row.className = "data-row";
          row.style.setProperty("--color", M.colors[i % 6]);
          row.innerHTML = `<span class="dot"></span><input type="text" maxlength="16" aria-label="항목 ${i + 1} 이름"><input type="number" min="0" max="1000" aria-label="항목 ${i + 1} 값"><button aria-label="항목 ${i + 1} 삭제">×</button>`;
          const [label, value] = row.querySelectorAll("input");
          label.onchange = () =>
            app.commit(
              (s) => (C.data(s).rows[i].label = label.value.trim()),
              false,
            );
          value.onchange = () =>
            app.commit(
              (s) => (C.data(s).rows[i].value = Number(value.value)),
              false,
            );
          row.querySelector("button").onclick = () => {
            if (data().rows.length > 1)
              app.commit((s) => C.data(s).rows.splice(i, 1));
          };
          return row;
        }),
      );
    }
    [...$("data-panel").children].forEach((row, i) => {
      const inputs = row.querySelectorAll("input");
      inputs[0].value = rows[i].label;
      inputs[1].value = rows[i].value;
      row.querySelector("button").disabled = n === 1;
    });
    let svg = "",
      legend = [];
    const x = (i) => 120 + ((i + 0.5) * 780) / n,
      y = (value) => 470 - (value / axis.max) * 360;
    if (["bar", "line"].includes(s.mode)) {
      for (let v = 0; v <= axis.max; v += axis.step)
        svg +=
          U.line(100, y(v), 930, y(v), 'class="grid"') +
          U.text(74, y(v), v, 'class="number"');
      svg +=
        U.line(100, 105, 100, 470, 'stroke="#668472" stroke-width="2"') +
        U.line(100, 470, 930, 470, 'stroke="#668472" stroke-width="2"') +
        U.text(90, 70, d.unit, 'style="font-size:17px"');
      if (s.mode === "line")
        svg += `<path d="${M.path(
          rows.map((r, i) => ({ x: x(i), y: y(r.value) })),
          false,
        )}" stroke="${M.colors[0]}" fill="none" stroke-width="4"/>`;
      rows.forEach((r, i) => {
        const px = x(i),
          py = y(r.value);
        if (s.mode === "bar")
          svg += `<rect x="${px - 260 / n}" y="${py}" width="${520 / n}" height="${470 - py}" rx="4" fill="${M.colors[i % 6]}" fill-opacity=".8"/>`;
        else
          svg += `<circle cx="${px}" cy="${py}" r="10" fill="${M.colors[0]}" stroke="#fffefa" stroke-width="3"/>`;
        svg += U.text(px, 510, r.label, 'style="font-size:21px"');
        if (s.values)
          svg += U.text(
            px,
            py - 22,
            r.value,
            'class="number" style="font-size:23px"',
          );
      });
      if (s.mean) {
        const avg = C.mean(rows);
        svg +=
          U.line(
            100,
            y(avg),
            930,
            y(avg),
            'stroke="#b76742" stroke-width="2.5" stroke-dasharray="9 7"',
          ) +
          U.text(
            868,
            y(avg) - 19,
            `평균 ${M.round(avg, 2)}`,
            'style="font-size:19px;fill:#a85f3c"',
          );
      }
    } else if (s.mode === "picture") {
      const max = Math.max(...rows.map((r) => r.value)),
        unit = max <= 10 ? 1 : max <= 50 ? 5 : max <= 100 ? 10 : 100;
      rows.forEach((r, i) => {
        const y = 70 + (i * 450) / n;
        svg += U.text(130, y, r.label, 'style="font-size:23px"');
        for (let j = 0; j < Math.ceil(r.value / unit); j++) {
          const amount = M.clamp(r.value / unit - j, 0, 1),
            x = 250 + j * 58;
          svg += `<defs><clipPath id="pict-${i}-${j}"><rect x="${x - 17}" y="${y + 17 - amount * 34}" width="34" height="${amount * 34}"/></clipPath></defs><rect x="${x - 17}" y="${y - 17}" width="34" height="34" fill="#e3e8dc"/><rect x="${x - 17}" y="${y - 17}" width="34" height="34" fill="${M.colors[i % 6]}" clip-path="url(#pict-${i}-${j})"/>`;
        }
        if (s.values) svg += U.text(920, y, r.value, 'class="number"');
      });
      svg += U.text(
        500,
        550,
        `■ = ${unit} ${d.unit}`,
        'style="font-size:21px"',
      );
    } else if (s.mode === "strip") {
      let x = 90;
      svg +=
        '<rect x="90" y="220" width="820" height="110" rx="4" fill="#e6eade"/>';
      shares.forEach((share, i) => {
        const w = 820 * share;
        svg += `<rect x="${x}" y="220" width="${w}" height="110" fill="${M.colors[i % 6]}" stroke="#fffefa"/>`;
        if (s.values && share > 0.07)
          svg += U.text(
            x + w / 2,
            275,
            percent(share),
            'class="number" style="font-size:21px;fill:white"',
          );
        x += w;
      });
      for (let v = 0; v <= 100; v += 10)
        svg +=
          U.line(90 + 8.2 * v, 335, 90 + 8.2 * v, 348, 'stroke="#7f9583"') +
          U.text(
            90 + 8.2 * v,
            370,
            `${v}%`,
            'class="number" style="font-size:19px"',
          );
    } else {
      svg = '<circle cx="500" cy="285" r="205" fill="#e6eade"/>';
      let angle = 90;
      shares.forEach((share, i) => {
        if (!share) return;
        const end = angle - share * 360;
        svg +=
          share === 1
            ? `<circle cx="500" cy="285" r="205" fill="${M.colors[i % 6]}"/>`
            : `<path d="M500 285L${M.circlePoint(500, 285, 205, angle).x} ${M.circlePoint(500, 285, 205, angle).y}${M.arc(500, 285, 205, angle, end).replace(/^M[^A]*A/, "A")}Z" fill="${M.colors[i % 6]}" stroke="#fffefa" stroke-width="2"/>`;
        if (s.values && share > 0.06) {
          const p = M.circlePoint(500, 285, 135, (angle + end) / 2);
          svg += U.text(
            p.x,
            p.y,
            percent(share),
            'class="number" style="font-size:24px;fill:white"',
          );
        }
        angle = end;
      });
    }
    if (["pie", "strip"].includes(s.mode))
      legend = rows.map(
        (r, i) =>
          `<span><i style="background:${M.colors[i % 6]}"></i>${M.esc(r.label)}${s.values ? " · " + (sum ? percent(shares[i]) : "—") : ""}</span>`,
      );
    $("legend").innerHTML = legend.join("");
    $("stage").innerHTML = svg;
    $("summary").textContent = s.values
      ? `전체 ${sum} ${d.unit}${s.mean && ["bar", "line"].includes(s.mode) ? ` · 평균 ${Number.isInteger(C.mean(rows)) ? "" : "약 "}${M.round(C.mean(rows), 2)} ${d.unit}` : ""}`
      : "";
  }
  const app = U.app({
    name: "data-graphs",
    initial: C.initial,
    validate: C.validate,
    render,
  });
  U.bind("mode", "change", () => app.commit((s) => (s.mode = $("mode").value)));
  for (const key of ["values", "mean", "table"])
    U.bind(key, "click", () => app.commit((s) => (s[key] = !s[key]), false));
  U.bind("unit", "change", () =>
    app.commit((s) => (C.data(s).unit = $("unit").value.trim()), false),
  );
  U.bind("add", "click", () => {
    if (data().rows.length < 8)
      app.commit((s) =>
        C.data(s).rows.push({
          label: `항목 ${C.data(s).rows.length + 1}`,
          value: 0,
        }),
      );
  });
  U.pointer($("stage"), {
    start(p) {
      if (
        !["bar", "line"].includes(app.state.mode) ||
        p.x < 100 ||
        p.x > 930 ||
        p.y < 90 ||
        p.y > 485
      )
        return false;
      const n = data().rows.length,
        i = M.clamp(Math.floor(((p.x - 120) / 780) * n), 0, n - 1);
      selected = i;
      plotAxis = C.axis(data().rows);
      app.begin();
      return { i, axis: plotAxis };
    },
    move(p, d) {
      app.preview(
        (s) =>
          (C.data(s).rows[d.i].value = M.clamp(
            Math.round(((470 - p.y) / 360) * d.axis.max),
            0,
            1000,
          )),
      );
    },
    end() {
      plotAxis = null;
      app.end();
    },
    cancel() {
      plotAxis = null;
      app.abort();
    },
  });
  U.bind("stage", "keydown", (e) => {
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      selected = M.clamp(
        selected + (e.key === "ArrowRight" ? 1 : -1),
        0,
        data().rows.length - 1,
      );
    }
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      app.commit(
        (s) =>
          (C.data(s).rows[selected].value = M.clamp(
            C.data(s).rows[selected].value + (e.key === "ArrowUp" ? 1 : -1),
            0,
            1000,
          )),
      );
    }
  });
  app.start();
})();
