// 글자로 풀어 쓴 분수("3분의 2", 대분수 "2와 3분의 1")를 화면에서 위아래로 쌓은 분수로 보여 준다.
// 자료는 그대로 두고 화면에 그려진 글자만 바꾼다. 읽어 주기 프로그램에는 원래 말("3분의 2")을 들려준다.
(function (root) {
  'use strict';
  const PATTERN = /(\d+)(와|과) (\d+)분의 ?(\d+)|(\d+)분의 ?(\d+)/g;
  const READING = /^\s*['’"”]?\s*(?:이)?(?:라고|처럼|으로|로)?\s*읽/;
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE', 'PRE']);
  let styled = false;
  function style() {
    if (styled || !root.document) return;
    styled = true;
    const css = document.createElement('style');
    css.textContent = [
      '.ft-frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .12em;font-size:.82em;line-height:1.08;font-variant-numeric:lining-nums tabular-nums}',
      '.ft-frac>span{display:block;padding:0 .14em;text-align:center}',
      '.ft-frac>span:first-child{border-bottom:.09em solid currentColor}',
      '.ft-mixed{display:inline-flex;align-items:center;vertical-align:middle;white-space:nowrap}',
      '.ft-mixed>.ft-whole{margin-right:.04em}',
    ].join('');
    document.head.append(css);
  }
  function frac(top, bottom) {
    const box = document.createElement('span');
    box.className = 'ft-frac';
    const a = document.createElement('span');
    a.textContent = top;
    const b = document.createElement('span');
    b.textContent = bottom;
    box.append(a, b);
    return box;
  }
  function piece(match) {
    const [text, whole, , mixedDen, mixedNum, den, num] = match;
    const wrap = document.createElement('span');
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', text);
    if (whole) {
      wrap.className = 'ft-mixed';
      const w = document.createElement('span');
      w.className = 'ft-whole';
      w.textContent = whole;
      wrap.append(w, frac(mixedNum, mixedDen));
    } else {
      wrap.className = 'ft-mixed';
      wrap.append(frac(num, den));
    }
    return wrap;
  }
  function renderText(node) {
    const text = node.nodeValue;
    PATTERN.lastIndex = 0;
    if (!PATTERN.test(text)) return;
    PATTERN.lastIndex = 0;
    // 원래 글자 마디는 앞부분을 품은 채 그 자리에 남긴다(화면 코드가 그 마디를 붙잡고 조사를 고치는 일이 있다).
    const out = document.createDocumentFragment();
    let last = 0, m, head = null;
    while ((m = PATTERN.exec(text))) {
      // "8분의 3이라고 읽습니다", "2와 3분의 1처럼 읽고"처럼 읽는 법을 가르치는 말은 글자 그대로 둔다.
      if (READING.test(text.slice(m.index + m[0].length, m.index + m[0].length + 12))) continue;
      if (head === null) head = text.slice(0, m.index);
      else if (m.index > last) out.append(text.slice(last, m.index));
      out.append(piece(m));
      last = m.index + m[0].length;
    }
    if (head === null) return; // 모두 읽는 법 문장이라 바꿀 것이 없다
    if (last < text.length) out.append(text.slice(last));
    // 부모가 flex·grid 이면 글자 조각 하나하나가 따로 칸이 되어 글이 토막 난다. 그때는 한 덩어리로 감싼다.
    const parent = node.parentElement;
    const display = parent ? getComputedStyle(parent).display : '';
    if (/flex|grid/.test(display)) {
      const holder = document.createElement('span');
      node.replaceWith(holder);
      holder.append(node);
    }
    node.nodeValue = head;
    node.after(out);
  }
  function render(el) {
    if (!el || !root.document) return;
    style();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        for (let p = n.parentElement; p && p !== el.parentElement; p = p.parentElement) {
          // 도식(SVG) 속 글자에는 HTML 을 끼울 수 없으므로 건드리지 않는다.
          if (SKIP.has(p.tagName) || p.isContentEditable || p.classList.contains('ft-mixed') || (root.SVGElement && p instanceof SVGElement)) return NodeFilter.FILTER_REJECT;
        }
        return n.nodeValue.includes('분의') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(renderText);
  }
  // 화면이 다시 그려질 때마다 새로 들어온 글자도 바꾼다.
  function watch(el) {
    if (!el || !root.MutationObserver) return;
    render(el);
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; render(el); });
    }).observe(el, { childList: true, subtree: true, characterData: true });
  }
  root.FractionText = { render, watch, PATTERN };
})(typeof window !== 'undefined' ? window : globalThis);
