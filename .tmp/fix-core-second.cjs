const fs=require('node:fs');const file='learning/literacy-numeracy/arithmetics/lib/middle-core-workouts.ts';let text=fs.readFileSync(file,'utf8');
text=text.replace('  if (index === 2) { exponents[0] = 2; exponents[1] = integer(next, 2, 3); }','  if (index < 5) exponents[0] = 2;\n  if (index === 2) { primes[2] = [5, 7][integer(next, 0, 1)]; exponents[1] = integer(next, 2, 3); }');
text=text.replace('const two=(x: number,xy: number,y: number) => `${x}x^2${signed(xy)}xy${signed(y)}y^2`;', 'const two=(x: number,xy: number,y: number) => [[x,"x^2"],[xy,"xy"],[y,"y^2"]].filter(([value]) => value !== 0).map(([value,symbol],i) => (i > 0 && Number(value) > 0 ? "+" : "") + coefficient(Number(value),String(symbol))).join("") || "0";');
text=text.replace(/    if \(mode === 5\) \{\n      return make\(id, kind, `2\\\\sqrt\{3\}[\s\S]*?(?=    const numerator = n \+ 1;)/, fs.readFileSync('.tmp/radical-variants.txt','utf8'));
text=text.replace('if (overlap <= (kind === "radical-calculation" ? 2 : 1)) return candidate;', 'if (overlap <= 1) return candidate;');
fs.writeFileSync(file,text);
