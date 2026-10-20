(function () {
    "use strict";

    const SVG_NS = "http://www.w3.org/2000/svg";

    /*
     * 5도권을 시계 방향으로 늘어놓는다. same은 같은 소리를 다른 이름으로도 적는
     * 자리다. 조표가 일곱 개가 되는 C♯ 장조(♯7)와 C♭ 장조(♭7)는 요즘 쓰지 않고
     * 각각 D♭·B로 적으므로 넣지 않는다. 반반으로 쓰이는 F♯·G♭만 둘 다 적는다.
     */
    const KEYS = [
        { major: "C", minor: "Am", count: 0, sharp: true, tonic: 0, letter: 0, acc: 0 },
        { major: "G", minor: "Em", count: 1, sharp: true, tonic: 7, letter: 4, acc: 0 },
        { major: "D", minor: "Bm", count: 2, sharp: true, tonic: 2, letter: 1, acc: 0 },
        { major: "A", minor: "F♯m", count: 3, sharp: true, tonic: 9, letter: 5, acc: 0 },
        { major: "E", minor: "C♯m", count: 4, sharp: true, tonic: 4, letter: 2, acc: 0 },
        { major: "B", minor: "G♯m", count: 5, sharp: true, tonic: 11, letter: 6, acc: 0 },
        {
            major: "F♯", minor: "D♯m", count: 6, sharp: true, tonic: 6, letter: 3, acc: 1, same: "G♭",
            alt: "G♭", altMinor: "E♭m", altCount: 6, altSharp: false, altLetter: 4, altAcc: -1, altSame: "F♯"
        },
        { major: "D♭", minor: "B♭m", count: 5, sharp: false, tonic: 1, letter: 1, acc: -1 },
        { major: "A♭", minor: "Fm", count: 4, sharp: false, tonic: 8, letter: 5, acc: -1 },
        { major: "E♭", minor: "Cm", count: 3, sharp: false, tonic: 3, letter: 2, acc: -1 },
        { major: "B♭", minor: "Gm", count: 2, sharp: false, tonic: 10, letter: 6, acc: -1 },
        { major: "F", minor: "Dm", count: 1, sharp: false, tonic: 5, letter: 3, acc: 0 }
    ];

    /*
     * 으뜸조에서 5도권으로 이어진 일곱 자리가 그 조의 화음이 된다.
     * 반시계 한 자리가 IV, 제자리가 I, 시계로 다섯 자리가 V·ii·vi·iii·vii°.
     */
    const FUNCTIONS = [
        { step: -1, roman: "IV", ko: "버금딸림", quality: "maj", degree: 3 },
        { step: 0, roman: "I", ko: "으뜸", quality: "maj", degree: 0 },
        { step: 1, roman: "V", ko: "딸림", quality: "maj", degree: 4 },
        { step: 2, roman: "ii", ko: "", quality: "min", degree: 1 },
        { step: 3, roman: "vi", ko: "", quality: "min", degree: 5 },
        { step: 4, roman: "iii", ko: "", quality: "min", degree: 2 },
        { step: 5, roman: "vii°", ko: "", quality: "dim", degree: 6 }
    ];

    /*
     * 한 조의 음을 그대로 두고 어느 음에서 시작하느냐에 따라 선법이 정해진다.
     * 그래서 화음 기능 고리와 같은 일곱 자리에 같은 차례로 놓인다.
     * 예를 들어 다장조에서 ii 자리인 D에서 시작하면 D Dorian이다.
     */
    const MODES = [
        { step: -1, name: "Lydian", steps: [0, 2, 4, 6, 7, 9, 11, 12] },
        { step: 0, name: "Ionian", steps: [0, 2, 4, 5, 7, 9, 11, 12] },
        { step: 1, name: "Mixolydian", steps: [0, 2, 4, 5, 7, 9, 10, 12] },
        { step: 2, name: "Dorian", steps: [0, 2, 3, 5, 7, 9, 10, 12] },
        { step: 3, name: "Aeolian", steps: [0, 2, 3, 5, 7, 8, 10, 12] },
        { step: 4, name: "Phrygian", steps: [0, 1, 3, 5, 7, 8, 10, 12] },
        { step: 5, name: "Locrian", steps: [0, 1, 3, 5, 6, 8, 10, 12] }
    ];

    const R_MODE_OUT = 208;
    const R_MODE_IN = 178;
    const R_FUNC_OUT = 178;
    const R_FUNC_IN = 142;
    const R_MAJ_OUT = 142;
    const R_MAJ_IN = 100;
    const R_MIN_OUT = 100;
    const R_MIN_IN = 64;
    const SECTOR = 30;

    function make(tag, attrs, text) {
        const node = document.createElementNS(SVG_NS, tag);
        Object.keys(attrs || {}).forEach(key => node.setAttribute(key, attrs[key]));
        if (text !== undefined) node.textContent = text;
        return node;
    }

    /*
     * 이름을 조각내어 적는다. 올림표·내림표는 글자와 같은 크기로 두면 자리를 너무
     * 먹으므로 작게 붙이고, 괄호 안에 적은 같은 소리의 다른 이름은 더 작게 적는다.
     */
    const ACC_CHARS = "\u266F\u266D\u266E";

    function setName(node, text) {
        node.textContent = "";
        let plain = "";
        let inside = false;
        const flush = () => {
            if (!plain) return;
            node.append(make("tspan", inside ? { class: "sub" } : {}, plain));
            plain = "";
        };
        for (let index = 0; index < text.length; index += 1) {
            const char = text.charAt(index);
            if (char === "(" || char === ")") {
                flush();
                inside = char === "(";
                node.append(make("tspan", { class: "sub" }, char));
                continue;
            }
            if (!inside && ACC_CHARS.indexOf(char) >= 0) {
                flush();
                node.append(make("tspan", { class: "acc" }, char));
                continue;
            }
            plain += char;
        }
        flush();
    }

    /* 같은 소리의 다른 이름은 괄호로 잇대어 적는다. F♯(G♭)처럼. */
    function withSame(name, same) {
        return same ? name + "(" + same + ")" : name;
    }

    function point(radius, degrees) {
        const radians = (degrees - 90) * Math.PI / 180;
        return [radius * Math.cos(radians), radius * Math.sin(radians)];
    }

    /*
     * 조표는 오선을 그리지 않고 올림표·내림표만 작게 모아 그린다. 몇 개인지가
     * 한눈에 보이면 되므로 오선과 자리표는 자리만 차지한다. 글꼴 글리프는
     * 컴퓨터마다 크기가 달라지므로 획을 직접 그린다.
     */
    function keySignature(count, sharp) {
        const label = count ? (sharp ? "올림표 " : "내림표 ") + count + "개" : "조표 없음";
        const holder = make("g", { class: "wheel-key-sig", role: "img", "aria-label": label });
        if (count && window.Notation) {
            const char = sharp ? "♯" : "♭";
            const ink = window.Notation.inkBox(char);
            const height = 18;
            const width = ink.right * height / ink.height;
            const gap = 4;
            const total = count * width + (count - 1) * gap;
            for (let at = 0; at < count; at += 1) {
                holder.append(window.Notation.glyph(char, "wheel-signature-mark",
                    -total / 2 + at * (width + gap) + width, -6, height, .5));
            }
        }
        holder.append(make("text", { class: "wheel-signature-count", x: 0, y: count ? 19 : 0 }, label));
        return holder;
    }

    function sectorPath(rIn, rOut, from, to) {
        const [x1, y1] = point(rOut, from);
        const [x2, y2] = point(rOut, to);
        const [x3, y3] = point(rIn, to);
        const [x4, y4] = point(rIn, from);
        return "M" + x1 + "," + y1
            + "A" + rOut + "," + rOut + " 0 0 1 " + x2 + "," + y2
            + "L" + x3 + "," + y3
            + "A" + rIn + "," + rIn + " 0 0 0 " + x4 + "," + y4
            + "Z";
    }

    const SPIN_MS = 480;
    const slowMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function create(container, options) {
        const settings = options || {};
        let index = 0;
        let flat = false;
        let turn = 0;
        let spin = 0;
        let settle = 0;

        const svg = make("svg", {
            class: "wheel",
            viewBox: "-216 -216 432 432",
            role: "group",
            "aria-label": "5도권 원판"
        });

        /* 바깥 고정 고리: 선법 */
        const modeLayer = make("g", { class: "wheel-modes" });
        svg.append(modeLayer);
        MODES.forEach(mode => {
            const center = mode.step * SECTOR;
            const cell = make("path", {
                class: "wheel-mode-cell" + (mode.step === 0 ? " is-home" : ""),
                role: "button", tabindex: "0", "aria-label": mode.name + " 선법 듣기",
                d: sectorPath(R_MODE_IN, R_MODE_OUT, center - SECTOR / 2, center + SECTOR / 2)
            });
            cell.dataset.mode = mode.name;
            modeLayer.append(cell);
            const [x, y] = point((R_MODE_IN + R_MODE_OUT) / 2, center);
            /* 글자를 고리 방향으로 눕히되, 뒤집히는 자리에서는 180도 돌려 바로 읽히게 한다. */
            const lean = Math.abs(center) <= 90 ? center : center + 180;
            const name = make("text", { class: "wheel-mode-name" }, mode.name);
            name.setAttribute("transform", "translate(" + x + "," + y + ") rotate(" + lean + ")");
            modeLayer.append(name);
        });

        /* 고정 고리: 화음 기능 */
        const funcLayer = make("g", { class: "wheel-func" });
        svg.append(funcLayer);
        FUNCTIONS.forEach(fn => {
            const center = fn.step * SECTOR;
            const cell = make("path", {
                class: "wheel-func-cell is-" + fn.quality,
                role: "button", tabindex: "0", "aria-label": fn.roman + " 화음 듣기",
                d: sectorPath(R_FUNC_IN, R_FUNC_OUT, center - SECTOR / 2, center + SECTOR / 2)
            });
            cell.dataset.degree = String(fn.degree);
            funcLayer.append(cell);

            const [rx, ry] = point((R_FUNC_IN + R_FUNC_OUT) / 2, center);
            funcLayer.append(make("text", { class: "wheel-roman", x: rx, y: ry }, fn.roman));
        });

        /* 도는 원판 */
        const disc = make("g", { class: "wheel-disc" });
        svg.append(disc);
        const majorCells = [];
        const minorCells = [];
        const majorTexts = [];
        const minorTexts = [];

        KEYS.forEach((key, position) => {
            const center = position * SECTOR;
            const major = make("path", {
                class: "wheel-cell wheel-cell-major",
                role: "button", tabindex: "0",
                d: sectorPath(R_MAJ_IN, R_MAJ_OUT, center - SECTOR / 2, center + SECTOR / 2)
            });
            major.dataset.position = String(position);
            disc.append(major);
            majorCells.push(major);

            const minor = make("path", {
                class: "wheel-cell wheel-cell-minor",
                role: "button", tabindex: "0",
                d: sectorPath(R_MIN_IN, R_MIN_OUT, center - SECTOR / 2, center + SECTOR / 2)
            });
            minor.dataset.position = String(position);
            disc.append(minor);
            minorCells.push(minor);

            majorTexts.push(make("text", { class: "wheel-major-name" }));
            minorTexts.push(make("text", { class: "wheel-minor-name" }));
        });
        majorTexts.concat(minorTexts).forEach(node => disc.append(node));

        /* 가운데 */
        const hub = make("g", { class: "wheel-hub" });
        svg.append(hub);
        hub.append(make("circle", { class: "wheel-hub-face", cx: 0, cy: 0, r: R_MIN_IN }));
        const hubMajorButton = make("rect", { class: "wheel-key-preview", role: "button", tabindex: "0", "data-quality": "maj", x: -52, y: -52, width: 104, height: 28, fill: "transparent" });
        const hubMinorButton = make("rect", { class: "wheel-key-preview", role: "button", tabindex: "0", "data-quality": "min", x: -52, y: -25, width: 104, height: 24, fill: "transparent" });
        const hubMajor = make("text", { class: "wheel-hub-major", x: 0, y: -30 });
        const hubMinor = make("text", { class: "wheel-hub-minor", x: 0, y: -9 });
        const hubSign = make("g", { class: "wheel-hub-sig", transform: "translate(0,26)" });
        hub.append(hubMajorButton, hubMinorButton, hubMajor, hubMinor, hubSign);

        container.innerHTML = "";
        container.append(svg);

        function keyAt(position) {
            const key = KEYS[((position % 12) + 12) % 12];
            if (!flat || !key.alt) {
                return {
                    major: key.major, minor: key.minor, count: key.count, sharp: key.sharp,
                    tonic: key.tonic, letter: key.letter, acc: key.acc, same: key.same
                };
            }
            return {
                major: key.alt, minor: key.altMinor, count: key.altCount, sharp: key.altSharp,
                tonic: key.tonic, letter: key.altLetter, acc: key.altAcc, same: key.altSame
            };
        }

        /* 원판을 돌린 만큼만 다시 그린다. 글자는 되돌려 돌려 늘 바로 세워 둔다. */
        function applyTurn(value) {
            disc.setAttribute("transform", "rotate(" + value + ")");
            const upright = " rotate(" + (-value) + ")";
            KEYS.forEach((key, position) => {
                const center = position * SECTOR;
                const [mx, my] = point((R_MAJ_IN + R_MAJ_OUT) / 2, center);
                majorTexts[position].setAttribute("transform", "translate(" + mx + "," + my + ")" + upright);
                const [nx, ny] = point((R_MIN_IN + R_MIN_OUT) / 2, center);
                minorTexts[position].setAttribute("transform", "translate(" + nx + "," + ny + ")" + upright);
            });
        }

        /* 글자와 가운데 표시를 다시 적는다. */
        function relabel() {
            KEYS.forEach((key, position) => {
                const shown = keyAt(position);
                setName(majorTexts[position], withSame(shown.major, shown.same));
                setName(minorTexts[position], shown.minor);
                majorCells[position].setAttribute("aria-label", shown.major + " 장조 선택하고 장3화음 듣기");
                minorCells[position].setAttribute("aria-label", shown.minor.slice(0, -1) + " 단조 선택하고 단3화음 듣기");
                majorCells[position].classList.toggle("is-tonic", position === index);
            });
            const home = keyAt(index);
            /* 가운데는 괄호 병기를 빼서 읽기 쉽게 둔다. 병기는 칸에만 남긴다. */
            setName(hubMajor, home.major + " major");
            setName(hubMinor, home.minor.replace("m", "") + " minor");
            hubMajorButton.setAttribute("aria-label", home.major + " 장3화음 다시 듣기");
            hubMinorButton.setAttribute("aria-label", home.minor + " 단3화음 다시 듣기");
            hubSign.innerHTML = "";
            hubSign.append(keySignature(home.count, home.sharp));
            if (settings.onChange) settings.onChange(chords(), home);
        }

        function spinTo(target) {
            window.cancelAnimationFrame(spin);
            window.clearTimeout(settle);
            if (slowMotion || document.visibilityState === "hidden") {
                turn = target;
                applyTurn(turn);
                return;
            }
            /* 다른 탭으로 넘어가 애니메이션이 멈춰도 제자리에 앉도록 한다. */
            settle = window.setTimeout(() => {
                window.cancelAnimationFrame(spin);
                turn = target;
                applyTurn(turn);
            }, SPIN_MS + 120);
            const from = turn;
            const delta = target - from;
            const started = window.performance.now();
            const frame = now => {
                const ratio = Math.min(1, (now - started) / SPIN_MS);
                const eased = 1 - Math.pow(1 - ratio, 3);
                turn = from + delta * eased;
                applyTurn(turn);
                if (ratio < 1) spin = window.requestAnimationFrame(frame);
                else { window.clearTimeout(settle); turn = target; applyTurn(turn); }
            };
            spin = window.requestAnimationFrame(frame);
        }

        /* 반 바퀴가 넘게 돌지 않도록 가까운 쪽으로 돌린다. */
        function nearestAngle(position) {
            let target = -position * SECTOR;
            while (target - turn > 180) target -= 360;
            while (target - turn < -180) target += 360;
            return target;
        }

        /*
         * 이명동음 자리는 돌아온 쪽으로 적는다. 샾 쪽으로 돌아 도착하면 F♯,
         * 플랫 쪽으로 돌아 도착하면 G♭이다. 5도권을 따라 걸어온 길이 곧 조표이므로
         * 음악가가 실제로 그렇게 적는다. way가 1이면 샾 쪽, -1이면 플랫 쪽이다.
         */
        function spellByArrival(way) {
            if (!way || !KEYS[index].alt) return;
            flat = way < 0;
        }

        function select(position, animate, way) {
            index = ((position % 12) + 12) % 12;
            const target = nearestAngle(index);
            spellByArrival(way === undefined ? (target < turn ? 1 : target > turn ? -1 : 0) : way);
            relabel();
            if (animate === false) { turn = target; applyTurn(turn); }
            else spinTo(target);
        }

        function layout() {
            relabel();
            applyTurn(turn);
        }

        function chords() {
            return FUNCTIONS.slice()
                .sort((a, b) => a.degree - b.degree)
                .map(fn => ({
                    roman: fn.roman,
                    quality: fn.quality,
                    role: fn.ko,
                    degree: fn.degree
                }));
        }

        /* 손으로 잡아 돌리기 */
        let drag = null;
        let spunAt = 0;

        function pointerAngle(event) {
            const box = svg.getBoundingClientRect();
            const dx = event.clientX - (box.left + box.width / 2);
            const dy = event.clientY - (box.top + box.height / 2);
            return Math.atan2(dy, dx) * 180 / Math.PI;
        }

        disc.addEventListener("pointerdown", event => {
            window.cancelAnimationFrame(spin);
            window.clearTimeout(settle);
            const capture = event.target.closest(".wheel-cell") || disc;
            drag = { from: pointerAngle(event), turn: turn, moved: 0, capture: capture };
            disc.classList.add("is-dragging");
            capture.setPointerCapture(event.pointerId);
        });

        disc.addEventListener("pointermove", event => {
            if (!drag) return;
            let delta = pointerAngle(event) - drag.from;
            while (delta > 180) delta -= 360;
            while (delta < -180) delta += 360;
            drag.moved = Math.max(drag.moved, Math.abs(delta));
            turn = drag.turn + delta;
            applyTurn(turn);
        });

        function endDrag(event) {
            if (!drag) return;
            const spun = drag.moved;
            const way = turn < drag.turn ? 1 : turn > drag.turn ? -1 : 0;
            const capture = drag.capture;
            drag = null;
            disc.classList.remove("is-dragging");
            if (capture.hasPointerCapture(event.pointerId)) capture.releasePointerCapture(event.pointerId);
            const landed = Math.round(-turn / SECTOR);
            index = ((landed % 12) + 12) % 12;
            spellByArrival(way);
            relabel();
            spinTo(-landed * SECTOR);
            /* 돌리고 손을 뗄 때 따라 나오는 클릭 하나만 걸러 낸다. */
            spunAt = spun > 6 ? window.performance.now() : 0;
            if (spun > 6 && event.type !== "pointercancel" && settings.onPlayKey) settings.onPlayKey(keyAt(index), "maj");
        }

        disc.addEventListener("pointerup", endDrag);
        disc.addEventListener("pointercancel", endDrag);

        function activate(target) {
            const cell = target.closest(".wheel-cell");
            if (cell) {
                select(Number(cell.dataset.position));
                if (settings.onPlayKey) settings.onPlayKey(keyAt(index), cell.classList.contains("wheel-cell-minor") ? "min" : "maj");
                return;
            }
            const preview = target.closest(".wheel-key-preview");
            if (preview) {
                if (settings.onPlayKey) settings.onPlayKey(keyAt(index), preview.dataset.quality);
                return;
            }
            const funcCell = target.closest(".wheel-func-cell");
            if (funcCell && settings.onPlayChord) {
                settings.onPlayChord(chords().find(chord => chord.degree === Number(funcCell.dataset.degree)), keyAt(index));
                return;
            }
            const modeCell = target.closest(".wheel-mode-cell");
            if (modeCell && settings.onPlayMode) {
                const mode = MODES.find(entry => entry.name === modeCell.dataset.mode);
                settings.onPlayMode(mode, keyAt(index + mode.step));
            }
        }

        svg.addEventListener("pointerdown", () => { spunAt = 0; });
        svg.addEventListener("click", event => {
            if (spunAt && window.performance.now() - spunAt < 300) return;
            activate(event.target);
        });
        svg.addEventListener("keydown", event => {
            if (event.key !== "Enter" && event.key !== " ") return;
            if (!event.target.closest('[role="button"]')) return;
            event.preventDefault();
            if (!event.repeat) activate(event.target);
        });

        layout();

        return {
            setKey: function (name) {
                const position = KEYS.findIndex(key => key.major === name || key.alt === name);
                if (position < 0) return;
                window.cancelAnimationFrame(spin);
                window.clearTimeout(settle);
                flat = KEYS[position].alt === name;
                select(position, false, 0);
            },
            step: function (delta) {
                select(index + delta, true, delta > 0 ? 1 : -1);
                if (settings.onPlayKey) settings.onPlayKey(keyAt(index), "maj");
            },
            toggleFlat: function () {
                flat = !flat;
                layout();
                if (settings.onPlayKey) settings.onPlayKey(keyAt(index), "maj");
                return flat;
            },
            chords: chords,
            home: function () { return keyAt(index); }
        };
    }

    window.Wheel = { create: create, KEYS: KEYS, FUNCTIONS: FUNCTIONS, MODES: MODES };
})();
