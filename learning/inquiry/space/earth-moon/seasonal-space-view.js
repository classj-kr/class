// The seasonal diagram uses the same perspective camera and damped orbit controls
// as the Earth–Moon view. The simulation clock remains owned by app.js.
(function () {
    'use strict';

    window.createSeasonalSpaceView = function (canvas, seasons, onSelectSeason) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 2500);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x030712);
        const controls = new THREE.OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 26;
        // Panning would compete with the automatically tracked zoom pivot.
        controls.enablePan = false;
        const overviewTarget = new THREE.Vector3(0, -16, 0);
        const focusTarget = new THREE.Vector3();
        const focusShift = new THREE.Vector3();
        const observerWorld = new THREE.Vector3();
        const northAxis = new THREE.Vector3(Math.sin(23.44 * Math.PI / 180), Math.cos(23.44 * Math.PI / 180), 0);
        const earthPosition = new THREE.Vector3();
        const sunward = new THREE.Vector3();
        const localSunward = new THREE.Vector3();
        const orbitRadius = 135;
        let overviewDistance = 355;
        let width = 0;
        let height = 0;
        let initialized = false;

        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        scene.add(new THREE.PointLight(0xffffff, 1.5, 0, 0));
        const sun = new THREE.Mesh(new THREE.SphereGeometry(16, 40, 32), new THREE.MeshBasicMaterial({ color: 0xffd900 }));
        scene.add(sun);
        sun.add(new THREE.Mesh(new THREE.SphereGeometry(18.5, 32, 24), new THREE.MeshBasicMaterial({ color: 0xffdf44, transparent: true, opacity: 0.18, side: THREE.BackSide })));

        function orbitPosition(day, target) {
            const angle = (day - 356) / 365 * Math.PI * 2;
            return target.set(Math.cos(angle) * orbitRadius, 0, -Math.sin(angle) * orbitRadius);
        }
        const orbitPoints = [];
        for (let i = 0; i <= 180; i++) {
            const angle = i / 180 * Math.PI * 2;
            orbitPoints.push(new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius));
        }
        const orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitPoints), new THREE.LineDashedMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.45, dashSize: 2, gapSize: 2 }));
        orbit.computeLineDistances();
        scene.add(orbit);

        const earthSystem = new THREE.Group();
        scene.add(earthSystem);
        const tilt = new THREE.Group();
        tilt.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), northAxis);
        earthSystem.add(tilt);
        const inverseTilt = tilt.quaternion.clone().invert();
        const spin = new THREE.Group();
        tilt.add(spin);
        const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x159bd7, roughness: 0.8 });
        const earth = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 48), earthMaterial);
        spin.add(earth);
        const equator = new THREE.Mesh(new THREE.TorusGeometry(10.08, 0.07, 8, 128), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        equator.rotation.x = Math.PI / 2;
        tilt.add(equator);
        const axis = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -19, 0), new THREE.Vector3(0, 19, 0)]), new THREE.LineDashedMaterial({ color: 0x7dd3fc, dashSize: 1.2, gapSize: 0.7 }));
        axis.computeLineDistances();
        tilt.add(axis);

        const observer = new THREE.Group();
        spin.add(observer);
        const platform = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.12, 24), new THREE.MeshBasicMaterial({ color: 0xfde68a }));
        observer.add(platform);
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 1.1, 16), new THREE.MeshStandardMaterial({ color: 0x22d3ee }));
        body.position.y = 0.65;
        observer.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffb45c }));
        head.position.y = 1.45;
        observer.add(head);
        const normal = new THREE.Vector3();

        const rays = new THREE.Group();
        scene.add(rays);
        for (let y = -9; y <= 9; y += 3) {
            const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineDashedMaterial({ color: 0xfde047, dashSize: 0.65, gapSize: 0.5, transparent: true, opacity: 0.7 }));
            line.userData.offsetY = y;
            line.frustumCulled = false;
            rays.add(line);
        }

        // Screen-sized labels remain readable without growing over the globe on zoom.
        const overlay = document.createElement('div');
        overlay.className = 'em-season-space-overlay';
        canvas.parentElement.appendChild(overlay);
        const labels = seasons.map(season => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'em-season-space-label';
            button.style.color = season.color;
            button.textContent = `${season.icon} ${season.label} ${season.date}`;
            button.setAttribute('aria-label', `${season.label} ${season.date} 정오로 이동`);
            button.addEventListener('click', () => onSelectSeason(season));
            overlay.appendChild(button);
            return { button, position: orbitPosition(season.day, new THREE.Vector3()) };
        });
        const caption = document.createElement('div');
        caption.className = 'em-season-space-caption';
        canvas.parentElement.appendChild(caption);
        const reset = document.createElement('button');
        reset.type = 'button';
        reset.className = 'em-season-space-reset';
        reset.textContent = '시점 초기화';
        reset.addEventListener('click', resetView);
        canvas.parentElement.appendChild(reset);

        function resetView() {
            // Flush drag inertia before restoring the overview, including when
            // reset is pressed immediately after a fast swipe.
            controls.enableDamping = false;
            controls.update();
            controls.reset();
            controls.target.copy(overviewTarget);
            camera.position.copy(overviewTarget).add(new THREE.Vector3(0, 190, 300).normalize().multiplyScalar(overviewDistance));
            controls.update();
            controls.enableDamping = true;
        }

        const projected = new THREE.Vector3();
        const direction = new THREE.Vector3();
        const raycaster = new THREE.Raycaster();
        function updateLabels(distance) {
            labels.forEach(({ button, position }) => {
                projected.copy(position).project(camera);
                direction.subVectors(position, camera.position);
                const labelDistance = direction.length();
                raycaster.set(camera.position, direction.normalize());
                const hit = raycaster.intersectObjects([earth, sun], false)[0];
                const nearEarth = position.distanceTo(earthPosition) < 22;
                const visible = distance > 100 && projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < 0.87 && Math.abs(projected.y) < 0.9 && (!hit || hit.distance > labelDistance - 1 || (hit.object === earth && nearEarth));
                button.hidden = !visible;
                button.style.left = `${(projected.x + 1) * width / 2}px`;
                const labelY = (1 - projected.y) * height / 2 - (nearEarth ? 18 : 0);
                button.style.top = `${Math.max(width < 500 ? 94 : 45, labelY)}px`;
            });
        }

        function smoothstep(from, to, value) {
            const t = THREE.MathUtils.clamp((value - from) / (to - from), 0, 1);
            return t * t * (3 - 2 * t);
        }

        return {
            render(state) {
                const rect = canvas.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                if (rect.width !== width || rect.height !== height) {
                    width = rect.width;
                    height = rect.height;
                    renderer.setSize(width, height, false);
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                    overviewDistance = Math.max(355, 175 / (Math.tan(Math.PI / 9) * camera.aspect));
                    controls.maxDistance = Math.max(550, overviewDistance * 1.5);
                    if (!initialized) {
                        resetView();
                        initialized = true;
                    }
                }
                orbitPosition(state.day + (state.hour - 12) / 24, earthPosition);
                earthSystem.position.copy(earthPosition);
                sunward.copy(earthPosition).normalize().negate();
                localSunward.copy(sunward).applyQuaternion(inverseTilt);
                // Local noon points toward the Sun; a positive Y turn is eastward.
                spin.rotation.y = Math.atan2(-localSunward.z, localSunward.x) + (state.hour - 12) * Math.PI / 12;
                const latitude = state.latitude * Math.PI / 180;
                normal.set(Math.cos(latitude), Math.sin(latitude), 0);
                observer.position.copy(normal).multiplyScalar(10.1);
                observer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
                orbit.visible = state.showOrbit;
                rays.visible = state.showRays;
                rays.children.forEach(line => {
                    const y = line.userData.offsetY;
                    const start = Math.sqrt(16 * 16 - y * y);
                    const end = orbitRadius - Math.sqrt(10 * 10 - y * y);
                    const positions = line.geometry.attributes.position;
                    positions.setXYZ(0, -sunward.x * start, y, -sunward.z * start);
                    positions.setXYZ(1, -sunward.x * end, y, -sunward.z * end);
                    positions.needsUpdate = true;
                    line.computeLineDistances();
                });
                controls.update();
                const distance = camera.position.distanceTo(controls.target);
                scene.updateMatrixWorld(true);
                observer.getWorldPosition(observerWorld);
                focusTarget.copy(overviewTarget).lerp(earthPosition, smoothstep(overviewDistance, 130, distance));
                focusTarget.lerp(observerWorld, smoothstep(100, 40, distance));
                // Shift both together, preserving the user's angle and zoom distance.
                focusShift.subVectors(focusTarget, controls.target);
                controls.target.add(focusShift);
                camera.position.add(focusShift);
                camera.updateMatrixWorld(true);
                renderer.render(scene, camera);
                updateLabels(distance);
                caption.textContent = `${state.place} 관측자 · 드래그로 회전 · 스크롤·핀치로 확대`;
            }
        };
    };
})();
