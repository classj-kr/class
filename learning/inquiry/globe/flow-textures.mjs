// 구면 위의 흐름: 위치는 지도 엔진이 투영하므로 뒷면 가림과 확대에도 맞는다.
const radians = Math.PI / 180;
const wrap = (lng) => ((lng + 180) % 360 + 360) % 360 - 180;

function soften(points) {
  let result = points.map((point) => [...point]);
  // 모서리만 둥글게 만든다. 날짜 변경선에서 나뉜 조각과 양 끝점은 유지한다.
  for (let pass = 0; pass < 2 && result.length > 2; pass++) {
    const next = [result[0]];
    for (let i = 0; i < result.length - 1; i++) {
      const a = result[i], b = result[i + 1];
      next.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25]);
      next.push([a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]);
    }
    next.push(result[result.length - 1]);
    result = next;
  }
  return result;
}

export function buildFlowModel(collection, kind) {
  const tracks = [];
  const features = collection.features.map((feature) => {
    const coordinates = feature.geometry.coordinates.map(soften);
    for (const points of coordinates) {
      if (points.length < 2) continue;
      const distances = [0];
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        const dx = (b[0] - a[0]) * Math.cos((a[1] + b[1]) * .5 * radians);
        distances.push(distances[i - 1] + Math.hypot(dx, b[1] - a[1]));
      }
      const length = distances[distances.length - 1];
      if (length < .001) continue;
      tracks.push({ points, distances, length, kind, properties: feature.properties });
    }
    return { ...feature, geometry: { ...feature.geometry, coordinates } };
  });
  return { tracks, collection: { type: 'FeatureCollection', features } };
}

export function sampleTrack(track, progress, offset = 0) {
  const at = Math.max(0, Math.min(1, progress)) * track.length;
  let i = 1;
  while (i < track.distances.length - 1 && track.distances[i] < at) i++;
  const a = track.points[i - 1], b = track.points[i];
  const span = track.distances[i] - track.distances[i - 1];
  const t = span ? (at - track.distances[i - 1]) / span : 0;
  const lat = a[1] + (b[1] - a[1]) * t;
  const cosLat = Math.max(.12, Math.cos(lat * radians));
  const dx = (b[0] - a[0]) * cosLat, dy = b[1] - a[1];
  const magnitude = Math.hypot(dx, dy) || 1;
  return {
    coordinates: [wrap(a[0] + (b[0] - a[0]) * t - dy / magnitude * offset / cosLat),
      Math.max(-85, Math.min(85, lat + dx / magnitude * offset))],
    bearing: Math.atan2(dx, dy) / radians,
  };
}

export function flowFrame(tracks, seconds) {
  const features = [];
  tracks.forEach((track, trackIndex) => {
    const wind = track.kind === 'wind';
    const count = Math.max(2, Math.min(28, Math.ceil(track.length / (wind ? 10 : 8))));
    const lanes = wind && track.properties.tier < 4 ? [-1, 0, 1] : [0];
    for (const lane of lanes) for (let i = 0; i < count; i++) {
      // 움직임은 학습용이며 실제 풍속·유속이나 둘 사이의 속도비를 나타내지 않는다.
      const progress = ((i + .35 + (lane + 1) * .21) / count + seconds * (wind ? 1.5 : .85) / track.length) % 1;
      const point = sampleTrack(track, progress, lane * (track.properties.tier === 1 ? 1.25 : .65));
      const fade = Math.min(1, progress / .06, (1 - progress) / .06);
      features.push({
        type: 'Feature', id: `${track.kind}-${trackIndex}-${lane}-${i}`,
        properties: { ...track.properties, kind: track.kind, bearing: point.bearing,
          opacity: .2 + .72 * fade, size: wind ? (lane === 0 ? 1 : .8) : 1 },
        geometry: { type: 'Point', coordinates: point.coordinates },
      });
    }
  });
  return { type: 'FeatureCollection', features };
}

// 코드로 그린 투명 이미지. 바람은 세 가닥 바람결, 해류는 좁은 물빛과 작은 입자.
export function installFlowImages(map) {
  for (const [id, color, wind] of [
    ['flow-wind', '#e3ffc6', true], ['flow-wind-lit', '#f3ff69', true],
    ['flow-warm', '#ffdbc7', false], ['flow-cold', '#d1f6ff', false],
    ['flow-water-lit', '#fbffab', false],
  ]) {
    const canvas = document.createElement('canvas');
    canvas.width = 96; canvas.height = 144;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 134, 0, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(.52, color);
    gradient.addColorStop(1, color);
    ctx.strokeStyle = gradient;
    ctx.lineCap = 'round';
    if (wind) {
      for (const [x, start, end, width] of [[30, 132, 33, 4], [48, 126, 16, 5], [66, 119, 42, 3]]) {
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x - 7, start);
        ctx.bezierCurveTo(x - 17, 93, x + 15, 68, x, end);
        ctx.stroke();
      }
      // 흐름 방향이 정지 상태에서도 보이도록 중심 가닥 끝에 작은 열린 촉.
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(40, 27); ctx.lineTo(48, 16); ctx.lineTo(57, 25); ctx.stroke();
    } else {
      for (const [x, start, end, width] of [[38, 129, 47, 3], [49, 116, 17, 5], [59, 109, 60, 2]]) {
        ctx.lineWidth = width;
        ctx.beginPath(); ctx.moveTo(x, start); ctx.quadraticCurveTo(x + 5, 77, x, end); ctx.stroke();
      }
      ctx.fillStyle = color;
      for (const [x, y, r] of [[49, 17, 3.5], [37, 41, 2], [60, 56, 1.7]]) {
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
    }
    map.addImage(id, ctx.getImageData(0, 0, 96, 144), { pixelRatio: 2 });
  }
}
