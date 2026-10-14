"use client";

import { Fragment } from "react";
import { learningWorksheetCatalog } from "../../lib/arithmetic-worksheets";
import InlineMathText from "../components/inline-math-text";

type LearningStage = "elementary" | "middle" | "high" | "stem";

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

export default function ArithmeticCatalog() {
  const availableStages = new Set(learningWorksheetCatalog.map(({ grade }) => worksheetStage(grade)));

  function goBack() {
    window.location.assign("/");
  }

  function scrollToStage(stage: LearningStage) {
    document.getElementById(`stage-${stage}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="portal-page catalog-page">
      <div className="catalog-shell">
        <header className="catalog-header">
          <button className="catalog-back" type="button" onClick={goBack} aria-label="메인 화면으로 돌아가기">←</button>
          <div className="catalog-header-copy">
            <a className="catalog-race-link" href="/arithmetic/race">순위전 열기 <span aria-hidden="true">→</span></a>
            <nav className="catalog-stage-nav" aria-label="수학 과정">
                {(Object.keys(stageMeta) as LearningStage[]).map((stage) => {
                  const meta = stageMeta[stage];
                  const isAvailable = availableStages.has(stage);
                  return isAvailable
                    ? <button key={stage} className={`catalog-stage-link stage-${stage}`} type="button" onClick={() => scrollToStage(stage)}>{meta.label}</button>
                    : <span key={stage} className={`catalog-stage-link stage-${stage} is-upcoming`} aria-disabled="true">{meta.label}<small>준비 중</small></span>;
                })}
            </nav>
          </div>
        </header>
        <ol className="worksheet-catalog" aria-label="연산 학습지 목록">
          {learningWorksheetCatalog.map(({ route, grade, title, badge }, index) => {
            const stage = worksheetStage(grade);
            const previousStage = index > 0 ? worksheetStage(learningWorksheetCatalog[index - 1].grade) : null;
            const content = <>
              <span className="worksheet-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="worksheet-title">
                <span className="worksheet-meta">
                  <small className="worksheet-grade">{`(${grade})`}</small>
                  {badge && <span className={`worksheet-badge worksheet-badge-${badge === "암산" ? "mental" : "memorization"}`}>{badge}</span>}
                </span>
                <strong><InlineMathText text={title} /></strong>
              </span>
              {route && <span className="worksheet-arrow" aria-hidden="true">→</span>}
            </>;
            return (
              <Fragment key={`${index}-${title}`}>
                {stage !== previousStage && (
                  <li className={`worksheet-stage-heading stage-${stage}`} id={`stage-${stage}`}>
                    <strong>{stageMeta[stage].shortLabel}</strong>
                  </li>
                )}
                <li>
                  {route
                    ? <a className={`worksheet-choice is-ready stage-${stage}`} href={route} data-stage={stage} data-testid="worksheet-choice">{content}</a>
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
