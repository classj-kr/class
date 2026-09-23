import assert from "node:assert/strict";
import test from "node:test";
import katex from "katex";
import { createMiddleCoreProblemSet, createFreshMiddleCoreProblemSet, MIDDLE_CORE_KINDS, isMiddleCoreKind } from "../lib/middle-core-workouts.ts";
import { middleSchoolWorksheetCatalog } from "../lib/arithmetic-worksheets.ts";
import { createMiddleRationalMixedProblemSet, createMiddleRationalMixedChoices, formatMiddleRationalMixedChoice } from "../lib/middle-rational-mixed.ts";
import { uniqueFormattedChoices } from "../lib/worksheet-choice-utils.ts";
import { createArcLengthProblems } from "../lib/arc-length-surface-area-workouts.ts";
import { createTrigEquationSet, piLatex, samePiAnswers } from "../lib/trigonometric-equation-workouts.ts";
import { createGradeSixCircleSet } from "../lib/grade-six-circle.ts";

const mathOptions = { throwOnError: true, strict: false } as const;
test("catalog core routes never fall back to a different unit", () => {
  for (const item of middleSchoolWorksheetCatalog.filter(item => item.route?.includes("core-calculations"))) {
    assert.ok(item.route);
    assert.ok(isMiddleCoreKind(new URL(item.route, "http://localhost").searchParams.get("kind")), item.route);
  }
});
test("every core unit can replace the previous worksheet with at most one repeated problem", () => {
  for (const kind of MIDDLE_CORE_KINDS) for (let seed = 1; seed <= 20; seed++) {
    const old = createMiddleCoreProblemSet(kind, seed).problems;
    const fresh = createFreshMiddleCoreProblemSet(kind, seed + 1, old).problems;
    const keys = new Set(old.map(p => p.latex + "|" + p.answerLatex));
    assert.ok(fresh.filter(p => keys.has(p.latex + "|" + p.answerLatex)).length <= 1, kind);
  }
});
test("core problems and answers render as valid math without escaped control characters", () => {
  for (const kind of MIDDLE_CORE_KINDS) for (let seed = 1; seed <= 12; seed++) {
    for (const p of createMiddleCoreProblemSet(kind, seed).problems) for (const latex of [p.latex, p.answerLatex, ...p.distractors]) {
      assert.doesNotMatch(latex, /[\x00-\x08\x0b\x0c\x0e-\x1f\t]/, kind);
      assert.doesNotThrow(() => katex.renderToString(latex, mathOptions), `${kind}: ${latex}`);
    }
  }
});
test("prime decomposition answers multiply back to the original integer", () => {
  for (let seed = 1; seed <= 100; seed++) for (const p of createMiddleCoreProblemSet("prime-factorization", seed).problems.slice(0,5)) {
    const value=p.answerLatex.split("\\times").reduce((product, term)=>{const match=/^(\d+)(?:\^\{(\d+)\})?$/.exec(term);assert.ok(match,term);return product*Number(match[1])**Number(match[2]??1);},1);
    assert.equal(value, Number(p.latex));
    if(p.structure==="factor-large") assert.ok(value>=100&&value<=999);
    if(p.structure==="factor-four-digit") assert.ok(value>=1000&&value<=9999);
  }
});
test("rational answer choices have finite, different values and exactly one correct answer", () => {
  for (let seed=1; seed<=100; seed++) for (const p of createMiddleRationalMixedProblemSet(seed).problems) {
    const choices=createMiddleRationalMixedChoices(p);
    assert.equal(choices.filter(c=>c.correct).length,1);
    assert.equal(new Set(choices.map(c=>formatMiddleRationalMixedChoice(p,c.values))).size,choices.length);
    if(p.kind!=="fraction-comparison") assert.ok(choices.every(c=>c.values[1]!==0&&Number.isFinite(c.values[0]/c.values[1])));
  }
});
test("format-equivalent choices retain the correct choice even when a wrong one occurs first", () => {
  const result=uniqueFormattedChoices([{id:"wrong",latex:"0",correct:false},{id:"correct",latex:" 0 ",correct:true},{id:"other",latex:"1",correct:false}]);
  assert.equal(result.length,2);assert.equal(result.find(c=>c.correct)?.id,"correct");
  assert.equal(piLatex({n:0,d:3}),piLatex({n:0,d:2}));
  assert.equal(piLatex({n:2,d:4}),piLatex({n:1,d:2}));
  assert.equal(samePiAnswers([{n:"0",d:"0"}],[{n:0,d:1}]),false);
});
function scalar(latex:string): number {
  const fraction=/^\\frac\{([^{}]+)\}\{(\d+)\}$/.exec(latex);
  if(fraction)return scalar(fraction[1])/Number(fraction[2]);
  const radical=/^(\d+)\\sqrt\{(\d+)\}$/.exec(latex);
  if(radical)return Number(radical[1])*Math.sqrt(Number(radical[2]));
  const pi=/^(\d+)\\pi$/.exec(latex);
  return pi?Number(pi[1])*Math.PI:Number(latex);
}
test("randomized arc lengths agree with direct geometry and numerical integration", () => {
  const signatures=new Set<string>();
  for(let seed=1;seed<=30;seed++) {
    const problems=createArcLengthProblems(seed); signatures.add(problems.map(p=>p.latex).join("|"));
    for(const [i,p] of problems.entries()) {
      const bound=Number(/x\\le(\d+)$/.exec(p.latex)?.[1]);let expected=0;
      if(i===0)expected=Math.hypot(bound,3*bound/4);
      if(i===1){const slope=Number(/^y=(\d+)x/.exec(p.latex)?.[1]);expected=Math.hypot(bound,slope*bound);}
      if(i===2){const steps=4000,dx=bound/steps;for(let j=0;j<steps;j++)expected+=Math.sqrt(1+(j+.5)*dx)*dx;}
      if(i===3)expected=Number(/^x=(\d+)/.exec(p.latex)?.[1])*Math.PI/2;
      assert.ok(Math.abs(scalar(p.correctLatex)-expected)<1e-4,p.latex);
      assert.ok(p.choices.filter(c=>!c.correct).every(c=>Math.abs(scalar(c.latex)-expected)>1e-3));
    }
  }
  assert.ok(signatures.size>20);
});
test("trigonometric roots satisfy the displayed equations across random seeds", () => {
  const signatures=new Set<string>();
  for(let seed=1;seed<=100;seed++) for(const p of createTrigEquationSet(seed).problems) {
    signatures.add(p.latex);katex.renderToString(p.latex,mathOptions);
    const xs=p.answers.map(v=>v.n/v.d*Math.PI);
    assert.ok(xs.every(x=>x>=0&&x<2*Math.PI));assert.equal(new Set(xs).size,xs.length);
    const ratio=p.latex.includes("sqrt2")?Math.SQRT1_2:p.latex.includes("sqrt3")?Math.sqrt(3)/2:.5;
    for(const x of xs) {
      if(p.kind==="sine"||p.kind==="cosine")assert.ok(Math.abs((p.kind==="sine"?Math.sin(x):Math.cos(x))-(p.latex.includes("=-")?-ratio:ratio))<1e-10);
      if(p.kind==="tangent")assert.ok(Math.abs(Math.tan(x)-(p.latex.includes("=-")?-1:1))<1e-10);
      if(p.kind==="double-angle")assert.ok(Math.abs(Math.sin(2*x)-(p.latex.includes("=1,")?1:0))<1e-10);
      if(p.kind==="substitution"){const m=/^(\d+)\\sin\^2x([+-])(\d+)\\sin x\+(\d+)=/.exec(p.latex);assert.ok(m);assert.ok(Math.abs(Number(m[1])*Math.sin(x)**2+(m[2]==="+"?1:-1)*Number(m[3])*Math.sin(x)+Number(m[4]))<1e-10);}
      if(p.interval)assert.ok(Math.abs(Math.sin(x)-ratio)<1e-10);
    }
    if(p.interval)assert.ok(Math.sin((xs[0]+xs[1])/2)>=ratio);
  }
  assert.ok(signatures.size>25);
});
test("the square cutout stays strictly inside its circle", () => {
  for(let seed=0;seed<300;seed++)for(const p of createGradeSixCircleSet(seed))if(p.kind==="circle-square-hole")assert.ok(p.dimensions.squareSide/Math.sqrt(2)<p.dimensions.radius);
});
