(function syncSpaceViewportHeight() {
    // The nav tabs float over the viewport instead of reserving a header
    // row, so the simulation card no longer needs to subtract its height.
    document.documentElement.style.setProperty('--space-header-height', '0px');
})();

(function initSubtleDiurnalNightSky() {
    function seededRandom(seed) {
        let value = seed >>> 0;
        return function random() {
            value = (value * 1664525 + 1013904223) >>> 0;
            return value / 4294967296;
        };
    }

    function render() {
        const canvas = document.getElementById('diurnalAmbientStars');
        if (!canvas || !canvas.parentElement) return;
        const width = Math.max(1, canvas.parentElement.clientWidth);
        const height = Math.max(1, canvas.parentElement.clientHeight);
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const random = seededRandom(20260731);
        const count = Math.max(58, Math.min(128, Math.round(width * height / 14500)));
        for (let i = 0; i < count; i++) {
            const x = random() * width;
            const y = random() * height;
            const radius = 0.28 + Math.pow(random(), 2.6) * 0.62;
            const alpha = 0.035 + Math.pow(random(), 2.2) * 0.12;
            const warm = random() > 0.91;
            ctx.fillStyle = warm
                ? `rgba(255,231,196,${alpha.toFixed(3)})`
                : `rgba(213,228,255,${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function start() {
        const canvas = document.getElementById('diurnalAmbientStars');
        if (!canvas) return;
        render();
        if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
            new ResizeObserver(render).observe(canvas.parentElement);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
    window.addEventListener('resize', render, { passive: true });
})();

// Sub-Tab Navigation handled by global window.switchMainTab(targetTab)

                        // Mode 1: Zodiac (황도 12궁 & 지구 공전) Engine
                        (function() {
            const zodiacConstellations = [
                { month: 1, name: "쌍둥이자리", emoji: "👯", date: "5/21~6/21",
                  story: "죽음도 갈라놓지 못한 우애 깊은 쌍둥이 형제 카스토르와 폴룩스의 신화입니다. 1월 한밤중 남쪽 하늘에서 나란히 빛나는 두 형제가 높이 남중합니다. (반면 1월 낮 태양 위치인 궁수자리는 햇빛에 가려 보이지 않습니다!)",
                  stars: [[20, -40], [20, -10], [35, 35], [5, 40], [-15, -35], [-15, -5], [-5, 45], [-30, 40], [5, -20]],
                  lines: [[0, 1], [1, 2], [1, 3], [1, 8], [4, 5], [5, 6], [5, 7], [5, 8]] },
                { month: 2, name: "게자리", emoji: "🦀", date: "6/22~7/22",
                  story: "영웅 헤라클레스가 히드라와 겨룰 때 발목을 물었던 거대 게의 신화입니다. 2월 한밤중 남쪽 하늘에서 가장 높게 남중하여 밤새도록 아주 잘 보입니다.",
                  stars: [[0, 0], [-5, -20], [-25, 25], [30, 20]],
                  lines: [[0, 1], [0, 2], [0, 3]] },
                { month: 3, name: "사자자리", emoji: "🦁", date: "7/23~8/22",
                  story: "네메아 골짜기의 무적 사자 신화입니다. 3월 한밤중 남쪽 하늘에서 으뜸 1등성 레굴루스(Regulus)와 낫 모양 머리가 위엄 있게 남중합니다.",
                  stars: [[30, 25], [40, 5], [35, -15], [20, -25], [10, -15], [-15, -10], [-15, 20], [-45, 0]],
                  lines: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 6], [6, 7], [7, 5], [5, 2]] },
                { month: 4, name: "처녀자리", emoji: "🧚‍♀️", date: "8/23~9/22",
                  story: "정의의 여신 아스트라이아 전설입니다. 4월 한밤중 남쪽 하늘에서 청백색 1등성 스피카(Spica)와 함께 봄철 대표 길잡이 별자리로 남중합니다.",
                  stars: [[30, -35], [20, -20], [10, -5], [-10, -20], [-30, -30], [20, 15], [-15, 10], [-5, 45], [25, 40]],
                  lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [2, 6], [5, 6], [6, 7], [5, 8]] },
                { month: 5, name: "천칭자리", emoji: "⚖️", date: "9/23~10/23",
                  story: "정의의 여신이 인간의 선악을 달던 황금 저울입니다. 5월 한밤중 남쪽 하늘에서 다이아몬드 저울판 형상으로 남중합니다.",
                  stars: [[0, -25], [25, 15], [-25, 15], [45, -5]],
                  lines: [[0, 1], [0, 2], [1, 2], [1, 3], [0, 3]] },
                { month: 6, name: "전갈자리", emoji: "🦂", date: "10/24~11/21",
                  story: "사냥꾼 오리온을 벌하기 위해 보낸 무적의 전갈 신화입니다. 6월 하지 무렵 한밤중 남쪽 하늘에서 붉은 초거성 안타레스(Antares) 심장과 J자형 독침 꼬리가 남중합니다.",
                  stars: [[15, 0], [30, -20], [35, -5], [30, 10], [5, 20], [-5, 35], [-20, 45], [-35, 40], [-45, 25], [-25, 15]],
                  lines: [[1, 2], [2, 3], [2, 0], [0, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]] },
                { month: 7, name: "궁수자리", emoji: "🏹", date: "11/22~12/21",
                  story: "현자 케이론이 활을 당기는 모습의 신화입니다. 7월 한밤중 남쪽 하늘에서 은하수 한가운데 찻주전자(Teapot) 모양으로 남중합니다.",
                  stars: [[40, 0], [25, -5], [10, -20], [-5, -5], [15, 25], [-15, 20], [-25, 0], [-30, 15]],
                  lines: [[1, 2], [2, 3], [3, 1], [1, 4], [4, 5], [5, 3], [1, 0], [4, 0], [3, 6], [6, 7], [7, 5]] },
                { month: 8, name: "염소자리", emoji: "🐐", date: "12/22~1/19",
                  story: "목신 판(Pan)이 물고기로 도망치다 상반신은 염소, 하반신은 물고기로 어설프게 변신한 신화입니다. 8월 한밤중 남쪽 하늘에서 역삼각형 해마 모양으로 남중합니다.",
                  stars: [[35, -25], [25, -15], [-35, -20], [-10, 35], [5, 40], [-25, 5]],
                  lines: [[0, 1], [1, 4], [4, 3], [3, 5], [5, 2], [2, 0]] },
                { month: 9, name: "물병자리", emoji: "🏺", date: "1/20~2/18",
                  story: "가장 아름다운 미소년 가니메데스가 영생의 술을 따르는 물병 신화입니다. 9월 추분 무렵 한밤중 남쪽 하늘에서 Y자형 물항아리와 물줄기 형상으로 남중합니다.",
                  stars: [[35, -25], [20, -30], [15, -15], [30, -10], [20, 5], [0, 20], [-20, 10], [-15, 35], [-35, 30], [-30, 50]],
                  lines: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]] },
                { month: 10, name: "물고기자리", emoji: "🐟", date: "2/19~3/20",
                  story: "아프로디테와 에로스 모자가 발목을 끈으로 묶고 도망친 숭고한 모성애 신화입니다. 10월 한밤중 남쪽 하늘에서 V자 끈으로 묶인 두 물고기 형상이 남중합니다.",
                  stars: [[0, 45], [15, 20], [25, -5], [40, -15], [30, -30], [45, -40], [55, -25], [-15, 25], [-30, 10], [-45, 0], [-60, -10], [-50, -25], [-35, -15]],
                  lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3], [0, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 9]] },
                { month: 11, name: "양자리", emoji: "🐏", date: "3/21~4/19",
                  story: "위기에 처한 남매를 구하기 위해 제우스가 보낸 황금 털 날개 양 신화입니다. 11월 한밤중 남쪽 하늘에서 알파성 하말(Hamal)과 뿔 곡선 모양으로 남중합니다.",
                  stars: [[20, -15], [0, -5], [-10, 10], [-25, 25]],
                  lines: [[0, 1], [1, 2], [2, 3]] },
                { month: 12, name: "황소자리", emoji: "🐂", date: "4/20~5/20",
                  story: "제우스가 에우로파 공주를 위해 눈처럼 흰 순한 황소로 변신한 신화입니다. 12월 동지 무렵 한밤중 남쪽 하늘에서 붉은 알데바란 눈, V자 얼굴, 길게 뻗은 두 뿔 및 묘성 성단이 남중합니다.",
                  stars: [[-15, 5], [-5, 15], [5, 25], [15, 15], [25, 0], [-30, -35], [40, -45]],
                  lines: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [4, 6]] }
            ];

            let zScene, zCamera, zRenderer, zControls;
            let zEarth, zEarthTiltReference, zEarthSpinGroup, zEarthGlobe, zSun, zOrbitPath;
            let zMidLine, zSunLine, zMidText, zSunText;
            let zObserverMarker;
            let zSeasonPickTargets = [];
            const zodiacMotionState = {
                playing: false,
                speed: 1,
                lastFrame: performance.now(),
                timeAnchor: 24
            };

            function createZodiacLabelSprite(text, color, width = 160, height = 20, fontSize = 32) {
                const cvs = document.createElement('canvas');
                cvs.width = 1024;
                cvs.height = 128;
                const ctx = cvs.getContext('2d');
                ctx.fillStyle = color;
                ctx.font = `900 ${fontSize}px 'Noto Sans KR', sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0,0,0,0.95)';
                ctx.shadowBlur = 8;
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'rgba(2,6,23,0.9)';
                ctx.strokeText(text, 512, 64);
                ctx.fillText(text, 512, 64);
                const tex = new THREE.CanvasTexture(cvs);
                const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false });
                const sprite = new THREE.Sprite(mat);
                sprite.scale.set(width, height, 1);
                sprite.renderOrder = 99999;
                return sprite;
            }

            function createZodiacSeasonIconSprite(icon, glowColor) {
                const cvs = document.createElement('canvas');
                cvs.width = 256;
                cvs.height = 256;
                const ctx = cvs.getContext('2d');
                ctx.clearRect(0, 0, 256, 256);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '164px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
                ctx.shadowColor = glowColor;
                ctx.shadowBlur = 22;
                ctx.fillText(icon, 128, 136);
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
                ctx.fillText(icon, 128, 136);

                const texture = new THREE.CanvasTexture(cvs);
                const material = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 1,
                    alphaTest: 0.04,
                    depthTest: true,
                    depthWrite: false,
                    toneMapped: false
                });
                const sprite = new THREE.Sprite(material);
                sprite.scale.set(10, 10, 1);
                sprite.renderOrder = -100;
                return sprite;
            }

            function createZodiacEarthTexture() {
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 256;
                const ctx = canvas.getContext('2d');
                const ocean = ctx.createLinearGradient(0, 0, 0, 256);
                ocean.addColorStop(0, '#0b4f85');
                ocean.addColorStop(0.5, '#0876b8');
                ocean.addColorStop(1, '#063963');
                ctx.fillStyle = ocean;
                ctx.fillRect(0, 0, 512, 256);

                // A stable teaching texture: recognizable land masses make rotation visible.
                ctx.fillStyle = '#43a85b';
                const lands = [
                    [82, 78, 54, 27, -0.25], [126, 118, 31, 52, 0.18],
                    [245, 74, 62, 28, 0.08], [275, 123, 36, 58, -0.12],
                    [342, 92, 70, 31, 0.18], [397, 137, 34, 20, -0.15],
                    [465, 174, 31, 17, 0.12]
                ];
                lands.forEach(([x, y, rx, ry, rotation]) => {
                    ctx.beginPath();
                    ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.fillStyle = 'rgba(126, 211, 120, 0.72)';
                [[55, 110, 22], [204, 103, 19], [322, 65, 22], [430, 93, 16]].forEach(([x, y, r]) => {
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.fillStyle = 'rgba(241,245,249,.92)';
                ctx.fillRect(0, 0, 512, 12);
                ctx.fillRect(0, 244, 512, 12);
                const texture = new THREE.CanvasTexture(canvas);
                if (THREE.sRGBEncoding !== undefined) texture.encoding = THREE.sRGBEncoding;
                return texture;
            }

            function createZodiacAxisGuideSprite() {
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;
                const ctx = canvas.getContext('2d');
                const tilt = THREE.MathUtils.degToRad(23.5);
                const halfLength = 188;
                const dx = Math.sin(tilt) * halfLength;
                const dy = Math.cos(tilt) * halfLength;

                ctx.clearRect(0, 0, 512, 512);
                ctx.save();
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 6;
                ctx.setLineDash([18, 10]);
                ctx.shadowColor = 'rgba(56,189,248,.85)';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.moveTo(256 - dx, 256 + dy);
                ctx.lineTo(256 + dx, 256 - dy);
                ctx.stroke();
                ctx.restore();

                ctx.font = '900 34px "Noto Sans KR", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.lineWidth = 8;
                ctx.strokeStyle = 'rgba(2,6,23,.95)';
                ctx.fillStyle = '#7dd3fc';
                const labelX = 256 + dx + 18;
                const labelY = 256 - dy - 8;
                ctx.strokeText('23.5°', labelX, labelY);
                ctx.fillText('23.5°', labelX, labelY);

                const texture = new THREE.CanvasTexture(canvas);
                const material = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    depthTest: false,
                    depthWrite: false,
                    toneMapped: false
                });
                const sprite = new THREE.Sprite(material);
                sprite.scale.set(34, 34, 1);
                sprite.renderOrder = 100000;
                return sprite;
            }

            function initThreeZodiac() {
                const container = document.getElementById('zodiac3dContainer');
                const canvas = document.getElementById('zodiac3dCanvas');
                if (!container || !canvas) return;

                const width = container.clientWidth > 0 ? container.clientWidth : 800;
                const height = container.clientHeight > 0 ? container.clientHeight : 600;

                // Cleanup previous instance if re-initialized
                if (zRenderer) {
                    zRenderer.dispose();
                }

                zScene = new THREE.Scene();
                zScene.background = new THREE.Color(0x020617);
                zSeasonPickTargets = [];

                zCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
                zCamera.position.set(0, 300, 450);

                zRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
                zRenderer.setSize(width, height);
                zRenderer.setPixelRatio(window.devicePixelRatio);

                zControls = new THREE.OrbitControls(zCamera, zRenderer.domElement);
                zControls.enableDamping = true;
                zControls.dampingFactor = 0.05;
                zControls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera going below ground
                zControls.minDistance = 200;
                zControls.maxDistance = 800;

                // Lighting
                zScene.add(new THREE.AmbientLight(0xffffff, 0.4));
                const pointLight = new THREE.PointLight(0xfbbf24, 2.5, 1000);
                zScene.add(pointLight);

                // Sun
                const sunGeo = new THREE.SphereGeometry(18, 32, 32);
                const sunMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
                zSun = new THREE.Mesh(sunGeo, sunMat);
                zScene.add(zSun);

                // Sun Glow
                const glowGeo = new THREE.SphereGeometry(24, 32, 32);
                const glowMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.3 });
                zScene.add(new THREE.Mesh(glowGeo, glowMat));

                // Orbit Path (radius 80)
                const orbitCurve = new THREE.EllipseCurve(0, 0, 80, 80, 0, 2 * Math.PI, false, 0);
                const orbitPoints = orbitCurve.getPoints(128);
                const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
                const orbitMat = new THREE.LineDashedMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, dashSize: 5, gapSize: 5 });
                zOrbitPath = new THREE.Line(orbitGeo, orbitMat);
                zOrbitPath.rotation.x = -Math.PI / 2;
                zOrbitPath.computeLineDistances();
                zScene.add(zOrbitPath);

                // Cylinder Floor Indicator
                const floorCurve = new THREE.EllipseCurve(0, 0, 260, 260, 0, 2 * Math.PI, false, 0);
                const floorPoints = floorCurve.getPoints(128);
                const floorGeo = new THREE.BufferGeometry().setFromPoints(floorPoints);
                const floorMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.1 });
                const floorLine = new THREE.Line(floorGeo, floorMat);
                floorLine.rotation.x = -Math.PI / 2;
                zScene.add(floorLine);

                // Earth system: revolution → fixed 23.5° tilt → daily spin.
                // This mirrors the solar-calendar Earth & Moon simulator hierarchy.
                zEarth = new THREE.Group();
                zScene.add(zEarth);

                const tilt = THREE.MathUtils.degToRad(23.5);
                zEarthTiltReference = new THREE.Group();
                zEarthTiltReference.rotation.z = -tilt;
                zEarth.add(zEarthTiltReference);

                zEarthSpinGroup = new THREE.Group();
                zEarthTiltReference.add(zEarthSpinGroup);

                const earthGeo = new THREE.SphereGeometry(8, 32, 32);
                const earthMat = new THREE.MeshStandardMaterial({
                    map: createZodiacEarthTexture(),
                    roughness: 0.62,
                    emissive: 0x021c2d,
                    emissiveIntensity: 0.25
                });
                zEarthGlobe = new THREE.Mesh(earthGeo, earthMat);
                zEarthSpinGroup.add(zEarthGlobe);

                const atmosphere = new THREE.Mesh(
                    new THREE.SphereGeometry(8.55, 32, 32),
                    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.16, side: THREE.BackSide })
                );
                zEarthGlobe.add(atmosphere);

                const equatorLine = new THREE.Mesh(
                    new THREE.TorusGeometry(8.12, 0.055, 8, 96),
                    new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0.9 })
                );
                equatorLine.rotation.x = Math.PI / 2;
                zEarthGlobe.add(equatorLine);

                // Keep the physical tilt in 3D, but draw its teaching guide as a
                // camera-facing sprite. Perspective can no longer make 23.5° look
                // vertical when Earth reaches the left or right side of its orbit.
                zEarth.add(createZodiacAxisGuideSprite());

                // Cute observer wearing the same yellow hat used in the other space labs.
                zObserverMarker = new THREE.Group();
                const observerMat = new THREE.MeshBasicMaterial({ color: 0xef4444, depthTest: true, depthWrite: true });
                const hatMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, depthTest: true, depthWrite: true });
                const skinMat = new THREE.MeshBasicMaterial({ color: 0xfde68a, depthTest: true, depthWrite: true });

                const observerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.8, 1.8, 16), observerMat);
                observerBody.position.y = 1.05;
                const observerHead = new THREE.Mesh(new THREE.SphereGeometry(0.72, 16, 16), skinMat);
                observerHead.position.y = 2.45;
                const observerBrim = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.18, 0.14, 20), hatMat);
                observerBrim.position.y = 2.95;
                const observerCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.65, 20), hatMat);
                observerCrown.position.y = 3.3;
                [observerBody, observerHead, observerBrim, observerCrown].forEach(part => {
                    zObserverMarker.add(part);
                });
                zObserverMarker.scale.setScalar(2.15);
                zEarthGlobe.add(zObserverMarker);

                const latRad = THREE.MathUtils.degToRad(37.5);
                const observerNormal = new THREE.Vector3(0, Math.sin(latRad), -Math.cos(latRad)).normalize();
                zObserverMarker.position.copy(observerNormal.clone().multiplyScalar(8.2));
                zObserverMarker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), observerNormal);

                // Four seasonal reference points on Earth's orbit.
                [
                    { month: 3, icon: '🌸', label: '춘분 3/21', color: '#fb7185' },
                    { month: 6, icon: '☀️', label: '하지 6/21', color: '#facc15' },
                    { month: 9, icon: '🍁', label: '추분 9/23', color: '#fb923c' },
                    { month: 12, icon: '❄️', label: '동지 12/22', color: '#60a5fa' }
                ].forEach(season => {
                    const angle = -(season.month - 1) * 30 * Math.PI / 180;
                    const px = 80 * Math.sin(angle);
                    const pz = -80 * Math.cos(angle);

                    const icon = createZodiacSeasonIconSprite(season.icon, season.color);
                    icon.position.set(px, 2.2, pz);
                    icon.userData.seasonJump = season;
                    icon.userData.baseScale = 10;
                    zSeasonPickTargets.push(icon);
                    zScene.add(icon);

                    const marker = createZodiacLabelSprite(season.label, season.color, 64, 12, 62);
                    marker.position.set(px, 15, pz);
                    marker.material.depthTest = true;
                    marker.renderOrder = -100;
                    zScene.add(marker);
                });

                // Click an equinox/solstice icon to move Earth to that orbital point.
                const seasonRaycaster = new THREE.Raycaster();
                const seasonPointer = new THREE.Vector2();
                let seasonPointerDown = null;

                function pickZodiacSeason(event) {
                    const rect = canvas.getBoundingClientRect();
                    seasonPointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
                    seasonPointer.y = -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
                    seasonRaycaster.setFromCamera(seasonPointer, zCamera);
                    const hits = seasonRaycaster.intersectObjects(zSeasonPickTargets, false);
                    return hits.length ? hits[0].object : null;
                }

                function pauseZodiacForSeasonJump() {
                    zodiacMotionState.playing = false;
                    window.zodiacPlaying = false;
                    const playButton = document.getElementById('zodiacPlayBtn');
                    if (playButton) {
                        playButton.textContent = '▶ 재생';
                        playButton.style.background = 'rgba(251,191,36,.18)';
                        playButton.style.color = '#fbbf24';
                    }
                }

                function jumpToZodiacSeason(season) {
                    const monthSlider = document.getElementById('zodiacMonthSlider');
                    if (!season || !monthSlider) return;
                    pauseZodiacForSeasonJump();
                    window.currentZodiacMonth = season.month;
                    monthSlider.value = String(season.month);
                    window.updateZodiacUI();
                }

                canvas.addEventListener('pointerdown', event => {
                    seasonPointerDown = { x: event.clientX, y: event.clientY };
                });
                canvas.addEventListener('pointermove', event => {
                    if (seasonPointerDown) return;
                    canvas.style.cursor = pickZodiacSeason(event) ? 'pointer' : 'grab';
                });
                canvas.addEventListener('pointerup', event => {
                    const start = seasonPointerDown;
                    seasonPointerDown = null;
                    canvas.style.cursor = 'grab';
                    if (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) return;
                    const icon = pickZodiacSeason(event);
                    if (icon && icon.userData.seasonJump) jumpToZodiacSeason(icon.userData.seasonJump);
                });
                canvas.addEventListener('pointerleave', () => {
                    seasonPointerDown = null;
                    canvas.style.cursor = 'grab';
                });

                // Sightlines
                const matMid = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 });
                const matSun = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.7 });
                zMidLine = new THREE.Line(new THREE.BufferGeometry(), matMid);
                zSunLine = new THREE.Line(new THREE.BufferGeometry(), matSun);
                zScene.add(zMidLine);
                zScene.add(zSunLine);

                // Canvas Texture Generator for Panels
                function createZodiacTexture(z) {
                    const cvs = document.createElement('canvas');
                    cvs.width = 512;
                    cvs.height = 512;
                    const ctx = cvs.getContext('2d');

                    ctx.clearRect(0, 0, 512, 512);

                    ctx.save();
                    ctx.translate(256, 180); // Center stars a bit higher
                    const scale = 2.2;

                    if (z.stars) {
                        ctx.strokeStyle = "rgba(255,255,255,0.4)";
                        ctx.lineWidth = 3;
                        z.lines.forEach(idx => {
                            const p1 = z.stars[idx[0]];
                            const p2 = z.stars[idx[1]];
                            ctx.beginPath();
                            ctx.moveTo(p1[0]*scale, p1[1]*scale);
                            ctx.lineTo(p2[0]*scale, p2[1]*scale);
                            ctx.stroke();
                        });

                        z.stars.forEach(p => {
                            ctx.beginPath();
                            ctx.arc(p[0]*scale, p[1]*scale, 5, 0, 2*Math.PI);
                            ctx.fillStyle = "#fbbf24";
                            ctx.shadowColor = "#fbbf24";
                            ctx.shadowBlur = 12;
                            ctx.fill();
                            ctx.shadowBlur = 0;
                        });
                    }
                    ctx.restore();

                    ctx.fillStyle = "white";
                    ctx.font = "bold 44px 'Noto Sans KR', sans-serif";
                    ctx.textAlign = "center";
                    ctx.shadowColor = "rgba(0,0,0,0.8)";
                    ctx.shadowBlur = 6;
                    ctx.fillText(z.name, 256, 420);

                    ctx.fillStyle = "#94a3b8";
                    ctx.font = "bold 28px 'Noto Sans KR', sans-serif";
                    ctx.fillText(z.date || '', 256, 470);

                    const texture = new THREE.CanvasTexture(cvs);
                    texture.anisotropy = zRenderer.capabilities.getMaxAnisotropy();
                    return texture;
                }

                // Create 12 Panels (radius 260)
                zodiacConstellations.forEach((z, i) => {
                    const tex = createZodiacTexture(z);
                    const planeGeo = new THREE.PlaneGeometry(160, 160);
                    const planeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
                    const plane = new THREE.Mesh(planeGeo, planeMat);

                    const angle = -i * 30 * Math.PI / 180; // CCW: 1=Gemini(Top/-Z)
                    const px = 260 * Math.sin(angle);
                    const pz = -260 * Math.cos(angle);

                    plane.position.set(px, 40, pz);
                    plane.lookAt(0, 40, 0); // Front face points to center

                    zScene.add(plane);
                });

                // Text Sprites for Lasers
                zMidText = createZodiacLabelSprite("선택 별자리 방향 (관측)", "#38bdf8");
                zSunText = createZodiacLabelSprite("이달의 황도 별자리 (안 보임)", "#fbbf24");
                zScene.add(zMidText);
                zScene.add(zSunText);

                // Handle resize
                window.addEventListener('resize', () => {
                    if (zRenderer && zCamera && container) {
                        const w = container.clientWidth;
                        const h = container.clientHeight;
                        zCamera.aspect = w / h;
                        zCamera.updateProjectionMatrix();
                        zRenderer.setSize(w, h);
                    }
                });
            }

            window.currentZodiacMonth = 1.0;
            window.currentZodiacTime = 24;
            window.zodiacPlaying = false;

            window.updateZodiacUI = function updateZodiacUI() {
                const monthSlider = document.getElementById('zodiacMonthSlider');
                const monthBadge = document.getElementById('zodiacMonthBadge');
                const monthDisplay = document.getElementById('zodiacCurrentMonth');
                const monthDisplay2 = document.getElementById('zodiacCurrentMonth2');
                const bigMonthDisplay = document.getElementById('zodiacMonthDisplay');
                const txtSunConst = document.getElementById('zodiacSunConst');
                const txtMidConst = document.getElementById('zodiacMidConst');
                const storyTitle = document.getElementById('zodiacStoryTitle');
                const storyDesc = document.getElementById('zodiacStoryDesc');
                const skyGroup = document.getElementById('zodiacSkyConstellation');
                const timeSlider = document.getElementById('zodiacTimeSlider');
                const timeBadge = document.getElementById('zodiacTimeBadge');
                const skyMotionState = document.getElementById('zodiacSkyMotionState');
                const observationState = document.getElementById('zodiacObservationState');

                if (!monthSlider) return;
                const monthVal = parseFloat(monthSlider.value) || window.currentZodiacMonth || 1.0;
                let monthBase = Math.floor(monthVal + 0.3);
                if (monthBase < 1) monthBase = 12;
                if (monthBase > 12) monthBase = 1;

                if (monthBadge) monthBadge.textContent = `${monthBase}월`;
                if (monthDisplay) monthDisplay.textContent = `${monthBase}월`;
                if (monthDisplay2) monthDisplay2.textContent = `${monthBase}월`;
                const engMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                if (bigMonthDisplay) bigMonthDisplay.textContent = `${monthBase}월 (${engMonths[monthBase-1]})`;

                // A separate time control demonstrates diurnal motion in the observer's sky.
                // 18:00 rises in the east, 24:00 culminates in the south, 06:00 sets in the west.
                // Keep the high-precision simulation clock authoritative while playing.
                // The range input rounds values to its 0.05-hour step, which used to
                // erase every small 0.2x update and made playback appear frozen.
                const timeVal = Number.isFinite(window.currentZodiacTime)
                    ? window.currentZodiacTime
                    : (timeSlider ? parseFloat(timeSlider.value) : 24);
                window.currentZodiacTime = Number.isFinite(timeVal) ? timeVal : 24;
                const totalMinutes = Math.round(window.currentZodiacTime * 60);
                const displayHour = Math.floor(totalMinutes / 60) % 24;
                const displayMinute = totalMinutes % 60;
                const timeText = `${String(displayHour).padStart(2, '0')}:${String(displayMinute).padStart(2, '0')}`;
                const nightProgress = Math.max(0, Math.min(1, (window.currentZodiacTime - 18) / 12));
                const skyX = 45 + 410 * nightProgress;
                const skyY = 265 - 125 * Math.sin(Math.PI * nightProgress);
                const edgeScale = 0.82 + 0.38 * Math.sin(Math.PI * nightProgress);
                let motionText = '남중';
                if (window.currentZodiacTime < 22.5) motionText = '동쪽에서 떠오르는 중';
                else if (window.currentZodiacTime > 25.5) motionText = '서쪽으로 지는 중';
                if (timeBadge) timeBadge.textContent = timeText;
                if (skyMotionState) {
                    skyMotionState.textContent = `${timeText} · ${motionText}`;
                    skyMotionState.setAttribute('x', String(skyX));
                    skyMotionState.setAttribute('y', String(Math.max(55, skyY - 58)));
                }
                if (observationState) observationState.textContent = `${timeText} ${motionText}`;
                if (skyGroup) skyGroup.setAttribute('transform', `translate(${skyX.toFixed(1)}, ${skyY.toFixed(1)}) scale(${edgeScale.toFixed(3)})`);

                // Update Earth & Lasers
                const orbitAngle = -(monthVal - 1) * 30 * Math.PI / 180;
                const ex = 80 * Math.sin(orbitAngle);
                const ez = -80 * Math.cos(orbitAngle);

                if (zEarth) zEarth.position.set(ex, 0, ez);

                // The same time value drives Earth's eastward rotation and the right-hand sky.
                // At 24:00 the Korean observer faces away from the Sun; six hours later
                // Earth has rotated 90° and the selected constellation approaches the west.
                if (zEarthSpinGroup) {
                    const elapsedFromMidnight = window.currentZodiacTime - 24;
                    // Earth rotates west-to-east. Match the positive spin convention used
                    // by the solar-calendar Earth & Moon simulator.
                    zEarthSpinGroup.rotation.y = -orbitAngle + THREE.MathUtils.degToRad(elapsedFromMidnight * 15);
                }

                if (zMidLine && zSunLine) {
                    const mx = 260 * Math.sin(orbitAngle);
                    const mz = -260 * Math.cos(orbitAngle);
                    let observationStart = new THREE.Vector3(ex, 0, ez);
                    if (zObserverMarker && zEarth) {
                        zEarth.updateMatrixWorld(true);
                        observationStart = zObserverMarker.getWorldPosition(new THREE.Vector3());
                    }
                    zMidLine.geometry.setFromPoints([observationStart, new THREE.Vector3(mx, 0, mz)]);

                    const sx = 260 * Math.sin(orbitAngle + Math.PI);
                    const sz = -260 * Math.cos(orbitAngle + Math.PI);
                    zSunLine.geometry.setFromPoints([new THREE.Vector3(ex, 0, ez), new THREE.Vector3(sx, 0, sz)]);

                    if (zMidText) zMidText.position.set(mx + 20*Math.sin(orbitAngle), 30, mz - 20*Math.cos(orbitAngle));
                    if (zSunText) zSunText.position.set(sx + 20*Math.sin(orbitAngle + Math.PI), 30, sz - 20*Math.cos(orbitAngle + Math.PI));
                }

                // Update right panel info
                const zData = zodiacConstellations[monthBase - 1];
                if (zData) {
                    if (txtSunConst) txtSunConst.textContent = zData.sunConst || (monthBase >= 7 ? zodiacConstellations[monthBase-7].name : zodiacConstellations[monthBase>6?monthBase-7:monthBase+5].name);
                    if (txtMidConst) txtMidConst.textContent = zData.name;
                    if (storyTitle) storyTitle.innerHTML = `<span style="font-size:24px;">${zData.emoji}</span> <span style="color:#fbbf24;">${zData.name}</span>`;
                    if (storyDesc && zData.story) storyDesc.innerHTML = zData.story;

                    if (skyGroup) {
                        skyGroup.innerHTML = '';
                        if (zData.stars) {
                            zData.lines.forEach(lineIdx => {
                                const p1 = zData.stars[lineIdx[0]];
                                const p2 = zData.stars[lineIdx[1]];
                                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                                line.setAttribute("x1", p1[0]);
                                line.setAttribute("y1", p1[1]);
                                line.setAttribute("x2", p2[0]);
                                line.setAttribute("y2", p2[1]);
                                line.setAttribute("stroke", "#38bdf8");
                                line.setAttribute("stroke-width", "2");
                                skyGroup.appendChild(line);
                            });

                            zData.stars.forEach(p => {
                                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                                circle.setAttribute("cx", p[0]);
                                circle.setAttribute("cy", p[1]);
                                circle.setAttribute("r", "5.5");
                                circle.setAttribute("fill", "#fbbf24");
                                circle.setAttribute("style", "filter: drop-shadow(0 0 8px rgba(251,191,36,0.9));");
                                skyGroup.appendChild(circle);
                            });
                        }
                    }
                }
            };

            const speedSlider = document.getElementById('zodiacSpeedSlider');
            const speedBadge = document.getElementById('zodiacSpeedBadge');
            const monthSlider = document.getElementById('zodiacMonthSlider');
            const timeSlider = document.getElementById('zodiacTimeSlider');
            const playBtn = document.getElementById('zodiacPlayBtn');

            if (monthSlider) {
                monthSlider.addEventListener('input', function() {
                    window.currentZodiacMonth = parseFloat(this.value);
                    zodiacMotionState.playing = false;
                    window.zodiacPlaying = false;
                    if (playBtn) {
                        playBtn.textContent = '▶ 재생';
                        playBtn.style.background = 'rgba(251,191,36,.18)';
                        playBtn.style.color = '#fbbf24';
                    }
                    updateZodiacUI();
                });
            }

            if (speedSlider) {
                speedSlider.addEventListener('input', function() {
                    const spd = parseFloat(this.value);
                    // Re-anchor so the new speed only applies going forward.
                    zodiacMotionState.lastFrame = performance.now();
                    zodiacMotionState.timeAnchor = window.currentZodiacTime;
                    zodiacMotionState.speed = spd;
                    if (speedBadge) speedBadge.textContent = spd.toFixed(1) + 'x';
                });
            }

            if (timeSlider) {
                timeSlider.addEventListener('input', function() {
                    window.currentZodiacTime = parseFloat(this.value);
                    zodiacMotionState.playing = false;
                    window.zodiacPlaying = false;
                    if (playBtn) {
                        playBtn.textContent = '▶ 재생';
                        playBtn.style.background = 'rgba(251,191,36,.18)';
                        playBtn.style.color = '#fbbf24';
                    }
                    updateZodiacUI();
                });
            }

            if (playBtn) {
                playBtn.addEventListener('click', function() {
                    if (!zodiacMotionState.playing && window.currentZodiacTime >= 29.99 && timeSlider) {
                        window.currentZodiacTime = 18;
                        timeSlider.value = '18';
                        updateZodiacUI();
                    }
                    zodiacMotionState.playing = !zodiacMotionState.playing;
                    zodiacMotionState.lastFrame = performance.now();
                    zodiacMotionState.timeAnchor = window.currentZodiacTime;
                    window.zodiacPlaying = zodiacMotionState.playing;
                    this.textContent = zodiacMotionState.playing ? '⏸ 일시정지' : '▶ 재생';
                    this.style.background = zodiacMotionState.playing ? '#0ea5e9' : 'rgba(251,191,36,.18)';
                    this.style.color = zodiacMotionState.playing ? '#fff' : '#fbbf24';
                });
            }

            function animateZodiacOrbit(now) {
                if (zodiacMotionState.playing && timeSlider) {
                    // Derive the simulated time from real elapsed time since the last
                    // anchor (play started / speed changed) rather than accumulating
                    // per-frame deltas. Accumulating with a clamped per-frame delta
                    // silently drops time whenever frames are delayed or throttled
                    // (backgrounded tab, laptop power saving, etc.), and at low speed
                    // (e.g. 0.2x) each frame's contribution is already so small that
                    // the dropped time made playback look completely frozen while
                    // higher speeds stayed visibly ahead of that noise floor.
                    // Learning-paced motion: at 1x, one simulated hour passes per
                    // real second (a full 12-hour path takes 12 seconds).
                    const elapsedSeconds = Math.max(0, (now - zodiacMotionState.lastFrame) / 1000);
                    window.currentZodiacTime = zodiacMotionState.timeAnchor + elapsedSeconds * zodiacMotionState.speed;
                    if (window.currentZodiacTime >= 30) {
                        window.currentZodiacTime = 30;
                        zodiacMotionState.playing = false;
                        window.zodiacPlaying = false;
                        if (playBtn) {
                            playBtn.textContent = '▶ 다시 재생';
                            playBtn.style.background = 'rgba(251,191,36,.18)';
                            playBtn.style.color = '#fbbf24';
                        }
                    }
                    timeSlider.value = window.currentZodiacTime;
                    updateZodiacUI();
                }
                if (zControls) zControls.update();
                if (zRenderer && zScene && zCamera) {
                    zRenderer.render(zScene, zCamera);
                }
                requestAnimationFrame(animateZodiacOrbit);
            }

            // Allow tab switching to re-ini
            window.addEventListener('simModeChanged', (e) => {
                if(e.detail.mode === 'zodiac') {
                    if(!zRenderer) {
                        initThreeZodiac();
                        updateZodiacUI();
                        zodiacMotionState.lastFrame = performance.now();
                        zodiacMotionState.timeAnchor = window.currentZodiacTime;
                        requestAnimationFrame(animateZodiacOrbit);
                    } else {
                        // resize
                        const container = document.getElementById('zodiac3dContainer');
                        if(container) {
                            zCamera.aspect = container.clientWidth / container.clientHeight;
                            zCamera.updateProjectionMatrix();
                            zRenderer.setSize(container.clientWidth, container.clientHeight);
                        }
                    }
                }
            });

            // Initial ini
            window.resetZodiacOrbit = function resetZodiacOrbit() {
                window.currentZodiacMonth = 5;
                window.currentZodiacTime = 24;
                window.zodiacPlaying = false;
                zodiacMotionState.playing = false;
                zodiacMotionState.speed = 1;
                zodiacMotionState.lastFrame = performance.now();
                zodiacMotionState.timeAnchor = window.currentZodiacTime;
                if (monthSlider) monthSlider.value = '5';
                if (timeSlider) timeSlider.value = '24';
                if (speedSlider) speedSlider.value = '1';
                if (speedBadge) speedBadge.textContent = '1.0x';
                if (playBtn) {
                    playBtn.textContent = '▶ 재생';
                    playBtn.style.background = 'rgba(251,191,36,.18)';
                    playBtn.style.color = '#fbbf24';
                }
                updateZodiacUI();
            };
            initThreeZodiac();
            updateZodiacUI();
            zodiacMotionState.lastFrame = performance.now();
            zodiacMotionState.timeAnchor = window.currentZodiacTime;
            requestAnimationFrame(animateZodiacOrbit);
        })();

