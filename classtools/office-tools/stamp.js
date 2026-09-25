(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('stamp-canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const fonts = {
    seal: { family: '"OfficeStampGungseo"', weight: 400, state: 'ready' },
    serif: { family: '"OfficeStampMyeongjo"', weight: 400, state: 'loading' },
    brush: { family: '"OfficeStampGungseo"', weight: 400, state: 'loading' },
    pen: { family: '"OfficeStampBoldMyeongjo"', weight: 400, state: 'loading' },
    gothic: { family: '"Malgun Gothic", "Apple SD Gothic Neo", sans-serif', weight: 700, state: 'ready' }
  };
  const base = { shape: 'oval', font: 'seal', layout: 'vertical', suffix: '', border: 'single', color: '#e11d24', opacity: 100, lineWidth: 20, spacing: 12, texture: 0, weight: 3, impression: 'positive' };
  const presets = [
    { id: 'oval-seal', label: '타원 전서형', shape: 'oval', font: 'seal', layout: 'vertical', border: 'single', weight: 1 },
    { id: 'oval-serif', label: '타원 명조', shape: 'oval', font: 'serif', layout: 'vertical', border: 'single', weight: 2 },
    { id: 'oval-brush', label: '타원 궁서', shape: 'oval', font: 'brush', layout: 'vertical', border: 'single', weight: 5 },
    { id: 'circle-seal', label: '원형 전서형', shape: 'circle', font: 'seal', layout: 'grid', suffix: 'auto', border: 'single', weight: 1 },
    { id: 'circle-serif', label: '원형 명조', shape: 'circle', font: 'pen', layout: 'grid', suffix: 'auto', border: 'single', weight: 0 },
    { id: 'circle-brush', label: '원형 궁서', shape: 'circle', font: 'brush', layout: 'grid', suffix: 'auto', border: 'single', weight: 5 },
    { id: 'square-seal', label: '사각 전서형', shape: 'square', font: 'seal', layout: 'grid', suffix: 'auto', border: 'single', weight: 1 },
    { id: 'square-serif', label: '사각 명조', shape: 'square', font: 'pen', layout: 'grid', suffix: 'auto', border: 'single', weight: 0 },
    { id: 'square-brush', label: '사각 궁서', shape: 'square', font: 'brush', layout: 'grid', suffix: 'auto', border: 'single', weight: 5 }
  ];
  let settings = { ...base, ...presets[0] };
  let selectedPreset = 'oval-seal';
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
    for (const key of ['font', 'layout', 'suffix', 'border', 'color', 'opacity', 'spacing', 'texture', 'weight', 'impression']) $('stamp-' + key).value = settings[key];
    $('stamp-line-width').value = settings.lineWidth;
    $('stamp-border').disabled = settings.impression === 'negative';
    $('stamp-line-width').disabled = settings.impression === 'negative';
    for (const key of ['opacity', 'spacing', 'texture', 'line-width', 'weight']) {
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
  function sealGlyph(character, weight) {
    const code = character.codePointAt(0) - 0xac00;
    if ((code < 0 || code >= 11172) && character !== '印') return null;
    const leading = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
    const trailing = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
    const pairs = { 'ㄲ':'ㄱㄱ','ㄸ':'ㄷㄷ','ㅃ':'ㅂㅂ','ㅆ':'ㅅㅅ','ㅉ':'ㅈㅈ','ㄳ':'ㄱㅅ','ㄵ':'ㄴㅈ','ㄶ':'ㄴㅎ','ㄺ':'ㄹㄱ','ㄻ':'ㄹㅁ','ㄼ':'ㄹㅂ','ㄽ':'ㄹㅅ','ㄾ':'ㄹㅌ','ㄿ':'ㄹㅍ','ㅀ':'ㄹㅎ','ㅄ':'ㅂㅅ' };
    const initial = leading[Math.floor(code / 588)], vowel = Math.floor(code % 588 / 28), final = trailing[code % 28];
    const glyph = document.createElement('canvas'); glyph.width = glyph.height = 256;
    const context = glyph.getContext('2d');
    context.strokeStyle = '#000'; context.lineWidth = 15 + weight;
    context.lineCap = 'round'; context.lineJoin = 'round';
    const line = (box, points) => {
      const [x,y,w,h] = box; context.beginPath();
      points.forEach(([px,py],i) => context[i ? 'lineTo' : 'moveTo'](x + px * w / 100, y + py * h / 100)); context.stroke();
    };
    if (character === '印') {
      line([20,20,216,216],[[42,0],[0,16],[0,82],[43,82]]);
      line([20,20,216,216],[[0,47],[43,47]]);
      line([20,20,216,216],[[64,100],[64,10],[100,10],[100,72],[82,72]]);
      return { canvas: glyph, x: 20 - context.lineWidth / 2, y: 20 - context.lineWidth / 2, width: 216 + context.lineWidth, height: 216 + context.lineWidth };
    }
    function consonant(letter, box) {
      const [x,y,w,h] = box;
      if (pairs[letter]) {
        const gap = Math.max(16, context.lineWidth * 1.2), half = (w - gap) / 2;
        consonant(pairs[letter][0], [x,y,half,h]); consonant(pairs[letter][1], [x+half+gap,y,half,h]); return;
      }
      const ring = (rx,ry,rw,rh,radius) => { context.beginPath(); context.roundRect(x+rx*w/100,y+ry*h/100,rw*w/100,rh*h/100,Math.min(w,h)*radius);context.stroke(); };
      if (letter === 'ㄱ') line(box,[[0,0],[100,0],[100,100]]);
      else if (letter === 'ㄴ') line(box,[[0,0],[0,100],[100,100]]);
      else if (letter === 'ㄷ') line(box,[[100,0],[0,0],[0,100],[100,100]]);
      else if (letter === 'ㄹ') line(box,[[0,0],[100,0],[100,50],[0,50],[0,100],[100,100]]);
      else if (letter === 'ㅁ') ring(0,0,100,100,.12);
      else if (letter === 'ㅂ') {line(box,[[0,0],[0,100],[100,100],[100,0]]);line(box,[[0,50],[100,50]]);}
      else if (letter === 'ㅅ') {line(box,[[50,0],[50,35],[0,100]]);line(box,[[50,35],[100,100]]);}
      else if (letter === 'ㅇ') ring(0,0,100,100,.32);
      else if (letter === 'ㅈ') {line(box,[[0,0],[100,0]]);consonant('ㅅ',[x+w*.05,y+h*.23,w*.9,h*.77]);}
      else if (letter === 'ㅊ') {line(box,[[30,0],[70,0]]);line(box,[[0,27],[100,27]]);consonant('ㅅ',[x+w*.05,y+h*.42,w*.9,h*.58]);}
      else if (letter === 'ㅋ') {consonant('ㄱ',box);line(box,[[0,50],[100,50]]);}
      else if (letter === 'ㅌ') {consonant('ㄷ',box);line(box,[[0,50],[100,50]]);}
      else if (letter === 'ㅍ') {line(box,[[0,0],[100,0]]);line(box,[[0,100],[100,100]]);line(box,[[25,0],[25,100]]);line(box,[[75,0],[75,100]]);}
      else if (letter === 'ㅎ') {line(box,[[30,0],[70,0]]);line(box,[[0,27],[100,27]]);ring(8,47,84,53,.18);}
    }
    function simpleVowel(v, box) {
      if (v <= 7 || v === 20) {
        const left = v <= 3, doubled = [2,3,6,7].includes(v), extra = [1,3,5,7].includes(v);
        const stem = v === 20 ? 50 : left ? (extra ? 10 : 25) : (extra ? 55 : 75);
        line(box,[[stem,0],[stem,100]]);
        if (v !== 20) for (const y of doubled ? [32,68] : [50]) line(box,[[left ? stem : 0,y],[left ? (extra ? 58 : 100) : stem,y]]);
        if (extra) line(box,[[100,0],[100,100]]);
      } else {
        const up = v === 8 || v === 12, doubled = v === 12 || v === 17;
        const y = v === 18 ? 50 : up ? 85 : 15;
        line(box,[[0,y],[100,y]]);
        if (v !== 18) for (const x of doubled ? [30,70] : [50]) line(box,[[x,up ? 0 : y],[x,up ? y : 100]]);
      }
    }
    const x=20,y=20,w=216,topHeight=final ? 126 : 216;
    if ([0,1,2,3,4,5,6,7,20].includes(vowel)) {
      consonant(initial,[x,y,w*.49,topHeight]); simpleVowel(vowel,[x+w*.64,y,w*.36,topHeight]);
    } else if ([8,12,13,17,18].includes(vowel)) {
      consonant(initial,[x,y,w,topHeight*.50]);simpleVowel(vowel,[x,y+topHeight*.73,w,topHeight*.27]);
    } else {
      const compound = {9:[8,0],10:[8,1],11:[8,20],14:[13,4],15:[13,5],16:[13,20],19:[18,20]}[vowel];
      consonant(initial,[x,y,w*.48,topHeight*.50]);
      simpleVowel(compound[0],[x,y+topHeight*.75,w*.60,topHeight*.25]);
      simpleVowel(compound[1],[x+w*.72,y,w*.28,topHeight]);
    }
    if (final) consonant(final,[x,176,w,60]);
    return { canvas: glyph, x: 20 - context.lineWidth / 2, y: 20 - context.lineWidth / 2, width: 216 + context.lineWidth, height: 216 + context.lineWidth };
  }
  const glyphCache = new Map();
  function glyphImage(character, fontKey, weight) {
    const key = fontKey + ':' + weight + ':' + character;
    if (glyphCache.has(key)) return glyphCache.get(key);
    if (fontKey === 'seal') {
      const glyph = sealGlyph(character, weight);
      if (glyph) { if (glyphCache.size >= 128) glyphCache.delete(glyphCache.keys().next().value); glyphCache.set(key, glyph); return glyph; }
    }
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
  function drawStamp(target, name, options) {
    const ink = document.createElement('canvas');
    ink.width = ink.height = 800;
    const context = ink.getContext('2d');
    const rx = options.shape === 'oval' ? 205 : options.shape === 'rectangle' ? 330 : 305;
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
    const output = target.getContext('2d', { willReadFrequently: true });
    output.clearRect(0, 0, target.width, target.height);
    output.save();
    output.globalAlpha = options.opacity / 100;
    output.drawImage(ink, 0, 0, target.width, target.height);
    output.restore();
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
  function fontReady(key, text) {
    if (key === 'seal' && /[^가-힣印\s]/u.test(text)) return fonts.brush.state === 'ready';
    return fonts[key].state === 'ready';
  }
  function renderPresets() {
    for (const preset of presets) {
      const button = $('stamp-presets').querySelector('[data-preset="' + preset.id + '"]');
      const options = { ...base, ...preset, color: settings.color, opacity: settings.opacity };
      button.disabled = !fontReady(options.font, stampText(nameText(), options));
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
    ctx.drawImage(processed, Math.round((800 - photo.width) / 2), Math.round((800 - photo.height) / 2));
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
    $('stamp-presets-wrap').hidden = mode !== 'text';
    if (mode === 'photo') { renderPhoto(); return; }
    const name = nameText();
    const ready = fontReady(settings.font, stampText(name, settings));
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
  for (const key of ['font', 'layout', 'suffix', 'border', 'color', 'impression']) $('stamp-' + key).addEventListener('input', () => {
    settings[key] = $('stamp-' + key).value;
    selectedPreset = '';
    syncControls(); render();
  });
  for (const [id, key] of [['opacity','opacity'], ['line-width','lineWidth'], ['spacing','spacing'], ['texture','texture'], ['weight','weight']]) {
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
    if (key === 'gothic' || key === 'seal') continue;
    document.fonts.load(font.weight + ' 200px ' + font.family).then(faces => {
      if (!faces.length) throw new Error('Missing font');
      font.state = 'ready';
      glyphCache.clear();
    }).catch(() => {
      font.state = 'failed';
      $('stamp-font').querySelector('option[value="' + key + '"]').disabled = true;
      if (settings.font === key) { settings.font = 'gothic'; selectedPreset = ''; syncControls(); }
    }).finally(render);
  }
})();
