(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('stamp-canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const fonts = {
    serif: { family: '"OfficeStampMyeongjo"', weight: 800, state: 'loading' },
    brush: { family: '"OfficeStampBrush"', weight: 400, state: 'loading' },
    pen: { family: '"OfficeStampPen"', weight: 400, state: 'loading' },
    gothic: { family: '"Malgun Gothic", "Apple SD Gothic Neo", sans-serif', weight: 700, state: 'ready' }
  };
  const base = { shape: 'oval', font: 'serif', layout: 'vertical', suffix: '', border: 'single', color: '#b63835', opacity: 100, lineWidth: 20, spacing: 8, texture: 0 };
  const presets = [
    { id: 'oval', label: '타원 명조', shape: 'oval', font: 'serif', layout: 'vertical', border: 'single' },
    { id: 'round', label: '원형 인', shape: 'circle', font: 'serif', layout: 'grid', suffix: '인', border: 'double' },
    { id: 'square', label: '사각 붓글씨', shape: 'square', font: 'brush', layout: 'grid', suffix: '印', border: 'single' },
    { id: 'rounded', label: '둥근 사각', shape: 'rounded', font: 'serif', layout: 'grid', suffix: '인', border: 'single' },
    { id: 'wide', label: '가로 결재', shape: 'rectangle', font: 'gothic', layout: 'horizontal', border: 'single' },
    { id: 'pen', label: '원형 손글씨', shape: 'circle', font: 'pen', layout: 'grid', suffix: '인', border: 'single' },
    { id: 'brush', label: '타원 붓글씨', shape: 'oval', font: 'brush', layout: 'vertical', border: 'double', texture: 30 },
    { id: 'double', label: '이중 사각', shape: 'square', font: 'serif', layout: 'grid', suffix: '印', border: 'double' }
  ];
  let settings = { ...base };
  let selectedPreset = 'oval';
  let mode = 'text';
  let photo = null;
  let photoRequestId = 0;
  let nameEdited = false;

  function status(message) { $('stamp-status').textContent = message; }
  function nameText() { return $('stamp-name').value.trim().replace(/\s+/g, ' '); }
  function markGroup(id, key, value) {
    for (const button of $(id).querySelectorAll('button')) {
      const active = button.dataset[key] === value;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
  }
  function syncControls() {
    markGroup('stamp-shapes', 'shape', settings.shape);
    markGroup('stamp-colors', 'color', settings.color);
    for (const key of ['font', 'layout', 'suffix', 'border', 'color', 'opacity', 'spacing', 'texture']) $('stamp-' + key).value = settings[key];
    $('stamp-line-width').value = settings.lineWidth;
    for (const key of ['opacity', 'spacing', 'texture', 'line-width']) {
      $('stamp-' + key + '-value').value = $('stamp-' + key).value + (['opacity', 'texture'].includes(key) ? '%' : '');
    }
  }
  function shapePath(context, shape, rx, ry, inset) {
    const x = Math.max(1, rx - inset), y = Math.max(1, ry - inset);
    context.beginPath();
    if (shape === 'circle' || shape === 'oval') context.ellipse(0, 0, x, y, 0, 0, Math.PI * 2);
    else if (shape === 'rounded') context.roundRect(-x, -y, 2 * x, 2 * y, Math.min(55, x / 3, y / 3));
    else context.rect(-x, -y, 2 * x, 2 * y);
  }
  function drawStamp(target, name, options) {
    const context = target.getContext('2d', { willReadFrequently: true });
    context.clearRect(0, 0, target.width, target.height);
    const rx = options.shape === 'oval' ? 188 : options.shape === 'rectangle' ? 325 : 290;
    const ry = options.shape === 'rectangle' ? 145 : options.shape === 'oval' ? 295 : 290;
    context.save();
    context.scale(target.width / 800, target.height / 800);
    context.translate(400, 400);
    context.globalAlpha = options.opacity / 100;
    context.strokeStyle = context.fillStyle = options.color;
    if (options.border !== 'none') {
      context.lineWidth = options.lineWidth;
      shapePath(context, options.shape, rx, ry, 0);
      context.stroke();
      if (options.border === 'double') {
        context.lineWidth = Math.max(5, options.lineWidth * .42);
        shapePath(context, options.shape, rx, ry, options.lineWidth + 13);
        context.stroke();
      }
    }
    const text = name ? name + options.suffix : '';
    if (text) {
      const characters = Array.from(text);
      const ellipse = options.shape === 'circle' || options.shape === 'oval';
      const padding = options.border === 'none' ? 16 : options.lineWidth / 2 + 26 + (options.border === 'double' ? options.lineWidth + 13 : 0);
      const width = 2 * (rx - padding) * (ellipse ? .70 : 1);
      const height = 2 * (ry - padding) * (ellipse ? .70 : 1);
      let layout = options.layout;
      if (layout === 'auto') layout = options.shape === 'rectangle' || /[a-z]/i.test(text) ? 'horizontal' : characters.length > 4 ? 'grid' : 'vertical';
      const columns = layout === 'horizontal' ? characters.length : layout === 'grid' ? Math.min(2, characters.length) : 1;
      const rows = layout === 'horizontal' ? 1 : Math.ceil(characters.length / columns);
      const gap = Math.min(options.spacing, width / columns * .35, height / rows * .35);
      const cellW = Math.max(2, (width - (columns - 1) * gap) / columns);
      const cellH = Math.max(2, (height - (rows - 1) * gap) / rows);
      const font = fonts[options.font] || fonts.gothic;
      context.font = font.weight + ' 200px ' + font.family;
      context.textBaseline = 'alphabetic';
      context.textAlign = 'left';
      const metrics = characters.map(char => context.measureText(char));
      let scaleX = Infinity, scaleY = Infinity;
      for (const metric of metrics) {
        const w = metric.actualBoundingBoxLeft + metric.actualBoundingBoxRight || metric.width || 100;
        const h = metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent || 180;
        scaleX = Math.min(scaleX, cellW * .94 / w);
        scaleY = Math.min(scaleY, cellH * .94 / h);
      }
      scaleX = Math.min(scaleX, scaleY * 1.8);
      scaleY = Math.min(scaleY, scaleX * 1.35);
      characters.forEach((char, index) => {
        const col = layout === 'horizontal' ? index : layout === 'grid' ? columns - 1 - Math.floor(index / rows) : 0;
        const row = layout === 'horizontal' ? 0 : index % rows;
        const x = (col - (columns - 1) / 2) * (cellW + gap);
        const y = (row - (rows - 1) / 2) * (cellH + gap);
        const metric = metrics[index];
        context.save();
        context.translate(x, y);
        context.scale(scaleX, scaleY);
        context.fillText(char, (metric.actualBoundingBoxLeft - metric.actualBoundingBoxRight) / 2, (metric.actualBoundingBoxAscent - metric.actualBoundingBoxDescent) / 2);
        context.restore();
      });
    }
    if (options.texture > 0) {
      let seed = 2166136261;
      for (const character of name) seed = Math.imul(seed ^ character.codePointAt(0), 16777619);
      const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
      context.globalCompositeOperation = 'destination-out';
      context.globalAlpha = .85;
      for (let i = 0; i < options.texture * 55; i++) {
        context.beginPath();
        context.ellipse((random() * 2 - 1) * (rx + 25), (random() * 2 - 1) * (ry + 25), 1 + random() * 3, .6 + random() * 1.8, random() * Math.PI, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.restore();
  }

  for (const preset of presets) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.preset = preset.id;
    button.setAttribute('aria-label', preset.label + ' 선택');
    const thumbnail = document.createElement('canvas');
    thumbnail.width = thumbnail.height = 180;
    thumbnail.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = preset.label;
    button.append(thumbnail, label);
    button.addEventListener('click', () => {
      settings = { ...base, ...preset, color: settings.color, opacity: settings.opacity };
      selectedPreset = preset.id;
      syncControls();
      render();
    });
    $('stamp-presets').append(button);
  }
  function renderPresets() {
    for (const preset of presets) {
      const button = $('stamp-presets').querySelector('[data-preset="' + preset.id + '"]');
      const options = { ...base, ...preset, color: settings.color, opacity: settings.opacity };
      button.disabled = fonts[options.font].state !== 'ready';
      button.setAttribute('aria-pressed', String(selectedPreset === preset.id));
      drawStamp(button.querySelector('canvas'), nameText(), options);
    }
  }
  function renderPhoto() {
    ctx.clearRect(0, 0, 800, 800);
    canvas.hidden = !photo;
    $('stamp-placeholder').hidden = Boolean(photo);
    $('stamp-placeholder').textContent = '도장 사진을 선택해 주세요.';
    $('stamp-download').disabled = !photo;
    if (!photo) { status(''); return; }
    const imageData = photo.getContext('2d').getImageData(0, 0, photo.width, photo.height);
    const pixels = imageData.data, threshold = Number($('stamp-threshold').value);
    for (let i = 0; i < pixels.length; i += 4) {
      const distance = Math.hypot(255 - pixels[i], 255 - pixels[i + 1], 255 - pixels[i + 2]);
      pixels[i + 3] = Math.round(pixels[i + 3] * Math.max(0, Math.min(1, (distance - threshold) / 55)));
    }
    const processed = document.createElement('canvas');
    processed.width = photo.width; processed.height = photo.height;
    processed.getContext('2d').putImageData(imageData, 0, 0);
    ctx.drawImage(processed, Math.round((800 - photo.width) / 2), Math.round((800 - photo.height) / 2));
    status('밝은 배경을 제거했습니다. 강도를 조절해 확인하세요.');
  }
  function render() {
    $('stamp-presets-wrap').hidden = mode !== 'text';
    if (mode === 'photo') { renderPhoto(); return; }
    const name = nameText();
    const ready = fonts[settings.font].state === 'ready';
    canvas.hidden = !name || !ready;
    $('stamp-placeholder').hidden = Boolean(name && ready);
    $('stamp-placeholder').textContent = name ? '글씨체를 불러오는 중…' : '이름을 입력해 주세요.';
    $('stamp-download').disabled = !name || !ready;
    drawStamp(canvas, name, settings);
    renderPresets();
    status(name && ready ? '투명 PNG로 저장됩니다.' : '');
  }

  for (const button of document.querySelectorAll('.mode-switch button')) button.addEventListener('click', () => {
    mode = button.id === 'stamp-text-tab' ? 'text' : 'photo';
    for (const tab of document.querySelectorAll('.mode-switch button')) {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    }
    $('stamp-text-controls').hidden = mode !== 'text';
    $('stamp-photo-controls').hidden = mode !== 'photo';
    render();
  });
  $('stamp-name').addEventListener('input', () => {
    nameEdited = true;
    $('stamp-name-status').textContent = '';
    render();
  });
  for (const button of $('stamp-shapes').querySelectorAll('button')) button.addEventListener('click', () => {
    settings.shape = button.dataset.shape;
    selectedPreset = '';
    syncControls(); render();
  });
  for (const key of ['font', 'layout', 'suffix', 'border', 'color']) $('stamp-' + key).addEventListener('input', () => {
    settings[key] = $('stamp-' + key).value;
    selectedPreset = '';
    syncControls(); render();
  });
  for (const [id, key] of [['opacity','opacity'], ['line-width','lineWidth'], ['spacing','spacing'], ['texture','texture']]) {
    $('stamp-' + id).addEventListener('input', () => {
      settings[key] = Number($('stamp-' + id).value);
      selectedPreset = '';
      syncControls(); render();
    });
  }
  for (const button of $('stamp-colors').querySelectorAll('button')) button.addEventListener('click', () => {
    settings.color = button.dataset.color;
    syncControls(); render();
  });
  $('stamp-upload').addEventListener('click', () => $('stamp-file').click());
  $('stamp-file').addEventListener('change', () => {
    const file = $('stamp-file').files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { status('이미지 파일을 선택해 주세요.'); return; }
    const requestId = ++photoRequestId;
    const image = new Image(), url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      if (requestId !== photoRequestId) return;
      const scale = Math.min(1, 760 / Math.max(image.width, image.height));
      photo = document.createElement('canvas');
      photo.width = Math.max(1, Math.round(image.width * scale));
      photo.height = Math.max(1, Math.round(image.height * scale));
      photo.getContext('2d').drawImage(image, 0, 0, photo.width, photo.height);
      render();
    };
    image.onerror = () => { URL.revokeObjectURL(url); if (requestId === photoRequestId) status('이미지를 열지 못했습니다. 다른 사진을 선택해 주세요.'); };
    image.src = url;
  });
  $('stamp-threshold').addEventListener('input', () => {
    $('stamp-threshold-value').value = $('stamp-threshold').value;
    render();
  });
  $('stamp-download').addEventListener('click', () => {
    if ($('stamp-download').disabled) return;
    render();
    canvas.toBlob(blob => {
      if (!blob) { status('이미지를 저장하지 못했습니다. 다시 시도해 주세요.'); return; }
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = 'stamp.png';
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }, 'image/png');
  });

  async function readJSON(url) {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', signal: controller.signal });
      return response.ok ? await response.json() : null;
    } catch (_) { return null; }
    finally { clearTimeout(timer); }
  }
  async function loadAccountName() {
    const [session, teacher] = await Promise.all([readJSON('/api/auth/me'), readJSON('/api/teacher/profile')]);
    if (nameEdited || $('stamp-name').value.trim()) return;
    const name = session?.signedIn
      ? (teacher?.profile?.name || session.user?.name || session.user?.displayName || '')
      : '';
    $('stamp-name').value = typeof name === 'string' ? name.trim() : '';
    $('stamp-name-status').textContent = $('stamp-name').value ? '' : '이름을 직접 입력해 주세요.';
    render();
  }
  syncControls(); render();
  void loadAccountName();
  for (const [key, font] of Object.entries(fonts)) {
    if (key === 'gothic') continue;
    document.fonts.load(font.weight + ' 200px ' + font.family).then(faces => {
      if (!faces.length) throw new Error('Missing font');
      font.state = 'ready';
    }).catch(() => {
      font.state = 'failed';
      $('stamp-font').querySelector('option[value="' + key + '"]').disabled = true;
      if (settings.font === key) { settings.font = 'gothic'; selectedPreset = ''; syncControls(); }
    }).finally(render);
  }
})();
