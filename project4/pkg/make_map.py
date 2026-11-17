#!/usr/bin/env python3
"""Build a stylised equirectangular world map from Natural Earth (public domain) GeoJSON."""
import json, sys, numpy as np, cv2
import os; ROOT = os.environ['P4_ROOT']; WORK = ROOT + '/work'
OUT = ROOT + '/maps/world.jpg'
PPD = 40
W, H = 360 * PPD, 180 * PPD

def px(c):
    return np.array([[(lo + 180) * PPD, (90 - la) * PPD] for lo, la in c], np.float64)

def polys(geom):
    if geom['type'] == 'Polygon': return [geom['coordinates']]
    if geom['type'] == 'MultiPolygon': return geom['coordinates']
    return []

land = json.load(open(f'{WORK}/ne_50m_land.geojson'))
mask = np.zeros((H, W), np.uint8)
bmask = np.zeros((H, W), np.uint8)
for f in land['features']:
    for poly in polys(f['geometry']):
        ext = px(poly[0]).astype(np.int32)
        cv2.fillPoly(mask, [ext], 255)
        for hole in poly[1:]:
            cv2.fillPoly(mask, [px(hole).astype(np.int32)], 0)
        cv2.polylines(bmask, [ext], True, 255, 3, cv2.LINE_AA)
print('land drawn', flush=True)

bord = np.zeros((H, W), np.uint8)
ctr = json.load(open(f'{WORK}/ne_50m_admin_0_countries.geojson'))
for f in ctr['features']:
    for poly in polys(f['geometry']):
        cv2.polylines(bord, [px(poly[0]).astype(np.int32)], True, 255, 2, cv2.LINE_AA)
print('borders drawn', flush=True)

# coastal glow in ocean
small = cv2.resize(mask, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
dist = cv2.distanceTransform((small < 128).astype(np.uint8), cv2.DIST_L2, 5)
glow = np.exp(-dist / 7.0) * 255
glow_u8 = cv2.resize(glow.astype(np.uint8), (W, H), interpolation=cv2.INTER_LINEAR)
del glow, dist, small

# terrain-ish noise
rng = np.random.default_rng(3)
noise = np.zeros((H // 8, W // 8), np.float32)
for s, a in ((64, 1.0), (24, 0.6), (8, 0.35)):
    n = rng.standard_normal((max(2, H // 8 // s * 2), max(2, W // 8 // s * 2))).astype(np.float32)
    noise += cv2.resize(n, (W // 8, H // 8), interpolation=cv2.INTER_CUBIC) * a
noise = (noise - noise.min()) / (noise.max() - noise.min())
noise_u8 = cv2.resize((noise * 255).astype(np.uint8), (W, H), interpolation=cv2.INTER_CUBIC)
del noise

img = np.zeros((H, W, 3), np.uint8)
BAND = 400
for y0 in range(0, H, BAND):
    y1 = min(H, y0 + BAND)
    lat = 90 - (np.arange(y0, y1) + 0.5) / PPD
    lat2 = lat[:, None]
    # ocean: deep blue, a touch lighter toward equator
    oc = np.stack([np.full((y1 - y0, 1), 16.0), np.full((y1 - y0, 1), 30.0), np.full((y1 - y0, 1), 46.0)], -1) + (1 - np.abs(lat2) / 90)[..., None] * np.array([2, 6, 8])
    oc = np.broadcast_to(oc, (y1 - y0, W, 3)).copy()
    g = (glow_u8[y0:y1].astype(np.float32) / 255.0)[..., None]
    oc = oc + g * np.array([26, 62, 72], np.float32)
    # land: warm sand to green-brown to white at poles, with noise
    n = (noise_u8[y0:y1].astype(np.float32) / 255.0)[..., None]
    t = np.clip(np.abs(lat2) / 90, 0, 1)[..., None]
    base = np.array([138, 118, 82], np.float32) * (1 - t) + np.array([96, 108, 82], np.float32) * t
    base = np.broadcast_to(base, (y1 - y0, W, 3))
    polar = np.clip((np.abs(lat2) - 62) / 18, 0, 1)[..., None]
    base = base * (1 - polar) + np.array([205, 210, 214], np.float32) * polar
    ld = base * (0.78 + 0.44 * n)
    m = (mask[y0:y1] > 127)[..., None]
    out = np.where(m, ld, oc)
    b = (bord[y0:y1].astype(np.float32) / 255.0)[..., None] * m * 0.30
    out = out * (1 - b) + np.array([60, 52, 40], np.float32) * b
    c = (bmask[y0:y1].astype(np.float32) / 255.0)[..., None] * 0.55
    out = out * (1 - c) + np.array([212, 196, 150], np.float32) * c
    img[y0:y1] = np.clip(out, 0, 255).astype(np.uint8)
cv2.imwrite(OUT, cv2.cvtColor(img, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 92])
print('saved', OUT, img.shape)
