const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const base=path.resolve(__dirname,'../learning/inquiry/age-of-exploration');
const raw=fs.readFileSync(path.join(__dirname,'ne-study-regions.geojson')),source=JSON.parse(raw);
const names={
 'ural-mountains':'URAL MOUNTAINS',alps:'ALPS','gobi-desert':'GOBI DESERT','rocky-mountains':'ROCKY MOUNTAINS',
 'taklamakan-desert':'TAKLIMAKAN DESERT','pamir-plateau':'PAMIRS','appalachian-mountains':'APPALACHIAN MTS.',
 'tibetan-plateau':'PLATEAU OF TIBET','atlas-mountains':'ATLAS MOUNTAINS',himalayas:'HIMALAYAS',
 'thar-desert':'THAR DESERT',sahara:'SAHARA','deccan-plateau':'DECCAN PLATEAU','rwenzori-mountains':'Ruwenzori Range',
 great_rift_valley:'GREAT RIFT VALLEY',andes:'ANDES','salar-de-uyuni':'Salar de Uyuni','namib-desert':'NAMIB DESERT','atacama-desert':'DESIERTO DE ATACAMA'
};
const regions={};
for(const[id,name]of Object.entries(names)){
 const features=source.features.filter(f=>(f.properties.name||f.properties.NAME)===name);if(!features.length)throw Error('Missing '+name);
 const polygons=features.flatMap(f=>f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates]).map(poly=>poly.map(ring=>ring.map(([lon,lat])=>[Number(lat.toFixed(4)),Number(lon.toFixed(4))])));
 const points=polygons.flat(2),lats=points.map(p=>p[0]),lons=points.map(p=>p[1]);
 regions[id]={name,bounds:{north:Math.max(...lats),south:Math.min(...lats),west:Math.min(...lons),east:Math.max(...lons)},polygons};
}
const metadata={source:'Natural Earth 1:10m geography regions polygons',sourceUrl:'https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-physical-labels/',downloadUrl:'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_geography_regions_polys.geojson',sha256:crypto.createHash('sha256').update(raw).digest('hex'),retrieved:'2026-09-23',note:'Generalized physical regions for game arrival checks, not precise terrain or legal boundaries. Coordinate order: latitude, longitude; polygon rings retain holes.'};
const output='{\n  "metadata": '+JSON.stringify(metadata)+',\n  "regions": {\n'+Object.entries(regions).map(([id,region])=>'    '+JSON.stringify(id)+': '+JSON.stringify(region)).join(',\n')+'\n  }\n}\n';
fs.writeFileSync(path.join(base,'data/catalog/discovery-regions.json'),output);
const catalogFile=path.join(base,'data/catalog/discoveries.json'),original=fs.readFileSync(catalogFile,'utf8'),items=JSON.parse(original);
for(const item of items)if(regions[item.id])item.discoveryArea={type:'region'};
let updated=JSON.stringify(items,null,2)+'\n';if(original.includes('\r\n'))updated=updated.replace(/\n/g,'\r\n');fs.writeFileSync(catalogFile,updated);
console.log(JSON.stringify({regions:Object.keys(regions).length,vertices:Object.values(regions).reduce((n,r)=>n+r.polygons.flat().reduce((n,p)=>n+p.length,0),0),bytes:output.length}));
