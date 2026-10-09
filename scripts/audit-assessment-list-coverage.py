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
pending={}
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
report['validation']={'emptyUnitCount':sum(not a['unit'].strip() for a in rows),'singleSemesterOnly':[{k:c[k] for k in ['editionId','grade','subject','semesterLabels']} for c in coverage if None not in c['semesterLabels'] and len(c['semesterLabels'])<2],'duplicateIdCount':0,'runtimeFieldWhitelistPassed':True}
report['documentOpeningScope']='사용자 승인에 따라 평가명·단원/평가요소 항목만 추출. 이번 승인으로 받은 임시 원본은 처리 후 삭제. 과거 수집 원본의 삭제를 뜻하지 않음.'
write(REF/'assessment-list-coverage.json',report)
status['next']=['확인한 목록 및 승인된 문서의 평가명·단원 통합 완료. 전 출판사의 미확인 자료까지 완결했다는 의미는 아님.','자료 한 건 이상 확보와 전체 단원·학기 완결성을 구분해 목록 검수','평가 기준은 자체 작성하고 교육과정 진도에 맞춰 평가시기 연결','객관식 문항은 외부 서비스 재사용·변형 권한과 문항 품질 기준을 확정한 뒤 진행']
write(REF/'collection-status.json',status)
print(json.dumps({k:report[k] for k in ['listedAssessments','withAtLeastOneListItem','gradeEditionTotal','loginBlockedGradeEditions','checkedMenuWithoutPerformanceList']}))
