const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../learning/literacy-numeracy/graph-studio/graph-core');
const approx = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test('natural arithmetic, implicit multiplication and mathematical power precedence', () => {
  for (const [expression, x, expected] of [
    ['-x^2', 3, -9], ['(-x)^2', 3, 9], ['2^-2', 0, .25], ['2^3^2', 0, 512],
    ['2x', 3, 6], ['2(x+1)', 3, 8], ['(x+1)(x-1)', 3, 8], ['y = x² − 2x + 1', 3, 4],
    ['x⁻²', 2, .25], ['cos(pix)', 1, -1], ['2sin(pi/2)', 0, 2], ['sqrt(abs(x))', -9, 3],
    ['min(x,2)+max(x,2)', 3, 5], ['1e-3x', 2, .002], ['ln(exp(x))', 2, 2],
  ]) approx(C.compile(expression).evaluate(x), expected);
});
test('all classroom presets compile and have expected values', () => {
  for (const [expression, x, value] of [
    ['ax+b', 2, 3], ['a(x-h)^2+k', 2, 4], ['a/x', 2, .5], ['a(x-h)^3+k', 2, 8],
    ['a(x-h)^4+k', 2, 16], ['a abs(x-h)+k', -2, 2], ['a/(x-h)+k', 2, .5],
    ['a sqrt(x-h)+k', 4, 2], ['a*2^(x-h)+k', 3, 8], ['a exp(x-h)+k', 1, Math.E],
    ['a log10(x-h)+k', 100, 2], ['a ln(x-h)+k', Math.E, 1], ['a sin(bx+h)+k', Math.PI/2, 1],
    ['a cos(bx+h)+k', 0, 1], ['a tan(bx+h)+k', 0, 0], ['asin(x)', 1, Math.PI/2],
    ['sin(x^2)', Math.sqrt(Math.PI/2), 1], ['exp(-((x-h)^2)/(2*a^2))/(a*sqrt(2*pi))', 0, 1/Math.sqrt(2*Math.PI)],
  ]) approx(C.compile(expression).evaluate(x), value);
});
test('invalid input has bounded errors and cannot execute JavaScript', () => {
  for (const expression of ['', 'x+', 'x()', 'sin()', 'sin(x', '(x+1', 'x)', 'foo(x)', 'window.alert(1)', 'x.constructor', 'Math.random()', 'x;1', 'sin(x,2)', 'min(x)', '('.repeat(70)+'x'+')'.repeat(70), 'x'.repeat(501)]) {
    assert.throws(() => C.compile(expression), Error, expression);
  }
  assert.equal(C.compile('x^2').evaluate(4), 16);
});
test('parameters are discovered per curve and never shared by mutation', () => {
  const first = C.newFunction('ax+b'), second = C.newFunction('a(x-h)^2+k', 'quadratic', 2);
  first.params.a = 4;
  assert.equal(second.params.a, 1);
  assert.deepEqual(C.compile(first.expression).parameters, ['a', 'b']);
  assert.deepEqual(C.compile(second.expression).parameters, ['a', 'h', 'k']);
  assert.equal(C.compile(first.expression).evaluate(2, first.params), 9);
  assert.equal(C.compile(second.expression).evaluate(2, second.params), 4);
});
test('linear and quadratic handles update the intended coefficients', () => {
  const parabola = C.newFunction('a(x-h)^2+k', 'quadratic');
  parabola.params = C.dragHandle(parabola, 'origin', 2, -3);
  assert.deepEqual(parabola.params, {a:1,b:1,c:0,h:2,k:-3});
  parabola.params = C.dragHandle(parabola, 'shape', 4, 5);
  assert.equal(parabola.params.a, 2);
  assert.equal(C.compile(parabola.expression).evaluate(4, parabola.params), 5);
  const line = C.newFunction('ax+b','linear');
  line.params = C.dragHandle(line, 'origin', 7, 3);
  line.params = C.dragHandle(line, 'shape', 2, -1);
  assert.equal(line.params.a, -2); assert.equal(line.params.b, 3);
  assert.deepEqual(C.dragHandle(line, 'shape', 0, 10), line.params);
});
test('viewport preserves equal axis units and cursor-centered zoom', () => {
  const view = {x:3,y:-2,range:6}, v = C.viewport(900,500,view);
  approx(v.px(2)-v.px(0), v.py(0)-v.py(2));
  approx(v.x(v.px(7)), 7); approx(v.y(v.py(-4)), -4);
  const next = C.zoomAt(view,900,500,140,320,.5), n = C.viewport(900,500,next);
  approx(n.x(140), v.x(140)); approx(n.y(320), v.y(320)); assert.equal(next.range,3);
  assert.equal(C.zoomAt(view,900,500,0,0,1e-10).range,.05);
});
test('sampling leaves gaps at poles and respects domains', () => {
  const v = C.viewport(911,577,{x:.07,y:0,range:6});
  for (const pole of [0,.13,Math.PI/2]) {
    const fn = pole === Math.PI/2 ? Math.tan : x => 1/(x-pole);
    const points = C.sample(fn,v); assert.ok(points.length > 20);
    assert.ok(points.every(([x0,,x1]) => !(x0 < pole && x1 > pole)), `crossed pole ${pole}`);
    assert.ok(points.every(segment => segment.every(Number.isFinite)));
  }
  const root = C.sample(Math.sqrt,v); assert.ok(root.length); assert.ok(root.every(([x0,,x1])=>x0>=0&&x1>=0));
  const log = C.sample(Math.log,v); assert.ok(log.every(([x0,,x1])=>x0>0&&x1>0));
  assert.deepEqual(C.sample(()=>NaN,v),[]);
});
test('lesson round trip preserves equations, coefficients, comparison, view and trace', () => {
  const state = C.initialState(); state.title='평행이동 수업'; state.ghosts=[C.clone(state.functions[0])];
  state.functions[0].params.h=3; state.view={x:1.25,y:-3,range:2.4}; state.trace={id:1,x:2};
  const restored = C.validateState(JSON.parse(JSON.stringify(state))); assert.deepEqual(restored,state);
  restored.functions[0].params.h=8; assert.equal(state.functions[0].params.h,3); assert.equal(restored.ghosts[0].params.h,0);
});
test('corrupt imports are rejected and cannot forge handle types', () => {
  for (const mutate of [s=>s.version=2,s=>s.functions=[],s=>s.view.range=0,s=>s.view.x=Infinity,s=>s.functions[0].params.a='2',s=>s.activeId=99,s=>s.ghosts=Array(9).fill(s.functions[0]),s=>s.trace={id:99,x:1},s=>s.functions.push(C.clone(s.functions[0])),s=>s.title='x'.repeat(81)]) { const state=C.initialState();mutate(state);assert.throws(()=>C.validateState(state)); }
  const state=C.initialState();state.functions[0].expression='sin(x)';state.functions[0].kind='quadratic';assert.equal(C.validateState(state).functions[0].kind,null);
});

test('small coefficients retain exact math notation and handles work at close zoom', () => {
  assert.equal(C.numberLatex(1e-8), '1\\times 10^{-8}');
  assert.equal(C.latex(C.compile('a*x').ast, {a:.123456789}), '0.123456789\\cdot x');
  const fn=C.newFunction('ax+b','linear');fn.params.b=0;
  assert.equal(C.dragHandle(fn,'shape',.01,.03).a,3);
});
