(function () {
    document.addEventListener('DOMContentLoaded', () => {
      const $ = id => document.getElementById(id);
      const PATHS = {
        conscious: { label: '의식적 반응', centre: '대뇌', stimulus: '신호를 봄', result: '판단하여 손을 듦', route: ['눈', '감각 신경', '대뇌', '운동 신경', '팔의 근육'], conscious: true },
        pupil: { label: '동공 반사', centre: '중간뇌', stimulus: '밝은 빛', result: '동공이 작아짐', route: ['눈', '감각 신경', '중간뇌', '운동 신경', '홍채의 근육'], conscious: false },
        knee: { label: '무릎 반사', centre: '척수', stimulus: '무릎 아래를 두드림', result: '다리가 올라감', route: ['근육의 감각 수용기', '감각 신경', '척수', '운동 신경', '다리 근육'], conscious: false }
      };
      let selected = 'conscious', prediction = null, step = -1;
      function render() {
        const d = PATHS[selected];
        document.querySelectorAll('[data-path]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.path === selected)));
        document.querySelectorAll('[data-prediction]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.prediction === prediction)));
        $('stageBadge').textContent = d.label;
        $('routeList').innerHTML = d.route.map((t, i) => `<li${step === i ? ' aria-current="step"' : ''}>${t}${i === 2 ? ' (중추)' : ''}</li>`).join('');
        const done = step === 4;
        $('mainGroup').innerHTML = `<rect x="15" y="20" width="190" height="115" rx="16" fill="#e0f2fe"/><text x="110" y="50" text-anchor="middle" fill="#0f172a" font-size="16">자극</text><text x="110" y="88" text-anchor="middle" fill="#0f172a" font-size="17">${d.stimulus}</text><text x="240" y="85" text-anchor="middle" fill="#0284c7" font-size="32">→</text><rect x="275" y="20" width="190" height="115" rx="16" fill="${done ? '#d1fae5' : '#f1f5f9'}"/><text x="370" y="50" text-anchor="middle" fill="#0f172a" font-size="16">반응</text><text x="370" y="88" text-anchor="middle" fill="#0f172a" font-size="16">${done ? d.result : '경로를 따라가 보세요'}</text>`;
        $('nextBtn').disabled = step < 0 || done;
        $('resultEmpty').hidden = done;
        $('resultContent').hidden = !done;
        $('stageCaption').textContent = step < 0 ? '예상한 뒤 자극을 주고 전달 경로를 확인하세요.' : `${step + 1}/5단계 · ${d.route[step]}${step === 2 ? '에서 반응을 조절합니다.' : done ? '에서 반응이 나타납니다.' : '로 신호가 전달됩니다.'}`;
        if (done) {
          $('predictionResult').textContent = prediction === null ? '대뇌의 판단이 필요한 반응인지 비교해 보세요.' : prediction === (d.conscious ? 'yes' : 'no') ? '예상이 맞았습니다.' : '예상과 다릅니다. 중추를 확인하세요.';
          $('elementaryExplanation').textContent = `${d.label}의 중추는 ${d.centre}입니다. ${d.conscious ? '대뇌에서 판단한 뒤 명령을 내립니다.' : '대뇌의 의식적인 판단 없이 반응합니다.'}`;
        }
      }
      document.querySelectorAll('[data-path]').forEach(b => b.addEventListener('click', () => { selected = b.dataset.path; step = -1; prediction = null; render(); }));
      document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => { prediction = b.dataset.prediction; render(); }));
      $('checkBtn').addEventListener('click', () => { step = 0; render(); });
      $('nextBtn').addEventListener('click', () => { if (step >= 0 && step < 4) step += 1; render(); });
      $('resetBtn').addEventListener('click', () => { selected = 'conscious'; prediction = null; step = -1; window.resetGradeQuiz(); render(); });
      window.__reflexModel = { PATHS, state: () => ({ selected, prediction, step }) };
      render();
    });
  })();
