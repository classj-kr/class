(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = ProbabilityLab,
    $ = U.$;
  let busy = false,
    rotation = 0,
    flip = 1,
    display = null;
  const labels = (mode) =>
    mode === "coin"
      ? ["앞", "뒤"]
      : mode === "dice"
        ? ["1", "2", "3", "4", "5", "6"]
        : ["초록", "주황", "파랑", "보라"];
  function render(s) {
    const d = s.scenes[s.mode],
      names = labels(s.mode),
      total = d.counts.reduce((a, b) => a + b, 0),
      weightTotal = d.weights.reduce((a, b) => a + b, 0);
    U.value("mode", s.mode);
    U.pressed("theory", s.theory);
    $("weights").hidden = s.mode !== "spinner";
    for (const id of [
      "mode",
      "once",
      "ten",
      "hundred",
      "clear",
      "reset",
      "undo",
      "redo",
    ])
      $(id).disabled = busy;
    for (let i = 0; i < 4; i++) {
      U.value("weight-" + i, s.scenes.spinner.weights[i]);
      $("weight-" + i).disabled = busy;
    }
    const last = display ?? d.last;
    let svg = "";
    if (s.mode === "coin") {
      svg = `<g transform="translate(450 255) scale(${Math.max(0.06, Math.abs(flip))} 1)"><circle cy="8" r="157" fill="#b49c63"/><circle r="157" fill="#edd18e" stroke="#c3a66c" stroke-width="4"/><circle r="139" fill="none" stroke="#c3a66c" stroke-width="2" stroke-dasharray="3 5"/>${U.text(0, 0, last === null ? "앞 · 뒤" : names[last], 'style="font-size:57px;fill:#866b35"')}</g>`;
    } else if (s.mode === "dice") {
      svg =
        '<rect x="304" y="116" width="292" height="292" rx="43" fill="#d4d9cc"/><rect x="304" y="108" width="292" height="292" rx="43" fill="#fffdf4" stroke="#bdcbbc" stroke-width="3"/>';
      const n = last === null ? 1 : last + 1;
      const positions = {
        1: [[0, 0]],
        2: [
          [-1, -1],
          [1, 1],
        ],
        3: [
          [-1, -1],
          [0, 0],
          [1, 1],
        ],
        4: [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ],
        5: [
          [-1, -1],
          [1, -1],
          [0, 0],
          [-1, 1],
          [1, 1],
        ],
        6: [
          [-1, -1],
          [1, -1],
          [-1, 0],
          [1, 0],
          [-1, 1],
          [1, 1],
        ],
      }[n];
      for (const [x, y] of positions)
        svg += `<circle cx="${450 + x * 76}" cy="${254 + y * 76}" r="19" fill="#3b6150"/>`;
    } else {
      let a = 90;
      svg = `<g transform="rotate(${rotation} 450 255)">`;
      d.weights.forEach((w, i) => {
        const end = a - (w / weightTotal) * 360,
          p = M.circlePoint(450, 255, 204, a);
        svg += `<path d="M450 255L${p.x} ${p.y}${M.arc(450, 255, 204, a, end).replace(/^M[^A]*A/, "A")}Z" fill="${M.colors[i]}" stroke="#fffefa" stroke-width="3"/>`;
        const mid = M.circlePoint(450, 255, 140, (a + end) / 2);
        svg += U.text(
          mid.x,
          mid.y,
          names[i],
          'style="font-size:22px;fill:white"',
        );
        a = end;
      });
      svg +=
        '</g><path d="M431 32h38l-19 38Z" fill="#415f4e"/><circle cx="450" cy="255" r="17" fill="#fffefa" stroke="#415f4e" stroke-width="5"/>';
    }
    if (last !== null)
      svg += U.text(450, 490, names[last], 'style="font-size:30px"');
    $("stage").innerHTML = svg;
    $("frequency").innerHTML = names
      .map(
        (label, i) =>
          `<div><i style="background:${M.colors[i % 6]}"></i><span>${label}</span><strong>${d.counts[i]}</strong><span>${s.theory ? M.fractionText(d.weights[i], weightTotal) : total ? M.round((d.counts[i] / total) * 100, 1) + "%" : "0%"}</span></div>`,
      )
      .join("");
    $("total").textContent =
      `${total}번 실험${s.theory ? " · 도구의 가능성 표시" : ""}`;
  }
  const app = U.app({
    name: "probability-lab",
    initial: C.initial,
    validate: C.validate,
    render,
    locked: () => busy,
    stopped() {
      busy = false;
      display = null;
      flip = 1;
      rotation = 0;
    },
  });
  for (let i = 0; i < 4; i++) {
    const label = document.createElement("label");
    label.className = "weight";
    label.innerHTML = `<i style="background:${M.colors[i]}"></i><input id="weight-${i}" type="number" min="1" max="8" aria-label="${labels("spinner")[i]} 칸 수"><span>칸</span>`;
    label.querySelector("input").onchange = () => {
      if (busy) return;
      app.commit((s) => {
        const d = s.scenes.spinner;
        d.weights[i] = Number($("weight-" + i).value);
        d.counts = [0, 0, 0, 0];
        d.last = null;
      });
    };
    $("weights").append(label);
  }
  U.bind("mode", "change", () => {
    display = null;
    rotation = 0;
    flip = 1;
    app.commit((s) => (s.mode = $("mode").value));
  });
  U.bind("theory", "click", () => {
    if (!busy) app.commit((s) => (s.theory = !s.theory), false);
  });
  U.bind("clear", "click", () => {
    display = null;
    app.commit((s) => {
      const d = s.scenes[s.mode];
      d.counts = d.counts.map(() => 0);
      d.last = null;
    });
  });
  function experiment(n) {
    if (busy) return;
    let result;
    try {
      result = C.sample(app.state.scenes[app.state.mode], n);
    } catch (e) {
      app.notice(e.message);
      return;
    }
    busy = true;
    app.begin();
    const start = rotation,
      target = M.mod(-C.midAngle(result.weights, result.last), 360),
      travel = 1080 + M.mod(target - start, 360);
    app.animate(
      1000,
      (t) => {
        const ease = 1 - (1 - t) ** 3;
        rotation = start + travel * ease;
        flip = Math.cos(t * Math.PI * 8);
        display =
          t === 1 ? result.last : Math.floor(t * 30) % result.weights.length;
      },
      () => {
        display = null;
        rotation = M.mod(rotation, 360);
        flip = 1;
        busy = false;
        app.state.scenes[app.state.mode] = result;
        app.end();
      },
    );
  }
  for (const [id, n] of [
    ["once", 1],
    ["ten", 10],
    ["hundred", 100],
  ])
    U.bind(id, "click", () => experiment(n));
  app.start();
})();
