import {
  A4, $, setStatus, nextId, pdfLib, openPdfjsDocument, renderPage, isPdf, isImage, baseName, formatSize,
  loadPdfDocument, downloadPdf, setupDropZone, parseRange
} from './common.js?v=20260929-pdf-tools';
import './stamp-pdf.js?v=20260929-pdf-tools';
import './to-image.js?v=20260929-pdf-tools';

const THUMB_SIZE = 240;
const MAX_IMAGE_SIDE = 3000;

/* ---------- 탭 ---------- */

const toolTabs = Array.from(document.querySelectorAll('[data-tool]'));
function selectTool(tool, updateUrl = false) {
  const selected = toolTabs.some((tab) => tab.dataset.tool === tool) ? tool : 'merge';
  for (const tab of toolTabs) {
    const active = tab.dataset.tool === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    $(tab.getAttribute('aria-controls')).hidden = !active;
  }
  if (updateUrl) window.history.replaceState(null, '', '#' + selected);
}
for (const tab of toolTabs) tab.addEventListener('click', () => selectTool(tab.dataset.tool, true));
window.addEventListener('hashchange', () => selectTool(window.location.hash.slice(1)));
document.querySelector('.tool-tabs').addEventListener('keydown', (event) => {
  const index = toolTabs.indexOf(document.activeElement);
  if (index < 0) return;
  let next;
  if (event.key === 'ArrowRight') next = (index + 1) % toolTabs.length;
  else if (event.key === 'ArrowLeft') next = (index + toolTabs.length - 1) % toolTabs.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = toolTabs.length - 1;
  else return;
  event.preventDefault();
  toolTabs[next].focus();
  toolTabs[next].click();
});
selectTool(window.location.hash.slice(1));

document.addEventListener('dragover', (event) => {
  if (event.defaultPrevented) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'none';
});
document.addEventListener('drop', (event) => event.preventDefault());

// 마우스와 터치 모두에서 쓰는 끌어서 순서 바꾸기. 움직이지 않고 떼면 onTap을 부른다.
// touchDelay를 주면 터치는 길게 눌러야 끌기가 시작되고, 그냥 밀면 화면이 스크롤된다.
function makeSortable(container, { item, handle, axis, touchDelay = 0, onReorder, onTap }) {
  let drag = null;
  const clearMarks = () => {
    for (const el of container.querySelectorAll('.drop-before, .drop-after')) el.classList.remove('drop-before', 'drop-after');
  };
  container.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || !event.target.closest(handle)) return;
    const el = event.target.closest(item);
    if (!el || !container.contains(el)) return;
    const delayed = touchDelay && event.pointerType === 'touch';
    drag = { el, pointerId: event.pointerId, x: event.clientX, y: event.clientY, armed: !delayed, moved: false, target: null, after: false, timer: 0 };
    if (delayed) {
      const current = drag;
      current.timer = window.setTimeout(() => {
        current.armed = true;
        current.el.classList.add('dragging');
      }, touchDelay);
    }
    event.target.closest(handle).setPointerCapture(event.pointerId);
  });
  container.addEventListener('touchmove', (event) => { if (drag?.armed) event.preventDefault(); }, { passive: false });
  container.addEventListener('contextmenu', (event) => { if (drag && event.target.closest(handle)) event.preventDefault(); });
  container.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (!drag.moved) {
      if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 6) return;
      if (!drag.armed) {
        // 길게 누르기 전에 움직였으면 스크롤로 본다.
        window.clearTimeout(drag.timer);
        drag = null;
        return;
      }
      drag.moved = true;
      drag.el.classList.add('dragging');
    }
    event.preventDefault();
    if (event.clientY < 60) window.scrollBy(0, -12);
    else if (event.clientY > window.innerHeight - 60) window.scrollBy(0, 12);
    clearMarks();
    const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest(item);
    if (!hit || hit === drag.el || !container.contains(hit)) { drag.target = null; return; }
    const rect = hit.getBoundingClientRect();
    drag.target = hit;
    drag.after = axis === 'x' ? event.clientX > rect.left + rect.width / 2 : event.clientY > rect.top + rect.height / 2;
    hit.classList.add(drag.after ? 'drop-after' : 'drop-before');
  });
  const finish = (event, cancelled) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const { el, moved, target, after, timer } = drag;
    window.clearTimeout(timer);
    drag = null;
    el.classList.remove('dragging');
    clearMarks();
    if (cancelled) return;
    if (!moved) { onTap?.(el); return; }
    if (!target) return;
    container.insertBefore(el, after ? target.nextSibling : target);
    onReorder(Array.from(container.querySelectorAll(item)).map((node) => node.dataset.id));
  };
  container.addEventListener('pointerup', (event) => finish(event, false));
  container.addEventListener('pointercancel', (event) => finish(event, true));
}

