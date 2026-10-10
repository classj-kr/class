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
        { key: 'urea', name: '요소', color: '#fb7185', filtered: true, reabsorb: 'some' },
        { key: 'secreted', name: '분비 물질 (H⁺ 등)', color: '#f97316', filtered: false, secreted: true },
        { key: 'protein', name: '단백질', color: '#22c55e', filtered: false },
        { key: 'blood', name: '혈구', color: '#dc2626', filtered: false }
    ];

    var leaderGroup = null;
    var wrap, layer, svg, labelBox;
    var pathBlood, pathFiltrate, pathReabsorb;
    var lenBlood, lenFiltrate, lenReabsorb, pathSecrete, lenSecrete, pathWater, lenWater;
    var junctions = {};
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
        glomerulus: ['사구체', '실뭉치처럼 뭉친 모세혈관입니다. 압력 차이로 <strong>혈장의 물과 작은 용질</strong>이 여과 장벽을 통과해 보먼주머니로 이동합니다. 정상 상태에서는 혈구와 대부분의 큰 단백질이 혈액에 남습니다.'],
        efferentArteriole: ['날세동맥', '사구체에서 <strong>나가는</strong> 혈관입니다. 들세동맥보다 가늘어 사구체 안이 잘 빠져나가지 못하고 압력이 높게 유지됩니다.'],
        bowmanCapsule: ['보먼주머니', '사구체를 감싼 컵입니다. 여기에 모인 것을 <strong>원뇨</strong>라고 합니다.'],
        proximalTubule: ['세뇨관', '원뇨가 지나는 가는 관입니다. 정상 상태에서는 여과된 <strong>포도당과 아미노산이 거의 모두 재흡수</strong>됩니다. 물은 주로 삼투로 이동하며, 모든 재흡수가 능동 수송인 것은 아닙니다.'],
        loopOfHenle: ['헨레고리', '아래로 내려갔다 올라오는 U자 부분입니다. 주로 <strong>물과 무기염류</strong>가 되흡수됩니다.'],
        distalTubule: ['세뇨관 뒷부분', '물과 이온의 재흡수를 조절하고, 수소 이온 등의 물질을 혈액 쪽에서 세뇨관 안으로 <strong>분비</strong>합니다. 분비는 재흡수와 반대 방향입니다. 세뇨관의 여러 구간에서 일어납니다.'],
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
        pathSecrete = document.createElementNS(SVG_NS,'path');
        pathSecrete.setAttribute('d','M540 220 Q554 202 572 190');
        pathSecrete.setAttribute('fill','none');
        pathSecrete.setAttribute('stroke','#f97316');
        pathSecrete.setAttribute('stroke-width','3');
        pathSecrete.setAttribute('stroke-dasharray','4 3');
        pathSecrete.setAttribute('id','flowSecrete');
        svg.appendChild(pathSecrete);
        lenSecrete=pathSecrete.getTotalLength();
        // Branches meet at measured points on the actual paths, not arbitrary fractions.
        junctions.filter=nearest(pathBlood,248,202);
        junctions.reabsorb=nearest(pathFiltrate,434,250);
        junctions.returnBlood=nearest(pathBlood,450,260);
        junctions.secrete=nearest(pathBlood,540,220);
        junctions.returnFiltrate=nearest(pathFiltrate,572,190);
        var waterSite=pathFiltrate.getPointAtLength(pathFiltrate.getTotalLength()*nearest(pathFiltrate,802,480));
        pathWater=document.createElementNS(SVG_NS,'path');
        pathWater.setAttribute('d','M'+waterSite.x+' '+waterSite.y+' L740 480 L740 250');
        pathWater.setAttribute('fill','none');pathWater.setAttribute('stroke','#38bdf8');pathWater.setAttribute('stroke-width','2');pathWater.setAttribute('stroke-dasharray','5 5');
        pathWater.setAttribute('id','flowWaterReabsorb');svg.appendChild(pathWater);lenWater=pathWater.getTotalLength();
        junctions.water=nearest(pathFiltrate,802,480);junctions.waterReturn=nearest(pathBlood,740,250);

        var g = document.createElementNS(SVG_NS, 'g');
        g.setAttribute('id', 'nephronDots');
        svg.appendChild(g);

        // 혈액을 타고 흐르는 알갱이 (여섯 가지를 섞어 흘린다)
        g.style.pointerEvents='none';
        for (var i = 0; i < STUFF.length * 4; i++) {
            var stuff = STUFF[i % STUFF.length];
            var dot=makeDot(g, stuff, (i / (STUFF.length * 4)) * junctions.filter);
            dot.sample=Math.floor(i/STUFF.length);
            dots.push(dot);
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

    function nearest(path,x,y) {
        var length=path.getTotalLength(), best=0, distance=Infinity;
        for(var i=0;i<=2000;i++){
            var p=path.getPointAtLength(length*i/2000);
            var d=(p.x-x)*(p.x-x)+(p.y-y)*(p.y-y);
            if(d<distance){distance=d;best=i/2000;}
        }
        return best;
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
        var speed = dt * (70 + st.bp * .5);

        dots.forEach(function (d) {
            var previous=d.t;
            var routeLength=d.lane==='blood'?lenBlood:d.lane==='filtrate'?lenFiltrate:d.lane==='secrete'?lenSecrete:d.lane==='waterReturn'?lenWater:lenReabsorb;
            d.t += speed / routeLength;
            if (d.t >= 1) {
                if(d.lane==='reabsorb'){d.lane='blood';d.t=junctions.returnBlood+.002;}
                else if(d.lane==='waterReturn'){d.lane='blood';d.t=junctions.waterReturn+.002;}
                else if(d.lane==='secrete'){d.lane='filtrate';d.t=junctions.returnFiltrate+.002;}
                else {d.lane='blood';d.t=0;}
                previous=d.t;
            }

            if (d.lane === 'blood' && previous <= junctions.filter && d.t > junctions.filter && d.stuff.filtered) {
                d.lane = 'filtrate';
                d.t = 0;
            } else if(d.lane==='blood' && d.stuff.secreted && previous<=junctions.secrete && d.t>junctions.secrete){
                d.lane='secrete';d.t=0;
            } else if (d.lane === 'filtrate' && previous<=junctions.reabsorb && d.t>junctions.reabsorb) {
                // Representative routes, not a quantitative count of molecules.
                var back=d.stuff.reabsorb==='all' ||
                    (d.stuff.reabsorb==='some' && d.sample%2===0) ||
                    (d.stuff.reabsorb==='adh' && d.sample < 2);
                if (back && pathReabsorb) {
                    d.lane = 'reabsorb';
                    d.t = 0;
                }
            } else if(d.lane==='filtrate' && d.stuff.key==='water' && d.sample===2 && st.adh>=65 && previous<=junctions.water && d.t>junctions.water){
                d.lane='waterReturn';d.t=0;
            }

            var path = d.lane === 'blood' ? pathBlood : (d.lane === 'filtrate' ? pathFiltrate : d.lane==='secrete'?pathSecrete:d.lane==='waterReturn'?pathWater:pathReabsorb);
            var len = path.getTotalLength();
            if (!path) return;
            var p = path.getPointAtLength(Math.min(d.t, 1) * len);
            d.el.setAttribute('cx', p.x);
            d.el.setAttribute('cy', p.y);
            d.el.setAttribute('opacity', d.lane === 'reabsorb' ? 0.85 : 1);
            d.el.dataset.lane=d.lane;d.el.dataset.substance=d.stuff.key;
        });
    }

    function renderTable() {
        if (!tableRows.length) return;
        var st = state();

        tableRows.forEach(function (row) {
            var key = row.dataset.key;
            var s = STUFF.filter(function (x) { return x.key === key; })[0];
            var f = row.querySelector('.c-filter');
            var rb = row.querySelector('.c-reab');
            var u = row.querySelector('.c-urine');

            if(s.secreted){
                f.textContent='여기서는 분비 경로 관찰';
                rb.textContent='혈액 → 세뇨관 (분비)';
                u.textContent='배출량 조절';
                return;
            }

            if (!s.filtered) {
                f.textContent = '안 됨 (크기가 커서)';
                f.className = 'c-filter no';
                rb.textContent = '—';
                rb.className = 'c-reab';
                u.textContent = '없음';
                u.className = 'c-urine no';
                return;
            }

            f.textContent = '됨';
            f.className = 'c-filter yes';

            if (s.reabsorb === 'all') {
                rb.textContent = '거의 모두 (정상 상태)';
                rb.className = 'c-reab yes';
                u.textContent = '없음 (정상)';
                u.className = 'c-urine no';
            } else if (s.reabsorb === 'adh') {
                rb.textContent = '대부분 · ADH가 많으면 증가';
                rb.className = 'c-reab yes';
                u.textContent = st.adh >= 65 ? '감소 (다른 조건이 같을 때)' : st.adh <= 35 ? '증가 (다른 조건이 같을 때)' : '일부 배출';
                u.className = 'c-urine warn';
            } else {
                rb.textContent = '일부 재흡수됨';
                rb.className = 'c-reab no';
                u.textContent = '포함됨';
                u.className = 'c-urine yes';
            }
        });

        if (headline) {
            headline.innerHTML = '<strong>여과:</strong> 혈액 → 보먼주머니 · <strong>재흡수:</strong> 세뇨관 → 혈액 · <strong>분비:</strong> 혈액 → 세뇨관<br>' +
                '주황 점선은 분비, 파란 점선은 집합관에서 물이 혈액 쪽으로 돌아가는 경로입니다. 입자의 수·크기·시간은 실제 비율이 아닙니다.';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
