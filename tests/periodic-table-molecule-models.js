"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const context = { window: {} };
vm.runInNewContext(
    fs.readFileSync("learning/inquiry/periodic-table/elements-data.js", "utf8"),
    context
);
vm.runInNewContext(
    fs.readFileSync("learning/inquiry/periodic-table/molecule-models.js", "utf8"),
    context
);

const models = context.window.MOLECULE_MODELS_3D;
const compounds = context.window.COMPOUNDS_DATA;
const supportedFormulas = Object.keys(models);

assert.deepEqual(
    [...supportedFormulas].sort(),
    [
        "BF₃", "C₂H₂", "C₂H₄", "C₂H₆", "C₂H₆O", "CH₄", "CO₂",
        "CaCO₃", "H₂O", "H₂O₂", "HCHO", "HCN", "NH₃", "NaCl"
    ].sort()
);

for (const formula of supportedFormulas) {
    const model = models[formula];
    const compound = compounds.find(item => item.formula === formula);
    assert.ok(compound, `${formula}: matching compound data is required`);
    assert.ok(model.geometry, `${formula}: geometry description is required`);
    assert.ok(model.atoms.length > 0, `${formula}: atoms are required`);

    const ids = new Set();
    const composition = {};
    for (const atom of model.atoms) {
        assert.ok(!ids.has(atom.id), `${formula}: duplicate atom id ${atom.id}`);
        ids.add(atom.id);
        assert.ok(Number.isFinite(atom.x), `${formula}: atom x must be finite`);
        assert.ok(Number.isFinite(atom.y), `${formula}: atom y must be finite`);
        assert.ok(Number.isFinite(atom.z), `${formula}: atom z must be finite`);
        composition[atom.num] = (composition[atom.num] || 0) + 1;
    }

    assert.deepEqual(
        JSON.parse(JSON.stringify(composition)),
        JSON.parse(JSON.stringify(compound.elements)),
        `${formula}: 3D atom counts must match the formula`
    );

    for (const bond of model.bonds) {
        assert.ok(ids.has(bond.from), `${formula}: missing bond atom ${bond.from}`);
        assert.ok(ids.has(bond.to), `${formula}: missing bond atom ${bond.to}`);
        assert.ok(["single", "double", "triple", "ionic", "resonance"].includes(bond.type), `${formula}: invalid bond type`);
    }
}

const coreShapes = compounds.filter(item => item.labGroup === "core");
assert.deepEqual(
    JSON.parse(JSON.stringify(coreShapes.map(item => item.formula))),
    ["H₂O", "CO₂", "BF₃", "CH₄", "NH₃"],
    "the five exam-core shapes must be ordered first"
);
assert.ok(
    compounds.filter(item => item.labGroup === "frequent").length >= 5,
    "frequent exam applications are required"
);
assert.deepEqual(
    JSON.parse(JSON.stringify(compounds.filter(item => item.labGroup === "ionic").map(item => item.formula))),
    ["NaCl", "CaCO₃"],
    "only ionic crystal models belong in the ionic group"
);
assert.deepEqual(
    JSON.parse(JSON.stringify(compounds.filter(item => item.labGroup === "explore").map(item => item.formula))),
    ["H₂O₂", "C₂H₆O"],
    "covalent exploration molecules must be separate from ionic crystals"
);
assert.ok(
    compounds.filter(item => item.labGroup === "explore").every(item => models[item.formula]),
    "every exploration item needs a 3D model"
);

const appSource = fs.readFileSync("learning/inquiry/periodic-table/app.js", "utf8");
const pageSource = fs.readFileSync("learning/inquiry/periodic-table/index.html", "utf8");

assert.match(appSource, /function initLab3D\(\)/);
assert.match(appSource, /function drawMolecule3D\(\)/);
assert.match(appSource, /activePointers: new Map\(\)/);
assert.doesNotMatch(appSource, /state\.quiz\.autoTimer/);
assert.doesNotMatch(appSource, /다음 문제로 자동 이동/);
assert.match(appSource, /function getQuizExplanation\(/);
assert.match(appSource, /getElementById\('nextQuizBtn'\)\.hidden = false/);
assert.match(appSource, /querySelectorAll\('\.nav-tabs \.nav-tab\[data-tab\]'\)/);
assert.doesNotMatch(pageSource, /class="nav-tab active quiz-next-btn"/);
assert.match(pageSource, /id="shellLegend"/);
assert.match(appSource, /const shellColors = \['#4bcffa', '#a78bfa', '#fbbf24', '#fb7185'/);
assert.match(appSource, /const rotationPeriodMs = 120000/);
assert.match(appSource, /state\.bohrAnimationId = requestAnimationFrame\(drawFrame\)/);
assert.match(appSource, /cancelAnimationFrame\(state\.bohrAnimationId\)/);
assert.doesNotMatch(appSource, /state\.atomAngle \+=/);
assert.doesNotMatch(appSource, /function renderMoleculeSVG\(/);
assert.match(pageSource, /id="molecule3dCanvas"/);
assert.doesNotMatch(pageSource, /시험 범위만 한눈에/);
assert.doesNotMatch(pageSource, /class="exam-focus"/);
assert.doesNotMatch(pageSource, /1~20번 고정 출제/);
assert.doesNotMatch(pageSource, /id="modalDiscovery"/);
assert.doesNotMatch(pageSource, /id="modalNameEn"/);
assert.match(pageSource, /id="modalDesc"/);
assert.match(pageSource, /id="modalTrivia"/);
assert.match(pageSource, /id="modalUses"/);
assert.match(pageSource, /id="modalElectronConfig"/);
assert.match(pageSource, /id="modalShellCount"/);
assert.match(pageSource, /id="modalValenceElectrons"/);
assert.ok(
    pageSource.search(/src="molecule-models\.js(?:\?[^\"]*)?"/) < pageSource.search(/src="app\.js(?:\?[^\"]*)?"/),
    "3D model data must load before the app"
);

console.log(`periodic-table molecule models: ${supportedFormulas.length} validated`);
