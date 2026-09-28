(function () {
    "use strict";

    const SVG_NS = "http://www.w3.org/2000/svg";

    /*
     * 리듬 한 마디는 사건의 줄이다. v는 음표 값, rest면 쉼표다.
     * beats는 4분음표 하나를 1로 센 길이.
     */
    const PER_BEAT = 12;

    const VALUES = {
        w: { cells: 48, hollow: true, stem: false, flags: 0, rest: "w" },
        h: { cells: 24, hollow: true, stem: true, flags: 0, rest: "h" },
        hd: { cells: 36, hollow: true, stem: true, flags: 0, dot: true, rest: "h" },
        q: { cells: 12, hollow: false, stem: true, flags: 0, rest: "q" },
        qd: { cells: 18, hollow: false, stem: true, flags: 0, dot: true, rest: "q" },
        e: { cells: 6, hollow: false, stem: true, flags: 1, rest: "e" },
        ed: { cells: 9, hollow: false, stem: true, flags: 1, dot: true, rest: "e" },
        s: { cells: 3, hollow: false, stem: true, flags: 2, rest: "s" },
        te: { cells: 4, hollow: false, stem: true, flags: 1, rest: "e", triplet: true },
        tq: { cells: 8, hollow: false, stem: true, flags: 0, rest: "q", triplet: true }
    };

    Object.keys(VALUES).forEach(name => { VALUES[name].beats = VALUES[name].cells / PER_BEAT; });

    const BEAT_W = 74;
    const LEFT = 44;
    const LINE_Y = 62;
    const STEM_TOP = 28;
    const HEAD_RX = 6.4;
    const HEAD_RY = 4.6;
    /* 박이 시작하는 자리에서 음표머리 한가운데까지 */
    const ONSET_PAD = 12;

    function make(tag, attrs, text) {
        const node = document.createElementNS(SVG_NS, tag);
        Object.keys(attrs || {}).forEach(key => node.setAttribute(key, attrs[key]));
        if (text !== undefined) node.textContent = text;
        return node;
    }

    /*
     * 쉼표는 공식 글리프를 쓴다. 손으로 그으면 지렁이가 된다. 글꼴마다 글리프가
     * 차지하는 자리와 크기가 달라서, 먹이 닿는 테두리를 재서 맞춘다(notation.js와
     * 같은 방법). 온쉼표는 줄에 매달고 2분쉼표는 줄 위에 얹고, 나머지는 줄에 걸친다.
     */
    const REST_GLYPHS = {
        w: { char: "\uD834\uDD3B", height: 5.2, anchor: 0 },
        h: { char: "\uD834\uDD3C", height: 5.2, anchor: 1 },
        q: { char: "\uD834\uDD3D", height: 19, anchor: 0.5 },
        e: { char: "\uD834\uDD3E", height: 13, anchor: 0.52 },
        s: { char: "\uD834\uDD3F", height: 18, anchor: 0.5 }
    };

    function restNode(kind, x) {
        const spec = REST_GLYPHS[kind] || REST_GLYPHS.q;
        const N = window.Notation;
        const ink = N && N.inkBox ? N.inkBox(spec.char) : null;
        if (!ink || !ink.height) return null;
        const width = ink.right * (spec.height / ink.height);
        return N.glyph(spec.char, "rhythm-rest", x + width / 2, LINE_Y, spec.height, spec.anchor);
    }

    /*
     * 음표머리. 4분음표는 비스듬히 기운 채운 타원이고, 2분음표는 구멍이 비스듬히
     * 뚫린 고리다 — 테두리만 그린 타원이 아니다.
     */
    function headNode(cx, cy, hollow) {
        if (!hollow) {
            return make("ellipse", {
                class: "rhythm-head", cx: cx, cy: cy, rx: HEAD_RX, ry: HEAD_RY,
                transform: "rotate(-20 " + cx + " " + cy + ")"
            });
        }
        const ring = window.Notation.ring;
        return make("path", {
            class: "rhythm-head is-hollow", "fill-rule": "evenodd",
            d: ring(cx, cy, HEAD_RX, HEAD_RY, -20) + ring(cx, cy, 4.3, 2.1, 24)
        });
    }

    /*
     * 꼬리는 채운 모양이다. 선으로 그으면 지렁이가 된다. 기둥 끝에서 오른쪽으로
     * 부풀어 내려오다 끝이 기둥 쪽으로 감긴다. 기둥이 위로 섰으므로 꼬리는 늘
     * 기둥 오른쪽에 붙어 아래로 흐른다.
     */
    function flagNode(x, y) {
        return make("path", {
            class: "rhythm-flag",
            d: "M" + x + "," + y
                + " C" + (x + 7) + "," + (y + 3) + " " + (x + 10) + "," + (y + 9)
                + " " + (x + 6.5) + "," + (y + 16)
                + " C" + (x + 7.5) + "," + (y + 10) + " " + (x + 4.5) + "," + (y + 7)
                + " " + x + "," + (y + 6) + " Z"
        });
    }

    /* 마디의 길이를 칸으로 센다. */
    function barCells(bar) {
        return bar.reduce((sum, event) => sum + VALUES[event.v].cells, 0);
    }

    function barBeats(bar) {
        return barCells(bar) / PER_BEAT;
    }

    /* 치는 자리만 남긴다. 한 박을 열두 칸으로 센 자리 번호. */
    function onsets(bar) {
        const list = [];
        let position = 0;
        bar.forEach(event => {
            if (!event.rest) list.push(position);
            position += VALUES[event.v].cells;
        });
        return list;
    }

    function sameOnsets(a, b) {
        const one = onsets(a);
        const two = onsets(b);
        return one.length === two.length && one.every((value, index) => value === two[index]);
    }

    /*
     * 대(beam)로 이을 무리를 찾는다. 같은 박 안에 있고 꼬리가 있는 음표만 잇는다.
     * 쉼표나 박이 바뀌면 무리가 끊긴다.
     */
    function beamGroups(bar) {
        const groups = [];
        let current = null;
        let position = 0;
        bar.forEach((event, index) => {
            const value = VALUES[event.v];
            const beat = Math.floor(position / PER_BEAT);
            const beamable = !event.rest && value.flags > 0;
            if (beamable && current && current.beat === beat) current.items.push(index);
            else if (beamable) {
                current = { beat: beat, items: [index] };
                groups.push(current);
            } else current = null;
            position += value.cells;
        });
        return groups.filter(group => group.items.length > 1);
    }


    /* 한 박 안에서 이어지는 셋잇단 음표 묶음. 쉼표나 박이 바뀌면 끊긴다. */
    function tripletRuns(bar) {
        const runs = [];
        let current = null;
        let position = 0;
        bar.forEach((event, index) => {
            const value = VALUES[event.v];
            const beat = Math.floor(position / PER_BEAT);
            if (value.triplet && !event.rest && current && current.beat === beat) current.items.push(index);
            else if (value.triplet && !event.rest) {
                current = { beat: beat, items: [index] };
                runs.push(current);
            } else current = null;
            position += value.cells;
        });
        return runs.map(run => run.items);
    }

    /* 칸 수로 잰 길이를 음표 하나로 적을 수 있는지 표 */
    const CELL_VALUE = {
        3: "s", 4: "te", 6: "e", 8: "tq", 9: "ed", 12: "q", 18: "qd", 24: "h", 36: "hd", 48: "w"
    };

    /*
     * 치는 자리만 정해 놓고, "다음 칠 자리까지 이어진다"는 규칙으로 음표를 정한다.
     * 이렇게 하면 한 가지 리듬이 한 가지 악보로만 적힌다.
     */
    function fromOnsets(cells, barCells) {
        const sorted = cells.slice().sort((a, b) => a - b);
        const bar = [];
        if (!sorted.length) return [{ v: "w", rest: true }];
        if (sorted[0] > 0) {
            const gap = sorted[0];
            if (!CELL_VALUE[gap]) return null;
            bar.push({ v: CELL_VALUE[gap], rest: true });
        }
        for (let index = 0; index < sorted.length; index += 1) {
            const next = index + 1 < sorted.length ? sorted[index + 1] : barCells;
            const gap = next - sorted[index];
            if (!CELL_VALUE[gap]) return null;
            bar.push({ v: CELL_VALUE[gap] });
        }
        return bar;
    }

    /* 한 박을 채우는 조각들. cells는 16분음표 한 칸을 1로 센 길이. */
    const BEAT_PATTERNS = {
        quarter: [{ v: "q" }],
        triplet: [{ v: "te" }, { v: "te" }, { v: "te" }],
        tripletHead: [{ v: "te" }, { v: "te" }, { v: "te", rest: true }],
        rest: [{ v: "q", rest: true }],
        eighths: [{ v: "e" }, { v: "e" }],
        eighthRest: [{ v: "e" }, { v: "e", rest: true }],
        offEighth: [{ v: "e", rest: true }, { v: "e" }],
        sixteenths: [{ v: "s" }, { v: "s" }, { v: "s" }, { v: "s" }],
        twoThenOne: [{ v: "s" }, { v: "s" }, { v: "e" }],
        oneThenTwo: [{ v: "e" }, { v: "s" }, { v: "s" }],
        dottedPair: [{ v: "ed" }, { v: "s" }]
    };

    const LONG_VALUES = { h: 2, hd: 3, w: 4 };

    function pickOne(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    /*
     * 마디 하나를 만든다. beats는 마디의 박 수, names는 쓸 수 있는 조각 이름,
     * longs는 쓸 수 있는 긴 음표다.
     */
    function makeBar(beats, names, longs) {
        const bar = [];
        let left = beats;
        let guard = 0;
        while (left > 0 && guard < 40) {
            guard += 1;
            const canLong = (longs || []).filter(name => LONG_VALUES[name] <= left);
            if (canLong.length && Math.random() < .22) {
                const name = pickOne(canLong);
                bar.push({ v: name });
                left -= LONG_VALUES[name];
                continue;
            }
            pickOne(names).forEach(event => bar.push({ v: event.v, rest: event.rest }));
            left -= 1;
        }
        /* 첫 박이 쉼표로만 시작하면 다시 만든다. */
        if (!bar.length || bar.every(event => event.rest)) return makeBar(beats, names, longs);
        return bar;
    }

    /* 칸으로 답하는 문제는 악보를 한 가지로 정리해 둔다. */
    function canonical(bar, barCells) {
        return fromOnsets(onsets(bar), barCells) || bar;
    }

    function render(bar, options) {
        const settings = options || {};
        const beats = barBeats(bar);
        const width = LEFT + beats * BEAT_W + 26;
        const svg = make("svg", {
            class: "rhythm",
            style: "width:" + Math.round(width * (settings.zoom || 1.6)) + "px",
            viewBox: "0 11 " + width + " 75",
            role: "img",
            "aria-label": settings.label || "리듬 한 마디"
        });

        svg.append(make("line", { class: "rhythm-line", x1: 10, y1: LINE_Y, x2: width - 10, y2: LINE_Y }));
        svg.append(make("line", { class: "rhythm-bar", x1: 10, y1: LINE_Y - 16, x2: 10, y2: LINE_Y + 16 }));
        svg.append(make("line", { class: "rhythm-bar is-end", x1: width - 11, y1: LINE_Y - 16, x2: width - 11, y2: LINE_Y + 16 }));

        if (settings.meter) {
            const parts = settings.meter.split("/");
            svg.append(make("text", { class: "rhythm-meter", x: 26, y: LINE_Y - 3 }, parts[0]));
            svg.append(make("text", { class: "rhythm-meter", x: 26, y: LINE_Y + 17 }, parts[1]));
        }

        /*
         * 음표와 쉼표는 제 길이의 한가운데가 아니라 시작하는 자리에 놓는다. 그래야
         * 박 자리가 눈에 보이고, 긴 음표 뒤로는 그 길이만큼 빈자리가 남는다.
         * 마디 전체를 쉬는 온쉼표만 마디 한가운데에 둔다.
         */
        const xs = [];
        let position = 0;
        bar.forEach(event => {
            const whole = bar.length === 1 && event.rest;
            xs.push(whole ? LEFT + beats * BEAT_W / 2 : LEFT + position * BEAT_W + ONSET_PAD);
            position += VALUES[event.v].beats;
        });

        const beamed = new Set();
        beamGroups(bar).forEach(group => group.items.forEach(index => beamed.add(index)));

        const ink = make("g", { class: "rhythm-ink" + (settings.mark ? " is-" + settings.mark : "") });
        svg.append(ink);

        bar.forEach((event, index) => {
            const value = VALUES[event.v];
            const x = xs[index];
            if (event.rest) {
                const rest = restNode(value.rest, x);
                if (rest) ink.append(rest);
                if (value.dot) ink.append(make("circle", { class: "rhythm-dot", cx: x + 12, cy: LINE_Y - 4, r: 1.9 }));
                return;
            }
            ink.append(headNode(x, LINE_Y, value.hollow));
            if (value.stem) {
                ink.append(make("line", {
                    class: "rhythm-stem",
                    x1: x + HEAD_RX - .6, y1: LINE_Y - 2, x2: x + HEAD_RX - .6, y2: STEM_TOP
                }));
            }
            if (value.dot) ink.append(make("circle", { class: "rhythm-dot", cx: x + 12, cy: LINE_Y - 4, r: 1.9 }));
            /* 무리에 들지 못한 꼬리는 하나씩 그린다. */
            if (value.flags > 0 && !beamed.has(index)) {
                for (let flag = 0; flag < value.flags; flag += 1) {
                    ink.append(flagNode(x + HEAD_RX - .6, STEM_TOP + flag * 7));
                }
            }
        });

        /* 셋잇단 표시는 한 박 안에 이어진 셋잇단 음표 묶음 위에 붙인다. */
        tripletRuns(bar).forEach(run => {
            const stemX = index => xs[index] + HEAD_RX - .6;
            const from = stemX(run[0]);
            const to = stemX(run[run.length - 1]);
            const middle = (from + to) / 2;
            const beamedRun = run.length > 1 && run.every(index => VALUES[bar[index].v].flags > 0);
            /* 대로 이은 무리는 대 위에, 꺾쇠를 씌운 무리는 꺾쇠 사이에 3을 넣는다. */
            const digitY = beamedRun ? STEM_TOP - 6 : STEM_TOP - 3;
            if (!beamedRun) {
                /* 대로 잇지 못한 묶음에는 꺾쇠를 씌운다. */
                const y = STEM_TOP - 7;
                ink.append(make("path", {
                    class: "rhythm-bracket",
                    d: "M" + (from - 3) + "," + (y + 4) + " L" + (from - 3) + "," + y
                        + " L" + (middle - 5) + "," + y
                        + " M" + (middle + 5) + "," + y + " L" + (to + 3) + "," + y
                        + " L" + (to + 3) + "," + (y + 4)
                }));
            }
            ink.append(make("text", { class: "rhythm-triplet", x: middle, y: digitY }, "3"));
        });

        beamGroups(bar).forEach(group => {
            const stemX = index => xs[index] + HEAD_RX - .6;
            const flagsOf = index => VALUES[bar[index].v].flags;
            const depth = Math.max.apply(null, group.items.map(flagsOf));
            for (let level = 0; level < depth; level += 1) {
                const y = STEM_TOP + level * 7;
                /* 둘째 대부터는 그 대를 가진 음표끼리만 잇는다. */
                let run = [];
                const flush = () => {
                    if (!run.length) return;
                    const from = stemX(run[0]);
                    /*
                     * 혼자 남으면 짧은 토막으로 그린다. 토막은 제 무리가 있는 쪽을
                     * 가리켜야 한다 — 무리의 첫 음표면 오른쪽, 아니면 왼쪽이다.
                     */
                    const to = run.length > 1 ? stemX(run[run.length - 1])
                        : from + (run[0] === group.items[0] ? 9 : -9);
                    ink.append(make("line", { class: "rhythm-beam", x1: from, y1: y, x2: to, y2: y }));
                    run = [];
                };
                group.items.forEach(index => {
                    if (flagsOf(index) > level) run.push(index);
                    else flush();
                });
                flush();
            }
        });

        return svg;
    }

    window.RhythmNotation = {
        VALUES: VALUES,
        BEAT_PATTERNS: BEAT_PATTERNS,
        render: render,
        onsets: onsets,
        barCells: barCells,
        PER_BEAT: PER_BEAT,
        sameOnsets: sameOnsets,
        barBeats: barBeats,
        makeBar: makeBar,
        fromOnsets: fromOnsets,
        canonical: canonical
    };
})();
