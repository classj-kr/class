'use strict';
const crypto = require('node:crypto');
const catalog = require('../assets/learning-record-catalog');
const games = new Map(catalog.filter(row => row.domain === '게임').map(row => [row.id,row]));
const actions = new Set(['PLAY','DRAW','ROLL','MOVE','STAY','SECRET_PASSAGE','SUGGEST','CHOOSE_CARD','ACCUSE','END_TURN',
  'HINT','GUESS','END_GUESSING','CLAIM','PROPOSE','PROPOSAL_VOTE','QUEST_VOTE','ASSASSINATE','PLACE_SECRETS',
  'HIDE','PLACE_TRICK','PLACE_CHECK','CHOOSE','TAKE','RESERVE','BUY','PASS','RETURN_GEMS','CHOOSE_PATRON','PLACE',
  'RESIGN','ACCEPT_DRAW','DECIDE','SUBMIT_DRAWING','SUBMIT_GUESS','PLANT','HARVEST','TRADE','DONATE','ACCEPT','OFFER','NEXT','END_PHASE']);
const labels = { MOVE:'말 이동',PLACE:'놓기',PLAY:'카드·타일 사용',DRAW:'카드·타일 뽑기',GUESS:'추리 응답',
  CLAIM:'짝 찾기',HINT:'단서 제시',PROPOSAL_VOTE:'원정대 투표',QUEST_VOTE:'임무 참여',
  SUBMIT_DRAWING:'그림 제출',SUBMIT_GUESS:'추측 제출',DECIDE:'탐험 선택' };
function createGameActivityRecorder(write, onError = error => console.error('Game activity could not be saved:', error.message)) {
  const rounds = new WeakMap();
  function enqueue(round, entries) {
    round.pending=(round.pending || Promise.resolve()).then(async()=>{
      for (const [req,event] of entries) for (let attempt=0;attempt<3;attempt++) {
        try {await write(req,event);break;}
        catch(error) {if(error.status===401 || error.status===403) break;if(attempt===2) onError(error);}
      }
    });
    return round.pending;
  }
  function finish(room, game) {
    const round=rounds.get(room);
    if (!round || round.finished || !['ended','finished','results'].includes(game?.phase)) return Promise.resolve();
    round.finished=true;
    return enqueue(round,[...round.actors.values()].map(req=>[req,{activity:room.gameId,context:`game:${round.id}`,
      title:games.get(room.gameId).label,kind:'activity',questionKey:'completed',eventId:crypto.randomUUID(),
      response:'한 판 완료',complete:true,snapshot:{summary:'한 판 완료'}}]));
  }
  function record(request, room, playerId, action, game) {
    const definition = games.get(room?.gameId);
    if (!definition) return Promise.resolve();
    if (['START','NEW_GAME'].includes(action)) { rounds.delete(room); return Promise.resolve(); }
    if (!actions.has(action)) return Promise.resolve();
    let round = rounds.get(room);
    if (!round || round.finished) { round={id:crypto.randomUUID(),actors:new Map(),finished:false};rounds.set(room,round); }
    const ending = ['RESIGN','ACCEPT_DRAW'].includes(action);
    if (!ending) round.actors.set(playerId,request);
    const entry = { activity:room.gameId,context:`game:${round.id}`,title:definition.label,kind:'activity',
      questionKey:action,response:labels[action] || '게임 진행',eventId:crypto.randomUUID(),snapshot:{summary:'게임 참여'} };
    // The caller invokes this only after the game has accepted the action.
    // Private cards, votes and other players' identities are deliberately omitted.
    const entries = ending && !round.actors.has(playerId) ? [] : [[request,entry]];
    enqueue(round,entries);
    finish(room,game);
    return round.pending;
  }
  record.finish=finish;
  return record;
}
module.exports={createGameActivityRecorder};
