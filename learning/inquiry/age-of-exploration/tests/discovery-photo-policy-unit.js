'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Study=require('../lib/place-study');
const root=path.resolve(__dirname,'..'),credits=require('../data/catalog/photo-credits.json');
const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
const source=server.slice(server.indexOf('function photoCreditFor('),server.indexOf('function cityLandmarksFor('));
const context={fs,path,PHOTO_CREDITS:credits,LANDMARK_ART_DIR:path.join(root,'public/assets/landmarks')};
vm.createContext(context);vm.runInContext(source,context);
const excluded=Object.entries(credits).filter(([,credit])=>credit.representative===false);
assert.equal(excluded.length,40,'visually reviewed orbital images and the unrelated regional map are excluded');
for(const [id] of excluded){
  assert.equal(context.landmarkArtUrl(id),null,id+' must not be served as a discovery photo');
  assert.equal(context.photoCreditFor(id),'',id+' must not leave a source button without a photo');
}
assert.equal(context.landmarkArtUrl('amazon_mouth'),null);
for(const id of ['rila-monastery','meteora','tassili-rock-art']){
  assert.ok(context.landmarkArtUrl(id)?.includes('/'+id+'.webp?'),'ordinary location photos remain visible');
  assert.ok(context.photoCreditFor(id));
}

const questions=[{prompt:'keep this question'}];
const mission={studyTargets:[{key:'discovery:amazon_mouth',questions,reading:{text:'keep text',image:'/old-satellite.webp',imageCredit:'old credit',imageCaption:'old caption',imageSource:'old source'}}]};
const resolve=()=>({reading:{text:'keep text',image:null,imageCredit:'',imageKind:'photo'}});
assert.equal(Study.refreshReadingMedia(mission,resolve),true);
assert.equal(mission.studyTargets[0].reading.image,null);
assert.equal(mission.studyTargets[0].reading.imageCaption,undefined);
assert.equal(mission.studyTargets[0].reading.imageSource,undefined);
assert.equal(mission.studyTargets[0].reading.text,'keep text');
assert.equal(mission.studyTargets[0].questions,questions);
assert.equal(Study.refreshReadingMedia(mission,resolve),false,'migration is idempotent');
console.log(JSON.stringify({ok:true,excluded:excluded.length,groundPhotosRetained:true,savedReadingsUpdated:true}));
