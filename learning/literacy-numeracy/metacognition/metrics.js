/*
 * 메타인지 캘리브레이션 지표 산출 엔진
 *
 * 입력: responses = [{ id, choice, confidence, ms }]
 *       items     = METACOG_ITEMS
 * 출력: 지표 묶음 + 이번 풀이에 한정한 복습 안내
 *
 * 브라우저와 Node 양쪽에서 그대로 돌아간다(테스트용).
 */

(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.MetacogMetrics = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const CONFIDENCE_BINS = [25, 50, 75, 100];
  // An explicit "I don't know" response, distinct from an unanswered question (null).
  const UNKNOWN_CHOICE = -1;

  function mean(values) {
    if (!values.length) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function median(values) {
    if (!values.length) return null;
    const sorted = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  }

  function round(value, digits) {
    if (value === null || value === undefined || Number.isNaN(value)) return null;
    const factor = Math.pow(10, digits === undefined ? 3 : digits);
    return Math.round(value * factor) / factor;
  }

  /** 응답을 문항과 맞춰 채점한다. 미응답 문항은 제외한다. */
  function grade(responses, items) {
    const itemById = new Map(items.map((item) => [item.id, item]));
    return responses
      .filter((response) => itemById.has(response.id))
      .filter((response) => response.choice === UNKNOWN_CHOICE && response.confidence === null ||
        Number.isInteger(response.choice) && response.choice >= 0 &&
        response.choice < itemById.get(response.id).choices.length && CONFIDENCE_BINS.includes(response.confidence))
      .map((response) => {
        const item = itemById.get(response.id);
        return {
          id: item.id,
          domain: item.domain,
          kind: item.kind,
          choice: response.choice,
          unknown: response.choice === UNKNOWN_CHOICE,
          correct: response.choice === item.answer,
          tookLure: response.choice === item.lure,
          confidence: response.confidence,
          conf: response.choice === UNKNOWN_CHOICE ? null : response.confidence / 100,
          ms: Number.isFinite(response.ms) ? response.ms : null
        };
      });
  }

  /** 확신도 구간별 실제 정답률 — 캘리브레이션 곡선의 원자료 */
  function calibrationCurve(graded) {
    return CONFIDENCE_BINS.map((bin) => {
      const inBin = graded.filter((row) => row.confidence === bin);
      return {
        confidence: bin,
        count: inBin.length,
        accuracy: inBin.length ? inBin.filter((row) => row.correct).length / inBin.length : null,
        gap: inBin.length ? bin / 100 - inBin.filter((row) => row.correct).length / inBin.length : null
      };
    });
  }

  function subgroupBias(graded, predicate) {
    const rows = graded.filter(row => !row.unknown).filter(predicate);
    if (!rows.length) return null;
    const accuracy = rows.filter((row) => row.correct).length / rows.length;
    const confidence = mean(rows.map((row) => row.conf));
    return { n: rows.length, accuracy, confidence, bias: confidence - accuracy };
  }

  function compute(responses, items) {
    const graded = grade(responses, items);
    const n = graded.length;
    if (!n) return null;

    const answeredRows = graded.filter(row => !row.unknown);
    const unknownRows = graded.filter(row => row.unknown);
    const answeredN = answeredRows.length;
    const correctRows = answeredRows.filter((row) => row.correct);
    const wrongRows = answeredRows.filter((row) => !row.correct);

    const accuracy = correctRows.length / n;
    const answeredAccuracy = answeredN ? correctRows.length / answeredN : null;
    const confidence = mean(answeredRows.map((row) => row.conf));
    const bias = answeredN ? confidence - answeredAccuracy : null;

    const confWhenCorrect = mean(correctRows.map((row) => row.conf));
    const confWhenWrong = mean(wrongRows.map((row) => row.conf));
    const discrimination =
      confWhenCorrect !== null && confWhenWrong !== null ? confWhenCorrect - confWhenWrong : null;

    const curve = calibrationCurve(graded);
    // ECE: 구간별 |확신도 − 실제 정답률|을 문항 수로 가중 평균
    const calibrationError =
      answeredN ? curve.reduce((sum, bin) => (bin.count ? sum + bin.count * Math.abs(bin.gap) : sum), 0) / answeredN : null;
    // Brier: 낮을수록 좋음. 확신도를 확률로 본 예측 오차.
    const brier = mean(answeredRows.map((row) => Math.pow(row.conf - (row.correct ? 1 : 0), 2)));

    const highConfErrors = graded.filter((row) => !row.correct && row.confidence >= 75);
    const certainErrors = graded.filter((row) => !row.correct && row.confidence === 100);
    const lowConfHits = graded.filter((row) => row.correct && row.confidence <= 50);

    const byKind = {
      trap: subgroupBias(graded, (row) => row.kind === "trap"),
      plain: subgroupBias(graded, (row) => row.kind === "plain"),
      looksHard: subgroupBias(graded, (row) => row.kind === "looksHard")
    };
    const trapPenalty =
      byKind.trap && byKind.plain ? byKind.trap.bias - byKind.plain.bias : null;

    const domains = Array.from(new Set(graded.map((row) => row.domain))).map((domain) => {
      const stats = subgroupBias(graded, (row) => row.domain === domain);
      return Object.assign({ domain }, stats);
    });

    const timedRows = answeredRows.filter((row) => row.ms !== null);
    const pace = {
      median: median(timedRows.map((row) => row.ms)),
      medianOnHighConfErrors: median(
        timedRows.filter((row) => !row.correct && row.confidence >= 75).map((row) => row.ms)
      ),
      medianOnCorrect: median(timedRows.filter((row) => row.correct).map((row) => row.ms))
    };

    return {
      n,
      answeredN,
      unknownRows,
      unknownCount: unknownRows.length,
      wrongCount: wrongRows.length,
      answeredAccuracy,
      accuracy,
      confidence,
      bias,
      confWhenCorrect,
      confWhenWrong,
      discrimination,
      calibrationError,
      brier,
      curve,
      highConfErrors,
      certainErrors,
      lowConfHits,
      byKind,
      trapPenalty,
      domains,
      pace,
      graded,
      // 정답률이 우연(25%) 언저리면 확신도 해석 자체가 흔들린다
      lowSignal: answeredAccuracy !== null && answeredAccuracy < 0.35
    };
  }

  // This key describes the report format, not a learner category. The DB field is retained for compatibility.
  const REPORT_KEY = "reflection-v1";
  const REVIEW_PLAN = [
    "오늘: 다시 볼 문제 한 개를 골라, 처음에 그 답을 고른 이유를 한 문장으로 말하거나 적어 보세요.",
    "해설을 읽은 뒤: 놓친 조건이나 새로 알게 된 내용을 적고, 해설을 가린 채 다시 설명해 보세요.",
    "다음 공부 시간: 같은 내용을 다루는 처음 보는 문제 2~3개를 풀고, 답의 근거와 자신감을 함께 남겨 보세요.",
    "채점한 뒤: 근거가 맞았는지 확인해 보세요. 같은 문제를 다시 맞힌 횟수나 자신감 수치만으로 실력이 늘었다고 판단하지 않아요."
  ];

  function reflect(result) {
    const correctCount = result.graded.filter(row => row.correct).length;
    const wrongCount = result.wrongCount;
    const unknownCount = result.unknownCount;
    const headline = unknownCount === result.n
      ? "이번에는 모든 문항에 ‘모르겠어요’를 표시했어요. 한 문제부터 해설을 함께 읽으며 새로 알아가 보세요."
      : unknownCount > 0
        ? "이번 " + result.n + "문항: 정답 " + correctCount + "개, 오답 " + wrongCount + "개, ‘모르겠어요’ " + unknownCount + "개예요. 모른다고 표시한 문제도 함께 살펴봐요."
      : wrongCount === 0
      ? "이번 " + result.n + "문항을 모두 맞혔어요. 답의 근거를 설명해 보고, 처음 보는 문제에도 적용해 보세요."
      : correctCount === 0
        ? "이번에는 맞힌 문항이 없어요. 한 문제부터 해설을 함께 읽고, 낯선 말이나 조건을 확인해 보세요."
        : "이번 " + result.n + "문항 중 " + correctCount + "문항을 맞혔어요. 답을 고를 때의 생각과 해설을 비교해 보세요.";
    const cards = [];
    if (unknownCount) cards.push({
      tag: "새로 알아보기", title: "모른다고 표시한 문제부터 살펴봐요",
      evidence: "이번에 ‘모르겠어요’를 표시한 문항은 " + unknownCount + "개예요. 오답과 따로 기록했어요.",
      action: "한 문제를 골라 낯선 말이나 풀이 방법을 확인해 보세요. 해설을 읽거나 선생님께 물어본 뒤, 새로 알게 된 내용을 설명해 보세요."
    });
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
        unknownCount: result.unknownCount, answeredCount: result.answeredN, wrongCount: result.wrongCount,
        answeredAccuracy: round(result.answeredAccuracy),
        bias: round(result.bias), discrimination: round(result.discrimination),
        calibrationError: round(result.calibrationError), brier: round(result.brier),
        highConfErrorCount: result.highConfErrors.length, certainErrorCount: result.certainErrors.length,
        lowConfHitCount: result.lowConfHits.length, trapPenalty: round(result.trapPenalty),
        profileKey: REPORT_KEY
      }
    };
  }

  return { analyze, compute, grade, calibrationCurve, round, CONFIDENCE_BINS, UNKNOWN_CHOICE, REPORT_KEY, REVIEW_PLAN };
});
