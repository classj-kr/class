(function () {
    "use strict";

    const LEFT_KEYS = [["A", "KeyA"], ["S", "KeyS"], ["D", "KeyD"], ["F", "KeyF"], ["Q", "KeyQ"], ["W", "KeyW"]];
    const RIGHT_KEYS = [["J", "KeyJ"], ["K", "KeyK"], ["L", "KeyL"], [";", "Semicolon"], ["U", "KeyU"], ["I", "KeyI"]];
    const BOTH_KEYS = [["B", "KeyB"], ["N", "KeyN"], ["M", "KeyM"]];
    function isJanggu(id) { return id === "janggu-samul" || id === "janggu-sanjo"; }

    function bindJanggu(pads) {
        const count = { "궁편": 0, "채편": 0, "양편": 0 };
        return pads.map(function (pad) {
            const keys = pad.family === "궁편" ? LEFT_KEYS : pad.family === "채편" ? RIGHT_KEYS : BOTH_KEYS;
            const binding = keys[count[pad.family]++];
            return Object.assign({}, pad, { key: binding[0], code: binding[1] });
        });
    }

    function groups(modelId, pads, kit) {
        if (isJanggu(modelId)) return [
            { id: "left", title: "왼쪽 · 궁편", hint: modelId === "janggu-sanjo" ? "왼손으로 치기" : "궁채로 치기", pads: pads.filter(p => p.family === "궁편") },
            { id: "right", title: "오른쪽 · 채편", hint: modelId === "janggu-samul" ? "열채로 치기 · 궁채 주법은 별도 표시" : "열채로 치기", pads: pads.filter(p => p.family === "채편") },
            { id: "both", title: "양편 함께", hint: "궁편과 채편의 합장단", pads: pads.filter(p => p.family === "양편") }
        ];
        if (kit) {
            const pick = ids => ids.map(id => pads.find(p => p.id === id)).filter(Boolean);
            return [
                { id: "cymbals", title: "심벌", pads: pick(["hat", "crash", "ride"]) },
                { id: "toms", title: "탐", pads: pick(["hightom", "midtom", "lowtom"]) },
                { id: "core", title: "킥 · 스네어", pads: pick(["kick", "snare"]) },
                { id: "techniques", title: "세부 주법", pads: pick(["pedalhat", "openhat", "ridebell", "ghost", "rimshot", "sidestick", "rimclick"]) }
            ];
        }
        return [{ id: "all", title: "", pads: pads }];
    }

    // Code-native vectors keep the same shapes without emoji or installed fonts.
    const HAND = '<path d="M40 25V13q0-4 3-4t3 4v6-12q0-4 3-4t3 4v12-10q0-4 3-4t3 4v12-6q0-4 3-4t3 4v14q0 12-12 12h-2q-5 0-8-5l-7-10q-2-4 1-5t5 4"/>';
    const MALLET = '<path d="M43 36 57 12"/><circle cx="59" cy="8" r="5" fill="currentColor"/>';
    const STICK = '<path d="m42 36 21-31 2 1-20 32Z" fill="currentColor"/>';
    const HEAD = '<ellipse cx="20" cy="24" rx="16" ry="14"/><ellipse cx="20" cy="24" rx="12" ry="10" opacity=".45"/>';
    function icon(modelId, pad) {
        const id = pad.id;
        let drawing, tool = "";
        if (isJanggu(modelId)) {
            const hand = modelId === "janggu-sanjo";
            const both = pad.family === "양편";
            tool = both ? (hand ? "손 + 열채" : "궁채 + 열채")
                : pad.family === "궁편" ? (hand ? "손" : "궁채")
                : id === "high-mallet" ? "궁채" : "열채";
            drawing = both
                ? '<ellipse cx="10" cy="24" rx="7" ry="16"/><ellipse cx="40" cy="24" rx="7" ry="16"/><path d="M10 8q15 22 30 0M10 40q15-22 30 0"/><circle cx="10" cy="24" r="3" fill="currentColor"/><circle cx="40" cy="24" r="3" fill="currentColor"/>'
                : HEAD + (tool === "손" ? HAND : tool === "궁채" ? MALLET : STICK);
            if (!both) drawing += '<circle cx="' + (/rim|edge/.test(id) ? '8' : '20') + '" cy="24" r="3" fill="currentColor"/>';
            if (/mute/.test(id)) drawing += '<path d="m9 39 22-29" stroke-width="3"/>';
            if (/bounce|flam|ornament/.test(id)) drawing += '<path d="M6 44q4-5 8 0t8 0t8 0"/>';
        } else if (/hat|crash|ride/.test(id)) {
            tool = id === "pedalhat" ? "발 페달" : id === "ridebell" ? "스틱 · 벨" : "스틱";
            drawing = '<ellipse cx="32" cy="21" rx="26" ry="7"/><path d="M24 20q8-12 16 0M32 13v29m-10 2 10-6 10 6"/>';
            if (/hat/.test(id)) drawing += '<path d="M7 27q25 12 50 0"/>';
            if (id === "openhat") drawing += '<path d="M7 34q25 12 50 0"/>';
            if (id === "pedalhat") drawing += '<path d="m39 40 13-4 6 5-13 4Z"/>';
            if (id === "ridebell") drawing += '<circle cx="32" cy="16" r="4" fill="currentColor"/>';
        } else if (id === "kick") {
            tool = "발 페달";
            drawing = '<circle cx="30" cy="23" r="19"/><circle cx="30" cy="23" r="15" opacity=".5"/><path d="M15 36 9 44m36-8 6 8M30 23v16m-5 6 5-8 7 7Z"/><circle cx="30" cy="23" r="3" fill="currentColor"/>';
        } else if (/kkwaenggwari|jing/.test(modelId)) {
            drawing = '<circle cx="23" cy="25" r="18"/><circle cx="23" cy="25" r="13" opacity=".5"/><path d="M17 7V3h12v4"/>' + MALLET;
        } else {
            if (/tom|snare|rim|ghost|sidestick/.test(id)) tool = "스틱";
            drawing = '<ellipse cx="27" cy="15" rx="21" ry="9"/><path d="M6 15v18c0 12 42 12 42 0V15M12 23v12m10-10v13m10-13v13m10-15v12"/><path d="m35 17 25-13"/>';
            if (/snare|rim|ghost|sidestick/.test(id)) drawing += '<path d="m14 31 24 8m-24-3 24-9"/>';
        }
        return {
            tool: tool,
            svg: '<svg class="pad-icon" viewBox="0 0 72 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + drawing + '</svg>'
        };
    }
    window.PAD_PRESENTATION = Object.freeze({ isJanggu: isJanggu, bindJanggu: bindJanggu, groups: groups, icon: icon });
})();
