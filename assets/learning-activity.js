/* Explicit learning actions only. No page-view, click-count, timer or local storage tracking. */
(function () {
  'use strict';
  if (window.LearningActivity) return;
  const pending = new Map();
  let context, flushing;
  async function mode() {
    context ||= fetch('/api/learning-records/context', {credentials:'same-origin',cache:'no-store'})
      .then(async r => r.ok ? (await r.json()).mode : r.status===401 ? 'preview' : Promise.reject(new Error('기록 연결 실패')))
      .catch(error => {context=null;throw error;});
    return context;
  }
  async function send(entry) {
    const response = await fetch('/api/learning-records/actions', {method:'POST',credentials:'same-origin',
      headers:{'Content-Type':'application/json'},body:JSON.stringify(entry),keepalive:true});
    if (!response.ok) throw new Error(`활동 저장 실패 (${response.status})`);
    pending.delete(entry.eventId);
  }
  function flush() {
    if (flushing) return flushing;
    flushing = drain().finally(()=>{flushing=null;});
    return flushing;
  }
  async function drain() {
    try {
      if (await mode()!=='student') {pending.clear();return;}
      for (const event of pending.values()) {
        for(let attempt=0;attempt<3;attempt++) {
          try {await send(event);break;}
          catch(error) {if(attempt===2) throw error;await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));}
        }
      }
    } catch(error) {console.warn('[learning-activity]',error.message);}
  }
  function record(entry) {
    const event = JSON.parse(JSON.stringify({kind:'activity',...entry,eventId:crypto.randomUUID()}));
    pending.set(event.eventId,event);
    return flush();
  }
  function round(activity, title) {
    let id=crypto.randomUUID(), started=false, finished=false;
    const save=(questionKey,summary,complete=false)=>record({activity,context:id,title:title(),questionKey,
      response:summary,snapshot:{summary},complete});
    return {start(){if(started) return;started=true;return save('participation','퍼즐 풀이');},
      finish(summary){if(finished) return;finished=true;return save('completed',summary,true);},
      reset(){id=crypto.randomUUID();started=false;finished=false;}};
  }
  addEventListener('online',()=>{if(pending.size) flush();});
  addEventListener('pagehide',()=>{if(pending.size) flush();});
  window.LearningActivity=Object.freeze({record,round});
})();
