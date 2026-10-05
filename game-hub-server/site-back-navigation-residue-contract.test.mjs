import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const navigation = fs.readFileSync(path.join(root, "assets/site-back-navigation.js"), "utf8");
const humanBodyHub = fs.readFileSync(path.join(root, "learning/inquiry/human-body/index.html"), "utf8");
const expression = navigation.match(/const LEGACY_LABEL = (\/.+\/i);/)?.[1];
const legacyLabel = Function(`"use strict"; return (${expression})`)();
// The observer must watch at least these attributes; the list may grow.
const observedAttributes = JSON.parse(navigation.match(/attributeFilter: (\[[^\]]*\])/)?.[1] || "[]");

test("section-specific legacy navigation labels are recognized", () => {
  for (const label of [
    "← 학습 홈",
    "학습 홈",
    "‹ 기초학력",
    "← 연산",
    "← 메인",
    "← 메인 페이지로 돌아가기",
    "← 학생 화면",
    "RETURN TO LOBBY",
    "로비로 돌아가기",
    "게임 대기실로 돌아가기"
  ]) {
    assert.equal(legacyLabel.test(label), true, `legacy control not recognized: ${label}`);
  }
});

test("in-activity navigation controls remain available", () => {
  for (const label of ["← 차시 목록", "← 자습 목록", "새 문제", "다시 풀기"]) {
    assert.equal(legacyLabel.test(label), false, `activity control was classified as legacy: ${label}`);
  }
});

test("client-rendered legacy navigation is observed and hidden", () => {
  assert.match(navigation, /new MutationObserver/);
  assert.match(navigation, /mutation\.addedNodes/);
  for (const attribute of ["aria-label", "hidden"]) {
    assert.ok(observedAttributes.includes(attribute), `legacy observer must watch ${attribute}`);
  }
  assert.match(navigation, /\[data-site-back-legacy\]\{display:none!important\}/);
});

test("top rows collapse when legacy navigation is their only content", () => {
  assert.match(navigation, /hasMeaningfulContainerContent/);
  assert.match(navigation, /container\.toggleAttribute\("data-site-back-empty"/);
  assert.match(navigation, /\[data-site-back-empty\]\{display:none!important\}/);
  assert.match(navigation, /characterData: true/);
  // Page CSS can empty a top row without the hidden attribute, so class and style count too.
  for (const attribute of ["aria-label", "hidden", "class", "style"]) {
    assert.ok(observedAttributes.includes(attribute), `top-row collapse must re-check on ${attribute} changes`);
  }
});

test("the human body hub marks its decorative back link as legacy", () => {
  assert.match(humanBodyHub, /class="floating-back-btn back-link"/);
});
