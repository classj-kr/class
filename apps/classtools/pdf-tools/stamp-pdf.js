import {
  MM_TO_PT, $, setStatus, nextId, pdfLib, openPdfjsDocument, renderPage, isPdf, isImage, baseName, formatSize,
  loadPdfDocument, downloadPdf, setupDropZone
} from './common.js?v=20260929-pdf-tools';

// 사무용 도구의 "PDF에 찍기"가 이 키로 도장 PNG(data URL)를 넘긴다. 탭을 닫으면 사라진다.
const HANDOFF_KEY = 'classj:pdf-stamp';
const PAGE_RENDER_SIDE = 1600;
const MAX_STAMP_SIDE = 1200;

let source = null;     // { name, bytes, jsDoc, pageCount, viewports }
let stamp = null;      // { bytes, url, width, height }
let placements = [];   // { id, page, cx, cy } — 도장 중심, PDF 좌표(pt)
let current = 0;
let renderToken = 0;
let busy = false;
const stage = $('pstamp-stage');

const sizeMm = () => Number($('pstamp-size').value);
function stampSizePt() {
  const long = sizeMm() * MM_TO_PT;
  const side = Math.max(stamp.width, stamp.height);
  return [long * stamp.width / side, long * stamp.height / side];
}

/* ---------- 도장 이미지 ---------- */

async function setStampFromBlob(blob, remember) {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, MAX_STAMP_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const png = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!png) throw new Error('도장 이미지를 읽을 수 없습니다.');
  if (stamp) URL.revokeObjectURL(stamp.url);
  stamp = { bytes: await png.arrayBuffer(), url: URL.createObjectURL(png), width: canvas.width, height: canvas.height };
  $('pstamp-image').src = stamp.url;
  $('pstamp-image').hidden = false;
  $('pstamp-image-empty').hidden = true;
  if (remember) {
    try { sessionStorage.setItem(HANDOFF_KEY, canvas.toDataURL('image/png')); } catch { /* 저장 공간이 없어도 이번 화면에서는 쓸 수 있다. */ }
  }
  renderStamps();
}

async function loadHandoffStamp() {
  let dataUrl = null;
  try { dataUrl = sessionStorage.getItem(HANDOFF_KEY); } catch { return; }
  if (!dataUrl) return;
  try {
    await setStampFromBlob(await (await fetch(dataUrl)).blob(), false);
  } catch {
    setStatus('pstamp-status', '넘겨받은 도장을 읽지 못했습니다. 도장 이미지를 다시 선택해 주세요.');
  }
}

$('pstamp-image-upload').addEventListener('click', () => $('pstamp-image-file').click());
$('pstamp-image-file').addEventListener('change', async () => {
  const file = $('pstamp-image-file').files[0];
  $('pstamp-image-file').value = '';
  if (!file) return;
  if (!isImage(file)) { setStatus('pstamp-status', '이미지 파일을 선택해 주세요.'); return; }
  try {
    await setStampFromBlob(file, true);
    setStatus('pstamp-status', source ? '페이지를 눌러 도장을 찍으세요.' : '도장을 준비했습니다. PDF를 선택하세요.');
  } catch (error) {
    setStatus('pstamp-status', error.message || '도장 이미지를 읽을 수 없습니다.');
  }
});
$('pstamp-size').addEventListener('input', () => {
  $('pstamp-size-value').value = sizeMm() + 'mm';
  renderStamps();
});

/* ---------- PDF와 페이지 ---------- */

async function openFile(files) {
  const file = files.find(isPdf);
  if (!file) { setStatus('pstamp-status', 'PDF 파일을 선택해 주세요.'); return; }
  const token = ++renderToken;
  setStatus('pstamp-status', 'PDF를 여는 중…');
  let bytes, jsDoc, pageCount;
  try {
    bytes = await file.arrayBuffer();
    // 저장할 때 pdf-lib이 쓰므로, 열 수 있는지 먼저 확인한다.
    pageCount = (await loadPdfDocument(bytes)).getPageCount();
  } catch (error) {
    if (token === renderToken) setStatus('pstamp-status', error.message);
    return;
  }
  try {
    jsDoc = await openPdfjsDocument(bytes);
  } catch {
    if (token === renderToken) setStatus('pstamp-status', '페이지를 표시하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 선택해 주세요.');
    return;
  }
  if (token !== renderToken) { jsDoc.destroy(); return; }
  source?.jsDoc.destroy();
  source = { name: file.name, bytes, jsDoc, pageCount, viewports: [] };
  placements = [];
  current = 0;
  $('pstamp-title').textContent = file.name;
  $('pstamp-empty').hidden = true;
  stage.hidden = false;
  setStatus('pstamp-status', stamp ? '페이지를 눌러 도장을 찍으세요.' : '먼저 도장 이미지를 선택하거나 도장을 만들어 주세요.');
  await showPage(0);
}

