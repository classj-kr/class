"use client";
import GeometryChoiceWorksheet from "../components/geometry-choice-worksheet";
import { createPlaneVectorProblems } from "../../../../lib/geometry-generated-workouts";
const planeVectorProblems = createPlaneVectorProblems(20260813);
export default function PlaneVectorsPage() {
  return <GeometryChoiceWorksheet title="평면벡터의 성분과 활용" seed={20260813} problems={planeVectorProblems} createSet={createPlaneVectorProblems} />;
}
