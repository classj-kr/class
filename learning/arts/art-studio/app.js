"use strict";
(() => {
  const CANVAS_W = 1000;
  const CANVAS_H = 700;
  const MIN_VIEW_W = 200;
  const MIN_VIEW_H = 150;
  const MAX_LAYERS = 3;
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
      $("saveBtn").addEventListener("click", () => this.savePng());
      $("clearBtn").addEventListener("click", () => this.clearActiveLayer());

      window.addEventListener("keydown", e => {
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
          ${this.layers.length > 1 ? '<button type="button" class="layer-remove" aria-label="레이어 삭제">✕</button>' : ""}
        `;
        row.querySelector(".layer-name").addEventListener("click", () => {
          this.activeLayerIndex = i;
          this.renderLayerPanel();
        });
        row.querySelector(".layer-visible").addEventListener("click", () => {
          layer.visible = !layer.visible;
          this.renderLayerPanel();
          this.composite();
        });
        row.querySelector(".layer-opacity").addEventListener("input", e => {
          layer.opacity = Number(e.target.value) / 100;
          this.composite();
        });
        const removeBtn = row.querySelector(".layer-remove");
        if (removeBtn) {
          removeBtn.addEventListener("click", () => this.removeLayer(i));
        }
        panel.appendChild(row);
      }
    }

    addLayer() {
      if (this.layers.length >= MAX_LAYERS) return;
      this.layers.push(new Layer(`레이어 ${this.layers.length + 1}`));
      this.activeLayerIndex = this.layers.length - 1;
      this.renderLayerPanel();
      this.composite();
    }

    removeLayer(index) {
      if (this.layers.length <= 1) return;
      this.layers.splice(index, 1);
      this.activeLayerIndex = Math.min(this.activeLayerIndex, this.layers.length - 1);
      this.renderLayerPanel();
      this.composite();
    }

    clearActiveLayer() {
      const layer = this.layers[this.activeLayerIndex];
      layer.ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      layer.strokes = [];
      layer.snapshots = [];
      this.actionLog = this.actionLog.filter(a => a.layerIndex !== this.activeLayerIndex);
      this.redoLog = [];
      this.updateHistoryButtons();
      this.composite();
    }

    // ---------- Compositing ----------
    composite() {
      const ctx = this.displayCtx;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = "#fffdf6";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      this.layers.forEach((layer, index) => {
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
      const top = stage.getBoundingClientRect().top;
      const availW = stage.clientWidth - CARD_CHROME;
      const availH = window.innerHeight - top - 24 - CARD_CHROME; // 24 = app-shell bottom padding
      if (availW <= 0 || availH <= 0) return;
      const scale = Math.min(availW / CANVAS_W, availH / CANVAS_H, 1);
      this.canvasFrameEl.style.setProperty("--scale", Math.max(0.1, scale).toFixed(4));
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

      this.actionLog.push({ layerIndex: this.activeLayerIndex, stroke });
      this.redoLog = [];
      this.updateHistoryButtons();
      this.composite();
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
      if (!action) return;
      const layer = this.layers[action.layerIndex];
      layer.strokes.pop();
      this.rebuildLayer(layer, layer.strokes.length);
      this.redoLog.push(action);
      this.updateHistoryButtons();
      this.composite();
    }

    redo() {
      const action = this.redoLog.pop();
      if (!action) return;
      const layer = this.layers[action.layerIndex];
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
    }

    updateHistoryButtons() {
      $("undoBtn").disabled = !this.actionLog.length;
      $("redoBtn").disabled = !this.redoLog.length;
    }

    // ---------- Save ----------
    savePng() {
      const titleInput = $("drawingTitle");
      if (!titleInput.value.trim()) {
        titleInput.focus();
        titleInput.classList.remove("shake-warning");
        void titleInput.offsetWidth;
        titleInput.classList.add("shake-warning");
        return;
      }
      this.composite();
      const fileSafe = (value, fallback) => {
        const cleaned = String(value || "").trim().replace(/[\\/:*?"<>|]/g, "");
        return cleaned.slice(0, 20) || fallback;
      };
      const name = fileSafe(this.playerName, "이름없음");
      const title = fileSafe(titleInput.value, "제목없음");
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = this.viewW;
      exportCanvas.height = this.viewH;
      exportCanvas.getContext("2d").drawImage(
        this.displayCanvas, 0, 0, this.viewW, this.viewH, 0, 0, this.viewW, this.viewH
      );
      exportCanvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${name}${title}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, "image/png");
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    new ArtStudio();
  });
})();