/* ---------- PDF 합치기 ---------- */

let mergeItems = [];
let mergeBusy = false;

async function readImage(file) {
  let source;
  try {
    source = await createImageBitmap(file);
  } catch {
    source = await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('이미지를 열 수 없습니다.')); };
      image.src = url;
    });
  }
  const width = source.naturalWidth || source.width;
  const height = source.naturalHeight || source.height;
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext('2d');
  // PNG는 투명도를 살리고, 나머지는 흰 바탕 JPEG로 담아 용량을 줄인다.
  const png = file.type === 'image/png' || /\.png$/i.test(file.name);
  if (!png) { context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); }
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close?.();
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, png ? 'image/png' : 'image/jpeg', 0.92));
  if (!blob) throw new Error('이미지를 변환할 수 없습니다.');
  return { bytes: await blob.arrayBuffer(), png, width: canvas.width, height: canvas.height };
}

async function addMergeFiles(files) {
  const accepted = files.filter((file) => isPdf(file) || isImage(file));
  if (!accepted.length) { setStatus('merge-status', 'PDF나 이미지 파일을 선택해 주세요.'); return; }
  const failed = [];
  setStatus('merge-status', '파일을 읽는 중…');
  for (const file of accepted) {
    try {
      if (isPdf(file)) {
        const doc = await loadPdfDocument(await file.arrayBuffer());
        mergeItems.push({ id: nextId(), file, kind: 'pdf', doc, pages: doc.getPageCount() });
      } else {
        mergeItems.push({ id: nextId(), file, kind: 'image', image: await readImage(file), pages: 1 });
      }
    } catch (error) {
      failed.push(file.name + ': ' + error.message);
    }
    renderMergeList();
  }
  const skipped = files.length - accepted.length;
  const messages = [];
  if (failed.length) messages.push(failed.join(' / '));
  if (skipped) messages.push('PDF·이미지가 아닌 파일 ' + skipped + '개는 건너뛰었습니다.');
  setStatus('merge-status', messages.join(' ') || (mergeItems.length < 2 ? '파일을 하나 더 추가하면 합칠 수 있습니다.' : '순서를 확인한 뒤 PDF 합치기를 누르세요.'));
}

function renderMergeList() {
  const list = $('merge-list');
  list.replaceChildren(...mergeItems.map((entry, index) => {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.dataset.id = entry.id;
    const handle = document.createElement('span');
    handle.className = 'drag-handle';
    handle.textContent = '⠿';
    handle.setAttribute('aria-hidden', 'true');
    const badge = document.createElement('span');
    badge.className = 'file-badge' + (entry.kind === 'image' ? ' image' : '');
    badge.textContent = entry.kind === 'image' ? 'IMG' : 'PDF';
    badge.setAttribute('aria-hidden', 'true');
    const name = document.createElement('div');
    name.className = 'file-name';
    const title = document.createElement('strong');
    title.textContent = entry.file.name;
    title.title = entry.file.name;
    const meta = document.createElement('small');
    meta.textContent = entry.pages + '쪽 · ' + formatSize(entry.file.size);
    name.append(title, meta);
    const actions = document.createElement('div');
    actions.className = 'file-actions';
    const button = (label, text, disabled, onClick) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'icon-button';
      el.textContent = text;
      el.setAttribute('aria-label', entry.file.name + ' ' + label);
      el.disabled = disabled || mergeBusy;
      el.addEventListener('click', onClick);
      return el;
    };
    actions.append(
      button('위로', '↑', index === 0, () => moveMergeItem(index, -1)),
      button('아래로', '↓', index === mergeItems.length - 1, () => moveMergeItem(index, 1)),
      button('빼기', '✕', false, () => { mergeItems.splice(index, 1); renderMergeList(); })
    );
    li.append(handle, badge, name, actions);
    return li;
  }));
  const pages = mergeItems.reduce((sum, entry) => sum + entry.pages, 0);
  $('merge-summary').textContent = mergeItems.length + '개 · 총 ' + pages + '쪽';
  $('merge-empty').hidden = mergeItems.length > 0;
  $('merge-download').disabled = mergeBusy || mergeItems.length < 2;
  $('merge-clear').disabled = mergeBusy || !mergeItems.length;
}

