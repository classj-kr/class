// KMA 1991–2020 normals. Summer = Jun–Aug; winter = Dec–Feb.
// Seasonal mean temperature (°C), seasonal precipitation total (mm).
(function () {
  "use strict";
  window.KoreaSceneClimate = {
    period: "1991–2020", source: "https://www.weather.go.kr/w/climate/statistics/region.do?area=2",
    windSource: "https://www.weather.go.kr/w/climate/statistics/korea.do",
    stations: {
      "춘천": { location: [37.903,127.736], type: "내륙 분지", summer: {temp:24.0,rain:841.0}, winter: {temp:-2.3,rain:69.3} },
      "강릉": { location: [37.751,128.891], type: "동해안", summer: {temp:23.7,rain:661.6}, winter: {temp:2.3,rain:131.1} },
      "대관령": { location: [37.677,128.718], type: "높은 산지", summer: {temp:18.5,rain:867.2}, winter: {temp:-5.3,rain:132.5} }
    },
    pairs: [
      {names:["춘천","강릉"], label:"내륙 · 해안", summer:"두 지역의 여름 평균기온은 비슷합니다. 겨울로 바꾸면 내륙과 해안의 차이가 어떻게 달라질까요?", winter:"강릉의 겨울 평균기온이 춘천보다 높습니다. 바다의 영향과 산지의 배치를 지도에서 함께 살펴보세요."},
      {names:["대관령","강릉"], label:"산지 · 해안", summer:"가까운 두 지역이지만 높은 대관령의 여름 평균기온은 더 낮습니다. 거리뿐 아니라 높이도 함께 보세요.", winter:"대관령은 강릉보다 겨울 평균기온이 낮습니다. 강수량의 차이를 한 방향의 계절풍만으로 설명하지 않도록 주의하세요."}
    ]
  };
})();
