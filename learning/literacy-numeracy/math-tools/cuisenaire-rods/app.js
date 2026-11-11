(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = CuisenaireRods,
    $ = U.$;

  let hitboxes = [];

  function chooseTickStep(maxScale, gcd) {
    if (gcd > 1 && maxScale / gcd <= 18) return gcd;
    const raw = maxScale / 12;
    const nice = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000];
    return nice.find((s) => s >= raw) || Math.ceil(raw);
  }

  function render(s) {
    hitboxes = [];
    const info = C.analysis(s);
    U.pressed("labels", s.showNumbers);
    U.pressed("toggle-third-row", s.rows.length === 3);
    $("toggle-third-row").textContent =
      s.rows.length === 3 ? "2줄로 줄이기" : "3줄 비교";

    // Sync preset select
    const matchedPreset = Object.entries(C.PRESETS).find(
      ([, p]) =>
        p.rows.length === s.rows.length &&
        p.rows.every((r, i) => r.unit === s.rows[i].unit),
    );
    $("preset").value = matchedPreset ? matchedPreset[0] : "";

    // Calculate horizontal scale so current rods + 1 ghost rod fit comfortably
    const maxWithGhost = Math.max(
      ...s.rows.map((r) => r.unit * (r.count + 1)),
      s.rows[0].unit * 2,
    );
    const maxScale = Math.ceil(maxWithGhost * 1.06);

    const trackLeft = 126;
    const trackRight = 996;
    const trackW = trackRight - trackLeft;
    const xOf = (val) => trackLeft + (val / maxScale) * trackW;

    const rowStartY = 104;
    const rowGap = 92;
    const rodH = 52;
    const stageH = rowStartY + s.rows.length * rowGap + 56;
    $("stage").setAttribute("viewBox", `0 0 1040 ${stageH}`);

    let svg = `<rect x="14" y="12" width="1012" height="${stageH - 24}" rx="20" class="paper"/>`;

    // Ruler at top
    const rulerY = 64;
    svg += U.line(
      trackLeft,
      rulerY,
      trackRight,
      rulerY,
      'stroke="#6b8478" stroke-width="2.5"',
    );
    const step = chooseTickStep(maxScale, info.gcd);
    for (let v = 0; v <= maxScale; v += step) {
      const px = xOf(v);
      svg += U.line(
        px,
        rulerY - 8,
        px,
        rulerY + 8,
        'stroke="#6b8478" stroke-width="1.8"',
      );
      if (s.showNumbers) {
        svg += U.text(
          px,
          rulerY - 22,
          String(v),
          'class="number" style="font-size:15px;fill:#526b60;font-weight:700"',
        );
      }
    }

    // Draw each row of Cuisenaire rods
    s.rows.forEach((row, rowIndex) => {
      const cy = rowStartY + rowIndex * rowGap;
      const style = C.styleForRod(row.unit, rowIndex);
      const isSelected = s.selectedRow === rowIndex;

      // Left row badge
      svg += `<rect x="26" y="${cy}" width="86" height="${rodH}" rx="12" fill="${isSelected ? "#e3efe8" : "#f3f1e9"}" stroke="${isSelected ? "#305f50" : "#cfd8ce"}" stroke-width="${isSelected ? 2.5 : 1.5}"/>`;
      svg += U.text(
        69,
        cy + rodH / 2,
        `${row.unit} 막대`,
        'style="font-size:17px;font-weight:800;fill:#243b33"',
      );
      hitboxes.push({
        x: 26,
        y: cy,
        w: 86,
        h: rodH,
        action: "select",
        rowIndex,
      });

      // Faint guide track
      svg += `<rect x="${trackLeft}" y="${cy}" width="${trackW}" height="${rodH}" rx="10" fill="#f5f3eb" stroke="#e3e7de" stroke-width="1"/>`;

      // Placed rods end-to-end
      for (let i = 0; i < row.count; i++) {
        const startVal = i * row.unit;
        const endVal = (i + 1) * row.unit;
        const rx = xOf(startVal);
        const rw = Math.max(8, xOf(endVal) - rx);

        // Rod body with subtle 3D bottom bevel
        svg += `<rect x="${rx + 1}" y="${cy + 2}" width="${rw - 2}" height="${rodH - 4}" rx="8" fill="${style.fill}" stroke="${style.stroke}" stroke-width="2"/>`;
        svg += `<rect x="${rx + 3}" y="${cy + rodH - 10}" width="${Math.max(4, rw - 6)}" height="6" rx="3" fill="#000000" fill-opacity="0.12"/>`;

        if (s.showNumbers && rw >= 30) {
          svg += U.text(
            rx + rw / 2,
            cy + rodH / 2 - 1,
            String(row.unit),
            `class="number" style="font-size:${rw < 44 ? 15 : 19}px;font-weight:800;fill:${style.text}"`,
          );
        }

        // Cumulative length number below the right seam of each rod
        if (s.showNumbers) {
          const isMatch = info.matches.includes(endVal);
          svg += U.text(
            rx + rw,
            cy + rodH + 18,
            String(endVal),
            `class="number" style="font-size:${isMatch ? 16 : 14}px;font-weight:${isMatch ? 800 : 700};fill:${isMatch ? "#b86b00" : "#566f64"}"`,
          );
        }

        // Clicking the last rod removes it (if count > 1)
        if (i === row.count - 1) {
          hitboxes.push({
            x: rx,
            y: cy,
            w: rw,
            h: rodH,
            action: row.count > 1 ? "remove" : "select",
            rowIndex,
          });
        } else {
          hitboxes.push({
            x: rx,
            y: cy,
            w: rw,
            h: rodH,
            action: "select",
            rowIndex,
          });
        }
      }

      // Ghost "+ rod" button right at the end of the train so kids can click directly on the track
      if (row.count < C.MAX_COUNT) {
        const gx = xOf(row.count * row.unit);
        const gw = Math.max(48, Math.min(xOf((row.count + 1) * row.unit) - gx, trackRight - gx));
        if (gw >= 36) {
          svg += `<rect x="${gx + 2}" y="${cy + 3}" width="${gw - 4}" height="${rodH - 6}" rx="8" fill="#ffffff" fill-opacity="0.75" stroke="${style.stroke}" stroke-width="2" stroke-dasharray="6 4"/>`;
          svg += U.text(
            gx + gw / 2,
            cy + rodH / 2,
            `+${row.unit}`,
            `class="number" style="font-size:16px;font-weight:800;fill:${style.stroke}"`,
          );
          hitboxes.push({
            x: gx,
            y: cy,
            w: gw,
            h: rodH,
            action: "add",
            rowIndex,
          });
        }
      }
    });

    // Draw vertical alignment lines & badges for all reached Common Multiples!
    info.matches.forEach((m, idx) => {
      const mx = xOf(m);
      const isLcm = idx === 0;
      const lineColor = isLcm ? "#d98200" : "#2c8979";
      const badgeW = isLcm ? 128 : 98;
      const topY = rulerY - 6;
      const bottomY = rowStartY + (s.rows.length - 1) * rowGap + rodH + 6;

      svg += U.line(
        mx,
        topY,
        mx,
        bottomY,
        `stroke="${lineColor}" stroke-width="3.5" stroke-dasharray="${isLcm ? "none" : "7 5"}"`,
      );
      svg += `<circle cx="${mx}" cy="${rulerY}" r="6" fill="${lineColor}" stroke="#fffefa" stroke-width="2"/>`;

      const bx = M.clamp(mx - badgeW / 2, trackLeft, trackRight - badgeW);
      const by = bottomY + 18;
      svg += `<rect x="${bx}" y="${by}" width="${badgeW}" height="30" rx="15" fill="${isLcm ? "#fff0b3" : "#dff3ea"}" stroke="${lineColor}" stroke-width="2"/>`;
      svg += U.text(
        bx + badgeW / 2,
        by + 15,
        isLcm ? `★ 최소공배수 ${m}` : `공배수 ${m}`,
        `style="font-size:14px;font-weight:800;fill:${isLcm ? "#7c4600" : "#18594a"}"`,
      );
    });

    $("stage").innerHTML = svg;

    // Render simple per-row controls
    $("row-controls").innerHTML = s.rows
      .map((row, i) => {
        const label = `${i + 1}번 줄`;
        const total = C.rowTotal(row);
        return `
        <div class="row-box ${s.selectedRow === i ? "is-selected" : ""}" data-row-box="${i}">
          <span style="font-weight:800">${label}</span>
          <input type="number" min="1" max="999" value="${row.unit}" data-unit-input="${i}" aria-label="${label} 막대 수" />
          <button type="button" data-count-delta="-1" data-row="${i}" aria-label="${label} 막대 하나 빼기" ${row.count <= 1 ? "disabled" : ""}>−</button>
          <span class="math" style="min-width:74px;text-align:center;font-weight:700">×${row.count} = ${s.showNumbers ? total : "?"}</span>
          <button type="button" class="primary" data-count-delta="1" data-row="${i}" aria-label="${label} 막대 하나 더 놓기" ${row.count >= C.MAX_COUNT ? "disabled" : ""}>＋ 막대</button>
        </div>`;
      })
      .join("");

    // Render 1..10 Cuisenaire color swatches
    const activeUnit = s.rows[s.selectedRow].unit;
    $("palette").innerHTML =
      `<span class="control" style="font-weight:700">기본 막대(1~10):</span>` +
      Array.from({ length: 10 }, (_, idx) => {
        const u = idx + 1;
        const st = C.ROD_PALETTE[u];
        return `<button type="button" class="rod-swatch" data-swatch="${u}" aria-pressed="${activeUnit === u}" style="--fill:${st.fill};--stroke:${st.stroke};--text:${st.text}" title="${u} 막대 (${st.name})">${u}</button>`;
      }).join("");

    // Single clear status message at bottom
    if (info.allEqual) {
      const m = info.totals[0];
      const isLcm = m === info.lcm;
      const expr = s.rows.map((r) => `${r.unit} × ${r.count} = ${m}`).join(",  ");
      $("result").innerHTML =
        `<b>🎉 길이가 ${m}에서 딱 맞았어요!</b> ` +
        `<span class="label">(${expr} → ${isLcm ? `<b>최소공배수 ${info.lcm}</b>` : `공배수 ${m}, 최소공배수는 ${info.lcm}`})</span>`;
    } else {
      const shortRow = s.rows[info.shortestRowIndex];
      $("result").innerHTML =
        `<span class="label">현재 막대 끝 위치:</span> ` +
        s.rows
          .map((r, i) => `${i + 1}번 줄(<b>${r.unit}</b>) = <b>${C.rowTotal(r)}</b>`)
          .join(" · ") +
        ` <span class="label">— 짧은 <b>${shortRow.unit} 막대</b> 줄에 막대를 더 이어 붙여 길이를 맞춰 보세요!</span>`;
    }
  }

  const app = U.app({
    name: "cuisenaire-rods",
    initial: C.initial,
    validate: C.validate,
    render,
  });

  U.bind("preset", "change", () => {
    const key = $("preset").value;
    if (!key) return;
    app.commit((s) => C.applyPreset(s, key));
  });

  U.bind("step-match", "click", () => {
    app.commit((s) => C.stepShortestRow(s));
  });

  U.bind("auto-match", "click", () => {
    app.commit((s) => C.matchToNextCommonMultiple(s));
  });

  U.bind("toggle-third-row", "click", () => {
    app.commit((s) => {
      if (s.rows.length === 3) C.removeRow(s, 2);
      else C.addRow(s, 8);
    });
  });

  U.bind("labels", "click", () => {
    app.commit((s) => {
      s.showNumbers = !s.showNumbers;
    }, false);
  });

  $("row-controls").addEventListener("click", (event) => {
    const deltaBtn = event.target.closest("[data-count-delta]");
    if (deltaBtn && !deltaBtn.disabled) {
      const rowIndex = Number(deltaBtn.dataset.row);
      const delta = Number(deltaBtn.dataset.countDelta);
      app.commit((s) => C.changeCount(s, rowIndex, delta));
      return;
    }
    const box = event.target.closest("[data-row-box]");
    if (box && !event.target.closest("input")) {
      const idx = Number(box.dataset.rowBox);
      if (app.state.selectedRow !== idx) {
        app.commit((s) => {
          s.selectedRow = idx;
        }, false);
      }
    }
  });

  $("row-controls").addEventListener("change", (event) => {
    const input = event.target.closest("[data-unit-input]");
    if (!input) return;
    const rowIndex = Number(input.dataset.unitInput);
    app.commit((s) => C.setRowUnit(s, rowIndex, input.value));
  });

  $("palette").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-swatch]");
    if (!btn) return;
    const unit = Number(btn.dataset.swatch);
    app.commit((s) => C.setRowUnit(s, s.selectedRow, unit));
  });

  U.pointer($("stage"), {
    start(p) {
      const hit = hitboxes.find(
        (b) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h,
      );
      if (!hit) return false;
      if (hit.action === "add") {
        app.commit((s) => C.changeCount(s, hit.rowIndex, 1));
      } else if (hit.action === "remove") {
        app.commit((s) => C.changeCount(s, hit.rowIndex, -1));
      } else if (hit.action === "select") {
        app.commit((s) => {
          s.selectedRow = hit.rowIndex;
        }, false);
      }
      return false;
    },
  });

  app.start();
})();
