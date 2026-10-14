/**
 * 2022 개정 교육과정 소화계 시네마틱 인터랙티브 시뮬레이터
 * High-Resolution Bioluminescent Visuals + 60fps Real-Time Physics & Enzyme Kinetics
 */

(function () {
    'use strict';

    var canvas, ctx;
    var width, height, dpr;
    var isRunning = true;
    var lastTime = 0;

    // Loaded Image Assets Cache
    // 이 방의 장면은 모두 평면 도식 겹판이 맡는다. 캔버스는 어느 장면에서도 보이지 않는다.
    // 그런데 배경 사진 2장(339KB)을 계속 받아 놓고 한 번도 그리지 않았다. 뗀다.
    // 뗀 것: digestion-stomach.webp, digestion-villi.webp
    var scenes = {};

    var currentSceneKey = 'journey';

    // Interactive Simulation Physics State
    var particles = [];
    var explorerX = 0, explorerY = 0, walkCycle = 0;
    var foodBolusProgress = 0.0;
    var isSwallowing = false;

    // Chemical Kinetics State
    var tempC = 37;
    var phVal = 7.0;
    var selectedEnzyme = 'amylase';
    var selectedNutrient = 'starch';
    var activeReagent = 'none';
    var isHeating = false;

    // DOM Elements
    var sceneBtns, playPauseBtn, swallowBtn, tempSlider, tempValEl, phSlider, phValEl;
    var enzymeBtns, nutrientBtns, reagentBtns, heatBtn, reagentResultEl;
    var organFocusCard, organTitleEl, organEnzymeEl, organPHEl, organProductEl, organDescEl;
    var statEnzymeActivityEl, quizContainerEl;

    // Hotspot Definitions per Scene
    var hotspots = {
        journey: [
            { x: 0.72, y: 0.22, r: 40, title: '위', enzyme: '펩신 + 염산 (pH 2.0)', ph: 'pH 2.0 (강산성)', product: '단백질 ➔ 펩톤', desc: '강력한 위산(HCl)과 펩신이 단백질을 1차 분해하며 음식물을 죽(암죽) 상태로 만듭니다.' },
            { x: 0.45, y: 0.48, r: 35, title: '십이지장 & 소장 입구', enzyme: '이자액 (아밀레이스·트립신·라이페이스) & 쓸개즙', ph: 'pH 8.0 (약염기성)', product: '3대 영양소 최종 분해', desc: '간에서 만든 쓸개즙이 지방을 유화하고, 이자액이 3대 영양소를 모두 최종 분해합니다.' },
            { x: 0.62, y: 0.78, r: 35, title: '소장 융털 흡수 경로', enzyme: '수용성(모세혈관) vs 지용성(암죽관)', ph: 'pH 8.0', product: '포도당, 아미노산, 지방산 흡수', desc: '수억 개의 융털이 표면적을 극대화하여 영양소를 온몸 세포로 보내기 위해 혈액과 림프로 흡수합니다.' }
        ],
        // 전신 장면의 표시점과 설명은 tract-map.js 가 갖는다
        torso: [],
        stomach: [
            { x: 0.50, y: 0.50, r: 80, title: '위 내부 점막 & 위액 챔버', enzyme: '펩신 (최적 pH 2.0)', ph: 'pH 2.0', product: '단백질 ➔ 펩톤', desc: '위벽을 보호하는 뮤신(점액)과 단백질을 쪼개는 펩신이 맹렬하게 소화 작용을 일으킵니다.' }
        ],
        villi: [
            { x: 0.35, y: 0.50, r: 60, title: '모세혈관 흡수 (수용성)', enzyme: '포도당, 아미노산, 무기염류, 수용성 비타민', ph: 'pH 8.0', product: '간정맥 ➔ 심장으로 수송', desc: '물에 잘 녹는 영양소는 융털의 모세혈관으로 흡수되어 간을 거쳐 온몸으로 갑니다.' },
            { x: 0.65, y: 0.50, r: 60, title: '암죽관 흡수 (지용성)', enzyme: '지방산, 모노글리세리드, 지용성 비타민(A,D,E,K)', ph: 'pH 8.0', product: '가슴관 ➔ 심장으로 수송', desc: '물에 녹지 않는 지방 성분은 융털 중심의 암죽관(림프관)으로 흡수됩니다.' }
        ]
    };

    function init() {
        canvas = document.getElementById('simulationCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        // Preload High-Res Masterpiece 3D Images
        Object.keys(scenes).forEach(function (key) {
            var item = scenes[key];
            var img = new Image();
            img.src = item.src;
            img.onload = function () {
                item.img = img;
                item.loaded = true;
            };
        });

        // Initialize Dynamic Particles
        initParticles(75);

        // Bind DOM & Controls
        bindDOM();
        renderSidebar();

        handleResize();
        window.addEventListener('resize', handleResize);

        // Start 60fps Loop
        requestAnimationFrame(renderLoop);
    }

    function initParticles(count) {
        particles = [];
        // Confine nutrient particles strictly inside digestive lumen & bloodstream
        for (var i = 0; i < count; i++) {
            particles.push({
                x: 0.70 + (Math.random() - 0.5) * 0.08,
                y: 0.15 + Math.random() * 0.65,
                vy: Math.random() * 0.03 + 0.015,
                size: Math.random() * 3 + 2,
                color: Math.random() > 0.5 ? '#fbbf24' : (Math.random() > 0.5 ? '#38bdf8' : '#f43f5e'),
                alpha: Math.random() * 0.7 + 0.3,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    function handleResize() {
        if (!canvas) return;
        var parent = canvas.parentElement;
        width = parent.clientWidth || 800;
        height = parent.clientHeight || 600;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }

    var drawClock = 0;   // 멈춰 있는 동안은 흐르지 않는다

    function renderLoop(time) {
        var dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
        lastTime = time;

        if (isRunning) {
            drawClock += dt * 1000;
            updatePhysics(dt, drawClock);
        }

        drawScene(drawClock);
        requestAnimationFrame(renderLoop);
    }

    function updatePhysics(dt, time) {
        walkCycle += dt * 5;

        // Food Bolus Swallowing Progress
        if (isSwallowing) {
            foodBolusProgress += dt * 0.25;
            if (foodBolusProgress >= 1.0) {
                foodBolusProgress = 1.0;
                isSwallowing = false;
            }
        }

        // Particle dynamics strictly inside the digestive tract
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.y += p.vy * dt;
            p.pulse += dt * 3;

            if (p.y > 0.80) {
                p.y = 0.15;
                p.x = 0.725 + (Math.random() - 0.5) * 0.04;
            }
        }
    }

    function drawScene(time) {
        ctx.clearRect(0, 0, width, height);

        var current = scenes[currentSceneKey];
        if (current && current.loaded && current.img) {
            // Draw High-Res Masterpiece Image maintaining aspect ratio (cover/contain fit)
            var img = current.img;
            var imgAspect = img.width / img.height;
            var canvasAspect = width / height;
            var dw, dh, dx, dy;

            if (canvasAspect > imgAspect) {
                dh = height;
                dw = height * imgAspect;
                dx = (width - dw) / 2;
                dy = 0;
            } else {
                dw = width;
                dh = width / imgAspect;
                dx = 0;
                dy = (height - dh) / 2;
            }

            ctx.drawImage(img, dx, dy, dw, dh);

            // Overlay Glowing Particles & Nutrients
            drawInteractiveEffects(dx, dy, dw, dh, time);

            // Overlay Interactive Hotspots
            drawHotspots(dx, dy, dw, dh, time);
        } else {
            // Loading State with Glowing Pulse
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 17px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('자료를 불러오는 중입니다.', width / 2, height / 2);
        }
    }

    function drawInteractiveEffects(dx, dy, dw, dh, time) {
        // 1. Bioluminescent Floating Nutrient Particles
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var px = dx + p.x * dw;
            var py = dy + p.y * dh;
            var currentSize = p.size * (1 + Math.sin(p.pulse) * 0.25);

            ctx.save();
            ctx.globalAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);
            ctx.shadowBlur = 12;
            ctx.shadowColor = p.color;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, currentSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 2. Swallowing Pulse Wave in Torso Scene
        if (currentSceneKey === 'torso' && isSwallowing) {
            // 그림에 머리가 없으므로 식도에서 시작한다.
            // 좌표는 digestion-hero-v2.webp 에 격자를 얹어 잰 기관 자리와 같다.
            var pathPoints = [
                { x: 0.723, y: 0.215 }, // 식도
                { x: 0.782, y: 0.400 }, // 위
                { x: 0.700, y: 0.497 }, // 십이지장
                { x: 0.700, y: 0.640 }, // 소장
                { x: 0.790, y: 0.600 }, // 대장
                { x: 0.712, y: 0.840 }  // 항문
            ];
            var seg = foodBolusProgress * (pathPoints.length - 1);
            var idx = Math.floor(seg);
            var frac = seg - idx;
            var p1 = pathPoints[idx] || pathPoints[0];
            var p2 = pathPoints[Math.min(idx + 1, pathPoints.length - 1)];

            var bx = dx + (p1.x + (p2.x - p1.x) * frac) * dw;
            var by = dy + (p1.y + (p2.y - p1.y) * frac) * dh;

            ctx.save();
            ctx.shadowBlur = 28;
            ctx.shadowColor = '#fbbf24';
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(bx, by, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function drawHotspots(dx, dy, dw, dh, time) {
        var spotList = hotspots[currentSceneKey] || [];
        for (var i = 0; i < spotList.length; i++) {
            var s = spotList[i];
            var sx = dx + s.x * dw;
            var sy = dy + s.y * dh;
            var pulseR = s.r + Math.sin(time * 0.003 + i) * 3;

            // Glowing Outer Ring
            ctx.save();
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#f59e0b';
            ctx.beginPath();
            ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
            ctx.stroke();

            // Center Pin Point
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
            ctx.fill();

            // Tag Label Pill
            var labelText = SimEngine.pinLabel(s);
            ctx.font = 'bold 13px Pretendard, sans-serif';
            var txtMetrics = ctx.measureText(labelText);
            var pillW = txtMetrics.width + 16;
            var pillH = 22;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(sx - pillW / 2, sy - 28, pillW, pillH, 6);
            } else {
                ctx.rect(sx - pillW / 2, sy - 28, pillW, pillH);
            }
            ctx.fill();
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, sx, sy - 17);
            ctx.restore();
        }
    }

    // ------------------------------------------------------------------------
    // Mouse / Touch Click Detection for Hotspots
    // ------------------------------------------------------------------------
    function bindDOM() {
        sceneBtns = document.querySelectorAll('[data-scene]');
        playPauseBtn = document.getElementById('playPauseBtn');
        swallowBtn = document.getElementById('swallowBtn');

        tempSlider = document.getElementById('tempSlider');
        tempValEl = document.getElementById('tempVal');
        phSlider = document.getElementById('phSlider');
        phValEl = document.getElementById('phVal');

        enzymeBtns = document.querySelectorAll('[data-enzyme]');
        nutrientBtns = document.querySelectorAll('[data-nutrient]');
        reagentBtns = document.querySelectorAll('[data-reagent]');
        heatBtn = document.getElementById('heatBtn');

        organFocusCard = document.getElementById('organFocusCard');
        organTitleEl = document.getElementById('organTitle');
        organEnzymeEl = document.getElementById('organEnzyme');
        organPHEl = document.getElementById('organPH');
        organProductEl = document.getElementById('organProduct');
        organDescEl = document.getElementById('organDesc');
        statEnzymeActivityEl = document.getElementById('statEnzymeActivity');
        reagentResultEl = document.getElementById('reagentResult');
        quizContainerEl = document.getElementById('quizContainer');

        sceneBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                sceneBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentSceneKey = btn.dataset.scene;
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        });

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function () {
                isRunning = !isRunning;
                playPauseBtn.innerHTML = isRunning ? '<span>⏸️</span> 일시정지' : '<span>▶️</span> 재생';
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        }

        if (swallowBtn) {
            swallowBtn.addEventListener('click', function () {
                // 다른 장면에서 눌러도 음식이 내려가는 것이 보이도록 전신 장면으로 보낸다
                var t = document.querySelector('.scene-btn[data-scene="torso"]');
                if (t && !t.classList.contains('active')) t.click();
                isSwallowing = true;
                foodBolusProgress = 0.0;
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        }

        if (canvas) {
            canvas.addEventListener('pointerdown', function (event) {
                var rect = canvas.getBoundingClientRect();
                var clickX = event.clientX - rect.left;
                var clickY = event.clientY - rect.top;

                var current = scenes[currentSceneKey];
                if (!current || !current.loaded || !current.img) return;

                var img = current.img;
                var imgAspect = img.width / img.height;
                var canvasAspect = width / height;
                var dw, dh, dx, dy;

                if (canvasAspect > imgAspect) {
                    dh = height; dw = height * imgAspect;
                    dx = (width - dw) / 2; dy = 0;
                } else {
                    dw = width; dh = width / imgAspect;
                    dx = 0; dy = (height - dh) / 2;
                }

                var spotList = hotspots[currentSceneKey] || [];
                for (var i = 0; i < spotList.length; i++) {
                    var s = spotList[i];
                    var sx = dx + s.x * dw;
                    var sy = dy + s.y * dh;
                    var dist = Math.hypot(clickX - sx, clickY - sy);

                    if (dist <= s.r + 20) {
                        displayHotspotCard(s);
                        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
                        break;
                    }
                }
            });
        }

        // Chemical Lab Controls
        if (tempSlider) {
            tempSlider.addEventListener('input', function () {
                tempC = parseInt(tempSlider.value, 10);
                if (tempValEl) tempValEl.textContent = tempC + ' ℃';
                updateLabMetrics();
            });
        }

        if (phSlider) {
            phSlider.addEventListener('input', function () {
                phVal = parseFloat(phSlider.value);
                if (phValEl) phValEl.textContent = 'pH ' + phVal.toFixed(1);
                updateLabMetrics();
            });
        }

        enzymeBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                enzymeBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                selectedEnzyme = btn.dataset.enzyme;
                updateLabMetrics();
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        });

        nutrientBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                nutrientBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                selectedNutrient = btn.dataset.nutrient;
                updateLabMetrics();
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        });

        reagentBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                reagentBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                activeReagent = btn.dataset.reagent;
                updateLabMetrics();
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        });

        if (heatBtn) {
            heatBtn.addEventListener('click', function () {
                isHeating = !isHeating;
                heatBtn.classList.toggle('active', isHeating);
                heatBtn.innerHTML = isHeating ? '<span>🔥</span> 가열 중' : '<span>♨️</span> 베네딕트 가열';
                updateLabMetrics();
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        }

        // Sidebar Tab Switcher
        var tabBtns = document.querySelectorAll('.sidebar-tab-btn');
        var tabPanels = document.querySelectorAll('.sidebar-tab-panel');
        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                tabPanels.forEach(function (p) { p.style.display = 'none'; });
                btn.classList.add('active');
                var targetId = 'tabPanel_' + btn.dataset.tab;
                var targetPanel = document.getElementById(targetId);
                if (targetPanel) targetPanel.style.display = 'block';
                if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
            });
        });
    }

    function displayHotspotCard(data) {
        if (organTitleEl) organTitleEl.textContent = data.title;
        if (organEnzymeEl) organEnzymeEl.textContent = data.enzyme;
        if (organPHEl) organPHEl.textContent = data.ph;
        if (organProductEl) organProductEl.textContent = data.product;
        if (organDescEl) organDescEl.textContent = data.desc;
        if (organFocusCard) organFocusCard.style.display = 'block';
    }

    // 시약이 잡아내는 영양소와, 반응했을 때 나오는 색
    var REAGENTS = {
        iodine:   { name: '아이오딘-아이오딘화 칼륨', target: 'starch',  color: '#3b2a6b', colorName: '청람색', needHeat: false },
        benedict: { name: '베네딕트',                 target: 'glucose', color: '#b91c1c', colorName: '황적색', needHeat: true  },
        biuret:   { name: '뷰렛',                     target: 'protein', color: '#7e22ce', colorName: '보라색', needHeat: false },
        sudan:    { name: '수단 Ⅲ',                   target: 'fat',     color: '#dc2626', colorName: '선홍색', needHeat: false }
    };

    var NUTRIENT_NAMES = { starch: '녹말', protein: '단백질', fat: '지방', glucose: '포도당' };

    /**
     * 시험관 색 판정. 전에는 시약 단추와 가열 단추가 값만 저장하고
     * 아무 데서도 읽히지 않아서 눌러도 아무 일이 없었다.
     */
    function updateReagentResult() {
        if (!reagentResultEl) return;

        var r = REAGENTS[activeReagent];
        if (!r) {
            reagentResultEl.textContent = '시약을 고르면 시험관 색이 나옵니다.';
            reagentResultEl.style.background = 'rgba(0, 0, 0, 0.35)';
            reagentResultEl.style.color = '#94a3b8';
            reagentResultEl.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            return;
        }

        var nutrientName = NUTRIENT_NAMES[selectedNutrient] || '?';
        var hit = (selectedNutrient === r.target);

        if (hit && r.needHeat && !isHeating) {
            reagentResultEl.textContent = nutrientName + ' + ' + r.name + ' ➔ 변화 없음. 베네딕트 반응은 가열해야 색이 납니다.';
            reagentResultEl.style.background = 'rgba(245, 158, 11, 0.15)';
            reagentResultEl.style.color = '#fcd34d';
            reagentResultEl.style.borderColor = '#f59e0b';
            return;
        }

        if (hit) {
            reagentResultEl.textContent = nutrientName + ' + ' + r.name + ' ➔ ' + r.colorName + '! ' + nutrientName + ' 있음 ✅';
            reagentResultEl.style.background = r.color;
            reagentResultEl.style.color = '#ffffff';
            reagentResultEl.style.borderColor = '#ffffff';
            return;
        }

        reagentResultEl.textContent = nutrientName + ' + ' + r.name + ' ➔ 색 변화 없음. ' +
            (activeReagent === 'benedict' ? '베네딕트 용액은 포도당·엿당 등과 가열하면 반응합니다.' : r.name + '은 ' + NUTRIENT_NAMES[r.target] + ' 검출에 사용합니다.');
        reagentResultEl.style.background = 'rgba(0, 0, 0, 0.35)';
        reagentResultEl.style.color = '#cbd5e1';
        reagentResultEl.style.borderColor = 'rgba(255, 255, 255, 0.18)';
    }

    function updateLabMetrics() {
        updateReagentResult();

        // 체온에서 일하는 효소라 최고점은 37℃다. 전에는 40℃가 꼭짓점이라
        // 정상 체온(37℃)에서도 86%밖에 안 나왔다.
        var tempFactor = 0;
        if (tempC <= 37) tempFactor = Math.pow(tempC / 37, 2);
        else if (tempC <= 60) tempFactor = Math.max(0, 1.0 - Math.pow((tempC - 37) / 23, 2));
        else tempFactor = 0;

        var optPH = 7.0;
        if (selectedEnzyme === 'pepsin') optPH = 2.0;
        else if (selectedEnzyme === 'trypsin' || selectedEnzyme === 'lipase') optPH = 8.0;

        var phDiff = Math.abs(phVal - optPH);
        var phFactor = Math.max(0, 1.0 - Math.pow(phDiff / 2.5, 2));

        var match = false;
        if (selectedEnzyme === 'amylase' && selectedNutrient === 'starch') match = true;
        if (selectedEnzyme === 'pepsin' && selectedNutrient === 'protein') match = true;
        if (selectedEnzyme === 'trypsin' && selectedNutrient === 'protein') match = true;
        if (selectedEnzyme === 'lipase' && selectedNutrient === 'fat') match = true;

        var act = match ? Math.round(tempFactor * phFactor * 100) : 0;
        var isDenatured = tempC > 60;

        if (statEnzymeActivityEl) {
            // 0%일 때 왜 0인지 밝혀 준다. 전에는 이유 없이 0 %만 떠서
            // 짝이 안 맞는 것인지 효소가 망가진 것인지 알 수 없었다.
            var why = '';
            if (isDenatured) why = ' (고온 변성 파괴 ⚠️)';
            else if (!match) why = ' (이 효소는 ' + (NUTRIENT_NAMES[selectedNutrient] || '?') + '을 분해하지 못합니다)';

            statEnzymeActivityEl.textContent = act + ' %' + why;
            statEnzymeActivityEl.style.color = act > 70 ? '#10b981' : (act > 25 ? '#f59e0b' : '#f87171');
        }
    }

    function renderSidebar() {
        if (typeof ExamData === 'undefined') return;
        var data = ExamData.digestion;
        if (!data) return;

        var trapListEl = document.getElementById('examTrapList');
        if (trapListEl) {
            var html = '';
            data.examTraps.forEach(function (t) {
                html += '<div class="exam-trap-box">' +
                    '<div class="exam-trap-badge"><span>⚡</span> ' + t.title + '</div>' +
                    '<div class="exam-trap-text">' + t.desc + '</div></div>';
            });
            trapListEl.innerHTML = html;
        }

        var conceptListEl = document.getElementById('conceptList');
        if (conceptListEl) {
            var html2 = '';
            data.checkpoints.forEach(function (c) {
                html2 += '<li class="concept-item"><span class="icon">📌</span><span>' + c + '</span></li>';
            });
            conceptListEl.innerHTML = html2;
        }

        if (quizContainerEl && data.quizzes && data.quizzes.length > 0 && typeof SimEngine !== 'undefined') {
            SimEngine.renderQuizSet(quizContainerEl, data.quizzes);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
