"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import GeometryChoiceWorksheet from "../../high-school/components/geometry-choice-worksheet";
import {
  createStemFoundationProblems,
  isStemBridgeKind,
  STEM_FOUNDATION_TITLES,
  type StemFoundationKind,
} from "../../../../lib/stem-foundation-workouts";

const DEFAULT_KIND: StemFoundationKind = "complex-polar";
const INITIAL_SEED = 20260910;

export default function StemFoundationPage() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("kind");
  const kind = isStemBridgeKind(requested) ? requested : DEFAULT_KIND;
  const createSet = useCallback(
    (seed: number) => createStemFoundationProblems(kind, seed),
    [kind],
  );
  const initialProblems = useMemo(
    () => createStemFoundationProblems(kind, INITIAL_SEED),
    [kind],
  );

  return (
    <GeometryChoiceWorksheet
      key={kind}
      subject="이공계 기초"
      title={STEM_FOUNDATION_TITLES[kind]}
      seed={INITIAL_SEED}
      problems={initialProblems}
      createSet={createSet}
      pageClassName="stem-foundation-page"
    />
  );
}
