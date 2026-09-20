(function syncSpaceViewportHeight() {
    // The nav tabs float over the viewport instead of reserving a header
    // row, so the simulation card no longer needs to subtract its height.
    document.documentElement.style.setProperty('--space-header-height', '0px');
})();

// Tab Navigation Logic
        const tabs = document.querySelectorAll('.nav-tab');
        const panes = document.querySelectorAll('.tab-pane');
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                panes[index].classList.add('active');
            });
        });

        // Earth–Moon / seasonal solar-altitude simulator switch
        (function() {
            const buttons = document.querySelectorAll('.em-simulator-switch-btn');
            const moonPanel = document.getElementById('emMoonSimulator');
            const sunPathPanel = document.getElementById('emSunPathSimulator');
            if (!buttons.length || !moonPanel || !sunPathPanel) return;

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const showSunPath = button.dataset.emSimulator === 'sunpath';
                    buttons.forEach(item => {
                        const selected = item === button;
                        item.classList.toggle('active', selected);
                        item.setAttribute('aria-pressed', selected ? 'true' : 'false');
                    });
                    moonPanel.hidden = showSunPath;
                    sunPathPanel.hidden = !showSunPath;
                    moonPanel.classList.toggle('active', !showSunPath);
                    sunPathPanel.classList.toggle('active', showSunPath);
                    window.dispatchEvent(new Event('resize'));
                });
            });
        })();

        // Heliocentric 3D Engine
        (function() {
            const container = document.getElementById('emCanvasContainer');
            const spacePane = document.getElementById('emMoonSpacePane');
            const canvas = document.getElementById('em3DCanvas');
            const seasonLabelsOverlay = document.getElementById('emSeasonLabelsOverlay');
            const observerView = document.getElementById('emMoonMyView');
            const observerSkyCanvas = document.getElementById('emMoonSkyCanvas');
            const observerSkyCaption = document.getElementById('emMoonSkyCaption');
            const observerSkyLunarClock = document.getElementById('emMoonSkyLunarClock');
            const observerSkyPhase = document.getElementById('emMoonSkyPhase');
            const observerSkyStatus = document.getElementById('emMoonSkyStatus');
            if (!container || !spacePane || !canvas || !observerView || !observerSkyCanvas || typeof THREE === 'undefined') return;
            const seasonRaycaster = new THREE.Raycaster();
            const seasonOcclusionRaycaster = new THREE.Raycaster();
            const seasonPointer = new THREE.Vector2();
            const seasonLabelWorldPosition = new THREE.Vector3();
            const seasonLabelProjectedPosition = new THREE.Vector3();
            const seasonOcclusionDirection = new THREE.Vector3();
            const seasonBodyWorldPosition = new THREE.Vector3();
            const seasonBodyEdgePosition = new THREE.Vector3();
            const seasonBodyProjectedPosition = new THREE.Vector3();
            const seasonBodyEdgeProjectedPosition = new THREE.Vector3();
            const seasonCameraUp = new THREE.Vector3();
            const seasonGuideStartWorld = new THREE.Vector3();
            const seasonGuideEndWorld = new THREE.Vector3();
            const seasonGuideStartProjected = new THREE.Vector3();
            const seasonGuideEndProjected = new THREE.Vector3();
            const seasonScreenLabels = [];
            let seasonPointerDown = null;

            let scene, camera, renderer, controls;
            let sunMesh, earthSystemGroup, earthMesh, earthTiltReference, earthSpinGroup, moonPivot, moonMesh;
            let earthOrbitLine, moonOrbitLine, sunLightLinesGroup, seasonPointsGroup;
            let earthAxisLine, observerMarker, observerDiskMaterial;
            let observerDiskTextures = {};
            const SUN_ORBIT_RADIUS = 135.0;
            const MOON_ORBIT_RADIUS = 34.0;
            const CALENDAR_DAYS_PER_YEAR = 365;
            const TROPICAL_YEAR_DAYS = 365.2422;
            const EARTH_ROTATIONS_PER_YEAR = TROPICAL_YEAR_DAYS + 1;
            const LUNAR_SIDEREAL_MONTH_DAYS = 27.321661;
            const LUNAR_SIDEREAL_ORBITS_PER_YEAR = TROPICAL_YEAR_DAYS / LUNAR_SIDEREAL_MONTH_DAYS;
            // moonRelAngle is measured from the moving Sun-Earth line. Subtracting
            // Earth's one annual orbit converts sidereal lunar orbits to phase cycles.
            const LUNAR_SYNODIC_CYCLES_PER_YEAR = LUNAR_SIDEREAL_ORBITS_PER_YEAR - 1;
            const SYNODIC_MONTH_DAYS = TROPICAL_YEAR_DAYS / LUNAR_SYNODIC_CYCLES_PER_YEAR;
            const HOURS_PER_YEAR = TROPICAL_YEAR_DAYS * 24;
            const JANUARY_FIRST_ORBIT_ANGLE = (10 / TROPICAL_YEAR_DAYS) * Math.PI * 2;
            const OVERVIEW_FRAMING_Y = -34;
            const SOLAR_OVERVIEW_CAMERA_POSITION = new THREE.Vector3(0, 190 + OVERVIEW_FRAMING_Y, 300);
            const SOLAR_OVERVIEW_TARGET = new THREE.Vector3(0, OVERVIEW_FRAMING_Y, 0);
            const EARTH_TRACK_CAMERA_OFFSET = new THREE.Vector3(0, 64, 112);
            // Negative Z rotation makes the north end lean 23.44 degrees to screen-right.
            const EARTH_AXIAL_TILT_RAD = -23.44 * (Math.PI / 180);

            // January 1 begins about ten days after the northern winter solstice.
            let earthOrbitAngle = JANUARY_FIRST_ORBIT_ANGLE;
            let earthSpinAngle = Math.PI / 2 + JANUARY_FIRST_ORBIT_ANGLE;
            let elapsedSimulationHours = 0;
            let moonRelAngle = 0; // Lunar month begins at New Moon (lunar January 1, 0deg).
            let currentObserverLatitude = 37.5;
            let currentObserverKey = 'korea';
            let currentObserverPlace = '한국';

            let isPlaying = true;
            let speed = 1.0;
            let viewMode = 'solarOverview'; // Default view mode: Solar System Overview

            // NASA LRO near-side image used for the familiar lunar-maria pattern.
            const moonNearsideImage = new Image();
            moonNearsideImage.decoding = 'async';
            moonNearsideImage.onload = function() {
                draw2DMoonPhase(moonRelAngle);
            };
            moonNearsideImage.src = 'assets/images/moon-nearside-nasa.jpg';

            const phases = [
                { angleDeg: 0, name: "🌑 삭 (New Moon)", info: "남중: 정오 (12:00) | 관측 불가 (태양과 함께 이동)", calendar: "음력 1일 경 (삭)" },
                { angleDeg: 45, name: "🌒 초승달 (Waxing Crescent)", info: "남중: 오후 3시 (15:00) | 초저녁 서쪽 관측", calendar: "음력 3~4일 경 (초승)" },
                { angleDeg: 90, name: "🌓 상현달 (First Quarter)", info: "남중: 오후 6시 (18:00) | 초저녁 서쪽 관측", calendar: "음력 7~8일 경 (상현)" },
                { angleDeg: 135, name: "🌔 팽대달 (Waxing Gibbous)", info: "남중: 밤 9시 (21:00) | 저녁~한밤중 관측", calendar: "음력 10~11일 경" },
                { angleDeg: 180, name: "🌕 망 / 보름달 (Full Moon)", info: "남중: 자정 (00:00) | 밤새도록 관측 가능", calendar: "음력 15일 경 (망)" },
                { angleDeg: 225, name: "🌖 팽대달 (Waning Gibbous)", info: "남중: 새벽 3시 (03:00) | 한밤중~새벽 관측", calendar: "음력 18~19일 경" },
                { angleDeg: 270, name: "🌗 하현달 (Third Quarter)", info: "남중: 새벽 6시 (06:00) | 새벽 동쪽 관측", calendar: "음력 22~23일 경 (하현)" },
                { angleDeg: 315, name: "🌘 그믐달 (Waning Crescent)", info: "남중: 오전 9시 (09:00) | 새벽녘 동쪽 관측", calendar: "음력 27~28일 경 (그믐)" }
            ];

            function init3D() {
                const w = spacePane.clientWidth || 900;
                const h = spacePane.clientHeight || 520;

                scene = new THREE.Scene();
                camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1500);
                // Start far enough back to keep the Sun, Earth and the Moon's
                // complete orbit visible on the first visit.
                camera.position.copy(SOLAR_OVERVIEW_CAMERA_POSITION);

                renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
                renderer.setSize(w, h);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.setClearColor(0x030712);

                if (typeof THREE.OrbitControls !== 'undefined') {
                    controls = new THREE.OrbitControls(camera, renderer.domElement);
                    controls.enableDamping = true;
                    controls.dampingFactor = 0.05;
                    controls.target.copy(SOLAR_OVERVIEW_TARGET);
                    controls.maxDistance = 450;
                    controls.minDistance = 20;
                }

                // ☀️ 1. SUN (Center of Solar System: 0, 0, 0)
                const sunGeo = new THREE.SphereGeometry(16, 32, 32);
                const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
                sunMesh = new THREE.Mesh(sunGeo, sunMat);
                sunMesh.position.set(0, 0, 0);
                scene.add(sunMesh);

                // Sun Corona
                const coronaMesh = new THREE.Mesh(
                    new THREE.SphereGeometry(19, 32, 32),
                    new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.35, side: THREE.BackSide })
                );
                sunMesh.add(coronaMesh);

                // Sun Point & Directional Lights
                const sunPointLight = new THREE.PointLight(0xfffaed, 3.5, 900);
                sunPointLight.position.set(0, 0, 0);
                scene.add(sunPointLight);

                const sunDirLight = new THREE.DirectionalLight(0xfffaed, 2.8);
                sunDirLight.position.set(0, 0, 0);
                scene.add(sunDirLight);
                scene.add(sunDirLight.target);

                const ambLight = new THREE.AmbientLight(0x1e293b, 0.25);
                scene.add(ambLight);

                // Earth Orbit Line around Sun (Radius = SUN_ORBIT_RADIUS)
                const eOrbitGeo = new THREE.BufferGeometry();
                const eOrbitPts = [];
                for (let i = 0; i <= 96; i++) {
                    const a = (i / 96) * Math.PI * 2;
                    eOrbitPts.push(new THREE.Vector3(Math.cos(a) * SUN_ORBIT_RADIUS, 0, Math.sin(a) * SUN_ORBIT_RADIUS));
                }
                eOrbitGeo.setFromPoints(eOrbitPts);
                earthOrbitLine = new THREE.Line(eOrbitGeo, new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.25 }));
                scene.add(earthOrbitLine);

                // Keep the four seasonal landmarks visible in the lunar-based view.
                // The labels intentionally use simple season names rather than
                // solar-calendar equinox/solstice terminology.
                seasonPointsGroup = createSeasonPointsGroup();
                seasonPointsGroup.visible = true;
                scene.add(seasonPointsGroup);
                bindSeasonPointTimeTravel();

                // 🌍 2. EARTH-MOON SYSTEM GROUP (Orbits Sun at SUN_ORBIT_RADIUS)
                earthSystemGroup = new THREE.Group();
                scene.add(earthSystemGroup);

                // Earth Mesh inside System Group (at center 0,0,0 of system)
                const earthGeo = new THREE.SphereGeometry(10, 32, 32);
                const earthTex = createEarthCanvasTexture();
                const earthMat = new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.4 });
                earthMesh = new THREE.Mesh(earthGeo, earthMat);

                // Keep axial tilt and daily rotation on separate transforms.
                // This guarantees that the globe, equator and observer all spin
                // around Earth's own tilted north-south axis.
                earthTiltReference = new THREE.Group();
                earthTiltReference.rotation.z = EARTH_AXIAL_TILT_RAD;
                earthSystemGroup.add(earthTiltReference);

                earthSpinGroup = new THREE.Group();
                earthSpinGroup.rotation.y = earthSpinAngle;
                earthTiltReference.add(earthSpinGroup);
                earthSpinGroup.add(earthMesh);

                // Earth Atmosphere Glow
                const atmosMesh = new THREE.Mesh(
                    new THREE.SphereGeometry(11.2, 32, 32),
                    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.18, side: THREE.BackSide })
                );
                earthMesh.add(atmosMesh);

                // A surface-fixed red equator makes the latitude reference clear.
                // The torus starts in the XY plane, so rotate it into Earth's XZ equatorial plane.
                const equatorLine = new THREE.Mesh(
                    new THREE.TorusGeometry(10.18, 0.075, 8, 96),
                    new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0.95 })
                );
                equatorLine.rotation.x = Math.PI / 2;
                equatorLine.renderOrder = 10;
                earthMesh.add(equatorLine);

                // Earth-fixed teaching overlay for the tilted rotational axis.
                const axisGeo = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, -24, 0),
                    new THREE.Vector3(0, 24, 0)
                ]);
                const axisMat = new THREE.LineDashedMaterial({
                    color: 0x38bdf8,
                    dashSize: 1.2,
                    gapSize: 0.65,
                    transparent: true,
                    opacity: 0.95
                });
                earthAxisLine = new THREE.Line(axisGeo, axisMat);
                earthAxisLine.computeLineDistances();
                earthTiltReference.add(earthAxisLine);

                prepareObserverTextures();
                observerMarker = createObserverMarker();
                // The observer is a child of Earth, so the person and map platform rotate
                // together with the surface roughly 365 times during one orbit.
                earthMesh.add(observerMarker);
                setObserverLocation('korea');
                bindObserverControls();

                // 🌕 3. MOON PIVOT & MESH inside System Group
                moonPivot = new THREE.Object3D();
                earthSystemGroup.add(moonPivot);

                const moonGeo = new THREE.SphereGeometry(3.0, 24, 24);
                const moonTex = createMoonCanvasTexture();
                const moonMat = new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.8 });
                moonMesh = new THREE.Mesh(moonGeo, moonMat);
                moonMesh.position.set(MOON_ORBIT_RADIUS, 0, 0);
                moonPivot.add(moonMesh);

                // Moon Orbit Line Circle around Earth
                const mOrbitGeo = new THREE.BufferGeometry();
                const mOrbitPts = [];
                for (let i = 0; i <= 64; i++) {
                    const a = (i / 64) * Math.PI * 2;
                    mOrbitPts.push(new THREE.Vector3(Math.cos(a) * MOON_ORBIT_RADIUS, 0, Math.sin(a) * MOON_ORBIT_RADIUS));
                }
                mOrbitGeo.setFromPoints(mOrbitPts);
                moonOrbitLine = new THREE.Line(mOrbitGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 }));
                earthSystemGroup.add(moonOrbitLine);

                // ☀️ 4. Parallel sunlight rays stacked perpendicular to the orbital plane.
                // Their vertical spread makes the latitude-dependent incidence angle visible.
                sunLightLinesGroup = new THREE.Group();
                const rayMat = new THREE.LineDashedMaterial({
                    color: 0xfde047,
                    dashSize: 0.55,
                    gapSize: 0.35,
                    transparent: true,
                    opacity: 0.78
                });

                for (let offsetY = -9; offsetY <= 9; offsetY += 3) {
                    const rayGeo = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(0, 0, 0), // Will be updated dynamically
                        new THREE.Vector3(0, 0, 0)
                    ]);
                    const rayLine = new THREE.Line(rayGeo, rayMat);
                    // These endpoints move every frame. The initial geometry is
                    // degenerate at the origin, so a cached zero-sized bounding
                    // sphere can incorrectly cull every ray in Earth view.
                    rayLine.frustumCulled = false;
                    sunLightLinesGroup.add(rayLine);
                }
                scene.add(sunLightLinesGroup);

                // Window Resize
                const resizeRenderer = () => {
                    const nw = spacePane.clientWidth || 900;
                    const nh = spacePane.clientHeight || 520;
                    camera.aspect = nw / nh;
                    camera.updateProjectionMatrix();
                    renderer.setSize(nw, nh);
                    drawMoonObserverSky();
                };
                window.addEventListener('resize', resizeRenderer, { passive: true });
                window.addEventListener('earthmoon:view-resize', resizeRenderer);

                animate();
            }

            function createEarthCanvasTexture() {
                const c = document.createElement('canvas');
                c.width = 512; c.height = 256;
                const ctx = c.getContext('2d');
                ctx.fillStyle = '#0f3d69'; ctx.fillRect(0, 0, 512, 256);
                ctx.fillStyle = '#1e7045';
                for (let i = 0; i < 20; i++) {
                    ctx.beginPath();
                    ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 40 + 20, 0, Math.PI * 2);
                    ctx.fill();
                }
                return new THREE.CanvasTexture(c);
            }

            function createMoonCanvasTexture() {
                const c = document.createElement('canvas');
                c.width = 256; c.height = 128;
                const ctx = c.getContext('2d');
                ctx.fillStyle = '#cbd5e1'; ctx.fillRect(0, 0, 256, 128);
                ctx.fillStyle = '#a1a1aa';
                for (let i = 0; i < 35; i++) {
                    ctx.beginPath();
                    ctx.arc(Math.random() * 256, Math.random() * 128, Math.random() * 4 + 1, 0, Math.PI * 2);
                    ctx.fill();
                }
                return new THREE.CanvasTexture(c);
            }

            function createSeasonPointsGroup() {
                const group = new THREE.Group();
                const seasonPoints = [
                    // With the north axis leaning toward +X, Earth at -X is northern summer
                    // and Earth at +X is northern winter. The equinoxes lie at ±Z.
                    { angle: 0, dayOfYear: 355, icon: '❄️', label: '겨울', color: '#60a5fa' },
                    { angle: Math.PI / 2, dayOfYear: 79, icon: '🌸', label: '봄', color: '#fb7185' },
                    { angle: Math.PI, dayOfYear: 172, icon: '☀️', label: '여름', color: '#facc15' },
                    { angle: Math.PI * 1.5, dayOfYear: 265, icon: '🍁', label: '가을', color: '#fb923c' }
                ];

                seasonPoints.forEach(point => {
                    const x = Math.cos(point.angle) * SUN_ORBIT_RADIUS;
                    // From the north side of the ecliptic, increasing angles must move
                    // counter-clockwise. In Three.js's XZ plane that means negative Z.
                    const z = -Math.sin(point.angle) * SUN_ORBIT_RADIUS;
                    const color = new THREE.Color(point.color);

                    const icon = createSeasonIconSprite(point.icon, point.color);
                    icon.position.set(x, 2.2, z);
                    icon.renderOrder = 30;
                    icon.userData.seasonJump = point;
                    group.add(icon);

                    const guideMaterial = new THREE.LineDashedMaterial({
                        color: color,
                        dashSize: 0.7,
                        gapSize: 0.4,
                        transparent: true,
                        opacity: 0.78,
                        depthTest: true,
                        depthWrite: false
                    });
                    const guide = new THREE.Line(
                        new THREE.BufferGeometry().setFromPoints([
                            new THREE.Vector3(x, 5, z),
                            new THREE.Vector3(x, 8, z)
                        ]),
                        guideMaterial
                    );
                    guide.renderOrder = -100;
                    guide.computeLineDistances();
                    group.add(guide);

                    const labelAnchor = new THREE.Object3D();
                    labelAnchor.position.set(x, 11, z);
                    group.add(labelAnchor);
                    createSeasonScreenLabel(point, labelAnchor, icon, guide);
                });

                return group;
            }

            function createSeasonScreenLabel(point, anchor, icon, guide) {
                if (!seasonLabelsOverlay) return;

                const label = document.createElement('button');
                label.type = 'button';
                label.className = 'em-season-screen-label';
                label.textContent = point.label;
                label.style.setProperty('--season-color', point.color);
                label.setAttribute('aria-label', `${point.label} 계절 위치로 시간 이동`);
                label.addEventListener('click', function(event) {
                    event.stopPropagation();
                    jumpToSeasonPoint(point);
                });
                seasonLabelsOverlay.appendChild(label);
                seasonScreenLabels.push({ element: label, anchor, icon, guide });
            }

            function createSeasonIconSprite(icon, color) {
                const c = document.createElement('canvas');
                c.width = 256;
                c.height = 256;
                const ctx = c.getContext('2d');

                ctx.clearRect(0, 0, c.width, c.height);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '164px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
                ctx.shadowColor = color;
                ctx.shadowBlur = 22;
                ctx.fillText(icon, 128, 136);
                // Reinforce the opaque emoji core after drawing its glow. At
                // overview scale a single antialiased pass made the spring
                // equinox blossom look uniquely translucent.
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
                ctx.fillText(icon, 128, 136);

                const texture = new THREE.CanvasTexture(c);
                texture.needsUpdate = true;
                const material = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 1,
                    alphaTest: 0.04,
                    depthTest: false,
                    depthWrite: false,
                    toneMapped: false
                });
                const sprite = new THREE.Sprite(material);
                sprite.scale.set(10, 10, 1);
                return sprite;
            }

            function getSeasonOccluderDisks(width, height) {
                const disks = [];
                const bodies = [
                    { mesh: sunMesh, radius: 19 },
                    { mesh: earthMesh, radius: 11.2 },
                    { mesh: moonMesh, radius: 3.2 }
                ];

                seasonCameraUp.set(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
                bodies.forEach(body => {
                    if (!body.mesh || body.mesh.visible === false) return;
                    body.mesh.updateWorldMatrix(true, false);
                    body.mesh.getWorldPosition(seasonBodyWorldPosition);
                    seasonBodyProjectedPosition.copy(seasonBodyWorldPosition).project(camera);
                    if (seasonBodyProjectedPosition.z < -1 || seasonBodyProjectedPosition.z > 1) return;

                    const worldScale = body.mesh.getWorldScale(new THREE.Vector3());
                    const radius = body.radius * Math.max(worldScale.x, worldScale.y, worldScale.z);
                    seasonBodyEdgePosition
                        .copy(seasonBodyWorldPosition)
                        .addScaledVector(seasonCameraUp, radius);
                    seasonBodyEdgeProjectedPosition.copy(seasonBodyEdgePosition).project(camera);

                    const centerX = (seasonBodyProjectedPosition.x * 0.5 + 0.5) * width;
                    const centerY = (-seasonBodyProjectedPosition.y * 0.5 + 0.5) * height;
                    const edgeX = (seasonBodyEdgeProjectedPosition.x * 0.5 + 0.5) * width;
                    const edgeY = (-seasonBodyEdgeProjectedPosition.y * 0.5 + 0.5) * height;
                    const radiusPx = Math.hypot(edgeX - centerX, edgeY - centerY);
                    if (Number.isFinite(radiusPx) && radiusPx > 0) {
                        disks.push({ x: centerX, y: centerY, radius: radiusPx });
                    }
                });
                return disks;
            }

            function pointTouchesOccluder(x, y, padding, disks) {
                return disks.some(disk => Math.hypot(x - disk.x, y - disk.y) <= disk.radius + padding);
            }

            function labelTouchesOccluder(x, y, element, disks) {
                const halfWidth = Math.max(18, element.offsetWidth / 2);
                const halfHeight = Math.max(9, element.offsetHeight / 2);
                return disks.some(disk => {
                    const nearestX = Math.max(x - halfWidth, Math.min(disk.x, x + halfWidth));
                    const nearestY = Math.max(y - halfHeight, Math.min(disk.y, y + halfHeight));
                    return Math.hypot(disk.x - nearestX, disk.y - nearestY) <= disk.radius + 3;
                });
            }

            function guideTouchesOccluder(guide, width, height, disks) {
                if (!guide || !guide.geometry || !guide.geometry.attributes.position) return false;
                const position = guide.geometry.attributes.position;
                seasonGuideStartWorld.fromBufferAttribute(position, 0).applyMatrix4(guide.matrixWorld);
                seasonGuideEndWorld.fromBufferAttribute(position, position.count - 1).applyMatrix4(guide.matrixWorld);
                seasonGuideStartProjected.copy(seasonGuideStartWorld).project(camera);
                seasonGuideEndProjected.copy(seasonGuideEndWorld).project(camera);

                const startX = (seasonGuideStartProjected.x * 0.5 + 0.5) * width;
                const startY = (-seasonGuideStartProjected.y * 0.5 + 0.5) * height;
                const endX = (seasonGuideEndProjected.x * 0.5 + 0.5) * width;
                const endY = (-seasonGuideEndProjected.y * 0.5 + 0.5) * height;
                const segmentX = endX - startX;
                const segmentY = endY - startY;
                const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;

                return disks.some(disk => {
                    const ratio = segmentLengthSquared > 0
                        ? Math.max(0, Math.min(1,
                            ((disk.x - startX) * segmentX + (disk.y - startY) * segmentY)
                            / segmentLengthSquared))
                        : 0;
                    const nearestX = startX + segmentX * ratio;
                    const nearestY = startY + segmentY * ratio;
                    return Math.hypot(disk.x - nearestX, disk.y - nearestY) <= disk.radius + 2;
                });
            }

            function updateSeasonScreenLabels() {
                if (!seasonLabelsOverlay || !seasonPointsGroup || !camera) return;

                const width = spacePane.clientWidth;
                const height = spacePane.clientHeight;
                const labelsVisible = seasonPointsGroup.visible && width > 0 && height > 0;
                const occluderDisks = labelsVisible ? getSeasonOccluderDisks(width, height) : [];
                seasonLabelsOverlay.setAttribute('aria-hidden', String(!labelsVisible));

                seasonScreenLabels.forEach(item => {
                    if (!labelsVisible) {
                        item.element.hidden = true;
                        return;
                    }

                    item.anchor.getWorldPosition(seasonLabelWorldPosition);
                    seasonLabelProjectedPosition.copy(seasonLabelWorldPosition).project(camera);

                    let hiddenBehindBody = false;
                    const occluderMeshes = [sunMesh, earthMesh, moonMesh].filter(Boolean);
                    if (occluderMeshes.length) {
                        const labelDistance = camera.position.distanceTo(seasonLabelWorldPosition);
                        seasonOcclusionDirection
                            .copy(seasonLabelWorldPosition)
                            .sub(camera.position)
                            .normalize();
                        seasonOcclusionRaycaster.set(camera.position, seasonOcclusionDirection);
                        seasonOcclusionRaycaster.near = 0.1;
                        seasonOcclusionRaycaster.far = Math.max(0.1, labelDistance - 0.35);
                        hiddenBehindBody = seasonOcclusionRaycaster.intersectObjects(occluderMeshes, true).length > 0;
                    }

                    const inFront = seasonLabelProjectedPosition.z >= -1
                        && seasonLabelProjectedPosition.z <= 1;
                    const nearViewport = Math.abs(seasonLabelProjectedPosition.x) <= 1.15
                        && Math.abs(seasonLabelProjectedPosition.y) <= 1.15;
                    if (!inFront || !nearViewport || hiddenBehindBody) {
                        item.element.hidden = true;
                        if (item.icon) item.icon.visible = false;
                        if (item.guide) item.guide.visible = false;
                        return;
                    }

                    const projectedX = (seasonLabelProjectedPosition.x * 0.5 + 0.5) * width;
                    const projectedY = (-seasonLabelProjectedPosition.y * 0.5 + 0.5) * height;
                    const x = Math.min(width - 52, Math.max(52, projectedX));
                    const y = Math.min(height - 18, Math.max(18, projectedY));

                    item.anchor.parent.updateWorldMatrix(true, false);
                    if (item.icon) {
                        item.icon.getWorldPosition(seasonLabelWorldPosition);
                        seasonLabelProjectedPosition.copy(seasonLabelWorldPosition).project(camera);
                        const iconX = (seasonLabelProjectedPosition.x * 0.5 + 0.5) * width;
                        const iconY = (-seasonLabelProjectedPosition.y * 0.5 + 0.5) * height;
                        item.icon.visible = !pointTouchesOccluder(iconX, iconY, 18, occluderDisks);
                    }
                    if (item.guide) {
                        item.guide.updateWorldMatrix(true, false);
                        item.guide.visible = !guideTouchesOccluder(item.guide, width, height, occluderDisks);
                    }

                    if (labelTouchesOccluder(x, y, item.element, occluderDisks)) {
                        item.element.hidden = true;
                        return;
                    }

                    item.element.hidden = false;
                    item.element.style.transform =
                        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
                });
            }

            function pickSeasonPoint(event) {
                if (!seasonPointsGroup || !seasonPointsGroup.visible) return null;

                const rect = canvas.getBoundingClientRect();
                seasonPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                seasonPointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                seasonRaycaster.setFromCamera(seasonPointer, camera);

                const intersections = seasonRaycaster.intersectObjects(seasonPointsGroup.children, true);
                for (const intersection of intersections) {
                    let object = intersection.object;
                    while (object && object !== seasonPointsGroup) {
                        if (object.userData && object.userData.seasonJump) {
                            return object.userData.seasonJump;
                        }
                        object = object.parent;
                    }
                }
                return null;
            }

            function jumpToSeasonPoint(point) {
                const yearProgress = point.dayOfYear / TROPICAL_YEAR_DAYS;
                earthOrbitAngle = point.angle;
                elapsedSimulationHours = point.dayOfYear * 24;
                moonRelAngle = (yearProgress * Math.PI * 2 * LUNAR_SYNODIC_CYCLES_PER_YEAR) % (Math.PI * 2);
                earthSpinAngle = (
                    Math.PI / 2
                    + JANUARY_FIRST_ORBIT_ANGLE
                    + yearProgress * Math.PI * 2 * EARTH_ROTATIONS_PER_YEAR
                ) % (Math.PI * 2);

                const ex = Math.cos(earthOrbitAngle) * SUN_ORBIT_RADIUS;
                const ez = -Math.sin(earthOrbitAngle) * SUN_ORBIT_RADIUS;
                earthSystemGroup.position.set(ex, 0, ez);
                earthSpinGroup.rotation.y = earthSpinAngle;
                moonPivot.rotation.y = earthOrbitAngle + Math.PI + moonRelAngle;
                moonMesh.lookAt(0, 0, 0);

                updateDynamicSunRays();
                updatePhasesUI();
                updateSimulationClock();
                updateSeasonScreenLabels();
                renderer.render(scene, camera);
            }

            function bindSeasonPointTimeTravel() {
                canvas.addEventListener('pointerdown', function(event) {
                    seasonPointerDown = { x: event.clientX, y: event.clientY };
                });

                canvas.addEventListener('pointerup', function(event) {
                    if (!seasonPointerDown) return;
                    const moved = Math.hypot(
                        event.clientX - seasonPointerDown.x,
                        event.clientY - seasonPointerDown.y
                    );
                    seasonPointerDown = null;
                    if (moved > 8) return;

                    const point = pickSeasonPoint(event);
                    if (point) jumpToSeasonPoint(point);
                });

                canvas.addEventListener('pointermove', function(event) {
                    canvas.style.cursor = pickSeasonPoint(event) ? 'pointer' : 'grab';
                });

                canvas.addEventListener('pointerleave', function() {
                    seasonPointerDown = null;
                    canvas.style.cursor = 'grab';
                });
            }

            function bindSeasonPointsToggle() {
                const button = document.getElementById('emSeasonPointsToggle');
                if (!button) return;

                button.addEventListener('click', function() {
                    const nextVisible = !seasonPointsGroup.visible;
                    seasonPointsGroup.visible = nextVisible;
                    this.classList.toggle('active', nextVisible);
                    this.setAttribute('aria-pressed', String(nextVisible));
                    this.textContent = nextVisible
                        ? '🌐 춘분·하지·추분·동지점 (ON)'
                        : '🌐 춘분·하지·추분·동지점 (OFF)';

                    if (nextVisible) {
                        viewMode = 'solarOverview';
                        camera.position.copy(SOLAR_OVERVIEW_CAMERA_POSITION);
                        if (controls) controls.target.copy(SOLAR_OVERVIEW_TARGET);
                        const viewModeBtn = document.getElementById('emViewModeBtn');
                        if (viewModeBtn) viewModeBtn.textContent = '지구 시선 (Earth View)';
                    }
                });
            }

            function prepareObserverTextures() {
                observerDiskTextures = {
                    korea: createObserverDiskTexture('korea'),
                    equator: createObserverDiskTexture('equator'),
                    north: createObserverDiskTexture('north'),
                    australia: createObserverDiskTexture('australia')
                };

                const koreaMapImage = new Image();
                koreaMapImage.onload = function() {
                    observerDiskTextures.korea = createObserverDiskTexture('korea', koreaMapImage);
                    const activeBtn = document.querySelector('.em-observer-btn.active');
                    if (activeBtn && activeBtn.dataset.observerLocation === 'korea' && observerDiskMaterial) {
                        observerDiskMaterial.map = observerDiskTextures.korea;
                        observerDiskMaterial.needsUpdate = true;
                    }
                };
                koreaMapImage.src = 'assets/images/korea-map.webp';
            }

            function createObserverDiskTexture(locationKey, koreaMapImage) {
                const c = document.createElement('canvas');
                c.width = 512;
                c.height = 512;
                const ctx = c.getContext('2d');
                const cx = 256;
                const cy = 256;
                const radius = 238;

                ctx.clearRect(0, 0, c.width, c.height);
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                // Keep the observer platform visibly colored even on Earth's night side.
                // A dark fill read as a black hole in the globe.
                ctx.fillStyle = 'rgba(14, 165, 233, 0.68)';
                ctx.fill();

                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, radius - 9, 0, Math.PI * 2);
                ctx.clip();

                if (locationKey === 'korea' && koreaMapImage) {
                    const targetHeight = 330;
                    const targetWidth = targetHeight * (koreaMapImage.naturalWidth / koreaMapImage.naturalHeight);
                    ctx.shadowColor = '#4ade80';
                    ctx.shadowBlur = 18;
                    ctx.drawImage(
                        koreaMapImage,
                        cx - targetWidth / 2,
                        cy - targetHeight / 2,
                        targetWidth,
                        targetHeight
                    );
                } else if (locationKey === 'australia') {
                    drawAustraliaMap(ctx, cx, cy, 285);
                } else {
                    ctx.fillStyle = 'rgba(34, 197, 94, 0.24)';
                    ctx.beginPath();
                    ctx.arc(cx, cy, 95, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#4ade80';
                    ctx.font = '900 62px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const fallbackLabel = locationKey === 'north'
                        ? '90°N'
                        : (locationKey === 'equator' ? '0°' : 'KR');
                    ctx.fillText(fallbackLabel, cx, cy);
                }
                ctx.restore();

                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.lineWidth = 14;
                ctx.strokeStyle = '#22c55e';
                ctx.shadowColor = '#4ade80';
                ctx.shadowBlur = 16;
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.beginPath();
                ctx.arc(cx, cy, radius - 24, 0, Math.PI * 2);
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
                ctx.stroke();

                const texture = new THREE.CanvasTexture(c);
                texture.needsUpdate = true;
                return texture;
            }

            function drawAustraliaMap(ctx, cx, cy, size) {
                const points = [
                    [-0.48, -0.26], [-0.35, -0.42], [-0.12, -0.38],
                    [0.05, -0.27], [0.20, -0.35], [0.28, -0.18],
                    [0.43, -0.06], [0.36, 0.12], [0.28, 0.25],
                    [0.12, 0.34], [-0.04, 0.28], [-0.19, 0.34],
                    [-0.35, 0.20], [-0.46, 0.02], [-0.55, -0.10]
                ];
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(cx + points[0][0] * size, cy + points[0][1] * size);
                points.slice(1).forEach(point => {
                    ctx.lineTo(cx + point[0] * size, cy + point[1] * size);
                });
                ctx.closePath();
                ctx.fillStyle = 'rgba(34, 197, 94, 0.72)';
                ctx.strokeStyle = '#4ade80';
                ctx.lineWidth = 6;
                ctx.shadowColor = '#4ade80';
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.ellipse(cx + size * 0.23, cy + size * 0.46, size * 0.055, size * 0.08, -0.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }

            function updateSimulationClock() {
                const display = document.getElementById('emDateTimeDisplay');
                const mainText = document.getElementById('emDateTimeMain');
                const periodNote = document.getElementById('emTimePeriodNote');
                if (!display || !mainText || !periodNote) return;

                const lunar = getLunarSimulationDate();
                const hourNote = lunar.hour === 0 ? '(자정)' : (lunar.hour === 12 ? '(정오)' : '');
                mainText.textContent = `음력 ${lunar.month}월 ${lunar.day}일 ${lunar.hour}시`;
                periodNote.textContent = hourNote;
                display.removeAttribute('datetime');
                syncMoonCalendarControls();
            }

            function createObserverMarker() {
                const marker = new THREE.Group();

                observerDiskMaterial = new THREE.MeshBasicMaterial({
                    map: observerDiskTextures.korea,
                    side: THREE.DoubleSide,
                    transparent: true,
                    depthWrite: false
                });
                const disk = new THREE.Mesh(new THREE.CircleGeometry(3.35, 64), observerDiskMaterial);
                disk.rotation.x = -Math.PI / 2;
                disk.position.y = 0.08;
                disk.renderOrder = 20;
                marker.add(disk);

                const bodyMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
                const skinMat = new THREE.MeshBasicMaterial({ color: 0xffb35c });
                const hatMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
                const hatBandMat = new THREE.MeshBasicMaterial({ color: 0x7c2d12 });

                const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.75, 10), bodyMat);
                const rightLeg = leftLeg.clone();
                leftLeg.position.set(-0.22, 0.43, 0);
                rightLeg.position.set(0.22, 0.43, 0);
                marker.add(leftLeg, rightLeg);

                const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.46, 0.9, 12), bodyMat);
                torso.position.y = 1.15;
                marker.add(torso);

                const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.72, 10), bodyMat);
                const rightArm = leftArm.clone();
                leftArm.position.set(-0.48, 1.2, 0);
                rightArm.position.set(0.48, 1.2, 0);
                leftArm.rotation.z = -0.42;
                rightArm.rotation.z = 0.42;
                marker.add(leftArm, rightArm);

                const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 18), skinMat);
                head.position.y = 1.92;
                marker.add(head);

                const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.12, 24), hatMat);
                brim.position.y = 2.22;
                marker.add(brim);

                const band = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.12, 24), hatBandMat);
                band.position.y = 2.34;
                marker.add(band);

                const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.48, 24), hatMat);
                crown.position.y = 2.55;
                marker.add(crown);

                return marker;
            }

            function setObserverLocation(locationKey) {
                if (!observerMarker) return;

                const locations = {
                    korea: {
                        latitude: 37.5,
                        moonLabel: '북반구(한국) 관측 시선'
                    },
                    equator: {
                        latitude: 0,
                        moonLabel: '적도 관측 시선'
                    },
                    north: {
                        latitude: 90,
                        moonLabel: '북극 관측 시선'
                    },
                    australia: {
                        latitude: -35,
                        moonLabel: '남반구(호주) 관측 시선'
                    }
                };
                const location = locations[locationKey] || locations.korea;
                currentObserverKey = locations[locationKey] ? locationKey : 'korea';
                currentObserverPlace = currentObserverKey === 'australia' ? '호주' :
                    currentObserverKey === 'equator' ? '적도' :
                    currentObserverKey === 'north' ? '북극' : '한국';
                currentObserverLatitude = location.latitude;
                const latitudeRad = location.latitude * (Math.PI / 180);
                const surfaceRadius = 10.3;
                const surfaceNormal = new THREE.Vector3(
                    0,
                    Math.sin(latitudeRad),
                    Math.cos(latitudeRad)
                ).normalize();

                observerMarker.position.copy(surfaceNormal.clone().multiplyScalar(surfaceRadius));
                observerMarker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), surfaceNormal);

                if (observerDiskMaterial && observerDiskTextures[locationKey]) {
                    observerDiskMaterial.map = observerDiskTextures[locationKey];
                    observerDiskMaterial.needsUpdate = true;
                }

                document.querySelectorAll('#emMoonSimulator .em-observer-btn').forEach(button => {
                    button.classList.toggle('active', button.dataset.observerLocation === currentObserverKey);
                });

                const moonLabel = document.getElementById('emMoonObserverLabel');
                if (moonLabel) moonLabel.textContent = location.moonLabel;
                draw2DMoonPhase(moonRelAngle);
                drawMoonObserverSky();
            }

            function bindObserverControls() {
                document.querySelectorAll('#emMoonSimulator .em-observer-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const locationKey = this.dataset.observerLocation;
                        setObserverLocation(locationKey);
                        window.dispatchEvent(new CustomEvent('earthmoon:observer-change', {
                            detail: { locationKey, source: 'moon' }
                        }));
                    });
                });

                window.addEventListener('earthmoon:observer-change', event => {
                    if (!event.detail || event.detail.source === 'moon') return;
                    setObserverLocation(event.detail.locationKey);
                });
            }

            function normalizeRadians(angle) {
                return (angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            }

            function normalizeDegreesSigned(angle) {
                return ((angle + 540) % 360) - 180;
            }

            function getMainSimulationDate() {
                const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                const totalHours = ((elapsedSimulationHours % HOURS_PER_YEAR) + HOURS_PER_YEAR) % HOURS_PER_YEAR;
                let dayOfYear = Math.min(CALENDAR_DAYS_PER_YEAR, Math.floor(totalHours / 24) + 1);
                let month = 0;
                while (dayOfYear > monthDays[month]) {
                    dayOfYear -= monthDays[month];
                    month += 1;
                }
                return {
                    month: month + 1,
                    day: dayOfYear,
                    dayOfYear: Math.min(CALENDAR_DAYS_PER_YEAR, Math.floor(totalHours / 24) + 1),
                    hour: Math.floor(totalHours % 24)
                };
            }

            function getLunarSimulationDate() {
                const phaseAngle = normalizeRadians(moonRelAngle);
                const elapsedDays = Math.max(0, elapsedSimulationHours / 24);
                const phaseNames = ['삭', '초승달', '상현달', '팽대달', '망/보름달', '팽대달', '하현달', '그믐달'];
                return {
                    month: Math.floor(elapsedDays / SYNODIC_MONTH_DAYS) % 12 + 1,
                    day: Math.floor((phaseAngle / (Math.PI * 2)) * SYNODIC_MONTH_DAYS) + 1,
                    hour: Math.floor(elapsedSimulationHours + 0.000001) % 24,
                    phase: phaseNames[Math.round((phaseAngle / (Math.PI * 2)) * 8) % 8]
                };
            }

            const moonDaySlider = document.getElementById('emMoonDaySlider');
            const moonTimeSlider = document.getElementById('emMoonTimeSlider');

            function syncMoonCalendarControls() {
                const totalHours = ((elapsedSimulationHours % HOURS_PER_YEAR) + HOURS_PER_YEAR) % HOURS_PER_YEAR;
                if (moonDaySlider && document.activeElement !== moonDaySlider) {
                    moonDaySlider.value = String(Math.min(CALENDAR_DAYS_PER_YEAR, Math.floor(totalHours / 24) + 1));
                }
                if (moonTimeSlider && document.activeElement !== moonTimeSlider) {
                    moonTimeSlider.value = String(Math.floor(totalHours % 24));
                }
            }

            function applyMoonCalendarControls() {
                if (!moonDaySlider || !moonTimeSlider) return;

                const dayIndex = Math.max(0, Math.min(CALENDAR_DAYS_PER_YEAR - 1, Number(moonDaySlider.value) - 1));
                const hour = Math.max(0, Math.min(23, Number(moonTimeSlider.value)));
                elapsedSimulationHours = dayIndex * 24 + hour;

                const yearProgress = elapsedSimulationHours / HOURS_PER_YEAR;
                earthOrbitAngle = normalizeRadians(JANUARY_FIRST_ORBIT_ANGLE + yearProgress * Math.PI * 2);
                moonRelAngle = normalizeRadians(yearProgress * Math.PI * 2 * LUNAR_SYNODIC_CYCLES_PER_YEAR);
                earthSpinAngle = normalizeRadians(
                    Math.PI / 2
                    + JANUARY_FIRST_ORBIT_ANGLE
                    + yearProgress * Math.PI * 2 * EARTH_ROTATIONS_PER_YEAR
                );

                isPlaying = false;
                const playButton = document.getElementById('emPlayBtn');
                if (playButton) playButton.textContent = '▶ 재생';
                updateDynamicSunRays();
                updatePhasesUI();
                updateSimulationClock();
            }

            function equatorialFromEcliptic(longitude) {
                const obliquity = 23.44 * Math.PI / 180;
                return {
                    rightAscension: Math.atan2(
                        Math.cos(obliquity) * Math.sin(longitude),
                        Math.cos(longitude)
                    ),
                    declination: Math.asin(Math.sin(obliquity) * Math.sin(longitude))
                };
            }

            function horizontalPosition(rightAscension, declination, siderealTime) {
                const latitude = currentObserverLatitude * Math.PI / 180;
                const hourAngle = normalizeDegreesSigned(
                    (siderealTime - rightAscension) * 180 / Math.PI
                ) * Math.PI / 180;
                const east = -Math.cos(declination) * Math.sin(hourAngle);
                const north =
                    Math.cos(latitude) * Math.sin(declination) -
                    Math.sin(latitude) * Math.cos(declination) * Math.cos(hourAngle);
                const up =
                    Math.sin(latitude) * Math.sin(declination) +
                    Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle);
                return {
                    altitude: Math.asin(Math.max(-1, Math.min(1, up))) * 180 / Math.PI,
                    azimuth: (Math.atan2(east, north) * 180 / Math.PI + 360) % 360
                };
            }

            function prepareMoonSkyCanvas() {
                const rect = observerSkyCanvas.getBoundingClientRect();
                const width = Math.max(1, rect.width);
                const height = Math.max(1, rect.height);
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                const pixelWidth = Math.round(width * dpr);
                const pixelHeight = Math.round(height * dpr);
                if (observerSkyCanvas.width !== pixelWidth || observerSkyCanvas.height !== pixelHeight) {
                    observerSkyCanvas.width = pixelWidth;
                    observerSkyCanvas.height = pixelHeight;
                }
                const ctx = observerSkyCanvas.getContext('2d');
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                return { ctx, width, height };
            }

            function smoothMoonSkyStep(edge0, edge1, value) {
                const progress = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
                return progress * progress * (3 - 2 * progress);
            }

            function mixMoonSkyRgb(from, to, amount) {
                const t = Math.max(0, Math.min(1, amount));
                const channels = from.map((channel, index) =>
                    Math.round(channel + (to[index] - channel) * t)
                );
                return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
            }

            function drawMoonObserverSky() {
                if (observerView.hidden) return;
                const prepared = prepareMoonSkyCanvas();
                const ctx = prepared.ctx;
                const width = prepared.width;
                const height = prepared.height;
                const horizon = height - 54;
                const continuousHours =
                    ((elapsedSimulationHours % HOURS_PER_YEAR) + HOURS_PER_YEAR) % HOURS_PER_YEAR;
                const continuousHour = continuousHours % 24;
                const continuousDayOfYear = continuousHours / 24 + 1;
                const solarHourAngle = (continuousHour - 12) * 15 * Math.PI / 180;
                const sunLongitude = normalizeRadians(
                    ((continuousDayOfYear - 80) / TROPICAL_YEAR_DAYS) * Math.PI * 2
                );
                const moonLongitude = normalizeRadians(sunLongitude + moonRelAngle);
                const sunEquatorial = equatorialFromEcliptic(sunLongitude);
                const moonEquatorial = equatorialFromEcliptic(moonLongitude);
                const siderealTime = sunEquatorial.rightAscension + solarHourAngle;
                const sunPosition = horizontalPosition(
                    sunEquatorial.rightAscension,
                    sunEquatorial.declination,
                    siderealTime
                );
                const moonPosition = horizontalPosition(
                    moonEquatorial.rightAscension,
                    moonEquatorial.declination,
                    siderealTime
                );
                const skyLight = smoothMoonSkyStep(-12, 6, sunPosition.altitude);
                const fullDaylight = smoothMoonSkyStep(-4, 12, sunPosition.altitude);
                const nightStrength = 1 - smoothMoonSkyStep(-10, 2, sunPosition.altitude);
                const twilightStrength =
                    smoothMoonSkyStep(-18, -4, sunPosition.altitude) *
                    (1 - smoothMoonSkyStep(3, 12, sunPosition.altitude));

                const skyGradient = ctx.createLinearGradient(0, 0, 0, horizon);
                skyGradient.addColorStop(
                    0,
                    mixMoonSkyRgb([2, 6, 23], [21, 151, 223], fullDaylight)
                );
                skyGradient.addColorStop(
                    0.55,
                    mixMoonSkyRgb([7, 18, 41], [85, 197, 239], skyLight)
                );
                skyGradient.addColorStop(
                    1,
                    mixMoonSkyRgb([15, 23, 42], [217, 244, 255], skyLight)
                );
                ctx.fillStyle = skyGradient;
                ctx.fillRect(0, 0, width, horizon);

                if (twilightStrength > 0.001) {
                    const twilightGradient = ctx.createLinearGradient(0, horizon * 0.32, 0, horizon);
                    twilightGradient.addColorStop(0, 'rgba(251, 113, 133, 0)');
                    twilightGradient.addColorStop(
                        0.7,
                        `rgba(251, 146, 60, ${0.2 * twilightStrength})`
                    );
                    twilightGradient.addColorStop(
                        1,
                        `rgba(253, 186, 116, ${0.72 * twilightStrength})`
                    );
                    ctx.fillStyle = twilightGradient;
                    ctx.fillRect(0, 0, width, horizon);
                }

                if (nightStrength > 0.001) {
                    ctx.save();
                    // Stars are only a quiet night-sky texture here; the solar
                    // path and horizon must remain the visual focus.
                    ctx.globalAlpha = nightStrength * 0.12;
                    ctx.fillStyle = '#cbd5e1';
                    for (let index = 0; index < 8; index += 1) {
                        const x = (index * 137 + 53) % width;
                        const y = (index * 83 + 31) % Math.max(1, horizon - 50);
                        ctx.beginPath();
                        ctx.arc(x, y, 0.32, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                }

                const groundGradient = ctx.createLinearGradient(0, horizon, 0, height);
                groundGradient.addColorStop(
                    0,
                    mixMoonSkyRgb([2, 24, 22], [21, 128, 61], skyLight)
                );
                groundGradient.addColorStop(
                    1,
                    mixMoonSkyRgb([1, 10, 18], [20, 83, 45], skyLight)
                );
                ctx.fillStyle = groundGradient;
                ctx.fillRect(0, horizon, width, height - horizon);
                ctx.strokeStyle = '#22d3ee';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, horizon);
                ctx.quadraticCurveTo(width / 2, horizon - 5, width, horizon);
                ctx.stroke();

                const polarView = Math.abs(currentObserverLatitude) >= 89.5;
                const viewCenter = currentObserverLatitude < 0 ? 0 : 180;
                function project(position) {
                    if (position.altitude <= 0) return null;
                    if (polarView) {
                        return {
                            x: (position.azimuth / 360) * width,
                            y: horizon - (position.altitude / 90) * (horizon - 68)
                        };
                    }
                    const relativeAzimuth = normalizeDegreesSigned(position.azimuth - viewCenter);
                    if (Math.abs(relativeAzimuth) > 92) return null;
                    return {
                        x: width / 2 + (relativeAzimuth / 180) * width,
                        y: horizon - (position.altitude / 90) * (horizon - 68)
                    };
                }

                const sunPoint = project(sunPosition);
                if (sunPoint) {
                    const glow = ctx.createRadialGradient(sunPoint.x, sunPoint.y, 2, sunPoint.x, sunPoint.y, 28);
                    glow.addColorStop(0, 'rgba(255,255,220,1)');
                    glow.addColorStop(0.35, 'rgba(250,204,21,0.9)');
                    glow.addColorStop(1, 'rgba(250,204,21,0)');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(sunPoint.x, sunPoint.y, 28, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#facc15';
                    ctx.beginPath();
                    ctx.arc(sunPoint.x, sunPoint.y, 11, 0, Math.PI * 2);
                    ctx.fill();
                }

                const phaseAngle = normalizeRadians(moonRelAngle);
                const elongationDegrees = Math.min(
                    phaseAngle,
                    Math.PI * 2 - phaseAngle
                ) * 180 / Math.PI;
                const moonPoint = project(moonPosition);
                if (moonPoint && elongationDegrees > 8) {
                    const phaseCanvas = document.getElementById('moonPhaseCanvas');
                    ctx.save();
                    ctx.shadowColor = 'rgba(226,232,240,0.65)';
                    ctx.shadowBlur = 12;
                    if (phaseCanvas) {
                        ctx.drawImage(phaseCanvas, moonPoint.x - 22, moonPoint.y - 22, 44, 44);
                    } else {
                        ctx.fillStyle = '#e2e8f0';
                        ctx.beginPath();
                        ctx.arc(moonPoint.x, moonPoint.y, 18, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                }

                function drawMoonDirectionLabel(text, x, y, alignment, color, size) {
                    ctx.font = `900 ${size}px Pretendard, sans-serif`;
                    ctx.textAlign = alignment;
                    ctx.textBaseline = 'middle';
                    ctx.lineWidth = 5;
                    ctx.lineJoin = 'round';
                    ctx.strokeStyle = 'rgba(2, 6, 23, 0.82)';
                    ctx.strokeText(text, x, y);
                    ctx.fillStyle = color;
                    ctx.fillText(text, x, y);
                }

                if (polarView) {
                    drawMoonDirectionLabel(
                        currentObserverLatitude > 0 ? '360° 지평선 · 모든 방향이 남쪽' : '360° 지평선 · 모든 방향이 북쪽',
                        width / 2,
                        horizon - 21,
                        'center',
                        '#ffffff',
                        15
                    );
                } else {
                    const leftLabel = currentObserverLatitude < 0 ? '서 (West)' : '동 (East)';
                    const centerLabel = currentObserverLatitude < 0 ? '북 (North)' : '남 (South)';
                    const rightLabel = currentObserverLatitude < 0 ? '동 (East)' : '서 (West)';
                    drawMoonDirectionLabel(leftLabel, 16, horizon - 21, 'left', '#ffffff', 15);
                    drawMoonDirectionLabel(rightLabel, width - 16, horizon - 21, 'right', '#ffffff', 15);
                    drawMoonDirectionLabel(centerLabel, width / 2, 28, 'center', '#facc15', 16);
                }

                ctx.fillStyle = '#0ea5e9';
                ctx.beginPath();
                ctx.arc(width / 2, horizon - 12, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(width / 2 - 5, horizon - 5, 10, 22);

                const lunar = getLunarSimulationDate();
                if (observerSkyLunarClock) {
                    observerSkyLunarClock.textContent = '음력 ' + lunar.month + '월 ' + lunar.day + '일 ' + lunar.hour + '시';
                }
                if (observerSkyPhase) {
                    observerSkyPhase.textContent = lunar.phase;
                }
                if (observerSkyCaption) {
                    if (polarView) {
                        observerSkyCaption.textContent = currentObserverPlace + '의 360° 지평선';
                    } else {
                        observerSkyCaption.textContent =
                            currentObserverPlace + '에서 ' +
                            (currentObserverLatitude < 0 ? '북쪽' : '남쪽') +
                            ' 하늘을 바라본 모습';
                    }
                }
                if (observerSkyStatus) {
                    const sunState = sunPosition.altitude > 0 ? '태양은 지평선 위' : '태양은 지평선 아래';
                    const moonState = elongationDegrees <= 8
                        ? '달은 태양과 같은 방향이라 관측 불가'
                        : (moonPosition.altitude > 0 ? '달은 지평선 위' : '달은 지평선 아래');
                    observerSkyStatus.textContent = sunState + ' · ' + moonState;
                }
            }

            function updatePhasesUI() {
                // Phase angle is moonRelAngle (relative to Sun-Earth vector)
                let a = (moonRelAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
                let deg = a * (180 / Math.PI);

                let closestIdx = 0;
                let minDist = 360;
                phases.forEach((p, idx) => {
                    let d = Math.abs(deg - p.angleDeg);
                    if (d > 180) d = 360 - d;
                    if (d < minDist) { minDist = d; closestIdx = idx; }
                });

                // Immediately before the cycle wraps, the Moon is still a
                // waning crescent (그믐), not the next cycle's new moon (삭).
                if (deg >= 337.5) closestIdx = phases.length - 1;

                const pData = phases[closestIdx];
                const synodicMonthDays = 29.530588;
                const lunarAgeDays = (a / (Math.PI * 2)) * synodicMonthDays;
                const lunarDay = Math.min(30, Math.floor(lunarAgeDays) + 1);
                const shortPhaseName = pData.name.split(' (')[0];
                document.getElementById('moonPhaseTitle').textContent = pData.name;
                document.getElementById('moonObsInfo').innerHTML =
                    pData.info.replace(' | ', '<br>관측 방향: ');
                document.getElementById('emOrbitProgressText').textContent =
                    `음력 약 ${lunarDay}일 · ${shortPhaseName}`;

                const chips = document.querySelectorAll('#phaseChipsGrid .phase-chip');
                chips.forEach(c => {
                    if (parseInt(c.dataset.angle, 10) === pData.angleDeg) {
                        c.classList.add('active');
                    } else {
                        c.classList.remove('active');
                    }
                });

                draw2DMoonPhase(a);
                drawMoonObserverSky();
            }

            function draw2DMoonPhase(angleRad) {
                const c = document.getElementById('moonPhaseCanvas');
                if (!c) return;
                const ctx = c.getContext('2d');
                const center = c.width / 2;
                // Fill the circular frame while preserving a thin antialiasing edge.
                const r = c.width * 0.49;
                ctx.clearRect(0, 0, c.width, c.height);

                ctx.save();
                ctx.translate(center, center);
                // From the Southern Hemisphere the same lunar phase appears rotated
                // approximately 180 degrees compared with the Northern Hemisphere.
                if (currentObserverLatitude < 0) {
                    ctx.rotate(Math.PI);
                }

                // Keep the real surface clearly visible even on the night side.
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.save();
                ctx.clip();
                drawMoonNearsideSurface(ctx, r, 0.62, '#334155');
                ctx.restore();

                const a = (angleRad % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
                const cosA = Math.cos(a);

                // 🌑 삭 (New Moon ~ 0 rad): 100% Dark
                if (a < 0.08 || a > Math.PI * 2 - 0.08) {
                    ctx.restore();
                    return;
                }

                // 🌕 망 / 보름달 (Full Moon ~ PI rad): 100% Yellow
                if (Math.abs(a - Math.PI) < 0.08) {
                    ctx.beginPath();
                    ctx.arc(0, 0, r, 0, Math.PI * 2);
                    ctx.save();
                    ctx.clip();
                    drawMoonNearsideSurface(ctx, r, 1.45, '#fff3cf');
                    ctx.restore();
                    ctx.restore();
                    return;
                }

                ctx.beginPath();

                if (a > 0 && a < Math.PI) {
                    // Waxing phase (0 -> 180deg): Right side is illuminated in Northern Hemisphere
                    ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
                    if (cosA > 0) {
                        // Crescent (0 -> 90deg): terminator curves inside right side
                        ctx.ellipse(0, 0, cosA * r, r, 0, Math.PI / 2, -Math.PI / 2, true);
                    } else {
                        // Gibbous (90 -> 180deg): terminator extends into left side
                        ctx.ellipse(0, 0, Math.abs(cosA) * r, r, 0, Math.PI / 2, -Math.PI / 2, false);
                    }
                } else {
                    // Waning phase (180 -> 360deg): Left side is illuminated in Northern Hemisphere
                    ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2, false);
                    if (cosA < 0) {
                        // Gibbous (180 -> 270deg): terminator extends into right side
                        ctx.ellipse(0, 0, Math.abs(cosA) * r, r, 0, -Math.PI / 2, Math.PI / 2, false);
                    } else {
                        // Crescent (270 -> 360deg): terminator curves inside left side
                        ctx.ellipse(0, 0, cosA * r, r, 0, -Math.PI / 2, Math.PI / 2, true);
                    }
                }

                ctx.save();
                ctx.clip();
                drawMoonNearsideSurface(ctx, r, 1.45, '#fff3cf');
                ctx.restore();
                ctx.restore();
            }

            function drawMoonNearsideSurface(ctx, radius, brightness, fallbackColor) {
                ctx.fillStyle = fallbackColor;
                ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

                if (!moonNearsideImage.complete || !moonNearsideImage.naturalWidth) return;

                const sourceSize = Math.min(
                    moonNearsideImage.naturalWidth,
                    moonNearsideImage.naturalHeight
                );
                const sourceX = (moonNearsideImage.naturalWidth - sourceSize) / 2;
                const sourceY = (moonNearsideImage.naturalHeight - sourceSize) / 2;
                const imageRadius = radius * 1.075;
                const isShadowSurface = brightness < 1;

                ctx.save();
                // Preserve recognizable maria on a warm, luminous surface.
                // Dark pixels are softened by reduced contrast, not erased.
                ctx.globalAlpha = isShadowSurface ? 0.58 : 0.88;
                ctx.filter = isShadowSurface
                    ? `grayscale(1) brightness(${brightness}) contrast(0.76)`
                    : `grayscale(1) sepia(0.5) saturate(1.15) brightness(${brightness}) contrast(0.88)`;
                ctx.drawImage(
                    moonNearsideImage,
                    sourceX,
                    sourceY,
                    sourceSize,
                    sourceSize,
                    -imageRadius,
                    -imageRadius,
                    imageRadius * 2,
                    imageRadius * 2
                );

                if (!isShadowSurface) {
                    ctx.globalCompositeOperation = 'screen';
                    ctx.globalAlpha = 0.16;
                    ctx.filter = 'none';
                    ctx.fillStyle = '#fff0b8';
                    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
                }
                ctx.restore();
            }

            function updateDynamicSunRays() {
                if (!earthSystemGroup || !sunLightLinesGroup) return;
                const ex = earthSystemGroup.position.x;
                const ez = earthSystemGroup.position.z;

                // Direction vector from Sun (0,0) to Earth (ex, ez)
                const len = Math.sqrt(ex * ex + ez * ez);
                if (len < 0.1) return;

                const ux = ex / len; // Unit direction vector towards Earth
                const uz = ez / len;
                const rayLines = sunLightLinesGroup.children;
                const latitudeOffsets = [-9, -6, -3, 0, 3, 6, 9];
                const sunRadius = 16;
                const earthRadius = 10;

                latitudeOffsets.forEach((offsetY, idx) => {
                    // Start at the Sun's visible surface and terminate where each
                    // parallel beam first meets the corresponding latitude on Earth.
                    const startDistance = Math.sqrt(Math.max(0, sunRadius * sunRadius - offsetY * offsetY));
                    const earthSurfaceDepth = Math.sqrt(Math.max(0, earthRadius * earthRadius - offsetY * offsetY));
                    const endDistance = len - earthSurfaceDepth;
                    const startX = ux * startDistance;
                    const startZ = uz * startDistance;
                    const endX = ux * endDistance;
                    const endZ = uz * endDistance;

                    const rayLine = rayLines[idx];
                    if (rayLine) {
                        const pts = [
                            new THREE.Vector3(startX, offsetY, startZ),
                            new THREE.Vector3(endX, offsetY, endZ)
                        ];
                        rayLine.geometry.setFromPoints(pts);
                        rayLine.geometry.computeBoundingSphere();
                        rayLine.computeLineDistances();
                    }
                });
            }

            function animate() {
                requestAnimationFrame(animate);

                // Physical speed steps:
                // One tropical year = 365.2422 mean solar days.
                // Earth: 366.2422 inertial turns - 1 orbit = 365.2422 solar days.
                // Moon: 13.3687 sidereal orbits - 1 Earth orbit = 12.3687 phase cycles.
                const dEarthOrbitStep = 0.00025 * speed;
                const dMoonStep = dEarthOrbitStep * LUNAR_SYNODIC_CYCLES_PER_YEAR;
                const dEarthSpinStep = dEarthOrbitStep * EARTH_ROTATIONS_PER_YEAR;
                const dElapsedHours = (dEarthOrbitStep / (Math.PI * 2)) * HOURS_PER_YEAR;

                if (isPlaying) {
                    earthOrbitAngle += dEarthOrbitStep;
                    moonRelAngle += dMoonStep;
                    earthSpinAngle += dEarthSpinStep;
                    elapsedSimulationHours += dElapsedHours;

                    if (earthOrbitAngle >= Math.PI * 2) earthOrbitAngle -= Math.PI * 2;
                    if (moonRelAngle >= Math.PI * 2) moonRelAngle -= Math.PI * 2;
                    if (earthSpinAngle >= Math.PI * 2) earthSpinAngle %= Math.PI * 2;
                    if (elapsedSimulationHours >= HOURS_PER_YEAR) elapsedSimulationHours %= HOURS_PER_YEAR;
                }

                // 1. Move Earth-Moon System counter-clockwise as seen from the north
                // side of the ecliptic. Positive Z would make the orbit clockwise.
                if (earthSystemGroup) {
                    const ex = Math.cos(earthOrbitAngle) * SUN_ORBIT_RADIUS;
                    const ez = -Math.sin(earthOrbitAngle) * SUN_ORBIT_RADIUS;
                    earthSystemGroup.position.set(ex, 0, ez);
                }

                // 2. Rotate Moon Pivot inside Earth System (relative to Sun-Earth line)
                if (moonPivot) {
                    // Absolute moon orbit angle = earthOrbitAngle + Math.PI + moonRelAngle
                    // Adding Math.PI aligns moonRelAngle = 0 with New Moon (Moon between Earth and Sun)
                    moonPivot.rotation.y = earthOrbitAngle + Math.PI + moonRelAngle;
                }

                // 3. Moon Tidal Locking (faces Earth center 0,0,0)
                if (moonMesh) {
                    moonMesh.lookAt(0, 0, 0);
                }

                // 4. Earth and its attached observer rotate together.
                if (earthSpinGroup) {
                    earthSpinGroup.rotation.y = earthSpinAngle;
                }

                // 5. Update Dynamic Sunlight Rays pointing from Sun to Earth
                updateDynamicSunRays();

                // 6. Camera Tracking Mode
                if (controls && earthSystemGroup) {
                    if (viewMode === 'trackEarth') {
                        const targetPos = earthSystemGroup.position;
                        controls.target.copy(targetPos);
                        camera.position.set(
                            targetPos.x + EARTH_TRACK_CAMERA_OFFSET.x,
                            targetPos.y + EARTH_TRACK_CAMERA_OFFSET.y,
                            targetPos.z + EARTH_TRACK_CAMERA_OFFSET.z
                        );
                    } else {
                        controls.target.copy(SOLAR_OVERVIEW_TARGET); // Solar System Overview
                    }
                    controls.update();
                }

                updatePhasesUI();
                updateSimulationClock();
                updateSeasonScreenLabels();
                renderer.render(scene, camera);
            }

            // Controls listeners
            document.getElementById('emPlayBtn').onclick = function() {
                isPlaying = !isPlaying;
                this.textContent = isPlaying ? '⏸ 일시정지' : '▶ 재생';
            };

            document.getElementById('emSpeedSlider').oninput = function() {
                speed = Math.pow(10, parseFloat(this.value) / 20);
                const speedValue = document.getElementById('emSpeedValue');
                if (speedValue) {
                    speedValue.textContent = `${speed < 1 ? speed.toFixed(2) : speed.toFixed(1)}×`;
                }
            };

            if (moonDaySlider) moonDaySlider.addEventListener('input', applyMoonCalendarControls);
            if (moonTimeSlider) moonTimeSlider.addEventListener('input', applyMoonCalendarControls);

            document.getElementById('emOrbitLineToggle').onchange = function() {
                if (earthOrbitLine) earthOrbitLine.visible = this.checked;
                if (moonOrbitLine) moonOrbitLine.visible = this.checked;
            };

            document.getElementById('emSunRayToggle').onchange = function() {
                if (sunLightLinesGroup) sunLightLinesGroup.visible = this.checked;
            };

            document.getElementById('emViewModeBtn').onclick = function() {
                if (viewMode === 'trackEarth') {
                    viewMode = 'solarOverview';
                    this.textContent = '지구 시선 (Earth View)';
                    container.classList.remove('earth-view-mode');
                    observerView.hidden = false;
                    camera.position.copy(SOLAR_OVERVIEW_CAMERA_POSITION);
                } else {
                    viewMode = 'trackEarth';
                    this.textContent = '태양계 시선 (Solar System View)';
                    container.classList.add('earth-view-mode');
                    observerView.hidden = false;
                    drawMoonObserverSky();
                }
                requestAnimationFrame(() => {
                    window.dispatchEvent(new Event('earthmoon:view-resize'));
                });
            };

            // Phase quick selector chips click even
            const chips = document.querySelectorAll('#phaseChipsGrid .phase-chip');
            chips.forEach(chip => {
                chip.onclick = function() {
                    const deg = parseFloat(this.dataset.angle);
                    moonRelAngle = deg * (Math.PI / 180);
                    isPlaying = false;
                    document.getElementById('emPlayBtn').textContent = '▶ 재생';

                    // Immediately update 3D Moon position to match selected phase angle
                    if (moonPivot) {
                        moonPivot.rotation.y = earthOrbitAngle + Math.PI + moonRelAngle;
                    }
                    if (moonMesh) {
                        moonMesh.lookAt(0, 0, 0);
                    }
                    updateDynamicSunRays();
                    updatePhasesUI();

                    if (renderer && scene && camera) {
                        renderer.render(scene, camera);
                    }
                };
            });

            init3D();
        })();

        // Seasonal solar-altitude simulator: one clock drives space view and observer view.
        (function() {
            const panel = document.getElementById('emSunPathSimulator');
            const orbitCanvas = document.getElementById('emOrbitSeasonCanvas');
            const skyCanvas = document.getElementById('emObserverSkyCanvas');
            const daySlider = document.getElementById('emSunPathDaySlider');
            const timeSlider = document.getElementById('emSunPathTimeSlider');
            const playButton = document.getElementById('emSunPathPlayBtn');
            const speedSlider = document.getElementById('emSunPathSpeed');
            const speedValue = document.getElementById('emSunPathSpeedValue');
            const orbitToggle = document.getElementById('emSunPathOrbitToggle');
            const rayToggle = document.getElementById('emSunPathRayToggle');
            if (!panel || !orbitCanvas || !skyCanvas || !daySlider || !timeSlider || !playButton || !speedSlider) return;

            const dateDisplay = document.getElementById('emSunPathDate');
            const timeDisplay = document.getElementById('emSunPathTime');
            const seasonDisplay = document.getElementById('emSunPathSeason');
            const observerCaption = document.getElementById('emSunPathObserverCaption');
            const locationButtons = Array.from(document.querySelectorAll('[data-sunpath-lat]'));
            const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            const seasonPoints = [
                { day: 80, label: '춘분', date: '3/21', icon: '🌸', color: '#fb7185' },
                { day: 172, label: '하지', date: '6/21', icon: '☀️', color: '#fbbf24' },
                { day: 266, label: '추분', date: '9/23', icon: '🍁', color: '#fb923c' },
                { day: 356, label: '동지', date: '12/22', icon: '❄️', color: '#60a5fa' }
            ];
            const state = {
                day: 80,
                hour: 12,
                latitude: 37.5,
                place: '한국',
                speed: 1,
                playing: true,
                showOrbit: true,
                showRays: true
            };
            let lastFrame = performance.now();
            let spaceViewRotation = 0;
            let orbitDragState = null;
            let suppressOrbitPointClick = false;

            function toRadians(degrees) {
                return degrees * Math.PI / 180;
            }

            function clamp(value, min, max) {
                return Math.max(min, Math.min(max, value));
            }

            function smoothstep(edge0, edge1, value) {
                const progress = clamp((value - edge0) / (edge1 - edge0), 0, 1);
                return progress * progress * (3 - 2 * progress);
            }

            function mixRgb(from, to, amount) {
                const t = clamp(amount, 0, 1);
                const channels = from.map((channel, index) =>
                    Math.round(channel + (to[index] - channel) * t)
                );
                return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
            }

            function dayToDate(day) {
                let remaining = clamp(Math.round(day), 1, 365);
                let month = 0;
                while (remaining > monthDays[month]) {
                    remaining -= monthDays[month];
                    month += 1;
                }
                return { month: month + 1, date: remaining };
            }

            function getDeclination(day) {
                return -23.44 * Math.cos((Math.PI * 2 * (day + 10)) / 365);
            }

            function getSeasonName(day) {
                const exactPoint = seasonPoints.find(point => Math.abs(point.day - day) < 0.6);
                if (exactPoint) return exactPoint.label;
                if (day >= 80 && day < 172) return '봄';
                if (day >= 172 && day < 266) return '여름';
                if (day >= 266 && day < 356) return '가을';
                return '겨울';
            }

            function getSolarCoordinates(latitude, declination, hour) {
                const phi = toRadians(latitude);
                const delta = toRadians(declination);
                const hourAngle = toRadians((hour - 12) * 15);
                const east = -Math.cos(delta) * Math.sin(hourAngle);
                const north =
                    Math.cos(phi) * Math.sin(delta) -
                    Math.sin(phi) * Math.cos(delta) * Math.cos(hourAngle);
                const up =
                    Math.sin(phi) * Math.sin(delta) +
                    Math.cos(phi) * Math.cos(delta) * Math.cos(hourAngle);
                const altitude = Math.asin(clamp(up, -1, 1)) * 180 / Math.PI;
                const azimuth = (Math.atan2(east, north) * 180 / Math.PI + 360) % 360;
                return { altitude, azimuth, east, north, up };
            }

            function prepareCanvas(canvas) {
                const rect = canvas.getBoundingClientRect();
                const width = Math.max(1, rect.width);
                const height = Math.max(1, rect.height);
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                const pixelWidth = Math.round(width * dpr);
                const pixelHeight = Math.round(height * dpr);
                if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
                    canvas.width = pixelWidth;
                    canvas.height = pixelHeight;
                }
                const ctx = canvas.getContext('2d');
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                return { ctx, width, height };
            }

            function drawBackdrop(ctx, width, height, topColor, bottomColor) {
                const gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, topColor);
                gradient.addColorStop(1, bottomColor);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = 'rgba(255,255,255,0.28)';
                for (let i = 0; i < 42; i += 1) {
                    const x = (i * 83 + 19) % Math.max(width, 1);
                    const y = (i * 47 + 31) % Math.max(height * 0.82, 1);
                    const r = i % 9 === 0 ? 1.15 : 0.65;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            function orbitPoint(day, cx, cy, rx, ry) {
                // Keep the fixed north-axis tilt visually meaningful:
                // June solstice at left (north pole toward the Sun),
                // December solstice at right (north pole away from the Sun).
                const angle = (Math.PI * 2 * (day - 356)) / 365;
                return {
                    x: cx + Math.cos(angle) * rx,
                    y: cy - Math.sin(angle) * ry,
                    angle
                };
            }

            function viewOrbitPoint(day, cx, cy, rx, ry) {
                const point = orbitPoint(day, cx, cy, rx, ry);
                // Keep the projected ellipse horizontal, as in the zodiac view.
                // Dragging changes the orbital phase shown around that fixed frame
                // instead of tilting the entire diagram across the canvas.
                const viewAngle = point.angle - spaceViewRotation;
                return {
                    x: cx + Math.cos(viewAngle) * rx,
                    y: cy - Math.sin(viewAngle) * ry,
                    angle: viewAngle
                };
            }

            function drawSpaceView() {
                const prepared = prepareCanvas(orbitCanvas);
                const ctx = prepared.ctx;
                const width = prepared.width;
                const height = prepared.height;
                drawBackdrop(ctx, width, height, '#071226', '#020617');

                const cx = width * 0.5;
                const cy = height * 0.54;
                const rx = Math.max(90, width * 0.35);
                const ry = Math.max(55, Math.min(height * 0.29, rx * 0.52));

                if (state.showOrbit) {
                    ctx.save();
                    ctx.strokeStyle = 'rgba(148,163,184,0.42)';
                    ctx.lineWidth = 1.2;
                    ctx.setLineDash([7, 6]);
                    ctx.beginPath();
                    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }

                // A calendar day identifies noon; add the fractional offset from
                // noon so Earth's orbit advances continuously between dates.
                const continuousOrbitDay = state.day + (state.hour - 12) / 24;
                const currentOrbitPosition = viewOrbitPoint(continuousOrbitDay, cx, cy, rx, ry);
                seasonPoints.forEach(point => {
                    const position = viewOrbitPoint(point.day, cx, cy, rx, ry);
                    ctx.save();
                    ctx.shadowColor = point.color;
                    ctx.shadowBlur = 12;
                    ctx.font = '22px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(point.icon, position.x, position.y + 1);
                    ctx.restore();

                    const outwardLength = Math.max(1, Math.hypot(position.x - cx, position.y - cy));
                    const outwardX = (position.x - cx) / outwardLength;
                    const outwardY = (position.y - cy) / outwardLength;
                    const overlapsEarth =
                        Math.hypot(
                            position.x - currentOrbitPosition.x,
                            position.y - currentOrbitPosition.y
                        ) < 36;
                    const labelX = overlapsEarth
                        ? position.x - outwardY * 40
                        : position.x + outwardX * 14;
                    const labelY = overlapsEarth
                        ? position.y + outwardX * 40
                        : position.y + outwardY * 14;
                    ctx.fillStyle = point.color;
                    ctx.font = `900 ${Math.max(15, Math.min(18, width * 0.018))}px Pretendard, sans-serif`;
                    ctx.textAlign = overlapsEarth
                        ? (outwardY < 0 ? 'left' : 'right')
                        : (outwardX > 0.35 ? 'left' : outwardX < -0.35 ? 'right' : 'center');
                    ctx.textBaseline = overlapsEarth ? 'middle' : (outwardY > 0 ? 'top' : 'bottom');
                    ctx.lineWidth = 4;
                    ctx.lineJoin = 'round';
                    ctx.strokeStyle = 'rgba(2, 6, 23, 0.9)';
                    ctx.strokeText(
                        `${point.label} ${point.date}`,
                        labelX,
                        labelY
                    );
                    ctx.fillText(
                        `${point.label} ${point.date}`,
                        labelX,
                        labelY
                    );
                });

                const sunRadius = clamp(Math.min(width, height) * 0.075, 18, 34);
                const sunGradient = ctx.createRadialGradient(cx - sunRadius * 0.25, cy - sunRadius * 0.25, 2, cx, cy, sunRadius * 1.45);
                sunGradient.addColorStop(0, '#fff7ae');
                sunGradient.addColorStop(0.42, '#facc15');
                sunGradient.addColorStop(1, 'rgba(245,158,11,0)');
                ctx.fillStyle = sunGradient;
                ctx.beginPath();
                ctx.arc(cx, cy, sunRadius * 1.45, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#facc15';
                ctx.beginPath();
                ctx.arc(cx, cy, sunRadius * 0.75, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#713f12';
                ctx.font = '900 10px Pretendard, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('태양', cx, cy + sunRadius + 10);

                const earthPosition = currentOrbitPosition;
                const vx = earthPosition.x - cx;
                const vy = earthPosition.y - cy;
                const distance = Math.max(1, Math.hypot(vx, vy));
                const ux = vx / distance;
                const uy = vy / distance;
                const px = -uy;
                const py = ux;
                const earthRadius = clamp(Math.min(width, height) * 0.042, 11, 19);

                if (state.showRays) {
                    ctx.save();
                    ctx.strokeStyle = 'rgba(250,204,21,0.7)';
                    ctx.lineWidth = 1.15;
                    ctx.setLineDash([3, 4]);
                    for (let offset = -7; offset <= 7; offset += 7) {
                        ctx.beginPath();
                        ctx.moveTo(
                            cx + ux * sunRadius * 0.85 + px * offset,
                            cy + uy * sunRadius * 0.85 + py * offset
                        );
                        ctx.lineTo(
                            earthPosition.x - ux * earthRadius + px * offset * 0.45,
                            earthPosition.y - uy * earthRadius + py * offset * 0.45
                        );
                        ctx.stroke();
                    }
                    ctx.restore();
                }

                ctx.save();
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 13;
                const earthGradient = ctx.createRadialGradient(
                    earthPosition.x - earthRadius * 0.35,
                    earthPosition.y - earthRadius * 0.35,
                    1,
                    earthPosition.x,
                    earthPosition.y,
                    earthRadius
                );
                earthGradient.addColorStop(0, '#7dd3fc');
                earthGradient.addColorStop(0.48, '#0ea5e9');
                earthGradient.addColorStop(1, '#075985');
                ctx.fillStyle = earthGradient;
                ctx.beginPath();
                ctx.arc(earthPosition.x, earthPosition.y, earthRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.clip();
                ctx.fillStyle = '#4ade80';
                ctx.beginPath();
                ctx.ellipse(
                    earthPosition.x - earthRadius * 0.18,
                    earthPosition.y - earthRadius * 0.12,
                    earthRadius * 0.34,
                    earthRadius * 0.21,
                    0.35,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(
                    earthPosition.x + earthRadius * 0.34,
                    earthPosition.y + earthRadius * 0.28,
                    earthRadius * 0.2,
                    earthRadius * 0.12,
                    -0.45,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.restore();

                const tilt = toRadians(23.44);
                const viewCos = Math.cos(spaceViewRotation);
                const viewSin = Math.sin(spaceViewRotation);

                // Treat the ellipse as an inclined circular orbit. This projection
                // is shared by the axial line, equator, sunlight direction and
                // observer, so all four agree about latitude and local time.
                const orbitPlaneCos = clamp(ry / rx, 0.05, 0.98);
                const orbitPlaneSin = Math.sqrt(1 - orbitPlaneCos * orbitPlaneCos);
                const projectWorldVector = (vector) => ({
                    x: vector.x,
                    y: -vector.y * orbitPlaneCos - vector.z * orbitPlaneSin,
                    z: -vector.y * orbitPlaneSin + vector.z * orbitPlaneCos
                });
                const northAxis = projectWorldVector({
                    x: Math.sin(tilt) * viewCos,
                    y: -Math.sin(tilt) * viewSin,
                    z: Math.cos(tilt)
                });
                const axisScreenLength = Math.max(
                    0.0001,
                    Math.hypot(northAxis.x, northAxis.y)
                );
                const axisX = northAxis.x / axisScreenLength;
                const axisY = northAxis.y / axisScreenLength;
                ctx.save();
                ctx.strokeStyle = '#7dd3fc';
                ctx.lineWidth = 1.4;
                ctx.setLineDash([5, 4]);
                ctx.beginPath();
                ctx.moveTo(
                    earthPosition.x - axisX * earthRadius * 1.75,
                    earthPosition.y - axisY * earthRadius * 1.75
                );
                ctx.lineTo(
                    earthPosition.x + axisX * earthRadius * 1.75,
                    earthPosition.y + axisY * earthRadius * 1.75
                );
                ctx.stroke();
                ctx.restore();

                // Project the observer's true spherical position onto this space view.
                // At local noon the observer's meridian faces the Sun; the hour angle
                // then carries that fixed latitude around Earth's tilted rotation axis.
                const sunward = projectWorldVector({
                    x: -Math.cos(earthPosition.angle),
                    y: -Math.sin(earthPosition.angle),
                    z: 0
                });
                const sunAxisDot =
                    sunward.x * northAxis.x +
                    sunward.y * northAxis.y +
                    sunward.z * northAxis.z;
                const equatorSunLength = Math.max(
                    0.0001,
                    Math.sqrt(1 - sunAxisDot * sunAxisDot)
                );
                const equatorSun = {
                    x: (sunward.x - northAxis.x * sunAxisDot) / equatorSunLength,
                    y: (sunward.y - northAxis.y * sunAxisDot) / equatorSunLength,
                    z: (sunward.z - northAxis.z * sunAxisDot) / equatorSunLength
                };
                const equatorEast = {
                    x: northAxis.y * equatorSun.z - northAxis.z * equatorSun.y,
                    y: northAxis.z * equatorSun.x - northAxis.x * equatorSun.z,
                    z: northAxis.x * equatorSun.y - northAxis.y * equatorSun.x
                };

                // Draw the equator from the same orthonormal basis used for the
                // observer. The dim dashed half is behind Earth; the solid red half
                // is the visible side of the globe.
                const drawEquatorHalf = (frontSide) => {
                    ctx.beginPath();
                    let drawing = false;
                    for (let step = 0; step <= 128; step += 1) {
                        const angle = (step / 128) * Math.PI * 2;
                        const cosAngle = Math.cos(angle);
                        const sinAngle = Math.sin(angle);
                        const equatorPoint = {
                            x: equatorSun.x * cosAngle + equatorEast.x * sinAngle,
                            y: equatorSun.y * cosAngle + equatorEast.y * sinAngle,
                            z: equatorSun.z * cosAngle + equatorEast.z * sinAngle
                        };
                        const onRequestedHalf = frontSide
                            ? equatorPoint.z >= 0
                            : equatorPoint.z < 0;
                        if (!onRequestedHalf) {
                            drawing = false;
                            continue;
                        }
                        const pointX = earthPosition.x + equatorPoint.x * earthRadius;
                        const pointY = earthPosition.y + equatorPoint.y * earthRadius;
                        if (!drawing) {
                            ctx.moveTo(pointX, pointY);
                            drawing = true;
                        } else {
                            ctx.lineTo(pointX, pointY);
                        }
                    }
                    ctx.stroke();
                };

                ctx.save();
                ctx.lineCap = 'round';
                ctx.lineWidth = 1.25;
                ctx.strokeStyle = 'rgba(248, 113, 113, 0.42)';
                ctx.setLineDash([2.5, 2.5]);
                drawEquatorHalf(false);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#ef4444';
                ctx.setLineDash([]);
                drawEquatorHalf(true);
                ctx.restore();

                const latitudeRad = toRadians(state.latitude);
                // Earth rotates west-to-east: counter-clockwise when viewed from
                // above the North Pole. Canvas time therefore advances with a
                // negative mathematical hour angle in this projection.
                const hourAngle = -toRadians((state.hour - 12) * 15);
                const latitudeScale = Math.cos(latitudeRad);
                const observerNormal = {
                    x:
                        northAxis.x * Math.sin(latitudeRad) +
                        latitudeScale * (
                            equatorSun.x * Math.cos(hourAngle) +
                            equatorEast.x * Math.sin(hourAngle)
                        ),
                    y:
                        northAxis.y * Math.sin(latitudeRad) +
                        latitudeScale * (
                            equatorSun.y * Math.cos(hourAngle) +
                            equatorEast.y * Math.sin(hourAngle)
                        ),
                    z:
                        northAxis.z * Math.sin(latitudeRad) +
                        latitudeScale * (
                            equatorSun.z * Math.cos(hourAngle) +
                            equatorEast.z * Math.sin(hourAngle)
                        )
                };
                const observerX = earthPosition.x + observerNormal.x * earthRadius;
                const observerY = earthPosition.y + observerNormal.y * earthRadius;
                const observerOnFarSide = observerNormal.z < -0.01;

                ctx.save();
                ctx.globalAlpha = observerOnFarSide ? 0.45 : 1;
                ctx.fillStyle = '#fb923c';
                ctx.strokeStyle = '#fff7ed';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(observerX, observerY, 2.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();

                const date = dayToDate(state.day);
                ctx.fillStyle = '#f8fafc';
                ctx.font = '900 12px Pretendard, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(`${date.month}월 ${date.date}일 지구 위치`, 14, height - 17);
            }

            function pathPoint(hour, declination, width, height) {
                const solarPosition = getSolarCoordinates(state.latitude, declination, hour);
                const altitude = solarPosition.altitude;
                const horizon = height - 48;
                const skyTop = 48;
                const northView = state.latitude < 0;
                const atPole = Math.abs(state.latitude) >= 89.5;

                // This view is a 360-degree horizon panorama. At either pole the
                // Sun keeps nearly the same altitude all day, so its unwrapped path
                // should look almost horizontal, with only a very shallow visual arc.
                if (atPole) {
                    const visible = altitude >= -0.01;
                    const altitudeRatio = clamp(altitude, 0, 90) / 90;
                    const progress = clamp(hour / 24, 0, 1);
                    const left = 34;
                    const right = width - 34;
                    const x = northView
                        ? right - progress * (right - left)
                        : left + progress * (right - left);
                    const baseY =
                        horizon -
                        altitudeRatio * (horizon - skyTop);
                    const shallowArc = Math.sin(progress * Math.PI) * 4;
                    const y = baseY - shallowArc;
                    return { x, y, altitude, visible };
                }

                const phi = toRadians(state.latitude);
                const delta = toRadians(declination);
                const sunriseCosine = -Math.tan(phi) * Math.tan(delta);
                let sunrise;
                let sunset;

                if (sunriseCosine >= 1) {
                    return { x: width / 2, y: horizon, altitude, visible: false };
                }
                if (sunriseCosine <= -1) {
                    sunrise = 0;
                    sunset = 24;
                } else {
                    const sunriseHourAngle = Math.acos(clamp(sunriseCosine, -1, 1)) * 180 / Math.PI / 15;
                    sunrise = 12 - sunriseHourAngle;
                    sunset = 12 + sunriseHourAngle;
                }

                const visible = hour >= sunrise && hour <= sunset;
                const daylightHours = sunset - sunrise;
                const horizontalDirection = northView ? -1 : 1;
                const halfWidth =
                    (width / 2 - 34) *
                    clamp(daylightHours / 15, 0.42, 1);
                const noonAltitude = Math.max(
                    0.001,
                    getSolarCoordinates(state.latitude, declination, 12).altitude
                );
                const altitudeRatio = clamp(altitude / noonAltitude, 0, 1);
                const ellipseX = Math.sqrt(Math.max(0, 1 - altitudeRatio * altitudeRatio));
                const timeDirection = hour <= 12 ? -1 : 1;
                const x =
                    width / 2 +
                    horizontalDirection *
                    timeDirection *
                    halfWidth *
                    ellipseX;
                const y =
                    horizon -
                    (clamp(altitude, 0, 90) / 90) *
                    (horizon - skyTop);
                return { x, y, altitude, visible };
            }

            function drawSolarPath(ctx, width, height, declination, color, lineWidth, dash) {
                ctx.save();
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.setLineDash(dash);
                ctx.beginPath();
                let drawing = false;
                for (let minute = 0; minute <= 1440; minute += 10) {
                    const point = pathPoint(minute / 60, declination, width, height);
                    if (point.visible) {
                        if (!drawing) {
                            ctx.moveTo(point.x, point.y);
                            drawing = true;
                        } else {
                            ctx.lineTo(point.x, point.y);
                        }
                    } else {
                        drawing = false;
                    }
                }
                ctx.stroke();
                ctx.restore();
            }

            function drawAnalogClock(ctx, width, height, hourValue) {
                const radius = clamp(Math.min(width, height) * 0.085, 29, 38);
                const centerX = width - radius - 22;
                const centerY = radius + 72;
                const totalMinutes = ((hourValue % 24) + 24) % 24 * 60;
                const minute = totalMinutes % 60;
                const hour = (totalMinutes / 60) % 12;
                const minuteAngle = (minute / 60) * Math.PI * 2 - Math.PI / 2;
                const hourAngle = (hour / 12) * Math.PI * 2 - Math.PI / 2;

                ctx.save();
                ctx.shadowColor = 'rgba(2, 6, 23, 0.5)';
                ctx.shadowBlur = 10;
                ctx.fillStyle = 'rgba(8, 30, 56, 0.82)';
                ctx.strokeStyle = 'rgba(250, 204, 21, 0.9)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                for (let tick = 0; tick < 60; tick += 1) {
                    const angle = (tick / 60) * Math.PI * 2 - Math.PI / 2;
                    const isHourTick = tick % 5 === 0;
                    const outer = radius - 4;
                    const inner = radius - (isHourTick ? 10 : 7);
                    ctx.strokeStyle = isHourTick
                        ? 'rgba(248, 250, 252, 0.95)'
                        : 'rgba(148, 163, 184, 0.55)';
                    ctx.lineWidth = isHourTick ? 2 : 1;
                    ctx.beginPath();
                    ctx.moveTo(
                        centerX + Math.cos(angle) * inner,
                        centerY + Math.sin(angle) * inner
                    );
                    ctx.lineTo(
                        centerX + Math.cos(angle) * outer,
                        centerY + Math.sin(angle) * outer
                    );
                    ctx.stroke();
                }

                ctx.strokeStyle = '#f8fafc';
                ctx.lineWidth = 3.6;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(hourAngle) * radius * 0.48,
                    centerY + Math.sin(hourAngle) * radius * 0.48
                );
                ctx.stroke();

                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2.4;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(minuteAngle) * radius * 0.7,
                    centerY + Math.sin(minuteAngle) * radius * 0.7
                );
                ctx.stroke();

                ctx.fillStyle = '#facc15';
                ctx.beginPath();
                ctx.arc(centerX, centerY, 3.2, 0, Math.PI * 2);
                ctx.fill();

                ctx.font = '800 10px Pretendard, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillStyle = 'rgba(248, 250, 252, 0.92)';
                ctx.fillText('현재 시각', centerX, centerY + radius + 7);
                ctx.restore();
            }

            function drawObserver() {
                const prepared = prepareCanvas(skyCanvas);
                const ctx = prepared.ctx;
                const width = prepared.width;
                const height = prepared.height;
                const horizon = height - 48;
                const currentDeclination = getDeclination(state.day);
                const currentSolarPosition = getSolarCoordinates(
                    state.latitude,
                    currentDeclination,
                    state.hour
                );
                const currentAltitude = currentSolarPosition.altitude;
                const northView = state.latitude < 0;

                // Civil and nautical twilight gradually brighten the horizon before
                // sunrise and fade it after sunset. Full daylight follows more slowly.
                const skyLight = smoothstep(-12, 6, currentAltitude);
                const fullDaylight = smoothstep(-4, 12, currentAltitude);
                const nightStrength = 1 - smoothstep(-10, 2, currentAltitude);
                const twilightStrength =
                    smoothstep(-18, -4, currentAltitude) *
                    (1 - smoothstep(3, 12, currentAltitude));

                const skyGradient = ctx.createLinearGradient(0, 0, 0, horizon);
                skyGradient.addColorStop(
                    0,
                    mixRgb([2, 6, 23], [21, 151, 223], fullDaylight)
                );
                skyGradient.addColorStop(
                    0.55,
                    mixRgb([7, 18, 41], [85, 197, 239], skyLight)
                );
                skyGradient.addColorStop(
                    1,
                    mixRgb([15, 23, 42], [217, 244, 255], skyLight)
                );
                ctx.fillStyle = skyGradient;
                ctx.fillRect(0, 0, width, horizon);

                if (twilightStrength > 0.001) {
                    const twilightGradient = ctx.createLinearGradient(0, horizon * 0.32, 0, horizon);
                    twilightGradient.addColorStop(0, 'rgba(251, 113, 133, 0)');
                    twilightGradient.addColorStop(
                        0.7,
                        `rgba(251, 146, 60, ${0.2 * twilightStrength})`
                    );
                    twilightGradient.addColorStop(
                        1,
                        `rgba(253, 186, 116, ${0.72 * twilightStrength})`
                    );
                    ctx.fillStyle = twilightGradient;
                    ctx.fillRect(0, 0, width, horizon);
                }

                if (nightStrength > 0.001) {
                    ctx.save();
                    ctx.globalAlpha = nightStrength * 0.12;
                    ctx.fillStyle = '#cbd5e1';
                    for (let star = 0; star < 8; star += 1) {
                        const starX = (star * 97 + 31) % Math.max(width, 1);
                        const starY = (star * 53 + 17) % Math.max(horizon * 0.82, 1);
                        ctx.beginPath();
                        ctx.arc(starX, starY, 0.32, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                }

                const groundGradient = ctx.createLinearGradient(0, horizon, 0, height);
                groundGradient.addColorStop(
                    0,
                    mixRgb([2, 24, 22], [21, 128, 61], skyLight)
                );
                groundGradient.addColorStop(
                    1,
                    mixRgb([1, 10, 18], [20, 83, 45], skyLight)
                );
                ctx.fillStyle = groundGradient;
                ctx.fillRect(0, horizon, width, height - horizon);

                ctx.strokeStyle = 'rgba(3,105,161,0.36)';
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 6]);
                for (let altitude = 30; altitude <= 60; altitude += 30) {
                    const y = horizon - (altitude / 90) * (horizon - 48);
                    ctx.beginPath();
                    ctx.moveTo(24, y);
                    ctx.lineTo(width - 24, y);
                    ctx.stroke();
                    ctx.fillStyle = '#075985';
                    ctx.font = '900 12px Pretendard, sans-serif';
                    ctx.textAlign = 'left';
                    ctx.fillText(`${altitude}°`, 27, y - 4);
                }
                ctx.setLineDash([]);

                drawSolarPath(ctx, width, height, 23.44, 'rgba(225,29,72,0.78)', 2, [7, 5]);
                drawSolarPath(ctx, width, height, 0, 'rgba(180,83,9,0.82)', 2, [7, 5]);
                drawSolarPath(ctx, width, height, -23.44, 'rgba(29,78,216,0.8)', 2, [7, 5]);
                drawSolarPath(ctx, width, height, currentDeclination, '#ffffff', 2.8, []);

                ctx.strokeStyle = '#0f766e';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(0, horizon);
                ctx.quadraticCurveTo(width / 2, horizon - 8, width, horizon);
                ctx.stroke();

                const leftDirection = northView ? '서 (West)' : '동 (East)';
                const rightDirection = northView ? '동 (East)' : '서 (West)';
                const facingDirection = northView ? '북 (North)' : '남 (South)';

                function drawDirectionLabel(text, x, y, alignment, color, size) {
                    ctx.font = `900 ${size}px Pretendard, sans-serif`;
                    ctx.textAlign = alignment;
                    ctx.textBaseline = 'middle';
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = 'rgba(2, 6, 23, 0.72)';
                    ctx.strokeText(text, x, y);
                    ctx.fillStyle = color;
                    ctx.fillText(text, x, y);
                }

                drawDirectionLabel(leftDirection, 16, horizon - 21, 'left', '#ffffff', 15);
                drawDirectionLabel(rightDirection, width - 16, horizon - 21, 'right', '#ffffff', 15);
                drawDirectionLabel(facingDirection, width / 2, 28, 'center', '#facc15', 16);

                ctx.fillStyle = '#7dd3fc';
                ctx.textAlign = 'left';

                const currentPoint = pathPoint(state.hour, currentDeclination, width, height);
                if (currentPoint.visible) {
                    const sunGradient = ctx.createRadialGradient(
                        currentPoint.x,
                        currentPoint.y,
                        2,
                        currentPoint.x,
                        currentPoint.y,
                        19
                    );
                    sunGradient.addColorStop(0, '#fff7ae');
                    sunGradient.addColorStop(0.35, '#facc15');
                    sunGradient.addColorStop(1, 'rgba(250,204,21,0)');
                    ctx.fillStyle = sunGradient;
                    ctx.beginPath();
                    ctx.arc(currentPoint.x, currentPoint.y, 19, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.save();
                    ctx.translate(currentPoint.x, currentPoint.y);
                    ctx.strokeStyle = 'rgba(245, 158, 11, 0.9)';
                    ctx.lineWidth = 1.5;
                    for (let ray = 0; ray < 12; ray += 1) {
                        const angle = ray * Math.PI / 6;
                        ctx.beginPath();
                        ctx.moveTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
                        ctx.lineTo(Math.cos(angle) * 14, Math.sin(angle) * 14);
                        ctx.stroke();
                    }
                    ctx.restore();

                    const sunDisc = ctx.createRadialGradient(
                        currentPoint.x - 2,
                        currentPoint.y - 2,
                        1,
                        currentPoint.x,
                        currentPoint.y,
                        8
                    );
                    sunDisc.addColorStop(0, '#fffde7');
                    sunDisc.addColorStop(0.38, '#fde047');
                    sunDisc.addColorStop(1, '#f59e0b');
                    ctx.fillStyle = sunDisc;
                    ctx.beginPath();
                    ctx.arc(currentPoint.x, currentPoint.y, 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#0f172a';
                    ctx.font = '900 12px Pretendard, sans-serif';
                    ctx.textAlign = currentPoint.x > width * 0.72 ? 'right' : 'left';
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'rgba(255,255,255,0.72)';
                    ctx.strokeText(
                        `현재 태양 · 고도 ${currentPoint.altitude.toFixed(1)}°`,
                        currentPoint.x + (currentPoint.x > width * 0.72 ? -12 : 12),
                        currentPoint.y - 14
                    );
                    ctx.fillText(
                        `현재 태양 · 고도 ${currentPoint.altitude.toFixed(1)}°`,
                        currentPoint.x + (currentPoint.x > width * 0.72 ? -12 : 12),
                        currentPoint.y - 14
                    );
                } else {
                    const nightMessage = '현재 태양은 지평선 아래에 있습니다.';
                    ctx.font = '900 13px Pretendard, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const messageWidth = ctx.measureText(nightMessage).width + 24;
                    ctx.fillStyle = 'rgba(255,255,255,0.88)';
                    ctx.strokeStyle = 'rgba(15,23,42,0.38)';
                    ctx.lineWidth = 1;
                    ctx.fillRect(width / 2 - messageWidth / 2, horizon - 39, messageWidth, 24);
                    ctx.strokeRect(width / 2 - messageWidth / 2, horizon - 39, messageWidth, 24);
                    ctx.fillStyle = '#0f172a';
                    ctx.fillText(nightMessage, width / 2, horizon - 27);
                }

                // A fixed observer viewed from behind anchors the ground-level perspective.
                const observerX = width / 2;
                const observerY = horizon + 2;
                ctx.fillStyle = '#fb923c';
                ctx.beginPath();
                ctx.arc(observerX, observerY - 11, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(observerX - 1, observerY - 14, 6.5, Math.PI, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(observerX - 8, observerY - 14, 13, 2.5);
                ctx.fillStyle = '#0ea5e9';
                ctx.beginPath();
                ctx.moveTo(observerX - 7, observerY - 5);
                ctx.lineTo(observerX + 7, observerY - 5);
                ctx.lineTo(observerX + 10, observerY + 17);
                ctx.lineTo(observerX - 10, observerY + 17);
                ctx.closePath();
                ctx.fill();

                let backDirection;
                if (state.latitude >= 89.5) {
                    backDirection = '북극 · 모든 방향이 남쪽';
                } else if (state.latitude <= -89.5) {
                    backDirection = '남극 · 모든 방향이 북쪽';
                } else {
                    backDirection = northView
                        ? '남 (South) · 관측자 뒤쪽'
                        : '북 (North) · 관측자 뒤쪽';
                }
                drawDirectionLabel(backDirection, observerX, horizon + 35, 'center', '#fef3c7', 12);
                drawAnalogClock(ctx, width, height, state.hour);
            }

            function syncControls() {
                const date = dayToDate(state.day);
                const quarterHour = clamp(Math.round(state.hour * 4), 0, 95);
                const safeMinutes = quarterHour * 15;
                const hour = Math.floor(safeMinutes / 60);
                const minute = safeMinutes % 60;
                const declination = getDeclination(state.day);

                daySlider.value = String(Math.round(state.day));
                timeSlider.value = String(quarterHour);
                dateDisplay.textContent = `${date.month}월 ${date.date}일`;
                timeDisplay.textContent = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                seasonDisplay.textContent = `${getSeasonName(state.day)} · 태양 적위 ${declination >= 0 ? '+' : ''}${declination.toFixed(1)}°`;
                if (state.latitude >= 89.5) {
                    observerCaption.textContent = `${state.place}의 360° 지평선 · 모든 방향이 남쪽`;
                } else if (state.latitude <= -89.5) {
                    observerCaption.textContent = `${state.place}의 360° 지평선 · 모든 방향이 북쪽`;
                } else {
                    observerCaption.textContent =
                        state.latitude < 0
                            ? `${state.place}에서 북쪽 하늘을 바라본 모습`
                            : `${state.place}에서 남쪽 하늘을 바라본 모습`;
                }

            }

            function pickSpaceSeasonPoint(event) {
                const rect = orbitCanvas.getBoundingClientRect();
                if (!rect.width || !rect.height) return null;
                const pointerX = event.clientX - rect.left;
                const pointerY = event.clientY - rect.top;
                const cx = rect.width * 0.5;
                const cy = rect.height * 0.54;
                const rx = Math.max(90, rect.width * 0.35);
                const ry = Math.max(55, Math.min(rect.height * 0.29, rx * 0.52));

                let nearest = null;
                let nearestDistance = 34;
                seasonPoints.forEach(point => {
                    const position = viewOrbitPoint(point.day, cx, cy, rx, ry);
                    const distance = Math.hypot(
                        pointerX - position.x,
                        pointerY - position.y
                    );
                    if (distance < nearestDistance) {
                        nearest = point;
                        nearestDistance = distance;
                    }
                });
                return nearest;
            }

            function render() {
                syncControls();
                drawSpaceView();
                drawObserver();
            }

            function pause() {
                state.playing = false;
                playButton.textContent = '▶ 재생';
            }

            playButton.addEventListener('click', () => {
                state.playing = !state.playing;
                playButton.textContent = state.playing ? '⏸ 일시정지' : '▶ 재생';
            });

            speedSlider.addEventListener('input', () => {
                state.speed = Math.pow(10, Number(speedSlider.value) / 20);
                if (speedValue) {
                    speedValue.textContent = `${state.speed < 1 ? state.speed.toFixed(2) : state.speed.toFixed(1)}×`;
                }
            });

            if (orbitToggle) {
                orbitToggle.addEventListener('change', () => {
                    state.showOrbit = orbitToggle.checked;
                    render();
                });
            }

            if (rayToggle) {
                rayToggle.addEventListener('change', () => {
                    state.showRays = rayToggle.checked;
                    render();
                });
            }

            daySlider.addEventListener('input', () => {
                state.day = Number(daySlider.value);
                pause();
                render();
            });

            timeSlider.addEventListener('input', () => {
                state.hour = Number(timeSlider.value) / 4;
                pause();
                render();
            });

            orbitCanvas.addEventListener('pointerdown', event => {
                orbitDragState = {
                    pointerId: event.pointerId,
                    startX: event.clientX,
                    startY: event.clientY,
                    startRotation: spaceViewRotation,
                    moved: false
                };
                suppressOrbitPointClick = false;
                if (orbitCanvas.setPointerCapture) {
                    orbitCanvas.setPointerCapture(event.pointerId);
                }
                orbitCanvas.style.cursor = 'grabbing';
            });
            orbitCanvas.addEventListener('pointermove', event => {
                if (orbitDragState && orbitDragState.pointerId === event.pointerId) {
                    const deltaX = event.clientX - orbitDragState.startX;
                    const deltaY = event.clientY - orbitDragState.startY;
                    if (Math.hypot(deltaX, deltaY) > 5) {
                        orbitDragState.moved = true;
                    }
                    if (orbitDragState.moved) {
                        const rect = orbitCanvas.getBoundingClientRect();
                        const nextRotation =
                            orbitDragState.startRotation +
                            (deltaX / Math.max(rect.width, 1)) * Math.PI * 2;
                        spaceViewRotation = Math.atan2(
                            Math.sin(nextRotation),
                            Math.cos(nextRotation)
                        );
                        render();
                    }
                    return;
                }
                orbitCanvas.style.cursor = pickSpaceSeasonPoint(event) ? 'pointer' : 'grab';
            });
            function finishOrbitDrag(event) {
                if (!orbitDragState || orbitDragState.pointerId !== event.pointerId) return;
                suppressOrbitPointClick = orbitDragState.moved;
                if (
                    orbitCanvas.releasePointerCapture &&
                    (!orbitCanvas.hasPointerCapture || orbitCanvas.hasPointerCapture(event.pointerId))
                ) {
                    orbitCanvas.releasePointerCapture(event.pointerId);
                }
                orbitDragState = null;
                orbitCanvas.style.cursor = 'grab';
            }
            orbitCanvas.addEventListener('pointerup', finishOrbitDrag);
            orbitCanvas.addEventListener('pointercancel', finishOrbitDrag);
            orbitCanvas.addEventListener('pointerleave', () => {
                if (!orbitDragState) orbitCanvas.style.cursor = 'grab';
            });
            orbitCanvas.addEventListener('click', event => {
                if (suppressOrbitPointClick) {
                    suppressOrbitPointClick = false;
                    return;
                }
                const point = pickSpaceSeasonPoint(event);
                if (!point) return;
                state.day = point.day;
                state.hour = 12;
                pause();
                render();
            });

            function setSeasonalObserver(button) {
                if (!button) return;
                state.latitude = Number(button.dataset.sunpathLat);
                state.place = button.dataset.sunpathPlace || '관측자';
                locationButtons.forEach(item => item.classList.toggle('active', item === button));
                render();
            }

            locationButtons.forEach(button => {
                button.addEventListener('click', () => {
                    setSeasonalObserver(button);
                    window.dispatchEvent(new CustomEvent('earthmoon:observer-change', {
                        detail: {
                            locationKey: button.dataset.observerLocation,
                            source: 'sunpath'
                        }
                    }));
                });
            });

            window.addEventListener('earthmoon:observer-change', event => {
                if (!event.detail || event.detail.source === 'sunpath') return;
                const button = locationButtons.find(item =>
                    item.dataset.observerLocation === event.detail.locationKey
                );
                setSeasonalObserver(button);
            });

            window.addEventListener('resize', render, { passive: true });

            function animate(now) {
                const deltaSeconds = Math.min(0.1, Math.max(0, (now - lastFrame) / 1000));
                lastFrame = now;
                if (state.playing && !panel.hidden) {
                    state.hour += deltaSeconds * 6 * state.speed;
                    while (state.hour >= 24) {
                        state.hour -= 24;
                        state.day = state.day >= 365 ? 1 : state.day + 1;
                    }
                }
                if (!panel.hidden) render();
                requestAnimationFrame(animate);
            }

            render();
            requestAnimationFrame(animate);
        })();

        // Dedicated Earth & Moon Quiz Engine
        (function() {
            const quizData = [
                { cat: "지구의 자전", q: "지구의 자전 방향으로 옳은 것은?", ans: 0, opts: ["서쪽에서 동쪽, 북극 위에서 보면 시계 반대 방향", "동쪽에서 서쪽, 북극 위에서 보면 시계 반대 방향", "서쪽에서 동쪽, 북극 위에서 보면 시계 방향", "동쪽에서 서쪽, 북극 위에서 보면 시계 방향"], exp: "해설: 지구는 서쪽에서 동쪽으로, 북극 위에서 내려다보면 시계 반대 방향으로 자전합니다. 그래서 태양과 별은 그 반대인 동쪽에서 떠서 서쪽으로 지는 것처럼 보입니다." },
                { cat: "낮과 밤", q: "낮과 밤이 반복되는 직접적인 원인은 무엇인가?", ans: 1, opts: ["지구의 공전", "지구의 자전", "달의 공전", "태양의 자전"], exp: "해설: 지구가 약 24시간에 한 바퀴 자전하면서 태양을 향하는 쪽과 등지는 쪽이 바뀌어 낮과 밤이 반복됩니다." },
                { cat: "지구의 공전", q: "지구가 태양 주위를 한 바퀴 공전하는 데 걸리는 시간에 가장 가까운 것은?", ans: 2, opts: ["약 24시간", "약 29.5일", "약 365.24일", "약 27.3일"], exp: "해설: 지구의 공전 주기는 약 365.24일이며, 달력은 이를 보정하기 위해 윤년을 둡니다." },
                { cat: "계절 변화", q: "지구에서 계절이 생기는 가장 중요한 두 조건의 조합은?", ans: 3, opts: ["기울어진 자전축과 지구의 자전", "지구-태양 거리 변화와 지구의 공전", "지구-태양 거리 변화와 지구의 자전", "기울어진 자전축과 지구의 공전"], exp: "해설: 지구는 자전축이 약 23.5° 기울어진 채 태양 주위를 공전하므로 계절에 따라 태양 고도와 낮의 길이가 달라집니다. 지구와 태양 사이의 거리 변화는 계절의 주된 원인이 아닙니다." },
                { cat: "계절 변화", q: "북반구가 여름일 때 남반구의 계절은 무엇인가?", ans: 1, opts: ["여름", "겨울", "봄", "가을"], exp: "해설: 한쪽 반구가 태양 쪽으로 기울 때 반대쪽 반구는 태양에서 멀어지는 방향으로 기울므로 두 반구의 계절은 반대입니다." },
                { cat: "태양의 남중 고도", q: "한국에서 태양의 남중 고도가 가장 높은 때는 언제인가?", ans: 0, opts: ["하지 무렵", "춘분 무렵", "추분 무렵", "동지 무렵"], exp: "해설: 북반구의 하지 무렵에는 태양의 적위가 가장 북쪽에 있어 한국에서 남중 고도가 가장 높습니다." },
                { cat: "태양의 남중 고도", q: "같은 장소에서 태양의 남중 고도가 높아질 때 일반적으로 나타나는 변화는?", ans: 2, opts: ["정오 무렵 그림자가 길어진다", "밤의 길이가 길어진다", "정오 무렵 그림자가 짧아진다", "같은 면적이 받는 햇빛 에너지가 줄어든다"], exp: "해설: 태양이 높이 떠 있을수록 햇빛이 더 수직에 가깝게 비쳐 같은 물체의 그림자는 짧아집니다. 이때 낮은 길어지고 밤은 짧아지며, 같은 면적이 받는 햇빛 에너지는 많아집니다." },
                { cat: "춘분·추분", q: "춘분과 추분 무렵에 공통으로 나타나는 현상은?", ans: 1, opts: ["태양이 북동쪽에서 뜬다", "낮과 밤의 길이가 거의 같다", "태양의 남중 고도가 1년 중 가장 높다", "정오의 그림자가 1년 중 가장 길다"], exp: "해설: 춘분과 추분에는 태양이 천구의 적도 부근에 있어 전 지구적으로 낮과 밤의 길이가 거의 같습니다. 태양이 북동쪽에서 뜨고 남중 고도가 가장 높은 때는 하지, 정오의 그림자가 가장 긴 때는 동지 무렵입니다." },
                { cat: "달의 공전", q: "달의 자전 주기와 공전 주기가 같아서 나타나는 현상은?", ans: 0, opts: ["지구에서는 달의 거의 같은 면만 보인다", "달의 위상이 한 달 내내 변하지 않는다", "달의 뒷면은 늘 햇빛을 받지 못한다", "달이 실제로는 자전하지 않는다"], exp: "해설: 달은 약 27.3일을 주기로 자전과 공전을 하므로 지구를 향하는 면이 거의 일정합니다. 이를 동주기 자전이라고 합니다. 달의 뒷면도 삭 무렵에는 햇빛을 받으며, 달은 공전하는 동안 실제로 한 바퀴 자전합니다." },
                { cat: "달의 위상", q: "달의 위상이 변하는 까닭은 무엇인가?", ans: 2, opts: ["달이 스스로 내는 빛의 밝기가 바뀌기 때문에", "지구 그림자가 달의 일부를 가리기 때문에", "달이 공전하며 밝은 면을 보는 각도가 달라지기 때문에", "달이 자전하며 밝은 면이 조금씩 돌아가기 때문에"], exp: "해설: 달의 절반은 항상 태양빛을 받지만 달의 공전에 따라 지구에서 보이는 밝은 부분의 비율이 달라집니다. 지구 그림자가 달을 가리는 것은 월식입니다." },
                { cat: "달의 위상", q: "위상의 변화 순서로 옳은 것은?", ans: 3, opts: ["삭→보름달→상현달→하현달", "상현달→삭→보름달→초승달", "보름달→상현달→삭→하현달", "삭→상현달→보름달→하현달"], exp: "해설: 대표 위상은 삭, 상현달, 보름달(망), 하현달의 순서로 반복됩니다." },
                { cat: "달의 위상", q: "음력 7~8일 무렵 오른쪽 반쪽이 밝게 보이는 달은?", ans: 1, opts: ["초승달", "상현달", "보름달", "하현달"], exp: "해설: 음력 7~8일 무렵에는 오른쪽 절반이 밝은 상현달을 볼 수 있습니다." },
                { cat: "달의 위상", q: "태양-지구-달이 이 순서로 거의 일직선에 놓일 때 보이는 달의 위상은?", ans: 2, opts: ["삭", "상현달", "보름달", "하현달"], exp: "해설: 달이 태양의 반대편에 놓이면 지구 쪽을 향한 면 대부분이 밝게 보여 보름달이 됩니다." },
                { cat: "달의 관측", q: "보름달이 남쪽 하늘에서 가장 높이 보이는 때는 대략 언제인가?", ans: 3, opts: ["해 뜰 무렵", "정오", "해 질 무렵", "자정 무렵"], exp: "해설: 보름달은 해 질 무렵 동쪽에서 떠서 자정 무렵 남중하고 해 뜰 무렵 서쪽으로 집니다." },
                { cat: "달의 관측", q: "상현달을 관측하기 가장 알맞은 시각과 방향은?", ans: 0, opts: ["해 질 무렵 남쪽 하늘", "자정 무렵 동쪽 하늘", "해 뜰 무렵 남쪽 하늘", "정오 무렵 서쪽 하늘"], exp: "해설: 상현달은 정오 무렵 떠서 해 질 무렵 남중하며 자정 무렵 서쪽으로 집니다." },
                { cat: "달의 관측", q: "하현달이 남쪽 하늘에서 가장 높이 보이는 때는 대략 언제인가?", ans: 1, opts: ["해 질 무렵", "해 뜰 무렵", "정오", "자정"], exp: "해설: 하현달은 자정 무렵 떠서 해 뜰 무렵 남중하고 정오 무렵 집니다." },
                { cat: "달의 주기", q: "삭에서 다음 삭까지 걸리는 시간(약 29.5일)이 달의 공전 주기(약 27.3일)보다 긴 까닭은?", ans: 2, opts: ["달이 공전하는 동안 지구가 계속 자전하기 때문에", "달이 공전하는 동안 스스로도 자전하기 때문에", "달이 공전하는 동안 지구도 태양 주위를 돌기 때문에", "달의 공전 궤도면이 약 5° 기울어져 있기 때문에"], exp: "해설: 달이 별을 기준으로 한 바퀴 도는 동안 지구도 공전하므로 같은 태양-지구-달 배치로 돌아오려면 더 이동해야 합니다." },
                {"cat":"본그림자와 반그림자","q":"태양빛을 가리는 천체 뒤에서 태양 전체가 가려져 직접 오는 태양빛이 도달하지 않는 영역은?","ans":0,"opts":["본그림자","반그림자","태양의 밝은 면","지구의 낮인 면"],"exp":"본그림자에서는 태양 전체가 가려집니다. 반그림자에는 태양빛의 일부가 도달합니다."},
                {"cat":"본그림자와 반그림자","q":"태양의 일부만 가려져 태양빛의 일부가 도달하는 영역에 대한 설명으로 옳은 것은?","ans":1,"opts":["본그림자이며 항상 개기일식이 보인다","반그림자이며 태양빛이 완전히 차단되지는 않는다","본그림자이며 태양 전체가 보인다","반그림자이며 태양빛이 전혀 도달하지 않는다"],"exp":"반그림자는 크기가 있는 광원인 태양의 일부만 가려지는 영역입니다. 본그림자와 구분해야 합니다."},
                {"cat":"일식의 종류와 관측","diagram":"solar-observers","q":"그림에서 A와 B는 지구의 서로 다른 관측 위치이다. 두 관측자가 보는 현상을 바르게 짝지은 것은?","ans":2,"opts":["A: 부분일식, B: 개기일식","A: 개기월식, B: 부분월식","A: 개기일식, B: 부분일식","A와 B 모두 같은 모양의 개기일식"],"exp":"A에서는 태양 전체가, B에서는 태양 일부가 가려집니다. 일식의 보이는 모습은 지구의 관측 위치에 따라 달라집니다."},
                {"cat":"월식의 종류와 관측","q":"달 전체가 지구의 본그림자 안에 들어간 상태를 무엇이라고 하는가?","ans":0,"opts":["개기월식","부분월식","부분일식","반영월식"],"exp":"개기월식은 달 전체가 지구의 본그림자 안에 들어간 경우입니다. 달 전체가 단순히 반그림자 안에 있는 것과는 다릅니다."},
                {"cat":"월식의 종류와 관측","q":"달의 일부가 지구의 본그림자 안에 들어가고 나머지는 본그림자 밖에 있다. 이 현상은?","ans":1,"opts":["개기월식","부분월식","개기일식","달의 위상인 상현달"],"exp":"부분월식은 달 일부만 본그림자에 들어간 상태입니다. 상현달처럼 달의 공전에 따라 밝은 면을 절반만 보는 위상 변화와 구분합니다."},
                {"cat":"월식의 종류와 관측","q":"달이 지구의 반그림자만 통과하고 본그림자에는 들어가지 않았다. 이에 대한 설명으로 옳은 것은?","ans":3,"opts":["부분월식이므로 달 일부가 본그림자에 들어갔다","개기월식이므로 태양빛이 직접 도달하지 않는다","일식이므로 달이 태양과 지구 사이에 있다","반영월식이며 달이 조금 어두워질 수 있다"],"exp":"반그림자만 통과하면 반영월식입니다. 부분월식은 달의 일부가 본그림자에 들어가야 하므로 서로 다른 현상입니다."},
                {"cat":"식의 배열과 위상","q":"일식과 월식이 일어날 수 있는 달의 위상을 바르게 짝지은 것은?","ans":2,"opts":["일식: 보름, 월식: 삭","일식: 상현, 월식: 하현","일식: 삭, 월식: 보름","일식과 월식 모두 상현"],"exp":"일식 때는 태양과 지구 사이에 달이 있는 삭, 월식 때는 태양 반대편에 달이 있는 보름입니다. 삭과 보름이 될 때마다 식이 생기는 것은 아닙니다."},
                {"cat":"일식의 종류와 관측","q":"일식과 월식을 관측할 수 있는 지역에 대한 설명으로 옳은 것은?","ans":0,"opts":["일식은 달의 그림자가 닿는 일부 지역, 월식은 달이 보이는 밤인 지역에서 관측한다","일식과 월식 모두 지구 어디서나 동시에 보인다","월식은 달의 그림자가 지구에 닿는 지역에서만 보인다","일식은 밤인 지역, 월식은 낮인 지역에서 보인다"],"exp":"일식은 지구에 생긴 달 그림자 안에서 관측합니다. 월식은 지구 그림자에 들어간 달을 보는 현상이므로 달이 지평선 위에 있는 밤인 지역에서 관측할 수 있습니다."},
                { cat: "식의 배열과 위상", q: "태양-달-지구 순서로 거의 일직선이 될 때 일어날 수 있는 현상은?", ans: 0, opts: ["일식", "월식", "보름달", "상현달"], exp: "해설: 달이 태양과 지구 사이에서 태양빛을 가릴 때 일식이 일어납니다." },
                { cat: "식의 배열과 위상", q: "태양-지구-달 순서로 거의 일직선이 될 때 일어날 수 있는 현상은?", ans: 1, opts: ["일식", "월식", "삭", "상현달"], exp: "해설: 보름달 무렵 달이 지구의 그림자에 들어가면 월식이 일어납니다. 본그림자에 들어가는 정도에 따라 개기월식과 부분월식으로 구분합니다." },
                { cat: "식이 일어나는 조건", q: "일식과 월식이 매달 일어나지 않는 주된 이유는?", ans: 3, opts: ["달의 자전 주기와 공전 주기가 같아서", "달의 공전 궤도가 원이 아니라 타원이어서", "지구의 자전축이 약 23.5° 기울어져 있어서", "달의 공전 궤도면이 황도면과 약 5° 기울어져 있어서"], exp: "해설: 달의 공전 궤도면은 황도면에 대해 약 5° 기울어져 있어 대부분의 삭과 망에는 세 천체가 정확히 일직선이 되지 않습니다." },
                { cat: "태양의 일주 운동", q: "우리나라에서 태양이 하루 동안 움직이는 것처럼 보이는 일반적인 방향은?", ans: 0, opts: ["동쪽에서 떠서 남쪽 하늘을 지나 서쪽으로 진다", "서쪽에서 떠서 남쪽 하늘을 지나 동쪽으로 진다", "동쪽에서 떠서 북쪽 하늘을 지나 서쪽으로 진다", "서쪽에서 떠서 북쪽 하늘을 지나 동쪽으로 진다"], exp: "해설: 지구가 서쪽에서 동쪽으로 자전하기 때문에 태양은 동쪽에서 떠서 남쪽 하늘을 지나 서쪽으로 지는 것처럼 보입니다. 북쪽 하늘을 지나는 경로는 남반구 중위도에서 볼 수 있습니다." },
                { cat: "태양의 남중", q: "태양이 남중한다는 말의 뜻으로 가장 알맞은 것은?", ans: 2, opts: ["태양이 머리 바로 위의 천정을 지나는 때", "태양이 1년 중 가장 남쪽에서 떠오르는 때", "태양이 정남쪽을 지나며 하루 중 가장 높이 뜬 때", "태양이 정남쪽 지평선 가까이 낮게 뜬 때"], exp: "해설: 태양은 정남쪽 자오선을 지날 때 하루 중 고도가 가장 높으며 이를 남중이라고 합니다. 우리나라에서는 남중할 때도 태양이 천정까지 올라가지는 않습니다." },
                { cat: "태양의 남중 고도", q: "위도 37.5°인 곳에서 춘분·추분의 태양 남중 고도에 가장 가까운 것은?", ans: 1, opts: ["약 37.5°", "약 52.5°", "약 66.5°", "약 90°"], exp: "해설: 춘분·추분에는 태양 적위가 0°이므로 남중 고도는 90°-위도=약 52.5°입니다." },
                { cat: "일출·일몰", q: "우리나라에서 춘분과 추분 무렵 태양이 뜨고 지는 방향은?", ans: 3, opts: ["북동쪽에서 떠서 북서쪽으로 진다", "남동쪽에서 떠서 남서쪽으로 진다", "정남쪽에서 떠서 정북쪽으로 진다", "정동쪽에서 떠서 정서쪽으로 진다"], exp: "해설: 춘분과 추분 무렵 태양은 정동쪽 부근에서 떠서 정서쪽 부근으로 집니다." },
                { cat: "하지", q: "우리나라에서 하지 무렵 태양의 일주 경로를 바르게 설명한 것은?", ans: 1, opts: ["남동쪽에서 떠서 낮고 짧은 경로로 남서쪽에 진다", "북동쪽에서 떠서 높고 긴 경로로 북서쪽에 진다", "북동쪽에서 떠서 낮고 짧은 경로로 북서쪽에 진다", "남동쪽에서 떠서 높고 긴 경로로 남서쪽에 진다"], exp: "해설: 하지 무렵에는 태양이 북동쪽에서 일찍 떠서 높은 경로를 길게 지나 북서쪽으로 늦게 집니다." },
                { cat: "동지", q: "우리나라에서 동지 무렵 태양의 일주 경로를 바르게 설명한 것은?", ans: 2, opts: ["북동쪽에서 떠서 높고 긴 경로로 북서쪽에 진다", "남동쪽에서 떠서 높고 긴 경로로 남서쪽에 진다", "남동쪽에서 떠서 낮고 짧은 경로로 남서쪽에 진다", "북동쪽에서 떠서 낮고 짧은 경로로 북서쪽에 진다"], exp: "해설: 동지 무렵에는 태양이 남동쪽에서 늦게 떠서 낮고 짧은 경로를 지난 뒤 남서쪽으로 일찍 집니다." },
                { cat: "계절과 낮의 길이", q: "우리나라에서 낮의 길이가 가장 긴 때와 가장 짧은 때를 바르게 짝지은 것은?", ans: 0, opts: ["하지-가장 김, 동지-가장 짧음", "춘분-가장 김, 추분-가장 짧음", "동지-가장 김, 하지-가장 짧음", "하지-가장 김, 추분-가장 짧음"], exp: "해설: 태양의 일주 경로가 가장 길고 높은 하지는 낮이 가장 길며, 경로가 가장 짧고 낮은 동지는 낮이 가장 짧습니다." },
                { cat: "태양 고도와 그림자", q: "같은 막대의 그림자가 하루 중 가장 짧아지는 때는 언제인가?", ans: 1, opts: ["해 뜰 무렵", "태양이 남중할 무렵", "해 질 무렵", "오전 9시 무렵"], exp: "해설: 태양이 남중할 때 고도가 가장 높으므로 물체의 그림자는 하루 중 가장 짧습니다." },
                { cat: "태양 고도와 그림자", q: "막대 그림자의 방향은 태양이 있는 방향과 어떤 관계인가?", ans: 3, opts: ["태양과 같은 쪽", "태양 방향에서 90° 옆쪽", "오전에는 같은 쪽, 오후에는 반대쪽", "태양과 반대쪽"], exp: "해설: 빛은 태양 쪽에서 오므로 불투명한 물체의 그림자는 태양 반대쪽에 생깁니다." },
                { cat: "위도와 태양 고도", q: "같은 날짜의 정오에 한국보다 더 북쪽으로 이동하면 태양의 남중 고도는 일반적으로 어떻게 변하는가?", ans: 2, opts: ["높아진다", "거의 변하지 않는다", "낮아진다", "위도가 아니라 경도에 따라 달라진다"], exp: "해설: 같은 태양 적위에서 북위가 커질수록 태양의 남중 고도는 낮아집니다. 경도가 달라지면 남중 시각이 달라질 뿐 남중 고도는 거의 같습니다." },
                { cat: "적도의 태양 경로", q: "적도 부근에서 연중 낮과 밤의 길이에 대한 설명으로 가장 알맞은 것은?", ans: 0, opts: ["대체로 각각 12시간에 가깝다", "여름에는 낮이 24시간이다", "겨울에는 밤이 24시간이다", "하지에는 낮이 14시간을 넘는다"], exp: "해설: 적도 부근에서는 태양의 일주 경로가 연중 지평선 위와 아래를 거의 같은 길이로 지나 낮과 밤이 약 12시간에 가깝습니다. 낮이나 밤이 24시간 이어지는 것은 극지방, 하지에 낮이 14시간을 넘는 것은 우리나라 같은 중위도 지방의 일입니다." },
                { cat: "계절의 원인", q: "지구가 공전하는 동안 자전축에 대해 옳은 설명은?", ans: 1, opts: ["계절마다 기울기 방향이 반대로 뒤집힌다", "약 23.5° 기울어진 방향을 거의 일정하게 유지한다", "하지에는 기울기가 0°가 된다", "태양을 향하도록 계속 방향을 바꾼다"], exp: "해설: 지구는 자전축이 약 23.5° 기울어진 채 거의 같은 방향을 유지하며 태양 주위를 공전합니다." },
                { cat: "계절의 원인", q: "북반구의 여름이 지구가 태양에 가까워져서 생긴다는 설명이 틀린 근거는?", ans: 2, opts: ["태양이 내는 빛의 세기가 계절에 따라 크게 달라진다", "지구의 공전 궤도가 완전한 원이라 거리가 변하지 않는다", "같은 때 남반구는 겨울이라 거리로는 반대 계절을 설명할 수 없다", "지구가 태양에 가까울수록 공전 속도가 느려진다"], exp: "해설: 지구 전체의 태양 거리는 두 반구에 같지만 북반구와 남반구의 계절은 반대이므로 계절의 주원인은 거리 변화가 아닙니다. 실제로 지구는 북반구가 겨울인 1월 초에 태양과 가장 가깝습니다." },
                { cat: "계절과 에너지", q: "태양의 남중 고도가 높을수록 지표가 더 잘 데워지는 주된 까닭은?", ans: 0, opts: ["같은 양의 햇빛이 더 좁은 면적에 모이기 때문에", "태양과 지표 사이의 거리가 가까워지기 때문에", "같은 양의 햇빛이 더 넓은 면적에 퍼지기 때문에", "햇빛이 지나는 대기의 두께가 두꺼워지기 때문에"], exp: "해설: 태양 고도가 높으면 햇빛이 지표에 더 수직으로 들어와 같은 에너지가 좁은 면적에 집중됩니다. 이때 햇빛이 지나는 대기의 두께는 오히려 얇아집니다." },
                { cat: "삭의 관측", q: "삭 무렵 달의 뜨는 시각과 지는 시각으로 가장 알맞은 것은?", ans: 1, opts: ["해 질 무렵 떠서 해 뜰 무렵 진다", "해 뜰 무렵 떠서 해 질 무렵 진다", "정오 무렵 떠서 자정 무렵 진다", "자정 무렵 떠서 정오 무렵 진다"], exp: "해설: 삭 무렵 달은 태양과 거의 같은 방향에 있어 해 뜰 무렵 뜨고 해 질 무렵 지며 밝은 낮하늘에 가려 관측하기 어렵습니다." },
                { cat: "상현달의 관측", q: "상현달의 뜨는 시각과 지는 시각으로 가장 알맞은 것은?", ans: 2, opts: ["해 질 무렵 떠서 해 뜰 무렵 진다", "자정 무렵 떠서 정오 무렵 진다", "정오 무렵 떠서 자정 무렵 진다", "해 뜰 무렵 떠서 해 질 무렵 진다"], exp: "해설: 상현달은 정오 무렵 떠서 해 질 무렵 남중하고 자정 무렵 집니다." },
                { cat: "보름달의 관측", q: "보름달의 뜨는 시각과 지는 시각으로 가장 알맞은 것은?", ans: 0, opts: ["해 질 무렵 떠서 해 뜰 무렵 진다", "정오 무렵 떠서 자정 무렵 진다", "해 뜰 무렵 떠서 해 질 무렵 진다", "자정 무렵 떠서 정오 무렵 진다"], exp: "해설: 보름달은 태양 반대 방향에 있어 해 질 무렵 동쪽에서 떠서 자정에 남중하고 해 뜰 무렵 서쪽으로 집니다." },
                { cat: "하현달의 관측", q: "하현달의 뜨는 시각과 지는 시각으로 가장 알맞은 것은?", ans: 3, opts: ["정오 무렵 떠서 자정 무렵 진다", "해 질 무렵 떠서 해 뜰 무렵 진다", "해 뜰 무렵 떠서 해 질 무렵 진다", "자정 무렵 떠서 정오 무렵 진다"], exp: "해설: 하현달은 자정 무렵 떠서 해 뜰 무렵 남중하고 정오 무렵 집니다." },
                { cat: "달의 위상과 위치", q: "초승달은 해가 진 직후 어느 하늘에서 관측하기 가장 좋은가?", ans: 1, opts: ["동쪽 하늘", "서쪽 하늘", "남쪽 하늘", "남동쪽 하늘"], exp: "해설: 초승달은 태양에서 동쪽으로 조금 떨어져 있어 해가 진 직후 서쪽 하늘에서 잠시 보입니다. 해가 진 직후 남쪽 하늘에는 상현달, 동쪽 하늘에는 보름달이 보입니다." },
                { cat: "위도와 낮의 길이", q: "북극 지방의 여름에 태양이 지평선 아래로 지지 않는 현상을 무엇이라 하는가?", ans: 2, opts: ["오로라", "극야", "백야", "하지"], exp: "해설: 자전축이 기울어진 지구에서 북극 지방의 여름에는 태양이 하루 종일 지평선 위에 머무는 백야가 나타날 수 있습니다. 겨울에 해가 하루 종일 뜨지 않는 극야와 반대되는 현상입니다." }
            ];

            const quizTopics = [
                {
                    name: '지구의 운동과 계절',
                    subs: [
                        { name: '자전과 공전', cats: ['지구의 자전', '낮과 밤', '지구의 공전'] },
                        { name: '계절 변화', cats: ['계절 변화', '계절의 원인', '계절과 에너지', '계절과 낮의 길이'] }
                    ]
                },
                {
                    name: '태양의 고도와 일주',
                    subs: [
                        { name: '남중 고도', cats: ['태양의 남중 고도', '태양의 남중', '위도와 태양 고도'] },
                        { name: '일주 경로', cats: ['태양의 일주 운동', '일출·일몰', '하지', '동지', '춘분·추분', '적도의 태양 경로', '위도와 낮의 길이'] },
                        { name: '고도와 그림자', cats: ['태양 고도와 그림자'] }
                    ]
                },
                {
                    name: '달의 위상과 관측',
                    subs: [
                        { name: '위상 변화', cats: ['달의 위상', '달의 위상과 위치', '달의 주기', '달의 공전'] },
                        { name: '위상별 관측', cats: ['달의 관측', '삭의 관측', '상현달의 관측', '보름달의 관측', '하현달의 관측'] }
                    ]
                },
                {
                    name: '일식과 월식',
                    subs: [
                        { name: '본그림자·반그림자', cats: ['본그림자와 반그림자'] },
                        { name: '배열과 달의 위상', cats: ['식의 배열과 위상'] },
                        { name: '일식의 종류와 관측', cats: ['일식의 종류와 관측'] },
                        { name: '월식의 종류와 관측', cats: ['월식의 종류와 관측'] },
                        { name: '매달 생기지 않는 이유', cats: ['식이 일어나는 조건'] }
                    ]
                }
            ];

            window.SpaceQuizBoard.mount({
                questions: quizData,
                topics: quizTopics,
                namePrefix: 'em-quiz',
                ids: {
                    total: 'emQuizTotalCount',
                    tabs: 'emQuizTopicTabs',
                    subRow: 'emQuizSubRow',
                    subChips: 'emQuizSubChips',
                    guide: 'emQuizGuide',
                    grid: 'emQuizGrid',
                    moreWrap: 'emQuizMoreWrap',
                    moreBtn: 'emQuizMoreBtn'
                }
            });
        })();
