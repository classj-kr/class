(function (root) {
  'use strict';
  const commonjs = typeof module === 'object' && module.exports;
  const PenM = commonjs ? require('../../../assets/fonts/classj-pen-m/source') : root.HandwritingFont;
  const Legacy = commonjs ? require('./font-source') : root.HandwritingLegacyFont;
  if (!PenM || PenM.FAMILY !== 'ClassJ Pen M' || !Legacy) throw Error('글씨 모형을 불러오지 못했어요.');
  let style = 'gyeongpil';
  const current = () => style === 'badasseugi' ? Legacy : PenM;
  const api = Object.freeze({
    model: (char) => current().model(char),
    components: (char) => current().components(char),
    outlines: (points, index, strokes) => current().outlines(points, index, strokes),
    sample: PenM.sample,
    setStyle(next) {
      style = next === 'badasseugi' ? 'badasseugi' : 'gyeongpil';
      Legacy.setStyle(style);
    },
    style: () => style,
    CHO: PenM.CHO,
    JUNG: PenM.JUNG,
    JONG: PenM.JONG,
    FAMILY: PenM.FAMILY,
    VERSION: PenM.VERSION,
  });
  if (commonjs) module.exports = api;
  else root.HandwritingFont = api;
})(typeof window === 'object' ? window : globalThis);
