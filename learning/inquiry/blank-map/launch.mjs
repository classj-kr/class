// A single entry in the existing map controls. No extra full-width header.
const path=location.pathname;
const area=path.includes('/globe/history')?'history':path.includes('/korea-map')?'korea':'world';
const link=document.createElement('a');
link.className='blank-map-entry';link.textContent='백지도';
const style=document.createElement('style');
style.textContent='.blank-map-entry{display:inline-flex;align-items:center;justify-content:center;flex:none;min-height:38px;padding:8px 13px;border:1px solid #9eb8ae;border-radius:9px;background:#fcfaf5;color:#174c50;text-decoration:none;font:700 14px/1.2 system-ui,sans-serif}.blank-map-entry:focus-visible{outline:3px solid #c08425;outline-offset:2px}.atlas-catalog>.blank-map-entry{margin:10px 16px;width:calc(100% - 32px)}.theme-tabs>.blank-map-entry{align-self:center}.history-tools>.blank-map-entry{font-size:14px}@media(max-width:600px){.history-tools>.blank-map-entry{padding:8px;font-size:13px}}';
document.head.append(style);
const destinations={korea:'/learning/inquiry/korea-map/blank/',world:'/learning/inquiry/globe/blank/',history:'/learning/inquiry/globe/history/blank/'};
function update(){const school=window.SchoolLevel?.value||new URLSearchParams(location.search).get('school')||(area==='history'?'high':'middle');link.href=`${destinations[area]}?area=${area}&school=${school}&from=${area}&return=${encodeURIComponent(location.pathname+location.search+location.hash)}`;}
link.addEventListener('click',update);
update();window.SchoolLevel?.subscribe(update);
function mount(){const target=document.querySelector(area==='korea'?'.theme-tabs':area==='history'?'.history-tools':'.atlas-catalog');if(!target)return false;target.append(link);return true;}
if(!mount()){const observer=new MutationObserver(()=>{if(mount())observer.disconnect();});observer.observe(document.body,{childList:true,subtree:true});}
