"""Reconcile digitized textbook shores with the geographic land mask.

Only previously unpainted land in a narrow coastal strip is eligible. Existing
interior borders are never buffered or replaced. Nearest-source growth assigns
each missing coastal strip to one adjacent region, not to overlapping strokes.
"""
from shapely.geometry import Polygon
from shapely.ops import unary_union, transform
from shapely import make_valid, set_precision
import numpy as np

R = 6371008.8


def projected(g, inverse=False):
    def convert(x, y, z=None):
        x, y = np.asarray(x), np.asarray(y)
        if inverse:
            return np.degrees(x / R), np.degrees(2 * np.arctan(np.exp(y / R)) - np.pi / 2)
        return R * np.radians(x), R * np.log(np.tan(np.pi / 4 + np.radians(y) / 2))
    return transform(convert, g)


def coastal_regions(regions, land, tolerance=32000, step=1000):
    """Return land-clipped regions and an audit of bounded coastal additions.

    Distances are Mercator metres (conservative ground distance in Korea).
    This is coastline registration, not evidence of additional conquests.
    """
    source = [projected(region) for region in regions]
    cover = unary_union(source)
    # Restrict expensive coastline operations to the source-map neighbourhood.
    local_land = projected(land).intersection(cover.envelope.buffer(tolerance * 3))
    coast = local_land.boundary.buffer(tolerance)
    eligible = local_land.intersection(coast).intersection(cover.buffer(tolerance)).difference(cover)
    # Compute one continuous nearest-source partition of missing land. Regions
    # keep their original inland geometry, including any unknown inland areas.
    additions = [Polygon() for _ in source]
    remaining = eligible
    for distance in range(step, tolerance + step, step):
        if remaining.is_empty:
            break
        for i, region in enumerate(source):
            piece = remaining.intersection(region.buffer(distance))
            if not piece.is_empty:
                additions[i] = additions[i].union(piece)
                remaining = remaining.difference(piece)
    result = [region.intersection(local_land).union(extra) for region, extra in zip(source, additions)]
    added = unary_union(additions)
    assert added.difference(eligible).area < 1, 'No inland or seaward expansion'
    assert remaining.area < 1, 'Every eligible shore must be assigned'
    for before, after in zip(source, result):
        assert before.intersection(local_land).difference(after).area < 1, 'Do not remove original territory'
    return [set_precision(make_valid(projected(g, inverse=True)), 0.000001) for g in result], {
        'method': 'Nearest existing region fills only unpainted coastal land; inland borders retained.',
        'maximumMercatorMetres': tolerance,
        'stepMercatorMetres': step,
        'coastalLandAddedMercatorKm2': round(added.area / 1e6, 3),
        'remainingEligibleMercatorKm2': round(remaining.area / 1e6, 6),
        'regions': [{'addedMercatorKm2': round(g.area / 1e6, 3)} for g in additions]
    }
