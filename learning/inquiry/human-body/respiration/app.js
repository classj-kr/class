/**
 * 2022 개정 교육과정 호흡계 & 가로막·폐포 실시간 시뮬레이터
 * High-Resolution Bioluminescent Visuals + 60fps Boyle's Law Diaphragm & Alveoli Gas Diffusion
 */

(function () {
    'use strict';

    var canvas, ctx;
    var width, height, dpr;
    var isRunning = true;
    var lastTime = 0;

    // High-Resolution Masterpiece Assets
    // 이 방의 장면은 모두 평면 도식 겹판이 맡는다. 캔버스는 어느 장면에서도 보이지 않는다.
    // 그런데 배경 사진 3장(583KB)을 계속 받아 놓고 한 번도 그리지 않았다. 뗀다.
    // 뗀 것: respiration-alveoli.webp, respiration-airway.webp, respiration-hero.webp
    var scenes = {};

    var currentSceneKey = 'alveoli';

    // Real-Time Physical & Physiological State
    var diaphragmPosition = 50; // 0 (Up/Exhale) ~ 100 (Down/Inhale)
    var breathRate = 16;        // 10 ~ 40 breaths/min
    var thoracicPressure = 760; // 757 ~ 763 mmHg

    // Particle Systems
    var gasParticles = [];

    // Hotspots
    var hotspots = {
        alveoli: [
            { x: 0.35, y: 0.35, r: 50, title: '폐포 - 기체 교환 표면', desc: '약 3~5억 개로 총 표면적이 약 100㎡(테니스 코트 크기)에 달해 모세혈관과의 기체 교환 효율을 극대화합니다.' },
            { x: 0.65, y: 0.65, r: 45, title: '모세혈관망 & 산소/이산화탄소 확산', desc: '분압차에 의한 확산으로 에너지를 쓰지 않고 산소는 혈액으로(104 ➔ 40 mmHg), 이산화탄소는 폐포로(46 ➔ 40 mmHg) 이동합니다.' }
        ],
        airway: [
            { x: 0.50, y: 0.25, r: 40, title: '기관', desc: '안쪽에 섬모와 점액이 있어 먼지와 세균을 걸러내는 원통형 기도.' },
            { x: 0.50, y: 0.55, r: 45, title: '기관지 분지', desc: '좌우 폐로 갈라져 수많은 세기관지로 뻗어 나가는 통로.' }
        ],
        hero: [
            { x: 0.50, y: 0.45, r: 50, title: '가로막 & 갈비뼈 호흡 운동', desc: '들숨: 가로막 하강 + 갈비뼈 상승 ➔ 흉강 부피 증가 ➔ 흉강 내압 감소 ➔ 공기 유입(보일 법칙).' }
        ]
    };

    // DOM Elements
    var sceneBtns, playPauseBtn;
    var diaphragmSlider, diaphragmValEl, rateSlider, rateValEl;
    var organDetailCard, organTitleEl, organDescEl;
    var statPressureEl, statVolumeEl;
    var quizContainerEl;

    function init() {
        canvas = document.getElementById('respirationCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        // Preload High-Res Masterpiece Images
        Object.keys(scenes).forEach(function (key) {
            var item = scenes[key];
            var img = new Image();
            img.src = item.src;
            img.onload = function () {
                item.img = img;
                item.loaded = true;
            };
        });

        initParticles();
        bindDOM();
        renderSidebar();
        showBreathMode();

        handleResize();
        window.addEventListener('resize', handleResize);

        requestAnimationFrame(renderLoop);
    }

    function initParticles() {
        gasParticles = [];
        for (var i = 0; i < 50; i++) {
            gasParticles.push({
                x: 0.25 + Math.random() * 0.55,
                y: 0.25 + Math.random() * 0.55,
                vx: (Math.random() - 0.5) * 0.002,
                vy: (Math.random() - 0.5) * 0.002,
                type: Math.random() > 0.5 ? 'o2' : 'co2',
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

    // Direct Canvas Drag State for Diaphragm Puller
    var isDraggingDiaphragm = false;
    var autoBreathing = true;   // 켜면 저절로 숨쉬고, 가로막을 직접 건드리면 꺼진다
    var dragStartY = 0;
    var airwayAirFlow = [];

    var cycleAngle = Math.PI / 2;
    var manualTarget = 50;
    var breathingState = BreathModel.state(50, 0);

    function showDiaphragmState() {
        if (!diaphragmValEl) return;
        diaphragmValEl.textContent = breathingState.phase === 'in' ? '내려가는 중' :
            breathingState.phase === 'out' ? '올라가는 중' : '위치 유지';
        diaphragmValEl.style.color = breathingState.phase === 'out' ? '#fbbf24' : '#7dd3fc';
    }

    function showBreathMode() {
        if (rateValEl) rateValEl.textContent = breathRate + ' 회/분 · ' + (autoBreathing ? '자동' : '수동');
    }

    function updateBreathingReadout() {
        showDiaphragmState();
        showBreathMode();
        if (statVolumeEl) statVolumeEl.textContent = Math.round(diaphragmPosition) + '% (모형의 상대 크기)';
        if (statPressureEl) statPressureEl.textContent = breathingState.phase === 'in' ? '대기압보다 낮음' :
            breathingState.phase === 'out' ? '대기압보다 높음' : '대기압과 같음';
    }

    function setBreathingPosition(value) {
        manualTarget = Math.max(0, Math.min(100, Number(value)));
        if (!Number.isFinite(manualTarget)) manualTarget = diaphragmPosition;
        autoBreathing = false;
        if (!isRunning) {
            diaphragmPosition = manualTarget;
            breathingState = BreathModel.state(diaphragmPosition, 0);
        }
        updateBreathingReadout();
    }

    window.RespirationBreathing = {
        getState: function () {
            return Object.assign({}, breathingState, { running: isRunning, automatic: autoBreathing, rate: breathRate });
        },
        setPosition: setBreathingPosition,
        startAuto: function () {
            cycleAngle = Math.acos(1 - 2 * diaphragmPosition / 100);
            autoBreathing = true;
            if (!isRunning && playPauseBtn) playPauseBtn.click();
            showBreathMode();
        }
    };

    function updatePhysics(dt, time) {
        if (autoBreathing && !isDraggingDiaphragm) {
            cycleAngle += dt * (breathRate / 60) * Math.PI * 2;
            breathingState = BreathModel.cycle(cycleAngle);
            diaphragmPosition = breathingState.position;
        } else {
            var previousPosition = diaphragmPosition;
            var gap = manualTarget - previousPosition;
            diaphragmPosition = Math.abs(gap) < 0.08 ? manualTarget :
                previousPosition + gap * (1 - Math.exp(-dt * 6));
            breathingState = BreathModel.state(diaphragmPosition,
                (diaphragmPosition - previousPosition) / Math.max(dt, 0.001) / 100);
        }
        if (diaphragmSlider && autoBreathing) diaphragmSlider.value = diaphragmPosition;
        // Qualitative alveolar pressure relative to atmosphere, not pleural pressure.
        thoracicPressure = 760 + breathingState.pressure;
        updateBreathingReadout();

        // Airway air flow particles driven by pressure differential
        var pDelta = 760 - thoracicPressure; // Positive = Inhale flow inward, Negative = Exhale flow outward
        if (Math.abs(pDelta) > 0.3) {
            if (airwayAirFlow.length < 35 && Math.random() < Math.abs(pDelta) * 0.3) {
                airwayAirFlow.push({
                    x: 0.50 + (Math.random() - 0.5) * 0.04,
                    y: pDelta > 0 ? 0.10 : 0.65,
                    vy: pDelta > 0 ? (Math.random() * 0.4 + 0.3) : -(Math.random() * 0.4 + 0.3),
                    type: pDelta > 0 ? 'o2' : 'co2',
                    life: 1.0
                });
            }
        }

        for (var f = airwayAirFlow.length - 1; f >= 0; f--) {
            var fl = airwayAirFlow[f];
            fl.y += fl.vy * dt;
            fl.life -= dt * 0.8;
            if (fl.life <= 0 || fl.y < 0.08 || fl.y > 0.75) airwayAirFlow.splice(f, 1);
        }

        // Particle brownian gas diffusion in alveoli
        for (var i = 0; i < gasParticles.length; i++) {
            var g = gasParticles[i];
            g.x += g.vx;
            g.y += g.vy;
            g.pulse += dt * 3;

            if (g.x < 0.2 || g.x > 0.85) g.vx *= -1;
            if (g.y < 0.2 || g.y > 0.85) g.vy *= -1;
        }
    }

    function drawScene(time) {
        ctx.clearRect(0, 0, width, height);

        var current = scenes[currentSceneKey];
        if (current && current.loaded && current.img) {
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

            ctx.drawImage(img, dx, dy, dw, dh);

            // Overlay Interactive Physical Simulation per Scene
            if (currentSceneKey === 'hero') {
                drawInteractiveBoyleLungModel(dx, dy, dw, dh, time);
            } else if (currentSceneKey === 'alveoli') {
                drawGasDiffusionOverlay(dx, dy, dw, dh, time);
            } else {
                drawAirwayFlowOverlay(dx, dy, dw, dh, time);
            }

            drawHotspots(dx, dy, dw, dh, time);
        } else {
            ctx.fillStyle = '#0a0f1d';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#06b6d4';
            ctx.font = 'bold 17px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚡ 호흡계 그림을 불러오는 중...', width / 2, height / 2);
        }
    }

    // ------------------------------------------------------------------------
    // Real Interactive Boyle's Law Diaphragm & Lung Balloons
    // ------------------------------------------------------------------------
    function drawInteractiveBoyleLungModel(dx, dy, dw, dh, time) {
        var cx = dx + 0.50 * dw;
        var topY = dy + 0.25 * dh;
        var bottomY = dy + 0.72 * dh;
        var lungScale = 0.55 + (diaphragmPosition / 100) * 0.70; // 0.55 (deflated) ~ 1.25 (inflated)

        // 1. Two Dynamic Lung Balloons (Left & Right)
        var leftLungX = cx - 55 * (dw / 800);
        var rightLungX = cx + 55 * (dw / 800);
        var lungCenterY = dy + 0.46 * dh;

        var lungColor = diaphragmPosition > 50 ? '#fda4af' : '#fb7185';
        var lungGlow = diaphragmPosition > 50 ? '#38bdf8' : '#f43f5e';

        // Draw Left Lung Balloon
        ctx.save();
        ctx.translate(leftLungX, lungCenterY);
        ctx.scale(lungScale, lungScale);
        ctx.shadowBlur = 18;
        ctx.shadowColor = lungGlow;
        ctx.fillStyle = lungColor;
        ctx.beginPath();
        ctx.ellipse(-10, 0, 36, 50, -0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw Right Lung Balloon
        ctx.save();
        ctx.translate(rightLungX, lungCenterY);
        ctx.scale(lungScale, lungScale);
        ctx.shadowBlur = 18;
        ctx.shadowColor = lungGlow;
        ctx.fillStyle = lungColor;
        ctx.beginPath();
        ctx.ellipse(10, 0, 36, 50, 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Airflow Inflow/Outflow Particles through Trachea
        for (var f = 0; f < airwayAirFlow.length; f++) {
            var fl = airwayAirFlow[f];
            var fx = dx + fl.x * dw;
            var fy = dy + fl.y * dh;

            ctx.save();
            ctx.shadowBlur = 12;
            ctx.shadowColor = fl.type === 'o2' ? '#38bdf8' : '#f59e0b';
            ctx.fillStyle = fl.type === 'o2' ? '#7dd3fc' : '#fcd34d';
            ctx.beginPath();
            ctx.arc(fx, fy, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 3. Curved Rubber Diaphragm Sheet at Bottom
        var diaphragmY = bottomY + (diaphragmPosition - 50) * 0.6 * (dh / 600);
        var curveControlY = bottomY + (diaphragmPosition - 50) * 1.1 * (dh / 600);

        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(cx - 130 * (dw / 800), bottomY);
        ctx.quadraticCurveTo(cx, curveControlY, cx + 130 * (dw / 800), bottomY);
        ctx.stroke();

        // 4. Draggable Diaphragm Pull Handle
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, curveControlY + 12, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Handle text prompt
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('↕️ 가로막 당기기', cx, curveControlY + 36);
        ctx.restore();
    }

    function drawAirwayFlowOverlay(dx, dy, dw, dh, time) {
        for (var f = 0; f < airwayAirFlow.length; f++) {
            var fl = airwayAirFlow[f];
            var fx = dx + fl.x * dw;
            var fy = dy + fl.y * dh;

            ctx.save();
            ctx.shadowBlur = 12;
            ctx.shadowColor = fl.type === 'o2' ? '#38bdf8' : '#f59e0b';
            ctx.fillStyle = fl.type === 'o2' ? '#7dd3fc' : '#fcd34d';
            ctx.beginPath();
            ctx.arc(fx, fy, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function drawGasDiffusionOverlay(dx, dy, dw, dh, time) {
        for (var i = 0; i < gasParticles.length; i++) {
            var g = gasParticles[i];
            var gx = dx + g.x * dw;
            var gy = dy + g.y * dh;

            ctx.save();
            if (g.type === 'o2') {
                ctx.fillStyle = '#38bdf8'; // O2 Oxygen (Cyan/Blue)
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 10;
            } else {
                ctx.fillStyle = '#f43f5e'; // CO2 (Reddish Violet)
                ctx.shadowColor = '#f43f5e';
                ctx.shadowBlur = 10;
            }

            ctx.beginPath();
            ctx.arc(gx, gy, 4.5, 0, Math.PI * 2);
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
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.75)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#06b6d4';
            ctx.beginPath();
            ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
            ctx.stroke();

            // Center Pin
            ctx.fillStyle = '#06b6d4';
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
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, sx, sy - 17);
            ctx.restore();
        }
    }

    function bindDOM() {
        sceneBtns = document.querySelectorAll('[data-scene]');
        playPauseBtn = document.getElementById('playPauseBtn');

        diaphragmSlider = document.getElementById('diaphragmSlider');
        diaphragmValEl = document.getElementById('diaphragmVal');
        rateSlider = document.getElementById('rateSlider');
        rateValEl = document.getElementById('rateVal');

        statPressureEl = document.getElementById('statPressure');
        statVolumeEl = document.getElementById('statVolume');

        organDetailCard = document.getElementById('organDetailCard');
        organTitleEl = document.getElementById('organTitle');
        organDescEl = document.getElementById('organDesc');
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

        if (diaphragmSlider) {
            diaphragmSlider.addEventListener('input', function () {
                setBreathingPosition(diaphragmSlider.value);
            });
        }

        if (rateSlider) {
            rateSlider.addEventListener('input', function () {
                breathRate = parseInt(rateSlider.value, 10);
                window.RespirationBreathing.startAuto();
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

                // Check Diaphragm Handle Drag in Hero Scene
                if (currentSceneKey === 'hero') {
                    var cx = dx + 0.50 * dw;
                    var bottomY = dy + 0.72 * dh;
                    var handleY = bottomY + (diaphragmPosition - 50) * 1.1 * (dh / 600) + 12;
                    var distHandle = Math.hypot(clickX - cx, clickY - handleY);

                    if (distHandle <= 40 || clickY > dy + 0.55 * dh) {
                        isDraggingDiaphragm = true;
                        autoBreathing = false;  // 손으로 잡는 순간 저절로 숨쉬기는 멈춘다
                        showBreathMode();
                        canvas.setPointerCapture(event.pointerId);
                        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playPulse();
                        return;
                    }
                }

                // Hotspot clicks
                var spotList = hotspots[currentSceneKey] || [];
                for (var i = 0; i < spotList.length; i++) {
                    var s = spotList[i];
                    var sx = dx + s.x * dw;
                    var sy = dy + s.y * dh;
                    var dist = Math.hypot(clickX - sx, clickY - sy);

                    if (dist <= s.r + 25) {
                        displayHotspotCard(s);
                        if (typeof SimEngine !== 'undefined' && SimEngine.SoundFX) SimEngine.SoundFX.playClick();
                        break;
                    }
                }
            });

            canvas.addEventListener('pointermove', function (event) {
                if (!isDraggingDiaphragm) return;
                var rect = canvas.getBoundingClientRect();
                var clickY = event.clientY - rect.top;

                var current = scenes[currentSceneKey];
                if (!current || !current.img) return;
                var img = current.img;
                var imgAspect = img.width / img.height;
                var canvasAspect = width / height;
                var dh = canvasAspect > imgAspect ? height : width / imgAspect;
                var dy = canvasAspect > imgAspect ? 0 : (height - dh) / 2;

                var minY = dy + 0.60 * dh;
                var maxY = dy + 0.88 * dh;
                var clampedY = Math.max(minY, Math.min(maxY, clickY));
                var newPos = ((clampedY - minY) / (maxY - minY)) * 100;

                diaphragmPosition = Math.round(newPos);
                if (diaphragmSlider) diaphragmSlider.value = diaphragmPosition;
                showDiaphragmState();
            });

            canvas.addEventListener('pointerup', function (event) {
                if (isDraggingDiaphragm) {
                    isDraggingDiaphragm = false;
                    try { canvas.releasePointerCapture(event.pointerId); } catch (e) {}
                }
            });

            canvas.addEventListener('pointercancel', function () {
                isDraggingDiaphragm = false;
            });
        }

        // Sidebar Tabs
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
        if (organDescEl) organDescEl.textContent = data.desc;
        if (organDetailCard) organDetailCard.style.display = 'block';
    }

    function renderSidebar() {
        if (typeof ExamData === 'undefined') return;
        var data = ExamData.respiration;
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
