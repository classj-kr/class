"use strict";
(() => {
  const CANVAS_W = 1000;
  const CANVAS_H = 700;
  const MIN_VIEW_W = 200;
  const MIN_VIEW_H = 150;
  const MAX_LAYERS = 3;
  const MAX_FRAMES = 30;
  const THUMB_W = 96;
  const GIF_MAX_SIDE = 640;
  const PAPER_COLOR = "#fffdf6";
  const SNAPSHOT_INTERVAL = 20;
  const MIN_POINT_GAP = 1.4;

  const $ = id => document.getElementById(id);

  const BRUSHES = {
    pencil: {
      label: "연필",
      compositeMode: "source-over",
      spacingRatio: 0.28,
      sizeRange: [1.5, 14],
      baseOpacity: 0.85,
      jitterAlpha: 0.35,
      tip: buildGrainTip(0.55, "#000")
    },
    crayon: {
      label: "크레파스",
      compositeMode: "source-over",
      spacingRatio: 0.32,
      sizeRange: [6, 34],
      baseOpacity: 0.7,
      jitterAlpha: 0.5,
      tip: buildGrainTip(0.85, "#000")
    },
    marker: {
      label: "마카",
      compositeMode: "source-over",
      spacingRatio: 0.22,
      sizeRange: [5, 26],
      baseOpacity: 0.9,
      jitterAlpha: 0.08,
      tip: buildSoftTip(0.92)
    },
    watercolor: {
      label: "수채화",
      compositeMode: "multiply",
      spacingRatio: 0.4,
      sizeRange: [10, 46],
      baseOpacity: 0.22,
      jitterAlpha: 0.1,
      tip: buildWatercolorTip()
    },
    eraser: {
      label: "지우개",
      compositeMode: "destination-out",
      spacingRatio: 0.3,
      sizeRange: [8, 40],
      baseOpacity: 1,
      jitterAlpha: 0,
      tip: buildSoftTip(1)
    }
  };

  const SWATCHES = [
    "#1a1a1a", "#ffffff", "#e74c3c", "#ff9f1c", "#ffd166",
    "#8bc34a", "#2ec4b6", "#3a86ff", "#5b3cc4", "#c2185b",
    "#8d5524", "#78909c"
  ];

  function buildTipCanvas(size, painter) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    painter(canvas.getContext("2d"), size);
    return canvas;
  }

  function buildSoftTip(hardness) {
    return buildTipCanvas(64, (ctx, size) => {
      const r = size / 2;
      const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
      const stop = Math.max(0.05, hardness * 0.65);
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(stop, "rgba(0,0,0,1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(r, r, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function buildGrainTip(density, seedColor) {
    return buildTipCanvas(64, (ctx, size) => {
      const r = size / 2;
      const base = ctx.createRadialGradient(r, r, 0, r, r, r);
      base.addColorStop(0, "rgba(0,0,0,0.9)");
      base.addColorStop(0.7, "rgba(0,0,0,0.55)");
      base.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.arc(r, r, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "destination-out";
      const holes = Math.round(90 * density);
      let seed = 42;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return (seed % 1000) / 1000;
      };
      for (let i = 0; i < holes; i += 1) {
        const angle = rand() * Math.PI * 2;
        const dist = rand() * r;
        const x = r + Math.cos(angle) * dist;
        const y = r + Math.sin(angle) * dist;
        const holeSize = 0.4 + rand() * 1.6;
        ctx.globalAlpha = 0.35 + rand() * 0.45;
        ctx.beginPath();
        ctx.arc(x, y, holeSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    });
  }

  function buildWatercolorTip() {
    return buildTipCanvas(96, (ctx, size) => {
      const r = size / 2;
      const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
      gradient.addColorStop(0, "rgba(0,0,0,0.5)");
      gradient.addColorStop(0.55, "rgba(0,0,0,0.42)");
      gradient.addColorStop(0.82, "rgba(0,0,0,0.55)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(r, r, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const value = clean.length === 3
      ? clean.split("").map(c => c + c).join("")
      : clean;
    const num = parseInt(value, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function hsvToHex(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    const toHex = n => Math.round((n + m) * 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  class Layer {
    constructor(name) {
      this.id = `layer-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
      this.name = name;
      this.visible = true;
      this.opacity = 1;
      this.canvas = document.createElement("canvas");
      this.canvas.width = CANVAS_W;
      this.canvas.height = CANVAS_H;
      this.ctx = this.canvas.getContext("2d");
      this.strokes = [];
      this.snapshots = [];
      this.version = 0;
    }
  }

  // One flipbook page: its own drawing layer plus a small preview.
  class Frame {
    constructor(layer) {
      this.layer = layer;
      this.thumb = document.createElement("canvas");
    }
  }

  class ArtStudio {
    constructor() {
      this.displayCanvas = $("mainCanvas");
      this.displayCtx = this.displayCanvas.getContext("2d");
      this.brushCursorEl = $("brushCursor");
      this.scratchCanvas = document.createElement("canvas");
      this.scratchCanvas.width = CANVAS_W;
      this.scratchCanvas.height = CANVAS_H;
      this.scratchCtx = this.scratchCanvas.getContext("2d");
      this.stampCanvas = document.createElement("canvas");
      this.stampCtx = this.stampCanvas.getContext("2d");

      this.layers = [new Layer("배경")];
      this.activeLayerIndex = 0;
      this.actionLog = [];
      this.redoLog = [];

      this.brushId = "pencil";
      this.color = "#1a1a1a";
      this.baseSize = 8;
      this.opacitySetting = 1;
      this.scatter = 0;
      this.stabilization = 1;

      this.activeStroke = null;
      this.rawBuffer = [];
      this.lastStampPoint = null;
      this.pointerId = null;
      this.lastMoveTime = 0;
      this.lastMovePoint = null;
      this.alphaLock = false;
      this.eyedropperArmed = false;
      this.playerName = String((window.CLASS_PLAYER_NAME || "") || "").trim();

      this.flipbook = false;
      this.frames = [];
      this.frameIndex = 0;
      this.onionSkin = true;
      this.fps = 6;
      this.playing = false;
      this.playIndex = 0;
      this.playTimer = null;
      this.exporting = false;
      this.onionCanvas = document.createElement("canvas");
      this.onionCanvas.width = CANVAS_W;
      this.onionCanvas.height = CANVAS_H;
      this.onionCtx = this.onionCanvas.getContext("2d");
      this.onionKey = "";

      this.canvasFrameEl = $("canvasFrame");
      this.canvasStageEl = document.querySelector(".canvas-stage");
      this.viewW = CANVAS_W;
      this.viewH = CANVAS_H;
      this.updateStageScale();
      window.addEventListener("resize", () => this.updateStageScale());

      this.bindUI();
      this.bindCanvas();
      this.bindResizeHandles();
      this.renderLayerPanel();
      this.updateHistoryButtons();
      this.composite();
    }

    // ---------- UI wiring ----------
    bindUI() {
      const brushRail = $("brushRail");
      Object.keys(BRUSHES).forEach(id => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "brush-button";
        button.dataset.brush = id;
        button.innerHTML = `<span class="brush-icon brush-icon-${id}"></span><small>${BRUSHES[id].label}</small>`;
        button.addEventListener("click", () => this.setBrush(id));
        brushRail.appendChild(button);
      });
      this.setBrush(this.brushId);

      const swatchGrid = $("swatchGrid");
      SWATCHES.forEach(hex => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "swatch";
        button.style.setProperty("--swatch-color", hex);
        button.addEventListener("click", () => this.setColor(hex));
        swatchGrid.appendChild(button);
      });

      this.initColorWheel();

      $("sizeSlider").addEventListener("input", e => {
        this.baseSize = Number(e.target.value);
        $("sizeValue").textContent = this.baseSize;
        this.refreshBrushCursor();
      });
      $("opacitySlider").addEventListener("input", e => {
        this.opacitySetting = Number(e.target.value) / 100;
        $("opacityValue").textContent = e.target.value;
      });
      $("scatterSlider").addEventListener("input", e => {
        this.scatter = Number(e.target.value) / 100;
        $("scatterValue").textContent = e.target.value;
      });
      $("stabilizeSlider").addEventListener("input", e => {
        this.stabilization = Number(e.target.value);
        $("stabilizeValue").textContent = this.stabilization;
      });
      $("alphaLockToggle").addEventListener("change", e => {
        this.alphaLock = e.target.checked;
      });
      $("eyedropperBtn").addEventListener("click", () => this.armEyedropper());

      $("undoBtn").addEventListener("click", () => this.undo());
      $("redoBtn").addEventListener("click", () => this.redo());
      $("addLayerBtn").addEventListener("click", () => this.addLayer());
      $("saveBtn").addEventListener("click", () => {
        if (this.flipbook) this.saveGif(); else this.savePng();
      });
      $("clearBtn").addEventListener("click", () => this.clearActiveLayer());

      $("flipbookBtn").addEventListener("click", () => {
        if (this.flipbook) this.exitFlipbook(); else this.enterFlipbook();
      });
      $("playBtn").addEventListener("click", () => {
        if (this.playing) this.stopPlayback(); else this.startPlayback();
      });
      $("fpsSlider").addEventListener("input", e => {
        this.fps = Number(e.target.value);
        $("fpsValue").textContent = this.fps;
        if (this.playing) { this.stopPlayback(); this.startPlayback(); }
      });
      $("onionToggle").addEventListener("change", e => {
        this.onionSkin = e.target.checked;
        this.composite();
      });
      $("addFrameBtn").addEventListener("click", () => this.addFrame(false));
      $("dupFrameBtn").addEventListener("click", () => this.addFrame(true));
      $("delFrameBtn").addEventListener("click", () => this.deleteFrame());
      $("frameLeftBtn").addEventListener("click", () => this.moveFrame(-1));
      $("frameRightBtn").addEventListener("click", () => this.moveFrame(1));

      window.addEventListener("keydown", e => {
        if (this.flipbook && !e.ctrlKey && !e.metaKey && !e.altKey
          && (e.key === "ArrowLeft" || e.key === "ArrowRight")
          && !(e.target instanceof HTMLElement && e.target.closest("input:not([type=range]):not([type=checkbox]), select, textarea, dialog"))) {
          e.preventDefault();
          this.stopPlayback();
          this.setFrame(this.frameIndex + (e.key === "ArrowLeft" ? -1 : 1));
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
          e.preventDefault();
          if (e.shiftKey) this.redo(); else this.undo();
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
          e.preventDefault();
          this.redo();
        }
      });

      document.querySelectorAll(".info-icon").forEach(button => {
        button.addEventListener("click", event => {
          event.stopPropagation();
          const wrap = button.closest(".info-wrap");
          const wasOpen = wrap.classList.contains("open");
          document.querySelectorAll(".info-wrap.open").forEach(open => open.classList.remove("open"));
          if (!wasOpen) wrap.classList.add("open");
        });
      });
      document.addEventListener("click", () => {
        document.querySelectorAll(".info-wrap.open").forEach(open => open.classList.remove("open"));
      });
    }

    initColorWheel() {
      const canvas = $("colorWheel");
      const ctx = canvas.getContext("2d");
      const size = canvas.width;
      const center = size / 2;
      const radius = center - 2;
      const image = ctx.createImageData(size, size);
      for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
          const dx = x - center;
          const dy = y - center;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const idx = (y * size + x) * 4;
          if (dist > radius) continue;
          let angle = Math.atan2(dy, dx) * 180 / Math.PI;
          if (angle < 0) angle += 360;
          const sat = Math.min(1, dist / radius);
          const hex = hsvToHex(angle, sat, 1);
          const rgb = hexToRgb(hex);
          image.data[idx] = rgb.r;
          image.data[idx + 1] = rgb.g;
          image.data[idx + 2] = rgb.b;
          image.data[idx + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);

      const pick = event => {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width * size;
        const y = (event.clientY - rect.top) / rect.height * size;
        const dx = x - center;
        const dy = y - center;
        const dist = Math.min(radius, Math.sqrt(dx * dx + dy * dy));
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        if (angle < 0) angle += 360;
        const sat = dist / radius;
        const hex = hsvToHex(angle, sat, 1);
        this.setColor(hex);
      };
      canvas.addEventListener("pointerdown", event => {
        try { canvas.setPointerCapture(event.pointerId); } catch { /* no active pointer to capture */ }
        pick(event);
        const onMove = moveEvent => pick(moveEvent);
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerup", () => canvas.removeEventListener("pointermove", onMove), { once: true });
      });
    }

    setBrush(id) {
      this.brushId = id;
      document.querySelectorAll(".brush-button").forEach(button => {
        button.classList.toggle("active", button.dataset.brush === id);
      });
      const brush = BRUSHES[id];
      const [min, max] = brush.sizeRange;
      this.baseSize = Math.round((min + max) / 2);
      $("sizeSlider").min = String(Math.max(1, Math.round(min * 0.5)));
      $("sizeSlider").max = String(Math.round(max * 1.4));
      $("sizeSlider").value = String(this.baseSize);
      $("sizeValue").textContent = this.baseSize;
      this.refreshBrushCursor();
    }

    setColor(hex) {
      this.color = hex;
      $("activeColorPreview").style.setProperty("--active-color", hex);
      document.querySelectorAll(".swatch").forEach(button => {
        button.classList.toggle("active", button.style.getPropertyValue("--swatch-color").trim() === hex);
      });
      this.refreshBrushCursor();
    }

    refreshBrushCursor() {
      if (this.lastCursorEvent) this.updateBrushCursor(this.lastCursorEvent);
    }

    armEyedropper() {
      this.eyedropperArmed = true;
      this.displayCanvas.classList.add("eyedropper-mode");
      this.hideBrushCursor();
    }

    pickColorAt(event) {
      const rect = this.displayCanvas.getBoundingClientRect();
      const x = Math.round((event.clientX - rect.left) / rect.width * CANVAS_W);
      const y = Math.round((event.clientY - rect.top) / rect.height * CANVAS_H);
      const pixel = this.displayCtx.getImageData(x, y, 1, 1).data;
      const hex = `#${[pixel[0], pixel[1], pixel[2]].map(n => n.toString(16).padStart(2, "0")).join("")}`;
      this.setColor(hex);
      this.eyedropperArmed = false;
      this.displayCanvas.classList.remove("eyedropper-mode");
    }

    // ---------- Layers ----------
    renderLayerPanel() {
      const panel = $("layerPanel");
      panel.innerHTML = "";
      for (let i = this.layers.length - 1; i >= 0; i -= 1) {
        const layer = this.layers[i];
        const row = document.createElement("div");
        row.className = `layer-row${i === this.activeLayerIndex ? " active" : ""}`;
        row.innerHTML = `
          <button type="button" class="layer-visible" aria-label="레이어 보이기/숨기기">${layer.visible ? "👁" : "🚫"}</button>
          <span class="layer-name">${layer.name}</span>
          <input type="range" class="layer-opacity" min="0" max="100" value="${Math.round(layer.opacity * 100)}">
          ${this.layers.length > 1 && !this.flipbook ? '<button type="button" class="layer-remove" aria-label="레이어 삭제">✕</button>' : ""}
        `;
        row.querySelector(".layer-name").addEventListener("click", () => {
          this.activeLayerIndex = i;
          this.renderLayerPanel();
        });
        row.querySelector(".layer-visible").addEventListener("click", () => {
          layer.visible = !layer.visible;
          this.renderLayerPanel();
          this.composite();
          this.refreshThumbs(layer);
        });
        row.querySelector(".layer-opacity").addEventListener("input", e => {
          layer.opacity = Number(e.target.value) / 100;
          this.composite();
        });
        row.querySelector(".layer-opacity").addEventListener("change", () => this.refreshThumbs(layer));
        const removeBtn = row.querySelector(".layer-remove");
        if (removeBtn) {
          removeBtn.addEventListener("click", () => this.removeLayer(i));
        }
        panel.appendChild(row);
      }
    }

    addLayer() {
      if (this.flipbook || this.layers.length >= MAX_LAYERS) return;
      this.layers.push(new Layer(`레이어 ${this.layers.length + 1}`));
      this.activeLayerIndex = this.layers.length - 1;
      this.renderLayerPanel();
      this.composite();
    }

    removeLayer(index) {
      if (this.flipbook || this.layers.length <= 1) return;
      const [removed] = this.layers.splice(index, 1);
      this.forgetLayerHistory(removed);
      this.activeLayerIndex = Math.min(this.activeLayerIndex, this.layers.length - 1);
      this.renderLayerPanel();
      this.composite();
    }

    forgetLayerHistory(layer) {
      this.actionLog = this.actionLog.filter(a => a.layer !== layer);
      this.redoLog = this.redoLog.filter(a => a.layer !== layer);
      this.updateHistoryButtons();
    }

    clearActiveLayer() {
      const layer = this.layers[this.activeLayerIndex];
      layer.ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      layer.strokes = [];
      layer.snapshots = [];
      layer.version += 1;
      this.forgetLayerHistory(layer);
      this.composite();
      this.refreshThumbs(layer);
    }

    // ---------- Flipbook ----------
    // In flipbook mode layers[0] is a background shared by every page and
    // layers[1] is always the current page's own layer.
    enterFlipbook() {
      if (this.flipbook) return;
      const background = this.layers[0];
      let pageLayer;
      if (this.layers.length === 2) {
        pageLayer = this.layers[1];
      } else {
        pageLayer = new Layer("1장");
        if (this.layers.length > 2) {
          // Three layers flatten into one page; their undo history cannot follow.
          this.layers.slice(1).forEach(layer => {
            if (!layer.visible) return;
            pageLayer.ctx.globalAlpha = layer.opacity;
            pageLayer.ctx.drawImage(layer.canvas, 0, 0);
            this.forgetLayerHistory(layer);
          });
          pageLayer.ctx.globalAlpha = 1;
          pageLayer.snapshots = [{ index: 0, data: pageLayer.ctx.getImageData(0, 0, CANVAS_W, CANVAS_H) }];
        }
      }
      background.name = "배경 (모든 장)";
      this.flipbook = true;
      this.frames = [new Frame(pageLayer)];
      this.frameIndex = 0;
      this.layers = [background, pageLayer];
      this.activeLayerIndex = 1;
      $("flipbookBtn").setAttribute("aria-pressed", "true");
      $("flipStrip").hidden = false;
      $("addLayerBtn").disabled = true;
      $("saveBtn").textContent = "GIF 저장";
      this.syncFrameNames();
      this.renderLayerPanel();
      this.renderFrameList();
      this.updateStageScale();
      this.composite();
    }

    exitFlipbook() {
      if (!this.flipbook) return;
      if (this.frames.length > 1 && !window.confirm("지금 보이는 장만 남고 나머지 장은 사라져요. 플립북을 끌까요?")) return;
      this.stopPlayback();
      const keep = this.frames[this.frameIndex].layer;
      this.frames.forEach(frame => { if (frame.layer !== keep) this.forgetLayerHistory(frame.layer); });
      this.frames = [];
      this.flipbook = false;
      this.layers[0].name = "배경";
      keep.name = "레이어 2";
      this.layers = [this.layers[0], keep];
      this.activeLayerIndex = Math.min(this.activeLayerIndex, 1);
      $("flipbookBtn").setAttribute("aria-pressed", "false");
      $("flipStrip").hidden = true;
      $("addLayerBtn").disabled = false;
      $("saveBtn").textContent = "저장";
      this.renderLayerPanel();
      this.updateStageScale();
      this.composite();
    }

    syncFrameNames() {
      this.frames.forEach((frame, i) => { frame.layer.name = `${i + 1}장`; });
    }

    setFrame(index) {
      if (!this.flipbook || this.activeStroke) return;
      const next = Math.max(0, Math.min(this.frames.length - 1, index));
      this.frameIndex = next;
      this.layers[1] = this.frames[next].layer;
      this.renderLayerPanel();
      this.renderFrameList();
      this.composite();
    }

    addFrame(copyCurrent) {
      if (!this.flipbook || this.frames.length >= MAX_FRAMES) return;
      this.stopPlayback();
      const layer = new Layer("");
      if (copyCurrent) {
        const source = this.frames[this.frameIndex].layer;
        layer.ctx.drawImage(source.canvas, 0, 0);
        layer.strokes = source.strokes.slice();
        layer.snapshots = source.snapshots.slice();
        layer.opacity = source.opacity;
        layer.visible = source.visible;
      }
      this.frames.splice(this.frameIndex + 1, 0, new Frame(layer));
      this.syncFrameNames();
      this.setFrame(this.frameIndex + 1);
      this.scrollActiveThumb();
    }

    deleteFrame() {
      if (!this.flipbook || this.frames.length <= 1) return;
      this.stopPlayback();
      const [removed] = this.frames.splice(this.frameIndex, 1);
      this.forgetLayerHistory(removed.layer);
      this.syncFrameNames();
      this.setFrame(Math.min(this.frameIndex, this.frames.length - 1));
    }

    moveFrame(delta) {
      const target = this.frameIndex + delta;
      if (!this.flipbook || target < 0 || target >= this.frames.length) return;
      this.stopPlayback();
      const [frame] = this.frames.splice(this.frameIndex, 1);
      this.frames.splice(target, 0, frame);
      this.syncFrameNames();
      this.setFrame(target);
      this.scrollActiveThumb();
    }

    renderFrameList() {
      const list = $("frameList");
      list.innerHTML = "";
      this.frames.forEach((frame, i) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `frame-thumb${i === this.frameIndex ? " active" : ""}`;
        button.setAttribute("aria-label", `${i + 1}장 열기`);
        this.drawThumb(frame);
        button.appendChild(frame.thumb);
        const num = document.createElement("span");
        num.className = "frame-num";
        num.textContent = i + 1;
        button.appendChild(num);
        button.addEventListener("click", () => {
          this.stopPlayback();
          this.setFrame(i);
        });
        list.appendChild(button);
      });
      $("delFrameBtn").disabled = this.frames.length <= 1;
      $("addFrameBtn").disabled = $("dupFrameBtn").disabled = this.frames.length >= MAX_FRAMES;
      $("frameLeftBtn").disabled = this.frameIndex === 0;
      $("frameRightBtn").disabled = this.frameIndex === this.frames.length - 1;
    }

    scrollActiveThumb() {
      const active = $("frameList").querySelector(".frame-thumb.active");
      if (active) active.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    drawThumb(frame) {
      const thumb = frame.thumb;
      const w = THUMB_W;
      const h = Math.max(1, Math.round(THUMB_W * this.viewH / this.viewW));
      if (thumb.width !== w || thumb.height !== h) { thumb.width = w; thumb.height = h; }
      this.renderPage(thumb.getContext("2d"), frame.layer, w, h);
    }

    // Background + one page, cropped to the current paper size, into ctx (w x h).
    renderPage(ctx, pageLayer, w, h) {
      ctx.save();
      ctx.fillStyle = PAPER_COLOR;
      ctx.fillRect(0, 0, w, h);
      [this.layers[0], pageLayer].forEach(layer => {
        if (!layer.visible) return;
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(layer.canvas, 0, 0, this.viewW, this.viewH, 0, 0, w, h);
      });
      ctx.restore();
    }

    // Redraw previews after `layer` changed (the background touches all of them).
    refreshThumbs(layer) {
      if (!this.flipbook) return;
      this.frames.forEach(frame => {
        if (!layer || layer === this.layers[0] || frame.layer === layer) this.drawThumb(frame);
      });
    }

    startPlayback() {
      if (!this.flipbook || this.playing || this.frames.length < 2) return;
      this.playing = true;
      this.playIndex = this.frameIndex;
      $("playBtn").textContent = "■ 멈춤";
      $("playBtn").classList.add("playing");
      this.hideBrushCursor();
      this.playTimer = setInterval(() => {
        this.playIndex = (this.playIndex + 1) % this.frames.length;
        $("frameList").querySelectorAll(".frame-thumb").forEach((el, i) => {
          el.classList.toggle("playing", i === this.playIndex);
        });
        this.composite();
      }, 1000 / this.fps);
      this.composite();
    }

    stopPlayback() {
      if (!this.playing) return;
      clearInterval(this.playTimer);
      this.playTimer = null;
      this.playing = false;
      $("playBtn").textContent = "▶ 재생";
      $("playBtn").classList.remove("playing");
      $("frameList").querySelectorAll(".frame-thumb.playing").forEach(el => el.classList.remove("playing"));
      this.composite();
    }

    // Previous page tinted red, cached until that page changes.
    onionLayerCanvas() {
      const prev = this.frames[this.frameIndex - 1].layer;
      const key = `${prev.id}:${prev.version}`;
      if (key !== this.onionKey) {
        const ctx = this.onionCtx;
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(prev.canvas, 0, 0);
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = "#e2533b";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.globalCompositeOperation = "source-over";
        this.onionKey = key;
      }
      return this.onionCanvas;
    }

    // ---------- Compositing ----------
    composite() {
      const ctx = this.displayCtx;
      if (this.flipbook && this.playing) {
        this.renderPage(ctx, this.frames[this.playIndex].layer, this.viewW, this.viewH);
        return;
      }
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = PAPER_COLOR;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      this.layers.forEach((layer, index) => {
        if (this.flipbook && index === 1 && this.onionSkin && this.frameIndex > 0) {
          ctx.globalAlpha = 0.3;
          ctx.drawImage(this.onionLayerCanvas(), 0, 0);
        }
        if (!layer.visible) return;
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(layer.canvas, 0, 0);
        if (this.activeStroke && index === this.activeLayerIndex) {
          ctx.drawImage(this.scratchCanvas, 0, 0);
        }
      });
      ctx.globalAlpha = 1;
    }

    // ---------- Pointer / drawing ----------
    bindCanvas() {
      const canvas = this.displayCanvas;
      canvas.addEventListener("pointerdown", e => this.beginStroke(e));
      canvas.addEventListener("pointermove", e => { this.moveStroke(e); this.updateBrushCursor(e); });
      canvas.addEventListener("pointerup", e => this.endStroke(e));
      canvas.addEventListener("pointercancel", e => this.endStroke(e));
      canvas.addEventListener("pointerenter", e => this.updateBrushCursor(e));
      canvas.addEventListener("pointerleave", e => {
        if (e.pointerType === "mouse") this.endStroke(e);
        this.hideBrushCursor();
      });
      canvas.style.touchAction = "none";
    }

    bindResizeHandles() {
      document.querySelectorAll(".resize-handle").forEach(handle => {
        const dir = handle.dataset.dir;
        handle.addEventListener("pointerdown", event => {
          event.preventDefault();
          event.stopPropagation();
          try { handle.setPointerCapture(event.pointerId); } catch { /* no active pointer to capture */ }
          const startX = event.clientX;
          const startY = event.clientY;
          const startViewW = this.viewW;
          const startViewH = this.viewH;
          const frameRect = this.canvasFrameEl.getBoundingClientRect();
          const scale = frameRect.width / startViewW;

          const onMove = moveEvent => {
            const nextW = dir.includes("e") ? startViewW + (moveEvent.clientX - startX) / scale : startViewW;
            const nextH = dir.includes("s") ? startViewH + (moveEvent.clientY - startY) / scale : startViewH;
            this.setViewSize(nextW, nextH);
          };
          const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            this.refreshThumbs();
          };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp, { once: true });
        });
      });
    }

    // Screen pixels per buffer pixel: whatever makes the full 1000x700 sheet
    // fit the stage. Measured against the viewport (not the card) so the card
    // hugging its paper can never feed back into the scale it is sized from.
    updateStageScale() {
      const stage = this.canvasStageEl;
      if (!stage) return;
      const CARD_CHROME = 22; // 10px padding + 1px border on each side
      // The stage column hugs the paper, so measure it at full size first;
      // otherwise a sheet that once shrank could never grow back.
      this.canvasFrameEl.style.setProperty("--scale", "1");
      const top = stage.getBoundingClientRect().top;
      const availW = stage.clientWidth - CARD_CHROME;
      const strip = $("flipStrip");
      let scale = 1;
      // Two passes: the flipbook strip's height depends on the paper width.
      for (let pass = 0; pass < 2; pass += 1) {
        const stripH = strip && !strip.hidden ? strip.offsetHeight + 10 : 0;
        const availH = window.innerHeight - top - 24 - CARD_CHROME - stripH; // 24 = app-shell bottom padding
        if (availW <= 0 || availH <= 0) break;
        scale = Math.max(0.1, Math.min(availW / CANVAS_W, availH / CANVAS_H, 1));
        this.canvasFrameEl.style.setProperty("--scale", scale.toFixed(4));
      }
    }

    setViewSize(w, h) {
      this.viewW = Math.max(MIN_VIEW_W, Math.min(CANVAS_W, Math.round(w)));
      this.viewH = Math.max(MIN_VIEW_H, Math.min(CANVAS_H, Math.round(h)));
      this.canvasFrameEl.style.setProperty("--view-w", this.viewW);
      this.canvasFrameEl.style.setProperty("--view-h", this.viewH);
    }

    updateBrushCursor(event) {
      if (event.pointerType === "touch" || this.eyedropperArmed) { this.hideBrushCursor(); return; }
      this.lastCursorEvent = event;
      const rect = this.displayCanvas.getBoundingClientRect();
      const cssSize = Math.max(6, this.baseSize * 2 * (rect.width / CANVAS_W));
      const cursor = this.brushCursorEl;
      cursor.style.width = `${cssSize}px`;
      cursor.style.height = `${cssSize}px`;
      cursor.style.marginLeft = `${-cssSize / 2}px`;
      cursor.style.marginTop = `${-cssSize / 2}px`;
      cursor.style.left = `${event.clientX - rect.left}px`;
      cursor.style.top = `${event.clientY - rect.top}px`;
      cursor.style.setProperty("--active-cursor-color", this.brushId === "eraser" ? "#8a5a2c" : this.color);
      cursor.classList.toggle("eraser-cursor", this.brushId === "eraser");
      cursor.classList.remove("hidden");
    }

    hideBrushCursor() {
      this.brushCursorEl.classList.add("hidden");
    }

    canvasPoint(event) {
      const rect = this.displayCanvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) / rect.width * CANVAS_W,
        y: (event.clientY - rect.top) / rect.height * CANVAS_H,
        pressure: event.pressure > 0 && event.pointerType === "pen" ? event.pressure : null,
        t: event.timeStamp
      };
    }

    beginStroke(event) {
      if (event.button !== undefined && event.button !== 0 && event.pointerType === "mouse") return;
      event.preventDefault();
      if (this.playing) {
        this.stopPlayback();
        return;
      }
      if (this.eyedropperArmed) {
        this.pickColorAt(event);
        return;
      }
      this.pointerId = event.pointerId;
      try { this.displayCanvas.setPointerCapture?.(event.pointerId); } catch { /* no active pointer to capture */ }
      this.scratchCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      this.rawBuffer = [];
      this.lastStampPoint = null;
      this.lastMovePoint = null;
      this.lastMoveTime = event.timeStamp;
      this.activeStroke = { brushId: this.brushId, color: this.color, stamps: [] };
      this.processPoint(this.canvasPoint(event));
    }

    moveStroke(event) {
      if (!this.activeStroke || event.pointerId !== this.pointerId) return;
      event.preventDefault();
      const events = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];
      const points = events.length ? events : [event];
      for (const rawEvent of points) {
        this.processPoint(this.canvasPoint(rawEvent));
      }
    }

    processPoint(point) {
      this.rawBuffer.push(point);
      const bufferSize = this.stabilization * 3 + 1;
      if (this.rawBuffer.length > bufferSize) this.rawBuffer.shift();
      const smoothed = this.rawBuffer.reduce((acc, p) => ({ x: acc.x + p.x / this.rawBuffer.length, y: acc.y + p.y / this.rawBuffer.length }), { x: 0, y: 0 });

      let speed = 0;
      if (this.lastMovePoint) {
        const dt = Math.max(8, point.t - this.lastMoveTime);
        const dist = Math.hypot(point.x - this.lastMovePoint.x, point.y - this.lastMovePoint.y);
        speed = dist / dt;
      }
      this.lastMovePoint = point;
      this.lastMoveTime = point.t;

      if (this.lastStampPoint) {
        const gap = Math.hypot(smoothed.x - this.lastStampPoint.x, smoothed.y - this.lastStampPoint.y);
        if (gap < MIN_POINT_GAP) return;
      }

      const brush = BRUSHES[this.activeStroke.brushId];
      const [minSize, maxSize] = brush.sizeRange;
      let widthRatio = 1;
      if (point.pressure !== null) {
        widthRatio = 0.35 + point.pressure * 0.75;
      } else {
        const speedFactor = Math.min(1, speed / 1.4);
        widthRatio = 1 - speedFactor * 0.45;
      }
      const size = Math.max(minSize * 0.4, Math.min(maxSize, this.baseSize * widthRatio));

      const spacing = Math.max(1.2, size * brush.spacingRatio);
      const from = this.lastStampPoint || smoothed;
      const dist = Math.hypot(smoothed.x - from.x, smoothed.y - from.y);
      const steps = this.lastStampPoint ? Math.max(1, Math.floor(dist / spacing)) : 1;

      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps;
        const x = from.x + (smoothed.x - from.x) * t;
        const y = from.y + (smoothed.y - from.y) * t;
        this.stampAt(x, y, size, brush);
      }
      this.lastStampPoint = smoothed;
      this.composite();
    }

    stampAt(x, y, size, brush) {
      const scatterAmount = this.scatter * size * 0.9;
      const jx = x + (Math.random() * 2 - 1) * scatterAmount;
      const jy = y + (Math.random() * 2 - 1) * scatterAmount;
      const rot = (Math.random() * 2 - 1) * Math.PI * this.scatter;
      const alpha = brush.baseOpacity * this.opacitySetting * (1 - Math.random() * brush.jitterAlpha);

      const stamp = { x: jx, y: jy, size, rot, alpha };
      this.activeStroke.stamps.push(stamp);
      const isEraser = this.activeStroke.brushId === "eraser";
      const targetCtx = isEraser ? this.layers[this.activeLayerIndex].ctx : this.scratchCtx;
      this.drawStamp(targetCtx, this.activeStroke.brushId, this.activeStroke.color, stamp);
    }

    drawStamp(ctx, brushId, color, stamp) {
      const brush = BRUSHES[brushId];
      const alpha = Math.max(0, Math.min(1, stamp.alpha));

      if (brush.compositeMode === "destination-out") {
        // Erasing only ever removes alpha where the tip itself has alpha, so it is
        // safe to draw straight onto the destination without a masking pass.
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = alpha;
        ctx.translate(stamp.x, stamp.y);
        ctx.rotate(stamp.rot);
        ctx.drawImage(brush.tip, -stamp.size, -stamp.size, stamp.size * 2, stamp.size * 2);
        ctx.restore();
        return;
      }

      // "destination-in" clips the WHOLE destination canvas to the drawn shape's alpha,
      // not just the area under the shape - masking a colored square to the brush tip
      // must happen on a small scratch stamp first, then be composited in one call so
      // earlier stamps already on the destination are never wiped out.
      const dim = Math.max(1, Math.ceil(stamp.size * 2));
      this.stampCanvas.width = dim;
      this.stampCanvas.height = dim;
      const sctx = this.stampCtx;
      sctx.save();
      sctx.translate(dim / 2, dim / 2);
      sctx.rotate(stamp.rot);
      sctx.fillStyle = color;
      sctx.fillRect(-stamp.size, -stamp.size, stamp.size * 2, stamp.size * 2);
      sctx.globalCompositeOperation = "destination-in";
      sctx.drawImage(brush.tip, -stamp.size, -stamp.size, stamp.size * 2, stamp.size * 2);
      sctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = brush.compositeMode;
      ctx.globalAlpha = alpha;
      ctx.drawImage(this.stampCanvas, stamp.x - dim / 2, stamp.y - dim / 2);
      ctx.restore();
    }

    endStroke(event) {
      if (!this.activeStroke || event.pointerId !== this.pointerId) return;
      event.preventDefault();
      this.pointerId = null;
      const stroke = this.activeStroke;
      this.activeStroke = null;
      if (!stroke.stamps.length) {
        this.scratchCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        this.composite();
        return;
      }
      this.commitStroke(stroke);
    }

    commitStroke(stroke) {
      const layer = this.layers[this.activeLayerIndex];
      const layerCtx = layer.ctx;

      if (stroke.brushId !== "eraser") {
        if (this.alphaLock) {
          this.scratchCtx.save();
          this.scratchCtx.globalCompositeOperation = "source-in";
          this.scratchCtx.drawImage(layer.canvas, 0, 0);
          this.scratchCtx.restore();
        }
        layerCtx.drawImage(this.scratchCanvas, 0, 0);
      }
      this.scratchCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      layer.snapshots = layer.snapshots.filter(s => s.index <= layer.strokes.length);
      layer.strokes.push(stroke);
      if (layer.strokes.length % SNAPSHOT_INTERVAL === 0) {
        layer.snapshots.push({
          index: layer.strokes.length,
          data: layerCtx.getImageData(0, 0, CANVAS_W, CANVAS_H)
        });
      }

      layer.version += 1;
      this.actionLog.push({ layer, stroke });
      this.redoLog = [];
      this.updateHistoryButtons();
      this.composite();
      this.refreshThumbs(layer);
    }

    // Undo/redo of another page's stroke first turns to that page.
    showLayerOf(layer) {
      if (!this.flipbook || layer === this.layers[0]) return;
      this.stopPlayback();
      const index = this.frames.findIndex(frame => frame.layer === layer);
      if (index >= 0 && index !== this.frameIndex) {
        this.setFrame(index);
        this.scrollActiveThumb();
      }
    }

    // ---------- Undo / redo ----------
    rebuildLayer(layer, targetLength) {
      const ctx = layer.ctx;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      let startIndex = 0;
      const snapshot = [...layer.snapshots].reverse().find(s => s.index <= targetLength);
      if (snapshot) {
        ctx.putImageData(snapshot.data, 0, 0);
        startIndex = snapshot.index;
      }
      for (let i = startIndex; i < targetLength; i += 1) {
        const stroke = layer.strokes[i];
        stroke.stamps.forEach(stamp => this.drawStamp(ctx, stroke.brushId, stroke.color, stamp));
      }
    }

    undo() {
      const action = this.actionLog.pop();
      if (!action || this.activeStroke) { if (action) this.actionLog.push(action); return; }
      const layer = action.layer;
      this.showLayerOf(layer);
      layer.strokes.pop();
      this.rebuildLayer(layer, layer.strokes.length);
      layer.version += 1;
      this.redoLog.push(action);
      this.updateHistoryButtons();
      this.composite();
      this.refreshThumbs(layer);
    }

    redo() {
      const action = this.redoLog.pop();
      if (!action || this.activeStroke) { if (action) this.redoLog.push(action); return; }
      const layer = action.layer;
      this.showLayerOf(layer);
      layer.version += 1;
      layer.strokes.push(action.stroke);
      action.stroke.stamps.forEach(stamp => this.drawStamp(layer.ctx, action.stroke.brushId, action.stroke.color, stamp));
      if (layer.strokes.length % SNAPSHOT_INTERVAL === 0) {
        layer.snapshots.push({
          index: layer.strokes.length,
          data: layer.ctx.getImageData(0, 0, CANVAS_W, CANVAS_H)
        });
      }
      this.actionLog.push(action);
      this.updateHistoryButtons();
      this.composite();
      this.refreshThumbs(layer);
    }

    updateHistoryButtons() {
      $("undoBtn").disabled = !this.actionLog.length;
      $("redoBtn").disabled = !this.redoLog.length;
    }

    // ---------- Save ----------
    // Returns "이름제목" for the download, or null (and nudges) when untitled.
    exportBaseName() {
      const titleInput = $("drawingTitle");
      if (!titleInput.value.trim()) {
        titleInput.focus();
        titleInput.classList.remove("shake-warning");
        void titleInput.offsetWidth;
        titleInput.classList.add("shake-warning");
        return null;
      }
      const fileSafe = (value, fallback) => {
        const cleaned = String(value || "").trim().replace(/[\\/:*?"<>|]/g, "");
        return cleaned.slice(0, 20) || fallback;
      };
      return `${fileSafe(this.playerName, "이름없음")}${fileSafe(titleInput.value, "제목없음")}`;
    }

    downloadBlob(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    savePng() {
      const baseName = this.exportBaseName();
      if (!baseName) return;
      this.composite();
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = this.viewW;
      exportCanvas.height = this.viewH;
      exportCanvas.getContext("2d").drawImage(
        this.displayCanvas, 0, 0, this.viewW, this.viewH, 0, 0, this.viewW, this.viewH
      );
      exportCanvas.toBlob(blob => this.downloadBlob(blob, `${baseName}.png`), "image/png");
    }

    async buildGifBlob(onProgress) {
      this.stopPlayback();
      const scale = Math.min(1, GIF_MAX_SIDE / Math.max(this.viewW, this.viewH));
      const w = Math.max(1, Math.round(this.viewW * scale));
      const h = Math.max(1, Math.round(this.viewH * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const images = this.frames.map(frame => {
        this.renderPage(ctx, frame.layer, w, h);
        return ctx.getImageData(0, 0, w, h);
      });
      return window.encodeGif({ width: w, height: h, frames: images, delayMs: 1000 / this.fps, onProgress });
    }

    // For the board upload: the drawing as WebP (PNG fallback), or the flipbook as GIF.
    async buildUploadBlob(onProgress) {
      if (this.flipbook && this.frames.length > 1) return this.buildGifBlob(onProgress);
      if (this.flipbook) this.stopPlayback();
      this.composite();
      const canvas = document.createElement("canvas");
      canvas.width = this.viewW;
      canvas.height = this.viewH;
      canvas.getContext("2d").drawImage(this.displayCanvas, 0, 0, this.viewW, this.viewH, 0, 0, this.viewW, this.viewH);
      const toBlob = (type, quality) => new Promise(resolve => canvas.toBlob(resolve, type, quality));
      const webp = await toBlob("image/webp", 0.92);
      return webp && webp.type === "image/webp" ? webp : toBlob("image/png");
    }

    async saveGif() {
      if (this.exporting) return;
      const baseName = this.exportBaseName();
      if (!baseName) return;
      const saveBtn = $("saveBtn");
      this.exporting = true;
      saveBtn.disabled = true;
      saveBtn.textContent = "만드는 중…";
      try {
        const blob = await this.buildGifBlob(p => { saveBtn.textContent = `만드는 중 ${Math.round(p * 100)}%`; });
        this.downloadBlob(blob, `${baseName}.gif`);
      } finally {
        this.exporting = false;
        saveBtn.disabled = false;
        saveBtn.textContent = this.flipbook ? "GIF 저장" : "저장";
      }
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    window.artStudio = new ArtStudio();
  });
})();
