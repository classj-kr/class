"use strict";
// Small animated-GIF encoder for the flipbook: one shared 256-colour palette
// (median cut over every frame) and plain LZW, no workers or libraries.
(() => {
  const BITS = 5; // 5 bits per channel -> 32768 colour buckets
  const BUCKETS = 1 << (BITS * 3);

  function bucketKey(r, g, b) {
    return ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
  }

  function buildPalette(frames) {
    const counts = new Uint32Array(BUCKETS);
    frames.forEach(frame => {
      const data = frame.data;
      for (let i = 0; i < data.length; i += 4) {
        counts[bucketKey(data[i], data[i + 1], data[i + 2])] += 1;
      }
    });
    const colors = [];
    for (let key = 0; key < BUCKETS; key += 1) {
      if (!counts[key]) continue;
      colors.push({
        r: ((key >> 10) & 31) * 8 + 4,
        g: ((key >> 5) & 31) * 8 + 4,
        b: (key & 31) * 8 + 4,
        w: counts[key]
      });
    }
    if (colors.length <= 256) return colors.map(c => [c.r, c.g, c.b]);

    const boxInfo = list => {
      let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
      list.forEach(c => {
        if (c.r < minR) minR = c.r; if (c.r > maxR) maxR = c.r;
        if (c.g < minG) minG = c.g; if (c.g > maxG) maxG = c.g;
        if (c.b < minB) minB = c.b; if (c.b > maxB) maxB = c.b;
      });
      const ranges = { r: maxR - minR, g: maxG - minG, b: maxB - minB };
      const channel = ranges.r >= ranges.g && ranges.r >= ranges.b ? "r" : (ranges.g >= ranges.b ? "g" : "b");
      return { list, channel, range: ranges[channel] };
    };

    const boxes = [boxInfo(colors)];
    while (boxes.length < 256) {
      let pick = -1;
      let best = 0;
      boxes.forEach((box, index) => {
        if (box.list.length < 2) return;
        const weight = box.list.reduce((sum, c) => sum + c.w, 0);
        const score = box.range * Math.sqrt(weight);
        if (score > best) { best = score; pick = index; }
      });
      if (pick < 0) break;
      const box = boxes[pick];
      const ch = box.channel;
      box.list.sort((a, b) => a[ch] - b[ch]);
      const half = box.list.reduce((sum, c) => sum + c.w, 0) / 2;
      let acc = 0;
      let cut = 1;
      for (let i = 0; i < box.list.length - 1; i += 1) {
        acc += box.list[i].w;
        cut = i + 1;
        if (acc >= half) break;
      }
      boxes.splice(pick, 1, boxInfo(box.list.slice(0, cut)), boxInfo(box.list.slice(cut)));
    }

    return boxes.map(box => {
      let r = 0, g = 0, b = 0, w = 0;
      box.list.forEach(c => { r += c.r * c.w; g += c.g * c.w; b += c.b * c.w; w += c.w; });
      return [Math.round(r / w), Math.round(g / w), Math.round(b / w)];
    });
  }

  function indexFrame(frame, palette, cache) {
    const data = frame.data;
    const out = new Uint8Array(data.length / 4);
    for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
      const key = bucketKey(data[i], data[i + 1], data[i + 2]);
      let index = cache[key];
      if (index < 0) {
        const r = ((key >> 10) & 31) * 8 + 4;
        const g = ((key >> 5) & 31) * 8 + 4;
        const b = (key & 31) * 8 + 4;
        let bestDist = Infinity;
        for (let c = 0; c < palette.length; c += 1) {
          const dr = palette[c][0] - r;
          const dg = palette[c][1] - g;
          const db = palette[c][2] - b;
          const dist = dr * dr * 3 + dg * dg * 4 + db * db * 2;
          if (dist < bestDist) { bestDist = dist; index = c; }
        }
        cache[key] = index;
      }
      out[p] = index;
    }
    return out;
  }

  class ByteWriter {
    constructor() { this.chunks = []; this.buf = new Uint8Array(65536); this.pos = 0; }
    byte(value) {
      if (this.pos === this.buf.length) { this.chunks.push(this.buf); this.buf = new Uint8Array(65536); this.pos = 0; }
      this.buf[this.pos++] = value & 255;
    }
    word(value) { this.byte(value); this.byte(value >> 8); }
    text(value) { for (let i = 0; i < value.length; i += 1) this.byte(value.charCodeAt(i)); }
    bytes(list) { for (let i = 0; i < list.length; i += 1) this.byte(list[i]); }
    result() {
      const total = this.chunks.length * 65536 + this.pos;
      const out = new Uint8Array(total);
      this.chunks.forEach((chunk, i) => out.set(chunk, i * 65536));
      out.set(this.buf.subarray(0, this.pos), this.chunks.length * 65536);
      return out;
    }
  }

  // LZW-compress palette indices and write them as GIF data sub-blocks.
  function writeLzw(writer, indices) {
    const minCodeSize = 8;
    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;
    let codeSize = minCodeSize + 1;
    let nextCode = eoiCode + 1;
    let table = new Map();

    const block = new Uint8Array(255);
    let blockLen = 0;
    let bitBuf = 0;
    let bitCount = 0;
    const pushByte = value => {
      block[blockLen++] = value;
      if (blockLen === 255) { writer.byte(255); writer.bytes(block); blockLen = 0; }
    };
    const emit = code => {
      bitBuf |= code << bitCount;
      bitCount += codeSize;
      while (bitCount >= 8) { pushByte(bitBuf & 255); bitBuf >>>= 8; bitCount -= 8; }
    };

    writer.byte(minCodeSize);
    emit(clearCode);
    let current = indices[0];
    for (let i = 1; i < indices.length; i += 1) {
      const k = indices[i];
      const key = (current << 8) | k;
      const found = table.get(key);
      if (found !== undefined) { current = found; continue; }
      emit(current);
      if (nextCode === 4096) {
        emit(clearCode);
        table = new Map();
        codeSize = minCodeSize + 1;
        nextCode = eoiCode + 1;
      } else {
        if (nextCode >= (1 << codeSize)) codeSize += 1;
        table.set(key, nextCode++);
      }
      current = k;
    }
    emit(current);
    emit(eoiCode);
    if (bitCount > 0) pushByte(bitBuf & 255);
    if (blockLen) { writer.byte(blockLen); writer.bytes(block.subarray(0, blockLen)); }
    writer.byte(0);
  }

  const nextTick = () => new Promise(resolve => setTimeout(resolve, 0));

  // frames: ImageData[] of identical size; delayMs per frame. Resolves a Blob.
  async function encodeGif({ width, height, frames, delayMs, onProgress }) {
    const palette = buildPalette(frames);
    while (palette.length < 256) palette.push([0, 0, 0]);
    const cache = new Int16Array(BUCKETS).fill(-1);
    const delay = Math.max(2, Math.round(delayMs / 10));

    const w = new ByteWriter();
    w.text("GIF89a");
    w.word(width);
    w.word(height);
    w.byte(0xf7); // global colour table, 8 bits, 256 entries
    w.byte(0);
    w.byte(0);
    palette.forEach(([r, g, b]) => { w.byte(r); w.byte(g); w.byte(b); });
    w.bytes([0x21, 0xff, 0x0b]);
    w.text("NETSCAPE2.0");
    w.bytes([0x03, 0x01, 0x00, 0x00, 0x00]); // loop forever

    for (let f = 0; f < frames.length; f += 1) {
      w.bytes([0x21, 0xf9, 0x04, 0x04]);
      w.word(delay);
      w.bytes([0x00, 0x00]);
      w.byte(0x2c);
      w.word(0); w.word(0); w.word(width); w.word(height);
      w.byte(0);
      writeLzw(w, indexFrame(frames[f], palette, cache));
      if (onProgress) onProgress((f + 1) / frames.length);
      await nextTick();
    }
    w.byte(0x3b);
    return new Blob([w.result()], { type: "image/gif" });
  }

  window.encodeGif = encodeGif;
})();
