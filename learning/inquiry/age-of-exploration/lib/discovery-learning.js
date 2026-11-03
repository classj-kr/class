'use strict';
const data=require('../data/catalog/discovery-learning.json');
const LABELS=Object.freeze({core:'기본 추천',support:'주제 탐구',extended:'추가 자료',later:'후대 문화'});
const LEVEL_LABELS=Object.freeze({elementary:'초등',middle:'중학',high:'고등'});
function canonicalId(id){return data.entries[id]?.canonicalId||id;}
function canonicalKey(key){const [type,id,...extra]=String(key).split(':');return !extra.length&&type==='landmark'&&canonicalId(id)!==id?'discovery:'+canonicalId(id):key;}
function learningFor(id){
  const entry=data.entries[id];if(!entry)return null;
  const canonical=data.entries[canonicalId(id)]||entry;
  const effective=entry.canonicalId?{...canonical,...entry,tier:canonical.tier}:entry;
  const topic=data.topics[effective.topic],levels=effective.levels||topic.levels;
  const tier=effective.tier;
  return {tier,label:LABELS[tier],topic:effective.topic,objective:effective.objective||topic.objective,levels:[...levels],levelLabels:levels.map(x=>LEVEL_LABELS[x]),standards:[...(effective.standards||topic.standards)],
    valuable:effective.valuable===true,recommended:tier==='core'||effective.valuable===true,
    counted:!['extended','later'].includes(tier),canonicalId:canonicalId(id),alias:!!entry.canonicalId};
}
function decorate(item){return {...item,learning:learningFor(item.id)};}
function uniqueIds(ids){return [...new Set((ids||[]).map(canonicalId))];}
function hasFound(ids,id){return (ids||[]).some(found=>canonicalId(found)===canonicalId(id));}
function foundCount(ids){return uniqueIds(ids).filter(id=>learningFor(id)?.counted).length;}
function collectionTotal(items){return foundCount(items.map(item=>item.id));}
function visibleOnMap(item){return item.learning?.counted!==false;}
module.exports={data,LABELS,LEVEL_LABELS,canonicalId,canonicalKey,learningFor,decorate,uniqueIds,hasFound,foundCount,collectionTotal,visibleOnMap};
