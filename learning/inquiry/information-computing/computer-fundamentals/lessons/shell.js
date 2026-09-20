(() => {
    "use strict";

    // 차시는 모두 이 자리에 있다. 한 단 위(../)는 차시 목록 화면이다.
    const asset = (name) => `../assets/images/${name}`;
    const courseHref = "../";
    const lessonHref = (id) => `?lesson=${id}`;

    const loadedLessons = [...(window.COMPUTER_DETAILED_LESSONS || []), ...(window.COMPUTER_FOUNDATION_LESSONS || [])];
    // 차례표는 36차시를 모두 담고, 지금 보는 차시만 내용이 채워진 객체로 바뀐다.
    const lessons = (window.COMPUTER_LESSON_INDEX || []).map((entry) => loadedLessons.find((item) => item.id === entry.id) || entry);


    (window.COMPUTER_REVIEWED_QUESTIONS || []).forEach(([lessonId, questionIndex, question]) => {
        const target = lessons.find((lesson) => lesson.id === lessonId);
        if (target?.questions?.[questionIndex]) {
            const concept = target.number <= 6
                ? target.questions[questionIndex].concept
                : question.concept;
            target.questions[questionIndex] = { ...question, concept };
        }
    });

    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get("lesson") || "a01";
    const requestedIndex = lessons.findIndex((item) => item.id === requestedId);
    const lessonIndex = requestedIndex >= 0 ? requestedIndex : 0;
    const lesson = lessons[lessonIndex];
    // 조작 단계를 가진 차시는 개념·조작·문제 세 걸음, 없는 차시는 개념·문제 두 걸음이다.
    const hasActivityStage = lesson.activity.type !== "none";
    const stages = {
        concept: document.getElementById("stageConcept"),
        activity: document.getElementById("stageActivity"),
        quiz: document.getElementById("stageQuiz"),
        result: document.getElementById("stageResult")
    };
    const stepStatus = document.getElementById("stepStatus");
    const activityMount = document.getElementById("activityMount");
    const activityFeedback = document.getElementById("activityFeedback");
    const checkActivity = document.getElementById("checkActivity");
    let activityPassed = false;
    let activityState = {};
    let selectedItem = null;
    let dragState = null;
    let suppressClickUntil = 0;

    function showStage(name, status) {
        Object.entries(stages).forEach(([key, element]) => {
            const active = key === name;
            element.hidden = !active;
            element.classList.toggle("is-active", active);
        });
        stepStatus.textContent = status;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function focusStageHeading(name) {
        const heading = name === "activity"
            ? document.getElementById("activityTitle")
            : name === "result"
                ? document.getElementById("resultTitle")
                : null;
        if (!heading) return;
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
    }

    function pointerConceptLabMarkup() {
        return `
            <section class="pointer-concept-lab" aria-labelledby="pointerLabTitle">
                <div class="pointer-lab-heading">
                    <div><span>입력 상태 관찰 <small>Input State Lab</small></span><h3 id="pointerLabTitle">포인터·커서·클릭·드래그를 직접 구분하세요</h3></div>
                    <p><b>1</b>가리키기　<b>2</b>입력 위치　<b>3</b>짧게 누르기　<b>4</b>누른 채 옮기기</p>
                </div>
                <ol class="pointer-lab-states" aria-label="현재 관찰 중인 입력 상태">
                    <li class="is-active" data-lab-state="pointer"><strong>포인터 <small>Pointer</small></strong><span>화면에서 가리키는 위치</span></li>
                    <li data-lab-state="caret"><strong>텍스트 커서 <small>Text Cursor</small></strong><span>다음 글자가 들어갈 위치</span></li>
                    <li data-lab-state="click"><strong>클릭 <small>Click</small></strong><span>같은 자리에서 눌렀다 놓기</span></li>
                    <li data-lab-state="drag"><strong>드래그 앤 드롭 <small>Drag and Drop</small></strong><span>누른 채 이동해 목표에서 놓기</span></li>
                </ol>
                <div class="pointer-lab-workspace" data-pointer-workspace>
                    <div class="demo-pointer" data-demo-pointer aria-hidden="true"><span></span></div>
                    <div class="pointer-lab-toolbar">
                        <button type="button" data-demo-button><strong>단추 눌러 보기</strong><small>Click · <span data-click-count>0회</span></small></button>
                        <button type="button" class="pointer-lab-reset" data-demo-reset>전체 초기화 <small>Reset All</small></button>
                    </div>
                    <label class="demo-text-field"><span>문장 안의 입력 위치 <small>Place the Text Cursor</small></span><input data-demo-text type="text" value="파일을 폴더로 옮깁니다." aria-label="텍스트 커서 위치를 확인할 문장"></label>
                    <button type="button" class="demo-file" data-demo-file aria-label="관찰 기록 파일"><span class="demo-file-icon">TXT</span><strong>관찰 기록.txt</strong><small>누른 채 폴더까지 이동</small></button>
                    <button type="button" class="demo-folder" data-demo-folder aria-label="수업 자료 폴더"><span class="demo-folder-icon" aria-hidden="true"></span><strong>수업 자료</strong><small data-folder-state>비어 있음</small></button>
                    <p class="pointer-lab-live" data-pointer-live aria-live="polite">포인터: 작업판 안에서 가리키는 위치가 바뀝니다.</p>
                </div>
                <section class="pointer-command-lab" data-pointer-command-lab data-command="double" aria-labelledby="pointerCommandTitle">
                    <header class="pointer-command-heading"><strong id="pointerCommandTitle">추가 조작 실험 <small>Double-click · Context Menu · Scroll</small></strong><span>각 조작 뒤 대상의 상태가 실제로 바뀝니다.</span></header>
                    <div class="pointer-command-buttons" role="group" aria-label="추가 포인터 조작 선택">
                        <button type="button" data-pointer-command="double" aria-pressed="true">더블클릭 <small>Double-click</small></button>
                        <button type="button" data-pointer-command="context" aria-pressed="false">우클릭·길게 누르기 <small>Context Menu</small></button>
                        <button type="button" data-pointer-command="scroll" aria-pressed="false">휠·두 손가락 이동 <small>Scroll</small></button>
                    </div>
                    <div class="pointer-command-stage">
                        <section class="command-demo-panel double-command-demo" data-command-panel="double">
                            <button type="button" class="command-folder-target" data-double-target aria-describedby="doubleClickStatus"><i aria-hidden="true"></i><strong>수업 사진</strong><small>짧은 간격으로 두 번 누르기</small></button>
                            <div class="opened-folder-window" data-double-window hidden><strong>폴더 열림 <small>Folder Opened</small></strong><span>곤충.jpg　우주.png</span></div>
                            <p id="doubleClickStatus" data-double-status>한 번 누르면 선택, 짧은 간격으로 두 번 누르면 폴더가 열립니다.</p>
                        </section>
                        <section class="command-demo-panel context-command-demo" data-command-panel="context" hidden>
                            <button type="button" class="context-file-target" data-context-target aria-haspopup="menu" aria-expanded="false"><span>TXT</span><strong data-context-file-name>관찰 기록.txt</strong><small>우클릭·길게 누르기·Shift+F10</small></button>
                            <div class="context-action-menu" data-context-menu role="menu" hidden><button type="button" role="menuitem" data-context-action="rename">이름 바꾸기 <small>Rename</small></button><button type="button" role="menuitem" data-context-action="delete">휴지통으로 이동 <small>Move to Trash</small></button></div>
                            <p data-context-status>일반 클릭은 선택만 합니다. 메뉴 조작을 하면 파일 이름이나 위치가 바뀝니다.</p>
                        </section>
                        <section class="command-demo-panel scroll-command-demo" data-command-panel="scroll" hidden>
                            <div class="mini-scroll-document" data-scroll-viewport tabindex="0" aria-label="휠, 두 손가락, 스와이프 또는 방향키로 스크롤할 짧은 문서"><h4>관찰 순서</h4><p>1. 잎의 모양을 본다.</p><p>2. 줄기의 색을 기록한다.</p><p>3. 빛이 오는 방향을 확인한다.</p><p>4. 사진을 한 장 찍는다.</p><p>5. 아래쪽 결론을 읽는다.</p><strong>결론: 보이는 위치만 바뀌고 문서 파일의 위치는 바뀌지 않습니다.</strong></div>
                            <div class="scroll-state-readout"><b data-scroll-position>위쪽 · 0%</b><span class="scroll-meter"><i data-scroll-meter></i></span><button type="button" data-scroll-step>아래로 이동 <small>Scroll Down</small></button></div>
                            <p>휠·트랙패드·손가락·방향키로 문서의 보이는 부분을 바꿔 보세요.</p>
                        </section>
                    </div>
                    <p class="pointer-command-status" data-pointer-command-status aria-live="polite">더블클릭: 수업 사진 폴더를 짧은 간격으로 두 번 눌러 여세요.</p>
                </section>
            </section>
        `;
    }

    function setupPointerConceptLab() {
        const lab = document.querySelector(".pointer-concept-lab");
        if (!lab) return;
        const workspace = lab.querySelector("[data-pointer-workspace]");
        const marker = lab.querySelector("[data-demo-pointer]");
        const textInput = lab.querySelector("[data-demo-text]");
        const clickButton = lab.querySelector("[data-demo-button]");
        const clickCount = lab.querySelector("[data-click-count]");
        const file = lab.querySelector("[data-demo-file]");
        const folder = lab.querySelector("[data-demo-folder]");
        const folderState = lab.querySelector("[data-folder-state]");
        const live = lab.querySelector("[data-pointer-live]");
        const resetButton = lab.querySelector("[data-demo-reset]");
        const commandLab = lab.querySelector("[data-pointer-command-lab]");
        const commandStatus = lab.querySelector("[data-pointer-command-status]");
        const commandButtons = Array.from(commandLab.querySelectorAll("[data-pointer-command]"));
        const doubleTarget = lab.querySelector("[data-double-target]");
        const doubleWindow = lab.querySelector("[data-double-window]");
        const doubleStatus = lab.querySelector("[data-double-status]");
        const contextTarget = lab.querySelector("[data-context-target]");
        const contextMenu = lab.querySelector("[data-context-menu]");
        const contextName = lab.querySelector("[data-context-file-name]");
        const contextStatus = lab.querySelector("[data-context-status]");
        const scrollViewport = lab.querySelector("[data-scroll-viewport]");
        const scrollPosition = lab.querySelector("[data-scroll-position]");
        const scrollMeter = lab.querySelector("[data-scroll-meter]");
        const scrollStep = lab.querySelector("[data-scroll-step]");
        let clicks = 0;
        let fileSelected = false;
        let drag = null;
        let lastFolderClick = 0;
        let doubleTimer = 0;
        let contextTimer = 0;
        let contextLongPressed = false;

        const commandInstructions = {
            double: "더블클릭: 한 번은 선택, 짧은 간격의 두 번째 누름은 폴더 열기입니다.",
            context: "우클릭·길게 누르기: 대상에 맞는 메뉴를 열고 메뉴 명령으로 파일 상태를 바꿉니다.",
            scroll: "스크롤: 문서 안에서 보이는 위치를 바꾸지만 파일이나 문서의 저장 위치는 바꾸지 않습니다."
        };
        const chooseCommand = (command) => {
            commandLab.dataset.command = command;
            commandButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.pointerCommand === command)));
            commandLab.querySelectorAll("[data-command-panel]").forEach((panel) => { panel.hidden = panel.dataset.commandPanel !== command; });
            commandStatus.textContent = commandInstructions[command];
        };
        commandButtons.forEach((button, index) => {
            button.addEventListener("click", () => chooseCommand(button.dataset.pointerCommand));
            button.addEventListener("keydown", (event) => {
                const moves = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
                if (!(event.key in moves)) return;
                event.preventDefault();
                const next = (index + moves[event.key] + commandButtons.length) % commandButtons.length;
                commandButtons[next].focus();
                commandButtons[next].click();
            });
        });

        const setState = (name, message) => {
            lab.querySelectorAll("[data-lab-state]").forEach((item) => item.classList.toggle("is-active", item.dataset.labState === name));
            live.textContent = message;
        };
        const moveMarker = (event) => {
            const bounds = workspace.getBoundingClientRect();
            const x = Math.max(10, Math.min(bounds.width - 18, event.clientX - bounds.left));
            const y = Math.max(10, Math.min(bounds.height - 18, event.clientY - bounds.top));
            marker.style.transform = `translate(${x}px, ${y}px)`;
            marker.classList.add("is-visible");
            if (!drag) setState("pointer", `포인터: 작업판의 (${Math.round(x)}, ${Math.round(y)}) 위치를 가리킵니다.`);
        };
        const resetFile = () => {
            file.classList.remove("is-held", "is-selected", "is-in-folder");
            file.style.removeProperty("transform");
            folder.classList.remove("is-target", "has-file");
            folderState.textContent = "비어 있음";
            fileSelected = false;
        };
        const placeFile = () => {
            file.classList.remove("is-held", "is-selected");
            file.classList.add("is-in-folder");
            file.style.removeProperty("transform");
            folder.classList.remove("is-target");
            folder.classList.add("has-file");
            folderState.textContent = "관찰 기록.txt 들어 있음";
            fileSelected = false;
            setState("drag", "드롭 완료: 폴더에서 놓아 파일의 실제 위치가 바뀌었습니다.");
        };

        workspace.addEventListener("pointermove", moveMarker);
        workspace.addEventListener("pointerdown", (event) => { if (event.target === workspace) moveMarker(event); });
        workspace.addEventListener("pointerleave", () => { if (!drag) marker.classList.remove("is-visible"); });
        textInput.addEventListener("focus", () => setState("caret", "텍스트 커서: 깜박이는 세로선 앞에 다음 글자가 입력됩니다."));
        const reportCaret = () => setState("caret", `텍스트 커서: 문장의 ${textInput.selectionStart + 1}번째 입력 위치입니다.`);
        textInput.addEventListener("click", reportCaret);
        textInput.addEventListener("keyup", reportCaret);
        clickButton.addEventListener("click", () => {
            clicks += 1;
            clickCount.textContent = `${clicks}회`;
            clickButton.classList.add("was-clicked");
            setTimeout(() => clickButton.classList.remove("was-clicked"), 180);
            setState("click", "클릭: 같은 자리에서 짧게 눌렀다 놓아 단추가 한 번 실행되었습니다.");
        });

        file.addEventListener("pointerdown", (event) => {
            if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
            event.preventDefault();
            if (file.classList.contains("is-in-folder")) resetFile();
            drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
            file.setPointerCapture?.(event.pointerId);
            file.classList.add("is-held");
            setState("drag", "누르고 유지: 누른 채 폴더까지 이동한 다음 놓으세요.");
        });
        file.addEventListener("pointermove", (event) => {
            if (!drag || drag.pointerId !== event.pointerId) return;
            event.preventDefault();
            const dx = event.clientX - drag.startX;
            const dy = event.clientY - drag.startY;
            if (Math.hypot(dx, dy) > 6) drag.moved = true;
            file.style.transform = `translate(${dx}px, ${dy}px)`;
            const target = folder.getBoundingClientRect();
            const overFolder = event.clientX >= target.left && event.clientX <= target.right && event.clientY >= target.top && event.clientY <= target.bottom;
            folder.classList.toggle("is-target", overFolder);
            if (drag.moved) setState("drag", overFolder ? "드래그: 폴더가 강조되었습니다. 여기에서 놓으세요." : "드래그: 누른 상태를 유지하며 이동 중입니다.");
        });
        const finishFilePointer = (event) => {
            if (!drag || drag.pointerId !== event.pointerId) return;
            const finished = drag;
            drag = null;
            try { file.releasePointerCapture?.(event.pointerId); } catch (_) { /* capture may already be released */ }
            const target = folder.getBoundingClientRect();
            const overFolder = event.type !== "pointercancel" && event.clientX >= target.left && event.clientX <= target.right && event.clientY >= target.top && event.clientY <= target.bottom;
            if (finished.moved && overFolder) { placeFile(); return; }
            file.style.removeProperty("transform");
            file.classList.remove("is-held");
            folder.classList.remove("is-target");
            if (!finished.moved) {
                fileSelected = true;
                file.classList.add("is-selected");
                setState("click", "클릭: 파일이 선택되었지만 위치는 아직 바뀌지 않았습니다.");
            } else setState("drag", "드래그 취소: 폴더 밖에서 놓아 파일이 원래 자리로 돌아왔습니다.");
        };
        file.addEventListener("pointerup", finishFilePointer);
        file.addEventListener("pointercancel", finishFilePointer);
        file.addEventListener("click", (event) => {
            if (event.detail !== 0) return;
            fileSelected = true;
            file.classList.add("is-selected");
            setState("click", "키보드 실행: 파일을 선택했습니다. Tab으로 폴더에 이동해 Enter를 누르세요.");
        });
        folder.addEventListener("click", () => { if (fileSelected) placeFile(); });

        const resetDouble = () => {
            clearTimeout(doubleTimer);
            lastFolderClick = 0;
            doubleTarget.classList.remove("is-selected", "is-open");
            doubleWindow.hidden = true;
            doubleStatus.textContent = "한 번 누르면 선택, 짧은 간격으로 두 번 누르면 폴더가 열립니다.";
        };
        doubleTarget.addEventListener("click", () => {
            const now = performance.now();
            if (lastFolderClick && now - lastFolderClick <= 650) {
                clearTimeout(doubleTimer);
                lastFolderClick = 0;
                doubleTarget.classList.remove("is-selected");
                doubleTarget.classList.add("is-open");
                doubleWindow.hidden = false;
                doubleStatus.textContent = "두 번째 누름이 650ms 안에 들어와 수업 사진 폴더가 열렸습니다.";
                commandStatus.textContent = "더블클릭 성공: 같은 대상의 첫 누름은 선택, 빠른 두 번째 누름은 열기 명령이 되었습니다.";
                return;
            }
            lastFolderClick = now;
            doubleTarget.classList.add("is-selected");
            doubleWindow.hidden = true;
            doubleStatus.textContent = "1 / 2　폴더가 선택되었습니다. 650ms 안에 같은 곳을 한 번 더 누르세요.";
            clearTimeout(doubleTimer);
            doubleTimer = setTimeout(() => {
                lastFolderClick = 0;
                doubleStatus.textContent = "간격이 길어 한 번 클릭으로 끝났습니다. 폴더는 선택 상태이고 열리지는 않았습니다.";
            }, 670);
        });

        const closeContextMenu = () => {
            contextMenu.hidden = true;
            contextTarget.setAttribute("aria-expanded", "false");
        };
        const openContextMenu = (method) => {
            contextMenu.hidden = false;
            contextTarget.setAttribute("aria-expanded", "true");
            contextTarget.classList.add("is-selected");
            contextStatus.textContent = `${method}로 파일에 맞는 메뉴가 열렸습니다. 메뉴 명령을 실행해 보세요.`;
            commandStatus.textContent = `컨텍스트 메뉴 열림: ${method}는 현재 선택한 파일에 사용할 수 있는 명령을 보여 줍니다.`;
            requestAnimationFrame(() => contextMenu.querySelector("button")?.focus());
        };
        contextTarget.addEventListener("contextmenu", (event) => { event.preventDefault(); openContextMenu("우클릭"); });
        contextTarget.addEventListener("keydown", (event) => {
            if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
                event.preventDefault();
                openContextMenu("키보드 Shift+F10");
            }
        });
        contextTarget.addEventListener("pointerdown", (event) => {
            if (event.pointerType === "mouse") return;
            contextLongPressed = false;
            clearTimeout(contextTimer);
            contextTimer = setTimeout(() => { contextLongPressed = true; openContextMenu("길게 누르기"); }, 650);
        });
        ["pointerup", "pointercancel", "pointerleave"].forEach((name) => contextTarget.addEventListener(name, () => clearTimeout(contextTimer)));
        contextTarget.addEventListener("click", () => {
            if (contextLongPressed) { contextLongPressed = false; return; }
            contextTarget.classList.add("is-selected");
            contextStatus.textContent = "일반 클릭은 파일을 선택했지만 메뉴는 열지 않았습니다.";
        });
        contextMenu.querySelectorAll("[data-context-action]").forEach((button) => button.addEventListener("click", () => {
            if (button.dataset.contextAction === "rename") {
                contextName.textContent = "관찰 기록(이름 바꿈).txt";
                contextTarget.classList.remove("is-deleted");
                contextStatus.textContent = "이름 바꾸기 실행: 같은 파일의 이름이 바뀌었습니다.";
            } else {
                contextTarget.classList.add("is-deleted");
                contextStatus.textContent = "휴지통으로 이동 실행: 파일의 위치가 휴지통으로 바뀌었습니다.";
            }
            commandStatus.textContent = contextStatus.textContent;
            closeContextMenu();
            contextTarget.focus();
        }));

        const updateScroll = () => {
            const max = Math.max(1, scrollViewport.scrollHeight - scrollViewport.clientHeight);
            const percent = Math.max(0, Math.min(100, Math.round(scrollViewport.scrollTop / max * 100)));
            const place = percent <= 5 ? "위쪽" : percent >= 95 ? "아래쪽" : "중간";
            scrollPosition.textContent = `${place} · ${percent}%`;
            scrollMeter.style.width = `${percent}%`;
            scrollStep.innerHTML = percent >= 95 ? "맨 위로 <small>Back to Top</small>" : "아래로 이동 <small>Scroll Down</small>";
            commandStatus.textContent = `스크롤 위치 ${percent}%: 문서 안에서 보이는 부분만 바뀌고 파일의 저장 위치는 그대로입니다.`;
        };
        scrollViewport.addEventListener("scroll", updateScroll, { passive: true });
        scrollStep.addEventListener("click", () => {
            const max = scrollViewport.scrollHeight - scrollViewport.clientHeight;
            scrollViewport.scrollTo({ top: scrollViewport.scrollTop >= max - 2 ? 0 : Math.min(max, scrollViewport.scrollTop + 88), behavior: "smooth" });
        });

        resetButton.addEventListener("click", () => {
            clicks = 0;
            clickCount.textContent = "0회";
            resetFile();
            resetDouble();
            clearTimeout(contextTimer);
            closeContextMenu();
            contextTarget.classList.remove("is-selected", "is-deleted");
            contextName.textContent = "관찰 기록.txt";
            contextStatus.textContent = "일반 클릭은 선택만 합니다. 메뉴 조작을 하면 파일 이름이나 위치가 바뀝니다.";
            scrollViewport.scrollTop = 0;
            updateScroll();
            chooseCommand("double");
            setState("pointer", "포인터: 작업판 안에서 가리키는 위치가 바뀝니다.");
        });
        updateScroll();
        chooseCommand("double");
    }

    function setupA01SignalLab() {
        const lab = document.querySelector("[data-a01-lab]");
        if (!lab) return;
        const inputs = {
            camera: {
                input: ["카메라", "Camera"],
                inputData: "센서가 빛의 밝기와 색을 측정",
                process: ["사진 데이터 만들기", "Build Image Data"],
                processData: "빛 값을 픽셀로 배열하고 색을 보정",
                output: ["화면 미리보기", "Live Preview"],
                outputData: "디스플레이 픽셀이 장면을 바로 보여 줌",
                storage: "photo.jpg",
                storageData: "저장 장치에 사진 파일 기록",
                outputProof: "화면에 카메라 장면이 보임"
            },
            keyboard: {
                input: ["키보드", "Keyboard"],
                inputData: "눌린 키의 코드와 누름 상태를 보냄",
                process: ["문자와 위치 계산", "Resolve Key & Position"],
                processData: "키 코드를 문자로 바꾸고 커서 위치를 확인",
                output: ["문서에 A 표시", "Show A in Document"],
                outputData: "글자 모양을 화면 픽셀로 보여 줌",
                storage: "notes.txt",
                storageData: "문서 내용을 텍스트 파일로 기록",
                outputProof: "문서 화면에 A가 나타남"
            },
            microphone: {
                input: ["마이크", "Microphone"],
                inputData: "공기 진동을 시간마다 전기 신호로 측정",
                process: ["소리 데이터 만들기", "Build Audio Data"],
                processData: "측정값을 샘플로 배열하고 음량을 계산",
                output: ["화면에 파형 표시", "Show Waveform"],
                outputData: "소리의 높낮이를 파형으로 보여 줌",
                storage: "recording.webm",
                storageData: "소리 샘플을 녹음 파일로 기록",
                outputProof: "화면에 소리 파형이 움직임"
            }
        };
        const inputButtons = Array.from(lab.querySelectorAll("[data-a01-input]"));
        const routeButtons = Array.from(lab.querySelectorAll("[data-a01-route]"));
        const nodes = Array.from(lab.querySelectorAll("[data-a01-node]"));
        const fields = {
            inputTitle: lab.querySelector("[data-a01-input-title]"),
            inputData: lab.querySelector("[data-a01-input-data]"),
            processTitle: lab.querySelector("[data-a01-process-title]"),
            processData: lab.querySelector("[data-a01-process-data]"),
            outputTitle: lab.querySelector("[data-a01-output-title]"),
            outputData: lab.querySelector("[data-a01-output-data]"),
            storageTitle: lab.querySelector("[data-a01-storage-title]"),
            storageData: lab.querySelector("[data-a01-storage-data]"),
            outputState: lab.querySelector("[data-a01-output-state]"),
            storageState: lab.querySelector("[data-a01-storage-state]"),
            outputProof: lab.querySelector("[data-a01-output-proof]"),
            storageProof: lab.querySelector("[data-a01-storage-proof]"),
            status: lab.querySelector("[data-a01-status]")
        };
        const label = (pair) => `${pair[0]} <small>${pair[1]}</small>`;
        let selectedInput = "camera";
        let selectedRoute = "preview";

        const setPressed = (buttons, key, value) => {
            buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset[key] === value)));
        };
        const showSelection = () => {
            const item = inputs[selectedInput];
            lab.dataset.input = selectedInput;
            lab.dataset.route = selectedRoute;
            lab.dataset.runState = "idle";
            nodes.forEach((node) => node.classList.remove("is-active", "is-skipped"));
            fields.inputTitle.innerHTML = label(item.input);
            fields.inputData.textContent = item.inputData;
            fields.processTitle.innerHTML = label(item.process);
            fields.processData.textContent = item.processData;
            fields.outputTitle.innerHTML = label(item.output);
            fields.outputData.textContent = item.outputData;
            fields.storageTitle.textContent = item.storage;
            fields.storageData.textContent = item.storageData;
            fields.outputState.textContent = "실행 대기 · Ready";
            fields.storageState.textContent = selectedRoute === "save" ? "실행하면 파일 기록" : "이번 경로에서 제외";
            fields.outputProof.textContent = "대기 중";
            fields.storageProof.textContent = selectedRoute === "save" ? "저장 예정" : "저장하지 않음";
            fields.status.textContent = "신호 보내기를 누르면 입력과 처리를 거쳐 선택한 두 갈래의 상태가 바뀝니다.";
        };

        inputButtons.forEach((button) => button.addEventListener("click", () => {
            selectedInput = button.dataset.a01Input;
            setPressed(inputButtons, "a01Input", selectedInput);
            showSelection();
        }));
        routeButtons.forEach((button) => button.addEventListener("click", () => {
            selectedRoute = button.dataset.a01Route;
            setPressed(routeButtons, "a01Route", selectedRoute);
            showSelection();
        }));
        lab.querySelector("[data-a01-run]").addEventListener("click", () => {
            const item = inputs[selectedInput];
            lab.dataset.runState = "complete";
            nodes.forEach((node) => {
                const isStorage = node.dataset.a01Node === "storage";
                node.classList.toggle("is-active", !isStorage || selectedRoute === "save");
                node.classList.toggle("is-skipped", isStorage && selectedRoute !== "save");
            });
            fields.outputState.textContent = "출력 완료 · Displayed";
            fields.outputProof.textContent = item.outputProof;
            if (selectedRoute === "save") {
                fields.storageState.textContent = "파일 기록 완료 · Saved";
                fields.storageProof.textContent = `${item.storage} 파일이 저장 장치에 남음`;
                fields.status.textContent = "처리한 데이터가 복사되어 한 길은 출력으로, 다른 길은 저장으로 갔습니다. 화면 결과와 파일 기록이 모두 확인됩니다.";
            } else {
                fields.storageState.textContent = "건너뜀 · Not Saved";
                fields.storageProof.textContent = "파일 없음 — 전원을 끄면 다시 열 수 없음";
                fields.status.textContent = "출력은 되었지만 저장 경로를 사용하지 않았습니다. 화면에 보였다는 사실만으로 파일이 생긴 것은 아닙니다.";
            }
        });
        lab.querySelector("[data-a01-reset]").addEventListener("click", () => {
            selectedInput = "camera";
            selectedRoute = "preview";
            setPressed(inputButtons, "a01Input", selectedInput);
            setPressed(routeButtons, "a01Route", selectedRoute);
            showSelection();
        });
        showSelection();
    }

    function setupA02CooperationLab() {
        const lab = document.querySelector("[data-a02-lab]");
        if (!lab) return;
        const tasks = {
            display: {
                software: "그림 앱",
                command: "“파란 원을 그려 주세요.”",
                bridge: "디스플레이가 알아들을 신호로 전달합니다.",
                hardware: "디스플레이",
                capability: "픽셀을 빛내 화면을 보여 줍니다.",
                success: "그림 앱의 명령을 받아 디스플레이에 파란 원이 나타났습니다."
            },
            speaker: {
                software: "음악 앱",
                command: "“‘도’ 음을 재생해 주세요.”",
                bridge: "스피커가 알아들을 오디오 신호로 전달합니다.",
                hardware: "스피커",
                capability: "전기 신호를 공기 진동으로 바꿉니다.",
                success: "음악 앱의 명령을 받아 스피커에서 ‘도’ 음이 납니다."
            },
            printer: {
                software: "문서 앱",
                command: "“이 문서를 종이에 인쇄해 주세요.”",
                bridge: "프린터가 알아들을 인쇄 신호로 전달합니다.",
                hardware: "프린터",
                capability: "잉크나 토너를 종이에 옮깁니다.",
                success: "문서 앱의 명령을 받아 프린터에서 문서 한 장이 나옵니다."
            }
        };
        const taskButtons = Array.from(lab.querySelectorAll("[data-a02-task]"));
        const presenceButtons = Array.from(lab.querySelectorAll("[data-a02-presence]"));
        let selectedTask = "display";
        let hardwareConnected = true;
        let softwareLoaded = true;

        const markPressed = (buttons, key, value) => buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset[key] === value)));
        const markPending = () => {
            const task = tasks[selectedTask];
            lab.dataset.task = selectedTask;
            lab.dataset.result = "idle";
            lab.querySelector("[data-a02-output]").dataset.a02Output = selectedTask;
            lab.querySelector("[data-a02-software-title]").textContent = task.software;
            lab.querySelector("[data-a02-command-copy]").textContent = task.command;
            lab.querySelector("[data-a02-bridge-copy]").textContent = task.bridge;
            lab.querySelector("[data-a02-hardware-title]").textContent = task.hardware;
            lab.querySelector("[data-a02-capability]").textContent = task.capability;
            lab.querySelector("[data-a02-hardware-presence]").textContent = hardwareConnected ? `${task.hardware} 연결됨 · Connected` : `${task.hardware} 연결 끊김 · Disconnected`;
            lab.querySelector("[data-a02-software-presence]").textContent = softwareLoaded ? `${task.software} 실행 중 · On` : `${task.software} 꺼짐 · Off`;
            presenceButtons.forEach((button) => {
                const on = button.dataset.a02Presence === "hardware" ? hardwareConnected : softwareLoaded;
                button.setAttribute("aria-pressed", String(on));
            });
            lab.querySelector("[data-a02-evidence-hardware]").textContent = hardwareConnected ? `${task.hardware}가 연결되어 있습니다.` : `${task.hardware}가 연결되어 있지 않습니다.`;
            lab.querySelector("[data-a02-evidence-software]").textContent = softwareLoaded ? "선택한 프로그램이 명령을 준비했습니다." : "선택한 프로그램이 꺼져 있습니다.";
            lab.querySelector("[data-a02-evidence-result]").textContent = "아직 실행하지 않았습니다.";
            lab.querySelector("[data-a02-result-title]").textContent = "실행 전";
            lab.querySelector("[data-a02-result-copy]").textContent = softwareLoaded && hardwareConnected ? "프로그램과 장치가 모두 준비되어 있습니다." : "꺼진 프로그램이나 연결되지 않은 장치가 있습니다.";
            lab.querySelectorAll("[data-a02-stage]").forEach((stage) => stage.classList.remove("is-active", "is-blocked"));
        };

        taskButtons.forEach((button) => button.addEventListener("click", () => {
            selectedTask = button.dataset.a02Task;
            markPressed(taskButtons, "a02Task", selectedTask);
            markPending();
        }));
        presenceButtons.forEach((button) => button.addEventListener("click", () => {
            if (button.dataset.a02Presence === "hardware") hardwareConnected = !hardwareConnected;
            else softwareLoaded = !softwareLoaded;
            markPending();
        }));
        lab.querySelector("[data-a02-run]").addEventListener("click", () => {
            const task = tasks[selectedTask];
            const stages = {
                software: lab.querySelector('[data-a02-stage="software"]'),
                bridge: lab.querySelector('[data-a02-stage="bridge"]'),
                hardware: lab.querySelector('[data-a02-stage="hardware"]')
            };
            stages.software.classList.toggle("is-active", softwareLoaded);
            stages.software.classList.toggle("is-blocked", !softwareLoaded);
            stages.bridge.classList.toggle("is-active", softwareLoaded && hardwareConnected);
            stages.bridge.classList.toggle("is-blocked", !softwareLoaded || !hardwareConnected);
            stages.hardware.classList.toggle("is-active", hardwareConnected);
            stages.hardware.classList.toggle("is-blocked", !hardwareConnected);
            let result;
            let title;
            let explanation;
            if (!softwareLoaded && !hardwareConnected) {
                result = "missing-both";
                title = "둘 다 준비되지 않았습니다";
                explanation = `${task.software}도 꺼져 있고 ${task.hardware}도 연결되어 있지 않아 결과를 만들 수 없습니다.`;
            } else if (!softwareLoaded) {
                result = "missing-software";
                title = "프로그램이 꺼져 있습니다";
                explanation = `${task.hardware}가 연결되어 있어도 ${task.software}의 명령이 없으면 무엇을 할지 알 수 없습니다.`;
            } else if (!hardwareConnected) {
                result = "missing-hardware";
                title = "장치가 연결되어 있지 않습니다";
                explanation = `${task.software}의 명령은 준비됐지만 ${task.hardware}가 없어 실제 결과로 바꿀 수 없습니다.`;
            } else {
                result = "success";
                title = "함께 작동했습니다";
                explanation = task.success;
            }
            lab.dataset.result = result;
            lab.querySelector("[data-a02-result-title]").textContent = title;
            lab.querySelector("[data-a02-result-copy]").textContent = explanation;
            lab.querySelector("[data-a02-evidence-result]").textContent = explanation;
        });
        lab.querySelector("[data-a02-reset]").addEventListener("click", () => {
            selectedTask = "display";
            hardwareConnected = true;
            softwareLoaded = true;
            markPressed(taskButtons, "a02Task", selectedTask);
            markPending();
        });
        markPending();
    }

    function setupA03CompatibilityLab() {
        const lab = document.querySelector("[data-a03-lab]");
        if (!lab) return;
        const devices = {
            pc: { name: "PC", english: "Personal Computer", hardware: "키보드·마우스·화면 등을 갖춘 컴퓨터", osSupport: { windows: "이 모형의 PC에서 Windows 지원", chromeos: "이 모형의 PC에서 ChromeOS 계열 지원" } },
            chromebook: { name: "Chromebook", english: "Chromebook", hardware: "키보드와 화면을 갖춘 Chromebook", osSupport: { chromeos: "이 기기의 ChromeOS 지원" } },
            ipad: { name: "iPad", english: "Tablet", hardware: "터치 화면을 갖춘 iPad", osSupport: { ipados: "이 기기의 iPadOS 지원" } },
            phone: { name: "Phone (Android형)", english: "Android Phone", hardware: "터치 화면과 카메라를 갖춘 스마트폰", osSupport: { android: "이 기기의 Android 지원" } }
        };
        const systems = {
            windows: { name: "Windows", job: "PC의 장치를 관리하고 Windows용 앱이 실행되도록 돕습니다." },
            chromeos: { name: "ChromeOS", job: "기기의 장치를 관리하고 ChromeOS용 앱이 실행되도록 돕습니다." },
            ipados: { name: "iPadOS", job: "iPad를 관리하고 iPadOS용 앱이 실행되도록 돕습니다." },
            android: { name: "Android", job: "스마트폰을 관리하고 Android용 앱이 실행되도록 돕습니다." }
        };
        const apps = {
            paint: { name: "PC 그림판", english: "Windows Drawing App", os: "windows", osName: "Windows", package: "Windows에서 사용하는 그림 앱", result: "그림판 창이 열리고 선을 그릴 수 있습니다." },
            "chrome-files": { name: "Chromebook 파일 앱", english: "ChromeOS Files App", os: "chromeos", osName: "ChromeOS", package: "ChromeOS에서 사용하는 파일 관리 앱", result: "파일 앱이 열리고 Chromebook의 파일을 보여 줍니다." },
            "ipad-sketch": { name: "iPad 스케치", english: "iPadOS Sketch App", os: "ipados", osName: "iPadOS", package: "iPadOS에서 사용하는 스케치 앱", result: "스케치 앱이 열리고 Apple Pencil·터치 입력을 받습니다." },
            "android-camera": { name: "Android 카메라", english: "Android Camera App", os: "android", osName: "Android", package: "Android에서 사용하는 카메라 앱", result: "카메라 앱이 열리고 스마트폰 센서 미리보기를 보여 줍니다." }
        };
        const deviceButtons = Array.from(lab.querySelectorAll("[data-a03-device]"));
        const osButtons = Array.from(lab.querySelectorAll("[data-a03-os]"));
        const appButtons = Array.from(lab.querySelectorAll("[data-a03-app]"));
        let selectedDevice = "pc";
        let selectedOs = "windows";
        let selectedApp = "paint";
        const setPressed = (buttons, key, value) => buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset[key] === value)));
        const clearProof = () => {
            lab.dataset.outcome = "pending";
            lab.querySelectorAll("[data-a03-layer], [data-a03-proof]").forEach((item) => item.classList.remove("is-pass", "is-fail", "is-blocked"));
            lab.querySelector("[data-a03-preview-title]").textContent = "실행 확인 전";
            lab.querySelector("[data-a03-preview-copy]").textContent = "세 층을 고른 뒤 호환성을 확인하세요.";
            lab.querySelector("[data-a03-boot-proof]").textContent = "확인 전";
            lab.querySelector("[data-a03-api-proof]").textContent = "확인 전";
            lab.querySelector("[data-a03-run-proof]").textContent = "확인 전";
        };
        const showSelection = () => {
            const device = devices[selectedDevice];
            const os = systems[selectedOs];
            const app = apps[selectedApp];
            lab.dataset.device = selectedDevice;
            lab.dataset.os = selectedOs;
            lab.dataset.app = selectedApp;
            lab.querySelector("[data-a03-current-device]").innerHTML = `${device.name} <small>${device.english}</small>`;
            lab.querySelector("[data-a03-device-hardware]").textContent = device.hardware;
            lab.querySelector("[data-a03-current-os]").textContent = os.name;
            lab.querySelector("[data-a03-os-job]").textContent = os.job;
            lab.querySelector("[data-a03-current-app]").innerHTML = `${app.name} <small>${app.english}</small>`;
            lab.querySelector("[data-a03-app-package]").textContent = app.package;
            clearProof();
        };
        const choose = (buttons, key, setValue) => buttons.forEach((button) => button.addEventListener("click", () => {
            setValue(button.dataset[key]);
            setPressed(buttons, key, button.dataset[key]);
            showSelection();
        }));
        choose(deviceButtons, "a03Device", (value) => { selectedDevice = value; });
        choose(osButtons, "a03Os", (value) => { selectedOs = value; });
        choose(appButtons, "a03App", (value) => { selectedApp = value; });

        lab.querySelector("[data-a03-run]").addEventListener("click", () => {
            const device = devices[selectedDevice];
            const os = systems[selectedOs];
            const app = apps[selectedApp];
            const deviceLayer = lab.querySelector('[data-a03-layer="device"]');
            const osLayer = lab.querySelector('[data-a03-layer="os"]');
            const appLayer = lab.querySelector('[data-a03-layer="app"]');
            const bootProof = lab.querySelector('[data-a03-proof="boot"]');
            const apiProof = lab.querySelector('[data-a03-proof="api"]');
            const runProof = lab.querySelector('[data-a03-proof="run"]');
            deviceLayer.classList.add("is-pass");
            const bootSupport = device.osSupport[selectedOs];
            if (!bootSupport) {
                lab.dataset.outcome = "os-fail";
                osLayer.classList.add("is-fail");
                appLayer.classList.add("is-blocked");
                bootProof.classList.add("is-fail");
                apiProof.classList.add("is-blocked");
                runProof.classList.add("is-blocked");
                lab.querySelector("[data-a03-preview-title]").textContent = "운영체제에서 멈춤";
                lab.querySelector("[data-a03-preview-copy]").textContent = `이 실습에 정해진 기기 조건에서는 ${os.name}을 지원하지 않습니다. 지원하는 조합으로 바꾸어 보세요.`;
                lab.querySelector("[data-a03-boot-proof]").textContent = `이 모형의 ${device.name}은 ${os.name}을 지원하지 않습니다.`;
                lab.querySelector("[data-a03-api-proof]").textContent = "운영체제가 시작되지 않아 앱 실행도 확인할 수 없음";
                lab.querySelector("[data-a03-run-proof]").textContent = "앱 실행 안 됨";
                return;
            }
            osLayer.classList.add("is-pass");
            bootProof.classList.add("is-pass");
            lab.querySelector("[data-a03-boot-proof]").textContent = `${bootSupport}: ${os.name} 시작 가능`;
            if (app.os !== selectedOs) {
                lab.dataset.outcome = "app-fail";
                appLayer.classList.add("is-fail");
                apiProof.classList.add("is-fail");
                runProof.classList.add("is-blocked");
                lab.querySelector("[data-a03-preview-title]").textContent = "앱에서 멈춤";
                lab.querySelector("[data-a03-preview-copy]").textContent = `${app.name}은 ${app.osName}용이므로 현재 ${os.name}의 앱 규칙과 맞지 않습니다.`;
                lab.querySelector("[data-a03-api-proof]").textContent = `${app.package} — 지금 고른 운영체제에서 지원하지 않는 앱`;
                lab.querySelector("[data-a03-run-proof]").textContent = "운영체제는 켜졌지만 앱 실행 안 됨";
                return;
            }
            lab.dataset.outcome = "success";
            appLayer.classList.add("is-pass");
            apiProof.classList.add("is-pass");
            runProof.classList.add("is-pass");
            lab.querySelector("[data-a03-preview-title]").textContent = "앱 실행 성공";
            lab.querySelector("[data-a03-preview-copy]").textContent = app.result;
            lab.querySelector("[data-a03-api-proof]").textContent = `${app.osName}에서 지원하는 앱`;
            lab.querySelector("[data-a03-run-proof]").textContent = app.result;
        });
        lab.querySelector("[data-a03-reset]").addEventListener("click", () => {
            selectedDevice = "pc";
            selectedOs = "windows";
            selectedApp = "paint";
            setPressed(deviceButtons, "a03Device", selectedDevice);
            setPressed(osButtons, "a03Os", selectedOs);
            setPressed(appButtons, "a03App", selectedApp);
            showSelection();
        });
        showSelection();
    }


    function setupConceptSequences() {
        document.querySelectorAll("[data-concept-sequence]").forEach((sequence) => {
            const steps = Array.from(sequence.querySelectorAll("[data-sequence-step]"));
            const status = sequence.querySelector("[data-sequence-status]");
            const nextButton = sequence.querySelector("[data-sequence-next]");
            if (!steps.length || !status || !nextButton) return;
            let activeIndex = 0;

            const activate = (index) => {
                activeIndex = index;
                steps.forEach((step, stepIndex) => {
                    const selected = stepIndex === activeIndex;
                    step.classList.toggle("is-active", selected);
                    step.setAttribute("aria-pressed", String(selected));
                });
                const title = steps[activeIndex].querySelector("strong")?.childNodes[0]?.textContent?.trim() || "";
                const detail = steps[activeIndex].querySelector("p")?.textContent?.trim() || "";
                status.textContent = `${activeIndex + 1} / ${steps.length}　${title}${detail ? ` — ${detail}` : ""}`;
                nextButton.innerHTML = activeIndex === steps.length - 1
                    ? "처음부터 <small>Restart</small>"
                    : "다음 단계 <small>Next Step</small>";
            };

            steps.forEach((step, index) => {
                step.addEventListener("click", () => activate(index));
                step.addEventListener("keydown", (event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    activate(index);
                });
            });
            nextButton.addEventListener("click", () => activate((activeIndex + 1) % steps.length));
            activate(0);
        });
    }

    function setupFullStackLab() {
        const lab = document.querySelector("[data-stack-lab]");
        if (!lab) return;
        const startButton = lab.querySelector("[data-stack-start]");
        const nextButton = lab.querySelector("[data-stack-next]");
        const status = lab.querySelector("[data-stack-status]");
        const nodes = Array.from(lab.querySelectorAll("[data-stack-node]"));
        if (!startButton || !nextButton || !status || !nodes.length) return;
        const answerButtons = Array.from(lab.querySelectorAll("[data-stack-answer]"));
        const requestValue = lab.querySelector("[data-stack-request]");
        const responseValue = lab.querySelector("[data-stack-response]");
        const comparison = lab.querySelector("[data-stack-comparison]");
        const verdict = lab.querySelector("[data-stack-verdict]");
        const dbScore = lab.querySelector("[data-stack-db-score]");
        const screenScore = lab.querySelector("[data-stack-screen-score]");
        const selectedEvidence = lab.querySelector("[data-stack-selected]");
        const resultEvidence = lab.querySelector("[data-stack-result]");
        const storedEvidence = lab.querySelector("[data-stack-stored]");
        const displayedEvidence = lab.querySelector("[data-stack-displayed]");
        const messages = [
            "먼저 문제 화면에서 답 하나를 고르세요. 답은 아직 학생 기기 안에만 있습니다.",
            "1 / 6　문제 화면이 고른 답을 읽었습니다. 사용자가 보고 조작하는 이 화면 부분이 프론트엔드입니다.",
            "2 / 6　프론트엔드가 { answer }라는 약속된 이름으로 답을 요청 봉투에 담아 서버로 보냈습니다. 이 주소·방법·데이터 모양의 약속이 API입니다.",
            "3 / 6　서버의 백엔드가 데이터베이스에서 정답 3을 읽어 받은 답과 비교했습니다. 백엔드는 보관함이 아니라 규칙을 실행하는 프로그램입니다.",
            "4 / 6　백엔드가 계산 결과를 데이터베이스의 학생 17 점수 행에 기록했습니다. 데이터베이스는 관계를 정해 자료를 보관하고 찾게 합니다.",
            "5 / 6　백엔드가 저장된 점수를 응답 봉투에 담아 학생 기기로 돌려보냈습니다.",
            "6 / 6　프론트엔드가 응답에서 score 값을 읽어 화면에 표시했습니다. 고른 답부터 화면 결과까지 같은 값이 어떻게 이동하고 바뀌었는지 확인하세요."
        ];
        let stage = 0;
        let selectedAnswer = null;
        const baseScore = 4;

        const calculatedScore = () => baseScore + (selectedAnswer === 3 ? 1 : 0);

        const activate = (nextStage) => {
            stage = nextStage;
            lab.dataset.stage = String(stage);
            nodes.forEach((node) => {
                const stages = node.dataset.stackNode.split(",").map(Number);
                const selected = stages.includes(stage);
                node.classList.toggle("is-active", selected);
                node.setAttribute("aria-pressed", String(selected));
            });
            const hasRequest = stage >= 2;
            const hasCalculation = stage >= 3;
            const hasStored = stage >= 4;
            const hasResponse = stage >= 5;
            const hasDisplay = stage >= 6;
            const score = calculatedScore();
            requestValue.textContent = hasRequest ? `{ answer: ${selectedAnswer} }` : "{ answer: — }";
            comparison.textContent = hasCalculation ? `${selectedAnswer} = 3 ?` : "— = 3 ?";
            verdict.textContent = hasCalculation ? (selectedAnswer === 3 ? "같음 → 1점 더하기" : "다름 → 점수 유지") : "처리 전";
            dbScore.textContent = String(hasStored ? score : baseScore);
            responseValue.textContent = hasResponse ? `{ score: ${score} }` : "{ score: — }";
            screenScore.textContent = hasDisplay ? `${score}점 표시` : "아직 점수 없음";
            selectedEvidence.textContent = selectedAnswer === null ? "선택 전" : `${selectedAnswer}`;
            resultEvidence.textContent = hasCalculation ? (selectedAnswer === 3 ? "정답 · +1" : "오답 · +0") : "처리 전";
            storedEvidence.textContent = `${hasStored ? score : baseScore}점`;
            displayedEvidence.textContent = hasDisplay ? `${score}점` : "표시 전";
            status.textContent = messages[stage];
            answerButtons.forEach((button) => { button.disabled = stage > 0; });
            startButton.disabled = stage > 0 || selectedAnswer === null;
            nextButton.disabled = stage === 0;
            nextButton.innerHTML = stage === 6
                ? "다른 답 시험 <small>Try Another Answer</small>"
                : "다음 단계 <small>Next Step</small>";
        };

        const reset = () => {
            selectedAnswer = null;
            answerButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
            activate(0);
        };
        answerButtons.forEach((button) => {
            button.addEventListener("click", () => {
                if (stage !== 0) return;
                selectedAnswer = Number(button.dataset.stackAnswer);
                answerButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
                activate(0);
                status.textContent = `선택한 답은 ${selectedAnswer}입니다. 아직 서버에는 가지 않았습니다. 답 제출을 누르면 프론트엔드가 이 값을 읽습니다.`;
            });
        });
        startButton.addEventListener("click", () => { if (selectedAnswer !== null) activate(1); });
        nextButton.addEventListener("click", () => stage >= 6 ? reset() : activate(stage + 1));
        reset();
    }

    function renderLesson() {
        document.title = `${lesson.title} | 컴퓨터 이론`;
        document.getElementById("lessonMeta").textContent = `${lesson.number}차시`;
        document.getElementById("lessonTitle").innerHTML = `${lesson.title} <small>${lesson.english}</small>`;
        document.getElementById("situationTitle").innerHTML = `${lesson.workedExample.title} <small>${lesson.workedExample.english}</small>`;
        document.getElementById("situationLead").textContent = lesson.workedExample.intro;
        document.getElementById("conceptTitle").textContent = lesson.conceptTitle;
        const conceptVisual = document.getElementById("conceptVisual");
        const conceptDiagram = document.getElementById("conceptDiagram");
        const conceptOverview = document.getElementById("conceptOverview");
        const hasPointerLab = lesson.id === "d01";
        conceptVisual.innerHTML = hasPointerLab ? pointerConceptLabMarkup() : lesson.visual;
        conceptDiagram.innerHTML = "";
        const diagram = conceptVisual.querySelector(".system-visual");
        if (diagram) {
            conceptDiagram.innerHTML = `<div class="section-divider"><span>${lesson.parts?.length ? "본체 내부의 부품 위치" : "구조도"}</span><small>${lesson.parts?.length ? "Component Locations" : "Structure Diagram"}</small></div>`;
            conceptDiagram.appendChild(diagram);
        }
        const partsMount = document.getElementById("conceptParts");
        if (lesson.parts?.length) {
            partsMount.innerHTML = `
                <section class="component-inspector" aria-labelledby="componentInspectorTitle">
                    <div class="explanation-heading">
                        <span>본체 위치와 부품 확대 <small>Inside the Case and Component Close-ups</small></span>
                        <h2 id="componentInspectorTitle">전체 위치에서 부품 하나까지 이어서 보기</h2>
                        <p>본체 사진의 번호나 아래 부품 단추를 누르세요. 같은 선택이 확대 사진과 설명에 이어집니다.</p>
                    </div>
                    <div class="component-inspector-stage">
                        <div class="component-cutaway-mount" data-component-cutaway></div>
                        <div class="component-browser">
                            <div class="component-tabs" role="tablist" aria-label="자세히 볼 컴퓨터 부품">
                                ${lesson.parts.map((part, index) => `
                                    <button id="componentTab${index}" type="button" role="tab" data-part-index="${index}" aria-controls="componentPartPanel" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">
                                        <img src="${part.image}" width="768" height="768" alt="">
                                        <span><strong>${part.short}</strong><small>${part.korean}</small></span>
                                    </button>
                                `).join("")}
                            </div>
                            <article id="componentPartPanel" class="component-detail-card" role="tabpanel" aria-live="polite"></article>
                        </div>
                    </div>
                </section>
            `;
            const cutawayMount = partsMount.querySelector("[data-component-cutaway]");
            if (diagram && cutawayMount) {
                cutawayMount.appendChild(diagram);
                conceptDiagram.replaceChildren();
            }
            const partButtons = [...partsMount.querySelectorAll("[data-part-index]")];
            const cutawayButtons = [...partsMount.querySelectorAll("[data-cutaway-part-index]")];
            const partPanel = document.getElementById("componentPartPanel");
            const showPart = (index, reveal = false) => {
                const part = lesson.parts[index];
                partButtons.forEach((button, buttonIndex) => {
                    button.setAttribute("aria-selected", String(buttonIndex === index));
                    button.tabIndex = buttonIndex === index ? 0 : -1;
                });
                cutawayButtons.forEach((button) => {
                    const selected = Number(button.dataset.cutawayPartIndex) === index;
                    button.setAttribute("aria-pressed", String(selected));
                    button.classList.toggle("is-selected", selected);
                });
                partPanel.setAttribute("aria-labelledby", `componentTab${index}`);
                partPanel.innerHTML = `
                    <figure>
                        <img src="${part.image}" width="768" height="768" alt="${part.alt}">
                        <figcaption>실물의 대표적인 형태입니다. 제품에 따라 크기·색·덮개 모양은 달라질 수 있습니다.</figcaption>
                    </figure>
                    <div class="component-copy">
                        <header><span>${part.short}</span><h3>${part.full}<small>${part.korean}</small></h3></header>
                        <section class="term-origin"><strong>명칭과 어원 <small>Name and Origin</small></strong><p>${part.origin}</p></section>
                        <dl>
                            <div><dt>생김새 <small>What It Looks Like</small></dt><dd>${part.look}</dd></div>
                            <div><dt>맡은 일 <small>What It Does</small></dt><dd>${part.job}</dd></div>
                            <div><dt>연결 방식 <small>How It Connects</small></dt><dd>${part.connection}</dd></div>
                            <div class="misconception"><dt>구별할 점 <small>Distinction</small></dt><dd>${part.misconception}</dd></div>
                        </dl>
                    </div>
                `;
                if (reveal && window.matchMedia("(max-width: 520px)").matches) {
                    requestAnimationFrame(() => {
                        partButtons[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                        partPanel.scrollIntoView({ behavior: "smooth", block: "start" });
                    });
                }
            };
            partButtons.forEach((button, index) => {
                button.addEventListener("click", () => showPart(index, true));
                button.addEventListener("keydown", (event) => {
                    const directions = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
                    if (!(event.key in directions)) return;
                    event.preventDefault();
                    const next = (index + directions[event.key] + partButtons.length) % partButtons.length;
                    showPart(next);
                    partButtons[next].focus();
                });
            });
            cutawayButtons.forEach((button) => {
                button.addEventListener("click", () => showPart(Number(button.dataset.cutawayPartIndex), true));
            });
            showPart(0);
        } else {
            partsMount.innerHTML = "";
        }
        const details = document.getElementById("conceptDetails");
        details.innerHTML = hasPointerLab ? "" : lesson.details.map((detail, index) => `
            <article><span class="concept-number">${index + 1}</span><h3>${detail[0]} <small>${detail[1]}</small></h3><p>${detail[2]}</p></article>
        `).join("");
        conceptOverview.classList.toggle("has-pointer-lab", hasPointerLab);
        conceptOverview.classList.toggle("has-stack-lab", lesson.id === "h04");
        const hasFoundationLab = ["a01", "a02", "a03", "a04", "a05"].includes(lesson.id);
        const hasPremiumVisual = hasFoundationLab || Boolean(window.COMPUTER_PREMIUM_VISUAL_IDS?.includes(lesson.id));
        conceptOverview.classList.toggle("has-premium-visual", hasPremiumVisual);
        conceptOverview.hidden = Boolean(lesson.parts?.length);
        const conceptGlossary = document.getElementById("conceptGlossary");
        conceptGlossary.hidden = hasPointerLab || !lesson.details?.length;
        conceptGlossary.open = !(hasPremiumVisual || hasPointerLab || lesson.id === "h04" || lesson.parts?.length);
        if (hasPointerLab) setupPointerConceptLab();
        if (lesson.id === "a01") setupA01SignalLab();
        if (lesson.id === "a02") setupA02CooperationLab();
        if (lesson.id === "a03") setupA03CompatibilityLab();
        if (lesson.id === "a04") window.COMPUTER_A04.setup();
        if (lesson.id === "a05") window.COMPUTER_A05.setup();
        setupConceptSequences();
        setupFullStackLab();
        window.COMPUTER_SETUP_CONCEPT_LABS?.();
        const devicesMount = document.getElementById("conceptDevices");
        const deviceComparison = lesson.deviceComparison;
        if (deviceComparison?.cards?.length) {
            devicesMount.innerHTML = `
                <details class="device-comparison-disclosure">
                    <summary>
                        <span>기기별 구조 비교 <small>Device Structure Comparison</small></span>
                        <strong>PC·Chromebook·태블릿·스마트폰</strong>
                    </summary>
                <section class="device-comparison" aria-labelledby="deviceComparisonTitle">
                    <div class="explanation-heading compact">
                        <span>기기별 구조 비교 <small>Device Structure Comparison</small></span>
                        <h2 id="deviceComparisonTitle">${deviceComparison.title} <small>${deviceComparison.english}</small></h2>
                        <p>${deviceComparison.intro}</p>
                    </div>
                    <div class="device-comparison-grid">
                        ${deviceComparison.cards.map((card) => `
                            <article>
                                <figure><img src="${card.image}" width="768" height="512" alt="${card.alt}"></figure>
                                <div class="device-card-copy">
                                    <h3>${card.title} <small>${card.english}</small></h3>
                                    <p class="device-relation">${card.relation}</p>
                                    <p>${card.note}</p>
                                </div>
                            </article>
                        `).join("")}
                    </div>
                    <p class="representative-note"><strong>대표적인 구조</strong> 제품과 세대에 따라 부품의 위치·크기·결합 방식은 달라질 수 있습니다. 배터리가 있는 기기는 직접 분해하지 않고 시각 자료로 관찰합니다.</p>
                </section>
                </details>
            `;
        } else {
            devicesMount.innerHTML = "";
        }
        const story = lesson.workedExample;
        document.getElementById("conceptStory").innerHTML = `
            <section class="worked-example" aria-labelledby="workedExampleTitle">
                <div class="explanation-heading">
                    <span>동작 순서 <small>Operation Sequence</small></span>
                    <h2 id="workedExampleTitle">${story.title} <small>${story.english}</small></h2>
                    <p>${story.intro}</p>
                </div>
                <ol class="story-steps ${story.steps.length <= 4 ? "is-linear-row" : ""}" style="--story-columns:${story.steps.length === 4 ? 4 : 3}" data-step-count="${story.steps.length}">
                    ${story.steps.map((step, index) => `
                        <li>
                            <span class="story-number">${index + 1}</span>
                            <div><strong>${step[0]} <small>${step[1]}</small></strong><p>${step[2]}</p></div>
                        </li>
                    `).join("")}
                </ol>
            </section>
        `;

        const comparison = lesson.comparisons;
        document.getElementById("conceptCompare").innerHTML = `
            <section class="concept-comparison" aria-labelledby="comparisonTitle">
                <div class="explanation-heading compact">
                    <span>개념 비교 <small>Concept Comparison</small></span>
                    <h2 id="comparisonTitle">${comparison.title} <small>${comparison.english}</small></h2>
                </div>
                <div class="comparison-grid">
                    ${comparison.cards.map((card) => `
                        <article>
                            <h3>${card[0]} <small>${card[1]}</small></h3>
                            <p>${card[2]}</p>
                            ${card[3] ? `<dl><dt>구체적인 예 <small>Concrete Examples</small></dt><dd>${card[3]}</dd></dl>` : ""}
                        </article>
                    `).join("")}
                </div>
            </section>
        `;

        const analogy = lesson.analogy;
        document.getElementById("conceptAnalogy").innerHTML = `
            <section class="analogy-panel" aria-labelledby="analogyTitle">
                <div class="analogy-main">
                    <span class="analogy-label">비유 <small>Analogy</small></span>
                    <h2 id="analogyTitle">${analogy.title} <small>${analogy.english}</small></h2>
                    <p>${analogy.text}</p>
                </div>
                <aside class="analogy-limit">
                    <strong>비유가 실제와 다른 점 <small>Where the Analogy Stops</small></strong>
                    <p>${analogy.limit}</p>
                </aside>
                <div class="teachback"><strong>설명 문제 <small>Explanation Question</small></strong><p>${analogy.teachback}</p></div>
            </section>
        `;
        document.getElementById("activityTitle").textContent = lesson.activity.title || "";
        document.getElementById("activityInstruction").textContent = lesson.activity.instruction || "";
        document.getElementById("startActivity").innerHTML = !hasActivityStage
            ? "문제 풀기 <small>Start Questions</small>"
            : lesson.activity.type === "sort"
                ? "나누어 보기 <small>Start Sorting</small>"
                : "실험 시작 <small>Start Experiment</small>";
        stepStatus.textContent = hasActivityStage ? "장면·원리 1 / 3" : "장면·원리 1 / 2";
        renderStaticCanvases();
        renderLessonList();
        const back = document.querySelector(".back-button");
        back.href = lessonIndex === 0 ? courseHref : lessonHref(lessons[lessonIndex - 1].id);
        back.setAttribute("aria-label", lessonIndex === 0 ? "차시 목록으로 돌아가기" : "이전 차시로 돌아가기");
        document.getElementById("scoreTotal").textContent = `/ ${lesson.questions.length}`;
    }

    function renderLessonList() {
        const list = document.getElementById("lessonList");
        const modules = window.COMPUTER_CORE_MODULES || [];
        const completed = new Set();
        lessons.forEach((item) => {
            try {
                if (JSON.parse(localStorage.getItem(`computer-literacy:${item.id}`) || "null")?.completed) completed.add(item.id);
            } catch (_) { /* Ignore damaged local progress. */ }
        });
        list.innerHTML = modules.map((module) => {
            const items = lessons.filter((item) => item.id[0].toUpperCase() === module.code);
            const done = items.filter((item) => completed.has(item.id)).length;
            const currentModule = lesson.id[0].toUpperCase() === module.code;
            const links = items.map((item) => {
                const current = item.id === lesson.id;
                const complete = completed.has(item.id);
                return `<li class="${current ? "is-current" : ""} ${complete ? "is-complete" : ""}"><a href="${lessonHref(item.id)}" ${current ? 'aria-current="page"' : ""}><span>${item.code || item.id.toUpperCase()}</span><strong>${item.title}</strong><small>${item.english}</small></a></li>`;
            }).join("");
            return `<details class="course-module" ${currentModule ? "open" : ""}><summary><span><b>${module.code}</b><strong>${module.title}</strong><small>${module.english}</small></span><em>${done} / ${items.length}</em></summary><ol class="course-list lesson-link-list">${links}</ol></details>`;
        }).join("");
    }

    function resetActivity() {
        activityPassed = false;
        activityState = {};
        selectedItem = null;
        activityFeedback.textContent = "";
        activityFeedback.className = "feedback";
        checkActivity.hidden = false;
        checkActivity.innerHTML = "확인 <small>Check</small>";
        checkActivity.disabled = lesson.activity.type !== "sort";
        if (lesson.activity.type === "sort") renderSortActivity();
        if (lesson.activity.type === "analog") renderAnalogActivity();
        if (lesson.activity.type === "sampling") renderSamplingActivity();
    }

    function cardMarkup(item) {
        return `${item.label}<small>${item.english}</small>`;
    }

    function renderSortActivity() {
        const activity = lesson.activity;
        activityMount.innerHTML = `
            <div class="drag-explanation">
                <span><b>드래그</b> 누른 채 움직이기</span><span><b>드롭</b> 알맞은 칸에서 놓기</span><span>탭 방식: 카드와 분류 칸을 차례로 누르기</span>
            </div>
            <div class="sort-zone-grid" style="--zone-count:${activity.categories.length}">
                ${activity.categories.map((category) => `<section class="drop-zone" data-category="${category.id}" tabindex="0" role="button" aria-label="${category.label} 분류 칸"><h3>${category.label}<small>${category.english}</small></h3><div class="zone-items"></div></section>`).join("")}
            </div>
            <div class="sort-bank" data-category="" aria-label="분류할 카드"></div>`;
        activity.items.forEach((item) => {
            const category = activityState[item.id] || "";
            const target = category ? activityMount.querySelector(`[data-category="${category}"] .zone-items`) : activityMount.querySelector(".sort-bank");
            const button = document.createElement("button");
            button.type = "button";
            button.className = "sort-card";
            button.dataset.item = item.id;
            button.classList.toggle("is-selected", selectedItem === item.id);
            button.setAttribute("aria-pressed", String(selectedItem === item.id));
            button.innerHTML = cardMarkup(item);
            target.append(button);
        });
        checkActivity.disabled = Object.keys(activityState).length !== activity.items.length;
    }

    function assignItem(itemId, category) {
        if (category) activityState[itemId] = category;
        else delete activityState[itemId];
        selectedItem = null;
        activityFeedback.textContent = "";
        activityFeedback.className = "feedback";
        renderSortActivity();
    }

    function beginDrag(event, itemId, sourceElement) {
        if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
        dragState = { pointerId: event.pointerId, itemId, sourceElement, startX: event.clientX, startY: event.clientY, dragging: false, ghost: null };
        sourceElement.setPointerCapture?.(event.pointerId);
    }

    function dropTargetAt(x, y) {
        activityMount.querySelectorAll(".drop-zone").forEach((zone) => zone.classList.remove("is-drop-target"));
        const element = document.elementFromPoint(x, y);
        const target = element ? element.closest(".drop-zone, .sort-bank") : null;
        if (target?.classList.contains("drop-zone")) target.classList.add("is-drop-target");
        return target;
    }

    function moveDrag(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        if (!dragState.dragging && Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY) < 7) return;
        event.preventDefault();
        if (!dragState.dragging) {
            const item = lesson.activity.items.find((entry) => entry.id === dragState.itemId);
            const ghost = document.createElement("div");
            ghost.className = "lesson-drag-ghost";
            ghost.setAttribute("aria-hidden", "true");
            ghost.innerHTML = cardMarkup(item);
            document.body.append(ghost);
            dragState.ghost = ghost;
            dragState.dragging = true;
            dragState.sourceElement.classList.add("is-dragging");
        }
        dragState.ghost.style.left = `${event.clientX}px`;
        dragState.ghost.style.top = `${event.clientY}px`;
        dropTargetAt(event.clientX, event.clientY);
    }

    function endDrag(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        const finished = dragState;
        dragState = null;
        try { finished.sourceElement.releasePointerCapture?.(event.pointerId); } catch (_) { /* capture may already be released */ }
        if (!finished.dragging) return;
        event.preventDefault();
        const target = event.type === "pointercancel" ? null : dropTargetAt(event.clientX, event.clientY);
        finished.ghost?.remove();
        finished.sourceElement.classList.remove("is-dragging");
        activityMount.querySelectorAll(".drop-zone").forEach((zone) => zone.classList.remove("is-drop-target"));
        suppressClickUntil = performance.now() + 300;
        if (target) assignItem(finished.itemId, target.dataset.category || "");
    }

    activityMount.addEventListener("pointerdown", (event) => {
        const card = event.target.closest(".sort-card");
        if (card) beginDrag(event, card.dataset.item, card);
    });
    document.addEventListener("pointermove", moveDrag, { passive: false });
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);

    activityMount.addEventListener("click", (event) => {
        if (performance.now() < suppressClickUntil || lesson.activity.type !== "sort") return;
        const card = event.target.closest(".sort-card");
        if (card) {
            selectedItem = selectedItem === card.dataset.item ? null : card.dataset.item;
            renderSortActivity();
            return;
        }
        const zone = event.target.closest(".drop-zone, .sort-bank");
        if (zone && selectedItem) assignItem(selectedItem, zone.dataset.category || "");
    });

    activityMount.addEventListener("keydown", (event) => {
        if ((event.key === "Enter" || event.key === " ") && selectedItem) {
            const zone = event.target.closest(".drop-zone");
            if (zone) {
                event.preventDefault();
                assignItem(selectedItem, zone.dataset.category);
            }
        }
    });

    function renderAnalogActivity() {
        activityState = { records: [], pairFound: false };
        activityMount.innerHTML = window.COMPUTER_A04.markup("activity");
        window.COMPUTER_A04.setup(activityMount.querySelector('[data-a04-lab="activity"]'), {
            onState(snapshot) {
                activityState.records = snapshot.records;
                activityState.pairFound = snapshot.pairFound;
                checkActivity.disabled = snapshot.records.length < 2;
            }
        });
    }

    function renderSamplingActivity() {
        activityState = { rateCompared: false, bitsCompared: false };
        activityMount.innerHTML = window.COMPUTER_A05.markup("activity");
        window.COMPUTER_A05.setup(activityMount.querySelector('[data-a05-lab="activity"]'), {
            onState(snapshot) {
                activityState.rateCompared = snapshot.rateCompared;
                activityState.bitsCompared = snapshot.bitsCompared;
                checkActivity.disabled = !(snapshot.rateCompared && snapshot.bitsCompared);
            }
        });
    }

    function drawWave(canvas, sampleCount) {
        if (!canvas) return;
        const ratio = Math.max(1, window.devicePixelRatio || 1);
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(320, Math.round(rect.width || 600));
        const height = Math.max(160, Math.round(rect.height || 190));
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        const context = canvas.getContext("2d");
        context.scale(ratio, ratio);
        context.clearRect(0, 0, width, height);
        context.strokeStyle = "#d7c6a9";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(16, height / 2);
        context.lineTo(width - 16, height / 2);
        context.stroke();
        const valueAt = (fraction) => Math.sin(fraction * Math.PI * 4) * 0.58 + Math.sin(fraction * Math.PI * 10) * 0.16;
        context.strokeStyle = "#8d6a3b";
        context.lineWidth = 3;
        context.beginPath();
        for (let index = 0; index <= 240; index += 1) {
            const fraction = index / 240;
            const x = 16 + fraction * (width - 32);
            const y = height / 2 - valueAt(fraction) * (height * 0.38);
            if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.stroke();
        context.strokeStyle = "#0e6670";
        context.fillStyle = "#0e6670";
        context.lineWidth = 2;
        context.beginPath();
        for (let index = 0; index < sampleCount; index += 1) {
            const fraction = sampleCount === 1 ? 0 : index / (sampleCount - 1);
            const x = 16 + fraction * (width - 32);
            const y = height / 2 - valueAt(fraction) * (height * 0.38);
            if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.stroke();
        for (let index = 0; index < sampleCount; index += 1) {
            const fraction = sampleCount === 1 ? 0 : index / (sampleCount - 1);
            const x = 16 + fraction * (width - 32);
            const y = height / 2 - valueAt(fraction) * (height * 0.38);
            context.beginPath();
            context.arc(x, y, 4, 0, Math.PI * 2);
            context.fill();
        }
    }

    function renderStaticCanvases() {
        document.querySelectorAll("canvas[data-samples]").forEach((canvas) => drawWave(canvas, Number(canvas.dataset.samples)));
    }

    function checkCurrentActivity() {
        if (lesson.activity.type === "sort") {
            const wrong = lesson.activity.items.filter((item) => activityState[item.id] !== item.category);
            if (wrong.length) {
                activityFeedback.textContent = `${wrong.map((item) => item.label).join("·")} 카드가 놓인 칸의 이름과 실제 역할을 다시 비교하세요.`;
                activityFeedback.className = "feedback is-wrong";
                return;
            }
        }
        if (lesson.activity.type === "analog") {
            const [first, second] = activityState.records;
            if (!first || !second || first.raw === second.raw || first.digital !== second.digital) {
                activityFeedback.textContent = "실제 온도는 서로 다르면서 0.5°C 단위 표시값은 같은 두 값을 찾아 기록하세요.";
                activityFeedback.className = "feedback is-wrong";
                return;
            }
        }
        if (lesson.activity.type === "sampling" && !(activityState.rateCompared && activityState.bitsCompared)) {
            activityFeedback.textContent = "샘플링 레이트만 바꾼 비교와 비트 깊이만 바꾼 비교를 하나씩 완료하세요.";
            activityFeedback.className = "feedback is-wrong";
            return;
        }
        activityPassed = true;
        activityFeedback.textContent = lesson.activity.success;
        activityFeedback.className = "feedback is-correct";
        checkActivity.innerHTML = "문제 풀기 <small>Continue to Questions</small>";
    }

    const beginActivity = () => {
        if (!hasActivityStage) {
            resetQuiz();
            showStage("quiz", "문제 풀이 2 / 2");
            focusFirstQuizOption();
            return;
        }
        resetActivity();
        showStage("activity", "직접 조작 2 / 3");
        focusStageHeading("activity");
    };
    document.getElementById("startActivity").addEventListener("click", beginActivity);
    document.getElementById("resetActivity").addEventListener("click", resetActivity);
    checkActivity.addEventListener("click", () => {
        if (!activityPassed) {
            checkCurrentActivity();
            return;
        }
        resetQuiz();
        showStage("quiz", "문제 풀이 3 / 3");
        focusFirstQuizOption();
    });

    let questionIndex = 0;
    let selectedOption = -1;
    let score = 0;
    let results = [];
    let questionHadWrong = false;
    const quizCount = document.getElementById("quizCount");
    const questionText = document.getElementById("questionText");
    const questionOptions = document.getElementById("questionOptions");
    const quizFeedback = document.getElementById("quizFeedback");
    const submitAnswer = document.getElementById("submitAnswer");
    const nextQuestion = document.getElementById("nextQuestion");

    function focusFirstQuizOption() {
        const firstAvailable = questionOptions.querySelector("button:not(:disabled)");
        if (firstAvailable) firstAvailable.focus();
    }

    function resetQuiz() {
        questionIndex = 0;
        selectedOption = -1;
        score = 0;
        results = [];
        renderQuestion();
    }

    function renderQuestion() {
        const question = lesson.questions[questionIndex];
        selectedOption = -1;
        questionHadWrong = false;
        quizCount.textContent = `문제 ${questionIndex + 1} / ${lesson.questions.length}`;
        questionText.textContent = question.text;
        questionOptions.replaceChildren();
        const presentedOptions = question.options.map((text, originalIndex) => ({ text, originalIndex }));
        for (let index = presentedOptions.length - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [presentedOptions[index], presentedOptions[swapIndex]] = [presentedOptions[swapIndex], presentedOptions[index]];
        }
        presentedOptions.forEach((option, displayIndex) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "option-button";
            button.dataset.optionIndex = String(option.originalIndex);
            button.textContent = `${displayIndex + 1}. ${option.text}`;
            button.setAttribute("aria-pressed", "false");
            button.addEventListener("click", () => {
                if (submitAnswer.hidden) return;
                selectedOption = option.originalIndex;
                [...questionOptions.children].forEach((entry, entryIndex) => entry.setAttribute("aria-pressed", String(entryIndex === displayIndex)));
                submitAnswer.disabled = false;
            });
            questionOptions.append(button);
        });
        quizFeedback.textContent = "";
        quizFeedback.className = "feedback quiz-feedback";
        submitAnswer.hidden = false;
        submitAnswer.disabled = true;
        nextQuestion.hidden = true;
    }

    submitAnswer.addEventListener("click", () => {
        const question = lesson.questions[questionIndex];
        const correct = selectedOption === question.answer;
        const buttons = [...questionOptions.children];
        const chosenButton = buttons.find((button) => Number(button.dataset.optionIndex) === selectedOption);
        if (!correct) {
            questionHadWrong = true;
            chosenButton.disabled = true;
            chosenButton.classList.add("is-selected-wrong");
            chosenButton.setAttribute("aria-pressed", "false");
            selectedOption = -1;
            submitAnswer.disabled = true;
            quizFeedback.textContent = "선택한 답을 제외했습니다. 문제에 나온 수치·순서·현재 상태와 남은 설명을 하나씩 다시 대조하세요.";
            quizFeedback.className = "feedback quiz-feedback is-wrong";
            focusFirstQuizOption();
            return;
        }
        if (!questionHadWrong) score += 1;
        results.push({ correct: !questionHadWrong, concept: question.concept, explanation: question.explanation });
        buttons.forEach((button) => {
            button.disabled = true;
            if (Number(button.dataset.optionIndex) === question.answer) button.classList.add("is-answer");
        });
        quizFeedback.textContent = question.explanation;
        quizFeedback.className = "feedback quiz-feedback is-correct";
        submitAnswer.hidden = true;
        nextQuestion.hidden = false;
        nextQuestion.innerHTML = questionIndex === lesson.questions.length - 1
            ? "결과 확인 <small>View Results</small>"
            : "다음 문제 <small>Next Question</small>";
        nextQuestion.focus();
    });

    nextQuestion.addEventListener("click", () => {
        questionIndex += 1;
        if (questionIndex < lesson.questions.length) {
            renderQuestion();
            focusFirstQuizOption();
        }
        else showResult();
    });

    function showResult() {
        document.getElementById("scoreNumber").textContent = String(score);
        const passed = score >= Math.ceil(lesson.questions.length * 0.8);
        document.getElementById("resultMessage").textContent = passed ? "그림과 상황을 근거로 이번 차시의 개념을 적용했습니다." : "틀린 문제의 설명을 확인하고 개념 사이의 관계를 다시 적용해 보세요.";
        const reviewList = document.getElementById("reviewList");
        reviewList.replaceChildren();
        results.filter((result) => !result.correct).forEach((result) => {
            const item = document.createElement("div");
            item.className = "review-item";
            item.innerHTML = `<strong>${result.concept}</strong><br>${result.explanation}`;
            reviewList.append(item);
        });
        if (passed) {
            try { localStorage.setItem(`computer-literacy:${lesson.id}`, JSON.stringify({ completed: true, score, updatedAt: new Date().toISOString() })); } catch (_) { /* local progress may be blocked */ }
        }
        const nextLink = document.getElementById("nextLesson");
        if (lessonIndex < lessons.length - 1) {
            nextLink.href = lessonHref(lessons[lessonIndex + 1].id);
            nextLink.innerHTML = "다음 차시 <small>Next Lesson</small>";
        } else {
            nextLink.href = lessonHref("a01");
            nextLink.innerHTML = "첫 차시로 돌아가기 <small>Back to First Lesson</small>";
        }
        showStage("result", "차시 완료");
        focusStageHeading("result");
    }

    document.getElementById("retryQuiz").addEventListener("click", () => {
        resetQuiz();
        showStage("quiz", hasActivityStage ? "문제 풀이 3 / 3" : "문제 풀이 2 / 2");
        focusFirstQuizOption();
    });

    const courseDialog = document.getElementById("courseDialog");
    function openCourse() {
        if (typeof courseDialog.showModal === "function") courseDialog.showModal();
        else courseDialog.setAttribute("open", "");
    }
    document.getElementById("openCourse").addEventListener("click", openCourse);
    document.getElementById("closeCourse").addEventListener("click", () => courseDialog.close());
    courseDialog.addEventListener("click", (event) => { if (event.target === courseDialog) courseDialog.close(); });
    window.addEventListener("resize", renderStaticCanvases);

    renderLesson();
})();
