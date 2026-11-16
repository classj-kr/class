(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = CuisenaireRods,
    $ = U.$;

  let hitboxes = [];
  let animFrame = 0;
  let animState = null;

  function chooseTickStep(maxScale, gcd) {
    if (gcd > 1 && maxScale / gcd <= 18) return gcd;
    const raw = maxScale / 12;
    const nice = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000];
    return nice.find((s) => s >= raw) || Math.ceil(raw);
  }

  function computeTargetScale(s, info) {
    const maxUnit = Math.max(...s.rows.map((r) => r.unit));
    const maxWithGhost = Math.max(
      ...s.rows.map((r) => r.unit * (r.count + 1)),
      maxUnit * 3,
    );
    // Keep a stable scale horizon up to the first LCM when reachable so rods don't rescale on every click
    const baseHorizon = info.canAutoMatch
      ? Math.max(info.lcm + maxUnit, maxUnit * 3)
      : maxUnit * 4;
    const needed = Math.max(maxWithGhost, baseHorizon);
    return Math.ceil(needed * 1.05);
  }

  function drawStage(s, info, view) {
    hitboxes = [];
    const maxScale = view.scale;
    const targetScale = view.targetScale;
    const stageH = view.stageH;

    const trackLeft = 126;
    const trackRight = 996;
    const trackW = trackRight - trackLeft;
    const xOf = (val) => trackLeft + (val / maxScale) * trackW;

    const rowStartY = 104;
    const rowGap = 92;
    const rodH = 52;
    $("stage").setAttribute("viewBox", `0 0 1040 ${Number(stageH.toFixed(1))}`);

    let svg = `<rect x="14" y="12" width="1012" height="${Number((stageH - 24).toFixed(1))}" rx="20" class="paper"/>`;

    // Ruler at top
    const rulerY = 64;
    svg += U.line(
      trackLeft,
      rulerY,
      trackRight,
      rulerY,
      'stroke="#6b8478" stroke-width="2.5"',
    );
    const step = chooseTickStep(Math.round(targetScale), info.gcd);
    const tickLimit = Math.ceil(Math.max(maxScale, targetScale));
    for (let v = 0; v <= tickLimit; v += step) {
      const px = xOf(v);
      if (px > trackRight + 1) break;
      const edgeFade = px > trackRight - 14 ? Math.max(0, (trackRight - px) / 14) : 1;
      const opacityAttr = edgeFade < 1 ? ` opacity="${edgeFade.toFixed(2)}"` : "";
      svg += U.line(
        px,
        rulerY - 8,
        px,
        rulerY + 8,
        `stroke="#6b8478" stroke-width="1.8"${opacityAttr}`,
      );
      if (s.showNumbers) {
        svg += U.text(
          px,
          rulerY - 22,
          String(v),
          `class="number" style="font-size:15px;fill:#526b60;font-weight:700"${opacityAttr}`,
        );
      }
    }

    // Draw each row of Cuisenaire rods
    s.rows.forEach((row, rowIndex) => {
      const cy = rowStartY + rowIndex * rowGap;
      const style = C.styleForRod(row.unit, rowIndex);
      const isSelected = s.selectedRow === rowIndex;
      const dispUnit = view.units[rowIndex] ?? row.unit;
      const dispCount = view.counts[rowIndex] ?? row.count;
      const rowAlpha = view.rowAlphas[rowIndex] ?? 1;
      const rowGroupOpen = rowAlpha < 0.999 ? `<g opacity="${rowAlpha.toFixed(2)}">` : "";
      const rowGroupClose = rowAlpha < 0.999 ? `</g>` : "";
      svg += rowGroupOpen;

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

      // Placed rods end-to-end (with smooth fractional extension/retraction on the trailing rod)
      const visualRodCount = Math.max(1, Math.ceil(dispCount - 1e-4));
      for (let i = 0; i < visualRodCount; i++) {
        const frac = M.clamp(dispCount - i, 0, 1);
        if (frac <= 0.005) continue;
        const startVal = i * dispUnit;
        const endVal = (i + frac) * dispUnit;
        const rx = xOf(startVal);
        const rw = Math.max(4, xOf(endVal) - rx);
        const rodOpacity = frac < 1 ? (0.35 + 0.65 * frac).toFixed(2) : "1";
        const opAttr = frac < 1 ? ` opacity="${rodOpacity}"` : "";

        // Rod body with subtle 3D bottom bevel
        svg += `<rect x="${rx + 1}" y="${cy + 2}" width="${Math.max(2, rw - 2)}" height="${rodH - 4}" rx="8" fill="${style.fill}" stroke="${style.stroke}" stroke-width="2"${opAttr}/>`;
        if (rw > 8) {
          svg += `<rect x="${rx + 3}" y="${cy + rodH - 10}" width="${Math.max(2, rw - 6)}" height="6" rx="3" fill="#000000" fill-opacity="${(0.12 * Number(rodOpacity)).toFixed(3)}"/>`;
        }

        if (s.showNumbers && rw >= 30 && frac > 0.65) {
          svg += U.text(
            rx + rw / 2,
            cy + rodH / 2 - 1,
            String(row.unit),
            `class="number" style="font-size:${rw < 44 ? 15 : 19}px;font-weight:800;fill:${style.text}"${opAttr}`,
          );
        }

        // Cumulative length number below the right seam of each rod
        const seamVal = (i + 1) * row.unit;
        if (s.showNumbers && i < row.count && frac > 0.55) {
          const isMatch = info.matches.includes(seamVal);
          svg += U.text(
            rx + rw,
            cy + rodH + 18,
            String(seamVal),
            `class="number" style="font-size:${isMatch ? 16 : 14}px;font-weight:${isMatch ? 800 : 700};fill:${isMatch ? "#b86b00" : "#566f64"}"${opAttr}`,
          );
        }
      }

      // Hitboxes use target positions so rapid clicks work immediately without waiting for animation
      for (let i = 0; i < row.count; i++) {
        const rx = xOf(i * dispUnit);
        const rw = Math.max(8, xOf((i + 1) * dispUnit) - rx);
        hitboxes.push({
          x: rx,
          y: cy,
          w: rw,
          h: rodH,
          action: i === row.count - 1 && row.count > 1 ? "remove" : "select",
          rowIndex,
        });
      }

      // Ghost "+ rod" button right at the end of the train so kids can click directly on the track
      if (row.count < C.MAX_COUNT) {
        const gx = xOf(dispCount * dispUnit);
        const gw = Math.max(48, Math.min(xOf((dispCount + 1) * dispUnit) - gx, trackRight - gx));
        if (gw >= 36 && gx < trackRight - 24) {
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
      svg += rowGroupClose;
    });

    // Draw vertical alignment lines & badges for all reached Common Multiples!
    info.matches.forEach((m, idx) => {
      const mx = xOf(m);
      const isLcm = idx === 0;
      const lineColor = isLcm ? "#d98200" : "#2c8979";
      const badgeW = isLcm ? 128 : 98;
      const topY = rulerY - 6;
      const bottomY = rowStartY + (s.rows.length - 1) * rowGap + rodH + 6;
      const lag = Math.max(
        0,
        ...s.rows.map((r, ri) => (m - (view.counts[ri] ?? r.count) * (view.units[ri] ?? r.unit)) / Math.max(1, r.unit)),
      );
      const matchAlpha = M.clamp(1 - lag * 1.1, 0, 1);
      if (matchAlpha <= 0.02) return;
      const opAttr = matchAlpha < 0.99 ? ` opacity="${matchAlpha.toFixed(2)}"` : "";

      svg += `<g${opAttr}>`;
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
      svg += `</g>`;
    });

    $("stage").innerHTML = svg;
  }

  function render(s) {
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

    const targetScale = computeTargetScale(s, info);
    const rowStartY = 104;
    const rowGap = 92;
    const targetStageH = rowStartY + s.rows.length * rowGap + 56;
    const targetUnits = s.rows.map((r) => r.unit);
    const targetCounts = s.rows.map((r) => r.count);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    cancelAnimationFrame(animFrame);
    if (!animState || reduced) {
      animState = {
        scale: targetScale,
        targetScale,
        stageH: targetStageH,
        units: [...targetUnits],
        counts: [...targetCounts],
        rowAlphas: s.rows.map(() => 1),
      };
      drawStage(s, info, animState);
    } else {
      const fromScale = animState.scale;
      const fromStageH = animState.stageH;
      const fromUnits = s.rows.map((r, i) => animState.units[i] ?? r.unit);
      const fromCounts = s.rows.map((r, i) =>
        animState.counts[i] !== undefined ? animState.counts[i] : Math.max(0.25, r.count - 0.75),
      );
      const fromAlphas = s.rows.map((_, i) => (i < animState.rowAlphas.length ? animState.rowAlphas[i] : 0));
      const needsAnim =
        Math.abs(fromScale - targetScale) > 0.05 ||
        Math.abs(fromStageH - targetStageH) > 0.5 ||
        fromUnits.some((u, i) => Math.abs(u - targetUnits[i]) > 0.02) ||
        fromCounts.some((c, i) => Math.abs(c - targetCounts[i]) > 0.02) ||
        fromAlphas.some((a) => a < 0.99);

      if (!needsAnim) {
        animState = {
          scale: targetScale,
          targetScale,
          stageH: targetStageH,
          units: [...targetUnits],
          counts: [...targetCounts],
          rowAlphas: s.rows.map(() => 1),
        };
        drawStage(s, info, animState);
      } else {
        const start = performance.now();
        const duration = 260;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const ease = 1 - Math.pow(1 - t, 3);
          const lerp = (a, b) => (t < 1 ? a + (b - a) * ease : b);
          animState = {
            scale: lerp(fromScale, targetScale),
            targetScale,
            stageH: lerp(fromStageH, targetStageH),
            units: targetUnits.map((u, i) => lerp(fromUnits[i], u)),
            counts: targetCounts.map((c, i) => lerp(fromCounts[i], c)),
            rowAlphas: s.rows.map((_, i) => lerp(fromAlphas[i], 1)),
          };
          drawStage(s, info, animState);
          if (t < 1) animFrame = requestAnimationFrame(tick);
        };
        animFrame = requestAnimationFrame(tick);
      }
    }

    // Update per-row controls in-place so number inputs keep focus
    const rc = $("row-controls");
    while (rc.children.length > s.rows.length) rc.lastElementChild.remove();
    s.rows.forEach((row, i) => {
      const label = `${i + 1}번 줄`;
      const total = C.rowTotal(row);
      let box = rc.children[i];
      if (!box) {
        box = document.createElement("div");
        box.dataset.rowBox = String(i);
        box.innerHTML = `<span class="row-label" style="font-weight:800"></span><input type="number" min="1" max="999" data-unit-input="${i}" /><button type="button" data-count-delta="-1" data-row="${i}">−</button><span class="math row-math" style="min-width:74px;text-align:center;font-weight:700"></span><button type="button" class="primary" data-count-delta="1" data-row="${i}">＋ 막대</button>`;
        rc.append(box);
      }
      box.className = `row-box${s.selectedRow === i ? " is-selected" : ""}`;
      box.dataset.rowBox = String(i);
      box.querySelector(".row-label").textContent = label;
      const input = box.querySelector("[data-unit-input]");
      input.dataset.unitInput = String(i);
      input.setAttribute("aria-label", `${label} 막대 수`);
      if (document.activeElement !== input) input.value = String(row.unit);
      const minusBtn = box.querySelector('[data-count-delta="-1"]');
      minusBtn.dataset.row = String(i);
      minusBtn.setAttribute("aria-label", `${label} 막대 하나 빼기`);
      minusBtn.disabled = row.count <= 1;
      box.querySelector(".row-math").textContent = `×${row.count} = ${s.showNumbers ? total : "?"}`;
      const plusBtn = box.querySelector('[data-count-delta="1"]');
      plusBtn.dataset.row = String(i);
      plusBtn.setAttribute("aria-label", `${label} 막대 하나 더 놓기`);
      plusBtn.disabled = row.count >= C.MAX_COUNT;
    });

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
