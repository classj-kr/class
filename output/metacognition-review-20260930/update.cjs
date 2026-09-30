const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const dir = 'learning/literacy-numeracy/metacognition/';
const changes = new Map();
const read = name => changes.get(name) ?? fs.readFileSync(path.join(root, name), 'utf8').replace(/\r\n/g, '\n');
const put = (name, text) => changes.set(name, text);
function replace(name, from, to) {
  const text = read(name);
  if (!text.includes(from)) throw new Error('Missing anchor: ' + name + ': ' + from.slice(0, 70));
  put(name, text.replace(from, to));
}

// Keep the numeric measures for saved response data, but never turn them into student types.
let metrics = read(dir + 'metrics.js');
metrics = metrics.slice(0, metrics.indexOf('  const PROFILES ='));
metrics = metrics.replace('메타인지 진단 — 지표 엔진', '학습 자기점검 — 응답 요약');
metrics = metrics.replace(/  const BIAS_TOLERANCE[^\n]*\n  const DISCRIMINATION_GOOD[^\n]*\n/, '');
metrics = metrics.replace('지표 묶음 + 유형 분류 + 규칙 기반 상담 카드', '지표 묶음 + 이번 풀이에 한정한 복습 안내');
metrics += `  // This key describes the report format, not a learner category. The DB field is retained for compatibility.
  const REPORT_KEY = "reflection-v1";
  const REVIEW_PLAN = [
    "오늘: 다시 볼 문제 한 개를 골라, 처음에 그 답을 고른 이유를 한 문장으로 말하거나 적어 보세요.",
    "해설을 읽은 뒤: 놓친 조건이나 새로 알게 된 내용을 적고, 해설을 가린 채 다시 설명해 보세요.",
    "다음 공부 시간: 같은 내용을 다루는 처음 보는 문제 2~3개를 풀고, 답의 근거와 자신감을 함께 남겨 보세요.",
    "채점한 뒤: 근거가 맞았는지 확인해 보세요. 같은 문제를 다시 맞힌 횟수나 자신감 수치만으로 실력이 늘었다고 판단하지 않아요."
  ];

  function reflect(result) {
    const correctCount = result.graded.filter(row => row.correct).length;
    const wrongCount = result.n - correctCount;
    const headline = wrongCount === 0
      ? "이번 " + result.n + "문항을 모두 맞혔어요. 답의 근거를 설명해 보고, 처음 보는 문제에도 적용해 보세요."
      : correctCount === 0
        ? "이번에는 맞힌 문항이 없어요. 한 문제부터 해설을 함께 읽고, 낯선 말이나 조건을 확인해 보세요."
        : "이번 " + result.n + "문항 중 " + correctCount + "문항을 맞혔어요. 답을 고를 때의 생각과 해설을 비교해 보세요.";
    const cards = [];
    if (result.highConfErrors.length) cards.push({
      tag: "답의 근거 확인", title: "자신 있었던 답을 다시 살펴봐요",
      evidence: "이번에 자신감을 75% 또는 100%로 표시한 문항 중 " + result.highConfErrors.length + "문항이 오답이었어요.",
      action: "그중 한 문제를 골라 처음 답을 선택한 이유를 말해 보세요. 해설과 비교하며 놓친 조건이 있는지 확인해 보세요."
    });
    if (result.lowConfHits.length) cards.push({
      tag: "맞힌 이유 확인", title: "자신 없었던 정답도 살펴봐요",
      evidence: "이번에 자신감을 25% 또는 50%로 표시한 문항 중 " + result.lowConfHits.length + "문항을 맞혔어요.",
      action: "단서를 알고 골랐을 수도, 우연히 맞혔을 수도 있어요. 정답의 이유를 설명하고 새로운 문제에서도 확인해 보세요."
    });
    if (!cards.length) cards.push({
      tag: "한 문제부터", title: wrongCount ? "해설과 내 생각을 비교해요" : "맞힌 이유를 설명해요",
      evidence: "이번 풀이: 정답 " + correctCount + "개, 오답 " + wrongCount + "개.",
      action: wrongCount ? "틀린 문제 하나를 골라 낯선 말과 조건에 표시해 보세요. 이해하기 어려운 부분은 선생님과 함께 확인해도 좋아요."
        : "문제 하나를 골라 해설을 가리고 풀이를 설명해 보세요. 다음 공부 시간에는 처음 보는 문제로 연습해 보세요."
    });
    return { headline, cards };
  }

  function analyze(responses, items) {
    const result = compute(responses, items);
    if (!result) return null;
    const reflection = reflect(result);
    return {
      metrics: result,
      profile: { key: REPORT_KEY, name: "이번 풀이 돌아보기", headline: reflection.headline },
      cards: reflection.cards,
      plan: REVIEW_PLAN.slice(),
      summary: {
        n: result.n, accuracy: round(result.accuracy), confidence: round(result.confidence),
        bias: round(result.bias), discrimination: round(result.discrimination),
        calibrationError: round(result.calibrationError), brier: round(result.brier),
        highConfErrorCount: result.highConfErrors.length, certainErrorCount: result.certainErrors.length,
        lowConfHitCount: result.lowConfHits.length, trapPenalty: round(result.trapPenalty),
        profileKey: REPORT_KEY
      }
    };
  }

  return { analyze, compute, grade, calibrationCurve, round, CONFIDENCE_BINS, REPORT_KEY, REVIEW_PLAN };
});
`;
put(dir + 'metrics.js', metrics);

