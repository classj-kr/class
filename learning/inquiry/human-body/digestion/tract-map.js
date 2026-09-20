/**
 * 전신 소화관 (소화계 1번 장면)
 *
 * 예전 1번은 어두운 남색 SF 사진이었다. 몸이 오른쪽으로 치우쳐 왼쪽 절반이
 * 비었고, 기관이 전부 같은 연어색이라 이름표 여덟 개가 어디를 가리키는지
 * 알 수 없었다. 이자는 아예 가려져서 설명글에 「그림에서는 가려져 있습니다」
 * 라고 적어 두어야 했다.
 *
 * 글자 없는 평면 도식(../assets/images/digestive-tract.svg)을 얹는다.
 * 간·위·쓸개·이자·소장·대장이 저마다 다른 색이고, 이자도 보인다.
 *
 * 시험에 나오는 대목:
 *   소화 효소가 없는 곳 — 식도, 대장 (그리고 간은 효소가 아니라 쓸개즙)
 *   쓸개즙은 간이 만들고 쓸개가 모아 둔다
 *   이자는 세 영양소를 모두 맡는 유일한 곳
 *   쓸개즙과 이자액은 소장 앞쪽(십이지장)으로 들어간다
 *   흡수한 것은 간문맥을 지나 먼저 간으로 간다
 */

