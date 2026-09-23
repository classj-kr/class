const assert = require('node:assert/strict');
const fs = require('node:fs');
const C = require('../learning/literacy-numeracy/graph-studio/graph-core');
const katex = require('../learning/literacy-numeracy/graph-studio/vendor/katex.min.js');
const html = fs.readFileSync('learning/literacy-numeracy/graph-studio/index.html', 'utf8');
for (const source of ['-x^2','(-x)^2','2^-2','x^(x+1)','sqrt(abs(x))','ln(x^2+1)','(x+1)/(x-1)','sin(pi*x)','a(x-h)^2+k']) {
  const c = C.compile(source);
  for (const params of [undefined,{a:-2,b:1,c:0,h:-3,k:2}]) {
    const output = katex.renderToString('y='+C.latex(c.ast,params), {throwOnError:true,strict:false});
    assert.match(output,/katex-mathml/);
    assert.doesNotMatch(output,/katex-error/);
  }
}
assert.equal(C.latex(C.compile('-x^2').ast),'-x^{2}');
assert.equal(C.latex(C.compile('(-x)^2').ast),'\\left(-x\\right)^{2}');
assert.equal(C.latex(C.compile('x^2^3').ast),'x^{2^{3}}');
assert.match(html, /vendor\/katex.min.css/);
assert.match(html, /vendor\/katex.min.js/);
assert.match(html, /graph-core.js/);
console.log('graph board math typography passed');

assert.equal(C.latex(C.compile('1e-8^2').ast),'\\left(1\\times 10^{-8}\\right)^{2}');
assert.throws(() => C.compile('1e999'), /너무 큽니다/);