// Shared report and start instructions across all levels.
for (const filename of ['index.html', ...Array.from({length: 7}, (_, i) => 'grade' + (i + 3) + '.html')]) {
  const name = dir + filename;
  let html = read(name).replaceAll('간이 진단', '학습 자기점검');
  html = html.replace('내가 아는 것과 안다고 느끼는 것의 차이를 재어 봅니다.', '답을 고를 때의 자신감과 실제 결과를 비교하고, 다시 볼 문제를 찾아요.');
  html = html.replace('정답은 <strong>다 풀고 나서</strong> 한꺼번에 알려 줍니다. 중간에 알려 주면 확신도가 흐트러져 진단이 되지 않습니다.', '정답과 해설은 <strong>다 풀고 나서</strong> 함께 확인합니다.');
  html = html.replace('확신도는 솔직할수록 정확합니다. 모르면 <strong>‘그냥 찍었어요’</strong>를 고르는 것이 훨씬 좋은 답변입니다.', '자신감은 <strong>지금 느낌 그대로</strong> 골라 주세요. 어떤 표시를 골라도 괜찮아요.');
  html = html.replace('맞은 개수보다 <strong>확신과 실제가 얼마나 어긋났는지</strong>를 봅니다. 점수를 잘 받는 시험이 아닙니다.', '끝나면 <strong>내 답과 정답의 근거</strong>를 비교합니다. 이 활동만으로 학습 능력이나 성향을 판단하지 않아요.');
  html = html.replaceAll('진단 시작하기', '자기점검 시작하기');
  html = html.replace('id="profileTag">진단 결과', 'id="profileTag">나의 학습 기록');
  html = html.replace('<p class="profile-headline" id="profileHeadline"></p>', '<p class="profile-headline" id="profileHeadline"></p>\n        <p class="report-note">이 기록은 이번 문항에서의 답과 자신감을 보여 줍니다. 문항 수와 배운 내용에 따라 달라질 수 있으며, 학생의 능력이나 성향을 판정하지 않습니다.</p>');
  html = html.replace('확신과 실제의 어긋남', '자신감별로 얼마나 맞혔을까?');
  html = html.replace('가로는 스스로 매긴 확신, 세로는 그 확신으로 답한 문항의 실제 정답률입니다. 점이 회색 기준선 <strong>아래</strong>에 있으면 그만큼 자신을 크게 본 것입니다.', '가로는 표시한 자신감, 세로는 해당 문항의 정답률입니다. 점을 누르면 문항 수가 나옵니다. 문항이 적은 구간은 한 문제로도 크게 달라질 수 있어요.');
  html = html.replace('맞힐 때와 틀릴 때의 확신 차이', '맞힌 문제와 틀린 문제의 자신감');
  html = html.replace('두 막대가 벌어져 있을수록 스스로 알고 모름을 잘 가려낸다는 뜻입니다. 붙어 있으면 자기 점검이 작동하지 않고 있습니다.', '이번에 맞힌 문제와 틀린 문제에서 표시한 평균 자신감입니다. 한쪽 문항이 없으면 둘의 차이를 비교할 수 없어요.');
  html = html.replace('>상담</h3>', '>함께 돌아볼 점</h3>');
  html = html.replace('>앞으로 2주 동안 할 일</h3>', '>다음 공부에서 해 볼 일</h3>');
  html = html.replace('>문항별 기록</h3>', '>문제와 해설 다시 보기</h3>');
  html = html.replace('<div class="panel-head">\n          <h3 class="panel-title">문제와 해설 다시 보기</h3>', '<div class="panel-head">\n          <h3 class="panel-title">문제와 해설 다시 보기</h3>');
  html = html.replace('<div id="itemTableHolder" hidden></div>', '<p class="review-help">자신 있었던 오답, 자신 없었던 정답부터 볼 수 있어요. 문제를 펼쳐 처음 고른 이유와 정답의 근거를 비교해 보세요.</p>\n        <div class="review-filters" id="reviewFilters" role="group" aria-label="복습할 문제 고르기" hidden></div>\n        <div id="itemTableHolder" hidden></div>');
  html = html.replace('>처음부터 다시 하기</button>', '>같은 문제 다시 풀기</button>');
  html = html.replace('href="styles.css"', 'href="styles.css?v=20260930-reflection"');
  html = html.replaceAll('v=20260918-quiz', 'v=20260930-reflection');
  html = html.replace('src="metrics.js"', 'src="metrics.js?v=20260930-reflection"');
  html = html.replace('src="app.js"', 'src="app.js?v=20260930-reflection"');
  html = html.replace(/metacog-g(\d)-v1/g, 'metacog-g$1-v2');
  if (filename === 'index.html') {
    const from = html.indexOf('      <h2 class="panel-title">시작하기 전에</h2>');
    const to = html.indexOf('\n    </section>', from);
    const links = Array.from({length: 7}, (_, i) => {
      const grade = i + 3; return '<a href="grade' + grade + '.html">' + (grade <= 6 ? '초' + grade : '중' + (grade - 6)) + '</a>';
    }).join('\n          ');
    html = html.slice(0, from) + `      <h1 class="panel-title">내 답, 얼마나 확실할까?</h1>
      <p class="intro-purpose">문제를 풀며 자신감도 표시해 보세요. 끝나면 내 답과 해설을 비교하고, 다시 볼 문제를 찾습니다.</p>
      <div class="grade-picker">
        <h2 class="panel-title">먼저 학년을 골라 주세요</h2>
        <p class="grade-picker-label">학년별 16문항 · 10분 안팎 · 이전 학년까지의 학습 내용을 바탕으로 구성했습니다.</p>
        <nav class="grade-picker-links" aria-label="학년별 자기점검">
          ${links}
        </nav>
      </div>
      <p class="report-note">이번 풀이를 돌아보는 활동입니다. 학생의 능력이나 성향을 판정하는 검사가 아닙니다.</p>
      <details class="common-set" id="commonSet">
        <summary>공통 문제로 풀기 <span>초5~중1 대상 · 24문항 · 15~20분</span></summary>
        <ol class="intro-steps">
          <li>답을 고른 뒤 <strong>지금 얼마나 자신 있는지</strong> 표시해 주세요.</li>
          <li>정답과 해설은 <strong>모두 푼 뒤</strong> 확인합니다.</li>
          <li>자신감은 지금 느낌 그대로 골라 주세요. 어떤 표시를 골라도 괜찮아요.</li>
        </ol>
        <p class="intro-meta">같은 기기에서는 중간에 나갔다가 이어서 풀 수 있어요.</p>
        <button class="primary-btn" id="startBtn" type="button">자기점검 시작하기</button>
        <p class="restore-note" id="restoreNote" hidden></p>
      </details>` + html.slice(to);
  }
  put(name, html);
}

