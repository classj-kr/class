/**
 * 네프론에서 일어나는 여과 · 재흡수 · 분비
 *
 * 그림(../assets/images/nephron-diagram.svg)을 그대로 넣고 이름(id)만 찾아 움직인다.
 * 그림을 다시 그려도 id 와 안내선(#flowBlood, #flowFiltrate, #flowReabsorb)만 지키면
 * 이 파일은 고칠 필요가 없다.
 *
 * 시험에 나오는 대목:
 *   여과  - 크기로 거른다. 물·포도당·아미노산·요소·무기염류는 빠져나가고
 *           단백질과 혈구는 크기가 커서 못 빠져나간다.
 *   재흡수 - 포도당과 아미노산은 100% 되흡수된다. 물은 항이뇨호르몬이 정한다.
 *   분비  - 미처 못 걸러진 노폐물을 모세혈관에서 세뇨관으로 밀어 넣는다.
 */

(function () {
    'use strict';

    /** 머리글의 [일시정지] 를 따른다 */
    function isPaused() {
        return typeof SimEngine !== 'undefined' && SimEngine.isPaused ? SimEngine.isPaused() : false;
    }

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var SVG_URL = '../assets/images/nephron-diagram.svg';

    // 걸러지는 알갱이. 단백질과 혈구는 사구체를 못 빠져나간다.
    var STUFF = [
        { key: 'water', name: '물', color: '#38bdf8', filtered: true, reabsorb: 'adh' },
        { key: 'glucose', name: '포도당', color: '#facc15', filtered: true, reabsorb: 'all' },
        { key: 'amino', name: '아미노산', color: '#a78bfa', filtered: true, reabsorb: 'all' },
        { key: 'urea', name: '요소', color: '#fb7185', filtered: true, reabsorb: 'none' },
        { key: 'protein', name: '단백질', color: '#22c55e', filtered: false },
        { key: 'blood', name: '혈구', color: '#dc2626', filtered: false }
    ];

    var leaderGroup = null;
    var wrap, layer, svg, labelBox;
    var pathBlood, pathFiltrate, pathReabsorb;
    var lenBlood, lenFiltrate, lenReabsorb;
    var dots = [], tableRows = [], headline;
    var lastTs = 0;

    // ax, ay 를 적으면 그 자리에 이름표를 놓고 조각까지 선을 긋는다.
    // 왼쪽 위 넷은 상자가 겹쳐 그냥 두면 사구체를 가린다.
    var LABELS = [
        { id: 'afferentArteriole', text: '들세동맥 (굵다)', ax: 78, ay: 62 },
        { id: 'glomerulus', text: '사구체 — 여과가 일어난다', ax: 268, ay: 44 },
        { id: 'bowmanCapsule', text: '보먼주머니', ax: 470, ay: 44 },
        { id: 'efferentArteriole', text: '날세동맥 (가늘다)', ax: 128, ay: 452 },
        { id: 'proximalTubule', text: '세뇨관' },
        { id: 'loopOfHenle', text: '헨레고리' },
        { id: 'distalTubule', text: '세뇨관 뒷부분' },
        { id: 'collectingDuct', text: '집합관' },
        { id: 'peritubularCapillary', text: '세뇨관 주위 모세혈관' },
        { id: 'renalVein', text: '콩팥정맥' }
    ];

    var DETAIL = {
        afferentArteriole: ['들세동맥', '사구체로 <strong>들어가는</strong> 혈관입니다. 나가는 날세동맥보다 <strong>굵어서</strong> 사구체 안의 압력이 높아지고, 그 힘으로 걸러집니다.'],
        glomerulus: ['사구체', '실뭉치처럼 뭉친 모세혈관입니다. 높은 압력으로 혈액의 일부를 보먼주머니로 밀어냅니다. 이것이 <strong>여과</strong>입니다.'],
        efferentArteriole: ['날세동맥', '사구체에서 <strong>나가는</strong> 혈관입니다. 들세동맥보다 가늘어 사구체 안이 잘 빠져나가지 못하고 압력이 높게 유지됩니다.'],
        bowmanCapsule: ['보먼주머니', '사구체를 감싼 컵입니다. 여기에 모인 것을 <strong>원뇨</strong>라고 합니다.'],
        proximalTubule: ['세뇨관', '원뇨가 지나는 가는 관입니다. 몸에 필요한 <strong>포도당과 아미노산이 여기서 모두 되흡수</strong>됩니다.'],
        loopOfHenle: ['헨레고리', '아래로 내려갔다 올라오는 U자 부분입니다. 주로 <strong>물과 무기염류</strong>가 되흡수됩니다.'],
        distalTubule: ['세뇨관 뒷부분', '남은 물을 마저 되흡수하고, 못 걸러진 노폐물을 <strong>분비</strong>받습니다.'],
        collectingDuct: ['집합관', '오줌이 모여 나가는 굵은 관입니다. 항이뇨호르몬이 많으면 여기서 물을 더 되흡수해 오줌이 진해집니다.'],
        peritubularCapillary: ['세뇨관 주위 모세혈관', '세뇨관을 휘감고 있습니다. 되흡수한 것을 받아 다시 몸으로 돌려보냅니다.'],
        renalVein: ['콩팥정맥', '되흡수를 마친 혈액이 몸으로 돌아가는 길입니다. 들어올 때보다 <strong>요소가 적습니다</strong>.']
    };

    function init() {
        wrap = document.querySelector('.excretion-viewport');
        if (!wrap) return;
        addSceneButton();
        buildLayer();
        watchControls();
        firstSceneOnLoad();
        requestAnimationFrame(loop);
    }

    function addSceneButton() {
        var bar = wrap.querySelector('.scene-switcher');
        if (!bar || bar.querySelector('[data-scene="nephron"]')) return;
        var b = document.createElement('button');
        b.className = 'scene-btn';
        b.dataset.scene = 'nephron';
        b.textContent = '💧 3. 여과·재흡수·분비 (네프론)';
        bar.appendChild(b);

        bar.querySelectorAll('.scene-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                bar.querySelectorAll('.scene-btn').forEach(function (x) {
                    x.classList.toggle('active', x === btn);
                });
                setVisible(btn.dataset.scene === 'nephron');
            });
        });
    }

    /** 없어진 장면에서 시작하지 않도록 남은 첫 단추를 눌러 준다 */
    function firstSceneOnLoad() {
        var first = wrap.querySelector('.scene-btn');
        if (first) first.click();
    }

    function setVisible(on) {
        if (!layer) return;
        layer.hidden = !on;
        var canvas = document.getElementById('excretionCanvas');
        // 다른 겹판이 떠 있으면 캔버스를 도로 켜지 않는다
        if (canvas && on) canvas.style.visibility = 'hidden';
        else if (canvas && !document.querySelector('.urine-layer:not([hidden]), .excretion-map-layer:not([hidden])')) {
            canvas.style.visibility = 'visible';
        }
        if (on) placeLabels();
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
        layer.className = 'nephron-layer';
        layer.hidden = true;
        wrap.appendChild(layer);

        fetch(SVG_URL)
            .then(function (r) { return r.text(); })
            .then(function (markup) {
                layer.innerHTML =
                    '<div class="nephron-head"><span id="nephronHead"></span></div>' +
                    '<div class="nephron-stage">' + markup + '<div class="nephron-labels"></div></div>' +
                    '<div class="nephron-table"></div>';
                svg = layer.querySelector('svg');
                labelBox = layer.querySelector('.nephron-labels');
                headline = layer.querySelector('#nephronHead');
                if (!svg) return;
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                setupDiagram();
                buildTable();
                placeLabels();
                window.addEventListener('resize', placeLabels);
            })
            .catch(function () {
                layer.innerHTML = '<div class="nephron-error">네프론 그림을 불러오지 못했습니다.</div>';
            });
    }

    function setupDiagram() {
        pathBlood = svg.querySelector('#flowBlood');
        pathFiltrate = svg.querySelector('#flowFiltrate');
        pathReabsorb = svg.querySelector('#flowReabsorb');
        if (!pathBlood || !pathFiltrate) return;

        lenBlood = pathBlood.getTotalLength();
        lenFiltrate = pathFiltrate.getTotalLength();
        lenReabsorb = pathReabsorb ? pathReabsorb.getTotalLength() : 0;

        var g = document.createElementNS(SVG_NS, 'g');
        g.setAttribute('id', 'nephronDots');
        svg.appendChild(g);

        // 혈액을 타고 흐르는 알갱이 (여섯 가지를 섞어 흘린다)
        for (var i = 0; i < 18; i++) {
            var stuff = STUFF[i % STUFF.length];
            dots.push(makeDot(g, stuff, i / 18));
        }

        Object.keys(DETAIL).forEach(function (id) {
            var elm = svg.querySelector('#' + id);
            if (!elm) return;
            elm.style.cursor = 'pointer';
            elm.addEventListener('click', function () { showDetail(id); });
        });
    }

    function makeDot(parent, stuff, offset) {
        var c = document.createElementNS(SVG_NS, 'circle');
        c.setAttribute('r', 7);
        c.setAttribute('fill', stuff.color);
        parent.appendChild(c);
        return { el: c, stuff: stuff, t: offset, lane: 'blood' };
    }

    function showDetail(id) {
        // 누른 조각에 노란 테를 두른다. 글자만 바뀌면 겹쳐 있는 조각 가운데
        // 어느 것을 골랐는지 알 수 없다.
        if (typeof SimEngine !== 'undefined' && SimEngine.litPart) {
            SimEngine.litPart(svg, Object.keys(DETAIL), id);
        }
        var d = DETAIL[id];
        if (!d) return;
        var t = document.getElementById('organTitle');
        var p = document.getElementById('organDesc');
        if (t) t.textContent = d[0];
        if (p) p.innerHTML = d[1];
        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
    }

    function placeLabels() {
        BodyDiagramLabels.render(svg, labelBox, LABELS, {
            leaders: leaderGroup,
            className: 'nephron-tag',
            select: function (item) { showDetail(item.id); }
        });
    }

    function buildTable() {
        var host = layer.querySelector('.nephron-table');
        var html = '<table><thead><tr><th>물질</th><th>여과 (사구체 ➔ 보먼주머니)</th><th>재흡수 (세뇨관 ➔ 모세혈관)</th><th>오줌에</th></tr></thead><tbody>';
        STUFF.forEach(function (s) {
            html += '<tr data-key="' + s.key + '">' +
                '<td><i style="background:' + s.color + '"></i>' + s.name + '</td>' +
                '<td class="c-filter"></td><td class="c-reab"></td><td class="c-urine"></td></tr>';
        });
        html += '</tbody></table>';
        host.innerHTML = html;
        tableRows = Array.prototype.slice.call(host.querySelectorAll('tbody tr'));
    }

    /* ── 조작 상태 ────────────────────────────────────────── */

    function state() {
        return {
            bp: num('bpSlider', 120),          // 혈압 (사구체 여과압)
            water: num('hydrationSlider', 50), // 수분 섭취량
            adh: num('adhSlider', 50)          // 항이뇨호르몬
        };
    }

    function num(id, dflt) {
        var s = document.getElementById(id);
        var v = s ? parseFloat(s.value) : dflt;
        return isNaN(v) ? dflt : v;
    }

    function watchControls() {
        ['bpSlider', 'hydrationSlider', 'adhSlider'].forEach(function (id) {
            var s = document.getElementById(id);
            if (s) s.addEventListener('input', renderTable);
        });
    }

    /* ── 움직이기 ─────────────────────────────────────────── */

    function loop(ts) {
        if (!lastTs) lastTs = ts;
            // 다른 파일이 나중에 더한 장면 단추도 있으므로, 누가 켜져 있는지 매 번 확인한다
            var act = wrap.querySelector('.scene-btn.active');
            var mine = !!(act && act.dataset.scene === 'nephron');
            if (layer.hidden === mine) setVisible(mine);

        var dt = Math.min((ts - lastTs) / 1000, 0.1);
        lastTs = ts;
        if (isPaused()) dt = 0;
        if (svg && layer && !layer.hidden) {
            step(dt);
            renderTable();
        }
        requestAnimationFrame(loop);
    }

    function step(dt) {
        var st = state();
        var speed = dt * (0.10 + (st.bp - 80) / 80 * 0.10);

        dots.forEach(function (d) {
            d.t += speed;
            if (d.t >= 1) {
                d.t -= 1;
                d.lane = 'blood';
            }

            // 사구체를 지나는 지점(길의 3분의 1쯤)에서 갈린다
            if (d.lane === 'blood' && d.t > 0.34 && d.stuff.filtered) {
                d.lane = 'filtrate';
                d.t = 0.02;
            } else if (d.lane === 'filtrate' && d.stuff.reabsorb !== 'none') {
                var back = (d.stuff.reabsorb === 'all') ? 0.42 : 0.42 + (1 - waterReabsorbRate(state())) * 0.5;
                if (d.t > back && pathReabsorb) {
                    d.lane = 'reabsorb';
                    d.t = 0.02;
                }
            } else if (d.lane === 'reabsorb' && d.t > 0.98) {
                d.lane = 'blood';
                d.t = 0.62;
            }

            var path = d.lane === 'blood' ? pathBlood : (d.lane === 'filtrate' ? pathFiltrate : pathReabsorb);
            var len = d.lane === 'blood' ? lenBlood : (d.lane === 'filtrate' ? lenFiltrate : lenReabsorb);
            if (!path) return;
            var p = path.getPointAtLength(Math.min(d.t, 1) * len);
            d.el.setAttribute('cx', p.x);
            d.el.setAttribute('cy', p.y);
            d.el.setAttribute('opacity', d.lane === 'reabsorb' ? 0.85 : 1);
        });
    }

    /** 물이 되흡수되는 정도. 항이뇨호르몬이 많거나 물을 적게 마시면 더 많이 되흡수된다. */
    function waterReabsorbRate(st) {
        var byAdh = 0.55 + (st.adh / 100) * 0.42;
        var byWater = 1 - (st.water / 100) * 0.22;
        return Math.max(0.4, Math.min(0.995, byAdh * byWater));
    }

    function renderTable() {
        if (!tableRows.length) return;
        var st = state();
        var wr = waterReabsorbRate(st);
        var filterOk = st.bp >= 90;   // 혈압이 너무 낮으면 여과가 잘 안 된다

        tableRows.forEach(function (row) {
            var key = row.dataset.key;
            var s = STUFF.filter(function (x) { return x.key === key; })[0];
            var f = row.querySelector('.c-filter');
            var rb = row.querySelector('.c-reab');
            var u = row.querySelector('.c-urine');

            if (!s.filtered) {
                f.textContent = '안 됨 (크기가 커서)';
                f.className = 'c-filter no';
                rb.textContent = '—';
                rb.className = 'c-reab';
                u.textContent = '없음';
                u.className = 'c-urine no';
                return;
            }

            f.textContent = filterOk ? '됨' : '거의 안 됨 (혈압 낮음)';
            f.className = 'c-filter ' + (filterOk ? 'yes' : 'warn');

            if (s.reabsorb === 'all') {
                rb.textContent = '100 % 되흡수';
                rb.className = 'c-reab yes';
                u.textContent = '없음 (정상)';
                u.className = 'c-urine no';
            } else if (s.reabsorb === 'adh') {
                rb.textContent = Math.round(wr * 100) + ' % 되흡수';
                rb.className = 'c-reab yes';
                u.textContent = wr > 0.88 ? '적음 (진한 오줌)' : (wr < 0.62 ? '많음 (묽은 오줌)' : '보통');
                u.className = 'c-urine warn';
            } else {
                rb.textContent = '거의 안 됨';
                rb.className = 'c-reab no';
                u.textContent = '많음 (내보낼 노폐물)';
                u.className = 'c-urine yes';
            }
        });

        if (headline) {
            headline.innerHTML = '사구체는 <strong>크기</strong>로 거릅니다. ' +
                '단백질과 혈구는 커서 못 빠져나가고, 포도당과 아미노산은 걸러졌다가 세뇨관에서 <strong>모두 되돌아옵니다</strong>. ' +
                '지금 물은 <strong>' + Math.round(wr * 100) + '%</strong> 되흡수 중입니다.';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
