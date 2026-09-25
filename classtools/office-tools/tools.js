(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const scanSource = $('scan-source-canvas');
  const scanResult = $('scan-result-canvas');
  let scanImage = null;
  let scanCorners = null;
  let dragCorner = -1;
  let cameraStream = null;
  let cameraRequestId = 0;
  let scanTimer = null;

  const toolTabs = Array.from(document.querySelectorAll('[data-tool]'));
  function selectTool(tool, updateUrl = false) {
    const selected = tool === 'scan' ? 'scan' : 'stamp';
    for (const tab of toolTabs) {
      const active = tab.dataset.tool === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      $(tab.dataset.tool).hidden = !active;
    }
    if (selected !== 'scan') stopCamera();
    if (updateUrl) window.history.replaceState(null, '', '#' + selected);
  }
  for (const tab of toolTabs) tab.addEventListener('click', () => selectTool(tab.dataset.tool, true));
  window.addEventListener('hashchange', () => selectTool(window.location.hash.slice(1)));
  for (const tablist of document.querySelectorAll('[role="tablist"]')) {
    tablist.addEventListener('keydown', (event) => {
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
      const index = tabs.indexOf(document.activeElement);
      if (index < 0) return;
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    });
  }
  function selectButton(selector, activeButton) {
    for (const button of document.querySelectorAll(selector + ' button')) {
      const active = button === activeButton;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
  }
  $('scan-upload').addEventListener('click', () => $('scan-file').click());
  const fileDropZones = [
    { zone: $('stamp-upload'), input: $('stamp-file'), status: 'stamp-status' },
    { zone: $('scan-upload'), input: $('scan-file'), status: 'scan-status' }
  ];
  const isFileDrag = event => Array.from(event.dataTransfer?.types || []).includes('Files');
  const fallbackImageTypes = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', bmp: 'image/bmp', avif: 'image/avif', svg: 'image/svg+xml' };
  const droppedImageType = file => file.type || fallbackImageTypes[file.name.split('.').pop().toLowerCase()] || '';
  const resetFileDrags = [];
  for (const { zone, input, status } of fileDropZones) {
    let depth = 0;
    const reset = () => { depth = 0; zone.classList.remove('drag-over'); };
    resetFileDrags.push(reset);
    zone.addEventListener('dragenter', event => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      depth++;
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragover', event => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', event => {
      if (!isFileDrag(event)) return;
      depth = Math.max(0, depth - 1);
      if (!depth) reset();
    });
    zone.addEventListener('drop', event => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      reset();
      const file = Array.from(event.dataTransfer.files).find(file => droppedImageType(file).startsWith('image/'));
      if (!file) { setStatus(status, '이미지 파일을 놓아 주세요.'); return; }
      // Feed dropped files through the same change handler used by the file picker.
      const transfer = new DataTransfer();
      transfer.items.add(file.type ? file : new File([file], file.name, { type: droppedImageType(file), lastModified: file.lastModified }));
      input.files = transfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
  document.addEventListener('dragover', event => {
    if (!isFileDrag(event) || event.defaultPrevented) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'none';
  });
  document.addEventListener('drop', event => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    resetFileDrags.forEach(reset => reset());
  });
  document.addEventListener('dragend', () => resetFileDrags.forEach(reset => reset()));
  window.addEventListener('blur', () => resetFileDrags.forEach(reset => reset()));

  selectTool(window.location.hash.slice(1));

  function setStatus(id, message) { $(id).textContent = message; }
  function downloadCanvas(canvas, filename) {
    canvas.toBlob((blob) => {
      if (!blob) { window.alert('이미지를 저장할 수 없습니다.'); return; }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    }, 'image/png');
  }
  function loadImage(file, callback, statusId) {
    if (!file || !file.type.startsWith('image/')) { setStatus(statusId, '이미지 파일을 선택해 주세요.'); return; }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); callback(image); };
    image.onerror = () => { URL.revokeObjectURL(url); setStatus(statusId, '이미지를 열 수 없습니다. 다른 사진을 선택해 주세요.'); };
    image.src = url;
  }
  function scaledCanvas(image, maxSide) {
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
    canvas.height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
    canvas.getContext('2d', { willReadFrequently: true }).drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  }
  function resetCorners() {
    const w = scanImage.width, h = scanImage.height;
    scanCorners = [[w * .06, h * .06], [w * .94, h * .06], [w * .94, h * .94], [w * .06, h * .94]];
  }
  function detectDocumentCorners() {
    if (!scanImage) return false;
    const w = scanImage.width, h = scanImage.height;
    const pixels = scanImage.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    const sample = (x, y) => {
      const i = (Math.round(y) * w + Math.round(x)) * 4;
      return [pixels[i], pixels[i + 1], pixels[i + 2]];
    };
    const insetX = Math.max(2, Math.round(w * .015));
    const insetY = Math.max(2, Math.round(h * .015));
    const corners = [sample(insetX, insetY), sample(w - insetX - 1, insetY),
                     sample(w - insetX - 1, h - insetY - 1), sample(insetX, h - insetY - 1)];
    const background = [0, 1, 2].map((channel) => corners.reduce((sum, color) => sum + color[channel], 0) / 4);
    const backgroundLight = .299 * background[0] + .587 * background[1] + .114 * background[2];
    const stepX = Math.max(2, Math.floor(w / 150));
    const stepY = Math.max(2, Math.floor(h / 150));
    const cols = Math.ceil(w / stepX), rows = Math.ceil(h / stepY);
    const rowCounts = new Array(rows).fill(0), colCounts = new Array(cols).fill(0);
    for (let row = 0; row < rows; row++) {
      const y = Math.min(h - 1, row * stepY);
      for (let col = 0; col < cols; col++) {
        const x = Math.min(w - 1, col * stepX);
        const rgb = sample(x, y);
        const light = .299 * rgb[0] + .587 * rgb[1] + .114 * rgb[2];
        const difference = Math.hypot(rgb[0] - background[0], rgb[1] - background[1], rgb[2] - background[2]);
        if (difference > 60 && light > backgroundLight + 22) {
          rowCounts[row]++;
          colCounts[col]++;
        }
      }
    }
    const activeRows = rowCounts.map((count, index) => count > cols * .17 ? index : -1).filter((index) => index >= 0);
    const activeCols = colCounts.map((count, index) => count > rows * .17 ? index : -1).filter((index) => index >= 0);
    if (!activeRows.length || !activeCols.length) return false;
    const top = clamp(activeRows[0] * stepY, 0, h - 1), bottom = clamp((activeRows.at(-1) + 1) * stepY, 0, h - 1);
    const left = clamp(activeCols[0] * stepX, 0, w - 1), right = clamp((activeCols.at(-1) + 1) * stepX, 0, w - 1);
    if ((right - left) < w * .3 || (bottom - top) < h * .3) return false;
    scanCorners = [[left, top], [right, top], [right, bottom], [left, bottom]];
    return true;
  }
  function renderSource() {
    if (!scanImage) return;
    scanSource.width = scanImage.width;
    scanSource.height = scanImage.height;
    const ctx = scanSource.getContext('2d');
    ctx.drawImage(scanImage, 0, 0);
    if (!$('scan-crop').checked) return;
    const points = scanCorners;
    ctx.fillStyle = 'rgba(30, 76, 58, .08)';
    ctx.strokeStyle = '#52a4f6';
    ctx.lineWidth = Math.max(2, scanImage.width / 280);
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < 4; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    for (const [x, y] of points) {
      ctx.beginPath(); ctx.arc(x, y, Math.max(9, scanImage.width / 105), 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.lineWidth = Math.max(4, scanImage.width / 210); ctx.strokeStyle = '#3185d4'; ctx.stroke();
    }
  }
  function pointerPoint(event) {
    const rect = scanSource.getBoundingClientRect();
    return [(event.clientX - rect.left) * scanSource.width / rect.width, (event.clientY - rect.top) * scanSource.height / rect.height];
  }
  scanSource.addEventListener('pointerdown', (event) => {
    if (!scanImage || !$('scan-crop').checked) return;
    const [x, y] = pointerPoint(event);
    let distance = Infinity, nearest = -1;
    scanCorners.forEach((point, index) => {
      const d = Math.hypot(point[0] - x, point[1] - y);
      if (d < distance) { distance = d; nearest = index; }
    });
    if (distance < Math.max(scanImage.width, scanImage.height) * .10) {
      dragCorner = nearest;
      scanSource.setPointerCapture(event.pointerId);
      event.preventDefault();
    }
  });
  scanSource.addEventListener('pointermove', (event) => {
    if (dragCorner < 0) return;
    const [x, y] = pointerPoint(event);
    scanCorners[dragCorner] = [clamp(x, 0, scanImage.width - 1), clamp(y, 0, scanImage.height - 1)];
    renderSource();
    scheduleScan();
  });
  function endDrag() { dragCorner = -1; }
  scanSource.addEventListener('pointerup', endDrag);
  scanSource.addEventListener('pointercancel', endDrag);

  function scanTransform(points) {
    const [p0, p1, p2, p3] = points;
    const dx1 = p1[0] - p2[0], dx2 = p3[0] - p2[0], dx3 = p0[0] - p1[0] + p2[0] - p3[0];
    const dy1 = p1[1] - p2[1], dy2 = p3[1] - p2[1], dy3 = p0[1] - p1[1] + p2[1] - p3[1];
    const det = dx1 * dy2 - dx2 * dy1;
    const g = Math.abs(det) < .001 ? 0 : (dx3 * dy2 - dx2 * dy3) / det;
    const h = Math.abs(det) < .001 ? 0 : (dx1 * dy3 - dx3 * dy1) / det;
    return [p1[0] - p0[0] + g * p1[0], p3[0] - p0[0] + h * p3[0], p0[0],
            p1[1] - p0[1] + g * p1[1], p3[1] - p0[1] + h * p3[1], p0[1], g, h];
  }
  function renderScan() {
    if (!scanImage) return;
    const crop = $('scan-crop').checked;
    const points = scanCorners;
    const edge = (a, b) => Math.hypot(points[a][0] - points[b][0], points[a][1] - points[b][1]);
    const rawW = crop ? (edge(0, 1) + edge(2, 3)) / 2 : scanImage.width;
    const rawH = crop ? (edge(1, 2) + edge(3, 0)) / 2 : scanImage.height;
    const scale = Math.min(1, 1800 / Math.max(rawW, rawH));
    const width = clamp(Math.round(rawW * scale), 1, 1800);
    const height = clamp(Math.round(rawH * scale), 1, 1800);
    scanResult.width = width; scanResult.height = height;
    const ctx = scanResult.getContext('2d', { willReadFrequently: true });
    const sourceCtx = scanImage.getContext('2d', { willReadFrequently: true });
    const source = sourceCtx.getImageData(0, 0, scanImage.width, scanImage.height).data;
    const output = ctx.createImageData(width, height);
    const dest = output.data;
    const matrix = crop ? scanTransform(points) : null;
    const preset = document.querySelector('#scan-presets button.active').dataset.preset;
    const brightness = Number($('scan-brightness').value);
    const contrast = Number($('scan-contrast').value);
    const threshold = Number($('scan-threshold').value);
    const factor = 259 * (contrast + 255) / (255 * (259 - contrast));
    const adjust = (v) => clamp(factor * (v - 128) + 128 + brightness, 0, 255);
    for (let y = 0; y < height; y++) {
      const v = (y + .5) / height;
      for (let x = 0; x < width; x++) {
        const u = (x + .5) / width;
        let sx, sy;
        if (crop) {
          const denom = matrix[6] * u + matrix[7] * v + 1;
          sx = (matrix[0] * u + matrix[1] * v + matrix[2]) / denom;
          sy = (matrix[3] * u + matrix[4] * v + matrix[5]) / denom;
        } else { sx = u * scanImage.width; sy = v * scanImage.height; }
        const dst = (y * width + x) * 4;
        if (!Number.isFinite(sx) || !Number.isFinite(sy) || sx < 0 || sy < 0 || sx >= scanImage.width || sy >= scanImage.height) {
          dest[dst] = dest[dst + 1] = dest[dst + 2] = dest[dst + 3] = 255;
          continue;
        }
        const ix = Math.round(sx), iy = Math.round(sy);
        const src = (clamp(iy, 0, scanImage.height - 1) * scanImage.width + clamp(ix, 0, scanImage.width - 1)) * 4;
        let r = adjust(source[src]), g = adjust(source[src + 1]), b = adjust(source[src + 2]);
        if (preset !== 'color') {
          const gray = .299 * r + .587 * g + .114 * b;
          const value = preset === 'bw' ? (gray < threshold ? 0 : 255) : clamp((gray - threshold) * 3 + 205, 0, 255);
          r = g = b = value;
        }
        dest[dst] = r; dest[dst + 1] = g; dest[dst + 2] = b; dest[dst + 3] = 255;
      }
    }
    ctx.putImageData(output, 0, 0);
    $('scan-result-empty').hidden = true;
    $('scan-size').textContent = width + ' × ' + height + ' PNG';
    $('scan-download').disabled = false;
    setStatus('scan-status', '결과가 준비되었습니다. 모서리와 보정값을 조절한 뒤 저장하세요.');
  }
  function scheduleScan() {
    window.clearTimeout(scanTimer);
    scanTimer = window.setTimeout(renderScan, 140);
  }
  function setScanImage(image) {
    scanImage = scaledCanvas(image, 1800);
    resetCorners();
    const detected = detectDocumentCorners();
    $('scan-empty').hidden = true;
    renderSource();
    renderScan();
    if (detected) setStatus('scan-status', '문서 영역을 자동으로 찾았습니다. 파란 점을 실제 모서리에 맞게 확인해 주세요.');
  }
  $('scan-auto').addEventListener('click', () => {
    if (!scanImage) { setStatus('scan-status', '먼저 사진을 찍거나 올려 주세요.'); return; }
    const detected = detectDocumentCorners();
    renderSource();
    scheduleScan();
    setStatus('scan-status', detected ? '문서 영역을 찾았습니다. 파란 점을 확인해 주세요.' : '문서 경계를 찾지 못했습니다. 파란 점을 직접 움직여 주세요.');
  });
  $('scan-file').addEventListener('change', (event) => loadImage(event.target.files[0], setScanImage, 'scan-status'));
  for (const button of document.querySelectorAll('#scan-presets button')) button.addEventListener('click', () => {
    selectButton('#scan-presets', button);
    scheduleScan();
  });
  for (const name of ['brightness', 'contrast', 'threshold']) {
    const input = $('scan-' + name);
    input.addEventListener('input', () => { $('scan-' + name + '-value').value = input.value; scheduleScan(); });
  }
  $('scan-crop').addEventListener('change', () => { renderSource(); scheduleScan(); });
  $('scan-download').addEventListener('click', () => { if (scanImage) downloadCanvas(scanResult, 'classj-document-scan.png'); });

  function stopCamera() {
    cameraRequestId++;
    if (cameraStream) cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    $('camera-video').srcObject = null;
    $('camera-panel').hidden = true;
  }
  $('camera-open').addEventListener('click', async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('scan-status', '이 브라우저에서는 카메라를 사용할 수 없습니다. 사진을 올려 주세요.');
      return;
    }
    stopCamera();
    const requestId = cameraRequestId;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      if (requestId !== cameraRequestId) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      cameraStream = stream;
      $('camera-video').srcObject = stream;
      $('camera-panel').hidden = false;
      await $('camera-video').play();
      if (requestId === cameraRequestId) setStatus('scan-status', '문서가 화면 안에 들어오도록 맞춘 뒤 사진 찍기를 누르세요.');
    } catch (error) {
      if (requestId !== cameraRequestId) return;
      stopCamera();
      setStatus('scan-status', '카메라를 열지 못했습니다. 브라우저의 카메라 권한을 확인하거나 사진을 올려 주세요.');
    }
  });
  $('camera-close').addEventListener('click', stopCamera);
  $('camera-capture').addEventListener('click', () => {
    const video = $('camera-video');
    if (!video.videoWidth) { setStatus('scan-status', '카메라가 준비될 때까지 잠시 기다려 주세요.'); return; }
    const image = document.createElement('canvas');
    image.width = video.videoWidth; image.height = video.videoHeight;
    image.getContext('2d').drawImage(video, 0, 0);
    stopCamera();
    setScanImage(image);
  });
  window.addEventListener('pagehide', stopCamera);
})();
