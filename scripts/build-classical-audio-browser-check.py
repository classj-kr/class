"""Build a local browser fixture for decoding, playback and seeking every asset."""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
TARGET = ROOT / "outputs/qa/classical-audio/browser-check.html"
TARGET.parent.mkdir(parents=True, exist_ok=True)
TARGET.write_text("""<!doctype html><html lang="ko"><meta charset="utf-8">
<title>클래식 음원 브라우저 검사</title>
<style>body{font:16px/1.6 system-ui;padding:24px}pre{white-space:pre-wrap}button{padding:12px}</style>
<h1>44개 음원 재생·끝부분 이동 검사</h1>
<p>실제 청음이나 음악적 품질 판정이 아닌 브라우저 호환성 검사입니다.</p>
<button id="start">전체 검사 시작</button><p id="status">대기</p>
<audio id="player" controls></audio><pre id="results">[]</pre>
<script src="/learning/arts/music-listening/data/classical.js"></script>
<script>
const audio=document.querySelector('#player'), button=document.querySelector('#start');
const output=document.querySelector('#results'), status=document.querySelector('#status');
function event(name, action) {
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>finish(new Error(name+' timeout')),10000);
    const done=()=>finish(), error=()=>finish(new Error(audio.error?.message||'media error'));
    function finish(problem){
      clearTimeout(timer);audio.removeEventListener(name,done);audio.removeEventListener('error',error);
      problem?reject(problem):resolve();
    }
    audio.addEventListener(name,done,{once:true});audio.addEventListener('error',error,{once:true});
    try{action()}catch(e){finish(e)}
  });
}
button.onclick=async()=>{
  button.disabled=true;
  const pieces=window.CLASSICAL_DATA.pieces.filter(p=>p.audio), results=[];
  for(const piece of pieces){
    const row={no:piece.no,title:piece.title,file:piece.audio.file};
    status.textContent=`${results.length+1}/${pieces.length} ${piece.title}`;
    try {
      audio.pause();
      await event('loadedmetadata',()=>{
        audio.src='/learning/arts/music-listening/assets/audio/classical/'+piece.audio.file+
          (piece.audio.revision?'?v='+piece.audio.revision:'');
        audio.load();
      });
      row.duration=audio.duration;
      if(!Number.isFinite(audio.duration)||audio.duration<=0)throw new Error('invalid duration');
      await audio.play();
      await event('timeupdate',()=>{});
      row.playbackAdvanced=audio.currentTime>0;
      await event('seeked',()=>{audio.currentTime=Math.max(0,audio.duration-0.4)});
      row.seekTime=audio.currentTime;
      await event('ended',()=>{});
      row.ended=audio.ended;
      if(!row.playbackAdvanced||!row.ended)throw new Error('playback incomplete');
      row.status='passed';
    } catch(e) {row.status='failed';row.error=String(e.message||e)}
    audio.pause();results.push(row);output.textContent=JSON.stringify(results,null,2);
  }
  status.textContent=`완료: ${results.filter(r=>r.status==='passed').length}/${results.length} 통과`;
  button.disabled=false;
};
</script></html>""", encoding="utf-8")
print(TARGET)