(function () {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var SVG_URL = '../assets/images/digestive-tract.svg';
    var KEY = 'torso';

    function isPaused() {
        return typeof SimEngine !== 'undefined' && SimEngine.isPaused ? SimEngine.isPaused() : false;
    }

    // 이름표와 설명. 예전에는 app.js 의 hotspots.torso 에 있었는데,
    // 이 장면을 통째로 맡게 되었으므로 여기로 옮겼다. 한 군데에만 둔다.
    var PARTS = [
        {
            id: 'esophagus', text: '식도', ax: 120, ay: 150,
            enzyme: '소화 효소 없음', ph: '중성', product: '음식물을 위로 보냄',
            desc: '소화 효소가 <strong>나오지 않습니다</strong>. 근육이 <strong>꿈틀 운동</strong>으로 음식물을 위까지 밀어 보냅니다. 그래서 누워서 먹어도 내려갑니다.'
        },
        {
            id: 'stomach', text: '위', ax: 600, ay: 264,
            enzyme: '위액 (펩신 + 염산)', ph: 'pH 2.0 (강한 산성)', product: '단백질 ➔ 펩톤',
            desc: '염산이 강한 산성을 만들고 그 속에서 <strong>펩신이 단백질을 잘게 자릅니다</strong>. 염산은 세균도 죽입니다.'
        },
        {
            id: 'liver', text: '간', ax: 108, ay: 262,
            enzyme: '쓸개즙을 만듦 (효소는 없음)', ph: '약염기성', product: '지방을 잘게 흩음',
            desc: '<strong>소화 효소는 만들지 않습니다.</strong> 쓸개즙을 만들어 지방 덩어리를 잘게 흩어 놓아 라이페이스가 일하기 쉽게 합니다. 흡수한 영양소도 간문맥을 지나 <strong>먼저 이곳으로</strong> 옵니다.'
        },
        {
            id: 'gallbladder', text: '쓸개', ax: 108, ay: 352,
            enzyme: '쓸개즙 저장', ph: '약염기성', product: '십이지장으로 내보냄',
            desc: '간이 만든 쓸개즙을 <strong>모아 두었다가</strong> 음식이 오면 소장 앞쪽(십이지장)으로 내보냅니다. <strong>스스로 만들지는 않습니다.</strong>'
        },
        {
            id: 'pancreas', text: '이자', ax: 600, ay: 376,
            enzyme: '이자액 (아밀레이스 · 트립신 · 라이페이스)', ph: 'pH 8.0 (약염기성)', product: '세 영양소를 모두 분해',
            desc: '<strong>세 가지 효소를 모두 내는 유일한 곳</strong>입니다. 녹말·단백질·지방을 한꺼번에 맡습니다. 이자액은 쓸개즙과 함께 <strong>소장 앞쪽(십이지장)</strong>으로 들어가 위에서 온 산성 음식물을 중화합니다.'
        },
        {
            id: 'duodenum', text: '십이지장', ax: 108, ay: 440,
            enzyme: '쓸개즙 + 이자액이 들어오는 곳', ph: 'pH 8.0', product: '산성 음식물을 중화',
            desc: '위에서 내려온 산성 음식물이 <strong>쓸개즙과 이자액을 만나 중화되는</strong> 소장의 첫 토막입니다. 두 관이 여기로 들어옵니다.'
        },
        {
            id: 'smallIntestine', text: '소장', ax: 600, ay: 540,
            enzyme: '장액 + 이자액', ph: 'pH 8.0', product: '마지막 분해와 흡수',
            desc: '영양소가 <strong>마지막으로 분해되고 융털로 흡수되는</strong> 곳입니다. 안쪽에 주름과 융털이 있어 닿는 넓이가 넓습니다.'
        },
        {
            id: 'largeIntestine', text: '대장', ax: 108, ay: 610,
            enzyme: '소화 효소 없음', ph: '중성', product: '물을 흡수',
            desc: '<strong>소화 효소가 없습니다.</strong> 남은 찌꺼기에서 물을 빨아들여 똥을 만듭니다.'
        },
        {
            id: 'anus', text: '항문', ax: 560, ay: 790,
            enzyme: '없음', ph: '—', product: '몸 밖으로 내보냄',
            desc: '대장에서 만들어진 찌꺼기를 몸 밖으로 내보냅니다. 소화되지 않은 것이 지나온 길의 끝입니다.'
        }
    ];

    // 음식이 지나는 길. 그림 눈금(0~700, 0~900) 그대로.
    //
    // 대장은 소장을 ㄷ자로 둘러싼 틀이다. 전에는 그 한가운데를 곧장 아래로
    // 지나갔는데, 그러면 대장을 통째로 건너뛴다. 실제로는
    //   소장 끝 ➔ 맹장(왼쪽 아래) ➔ 상행결장(위로) ➔ 횡행결장(가로질러)
    //   ➔ 하행결장(아래로) ➔ 곧창자
    // 로 돌아 나간다. 앞에서 본 그림이라 화면 왼쪽이 몸의 오른쪽이고,
    // 맹장·상행결장이 몸의 오른쪽에 있는 것과 맞는다.
    // 점마다 organ 을 적어 둔다. 시간을 기관별로 나눠 주고(ORGAN_TIME),
    // 지나가는 동안 음식 구슬의 생김새를 바꾸는 데(BOLUS_LOOK) 쓴다.
    var ROUTE = [
        { x: 350, y: 80, organ: 'mouth' },        // 입
        { x: 350, y: 240, organ: 'esophagus' },   // 식도
        { x: 398, y: 296, organ: 'stomach' },     // 위
        // 위와 십이지장이 맞닿는 자리는 좁다. 눈금을 2씩 훑어 두 조각이
        // 나란히 닿는 줄(y 336~338)을 찾아 그리로 지난다. 조금만 비껴도
        // 음식이 배 속 빈 곳을 가로지른다.
        { x: 352, y: 330, organ: 'stomach' },     // 위의 아래쪽
        { x: 344, y: 336, organ: 'stomach' },     // 유문 (위의 출구)
        { x: 338, y: 338, organ: 'duodenum' },    // 십이지장 들머리
        { x: 320, y: 356, organ: 'duodenum' },    // 십이지장 위
        { x: 316, y: 396, organ: 'duodenum' },    // 십이지장 가운데
        { x: 334, y: 424, organ: 'duodenum' },    // 십이지장 끝
        { 소장: true },      // ← 여기에 소장 길을 그림에서 읽어 끼워 넣는다
        // 아래 대장 자리는 새 그림에서 벽을 한 줄씩 훑어 한가운데를 집은 값이다
        // (x=230 세로줄은 y 408~643, x=300 가로줄은 y 397~419 …).
        { x: 226, y: 630, organ: 'largeIntestine' },  // 맹장 (왼쪽 아래)
        { x: 228, y: 560, organ: 'largeIntestine' },  // 상행결장
        { x: 228, y: 470, organ: 'largeIntestine' },  // 상행결장 위쪽
        { x: 234, y: 424, organ: 'largeIntestine' },  // 결장 왼쪽 위 모서리
        { x: 300, y: 408, organ: 'largeIntestine' },  // 횡행결장 왼쪽
        { x: 400, y: 408, organ: 'largeIntestine' },  // 횡행결장 오른쪽
        { x: 462, y: 420, organ: 'largeIntestine' },  // 결장 오른쪽 위 모서리
        { x: 480, y: 470, organ: 'largeIntestine' },  // 하행결장
        { x: 480, y: 560, organ: 'largeIntestine' },  // 하행결장 가운데
        { x: 480, y: 640, organ: 'largeIntestine' },  // 하행결장 아래쪽
        { x: 455, y: 672, organ: 'largeIntestine' },  // 구불결장
        { x: 411, y: 690, organ: 'largeIntestine' },  // 구불결장 아래
        // 구불결장과 곧창자가 겹치는 줄은 y 700~706 뿐이다. 그리로 지난다.
        { x: 380, y: 698, organ: 'rectum' },      // 구불결장 끝
        { x: 366, y: 703, organ: 'rectum' },      // 곧창자로 넘어가는 자리
        { x: 355, y: 708, organ: 'rectum' },      // 곧창자 들머리
        { x: 351, y: 720, organ: 'rectum' },      // 곧창자
        { x: 350, y: 776, organ: 'anus' }         // 항문
    ];

    // 기관마다 쓰는 시간(초). 소장이 가장 오래 걸린다 — 실제로 거기서
    // 가장 많은 일(마지막 분해와 흡수)이 일어난다.
    //
    // 예전에는 진행률이 초당 0.22 씩 올라 전체 길을 4.5초에 주파했다.
    // 점 개수가 기관마다 다른데(소장만 스물 몇 개) 그 개수만큼 시간도
    // 달라져서, 소장은 그나마 오래 걸리고 나머지는 눈 깜짝할 새 지나갔다.
    // "빨리 움직여서 보기 어렵다"는 말이 맞았다.
    var ORGAN_TIME = {
        esophagus: 1.0,
        stomach: 2.4,
        duodenum: 1.6,
        smallIntestine: 6.0,
        largeIntestine: 3.6,
        rectum: 1.2,
        anus: 0.6
    };

    var wrap, layer, svg, labelBox, leaderGroup, bolus;
    var swallowing = false, started = false, elapsed = 0, totalTime = 1;
    var lastT = 0;
    // 그림을 못 읽으면 표시 자리만 빼고 쓴다 (음식이 소장을 건너뛰지만 멈추지는 않는다)
    var route = ROUTE.filter(function (p) { return !p.소장; });
    var legs = [];          // { p1, p2, organ, t0, t1 } — 다리 하나마다 시작·끝 시각
    var organRange = {};    // organ → [처음 닿은 시각, 마지막으로 있던 시각]
    var bolusKF = [];       // 음식 구슬의 생김새가 바뀌는 매듭점들 [{t, fill, r}, …]
    var curLeg = 0;
    var lastGlowOrgan = null;

    function lerp(a, b, f) { return a + (b - a) * f; }

    function lerpHex(a, b, f) {
        var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
        var ra = (pa >> 16) & 255, ga = (pa >> 8) & 255, ba = pa & 255;
        var rb = (pb >> 16) & 255, gb = (pb >> 8) & 255, bb = pb & 255;
        var r = Math.round(lerp(ra, rb, f)), g = Math.round(lerp(ga, gb, f)), b2 = Math.round(lerp(ba, bb, f));
        return '#' + [r, g, b2].map(function (v) { return Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'); }).join('');
    }

    /**
     * 다리(점과 점 사이)마다 몇 초를 쓸지 나눠 정한다.
     * 같은 기관을 지나는 다리끼리 그 기관의 몫(ORGAN_TIME)을 똑같이 나눠 갖는다.
     *
     * 그리고 음식 구슬의 생김새가 바뀌는 매듭점(bolusKF)도 여기서 함께 짠다 —
     * 기관이 끝나는 시각마다 하나씩. 위를 지나면 으깨져 커지고(미즙),
     * 소장을 지나며 영양소가 빠져나가 작아지고 옅어지고, 대장·곧창자에서
     * 물이 빠져 짙고 단단해진다(대변). 지금은 색과 크기만 늘 그대로였다.
     */
    function buildTiming() {
        legs = [];
        for (var i = 0; i < route.length - 1; i++) {
            var organ = route[i + 1].organ || route[i].organ || 'mouth';
            legs.push({ p1: route[i], p2: route[i + 1], organ: organ });
        }
        var counts = {};
        legs.forEach(function (l) { counts[l.organ] = (counts[l.organ] || 0) + 1; });

        var t = 0;
        organRange = {};
        legs.forEach(function (l) {
            var total = ORGAN_TIME[l.organ] || 0.6;
            var per = total / counts[l.organ];
            l.t0 = t;
            l.t1 = t + per;
            if (!organRange[l.organ]) organRange[l.organ] = [l.t0, l.t1];
            else organRange[l.organ][1] = l.t1;
            t = l.t1;
        });
        totalTime = t || 1;
        curLeg = 0;

        bolusKF = [{ t: 0, fill: '#fde68a', r: 13 }];
        var steps = [
            ['esophagus', '#fde68a', 13],
            ['stomach', '#e3b568', 16],
            ['duodenum', '#ddc9a0', 13],
            ['smallIntestine', '#b7a488', 6],
            ['rectum', '#5b4632', 9],
            ['largeIntestine', '#5b4632', 9]   // 곧창자 자리가 없을 때를 대비한 마지막 보루
        ];
        steps.forEach(function (s) {
            var r = organRange[s[0]];
            if (r) bolusKF.push({ t: r[1], fill: s[1], r: s[2] });
        });
    }

    /** elapsed 시각에 음식 구슬이 어떤 빛깔·크기여야 하는지, 매듭점 사이를 이어 구한다 */
    function bolusLook(t) {
        if (!bolusKF.length) return { fill: '#f59e0b', r: 13 };
        for (var i = 0; i < bolusKF.length - 1; i++) {
            if (t <= bolusKF[i + 1].t) {
                var a = bolusKF[i], b = bolusKF[i + 1];
                var span = b.t - a.t;
                var f = span > 0 ? (t - a.t) / span : 1;
                return { fill: lerpHex(a.fill, b.fill, f), r: lerp(a.r, b.r, f) };
            }
        }
        return bolusKF[bolusKF.length - 1];
    }

    /**
     * 흡수 알갱이 — 음식이 "분해되어 흡수되는" 것이 실제로 보이게 한다.
     *
     * 색과 크기가 바뀌는 것만으로는 부족했다. "장에 흡수되는 것조차 안 보인다"
     * 는 말이 맞았다 — 구슬 하나가 색만 바뀌며 지나가는 걸로는 "흡수"라는
     * 사건이 눈에 들어오지 않는다. 그래서 알갱이가 실제로 튀어 나가는 것을
     * 보여 준다.
     *
     *   소장(작은창자)을 지나는 동안 — 노란 알갱이(영양소)가 튀어나가 간
     *   쪽으로 날아가며 사라진다. 흡수한 것이 간문맥을 지나 먼저 간으로
     *   간다는 것과 맞춘 것이다.
     *   대장을 지나는 동안 — 옅푸른 알갱이(물)가 벽 쪽으로 스미듯 사라진다.
     */
    var LIVER_TARGET = { x: 257, y: 293 };
    var particlePool = [];
    var spawnTimer = 0;

    function initParticles(rootSvg) {
        particlePool = [];
        for (var i = 0; i < 14; i++) {
            var c = document.createElementNS(SVG_NS, 'circle');
            c.setAttribute('r', 0);
            c.setAttribute('opacity', 0);
            rootSvg.appendChild(c);
            particlePool.push({ el: c, active: false, age: 0, life: 1, sx: 0, sy: 0, tx: 0, ty: 0, r0: 4 });
        }
    }

    function spawnParticle(sx, sy, tx, ty, color, r0, life) {
        for (var i = 0; i < particlePool.length; i++) {
            var p = particlePool[i];
            if (p.active) continue;
            p.active = true; p.age = 0; p.life = life;
            p.sx = sx; p.sy = sy; p.tx = tx; p.ty = ty; p.r0 = r0;
            p.el.setAttribute('fill', color);
            return;
        }
    }

    function updateParticles(dt) {
        particlePool.forEach(function (p) {
            if (!p.active) return;
            p.age += dt;
            if (p.age >= p.life) { p.active = false; p.el.setAttribute('opacity', 0); return; }
            var f = p.age / p.life;
            p.el.setAttribute('cx', lerp(p.sx, p.tx, f).toFixed(1));
            p.el.setAttribute('cy', lerp(p.sy, p.ty, f).toFixed(1));
            p.el.setAttribute('r', (p.r0 * (1 - f * 0.6)).toFixed(1));
            // 나타났다가 사라진다 — 갑자기 튀어나와 갑자기 없어지면 눈에 거슬린다
            p.el.setAttribute('opacity', Math.sin(Math.PI * f).toFixed(2));
        });
    }

    /** 지금 지나는 기관에 맞춰 알갱이를 터뜨린다 */
    function maybeSpawn(dt, organ, bx, by) {
        spawnTimer -= dt;
        if (spawnTimer > 0) return;
        if (organ === 'duodenum' || organ === 'smallIntestine') {
            spawnParticle(bx, by,
                LIVER_TARGET.x + (Math.random() - 0.5) * 26, LIVER_TARGET.y + (Math.random() - 0.5) * 26,
                '#fbbf24', 4, 0.85);
            spawnTimer = 0.22 + Math.random() * 0.16;
        } else if (organ === 'largeIntestine' || organ === 'rectum') {
            spawnParticle(bx, by, bx + (Math.random() - 0.5) * 44, by + (Math.random() - 0.5) * 44,
                '#7dd3fc', 3, 0.6);
            spawnTimer = 0.32 + Math.random() * 0.22;
        } else {
            spawnTimer = 0.2;
        }
    }

    /**
     * 대장 밑에 깔려 안 보이는 조각을 위로 올린다.
     *
     * 대장을 소장보다 굵게 그리자(23 → 46) 횡행결장이 십이지장 위를 지나가면서
     * 십이지장의 41%를 덮어 버렸다. 이름표는 가리키는데 가리키는 것이 안 보인다.
     * 십이지장은 쓸개즙과 이자액이 들어오는 곳이라 시험에 나온다.
     *
     * 실제 몸에서는 횡행결장이 십이지장 앞에 있는 것이 맞지만, 이것은 배우려고
     * 보는 그림이다. 교과서 그림도 십이지장을 앞에 그려 보여 준다.
     */
    function liftHiddenParts() {
        if (!svg) return;
        var colon = svg.querySelector('#largeIntestine');
        if (!colon || !colon.parentNode) return;
        ['pancreas', 'duodenum', 'ducts', 'gallbladder'].forEach(function (id) {
            var e = svg.querySelector('#' + id);
            if (e && e.parentNode === colon.parentNode) colon.parentNode.appendChild(e);
        });
    }

    /**
     * 소장은 굵게 그은 선 하나다. 그러니 그 선 자체가 관의 한가운데다.
     * 좌표를 손으로 적는 대신 선을 따라 점을 떠서 길에 끼워 넣는다.
     * 그러면 그림이 바뀌어도 음식은 늘 관 속으로 지나간다.
     */
    function traceSmallIntestine() {
        route = ROUTE.filter(function (p) { return !p.소장; });
        if (!svg) return;
        var g = svg.querySelector('#smallIntestine');
        if (!g) return;

        // 여러 겹으로 그려진 가운데 가장 굵은 선이 관의 몸통이다
        var best = null, bestW = -1;
        [].slice.call(g.querySelectorAll('path')).forEach(function (p) {
            var w = parseFloat(p.getAttribute('stroke-width') || 0);
            if (w > bestW) { bestW = w; best = p; }
        });
        if (!best || bestW < 6) return;

        var len = 0;
        try { len = best.getTotalLength(); } catch (e) { return; }
        if (!len) return;

        var pts = [];
        // 소장은 촘촘히 감겨 있다. 점을 성기게 뜨면 점과 점을 잇는 곧은 줄이
        // 굽이를 가로질러 관 밖으로 나간다 (열여섯 점으로 떴더니 133 자리가 밖이었다).
        // 열두 눈금마다 한 점씩 뜬다.
        var STEPS = Math.max(24, Math.round(len / 12));
        for (var i = 0; i <= STEPS; i++) {
            var q = best.getPointAtLength(len * i / STEPS);
            pts.push({ x: Math.round(q.x * 10) / 10, y: Math.round(q.y * 10) / 10, organ: 'smallIntestine' });
        }

        // 표시해 둔 자리에 끼운다
        var at = -1;
        for (var k = 0; k < ROUTE.length; k++) if (ROUTE[k].소장) { at = k; break; }
        if (at < 0) return;
        route = ROUTE.slice(0, at).concat(pts, ROUTE.slice(at + 1));

        // 잣대(_relevance.js)가 이 길을 훑어 관 밖으로 나간 자리를 셀 수 있게 내놓는다
        window.__tractRoute = route;
        buildTiming();
    }

    function init() {
        wrap = document.querySelector('.cinematic-viewport');
        if (!wrap) return;
        buildLayer();
        bindSwallow();
        requestAnimationFrame(loop);
    }

    function bindSwallow() {
        var b = document.getElementById('swallowBtn');
        if (!b) return;
        b.addEventListener('click', function () {
            swallowing = true;
            started = true;
            elapsed = 0;
            curLeg = 0;
            lastGlowOrgan = null;
        });
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('simulationCanvas');
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !otherLayerShowing()) canvas.style.visibility = 'visible';
        if (on) placeLabels();
    }

    function otherLayerShowing() {
        return !!document.querySelector(
            '.enzyme-layer:not([hidden]), .stomach-layer:not([hidden]),' +
            ' .villus-layer:not([hidden]), .tract-layer:not([hidden])');
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'tract-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                // 같은 쪽에 다른 도식이 얹힐 때 그라데이션 이름이 겹치지 않게 한다
                if (typeof SimEngine !== 'undefined' && SimEngine.isolateSvgIds) {
                    markup = SimEngine.isolateSvgIds(markup, 'tractfig');
                }
                layer.innerHTML = '<div class="tract-stage">' + markup + '<div class="tract-labels"></div></div>';
                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.tract-labels');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                leaderGroup = document.createElementNS(SVG_NS, 'g');
                svg.appendChild(leaderGroup);

                bolus = document.createElementNS(SVG_NS, 'circle');
                bolus.setAttribute('r', 13);
                bolus.setAttribute('fill', '#f59e0b');
                bolus.setAttribute('stroke', '#78350f');
                bolus.setAttribute('stroke-width', 2);
                bolus.setAttribute('opacity', 0);
                svg.appendChild(bolus);

                initParticles(svg);

                PARTS.forEach(function (item) {
                    var e = svg.querySelector('#' + item.id);
                    if (!e) return;
                    e.style.cursor = 'pointer';
                    e.addEventListener('click', function () { show(item); });
                });

                liftHiddenParts();
                traceSmallIntestine();
                placeLabels();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="tract-error">소화관 그림을 불러오지 못했습니다.</div>';
            });
    }

    function show(item) {
        // 누른 조각에 노란 테를 두른다
        if (typeof SimEngine !== 'undefined' && SimEngine.litPart) {
            SimEngine.litPart(svg, PARTS.map(function (x) { return x.id; }), item.id);
        }
        var set = function (id, v, html) {
            var e = document.getElementById(id);
            if (!e) return;
            if (html) e.innerHTML = v; else e.textContent = v;
        };
        set('organTitle', item.text);
        set('organEnzyme', item.enzyme);
        set('organPH', item.ph);
        set('organProduct', item.product);
        set('organDesc', item.desc, true);
        var card = document.getElementById('organFocusCard');
        if (card) card.style.display = 'block';
        if (labelBox) {
            labelBox.querySelectorAll('.tract-tag').forEach(function (t) {
                t.classList.toggle('on', t.dataset.for === item.id);
            });
        }
        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
    }

    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, PARTS, {
            leaders: leaderGroup,
            className: 'tract-tag',
            select: function (item) { show(item); }
        });
    }

    function loop(t) {
        var dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
        lastT = t;

        if (wrap && layer) {
            var act = wrap.querySelector('.scene-btn.active');
            var mine = !!(act && act.dataset.scene === KEY);
            if (layer.hidden === mine) setVisible(mine);
        }

        if (layer && !layer.hidden && bolus && legs.length) {
            var live = !isPaused();
            if (swallowing && live) {
                elapsed += dt;
                if (elapsed >= totalTime) { elapsed = totalTime; swallowing = false; }
            }
            // 이미 튀어나간 알갱이는 구슬이 멎거나 다 지나간 뒤에도 마저 날아간다
            updateParticles(live ? dt : 0);

            if (started && elapsed < totalTime) {
                while (curLeg < legs.length - 1 && elapsed > legs[curLeg].t1) curLeg++;
                var leg = legs[curLeg];
                var span = leg.t1 - leg.t0;
                var f = span > 0 ? Math.max(0, Math.min(1, (elapsed - leg.t0) / span)) : 1;
                var bx = leg.p1.x + (leg.p2.x - leg.p1.x) * f;
                var by = leg.p1.y + (leg.p2.y - leg.p1.y) * f;
                bolus.setAttribute('cx', bx.toFixed(1));
                bolus.setAttribute('cy', by.toFixed(1));
                bolus.setAttribute('opacity', 1);

                var look = bolusLook(elapsed);
                bolus.setAttribute('fill', look.fill);
                bolus.setAttribute('r', look.r.toFixed(1));

                if (swallowing && live) maybeSpawn(dt, leg.organ, bx, by);

                // 지금 지나는 기관을 은은하게 밝힌다. 입에는 이름표가 없고,
                // 곧창자는 이름표가 따로 없어 대장 이름표가 대신 밝는다.
                var glowOrgan = leg.organ === 'rectum' ? 'largeIntestine' : (leg.organ === 'mouth' ? null : leg.organ);
                if (glowOrgan && glowOrgan !== lastGlowOrgan && typeof SimEngine !== 'undefined' && SimEngine.litPart) {
                    SimEngine.litPart(svg, PARTS.map(function (x) { return x.id; }), glowOrgan);
                    lastGlowOrgan = glowOrgan;
                }
            } else {
                bolus.setAttribute('opacity', 0);
            }
        }
        requestAnimationFrame(loop);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
