"""Acquire only download links observed after teacher authentication in the UI."""
import concurrent.futures
import hashlib
import io
import json
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'references/textbooks'
RAW = REF / 'raw'
specs = []

def add(grade, subject, book, ids, titles, unit=None):
    for sid, title in zip(ids, titles):
        specs.append(dict(id=str(sid), grade=grade, subject=subject, title=title, unit=unit,
            sourceUrl=f'https://www.achimnara.kr/school?gtRevisionYear=2022&gtIdx={book}' +
                ('&gtdType=evaluationData' if unit else ''),
            downloadUrl=f'https://www.achimnara.kr/download?ufIdx={sid}'))

music_titles = ['평가 기준', '연간 교수 학습 계획', '음악과 진도 계획표(NICE)', '성취기준과 성취수준', '수행평가']
for grade, book, ids in [(3,143,[11529,11536,11537,11538,11749]),
    (4,148,[11540,11545,7424,11546,11866]), (5,172,[17599,17608,17693,17606,17604]),
    (6,169,[17661,17666,17704,17668,17701])]:
    add(grade,'음악',book,ids,music_titles)
add(5,'미술',173,[17169,17239],['연간 지도 계획','진도 계획표(NICE)'])
add(6,'미술',174,[17158,17238],['연간 지도 계획','진도 계획표(NICE)'])
art5 = [
    ('1. 나를 찾아 떠나요',19515,19516),('2. 그림 속으로 들어온 정물',19517,19518),
    ('3. 사진에 담은 세상',19519,19520),('4. 재미있고 아름다운 포장',19521,19522),
    ('5. 개성 넘치는 표정과 몸동작',19523,19524),('6. 미술 작품 파헤치기',19525,19526),
    ('프로젝트. GPS로 그리는 그림',19528,19529),('7. 소통을 위한 시각 기호',19530,19531),
    ('8. 마법 같은 빛의 미술',19532,19534),('9. 쓸모 있고 아름다운 공예',19535,19536),
    ('10. 먹과 색을 담은 이야기',19537,19538),('11. 내가 만드는 애니메이션',19539,19540),
    ('12. 함께 즐기는 미술 문화',19541,19542)]
art6 = [
    ('1. 새롭게 대상을 탐색해요',19543,19544),('2. 환경과 함께하는 건축',19565,19566),
    ('3. 우리의 로고를 만들어요',19567,19568),('4. 단순하고 새롭게 만들어요',19545,19546),
    ('5. 디지털과 미술의 만남',19547,19548),('6. 미술 작품의 배경 속으로',19549,19550),
    ('7. 광고가 전달하는 이야기',19551,19552),('8. 세상을 담은 풍경화',19553,19554),
    ('9. 한글의 멋을 살려',19555,19556),('10. 판화로 찍어 내는 세계',19557,19558),
    ('11. 모두를 위한 디자인',19559,19560),('12. 다양한 감상 방법',19561,19562),
    ('프로젝트. 재미있는 미술 놀이',19563,19564)]
for grade, book, rows in [(5,173,art5),(6,174,art6)]:
    for unit, a, b in rows:
        add(grade,'미술',book,[a,b],['수행평가 기준안','수행평가 활동지'],unit)

def acquire(spec):
    existing = list(RAW.glob(f"achim-{spec['id']}.*"))
    if existing:
        assert len(existing) == 1
        content = existing[0].read_bytes()
    else:
        with urllib.request.urlopen(spec['downloadUrl'], timeout=60) as response:
            content = response.read()
    if content.startswith(b'PK'):
        with zipfile.ZipFile(io.BytesIO(content)) as archive:
            names = archive.namelist()
        extension = '.xlsx' if 'xl/workbook.xml' in names else '.hwpx' if 'Contents/header.xml' in names else '.zip'
    elif content.startswith(b'%PDF'):
        extension = '.pdf'
    elif content.startswith(bytes.fromhex('d0cf11e0a1b11ae1')):
        extension = '.hwp'
    else:
        raise ValueError(f"Unexpected response format for {spec['id']}")
    file = RAW / f"achim-{spec['id']}{extension}"
    if existing and existing[0] != file:
        assert not file.exists()
        existing[0].rename(file)
    if not file.exists():
        file.write_bytes(content)
    result = dict(spec, fileName=file.name, bytes=len(content), sha256=hashlib.sha256(content).hexdigest())
    if extension == '.zip':
        with zipfile.ZipFile(file) as archive:
            assert archive.testzip() is None
            result['members'] = [dict(name=m.filename, bytes=m.file_size) for m in archive.infolist() if not m.is_dir()]
    return result

def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        sources = list(pool.map(acquire,specs))
    path = REF / 'achim-acquired-sources.json'
    path.write_text(json.dumps(dict(publisher='아침나라',retrievedOn='2026-10-09',
        accessVerification='teacher-authenticated-download-links-visible', sources=sources), ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(dict(sources=len(sources),bytes=sum(s['bytes'] for s in sources))))

if __name__ == '__main__':
    main()
