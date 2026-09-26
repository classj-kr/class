(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('stamp-canvas');
  const fonts = {
    brush: { family: '"OfficeStampGungseo"', weight: 400, state: 'loading' },
    gothic: { family: '"Malgun Gothic", "Apple SD Gothic Neo", sans-serif', weight: 700, state: 'ready' }
  };
  const base = { shape: 'oval', font: 'brush', layout: 'vertical', suffix: '', border: 'single', color: '#e11d24', opacity: 100, lineWidth: 16, spacing: 10, texture: 0, weight: 3, impression: 'positive' };
  const presets = [
    { id: 'oval-brush', label: '타원 궁서', shape: 'oval', font: 'brush', layout: 'vertical', weight: 3 },
    { id: 'circle-brush', label: '원형 궁서', shape: 'circle', font: 'brush', layout: 'grid', suffix: 'auto', weight: 3 },
    { id: 'square-brush', label: '사각 궁서', shape: 'square', font: 'brush', layout: 'grid', suffix: 'auto', weight: 3 }
  ];
  let settings = { ...base, ...presets[0] };
  let selectedPreset = presets[0].id;
  let mode = 'text';
  let photo = null;
  let photoRequestId = 0;
  let nameEdited = false;

  function status(message) { $('stamp-status').textContent = message; }
  function nameText() { return $('stamp-name').value.trim().replace(/\s+/g, ' '); }
  function shapePath(context, shape, rx, ry, inset) {
    const x = Math.max(1, rx - inset), y = Math.max(1, ry - inset);
    context.beginPath();
    if (shape === 'circle' || shape === 'oval') context.ellipse(0, 0, x, y, 0, 0, Math.PI * 2);
    else if (shape === 'rounded') context.roundRect(-x, -y, 2 * x, 2 * y, Math.min(55, x / 3, y / 3));
    else context.rect(-x, -y, 2 * x, 2 * y);
  }
  const glyphCache = new Map();
  function glyphImage(character, fontKey, weight) {
    const key = fontKey + ':' + weight + ':' + character;
    if (glyphCache.has(key)) return glyphCache.get(key);
    const font = fonts[fontKey] || fonts.gothic;
    const face = font.weight + ' 256px ' + font.family;
    const glyph = document.createElement('canvas');
    let context = glyph.getContext('2d');
    context.font = face;
    const metrics = context.measureText(character);
    const padding = 3 + weight;
    const width = Math.max(1, metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight);
    const height = Math.max(1, metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
    glyph.width = Math.ceil(width + padding * 2);
    glyph.height = Math.ceil(height + padding * 2);
    context = glyph.getContext('2d');
    context.font = face;
    context.textBaseline = 'alphabetic';
    context.fillStyle = context.strokeStyle = '#000';
    context.lineJoin = 'round';
    const x = metrics.actualBoundingBoxLeft + padding;
    const y = metrics.actualBoundingBoxAscent + padding;
    context.fillText(character, x, y);
    if (weight > 0) { context.lineWidth = weight; context.strokeText(character, x, y); }
    // Crop each glyph to its own ink bounds, including the extra stroke.
    const result = { canvas: glyph, x: padding - weight / 2, y: padding - weight / 2, width: width + weight, height: height + weight };
    if (glyphCache.size >= 128) glyphCache.delete(glyphCache.keys().next().value);
    glyphCache.set(key, result);
    return result;
  }
  function stampCells(count, layout, width, height, spacing) {
    const cells = [];
    const gap = Math.min(spacing, width / Math.max(1, count) * .3, height / Math.max(1, count) * .3);
    if (layout === 'packed' && count === 3) {
      const w = (width - gap) / 2, h = (height - gap) / 2;
      return [[w + gap, 0, w, height], [0, 0, w, h], [0, h + gap, w, h]];
    }
    const columns = layout === 'horizontal' ? count : ['grid', 'packed'].includes(layout) ? Math.min(2, count) : 1;
    const rows = Math.ceil(count / columns);
    const w = (width - gap * (columns - 1)) / columns;
    const h = (height - gap * (rows - 1)) / rows;
    for (let i = 0; i < count; i++) {
      const col = layout === 'horizontal' ? i : layout === 'grid' ? i % columns : columns - 1 - Math.floor(i / rows);
      const row = layout === 'horizontal' ? 0 : layout === 'grid' ? Math.floor(i / columns) : i % rows;
      cells.push([col * (w + gap), row * (h + gap), w, h]);
    }
    return cells;
  }
  function stampText(name, options) {
    const compact = name.replace(/\s/g, '');
    const suffix = options.suffix === 'auto' ? (Array.from(compact).length === 3 ? '인' : '') : options.suffix;
    return compact ? compact + suffix : '';
  }
  function fitStampCanvas(source, target, opacity = 1) {
    const { width, height } = source;
    const pixels = source.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, width, height).data;
    let left = width, top = height, right = -1, bottom = -1;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      if (!pixels[(y * width + x) * 4 + 3]) continue;
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
    if (right < left) { target.width = target.height = 1; return; }
    const padding = 4, maxSize = 256;
    const cropWidth = right - left + 1, cropHeight = bottom - top + 1;
    const scale = Math.min(1, (maxSize - padding * 2) / Math.max(cropWidth, cropHeight));
    const drawWidth = cropWidth * scale, drawHeight = cropHeight * scale;
    target.width = Math.ceil(drawWidth) + padding * 2;
    target.height = Math.ceil(drawHeight) + padding * 2;
    const output = target.getContext('2d', { willReadFrequently: true });
    output.imageSmoothingQuality = 'high';
    output.globalAlpha = opacity;
    output.drawImage(source, left, top, cropWidth, cropHeight, padding, padding, drawWidth, drawHeight);
    output.globalAlpha = 1;
  }
  function drawStamp(target, name, options) {
    const ink = document.createElement('canvas');
    ink.width = ink.height = 800;
    const context = ink.getContext('2d');
    const rx = options.shape === 'oval' ? 172 : options.shape === 'rectangle' ? 330 : 305;
    const ry = options.shape === 'rectangle' ? 145 : 305;
    context.translate(400, 400);
    context.strokeStyle = context.fillStyle = options.color;
    if (options.impression === 'negative') {
      shapePath(context, options.shape, rx, ry, 0);
      context.fill();
    } else if (options.border !== 'none') {
      context.lineWidth = options.lineWidth;
      shapePath(context, options.shape, rx, ry, 0);
      context.stroke();
      if (options.border === 'double') {
        context.lineWidth = Math.max(4, options.lineWidth * .38);
        shapePath(context, options.shape, rx, ry, options.lineWidth + 10);
        context.stroke();
      }
    }
    const characters = Array.from(stampText(name, options));
    if (characters.length) {
      let layout = options.layout;
      if (layout === 'auto') layout = options.shape === 'rectangle' || /[a-z]/i.test(name) ? 'horizontal' : options.shape === 'oval' ? 'vertical' : 'packed';
      const inset = options.impression === 'negative' ? 24 : options.border === 'none' ? 8 : options.lineWidth / 2 + 14 + (options.border === 'double' ? options.lineWidth + 10 : 0);
      const innerX = rx - inset, innerY = ry - inset;
      const contour = (options.shape === 'oval' || options.shape === 'circle') && layout === 'vertical';
      const circularGrid = (options.shape === 'oval' || options.shape === 'circle') && !contour;
      const width = Math.round(2 * innerX * (circularGrid ? .70 : .98));
      const height = Math.round(2 * innerY * (contour ? .90 : circularGrid ? .70 : .98));
      const cells = stampCells(characters.length, layout, width, height, options.spacing);
      const glyphs = characters.map((character, index) => {
        const glyph = glyphImage(character, options.font, options.weight);
        const [x, y, w, h] = cells[index];
        let availableWidth = w;
        if (contour) {
          // Keep the whole glyph inside the oval without bending its strokes.
          const furthestY = Math.max(Math.abs(y - height / 2), Math.abs(y + h - height / 2));
          availableWidth = Math.min(w, 2 * innerX * Math.sqrt(Math.max(0, 1 - (furthestY / innerY) ** 2)) * .98);
        }
        return { glyph, x, y, w, h, scale: Math.min(availableWidth / glyph.width, h / glyph.height) };
      });
      // A vertical name uses one type size, including the narrower ends of an oval.
      const verticalScale = layout === 'vertical' ? Math.min(...glyphs.map(item => item.scale)) : null;
      context.globalCompositeOperation = options.impression === 'negative' ? 'destination-out' : 'source-over';
      for (const { glyph, x, y, w, h, scale } of glyphs) {
        const size = verticalScale ?? scale;
        const drawWidth = glyph.width * size, drawHeight = glyph.height * size;
        context.drawImage(glyph.canvas, glyph.x, glyph.y, glyph.width, glyph.height,
          x - width / 2 + (w - drawWidth) / 2, y - height / 2 + (h - drawHeight) / 2, drawWidth, drawHeight);
      }
      context.globalCompositeOperation = 'source-over';
      if (options.impression !== 'negative') {
        // Colour the complete ink layer once, so overlap never darkens the opacity.
        context.globalCompositeOperation = 'source-in';
        context.fillRect(-400, -400, 800, 800);
        context.globalCompositeOperation = 'source-over';
      }
    }
    if (options.texture > 0) {
      let seed = 2166136261;
      for (const character of name) seed = Math.imul(seed ^ character.codePointAt(0), 16777619);
      const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
      context.globalCompositeOperation = 'destination-out';
      context.globalAlpha = .65;
      for (let i = 0; i < options.texture * 35; i++) {
        context.beginPath();
        context.ellipse((random() * 2 - 1) * (rx + 20), (random() * 2 - 1) * (ry + 20), .6 + random() * 2, .5 + random(), random() * Math.PI, 0, Math.PI * 2);
        context.fill();
      }
    }
    fitStampCanvas(ink, target, options.opacity / 100);
  }

  for (const preset of presets) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.preset = preset.id;
    button.setAttribute('aria-label', preset.label + ' 선택');
    const thumbnail = document.createElement('canvas');
    thumbnail.width = thumbnail.height = 180;
    thumbnail.setAttribute('aria-hidden', 'true');
    button.title = preset.label;
    button.append(thumbnail);
    button.addEventListener('click', () => {
      settings = { ...base, ...preset };
      selectedPreset = preset.id;
      render();
    });
    $('stamp-presets').append(button);
  }
  function fontReady(key, text) {
    return fonts[key].state === 'ready';
  }
  function renderPresets() {
    for (const preset of presets) {
      const button = $('stamp-presets').querySelector('[data-preset="' + preset.id + '"]');
      const options = { ...base, ...preset, color: settings.color, opacity: settings.opacity };
      button.disabled = !nameText() || !fontReady(options.font, stampText(nameText(), options));
      button.setAttribute('aria-pressed', String(selectedPreset === preset.id));
      drawStamp(button.querySelector('canvas'), nameText(), options);
    }
  }
  function renderPhoto() {
    canvas.width = canvas.height = 1;
    canvas.hidden = !photo;
    $('stamp-placeholder').hidden = Boolean(photo);
    $('stamp-placeholder').textContent = '도장 사진을 선택해 주세요.';
    $('stamp-download').disabled = !photo;
    $('stamp-rotate-left').disabled = !photo;
    $('stamp-rotate-right').disabled = !photo;
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
    fitStampCanvas(processed, canvas);
    status('밝은 배경을 제거했습니다. 강도를 조절해 확인하세요.');
  }
  function rotatePhoto(direction) {
    if (!photo) return;
    const rotated = document.createElement('canvas');
    rotated.width = photo.height;
    rotated.height = photo.width;
    const context = rotated.getContext('2d');
    if (direction > 0) context.setTransform(0, 1, -1, 0, photo.height, 0);
    else context.setTransform(0, -1, 1, 0, 0, photo.width);
    context.drawImage(photo, 0, 0);
    photo = rotated;
    render();
  }
  $('stamp-rotate-left').addEventListener('click', () => rotatePhoto(-1));
  $('stamp-rotate-right').addEventListener('click', () => rotatePhoto(1));

  function render() {
    if (mode === 'photo') { renderPhoto(); return; }
    const name = nameText();
    const ready = fontReady(settings.font, stampText(name, settings));
    canvas.hidden = !name || !ready;
    $('stamp-placeholder').hidden = Boolean(name && ready);
    $('stamp-placeholder').textContent = name ? fonts[settings.font].state === 'failed' ? '이 도장을 불러오지 못했습니다. 다른 도장을 선택해 주세요.' : '도장을 불러오는 중…' : '이름을 입력해 주세요.';
    $('stamp-download').disabled = !name || !ready;
    drawStamp(canvas, name, settings);
    renderPresets();
    status('');
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
  render();
  void loadAccountName();
  for (const [key, font] of Object.entries(fonts)) {
    if (key === 'gothic') continue;
    document.fonts.load(font.weight + ' 200px ' + font.family).then(faces => {
      if (!faces.length) throw new Error('Missing font');
      font.state = 'ready';
      glyphCache.clear();
    }).catch(() => {
      font.state = 'failed';
      status('일부 도장을 불러오지 못했습니다. 다른 견본을 선택해 주세요.');
    }).finally(render);
  }
})();