function moveMergeItem(index, delta) {
  const [entry] = mergeItems.splice(index, 1);
  mergeItems.splice(index + delta, 0, entry);
  renderMergeList();
  $('merge-list').children[index + delta]?.querySelectorAll('.icon-button')[delta < 0 ? 0 : 1]?.focus();
}

async function mergeFiles() {
  if (mergeItems.length < 2 || mergeBusy) return;
  mergeBusy = true;
  renderMergeList();
  setStatus('merge-status', '합치는 중…');
  try {
    const { PDFDocument } = pdfLib();
    const output = await PDFDocument.create();
    for (const entry of mergeItems) {
      if (entry.kind === 'pdf') {
        const pages = await output.copyPages(entry.doc, entry.doc.getPageIndices());
        pages.forEach((page) => output.addPage(page));
      } else {
        const { bytes, png, width, height } = entry.image;
        const embedded = png ? await output.embedPng(bytes) : await output.embedJpg(bytes);
        const [pageWidth, pageHeight] = width > height ? [A4[1], A4[0]] : A4;
        const scale = Math.min(pageWidth / width, pageHeight / height);
        const page = output.addPage([pageWidth, pageHeight]);
        page.drawImage(embedded, {
          x: (pageWidth - width * scale) / 2,
          y: (pageHeight - height * scale) / 2,
          width: width * scale,
          height: height * scale
        });
      }
    }
    const bytes = await output.save();
    downloadPdf(bytes, baseName(mergeItems[0].file.name) + '_합침.pdf');
    setStatus('merge-status', '총 ' + output.getPageCount() + '쪽 PDF를 저장했습니다. (' + formatSize(bytes.length) + ')');
  } catch (error) {
    setStatus('merge-status', error.message || 'PDF를 합치지 못했습니다.');
  } finally {
    mergeBusy = false;
    renderMergeList();
  }
}

setupDropZone($('merge-upload'), $('merge-file'), addMergeFiles);
$('merge-download').addEventListener('click', mergeFiles);
$('merge-clear').addEventListener('click', () => {
  mergeItems = [];
  renderMergeList();
  setStatus('merge-status', '');
});
makeSortable($('merge-list'), {
  item: '.file-item',
  handle: '.drag-handle',
  axis: 'y',
  onReorder(ids) {
    mergeItems = ids.map((id) => mergeItems.find((entry) => entry.id === id));
    renderMergeList();
  }
});

/* ---------- 페이지 정리 ---------- */

let organizeSource = null; // { name, doc, pageCount, entries }
let organizePages = [];    // { id, index, rotation, selected, card }
let organizeToken = 0;
let organizeBusy = false;

function createPageCard(entry) {
  const card = document.createElement('div');
  card.className = 'page-card';
  card.dataset.id = entry.id;
  const thumb = document.createElement('div');
  thumb.className = 'page-thumb';
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.textContent = '불러오는 중';
  thumb.append(loading);
  const meta = document.createElement('div');
  meta.className = 'page-meta';
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', () => { entry.selected = checkbox.checked; updateOrganizeUi(); });
  label.append(checkbox, document.createTextNode((entry.index + 1) + '쪽'));
  const rotate = document.createElement('button');
  rotate.type = 'button';
  rotate.className = 'icon-button';
  rotate.textContent = '↷';
  rotate.setAttribute('aria-label', (entry.index + 1) + '쪽 시계 방향으로 90도 회전');
  rotate.addEventListener('click', () => { entry.rotation = (entry.rotation + 90) % 360; updateOrganizeUi(); });
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'icon-button';
  remove.textContent = '✕';
  remove.setAttribute('aria-label', (entry.index + 1) + '쪽 삭제');
  remove.addEventListener('click', () => {
    organizePages = organizePages.filter((page) => page !== entry);
    renderOrganizeGrid();
  });
  const buttons = document.createElement('div');
  buttons.className = 'file-actions';
  buttons.append(rotate, remove);
  meta.append(label, buttons);
  card.append(thumb, meta);
  entry.card = card;
  entry.thumb = thumb;
  entry.checkbox = checkbox;
  return card;
}

