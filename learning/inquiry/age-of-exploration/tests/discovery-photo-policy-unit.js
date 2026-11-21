'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const Study=require('../lib/place-study');
const root=path.resolve(__dirname,'..'),credits=require('../data/catalog/photo-credits.json');
const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
const source=server.slice(server.indexOf('function photoCreditFor('),server.indexOf('function cityLandmarksFor('));
const context={fs,path,PHOTO_CREDITS:credits,LANDMARK_ART_DIR:path.join(root,'public/assets/landmarks')};
vm.createContext(context);vm.runInContext(source,context);
const replacements=require('../docs/discovery-photo-replacements.json').photos;
assert.equal(replacements.length,40);
for(const row of replacements){
  const credit=credits[row.id],file=path.join(root,'public/assets/landmarks',row.id+'.webp');
  const digest=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  assert.equal(credit.representative,true,row.id+' must show its replacement photo');
  assert.equal(credit.kind,'photo');
  assert.equal(credit.source,row.source);
  assert.equal(credit.caption,row.caption);
  assert.equal(digest,row.sha256,'review must match the shipped image');
  assert.notEqual(digest,row.previousSha256,'the old image must actually be replaced');
  assert.notEqual(row.source,row.previousSource,'replacement needs a new verified source');
  assert.ok(context.landmarkArtUrl(row.id)?.includes('/'+row.id+'.webp?'));
  assert.ok(context.photoCreditFor(row.id));
}
const meteora=credits.meteora;
credits.meteora={...meteora,representative:false};
assert.equal(context.landmarkArtUrl('meteora'),null,'unreviewed images can still be withheld');
assert.equal(context.photoCreditFor('meteora'),'');
credits.meteora=meteora;
for(const id of ['rila-monastery','meteora','tassili-rock-art']){
  assert.ok(context.landmarkArtUrl(id)?.includes('/'+id+'.webp?'),'ordinary location photos remain visible');
  assert.ok(context.photoCreditFor(id));
}

const questions=[{prompt:'keep this question'}];
const mission={studyTargets:[{key:'discovery:amazon_mouth',questions,reading:{text:'keep text',image:'/old-satellite.webp',imageCredit:'old credit',imageCaption:'old caption',imageSource:'old source'}}]};
const resolve=()=>({reading:{text:'keep text',image:'/new-landscape.webp',imageCredit:'new credit',imageCaption:'new caption',imageSource:'new source',imageKind:'photo'}});
assert.equal(Study.refreshReadingMedia(mission,resolve),true);
assert.equal(mission.studyTargets[0].reading.image,'/new-landscape.webp');
assert.equal(mission.studyTargets[0].reading.imageCaption,'new caption');
assert.equal(mission.studyTargets[0].reading.imageSource,'new source');
assert.equal(mission.studyTargets[0].reading.text,'keep text');
assert.equal(mission.studyTargets[0].questions,questions);
assert.equal(Study.refreshReadingMedia(mission,resolve),false,'migration is idempotent');
console.log(JSON.stringify({ok:true,replaced:replacements.length,reviewedImageHashes:true,landscapePhotosVisible:true,savedReadingsUpdated:true}));
