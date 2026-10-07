// Configured child apps fail closed; standalone development uses its own allocator.
async function requestRoomCode(activity, standalone) {
  const endpoint = process.env.SITE_ROOM_CODE_URL, secret = process.env.SITE_ROOM_CODE_KEY;
  if (!endpoint && !secret) return standalone();
  if (!endpoint || !secret) throw new Error('방번호 서비스 설정을 확인해 주세요.');
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Room-Code-Key': secret },
    body: JSON.stringify({ activity }), signal: AbortSignal.timeout(8000), redirect: 'error'
  });
  const payload = await response.json();
  if (!response.ok || !/^\d{4}$/.test(payload.code)) throw new Error('방번호를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.');
  return payload.code;
}
module.exports = { requestRoomCode };