// Northern-sky diurnal rotation around Polaris
        window.currentAngle = 0;
        window.diurnalSpeed = 1.0;
        window.diurnalPlaying = true;
        window.diurnalLinesOn = true;

        (function() {
            const textConfig = [
                { id: 'textSpring', initX: 180, initY: 98 },
                { id: 'textAutumn', initX: 375, initY: 392 }
            ];

            window.updateDiurnalUI = function updateUI() {
                const rotationGroup = document.getElementById('starRotationGroup');
                if (isNaN(window.currentAngle)) window.currentAngle = 0;

                // 1. Rotate Star Constellation Lines & Dots
                if (rotationGroup) {
                    rotationGroup.setAttribute('transform', `rotate(${-window.currentAngle} 250 250)`);
                }

                // 2. Compute Rotated Coordinates for Text Labels to keep them 100% Upright & Horizontal!
                const rad = -window.currentAngle * (Math.PI / 180);
                textConfig.forEach(cfg => {
                    const el = document.getElementById(cfg.id);
                    if (el) {
                        const dx = cfg.initX - 250;
                        const dy = cfg.initY - 250;
                        const nx = 250 + dx * Math.cos(rad) - dy * Math.sin(rad);
                        const ny = 250 + dx * Math.sin(rad) + dy * Math.cos(rad);
                        el.setAttribute('x', nx);
                        el.setAttribute('y', ny);
                    }
                });

            };

            function animateDiurnal() {
                if (window.diurnalPlaying && window.diurnalSpeed > 0) {
                    window.currentAngle += 0.2 * window.diurnalSpeed;
                    window.updateDiurnalUI();
                }
                requestAnimationFrame(animateDiurnal);
            }
            requestAnimationFrame(animateDiurnal);

            // Bind Control Elements
            const stPlayBtn = document.getElementById('stPlayBtn');
            const stResetBtn = document.getElementById('stResetBtn');
            const stSpeedSlider = document.getElementById('stSpeedSlider');
            const stSpeedValBadge = document.getElementById('stSpeedValBadge');
            const stLinesToggleBtn = document.getElementById('stLinesToggleBtn');

            if (stPlayBtn) {
                stPlayBtn.onclick = function() {
                    window.diurnalPlaying = !window.diurnalPlaying;
                    if (window.diurnalPlaying) {
                        this.textContent = '⏸️ 자동 회전: ON';
                        this.style.background = 'rgba(56, 189, 248, 0.25)';
                        this.style.color = '#38bdf8';
                        this.style.borderColor = '#38bdf8';
                    } else {
                        this.textContent = '▶️ 자동 회전: 일시정지';
                        this.style.background = 'rgba(251, 191, 36, 0.2)';
                        this.style.color = '#fbbf24';
                        this.style.borderColor = '#fbbf24';
                    }
                };
            }

            if (stResetBtn) {
                stResetBtn.onclick = function() {
                    // 1. Reset Mode 3 (3D Celestial Sphere) Camera, Controls & Observer State
                    if (window.reset3DCelestialView) {
                        window.reset3DCelestialView();
                    }

                    // 2. Reset Mode 2 (Diurnal Constellations)
                    window.currentAngle = 0;
                    if (window.updateDiurnalUI) window.updateDiurnalUI();

                    // 3. Reset Mode 1 (Zodiac Orbit Angle)
                    if (window.resetZodiacOrbit) window.resetZodiacOrbit();

                    // 4. Reset Mode 4 (Compare Sliders)
                    if (window.resetCompareSliders) window.resetCompareSliders();
                };
            }

            if (stSpeedSlider) {
                stSpeedSlider.oninput = function() {
                    window.diurnalSpeed = parseFloat(this.value);
                    if (stSpeedValBadge) {
                        stSpeedValBadge.textContent = (window.diurnalSpeed === 0) ? '0.0x (정지)' : window.diurnalSpeed.toFixed(1) + 'x';
                    }
                };
            }

            if (stLinesToggleBtn) {
                stLinesToggleBtn.onclick = function() {
                    window.diurnalLinesOn = !window.diurnalLinesOn;
                    this.textContent = `⭐ 별자리 선 표시: ${window.diurnalLinesOn ? 'ON' : 'OFF'}`;
                    const rotationGroup = document.getElementById('starRotationGroup');
                    if (rotationGroup) {
                        const polylines = rotationGroup.querySelectorAll('polyline, polygon, line');
                        polylines.forEach(p => {
                            p.style.display = window.diurnalLinesOn ? 'block' : 'none';
                        });
                    }
                };
            }
        })();

