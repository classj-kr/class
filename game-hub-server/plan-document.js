'use strict';
// 수행평가 계획서 같은 문서를 받아 글을 꺼내거나(hwpx·docx·txt), 그대로 제미나이에 보낼 수 있는지(pdf·그림)
// 가려 주는 작은 도우미. 바깥 꾸러미 없이 zip(hwpx·docx)만 직접 읽는다.
const zlib = require('node:zlib');

const MAX_TEXT_CHARS = 60000;

function sniff(buffer, fileName = '') {
  const ext = String(fileName).toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] || '';
  const head = buffer.subarray(0, 12);
  if (head.subarray(0, 4).toString('latin1') === '%PDF') return { kind: 'inline', mime: 'application/pdf' };
  if (head[0] === 0x89 && head.subarray(1, 4).toString('latin1') === 'PNG') return { kind: 'inline', mime: 'image/png' };
  if (head[0] === 0xff && head[1] === 0xd8) return { kind: 'inline', mime: 'image/jpeg' };
  if (head.subarray(0, 4).toString('latin1') === 'RIFF' && head.subarray(8, 12).toString('latin1') === 'WEBP') return { kind: 'inline', mime: 'image/webp' };
  if (head[0] === 0x50 && head[1] === 0x4b) return { kind: 'zip', mime: ext === 'docx' ? 'docx' : 'hwpx' };
  if (ext === 'txt' || ext === 'md' || ext === 'csv') return { kind: 'text', mime: 'text/plain' };
  if (ext === 'hwp') return { kind: 'unsupported', mime: 'hwp' };
  return { kind: 'unsupported', mime: ext || 'unknown' };
}

// zip 의 가운데 목록(central directory)을 읽어 이름→압축 자료를 돌려준다.
function readZipEntries(buffer) {
  const end = buffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (end < 0) throw new Error('zip 끝 표시가 없습니다.');
  const count = buffer.readUInt16LE(end + 10);
  let offset = buffer.readUInt32LE(end + 16);
  const entries = new Map();
  for (let i = 0; i < count; i += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) break;
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString('utf8');
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    entries.set(name, { method, data: buffer.subarray(dataStart, dataStart + compressedSize) });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function inflateEntry(entry) {
  if (entry.method === 0) return entry.data;
  if (entry.method === 8) return zlib.inflateRawSync(entry.data);
  throw new Error('지원하지 않는 압축 방식입니다.');
}

// XML 에서 글만 남긴다. 문단·표 칸 경계는 줄바꿈이나 탭으로 바꿔 표가 표답게 남게 한다.
function xmlToText(xml) {
  return xml
    .replace(/<\/(?:hp:p|w:p|hp:tr|w:tr)>/g, '\n')
    .replace(/<\/(?:hp:tc|w:tc)>/g, '\t')
    .replace(/<(?:w:tab|hp:tab)[^>]*\/>/g, '\t')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&')
    .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function zipToText(buffer, mime) {
  const entries = readZipEntries(buffer);
  const wanted = mime === 'docx'
    ? [...entries.keys()].filter((name) => name === 'word/document.xml')
    : [...entries.keys()].filter((name) => /^Contents\/section\d+\.xml$/i.test(name)).sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  if (wanted.length === 0) throw new Error(mime === 'docx' ? 'docx 안에 본문이 없습니다.' : 'hwpx 안에 본문이 없습니다.');
  return wanted.map((name) => xmlToText(inflateEntry(entries.get(name)).toString('utf8'))).join('\n\n');
}

function decodeText(buffer) {
  const utf8 = buffer.toString('utf8');
  if (!utf8.includes('�')) return utf8.replace(/^﻿/, '');
  try { return new TextDecoder('euc-kr').decode(buffer); } catch (_) { return utf8; }
}

// 돌려주는 값: { kind: 'text', text } 또는 { kind: 'inline', mime, base64 } 또는 { kind: 'unsupported', reason }
function readPlanDocument(buffer, fileName) {
  const found = sniff(buffer, fileName);
  if (found.kind === 'inline') return { kind: 'inline', mime: found.mime, base64: buffer.toString('base64') };
  if (found.kind === 'zip') {
    try { return { kind: 'text', text: zipToText(buffer, found.mime).slice(0, MAX_TEXT_CHARS) }; }
    catch (error) { return { kind: 'unsupported', reason: error.message }; }
  }
  if (found.kind === 'text') return { kind: 'text', text: decodeText(buffer).slice(0, MAX_TEXT_CHARS) };
  if (found.mime === 'hwp') return { kind: 'unsupported', reason: '한글(.hwp) 파일은 읽지 못합니다. 한글에서 PDF나 hwpx로 저장해 올려 주세요.' };
  return { kind: 'unsupported', reason: '읽을 수 있는 파일이 아닙니다. PDF·그림(png/jpg)·hwpx·docx·txt 를 올려 주세요.' };
}

module.exports = { readPlanDocument, sniff, xmlToText, readZipEntries };
