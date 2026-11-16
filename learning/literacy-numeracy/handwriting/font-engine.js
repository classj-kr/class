(function (root) {
  'use strict';
  const commonjs = typeof module === 'object' && module.exports;
  const PenM = commonjs ? require('../../../assets/fonts/classj-pen-m/source') : root.HandwritingFont;
  const Legacy = commonjs ? require('./font-source') : root.HandwritingLegacyFont;
  const Alphabet = commonjs ? require('./alphabet-source') : root.HandwritingAlphabet;
  if (!PenM || PenM.FAMILY !== 'ClassJ Pen M' || !Legacy || !Alphabet) throw Error('글씨 모형을 불러오지 못했어요.');
  const STYLES = ['gyeongpil', 'badasseugi', 'alphabet'];
  let style = 'gyeongpil';
  const current = () => (style === 'alphabet' ? Alphabet : style === 'badasseugi' ? Legacy : PenM);
  const api = Object.freeze({
    model: (char) => current().model(char),
    components: (char) => current().components(char),
    outlines: (points, index, strokes) => current().outlines(points, index, strokes),
    sample: PenM.sample,
    setStyle(next) {
      style = STYLES.includes(next) ? next : 'gyeongpil';
      if (style !== 'alphabet') Legacy.setStyle(style);
    },
    style: () => style,
    // 지금 글씨체가 쓰는 글자인가: 알파벳은 A~Z·a~z, 한글 글씨체는 현대 한글 음절과 호환 자모.
    has(char) {
      if (style === 'alphabet') return Alphabet.has(char);
      const cp = char?.codePointAt(0);
      return (cp >= 0xac00 && cp <= 0xd7a3) || (cp >= 0x3131 && cp <= 0x3163);
    },
    Alphabet,
    CHO: PenM.CHO,
    JUNG: PenM.JUNG,
    JONG: PenM.JONG,
    FAMILY: PenM.FAMILY,
    VERSION: PenM.VERSION,
  });
  if (commonjs) module.exports = api;
  else root.HandwritingFont = api;
})(typeof window === 'object' ? window : globalThis);
