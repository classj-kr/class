/* Authored from the source-reviewed experiment registry. */
(function(root){const extra={
  "misconceptions": {
    "mendeleev#q1": {
      "concept": "성질에 따른 세로줄 분류",
      "feedback": {
        "a": "원자량의 순서와 같은 세로줄의 성질이라는 서로 다른 배열 기준을 혼동했습니다.",
        "b": "기호의 모양은 화학적 성질을 분류하는 근거가 아닙니다."
      }
    },
    "mendeleev#q2": {
      "concept": "빈칸과 미발견 원소 예측",
      "feedback": {
        "b": "제공된 자료의 수를 자연에 존재하는 전체 수로 오해했습니다.",
        "c": "원자량뿐 아니라 화학적 성질도 배열과 예측의 근거입니다."
      }
    },
    "mendeleev#q3": {
      "concept": "원자량 예측의 범위와 불확실성",
      "feedback": {
        "a": "두 값의 평균을 근거 없이 정확한 측정값으로 간주했습니다.",
        "c": "왼쪽에서 오른쪽으로 원자량이 증가한다는 조건과 맞지 않습니다."
      }
    },
    "mendeleev#q4": {
      "concept": "화학식으로 미지 원소의 성질 예측",
      "feedback": {
        "b": "다른 세로줄의 1:1 염화물·2:1 산화물 규칙을 적용했습니다.",
        "c": "같은 세로줄에서 비교해야 할 화학식의 결합 비율을 놓쳤습니다."
      }
    },
    "pasteur#q1": {
      "concept": "공기와 미생물의 유입 구별",
      "feedback": {
        "a": "목이 구부러져 있는 것과 입구를 밀봉한 것을 혼동한 응답입니다.",
        "c": "공기의 출입 자체를 살균 작용으로 해석한 응답입니다."
      }
    },
    "pasteur#q2": {
      "concept": "대조 실험의 해석",
      "feedback": {
        "a": "외부 미생물의 유입을 자연 발생으로 해석한 응답입니다.",
        "b": "이미 수행한 가열과 가열 뒤의 재오염을 구별해야 합니다."
      }
    },
    "pasteur#q3": {
      "concept": "기울임과 재오염",
      "feedback": {
        "b": "기계적 움직임을 생명 생성의 원인으로 해석한 응답입니다.",
        "c": "기울이기 전에도 공기는 출입할 수 있었다는 조건을 놓쳤습니다."
      }
    },
    "pasteur#q4": {
      "concept": "끓임 여부의 통제",
      "feedback": {
        "a": "용기 크기 하나만 같으면 모든 변인이 통제된다고 본 응답입니다.",
        "c": "처음 존재하던 미생물이 이후 관찰에 영향을 준다는 점을 놓쳤습니다."
      }
    },
    "newton-prism#q1": {
      "concept": "백색광과 분산",
      "feedback": {
        "a": "빛의 분산과 물질에 의한 착색을 혼동한 응답입니다.",
        "c": "프리즘을 광원으로 해석한 응답입니다."
      }
    },
    "newton-prism#q2": {
      "concept": "단색광 재통과",
      "feedback": {
        "a": "프리즘이 언제나 모든 색을 만들어 낸다고 본 응답입니다.",
        "b": "한 색의 굴절과 여러 색의 빛이 겹치는 과정을 혼동했습니다."
      }
    },
    "newton-prism#q3": {
      "concept": "빛의 합성과 스크린 위치",
      "feedback": {
        "b": "장치의 정렬과 스크린 위치가 관찰 결과에 미치는 영향을 놓쳤습니다.",
        "c": "백색광을 이루는 여러 색을 한 색으로 줄이는 조건입니다."
      }
    },
    "newton-prism#q4": {
      "concept": "가설을 검증하는 두 관찰",
      "feedback": {
        "a": "빛의 색에 관한 가설과 직접 관련 없는 관찰을 선택했습니다.",
        "b": "장치의 특징만으로 색이 생긴 원인을 검증할 수는 없습니다."
      }
    },
    "infection-prevention#q1": {
      "concept": "거리 비교의 변인 통제",
      "feedback": {
        "a": "거리와 함께 세기·횟수도 달라져 원인을 구별하기 어렵습니다.",
        "c": "앞에서 생긴 자국과 새 자국을 구별하기 어렵습니다."
      }
    },
    "infection-prevention#q2": {
      "concept": "접촉 경로의 해석",
      "feedback": {
        "b": "놀이의 접촉과 물을 통한 전파를 혼동한 응답입니다.",
        "c": "실제로 접촉한 경로를 확인하지 않고 모두에게 전파된다고 보았습니다."
      }
    },
    "infection-prevention#q3": {
      "concept": "형광 로션 관찰과 손 씻기",
      "feedback": {
        "a": "형광 로션의 흔적과 실제 미생물의 수를 같은 것으로 해석했습니다.",
        "b": "두 손 모두 30초로 시간을 같게 한 조건을 놓쳤습니다."
      }
    },
    "infection-prevention#q4": {
      "concept": "모형 결과의 적용 범위",
      "feedback": {
        "a": "한 모형의 결과를 모든 감염병에 적용한 응답입니다.",
        "c": "관찰되지 않는 것과 전혀 존재하지 않는 것을 혼동했습니다."
      }
    },
    "speaker-lab#q1": {
      "concept": "자기력과 진동",
      "feedback": {
        "b": "자석의 존재만으로 지속적인 진동이 생긴다고 보았습니다.",
        "c": "진동판을 움직이는 자기력과 전선의 발열을 구별해야 합니다."
      }
    },
    "speaker-lab#q2": {
      "concept": "회로의 연결",
      "feedback": {
        "a": "전선의 연결 상태와 감은 수를 혼동했습니다.",
        "c": "절연 피복과 자석의 극은 다른 요소입니다."
      }
    },
    "speaker-lab#q3": {
      "concept": "소리의 높낮이",
      "feedback": {
        "a": "주파수 증가를 진동 횟수 감소로 해석했습니다.",
        "b": "주파수와 소리의 높낮이 관계를 놓쳤습니다."
      }
    },
    "speaker-lab#q4": {
      "concept": "에너지 전환",
      "feedback": {
        "b": "소리를 내는 스피커와 소리를 입력받는 장치를 혼동했습니다.",
        "c": "자석이 소비되어 소리가 발생하는 것은 아닙니다."
      }
    },
    "wireless-power#q1": {
      "concept": "변하는 자기 선속",
      "feedback": {
        "a": "전류가 두 코일 사이의 공기를 직접 흐르는 것으로 해석했습니다.",
        "c": "자기장의 존재와 자기 선속의 변화를 혼동했습니다."
      }
    },
    "wireless-power#q2": {
      "concept": "직류의 정상 상태",
      "feedback": {
        "a": "전류가 흐른다는 것만으로 변화가 있다고 보았습니다.",
        "b": "가까운 거리만으로 자기 선속의 시간 변화를 대신할 수는 없습니다."
      }
    },
    "wireless-power#q3": {
      "concept": "코일의 방향",
      "feedback": {
        "b": "코일의 면을 통과하는 성분을 고려하지 않았습니다.",
        "c": "자기 선속에는 방향이 영향을 줍니다."
      }
    },
    "wireless-power#q4": {
      "concept": "충전과 유도의 구별",
      "feedback": {
        "b": "유도된 신호와 배터리 충전 조건을 같은 것으로 보았습니다.",
        "c": "표시용 소자와 에너지 저장 장치를 혼동했습니다."
      }
    },
    "magnetic-brake#q1": {
      "concept": "맴돌이 전류의 조건",
      "feedback": {
        "a": "유도에 의한 제동과 정적인 자석의 인력을 혼동했습니다.",
        "c": "자기 선속의 변화가 필요한 제동을 정지 상태에도 그대로 적용했습니다."
      }
    },
    "magnetic-brake#q2": {
      "concept": "비교 물체",
      "feedback": {
        "a": "두 낙하 결과의 차이를 무시했습니다.",
        "b": "유도 현상을 검토하지 않고 중력만을 원인으로 정했습니다."
      }
    },
    "magnetic-brake#q3": {
      "concept": "운동 방향과 제동력",
      "feedback": {
        "b": "유도 효과가 원래 변화를 강화한다고 해석했습니다.",
        "c": "운동 방향과 힘의 관계를 고려하지 않았습니다."
      }
    },
    "magnetic-brake#q4": {
      "concept": "에너지 보존",
      "feedback": {
        "a": "역학적 에너지 감소와 전체 에너지 소멸을 혼동했습니다.",
        "c": "저항에서 발생하는 열을 고려하지 않았습니다."
      }
    },
    "transistor-speaker#q1": {
      "concept": "증폭 에너지의 출처",
      "feedback": {
        "a": "신호 증폭을 에너지 생성으로 해석했습니다.",
        "c": "입력이 출력을 제어하는 역할과 전원의 에너지 공급 역할을 혼동했습니다."
      }
    },
    "transistor-speaker#q2": {
      "concept": "전원 공급",
      "feedback": {
        "a": "증폭 회로의 전원 역할을 놓쳤습니다.",
        "b": "전원 제거가 에너지 공급 증가라고 해석했습니다."
      }
    },
    "transistor-speaker#q3": {
      "concept": "파형의 제한",
      "feedback": {
        "b": "음량 증가와 신호의 정확도를 같은 것으로 보았습니다.",
        "c": "실제 전원의 유한한 범위를 고려하지 않았습니다."
      }
    },
    "transistor-speaker#q4": {
      "concept": "소리 비교의 통제",
      "feedback": {
        "a": "회로와 스피커 두 요인을 동시에 바꾸었습니다.",
        "c": "주파수와 스피커까지 달라져 증폭의 영향만 판단하기 어렵습니다."
      }
    },
    "soap-film#q1": {
      "concept": "간섭하는 빛의 경로",
      "feedback": {
        "b": "같은 종류의 파동이 겹치는 간섭 조건을 놓쳤습니다.",
        "c": "틀이 아니라 막의 두 경계에서 반사되는 빛을 비교해야 합니다."
      }
    },
    "soap-film#q2": {
      "concept": "반사 위상 변화",
      "feedback": {
        "a": "두 경계의 굴절률 순서가 반대라는 점을 놓쳤습니다.",
        "c": "경계에 따른 반사 위상 변화를 고려해야 합니다."
      }
    },
    "soap-film#q3": {
      "concept": "첫 밝은 조건",
      "feedback": {
        "a": "왕복 경로와 반사 위상 차를 함께 적용하지 않았습니다.",
        "b": "2nd=λ인 조건은 이 두 경계에서 밝은 조건이 아닙니다."
      }
    },
    "soap-film#q4": {
      "concept": "매우 얇은 막",
      "feedback": {
        "b": "상쇄 간섭으로 반사가 줄어드는 것을 완전한 흡수로 해석했습니다.",
        "c": "경계에서의 반사 위상 반전 때문에 두께가 작아도 위상이 같지 않습니다."
      }
    },
    "polarization#q1": {
      "concept": "선편광 판별",
      "feedback": {
        "a": "광원을 유지한 채 편광판만 회전한 조건을 놓쳤습니다.",
        "c": "무편광의 일정한 투과 세기와 선편광의 방향성을 혼동했습니다."
      }
    },
    "polarization#q2": {
      "concept": "비교의 통제",
      "feedback": {
        "b": "거리까지 바꾸면 세기 변화의 원인이 둘 이상입니다.",
        "c": "광원 밝기가 바뀌면 편광판의 영향만 구별하기 어렵습니다."
      }
    },
    "polarization#q3": {
      "concept": "회전 각도와 투과 세기",
      "feedback": {
        "a": "무편광의 경우와 선편광의 방향 의존성을 혼동했습니다.",
        "b": "투과축과 진동 방향이 나란한 조건과 수직인 조건을 반대로 해석했습니다."
      }
    },
    "polarization#q4": {
      "concept": "한 장으로 가능한 추론",
      "feedback": {
        "b": "이미 관찰한 변화 양상과 광원의 편광 상태에 대한 추가 추론을 혼동했습니다.",
        "c": "기준 세기와 투과 세기의 비교는 직접 관찰할 수 있습니다."
      }
    },
    "electron-slits#q1": {
      "concept": "점 하나의 의미",
      "feedback": {
        "b": "도착 위치의 관찰을 전체 이동 경로로 확대했습니다.",
        "c": "이 활동의 점은 전자의 도착 사건입니다."
      }
    },
    "electron-slits#q2": {
      "concept": "누적 간섭",
      "feedback": {
        "a": "여러 전자의 충돌이 있어야만 간섭한다는 해석입니다.",
        "c": "개별 도착 사건과 누적 확률 분포를 구별해야 합니다."
      }
    },
    "electron-slits#q3": {
      "concept": "경로 정보",
      "feedback": {
        "a": "경로 측정이 간섭을 강화한다고 보았습니다.",
        "b": "측정 조건이 확률 분포에 미치는 영향을 고려하지 않았습니다."
      }
    },
    "electron-slits#q4": {
      "concept": "적은 표본의 해석",
      "feedback": {
        "b": "작은 표본만으로 일반적인 결론을 내렸습니다.",
        "c": "확률적인 도착을 매번 같은 위치의 도착으로 오해했습니다."
      }
    },
    "gas-identification#q1": {
      "concept": "기체 질량 측정",
      "feedback": {
        "b": "용기와 남아 있는 기체까지 모두 포함했습니다.",
        "c": "부피 측정을 위한 물과 기체의 질량을 혼동했습니다."
      }
    },
    "gas-identification#q2": {
      "concept": "수상 치환의 분압",
      "feedback": {
        "a": "혼합 기체 전체 압력을 건조 기체의 분압으로 사용했습니다.",
        "c": "전체 압력에서 한 성분을 구할 때 더하는 것으로 혼동했습니다."
      }
    },
    "gas-identification#q3": {
      "concept": "절대 온도",
      "feedback": {
        "a": "섭씨 눈금을 절대 온도로 사용했습니다.",
        "b": "절대 온도로 환산하는 방향을 반대로 적용했습니다."
      }
    },
    "gas-identification#q4": {
      "concept": "몰 질량과 동정",
      "feedback": {
        "b": "질량과 부피의 측정으로 구한 몰 질량을 후보와 잘못 대응했습니다.",
        "c": "몰 질량이 가장 큰 기체가 항상 정답인 것은 아닙니다."
      }
    },
    "sugar-phase#q1": {
      "concept": "몰랄 농도",
      "feedback": {
        "a": "물 500 g을 1 kg으로 계산했습니다.",
        "c": "농도 수치를 그대로 질량으로 사용했습니다."
      }
    },
    "sugar-phase#q2": {
      "concept": "끓는점 오름",
      "feedback": {
        "a": "끓는점 오름과 어는점 내림의 방향을 혼동했습니다.",
        "b": "용질이 증기압과 끓는 조건에 미치는 영향을 놓쳤습니다."
      }
    },
    "sugar-phase#q3": {
      "concept": "어는점 내림",
      "feedback": {
        "b": "끓는점 변화의 방향을 어는점에도 적용했습니다.",
        "c": "순수한 물의 어는점을 용액에 그대로 적용했습니다."
      }
    },
    "sugar-phase#q4": {
      "concept": "상변화 중 농도",
      "feedback": {
        "a": "순수한 용매의 상변화와 용질의 분배를 구별하지 않았습니다.",
        "c": "용매가 줄어드는 상황에서 농도 변화의 방향을 반대로 해석했습니다."
      }
    },
    "hess-calorimetry#q1": {
      "concept": "반응 경로와 엔탈피",
      "feedback": {
        "a": "상태 함수의 변화량을 단계 수와 혼동했습니다.",
        "c": "연속된 반응의 에너지 변화를 합하지 않았습니다."
      }
    },
    "hess-calorimetry#q2": {
      "concept": "중간 냉각의 목적",
      "feedback": {
        "a": "측정 조건의 통제와 반응 억제를 혼동했습니다.",
        "b": "앞 단계의 열량과 다음 단계의 초기 조건을 혼동했습니다."
      }
    },
    "hess-calorimetry#q3": {
      "concept": "반응열 부호",
      "feedback": {
        "b": "용액이 얻는 열과 반응계가 잃는 열의 부호를 혼동했습니다.",
        "c": "온도 상승에도 반응 에너지 변화가 없다고 보았습니다."
      }
    },
    "hess-calorimetry#q4": {
      "concept": "온도 변화와 열량",
      "feedback": {
        "a": "열량과 연결되는 측정량을 고려하지 않았습니다.",
        "c": "이상적인 온도 측정에서 필요한 질량·비열을 빠뜨렸습니다."
      }
    },
    "buffer-solution#q1": {
      "concept": "완충 작용",
      "feedback": {
        "b": "완충 작용의 역할을 반대로 해석했습니다.",
        "c": "조성이 다른 용액의 평형 반응을 고려하지 않았습니다."
      }
    },
    "buffer-solution#q2": {
      "concept": "대조군 유지",
      "feedback": {
        "a": "처리 조건이 다른 시료를 직접 비교해야 합니다.",
        "c": "서로 다른 홈의 시료가 섞이는 것은 비교 조건을 깨뜨립니다."
      }
    },
    "buffer-solution#q3": {
      "concept": "완충 용량",
      "feedback": {
        "a": "소량 첨가 조건과 완충 용량을 무시했습니다.",
        "b": "산 첨가와 평형 성분의 변화를 반대로 해석했습니다."
      }
    },
    "buffer-solution#q4": {
      "concept": "전극 세척",
      "feedback": {
        "a": "기구 세척과 측정 원리를 혼동했습니다.",
        "c": "전극 세척을 시료의 중화로 해석했습니다."
      }
    },
    "salt-hydrolysis#q1": {
      "concept": "모든 염이 중성이라는 오개념",
      "feedback": {
        "a": "강산의 짝염기인 Cl⁻의 역할을 잘못 해석했습니다.",
        "c": "이온화와 가수 분해를 구별하지 않았습니다."
      }
    },
    "salt-hydrolysis#q2": {
      "concept": "약산의 짝염기",
      "feedback": {
        "a": "나트륨 이온 자체를 수산화 이온 공급원으로 보았습니다.",
        "b": "약산과 그 짝염기의 성질을 혼동했습니다."
      }
    },
    "salt-hydrolysis#q3": {
      "concept": "중성 염 대조",
      "feedback": {
        "b": "용해·해리와 가수 분해를 혼동했습니다.",
        "c": "NaCl의 경우를 모든 염으로 일반화했습니다."
      }
    },
    "salt-hydrolysis#q4": {
      "concept": "상수 관계",
      "feedback": {
        "a": "짝이라는 관계를 같은 세기로 해석했습니다.",
        "c": "pH 수치와 평형 상수를 혼동했습니다."
      }
    },
    "bean-respiration#q1": {
      "concept": "식물의 세포 호흡",
      "feedback": {
        "b": "식물도 세포 호흡을 한다는 점을 놓쳤습니다.",
        "c": "같은 외부 조건에서 대조한 결과를 고려하지 않았습니다."
      }
    },
    "bean-respiration#q2": {
      "concept": "KOH의 역할",
      "feedback": {
        "a": "흡수하는 기체의 종류를 혼동했습니다.",
        "c": "KOH의 기체 흡수 역할과 발아 조건을 혼동했습니다."
      }
    },
    "bean-respiration#q3": {
      "concept": "잉크 이동의 해석",
      "feedback": {
        "a": "CO₂를 흡수한 조건과 잉크 방향을 놓쳤습니다.",
        "b": "흡수제와 산소 발생 반응을 혼동했습니다."
      }
    },
    "bean-respiration#q4": {
      "concept": "삶은 콩 대조",
      "feedback": {
        "b": "같은 초기 온도라는 통제 조건을 놓쳤습니다.",
        "c": "외부 온도 차이는 대조를 어렵게 합니다."
      }
    }
  },
  "followups": {
    "mendeleev": [
      {
        "id": "mendeleev@formula-transfer",
        "topic": "다른 빈칸 예측",
        "question": "M₂O₃·MCl₃와 T₂O₃·TCl₃가 같은 세로줄에 있습니다. 그 사이 미지 원소 ㉠이 만드는 물질은 어떻게 예측할까요?",
        "choices": [
          "㉠O₂·㉠H₄",
          "㉠₂O₃·㉠Cl₃",
          "㉠₂O·㉠Cl"
        ],
        "answer": 1,
        "why": "원소 이름이 달라져도 같은 세로줄에서 반복되는 원자 수의 비를 이용합니다.",
        "checks": [
          "mendeleev#q1",
          "mendeleev#q4"
        ]
      },
      {
        "id": "mendeleev@evidence-transfer",
        "topic": "예측과 새 증거",
        "question": "빈칸에 들어갈 원소의 성질을 예측한 뒤, 새 원소가 발견되었습니다. 예측을 검증하는 방법은?",
        "choices": [
          "발견된 원소의 질량과 만드는 물질을 측정하여 예측과 비교한다",
          "예측과 다르게 측정된 결과는 기록하지 않는다",
          "빈칸이 줄었으므로 측정하지 않고 맞았다고 판단한다"
        ],
        "answer": 0,
        "why": "규칙에 근거한 예측은 새로 얻은 측정 자료와 비교해야 합니다. 맞지 않는 결과도 근거로 다루어야 합니다.",
        "checks": [
          "mendeleev#q2",
          "mendeleev#q3"
        ]
      }
    ],
    "pasteur": [
      {
        "id": "pasteur@sealed-transfer",
        "topic": "새 조건에서 확인",
        "question": "끓이지 않은 배양액을 밀봉했는데 미생물이 증식했다. 이 결과만으로 자연발생설을 뒷받침할 수 없는 까닭은?",
        "choices": [
          "배양액에 처음부터 미생물이 있었을 수 있다",
          "밀봉하면 공기가 반드시 계속 들어온다",
          "미생물은 항상 유리에서 새로 만들어진다"
        ],
        "answer": 0,
        "why": "밀봉은 외부에서 새로 들어오는 경로를 막을 뿐, 배양액에 원래 있던 미생물을 제거하지는 않습니다.",
        "checks": [
          "pasteur#q2",
          "pasteur#q4"
        ]
      },
      {
        "id": "pasteur@air-transfer",
        "topic": "주장과 증거 연결",
        "question": "“공기가 닿기만 하면 끓인 배양액에 미생물이 저절로 생긴다”는 주장을 반박하는 관찰은?",
        "choices": [
          "끓이지 않은 배양액이 탁해졌다",
          "열린 백조목으로 공기가 드나들어도 끓인 배양액은 맑았다",
          "목을 자른 플라스크의 배양액이 탁해졌다"
        ],
        "answer": 1,
        "why": "공기 접촉과 미생물 유입은 같은 조건이 아닙니다. 열린 백조목의 관찰이 두 조건을 구별하는 근거입니다.",
        "checks": [
          "pasteur#q1",
          "pasteur#q3"
        ]
      }
    ],
    "newton-prism": [
      {
        "id": "newton-prism@green-transfer",
        "topic": "다른 색으로 확인",
        "question": "이번에는 초록 빛만 골라 두 번째 프리즘을 통과시켰다. 예상되는 결과는?",
        "choices": [
          "항상 백색광이 된다",
          "초록 빛을 유지하며 진행 방향이 바뀔 수 있다",
          "초록색 물감처럼 검은색으로 섞인다"
        ],
        "answer": 1,
        "why": "단색광의 굴절은 색을 새로 만드는 과정이 아닙니다. 다른 색을 선택해도 같은 원리가 적용됩니다.",
        "checks": [
          "newton-prism#q2"
        ]
      },
      {
        "id": "newton-prism@screen-transfer",
        "topic": "관찰 실패 해석",
        "question": "합성 장치에서 스크린에 여러 색이 따로 보였다. 우선 확인할 것은?",
        "choices": [
          "여러 색이 겹치는 위치에 스크린이 놓였는지 확인한다",
          "빛을 섞으면 언제나 검어진다고 결론 낸다",
          "백색광에는 한 색만 있다고 결론 낸다"
        ],
        "answer": 0,
        "why": "빛이 모이는 위치와 장치 정렬을 먼저 확인해야 합니다. 색이 따로 보였다는 한 관찰만으로 합성이 불가능하다고 결론 내릴 수 없습니다.",
        "checks": [
          "newton-prism#q3",
          "newton-prism#q4"
        ]
      },
      {
        "id": "newton-prism@source-transfer",
        "topic": "같은 백색광, 다른 구성",
        "question": "백열전구와 빨강·초록·파랑 LED를 함께 켠 빛은 모두 희게 보입니다. 프리즘을 통과시킨 결과로 옳은 것은?",
        "choices": [
          "모두 희게 보이므로 두 스펙트럼은 반드시 같다",
          "백열전구는 이어진 색 띠, 3색 LED는 떨어진 세 색 띠가 나타난다",
          "프리즘이 LED에 없던 모든 색을 새로 만들어 낸다"
        ],
        "answer": 1,
        "why": "희게 보인다는 사실만으로 빛을 이루는 파장의 구성이 같다고 할 수는 없습니다. 이 비교에서 백열전구는 연속 스펙트럼을, 세 LED는 각각의 색에 해당하는 띠를 보입니다.",
        "checks": [
          "newton-prism#q1",
          "newton-prism#q4"
        ]
      }
    ],
    "infection-prevention": [
      {
        "id": "infection-prevention@control-transfer",
        "topic": "비교 조건 다시 확인",
        "question": "A는 물로 10초, B는 비누로 30초 씻었습니다. 비누 사용의 영향만 비교하려면?",
        "choices": [
          "두 손의 씻는 시간과 처음 로션 양을 같게 한다",
          "A에만 로션을 더 바른다",
          "B의 씻는 시간을 더 늘린다"
        ],
        "answer": 0,
        "why": "씻는 방법 외의 조건을 같게 해야 방법에 따른 차이를 비교할 수 있습니다.",
        "checks": [
          "infection-prevention#q1",
          "infection-prevention#q3"
        ]
      },
      {
        "id": "infection-prevention@route-transfer",
        "topic": "새 접촉 경로",
        "question": "A에만 표시가 있고, 첫 차례에는 C와 D만 접촉했습니다. 이 놀이 규칙에서 새로 표시가 생기는 사람은?",
        "choices": [
          "C와 D",
          "접촉한 적 없는 B",
          "없음"
        ],
        "answer": 2,
        "why": "표시가 없는 두 사람끼리 접촉한 상황입니다. A에서 출발한 접촉 경로가 아직 이들에게 이어지지 않았습니다.",
        "checks": [
          "infection-prevention#q2"
        ]
      }
    ],
    "speaker-lab": [
      {
        "id": "speaker-lab@dc",
        "topic": "새 조건에서 확인",
        "question": "일정한 직류를 코일에 계속 흘립니다. 연결 직후의 움직임이 끝난 뒤 예상되는 것은?",
        "choices": [
          "자기력이 없어져 전류도 반드시 사라진다",
          "한쪽으로 변위될 수 있지만 계속 같은 음을 내며 왕복하지는 않는다",
          "직류만으로 모든 주파수의 음악이 재생된다"
        ],
        "answer": 1,
        "why": "지속적인 왕복 운동에는 힘의 시간 변화가 필요합니다. 일정한 전류는 일정한 방향의 힘을 줍니다.",
        "checks": [
          "speaker-lab#q1",
          "speaker-lab#q3"
        ]
      },
      {
        "id": "speaker-lab@control",
        "topic": "새 조건에서 확인",
        "question": "감은 수에 따른 차이를 비교하려면 같게 유지할 조건은?",
        "choices": [
          "전류 신호와 자석·진동판 조건",
          "매번 다른 주파수와 자석",
          "매번 다른 크기의 컵과 신호"
        ],
        "answer": 0,
        "why": "감은 수 이외의 조건을 같게 해야 감은 수의 영향을 구별할 수 있습니다.",
        "checks": [
          "speaker-lab#q1",
          "speaker-lab#q4"
        ]
      }
    ],
    "wireless-power": [
      {
        "id": "wireless-power@transient",
        "topic": "새 조건에서 확인",
        "question": "직류 전원을 끄는 짧은 순간에는 수신 코일에 전압이 나타날 수 있습니다. 까닭은?",
        "choices": [
          "직류라는 이름이 교류로 바뀌어서",
          "자기장이 없어지는 동안 자기 선속이 변해서",
          "코일 사이로 전선이 생겨서"
        ],
        "answer": 1,
        "why": "정상 상태의 직류와 켜고 끄는 순간의 변화를 구별합니다.",
        "checks": [
          "wireless-power#q1",
          "wireless-power#q2"
        ]
      },
      {
        "id": "wireless-power@distance",
        "topic": "새 조건에서 확인",
        "question": "같은 교류로 작동시키며 수신 코일을 멀리 옮겼더니 발광이 멈췄습니다. 타당한 해석은?",
        "choices": [
          "두 코일의 결합이 약해져 발광에 필요한 전압에 못 미쳤을 수 있다",
          "전자기 유도 법칙이 사라졌다",
          "발광하지 않으면 유도 전압도 반드시 정확히 0이다"
        ],
        "answer": 0,
        "why": "관찰 장치가 켜지는 문턱과 유도 전압의 존재를 구별해야 합니다.",
        "checks": [
          "wireless-power#q3",
          "wireless-power#q4"
        ]
      }
    ],
    "magnetic-brake": [
      {
        "id": "magnetic-brake@insulator",
        "topic": "새 조건에서 확인",
        "question": "구리판을 같은 모양의 절연판으로 바꿉니다. 이 비교에서 예상되는 것은?",
        "choices": [
          "전류가 흐르기 어려워 유도에 의한 제동이 크게 줄어든다",
          "모양만 같으면 제동 효과도 반드시 같다",
          "절연판이 더 많은 맴돌이 전류를 만든다"
        ],
        "answer": 0,
        "why": "도체 안의 전류가 필요한 현상이므로 전기 전도성이 중요합니다.",
        "checks": [
          "magnetic-brake#q1",
          "magnetic-brake#q2"
        ]
      },
      {
        "id": "magnetic-brake@upward",
        "topic": "새 조건에서 확인",
        "question": "자석을 구리판 사이에서 위로 움직이면 제동력은?",
        "choices": [
          "항상 위쪽",
          "운동을 방해하는 아래쪽",
          "중력이 없어져 0"
        ],
        "answer": 1,
        "why": "유도 효과는 아래·위라는 고정 방향보다 상대 운동의 변화를 방해한다는 원리로 판단합니다.",
        "checks": [
          "magnetic-brake#q3",
          "magnetic-brake#q4"
        ]
      }
    ],
    "transistor-speaker": [
      {
        "id": "transistor-speaker@repair",
        "topic": "새 조건에서 확인",
        "question": "파형이 잘리지 않도록 하려면 이 모형에서 먼저 할 수 있는 조작은?",
        "choices": [
          "입력 진폭을 더 키운다",
          "입력 진폭을 줄인다",
          "전원을 끄고 같은 음량을 기대한다"
        ],
        "answer": 1,
        "why": "선형 증폭 범위 안으로 입력을 줄이면 파형 제한을 피할 수 있습니다.",
        "checks": [
          "transistor-speaker#q2",
          "transistor-speaker#q3"
        ]
      },
      {
        "id": "transistor-speaker@frequency",
        "topic": "새 조건에서 확인",
        "question": "회로가 정상 범위에서 220 Hz 신호를 증폭합니다. 출력의 주파수는?",
        "choices": [
          "이득이 10이면 2200 Hz",
          "반드시 0 Hz",
          "220 Hz로 유지된다"
        ],
        "answer": 2,
        "why": "이득은 신호의 크기 변화이며 주파수를 그 배수로 바꾸는 뜻이 아닙니다.",
        "checks": [
          "transistor-speaker#q1",
          "transistor-speaker#q4"
        ]
      }
    ],
    "soap-film": [
      {
        "id": "soap-film@wavelength",
        "topic": "새 조건에서 확인",
        "question": "같은 막에서 빨간빛과 파란빛의 밝은 띠 위치가 다른 까닭은?",
        "choices": [
          "파장에 따라 보강 간섭의 두께 조건이 다르다",
          "막의 두께가 모든 파장에서 같은 간섭 조건을 만들기 때문에",
          "빨간빛만 앞면에서 반사되기 때문에"
        ],
        "answer": 0,
        "why": "광로 차가 파장의 몇 배인지가 중요하므로 파장이 바뀌면 간섭 조건도 바뀝니다.",
        "checks": [
          "soap-film#q1",
          "soap-film#q3"
        ]
      },
      {
        "id": "soap-film@height",
        "topic": "새 조건에서 확인",
        "question": "세운 막의 위아래에 가로 무늬가 나타났습니다. 그 원인을 설명할 때 고려할 것은?",
        "choices": [
          "중력은 액체 막에 작용하지 않는다",
          "높이에 따라 막 두께가 달라지고 간섭 조건도 달라진다",
          "각 무늬는 반드시 다른 색 물감이다"
        ],
        "answer": 1,
        "why": "배수로 생긴 두께 차가 위치에 따른 간섭 차이를 만듭니다.",
        "checks": [
          "soap-film#q3",
          "soap-film#q4"
        ]
      }
    ],
    "polarization": [
      {
        "id": "polarization@axis",
        "topic": "새 조건에서 확인",
        "question": "A는 0°에서 가장 밝고 B는 40°에서 가장 밝습니다. 두 광원에 대한 해석은?",
        "choices": [
          "B의 빛은 반드시 더 빠르다",
          "선편광 방향이 서로 다를 수 있다",
          "A와 B의 파장이 반드시 같다"
        ],
        "answer": 1,
        "why": "투과 세기가 최대인 방향은 선편광의 진동 방향과 관련됩니다. 속도나 파장을 이 관찰로 확정하지 않습니다.",
        "checks": [
          "polarization#q1",
          "polarization#q3"
        ]
      },
      {
        "id": "polarization@unknown",
        "topic": "새 조건에서 확인",
        "question": "새 광원이 모든 각도에서 일정하게 측정되었습니다. 타당한 다음 판단은?",
        "choices": [
          "무편광이라고만 확정한다",
          "광원이 가짜라고 결론 낸다",
          "다른 편광 상태도 가능한지 추가 관찰을 설계한다"
        ],
        "answer": 2,
        "why": "한 측정으로 구별되지 않는 경우를 인정하고 더 많은 근거를 수집합니다.",
        "checks": [
          "polarization#q2",
          "polarization#q4"
        ]
      }
    ],
    "electron-slits": [
      {
        "id": "electron-slits@spacing",
        "topic": "새 조건에서 확인",
        "question": "파장과 스크린 거리는 같게 두고 두 슬릿의 간격을 넓힙니다. 먼 스크린의 간섭 띠 간격은?",
        "choices": [
          "넓어진다",
          "좁아진다",
          "전자 수가 정한다"
        ],
        "answer": 1,
        "why": "원거리 간섭 띠 간격은 슬릿 간격에 반비례합니다.",
        "checks": [
          "electron-slits#q2",
          "electron-slits#q4"
        ]
      },
      {
        "id": "electron-slits@path",
        "topic": "새 조건에서 확인",
        "question": "경로 측정 없이 많은 점을 모았습니다. 이 자료에서 직접 알 수 있는 것은?",
        "choices": [
          "각 전자가 반드시 왼쪽 슬릿을 지났다",
          "각 전자의 검출 전 상세한 궤적",
          "도착 위치의 빈도 분포"
        ],
        "answer": 2,
        "why": "검출 위치의 분포와 검출되지 않은 경로에 관한 주장을 구별합니다.",
        "checks": [
          "electron-slits#q1",
          "electron-slits#q3"
        ]
      }
    ],
    "gas-identification": [
      {
        "id": "gas-identification@pressure-error",
        "topic": "새 조건에서 확인",
        "question": "수증기압을 빼지 않고 더 큰 압력을 넣어 M=mRT/(PV)를 계산하면 몰 질량은?",
        "choices": [
          "실제보다 작게 계산된다",
          "실제보다 크게 계산된다",
          "압력은 식에 영향을 주지 않는다"
        ],
        "answer": 0,
        "why": "분모의 압력을 과대평가하면 몰 질량은 작게 계산됩니다.",
        "checks": [
          "gas-identification#q2",
          "gas-identification#q4"
        ]
      },
      {
        "id": "gas-identification@head",
        "topic": "새 조건에서 확인",
        "question": "실린더 안 수면이 바깥보다 높습니다. 안의 전체 기체 압력은?",
        "choices": [
          "바깥 대기압보다 높다",
          "바깥 대기압보다 낮다",
          "수면 높이와 관계없이 언제나 같다"
        ],
        "answer": 1,
        "why": "더 높은 안쪽 물기둥을 지탱하려면 바깥의 압력이 더 커야 합니다. 높이를 같게 하면 이 보정이 없어집니다.",
        "checks": [
          "gas-identification#q2",
          "gas-identification#q3"
        ]
      }
    ],
    "sugar-phase": [
      {
        "id": "sugar-phase@dilute",
        "topic": "새 조건에서 확인",
        "question": "0.4 m 설탕물에 물만 더 넣어 0.2 m로 만들었습니다. 초기 끓는점과 어는점은?",
        "choices": [
          "둘 다 올라간다",
          "끓는점은 낮아지고 어는점은 높아진다",
          "끓는점은 높아지고 어는점은 낮아진다"
        ],
        "answer": 1,
        "why": "희석하면 두 총괄성 변화의 크기가 줄어 순수한 물의 값에 가까워집니다.",
        "checks": [
          "sugar-phase#q2",
          "sugar-phase#q3"
        ]
      },
      {
        "id": "sugar-phase@mass",
        "topic": "새 조건에서 확인",
        "question": "물 1 kg으로 0.2 m 설탕물을 만들 때, 물 500 g인 경우와 비교하면 필요한 설탕과 초기 끓는점은?",
        "choices": [
          "설탕은 두 배, 끓는점은 같다",
          "설탕도 끓는점 오름도 두 배",
          "설탕은 같고 끓는점은 절반"
        ],
        "answer": 0,
        "why": "같은 몰랄 농도에서는 용매와 용질의 양을 같은 비율로 늘려도 초기 상변화 온도가 같습니다.",
        "checks": [
          "sugar-phase#q1",
          "sugar-phase#q4"
        ]
      }
    ],
    "hess-calorimetry": [
      {
        "id": "hess-calorimetry@subtract",
        "topic": "새 조건에서 확인",
        "question": "A→B가 −30 kJ, A→C가 −80 kJ입니다. B→C의 엔탈피 변화는?",
        "choices": [
          "−110 kJ",
          "+50 kJ",
          "−50 kJ"
        ],
        "answer": 2,
        "why": "−30+ΔH(B→C)=−80이므로 −50 kJ입니다.",
        "checks": [
          "hess-calorimetry#q1",
          "hess-calorimetry#q3"
        ]
      },
      {
        "id": "hess-calorimetry@heat-loss",
        "topic": "새 조건에서 확인",
        "question": "열이 바깥으로 새어 나가 측정 온도 상승이 작아졌습니다. −mcΔT/n으로 구한 값은?",
        "choices": [
          "음의 크기가 실제보다 작아질 수 있다",
          "실제보다 반드시 더 큰 음수가 된다",
          "열손실이 있어도 언제나 정확하다"
        ],
        "answer": 0,
        "why": "용액이 얻은 열을 작게 측정하면 발열 엔탈피의 절댓값을 과소평가합니다.",
        "checks": [
          "hess-calorimetry#q2",
          "hess-calorimetry#q4"
        ]
      }
    ],
    "buffer-solution": [
      {
        "id": "buffer-solution@equal",
        "topic": "새 조건에서 확인",
        "question": "물에는 산 한 방울, 완충액에는 열 방울을 넣고 비교했습니다. 우선 바꿀 것은?",
        "choices": [
          "같은 양·농도의 산을 같은 초기 부피에 넣는다",
          "완충액에만 더 많이 넣는다",
          "처음 pH는 확인하지 않는다"
        ],
        "answer": 0,
        "why": "첨가량과 초기 조건을 통제해야 용액의 완충 능력을 비교할 수 있습니다.",
        "checks": [
          "buffer-solution#q1",
          "buffer-solution#q2"
        ]
      },
      {
        "id": "buffer-solution@not-seven",
        "topic": "새 조건에서 확인",
        "question": "어떤 완충 용액은 pH 4.8 부근을 유지합니다. 가능한가요?",
        "choices": [
          "완충 용액은 모두 pH 7이어야 하므로 불가능하다",
          "산성에서는 짝산과 짝염기가 함께 존재할 수 없다",
          "가능하며 조성과 성분 비에 따라 유지되는 pH가 다르다"
        ],
        "answer": 2,
        "why": "완충은 pH가 7이라는 뜻이 아니라 적은 첨가에 대한 변화가 작다는 뜻입니다.",
        "checks": [
          "buffer-solution#q1",
          "buffer-solution#q3"
        ]
      }
    ],
    "salt-hydrolysis": [
      {
        "id": "salt-hydrolysis@dilution",
        "topic": "새 조건에서 확인",
        "question": "산성인 NH₄Cl 수용액을 순수한 물로 충분히 희석하면 pH는 대체로?",
        "choices": [
          "더 작아진다",
          "7에 가까워진다",
          "강염기성으로 반드시 바뀐다"
        ],
        "answer": 1,
        "why": "농도가 줄면 산성의 정도가 작아져 물의 pH에 가까워집니다.",
        "checks": [
          "salt-hydrolysis#q1",
          "salt-hydrolysis#q4"
        ]
      },
      {
        "id": "salt-hydrolysis@new-salt",
        "topic": "새 조건에서 확인",
        "question": "HF가 약산일 때 NaF 수용액의 액성은?",
        "choices": [
          "산성",
          "NaCl과 반드시 같은 중성",
          "F⁻의 가수 분해로 염기성"
        ],
        "answer": 2,
        "why": "다른 약산의 짝염기에도 같은 원리를 적용할 수 있습니다.",
        "checks": [
          "salt-hydrolysis#q2",
          "salt-hydrolysis#q3"
        ]
      }
    ],
    "bean-respiration": [
      {
        "id": "bean-respiration@no-koh",
        "topic": "새 조건에서 확인",
        "question": "발아 콩에 KOH 대신 물을 넣은 호흡계에서 잉크가 거의 움직이지 않았습니다. 이것만으로 호흡이 없다고 할 수 없는 까닭은?",
        "choices": [
          "산소 소비와 CO₂ 발생이 기체량에서 상쇄될 수 있다",
          "물은 언제나 산소를 만들어 준다",
          "잉크는 기체량과 무관하다"
        ],
        "answer": 0,
        "why": "산소 소비와 CO₂ 발생을 함께 고려해야 합니다. 기체량 변화가 작아도 호흡할 수 있습니다.",
        "checks": [
          "bean-respiration#q2",
          "bean-respiration#q3"
        ]
      },
      {
        "id": "bean-respiration@amount",
        "topic": "새 조건에서 확인",
        "question": "마른 콩은 10 g, 발아 콩은 100 g을 넣었습니다. 상태에 따른 차이만 비교하려면?",
        "choices": [
          "발아 콩의 양을 더 늘린다",
          "같은 양의 콩과 같은 용기·초기 조건으로 비교한다",
          "대조군을 제거한다"
        ],
        "answer": 1,
        "why": "시료 양과 장치 조건을 통제해야 발아 상태의 영향을 구별할 수 있습니다.",
        "checks": [
          "bean-respiration#q1",
          "bean-respiration#q4"
        ]
      }
    ]
  }
};if(typeof module!=='undefined'){module.exports=extra;}else{root.scienceExperimentQuestions=extra;}})(typeof window==='undefined'?globalThis:window);
