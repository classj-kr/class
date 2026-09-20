// Direction anchors refer to the ends of the existing OSM linework, not necessarily a river's full source.
(function (root) {
  "use strict";
  const rivers = {
    "한강": { reverse: [true], downstream: [126.4135758,37.8447035], route: "남한강·북한강 → 두물머리 → 한강 → 서해", related: ["한강","남한강","북한강","임진강"], note: "두물머리에서 만난 남한강과 북한강의 물은 한강으로 이어집니다. 서울을 지난 물길이 서해 쪽으로 향하는지 따라가 보세요." },
    "남한강": { reverse: [false], downstream: [127.3105144,37.5248733], route: "남한강 → 두물머리 → 한강 → 서해", related: ["남한강","한강"], note: "굽이치는 구간에서도 물은 하류로 이어집니다. 두물머리에서 북한강과 만난 뒤 한강으로 흐릅니다." },
    "북한강": { reverse: [false], downstream: [127.3105144,37.5248733], route: "북한강 → 두물머리 → 한강 → 서해", related: ["북한강","한강"], note: "북쪽에서 내려온 북한강은 두물머리에서 남한강과 만납니다. 합류점 뒤의 물길도 이어서 확인해 보세요." },
    "임진강": { reverse: [false], downstream: [126.6521667,37.7809602], route: "임진강 → 한강 하류 → 서해", related: ["임진강","한강"], note: "임진강은 한강 하류에 합류합니다. 강 이름이 바뀌는 곳과 물길이 이어지는 곳을 구별해 보세요." },
    "낙동강": { reverse: [false], downstream: [128.9531765,35.1073259], route: "낙동강 → 부산 하구 → 남해", note: "내륙을 길게 지난 물길이 부산의 하구로 향합니다. 강의 굽이와 주변 평야·도시의 위치를 함께 살펴보세요." },
    "금강": { reverse: [true], downstream: [126.7518224,36.0146905], route: "금강 → 군산·서천 하구 → 서해", note: "지도의 위쪽이 언제나 상류는 아닙니다. 북쪽으로 향하던 물길이 다시 굽어 서해로 나가는 모습을 따라가 보세요." },
    "영산강": { reverse: [false], downstream: [126.3354794,34.7647432], route: "영산강 → 목포 하구 → 서해", note: "호남의 평야를 지난 물길이 목포 쪽 하구로 이어집니다. 이 지도에 포함된 구간의 흐름을 보여 줍니다." },
    "섬진강": { reverse: [true], downstream: [127.8019016,34.9084249], route: "섬진강 → 광양만 → 남해", note: "산지 사이를 지난 섬진강의 물은 광양만으로 향합니다. 가까운 다른 강과 나가는 바다를 비교해 보세요." },
    "압록강": { reverse: [false,false], downstream: [124.3541086,39.9706824], route: "압록강 → 서해", note: "북쪽 국경을 따라 이어지는 물길입니다. 두만강과 출발 지역은 가깝지만 바다로 향하는 방향은 다릅니다." },
    "두만강": { reverse: [false], downstream: [130.6966803,42.2933078], route: "두만강 → 동해", note: "압록강과 달리 동해 쪽으로 향합니다. 북쪽 산지에서 물길이 서로 다른 바다로 갈라지는 모습을 비교해 보세요." },
    "대동강": { reverse: [false], downstream: [125.1808482,38.6742243], route: "대동강 → 평양 → 서해", note: "평양을 지나는 대동강의 하류 방향을 확인해 보세요. 굽이마다 방향이 달라도 물길은 하구로 이어집니다." },
    "청천강": { reverse: [false], downstream: [125.4603607,39.5762972], route: "청천강 → 안주 일대 → 서해", note: "북부 산지에서 서해 쪽으로 이어지는 물길입니다. 대동강과 나란히 놓고 하구와 주변 평야를 살펴보세요." }
  };
  const linesOf = geometry => geometry?.type === "LineString" ? [geometry.coordinates] : geometry?.type === "MultiLineString" ? geometry.coordinates : [];
  function riverTracks(collection) {
    return (collection?.features || []).flatMap(feature => {
      const definition = rivers[feature.properties.name];
      if (!definition) return [];
      return linesOf(feature.geometry).flatMap((line, index) => {
        if (typeof definition.reverse[index] !== "boolean") return [];
        const coordinates = line.map(point => point.slice());
        if (definition.reverse[index]) coordinates.reverse();
        return [{ id: feature.properties.name + "-" + index, name: feature.properties.name, kind: "river", coordinates }];
      });
    });
  }
  // Representative seasonal paths, NOT current observations or a numerical weather forecast.
  const winds = {
    summer: [
      [[122.2,32.0],[123.9,33.5],[125.5,35.1],[126.9,37.3],[128.4,39.4]],
      [[124.0,30.8],[125.4,32.7],[127.0,34.5],[128.2,36.5],[129.5,38.9]],
      [[126.0,31.5],[127.1,33.0],[128.7,34.6],[129.7,36.7],[130.8,38.8]],
      [[122.5,35.8],[124.1,37.2],[125.6,39.0],[126.9,41.0],[128.5,42.7]],
      [[124.5,37.3],[126.0,39.2],[127.8,40.8],[129.5,42.2]]
    ],
    winter: [
      [[120.2,42.0],[122.4,40.4],[124.6,38.7],[126.5,36.6],[128.3,34.5]],
      [[122.0,44.0],[124.5,42.1],[126.4,39.9],[128.1,37.9],[129.7,35.8]],
      [[123.7,44.5],[126.1,42.4],[128.0,40.3],[129.7,38.3],[131.3,36.2]],
      [[119.6,40.4],[121.9,38.4],[123.9,36.4],[125.9,34.3],[127.4,32.3]],
      [[126.0,44.9],[128.1,43.0],[130.0,41.0],[131.8,39.1]]
    ]
  };
  function windTracks(season) {
    return (winds[season] || []).map((coordinates,index) => ({ id: season + "-" + index, name: season === "summer" ? "여름 계절풍" : "겨울 계절풍", kind: "wind", season, coordinates }));
  }
  root.KoreaFlowData = { rivers, linesOf, riverTracks, windTracks };
})(typeof window === "undefined" ? globalThis : window);
