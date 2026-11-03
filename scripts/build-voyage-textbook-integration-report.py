"""Record the applied textbook integration while retaining the earlier audit snapshot."""
import html
import json
import os
import subprocess
from pathlib import Path
from urllib.parse import quote

ROOT=Path(__file__).resolve().parents[1]
APP=ROOT/'learning/inquiry/age-of-exploration'
OUT=ROOT/'output/voyage-textbook-audit'
AUDIT=APP/'docs/textbook-level-audit-2026-11-02.json'


def link(path,label,page=None):
    href=quote(Path(os.path.relpath(path,OUT)).as_posix(),safe='/')
    if page:href+=f'#page={page}'
    return f'<a href="{href}" target="_blank">{html.escape(label)}</a>'


def source(evidence):
    return link(ROOT/evidence['path'],f"{evidence['publisher']} {evidence['book']} · PDF {evidence['pdfPage']}쪽",evidence['pdfPage'])


def external_link(url,label):
    return f'<a target="_blank" href="{html.escape(url,quote=True)}">{html.escape(label)}</a>'


def main():
    audit=json.loads(AUDIT.read_text(encoding='utf8'))
    sites=json.loads((APP/'data/catalog/textbook-sites.json').read_text(encoding='utf8'))
    learning=json.loads((APP/'data/catalog/discovery-learning.json').read_text(encoding='utf8'))
    js="""const c=require('./lib/mission-catalog'),p=require('./public/js/study-catalog');
    const a=[...c.DISCOVERIES,...c.CITY_LANDMARKS],u=a.filter(x=>!x.learning.alias);
    console.log(JSON.stringify({rows:a.length,unique:u.length,counted:u.filter(x=>x.learning.counted).length,recommended:u.filter(x=>x.learning.recommended).length,later:u.filter(x=>x.learning.tier==='later').length,
    levels:Object.fromEntries(['elementary','middle','high'].map(l=>[l,{all:u.filter(x=>x.learning.levels.includes(l)).length,recommended:u.filter(x=>x.learning.levels.includes(l)&&x.learning.recommended).length}]))}));"""
    after=json.loads(subprocess.run(['node','-e',js],cwd=APP,capture_output=True,text=True,encoding='utf8',check=True).stdout)
    promoted=list(sites['questionRevisions'])
    added=sites['discoveries']+sites['cityLandmarks']
    report={'appliedAt':'2026-11-02','applicationCatalogChanged':True,
            'before':{'rows':346,'unique':344,'counted':259,'recommended':133,'later':5},'after':after,
            'elementaryOverrides':[r['id'] for r in audit['verifiedElementaryLevelOmissions']],
            'newSiteIds':[r['id'] for r in added], 'promotedExistingIds':promoted,
            'rewrittenExistingDescriptions':['longmen-grottoes','ajanta-caves','pamukkale','victoria-falls'],
            'reviewedQuestions':{'newSites':48,'promotedExistingSites':18},
            'preserved':['existing IDs and raw discovery records','completed places and finish ranks','earned answer streaks','issued questions for metadata-only updates'],
            'checks':{'syntaxCatalogHtml':'passed','placeStudySuite':'passed','newSiteUnitAndSocketSmoke':'passed: all 16 sites and 48 answers',
                      'serverRestartMigration':'passed: legacy alias, metadata-only, revised questions',
                      'allUnits':{'passed':65,'total':71,'preExistingFailures':['teacher-map-completed-hidden-unit.js','teacher-map-privacy-unit.js','v55-host-rooms-unit.js','v68-final-quiz-unit.js','v70-final-quiz-unit.js','v78-discovery-unit.js']},
                      'browserUi':'not run: local browser use is disabled in Work settings; no bypass'},
            'limitation':audit['scope']['limitation']}
    target=APP/'docs/textbook-integration-2026-11-02.json'
    target.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    level_rows=''.join(f'<tr><td>{html.escape(r["name"])}</td><td>초등 추가 · 기존 중·고 유지</td><td>{source(r["evidence"])}</td></tr>' for r in audit['verifiedElementaryLevelOmissions'])
    new_rows=[]
    for r in added:
        e=learning['entries'][r['id']]
        tier='후대 문화 · 현장 발견 수 제외' if e['tier']=='later' else '기본 추천 · 현장 발견 대상'
        levels='·'.join({'elementary':'초등','middle':'중학','high':'고등'}[v] for v in e['levels'])
        image=link(APP/'public/assets/landmarks'/f'{r["id"]}.webp','사진 원본')
        thumbnail=quote(Path(os.path.relpath(APP/'public/assets/landmarks'/f'{r["id"]}.webp',OUT)).as_posix(),safe='/')
        new_rows.append(f'<tr><td><img src="{thumbnail}" alt="{html.escape(r["name"])}" loading="lazy"></td><td><b>{html.escape(r["name"])}</b><br>{levels}<br><span class="muted">{tier}</span></td><td>{html.escape(e["objective"])}<br><small>설명 + 이해 문항 3개 · {image}</small></td><td>{source(e["textbookEvidence"][0])}<br>{external_link(r["sources"][0]["url"],"사실 확인 자료")}</td></tr>')
    promoted_rows=''.join(f'<tr><td>{html.escape(r["name"])}</td><td>{"기본 추천으로 승격" if r["id"] in promoted else "주제 탐구 유지"}</td><td>{source(r["evidence"])}</td></tr>' for r in audit['presentButOutsideDefaultRecommendation'])
    changes=''.join(f'<tr><td>{label}</td><td>{report["before"][key]}</td><td><b>{after[key]}</b></td></tr>' for key,label in [('rows','전체 항목 (중복 접근 포함)'),('unique','중복을 합친 장소'),('counted','현장 발견 대상'),('recommended','기본 추천'),('later','후대 문화')])
    # High-school before-recommended is derived from the preserved audit catalog snapshot.
    raw=json.loads((OUT/'자동대조후보.json').read_text(encoding='utf8'))
    old_high=sum(1 for r in raw['findings'] if not r['learning']['alias'] and 'high' in r['learning']['levels'] and r['learning']['recommended'])
    grade_rows=''.join(f'<tr><td>{label}</td><td>{old_all} → <b>{after["levels"][key]["all"]}</b></td><td>{old_recommended} → <b>{after["levels"][key]["recommended"]}</b></td></tr>' for key,label,old_all,old_recommended in [('elementary','초등',126,62),('middle','중학',343,133),('high','고등',332,old_high)])
    page='''<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>대항해시대 교과서 반영 결과</title><style>
body{margin:0;background:#f5f5f0;color:#25382e;font:15px/1.7 system-ui,'Malgun Gothic',sans-serif}main{max-width:1200px;margin:auto;padding:36px 24px}h1{font-size:32px;letter-spacing:-1px}h2{margin-top:38px;font-size:23px}a{color:#20654a;text-underline-offset:3px}.muted,small{color:#637366}aside{padding:20px;background:#e4ecdd;border-radius:10px}.stats{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0}.stat{padding:15px 22px;background:#fff;border-radius:10px}.stat b{display:block;font-size:30px}.scroll{overflow:auto;border-radius:10px;margin:16px 0}table{width:100%;border-collapse:collapse;background:white}td,th{padding:13px;text-align:left;vertical-align:top;border-bottom:1px solid #dce4d8}th{background:#e9eee4;white-space:nowrap}td img{width:125px;height:90px;object-fit:contain;background:#f0f0ec}td:first-child{min-width:120px}td:last-child{min-width:220px}li{margin:8px 0}code{font-size:13px}footer{border-top:1px solid #dce4d8;margin-top:35px;padding-top:20px}</style><main>
<p class="muted">2026.11.02 · 로컬 프로젝트 반영 결과</p><h1>교과서에서 확인한 누락을 앱에 반영했습니다</h1>
<aside><b>초등 분류 16곳 추가 · 새 장소 16곳 추가 · 기존 6곳 추천 보완</b><p>새 장소 48문항과 기존 장소 18문항을 구성했습니다. 중·고 설명과 문항은 공통으로 유지하며, 기존 설명 중 사실·시대 표현을 고칠 필요가 있는 룽먼·아잔타·파묵칼레·빅토리아 폭포 4곳만 수정했습니다. 학교급은 활용 가능한 범위이며 학년별로 다른 문제를 출제하는 기능은 아닙니다.</p></aside>
<div class="stats"><div class="stat"><b>151</b>기본 추천 (기존 133)</div><div class="stat"><b>271</b>현장 발견 대상 (기존 259)</div><div class="stat"><b>66</b>이번에 직접 구성한 이해 문항</div></div>
<h2>현재 선택·집계 결과</h2><div class="scroll"><table><tr><th>구분</th><th>반영 전</th><th>반영 후</th></tr>__COUNTS__</table></div><div class="scroll"><table><tr><th>학교급</th><th>전체 자료</th><th>기본 추천</th></tr>__GRADES__</table></div><p class="muted">도시 설명 229곳은 위 집계와 별개입니다. 고등에만 분류된 황산은 이번 근거만으로 초·중에 추가하지 않았습니다.</p>
<h2>초등 필터에서 빠졌던 16곳</h2><p>해당 장소에만 학교급·지도 활용 목표를 추가했습니다. 같은 주제의 다른 장소까지 일괄 변경하지 않았습니다. 타지마할·성 바실리·블루 모스크·베르사유의 후대 구분은 유지합니다.</p><div class="scroll"><table><tr><th>장소</th><th>반영</th><th>교과서 근거</th></tr>__LEVELS__</table></div>
<h2>새로 추가한 16곳</h2><p>우르·모헨조다로·하라파는 서로 다른 고대 도시 유적입니다. 그리니치 천문대·에펠탑·자유의 여신상·시드니 오페라 하우스는 건립 연도를 명시한 후대 문화로만 제공합니다. 사진에는 저작자·출처·이용 조건을 기록했습니다.</p><div class="scroll"><table><tr><th>사진</th><th>장소·범위</th><th>학습 목표</th><th>근거</th></tr>__NEW__</table></div>
<h2>이미 있던 장소의 추천 검토</h2><p>윈강·룽먼·아잔타 3곳을 기본 추천으로 승격하고 파묵칼레·우유니·빅토리아 폭포 3곳을 가치 추천에 추가했습니다. 노트르담과 쿠트브 미나르는 기존의 주제 탐구 자료로 유지했습니다. 대표 사례의 중복을 줄이기 위한 편집 판단이며, 교과서가 정한 필수 지명 목록을 뜻하지 않습니다.</p><div class="scroll"><table><tr><th>장소</th><th>처리</th><th>교과서 근거</th></tr>__PROMOTED__</table></div>
<h2>기록 보존과 검증</h2><ul><li>기존 발견 ID·원본 발견 기록·완료 시각·완주 순위를 보존합니다. 학년 정보만 바뀐 미션은 발급된 문제와 연속 정답을 그대로 유지합니다.</li><li>문항을 바꾼 기존 6곳만 새 문항을 불러옵니다. 진행 중인 문제는 설명 단계에서 이어가며, 이미 맞힌 수와 완료 기록은 보존합니다.</li><li>새 16곳 모두 실제 서버에서 접근·사진 HTTP 로딩·문제 3개 완료·중복 집계 방지·원격 접근 거절을 통과했습니다. 후대 4곳은 미션으로 선택 가능하며 현장 발견 수에는 더하지 않습니다.</li><li>문법·카탈로그·HTML 검사, 장소 학습 전용 검사, 서버 재시작 후 기존 별칭·학년 변경·문항 변경 미션의 기록 보존 검사를 통과했습니다.</li><li>전체 단위 검사 71개 중 65개 통과. 기존 실패 6개는 이전 검토와 같습니다: 교사 안내 2개, 이전 입장·최종 문제 UI 검사 3개, 기존 사진·위치도 분류 검사 1개.</li><li>Work 설정에서 로컬 브라우저 사용이 꺼져 있어 이번 UI 브라우저 조작 검증은 실행하지 않았습니다. 사진은 로컬 WebP를 직접 열어 확인했습니다.</li></ul>
<footer><b>확인 범위</b><p>2022 개정 초6 사회 10책, 중학 사회 6책·역사① 3책을 중심으로 확인했습니다. 초6 비상·지학사·YBM 등 미수집 본문이 남아 있어 전 출판사 대조 완료를 뜻하지 않습니다.</p><p>__AUDIT__ · __JSON__ · __LIBRARY__</p></footer></main></html>'''
    replacements={'__COUNTS__':changes,'__GRADES__':grade_rows,'__LEVELS__':level_rows,'__NEW__':''.join(new_rows),'__PROMOTED__':promoted_rows,
                  '__AUDIT__':link(OUT/'검토결과.html','반영 전 검토·원문 근거'),'__JSON__':link(target,'반영 결과 JSON'),
                  '__LIBRARY__':link(ROOT/'references/textbooks/세계사-세계지리/교과서-열람.html','세계사·세계지리 교과서 열람')}
    for key,value in replacements.items():page=page.replace(key,value)
    (OUT/'반영결과.html').write_text(page,encoding='utf8')
    print(json.dumps({'report':str(OUT/'반영결과.html'),'after':after},ensure_ascii=True))


if __name__=='__main__':main()
