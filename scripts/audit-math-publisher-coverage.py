"""Report actual local collection coverage against the textbook catalog."""
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

root = Path(__file__).resolve().parents[1]
base = root / 'references/textbooks'
def read(name, default=None):
    path = base / name
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else default

catalog = json.loads((root / 'game-hub-server/data/textbooks/catalog-2022.json').read_text(encoding='utf-8'))
browser = read('math-download-receipts.json', [])
direct = read('math-direct-download-receipts.json', [])
direct_failures = [row for row in direct if row.get('status') != 'downloaded']
direct = [row for row in direct if row.get('status') == 'downloaded']
ybm_expected = {item['url'] for path in (base / 'ybm-math-download-lists').glob('*.json')
                for item in json.loads(path.read_text(encoding='utf-8'))['files']}
ybm_saved = {row['url'] for row in direct if row.get('publisher') == 'YBM'}
tselpa_archive = read('math-tselpa-archive-download-receipts.json', [])
tselpa_zip_sources = read('tselpa-ebook-math-zip-sources.json', [])
tselpa_source_errors = read('tselpa-ebook-math-archive-source-errors.json', [])
tselpa_archive_manifests = [json.loads(path.read_text(encoding='utf8'))
                            for path in (base / 'tselpa-ebook-math-download-lists').glob('*-archive.json')]
tselpa_expected = sum(len(data['selected']) for data in tselpa_archive_manifests)
tselpa_saved = [row for row in tselpa_archive if row.get('status') == 'downloaded']
miraen = read('math-miraen-download-receipts.json', [])
repairs = read('math-jihak-repair-receipts.json', [])
visang_supplements = read('math-visang-archive-supplement-receipts.json', [])
visang_supplement_saved = [row for row in visang_supplements if row.get('status') == 'downloaded']
tselpa = []
for path in (base / 'tselpa-browser-assessments').glob('*math*.json'):
    data = json.loads(path.read_text(encoding='utf-8'))
    for group in data.get('groups', []):
        for item in group.get('lessons', []):
            if item.get('downloadPath'):
                tselpa.append({'resourceId': item.get('resourceId'), 'path': item['downloadPath']})

books = []
resource_ids = {value for row in miraen for value in [row.get('resourceId'), *row.get('resourceIds', [])] if value}
for path in (base / 'miraen-math-download-lists').glob('*.json'):
    data = json.loads(path.read_text(encoding='utf-8'))
    acquired = [row for row in miraen if row['sourceUrl'].rstrip('#') == data['url'].rstrip('#')]
    items = data['items']
    filenames = {row['fileName'] for row in acquired}
    file_labels = [item.get('name') for item in items if item.get('name', '').endswith(('.hwp', '.pdf', '.hwpx', '.zip'))]
    # Earlier captures lacked resource ids; report filenames separately without asserting complete mapping.
    books.append({'book': data['book'], 'listedItems': len(items),
                  'unavailableItems': sum(bool(item.get('disabled')) for item in items),
                  'physicalFiles': len(acquired),
                  'resourceIdsCovered': sum(item.get('id') in resource_ids for item in items if item.get('id')),
                  'literalFileLabelsChecked': len(file_labels),
                  'unmatchedLiteralFileLabels': sorted(set(file_labels) - filenames),
                  'sourceUrl': data['url']})

notes = {
    '동아출판': 'Grades 3–6 both terms: six assessment categories downloaded; 48 distinct ZIP bundles.',
    '디딤돌교육': 'Grades 3–6 both terms: seven resource groups downloaded; 56 physical files.',
    '미래엔': 'Grades 1–6 both terms: 1,453 unique files saved. Four disabled grade-6 entries unavailable; grade 3-1 has one duplicate file resource.',
    '비상교육': '517 earlier math documents; direct downloads include 428 assessment documents and 24 grade-5/6 workbook PDFs. Additional grade-3/4 basic/advanced problems and workbook PDFs are counted in visangArchiveSupplements.',
    '아이스크림미디어': '2,486 official source URLs covered by 2,354 documents and a ZIP containing 132 source members. Unpublished term-end materials remain unavailable.',
    '와이비엠': 'Official file URLs collected across eight books and 48 units. See YBM saved and remaining file counts.',
    '지학사': 'Recollected 144 unit/category bundles for grades 3–6 both terms. One official row/file unit-label discrepancy requires review.',
    '천재교과서': 'Both author editions, grades 3–6 both terms: official ebook archives are collected using document-only byte ranges. Assessment-page downloads still stall; see archive coverage counts.',
}
targets = []
for edition in catalog['editions']:
    if edition['subject'] != '수학':
        continue
    volumes = sorted({(volume['grade'], volume['semester']) for volume in edition['volumes']})
    targets.append({'editionId': edition['id'], 'publisher': edition['publisher'],
                    'leadAuthor': edition['leadAuthor'], 'gradeBand': edition['gradeBand'],
                    'gradeTerms': [{'grade': grade, 'semester': semester} for grade, semester in volumes],
                    'status': 'collection-in-progress',
                    'note': notes.get(edition['publisher'], 'National textbook: Miraen, Icream and Tselpa reference collections are being checked.')})