function renderOrganizeGrid() {
  $('organize-grid').replaceChildren(...organizePages.map((entry) => entry.card));
  updateOrganizeUi();
}

function updateOrganizeUi() {
  const loaded = Boolean(organizeSource);
  const selected = organizePages.filter((entry) => entry.selected);
  for (const entry of organizePages) {
    entry.card.classList.toggle('selected', entry.selected);
    entry.checkbox.checked = entry.selected;
    const canvas = entry.thumb.querySelector('canvas');
    if (canvas) canvas.style.transform = entry.rotation ? 'rotate(' + entry.rotation + 'deg)' : '';
  }
  $('organize-empty').hidden = loaded;
  $('organize-empty').textContent = 'PDF를 선택하면 페이지가 여기에 표시됩니다.';
  if (loaded && !organizePages.length) {
    $('organize-empty').hidden = false;
    $('organize-empty').textContent = '남은 페이지가 없습니다. 처음 상태로 되돌리거나 다른 PDF를 선택하세요.';
  }
  $('organize-selected-count').textContent = selected.length + '쪽';
  $('organize-summary').textContent = loaded ? organizePages.length + '쪽 · 눌러서 선택 · 끌어서 순서 변경' : '페이지를 눌러 선택 · 끌어서 순서 변경';
  const idle = loaded && !organizeBusy;
  for (const id of ['organize-range', 'organize-range-apply', 'organize-select-all', 'organize-select-none', 'organize-reset']) $(id).disabled = !idle;
  for (const id of ['organize-rotate-left', 'organize-rotate-right', 'organize-delete', 'organize-extract']) $(id).disabled = !idle || !selected.length;
  $('organize-download').disabled = !idle || !organizePages.length;
}

async function renderThumbnails(file, token) {
  let doc;
  try {
    doc = await openPdfjsDocument(await file.arrayBuffer());
  } catch {
    if (token === organizeToken) setStatus('organize-status', '미리보기를 만들지 못했습니다. 편집과 저장은 그대로 할 수 있습니다.');
    return;
  }
  for (const entry of organizeSource.entries) {
    if (token !== organizeToken) break;
    try {
      const canvas = await renderPage(doc, entry.index, THUMB_SIZE * (window.devicePixelRatio > 1 ? 1.5 : 1));
      if (token !== organizeToken) break;
      canvas.setAttribute('aria-hidden', 'true');
      entry.thumb.replaceChildren(canvas);
      if (entry.rotation) canvas.style.transform = 'rotate(' + entry.rotation + 'deg)';
    } catch {
      entry.thumb.querySelector('.loading')?.replaceChildren('미리보기 없음');
    }
  }
  doc.destroy();
}

async function openOrganizeFile(files) {
  const file = files.find(isPdf);
  if (!file) { setStatus('organize-status', 'PDF 파일을 선택해 주세요.'); return; }
  const token = ++organizeToken;
  setStatus('organize-status', 'PDF를 여는 중…');
  try {
    const doc = await loadPdfDocument(await file.arrayBuffer());
    if (token !== organizeToken) return;
    const entries = doc.getPageIndices().map((index) => {
      const entry = { id: nextId(), index, rotation: 0, selected: false };
      createPageCard(entry);
      return entry;
    });
    organizeSource = { name: file.name, doc, pageCount: entries.length, entries };
  } catch (error) {
    if (token === organizeToken) setStatus('organize-status', error.message);
    return;
  }
  $('organize-title').textContent = file.name;
  $('organize-range').value = '';
  resetOrganizePages();
  setStatus('organize-status', '');
  renderThumbnails(file, token);
}

