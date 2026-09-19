const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const referenceDir = path.join(
  'references',
  'moe',
  '2022-revised-curriculum',
  'extracted',
);

const expectedFiles = [
  '01-general-curriculum.txt',
  '02-elementary-school.txt',
  '03-middle-school.txt',
  '04-high-school.txt',
  '05-korean-language.txt',
  '06-ethics.txt',
  '07-social-studies.txt',
  '08-mathematics.txt',
  '09-science.txt',
  '10-practical-arts-technology-home-economics-informatics.txt',
  '11-physical-education.txt',
  '12-music.txt',
  '13-art.txt',
  '14-english.txt',
  '15-integrated-life-subjects.txt',
  '16-second-foreign-languages.txt',
  '17-classical-chinese.txt',
  '18-middle-school-electives.txt',
  '19-high-school-liberal-arts.txt',
  '20-science-specialized.txt',
  '21-physical-education-specialized.txt',
  '22-arts-specialized.txt',
  '40-creative-experiential-activities.txt',
];

const actualFiles = fs
  .readdirSync(referenceDir)
  .filter((name) => name.endsWith('.txt'))
  .sort();

assert.deepEqual(actualFiles, expectedFiles);

for (const filename of expectedFiles) {
  const content = fs.readFileSync(path.join(referenceDir, filename), 'utf8');
  assert.ok(content.length > 1_000, `${filename} should contain extracted text`);
  assert.doesNotMatch(content, /\u0000/, `${filename} should not contain NUL bytes`);
}

const science = fs.readFileSync(path.join(referenceDir, '09-science.txt'), 'utf8');
assert.match(science, /\[6과15-03\][^\r\n]*전자석/);
assert.match(science, /전구의 직렬연결과 병렬연결은 다루지 않고/);
assert.match(science, /\[9과14-03\][^\r\n]*저항의 직렬연결과 병렬연결/);

console.log('2022 curriculum reference inventory: validated');
