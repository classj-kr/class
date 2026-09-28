# 영단어 상세설명 작성 가이드

`assets/data/details/level-XX.json`에 레벨별 200단어 상세설명을 넣는다. 레벨 순서대로, 20단어씩 배치 파일로 쓰고 병합한다.

## 단어 번호

단어 번호는 **1~3000번 전체 번호**로 부른다. 앱의 "All 3,000 Words" 목록 번호와 같다.
번호 = (레벨 − 1) × 200 + 레벨 안 순서. 예: Level 4의 41번째 단어 tall = #641.
데이터의 `id`(예: 2642)는 내부 키일 뿐이고 번호가 아니다.

## 진행 상황 (2026-09-28 기준)

- #1–#640 완료 (Level 1–3 전체, Level 4 앞 40개)
- 다음: #641 (tall)부터
- 최신 진행 상황은 `merge_batch.py` 실행 결과의 `next: #번호`로 확인

## 작업 순서

1. 단어 목록 보기: `python tools/list_level.py 641 660` (전체 번호 범위)
2. 배치 파일 작성 (저장소 밖 임시 폴더에): `{"<id>": entry, ...}` 20개
3. 병합 및 검증: `python tools/merge_batch.py 4 <배치파일>`, 결과 예: `merged #641-#660 (20) -> level 4: 60/200` / `done 660/3000, next: #661`
4. 커밋과 푸시 (몇 배치마다), 커밋 메시지에 번호 범위 적기 (예: `vocabulary details #641-#660`)

## entry 스키마

```json
{
  "word": "coat",
  "overview": ["문단", "..."],
  "easy": [{"word": "coat", "en": "I wear a coat.", "ko": "나는 코트를 입어요."}],
  "etymology": ["어원 설명 문단", "..."],
  "meanings": ["뜻 1 설명", "뜻 2 설명"],
  "examples": [{"en": "...", "ko": "..."}],
  "together": [{"type": "유의어", "word": "jacket", "ko": "재킷", "en": "a short coat"}]
}
```

- `examples` 6개, `together` 6개가 기본
- `together.type`: 유의어 / 반의어 / 파생어 / 연관어 / 변화형
- `word`는 원본 데이터(english-vocabulary-3000-v2.json)의 철자와 같아야 하고, id의 globalLevel이 레벨과 같아야 함 (merge_batch.py가 검사)

## 작성 규칙

- 초등학생 눈높이의 쉬운 말투, 네이버 카페 "영단어연구소" 수준의 자세함. 단, 카페 글을 복사하지 않고 직접 쓴다.
- "가장 많이 쓰는 단어 10개 안" 같은 **빈도 순위 문장은 넣지 않는다.**
- 예문은 자연스러운 실제 영어로 쓴다 (어색한 문장 금지).
- 기존 level-02~04.json의 항목을 참고해 분량과 톤을 맞춘다.
