// 한 칸짜리 덧셈·뺄셈·곱셈·나눗셈 학습지의 카드.
import { blank, equation, type RaceCard, type RaceDeck } from "../race-card-model.ts";
import { createProblemSet as addSubtract, type AdditionSubtractionVariant, type Equation } from "../race-sets/add-subtract-1.ts";
import { createProblemSet as complements } from "../race-sets/complements-1.ts";
import { createProblemSet as gradeThreeAddSubtractTwo } from "../race-sets/grade-3-add-subtract-2.ts";
import { createProblemSet as complementHundred } from "../race-sets/grade-3-complement-subtraction-100.ts";
import { createProblemSet as complementThousand } from "../race-sets/grade-3-complement-subtraction-1000.ts";
import { createProblemSet as divisionThree } from "../race-sets/grade-3-division-3.ts";
import { createProblemSet as gradeThreeMultiplicationTwo } from "../race-sets/grade-3-multiplication-2.ts";
import { createProblemSet as multiplicationOne } from "../race-sets/multiplication-1.ts";
import { createProblemSet as multiplicationTwo } from "../race-sets/multiplication-2.ts";
import { createProblemSet as multiplicationThree } from "../race-sets/multiplication-3.ts";
import { createProblemSet as multiplicationFour } from "../race-sets/multiplication-4.ts";
import { createProblemSet as nineteen } from "../race-sets/nineteen-times-table.ts";
import { createProblemSet as squares } from "../race-sets/square-numbers.ts";
import { createMultiplicationFiveProblemSet } from "../multiplication-five.ts";

function product(left: number, right: number, result: number, hidden: "factor" | "result" = "result") {
  return equation(left, "×", right, result, hidden === "factor" ? "right" : "result");
}

function fromAddSubtract(variant: AdditionSubtractionVariant): RaceDeck {
  return (seed) => {
    const set = addSubtract(seed, variant);
    return [...set.additions, ...set.subtractions, ...set.mixed].map((item: Equation) =>
      equation(item.left, item.operator, item.right, item.result, item.hidden[0]));
  };
}

type Product = { multiplicand: number; factor: number; product: number; blank?: "factor" | "result" };
function fromColumns(create: (seed: number) => { columns: Product[][] }): RaceDeck {
  return (seed) => create(seed).columns.flat().map((item) => product(item.multiplicand, item.factor, item.product, item.blank));
}

export const decks: Record<string, RaceDeck> = {
  "/arithmetic/add-subtract-1": fromAddSubtract("single-digit"),
  "/arithmetic/add-subtract-2": fromAddSubtract("two-digit"),
  "/arithmetic/add-subtract-3": fromAddSubtract("within-twenty"),
  "/arithmetic/add-subtract-4": fromAddSubtract("missing-parts"),
  "/arithmetic/grade-2-add-subtract-3": fromAddSubtract("grade-two-missing-parts"),
  "/arithmetic/complements-1": (seed) => {
    const set = complements(seed);
    return [
      ...[...set.subtractions, ...set.pairs].map((item) => equation(item.left, item.operator, item.right, item.result, item.hidden)),
      ...set.triples.map((item): RaceCard => ({ parts: [String(item.values[0]), "+", String(item.values[1]), "+", String(item.values[2]), "=", blank()], answers: { a: [String(item.result)] } })),
    ];
  },
  "/arithmetic/multiplication-1": fromColumns(multiplicationOne),
  "/arithmetic/multiplication-2": fromColumns(multiplicationTwo),
  "/arithmetic/multiplication-3": fromColumns(multiplicationThree),
  "/arithmetic/multiplication-4": fromColumns(multiplicationFour),
  "/arithmetic/multiplication-5": fromColumns(createMultiplicationFiveProblemSet),
  "/arithmetic/nineteen-times-table": (seed) => nineteen(seed).columns.flat().map((item) => product(item.left, item.right, item.product)),
  "/arithmetic/square-numbers": (seed) => squares(seed).columns.flat().map((item) => product(item.left, item.right, item.product)),
  "/arithmetic/grade-3-division-3": (seed) => divisionThree(seed).columns.flat().map((item) => equation(item.dividend, "÷", item.divisor, item.quotient, "result")),
  "/arithmetic/grade-3-multiplication-2": (seed) => gradeThreeMultiplicationTwo(seed).columns.flat().map((item) => product(item.multiplicand, item.multiplier, item.product)),
  "/arithmetic/grade-3-add-subtract-2": (seed) => {
    const set = gradeThreeAddSubtractTwo(seed);
    return [...set.additions, ...set.subtractions].map((item) => equation(item.left, item.operator, item.right, item.result, "result"));
  },
  "/arithmetic/grade-3-complement-subtraction-100": (seed) => {
    const set = complementHundred(seed);
    return [...set.leftColumn, ...set.rightColumn].map((item) => equation(item.left, "−", item.right, item.result, "result"));
  },
  "/arithmetic/grade-3-complement-subtraction-1000": (seed) => {
    const set = complementThousand(seed);
    return [...set.leftColumn, ...set.rightColumn].map((item) => equation(item.left, "−", item.right, item.result, "result"));
  },
};
