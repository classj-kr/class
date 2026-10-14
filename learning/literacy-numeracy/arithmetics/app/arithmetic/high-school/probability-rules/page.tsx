"use client";
import GeometryChoiceWorksheet from "../components/geometry-choice-worksheet";
import { probabilityProblems } from "../../../../lib/high-school-foundation-workouts";
import { createProbabilityProblems } from "../../../../lib/foundation-generated-workouts";
export default function ProbabilityRulesPage() {
  return <GeometryChoiceWorksheet subject="확률과 통계" title="확률의 성질과 조건부확률" seed={20260819} problems={probabilityProblems} createSet={createProbabilityProblems} />;
}
