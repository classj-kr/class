(function () {
    'use strict';
    const RN = window.RhythmNotation, BAR_CELLS = 48;
    const pick = list => list[Math.floor(Math.random() * list.length)];
    function shuffled(list) {
        const out = list.slice();
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    }
    const RHYTHM_SETS = {
        g4: { cells: 4, beat: ["quarter", "rest"], longs: ["h", "hd", "w"] },
        g8: { cells: 8, beat: ["quarter", "eighths"], longs: ["h"] },
        g8r: { cells: 8, beat: ["quarter", "eighths", "rest", "eighthRest", "offEighth"], longs: ["h", "hd"] },
        g16: { cells: 16, beat: ["eighths", "sixteenths", "twoThenOne", "oneThenTwo", "middleEighth", "dottedPair", "reverseDotted", "restSixteenthPair", "restSixteenthRun"], longs: ["h"] },
        gdot: { cells: 16, beat: ["quarter", "eighths", "dottedPair", "oneThenTwo", "rest"], longs: ["h", "hd"] },
        gtie: { cells: 8, beat: ["quarter", "eighths", "offEighth", "eighthRest"], longs: ["h", "hd", "w"] },
        pick: { cells: 16, beat: ["quarter", "eighths", "sixteenths", "twoThenOne", "oneThenTwo", "dottedPair", "rest", "eighthRest"], longs: ["h", "hd"] },
        trip: { cells: 0, triplets: true, beat: ["quarter", "eighths", "triplet"], longs: ["h"] },
        tripMix: { cells: 0, triplets: true, beat: ["quarter", "eighths", "sixteenths", "triplet", "tripletHead", "rest"], longs: ["h"] }
    };

    /*
     * 치는 자리에서 다음 칠 자리까지 이어지는 길이를 박 단위로 표기한다.
     * 박을 넘는 음은 붙임줄로 이어도 실제 타격 수와 채점 기준은 그대로다.
     */
    function rhythmBar(setName) {
        const set = RHYTHM_SETS[setName];
        const names = set.beat.map(name => RN.BEAT_PATTERNS[name]);
        let last = null;
        for (let tries = 0; tries < 80; tries += 1) {
            last = RN.makeBar(4, names, set.longs);
            const bar = RN.fromOnsets(RN.onsets(last), RN.barCells(last));
            if (bar) return { bar: bar, cells: set.cells };
        }
        return { bar: last, cells: set.cells };
    }

    /* 칸으로 답하는 문제. 악보는 한 가지로 정리해 둔다. */
    function rhythmGridQuestion(item) {
        const made = rhythmBar(item.set);
        const bar = RN.canonical(made.bar, BAR_CELLS);
        const step = BAR_CELLS / made.cells;
        const cells = RN.onsets(bar).map(cell => Math.round(cell / step));
        return {
            silentStaff: true,
            rhythm: { bar: bar, onsets: RN.onsets(bar) },
            grid: { cells: made.cells, answer: cells },
            detail: made.cells + "칸"
        };
    }

    /* 악보를 골라 답하는 문제. 보기끼리 치는 자리가 겹치지 않게 고른다. */
    /*
     * 치는 자리 하나를 바로 옆 자리로 옮겨 다른 마디를 만든다. 치는 수가 그대로이고
     * 악보도 한 군데만 달라 보이므로, 개수를 세거나 모양을 훑는 것으로는 가릴 수 없고
     * 어디서 치는지를 들어야 한다. 적을 수 없는 자리가 나오면 null을 돌려준다.
     */
    const NUDGES = [3, -3, 4, -4, 6, -6, 2, -2, 9, -9, 12, -12, 18, -18, 24, -24];

    function nudgeOnsets(cells, allowFirst, step) {
        const taken = new Set(cells);
        /* 첫 박은 되도록 그대로 두어 시작을 견주지 못하게 한다. */
        const movable = allowFirst ? cells.slice() : cells.filter(cell => cell > 0);
        if (!movable.length) return null;
        const order = shuffled(movable);
        for (let index = 0; index < order.length; index += 1) {
            const from = order[index];
            const ways = shuffled(NUDGES);
            for (let way = 0; way < ways.length; way += 1) {
                const to = from + ways[way];
                if (to < 0 || to >= BAR_CELLS || taken.has(to)) continue;
                if (step && to % step !== 0) continue;
                if (!step) {
                    // Mixed exercises may use either subdivision in a beat,
                    // but must not put straight sixteenths inside a triplet.
                    const beatStart = Math.floor(to / RN.PER_BEAT) * RN.PER_BEAT;
                    const tripletBeat = cells.some(cell => cell >= beatStart && cell < beatStart + RN.PER_BEAT && cell % 3 !== 0);
                    if (to % (tripletBeat ? 4 : 3) !== 0) continue;
                }
                const moved = cells.filter(cell => cell !== from).concat([to]).sort((a, b) => a - b);
                const bar = RN.fromOnsets(moved, BAR_CELLS);
                if (bar) return bar;
            }
        }
        return null;
    }

    /*
     * 악보를 골라 답하는 문제. 보기 넷은 치는 자리 수가 모두 같아야 한다. 수가
     * 다르면 소리를 몇 번 들었는지 손가락으로 세기만 해도 답이 나온다.
     */
    function rhythmChoiceQuestion(item) {
        /*
         * 정답도 보기와 같은 방법으로 적어야 한다. 만든 그대로 두면 정답만
         * 8분음표+8분쉼표처럼 쉼표를 품어, 쉼표가 있는 보기를 찾으면 답이 된다.
         */
        const gridCells = RHYTHM_SETS[item.set].cells;
        const step = gridCells ? BAR_CELLS / gridCells : item.set === "trip" ? 4 : 0;
        let answer = RN.canonical(rhythmBar(item.set).bar, BAR_CELLS);
        const attacks = RN.onsets(answer);
        // A completely filled grid has no different pattern with the same
        // attack count. Leave one gap so four valid choices are possible.
        const fullyFilled = [0, 1, 2, 3].every(beat => {
            const start = beat * RN.PER_BEAT;
            const positions = attacks.filter(cell => cell >= start && cell < start + RN.PER_BEAT);
            const grid = positions.some(cell => cell % 3 !== 0) ? [0, 4, 8] : [0, 3, 6, 9];
            return grid.every(offset => attacks.includes(start + offset));
        });
        if (step && attacks.length === BAR_CELLS / step || fullyFilled) answer = RN.fromOnsets(attacks.slice(0, -1), BAR_CELLS);
        const want = RN.onsets(answer).length;
        const bars = [answer];
        const fresh = bar => bar && RN.barCells(bar) === BAR_CELLS
            && RN.onsets(bar).length === want
            && !bars.some(existing => RN.sameOnsets(existing, bar));

        /* 정답에서 한 자리만 옮겨 만든다. 첫 박을 그대로 둔 것부터 찾는다. */
        const fill = (make, tries) => {
            let guard = 0;
            while (bars.length < 4 && guard < tries) {
                guard += 1;
                const other = make();
                if (fresh(other)) bars.push(other);
            }
        };
        fill(() => nudgeOnsets(RN.onsets(answer), false, step), 300);
        fill(() => nudgeOnsets(RN.onsets(answer), true, step), 300);
        fill(() => nudgeOnsets(RN.onsets(pick(bars)), true, step), 200);
        fill(() => RN.canonical(rhythmBar(item.set).bar, BAR_CELLS), 300);

        const order = shuffled(bars);
        return {
            silentStaff: true,
            rhythm: { bar: answer, onsets: RN.onsets(answer) },
            bars: { list: order, answer: order.indexOf(answer) },
            detail: ""
        };
    }


    const SETS = ['g4', 'g8r', 'g8', 'g16', 'gtie', 'gdot', 'trip', 'tripMix'];
    window.RhythmQuestions = {
        sets: RHYTHM_SETS,
        make(level, kind = 'grid') {
            const set = SETS[level] || 'g4';
            return kind === 'choice' || !RHYTHM_SETS[set].cells
                ? rhythmChoiceQuestion({ set }) : rhythmGridQuestion({ set });
        },
        makeBar: rhythmBar,
        choice: rhythmChoiceQuestion,
        grid: rhythmGridQuestion
    };
})();
