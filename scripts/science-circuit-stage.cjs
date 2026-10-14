module.exports=`<p class="intro">각 저항과 전체 회로에 계기를 옮겨 전압·전류를 측정하세요. 같은 조건의 직렬·병렬 회로를 비교하세요.</p>
<section class="circuit-measurement experiment-layout"><div class="cm-controls"><h2>회로 구성</h2>
<fieldset><legend>저항 연결</legend><div class="cm-buttons"><button data-cm-wiring="series" aria-pressed="true">직렬</button><button data-cm-wiring="parallel" aria-pressed="false">병렬</button></div></fieldset>
<label for="cmVolts">전원 전압 <output id="cmVoltsValue"></output></label><input id="cmVolts" type="range" min="1.5" max="12" step="0.5" value="6">
<label for="cmR1">저항 R₁ <select id="cmR1"><option>100</option><option selected>200</option><option>300</option><option>400</option></select> Ω</label>
<label for="cmR2">저항 R₂ <select id="cmR2"><option selected>100</option><option>200</option><option>300</option><option>400</option></select> Ω</label>
<h2>계기 연결</h2><fieldset><legend>측정량</legend><div class="cm-buttons"><button data-cm-meter="voltage" aria-pressed="true">전압</button><button data-cm-meter="current" aria-pressed="false">전류</button></div></fieldset>
<fieldset><legend>측정할 부분</legend><div class="cm-buttons"><button data-cm-target="r1" aria-pressed="true">R₁</button><button data-cm-target="r2" aria-pressed="false">R₂</button><button data-cm-target="whole" aria-pressed="false">전체</button></div></fieldset>
<fieldset><legend>선택한 부분에 계기 연결</legend><div class="cm-buttons"><button data-cm-connection="series" aria-pressed="false">직렬로</button><button data-cm-connection="parallel" aria-pressed="true">병렬로</button></div></fieldset>
<div class="cm-buttons"><button id="cmSwitch" class="primary" aria-pressed="false">회로 닫기</button><button id="cmRead">측정값 읽기</button></div><button id="cmReset">처음부터</button></div>
<div class="cm-observation"><h2>회로와 측정</h2><p class="cm-key">청록색: 회로 전선 · 주황색: 계기 연결선</p><svg id="cmScene" viewBox="0 0 540 350" role="img" aria-label="계기의 연결 위치가 표시된 전기 회로"></svg>
<div class="cm-reading"><span id="cmReadingLabel"></span><output id="cmReading">—</output></div><p id="cmStatus" class="status" role="status"></p>
<div class="cm-table-wrap"><table><caption id="cmTableTitle">측정값 비교</caption><thead><tr><th scope="col">측정 부분</th><th scope="col">전압 (V)</th><th scope="col">전류 (mA)</th></tr></thead><tbody id="cmTable"></tbody></table></div>
<p id="cmConclusion"></p><p class="cm-note">전선·전류계의 저항은 0, 전압계의 저항은 매우 크다고 봅니다. 연결을 바꿀 때 회로가 열립니다.</p></div></section>`;
