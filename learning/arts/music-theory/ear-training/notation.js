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
     * 덧줄. 음이 앉은 오선에서 세어 긋는다. 두 오선 사이의 가온다(C4)는 위 오선에
     * 앉으면 위 오선 아래 덧줄, 아래 오선에 앉으면 아래 오선 위 덧줄이다.
     */
    function ledgerLines(letterAbs, lower) {
        const lines = [];
        const top = lower ? BASS_TOP_ABS : F5_ABS;
        const bottom = top - 8;
        for (let position = top + 2; position <= letterAbs; position += 2) lines.push(position);
        for (let position = bottom - 2; position >= letterAbs; position -= 2) lines.push(position);
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
    function signatureMarks(count, sharp, from, lower) {
        const seats = sharp ? SHARP_SEATS : FLAT_SEATS;
        const step = markWidth(sharp ? MARKS.sharp : MARKS.flat) + 0.5;
        const group = make("g", { class: "sheet-ink sheet-signature" });
        for (let mark = 0; mark < count; mark += 1) {
            const y = lower ? yLow(seats[mark] - 14) : yFor(seats[mark]);
            group.append(accidentalNode(sharp ? 1 : -1, from + (mark + 1) * step, y));
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
    // Bundled vector outlines keep music symbols identical on every OS.
    const CLEF_GLYPH = "\uD834\uDD1E";
    const SHARP_GLYPH = "\u266F";
    const FLAT_GLYPH = "\u266D";
    const DOUBLE_SHARP_GLYPH = "\uD834\uDD2A";
    const BASS_CLEF_GLYPH = "\uD834\uDD22";
    const NATURAL_GLYPH = "\u266E";
    const G_LINE_ABS = 4 * 7 + 4;   /* 높은음자리표가 가리키는 G4 */
    // BEGIN BUNDLED MUSIC OUTLINES
    // Noto Music, SIL OFL 1.1; see assets/notation/OFL.txt.
    // Source SHA256: e913be269fe16723d1dea0afc3c31a28be6958f6a7f0e6d5be6e98506c4022bd
    const MUSIC_OUTLINES = {
        "\ud834\udd1e": {"width":611,"height":1732,"path":"M264 533Q250 480 241.0 428.0Q232 376 232 322Q232 275 238.5 233.5Q245 192 257 157Q270 117 291.0 81.5Q312 46 335.5 23.0Q359 0 377 0Q401 0 443 85Q464 128 474.0 178.0Q484 228 484 285Q484 356 465.0 426.5Q446 497 409.5 559.0Q373 621 322 668L357 836Q372 834 382.0 833.0Q392 832 397 832Q458 832 506.0 866.5Q554 901 582.5 957.0Q611 1013 611 1080Q611 1157 571.5 1218.5Q532 1280 453 1309Q458 1326 482 1451Q488 1481 491.0 1498.5Q494 1516 495.0 1529.0Q496 1542 496 1559Q496 1609 471.5 1648.5Q447 1688 405.5 1710.0Q364 1732 313 1732Q261 1732 221.0 1712.5Q181 1693 158.0 1658.5Q135 1624 135 1579Q135 1531 161.5 1499.0Q188 1467 237 1467Q279 1467 305.5 1497.5Q332 1528 332 1570Q332 1606 307.0 1633.0Q282 1660 242 1660H232Q258 1699 314 1699Q383 1699 422.0 1654.0Q461 1609 461 1539Q461 1522 457.0 1493.5Q453 1465 443 1425Q433 1385 427.5 1359.0Q422 1333 420 1322Q386 1332 340 1332Q254 1332 172 1282Q92 1232 46.0 1150.0Q0 1068 0 973Q0 883 41 804Q82 725 142.5 659.0Q203 593 264 533ZM291 508Q314 496 340.0 463.5Q366 431 390.0 389.0Q414 347 429.0 304.5Q444 262 444 228Q444 192 433.0 171.0Q422 150 395 150Q371 150 348.5 172.0Q326 194 308.5 230.5Q291 267 281.0 312.0Q271 357 271 404Q271 436 277.5 462.0Q284 488 291 508ZM348 955Q321 961 297.0 980.5Q273 1000 258.5 1027.5Q244 1055 244 1086Q244 1111 257.0 1137.5Q270 1164 289 1180Q302 1192 315 1198Q330 1205 330 1211Q330 1214 320 1217Q282 1208 251.5 1183.0Q221 1158 203.5 1122.5Q186 1087 186 1047Q186 1004 203.5 964.0Q221 924 252.5 892.0Q284 860 324 844L295 693Q179 787 124.5 877.5Q70 968 70 1057Q70 1122 104.0 1178.0Q138 1234 197.0 1268.5Q256 1303 330 1303Q350 1303 370.5 1299.0Q391 1295 414 1289ZM445 1279Q543 1237 543 1107Q543 1064 521.0 1028.5Q499 993 462.0 972.0Q425 951 379 951Z"},
        "\ud834\udd22": {"width":692,"height":799,"path":"M0 777Q166 669 238 599Q286 552 323.0 491.5Q360 431 381.5 364.0Q403 297 403 231Q403 172 385.0 126.5Q367 81 333.0 55.0Q299 29 252 29Q234 29 214.5 33.0Q195 37 174 45Q131 61 108.0 86.5Q85 112 85 135Q85 144 93.0 148.0Q101 152 108 152Q118 152 133 148Q140 146 146.5 145.0Q153 144 160 144Q198 144 222.0 166.5Q246 189 246 226Q246 262 216.0 288.0Q186 314 145 314Q96 314 61.0 283.0Q26 252 26 203Q26 144 59.0 98.0Q92 52 148.5 26.0Q205 0 274 0Q350 0 410.0 33.0Q470 66 505.5 123.5Q541 181 541 254Q541 349 488 436Q461 481 426.5 521.0Q392 561 339.0 602.5Q286 644 206.0 692.0Q126 740 7 799ZM637 91Q660 91 676.0 107.0Q692 123 692 146Q692 169 676.0 184.5Q660 200 637 200Q614 200 598.0 184.5Q582 169 582 146Q582 123 598.0 107.0Q614 91 637 91ZM637 311Q660 311 676.0 327.0Q692 343 692 366Q692 389 676.0 404.5Q660 420 637 420Q614 420 598.0 404.5Q582 389 582 366Q582 343 598.0 327.0Q614 311 637 311Z"},
        "\u266f": {"width":225,"height":756,"path":"M47 463V320L0 332V232L47 219V23H78V211L145 195V0H176V187L225 176V275L176 289V432L225 420V523L176 535V723H145V543L78 561V756H47V568L0 580V477ZM145 439V295L78 312V455Z"},
        "\u266d": {"width":199,"height":670,"path":"M0 0H31V390Q68 353 115 353Q147 353 173.0 374.5Q199 396 199 437Q199 469 180.0 496.0Q161 523 129 550L60 609Q41 625 26.0 640.5Q11 656 0 670ZM31 603Q57 575 75.0 551.5Q93 528 103 510Q114 491 119.5 475.0Q125 459 125 445Q125 417 112.0 404.5Q99 392 84 392Q68 392 52.5 403.5Q37 415 31 435Z"},
        "\u266e": {"width":176,"height":707,"path":"M176 170V707H145V495L0 532V0H33V207ZM147 402V274L31 303V430Z"},
        "\ud834\udd2a": {"width":260,"height":262,"path":"M174 262V217Q174 198 161.5 187.0Q149 176 131 176Q112 176 99.0 187.0Q86 198 86 215V262H0V176H55Q69 176 77.5 162.0Q86 148 86 131Q86 115 76.5 100.5Q67 86 61 86H0V0H86V53Q86 67 99.0 76.5Q112 86 131 86Q146 86 160.0 77.0Q174 68 174 55V0H260V86H209Q196 86 185.0 101.5Q174 117 174 131Q174 148 183.5 162.0Q193 176 209 176H260V262Z"},
        "\ud834\udd3b": {"width":683,"height":134,"path":"M0 24V0H683V24H523V134H160V24Z"},
        "\ud834\udd3c": {"width":683,"height":134,"path":"M0 134V110H160V0H523V110H683V134Z"},
        "\ud834\udd3d": {"width":256,"height":755,"path":"M96 0 256 195Q206 254 179.0 297.0Q152 340 152 384Q152 421 176.0 461.5Q200 502 252 564L236 586Q192 558 154 558Q126 558 112.0 576.5Q98 595 98 621Q98 653 111.5 681.5Q125 710 148 736L135 755Q66 705 33.0 664.0Q0 623 0 575Q0 532 27.0 512.0Q54 492 92 492Q122 492 170 515V513L16 308Q117 219 117 142Q117 81 53 0Z"},
        "\ud834\udd3e": {"width":262,"height":461,"path":"M105 461 201 121Q180 140 153.5 148.0Q127 156 101 156Q58 156 29.0 133.0Q0 110 0 67Q0 39 20.0 19.5Q40 0 71 0Q100 0 118.5 18.5Q137 37 137 68Q137 90 127 107Q127 113 139 113Q194 113 244 27H262L141 461Z"},
        "\ud834\udd3f": {"width":330,"height":705,"path":"M105 705 201 365Q180 384 153.5 392.0Q127 400 101 400Q58 400 29.0 377.0Q0 354 0 311Q0 283 19.5 263.5Q39 244 71 244Q100 244 118.5 262.5Q137 281 137 312Q137 334 127 351Q127 357 139 357Q180 357 217 311L269 121Q248 140 221.5 148.0Q195 156 169 156Q126 156 97.0 133.0Q68 110 68 67Q68 39 88.0 19.5Q108 0 139 0Q169 0 187.0 19.0Q205 38 205 68Q205 78 202.0 88.5Q199 99 195 107Q195 113 207 113Q262 113 312 27H330L141 705Z"}
    };
    // END BUNDLED MUSIC OUTLINES

    function inkBox(char) {
        const shape = MUSIC_OUTLINES[char];
        return shape ? { ascent: 0, height: shape.height, right: shape.width } : null;
    }

    function glyphNode(char, cls, right, at, height, anchor) {
        const shape = MUSIC_OUTLINES[char];
        if (!shape) return null;
        const scale = height / shape.height;
        return make("path", {
            class: cls,
            "data-glyph": char.codePointAt(0).toString(16),
            d: shape.path,
            transform: "translate(" + (right - shape.width * scale) + "," + (at - anchor * height) + ") scale(" + scale + ")"
        });
    }

    function glyphIcon(char) {
        const shape = MUSIC_OUTLINES[char];
        if (!shape) return null;
        const svg = make("svg", { class: "music-glyph-icon", viewBox: "0 0 " + shape.width + " " + shape.height, "aria-hidden": "true" });
        svg.append(glyphNode(char, "sheet-glyph", shape.width, 0, shape.height, 0));
        return svg;
    }

    /* 자리표는 소용돌이가 G선에 오도록 앉힌다. 소용돌이는 먹 높이의 63% 자리다. */
    const CLEF_H = STEP_Y * 14;
    const CLEF_SPIRAL = 0.63;

    const F_LINE_ABS = 3 * 7 + 3;

    function bassClefFit() {
        // Noto Music's two dot centers are at y=754.5 and y=534.5.
        // Their separation is one staff space; their midpoint sits on F3.
        return { height: 799 * (STEP_Y * 2) / 220, anchor: (900 - 644.5) / 799 };
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
        return oneClef(BASS_CLEF_GLYPH, x, fit.height, fit.anchor, yLow(F_LINE_ABS));
    }

    /*
     * 큰보표. 아래 오선의 다섯째 줄은 A3이다. 음높이대로 이어 붙이면 위 오선 첫째 줄 E4와
     * 두 칸밖에 안 떨어져 한 덩어리로 보이므로, 아래 오선을 GRAND_GAP만큼 더 내려 둔다.
     * 그래서 음높이와 자리가 이어지지 않는다 — 어느 오선에 앉는 음인지 알아야 y가 나온다.
     */
    const BASS_TOP_ABS = 3 * 7 + 5;                    /* A3 */
    const GRAND_GAP = STEP_Y * 4;

    function yLow(letterAbs) {
        return yFor(letterAbs) + GRAND_GAP;
    }

    const BASS_TOP_Y = yLow(BASS_TOP_ABS);
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

    /*
     * 한 칸의 음을 낮은 음부터 늘어놓고 어느 오선에 앉을지 정한다. 큰보표에서는 칸마다
     * 가장 낮은 음 하나가 왼손(아래 오선)이다 — 화음 진행의 베이스와 텐션 화음의 뿌리음이
     * 그렇다. 음높이로 가르면 오른손이 가온다 아래로 내려갈 때 화음이 두 오선으로 찢어진다.
     */
    function placeColumn(column, grand) {
        return column.notes.slice()
            .sort((a, b) => a.letterAbs - b.letterAbs)
            .map((note, index) => {
                const lower = grand && index === 0;
                return { note: note, lower: lower, y: lower ? yLow(note.letterAbs) : yFor(note.letterAbs) };
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
        const placed = columns.map(column => column && placeColumn(column, grand));
        placed.forEach(seats => {
            if (!seats) return;
            seats.forEach(seat => {
                top = Math.min(top, seat.y - 13);
                bottom = Math.max(bottom, seat.y + 8);
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
            if (grand) svg.append(signatureMarks(sign.count, sign.sharp, COLUMN_X - 6, true).node);
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
            const seats = placed[index];
            const drawnLedgers = new Set();
            let shift = 0;
            seats.forEach((seat, noteIndex) => {
                const note = seat.note;
                const y = seat.y;
                const lineY = seat.lower ? yLow : yFor;
                ledgerLines(note.letterAbs, seat.lower).forEach(position => {
                    const ledgerY = lineY(position);
                    if (drawnLedgers.has(ledgerY)) return;
                    drawnLedgers.add(ledgerY);
                    group.append(make("line", { class: "sheet-ledger", x1: x - 11, y1: ledgerY, x2: x + 11, y2: ledgerY }));
                });
                /* 같은 오선에서 바로 아래 음과 2도로 붙으면 음표머리를 옆으로 비킨다. */
                const previous = seats[noteIndex - 1];
                shift = previous && previous.lower === seat.lower
                    && note.letterAbs - previous.note.letterAbs === 1 && shift === 0 ? 15 : 0;
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
        /* 리듬 악보도 같은 벡터 기호와 음표머리를 쓴다. */
        inkBox: inkBox,
        glyph: glyphNode,
        icon: glyphIcon,
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
