const PDFJS_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs';
const PDFJS_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
export const A4 = [595.28, 841.89];
export const MM_TO_PT = 72 / 25.4;

export const $ = (id) => document.getElementById(id);
export const setStatus = (id, message) => { $(id).textContent = message; };
let nextIdValue = 1;
export const nextId = () => String(nextIdValue++);

export function pdfLib() {
  if (!window.PDFLib) throw new Error('PDF 기능을 불러오지 못했습니다. 인터넷 연결을 확인한 뒤 새로고침해 주세요.');
  return window.PDFLib;
}
let pdfjsPromise = null;
export function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import(PDFJS_URL).then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      return pdfjs;
    }).catch((error) => {
      pdfjsPromise = null;
      throw error;
    });
  }
  return pdfjsPromise;
}
// pdf.js는 넘겨받은 버퍼를 워커로 옮겨 버리므로 복사본을 준다.
export async function openPdfjsDocument(bytes) {
  const pdfjs = await loadPdfjs();
  return pdfjs.getDocument({ data: new Uint8Array(bytes).slice() }).promise;
}
// 긴 쪽이 maxSide 픽셀이 되도록 페이지를 그린다. 페이지의 /Rotate는 반영된다.
export async function renderPage(doc, index, maxSide) {
  const page = await doc.getPage(index + 1);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: maxSide / Math.max(base.width, base.height) });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(viewport.width));
  canvas.height = Math.max(1, Math.round(viewport.height));
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  page.cleanup();
  return canvas;
}

export const isPdf = (file) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
export const isImage = (file) => file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(file.name);
export const baseName = (name) => name.replace(/\.[^.]+$/, '') || 'document';
export function formatSize(bytes) {
  if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + 'KB';
  return (bytes / 1024 / 1024).toFixed(1) + 'MB';
}

export async function loadPdfDocument(bytes) {
  try {
    return await pdfLib().PDFDocument.load(bytes);
  } catch (error) {
    if (/encrypt/i.test(error.message)) throw new Error('암호(보안)가 설정된 PDF는 편집할 수 없습니다.');
    if (!window.PDFLib) throw error;
    throw new Error('PDF를 열 수 없습니다. 파일이 손상되지 않았는지 확인해 주세요.');
  }
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
export const downloadPdf = (bytes, filename) => downloadBlob(new Blob([bytes], { type: 'application/pdf' }), filename);

export function setupDropZone(zone, input, onFiles) {
  let depth = 0;
  const hasFiles = (event) => Array.from(event.dataTransfer?.types || []).includes('Files');
  const reset = () => { depth = 0; zone.classList.remove('drag-over'); };
  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    const files = Array.from(input.files);
    input.value = '';
    if (files.length) onFiles(files);
  });
  zone.addEventListener('dragenter', (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    depth++;
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragover', (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  });
  zone.addEventListener('dragleave', (event) => {
    if (!hasFiles(event)) return;
    depth = Math.max(0, depth - 1);
    if (!depth) reset();
  });
  zone.addEventListener('drop', (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    reset();
    onFiles(Array.from(event.dataTransfer.files));
  });
  window.addEventListener('blur', reset);
  document.addEventListener('dragend', reset);
}

// "1-3, 5, 8-" 형식을 0부터 세는 페이지 번호 집합으로 바꾼다. 형식이 틀리면 null.
export function parseRange(text, max) {
  const pages = new Set();
  const parts = text.split(/[,\s]+/).filter(Boolean);
  if (!parts.length) return null;
  for (const part of parts) {
    const match = part.match(/^(\d*)\s*[-~]\s*(\d*)$/) || part.match(/^(\d+)$/);
    if (!match) return null;
    const single = match.length === 2;
    const from = single ? Number(match[1]) : (match[1] ? Number(match[1]) : 1);
    const to = single ? from : (match[2] ? Number(match[2]) : max);
    if (from < 1 || to < from || from > max) return null;
    for (let page = from; page <= Math.min(to, max); page++) pages.add(page - 1);
  }
  return pages;
}

export function iconButton(text, label, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'icon-button';
  button.textContent = text;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', onClick);
  return button;
}
