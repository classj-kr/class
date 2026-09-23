export type PiValue = { n: number; d: number };
export type TrigEquationProblem = { id: string; kind: string; label: string; prompt: string; latex: string; answers: PiValue[]; interval?: boolean };
function random(seed: number) {
  let value = seed >>> 0;
  return () => { value += 0x6d2b79f5; let n = value; n = Math.imul(n ^ (n >>> 15), n | 1); n ^= n + Math.imul(n ^ (n >>> 7), n | 61); return ((n ^ (n >>> 14)) >>> 0) / 4294967296; };
}
export function createTrigEquationSet(seed: number) {
  const next = random(seed);
  const pick = <T,>(values: T[]) => values[Math.floor(next() * values.length)];
  const negative = next() < 0.5;
  const angle = pick([6, 4, 3]);
  const ratio = angle === 6 ? "\\frac12" : angle === 4 ? "\\frac{\\sqrt2}{2}" : "\\frac{\\sqrt3}{2}";
  const sineAnswers = negative ? [{n: angle + 1, d: angle}, {n: 2 * angle - 1, d: angle}] : [{n: 1, d: angle}, {n: angle - 1, d: angle}];
  const tanNegative = next() < 0.5;
  const shifted = next() < 0.5;
  const factor = pick([2, 3, 4, 5]);
  const inequalityAngle = pick([6, 4, 3]);
  const inequalityRatio = inequalityAngle === 6 ? "\\frac12" : inequalityAngle === 4 ? "\\frac{\\sqrt2}{2}" : "\\frac{\\sqrt3}{2}";
  const cosine = next() < 0.5;
  const cosineAnswers = negative ? [{n:angle+2,d:2*angle},{n:3*angle-2,d:2*angle}] : [{n:angle-2,d:2*angle},{n:3*angle+2,d:2*angle}];
  const domain = ",\\qquad 0\\le x<2\\pi";
  const problems: Omit<TrigEquationProblem, "id">[] = [
    {kind:cosine ? "cosine" : "sine",label:cosine ? "코사인방정식" : "사인방정식",prompt:"주어진 구간에서 모든 해를 구하세요.",latex:`\\${cosine ? "cos" : "sin"} x=${negative ? "-" : ""}${ratio}${domain}`,answers:cosine ? cosineAnswers : sineAnswers},
    {kind:"tangent",label:"탄젠트방정식",prompt:"주어진 구간에서 모든 해를 구하세요.",latex:`\\tan x=${tanNegative ? -1 : 1}${domain}`,answers:tanNegative ? [{n:3,d:4},{n:7,d:4}] : [{n:1,d:4},{n:5,d:4}]},
    {kind:"substitution",label:"치환형",prompt:"주어진 구간에서 모든 해를 구하세요.",latex:`${2*factor}\\sin^2x${shifted ? "+" : "-"}${3*factor}\\sin x+${factor}=0${domain}`,answers:shifted ? [{n:7,d:6},{n:3,d:2},{n:11,d:6}] : [{n:1,d:6},{n:1,d:2},{n:5,d:6}]},
    {kind:"double-angle",label:"배각방정식",prompt:"주어진 구간에서 모든 해를 구하세요.",latex:`\\sin 2x=${shifted ? 1 : 0}${domain}`,answers:shifted ? [{n:1,d:4},{n:5,d:4}] : [{n:0,d:1},{n:1,d:2},{n:1,d:1},{n:3,d:2}]},
    {kind:"inequality",label:"삼각부등식",prompt:"주어진 구간에서 해가 되는 닫힌 구간의 양 끝을 구하세요.",latex:`\\sin x\\ge${inequalityRatio}${domain}`,answers:[{n:1,d:inequalityAngle},{n:inequalityAngle-1,d:inequalityAngle}],interval:true},
  ];
  return {seed,problems:problems.map((problem,index)=>({...problem,id:`trig-equation-${index}`}))};
}
export function samePiAnswers(values: {n:string;d:string}[], answers: PiValue[]) {
  return values.length===answers.length && values.every((value,index)=>/^-?\d+$/.test(value.n)&&/^\d+$/.test(value.d)&&Number(value.d)>0&&Number(value.n)*answers[index].d===answers[index].n*Number(value.d));
}
export function piLatex(value: PiValue) {
  if(value.n===0)return "0";
  const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
  const divisor=gcd(value.n,value.d), n=value.n/divisor, d=value.d/divisor;
  const numerator=n===1?"\\pi":n===-1?"-\\pi":`${n}\\pi`;
  return d===1?numerator:`\\frac{${numerator}}{${d}}`;
}