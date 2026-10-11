const {test}=require('node:test'),assert=require('node:assert/strict');
const {classifySource}=require('../scripts/science-textbook-source-role.cjs');
test('publisher textbook and experiment workbook names are included without the word 교과서',()=>{
 for(const name of ['과학 3-1 PDF.pdf','1단원_과학__a2be7c3e.pdf','31_1_과학PDF__72b24991.pdf','61_여러가지기체_과학PDF_결손__328a1a86.pdf']){
  const r=classifySource({kind:'pdf',path:'references/textbooks/초등/출판사/과학/2022/'+name});assert.equal(r.role,'교과서 PDF',name);assert.equal(r.supplemental,name.includes('결손'));
 }
 assert.equal(classifySource({kind:'pdf',path:'references/textbooks/초등/출판사/과학/2022/1단원_실험관찰PDF__12.pdf'}).role,'실험관찰 PDF');
});
test('metadata and assessments do not become textbooks even under a textbook directory; aliases retain source identity',()=>{
 for(const name of ['2022 과학과 교육과정.pdf','교과서선정.pdf','1단원_평가.pdf','교사용_정답해설.pdf'])assert.equal(classifySource({kind:'pdf',path:'references/textbooks/교과서/'+name}),null);
 assert.equal(classifySource({kind:'pdf',path:'references/file.pdf',aliases:['references/textbooks/초등/과학/2022/과학 4-2 PDF.pdf']}).role,'교과서 PDF');
 assert.equal(classifySource({kind:'hwp',path:'references/textbooks/과학/2022/실험활동지_반응.hwp'}).role,'탐구 활동지');
});
