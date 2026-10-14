"""Download files listed on all 52 authenticated grade/unit pages, observed 2026-10-09."""
import concurrent.futures
import hashlib
import io
import json
import urllib.request
import zipfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'references/textbooks'
UNITS={
3:['함께 만드는 캐릭터','조형 요소 색, 선, 형','관찰하여 그리기','찾았다, 오감','재미있는 미술관 나들이','흙으로 빚은 상상','수채화로 그린 나의 경험','미술과 함께한 하루','움직임 더하기 미술','먹으로 그린 그림','전통 무늬로 꾸미기','작품에서 찾은 이야기','프로젝트'],
4:['톡톡 튀는 감각 표현',"조형 요소 '질감', '양감'",'별별 생각 무한 상상','관찰하여 식물 그리기','흙으로 만든 그릇','작가와의 인터뷰','생활 속 미술 탐험','먹으로 표현한 서화','만화로 그린 나의 역사','공판화로 꾸미기','경험을 담은 표현','미술 작품에 다가가기','프로젝트'],
5:['나를 보는 창문','일상에서 주제 찾기','조형 원리로 표현하기','자세히 보고 그리기','다양한 시대의 작품 감상하기','찰칵! 순간을 담아','생활 속 시각 이미지','상상으로 여는 세계','먹과 색으로 그리기','한지 공예품 만들기','이제 우리도 디자이너','미술 작품 감상 여행','프로젝트'],
6:['나를 만나는 시간','선으로 그리기','동세와 균형 표현하기','빛으로 가득한 세상','우리가 만드는 영상','다양한 지역의 작품 감상하기','생각을 전하는 시각 이미지','그림으로 즐기는 풍경','찍어 만드는 작품, 판화','궁체로 쓰기','우리가 바라는 학교 건축','축제 속 미술 만나기','프로젝트']}

def specs():
    for grade,units in UNITS.items():
        for number,unit in enumerate(units,1):
            base=dict(grade=grade,unitNumber=number,unit=unit,subject='미술',
                sourceUrl=f'https://artandculture.kr/study/art{grade}.php?tab={number}')
            # File lists are transcribed from the actual links on every unit page.
            files=[]
            if number<=12:
                files.append(('assessment',f'6_evaluation/{grade}/evaluation{grade}-{number}.pdf'))
            suffixes=['1','2'] if grade==3 else ['2','3']
            if (grade,number)==(3,12):suffixes=['1','2','3']
            if (grade,number)==(4,11):suffixes=['1','2','3']
            if (grade,number)==(4,13):suffixes=['2']
            if (grade,number)==(5,13):suffixes=['1'] # Both displayed controls point to this same file.
            if (grade,number)==(6,11):suffixes=['2','2-2']
            if (grade,number)==(6,13):suffixes=['1','2']
            files += [('teaching-plan',f'2_teaching/{grade}/teaching{grade}-{number}-{s}.hwpx') for s in suffixes]
            for kind,path in files:
                yield dict(base,kind=kind,downloadUrl='https://artandculture.kr/common/projectfiles/'+path,
                    fileName='artculture-'+path.rsplit('/',1)[1])

def acquire(source):
    target=REF/'raw'/source['fileName']
    try:
        if target.exists():content=target.read_bytes()
        else:
            with urllib.request.urlopen(source['downloadUrl'],timeout=45) as r:content=r.read()
        if target.suffix=='.pdf':
            assert content.startswith(b'%PDF'),'not PDF'
        else:
            with zipfile.ZipFile(io.BytesIO(content)) as z:
                assert 'Contents/header.xml' in z.namelist(),'not HWPX'
                assert z.testzip() is None
        if not target.exists():target.write_bytes(content)
        return dict(source,status='acquired',bytes=len(content),sha256=hashlib.sha256(content).hexdigest())
    except Exception as exc:
        return dict(source,status='failed',error=str(exc))

def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:sources=list(pool.map(acquire,specs()))
    data=dict(publisher='아트앤컬처',retrievedOn='2026-10-09',
        accessVerification='authenticated-grade-unit-resource-pages',sources=sources,
        issues=[dict(grade=5,unitNumber=13,issue='two-teaching-controls-have-identical-download-url',action='download-once-do-not-infer-second-file')])
    (REF/'artculture-acquired-sources.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    catalog=json.loads((ROOT/'game-hub-server/data/textbooks/catalog-2022.json').read_text(encoding='utf-8'))
    assessments=[]
    for s in sources:
        if s['status']!='acquired' or s['kind']!='assessment':continue
        editions=[e for e in catalog['editions'] if e['publisher']=='아트앤컬처' and e['subject']=='미술' and s['grade'] in e['grades']]
        assert len(editions)==1
        assessments.append(dict(id=f"artculture-assessment-{s['grade']}-{s['unitNumber']}",
            editionId=editions[0]['id'],publisher='아트앤컬처',curriculum='2022',subject='미술',
            grade=s['grade'],unit=s['unit'],unitNumber=s['unitNumber'],title='평가 기준안',
            sourceUrl=s['sourceUrl'],downloadUrl=s['downloadUrl'],sourceFile=s['fileName'],
            sha256=s['sha256'],contentStatus='original-acquired-not-yet-extracted'))
    (REF/'assessment-index-artculture-2022.json').write_text(json.dumps(dict(schemaVersion=1,
        assessments=assessments),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(dict(total=len(sources),acquired=sum(s['status']=='acquired' for s in sources),
        failures=[s for s in sources if s['status']!='acquired'])))

if __name__=='__main__':main()
