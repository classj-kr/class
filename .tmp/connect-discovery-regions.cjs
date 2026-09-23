const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'../learning/inquiry/age-of-exploration');
function edit(file,changes){const p=path.join(base,file),original=fs.readFileSync(p,'utf8');let s=original.replace(/\r\n/g,'\n');for(const[a,b]of changes){if(!s.includes(a))throw Error('Missing '+file+': '+a.slice(0,100));s=s.replace(a,b);}fs.writeFileSync(p,original.includes('\r\n')?s.replace(/\n/g,'\r\n'):s);}
edit('lib/discovery-access.js',[
 ["const GeoMotion = require('../public/js/geo-motion.js');","const GeoMotion = require('../public/js/geo-motion.js');\nconst { createRegionAccess } = require('./discovery-regions.js');"],
 ["    if (item.discoveryArea?.type === 'waterbody') areas.set(item.id, waterbodyArea(item.discoveryArea, terrainAtCell, terrain));","    if (item.discoveryArea?.type === 'waterbody') areas.set(item.id, waterbodyArea(item.discoveryArea, terrainAtCell, terrain));\n    if (item.discoveryArea?.type === 'region') areas.set(item.id, createRegionAccess(item.id, terrainAtCell, terrain, radius));"],
 ["    if (!area) return { distance: distance(player, item), canUse };","    if (!area) return { distance: distance(player, item), canUse };\n    if (typeof area === 'function') return area(player, canUse);"]
]);
edit('server.js',[
 ["  let bestDistance = Infinity;\n  for (const item of RESOLVED_DISCOVERIES)","  let bestDistance = Infinity, bestPriority = Infinity;\n  const mission=store.room(p.roomCode).activeMission;\n  const progress=mission?.studyTargets?store.studentProgress(p.roomCode,p.name,mission.id):null;\n  for (const item of RESOLVED_DISCOVERIES)"],
 ["    if (d > DISCOVERY_RADIUS_TILES * TILE || d >= bestDistance) continue;\n    best = { ...item, discoveryAccess: access };\n    bestDistance = d;","    if (d > DISCOVERY_RADIUS_TILES * TILE) continue;\n    const key='discovery:'+item.id;\n    const assigned=mission?.studyTargets?.some(t=>t.key===key)&&progress?.placeStudy?.places?.[key]?.phase!=='completed';\n    const priority=!access.canUse?3:assigned?0:item.discoveryArea?.type==='region'?2:1;\n    if(priority>bestPriority||(priority===bestPriority&&d>=bestDistance))continue;\n    best = { ...item, discoveryAccess: access };\n    bestDistance = d;bestPriority=priority;"],
 ["message:best.discoveryArea ? '해안에서 살펴보기'","message:best.discoveryArea?.type==='waterbody' ? '해안에서 살펴보기'"]
]);
console.log('Discovery proximity now recognizes geographic regions.');
