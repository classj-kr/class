'use strict';
const assert=require('node:assert/strict');
const Ships=require('../public/js/ship-designs');
const Catalog=require('../lib/mission-catalog');
const profiles=require('../data/catalog/ship-origins.json').ports;
const ports=Catalog.publicCatalog().places.filter(c=>c.isOriginalCity&&c.canEnterFromSea);
const lookup=id=>{const c=ports.find(p=>p.id===id);return c?{...c,...profiles[id]}:null};
assert.equal(Object.keys(profiles).length,ports.length,'Every valid start needs an explicit design');
for(const city of ports){
  const profile=profiles[city.id];
  assert.ok(profile,city.name);assert.ok(Ships.validType(profile.shipType),city.name);
  assert.ok(profile.shipScale>=.8&&profile.shipScale<=1.15);
  if(profile.sourceRow!==null)assert.equal(profile.sourceRow,city.originalOrder+2+(city.originalOrder>=159?1:0),'Account for the source-only Pegu row');
}
for(const [id,sourceName] of Object.entries({lisbon:'리스본',malacca:'말라카',original_city_052:'오문',original_city_035:'한양',nagasaki:'나가사키',havana:'아바나',original_city_005:'툼베스'}))assert.equal(profiles[id].sourceCityName,sourceName,'Source identity must match '+id);
assert.equal(profiles.nagasaki.sourceShipyard,true);assert.equal(profiles.havana.sourceShipyard,true);assert.equal(profiles.original_city_035.sourceShipyard,false);
const examples={lisbon:'galleon',original_city_223:'caravel',original_city_215:'coaster',london:'carrack',original_city_099:'dhow',original_city_035:'hanseon',nagasaki:'wasen',original_city_051:'junk',malacca:'jong',original_city_020:'canoe',original_city_005:'balsa'};
for(const [id,type] of Object.entries(examples))assert.equal(Ships.forPort(lookup(id)),type,id);
const mission={kind:'arrivalRace',startOptions:ports.map(startPlace=>({id:startPlace.id,startPlace}))};
for(const [id,type] of Object.entries(examples)){
  const progress={selectedStartPlaceId:id,shipPortId:'lisbon'};
  const ship=Ships.selection('race',mission,progress,lookup);
  assert.equal(ship.type,type);assert.equal(ship.originId,id);
  assert.deepEqual(Ships.selection('race',mission,JSON.parse(JSON.stringify(progress)),lookup),ship,'Reloaded progress must restore the same ship');
  progress.shipPortId='nagasaki';assert.deepEqual(Ships.selection('race',mission,progress,lookup),ship,'Visiting another port must not replace the ship');
  progress.status='completed';assert.deepEqual(Ships.selection('race',mission,progress,lookup),ship);
}
assert.equal(Ships.selection('free',mission,{selectedStartPlaceId:'lisbon'},lookup),null);
assert.equal(Ships.selection('race',mission,{},lookup),null);
assert.equal(Ships.selection('race',mission,{selectedStartPlaceId:'not-an-option'},lookup),null);
assert.equal(Ships.selection('race',null,{selectedStartPlaceId:'lisbon'},lookup),null);
assert.equal(Ships.selection('race',{kind:'startChoiceSet',startOptions:[{id:'choice-a',startPlace:{id:'lisbon',name:'리스본'}}]},{selectedMissionId:'choice-a'},lookup).type,'galleon');
assert.equal(Ships.validType('__proto__'),false);
// Ship definitions must remain purely visual; all racers share movement physics.
for(const ship of Object.values(Ships.designs))for(const key of ['speed','speedMultiplier','collisionRadius','windMultiplier'])assert.equal(ship[key],undefined);
console.log(JSON.stringify({ok:true,ports:ports.length,designs:Object.keys(Ships.designs).length,originStable:true,freeModeUnchanged:true}));
