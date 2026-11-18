// 나라와 수도: 목록에서 익히기, 나라 보고 수도 고르기, 수도 보고 지도에서 나라 누르기.
// 자료는 data/capitals.json(앱 코드와 떼어 둔 파일, 짝 잇기 게임도 같은 파일을 읽는다).
const DATA_URL = new URL('./data/capitals.json?v=20261118-everyday', import.meta.url);
const FLAG = (code) => new URL(`./data/flags/${code}.webp?v=2`, import.meta.url).href;
const NONE = { type: 'FeatureCollection', features: [] };
// 지도에서 찾기를 시작할 때 화면에 들어오게 할 대륙의 범위(서경·남위는 음수). 전체는 지구 전체.
const BOUNDS = {
  asia: [[25, -11], [150, 56]],
  europe: [[-24, 35], [45, 70]],
  africa: [[-18, -35], [52, 37]],
  americas: [[-125, -56], [-34, 60]],
  oceania: [[112, -47], [180, -5]],
};
// 작은 나라(싱가포르·카타르 등)는 모양이 손가락보다 작다. 수도 점에서 이만큼(화면 픽셀) 안을 누르면 그 나라로 본다.
const TOUCH_PX = 22;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// 받침 따라 조사를 고른다(끝이 글자가 아니면 그 앞 한글로 본다. 「워싱턴 D.C.」는 받침 없음으로 둔다).
function josa(word, withFinal, without) {
  const ch = [...word].reverse().find((x) => /[가-힣]/.test(x) || /[A-Za-z0-9]/.test(x)) || '';
  const has = /[가-힣]/.test(ch) ? (ch.charCodeAt(0) - 0xac00) % 28 > 0 : /[136780LMNlmn]/.test(ch);
  return word + (has ? withFinal : without);
}
function shuffle(items) { const a = items.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function insideRing([x, y], ring) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x1, y1] = ring[j], [x2, y2] = ring[i];
    if ((y1 > y) !== (y2 > y) && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) c = !c;
  }
  return c;
}
function insideShape(pt, shape) {
  const polys = shape.type === 'Polygon' ? [shape.coordinates] : shape.coordinates;
  return polys.some((p) => insideRing(pt, p[0]) && !p.slice(1).some((h) => insideRing(pt, h)));
}

// 수도 설명 창에 넣을 글
export function capitalEntry(c) {
  const text = [];
  if (c.note) text.push(c.note);
  for (const o of c.others || []) if (!c.note?.includes(o.name)) text.push(`${o.name}: ${o.role}`);
  if (c.bigCity) text.push(`가장 큰 도시는 수도가 아닌 ${c.bigCity}다.`);
  return { where: `${c.country}의 수도`, text };
}

