// 미리 검증해 둔 세 변형만 복원한다. 브라우저에서 검증되지 않은 난수를 새로 뽑지 않는다.
(function (root) {
  'use strict';
  const eligible = unit => Boolean(unit && unit.grade >= 1 && unit.grade <= 10 && (unit.semester === 1 || unit.semester === 2));
  // 벤 다이어그램의 mask 번호는 호출 순서마다 늘어난다. 영역 번호와 안/밖은 보존하고 호출 번호만 지운다.
  const clean = value => String(value || '').replace(/\s+/g, ' ').replace(/\s(?:id|aria-describedby)="[^"]*"/g, '')
    .replace(/(id=\\")(v[23]4)-\d+-(\d+)-(in|out)(\\")/g, '$1$2-$3-$4$5')
    .replace(/url\(#[^)]+\)/g, ref => /^url\(#v[23]4-\d+-\d+-(?:in|out)\)$/.test(ref) ? ref.replace(/(v[23]4)-\d+-/, '$1-') : 'url(#shape)').trim();
  const canonical = item => JSON.stringify([clean(item.text), clean(item.figure), (item.choice?.options || []).map(clean).sort(), clean(item.template)]);
  function fingerprint(value) {
    const text = typeof value === 'string' ? value : clean(JSON.stringify(value));
    let a = 2166136261, b = 2246822507;
    for (let i = 0; i < text.length; i++) { const c = text.charCodeAt(i); a = Math.imul(a ^ c, 16777619); b = Math.imul(b ^ c, 3266489909); }
    return (a >>> 0).toString(16).padStart(8, '0') + (b >>> 0).toString(16).padStart(8, '0');
  }
  const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sign = value => typeof value === 'number' && value < 0 ? '−' + Math.abs(value) : String(value);
  function responseOf(item) {
    if (item.choice) return item.choice.answer;
    const values = item.inputs.map(input => String(input.answer));
    if (item.negative) values[0] = '-' + values[0];
    return values;
  }
  function responseShown(item, response) {
    if (item.choice) return item.choice.options[response];
    if (item.template) return item.template.replace(/\{(\d+)\}/g, (_, at) => {
      const value = response[at], input = item.inputs[at];
      return (input.signed && Number(value) >= 0 && Number(at) > 0 ? '+' : '') + escape(sign(Number.isNaN(Number(value)) ? value : Number(value)));
    });
    if (item.fraction) {
      const parts = response.map(Number), negative = parts[0] < 0;
      return (negative ? '−' : '') + (item.mixed ? Math.abs(parts[0]) + ' ' : '') + parts.slice(-2).map(Math.abs).join('/') + (item.unit ? ' ' + escape(item.unit) : '');
    }
    return item.inputs.map((input, i) => (input.label ? input.label + ' ' : item.inputs.length > 1 ? (i + 1) + '번째 답칸: ' : '') + escape(sign(Number.isNaN(Number(response[i])) ? response[i] : Number(response[i]))) + (input.unit ? ' ' + input.unit : '')).join(', ');
  }
  // 수나 정의가 고정되어 변형이 부족한 문항은 제시한 답을 판단하는 ‘개념 확인’ 문항으로 바꾼다.
  // 보기 순서만 섞은 복제와 구분하고, 실제로 제시하는 답/조건을 바꾼다.
  function judgment(B, base, spec) {
    const response = spec.response, right = B.isCorrect(base, response);
    const proposed = responseShown(base, response);
    const pair = spec.mode === 'pair';
    const text = base.text + (pair
      ? '<br><br>지우와 서연이 이 문제를 풀었다.<br>지우의 답: <b>' + responseShown(base, spec.other) + '</b><br>서연의 답: <b>' + proposed + '</b><br>옳은 답을 정한 학생은?'
      : '<br><br>제시한 답: <b>' + proposed + '</b><br>제시한 답에 대한 판단으로 알맞은 것은?');
    const truth = pair ? [B.isCorrect(base, spec.other), right] : [right, !right];
    if (truth.filter(Boolean).length !== 1) throw new Error('판단형 문항의 정답이 하나가 아닙니다.');
    return { text, figure: base.figure, choice: { options: pair ? ['지우', '서연'] : ['문제의 답으로 알맞다.', '문제의 답으로 알맞지 않다.'], answer: truth.indexOf(true) },
      explain: (base.explain || '') + '<br>' + (pair ? '제시한 두 답을 문제의 조건에 맞추어 비교한다.' : '제시한 답은 이 문제의 답으로 ' + (right ? '알맞다.' : '알맞지 않다.')),
      facts: { truth, want: true }, hint: base.hint || '', twinKind: 'concept' };
  }
  function construct(B, unit, group, original, entry, spec, index) {
    if (!eligible(unit)) throw new Error('유사 문제 적용 대상이 아닙니다.');
    const type = group.types.find(type => type.id === original.typeId);
    if (!type) throw new Error('원문제의 유형을 찾지 못했습니다.');
    const made = spec.mode ? judgment(B, original, spec) : type.make(new B.Dice(spec.seed), entry.n);
    if (spec.render) {
      if (typeof spec.render.figure === 'string') made.figure = spec.render.figure;
      if (typeof spec.render.text === 'string') made.text = spec.render.text;
      if (spec.render.options && made.choice) made.choice = { ...made.choice, options: spec.render.options };
    }
    return Object.assign({ typeId: original.typeId, typeTitle: original.typeTitle, level: original.level, standard: original.standard, source: original.source }, made,
      { key: original.key + '~t' + (index + 1), originKey: original.key, twinNo: index + 1 });
  }
  const pending = new Map();
  async function load(unit) {
    if (!eligible(unit)) throw new Error('유사 문제 적용 대상이 아닙니다.');
    const term = unit.grade + '-' + unit.semester;
    if (!pending.has(term)) pending.set(term, fetch('twins/' + term + '.json?v=20261020-adv-1').then(response => {
      if (!response.ok) throw new Error('유사 문제를 불러오지 못했습니다.');
      return response.json();
    }).catch(error => { pending.delete(term); throw error; }));
    return pending.get(term);
  }
  async function forItem(B, unit, group, original) {
    const plan = await load(unit), entry = plan.items[unit.id + ':' + original.key];
    if (!entry || entry.variants.length !== 3 || entry.original !== fingerprint(original)) throw new Error('원문제가 변경되어 유사 문제를 다시 검증해야 합니다.');
    const seen = new Set([canonical(original)]);
    return entry.variants.map((spec, i) => {
      const item = construct(B, unit, group, original, entry, spec, i), shape = canonical(construct(B, unit, group, original, entry, { ...spec, render: undefined }, i));
      if (fingerprint(item) !== spec.fingerprint || seen.has(shape)) throw new Error('유사 문제의 검증 정보가 일치하지 않습니다.');
      seen.add(shape); return item;
    });
  }
  const api = { eligible, canonical, fingerprint, responseOf, construct, forItem };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.MathBankTwins = api;
})(typeof window !== 'undefined' ? window : globalThis);
