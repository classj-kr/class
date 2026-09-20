/* Relative linear-light components; encode to sRGB only for display.
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 * Ideal CMY filters absorb R/G/B respectively; this is not a pigment model.
 */
(function (root) {
  'use strict';
  const clamp = value => Math.min(100, Math.max(0, Number(value) || 0));
  const encode = linear => Math.round(255 * (linear <= 0.0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055));
  function components(mode, values) {
    if (!['light', 'filter'].includes(mode)) throw new Error('Unknown mixing mode');
    return [0, 1, 2].map(index => mode === 'light' ? clamp(values[index]) / 100 : 1 - clamp(values[index]) / 100);
  }
  const rgb = (mode, values) => components(mode, values).map(encode);
  const css = values => `rgb(${values.join(', ')})`;
  function name(values) {
    const key = values.join(',');
    const names = { '0,0,0':'검정', '255,255,255':'하양', '255,0,0':'빨강', '0,255,0':'초록', '0,0,255':'파랑', '255,255,0':'노랑', '0,255,255':'시안(청록)', '255,0,255':'마젠타(자홍)' };
    if (names[key]) return names[key];
    if (Math.max(...values) - Math.min(...values) < 3) return '회색';
    return '중간색';
  }
  const modes = {
    light: { names:['빨강', '초록', '파랑'], codes:['R', 'G', 'B'], colors:['#ff4d5e', '#2ea86c', '#5489f0'], defaults:[100, 0, 0] },
    filter: { names:['시안(청록)', '마젠타(자홍)', '노랑'], codes:['C', 'M', 'Y'], colors:['#00a6b6', '#c74f95', '#ad8500'], defaults:[100, 0, 0] }
  };
  const experiments = [
    { mode:'light', values:[100,100,0], title:'빨강 빛과 초록 빛을 겹치면?', instruction:'두 조명의 세기는 같고, 파랑 조명은 꺼져 있습니다.', options:['노랑','갈색','하양'], answer:'노랑', explanation:'빨강과 초록 빛이 더해져 노랑으로 보입니다. 물감을 섞는 경우와 구분해 보세요.' },
    { mode:'light', values:[100,100,100], title:'여기에 파랑 빛도 더하면?', instruction:'빨강·초록·파랑 조명을 같은 세기로 모두 켭니다.', options:['검정','하양','회색'], answer:'하양', explanation:'세 빛 성분이 모두 더해져 하양으로 보입니다. 검정은 이 실험에서 세 조명을 모두 껐을 때 나타납니다.' },
    { mode:'filter', values:[100,0,100], title:'시안 필터와 노랑 필터를 겹치면?', instruction:'흰빛이 두 필터를 차례로 통과합니다. 마젠타 필터는 빼 둡니다.', options:['하양','시안(청록)','초록'], answer:'초록', explanation:'시안 필터는 빨강을, 노랑 필터는 파랑을 걸러 냅니다. 두 필터를 모두 통과하는 초록 빛이 남습니다.' },
    { mode:'filter', values:[100,100,100], title:'세 가지 색 필터를 모두 겹치면?', instruction:'흰빛이 시안·마젠타·노랑 필터를 모두 통과하게 놓습니다.', options:['하양','검정','노랑'], answer:'검정', explanation:'이상적인 세 필터가 빨강·초록·파랑 성분을 각각 걸러 냅니다. 통과하는 빛이 없어 검정으로 보입니다.' }
  ];
  const api = Object.freeze({ clamp, encode, components, rgb, css, name, modes, experiments });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ColorMix = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
