(() => {
    "use strict";

    const { setBilingualButtonLabel, figure, contextImage, compactContextImage } = window.COMPUTER_LAB_HELPERS;
    const renderers = window.COMPUTER_LAB_RENDERERS;

    renderers.d02 = (spec, asset) => figure(spec, "visual-gesture-lab", `
        ${contextImage(asset, "d02-touch-gesture-signals-illustration-v1", "태블릿 화면에서 한 손가락과 두 손가락의 위치, 이동, 누른 시간이 신호로 측정되는 장면")}
        <section class="gesture-lab" data-gesture-lab data-gesture="tap">
            <div class="gesture-device">
                <div class="gesture-surface" data-gesture-surface role="button" tabindex="0" aria-label="선택한 터치 동작을 직접 해 보는 화면">
                    <div class="photo-card"><span></span><b>사진 1</b><em>선택됨</em></div>
                    <div class="photo-card photo-card-next"><span></span><b>사진 2</b></div>
                    <div class="gesture-context-menu" data-gesture-menu hidden><button type="button" data-gesture-menu-action="share">공유 <small>Share</small></button><button type="button" data-gesture-menu-action="rename">이름 바꾸기 <small>Rename</small></button><button type="button" data-gesture-menu-action="delete">삭제 <small>Delete</small></button><output data-gesture-action-result>명령을 선택하세요.</output></div>
                    <i class="finger finger-one"></i><i class="finger finger-two"></i><i class="gesture-trail"></i>
                    <div class="gesture-measure"><span>손가락 <b data-finger-count>1</b>개</span><span>누른 시간 <b data-press-time>0.1</b>초</span><span>이동 거리 <b data-move-distance>0</b></span></div>
                </div>
                <div class="home-indicator"></div>
            </div>
            <p class="gesture-prompt">동작 이름을 고른 뒤, 사진 화면에서 직접 탭·길게 누르기·스와이프·핀치를 해 보세요.</p>
            <div class="gesture-selector" role="group" aria-label="살펴볼 터치 동작">
                <button type="button" data-gesture-choice="tap" aria-pressed="true">탭 <small>Tap</small></button>
                <button type="button" data-gesture-choice="long">길게 누르기 <small>Long Press</small></button>
                <button type="button" data-gesture-choice="swipe">스와이프 <small>Swipe</small></button>
                <button type="button" data-gesture-choice="pinch">핀치 <small>Pinch</small></button>
            </div>
            <p class="lab-readout" data-gesture-status><b>탭</b>은 한 손가락으로 짧게 눌렀다 놓는 동작입니다. 앱은 위치와 누른 시간을 함께 봅니다.</p>
        </section>
    `);

    function setupGestureLab() {
        const lab = document.querySelector("[data-gesture-lab]");
        if (!lab) return;
        const status = lab.querySelector("[data-gesture-status]");
        const surface = lab.querySelector("[data-gesture-surface]");
        const fingerCount = lab.querySelector("[data-finger-count]");
        const pressTime = lab.querySelector("[data-press-time]");
        const moveDistance = lab.querySelector("[data-move-distance]");
        const photo = surface.querySelector(".photo-card:not(.photo-card-next)");
        const photoName = photo.querySelector("b");
        const menuResult = lab.querySelector("[data-gesture-action-result]");
        const copy = {
            tap: [1, "0.1", "0", "<b>탭</b>은 한 손가락으로 짧게 눌렀다 놓는 동작입니다. 앱은 위치와 누른 시간을 함께 봅니다."],
            long: [1, "0.8", "0", "<b>길게 누르기</b>는 같은 위치에서 누르는 시간을 늘린 동작입니다. 보조 메뉴가 열릴 수 있습니다."],
            swipe: [1, "0.3", "186px", "<b>스와이프</b>는 누른 채 한 방향으로 빠르게 움직이는 동작입니다. 목록이나 페이지를 넘길 수 있습니다."],
            pinch: [2, "0.5", "두 점 사이 92px", "<b>핀치</b>는 두 손가락 사이 거리를 바꾸는 동작입니다. 사진이나 지도를 확대·축소할 수 있습니다."]
        };
        const detectedNames = { tap: "탭으로", long: "길게 누르기로", swipe: "스와이프로", pinch: "핀치로" };
        const present = (gesture, metrics = copy[gesture], detected = false) => {
            lab.dataset.gesture = gesture;
            surface.dataset.gestureResult = detected ? gesture : "ready";
            lab.querySelector("[data-gesture-menu]").hidden = !(detected && gesture === "long");
            lab.querySelectorAll("[data-gesture-choice]").forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.gestureChoice === gesture)));
            fingerCount.textContent = metrics[0];
            pressTime.textContent = metrics[1];
            moveDistance.textContent = metrics[2];
            status.innerHTML = detected
                ? "<b>" + detectedNames[gesture] + " 감지했습니다.</b> " + copy[gesture][3].replace(/<\/?b>/g, "")
                : copy[gesture][3];
            if (detected) {
                surface.classList.remove("is-recognized");
                window.requestAnimationFrame(() => surface.classList.add("is-recognized"));
            }
        };
        lab.querySelectorAll("[data-gesture-choice]").forEach((button) => button.addEventListener("click", () => present(button.dataset.gestureChoice)));

        const points = new Map();
        let pinchStart = null;
        let pinchDelta = 0;
        let pinchStartedAt = 0;
        const distanceBetween = (items) => Math.hypot(items[0].x - items[1].x, items[0].y - items[1].y);
        surface.addEventListener("pointerdown", (event) => {
            if (event.target.closest("[data-gesture-menu]")) return;
            event.preventDefault();
            surface.setPointerCapture?.(event.pointerId);
            points.set(event.pointerId, { startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, startedAt: performance.now() });
            if (points.size === 2) {
                const current = Array.from(points.values());
                pinchStart = distanceBetween(current);
                pinchDelta = 0;
                pinchStartedAt = performance.now();
            }
        });
        surface.addEventListener("pointermove", (event) => {
            const point = points.get(event.pointerId);
            if (!point) return;
            point.x = event.clientX;
            point.y = event.clientY;
            if (points.size === 2 && pinchStart !== null) {
                pinchDelta = Math.max(pinchDelta, Math.abs(distanceBetween(Array.from(points.values())) - pinchStart));
            }
        });
        surface.addEventListener("pointerup", (event) => {
            const point = points.get(event.pointerId);
            if (!point) return;
            point.x = event.clientX;
            point.y = event.clientY;
            if (pinchStart !== null) {
                const elapsed = Math.max(0.1, (performance.now() - pinchStartedAt) / 1000);
                if (pinchDelta >= 24) {
                    present("pinch", [2, elapsed.toFixed(1), `두 점 사이 ${Math.round(pinchDelta)}px 변화`], true);
                } else {
                    status.innerHTML = "<b>두 손가락을 더 벌리거나 모아 보세요.</b> 두 점 사이 거리의 변화가 핀치 신호가 됩니다.";
                }
                points.clear();
                pinchStart = null;
                return;
            }
            const elapsedMs = performance.now() - point.startedAt;
            const distance = Math.hypot(point.x - point.startX, point.y - point.startY);
            points.delete(event.pointerId);
            const metrics = [1, (elapsedMs / 1000).toFixed(1), `${Math.round(distance)}px`];
            if (distance >= 80) {
                present("swipe", metrics, true);
            } else if (elapsedMs >= 600 && distance < 25) {
                present("long", metrics, true);
            } else if (elapsedMs < 500 && distance < 25) {
                present("tap", metrics, true);
            } else {
                status.innerHTML = "<b>동작을 한 번 더 해 보세요.</b> 짧게 누르기, 같은 자리에서 오래 누르기, 누른 채 80px 이상 이동하기를 구분합니다.";
            }
        });
        surface.addEventListener("pointercancel", () => {
            points.clear();
            pinchStart = null;
        });
        surface.addEventListener("keydown", (event) => {
            if (event.target !== surface) return;
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            present(lab.dataset.gesture || "tap", undefined, true);
        });
        lab.querySelectorAll("[data-gesture-menu-action]").forEach((button) => button.addEventListener("click", (event) => {
            event.stopPropagation();
            const action = button.dataset.gestureMenuAction;
            surface.dataset.menuAction = action;
            if (action === "share") {
                menuResult.textContent = "공유할 사람과 앱을 고르는 화면이 열렸습니다.";
                status.innerHTML = "<b>공유 명령을 실행했습니다.</b> 사진 자체가 바로 전송된 것이 아니라 다음 대상을 고르는 공유 화면이 열린 상태입니다.";
            } else if (action === "rename") {
                photoName.textContent = "과제 사진.webp";
                menuResult.textContent = "사진 1 → 과제 사진.webp";
                status.innerHTML = "<b>이름 바꾸기 명령을 실행했습니다.</b> 같은 사진의 표시 이름이 ‘과제 사진.webp’로 바뀌었습니다.";
            } else {
                photo.classList.add("is-deleted");
                photoName.textContent = "최근 삭제됨";
                menuResult.textContent = "사진이 최근 삭제 항목으로 이동했습니다.";
                status.innerHTML = "<b>삭제 명령을 실행했습니다.</b> 사진 카드가 최근 삭제 상태로 바뀌고 다음 사진이 앞으로 이동했습니다.";
            }
        }));
        present("tap");
    }

    window.COMPUTER_LAB_SETUPS.push(setupGestureLab);
    window.COMPUTER_PREMIUM_VISUAL_IDS.push("d02");
})();
