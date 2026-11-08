// 교과 단어 5-2 낱말 장면. 장면은 칸(beat)마다 하나씩 열리고, 칸마다 짧은 한 줄을 붙인다.
// SVG 안에는 짧은 이름표만 쓰고 문장은 칸 글(beats)로 뺀다.
// 클래스 b1~b5: 그 칸부터 나타남, h1~h5: 그 칸부터 사라짐. 움직임은 장면마다 .sc-<id> 아래에 적는다.
(function (root) {
  'use strict';

  const SKIN = '#f3cfae';
  const INK = '#24413c';

  // 아이 한 명. mood: 'smile' | 'flat' | 'frown' | 'talk'
  function kid(x, y, shirt, { hair = '#3b2f2a', mood = 'smile', cls = '', flip = false, mic = false } = {}) {
    const mouth = {
      smile: `<path d="M-6 6 Q0 12 6 6" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
      flat: `<path d="M-5 8 H5" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
      frown: `<path d="M-6 10 Q0 4 6 10" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
      talk: `<ellipse cx="0" cy="8" rx="4" ry="3.4" fill="${INK}"/>`
    }[mood];
    return `<g class="${cls}" transform="translate(${x} ${y})${flip ? ' scale(-1 1)' : ''}">
      <path d="M-22 70 Q-22 30 0 30 Q22 30 22 70 Z" fill="${shirt}"/>
      <circle cx="0" cy="0" r="22" fill="${SKIN}"/>
      <path d="M-22 -2 Q-20 -26 0 -24 Q22 -26 22 -2 Q14 -14 0 -14 Q-12 -14 -22 -2 Z" fill="${hair}"/>
      <circle cx="-8" cy="-1" r="2.6" fill="${INK}"/><circle cx="8" cy="-1" r="2.6" fill="${INK}"/>
      ${mouth}
      ${mic ? `<g transform="translate(22 34) rotate(-20)"><rect x="-3" y="0" width="6" height="22" rx="3" fill="#56605e"/><circle cx="0" cy="-2" r="7" fill="#8b9593"/></g>` : ''}
    </g>`;
  }

  // 말풍선. tail: 'l' | 'r' | 'd' (꼬리 방향)
  function bubble(x, y, w, h, label, { cls = '', fill = '#ffffff', stroke = '#9fb8b0', tail = 'd', size = 17, color = INK } = {}) {
    const tails = {
      d: `<path d="M${w / 2 - 10} ${h - 1} L${w / 2} ${h + 14} L${w / 2 + 10} ${h - 1}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`,
      l: `<path d="M18 ${h - 1} L6 ${h + 14} L32 ${h - 1}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`,
      r: `<path d="M${w - 32} ${h - 1} L${w - 6} ${h + 14} L${w - 18} ${h - 1}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`
    };
    return `<g class="${cls}" transform="translate(${x} ${y})">
      ${tails[tail] || ''}
      <rect width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      ${tails[tail] ? `<rect x="${(tail === 'd' ? w / 2 : tail === 'l' ? 19 : w - 31) - 9}" y="${h - 4}" width="18" height="5" fill="${fill}"/>` : ''}
      <text x="${w / 2}" y="${h / 2 + size * 0.36}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${color}">${label}</text>
    </g>`;
  }

  const floor = `<rect x="0" y="0" width="640" height="360" fill="#f4f8f2"/><rect x="0" y="282" width="640" height="78" fill="#e3ece1"/>`;
  const svg = (id, body, style = '') => `<svg viewBox="0 0 640 360" class="sc-${id}" role="img" xmlns="http://www.w3.org/2000/svg"><style>${style}</style>${floor}${body}</svg>`;

  const scenes = {};
  const put = (key, beats, markup) => { scenes[key] = { beats, svg: markup }; };

  // 토의 — 답이 정해지지 않은 문제 → 저마다 생각 → 함께 하나로
  put('5-2/국어/4/토의', [
    '답이 하나로 정해지지 않은 문제가 생겼다.',
    '여러 사람이 저마다 생각을 꺼낸다.',
    '생각을 모아 함께 가장 좋은 방법을 찾는다.',
    '이렇게 여럿이 방법을 찾는 말하기가 토의다.'
  ], svg('toui', `
    <g class="b1"><rect x="230" y="22" width="180" height="50" rx="10" fill="#22594f"/><text x="320" y="54" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">교실을 깨끗이?</text></g>
    <ellipse cx="320" cy="300" rx="190" ry="26" fill="#d6c3a2"/>
    ${kid(170, 220, '#e07a5f')}${kid(270, 236, '#3d85c6', { hair: '#5a3d2b' })}${kid(370, 236, '#f2b134')}${kid(470, 220, '#6aa84f', { hair: '#2d2d2d' })}
    ${bubble(60, 86, 140, 44, '당번 정하기', { cls: 'b2 h3', tail: 'r', size: 16 })}
    ${bubble(168, 140, 150, 44, '쓰레기통 옮기기', { cls: 'b2 h3', tail: 'r', size: 15 })}
    ${bubble(322, 140, 150, 44, '청소 시간 늘리기', { cls: 'b2 h3', tail: 'l', size: 15 })}
    ${bubble(440, 86, 140, 44, '자리 정리 표', { cls: 'b2 h3', tail: 'l', size: 16 })}
    <g class="b3 merge"><rect x="210" y="104" width="220" height="86" rx="16" fill="#fff7d6" stroke="#d9a520" stroke-width="3"/>
      <text x="320" y="138" text-anchor="middle" font-size="18" font-weight="800" fill="${INK}">우리 반 방법</text>
      <text x="320" y="166" text-anchor="middle" font-size="15" fill="${INK}">당번 + 자리 정리 표</text></g>
    <g class="b4"><rect x="250" y="314" width="140" height="36" rx="18" fill="#22594f"/><text x="320" y="338" text-anchor="middle" font-size="19" font-weight="800" fill="#fff">토의</text></g>`,
    ''));

  // 갈등 — 바라는 것이 다름 → 부딪침 → 칡과 등나무처럼 얽힘
  put('5-2/국어/4/갈등', [
    '두 사람이 바라는 것이 서로 다르다.',
    '바라는 것이 부딪쳐 사이가 나빠진다.',
    '칡과 등나무가 서로 감겨 풀기 어렵듯이',
    '이렇게 얽혀 부딪치는 일이 갈등이다.'
  ], svg('galdeung', `
    <g class="h3">
      <rect x="40" y="120" width="190" height="162" rx="8" fill="#fde9d9"/><rect x="410" y="120" width="190" height="162" rx="8" fill="#dfe9f6"/>
      <rect x="315" y="110" width="10" height="172" fill="#b9a68a"/>
      ${kid(135, 212, '#e07a5f', { mood: 'smile', cls: 'h2' })}${kid(135, 212, '#e07a5f', { mood: 'frown', cls: 'b2' })}
      ${kid(505, 212, '#3d85c6', { hair: '#5a3d2b', mood: 'smile', cls: 'h2' })}${kid(505, 212, '#3d85c6', { hair: '#5a3d2b', mood: 'frown', cls: 'b2' })}
      ${bubble(70, 50, 150, 48, '♪ 연주할래', { cls: 'b1 push-l', tail: 'r' })}
      ${bubble(420, 50, 150, 48, '조용히 쉴래', { cls: 'b1 push-r', tail: 'l' })}
      <path class="b2 zap" d="M300 40 L330 70 L312 76 L346 112 L318 88 L334 82 Z" fill="#e8b023" stroke="#b07d00" stroke-width="2"/>
    </g>
    <g class="b3">
      <path class="vine v1" d="M240 300 C200 250 290 230 260 180 C230 130 320 110 300 60" fill="none" stroke="#7a9a3a" stroke-width="9" stroke-linecap="round"/>
      <path class="vine v2" d="M280 300 C330 250 230 230 270 180 C310 130 220 110 250 60" fill="none" stroke="#8e6bb5" stroke-width="9" stroke-linecap="round"/>
      <text x="200" y="330" font-size="18" font-weight="800" fill="#5c7a22">칡 葛</text>
      <text x="300" y="330" font-size="18" font-weight="800" fill="#6b4c94">등나무 藤</text>
      <g transform="translate(400 120)"><text x="0" y="40" font-size="56" font-weight="800" fill="${INK}" font-family="KleeHanja, Batang, serif">葛藤</text><text x="10" y="80" font-size="22" font-weight="700" fill="#506761">갈 등</text></g>
    </g>
    <g class="b4"><rect x="420" y="236" width="140" height="40" rx="20" fill="#22594f"/><text x="490" y="263" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">갈등</text></g>`,
    `.sc-galdeung .vine{stroke-dasharray:320;stroke-dashoffset:320;transition:stroke-dashoffset 1.6s ease}
     .on3 .sc-galdeung .vine{stroke-dashoffset:0}.on3 .sc-galdeung .v2{transition-delay:.35s}
     .sc-galdeung .push-l,.sc-galdeung .push-r{transition:transform .5s}
     .on2 .sc-galdeung .push-l{transform:translate(150px,50px)}.on2 .sc-galdeung .push-r{transform:translate(340px,50px)}
     .on2 .sc-galdeung .zap{animation:zap .5s 3}
     @keyframes zap{50%{transform:translateY(-6px) scale(1.06)}}`));

  // 조정 — 의견 맞섬 → 조금씩 고침 → 요일 나누기
  put('5-2/국어/4/조정', [
    '운동장을 두고 축구 모둠과 피구 모둠이 맞선다.',
    '어느 한쪽만 따르지 않고 둘 다 조금씩 고쳐 본다.',
    '요일을 나누어 번갈아 쓰기로 맞춘다.',
    '서로 다른 의견을 알맞게 맞추는 일이 조정이다.'
  ], svg('jojeong', `
    ${kid(90, 200, '#e07a5f', { mood: 'frown', cls: 'h3' })}${kid(90, 200, '#e07a5f', { cls: 'b3' })}
    ${kid(550, 200, '#3d85c6', { hair: '#5a3d2b', mood: 'frown', cls: 'h3' })}${kid(550, 200, '#3d85c6', { hair: '#5a3d2b', cls: 'b3' })}
    ${bubble(30, 70, 130, 46, '축구!', { cls: 'b1', tail: 'r' })}${bubble(480, 70, 130, 46, '피구!', { cls: 'b1', tail: 'l' })}
    <g class="b1 h2"><path d="M200 180 H300 M300 180 l-14 -10 M300 180 l-14 10" stroke="#e07a5f" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M440 180 H340 M340 180 l14 -10 M340 180 l14 10" stroke="#3d85c6" stroke-width="6" stroke-linecap="round" fill="none"/></g>
    <g class="b2 cal">
      ${['월', '화', '수', '목', '금'].map((d, i) => `<g transform="translate(${180 + i * 58} 120)">
        <rect width="52" height="96" rx="8" fill="#fff" stroke="#c4d3cc" stroke-width="2"/>
        <text x="26" y="26" text-anchor="middle" font-size="17" font-weight="800" fill="${INK}">${d}</text>
        <rect class="day d${i}" x="6" y="38" width="40" height="50" rx="6" fill="${i % 2 ? '#3d85c6' : '#e07a5f'}"/>
        <text class="day d${i}" x="26" y="70" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">${i % 2 ? '피구' : '축구'}</text></g>`).join('')}
    </g>
    <g class="b4"><rect x="250" y="250" width="140" height="40" rx="20" fill="#22594f"/><text x="320" y="277" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">조정</text></g>`,
    `.sc-jojeong .day{opacity:0;transition:opacity .35s}
     .on3 .sc-jojeong .day{opacity:1}
     ${[0, 1, 2, 3, 4].map(i => `.on3 .sc-jojeong .d${i}{transition-delay:${i * 0.28}s}`).join('')}`));

  // 합의점 — 뜻이 다름 → 양보하며 다가감 → 만나는 자리
  put('5-2/국어/4/합의점', [
    '청소 당번을 두고 두 사람의 뜻이 다르다.',
    '서로 조금씩 양보하며 가까워진다.',
    '두 사람의 뜻이 한 곳에서 만난다.',
    '모두의 뜻이 모인 그 자리가 합의점이다.'
  ], svg('hapui', `
    <path d="M60 250 H580" stroke="#c4d3cc" stroke-width="6" stroke-dasharray="4 12" stroke-linecap="round"/>
    <g class="walk-l">${kid(90, 170, '#e07a5f')}${bubble(30, 60, 150, 46, '내가 다 할게?', { cls: 'h2', tail: 'r', size: 16 })}</g>
    <g class="walk-r">${kid(550, 170, '#3d85c6', { hair: '#5a3d2b' })}${bubble(460, 60, 150, 46, '너 혼자 해!', { cls: 'h2', tail: 'l', size: 16 })}</g>
    <g class="b3 star"><path d="M320 206 l11 23 26 3 -19 18 5 26 -23 -13 -23 13 5 -26 -19 -18 26 -3 Z" fill="#f2c94c" stroke="#c99a12" stroke-width="2"/></g>
    ${bubble(205, 40, 230, 50, '일주일씩 돌아가며!', { cls: 'b3', fill: '#fff7d6', stroke: '#d9a520', size: 18 })}
    <g class="b4"><rect x="250" y="300" width="140" height="40" rx="20" fill="#22594f"/><text x="320" y="327" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">합의점</text></g>`,
    `.sc-hapui .walk-l,.sc-hapui .walk-r{transition:transform 1.4s ease-in-out}
     .on2 .sc-hapui .walk-l{transform:translateX(120px)}.on2 .sc-hapui .walk-r{transform:translateX(-120px)}
     .sc-hapui .star{transform-origin:320px 240px}
     .on3 .sc-hapui .star{animation:burst .7s ease-out}
     @keyframes burst{0%{transform:scale(0) rotate(-40deg)}70%{transform:scale(1.25)}100%{transform:scale(1)}}`));

  // 검토 기준 — 의견 여럿 → 따질 조건 먼저 → 조건마다 표시 → 가장 잘 맞는 의견
  const ideas = ['교실 화분 기르기', '복도 벽화 그리기', '쓰레기 줍기 날'];
  const marks = [['○', '○', '○'], ['×', '○', '×'], ['○', '×', '○']];
  put('5-2/국어/4/검토 기준', [
    '토의에서 의견이 여러 개 나왔다.',
    '고르기 전에 무엇을 보고 따질지 조건을 먼저 정한다. 이것이 검토 기준이다.',
    '모든 의견을 같은 조건으로 하나씩 따져 본다.',
    '조건에 가장 잘 맞는 의견을 고른다.'
  ], svg('geomto', `
    <rect x="40" y="26" width="560" height="270" rx="10" fill="#2f4f46"/><rect x="52" y="38" width="536" height="246" rx="6" fill="#36594f"/>
    ${ideas.map((t, i) => `<g class="b1"><text x="70" y="${150 + i * 50}" font-size="18" font-weight="700" fill="#fff">${t}</text></g>`).join('')}
    <g class="b2 crit">${['돈이 적게 드나?', '모두 할 수 있나?', '시간 안에 되나?'].map((t, j) => `<g transform="translate(${262 + j * 108} 66)"><rect x="-4" y="-4" width="104" height="54" rx="8" fill="#f2c94c"/><text x="48" y="20" text-anchor="middle" font-size="13.5" font-weight="800" fill="#2f2a10">${t.split(' ')[0]}</text><text x="48" y="40" text-anchor="middle" font-size="13.5" font-weight="800" fill="#2f2a10">${t.split(' ').slice(1).join(' ')}</text></g>`).join('')}</g>
    ${marks.map((row, i) => row.map((m, j) => `<text class="b3 mk m${i * 3 + j}" x="${310 + j * 108}" y="${152 + i * 50}" text-anchor="middle" font-size="26" font-weight="800" fill="${m === '○' ? '#9be7b0' : '#ff9d8a'}">${m}</text>`).join('')).join('')}
    <rect class="b4 pick" x="58" y="124" width="524" height="40" rx="8" fill="none" stroke="#f2c94c" stroke-width="4"/>
    <g class="b2"><rect x="200" y="306" width="240" height="40" rx="20" fill="#22594f"/><text x="320" y="333" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">검토 기준 = 따질 조건</text></g>`,
    `.sc-geomto .mk{opacity:0;transition:opacity .25s}
     .on3 .sc-geomto .mk{opacity:1}
     ${Array.from({ length: 9 }, (_, k) => `.on3 .sc-geomto .m${k}{transition-delay:${k * 0.18}s}`).join('')}
     .on4 .sc-geomto .pick{animation:blink 1s 2}
     @keyframes blink{50%{opacity:.2}}`));

  // 절차 — 징검다리를 차례로 건넌다
  const steps = ['주제 정하기', '의견 마련하기', '의견 나누기', '의견 모으기', '결정하기'];
  put('5-2/국어/4/절차', [
    '토의는 아무렇게나 하지 않는다.',
    '정해진 차례를 하나씩 밟아 간다.',
    '차례를 건너뛰면 의견을 다 듣지 못한다.',
    '일을 할 때 거쳐야 하는 차례와 방법이 절차다.'
  ], svg('jeolcha', `
    <rect x="0" y="230" width="640" height="130" fill="#cfe4f1"/>
    ${steps.map((t, i) => `<g transform="translate(${70 + i * 125} ${250 - (i % 2) * 18})"><ellipse class="stone s${i}" cx="0" cy="0" rx="52" ry="20" fill="#b9b2a4"/><text x="0" y="48" text-anchor="middle" font-size="15" font-weight="800" fill="${INK}">${i + 1}. ${t}</text></g>`).join('')}
    <g class="hopper">${kid(70, 150, '#f2b134')}</g>
    <g class="b3"><path d="M330 200 Q450 40 570 220" fill="none" stroke="#c0392b" stroke-width="4" stroke-dasharray="8 8"/><text x="450" y="112" text-anchor="middle" font-size="34" font-weight="800" fill="#c0392b">✕</text></g>
    <g class="b4"><rect x="250" y="20" width="140" height="40" rx="20" fill="#22594f"/><text x="320" y="47" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">절차</text></g>`,
    `.sc-jeolcha .hopper{transition:transform .5s}
     .on2 .sc-jeolcha .hopper{animation:hop 4s steps(1,end) forwards}
     @keyframes hop{0%{transform:translate(0,0)}20%{transform:translate(125px,-18px)}40%{transform:translate(250px,0)}60%{transform:translate(375px,-18px)}80%,100%{transform:translate(500px,0)}}
     .sc-jeolcha .stone{transition:fill .3s}
     ${steps.map((_, i) => `.on2 .sc-jeolcha .s${i}{fill:#22594f;transition-delay:${i * 0.8}s}`).join('')}
     .on3 .sc-jeolcha .hopper{animation:none;transform:translate(250px,0)}`));

  // 사회자 — 주제 알림 → 차례 정함 → 고르게 → 정리
  put('5-2/국어/4/사회자', [
    '마이크를 든 사람이 오늘의 주제를 알린다.',
    '말할 차례를 정해 준다.',
    '한 사람만 오래 말하지 않게 다른 사람에게도 기회를 준다.',
    '나온 의견을 정리한다. 회의를 이끄는 이 사람이 사회자다.'
  ], svg('sahoeja', `
    <ellipse cx="380" cy="296" rx="200" ry="24" fill="#d6c3a2"/>
    ${kid(110, 200, '#22594f', { hair: '#2d2d2d', mic: true, cls: 'host' })}
    ${kid(280, 226, '#e07a5f', { cls: 'a' })}${kid(380, 226, '#3d85c6', { hair: '#5a3d2b' })}${kid(480, 226, '#6aa84f')}
    ${bubble(40, 90, 170, 46, '주제: 학급 규칙', { cls: 'b1 h2', tail: 'r', size: 16 })}
    ${bubble(40, 90, 170, 46, '민수 먼저!', { cls: 'b2 h3', tail: 'r' })}
    ${bubble(220, 128, 120, 44, '내 생각은…', { cls: 'b2 h3', tail: 'd', size: 16 })}
    ${bubble(220, 128, 120, 44, '그리고 또…', { cls: 'b3 h4', tail: 'd', size: 16 })}
    ${bubble(40, 90, 170, 46, '지우 차례예요', { cls: 'b3 h4', tail: 'r', size: 16 })}
    ${bubble(420, 128, 120, 44, '저는요!', { cls: 'b3 h4', tail: 'd', size: 16 })}
    <g class="b4"><rect x="250" y="40" width="250" height="108" rx="10" fill="#fff" stroke="#c4d3cc" stroke-width="2"/>
      <text x="270" y="72" font-size="16" font-weight="800" fill="${INK}">정리</text>
      <text x="270" y="100" font-size="15" fill="${INK}">① 복도에서 걷기</text><text x="270" y="126" font-size="15" fill="${INK}">② 쉬는 시간 정리</text></g>
    <path class="b2 h3 point" d="M170 190 Q220 170 255 196" fill="none" stroke="#c0392b" stroke-width="4" marker-end="url(#ah)"/>
    <defs><marker id="ah" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#c0392b"/></marker></defs>
    <g class="b4"><rect x="40" y="300" width="140" height="40" rx="20" fill="#22594f"/><text x="110" y="327" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">사회자</text></g>`,
    `.sc-sahoeja .host{animation:bob 2.4s ease-in-out infinite}
     @keyframes bob{0%,100%{transform:translate(110px,200px)}50%{transform:translate(110px,193px)}}`));

  // 순화어 — 외국 말 카드가 뒤집혀 쉬운 우리말이 된다
  const pairs = [['헬멧', '안전모'], ['레시피', '조리법'], ['스크린 도어', '안전문']];
  put('5-2/국어/4/순화어', [
    '외국에서 들어온 어려운 말이 있다.',
    '누구나 알기 쉬운 우리말로 바꾼다.',
    '다른 말도 쉬운 우리말로 바꿀 수 있다.',
    '이렇게 쉬운 우리말로 바꾼 말이 순화어다.'
  ], svg('sunhwa', `
    ${pairs.map(([from, to], i) => `<g transform="translate(${110 + i * 210} 0)">
      <g class="${i ? 'b3' : 'b1'}"><rect x="-80" y="34" width="160" height="70" rx="12" fill="#fde9d9" stroke="#e07a5f" stroke-width="3"/><text x="0" y="78" text-anchor="middle" font-size="${from.length > 4 ? 21 : 26}" font-weight="800" fill="#9c3b22">${from}</text></g>
      <g class="${i ? 'b3 late' : 'b2'}"><path d="M0 112 V150 M0 150 l-11 -12 M0 150 l11 -12" stroke="#506761" stroke-width="5" stroke-linecap="round" fill="none"/>
        <rect x="-80" y="160" width="160" height="70" rx="12" fill="#e5f2eb" stroke="#22594f" stroke-width="3"/><text x="0" y="204" text-anchor="middle" font-size="26" font-weight="800" fill="#22594f">${to}</text></g>
    </g>`).join('')}
    <g class="b4"><rect x="250" y="292" width="140" height="40" rx="20" fill="#22594f"/><text x="320" y="319" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">순화어</text></g>`,
    `.on3 .sc-sunhwa .late{transition-delay:.9s}`));

  root.CurriculumScenes = Object.assign(root.CurriculumScenes || {}, scenes);
  if (typeof module === 'object' && module.exports) module.exports = root.CurriculumScenes;
})(typeof window !== 'undefined' ? window : globalThis);
