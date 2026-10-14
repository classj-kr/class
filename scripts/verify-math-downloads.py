"""Check downloaded assessment archives and write a local collection inventory."""
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from zipfile import ZipFile, is_zipfile

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'references/textbooks'
browser = json.loads((BASE / 'math-download-receipts.json').read_text(encoding='utf-8'))
direct = json.loads((BASE / 'math-direct-download-receipts.json').read_text(encoding='utf-8'))
direct_failures = [row for row in direct if row.get('status') != 'downloaded']
direct = [row for row in direct if row.get('status') == 'downloaded']
ybm_expected = {item['url'] for path in (BASE / 'ybm-math-download-lists').glob('*.json')
                for item in json.loads(path.read_text(encoding='utf-8'))['files']}
ybm_saved = {row['url'] for row in direct if row.get('publisher') == 'YBM'}
tselpa_archive_path = BASE / 'math-tselpa-archive-download-receipts.json'
tselpa_archive = json.loads(tselpa_archive_path.read_text(encoding='utf8')) if tselpa_archive_path.exists() else []
tselpa_saved = [row for row in tselpa_archive if row.get('status') == 'downloaded']
tselpa_manifests = list((BASE / 'tselpa-ebook-math-download-lists').glob('*-archive.json'))
tselpa_expected = sum(len(json.loads(path.read_text(encoding='utf8'))['selected']) for path in tselpa_manifests)
tselpa_complete = len(tselpa_manifests) == 16 and len(tselpa_saved) == tselpa_expected
tselpa_source_error_path = BASE / 'tselpa-ebook-math-archive-source-errors.json'
tselpa_source_errors = json.loads(tselpa_source_error_path.read_text(encoding='utf8')) if tselpa_source_error_path.exists() else []
miraen_path = BASE / 'math-miraen-download-receipts.json'
miraen = json.loads(miraen_path.read_text(encoding='utf-8')) if miraen_path.exists() else []
repair_path = BASE / 'math-jihak-repair-receipts.json'
repairs = json.loads(repair_path.read_text(encoding='utf-8')) if repair_path.exists() else []
visang_supplement_path = BASE / 'math-visang-archive-supplement-receipts.json'
visang_supplements = json.loads(visang_supplement_path.read_text(encoding='utf8')) if visang_supplement_path.exists() else []
visang_supplement_saved = [row for row in visang_supplements if row.get('status') == 'downloaded']
repair_groups = {}
for row in repairs:
    key = (re.sub(r'\s+', '', row['book']), row['category'], re.sub(r'\s+', '', row['unit']))
    repair_groups[key] = row
checks = []
for row in browser:
    path = Path(row['path'])
    result = {'publisher': row['publisher'], 'path': str(path), 'exists': path.is_file()}
    if path.is_file():
        result['bytes'] = path.stat().st_size
        if is_zipfile(path):
            with ZipFile(path) as archive:
                result['archiveFiles'] = sum(not item.is_dir() for item in archive.infolist())
                result['corruptMember'] = archive.testzip()
                if row['publisher'] == '지학사' and row.get('unit'):
                    expected = re.match(r'\d+', row['unit']).group()
                    found = {m.group(1) for name in archive.namelist()
                             for m in re.finditer(r'(\d+)단원', name)}
                    result['expectedUnit'] = expected
                    result['actualUnits'] = sorted(found)
                    result['unitMatches'] = expected in found
    checks.append(result)
