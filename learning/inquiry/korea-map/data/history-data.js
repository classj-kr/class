// 한국사 학습 지도. 좌표는 [경도, 위도], bounds는 [서, 남, 동, 북].
// 원전·기출 링크와 개략도 주의사항은 각 장면에 보관한다.
window.KOREA_HISTORY = {
  "version": 1,
  "scope": "한능검·수능 한국사 지도 읽기용 학습 주제. 전체 기출을 망라한 목록이나 공식 출제 범위가 아님.",
  "chronology": "주제의 시작 시점을 기준으로 배열. 여러 해에 걸친 주제는 시기가 겹칠 수 있음.",
  "scenes": [
    {
      "title": "여러 나라의 성장",
      "period": "1~3세기",
      "bounds": [
        122.8,
        33.5,
        132.1,
        46.3
      ],
      "marks": [
        {
          "xy": [
            126.5608,
            43.84652
          ],
          "label": "부여 · 송화강",
          "side": "left",
          "kind": "area"
        },
        {
          "xy": [
            126.19455,
            41.12818
          ],
          "label": "고구려 · 압록강",
          "side": "left",
          "kind": "area"
        },
        {
          "xy": [
            127.53639,
            39.91833
          ],
          "label": "옥저",
          "side": "right",
          "kind": "area"
        },
        {
          "xy": [
            127.44361,
            39.15278
          ],
          "label": "동예",
          "side": "right",
          "kind": "area"
        },
        {
          "xy": [
            127.14889,
            35.82194
          ],
          "label": "마한",
          "side": "left",
          "kind": "area"
        },
        {
          "xy": [
            129.21167,
            35.84278
          ],
          "label": "진한",
          "side": "right",
          "kind": "area"
        },
        {
          "xy": [
            128.88111,
            35.23417
          ],
          "label": "변한",
          "side": "right",
          "kind": "area"
        }
      ],
      "cues": [
        [
          "부여",
          "사출도 · 영고(12월) · 순장"
        ],
        [
          "고구려",
          "동맹(10월) · 서옥제 · 제가 회의"
        ],
        [
          "옥저 / 동예",
          "민며느리제·가족 공동 무덤 / 책화·무천"
        ],
        [
          "삼한",
          "천군·소도. 변한은 철 생산·수출"
        ]
      ],
      "trap": "옥저의 민며느리제와 고구려의 서옥제를 바꾸지 않는다.",
      "source": "https://contents.history.go.kr/front/ta/view.do?levelId=ta_m41_0030_0020",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": [
        "한능검 62회 2번",
        "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000029925"
      ],
      "note": "대표 생활 권역을 표시한 개략 위치도. 표지는 수도나 확정 국경을 뜻하지 않음.",
      "id": "early-states",
      "era": "여러 나라",
      "startYear": 1,
      "endYear": 300
    },
    {
      "title": "4세기 · 백제의 성장",
      "period": "4세기 · 근초고왕",
      "bounds": [
        123.5,
        33.8,
        130.8,
        42
      ],
      "marks": [
        {
          "xy": [
            126.9784,
            37.566
          ],
          "label": "한성 · 한강 유역",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            125.75432,
            39.03385
          ],
          "label": "평양성 공격(371)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            129.21167,
            35.84278
          ],
          "label": "신라",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "가장 먼저 볼 것",
          "한강 유역을 가진 백제 + 평양 방면의 공격"
        ],
        [
          "왕 연결",
          "근초고왕: 고구려 공격, 왕위 부자 상속 확립"
        ],
        [
          "선지 연결",
          "고흥의 『서기』 · 마한 세력 병합"
        ]
      ],
      "trap": "불교 수용은 침류왕(384). 사비 천도는 성왕(538).",
      "source": "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m61_0040_0020",
      "routes": [
        {
          "coords": [
            [
              126.9784,
              37.566
            ],
            [
              125.75432,
              39.03385
            ]
          ],
          "color": 1,
          "label": "",
          "dash": false
        }
      ],
      "areas": [],
      "labels": [
        {
          "name": "고구려",
          "xy": [
            126.9,
            41
          ]
        },
        {
          "name": "백제",
          "xy": [
            126.7,
            36.4
          ]
        },
        {
          "name": "신라",
          "xy": [
            129,
            36.6
          ]
        },
        {
          "name": "가야",
          "xy": [
            128.1,
            35.3
          ]
        }
      ],
      "exam": null,
      "note": "교과서 도판의 시대별 영역선을 기준점에 맞춰 재구성한 학습 지도.",
      "id": "baekje-fourth",
      "era": "삼국",
      "startYear": 300,
      "endYear": 399,
      "overlay": "history/baekje-fourth.svg?v=20260921-3",
      "overlayBounds": [
        120,
        33,
        133,
        46
      ],
      "mapSource": [
        "지학사 고등학교 한국사 · 2019 검정 · 15~16쪽 지도 · PDF 17쪽",
        "https://www.jihak.co.kr/upload/public/pdf-viewer/TB/130324.pdf#page=17"
      ],
      "legend": [
        {
          "label": "고구려",
          "color": "#86b7cf"
        },
        {
          "label": "백제",
          "color": "#e7b579"
        },
        {
          "label": "신라",
          "color": "#a4c77c"
        },
        {
          "label": "가야",
          "color": "#c2add3"
        }
      ]
    },
    {
      "title": "5세기 · 고구려의 남진",
      "period": "5세기 · 광개토 대왕·장수왕",
      "bounds": [
        120.5,
        33.8,
        132,
        46.5
      ],
      "marks": [
        {
          "xy": [
            126.19455,
            41.12818
          ],
          "label": "국내성",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            125.75432,
            39.03385
          ],
          "label": "평양 천도(427)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            126.9784,
            37.566
          ],
          "label": "한성 함락(475)",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            127.12472,
            36.45556
          ],
          "label": "백제 → 웅진",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            127.9287,
            36.97666
          ],
          "label": "충주 고구려비",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "가장 먼저 볼 것",
          "넓어진 만주 영역 + 한강까지 내려온 고구려"
        ],
        [
          "광개토 대왕",
          "만주 진출 · 신라에 침입한 왜 격퇴(400)"
        ],
        [
          "장수왕",
          "평양 천도 → 한성 함락 → 백제 웅진 천도"
        ]
      ],
      "trap": "평양 천도는 장수왕. 한강 확보를 진흥왕과 혼동하지 않는다.",
      "source": "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m61_0040_0020",
      "routes": [
        {
          "coords": [
            [
              126.19455,
              41.12818
            ],
            [
              125.75432,
              39.03385
            ]
          ],
          "color": 0,
          "label": "",
          "dash": false
        },
        {
          "coords": [
            [
              125.75432,
              39.03385
            ],
            [
              126.9784,
              37.566
            ]
          ],
          "color": 0,
          "label": "",
          "dash": false
        },
        {
          "coords": [
            [
              126.9784,
              37.566
            ],
            [
              127.12472,
              36.45556
            ]
          ],
          "color": 1,
          "label": "",
          "dash": false
        }
      ],
      "areas": [],
      "labels": [
        {
          "name": "고구려",
          "xy": [
            125.6,
            43.2
          ]
        },
        {
          "name": "백제",
          "xy": [
            126.7,
            35.5
          ]
        },
        {
          "name": "신라",
          "xy": [
            129.2,
            36.3
          ]
        }
      ],
      "exam": null,
      "note": "교과서 도판의 시대별 영역선을 기준점에 맞춰 재구성한 학습 지도.",
      "id": "goguryeo-fifth",
      "era": "삼국",
      "startYear": 400,
      "endYear": 499,
      "overlay": "history/goguryeo-fifth.svg?v=20260921-3",
      "overlayBounds": [
        120,
        33,
        133,
        46
      ],
      "mapSource": [
        "지학사 고등학교 한국사 · 2019 검정 · 15~16쪽 지도 · PDF 17쪽",
        "https://www.jihak.co.kr/upload/public/pdf-viewer/TB/130324.pdf#page=17"
      ],
      "legend": [
        {
          "label": "고구려",
          "color": "#86b7cf"
        },
        {
          "label": "백제",
          "color": "#e7b579"
        },
        {
          "label": "신라",
          "color": "#a4c77c"
        },
        {
          "label": "가야",
          "color": "#c2add3"
        }
      ]
    },
    {
      "title": "백제의 천도 · 웅진에서 사비로",
      "period": "475~660년",
      "bounds": [
        126.15,
        35.95,
        127.7,
        37.95
      ],
      "marks": [
        {
          "xy": [
            126.9784,
            37.566
          ],
          "label": "한성 · 서울",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            127.12472,
            36.45556
          ],
          "label": "웅진 · 공주",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            126.90906,
            36.27472
          ],
          "label": "사비 · 부여",
          "side": "left",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "한성 → 웅진",
          "장수왕 공격 뒤 문주왕 천도(475)"
        ],
        [
          "웅진 → 사비",
          "성왕 천도(538) · 국호 남부여"
        ],
        [
          "유적 연결",
          "웅진(공주)의 무령왕릉 · 사비(부여)의 정림사지"
        ]
      ],
      "trap": "웅진 천도는 문주왕(475), 사비 천도는 성왕(538).",
      "source": "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030080",
      "routes": [
        {
          "coords": [
            [
              126.9784,
              37.566
            ],
            [
              127.12472,
              36.45556
            ],
            [
              126.90906,
              36.27472
            ]
          ],
          "color": 1,
          "label": "",
          "dash": false
        }
      ],
      "areas": [],
      "labels": [],
      "exam": [
        "한능검 75회 9번",
        "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030080"
      ],
      "note": "지점은 유적·도시 일대. 화살표는 이동·진출의 방향을 단순화한 것.",
      "id": "baekje-capitals",
      "era": "삼국",
      "startYear": 475,
      "endYear": 660,
      "maxZoom": 10
    },
    {
      "title": "6세기 · 신라의 한강 진출",
      "period": "6세기 · 진흥왕",
      "bounds": [
        124.8,
        33.8,
        131,
        42
      ],
      "marks": [
        {
          "xy": [
            126.9784,
            37.566
          ],
          "label": "한강 확보(553)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            126.96,
            37.63
          ],
          "label": "북한산 순수비",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            128.34,
            36.996
          ],
          "label": "단양 적성비",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            128.49506,
            35.54145
          ],
          "label": "창녕 순수비",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            128.26754,
            35.72939
          ],
          "label": "대가야 병합(562)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            127.29,
            40.4
          ],
          "label": "황초령 순수비",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            128.76833,
            40.39611
          ],
          "label": "마운령 순수비",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "가장 먼저 볼 것",
          "동남부 신라에서 한강·함경도 방면으로 뻗은 영역"
        ],
        [
          "왕 연결",
          "진흥왕: 한강 확보 · 대가야 병합 · 화랑도 정비"
        ],
        [
          "비석 연결",
          "순수비: 북한산·창녕·황초령·마운령"
        ]
      ],
      "trap": "단양 적성비는 순수비가 아니다. 금관가야 병합(532)은 법흥왕.",
      "source": "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m61_0040_0020",
      "routes": [],
      "areas": [],
      "labels": [
        {
          "name": "고구려",
          "xy": [
            126.5,
            40.8
          ]
        },
        {
          "name": "백제",
          "xy": [
            126.5,
            35.7
          ]
        },
        {
          "name": "신라",
          "xy": [
            129.25,
            37.3
          ]
        }
      ],
      "exam": null,
      "note": "교과서 도판의 진흥왕 최대 진출 범위를 좌표화. 빗금은 진출 후 상실한 북방 지역.",
      "id": "silla-sixth",
      "era": "삼국",
      "startYear": 500,
      "endYear": 599,
      "overlay": "history/silla-sixth.svg?v=20260921-3",
      "overlayBounds": [
        125,
        33,
        131,
        42
      ],
      "mapSource": [
        "지학사 고등학교 한국사 · 2019 검정 · 15~16쪽 지도 · PDF 18쪽",
        "https://www.jihak.co.kr/upload/public/pdf-viewer/TB/130324.pdf#page=18"
      ],
      "legend": [
        {
          "label": "백제",
          "color": "#e7b579"
        },
        {
          "label": "신라",
          "color": "#a4c77c"
        },
        {
          "label": "진출 후 상실",
          "pattern": "hatch"
        }
      ]
    },
    {
      "title": "삼국 통일과 나당 전쟁",
      "period": "660~676년",
      "bounds": [
        123.8,
        34.4,
        130.3,
        41
      ],
      "marks": [
        {
          "xy": [
            126.90906,
            36.27472
          ],
          "label": "사비 함락(660)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            127.08472,
            36.20389
          ],
          "label": "황산벌(660)",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            125.75432,
            39.03385
          ],
          "label": "고구려 멸망(668)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            127.06,
            38.03
          ],
          "label": "매소성(675)",
          "side": "right",
          "kind": "area"
        },
        {
          "xy": [
            126.72,
            36
          ],
          "label": "기벌포(676)",
          "side": "left",
          "kind": "area"
        },
        {
          "xy": [
            129.21167,
            35.84278
          ],
          "label": "신라",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "백제 멸망",
          "김유신·계백 → 황산벌 → 사비 함락(660)"
        ],
        [
          "고구려 멸망",
          "나당 연합군의 평양성 함락(668)"
        ],
        [
          "나당 전쟁",
          "매소성(675) → 기벌포(676), 당군 축출"
        ]
      ],
      "trap": "황산벌은 백제와의 전투. 매소성·기벌포는 당과의 전투.",
      "source": "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m61_0050_0010",
      "routes": [
        {
          "coords": [
            [
              129.21167,
              35.84278
            ],
            [
              127.08472,
              36.20389
            ],
            [
              126.90906,
              36.27472
            ]
          ],
          "color": 2,
          "label": "",
          "dash": false
        }
      ],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "매소성은 위치 비정에 이견이 있어 경기 북부 권역으로 표시. 기벌포는 금강 하구.",
      "id": "unification",
      "era": "삼국",
      "startYear": 660,
      "endYear": 676
    },
    {
      "title": "발해의 중심지와 대외 교류",
      "period": "698~926년",
      "bounds": [
        119.5,
        34,
        140.5,
        47
      ],
      "marks": [
        {
          "xy": [
            128.22861,
            43.36954
          ],
          "label": "동모산 · 건국",
          "side": "left",
          "kind": "area"
        },
        {
          "xy": [
            129.16,
            44.1
          ],
          "label": "상경 용천부",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            129.03,
            42.82
          ],
          "label": "중경 현덕부",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            130.57,
            42.86
          ],
          "label": "동경 용원부",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            126.9,
            41.8
          ],
          "label": "서경 압록부",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            128.3,
            40.45
          ],
          "label": "남경 남해부 · 북청 일대",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            120.75,
            37.82
          ],
          "label": "당 · 산둥",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            136.0556,
            35.6455
          ],
          "label": "일본 · 쓰루가 방면",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "지도 단서",
          "만주·한반도 북부 + 5경 + 당·일본 방면 교통로"
        ],
        [
          "문왕",
          "친당 관계 · 3성 6부 · 중경에서 상경으로 천도"
        ],
        [
          "선왕",
          "영역 확대 · 5경 15부 62주 · 해동성국"
        ]
      ],
      "trap": "9주 5소경·9서당 10정은 신라. 발해는 5경 15부 62주.",
      "source": "https://contents.history.go.kr/front/kc/printViewPopup.do?levelId=kc_i101000",
      "routes": [
        {
          "coords": [
            [
              126.9,
              41.8
            ],
            [
              120.75,
              37.82
            ]
          ],
          "color": 0,
          "label": "",
          "dash": false
        },
        {
          "coords": [
            [
              130.57,
              42.86
            ],
            [
              136.0556,
              35.6455
            ]
          ],
          "color": 1,
          "label": "",
          "dash": false
        }
      ],
      "areas": [],
      "labels": [],
      "exam": [
        "한능검 74회 7번",
        "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030069"
      ],
      "note": "교통로는 연결 방향만 표시. 서경·남경 등 도성의 세부 비정에는 견해 차이가 있음.",
      "id": "balhae",
      "era": "남북국",
      "startYear": 698,
      "endYear": 926
    },
    {
      "title": "통일 신라의 해상 교역",
      "period": "9세기 · 청해진 설치 828년",
      "bounds": [
        117.5,
        30.2,
        134,
        39.5
      ],
      "marks": [
        {
          "xy": [
            129.21167,
            35.84278
          ],
          "label": "신라",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            126.75,
            34.35
          ],
          "label": "청해진(828)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            122.38,
            36.87
          ],
          "label": "적산 법화원",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            119.42,
            32.39
          ],
          "label": "당 · 양저우",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            130.4,
            33.6
          ],
          "label": "일본",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "지도 단서",
          "완도 청해진에서 당·일본으로 연결되는 바닷길"
        ],
        [
          "인물 연결",
          "장보고: 청해진 설치 · 해적 소탕 · 해상 교역"
        ],
        [
          "신라 사회 선지",
          "촌락 문서 · 관료전 · 9주 5소경"
        ]
      ],
      "trap": "청해진·법화원이면 신라. 5경·담비 가죽·솔빈부의 말은 발해.",
      "source": "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000029966",
      "routes": [
        {
          "coords": [
            [
              126.75,
              34.35
            ],
            [
              122.38,
              36.87
            ]
          ],
          "color": 0,
          "label": "",
          "dash": false
        },
        {
          "coords": [
            [
              126.75,
              34.35
            ],
            [
              119.42,
              32.39
            ]
          ],
          "color": 0,
          "label": "",
          "dash": false
        },
        {
          "coords": [
            [
              126.75,
              34.35
            ],
            [
              130.4,
              33.6
            ]
          ],
          "color": 0,
          "label": "",
          "dash": false
        }
      ],
      "areas": [],
      "labels": [],
      "exam": [
        "한능검 66회 6번",
        "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000029966"
      ],
      "note": "지점은 유적·도시 일대. 화살표는 이동·진출의 방향을 단순화한 것.",
      "id": "silla-trade",
      "era": "남북국",
      "startYear": 828,
      "endYear": 841
    },
    {
      "title": "후삼국의 중심지",
      "period": "900~936년",
      "bounds": [
        124.9,
        34,
        130,
        39.2
      ],
      "marks": [
        {
          "xy": [
            127.14889,
            35.82194
          ],
          "label": "후백제 · 완산주",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            127.2175,
            38.20917
          ],
          "label": "후고구려 · 철원",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            126.55444,
            37.97083
          ],
          "label": "고려 · 송악",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            129.21167,
            35.84278
          ],
          "label": "신라 · 경주",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "서남부 / 중부",
          "견훤의 후백제(900) / 궁예의 후고구려(901)"
        ],
        [
          "고려 건국",
          "왕건 즉위(918) → 송악 천도(919)"
        ],
        [
          "통일 순서",
          "신라 항복(935) → 후백제 멸망(936)"
        ]
      ],
      "trap": "견훤은 후백제, 궁예는 후고구려. 왕건이 후백제를 세운 것이 아니다.",
      "source": "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_h61_0050_0010_0020",
      "routes": [
        {
          "coords": [
            [
              127.2175,
              38.20917
            ],
            [
              126.55444,
              37.97083
            ]
          ],
          "color": 0,
          "label": "",
          "dash": false
        }
      ],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "지점은 유적·도시 일대. 화살표는 이동·진출의 방향을 단순화한 것.",
      "id": "later-three",
      "era": "후삼국·고려",
      "startYear": 900,
      "endYear": 936
    },
    {
      "title": "서희의 외교 담판 · 강동 6주",
      "period": "993년",
      "bounds": [
        123.3,
        36.8,
        131.2,
        43.3
      ],
      "marks": [
        {
          "xy": [
            124.53167,
            40.19944
          ],
          "label": "강동 6주 · 압록강 하류",
          "side": "left",
          "kind": "area"
        },
        {
          "xy": [
            126.55444,
            37.97083
          ],
          "label": "개경",
          "side": "left",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "서쪽 · 강동 6주",
          "서희의 외교 담판(993) · 거란 1차 침입"
        ],
        [
          "판별 단서",
          "고려 서북쪽 · 압록강 하류 · 거란과의 외교"
        ]
      ],
      "trap": "강동 6주는 서희의 외교 담판, 동북 9성은 윤관의 여진 정벌.",
      "source": "https://contents.history.go.kr/eh_kk/teach/tong/III/13.htm",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "강동 6주의 대략적 방면만 표시. 여섯 주의 경계를 확정한 지도가 아님.",
      "id": "gangdong",
      "era": "후삼국·고려",
      "startYear": 993,
      "endYear": 993
    },
    {
      "title": "강감찬의 귀주 대첩",
      "period": "1019년",
      "bounds": [
        123.3,
        36.8,
        131.2,
        43.3
      ],
      "marks": [
        {
          "xy": [
            125.2529,
            39.97969
          ],
          "label": "귀주 대첩",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            126.55444,
            37.97083
          ],
          "label": "개경",
          "side": "left",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "귀주",
          "강감찬 · 거란 3차 침입 격퇴(1019)"
        ],
        [
          "앞선 사건",
          "거란 1차 침입 때 서희의 외교 담판과 강동 6주 확보(993)"
        ]
      ],
      "trap": "서희의 강동 6주 확보(993)와 강감찬의 귀주 대첩(1019)을 구별한다.",
      "source": "https://contents.history.go.kr/eh_kk/teach/tong/III/13.htm",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "귀주 전투 지역의 대표 위치를 표시.",
      "id": "gwiju",
      "era": "후삼국·고려",
      "startYear": 1019,
      "endYear": 1019
    },
    {
      "title": "윤관의 여진 정벌 · 동북 9성",
      "period": "1107~1109년",
      "bounds": [
        123.3,
        36.8,
        131.2,
        43.3
      ],
      "marks": [
        {
          "xy": [
            127.53639,
            39.91833
          ],
          "label": "동북 9성 · 동북 방면",
          "side": "right",
          "kind": "area"
        },
        {
          "xy": [
            126.55444,
            37.97083
          ],
          "label": "개경",
          "side": "left",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "동쪽 · 동북 9성",
          "윤관·별무반 · 여진 정벌(1107) → 반환"
        ],
        [
          "군사 조직",
          "별무반: 신기군·신보군·항마군"
        ]
      ],
      "trap": "동북 9성은 고려 윤관. 4군 6진은 조선 세종 때의 개척.",
      "source": "https://contents.history.go.kr/eh_kk/teach/tong/III/13.htm",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "동북 9성의 정확한 위치·범위에는 학설 차이가 있어 동북 방면으로만 표시.",
      "id": "nine-forts",
      "era": "후삼국·고려",
      "startYear": 1107,
      "endYear": 1109
    },
    {
      "title": "삼별초의 이동",
      "period": "1270~1273년",
      "bounds": [
        124.8,
        32.5,
        128,
        38.3
      ],
      "marks": [
        {
          "xy": [
            126.48556,
            37.74722
          ],
          "label": "강화도",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            126.265,
            34.48389
          ],
          "label": "진도 · 용장성",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            126.52194,
            33.50972
          ],
          "label": "제주 · 항파두리",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "지도 단서",
          "서해를 따라 강화 → 진도 → 제주로 내려감"
        ],
        [
          "진도",
          "배중손 · 왕온 추대 · 용장성"
        ],
        [
          "제주",
          "김통정 · 항파두리 · 여몽 연합군에 진압(1273)"
        ]
      ],
      "trap": "개경 환도에 반발한 항쟁. 조선의 임진왜란 해전 경로가 아니다.",
      "source": "https://contents.history.go.kr/eh_kk/teach/tong/III/13.htm",
      "routes": [
        {
          "coords": [
            [
              126.48556,
              37.74722
            ],
            [
              126.265,
              34.48389
            ],
            [
              126.52194,
              33.50972
            ]
          ],
          "color": 0,
          "label": "",
          "dash": false
        }
      ],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "지점은 유적·도시 일대. 화살표는 이동·진출의 방향을 단순화한 것.",
      "id": "sambyeolcho",
      "era": "후삼국·고려",
      "startYear": 1270,
      "endYear": 1273
    },
    {
      "title": "공민왕 · 쌍성총관부 수복",
      "period": "1356년",
      "bounds": [
        123.3,
        36.8,
        131.2,
        43.3
      ],
      "marks": [
        {
          "xy": [
            127.24,
            39.55
          ],
          "label": "쌍성총관부 · 화주",
          "side": "right",
          "kind": "area"
        },
        {
          "xy": [
            126.55444,
            37.97083
          ],
          "label": "개경",
          "side": "left",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "쌍성총관부",
          "원 간섭기의 영토 상실 → 공민왕 수복(1356)"
        ],
        [
          "정책 연결",
          "공민왕의 반원 자주 정책 · 철령 이북 영토 회복"
        ]
      ],
      "trap": "쌍성총관부 수복은 공민왕. 별무반·동북 9성의 윤관과 구별한다.",
      "source": "https://contents.history.go.kr/eh_kk/teach/tong/III/13.htm",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "화주 일대를 표시. 쌍성총관부 관할 범위의 확정도가 아님.",
      "id": "ssangseong",
      "era": "후삼국·고려",
      "startYear": 1356,
      "endYear": 1356
    },
    {
      "title": "조선의 4군 6진",
      "period": "15세기 · 세종",
      "bounds": [
        123.8,
        38.1,
        131,
        43.6
      ],
      "marks": [
        {
          "xy": [
            126.64139,
            41.46083
          ],
          "label": "4군 · 압록강 상류",
          "side": "left",
          "kind": "area"
        },
        {
          "xy": [
            129.74601,
            42.44113
          ],
          "label": "6진 · 두만강 유역",
          "side": "right",
          "kind": "area"
        },
        {
          "xy": [
            128.055,
            41.993
          ],
          "label": "백두산",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            125.75432,
            39.03385
          ],
          "label": "평양",
          "side": "left",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "서쪽 · 4군",
          "최윤덕 · 압록강 상류의 여진 정벌"
        ],
        [
          "동쪽 · 6진",
          "김종서 · 두만강 유역 개척"
        ],
        [
          "왕 연결",
          "세종 · 사민 정책 · 토관 제도"
        ]
      ],
      "trap": "4군=최윤덕, 6진=김종서. 동북 9성의 윤관은 고려 인물.",
      "source": "https://contents.history.go.kr/front/ta/view.do?levelId=ta_m41_0070_0010",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "점선 원은 4군·6진의 방면을 나타냄. 각 군·진의 행정구역 경계는 생략.",
      "id": "four-six",
      "era": "조선",
      "startYear": 1433,
      "endYear": 1449
    },
    {
      "title": "임진왜란의 주요 전투",
      "period": "1592~1598년",
      "bounds": [
        124.7,
        33.9,
        130,
        40.7
      ],
      "marks": [
        {
          "xy": [
            129.03004,
            35.10168
          ],
          "label": "부산 · 침입(1592)",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            126.9784,
            37.566
          ],
          "label": "한성",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            125.75432,
            39.03385
          ],
          "label": "평양성 탈환(1593)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            126.83,
            37.6
          ],
          "label": "행주 · 권율",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            128.08472,
            35.19278
          ],
          "label": "진주 · 김시민",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            128.5025,
            34.7622
          ],
          "label": "한산도 · 이순신",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            126.31,
            34.57
          ],
          "label": "명량(1597)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            127.87,
            34.94
          ],
          "label": "노량(1598)",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "육지의 대첩",
          "진주(1592) 김시민 / 행주(1593) 권율"
        ],
        [
          "바다의 대첩",
          "한산도(1592) 이순신 · 학익진"
        ],
        [
          "정유재란 이후",
          "명량(1597) → 노량(1598), 이순신 전사"
        ]
      ],
      "trap": "평양성 탈환에는 조명 연합군. 행주 대첩의 지휘관은 권율.",
      "source": "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m61_0090_0030",
      "routes": [
        {
          "coords": [
            [
              129.03004,
              35.10168
            ],
            [
              126.9784,
              37.566
            ],
            [
              125.75432,
              39.03385
            ]
          ],
          "color": 1,
          "label": "",
          "dash": false
        }
      ],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "지점은 유적·도시 일대. 화살표는 이동·진출의 방향을 단순화한 것.",
      "id": "imjin",
      "era": "조선",
      "startYear": 1592,
      "endYear": 1598
    },
    {
      "title": "서양 세력의 접근 · 양요와 운요호",
      "period": "1866~1875년",
      "bounds": [
        123.8,
        33.8,
        130.5,
        41
      ],
      "marks": [
        {
          "xy": [
            125.75432,
            39.03385
          ],
          "label": "평양 · 제너럴 셔먼호",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            126.48556,
            37.74722
          ],
          "label": "강화도 · 양요·운요호",
          "side": "left",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "평양",
          "제너럴 셔먼호 사건(1866)"
        ],
        [
          "강화도",
          "병인양요(1866) · 신미양요(1871) · 운요호(1875)"
        ],
        [
          "전개 순서",
          "병인양요 → 신미양요 → 운요호 사건 → 강화도 조약"
        ]
      ],
      "trap": "제너럴 셔먼호 사건은 평양 대동강. 병인양요·신미양요의 전장은 강화도.",
      "source": "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m62_0050_0020",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "지점은 유적·도시 일대. 화살표는 이동·진출의 방향을 단순화한 것.",
      "id": "foreign-incursions",
      "era": "개항기",
      "startYear": 1866,
      "endYear": 1875
    },
    {
      "title": "부산 · 원산 · 인천의 개항",
      "period": "1876~1883년",
      "bounds": [
        123.8,
        33.8,
        130.5,
        41
      ],
      "marks": [
        {
          "xy": [
            129.03004,
            35.10168
          ],
          "label": "부산(1876)",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            127.44361,
            39.15278
          ],
          "label": "원산(1880)",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            126.70515,
            37.45646
          ],
          "label": "인천(1883)",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "개항 순서",
          "부산 → 원산 → 인천"
        ],
        [
          "조약 연결",
          "강화도 조약(1876): 조선 자주국 · 해안 측량권 · 영사 재판권"
        ]
      ],
      "trap": "개항 순서는 부산(1876) → 원산(1880) → 인천(1883).",
      "source": "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m62_0050_0020",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "지점은 유적·도시 일대. 화살표는 이동·진출의 방향을 단순화한 것.",
      "id": "ports",
      "era": "개항기",
      "startYear": 1876,
      "endYear": 1883
    },
    {
      "title": "동학 농민 운동의 전개",
      "period": "1894년",
      "bounds": [
        125.8,
        34.7,
        128,
        37
      ],
      "marks": [
        {
          "xy": [
            126.91699,
            35.60004
          ],
          "label": "고부·황토현",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            126.7,
            35.43333
          ],
          "label": "무장 · 기포",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            126.78444,
            35.29778
          ],
          "label": "황룡촌 전투",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            127.14889,
            35.82194
          ],
          "label": "전주성 · 전주 화약",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            127.08472,
            36.20389
          ],
          "label": "논산 집결",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            127.12472,
            36.45556
          ],
          "label": "우금치 · 패배",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "1차 봉기",
          "황토현 → 황룡촌 → 전주성 점령 → 전주 화약"
        ],
        [
          "전주 화약 뒤",
          "집강소 설치 · 폐정 개혁 추진"
        ],
        [
          "2차 봉기",
          "일본군의 경복궁 점령 → 재봉기 → 우금치 패배"
        ]
      ],
      "trap": "전주 화약과 우금치 전투의 순서를 바꾸지 않는다.",
      "source": "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m62_0050_0030",
      "routes": [
        {
          "coords": [
            [
              126.91699,
              35.60004
            ],
            [
              126.78444,
              35.29778
            ],
            [
              127.14889,
              35.82194
            ]
          ],
          "color": 0,
          "label": "",
          "dash": false
        },
        {
          "coords": [
            [
              127.14889,
              35.82194
            ],
            [
              127.08472,
              36.20389
            ],
            [
              127.12472,
              36.45556
            ]
          ],
          "color": 1,
          "label": "",
          "dash": true
        }
      ],
      "areas": [],
      "labels": [],
      "exam": [
        "한능검 62회 32번",
        "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000029925"
      ],
      "note": "지점은 유적·도시 일대. 화살표는 이동·진출의 방향을 단순화한 것.",
      "id": "donghak",
      "era": "개항기",
      "startYear": 1894,
      "endYear": 1894
    },
    {
      "title": "안중근 · 하얼빈 의거",
      "period": "1909~1910년",
      "bounds": [
        119,
        37,
        130,
        47
      ],
      "marks": [
        {
          "xy": [
            126.65,
            45.75
          ],
          "label": "하얼빈 · 안중근(1909)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            121.27,
            38.8
          ],
          "label": "뤼순 · 순국(1910)",
          "side": "left",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "하얼빈",
          "안중근의 이토 히로부미 처단 → 『동양 평화론』"
        ],
        [
          "뤼순",
          "뤼순 감옥에서 『동양 평화론』 집필 중 순국(1910)"
        ]
      ],
      "trap": "하얼빈 의거는 1909년. 1932년 이봉창·윤봉길 의거보다 앞선다.",
      "source": "https://www.suneung.re.kr/boardCnts/view.do?boardID=1500234&boardSeq=5093798&m=0403&s=suneung",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "지점은 유적·도시 일대. 화살표는 이동·진출의 방향을 단순화한 것.",
      "id": "an-jung-geun",
      "era": "항일 독립운동",
      "startYear": 1909,
      "endYear": 1910
    },
    {
      "title": "국외 독립운동 기지",
      "period": "1910년대 · 국외 기지",
      "bounds": [
        122,
        38,
        134,
        47
      ],
      "marks": [
        {
          "xy": [
            125.74,
            42.09
          ],
          "label": "서간도 · 삼원보",
          "side": "left",
          "kind": "area"
        },
        {
          "xy": [
            129.42307,
            42.77131
          ],
          "label": "북간도 · 용정",
          "side": "right",
          "kind": "area"
        },
        {
          "xy": [
            131.87353,
            43.10562
          ],
          "label": "연해주",
          "side": "right",
          "kind": "area"
        }
      ],
      "cues": [
        [
          "서간도",
          "경학사 · 신흥 강습소 → 신흥 무관 학교"
        ],
        [
          "북간도",
          "서전서숙 · 명동 학교 · 중광단"
        ],
        [
          "연해주",
          "권업회 · 대한 광복군 정부(1914)"
        ]
      ],
      "trap": "신흥 무관 학교=서간도, 명동 학교=북간도.",
      "source": "https://contents.history.go.kr/front/nh/print.do?levelId=nh_043_0040_0030_0060_0030&whereStr=",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "대표 기지의 대략적 위치. 북간도의 서전서숙(1906)·명동 학교(1908)는 1910년대 이전부터 활동.",
      "id": "independence-bases",
      "era": "항일 독립운동",
      "startYear": 1910,
      "endYear": 1919
    },
    {
      "title": "상하이 · 대한민국 임시 정부",
      "period": "1919년",
      "bounds": [
        117,
        28,
        127,
        35
      ],
      "marks": [
        {
          "xy": [
            121.45806,
            31.22222
          ],
          "label": "상하이 · 임시 정부(1919)",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "상하이",
          "대한민국 임시 정부 수립(1919년 4월)"
        ],
        [
          "통합 임시 정부",
          "1919년 9월 상하이에서 통합 정부 출범"
        ]
      ],
      "trap": "상하이는 임시 정부 수립(1919), 충칭은 한국 광복군 창설(1940)의 장소.",
      "source": "https://contents.history.go.kr/mobile/eh/view.do?levelId=eh_r0340_0010",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "점선은 상하이 이탈 뒤 충칭 정착까지의 여러 중간 기착지를 생략한 연결선.",
      "id": "provisional-government",
      "era": "항일 독립운동",
      "startYear": 1919,
      "endYear": 1919
    },
    {
      "title": "봉오동·청산리 전투",
      "period": "1920년 · 6월 → 10월",
      "bounds": [
        127.7,
        41.6,
        131.1,
        44.2
      ],
      "marks": [
        {
          "xy": [
            129.42307,
            42.77131
          ],
          "label": "용정",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            129.84199,
            42.96562
          ],
          "label": "두만강 하류 방면",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            129.7,
            43.15
          ],
          "label": "봉오동 · 6월",
          "side": "left",
          "kind": "area"
        },
        {
          "xy": [
            128.8,
            42.3
          ],
          "label": "청산리 · 10월",
          "side": "left",
          "kind": "area"
        },
        {
          "xy": [
            129.74601,
            42.44113
          ],
          "label": "회령 · 두만강 남쪽",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "봉오동",
          "홍범도·최진동 등 독립군 연합 부대의 승리"
        ],
        [
          "청산리",
          "김좌진의 북로 군정서군·홍범도 부대 등의 승리"
        ],
        [
          "전개 순서",
          "봉오동 → 청산리 → 간도 참변 → 독립군 이동"
        ]
      ],
      "trap": "지청천의 한국 독립군·양세봉의 조선 혁명군은 주로 1930년대.",
      "source": "https://contents.history.go.kr/mobile/eh/view.do?levelId=eh_n0700_0010",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "전투 권역의 상대 위치를 표시. 개별 전투지·진군 경로의 정밀 복원도는 아님.",
      "id": "bongo-cheongsan",
      "era": "항일 독립운동",
      "startYear": 1920,
      "endYear": 1920
    },
    {
      "title": "한인 애국단 · 이봉창과 윤봉길",
      "period": "1932년",
      "bounds": [
        118,
        28.5,
        143,
        38.5
      ],
      "marks": [
        {
          "xy": [
            121.45806,
            31.22222
          ],
          "label": "상하이 · 윤봉길(1932)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            139.69171,
            35.6895
          ],
          "label": "도쿄 · 이봉창(1932)",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "도쿄 · 1월",
          "이봉창 의거"
        ],
        [
          "상하이 · 4월",
          "윤봉길의 훙커우 공원 의거"
        ],
        [
          "단체 연결",
          "이봉창·윤봉길: 김구가 조직한 한인 애국단"
        ]
      ],
      "trap": "도쿄=이봉창, 상하이=윤봉길. 하얼빈의 안중근과 구별한다.",
      "source": "https://www.suneung.re.kr/boardCnts/view.do?boardID=1500234&boardSeq=5093798&m=0403&s=suneung",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": [
        "2026학년도 수능 10번",
        "https://www.suneung.re.kr/boardCnts/view.do?boardID=1500234&boardSeq=5093798&m=0403&s=suneung"
      ],
      "note": "지점은 유적·도시 일대. 화살표는 이동·진출의 방향을 단순화한 것.",
      "id": "patriotic-corps",
      "era": "항일 독립운동",
      "startYear": 1932,
      "endYear": 1932
    },
    {
      "title": "1930년대 한중 연합 작전",
      "period": "1932~1933년",
      "bounds": [
        123,
        40,
        132,
        47.5
      ],
      "marks": [
        {
          "xy": [
            126.30711,
            45.3798
          ],
          "label": "북만주 · 쌍성보",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            130.3,
            43.4
          ],
          "label": "대전자령",
          "side": "right",
          "kind": "area"
        },
        {
          "xy": [
            125.05,
            41.72
          ],
          "label": "남만주 · 영릉가·흥경",
          "side": "left",
          "kind": "area"
        },
        {
          "xy": [
            126.19455,
            41.12818
          ],
          "label": "압록강 · 국내성 일대",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "북만주",
          "지청천 · 한국 독립군 · 쌍성보·대전자령 전투"
        ],
        [
          "남만주",
          "양세봉 · 조선 혁명군 · 영릉가·흥경성 전투"
        ],
        [
          "공통점",
          "중국의 항일 부대와 연합 작전"
        ]
      ],
      "trap": "지청천-한국 독립군 / 양세봉-조선 혁명군의 짝을 바꾸지 않는다.",
      "source": "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030110",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": [
        "조선 혁명군 관련: 한능검 77회 41번",
        "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030110"
      ],
      "note": "남·북만주의 전투 방면을 비교하는 지도. 전적지 표시는 근사 권역.",
      "id": "allied-operations",
      "era": "항일 독립운동",
      "startYear": 1932,
      "endYear": 1933
    },
    {
      "title": "우한 · 조선 의용대",
      "period": "1938년",
      "bounds": [
        109,
        27,
        119,
        35
      ],
      "marks": [
        {
          "xy": [
            114.26667,
            30.58333
          ],
          "label": "우한 · 조선 의용대(1938)",
          "side": "left",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "우한",
          "김원봉 · 조선 의용대 창설(1938)"
        ],
        [
          "조직 연결",
          "김원봉을 중심으로 중국 관내에서 조직된 항일 부대"
        ]
      ],
      "trap": "조선 의용대 창설은 우한, 한국 광복군 창설은 충칭.",
      "source": "https://contents.history.go.kr/front/tg/view.do?levelId=tg_004_2760",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "창설 도시의 위치도. 이후 화북 진출 경로는 표시하지 않음.",
      "id": "korean-volunteer-corps",
      "era": "항일 독립운동",
      "startYear": 1938,
      "endYear": 1938
    },
    {
      "title": "충칭 · 한국 광복군",
      "period": "1940~1945년",
      "bounds": [
        102,
        26,
        113,
        34
      ],
      "marks": [
        {
          "xy": [
            106.55771,
            29.56026
          ],
          "label": "충칭 · 한국 광복군(1940)",
          "side": "left",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "충칭",
          "임시 정부 정착 · 한국 광복군 창설(1940)"
        ],
        [
          "지휘부",
          "총사령관 지청천 · 대한민국 임시 정부의 군대"
        ],
        [
          "선지 연결",
          "대일 선전 포고 · 국내 진공 작전 준비"
        ]
      ],
      "trap": "조선 의용대 창설은 우한, 한국 광복군 창설은 충칭.",
      "source": "https://contents.history.go.kr/front/ta/view.do?levelId=ta_m62_0070_0030",
      "routes": [],
      "areas": [],
      "labels": [],
      "exam": null,
      "note": "한국 광복군 창설 도시의 위치도. 임시 정부의 전체 이동 경로를 뜻하지 않음.",
      "id": "liberation-army",
      "era": "항일 독립운동",
      "startYear": 1940,
      "endYear": 1945
    },
    {
      "id": "korean-war",
      "era": "현대",
      "startYear": 1950,
      "endYear": 1953,
      "period": "1950~1953년",
      "title": "6·25 전쟁의 전개",
      "bounds": [
        123.5,
        33.5,
        131.5,
        42.5
      ],
      "marks": [
        {
          "xy": [
            126.63,
            37.47
          ],
          "label": "인천 · 상륙 작전(1950.9)",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            128.4,
            35.98
          ],
          "label": "왜관 · 낙동강 방어선 일대",
          "side": "right",
          "kind": "area"
        },
        {
          "xy": [
            125.75432,
            39.03385
          ],
          "label": "평양 · 국군·유엔군 북진",
          "side": "left",
          "kind": "point"
        },
        {
          "xy": [
            126.67,
            37.96
          ],
          "label": "판문점 · 정전 협정(1953.7)",
          "side": "right",
          "kind": "point"
        },
        {
          "xy": [
            129.05,
            35.16
          ],
          "label": "부산 · 피란 수도",
          "side": "right",
          "kind": "point"
        }
      ],
      "cues": [
        [
          "전개 순서",
          "북한군 남침 → 낙동강 방어 → 인천 상륙 작전 → 국군·유엔군 북진"
        ],
        [
          "이후의 흐름",
          "중국군 개입 → 1·4 후퇴 → 전선 교착과 정전 협상"
        ],
        [
          "정전 협정",
          "1953년 7월 27일 · 판문점"
        ]
      ],
      "trap": "38도선은 위도선. 정전 뒤의 군사분계선과 같은 선이 아니다.",
      "source": "https://theme.archives.go.kr/next/625/process/frontline.do",
      "exam": null,
      "routes": [],
      "areas": [],
      "labels": [],
      "note": "주요 사건의 위치도. 시기별 전선·진군 경로의 정밀 복원도는 아님."
    }
  ]
};
