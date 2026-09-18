(function () {
    "use strict";

    /* 음이름 자리: C를 0으로 두고 letter 0~6, octave는 과학적 옥타브 표기(C4 = 가온도). */
    const LETTER_SEMIS = [0, 2, 4, 5, 7, 9, 11];
    const LETTER_NAMES = ["C", "D", "E", "F", "G", "A", "B"];

    function spell(letterAbs, accidental) {
        const octave = Math.floor(letterAbs / 7);
        const letter = letterAbs - octave * 7;
        return {
            letterAbs: letterAbs,
            letter: letter,
            octave: octave,
            accidental: accidental,
            midi: (octave + 1) * 12 + LETTER_SEMIS[letter] + accidental
        };
    }

    /* 자연음(제자리음)으로 적는다. */
    function natural(letterAbs) {
        return spell(letterAbs, 0);
    }

    /* 기준음에서 도수와 반음 수로 다음 음을 적는다. 올림표·내림표는 계산해서 붙인다. */
    function step(from, letterSteps, semis) {
        const targetAbs = from.letterAbs + letterSteps;
        const base = natural(targetAbs);
        return spell(targetAbs, from.midi + semis - base.midi);
    }

    function name(note) {
        const marks = { "-2": "♭♭", "-1": "♭", "0": "", "1": "♯", "2": "＃＃" };
        return LETTER_NAMES[note.letter] + (marks[String(note.accidental)] || "") + note.octave;
    }

    /* 오선 그리기 ------------------------------------------------------ */

    const SVG_NS = "http://www.w3.org/2000/svg";
    const STEP_Y = 5;          /* 한 음자리(줄→칸) 높이 */
    const TOP_LINE_Y = 18;     /* 다섯째 줄 F5 */
    const BOTTOM_LINE_Y = TOP_LINE_Y + STEP_Y * 8;
    const E4_ABS = 4 * 7 + 2;  /* 높은음자리표 첫째 줄 E4 */
    const F5_ABS = 5 * 7 + 3;
    const ZOOM = 1.15;
    const COLUMN_X = 62;
    const COLUMN_GAP = 36;

    function make(tag, attrs) {
        const node = document.createElementNS(SVG_NS, tag);
        Object.keys(attrs || {}).forEach(key => node.setAttribute(key, attrs[key]));
        return node;
    }

    function yFor(letterAbs) {
        return BOTTOM_LINE_Y - (letterAbs - E4_ABS) * STEP_Y;
    }

    /*
     * 임시표. 겹내림표는 내림표 둘을 나란히 놓고, 겹올림표는 제 글리프를 쓴다.
     */
    function markWidth(mark) {
        const ink = inkBox(mark.char);
        return ink ? ink.right * (mark.height / ink.height) : 0;
    }

    function accidentalNode(accidental, right, y) {
        const group = make("g", { class: "sheet-ink" });
        const mark = accidental === 0 ? MARKS.natural
            : accidental === 2 ? MARKS.doubleSharp
            : accidental > 0 ? MARKS.sharp : MARKS.flat;
        const times = accidental === -2 ? 2 : 1;
        const step = markWidth(mark) + 1;
        for (let index = 0; index < times; index += 1) {
            const node = glyphNode(mark.char, "sheet-glyph", right - index * step, y, mark.height, mark.anchor);
            if (node) group.append(node);
        }
        return group;
    }

    /*
     * 덧줄. 큰보표에서는 가온다 쪽에서 두 오선 사이에만 덧줄을 긋고, 아래 오선보다
     * 낮은 음은 아래 오선에서 세어 긋는다.
     */
    function ledgerLines(letterAbs, grand) {
        const lines = [];
        const middle = E4_ABS - 2;                 /* C4 */
        const bassTop = BASS_TOP_ABS;              /* A3 */
        const bassBottom = BASS_TOP_ABS - 8;       /* G2 */
        if (letterAbs > F5_ABS) {
            for (let position = F5_ABS + 2; position <= letterAbs; position += 2) lines.push(position);
            return lines;
        }
        if (!grand) {
            for (let position = middle; position >= letterAbs; position -= 2) lines.push(position);
            return lines;
        }
        if (letterAbs === middle) return [middle];
        if (letterAbs < middle && letterAbs > bassTop) {
            for (let position = middle; position >= letterAbs; position -= 2) lines.push(position);
            return lines;
        }
        if (letterAbs < bassBottom) {
            for (let position = bassBottom - 2; position >= letterAbs; position -= 2) lines.push(position);
        }
        return lines;
    }

    /*
     * 조표만 그린 작은 악보. 임시표가 어느 줄과 칸에 붙는지가 조표의 뜻이므로
     * 오선과 자리표를 함께 두고, 대신 임시표를 촘촘히 붙여 자리를 아낀다.
     * 되돌려 주는 width는 오선 눈금으로 잰 길이다.
     */
    /*
     * 오선에 붙이는 조표. 자리표 뒤에 임시표를 제자리대로 놓는다. 낮은음자리표 오선에는
     * 같은 음이름을 두 옥타브(열네 자리) 아래에 붙인다 — 높은음자리표의 B4 자리가
     * 낮은음자리표에서는 B2다.
     */
    function signatureMarks(count, sharp, from, drop) {
        const seats = sharp ? SHARP_SEATS : FLAT_SEATS;
        const step = markWidth(sharp ? MARKS.sharp : MARKS.flat) + 0.5;
        const group = make("g", { class: "sheet-ink sheet-signature" });
        for (let mark = 0; mark < count; mark += 1) {
            group.append(accidentalNode(sharp ? 1 : -1, from + (mark + 1) * step, yFor(seats[mark] - (drop || 0))));
        }
        return { node: group, width: count * step };
    }

    const SIG_START = 38;

    function keySignatureGroup(count, sharp) {
        const seats = sharp ? SHARP_SEATS : FLAT_SEATS;
        const step = markWidth(sharp ? MARKS.sharp : MARKS.flat) + 0.5;
        const width = SIG_START + Math.max(count, 1) * step + 4;
        const group = make("g", {});

        const staff = make("g", { class: "sheet-staff" });
        for (let line = 0; line < 5; line += 1) {
            const y = TOP_LINE_Y + line * STEP_Y * 2;
            staff.append(make("line", { x1: 3, y1: y, x2: width, y2: y }));
        }
        group.append(staff);

        const clef = clefNode(6);
        if (clef) group.append(clef);

        const ink = make("g", { class: "sheet-ink" });
        for (let mark = 0; mark < count; mark += 1) {
            ink.append(accidentalNode(sharp ? 1 : -1, SIG_START + (mark + 1) * step, yFor(seats[mark])));
        }
        group.append(ink);

        return { node: group, width: width, top: CLEF_TOP, bottom: CLEF_BOTTOM };
    }

    /*
     * columns: [{ notes: [spelling, ...] } | null]  — null이면 아직 모르는 음(?)으로 그린다.
     * marks: 열 번호별 색 이름 ("right" | "wrong")
     */
    /*
     * 자리표는 유니코드 음악 기호(U+1D11E)를 쓴다. 다만 글꼴마다 글리프가 차지하는
     * 자리와 크기가 달라서 그냥 찍으면 오선에 맞지 않는다. 그래서 한 번 재 두고,
     * 잰 테두리를 "위 줄 한 칸 위에서 아래 줄 두 칸 아래까지"에 맞춰 앉힌다.
     * 자리표의 생김새는 어느 글꼴이나 같은 규격이므로, 이 띠에 맞추면 소용돌이가
     * 저절로 G선에 온다.
     */
    const CLEF_GLYPH = "\uD834\uDD1E";
    const SHARP_GLYPH = "\u266F";
    const FLAT_GLYPH = "\u266D";
    const DOUBLE_SHARP_GLYPH = "\uD834\uDD2A";
    const BASS_CLEF_GLYPH = "\uD834\uDD22";
    const NATURAL_GLYPH = "\u266E";
    const G_LINE_ABS = 4 * 7 + 4;   /* 높은음자리표가 가리키는 G4 */
    const PROBE_SIZE = 100;

    const inkCache = {};
    let glyphFont;

    /*
     * SVG의 getBBox()는 글리프가 아니라 글꼴 줄상자를 돌려준다. ♭·♯·자리표가 모두
     * 같은 높이로 나와서 크기를 맞출 수가 없다. 그래서 캔버스로 실제 먹이 닿는
     * 테두리를 잰다. 잰 값은 글자 크기 PROBE_SIZE를 기준으로 한 것이다.
     */
    function inkBox(char) {
        if (inkCache[char] !== undefined) return inkCache[char];
        inkCache[char] = null;
        if (glyphFont === undefined) {
            const probe = document.createElement("span");
            probe.className = "sheet-glyph";
            probe.style.cssText = "position:absolute;left:-9999px;top:0";
            document.body.append(probe);
            glyphFont = window.getComputedStyle(probe).fontFamily || "serif";
            probe.remove();
        }
        let metrics = null;
        try {
            const context = document.createElement("canvas").getContext("2d");
            context.font = PROBE_SIZE + "px " + glyphFont;
            metrics = context.measureText(char);
        } catch (error) { metrics = null; }
        if (metrics && typeof metrics.actualBoundingBoxAscent === "number") {
            const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            if (height > 0) {
                inkCache[char] = {
                    ascent: metrics.actualBoundingBoxAscent,
                    height: height,
                    right: metrics.actualBoundingBoxRight
                };
            }
        }
        return inkCache[char];
    }

    /*
     * 글리프를 오선 좌표에 앉힌다. right는 먹이 닿는 오른쪽 끝, height는 먹의 높이,
     * anchor는 그 높이 안에서 기준이 되는 자리(0이면 맨 위, 1이면 맨 아래)이고
     * at은 그 기준이 놓일 y다. 예를 들어 내림표는 배가 음표에 걸리므로 anchor가 크다.
     */
    function glyphNode(char, cls, right, at, height, anchor) {
        const ink = inkBox(char);
        if (!ink) return null;
        const scale = height / ink.height;
        const node = make("text", {
            class: cls,
            x: 0, y: 0,
            "font-size": PROBE_SIZE * scale,
            transform: "translate(" + (right - ink.right * scale) + ","
                + (at - anchor * height + ink.ascent * scale) + ")"
        });
        node.textContent = char;
        return node;
    }

    /* 자리표는 소용돌이가 G선에 오도록 앉힌다. 소용돌이는 먹 높이의 63% 자리다. */
    const CLEF_H = STEP_Y * 14;
    const CLEF_SPIRAL = 0.63;

    /*
     * 낮은음자리표(F 자리표)는 두 점이 F선 바로 위 칸과 바로 아래 칸에 하나씩 앉는다.
     * 그래서 두 점의 한가운데가 F선이고, 두 점 사이가 꼭 한 칸이다. 높은음자리표처럼
     * 먹 높이의 비율로 앉히면 글꼴마다 어긋나므로(윈도 글꼴은 한 칸 아래로 내려앉아
     * 가운데 줄 D를 감쌌다) 캔버스에 찍어 두 점을 직접 찾는다. 두 점은 글리프의
     * 맨 오른쪽에 떨어져 있는 먹 기둥이다.
     */
    const F_LINE_ABS = 3 * 7 + 3;   /* 낮은음자리표가 가리키는 F3 */
    let bassFit;

    function bassClefFit() {
        if (bassFit !== undefined) return bassFit;
        /* 못 재면 윈도(Segoe UI Symbol)에서 잰 값으로 앉힌다. */
        bassFit = { height: STEP_Y * 5.8, anchor: 0.43 };
        const ink = inkBox(BASS_CLEF_GLYPH);
        if (!ink) return bassFit;
        const size = PROBE_SIZE * 3;
        const baseline = PROBE_SIZE * 2;
        let data;
        try {
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext("2d", { willReadFrequently: true });
            context.font = PROBE_SIZE + "px " + glyphFont;
            context.fillText(BASS_CLEF_GLYPH, PROBE_SIZE, baseline);
            data = context.getImageData(0, 0, size, size).data;
        } catch (error) { return bassFit; }
        const inked = (x, y) => data[(y * size + x) * 4 + 3] > 100;
        const columnInked = x => {
            for (let y = 0; y < size; y += 1) if (inked(x, y)) return true;
            return false;
        };
        let right = size - 1;
        while (right >= 0 && !columnInked(right)) right -= 1;
        let left = right;
        while (left > 0 && columnInked(left - 1)) left -= 1;
        /* 점 기둥에서 먹이 있는 줄을 모아, 끊긴 데서 두 덩어리로 나눈다. */
        const blobs = [];
        for (let y = 0; y < size; y += 1) {
            let hit = false;
            for (let x = left; x <= right && !hit; x += 1) hit = inked(x, y);
            if (!hit) continue;
            const last = blobs[blobs.length - 1];
            if (last && last.bottom === y - 1) last.bottom = y;
            else blobs.push({ top: y, bottom: y });
        }
        if (blobs.length !== 2) return bassFit;
        const upper = (blobs[0].top + blobs[0].bottom) / 2;
        const lower = (blobs[1].top + blobs[1].bottom) / 2;
        const middle = (upper + lower) / 2;
        bassFit = {
            height: ink.height * (STEP_Y * 2) / (lower - upper),
            anchor: (ink.ascent - (baseline - middle)) / ink.height
        };
        return bassFit;
    }

    function oneClef(char, x, height, anchor, at) {
        const ink = inkBox(char);
        if (!ink) return null;
        const right = x + ink.right * (height / ink.height);
        return glyphNode(char, "sheet-clef", right, at, height, anchor);
    }

    function clefNode(x) {
        return oneClef(CLEF_GLYPH, x, CLEF_H, CLEF_SPIRAL, yFor(G_LINE_ABS));
    }

    function bassClefNode(x) {
        const fit = bassClefFit();
        return oneClef(BASS_CLEF_GLYPH, x, fit.height, fit.anchor, yFor(F_LINE_ABS));
    }

    /*
     * 큰보표. 아래 오선의 첫째 줄은 A3이다. 위 오선 첫째 줄 E4에서 넉 자리 아래이므로,
     * 가온다(C4)가 두 오선의 정확히 가운데 덧줄 자리에 온다.
     */
    const BASS_TOP_ABS = 3 * 7 + 5;                    /* A3 */
    const BASS_TOP_Y = yFor(BASS_TOP_ABS);
    const BASS_BOTTOM_Y = BASS_TOP_Y + STEP_Y * 8;
    const BASS_CLEF_BOTTOM = BASS_BOTTOM_Y + STEP_Y * 2;

    /*
     * 올림표는 두 칸, 내림표는 두 칸 반, 겹올림표는 한 칸을 차지한다. anchor는 음표가
     * 걸리는 자리다. 올림표는 가운데, 내림표는 배가 아래쪽에 있어 아래쪽이다.
     */
    const MARKS = {
        sharp: { char: SHARP_GLYPH, height: STEP_Y * 4, anchor: 0.5 },
        flat: { char: FLAT_GLYPH, height: STEP_Y * 5, anchor: 0.72 },
        doubleSharp: { char: DOUBLE_SHARP_GLYPH, height: STEP_Y * 2, anchor: 0.5 },
        natural: { char: NATURAL_GLYPH, height: STEP_Y * 4.2, anchor: 0.5 }
    };

    /* 자리표가 위아래로 먹는 띠. 소용돌이를 G선에 맞춘 결과다. */
    const CLEF_TOP = yFor(G_LINE_ABS) - STEP_Y * 14 * 0.63;
    const CLEF_BOTTOM = CLEF_TOP + STEP_Y * 14;

    /* 높은음자리표에서 조표가 붙는 자리. 붙는 차례대로 적은 음자리 번호다. */
    const SHARP_SEATS = [38, 35, 39, 36, 33, 37, 34];
    const FLAT_SEATS = [34, 37, 33, 36, 32, 35, 31];

    /*
     * 조표가 이미 올리거나 내려 둔 음에는 임시표를 다시 붙이지 않는다. 거꾸로,
     * 조표가 건드린 음을 제자리로 되돌릴 때는 제자리표(♮)를 붙여야 한다.
     * 빌려 온 화음(장조의 ♭VII 같은 것)이 바로 이 경우다.
     */
    function signatureAlters(sign) {
        const table = {};
        if (!sign || !sign.count) return table;
        const seats = sign.sharp ? SHARP_SEATS : FLAT_SEATS;
        for (let mark = 0; mark < sign.count; mark += 1) {
            table[seats[mark] % 7] = sign.sharp ? 1 : -1;
        }
        return table;
    }

    /*
     * 온음표는 단순한 동그라미가 아니다. 가운데 구멍이 비스듬히 뚫려 있어서
     * 왼쪽 위와 오른쪽 아래가 두껍고 양 끝이 얇다. 타원 둘을 한 길로 묶고
     * evenodd로 채워 구멍을 낸다.
     */
    function ellipseRing(cx, cy, rx, ry, deg) {
        const rad = deg * Math.PI / 180;
        const dx = rx * Math.cos(rad);
        const dy = rx * Math.sin(rad);
        const from = (cx - dx) + "," + (cy - dy);
        const to = (cx + dx) + "," + (cy + dy);
        return "M" + from + " A" + rx + "," + ry + " " + deg + " 1 1 " + to
            + " A" + rx + "," + ry + " " + deg + " 1 1 " + from + "Z";
    }

    const HEAD_RX = 7.2;
    const HEAD_RY = 4.7;

    function wholeHead(cx, cy) {
        return make("path", {
            class: "sheet-head",
            "fill-rule": "evenodd",
            d: ellipseRing(cx, cy, HEAD_RX, HEAD_RY, -6) + ellipseRing(cx, cy, 4.5, 1.9, 36)
        });
    }

    function render(columns, options) {
        const settings = options || {};
        /* 악보는 어느 화면에서나 같은 크기여야 하므로 눈금 배율을 하나로 못 박는다. */
        const zoom = settings.zoom || ZOOM;
        const grand = settings.grand === true;
        const sign = settings.keySignature;
        /* 조표가 붙으면 그만큼 첫 칸을 뒤로 밀어야 한다. */
        const signWidth = sign && sign.count
            ? (markWidth(sign.sharp ? MARKS.sharp : MARKS.flat) + 0.5) * sign.count + 4
            : 0;
        const firstX = COLUMN_X + signWidth;
        /* 칸 수가 적어도 오선 길이는 같게 둔다. 짧은 오선이 넓은 자리에 떠 보이지 않게. */
        const needed = firstX + Math.max(1, columns.length) * COLUMN_GAP + 16;
        const width = Math.max(settings.minWidth || 0, needed);
        /*
         * 그러면 칸이 하나·둘뿐일 때 음표가 자리표에 붙어 왼쪽에 몰리고 오른쪽이
         * 텅 빈다. 남는 자리의 절반만큼 칸을 밀어 가운데에 앉힌다.
         */
        const slack = Math.max(0, width - needed) / 2;

        /*
         * 위아래 여백을 음표가 닿는 데까지만 남긴다. 임시표는 음표머리보다 위로 더
         * 올라가므로 위쪽을 조금 더 준다. 눈금은 그대로여서 음표 크기는 변하지 않는다.
         */
        let top = CLEF_TOP;
        let bottom = grand ? BASS_CLEF_BOTTOM : CLEF_BOTTOM;
        columns.forEach(column => {
            if (!column) return;
            column.notes.forEach(note => {
                const y = yFor(note.letterAbs);
                top = Math.min(top, y - 13);
                bottom = Math.max(bottom, y + 8);
            });
        });

        const svg = make("svg", {
            class: "sheet",
            /* 칸 수가 달라도 음표 크기가 같아 보이도록 폭을 눈금으로 못 박는다. */
            style: "width:" + Math.round(width * zoom) + "px",
            viewBox: "0 " + top + " " + width + " " + (bottom - top),
            role: "img",
            "aria-label": settings.label || "악보"
        });

        const staff = make("g", { class: "sheet-staff" });
        for (let line = 0; line < 5; line += 1) {
            const y = TOP_LINE_Y + line * STEP_Y * 2;
            staff.append(make("line", { x1: 10, y1: y, x2: width - 10, y2: y }));
        }
        if (grand) {
            for (let line = 0; line < 5; line += 1) {
                const y = BASS_TOP_Y + line * STEP_Y * 2;
                staff.append(make("line", { x1: 10, y1: y, x2: width - 10, y2: y }));
            }
            /* 두 오선을 왼쪽에서 잇는다. */
            staff.append(make("line", { x1: 10, y1: TOP_LINE_Y, x2: 10, y2: BASS_BOTTOM_Y }));
        }
        svg.append(staff);

        const clef = clefNode(14);
        if (clef) svg.append(clef);
        if (grand) {
            const bass = bassClefNode(14);
            if (bass) svg.append(bass);
        }
        if (signWidth) {
            svg.append(signatureMarks(sign.count, sign.sharp, COLUMN_X - 6).node);
            if (grand) svg.append(signatureMarks(sign.count, sign.sharp, COLUMN_X - 6, 14).node);
        }

        const alters = signatureAlters(sign);
        columns.forEach((column, index) => {
            const x = firstX + slack + index * COLUMN_GAP;
            if (!column) {
                const unknown = make("text", { class: "sheet-unknown", x: x, y: TOP_LINE_Y + STEP_Y * 4 + 10 });
                unknown.textContent = "?";
                svg.append(unknown);
                return;
            }
            const group = make("g", {
                class: "sheet-ink sheet-column" + (column.mark ? " is-" + column.mark : ""),
                "data-column": index
            });
            const sorted = column.notes.slice().sort((a, b) => a.letterAbs - b.letterAbs);
            const drawnLedgers = new Set();
            let shift = 0;
            sorted.forEach((note, noteIndex) => {
                const y = yFor(note.letterAbs);
                ledgerLines(note.letterAbs, grand).forEach(position => {
                    if (drawnLedgers.has(position)) return;
                    drawnLedgers.add(position);
                    group.append(make("line", { class: "sheet-ledger", x1: x - 11, y1: yFor(position), x2: x + 11, y2: yFor(position) }));
                });
                /* 바로 아래 음과 2도로 붙으면 음표머리를 옆으로 비킨다. */
                const previous = sorted[noteIndex - 1];
                shift = previous && note.letterAbs - previous.letterAbs === 1 && shift === 0 ? 15 : 0;
                group.append(wholeHead(x + shift, y));
                if (note.accidental !== (alters[note.letter] || 0)) {
                    group.append(accidentalNode(note.accidental, x + shift - HEAD_RX - 3, y));
                }
            });
            svg.append(group);
        });

        return svg;
    }

    window.Notation = {
        natural: natural,
        /* 리듬 악보도 같은 방법으로 글리프를 재고 같은 모양으로 머리를 그린다. */
        inkBox: inkBox,
        glyph: glyphNode,
        ring: ellipseRing,
        spell: spell,
        step: step,
        name: name,
        render: render,
        keySignatureGroup: keySignatureGroup,
        LETTER_NAMES: LETTER_NAMES,
        LETTER_SEMIS: LETTER_SEMIS
    };
})();
