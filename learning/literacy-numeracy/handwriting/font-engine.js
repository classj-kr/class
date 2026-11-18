(function (root) {
  'use strict';
  const commonjs = typeof module === 'object' && module.exports;
  const PenM = commonjs ? require('../../../assets/fonts/classj-pen-m/source') : root.HandwritingFont;
  const Legacy = commonjs ? require('./font-source') : root.HandwritingLegacyFont;
  const Alphabet = commonjs ? require('./alphabet-source') : root.HandwritingAlphabet;
  if (!PenM || PenM.FAMILY !== 'ClassJ Pen M' || !Legacy || !Alphabet) throw Error('글씨 모형을 불러오지 못했어요.');
  const STYLES = ['gyeongpil', 'badasseugi', 'alphabet'];
  // 문장 부호(한글 글씨체에서만): 마침표·쉼표·물음표·느낌표. 글꼴 파일에는 없고 획 중심선을 둥근 펜으로 그린다.
  // 한글 모형 좌표(글자 높이 약 91, 바닥 약 94)로 적어, 앞 글자 바로 뒤 좁은 자리의 바닥 쪽에 찍힌다(교과서처럼).
  const MARKS = {
    '.': [[[38, 90.5], [39.2, 91.2]]],
    ',': [[[39.5, 86.5], [40, 91], [37.5, 97.5]]],
    '?': [[[30, 30], [33, 22], [42, 18], [51, 22], [53, 31], [48, 40], [42, 47], [41, 61]], [[41, 89.5], [41.8, 90.3]]],
    '!': [[[42, 19], [42, 66]], [[42, 89.5], [42.8, 90.3]]],
  };
  const isMark = (char) => Object.prototype.hasOwnProperty.call(MARKS, char);
  let style = 'gyeongpil';
  const current = () => (style === 'alphabet' ? Alphabet : style === 'badasseugi' ? Legacy : PenM);
  const api = Object.freeze({
    model: (char) => (style !== 'alphabet' && isMark(char) ? MARKS[char].map((p) => p.map((q) => [...q])) : current().model(char)),
    // 문장 부호인가(한글 글씨체에서만 쓴다)
    mark: (char) => style !== 'alphabet' && isMark(char),
    components: (char) => current().components(char),
    outlines: (points, index, strokes) => current().outlines(points, index, strokes),
    sample: PenM.sample,
    setStyle(next) {
      style = STYLES.includes(next) ? next : 'gyeongpil';
      if (style !== 'alphabet') Legacy.setStyle(style);
    },
    style: () => style,
    // 지금 글씨체가 쓰는 글자인가: 알파벳은 A~Z·a~z, 한글 글씨체는 현대 한글 음절과 호환 자모, 문장 부호 . , ? !
    has(char) {
      if (style === 'alphabet') return Alphabet.has(char);
      if (isMark(char)) return true;
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
