const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apps/classtools', 'avatar-assignment.js'), 'utf8');
const dashboard = fs.readFileSync(path.join(root, 'apps/classtools', 'dashboard.html'), 'utf8');
const seating = fs.readFileSync(path.join(root, 'apps/classtools', 'seating.html'), 'utf8');
const context = { window: {} };
vm.createContext(context);
new vm.Script(source, { filename: 'avatar-assignment.js' }).runInContext(context);
const avatars = context.window.ClassroomAvatars;

assert.equal(avatars.avatars.length, 36, 'All 36 animal avatars must remain available.');
assert.equal(new Set(avatars.avatars.map((avatar) => avatar.icon)).size, 36,
  'Every animal icon must remain unique.');

for (const classKey of ['1', '2', '2026-school-6-2', 'another-class']) {
  const order = Array.from(avatars.getOrder(classKey));
  assert.equal(new Set(order).size, 36, `Class ${classKey} must assign each icon once.`);
  order.forEach((avatarIndex, studentIndex) => {
    assert.notEqual(avatarIndex, studentIndex,
      `Class ${classKey} must not preserve the old number-to-animal mapping.`);
  });
  assert.notEqual(avatars.getAvatarForStudent(1, classKey).icon, '🐼',
    'Student 1 must not be permanently assigned the panda.');
}

assert.deepEqual(Array.from(avatars.getOrder('same-class')), Array.from(avatars.getOrder('same-class')),
  'A class must keep the same avatar assignment across renders.');
assert.notDeepEqual(Array.from(avatars.getOrder('class-a')), Array.from(avatars.getOrder('class-b')),
  'Different classes should receive different shuffled assignments.');

for (const [name, html] of [['dashboard', dashboard], ['seating', seating]]) {
  assert.match(html, /<script src="\.\/avatar-assignment\.js"><\/script>/,
    `${name} must load the shared avatar assignment.`);
  const inline = html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
  assert.ok(inline, `${name} inline script is missing.`);
  new vm.Script(inline, { filename: `${name}.html` });
}
assert.match(dashboard, /getAvatarForStudent\(num, activeScheduleClassId/,
  'Dashboard assignments must use the active class ID.');
assert.match(seating, /getAvatarForStudent\(num, avatarClassKey\)/,
  'Seating assignments must use the same class key.');

console.log('Class avatar assignment contract: OK');