async function viewportOf(index) {
  if (!source.viewports[index]) {
    const page = await source.jsDoc.getPage(index + 1);
    source.viewports[index] = page.getViewport({ scale: 1 });
  }
  return source.viewports[index];
}

async function showPage(index) {
  const token = ++renderToken;
  current = index;
  updateUi();
  const viewport = await viewportOf(index);
  const canvas = await renderPage(source.jsDoc, index, PAGE_RENDER_SIDE);
  if (token !== renderToken) return;
  canvas.id = 'pstamp-page-canvas';
  canvas.setAttribute('aria-label', (index + 1) + '쪽. 누르면 그 자리에 도장이 찍힙니다.');
  const ratio = viewport.width / viewport.height;
  stage.style.aspectRatio = viewport.width + ' / ' + viewport.height;
  stage.style.width = 'min(100%, calc(70vh * ' + ratio.toFixed(4) + '))';
  stage.replaceChildren(canvas);
  renderStamps();
}

function updateUi() {
  const loaded = Boolean(source);
  const onPage = placements.some((p) => p.page === current);
  $('pstamp-page-label').textContent = loaded ? (current + 1) + ' / ' + source.pageCount : '0 / 0';
  $('pstamp-prev').disabled = !loaded || current === 0;
  $('pstamp-next').disabled = !loaded || current >= source.pageCount - 1;
  $('pstamp-copy-all').disabled = busy || !loaded || !onPage || source.pageCount < 2;
  $('pstamp-clear-page').disabled = busy || !loaded || !onPage;
  $('pstamp-download').disabled = busy || !loaded || !stamp || !placements.length;
}

/* ---------- 찍은 도장 ---------- */

function renderStamps() {
  for (const el of stage.querySelectorAll('.placed-stamp')) el.remove();
  const viewport = source?.viewports[current];
  if (viewport && stamp) {
    const [width, height] = stampSizePt();
    for (const placement of placements.filter((p) => p.page === current)) {
      const el = document.createElement('div');
      el.className = 'placed-stamp';
      el.dataset.id = placement.id;
      el.tabIndex = 0;
      el.setAttribute('role', 'group');
      el.setAttribute('aria-label', '찍은 도장. 화살표로 옮기고 Delete로 지웁니다.');
      el.style.width = (width / viewport.width * 100) + '%';
      el.style.height = (height / viewport.height * 100) + '%';
      const img = document.createElement('img');
      img.src = stamp.url;
      img.alt = '';
      img.draggable = false;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'stamp-remove';
      remove.textContent = '✕';
      remove.setAttribute('aria-label', '이 도장 지우기');
      remove.addEventListener('click', () => removePlacement(placement.id));
      el.append(img, remove);
      positionStamp(el, placement, viewport);
      stage.append(el);
    }
  }
  updateUi();
}

function positionStamp(el, placement, viewport) {
  const [x, y] = viewport.convertToViewportPoint(placement.cx, placement.cy);
  el.style.left = (x / viewport.width * 100) + '%';
  el.style.top = (y / viewport.height * 100) + '%';
}

// 화면상의 위치(0~1 비율)를 PDF 좌표로 바꾼다.
function toPdfPoint(viewport, fx, fy) {
  const [cx, cy] = viewport.convertToPdfPoint(Math.min(1, Math.max(0, fx)) * viewport.width, Math.min(1, Math.max(0, fy)) * viewport.height);
  return { cx, cy };
}

function removePlacement(id) {
  placements = placements.filter((p) => p.id !== id);
  renderStamps();
}