// Mode 4: Diurnal vs Annual Motion Interactive JS Engine
        (function() {
            const diurnalSlider = document.getElementById('diurnalSlider');
            const diurnalRotGroup = document.getElementById('diurnalRotGroup');
            const diurnalTimeLabel = document.getElementById('diurnalTimeLabel');
            const diurnalAngleLabel = document.getElementById('diurnalAngleLabel');

            const annualSlider = document.getElementById('annualSlider');
            const annualRotGroup = document.getElementById('annualRotGroup');
            const annualDateLabel = document.getElementById('annualDateLabel');
            const annualAngleLabel = document.getElementById('annualAngleLabel');

            const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

            function getKoreanNightTimeStr(h) {
                if (h === 19) return "저녁 7시";
                if (h === 20) return "저녁 8시";
                if (h === 21) return "밤 9시";
                if (h === 22) return "밤 10시";
                if (h === 23) return "밤 11시";
                if (h === 0 || h === 24) return "자정 12시 (한밤중)";
                if (h >= 1 && h <= 6) return `새벽 ${h}시`;
                return `${h}시`;
            }

            const diurnalRotGroupAU = document.getElementById('diurnalRotGroupAU');
            const annualRotGroupAU = document.getElementById('annualRotGroupAU');

            if (diurnalSlider) {
                diurnalSlider.oninput = function() {
                    const hours = Math.round(parseFloat(this.value));
                    const angle = hours * 15; // Discrete 15° increments (0°, 15°, 30°, 45°... 180°)

                    // 🇰🇷 Korea (KR Northern Sky): Counter-Clockwise (-angle)
                    if (diurnalRotGroup) diurnalRotGroup.setAttribute('transform', `rotate(${-angle} 120 78)`);

                    // 🇦🇺 Australia (AU Southern Sky): Clockwise (+angle)
                    if (diurnalRotGroupAU) diurnalRotGroupAU.setAttribute('transform', `rotate(${angle} 120 78)`);

                    const currentHour = (19 + hours) % 24;
                    const periodStr = getKoreanNightTimeStr(currentHour);

                    if (diurnalTimeLabel) diurnalTimeLabel.textContent = `${periodStr} (+${hours}시간)`;
                    if (diurnalAngleLabel) diurnalAngleLabel.textContent = `${angle}° (KR: 🔄 / AU: 🔃)`;
                };
            }

            if (annualSlider) {
                annualSlider.oninput = function() {
                    const monthVal = Math.round(parseFloat(this.value));
                    const monthsPassed = monthVal - 1;
                    const angle = monthsPassed * 30; // Discrete 30° increments (0°, 30°, 60°, 90°... 330°)

                    // 🇰🇷 Korea (KR Northern Sky): Counter-Clockwise (-angle)
                    if (annualRotGroup) annualRotGroup.setAttribute('transform', `rotate(${-angle} 120 78)`);

                    // 🇦🇺 Australia (AU Southern Sky): Clockwise (+angle)
                    if (annualRotGroupAU) annualRotGroupAU.setAttribute('transform', `rotate(${angle} 120 78)`);

                    const mIdx = (monthVal - 1) % 12;
                    if (annualDateLabel) annualDateLabel.textContent = `${monthNames[mIdx]} (+${monthsPassed}달)`;
                    if (annualAngleLabel) annualAngleLabel.textContent = `${angle}° (KR: 🔄 / AU: 🔃)`;
                };
            }
        })();


        // Photorealistic Stellar Evolution Interactive Knob Engine
        (function() {
            const trackSunData = [
                {
                    stage: "1단계",
                    name: "성간 물질 & 성운 (Stellar Nebula)", emoji: "", date: "",
                    timeText: "진화 0% ~ 10% (탄생기)",
                    desc: "우주 공간의 수소 가스와 미세한 먼지가 중력에 의해 밀집하고 수축하면서 원시별이 형성됩니다. 중심 온도가 약 1,000만 K에 도달해 수소 핵융합이 시작되면 주계열성이 됩니다.",
                    specs: "• 대표 예시: 오리온 성운 (M42) | 소요 시간: 수백만 년 | 상태: 수축하는 성간 가스 구름",
                    img: "assets/images/stellar/nebula.jpg"
                },
                {
                    stage: "2단계",
                    name: "주계열성 (Main Sequence - 예: 태양)", emoji: "", date: "",
                    desc: "중심부 수소 핵융합 반응으로 내부 압력과 중력이 완벽한 균형을 이루어 별의 전성기(전체 일생의 90%)를 보냅니다. 태양은 현재 이 단계에 위치해 있습니다.",
                    timeText: "진화 10% ~ 70% (주계열 안정기)",
                    specs: "• 대표 예시: 태양 (Sun), 시리우스 A | 수명: 약 100억 년 | 표면 온도: 약 5,800 K",
                    img: "assets/images/stellar/main_sequence.jpg"
                },
                {
                    stage: "3단계",
                    name: "적색거성 (Red Giant - 예: 알데바란)", emoji: "", date: "",
                    desc: "중심부 수소가 모두 소진되면 중심부는 수축하고 바깥 껍질은 거대하게 팽창합니다. 표면 온도가 낮아져 붉은색으로 크게 부풀어 오릅니다. (태양도 약 50억 년 후 지구 궤도까지 부풀어 오름)",
                    timeText: "진화 70% ~ 90% (거성 팽창기)",
                    specs: "• 대표 예시: 황소자리 알데바란 | 크기: 태양의 100배 팽창 | 표면 색상: 붉은색 (3,000 K)",
                    img: "assets/images/stellar/red_giant.jpg"
                },
                {
                    stage: "4단계",
                    name: "행성상 성운 (Planetary Nebula)", emoji: "", date: "",
                    desc: "적색거성의 바깥 껍질 가스가 우주 공간으로 방출되어 화려한 고리 모양의 성운을 이룹니다. 방출된 가스와 원소들은 다음 세대 별과 행성의 재료로 환원됩니다.",
                    timeText: "진화 90% ~ 98% (가스 방출기)",
                    specs: "• 대표 예시: 거문고자리 고리 성운 (M57) | 상태: 우주로 퍼져나가는 팽창 가스 껍질",
                    img: "assets/images/stellar/planetary_nebula.jpg"
                },
                {
                    stage: "5단계",
                    name: "백색왜성 (White Dwarf - 종말)", emoji: "", date: "",
                    desc: "행성상 성운이 벗겨지고 남은 고밀도의 고온 중심핵입니다. 지구 크기로 매우 작지만 밀도가 엄청나게 높아 수십억 년 동안 서서히 차갑게 식어갑니다.",
                    timeText: "진화 98% ~ 100% (사멸 및 서서히 식음)",
                    specs: "• 대표 예시: 시리우스 B | 크기: 지구 크기 | 밀도: 1cm³ 당 약 1톤 | 상태: 별의 최종 사체",
                    img: "assets/images/stellar/white_dwarf.jpg"
                }
            ];

            const trackMassiveData = [
                {
                    stage: "1단계",
                    name: "거대 성간 물질 (Massive Nebula)", emoji: "", date: "",
                    desc: "질량이 큰 성간 가스 구름이 강한 중력으로 빠르게 수축합니다. 일반적인 저질량 별의 형성 영역보다 빠르게 붕괴하면서 고질량 원시별을 형성합니다.",
                    timeText: "진화 0% ~ 10% (거대 탄생기)",
                    specs: "• 대표 예시: 독수리 성운 (창조의 기둥) | 밀도: 초고밀도 수소 구름",
                    img: "assets/images/stellar/nebula.jpg"
                },
                {
                    stage: "2단계",
                    name: "청색 초거성 (Blue Supergiant - 예: 리겔)", emoji: "", date: "",
                    desc: "질량이 엄청나게 커서 수소 핵융합이 매우 격렬하게 일어납니다. 표면 온도가 10,000~20,000 K 이상으로 극도로 높아 푸른빛을 강렬하게 발산합니다.",
                    timeText: "진화 10% ~ 65% (고온 초거성기)",
                    specs: "• 대표 예시: 오리온자리 리겔 (Rigel) | 수명: 수천만 년 (연료 폭발적 소모)",
                    img: "assets/images/stellar/blue_supergiant.jpg"
                },
                {
                    stage: "3단계",
                    name: "적색 초거성 (Red Supergiant - 예: 베텔게우스)", emoji: "", date: "",
                    desc: "내부에서 헬륨, 탄소, 산소, 규소, 철까지 연속 핵융합이 일어나며 목성 궤도까지 상상을 초월할 정도로 거대하게 부풀어 오른 붉은 거대 별입니다.",
                    timeText: "진화 65% ~ 88% (초거대 팽창기)",
                    specs: "• 대표 예시: 베텔게우스 (Betelgeuse) | 크기: 태양의 1,000배 이상 | 초신성 폭발 임박",
                    img: "assets/images/stellar/red_supergiant.jpg"
                },
                {
                    stage: "4단계",
                    name: "초신성 대폭발 (Supernova - 우주 최강 대폭발!)", emoji: "", date: "",
                    desc: "중심부에 철(Fe)이 형성되어 핵융합이 멈추면 자중으로 붕괴하다가 일시에 엄청난 우주 대폭발을 일으킵니다! 이때 은하 전체보다 밝은 빛을 내며 금, 은, 우라늄 중원소를 우주로 살포합니다.",
                    timeText: "진화 88% ~ 95% (초신성 폭발 순간)",
                    specs: "• 대표 예시: 게 성운 (SN 1054) | 밝기: 은하 1개 전체 밝기 상회",
                    img: "assets/images/stellar/supernova.jpg"
                },
                {
                    stage: "5단계",
                    name: "중성자성 또는 블랙홀 (Neutron Star / Black Hole)", emoji: "", date: "",
                    desc: "초신성 폭발 후 잔해가 극도로 압축되어 중성자성이 되거나, 질량이 극도로 큰 경우 빛조차 탈출할 수 없는 시공간의 구멍 블랙홀이 생성됩니다.",
                    timeText: "진화 95% ~ 100% (시공간 붕괴 사멸)",
                    specs: "• 밀도: 무한대 (티스푼 1개당 10억 톤 이상) | 블랙홀 사건의 지평선 형성",
                    img: "assets/images/stellar/black_hole.jpg"
                }
            ];

            let activeTrack = 'sun';
            let activeIdx = 0;

            const btnSun = document.getElementById('btnTrackSun');
            const btnMassive = document.getElementById('btnTrackMassive');
            const sliderKnob = document.getElementById('stellarTimeKnob');
            const timeValText = document.getElementById('stellarTimeValText');
            const nodesBox = document.getElementById('stellarStageNodes');
            const titleEl = document.getElementById('lifeTrackTitle');
            const stageNameEl = document.getElementById('stageName');
            const stageDescEl = document.getElementById('stageDesc');
            const stageSpecsEl = document.getElementById('stageSpecs');
            const realImgEl = document.getElementById('stageRealImage');

            function getStageIdxFromPercent(pct) {
                if (pct < 20) return 0;
                if (pct < 40) return 1;
                if (pct < 60) return 2;
                if (pct < 80) return 3;
                return 4;
            }

            function updateStellarVisualizer() {
                const data = activeTrack === 'sun' ? trackSunData : trackMassiveData;
                const item = data[activeIdx];

                if(titleEl) {
                    titleEl.textContent = activeTrack === 'sun'
                        ? '☀️ [태양급 보통 별] 성운 ➔ 주계열성 ➔ 적색거성 ➔ 행성상 성운 ➔ 백색왜성'
                        : '💥 [초대질량 거대 별] 성운 ➔ 청색 초거성 ➔ 적색 초거성 ➔ 초신성 폭발 ➔ 블랙홀';
                }

                if(nodesBox) {
                    nodesBox.innerHTML = '';
                    data.forEach((st, idx) => {
                        const btn = document.createElement('button');
                        const isSel = idx === activeIdx;
                        btn.style.cssText = `padding: 8px; background: ${isSel ? 'rgba(56,189,248,0.25)' : 'rgba(15,23,42,0.8)'}; border: 1.5px solid ${isSel ? '#38bdf8' : 'rgba(255,255,255,0.15)'}; border-radius: 12px; cursor: pointer; text-align: center; transition: all 0.2s;`;
                        btn.innerHTML = `<div style="width: 100%; height: 95px; background: #030712; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden; margin-bottom: 6px; border: 1px solid rgba(255,255,255,0.2);"><img src="${st.img}" style="width:100%; height:100%; object-fit:cover;"></div><div style="font-size: 11.5px; font-weight: 800; color: ${isSel ? '#38bdf8' : '#e2e8f0'};">${st.stage}</div><div style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">${st.name.split('(')[0]}</div>`;
                        btn.onclick = () => {
                            activeIdx = idx;
                            const samplePcts = [10, 30, 50, 70, 90];
                            if(sliderKnob) sliderKnob.value = samplePcts[idx];
                            updateStellarVisualizer();
                        };
                        nodesBox.appendChild(btn);
                    });
                }

                if (stageNameEl) stageNameEl.textContent = item.name;
                if (stageDescEl) stageDescEl.textContent = item.desc;
                if (stageSpecsEl) stageSpecsEl.textContent = item.specs;
                if (timeValText) timeValText.textContent = item.timeText;

                if (realImgEl) {
                    realImgEl.src = item.img;
                    realImgEl.alt = item.name;
                }
            }

            if (sliderKnob) {
                sliderKnob.oninput = function() {
                    const val = parseInt(sliderKnob.value);
                    activeIdx = getStageIdxFromPercent(val);
                    updateStellarVisualizer();
                };
            }

            if (btnSun) {
                btnSun.onclick = function() {
                    activeTrack = 'sun';
                    activeIdx = 0;
                    if(sliderKnob) sliderKnob.value = 10;
                    btnSun.style.background = '#0284c7';
                    btnSun.style.color = '#fff';
                    btnSun.style.borderColor = '#38bdf8';

                    btnMassive.style.background = 'rgba(15,23,42,0.85)';
                    btnMassive.style.color = '#94a3b8';
                    btnMassive.style.borderColor = 'rgba(255,255,255,0.2)';
                    updateStellarVisualizer();
                };
            }

            if (btnMassive) {
                btnMassive.onclick = function() {
                    activeTrack = 'massive';
                    activeIdx = 0;
                    if(sliderKnob) sliderKnob.value = 10;
                    btnMassive.style.background = '#ef4444';
                    btnMassive.style.color = '#fff';
                    btnMassive.style.borderColor = '#f87171';

                    btnSun.style.background = 'rgba(15,23,42,0.85)';
                    btnSun.style.color = '#94a3b8';
                    btnSun.style.borderColor = 'rgba(255,255,255,0.2)';
                    updateStellarVisualizer();
                };
            }

            updateStellarVisualizer();
        })();

                // Dedicated Stars & Constellations Quiz Engine
        (function() {
            // Concept-first question bank.  Seasonal constellation names are deliberately
            // not tested as isolated facts; questions instead use observations and the
            // controls provided by this simulation.
            const quizData = [
                { cat: "일주 운동", q: "별과 별자리가 하루 동안 동쪽에서 서쪽으로 움직이는 것처럼 보이는 근본 원인은?", ans: 0, opts: ["지구의 자전", "지구의 공전", "별의 실제 공전", "지구 자전축의 세차 운동"], exp: "해설: 지구가 서쪽에서 동쪽으로 자전하므로 천체는 반대 방향인 동쪽에서 서쪽으로 움직이는 것처럼 보입니다." },
                { cat: "일주 운동", q: "남쪽 하늘의 별이 하루 동안 움직이는 일반적인 순서로 옳은 것은?", ans: 2, opts: ["서쪽에서 떠서 남쪽 하늘을 지나 동쪽으로 진다", "동쪽에서 떠서 북쪽 하늘을 지나 서쪽으로 진다", "동쪽에서 떠서 남쪽 하늘을 지나 서쪽으로 진다", "서쪽에서 떠서 북쪽 하늘을 지나 동쪽으로 진다"], exp: "해설: 우리나라에서 남쪽 하늘의 별은 동쪽에서 떠서 남쪽 하늘에서 가장 높이 남중한 뒤 서쪽으로 집니다." },
                { cat: "일주 운동", q: "별의 일주 운동 각속도는 대략 얼마인가?", ans: 1, opts: ["1시간에 1°", "1시간에 15°", "1시간에 30°", "하루에 1°"], exp: "해설: 천구가 약 24시간에 360° 회전하는 것처럼 보이므로 1시간에는 약 15° 움직입니다. 하루에 약 1°는 같은 시각에 본 별자리가 옮겨 가는 연주 운동의 빠르기입니다." },
                { cat: "일주 운동", q: "별이 같은 위치로 되돌아오는 일주 운동의 주기는 학교 수준에서 대략 얼마로 보는가?", ans: 3, opts: ["1시간", "6시간", "12시간", "24시간"], exp: "해설: 일주 운동은 지구의 하루 자전 때문에 나타나므로 약 24시간을 한 주기로 봅니다." },
                { cat: "일주 운동", q: "지구의 자전 방향과 별의 겉보기 일주 운동 방향을 바르게 짝지은 것은?", ans: 0, opts: ["지구: 서→동, 별: 동→서", "지구: 동→서, 별: 동→서", "지구: 서→동, 별: 서→동", "지구: 동→서, 별: 서→동"], exp: "해설: 관측자가 탄 지구가 서쪽에서 동쪽으로 자전하기 때문에 별은 반대로 이동하는 것처럼 보입니다." },
                { cat: "일주 운동", q: "시뮬레이션에서 월은 그대로 두고 ‘시각’만 3시간 뒤로 옮겼다. 가장 직접적으로 관찰할 수 있는 것은?", ans: 2, opts: ["지구 공전에 따른 별자리의 위치 변화", "자전축의 세차 운동에 따른 북극성 변화", "지구 자전에 따른 별자리의 위치 변화", "지구 공전에 따른 태양의 남중 고도 변화"], exp: "해설: 같은 날짜에서 시각을 바꾸면 지구 자전에 따른 별자리의 하루 중 위치 변화, 즉 일주 운동을 볼 수 있습니다." },
                { cat: "일주 운동", q: "오후 8시에 동쪽 하늘에서 보이던 별자리는 시간이 흐르면 대체로 어느 쪽으로 이동하는가?", ans: 1, opts: ["북쪽 하늘을 거쳐 서쪽", "남쪽 하늘을 거쳐 서쪽", "북쪽 하늘을 거쳐 다시 동쪽", "남쪽 하늘을 거쳐 다시 동쪽"], exp: "해설: 별자리는 동쪽에서 떠서 남쪽 하늘을 지나 서쪽으로 지는 일주 운동을 합니다." },
                { cat: "일주 운동", q: "재생 버튼으로 저녁부터 다음 날 새벽까지 한 번 관찰하는 활동의 주된 목적은?", ans: 3, opts: ["계절에 따른 별자리의 위치 변화 확인", "밤사이 달의 위상 변화 확인", "계절에 따른 달의 위상 변화 확인", "밤사이 별자리의 위치 변화 확인"], exp: "해설: 하루 밤 동안의 재생은 지구 자전에 따른 별자리의 일주 운동을 관찰하기 위한 것입니다." },

                { cat: "북쪽 하늘", q: "우리나라에서 북쪽 하늘을 바라볼 때 별들은 북극성을 중심으로 어느 방향으로 도는 것처럼 보이는가?", ans: 1, opts: ["시계 방향", "시계 반대 방향", "계절에 따라 시계 방향과 반대 방향이 바뀐다", "북극성 위쪽 별은 시계 방향, 아래쪽 별은 반대 방향"], exp: "해설: 북반구에서 북쪽 하늘을 보면 별들은 북극성 부근을 중심으로 시계 반대 방향으로 도는 것처럼 보입니다." },
                { cat: "북극성", q: "북극성이 밤새 거의 움직이지 않는 것처럼 보이는 까닭은?", ans: 2, opts: ["지구에서 가장 가까운 별이라서", "밤하늘에서 가장 밝은 별이라서", "지구 자전축의 연장선 가까이에 있어서", "우주 공간에서 실제로 멈춰 있는 별이라서"], exp: "해설: 북극성은 북천구의 북극 가까이에 있어 지구가 자전해도 하늘에서의 위치 변화가 매우 작습니다. 북극성은 가장 가깝거나 가장 밝은 별이 아니며, 실제로는 우주 공간에서 움직이고 있습니다." },
                { cat: "북극성", q: "북반구에서 북극성의 고도는 무엇과 거의 같은가?", ans: 0, opts: ["관측지의 위도", "관측지의 경도", "현재 시각", "태양의 고도"], exp: "해설: 북반구에서 북극성의 고도는 관측지의 위도와 거의 같습니다." },
                { cat: "북극성", q: "북극성의 고도가 서울에서는 약 37.5°, 제주에서는 약 33.5°로 관측된다. 이 차이가 생기는 까닭은?", ans: 0, opts: ["제주가 서울보다 위도가 낮아서", "제주가 서울보다 조금 서쪽에 있어서", "제주가 서울보다 바다에 가까워서", "제주가 서울보다 해발 고도가 낮아서"], exp: "해설: 북극성의 고도는 관측지의 위도와 거의 같습니다. 제주는 서울보다 위도가 약 4° 낮아 북극성도 약 4° 낮게 보이며, 경도나 해발 고도는 북극성의 고도를 거의 바꾸지 않습니다." },
                { cat: "북극성", q: "적도에서 북극성은 이론적으로 어디에 가까이 보이는가?", ans: 1, opts: ["천정", "북쪽 지평선", "남쪽 지평선", "동쪽 하늘 45°"], exp: "해설: 위도 0°인 적도에서는 북극성의 고도도 약 0°이므로 북쪽 지평선 부근에 놓입니다." },
                { cat: "북극성", q: "북극점에서 북극성은 이론적으로 어디에 가까이 보이는가?", ans: 3, opts: ["북쪽 지평선", "고도 약 66.5°", "고도 약 45°", "천정"], exp: "해설: 북위 90°인 북극점에서는 북극성의 고도가 약 90°이므로 천정 가까이에 보입니다." },
                { cat: "북극성", q: "남반구의 대부분 지역에서 북극성을 볼 수 없는 까닭은?", ans: 0, opts: ["천구의 북극이 북쪽 지평선 아래에 있기 때문", "북극성이 남반구에서는 낮 동안에만 떠 있기 때문", "남반구에서는 별들이 시계 방향으로 돌기 때문", "북극성이 1년 내내 태양과 같은 쪽에 있기 때문"], exp: "해설: 남반구에서는 천구의 북극 방향이 북쪽 지평선 아래에 있어 북극성을 볼 수 없습니다. 남반구에서 남쪽 하늘의 별이 시계 방향으로 도는 것은 사실이지만 북극성이 보이지 않는 까닭은 아닙니다." },
                { cat: "북극성", q: "관측자가 적도에서 북쪽으로 이동할수록 북극성의 고도는 어떻게 변하는가?", ans: 2, opts: ["낮아진다", "거의 변하지 않는다", "높아진다", "북위 23.5°까지 높아지다가 다시 낮아진다"], exp: "해설: 북쪽으로 갈수록 북위가 커지므로 북극성의 고도도 높아집니다." },
                { cat: "북극성 찾기", q: "큰곰자리의 북두칠성을 이용해 북극성을 찾을 때 사용하는 별은?", ans: 1, opts: ["국자 손잡이 끝의 두 별", "국자 그릇 바깥쪽의 두 별", "국자 가운데 한 별", "국자 그릇 안쪽의 두 별"], exp: "해설: 북두칠성 국자 그릇 바깥쪽 두 별을 이은 방향으로 약 다섯 배 연장하면 북극성 부근을 찾을 수 있습니다." },
                { cat: "북극성 찾기", q: "북두칠성이 잘 보이지 않을 때 북극성을 찾는 또 다른 길잡이로 알맞은 것은?", ans: 3, opts: ["오리온자리", "백조자리", "남십자자리", "카시오페이아자리"], exp: "해설: 북쪽 하늘의 W 모양 카시오페이아자리도 북극성을 찾는 대표적인 길잡이입니다." },

                { cat: "연주 운동", q: "같은 시각에 본 별자리가 날마다 조금씩 서쪽으로 이동해 보이는 근본 원인은?", ans: 1, opts: ["지구의 자전", "지구의 공전", "달의 공전", "별자리의 실제 이동"], exp: "해설: 지구가 태양 주위를 공전하면 같은 시각에 밤하늘이 향하는 방향이 매일 조금씩 달라집니다." },
                { cat: "연주 운동", q: "같은 시각에 관찰한 별자리의 연주 운동 크기로 가장 알맞은 것은?", ans: 0, opts: ["하루 약 1° 서쪽", "하루 약 1° 동쪽", "한 달 약 1° 동쪽", "한 시간 약 15° 서쪽"], exp: "해설: 별자리는 같은 시각을 기준으로 하루 약 1°, 한 달 약 30°씩 서쪽으로 이동해 보입니다. 한 시간에 약 15°는 일주 운동의 빠르기입니다." },
                { cat: "연주 운동", q: "같은 시각에 본 별자리의 위치는 한 달 뒤 대략 어떻게 달라지는가?", ans: 3, opts: ["동쪽으로 약 1°", "동쪽으로 약 30°", "서쪽으로 약 15°", "서쪽으로 약 30°"], exp: "해설: 연주 운동은 하루 약 1°이므로 한 달에는 대략 30° 서쪽으로 이동해 보입니다." },
                { cat: "연주 운동", q: "시뮬레이션에서 시각을 고정하고 ‘월’ 슬라이더만 바꿀 때 관찰하는 운동은?", ans: 2, opts: ["지구 자전에 따른 별자리의 위치 변화", "지구 자전에 따른 태양의 위치 변화", "지구 공전에 따른 별자리의 위치 변화", "자전축의 세차 운동에 따른 북극성 변화"], exp: "해설: 같은 시각에서 날짜나 월을 바꾸면 지구 공전에 따른 별자리의 계절별 위치 변화, 즉 연주 운동을 볼 수 있습니다." },
                { cat: "연주 운동", q: "별자리의 연주 운동이 1년 뒤 처음과 비슷해지는 까닭은?", ans: 0, opts: ["지구가 태양 주위를 한 바퀴 공전하기 때문", "지구가 하루에 한 바퀴 자전하기 때문", "태양이 지구 주위를 한 바퀴 돌기 때문", "별들이 매년 원래 자리로 돌아오기 때문"], exp: "해설: 지구가 1년에 태양 주위를 한 바퀴 공전하므로 같은 계절에는 밤하늘 방향도 다시 비슷해집니다." },
                { cat: "계절 별자리", q: "계절에 따라 한밤중에 보이는 별자리가 달라지는 까닭은?", ans: 1, opts: ["지구가 자전하며 밤에 향하는 우주 방향이 달라져서", "지구가 공전하며 밤에 향하는 우주 방향이 달라져서", "지구 자전축의 기울어진 방향이 계절마다 바뀌어서", "별자리들이 태양을 중심으로 1년에 한 바퀴 돌아서"], exp: "해설: 지구의 공전 위치가 달라지면 태양 반대편인 한밤중 하늘의 방향도 달라집니다." },
                { cat: "계절 별자리", q: "지구가 공전 궤도의 정반대편으로 이동했다면 한밤중에 바라보는 별자리 방향은 대략 어떻게 되는가?", ans: 2, opts: ["변하지 않는다", "약 90° 달라진다", "약 180° 달라진다", "약 360° 달라진다"], exp: "해설: 약 6개월 뒤 지구가 궤도의 반대편에 오면 한밤중에 향하는 우주 방향도 대략 반대가 됩니다." },
                { cat: "계절 별자리", q: "어떤 별자리가 현재 태양과 같은 방향에 있다. 이 별자리를 관측하기 어려운 가장 큰 까닭은?", ans: 3, opts: ["태양이 별자리 앞을 실제로 가로막기 때문", "태양의 중력이 별빛을 휘게 하기 때문", "그 별자리가 그 계절에는 빛을 내지 않기 때문", "낮의 밝은 하늘에 가려지기 때문"], exp: "해설: 태양과 같은 방향의 별자리는 낮하늘에 있으므로 태양빛 때문에 관측하기 어렵습니다." },
                { cat: "계절 별자리", q: "현재 태양과 같은 방향이라 보이지 않는 별자리는 대략 언제 한밤중에 잘 보이게 되는가?", ans: 1, opts: ["약 3개월 뒤", "약 6개월 뒤", "약 12시간 뒤", "약 1년 뒤"], exp: "해설: 약 6개월 뒤에는 지구가 궤도의 반대편에 와서 그 별자리가 태양 반대 방향의 밤하늘에 놓입니다." },
                { cat: "일주·연주 비교", q: "일주 운동과 연주 운동을 바르게 연결한 것은?", ans: 0, opts: ["일주 운동—지구 자전, 연주 운동—지구 공전", "일주 운동—지구 공전, 연주 운동—지구 자전", "둘 다 지구 자전", "둘 다 지구 공전"], exp: "해설: 하루 동안의 일주 운동은 자전, 같은 시각에서 계절에 따른 연주 운동은 공전 때문에 나타납니다." },
                { cat: "일주·연주 비교", q: "오늘보다 별자리가 약 4분 일찍 같은 위치에 오는 현상과 가장 관련 깊은 것은?", ans: 2, opts: ["지구 자전에 따른 별의 일주 운동", "지구 자전에 따른 낮과 밤의 반복", "지구 공전에 따른 별의 연주 운동", "지구 공전에 따른 태양의 남중 고도 변화"], exp: "해설: 지구가 하루 동안 공전한 만큼 더 자전해야 태양 기준 하루가 되므로 별은 매일 약 4분 일찍 같은 위치에 옵니다." },
                { cat: "일주·연주 비교", q: "시뮬레이션에서 ‘시각’과 ‘월’ 슬라이더의 역할을 바르게 설명한 것은?", ans: 3, opts: ["둘 다 연주 운동을 보여 준다", "시각은 연주 운동, 월은 일주 운동", "둘 다 일주 운동을 보여 준다", "시각은 일주 운동, 월은 연주 운동"], exp: "해설: 시각을 바꾸면 하루 중 위치 변화를, 월을 바꾸면 같은 시각에서 계절별 위치 변화를 확인할 수 있습니다." },

                { cat: "황도 12궁", q: "황도란 천구에서 무엇의 겉보기 연간 이동 경로인가?", ans: 1, opts: ["달", "태양", "금성", "화성"], exp: "해설: 황도는 지구의 공전 때문에 태양이 1년에 걸쳐 천구 위를 이동하는 것처럼 보이는 길입니다. 달이 지나는 길은 백도라고 합니다." },
                { cat: "황도 12궁", q: "황도 12궁 별자리들이 대체로 황도 부근에 놓이는 까닭은?", ans: 0, opts: ["태양이 지나는 길 주변의 별자리를 골라 정했기 때문", "지구에서 가장 가까운 별자리들을 골라 정했기 때문", "가장 밝은 별들로 이루어진 별자리를 골라 정했기 때문", "천구의 적도를 따라 늘어선 별자리를 골라 정했기 때문"], exp: "해설: 황도 12궁은 태양이 지나가는 것처럼 보이는 황도 주변의 별자리들입니다. 황도는 천구의 적도와 약 23.5° 기울어져 있습니다." },
                { cat: "황도 12궁", q: "한밤중 남쪽 하늘에서 잘 보이는 황도 별자리는 태양이 있는 방향과 어떤 관계인가?", ans: 2, opts: ["거의 같은 방향", "약 90° 떨어진 방향", "거의 반대 방향", "약 30° 떨어진 방향"], exp: "해설: 한밤중에는 관측자가 태양의 반대편 우주를 바라보므로 태양 방향과 거의 반대인 별자리가 남중합니다." },
                { cat: "황도 12궁", q: "특정 달에 태양이 어느 황도 별자리 방향에 있다는 말의 의미로 옳은 것은?", ans: 3, opts: ["태양이 그 별자리의 별들 사이에 실제로 들어가 있다", "그 별자리가 그달에 태양과 가장 가까운 거리로 온다", "지구에서 볼 때 그 별자리가 한밤중 남쪽 하늘에 뜬다", "지구에서 볼 때 태양과 그 별자리가 거의 같은 방향에 있다"], exp: "해설: 천구에서 같은 방향에 겹쳐 보인다는 뜻이며 실제 거리가 가깝다는 뜻은 아닙니다." },
                { cat: "황도 12궁", q: "월 슬라이더를 움직일 때 태양 뒤쪽의 황도 별자리가 차례로 달라지는 직접적인 원인은?", ans: 1, opts: ["별자리의 빠른 공전", "지구의 공전", "지구의 하루 자전", "달의 위상 변화"], exp: "해설: 지구가 공전하면서 태양을 바라보는 배경 방향이 달라져 태양 뒤쪽의 황도 별자리도 달라집니다." },

                { cat: "천구", q: "천구에 대한 설명으로 가장 알맞은 것은?", ans: 0, opts: ["천체의 방향을 나타내기 위해 가정한 큰 구", "실제로 지구를 둘러싼 단단한 껍질", "태양계의 경계면", "은하수의 바깥 표면"], exp: "해설: 천구는 멀리 있는 천체들의 방향과 운동을 나타내기 위해 관측자를 중심으로 가정한 구입니다." },
                { cat: "천구", q: "천구의 적도는 무엇을 연장해 천구와 만난 큰 원인가?", ans: 2, opts: ["지구의 공전 궤도면", "적도에 선 관측자의 지평면", "지구의 적도면", "지구의 적도면에 수직인 면"], exp: "해설: 지구의 적도면을 천구까지 연장한 큰 원을 천구의 적도라고 합니다. 지구의 공전 궤도면을 연장하면 황도가 됩니다." },
                { cat: "천구", q: "천구의 북극과 남극은 무엇을 연장해 천구와 만나는 점인가?", ans: 1, opts: ["관측자의 머리 위를 가리키는 선", "지구의 자전축", "지구 공전 궤도면에 수직인 선", "태양과 지구를 잇는 선"], exp: "해설: 지구 자전축의 양쪽 연장선이 천구와 만나는 두 점이 천구의 북극과 남극입니다." },
                { cat: "천구", q: "춘분점과 추분점은 천구에서 어떤 두 원이 만나는 점인가?", ans: 3, opts: ["지평선과 자오선", "황도와 지평선", "천구의 적도와 자오선", "황도와 천구의 적도"], exp: "해설: 태양의 길인 황도와 지구 적도면의 연장인 천구의 적도가 만나는 두 점이 춘분점과 추분점입니다." },
                { cat: "천구", q: "관측자의 위치가 달라질 때 천구에서 가장 직접적으로 달라지는 것은?", ans: 0, opts: ["지평선과 천체의 고도", "별자리를 이루는 별들의 배열", "두 별 사이의 각거리", "별의 겉보기 색"], exp: "해설: 관측 장소의 위도와 방향이 달라지면 지평선에 대한 천체의 고도와 보이는 범위가 달라집니다. 별자리의 모양이나 두 별 사이의 각거리, 별의 색은 관측 장소가 바뀌어도 거의 그대로입니다." },
                { cat: "남쪽 하늘", q: "남반구에서 남쪽 방향을 찾는 대표적인 별자리로 알맞은 것은?", ans: 2, opts: ["남쪽물고기자리", "남쪽왕관자리", "남십자자리", "카시오페이아자리"], exp: "해설: 남반구에서는 북극성이 보이지 않으므로 남십자자리가 남쪽 방향을 찾는 중요한 길잡이가 됩니다." },

                { cat: "별의 색과 온도", q: "표면 온도가 가장 높은 별의 색은 일반적으로 무엇에 가까운가?", ans: 1, opts: ["붉은색", "청백색", "주황색", "노란색"], exp: "해설: 별은 표면 온도가 높을수록 청백색, 낮을수록 붉은색에 가깝습니다." },
                { cat: "별의 밝기", q: "별의 겉보기 밝기에 직접 영향을 주는 두 요인의 조합은?", ans: 3, opts: ["별의 표면 색과 별의 나이", "별의 표면 색과 지구까지의 거리", "별의 실제 광도와 별의 나이", "별의 실제 광도와 지구까지의 거리"], exp: "해설: 실제로 밝은 별도 멀면 어둡게 보일 수 있으므로 겉보기 밝기는 광도와 거리의 영향을 함께 받습니다." },
                { cat: "별의 밝기", q: "겉보기 등급이 1등급인 별과 5등급인 별 중 더 밝게 보이는 별은?", ans: 0, opts: ["1등급 별", "5등급 별", "거리를 알아야 판단할 수 있다", "색을 알아야 판단할 수 있다"], exp: "해설: 겉보기 등급은 지구에서 보이는 밝기를 나타내므로 숫자가 작을수록 더 밝게 보입니다. 거리나 색을 따로 알 필요가 없습니다." },
                { cat: "별의 일생", q: "태양과 비슷한 질량의 별이 진화하는 순서로 가장 알맞은 것은?", ans: 2, opts: ["성운→주계열성→초신성→블랙홀", "성운→주계열성→백색왜성→적색거성", "성운→주계열성→적색거성→백색왜성", "성운→주계열성→초신성→중성자별"], exp: "해설: 태양 정도 질량의 별은 성운에서 태어나 주계열성과 적색거성 단계를 거쳐 마지막에 백색왜성이 됩니다." },
                { cat: "별의 일생", q: "질량이 매우 큰 별이 초신성 폭발 뒤 남길 수 있는 천체는?", ans: 1, opts: ["백색왜성이나 행성상 성운", "중성자별이나 블랙홀", "적색거성이나 초거성", "원시별이나 주계열성"], exp: "해설: 질량이 큰 별의 중심부는 초신성 폭발 뒤 중성자별이 되거나, 매우 무거우면 블랙홀이 될 수 있습니다. 백색왜성과 행성상 성운은 태양 정도 질량의 별이 마지막에 남기는 천체입니다." },
                { cat: "별자리", q: "별자리에서 서로 이웃해 보이는 두 별에 대한 설명으로 옳은 것은?", ans: 3, opts: ["서로의 중력에 묶여 함께 공전하는 경우가 대부분이다", "같은 별자리라서 지구에서 비슷한 거리에 있는 경우가 대부분이다", "같은 성운에서 함께 태어나 나이가 비슷한 경우가 대부분이다", "지구에서 본 방향이 비슷할 뿐 실제 거리는 크게 다른 경우가 대부분이다"], exp: "해설: 별자리는 천구에 투영된 겉보기 모양이므로 이웃해 보이는 별들의 실제 거리는 서로 다를 수 있습니다." }
            ];

            const quizTopics = [
                {
                    name: '일주 운동과 연주 운동',
                    subs: [
                        { name: '일주 운동', cats: ['일주 운동', '북쪽 하늘'] },
                        { name: '연주 운동', cats: ['연주 운동', '계절 별자리'] },
                        { name: '일주·연주 비교', cats: ['일주·연주 비교'] }
                    ]
                },
                {
                    name: '북극성과 방향 찾기',
                    subs: [
                        { name: '북극성', cats: ['북극성'] },
                        { name: '북극성 찾기', cats: ['북극성 찾기', '남쪽 하늘'] }
                    ]
                },
                {
                    name: '천구와 황도 12궁',
                    subs: [
                        { name: '천구', cats: ['천구'] },
                        { name: '황도 12궁', cats: ['황도 12궁'] }
                    ]
                },
                {
                    name: '별의 성질과 일생',
                    subs: [
                        { name: '별의 밝기와 색', cats: ['별의 밝기', '별의 색과 온도'] },
                        { name: '별의 일생', cats: ['별의 일생'] },
                        { name: '별자리', cats: ['별자리'] }
                    ]
                }
            ];

            window.SpaceQuizBoard.mount({
                questions: quizData,
                topics: quizTopics,
                namePrefix: 'st-quiz',
                ids: {
                    total: 'stQuizTotalCount',
                    tabs: 'stQuizTopicTabs',
                    subRow: 'stQuizSubRow',
                    subChips: 'stQuizSubChips',
                    guide: 'stQuizGuide',
                    grid: 'stQuizGrid',
                    moreWrap: 'stQuizMoreWrap',
                    moreBtn: 'stQuizMoreBtn'
                }
            });
        })();

