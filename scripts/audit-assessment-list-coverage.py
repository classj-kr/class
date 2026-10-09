"""Audit list metadata separately from historical acquisition of originals."""
import json,collections
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; REF=ROOT/'references/textbooks'; DATA=ROOT/'game-hub-server/data/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
editions={e['id']:e for e in read(DATA/'catalog-2022.json')['editions']}
rows=read(DATA/'assessment-catalog-2022.json')['assessments']
allowed={'id','editionId','grade','semester','subject','provider','unit','title','standardCodes','lessonIds'}
assert len({a['id'] for a in rows})==len(rows),'Duplicate runtime IDs'
for a in rows:
    assert set(a)==allowed,(a['id'],set(a)-allowed)
    e=editions[a['editionId']]
    assert a['grade'] in e['grades'] and a['subject']==e['subject']
    assert a['semester'] in [None,1,2] and a['title'].strip()
    assert not any('http://' in str(a[k]) or 'https://' in str(a[k]) for k in ['unit','title'])
grouped=collections.defaultdict(list)
for a in rows:grouped[(a['editionId'],a['grade'])].append(a)
auth={}
pending={'동아출판':('collection-in-progress','https://ele.douclass.com/assess'),'디딤돌교육':('assessment-type-unconfirmed-preview-unresponsive','https://www.didimdolclass.co.kr/')}
coverage=[]
for e in editions.values():
    for grade in e['grades']:
        items=grouped[(e['id'],grade)]
        reason=None if items else pending[e['publisher']][0] if e['publisher'] in pending else 'teacher-login-required' if e['publisher'] in auth else 'performance-list-not-present-in-checked-menu'
        coverage.append({'editionId':e['id'],'publisher':e['publisher'] or '국정','subject':e['subject'],'leadAuthor':e['leadAuthor'],'grade':grade,'listedAssessments':len(items),'semesterLabels':sorted({a['semester'] for a in items},key=lambda x:x or 0),'status':'has-list-metadata' if items else reason,'nextSource':auth.get(e['publisher']) if not items else None})
publishers=[]
for publisher in sorted({c['publisher'] for c in coverage}):
    cs=[c for c in coverage if c['publisher']==publisher]
    publishers.append({'publisher':publisher,'gradeEditionTotal':len(cs),'withListMetadata':sum(c['listedAssessments']>0 for c in cs),'listedAssessments':sum(c['listedAssessments'] for c in cs),'missing':[{'editionId':c['editionId'],'grade':c['grade'],'subject':c['subject'],'reason':c['status']} for c in cs if not c['listedAssessments']]})
report={'schemaVersion':1,'asOf':'2026-10-09','scope':'list-metadata-only','completion':'in-progress','listedAssessments':len(rows),'withAtLeastOneListItem':sum(bool(c['listedAssessments']) for c in coverage),'gradeEditionTotal':len(coverage),'meaning':'한 항목 이상 확보한 학년·교과서 조합 수이며, 전 단원·양 학기 완결을 뜻하지 않음. 연간 교과서는 semester=null. 출판사가 수행평가로 명시하지 않은 단원평가는 수행평가로 간주하지 않음.','runtimeExcludes':['publisher-original-files','publisher-criteria-text','audio','video','source-page-links'],'loginBlockedGradeEditions':sum(c['status']=='teacher-login-required' for c in coverage),'checkedMenuWithoutPerformanceList':sum(c['status']=='performance-list-not-present-in-checked-menu' for c in coverage),'publishers':publishers,'coverage':coverage}
write(REF/'assessment-list-coverage.json',report)
status=read(REF/'collection-status.json')
if 'legacyAssessmentAcquisition' not in status:status['legacyAssessmentAcquisition']=status.get('assessments',[])
status.update(asOf='2026-10-09',completion='in-progress',assessmentScope='출판사별 평가 목록의 제목·단원·학년·학기·교과서 연결만 수집. 평가기준은 자체 작성. 원본·음원·영상·출판사 채점기준을 서비스에 넣지 않음.',assessments=publishers,assessmentListCoverage={k:report[k] for k in ['listedAssessments','withAtLeastOneListItem','gradeEditionTotal','loginBlockedGradeEditions','checkedMenuWithoutPerformanceList','meaning']})
status['next']=['동아출판 로그인 확인: 교과서별 수행평가 목록 수집 진행','디딤돌 8권 목록 확보: 수행평가 유형 확인 필요, 승인된 문서 미리보기 버튼에 반응 없음','교학사/교학도서 4개, 금성 체육 4개 조합은 다른 공식 자료에서 개별 평가명 확인 필요','자료 한 건 이상 확보와 전체 단원·학기 완결성을 구분해 목록 검수','평가 기준은 자체 작성하고 교육과정 진도에 맞춰 평가시기 연결']
write(REF/'collection-status.json',status)
print(json.dumps({k:report[k] for k in ['listedAssessments','withAtLeastOneListItem','gradeEditionTotal','loginBlockedGradeEditions','checkedMenuWithoutPerformanceList']}))
