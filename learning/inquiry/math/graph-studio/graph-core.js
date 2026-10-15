/* Pure math and document model, shared by the board and its tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GraphCore = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  const PARAMS = ['a', 'b', 'c', 'h', 'k'];
  const DEFAULT_PARAMS = { a: 1, b: 1, c: 0, h: 0, k: 0 };
  const FUNCTIONS = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos,
    atan: Math.atan, sqrt: Math.sqrt, abs: Math.abs, exp: Math.exp, ln: Math.log,
    log: Math.log, log10: Math.log10, floor: Math.floor, ceil: Math.ceil,
    round: Math.round, sign: Math.sign, min: Math.min, max: Math.max,
  };
  const names = Object.keys(FUNCTIONS).sort((a, b) => b.length - a.length);
  const clone = value => JSON.parse(JSON.stringify(value));
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function format(value, digits = 4) {
    if (!Number.isFinite(value)) return '정의되지 않음';
    if (Math.abs(value) < 1e-10) return '0';
    if (Math.abs(value) >= 1e6 || Math.abs(value) < .0001) return value.toExponential(2);
    return String(Number(value.toFixed(digits)));
  }
  function numberLatex(value) {
    const match = String(value).match(/^(.+)e([+-]?\d+)$/);
    return match ? match[1] + '\\times 10^{' + Number(match[2]) + '}' : String(value);
  }
  function compile(source) {
    if (typeof source !== 'string' || source.length > 500) throw Error('수식은 500자 이내로 입력하세요.');
    const superDigits = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    const text = source.trim().toLowerCase().replace(/^y\s*=\s*/, '')
      .replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/')
      .replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/\*\*/g, '^')
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, s => '^(' + [...s].map(c => c === '⁻' ? '-' : superDigits.indexOf(c)).join('') + ')');
    if (!text) throw Error('수식을 입력하세요. 예: x^2');
    const tokens = [];
    for (let i = 0; i < text.length;) {
      if (/\s/.test(text[i])) { i++; continue; }
      const tail = text.slice(i);
      const num = tail.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/);
      if (num) { if (!Number.isFinite(Number(num[0]))) throw Error('숫자가 너무 큽니다.'); tokens.push({ type: 'number', value: Number(num[0]) }); i += num[0].length; }
      else {
        const name = names.find(n => tail.startsWith(n));
        if (name) { tokens.push({ type: 'function', value: name }); i += name.length; }
        else if (tail.startsWith('pi')) { tokens.push({ type: 'constant', value: 'pi' }); i += 2; }
        else if (text[i] === 'e') { tokens.push({ type: 'constant', value: 'e' }); i++; }
        else if (['x', ...PARAMS].includes(text[i])) { tokens.push({ type: 'variable', value: text[i++] }); }
        else if ('+-*/^(),'.includes(text[i])) { tokens.push({ type: text[i++] }); }
        else throw Error(`“${text[i]}”은 사용할 수 없어요. 변수는 x, a, b, c, h, k를 사용하세요.`);
      }
      if (tokens.length > 256) throw Error('수식이 너무 길어요. 나누어 입력하세요.');
    }
    tokens.push({ type: 'end' });
    let cursor = 0, depth = 0;
    const parameters = new Set();
    const peek = () => tokens[cursor].type;
    const take = type => { if (peek() === type) { cursor++; return true; } return false; };
    function primary() {
      if (++depth > 48) throw Error('괄호가 너무 깊게 중첩되어 있어요.');
      const token = tokens[cursor++];
      let node;
      if (token.type === 'number' || token.type === 'constant') node = token;
      else if (token.type === 'variable') { node = token; if (token.value !== 'x') parameters.add(token.value); }
      else if (token.type === '(') {
        if (peek() === ')') throw Error('빈 괄호 안에 수식을 입력하세요.');
        node = sum();
        if (!take(')')) throw Error('닫는 괄호가 필요합니다.');
      } else if (token.type === 'function') {
        if (!take('(')) throw Error(`${token.value}(x)처럼 괄호 안에 값을 입력하세요.`);
        const args = [sum()];
        while (take(',')) args.push(sum());
        if (!take(')')) throw Error('닫는 괄호가 필요합니다.');
        if (token.value === 'min' || token.value === 'max') {
          if (args.length < 2 || args.length > 8) throw Error('min, max에는 2~8개의 값을 입력하세요.');
        } else if (args.length !== 1) throw Error(`${token.value}에는 값 하나를 입력하세요.`);
        node = { type: 'call', name: token.value, args };
      } else throw Error(token.type === ')' ? '닫는 괄호 앞의 수식을 확인하세요.' : '숫자, x 또는 괄호 안의 수식이 필요합니다.');
      depth--;
      return node;
    }
    const binary = (op, left, right) => ({ type: 'binary', op, left, right });
    function power() { const node = primary(); return take('^') ? binary('^', node, unary()) : node; }
    function unary() {
      if (take('+')) return unary();
      if (take('-')) return { type: 'negative', child: unary() };
      return power();
    }
    function product() {
      let node = unary();
      while (true) {
        if (take('*')) node = binary('*', node, unary());
        else if (take('/')) node = binary('/', node, unary());
        else if (['number', 'constant', 'variable', 'function', '('].includes(peek())) node = binary('*', node, unary());
        else return node;
      }
    }
    function sum() {
      let node = product();
      while (peek() === '+' || peek() === '-') { const op = tokens[cursor++].type; node = binary(op, node, product()); }
      return node;
    }
    const ast = sum();
    if (peek() !== 'end') throw Error('괄호와 연산기호를 확인하세요.');
    function evaluate(x, params = DEFAULT_PARAMS) { return evaluateNode(ast, x, params); }
    return { ast, evaluate, parameters: [...parameters].sort() };
  }
  function evaluateNode(node, x, params) {
    if (node.type === 'number') return node.value;
    if (node.type === 'constant') return node.value === 'pi' ? Math.PI : Math.E;
    if (node.type === 'variable') return node.value === 'x' ? x : (params[node.value] ?? DEFAULT_PARAMS[node.value]);
    if (node.type === 'negative') return -evaluateNode(node.child, x, params);
    if (node.type === 'call') return FUNCTIONS[node.name](...node.args.map(n => evaluateNode(n, x, params)));
    const a = evaluateNode(node.left, x, params), b = evaluateNode(node.right, x, params);
    return node.op === '+' ? a + b : node.op === '-' ? a - b : node.op === '*' ? a * b : node.op === '/' ? a / b : a ** b;
  }
  function latex(node, params) {
    function render(n, parent = 0) {
      if (n.type === 'number') { const text = numberLatex(n.value); return parent >= 3 && /e/i.test(String(n.value)) ? '\\left(' + text + '\\right)' : text; }
      if (n.type === 'constant') return n.value === 'pi' ? '\\pi' : 'e';
      if (n.type === 'variable') {
        if (!params || n.value === 'x') return n.value;
        const value = params[n.value] ?? DEFAULT_PARAMS[n.value];
        return value < 0 || (parent >= 3 && /e/i.test(String(value))) ? `\\left(${numberLatex(value)}\\right)` : numberLatex(value);
      }
      if (n.type === 'call') {
        const args = n.args.map(a => render(a)).join(',');
        if (n.name === 'sqrt') return `\\sqrt{${args}}`;
        if (n.name === 'abs') return `\\left|${args}\\right|`;
        if (n.name === 'exp') return `e^{${args}}`;
        const op = n.name === 'log10' ? '\\log_{10}' : ['asin', 'acos', 'atan'].includes(n.name) ? `\\${n.name.slice(1)}^{-1}` : `\\operatorname{${n.name}}`;
        return `${op}\\left(${args}\\right)`;
      }
      if (n.type === 'negative') {
        const value = '-' + render(n.child, 3);
        return parent > 3 ? `\\left(${value}\\right)` : value;
      }
      const priority = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 4 }[n.op];
      let value;
      if (n.op === '/') value = `\\frac{${render(n.left)}}{${render(n.right)}}`;
      else if (n.op === '^') value = `${render(n.left, 5)}^{${render(n.right)}}`;
      else value = render(n.left, priority) + (n.op === '*' ? '\\cdot ' : n.op) + render(n.right, priority + (n.op === '-' ? 1 : 0));
      return priority < parent ? `\\left(${value}\\right)` : value;
    }
    return render(node);
  }
  function viewport(width, height, view) {
    const scale = Math.min(width, height) / (2 * view.range);
    return {
      width, height, scale,
      xMin: view.x - width / (2 * scale), xMax: view.x + width / (2 * scale),
      yMin: view.y - height / (2 * scale), yMax: view.y + height / (2 * scale),
      px: x => width / 2 + (x - view.x) * scale,
      py: y => height / 2 - (y - view.y) * scale,
      x: px => view.x + (px - width / 2) / scale,
      y: py => view.y - (py - height / 2) / scale,
    };
  }
  function zoomAt(view, width, height, px, py, factor) {
    const old = viewport(width, height, view), range = clamp(view.range * factor, .05, 10000);
    const next = { ...view, range }, v = viewport(width, height, next);
    next.x = clamp(view.x + old.x(px) - v.x(px), -1e7, 1e7);
    next.y = clamp(view.y + old.y(py) - v.y(py), -1e7, 1e7);
    return next;
  }
  // Adaptive segments: break at undefined values or unresolved steep jumps.
  function sample(fn, v) {
    const segments = [];
    function visit(x0, y0, x1, y1, depth) {
      const xm = (x0 + x1) / 2, ym = fn(xm);
      const finite = [y0, ym, y1].every(Number.isFinite);
      if (![y0, ym, y1].some(Number.isFinite)) return;
      if (finite && ((y0 > v.yMax && ym > v.yMax && y1 > v.yMax) || (y0 < v.yMin && ym < v.yMin && y1 < v.yMin))) return;
      const error = Math.abs(ym - (y0 + y1) / 2) * v.scale;
      const jump = Math.abs(y1 - y0) * v.scale;
      if (finite && error < 1 && jump < v.height * .7) { segments.push([x0, y0, x1, y1]); return; }
      if (depth >= 9) return;
      visit(x0, y0, xm, ym, depth + 1); visit(xm, ym, x1, y1, depth + 1);
    }
    const count = Math.ceil(v.width / 4);
    let x0 = v.xMin, y0 = fn(x0);
    for (let i = 1; i <= count; i++) {
      const x1 = v.xMin + (v.xMax - v.xMin) * i / count, y1 = fn(x1);
      visit(x0, y0, x1, y1, 0); x0 = x1; y0 = y1;
    }
    return segments;
  }
  function defaultAnalysis() { return { mode: 'none', otherId: null, tangentX: 1, from: -2, to: 2 }; }
  function initialState() {
    return { version: 1, title: '나의 그래프 수업', functions: [newFunction('a(x-h)^2+k', 'quadratic', 1)],
      activeId: 1, view: { x: 0, y: 0, range: 6 }, ghosts: [], trace: null, analysis: defaultAnalysis(), showCoordinates: true, showHandles: true };
  }
  function newFunction(expression, kind = null, id = 1) {
    return { id, expression, kind, params: { ...DEFAULT_PARAMS }, visible: true };
  }
  function validateState(input) {
    const fail = () => { throw Error('지원하지 않거나 손상된 그래프 수업 파일입니다.'); };
    const number = (value, min, max) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
    if (!input || input.version !== 1 || typeof input.title !== 'string' || input.title.length > 80) fail();
    if (!Array.isArray(input.functions) || input.functions.length < 1 || input.functions.length > 8) fail();
    function readFunction(fn) {
      if (!fn || !Number.isSafeInteger(fn.id) || fn.id < 1 || typeof fn.expression !== 'string' || fn.expression.length > 500 || typeof fn.visible !== 'boolean') fail();
      const params = {};
      for (const name of PARAMS) {
        if (!number(fn.params?.[name], -1e6, 1e6)) fail();
        params[name] = fn.params[name];
      }
      // Drag handles are available only for the exact supported templates.
      const kind = fn.expression === 'ax+b' ? 'linear' : fn.expression === 'a(x-h)^2+k' ? 'quadratic' : null;
      return { id: fn.id, expression: fn.expression, params, visible: fn.visible, kind };
    }
    const functions = input.functions.map(readFunction);
    if (new Set(functions.map(f => f.id)).size !== functions.length || !functions.some(f => f.id === input.activeId)) fail();
    if (!input.view || !number(input.view.x, -1e7, 1e7) || !number(input.view.y, -1e7, 1e7) || !number(input.view.range, .05, 10000)) fail();
    if (!Array.isArray(input.ghosts) || input.ghosts.length > 8) fail();
    if (typeof input.showCoordinates !== 'boolean' || typeof input.showHandles !== 'boolean') fail();
    const ghosts = input.ghosts.map(readFunction);
    let trace = null;
    if (input.trace !== null) {
      if (!input.trace || !functions.some(f => f.id === input.trace.id) || !number(input.trace.x, -1e8, 1e8)) fail();
      trace = { id: input.trace.id, x: input.trace.x };
    }
    const source = input.analysis ?? defaultAnalysis();
    if (!source || !['none', 'intersections', 'tangent', 'integral'].includes(source.mode) || (source.otherId !== null && !functions.some(f => f.id === source.otherId)) || !['tangentX', 'from', 'to'].every(key => number(source[key], -1e6, 1e6))) fail();
    const analysis = { mode: source.mode, otherId: source.otherId, tangentX: source.tangentX, from: source.from, to: source.to };
    return { version: 1, title: input.title, functions, activeId: input.activeId, analysis,
      view: { x: input.view.x, y: input.view.y, range: input.view.range }, ghosts, trace,
      showCoordinates: input.showCoordinates, showHandles: input.showHandles };
  }
  function dragHandle(fn, handle, x, y) {
    const p = { ...fn.params }, snap = n => clamp(Math.round(n * 10) / 10, -1e6, 1e6);
    if (fn.kind === 'linear') {
      if (handle === 'origin') p.b = snap(y);
      else if (Math.abs(x) > 1e-9) p.a = snap((y - p.b) / x);
    } else if (fn.kind === 'quadratic') {
      if (handle === 'origin') { p.h = snap(x); p.k = snap(y); }
      else if (Math.abs(x - p.h) > 1e-9) p.a = snap((y - p.k) / ((x - p.h) ** 2));
    }
    return p;
  }
  return { PARAMS, DEFAULT_PARAMS, clone, clamp, format, numberLatex, compile, latex, viewport, zoomAt, sample, defaultAnalysis, initialState, newFunction, validateState, dragHandle };
});
