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
    ]
  }
};if(typeof module!=='undefined'){module.exports=extra;}else{root.scienceExperimentQuestions=extra;}})(typeof window==='undefined'?globalThis:window);
