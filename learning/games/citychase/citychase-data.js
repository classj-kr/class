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
    nodes[id] = { id, x, y, label: options.label || "거리", ...options };
    return nodes[id];
  }

  function addEdge(a, b, options = {}) {
    edges.push({
      a,
      b,
      teams: options.teams || null,
      oneWay: !!options.oneWay,
      displayArrow: !!options.displayArrow,
      visualOnly: !!options.visualOnly,
      kind: options.kind || "road"
    });
  }

  function addRoute(ids, options = {}) {
    for (let index = 0; index < ids.length - 1; index += 1) addEdge(ids[index], ids[index + 1], options);
  }

  function addLoop(ids, options = {}) {
    addRoute(ids, options);
    addEdge(ids[ids.length - 1], ids[0], options);
  }

  function addPoints(prefix, points, options = {}) {
    points.forEach(([x, y], index) => addNode(`${prefix}${index}`, x, y, options));
  }

  function addPlaza(prefix, cx, cy, rx, ry) {
    addPoints(prefix, [
      [cx - rx, cy - ry], [cx, cy - ry - 8], [cx + rx, cy - ry], [cx + rx + 12, cy],
      [cx + rx, cy + ry], [cx, cy + ry + 8], [cx - rx, cy + ry], [cx - rx - 12, cy]
    ]);
    addLoop(Array.from({ length: 8 }, (_, index) => `${prefix}${index}`));
  }

  // 중앙 세로 철도와 사진에 보이는 4-3-2-1 역 순서.
  addNode("r4", 500, 75, { label: "4번 역 · 1번 역으로 이동", effect: "train", effectTarget: "r1", station: 4 });
  addNode("r3", 500, 365, { label: "3번 역 · 2번 역으로 이동", effect: "train", effectTarget: "r2", station: 3 });
  addNode("r2", 500, 650, { label: "2번 역 · 3번 역으로 이동", effect: "train", effectTarget: "r3", station: 2 });
  addNode("r1", 500, 925, { label: "1번 역 · 4번 역으로 이동", effect: "train", effectTarget: "r4", station: 1 });
  addRoute(["r4", "r3", "r2", "r1"], { kind: "rail", visualOnly: true });

  // 외곽 순환로. 기존 테스트와 저장 상태 호환을 위해 p0~p37 이름을 유지한다.
  const outer = [
    ["p0",90,75],["p1",175,75],["p2",260,75],["p3",345,75],["p4",425,75],["r4",500,75],
    ["p5",575,75],["p6",655,75],["p7",740,75],["p8",825,75],["p9",910,90],
    ["p10",940,160],["p11",940,245],["p12",940,330],["p13",940,415],["p14",940,500],
    ["p15",940,585],["p16",940,670],["p17",940,755],["p18",940,840],["p19",910,925],
    ["p20",825,925],["p21",740,925],["p22",655,925],["p23",575,925],["r1",500,925],
    ["p24",425,925],["p25",345,925],["p26",260,925],["p27",175,925],["p28",90,910],
    ["p29",60,830],["p30",60,745],["p31",60,660],["p32",60,575],["p33",60,490],
    ["p34",60,405],["p35",60,320],["p36",60,235],["p37",65,150]
  ];
  outer.forEach(([id, x, y]) => { if (!nodes[id]) addNode(id, x, y); });
  addLoop(outer.map(([id]) => id));

  // 상단 네 건물: 철도 왼쪽 두 곳, 오른쪽 두 곳.
  addPlaza("a", 175, 235, 82, 105);
  addPlaza("b", 385, 235, 78, 105);
  addPlaza("c", 625, 235, 78, 105);
  addPlaza("d", 825, 235, 82, 105);
  addEdge("a0", "p37"); addEdge("a7", "p35"); addEdge("a2", "b0"); addEdge("a4", "b6");
  addEdge("b1", "r4"); addEdge("b4", "r3");
  addEdge("c1", "r4"); addEdge("c4", "r3"); addEdge("c2", "d0"); addEdge("c6", "d4");
  addEdge("d2", "p9"); addEdge("d3", "p12");

  // 하단의 원형 구역 + 철도 왼쪽 건물 + 오른쪽 건물.
  addPoints("q", [[190,620],[280,645],[345,710],[315,790],[325,875],[225,910],[150,900],[85,835],[100,745],[115,665]], { label: "원형 이동 구역", zone: "circle" });
  addLoop(Array.from({ length: 10 }, (_, index) => `q${index}`), { kind: "round-zone", oneWay: true });
  addPlaza("f", 415, 790, 62, 105);
  addPlaza("g", 800, 790, 100, 110);
  addEdge("q0", "r2"); addEdge("q1", "f0"); addEdge("q4", "f6"); addEdge("q5", "p26"); addEdge("q7", "p29"); addEdge("q9", "p31");
  addEdge("f1", "r2"); addEdge("f5", "r1");
  addEdge("g0", "r2"); addEdge("g5", "r1"); addEdge("g3", "p17"); addEdge("g4", "p19");

  // 위·아래 구역을 이어 주는 불규칙한 세로 경로.
  addPoints("vl", [[115,385],[105,475],[110,565]]);
  addRoute(["a6","vl0","vl1","vl2","q9"]);
  addPoints("vcl", [[395,390],[420,470],[420,565]]);
  addRoute(["b5","vcl0","vcl1","vcl2","f1"]);
  addPoints("vcr", [[625,390],[640,470],[660,565]]);
  addRoute(["c5","vcr0","vcr1","vcr2","g0"]);
  addPoints("vr", [[875,390],[895,475],[900,570]]);
  addRoute(["d5","vr0","vr1","vr2","g2"]);
  addEdge("vl1", "p33"); addEdge("vr1", "p14");

  // 사진의 굵은 경찰 파란 화살표 레인.
  addPoints("pl", [[285,390],[315,455],[290,525]], { label: "경찰 전용 화살표", lane: "police" });
  addRoute(["a4","pl0","pl1","pl2","q0"], { teams: ["police"], oneWay: true, kind: "police-lane" });
  addPoints("pr", [[760,390],[730,455],[755,525]], { label: "경찰 전용 화살표", lane: "police" });
  addRoute(["d6","pr0","pr1","pr2","g1"], { teams: ["police"], oneWay: true, kind: "police-lane" });

  addNode("hideout", 100, 105, { label: "도둑팀 비밀기지", safe: true, start: "thief", effect: "hideout" });
  addNode("jail", 925, 875, { label: "경찰팀 구금 구역", safe: true, start: "police", effect: "jail" });
  addEdge("hideout", "p0", { teams: ["thief"] });
  addEdge("jail", "p19");
  addEdge("jail", "g6");

  const buildings = [
    { id: "market", name: "스타박스", icon: "▦", x: 175, y: 235, doorNode: "e1", color: "#f4b942", lot: { width: 148, height: 132, style: "stone" }, blurb: "카페" },
    { id: "air", name: "이다야", icon: "✦", x: 385, y: 235, doorNode: "e2", color: "#58a6d8", lot: { width: 126, height: 148, style: "fence" }, blurb: "카페" },
    { id: "electro", name: "기가커피", icon: "ϟ", x: 625, y: 235, doorNode: "e3", color: "#7b6fd0", lot: { width: 146, height: 120, style: "oval" }, blurb: "카페" },
    { id: "pizza", name: "백다방", icon: "◒", x: 825, y: 235, doorNode: "e4", color: "#f08b4d", lot: { width: 158, height: 138, style: "stone" }, blurb: "카페" },
    { id: "snack", name: "투썸플레이트", icon: "♨", x: 205, y: 785, doorNode: "e5", color: "#e85c79", lot: { width: 118, height: 96, style: "round" }, blurb: "카페" },
    { id: "burger", name: "맥도날도", icon: "≋", x: 415, y: 790, doorNode: "e6", color: "#ef765d", lot: { width: 124, height: 146, style: "fence" }, blurb: "햄버거 가게" },
    { id: "cafe", name: "놋데리아", icon: "♣", x: 800, y: 790, doorNode: "e7", color: "#55a96f", lot: { width: 164, height: 142, style: "stone" }, blurb: "햄버거 가게" }
  ];

  // 모든 건물 입구는 사진처럼 굵은 빨간 진입 레인으로 표시한다.
  const entrances = [
    ["e1",175,300,"a5"], ["e2",385,300,"b5"], ["e3",625,300,"c5"], ["e4",825,300,"d5"],
    ["e5",205,845,"q4"], ["e6",415,850,"f5"], ["e7",800,850,"g5"]
  ];
  entrances.forEach(([id, x, y, link], index) => {
    addNode(id, x, y, { label: `${buildings[index].name} 수색`, building: buildings[index].id, safe: true, kind: "building" });
    addEdge(link, id, { teams: ["thief"], kind: "building-lane", displayArrow: true });
  });

  // 가까운 교차점의 칸은 서로 덮이지 않도록 원작 사진의 빈 공간 쪽으로 벌린다.
  Object.assign(nodes.d3, { x: 890 });
  Object.assign(nodes.a7, { x: 95 });
  Object.assign(nodes.c3, { x: 700 });
  Object.assign(nodes.d7, { x: 750 });

  Object.assign(nodes.p2, { label: "도둑 위치 이동", effect: "thiefTeleport", tone: "red" });
  Object.assign(nodes.p12, { label: "도둑 위치 이동", effect: "thiefTeleport", tone: "red" });
  Object.assign(nodes.p21, { label: "도둑 위치 이동", effect: "thiefTeleport", tone: "red" });
  Object.assign(nodes.q5, { label: "도둑 위치 이동", effect: "thiefTeleport", tone: "red" });
  Object.assign(nodes.a4, { label: "경찰 위치 이동", effect: "policeTeleport", tone: "blue" });
  Object.assign(nodes.c4, { label: "경찰 위치 이동", effect: "policeTeleport", tone: "blue" });
  Object.assign(nodes.g2, { label: "경찰 위치 이동", effect: "policeTeleport", tone: "blue" });
  Object.assign(nodes.p31, { label: "경찰 위치 이동", effect: "policeTeleport", tone: "blue" });
  Object.assign(nodes.p11, { label: "무조건 멈춤", effect: "stop", tone: "white" });
  Object.assign(nodes.p13, { label: "버스 · 4칸 전진", effect: "jump", effectTarget: "p16", tone: "white" });
  Object.assign(nodes.p18, { label: "2칸 뒤로", effect: "jump", effectTarget: "p16", tone: "white" });
  Object.assign(nodes.p27, { label: "밥을 먹고 힘이 났다 · 3칸 전진", effect: "jump", effectTarget: "p30", tone: "white" });
  Object.assign(nodes.p32, { label: "잊은 물건 · 시작 구역으로", effect: "reset", tone: "white" });
  Object.assign(nodes.a2, { label: "정보 누설", effect: "reveal", tone: "pink" });
  Object.assign(nodes.d2, { label: "비밀 통로", effect: "jump", effectTarget: "e4", tone: "pink" });
  Object.assign(nodes.vcl1, { label: "보석을 동료에게 전달", effect: "transfer", tone: "pink" });
  Object.assign(nodes.vl2, { label: "화장실이 급하다", effect: "reset", tone: "white" });
  Object.assign(nodes.vcr2, { label: "보석을 떨어뜨렸다", effect: "dropGem", tone: "pink" });
  Object.assign(nodes.g3, { label: "비타민 · 5칸 전진", effect: "jump", effectTarget: "p10", tone: "white" });
  Object.assign(nodes.q0, { label: "힘이 났다 · 원형 구역 3칸 전진", effect: "jump", effectTarget: "q3", tone: "white" });
  Object.assign(nodes.q2, { label: "정보 누설", effect: "reveal", tone: "pink" });
  Object.assign(nodes.q8, { label: "무조건 멈춤", effect: "stop", tone: "white" });

  ["p1","p6","p9","p14","p17","p22","p25","p30","a1","b2","c1","d2","f2","g1","q1","q6"].forEach(id => { nodes[id].trickSlot = true; });
  ["p2","p7","p10","p15","p19","p23","p28","p34","a3","b6","c3","d6","f4","g4","q3","q7"].forEach(id => { nodes[id].inspectionSlot = true; });

  function neighbors(nodeId, team) {
    const result = [];
    for (const edge of edges) {
      if (edge.visualOnly) continue;
      if (edge.teams && !edge.teams.includes(team)) continue;
      if (edge.a === nodeId) result.push({ id: edge.b, edge });
      if (!edge.oneWay && edge.b === nodeId) result.push({ id: edge.a, edge });
    }
    return result;
  }

  const publicNodes = Object.freeze(Object.fromEntries(Object.entries(nodes).map(([id, node]) => [id, Object.freeze({ ...node })])));
  const publicEdges = Object.freeze(edges.map(edge => Object.freeze({ ...edge, teams: edge.teams ? Object.freeze([...edge.teams]) : null })));
  const publicBuildings = Object.freeze(buildings.map(building => Object.freeze({ ...building })));

  return Object.freeze({
    WIDTH,
    HEIGHT,
    NODES: publicNodes,
    EDGES: publicEdges,
    BUILDINGS: publicBuildings,
    ROUND_ZONE: Object.freeze({ x: 205, y: 785, radius: 155, entrances: Object.freeze(["q0", "q1", "q4", "q5", "q7", "q9"]) }),
    neighbors
  });
});
