import { polylabel, pointToPolygonDist } from './label-geometry.mjs';

// 원본의 중심 좌표는 오목한 나라나 섬나라에서 바다·이웃 나라를 가리킬 수 있다.
// 실제 표시 도형을 기준으로 확인하고, 경계에 가까우면 기준점과 가까운 육지의 안쪽에 둔다.
export function countryLabelPoint(geometry, preferred) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  const candidates = polygons.map(polygon => ({ polygon, distance: pointToPolygonDist(...preferred, polygon) }));
  const closest = candidates.reduce((a, b) => a.distance >= b.distance ? a : b);
  // 군도는 기존 표시 지역을 유지한다(예: 키리바시를 멀리 떨어진 다른 섬으로 옮기지 않는다).
  const interior = polylabel(closest.polygon, 0.0001);
  const clearance = pointToPolygonDist(...interior, closest.polygon);
  const preferredClearance = closest.distance;
  // 넓은 나라의 기존 위치는 유지하되, 국경과 가까운 기준점은 충분히 안으로 옮긴다.
  const margin = Math.min(0.6, clearance * 0.7);
  if (preferredClearance > 0 && preferredClearance >= margin) return preferred;
  if (clearance <= 0) throw new Error('나라 이름표를 육지 내부에 놓을 수 없습니다.');
  // 작은 섬/바티칸에서 소수 둘째 자리 반올림이 다시 도형 밖으로 나가지 않게 한다.
  return interior;
}

export function placeCountryLabels(labels, shapes) {
  for (const feature of labels) {
    if (feature.properties.kind !== 'country') continue;
    const key = feature.properties.key || `country:${feature.properties.name}`;
    if (!shapes[key]) throw new Error(`나라 모양 없음: ${key}`);
    feature.geometry.coordinates = countryLabelPoint(shapes[key], feature.geometry.coordinates);
  }
}
