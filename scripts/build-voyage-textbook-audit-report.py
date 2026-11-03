"""Publish human-reviewed voyage/textbook findings, without editing app data."""
import html
import json
import os
from pathlib import Path
from urllib.parse import quote

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/voyage-textbook-audit'
RAW=json.loads((OUT/'자동대조후보.json').read_text(encoding='utf8'))


def evidence(row,publisher,book,page,filename=''):
    matches=[h for h in row['hits'] if h['publisher']==publisher and book in h['book']
             and h['pdfPage']==page and filename in Path(h['path']).name
             and h['revision']=='2022' and not h['atlas'] and not h['referencePage']]
    if not matches:
        raise ValueError(f'Missing selected evidence: {row.get("id",row["name"])} / {publisher} / {book} / PDF {page}')
    hit=matches[0]
    return {**{k:v for k,v in hit.items() if k not in ['snippet','matched','path']},
            'path':Path(hit['path']).relative_to(ROOT).as_posix()}


LEVEL_SPECS=[
 ('great-wall-badaling','미래엔','6-1 (전종한)',128,'디지털 지도 활동에 만리장성이 직접 제시됨. 바다링 구간 자체가 초등 필수라는 뜻은 아님.'),
 ('giza-pyramids','미래엔','6-1 (전종한)',128,'디지털 지도 활동에서 기자 스핑크스를 찾아 나라·위경도를 확인함.'),
 ('taj-mahal-later','미래엔','6-1 (전종한)',128,'디지털 지도 활동의 대표 장소. 초등 연계와 후대 문화 구분을 함께 유지할 필요가 있음.'),
 ('lm-rome-colosseum','미래엔','6-1 (전종한)',128,'디지털 지도 활동의 대표 장소로 콜로세움이 직접 제시됨.'),
 ('machu-picchu','미래엔','6-1 (전종한)',128,'디지털 지도 활동의 대표 장소로 마추픽추가 직접 제시됨.'),
 ('uluru','아이스크림','6-2 (한춘희)',13,'평지에 솟은 거대한 암석 지형의 사진·설명이 있음. 현재 문화 주제 때문에 초등에서 빠짐.'),
 ('yellow-river','아이스크림','6-2 (한춘희)',13,'황허강의 지형 경관 사진·설명이 있음. 문명 학습 이외의 초등 지형 연계가 필요함.'),
 ('panama_isthmus','아이스크림','6-1 (한춘희)',140,'북아메리카와 남아메리카를 연결하는 지협을 본문에서 설명함.'),
 ('rhine-river','미래엔','6-2 (전종한)',18,'하천 지역의 생활 본문에서 세계의 주요 하천으로 제시함.'),
 ('bosporus','동아','6-1 (박영석)',136,'아시아와 유럽에 걸친 튀르키예의 위치를 설명하는 본문 사례임.'),
 ('strait-of-dover','천재','사회(박기범)_6-1',145,'자연환경이 국경을 이루는 사례로 해협을 직접 설명함.'),
 ('cape_good_hope','천재','사회(김정인)_6-1',38,'세계 여러 나라를 살펴보는 아프리카 자료에 희망봉이 제시됨.'),
 ('teotihuacan','동아','6-1 (박영석)',139,'북아메리카의 국가를 살펴보는 자료에 사진 명소로 제시됨.'),
 ('lm-saint-basil-later','동아','6-1 (박영석)',137,'러시아를 살펴보는 자료에 제시됨. 후대 문화 구분은 유지해야 함.'),
 ('lm-blue-mosque-later','동아','6-1 (박영석)',136,'이스탄불을 살펴보는 자료에 술탄 아흐메트 모스크가 제시됨. 후대 문화 구분은 유지해야 함.'),
 ('lm-versailles-later','동아','6-1 (박영석)',88,'국가기관의 권력 분립을 설명하면서 루이 14세와 베르사유 궁전을 제시함. 후대 문화 구분은 유지해야 함.'),
]

