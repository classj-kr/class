/**
 * 2022 개정 교육과정 면역계 & 인체 방어 작용 실시간 시뮬레이터
 * High-Resolution Canvas + 60fps Cellular Mechanics (식균, 항체 형성, 백신 1·2차 기억)
 */

(function () {
    'use strict';

    var canvas, ctx;
    var width, height, dpr;
    var isRunning = true;
    var lastTime = 0;

    // 이 방의 장면은 모두 평면 도식 겹판이 맡는다. 캔버스는 어느 장면에서도 보이지 않는다.
    // 그런데 배경 사진 4장(683KB)을 계속 받아 놓고 한 번도 그리지 않았다. 뗀다.
    // 뗀 것: immune-barrier.webp, immune-defense.webp, immune-hero.webp, immune-hero-v2.webp
    var scenes = {};
    var currentSceneKey = 'barrier';

    // Simulation Entities
    var pathogens = [];
    var whiteBloodCells = [];
    var antibodies = [];
    var particles = [];
    var lysozymeSparks = [];

    // Memory Curve State (Scene 4)
    var memorySimTime = 0; // Days: 0 ~ 60
    var isMemoryRunning = false;
    var memoryHistory = []; // { day, primaryAb, secondaryAb }
    var hasSecondaryTriggered = false;

    // Hotspots per Scene
    var hotspots = {
        barrier: [
            { x: 0.20, y: 0.35, r: 40, title: '피부 각질층', desc: '죽은 케라틴 세포층과 피지의 약산성(pH 5.5) 피지막이 병원체 침투를 1차로 물리적 차단합니다.' },
            { x: 0.50, y: 0.42, r: 45, title: '점막 & 섬모 운동', desc: '기도와 소화관의 점액이 병원체를 끈끈하게 포획하고, 섬모의 파도 운동으로 몸 밖으로 밀어냅니다.' },
            { x: 0.80, y: 0.40, r: 40, label: '라이소자임', title: '라이소자임 살균 효소', desc: '눈물, 침, 콧물에 포함되어 세균의 세포벽(펩티도글리칸)을 분해하여 세포를 터뜨려 죽입니다.' }
        ],
        innate: [
            { x: 0.25, y: 0.30, r: 45, title: '비만세포 & 히스타민 분비', desc: '상처 발생 시 히스타민을 분비하여 <strong>모세혈관을 확장</strong>시키고 혈류량을 늘려 염증(발적, 열감)을 유발합니다.' },
            { x: 0.48, y: 0.52, r: 50, title: '대식세포 식균 작용', desc: '위족을 뻗어 세균을 둘러싸 삼킨 뒤, 리소좀 효소로 소화 분해하는 핵심 비특이적 방어입니다.' },
            { x: 0.75, y: 0.45, r: 45, title: '호중구 혈관 탈출', desc: '혈관벽 내피 틈새를 뚫고 감염 조직으로 가장 먼저 달려오는 백혈구로, 강력한 식균 작용을 합니다.' }
        ],
        adaptive: [
            { x: 0.20, y: 0.45, r: 45, title: '항원 제시', desc: '대식세포나 수지상세포가 병원체를 삼킨 후 항원 조각을 세포 표면(MHC)에 띄워 보조 T세포에 전달합니다.' },
            { x: 0.42, y: 0.35, r: 45, title: '보조 T림프구', desc: '항원 정보를 인식하여 사이토카인을 분비, B림프구와 세포독성 T림프구를 총지휘하는 <strong>면역의 총사령관</strong>.' },
            { x: 0.65, y: 0.55, r: 45, label: 'B림프구', title: 'B림프구 ➔ 형질세포', desc: '보조 T세포의 신호로 분화하여 특정 항원에 꼭 맞는 <strong>Y자형 항체를 초당 2,000개씩 대량 분비</strong>합니다.' },
            { x: 0.82, y: 0.35, r: 40, title: '세포독성 T림프구', desc: '바이러스에 감염된 체세포나 암세포를 직접 접촉 파괴하는 <strong>세포성 면역</strong>의 주역입니다.' }
        ],
        memory: [
            { x: 0.25, y: 0.60, r: 45, title: '1차 면역 반응 & 잠복기', desc: '항원 첫 침입 시 항원 인식과 림프구 증식에 1~2주의 긴 잠복기가 필요하며, 항체 농도가 완만합니다.' },
            { x: 0.50, y: 0.45, r: 45, title: '기억 세포의 탄생', desc: '1차 침입 후 일부 T·B세포가 기억 세포로 남아 림프절에 장기간 보존됩니다.' },
            { x: 0.78, y: 0.30, r: 50, title: '2차 면역 반응 (폭발적 항체 생성)', desc: '동일 항원 재침입 시 <strong>잠복기 없이 즉각 대량의 형질세포로 분화</strong>하여 초고속·고농도 항체를 분비합니다(백신의 원리).' }
        ]
    };

    // DOM Elements
    var playPauseBtn;
    var pathogenCountEl, wbcCountEl, antibodyCountEl, clearanceRateEl, defenseProgressFillEl;
    var organTitleEl, organDescEl;
    var hudInstructionEl;

    function init() {
        canvas = document.getElementById('immuneCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        // Load scene assets
        Object.keys(scenes).forEach(function (key) {
            var item = scenes[key];
            var img = new Image();
            img.src = item.src;
            img.onload = function () {
                item.img = img;
                item.loaded = true;
            };
        });

        bindDOM();
        initSceneEntities(currentSceneKey);
        renderChecklist();
        renderTraps();
        renderQuizImmune();

        handleResize();
        window.addEventListener('resize', handleResize);

        requestAnimationFrame(renderLoop);
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

    // ------------------------------------------------------------------------
    // Entity Initialization per Scene
    // ------------------------------------------------------------------------
    function initSceneEntities(sceneKey) {
        pathogens = [];
        whiteBloodCells = [];
        antibodies = [];
        particles = [];
        lysozymeSparks = [];

        if (sceneKey === 'barrier') {
            // Cilia particles & trapped microbes
            for (var i = 0; i < 14; i++) {
                pathogens.push({
                    x: 0.1 + Math.random() * 0.8,
                    y: 0.15 + Math.random() * 0.25,
                    vx: (Math.random() - 0.5) * 0.02,
                    vy: 0.01 + Math.random() * 0.02,
                    radius: 7 + Math.random() * 4,
                    type: 'bacteria',
                    trapped: Math.random() > 0.4,
                    health: 1.0
                });
            }
        } else if (sceneKey === 'innate') {
            // Invading bacteria through cut
            for (var bi = 0; bi < 16; bi++) {
                pathogens.push({
                    x: 0.35 + Math.random() * 0.4,
                    y: 0.20 + Math.random() * 0.35,
                    vx: (Math.random() - 0.5) * 0.03,
                    vy: (Math.random() - 0.5) * 0.03,
                    radius: 8,
                    type: 'bacteria',
                    health: 1.0
                });
            }
            // Patrolling Macrophages
            for (var mi = 0; mi < 4; mi++) {
                whiteBloodCells.push({
                    x: 0.2 + mi * 0.2,
                    y: 0.65,
                    vx: (Math.random() - 0.5) * 0.02,
                    vy: -0.02,
                    radius: 24,
                    type: 'macrophage',
                    state: 'hunting',
                    target: null
                });
            }
        } else if (sceneKey === 'adaptive') {
            // Pathogens with distinct surface antigens
            for (var ai = 0; ai < 12; ai++) {
                pathogens.push({
                    x: 0.25 + Math.random() * 0.6,
                    y: 0.25 + Math.random() * 0.4,
                    vx: (Math.random() - 0.5) * 0.02,
                    vy: (Math.random() - 0.5) * 0.02,
                    radius: 10,
                    type: 'virus',
                    boundAntibodies: 0,
                    health: 1.0
                });
            }
            // Helper T and Plasma Cells
            whiteBloodCells.push({
                x: 0.42, y: 0.35, radius: 22, type: 'helperT', label: '보조 T세포'
            });
            whiteBloodCells.push({
                x: 0.68, y: 0.55, radius: 26, type: 'plasma', label: '형질세포'
            });
            whiteBloodCells.push({
                x: 0.82, y: 0.35, radius: 20, type: 'cytotoxic', label: '세포독성 T'
            });
        } else if (sceneKey === 'memory') {
            // Memory Curve Simulation Reset
            memorySimTime = 0;
            isMemoryRunning = true;
            hasSecondaryTriggered = false;
            memoryHistory = [];
        }

        updateTelemetry();
    }

    // ------------------------------------------------------------------------
    // Physics & Simulation Update Loop
    // ------------------------------------------------------------------------
    function updatePhysics(dt) {
        if (!isRunning) return;

        // 1. Barrier Scene: Mucociliary escalator and Lysozyme attack
        if (currentSceneKey === 'barrier') {
            for (var pi = pathogens.length - 1; pi >= 0; pi--) {
                var p = pathogens[pi];
                p.x += p.vx * dt;
                p.y += p.vy * dt;

                // If near mucosal surface, trap and sweep out
                if (p.y > 0.45) {
                    p.trapped = true;
                    p.vx = -0.08; // swept towards throat / cough
                    p.vy = -0.01;
                }

                // Random lysozyme enzyme strike
                if (Math.random() < 0.04) {
                    lysozymeSparks.push({
                        x: p.x,
                        y: p.y,
                        life: 1.0
                    });
                    p.health -= 0.15;
                    if (p.health <= 0) {
                        pathogens.splice(pi, 1);
                        if (typeof SimEngine !== 'undefined') SimEngine.SoundFX.playClick();
                    }
                }
            }

            // Update lysozyme sparks
            for (var li = lysozymeSparks.length - 1; li >= 0; li--) {
                var spark = lysozymeSparks[li];
                spark.life -= dt * 2.0;
                if (spark.life <= 0) lysozymeSparks.splice(li, 1);
            }
        }

        // 2. Innate Defense Scene: Macrophage hunting & Phagocytosis
        else if (currentSceneKey === 'innate') {
            for (var wi = 0; wi < whiteBloodCells.length; wi++) {
                var wbc = whiteBloodCells[wi];
                if (wbc.type === 'macrophage') {
                    // Find closest pathogen
                    var closest = null;
                    var minDist = 999;
                    for (var pj = 0; pj < pathogens.length; pj++) {
                        var pat = pathogens[pj];
                        var dx = pat.x - wbc.x;
                        var dy = pat.y - wbc.y;
                        var dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < minDist) {
                            minDist = dist;
                            closest = pat;
                        }
                    }

                    if (closest) {
                        // Move towards pathogen
                        var angle = Math.atan2(closest.y - wbc.y, closest.x - wbc.x);
                        wbc.x += Math.cos(angle) * 0.08 * dt;
                        wbc.y += Math.sin(angle) * 0.08 * dt;

                        // Swallow (Phagocytosis)!
                        if (minDist < 0.04) {
                            var pIndex = pathogens.indexOf(closest);
                            if (pIndex !== -1) {
                                pathogens.splice(pIndex, 1);
                                if (typeof SimEngine !== 'undefined') SimEngine.SoundFX.playPulse();

                                // Spurt engulfed sparkles
                                for (var k = 0; k < 6; k++) {
                                    particles.push({
                                        x: wbc.x,
                                        y: wbc.y,
                                        vx: (Math.random() - 0.5) * 0.1,
                                        vy: (Math.random() - 0.5) * 0.1,
                                        color: '#34d399',
                                        life: 0.8
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        // 3. Adaptive Immunity Scene: Antibody burst & Binding
        else if (currentSceneKey === 'adaptive') {
            // Antibodies fly towards pathogens
            for (var abi = antibodies.length - 1; abi >= 0; abi--) {
                var ab = antibodies[abi];
                ab.x += ab.vx * dt;
                ab.y += ab.vy * dt;

                // Check collision with pathogens
                for (var pk = 0; pk < pathogens.length; pk++) {
                    var tg = pathogens[pk];
                    var adx = tg.x - ab.x;
                    var ady = tg.y - ab.y;
                    if (Math.sqrt(adx * adx + ady * ady) < 0.035) {
                        tg.boundAntibodies = (tg.boundAntibodies || 0) + 1;
                        tg.health -= 0.25;
                        antibodies.splice(abi, 1);
                        break;
                    }
                }
            }

            // Remove neutralized pathogens
            for (var rm = pathogens.length - 1; rm >= 0; rm--) {
                if (pathogens[rm].health <= 0) {
                    pathogens.splice(rm, 1);
                    if (typeof SimEngine !== 'undefined') SimEngine.SoundFX.playCorrect();
                }
            }
        }

        // 4. Memory Scene: Day progression
        else if (currentSceneKey === 'memory' && isMemoryRunning) {
            memorySimTime += dt * 5.0; // 5 days per sec
            if (memorySimTime > 60) memorySimTime = 60;

            // Compute antibody titer curves (log scale)
            var t = memorySimTime;
            var primaryTiter = 0;
            if (t >= 7 && t <= 28) {
                // Primary response: lag 7 days, peaks at day 14 (titer 10), then declines
                primaryTiter = Math.sin((t - 7) / 21 * Math.PI) * 12;
            }

            var secondaryTiter = 0;
            if (hasSecondaryTriggered && t >= 30) {
                // Secondary response: virtually no lag, sky-rockets to titer 100+
                var dtSec = t - 30;
                if (dtSec < 20) {
                    secondaryTiter = Math.pow(dtSec / 5, 2.2) * 15;
                    if (secondaryTiter > 100) secondaryTiter = 100;
                } else {
                    secondaryTiter = 100 - (dtSec - 20) * 1.5;
                }
            }

            memoryHistory.push({
                day: t,
                primary: Math.max(0, primaryTiter),
                secondary: Math.max(0, secondaryTiter)
            });
        }

        // Update generic particles
        for (var partI = particles.length - 1; partI >= 0; partI--) {
            var pt = particles[partI];
            pt.x += pt.vx * dt;
            pt.y += pt.vy * dt;
            pt.life -= dt * 1.5;
            if (pt.life <= 0) particles.splice(partI, 1);
        }

        updateTelemetry();
    }

    // ------------------------------------------------------------------------
    // Canvas Rendering Loop
    // ------------------------------------------------------------------------
    var drawClock = 0;   // 멈춰 있는 동안은 흐르지 않는다

    function renderLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        var dt = Math.min((timestamp - lastTime) / 1000, 0.1);
        lastTime = timestamp;
        if (isRunning) drawClock += dt * 1000;

        updatePhysics(dt);
        drawScene(drawClock);

        requestAnimationFrame(renderLoop);
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

            // Overlay Scene-Specific Visuals
            if (currentSceneKey === 'barrier') {
                drawBarrierOverlay(dx, dy, dw, dh, time);
            } else if (currentSceneKey === 'innate') {
                drawInnateOverlay(dx, dy, dw, dh, time);
            } else if (currentSceneKey === 'adaptive') {
                drawAdaptiveOverlay(dx, dy, dw, dh, time);
            } else if (currentSceneKey === 'memory') {
                drawMemoryCurveOverlay(dx, dy, dw, dh, time);
            }

            drawHotspots(dx, dy, dw, dh, time);
        } else {
            ctx.fillStyle = '#0a0f1d';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#8b5cf6';
            ctx.font = 'bold 17px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🛡️ 면역계 그림을 불러오는 중...', width / 2, height / 2);
        }
    }

    // ------------------------------------------------------------------------
    // Scene Overlays
    // ------------------------------------------------------------------------
    function drawBarrierOverlay(dx, dy, dw, dh, time) {
        // 1. Waving Cilia on Epithelial Border
        var ciliaBaseY = dy + 0.52 * dh;
        ctx.save();
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        for (var cx = dx + 0.05 * dw; cx < dx + 0.95 * dw; cx += 12) {
            var wave = Math.sin(time * 0.006 + cx * 0.05) * 14;
            ctx.beginPath();
            ctx.moveTo(cx, ciliaBaseY);
            ctx.quadraticCurveTo(cx + wave * 0.5, ciliaBaseY - 15, cx + wave, ciliaBaseY - 30);
            ctx.stroke();
        }
        ctx.restore();

        // 2. Translucent Mucus Layer
        ctx.save();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fillRect(dx, ciliaBaseY - 36, dw, 40);
        ctx.restore();

        // 3. Pathogens
        pathogens.forEach(function (p) {
            var px = dx + p.x * dw;
            var py = dy + p.y * dh;
            ctx.save();
            ctx.fillStyle = p.trapped ? '#ef4444' : '#10b981';
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
            ctx.beginPath();
            ctx.arc(px, py, p.radius, 0, Math.PI * 2);
            ctx.fill();

            // Flagella / Pili
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 1.2;
            for (var a = 0; a < Math.PI * 2; a += Math.PI / 3) {
                ctx.beginPath();
                ctx.moveTo(px + Math.cos(a) * p.radius, py + Math.sin(a) * p.radius);
                ctx.lineTo(px + Math.cos(a) * (p.radius + 6), py + Math.sin(a) * (p.radius + 6));
                ctx.stroke();
            }
            ctx.restore();
        });

        // 4. Lysozyme Enzyme Sparks
        lysozymeSparks.forEach(function (s) {
            var sx = dx + s.x * dw;
            var sy = dy + s.y * dh;
            ctx.save();
            ctx.strokeStyle = '#facc15';
            ctx.shadowBlur = 16;
            ctx.shadowColor = '#facc15';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx - 10, sy); ctx.lineTo(sx + 10, sy);
            ctx.moveTo(sx, sy - 10); ctx.lineTo(sx, sy + 10);
            ctx.stroke();
            ctx.restore();
        });
    }

    function drawInnateOverlay(dx, dy, dw, dh, time) {
        // 1. Histamine Wave Rings (Inflammation)
        ctx.save();
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.35)';
        ctx.lineWidth = 2;
        var ringR = (time * 0.04) % 120;
        ctx.beginPath();
        ctx.arc(dx + 0.25 * dw, dy + 0.30 * dh, ringR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 2. Pathogens
        pathogens.forEach(function (p) {
            var px = dx + p.x * dw;
            var py = dy + p.y * dh;
            ctx.save();
            ctx.fillStyle = '#f43f5e';
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#f43f5e';
            ctx.beginPath();
            ctx.arc(px, py, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // 3. Amoeboid Macrophages
        whiteBloodCells.forEach(function (w) {
            var wx = dx + w.x * dw;
            var wy = dy + w.y * dh;
            ctx.save();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 18;
            ctx.shadowColor = '#38bdf8';

            // Amoeba undulating contour
            ctx.beginPath();
            var points = 10;
            for (var i = 0; i <= points; i++) {
                var th = (i / points) * Math.PI * 2;
                var rOffset = Math.sin(th * 3 + time * 0.005) * 6;
                var rx = wx + Math.cos(th) * (w.radius + rOffset);
                var ry = wy + Math.sin(th) * (w.radius + rOffset);
                if (i === 0) ctx.moveTo(rx, ry);
                else ctx.lineTo(rx, ry);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Nucleus
            ctx.fillStyle = '#1e3a8a';
            ctx.beginPath();
            ctx.arc(wx - 4, wy - 3, 7, 0, Math.PI * 2);
            ctx.fill();

            // Label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('대식세포', wx, wy + w.radius + 14);
            ctx.restore();
        });

        // 4. Burst Particles
        drawParticles(dx, dy, dw, dh);
    }

    function drawAdaptiveOverlay(dx, dy, dw, dh, time) {
        // 1. Cells
        whiteBloodCells.forEach(function (w) {
            var wx = dx + w.x * dw;
            var wy = dy + w.y * dh;
            ctx.save();
            var col = w.type === 'helperT' ? '#38bdf8' : (w.type === 'plasma' ? '#a855f7' : '#f43f5e');
            ctx.fillStyle = col;
            ctx.shadowBlur = 14;
            ctx.shadowColor = col;
            ctx.beginPath();
            ctx.arc(wx, wy, w.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13.5px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(w.label, wx, wy + w.radius + 14);
            ctx.restore();
        });

        // 2. Y-Shaped Antibodies
        antibodies.forEach(function (ab) {
            var ax = dx + ab.x * dw;
            var ay = dy + ab.y * dh;
            drawYAntibody(ax, ay, ab.angle, '#34d399');
        });

        // 3. Pathogens with bound antibodies
        pathogens.forEach(function (p) {
            var px = dx + p.x * dw;
            var py = dy + p.y * dh;
            ctx.save();
            ctx.fillStyle = p.health < 0.6 ? '#94a3b8' : '#f43f5e';
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
            ctx.beginPath();
            ctx.arc(px, py, p.radius, 0, Math.PI * 2);
            ctx.fill();

            // Draw locked Y-antibodies on virus surface
            var bound = p.boundAntibodies || 0;
            for (var b = 0; b < bound; b++) {
                var bAngle = (b / 4) * Math.PI * 2;
                var bx = px + Math.cos(bAngle) * (p.radius + 6);
                var by = py + Math.sin(bAngle) * (p.radius + 6);
                drawYAntibody(bx, by, bAngle + Math.PI, '#34d399');
            }
            ctx.restore();
        });
    }

    function drawYAntibody(x, y, angle, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;

        // Y stem
        ctx.beginPath();
        ctx.moveTo(0, 7);
        ctx.lineTo(0, 0);
        // Left arm
        ctx.lineTo(-6, -7);
        // Right arm
        ctx.moveTo(0, 0);
        ctx.lineTo(6, -7);
        ctx.stroke();
        ctx.restore();
    }

    function drawMemoryCurveOverlay(dx, dy, dw, dh, time) {
        // Semi-transparent graph overlay card
        var gw = Math.min(dw * 0.85, 640);
        var gh = Math.min(dh * 0.70, 320);
        var gx = dx + (dw - gw) / 2;
        var gy = dy + (dh - gh) / 2;

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 24;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.roundRect(gx, gy, gw, gh, 12);
        ctx.fill();
        ctx.stroke();

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px Pretendard, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('📈 항체 농도 변화 곡선 (1차 vs 2차 면역 반응 비교)', gx + 20, gy + 28);

        // Subtitle
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13.5px Pretendard, sans-serif';
        ctx.fillText('동일 항원이 재침입했을 때 기억 세포에 의해 잠복기 없이 폭발적으로 항체가 분비됩니다.', gx + 20, gy + 46);

        // Graph Plot Area
        var px = gx + 50;
        var py = gy + 65;
        var pw = gw - 70;
        var ph = gh - 100;

        // Axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, py + ph);
        ctx.lineTo(px + pw, py + ph);
        ctx.stroke();

        // Axis Labels
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12.5px Pretendard, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('항체 농도', px - 6, py + 12);
        ctx.textAlign = 'center';
        ctx.fillText('경과 시간 (일)', px + pw / 2, py + ph + 24);

        // Plot Memory History
        if (memoryHistory.length > 1) {
            // 1차 반응 (파란색 선)
            ctx.beginPath();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            for (var i = 0; i < memoryHistory.length; i++) {
                var pt = memoryHistory[i];
                var hx = px + (pt.day / 60) * pw;
                var hy = py + ph - (pt.primary / 100) * ph;
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.stroke();

            // 2차 반응 (보라/분홍색 폭발 선)
            if (hasSecondaryTriggered) {
                ctx.beginPath();
                ctx.strokeStyle = '#ec4899';
                ctx.lineWidth = 3.2;
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#ec4899';
                var started = false;
                for (var j = 0; j < memoryHistory.length; j++) {
                    var pt2 = memoryHistory[j];
                    if (pt2.day >= 30) {
                        var hx2 = px + (pt2.day / 60) * pw;
                        var hy2 = py + ph - (pt2.secondary / 100) * ph;
                        if (!started) {
                            ctx.moveTo(hx2, hy2);
                            started = true;
                        } else {
                            ctx.lineTo(hx2, hy2);
                        }
                    }
                }
                ctx.stroke();
            }
        }

        // Legend
        ctx.font = 'bold 13px Pretendard, sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('■ 1차 면역 반응 (긴 잠복기, 완만한 농도)', gx + 20, gy + gh - 12);
        ctx.fillStyle = '#ec4899';
        ctx.fillText('■ 2차 면역 반응 (기억세포 발동, 초고속·고농도 폭발)', gx + 240, gy + gh - 12);

        ctx.restore();
    }

    function drawParticles(dx, dy, dw, dh) {
        particles.forEach(function (pt) {
            ctx.save();
            ctx.fillStyle = pt.color;
            ctx.globalAlpha = pt.life;
            ctx.beginPath();
            ctx.arc(dx + pt.x * dw, dy + pt.y * dh, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    // ------------------------------------------------------------------------
    // Hotspots Rendering & Interaction
    // ------------------------------------------------------------------------
    function drawHotspots(dx, dy, dw, dh, time) {
        var list = hotspots[currentSceneKey] || [];
        list.forEach(function (spot) {
            var sx = dx + spot.x * dw;
            var sy = dy + spot.y * dh;

            ctx.save();
            var pulse = Math.sin(time * 0.006 + spot.x * 10) * 4;
            ctx.fillStyle = 'rgba(139, 92, 246, 0.35)';
            ctx.beginPath();
            ctx.arc(sx, sy, 16 + pulse, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#8b5cf6';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(sx, sy, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Label tag
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 1;
            var labelText = (typeof SimEngine !== 'undefined') ? SimEngine.pinLabel(spot) : spot.title;
            ctx.font = 'bold 13px Pretendard, sans-serif';
            var textW = ctx.measureText(labelText).width;
            var boxW = textW + 16;
            // 화면 가장자리에 있는 표시점은 이름표가 잘리므로 안쪽으로 당긴다
            var boxX = Math.min(Math.max(sx - boxW / 2, 4), width - 4 - boxW);
            var boxY = Math.min(sy + 14, height - 4 - 20);
            ctx.beginPath();
            ctx.roundRect(boxX, boxY, boxW, 20, 4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.fillText(labelText, boxX + boxW / 2, boxY + 14);
            ctx.restore();
        });
    }

    // ------------------------------------------------------------------------
    // DOM Bindings & Events
    // ------------------------------------------------------------------------
    function bindDOM() {
        playPauseBtn = document.getElementById('playPauseBtn');

        pathogenCountEl = document.getElementById('pathogenCount');
        wbcCountEl = document.getElementById('wbcCount');
        antibodyCountEl = document.getElementById('antibodyCount');
        clearanceRateEl = document.getElementById('clearanceRate');
        defenseProgressFillEl = document.getElementById('defenseProgressFill');

        organTitleEl = document.getElementById('organTitle');
        organDescEl = document.getElementById('organDesc');
        hudInstructionEl = document.getElementById('hudInstruction');

        // Scene buttons
        var sceneBtns = document.querySelectorAll('.scene-btn');
        sceneBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var sceneKey = btn.dataset.scene;
                switchScene(sceneKey);
            });
        });

        // Sidebar Tabs
        var tabBtns = document.querySelectorAll('.sidebar-tab-btn');
        tabBtns.forEach(function (tb) {
            tb.addEventListener('click', function () {
                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                tb.classList.add('active');
                var tabKey = tb.dataset.tab;
                document.querySelectorAll('.sidebar-tab-panel').forEach(function (p) {
                    p.style.display = 'none';
                });
                var targetPanel = document.getElementById('tabPanel_' + tabKey);
                if (targetPanel) targetPanel.style.display = 'block';
                if (typeof SimEngine !== 'undefined') SimEngine.SoundFX.playClick();
            });
        });

        // 1차 침입 단추 — 그래프 장면으로 보낸다
        var firstBtn = document.getElementById('firstInfectBtn');
        if (firstBtn) {
            firstBtn.addEventListener('click', function () {
                var g = document.querySelector('.scene-btn[data-scene="graph"]');
                if (g) g.click();
                if (typeof SimEngine !== 'undefined') SimEngine.SoundFX.playPulse();
            });
        }

        // Secondary Infection Button
        var secBtn = document.getElementById('secondaryInfectBtn');
        if (secBtn) {
            secBtn.addEventListener('click', function () {
                // 그래프 장면으로 보낸다. 단추를 실제로 눌러야 덧그림이 따라온다.
                var g = document.querySelector('.scene-btn[data-scene="graph"]');
                if (g) g.click();
                hasSecondaryTriggered = true;
                memorySimTime = 30; // jump to reinfection
                if (typeof SimEngine !== 'undefined') SimEngine.SoundFX.playCorrect();
            });
        }

        // Play / Pause
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function () {
                isRunning = !isRunning;
                playPauseBtn.innerHTML = isRunning ? '<span>⏸️</span> 일시정지' : '<span>▶️</span> 재생';
                if (typeof SimEngine !== 'undefined') SimEngine.SoundFX.playClick();
            });
        }

        // Canvas click hotspot inspection
        if (canvas) {
            canvas.addEventListener('click', function (e) {
                var rect = canvas.getBoundingClientRect();
                var cx = (e.clientX - rect.left);
                var cy = (e.clientY - rect.top);

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

                var list = hotspots[currentSceneKey] || [];
                list.forEach(function (spot) {
                    var sx = dx + spot.x * dw;
                    var sy = dy + spot.y * dh;
                    var dist = Math.sqrt((cx - sx) * (cx - sx) + (cy - sy) * (cy - sy));
                    if (dist < 30) {
                        if (organTitleEl) organTitleEl.textContent = spot.title;
                        if (organDescEl) organDescEl.innerHTML = spot.desc;
                        if (typeof SimEngine !== 'undefined') SimEngine.SoundFX.playClick();
                    }
                });
            });
        }
    }

    function switchScene(sceneKey) {
        currentSceneKey = sceneKey;
        // 없는 장면 키가 오면 표시를 건드리지 않는다.
        // 건드리면 지금 켜진 장면의 표시까지 풀려 화면이 빈다.
        if (document.querySelector('.scene-btn[data-scene="' + sceneKey + '"]')) {
            document.querySelectorAll('.scene-btn').forEach(function (b) {
                b.classList.toggle('active', b.dataset.scene === sceneKey);
            });
        }

        initSceneEntities(sceneKey);

        if (hudInstructionEl) {
            if (sceneKey === 'barrier') {
                hudInstructionEl.innerHTML = '점액과 섬모 운동, 눈물의 <strong>라이소자임</strong>이 세균을 분해하여 체내 유입을 막습니다.';
            } else if (sceneKey === 'innate') {
                hudInstructionEl.innerHTML = '상처로 세균이 들어오면 비만세포의 <strong>히스타민</strong> 분비로 혈관이 확장되고 <strong>대식세포가 식균 작용</strong>을 펼칩니다.';
            } else if (sceneKey === 'adaptive') {
                hudInstructionEl.innerHTML = '우측 상단 <strong>[면역 방어 가동]</strong>을 눌러 형질세포에서 <strong>Y자형 맞춤 항체</strong>를 대량 분비해 항원을 무력화하세요.';
            } else if (sceneKey === 'memory') {
                hudInstructionEl.innerHTML = '하단 <strong>[2차 감염 유발]</strong>을 눌러 기억 세포가 잠복기 없이 폭발적 항체를 분비하는 백신의 원리를 확인하세요.';
            }
        }

        if (typeof SimEngine !== 'undefined') SimEngine.SoundFX.playClick();
    }

    function updateTelemetry() {
        if (pathogenCountEl) pathogenCountEl.textContent = pathogens.length + ' 마리';
        if (wbcCountEl) wbcCountEl.textContent = whiteBloodCells.length + ' 개';
        if (antibodyCountEl) antibodyCountEl.textContent = antibodies.length + ' 개';

        var total = pathogens.length + 10;
        var cleared = Math.max(0, 10 - pathogens.length);
        var rate = Math.round((cleared / 10) * 100);
        if (rate > 100) rate = 100;
        if (rate < 0) rate = 0;

        if (clearanceRateEl) clearanceRateEl.textContent = rate + '%';
        if (defenseProgressFillEl) defenseProgressFillEl.style.width = rate + '%';
    }

    function renderChecklist() {
        if (typeof ExamData === 'undefined' || !ExamData.immune) return;
        var listEl = document.getElementById('conceptList');
        if (!listEl) return;
        var html = '';
        ExamData.immune.checkpoints.forEach(function (cp) {
            html += '<li>' + cp + '</li>';
        });
        listEl.innerHTML = html;
    }

    function renderTraps() {
        if (typeof ExamData === 'undefined' || !ExamData.immune) return;
        var box = document.getElementById('examTrapList');
        if (!box) return;
        var html = '';
        ExamData.immune.examTraps.forEach(function (trap) {
            html += '<div class="exam-trap-item">';
            html += '<div class="exam-trap-title">' + trap.title + '</div>';
            html += '<p class="exam-trap-desc">' + trap.desc + '</p>';
            html += '</div>';
        });
        box.innerHTML = html;
    }

    function renderQuizImmune() {
        if (typeof ExamData === 'undefined' || typeof SimEngine === 'undefined') return;
        var box = document.getElementById('quizContainer');
        var data = ExamData.immune;
        if (!box || !data || !data.quizzes) return;
        SimEngine.renderQuizSet(box, data.quizzes);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