replace('index.html', '<strong>간이 진단</strong><small>(Quick Check)</small>', '<strong>학습 자기점검</strong><small>(Self Check)</small>');

// Correct wording without changing any answer index or item kind; historical answer keys remain compatible.
replace(dir + 'items-grade3.js', '420은 백의 자리가 4라서 402, 410보다 크고, 399는 백의 자리가 3이라 400도 안 되는 수입니다.', '420, 402, 410은 백의 자리가 모두 4이므로 십의 자리를 비교합니다. 십의 자리가 2인 420이 가장 큽니다. 399는 백의 자리가 3이라 나머지 세 수보다 작습니다.');
replace(dir + 'items-grade9.js', '["아이스크림이 상어를 부른다", "더운 날씨가 둘 다의 원인", "상어 공격이 판매를 늘린다", "둘은 전혀 관계없다"]', '["아이스크림이 상어 공격을 일으킨다", "더운 날씨가 둘 다에 영향을 줄 수 있다", "상어 공격이 아이스크림 판매를 늘린다", "둘 사이에는 아무 관계도 있을 수 없다"]');
replace(dir + 'items-grade9.js', '더운 날씨에는 아이스크림도 많이 팔리고, 사람들이 바다에 많이 들어가 상어를 만날 일도 늘어납니다. 날씨라는 숨은 요인이 둘 다에 영향을 준 것입니다.', '함께 늘어났다는 자료만으로 원인을 확정할 수 없습니다. 더운 날씨가 아이스크림 판매와 바다에 들어가는 사람 수 모두에 영향을 주었을 가능성은 있습니다. 실제 원인은 다른 자료로 더 확인해야 합니다.');
replace(dir + 'items.js', '얼면서 부피가 늘어 물보다 가벼워지기 때문', '같은 부피의 물보다 얼음의 질량이 작기 때문');
replace(dir + 'items-grade3.js', '얼음은 물보다 가벼워서 물 위에 뜹니다.', '같은 크기(부피)로 비교하면 얼음은 물보다 가벼워 물 위에 뜹니다.');
replace(dir + 'items-grade4.js', '밑줄 친 낱말의 뜻이 나머지 셋과 다른 것은?', '다음 문장에서 ‘눈’의 뜻이 나머지 셋과 다른 것은?');
replace(dir + 'items-grade6.js', '밑줄 친 ‘그것’이 가리키는 것은?', '‘그것’이 가리키는 것은?');
for (const file of ['items.js', ...Array.from({length: 7}, (_, i) => 'items-grade' + (i + 3) + '.js')]) {
  let text = read(dir + file);
  text = text.replaceAll('sub: "틀릴 리 없음"', 'sub: "아주 자신 있음"');
  put(dir + file, text);
}