stage.addEventListener('click', (event) => {
  if (event.target.tagName !== 'CANVAS' || !source) return;
  if (!stamp) { setStatus('pstamp-status', '먼저 도장 이미지를 선택하거나 도장을 만들어 주세요.'); return; }
  const viewport = source.viewports[current];
  if (!viewport) return;
  const rect = event.target.getBoundingClientRect();
  placements.push({ id: nextId(), page: current, ...toPdfPoint(viewport, (event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height) });
  renderStamps();
  setStatus('pstamp-status', '도장을 찍었습니다. 끌어서 위치를 맞추세요.');
});

let drag = null;
stage.addEventListener('pointerdown', (event) => {
  const el = event.target.closest('.placed-stamp');
  if (!el || event.target.closest('.stamp-remove') || event.button !== 0) return;
  const rect = el.getBoundingClientRect();
  drag = { el, pointerId: event.pointerId, dx: event.clientX - (rect.left + rect.width / 2), dy: event.clientY - (rect.top + rect.height / 2) };
  el.setPointerCapture(event.pointerId);
  el.classList.add('dragging');
  event.preventDefault();
});
stage.addEventListener('pointermove', (event) => {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const placement = placements.find((p) => p.id === drag.el.dataset.id);
  const viewport = source.viewports[current];
  const rect = stage.getBoundingClientRect();
  Object.assign(placement, toPdfPoint(viewport, (event.clientX - drag.dx - rect.left) / rect.width, (event.clientY - drag.dy - rect.top) / rect.height));
  positionStamp(drag.el, placement, viewport);
});
const endDrag = (event) => {
  if (!drag || event.pointerId !== drag.pointerId) return;
  drag.el.classList.remove('dragging');
  drag = null;
};
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);
stage.addEventListener('keydown', (event) => {
  const el = event.target.closest?.('.placed-stamp');
  if (!el || event.target !== el) return;
  const placement = placements.find((p) => p.id === el.dataset.id);
  if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); removePlacement(placement.id); return; }
  const step = event.shiftKey ? 0.05 : 0.01;
  const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
  if (!move) return;
  event.preventDefault();
  const viewport = source.viewports[current];
  const [x, y] = viewport.convertToViewportPoint(placement.cx, placement.cy);
  Object.assign(placement, toPdfPoint(viewport, x / viewport.width + move[0], y / viewport.height + move[1]));
  positionStamp(el, placement, viewport);
});

$('pstamp-prev').addEventListener('click', () => { if (source && current > 0) showPage(current - 1); });
$('pstamp-next').addEventListener('click', () => { if (source && current < source.pageCount - 1) showPage(current + 1); });
$('pstamp-clear-page').addEventListener('click', () => {
  placements = placements.filter((p) => p.page !== current);
  renderStamps();
});
$('pstamp-copy-all').addEventListener('click', async () => {
  const from = source.viewports[current];
  // 페이지 크기가 달라도 같은 비율 위치에 찍는다.
  const relative = placements.filter((p) => p.page === current).map((p) => {
    const [x, y] = from.convertToViewportPoint(p.cx, p.cy);
    return [x / from.width, y / from.height];
  });
  const copies = [];
  for (let page = 0; page < source.pageCount; page++) {
    if (page === current) continue;
    const viewport = await viewportOf(page);
    for (const [fx, fy] of relative) copies.push({ id: nextId(), page, ...toPdfPoint(viewport, fx, fy) });
  }
  placements = placements.filter((p) => p.page === current).concat(copies);
  renderStamps();
  setStatus('pstamp-status', '모든 페이지(' + source.pageCount + '쪽)에 같은 위치로 도장을 넣었습니다.');
});

$('pstamp-download').addEventListener('click', async () => {
  if (!source || !stamp || !placements.length || busy) return;
  busy = true;
  updateUi();
  setStatus('pstamp-status', '저장하는 중…');
  try {
    const { degrees } = pdfLib();
    // 저장할 때마다 원본에서 다시 열어야 도장이 겹겹이 쌓이지 않는다.
    const doc = await loadPdfDocument(source.bytes);
    const image = await doc.embedPng(stamp.bytes);
    const [width, height] = stampSizePt();
    for (const placement of placements) {
      const page = doc.getPage(placement.page);
      // 회전된 페이지는 도장도 같이 돌려야 화면에서 똑바로 보인다.
      const rotation = ((page.getRotation().angle % 360) + 360) % 360;
      const angle = rotation * Math.PI / 180;
      const dx = width / 2 * Math.cos(angle) - height / 2 * Math.sin(angle);
      const dy = width / 2 * Math.sin(angle) + height / 2 * Math.cos(angle);
      page.drawImage(image, { x: placement.cx - dx, y: placement.cy - dy, width, height, rotate: degrees(rotation) });
    }
    const bytes = await doc.save();
    downloadPdf(bytes, baseName(source.name) + '_도장.pdf');
    setStatus('pstamp-status', '도장 ' + placements.length + '개를 찍어 저장했습니다. (' + formatSize(bytes.length) + ')');
  } catch (error) {
    setStatus('pstamp-status', error.message || 'PDF를 저장하지 못했습니다.');
  } finally {
    busy = false;
    updateUi();
  }
});

setupDropZone($('pstamp-pdf-upload'), $('pstamp-pdf-file'), openFile);
updateUi();
loadHandoffStamp();
