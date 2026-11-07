'use strict';
const { randomInt } = require('node:crypto');
const { BASIC, WIDE, project } = require('../learning/literacy-numeracy/math-tools/stacking-cubes/model');

const MAX_ROUND = 200;
const DEFAULT_ROUND = 6;
const views = ['top', 'front', 'right'];
const pictureKey = shape => views.map(view => project(shape, view).join('')).join('/');

// Grow a connected footprint, then assign the heights. All three silhouettes
// therefore describe a buildable object even when they admit other solutions.
function newShape(stage, rules) {
  const width = rules.size;
  const size = [3, 5, 7][stage] + randomInt(stage === 2 ? 3 : 2);
  const ceiling = stage + 2;
  const shape = Array(width * width).fill(0);
  const occupied = [];
  const frontier = new Set([Math.floor(width / 2) * (width + 1)]);
  while (occupied.length < size) {
    const cell = [...frontier][randomInt(frontier.size)];
    frontier.delete(cell);
    occupied.push(cell);
    shape[cell] = 1;
    const x = cell % width, z = Math.floor(cell / width);
    for (const [dx, dz] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      const nx = x + dx, nz = z + dz;
      if (nx >= 0 && nx < width && nz >= 0 && nz < width && !shape[nz * width + nx]) frontier.add(nz * width + nx);
    }
  }
  const [peak, ...others] = shuffle(occupied);
  shape[peak] = ceiling;
  let spare = rules.maxCubes - size - (ceiling - 1);
  for (const cell of others) {
    const extra = randomInt(Math.min(ceiling - 1, spare) + 1);
    shape[cell] += extra;
    spare -= extra;
  }
  return shape;
}

function generateRound(count, previous) {
  const used = new Set(previous.map(pictureKey));
  const questions = [];
  while (questions.length < count) {
    const stage = Math.floor(3 * questions.length / count);
    const shape = newShape(stage, stage === 2 ? WIDE : BASIC);
    const key = pictureKey(shape);
    if (used.has(key)) continue;
    used.add(key);
    questions.push(shape);
  }
  return questions;
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function drawFromBank(bank, count, previous) {
  const draw = bank.remaining.splice(0, count);
  if (draw.length < count) {
    // Finish the old cycle first. At the boundary, reserve this round's
    // already drawn items for later and prefer items absent from the last round.
    const deck = shuffle(bank.questions.slice()).filter(q => !draw.includes(q));
    const nextCycle = [...deck.filter(q => !previous.includes(q)), ...deck.filter(q => previous.includes(q)), ...shuffle(draw.slice())];
    draw.push(...nextCycle.splice(0, count - draw.length));
    bank.remaining = nextCycle;
  }
  if (draw.length > 1 && draw.length === previous.length && draw.every((q, i) => q === previous[i])) {
    [draw[0], draw[1]] = [draw[1], draw[0]];
  }
  return draw;
}

module.exports = { DEFAULT_ROUND, MAX_ROUND, generateRound, drawFromBank };
