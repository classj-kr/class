# Development tools

이 폴더는 운영 사이트에서 직접 사용하지 않는 분석 도구를 모아 둡니다.

- 루트의 Python 스크립트: 음원 분석·생성·분할 및 이야기책 검수 도구
- `workbook-analysis/`: XLSM 구조 분석 코드와 분석 근거 자료
- `.cache/`: 분석 스크립트가 사용하는 로컬 Python 의존성(배포 제외)

수집·학습 자료는 `references/`, 임시 결과는 `outputs/`에 보관합니다.

- `../references/image-training/geumseong-lora-kit/`: 이미지 학습 데이터와 설명
- `../outputs/reports/art-url-audit/data/`: 미술 자료 URL 검증 결과
- `../outputs/work/math-question-batches/`: 수학 문항 작업 데이터

사이트 실행 코드는 루트의 `game-hub-server/`, `learning/`, `assets/`에 있습니다.
