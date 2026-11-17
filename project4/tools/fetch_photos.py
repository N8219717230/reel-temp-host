#!/usr/bin/env python3
"""Runs on a GitHub Actions runner (open internet). usage: fetch_photos.py <queries.json> <outdir>
queries.json: {"per": 4, "queries": [{"id": "zhangqian", "q": "Zhang Qian statue Xi'an"}]}
Downloads freely-licensed images from Wikimedia Commons (public domain, CC0, CC BY, CC BY-SA) + meta.json with credits."""
import json, os, re, sys, html, io, requests
from PIL import Image
Q = json.load(open(sys.argv[1])); OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers['User-Agent'] = 'Project4Bot/1.0 (https://github.com/N8219717230/reel-temp-host; educational history videos)'
OK = re.compile(r'^(public domain|pd|cc0|cc[- ]by(?![- ]?(nc|nd))|cc[- ]by[- ]sa|attribution)', re.I)
def clean(s): return html.unescape(re.sub(r'<[^>]+>', '', s or '')).strip()
meta = []
for item in Q['queries']:
    if item.get('title'):   # metadata-only lookup of a known Commons file: {"id": "x", "title": "File:Name.jpg", "meta_only": true}
        r = S.get('https://commons.wikimedia.org/w/api.php', params={'action': 'query', 'format': 'json', 'titles': item['title'], 'prop': 'imageinfo', 'iiprop': 'url|extmetadata'}, timeout=60).json()
        for p in r['query']['pages'].values():
            ii = (p.get('imageinfo') or [{}])[0]; em = ii.get('extmetadata', {})
            meta.append({'query_id': item['id'], 'title': p['title'], 'artist': clean(em.get('Artist', {}).get('value')), 'license': clean(em.get('LicenseShortName', {}).get('value')), 'page': ii.get('descriptionurl')})
        continue
    r = S.get('https://commons.wikimedia.org/w/api.php', params={'action': 'query', 'format': 'json', 'generator': 'search', 'gsrsearch': item['q'] + ' filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': 30,
        'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': 1920}, timeout=60).json()
    pages = sorted((r.get('query', {}).get('pages', {})).values(), key=lambda p: p.get('index', 99))
    n = 0
    for p in pages:
        ii = (p.get('imageinfo') or [{}])[0]; em = ii.get('extmetadata', {}); lic = clean(em.get('LicenseShortName', {}).get('value'))
        if not ii or ii.get('mime') not in ('image/jpeg', 'image/png') or ii.get('width', 0) < 1100 or not OK.match(lic): continue
        if re.search(r'\b(nc|nd)\b', lic, re.I): continue
        try:
            b = S.get(ii.get('thumburl') or ii['url'], timeout=90).content; im = Image.open(io.BytesIO(b)).convert('RGB')
        except Exception as e: print('skip', p.get('title'), e); continue
        n += 1; name = f"{item['id']}_{n}.jpg"; im.save(f'{OUT}/{name}', quality=90)
        meta.append({'file': name, 'query_id': item['id'], 'title': p['title'], 'artist': clean(em.get('Artist', {}).get('value')), 'license': lic,
                     'license_url': clean(em.get('LicenseUrl', {}).get('value')), 'page': ii.get('descriptionurl'), 'size': im.size, 'description': clean(em.get('ImageDescription', {}).get('value'))[:200]})
        if n >= Q.get('per', 4): break
    print(item['id'], n, 'photos')
json.dump(meta, open(f'{OUT}/meta.json', 'w'), indent=1)
