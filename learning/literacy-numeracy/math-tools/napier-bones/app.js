(() => {
  "use strict";
  const M = ToolMath,
    U = ToolUI,
    C = NapierBones,
    $ = U.$;

  let hitboxes = [];

  function rodColor(index) {
    return M.colors[index % M.colors.length];
  }

  function renderLcmStage(s) {
    const info = C.commonMultiplesInfo(s.numbers, s.rows);
    const commonSet = new Set(info.commonInTable);
    const lcm = info.lcm;

    const indexW = 68;
    const gap = 24;
    const padX = 28;
    const headerH = 66;
    const rowH = s.rows > 12 ? 36 : 42;
    const padTop = 22;
    const padBottom = 30;

    // Calculate width of each number rod group based on digit count
    const groups = s.numbers.map((num, idx) => {
      const digits = C.digitsOf(num);
      const cellW = digits.length >= 3 ? 42 : digits.length === 2 ? 46 : 52;
      const badgeW = s.showMultiples ? 76 : 16;
      const boneAreaW = s.showDiagonals ? digits.length * cellW : 0;
      const w = Math.max(128, boneAreaW + badgeW + 24);
      return {
        num,
        idx,
        digits,
        cellW,
        boneAreaW,
        badgeW,
        w,
        color: rodColor(idx),
      };
    });

    const totalW = Math.max(
      960,
      padX * 2 +
        indexW +
        gap +
        groups.reduce((sum, g) => sum + g.w, 0) +
        gap * (groups.length - 1),
    );
    const totalH = padTop + headerH + s.rows * rowH + padBottom;
    $("stage").setAttribute("viewBox", `0 0 ${totalW} ${totalH}`);

    const startX =
      (totalW -
        (indexW +
          gap +
          groups.reduce((sum, g) => sum + g.w, 0) +
          gap * (groups.length - 1))) /
      2;

    let svg = "";
    // Background board
    svg += `<rect x="12" y="10" width="${totalW - 24}" height="${totalH - 20}" rx="18" class="paper"/>`;

    // Index rod (left column)
    const ix = startX;
    const iy = padTop;
    svg += `<rect x="${ix}" y="${iy}" width="${indexW}" height="${headerH + s.rows * rowH}" rx="12" fill="#304a41" stroke="#22362f" stroke-width="1.5"/>`;
    svg += U.text(
      ix + indexW / 2,
      iy + headerH / 2,
      "× 단",
      'fill="#fffefa" style="font-size:18px;font-weight:700;fill:#fffefa"',
    );

    for (let r = 1; r <= s.rows; r++) {
      const ry = iy + headerH + (r - 1) * rowH;
      svg += `<rect x="${ix + 4}" y="${ry + 2}" width="${indexW - 8}" height="${rowH - 4}" rx="7" fill="${r % 2 === 0 ? "#3a594e" : "#335046"}"/>`;
      svg += U.text(
        ix + indexW / 2,
        ry + rowH / 2,
        `×${r}`,
        'class="number" style="font-size:17px;font-weight:700;fill:#f7f4eb"',
      );
    }

    // Track coordinates of common multiples to draw connecting lines
    const multiplePositions = new Map();

    let cursorX = ix + indexW + gap;
    for (const g of groups) {
      const gx = cursorX;
      const gy = padTop;
      cursorX += g.w + gap;

      // Rod outer frame
      svg += `<rect x="${gx}" y="${gy}" width="${g.w}" height="${headerH + s.rows * rowH}" rx="14" fill="#fffdf7" stroke="${g.color}" stroke-width="2.5"/>`;

      // Rod top header
      svg += `<rect x="${gx + 3}" y="${gy + 3}" width="${g.w - 6}" height="${headerH - 6}" rx="11" fill="${g.color}" fill-opacity="0.16"/>`;
      const headerLabel =
        g.digits.length > 1
          ? `${g.num} (${g.digits.map((d) => `[${d}]`).join("")} 봉)`
          : `${g.num}의 계산봉`;
      svg += U.text(
        gx + g.w / 2,
        gy + (g.digits.length > 1 && s.showDiagonals ? 22 : headerH / 2),
        headerLabel,
        `style="font-size:${g.digits.length > 1 ? 15 : 17}px;font-weight:700;fill:#223830"`,
      );

      // Sub-headers for each digit bone when multi-digit
      const boneStartX = gx + 12;
      if (s.showDiagonals && g.digits.length > 1) {
        g.digits.forEach((d, di) => {
          const bx = boneStartX + di * g.cellW;
          svg += `<rect x="${bx + 2}" y="${gy + 36}" width="${g.cellW - 4}" height="22" rx="5" fill="${g.color}" fill-opacity="0.24"/>`;
          svg += U.text(
            bx + g.cellW / 2,
            gy + 47,
            String(d),
            'class="number" style="font-size:14px;font-weight:700;fill:#223830"',
          );
        });
      }

      // Rows 1..s.rows
      for (let r = 1; r <= s.rows; r++) {
        const ry = gy + headerH + (r - 1) * rowH;
        const rowData = C.boneRow(g.num, r);
        const val = rowData.value;
        const isLcm = val === lcm;
        const isCommon = commonSet.has(val) || val % lcm === 0;
        const isSelected = s.selectedMultiple === val;

        let rowFill = r % 2 === 0 ? "#f8f5ec" : "#fffefa";
        let rowStroke = "#e2e6dc";
        let strokeW = 1;
        if (isLcm) {
          rowFill = "#fff1b8";
          rowStroke = "#d99016";
          strokeW = 2.5;
        } else if (isCommon) {
          rowFill = "#e5f5ec";
          rowStroke = "#2c8979";
          strokeW = 2;
        }
        if (isSelected) {
          strokeW = 3;
          rowStroke = isLcm ? "#b86b00" : "#1f6a5c";
        }

        svg += `<rect x="${gx + 6}" y="${ry + 2}" width="${g.w - 12}" height="${rowH - 4}" rx="8" fill="${rowFill}" stroke="${rowStroke}" stroke-width="${strokeW}"/>`;

        hitboxes.push({
          x: gx + 6,
          y: ry + 2,
          w: g.w - 12,
          h: rowH - 4,
          multiple: val,
          number: g.num,
          row: r,
        });

        // Draw Napier bone diagonal cells
        if (s.showDiagonals) {
          rowData.cells.forEach((cell, ci) => {
            const cx = boneStartX + ci * g.cellW;
            const cy = ry + 4;
            const cw = g.cellW - 2;
            const ch = rowH - 8;
            svg += `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="4" fill="#fffdf9" stroke="#9eb0a5" stroke-width="1.2"/>`;
            // Diagonal from top-right to bottom-left (classic Napier bone orientation)
            svg += U.line(
              cx + cw,
              cy,
              cx,
              cy + ch,
              'stroke="#8ca296" stroke-width="1.2" stroke-dasharray="3 2"',
            );
            // Upper-left: tens digit
            svg += U.text(
              cx + cw * 0.3,
              cy + ch * 0.33,
              String(cell.tens),
              `class="number" style="font-size:12px;fill:${cell.tens > 0 ? "#2c6b59" : "#9aa89f"};font-weight:${cell.tens > 0 ? "700" : "400"}"`,
            );
            // Lower-right: ones digit
            svg += U.text(
              cx + cw * 0.72,
              cy + ch * 0.72,
              String(cell.ones),
              'class="number" style="font-size:13px;font-weight:700;fill:#243a33"',
            );
          });
        }

        // Draw combined multiple value on the right side of the rod row
        if (s.showMultiples) {
          const mx = s.showDiagonals
            ? boneStartX + g.boneAreaW + (g.w - 12 - g.boneAreaW) / 2
            : gx + g.w / 2;
          const my = ry + rowH / 2;
          const labelText = s.showDiagonals ? `= ${val}` : String(val);
          svg += U.text(
            mx,
            my,
            labelText,
            `class="number" style="font-size:${isLcm || isCommon ? 17 : 15}px;font-weight:${isLcm || isCommon ? 800 : 600};fill:${isLcm ? "#8c4f00" : isCommon ? "#1b6959" : "#304a41"}"`,
          );
        }

        if (isCommon) {
          if (!multiplePositions.has(val)) multiplePositions.set(val, []);
          multiplePositions.get(val).push({
            xCenter: gx + g.w / 2,
            leftX: gx + 6,
            rightX: gx + g.w - 6,
            y: ry + rowH / 2,
            isLcm,
          });
        }
      }
    }

    // Draw connecting bridges for common multiples that appear across all rods
    for (const [val, pts] of multiplePositions.entries()) {
      if (pts.length === s.numbers.length && pts.length >= 2) {
        const isLcm = val === lcm;
        const color = isLcm ? "#d99016" : "#2c8979";
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i],
            b = pts[i + 1];
          svg += `<path d="M${a.rightX} ${a.y} C${(a.rightX + b.leftX) / 2} ${a.y}, ${(a.rightX + b.leftX) / 2} ${b.y}, ${b.leftX} ${b.y}" fill="none" stroke="${color}" stroke-width="${isLcm ? 3 : 2}" stroke-dasharray="${isLcm ? "none" : "5 4"}" opacity="0.85"/>`;
        }
      }
    }

    $("stage").innerHTML = svg;

    // Update HTML summary and result
    const allInTable = info.factorsForLcm.every((f) => f.inVisibleRows);
    $("result").innerHTML =
      `<span class="label">${s.numbers.join(", ")}의 최소공배수 =</span> <b>${lcm}</b>` +
      ` <span class="label" style="margin-left:10px">(${info.factorsForLcm.map((f) => `${f.number} × ${f.multiplier} = ${lcm}`).join(", ")})</span>`;

    // Build detailed breakdown cards
    const targetMultiple = s.selectedMultiple || lcm;
    const breakdownLines = s.numbers.map((n) => {
      const q = targetMultiple / n;
      if (!Number.isInteger(q) || q < 1) {
        return `<div>• <b>${n}</b>의 배수가 아닙니다 (${targetMultiple} ÷ ${n} 나누어떨어지지 않음)</div>`;
      }
      const rowInfo = C.boneRow(n, q);
      if (rowInfo.digits.length === 1) {
        return `<div>• <b>${n}</b> × ${q} = <b>${targetMultiple}</b> (십의 자리 ${rowInfo.cells[0].tens}, 일의 자리 ${rowInfo.cells[0].ones})</div>`;
      }
      const cellDesc = rowInfo.cells
        .map((c) => `[${c.digit}×${q}=${c.tens}/${c.ones}]`)
        .join(" + ");
      return `<div>• <b>${n}</b> × ${q}: ${cellDesc} → 대각선 합 = <b>${targetMultiple}</b></div>`;
    });

    const commonButtons = info.firstFiveCommon
      .map(
        (m, idx) =>
          `<button type="button" class="common-pill ${idx === 0 ? "is-lcm" : ""}" data-select-multiple="${m}" aria-pressed="${s.selectedMultiple === m}">${m}${idx === 0 ? " (최소공배수)" : ""}</button>`,
      )
      .join("");

    $("summary-panel").innerHTML = `
      <article class="summary-card">
        <h2>최소공배수 (LCM) · 최대공약수 (GCD)</h2>
        <div class="value">최소공배수: ${lcm}</div>
        <div class="sub">
          ${info.factorsForLcm.map((f) => `<b>${f.number}</b>의 <b>×${f.multiplier}</b>단 (${f.number} × ${f.multiplier} = ${lcm})`).join(" · ")}
          ${!allInTable ? `<br><span>💡 현재 ×${s.rows}단까지만 표시 중입니다. 상단에서 단 수를 늘리거나 아래 배수 풀이를 확인해 보세요.</span>` : ""}
          <br>최대공약수: <b>${info.gcd}</b>
        </div>
      </article>
      <article class="summary-card">
        <h2>공배수 차례대로 찾기 (눌러서 대각선 합 확인)</h2>
        <div class="common-pills">${commonButtons}</div>
        <div class="sub">공배수는 최소공배수 <b>${lcm}</b>의 배수(${info.firstFiveCommon.join(", ")}…)입니다.</div>
      </article>
      <article class="summary-card">
        <h2>네이피어 계산봉 대각선 풀이 (선택한 수: ${targetMultiple})</h2>
        <div class="sub">${breakdownLines.join("")}</div>
      </article>
    `;
  }

  function renderMultiplyStage(s) {
    const rowData = C.boneRow(s.multiplicand, s.multiplier);
    const digits = rowData.digits;
    const cellW = 86;
    const rowH = 44;
    const headerH = 58;
    const indexW = 74;
    const gap = 18;
    const padX = 40;
    const padTop = 24;
    const totalW = Math.max(880, padX * 2 + indexW + gap + digits.length * cellW + 240);
    const totalH = padTop + headerH + 9 * rowH + 34;
    $("stage").setAttribute("viewBox", `0 0 ${totalW} ${totalH}`);

    const startX = (totalW - (indexW + gap + digits.length * cellW + 180)) / 2;
    let svg = `<rect x="12" y="10" width="${totalW - 24}" height="${totalH - 20}" rx="18" class="paper"/>`;

    // Index rod
    const ix = startX,
      iy = padTop;
    svg += `<rect x="${ix}" y="${iy}" width="${indexW}" height="${headerH + 9 * rowH}" rx="12" fill="#304a41"/>`;
    svg += U.text(
      ix + indexW / 2,
      iy + headerH / 2,
      "× 단",
      'style="font-size:18px;font-weight:700;fill:#fffefa"',
    );

    for (let r = 1; r <= 9; r++) {
      const ry = iy + headerH + (r - 1) * rowH;
      const active = r === s.multiplier;
      svg += `<rect x="${ix + 4}" y="${ry + 2}" width="${indexW - 8}" height="${rowH - 4}" rx="7" fill="${active ? "#d99016" : r % 2 === 0 ? "#3a594e" : "#335046"}"/>`;
      svg += U.text(
        ix + indexW / 2,
        ry + rowH / 2,
        `×${r}`,
        'class="number" style="font-size:18px;font-weight:700;fill:#fffefa"',
      );
      hitboxes.push({
        x: ix,
        y: ry,
        w: indexW + gap + digits.length * cellW + 160,
        h: rowH,
        multiplier: r,
      });
    }

    // Digit bones placed side by side
    const bx0 = ix + indexW + gap;
    digits.forEach((d, di) => {
      const bx = bx0 + di * cellW;
      const color = rodColor(di);
      svg += `<rect x="${bx}" y="${iy}" width="${cellW - 4}" height="${headerH + 9 * rowH}" rx="12" fill="#fffdf7" stroke="${color}" stroke-width="2"/>`;
      svg += `<rect x="${bx + 3}" y="${iy + 3}" width="${cellW - 10}" height="${headerH - 6}" rx="9" fill="${color}" fill-opacity="0.2"/>`;
      svg += U.text(
        bx + (cellW - 4) / 2,
        iy + headerH / 2,
        String(d),
        'class="number" style="font-size:22px;font-weight:800;fill:#223830"',
      );

      for (let r = 1; r <= 9; r++) {
        const ry = iy + headerH + (r - 1) * rowH;
        const active = r === s.multiplier;
        const prod = d * r;
        const tens = Math.floor(prod / 10);
        const ones = prod % 10;
        const cw = cellW - 12;
        const ch = rowH - 8;
        const cx = bx + 4;
        const cy = ry + 4;

        svg += `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="6" fill="${active ? "#fff1b8" : "#fffdf9"}" stroke="${active ? "#d99016" : "#b8c6bc"}" stroke-width="${active ? 2.5 : 1.2}"/>`;
        if (s.showDiagonals) {
          svg += U.line(
            cx + cw,
            cy,
            cx,
            cy + ch,
            `stroke="${active ? "#b86b00" : "#8ca296"}" stroke-width="1.5"`,
          );
          svg += U.text(
            cx + cw * 0.28,
            cy + ch * 0.32,
            String(tens),
            `class="number" style="font-size:14px;font-weight:700;fill:${tens > 0 ? "#1f6a5c" : "#8b9b91"}"`,
          );
          svg += U.text(
            cx + cw * 0.72,
            cy + ch * 0.72,
            String(ones),
            'class="number" style="font-size:16px;font-weight:800;fill:#223830"',
          );
        } else {
          svg += U.text(
            cx + cw / 2,
            cy + ch / 2,
            String(prod),
            'class="number" style="font-size:16px;font-weight:700;fill:#223830"',
          );
        }
      }
    });

    // Right column: row products
    const rx0 = bx0 + digits.length * cellW + 14;
    for (let r = 1; r <= 9; r++) {
      const ry = iy + headerH + (r - 1) * rowH;
      const active = r === s.multiplier;
      const val = s.multiplicand * r;
      if (s.showMultiples || active) {
        svg += `<rect x="${rx0}" y="${ry + 4}" width="150" height="${rowH - 8}" rx="8" fill="${active ? "#fff1b8" : "#f1f5f0"}" stroke="${active ? "#d99016" : "#d0dcd3"}" stroke-width="${active ? 2 : 1}"/>`;
        svg += U.text(
          rx0 + 75,
          ry + rowH / 2,
          `= ${val}`,
          `class="number" style="font-size:${active ? 19 : 16}px;font-weight:${active ? 800 : 600};fill:${active ? "#8c4f00" : "#304a41"}"`,
        );
      }
    }

    $("stage").innerHTML = svg;
    $("result").innerHTML = `<span class="label">네이피어 격자 곱셈:</span> <b>${s.multiplicand} × ${s.multiplier} = ${rowData.value}</b>`;

    const diagSteps = rowData.cells
      .map(
        (c, i) =>
          `[${digits[i]}×${s.multiplier} = <b>${c.tens}</b>/<b>${c.ones}</b>]`,
      )
      .join(" · ");

    $("summary-panel").innerHTML = `
      <article class="summary-card">
        <h2>곱셈 식과 결과</h2>
        <div class="value">${s.multiplicand} × ${s.multiplier} = ${rowData.value}</div>
        <div class="sub">판에서 원하는 단(×1 ~ ×9)을 누르면 해당 단의 대각선 덧셈을 볼 수 있어요.</div>
      </article>
      <article class="summary-card">
        <h2>각 자리 계산봉 값 (십 / 일)</h2>
        <div class="sub">${diagSteps}</div>
      </article>
      <article class="summary-card">
        <h2>대각선끼리 더하기 (오른쪽 아래 → 왼쪽 위)</h2>
        <div class="sub">이웃한 막대의 <b>일의 자리</b>와 오른쪽 막대의 <b>십의 자리</b>를 대각선 방향으로 더해 <b>${rowData.value}</b>을(를) 얻습니다.</div>
      </article>
    `;
  }

  function render(s) {
    hitboxes = [];
    U.value("mode", s.mode);
    U.value("rows", s.rows);
    U.value("multiplicand", s.multiplicand);
    U.value("multiplier", s.multiplier);
    U.pressed("toggle-diagonals", s.showDiagonals);
    U.pressed("toggle-multiples", s.showMultiples);

    $("lcm-controls").hidden = s.mode !== "lcm";
    $("multiply-controls").hidden = s.mode !== "multiply";
    $("rows").hidden = s.mode !== "lcm";
    $("preset").hidden = s.mode !== "lcm";

    // Sync preset dropdown if current numbers match a preset
    const matchedPreset = Object.entries(C.PRESETS).find(
      ([, p]) =>
        p.numbers.length === s.numbers.length &&
        p.numbers.every((n, i) => n === s.numbers[i]),
    );
    $("preset").value = matchedPreset ? matchedPreset[0] : "";

    // Quick digit buttons
    document.querySelectorAll("[data-quick]").forEach((btn) => {
      const n = Number(btn.dataset.quick);
      btn.setAttribute("aria-pressed", String(s.numbers.includes(n)));
    });

    // Active rod chips
    $("active-rods").innerHTML = s.numbers
      .map(
        (n, idx) => `
        <span class="rod-chip" style="--rod-color:${rodColor(idx)}">
          <span>${n} 막대${n >= 10 ? ` (${C.digitsOf(n).join("·")})` : ""}</span>
          <button type="button" data-remove-rod="${idx}" aria-label="${n} 막대 빼기" ${s.numbers.length <= C.MIN_NUMBERS ? "disabled" : ""}>×</button>
        </span>`,
      )
      .join("");

    if (s.mode === "lcm") {
      renderLcmStage(s);
    } else {
      renderMultiplyStage(s);
    }
  }

  const app = U.app({
    name: "napier-bones",
    initial: C.initial,
    validate: C.validate,
    render,
  });

  U.bind("mode", "change", () =>
    app.commit((s) => {
      s.mode = $("mode").value;
    }),
  );

  U.bind("preset", "change", () => {
    const key = $("preset").value;
    if (!key) return;
    app.commit((s) => C.applyPreset(s, key));
  });

  U.bind("rows", "change", () =>
    app.commit((s) => {
      s.rows = Number($("rows").value);
    }),
  );

  U.bind("toggle-diagonals", "click", () =>
    app.commit((s) => {
      s.showDiagonals = !s.showDiagonals;
    }, false),
  );

  U.bind("toggle-multiples", "click", () =>
    app.commit((s) => {
      s.showMultiples = !s.showMultiples;
    }, false),
  );

  document.querySelectorAll("[data-quick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const n = Number(btn.dataset.quick);
      app.commit((s) => C.toggleQuickNumber(s, n));
    });
  });

  $("custom-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const raw = $("custom-input").value.trim();
    if (!raw) {
      app.notice("추가할 수를 입력해 주세요 (예: 22, 33 또는 22).");
      return;
    }
    // Support entering either a single number ("22") or multiple numbers at once ("22, 33" or "22 33")
    const parts = raw
      .split(/[\s,·/]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (parts.length >= 2) {
      try {
        const parsed = parts.map((p) => C.parseCustomNumber(p));
        const unique = [...new Set(parsed)];
        if (
          unique.length < C.MIN_NUMBERS ||
          unique.length > C.MAX_NUMBERS
        ) {
          app.notice("한 번에 2개부터 4개까지의 서로 다른 수를 입력해 주세요.");
          return;
        }
        const ok = app.commit((s) => {
          s.numbers = unique;
          s.selectedMultiple = C.lcmAll(unique);
        });
        if (ok) $("custom-input").value = "";
      } catch (e) {
        app.notice(e.message);
      }
      return;
    }

    const ok = app.commit((s) => {
      C.addNumber(s, parts[0]);
    });
    if (ok) $("custom-input").value = "";
  });

  $("active-rods").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-remove-rod]");
    if (!btn || btn.disabled) return;
    const idx = Number(btn.dataset.removeRod);
    app.commit((s) => C.removeNumber(s, idx));
  });

  $("summary-panel").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-select-multiple]");
    if (!btn) return;
    const m = Number(btn.dataset.selectMultiple);
    app.commit((s) => {
      s.selectedMultiple = m;
    }, false);
  });

  U.bind("multiplicand", "change", () => {
    const v = Number($("multiplicand").value);
    app.commit((s) => {
      s.multiplicand = M.clamp(Math.round(v) || 1, 1, 9999);
    });
  });

  U.bind("multiplier", "change", () => {
    const v = Number($("multiplier").value);
    app.commit((s) => {
      s.multiplier = M.clamp(Math.round(v) || 1, 1, 9);
    });
  });

  U.pointer($("stage"), {
    start(p) {
      const hit = hitboxes.find(
        (b) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h,
      );
      if (!hit) return false;
      if (hit.multiple) {
        app.commit((s) => {
          s.selectedMultiple = hit.multiple;
        }, false);
      } else if (hit.multiplier) {
        app.commit((s) => {
          s.multiplier = hit.multiplier;
        });
      }
      return false;
    },
  });

  app.start();
})();
