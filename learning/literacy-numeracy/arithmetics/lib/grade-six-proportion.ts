export type ProportionProblem = { id: string; prompt: string; answer: string; guide: string };

function random(seed: number) { let value = seed >>> 0; return () => { value += 0x6d2b79f5; let next = value; next = Math.imul(next ^ (next >>> 15), next | 1); next ^= next + Math.imul(next ^ (next >>> 7), next | 61); return ((next ^ (next >>> 14)) >>> 0) / 4294967296; }; }
function integer(next: () => number, min: number, max: number) { return min + Math.floor(next() * (max - min + 1)); }
function gcd(a: number, b: number): number { while (b) [a, b] = [b, a % b]; return a; }
function simplify(a: number, b: number) { const d = gcd(a, b); return `${a / d} : ${b / d}`; }

export function normalizeProportionAnswer(answer: string) {
  return answer.trim().replace(/\s*,\s*|\s+/g, ",");
}
export function createGradeSixProportionSet(seed: number): ProportionProblem[] {
  const next = random(seed);
  const pair = () => {
    let first = integer(next, 3, 9);
    let second = integer(next, 3, 9);
    while (first === second || gcd(first, second) !== 1) {
      first = integer(next, 3, 9);
      second = integer(next, 3, 9);
    }
    return [first, second] as const;
  };
  const scalePair = () => {
    const choices: Array<readonly [number, number]> = [[3, 4], [4, 5], [4, 7], [5, 7]];
    return choices[Math.floor(next() * choices.length)];
  };

  const [ratioA, ratioB] = pair();
  const [leftScale1, rightScale1] = scalePair();
  const [ratioC, ratioD] = pair();
  const [leftScale2, rightScale2] = scalePair();
  const [ratioE, ratioF] = pair();
  const [leftScale3, rightScale3] = scalePair();
  const [allocationA, allocationB] = pair();
  const allocationTotal = integer(next, 8, 16) * (allocationA + allocationB);
  const allocationLeft = allocationTotal / (allocationA + allocationB) * allocationA;
  const allocationRight = allocationTotal / (allocationA + allocationB) * allocationB;
  const [differenceA, differenceB] = pair();
  const smallPart = Math.min(differenceA, differenceB);
  const largePart = Math.max(differenceA, differenceB);
  const differenceUnit = integer(next, 4, 12);
  const difference = (largePart - smallPart) * differenceUnit;
  const smaller = smallPart * differenceUnit;
  const larger = largePart * differenceUnit;
  const tripleChoices: Array<readonly [number, number, number]> = [[2, 3, 5], [3, 4, 6], [3, 5, 7], [4, 5, 6]];
  const [tripleA, tripleB, tripleC] = tripleChoices[Math.floor(next() * tripleChoices.length)];
  const tripleUnit = integer(next, 5, 12);
  const tripleTotal = (tripleA + tripleB + tripleC) * tripleUnit;

  return [
    { id: "proportion-1", prompt: `${ratioA * leftScale1} : ${ratioB * leftScale1} = □ : ${ratioB * rightScale1}`, answer: String(ratioA * rightScale1), guide: "빈칸에 들어갈 수" },
    { id: "proportion-2", prompt: `${ratioC * leftScale2} : ${ratioD * leftScale2} = ${ratioC * rightScale2} : □`, answer: String(ratioD * rightScale2), guide: "빈칸에 들어갈 수" },
    { id: "proportion-3", prompt: `□ : ${ratioF * leftScale3} = ${ratioE * rightScale3} : ${ratioF * rightScale3}`, answer: String(ratioE * leftScale3), guide: "빈칸에 들어갈 수" },
    { id: "proportion-4", prompt: `${allocationTotal}을 ${allocationA} : ${allocationB}로 비례배분한 두 수`, answer: `${allocationLeft}, ${allocationRight}`, guide: "앞, 뒤 순서" },
    { id: "proportion-5", prompt: `두 수의 비가 ${smallPart} : ${largePart}이고 차가 ${difference}일 때, 작은 수와 큰 수`, answer: `${smaller}, ${larger}`, guide: "작은 수, 큰 수 순서" },
    { id: "proportion-6", prompt: `${tripleTotal}을 ${tripleA} : ${tripleB} : ${tripleC}으로 비례배분한 세 수`, answer: `${tripleA * tripleUnit}, ${tripleB * tripleUnit}, ${tripleC * tripleUnit}`, guide: "앞, 가운데, 뒤 순서" },
  ];
}