// UI: factual summaries, usable review questions, no diagnostic colour ranking.
const appName = dir + 'app.js';
let app = read(appName).replace('"metacog-v2"', '"metacog-v3"');
app = app.replace('메타인지 진단 — 화면 흐름과 리포트 렌더링', '학습 자기점검 — 화면 흐름과 복습 기록');
app = app.replace('      button.addEventListener("click", () => {\n        response.choice = originalIndex;', '      button.addEventListener("click", () => {\n        recordTime();\n        if (response.choice !== originalIndex) response.confidence = null;\n        response.choice = originalIndex;');
app = app.replace('      button.addEventListener("click", () => {\n        response.confidence = level.value;', '      button.addEventListener("click", () => {\n        recordTime();\n        response.confidence = level.value;');
app = app.replace('이상적인 상태(확신 = 정답률)', '비교선(자신감 = 정답률)');
const start = app.indexOf('    const card = el("profileCard");');
const end = app.indexOf('    const statRow = el("statRow");', start);
app = app.slice(0, start) + `    el("profileName").textContent = profile.name;
    el("profileHeadline").textContent = profile.headline;
    const tiles = [
      { label: "이번 정답률", value: formatPct(metrics.accuracy), note: metrics.n + "문항 중 " + Math.round(metrics.accuracy * metrics.n) + "개 정답", tone: "neutral" },
      { label: "표시한 평균 자신감", value: formatPct(metrics.confidence), note: "이번 문항에 표시한 값의 평균", tone: "neutral" },
      { label: "자신 있었던 오답", value: metrics.highConfErrors.length + "개", note: "자신감 75% 또는 100% · 근거 다시 보기", tone: "neutral" },
      { label: "자신 없었던 정답", value: metrics.lowConfHits.length + "개", note: "자신감 25% 또는 50% · 맞힌 이유 보기", tone: "neutral" }
    ];
` + app.slice(end);
app = app.replace('      node.setAttribute("data-severity", String(entry.severity));\n', '');
app = app.replace('특별히 걸리는 신호가 없습니다. 아래 실행 계획대로 유지하세요.', '문제 하나를 골라 내 생각과 해설을 비교해 보세요.');
const tableStart = app.indexOf('  function renderItemTable(metrics) {');
const tableEnd = app.indexOf('  /* ── 저장', tableStart);
app = app.slice(0, tableStart) + `  function renderItemTable(metrics) {
    const holder = el("itemTableHolder");
    const filters = el("reviewFilters");
    holder.innerHTML = "";
    filters.innerHTML = "";
    const rows = state.itemOrder.map(index => metrics.graded.find(row => row.id === items[index].id)).filter(Boolean);
    const options = [
      { key: "all", label: "전체", match: () => true },
      { key: "confident-wrong", label: "자신 있었던 오답", match: row => !row.correct && row.confidence >= 75 },
      { key: "unsure-correct", label: "자신 없었던 정답", match: row => row.correct && row.confidence <= 50 },
      { key: "wrong", label: "모든 오답", match: row => !row.correct }
    ];
    rows.forEach((row, index) => {
      const item = items.find(entry => entry.id === row.id);
      const card = document.createElement("details");
      card.className = "review-item";
      card.dataset.itemId = item.id;
      const heading = document.createElement("summary");
      heading.textContent = (index + 1) + "번 · " + item.domain + " · " + (row.correct ? "정답" : "오답") + " · 자신감 " + row.confidence + "%";
      const prompt = document.createElement("p");
      prompt.className = "review-prompt";
      prompt.textContent = item.prompt;
      const chosen = document.createElement("p");
      chosen.textContent = "내 답: " + item.choices[row.choice];
      const answer = document.createElement("p");
      answer.className = "review-answer";
      answer.textContent = "정답: " + item.choices[item.answer];
      const explanation = document.createElement("p");
      explanation.className = "review-explanation";
      explanation.textContent = item.explain;
      const reflection = document.createElement("p");
      reflection.className = "review-reflection";
      reflection.textContent = "생각해 보기: 처음에 이 답을 고른 이유는 무엇인가요? 해설을 읽고 어떤 근거를 확인했나요?";
      card.append(heading, prompt, chosen, answer, explanation, reflection);
      holder.appendChild(card);
    });
    const empty = document.createElement("p");
    empty.className = "review-empty";
    empty.textContent = "이번 풀이에는 이 조건에 해당하는 문항이 없어요. 다른 묶음을 골라 보세요.";
    empty.hidden = true;
    holder.appendChild(empty);
    options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-btn small";
      button.dataset.filter = option.key;
      button.textContent = option.label + " (" + rows.filter(option.match).length + ")";
      button.setAttribute("aria-pressed", String(option.key === "all"));
      button.addEventListener("click", () => {
        filters.querySelectorAll("button").forEach(node => node.setAttribute("aria-pressed", String(node === button)));
        holder.querySelectorAll(".review-item").forEach((node, index) => { node.hidden = !option.match(rows[index]); });
        empty.hidden = rows.some(option.match);
      });
      filters.appendChild(button);
    });
  }

` + app.slice(tableEnd);
app = app.replace('    const tableHolder = clone.querySelector("#itemTableHolder");', '    clone.querySelector("#reviewFilters")?.remove();\n    clone.querySelectorAll(".review-item").forEach(node => { node.hidden = false; node.open = true; });\n    clone.querySelector(".review-empty")?.remove();\n    const tableHolder = clone.querySelector("#itemTableHolder");');
app = app.replace('    holder.hidden = !holder.hidden;', '    holder.hidden = !holder.hidden;\n    el("reviewFilters").hidden = holder.hidden;');
app = app.replace('    state.analysis = null;\n    clearProgress();', '    state.analysis = null;\n    state.shownAt = 0;\n    clearProgress();');
app = app.replace('    renderItemTable(metrics);', '    renderItemTable(metrics);\n    el("itemTableHolder").hidden = false;\n    el("reviewFilters").hidden = false;\n    el("toggleTableBtn").textContent = "접기";\n    el("toggleTableBtn").setAttribute("aria-expanded", "true");');
app = app.replace('진단 시작하기', '자기점검 시작하기');
app = app.replace('        const note = el("restoreNote");', '        const common = el("commonSet");\n        if (common) common.open = true;\n        const note = el("restoreNote");');
app = app.replaceAll('간이 진단 결과', '학습 자기점검 기록');
app = app.replace('  .profile-headline,.counsel-action,.plan-list,.exp-cell{color:#374151}', '  .profile-headline,.counsel-action,.plan-list,.exp-cell,.review-help,.review-item p,.report-note{color:#374151}\n  .review-item{background:#fff;border-color:#d1d5db;break-inside:avoid}\n  .review-reflection{background:#f3f4f6}\n  .review-filters{display:none}');
app = app.replace('.profile-card[data-risk="high"]{border-left-color:var(--wrong-red)}\n.profile-card[data-risk="mid"]{border-left-color:var(--accent-gold)}\n.profile-card[data-risk="low"]{border-left-color:var(--correct-green)}\n', '');
app = app.replace('font-family:Pretendard,-apple-system,"Segoe UI",Roboto,sans-serif;word-break:keep-all}', 'font-family:Pretendard,-apple-system,"Segoe UI",Roboto,sans-serif;word-break:keep-all}\n[hidden]{display:none!important}\n.review-item{border:1px solid var(--panel-border);border-radius:12px;padding:16px;margin:12px 0}\n.review-item p{margin:10px 0}.review-prompt{white-space:pre-line;font-weight:600}\n.review-item summary{font-weight:700}.report-note{color:var(--text-muted);margin-top:12px}');
put(appName, app);

