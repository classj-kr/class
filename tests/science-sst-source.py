"""Independent comparison of every shipped value with archived NOAA responses."""
import json
import re
import unittest
from datetime import datetime, timedelta
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'docs/science-lab-audit-2026-10-12/course-practices/satellite-sea-temperature/source-data'
DATA = json.loads((ROOT / 'learning/inquiry/science-lab/satellite-sea-temperature/data.json').read_text(encoding='utf-8'))

def original(file):
    lines = (BASE / file).read_text().splitlines()
    axes = {}
    rows = {}
    for i, line in enumerate(lines):
        match = re.match(r'sst\.(time|lat|lon)\[', line)
        if match:
            axes[match[1]] = [float(v) for v in lines[i + 1].split(',')]
        match = re.match(r'\[(\d+)\]\[(\d+)\],(.*)', line)
        if match:
            rows[tuple(map(int, match.groups()[:2]))] = np.asarray([float(v) for v in match[3].split(',')], dtype=np.float32)
    dates = [(datetime(1800, 1, 1) + timedelta(days=d)).strftime('%Y-%m') for d in axes['time']]
    return axes, dates, rows

class SourceTest(unittest.TestCase):
    def test_every_value_matches_original_grid_cell(self):
        current = original('sst-2023-west-pacific.ascii')
        historic = original('sst-korea-2019-2023-january-july.ascii')
        count = 0
        for region in DATA['regions']:
            for frame in region['frames']:
                axes, dates, rows = current if frame['date'].startswith('2023') else historic
                t = dates.index(frame['date'])
                for y, lat in enumerate(region['lat']):
                    source_row = rows[t, axes['lat'].index(lat)]
                    for x, lon in enumerate(region['lon']):
                        v = float(source_row[axes['lon'].index(lon)])
                        actual = frame['values'][y * len(region['lon']) + x]
                        self.assertEqual(actual, v if -3 <= v <= 45 else None)
                        count += 1
        self.assertEqual(count, 167680)
        print('Compared all', count, 'grid values including original null mask.')

    def test_actual_months_and_independent_overlap(self):
        a, dates, rows = original('sst-2023-west-pacific.ascii')
        b, old_dates, old_rows = original('sst-korea-2019-2023-january-july.ascii')
        self.assertEqual(dates, [f'2023-{m:02}' for m in range(1, 13)])
        self.assertEqual(old_dates, [f'{y}-{m:02}' for y in range(2019, 2024) for m in [1, 7]])
        for date in ['2023-01', '2023-07']:
            for y, lat in enumerate(b['lat']):
                for x, lon in enumerate(b['lon']):
                    self.assertEqual(old_rows[old_dates.index(date), y][x], rows[dates.index(date), a['lat'].index(lat)][a['lon'].index(lon)])

    def test_book_comparisons_have_actual_opposite_seasonal_signs(self):
        changes = []
        for r in DATA['regions']:
            x = r['lon'].index(r['probe'][0]); y = r['lat'].index(r['probe'][1]); idx = y * len(r['lon']) + x
            values = {f['date']: f['values'][idx] for f in r['frames']}
            changes.append(values['2023-08'] - values['2023-02'])
        self.assertGreater(changes[0], 12)
        self.assertLess(changes[2], -7)
        self.assertLess(abs(changes[1]), 1)

if __name__ == '__main__':
    unittest.main()
