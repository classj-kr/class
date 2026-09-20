(function () {
  "use strict";
  const FlowLayer = L.Layer.extend({
    initialize() {
      this.tracks = []; this.projected = []; this.seconds = 0; this.frames = 0;
      this.paused = false; this.suspended = false; this.visible = true; this.inView = true; this.dirty = true;
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
    setPaused(paused) { this.paused = paused; this.refresh(); },
    setSuspended(suspended) { this.suspended = suspended; this.refresh(); },
    setVisible(visible) { this.visible = visible; this.refresh(); },
    reset() { this.dirty = true; this.refresh(); },
    running() { return this.visible && this.inView && this.tracks.length && !this.paused && !this.suspended && !this.motion.matches && !document.hidden; },
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
      if (!this.lastDraw || time - this.lastDraw >= 50) { this.draw(); this.lastDraw = time; }
      this.raf = requestAnimationFrame(this._tick);
    },
    project() {
      const map = this._map, size = map.getSize(), ratio = Math.min(devicePixelRatio || 1, 2);
      this.size = size;
      this.canvas.width = Math.round(size.x * ratio); this.canvas.height = Math.round(size.y * ratio);
      this.canvas.style.width = size.x + "px"; this.canvas.style.height = size.y + "px";
      L.DomUtil.setPosition(this.canvas, map.containerPointToLayerPoint([0,0]));
      this.ctx.setTransform(ratio,0,0,ratio,0,0);
      this.projected = this.tracks.map(track => {
        const points = L.LineUtil.simplify(track.coordinates.map(([lng,lat]) => map.latLngToContainerPoint([lat,lng])), .5);
        const distances = [0];
        for (let i=1;i<points.length;i++) distances.push(distances[i-1] + points[i].distanceTo(points[i-1]));
        return { ...track, points, distances, length: distances.at(-1) };
      }).filter(track => track.length > 1);
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
    draw() {
      if (this.dirty) this.project();
      const ctx=this.ctx, size=this.size;
      ctx.clearRect(0,0,size.x,size.y);
      let count=0; const limit=size.x<600 ? 180 : 420;
      for (const track of this.projected) {
        const wind=track.kind==="wind";
        const spacing=wind ? 82 : 66;
        const offset=(this.seconds*(wind?34:24))%spacing;
        // Keep an entire track continuous. All position samples follow its ordered coordinates.
        for (let distance=offset+12;distance<track.length;distance+=spacing) {
          const head=this.sample(track,distance);
          if (head.x < -35 || head.y < -35 || head.x>size.x+35 || head.y>size.y+35) continue;
          if (++count>limit) break;
          ctx.save();
          const color=wind ? (track.season==="summer"?"#efffc8":"#effcff") : track.selected?"#fff6a1":"#c8faff";
          const edge=wind ? (track.season==="summer"?"#456a2d":"#306280") : "#08699a";
          ctx.lineCap="round"; ctx.lineJoin="round";
          for (const lane of (wind?[-4,0,4]:[0])) {
            ctx.beginPath();
            for(let back=wind?32:20;back>=0;back-=4) {
              const point=this.sample(track,distance-back);
              const x=point.x-Math.sin(point.angle)*lane, y=point.y+Math.cos(point.angle)*lane;
              if(back===(wind?32:20)) ctx.moveTo(x,y); else ctx.lineTo(x,y);
            }
            ctx.strokeStyle=edge; ctx.lineWidth=wind?4:5; ctx.globalAlpha=.5; ctx.stroke();
            ctx.strokeStyle=color; ctx.lineWidth=wind?2:2.7; ctx.globalAlpha=wind?.9:1; ctx.stroke();
          }
          ctx.translate(head.x,head.y); ctx.rotate(head.angle);
          ctx.beginPath();ctx.moveTo(-5,-3);ctx.lineTo(1,0);ctx.lineTo(-5,3);
          ctx.strokeStyle=color;ctx.lineWidth=wind?2.1:2.4;ctx.globalAlpha=1;ctx.stroke();
          ctx.restore();
        }
        if(count>limit) break;
      }
      this.frames++;
      this.canvas.dataset.frames=String(this.frames);
      this.canvas.dataset.phase=this.seconds.toFixed(3);
      this.canvas.dataset.particles=String(Math.min(count,limit));
      this.canvas.dataset.tracks=String(this.projected.length);
      this.canvas.dataset.state=this.running()?"running":"paused";
    }
  });
  window.KoreaFlowLayer = { create: () => new FlowLayer() };
})();
