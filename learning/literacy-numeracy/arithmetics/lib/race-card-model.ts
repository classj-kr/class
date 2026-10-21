// 순위전 카드의 모양과 채점. 서버와 학생 화면이 함께 쓰므로 React나 브라우저 기능을 쓰지 않는다.

// 답 칸. id는 카드 안에서 겹치지 않게 짓는다. kind가 text면 한글 등 글자로 답한다.
export type RaceField = { blank: string; kind?: "number" | "decimal" | "text"; width?: number };
export type RaceFraction = { fraction: { whole?: RacePart; numerator: RacePart; denominator: RacePart } };
// svg: 카드 위에 그릴 그림(시계, 도형 등). 코드가 만든 SVG 문자열만 넣는다.
// group: 붙여 쓰는 조각(예: 세 자리 수 안의 숫자 빈칸).
export type RacePart = string | RaceField | RaceFraction | { svg: string } | { br: true } | { group: RacePart[] };

export type RaceCard = {
  prompt?: string;          // 문제 위에 짧게 보이는 안내(예: "몫과 나머지").
  parts: RacePart[];        // 한 줄로 이어 그릴 조각. { br: true }에서 줄을 바꾼다.
  answers: Record<string, string[]>; // 칸 id → 맞는 답들(하나만 맞아도 정답).
  choices?: string[];       // 있으면 보기 중 하나를 누른다. 정답은 answers.choice.
};

export type RaceDeck = (seed: number) => RaceCard[];

export function blank(id = "a", kind: RaceField["kind"] = "number", width?: number): RaceField {
  return width ? { blank: id, kind, width } : { blank: id, kind };
}

export function fraction(numerator: RacePart, denominator: RacePart, whole?: RacePart): RaceFraction {
  return { fraction: whole === undefined ? { numerator, denominator } : { whole, numerator, denominator } };
}

export function isField(part: RacePart): part is RaceField {
  return typeof part === "object" && "blank" in part;
}

export function cardFields(card: RaceCard): RaceField[] {
  const fields: RaceField[] = [];
  const visit = (part: RacePart | undefined) => {
    if (part === undefined || typeof part === "string") return;
    if (isField(part)) fields.push(part);
    else if ("fraction" in part) { visit(part.fraction.whole); visit(part.fraction.numerator); visit(part.fraction.denominator); }
    else if ("group" in part) part.group.forEach(visit);
  };
  card.parts.forEach(visit);
  return fields;
}

// 한 칸짜리 덧셈·곱셈 같은 식: hidden 자리만 빈칸으로 둔다.
export function equation(left: number | string, operator: string, right: number | string, result: number | string, hidden: "left" | "right" | "result"): RaceCard {
  const answer = hidden === "left" ? left : hidden === "right" ? right : result;
  const show = (value: number | string, field: typeof hidden) => hidden === field ? blank() : String(value);
  return { parts: [show(left, "left"), operator, show(right, "right"), "=", show(result, "result")], answers: { a: [String(answer)] } };
}

export function normalizeRaceAnswer(value: string) {
  return String(value ?? "").normalize("NFC").replace(/[\s,]/g, "").replace(/−/g, "-");
}

const NUMBER = /^-?(\d+\.?\d*|\.\d+)$/;

// 큰 수도 어긋나지 않게 글자로 맞춘다: 앞의 0과 소수점 뒤 끝의 0만 지운다.
function canonicalNumber(value: string) {
  const negative = value.startsWith("-");
  const [whole, decimal = ""] = value.replace(/^-/, "").split(".");
  const integer = whole.replace(/^0+(?=\d)/, "") || "0";
  const fraction = decimal.replace(/0+$/, "");
  const text = fraction ? `${integer}.${fraction}` : integer;
  return negative && text !== "0" ? `-${text}` : text;
}

function same(input: string, expected: string) {
  const a = normalizeRaceAnswer(input), b = normalizeRaceAnswer(expected);
  if (!a) return false;
  if (NUMBER.test(a) && NUMBER.test(b)) return canonicalNumber(a) === canonicalNumber(b);
  return a === b;
}

export function isRaceAnswerCorrect(card: RaceCard, values: Record<string, string>) {
  const ids = card.choices ? ["choice"] : cardFields(card).map((field) => field.blank);
  return ids.length > 0 && ids.every((id) => (card.answers[id] ?? []).some((expected) => same(values?.[id] ?? "", expected)));
}

// 틀렸을 때 보여 줄 정답 한 줄.
export function raceAnswerText(card: RaceCard) {
  if (card.choices) return card.answers.choice?.[0] ?? "";
  return cardFields(card).map((field) => card.answers[field.blank]?.[0] ?? "").join(" · ");
}
