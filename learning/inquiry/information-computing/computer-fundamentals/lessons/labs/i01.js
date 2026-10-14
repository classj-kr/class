(() => {
    "use strict";

    const { setBilingualButtonLabel, figure, contextImage, compactContextImage } = window.COMPUTER_LAB_HELPERS;
    const renderers = window.COMPUTER_LAB_RENDERERS;

    renderers.i01 = (spec, asset) => figure(spec, "visual-account-lab", `
        ${contextImage(asset, "i01-account-auth-permission-illustration-v1", "학생이 자기 계정을 고르고 비밀 정보와 등록 기기로 두 번 확인한 뒤 학생에게 허용된 과제와 파일에 들어가는 장면", 384)}
        <section class="account-lab" data-account-lab data-account-stage="1" data-account-access="idle">
            <div class="school-service">
                <aside aria-label="연습용 학교 서비스 메뉴"><b>배움 교실</b><span>과제</span><span>내 파일</span><span>학급 관리</span></aside>
                <main>
                    <section class="sign-in-panel account-stage-one">
                        <h3>1. 연습용 계정으로 로그인 <small>Sign In</small></h3>
                        <div class="practice-account-card" aria-label="연습용 계정 카드">
                            <strong>실습 계정 카드</strong>
                            <span>계정 이름 <code>student01</code></span>
                            <span>연습용 비밀번호 <code>cedar27</code></span>
                        </div>
                        <label>계정 이름 <small>Username</small><input data-account-name autocomplete="off" spellcheck="false" placeholder="계정 카드에서 확인"></label>
                        <label>연습용 비밀번호 <small>Practice Password</small><input data-account-secret type="password" autocomplete="off" placeholder="연습용 비밀번호 입력"></label>
                    </section>
                    <section class="sign-in-panel account-stage-two">
                        <h3>2. 등록 기기로 한 번 더 확인 <small>Two-Factor Authentication</small></h3>
                        <div class="registered-device-code"><span>등록된 태블릿에 도착한 번호</span><strong>482 169</strong><small>이 번호는 이 실습 안에서만 사용합니다.</small></div>
                        <label>여섯 자리 인증번호 <small>Verification Code</small><input data-account-code inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="숫자 6자리"></label>
                    </section>
                    <section class="permission-panel account-stage-three">
                        <h3>3. 학생 계정의 권한 확인 <small>Authorization</small></h3>
                        <p>현재 계정에는 발표 자료의 읽기 권한이 있습니다. 같은 자료를 읽을 때와 수정할 때의 결과를 비교하세요.</p>
                        <div class="permission-attempts">
                            <button type="button" data-permission-attempt="assignment">발표 자료 읽기 <small>Read Presentation</small></button>
                            <button type="button" data-permission-attempt="edit">발표 자료 수정 <small>Edit Presentation</small></button>
                            <button type="button" data-permission-attempt="grades">개인 기록 읽기 <small>Read Private Record</small></button>
                        </div>
                        <div class="permission-result" data-permission-result role="status" aria-live="polite"><b>요청 전</b><span>서버가 학생 계정에 정해진 권한을 아직 확인하지 않았습니다.</span></div>
                        <section class="account-profile-demo" aria-label="계정과 프로필 비교">
                            <div>
                                <h4>계정과 프로필은 역할이 다르다 <small>Account and Profile</small></h4>
                                <p><b>계정 ID <small>Account ID</small></b><strong>student01</strong><span>로그인과 자료 소유자를 구별하는 값</span></p>
                                <p><b>표시 이름 <small>Display Name</small></b><strong data-profile-name>민준</strong><span>다른 사람에게 보이는 프로필 정보</span></p>
                            </div>
                            <button type="button" data-profile-change>표시 이름 바꾸기 <small>Change Display Name</small></button>
                            <p data-profile-status aria-live="polite">표시 이름을 바꾸어도 계정 ID와 로그인 권한은 그대로입니다.</p>
                        </section>
                    </section>
                </main>
            </div>
            <ol class="account-state-strip" aria-label="계정 접근 과정">
                <li data-account-step="1"><b>1</b><span>식별·비밀번호<small>Identity & Password</small></span></li>
                <li data-account-step="2"><b>2</b><span>등록 기기 확인<small>Second Factor</small></span></li>
                <li data-account-step="3"><b>3</b><span>기능별 권한 확인<small>Authorization</small></span></li>
            </ol>
            <div class="account-controller">
                <button type="button" data-account-prev disabled>이전 <small>Previous</small></button>
                <p data-account-status role="status" aria-live="polite"><b>1. 식별·인증</b>　계정 카드와 같은 두 정보를 직접 입력하세요.</p>
                <button type="button" data-account-next>확인하고 다음 <small>Check and Continue</small></button>
            </div>
        </section>
    `);

    function setupAccountLab() {
        const lab = document.querySelector("[data-account-lab]");
        if (!lab) return;
        const previous = lab.querySelector("[data-account-prev]");
        const next = lab.querySelector("[data-account-next]");
        const status = lab.querySelector("[data-account-status]");
        const nameInput = lab.querySelector("[data-account-name]");
        const secretInput = lab.querySelector("[data-account-secret]");
        const codeInput = lab.querySelector("[data-account-code]");
        const permissionResult = lab.querySelector("[data-permission-result]");
        const profileName = lab.querySelector("[data-profile-name]");
        const profileStatus = lab.querySelector("[data-profile-status]");
        const profileChange = lab.querySelector("[data-profile-change]");
        let stage = 1;
        const setStatus = (markup, tone = "") => {
            status.innerHTML = markup;
            status.dataset.tone = tone;
        };
        const show = (message = "") => {
            lab.dataset.accountStage = String(stage);
            previous.disabled = stage === 1;
            next.innerHTML = stage === 3
                ? '처음부터 <small>Reset</small>'
                : '확인하고 다음 <small>Check and Continue</small>';
            lab.querySelectorAll("[data-account-step]").forEach((item) => item.classList.toggle("is-current", item.dataset.accountStep === String(stage)));
            if (message) {
                setStatus(message);
                return;
            }
            if (stage === 1) setStatus("<b>1. 식별·첫 번째 인증</b>　계정 카드와 같은 두 정보를 직접 입력하세요.");
            if (stage === 2) setStatus("<b>2. 두 번째 인증</b>　비밀번호와 다른 종류의 증거인 등록 기기 번호를 입력하세요.");
            if (stage === 3) setStatus("<b>3. 권한</b>　로그인한 학생 계정이 두 요청을 각각 수행할 수 있는지 확인하세요.");
        };
        const reset = () => {
            stage = 1;
            nameInput.value = "";
            secretInput.value = "";
            codeInput.value = "";
            lab.dataset.accountAccess = "idle";
            lab.dataset.readTried='false';lab.dataset.editTried='false';
            permissionResult.innerHTML = "<b>요청 전</b><span>서버가 학생 계정에 정해진 권한을 아직 확인하지 않았습니다.</span>";
            lab.querySelectorAll("[data-permission-attempt]").forEach((button) => button.setAttribute("aria-pressed", "false"));
            profileName.textContent = "민준";
            profileChange.setAttribute("aria-pressed", "false");
            profileStatus.textContent = "표시 이름을 바꾸어도 계정 ID와 로그인 권한은 그대로입니다.";
            show();
            nameInput.focus();
        };
        previous.addEventListener("click", () => {
            stage = Math.max(1, stage - 1);
            show();
        });
        next.addEventListener("click", () => {
            if (stage === 1) {
                if (nameInput.value.trim() !== "student01" || secretInput.value !== "cedar27") {
                    setStatus("<b>로그인하지 못했습니다.</b>　연습용 계정 카드의 계정 이름과 비밀 문구를 한 글자씩 비교하세요.", "error");
                    return;
                }
                stage = 2;
                show("<b>첫 번째 인증 통과.</b>　비밀번호를 알아도 등록된 기기가 없으면 다음 확인을 통과할 수 없습니다.");
                codeInput.focus();
                return;
            }
            if (stage === 2) {
                if (codeInput.value.replace(/\D/g, "") !== "482169") {
                    setStatus("<b>등록 기기 번호가 맞지 않습니다.</b>　태블릿 화면의 여섯 자리를 순서대로 다시 확인하세요.", "error");
                    return;
                }
                stage = 3;
                show("<b>로그인 성공.</b>　이제 서버가 요청한 기능별로 학생 계정의 권한을 따로 확인합니다.");
                return;
            }
            reset();
        });
        lab.querySelectorAll("[data-permission-attempt]").forEach((button) => button.addEventListener("click", () => {
            const allowed = button.dataset.permissionAttempt === "assignment";
            const editing=button.dataset.permissionAttempt==='edit';
            if(allowed)lab.dataset.readTried='true';
            if(editing)lab.dataset.editTried='true';
            lab.dataset.accountAccess = allowed ? "allowed" : "blocked";
            lab.querySelectorAll("[data-permission-attempt]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
            permissionResult.innerHTML = allowed
                ? "<b>읽기 허용 · 200 OK</b><span>발표 자료를 읽을 권한이 있어 내용을 받았습니다. 수정 권한이 있다는 뜻은 아닙니다.</span>"
                : editing?"<b>수정 거부 · 403 Forbidden</b><span>같은 발표 자료이지만 수정 권한이 없어 요청이 거부됐습니다. 계정과 인증 상태는 읽기 요청 때와 같습니다.</span>":"<b>접근 거부 · 403 Forbidden</b><span>개인 기록을 읽을 권한이 없어 요청이 거부됐습니다. 인증 상태는 유지됩니다.</span>";
            setStatus(allowed
                ? "<b>인증과 권한은 다릅니다.</b>　사용자가 누구인지 확인한 뒤에도, 요청한 일을 해도 되는지 다시 검사했습니다."
                : "<b>인증 성공 · 요청한 권한 없음.</b>　사용자는 확인했지만 해당 자료의 요청한 행동은 허용되지 않았습니다.");
        }));
        profileChange.addEventListener("click", () => {
            const changed = profileChange.getAttribute("aria-pressed") !== "true";
            profileChange.setAttribute("aria-pressed", String(changed));
            profileName.textContent = changed ? "민준 · 과학 모둠" : "민준";
            profileStatus.innerHTML = changed
                ? "<b>프로필만 바뀜.</b> 계정 ID는 student01이고, 로그인 정보와 학생 권한도 그대로입니다."
                : "<b>표시 이름을 되돌림.</b> 프로필 표현은 바뀌어도 계정의 식별값은 student01입니다.";
        });
        [nameInput, secretInput, codeInput].forEach((input) => input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") next.click();
        }));
        codeInput.addEventListener("input", () => {
            codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 6);
        });
        show();
    }

    window.COMPUTER_LAB_SETUPS.push(setupAccountLab);
    window.COMPUTER_PREMIUM_VISUAL_IDS.push("i01");
})();
