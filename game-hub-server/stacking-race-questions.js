'use strict';
const { randomInt } = require('node:crypto');
const { SIZE, project } = require('../learning/inquiry/math/stacking-cubes/model');

const MAX_ROUND = 200;
const DEFAULT_ROUND = 6;
const views = ['top', 'front', 'right'];
const pictureKey = shape => views.map(view => project(shape, view).join('')).join('/');

// Grow a connected footprint, then assign the heights. All three silhouettes
// therefore describe a buildable object even when they admit other solutions.
function newShape(stage) {
  const size = [3, 5, 7][stage] + randomInt(stage === 2 ? 3 : 2);
  const ceiling = stage + 2;
  const shape = Array(SIZE * SIZE).fill(0);
  const occupied = [];
  const frontier = new Set([Math.floor(shape.length / 2)]);
  while (occupied.length < size) {
    const cell = [...frontier][randomInt(frontier.size)];
    frontier.delete(cell);
    occupied.push(cell);
    shape[cell] = 1 + randomInt(ceiling);
    const x = cell % SIZE, z = Math.floor(cell / SIZE);
    for (const [dx, dz] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      const nx = x + dx, nz = z + dz;
      if (nx >= 0 && nx < SIZE && nz >= 0 && nz < SIZE && !shape[nz * SIZE + nx]) frontier.add(nz * SIZE + nx);
    }
  }
  shape[occupied[randomInt(size)]] = ceiling;
  return shape;
}

function generateRound(count, previous) {
  const used = new Set(previous.map(pictureKey));
  const questions = [];
  while (questions.length < count) {
    const stage = Math.floor(3 * questions.length / count);
    const shape = newShape(stage);
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
