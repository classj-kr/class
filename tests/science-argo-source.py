"""Independent checks against the archived NetCDF and published GSW examples."""
import json
import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from scipy.io import netcdf_file

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tmp/science-ocean-deps'))
import gsw
from shapely.geometry import Polygon, Point

class ArgoSources(unittest.TestCase):
    def test_published_density_example(self):
        # TEOS-10 gsw_rho_t_exact example, first and last rows, kg/m³.
        for sa, t, p, expected in [(34.7118, 28.7856, 10, 1021.840173185531), (34.7324, 4.4036, 1000, 1032.002404116447)]:
            self.assertAlmostEqual(float(gsw.rho_t_exact(sa, t, p)), expected, places=8)

    def test_every_observation_matches_adjusted_source_and_quality(self):
        data = json.loads((ROOT / 'learning/inquiry/science-lab/argo-observation/data.json').read_text())
        source = ROOT / 'docs/science-lab-audit-2026-10-12/course-practices/argo-observation/source-data/2901806_prof.nc'
        total = 0
        with netcdf_file(source, 'r', mmap=False) as f:
            v = f.variables
            by_cycle = {str(int(n)): i for i, n in enumerate(v['CYCLE_NUMBER'][:])}
            for profile in data['profiles']:
                i = by_cycle[profile['id']]
                expected_date = datetime(1950, 1, 1, tzinfo=timezone.utc) + timedelta(days=float(v['JULD'][i]))
                self.assertEqual(profile['time'], expected_date.isoformat())
                self.assertEqual(profile['lat'], float(v['LATITUDE'][i]))
                self.assertEqual(profile['lon'], float(v['LONGITUDE'][i]))
                self.assertEqual(v['DATA_MODE'][i], b'D')
                for row in filter(None, profile['points']):
                    k = row['sourceIndex']
                    for field, param in [('p','PRES'), ('t','TEMP'), ('s','PSAL')]:
                        value = float(v[param + '_ADJUSTED'][i, k])
                        good = v[param + '_ADJUSTED_QC'][i, k] == b'1' and abs(value) < 90000
                        self.assertEqual(row[field], value if good else None)
                    if row['t'] is not None and row['s'] is not None:
                        expected = gsw.rho_t_exact(gsw.SA_from_SP(row['s'], row['p'], profile['lon'], profile['lat']), row['t'], row['p'])
                        self.assertEqual(row['rho'], float(expected))
                    else:
                        self.assertIsNone(row['rho'])
                    self.assertEqual(row['depth'], float(-gsw.z_from_p(row['p'], profile['lat'])))
                    total += 1
        self.assertEqual(total, 2814)

    def test_detailed_land_retains_small_islands_and_ocean(self):
        data = json.loads((ROOT / 'learning/inquiry/science-lab/argo-observation/data.json').read_text())
        polys = [Polygon(p[0], p[1:]) for p in data['land']]
        self.assertTrue(all(p.is_valid for p in polys))
        self.assertTrue(any(p.covers(Point(127.3, 36.5)) for p in polys))
        self.assertTrue(any(p.covers(Point(130.9, 37.5)) for p in polys))
        self.assertFalse(any(p.covers(Point(131.712, 36.980)) for p in polys))

if __name__ == '__main__':
    unittest.main(verbosity=2)