let styles = read(dir + 'styles.css');
styles = styles.replaceAll('--text-dim: #64748b;', '--text-dim: #a3afc2;');
styles = styles.replace(/\.profile-card\[data-risk[^\n]+\n/g, '').replace(/\.counsel-card\[data-severity[^\n]+\n/g, '');
styles += `
/* Self-check entry and question-based review */
[hidden] { display: none !important; }
.intro-purpose { color: #dbe3ee; margin-bottom: 18px; }
.grade-picker { margin: 18px 0; }
.grade-picker-label { line-height: 1.7; }
.grade-picker-links a { min-height: 48px; min-width: 64px; font-size: 16px; }
.report-note, .review-help { color: var(--text-muted); font-size: 14px; line-height: 1.7; margin-top: 12px; }
.common-set { border-top: 1px solid var(--panel-border); margin-top: 20px; padding-top: 14px; }
.common-set summary { cursor: pointer; padding: 10px 0; font-weight: 600; }
.common-set summary span { display: block; color: var(--text-muted); font-size: 13px; font-weight: 400; margin: 5px 0 0 18px; }
.review-filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
.review-filters [aria-pressed="true"] { border-color: var(--accent-cyan); background: rgba(6,182,212,.12); }
.review-item { border: 1px solid var(--panel-border); border-radius: 14px; padding: 0 16px; margin: 10px 0; }
.review-item summary { padding: 16px 0; cursor: pointer; font-size: 14px; font-weight: 600; }
.review-item p { margin: 12px 0; font-size: 14px; }
.review-prompt { white-space: pre-line; font-weight: 600; color: var(--text-main); }
.review-answer { font-weight: 700; }
.review-explanation { color: #dbe3ee; }
.review-reflection { padding: 12px; background: rgba(6,182,212,.08); border-radius: 10px; color: var(--text-muted); }
:focus-visible { outline: 3px solid var(--accent-gold); outline-offset: 3px; }
`;
put(dir + 'styles.css', styles);

// Accept new versions while retaining old, identical answer keys for saved/in-flight attempts.
replace('game-hub-server/metacognition.js', '  ITEM_SET_REGISTRY["metacog-v2"] = METACOG_ITEMS;', '  // 2026-09-30: wording/report revision only; all old answer indices and kinds are unchanged.\n  ITEM_SET_REGISTRY["metacog-v2"] = METACOG_ITEMS;\n  ITEM_SET_REGISTRY["metacog-v3"] = METACOG_ITEMS;');
replace('game-hub-server/metacognition.js', '        ITEM_SET_REGISTRY[version] = items;', '        ITEM_SET_REGISTRY[version] = items;\n        ITEM_SET_REGISTRY[version.replace(/-v1$/, "-v2")] = items;');
replace('game-hub-server/metacognition.js', '// 과신이 큰 순서 — 상담이 가장 급한 학생이 위로 온다', '// 학번순으로 표시한다. 응답 수치로 학생의 상담 우선순위를 판단하지 않는다.');
replace('game-hub-server/metacognition.js', '.sort((a, b) => Number(b.bias) - Number(a.bias))', '.sort((a, b) => String(a.student_number ?? "").localeCompare(String(b.student_number ?? ""), "ko", { numeric: true }))');
// Historical categories are retained in raw exports, not presented as current learner types.
replace('game-hub-server/metacognition.js', '        counts[row.profile_key] = (counts[row.profile_key] || 0) + 1;', '        const key = row.profile_key === MetacogMetrics.REPORT_KEY ? MetacogMetrics.REPORT_KEY : "legacy";\n        counts[key] = (counts[key] || 0) + 1;');
replace('game-hub-server/metacognition.js', '            profileKey: row.profile_key', '            profileKey: row.profile_key === MetacogMetrics.REPORT_KEY ? MetacogMetrics.REPORT_KEY : null');

// Check every edit before writing any file.
for (const [name, text] of changes) {
  if (!text.trim()) throw new Error('Empty edit: ' + name);
}
for (const [name, text] of changes) fs.writeFileSync(path.join(root, name), text, 'utf8');
console.log('Updated ' + changes.size + ' files.');