export function createCapitals(api) {
  const { map } = api;
  let data = null, loading = null, shapes = null;
  let continent = 'all';
  let quiz = null;
  const $ = (id) => document.getElementById(id);
  // 문제 카드에 가리지 않는 쪽으로 지도를 맞춘다(넓은 화면은 오른쪽 위, 좁은 화면은 아래에 카드가 있다).
  function pad() {
    const el = $('capitalCard');
    const h = el && !el.hidden ? el.offsetHeight : 0;
    return window.innerWidth <= 860 ? { top: 60, bottom: h + 16, left: 10, right: 10 } : { top: 60, bottom: 20, left: 20, right: 360 };
  }

  function load() {
    loading ||= fetch(DATA_URL).then((r) => { if (!r.ok) throw Error('capitals'); return r.json(); })
      .then((d) => { data = d; return d; })
      .catch((e) => { loading = null; throw e; });
    return loading;
  }
  const list = () => data.countries.filter((c) => continent === 'all' || c.continent === continent);

  // ── 지도의 「수도」 표시 ─────────────────────────────────
  function pointFeatures() {
    return data.countries.flatMap((c) => [
      { type: 'Feature', properties: { key: `capital:${c.capital}`, kind: 'capital', name: c.capital, iso: c.iso, main: true }, geometry: { type: 'Point', coordinates: [c.lon, c.lat] } },
      ...(c.others || []).map((o) => ({ type: 'Feature', properties: { key: `capital:${o.name}`, kind: 'capital', name: o.name, iso: c.iso, main: false }, geometry: { type: 'Point', coordinates: [o.lon, o.lat] } })),
    ]);
  }
  async function setShown(on) {
    if (!on) return;
    await load();
    map.getSource('capitals')?.setData({ type: 'FeatureCollection', features: pointFeatures() });
  }
  function itemFor(feature) {
    const c = data?.countries.find((x) => x.iso === feature.properties.iso);
    if (!c) return null;
    const main = feature.properties.main === true || feature.properties.main === 'true';
    const o = main ? null : c.others.find((x) => x.name === feature.properties.name);
    return {
      key: feature.properties.key, kind: 'capital', name: feature.properties.name, flag: c.flag,
      entry: main ? capitalEntry(c) : { where: `${c.country} · ${o.role}`, text: [c.note].filter(Boolean) },
    };
  }

  // ── 목록 칸(학습 목록의 「수도」 탭) ─────────────────────
  function mountPane(host) {
    host.innerHTML = `<div class="capital-continents" role="group" aria-label="대륙"></div>
      <div class="capital-modes"><button type="button" data-mode="choose">수도 고르기</button><button type="button" data-mode="find">지도에서 찾기</button></div>
      <ul class="capital-list" aria-label="나라와 수도"></ul>`;
    host.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => start(b.dataset.mode)));
    load().then(renderPane).catch(() => { host.querySelector('.capital-list').innerHTML = '<li class="capital-empty">자료를 불러오지 못했습니다.</li>'; });
  }
  function renderPane() {
    const box = document.querySelector('.capital-continents');
    if (!box) return;
    box.innerHTML = [{ id: 'all', name: '전체' }, ...data.continents].map((k) =>
      `<button type="button" data-continent="${k.id}" aria-pressed="${k.id === continent}">${esc(k.name)}</button>`).join('');
    box.querySelectorAll('button').forEach((b) => (b.onclick = () => { continent = b.dataset.continent; renderPane(); }));
    const ul = document.querySelector('.capital-list');
    ul.innerHTML = list().map((c) => `<li><button type="button" data-iso="${c.iso}"><img src="${FLAG(c.flag)}" alt="" loading="lazy"><span class="capital-country">${esc(c.country)}</span><span class="capital-name">${esc(c.capital)}</span></button></li>`).join('');
    ul.querySelectorAll('[data-iso]').forEach((b) => (b.onclick = () => showCountry(b.dataset.iso)));
  }
  async function showCountry(iso) {
    const c = data.countries.find((x) => x.iso === iso);
    api.closeCatalog();
    api.select({ key: `capital:${c.capital}`, kind: 'capital', name: c.capital, flag: c.flag, entry: capitalEntry(c) }, [c.lon, c.lat]);
    await paintCountry(c, 'learn');
    map.easeTo({ center: [c.lon, c.lat], zoom: Math.max(map.getMinZoom(), zoomFor(c)), duration: 800 });
  }

  // ── 문제에 쓰는 칠하기·수도 점 ───────────────────────────
  async function ensureLayers() {
    shapes ||= await api.loadShapes();
    if (map.getSource('capital-quiz')) return;
    map.addSource('capital-quiz', { type: 'geojson', data: NONE });
    map.addSource('capital-quiz-point', { type: 'geojson', data: NONE });
    const before = map.getLayer('labels-4') ? 'labels-4' : undefined;
    map.addLayer({ id: 'capital-quiz-fill', type: 'fill', source: 'capital-quiz', paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.42 } }, before);
    map.addLayer({ id: 'capital-quiz-line', type: 'line', source: 'capital-quiz', paint: { 'line-color': ['get', 'color'], 'line-width': 2 } }, before);
    map.addLayer({ id: 'capital-quiz-dot', type: 'circle', source: 'capital-quiz-point', paint: { 'circle-radius': 5.5, 'circle-color': '#ffffff', 'circle-stroke-color': '#c0392b', 'circle-stroke-width': 2.5 } });
    map.addLayer({
      id: 'capital-quiz-label', type: 'symbol', source: 'capital-quiz-point',
      layout: { 'text-field': ['get', 'name'], 'text-font': ['Pretendard', 'Noto Sans KR', 'sans-serif'], 'text-size': 15, 'text-anchor': 'left', 'text-offset': [0.8, 0], 'text-allow-overlap': true, 'text-ignore-placement': true },
      paint: { 'text-color': '#ffffff', 'text-halo-color': 'rgba(12, 14, 18, 0.9)', 'text-halo-width': 1.6 },
    });
  }
  const COLOR = { learn: '#ffe066', ask: '#ffe066', right: '#5be38d', wrong: '#ff6b5e' };
  async function paintCountry(c, tone, keep = []) {
    await ensureLayers();
    const shape = shapes[`country:${c.country}`];
    const features = [...keep];
    if (shape) features.push({ type: 'Feature', properties: { color: COLOR[tone] }, geometry: shape });
    map.getSource('capital-quiz').setData({ type: 'FeatureCollection', features });
    return features;
  }
  function showPoint(c) {
    map.getSource('capital-quiz-point')?.setData(c ? { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { name: c.capital }, geometry: { type: 'Point', coordinates: [c.lon, c.lat] } }] } : NONE);
  }
  function clearPaint() {
    map.getSource('capital-quiz')?.setData(NONE);
    showPoint(null);
  }
  // 나라 크기에 맞춘 배율: 모양의 경도 폭으로 어림한다.
  function zoomFor(c) {
    const shape = shapes?.[`country:${c.country}`];
    if (!shape) return 4;
    let lo = 180, hi = -180, la = 90, ha = -90;
    for (const p of shape.type === 'Polygon' ? [shape.coordinates] : shape.coordinates) for (const [x, y] of p[0]) {
      if (Math.abs(x - c.lon) > 60) continue; // 날짜 변경선 건너편 조각(러시아·피지)
      lo = Math.min(lo, x); hi = Math.max(hi, x); la = Math.min(la, y); ha = Math.max(ha, y);
    }
    const span = Math.max(hi - lo, (ha - la) * 1.3, 1);
    return Math.max(1.6, Math.min(4, Math.log2(360 / span) - 1.4));
  }

  // ── 문제 ───────────────────────────────────────────────
  function card() {
    let el = $('capitalCard');
    if (!el) {
      el = document.createElement('section');
      el.id = 'capitalCard';
      el.className = 'capital-card';
      el.setAttribute('aria-label', '나라와 수도');
      document.body.append(el);
    }
    el.hidden = false;
    document.body.classList.add('capital-quiz-on');
    return el;
  }
  async function start(mode, items) {
    await load();
    await ensureLayers();
    api.closeCatalog();
    api.clear();
    api.quietMap(mode === 'find');
    quiz = { mode, items: items || shuffle(list()), at: 0, wrong: [], firstWrong: new Set(), answered: false, continent };
    ask();
    if (mode === 'find') {
      const bounds = BOUNDS[quiz.continent];
      if (bounds) map.fitBounds(bounds, { padding: pad(), duration: 900 });
      else api.wholeGlobe();
    }
  }
  function stop() {
    quiz = null;
    clearPaint();
    const el = $('capitalCard');
    if (el) el.hidden = true;
    document.body.classList.remove('capital-quiz-on');
    api.quietMap(false, true);
    map.easeTo({ padding: { top: 0, bottom: 0, left: 0, right: 0 }, duration: 300 });
  }
  function progress() {
    return `<p class="capital-meta">${quiz.mode === 'choose' ? '수도 고르기' : '지도에서 찾기'} · ${quiz.at + 1} / ${quiz.items.length}</p><progress value="${quiz.at}" max="${quiz.items.length}"></progress>`;
  }
  function ask() {
    const c = quiz.items[quiz.at];
    quiz.answered = false;
    quiz.tries = 0;
    clearPaint();
    const el = card();
    if (quiz.mode === 'choose') {
      const options = shuffle([c.capital, ...distractors(c)]);
      el.innerHTML = `<button type="button" class="capital-close" aria-label="문제 닫기">×</button>${progress()}
        <h2 class="capital-ask"><img src="${FLAG(c.flag)}" alt=""><span>${esc(c.country)}</span></h2>
        <div class="capital-options" role="group" aria-label="수도 보기">${options.map((o, i) => `<button type="button" data-answer="${esc(o)}"><span>${i + 1}</span>${esc(o)}</button>`).join('')}</div>
        <div class="capital-feedback" aria-live="polite"></div>`;
      el.querySelectorAll('[data-answer]').forEach((b) => (b.onclick = () => choose(b)));
      paintCountry(c, 'ask');
      map.easeTo({ center: [c.lon, c.lat], zoom: Math.max(map.getMinZoom(), zoomFor(c)), padding: pad(), duration: 900 });
    } else {
      el.innerHTML = `<button type="button" class="capital-close" aria-label="문제 닫기">×</button>${progress()}
        <h2 class="capital-ask"><span>${esc(c.capital)}</span></h2>
        <p class="capital-cue">이 도시가 수도인 나라를 지도에서 누르세요.</p>
        <div class="capital-feedback" aria-live="polite"></div>`;
    }
    el.querySelector('.capital-close').onclick = stop;
  }
  // 보기: 같은 대륙 수도 셋(가까운 나라부터 섞어서), 수도로 착각하기 쉬운 가장 큰 도시가 있으면 그것 하나.
  // 수도 구실을 나눠 맡은 도시(others)는 정답이기도 해서 보기에 넣지 않는다.
  function distractors(c) {
    const others = data.countries.filter((x) => x !== c);
    const same = others.filter((x) => x.continent === c.continent);
    // 나라가 적은 대륙(오세아니아)은 다른 대륙 수도로 보기를 채운다.
    const pool = same.length >= 5 ? same : others;
    const near = pool.sort((a, b) => dist(a, c) - dist(b, c)).slice(0, 8);
    const picks = shuffle(near).slice(0, c.bigCity ? 2 : 3).map((x) => x.capital);
    if (c.bigCity) picks.push(c.bigCity);
    return picks;
  }
  const dist = (a, b) => (a.lat - b.lat) ** 2 + ((a.lon - b.lon) * Math.cos((a.lat * Math.PI) / 180)) ** 2;

  function choose(button) {
    if (quiz.answered) return;
    const c = quiz.items[quiz.at];
    const ok = button.dataset.answer === c.capital;
    quiz.answered = true;
    const el = $('capitalCard');
    el.querySelectorAll('[data-answer]').forEach((b) => {
      b.disabled = true;
      if (b.dataset.answer === c.capital) b.classList.add('correct');
    });
    if (!ok) { button.classList.add('incorrect'); miss(c); }
    paintCountry(c, ok ? 'right' : 'wrong');
    showPoint(c);
    const picked = button.dataset.answer;
    finish(ok, ok ? `${c.country}의 수도는 ${c.capital}입니다.`
      : picked === c.bigCity ? `${josa(picked, '은', '는')} ${c.country}에서 가장 큰 도시이고, 수도는 ${c.capital}입니다.`
      : `${c.country}의 수도는 ${josa(picked, '이', '가')} 아니라 ${c.capital}입니다.`);
  }
  function miss(c) {
    if (!quiz.firstWrong.has(c.iso)) { quiz.firstWrong.add(c.iso); quiz.wrong.push(c); }
  }
  function finish(ok, line) {
    const c = quiz.items[quiz.at];
    const extra = capitalEntry(c).text.filter((t) => !t.startsWith('가장 큰 도시'));
    const fb = $('capitalCard').querySelector('.capital-feedback');
    fb.innerHTML = `<p class="${ok ? 'is-right' : 'is-wrong'}"><strong>${ok ? '맞았습니다' : '틀렸습니다'}</strong> ${esc(line)}</p>${extra.map((t) => `<p>${esc(t)}</p>`).join('')}
      <button type="button" class="capital-next">${quiz.at + 1 === quiz.items.length ? '결과 보기' : '다음'}</button>`;
    const next = fb.querySelector('.capital-next');
    next.onclick = () => { quiz.at += 1; if (quiz.at >= quiz.items.length) result(); else ask(); };
    next.focus({ preventScroll: true });
  }

  // 지도에서 찾기: 누른 자리를 나라 모양에 맞춰 본다. 처리했으면 true(지도의 평소 누르기는 건너뛴다).
  function onMapClick(event) {
    if (!quiz) return false;
    if (quiz.mode !== 'find' || quiz.answered) return true;
    const c = quiz.items[quiz.at];
    const pt = event.lngLat.toArray();
    const target = shapes[`country:${c.country}`];
    const at = map.project([c.lon, c.lat]);
    const close = Math.hypot(at.x - event.point.x, at.y - event.point.y) <= TOUCH_PX;
    const ok = close || (target && insideShape(pt, target));
    const fb = $('capitalCard').querySelector('.capital-feedback');
    if (!ok) {
      const name = Object.keys(shapes).find((k) => k.startsWith('country:') && insideShape(pt, shapes[k]))?.slice(8);
      if (!name) { fb.innerHTML = '<p class="capital-hint">바다를 눌렀습니다. 다시 누르세요.</p>'; return true; }
      quiz.tries += 1;
      miss(c);
      if (quiz.tries < 2) {
        const wrongShape = shapes[`country:${name}`];
        map.getSource('capital-quiz').setData({ type: 'FeatureCollection', features: [{ type: 'Feature', properties: { color: COLOR.wrong }, geometry: wrongShape }] });
        fb.innerHTML = `<p class="is-wrong">거기는 ${esc(name)}입니다. 한 번 더 누르세요.</p>`;
        return true;
      }
      quiz.answered = true;
      const wrongShape = shapes[`country:${name}`];
      paintCountry(c, 'right', [{ type: 'Feature', properties: { color: COLOR.wrong }, geometry: wrongShape }]);
      showPoint(c);
      map.easeTo({ center: [c.lon, c.lat], padding: pad(), duration: 800 });
      finish(false, `${josa(c.capital, '은', '는')} ${c.country}의 수도입니다.`);
      return true;
    }
    quiz.answered = true;
    paintCountry(c, 'right');
    showPoint(c);
    finish(true, `${josa(c.capital, '은', '는')} ${c.country}의 수도입니다.`);
    return true;
  }

  function result() {
    clearPaint();
    const el = card();
    const right = quiz.items.length - quiz.wrong.length;
    el.innerHTML = `<button type="button" class="capital-close" aria-label="닫기">×</button>
      <p class="capital-meta">${quiz.mode === 'choose' ? '수도 고르기' : '지도에서 찾기'}</p>
      <h2 class="capital-ask"><span>처음에 맞힌 것 ${right} / ${quiz.items.length}</span></h2>
      ${quiz.wrong.length ? `<ul class="capital-wrong">${quiz.wrong.map((c) => `<li><img src="${FLAG(c.flag)}" alt="">${esc(c.country)} · <strong>${esc(c.capital)}</strong></li>`).join('')}</ul>` : ''}
      <div class="capital-result-actions">${quiz.wrong.length ? '<button type="button" class="capital-next" data-retry>틀린 것만 다시</button>' : ''}<button type="button" class="capital-again">처음부터 다시</button></div>`;
    el.querySelector('.capital-close').onclick = stop;
    const retry = el.querySelector('[data-retry]');
    if (retry) retry.onclick = () => { continent = quiz.continent; start(quiz.mode, shuffle(quiz.wrong)); };
    el.querySelector('.capital-again').onclick = () => { continent = quiz.continent; start(quiz.mode); };
  }

  // 사이트 뒤로 가기·Esc: 문제 카드를 먼저 닫는다.
  window.addEventListener('sitebackrequest', (event) => { if (!quiz && $('capitalCard')?.hidden !== false) return; event.preventDefault(); stop(); }, true);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && quiz) stop(); });

  return { mountPane, setShown, itemFor, onMapClick, active: () => Boolean(quiz), clearPaint: () => { if (!quiz) clearPaint(); } };
}
