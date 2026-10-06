(function () {
    "use strict";

    const BINDINGS = [
        ["A", "KeyA"], ["S", "KeyS"], ["D", "KeyD"], ["F", "KeyF"], ["G", "KeyG"],
        ["H", "KeyH"], ["J", "KeyJ"], ["K", "KeyK"], ["L", "KeyL"], ["Q", "KeyQ"],
        ["W", "KeyW"], ["E", "KeyE"], ["R", "KeyR"], ["T", "KeyT"], ["Y", "KeyY"],
        ["U", "KeyU"], ["I", "KeyI"], ["O", "KeyO"], ["P", "KeyP"], ["Z", "KeyZ"], ["X", "KeyX"]
    ];
    const COLORS = {
        "궁편": "#8ef0c6", "채편": "#ffb36f", "양편": "#efb5ff",
        "북면": "#8ed8f0", "가장자리": "#e5ff75", "약음·막음": "#c0a8ff",
        "북통·복합": "#ff9d66", "열린소리": "#f3c86a", "막음": "#9dd8c4",
        "여린소리": "#c9b5ff"
    };
    function pads(items) {
        return Object.freeze(items.map(function (item, index) {
            const binding = BINDINGS[index];
            return Object.freeze({
                id: item[0], name: item[1], family: item[2], sourceName: item[3],
                key: binding[0], code: binding[1], color: COLORS[item[2]] || "#8ef0c6"
            });
        }));
    }

    // Terminology: 국립국어원, 한국 음악 점자 규정 해설, 제21–22항 (pp.39–41),
    // and 국립국악원 장구 주법 (약궁). Unverified compound variants keep descriptions.
    // Keep the source articulation IDs/names for the recorded sample mapping.
    const PAD_SETS = Object.freeze({
        "janggu-samul": pads([
            ["low-open", "궁편치기(궁)", "궁편", "Low Open"],
            ["low-open-var", "궁편치기(궁) · 변형", "궁편", "Low Open Var"],
            ["low-edge", "궁편치기(궁) · 가장자리", "궁편", "Low Edge"],
            ["low-soft", "약궁(구)", "궁편", "Low Soft"],
            ["low-ghost", "약궁(구) · 아주 여리게", "궁편", "Low Ghost"],
            ["low-bounce", "궁편 굴림", "궁편", "Low Bounce"],
            ["high-rim", "채편치기(덕) · 테두리", "채편", "High Rim"],
            ["high-rim-var", "채편치기(덕) · 테두리 변형", "채편", "High Rim Var"],
            ["high-center", "채편치기(덕) · 중앙", "채편", "High Center"],
            ["high-mallet", "채편 궁채치기(쿵)", "채편", "High Mallet"],
            ["high-flam", "겹채(기덕)", "채편", "High Flam"],
            ["high-bounce", "채굴림(더러러러)", "채편", "High Bounce"],
            ["compound", "합장단(덩)", "양편", "Compound"]
        ]),
        "janggu-sanjo": pads([
            ["low-open", "궁편치기(궁)", "궁편", "Low Open"],
            ["low-open-var", "궁편치기(궁) · 변형", "궁편", "Low Open Var"],
            ["low-muted", "궁편 치고 막기(국)", "궁편", "Low Muted"],
            ["low-soft", "약궁(구)", "궁편", "Low Soft"],
            ["low-ghost", "약궁(구) · 아주 여리게", "궁편", "Low Ghost"],
            ["low-flam", "겹궁(구궁)", "궁편", "Low Flam"],
            ["high-rim", "채편치기(덕) · 테두리", "채편", "High Rim"],
            ["high-center", "채편치기(덕) · 중앙", "채편", "High Center"],
            ["high-edge", "채편치기(덕) · 가장자리", "채편", "High Edge"],
            ["high-edge-mute", "채편 가장자리 막음", "채편", "High EdgeMute"],
            ["high-flam-rim", "겹채(기덕) · 테두리", "채편", "High FlamRim"],
            ["high-flam-edge", "겹채(기덕) · 가장자리", "채편", "High FlamEdge"],
            ["low-high-open", "합장단(덩) · 열어치기", "양편", "Low-High Open"],
            ["low-high-ornament", "양편 꾸밈음", "양편", "Low-High Orna"],
            ["low-high-bounce", "양편 굴림", "양편", "Low-High Bounce"]
        ]),
        "buk-samul": pads([
            ["main", "정타(둥)", "북면", "Main"],
            ["main-var-1", "정타(둥) · 변형 1", "북면", "Main Var 1"],
            ["main-var-2", "정타(둥) · 변형 2", "북면", "Main Var 2"],
            ["main-var-3", "정타(둥) · 변형 3", "북면", "Main Var 3"],
            ["ghost", "약타(더) · 아주 여리게", "여린소리", "Ghost"],
            ["edge-1", "가장자리 1", "가장자리", "Edge 1"],
            ["edge-1-var", "가장자리 1 변형", "가장자리", "Edge 1 Var"],
            ["edge-2", "가장자리 2", "가장자리", "Edge 2"],
            ["edge-2-var", "가장자리 2 변형", "가장자리", "Edge 2 Var"],
            ["edge-3", "가장자리 3", "가장자리", "Edge 3"],
            ["edge-3-var", "가장자리 3 변형", "가장자리", "Edge 3 Var"],
            ["accent", "강세 타격", "북면", "Accent"],
            ["muted", "막아치기", "약음·막음", "Muted"],
            ["muted-var", "막아치기 변형", "약음·막음", "Muted Var"],
            ["soft", "약타(더)", "여린소리", "Soft"],
            ["soft-var", "약타(더) · 변형", "여린소리", "Soft Var"],
            ["damp", "울림 막기", "약음·막음", "Damp"],
            ["side", "북통치기(딱)", "북통·복합", "Side"],
            ["side-var", "북통치기(딱) · 변형", "북통·복합", "Side Var"]
        ]),
        "buk-sori": pads([
            ["main-lh", "북면 왼손", "북면", "Main LH"],
            ["main-rh", "북면 오른손", "북면", "Main RH"],
            ["main-lh-var", "북면 왼손 변형", "북면", "Main LH (Var)"],
            ["main-rh-var", "북면 오른손 변형", "북면", "Main RH (Var)"],
            ["ghost", "북면 아주 여린 타격", "여린소리", "Ghost"],
            ["edge-1-lh", "가장자리 1 · 왼손", "가장자리", "Edge 1 LH"],
            ["edge-1-rh", "가장자리 1 · 오른손", "가장자리", "Edge 1 RH"],
            ["edge-2-lh", "가장자리 2 · 왼손", "가장자리", "Edge 2 LH"],
            ["edge-2-rh", "가장자리 2 · 오른손", "가장자리", "Edge 2 RH"],
            ["edge-3-lh", "가장자리 3 · 왼손", "가장자리", "Edge 3 LH"],
            ["edge-3-rh", "가장자리 3 · 오른손", "가장자리", "Edge 3 RH"],
            ["accent", "강세 타격", "북면", "Accent"],
            ["muted-lh", "막아치기 · 왼손", "약음·막음", "Muted LH"],
            ["muted-rh", "막아치기 · 오른손", "약음·막음", "Muted RH"],
            ["soft-lh", "여린 타격 · 왼손", "여린소리", "Soft LH"],
            ["soft-rh", "여린 타격 · 오른손", "여린소리", "Soft RH"],
            ["damp", "울림 막기", "약음·막음", "Damp"],
            ["rim", "테두리 타격", "가장자리", "Rim"],
            ["rim-var", "테두리 타격 변형", "가장자리", "Rim Var"],
            ["compound-1", "복합 타격 1", "북통·복합", "Compound 1"],
            ["compound-2", "복합 타격 2", "북통·복합", "Compound 2"]
        ]),
        sogo: pads([
            ["main", "북면 기본 타격", "북면", "Main"],
            ["main-var-1", "북면 타격 변형 1", "북면", "Main Var 1"],
            ["main-var-2", "북면 타격 변형 2", "북면", "Main Var 2"],
            ["main-var-3", "북면 타격 변형 3", "북면", "Main Var 3"],
            ["ghost", "아주 여린 타격", "여린소리", "Ghost"],
            ["edge-1", "가장자리 1", "가장자리", "Edge 1"],
            ["edge-1-var", "가장자리 1 변형", "가장자리", "Edge 1 Var"],
            ["edge-2", "가장자리 2", "가장자리", "Edge 2"],
            ["edge-2-var", "가장자리 2 변형", "가장자리", "Edge 2 Var"],
            ["edge-3", "가장자리 3", "가장자리", "Edge 3"],
            ["edge-3-var", "가장자리 3 변형", "가장자리", "Edge 3 Var"],
            ["accent", "강세 타격", "북면", "Accent"],
            ["muted", "막아치기", "약음·막음", "Muted"],
            ["muted-var", "막아치기 변형", "약음·막음", "Muted Var"],
            ["soft", "여린 타격", "여린소리", "Soft"],
            ["soft-var", "여린 타격 변형", "여린소리", "Soft Var"],
            ["damp", "울림 막기", "약음·막음", "Damp"]
        ]),
        kkwaenggwari: pads([
            ["open", "열어치기", "열린소리", "Open"],
            ["open-damp-slow", "열고 막기 · 느리게", "막음", "Open-Damp (Slow)"],
            ["damp", "울림 막기", "막음", "Damp"],
            ["open-damp-fast", "열고 막기 · 빠르게", "막음", "Open-Damp (Fast)"],
            ["ghost", "아주 여린 타격", "여린소리", "Ghost"],
            ["muted", "막아치기", "막음", "Muted"],
            ["edge-1", "가장자리 1", "가장자리", "Edge 1"],
            ["edge-2", "가장자리 2", "가장자리", "Edge 2"],
            ["bounce", "굴림", "열린소리", "Bounce"]
        ]),
        jing: pads([
            ["open", "열어치기", "열린소리", "Open"],
            ["open-damp-slow", "열고 막기 · 느리게", "막음", "Open-Damp (Slow)"],
            ["mute", "즉시 막기", "막음", "Mute"],
            ["open-damp-fast", "열고 막기 · 빠르게", "막음", "Open-Damp (Fast)"],
            ["ghost", "아주 여린 타격", "여린소리", "Ghost"],
            ["muted", "막아치기", "막음", "Muted"]
        ])
    });

    const SAMPLE_SETS = Object.freeze({
        "janggu-samul": Object.freeze({ id: "korean-janggu-samul", root: "assets/audio/korean-percussion/janggu-samul/", gainDb: -6 }),
        "janggu-sanjo": Object.freeze({ id: "korean-janggu-sanjo", root: "assets/audio/korean-percussion/janggu-sanjo/", gainDb: -2 }),
        "buk-samul": Object.freeze({ id: "korean-buk-samul", root: "assets/audio/korean-percussion/buk-samul/", gainDb: -6 }),
        "buk-sori": Object.freeze({ id: "korean-buk-sori", root: "assets/audio/korean-percussion/buk-sori/", gainDb: -6 }),
        sogo: Object.freeze({ id: "korean-sogo", root: "assets/audio/korean-percussion/sogo/", gainDb: -5 }),
        kkwaenggwari: Object.freeze({ id: "korean-kkwaenggwari", root: "assets/audio/korean-percussion/kkwaenggwari/", gainDb: 0 }),
        jing: Object.freeze({ id: "korean-jing", root: "assets/audio/korean-percussion/jing/", gainDb: 1 })
    });

    window.KOREAN_PERCUSSION_DATA = Object.freeze({ pads: PAD_SETS, samples: SAMPLE_SETS });
})();
