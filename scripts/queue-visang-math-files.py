"""Queue explicitly listed math assessment files from previously observed manifests."""
import json, urllib.parse
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'references/textbooks'
queue_file=REF/'math-download-queue.json'
queue=json.loads(queue_file.read_text(encoding='utf-8'))
seen={item['url'] for item in queue}
added=0
for source in sorted((REF/'raw').glob('visang-*-bank.json')):
    manifest=json.loads(source.read_text(encoding='utf-8'))
    if not manifest.get('courseName','').startswith('수학'):continue
    sid=source.stem.split('-')[1]
    base=f'https://ibook.vivasam.com/CBS_iBook/{sid}/contents/data_bank/data_bank.html'
    def add(item, category, unit, lesson=None):
        global added
        if not item.get('path'):return
        url=urllib.parse.quote(urllib.parse.urljoin(base,item['path']),safe=':/?=&%')
        if url in seen:return
        assert Path(urllib.parse.unquote(urllib.parse.urlparse(url).path)).suffix.lower() in {'.hwp','.hwpx','.pdf','.zip'}
        queue.append({'publisher':'비상교육','subject':'수학','book':manifest['courseName'],
                      'category':category,'unit':unit,'lesson':lesson,'sourceUrl':base,'url':url,
                      'fileName':Path(urllib.parse.unquote(urllib.parse.urlparse(url).path)).name})
        seen.add(url);added+=1
    for unit in manifest['units']:
        for item in unit.get('attachments',{}).get('수업 자료',[]):
            if item.get('name') == '수학익힘':
                add(item,'수학익힘',unit['unitName'])
        for item in unit.get('attachments',{}).get('평가 자료',[]):
            add(item,item.get('name','평가 자료'),unit['unitName'])
        for chapter in unit.get('chapters',[]):
            for lesson in chapter.get('lessons',[]):
                for category,items in lesson.get('attachments',{}).items():
                    if category not in {'차시별 기초 개념 문제','차시별 심화 문제','교사용 학생 평가지'}:continue
                    for item in items:add(item,category,unit['unitName'],lesson.get('lessonName'))
queue_file.write_text(json.dumps(queue,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'added':added,'queue':len(queue)}))