NEW_SPECS=[
 ('우르의 지구라트','동아','역사 ① (홍성구)',9,'2. 문명','중학','수메르 도시 국가·신권 정치의 구체적 유적 사례'),
 ('모헨조다로','동아','역사 ① (홍성구)',11,'2. 문명','중학','인더스 문명의 계획도시·배수시설 사례'),
 ('하라파','동아','역사 ① (홍성구)',11,'2. 문명','중학','인더스 문명의 도시 유적 사례; 모헨조다로와 묶어서 검토'),
 ('호류사','동아','역사 ① (홍성구)',9,'3. 세계','중학','아스카 문화·백제 장인·동아시아 문화 교류 사례'),
 ('도다이사','동아','역사 ① (홍성구)',8,'3. 세계','중학','불교 문화가 동아시아에 전파된 모습을 비교하는 사례'),
 ('사헬 지대','동아','사회 ① (설규주)',11,'4. 아프리카','중학','사막화와 복구·지속가능한 발전의 지역 사례'),
 ('세렝게티','미래엔','사회 ① (손영찬)',73,'','초·중','사바나 생태·야생 동식물·관광의 지역 사례; 초6 천재 자료에도 수록'),
 ('대찬정 분지','동아','사회 ① (설규주)',4,'6. 오세아니아','중학','오스트레일리아의 주요 지형과 자연환경 비교 사례'),
 ('그레이트디바이딩산맥','동아','사회 ① (설규주)',4,'6. 오세아니아','초·중','오스트레일리아의 동부 산맥·중부 분지를 비교하는 지형 사례'),
 ('바덴해 갯벌','동아','6-2 (박영석)',23,'','초·중','갯벌 해안과 생물의 서식 환경 사례'),
 ('포트캠벨 국립공원','동아','6-2 (박영석)',23,'','초·중','해안 암석 기둥과 해안 경관 사례'),
 ('코파카바나 해변','동아','6-2 (박영석)',23,'','초·중','모래 해안의 지형과 생활·관광을 비교하는 사례'),
 ('그리니치 천문대','동아','6-1 (박영석)',122,'','초·중 / 후대','본초 자오선·경도 학습의 장소. 1520년 현장과 후대 자료를 구분해 구성'),
 ('에펠탑','미래엔','6-1 (전종한)',128,'','초·중 / 후대','디지털 지도 활동에 직접 등장하는 대표 장소'),
 ('자유의 여신상','미래엔','6-1 (전종한)',128,'','초·중 / 후대','디지털 지도 활동에 직접 등장하는 대표 장소'),
 ('시드니 오페라 하우스','미래엔','6-1 (전종한)',128,'','초·중 / 후대','디지털 지도 활동에 직접 등장하는 대표 장소'),
]


