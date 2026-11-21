# 국악 악기 묶음 음원 출처

출처: [국립국악원 국악기 디지털 음원 · 단음 다운로드](https://www.gugak.go.kr/digitaleum/front/monotone/list.do)

이용 조건: 공공누리 제1유형(출처표시). 국립국악원이 제공한 WAV를
Ogg Vorbis로 변환해 악기별 패드에 연결했다. 단일 동작 패드는 해당 동작의
구간만 분리했으며, 어의 마침 전곡은 머리 타격과 등 긁기의 연주 순서를 유지한다.

| 화면 파일 | 악기 | 원본 파일 | 국립국악원 음원 번호 |
| --- | --- | --- | ---: |
| `ritual-signals/bak.ogg` | 박 | Bak_1.wav | 2258 |
| `ritual-signals/chuk.ogg` | 축 | Chuk_1.wav | 2312 |
| `ritual-signals/eo.ogg` | 어 (마침 전곡) | Eo.wav | 2270 |
| `ritual-signals/eo-strike.ogg` | 어 (머리 치기) | Eo.wav (머리 타격 1회 분리) | 2270 |
| `ritual-signals/eo-scrape.ogg` | 어 (등 긁기) | Eo.wav (등 톱니 긁음 1회만 분리, 머리 타격 제외) | 2270 |
| `daechwita/nabal.ogg` | 나발 | Nabal_1.wav | 2332 |
| `daechwita/nagak.ogg` | 나각 (C4 피치 조율) | Nagak_1.wav | 2330 |
| `daechwita/yonggo.ogg` | 용고 | Yonggo_1.wav | 2276 |
| `daechwita/jabara.ogg` | 자바라(바라) | Bara_1.wav | 2254 |
| `daechwita/jing.ogg` | 징 | Jing_1.wav | 2334 |

태평소는 기존 `taepyeongso/` 건반 음원을 사용한다. 대취타 편성의
태평소 버튼은 그 건반 악기로 이동한다.

등 긁기 파일은 보존된 `ritual-signals/eo.ogg`의 2.950–3.550초 구간이다.
앞선 머리 타격을 포함하지 않도록 분리하고, 경계 클릭을 막는 시작 1ms·끝 10ms
페이드만 적용했다. 머리 치기와 마침 전곡 패드는 각각 별도의 음원을 사용한다.
