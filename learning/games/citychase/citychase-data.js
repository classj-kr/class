(function (root, factory) {
  "use strict";
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.CityChaseData = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const WIDTH = 1000;
  const HEIGHT = 1000;
  const nodes = {};
  const edges = [];
  function addNode(id, x, y, options = {}) {
    nodes[id] = { id, x, y, label: "거리", ...options };
  }
  function addEdge(a, b, options = {}) {
    edges.push({ a, b, teams: null, oneWay: false, displayArrow: false, visualOnly: false, kind: "road", ...options });
  }
  function addRoute(ids, options = {}) {
    for (let index = 1; index < ids.length; index += 1) addEdge(ids[index - 1], ids[index], options);
  }

  // Four straight avenues and five connecting streets. Every crossing is a real square.
  // Keep the existing square IDs so saved pawn, card and special-square references remain valid.
  const rows = [
    ["p0","p1","p2","p3","p4","a1","b1","b2","r4","c1","c2","d1","p5","p6","p7","p8","p9"],
    ["p35","a6","a5","a4","b6","b4","b5","b3","r3","c6","c5","c4","d6","d4","d5","d3","p12"],
    ["p31","q9","q0","q1","f0","f1","f2","vcl2","r2","vcr2","g0","g1","g2","vr2","vr1","g3","p16"],
    ["p29","p28","p27","p26","p25","p24","f5","f4","r1","p23","p22","p21","p20","g4","g5","p18","p19"]
  ];
  const rowY = [70, 360, 640, 930];
  rows.forEach((row, index) => {
    row.forEach((id, column) => addNode(id, 60 + 55 * column, rowY[index]));
    addRoute(row);
  });
  const columns = [
    ["p37","p36","p34","p33","p32","vl2","p30","q8","q7"],
    ["a2","a3","b0","pl0","pl1","pl2","q2","q3","q4"],
    ["b7","vcl0","vcl1","c0","vcr0","vcr1","f3","f6","f7"],
    ["c3","c7","d0","pr0","pr1","pr2","g6","g7","vr0"],
    ["p10","p11","d2","p13","p14","p15","p17","d7","a0"]
  ];
  columns.forEach((column, index) => {
    for (let band = 0; band < 3; band += 1) {
      const intermediate = column.slice(band * 3, band * 3 + 3);
      intermediate.forEach((id, step) => addNode(id, 60 + index * 220,
        rowY[band] + (rowY[band + 1] - rowY[band]) * (step + 1) / 4));
      const policeLane = band === 1 && (index === 1 || index === 3);
      if (policeLane) intermediate.forEach(id => Object.assign(nodes[id], { label: "경찰 전용길", lane: "police" }));
      addRoute([rows[band][index * 4], ...intermediate, rows[band + 1][index * 4]],
        policeLane ? { teams: ["police"], oneWay: true, kind: "police-lane", displayArrow: true } : {});
    }
  });

  // The southwest block is a clockwise loop; arrows apply only to these connected edges.
  const roundLoop = ["p31","q9","q0","q1","f0","q2","q3","q4","p25","p26","p27","p28","p29","q7","q8","p30","p31"];
  for (let index = 1; index < roundLoop.length; index += 1) {
    const a = roundLoop[index - 1], b = roundLoop[index];
    const edge = edges.find(item => item.a === a && item.b === b || item.a === b && item.b === a);
    Object.assign(edge, { a, b, oneWay: true, displayArrow: true, kind: "round-zone" });
    Object.assign(nodes[a], { zone: "circle" });
  }
  addNode("vl0", 390, 430);
  addNode("q5", 390, 500);
  addNode("vl1", 390, 570);
  addRoute(["c0","vl0","q5","vl1","vcr1"], { teams: ["thief"], kind: "thief-lane" });

  addNode("hideout", 170, 430, { label: "도둑팀 비밀기지", safe: true, start: "thief", effect: "hideout" });
  addNode("a7", 115, 430);
  addRoute(["p33","a7","hideout"], { teams: ["thief"], kind: "thief-lane" });
  addNode("jail", 830, 500, { label: "경찰팀 구금 구역", safe: true, start: "police", effect: "jail" });
  addNode("q6", 775, 500);
  addRoute(["pr1","q6","jail","p14"]);

  const buildings = [
    { id: "market", name: "스타박스", icon: "S", x: 170, y: 225, doorNode: "e1", color: "#287960", blurb: "카페" },
    { id: "air", name: "이다야", icon: "E", x: 390, y: 225, doorNode: "e2", color: "#315cba", blurb: "카페" },
    { id: "electro", name: "기가커피", icon: "G", x: 610, y: 225, doorNode: "e3", color: "#b77b0c", blurb: "카페" },
    { id: "pizza", name: "백다방", icon: "B", x: 830, y: 225, doorNode: "e4", color: "#34678c", blurb: "카페" },
    { id: "snack", name: "투썸플레이트", icon: "T", x: 170, y: 780, doorNode: "e5", color: "#a04661", blurb: "카페" },
    { id: "burger", name: "맥도날도", icon: "M", x: 390, y: 780, doorNode: "e6", color: "#aa6b28", blurb: "햄버거 가게" },
    { id: "cafe", name: "놋데리아", icon: "L", x: 830, y: 780, doorNode: "e7", color: "#8c574f", blurb: "햄버거 가게" }
  ];
  const approaches = ["a5","b5","c5","d5","p27","f5","g5"];
  buildings.forEach((building, index) => {
    building.lot = { width: 170, height: 185, style: "block" };
    addNode(building.doorNode, building.x, index < 4 ? 300 : 855, {
      label: building.name + " 수색", building: building.id, safe: true, kind: "building"
    });
    addEdge(approaches[index], building.doorNode, { teams: ["thief"], kind: "building-lane", displayArrow: true });
  });
  [["r4",4,"r1"],["r3",3,"r2"],["r2",2,"r3"],["r1",1,"r4"]].forEach(([id, station, target]) => {
    Object.assign(nodes[id], { label: station + "번 역 · " + (5 - station) + "번 역으로 이동", effect: "train", effectTarget: target, station });
  });

  Object.assign(nodes.p2, { label: "도둑 위치 이동", effect: "thiefTeleport", tone: "red" });
  Object.assign(nodes.p12, { label: "도둑 위치 이동", effect: "thiefTeleport", tone: "red" });
  Object.assign(nodes.p21, { label: "도둑 위치 이동", effect: "thiefTeleport", tone: "red" });
  Object.assign(nodes.q5, { label: "도둑 위치 이동", effect: "thiefTeleport", tone: "red" });
  Object.assign(nodes.a4, { label: "경찰 위치 이동", effect: "policeTeleport", tone: "blue" });
  Object.assign(nodes.c4, { label: "경찰 위치 이동", effect: "policeTeleport", tone: "blue" });
  Object.assign(nodes.g2, { label: "경찰 위치 이동", effect: "policeTeleport", tone: "blue" });
  Object.assign(nodes.p31, { label: "경찰 위치 이동", effect: "policeTeleport", tone: "blue" });
  Object.assign(nodes.p11, { label: "무조건 멈춤", effect: "stop", tone: "white" });
  Object.assign(nodes.p13, { label: "버스 · 4칸 전진", effect: "jump", effectTarget: "p17", tone: "white" });
  Object.assign(nodes.p18, { label: "2칸 뒤로", effect: "jump", effectTarget: "g4", tone: "white" });
  Object.assign(nodes.p27, { label: "밥을 먹고 힘이 났다 · 3칸 전진", effect: "jump", effectTarget: "q7", tone: "white" });
  Object.assign(nodes.p32, { label: "잊은 물건 · 시작 구역으로", effect: "reset", tone: "white" });
  Object.assign(nodes.a2, { label: "정보 누설", effect: "reveal", tone: "pink" });
  Object.assign(nodes.d2, { label: "비밀 통로", effect: "jump", effectTarget: "e4", tone: "pink" });
  Object.assign(nodes.vcl1, { label: "보석을 동료에게 전달", effect: "transfer", tone: "pink" });
  Object.assign(nodes.vl2, { label: "화장실이 급하다", effect: "reset", tone: "white" });
  Object.assign(nodes.vcr2, { label: "보석을 떨어뜨렸다", effect: "dropGem", tone: "pink" });
  Object.assign(nodes.g3, { label: "비타민 · 5칸 전진", effect: "jump", effectTarget: "p12", tone: "white" });
  Object.assign(nodes.q0, { label: "힘이 났다 · 원형 구역 3칸 전진", effect: "jump", effectTarget: "q2", tone: "white" });
  Object.assign(nodes.q2, { label: "정보 누설", effect: "reveal", tone: "pink" });
  Object.assign(nodes.q8, { label: "무조건 멈춤", effect: "stop", tone: "white" });

  ["p1","p6","p9","p14","p17","p22","p25","p30","a1","b2","c1","d2","f2","g1","q1","q6"].forEach(id => { nodes[id].trickSlot = true; });
  ["p2","p7","p10","p15","p19","p23","p28","p34","a3","b6","c3","d6","f4","g4","q3","q7"].forEach(id => { nodes[id].inspectionSlot = true; });

  function neighbors(nodeId, team) {
    const result = [];
    for (const edge of edges) {
      if (edge.visualOnly || edge.teams && !edge.teams.includes(team)) continue;
      if (edge.a === nodeId) result.push({ id: edge.b, edge });
      if (!edge.oneWay && edge.b === nodeId) result.push({ id: edge.a, edge });
    }
    return result;
  }

  const publicNodes = Object.freeze(Object.fromEntries(Object.entries(nodes).map(([id, node]) => [id, Object.freeze({ ...node })])));
  const publicEdges = Object.freeze(edges.map(edge => Object.freeze({ ...edge, teams: edge.teams ? Object.freeze([...edge.teams]) : null })));
  const publicBuildings = Object.freeze(buildings.map(building => Object.freeze({ ...building })));
  return Object.freeze({
    WIDTH, HEIGHT, NODES: publicNodes, EDGES: publicEdges, BUILDINGS: publicBuildings,
    ROUND_ZONE: Object.freeze({ x: 170, y: 785, radius: 145, entrances: Object.freeze(["p31","q0","f0","p25","p27","p29"]) }),
    neighbors
  });
});
