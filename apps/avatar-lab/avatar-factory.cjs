"use strict";
const aliases={cat:'animal-cat',ramen:'food-ramen',donut:'food-donut',banana:'fruit-banana',helicopter:'vehicle-helicopter',umbrella:'object-umbrella'};
const vehicles=new Set(['vehicle-hot-air-balloon','vehicle-rocket','vehicle-submarine','vehicle-train']);
function create(THREE,key){
 const id=aliases[key]||key,custom=Object.keys(aliases).find(k=>aliases[k]===id);
 if(custom)return require('./'+custom+'-model.cjs')(THREE);
 if(id==='animal-bee')return require('./bee-model.cjs')(THREE);
 if(vehicles.has(id))return require('./vehicle-models.cjs')(THREE,id);
 if(id.startsWith('sport-'))return require('./sport-models.cjs')(THREE,id);
 return require('./collection-model.cjs')(THREE,id);
}
module.exports={create,aliases,vehicles};
