// Reuse the site's Natural Earth geography, not textbook raster reproductions.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const countries = JSON.parse(read('learning/inquiry/globe/data/atlas-countries.json'));
const shapes = JSON.parse(read('learning/inquiry/globe/data/shapes.json'));
const ctx = { window: {} };
vm.runInNewContext(read('learning/inquiry/globe/data/globe-data.js'), ctx);
const riverNames = ['나일강','티그리스강','유프라테스강','인더스강','아마존강','장강','양쯔강','황허강','황하','메콩강','한강','남한강','북한강','낙동강','금강','영산강'];
const aliases = { '황허':'황허강', '창장강':'장강' };
const domesticRivers = JSON.parse(read('learning/inquiry/korea-map/data/major-rivers.geojson')).features.filter(f=>riverNames.includes(f.properties.name));
const domesticNames = new Set(domesticRivers.map(f=>f.properties.name));
const rivers = ctx.window.GLOBE_DATA.rivers.features.map(f=>({...f,properties:{...f.properties,name:aliases[f.properties.name]||f.properties.name}})).filter(f => riverNames.includes(f.properties.name)&&!domesticNames.has(f.properties.name));
rivers.push(...domesticRivers);
const mountains = ['알프스산맥','히말라야산맥','로키산맥','안데스산맥'].map(name => ({ type:'Feature', properties:{name}, geometry:shapes['mountain:'+name] }));
const korea = JSON.parse(read('learning/inquiry/blank-map/korea-outline.json')).features;
const data = {
  source: 'Natural Earth; reused from globe/data. Domestic river centerlines: OpenStreetMap contributors, ODbL, reused from korea-map/data/major-rivers.geojson. Point locations are representative, not territorial extents.',
  world: { type:'FeatureCollection', features:countries.features.map(f=>({ ...f, properties:{} })) },
  korea: { type:'FeatureCollection', features:korea },
  rivers: { type:'FeatureCollection', features:rivers },
  mountains: { type:'FeatureCollection', features:mountains },
};
for (const f of [...korea,...mountains]) if (!f.geometry) throw new Error('Missing geometry: '+f.properties.name);
const target = path.join(root,'learning/inquiry/blank-map/map-data.json');
fs.writeFileSync(target, JSON.stringify(data));
console.log(`Built ${path.relative(root,target)} (${fs.statSync(target).size} bytes); rivers: ${rivers.map(f=>f.properties.name).join(', ')}`);
