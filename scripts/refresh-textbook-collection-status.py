"""Recount runtime plans and record the latest source review checkpoint."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'references/textbooks'
OUT=ROOT/'game-hub-server/data/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))

status=read(REF/'collection-status.json')
plans=[p for f in OUT.glob('pacing-*-2022.json') for p in read(f)['plans']]
aliases={'교학사·교학도서':['교학사','교학도서'],'디딤돌':['디딤돌교육'],'천재교과서·천재교육':['천재교과서','천재교육']}
for item in status['pacing']:
    names=aliases.get(item['publisher'],[item['publisher']])
    selected=[p for p in plans if p['publisher'] in names]
    item['normalizedPlans']=len(selected)
    item['structuredLessonRows']=sum(len(p['lessons']) for p in selected)
    if item['publisher']=='비상교육':
        item['remaining']='5·6학년 2학기 수학은 지도서 각 64시수, 사회·과학은 공개 전자책 목차 확보. 사회 각 45시수는 지도 계획 대조 필요. 과학 각 48시수, 별도 읽기 자료 8개는 시수에 합산하지 않음. 수행평가 추가 수집 필요'
    if item['publisher']=='미래엔' and selected:
        item.update(status='public-outline-normalized-original-download-certification-required',
                    coverage='검정 교과서 3~6학년 30개 학년·과목 조합, 42개 온라인 목록',
                    remaining='원본 진도표는 교사 인증 필요. 공개 차시 1965행 변환. 영어 시수 미표기 12행, 사회 4-1 49시수·미술 5학년 66시수는 연간표 대조 필요. 국정 과목 및 수행평가 추가 수집')
    if item['publisher']=='천재교과서·천재교육' and selected:
        item.update(status='public-outline-normalized-original-plan-comparison-pending',
                    acquiredPublicTextbookPages=156,acquiredPublicUnitPages=1109,
                    coverage='검정 3~6학년 모든 저자판과 국정 1~6학년 공개 수업 목록. 동일 연간 목차 26개 중복 제거',
                    remaining='122개 계획·5120행 변환. 시수 미표기·원문 중복 593행은 null 유지. 박만구 수학 5-1 중복 3차시와 사회 4-2 1단원 표기 대조 필요. 원본 진도표·수행평가 수집 계속')
    if item['publisher']=='와이비엠':
        item['remaining']='사회 3~4학년 네 학기 각 48시수 확보(3-1 연간 PDF, 나머지 공개 전자책 목차). 전자책 목차의 교과서 쪽수 미표기는 null 유지. 사회 5~6 원본 후반 중복 페이지 추가 대조 및 수행평가 수집 필요'
    if item['publisher']=='금성출판사':
        item['remaining']='체육 3~4학년 중복 다운로드 파일 문제는 학년이 명시된 공식 지도서 60~63쪽으로 대체해 각 102시수 확보. 나머지 미수집 과목·학기 및 수행평가 수집 계속'
    if item['publisher']=='교학사·교학도서':
        item.update(status='official-online-outline-normalized', acquiredPublicHtmlFiles=10,
                    coverage='교학사 체육 3~6·실과 5~6, 교학도서 미술 3~6',
                    remaining='공식 온라인 차시 435행 확보. 연간 파일 다운로드 대조와 원문 오자 검수 필요. 학기 구분은 null 유지')
    if item['publisher']=='아트앤컬처':
        item.update(status='official-annual-table-normalized',
                    remaining='지도서 연간표로 3~6학년 각 68시수 변환. 개별 수업안 시수 충돌 기록. 수행평가 48개 단원 연결 및 120개 평가 단계·360개 상중하 기준 추출. 학년별 표본 시각 검수, 개별 활동 대응 검수 대기')
    if item['publisher']=='디딤돌':
        item.update(status='normalized-pacing-with-source-corrections', acquiredPageImages=32, coverage='수학 3~6학년 양 학기 지도 계획',
                    remaining='3~6학년 양 학기 각 64시수 변환. 3-1·5-1 원문 오류 9개 제목은 단원 지도 계획 133·290쪽으로 보정. 교사용 자료실 수행평가 추가 수집 필요')
status['structuredPlans']=len(plans)
status['structuredLessonRows']=sum(len(p['lessons']) for p in plans)
coverage=read(OUT/'pacing-coverage.json')['coverage']
status['gradeEditionCoverage']['withAtLeastOnePlan']=sum(c['status']=='acquired' for c in coverage)
status['gradeEditionCoverage']['total']=len(coverage)
status['next']=['학년·교과서 조합의 최소 1개 자료 확보와 별도로 전체 학기·연간 차시 완결성 점검',
                '미래엔 교사 인증 후 원본 확보 및 천재 온라인 목차의 시수 누락·중복 대조',
                '미수집 과목·학기 자료와 수행평가 원본 추가 수집',
                '수행평가 성취기준·평가요소·방법·채점기준 추출 및 검수']
if not any(i['publisher']=='비상교육' for i in status['assessments']):status['assessments'].append({'publisher':'비상교육'})
if (REF/'assessment-index-tselpa-2022.json').exists() and not any(i['publisher']=='천재교과서·천재교육' for i in status['assessments']):
    status['assessments'].append({'publisher':'천재교과서·천재교육'})
if (REF/'assessment-index-jihak-2022.json').exists() and not any(i['publisher']=='지학사' for i in status['assessments']):
    status['assessments'].append({'publisher':'지학사'})
for item in status['assessments']:
    if item['publisher']=='지학사':
        ja=read(REF/'assessment-index-jihak-2022.json')['assessments']
        item.update(status='originals-acquired-partial',downloadedSourceAssets=len(ja),
                    index='references/textbooks/assessment-index-jihak-2022.json',
                    rightsReview='references/textbooks/jihak-assessment-rights-review.json',
                    remaining='교사 로그인 다운로드 확인, 다른 학년·학기 평가자료 수집 및 채점기준 변환 진행 중')
        content_path=REF/'assessment-content-jihak-science-2022.json'
        if content_path.exists():
            jc=read(content_path)['assessments']
            item.update(structuredDocuments=len(jc),structuredStages=sum(len(a['stages']) for a in jc),
                        structuredRubricLevels=sum(len(s['levels']) for a in jc for s in a['stages']),
                        content='references/textbooks/assessment-content-jihak-science-2022.json',
                        rubricExtraction='Science HWP cells and merged spans validated; original performance levels and feedback preserved; visual review pending')
    if item['publisher']=='천재교과서·천재교육':
        ta=read(REF/'assessment-index-tselpa-2022.json')['assessments']
        tr=read(REF/'assessment-tselpa-acquisition-review.json')
        item.update(status='originals-acquired-partial',downloadedSourceAssets=len(ta),
                    index='references/textbooks/assessment-index-tselpa-2022.json',
                    unacquiredListedFiles=len(tr['issues']),remaining='학년·과목별 추가 수집, 영어·도덕 묶음 다운로드 재확인, 성취기준·채점기준 변환',
                    rightsReview='references/textbooks/tselpa-download-review.json')
        content_path=REF/'assessment-content-tselpa-science-2022.json'
        if content_path.exists():
            tc=read(content_path)['assessments']
            item.update(structuredDocuments=len(tc),structuredRubricLevels=sum(len(a['rubric']) for a in tc),
                        content='references/textbooks/assessment-content-tselpa-science-2022.json',
                        rubricExtraction='Single-stage science rubric fields extracted; multi-question documents and visual review pending')
    if item['publisher']=='비상교육':
        vr=read(REF/'assessment-visang-extraction-review.json')
        total=len(read(REF/'visang-public-bank-acquired.json')['sources'])+len(read(REF/'visang-public-archive-acquired.json')['sources'])
        item.update(status='structured-rubrics-extracted-partial',downloadedSourceAssets=total,indexedAssessmentAssets=vr['indexedAssessmentAssets'],
                    structuredDocuments=vr['structuredDocuments'],structuredStages=vr['structuredStages'],structuredRubricLevels=vr['structuredStages']*3,
                    index='references/textbooks/assessment-index-visang-2022.json',content='references/textbooks/assessment-content-visang-2022.json',
                    coverage='수학·과학·사회 3~6학년 양 학기 공개 전자책 자료실 및 전자저작물 ZIP',
                    remaining='다른 과목 수행평가 수집, 수학 수식·도형 보존 변환, 평가 원본 시각 검수와 활동별 연결',
                    countMeaning='원본 자산에 ZIP 묶음이 포함되어 개별 평가 과제 수와 다름')
        document_index=REF/'assessment-documents-visang-2022.json'
        if document_index.exists():
            di=read(document_index)['summary']
            item.update(individualAssessmentFiles=di['individualFiles'],zipMemberFiles=di['zipMemberFiles'],
                        documentIndex='references/textbooks/assessment-documents-visang-2022.json')
    if item['publisher']=='아침나라':
        item.update(status='structured-rubrics-extracted',structuredDocuments=66,canonicalDocuments=96,
                    structuredRubricLevels=198,content='references/textbooks/assessment-content-achim-2022.json',
                    rubricExtraction='Music 40 and art 26 rubrics; music grade samples visually compared with PDF variants; art visual review pending',
                    relatedWorksheets=26,assessmentPlans=4,
                    remaining='미술 3~4학년 원본 추가 수집, 미술 활동별 연결 검수, 음악 3~4학년 3단원명 불일치 6건 원본 진도표 검수')
    if item['publisher']=='체육과건강':
        item['status']='structured-fields-extracted'
        item['rubricExtraction']='122 structurally validated; original embedded first-page images visually checked for one sample per grade 3–6; remaining documents not visually reviewed'
        item['structuredDocuments']=122
        item['content']='references/textbooks/assessment-content-sports-2022.json'
        item['bodyReviewedLessonMatches']=3
        item['needsContentReview']=1
    if item['publisher']=='아트앤컬처':
        item['unitMetadataMatches']=48
        item['structuredDocuments']=48
        item['structuredStages']=120
        item['structuredRubricLevels']=360
        item['contentStatus']='structured-fields-extracted-layout-samples-reviewed'
        item['status']='structured-fields-extracted'
        item['rubricExtraction']='48 documents, 120 stages, 360 levels; visual samples checked for each grade'
        item['content']='references/textbooks/assessment-content-artculture-2022.json'
        item['matchMeaning']='학년·단원 단위 연결이며 개별 활동과 평가 항목의 대응은 아직 검수하지 않음'
(REF/'collection-status.json').write_text(json.dumps(status,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# The current product uses list labels only; keep acquisition history separate.
import subprocess,sys
subprocess.run([sys.executable,str(ROOT/'scripts/audit-assessment-list-coverage.py')],check=True)
print(json.dumps({k:status[k] for k in ['structuredPlans','structuredLessonRows','gradeEditionCoverage']}))
