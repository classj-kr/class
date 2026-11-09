"use strict";
const tails={
 crocodile:{color:'#709941',center:[444,514],outline:[[360,571],[364,568],[368,561],[371,543],[402,548],[457,547],[493,540],[525,527],[543,515],[557,502],[565,492],[573,478],[575,471],[575,463],[573,459],[566,455],[559,455],[553,457],[542,466],[533,462],[527,462],[522,464],[516,471],[504,467],[497,469],[490,476],[482,470],[474,469],[468,471],[462,476],[459,471],[449,463],[438,462],[433,464],[433,455],[360,455]]},
 dragon:{color:'#679349',center:[418,530],outline:[[363,482],[390,496],[402,493],[412,497],[420,507],[433,500],[443,506],[449,518],[459,508],[470,516],[476,528],[460,544],[436,553],[409,558],[385,552],[366,536]]},
 'leopard-gecko':{color:'#dfb666',center:[442,475],outline:[[363,437],[395,416],[425,413],[454,411],[477,398],[485,377],[487,360],[496,355],[513,367],[528,392],[539,425],[539,460],[530,494],[512,521],[487,543],[453,556],[416,562],[382,559],[352,549],[345,522],[352,484]]},
 'crested-gecko':{color:'#664128',center:[446,505],outline:[[375,489],[403,475],[422,470],[440,473],[454,462],[467,450],[481,440],[492,423],[503,416],[515,419],[519,438],[515,466],[503,493],[484,515],[458,532],[427,544],[393,551],[370,541]]}
};
module.exports=function reptileTail(THREE,k,species,tail){
 const spec=tails[species];if(!spec)return false;
 k.volume('BroadReptileTail',spec.outline,spec.center,tail.part.pivot,.27,.27,tail.group,k.solid('ReptileTailColor',spec.color),{art:false,z:-.16,samples:128});
 if(species==='crested-gecko')for(const [i,x,y,rx,ry] of [[0,424,473,13,12],[1,449,469,12,12],[2,470,455,12,13],[3,487,440,10,13]])k.volume('CrestedTailRidge'+i,k.ellipse(x,y,rx,ry),[x,y],tail.part.pivot,.12,.12,tail.group,k.solid('CrestedTailRidgeColor'+i,'#de973f'),{art:false,z:-.17,samples:48});
 const cx=species==='crocodile'?289:species==='leopard-gecko'?304:320;
 for(const mesh of tail.group.children)mesh.userData.artworkExcludedRegions=[{cx,cy:482,rx:71,ry:75}];
 return true;
};
