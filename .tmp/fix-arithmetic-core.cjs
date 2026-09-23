const fs = require('node:fs');
const base = 'learning/literacy-numeracy/arithmetics/';
const read = file => fs.readFileSync(base+file,'utf8').replace(/\r\n/g,'\n');
const write = (file,text) => fs.writeFileSync(base+file,text);
let text = read('lib/middle-core-workouts.ts');
text = text.replace('  "simultaneous-special",\n  "square-roots-real",','  "simultaneous-special",\n  "linear-system-comprehensive",\n  "square-roots-real",');
text = text.replace('  structure = kind,','  structure: string = kind,');
const start=text.indexOf('function buildPrimeFactorization('), end=text.indexOf('\nfunction build(\n',start);
text=text.slice(0,start)+fs.readFileSync('.tmp/arithmetic-core-generators.txt','utf8')+text.slice(end);
text=text.replace('buildPrimeFactorization(id, index)','buildPrimeFactorization(id, index, next)').replace('buildGcdLcm(id, index)','buildGcdLcm(id, index, next)').replace('buildPolynomialAddSubtract(id, index)','buildPolynomialAddSubtract(id, index, next)');
text=text.replace('const first = 1 + (index % 7);','const first = integer(next, 1, 8);').replace('const repeat = 1 + ((index + 3) % 8);','const repeat = integer(next, 1, 8);').replace('const value = 123 + index * 11;','const value = integer(next, 101, 998);');
text=text.replace('const m = 2 + (index % 5);','const m = integer(next, 2, 8);').replace('const n = 2 + ((index + 2) % 4);','const n = integer(next, 2, 7);');
text=text.replace('const root = 2 + index;','const root = integer(next, 2, 10);').replace('const squareFree = SQUARE_FREE[index % SQUARE_FREE.length];','const squareFree = SQUARE_FREE[integer(next, 0, SQUARE_FREE.length - 1)];');
text=text.replace('const n = SQUARE_FREE[index % SQUARE_FREE.length];','const n = SQUARE_FREE[integer(next, 0, SQUARE_FREE.length - 1)];').replace('const a = 2 + (index % 5);','const a = integer(next, 2, 8);').replace('const b = 1 + ((index + 2) % 4);','const b = integer(next, 1, 7);');
text=text.replace('const a = 1 + (index % 5);','const a = integer(next, 1, 7);').replace('const b = 2 + ((index + 1) % 7);','const b = integer(next, 2, 9);');
// Keep fixed worked radical examples as at most two overlaps, while all other questions vary.
text=text.replace('if (overlap <= 1) return candidate;', 'if (overlap <= (kind === "radical-calculation" ? 2 : 1)) return candidate;');
write('lib/middle-core-workouts.ts',text);
// Count completed circle problems, not individual answer fields.
text=read('app/arithmetic/grade-6-circle/page.tsx').replace('const correct = Object.values(results).filter(Boolean).length;','const correct = problems.filter((problem) => results[problem.id + "-perimeter"] === true && results[problem.id + "-area"] === true).length;').replace('<small>/6 정답</small>','<small>/{problems.length}문제 정답</small>');
write('app/arithmetic/grade-6-circle/page.tsx',text);
// Badge metadata remains authoritative; align its actual worksheet and stale tests.
text=read('app/arithmetic/grade-3-division-3/page.tsx').replace('a4-sheet counting-sheet multiplication-sheet division-three-sheet','a4-sheet counting-sheet mental-math-sheet multiplication-sheet division-three-sheet');write('app/arithmetic/grade-3-division-3/page.tsx',text);
text=read('tests/elementary-catalog-audit.test.ts').replace('"19단", "4큰수곱셈"','"19단", "3나눗셈③", "4큰수곱셈"').replace('["6원기둥", "원기둥의 겉넓이와 부피"]','["6직육면체", "직육면체의 겉넓이·부피"]');write('tests/elementary-catalog-audit.test.ts',text);