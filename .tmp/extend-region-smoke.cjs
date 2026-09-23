const fs=require('node:fs'),path=require('node:path');const file=path.resolve(__dirname,'../learning/inquiry/age-of-exploration/tests/place-study-smoke.js');
let s=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const before="    console.log(JSON.stringify({ok:true,mixedTargets:3,unorderedVisits:true,consecutiveReset:true,replayRejected:true,reconnect:true,paused:true,cityRequiresEntry:true,teacherProgress:true}));";
const after=`    // Geographic discoveries accept distant parts of the same region, not a single marker.
    const regionKeys=['discovery:andes','discovery:alps','discovery:sahara'];
    const regionMission=await teach('teacherPublishArrivalRace',{startPlaceIds:starts,studyTargets:regionKeys});
    assert.equal(regionMission.ok,true,regionMission.error);
    assert.equal((await ack('chooseStartCity',{optionId:starts[0]})).ok,true);
    assert.equal((await teach('teacherStartArrivalRace')).ok,true);
    const regionStep=(event,key,extra={})=>ack(event,{key,missionId:regionMission.mission.id,...extra});
    await place({lat:-20,lon:-55});
    assert.equal((await regionStep('readStudyPlace',regionKeys[0])).ok,false,'outside the Andes is rejected');
    await place({lat:-33,lon:-70,mode:'sea'});
    assert.equal((await regionStep('readStudyPlace',regionKeys[0])).ok,false,'an inland region requires landing');
    const overlapping=await place({lat:-13.1631,lon:-72.545});
    assert.equal(overlapping.state.discoveryInteraction.id,'andes','assigned region remains available beside a specific landmark');
    for(const[key,lat,lon]of[[regionKeys[0],-33,-70],[regionKeys[1],47,13],[regionKeys[2],26,-5]]){
      const placed=await place({lat,lon});assert.equal(placed.state.discoveryInteraction.id,key.split(':')[1]);
      r=await regionStep('readStudyPlace',key);assert.equal(r.ok,true,r.error);
      r=await regionStep('startStudyQuiz',key);
      for(let i=0;i<3;i++){
        const q=regionMission.mission.studyTargets.find(t=>t.key===key).questions[r.study.streak];
        r=await regionStep('answerStudyQuestion',key,{token:r.study.question.token,choice:r.study.question.choices.indexOf(q.answer)});
        assert.equal(r.ok,true,r.error);
      }
      assert.equal(r.study.phase,'completed');
      if(key===regionKeys[0]){
        const after=await place({lat:-13.1631,lon:-72.545});
        assert.equal(after.state.discoveryInteraction.id,'machu-picchu','completed wide region does not hide a nearby landmark');
      }
    }
    assert.equal(r.progress.status,'completed');assert.equal(r.progress.finishRank,1);
    console.log(JSON.stringify({ok:true,mixedTargets:3,unorderedVisits:true,consecutiveReset:true,replayRejected:true,reconnect:true,paused:true,cityRequiresEntry:true,teacherProgress:true,geographicRegions:3,nearbyLandmarkPriority:true}));`;
if(!s.includes(before))throw Error('Smoke insertion point missing');s=s.replace(before,after);fs.writeFileSync(file,s);
console.log('Wide-region mission completion added to server smoke test.');
