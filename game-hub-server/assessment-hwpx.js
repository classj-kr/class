'use strict';
// A real OWPML package, with editable tables and a page break at each subject.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const { readZipEntries } = require('./plan-document');
const blank = readZipEntries(fs.readFileSync(path.join(__dirname, 'data/hwpx/blank.hwpx')));
const template = name => { const e = blank.get(name); return (e.method === 8 ? zlib.inflateRawSync(e.data) : e.data).toString('utf8'); };
const xml = value => String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const crcTable = Array.from({ length: 256 }, (_, n) => { for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1; return n >>> 0; });
function crc32(data) { let n = 0xffffffff; for (const b of data) n = crcTable[(n ^ b) & 255] ^ (n >>> 8); return (n ^ 0xffffffff) >>> 0; }
function zip(files) {
  const local = [], central = []; let offset = 0;
  for (const [name, value] of files) {
    const filename = Buffer.from(name), raw = Buffer.from(value), method = name === 'mimetype' ? 0 : 8;
    const data = method ? zlib.deflateRawSync(raw) : raw, crc = crc32(raw);
    const l = Buffer.alloc(30); l.writeUInt32LE(0x04034b50); l.writeUInt16LE(20, 4); l.writeUInt16LE(0x800, 6); l.writeUInt16LE(method, 8);
    l.writeUInt16LE(33, 12); l.writeUInt32LE(crc, 14); l.writeUInt32LE(data.length, 18); l.writeUInt32LE(raw.length, 22); l.writeUInt16LE(filename.length, 26);
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x800, 8); c.writeUInt16LE(method, 10);
    c.writeUInt16LE(33, 14); c.writeUInt32LE(crc, 16); c.writeUInt32LE(data.length, 20); c.writeUInt32LE(raw.length, 24); c.writeUInt16LE(filename.length, 28); c.writeUInt32LE(offset, 42);
    local.push(l, filename, data); central.push(c, filename); offset += l.length + filename.length + data.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50); end.writeUInt16LE(files.size, 8); end.writeUInt16LE(files.size, 10);
  end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}
