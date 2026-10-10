"""Extract locally saved document/map ZIPs, without network access."""
import hashlib, json, re, zlib
from pathlib import Path
from zipfile import ZipFile

BASE=Path(__file__).resolve().parents[1]/'tmp/중고등자료_수집'
EXT={'.pdf','.hwp','.hwpx','.doc','.docx','.jpg','.jpeg','.png','.svg'}
results=[]
for source in sorted(BASE.rglob('*.zip')):
    if '압축해제' in source.parts: continue
    folder=source.parent/'압축해제'/source.stem
    rows=[]
    try:
        with ZipFile(source) as archive:
            for entry in archive.infolist():
                if entry.is_dir(): continue
                name=entry.filename
                if not entry.flag_bits & 0x800:
                    try: name=name.encode('cp437').decode('cp949')
                    except UnicodeError: pass
                suffix=Path(name).suffix.lower()
                if suffix not in EXT: continue
                if suffix in {'.jpg','.jpeg','.png','.svg'} and not re.search('백지도|지도|부도|연표',str(source)): continue
                if entry.file_size>512*1024*1024: raise ValueError('Member exceeds extraction size limit')
                safe=re.sub(r'[<>:"/\\|?*\x00-\x1f]','_',Path(name).stem).strip().rstrip('.')[:100]
                target=folder/(safe+'__'+hashlib.sha256(name.encode()).hexdigest()[:10]+suffix)
                row={'member':name,'path':str(target),'bytes':entry.file_size,'crc32':entry.CRC}
                try:
                    folder.mkdir(parents=True,exist_ok=True)
                    data=archive.read(entry)
                    if len(data)!=entry.file_size or zlib.crc32(data)&0xffffffff!=entry.CRC: raise ValueError('CRC/size mismatch')
                    if not target.exists() or target.read_bytes()!=data:
                        part=target.with_suffix(suffix+'.part');part.write_bytes(data);part.replace(target)
                    row.update(status='existing',sha256=hashlib.sha256(data).hexdigest())
                except Exception as error: row.update(status='failed',error=str(error))
                rows.append(row)
        receipt=source.parent/(source.stem+'.수집기록.json')
        if not receipt.exists(): receipt=source.parent/'수집기록.json'
        original=json.loads(receipt.read_text(encoding='utf-8-sig'))
        original_source=original.get('source',original)
        record={'source':{**original_source,'url':'local-zip:'+str(source)},'localArchive':str(source),
                'selected':len(rows),'files':rows,'status':'complete' if all(r['status']!='failed' for r in rows) else 'partial'}
        folder.mkdir(parents=True,exist_ok=True)
        (folder/'수집기록.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf8')
        results.append({'zip':str(source),'files':len(rows),'failed':sum(r['status']=='failed' for r in rows)})
    except Exception as error: results.append({'zip':str(source),'error':str(error)})
(BASE/'압축해제결과.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'archives':len(results),'files':sum(r.get('files',0) for r in results),
                  'failed':sum(r.get('failed',0) for r in results),'archiveErrors':sum('error' in r for r in results)},ensure_ascii=False))
