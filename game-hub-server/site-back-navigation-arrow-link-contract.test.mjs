import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const navigation = fs.readFileSync(path.join(root, "assets/site-back-navigation.js"), "utf8");
const expression = navigation.match(/const BACK_LINK_LABEL = (\/.+\/);/)?.[1];
const backLinkLabel = Function(`"use strict"; return (${expression})`)();

test("all arrow-prefixed page links are classified as legacy navigation", () => {
  for (const label of [
    "← 음악 감상",
    "← 수업 도구",
    "← 연산",
    "‹ 기초학력",
    "◀ 다른 섹션"
  ]) {
    assert.equal(backLinkLabel.test(label), true, `back link not recognized: ${label}`);
  }
});

test("ordinary content links and activity buttons are not arrow-link matches", () => {
  for (const label of ["음악 감상", "수업 도구", "차시 목록", "감상 문제"]) {
    assert.equal(backLinkLabel.test(label), false, `ordinary label classified as back link: ${label}`);
  }
  assert.match(navigation, /if \(!\(control instanceof HTMLAnchorElement\)\) return false/);
});

test("legacy back-link classes are covered even when their arrow is decorative", () => {
  const selector = navigation.match(/const LEGACY_LINK_SELECTOR = "([^"]+)";/)?.[1];
  assert.ok(selector, "LEGACY_LINK_SELECTOR is missing");
  const classes = selector.split(",").map(part => part.trim());
  for (const legacyClass of [
    "a.back", "a.back-btn", "a.back-button", "a.back-link", "a.home", "a.home-link", "a.counting-back", "a.catalog-back"
  ]) {
    assert.ok(classes.includes(legacyClass), `legacy back-link class not covered: ${legacyClass}`);
  }
  assert.match(navigation, /control\.matches\(LEGACY_LINK_SELECTOR\)/);

  // The server hides the same links before first paint; a class missing there flashes on load.
  const server = fs.readFileSync(path.join(root, "game-hub-server/server.js"), "utf8");
  const prePaint = server.match(/\.site-back-pending :is\(([^)]+)\)\{visibility:hidden!important\}/)?.[1];
  assert.ok(prePaint, "the pre-paint hide rule is missing from server.js");
  assert.deepEqual(prePaint.split(",").map(part => part.trim()).sort(), [...classes].sort());
});
