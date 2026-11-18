// 급식 메뉴 그림. 그림 문자로는 없거나 색이 틀린 우리 급식 음식(깍두기·꿔바로우·샤인머스캣·국 색깔 등)을 직접 그린다.
// 맞는 그림이 없으면 null 을 돌려주고, 대시보드의 그림 문자 표가 맡는다.
(function (global) {
  'use strict';

  const svg = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
  const dots = (list) => list.map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('');
  const line = (d, color, width = 1.3) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const cube = (x, y, s, top, left, right) => {
    const p = (a, b) => `${(x + a * s).toFixed(1)} ${(y + b * s).toFixed(1)}`;
    return `<path d="M${p(0, -1)}L${p(0.87, -0.5)}L${p(0, 0)}L${p(-0.87, -0.5)}Z" fill="${top}"/>`
      + `<path d="M${p(-0.87, -0.5)}L${p(0, 0)}L${p(0, 1)}L${p(-0.87, 0.5)}Z" fill="${left}"/>`
      + `<path d="M${p(0.87, -0.5)}L${p(0, 0)}L${p(0, 1)}L${p(0.87, 0.5)}Z" fill="${right}"/>`;
  };

  const BOWL = '<path d="M2.6 11.5h18.8c0 5-3.6 8.4-9.4 8.4s-9.4-3.4-9.4-8.4z" fill="#e8edf3"/><path d="M8.5 19.6h7l.6 1.7H7.9z" fill="#b4bfcc"/>';
  const PLATE = '<ellipse cx="12" cy="18.2" rx="10.8" ry="3.2" fill="#e8edf3"/><ellipse cx="12" cy="17.6" rx="8" ry="2" fill="#c9d2dc"/>';
  const STRANDS = 'M5 11.2c1.4-1.5 2.8 1.2 4.2 0s2.8 1.2 4.2 0 2.8 1 5.4-.2';

  const soup = (broth, bits = '') => svg(`${BOWL}<ellipse cx="12" cy="11.5" rx="9.4" ry="3.1" fill="${broth}"/>${bits}`);
  const noodles = (broth, strand, bits = '') => soup(broth, line(STRANDS, strand, 1.5) + line('M6.5 12.7c1.6-1 3 .8 4.6 0s3 .8 5.8-.1', strand, 1.3) + bits);
  const rice = (color, specks = []) => svg(`${BOWL}<path d="M4 11.9C4 6.7 7.6 3.7 12 3.7s8 3 8 8.2c-2.4 1.5-13.6 1.5-16 0z" fill="${color}"/>${dots(specks)}`);
  const heap = (color, marks = '') => svg(`${PLATE}<path d="M4.6 17.4C5.2 11.6 8.4 7.6 12 7.6s6.8 4 7.4 9.8c-3 1.5-11.8 1.5-14.8 0z" fill="${color}"/>${marks}`);
  const shreds = (color, strand, second = strand) => heap(color,
    line('M7.4 15.6c1.6-3 3-4.6 4.6-5.4', strand) + line('M10 16.6c.6-2.6 2-4.6 4-5.6', second) + line('M13.4 16.6c.2-1.8 1.2-3.4 2.8-3.6', strand) + line('M6.2 13.8', strand));

  const redFlakes = '#e4572e';
  const RICE_SPECKS = [[8, 8.6, .8], [12, 6.4, .8], [15.6, 8.8, .8], [10.4, 10.2, .8], [14, 10.6, .8], [6.8, 10.8, .7], [17.4, 10.8, .7]];
  const specks = (color) => RICE_SPECKS.map((s) => [...s, color]);

  const grapes = (body, shade, shine) => {
    const beads = [[7.2, 9, 2.6], [12, 8.6, 2.6], [16.8, 9, 2.6], [9.6, 13, 2.6], [14.4, 13, 2.6], [12, 17, 2.6], [7.2, 12.6, 0], [16.8, 12.6, 0]].filter((b) => b[2]);
    return svg(line('M12 6.2V3.2', '#8a6a3a', 1.5) + '<path d="M12.6 4.6c1.8-2 4-2 5.6-1-1 1.9-3.4 2.6-5.6 1z" fill="#6fae3f"/>'
      + beads.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${body}"/><path d="M${x + r * .1} ${y + r * .95}a${r} ${r} 0 0 0 ${r * .85} -${r * .9}" fill="none" stroke="${shade}" stroke-width=".8"/><circle cx="${x - .8}" cy="${y - .9}" r=".65" fill="${shine}"/>`).join(''));
  };

  const slab = (x, y, w, h, turn, fill, edge) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" transform="rotate(${turn} ${x + w / 2} ${y + h / 2})" fill="${fill}" stroke="${edge}" stroke-width="1"/>`;
  const glaze = (d) => line(d, '#fff3c9', 1);
  const nuggets = (a, b, edge, extra = '') => svg(`${PLATE}<path d="M3.8 16.2c-.8-3 1.4-5.2 4-4.8 2.6.4 4.2 2.2 3.8 4.6-.4 2-6.8 2.8-7.8.2z" fill="${a}" stroke="${edge}" stroke-width=".7"/><path d="M12.2 16.4c-.9-2.9.9-5.1 3.7-5 2.8.1 4.8 2 4.2 4.6-.5 2.1-7.1 2.8-7.9.4z" fill="${b}" stroke="${edge}" stroke-width=".7"/><path d="M7.8 10.8c-.6-3 1.6-5 4.3-4.8 2.7.2 4.5 2.2 3.9 4.7-.5 2-7.5 2.5-8.2.1z" fill="${a}" stroke="${edge}" stroke-width=".7"/>${extra}`);
  const slices = (fill, stripe, edge) => svg(PLATE + [[4.2, 9.4], [9, 7.6], [13.8, 9.4]].map(([x, y]) => `<g transform="rotate(10 ${x + 3} ${y + 4})"><rect x="${x}" y="${y}" width="6" height="8.6" rx="1.4" fill="${fill}" stroke="${edge}" stroke-width=".6"/><path d="M${x} ${y + 2.6}h6" stroke="${stripe}" stroke-width="1.4"/></g>`).join(''));
  const round = (body, shade, top) => svg(`<circle cx="12" cy="13.4" r="8.2" fill="${body}"/><path d="M12 21.6a8.2 8.2 0 0 0 8.2-8.2" fill="none" stroke="${shade}" stroke-width="1.6"/>${top}`);

  const kimchiLeaf = (leaf, rib, flake) => svg(`<path d="M5 20.4C2.6 15.8 3.8 8.6 8.6 5c1.3 1 1.5 2 1.4 3 1.2-1.9 3.3-3.4 5.8-3.8.4 1.3.2 2.4-.3 3.3 1.5-.8 3.2-1 4.8-.6-.1 5.2-3 10.6-8.3 13.2-2.4 1.1-5 1.2-7 .3z" fill="${leaf}"/><path d="M5.8 19.6c1.7-4.8 4.9-8.8 9.4-11.2" fill="none" stroke="${rib}" stroke-width="2.3" stroke-linecap="round"/>${dots([[9, 9.8, .7, flake], [15.6, 12.8, .7, flake], [12.4, 15.6, .7, flake], [7, 13.6, .6, flake]])}`);

  const ICON = {
    kkakdugi: () => svg(`${cube(12, 8.6, 4.8, '#f4764c', '#dc4d24', '#c23c19')}${cube(7, 15.4, 4.8, '#f4764c', '#dc4d24', '#c23c19')}${cube(17, 15.4, 4.8, '#f4764c', '#dc4d24', '#c23c19')}${dots([[11, 6.8, .55, '#ffe0cf'], [13.4, 8, .5, '#ffe0cf'], [6, 13.6, .55, '#ffe0cf'], [8.2, 14.6, .45, '#ffe0cf'], [16, 13.6, .55, '#ffe0cf'], [18.2, 14.6, .45, '#ffe0cf']])}`),
    kimchi: () => kimchiLeaf('#e8562f', '#ffd9b8', '#a92f14'),
    whiteKimchi: () => kimchiLeaf('#e9edc9', '#fbfbf0', '#b9c98a'),
    greenKimchi: () => svg(`${PLATE}${line('M6 16.6C7 12 8 8.6 10 5', '#5fa13c', 2.2)}${line('M11 16.8c.2-4.4 1-8 2.6-11.6', '#6fb346', 2.2)}${line('M15.6 16.6c.2-3.4 1-6.2 2.8-9', '#5fa13c', 2.2)}${dots([[8, 12, .9, redFlakes], [12, 13.4, .9, redFlakes], [16.4, 12.4, .9, redFlakes], [9.6, 9, .7, redFlakes], [14, 9.4, .7, redFlakes]])}`),
    chonggak: () => svg(`<path d="M9 9.6c3-1 6.6.2 7.4 3.2.9 3.6-2.4 6.6-8.8 8.4 1.2-2 .6-3.2.2-5.2C7.4 13.4 7 10.6 9 9.6z" fill="#e8562f"/><path d="M10 11.2c1.8-.5 3.6.1 4.2 1.4" fill="none" stroke="#ffc9ae" stroke-width="1.2" stroke-linecap="round"/>${line('M12 9.4C11.6 6.6 10 4.6 7.6 3.2', '#5fa13c', 2)}${line('M12.6 9.4c.4-2.8 1.8-4.8 4.2-6', '#6fb346', 2)}`),
    waterKimchi: () => soup('#f7d9c9', cube(8.8, 11.2, 1.8, '#ffffff', '#e5e8ea', '#d5dade') + cube(14.6, 11.6, 1.8, '#ffffff', '#e5e8ea', '#d5dade') + dots([[11.8, 10, .7, '#e4572e'], [17.4, 10.6, .6, '#6fb346']])),
    oisobagi: () => svg(`<path d="M3.6 16.4 16 4.8c1.7-1.5 4-.9 4.8.4.8 1.4.3 3-1 4.3L8 21c-1.7 1.3-3.7.8-4.5-.5-.8-1.3-.9-2.8.1-4.1z" fill="#5fa13c"/><path d="M6.4 17.6 17.6 7.2" stroke="${redFlakes}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="3 1.6"/>`),
    danmuji: () => svg(`${PLATE}${[[8, 12.4], [12, 11], [16, 12.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.4" fill="#ffd93b" stroke="#e6b400" stroke-width="1"/><circle cx="${x}" cy="${y}" r="1.7" fill="#fff0a0"/>`).join('')}`),
    whiteRadish: () => svg(`${cube(12, 9.6, 4.4, '#ffffff', '#e2e6e4', '#cfd6d3')}${cube(7.4, 15.6, 4.4, '#ffffff', '#e2e6e4', '#cfd6d3')}${cube(16.6, 15.6, 4.4, '#ffffff', '#e2e6e4', '#cfd6d3')}`),
    pickle: () => svg(`${PLATE}${[[8, 12.4], [12, 11], [16, 12.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.4" fill="#a9c95a" stroke="#5f8a2e" stroke-width="1.1"/>${dots([[x - 1.3, y - .6, .55, '#e8f2b8'], [x + 1.3, y - .6, .55, '#e8f2b8'], [x, y + 1.3, .55, '#e8f2b8']])}`).join('')}`),

    kkwobarou: () => svg(`${PLATE}${slab(2.8, 10.2, 11, 6.6, -14, '#eebb58', '#c98d2e')}${slab(10.6, 10.8, 10.8, 6.2, 12, '#f2c566', '#c98d2e')}${slab(6.6, 5.2, 11.4, 6.8, 6, '#f6cf76', '#c98d2e')}${glaze('M9 7.4c1.8-.3 3.6-.1 5.4.4')}${glaze('M5 13c1.4-.6 2.8-.9 4.2-1')}${glaze('M14.6 13.2c1.2.1 2.4.4 3.6.9')}`),
    tangsuyuk: () => nuggets('#d9973a', '#e2a646', '#a96c1f', `<path d="M5 15.4c3 1.5 11 1.5 14-.2-.4 1.6-2 2.8-7 2.9s-6.6-1-7-2.7z" fill="#e8742a" opacity=".9"/>${dots([[9.6, 8.6, .8, '#f08a3c'], [13.8, 9.2, .8, '#7cb84f'], [16.2, 13.2, .8, '#f08a3c'], [6.8, 13.6, .8, '#7cb84f']])}`),
    cutlet: () => svg(`${PLATE}<path d="M3.2 14.4C3 10.2 7.4 6.8 13 6.6c4.6-.2 8.2 2 8 5.4-.2 3.6-4.4 6-9.6 6-4.4 0-8-1.2-8.2-3.6z" fill="#d9963a" stroke="#a96c1f" stroke-width=".8"/>${line('M8 8.6l2.6 8.8', '#a96c1f', .9)}${line('M12.6 7.2l2.6 10', '#a96c1f', .9)}${line('M17 7.8l1.8 7.8', '#a96c1f', .9)}<path d="M5 12.2c4-3 10.4-4 15.2-2.2-.1 1.2-1.4 1.2-3 1.2-4 .1-7.6 1-10.2 2.8-1.2.7-2.6-.6-2-1.8z" fill="#5b3216"/>`),
    glazedChicken: () => nuggets('#b5381f', '#c8472a', '#7c2413', dots([[9.4, 8.6, .5, '#fff3d6'], [13, 8, .5, '#fff3d6'], [14.6, 9.8, .5, '#fff3d6'], [6.8, 13.6, .5, '#fff3d6'], [16.4, 13.4, .5, '#fff3d6']])),
    bulgogi: () => shreds('#6d3f22', '#a26a3e', '#7fbf5a'),
    jeyuk: () => shreds('#b13b1e', '#e0663c', '#7fbf5a'),
    patty: () => svg(`${PLATE}<ellipse cx="12" cy="12.6" rx="8.6" ry="5.2" fill="#6b3d22"/><ellipse cx="12" cy="11.4" rx="7.6" ry="3.8" fill="#8a5230"/><path d="M6.8 11c2.6-1.8 7.8-1.8 10.4 0" fill="none" stroke="#c98a58" stroke-width="1" stroke-linecap="round"/>`),
    ribs: () => svg(`${PLATE}${line('M5.4 8 18.4 15', '#f1e6d2', 2)}<path d="M4.6 13.6c.2-3 3-5.4 6.4-4.8l6 3c2.6 1.6 3 4.2 1.6 5.4-3 1.4-11.6 1.2-13.2-.6-.6-.8-.8-1.8-.8-3z" fill="#7d4323"/>${line('M8.4 11c2.2-.2 4.4.6 6.2 2.4', '#b3744a', 1)}`),
    pork: () => slices('#f3d6c6', '#c98f78', '#b97f68'),
    braised: () => heap('#5a3418', line('M7.6 15.4c1.4-2.6 3-4.2 4.8-5', '#8a5a34') + line('M12.4 16c.4-2 1.6-3.6 3.2-4.2', '#8a5a34') + dots([[9.6, 12.6, 1.9, '#d9b88a'], [14.6, 14.6, 1.7, '#d9b88a']])),

    whiteRice: () => rice('#fbfbf6', [[9, 7.6, .45, '#dfe3dc'], [14, 6.8, .45, '#dfe3dc'], [12, 9.8, .45, '#dfe3dc'], [16, 9.8, .45, '#dfe3dc'], [7.4, 10.2, .45, '#dfe3dc']]),
    mixedRice: () => rice('#d9c8d6', specks('#6a3f73')),
    brownRice: () => rice('#e6d3a8', specks('#a9844c')),
    beanRice: () => rice('#f6f4ea', [[8.4, 8.6, 1.2, '#3c2d33'], [13, 6.6, 1.2, '#3c2d33'], [15.8, 9.8, 1.2, '#3c2d33'], [11, 10.4, 1.2, '#3c2d33']]),
    friedRice: () => rice('#e9b95a', [[8.4, 8.4, .9, '#e4572e'], [12.4, 6.4, .9, '#6fb346'], [15.6, 8.8, .9, '#fff3c9'], [10.4, 10.4, .9, '#6fb346'], [14.4, 10.6, .9, '#e4572e']]),
    kimchiRice: () => rice('#df6a3a', [[8.4, 8.4, .9, '#fff0dc'], [12.4, 6.4, .9, '#a92f14'], [15.6, 8.8, .9, '#6fb346'], [10.4, 10.4, .9, '#a92f14'], [14.4, 10.6, .9, '#fff0dc']]),
    bibimbap: () => soup('#f7f3e6', `<path d="M3.6 11 8.4 8.8l2.6 2.4-3 2.4c-2-.3-3.6-1.1-4.4-2.6z" fill="#5fa13c"/><path d="M8.4 8.8h7.2L13.6 11h-2.6z" fill="#e8742a"/><path d="M15.6 8.8l4.8 2.2c-.8 1.5-2.4 2.3-4.4 2.6l-3-2.4z" fill="#8a5230"/><circle cx="12" cy="11.7" r="1.9" fill="#ffd23f"/>`),
    toppedRice: () => svg(`${BOWL}<path d="M4 11.9C4 7.4 7.6 5 12 5s8 2.4 8 6.9c-2.4 1.5-13.6 1.5-16 0z" fill="#8a5230"/>${line('M7.4 10.2c1.6-1.8 3-2.6 4.6-2.8', '#b98453')}${line('M12.6 10.6c.8-1.2 2-2 3.6-2.2', '#b98453')}${dots([[10, 11, .7, '#7fbf5a'], [15.4, 11, .7, '#7fbf5a']])}`),
    jajangRice: () => svg(`${BOWL}<path d="M4 11.9C4 6.7 7.6 3.7 12 3.7s8 3 8 8.2c-2.4 1.5-13.6 1.5-16 0z" fill="#fbfbf6"/><path d="M5.6 11.8c.4-3.6 3-5.6 6.4-5.6s6 2 6.4 5.6c-2.8 1-10 1-12.8 0z" fill="#33210f"/>${dots([[9.6, 9.4, .7, '#7fbf5a'], [13.8, 8.6, .7, '#e9b95a']])}`),

    jajangmyeon: () => soup('#f0cf6d', `${line(STRANDS, '#d9ad3f', 1.4)}<path d="M6.4 11.6c.6-2 3-2.9 5.6-2.9s5 .9 5.6 2.9c-1.6 1.5-9.6 1.5-11.2 0z" fill="#33210f"/>${dots([[10, 10.4, .6, '#7fbf5a'], [13.8, 10.2, .6, '#e9b95a']])}`),
    jjamppong: () => noodles('#d8401f', '#f6d98a', dots([[8, 10.4, .9, '#2c2c34'], [16, 10.8, .9, '#ffb9a2']])),
    spicyNoodle: () => noodles('#e8603a', '#f6d98a', dots([[12, 10.2, 1.1, '#fff8e6'], [15.6, 12, .7, '#6fb346']])),
    coldNoodle: () => noodles('#d8e6ea', '#9a8a78', dots([[12, 10.2, 1.1, '#fff8e6'], [15.6, 12, .7, '#6fb346']])),
    paleNoodle: () => noodles('#efe0bd', '#fffaf0', dots([[8.2, 10.2, .7, '#6fb346'], [15.8, 12.2, .7, '#e8742a']])),
    ramyeon: () => noodles('#e3772f', '#ffe08a', dots([[8.2, 10.2, .7, '#6fb346']])),
    japchae: () => heap('#6b4a33', line('M6.6 15.8c2-3.6 3.6-5.2 6-6', '#b98b62') + line('M9.6 16.6c1-3 2.6-4.8 5-5.6', '#b98b62') + line('M13 16.6c.6-1.8 1.8-3 3.6-3.6', '#b98b62') + dots([[9.4, 11.6, .8, '#e8742a'], [13.6, 13.6, .8, '#6fb346'], [11.4, 14.8, .7, '#ffd23f']])),
    tteokbokki: () => svg(`${PLATE}<path d="M4.4 16.6c0-2.8 3.4-5 7.6-5s7.6 2.2 7.6 5c-2.6 1.4-12.6 1.4-15.2 0z" fill="#d8341c"/>${[[5.8, 11.4, 22], [10, 8.4, -14], [13.4, 11.8, 14]].map(([x, y, r]) => `<rect x="${x}" y="${y}" width="6.6" height="3" rx="1.5" transform="rotate(${r} ${x + 3.3} ${y + 1.5})" fill="#fff4e4" stroke="#e8603a" stroke-width=".6"/>`).join('')}`),

    kimchiStew: () => soup('#d8401f', dots([[8, 10.8, 1.2, '#f6b49c'], [15.6, 11, 1.2, '#f6b49c']]) + cube(12, 11, 1.5, '#ffffff', '#e5e8ea', '#d5dade')),
    softTofuStew: () => soup('#d8401f', '<path d="M6.8 11.2c1-1.8 3.4-1.8 4.4-.4 1.2-1.4 4.6-1.4 5.6.4-1.6 1.4-8.6 1.4-10 0z" fill="#fff8ec"/>' + dots([[12, 12.8, .7, '#6fb346']])),
    soybeanSoup: () => soup('#b4843f', cube(8.6, 11.1, 1.7, '#fffdf4', '#e8e4d6', '#d8d4c4') + dots([[13, 10.4, .8, '#6fb346'], [15.8, 11.8, .8, '#6fb346'], [11.6, 12.6, .6, '#6fb346']])),
    seaweedSoup: () => soup('#c9b48a', line('M5.6 11c1.8-1.2 3.2.8 5 0', '#1f4a33', 1.6) + line('M11.6 12.4c1.8-1.2 3.4.6 5.4-.2', '#1f4a33', 1.6) + line('M12.6 9.8c1.2-.6 2.4.2 3.6-.2', '#1f4a33', 1.4)),
    redSoup: () => soup('#c8381c', line('M6.4 11c1.6-1 3 .6 4.4 0', '#7a3b1f', 1.5) + line('M12.4 12.2c1.4-.8 3 .4 4.4-.2', '#7fbf5a', 1.3) + dots([[13.6, 10.2, .7, '#ffd9a0']])),
    sproutSoup: () => soup('#eee6c8', line('M7 12.4c.8-1.2 1.6-1.8 2.6-2', '#fff8e0', 1) + dots([[9.8, 10.2, .8, '#f2cf4a'], [13.6, 10.6, .8, '#f2cf4a'], [16, 12, .8, '#f2cf4a']]) + line('M12 12.8c.4-.9 1-1.8 1.6-2.2', '#fff8e0', 1) + line('M14.4 13c.4-.5.9-.9 1.6-1', '#fff8e0', 1)),
    riceCakeSoup: () => soup('#f1ece0', [[7, 10.2, 18], [12, 9.6, -12], [10.6, 11.8, 8], [15, 11.2, -20]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="2.1" ry="1" transform="rotate(${r} ${x} ${y})" fill="#ffffff" stroke="#d8d4c8" stroke-width=".4"/>`).join('') + dots([[17.6, 10.6, .6, '#ffd23f'], [5.4, 12, .5, '#3c3c3c']])),
    dumplingSoup: () => soup('#ede4cf', '<path d="M5.6 11.6c.4-1.8 4.6-1.8 5 0-1 .9-4 .9-5 0z" fill="#fffdf6" stroke="#d8d0bc" stroke-width=".5"/><path d="M12.6 11.8c.4-1.8 4.6-1.8 5 0-1 .9-4 .9-5 0z" fill="#fffdf6" stroke="#d8d0bc" stroke-width=".5"/>' + dots([[11.8, 9.6, .6, '#6fb346']])),
    eggSoup: () => soup('#f0e4bf', line('M5.8 11c1.6-1.2 3 .8 4.6 0', '#ffcf33', 1.7) + line('M11.4 12.4c1.8-1 3.4.6 5.4-.2', '#ffcf33', 1.7) + dots([[13.4, 10, .7, '#6fb346']])),
    radishSoup: () => soup('#d9bb8c', cube(8.6, 11, 1.7, '#ffffff', '#e8e8e2', '#d8d8d0') + cube(14.6, 11.4, 1.7, '#ffffff', '#e8e8e2', '#d8d8d0') + dots([[11.6, 9.8, .7, '#7a4a2a'], [17.2, 10.6, .6, '#6fb346']])),
    fishCakeSoup: () => soup('#eadcb8', '<rect x="6" y="9.8" width="5.4" height="2.2" rx=".9" transform="rotate(10 8.7 10.9)" fill="#c99a5a"/><rect x="12.6" y="10.8" width="5.4" height="2.2" rx=".9" transform="rotate(-10 15.3 11.9)" fill="#c99a5a"/>' + dots([[12, 9.8, .6, '#6fb346']])),
    milkySoup: () => soup('#f5f1e6', line('M6.4 11c1.6-1 3 .6 4.4 0', '#c9b392', 1.5) + dots([[13.6, 10.4, .7, '#6fb346'], [15.8, 11.8, .7, '#6fb346'], [11.8, 12.4, .6, '#6fb346']])),
    creamSoup: () => soup('#f4dc8c', dots([[8.6, 10.6, .7, '#ffffff'], [12, 12, .7, '#6fb346'], [15, 10.4, .7, '#ffffff']])),
    stew: () => soup('#a9542a', cube(9, 11, 1.6, '#fffdf4', '#e8e4d6', '#d8d4c4') + dots([[13.6, 10.2, .8, '#6fb346'], [15.6, 12, .8, '#ffd9a0']])),
    clearSoup: () => soup('#dcc597', dots([[8, 10.6, .8, '#6fb346'], [12, 12.2, .8, '#fff8e6'], [15.6, 10.6, .8, '#8a5230']])),

    rolledEgg: () => svg(`${PLATE}${[4.4, 9.2, 14].map((x) => `<rect x="${x}" y="8.4" width="5.2" height="8.8" rx="1.6" fill="#ffd23f" stroke="#e8a91c" stroke-width=".8"/><path d="M${x + 2.6} 10.4c1.4 1 1.4 3.6 0 4.8" fill="none" stroke="#fff1a6" stroke-width="1"/>`).join('')}`),
    steamedEgg: () => soup('#ffd95a', dots([[9, 10.6, .7, '#6fb346'], [14.6, 11.4, .7, '#e8742a']])),
    friedEgg: () => svg('<path d="M4 12c-1-4 3-8 7-7.4 3-1.6 8 .4 9 4 1 3.4-.4 8-4.6 9.4-3.4 1.2-5 .4-7.4-.6C5.8 16.6 4.6 15 4 12z" fill="#fbfbf6"/><circle cx="12" cy="11.4" r="3.8" fill="#ffc21f"/><circle cx="10.8" cy="10.2" r="1" fill="#ffe894"/>'),
    quailEgg: () => svg(`${PLATE}${[[8, 13], [12, 10], [16, 13]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="3.8" fill="#b98a58"/><ellipse cx="${x - .8}" cy="${y - 1.2}" rx="1" ry="1.2" fill="#dfc29a"/>`).join('')}`),
    tofu: () => svg(cube(12, 12.4, 8, '#ffffff', '#e6e4d8', '#d4d2c4')),
    braisedTofu: () => svg(`${PLATE}${cube(8.2, 12.6, 4.2, '#fff7ea', '#e8dcc8', '#d9ccb4')}${cube(15.8, 12.6, 4.2, '#fff7ea', '#e8dcc8', '#d9ccb4')}<path d="M4.8 11c1.4-1.4 5.2-1.4 6.8 0-1 .6-1.8.4-3.4.4s-2.4.2-3.4-.4zM12.4 11c1.4-1.4 5.2-1.4 6.8 0-1 .6-1.8.4-3.4.4s-2.4.2-3.4-.4z" fill="#d8401f"/>${dots([[8.2, 10, .5, '#6fb346'], [15.8, 10, .5, '#6fb346']])}`),
    blackBeans: () => svg(`${PLATE}${[[7, 15], [11, 15.6], [15, 15.4], [18, 14.6], [9, 12], [13, 12.2], [16, 11.8], [11, 9.2], [14, 9.4]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.1" ry="1.7" fill="#23191d"/><circle cx="${x - .6}" cy="${y - .5}" r=".4" fill="#8a7a80"/>`).join('')}`),
    anchovy: () => heap('#b7a06a', line('M7.4 15.6c1.2-1.6 2.4-2.4 3.8-2.6', '#e8edf3') + line('M12 12c1.2-.8 2.2-1 3.4-.8', '#e8edf3') + line('M12.4 16c1-1.2 2-1.6 3.4-1.8', '#e8edf3') + line('M9.4 10.8c.6-.5 1.2-.7 2-.7', '#e8edf3') + dots([[11.2, 13, .4, '#23191d'], [15.4, 11.2, .4, '#23191d'], [15.8, 14.2, .4, '#23191d']])),
    squidShreds: () => shreds('#d9542c', '#ffd2a8'),
    fishCake: () => svg(`${PLATE}${[[4.6, 11.4, -18], [9, 8, 14], [12.2, 12, -8]].map(([x, y, r]) => `<rect x="${x}" y="${y}" width="8" height="3.6" rx="1.2" transform="rotate(${r} ${x + 4} ${y + 1.8})" fill="#cf9f5e" stroke="#a87a3e" stroke-width=".6"/>`).join('')}${dots([[11.6, 15.6, .7, '#e8742a'], [8, 9, .7, '#6fb346']])}`),
    potato: () => svg(`${PLATE}${cube(8, 13.6, 3.6, '#f3cc78', '#d9a650', '#c4923f')}${cube(16, 13.6, 3.6, '#f3cc78', '#d9a650', '#c4923f')}${cube(12, 9.4, 3.6, '#f6d68c', '#d9a650', '#c4923f')}`),
    greenNamul: () => shreds('#3f8a3c', '#8fd06a'),
    sprouts: () => svg(`${PLATE}${line('M6.4 16.4c1-3.4 2.4-5.6 4.4-7', '#fff8e0', 1.3)}${line('M10.4 16.8c.4-3 1.4-5.2 3.2-6.8', '#fff8e0', 1.3)}${line('M14 16.8c.4-2 1.2-3.8 3-5', '#fff8e0', 1.3)}${dots([[11, 9, 1.2, '#f6d13f'], [13.9, 9.6, 1.2, '#f6d13f'], [17.3, 11.4, 1.2, '#f6d13f']])}`),
    beanSprout: () => shreds('#efeadb', '#c9c2a8'),
    fernNamul: () => shreds('#5c3d24', '#94683f'),
    radishSalad: () => shreds('#f7e6da', '#e4572e', '#ec7a52'),
    cucumberSalad: () => shreds('#7fbb55', '#d8401f', '#d6ecb4'),
    darkSeaweed: () => shreds('#1f4a33', '#4d8a64'),
    laver: () => svg('<rect x="4.6" y="5" width="13" height="13" rx="1.4" transform="rotate(-8 11 11.5)" fill="#1c2b26" stroke="#3b5148" stroke-width=".8"/><rect x="7" y="7.6" width="13" height="13" rx="1.4" transform="rotate(6 13.5 14)" fill="#22342e" stroke="#4b6459" stroke-width=".8"/>'),

    greenGrapes: () => grapes('#bfe163', '#8fb93f', '#effad0'),
    pear: () => svg(`${line('M12.4 6.2c0-1.4.4-2.4 1.2-3.2', '#7a5a34', 1.5)}<circle cx="12" cy="13.6" r="7.8" fill="#dcb35c"/><path d="M12 21.4a7.8 7.8 0 0 0 7.8-7.8" fill="none" stroke="#b98c3c" stroke-width="1.6"/>${dots([[9, 11, .4, '#a97f35'], [12.6, 9.6, .4, '#a97f35'], [14.8, 12.6, .4, '#a97f35'], [10.6, 15, .4, '#a97f35'], [14, 16.4, .4, '#a97f35']])}`),
    persimmon: () => round('#f0822a', '#c9601a', '<path d="M12 6.6 8.4 4.8l.8 3-3 .6 3 1.6L12 8.4l2.8 1.6 3-1.6-3-.6.8-3z" fill="#4f7a34"/>'),
    plum: () => round('#a52a4a', '#761a34', `${line('M12 5.4c0-.8.3-1.6.9-2.2', '#7a5a34', 1.4)}<ellipse cx="9" cy="10.4" rx="1.6" ry="1" fill="#d9708c"/>`),
    koreanMelon: () => svg(`<ellipse cx="12" cy="12.6" rx="9.4" ry="7.2" fill="#ffd21f"/>${line('M12 5.4v14.4', '#fff6c8', 1.3)}${line('M7.4 6.4c-1.6 3.8-1.6 8.4 0 12.2', '#fff6c8', 1.3)}${line('M16.6 6.4c1.6 3.8 1.6 8.4 0 12.2', '#fff6c8', 1.3)}`),
  };

  // 앞의 줄이 먼저다. 우리말 음식 이름은 끝말이 종류를 정하므로(김치볶음밥은 밥, 김치찌개는 찌개) 밥·면·국을 김치보다 먼저 본다.
  const RULES = [
    [/김치볶음밥/, 'kimchiRice'], [/볶음밥|필라프|나시고랭|리조또|오므라이스/, 'friedRice'], [/짜장밥|자장밥/, 'jajangRice'], [/비빔밥/, 'bibimbap'],
    [/덮밥|규동|가츠동|부타동|텐동|에비동/, 'toppedRice'],
    [/(흑미|잡곡|오곡|혼합|기장|수수|차조|조|귀리|렌틸|율무|발아).*밥$/, 'mixedRice'], [/(현미|보리).*밥$/, 'brownRice'], [/콩밥$/, 'beanRice'], [/(쌀|백미|흰)밥$|^밥$/, 'whiteRice'],

    [/짜장면|자장면|짜장|자장/, 'jajangmyeon'], [/짬뽕/, 'jjamppong'], [/쫄면|비빔면|비빔국수/, 'spicyNoodle'], [/냉면|콩국수|막국수/, 'coldNoodle'], [/라면/, 'ramyeon'],
    [/우동|칼국수|국수|수제비/, 'paleNoodle'], [/잡채/, 'japchae'], [/떡볶이|라볶이/, 'tteokbokki'],

    [/김치찌개|김칫국|김치국/, 'kimchiStew'], [/순두부/, 'softTofuStew'], [/육개장|닭개장|부대|매운탕|얼큰|동태(찌개|탕)|해물탕|짬뽕국/, 'redSoup'],
    [/된장|청국장|시래기국|시래깃국|우거지|아욱국|근대국|냉이국|배추국|배춧국|미소/, 'soybeanSoup'], [/미역.*(국|탕)$/, 'seaweedSoup'], [/콩나물.*(국|탕)$/, 'sproutSoup'],
    [/떡만두|만두국|만둣국/, 'dumplingSoup'], [/떡국/, 'riceCakeSoup'], [/(계란|달걀).*(국|탕)$/, 'eggSoup'], [/(무국|뭇국|소고기국|쇠고기국|소고깃국)/, 'radishSoup'],
    [/(어묵|오뎅|유부).*(국|탕)$/, 'fishCakeSoup'], [/북엇국|북어|황태.*국|설렁탕|곰탕|사골|갈비탕|삼계탕|반계탕/, 'milkySoup'], [/스프$|수프$/, 'creamSoup'], [/찌개$|전골$/, 'stew'], [/[가-힣]국$|(?<![맛사설])탕$/, 'clearSoup'],

    [/꿔바로우|궈바로우|꿔바로/, 'kkwobarou'], [/탕수/, 'tangsuyuk'], [/돈까스|돈가스|까스$|가스$|커틀릿|카츠$/, 'cutlet'], [/닭강정|양념치킨|깐풍|유린기/, 'glazedChicken'],
    [/제육|두루치기|오삼/, 'jeyuk'], [/불고기/, 'bulgogi'], [/떡갈비|함박|미트볼/, 'patty'], [/갈비/, 'ribs'], [/수육|보쌈|편육/, 'pork'], [/장조림/, 'braised'],

    [/계란말이|달걀말이/, 'rolledEgg'], [/계란찜|달걀찜/, 'steamedEgg'], [/(계란|달걀)(후라이|프라이)/, 'friedEgg'], [/메추리알/, 'quailEgg'],
    [/두부(조림|구이|부침|강정)|마파두부/, 'braisedTofu'], [/두부/, 'tofu'], [/콩자반|콩조림|검은콩|서리태/, 'blackBeans'], [/멸치/, 'anchovy'], [/진미채|오징어채/, 'squidShreds'],
    [/(어묵|오뎅)(볶음|조림|무침)/, 'fishCake'], [/감자(조림|볶음|채)/, 'potato'],

    [/만두|김치전|전$|튀김|고로케/, null],
    [/깍두기|석박지|섞박지/, 'kkakdugi'], [/총각|알타리/, 'chonggak'], [/동치미|나박|물김치/, 'waterKimchi'], [/백김치/, 'whiteKimchi'], [/소박이/, 'oisobagi'],
    [/열무|얼갈이김치|파김치|갓김치|부추김치|부추겉절이/, 'greenKimchi'], [/김치|겉절이/, 'kimchi'], [/단무지/, 'danmuji'], [/치킨무|쌈무/, 'whiteRadish'], [/피클|오이지/, 'pickle'],

    [/오이.*(무침|생채)/, 'cucumberSalad'], [/무생채|도라지|생채$/, 'radishSalad'], [/콩나물/, 'sprouts'], [/숙주/, 'beanSprout'], [/고사리/, 'fernNamul'], [/미역줄기|다시마|톳|파래/, 'darkSeaweed'],
    [/김자반|구운김|조미김|돌김|김가루|^김$/, 'laver'], [/시금치|나물$|취나물|부추무침|쑥갓/, 'greenNamul'],

    [/샤인머스|청포도/, 'greenGrapes'], [/^배$|신고배|나주배/, 'pear'], [/단감|홍시|연시|곶감|^감$/, 'persimmon'], [/자두/, 'plum'], [/참외/, 'koreanMelon'],
  ];

  // 마실 것·과자는 재료 이름(포도주스, 샤인머스캣 젤리)에 끌려가지 않게 그림 문자 표로 넘긴다.
  const NOT_A_DISH = /주스|쥬스|에이드|음료|스무디|젤리|아이스|요구르트|요거트|케이크|케익|쿠키|빵$|맛탕|사탕|우유/;

  const plainName = (dish) => (String(dish).replace(/\(.*?\)|\[.*?\]/g, '').split(/[/&+,]/)[0] || String(dish)).replace(/[\s*#~]/g, '');

  function forDish(dish) {
    const name = plainName(dish);
    if (!name || NOT_A_DISH.test(name)) return null;
    for (const [pattern, key] of RULES) {
      if (pattern.test(name)) return key ? ICON[key]() : null;
    }
    return null;
  }

  // 날마다 나오는 흰 우유는 메뉴에 적지 않는다(딸기·초코·바나나 우유는 그날의 메뉴라 남긴다).
  const isDailyMilk = (dish) => /^(흰|백|저지방|무지방|멸균|친환경|유기농|일반|급식)?우유(급식)?$/.test(plainName(dish));

  global.MealIcons = Object.freeze({ forDish, isDailyMilk, ICON_NAMES: Object.freeze(Object.keys(ICON)), draw: (key) => ICON[key]() });
})(window);
