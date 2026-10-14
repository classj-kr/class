// Describe collected documents; a document role never proves experiment coverage.
const path=require('node:path');
function classifySource(file){
 const paths=[file.path,...(file.aliases||[])].filter(Boolean);
 for(const p of paths){
  const name=path.posix.basename(p.replaceAll('\\','/'));
  if(file.kind==='pdf'){
   if(/교육과정|성취수준|성취 수준|편수자료|진도|선정|평가|정답|해설|QR북|안전 수칙|^help/i.test(name))continue;
   const elementary=/[/\\]초등[/\\]/.test(p);
   const workbook=elementary&&/실험\s*관찰/.test(name);
   const elementaryText=elementary&&(/과학\s*PDF/i.test(name)||/^과학\s*[3-6]-[12]\s*PDF/i.test(name)||/^\d+단원_과학(?:__|\.)/.test(name));
   if(!workbook&&!elementaryText&&!/교과서/.test(p))continue;
   return{role:workbook?'실험관찰 PDF':/교사용/.test(name)?'교사용 교과서 PDF':'교과서 PDF',path:p,supplemental:/결손|꾸러미|부록/.test(name),roleEvidence:workbook?'실험관찰 파일명':elementaryText?'출판사별 과학 본문 파일명':'교과서 경로·파일명'};
  }
  if(file.kind!=='pdf'&&/탐구.?활동지|실험.?활동지/.test(name))return{role:'탐구 활동지',path:p,supplemental:false,roleEvidence:'활동지 파일명'};
 }
 return null;
}
module.exports={classifySource};
