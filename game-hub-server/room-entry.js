const express = require('express');

function createRoomEntry({ roomCodes, arithmeticPort, voyagePort, legacyVoyageRoomExists = () => false, rhythmExists = () => false, handwritingExists = () => false, stackingExists = () => false, typingExists = () => false, koreanExists = () => false, gameRoom = () => null, fetchImpl = fetch }) {
  const router = express.Router();
  router.get('/resolve/:code', async (req, res) => {
    const code = req.params.code;
    res.set('Cache-Control', 'no-store');
    if (!/^\d{4}$/.test(code)) return res.status(400).json({ message: '방번호 4자리를 입력해 주세요.' });
    try {
      const entry = await roomCodes.lookup(code);
      const activity = entry?.activity || (legacyVoyageRoomExists(code) ? 'voyage' : 'legacy');
      if (activity === 'board') return res.json({ type: activity, href: `/boards/?code=${code}` });
      if (activity === 'stacking-board') return res.json({ type: activity, href: `/learning/literacy-numeracy/math-tools/stacking-cubes/coop/?code=${code}` });
      if (activity === 'exam') return res.json({ type: activity, href: `/exams/?code=${code}` });
      if (activity === 'handwriting') {
        if (!handwritingExists(code)) return res.status(404).json({ message: '해당 방을 찾을 수 없습니다.' });
        return res.json({ type: activity, href: `/learning/literacy-numeracy/handwriting/race/?room=${code}` });
      }
      if (activity === 'stacking') {
        if (!stackingExists(code)) return res.status(404).json({ message: '해당 방을 찾을 수 없습니다.' });
        return res.json({ type: activity, href: `/learning/literacy-numeracy/math-tools/stacking-cubes/race/?room=${code}` });
      }
      if (activity === 'typing') {
        if (!typingExists(code)) return res.status(404).json({ message: '해당 방을 찾을 수 없습니다.' });
        return res.json({ type: activity, href: `/learning/inquiry/information-computing/typing/race/?room=${code}` });
      }
      if (activity === 'korean') {
        if (!koreanExists(code)) return res.status(404).json({ message: '해당 방을 찾을 수 없습니다.' });
        return res.json({ type: activity, href: `/learning/literacy-numeracy/korean-race/?room=${code}` });
      }
      if (activity === 'rhythm') {
        if (!rhythmExists(code)) return res.status(404).json({ message: '해당 방을 찾을 수 없습니다.' });
        return res.json({ type: activity, href: `/learning/arts/music-theory/rhythm-training/?room=${code}&entry=main` });
      }
      if (['legacy', 'vote', 'seating', 'school-election'].includes(activity)) return res.redirect(307, `/api/vote/resolve/${code}`);
      // 보드게임 방: 방을 만든 화면으로 보내고, 그 화면의 대기실이 ?join= 번호로 바로 참가한다.
      if (activity.startsWith('game:')) {
        const room = gameRoom(activity.slice(5), code);
        if (!room) return res.status(404).json({ message: '해당 방을 찾을 수 없습니다.' });
        return res.json({ type: 'game', href: `${room.entryPath}?join=${code}` });
      }
      // 여기까지 오지 않은 활동은 각 화면에서 입장한다.
      if (!['arithmetic', 'voyage'].includes(activity)) return res.status(404).json({ message: '이 방은 해당 게임에서 입장해 주세요.' });
      const arithmetic = activity === 'arithmetic';
      const target = arithmetic
        ? `http://127.0.0.1:${arithmeticPort}/api/arithmetic-race/entry?room=${code}`
        : `http://127.0.0.1:${voyagePort}/api/room-entry/${code}`;
      const response = await fetchImpl(target, { signal: AbortSignal.timeout(4000), redirect: 'error' });
      if (response.status === 404) return res.status(404).json({ message: '해당 방을 찾을 수 없습니다.' });
      if (response.status === 409) return res.status(409).json({ message: '이미 시작했거나 입장이 닫힌 방입니다.' });
      if (!response.ok) throw new Error('Room service unavailable');
      return res.json({ type: activity, href: arithmetic
        ? `/arithmetic/race?room=${code}&entry=main`
        : `/learn/world-voyage/?room=${code}&entry=main` });
    } catch {
      return res.status(503).json({ message: '방에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.' });
    }
  });
  return router;
}
module.exports = { createRoomEntry };
