"""Read local, collected science sources; keep full extracted text in ignored tmp/.

This inventories evidence, never treats a keyword hit as content verification.
Run from the repository root with the bundled Python runtime.
"""
import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path
try:
    import pymupdf
except ImportError:
    pymupdf = None
    from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'tmp/science-audit-2026-10-11'
OUT.mkdir(parents=True, exist_ok=True)
spec = importlib.util.spec_from_file_location('assessment_text', ROOT / 'scripts/extract-assessment-text.py')
extractor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(extractor)

base = ROOT / 'references/textbooks'
pdfs = sorted(p for p in (base / '초등/미래엔/과학').rglob('*.pdf')
              if '과학PDF__' in p.name and '결손' not in p.name)
pdfs += sorted(p for p in (base / '중고등/미래엔').rglob('*교과서__*.pdf')
               if '/과학/' in p.as_posix() and '_2022' in p.as_posix()
               and '교사용' not in p.name)
hwps = sorted(p for p in (base / '중고등/미래엔/중학/과학').rglob('*.hwp')
              if '2022_평가자료' in p.as_posix() and '단원 평가' in p.name and '자동 채점' in p.name)
all_sources = '--all' in sys.argv
revision_evidence = {}
if all_sources:
    # Some publishers omit the curriculum year from the extracted filename. Their
    # collection receipt records the original 2022 archive URL, so do not drop
    # these user-supplied files solely because the local name is yearless.
    for receipt in base.rglob('수집기록.json'):
        if '과학' not in receipt.parts:
            continue
        try:
            record = json.loads(receipt.read_text(encoding='utf-8-sig'))
            origin = record.get('source', {})
            evidence = json.dumps(origin, ensure_ascii=False)
            if not re.search(r'2022|22\s*개정', evidence) or re.search(r'2015|15\s*개정', evidence):
                continue
            for file in record.get('files', []):
                if not file.get('path'):
                    continue
                candidate = Path(file['path'])
                if candidate.is_file() and candidate.is_relative_to(base) and not re.search(r'2015|15\s*개정', str(candidate)):
                    revision_evidence[candidate] = {
                        'receipt': receipt.relative_to(ROOT).as_posix(),
                        'source': origin,
                    }
        except (OSError, ValueError, TypeError):
            continue
    candidates = sorted(p for p in base.rglob('*') if p.suffix.lower() in ('.pdf', '.hwp', '.hwpx')
                        and '과학' in p.parts and (re.search(r'2022|22\s*개정', p.as_posix()) or p in revision_evidence)
                        and not re.search(r'2015|15\s*개정', p.as_posix()))
    pdfs = [p for p in candidates if p.suffix.lower() == '.pdf']
    hwps = [p for p in candidates if p.suffix.lower() != '.pdf']
manifest = []
seen = {}
for p in pdfs + hwps:
    digest = hashlib.sha256(p.read_bytes()).hexdigest()
    if digest in seen:
        seen[digest].setdefault('aliases', []).append(p.relative_to(ROOT).as_posix())
        continue
    target = OUT / (digest[:16] + '.json')
    item = json.loads(target.read_text(encoding='utf-8')) if target.exists() else None
    if not item or item.get('error'):
        item = {'path': p.relative_to(ROOT).as_posix(), 'sha256': digest, 'kind': p.suffix[1:]}
        try:
            if p.suffix == '.pdf':
                if pymupdf:
                    with pymupdf.open(p) as document:
                        item['pages'] = [{'pdfPage': i + 1, 'text': page.get_text()}
                                         for i, page in enumerate(document)]
                else:
                    reader = PdfReader(p)
                    item['pages'] = [{'pdfPage': i + 1, 'text': page.extract_text() or ''}
                                     for i, page in enumerate(reader.pages)]
            else:
                item['paragraphs'] = extractor.paragraphs(p)
        except Exception as exc:
            item['error'] = str(exc)
        target.write_text(json.dumps(item, ensure_ascii=False, indent=2), encoding='utf-8')
    entry = {k: v for k, v in item.items() if k not in ('pages', 'paragraphs')}
    entry['extractedFile'] = target.relative_to(ROOT).as_posix()
    entry['pages' if p.suffix == '.pdf' else 'paragraphs'] = len(item.get('pages', item.get('paragraphs', [])))
    entry['status'] = 'extraction-failed' if item.get('error') else 'extracted-not-yet-reviewed'
    entry['revisionEvidence'] = revision_evidence.get(p, {'kind': 'explicit-2022-path'})
    manifest.append(entry)
    seen[digest] = entry
    print(p.name, entry['status'], flush=True)
(OUT / ('manifest-all.json' if all_sources else 'manifest.json')).write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'sources': len(manifest), 'errors': sum(bool(x.get('error')) for x in manifest)}))
