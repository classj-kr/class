(function () {
    "use strict";

    const LEFT_KEYS = [["A", "KeyA"], ["S", "KeyS"], ["D", "KeyD"], ["Q", "KeyQ"], ["W", "KeyW"], ["E", "KeyE"]];
    const RIGHT_KEYS = [["J", "KeyJ"], ["K", "KeyK"], ["L", "KeyL"], [";", "Semicolon"], ["U", "KeyU"], ["I", "KeyI"]];
    const BOTH_KEYS = [["Space", "Space"], ["B", "KeyB"], ["N", "KeyN"]];
    function isJanggu(id) { return id === "janggu-samul" || id === "janggu-sanjo"; }

    function bindJanggu(pads) {
        const count = { "궁편": 0, "채편": 0, "양편": 0 };
        return pads.map(function (pad) {
            const keys = pad.family === "궁편" ? LEFT_KEYS : pad.family === "채편" ? RIGHT_KEYS : BOTH_KEYS;
            const binding = keys[count[pad.family]++] || ["", ""];
            return Object.assign({}, pad, { key: binding[0], code: binding[1] });
        });
    }

    function groups(modelId, pads, kit) {
        if (isJanggu(modelId)) return [
            { id: "both", title: "양편 함께 · 합장단 (덩)", hint: "궁편과 채편 동시 타격 · 양손 또는 Space / B / F", pads: pads.filter(p => p.family === "양편") },
            { id: "left", title: "왼쪽 · 궁편 (쿵)", hint: modelId === "janggu-sanjo" ? "왼손 손치기 · 쿵 / 구궁" : "왼손 궁채 · 쿵 / 구궁", pads: pads.filter(p => p.family === "궁편") },
            { id: "right", title: "오른쪽 · 채편 (덕)", hint: "오른손 열채 · 덕 / 기덕 / 더러러러", pads: pads.filter(p => p.family === "채편") }
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
        if (modelId === "orchestral-percussion") {
            tool = "소리 듣기";
            if (id === "orchestral-snare") drawing = '<ellipse cx="28" cy="15" rx="19" ry="7"/><path d="M9 15v17c0 10 38 10 38 0V15M12 33q16 9 32 0m-33 9 33-12M13 8 7 3m44 0-6 5"/>';
            else if (id === "orchestral-bass-drum") drawing = '<circle cx="31" cy="23" r="18"/><circle cx="31" cy="23" r="14"/><path d="m18 37-5 8m36-8 5 8M49 7 61 32"/><circle cx="31" cy="23" r="3" fill="currentColor"/>';
            else if (id === "orchestral-suspended-cymbal") drawing = '<ellipse cx="30" cy="20" rx="24" ry="7"/><path d="M30 13V5m0 22v15m-13 2h26M10 9l12 10"/><circle cx="30" cy="19" r="3"/>';
            else if (id === "orchestral-tamtam") drawing = '<circle cx="30" cy="24" r="18"/><circle cx="30" cy="24" r="12"/><path d="M12 9 8 4h44l-4 5M30 4v2m23 37 11-29"/><circle cx="30" cy="24" r="3"/>';
            else drawing = '<path d="M31 7 8 40h45L31 7m2-3v5m-8 31h6M56 10 65 39"/>';
        } else if (modelId === "ritual-signals") {
            tool = "소리 듣기";
            if (id === "bak") drawing = '<path d="M9 7 20 5 24 40 13 42ZM24 6 35 5 36 40 25 41ZM39 7 51 10 47 41 37 40ZM53 11 63 15 55 43 48 41Z"/>';
            else if (id === "chuk") drawing = '<path d="M11 14 36 7 60 14 36 21ZM11 14v26l25 5V21m24-7v26l-24 5M15 8 33 2m-4 2 4 30"/>';
            else drawing = '<path d="M5 33 13 21 22 25 29 11 39 18 46 8 55 15 64 9v25H5Z M8 34q25 11 53 0M14 43h43"/><circle cx="50" cy="21" r="2" fill="currentColor"/>';
        } else if (modelId === "daechwita-station") {
            tool = "소리 듣기";
            if (id === "nabal") drawing = '<path d="M7 24h33l20-13v26L40 24M10 19v10m30-11v12"/>';
            else if (id === "nagak") drawing = '<path d="M8 33q8-22 29-20 17 2 23 18-12-10-20-3-9 12-23 8Z M8 33l-3 5m54-7 6 4"/>';
            else if (id === "yonggo") drawing = '<ellipse cx="30" cy="24" rx="19" ry="17"/><ellipse cx="30" cy="24" rx="14" ry="12"/><path d="M50 7 63 37m-8-31-14 32M19 42l-4 4m30-4 4 4"/>';
            else if (id === "jabara") drawing = '<ellipse cx="23" cy="25" rx="16" ry="10"/><ellipse cx="48" cy="22" rx="16" ry="10"/><circle cx="23" cy="25" r="3"/><circle cx="48" cy="22" r="3"/>';
            else drawing = '<circle cx="29" cy="24" r="19"/><circle cx="29" cy="24" r="14"/><circle cx="29" cy="24" r="4"/><path d="M49 41 62 8"/>';
        } else if (isJanggu(modelId)) {
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
        } else if (/^buk-/.test(modelId) || modelId === "sogo") {
            const hand = modelId === "buk-sori" && /-lh/.test(id);
            tool = hand ? "왼손" : modelId === "buk-sori" && !/-rh/.test(id) ? "북" : "북채";
            drawing = '<circle cx="23" cy="23" r="18"/><circle cx="23" cy="23" r="14" opacity=".5"/>';
            if (modelId === "sogo") drawing += '<path d="M20 41v5h6v-5"/>';
            drawing += hand ? HAND : '<path d="m42 37 17-30 4 2-17 30Z" fill="currentColor"/>';
            if (/muted|damp/.test(id)) drawing += '<path d="m11 35 24-24" stroke-width="3"/>';
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
