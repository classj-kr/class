import hashlib
import io
import json
import logging
import re
import zipfile
from pathlib import Path
from pypdf import PdfReader
logging.getLogger('pypdf').setLevel(logging.CRITICAL)

ROOT = Path(__file__).resolve().parents[1]
rows = json.loads((ROOT / 'references/textbooks/수집기록/기존작업/douclass-textbook-downloads.json').read_text(encoding='utf-8-sig'))
courses = json.loads((ROOT / 'references/textbooks/수집기록/기존작업/douclass-course-audit.json').read_text(encoding='utf-8-sig'))
books = json.loads((ROOT / 'references/textbooks/secondary-douclass-book-menu.json').read_text(encoding='utf-8-sig'))
results = []
documents = []

def inspect_pdf(data):
    if not data.startswith(b'%PDF-'):
        raise ValueError('PDF signature missing')
    reader = PdfReader(io.BytesIO(data), strict=False)
    return len(reader.pages)

for index, row in enumerate(rows, 1):
    path = Path(row['path'])
    result = {'sourcePage': row['sourcePage'], 'book': row['book'], 'path': str(path), 'status': 'verified'}
    try:
        data = path.read_bytes()
        digest = hashlib.sha256(data).hexdigest()
        if len(data) != row['bytes'] or digest != row['sha256']:
            raise ValueError('size/hash mismatch')
        if path.suffix.lower() == '.zip':
            with zipfile.ZipFile(io.BytesIO(data)) as archive:
                members = [m for m in archive.infolist() if not m.is_dir() and m.filename.lower().endswith('.pdf')]
                if not members:
                    raise ValueError('ZIP contains no PDF')
                result['pdfs'] = []
                dest = path.parent / 'PDF_압축해제' / path.stem
                dest.mkdir(parents=True, exist_ok=True)
                for n, member in enumerate(members, 1):
                    content = archive.read(member)  # Includes CRC validation.
                    pages = inspect_pdf(content)
                    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', Path(member.filename.replace('\\', '/')).name)
                    target = dest / name
                    if target.exists() and target.read_bytes() != content:
                        target = dest / f'{n}_{name}'
                    target.write_bytes(content)
                    document = {**{k: row[k] for k in ['publisher','level','subject','book','revision','sourcePage']}, 'title': member.filename, 'path': str(target), 'bytes': len(content), 'sha256': hashlib.sha256(content).hexdigest(), 'pages': pages, 'archive': str(path), 'status': 'verified'}
                    documents.append(document)
                    result['pdfs'].append({'name': member.filename, 'pages': pages, 'bytes': len(content)})
                if len(members) < len(row.get('coveredTitles', [])):
                    result['coverageWarning'] = 'Fewer PDF members than selected materials; inspect grouped rows.'
        elif path.suffix.lower() == '.pdf':
            result['pages'] = inspect_pdf(data)
            documents.append({**row, 'pages': result['pages'], 'status': 'verified'})
        else:
            raise ValueError('Unexpected file extension')
    except Exception as exc:
        result['status'] = 'failed'
        result['error'] = str(exc)
    results.append(result)
    if index % 50 == 0:
        print(f'Checked {index}/{len(rows)}', flush=True)

coverage = []
for book in {b['url']: b for b in books}.values():
    audit = next((a for a in reversed(courses) if a['url'] == book['url']), None)
    saved = [r for r in rows if r['sourcePage'] == book['url']]
    covered = {r['title'] for r in saved}
    covered.update(t for r in saved for t in r.get('coveredTitles', []))
    expected = audit.get('labels', []) if audit else []
    missing = [t for t in expected if t not in covered]
    status = 'complete' if expected and not missing else ('unvisited' if not audit else 'incomplete')
    if status == 'complete' and audit.get('availabilityNote'):
        status = 'sample-only' if audit.get('status') == 'sample-only' else 'available-only'
    coverage.append({**book, 'status': status, 'expectedMaterials': len(expected), 'savedMaterials': len(covered), 'missing': missing, 'siteStatus': audit.get('status') if audit else None, 'availabilityNote': audit.get('availabilityNote') if audit else None})

summary = {'downloadFiles': len(rows), 'downloadBytes': sum(r['bytes'] for r in rows), 'verifiedDownloads': sum(r['status'] == 'verified' for r in results), 'failedDownloads': sum(r['status'] == 'failed' for r in results), 'pdfDocuments': len(documents), 'pdfPages': sum(d['pages'] for d in documents), 'listedCourses': len(coverage), 'completeCourses': sum(c['status'] == 'complete' for c in coverage), 'incompleteCourses': [c for c in coverage if c['status'] != 'complete']}
(ROOT / 'references/textbooks/수집기록/기존작업/두클래스_교과서_검증.json').write_text(json.dumps({'summary': summary, 'files': results, 'courses': coverage}, ensure_ascii=False, indent=2), encoding='utf-8')
(ROOT / 'references/textbooks/secondary-douclass-textbooks-all.json').write_text(json.dumps(documents, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False, indent=2), flush=True)
