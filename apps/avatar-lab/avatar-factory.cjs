"use strict";
const aliases={cat:'animal-cat',ramen:'food-ramen',donut:'food-donut',banana:'fruit-banana',helicopter:'vehicle-helicopter',umbrella:'object-umbrella'};
const vehicles=new Set(['vehicle-hot-air-balloon','vehicle-rocket','vehicle-submarine','vehicle-train']);
function create(THREE,key){
 const id=aliases[key]||key,custom=Object.keys(aliases).find(k=>aliases[k]===id);
 if(custom)return require('./'+custom+'-model.cjs')(THREE);
 if(['vehicle-rocket','vehicle-hot-air-balloon'].includes(id))return require('./flight-costumes.cjs')(THREE,id);
 if(id==='vehicle-submarine')return require('./submarine-costume.cjs')(THREE);
 if(id==='vehicle-train')return require('./train-costume.cjs')(THREE);
 if(id==='vehicle-airplane')return require('./airplane-costume.cjs')(THREE);
 if(id==='vehicle-airship')return require('./airship-costume.cjs')(THREE);
 if(id==='vehicle-ambulance')return require('./ambulance-costume.cjs')(THREE);
 if(id==='vehicle-fire-truck')return require('./fire-truck-costume.cjs')(THREE);
 if(id==='vehicle-boat')return require('./boat-costume.cjs')(THREE);
 if(vehicles.has(id))return require('./vehicle-models.cjs')(THREE,id);
 if(id.startsWith('sport-'))return require('./sport-models.cjs')(THREE,id);
 return require('./collection-model.cjs')(THREE,id);
}
module.exports={create,aliases,vehicles};
