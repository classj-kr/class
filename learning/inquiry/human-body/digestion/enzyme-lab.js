/**
 * 영양소 검출 실험 & 효소 활성 화면
 *
 * 옆 사이드바의 [가상 실험실] 조작(온도·pH·효소·시약·가열)을 그대로 읽어서
 * 시험관 네 개의 색을 실제로 바꾸고, 효소가 어느 pH·온도에서 잘 일하는지 곡선으로 보여 준다.
 *
 * app.js 는 건드리지 않는다. 이 파일과 styles.css, index.html 의 단추 한 줄만 쓴다.
 */

(function () {
    'use strict';

    var MIN_FONT = 13.5;   // 도식 글씨의 최소 크기

    // 시험관 넷. 시험에 나오는 네 가지 영양소를 한 줄에 세워 둔다.
    var TUBES = [
        { key: 'starch', name: '녹말물', base: '#f1f5f9' },
        { key: 'glucose', name: '포도당물', base: '#f1f5f9' },
        { key: 'protein', name: '단백질물', base: '#f8fafc' },
        { key: 'fat', name: '식용유', base: '#fef9c3' }
    ];

    // 시약별로 어떤 영양소를 찾아내고 무슨 색이 되는지
    var REAGENTS = {
        iodine: {
            name: '아이오딘-아이오딘화 칼륨 용액',
            target: 'starch',
            hitColor: '#1e3a8a', hitName: '청람색',
            missColor: '#b45309', missName: '갈색',
            needHeat: false
        },
        benedict: {
            name: '베네딕트 용액',
            target: 'glucose',
            hitColor: '#dc2626', hitName: '황적색',
            missColor: '#2563eb', missName: '푸른색',
            needHeat: true,
            coldColor: '#2563eb', coldName: '가열 안 함'
        },
        biuret: {
            name: '뷰렛 용액 (5% 수산화 나트륨 + 1% 황산 구리)',
            target: 'protein',
            hitColor: '#7e22ce', hitName: '보라색',
            missColor: '#93c5fd', missName: '연푸른색',
            needHeat: false
        },
        sudan: {
            name: '수단 Ⅲ 용액',
            target: 'fat',
            hitColor: '#e11d48', hitName: '선홍색',
            missColor: '#fdba74', missName: '옅은 주황색',
            needHeat: false
        }
    };

    // 효소마다 잘 일하는 자리 (교과서 값)
    var ENZYMES = {
        amylase: { name: '아밀레이스 (침·이자액)', optPh: 7, where: '입 · 소장', from: '녹말', to: '엿당' },
        pepsin: { name: '펩신 (위액)', optPh: 2, where: '위', from: '단백질', to: '펩톤' },
        trypsin: { name: '트립신 (이자액)', optPh: 8, where: '소장', from: '펩톤', to: '폴리펩타이드' },
        lipase: { name: '라이페이스 (이자액)', optPh: 8, where: '소장', from: '지방', to: '지방산 + 모노글리세리드' }
    };

    var SVG_NS = 'http://www.w3.org/2000/svg';

    var wrap, layer, svg, tagLayer, liquids = {}, glasses = {}, tubeNotes = {}, curvePath, marker, headline, summary, pairNote;

    function init() {
        wrap = document.querySelector('.cinematic-viewport');
        if (!wrap) return;

        addSceneButton();
        buildLayer();
        watchControls();
        firstSceneOnLoad();
        render();
        window.addEventListener('resize', placeTags);
        setTimeout(placeTags, 120);
    }

    function addSceneButton() {
        var bar = wrap.querySelector('.scene-switcher');
        if (!bar || bar.querySelector('[data-scene="lab"]')) return;
        var b = document.createElement('button');
        b.className = 'scene-btn';
        b.dataset.scene = 'lab';
        b.textContent = '🧪 4. 영양소 검출 실험';
        bar.appendChild(b);

        bar.querySelectorAll('.scene-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var on = btn.dataset.scene === 'lab';
                // 다른 장면 단추는 app.js 가 알아서 처리한다. 우리는 보이고 감추기만.
                bar.querySelectorAll('.scene-btn').forEach(function (x) {
                    x.classList.toggle('active', x === btn);
                });
                setVisible(on);
                if (on) openLabTab();
            });
        });
    }

    /** 없어진 장면에서 시작하지 않도록 남은 첫 단추를 눌러 준다 */
    function firstSceneOnLoad() {
        var first = wrap.querySelector('.scene-btn');
        if (first) first.click();
    }

    function openLabTab() {
        var t = document.querySelector('.sidebar-tab-btn[data-tab="lab"]');
        if (t && !t.classList.contains('active')) t.click();
    }

    function setVisible(on) {
        if (on) { setTimeout(placeTags, 0); setTimeout(placeTags, 80); }
        layer.hidden = !on;
        var canvas = document.getElementById('simulationCanvas');
        // 다른 겹판이 떠 있으면 캔버스를 도로 켜지 않는다 (전신 도식이 그 아래에서 헛돌았다)
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.tract-layer:not([hidden]), .stomach-layer:not([hidden]), .villus-layer:not([hidden])')) {
            canvas.style.visibility = 'visible';
        }
        if (on) render();
        toggleHud(on);
    }

    /** 떠 있는 안내 띠는 우리 장면의 표와 그림을 덮으므로 감춘다 */
    function toggleHud(hide) {
        if (!wrap) return;
        var hud = wrap.querySelector('.sim-hud-overlay');
        if (hud) hud.style.display = hide ? 'none' : '';
    }

    function buildLayer() {
        layer = document.createElement('div');
        layer.className = 'enzyme-lab-layer';
        layer.hidden = true;
        layer.innerHTML =
            '<div class="enzyme-lab-head"><span id="labHeadline">시약을 고르면 네 시험관의 색이 함께 바뀝니다.</span></div>' +
            '<div class="enzyme-lab-body"></div>';
        wrap.appendChild(layer);

        svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', '0 0 1000 560');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        var body = layer.querySelector('.enzyme-lab-body');
        body.appendChild(svg);

        // 글씨는 그림 안에 넣지 않는다. 그림 안 글씨는 창이 커지면 같이 커진다.
        tagLayer = document.createElement('div');
        tagLayer.className = 'enzyme-tags';
        body.appendChild(tagLayer);

        drawRack();
        drawCurvePanel();
    }

    function drawRack() {
        var g = el('g');
        svg.appendChild(g);

        TUBES.forEach(function (t, i) {
            var x = 70 + i * 130;

            // 시험관 유리
            var glass = el('rect', {
                x: x, y: 90, width: 68, height: 250, rx: 30,
                fill: 'rgba(226,232,240,0.10)', stroke: '#cbd5e1', 'stroke-width': 2.5
            });
            g.appendChild(glass);
            glasses[t.key] = glass;

            // 속 액체
            var liquid = el('rect', {
                x: x + 5, y: 190, width: 58, height: 145, rx: 26,
                fill: t.base, opacity: 0.92
            });
            g.appendChild(liquid);
            liquids[t.key] = liquid;

            // 이름
            tag(x + 34, 70, t.name, 'name');

            // 결과 쪽지
            tubeNotes[t.key] = tag(x + 34, 372, '—', 'dim');
        });

        // 시험관 꽂이
        g.appendChild(el('rect', {
            x: 40, y: 344, width: 520, height: 22, rx: 8,
            fill: '#334155', stroke: '#64748b', 'stroke-width': 2
        }));
    }

    function drawCurvePanel() {
        var g = el('g', { transform: 'translate(620, 60)' });
        svg.appendChild(g);

        tag(620, 60, '효소가 잘 일하는 자리', 'head', 'start');

        // 축
        g.appendChild(el('line', { x1: 0, y1: 210, x2: 320, y2: 210, stroke: '#64748b', 'stroke-width': 2 }));
        g.appendChild(el('line', { x1: 0, y1: 30, x2: 0, y2: 210, stroke: '#64748b', 'stroke-width': 2 }));
        tag(780, 320, 'pH (산성 ➔ 염기성)', 'dim');
        for (var p = 1; p <= 13; p += 3) {
            var x = ((p - 1) / 13) * 320;
            g.appendChild(el('line', { x1: x, y1: 210, x2: x, y2: 216, stroke: '#64748b', 'stroke-width': 2 }));
            tag(620 + x, 292, String(p), 'dim');
        }
        tag(590, 100, '활성', 'dim', 'end');

        curvePath = el('path', { fill: 'none', stroke: '#fbbf24', 'stroke-width': 3 });
        g.appendChild(curvePath);

        marker = el('circle', { r: 8, fill: '#f43f5e', stroke: '#ffffff', 'stroke-width': 2.5 });
        g.appendChild(marker);

        headline = tag(500, 434, '', 'warm');
        summary = tag(500, 476, '', 'dim');
        pairNote = tag(500, 520, '', 'dim');
    }

    /* ── 현재 조작 상태 읽기 (app.js 를 건드리지 않으려고 화면에서 직접 읽는다) ── */

    function current() {
        var reagentBtn = document.querySelector('[data-reagent].active');
        var enzymeBtn = document.querySelector('[data-enzyme].active');
        var nutrientBtn = document.querySelector('[data-nutrient].active');
        var heatBtn = document.getElementById('heatBtn');
        var ph = parseFloat((document.getElementById('phSlider') || {}).value);
        var temp = parseFloat((document.getElementById('tempSlider') || {}).value);
        return {
            reagent: reagentBtn ? reagentBtn.dataset.reagent : null,
            enzyme: enzymeBtn ? enzymeBtn.dataset.enzyme : 'amylase',
            nutrient: nutrientBtn ? nutrientBtn.dataset.nutrient : 'starch',
            heating: !!(heatBtn && heatBtn.classList.contains('active')),
            ph: isNaN(ph) ? 7 : ph,
            temp: isNaN(temp) ? 37 : temp
        };
    }

    function watchControls() {
        ['[data-reagent]', '[data-enzyme]', '[data-nutrient]', '#heatBtn'].forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (b) {
                b.addEventListener('click', function () { setTimeout(render, 0); });
            });
        });
        ['phSlider', 'tempSlider'].forEach(function (id) {
            var s = document.getElementById(id);
            if (s) s.addEventListener('input', render);
        });
    }

    /* ── 그리기 ────────────────────────────────────────────── */

    function render() {
        if (!layer || layer.hidden) return;
        var c = current();
        paintTubes(c);
        paintCurve(c);
        placeTags();
    }

    function paintTubes(c) {
        var r = c.reagent ? REAGENTS[c.reagent] : null;
        var head = document.getElementById('labHeadline');

        TUBES.forEach(function (t) {
            var liquid = liquids[t.key];
            var note = tubeNotes[t.key];
            if (!r) {
                liquid.setAttribute('fill', t.base);
                note.textContent = '—';
                note.style.color = '#94a3b8';
                return;
            }

            var hit = (t.key === r.target);
            if (hit && r.needHeat && !c.heating) {
                liquid.setAttribute('fill', r.coldColor);
                note.textContent = r.coldName;
                note.style.color = '#fbbf24';
            } else if (hit) {
                liquid.setAttribute('fill', r.hitColor);
                note.textContent = r.hitName + ' ✔';
                note.style.color = '#f8fafc';
            } else {
                liquid.setAttribute('fill', r.missColor);
                note.textContent = r.missName;
                note.style.color = '#94a3b8';
            }
        });

        if (!head) return;
        if (!r) {
            head.textContent = '시약을 고르면 네 시험관의 색이 함께 바뀝니다.';
        } else if (r.needHeat && !c.heating) {
            head.innerHTML = r.name + ' 을 넣었습니다. <strong style="color:#fbbf24">베네딕트 반응은 가열해야 색이 나옵니다.</strong> [베네딕트 가열]을 눌러 보세요.';
        } else {
            var t = TUBES.filter(function (x) { return x.key === r.target; })[0];
            head.innerHTML = r.name + ' ➔ <strong style="color:#f8fafc">' + t.name +
                '</strong> 만 <strong style="color:' + r.hitColor + '; text-shadow:0 0 6px ' + r.hitColor + '">' +
                r.hitName + '</strong> 으로 변했습니다.';
        }
    }

    /** 효소 활성: 잘 맞는 pH 에서 가장 높고, 60℃ 를 넘으면 단백질이 굳어 0 이 된다 */
    function activity(enzymeKey, ph, temp) {
        var opt = ENZYMES[enzymeKey].optPh;
        var byPh = Math.exp(-Math.pow(ph - opt, 2) / (2 * 1.3 * 1.3));
        var byTemp;
        if (temp >= 60) byTemp = 0;                       // 열에 굳으면 되돌아오지 않는다
        else byTemp = Math.exp(-Math.pow(temp - 37, 2) / (2 * 12 * 12));
        return byPh * byTemp;
    }

    function paintCurve(c) {
        var e = ENZYMES[c.enzyme];
        var d = '';
        for (var p = 1; p <= 14; p += 0.25) {
            var x = ((p - 1) / 13) * 320;
            var y = 210 - activity(c.enzyme, p, c.temp) * 175;
            d += (d ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
        }
        curvePath.setAttribute('d', d);

        var mx = ((c.ph - 1) / 13) * 320;
        var act = activity(c.enzyme, c.ph, c.temp);
        marker.setAttribute('cx', mx.toFixed(1));
        marker.setAttribute('cy', (210 - act * 175).toFixed(1));

        headline.textContent = e.name + ' · 알맞은 산성도 pH ' + e.optPh;
        var pct = Math.round(act * 100);
        var msg;
        if (c.temp >= 60) msg = '지금 ' + c.temp + '℃ — 열에 굳어 일하지 못합니다 (활성 0%)';
        else msg = '지금 pH ' + c.ph + ' · ' + c.temp + '℃ — 활성 ' + pct + '% · ' + e.from + ' ➔ ' + e.to;
        summary.textContent = msg;
        summary.style.color = pct > 60 ? '#86efac' : (pct > 25 ? '#fbbf24' : '#fca5a5');

        var stat = document.getElementById('statEnzymeActivity');
        if (stat) stat.textContent = pct + ' %';

        markNutrient(c, e);
    }

    // 효소가 자를 수 있는 영양소 (기질 특이성 — 시험에 나온다)
    var CUTS = { amylase: 'starch', pepsin: 'protein', trypsin: 'protein', lipase: 'fat' };

    /**
     * 고른 영양소의 시험관에 테를 두르고, 지금 고른 효소로 잘리는지 적는다.
     *
     * 전에는 영양소 단추 넷을 눌러도 화면이 꿈쩍도 안 했다. 시험관 넷이
     * 이미 다 놓여 있어서 「무엇을 넣을까」가 그림에 나타날 데가 없었다.
     * 효소는 정해진 영양소만 자른다 — 그 짝을 여기서 보여 준다.
     */
    function markNutrient(c, e) {
        var picked = c.nutrient;
        TUBES.forEach(function (t) {
            var glass = glasses[t.key];
            if (!glass) return;
            var on = (t.key === picked);
            glass.setAttribute('stroke', on ? '#facc15' : '#cbd5e1');
            glass.setAttribute('stroke-width', on ? 4.5 : 2.5);
        });

        if (!pairNote) return;
        var tube = TUBES.filter(function (t) { return t.key === picked; })[0];
        var 이름 = tube ? tube.name : '';
        // ENZYMES 의 from 은 녹말·단백질·펩톤·지방 — 모두 받침이 있어 「을」이 맞다
        if (CUTS[c.enzyme] === picked) {
            pairNote.textContent = 이름 + ' ➔ 잘립니다 (' + e.from + '을 자르는 효소)';
            pairNote.style.color = '#86efac';
        } else {
            pairNote.textContent = 이름 + ' ➔ 안 잘립니다 (이 효소는 ' + e.from + '만 자름)';
            pairNote.style.color = '#fca5a5';
        }
    }

    /* ── 작은 도우미 ───────────────────────────────────────── */

    function el(tag, attrs) {
        var n = document.createElementNS(SVG_NS, tag);
        Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
        return n;
    }

    /* ── 이름표 (HTML) ───────────────────────────────────── */
    var TAGS = [];

    function tag(x, y, str, cls, anchor) {
        var e = document.createElement('span');
        e.className = 'enzyme-tag' + (cls ? ' ' + cls : '');
        e.textContent = str || '';
        e.dataset.anchor = anchor || 'middle';
        tagLayer.appendChild(e);
        TAGS.push({ el: e, x: x, y: y });
        return e;
    }

    function placeTags() {
        if (!svg || !tagLayer || !layer || layer.hidden) return;
        var box = svg.getBoundingClientRect();
        if (!box.width) return;
        var vb = svg.viewBox.baseVal;
        var k = Math.min(box.width / vb.width, box.height / vb.height);
        var lb = tagLayer.getBoundingClientRect();
        var offX = (box.left - lb.left) + (box.width - vb.width * k) / 2;
        var offY = (box.top - lb.top) + (box.height - vb.height * k) / 2;
        TAGS.forEach(function (t) {
            t.el.style.left = (offX + t.x * k) + 'px';
            t.el.style.top = (offY + t.y * k) + 'px';
        });
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
