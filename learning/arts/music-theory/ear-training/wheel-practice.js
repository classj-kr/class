(function () {
    "use strict";

    const TOPICS = ["fifths", "signature", "relative", "neighbors", "diatonic"];
    const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
    const SEMIS = [0, 2, 4, 5, 7, 9, 11];
    const STEPS = [0, 2, 4, 5, 7, 9, 11];
    const ROMANS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
    const SUFFIXES = ["", "m", "m", "", "", "m", "dim"];

    function shuffle(list, random) {
        const result = list.slice();
        for (let at = result.length - 1; at > 0; at -= 1) {
            const other = Math.floor(random() * (at + 1));
            [result[at], result[other]] = [result[other], result[at]];
        }
        return result;
    }

    // F♯·G♭는 조표와 음 이름까지 각각 보존한다.
    function keys() {
        return window.Wheel.KEYS.flatMap(key => {
            if (!key.alt) return [key];
            return [key, {
                major: key.alt, minor: key.altMinor, count: key.altCount,
                sharp: key.altSharp, tonic: key.tonic, letter: key.altLetter, acc: key.altAcc
            }];
        });
    }

    function noteAt(key, degree) {
        const letter = (key.letter + degree) % 7;
        const pitch = (key.tonic + STEPS[degree]) % 12;
        const accidental = ((pitch - SEMIS[letter] + 18) % 12) - 6;
        return LETTERS[letter] + (accidental === 1 ? "♯" : accidental === -1 ? "♭" : "");
    }

    function signature(key) {
        return key.count ? (key.sharp ? "♯ " : "♭ ") + key.count + "개" : "조표 없음";
    }

    function minorName(name) {
        return name.slice(0, -1) + " 단조";
    }

    function questionBank() {
        const all = keys();
        const majors = all.map(key => key.major + " 장조");
        const minors = all.map(key => minorName(key.minor));
        const signatures = all.map(signature);
        const result = [];
        function add(type, key, variant, prompt, answer, options, explanation) {
            result.push({ id: [type, key.major, variant].join(":"), type, home: key.major,
                prompt, answer, options, explanation });
        }
        all.forEach(key => {
            const major = key.major + " 장조";
            const minor = minorName(key.minor);
            const sig = signature(key);
            add("signature", key, "read", major + "의 조표는?", sig, signatures,
                major + "의 조표는 " + sig + "입니다.");
            add("signature", key, "name", key.count ? sig + "를 쓰는 장조는?" : "조표가 없는 장조는?", major, majors,
                sig + "를 쓰는 장조는 " + major + "입니다.");
            add("relative", key, "minor", major + "의 나란한 단조는?", minor, minors,
                major + "의 여섯째 음은 " + key.minor.slice(0, -1) + "입니다. " + major + "와 " + minor + "는 같은 조표를 씁니다.");
            add("relative", key, "major", minor + "의 나란한 장조는?", major, majors,
                minor + "의 으뜸음에서 단3도 위의 음은 " + key.major + "입니다. " + minor + "와 " + major + "는 같은 조표를 씁니다.");

            // 경계에서 C♯·C♭ 등 원판에 없는 조를 묻지 않도록 범위를 정한다.
            if (key.count <= 4) {
                [[4, "up-fifth", "위", "dominant", "딸림조", "완전5도"],
                    [3, "down-fifth", "아래", "subdominant", "버금딸림조", "완전4도"]].forEach(([degree, variant, direction, roleId, role, interval]) => {
                    const tonic = noteAt(key, degree);
                    const answer = tonic + " 장조";
                    add("fifths", key, variant,
                        key.major + "에서 완전5도 " + direction + "인 음을 으뜸음으로 하는 장조는?", answer, majors,
                        key.major + "에서 완전5도 " + direction + "인 음은 " + tonic + "입니다. " + answer + "는 " + major + "의 " + role + "입니다.");
                    add("neighbors", key, roleId, major + "의 " + role + "는?", answer, majors,
                        role + "는 으뜸음에서 " + interval + " 위의 음을 으뜸음으로 하는 조입니다. " + key.major + "에서 " + interval + " 위는 " + tonic + "이므로 " + answer + "입니다.");
                });
            }
            const chords = ROMANS.map((roman, degree) => noteAt(key, degree) + SUFFIXES[degree]);
            ROMANS.forEach((roman, degree) => {
                const quality = degree === 6 ? "감3화음" : SUFFIXES[degree] ? "단3화음" : "장3화음";
                add("diatonic", key, roman, major + "의 " + roman + " 화음은?", chords[degree], chords,
                    major + "의 " + (degree + 1) + "번째 음 " + noteAt(key, degree) + " 위에 쌓은 " + quality + "이므로 " + chords[degree] + "입니다.");
            });
        });
        return result;
    }

    function buildRound(topic, random) {
        random = random || Math.random;
        if (topic !== "mixed" && !TOPICS.includes(topic)) throw new Error("알 수 없는 5도권 문제: " + topic);
        const bank = questionBank();
        const selected = topic === "mixed"
            ? shuffle(TOPICS.flatMap(type => shuffle(bank.filter(q => q.type === type), random).slice(0, 2)), random)
            : shuffle(bank.filter(q => q.type === topic), random).slice(0, 10);
        return selected.map(question => Object.assign({}, question, {
            choices: shuffle([question.answer].concat(
                shuffle([...new Set(question.options)].filter(option => option !== question.answer), random).slice(0, 3)
            ), random)
        }));
    }

    function create(host, options) {
        const settings = options || {};
        const get = id => host.querySelector("#" + id);
        let round = [], at = 0, right = 0, answered = false, finished = false;
        let topic = "mixed", title = "종합 문제", hintWheel = null;
        const hints = new Set(), wrong = [];

        function showQuestion() {
            const question = round[at];
            answered = false;
            get("wheelHint").open = false;
            get("wheelPracticeProgress").textContent = (at + 1) + " / " + round.length;
            get("wheelQuestion").textContent = question.prompt;
            get("wheelFeedback").textContent = "";
            get("wheelFeedback").className = "wheel-feedback";
            get("wheelQuestionNext").hidden = true;
            get("wheelQuestionNext").textContent = at === round.length - 1 ? "결과 보기" : "다음 문제";
            get("wheelChoices").replaceChildren();
            question.choices.forEach(choice => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "choice";
                button.textContent = choice;
                button.addEventListener("click", () => {
                    if (answered || finished) return;
                    answered = true;
                    const correct = choice === question.answer;
                    if (correct) right += 1;
                    else wrong.push({ question, choice });
                    get("wheelChoices").querySelectorAll("button").forEach(option => {
                        option.disabled = true;
                        if (option.textContent === question.answer) option.classList.add("right");
                    });
                    if (!correct) button.classList.add("wrong");
                    get("wheelFeedback").className = "wheel-feedback " + (correct ? "right" : "wrong");
                    get("wheelFeedback").textContent = (correct ? "맞았습니다. " : "정답은 " + question.answer + "입니다. ") + question.explanation;
                    get("wheelQuestionNext").hidden = false;
                    if (settings.onAnswer) settings.onAnswer(question.type, correct);
                    get("wheelQuestionNext").focus({ preventScroll: true });
                });
                get("wheelChoices").append(button);
            });
            get("wheelQuestion").focus({ preventScroll: true });
        }

        function start(nextTopic, nextTitle) {
            topic = nextTopic;
            title = nextTitle;
            round = buildRound(topic);
            at = 0;
            right = 0;
            finished = false;
            hints.clear();
            wrong.length = 0;
            get("wheelPracticeTitle").textContent = title;
            get("wheelQuestionPanel").hidden = false;
            get("wheelPracticeResult").hidden = true;
            showQuestion();
        }

        function finish() {
            if (finished) return;
            finished = true;
            const total = at + (answered ? 1 : 0);
            get("wheelQuestionPanel").hidden = true;
            get("wheelPracticeResult").hidden = false;
            get("wheelHint").open = false;
            get("wheelPracticeScore").textContent = total ? total + "문제 중 " + right + "문제 정답" : "푼 문제가 없습니다";
            get("wheelHintCount").textContent = hints.size ? "원판 힌트 사용: " + hints.size + "문제" : "";
            get("wheelReview").replaceChildren();
            wrong.forEach(entry => {
                const row = document.createElement("li");
                const prompt = document.createElement("strong");
                prompt.textContent = entry.question.prompt;
                const answer = document.createElement("span");
                answer.textContent = "내 답: " + entry.choice + " · 정답: " + entry.question.answer;
                row.append(prompt, answer);
                get("wheelReview").append(row);
            });
            get("wheelPracticeAgain").focus({ preventScroll: true });
        }

        get("wheelQuestionNext").addEventListener("click", () => {
            if (!answered || finished) return;
            if (at === round.length - 1) finish();
            else { at += 1; showQuestion(); }
        });
        get("wheelPracticeStop").addEventListener("click", finish);
        get("wheelPracticeAgain").addEventListener("click", () => start(topic, title));
        get("wheelPracticeBack").addEventListener("click", () => settings.onBack());
        get("wheelHint").addEventListener("toggle", () => {
            if (!get("wheelHint").open || finished) return;
            hints.add(at);
            if (!hintWheel) hintWheel = window.Wheel.create(get("wheelHintBoard"), settings.wheelOptions);
            hintWheel.setKey(round[at].home);
        });
        return { start, finish, isFinished: () => finished };
    }

    window.WheelPractice = { TOPICS, questionBank, buildRound, create };
})();
