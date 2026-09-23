"use client";

import NumericChoiceWorksheet from "../../high-school/components/numeric-choice-worksheet";
import {
  createMiddleRationalMixedProblemSet,
  createMiddleRationalMixedReviewProblems,
  formatMiddleRationalMixedChoice,
  createMiddleRationalMixedChoices,
} from "../../../../lib/middle-rational-mixed";

export default function MiddleRationalMixedPage() {
  return (
    <NumericChoiceWorksheet
      initialSeed={20260726}
      subject="중1"
      title="정수와 유리수의 기초·혼합계산"
      instruction="절댓값과 대소 관계를 확인하고 계산 순서를 지켜 계산하세요."
      createSet={createMiddleRationalMixedProblemSet}
      createReviews={createMiddleRationalMixedReviewProblems}
      formatChoice={formatMiddleRationalMixedChoice}
      makeChoices={createMiddleRationalMixedChoices}
    />
  );
}
