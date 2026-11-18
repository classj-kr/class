"use client";

import { Fragment, useEffect, useState } from "react";
import { learningWorksheetCatalog } from "../../lib/arithmetic-worksheets";
import InlineMathText from "../components/inline-math-text";

type LearningStage = "elementary" | "middle" | "high" | "stem";
export type CatalogStage = LearningStage | "all";

const stageMeta: Record<LearningStage, { label: string; shortLabel: string }> = {
  elementary: { label: "초", shortLabel: "초" },
  middle: { label: "중", shortLabel: "중" },
  high: { label: "고", shortLabel: "고" },
  stem: { label: "이공계 기초", shortLabel: "이공계 기초" },
};

function worksheetStage(grade: string): LearningStage {
  if (grade.startsWith("초")) return "elementary";
  if (grade.startsWith("중")) return "middle";
  if (grade === "이공계 기초") return "stem";
  return "high";
}

const VALID_STAGES = new Set<CatalogStage>(["elementary", "middle", "high", "stem", "all"]);

export default function ArithmeticCatalog({ initialStage }: { initialStage: CatalogStage }) {
  const [selectedStage, setSelectedStage] = useState(initialStage);

  useEffect(() => {
    try {
      const urlStage = new URLSearchParams(window.location.search).get("stage");
      if (urlStage && VALID_STAGES.has(urlStage as CatalogStage)) {
        setSelectedStage(urlStage as CatalogStage);
        sessionStorage.setItem("arithmetic-catalog-stage", urlStage);
        return;
      }
      const saved = sessionStorage.getItem("arithmetic-catalog-stage");
      if (saved && VALID_STAGES.has(saved as CatalogStage)) {
        setSelectedStage(saved as CatalogStage);
      }
    } catch {}
  }, []);

  function handleSelectStage(stage: CatalogStage) {
    setSelectedStage(stage);
    try {
      sessionStorage.setItem("arithmetic-catalog-stage", stage);
      const url = new URL(window.location.href);
      url.searchParams.set("stage", stage);
      window.history.replaceState(null, "", url.toString());
    } catch {}
  }

  function handleCardClick(stage: LearningStage) {
    try {
      sessionStorage.setItem("arithmetic-catalog-stage", stage);
    } catch {}
  }

  const availableStages = new Set(learningWorksheetCatalog.map(({ grade }) => worksheetStage(grade)));
  const visibleWorksheets = learningWorksheetCatalog
    .map((worksheet, index) => ({ ...worksheet, index, stage: worksheetStage(worksheet.grade) }))
    .filter(({ stage }) => selectedStage === "all" || selectedStage === stage);

  function goBack() {
    window.location.assign("/");
  }

  return (
    <main className="portal-page catalog-page">
      <div className="catalog-shell">
        <header className="catalog-header">
          <button className="catalog-back" type="button" onClick={goBack} aria-label="메인 화면으로 돌아가기">←</button>
          <div className="catalog-header-copy">
            <nav className="catalog-stage-nav" aria-label="수학 과정">
                {(Object.keys(stageMeta) as LearningStage[]).map((stage) => {
                  const meta = stageMeta[stage];
                  const isAvailable = availableStages.has(stage);
                  return isAvailable
                    ? <button key={stage} className={`catalog-stage-link stage-${stage}`} type="button" aria-pressed={selectedStage === stage} aria-controls="worksheet-catalog" onClick={() => handleSelectStage(stage)}>{meta.label}</button>
                    : <span key={stage} className={`catalog-stage-link stage-${stage} is-upcoming`} aria-disabled="true">{meta.label}<small>준비 중</small></span>;
                })}
                <button className="catalog-stage-link stage-all" type="button" aria-pressed={selectedStage === "all"} aria-controls="worksheet-catalog" onClick={() => handleSelectStage("all")}>전체</button>
            </nav>
          </div>
        </header>
        <ol id="worksheet-catalog" className="worksheet-catalog" aria-label="연산 학습지 목록">
          {visibleWorksheets.map(({ route, grade, title, badges, index, stage }, visibleIndex) => {
            const previousStage = visibleIndex > 0 ? visibleWorksheets[visibleIndex - 1].stage : null;
            const content = <>
              <span className="worksheet-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="worksheet-title">
                <span className="worksheet-meta">
                  <small className="worksheet-grade">{`(${grade})`}</small>
                  {badges?.map((badge) => <span key={badge} className={`worksheet-badge worksheet-badge-${badge === "암산" ? "mental" : badge === "암기" ? "memorization" : "advanced"}`}>{badge}</span>)}
                </span>
                <strong><InlineMathText text={title} /></strong>
              </span>
              {route && <span className="worksheet-arrow" aria-hidden="true">→</span>}
            </>;
            return (
              <Fragment key={`${index}-${title}`}>
                {selectedStage === "all" && stage !== previousStage && (
                  <li className={`worksheet-stage-heading stage-${stage}`} id={`stage-${stage}`}>
                    <strong>{stageMeta[stage].shortLabel}</strong>
                  </li>
                )}
                <li>
                  {route
                    ? <a className={`worksheet-choice is-ready stage-${stage}`} href={route} data-stage={stage} data-testid="worksheet-choice" onClick={() => handleCardClick(stage)}>{content}</a>
                    : <div className={`worksheet-choice stage-${stage}`} data-stage={stage} data-testid="worksheet-choice">{content}</div>}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