def main():
    levels=[]
    for id,pub,book,page,note in LEVEL_SPECS:
        row=next(r for r in RAW['findings'] if r['id']==id)
        assert 'elementary' not in row['learning']['levels']
        levels.append({'id':id,'name':row['name'],'currentLevels':row['learning']['levelLabels'],
                       'tier':row['learning']['tier'],'recommended':row['learning']['recommended'],
                       'addLevel':'초등','note':note,'evidence':evidence(row,pub,book,page)})
    new=[]
    for name,pub,book,page,filename,level,note in NEW_SPECS:
        row=next(r for r in RAW['newCandidates'] if r['name']==name)
        assert not row['matchingDiscoveryIds'],name
        new.append({'name':name,'proposedLevels':level,'note':note,
                    'evidence':evidence(row,pub,book,page,filename),
                    'existingDescriptionMatches':row['coveredInDiscoveryText']})
    hidden=[]
    for id in ['yungang-grottoes','longmen-grottoes','ajanta-caves','lm-notre-dame','lm-qutb-minar','pamukkale','salar-de-uyuni','victoria-falls']:
        row=next(r for r in RAW['findings'] if r['id']==id)
        hits=[h for h in row['hits'] if h['revision']=='2022' and not h['atlas'] and not h['referencePage']]
        assert hits and not row['learning']['recommended']
        h=hits[0]
        hidden.append({'id':id,'name':row['name'],'currentLevels':row['learning']['levelLabels'],
                       'tier':row['learning']['tier'],'countedOnMap':row['learning']['counted'],
                       'evidence':evidence(row,h['publisher'],h['book'],h['pdfPage'],Path(h['path']).name)})
    report={'checkedAt':'2026-11-02','snapshotStage':'before-implementation','applicationCatalogChanged':False,
            'scope':{'catalogRows':346,'uniqueDiscoveries':344,'textbookPageSearch':5849,
                     'primaryBodies':'2022 초6 사회 10책, 중학 사회 6책·역사① 3책',
                     'secondary':'2015 교과서와 사회·역사 부도는 보조 근거로 별도 검색',
                     'limitation':'초6 비상·지학사·YBM 등 미수집 본문이 있어 전 출판사 완전 대조는 아님'},
            'filterMechanism':{'file':'learning/inquiry/age-of-exploration/lib/discovery-learning.js',
                               'detail':'장소별 levels 없이 topic.levels를 모든 장소가 상속함',
                               'defaultFilterFile':'learning/inquiry/age-of-exploration/public/js/study-catalog.js',
                               'counts':{'elementaryAll':126,'elementaryRecommended':62,'middleAll':343,'middleRecommended':133,'highOnly':1},
                               'highOnly':'황산. 확보한 초·중 본문에서 우선 추가할 근거는 이번 대조로 확인되지 않음',
                               'cities':'도시 229곳은 learning=null이라 초·중·고 학교급 필터에서 모두 제외됨. 도시 자체의 데이터 삭제·미수록을 뜻하지 않음'},
            'verifiedElementaryLevelOmissions':levels,'newDiscoveryCandidates':new,
            'presentButOutsideDefaultRecommendation':hidden,
            'implementationAdvice':['주제 전체를 초등으로 넓히지 말고, 해당 장소에만 학교급과 학습 목표를 별도로 지정한다.',
                                    '초등은 위치·지형·생활, 중학은 역사·문화 교류 등 같은 장소의 학습 목표를 구분한다.',
                                    '후대 문화의 시대 구분과 기존 발견·완료 기록의 ID를 유지한다.',
                                    '본문 대표 사례를 우선하고, 지도에만 쓰인 지명·색인·출처만으로 필수 발견물로 정하지 않는다.']}
    target=ROOT/'learning/inquiry/age-of-exploration/docs/textbook-level-audit-2026-11-02.json'
    target.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    def source(ev):
        path=ROOT/ev['path'];assert path.is_file()
        href=quote(Path(os.path.relpath(path,OUT)).as_posix(),safe='/')+f'#page={ev["pdfPage"]}'
        return f'<a target="_blank" href="{href}">{html.escape(ev["publisher"]+" "+ev["book"])}<br>PDF {ev["pdfPage"]}쪽</a>'
    def table(rows,kind):
        content=[]
        for row in rows:
            if kind=='level':
                state='·'.join(row['currentLevels'])+' / '+({'core':'기본 추천','support':'주제 탐구','later':'후대 문화'}.get(row['tier'],row['tier']))
                note=row['note']
            elif kind=='new':state='발견물·도시 명소 목록 없음';note=row['proposedLevels']+' — '+row['note']
            else:state='·'.join(row['currentLevels'])+' / 주제 탐구';note='전체 자료·주제별 탐구에서는 선택 가능. 현장 발견 대상이며 기본 추천에서는 제외됨. 추천 승격은 편집 검토 사항.'
            content.append(f'<tr><td><b>{html.escape(row["name"])}</b></td><td>{html.escape(state)}</td><td>{html.escape(note)}</td><td>{source(row["evidence"])}</td></tr>')
        return '<div class="scroll"><table><thead><tr><th>장소</th><th>현재 앱 상태</th><th>검토 결과</th><th>교과서 근거</th></tr></thead><tbody>'+''.join(content)+'</tbody></table></div>'
    page='''<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>대항해시대 초·중 교과서 누락 점검</title><style>
body{margin:0;background:#f5f5f0;color:#25382e;font:15px/1.65 system-ui,'Malgun Gothic',sans-serif}main{max-width:1180px;margin:auto;padding:38px 24px}h1{font-size:31px;letter-spacing:-1px}h2{margin-top:38px;font-size:22px}.intro{font-size:18px;max-width:940px}.stats{display:flex;gap:12px;flex-wrap:wrap;margin:25px 0}.stat{background:#e4ecdd;border-radius:9px;padding:15px 20px}.stat strong{display:block;font-size:29px}table{width:100%;border-collapse:collapse;background:white}th,td{padding:13px;text-align:left;border-bottom:1px solid #dce4d8;vertical-align:top}th{background:#e9eee4;white-space:nowrap}td:first-child{min-width:150px}td:nth-child(2){min-width:145px}td:last-child{min-width:220px}a{color:#20654a;text-underline-offset:3px}.scroll{overflow:auto;border-radius:10px}aside{padding:18px;background:#e9eee4;border-radius:10px}.muted{color:#637366;font-size:13px}li{margin:8px 0}code{font-size:13px}footer{margin-top:32px;border-top:1px solid #dce4d8;padding-top:20px}input{font:inherit;padding:10px;border:1px solid #aebfac;border-radius:7px;width:min(100%,450px);box-sizing:border-box}tr[hidden]{display:none}</style><main>
<p class="muted">교과서 본문 × 실제 실행 카탈로그 · 2026.11.02</p><h1>초·중에서 빠진 발견물이 있는가?</h1><p class="intro"><b>있습니다. 확인된 초등 학교급 누락은 16곳입니다.</b> 앱에 장소는 있지만 초등 필터에서 사라지는 경우입니다. 고등에만 들어간 항목은 황산 1곳이며, 큰 누락은 중·고로만 묶인 장소의 초등 연계에서 확인됐습니다.</p>
<div class="stats"><div class="stat"><strong>346</strong>발견물·명소 전수 대조<br>중복 접근 2곳 제외 344곳</div><div class="stat"><strong>16</strong>초등 학교급 누락 확인</div><div class="stat"><strong>16</strong>새 발견물 검토 후보</div></div>
<aside><b>교과서에서 확인한 직접적인 근거</b><p>미래엔 초6 사회 6-1의 디지털 지도 활동(인쇄 134쪽, PDF 128쪽)은 만리장성·스핑크스·타지마할·콜로세움·마추픽추를 직접 찾아보게 합니다. 다섯 곳은 모두 앱의 초등 필터에서 제외됩니다. 같은 표에 있는 에펠탑·자유의 여신상·시드니 오페라 하우스는 발견물 목록에 없습니다.</p><p class="muted">교과서에 등장한다고 역사적 세부 내용까지 초등 필수라는 뜻은 아닙니다. 초등에서는 위치·경관·지도 활용, 중학에서는 문명·문화 교류처럼 학습 목표를 나누어 연결하는 것이 적절합니다.</p></aside>
<h2>1. 장소는 있는데 초등 학교급에서 빠진 16곳</h2><p>첫 8곳은 디지털 지도 활동·지형 사진·대륙 연결 본문에서 직접 확인했습니다. 후대 문화 4곳은 초등 연계를 추가하더라도 1520년 이후라는 구분을 유지해야 합니다.</p>__LEVEL__
<h2>2. 발견물 목록 자체에 없는 16곳</h2><p>기존 발견물·도시 명소의 이름과 대조한 추가 후보입니다. 도시 설명·도서관의 다른 글에 관련 단어가 있을 가능성과, 독립 발견물로 선택 가능한지는 구분했습니다. 비슷한 지형이 이미 있다면 대표 사례를 묶을지 새 장소로 만들지 결정하면 됩니다.</p>__NEW__
<h2>3. 이미 초·중에 있지만 기본 추천에서 안 보이는 사례</h2><p>아래는 학교급 누락이 아닙니다. ‘자료 범위’를 기본값인 ‘교과·가치 추천’으로 두면 숨겨지고 ‘주제별 탐구’나 ‘전체 자료’에서 보입니다. 현장 지도 발견 대상이라는 점도 유지됩니다. 이들을 전부 누락이나 오류로 세지는 않았습니다.</p>__HIDDEN__
<h2>4. 분류 방식에서 확인한 원인</h2><ul><li><code>learningFor()</code>가 장소별 학교급 대신 주제의 <code>topic.levels</code>를 그대로 사용합니다. 예를 들어 ‘문명’·‘교류’·‘문화’로 묶이면 초등 지형·지도 사례로도 쓰이는 장소가 초등에서 빠집니다.</li><li>같은 주제 전체를 초등으로 바꾸면 다른 장소까지 한꺼번에 풀립니다. 근거가 확인된 장소에만 학교급·학습 목표를 개별 지정하는 쪽이 적절합니다.</li><li>학교급 ‘전체 자료’ 기준 초등은 126곳, 중학은 343곳입니다. 기본 추천까지 적용하면 초등 62곳, 중학 133곳입니다. 현재 확인 범위에서 중학의 핵심 문제는 고등 전용 지정이 아니라 새 장소의 미수록·기본 추천 범위입니다.</li><li>도시 229곳은 <code>learning=null</code>이라 학교급을 고르는 순간 모두 빠집니다. 도시 데이터가 없는 것과 학교급 필터에서 가려지는 것은 다릅니다.</li></ul>
<footer><b>범위와 검증</b><p>2022 개정 초6 사회 10책, 중학 사회 6책·역사① 3책을 본문 기준으로 대조했습니다. 2015 교과서와 부도를 보조로 포함한 검색 범위는 PDF 5,849쪽입니다. 문자열 후보 중 출처·색인·지도 표기만 있는 경우와 다른 뜻의 단어를 구분했고, 핵심 활동은 페이지 렌더링으로 확인했습니다. 초6 비상·지학사·YBM 등 미수집 본문이 있어 전 출판사 누락 전부를 확정한 결과는 아닙니다.</p><p class="muted">이번 작업은 점검 결과입니다. 앱의 발견물·학교급·추천 등급·학생 기록 데이터는 변경하지 않았습니다. 교과서 링크는 로컬 원본 PDF의 파일 쪽 번호로 연결됩니다.</p></footer></main></html>'''
    if (ROOT/'learning/inquiry/age-of-exploration/docs/textbook-integration-2026-11-02.json').is_file():
        banner='<aside><b>2026.11.02 앱 반영 완료</b><p>초등 분류 16곳·새 장소 16곳·기존 6곳 추천을 반영했습니다. <a href="반영결과.html">현재 반영 결과와 검증 보기</a></p><p class="muted">아래 표는 변경 전 상태를 기록한 원래 점검 결과입니다.</p></aside>'
        page=page.replace('<h1>초·중에서 빠진 발견물이 있는가?</h1>','<h1>초·중에서 빠진 발견물이 있는가?</h1>'+banner)
        page=page.replace('이번 작업은 점검 결과입니다. 앱의 발견물·학교급·추천 등급·학생 기록 데이터는 변경하지 않았습니다.','이 페이지는 앱 변경 전 점검 기록입니다. 이후 반영된 내용은 상단의 반영 결과에서 확인할 수 있습니다.')
    (OUT/'검토결과.html').write_text(page.replace('__LEVEL__',table(levels,'level')).replace('__NEW__',table(new,'new')).replace('__HIDDEN__',table(hidden,'hidden')),encoding='utf8')
    print(json.dumps({'verifiedElementaryOmissions':len(levels),'newCandidates':len(new),'outsideDefaultExamples':len(hidden),'report':str(OUT/'검토결과.html')},ensure_ascii=False))


if __name__=='__main__':main()
