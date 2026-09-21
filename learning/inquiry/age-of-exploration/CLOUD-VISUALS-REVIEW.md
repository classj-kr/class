# 항해 구름 개선

새 이미지: `public/assets/weather/cloud-soft-atlas-v1.webp`. 내장 imagegen으로 생성한 1536×1024 투명 이미지 한 장에 네 가지 구름을 담았다. 생성된 알파 채널을 유지하면서 WebP로 저장했다.

점무늬 6프레임 반복을 제거하고 구름 모양을 유지한 채 연속 이동한다. 서버에서 배의 순풍·역풍 속도를 계산하는 것과 같은 `CDS95Wind.windAtPixel`의 방향과 세기를 사용한다. 구름의 좌우 흔들림을 제거했고 강한 바람에서 이동 속도가 더 크다. 무풍대의 강한 이동 표시는 생략한다. 지형 위, 도시·발견물·배 아래에서 합성하며 해류의 수면 물결 표시와 구분한다.

생성 방식: 내장 `image_gen` 사용. 최종 프롬프트:

> Use case: stylized-concept. Asset type: production transparent sprite atlas for clouds drifting above a top-down natural-relief world map in a historical sailing game. Generate ONE atlas image, landscape 1536 by 1024, arranged as exactly 2 columns and 2 rows of equal cells. In each cell, center one distinct separate cloud formation, fully contained with generous transparent padding on all sides. Four cloud formations total: a broad broken cumulus bank, an airy elongated wispy bank, a smaller asymmetric cumulus cluster, and a long thin feathered cloud streak. All are viewed from directly above, with organic uneven edges, tiny irregular lobes, delicate semi-transparent wisps, soft warm-white upper highlights and very subtle pale blue-gray self shading. Painterly realism matching a natural satellite relief map, refined and light, beautiful at small game scale. Width of each formation approximately 560 pixels within its 768px-wide cell, height approximately 220-300px within its 512px-high cell. Uniform very soft lighting. Genuine alpha-transparent background including the cell gaps, semi-transparent edges preserved. No sky, no blue background, no painted checkerboard, no horizon, no ground, no cast shadow outside the clouds, no cartoon outline, no flat-bottom side-view cloud, no text or labels, no grid lines. Keep all four sprites separate and entirely inside their own equal-sized cells; nothing touches the atlas borders. This is one game texture atlas, not a presentation sheet.

검증: 구름 렌더러의 풍향 정렬, 강풍·약풍 속도 차이, 소수점 위치 연속 이동, 무풍대·선택창 생략을 검사했다. 로컬 Chrome에서 PC와 모바일 화면을 확인했고 실제 방향키 항해로 같은 해역에서 순풍 가속과 역풍 감속을 확인했다. 새 이미지 크기는 326,576바이트다.
