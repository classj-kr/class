'use strict';
const {io}=require('socket.io-client');
const assert=require('node:assert/strict');
const BASE=process.env.TEST_URL||'http://127.0.0.1:3000';
const { joinFreeRoom, openRaceRoom }=require('./_rooms');
const landmarks=require('../data/catalog/city-landmarks.json');
const discoveries=require('../data/catalog/discoveries.json');
function connect(){return io(BASE,{transports:['websocket'],forceNew:true,reconnection:false,timeout:7000});}
function once(s,e,p=()=>true,t=25000){return new Promise((r,j)=>{const x=setTimeout(()=>{s.off(e,on);j(new Error(`timeout:${e}`));},t);function on(d){if(!p(d))return;clearTimeout(x);s.off(e,on);r(d)}s.on(e,on)});}
function ack(s,e,p={}){return new Promise((r,j)=>{const x=setTimeout(()=>j(new Error(`ack:${e}`)),10000);s.emit(e,p,d=>{clearTimeout(x);r(d)})});}
(async()=>{
  const sailor=connect();
  await once(sailor,'connect');
  const room=await joinFreeRoom(ack,sailor,'명소학생');
  assert.equal(room.ok,true,room.error);

  const belem=landmarks.find(x=>x.id==='lm-belem-tower');
  // 바다에 있을 때는 도시 명소가 보이지 않고, 눌러도 열리지 않는다.
  const atSea=await once(sailor,'snapshot',x=>x.you.mode==='sea');
  assert.deepEqual(atSea.cityLandmarks,[],'바다에서는 도시 명소가 없어야 한다');
  assert.equal(atSea.you.discoveryTotal,discoveries.length+landmarks.length,'찾을 곳 총수에 명소가 더해져야 한다');
  const fromSea=await ack(sailor,'inspectLandmark',{id:belem.id});
  assert.equal(fromSea.ok,false,'도시 밖에서 명소가 열리면 안 된다');

  // 리스본에 입항해서 도시로 들어간다.
  const entered=await ack(sailor,'useCatalogPort',{placeId:'lisbon'});
  assert.equal(entered.ok,true,entered.error);
  const inCity=await once(sailor,'snapshot',x=>x.you.mode==='city'&&x.you.currentCityId==='lisbon'&&!x.you.transition);
  assert.equal(inCity.cityLandmarks.length,1,'리스본 명소는 한 곳');
  const multi=landmarks.reduce((acc,x)=>{acc[x.cityId]=(acc[x.cityId]||0)+1;return acc},{});
  assert.ok(Object.values(multi).filter(n=>n>1).length>=10,'명소가 둘 이상인 도시가 충분히 있어야 한다');
  assert.equal(inCity.cityLandmarks[0].name,'벨렝탑');
  assert.equal(inCity.cityLandmarks[0].found,false,'아직 보기 전이다');

  // 눌러야 열리고, 그때 처음 본 것으로 센다.
  const opened=await ack(sailor,'inspectLandmark',{id:belem.id});
  assert.equal(opened.ok,true,opened.error);
  assert.equal(opened.first,true);
  assert.equal(opened.landmark.name,'벨렝탑');
  assert.equal(opened.landmark.todayCountry,'포르투갈');
  assert.equal(opened.landmark.built,'1514~1519년');
  assert.ok(opened.landmark.text.length>40,'설명이 와야 한다');
  assert.match(opened.landmark.image,/\/assets\/landmarks\/lm-belem-tower\.webp\?v=\d+$/,'오늘날 사진이 와야 한다');
  assert.match(opened.landmark.imageCredit,/^사진 .+ · .+ · 위키미디어 공용$/,'사진 출처를 함께 보여 줘야 한다');
  assert.equal(opened.total,discoveries.length+landmarks.length);
  assert.ok(opened.self.discoveryIds.includes(belem.id),'찾은 목록에 들어가야 한다');

  const seen=await once(sailor,'snapshot',x=>x.cityLandmarks?.[0]?.found===true);
  assert.equal(seen.cityLandmarks[0].found,true,'한 번 본 명소는 본 것으로 표시된다');

  // 다른 도시의 명소는 여기서 열 수 없다.
  const wrongCity=await ack(sailor,'inspectLandmark',{id:'lm-hagia-sophia'});
  assert.equal(wrongCity.ok,false,'다른 도시 명소가 열리면 안 된다');

  // 명소가 둘인 도시: 이스탄불에는 아야 소피아와 "블루 모스크가 설 자리"가 함께 있다.
  const teacher=connect(),student=connect();
  await Promise.all([once(teacher,'connect'),once(student,'connect')]);
  const race=await openRaceRoom(ack,teacher);
  const pub=await ack(teacher,'teacherPublishArrivalRace',{targetPlaceId:'gibraltar_strait',startPlaceIds:['istanbul','lisbon','london','havana']});
  assert.equal(pub.ok,true,pub.error);
  const joined=await ack(student,'joinClass',{roomCode:race.roomCode,name:'이스탄불학생'});
  assert.equal(joined.ok,true,joined.error);
  const option=joined.mission.startOptions.find((item)=>item.startPlace.id==='istanbul');
  assert.ok(option,'이스탄불 출발 선택지가 필요하다');
  assert.equal((await ack(student,'chooseStartCity',{optionId:option.id})).ok,true);
  assert.equal((await ack(teacher,'teacherStartArrivalRace',{})).ok,true);
  await once(student,'snapshot',x=>x.you.mode==='sea');
  const docked=await ack(student,'useCatalogPort',{placeId:'istanbul'});
  assert.equal(docked.ok,true,docked.error);
  const istanbul=await once(student,'snapshot',x=>x.you.mode==='city'&&x.you.currentCityId==='istanbul'&&!x.you.transition);
  const names=istanbul.cityLandmarks.map(x=>x.name);
  assert.ok(names.length>=3,`이스탄불에는 명소가 여럿 있어야 한다: ${names.join(',')}`);
  for(const want of ['아야 소피아','톱카프 궁전','테오도시우스 성벽','블루 모스크가 설 자리']) assert.ok(names.includes(want),`이스탄불 명소에 ${want} 없음`);
  const later=await ack(student,'inspectLandmark',{id:'lm-blue-mosque-later'});
  assert.equal(later.ok,true,later.error);
  assert.equal(later.landmark.status,'later');
  assert.match(later.landmark.text,/1609년/,'언제 세워지는지 적혀 있어야 한다');
  assert.equal(later.landmark.built,'1609~1616년');
  // 1520년에 없던 건물도 오늘날 사진은 보여 준다.
  assert.match(later.landmark.image,/\/assets\/landmarks\/lm-blue-mosque-later\.webp\?v=\d+$/);
  assert.ok(later.landmark.imageCredit.startsWith('사진 '));

  console.log(JSON.stringify({ok:true,city:'리스본',landmark:opened.landmark.name,built:opened.landmark.built,found:opened.found,total:opened.total,blockedOutsideCity:true,istanbul:names}));
  sailor.disconnect();teacher.disconnect();student.disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
