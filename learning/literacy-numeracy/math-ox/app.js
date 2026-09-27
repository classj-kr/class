(function () {
  "use strict";

  // 초등 수학 2022 개정 교육과정 단원 기준 학년 재배치 (분수의 나눗셈 -> 초6 정조준)
  // 문항은 data.js 에 있다. 학급 순위전도 같은 파일을 읽는다.
  const mathOxData = window.MATH_OX_DATA || [];

  // 2022 개정 교육과정 단원표. 학년 탭의 차례이자 화면에서 문항을 묶는 차례다.
  // 새 문항의 unit에는 여기 적힌 이름을 그대로 쓴다.
  // 단원별로 문항이 몇 개인지 재려면 같은 폴더의 _coverage.js 를 돌린다.
  const CURRICULUM_UNITS = {
    "초3": ["덧셈과 뺄셈", "곱셈", "나눗셈", "분수와 소수", "평면도형", "원", "길이와 시간", "들이와 무게", "자료의 정리"],
    "초4": ["큰 수", "각도", "곱셈과 나눗셈", "평면도형의 이동", "막대그래프", "규칙 찾기와 등호", "분수의 덧셈과 뺄셈", "삼각형", "소수의 덧셈과 뺄셈", "사각형", "꺾은선그래프", "다각형"],
    "초5": ["자연수의 혼합 계산", "약수와 배수", "규칙과 대응", "약분과 통분", "분수의 덧셈과 뺄셈", "다각형의 둘레와 넓이", "수의 범위와 어림하기", "분수의 곱셈", "합동과 대칭", "소수의 곱셈", "직육면체", "평균과 가능성"],
    "초6": ["분수의 나눗셈", "각기둥과 각뿔", "소수의 나눗셈", "비와 비율", "여러 가지 그래프", "직육면체의 부피와 겉넓이", "공간과 입체", "비례식과 비례배분", "원의 넓이", "원기둥·원뿔·구"],
    "중1": ["소인수분해", "정수와 유리수", "문자와 식", "좌표평면과 그래프", "기본 도형", "평면도형의 성질", "입체도형의 성질", "자료의 정리와 해석"],
    "중2": ["수와 식", "일차부등식", "연립일차방정식", "일차함수", "도형의 성질", "도형의 닮음", "피타고라스 정리", "확률"],
    "중3": ["제곱근과 실수", "다항식의 곱셈과 인수분해", "이차방정식", "이차함수", "삼각비", "원의 성질", "통계"],
    "공수1": ["다항식", "방정식과 부등식", "경우의 수", "행렬"],
    "공수2": ["도형의 방정식", "집합과 명제", "함수와 그래프"],
    "대수": ["지수와 로그", "삼각함수", "수열"],
    "미적1": ["함수의 극한과 연속", "미분", "적분"],
    "확률과 통계": ["경우의 수", "확률", "통계"],
    "기하": ["이차곡선", "공간도형과 공간좌표", "벡터"]
  };

  const ALL_UNITS = "단원 전체";

  let currentSubject = "초3";
  let currentUnit = ALL_UNITS;
  let answeredState = {};

  const filterNav = document.getElementById("filterNav");
  const unitNav = document.getElementById("unitNav");
  const questionsList = document.getElementById("questionsList");

  function init() {
    renderFilters();
    renderUnitNav();
    renderQuestions();
  }

  function renderFilters() {
    const subjects = Object.keys(CURRICULUM_UNITS);
    filterNav.innerHTML = subjects
      .map(
        (subj) =>
          `<button type="button" class="filter-btn ${subj === currentSubject ? "active" : ""}" data-subject="${subj}">${subj}</button>`
      )
      .join("");

    filterNav.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentSubject = btn.dataset.subject;
        currentUnit = ALL_UNITS;
        renderFilters();
        renderUnitNav();
        renderQuestions();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function unitsOf(subject) {
    return CURRICULUM_UNITS[subject] || [];
  }

  // 한 단원에서 지금까지 맞힌 개수와 전체 개수
  function unitScore(unit) {
    const items = mathOxData.filter(
      (q) => q.subject === currentSubject && (unit === ALL_UNITS || q.unit === unit)
    );
    const solved = items.filter((q) => answeredState[q.id]).length;
    const right = items.filter((q) => answeredState[q.id] && answeredState[q.id].isCorrect).length;
    return { total: items.length, solved, right };
  }

  function renderUnitNav() {
    const units = [ALL_UNITS].concat(unitsOf(currentSubject));
    unitNav.innerHTML = units
      .map((u) => {
        const { total, solved, right } = unitScore(u);
        const count = solved > 0 ? `${right}/${total}` : `${total}`;
        return `<button type="button" class="unit-btn ${u === currentUnit ? "active" : ""} ${
          solved === total && total > 0 ? "done" : ""
        }" data-unit="${u}">${u}<span class="unit-count">${count}</span></button>`;
      })
      .join("");

    unitNav.querySelectorAll(".unit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentUnit = btn.dataset.unit;
        renderUnitNav();
        renderQuestions();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function getFilteredData() {
    const units = unitsOf(currentSubject);
    const rank = (u) => {
      const i = units.indexOf(u);
      return i === -1 ? units.length : i;
    };
    return mathOxData
      .filter((item) => item.subject === currentSubject)
      .filter((item) => currentUnit === ALL_UNITS || item.unit === currentUnit)
      .sort((a, b) => rank(a.unit) - rank(b.unit));
  }

  function renderQuestions() {
    const filtered = getFilteredData();

    if (filtered.length === 0) {
      questionsList.innerHTML = `<div class="exp-box" style="text-align:center; padding: 40px;">등록된 문항이 없습니다.</div>`;
      return;
    }

    questionsList.innerHTML = filtered
      .map((q, idx) => {
        const userState = answeredState[q.id];
        const isAnswered = Boolean(userState);
        const isCorrect = isAnswered && userState.isCorrect;
        const selectedChoice = isAnswered ? userState.selectedChoice : null;

        const relIndexStr = String(idx + 1).padStart(2, "0");
        const numberLabel = `${q.subject} 문항 ${relIndexStr}`;
        const isNewUnit = idx === 0 || filtered[idx - 1].unit !== q.unit;
        const unitHeading = isNewUnit ? `<h2 class="unit-heading">${q.unit}</h2>` : "";

        return `
          ${unitHeading}
          <div class="question-card ${isAnswered ? "answered " + (isCorrect ? "correct" : "wrong") : ""}" id="q-card-${q.id}">
            <div class="card-header">
              <div class="badge-group">
                <span class="q-number">${numberLabel}</span>
                <span class="q-topic">${q.topic}</span>
              </div>
            </div>
            
            <div class="q-prompt">${q.prompt}</div>

            <div class="ox-btn-group">
              <button type="button" 
                class="ox-btn btn-o ${selectedChoice === "O" ? (isCorrect ? "selected-correct" : "selected-wrong") : ""} ${isAnswered ? "disabled" : ""}" 
                data-id="${q.id}" data-choice="O" data-sfx="none" ${isAnswered ? "disabled" : ""}>
                O
              </button>
              <button type="button" 
                class="ox-btn btn-x ${selectedChoice === "X" ? (isCorrect ? "selected-correct" : "selected-wrong") : ""} ${isAnswered ? "disabled" : ""}" 
                data-id="${q.id}" data-choice="X" data-sfx="none" ${isAnswered ? "disabled" : ""}>
                X
              </button>
            </div>

            <div class="explanation-panel">
              <div class="feedback-badge ${isCorrect ? "is-correct" : "is-wrong"}">
                ${isCorrect ? "정답입니다! 🎉 (정답: " + q.answer + ")" : "아쉽습니다! 💡 (정답: " + q.answer + ")"}
              </div>
              <div class="exp-box">
                <p class="exp-content">${q.pitfall}</p>
                <p class="exp-content">${q.reason}</p>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    // O/X 이벤트 리스너 바인딩
    questionsList.querySelectorAll(".ox-btn:not(.disabled)").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const choice = btn.dataset.choice;
        handleAnswer(id, choice);
      });
    });

    // KaTeX 수식 렌더링
    if (window.renderMathInElement) {
      window.renderMathInElement(questionsList, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        preProcess: function (math) {
          let processed = math;
          // Inline fractions make their numerator and denominator much smaller
          // than the Korean sentence on phones. In elementary questions, use
          // display-style fractions without enlarging the whole expression.
          if (currentSubject.startsWith("초")) {
            processed = processed.replace(/\\frac(?![a-zA-Z])/g, "\\dfrac");
          }
          if (/\\(int|iint|iiint|oint|sum|prod|lim|bigcap|bigcup)(?![a-zA-Z])/.test(processed) && !processed.includes("\\displaystyle") && !processed.includes("\\textstyle")) {
            return "\\displaystyle " + processed;
          }
          return processed;
        },
        throwOnError: false,
      });
    }
  }

  function handleAnswer(id, choice) {
    const item = mathOxData.find((q) => q.id === id);
    if (!item || answeredState[id]) return;

    const isCorrect = item.answer === choice;
    answeredState[id] = { selectedChoice: choice, isCorrect };

    renderUnitNav();
    renderQuestions();
    window.ClassGameSfx?.play(isCorrect ? "success" : "error");
  }


  document.addEventListener("DOMContentLoaded", init);
})();
