(function (root) {
  'use strict';

  const ink = '#1d3540', line = '#58717a', green = '#166554', mint = '#d8f0e7';
  const blue = '#215786', sky = '#dceefb', orange = '#8e451d', sand = '#f8e4c8';
  const white = '#fffefa', pale = '#f0f6f4', soil = '#d3a078';
  const rect = (x, y, w, h, fill = white, stroke = 'none', radius = 0) =>
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + radius + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"/>';
  const dot = (x, y, r, fill, stroke = 'none', width = 2) =>
    '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + width + '"/>';
  const path = (d, fill = 'none', stroke = ink, width = 3, extra = '') =>
    '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + width + '" stroke-linecap="round" stroke-linejoin="round" ' + extra + '/>';
  const label = (x, y, text, size = 25, fill = ink, anchor = 'middle') =>
    '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + fill + '" text-anchor="' + anchor + '" font-weight="700">' + text + '</text>';
  const arrow = (x, y, end, color = ink) => {
    const dir = end > x ? 1 : -1;
    return path('M' + x + ' ' + y + 'H' + end + 'm' + (-dir * 12) + ' -9l' + (dir * 12) + ' 9l' + (-dir * 12) + ' 9', 'none', color, 4);
  };
  const place = (body, x, y, scale = 1) => '<g transform="translate(' + x + ' ' + y + ') scale(' + scale + ')">' + body + '</g>';
  const picture = (name, body, height = 290) => '<svg viewBox="0 0 600 ' + height + '" role="img" aria-label="' + name + '" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  const icons = {
    hut: path('M7 75 48 15Q53 10 59 16L95 75Z', '#e7b965', '#573f2d', 4) +
      path('M17 73 49 24m-9 47 13-45m10 45L57 26m24 46L61 27', 'none', '#aa7442', 2) +
      path('M42 74V61q10-13 21 0v13', '#624b3b', '#573f2d', 2) + path('M2 77h97', 'none', '#6a7951', 4),
    pot: path('M25 20h50l-2 11q23 31 1 45L50 90 26 76Q4 62 27 31Z', '#d38b54', '#603f30', 4) +
      path('M26 32h47M18 47l10 8 10-8 10 8 10-8 10 8 10-8M25 63l8 6 9-6 9 6 9-6 8 6 8-6', 'none', '#734731', 2.6),
    stone: path('M20 70 28 43 51 15 72 29 86 58 66 81 37 85Z', '#778b90', '#344c53', 4) +
      path('m28 43 22 8 22-22M50 51l16 30M20 70l30-19 36 7', 'none', '#c6d2d0', 2),
    stele: path('M23 88V34C23 3 76 3 76 34v54Z', '#a6aca3', '#4e625a', 4) +
      rect(17, 83, 66, 11, '#757f73', '#4e625a', 3) + label(50, 49, '光', 21) + label(50, 73, '開', 21),
    book: path('M50 22Q22 9 5 20v57q18-12 45 0 27-12 45 0V20Q78 9 50 22Z', '#f6d891', orange, 3) +
      path('M50 22v55M15 33q14-4 25 2m-25 9q14-4 25 2m20-11q14-5 25-2m-25 12q14-5 25-2', 'none', orange, 2),
    tablet: rect(17, 7, 66, 84, '#4b728e', blue, 9) + rect(23, 14, 54, 65, sky, 'none', 4) +
      path('M33 28h34M33 39h34M33 50h24', 'none', blue, 3) + dot(50, 85, 2.5, white),
    droplet: path('M50 11Q16 51 16 66a34 30 0 0 0 68 0Q84 51 50 11Z', '#66b9de', blue, 4) +
      path('M28 64q2 14 15 17', 'none', white, 4),
    sun: dot(50, 49, 26, '#ffd473', orange, 3) +
      path('M50 6v9m0 68v9M7 49h9m68 0h9M20 19l7 8m45 45 8 8m0-61-8 8m-45 45-8 8', 'none', orange, 4),
    cloud: path('M14 66q-7-22 16-26 3-24 25-19 16 1 23 19 24 0 17 25-4 11-18 11H33q-16 0-19-10Z', white, blue, 3),
    tree: path('M48 56v36m-7 0h17', 'none', '#6c452e', 8) + dot(49, 34, 27, '#97b981', green, 3) +
      dot(32, 47, 15, '#97b981') + dot(66, 49, 16, '#97b981'),
    face: dot(50, 44, 28, '#f2c08c', orange, 3) + path('M21 41q-2-28 29-30 30 0 29 28-13-1-26-17-15 20-32 19Z', ink, ink, 2) +
      dot(40, 46, 2.6, ink) + dot(60, 46, 2.6, ink) + path('M44 56q6 6 12 0', 'none', orange, 2) +
      path('M12 96q2-23 22-24l16 9 16-9q19 1 22 24Z', '#5b8d9f', blue, 3),
    lamp: path('M21 67q-20-23-5-45 12-17 34-17t34 17q15 22-5 45l-13 10H34Z', '#ffe197', orange, 3) +
      rect(35, 76, 31, 16, '#6b8492', blue, 3) + path('M49 76V53m-8-6 8 6 8-6', 'none', orange, 3),
    cup: path('M16 18h68l-9 68H25Z', '#f8fcfb', blue, 3) + path('M20 51h60l-5 34H25Z', '#7cc6e6', 'none'),
    mountain: path('M1 79 39 19l21 32 12-20 27 48Z', '#789b74', green, 3) + path('m26 40 13-21 14 21-11-5-7 7Z', white, 'none'),
    house: path('M21 45h58v44H21Z', '#f9d7a0', orange, 3) + path('M8 47 50 14 92 47Z', '#b96a50', '#693f34', 3) +
      rect(42, 60, 16, 29, '#876044', orange, 2) + rect(27, 51, 10, 11, sky, blue, 1) + rect(63, 51, 10, 11, sky, blue, 1),
    ship: path('M5 69h90L78 87H23Z', '#ba7953', orange, 3) + path('M47 8v61m4-59 28 46H51ZM43 24 19 56h24Z', white, blue, 3) +
      path('M3 95q8-6 16 0t16 0 16 0 16 0 16 0 16 0', 'none', blue, 3),
    coin: dot(50, 50, 37, '#f3ce73', orange, 3) + dot(50, 50, 29, 'none', orange, 2) + label(50, 60, '₩', 28, orange),
    note: rect(19, 8, 62, 85, '#fff5ce', orange, 5) + path('M33 29h34M33 43h34M33 57h24M33 71h28', 'none', orange, 3),
    flag: path('M25 94V13', 'none', ink, 5) + path('M25 16q24-15 55 0v43q-28-15-55 0Z', white, blue, 3) +
      dot(53, 36, 11, '#a34c45') + path('M43 36a10 10 0 0 0 20 0q-6 7-10 0t-10 0Z', blue, 'none'),
    camera: rect(12, 30, 76, 51, '#94bdd4', blue, 6) + rect(27, 20, 22, 12, '#94bdd4', blue, 3) + dot(53, 55, 16, sky, blue, 4),
    solar: path('M17 24h70l-8 47H8Z', '#7babc6', blue, 4) + path('M40 24l-9 47m31-47-9 47M15 39h68M12 54h68m-37 18v17m-22 0h43', 'none', blue, 3),
    magnify: dot(42, 39, 26, sky, blue, 4) + path('M60 57 86 84', 'none', blue, 8),
    speech: path('M9 20h82v48H59L38 85V68H9Z', white, blue, 3) + dot(32, 45, 3, blue) + dot(50, 45, 3, blue) + dot(68, 45, 3, blue),
    gear: dot(50, 50, 31, '#92bfb2', green, 4) + dot(50, 50, 10, white, green, 4) +
      path('M50 9v11m0 60v11M9 50h11m60 0h11M20 20l8 8m44 44 8 8m0-60-8 8M28 72l-8 8', 'none', green, 7)
  };
  const icon = (name, x, y, size = 100) => place(icons[name], x, y, size / 100);
  const question = (text, answer, why, others) => ({
    question: text, answer, options: [answer, ...others.map(([name]) => name)],
    feedback: Object.fromEntries([[answer, why], ...others])
  });
  const activity = (title, controlLabel, states, draw, check, extra = {}) => ({ title, controlLabel, states, draw, check, ...extra });

  function timeScene(state) {
    const early = state === 0;
    return picture(early ? '선사 시대에는 집터와 토기가 남아 있다. 그 뒤 문자 기록이 남는 시대가 있다.' : '문자 기록이 남는 시대에는 비석에 새긴 글도 읽을 수 있다.',
      rect(0, 0, 600, 286, pale) +
      rect(15, 15, 273, 214, early ? '#fae8cc' : '#f5efe3', early ? orange : '#c9b9a0', 16) +
      rect(312, 15, 273, 214, early ? '#e8f1f5' : sky, early ? '#c1d1da' : blue, 16) +
      label(151, 56, '선사 시대', 31, orange) + label(448, 56, '역사 시대', 31, blue) +
      rect(30, 161, 244, 22, '#cbb28c', 'none', 8) + icon('hut', 37, 80, 111) +
      icon('pot', 154, 105, 65) + icon('stone', 215, 114, 43) +
      icon('stele', 337, 70, 106) + icon('book', 449, 93, 100) +
      label(151, 210, '집터 · 토기 · 돌 도구', 22, orange) + label(448, 210, '비석에 남은 글', 24, blue) +
      arrow(36, 252, 565, line) + dot(300, 252, 7, ink) + label(300, 278, '문자 기록이 남기 시작', 20),
      286);
  }

  function digScene(state) {
    const ground = state === 0 || state === 2, objects = state === 1 || state === 2;
    return picture('집이 있던 자리와 그 자리에서 찾은 토기와 돌 도구. 선택한 단서가 테두리로 표시된다.',
      rect(0, 0, 600, 264, sky) + path('M0 144q101-14 193 0t207 0 200 0v120H0Z', soil, 'none') +
      path('M0 181q92-13 203 1t190 0 207 0M0 218q103-15 217 1t189 0 194 0', 'none', '#b17958', 3) +
      icon('hut', 68, 44, 161) + icon('tree', 14, 63, 85) +
      path('M78 175h183m-151-9v18m32-18v18m44-18v18m38-18v18', 'none', '#624b3b', 7) +
      icon('pot', 347, 116, 101) + icon('stone', 459, 144, 70) +
      (ground ? rect(51, 42, 226, 151, 'none', green, 15) : '') +
      (objects ? rect(323, 102, 227, 117, 'none', blue, 15) : '') +
      label(162, 240, '집이 있던 자리', 25, '#523620') + label(439, 245, '꺼내 옮길 수 있는 물건', 22, '#523620'), 264);
  }

  function quarters(state, total = 7, compact = false) {
    const grouped = state === 1;
    const top = grouped ? ['온전한 한 개', '남은 ¼ 조각'] : ['¼ 조각 ' + total + '개'];
    const rest = total % 4, whole = Math.floor(total / 4);
    const tile = (i) => {
      const x = 32 + i * 66 + (grouped && i >= 4 ? 37 : 0);
      const color = grouped && i < 4 ? '#75bda9' : '#ffcf87';
      return rect(x, 100, 58, 70, color, grouped && i < 4 ? green : orange, 7) + label(x + 29, 146, '¼', 30);
    };
    let grouping = '';
    if (grouped) {
      grouping = rect(22, 83, 273, 104, 'none', green, 14) +
        rect(323, 83, rest * 66 + 16, 104, 'none', orange, 14) +
        label(158, 63, top[0], 27, green) + label(329 + rest * 33, 63, top[1], 25, orange) +
        label(158, 228, String(whole), 34, green) + label(309, 228, '+', 34) +
        label(329 + rest * 33, 228, rest + ' / 4', 34, orange);
    } else grouping = label(300, 63, top[0], 28) + (compact ? '' : label(300, 228, total + ' / 4', 35, orange));
    return picture(grouped ? '앞의 네 조각은 한 개로 묶이고 나머지 ' + rest + '조각은 4분의 ' + rest + '이다.' : '같은 크기의 4분의 1 조각이 ' + total + '개 놓여 있다.',
      rect(0, 0, 600, compact ? 195 : 258, pale) + Array.from({ length: total }, (_, i) => tile(i)).join('') + grouping, compact ? 195 : 258);
  }

  function rangeScene(state) {
    const includes = state % 2 === 0, right = state < 2;
    const names = ['12세 이상', '12세 초과', '12세 이하', '12세 미만'];
    const accepted = [!right, includes, right];
    return picture(names[state] + '. 12세는 ' + (includes ? '통과' : '멈춤') + '.',
      rect(0, 0, 600, 263, pale) + label(300, 41, names[state], 30) +
      path('M52 112h496', 'none', '#a0b3b2', 4) + arrow(300, 112, right ? 548 : 52, green) +
      dot(300, 112, 12, includes ? green : white, green, 5) +
      [136, 300, 464].map((x, i) => path('M' + x + ' 130v10', 'none', line, 3) +
        label(x, 172, (11 + i) + '세', 27) + rect(x - 53, 185, 106, 49, accepted[i] ? mint : sand, accepted[i] ? green : orange, 8) +
        label(x, 217, accepted[i] ? '통과' : '멈춤', 24, accepted[i] ? green : orange)).join(''), 263);
  }

  function interviewScene(state) {
    const media = state === 2;
    const frame = (x, selected, color) => rect(x, 108, 190, 132, selected ? color : white, selected ? blue : '#c4d4d5', 12);
    return picture(media ? '학생이 화면을 통해 졸업생을 만나 질문한다.' : '학생은 텃밭을 언제 만들었는지 묻고 졸업생이 답한다.',
      rect(0, 0, 600, 278, pale) +
      rect(28, 17, 544, 69, state === 0 ? sand : white, state === 0 ? orange : '#c4d4d5', 12) +
      label(300, 60, '“학교 텃밭은 언제 만들었어요?”', 27) +
      frame(41, false, mint) + frame(369, state !== 0, sky) +
      icon('face', 91, 112, 82) + (media ? icon('tablet', 420, 112, 83) : icon('face', 421, 112, 82)) +
      label(136, 222, '묻는 학생', 25) + label(464, 222, media ? '화상 통화 화면' : '답하는 졸업생', 23) +
      arrow(249, 150, 351, blue) + arrow(351, 184, 249, green) +
      label(300, 260, media ? '같은 질문 · 다른 만남 방식' : '질문을 보내고 답을 들어요', 22), 278);
  }

  function readingScene(state) {
    const digital = state === 1;
    return picture(digital ? '전자책에서 글자를 크게 바꾸어 읽고 있다.' : '종이책에서 페이지를 넘겨 글을 읽고 있다.',
      rect(0, 0, 600, 244, pale) + rect(22, 21, 249, 201, digital ? white : sand, digital ? '#c4d4d5' : orange, 14) +
      rect(329, 21, 249, 201, digital ? sky : white, digital ? blue : '#c4d4d5', 14) +
      icon('book', 71, 34, 151) + icon('tablet', 401, 37, 109) +
      label(146, 194, '종이책', 30, orange) + label(453, 194, '전자책', 30, blue) +
      label(300, 123, '=', 39, green), 244);
  }

  function landscapeScene(state) {
    const names = ['산지', '평야', '하천', '해안'];
    const positions = [111, 278, 395, 491];
    return picture('왼쪽에 산지, 그 옆에 평야와 하천, 오른쪽 바다 앞에 해안이 있다. ' + names[state] + '가 표시된다.',
      rect(0, 0, 600, 258, sky) + icon('sun', 475, 13, 66) +
      path('M0 204V177L45 156 94 63 134 118 162 95 223 180H385L415 164 457 181 493 199H600V258H0Z', '#afc58a', green, 3) +
      path('M72 103 94 63l23 33-12-7-11 13-8-9Z', white, 'none') +
      path('M369 179q12-7 24 0t27 1l31 14 43 8v56H359q29-16 30-33t-20-46Z', '#75bbd9', blue, 3) +
      path('M491 200h109v58H475l18-16q-12-12-2-42Z', '#75bbd9', blue, 3) +
      path('M218 180h135m-118 18h105m-84 17h97', 'none', '#7a9a54', 3) +
      icon('house', 270, 109, 66) +
      path('M' + positions[state] + ' 58v' + [63, 122, 126, 142][state], 'none', orange, 4, 'stroke-dasharray="7 7"') +
      rect(positions[state] - 56, 20, 112, 45, sand, orange, 9) + label(positions[state], 51, names[state], 26, orange), 258);
  }

  function filterScene(state) {
    const sandGrains = (x, y, color) => [[-28, 0], [-12, 11], [12, 4], [24, 15], [4, 18]].map(([dx, dy]) => dot(x + dx, y + dy, 4, color)).join('');
    const cup = (x, y, fill) => path('M' + x + ' ' + y + 'h150l-14 86h-122Z', white, blue, 3) +
      path('M' + (x + 7) + ' ' + (y + 40) + 'h136l-7 45h-122Z', fill, 'none');
    const funnel = path('M222 89h155l-67 59v22h-21v-22Z', '#fff5df', orange, 3);
    const body = state === 0
      ? cup(225, 82, '#d3edfa') + sandGrains(300, 144, orange) + label(300, 209, '모래는 그대로 · 소금은 녹음', 25)
      : state === 1
        ? funnel + sandGrains(299, 110, orange) + dot(300, 183, 5, blue) + cup(225, 198, '#d3edfa') + label(143, 135, '모래', 26, orange) + label(457, 247, '소금물', 26, blue)
        : path('M195 191q105 41 210 0l-15 32H211Z', '#eaf1ed', line, 4) + sandGrains(300, 199, '#af7a34') +
          path('M241 148q-16-19 0-38m59 38q-16-19 0-38m59 38q-16-19 0-38', 'none', blue, 5) +
          label(300, 86, '물은 날아가고', 27, blue) + label(300, 266, '소금이 남아요', 27, orange);
    return picture(['물에 섞은 소금은 녹고 모래가 가라앉아 있다.', '거름종이에 모래가 남고 아래에 소금물이 모인다.', '접시에서 물이 증발하고 소금이 남아 있다.'][state],
      rect(0, 0, 600, 306, pale) + label(300, 45, ['물에 넣기', '거름종이에 붓기', '물을 증발시키기'][state], 29) + body, 306);
  }

  function evidenceScene(state) {
    return picture('책을 빌린 아이가 약속한 날에 책을 돌려주고 있다.',
      rect(0, 0, 600, 270, pale) + rect(18, 18, 564, 82, state === 0 ? sand : white, state === 0 ? orange : '#bacdcc', 13) +
      label(300, 53, '“이 인물은 믿을 수 있어.”', 29) + label(300, 83, '내가 작품을 보고 내린 생각', 22, orange) +
      rect(18, 115, 564, 136, state === 1 ? sky : white, state === 1 ? blue : '#bacdcc', 13) +
      icon('note', 50, 128, 76) + icon('face', 150, 135, 81) + icon('book', 256, 136, 78) +
      arrow(346, 176, 399, blue) + icon('face', 429, 133, 82) +
      label(300, 233, '빌린 책을 약속한 날에 돌려줌', 25, blue), 270);
  }

  function viewpointsScene(state) {
    return picture('같은 빈터를 보며 어떤 사람은 조용한 쉼터를, 다른 사람은 운동할 곳을 떠올린다.',
      rect(0, 0, 600, 260, pale) + rect(13, 13, 278, 229, state === 0 ? mint : white, state === 0 ? green : '#bacdcc', 14) +
      rect(309, 13, 278, 229, state === 1 ? sky : white, state === 1 ? blue : '#bacdcc', 14) +
      icon('face', 26, 74, 78) + icon('tree', 127, 51, 112) + path('M148 149h77m-74 13h72m-60 3v15m43-15v15', 'none', orange, 5) +
      icon('face', 321, 74, 78) + path('M477 69v110m-4-106h68v48h-68m17-4h32l-5 20h-21Z', '#e6f4fb', blue, 4) +
      dot(464, 154, 17, '#f3b577', orange, 3) + path('M451 146q15 1 26 15m-18-21q-1 19 11 28', 'none', orange, 2) +
      label(151, 215, '쉬는 곳이 필요해요', 23, green) + label(448, 215, '뛰어놀 곳이 필요해요', 23, blue), 260);
  }

  function circuitScene(state) {
    const closed = state === 1;
    const wire = closed ? green : line;
    return picture(closed ? '스위치가 닫혀 전지에서 전구까지 길이 이어지고 전구가 켜진다.' : '스위치에서 길이 끊어져 전구가 꺼져 있다.',
      rect(0, 0, 600, 291, pale) +
      (closed ? dot(301, 79, 54, '#ffefb8') + icon('lamp', 257, 36, 88) :
        path('M272 91q-14-21 1-39 11-13 28-13t27 13q15 18 1 39l-14 16h-28Z', white, line, 3) + rect(285, 105, 30, 14, '#8fa2a8', line, 2)) +
      path('M282 115H94v105h156m102 0h153V115H318', 'none', wire, 6) +
      rect(282, 108, 36, 15, '#6b8492', blue, 2) + dot(282, 115, 4.5, wire) + dot(318, 115, 4.5, wire) +
      rect(250, 192, 102, 54, '#dce7e9', blue, 9) + label(269, 226, '−', 23, blue) + label(331, 226, '+', 23, orange) +
      label(301, 276, '전지', 23) +
      rect(411, 96, 79, 40, pale, 'none') +
      dot(412, 115, 6, wire) + dot(488, 115, 6, wire) + path(closed ? 'M412 115h76' : 'M412 115l67-32', 'none', wire, 6) +
      label(453, 166, closed ? '길이 이어짐' : '길이 끊김', 23, wire) +
      label(301, 158, closed ? '전구가 켜짐' : '전구가 꺼짐', 24, closed ? orange : line), 291);
  }

  function multiplyFractionScene(state) {
    const cells = (row, col) => {
      const horizontal = row < 2, vertical = col < 3;
      const fill = state === 0 ? (horizontal ? mint : white) : (horizontal && vertical ? '#72b6a3' : horizontal ? mint : vertical ? sky : white);
      return rect(100 + col * 86, 63 + row * 62, 86, 62, fill, line, 0);
    };
    return picture(state === 0 ? '종이 전체를 세 줄로 나누고 위 두 줄이 색칠되었다.' : '세로로 나눈 네 칸 가운데 세 칸을 고르면 가로 두 줄과 겹치는 여섯 칸이 나온다.',
      rect(0, 0, 600, 304, pale) + label(272, 38, state === 0 ? '전체의 ⅔' : '색칠한 부분의 ¾', 27) +
      Array.from({ length: 12 }, (_, i) => cells(Math.floor(i / 4), i % 4)).join('') +
      (state === 0 ? path('M458 64h17v123h-17', 'none', green, 4) + label(519, 134, '두 줄', 23, green) :
        path('M101 255v12h257v-12', 'none', green, 4) + label(230, 294, '겹친 6칸 / 전체 12칸', 23, green)), 304);
  }

  function divideFractionScene(state) {
    const take = state === 0 ? 1 : 2;
    const answer = take === 1 ? '3묶음' : '1묶음과 반 묶음';
    const cells = Array.from({ length: 4 }, (_, i) => rect(80 + i * 110, 90, 110, 72, i < 3 ? mint : white, green, 0) +
      label(135 + i * 110, 136, '¼', 28, i < 3 ? green : line)).join('');
    const brace = (x, width, color) => path('M' + x + ' 172v13h' + width + 'v-13', 'none', color, 4);
    return picture('색칠한 4분의 3에서 ' + take + '칸을 한 묶음으로 하면 ' + answer + '이다.',
      rect(0, 0, 600, 264, pale) + label(300, 47, '색칠한 양 ¾', 30) + cells +
      (take === 1 ? brace(84, 101, blue) + brace(194, 101, blue) + brace(304, 101, blue)
        : brace(84, 211, blue) + brace(304, 101, orange) + path('M405 185h111v-13', 'none', orange, 3, 'stroke-dasharray="8 7"')) +
      label(300, 231, answer, 29, green), 264);
  }

  function roundingScene(state) {
    const up = state === 0;
    return picture('368은 300과 400 사이에 있고 중간은 350이다. ' + ['올림 결과는 400이다.', '버림 결과는 300이다.', '반올림 결과는 400이다.'][state],
      rect(0, 0, 600, 247, pale) + label(300, 39, '368을 백의 자리까지', 30) +
      path('M75 139h450', 'none', line, 4) + path('M91 127v25m209-25v25m209-25v25', 'none', line, 4) +
      label(91, 190, '300', 27) + label(300, 190, '350', 23, line) + label(509, 190, '400', 27) +
      dot(375, 139, 9, orange) + label(375, 116, '368', 27, orange) +
      (state === 2 ? rect(300, 133, 209, 12, '#99d1be', 'none', 5) + dot(375, 139, 9, orange) : '') +
      arrow(375, 214, state === 1 ? 91 : 509, up ? green : blue) +
      dot(state === 1 ? 91 : 509, 139, 11, state === 1 ? blue : green), 247);
  }

  function symmetryScene(state) {
    const split = state !== 0;
    const half = (fill, stroke) => path('M300 218Q269 186 213 138Q175 101 201 68Q230 35 264 62Q288 78 300 103Z', fill, stroke, 4);
    const left = half('#efac95', '#894733');
    const right = '<g transform="translate(600 0) scale(-1 1)">' + (split ? half('#f6dfd6', '#b98576') : left) + '</g>';
    return picture(split ? '하트를 가운데 선에서 접으면 두 반쪽이 같은 자리에 포개진다.' : '하트의 왼쪽과 오른쪽은 가운데 선에서 같은 거리로 떨어져 있다.',
      rect(0, 0, 600, 270, pale) + left + right +
      (split ? path('M394 138q-32-53-79-29l13-19m-13 19 23 5', 'none', blue, 5) : '') +
      path('M300 24v211', 'none', blue, 4, 'stroke-dasharray="8 7"') +
      label(300, 257, split ? '접으면 두 반쪽이 포개져요' : '파란 점선을 따라 접어 볼까요?', 23), 270);
  }

  function decimalGrid(state) {
    const rows = 6, cols = 4, size = 19, x = 205, y = 50;
    const grid = Array.from({ length: 100 }, (_, i) => {
      const row = Math.floor(i / 10), col = i % 10, greenRow = row < rows, blueCol = col < cols;
      return rect(x + col * size, y + row * size, size, size, state === 0 ? greenRow ? mint : white :
        greenRow && blueCol ? '#69ad98' : greenRow ? mint : blueCol ? sky : white, '#6b8b89');
    }).join('');
    return picture(state === 0 ? '전체 백 칸 중 가로 여섯 줄을 색칠했다.' : '가로 여섯 줄과 세로 네 줄이 만나 24칸이 겹친다.',
      rect(0, 0, 600, 294, pale) + label(300, 36, state === 0 ? '전체 100칸' : '가로 6줄 × 세로 4줄', 25) + grid +
      path('M198 51h-13v113h13', 'none', green, 4) + label(145, 117, '0.6', 28, green) +
      (state === 1 ? path('M205 245v11h76v-11', 'none', blue, 4) + label(243, 282, '0.4', 25, blue) +
        label(478, 130, '24칸', 27, green) + label(478, 173, '0.24', 32, green) : ''), 294);
  }

  function cuboidScene(state) {
    const edge = state === 1, vertex = state === 2;
    return picture('직육면체 모양의 상자에서 ' + ['윗면', '윗면과 옆면이 만나는 모서리', '모서리 세 개가 만나는 꼭짓점'][state] + '를 강조한다.',
      rect(0, 0, 600, 274, pale) +
      path('M171 102 245 50h198l-73 52Z', state === 0 ? '#80c5b0' : '#d7e9e2', green, 4) +
      path('M171 102h199v116H171Z', '#dceef1', blue, 4) +
      path('M370 102 443 50v116l-73 52Z', '#a6c7d5', blue, 4) +
      (edge ? path('M370 102 443 50', 'none', orange, 10) : '') +
      (vertex ? dot(370, 102, 12, orange, white, 4) : '') +
      label(300, 252, ['색칠한 넓은 부분', '두 면이 만나는 줄', '세 모서리가 만나는 점'][state], 28), 274);
  }

  function meanScene(state) {
    const values = state === 0 ? [2, 4, 6] : [4, 4, 4];
    return picture(state === 0 ? '첫째 2개, 둘째 4개, 셋째 6개로 모두 12개이다.' : '같게 나누면 각자 4개로 모두 12개이다.',
      rect(0, 0, 600, 276, pale) + label(300, 42, '모두 12개', 30) +
      [139, 300, 461].map((x, i) => rect(x - 65, 58, 130, 163, white, '#bccdc6', 12) +
        Array.from({ length: values[i] }, (_, j) => dot(x - 29 + (j % 2) * 57, 184 - Math.floor(j / 2) * 46, 18, state === 0 ? '#ffd186' : '#83c2ae', state === 0 ? orange : green, 3)).join('') +
        label(x, 253, values[i] + '개', 27, state === 0 ? orange : green)).join(''), 276);
  }

  function weatherScene(state) {
    const air = state === 1, skyward = state === 2;
    const drops = (x, y, count) => Array.from({ length: count }, (_, i) => icon('droplet', x + i * 46, y + (i % 2) * 21, 39)).join('');
    return picture(['풀잎에 물방울이 붙어 있다.', '땅 바로 위에 작은 물방울이 떠 있다.', '높은 하늘에 작은 물방울이 모여 있다.'][state],
      rect(0, 0, 600, 252, sky) + rect(0, 190, 600, 62, '#9ec28a') +
      (skyward ? icon('cloud', 218, 12, 159) + drops(251, 75, 2) :
        air ? path('M81 129h436m-463 28h482m-435 24h401', 'none', white, 12) + drops(181, 115, 6) :
          path('M296 199q-44-68-103-55 27 47 103 55m0 0q44-68 103-55-27 47-103 55Z', '#65a16f', green, 4) + drops(224, 122, 3)) +
      label(300, 235, ['풀잎 겉에 맺혀요', '땅 가까이에 떠 있어요', '높은 하늘에 모여 있어요'][state], 26, '#214539'), 252);
  }

  function climateScene(state) {
    const cold = state === 2, dry = state === 1;
    return picture(['비가 자주 내리는 열대 우림', '물이 적고 모래가 넓은 사막', '땅이 얼음으로 덮인 추운 지역'][state],
      rect(0, 0, 600, 247, cold ? '#dfedf5' : dry ? '#f6e3bc' : sky) +
      (dry ? path('M0 181q100-72 216 0 88-79 206-21 86-31 178 9v78H0Z', '#dca561', orange, 3) + icon('sun', 443, 21, 102) :
        cold ? path('M0 168l75-29 50 8 102-50 104 31 99-36 170 49v106H0Z', '#f5fcfe', '#7caabf', 3) +
          icon('mountain', 38, 53, 120) :
          rect(0, 168, 600, 79, '#8db584') + [55, 155, 250, 394, 489].map((x,i) => icon('tree', x, 72 + (i % 2) * 17, 102)).join('') +
          icon('cloud', 239, 2, 107) + path('M246 73l-10 19m41-18-10 19m43-20-10 20m44-20-10 20', 'none', blue, 4)) +
      rect(154, 195, 292, 41, white, line, 8) + label(300, 224, ['덥고 비가 자주 와요', '비가 적어요', '오래 춥고 얼음이 많아요'][state], 24), 247);
  }

  function blocksScene(state) {
    const block = (x, y) => place(
      path('M0 28 42 0 86 24 44 52Z', '#d8e9a5', green, 3) +
      path('M0 28 44 52v45L0 72Z', '#a2c088', green, 3) +
      path('M44 52 86 24v45L44 97Z', '#6c9d81', green, 3), x, y);
    const square = (x, y) => rect(x, y, 57, 57, mint, green, 4);
    const drawTop = square(335, 76) + square(392, 76) + square(392, 133);
    const drawFront = square(335, 133) + square(392, 133) + square(335, 76);
    return picture('왼쪽에 아래층 세 개와 위층 한 개가 쌓인 입체가 있다. 오른쪽은 ' + (state === 0 ? '위에서' : '앞에서') + ' 본 모습이다.',
      rect(0, 0, 600, 246, pale) + label(171, 41, '쌓은 모양', 26) + label(409, 41, state === 0 ? '위에서 본 모양' : '앞에서 본 모양', 25) +
      block(136, 93) + block(180, 117) + block(137, 145) + block(136, 48) +
      (state === 0 ? drawTop : drawFront), 246);
  }

  function decimalDivisionScene(state) {
    const scale = state === 0 ? '0.1 L' : '100 mL';
    const step = (i) => rect(60 + i * 40, 87, 37, 59, i % 6 < 3 ? mint : sky, i % 6 < 3 ? green : blue, 4);
    return picture('똑같은 크기의 작은 칸 12개가 있다. 세 칸씩 묶은 큰 묶음은 네 개이다.',
      rect(0, 0, 600, 263, pale) + label(300, 44, state === 0 ? '1.2 L를 0.3 L씩' : '1200 mL를 300 mL씩', 29) +
      Array.from({ length: 12 }, (_, i) => step(i)).join('') +
      [0, 1, 2, 3].map(i => path('M' + (60 + i * 120) + ' 154v14h117v-14', 'none', line, 3) +
        label(117 + i * 120, 202, (i + 1) + '번째', 23)).join('') +
      label(300, 244, '작은 칸 하나는 ' + scale, 24, green), 263);
  }

  function ratioScene(state) {
    const count = state === 0 ? 5 : 10;
    const x = (i) => state === 0 ? 120 + i * 90 : 76 + (i % 5) * 112;
    return picture('다섯 개 묶음마다 왼쪽 두 개와 오른쪽 세 개로 나눈다. ' + (state === 0 ? '한 묶음이다.' : '두 묶음이다.'),
      rect(0, 0, 600, 273, pale) + label(300, 41, state === 0 ? '5개를 2 : 3으로' : '10개를 같은 비로', 29) +
      Array.from({ length: count }, (_, i) => dot(x(i), 93 + Math.floor(i / 5) * 68, 24, i % 5 < 2 ? '#84bda9' : '#fac37f', i % 5 < 2 ? green : orange, 3)).join('') +
      label(196, 241, state === 0 ? '가 팀 2개' : '가 팀 4개', 26, green) +
      label(404, 241, state === 0 ? '나 팀 3개' : '나 팀 6개', 26, orange), 273);
  }

  function circleScene(state) {
    return picture(state === 0 ? '원의 중심을 지나 양쪽 테두리를 잇는 지름이 표시되어 있다.' : '원의 테두리가 강조되어 있다.',
      rect(0, 0, 600, 267, pale) + dot(300, 129, 94, '#e3efe8', state === 1 ? orange : green, state === 1 ? 8 : 3) +
      (state === 0 ? path('M206 129h188', 'none', blue, 6) + dot(300, 129, 7, blue) + label(300, 116, '중심', 24, blue) : '') +
      label(300, 253, state === 0 ? '중심을 가로지르는 길이' : '테두리 한 바퀴의 길이', 28), 267);
  }

  function roundBodiesScene(state) {
    const diagrams = [
      path('M233 70v99c0 18 134 18 134 0V70Z', '#99c4d3', blue, 4) +
        '<ellipse cx="300" cy="70" rx="67" ry="26" fill="#e4f3f7" stroke="' + blue + '" stroke-width="4"/>' +
        path('M233 168c0-17 134-17 134 0', 'none', blue, 3, 'stroke-dasharray="6 6"'),
      path('M300 44 228 166q2 31 72 31t72-31Z', '#f2c17d', orange, 4) +
        path('M228 166c0-21 144-21 144 0', 'none', orange, 3, 'stroke-dasharray="6 6"'),
      dot(300, 126, 77, '#8ac5ac', green, 4) + '<ellipse cx="300" cy="126" rx="77" ry="31" fill="none" stroke="' + green + '" stroke-width="3" stroke-dasharray="7 5"/>'
    ];
    return picture(['원기둥에는 원 모양의 밑면이 두 개 있다.', '원뿔에는 원 모양의 밑면이 하나 있다.', '구에는 평평한 밑면이 없다.'][state],
      rect(0, 0, 600, 257, pale) + diagrams[state] + label(300, 240, ['동그란 밑면 두 개', '동그란 밑면 한 개', '평평한 밑면이 없어요'][state], 28), 257);
  }

  function illustratedFlow(name, items, active = -1, connect = true) {
    const size = items.length === 3 ? 157 : 208;
    const starts = items.length === 3 ? [20, 222, 424] : [43, 349];
    const fit = (text, font) => Math.min(font, Math.floor((size - 14) / [...text].reduce((width, char) =>
      width + (char === ' ' ? .27 : /[ -~]/.test(char) ? .59 : 1), 0)));
    return picture(name, rect(0, 0, 600, 235, pale) + items.map(([symbol, heading, note], i) => {
      const x = starts[i], cx = x + size / 2, focus = active === i;
      return rect(x, 18, size, 196, focus ? mint : white, focus ? green : '#b7ccc5', 13) +
        icon(symbol, cx - 47, 31, 94) + label(cx, 157, heading, fit(heading, 25)) + label(cx, 189, note, fit(note, 20), line) +
        (connect && i + 1 < starts.length ? arrow(x + size + 4, 112, starts[i + 1] - 7, blue) : '');
    }).join(''), 235);
  }

  function heatScene(state) {
    const spoon = icon('cup', 147, 77, 128) + path('M216 166 363 58', 'none', '#7e8b91', 14) + path('M226 158 335 79l-18 2m18-2-9 16', 'none', orange, 4);
    const circulating = icon('cup', 219, 50, 162) + path('M277 171q-23-53 22-64l-12-4m12 4-9 9m34 5q23 47-17 54l12 4m-12-4 10-9', 'none', orange, 5);
    const sunlight = icon('sun', 125, 58, 104) + [94, 115, 136].map(y => arrow(248, y, 362, orange)).join('') + icon('face', 391, 63, 96);
    return picture(['뜨거운 물에 담긴 금속 숟가락을 따라 열이 옮겨 간다.', '따뜻한 물이 위로 움직이면서 열을 옮긴다.', '햇빛이 사람에게 도달하여 따뜻해진다.'][state],
      rect(0, 0, 600, 255, pale) + [spoon, circulating, sunlight][state] +
      label(300, 233, ['금속을 따라 이동', '물 자체가 움직임', '빛이 닿아 따뜻해짐'][state], 27), 255);
  }

  function shadowScene(state) {
    const high = state === 0;
    const shadow = high ? 68 : 211;
    const x = high ? 191 : 79, y = 140 - (318 - x) * 49 / shadow;
    return picture(high ? '태양이 높게 떠 있어 막대 그림자가 짧다.' : '태양이 낮게 떠 있어 막대 그림자가 길다.',
      rect(0, 0, 600, 260, sky) + rect(0, 188, 600, 72, '#adbf85') +
      icon('sun', x - 40, y - 39, 80) +
      path('M' + x + ' ' + y + 'L318 140 ' + (318 + shadow) + ' 189', 'none', orange, 4, 'stroke-dasharray="8 7"') +
      path('M318 140v49', 'none', ink, 8) + path('M318 188h' + shadow, 'none', '#55776a', 11) +
      label(300, 238, high ? '태양이 높을 때 · 짧은 그림자' : '태양이 낮을 때 · 긴 그림자', 26), 260);
  }

  function combustionScene(state) {
    const lit = state === 0;
    return picture(lit ? '탈 물질과 공기와 충분한 온도가 있어 촛불이 켜져 있다.' : '병 속 산소가 줄어 촛불이 꺼졌다.',
      rect(0, 0, 600, 262, pale) + rect(266, 121, 68, 91, '#efcf8c', orange, 7) + path('M300 121V101', 'none', '#674a3d', 5) +
      (lit ? path('M299 96q-34-8-10-41 9-12 10-27 34 37 21 55-7 15-21 13Z', '#ffb751', orange, 4) +
        path('M300 93q-15-7 0-27 15 18 0 27Z', '#fff5b8', 'none') + label(127, 81, '주변의 산소', 24, blue) + arrow(100, 105, 222, blue)
        : path('M205 212V80q0-34 31-34h128q31 0 31 34v132Z', '#e1eef6', blue, 3, 'fill-opacity=".37"') +
          label(450, 108, '병 속 산소가 줄어요', 22, blue)) +
      path('M180 213h240', 'none', line, 4) + label(300, 245, lit ? '촛불이 타요' : '촛불이 꺼져요', 26), 262);
  }

  function populationScene(state) {
    return picture('크기가 같은 땅 두 곳이 있다. 왼쪽에는 사람 네 명, 오른쪽에는 사람이 열두 명 있다.',
      rect(0, 0, 600, 241, pale) +
      [18, 312].map((x, i) => {
        const amount = i ? 12 : 4;
        return rect(x, 16, 269, 181, state === i ? mint : white, state === i ? green : '#b8cdc5', 12) +
          Array.from({ length: amount }, (_, j) => icon('face', x + 23 + (j % 4) * 59, 31 + Math.floor(j / 4) * 51, 40)).join('') +
          label(x + 134, 226, amount + '명이 살아요', 24);
      }).join(''), 241);
  }

  function grammarScene(state) {
    return picture('민서가 빨간 공을 찬다. 문장에서 민서가와 차요를 바꾸어 강조한다.',
      rect(0, 0, 600, 241, pale) + icon('face', 142, 21, 96) + dot(385, 98, 27, '#ec9d84', orange, 3) + arrow(249, 93, 341, blue) +
      rect(80, 145, 136, 62, state === 0 ? sand : white, state === 0 ? orange : line, 9) +
      rect(233, 145, 136, 62, white, line, 9) + rect(386, 145, 136, 62, state === 1 ? mint : white, state === 1 ? green : line, 9) +
      label(148, 185, '민서가', 29) + label(301, 185, '공을', 29) + label(454, 185, '차요', 29), 241);
  }

  function noticeScene(state) {
    const display = (x, ready, good, date, words) =>
      rect(x, 19, 267, 183, ready ? good ? mint : sand : white, ready ? good ? green : orange : line, 13) +
      icon(good ? 'note' : 'tablet', x + 18, 38, 67) + label(x + 161, 77, date, 22) +
      label(x + 133, 137, words[0], 25) + label(x + 133, 177, words[1], 22, good ? green : orange);
    return picture('왼쪽은 오래된 도서관 휴관 사진, 오른쪽은 이번 주 도서관 공식 안내이다.',
      rect(0, 0, 600, 226, pale) + display(19, state === 0, false, '지난달', ['오늘 휴관', '다시 올라온 사진']) +
      display(314, state === 1, true, '이번 주', ['오늘 문 열어요', '도서관 공지']), 226);
  }

  function compromiseScene(state) {
    const agreed = state === 1;
    return picture(agreed ? '두 학생이 모두 올 수 있는 수요일에 시간표가 모인다.' : '학생 둘이 각각 화요일과 수요일을 제안한다.',
      rect(0, 0, 600, 248, pale) + icon('face', 36, 53, 83) + icon('face', 481, 53, 83) +
      rect(147, 26, 306, 188, white, '#b4c8c4', 13) + label(300, 66, '모둠 연습 날짜', 26) +
      rect(165, 87, 123, 69, agreed ? white : sand, agreed ? line : orange, 8) +
      rect(311, 87, 123, 69, mint, green, 8) + label(226, 132, '화요일', 25) + label(372, 132, '수요일', 25) +
      (agreed ? arrow(101, 185, 358, green) + arrow(493, 185, 390, green) : arrow(105, 180, 223, orange) + arrow(498, 180, 378, green)) +
      label(300, 238, agreed ? '둘 다 올 수 있는 날을 골라요' : '서로 다른 날을 말했어요', 22), 248);
  }

  function clueScene(state) {
    const shoe = (x, y) => '<ellipse cx="' + x + '" cy="' + y + '" rx="9" ry="17" fill="#78a7bb" transform="rotate(30 ' + x + ' ' + y + ')"/>';
    return picture('문 옆에 젖은 우산과 젖은 발자국이 보인다. 창밖에 비가 내린다.',
      rect(0, 0, 600, 255, pale) + rect(36, 35, 186, 157, '#cfe8f6', blue, 8) + path('M128 35v157M36 108h186', 'none', blue, 4) +
      icon('cloud', 90, 49, 74) + path('M63 124l-10 18m51-24-10 18m55-10-10 18m47-19-10 18', 'none', blue, 4) +
      rect(260, 35, 298, 191, state === 0 ? white : sand, state === 0 ? line : orange, 12) +
      path('M330 115q32-65 91-8l-15 8-16-6-18 10-15-5Z', '#efaa7c', orange, 4) +
      path('M379 111v46q0 17 14 10', 'none', ink, 4) +
      shoe(446, 165) + shoe(470, 188) + shoe(505, 169) + icon('droplet', 315, 145, 33) +
      label(300, 247, state === 0 ? '지금 보이는 것부터 찾아요' : '젖은 우산과 발자국이 단서예요', 22), 255);
  }

  function stageScene(state) {
    return picture('무대에서 배우가 문을 열고 조심스럽게 걸어 들어온다. 대사와 행동을 따로 표시한다.',
      rect(0, 0, 600, 242, pale) + path('M10 7h106L77 158H10ZM590 7H484l39 151h67Z', '#bc806e', '#79463e', 3) +
      rect(125, 54, 83, 107, sand, orange, 3) + dot(193, 113, 4, orange) + icon('face', 204, 87, 73) +
      rect(297, 33, 191, 51, state === 0 ? mint : white, state === 0 ? green : line, 8) + label(392, 66, '“누구 있어요?”', 25) +
      rect(297, 102, 196, 62, state === 1 ? sand : white, state === 1 ? orange : line, 8) + label(395, 139, '(살며시 문을 연다)', 20) +
      path('M18 178h564v33H18Z', '#c8a180', orange, 3) + label(300, 236, state === 0 ? '관객이 듣는 말' : '배우가 보고 하는 행동', 23), 242);
  }

  function screenTimeScene(state) {
    const width = state === 0 ? 281 : 95;
    return picture(state === 0 ? '밤에 영상 시청이 길어 잠드는 시간이 늦어진다.' : '영상 시청을 줄여 잠들 준비를 하는 시간이 생긴다.',
      rect(0, 0, 600, 239, pale) + icon('tablet', 60, 42, 107) +
      rect(185, 64, 347, 51, sky, blue, 9) + rect(185, 64, width, 51, '#68a9bf', 'none', 9) +
      label(351, 151, state === 0 ? '영상 60분' : '영상 20분', 28, blue) +
      label(300, 209, state === 0 ? '잠잘 시간이 늦어져요' : '잠잘 준비 시간이 생겨요', 25), 239);
  }

  function figurativeScene(state) {
    const light = '#f5d478';
    return picture('왼쪽 밤하늘에 작은 별이 빛나고 오른쪽에 손전등의 빛이 보인다. 어두운 곳에 밝은 불빛이 있다는 점이 같다.',
      rect(0, 0, 600, 231, pale) + rect(17, 19, 276, 167, '#253953', state === 0 ? orange : line, 11) +
      rect(309, 19, 275, 167, '#253953', state === 1 ? orange : line, 11) +
      path('M152 51 161 78 189 87 161 96 152 123 143 96 115 87 143 78Z', light, 'none') +
      [58, 96, 205, 248].map((x, i) => dot(x, 51 + i * 19, 3, light)).join('') +
      path('M419 86l124-30v87l-124-28Z', '#e5b45e', 'none') +
      rect(345, 91, 58, 23, '#b6c4d5', ink, 6) + path('M402 92l20-9v39l-20-9Z', '#d3dbdf', ink, 3) +
      label(300, 216, '어두운 곳에서 작은 빛이 보여요', 26), 231);
  }

  const history = activity('글을 남기기 전에는 무엇으로 알 수 있을까?', '두 시대 비교', [
    ['글이 남기 전', '집터와 토기, 돌 도구를 살펴 옛사람이 어떻게 살았는지 알아봐요.'],
    ['글이 남은 뒤', '비석에 새긴 글처럼 사람이 직접 남긴 기록도 읽을 수 있어요.']
  ], timeScene, question('글은 없고 집터와 토기가 남았어요. 어떤 단서로 생활을 알아볼까요?',
    '집터와 토기를 살펴요', '맞아요. 집터로 집의 모습, 토기로 무엇을 담았을지 짐작해요.',
    [['그때 사람이 쓴 일기를 읽어요', '이 장면에는 당시 사람이 남긴 글이 없어요. 땅에 남은 흔적을 찾아보세요.']]), {
    parts: [['先', '먼저 선'], ['史', '역사 사']],
    wordResult: '선사 시대(先史時代) · 사람들이 쓴 기록이 남기 전',
    english: 'prehistoric period · pre-는 ‘앞선’, historic은 ‘역사와 관련된’이라는 뜻이에요.',
    details: [
      ['어떤 때를 말할까?', ['그곳에 살던 사람이 글로 남긴 기록을 아직 찾아볼 수 없는 때예요. 그때도 사람들은 집을 짓고 물건을 만들었어요.', '문자를 쓰기 시작한 때는 지역마다 달라요. 세계 어디나 같은 해에 선사 시대가 끝난 건 아니에요.']],
      ['왜 ‘선사’일까?', ['先은 ‘먼저, 앞서’, 史는 ‘역사’를 뜻해요. 여기서는 ‘문자로 남은 역사가 시작되기 전’이라고 읽으면 쉬워요.', '영어로 시대를 말할 때는 prehistoric period, 그 시기 자체를 가리키는 명사는 prehistory예요.']],
      ['두 장면에서 써 보기', ['선사 시대의 집터에서 불을 피운 흔적을 찾았어요.', '역사 시대의 비석에 남은 글을 읽어 누가 세웠는지 조사했어요.']],
      ['함께 구별하기', ['선사 시대는 어느 때인지를 가리키는 말이에요. 유적은 남은 장소, 유물은 남은 물건을 가리켜요.', '구석기 시대와 신석기 시대는 선사 시대에 속하는 시기를 나눈 이름이에요.']]
    ],
    writing: {
      prompt: '친구가 “글이 하나도 없는데 어떻게 옛집이 있었는지 알아?”라고 물었어요. 한 문장으로 답해 보세요.',
      guide: '집터에서 무엇을 보고 어떤 사실을 짐작하는지 연결해 보세요.',
      example: '땅에 나란히 남은 기둥 구멍을 보면 선사 시대 사람들이 그곳에 집을 지었음을 짐작할 수 있어요.'
    }
  });
  const excavation = activity('발굴한 자리를 보면 세 단어가 갈라져요', '어느 단서를 보고 있나요?', [
    ['유적', '집을 옮겨 갈 수는 없지만, 땅에 남은 집터에서 옛집의 자리를 알 수 있어요.'],
    ['유물', '그곳에서 건져 올린 토기나 돌 도구는 옛사람이 쓰던 물건이에요.'],
    ['사료', '집터와 토기 모두 옛날 일을 알아보는 데 쓰면 사료가 될 수 있어요.']
  ], digScene, question('땅에서 찾아 박물관에 옮겨 놓은 토기는 무엇일까요?',
    '유물', '맞아요. 토기는 옛사람이 만든 물건이므로 유물이에요. 옛 생활을 연구할 때는 사료로도 써요.',
    [['유적', '토기가 나온 자리 전체는 유적이지만, 옮겨 온 토기 한 점은 옛 물건이에요.']]), {
    wordResult: '유적(遺跡)은 남은 자취, 유물(遺物)은 남은 물건',
    english: 'archaeological site · 유적 / artifact · 유물 / historical source · 사료',
    details: [
      ['어디에 남았나요?', ['遺는 ‘남다’, 跡은 ‘자취’, 物은 ‘물건’이라는 뜻이에요. 땅에 남은 옛집의 자리는 유적이고, 거기서 나온 토기는 유물이에요.']],
      ['무엇을 알아낼 때 쓰나요?', ['옛날 일을 알아보려고 비석의 글, 옛 물건, 집터 같은 단서를 살피면 그것들이 사료가 돼요.']]
    ]
  });
  const mixed = activity('¼ 조각 일곱 개를 어떻게 두 가지로 읽을까?', '분수 조각 모으기', [
    ['조각 하나씩 보기', '한 조각이 ¼이에요. 그 조각을 일곱 개 셌으므로 7/4예요.'],
    ['네 조각을 한 개로 묶기', '네 조각이 온전한 한 개가 되고, ¼ 조각 세 개가 남아요. 양은 그대로예요.']
  ], (state) => quarters(state), { ...question('그림의 ¼ 조각을 네 개씩 묶으면 어떻게 쓸 수 있을까요?',
    '온전한 1개와 ¼', '맞아요. 네 조각은 1개, 남은 한 조각은 ¼이에요. 그래서 5/4 = 1과 ¼이에요.',
    [['온전한 1개와 ¾', '¾이 남으려면 묶고 나서 세 조각이 더 있어야 해요. 다섯 조각에서는 하나만 남아요.'],
      ['온전한 2개', '온전한 2개를 만들려면 ¼ 조각이 여덟 개 필요해요.']]), draw: () => quarters(0, 5, true) }, {
    parts: [['帶', '띠 대 · 데리고 있음'], ['分數', '분수 · 나누어 나타낸 수']],
    wordResult: '대분수(帶分數) · 자연수 1이 진분수 ¾을 데리고 있는 모양',
    english: 'mixed number · 자연수와 진분수를 함께 적은 수라서 mixed(섞인)라고 해요.',
    details: [
      ['온전한 것과 남은 조각', ['종이띠 한 개를 똑같이 4등분하면 한 조각이 ¼이에요. 같은 조각을 4개 붙이면 종이띠 한 개가 돼요.', '¼ 조각 7개는 4개와 3개로 나눌 수 있어요. 4개는 온전한 1개, 3개는 여전히 ¼ 조각이라 ¾이에요.']],
      ['왜 ‘대분수’일까?', ['帶는 ‘띠다, 지니다, 데리고 있다’는 뜻이에요. 자연수 부분에 남은 진분수가 함께 붙어 있어요.', '1과 ¾에서는 1이 온전한 개수, ¾이 한 개를 채우지 못한 부분이에요. 영어 mixed number도 두 부분을 함께 쓴다는 뜻이에요.']],
      ['가분수와 대분수', ['7/4는 ¼ 조각을 모두 세어 적은 가분수(improper fraction)예요.', '1과 ¾은 같은 양을 온전한 것과 남은 부분으로 나눠 적은 대분수예요. ¾만 놓으면 한 개보다 작으므로 진분수(proper fraction)예요.']],
      ['다른 상황에서도 읽기', ['피자 한 판과 ¾판이 있으면 모두 1과 ¾판이에요.', '⅕ 조각 12개를 다섯 개씩 묶으면 온전한 2개가 되고 두 조각이 남으므로 2와 ⅖예요.']]
    ],
    writing: {
      prompt: '⅓ 조각이 여덟 개 있어요. 온전한 개수와 남는 조각을 친구에게 설명해 보세요.',
      guide: '한 개를 만들려면 몇 조각이 필요한지, 묶은 뒤 몇 조각이 남는지 써 보세요.',
      example: '세 조각씩 모으면 온전한 두 개를 만들고 두 조각이 남아요. 그래서 대분수로 2와 ⅔예요.'
    }
  });
  const range = activity('12세인 친구가 통과할 수 있을까?', '나이 기준 바꾸기', [
    ['이상', '12세부터 들어가요. 12세 자리에 찍힌 점이 꽉 차 있어요.'],
    ['초과', '12세보다 많아야 들어가요. 동그라미가 비어 있으므로 12세는 멈춰요.'],
    ['이하', '12세까지 들어가요. 화살표가 어린 쪽으로 가고, 12세도 들어가요.'],
    ['미만', '12세보다 어린 친구만 들어가요. 12세 자리는 비어 있어요.']
  ], rangeScene, question('“12세 미만 무료”라고 적혀 있어요. 딱 12세인 친구는?',
    '무료 대상에서 빠져요', '맞아요. 12세보다 어린 친구만 무료이고, 12세는 빠져요.',
    [['무료 대상에 들어가요', '‘미만’ 그림에서 12세 점은 비어 있어요. ‘이하’였다면 12세도 들어가요.']]), {
    english: 'at least · 이상 / more than · 초과 / at most · 이하 / less than · 미만',
    details: [
      ['딱 기준이 되는 수를 먼저 보세요', ['이상과 이하는 기준인 12를 포함해요. 수직선에서 12를 색칠한 점으로 나타내요.', '초과와 미만은 12를 빼요. 그래서 12에 가운데가 빈 점을 그려요.']],
      ['그다음 화살표 방향을 보세요', ['이상과 초과는 큰 수 쪽을 봐요. 이하와 미만은 작은 수 쪽을 봐요.']]
    ]
  });

  const interview = activity('텃밭을 누가 만들었는지 어떻게 알아볼까?', '면담 장면에서 역할 찾기', [
    ['질문', '모르는 것을 알아보려고 학생이 “언제 만들었어요?”라고 물어요.'],
    ['면담 대상', '그때 학교에 다녀서 아는 졸업생이 답해요. 질문을 받는 사람이 면담 대상이에요.'],
    ['매체', '떨어져 있어도 화면과 소리를 통해 만날 수 있어요. 여기서는 화상 통화가 매체예요.']
  ], interviewScene, question('텃밭을 처음 만든 사람을 알고 싶어요. 어떤 질문이 맞을까요?',
    '“처음 만든 분은 누구예요?”', '맞아요. ‘누구예요?’라고 물으면 사람을 알 수 있어요.',
    [['“요즘도 토마토가 자라요?”', '그 질문은 지금 자라는 식물을 알 수 있어요. 처음 만든 사람을 알려면 ‘누구’를 물어야 해요.']]), {
    parts: [['面', '얼굴 면 · 마주함'], ['談', '말씀 담 · 이야기함']],
    wordResult: '면담(面談) · 필요한 것을 알아보려고 사람과 이야기를 주고받는 일',
    english: 'interview · 이 단원에서는 질문을 하고 답을 듣는 대화를 뜻해요.',
    details: [
      ['그냥 이야기할 때와 무엇이 다를까?', ['친구와 점심 이야기를 나눌 때는 꼭 알아내야 할 것이 없을 수 있어요. 텃밭이 언제 생겼는지 알고 싶어 졸업생에게 묻고 답을 들으면 면담이에요.']],
      ['말의 조각과 영어', ['面에는 얼굴을 마주한다는 뜻이 있고 談은 이야기를 한다는 뜻이에요. 같은 장소에서 만나거나 화상으로 만나도 질문하고 답할 수 있어요.']],
      ['질문이 달라지면 알게 되는 것도 달라요', ['“누가 만들었나요?”는 사람, “언제 만들었나요?”는 때, “왜 만들었나요?”는 이유를 알아보는 질문이에요.', '답을 들은 뒤 “그때 몇 반이 함께했나요?”처럼 더 궁금한 것을 물을 수도 있어요.']],
      ['함께 구별하기', ['면담은 만남과 질문·답이 오가는 전체 활동이에요. 질문은 그때 묻는 말, 면담 대상은 답을 들을 사람이에요.', '매체는 말을 전해 주는 방법이에요. 화면으로 만나면 화상 통화가 매체가 돼요.']]
    ],
    writing: {
      prompt: '학교 도서관을 이용하는 학생이 언제 많은지 알고 싶어요. 누구를 만나 어떤 질문을 하겠어요?',
      guide: '그 일을 알고 있는 사람과, 원하는 정보를 물을 수 있는 질문을 함께 써 보세요.',
      example: '사서 선생님을 만나 “하루 중 학생들이 가장 많이 오는 때는 언제예요?”라고 물을 거예요.'
    }
  });

  const reading = activity('같은 이야기를 무엇으로 읽을까?', '책을 읽는 수단 비교', [
    ['종이책', '종이에 인쇄된 글을 읽어요. 종이 페이지를 손으로 넘겨요.'],
    ['전자책', '기기 화면에 뜨는 글을 읽어요. 읽기 앱에서 글자 크기를 바꿀 수도 있어요.']
  ], readingScene, question('두 책의 이야기는 같아요. 무엇이 바뀌었을까요?',
    '이야기를 전하는 수단', '맞아요. 종이와 화면처럼 내용을 전하는 수단을 매체라고 해요.',
    [['이야기의 사건', '책을 읽는 수단이 바뀌어도 같은 이야기라면 사건은 그대로예요.']]), {
    parts: [['媒', '매개할 매 · 이어 줌'], ['體', '몸 체 · 형태']],
    wordResult: '매체(媒體) · 글이나 말, 그림을 사람에게 전하는 수단',
    english: 'medium · 내용을 전하는 한 가지 수단. 여러 가지를 말할 때는 media라고 해요.',
    details: [
      ['어떤 일을 하나요?', ['책에 있는 이야기가 눈에 보이려면 글을 담아 전할 것이 필요해요. 종이와 화면이 그런 역할을 해요.']],
      ['다른 곳에서도 찾아보기', ['학교 안내를 방송으로 하면 소리로 들려요. 벽보로 하면 글과 그림으로 볼 수 있어요.', '전자책은 책의 한 형태이고, 영상과 라디오도 정보를 전하는 매체가 될 수 있어요.']],
      ['함께 구별하기', ['내용은 전달하려는 이야기나 정보예요. 매체는 그 내용을 사람에게 전하는 수단이에요.']]
    ]
  });

  const landscape = activity('산과 바다가 있는 곳에서 땅의 모양 찾기', '지형 표시 바꾸기', [
    ['산지', '높은 산이 이어진 부분이에요. 땅의 높낮이가 커요.'],
    ['평야', '집 옆에 넓고 평평한 땅이 펼쳐져 있어요.'],
    ['하천', '산에서 내려온 물이 땅을 따라 흐르는 물길이에요.'],
    ['해안', '육지와 바다가 맞닿은 부분이에요. 물길이 바다와 만나는 곳도 보이죠.']
  ], landscapeScene, question('배에서 내려 바다 바로 옆 마을을 걸어요. 어느 부분일까요?',
    '해안', '맞아요. 바다와 땅이 맞닿는 곳이 해안이에요.',
    [['하천', '하천은 강이나 개울처럼 땅을 따라 흐르는 물길이에요. 바다와 땅이 닿는 부분을 찾아보세요.']]), {
    parts: [['地', '땅 지'], ['形', '모양 형']],
    wordResult: '지형(地形) · 높낮이와 생김새로 살펴본 땅의 모습',
    english: 'landform · 산, 평야, 골짜기 같은 지형의 모양을 가리켜요.',
    details: [
      ['장소를 바라보는 기준', ['지형을 살필 때는 얼마나 높고 낮은지, 어떤 모양인지 봐요. 같은 지역에서도 산, 평야, 물길, 바닷가를 모두 볼 수 있어요.']],
      ['실제 장소에서 찾아보기', ['안데스산맥 주변에는 높고 비탈진 산지가 있어요.', '나일강은 북아프리카를 흐르는 하천이에요. 노르웨이에는 바다가 육지 안쪽으로 깊이 들어온 해안이 있어요.']],
      ['함께 구별하기', ['지형은 땅의 모양이에요. 기후는 여러 해 동안 나타난 날씨의 특징이에요.']]
    ]
  });

  const filtering = activity('섞인 모래와 소금을 어떻게 다시 꺼낼까?', '실험 과정 보기', [
    ['물에 넣어요', '소금은 물에 녹고 모래 알갱이는 바닥에 남아요.'],
    ['거름종이로 걸러요', '모래는 종이 위에 남아요. 물과 물에 녹은 소금은 함께 통과해요.'],
    ['물을 증발시켜요', '물만 공기 중으로 날아가고 접시에 소금이 남아요.']
  ], filterScene, question('거름종이 아래 모인 소금물에서 소금을 다시 얻으려면?',
    '물을 증발시켜요', '맞아요. 물이 공기 중으로 날아가면 녹아 있던 소금이 남아요.',
    [['같은 거름종이로 다시 걸러요', '물에 녹은 소금은 물과 함께 거름종이를 통과해요. 물을 없애는 방법을 골라 보세요.']]), {
    parts: [['分', '나눌 분'], ['離', '떠날 리 · 떨어짐']],
    wordResult: '분리(分離) · 섞인 것을 따로 나누어 떼어 내는 일',
    english: 'separation · 물질을 성질의 차이에 따라 나누는 일이에요.',
    details: [
      ['세 과정은 각각 무슨 일을 할까?', ['용해는 물질이 액체에 녹아 고르게 섞이는 일이에요. 소금은 안 보여도 소금물 속에 있어요.', '거름은 액체는 통과시키고 녹지 않은 고체를 남겨요. 증발은 액체의 일부가 기체가 되어 공기 중으로 퍼지는 현상이에요.']],
      ['다른 상황에서도 써 보기', ['알갱이가 큰 자갈과 작은 모래는 체로 분리할 수 있어요.', '물과 기름이 층을 이루면 위의 기름을 스포이트로 조금씩 빼낼 수 있어요.']]
    ]
  });

  const evidence = activity('“믿을 수 있어”라는 말을 무엇으로 뒷받침할까?', '작품을 읽고 말하는 두 부분', [
    ['의견', '작품을 읽고 내가 든 생각이에요. 같은 장면을 보고 친구는 다른 생각을 할 수도 있어요.'],
    ['근거', '인물이 빌린 책을 약속한 날에 돌려주는 장면이 있어요. 그 장면을 들어 내 생각을 설명해요.']
  ], evidenceScene, question('“인물이 친절해요”라는 의견을 뒷받침하는 근거는?',
    '길을 잃은 아이를 집까지 데려다줬어요.', '맞아요. 인물이 친절하다고 판단한 까닭을 보여 주는 행동이에요.',
    [['나는 주인공이 참 좋아요.', '그 말도 생각이나 느낌이에요. 왜 친절하다고 느꼈는지 보여 주는 행동을 골라 보세요.']]), {
    parts: [['根', '뿌리 근'], ['據', '근거 거 · 기대어 섬']],
    wordResult: '근거(根據) · 내 생각을 지탱하는 실제 장면이나 자료',
    english: 'evidence · 주장을 뒷받침하는 사실이나 단서.',
    details: [
      ['생각과 장면을 짝짓기', ['“약속을 잘 지켜요”는 내가 내린 판단이에요. “화요일에 돌려주기로 한 책을 화요일에 돌려줬어요”는 그 판단을 떠받치는 장면이에요.']],
      ['근거가 잘 맞는지 보기', ['“그 인물은 파란 옷을 입었어요”가 글에 나온 사실이어도, 약속을 지켰다는 판단을 뒷받침하기는 어려워요. 근거는 의견과 이어져야 해요.']]
    ]
  });

  const viewpoints = activity('같은 빈터에서 왜 다른 생각이 나올까?', '어떤 사람이 보는지 바꾸기', [
    ['주민이 보는 자리', '앉아 쉬는 곳이 부족하다고 느끼는 주민은 나무 그늘과 벤치를 떠올려요.'],
    ['학생이 보는 자리', '뛰어놀 곳이 부족하다고 느끼는 학생은 농구대를 떠올려요.']
  ], viewpointsScene, question('운동하는 학생의 글을 읽고 주민의 글도 읽었어요. 새로 보이는 것은?',
    '같은 빈터에도 서로 다른 필요가 있다는 점', '맞아요. 누구의 입장에서 보느냐에 따라 중요하게 여기는 점이 달라져요.',
    [['둘 중 한 사람은 다른 빈터를 봤다는 점', '두 사람은 같은 빈터를 봤어요. 바뀐 것은 장소가 아니라 그 장소를 바라본 관점이에요.']]), {
    parts: [['觀', '볼 관'], ['點', '점 점 · 지점']],
    wordResult: '관점(觀點) · 어떤 자리에서, 무엇을 중요하게 보느냐',
    english: 'point of view · 대상을 바라보는 입장이나 방식.',
    details: [
      ['글에서 관점 찾기', ['“여름에 쉴 그늘이 없어요”를 먼저 쓴 글은 쉼을 중요하게 봐요. “방과 후에 뛸 곳이 없어요”를 먼저 쓴 글은 놀이를 중요하게 봐요.']],
      ['읽고 나서 쓰기', ['두 사람이 같이 쓸 방법을 찾고 싶다면 한쪽 의견만 읽기보다 어떤 필요가 다른지 먼저 비교해 봐요.']]
    ]
  });

  const circuit = activity('스위치 하나로 왜 불이 켜졌다 꺼질까?', '스위치 움직이기', [
    ['열린 스위치', '두 점 사이가 떨어져 전기가 돌아갈 길이 끊겼어요. 전구가 꺼져 있어요.'],
    ['닫힌 스위치', '스위치의 두 점이 이어졌어요. 전기가 흐르자 전구에 불이 켜져요.']
  ], circuitScene, question('스위치를 닫았는데 전지 쪽 전선 하나가 빠져 있어요. 불이 켜질까요?',
    '꺼져 있어요.', '맞아요. 스위치가 닫혀도 전지가 있는 쪽에서 길이 끊기면 전류가 흐를 수 없어요.',
    [['켜져요.', '전기가 흐르려면 길이 한 바퀴 이어져야 해요. 빠진 전선 자리를 찾아보세요.']]), {
    parts: [['回', '돌 회'], ['路', '길 로']],
    wordResult: '전기 회로(電氣回路) · 전기가 이어진 길을 따라 흐르는 구조',
    english: 'electric circuit · 전기 부품을 연결해 전기가 흐를 수 있게 만든 길.',
    details: [
      ['한 바퀴를 따라가 보기', ['전지에서 시작해 전선, 전구, 스위치를 따라 다시 전지로 돌아올 수 있는지 확인해 보세요.', '스위치는 문처럼 길을 이어 주거나 끊어요. 닫힘은 전기 길이 이어진 상태예요.']],
      ['함께 구별하기', ['전지는 전기를 흐르게 하는 데 필요한 에너지를 공급해요. 전선은 길을 이어 주고, 전구는 전기가 흐르면 빛을 내요.']]
    ]
  });

  const multiplyFraction = activity('⅔만큼 칠한 종이에서 다시 ¾을 고르면?', '색칠한 영역 바꾸기', [
    ['먼저 ⅔을 칠해요', '전체를 가로로 같은 크기 세 줄로 나누고 두 줄을 골라요.'],
    ['그중에서 ¾을 골라요', '세로 네 칸 중 세 칸을 골라요. 두 색이 겹치는 곳은 전체 12칸 가운데 6칸이에요.']
  ], multiplyFractionScene, question('두 색이 겹친 넓이를 종이 전체에 대한 분수로 쓰면?',
    '6/12', '맞아요. 전체는 12칸이고 두 색이 겹친 것은 6칸이에요. 6/12는 1/2과 같은 크기예요.',
    [['6/8', '8칸은 먼저 색칠한 두 줄에 있는 칸 수예요. 종이 전체를 기준으로 하면 12칸이에요.']]), {
    wordResult: '분수의 곱셈 · “어떤 양의 일부”를 다시 고를 수 있어요.',
    english: 'multiplying fractions · 분수끼리 곱하기.',
    details: [
      ['숫자가 어디서 왔을까?', ['3줄과 4칸이 만나 전체는 12칸이에요. 고른 2줄과 3칸이 만나는 곳은 6칸이에요.']],
      ['분모와 분자를 따로 세기', ['분모 3과 4를 곱하면 전체를 몇 칸으로 나누었는지 알아요. 분자 2와 3을 곱하면 그중 몇 칸을 골랐는지 알아요.']]
    ]
  });

  const divideFraction = activity('¾ 안에 ¼ 묶음이 몇 개 들어갈까?', '한 묶음 크기 바꾸기', [
    ['¼씩 묶기', '색칠한 세 칸을 한 칸씩 묶으면 3묶음이에요. ¾ ÷ ¼ = 3이에요.'],
    ['½씩 묶기', '두 칸이 한 묶음이에요. 세 칸은 두 칸짜리 한 묶음과 그 절반이에요.']
  ], divideFractionScene, question('¾을 ½씩 묶었을 때 남은 한 칸은 한 묶음의 얼마일까요?',
    '한 묶음의 절반', '맞아요. 한 묶음은 두 칸이므로 남은 한 칸은 반 묶음이에요.',
    [['한 묶음의 ¼', '남은 한 칸은 전체 띠의 ¼이에요. 여기서는 두 칸짜리 묶음을 기준으로 비교해요.']]), {
    parts: [['商', '몫 상']],
    wordResult: '몫 · 여기서는 주어진 양에 한 묶음이 몇 번 들어가는지 나타내요.',
    english: 'quotient · 나눗셈의 결과.',
    details: [
      ['묶음 크기를 먼저 보기', ['나누는 수 ¼ 또는 ½이 한 묶음의 크기예요. 같은 양 ¾도 묶음 크기에 따라 몫이 달라져요.']],
      ['“남은 ¼”과 “반 묶음”은 왜 같을까?', ['남은 한 칸을 전체 띠와 비교하면 ¼이에요. 한 묶음인 ½과 비교하면 반 묶음이에요. 무엇을 기준으로 세는지 확인해요.']]
    ]
  });

  const rounding = activity('368을 300과 400 중 어느 쪽으로 어림할까?', '어림하는 방법 바꾸기', [
    ['올림', '백의 자리 아래에 수가 남아 있어요. 더 큰 400 쪽으로 가요.'],
    ['버림', '백의 자리 아래에 남은 68을 버려요. 300이 돼요.'],
    ['반올림', '368은 중간인 350을 지났어요. 더 가까운 400 쪽으로 가요.']
  ], roundingScene, question('368명이 모두 앉아야 해요. 의자를 100개 묶음으로 받는다면 어느 방법을 쓸까요?',
    '올림', '맞아요. 한 명도 빠지지 않게 400개를 받아요. 이 상황에서는 남아도 부족하면 안 돼요.',
    [['버림', '300개로는 68명이 앉을 자리가 부족해요.']]), {
    english: 'round up · 올림 / round down · 버림 / round to the nearest hundred · 백의 자리까지 반올림',
    details: [
      ['방법을 먼저 정하기', ['의자가 모자라면 안 될 때는 올림, 남는 것을 빼고 몇 묶음인지 셀 때는 버림이 맞아요.', '가까운 대략의 수가 필요할 때는 반올림을 써요. 368에서는 올림과 반올림의 결과가 우연히 같지만, 328에서는 달라요.']]
    ]
  });

  const symmetry = activity('하트의 두 반쪽은 접으면 포개질까?', '접기 전과 접는 모습 비교', [
    ['펼친 모습', '파란 선 양쪽에 모양이 있어요. 선에서 같은 거리인지 눈으로 따라가 보세요.'],
    ['접어 보기', '오른쪽을 파란 선 쪽으로 접으면 왼쪽 위에 포개져요. 이 선이 대칭축이에요.']
  ], symmetryScene, question('하트의 위아래를 가르는 가로 선을 따라 접어도 포개질까요?',
    '포개지지 않아요.', '맞아요. 위쪽에는 둥근 부분 두 개, 아래쪽에는 뾰족한 끝 하나가 있어요.',
    [['포개져요.', '가로로 접으면 둥근 부분과 뾰족한 부분이 서로 만나 모양이 맞지 않아요.']]), {
    parts: [['對', '대할 대 · 마주 봄'], ['稱', '일컬을 칭']],
    wordResult: '선대칭 · 한 선을 따라 접었을 때 양쪽이 꼭 포개지는 관계',
    english: 'line symmetry · 한 선을 기준으로 한 대칭.',
    details: [['거울을 놓는 자리', ['대칭축 위에 거울을 놓으면 한쪽을 보고도 다른 쪽 모양을 짐작할 수 있어요.', '정사각형처럼 대칭축이 여러 개 있는 도형도 있어요. 어느 선에서 접어야 포개지는지 직접 찾아봐요.']]]
  });

  const decimals = activity('0.6만큼 칠하고 그중 0.4를 고르면 몇 칸일까?', '격자 칠하기', [
    ['먼저 0.6 칠하기', '정사각형 전체의 10줄 중 6줄을 칠해요.'],
    ['그중 0.4만 고르기', '10칸 중 가로로 4칸을 고르면 두 색이 만나는 곳이 24칸이에요.']
  ], decimalGrid, question('전체 100칸 중 24칸을 골랐어요. 소수로는 얼마일까요?',
    '0.24', '맞아요. 한 칸이 0.01이므로 24칸은 0.24예요.',
    [['2.4', '2.4라면 정사각형 두 개를 채우고도 남아요. 24칸은 한 개보다 작아요.']]), {
    english: 'decimal point · 소수점 / hundredths · 백분의 일 단위, 소수 둘째 자리',
    details: [['소수점이 어디에 와야 할까?', ['0.6의 6은 0.1이 여섯 개라는 뜻이에요. 0.4의 4는 0.1이 네 개라는 뜻이에요.', '작게 나눈 한 칸은 전체의 100분의 1이므로 24칸은 24/100, 곧 0.24예요.']]]
  });

  const cuboid = activity('상자에서 손가락으로 짚는 부분의 이름은?', '상자의 서로 다른 부분 찾기', [
    ['면', '상자 윗부분처럼 손바닥으로 덮을 수 있는 넓은 부분이에요.'],
    ['모서리', '두 면이 만나는 부분이에요. 손가락을 그 줄을 따라 움직일 수 있어요.'],
    ['꼭짓점', '모서리 세 개가 만나는 점이에요. 손끝으로 한 곳만 짚을 수 있어요.']
  ], cuboidScene, question('상자의 세 줄이 만나 손끝으로 한 점을 짚었어요. 어디일까요?',
    '꼭짓점', '맞아요. 모서리 여러 개가 모이는 한 점이에요.',
    [['면', '면은 상자를 덮는 넓은 부분이에요. 그림에서 모서리 세 개가 모이는 점을 보세요.']]), {
    english: 'face · 면 / edge · 모서리 / vertex · 꼭짓점',
    details: [['찾아 세어 보기', ['상자에는 앞·뒤, 왼쪽·오른쪽, 위·아래의 면이 있어요. 모두 여섯 면이에요.', '윗면 둘레 네 줄과 아랫면 둘레 네 줄, 위아래를 잇는 네 줄이 모두 모서리예요.']]]
  });

  const average = activity('세 사람 몫을 똑같게 나누면 몇 개씩일까?', '나누기 전후 비교', [
    ['나누기 전', '세 사람 앞에 2개, 4개, 6개가 있어요. 개수는 서로 달라도 모두 더하면 12개예요.'],
    ['같게 나눈 뒤', '6개를 가진 곳의 2개를 2개인 곳으로 옮겨요. 세 사람 앞에 4개씩 놓였어요.']
  ], meanScene, question('2개, 4개, 6개의 평균을 구할 때, 모두 더한 뒤 무엇으로 나눌까요?',
    '세 사람의 수인 3', '맞아요. 12개를 세 사람에게 똑같이 나누므로 12 ÷ 3 = 4예요.',
    [['가장 많은 개수인 6', '6은 한 사람이 가진 수예요. 나눠 받는 사람이 모두 몇 명인지 세어 보세요.']]), {
    parts: [['平', '평평할 평'], ['均', '고를 균']],
    wordResult: '평균(平均) · 모두 합한 뒤 수의 개수만큼 똑같이 나눈 값',
    english: 'average · 여기서는 모두 더해 개수로 나눈 평균을 말해요.',
    details: [['왜 평균을 쓰나요?', ['세 날 읽은 쪽수가 2쪽, 4쪽, 6쪽이어도 하루에 똑같이 읽었다고 생각하면 4쪽씩이에요.', '평균은 각 날의 실제 기록을 지우는 수가 아니라, 여러 수를 한 가지로 나타낸 수예요.']]]
  });

  const weather = activity('같은 작은 물방울인데 이름이 왜 다를까?', '물방울이 있는 곳 고르기', [
    ['이슬', '차가운 풀잎 겉에 물방울이 붙어 있어요.'],
    ['안개', '물방울이 땅 가까운 공기 속에 떠 있어요. 멀리 있는 것이 잘 안 보일 수 있어요.'],
    ['구름', '높은 하늘에 작은 물방울이나 얼음 알갱이가 모여 있어요.']
  ], weatherScene, question('아침에 풀잎을 만졌더니 물방울이 손에 묻었어요. 무엇일까요?',
    '이슬', '맞아요. 공기 속에 떠 있는 것이 아니라 풀잎에 맺혀 있었어요.',
    [['안개', '안개는 땅 가까운 공기 속에 떠 있어요. 풀잎에 붙어 있는 것은 이슬이에요.']]), {
    english: 'dew · 이슬 / fog · 안개 / cloud · 구름',
    details: [['어떻게 생기나요?', ['공기 속 물이 수증기로 있을 때는 보이지 않아요. 공기가 차가워지면 작은 물방울로 바뀔 수 있어요. 이 과정을 응결이라고 해요.', '물방울이 물체에 붙었는지, 가까운 공기 속에 떠 있는지, 하늘 높이 모였는지 보세요.']]]
  });

  const climate = activity('비가 자주 오는 곳과 거의 오지 않는 곳은 어떻게 다를까?', '서로 다른 지역 비교', [
    ['열대 우림', '일 년 내내 덥고 비가 많은 곳에서는 큰 나무가 빽빽하게 자랄 수 있어요.'],
    ['사막', '비가 오랫동안 적은 곳이에요. 식물이 자라기 어려운 곳도 있어요.'],
    ['극지방', '기온이 낮은 날이 오래 이어져 땅을 눈이나 얼음이 덮기도 해요.']
  ], climateScene, question('열대 우림에도 비가 오지 않는 하루가 있어요. 하루만 보고 기후가 건조하다고 할 수 있을까요?',
    '여러 해 동안의 날씨를 더 살펴봐야 해요.', '맞아요. 그날의 날씨와 여러 해 동안 나타난 특징인 기후를 구별해요.',
    [['하루 비가 안 왔으니 건조 기후예요.', '비가 오지 않은 하루만으로는 그 지역에 평소 비가 얼마나 오는지 알 수 없어요.']]), {
    parts: [['氣', '기운 기'], ['候', '기후 후 · 때의 상태']],
    wordResult: '기후(氣候) · 어느 곳에서 여러 해 동안 나타난 날씨의 특징',
    english: 'climate · 오랜 기간의 날씨 특징. 오늘의 날씨는 weather예요.',
    details: [['관찰할 것', ['평소 얼마나 덥거나 추운지, 비나 눈이 얼마나 오는지 살펴봐요.', '열대 지역 모두가 우림은 아니에요. 여기서는 덥고 비가 많은 열대 우림의 한 모습을 그렸어요.']]]
  });

  const blocks = activity('똑같은 쌓기나무도 보는 곳이 바뀌면?', '보는 방향 바꾸기', [
    ['위에서 보기', '아래로 내려다보면 나무가 놓인 자리가 보여요. 같은 자리에 두 개가 겹쳐 있어도 한 자리로 보여요.'],
    ['앞에서 보기', '앞에서 보면 각 줄에서 가장 높이 올라온 모양이 보여요. 뒤에 가려진 나무는 안 보일 수 있어요.']
  ], blocksScene, question('위에서 봤을 때 한 칸으로 보여요. 그 자리에 꼭 한 개만 있을까요?',
    '같은 자리에 여러 개가 쌓였을 수도 있어요.', '맞아요. 위에서 보면 같은 자리에 쌓인 개수를 바로 알 수 없어요.',
    [['한 칸이니 한 개뿐이에요.', '한 자리에서 아래위로 겹치면 위에서는 한 칸만 보여요.']]), {
    english: 'top view · 위에서 본 모양 / front view · 앞에서 본 모양',
    details: [['왜 그림이 달라질까?', ['위에서 보면 놓인 자리, 앞에서 보면 줄마다 보이는 높이에 주목해요. 두 그림을 함께 보면 가려진 정보를 더 찾을 수 있어요.']]]
  });
  const decimalDivision = activity('1.2 L를 0.3 L씩 나누면 컵이 몇 개 필요할까?', '같은 양을 두 단위로 보기', [
    ['리터로 보기', '작은 칸 하나가 0.1 L예요. 세 칸을 묶으면 컵 하나에 담는 0.3 L예요.'],
    ['밀리리터로 보기', '똑같은 작은 칸 하나를 100 mL라고 쓸 수 있어요. 세 칸을 묶으면 300 mL예요.']
  ], decimalDivisionScene, question('1.2 L ÷ 0.3 L와 1200 mL ÷ 300 mL의 몫은 어떻게 다를까요?',
    '둘 다 컵 네 개예요.', '맞아요. 물의 양과 컵의 크기를 같은 단위로 함께 바꿨으므로 묶음 수는 그대로예요.',
    [['mL로 바꾸면 컵이 더 많이 필요해요.', '숫자가 커졌어도 실제 물과 컵의 크기는 바뀌지 않았어요.']]), {
    english: 'decimal division · 소수의 나눗셈 / quotient · 몫',
    details: [['어느 수를 바꿀까?', ['같은 단위로 바꿀 때는 나누어지는 양과 한 묶음의 양을 함께 바꿔요. 한쪽만 바꾸면 같은 상황이 아니에요.']]]
  });
  const ratio = activity('공을 두 팀에 2 : 3으로 나눠 주려면?', '같은 비로 두 번 나누기', [
    ['공 다섯 개', '다섯 개 중 가 팀에 두 개, 나 팀에 세 개를 줘요.'],
    ['공 열 개', '똑같이 두 번 나누면 가 팀은 4개, 나 팀은 6개를 받아요.']
  ], ratioScene, question('공 열 개를 2 : 3으로 나눈 결과는?', '가 팀 4개, 나 팀 6개',
    '맞아요. 다섯 개를 2개와 3개로 나누는 일을 두 번 했어요.',
    [['가 팀 2개, 나 팀 8개', '전부 10개이기는 하지만 2 대 8은 2 대 3과 같은 비가 아니에요. 같은 묶음을 두 번 만들어 보세요.']]), {
    parts: [['比', '견줄 비'], ['例', '법식 례'], ['配分', '나누어 줌']],
    wordResult: '비례배분 · 전체를 같은 비가 되도록 나누는 일',
    english: 'proportional sharing · 양을 주어진 비에 맞춰 나누기.',
    details: [['비가 같다는 말', ['2 : 3의 두 수를 각각 2배 하면 4 : 6이 돼요. 그래서 2 : 3 = 4 : 6이라고 쓸 수 있어요.']]]
  });
  const circle = activity('원에서 한 바퀴와 가운데를 가로지르는 길이', '잴 길이 바꾸기', [
    ['지름', '원 위의 두 점을 중심을 지나도록 곧게 이어요.'],
    ['원주', '원을 이루는 테두리를 한 바퀴 따라가요.']
  ], circleScene, question('동그란 병 둘레에 리본을 한 바퀴 감으려면 어떤 길이가 필요할까요?',
    '원주', '맞아요. 리본은 원 테두리를 한 바퀴 둘러야 해요.',
    [['지름', '지름은 원의 가운데를 가로지르는 선의 길이예요. 리본은 테두리를 따라가요.']]), {
    parts: [['圓', '둥글 원'], ['周', '둘레 주']],
    wordResult: '원주(圓周) · 원의 테두리 한 바퀴 길이',
    english: 'circumference · 원의 둘레.',
    details: [['원주와 원주율 구별하기', ['원주는 원을 따라 잰 길이예요. 원주율은 그 길이가 지름의 몇 배인지 나타낸 수예요.']]]
  });
  const bodies = activity('깡통, 고깔, 공에서 평평한 부분 찾기', '입체 모양 바꾸기', [
    ['원기둥', '깡통처럼 위와 아래에 크기가 같은 원 모양의 밑면이 있어요.'],
    ['원뿔', '고깔처럼 아래에는 둥근 밑면 하나가 있고, 다른 쪽은 한 점으로 모여요.'],
    ['구', '공처럼 어디에서 보아도 둥글어요. 평평한 밑면이 없어요.']
  ], roundBodiesScene, question('원 모양 밑면 하나와 뾰족한 꼭짓점 하나가 있어요. 무엇일까요?',
    '원뿔', '맞아요. 고깔처럼 둥근 밑면에서 한 점으로 모여요.',
    [['원기둥', '원기둥의 위와 아래에는 크기가 같은 두 밑면이 있어요.']]), {
    english: 'cylinder · 원기둥 / cone · 원뿔 / sphere · 구',
    details: [['그림에서 세어 보기', ['평평한 밑면을 먼저 찾아보세요. 원기둥은 두 개, 원뿔은 한 개, 구는 없어요.']]]
  });

  const heat = activity('무엇을 따라 따뜻함이 옮겨 갔을까?', '열이 옮겨 가는 길 고르기', [
    ['전도', '뜨거운 물에 닿은 금속 숟가락을 따라 손잡이까지 따뜻해져요. 숟가락 자체는 움직이지 않아요.'],
    ['대류', '따뜻해진 물이 위로 움직이면서 열도 함께 옮겨 가요.'],
    ['복사', '태양에서 온 빛이 사람에게 닿으면 따뜻해져요. 그 사이에 물이나 금속이 이어질 필요가 없어요.']
  ], heatScene, question('냄비에 꽂아 둔 금속 국자의 손잡이까지 뜨거워졌어요. 어떤 방법일까요?',
    '전도', '맞아요. 국자가 움직이지 않아도 금속을 따라 열이 옮겨 갔어요.',
    [['대류', '대류는 물이나 공기 자체가 움직이면서 열을 함께 옮겨요. 이 장면에서는 금속 국자를 따라 옮겨 갔어요.']]), {
    english: 'conduction · 전도 / convection · 대류 / radiation · 복사',
    details: [['물어볼 한 가지', ['어떤 것이 실제로 움직였나요? 뜨거운 물과 공기는 움직일 수 있어요. 숟가락의 한쪽에서 다른 쪽으로 옮겨 가는 열은 숟가락을 움직이지 않아도 전달돼요.']]]
  });
  const resources = activity('햇빛을 모아 전구를 켤 수 있을까?', '전기가 오는 길 따라가기', [
    ['햇빛', '태양이 빛을 보내요. 햇빛은 자연에서 계속 공급되는 에너지원이에요.'],
    ['태양 전지', '햇빛을 받으면 전기를 만들 수 있어요.'],
    ['전구', '만든 전기로 전구에 불을 켤 수 있어요.']
  ], i => illustratedFlow('태양에서 온 빛으로 태양 전지가 전기를 만들어 전구에 불을 켠다.', [
    ['sun', '햇빛', '빛을 받아요'], ['solar', '태양 전지', '전기를 만들어요'], ['lamp', '전구', '빛을 내요']
  ], i), question('바람으로 풍력 발전기를 계속 돌릴 수 있어요. 어떤 자원을 이용하나요?',
    '재생 에너지', '맞아요. 바람처럼 자연에서 다시 공급되는 것을 이용해요.',
    [['석탄 같은 화석 연료', '석탄을 태워 얻는 것이 아니라, 자연에서 부는 바람을 이용해요.']]), {
    english: 'renewable energy · 자연에서 다시 공급되는 것을 이용하는 에너지.',
    details: [['다시 얻을 수 있는 것', ['햇빛과 바람은 자연에서 계속 공급돼요. 석탄과 석유는 다시 생기는 데 아주 오래 걸려요. 같은 시간 동안 쓰고 난 뒤 다시 얻기 쉬운지 비교해 보세요.']]]
  });
  const seasons = activity('그림자를 보고 태양이 높이 떴는지 알아볼까?', '태양이 있는 높이 바꾸기', [
    ['태양이 높이 떴을 때', '빛이 가파르게 내려와 막대 뒤에 짧은 그림자가 생겨요.'],
    ['태양이 낮게 떴을 때', '빛이 비스듬히 와서 그림자가 더 멀리 뻗어요.']
  ], shadowScene, question('같은 막대의 한낮 그림자가 겨울보다 여름에 짧았어요. 태양은 언제 더 높을까요?',
    '여름 한낮', '맞아요. 같은 막대라면 태양이 더 높을 때 그림자가 짧아요.',
    [['겨울 한낮', '태양이 낮을 때의 그림을 다시 눌러 보세요. 같은 막대의 그림자는 더 길어져요.']]), {
    parts: [['高', '높을 고'], ['度', '정도 도']],
    wordResult: '태양 고도 · 땅과 나란한 방향에서 태양까지 올려다본 각도',
    english: 'solar altitude · 태양을 올려다본 각도.',
    details: [['그림자를 재는 까닭', ['태양을 직접 눈으로 보면 위험해요. 같은 막대의 그림자 길이를 재면 태양이 높을 때와 낮을 때를 비교할 수 있어요.']]]
  });
  const burning = activity('촛불을 유리병으로 덮으면 왜 꺼질까?', '촛불이 있는 곳 바꾸기', [
    ['공기가 드나들 때', '촛불 주변에 산소가 계속 들어와요. 탈 물질, 산소, 타기 시작할 만큼 높은 온도가 있어요.'],
    ['병으로 덮었을 때', '새 공기가 들어오기 어려워요. 병 안의 산소가 줄어들면 불이 꺼져요.']
  ], combustionScene, question('촛농이 아직 남았는데 병을 덮자 불이 꺼졌어요. 무엇이 줄었을까요?',
    '산소', '맞아요. 탈 물질이 남아도 산소가 충분하지 않으면 계속 탈 수 없어요.',
    [['촛농', '그림의 초는 남아 있어요. 병을 덮기 전과 뒤에 공기가 드나드는지 비교해 보세요.']]), {
    parts: [['燃', '탈 연'], ['燒', '사를 소 · 불태움']],
    wordResult: '연소(燃燒) · 물질이 산소와 반응하며 열을 내고 타는 현상',
    english: 'combustion · 물질이 타는 현상.',
    details: [['불이 계속 타려면', ['탈 물질과 산소가 있어야 하고, 물질이 불붙기 시작할 수 있는 온도도 되어야 해요.', '실제 불을 쓰는 실험은 선생님과 함께 해야 해요. 그림에서 조건이 바뀌는 모습부터 살펴봐요.']]]
  });
  const careers = activity('깨끗한 물이 부족하면 어떤 일을 할 수 있을까?', '문제를 해결하는 일 따라가기', [
    ['물을 살펴봐요', '어디에 흙이나 오염 물질이 섞였는지 알아봐요.'],
    ['거르는 장치를 만들어요', '어떤 방법으로 물을 깨끗하게 할지 여러 장치를 만들어 비교해요.'],
    ['사람들에게 알려요', '검사한 결과를 보고서나 그림으로 전해요.']
  ], i => illustratedFlow('물을 살펴보고, 거르는 장치를 만들고, 결과를 알린다.', [
    ['magnify', '관찰하기', '물 살펴보기'], ['gear', '만들기', '장치 비교하기'], ['note', '알리기', '결과 전하기']
  ], i), question('검사 결과를 다른 사람이 이해하게 그림으로 전하고 싶어요. 그림에서 어떤 일일까요?',
    '알리기', '맞아요. 조사한 사실을 이해하기 쉽게 전하는 일도 과학과 이어져요.',
    [['장치 만들기', '장치를 만드는 일은 물을 처리할 방법을 시험하는 일이에요. 지금은 이미 나온 결과를 전하려고 해요.']]), {
    parts: [['進', '나아갈 진'], ['路', '길 로']],
    wordResult: '진로(進路) · 앞으로 어떤 일을 배우고 해 나갈지 정하는 방향',
    english: 'career path · 직업이나 배움에서 앞으로 나아갈 길.',
    details: [['내가 좋아하는 일 찾아보기', ['같은 문제를 두고도 직접 관찰하는 일, 새 도구를 만드는 일, 결과를 설명하는 일이 있어요. 해 보고 싶은 역할을 찾아보세요.']]]
  });

  const ports = activity('닫혀 있던 항구를 열면 무엇이 달라질까?', '항구의 전후 비교', [
    ['배가 자유롭게 오가지 못할 때', '외국 배가 허락 없이 와서 물건을 사고팔 수 없어요.'],
    ['외국 배가 오갈 수 있게 된 뒤', '허락된 항구에 외국 배가 들어와 사람과 물건이 오가요.']
  ], i => illustratedFlow('항구가 열리면 외국 배와 물건이 오갈 수 있다.', i === 0 ?
    [['ship', '외국 배', '항구 밖에서 대기'], ['house', '항구', '드나들기 어려움']] :
    [['ship', '외국 배', '항구 안으로 들어옴'], ['coin', '항구의 거래', '물건이 오감']], i, i === 1), question('외국 배가 들어와 거래할 수 있도록 항구를 열었어요. 무엇이라고 할까요?',
    '개항', '맞아요. 열 개(開), 항구 항(港)을 써서 항구를 연다는 뜻이에요.',
    [['유교', '유교는 예절과 도리를 중요하게 보는 가르침이에요. 이 장면에서는 배가 들어올 수 있게 항구를 열었어요.']]), {
    parts: [['開', '열 개'], ['港', '항구 항']],
    wordResult: '개항(開港) · 외국 배가 드나들거나 거래하도록 항구를 여는 일',
    english: 'opening a port · 항구를 개방하는 일.',
    details: [['조선 후기의 변화', ['조선은 강화도 조약을 맺은 뒤 일부 항구를 외국에 열었어요. 항구를 통해 사람과 물건이 오가면서 새로운 물건과 기술을 접하는 기회도 늘었어요.']]]
  });
  const independence = activity('빼앗긴 나라를 되찾기 전과 뒤를 구별해요', '두 장면 비교', [
    ['나라를 되찾기 위한 활동', '사람들이 독립을 요구하고 임시 정부를 세우는 등 여러 방법으로 힘을 모았어요.'],
    ['나라를 되찾은 날', '1945년 8월 15일, 일본의 식민 지배에서 벗어났어요.']
  ], i => illustratedFlow('독립을 요구하고 나라를 되찾기 위해 활동한 때와 광복의 날을 비교한다.', [
    ['note', '독립운동', '나라를 되찾으려 함'], ['flag', '광복', '1945년 8월 15일']
  ], i), question('1919년에 우리나라가 독립해야 한다고 외친 일은 어느 쪽인가요?',
    '독립운동', '맞아요. 나라를 되찾기 위해 한 활동이에요. 광복을 맞은 날은 그 뒤 1945년 8월 15일이에요.',
    [['광복', '광복은 나라를 되찾은 일이에요. 1919년에는 되찾기 위해 독립 의사를 밝혔어요.']]), {
    parts: [['光', '빛 광'], ['復', '돌아올 복']],
    wordResult: '광복(光復) · 빼앗겼던 나라의 독립을 되찾은 일',
    english: 'liberation · 지배에서 벗어나 자유를 되찾는 일.',
    details: [['하려는 일과 이루어진 일', ['독립운동은 되찾으려고 이어 간 여러 활동이에요. 광복은 식민 지배에서 벗어나 독립을 되찾은 일을 가리켜요.']]]
  });
  const trade = activity('같은 배를 나라 안과 밖에서 보면?', '물건이 오가는 방향 바꾸기', [
    ['우리나라에서 보낼 때', '우리나라에서 만든 물건을 다른 나라에 팔아요. 우리나라에서는 수출이에요.'],
    ['다른 나라에서 받을 때', '다른 나라에서 만든 물건을 우리나라가 사 와요. 우리나라에서는 수입이에요.']
  ], i => illustratedFlow('배가 물건을 옮기는 출발지와 도착지가 바뀐다.', i === 0 ?
    [['house', '우리나라', '만든 물건을 보냄'], ['ship', '다른 나라', '물건을 사 감']] :
    [['ship', '다른 나라', '물건을 보냄'], ['house', '우리나라', '물건을 사 옴']], 0),
  question('한국에서 만든 운동화를 다른 나라 가게가 사 갔어요. 한국에서 보면?',
    '수출', '맞아요. 우리나라에서 만든 물건이 다른 나라로 나갔어요.',
    [['수입', '운동화를 사 온 나라에서는 수입이에요. 여기서는 한국에서 보고 있어요.']]), {
    wordResult: '수출(輸出)은 나감, 수입(輸入)은 들어옴',
    english: 'export · 수출 / import · 수입',
    details: [['누구를 기준으로 보나요?', ['出은 ‘나가다’, 入은 ‘들어오다’라는 뜻이에요.', '같은 거래가 파는 나라에는 수출이고, 사 오는 나라에는 수입이에요. 먼저 어느 나라에서 말하는지 찾으세요.']]]
  });
  const population = activity('넓이가 같을 때 어느 쪽에 사람이 더 모여 있을까?', '같은 넓이의 두 지역 비교', [
    ['네 명이 사는 곳', '같은 크기의 땅에 네 명이 살아요. 사람 사이가 넓게 벌어져 있어요.'],
    ['열두 명이 사는 곳', '같은 크기의 땅에 열두 명이 살아요. 사람이 더 모여 있어요.']
  ], populationScene, question('한 곳은 사람이 더 많지만 땅도 훨씬 넓어요. 인구 밀도를 알려면 무엇을 더 살펴볼까요?',
    '같은 넓이 안에 몇 명이 사는지', '맞아요. 땅의 넓이를 같게 맞춰 비교해야 사람이 모여 사는 정도를 알 수 있어요.',
    [['두 곳에서 사는 사람의 수만', '땅이 더 크면 사람이 많아도 널리 흩어져 살 수 있어요. 같은 넓이로 비교해 보세요.']]), {
    parts: [['密', '빽빽할 밀'], ['度', '정도 도']],
    wordResult: '인구 밀도 · 일정한 넓이에 사람이 얼마나 빽빽하게 사는지 나타낸 수',
    english: 'population density · 일정한 넓이당 사는 사람의 수.',
    details: [['인구와 인구 밀도는 무엇이 다를까?', ['인구는 사는 사람 전체를 센 수예요. 인구 밀도는 땅의 넓이도 함께 생각해요.']]]
  });

  const grammar = activity('누가 무엇을 하는지 문장과 그림을 짝지어요', '문장의 두 부분 찾기', [
    ['주어', '공을 차는 사람은 민서예요. “누가?”에 맞는 “민서가”가 주어예요.'],
    ['서술어', '민서가 하는 일은 공을 차는 일이에요. “어떻게 해?”에 맞는 “차요”가 서술어예요.']
  ], grammarScene, question('“강아지가 뛰어요.”에서 움직이는 대상을 나타내는 말은?',
    '강아지가', '맞아요. “누가 뛰어요?”에 답하는 말이 주어예요.',
    [['뛰어요', '“뛰어요”는 강아지가 무엇을 하는지 알려 주는 서술어예요.']]), {
    english: 'subject · 주어 / predicate · 서술어에 해당하는 표현.',
    details: [['움직이지 않는 경우도 있어요', ['“하늘이 파랗다.”에서 하늘은 움직이지 않아요. “무엇이 파랗지?”의 답인 “하늘이”가 주어이고, 그 상태를 설명하는 “파랗다”가 서술어예요.']]]
  });
  const dialect = activity('똑같이 반가운데 왜 다른 말을 쓸까?', '반기는 말 듣는 상황 비교', [
    ['표준어로 반겨요', '여러 지역 사람이 함께 쓰도록 정한 말에서 “어서”라고 해요.'],
    ['제주어로 반겨요', '제주에서 쓰는 말에는 “어서”라는 뜻의 “혼저”가 있어요.']
  ], i => illustratedFlow('집에 온 손님을 서로 다른 말로 반긴다.', [
    ['house', '어서', '표준어에서'], ['face', '혼저', '제주어에서']
  ], i, false), question('제주에서 “혼저”라는 말을 들었어요. 그림에서 어떤 뜻으로 쓰였을까요?',
    '어서', '맞아요. 쓰는 말은 달라도 손님을 얼른 맞이하는 뜻을 담을 수 있어요.',
    [['나중에', '그림에서는 지금 오는 손님을 맞이해요. “혼저”는 여기서 “어서”라는 뜻이에요.']]), {
    english: 'dialect · 지역이나 집단에서 쓰는 말의 여러 형태.',
    details: [['말이 다른 까닭', ['지역마다 사람들이 이어서 써 온 말이 있어요. 지역 말을 읽으면 글 속 인물이 어디에서 어떤 사람과 지냈는지 짐작할 단서가 되기도 해요.']]]
  });
  const sourceCheck = activity('휴관 안내 두 장 중 오늘 확인해야 하는 것은?', '안내문의 날짜와 보낸 곳 보기', [
    ['다시 올라온 사진', '사진에는 휴관이라고 쓰여 있지만 지난달 안내예요. 오늘도 그렇다고 단정할 수 없어요.'],
    ['도서관의 이번 주 공지', '도서관이 직접 올렸고 이번 주 날짜가 있어요. 오늘의 운영 시간을 살펴볼 수 있어요.']
  ], noticeScene, question('지난달 사진과 이번 주 공지의 말이 달라요. 무엇부터 확인할까요?',
    '언제, 누가 올렸는지', '맞아요. 정보가 언제 어디에서 나왔는지 확인해야 지금 믿고 써도 되는지 판단할 수 있어요.',
    [['글씨가 어느 쪽이 더 큰지', '크게 적혀 있어도 오래되었거나 다른 사람이 옮긴 글일 수 있어요.']]), {
    parts: [['信', '믿을 신'], ['賴', '의지할 뢰']],
    wordResult: '신뢰성(信賴性) · 얼마나 믿을 만한지 따져 보는 기준',
    english: 'reliability · 믿고 사용해도 될 정도.',
    details: [['확인할 세 가지', ['누가 만들었나요? 언제 만든 자료인가요? 다른 곳에서도 같은 사실을 확인할 수 있나요?']]]
  });
  const adjustment = activity('연습 날짜가 다를 때 둘 다 올 수 있는 날을 찾아요', '의견을 맞추기 전후 비교', [
    ['처음 제안', '한 학생은 화요일, 다른 학생은 수요일을 먼저 제안했어요.'],
    ['다시 맞춘 날짜', '화요일을 제안한 학생도 수요일에 올 수 있다고 했어요. 두 사람의 상황을 확인해 수요일로 정해요.']
  ], compromiseScene, question('처음 의견이 다를 때 서로 맞출 방법을 찾으려면?',
    '왜 그날이 필요한지 먼저 들어요.', '맞아요. 이유를 알면 서로 가능한 시간을 찾기 쉬워져요.',
    [['먼저 말한 날짜로 바로 정해요.', '먼저 말한 날짜로 정하면 오지 못하는 사람이 생길 수 있어요. 두 사람의 상황을 확인해 보세요.']]), {
    parts: [['調', '고를 조 · 맞춤'], ['整', '가지런할 정']],
    wordResult: '의견 조정 · 서로 다른 의견을 맞춰 함께 할 방법을 찾기',
    english: 'reconciling views · 서로 다른 의견을 맞추기.',
    details: [['토의 속에서 언제 쓰일까?', ['토의는 문제를 함께 해결하려고 말하는 활동이에요. 의견 조정은 그 안에서 생각이 다른 부분을 맞춰 가는 과정이에요.']]]
  });
  const inference = activity('비가 왔다는 말 없이 어떻게 알아챌까?', '그림에서 단서 찾아보기', [
    ['보이는 것', '문 옆에 젖은 우산과 물기 있는 발자국이 있어요. 눈에 보이는 사실이에요.'],
    ['짐작한 것', '우산과 신발이 젖었으니 누군가 밖에서 비를 맞았을 가능성이 있어요. 보이는 단서로 보이지 않는 일을 짐작해요.']
  ], clueScene, question('글에 “비를 맞았다”는 말은 없어요. 어떤 부분이 그 일을 짐작하게 하나요?',
    '젖은 우산과 물기 있는 발자국', '맞아요. 직접 적히지 않은 일을 알아내는 데 도움이 되는 단서예요.',
    [['문이 나무로 만들어졌다는 점', '문의 재료로는 밖에 비가 왔는지 짐작하기 어려워요. 물기가 남은 곳을 보세요.']]), {
    parts: [['推', '밀 추 · 미루어 봄'], ['論', '논할 론']],
    wordResult: '추론(推論) · 아는 단서로 적혀 있지 않은 것을 미루어 짐작하기',
    english: 'inference · 단서에서 이끌어 낸 판단.',
    details: [['사실과 추론을 나눠 말하기', ['“우산이 젖었다”는 그림에 보이는 사실이에요. “누군가 비를 맞았다”는 그 사실을 바탕으로 짐작한 일이에요.']]]
  });
  const script = activity('무대에서 들리는 말과 배우가 하는 행동을 나눠요', '극본의 두 부분 찾기', [
    ['대사', '배우가 “누구 있어요?”라고 소리 내 말해요. 관객이 들을 수 있어요.'],
    ['지시문', '“살며시 문을 연다”라고 적혀 있어요. 배우는 이 말을 읽어 주는 대신 그 행동을 해요.']
  ], stageScene, question('배우가 “(작은 목소리로)”라고 적힌 곳을 봤어요. 무엇을 할까요?',
    '다음 대사를 작은 목소리로 말해요.', '맞아요. 지시문은 대사를 어떤 목소리로 해야 할지 알려 줘요.',
    [['“작은 목소리로”라는 말을 관객에게 그대로 읽어요.', '괄호 속 말은 배우가 어떻게 행동하거나 말할지 알려 줘요.']]), {
    english: 'dialogue · 대사 / stage direction · 지시문',
    details: [['극본을 읽는 두 가지 눈', ['대사를 보고 인물이 무슨 말을 했는지 알아요. 지시문을 보고 그 말을 어떤 표정이나 동작으로 했는지 떠올려요.']]]
  });
  const plot = activity('이야기에서 빠지면 안 될 장면을 골라요', '사건이 이어지는 순서', [
    ['문제가 생겨요', '아이가 빌린 책을 잃어버려요. 뒤에 찾으러 가는 까닭이에요.'],
    ['찾으러 가요', '가방과 도서관을 다시 찾아봐요. 문제를 풀려고 한 행동이에요.'],
    ['문제가 풀려요', '도서관에서 책을 찾고 친구에게 돌려줘요. 이야기의 끝을 알려 줘요.']
  ], i => illustratedFlow('책을 잃어버리고, 찾으러 가고, 찾아 돌려준다.', [
    ['book', '책을 잃어버림', '문제 발생'], ['magnify', '다시 찾으러 감', '해결하려는 행동'], ['face', '친구에게 돌려줌', '문제 해결']
  ], i), question('“아이가 좋아하는 색은 초록이다”라는 정보가 빠져도 이야기를 이해할 수 있어요. 줄거리를 쓸 때는?',
    '잃어버린 책을 찾아 돌려준 일을 남겨요.', '맞아요. 이야기의 흐름이 이어지게 하는 중요한 사건을 골라요.',
    [['아이의 옷 색만 남겨요.', '옷 색만 남기면 왜 책을 찾았는지와 마지막에 어떻게 되었는지 알기 어려워요.']]), {
    english: 'plot summary · 중요한 사건이 이어지는 흐름을 짧게 정리한 것.',
    details: [['어떤 사건을 남길까?', ['어떤 문제가 생겼는지, 인물이 그것을 풀려고 무엇을 했는지, 마지막에 어떻게 됐는지를 보면 흐름을 잡기 쉬워요.']]]
  });
  const argument = activity('횡단보도를 더 놓자는 말을 어떻게 판단할까?', '주장과 뒷받침을 나누어 보기', [
    ['주장', '“횡단보도를 더 놓자”는 발표자가 바꾸고 싶다고 말한 내용이에요.'],
    ['이유', '“학생이 길을 건너기 어려워요”는 왜 그렇게 하려는지 설명해요.'],
    ['근거', '여러 날 등굣길을 직접 세어 기록한 자료는 그 이유를 확인하는 데 도움이 돼요.']
  ], i => illustratedFlow('횡단보도에 대한 주장, 이유, 조사한 자료를 나란히 놓는다.', [
    ['speech', '더 놓자', '주장'], ['face', '건너기 어려움', '이유'], ['note', '등굣길 조사표', '근거']
  ], i), question('발표자가 “우리 반 한 명만 불편하대요”라고 했어요. 학교 전체 학생이 불편한지 알려면?',
    '여러 학생의 경험을 더 조사해요.', '맞아요. 더 넓게 조사한 자료로 판단해야 주장이 얼마나 타당한지 알 수 있어요.',
    [['한 명의 말을 크게 읽으면 돼요.', '말을 크게 해도 조사한 사람의 수가 늘지는 않아요. 주장에 맞는 자료를 찾아보세요.']]), {
    english: 'claim · 주장 / reason · 이유 / evidence · 근거',
    details: [['타당성을 볼 때', ['하려는 말이 무엇인지 찾고, 이유가 그 말과 맞는지 살펴요. 그 이유를 실제 자료가 충분히 뒷받침하는지도 봐요.']]]
  });
  const mediaHabits = activity('잠들기 전 화면을 보는 시간이 어떻게 바뀌었을까?', '두 날의 이용 시간 비교', [
    ['영상 60분', '영상을 오래 보느라 잠잘 준비를 늦게 시작했어요.'],
    ['영상 20분', '보는 시간을 줄이니 화면을 끄고 준비하는 시간이 생겼어요.']
  ], screenTimeScene, question('일주일 동안 같은 시간대에 영상을 얼마나 보는지 알고 싶어요. 어떤 자료가 필요할까요?',
    '날마다 화면을 사용한 시간 기록', '맞아요. 여러 날 같은 기준으로 기록하면 반복되는 이용 습관을 살필 수 있어요.',
    [['기기의 화면 색', '화면 색으로는 몇 분을 사용했는지 알 수 없어요. 시간 기록을 찾아보세요.']]), {
    english: 'media habits · 매체를 되풀이해 사용하는 방식.',
    details: [['습관을 어떻게 찾을까?', ['하루만으로 정하기보다 여러 날의 기록을 나란히 놓아요. 언제, 무엇을, 얼마나 보는지 비교하면 자주 반복되는 일을 찾을 수 있어요.']]]
  });
  const nativeWords = activity('익숙한 말도 들어온 길은 달라요', '말이 어디에서 왔는지 살펴보기', [
    ['나무', '예전부터 우리말에서 쓰인 고유어예요.'],
    ['도서관', '圖書館이라는 한자에 바탕을 둔 말이에요. 글자에 책이 있는 곳이라는 뜻이 담겨 있어요.'],
    ['카메라', '다른 언어의 camera에서 들어와 우리말에서도 쓰는 외래어예요.']
  ], i => illustratedFlow('나무, 도서관, 카메라의 말이 들어온 길을 보여 준다.', [
    ['tree', '나무', '고유어'], ['book', '도서관', '한자어'], ['camera', '카메라', '외래어']
  ], i, false), question('“버스”는 영어 bus에서 들어와 우리말에서 써요. 어느 갈래일까요?',
    '외래어', '맞아요. 다른 언어에서 빌려 우리말에서 사용하는 말이에요.',
    [['한자어', '한자의 소리와 뜻을 바탕으로 만든 말이 한자어예요. “버스”가 어디에서 왔는지 다시 보세요.']]), {
    english: 'native word · 고유어 / loanword · 다른 언어에서 빌려 온 말',
    details: [['글자 뜻을 모으면', ['도서관(圖書館)에서 도서(圖書)는 책을, 관(館)은 어떤 일을 하는 건물이나 장소를 나타내요. 합쳐 읽으면 책이 있는 곳이 떠올라요.']]]
  });
  const audience = activity('같은 관찰 결과를 누구에게 설명할까?', '읽는 사람에 맞춰 표현 바꾸기', [
    ['과학 발표를 듣는 친구', '수업에서 배운 말인 “물이 증발했어요”라고 하면 뜻이 통해요.'],
    ['처음 듣는 동생', '“접시의 물이 보이지 않게 공기 중으로 퍼졌어”라고 말하면 어떤 일이 일어났는지 떠올리기 쉬워요.']
  ], i => illustratedFlow('같은 물의 변화가 듣는 사람에 따라 다르게 표현된다.', [
    ['note', '물이 증발했어요', '수업에서 배운 말'], ['droplet', '접시의 물이 말랐어', '처음 듣는 사람에게']
  ], i, false), question('초등학교에 처음 온 학생에게 안내문을 쓸 때는?',
    '낯선 장소 이름에 쉬운 설명을 덧붙여요.', '맞아요. 독자가 이미 무엇을 알고 있는지 생각하면 설명할 부분이 보여요.',
    [['이미 시설 이름을 다 안다고 생각해요.', '처음 온 독자는 장소 이름을 처음 볼 수도 있어요.']]), {
    parts: [['讀', '읽을 독'], ['者', '사람 자']],
    wordResult: '독자(讀者) · 내가 쓴 글을 읽는 사람',
    english: 'reader · 글을 읽는 사람.',
    details: [['말을 쉬워지게 하는 방법', ['어려운 말 뒤에 이미 아는 행동이나 모습으로 예를 들어요. “정문”을 처음 듣는 아이에게는 “학교 앞 큰 문”이라고 덧붙일 수 있어요.']]]
  });
  const figurative = activity('별빛을 손전등에 빗대면 어떤 모습이 떠오를까?', '두 대상에서 닮은 점 찾기', [
    ['밤하늘의 별', '밤하늘이 어두운데 작은 별빛이 점처럼 보여요.'],
    ['어둠 속 작은 불빛', '어두운 곳에서 작은 불빛 하나가 또렷이 보여요. 별빛이 어떻게 보이는지 떠올릴 수 있어요.']
  ], figurativeScene, question('“친구 웃음소리가 종소리 같았다”에서 두 소리의 닮은 점은?',
    '맑게 울려 퍼지는 느낌', '맞아요. 웃음소리의 느낌을 더 잘 전하려고 종소리에 빗댄 말이에요.',
    [['두 소리가 모두 종에서 났다는 점', '웃음은 친구가 낸 소리예요. 어디에서 났는지보다 어떤 느낌이 비슷한지 살펴봐요.']]), {
    parts: [['比', '견줄 비'], ['喩', '깨우칠 유 · 빗대어 알림']],
    wordResult: '비유(比喩) · 닮은 다른 것에 빗대어 대상의 특징을 보여 주는 표현',
    english: 'figurative comparison · 다른 대상에 빗대어 뜻이나 느낌을 전하는 표현.',
    details: [['닮은 점을 먼저 찾아요', ['어떤 대상 전체가 같아야 할 필요는 없어요. 밝기, 모양, 소리, 느낌 가운데 내가 전하고 싶은 특징 하나를 골라요.']]],
    writing: { prompt: '바람에 흔들리는 나뭇잎의 움직임을 다른 것에 빗대어 한 문장으로 써 보세요.',
      guide: '나뭇잎과 빗댄 대상에서 어떤 움직임이 닮았는지 생각하세요.',
      example: '바람에 흔들리는 나뭇잎이 손을 흔드는 것처럼 보였어요.' }
  });

  const lessons = {
    '5-2': {
      국어: { reading: [reading], '1': [evidence], '2': [grammar], '3': [dialect], media: [sourceCheck], '4': [adjustment], '5': [inference], '6': [script] },
      수학: { '1': [range, rounding], '2': [mixed, multiplyFraction], '3': [symmetry], '4': [decimals], '5': [cuboid], '6': [average] },
      사회: { '1': [history, excavation], '2': [ports], '3': [independence] },
      과학: { '1': [filtering], '2': [weather], '3': [heat], '4': [resources] }
    },
    '6-2': {
      국어: { reading: [viewpoints], '1': [plot], '2': [interview], '3': [argument], media: [mediaHabits], '4': [nativeWords], '5': [audience], '6': [figurative] },
      수학: { '1': [divideFraction], '2': [blocks], '3': [decimalDivision], '4': [ratio], '5': [circle], '6': [bodies] },
      사회: { '1': [landscape, climate], '2': [trade], '3': [population] },
      과학: { '1': [seasons], '2': [burning], '3': [circuit], '4': [careers] }
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = lessons;
  else root.CurriculumVisualLessons = lessons;
})(typeof window === 'undefined' ? globalThis : window);
