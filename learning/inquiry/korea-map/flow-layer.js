(function () {
  "use strict";
  // Copied verbatim from ../globe/app.js (DASH_STEPS / river-selected-flow).
  // The engine adapter below is Canvas; the frames, colours, widths and 50 ms cadence are the globe's.
  const DASH_STEPS = [
    [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0],
    [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2], [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5],
  ];
  const RIVER_STYLE = { baseColor:"#5cc0ff", baseWidth:3.2, flowColor:"#e6f6ff", flowWidth:2.4 };
  const FlowLayer = L.Layer.extend({
    initialize() {
      this.tracks = []; this.projected = []; this.seconds = 0; this.frames = 0;
      this.dashStep = 0;
      this.suspended = false; this.visible = true; this.inView = true; this.dirty = true;
      this.motion = matchMedia("(prefers-reduced-motion: reduce)");
      this._tick = this.tick.bind(this); this._reset = this.reset.bind(this);
      this._visibility = this.refresh.bind(this);
    },
    onAdd(map) {
      if (!map.getPane("geographyFlow")) {
        map.createPane("geographyFlow");
        map.getPane("geographyFlow").style.zIndex = "470";
        map.getPane("geographyFlow").style.pointerEvents = "none";
      }
      this.canvas = L.DomUtil.create("canvas", "geography-flow-canvas leaflet-zoom-hide", map.getPane("geographyFlow"));
      this.canvas.setAttribute("aria-hidden", "true");
      this.ctx = this.canvas.getContext("2d");
      map.on("move zoom resize viewreset", this._reset);
      document.addEventListener("visibilitychange", this._visibility);
      this.motion.addEventListener("change", this._visibility);
      this.intersection = new IntersectionObserver(entries => { this.inView = entries[0].isIntersecting; this.refresh(); });
      this.intersection.observe(map.getContainer());
      this.reset();
    },
    onRemove(map) {
      cancelAnimationFrame(this.raf); this.raf = 0;
      map.off("move zoom resize viewreset", this._reset);
      document.removeEventListener("visibilitychange", this._visibility);
      this.motion.removeEventListener("change", this._visibility);
      this.intersection.disconnect();
      this.canvas.remove();
    },
    setTracks(tracks) { this.tracks = tracks; this.dirty = true; this.refresh(); return this; },
    setSuspended(suspended) { this.suspended = suspended; this.refresh(); },
    setVisible(visible) { this.visible = visible; this.refresh(); },
    reset() { this.dirty = true; this.refresh(); },
    running() { return this.visible && this.inView && this.tracks.length && !this.suspended && !this.motion.matches && !document.hidden; },
    refresh() {
      if (!this._map || !this.canvas) return;
      this.canvas.hidden = !this.visible || this.suspended;
      cancelAnimationFrame(this.raf); this.raf = 0; this.lastTime = 0;
      if (this.visible && !this.suspended) this.draw();
      if (this.running()) this.raf = requestAnimationFrame(this._tick);
    },
    tick(time) {
      this.raf = 0;
      if (!this.running()) return;
      if (this.lastTime) this.seconds += Math.min(time - this.lastTime, 100) / 1000;
      this.lastTime = time;
      if (!this.lastDraw || time - this.lastDraw >= 50) {
        this.dashStep = (this.dashStep + 1) % DASH_STEPS.length;
        this.draw(); this.lastDraw = time;
      }
      this.raf = requestAnimationFrame(this._tick);
    },
    project() {
      const map = this._map, size = map.getSize(), ratio = Math.min(devicePixelRatio || 1, 2);
      this.size = size;
      this.canvas.width = Math.round(size.x * ratio); this.canvas.height = Math.round(size.y * ratio);
      this.canvas.style.width = size.x + "px"; this.canvas.style.height = size.y + "px";
      L.DomUtil.setPosition(this.canvas, map.containerPointToLayerPoint([0,0]));
      this.ctx.setTransform(ratio,0,0,ratio,0,0);
      this.waterPath = new Path2D();
      let waterSamples=0;
      this.projected = this.tracks.map(track => {
        const points = L.LineUtil.simplify(track.coordinates.map(([lng,lat]) => map.latLngToContainerPoint([lat,lng])), .5);
        const distances = [0];
        for (let i=1;i<points.length;i++) distances.push(distances[i-1] + points[i].distanceTo(points[i-1]));
        if (track.kind === "river") {
          // A continuous upstream-to-downstream path keeps the dash phase through every bend.
          points.forEach((point,index) => {
            if (!index) this.waterPath.moveTo(point.x,point.y);
            else this.waterPath.lineTo(point.x,point.y);
          });
          waterSamples+=points.length;
        }
        return { ...track, points, distances, length: distances.at(-1) };
      }).filter(track => track.length > 1);
      this.waterSamples=waterSamples;
      this.dirty = false;
    },
    sample(track, distance) {
      const at = Math.max(0,Math.min(track.length,distance));
      let low=1, high=track.distances.length-1;
      while(low<high) { const mid=(low+high)>>1; if(track.distances[mid]<at) low=mid+1; else high=mid; }
      const a=track.points[low-1], b=track.points[low];
      const t=(at-track.distances[low-1])/(track.distances[low]-track.distances[low-1] || 1);
      return { x:a.x+(b.x-a.x)*t, y:a.y+(b.y-a.y)*t, angle:Math.atan2(b.y-a.y,b.x-a.x) };
    },
    drawWater() {
      if (!this.waterSamples) return 0;
      const ctx=this.ctx, frame=DASH_STEPS[this.dashStep];
      ctx.save(); ctx.globalAlpha=1; ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.lineWidth=RIVER_STYLE.baseWidth; ctx.strokeStyle=RIVER_STYLE.baseColor;
      ctx.stroke(this.waterPath);
      ctx.globalCompositeOperation="source-atop";
      ctx.lineWidth=RIVER_STYLE.flowWidth; ctx.strokeStyle=RIVER_STYLE.flowColor;
      ctx.lineCap="butt"; // Same default as the globe flow layer, without round capsule ends.
      // MapLibre dash units are line widths. Canvas doubles odd arrays, so append a zero gap
      // to preserve the globe's seven-unit cycle instead of making a fourteen-unit cycle.
      const canvasFrame=frame.length%2 ? [...frame,0] : frame;
      ctx.setLineDash(canvasFrame.map(length=>length*RIVER_STYLE.flowWidth));
      ctx.stroke(this.waterPath);
      ctx.restore(); return this.waterSamples;
    },
    drawWind() {
      const ctx=this.ctx, size=this.size;
      let count=0; const limit=size.x<600 ? 180 : 420;
      for (const track of this.projected) {
        if (track.kind !== "wind") continue;
        const spacing=82;
        const offset=(this.seconds*34)%spacing;
        for (let distance=offset+12;distance<track.length;distance+=spacing) {
          const head=this.sample(track,distance);
          if (head.x < -35 || head.y < -35 || head.x>size.x+35 || head.y>size.y+35) continue;
          if (++count>limit) break;
          ctx.save();
          const color=track.season==="summer"?"#efffc8":"#effcff";
          const edge=track.season==="summer"?"#456a2d":"#306280";
          ctx.lineCap="round"; ctx.lineJoin="round";
          for (const lane of [-4,0,4]) {
            ctx.beginPath();
            for(let back=32;back>=0;back-=4) {
              const point=this.sample(track,distance-back);
              const x=point.x-Math.sin(point.angle)*lane, y=point.y+Math.cos(point.angle)*lane;
              if(back===32) ctx.moveTo(x,y); else ctx.lineTo(x,y);
            }
            ctx.strokeStyle=edge; ctx.lineWidth=4; ctx.globalAlpha=.5; ctx.stroke();
            ctx.strokeStyle=color; ctx.lineWidth=2; ctx.globalAlpha=.9; ctx.stroke();
          }
          ctx.translate(head.x,head.y); ctx.rotate(head.angle);
          ctx.beginPath();ctx.moveTo(-5,-3);ctx.lineTo(1,0);ctx.lineTo(-5,3);
          ctx.strokeStyle=color;ctx.lineWidth=2.1;ctx.globalAlpha=1;ctx.stroke();
          ctx.restore();
        }
        if(count>limit) break;
      }
      return Math.min(count,limit);
    },
    draw() {
      if (this.dirty) this.project();
      this.ctx.clearRect(0,0,this.size.x,this.size.y);
      const waterSamples=this.drawWater();
      const windParticles=this.drawWind();
      this.frames++;
      this.canvas.dataset.frames=String(this.frames);
      this.canvas.dataset.phase=this.seconds.toFixed(3);
      this.canvas.dataset.particles=String(windParticles);
      this.canvas.dataset.waterSamples=String(waterSamples);
      this.canvas.dataset.riverStyle="globe-dash";
      this.canvas.dataset.dashStep=String(this.dashStep);
      this.canvas.dataset.tracks=String(this.projected.length);
      this.canvas.dataset.state=this.running()?"running":"paused";
    }
  });
  window.KoreaFlowLayer = { create: () => new FlowLayer() };
})();
