import {
  $, setStatus, openPdfjsDocument, renderPage, isPdf, baseName, formatSize, downloadBlob, setupDropZone, parseRange
} from './common.js?v=20260929-pdf-tools';

const JSZIP_URL = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm';
const THUMB_SIZE = 240;
const MAX_SIDE = 7000;

let source = null; // { name, doc, pageCount, entries: [{ index, selected, card, thumb, checkbox }] }
let token = 0;
let busy = false;

function selectSegment(group, button) {
  for (const item of group.querySelectorAll('button')) {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  }
}
for (const group of [$('image-quality'), $('image-format')]) {
  for (const button of group.querySelectorAll('button')) button.addEventListener('click', () => selectSegment(group, button));
}
const selectedDpi = () => Number($('image-quality').querySelector('.active').dataset.dpi);
const selectedFormat = () => $('image-format').querySelector('.active').dataset.format;

function createCard(entry) {
  const card = document.createElement('div');
  card.className = 'page-card';
  const thumb = document.createElement('div');
  thumb.className = 'page-thumb selectable';
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.textContent = '불러오는 중';
  thumb.append(loading);
  thumb.addEventListener('click', () => { entry.selected = !entry.selected; updateUi(); });
  const meta = document.createElement('div');
  meta.className = 'page-meta';
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', () => { entry.selected = checkbox.checked; updateUi(); });
  label.append(checkbox, document.createTextNode((entry.index + 1) + '쪽'));
  meta.append(label);
  card.append(thumb, meta);
  Object.assign(entry, { card, thumb, checkbox });
}

function updateUi() {
  const entries = source?.entries || [];
  for (const entry of entries) {
    entry.card.classList.toggle('selected', entry.selected);
    entry.checkbox.checked = entry.selected;
  }
  const count = entries.filter((entry) => entry.selected).length;
  $('image-selected-count').textContent = count + '쪽';
  const idle = Boolean(source) && !busy;
  for (const id of ['image-range', 'image-range-apply', 'image-select-all', 'image-select-none']) $(id).disabled = !idle;
  $('image-download').disabled = !idle || !count;
  $('image-download').textContent = count > 1 ? count + '쪽을 ZIP으로 저장' : '이미지로 저장';
}

async function openFile(files) {
  const file = files.find(isPdf);
  if (!file) { setStatus('image-status', 'PDF 파일을 선택해 주세요.'); return; }
  const current = ++token;
  setStatus('image-status', 'PDF를 여는 중…');
  let doc;
  try {
    doc = await openPdfjsDocument(await file.arrayBuffer());
  } catch (error) {
    if (current !== token) return;
    setStatus('image-status', error?.name === 'PasswordException'
      ? '열람 암호가 걸린 PDF는 변환할 수 없습니다.'
      : 'PDF를 열 수 없습니다. 인터넷 연결과 파일을 확인해 주세요.');
    return;
  }
  if (current !== token) { doc.destroy(); return; }
  source?.doc.destroy();
  const entries = Array.from({ length: doc.numPages }, (_, index) => {
    const entry = { index, selected: true };
    createCard(entry);
    return entry;
  });
  source = { name: file.name, doc, pageCount: doc.numPages, entries };
  $('image-title').textContent = file.name;
  $('image-range').value = '';
  $('image-grid').replaceChildren(...entries.map((entry) => entry.card));
  $('image-empty').hidden = true;
  setStatus('image-status', '');
  updateUi();
  for (const entry of entries) {
    if (current !== token) return;
    try {
      const canvas = await renderPage(doc, entry.index, THUMB_SIZE * (window.devicePixelRatio > 1 ? 1.5 : 1));
      if (current !== token) return;
      canvas.setAttribute('aria-hidden', 'true');
      entry.thumb.replaceChildren(canvas);
    } catch {
      entry.thumb.querySelector('.loading')?.replaceChildren('미리보기 없음');
    }
  }
}

async function renderAtDpi(index, dpi) {
  const page = await source.doc.getPage(index + 1);
  const base = page.getViewport({ scale: 1 });
  return renderPage(source.doc, index, Math.min(MAX_SIDE, Math.max(base.width, base.height) * dpi / 72));
}

async function exportImages() {
  const entries = source?.entries.filter((entry) => entry.selected) || [];
  if (!entries.length || busy) return;
  busy = true;
  updateUi();
  const dpi = selectedDpi();
  const format = selectedFormat();
  const type = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const digits = String(source.pageCount).length;
  const base = baseName(source.name);
  const fileName = (entry) => base + '-' + String(entry.index + 1).padStart(digits, '0') + '.' + format;
  try {
    const zip = entries.length > 1 ? new (await import(JSZIP_URL)).default() : null;
    let total = 0;
    for (const [i, entry] of entries.entries()) {
      setStatus('image-status', (i + 1) + ' / ' + entries.length + '쪽 변환 중…');
      const canvas = await renderAtDpi(entry.index, dpi);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.92));
      canvas.width = canvas.height = 0;
      if (!blob) throw new Error((entry.index + 1) + '쪽을 이미지로 만들지 못했습니다. 화질을 낮춰 다시 시도해 주세요.');
      total += blob.size;
      if (zip) zip.file(fileName(entry), blob);
      else downloadBlob(blob, fileName(entry));
    }
    if (zip) {
      setStatus('image-status', 'ZIP 파일을 만드는 중…');
      const blob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(blob, base + '_이미지.zip');
      total = blob.size;
    }
    setStatus('image-status', entries.length + '쪽을 ' + format.toUpperCase() + '로 저장했습니다. (' + formatSize(total) + ')');
  } catch (error) {
    setStatus('image-status', error.message || '이미지로 저장하지 못했습니다.');
  } finally {
    busy = false;
    updateUi();
  }
}

function applyRange() {
  if (!source) return;
  const range = parseRange($('image-range').value, source.pageCount);
  if (!range) { setStatus('image-status', '페이지 번호를 1-3, 5 처럼 입력해 주세요. (1~' + source.pageCount + '쪽)'); return; }
  for (const entry of source.entries) entry.selected = range.has(entry.index);
  setStatus('image-status', range.size + '쪽을 선택했습니다.');
  updateUi();
}
function selectAll(value) {
  for (const entry of source?.entries || []) entry.selected = value;
  updateUi();
}

setupDropZone($('image-upload'), $('image-file'), openFile);
$('image-range-apply').addEventListener('click', applyRange);
$('image-range').addEventListener('keydown', (event) => { if (event.key === 'Enter') applyRange(); });
$('image-select-all').addEventListener('click', () => selectAll(true));
$('image-select-none').addEventListener('click', () => selectAll(false));
$('image-download').addEventListener('click', exportImages);
updateUi();
