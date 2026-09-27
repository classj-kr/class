// 지도 좌표·지형을 바꾸지 않는 렌더링용 색상 전이.
// 넓은 색 분포만 저주파로 분리하고 원본의 픽셀별 명암을 곱한다.
export function createTerrainColorRenderer({currentRoot,referenceRoot}) {
const sourceCache=new Map();
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const luma=(r,g,b)=>.2126*r+.7152*g+.0722*b;
async function tile(kind,z,x,y){
 const n=2**z;x=(x+n)%n;y=Math.max(0,Math.min(n-1,y));
 const key=`${kind}/${z}/${x}/${y}`;
 if(!sourceCache.has(key))sourceCache.set(key,(async()=>{
  const root=kind==='current'?currentRoot:referenceRoot;
  const r=await fetch(`${root}/${z}/${x}/${y}.webp`);if(!r.ok)throw Error(`지도 자료 ${r.status}: ${key}`);
  return createImageBitmap(await r.blob());
 })());
 return sourceCache.get(key);
}
async function samples(kind,z,x,y){
 const pad=24,size=512,canvas=new OffscreenCanvas(size+pad*2,size+pad*2),ctx=canvas.getContext('2d',{willReadFrequently:true});
 const tasks=[];
 for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)tasks.push(tile(kind,z,x+dx,y+dy).then(img=>ctx.drawImage(img,pad+dx*size,pad+dy*size)));
 await Promise.all(tasks);
 const raw=ctx.getImageData(pad,pad,size,size);
 const blur=new OffscreenCanvas(canvas.width,canvas.height),bc=blur.getContext('2d',{willReadFrequently:true});
 bc.filter=`blur(${Math.max(1,6*2**(z-5))}px)`;bc.drawImage(canvas,0,0);
 return {raw,soft:bc.getImageData(pad,pad,size,size)};
}
async function render({amount=85,z,x,y,format='image/png',quality=.95}) {
  const strength=amount/100;
  const [current,candidate]=await Promise.all([samples('current',z,x,y),samples('candidate',z,x,y)]);
  const src=current.raw.data,base=current.soft.data,ref=candidate.soft.data;
  const result=new ImageData(512,512),out=result.data;
  for(let i=0;i<src.length;i+=4){
   const r=base[i]/255,g=base[i+1]/255,b=base[i+2]/255;
   const sy=Math.max(.04,luma(r,g,b));
   const rr=ref[i]/255,rg=ref[i+1]/255,rb=ref[i+2]/255,ry=Math.max(.04,luma(rr,rg,rb));
   // 기존 녹색 육지만 대상. 바다·수계·빙설·건조 사막의 색은 유지한다.
   let mask=smooth(-.015,.08,(g-r)/sy)*smooth(.035,.20,(g-b)/sy);
   const water=src[i+2]>src[i]+20&&src[i+2]>src[i+1]+5;
   if(water)mask=0;
   const warm=smooth(-.025,.07,(rr-rg)/ry);
   const a=strength*mask*(.4+.6*warm);
   const desiredY=sy*(1-.45*a)+ry*.45*a;
   for(let c=0;c<3;c++){
    const origBase=base[i+c]/255;
    const targetChroma=ref[i+c]/255/ry;
    const target=(origBase/sy*(1-a)+targetChroma*a)*desiredY;
    // 채널별 완만한 gain: 미세 능선과 골짜기의 원본 대비가 보존된다.
    const gain=Math.max(.55,Math.min(1.8,target/Math.max(.025,origBase)));
    out[i+c]=Math.max(0,Math.min(255,Math.round(src[i+c]*gain)));
   }
   out[i+3]=255;
  }
  const canvas=new OffscreenCanvas(512,512);canvas.getContext('2d').putImageData(result,0,0);
  return {data:await (await canvas.convertToBlob({type:format,quality})).arrayBuffer()};
 }
 return {render, async clearCache(){for(const pending of sourceCache.values())(await pending).close();sourceCache.clear();}};
}
