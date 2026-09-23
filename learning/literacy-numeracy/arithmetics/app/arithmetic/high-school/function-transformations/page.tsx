"use client";

import {
  createFunctionTransformationWorksheetSet,
  createFunctionTransformationReviewProblems,
  formatFunctionProblemLatex,
  formatLinearLatex,
  formatQuadraticLatex,
} from "../../../../lib/function-transformation-workouts";
import { createNumericChoices } from "../../../../lib/worksheet-choice-utils";
import NumericChoiceWorksheet, { type NumericWorksheetProblem } from "../components/numeric-choice-worksheet";

function adapt(problem: ReturnType<typeof createFunctionTransformationWorksheetSet>["problems"][number]): NumericWorksheetProblem {
  const answer = problem.answer;
  const polynomial = answer.type === "polynomial";
  const answers = answer.type === "polynomial" ? [...answer.coefficients] : [...answer.numerator, ...answer.denominator];
  return {
    ...problem,
    prompt: polynomial ? "합성함수를 계산하여 식을 간단히 하세요." : "역함수를 구하세요.",
    latex: formatFunctionProblemLatex(problem),
    answers,
    answerLabels: answers.map((_, index) => String(index + 1)),
    answerMode: polynomial ? "polynomial" : "rational",
  } as NumericWorksheetProblem;
}

function answerLatex(problem: NumericWorksheetProblem, values: number[]) {
  const extended = problem as NumericWorksheetProblem & { answerMode?: string };
  if (extended.answerMode === "polynomial") return formatQuadraticLatex(values as [number, number, number]);
  return `\\frac{${formatLinearLatex(values.slice(0, 2) as [number, number])}}{${formatLinearLatex(values.slice(2, 4) as [number, number])}}`;
}

function makeFunctionChoices(problem: NumericWorksheetProblem) {
  return createNumericChoices(problem.answers, problem.id);
}
export default function FunctionTransformationsPage() {
  return <NumericChoiceWorksheet
    initialSeed={20260729}
    subject="공통수학 2"
    title="합성함수와 역함수"
    instruction="합성함수를 전개하고 역함수를 계산하세요."
    createSet={(seed) => ({ seed, problems: createFunctionTransformationWorksheetSet(seed).problems.map(adapt) })}
    createReviews={(kinds, seed) => createFunctionTransformationReviewProblems(kinds as never[], seed).map(adapt)}
    formatChoice={answerLatex}
    makeChoices={makeFunctionChoices}
  />;
}
