/* Direction-based calligraphic nib: identical geometry at any speed or pressure. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./vendor/perfect-freehand.js'));
  else root.ClassJBrush = factory(root.PerfectFreehand);
})(globalThis, function (freehand) {
  'use strict';
  const angle = -Math.PI / 6;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  function outline(stroke, width, height, finished = true) {
    const size = stroke.width * Math.min(width, height) / 600;
    if (!stroke.points.length || size <= 0) return [];
    // Resample spatially. Event timing, reported pressure and pointer type never affect the shape.
    const source = stroke.points.map(p => [p.x * width, p.y * height]);
    const points = [source[0]];
    const step = Math.max(0.5, Math.min(1.25, size * 0.12));
    let carried = 0;
    for (let i = 1; i < source.length; i++) {
      const a = source[i - 1], b = source[i];
      const dx = b[0] - a[0], dy = b[1] - a[1], distance = Math.hypot(dx, dy);
      if (distance < 0.001) continue;
      for (let at = step - carried; at <= distance; at += step) {
        const t = at / distance;
        points.push([a[0] + dx * t, a[1] + dy * t]);
      }
      carried = (carried + distance) % step;
    }
    const end = source[source.length - 1], last = points[points.length - 1];
    if (Math.hypot(end[0] - last[0], end[1] - last[1]) > 0.01) points.push(end);
    // Local filtering softens small jitters without straightening letters or dragging the endpoint.
    const smooth = points.map((p, i) => {
      if (i === 0 || i === points.length - 1) return p;
      return [(points[i - 1][0] + p[0] * 2 + points[i + 1][0]) / 4,
              (points[i - 1][1] + p[1] * 2 + points[i + 1][1]) / 4];
    });
    // A round nib in this coordinate system becomes a narrow, tilted nib on the board.
    // Its footprint changes with stroke direction, like a flat calligraphy pen.
    const major = size / 2, minor = size * 0.14;
    const local = smooth.map(([x, y]) => [(x * cos + y * sin) / major, (-x * sin + y * cos) / minor, 0.5]);
    let length = 0;
    for (let i = 1; i < local.length; i++) length += Math.hypot(local[i][0] - local[i - 1][0], local[i][1] - local[i - 1][1]);
    const closed = length > 12 && Math.hypot(end[0] - source[0][0], end[1] - source[0][1]) < Math.max(1.5, size * 0.45);
    const dot = length < 0.8;
    // Measure the finish in board pixels so every stroke direction gets a short, clear taper.
    let physicalLength = 0;
    for (let i = 1; i < smooth.length; i++) physicalLength += Math.hypot(smooth[i][0] - smooth[i-1][0], smooth[i][1] - smooth[i-1][1]);
    let remaining = Math.min(size * 1.25, physicalLength * 0.22), endTaper = 0;
    for (let i = smooth.length - 1; i > 0 && remaining > 0; i--) {
      const distance = Math.hypot(smooth[i][0] - smooth[i-1][0], smooth[i][1] - smooth[i-1][1]);
      if (!distance) continue;
      const localDistance = Math.hypot(local[i][0] - local[i-1][0], local[i][1] - local[i-1][1]);
      endTaper += localDistance * Math.min(1, remaining / distance);
      remaining -= distance;
    }
    const options = {
      size: 2,
      thinning: 0,
      smoothing: 0.35,
      streamline: 0.12,
      simulatePressure: false,
      start: { taper: dot || closed ? 0 : Math.min(0.7, length * 0.10), cap: false },
      end: { taper: dot || closed ? 0 : endTaper, cap: false, easing: t => Math.pow(t, 1.4) },
      last: finished
    };
    const centerline = freehand.getStrokePoints(local, options);
    const localOutline = freehand.getStrokeOutlinePoints(centerline, options);
    const tip = centerline[centerline.length - 1].point;
    const tipIndex = dot || closed ? -1 : localOutline.findIndex(p => Math.hypot(p[0] - tip[0], p[1] - tip[1]) < 0.00001);
    const polygon = localOutline.map(([x, y]) => [x * major * cos - y * minor * sin, x * major * sin + y * minor * cos]);
    polygon.tipIndex = tipIndex;
    return polygon;
  }
  function draw(ctx, stroke, width, height, finished = true) {
    if (!stroke.points.length) return;
    ctx.save();
    if (stroke.tool === 'eraser' || stroke.correction === false) {
      const erasing = stroke.tool === 'eraser';
      ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
      // Preserve the footprint of erasers saved before sizes were separated.
      const diameter = erasing ? (stroke.eraserDiameter ?? Math.max(18, stroke.width * 2)) : stroke.width;
      ctx.lineWidth = diameter * Math.min(width, height) / 600;
      ctx.lineCap = ctx.lineJoin = 'round';
      ctx.strokeStyle = ctx.fillStyle = erasing ? '#000' : stroke.color;
      ctx.beginPath();
      const start = stroke.points[0];
      ctx.moveTo(start.x * width, start.y * height);
      for (const p of stroke.points.slice(1)) {
        if (p.break) ctx.moveTo(p.x * width, p.y * height);
        else ctx.lineTo(p.x * width, p.y * height);
      }
      if (stroke.points.length === 1) {
        ctx.arc(start.x * width, start.y * height, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.stroke();
        // A contact joining/leaving a multi-touch gesture must not erase a bridge.
        for (const p of stroke.points.filter((p, i) => i === 0 || p.break)) {
          ctx.beginPath();
          ctx.arc(p.x * width, p.y * height, ctx.lineWidth / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      const polygon = outline(stroke, width, height, finished);
      if (polygon.length) {
        ctx.fillStyle = stroke.color;
        ctx.beginPath();
        const first = polygon[0], last = polygon[polygon.length - 1];
        ctx.moveTo((first[0] + last[0]) / 2, (first[1] + last[1]) / 2);
        for (let i = 0; i < polygon.length; i++) {
          const a = polygon[i], b = polygon[(i + 1) % polygon.length];
          if (i === polygon.tipIndex) {
            // Keep the terminal vertex sharp; midpoint smoothing would round it off again.
            ctx.lineTo(a[0], a[1]);
            ctx.lineTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
          } else ctx.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }
  return { outline, draw };
});
