(function () {
    "use strict";

    const byId = id => document.getElementById(id);
    const pick = list => list[Math.floor(Math.random() * list.length)];
    const randomInt = (low, high) => low + Math.floor(Math.random() * (high - low + 1));

    /* sort(() => Math.random() - .5)는 고르게 섞이지 않는다. */
    function shuffled(list) {
        const out = list.slice();
        for (let index = out.length - 1; index > 0; index -= 1) {
            const swap = Math.floor(Math.random() * (index + 1));
            const held = out[index];
            out[index] = out[swap];
            out[swap] = held;
        }
        return out;
    }
    const N = window.Notation;

    /* 표기는 영어(한글)로 적는다. 괄호 앞의 U+200B는 좁은 화면에서 줄을 나눌 자리다. */
    function label(english, korean) {
        return english + "​(" + korean + ")";
    }

    /* 건반에 보이는 범위: 가온도부터 두 옥타브 위 A까지 */
    const KEY_LOW = 60;
    const KEY_HIGH = 81;
    /* 차시의 건반은 근음을 고르는 데 쓰므로, 그 위 한 옥타브까지 보여 준다. */
    const LESSON_KEY_HIGH = 84;

    /*
     * 기준음은 검은건반도 나와야 한다. 다만 겹임시표(F♯♯, B♭♭)가 생기는 자리는
     * 읽기 어려우니, 구성음이 모두 홑임시표로 적히는 기준음만 모아 두고 그중에서 고른다.
     */
    const ACCIDENTALS = [-1, 0, 1];
    const rootCache = {};

    /* E♯·B♯·C♭·F♭은 F·C·B·E로 적는 자리라 기준음으로 쓰지 않는다. */
    function oddSpelling(letter, accidental) {
        return (accidental === 1 && (letter === 2 || letter === 6))
            || (accidental === -1 && (letter === 0 || letter === 3));
    }

    function collectRoots(key, lowAbs, highAbs, build) {
        if (rootCache[key]) return rootCache[key];
        const list = [];
        for (let letterAbs = lowAbs; letterAbs <= highAbs; letterAbs += 1) {
            ACCIDENTALS.forEach(accidental => {
                const root = N.spell(letterAbs, accidental);
                if (oddSpelling(root.letter, accidental)) return;
                const notes = build(root);
                if (!notes) return;
                if (notes.some(note => Math.abs(note.accidental) > 1)) return;
                if (notes.some(note => oddSpelling(note.letter, note.accidental))) return;
                list.push(root);
            });
        }
        rootCache[key] = list.length ? list : [N.natural(lowAbs)];
        return rootCache[key];
    }

    function inRange(notes, low, high) {
        const midis = notes.map(note => note.midi);
        return Math.min.apply(null, midis) >= low && Math.max.apply(null, midis) <= high;
    }

    /* 음정 ------------------------------------------------------------- */
    const INTERVALS = [
        { id: "m2", en: "m2", ko: "단2도", degree: 1, semis: 1 },
        { id: "M2", en: "M2", ko: "장2도", degree: 1, semis: 2 },
        { id: "m3", en: "m3", ko: "단3도", degree: 2, semis: 3 },
        { id: "M3", en: "M3", ko: "장3도", degree: 2, semis: 4 },
        { id: "P4", en: "P4", ko: "완전4도", degree: 3, semis: 5 },
        { id: "A4", en: "A4", ko: "증4도", degree: 3, semis: 6 },
        { id: "P5", en: "P5", ko: "완전5도", degree: 4, semis: 7 },
        { id: "m6", en: "m6", ko: "단6도", degree: 5, semis: 8 },
        { id: "M6", en: "M6", ko: "장6도", degree: 5, semis: 9 },
        { id: "m7", en: "m7", ko: "단7도", degree: 6, semis: 10 },
        { id: "M7", en: "M7", ko: "장7도", degree: 6, semis: 11 },
        { id: "P8", en: "P8", ko: "완전8도", degree: 7, semis: 12 },
        { id: "m9", en: "m9", ko: "단9도", degree: 8, semis: 13, roots: [28, 29] },
        { id: "M9", en: "M9", ko: "장9도", degree: 8, semis: 14, roots: [28, 29] },
        { id: "m10", en: "m10", ko: "단10도", degree: 9, semis: 15, roots: [28, 29] },
        { id: "M10", en: "M10", ko: "장10도", degree: 9, semis: 16, roots: [28, 29] },
        { id: "P11", en: "P11", ko: "완전11도", degree: 10, semis: 17, roots: [28, 29] },
        { id: "A11", en: "A11", ko: "증11도", degree: 10, semis: 18, roots: [28, 29] },
        { id: "P12", en: "P12", ko: "완전12도", degree: 11, semis: 19, roots: [28, 29] }
    ];

    /*
     * 소리는 같지만 적는 법이 다른 음정. 귀로는 구별할 수 없어 문제로 내지 않고
     * 설명 차시의 보기로만 쓴다.
     */
    const DISPLAY_INTERVALS = [
        { id: "d5", en: "d5", ko: "감5도", degree: 4, semis: 6 }
    ];

    /* 악보를 보고 이름을 말하는 문제에서 따로 고르는 두 가지 */
    const QUALITIES = [
        { id: "P", en: "Perfect", ko: "완전" },
        { id: "M", en: "Major", ko: "장" },
        { id: "m", en: "Minor", ko: "단" },
        { id: "d", en: "Diminished", ko: "감" },
        { id: "A", en: "Augmented", ko: "증" }
    ];

    const NUMBERS = [
        { id: 1, en: "2nd", ko: "2도" },
        { id: 2, en: "3rd", ko: "3도" },
        { id: 3, en: "4th", ko: "4도" },
        { id: 4, en: "5th", ko: "5도" },
        { id: 5, en: "6th", ko: "6도" },
        { id: 6, en: "7th", ko: "7도" },
        { id: 7, en: "Octave", ko: "8도" },
        { id: 8, en: "9th", ko: "9도" },
        { id: 9, en: "10th", ko: "10도" },
        { id: 10, en: "11th", ko: "11도" },
        { id: 11, en: "12th", ko: "12도" }
    ];

    const SIMPLE_INTERVAL_IDS = ["m2", "M2", "m3", "M3", "P4", "A4", "P5", "m6", "M6", "m7", "M7", "P8"];
    const COMPOUND_INTERVAL_IDS = ["m9", "M9", "m10", "M10", "P11", "A11", "P12"];


    /*
     * 텐션 화음 --------------------------------------------------------
     * 왼손에 뿌리음, 오른손에 넷. 오른손은 뿌리음보다 한 옥타브 위에 얹으므로
     * 뿌리음에서 센 겹음정으로 적는다(3음이 10도, 7음이 14도가 된다).
     * 텐션이 하나면 5도를 넣어 자리를 메우고, 둘이면 5도를 빼고 그 자리에 넣는다.
     */
    const HI = {
        m3: [9, 15], M3: [9, 16], p5: [11, 19], s5: [11, 20],
        six: [12, 21], b13: [12, 20], b7: [13, 22], M7: [13, 23],
        b9: [15, 25], nine: [15, 26], s9: [15, 27],
        eleven: [17, 29], s11: [17, 30]
    };

    const TENSION_CHORDS = [
        { id: "maj9", en: "maj9", ko: "장9화음", bass: true, tones: [HI.M3, HI.p5, HI.M7, HI.nine] },
        { id: "maj13", en: "maj13", ko: "장13화음", bass: true, tones: [HI.M3, HI.M7, HI.nine, HI.six] },
        { id: "sixnine", en: "6/9", ko: "6·9화음", bass: true, tones: [HI.M3, HI.p5, HI.six, HI.nine] },
        { id: "m9", en: "m9", ko: "단9화음", bass: true, tones: [HI.m3, HI.p5, HI.b7, HI.nine] },
        { id: "m11", en: "m11", ko: "단11화음", bass: true, tones: [HI.m3, HI.b7, HI.nine, HI.eleven] },
        { id: "m13", en: "m13", ko: "단13화음", bass: true, tones: [HI.m3, HI.b7, HI.nine, HI.six] },
        { id: "msixnine", en: "m6/9", ko: "단6·9화음", bass: true, tones: [HI.m3, HI.p5, HI.six, HI.nine] },
        { id: "mmaj9", en: "mMaj9", ko: "단장9화음", bass: true, tones: [HI.m3, HI.p5, HI.M7, HI.nine] },
        { id: "dom9", en: "9", ko: "속9화음", bass: true, tones: [HI.M3, HI.p5, HI.b7, HI.nine] },
        { id: "dom13", en: "13", ko: "속13화음", bass: true, tones: [HI.M3, HI.b7, HI.nine, HI.six] },
        { id: "dom9s11", en: "9♯11", ko: "속9화음♯11", bass: true, tones: [HI.M3, HI.b7, HI.nine, HI.s11] },
        { id: "dom7b9", en: "7♭9", ko: "속7화음♭9", bass: true, tones: [HI.M3, HI.p5, HI.b7, HI.b9] },
        { id: "dom7s9", en: "7♯9", ko: "속7화음♯9", bass: true, tones: [HI.M3, HI.p5, HI.b7, HI.s9] },
        { id: "dom7b9b13", en: "7♭9♭13", ko: "속7화음♭9♭13", bass: true, tones: [HI.M3, HI.b7, HI.b9, HI.b13] }
    ];

    /* 화음 성질: (도수, 반음 수)로 적는다 ------------------------------- */
    const CHORDS = [
        { id: "maj", en: "maj", ko: "장3화음", tones: [[0, 0], [2, 4], [4, 7]] },
        { id: "min", en: "min", ko: "단3화음", tones: [[0, 0], [2, 3], [4, 7]] },
        { id: "dim", en: "dim", ko: "감3화음", tones: [[0, 0], [2, 3], [4, 6]] },
        { id: "aug", en: "aug", ko: "증3화음", tones: [[0, 0], [2, 4], [4, 8]] },
        { id: "maj7", en: "maj7", ko: "장7화음", tones: [[0, 0], [2, 4], [4, 7], [6, 11]] },
        { id: "dom7", en: "dom7", ko: "속7화음", tones: [[0, 0], [2, 4], [4, 7], [6, 10]] },
        { id: "min7", en: "m7", ko: "단7화음", tones: [[0, 0], [2, 3], [4, 7], [6, 10]] },
        { id: "mmaj7", en: "mMaj7", ko: "단장7화음", tones: [[0, 0], [2, 3], [4, 7], [6, 11]] },
        { id: "m7b5", en: "m7♭5", ko: "반감7화음", tones: [[0, 0], [2, 3], [4, 6], [6, 10]] },
        { id: "dim7", en: "dim7", ko: "감7화음", tones: [[0, 0], [2, 3], [4, 6], [6, 9]] },
        { id: "maj7s5", en: "maj7♯5", ko: "증장7화음", tones: [[0, 0], [2, 4], [4, 8], [6, 11]] },
        { id: "dom7s5", en: "7♯5", ko: "증속7화음", tones: [[0, 0], [2, 4], [4, 8], [6, 10]] },
        { id: "dom7b5", en: "7♭5", ko: "감속7화음", tones: [[0, 0], [2, 4], [4, 6], [6, 10]] },
        { id: "mmaj7b5", en: "mMaj7♭5", ko: "감단장7화음", tones: [[0, 0], [2, 3], [4, 6], [6, 11]] }
    ].concat(TENSION_CHORDS);

    const TRIAD_IDS = ["maj", "min", "dim", "aug"];
    const SEVENTH_IDS = ["dom7", "maj7", "min7", "mmaj7", "m7b5", "dim7", "maj7s5"];

    /* 화음 자리 */
    const POSITIONS = [
        { id: "root", en: "Root Position", ko: "근음 자리", inversion: 0 },
        { id: "first", en: "1st Inversion", ko: "첫째 자리바꿈", inversion: 1 },
        { id: "second", en: "2nd Inversion", ko: "둘째 자리바꿈", inversion: 2 }
    ];

    /* 음계 -------------------------------------------------------------- */
    const SCALES = [
        { id: "major", en: "Major", ko: "장음계", tones: [[0, 0], [1, 2], [2, 4], [3, 5], [4, 7], [5, 9], [6, 11], [7, 12]] },
        { id: "nminor", en: "Natural Minor", ko: "자연단음계", tones: [[0, 0], [1, 2], [2, 3], [3, 5], [4, 7], [5, 8], [6, 10], [7, 12]] },
        { id: "hminor", en: "Harmonic Minor", ko: "화성단음계", tones: [[0, 0], [1, 2], [2, 3], [3, 5], [4, 7], [5, 8], [6, 11], [7, 12]] },
        { id: "mminor", en: "Melodic Minor", ko: "가락단음계", tones: [[0, 0], [1, 2], [2, 3], [3, 5], [4, 7], [5, 9], [6, 11], [7, 12]] },
        { id: "pmaj", en: "Major Pentatonic", ko: "장5음음계", tones: [[0, 0], [1, 2], [2, 4], [4, 7], [5, 9], [7, 12]] },
        { id: "pmin", en: "Minor Pentatonic", ko: "단5음음계", tones: [[0, 0], [2, 3], [3, 5], [4, 7], [6, 10], [7, 12]] },
        { id: "blues", en: "Blues", ko: "블루스음계", tones: [[0, 0], [2, 3], [3, 5], [3, 6], [4, 7], [6, 10], [7, 12]] },
        { id: "dorian", en: "Dorian", ko: "도리아", tones: [[0, 0], [1, 2], [2, 3], [3, 5], [4, 7], [5, 9], [6, 10], [7, 12]] },
        { id: "phrygian", en: "Phrygian", ko: "프리지아", tones: [[0, 0], [1, 1], [2, 3], [3, 5], [4, 7], [5, 8], [6, 10], [7, 12]] },
        { id: "lydian", en: "Lydian", ko: "리디아", tones: [[0, 0], [1, 2], [2, 4], [3, 6], [4, 7], [5, 9], [6, 11], [7, 12]] },
        { id: "mixolydian", en: "Mixolydian", ko: "믹솔리디아", tones: [[0, 0], [1, 2], [2, 4], [3, 5], [4, 7], [5, 9], [6, 10], [7, 12]] },
        { id: "locrian", en: "Locrian", ko: "로크리아", tones: [[0, 0], [1, 1], [2, 3], [3, 5], [4, 6], [5, 8], [6, 10], [7, 12]] },
        { id: "whole", en: "Whole Tone", ko: "온음음계", respell: true, tones: [[0, 0], [1, 2], [2, 4], [3, 6], [4, 8], [5, 10], [7, 12]] },
        { id: "dimwh", en: "Diminished", ko: "감음계(온반)", respell: true, tones: [[0, 0], [1, 2], [2, 3], [3, 5], [4, 6], [5, 8], [6, 9], [6, 11], [7, 12]] },
        { id: "dimhw", en: "Half-whole Diminished", ko: "감음계(반온)", respell: true, tones: [[0, 0], [1, 1], [2, 3], [2, 4], [3, 6], [4, 7], [5, 9], [6, 10], [7, 12]] },
        { id: "lydb7", en: "Lydian ♭7", ko: "리디안 ♭7", tones: [[0, 0], [1, 2], [2, 4], [3, 6], [4, 7], [5, 9], [6, 10], [7, 12]] },
        { id: "altered", en: "Altered", ko: "얼터드", respell: true, tones: [[0, 0], [1, 1], [2, 3], [2, 4], [3, 6], [4, 8], [5, 10], [7, 12]] },
        { id: "phrydom", en: "Phrygian Dominant", ko: "프리지안 도미난트", tones: [[0, 0], [1, 1], [2, 4], [3, 5], [4, 7], [5, 8], [6, 10], [7, 12]] },
        /* 선법만 묻는 판에서는 장음계·자연단음계를 선법 이름으로 부른다. */
        { id: "ionian", en: "Ionian", ko: "이오니아", tones: [[0, 0], [1, 2], [2, 4], [3, 5], [4, 7], [5, 9], [6, 11], [7, 12]] },
        { id: "aeolian", en: "Aeolian", ko: "에올리아", tones: [[0, 0], [1, 2], [2, 3], [3, 5], [4, 7], [5, 8], [6, 10], [7, 12]] }
    ];

    /* 화음 진행 ---------------------------------------------------------- */

    /*
     * 로마숫자는 그 조의 음계를 기준으로 센다. 그래서 단조에서는 III·VI·VII에
     * ♭을 붙이지 않는다 — 숫자 앞의 ♭은 늘 "빌려 온 화음"이라는 표시로 남긴다.
     * 값은 [음이름 걸음 수, 반음 수, 삼화음 성질]이다.
     * V/V와 II는 같은 소리다. 뒤에 V가 오면 딴 조 딸림화음이고, 오지 않으면
     * 라이디언에서 빌려 온 II다 — 그래서 다음 화음까지 들어야 답이 나온다.
     */
    const NUMERALS = {
        "I": [0, 0, "maj"], "ii": [1, 2, "min"], "iii": [2, 4, "min"],
        "IV": [3, 5, "maj"], "V": [4, 7, "maj"], "vi": [5, 9, "min"],
        "vii°": [6, 11, "dim"],
        "iv": [3, 5, "min"], "♭VII": [6, 10, "maj"], "♭VI": [5, 8, "maj"],
        "♭III": [2, 3, "maj"], "II": [1, 2, "maj"],
        "V/V": [1, 2, "maj"], "V/vi": [2, 4, "maj"], "V/ii": [5, 9, "maj"],
        "i": [0, 0, "min"], "ii°": [1, 2, "dim"], "III": [2, 3, "maj"],
        "v": [4, 7, "min"], "VI": [5, 8, "maj"], "VII": [6, 10, "maj"]
    };

    const TRIAD_SHAPE = {
        maj: [[0, 0], [2, 4], [4, 7]],
        min: [[0, 0], [2, 3], [4, 7]],
        dim: [[0, 0], [2, 3], [4, 6]]
    };

    const PROGRESSIONS = [
        { id: "I IV V", chords: ["I", "IV", "V"] },
        { id: "I V IV", chords: ["I", "V", "IV"] },
        { id: "I IV V I", chords: ["I", "IV", "V", "I"] },
        { id: "I V IV I", chords: ["I", "V", "IV", "I"] },
        { id: "I IV I V", chords: ["I", "IV", "I", "V"] },
        { id: "I V I IV", chords: ["I", "V", "I", "IV"] },
        { id: "I V vi IV", chords: ["I", "V", "vi", "IV"] },
        { id: "I vi IV V", chords: ["I", "vi", "IV", "V"] },
        { id: "I IV V vi", chords: ["I", "IV", "V", "vi"] },
        { id: "I IV vi V", chords: ["I", "IV", "vi", "V"] },
        { id: "I V IV vi", chords: ["I", "V", "IV", "vi"] },
        { id: "I vi V IV", chords: ["I", "vi", "V", "IV"] },
        { id: "ii V I", chords: ["ii", "V", "I"] },
        { id: "IV V I", chords: ["IV", "V", "I"] },
        { id: "I vi V", chords: ["I", "vi", "V"] },
        { id: "vi IV V", chords: ["vi", "IV", "V"] },
        { id: "I ii V", chords: ["I", "ii", "V"] },
        { id: "vi ii V", chords: ["vi", "ii", "V"] },
        { id: "IV I V", chords: ["IV", "I", "V"] },
        { id: "I V vi", chords: ["I", "V", "vi"] },
        { id: "V vi IV I", chords: ["V", "vi", "IV", "I"] },
        { id: "vi IV I V", chords: ["vi", "IV", "I", "V"] },
        { id: "IV I V vi", chords: ["IV", "I", "V", "vi"] },
        { id: "vi IV V I", chords: ["vi", "IV", "V", "I"] },
        { id: "IV V I vi", chords: ["IV", "V", "I", "vi"] },
        { id: "V I vi IV", chords: ["V", "I", "vi", "IV"] },
        { id: "I iii IV V", chords: ["I", "iii", "IV", "V"] },
        { id: "I IV ii V", chords: ["I", "IV", "ii", "V"] },
        { id: "I vi ii V", chords: ["I", "vi", "ii", "V"] },
        { id: "I V vi iii", chords: ["I", "V", "vi", "iii"] },
        { id: "ii V I vi", chords: ["ii", "V", "I", "vi"] },
        { id: "I iii vi IV", chords: ["I", "iii", "vi", "IV"] },
        { id: "vi ii V I", chords: ["vi", "ii", "V", "I"] },
        { id: "I ii iii IV", chords: ["I", "ii", "iii", "IV"] },
        { id: "iii vi ii V", chords: ["iii", "vi", "ii", "V"] },
        { id: "IV I iii vi", chords: ["IV", "I", "iii", "vi"] },
        { id: "i VI VII i", chords: ["i", "VI", "VII", "i"], minor: true },
        { id: "i VII VI VII", chords: ["i", "VII", "VI", "VII"], minor: true },
        { id: "i iv v i", chords: ["i", "iv", "v", "i"], minor: true },
        { id: "ii° v i", chords: ["ii°", "v", "i"], minor: true },
        { id: "i VI III VII", chords: ["i", "VI", "III", "VII"], minor: true },
        { id: "i iv VII III", chords: ["i", "iv", "VII", "III"], minor: true },
        { id: "i v VI VII", chords: ["i", "v", "VI", "VII"], minor: true },
        { id: "VI VII i", chords: ["VI", "VII", "i"], minor: true },
        { id: "I IV iv I", chords: ["I", "IV", "iv", "I"] },
        { id: "I IV I iv", chords: ["I", "IV", "I", "iv"] },
        { id: "I iv V I", chords: ["I", "iv", "V", "I"] },
        { id: "I IV iv V", chords: ["I", "IV", "iv", "V"] },
        { id: "I V iv I", chords: ["I", "V", "iv", "I"] },
        { id: "I vi iv I", chords: ["I", "vi", "iv", "I"] },
        { id: "I IV V iv", chords: ["I", "IV", "V", "iv"] },
        { id: "I ♭VII IV I", chords: ["I", "♭VII", "IV", "I"] },
        { id: "I IV ♭VII I", chords: ["I", "IV", "♭VII", "I"] },
        { id: "I ♭VII IV V", chords: ["I", "♭VII", "IV", "V"] },
        { id: "I V ♭VII IV", chords: ["I", "V", "♭VII", "IV"] },
        { id: "I vi ♭VII IV", chords: ["I", "vi", "♭VII", "IV"] },
        { id: "I ♭VII I IV", chords: ["I", "♭VII", "I", "IV"] },
        { id: "I ♭VI ♭VII I", chords: ["I", "♭VI", "♭VII", "I"] },
        { id: "♭VI ♭VII I", chords: ["♭VI", "♭VII", "I"] },
        { id: "I ♭III ♭VI ♭VII", chords: ["I", "♭III", "♭VI", "♭VII"] },
        { id: "I ♭III IV I", chords: ["I", "♭III", "IV", "I"] },
        { id: "IV ♭VI ♭VII I", chords: ["IV", "♭VI", "♭VII", "I"] },
        { id: "I V ♭VI ♭VII", chords: ["I", "V", "♭VI", "♭VII"] },
        { id: "i iv V i", chords: ["i", "iv", "V", "i"], minor: true },
        { id: "ii° V i", chords: ["ii°", "V", "i"], minor: true },
        { id: "ii V i", chords: ["ii", "V", "i"], minor: true },
        { id: "i IV i iv", chords: ["i", "IV", "i", "iv"], minor: true },
        { id: "i IV VII i", chords: ["i", "IV", "VII", "i"], minor: true },
        { id: "i VII IV i", chords: ["i", "VII", "IV", "i"], minor: true },
        { id: "i iv V VI", chords: ["i", "iv", "V", "VI"], minor: true },
        { id: "i ii V i", chords: ["i", "ii", "V", "i"], minor: true },
        { id: "I II IV I", chords: ["I", "II", "IV", "I"] },
        { id: "I II IV V", chords: ["I", "II", "IV", "V"] },
        { id: "I V/V V I", chords: ["I", "V/V", "V", "I"] },
        { id: "I IV V/V V", chords: ["I", "IV", "V/V", "V"] },
        { id: "I V/vi vi IV", chords: ["I", "V/vi", "vi", "IV"] },
        { id: "I V/ii ii V", chords: ["I", "V/ii", "ii", "V"] },
        { id: "vi V/V V I", chords: ["vi", "V/V", "V", "I"] },
        { id: "I V/vi vi V", chords: ["I", "V/vi", "vi", "V"] }
    ].map(item => Object.assign(item, { label: item.chords.join("–") }));

    const PROGRESSION_SETS = [
        {
            id: "p1", name: label("Primary triads", "주요 3화음"),
            palette: [["I", "IV", "V"]],
            given: true,
            ids: ["I IV V", "I V IV", "I IV V I", "I V IV I", "I IV I V", "I V I IV"]
        },
        {
            id: "p2", name: label("Four-chord loops", "네 화음 순환"),
            palette: [["I", "IV", "V", "vi"]],
            given: true,
            ids: ["I V vi IV", "I vi IV V", "I IV V vi", "I IV vi V", "I V IV vi", "I vi V IV"]
        },
        {
            id: "p3", name: label("Three-chord progressions", "세 화음 진행"),
            palette: [["I", "ii", "IV", "V", "vi"]],
            ids: ["ii V I", "IV V I", "I vi V", "vi IV V", "I ii V", "vi ii V", "IV I V", "I V vi"]
        },
        {
            id: "p4", name: label("Rotated loops", "자리를 옮긴 순환"),
            palette: [["I", "IV", "V", "vi"]],
            ids: ["V vi IV I", "vi IV I V", "IV I V vi", "vi IV V I", "IV V I vi", "V I vi IV"]
        },
        {
            id: "p5", name: label("All diatonic triads", "온음계 3화음"),
            palette: [["I", "ii", "iii", "IV", "V", "vi"]],
            ids: ["I iii IV V", "I IV ii V", "I vi ii V", "I V vi iii", "ii V I vi", "I iii vi IV", "vi ii V I", "I ii iii IV", "iii vi ii V", "IV I iii vi"]
        },
        {
            id: "p6", name: label("Minor key", "단조"),
            palette: [["i", "ii°", "III", "iv", "v", "VI", "VII"]],
            ids: ["i VI VII i", "i VII VI VII", "i iv v i", "ii° v i", "i VI III VII", "i iv VII III", "i v VI VII", "VI VII i"]
        },
        {
            id: "p7", name: label("Borrowed iv", "차용화음 iv"),
            palette: [["I", "IV", "V", "vi"], [null, "iv", null, null]],
            given: true,
            ids: ["I IV iv I", "I IV I iv", "I iv V I", "I IV iv V", "I V iv I", "I vi iv I", "I IV V iv"]
        },
        {
            id: "p8", name: label("Borrowed ♭VII", "차용화음 ♭VII"),
            palette: [["I", "ii", "IV", "V", "vi"], ["♭VII"]],
            given: true,
            ids: ["I ♭VII IV I", "I IV ♭VII I", "I ♭VII IV V", "I V ♭VII IV", "I vi ♭VII IV", "I ♭VII I IV"]
        },
        {
            id: "p9", name: label("Borrowed ♭III, ♭VI, ♭VII", "차용화음 ♭III·♭VI·♭VII"),
            palette: [["I", "ii", "IV", "V", "vi"], ["♭III", "♭VI", "♭VII"]],
            freeBass: true,
            ids: ["I ♭VI ♭VII I", "♭VI ♭VII I", "I ♭III ♭VI ♭VII", "I ♭III IV I", "IV ♭VI ♭VII I", "I V ♭VI ♭VII"]
        },
        {
            id: "p10", name: label("Borrowing in minor", "단조의 차용화음"),
            palette: [["i", "ii°", "III", "iv", "v", "VI", "VII"], [null, "ii", null, "IV", "V", null, null]],
            freeBass: true,
            ids: ["i iv V i", "ii° V i", "ii V i", "i IV i iv", "i IV VII i", "i VII IV i", "i iv V VI", "i ii V i"]
        },
        {
            id: "p11", name: label("Secondary dominants", "부속화음"),
            palette: [["I", "ii", "iii", "IV", "V", "vi"], ["II", "V/V", "V/vi", "V/ii"]],
            freeBass: true,
            ids: ["I II IV I", "I II IV V", "I V/V V I", "I IV V/V V", "I V/vi vi IV", "I V/ii ii V", "vi V/V V I", "I V/vi vi V"]
        }
    ];

    [INTERVALS, DISPLAY_INTERVALS, CHORDS, SCALES, POSITIONS, QUALITIES, NUMBERS].forEach(list => {
        list.forEach(item => { item.label = label(item.en, item.ko); });
    });

    /* 음정 이름의 앞 글자가 성질, 도수는 음이름을 센 수다. */
    const READ_ITEMS = INTERVALS.concat(DISPLAY_INTERVALS).map(item => ({
        id: item.id,
        label: item.label,
        degree: item.degree,
        semis: item.semis,
        roots: item.roots,
        quality: item.en.replace(/[0-9]/g, ""),
        number: item.degree
    }));

    const READ_BY_ID = {};
    READ_ITEMS.forEach(item => { READ_BY_ID[item.id] = item; });

    const MAJOR_TONES = [[0, 0], [1, 2], [2, 4], [3, 5], [4, 7], [5, 9], [6, 11]];

    /* 조표 자리에 붙는 기호 */
    const ACC_MARK = { "-2": "♭♭", "-1": "♭", "0": "", "1": "♯", "2": "♯♯" };

    function keyName(tonic, minor) {
        return N.LETTER_NAMES[tonic.letter] + (ACC_MARK[String(tonic.accidental)] || "")
            + (minor ? " minor​(단조)" : " major​(장조)");
    }

    const MINOR_TONES = [[0, 0], [1, 2], [2, 3], [3, 5], [4, 7], [5, 8], [6, 10]];

    function minorScale(tonic) {
        return MINOR_TONES.map(tone => N.step(tonic, tone[0], tone[1]));
    }

    function majorScale(tonic) {
        return MAJOR_TONES.map(tone => N.step(tonic, tone[0], tone[1]));
    }

    /* 증3화음은 자리를 바꿔도 구조가 같아 귀로 구별할 수 없으므로 뺀다. */
    const POSITION_QUALITIES = CHORDS.filter(item => ["maj", "min", "dim"].indexOf(item.id) >= 0);

    /* 화음을 자리바꿈하고, 베이스가 너무 높아지면 한 옥타브 내린다. */
    function invertChord(notes, inversion) {
        let list = notes.slice();
        for (let step = 0; step < inversion; step += 1) {
            const low = list.shift();
            list.push(N.spell(low.letterAbs + 7, low.accidental));
        }
        while (Math.min.apply(null, list.map(note => note.midi)) >= 72) {
            list = list.map(note => N.spell(note.letterAbs - 7, note.accidental));
        }
        return list.slice().sort((a, b) => a.midi - b.midi);
    }

    function readingRoots(item) {
        return collectRoots("r:" + item.id, 28, 34, root => {
            const other = N.step(root, item.degree, item.semis);
            const notes = [root, other];
            return inRange(notes, 55, 84) ? notes : null;
        });
    }

    /* 악보를 보여 주고 소리도 들려주면서 성질과 도수를 고르게 하는 문제 */
    function readingQuestion(item) {
        const low = pick(readingRoots(item));
        const high = N.step(low, item.degree, item.semis);
        return {
            playback: { groups: [[low.midi, high.midi]], beat: 2 },
            staffBefore: [{ notes: [low, high] }],
            staffAfter: [{ notes: [low, high] }],
            keyboard: null,
            pair: { quality: item.quality, number: item.number },
            detail: N.name(low) + " – " + N.name(high)
        };
    }

    function chordTones(root, item) {
        const notes = item.tones.map(tone => N.step(root, tone[0], tone[1]));
        /* 텐션 화음은 뿌리음이 왼손 베이스로 따로 놓인다. */
        return item.bass ? [root].concat(notes) : notes;
    }

    /*
     * 텐션 화음은 왼손 뿌리음이 한 옥타브 아래로 내려가고 오른손이 그 위로 서니,
     * 뿌리음을 낮은 자리에서 고르고 음역도 넓게 잡는다.
     */
    function chordRoots(item) {
        if (item.bass) {
            return collectRoots("cb:" + item.id, 21, 25, root => {
                const notes = chordTones(root, item);
                return inRange(notes, 45, 83) ? notes : null;
            });
        }
        return collectRoots("c:" + item.id, 28, 34, root => {
            const notes = chordTones(root, item);
            return inRange(notes, 55, 79) ? notes : null;
        });
    }

    function chordNotes(root, item, inversion) {
        return invertChord(chordTones(root, item), inversion || 0);
    }

    /* 문제 만들기 --------------------------------------------------------- */

    function intervalRoots(item, descending) {
        const low = descending ? 35 : 28;
        return collectRoots("i:" + item.id + (descending ? "d" : "u"), low, low + 6, root => {
            const other = descending
                ? N.step(root, -item.degree, -item.semis)
                : N.step(root, item.degree, item.semis);
            const notes = [root, other];
            return inRange(notes, KEY_LOW, KEY_HIGH) ? notes : null;
        });
    }

    /*
     * 음정 만들기. 기준음을 악보와 건반에 찍어 주고 그 위나 아래로 그 음정만큼
     * 떨어진 음을 누르게 한다. 이름을 고르는 문제와 달라 찍어 맞힐 수가 없고,
     * 한 가지 성질만 다루는 차시에서도 문제가 빈 문제가 되지 않는다.
     */
    function buildQuestion(item) {
        const up = randomInt(0, 1) === 1;
        const from = pick(intervalRoots(item, !up));
        const to = up
            ? N.step(from, item.degree, item.semis)
            : N.step(from, -item.degree, -item.semis);
        return {
            ask: item.ko + (up ? " 위" : " 아래") + " 음을 누르세요",
            playback: { groups: [[from.midi]], beat: .9 },
            staffBefore: [{ notes: [from] }],
            staffAfter: [{ notes: up ? [from, to] : [to, from] }],
            /* 알려 준 음은 다른 문제와 같이 초록 표로만 찍는다(글씨는 건반에 안 들어간다). */
            keyboard: { given: [{ midi: from.midi, text: "" }], answer: [to.midi] },
            detail: N.name(from) + (up ? " → " : " ← ") + N.name(to)
        };
    }

    /*
     * 음정. 두 음을 함께 울리는 것이 기본이고, 한 음씩 듣는 것은 문제 화면 단추로 한다.
     * 오르내림은 판을 쪼개지 않고 문제마다 무작위로 섞는다.
     */
    function intervalQuestion(item) {
        const descending = item.semis <= 12 && randomInt(0, 1) === 1;
        const given = pick(intervalRoots(item, descending));
        const other = descending
            ? N.step(given, -item.degree, -item.semis)
            : N.step(given, item.degree, item.semis);
        const line = descending ? [given, other] : [given, other];

        return {
            playback: { groups: [[given.midi, other.midi]], beat: 2 },
            melodic: { groups: line.map(note => [note.midi]), beat: .68 },
            staffBefore: descending ? [null, { notes: [given] }] : [{ notes: [given] }, null],
            staffAfter: descending
                ? [{ notes: [other] }, { notes: [given] }]
                : [{ notes: [given] }, { notes: [other] }],
            keyboard: { given: [{ midi: given.midi, text: "" }], answer: [other.midi], ordered: true },
            detail: N.name(given) + " → " + N.name(other)
        };
    }

    /*
     * 화음. 자리바꿈은 쓰지 않는다(자리바꿈은 따로 한 연습이다). 텐션 화음은
     * 왼손 뿌리음과 오른손 넷으로 놓이므로 큰보표에 그리고, 뿌리음은 알려 준다.
     */
    function chordQuestion(item) {
        const root = pick(chordRoots(item));
        const notes = chordNotes(root, item, 0);
        const midis = notes.map(note => note.midi);
        return {
            playback: { groups: [midis], beat: 2.2 },
            arpeggio: { groups: midis.map(midi => [midi]), beat: .5 },
            grand: item.bass === true,
            staffBefore: [{ notes: [notes[0]] }],
            staffAfter: [{ notes: notes }],
            keyboard: {
                given: [{ midi: midis[0], text: "" }],
                answer: midis.slice(1),
                ordered: false
            },
            detail: N.name(notes[0]) + " …  " + notes.map(N.name).join(" · ")
        };
    }

    /* 화음 자리 알아맞히기: 화음 이름을 알려 주고 어느 자리인지 묻는다. */
    function positionQuestion(item, mode) {
        const shape = mode === "arp" ? "arp" : "harmony";
        const quality = pick(POSITION_QUALITIES);
        const root = pick(chordRoots(quality));
        const notes = chordNotes(root, quality, item.inversion);
        const midis = notes.map(note => note.midi);
        const rootNotes = chordNotes(root, quality, 0);
        return {
            playback: shape === "arp"
                ? { groups: midis.map(midi => [midi]), beat: .5 }
                : { groups: [midis], beat: 2.2 },
            arpeggio: { groups: midis.map(midi => [midi]), beat: .5 },
            rootPlay: { groups: [rootNotes.map(note => note.midi)], beat: 2.2 },
            staffBefore: [null],
            staffAfter: [{ notes: notes }],
            keyboard: null,
            ask: N.name(root).slice(0, -1) + " " + quality.en + " — 어느 자리인가요?",
            detail: notes.map(N.name).join(" · ")
        };
    }

    /*
     * 음계 구성음을 적는다. 보통은 음자리와 반음 수를 그대로 따르지만, respell을 켠 음계는
     * 음자리를 하나 또는 둘 올려 가며 홑임시표로 적히는 자리를 고른다. 온음음계처럼 일곱
     * 음자리에 여섯 음을 얹는 음계는 그렇게 해야 겹임시표가 생기지 않는다.
     */
    function scaleNotes(root, item) {
        if (!item.respell) return item.tones.map(tone => N.step(root, tone[0], tone[1]));
        const notes = [root];
        let letterAbs = root.letterAbs;
        item.tones.slice(1).forEach(tone => {
            const midi = root.midi + tone[1];
            let best = null;
            for (let up = 1; up <= 2; up += 1) {
                const plain = N.spell(letterAbs + up, 0);
                const accidental = midi - plain.midi;
                if (Math.abs(accidental) > 1) continue;
                if (!best || Math.abs(accidental) < Math.abs(best.accidental)) {
                    best = N.spell(letterAbs + up, accidental);
                }
            }
            if (!best) best = N.spell(letterAbs + 1, midi - N.spell(letterAbs + 1, 0).midi);
            letterAbs = best.letterAbs;
            notes.push(best);
        });
        return notes;
    }

    /* 겹임시표가 생기면 같은 소리의 다른 이름으로 적어 본다. */
    function enharmonicRoot(root) {
        if (root.accidental === 1) return N.spell(root.letterAbs + 1, -1);
        if (root.accidental === -1) return N.spell(root.letterAbs - 1, 1);
        return null;
    }

    function readableScale(root, item) {
        const first = scaleNotes(root, item);
        if (!first.some(note => Math.abs(note.accidental) > 1)) return first;
        const other = enharmonicRoot(root);
        if (!other) return first;
        const second = scaleNotes(other, item);
        return second.some(note => Math.abs(note.accidental) > 1) ? first : second;
    }

    function scaleRoots(item) {
        return collectRoots("s:" + item.id, 28, 34, root => {
            const notes = scaleNotes(root, item);
            return inRange(notes, 55, 81) ? notes : null;
        });
    }

    /*
     * 음계. 오르내림은 문제마다 무작위다. 건반으로 답할 때는 어떻게 들려줬든
     * 뿌리음에서 올라가며 누른다.
     */
    function scaleQuestion(item) {
        const root = pick(scaleRoots(item));
        const notes = scaleNotes(root, item);
        const line = randomInt(0, 1) === 1 ? notes.slice().reverse() : notes;
        return {
            playback: { groups: line.map(note => [note.midi]), beat: .44 },
            staffBefore: [{ notes: [root] }].concat(notes.slice(1).map(() => null)),
            staffAfter: notes.map(note => ({ notes: [note] })),
            keyboard: {
                given: [{ midi: root.midi, text: "" }],
                answer: notes.slice(1).map(note => note.midi),
                ordered: true
            },
            detail: N.name(root)
        };
    }

    function keyRoots(low, high) {
        return collectRoots("k:" + low + "-" + high, low, high, root => {
            const scale = majorScale(root);
            /* 조표가 일곱 개인 조(C♭·C♯ 장조)까지는 가지 않는다. */
            if (scale.filter(note => note.accidental !== 0).length > 6) return null;
            return inRange(scale, 52, 79) ? scale : null;
        });
    }

    /*
     * 화음 진행 -----------------------------------------------------------
     * 왼손에 뿌리음, 오른손에 삼화음. 오른손은 앞 화음에서 손이 가장 덜
     * 움직이는 자리를 잡는다 — 실제 음악에서 보이스 리딩을 하다 보면 전위형이
     * 나오기도 하고 안 나오기도 하는 것과 같다.
     */
    const RH_HOME = 67;    /* 오른손이 머무는 자리 */
    const RH_LOW = 58;
    const RH_HIGH = 81;
    /*
     * 왼손이 놓일 띠. 낮은음자리표에 제대로 앉으려면 이 자리여야 한다. 좁게
     * 잡으면 옥타브가 하나뿐인 음이 생겨 베이스가 10도씩 뛰어 버린다.
     */
    const BASS_LOW = 40;
    const BASS_HIGH = 57;
    /*
     * 베이스도 같은 방법으로 고르되 뿌리음에 무게를 얹는다. 그래서 뿌리음이
     * 자연스러우면 그대로 두고, 3음이나 5음으로 가는 편이 훨씬 매끄러울 때만
     * 전위형이 된다. 첫 화음은 조를 세워야 하므로 늘 뿌리음이다.
     */
    const BASS_ROOT_PULL = 4;

    function numeralNotes(tonic, symbol) {
        const spec = NUMERALS[symbol];
        const root = N.step(tonic, spec[0], spec[1]);
        return TRIAD_SHAPE[spec[2]].map(pair => N.step(root, pair[0], pair[1]));
    }

    /* rotation 번째 음을 맨 아래에 두고 나머지를 그 위로 쌓는다. */
    function stackFrom(notes, rotation, octave) {
        const out = [];
        let floorAbs = -999;
        for (let step = 0; step < notes.length; step += 1) {
            const note = notes[(rotation + step) % notes.length];
            let abs = note.letterAbs + octave * 7;
            while (abs <= floorAbs) abs += 7;
            out.push(N.spell(abs, note.accidental));
            floorAbs = abs;
        }
        return out;
    }

    function leadVoicing(notes, previous) {
        let best = null;
        let bestCost = Infinity;
        for (let rotation = 0; rotation < notes.length; rotation += 1) {
            for (let octave = -2; octave <= 2; octave += 1) {
                const stack = stackFrom(notes, rotation, octave);
                if (!inRange(stack, RH_LOW, RH_HIGH)) continue;
                const cost = stack.reduce((sum, note, index) => sum
                    + Math.abs(note.midi - (previous ? previous[index] : RH_HOME)), 0);
                if (cost < bestCost) { bestCost = cost; best = stack; }
            }
        }
        return best;
    }

    function bassSeat(notes, previous, free) {
        let best = null;
        let bestCost = Infinity;
        const count = free ? notes.length : 1;
        for (let index = 0; index < count; index += 1) {
            for (let octave = -3; octave <= 1; octave += 1) {
                const seat = N.spell(notes[index].letterAbs + octave * 7, notes[index].accidental);
                if (seat.midi < BASS_LOW || seat.midi > BASS_HIGH) continue;
                const from = previous === null ? (BASS_LOW + BASS_HIGH) / 2 : previous;
                const cost = Math.abs(seat.midi - from) + (index === 0 ? 0 : BASS_ROOT_PULL);
                if (cost < bestCost) { bestCost = cost; best = seat; }
            }
        }
        return best;
    }

    /* 그 진행의 모든 화음이 홑임시표로 적히는 조만 고른다. */
    function progressionRoots(item) {
        return collectRoots("pg:" + item.id, 28, 34, root => {
            const scale = item.minor ? minorScale(root) : majorScale(root);
            if (scale.filter(note => note.accidental !== 0).length > 6) return null;
            let notes = scale.slice();
            item.chords.forEach(symbol => { notes = notes.concat(numeralNotes(root, symbol)); });
            return notes;
        });
    }

    function progressionQuestion(item) {
        const preset = session.preset || {};
        const tonic = pick(progressionRoots(item));
        const scale = item.minor ? minorScale(tonic) : majorScale(tonic);
        const columns = [];
        const groups = [];
        let hand = null;
        let bass = null;
        item.chords.forEach((symbol, index) => {
            const notes = numeralNotes(tonic, symbol);
            const seat = bassSeat(notes, bass, preset.freeBass === true && index > 0);
            const voiced = leadVoicing(notes, hand);
            hand = voiced.map(note => note.midi);
            bass = seat.midi;
            columns.push({ notes: [seat].concat(voiced) });
            groups.push([bass].concat(hand));
        });

        /* 으뜸화음은 진행 앞에 붙이지 않는다. 조가 궁금하면 「조 확인」으로 따로 듣는다. */
        const home = numeralNotes(tonic, item.minor ? "i" : "I");
        const homeGroup = [bassSeat(home, null, false).midi]
            .concat(leadVoicing(home, null).map(note => note.midi));

        return {
            /* 악보를 보고 적는 문제에서는 조를 물음에 적어 준다 — 조표만으로는
               장조인지 나란한 단조인지 가려지지 않는다. */
            ask: session.reveal
                ? keyName(tonic, item.minor) + " — 로마숫자로 적어 보세요"
                : session.drill.ask,
            playback: { groups: groups, beat: 1.05 },
            chordsPlay: { groups: groups, beat: 1.9 },
            homePlay: { groups: [homeGroup], beat: 1.2 },
            slots: { symbols: item.chords.slice(), columns: columns, given: preset.given ? 1 : 0 },
            staffBefore: [null],
            staffAfter: columns,
            keyboard: null,
            grand: true,
            keySignature: keySignatureOf(scale),
            detail: keyName(tonic, item.minor)
        };
    }

    /*
     * 가락 받아쓰기 -------------------------------------------------------
     * 세 음. 1레벨은 두 걸음이 같은 쪽으로 가고, 2레벨부터는 올랐으면 내려간다.
     * 한 걸음의 폭은 레벨이 정한다. 세 음 가운데 같은 음이 있으면 안 되므로,
     * 같은 폭으로 되돌아오는 걸음은 걸러 낸다.
     */
    const MELODY_STEPS = { 1: 1, 2: 2, 3: 4, 4: 6 };   /* 온음계 계단 수 */
    const MELODY_SEMIS = { 1: 2, 2: 4, 3: 7, 4: 11 };  /* 반음 수 */
    const MELODY_LOW = 55;
    const MELODY_HIGH = 79;

    /* 조표를 몇 개 붙일지는 음계에 붙은 임시표로 센다. */
    function keySignatureOf(scale) {
        const sharps = scale.filter(note => note.accidental > 0).length;
        const flats = scale.filter(note => note.accidental < 0).length;
        if (!sharps && !flats) return null;
        return { count: sharps || flats, sharp: sharps > 0 };
    }

    /*
     * 반음 수만큼 옮긴 음을 홑임시표로 적는다. 옮길 음자리를 몇 가지 두고
     * 임시표가 가장 얕은 것을 고른다.
     */
    function chromaticStep(from, semis) {
        const guess = Math.round(semis * 7 / 12);
        let best = null;
        [0, 1, -1, 2, -2].forEach(shift => {
            const steps = guess + shift;
            const note = N.step(from, steps, semis);
            if (Math.abs(note.accidental) > 1) return;
            if (!best || Math.abs(note.accidental) < Math.abs(best.accidental)) best = note;
        });
        return best;
    }

    function melodyWalk(item) {
        const level = item.level || 1;
        const sameWay = level === 1;
        const first = randomInt(0, 1) ? 1 : -1;
        const second = sameWay ? first : -first;

        if (item.tonal) {
            const tonic = pick(keyRoots(28, 33));
            const scale = majorScale(tonic);
            const cap = MELODY_STEPS[level];
            const at = index => {
                const note = scale[((index % 7) + 7) % 7];
                const octave = Math.floor(index / 7);
                return octave ? N.spell(note.letterAbs + octave * 7, note.accidental) : note;
            };
            const start = randomInt(2, 7);
            const one = first * randomInt(1, cap);
            const two = second * randomInt(1, cap);
            const index = [start, start + one, start + one + two];
            if (index[0] === index[2]) return null;
            const notes = index.map(at);
            if (!inRange(notes, MELODY_LOW, MELODY_HIGH)) return null;
            return { notes: notes, sign: keySignatureOf(scale) };
        }

        const cap = MELODY_SEMIS[level];
        const head = N.natural(randomInt(28, 33));
        const one = first * randomInt(1, cap);
        const two = second * randomInt(1, cap);
        if (one + two === 0) return null;
        const middle = chromaticStep(head, one);
        if (!middle) return null;
        const last = chromaticStep(middle, two);
        if (!last) return null;
        const notes = [head, middle, last];
        if (!inRange(notes, MELODY_LOW, MELODY_HIGH)) return null;
        if (notes.some(note => oddSpelling(note.letter, note.accidental))) return null;
        return { notes: notes, sign: null };
    }

    function melodyQuestion(item) {
        let walk = null;
        let guard = 0;
        while (!walk && guard < 200) {
            guard += 1;
            walk = melodyWalk(item);
        }
        if (!walk) walk = { notes: [N.natural(28), N.natural(29), N.natural(30)], sign: null };
        const notes = walk.notes;
        return {
            playback: { groups: notes.map(note => [note.midi]), beat: .62 },
            staffBefore: [{ notes: [notes[0]] }, null, null],
            staffAfter: notes.map(note => ({ notes: [note] })),
            keySignature: walk.sign,
            keyboard: {
                given: [{ midi: notes[0].midi, text: "1" }],
                answer: notes.slice(1).map(note => note.midi)
            },
            detail: notes.map(N.name).join(" ")
        };
    }

    /*
     * 판(preset) 목록 -----------------------------------------------------
     * 판이 곧 난이도 순서다. 범위는 판이 정하고, 문제 수는 열 개로 못 박고,
     * 답하는 방법은 판 줄의 아이콘으로 고른다. 준비 화면은 없다.
     */
    const PRESETS = {
        interval: [
            { id: "p2", name: label("Seconds", "2도"), ids: ["m2", "M2"] },
            { id: "p3", name: label("Thirds", "3도"), ids: ["m3", "M3"] },
            { id: "p23", name: label("Seconds and thirds", "2도와 3도"), ids: ["m2", "M2", "m3", "M3"] },
            { id: "p45", name: label("Fourth, tritone and fifth", "4도·삼온음·5도"), ids: ["P4", "A4", "P5"] },
            { id: "to5", name: label("Up to fifth", "5도까지"), ids: ["m2", "M2", "m3", "M3", "P4", "A4", "P5"] },
            { id: "to8", name: label("Up to octave", "8도까지"), ids: SIMPLE_INTERVAL_IDS },
            { id: "to15", name: label("Up to fifteenth", "15도까지"), ids: SIMPLE_INTERVAL_IDS.concat(COMPOUND_INTERVAL_IDS) }
        ],
        melody: [
            { id: "d1", name: label("Melody · Diatonic 1", "가락 · 온음계 1"), level: 1, tonal: true },
            { id: "d2", name: label("Melody · Diatonic 2", "가락 · 온음계 2"), level: 2, tonal: true },
            { id: "d3", name: label("Melody · Diatonic 3", "가락 · 온음계 3"), level: 3, tonal: true },
            { id: "d4", name: label("Melody · Diatonic 4", "가락 · 온음계 4"), level: 4, tonal: true },
            { id: "c1", name: label("Melody · Chromatic 1", "가락 · 반음계 1"), level: 1, tonal: false },
            { id: "c2", name: label("Melody · Chromatic 2", "가락 · 반음계 2"), level: 2, tonal: false },
            { id: "c3", name: label("Melody · Chromatic 3", "가락 · 반음계 3"), level: 3, tonal: false },
            { id: "c4", name: label("Melody · Chromatic 4", "가락 · 반음계 4"), level: 4, tonal: false }
        ],
        chord: [
            { id: "majmin", name: label("Major and minor", "장화음과 단화음"), ids: ["maj", "min"] },
            { id: "triads", name: label("Triads", "3화음"), ids: TRIAD_IDS },
            { id: "basic7", name: label("Basic 7ths", "기본 7화음"), ids: ["dom7", "maj7", "min7", "dim7"] },
            {
                id: "adv7", name: label("Advanced 7ths", "7화음 전부"),
                ids: ["dom7", "maj7", "min7", "mmaj7", "dim7", "m7b5", "dom7s5", "maj7s5", "dom7b5", "mmaj7b5"]
            },
            { id: "majten", name: label("Major tensions", "장화음 텐션"), ids: ["maj9", "maj13", "sixnine"] },
            { id: "minten", name: label("Minor tensions", "단화음 텐션"), ids: ["m9", "m11", "m13", "msixnine", "mmaj9"] },
            { id: "domten", name: label("Dominant tensions", "속화음 텐션"), ids: ["dom9", "dom13", "dom9s11"] },
            { id: "altten", name: label("Altered dominants", "변화된 속화음"), ids: ["dom7b9", "dom7s9", "dom7b9b13"] }
        ],
        scale: [
            { id: "basic", name: label("Basic scales", "기본 음계"), ids: ["major", "nminor", "hminor", "mminor"] },
            { id: "penta", name: label("Pentatonic and blues", "5음음계와 블루스"), ids: ["pmaj", "pmin", "blues"] },
            {
                id: "modes", name: label("Major modes", "장음계 선법"),
                ids: ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"]
            },
            { id: "sym", name: label("Symmetric scales", "대칭 음계"), ids: ["whole", "dimwh", "dimhw"] },
            {
                id: "dom", name: label("Dominant scales", "속화음 음계"),
                ids: ["mixolydian", "lydb7", "altered", "dimhw", "phrydom"]
            }
        ],
        progression: PROGRESSION_SETS,
        position: [
            { id: "easy", name: label("Root and first", "근음 자리와 첫째 자리"), ids: ["root", "first"] },
            { id: "hard", name: label("All three positions", "세 자리 전부"), ids: ["root", "first", "second"] }
        ],
        /* 리듬은 차시의 두드리기·받아쓰기가 판을 대신한다. 악보 고르기만 따로 남긴다. */
        rhythmWrite: [
            { id: "pick", name: label("Choose the Bar", "악보 고르기"), ids: ["pick"] }
        ]
    };

    /* 판 이름은 답 이름으로도 쓰이므로 label로도 들고 있는다. */
    Object.keys(PRESETS).forEach(key => {
        PRESETS[key].forEach(preset => { preset.label = preset.name; });
    });


    const DRILLS = [
        {
            id: "interval",
            name: label("Interval Listening", "음정 듣기"),
            ask: "무슨 음정인가요?",
            items: INTERVALS,
            inputs: ["buttons", "keyboard"],
            levels: [
                { id: "easy", label: "쉬움", ids: ["M2", "M3", "P5", "P8"] },
                { id: "mid", label: "보통", ids: ["m2", "M2", "m3", "M3", "P4", "P5", "M6", "m7", "P8"] },
                { id: "hard", label: label("Simple", "한 옥타브 전부"), ids: SIMPLE_INTERVAL_IDS },
                { id: "compound", label: label("Compound", "겹음정"), ids: COMPOUND_INTERVAL_IDS }
            ],
            modes: [
                { id: "harmony", label: label("Harmonic", "화성") },
                { id: "up", label: label("Ascending", "상행") },
                { id: "down", label: label("Descending", "하행") },
                { id: "mixed", label: label("Mixed", "섞어서") }
            ],
            make: intervalQuestion
        },
        {
            id: "reading",
            name: label("Interval Reading", "음정 읽기"),
            ask: "무슨 음정인가요?",
            items: READ_ITEMS,
            inputs: ["pair"],
            pairAnswer: true,
            levels: [
                { id: "easy", label: label("Simple", "한 옥타브 안"), ids: SIMPLE_INTERVAL_IDS.concat(["d5"]) },
                { id: "hard", label: label("All", "겹음정까지"), ids: READ_ITEMS.map(item => item.id) }
            ],
            modes: [],
            make: readingQuestion
        },
        {
            id: "build",
            name: label("Interval Building", "음정 만들기"),
            ask: "음을 누르세요",
            items: INTERVALS.concat(DISPLAY_INTERVALS),
            inputs: ["keyboard"],
            levels: [],
            modes: [],
            make: buildQuestion
        },
        {
            id: "chord",
            name: label("Chord Quality", "화음 성질"),
            ask: "무슨 화음인가요?",
            items: CHORDS,
            inputs: ["buttons", "keyboard"],
            levels: [
                { id: "easy", label: label("maj·min", "장·단"), ids: ["maj", "min"] },
                { id: "mid", label: label("Triads", "3화음"), ids: TRIAD_IDS },
                { id: "seventh", label: label("7ths", "7화음"), ids: SEVENTH_IDS },
                { id: "hard", label: "전부", ids: CHORDS.map(item => item.id) }
            ],
            inversionOption: true,
            modes: [
                { id: "harmony", label: label("Harmonic", "화성") },
                { id: "arp", label: label("Arpeggio", "분산") },
                { id: "mixed", label: label("Mixed", "섞어서") }
            ],
            make: chordQuestion
        },
        {
            id: "position",
            name: label("Chord Inversions", "화음 자리"),
            ask: "어느 자리인가요?",
            items: POSITIONS,
            inputs: ["buttons"],
            levels: [
                { id: "easy", label: "근음 자리·첫째", ids: ["root", "first"] },
                { id: "hard", label: "셋 다", ids: POSITIONS.map(item => item.id) }
            ],
            modes: [
                { id: "harmony", label: label("Harmonic", "화성") },
                { id: "arp", label: label("Arpeggio", "분산") }
            ],
            make: positionQuestion
        },
        {
            id: "scale",
            name: label("Scale Listening", "음계 듣기"),
            ask: "무슨 음계인가요?",
            items: SCALES,
            inputs: ["buttons", "keyboard"],
            levels: [
                { id: "easy", label: "쉬움", ids: ["major", "nminor"] },
                { id: "mid", label: "보통", ids: ["major", "nminor", "hminor", "mminor", "pmaj", "pmin"] },
                { id: "hard", label: "전부", ids: SCALES.map(item => item.id) }
            ],
            modes: [
                { id: "up", label: label("Ascending", "상행") },
                { id: "down", label: label("Descending", "하행") },
                { id: "mixed", label: label("Mixed", "섞어서") }
            ],
            make: scaleQuestion
        },
        {
            id: "progression",
            name: label("Chord Progressions", "화음 진행"),
            ask: "무슨 진행인가요?",
            items: PROGRESSIONS,
            inputs: ["slots"],
            slotAnswer: true,
            readable: true,
            levels: [],
            modes: [],
            make: progressionQuestion
        },
        {
            id: "rhythmWrite",
            name: label("Rhythm Dictation", "리듬 받아쓰기"),
            pickable: false,
            inputs: ["grid"],
            rhythmDrill: true,
            items: [
                { id: "g4", label: label("Quarters", "4분음표"), set: "g4", kind: "grid" },
                { id: "g8", label: label("Quarters and Eighths", "4분음표와 8분음표"), set: "g8", kind: "grid" },
                { id: "g8r", label: label("Rests", "쉼표"), set: "g8r", kind: "grid" },
                { id: "gtie", label: label("Long Notes", "긴 음표"), set: "gtie", kind: "grid" },
                { id: "gdot", label: label("Dotted Notes", "점음표"), set: "gdot", kind: "grid" },
                { id: "g16", label: label("Sixteenths", "16분음표"), set: "g16", kind: "grid" },
                { id: "pick", label: label("Choose the Bar", "악보 고르기"), set: "pick", kind: "bars" },
                { id: "trip", label: label("Triplets", "셋잇단음표"), set: "trip", kind: "bars" },
                { id: "tripMix", label: label("Triplets Mixed", "셋잇단음표 섞기"), set: "tripMix", kind: "bars" }
            ],
            levels: [
                { id: "start", label: label("Quarters", "4분음표"), ids: ["g4"] },
                { id: "easy", label: label("Quarters and Eighths", "4분음표와 8분음표"), ids: ["g8"] },
                { id: "mid", label: label("Rests", "쉼표"), ids: ["g8r"] },
                { id: "long", label: label("Long Notes", "긴 음표"), ids: ["gtie"] },
                { id: "dot", label: label("Dotted Notes", "점음표"), ids: ["gdot"] },
                { id: "hard", label: label("Sixteenths", "16분음표"), ids: ["g16"] },
                { id: "pick", label: label("Choose the Bar", "악보 고르기"), ids: ["pick"] },
                { id: "trip", label: label("Triplets", "셋잇단음표"), ids: ["trip", "tripMix"] }
            ],
            modes: [],
            make: item => (item.kind === "bars" ? rhythmChoiceQuestion(item) : rhythmGridQuestion(item))
        },
        {
            id: "rhythmRead",
            name: label("Rhythm Tapping", "리듬 두드리기"),
            pickable: false,
            inputs: ["tap"],
            rhythmDrill: true,
            items: [
                { id: "t4", label: label("Quarters", "4분음표"), set: "g4" },
                { id: "t8", label: label("Quarters and Eighths", "4분음표와 8분음표"), set: "g8" },
                { id: "t8r", label: label("Rests", "쉼표"), set: "g8r" },
                { id: "ttie", label: label("Long Notes", "긴 음표"), set: "gtie" },
                { id: "tdot", label: label("Dotted Notes", "점음표"), set: "gdot" },
                { id: "t16", label: label("Sixteenths", "16분음표"), set: "g16" },
                { id: "ttrip", label: label("Triplets", "셋잇단음표"), set: "trip" },
                { id: "tmix", label: label("Everything Mixed", "모두 섞기"), set: "tripMix" }
            ],
            levels: [
                { id: "start", label: label("Quarters", "4분음표"), ids: ["t4"] },
                { id: "easy", label: label("Quarters and Eighths", "4분음표와 8분음표"), ids: ["t8"] },
                { id: "mid", label: label("Rests", "쉼표"), ids: ["t8r"] },
                { id: "long", label: label("Long Notes", "긴 음표"), ids: ["ttie"] },
                { id: "dot", label: label("Dotted Notes", "점음표"), ids: ["tdot"] },
                { id: "hard", label: label("Sixteenths", "16분음표"), ids: ["t16"] },
                { id: "trip", label: label("Triplets", "셋잇단음표"), ids: ["ttrip"] },
                { id: "mix", label: label("Everything Mixed", "모두 섞기"), ids: ["tmix"] }
            ],
            modes: [],
            make: rhythmTapQuestion
        },
        {
            id: "melody",
            name: label("Melodic Dictation", "가락 받아쓰기"),
            answerIsLabel: false,
            pickable: false,
            inputs: ["keyboard"],
            items: [
                { id: "m3", label: label("3 Notes", "세 음"), count: 3, reach: 2 },
                { id: "m4", label: label("4 Notes", "네 음"), count: 4, reach: 3 },
                { id: "m5", label: label("5 Notes", "다섯 음"), count: 5, reach: 5 }
            ],
            levels: [
                { id: "easy", label: "세 음", ids: ["m3"] },
                { id: "mid", label: "네 음", ids: ["m4"] },
                { id: "hard", label: "다섯 음", ids: ["m5"] }
            ],
            modes: [],
            make: melodyQuestion
        }
    ];

    /* 문제 만드는 규칙을 검사 도구에서 그대로 불러 쓸 수 있게 열어 둔다. */
    window.EarTraining = { drills: DRILLS };

    const DRILL_BY_ID = {};
    DRILLS.forEach(drill => { DRILL_BY_ID[drill.id] = drill; });

    /* 저장 ---------------------------------------------------------------- */
    const STORAGE_KEY = "earTraining.v2";
    const saved = { stats: {}, presets: {}, setup: {}, progress: {} };

    function loadSaved() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object") {
                if (parsed.stats && typeof parsed.stats === "object") saved.stats = parsed.stats;
                if (parsed.setup && typeof parsed.setup === "object") saved.setup = parsed.setup;
                if (parsed.progress && typeof parsed.progress === "object") saved.progress = parsed.progress;
            }
        } catch (error) { /* 저장을 못 쓰면 기록 없이 쓴다. */ }
    }

    function persist() {
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (error) { /* 무시 */ }
    }

    function recordAnswer(drillId, itemId, correct) {
        if (!saved.stats[drillId]) saved.stats[drillId] = {};
        const table = saved.stats[drillId];
        const entry = table[itemId] || { right: 0, total: 0 };
        entry.total += 1;
        if (correct) entry.right += 1;
        table[itemId] = entry;
        persist();
    }

    function drillRate(drillId) {
        const table = saved.stats[drillId] || {};
        let right = 0;
        let total = 0;
        Object.keys(table).forEach(key => { right += table[key].right; total += table[key].total; });
        return total ? Math.round((right / total) * 100) : null;
    }

    /* 화면 ---------------------------------------------------------------- */
    const els = {};
    let keyboard = null;
    let lessonKeyboard = null;
    let wheelKeyboard = null;

    /* 눌러 보는 건반. 문제를 푸는 자리가 아니면 그냥 소리만 낸다. */
    function soundOnly(midi) {
        if (!window.PianoEngine) return;
        window.PianoEngine.playSequence([[midi]], .9).catch(() => {});
    }
    const session = {
        screen: "menu",
        exercise: null,
        preset: null,
        drill: null,
        level: "easy",
        mode: "",
        input: "buttons",
        limit: 10,
        inversions: [0],
        reveal: false,
        enabled: new Set(),
        pool: [],
        current: null,
        typed: [],
        answered: false,
        right: 0,
        total: 0,
        perItem: new Map(),
        timer: 0,
        playTimer: 0
    };

    let lessonKeyPress = null;

    function showScreen(name) {
        if (session.screen === "lesson" && name !== "lesson") stopLit();
        ["menu", "course", "lesson", "wheel", "drill", "result"].forEach(key => {
            els[key + "Screen"].hidden = key !== name;
        });
        session.screen = name;
        document.body.classList.toggle("wheel-open", name === "wheel");
        document.body.classList.toggle("lesson-open", name === "lesson");
        window.scrollTo({ top: 0 });
    }

    const CARD_ICONS = {
        interval: `<svg class="genre-icon" viewBox="0 0 48 48" fill="none">
            <path d="M19 8 L19 22 C19 26 23 26 23 26 C23 26 27 26 27 22 L27 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="23" y1="26" x2="23" y2="38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="10" cy="34" r="3.5" fill="currentColor"/>
            <line x1="13.5" y1="34" x2="13.5" y2="18" stroke="currentColor" stroke-width="2"/>
            <circle cx="38" cy="18" r="3.5" fill="currentColor"/>
            <line x1="41.5" y1="18" x2="41.5" y2="6" stroke="currentColor" stroke-width="2"/>
            <path d="M13.5 18 C24 14 30 10 41.5 6" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2 2" opacity="0.85"/>
        </svg>`,
        chord: `<svg class="genre-icon" viewBox="0 0 48 48" fill="none">
            <circle cx="18" cy="34" r="4.2" fill="currentColor" fill-opacity="0.8"/>
            <circle cx="18" cy="24" r="4.2" fill="currentColor" fill-opacity="0.8"/>
            <circle cx="18" cy="14" r="4.2" fill="currentColor" fill-opacity="0.8"/>
            <line x1="22.2" y1="34" x2="22.2" y2="8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M22.2 8 Q34 10 38 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M8 24 C14 20 24 20 30 24" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2" opacity="0.6"/>
        </svg>`,
        scale: `<svg class="genre-icon" viewBox="0 0 48 48" fill="none">
            <circle cx="10" cy="36" r="3" fill="currentColor"/>
            <circle cx="18" cy="30" r="3" fill="currentColor"/>
            <circle cx="26" cy="24" r="3" fill="currentColor"/>
            <circle cx="34" cy="18" r="3" fill="currentColor"/>
            <circle cx="42" cy="12" r="3" fill="currentColor"/>
            <path d="M10 36 L18 30 L26 24 L34 18 L42 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="8" y1="41" x2="44" y2="41" stroke="currentColor" stroke-width="1.8" opacity="0.4"/>
        </svg>`,
        position: `<svg class="genre-icon" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="25" width="13" height="13" rx="3" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/>
            <text x="14.5" y="34.5" fill="currentColor" font-size="9" font-weight="900" text-anchor="middle" dominant-baseline="middle">1</text>
            <rect x="27" y="10" width="13" height="13" rx="3" fill="currentColor" fill-opacity="0.45" stroke="currentColor" stroke-width="2"/>
            <text x="33.5" y="19.5" fill="currentColor" font-size="9" font-weight="900" text-anchor="middle" dominant-baseline="middle">3</text>
            <path d="M18 19 C22 13 25 12 27 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M25 9 L29 12 L25 15" fill="currentColor"/>
            <path d="M30 29 C26 35 23 36 21 36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M23 39 L19 36 L23 33" fill="currentColor"/>
        </svg>`,
        progression: `<svg class="genre-icon" viewBox="0 0 48 48" fill="none">
            <circle cx="11" cy="24" r="6" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.8"/>
            <text x="11" y="24.5" fill="currentColor" font-size="8" font-weight="900" text-anchor="middle" dominant-baseline="middle">I</text>
            <line x1="17" y1="24" x2="21" y2="24" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="27" cy="16" r="6" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.8"/>
            <text x="27" y="16.5" fill="currentColor" font-size="7" font-weight="900" text-anchor="middle" dominant-baseline="middle">IV</text>
            <line x1="33" y1="18" x2="37" y2="24" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="41" cy="30" r="6" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.8"/>
            <text x="41" y="30.5" fill="currentColor" font-size="7" font-weight="900" text-anchor="middle" dominant-baseline="middle">V</text>
            <path d="M35 34 C25 40 18 36 14 30" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2" stroke-linecap="round"/>
        </svg>`,
        rhythm: `<svg class="genre-icon" viewBox="0 0 48 48" fill="none">
            <path d="M16 40 L20 11 C20.5 9 27.5 9 28 11 L32 40 Z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <line x1="24" y1="36" x2="33" y2="16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="33" cy="16" r="3" fill="currentColor"/>
            <path d="M11 22 C8 24 8 28 11 30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M37 22 C40 24 40 28 37 30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="12" y1="40" x2="36" y2="40" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`,
        course: `<svg class="genre-icon" viewBox="0 0 48 48" fill="none">
            <path d="M24 16 C20 12 12 12 8 14 L8 36 C12 34 20 34 24 38 C28 34 36 34 40 36 L40 14 C36 12 28 12 24 16 Z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <line x1="24" y1="16" x2="24" y2="38" stroke="currentColor" stroke-width="2"/>
            <path d="M24 6 L25.8 9.6 L29.8 10.2 L26.9 13 L27.6 17 L24 15.1 L20.4 17 L21.1 13 L18.2 10.2 L22.2 9.6 Z" fill="currentColor"/>
        </svg>`,
        wheel: `<svg class="genre-icon" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="17" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>
            <circle cx="24" cy="24" r="11" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="24" cy="24" r="3" fill="currentColor"/>
            <line x1="24" y1="7" x2="24" y2="13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="24" y1="35" x2="24" y2="41" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="7" y1="24" x2="13" y2="24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="35" y1="24" x2="41" y2="24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>`
    };

    const COURSE_META = {
        interval: { en: "Intervals", ko: "음정", theme: "interval", icon: "interval" },
        chord: { en: "Chords", ko: "화음", theme: "chord", icon: "chord" },
        progression: { en: "Chord Progressions", ko: "화음 진행", theme: "progression", icon: "progression" },
        scale: { en: "Scales", ko: "음계", theme: "scale", icon: "scale" },
        rhythm: { en: "Rhythm", ko: "리듬", theme: "rhythm", icon: "rhythm" }
    };

    function createGlassCard(meta, onOpen) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "genre-card card-" + (meta.theme || "gold");
        button.setAttribute("aria-label", meta.ko + " (" + meta.en + ")");

        const glow = document.createElement("div");
        glow.className = "card-glow";
        glow.setAttribute("aria-hidden", "true");

        const iconWrap = document.createElement("div");
        iconWrap.className = "card-icon-wrap";
        iconWrap.setAttribute("aria-hidden", "true");
        iconWrap.innerHTML = CARD_ICONS[meta.icon || meta.theme] || CARD_ICONS.interval;

        const body = document.createElement("div");
        body.className = "card-body";

        const en = document.createElement("span");
        en.className = "genre-en";
        en.textContent = meta.en;

        const ko = document.createElement("strong");
        ko.className = "genre-ko";
        ko.textContent = meta.ko;

        body.append(en, ko);
        button.append(glow, iconWrap, body);
        button.addEventListener("click", onOpen);
        return button;
    }


    /* 첫 화면은 과정과 찾아보기뿐이다. 판은 과정 줄에 섞여 들어갔다. */
    function renderMenu() {
        els.courseList.innerHTML = "";
        (window.EarCourses || []).forEach(course => {
            const meta = COURSE_META[course.id] || { en: "Music Theory", ko: course.name, theme: "gold", icon: "course" };
            els.courseList.append(createGlassCard(meta, () => openCourse(course.id)));
        });

        els.toolList.innerHTML = "";
        els.toolList.append(createGlassCard({
            en: "Circle of Fifths",
            ko: "5도권 원판",
            theme: "wheel",
            icon: "wheel"
        }, () => { session.exercise = null; openWheel(); }));
    }

    /* 판 하나를 그 방법으로 시작한다. */
    function startPreset(drill, preset, input, reveal) {
        session.drill = drill;
        session.preset = preset;
        session.input = input;
        session.mode = "";
        session.limit = 10;
        session.inversions = [0];
        /* 악보를 보고 고르는 문제는 처음부터 악보를 다 보여 준다. */
        session.reveal = reveal === true;
        session.fromLesson = null;
        session.enabled = new Set(preset.ids || [preset.id]);
        session.slots = [];
        beginRound();
    }



    /* 음정 성질 사슬: 반음 하나씩 넓히거나 좁힐 때 이름이 어떻게 바뀌는지 */
    const SVG_NS = "http://www.w3.org/2000/svg";

    function svgNode(tag, attrs, text) {
        const node = document.createElementNS(SVG_NS, tag);
        Object.keys(attrs || {}).forEach(key => node.setAttribute(key, attrs[key]));
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function chainBox(parent, x, y, w, h, en, ko, kind) {
        const group = svgNode("g", { class: "chain-box is-" + kind });
        group.append(svgNode("rect", { x: x, y: y, width: w, height: h, rx: 7 }));
        group.append(svgNode("text", { class: "chain-en", x: x + w / 2, y: y + h / 2 - 3 }, en));
        group.append(svgNode("text", { class: "chain-ko", x: x + w / 2, y: y + h / 2 + 15 }, ko));
        parent.append(group);
    }

    function chainArrow(parent, x1, y1, x2, y2, note, nx, ny) {
        parent.append(svgNode("line", {
            class: "chain-arrow", x1: x1, y1: y1, x2: x2, y2: y2, "marker-end": "url(#chainHead)"
        }));
        parent.append(svgNode("text", { class: "chain-note", x: nx, y: ny }, note));
    }

    function qualityChainDiagram() {
        const svg = svgNode("svg", {
            class: "chain",
            viewBox: "0 0 720 286",
            role: "img",
            "aria-label": "완전 계열은 감과 증으로, 장·단 계열은 단에서 감으로 장에서 증으로 이름이 바뀝니다"
        });
        const defs = svgNode("defs");
        const marker = svgNode("marker", {
            id: "chainHead", viewBox: "0 0 10 10", refX: 9, refY: 5,
            markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse"
        });
        marker.append(svgNode("path", { class: "chain-head", d: "M0,0 L10,5 L0,10 z" }));
        defs.append(marker);
        svg.append(defs);

        svg.append(svgNode("text", { class: "chain-family is-perfect", x: 360, y: 22 }, "1 · 4 · 5 · 8도"));
        svg.append(svgNode("text", { class: "chain-family is-majmin", x: 360, y: 186 }, "2 · 3 · 6 · 7도"));

        chainArrow(svg, 298, 60, 264, 100, "반음 −", 244, 70);
        chainArrow(svg, 422, 60, 456, 100, "반음 +", 476, 70);
        chainArrow(svg, 248, 200, 220, 156, "반음 −", 196, 196);
        chainArrow(svg, 472, 200, 500, 156, "반음 +", 524, 196);
        chainArrow(svg, 378, 220, 350, 220, "반음 −", 364, 268);
        chainArrow(svg, 168, 126, 138, 126, "반음 −", 153, 93);
        chainArrow(svg, 552, 126, 582, 126, "반음 +", 567, 93);

        chainBox(svg, 300, 30, 120, 50, "Perfect", "완전", "perfect");
        chainBox(svg, 170, 100, 100, 52, "Dim.", "감", "plain");
        chainBox(svg, 30, 100, 106, 52, "Double dim.", "겹감", "plain");
        chainBox(svg, 450, 100, 100, 52, "Aug.", "증", "plain");
        chainBox(svg, 586, 100, 106, 52, "Double aug.", "겹증", "plain");
        chainBox(svg, 250, 194, 98, 52, "Minor", "단", "majmin");
        chainBox(svg, 380, 194, 98, 52, "Major", "장", "majmin");

        return svg;
    }


    /* 리듬 ---------------------------------------------------------------- */
    const RN = window.RhythmNotation;
    const BEAT_SECONDS = .62;

    const BAR_CELLS = 48;

    const RHYTHM_SETS = {
        g4: { cells: 4, beat: ["quarter", "rest"], longs: ["h", "hd", "w"] },
        g8: { cells: 8, beat: ["quarter", "eighths"], longs: ["h"] },
        g8r: { cells: 8, beat: ["quarter", "eighths", "rest", "eighthRest", "offEighth"], longs: ["h", "hd"] },
        g16: { cells: 16, beat: ["quarter", "eighths", "sixteenths", "twoThenOne", "oneThenTwo", "rest"], longs: ["h"] },
        gdot: { cells: 16, beat: ["quarter", "eighths", "dottedPair", "oneThenTwo", "rest"], longs: ["h", "hd"] },
        gtie: { cells: 8, beat: ["quarter", "eighths", "offEighth", "eighthRest"], longs: ["h", "hd", "w"] },
        pick: { cells: 16, beat: ["quarter", "eighths", "sixteenths", "twoThenOne", "oneThenTwo", "dottedPair", "rest", "eighthRest"], longs: ["h", "hd"] },
        trip: { cells: 0, triplets: true, beat: ["quarter", "eighths", "triplet"], longs: ["h"] },
        tripMix: { cells: 0, triplets: true, beat: ["quarter", "eighths", "sixteenths", "triplet", "tripletHead", "rest"], longs: ["h"] }
    };

    /*
     * 마디 하나를 만든다. "치는 자리에서 다음 칠 자리까지 이어진다"는 규칙으로
     * 적을 수 없는 리듬(붙임줄이 필요한 것)은 버리고 다시 만든다. 그러면 어느
     * 문제에서나 악보가 한 가지로만 적히고, 마디 속에 쓸데없는 쉼표가 생기지
     * 않는다 — 8분음표 다음에 8분쉼표를 붙이는 것은 4분음표 하나로 적을 일이다.
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

    function nudgeOnsets(cells, allowFirst) {
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
        const answer = RN.canonical(rhythmBar(item.set).bar, BAR_CELLS);
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
        fill(() => nudgeOnsets(RN.onsets(answer), false), 300);
        fill(() => nudgeOnsets(RN.onsets(answer), true), 300);
        fill(() => nudgeOnsets(RN.onsets(pick(bars)), true), 200);
        fill(() => RN.canonical(rhythmBar(item.set).bar, BAR_CELLS), 300);

        const order = shuffled(bars);
        return {
            silentStaff: true,
            rhythm: { bar: answer, onsets: RN.onsets(answer) },
            bars: { list: order, answer: order.indexOf(answer) },
            detail: ""
        };
    }

    /* 악보를 보고 두드리는 문제. */
    function rhythmTapQuestion(item) {
        const made = rhythmBar(item.set);
        const bar = RN.canonical(made.bar, BAR_CELLS);
        return {
            showBar: bar,
            rhythm: { bar: bar, onsets: RN.onsets(bar) },
            tap: { onsets: RN.onsets(bar) },
            detail: ""
        };
    }


    /* 리듬 문제 화면 ------------------------------------------------------- */

    function setupRhythm(question) {
        els.drillScreen.classList.remove("is-keys");
        els.staff.hidden = true;
        els.choices.hidden = true;
        els.pairWrap.hidden = true;
        els.keyboardWrap.hidden = true;
        els.typedCount.hidden = true;

        /* 받아쓰기는 악보를 감추고, 읽기는 보여 준다. */
        els.replayButton.textContent = question.tap ? "♪ 세어 주기" : "♪ 다시 듣기";
        els.rhythmWrap.hidden = !question.showBar;
        if (question.showBar) {
            els.rhythmBoard.innerHTML = "";
            els.rhythmBoard.append(RN.render(question.showBar, { meter: "4/4" }));
        }

        els.gridWrap.hidden = !question.grid;
        els.barsWrap.hidden = !question.bars;
        els.tapWrap.hidden = !question.tap;

        if (question.grid) buildGrid(question.grid.cells);
        if (question.bars) buildBarChoices(question.bars.list);
        if (question.tap) resetTapPad(question);
    }

    /* 정간보처럼 한 마디를 칸으로 나눈다. */
    function buildGrid(cells) {
        session.grid = new Set();
        els.beatGrid.innerHTML = "";
        els.beatGrid.dataset.cells = String(cells);
        els.beatGrid.style.gridTemplateColumns = "repeat(" + cells + ", minmax(0, 1fr))";
        const perBeat = cells / 4;
        for (let cell = 0; cell < cells; cell += 1) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "beat-cell" + (cell % perBeat === 0 ? " is-beat" : "");
            button.dataset.cell = String(cell);
            button.setAttribute("aria-pressed", "false");
            if (cell % perBeat === 0) button.textContent = String(cell / perBeat + 1);
            button.addEventListener("click", () => {
                if (session.answered) return;
                if (session.grid.has(cell)) session.grid.delete(cell);
                else {
                    session.grid.add(cell);
                    playTick();
                }
                button.setAttribute("aria-pressed", String(session.grid.has(cell)));
            });
            els.beatGrid.append(button);
        }
    }

    function playTick() {
        if (window.PianoEngine) window.PianoEngine.playRhythm([0], BEAT_SECONDS, { countIn: 0 });
    }

    function buildBarChoices(list) {
        els.barsWrap.innerHTML = "";
        list.forEach((bar, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "bar-choice";
            button.dataset.index = String(index);
            button.append(RN.render(bar, { meter: "4/4" }));
            button.addEventListener("click", () => answerBarChoice(index));
            els.barsWrap.append(button);
        });
    }

    function resetTapPad(question) {
        session.taps = [];
        session.tapZero = null;
        els.tapPad.disabled = true;
        els.tapPad.textContent = "두드리기";
        els.tapCount.textContent = "";
    }

    /* 받아쓰기: 켠 칸을 정답과 견준다. */
    function submitGrid() {
        if (session.answered) return;
        const want = session.current.grid.answer.slice().sort((a, b) => a - b);
        const got = Array.from(session.grid).sort((a, b) => a - b);
        const correct = want.length === got.length && want.every((cell, index) => cell === got[index]);
        markGrid(want, got);
        settle(correct);
    }

    function markGrid(want, got) {
        Array.from(els.beatGrid.children).forEach(cell => {
            const index = Number(cell.dataset.cell);
            cell.disabled = true;
            if (want.indexOf(index) >= 0) cell.classList.add(got.indexOf(index) >= 0 ? "is-right" : "is-missed");
            else if (got.indexOf(index) >= 0) cell.classList.add("is-wrong");
        });
    }

    function answerBarChoice(index) {
        if (session.answered) return;
        const want = session.current.bars.answer;
        Array.from(els.barsWrap.children).forEach((button, position) => {
            button.disabled = true;
            if (position === want) button.classList.add("right");
            else if (position === index) button.classList.add("wrong");
            else button.classList.add("dim");
        });
        settle(index === want);
    }

    /* 답을 보여 줄 때 정답 리듬을 악보로 그려 준다. */
    function showRhythmAnswer(correct) {
        els.rhythmWrap.hidden = false;
        els.rhythmBoard.innerHTML = "";
        els.rhythmBoard.append(RN.render(session.current.rhythm.bar, {
            meter: "4/4",
            mark: correct ? "right" : "wrong"
        }));
    }

    /* 읽기: 세어 주기를 누르면 메트로놈이 돌고 그동안 두드린다. */
    function startTapRound() {
        if (session.answered || !window.PianoEngine) return;
        const lead = window.PianoEngine.metronome(8, BEAT_SECONDS);
        if (lead === null) return;
        session.taps = [];
        session.tapZero = lead + 4 * BEAT_SECONDS;
        els.tapPad.disabled = false;
        els.tapPad.textContent = "두드리기";
        els.tapCount.textContent = "0 번";
        window.clearTimeout(session.tapTimer);
        const wait = (session.tapZero - window.PianoEngine.now() + 4 * BEAT_SECONDS + .35) * 1000;
        session.tapTimer = window.setTimeout(judgeTaps, wait);
    }

    function onTap() {
        if (session.answered || session.tapZero === null) return;
        session.taps.push(window.PianoEngine.now());
        els.tapCount.textContent = session.taps.length + " 번";
        playTick();
    }

    /*
     * 친 때를 악보의 자리와 견준다. 한 박의 4분의 1 안에 들면 맞은 것으로 본다.
     */
    function judgeTaps() {
        if (session.answered) return;
        const want = session.current.tap.onsets.map(cell => session.tapZero + cell / RN.PER_BEAT * BEAT_SECONDS);
        const window_ = Math.max(.13, BEAT_SECONDS * .28);
        const taken = new Set();
        let hit = 0;
        want.forEach(time => {
            let best = -1;
            let bestGap = window_;
            session.taps.forEach((tap, index) => {
                if (taken.has(index)) return;
                const gap = Math.abs(tap - time);
                if (gap < bestGap) { bestGap = gap; best = index; }
            });
            if (best >= 0) { taken.add(best); hit += 1; }
        });
        const extra = session.taps.length - taken.size;
        const correct = hit === want.length && extra === 0;
        els.tapPad.disabled = true;
        els.tapCount.textContent = "맞은 자리 " + hit + " / " + want.length
            + (extra ? " · 더 친 것 " + extra : "");
        settle(correct);
    }

    /* 과정 ---------------------------------------------------------------- */
    let course = null;
    let lessonIndex = -1;

    function courseById(id) {
        return (window.EarCourses || []).find(entry => entry.id === id) || null;
    }

    function lessonMark(courseId, lessonId) {
        return (saved.progress[courseId] || {})[lessonId] || null;
    }

    function setLessonMark(courseId, lessonId, mark) {
        if (!saved.progress[courseId]) saved.progress[courseId] = {};
        saved.progress[courseId][lessonId] = mark;
        persist();
    }

    function openCourse(courseId) {
        course = courseById(courseId);
        if (!course) return;
        els.courseTitle.textContent = course.name;
        renderLessonList();
        showScreen("course");
    }

    /*
     * 과정 줄 --------------------------------------------------------------
     * 한 줄이 한 마디다. 그 줄에서 할 수 있는 것만 아이콘으로 붙는다.
     * 판(preset) 줄은 설명과 읽기가 없는 줄일 뿐이라 같은 꼴로 그린다.
     */
    const ROW_ACTS = [
        { key: "text", mark: "≡", text: "설명 읽기" },
        { key: "read", mark: "𝄞", text: "악보 보고 고르기" },
        { key: "listen", mark: "♪", text: "소리 듣고 고르기" },
        { key: "keys", mark: "🎹", text: "건반 찍기" }
    ];

    function rowName(lesson) {
        if (lesson.kind !== "preset") return lesson.title;
        const preset = presetOf(lesson);
        return preset ? preset.name : lesson.preset;
    }

    function presetOf(lesson) {
        return (PRESETS[lesson.drill] || []).find(entry => entry.id === lesson.preset);
    }

    /* 판 줄에서 쓸 수 있는 답하는 방법을 아이콘 이름으로 바꾼다. */
    function presetActs(lesson) {
        const drill = DRILL_BY_ID[lesson.drill];
        if (!drill) return [];
        const list = drill.inputs.map(input => (input === "keyboard" ? "keys" : "listen"));
        /* 화음 진행은 악보를 보고 로마숫자로 적어 볼 수도 있다. */
        if (drill.readable) list.unshift("read");
        return list;
    }

    function actsOf(lesson) {
        if (lesson.kind === "preset") return presetActs(lesson);
        const list = [];
        if (lesson.body) list.push("text");
        if (lesson.read) list.push("read");
        if (lesson.listen) list.push("listen");
        if (lesson.keys) list.push("keys");
        return list;
    }

    function actButton(index, lesson, act) {
        const spec = ROW_ACTS.find(entry => entry.key === act);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "row-act is-" + act;
        button.textContent = spec.mark;
        button.title = spec.text;
        button.setAttribute("aria-label", rowName(lesson) + " — " + spec.text);
        button.addEventListener("click", () => startRowAct(index, act));
        return button;
    }

    function renderLessonList() {
        els.lessonList.innerHTML = "";
        let step = 0;
        course.lessons.forEach((lesson, index) => {
            const acts = actsOf(lesson);
            const row = document.createElement("div");
            row.className = "lesson-row" + (lesson.kind === "preset" ? " is-preset" : "");

            const order = document.createElement("span");
            order.className = "lesson-order";
            if (lesson.kind !== "preset") { step += 1; order.textContent = step + "차시"; }
            row.append(order);

            const name = document.createElement("span");
            name.className = "lesson-name";
            name.textContent = rowName(lesson);
            row.append(name);

            const marks = document.createElement("span");
            marks.className = "row-acts";
            acts.forEach(act => marks.append(actButton(index, lesson, act)));
            row.append(marks);

            els.lessonList.append(row);
        });
    }

    /* 줄의 아이콘 하나를 누르면 그 활동만 바로 연다. */
    function startRowAct(index, act) {
        const lesson = course.lessons[index];
        if (!lesson) return;
        lessonIndex = index;
        if (act === "text") { openLesson(index); return; }
        if (lesson.kind === "preset") {
            const preset = presetOf(lesson);
            if (preset) {
                startPreset(DRILL_BY_ID[lesson.drill], preset,
                    act === "keys" ? "keyboard" : null, act === "read");
            }
            return;
        }
        startActivity(lesson, act);
    }

    function openLesson(index) {
        const lesson = course.lessons[index];
        if (!lesson) return;
        lessonIndex = index;
        els.lessonTitle.textContent = lesson.title;
        els.lessonBody.innerHTML = "";
        lesson.body.forEach(paragraph => {
            const node = document.createElement("p");
            node.textContent = paragraph;
            els.lessonBody.append(node);
        });
        stopLit();
        exampleBlocks = [];
        currentRoot = null;
        els.lessonExamples.innerHTML = "";
        if (lesson.diagram === "quality-chain") {
            const board = document.createElement("div");
            board.className = "diagram-board";
            board.append(qualityChainDiagram());
            els.lessonExamples.append(board);
        }
        (lesson.examples || []).forEach(entry => els.lessonExamples.append(
            typeof entry === "string" ? intervalExample(entry)
                : entry.pattern ? rhythmExample(entry)
                    : entry.scale ? scaleExample(entry)
                        : entry.prog ? progressionExample(entry)
                            : chordExample(entry)
        ));
        /* 근음을 옮겨도 오선과 건반 안에 머무는 차시에서만 근음을 고르게 한다. */
        const pickable = exampleBlocks.length > 0
            && exampleBlocks.every(block => block.span <= 12);
        setExampleRoot(N.natural(4 * 7), false);
        els.lessonKeysLabel.textContent = label("Root", "근음");
        els.lessonKeysLabel.hidden = !pickable;
        lessonKeyPress = pickable
            ? midi => setExampleRoot(pickRoot(((midi % 12) + 12) % 12), true)
            : null;

        const nextText = course.lessons.findIndex((entry, at) => at > index && entry.body);
        els.lessonNext.textContent = nextText >= 0 ? "다음 차시" : "과정 목록";
        els.lessonNext.dataset.next = String(nextText);
        /* 문제는 과정 목록 줄의 아이콘으로 연다. 설명 화면에는 두지 않는다. */
        setLessonMark(course.id, lesson.id, { read: true });
        showScreen("lesson");
    }

    /* 보기 악보는 차시가 달라도 같은 크기여야 한다. 한 눈금을 이 배율로 못 박는다. */
    const EXAMPLE_ZOOM = 1.15;
    /* 어느 보기든 오선 길이를 같게 둔다. 여덟 음 음계가 들어가는 길이다. */
    const STAFF_UNITS = 366;

    const EXAMPLE_SHAPES = [
        { id: "up", label: label("Ascending", "상행") },
        { id: "down", label: label("Descending", "하행") },
        { id: "harmony", label: label("Harmonic", "화성") }
    ];

    function intervalExample(intervalId) {
        const item = INTERVALS.concat(DISPLAY_INTERVALS).find(entry => entry.id === intervalId);
        const block = document.createElement("div");
        block.className = "example";

        const head = document.createElement("div");
        head.className = "example-head";
        block.append(head);

        const caption = document.createElement("p");
        caption.className = "example-caption";
        head.append(caption);

        const row = document.createElement("div");
        row.className = "shape-row";
        head.append(row);

        const board = document.createElement("div");
        board.className = "example-board";
        block.append(board);

        const topOf = root => N.step(root, item.degree, item.semis);
        let shapeId = "up";

        const draw = chosen => {
            const root = betterRoot(chosen, place => countDeep([place, topOf(place)]));
            const top = topOf(root);
            const harmony = shapeId === "harmony";
            const down = shapeId === "down";
            const columns = harmony
                ? [{ notes: [root, top] }]
                : down ? [{ notes: [top] }, { notes: [root] }] : [{ notes: [root] }, { notes: [top] }];
            const order = harmony
                ? [{ column: 0, midis: [root.midi, top.midi] }]
                : down
                    ? [{ column: 0, midis: [top.midi] }, { column: 1, midis: [root.midi] }]
                    : [{ column: 0, midis: [root.midi] }, { column: 1, midis: [top.midi] }];

            caption.textContent = N.name(root) + " " + item.label;
            board.innerHTML = "";
            board.append(N.render(columns, { label: N.name(root) + " " + item.label, zoom: EXAMPLE_ZOOM, minWidth: STAFF_UNITS }));

            row.innerHTML = "";
            EXAMPLE_SHAPES.forEach(shape => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "shape-button";
                button.textContent = shape.label;
                button.setAttribute("aria-pressed", String(shape.id === shapeId));
                button.addEventListener("click", () => {
                    shapeId = shape.id;
                    draw(chosen);
                    playRun(board, shapeId === "harmony"
                        ? [{ column: 0, midis: [root.midi, top.midi] }]
                        : shapeId === "down"
                            ? [{ column: 0, midis: [top.midi] }, { column: 1, midis: [root.midi] }]
                            : [{ column: 0, midis: [root.midi] }, { column: 1, midis: [top.midi] }],
                    shapeId === "harmony" ? 2 : .7);
                });
                row.append(button);
            });
            return order;
        };

        exampleBlocks.push({
            draw: draw,
            deep: root => countDeep([root, topOf(root)]),
            span: item.semis,
            play: () => {
                const order = draw(currentRoot);
                playRun(board, order, shapeId === "harmony" ? 2 : .7);
            }
        });
        return block;
    }

    /*
     * 보기 하나는 draw·deep·span 셋으로 이루어진다.
     *   draw(root) — 그 근음으로 다시 그린다
     *   deep(root) — 그 근음으로 적었을 때 생기는 겹임시표 수
     *   span       — 근음에서 가장 높은 음까지의 반음 수
     * 근음을 건반에서 고를 수 있는 차시는 span이 한 옥타브를 넘지 않는 차시다.
     * 겹음정처럼 더 넓은 보기는 근음을 옮기면 오선과 건반을 벗어난다.
     */
    let exampleBlocks = [];

    function countDeep(notes) {
        return notes.filter(note => Math.abs(note.accidental) > 1).length;
    }

    /*
     * 근음을 고를 때 겹임시표가 생기지 않는 쪽으로 적는다. 예를 들어 검은건반 하나를
     * D♭로 적으면 Locrian(로크리아)에 겹내림표가 생기므로 C♯으로 적는다.
     */
    const FLAT_PREFERRED = { 1: true, 3: true, 8: true, 10: true };

    function rootCandidates(pitchClass) {
        const list = [];
        const plain = N.LETTER_SEMIS.indexOf(pitchClass);
        if (plain >= 0) {
            list.push(N.spell(4 * 7 + plain, 0));
            return list;
        }
        const below = N.LETTER_SEMIS.indexOf(pitchClass - 1);
        const above = N.LETTER_SEMIS.indexOf(pitchClass + 1);
        if (below >= 0) list.push(N.spell(4 * 7 + below, 1));
        if (above >= 0) list.push(N.spell(4 * 7 + above, -1));
        return list;
    }

    function pickRoot(pitchClass) {
        const list = rootCandidates(pitchClass);
        if (list.length < 2) return list[0];
        const deep = root => exampleBlocks.reduce((sum, block) => sum + block.deep(root), 0);
        const sharp = list.find(root => root.accidental > 0);
        const flat = list.find(root => root.accidental < 0);
        const sharpDeep = deep(sharp);
        const flatDeep = deep(flat);
        if (sharpDeep !== flatDeep) return sharpDeep < flatDeep ? sharp : flat;
        return FLAT_PREFERRED[pitchClass] ? flat : sharp;
    }

    /* 그 보기에 겹임시표가 생기면 같은 소리의 다른 이름으로 적어 본다. */
    function betterRoot(root, deep) {
        if (deep(root) === 0) return root;
        const other = enharmonicRoot(root);
        if (!other) return root;
        return deep(other) < deep(root) ? other : root;
    }

    /* 소리가 나는 동안 악보와 건반에 차례로 불을 켠다. */
    let litTimers = [];

    function stopLit() {
        litTimers.forEach(id => window.clearTimeout(id));
        litTimers = [];
        if (lessonKeyboard) lessonKeyboard.clearLit();
        document.querySelectorAll(".sheet-column.is-lit").forEach(node => node.classList.remove("is-lit"));
    }

    /*
     * order는 [{ column, midis }] 꼴이다. 소리가 나는 때에 맞춰 그 칸과 건반에 불을 켠다.
     * delay는 이 줄이 몇 밀리초 뒤에 시작하는지다.
     */
    function litRun(host, order, beat, delay) {
        const columns = host.querySelectorAll(".sheet-column");
        const dark = () => {
            columns.forEach(node => node.classList.remove("is-lit"));
            if (lessonKeyboard) lessonKeyboard.clearLit();
        };
        order.forEach((entry, index) => {
            litTimers.push(window.setTimeout(() => {
                dark();
                if (columns[entry.column]) columns[entry.column].classList.add("is-lit");
                if (lessonKeyboard) entry.midis.forEach(midi => lessonKeyboard.lit(midi, true));
            }, (delay || 0) + 55 + index * beat * 1000));
        });
        litTimers.push(window.setTimeout(dark, (delay || 0) + 55 + order.length * beat * 1000 + 240));
    }

    function playRun(host, order, beat) {
        stopLit();
        window.PianoEngine.playSequence(order.map(entry => entry.midis), beat).catch(() => {});
        litRun(host, order, beat, 0);
    }

    const SCALE_BEAT = .4;

    /* 올라갔다 내려온다. 꼭대기 음은 한 번만 친다. */
    function playScale(notes, host) {
        const order = notes.map((note, index) => ({ column: index, midis: [note.midi] }));
        for (let index = notes.length - 2; index >= 0; index -= 1) {
            order.push({ column: index, midis: [notes[index].midi] });
        }
        playRun(host, order, SCALE_BEAT);
    }

    function scaleExample(entry) {
        const item = SCALES.find(scale => scale.id === entry.scale);

        const block = document.createElement("div");
        block.className = "example";

        const caption = document.createElement("p");
        caption.className = "example-caption";
        block.append(caption);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "example-play is-wide";
        block.append(button);

        const draw = root => {
            const notes = readableScale(root, item);
            caption.textContent = N.name(notes[0]) + " " + item.label;
            button.setAttribute("aria-label", N.name(notes[0]) + " " + item.label);
            button.innerHTML = "";
            button.append(N.render(
                notes.map(note => ({ notes: [note] })),
                { label: N.name(notes[0]) + " " + item.label, zoom: EXAMPLE_ZOOM, minWidth: STAFF_UNITS }
            ));
            button.onclick = () => playScale(notes, button);
            return notes;
        };

        exampleBlocks.push({
            draw: draw,
            deep: root => countDeep(scaleNotes(root, item)),
            span: 12,
            play: () => playScale(readableScale(currentRoot, item), button)
        });
        return block;
    }

    /* 건반에서 근음을 고르면 그 차시의 보기가 모두 그 근음으로 다시 그려진다. */
    let currentRoot = null;

    function setExampleRoot(root, play) {
        stopLit();
        currentRoot = root;
        exampleBlocks.forEach(block => block.draw(root));
        if (play && exampleBlocks.length) exampleBlocks[0].play();
    }

    /*
     * 차시에 싣는 리듬 보기. "q e e -q" 처럼 적으면 4분음표, 8분음표 둘, 4분쉼표가 된다.
     * 앞에 -를 붙이면 쉼표다.
     */
    function parseBar(text) {
        return text.split(/\s+/).filter(Boolean).map(token => (token.charAt(0) === "-"
            ? { v: token.slice(1), rest: true }
            : { v: token }));
    }

    function rhythmExample(entry) {
        const bar = parseBar(entry.pattern);
        const block = document.createElement("div");
        block.className = "example";

        const caption = document.createElement("p");
        caption.className = "example-caption";
        caption.textContent = entry.caption;
        block.append(caption);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "example-play is-wide";
        button.setAttribute("aria-label", entry.caption);
        button.append(RN.render(bar, { meter: "4/4", label: entry.caption, zoom: EXAMPLE_ZOOM }));
        button.addEventListener("click", () => {
            window.PianoEngine.playRhythm(
                RN.onsets(bar).map(cell => cell / RN.PER_BEAT),
                BEAT_SECONDS,
                { countIn: 4 }
            );
        });
        block.append(button);
        return block;
    }

    const POSITION_LABEL = [
        label("Root Position", "근음 자리"),
        label("1st Inversion", "첫째 자리바꿈"),
        label("2nd Inversion", "둘째 자리바꿈"),
        label("3rd Inversion", "셋째 자리바꿈")
    ];

    function chordExample(entry) {
        const item = CHORDS.find(chord => chord.id === entry.chord);
        const inversion = entry.inversion || 0;

        const block = document.createElement("div");
        block.className = "example";

        const caption = document.createElement("p");
        caption.className = "example-caption";
        block.append(caption);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "example-play is-wide";
        block.append(button);

        const deep = root => countDeep(chordTones(root, item));

        /* 화성으로 한 번 울린 뒤 한 음씩 펼친다. */
        const playChord = notes => {
            const midis = notes.map(note => note.midi);
            stopLit();
            window.PianoEngine.playSequence([midis], 1.6).catch(() => {});
            litRun(button, [{ column: 0, midis: midis }], 1.6, 0);
            litTimers.push(window.setTimeout(() => {
                window.PianoEngine.playSequence(midis.map(midi => [midi]), .48).catch(() => {});
            }, 1500));
            litRun(button, midis.map((midi, index) => ({ column: index + 1, midis: [midi] })), .48, 1500);
        };

        const draw = chosen => {
            const root = betterRoot(chosen, deep);
            const notes = chordNotes(root, item, inversion);
            const name = N.LETTER_NAMES[root.letter] + (ACC_MARK[String(root.accidental)] || "");
            caption.textContent = name + " " + item.label
                + (entry.inversion === undefined ? "" : " · " + POSITION_LABEL[inversion]);
            button.innerHTML = "";
            button.append(N.render(
                [{ notes: notes }].concat(notes.map(note => ({ notes: [note] }))),
                { label: name + " " + item.label, zoom: EXAMPLE_ZOOM, minWidth: STAFF_UNITS }
            ));
            button.setAttribute("aria-label", name + " " + item.label);
            button.onclick = () => playChord(notes);
        };

        exampleBlocks.push({
            draw: draw,
            deep: deep,
            span: 12,
            play: () => button.click()
        });
        return block;
    }

    /*
     * 진행 예시. 누르면 화음이 하나씩 울리면서 악보 칸과 건반에 불이 들어온다.
     * 차시 건반은 C4~C6이라 왼손 베이스가 닿지 않으므로, 예시에서는 베이스를
     * 따로 두지 않고 오른손 3화음만 이어 붙인다(문제 화면에서는 베이스를 쓴다).
     */
    function progressionExample(entry) {
        const symbols = entry.prog.split("–");
        const item = { id: "ex:" + entry.prog, chords: symbols, minor: entry.minor === true };
        const tonic = pick(progressionRoots(item));
        const scale = item.minor ? minorScale(tonic) : majorScale(tonic);

        const columns = [];
        const groups = [];
        let hand = null;
        symbols.forEach(symbol => {
            const voiced = leadVoicing(numeralNotes(tonic, symbol), hand);
            hand = voiced.map(note => note.midi);
            columns.push({ notes: voiced });
            groups.push(hand.slice());
        });

        const block = document.createElement("div");
        block.className = "example";

        const caption = document.createElement("p");
        caption.className = "example-caption";
        caption.textContent = keyName(tonic, item.minor) + " · " + entry.prog;
        block.append(caption);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "example-play is-wide";
        button.setAttribute("aria-label", entry.prog);
        button.append(N.render(columns, {
            label: entry.prog,
            zoom: EXAMPLE_ZOOM,
            minWidth: STAFF_UNITS,
            keySignature: keySignatureOf(scale)
        }));
        button.onclick = () => playRun(button, groups.map((midis, index) => ({
            column: index, midis: midis
        })), 1.1);
        block.append(button);

        /* 조를 옮겨 그리지 않는다 — 진행은 폭이 넓어 근음 고르기를 쓰지 않는다. */
        exampleBlocks.push({ draw: () => {}, deep: () => 0, span: 40, play: () => button.click() });
        return block;
    }

    /*
     * 차시의 활동 하나를 연다. read는 악보를 보여 준 채로, listen은 소리만,
     * keys는 건반으로 답한다. 판을 가리키는 활동이면 그 판을 그대로 연다.
     */
    function startActivity(lesson, act) {
        const spec = lesson[act];
        if (!spec) return;
        const drillId = act === "keys" ? "build" : (spec.drill || "interval");
        const drill = DRILL_BY_ID[drillId];
        if (!drill) return;
        const preset = spec.preset && (PRESETS[drillId] || []).find(entry => entry.id === spec.preset);
        session.drill = drill;
        session.mode = spec.mode || (act === "read" ? "" : (drill.modes[0] && drill.modes[0].id) || "");
        session.input = act === "keys" ? "keyboard"
            : drillId === "reading" ? "pair"
                : drill.inputs[0] === "slots" ? "slots" : "buttons";
        session.inversions = spec.inversions ? [0, 1, 2] : [0];
        /* 악보를 보고 고르는 문제만 처음부터 악보를 보여 준다. */
        session.reveal = act === "read" && drillId !== "reading";
        session.limit = spec.limit || (spec.items ? spec.items.length * 2 : 10);
        session.enabled = new Set(preset ? preset.ids : (spec.items || []));
        session.preset = preset || null;
        session.slots = [];
        session.typed = [];
        session.fromLesson = { courseId: course.id, lessonId: lesson.id };
        beginRound();
    }




    /* 설명이 있는 다음 줄로 간다 — 판 줄은 건너뛴다. */
    function nextLesson() {
        const next = Number(els.lessonNext.dataset.next);
        if (next >= 0) openLesson(next);
        else { renderLessonList(); showScreen("course"); }
    }


    /* 5도권 원판 ---------------------------------------------------------- */
    let wheel = null;

    /* 원판이 가리키는 조의 다이어토닉 화음을 조표대로 적는다. */
    function wheelChordNames(home, list) {
        const tonic = N.spell(4 * 7 + home.letter, home.acc);
        const scale = majorScale(tonic);
        return list.map(entry => {
            const note = scale[entry.degree];
            const root = N.LETTER_NAMES[note.letter] + (ACC_MARK[String(note.accidental)] || "");
            return Object.assign({}, entry, {
                name: root + (entry.quality === "maj" ? "" : entry.quality === "min" ? "m" : "dim"),
                rootMidi: note.midi
            });
        });
    }

    /* 화음 하나를 가온도 언저리에서 울린다. 너무 높으면 통째로 한 옥타브 내린다. */
    function voiceChord(chord) {
        const shape = { maj: [0, 4, 7], min: [0, 3, 7], dim: [0, 3, 6] }[chord.quality];
        let root = 60 + (((chord.rootMidi - 60) % 12) + 12) % 12;
        const notes = shape.map(step => root + step);
        return notes[notes.length - 1] > 76 ? notes.map(note => note - 12) : notes;
    }

    function openWheel() {
        if (!wheel) {
            wheel = window.Wheel.create(els.wheelBoard, {
                onChange: (list, home) => renderWheelChords(wheelChordNames(home, list)),
                onPlayChord: chord => {
                    const named = wheelChordNames(wheel.home(), [chord])[0];
                    window.PianoEngine.playSequence([voiceChord(named)], 2).catch(() => {});
                },
                onPlayMode: (mode, home) => {
                    const root = 60 + home.tonic;
                    window.PianoEngine.playSequence(mode.steps.map(step => [root + step]), .42).catch(() => {});
                }
            });
        }
        showScreen("wheel");
    }

    /* 화음 이름 뒤의 올림표·내림표도 작게 붙인다. */
    function setChordName(node, text) {
        node.textContent = "";
        text.split(/([\u266F\u266D\u266E])/).forEach(part => {
            if (!part) return;
            if ("\u266F\u266D\u266E".indexOf(part) >= 0) {
                const mark = document.createElement("span");
                mark.className = "acc";
                mark.textContent = part;
                node.append(mark);
            } else node.append(document.createTextNode(part));
        });
    }

    function renderWheelChords(chords) {
        els.wheelChords.innerHTML = "";
        chords.forEach(chord => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "wheel-chord";
            button.innerHTML = '<b></b><span></span><small></small>';
            button.querySelector("b").textContent = chord.roman;
            setChordName(button.querySelector("span"), chord.name);
            button.querySelector("small").textContent = chord.role || "";
            button.addEventListener("click", () => {
                window.PianoEngine.playSequence([voiceChord(chord)], 2).catch(() => {});
            });
            els.wheelChords.append(button);
        });
    }

    function playCadence() {
        const named = wheelChordNames(wheel.home(), wheel.chords());
        const order = [0, 3, 4, 0].map(degree => named.find(chord => chord.degree === degree));
        window.PianoEngine.playSequence(order.map(voiceChord), 1.15).catch(() => {});
    }

    /* 연습 ---------------------------------------------------------------- */

    function recordPreset(drillId, presetId, correct) {
        const table = saved.presets[drillId] || (saved.presets[drillId] = {});
        const entry = table[presetId] || (table[presetId] = { right: 0, total: 0 });
        entry.total += 1;
        if (correct) entry.right += 1;
        persist();
    }

    function beginRound() {
        const drill = session.drill;
        const preset = session.preset;
        /* 판이 낼 문제를 스스로 들고 있으면(가락처럼) 그 판이 곧 문제거리다. */
        session.pool = preset && !preset.ids
            ? [preset]
            : drill.items.filter(item => session.enabled.has(item.id));
        session.bag = null;
        session.right = 0;
        session.total = 0;
        session.perItem = new Map();
        els.askText.textContent = drill.ask;
        showScreen("drill");
        nextQuestion();
    }

    /*
     * 문제거리를 자루에서 뽑는다. 매번 아무거나 집으면 열 문제 내내 쉬운 것만
     * 나오거나 같은 것이 세 번 나오기도 한다. 판에 든 것을 섞어 한 바퀴 다
     * 돌린 뒤에 다시 섞으므로, 판에 든 것은 다 한 번씩 나온다.
     */
    function drawItem() {
        if (!session.bag || !session.bag.length) {
            session.bag = shuffled(session.pool);
            /*
             * 자루를 새로 채웠는데 첫 장이 바로 앞 문제와 같으면 뒤로 미룬다.
             * 둘뿐인 판에서까지 미루면 번갈아 나오는 것이 빤히 보이므로 셋부터다.
             */
            const previous = session.current && session.current.item.id;
            const last = session.bag.length - 1;
            if (last > 1 && session.bag[last].id === previous) {
                session.bag.unshift(session.bag.pop());
            }
        }
        return session.bag.pop();
    }

    function nextQuestion() {
        window.clearTimeout(session.timer);
        if (session.limit && session.total >= session.limit) {
            finishDrill();
            return;
        }

        const drill = session.drill;
        const item = drawItem();

        const question = drill.make(item, session.mode);
        question.preset = session.preset;
        question.item = item;
        /* 읽기 문제에서는 악보를 처음부터 보여 준다. */
        if (session.reveal) question.staffBefore = question.staffAfter;
        session.current = question;
        session.typed = [];
        session.missed = false;
        session.answered = false;
        window.clearTimeout(session.flashTimer);

        const asking = question.ask || drill.ask || "";
        els.askText.textContent = asking;
        els.askText.hidden = !asking;
        els.feedback.textContent = "";
        els.feedback.className = "feedback";
        els.nextButton.hidden = true;
        els.arpButton.hidden = !question.arpeggio && !question.chordsPlay;
        els.arpButton.textContent = question.chordsPlay ? "한 화음씩 끊어 듣기" : "한 음씩 펼쳐 듣기";
        els.melodicButton.hidden = !question.melodic;
        els.keyButton.hidden = !question.homePlay;
        els.helpRow.hidden = els.arpButton.hidden && els.melodicButton.hidden && els.keyButton.hidden;
        els.drillScreen.classList.remove("is-keys", "is-slots");
        els.slotWrap.hidden = true;
        if (session.drill.rhythmDrill) setupRhythm(question);
        else {
            els.replayButton.textContent = "♪ 다시 듣기";
            els.staff.hidden = false;
            /* 리듬 문제를 보고 오면 건반이 감춰진 채로 남는다. */
            els.keyboardWrap.hidden = false;
            els.rhythmWrap.hidden = true;
            els.gridWrap.hidden = true;
            els.tapWrap.hidden = true;
            els.barsWrap.hidden = true;
            drawStaff(question.staffBefore);
            setupInput(question);
        }
        updateScore();
        if (!question.tap) play();
    }

    function drawStaff(columns) {
        els.staff.innerHTML = "";
        const question = session.current || {};
        els.staff.append(N.render(columns, {
            label: "문제 악보",
            minWidth: STAFF_UNITS,
            keySignature: question.keySignature,
            grand: question.grand === true
        }));
    }

    /*
     * 문제에 나오는 음이 다 보이도록 건반 폭을 맞춘다. 텐션 화음은 왼손 베이스가
     * 아래로 내려가므로 세 옥타브가 필요하다. 도(C)에서 시(B)까지로 끊어 잡는다.
     */
    let keyRange = null;

    function drillKeyPress(midi) {
        const answering = session.input === "keyboard"
            && session.current && session.current.keyboard && !session.answered;
        if (answering) answerByKey(midi);
        else soundOnly(midi);
    }

    function fitKeyboard(question) {
        const board = question && question.keyboard;
        const midis = board
            ? board.given.map(given => given.midi).concat(board.answer)
            : [KEY_LOW, KEY_HIGH];
        const low = Math.floor((Math.min.apply(null, midis) - 2) / 12) * 12;
        const high = Math.ceil((Math.max.apply(null, midis) + 3) / 12) * 12 - 1;
        if (keyRange && keyRange.low === low && keyRange.high === high) return;
        keyRange = { low: low, high: high };
        keyboard = window.Keyboard.build(els.pianoKeys, low, high, drillKeyPress);
    }

    function setupInput(question) {
        fitKeyboard(question);
        keyboard.clearMarks();
        keyboard.setEnabled(true);
        if (session.drill.pairAnswer) {
            setupPairInput(question);
            return;
        }
        if (session.drill.slotAnswer) {
            setupSlotInput(question);
            return;
        }
        els.pairWrap.hidden = true;
        els.slotWrap.hidden = true;
        const useKeyboard = session.input === "keyboard" && question.keyboard;
        els.choices.hidden = useKeyboard;
        /* 보기 단추가 없으면 오른쪽 칸이 비므로 화면을 한 칸으로 쓴다. */
        els.drillScreen.classList.toggle("is-keys", !!useKeyboard);

        if (useKeyboard) {
            question.keyboard.given.forEach(given => keyboard.mark(given.midi, "given", given.text));
            keyboard.centerOn(question.keyboard.given[0].midi);
            els.typedCount.hidden = question.keyboard.answer.length < 2;
            els.typedCount.textContent = "0 / " + question.keyboard.answer.length;
            return;
        }

        els.choices.innerHTML = "";
        session.pool.forEach(item => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "choice";
            button.textContent = item.label;
            button.dataset.itemId = item.id;
            button.addEventListener("click", () => answerByName(item));
            els.choices.append(button);
        });
        els.typedCount.hidden = true;
    }

    /*
     * 화음 진행 답하기 ----------------------------------------------------
     * 칸을 왼쪽부터 채운다. 맞은 칸은 초록으로 굳고 그 화음이 악보에 그려진다.
     * 틀리면 그 칸만 빨갛게 되고 문제는 틀림으로 굳지만, 칸은 다음으로 밀리지
     * 않아 끝까지 풀 수 있다. 건반 채점과 같은 규칙이다.
     */
    function setupSlotInput(question) {
        els.drillScreen.classList.add("is-slots");
        els.choices.hidden = true;
        els.pairWrap.hidden = true;
        els.typedCount.hidden = true;
        els.slotWrap.hidden = false;

        const info = question.slots;
        session.slots = info.symbols.slice(0, info.given);
        els.slotRow.innerHTML = "";
        info.symbols.forEach((symbol, index) => {
            const box = document.createElement("span");
            box.className = "slot" + (index < info.given ? " is-given" : "");
            const number = document.createElement("i");
            number.className = "slot-no";
            number.textContent = index + 1;
            const text = document.createElement("b");
            text.className = "slot-text";
            text.textContent = index < info.given ? symbol : "";
            box.append(number, text);
            els.slotRow.append(box);
        });

        els.numeralRows.innerHTML = "";
        ((session.preset && session.preset.palette) || []).forEach(row => {
            const line = document.createElement("div");
            line.className = "numeral-line";
            row.forEach(symbol => {
                /* null은 짝 맞추기용 빈 자리다 — 아래 줄의 iv가 위 줄 IV 밑에 오게. */
                if (!symbol) {
                    const gap = document.createElement("span");
                    gap.className = "numeral-gap";
                    line.append(gap);
                    return;
                }
                const button = document.createElement("button");
                button.type = "button";
                button.className = "numeral";
                button.textContent = symbol;
                button.addEventListener("click", () => answerBySlot(symbol));
                line.append(button);
            });
            els.numeralRows.append(line);
        });
        drawSlotStaff();
    }

    /*
     * 맞힌 데까지만 악보에 그린다. 나머지 칸은 물음표로 남는다.
     * 악보를 보고 고르는 문제에서는 처음부터 다 그려 준다.
     */
    function drawSlotStaff() {
        const info = session.current.slots;
        if (session.reveal) { drawStaff(info.columns); return; }
        drawStaff(info.columns.map((column, index) => index < session.slots.length ? column : null));
    }

    function slotMiss(index, symbol) {
        const box = els.slotRow.children[index];
        if (!box) return;
        let miss = box.querySelector(".slot-miss");
        if (!miss) {
            miss = document.createElement("u");
            miss.className = "slot-miss";
            box.append(miss);
        }
        miss.textContent = symbol;
        /* 빨강은 한 칸에만 켜 둔다 — 앞서 켠 칸이 남아 있으면 지운다. */
        Array.from(els.slotRow.children).forEach(node => node.classList.remove("is-wrong"));
        box.classList.add("is-wrong");
        window.clearTimeout(session.flashTimer);
        session.flashTimer = window.setTimeout(() => box.classList.remove("is-wrong"), 600);
    }

    function answerBySlot(symbol) {
        if (session.answered) return;
        const info = session.current.slots;
        const index = session.slots.length;
        if (index >= info.symbols.length) return;
        if (symbol !== info.symbols[index]) {
            session.missed = true;
            slotMiss(index, symbol);
            return;
        }
        session.slots.push(symbol);
        const box = els.slotRow.children[index];
        box.classList.remove("is-wrong");
        box.classList.add("is-right");
        box.querySelector(".slot-text").textContent = symbol;
        drawSlotStaff();
        if (window.PianoEngine) {
            const notes = info.columns[index].notes.map(note => note.midi);
            window.PianoEngine.playSequence([notes], .9).catch(() => {});
        }
        if (session.slots.length < info.symbols.length) return;
        settle(!session.missed);
    }

    /* 못 채운 칸을 정답으로 채워 보여 준다. */
    function fillSlots() {
        const info = session.current.slots;
        info.symbols.forEach((symbol, index) => {
            const box = els.slotRow.children[index];
            if (!box || index < session.slots.length) return;
            box.classList.add("is-shown");
            box.querySelector(".slot-text").textContent = symbol;
        });
    }

    /* 성질과 도수를 한 줄씩 고른다. 둘 다 고르면 채점한다. */
    function setupPairInput(question) {
        els.drillScreen.classList.remove("is-keys");
        els.choices.hidden = true;
        els.typedCount.hidden = true;
        els.pairWrap.hidden = false;
        session.picked = { quality: null, number: null };

        /*
         * 답이 한 가지뿐인 줄은 아예 묻지 않는다. 완전음정 차시에서 성질을 물으면
         * 답이 늘 "완전"이라, 누르는 시늉만 하면 되는 빈 문제가 된다.
         * 답이 갈리는 줄은 보기를 다 보여 준다 — 나올 것만 남기면 보기 자체가
         * 답의 범위를 알려 줘서, 3도 차시에서 도수가 새어 나간다.
         */
        const qualities = new Set(session.pool.map(item => item.quality));
        const numbers = new Set(session.pool.map(item => item.number));
        const askQuality = qualities.size > 1;
        const askNumber = numbers.size > 1;

        session.picked.quality = askQuality ? null : session.pool[0].quality;
        session.picked.number = askNumber ? null : session.pool[0].number;
        els.qualityRow.hidden = !askQuality;
        els.numberRow.hidden = !askNumber;
        if (askQuality) fillPairRow(els.qualityRow, QUALITIES, "quality");
        if (askNumber) fillPairRow(els.numberRow, NUMBERS, "number");

        els.askText.textContent = askQuality && askNumber ? session.drill.ask
            : askQuality ? "무슨 성질인가요?" : "몇 도인가요?";
        els.askText.hidden = false;
    }

    function fillPairRow(row, options, kind) {
        row.innerHTML = "";
        options.forEach(option => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "choice choice-" + kind;
            button.textContent = option.label;
            button.dataset.pick = String(option.id);
            button.addEventListener("click", () => pickPair(kind, option.id, button));
            row.append(button);
        });
    }

    function pickPair(kind, value, button) {
        if (session.answered) return;
        const row = kind === "quality" ? els.qualityRow : els.numberRow;
        Array.from(row.children).forEach(node => node.classList.remove("is-picked"));
        button.classList.add("is-picked");
        session.picked[kind] = value;
        if (session.picked.quality === null || session.picked.number === null) return;

        const want = session.current.pair;
        const correct = session.picked.quality === want.quality && session.picked.number === want.number;
        markPairRow(els.qualityRow, String(want.quality), String(session.picked.quality));
        markPairRow(els.numberRow, String(want.number), String(session.picked.number));
        settle(correct);
    }

    function markPairRow(row, wantId, pickedId) {
        Array.from(row.children).forEach(node => {
            node.disabled = true;
            node.classList.remove("is-picked");
            if (node.dataset.pick === wantId) node.classList.add("right");
            else if (node.dataset.pick === pickedId) node.classList.add("wrong");
            else node.classList.add("dim");
        });
    }

    function play() {
        if (session.drill && session.drill.rhythmDrill) {
            const question = session.current;
            if (!question || !window.PianoEngine) return;
            if (question.tap) { startTapRound(); return; }
            window.PianoEngine.playRhythm(question.rhythm.onsets.map(cell => cell / RN.PER_BEAT), BEAT_SECONDS, { countIn: 4 });
            return;
        }
        const playback = session.current && session.current.playback;
        if (!playback || !window.PianoEngine) return;
        els.replayButton.classList.add("playing");
        window.clearTimeout(session.playTimer);
        const span = playback.groups.length * playback.beat * 1000 + 320;
        session.playTimer = window.setTimeout(() => els.replayButton.classList.remove("playing"), span);
        window.PianoEngine.playSequence(playback.groups, playback.beat).catch(() => {
            els.replayButton.classList.remove("playing");
            els.feedback.textContent = "소리를 낼 수 없습니다. 소리 설정을 확인해 주세요.";
            els.feedback.className = "feedback wrong";
        });
    }

    function playExtra(which) {
        const source = session.current && session.current[which];
        if (!source || !window.PianoEngine) return;
        window.PianoEngine.playSequence(source.groups, source.beat).catch(() => {});
    }

    function answerByName(chosen) {
        if (session.answered) return;
        const target = session.current.item;
        const correct = chosen.id === target.id;
        Array.from(els.choices.children).forEach(button => {
            button.disabled = true;
            if (button.dataset.itemId === target.id) button.classList.add("right");
            else if (button.dataset.itemId === chosen.id) button.classList.add("wrong");
            else button.classList.add("dim");
        });
        settle(correct);
    }

    /*
     * 건반으로 답하기. 누를 때마다 바로 본다. 맞으면 초록, 틀리면 그 건반이 곧
     * 빨갛게 되고 그 문제는 틀린 것으로 굳는다(한 번만 센다). 그래도 문제는 끝까지
     * 풀 수 있고, 틀린 음을 눌렀다고 다음 자리로 밀리지 않는다.
     * 화음은 누르는 순서를 따지지 않고, 음정·음계·가락은 차례를 따진다.
     */
    function wrongFlash(midi) {
        keyboard.mark(midi, "wrong", "");
        window.clearTimeout(session.flashTimer);
        session.flashTimer = window.setTimeout(() => {
            const key = keyboard.keys.get(midi);
            if (key && !key.classList.contains("is-right")) {
                key.classList.remove("is-wrong");
                key.querySelector(".key-mark").textContent = "";
            }
        }, 600);
    }

    function answerByKey(midi) {
        if (session.answered) return;
        const board = session.current.keyboard;
        const expected = board.answer;
        window.PianoEngine.playSequence([[midi]], .6).catch(() => {});

        /* 알려 준 음은 짚어 봐도 답으로 세지 않는다. */
        if (!session.typed.length && board.given.some(given => given.midi === midi)) return;

        const ordered = board.ordered !== false;
        /* 화음에는 같은 음이 두 번 들어가지 않으므로 아직 안 누른 음만 남긴다. */
        const wanted = ordered
            ? [expected[session.typed.length]]
            : expected.filter(value => session.typed.indexOf(value) < 0);

        if (wanted.indexOf(midi) < 0) {
            session.missed = true;
            wrongFlash(midi);
            return;
        }

        session.typed.push(midi);
        keyboard.mark(midi, "right", ordered ? String(session.typed.length + 1) : "");
        els.typedCount.textContent = session.typed.length + " / " + expected.length;
        if (session.typed.length < expected.length) return;

        keyboard.setEnabled(false);
        settle(!session.missed);
    }

    function settle(correct) {
        session.answered = true;
        const target = session.current.item;
        session.total += 1;
        if (correct) session.right += 1;

        const tally = session.perItem.get(target.id) || { right: 0, total: 0 };
        tally.total += 1;
        if (correct) tally.right += 1;
        session.perItem.set(target.id, tally);
        recordAnswer(session.drill.id, target.id, correct);
        if (session.preset) recordPreset(session.drill.id, session.preset.id, correct);

        if (session.drill.slotAnswer) fillSlots();
        if (session.drill.rhythmDrill) showRhythmAnswer(correct);
        else {
            const before = session.current.staffBefore;
            drawStaff(session.current.staffAfter.map((column, index) => {
                if (!column) return column;
                const wasHidden = !before[index];
                return wasHidden ? Object.assign({}, column, { mark: correct ? "right" : "wrong" }) : column;
            }));
        }

        if (session.drill.rhythmDrill) {
            els.feedback.textContent = correct ? "맞았습니다" : "틀렸습니다";
        } else {
            els.feedback.textContent = correct
                ? "맞았습니다 · " + answerText(target)
                : "정답은 " + answerText(target) + "입니다";
        }
        els.feedback.className = "feedback " + (correct ? "right" : "wrong");

        updateScore();

        if (correct) session.timer = window.setTimeout(nextQuestion, 1100);
        else {
            els.nextButton.hidden = false;
            els.nextButton.focus({ preventScroll: true });
        }
    }

    function answerText(item) {
        const detail = session.current.detail;
        if (session.drill.answerIsLabel === false) return detail;
        return item.label + (detail ? " (" + detail + ")" : "");
    }


    function skipQuestion() {
        if (session.answered) { nextQuestion(); return; }
        session.answered = true;
        if (!session.drill.rhythmDrill) drawStaff(session.current.staffAfter);
        els.feedback.textContent = session.drill.rhythmDrill
            ? "정답은 위 악보와 같습니다"
            : "정답은 " + answerText(session.current.item) + "입니다";
        els.feedback.className = "feedback wrong";
        if (session.drill.rhythmDrill) {
            window.clearTimeout(session.tapTimer);
            if (session.current.grid) markGrid(session.current.grid.answer, []);
            if (session.current.bars) {
                Array.from(els.barsWrap.children).forEach((button, position) => {
                    button.disabled = true;
                    button.classList.add(position === session.current.bars.answer ? "right" : "dim");
                });
            }
            if (session.current.tap) els.tapPad.disabled = true;
            showRhythmAnswer(false);
        } else if (session.drill.slotAnswer) {
            fillSlots();
        } else if (session.drill.pairAnswer) {
            markPairRow(els.qualityRow, String(session.current.pair.quality), "");
            markPairRow(els.numberRow, String(session.current.pair.number), "");
        } else if (session.input === "keyboard" && session.current.keyboard) {
            keyboard.setEnabled(false);
            session.current.keyboard.answer.forEach((midi, index) => keyboard.mark(midi, "right", String(index + 2)));
        } else {
            Array.from(els.choices.children).forEach(button => {
                button.disabled = true;
                if (button.dataset.itemId === session.current.item.id) button.classList.add("right");
                else button.classList.add("dim");
            });
        }
        els.nextButton.hidden = false;
    }

    function updateScore() {
        const rate = session.total ? Math.round((session.right / session.total) * 100) : 0;
        els.scoreText.textContent = session.right + " / " + session.total + " · " + rate + "%"
            + (session.limit ? " (" + session.limit + "문제)" : "");
    }

    function finishDrill() {
        window.clearTimeout(session.timer);
        if (!session.total) {
            backToHub();
            return;
        }
        if (session.fromLesson) {
            const previous = lessonMark(session.fromLesson.courseId, session.fromLesson.lessonId);
            const better = !previous || !previous.total
                || (session.right / session.total) > (previous.right / previous.total);
            if (better) setLessonMark(session.fromLesson.courseId, session.fromLesson.lessonId,
                { right: session.right, total: session.total });
        }
        els.resultScore.textContent = session.drill.name + " " + session.right + " / " + session.total
            + " · " + Math.round((session.right / session.total) * 100) + "%";

        const rows = session.pool
            .map(item => ({ item: item, tally: session.perItem.get(item.id) }))
            .filter(row => row.tally && row.tally.total)
            .sort((a, b) => (a.tally.right / a.tally.total) - (b.tally.right / b.tally.total));

        els.resultTable.innerHTML = "";
        rows.forEach(row => {
            const rate = Math.round((row.tally.right / row.tally.total) * 100);
            const line = document.createElement("div");
            line.className = "result-row " + (rate < 60 ? "weak" : rate === 100 ? "strong" : "");
            line.innerHTML = '<b></b><span class="count"></span><span class="pct"></span>';
            line.querySelector("b").textContent = row.item.label;
            line.querySelector(".count").textContent = row.tally.right + " / " + row.tally.total;
            line.querySelector(".pct").textContent = rate + "%";
            els.resultTable.append(line);
        });
        els.toMenuButton.textContent = session.fromLesson ? "차시 목록" : "다른 훈련";
        showScreen("result");
    }

    function backToHub() {
        if (session.fromLesson && course) {
            renderLessonList();
            showScreen("course");
            return;
        }
        if (session.fromLesson) { openCourse(session.fromLesson.courseId); return; }
        renderMenu();
        showScreen("menu");
    }

    function goBack() {
        if (session.screen === "drill") { finishDrill(); return true; }
        if (session.screen === "result") { backToHub(); return true; }
        if (session.screen === "lesson") { renderLessonList(); showScreen("course"); return true; }
        if (session.screen === "wheel" || session.screen === "course") {
            session.exercise = null;
            renderMenu();
            showScreen("menu");
            return true;
        }
        return false;
    }

    function bindKeys() {
        document.addEventListener("keydown", event => {
            if (session.screen !== "drill") return;
            if (event.key === " ") { event.preventDefault(); play(); return; }
            if (event.key === "Enter" && !els.nextButton.hidden) { event.preventDefault(); nextQuestion(); return; }
            if (session.input === "keyboard") return;
            const index = "123456789".indexOf(event.key);
            if (index >= 0 && els.choices.children[index]) {
                event.preventDefault();
                els.choices.children[index].click();
            }
        });
    }

    function init() {
        ["menuScreen", "courseScreen", "lessonScreen", "drillScreen", "resultScreen",
            "courseList", "courseTitle", "lessonList", "lessonTitle", "lessonBody", "lessonExamples",
            "lessonNext", "lessonKeys", "lessonKeysLabel", "wheelKeys", "toolList", "wheelScreen", "wheelBoard", "wheelChords",
            "wheelPrev", "wheelNext", "wheelFlat", "wheelCadence",
            "helpRow", "arpButton",
            "melodicButton",
            "presetBack", "courseBack", "wheelBack", "lessonBack",
            "askText", "staff", "scoreText", "stopButton",
            "replayButton", "skipButton", "choices", "pairWrap", "qualityRow", "numberRow",
            "slotWrap", "slotRow", "numeralRows", "keyButton",
            "keyboardWrap", "pianoKeys", "typedCount", "rhythmWrap", "rhythmBoard",
            "gridWrap", "beatGrid", "gridSubmit", "barsWrap", "tapWrap", "tapPad", "tapCount",
            "feedback", "nextButton", "resultScore", "resultTable", "againButton",
            "toMenuButton"].forEach(id => { els[id] = byId(id); });

        loadSaved();
        keyRange = { low: KEY_LOW, high: KEY_HIGH };
        keyboard = window.Keyboard.build(els.pianoKeys, KEY_LOW, KEY_HIGH, drillKeyPress);
        lessonKeyboard = window.Keyboard.build(els.lessonKeys, KEY_LOW, LESSON_KEY_HIGH, midi => {
            if (lessonKeyPress) lessonKeyPress(midi);
            else soundOnly(midi);
        });
        wheelKeyboard = window.Keyboard.build(els.wheelKeys, KEY_LOW, KEY_HIGH, soundOnly);

        renderMenu();
        showScreen("menu");

        if (els.presetBack) els.presetBack.addEventListener("click", goBack);
        if (els.courseBack) els.courseBack.addEventListener("click", goBack);
        if (els.wheelBack) els.wheelBack.addEventListener("click", goBack);
        if (els.lessonBack) els.lessonBack.addEventListener("click", goBack);

        els.replayButton.addEventListener("click", play);
        els.skipButton.addEventListener("click", skipQuestion);
        els.arpButton.addEventListener("click", () => {
            playExtra(session.current && session.current.chordsPlay ? "chordsPlay" : "arpeggio");
        });
        els.melodicButton.addEventListener("click", () => playExtra("melodic"));
        els.keyButton.addEventListener("click", () => playExtra("homePlay"));
        els.gridSubmit.addEventListener("click", submitGrid);
        els.tapPad.addEventListener("pointerdown", event => { event.preventDefault(); onTap(); });
        els.nextButton.addEventListener("click", nextQuestion);
        els.stopButton.addEventListener("click", finishDrill);
        els.againButton.addEventListener("click", () => {
            session.right = 0;
            session.total = 0;
            session.perItem = new Map();
            showScreen("drill");
            nextQuestion();
        });
        els.toMenuButton.addEventListener("click", backToHub);
        els.lessonNext.addEventListener("click", nextLesson);
        els.wheelPrev.addEventListener("click", () => wheel.step(-1));
        els.wheelNext.addEventListener("click", () => wheel.step(1));
        els.wheelFlat.addEventListener("click", () => wheel.toggleFlat());
        els.wheelCadence.addEventListener("click", playCadence);

        window.addEventListener("sitebackrequest", event => {
            if (goBack()) event.preventDefault();
        });

        const pageBack = document.querySelector(".page-back");
        if (pageBack) {
            pageBack.addEventListener("click", event => {
                if (goBack()) event.preventDefault();
            });
        }

        bindKeys();

        if (window.PianoEngine) {
            window.setTimeout(() => {
                window.PianoEngine.preload().catch(() => { /* 첫 재생 때 합성음으로 대신한다. */ });
            }, 900);
        }
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
