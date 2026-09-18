import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../learning/inquiry/korea-travel-map/app.js', import.meta.url), 'utf8');
const styles = fs.readFileSync(new URL('../learning/inquiry/korea-travel-map/styles.css', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../learning/inquiry/korea-travel-map/index.html', import.meta.url), 'utf8');

for (const [code, name] of [
  ['11', '서울'], ['26', '부산'], ['27', '대구'], ['28', '인천'],
  ['29', '광주'], ['30', '대전'], ['31', '울산'], ['36', '세종']
]) {
  assert.match(app, new RegExp(`\\['${code}', \\{ name: '${name}'`), `${name} needs one short metropolitan label.`);
}

assert.match(app, /label\.code === "47720" \? "27"/, 'The legacy Gunwi code must be grouped into Daegu.');
assert.match(app, /metropolitanLabels\.get\(metropolitanCode\)/);
assert.match(app, /grouped\.set\(`metropolitan-\$\{metropolitanCode\}`/);
assert.doesNotMatch(app, /seoul-\$\{label\.code\}/, 'Seoul district labels must not return.');
assert.match(styles, /\.map-admin-label--metropolitan\{[^}]*calc\(-50% - 20px\)/);
assert.match(html, /styles\.css\?v=20260918-1/);
assert.match(html, /app\.js\?v=20260918-1/);

console.log('Korea travel map metropolitan label contract passed.');
