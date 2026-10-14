const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const support = fs.readFileSync(path.join(root, 'apps/site/support.html'), 'utf8');
const policy = fs.readFileSync(path.join(root, 'apps/site/privacy.html'), 'utf8');
const admin = fs.readFileSync(path.join(root, 'apps/admin', 'privacy.html'), 'utf8');
const platform = fs.readFileSync(path.join(root, 'game-hub-server', 'classroom-platform.js'), 'utf8');

for (const [name, html] of [['support', support], ['admin privacy', admin]]) {
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, `${name} script is missing.`);
  new vm.Script(script, { filename: `${name}.html` });
}

assert.match(support, /option value="guardian">법정대리인 동의 확인·철회/,
  'The request form must offer a guardian consent and withdrawal category.');
assert.match(support, /학생과의 관계 및 요청자 본인을 확인/,
  'The guardian workflow must explain relationship and identity checks.');
assert.match(support, /비밀번호나 전체 주민등록번호|비밀번호 또는 전체 주민등록번호/,
  'The guardian workflow must warn against sending authentication or resident-registration data.');
assert.match(admin, /guardian:'법정대리인 동의 확인·철회'/,
  'Administrators must see a clear label for guardian requests.');
assert.match(platform, /'birthday', 'guardian', 'technical'/,
  'The database and API must accept guardian requests.');
assert.match(platform, /DROP CONSTRAINT IF EXISTS privacy_requests_category_check/,
  'Existing databases must migrate the privacy request category constraint.');
assert.match(policy, /필요한 확인이 끝나기 전에는 공개하지 않습니다/,
  'Optional child data must remain private until the stated check is complete.');
assert.match(policy, /동의를 철회하면 해당 선택 정보의 공개를 중지/,
  'The policy must explain the effect of withdrawing guardian consent.');
assert.match(policy, /개인정보 보호책임자\(직책\):<\/strong> 서비스 운영 책임자/,
  'The policy must identify the privacy officer role and the actual request channel.');

console.log('Guardian privacy workflow contract: OK');
