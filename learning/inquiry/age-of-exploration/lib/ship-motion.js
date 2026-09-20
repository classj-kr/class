'use strict';

// 배와 탐험대가 다음 칸으로 갈 수 있는지 정하는 규칙. 서버와 시험이 같은 것을 본다.
//
// 규칙 둘뿐이다.
// 1) 배는 바다만, 탐험대는 뭍만 간다. 얼음은 어느 쪽도 들어가지 못한다.
// 2) 다만 얼음에 갇힌 때(계절이 바뀌어 얼음이 배를 덮었거나 얼음 위에 서게 된 때)에는
//    적도 쪽으로 빠져나가는 것을 언제나 허용한다. 그러지 않으면 그 자리에 영영 갇힌다.
function canEnter({ mode, nextType, nextPassable, frozenAhead, trapped, hereLat, nextLat }) {
  const normal = mode === 'sea'
    ? nextType === 'sea' && !frozenAhead
    : nextType !== 'sea' && nextPassable !== false;
  if (normal) return true;
  if (!trapped) return false;
  const towardEquator = Math.abs(nextLat) < Math.abs(hereLat) - 0.0001;
  const sameElement = mode === 'sea'
    ? nextType === 'sea' || nextType === 'ice'
    : nextType !== 'sea';
  return towardEquator && sameElement;
}

// 해안이나 얼음에 뱃머리가 박혔을 때 비껴 갈 방향(라디안).
// 길을 따라가는 중이면 뒤로 돌아서라도 빠져나가고, 손으로 몰 때는 옆으로까지만 비껴 간다.
// 누르지도 않은 뒤쪽으로 배가 가면 아이가 놀란다.
const SLIDE_MANUAL = Object.freeze([Math.PI / 6, Math.PI / 3, Math.PI / 2]);
const SLIDE_ROUTED = Object.freeze([Math.PI / 6, Math.PI / 3, Math.PI / 2, (Math.PI * 2) / 3, (Math.PI * 5) / 6]);

function slideAngles(hasTarget, preferredSign) {
  const sign = preferredSign === -1 ? -1 : 1;
  const angles = [];
  for (const magnitude of hasTarget ? SLIDE_ROUTED : SLIDE_MANUAL) {
    angles.push(magnitude * sign, magnitude * -sign);
  }
  return angles;
}

module.exports = { canEnter, slideAngles, SLIDE_MANUAL, SLIDE_ROUTED };
