"""Reconcile digitized textbook shores with the geographic land mask.

Only previously unpainted land in a narrow coastal strip is eligible. Existing
interior borders are never buffered or replaced. Nearest-source growth assigns
each missing coastal strip to one adjacent region, not to overlapping strokes.
"""
from shapely.geometry import Polygon, MultiPoint
from shapely.ops import unary_union, transform
from shapely import make_valid, set_precision, voronoi_polygons
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
    # Use the same per-region buffers as the allocator. Buffering the dissolved
    # cover separately can create small wedges outside every region's buffer.
    reach = unary_union([region.buffer(tolerance) for region in source])
    eligible = local_land.intersection(coast).intersection(reach).difference(cover)
    # Allocate the strip in one continuous nearest-boundary partition. Growing
    # competing buffers in 1 km rounds leaves alternating concentric strips at
    # near ties, which become spurious "fingerprint" borders when zoomed in.
    def polygons(g):
        if g.geom_type == 'Polygon': return [g]
        return [p for child in getattr(g, 'geoms', []) for p in polygons(child)]
    samples = {}
    for owner, region in enumerate(source):
        for polygon in polygons(region):
            for ring in [polygon.exterior, *polygon.interiors]:
                # Include actual corners as well as regular samples: omitting
                # a corner biases otherwise symmetric near-coast ties.
                for x, y in ring.coords:
                    samples.setdefault((round(x, 3), round(y, 3)), owner)
                for distance in np.linspace(0, ring.length, max(2, int(np.ceil(ring.length/step))), endpoint=False):
                    point = ring.interpolate(distance)
                    samples.setdefault((round(point.x, 3), round(point.y, 3)), owner)
    cells = voronoi_polygons(MultiPoint(list(samples)), ordered=True)
    pieces = [[] for _ in source]
    for cell, owner in zip(cells.geoms, samples.values()):
        cell = make_valid(cell)
        if cell.intersects(eligible):
            pieces[owner].append(cell.intersection(eligible))
    additions = [unary_union(parts) for parts in pieces]
    added = unary_union(additions)
    remaining = eligible.difference(added)
    result = [region.intersection(local_land).union(extra) for region, extra in zip(source, additions)]
    assert added.difference(eligible).area < 1, 'No inland or seaward expansion'
    assert remaining.area < 1, 'Every eligible shore must be assigned'
    for before, after in zip(source, result):
        assert before.intersection(local_land).difference(after).area < 1, 'Do not remove original territory'
    return [set_precision(make_valid(projected(g, inverse=True)), 0.000001) for g in result], {
        'method': 'Continuous Voronoi partition of unpainted coastal land; original inland borders retained.',
        'maximumMercatorMetres': tolerance,
        'boundarySampleMercatorMetres': step,
        'coastalLandAddedMercatorKm2': round(added.area / 1e6, 3),
        'remainingEligibleMercatorKm2': round(remaining.area / 1e6, 6),
        'regions': [{'addedMercatorKm2': round(g.area / 1e6, 3)} for g in additions]
    }