status = {
    'updatedAt': datetime.now(timezone.utc).isoformat(),
    'scope': 'Local math reference downloads; no publication or question extraction',
    'status': 'in-progress',
    'newPhysicalFiles': len(browser) + len(direct) + len(miraen) + len(repairs),
    'visangArchiveSupplementFiles': len(visang_supplement_saved),
    'visangArchiveSupplementMissingFiles': sum(not Path(row['path']).is_file() for row in visang_supplement_saved),
    'visangArchiveSupplementFailures': [row for row in visang_supplements if row.get('status') != 'downloaded'],
    'tselpaArchivePhysicalFiles': len(tselpa_saved),
    'tselpaArchiveMissingFiles': sum(not Path(row['path']).is_file() for row in tselpa_saved),
    'tselpaArchiveSelectedFiles': tselpa_expected,
    'tselpaArchiveFailures': [row for row in tselpa_archive if row.get('status') != 'downloaded'],
    'tselpaUnavailableArchiveSources': tselpa_source_errors,
    'miraenPhysicalFiles': len(miraen),
    'miraenMissingFiles': sum(not Path(row['path']).is_file() for row in miraen),
    'browserFilesByPublisher': dict(Counter(row['publisher'] for row in browser)),
    'directFilesByPublisher': dict(Counter(row['publisher'] for row in direct)),
    'missingDirectFiles': sum(not Path(row['path']).is_file() for row in direct),
    'directDownloadFailures': direct_failures,
    'ybm': {'listedUniqueFiles': len(ybm_expected), 'savedFiles': len(ybm_saved),
            'remainingFiles': len(ybm_expected - ybm_saved)},
    'browserFileChecks': checks,
    'donga': {
        'books': sorted({row['book'] for row in browser if row['publisher'] == '동아출판'}),
        'archives': sum(row['publisher'] == '동아출판' for row in browser),
        'listedDocuments': sum(row.get('listedFiles', 0) for row in browser if row['publisher'] == '동아출판'),
        'scope': 'Grades 3–6, both terms: diagnostic, formative, unit, written response, performance, mid/final assessments',
    },
    'jihak': {
        'status': 'recollected-with-one-source-label-discrepancy' if len(repair_groups) == 144 else 'incomplete-content-mismatch',
        'earlierMismatchedBundles': sum(row.get('unitMatches') is False for row in checks),
        'recollectedBundles': len(repair_groups),
        'recollectionListedDocuments': sum(row.get('listedFiles', 0) for row in repair_groups.values()),
        'recollectionFilenameMismatches': [row['path'] for row in repair_groups.values() if row.get('archiveVerified') is False],
        'books': sorted({row['book'] for row in browser if row['publisher'] == '지학사' and row.get('listedFiles')}),
        'bundles': sum(row['publisher'] == '지학사' and bool(row.get('listedFiles')) for row in browser),
        'listedDocuments': sum(row.get('listedFiles', 0) for row in browser if row['publisher'] == '지학사'),
        'scope': 'Grades 3–6 both terms, performance/unit/written response. Earlier mismatched bundles were recollected. One official unit-4 row downloads a unit-5 filename.',
    },
    'remaining': [
        {'publisher': '미래엔', 'status': 'listed-files-downloaded', 'evidence': 'Grades 1–6 both terms: 1,453 unique files saved; four disabled entries unavailable and one duplicate resource'},
        {'publisher': 'YBM', 'status': 'listed-files-downloaded' if ybm_expected <= ybm_saved else 'collecting', 'evidence': 'Official row download URLs collected across eight books and 48 units; see saved/remaining counts'},
        {'publisher': 'T셀파', 'status': 'listed-ebook-documents-downloaded' if tselpa_complete else 'available-ebook-documents-downloaded-one-source-unavailable' if len(tselpa_saved) == tselpa_expected and tselpa_source_errors else 'collecting-official-ebook-archives', 'evidence': '15 official ebook ZIPs yielded 5,155 CRC-validated documents. Park Man-gu 5-1 ZIP returns 404; 162 individual documents supplement it. Assessment-page downloads remain at 0%, including grades 1–2.'},
    ],
}
(BASE / 'math-download-status.json').write_text(json.dumps(status, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({key: value for key, value in status.items() if key not in ('browserFileChecks', 'remaining')}, ensure_ascii=False))
print('Archive check failures:', [row for row in checks if not row['exists'] or row.get('corruptMember')])