function buildAssessmentHwpx({ year, grade, semester, schoolName, subjects }) {
  let id = 1;
  const paragraph = (text, { pageBreak = false, heading = false, control = '' } = {}) =>
    `<hp:p id="${id++}" paraPrIDRef="0" styleIDRef="0" pageBreak="${+pageBreak}" columnBreak="0" merged="0"><hp:run charPrIDRef="${heading ? 5 : 0}">${control}<hp:t>${xml(text).replace(/\n/g, '<hp:lineBreak/>')}</hp:t></hp:run></hp:p>`;
  function table(rows) {
    const heights = rows.map(([label, value]) => Math.max(2600, (String(value || '').split('\n').reduce((n, line) => n + Math.max(1, Math.ceil([...line].length / 34)), 0)) * 1600 + 800));
    const height = heights.reduce((a,b) => a+b,0), tableId = id++;
    const cells = rows.map((row, r) => `<hp:tr>${row.map((value,c) => `<hp:tc name="" header="0" hasMargin="1" protect="0" editable="0" dirty="1" borderFillIDRef="3"><hp:subList id="" textDirection="HORIZONTAL" lineWrap="BREAK" vertAlign="CENTER" linkListIDRef="0" linkListNextIDRef="0" textWidth="0" textHeight="0" hasTextRef="0" hasNumRef="0">${paragraph(value)}</hp:subList><hp:cellAddr colAddr="${c}" rowAddr="${r}"/><hp:cellSpan colSpan="1" rowSpan="1"/><hp:cellSz width="${c ? 34520 : 8000}" height="${heights[r]}"/><hp:cellMargin left="500" right="500" top="400" bottom="400"/></hp:tc>`).join('')}</hp:tr>`).join('');
    const control = `<hp:tbl id="${tableId}" zOrder="0" numberingType="TABLE" textWrap="TOP_AND_BOTTOM" textFlow="BOTH_SIDES" lock="0" dropcapstyle="None" pageBreak="CELL" repeatHeader="0" rowCnt="${rows.length}" colCnt="2" cellSpacing="0" borderFillIDRef="3" noAdjust="0"><hp:sz width="42520" widthRelTo="ABSOLUTE" height="${height}" heightRelTo="ABSOLUTE" protect="0"/><hp:pos treatAsChar="0" affectLSpacing="0" flowWithText="1" allowOverlap="0" holdAnchorAndSO="0" vertRelTo="PARA" horzRelTo="COLUMN" vertAlign="TOP" horzAlign="LEFT" vertOffset="0" horzOffset="0"/><hp:outMargin left="0" right="0" top="0" bottom="800"/><hp:inMargin left="500" right="500" top="400" bottom="400"/>${cells}</hp:tbl>`;
    return paragraph('', { control }) + paragraph('');
  }
  const title = `${year}학년도 ${grade}학년 ${semester}학기 수행평가 계획`;
  const sections = [];
  const root = template('Contents/section0.xml').match(/^[\s\S]*?<hs:sec\b[^>]*>/)[0];
  const secPr = template('Contents/section0.xml').match(/<hp:secPr\b[\s\S]*?<\/hp:secPr>/)[0];
  const column = '<hp:ctrl><hp:colPr id="" type="NEWSPAPER" layout="LEFT" colCount="1" sameSz="1" sameGap="0"/></hp:ctrl>';
  for (const [i, subject] of subjects.entries()) {
    sections.push(paragraph(title, { heading:true, pageBreak:i>0, control:i===0 ? secPr + column : '' }));
    sections.push(paragraph(`${schoolName || ''}  |  ${subject.subject}`, { heading:true }));
    if (!subject.items.length) sections.push(paragraph('수행평가 계획 미작성'));
    for (const [j, item] of subject.items.entries()) {
      sections.push(paragraph(`${j+1}. ${item.element || item.assessmentTitle || '평가 요소 미작성'}`));
      sections.push(table([
        ['평가 시기', item.resolvedTiming || ''], ['영역', item.domain],
        ['성취기준', item.standards.map(s => `[${s.code}] ${s.text}`).join('\n')],
        ['평가 요소', item.element], ['평가 방법', item.method || ''],
        ...item.criteria.map(c => [c.label, c.text])
      ]));
    }
  }
  let header = template('Contents/header.xml');
  const border = header.match(/<hh:borderFill id="1"[\s\S]*?<\/hh:borderFill>/)[0]
    .replace('id="1"','id="3"').replace(/type="NONE" width/g,'type="SOLID" width');
  header = header.replace('<hh:borderFills itemCnt="2">','<hh:borderFills itemCnt="3">').replace('</hh:borderFills>',border+'</hh:borderFills>');
  let manifest = template('Contents/content.hpf').replace(/<opf:metadata>[\s\S]*?<\/opf:metadata>/,
    `<opf:metadata><opf:title>${xml(title)}</opf:title><opf:language>ko</opf:language><opf:meta name="creator" content="text">${xml(schoolName || '')}</opf:meta></opf:metadata>`);
  const files = new Map([['mimetype','application/hwp+zip'],['version.xml',template('version.xml')],['Contents/header.xml',header],
    ['Contents/section0.xml',root+sections.join('')+'</hs:sec>'],['Contents/content.hpf',manifest],
    ['settings.xml',template('settings.xml')],['META-INF/container.xml',template('META-INF/container.xml')],
    ['META-INF/container.rdf',template('META-INF/container.rdf')],
    ['META-INF/manifest.xml',template('META-INF/manifest.xml')],
    ['Preview/PrvText.txt',title+'\n'+subjects.map(s=>s.subject+'\n'+s.items.map(i=>i.element).join('\n')).join('\n')]]);
  return zip(files);
}
module.exports = { buildAssessmentHwpx, crc32 };
