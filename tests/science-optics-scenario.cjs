module.exports=function(value){
 if(value.startsWith('ray:')){const[,medium,dir,angle]=value.split(':');__rayModel.setMedium(medium);__rayModel.setDir(dir);__rayModel.setAngle(+angle);document.querySelector('#checkBtn').click();return;}
 const [optic,distance]=value.split(':');
 for(const [key,v]of [['optic',optic],['distance',distance]]){
  const e=document.querySelector('[data-supplement-choice="'+key+'"][data-value="'+v+'"]');
  if(!e)throw Error('Missing optics control '+key+':'+v);
  e.click();
 }
};