report = {
    'updatedAt': datetime.now(timezone.utc).isoformat(), 'status': 'in-progress',
    'scope': 'Math source-file collection, not a count of questions or a claim of publication permission.',
    'targetEditions': len(targets), 'targetGradeTerms': sum(len(item['gradeTerms']) for item in targets),
    'targets': targets,
    'newFiles': {'browser': len(browser), 'publicDirect': len(direct), 'miraen': len(miraen),
                 'jihakRecollection': len(repairs)},
    'visangArchiveSupplements': {'savedFiles': len(visang_supplement_saved),
                                 'missingFiles': sum(not Path(row['path']).is_file() for row in visang_supplement_saved),
                                 'failures': [row for row in visang_supplements if row.get('status') != 'downloaded'],
                                 'categories': dict(Counter(row['category'] for row in visang_supplement_saved))},
    'miraenBooks': books,
    'tselpaAssessmentPending': read('math-tselpa-pending-coverage.json', {}),
    'ybm': {'listedUniqueFiles': len(ybm_expected), 'savedFiles': len(ybm_saved),
            'remainingFiles': len(ybm_expected - ybm_saved),
            'failedFiles': sum(row.get('publisher') == 'YBM' for row in direct_failures)},
    'tselpaEbookArchives': {'sourceBooks': len(tselpa_zip_sources),
                           'inventoriedBooks': len(tselpa_archive_manifests),
                           'selectedDocuments': tselpa_expected, 'savedDocuments': len(tselpa_saved),
                           'failedDocuments': sum(row.get('status') != 'downloaded' for row in tselpa_archive),
                           'missingFiles': sum(not Path(row['path']).is_file() for row in tselpa_saved),
                           'unavailableSources': tselpa_source_errors,
                           'individualSupplementFiles': sum(row.get('publisher') == 'T셀파' for row in direct),
                           'scope': 'Officially linked grades 3–6 both terms and both authors; HWP/HWPX/PDF filenames containing assessment/problem/workbook/worksheet/activity/arithmetic terms. CRC, size and file magic validated; no media downloaded.'},
    'tselpaEarlierPerformanceFiles': {'records': len(tselpa),
                                    'uniquePaths': len({row['path'] for row in tselpa}),
                                    'missing': sum(not Path(row['path']).is_file() for row in tselpa)},
    'knownIssues': ['Earlier Jihak receipts include 127 mismatched bundles; use recollection receipts for coverage.',
                    'Jihak math 6-1 unit 4 advanced test 1: official row says unit 4, downloaded member filename says unit 5.',
                    *(['YBM downloads remain incomplete.'] if ybm_expected - ybm_saved else []),
                    'Tselpa assessment-page downloads remain stalled at progress 0. Grades 3–6 are being acquired from official ebook archives; grades 1–2 have no ebook link on their textbook pages.',
                    'The official Park Man-gu math 5-1 ZIP link returns HTTP 404. Individual evaluation/activity documents supplement this book, but folder-only unit assessment files remain unavailable.',
                    'Miraen grade 3-1 includes one duplicate resource; grade 6 has four disabled entries.'],
}
(base / 'math-publisher-coverage.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({key: report[key] for key in ('targetEditions', 'targetGradeTerms', 'newFiles', 'tselpaEarlierPerformanceFiles')}, ensure_ascii=False))
