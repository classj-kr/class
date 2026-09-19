(function () {
    document.addEventListener('DOMContentLoaded', () => {
      const $ = id => document.getElementById(id);
      let method = 'direct', force = 'small', prediction = null, ran = false;
      function lifted() { return ran && (method === 'lever' || force === 'enough'); }
      function render() {
        const up = lifted(), lift = up ? 20 : 0;
        document.querySelectorAll('[data-method]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.method === method)));
        document.querySelectorAll('[data-force]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.force === force)));
        document.querySelectorAll('[data-prediction]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.prediction === prediction)));
        $('stageBadge').textContent = method === 'direct' ? '직접 들기' : '지레 이용하기';
        let drawing = '<line x1="20" y1="275" x2="460" y2="275" stroke="#94a3b8" stroke-width="4"/>';
        if (method === 'direct') {
          drawing += `<rect x="210" y="${225 - lift}" width="60" height="50" rx="5" fill="#d97706"/><text x="240" y="${256 - lift}" text-anchor="middle" fill="white" font-size="16">물체</text><text x="305" y="240" font-size="40" fill="#0284c7">↑</text><text x="240" y="130" text-anchor="middle" fill="#0f172a" font-size="18">손으로 위로 들어 올립니다</text>`;
        } else {
          const angle = up ? -Math.asin(20 / 60) : 0;
          const endX = 260 + 60 * Math.cos(angle), endY = 220 + 60 * Math.sin(angle);
          drawing += `<polygon points="260,220 240,275 280,275" fill="#64748b"/><line x1="${260 - 150 * Math.cos(angle)}" y1="${220 - 150 * Math.sin(angle)}" x2="${endX}" y2="${endY}" stroke="#0284c7" stroke-width="10" stroke-linecap="round"/><rect x="${endX - 30}" y="${endY - 55}" width="60" height="50" rx="5" fill="#d97706"/><text x="${endX}" y="${endY - 24}" text-anchor="middle" fill="white" font-size="16">물체</text><text x="95" y="165" font-size="40" fill="#0284c7">↓</text><text x="240" y="110" text-anchor="middle" fill="#0f172a" font-size="18">손으로 지레의 끝을 누릅니다</text>`;
        }
        drawing += `<text x="240" y="315" text-anchor="middle" fill="#0f172a" font-size="17">${ran ? up ? '물체가 올라갔습니다' : '물체가 올라가지 않았습니다' : '같은 물체 · 같은 들어 올릴 높이'}</text>`;
        $('mainGroup').innerHTML = drawing;
        $('stageCaption').textContent = ran ? `${force === 'small' ? '작은 힘' : '큰 힘'}을 가했을 때 ${up ? '물체가 올라갑니다.' : '물체가 올라가지 않습니다.'} 다른 방법과 비교해 보세요.` : '방법과 힘을 고르고 결과를 예상하세요.';
        $('resultEmpty').hidden = ran; $('resultContent').hidden = !ran;
        if (ran) {
          $('predictionResult').textContent = prediction === null ? '다음에는 결과를 먼저 예상해 보세요.' : prediction === (up ? 'yes' : 'no') ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
          $('elementaryExplanation').textContent = '이 모형에서는 작은 힘으로 직접 들 수 없지만, 지레를 이용하면 들어 올릴 수 있습니다. 물체의 무게가 없어진 것이 아니라 들어 올리는 데 필요한 힘이 달라진 것입니다.';
        }
      }
      for (const key of ['method', 'force']) document.querySelectorAll(`[data-${key}]`).forEach(b => b.addEventListener('click', () => { if (key === 'method') method = b.dataset.method; else force = b.dataset.force; ran = false; prediction = null; render(); }));
      document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => { prediction = b.dataset.prediction; render(); }));
      $('checkBtn').addEventListener('click', () => { ran = true; render(); });
      $('resetBtn').addEventListener('click', () => { method = 'direct'; force = 'small'; prediction = null; ran = false; window.resetGradeQuiz(); render(); });
      window.__leverModel = { lifted, state: () => ({ method, force, prediction, ran }) };
      render();
    });
  })();