// 원본의 모든 페이지 카드는 organizeSource.entries에 남겨 두고, 처음 상태로 되돌릴 때 다시 쓴다.
function resetOrganizePages() {
  for (const entry of organizeSource.entries) Object.assign(entry, { rotation: 0, selected: false });
  organizePages = organizeSource.entries.slice();
  renderOrganizeGrid();
}

async function saveOrganized(onlySelected) {
  const entries = onlySelected ? organizePages.filter((entry) => entry.selected) : organizePages;
  if (!organizeSource || !entries.length || organizeBusy) return;
  organizeBusy = true;
  updateOrganizeUi();
  setStatus('organize-status', '저장하는 중…');
  try {
    const { PDFDocument, degrees } = pdfLib();
    const output = await PDFDocument.create();
    const pages = await output.copyPages(organizeSource.doc, entries.map((entry) => entry.index));
    pages.forEach((page, i) => {
      if (entries[i].rotation) page.setRotation(degrees((page.getRotation().angle + entries[i].rotation) % 360));
      output.addPage(page);
    });
    const bytes = await output.save();
    downloadPdf(bytes, baseName(organizeSource.name) + (onlySelected ? '_추출.pdf' : '_정리.pdf'));
    setStatus('organize-status', entries.length + '쪽 PDF를 저장했습니다. (' + formatSize(bytes.length) + ')');
  } catch (error) {
    setStatus('organize-status', error.message || 'PDF를 저장하지 못했습니다.');
  } finally {
    organizeBusy = false;
    updateOrganizeUi();
  }
}

function rotateSelected(delta) {
  for (const entry of organizePages) if (entry.selected) entry.rotation = (entry.rotation + delta + 360) % 360;
  updateOrganizeUi();
}
function selectAll(value) {
  for (const entry of organizePages) entry.selected = value;
  updateOrganizeUi();
}
function applyRange() {
  if (!organizeSource) return;
  const range = parseRange($('organize-range').value, organizeSource.pageCount);
  if (!range) { setStatus('organize-status', '페이지 번호를 1-3, 5 처럼 입력해 주세요. (1~' + organizeSource.pageCount + '쪽)'); return; }
  for (const entry of organizePages) entry.selected = range.has(entry.index);
  const found = organizePages.filter((entry) => entry.selected).length;
  setStatus('organize-status', found + '쪽을 선택했습니다.' + (found < range.size ? ' 삭제한 페이지는 제외했습니다.' : ''));
  updateOrganizeUi();
}

setupDropZone($('organize-upload'), $('organize-file'), openOrganizeFile);
$('organize-range-apply').addEventListener('click', applyRange);
$('organize-range').addEventListener('keydown', (event) => { if (event.key === 'Enter') applyRange(); });
$('organize-select-all').addEventListener('click', () => selectAll(true));
$('organize-select-none').addEventListener('click', () => selectAll(false));
$('organize-rotate-left').addEventListener('click', () => rotateSelected(-90));
$('organize-rotate-right').addEventListener('click', () => rotateSelected(90));
$('organize-delete').addEventListener('click', () => {
  const count = organizePages.filter((entry) => entry.selected).length;
  organizePages = organizePages.filter((entry) => !entry.selected);
  renderOrganizeGrid();
  setStatus('organize-status', count + '쪽을 삭제했습니다. 저장해야 파일에 반영됩니다.');
});
$('organize-download').addEventListener('click', () => saveOrganized(false));
$('organize-extract').addEventListener('click', () => saveOrganized(true));
$('organize-reset').addEventListener('click', () => {
  if (!organizeSource) return;
  resetOrganizePages();
  setStatus('organize-status', '처음 상태로 되돌렸습니다.');
});
makeSortable($('organize-grid'), {
  item: '.page-card',
  handle: '.page-thumb',
  axis: 'x',
  touchDelay: 300,
  onReorder(ids) {
    organizePages = ids.map((id) => organizePages.find((entry) => entry.id === id));
    updateOrganizeUi();
  },
  onTap(card) {
    const entry = organizePages.find((page) => page.id === card.dataset.id);
    if (!entry) return;
    entry.selected = !entry.selected;
    updateOrganizeUi();
  }
});