// Three.js 3D Celestial Sphere Engine (Mode 3)
        (function() {
            let scene, camera, renderer, controls;
            let earthMesh, axisLine, polarisStar, southernCrossGroup, celestialSphereGrid;
            let observerMarker, sightLine;
            let isInitialized = false;
            // Negative Z rotation tilts the north end of the axis to screen-right.
            // This direction is the reference used by the solstice calculations below.
            const AXIAL_TILT_RAD = -23.5 * (Math.PI / 180);

            function init3DCelestial() {
                const container = document.getElementById('celestial3dContainer');
                const canvas = document.getElementById('celestial3dCanvas');
                if (!container || !canvas) return;

                const width = container.clientWidth > 0 ? container.clientWidth : (container.parentElement.clientWidth > 0 ? container.parentElement.clientWidth : 900);
                const height = container.clientHeight > 0 ? container.clientHeight : 580;

                if (isInitialized) {
                    if (renderer && camera) {
                        camera.aspect = width / height;
                        camera.updateProjectionMatrix();
                        renderer.setSize(width, height);
                    }
                    return;
                }

                // Scene setup
                scene = new THREE.Scene();
                scene.background = new THREE.Color(0x020617);

                // Camera
                camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
                camera.position.set(0, 6, 48);

                // Renderer
                renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
                renderer.setSize(width, height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

                // Controls
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;

                // Lighting
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
                scene.add(ambientLight);
                const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
                dirLight.position.set(20, 10, 20);
                scene.add(dirLight);

                // 1. Earth Mesh
                const earthGeo = new THREE.SphereGeometry(3.5, 32, 32);
                const earthMat = new THREE.MeshPhongMaterial({
                    color: 0x1d4ed8,
                    emissive: 0x0284c7,
                    emissiveIntensity: 0.2,
                    wireframe: false
                });
                earthMesh = new THREE.Mesh(earthGeo, earthMat);
                // Tilt the north end of Earth's axis 23.5 degrees to screen-right.
                earthMesh.rotation.z = AXIAL_TILT_RAD;
                scene.add(earthMesh);

                // Earth Equator Line
                const eqGeo = new THREE.RingGeometry(3.52, 3.6, 64);
                const eqMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
                const eqMesh = new THREE.Mesh(eqGeo, eqMat);
                eqMesh.rotation.x = Math.PI / 2;
                earthMesh.add(eqMesh);

                // 2. Earth Rotational Axis (23.5 deg tilted long cyan line)
                const axisGeo = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, -18, 0),
                    new THREE.Vector3(0, 18, 0)
                ]);
                const axisMat = new THREE.LineDashedMaterial({ color: 0x38bdf8, dashSize: 0.5, gapSize: 0.2 });
                axisLine = new THREE.Line(axisGeo, axisMat);
                axisLine.computeLineDistances();
                // Rotational Axis attached to fixed group
                fixedCelestialObjectsGroup = new THREE.Group();
                fixedCelestialObjectsGroup.rotation.z = AXIAL_TILT_RAD;
                fixedCelestialObjectsGroup.add(axisLine);

                // 3. Polaris & Circumpolar Group (North Pole: Polaris, Big Dipper, Cassiopeia)
                const northPoleGroup = new THREE.Group();
                northPoleGroup.position.set(0, 18, 0); // Top of North Axis

                // Polaris Central Star
                const polarisGeo = new THREE.SphereGeometry(0.65, 16, 16);
                const polarisMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
                const polarisStarMesh = new THREE.Mesh(polarisGeo, polarisMat);
                northPoleGroup.add(polarisStarMesh);

                const polarisLabel = createTextSprite("⭐ 북극성 (Polaris - 밝은 2.0등성)", "#fbbf24");
                polarisLabel.position.set(0, 1.8, 0);
                northPoleGroup.add(polarisLabel);

                const ncpLabel = createTextSprite("천구의 북극 (North Celestial Pole)", "#fbbf24");
                ncpLabel.position.set(0, 3.4, 0);
                northPoleGroup.add(ncpLabel);

                // --- 🌸 3D Big Dipper (북두칠성 7개 별 + 국자 모양 + Pointer Line) ---
                const bdGroup = new THREE.Group();
                const bdMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
                const bdLineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
                const bdPointerMat = new THREE.LineDashedMaterial({ color: 0x38bdf8, dashSize: 0.3, gapSize: 0.2 });

                // 7 Star Positions relative to Polaris
                const bdStars = [
                    new THREE.Vector3(-4.0, -1.0, 3.5),  // 0: Merak (Pointer 1)
                    new THREE.Vector3(-3.0, -0.5, 2.2),  // 1: Dubhe (Pointer 2)
                    new THREE.Vector3(-5.0, -1.8, 2.8),  // 2: Phecda
                    new THREE.Vector3(-4.2, -1.4, 1.5),  // 3: Megrez
                    new THREE.Vector3(-5.2, -1.8, 0.4),  // 4: Alioth
                    new THREE.Vector3(-6.2, -2.2, -0.6), // 5: Mizar
                    new THREE.Vector3(-7.2, -2.6, -1.8)  // 6: Alkaid
                ];

                bdStars.forEach((p, idx) => {
                    const starMesh = new THREE.Mesh(new THREE.SphereGeometry(idx === 1 ? 0.45 : 0.35, 12, 12), bdMat);
                    starMesh.position.copy(p);
                    bdGroup.add(starMesh);
                });

                // Bowl Lines (0 -> 1 -> 3 -> 2 -> 0)
                const bowlGeo = new THREE.BufferGeometry().setFromPoints([bdStars[0], bdStars[1], bdStars[3], bdStars[2], bdStars[0]]);
                bdGroup.add(new THREE.Line(bowlGeo, bdLineMat));

                // Handle Line (3 -> 4 -> 5 -> 6)
                const handleGeo = new THREE.BufferGeometry().setFromPoints([bdStars[3], bdStars[4], bdStars[5], bdStars[6]]);
                bdGroup.add(new THREE.Line(handleGeo, bdLineMat));

                // Pointer Line (Merak -> Dubhe -> Polaris 0,0,0)
                const pointerGeo = new THREE.BufferGeometry().setFromPoints([bdStars[0], bdStars[1], new THREE.Vector3(0,0,0)]);
                const pointerLine = new THREE.Line(pointerGeo, bdPointerMat);
                pointerLine.computeLineDistances();
                bdGroup.add(pointerLine);

                const bdLabel = createTextSprite("✨ 북두칠성 (Big Dipper)", "#38bdf8");
                bdLabel.position.set(-4.5, 0.8, 1.5);
                bdGroup.add(bdLabel);
                northPoleGroup.add(bdGroup);

                // --- 🍁 3D Cassiopeia (카시오페이아 5개 별 + W자 모양) ---
                const casGroup = new THREE.Group();
                const casMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
                const casLineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });

                const casStars = [
                    new THREE.Vector3(3.5, -1.0, -3.5), // Caph
                    new THREE.Vector3(4.2, -1.2, -2.2), // Schedar
                    new THREE.Vector3(5.0, -1.5, -3.2), // Navi
                    new THREE.Vector3(5.8, -1.8, -2.0), // Ruchbah
                    new THREE.Vector3(6.5, -2.2, -2.8)  // Segin
                ];

                casStars.forEach(p => {
                    const starMesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), casMat);
                    starMesh.position.copy(p);
                    casGroup.add(starMesh);
                });

                const wLineGeo = new THREE.BufferGeometry().setFromPoints(casStars);
                casGroup.add(new THREE.Line(wLineGeo, casLineMat));

                const casLabel = createTextSprite("✨ 카시오페이아 (Cassiopeia)", "#38bdf8");
                casLabel.position.set(5.0, 0.8, -2.5);
                casGroup.add(casLabel);
                northPoleGroup.add(casGroup);

                fixedCelestialObjectsGroup.add(northPoleGroup);

                // 4. Southern Cross Group (At bottom of South Axis - Orient in X-Z Plane for 3D Cross View)
                southernCrossGroup = new THREE.Group();
                southernCrossGroup.position.set(4, -14, 5); // Positioned at ~60°S (Southern Cross is NOT at the South Celestial Pole!)

                const scMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
                // 5 Stars of Southern Cross in X-Z plane (normal to Earth sightline)
                const scPositions = [
                    [0, 0, 2.0],    // Acrux (Bottom)
                    [0, 0, -2.0],   // Gacrux (Top)
                    [-1.3, 0, -0.3],// Mimosa (Left)
                    [1.3, 0, -0.3], // Delta Crucis (Right)
                    [0.4, 0, 0.4]   // Epsilon Crucis (5th star)
                ];
                scPositions.forEach((p, idx) => {
                    const scStar = new THREE.Mesh(new THREE.SphereGeometry(idx === 0 ? 0.45 : 0.35, 12, 12), scMat);
                    scStar.position.set(p[0], p[1], p[2]);
                    southernCrossGroup.add(scStar);
                });

                // Connecting Lines for the Cross (+)
                const scLineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
                // Spine line (Top to Bottom)
                const spineGeo = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, 0, -2.0),
                    new THREE.Vector3(0, 0, 2.0)
                ]);
                southernCrossGroup.add(new THREE.Line(spineGeo, scLineMat));

                // Crossbar line (Left to Right)
                const crossbarGeo = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-1.3, 0, -0.3),
                    new THREE.Vector3(1.3, 0, -0.3)
                ]);
                southernCrossGroup.add(new THREE.Line(crossbarGeo, scLineMat));

                const scLabel = createTextSprite("✨ 남십자성 (Southern Cross)", "#38bdf8");
                scLabel.position.set(0, -2.5, 0);
                southernCrossGroup.add(scLabel);

                // South Celestial Pole Marker (Faint 5.5-mag South Star Sigma Octantis)
                const scpMarkerGroup = new THREE.Group();
                scpMarkerGroup.position.set(0, -18, 0);

                // Faint South Star (Sigma Octantis - 5.5 mag dim star dot, r=0.2)
                const scpStarGeo = new THREE.SphereGeometry(0.10, 10, 10);
                const scpStarMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
                const scpStarMesh = new THREE.Mesh(scpStarGeo, scpStarMat);
                scpMarkerGroup.add(scpStarMesh);

                const scpStarLabel = createTextSprite("⭐ 남극성 (Sigma Octantis - 어두운 5.5등성)", "#94a3b8");
                scpStarLabel.position.set(0, -1.6, 0);
                scpMarkerGroup.add(scpStarLabel);

                const scpLabel = createTextSprite("천구의 남극 (South Celestial Pole)", "#fbbf24");
                scpLabel.position.set(0, -3.2, 0);
                scpMarkerGroup.add(scpLabel);
                fixedCelestialObjectsGroup.add(scpMarkerGroup);
                fixedCelestialObjectsGroup.add(southernCrossGroup);
                scene.add(fixedCelestialObjectsGroup);

                // 5. Celestial Sphere Grid (Outer Translucent Wireframe)
                const csGeo = new THREE.SphereGeometry(18, 24, 18);
                const csMat = new THREE.MeshBasicMaterial({
                    color: 0x1e293b,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.25
                });
                celestialSphereGrid = new THREE.Mesh(csGeo, csMat);
                scene.add(celestialSphereGrid);

                // --- ✨ Celestial Equator (천구의 적도) & Vernal/Autumnal Equinoxes (춘분점/추분점) ---
                celestialEquatorGroup = new THREE.Group();
                // Tilt Celestial Equator by 23.5 degrees relative to Ecliptic
                celestialEquatorGroup.rotation.z = AXIAL_TILT_RAD;

                // Celestial Equator Cyan Ring
                const ceRingGeo = new THREE.RingGeometry(17.8, 18.2, 64);
                const ceRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
                const ceRingMesh = new THREE.Mesh(ceRingGeo, ceRingMat);
                ceRingMesh.rotation.x = Math.PI / 2;
                celestialEquatorGroup.add(ceRingMesh);

                const ceRingLabel = createTextSprite("🌐 천구의 적도 (지구 적도 연장선)", "#06b6d4");
                ceRingLabel.position.set(0, 19.5, 0); // Positioned high on Cyan Ring away from Ecliptic intersection!
                celestialEquatorGroup.add(ceRingLabel);

                // 🌸 Vernal Equinox (춘분점 - Exact Ring Intersection 1 at Z = +18)
                const veDot = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
                veDot.position.set(0, 0, 18);
                celestialEquatorGroup.add(veDot);
                const veLabel = createTextSprite("춘분점 (3월 21일 적도 교차점)", "#f97316");
                veLabel.position.set(0, 1.8, 18);
                celestialEquatorGroup.add(veLabel);

                // 🍁 Autumnal Equinox (추분점 - Exact Ring Intersection 2 at Z = -18)
                const aeDot = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
                aeDot.position.set(0, 0, -18);
                celestialEquatorGroup.add(aeDot);
                const aeLabel = createTextSprite("추분점 (9월 23일 적도 교차점)", "#f97316");
                aeLabel.position.set(0, 1.8, -18);
                celestialEquatorGroup.add(aeLabel);

                // ☀️ Summer Solstice (하지점 - Point on Ecliptic at +X)
                const ssDot = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
                ssDot.position.set(18, 0, 0);
                celestialEquatorGroup.add(ssDot);
                const ssLabel = createTextSprite("하지점 (6월 22일)", "#f97316");
                ssLabel.position.set(18, 1.8, 0);
                celestialEquatorGroup.add(ssLabel);

                // ❄️ Winter Solstice (동지점 - Point on Ecliptic at -X)
                const wsDot = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
                wsDot.position.set(-18, 0, 0);
                celestialEquatorGroup.add(wsDot);
                const wsLabel = createTextSprite("동지점 (12월 22일)", "#f97316");
                wsLabel.position.set(-18, 1.8, 0);
                celestialEquatorGroup.add(wsLabel);

                // Default state: OFF (Hidden)
                celestialEquatorGroup.visible = false;
                scene.add(celestialEquatorGroup); // Added to scene so it stays fixed at 23.5° tilt intersecting Ecliptic!

                // --- ☀️ 3D Sun Orbiting Along Ecliptic Ring ---
                const sun3DGeo = new THREE.SphereGeometry(0.9, 16, 16);
                const sun3DMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
                sun3DMesh = new THREE.Mesh(sun3DGeo, sun3DMat);
                const sun3DLabel = createTextSprite("☀️ 태양 (황도 이동)", "#fbbf24");
                sun3DLabel.position.set(0, 1.8, 0);
                sun3DMesh.add(sun3DLabel);
                scene.add(sun3DMesh);

                // Ecliptic Plane Yellow Ring (Horizontal 0 deg)
                const eclGeo = new THREE.RingGeometry(17.8, 18.2, 64);
                const eclMat = new THREE.MeshBasicMaterial({ color: 0xfde047, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
                const eclRing = new THREE.Mesh(eclGeo, eclMat);
                eclRing.rotation.x = Math.PI / 2;
                scene.add(eclRing);

                // Ecliptic Label
                const eclLabel = createTextSprite("황도 (태양의 겉보기 길)", "#fde047");
                const axisLabel = createTextSprite("지구 자전축 (23.5° Tilt Axis)", "#38bdf8");
                axisLabel.position.set(0, 10, 0);
                earthMesh.add(axisLabel);
                eclLabel.position.set(19.5, 0, -8);
                scene.add(eclLabel);

                // 6. Observer Ground Disk (Circle platform under person with green Korea / Australia map outlines)
                // Preload the user's exact transparent Korea map image via INLINE Base64 Data URL (Solves CORS/file:// taint completely)
                const KOREA_MAP_BASE64 = "data:image/png;base64,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";
                const userKoreaImg = new Image();
                userKoreaImg.src = KOREA_MAP_BASE64;
                userKoreaImg.onload = function() {
                    if (window.groundDiskTextures && typeof createGroundDiskTexture === 'function') {
                        window.groundDiskTextures.korea = createGroundDiskTexture('korea');
                        if (observerMarker && observerMarker.groundDiskMesh) {
                            observerMarker.groundDiskMesh.material.map = window.groundDiskTextures.korea;
                            observerMarker.groundDiskMesh.material.needsUpdate = true;
                        }
                    }
                };

                function drawKoreaMap(ctx, cx, cy, size) {
                    ctx.save();
                    if (userKoreaImg.complete && userKoreaImg.naturalWidth > 0) {
                        const targetW = size * 0.78;
                        const targetH = targetW * (userKoreaImg.naturalHeight / userKoreaImg.naturalWidth);

                        ctx.shadowColor = '#4ade80';
                        ctx.shadowBlur = 16;
                        ctx.drawImage(userKoreaImg, cx - targetW / 2, cy - targetH / 2, targetW, targetH);
                    }
                    ctx.restore();
                }

                function drawAustraliaMap(ctx, cx, cy, size) {
                    ctx.save();
                    ctx.beginPath();

                    const points = [
                        [ 0.26, -0.42], // 1. Cape York Peninsula Tip
                        [ 0.28, -0.32], // 2. Princess Charlotte Bay
                        [ 0.34, -0.22], // 3. Cairns
                        [ 0.39, -0.10], // 4. Townsville
                        [ 0.44,  0.02], // 5. Rockhampton
                        [ 0.46,  0.15], // 6. Brisbane
                        [ 0.42,  0.24], // 7. Byron Bay
                        [ 0.38,  0.32], // 8. Sydney
                        [ 0.32,  0.38], // 9. Cape Howe
                        [ 0.24,  0.42], // 10. Melbourne Coas
                        [ 0.16,  0.40], // 11. Geelong
                        [ 0.10,  0.36], // 12. Discovery Bay
                        [ 0.05,  0.31], // 13. Adelaide
                        [-0.01,  0.34], // 14. Spencer Gulf Notch
                        [-0.04,  0.27], // 15. Eyre Peninsula Tip
                        [-0.14,  0.24], // 16. Great Australian Bight Eas
                        [-0.24,  0.26], // 17. Great Australian Bight Center
                        [-0.34,  0.24], // 18. Great Australian Bight Wes
                        [-0.42,  0.28], // 19. Albany
                        [-0.46,  0.22], // 20. Cape Leeuwin
                        [-0.45,  0.10], // 21. Perth
                        [-0.43, -0.02], // 22. Geraldton
                        [-0.47, -0.10], // 23. Shark Bay Notch
                        [-0.42, -0.20], // 24. North West Cape
                        [-0.36, -0.24], // 25. Port Hedland
                        [-0.28, -0.22], // 26. Broome
                        [-0.24, -0.30], // 27. Kimberley Coas
                        [-0.16, -0.32], // 28. Joseph Bonaparte Gulf
                        [-0.08, -0.38], // 29. Darwin
                        [-0.02, -0.36], // 30. Arnhem Land
                        [ 0.04, -0.24], // 31. Gulf of Carpentaria Wes
                        [ 0.12, -0.22], // 32. Gulf of Carpentaria Bottom
                        [ 0.20, -0.30], // 33. Gulf of Carpentaria Eas
                        [ 0.24, -0.38]  // 34. Cape York Peninsula West Coas
                    ];

                    ctx.moveTo(cx + points[0][0] * size, cy + points[0][1] * size);
                    for (let i = 1; i < points.length; i++) {
                        ctx.lineTo(cx + points[i][0] * size, cy + points[i][1] * size);
                    }
                    ctx.closePath();

                    ctx.fillStyle = 'rgba(34, 197, 94, 0.50)';
                    ctx.shadowColor = '#4ade80';
                    ctx.shadowBlur = 14;
                    ctx.fill();

                    ctx.lineWidth = 4;
                    ctx.strokeStyle = '#4ade80';
                    ctx.stroke();

                    // Tasmania Island
                    ctx.beginPath();
                    const tasPoints = [
                        [ 0.25, 0.48],
                        [ 0.32, 0.52],
                        [ 0.28, 0.60],
                        [ 0.22, 0.56]
                    ];
                    ctx.moveTo(cx + tasPoints[0][0] * size, cy + tasPoints[0][1] * size);
                    for (let i = 1; i < tasPoints.length; i++) {
                        ctx.lineTo(cx + tasPoints[i][0] * size, cy + tasPoints[i][1] * size);
                    }
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(34, 197, 94, 0.65)';
                    ctx.fill();
                    ctx.stroke();

                    ctx.restore();
                }

                function createGroundDiskTexture(locationType) {
                    const canvas = document.createElement('canvas');
                    canvas.width = 512;
                    canvas.height = 512;
                    const ctx = canvas.getContext('2d');
                    const cx = 256, cy = 256, r = 240;

                    ctx.clearRect(0, 0, 512, 512);

                    // Base circle disk
                    ctx.beginPath();
                    ctx.arc(cx, cy, r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
                    ctx.fill();

                    // Outer glowing green border
                    ctx.lineWidth = 14;
                    ctx.strokeStyle = '#22c55e';
                    ctx.shadowColor = '#4ade80';
                    ctx.shadowBlur = 16;
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Inner ring accen
                    ctx.beginPath();
                    ctx.arc(cx, cy, r - 22, 0, Math.PI * 2);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
                    ctx.stroke();

                    // Compass ticks
                    const tickLen = 18;
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - r + 12); ctx.lineTo(cx, cy - r + 12 + tickLen);
                    ctx.moveTo(cx, cy + r - 12); ctx.lineTo(cx, cy + r - 12 - tickLen);
                    ctx.moveTo(cx - r + 12, cy); ctx.lineTo(cx - r + 12 + tickLen, cy);
                    ctx.moveTo(cx + r - 12, cy); ctx.lineTo(cx + r - 12 - tickLen, cy);
                    ctx.stroke();

                    if (locationType === 'korea') {
                        drawKoreaMap(ctx, cx, cy, 320);
                    } else if (locationType === 'australia') {
                        drawAustraliaMap(ctx, cx, cy, 300);
                    }

                    const texture = new THREE.CanvasTexture(canvas);
                    texture.needsUpdate = true;
                    return texture;
                }

                window.groundDiskTextures = {
                    korea: createGroundDiskTexture('korea'),
                    australia: createGroundDiskTexture('australia'),
                    plain: createGroundDiskTexture('plain')
                };

                // 6. Observer Marker (Cute 3D Person Standing Erect on Earth with Yellow Cap, Torso, Arms, Legs)
                observerMarker = new THREE.Group();

                // Add Ground Disk under observer feet (Visibly positioned on Earth surface)
                const groundDiskMat = new THREE.MeshBasicMaterial({
                    map: window.groundDiskTextures.korea,
                    side: THREE.DoubleSide,
                    transparent: true,
                    depthWrite: false
                });
                const groundDiskMesh = new THREE.Mesh(new THREE.CircleGeometry(1.60, 48), groundDiskMat);
                groundDiskMesh.rotation.x = -Math.PI / 2;
                groundDiskMesh.position.set(0, 0.05, 0);
                groundDiskMesh.renderOrder = 999;
                observerMarker.add(groundDiskMesh);
                observerMarker.groundDiskMesh = groundDiskMesh;

                const obsRedMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
                const obsCapMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 }); // Bright Yellow Cap/Ha

                // 🎩 Stylish Brimmed Explorer Hat (Brim + Dark Band + Round Crown)
                const hatBandMat = new THREE.MeshBasicMaterial({ color: 0x0f172a }); // Slate Dark Ribbon

                // Brim (모자 챙)
                const brimMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.03, 16), obsCapMat);
                brimMesh.position.set(0, 0.54, 0);
                observerMarker.add(brimMesh);

                // Ribbon / Band (모자 띠)
                const bandMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.04, 16), hatBandMat);
                bandMesh.position.set(0, 0.57, 0);
                observerMarker.add(bandMesh);

                // Crown (모자 윗부분)
                const crownMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.18, 0.16, 16), obsCapMat);
                crownMesh.position.set(0, 0.65, 0);
                observerMarker.add(crownMesh);

                // 🧠 Head (Sphere)
                const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), obsRedMat);
                headMesh.position.set(0, 0.42, 0);
                observerMarker.add(headMesh);

                // 👕 Torso / Body (Cylinder)
                const bodyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.38, 12), obsRedMat);
                bodyMesh.position.set(0, 0.16, 0);
                observerMarker.add(bodyMesh);

                // 🦾 Arms (Left & Right)
                const lArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8), obsRedMat);
                lArm.position.set(0.18, 0.2, 0);
                lArm.rotation.z = -Math.PI / 6;
                observerMarker.add(lArm);

                const rArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8), obsRedMat);
                rArm.position.set(-0.18, 0.2, 0);
                rArm.rotation.z = Math.PI / 6;
                observerMarker.add(rArm);

                // 🦵 Legs (Left & Right)
                const lLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8), obsRedMat);
                lLeg.position.set(0.08, -0.15, 0);
                observerMarker.add(lLeg);

                const rLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8), obsRedMat);
                rLeg.position.set(-0.08, -0.15, 0);
                observerMarker.add(rLeg);

                earthMesh.add(observerMarker);

                // Observer Zenith & Nadir Sight Line (Red Lines attached to Earth)
                const sightMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 3 });
                const sightGeo = new THREE.BufferGeometry();
                sightLine = new THREE.Line(sightGeo, sightMat);
                earthMesh.add(sightLine);

                // Physical 3D Red Sphere Dots at Zenith & Nadir Points on Celestial Sphere Wireframe
                const redDotGeo = new THREE.SphereGeometry(0.12, 10, 10);
                const redDotMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
                zenithDotMesh = new THREE.Mesh(redDotGeo, redDotMat);
                nadirDotMesh = new THREE.Mesh(redDotGeo, redDotMat);
                earthMesh.add(zenithDotMesh);
                earthMesh.add(nadirDotMesh);

                // Zenith Label & Nadir Label (Clean Text Sprites without emoji)
                zenithLabel = createTextSprite("천정 (Zenith - 관측자 머리 위)", "#ef4444");
                nadirLabel = createTextSprite("천저 (Nadir - 관측자 발 아래)", "#ef4444");
                earthMesh.add(zenithLabel);
                earthMesh.add(nadirLabel);

                // Set initial observer to Korea (37.5 N)
                setObserverLatitude(37.5);

                // Event Listeners for Observer Buttons (Includes Altitude = Latitude proof)
                const btnEquatorToggle = document.getElementById('btnToggleEquator');
                if (btnEquatorToggle) {
                    btnEquatorToggle.onclick = function() {
                        if (celestialEquatorGroup) {
                            celestialEquatorGroup.visible = !celestialEquatorGroup.visible;
                            if (celestialEquatorGroup.visible) {
                                this.style.background = '#0284c7';
                                this.style.color = '#ffffff';
                                this.textContent = '✨ 천구 적도 & 춘/추분점 (ON)';
                            } else {
                                this.style.background = 'transparent';
                                this.style.color = '#06b6d4';
                                this.textContent = '✨ 천구 적도 & 춘/추분점 (OFF)';
                            }
                        }
                    };
                }

                const btnKorea = document.getElementById('btnObsKorea');
                const btnEquator = document.getElementById('btnObsEquator');
                const btnNorth = document.getElementById('btnObsNorth');
                const btnAus = document.getElementById('btnObsAus');
                const statusTitle = document.getElementById('obsViewStatusTitle');
                const statusDetail = document.getElementById('obsViewStatusDetail');

                function updateObsBtns(activeBtn) {
                    [btnKorea, btnEquator, btnNorth, btnAus].forEach(b => {
                        if(b) {
                            b.classList.remove('active');
                            b.style.background = 'rgba(15, 23, 42, 0.85)';
                        }
                    });
                    if(activeBtn) {
                        activeBtn.classList.add('active');
                        activeBtn.style.background = '#0284c7';
                    }
                }

                if(btnKorea) {
                    btnKorea.onclick = function() {
                        setObserverLatitude(37.5);
                        updateObsBtns(this);
                        if(statusTitle) statusTitle.textContent = "📍 관측자 위도 (37.5°N) = ⭐ 북극성 고도 (37.5°)";
                        if(statusDetail) statusDetail.textContent = "💡 한국(중위도 37.5°N)에서는 북쪽 지평선으로부터 북극성까지의 높이각(고도)이 정확히 37.5°로 보입니다!";
                    };
                }
                if(btnEquator) {
                    btnEquator.onclick = function() {
                        setObserverLatitude(0);
                        updateObsBtns(this);
                        if(statusTitle) statusTitle.textContent = "📍 관측자 위도 (0° 적도) = ⭐ 북극성 고도 (0°)";
                        if(statusDetail) statusDetail.textContent = "💡 적도(위도 0°)에서는 북극성이 북쪽 지평선 바로 위(고도 0°)에 걸쳐서 보입니다!";
                    };
                }
                if(btnNorth) {
                    btnNorth.onclick = function() {
                        setObserverLatitude(90);
                        updateObsBtns(this);
                        if(statusTitle) statusTitle.textContent = "📍 관측자 위도 (90°N 북극점) = ⭐ 북극성 고도 (90°)";
                        if(statusDetail) statusDetail.textContent = "💡 북극점(위도 90°N)에서는 북극성이 관측자 머리 정중앙 천정(고도 90°)에 위치합니다!";
                    };
                }
                if(btnAus) {
                    btnAus.onclick = function() {
                        setObserverLatitude(-35);
                        updateObsBtns(this);
                        if(statusTitle) statusTitle.textContent = "📍 관측자 위도 (35°S 남반구) ➔ ⭐ 북극성 관측 불가";
                        if(statusDetail) statusDetail.textContent = "💡 남반구에서는 지구가 북극성을 가리므로 북극성이 지평선 아래에 위치해 보이지 않으며, 남십자성이 관측됩니다!";
                    };
                }

                // Animation loop (Supports Speed Control & Dual View Perspectives)
                let celestialViewMode = 'celestial'; // 'celestial' or 'space'
                let celestialSpeedMult = 1.0; // Rotation speed multiplier
                let sunEclipticAngle = Math.PI / 2;
                const baseEarthRotStep = 0.015; // Base speed

                // Speed Slider & Preset Handlers
                window.setCelestialSpeed = function(val) {
                    celestialSpeedMult = parseFloat(val);
                    const slider = document.getElementById('celestialSpeedSlider');
                    if (slider) slider.value = val;
                    updateSpeedBadgeLabel();
                };

                function updateSpeedBadgeLabel() {
                    const badge = document.getElementById('celestialSpeedBadge');
                    if (!badge) return;
                    if (celestialSpeedMult === 0) badge.textContent = '0.0x (정지)';
                    else if (celestialSpeedMult === 1.0) badge.textContent = '1.0x (보통)';
                    else if (celestialSpeedMult === 3.0) badge.textContent = '3.0x (3배속)';
                    else if (celestialSpeedMult === 10.0) badge.textContent = '10.0x (고속)';
                    else if (celestialSpeedMult === 30.0) badge.textContent = '30.0x (30배속)';
                    else badge.textContent = `${celestialSpeedMult.toFixed(0)}x`;
                }

                const speedSlider = document.getElementById('celestialSpeedSlider');
                if (speedSlider) {
                    speedSlider.oninput = function() {
                        celestialSpeedMult = parseFloat(this.value);
                        updateSpeedBadgeLabel();
                    };
                }

                // View Mode Toggle Handler
                const btnToggleViewMode = document.getElementById('btnToggleViewMode');
                if (btnToggleViewMode) {
                    btnToggleViewMode.onclick = function() {
                        if (celestialViewMode === 'celestial') {
                            celestialViewMode = 'space';
                            this.textContent = '🚀 우주 실체 뷰 (지구 자전)';
                            this.style.background = '#0284c7';
                            this.style.color = '#ffffff';
                        } else {
                            celestialViewMode = 'celestial';
                            this.textContent = '🌐 천구 겉보기 뷰 (사람 고정)';
                            this.style.background = 'transparent';
                            this.style.color = '#fbbf24';
                        }
                    };
                }

                function animate3D() {
                    requestAnimationFrame(animate3D);
                    // One tropical year contains 366.2422 inertial Earth turns but
                    // 365.2422 mean solar days. The space view uses the inertial rate.
                    const currentEarthStep = baseEarthRotStep * celestialSpeedMult;
                    const currentSunStep = (baseEarthRotStep / 366.2422) * celestialSpeedMult;

                    if (celestialViewMode === 'space') {
                        // Space Real View: Earth rotates, Celestial Sphere is static
                        if (earthMesh && currentEarthStep !== 0) earthMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), currentEarthStep);
                    } else {
                        // Celestial Apparent View: Earth/Observer fixed, Celestial Sphere rotates Counter-Clockwise
                        if (fixedCelestialObjectsGroup && currentEarthStep !== 0) {
                            fixedCelestialObjectsGroup.rotateOnAxis(new THREE.Vector3(0, 1, 0), -currentEarthStep);
                        }
                        if (celestialSphereGrid && currentEarthStep !== 0) {
                            celestialSphereGrid.rotateY(-currentEarthStep);
                        }
                    }

                    if (sun3DMesh && currentSunStep !== 0) {
                        sunEclipticAngle -= currentSunStep;
                        sun3DMesh.position.set(18 * Math.cos(sunEclipticAngle), 0, 18 * Math.sin(sunEclipticAngle));
                    }

                    controls.update();
                    renderer.render(scene, camera);
                }
                animate3D();

                // Export global 3D view reset function
                window.reset3DCelestialView = function() {
                    if (camera && controls) {
                        camera.position.set(0, 18, 42);
                        controls.target.set(0, 0, 0);
                        controls.update();
                    }
                    if (window.setCelestialSpeed) window.setCelestialSpeed(1.0);
                    const btnKorea = document.getElementById('btnObsKorea');
                    if (btnKorea) btnKorea.click();
                };

                isInitialized = true;
            }

            function setObserverLatitude(latDeg) {
                if(!observerMarker) return;

                if (observerMarker.groundDiskMesh && window.groundDiskTextures) {
                    if (Math.abs(latDeg - 37.5) < 0.1) {
                        observerMarker.groundDiskMesh.material.map = window.groundDiskTextures.korea;
                    } else if (Math.abs(latDeg - (-35)) < 2.0 || Math.abs(latDeg - (-35.3)) < 2.0) {
                        observerMarker.groundDiskMesh.material.map = window.groundDiskTextures.australia;
                    } else {
                        observerMarker.groundDiskMesh.material.map = window.groundDiskTextures.plain;
                    }
                    observerMarker.groundDiskMesh.material.needsUpdate = true;
                }
                const latRad = latDeg * (Math.PI / 180);
                const rEarth = 3.5;
                const rSky = 18.0;

                // Position 3D Person on Earth sphere
                const oy = rEarth * Math.sin(latRad);
                const oz = rEarth * Math.cos(latRad);
                observerMarker.position.set(0, oy, oz);

                // Orient person standing ERECT facing straight UP away from Earth center (Normal Vector)
                const normalDir = new THREE.Vector3(0, Math.sin(latRad), Math.cos(latRad)).normalize();
                observerMarker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalDir);

                // Zenith (천정) & Nadir (천저) Red Sight Line (-rSky to +rSky)
                const zy = rSky * Math.sin(latRad);
                const zz = rSky * Math.cos(latRad);

                if (sightLine) {
                    const points = [
                        new THREE.Vector3(0, -zy, -zz), // Nadir (발 밑)
                        new THREE.Vector3(0, zy, zz)   // Zenith (머리 위)
                    ];
                    sightLine.geometry.setFromPoints(points);
                    sightLine.geometry.attributes.position.needsUpdate = true;
                }

                // Position physical 3D Red Sphere Dots exactly on the Celestial Sphere wireframe
                if (zenithDotMesh) zenithDotMesh.position.set(0, zy, zz);
                if (nadirDotMesh) nadirDotMesh.position.set(0, -zy, -zz);

                // Position 3D Zenith & Nadir Text Labels next to physical dots
                if (zenithLabel) zenithLabel.position.set(0, zy + 1.2, zz);
                if (nadirLabel) nadirLabel.position.set(0, -zy - 1.2, -zz);
            }

            function createTextSprite(text, colorStr) {
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');
                ctx.font = 'Bold 20px sans-serif';
                ctx.fillStyle = colorStr;
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 6;
                ctx.fillText(text, 256, 40);

                const texture = new THREE.CanvasTexture(canvas);
                const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
                const sprite = new THREE.Sprite(spriteMat);
                sprite.scale.set(10, 1.25, 1);
                return sprite;
            }

            // Trigger init & resize when Mode 3 is selected
            const modeBtns = document.querySelectorAll('.sim-mode-btn');
            modeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.dataset.simMode === '3ddepth') {
                        setTimeout(init3DCelestial, 100);
                    }
                });
            });
            window.addEventListener('resize', () => {
                if (isInitialized) init3DCelestial();
            });
        })();
