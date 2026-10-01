(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory(require("./citychase-data.js"));
  else root.CityChaseLayout = factory(root.CityChaseData);
})(typeof globalThis !== "undefined" ? globalThis : this, function (Board) {
  "use strict";

  // Presentation coordinates only. The server's squares, connections and effects stay intact.
  const positions = {};
  const place = (ids, points) => ids.split(" ").forEach((id, i) => { positions[id] = { x: points[i][0], y: points[i][1] }; });
  const plaza = (prefix, points) => place(Array.from({ length: 8 }, (_, i) => prefix + i).join(" "), points);
  place("r4 r3 r2 r1", [[500,70],[500,395],[500,630],[500,960]]);
  place("p0 p1 p2 p3 p4 p5 p6 p7 p8 p9", [[70,70],[175,70],[260,70],[345,70],[425,70],[575,70],[655,70],[740,70],[825,70],[925,85]]);
  place("p10 p11 p12 p13 p14 p15 p16 p17 p18 p19", [[960,165],[960,250],[960,335],[960,425],[960,510],[960,595],[960,680],[960,765],[960,850],[925,960]]);
  place("p20 p21 p22 p23 p24 p25 p26 p27 p28", [[825,960],[740,960],[655,960],[575,960],[425,960],[345,960],[260,960],[175,960],[90,935]]);
  place("p29 p30 p31 p32 p33 p34 p35 p36 p37", [[40,840],[40,755],[40,665],[40,575],[40,485],[40,400],[40,320],[40,235],[40,150]]);
  plaza("a", [[115,155],[185,145],[265,155],[270,250],[265,350],[185,365],[110,350],[110,250]]);
  plaza("b", [[325,155],[385,145],[455,155],[465,250],[455,350],[385,365],[325,350],[320,250]]);
  plaza("c", [[550,155],[620,145],[690,155],[700,250],[690,350],[620,365],[550,350],[535,250]]);
  plaza("d", [[760,155],[830,145],[900,155],[915,250],[900,350],[830,365],[755,350],[750,250]]);
  plaza("f", [[360,660],[415,655],[470,660],[480,740],[470,825],[415,870],[360,825],[345,740]]);
  plaza("g", [[690,655],[800,640],[880,655],[905,740],[880,815],[800,870],[690,815],[690,740]]);
  place("q0 q1 q2 q3 q4 q5 q6 q7 q8 q9", [[190,635],[280,650],[320,700],[305,770],[320,845],[235,890],[150,880],[110,825],[85,740],[130,655]]);
  place("vl0 vl1 vl2", [[140,415],[130,485],[135,565]]);
  place("vcl0 vcl1 vcl2", [[395,450],[420,515],[400,615]]);
  place("vcr0 vcr1 vcr2", [[620,490],[640,555],[660,605]]);
  place("vr0 vr1 vr2", [[875,490],[900,545],[900,595]]);
  place("pl0 pl1 pl2 pr0 pr1 pr2", [[295,425],[320,480],[280,540],[785,490],[750,550],[780,595]]);
  place("hideout jail", [[105,105],[840,905]]);
  place("e1 e2 e3 e4 e5 e6 e7", [[185,310],[385,310],[620,310],[830,310],[205,835],[415,815],[800,815]]);

  const NODES = Object.freeze(Object.fromEntries(Object.entries(Board.NODES)
    .map(([id, node]) => [id, Object.freeze({ ...node, ...positions[id] })])));
  const centers = { market: [185,235], air: [385,235], electro: [620,235], pizza: [830,235], snack: [205,755], burger: [415,735], cafe: [800,735] };
  const BUILDINGS = Object.freeze(Board.BUILDINGS.map(building => Object.freeze({ ...building,
    x: centers[building.id][0], y: centers[building.id][1] })));

  // Long links get their own corridor instead of running through unrelated squares.
  // Bends are scenery, never extra game squares.
  const bends = {
    "c6:d4": [[550,440],[900,440]],
    "c4:r3": [[710,395]],
    "q0:r2": [[190,575],[455,575]],
    "f1:r2": [[435,600]],
    "g5:r1": [[780,880],[540,880]],
    "jail:g6": [[810,925],[660,925]]
  };
  const paths = new Map();
  const roads = Board.EDGES.filter(edge => !edge.visualOnly).map((edge, index) => {
    const middle = (bends[edge.a + ":" + edge.b] || []).map(([x, y]) => ({ x, y }));
    const points = [NODES[edge.a], ...middle, NODES[edge.b]];
    paths.set(edge.a + ":" + edge.b, points);
    paths.set(edge.b + ":" + edge.a, [...points].reverse());
    return { edge, index, points, raised: middle.length > 0 };
  });
  function edgePath(a, b) { return paths.get(a + ":" + b) || [NODES[a], NODES[b]].filter(Boolean); }
  function routePath(ids) {
    if (!ids.length) return [];
    return [NODES[ids[0]], ...ids.slice(1).flatMap((id, i) => edgePath(ids[i], id).slice(1))];
  }
  function pointAlong(points, progress) {
    const lengths = points.slice(1).map((point, i) => Math.hypot(point.x - points[i].x, point.y - points[i].y));
    let distance = Math.max(0, Math.min(1, progress)) * lengths.reduce((sum, length) => sum + length, 0);
    for (let i = 0; i < lengths.length; i += 1) {
      if (distance <= lengths[i]) {
        const ratio = lengths[i] ? distance / lengths[i] : 0;
        return { x: points[i].x + (points[i + 1].x - points[i].x) * ratio, y: points[i].y + (points[i + 1].y - points[i].y) * ratio };
      }
      distance -= lengths[i];
    }
    return points.at(-1);
  }
  function intersection(a, b, c, d) {
    const dx = b.x - a.x, dy = b.y - a.y, ex = d.x - c.x, ey = d.y - c.y;
    const determinant = dx * ey - dy * ex;
    if (Math.abs(determinant) < .0001) return null;
    const t = ((c.x - a.x) * ey - (c.y - a.y) * ex) / determinant;
    const u = ((c.x - a.x) * dy - (c.y - a.y) * dx) / determinant;
    if (t <= .001 || t >= .999 || u <= .001 || u >= .999) return null;
    return { x: a.x + t * dx, y: a.y + t * dy };
  }
  const crossings = [];
  for (let i = 0; i < roads.length; i += 1) for (let j = i + 1; j < roads.length; j += 1) {
    const first = roads[i], second = roads[j];
    for (let a = 1; a < first.points.length; a += 1) for (let b = 1; b < second.points.length; b += 1) {
      const point = intersection(first.points[a - 1], first.points[a], second.points[b - 1], second.points[b]);
      if (!point) continue;
      const over = first.raised ? first : second;
      const index = over === first ? a : b;
      crossings.push({ ...point, over, under: over === first ? second : first, from: over.points[index - 1], to: over.points[index] });
    }
  }
  return Object.freeze({ NODES, BUILDINGS, roads, crossings, edgePath, routePath, pointAlong });
});
