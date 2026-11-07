(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("../assets/math.js")
      : root.ToolMath,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SolidNets = api;
})(globalThis, function (M) {
  "use strict";
  const V = (x = 0, y = 0, z = 0) => ({ x, y, z }),
    add = (a, b) => V(a.x + b.x, a.y + b.y, a.z + b.z),
    scale = (a, t) => V(a.x * t, a.y * t, a.z * t),
    sub = (a, b) => add(a, scale(b, -1));
  const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z,
    cross = (a, b) =>
      V(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x),
    length = (a) => Math.hypot(a.x, a.y, a.z),
    unit = (a) => scale(a, 1 / (length(a) || 1));
  function rotate(v, axis, angle) {
    const c = Math.cos(angle),
      s = Math.sin(angle);
    return add(
      add(scale(v, c), scale(cross(axis, v), s)),
      scale(axis, dot(axis, v) * (1 - c)),
    );
  }
  const DIRECTIONS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  function canonical(cells) {
    const candidates = [];
    for (const flip of [1, -1])
      for (let r = 0; r < 4; r++) {
        const points = cells.map(([x, y]) => {
            x *= flip;
            for (let i = 0; i < r; i++) [x, y] = [-y, x];
            return [x, y];
          }),
          minX = Math.min(...points.map((p) => p[0])),
          minY = Math.min(...points.map((p) => p[1]));
        candidates.push(
          points
            .map(([x, y]) => [x - minX, y - minY])
            .sort((a, b) => a[0] - b[0] || a[1] - b[1])
            .map((p) => p.join(","))
            .join(";"),
        );
      }
    return candidates.sort()[0];
  }
  function hexominoes() {
    let shapes = new Map([["0,0", [[0, 0]]]]);
    for (let n = 1; n < 6; n++) {
      const next = new Map();
      for (const cells of shapes.values())
        for (const [x, y] of cells)
          for (const [dx, dy] of DIRECTIONS) {
            const p = [x + dx, y + dy];
            if (cells.some((q) => q[0] === p[0] && q[1] === p[1])) continue;
            const key = canonical([...cells, p]);
            if (!next.has(key))
              next.set(
                key,
                key.split(";").map((q) => q.split(",").map(Number)),
              );
          }
      shapes = next;
    }
    return [...shapes.values()];
  }
  function foldedBasis(parent, dx, dy, angle) {
    const axis = dx ? parent.v : parent.u,
      turn = dx ? dx * angle : -dy * angle;
    return {
      u: rotate(parent.u, axis, turn),
      v: rotate(parent.v, axis, turn),
      n: rotate(parent.n, axis, turn),
    };
  }
  function tree(cells) {
    // Propagate each face's local axes across shared edges. At 90° the six
    // distinct normals identify a cube net, independent of rotation/reflection.
    const nodes = [
        {
          cell: cells[0],
          parent: -1,
          dx: 0,
          dy: 0,
          u: V(1, 0, 0),
          v: V(0, 1, 0),
          n: V(0, 0, 1),
        },
      ],
      seen = new Set([cells[0].join(",")]);
    for (let i = 0; i < nodes.length; i++) {
      const parent = nodes[i];
      for (const [dx, dy] of DIRECTIONS) {
        const cell = [parent.cell[0] + dx, parent.cell[1] + dy],
          key = cell.join(",");
        if (
          seen.has(key) ||
          !cells.some((p) => p[0] === cell[0] && p[1] === cell[1])
        )
          continue;
        seen.add(key);
        nodes.push({
          cell,
          parent: i,
          dx,
          dy,
          ...foldedBasis(parent, dx, dy, Math.PI / 2),
        });
      }
    }
    return nodes;
  }
  function isCubeNet(cells) {
    if (cells.length !== 6 || new Set(cells.map((p) => p.join(","))).size !== 6)
      return false;
    const nodes = tree(cells);
    if (nodes.length !== 6) return false;
    return (
      new Set(
        nodes.map((n) =>
          [n.n.x, n.n.y, n.n.z].map((x) => Math.round(x)).join(","),
        ),
      ).size === 6
    );
  }
  const NETS = hexominoes()
    .filter(isCubeNet)
    .sort((a, b) => canonical(a).localeCompare(canonical(b)));
  const initial = {
    version: 1,
    shape: "cube",
    net: 0,
    fold: 1,
    width: 3,
    depth: 2,
    height: 4,
    radius: 2,
    yaw: -0.65,
    pitch: 0.45,
    colors: true,
    details: false,
  };
  const SHAPES = [
    "cube",
    "cuboid",
    "prism3",
    "prism5",
    "prism6",
    "pyramid3",
    "pyramid4",
    "cylinder",
    "cone",
    "sphere",
  ];
  const canUnfold = (shape) =>
    ["cube", "cuboid", "prism3", "prism5", "prism6", "cylinder"].includes(
      shape,
    );
  function validate(s) {
    if (
      !s ||
      s.version !== 1 ||
      !SHAPES.includes(s.shape) ||
      !M.integer(s.net, 0, 10) ||
      !M.finite(s.fold, 0, 1) ||
      !["width", "depth", "height"].every((k) => M.integer(s[k], 1, 6)) ||
      !M.integer(s.radius, 1, 4) ||
      !M.finite(s.yaw, -Math.PI * 2, Math.PI * 2) ||
      !M.finite(s.pitch, -1.4, 1.4) ||
      !["colors", "details"].every((k) => typeof s[k] === "boolean") ||
      (!canUnfold(s.shape) && s.fold !== 1)
    )
      throw Error("입체 모형의 값을 확인해 주세요.");
    return M.copy(s);
  }
  const face = (points, color = 0, curved = false) => ({
    points,
    color,
    curved,
  });
  function boxFaces(s) {
    // Each child rotates about its parent's edge, then moves half its own
    // width/height beyond that hinge. No face is stretched during the fold.
    const cells =
        s.shape === "cube"
          ? NETS[s.net]
          : [
              [0, 0],
              [0, 1],
              [0, 2],
              [0, -1],
              [-1, 0],
              [1, 0],
            ],
      nodes = tree(cells),
      dimensions =
        s.shape === "cube"
          ? [s.width, s.width, s.width]
          : [s.width, s.depth, s.height];
    const axisSize = (v) =>
      dimensions[
        [Math.abs(v.x), Math.abs(v.y), Math.abs(v.z)].indexOf(
          Math.max(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z)),
        )
      ];
    const posed = [];
    nodes.forEach((node, i) => {
      let basis, center;
      const w = axisSize(node.u),
        h = axisSize(node.v);
      if (node.parent < 0) {
        basis = { u: V(1, 0, 0), v: V(0, 1, 0), n: V(0, 0, 1) };
        center = V();
      } else {
        const parent = posed[node.parent];
        basis = foldedBasis(parent, node.dx, node.dy, (s.fold * Math.PI) / 2);
        const first = node.dx
            ? scale(parent.u, (node.dx * parent.w) / 2)
            : scale(parent.v, (node.dy * parent.h) / 2),
          second = node.dx
            ? scale(basis.u, (node.dx * w) / 2)
            : scale(basis.v, (node.dy * h) / 2);
        center = add(parent.center, add(first, second));
      }
      posed.push({ ...basis, center, w, h });
    });
    return posed.map((p, i) =>
      face(
        [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ].map(([x, y]) => {
          const q = add(
            p.center,
            add(scale(p.u, (x * p.w) / 2), scale(p.v, (y * p.h) / 2)),
          );
          return V(q.x, -q.z, q.y);
        }),
        i,
      ),
    );
  }
  function prismFaces(s, n) {
    const base = Array.from({ length: n }, (_, i) =>
        V(
          s.radius * Math.cos((2 * Math.PI * i) / n),
          s.radius * Math.sin((2 * Math.PI * i) / n),
          0,
        ),
      ),
      faces = [face(base, 0)],
      angle = (s.fold * Math.PI) / 2;
    for (let i = 0; i < n; i++) {
      const a = base[i],
        b = base[(i + 1) % n],
        e = unit(sub(b, a)),
        out = V(e.y, -e.x, 0),
        rise = add(scale(out, Math.cos(angle)), V(0, 0, Math.sin(angle))),
        aTop = add(a, scale(rise, s.height)),
        bTop = add(b, scale(rise, s.height));
      faces.push(face([a, b, bTop, aTop], i + 1));
      if (i === 0) {
        const inward = scale(out, -1),
          capDirection = add(
            scale(out, Math.cos(2 * angle)),
            V(0, 0, Math.sin(2 * angle)),
          );
        faces.push(
          face(
            base.map((p) => {
              const q = sub(p, a);
              return add(
                aTop,
                add(scale(e, dot(q, e)), scale(capDirection, dot(q, inward))),
              );
            }),
            n + 1,
          ),
        );
      }
    }
    return faces.map((f) => ({
      ...f,
      points: f.points.map((p) => V(p.x, p.z, p.y)),
    }));
  }
  function cylinderFaces(s) {
    // Preserve the developed horizontal coordinate u as arc length. The
    // instantaneous bending radius r/t tends to a flat rectangle as t → 0.
    const n = 48,
      t = s.fold,
      r = s.radius,
      h = s.height,
      point = (u, y) =>
        t < 1e-8
          ? V(u, y, 0)
          : V(
              (r / t) * Math.sin((u / r) * t),
              y,
              (r / t) * (1 - Math.cos((u / r) * t)),
            );
    const faces = [];
    for (let i = 0; i < n; i++) {
      const u = -Math.PI * r + (i * 2 * Math.PI * r) / n,
        v = u + (2 * Math.PI * r) / n;
      faces.push(
        face([point(u, 0), point(v, 0), point(v, h), point(u, h)], 2, true),
      );
    }
    const angle = (t * Math.PI) / 2;
    for (const top of [false, true]) {
      const hinge = V(0, top ? h : 0, 0),
        center = V(0, top ? r : -r, 0),
        points = Array.from({ length: n }, (_, i) => {
          const a = (i * 2 * Math.PI) / n;
          return add(
            hinge,
            rotate(
              add(center, V(r * Math.cos(a), r * Math.sin(a), 0)),
              V(1, 0, 0),
              top ? angle : -angle,
            ),
          );
        });
      faces.push(face(points, top ? 1 : 0));
    }
    return faces;
  }
  function pyramidFaces(s, n) {
    const base = Array.from({ length: n }, (_, i) =>
        V(
          s.radius * Math.cos((i * 2 * Math.PI) / n),
          0,
          s.radius * Math.sin((i * 2 * Math.PI) / n),
        ),
      ),
      faces = [face(base, 0)];
    for (let i = 0; i < n; i++)
      faces.push(face([base[i], base[(i + 1) % n], V(0, s.height, 0)], i + 1));
    return faces;
  }
  function roundFaces(s) {
    const n = 40;
    if (s.shape === "cone") {
      const base = Array.from({ length: n }, (_, i) =>
        V(
          s.radius * Math.cos((i * 2 * Math.PI) / n),
          0,
          s.radius * Math.sin((i * 2 * Math.PI) / n),
        ),
      );
      return [
        face(base, 0),
        ...base.map((p, i) =>
          face([p, base[(i + 1) % n], V(0, s.height, 0)], 1, true),
        ),
      ];
    }
    const faces = [],
      lat = 20,
      point = (i, j) => {
        const phi = -Math.PI / 2 + (i * Math.PI) / lat,
          theta = (j * 2 * Math.PI) / n;
        return V(
          s.radius * Math.cos(phi) * Math.cos(theta),
          s.radius * Math.sin(phi),
          s.radius * Math.cos(phi) * Math.sin(theta),
        );
      };
    for (let i = 0; i < lat; i++)
      for (let j = 0; j < n; j++)
        faces.push(
          face(
            [
              point(i, j),
              point(i, j + 1),
              point(i + 1, j + 1),
              point(i + 1, j),
            ],
            0,
            true,
          ),
        );
    return faces;
  }
  function mesh(s) {
    if (["cube", "cuboid"].includes(s.shape)) return boxFaces(s);
    if (s.shape.startsWith("prism"))
      return prismFaces(s, Number(s.shape.slice(5)));
    if (s.shape.startsWith("pyramid"))
      return pyramidFaces(s, Number(s.shape.slice(7)));
    if (s.shape === "cylinder") return cylinderFaces(s);
    return roundFaces(s);
  }
  function properties(s) {
    if (s.shape === "cube")
      return {
        faces: 6,
        edges: 12,
        vertices: 8,
        area: 6 * s.width * s.width,
        volume: s.width ** 3,
      };
    if (s.shape === "cuboid")
      return {
        faces: 6,
        edges: 12,
        vertices: 8,
        area: 2 * (s.width * s.height + s.width * s.depth + s.height * s.depth),
        volume: s.width * s.height * s.depth,
      };
    if (s.shape.startsWith("prism")) {
      const n = Number(s.shape.slice(5));
      return { faces: n + 2, edges: 3 * n, vertices: 2 * n };
    }
    if (s.shape.startsWith("pyramid")) {
      const n = Number(s.shape.slice(7));
      return { faces: n + 1, edges: 2 * n, vertices: n + 1 };
    }
    return {};
  }
  function project(faces, yaw, pitch) {
    const all = faces.flatMap((f) => f.points),
      min = V(...["x", "y", "z"].map((k) => Math.min(...all.map((p) => p[k])))),
      max = V(...["x", "y", "z"].map((k) => Math.max(...all.map((p) => p[k])))),
      center = scale(add(min, max), 0.5),
      radius = Math.max(...all.map((p) => length(sub(p, center)))) || 1,
      zoom = Math.min(450 / (radius + 4), 240 / radius);
    const view = (p) =>
      rotate(rotate(sub(p, center), V(0, 1, 0), yaw), V(1, 0, 0), pitch);
    return faces
      .map((f) => {
        const points = f.points.map(view),
          normal = unit(
            cross(sub(points[1], points[0]), sub(points[2], points[0])),
          );
        return {
          ...f,
          points: points.map((p) => ({
            x: 350 + p.x * zoom,
            y: 285 - p.y * zoom,
          })),
          depth: points.reduce((s, p) => s + p.z, 0) / points.length,
          light: 0.68 + 0.28 * Math.abs(dot(normal, unit(V(-0.4, 0.7, 1)))),
        };
      })
      .sort((a, b) => a.depth - b.depth);
  }
  return {
    V,
    add,
    sub,
    scale,
    dot,
    cross,
    length,
    rotate,
    hexominoes,
    isCubeNet,
    NETS,
    initial,
    validate,
    canUnfold,
    mesh,
    properties,
    project,
  };
});
