'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {harness}=require('./learning-records-integration.cjs');
const {createActivityWriter,storageEvidence}=require('../game-hub-server/learning-record-sources');
const {STUDENT_SQL}=require('../game-hub-server/learning-records');
const {createGameActivityRecorder}=require('../game-hub-server/game-activity-records');
async function main(){
  const h=await harness({withStorage:true});
  const writer=createActivityWriter({pool:h.pool,membershipSql:STUDENT_SQL});
  const user={id:1,email:'a@school.kr'};
  const today=new Date(Date.now()+32400000).toISOString().slice(0,10);
  const yesterday=new Date(Date.parse(today)-86400000).toISOString().slice(0,10);
  const savedAt=yesterday+'T01:00:00Z';
  const report=async(query='')=>{const r=await fetch(h.base+'/api/learning-records/teacher/report?classId=10:2026:4:1'+query,{headers:{'x-test-user':'3'}});assert.equal(r.status,200);return r.json();};
  try{
    for(const row of [
      {app:'typing',item:'typing-session-v1',value:{mode:'words',index:0}},
      {app:'typing',item:'typing-recent-words-ko-all',value:['학교']},
      {app:'handwriting',item:'cell-size',value:25},
      {app:'handwriting',item:'draft',value:{text:'가',cells:{trace:[[]],solo:[[]]}}},
      {app:'ear-training',item:'saved',value:{setup:{interval:{level:3}},stats:{}}},
      {app:'geoboard',item:'board',value:{scenes:{5:[],9:[]},color:'blue'}},
      {app:'number-models',item:'board',value:{scenes:{whole:{counts:[0,1,2,3]},decimal:{counts:[1,2,3,0]}}}},
      {app:'fraction-board',item:'board',value:{cards:[{shape:'bar',denominator:8,cells:[0,1,2],labels:false}]}},
      {app:'graph-studio',item:'current',value:{...require('../learning/literacy-numeracy/math-tools/graph-studio/graph-core').initialState(),showCoordinates:false}},
      {app:'typing',item:'typing-records-v1',value:{bad:null}},
      {app:'school-chat',item:'messages',value:[{text:'private'}]}
    ]){assert.deepEqual(storageEvidence(row),[]);await writer.captureStorage(user,row);}
    assert.equal((await report()).sessions.length,0,'opens, settings and non-learning data stay excluded');
    const stored={app:'typing',item:'typing-records-v1',value:{'words-ko-all':{mode:'words',completions:2,bestSpeed:124,bestAccuracy:96,lastDate:savedAt}},updated_at:savedAt};
    await writer.captureStorage(user,stored,true);
    assert.equal((await report()).sessions.length,0,'historical data does not become today activity');
    let all=await report('&period=all');
    assert.equal(all.sessions.length,1);
    assert.equal(all.sessions[0].summary.firstScored,0,'cumulative and game data never pretend to be first answers');
    assert.equal(all.sessions[0].summary.activityCount,1);
    assert.match(all.sessions[0].summary.activitySummary,/124타/);
    await writer.captureStorage(user,stored,true);
    await writer.captureStorage(user,stored);
    assert.equal((await report()).sessions.length,0,'imports and identical restored snapshots are idempotent');
    stored.value['words-ko-all'].completions++;
    await writer.captureStorage(user,stored);
    assert.equal((await report()).sessions.length,1);
    const settings={app:'ear-training',item:'saved',value:{stats:{interval:{q1:{right:1,total:2}}},setup:{volume:0.4}}};
    await writer.captureStorage(user,settings);
    settings.value.setup.volume=0.9;
    await writer.captureStorage(user,settings);
    assert.equal((await report()).sessions.find(s=>s.activity==='ear-training').summary.activityCount,1,'preference changes do not create work');
    await writer.captureStorage({id:3,email:'teacher@school.kr'},stored);
    assert.equal((await h.pool.query('SELECT COUNT(*)::int AS n FROM learning_record_sessions WHERE user_id=3')).rows[0].n,0);
    await writer.captureStorage({id:2,email:'b@school.kr'},stored);
    assert.equal((await report()).sessions.some(s=>s.userId==='2'),false,'school isolation');

    const calls=[], recorder=createGameActivityRecorder(async(req,event)=>{calls.push([req,event]);await writer.record(req,event);},error=>{throw error;});
    const room={gameId:'chess'},game={phase:'playing'};
    await recorder(user,room,'p1','START',game);await recorder(user,room,'p1','SETTINGS',game);
    assert.equal(calls.length,0,'lobby and settings are not participation');
    await recorder(user,room,'p1','MOVE',game);
    await recorder({id:5,email:'old@school.kr'},room,'p2','MOVE',game);
    game.phase='ended';await recorder(user,room,'p1','MOVE',game);
    const gameRows=(await report()).sessions.filter(s=>s.activity==='chess');
    assert.equal(gameRows.length,2);assert.ok(gameRows.every(s=>s.status==='completed'&&s.summary.firstScored===0));
    const timeoutRoom={gameId:'chess'},timeoutGame={phase:'playing'};
    await recorder(user,timeoutRoom,'p1','MOVE',timeoutGame);
    timeoutGame.phase='ended';await recorder.finish(timeoutRoom,timeoutGame);await recorder.finish(timeoutRoom,timeoutGame);
    assert.equal((await report()).sessions.filter(s=>s.activity==='chess'&&s.status==='completed').length,3,'clock expiry completes only actual participants, once');
    const body={activity:'curriculum-vocabulary',context:'unit:round',title:'교과 어휘 · 1단원',questionKey:'낱말',kind:'answer',
      response:'답',correct:false,snapshot:{prompt:'뜻 고르기'},eventId:crypto.randomUUID(),progress:0,total:3};
    const submit=async(userId,payload)=>fetch(h.base+'/api/learning-records/actions',{method:'POST',headers:{'Content-Type':'application/json','x-test-user':String(userId)},body:JSON.stringify(payload)});
    assert.equal((await submit(1,body)).status,200);assert.equal((await submit(1,body)).status,200);
    let row=(await report()).sessions.find(s=>s.activity==='curriculum-vocabulary');
    assert.equal(row.summary.firstScored,1);assert.equal(row.summary.retryCount,0);
    assert.equal((await submit(1,{...body,eventId:crypto.randomUUID(),correct:true})).status,200);
    row=(await report()).sessions.find(s=>s.activity==='curriculum-vocabulary');
    assert.equal(row.summary.firstCorrect,0);assert.equal(row.summary.retryCount,1);
    assert.equal((await submit(3,body)).status,403);
    assert.equal((await submit(1,{...body,progress:-1})).status,400);
    assert.equal((await submit(1,{...body,kind:'open'})).status,400);
    const examples=[
      ['handwriting','draft',{text:'가',cells:{trace:[[{points:[[15,15],[70,80]],width:3.9}]],solo:[[]]}}],
      ['korean-history','hanguksa-done',{q10:'right',q2:'wrong'}],
      ['computer-literacy','computer-literacy:a01',{completed:true,score:3,updatedAt:new Date().toISOString()}],
      ['korea-map','classj-korea-geography-progress-v2',{total:3,correct:2,items:{}}],
      ['music-studio','practice',{date:today,count:1}],
      ['museum','finaleRooms',{room1:true}],['park','finaleStamp',true],
      ['geoboard','board',{scenes:{5:[{points:[0,1,2]}]}}],
      ['number-models','board',{scenes:{whole:{counts:[0,1,2,4]}}}],
      ['fraction-board','board',{cards:[{shape:'bar',denominator:4,cells:[0]}]}],
      ['graph-studio','scenes',[{id:'a',state:{title:'탐구한 그래프',functions:[]},savedAt:new Date().toISOString()}]]
    ];
    for(const [app,item,value] of examples){
      const res=await fetch(`${h.base}/api/me/storage/${app}/${encodeURIComponent(item)}`,{method:'PUT',headers:{'x-test-user':'1','Content-Type':'application/json'},body:JSON.stringify({value})});
      assert.equal(res.status,200,app);assert.ok((await report()).sessions.some(s=>s.activity===app),app+' storage API reaches reports');
    }
    const writing = (await report()).sessions.find(s=>s.activity==='handwriting');
    const writingDetail = async () => (await (await fetch(h.base+'/api/learning-records/teacher/sessions/'+writing.id,
      {headers:{'x-test-user':'3'}})).json()).session;
    assert.deepEqual((await writingDetail()).checkpoint.handwriting.trace[0][0].points, [[15,15],[70,80]]);
    await h.pool.query("UPDATE learning_record_sessions SET checkpoint='{}' WHERE id=$1",[writing.id]);
    await h.feature.importStored();
    assert.deepEqual((await writingDetail()).checkpoint.handwriting.trace[0][0].points, [[15,15],[70,80]]);
    assert.equal((await writingDetail()).events.length,1);
    // Restart recovery imports previously saved account data without rewriting its date.
    const countBeforeImport=(await report('&period=all')).sessions.length;
    const eventsBeforeImport=(await h.pool.query('SELECT COUNT(*)::int AS n FROM learning_record_events')).rows[0].n;
    await h.pool.query('INSERT INTO user_storage(user_id,app,item,value,updated_at) VALUES($1,$2,$3,$4::jsonb,$5)',[1,'nonogram','best-5',JSON.stringify({time:54}),savedAt]);
    await h.feature.importStored();await h.feature.importStored();
    assert.equal((await report('&period=all')).sessions.length,countBeforeImport+1,'JSONB key ordering and restart do not duplicate existing activity');
    assert.equal((await h.pool.query('SELECT COUNT(*)::int AS n FROM learning_record_events')).rows[0].n,eventsBeforeImport+1,'recovery never duplicates snapshot events');
    await h.pool.query("UPDATE learning_record_source_state SET fingerprint='previous-projection'");
    await h.feature.importStored();
    assert.equal((await h.pool.query('SELECT COUNT(*)::int AS n FROM learning_record_events')).rows[0].n,eventsBeforeImport+1,'projection upgrades preserve historical evidence exactly once');
    assert.equal((await report('&period=all')).sessions.filter(s=>s.activity==='nonogram').length,1);
    assert.equal((await report()).sessions.filter(s=>s.activity==='nonogram').length,0);
    // Even a snapshot replayed by an earlier deployment is one historical fact.
    const importedRow=(await report('&period=all')).sessions.find(s=>s.activity==='nonogram');
    await h.pool.query(`INSERT INTO learning_record_events(session_id,kind,question_key,response,snapshot,correct,scoring_source,attempt_number,recorded_at)
      SELECT session_id,kind,question_key,response,snapshot,correct,scoring_source,attempt_number+1,recorded_at
      FROM learning_record_events WHERE session_id=$1`,[importedRow.id]);
    const detail=await (await fetch(h.base+'/api/learning-records/teacher/sessions/'+importedRow.id,{headers:{'x-test-user':'3'}})).json();
    assert.equal(detail.session.events.length,1);assert.equal(detail.session.summary.activityCount,1);
    assert.equal((await report('&period=all')).sessions.find(s=>s.id===importedRow.id).summary.activityCount,1);
    console.log('PASS source reports: legacy timestamps, meaningful saved work, idempotence, preference exclusion, school isolation, game participation/completion, first answer/retry preservation.');
  }finally{await h.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
