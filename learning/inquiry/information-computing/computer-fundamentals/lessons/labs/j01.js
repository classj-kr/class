(() => {
    "use strict";

    const { setBilingualButtonLabel, figure, contextImage, compactContextImage } = window.COMPUTER_LAB_HELPERS;
    const renderers = window.COMPUTER_LAB_RENDERERS;

    renderers.j01 = (spec) => figure(spec, "visual-algorithm-builder", `
        <section class="algorithm-file-lab" data-algorithm-lab data-algorithm-stage="0">
            <header class="algorithm-lab-heading">
                <div><h3>파일을 실제로 옮기며 실행 순서를 만든다 <small>Build an Algorithm by Operating a File Manager</small></h3><p>river.webp를 다운로드 폴더에서 과제 사진 폴더로 옮기세요. 실행한 순서와 각 단계의 결과를 확인합니다.</p></div>
                <button type="button" data-algo-reset>처음부터 <small>Reset</small></button>
            </header>
            <div class="algorithm-file-manager" aria-label="river.webp 파일을 과제 사진 폴더로 옮기는 파일 관리자">
                <header class="algorithm-window-bar"><strong>파일 관리자 <small>File Manager</small></strong><span>— □ ×</span></header>
                <div class="algorithm-toolbar"><button type="button" data-algo-back disabled>←</button><code data-algo-path>내 파일</code><button type="button" data-algo-move disabled>이동 <small>Move</small></button></div>
                <div class="algorithm-file-body">
                    <aside>
                        <button type="button" data-algo-location="downloads"><i></i><span>다운로드<small>Downloads</small></span></button>
                        <button type="button" data-algo-location="assignment"><i></i><span>과제 사진<small>Assignment Photos</small></span></button>
                    </aside>
                    <main>
                        <section class="algorithm-source-pane" data-algo-pane="downloads">
                            <h4>다운로드 <small>Downloads</small></h4>
                            <button type="button" draggable="true" class="algorithm-photo-file" data-file-source hidden><i><span></span></i><span><b>river.webp</b><small>WebP 사진 · 840 KB</small></span></button>
                            <span class="algorithm-file-item" data-algo-note hidden>▤ notes.txt</span>
                            <span class="algorithm-file-item" data-algo-pdf hidden>▦ homework.pdf</span>
                            <p data-algo-source-empty hidden>river.webp가 이 폴더에 없습니다.</p>
                        </section>
                        <section class="algorithm-target-pane" data-algo-pane="assignment" data-algo-dropzone tabindex="0" role="button" aria-label="river.webp를 놓을 과제 사진 폴더">
                            <h4>과제 사진 <small>Assignment Photos</small></h4>
                            <p data-file-empty>이곳을 목적지로 고르거나 river.webp를 끌어 놓으세요.</p>
                            <button type="button" class="algorithm-photo-file moved" data-file-moved hidden><i><span></span></i><span><b>river.webp</b><small>옮겨진 WebP 사진</small></span></button>
                        </section>
                    </main>
                </div>
                <footer data-file-result>왼쪽 위치 목록에서 다운로드 폴더를 먼저 여세요.</footer>
            </div>
            <ol class="algorithm-runtime-trace" aria-label="실제로 실행한 알고리즘 기록">
                <li data-algo-trace="open"><b>1</b><span>다운로드 열기<small>Open Downloads</small></span><em>대기</em></li>
                <li data-algo-trace="select"><b>2</b><span>river.webp 선택<small>Select File</small></span><em>대기</em></li>
                <li data-algo-trace="destination"><b>3</b><span>목적지 정하기<small>Choose Destination</small></span><em>대기</em></li>
                <li data-algo-trace="move"><b>4</b><span>파일 이동<small>Move File</small></span><em>대기</em></li>
                <li data-algo-trace="verify"><b>5</b><span>출발·도착 확인<small>Verify Both Locations</small></span><em>대기</em></li>
            </ol>
            <div class="algorithm-controller"><button type="button" data-algo-verify disabled>결과 확인 <small>Verify Move</small></button><p data-algo-status role="status" aria-live="polite">실행 전입니다. 알고리즘은 컴퓨터가 실행할 수 있을 만큼 대상과 순서가 분명해야 합니다.</p></div>
        </section>
    `);

    function setupAlgorithmLab() {
        const lab = document.querySelector("[data-algorithm-lab]");
        if (!lab) return;
        const locationButtons = Array.from(lab.querySelectorAll("[data-algo-location]"));
        const sourcePhoto = lab.querySelector("[data-file-source]");
        const movedPhoto = lab.querySelector("[data-file-moved]");
        const sourceEmpty = lab.querySelector("[data-algo-source-empty]");
        const targetEmpty = lab.querySelector("[data-file-empty]");
        const note = lab.querySelector("[data-algo-note]");
        const pdf = lab.querySelector("[data-algo-pdf]");
        const dropzone = lab.querySelector("[data-algo-dropzone]");
        const moveButton = lab.querySelector("[data-algo-move]");
        const verifyButton = lab.querySelector("[data-algo-verify]");
        const resetButton = lab.querySelector("[data-algo-reset]");
        const backButton = lab.querySelector("[data-algo-back]");
        const path = lab.querySelector("[data-algo-path]");
        const status = lab.querySelector("[data-algo-status]");
        const fileResult = lab.querySelector("[data-file-result]");
        const trace = Array.from(lab.querySelectorAll("[data-algo-trace]"));
        let stage = 0;
        let selected = false;
        let destinationChosen = false;
        let moved = false;
        const render = () => {
            lab.dataset.algorithmStage = String(stage);
            sourcePhoto.hidden = stage < 1 || moved;
            note.hidden = stage < 1;
            pdf.hidden = stage < 1;
            sourceEmpty.hidden = !moved;
            targetEmpty.hidden = moved;
            movedPhoto.hidden = !moved;
            sourcePhoto.classList.toggle("is-selected", selected && !moved);
            sourcePhoto.setAttribute("aria-pressed", String(selected && !moved));
            dropzone.classList.toggle("is-selected", destinationChosen && !moved);
            moveButton.disabled = !selected || !destinationChosen || moved;
            verifyButton.disabled = !moved || stage >= 5;
            backButton.disabled = stage === 0;
            locationButtons.forEach((button) => button.setAttribute("aria-pressed", String(
                button.dataset.algoLocation === "downloads" ? stage >= 1 : destinationChosen
            )));
            trace.forEach((item, index) => {
                const complete = stage >= index + 1;
                item.classList.toggle("is-complete", complete);
                item.classList.toggle("is-current", !complete && stage === index);
                item.querySelector("em").textContent = complete ? "완료" : stage === index ? "다음 동작" : "대기";
            });
        };
        const reset = () => {
            stage = 0;
            selected = false;
            destinationChosen = false;
            moved = false;
            path.textContent = "내 파일";
            fileResult.textContent = "왼쪽 위치 목록에서 다운로드 폴더를 먼저 여세요.";
            status.textContent = "실행 전입니다. 알고리즘은 컴퓨터가 실행할 수 있을 만큼 대상과 순서가 분명해야 합니다.";
            render();
        };
        const openDownloads = () => {
            if (moved) return;
            stage = Math.max(stage, 1);
            path.textContent = "내 파일 › 다운로드";
            fileResult.textContent = "다운로드 폴더를 열었습니다. 옮길 river.webp를 선택하세요.";
            status.textContent = "1단계가 실행되었습니다. 시작 위치가 분명해져 다음 동작의 대상 파일을 찾을 수 있습니다.";
            render();
        };
        const chooseDestination = () => {
            if (!selected || moved) {
                status.textContent = "먼저 다운로드 폴더를 열고 river.webp를 선택해야 어느 파일을 옮길지 정해집니다.";
                return;
            }
            destinationChosen = true;
            stage = Math.max(stage, 3);
            path.textContent = "내 파일 › 다운로드　→　과제 사진";
            fileResult.textContent = "목적지를 과제 사진으로 정했습니다. 이제 이동 명령을 실행할 수 있습니다.";
            status.textContent = "3단계가 실행되었습니다. ‘어디로’ 옮길지가 정해졌지만 아직 파일의 저장 위치는 바뀌지 않았습니다.";
            render();
        };
        const moveFile = () => {
            if (!selected) return;
            destinationChosen = true;
            moved = true;
            stage = 4;
            path.textContent = "내 파일 › 과제 사진";
            fileResult.textContent = "river.webp가 과제 사진에 나타났습니다. 이동은 복사와 달리 출발 위치에서 원본 항목이 사라져야 합니다.";
            status.textContent = "4단계가 실행되었습니다. 결과를 바로 믿지 말고 출발 폴더와 도착 폴더를 함께 확인하세요.";
            render();
        };
        locationButtons.forEach((button) => {
            button.addEventListener("click", () => button.dataset.algoLocation === "downloads" ? openDownloads() : chooseDestination());
        });
        sourcePhoto.addEventListener("click", () => {
            if (stage < 1 || moved) return;
            selected = true;
            stage = Math.max(stage, 2);
            fileResult.textContent = "river.webp를 선택했습니다. 목적지 과제 사진을 누르거나 파일을 그 칸으로 끌어 놓으세요.";
            status.textContent = "2단계가 실행되었습니다. 파일 이름과 형식을 확인해 notes.txt나 homework.pdf가 아닌 river.webp를 대상으로 정했습니다.";
            render();
        });
        sourcePhoto.addEventListener("dragstart", (event) => {
            selected = true;
            stage = Math.max(stage, 2);
            event.dataTransfer?.setData("text/plain", "river.webp");
            render();
        });
        dropzone.addEventListener("dragover", (event) => { event.preventDefault(); dropzone.classList.add("is-drop-target"); });
        dropzone.addEventListener("dragleave", () => dropzone.classList.remove("is-drop-target"));
        dropzone.addEventListener("drop", (event) => {
            event.preventDefault();
            dropzone.classList.remove("is-drop-target");
            if (event.dataTransfer?.getData("text/plain") === "river.webp") moveFile();
        });
        dropzone.addEventListener("click", chooseDestination);
        dropzone.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            chooseDestination();
        });
        moveButton.addEventListener("click", moveFile);
        verifyButton.addEventListener("click", () => {
            if (!moved) return;
            stage = 5;
            fileResult.textContent = "확인 완료: 과제 사진에는 river.webp가 있고 다운로드에는 없습니다. 따라서 복사가 아니라 이동이 끝났습니다.";
            status.textContent = "다섯 동작이 실제로 이어졌습니다. 앞 단계의 결과가 다음 단계의 시작 조건이 되는 실행 가능한 알고리즘입니다.";
            render();
        });
        backButton.addEventListener("click", reset);
        resetButton.addEventListener("click", reset);
        reset();
    }

    window.COMPUTER_LAB_SETUPS.push(setupAlgorithmLab);
    window.COMPUTER_PREMIUM_VISUAL_IDS.push("j01");
})();
