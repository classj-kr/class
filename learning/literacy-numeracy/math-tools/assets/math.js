(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ToolMath = api;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mod = (v, n) => ((v % n) + n) % n;
  const copy = (v) => JSON.parse(JSON.stringify(v));
  const round = (v, digits = 6) => Number(v.toFixed(digits));
  const finite = (v, a, b) =>
    typeof v === "number" && Number.isFinite(v) && v >= a && v <= b;
  const integer = (v, a, b) => Number.isInteger(v) && v >= a && v <= b;
  const esc = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  function fraction(n, d) {
    const g = gcd(n, d);
    return { n: n / g, d: d / g };
  }
  function fractionText(n, d) {
    const f = fraction(n, d);
    return f.d === 1 ? String(f.n) : `${f.n}/${f.d}`;
  }
  function polygonArea(points) {
    return (
      Math.abs(
        points.reduce((s, p, i) => {
          const q = points[(i + 1) % points.length];
          return s + p.x * q.y - p.y * q.x;
        }, 0),
      ) / 2
    );
  }
  function inside(p, points) {
    let result = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const a = points[i],
        b = points[j];
      if (
        a.y > p.y !== b.y > p.y &&
        p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x
      )
        result = !result;
    }
    return result;
  }
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const rotate = (p, angle) => ({
    x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
    y: p.x * Math.sin(angle) + p.y * Math.cos(angle),
  });
  const path = (points, close = true) =>
    points
      .map((p, i) => `${i ? "L" : "M"}${round(p.x, 3)} ${round(p.y, 3)}`)
      .join(" ") + (close ? "Z" : "");
  const circlePoint = (cx, cy, r, degrees) => ({
    x: cx + r * Math.cos((degrees * Math.PI) / 180),
    y: cy - r * Math.sin((degrees * Math.PI) / 180),
  });
  function arc(cx, cy, r, from, to) {
    const a = circlePoint(cx, cy, r, from),
      b = circlePoint(cx, cy, r, to),
      angle = to - from;
    if (Math.abs(angle) >= 359.999)
      return `M${cx + r} ${cy}a${r} ${r} 0 1 0 ${-2 * r} 0a${r} ${r} 0 1 0 ${2 * r} 0`;
    return `M${a.x} ${a.y}A${r} ${r} 0 ${Math.abs(angle) > 180 ? 1 : 0} ${angle > 0 ? 0 : 1} ${b.x} ${b.y}`;
  }
  const colors = [
    "#2c8979",
    "#dc7950",
    "#5286c2",
    "#a16bb6",
    "#c59c35",
    "#d47896",
  ];
  return Object.freeze({
    clamp,
    mod,
    copy,
    round,
    finite,
    integer,
    esc,
    gcd,
    fraction,
    fractionText,
    polygonArea,
    inside,
    distance,
    rotate,
    path,
    circlePoint,
    arc,
    colors,
  });
});
