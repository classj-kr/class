(function () {
    "use strict";

    const BLACK_OFFSETS = { 1: true, 3: true, 6: true, 8: true, 10: true };
    const layouts = new WeakMap();

    function build(container, lowMidi, highMidi, onPress) {
        const previous = layouts.get(container);
        if (previous) { previous.observer.disconnect(); previous.navigation.remove(); }
        container.innerHTML = "";
        container.classList.add("keyboard");

        const whites = [];
        const blacks = [];
        for (let midi = lowMidi; midi <= highMidi; midi += 1) {
            const semitone = ((midi % 12) + 12) % 12;
            if (BLACK_OFFSETS[semitone]) blacks.push(midi);
            else whites.push(midi);
        }

        const whiteRow = document.createElement("div");
        whiteRow.className = "keyboard-whites";
        // Both colors share the same full-width keybed, even when it scrolls.
        whiteRow.style.minWidth = (whites.length * 42) + "px";
        const keys = new Map();

        whites.forEach(midi => {
            const key = document.createElement("button");
            key.type = "button";
            key.className = "key key-white";
            key.dataset.midi = String(midi);
            key.dataset.sfx = "none";
            key.setAttribute("aria-label", noteLabel(midi));
            key.append(markLayer());
            whiteRow.append(key);
            keys.set(midi, key);
        });
        container.append(whiteRow);

        const whiteCount = whites.length;
        blacks.forEach(midi => {
            const whitesBefore = whites.filter(white => white < midi).length;
            const key = document.createElement("button");
            key.type = "button";
            key.className = "key key-black";
            key.dataset.midi = String(midi);
            key.dataset.sfx = "none";
            key.setAttribute("aria-label", noteLabel(midi));
            key.style.left = (whitesBefore / whiteCount * 100) + "%";
            key.style.width = (100 / whiteCount * 0.6) + "%";
            key.style.transform = "translateX(-50%)";
            key.append(markLayer());
            whiteRow.append(key);
            keys.set(midi, key);
        });

        // Play on contact, not the later click. Assign handlers so rebuilding
        // the keyboard cannot accumulate listeners or double-count an answer.
        const held = new Map();
        const release = event => {
            const key = held.get(event.pointerId);
            held.delete(event.pointerId);
            if (key && !Array.from(held.values()).includes(key)) key.classList.remove("is-pressed");
        };
        container.onpointerdown = event => {
            if (event.button !== 0) return;
            const key = event.target.closest(".key");
            if (!key || key.disabled || !container.contains(key)) return;
            event.preventDefault();
            container.setPointerCapture(event.pointerId);
            held.set(event.pointerId, key);
            key.classList.add("is-pressed");
            onPress(Number(key.dataset.midi));
        };
        container.onpointerup = release;
        container.onpointercancel = release;
        container.onlostpointercapture = release;
        container.onclick = event => {
            // Keyboard / assistive activation has no preceding pointerdown.
            if (event.detail !== 0) return;
            const key = event.target.closest(".key");
            if (!key || key.disabled) return;
            onPress(Number(key.dataset.midi));
        };

        // Touches on keys play immediately. Separate controls let small screens
        // move through the range without accidentally submitting an answer.
        const navigation = document.createElement("div");
        navigation.className = "keyboard-navigation";
        const lower = document.createElement("button"), higher = document.createElement("button");
        lower.textContent = "← 낮은 음";
        higher.textContent = "높은 음 →";
        [lower, higher].forEach(button => { button.type = "button"; button.dataset.sfx = "none"; });
        lower.onclick = () => { container.scrollLeft -= container.clientWidth * .7; };
        higher.onclick = () => { container.scrollLeft += container.clientWidth * .7; };
        navigation.append(lower, higher);
        container.after(navigation);
        const updateNavigation = () => {
            navigation.hidden = container.scrollWidth <= container.clientWidth + 1;
            lower.disabled = container.scrollLeft <= 1;
            higher.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
        };
        container.onscroll = updateNavigation;
        const observer = new ResizeObserver(updateNavigation);
        observer.observe(container);
        layouts.set(container, { observer: observer, navigation: navigation });
        updateNavigation();

        return {
            element: container,
            keys: keys,
            clearMarks: function () {
                keys.forEach(key => {
                    key.classList.remove("is-given", "is-right", "is-wrong", "is-typed", "is-lit");
                    key.querySelector(".key-mark").textContent = "";
                });
            },
            mark: function (midi, kind, text) {
                const key = keys.get(midi);
                if (!key) return;
                key.classList.add("is-" + kind);
                key.querySelector(".key-mark").textContent = text || "";
            },
            lit: function (midi, on) {
                const key = keys.get(midi);
                if (key) key.classList.toggle("is-lit", on !== false);
            },
            clearLit: function () {
                keys.forEach(key => key.classList.remove("is-lit"));
            },
            centerOn: function (midi) {
                const key = keys.get(midi);
                if (!key) return;
                const target = key.offsetLeft + key.offsetWidth / 2 - container.clientWidth / 2;
                container.scrollLeft = Math.max(0, target);
            },
            setEnabled: function (enabled) {
                keys.forEach(key => { key.disabled = !enabled; });
            }
        };
    }

    function markLayer() {
        const mark = document.createElement("span");
        mark.className = "key-mark";
        return mark;
    }

    function noteLabel(midi) {
        // Accessible names identify absolute pitches, never key-dependent solfege.
        const names = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
        const semitone = ((midi % 12) + 12) % 12;
        return names[semitone] + (Math.floor(midi / 12) - 1);
    }

    window.Keyboard = { build: build };
})();
