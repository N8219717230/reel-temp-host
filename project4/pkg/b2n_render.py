#!/usr/bin/env python3
"""Beginning-To-Now style documentary renderer.
Usage:
  python3 b2n_render.py project_dir                 # full render -> project_dir/out/video_noaudio.mp4
  python3 b2n_render.py project_dir preview 3 9.5   # stills -> project_dir/work/prev/
Reads project_dir/timeline.json. Images: project_dir/color/<name>.png (preferred) or project_dir/img/<name>.jpg.
Map base: project_dir/maps/world.jpg (equirectangular, 2:1). Fonts: project_dir/fonts/{Cinzel,Montserrat,CormorantGaramond}.ttf
"""
import sys, os, json, math, subprocess
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
Image.MAX_IMAGE_PIXELS = None

ROOT = os.path.abspath(sys.argv[1])
TL = json.load(open(f'{ROOT}/timeline.json'))
W, H, FPS = TL.get('width', 1920), TL.get('height', 1080), TL.get('fps', 30)
LETTERBOX = TL.get('letterbox', True)
PH = int(round(W / 2.35)) // 2 * 2 if LETTERBOX else H
TOP = (H - PH) // 2
DUR = float(TL['duration'])
S = W / 1920.0  # scale for fonts/sizes

HI = os.environ.get('P4_LANG', 'en') == 'hi'
def font(name, size, var=None):
    if HI:  # Hindi: Devanagari glyphs need a Devanagari font for every text element
        f = ImageFont.truetype(f'{ROOT}/fonts/NotoSansDevanagari.ttf', int(size * S * 1.05))
        try: f.set_variation_by_axes([700 if var in ('SemiBold', 'Bold') else 500, 100])
        except Exception: pass
        return f
    f = ImageFont.truetype(f'{ROOT}/fonts/{name}.ttf', int(size * S))
    if var:
        try: f.set_variation_by_name(var)
        except Exception: pass
    return f
F_SUB = font('Montserrat', 34, 'SemiBold')
F_LABEL = font('Cinzel', 40, 'SemiBold')
F_LABEL_S = font('Cinzel', 28, 'SemiBold')
F_CARD = font('Cinzel', 120, 'Regular')
F_CAP = font('CormorantGaramond', 54, 'Italic')
F_RIB = font('Montserrat', 26, 'Bold')

def ease(x):
    x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)

def grade(img):
    lum = (img @ np.array([0.299, 0.587, 0.114], np.float32))[..., None]
    img = lum + (img - lum) * 0.88
    img = np.clip(img, 0, 1)
    img = img + 0.10 * (img - 0.5) * (1 - np.abs(2 * img - 1))
    sh = np.clip(1 - lum * 2.2, 0, 1); hi = np.clip((lum - 0.55) * 2.2, 0, 1)
    img = img + sh * np.array([-0.025, 0.010, 0.030], np.float32) + hi * np.array([0.035, 0.012, -0.030], np.float32)
    return np.clip(img * 1.02 - 0.015, 0, 1).astype(np.float32)

yy, xx = np.mgrid[0:PH, 0:W].astype(np.float32)
VIG = (1 - 0.42 * np.clip((((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - PH / 2) / (PH * 0.75)) ** 2) - 0.25, 0, 1.2)).astype(np.float32)[..., None]
rng = np.random.default_rng(7)
GRAIN = [cv2.resize(rng.standard_normal((PH // 2, W // 2)).astype(np.float32), (W, PH))[..., None] * 0.022 for _ in range(6)]

def load(name, crop=None):
    p = f'{ROOT}/color/{name}.png'
    if not os.path.exists(p): p = f'{ROOT}/img/{name}.jpg'
    im = Image.open(p).convert('RGB')
    if crop:
        w, h = im.size
        im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
    return np.asarray(im).astype(np.float32) / 255.0

def cover(a, zmax):
    h, w = a.shape[:2]; s = max(W / w, PH / h) * zmax
    return cv2.resize(a, (int(w * s + .5), int(h * s + .5)), interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC)

def kb(src, p, z0, z1, c0, c1):
    h, w = src.shape[:2]
    z = z0 + (z1 - z0) * p; cx = c0[0] + (c1[0] - c0[0]) * p; cy = c0[1] + (c1[1] - c0[1]) * p
    base = min(w / W, h / PH); rw, rh = min(W * base / z, w), min(PH * base / z, h)
    x0 = np.clip(cx * w - rw / 2, 0, w - rw); y0 = np.clip(cy * h - rh / 2, 0, h - rh)
    M = np.array([[W / rw, 0, -x0 * W / rw], [0, PH / rh, -y0 * PH / rh]], np.float32)
    return cv2.warpAffine(src, M, (W, PH), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

def text_layer(fn):
    im = Image.new('RGBA', (W, PH), (0, 0, 0, 0)); fn(ImageDraw.Draw(im), im)
    return np.asarray(im).astype(np.float32) / 255.0

def comp(base, layer, alpha=1.0):
    if alpha <= 0: return base
    a = layer[..., 3:4] * alpha
    return base * (1 - a) + layer[..., :3] * a

def ribbon(name, sub=None):
    def fn(d, im):
        tw = d.textlength(name, font=F_RIB); bx = (W - tw) / 2; by = PH - 140 * S; pad = 22 * S
        d.rectangle((bx - pad, by - 10 * S, bx + tw + pad, by + 40 * S), fill=(150, 20, 22, 235))
        d.text((bx, by), name, font=F_RIB, fill=(255, 255, 255, 255))
        if sub:
            sw = d.textlength(sub, font=F_LABEL_S)
            d.rectangle((bx + tw / 2 - sw / 2 - 14 * S, by + 44 * S, bx + tw / 2 + sw / 2 + 14 * S, by + 86 * S), fill=(10, 10, 10, 190))
            d.text((bx + tw / 2 - sw / 2, by + 48 * S), sub, font=F_LABEL_S, fill=(240, 232, 215, 255))
    return text_layer(fn)

def label_layer(items):
    def fn(d, im):
        for text, x, y, f, al, fill in items:
            if al <= 0: continue
            tw = d.textlength(text, font=f)
            sh = Image.new('RGBA', (W, PH), (0, 0, 0, 0))
            ImageDraw.Draw(sh).text((x - tw / 2 + 2, y + 3), text, font=f, fill=(0, 0, 0, int(200 * al)))
            im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(4)))
            d.text((x - tw / 2, y), text, font=f, fill=tuple(fill[:3]) + (int(255 * al),))
    return text_layer(fn)

# ---------------- map (equirectangular world image, lon/lat in degrees)
WORLD = None
def world():
    global WORLD
    if WORLD is None:
        a = cv2.cvtColor(cv2.imread(f'{ROOT}/maps/world.jpg'), cv2.COLOR_BGR2RGB)
        WORLD = a
    return WORLD

def map_frame(sh, lt):
    src = world(); h, w = src.shape[:2]
    dur = sh['t1'] - sh['t0']; e = ease(lt / dur)
    c0, c1 = sh['cam0'], sh['cam1']          # [lon, lat, width_in_degrees]
    lon = c0[0] + (c1[0] - c0[0]) * e; lat = c0[1] + (c1[1] - c0[1]) * e
    wd = c0[2] * (c1[2] / c0[2]) ** e; hd = wd * PH / W
    ppd = w / 360.0
    x0 = (lon - wd / 2 + 180) * ppd; y0 = (90 - (lat + hd / 2)) * ppd
    sx = W / (wd * ppd)
    M = np.array([[sx, 0, -x0 * sx], [0, sx, -y0 * sx]], np.float32)
    img = cv2.warpAffine(src, M, (W, PH), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE).astype(np.float32) / 255.0
    blur = cv2.GaussianBlur(img, (0, 0), 2.0); img = np.clip(img + (img - blur) * 0.5, 0, 1)
    lum = (img @ np.array([0.299, 0.587, 0.114], np.float32))[..., None]
    img = grade((lum + (img - lum) * 0.75) * 0.80)
    img = img * ease(lt / sh.get('fade_in', 0.01))
    def P(lo, la): return ((lo - (lon - wd / 2)) / wd * W, ((lat + hd / 2) - la) / hd * PH)
    pxdeg = W / wd
    items = []
    for g in sh.get('glows', []):
        a = ease((lt - g.get('at', 0)) / 0.8)
        if a <= 0: continue
        x, y = P(g['lon'], g['lat']); r = g.get('r_deg', 3) * pxdeg * (0.6 + 0.4 * a)
        gg = np.exp(-(((xx - x) ** 2 + (yy - y) ** 2) / (2 * (r * 0.55) ** 2)))[..., None]
        al = np.clip(gg * 1.4, 0, 0.62) * a * g.get('alpha', 0.95)
        img = img * (1 - al) + np.array(g.get('color', [0.85, 0.18, 0.12]), np.float32) * al
        if g.get('label'): items.append((g['label'], x, y - 18 * S, F_LABEL_S, a, (255, 250, 240)))
    for ln in sh.get('lines', []):
        pr = ease((lt - ln.get('at', 0)) / ln.get('dur', 0.6))
        if pr <= 0: continue
        xa, ya = P(*ln['from']); xb, yb = P(*ln['to'])
        cv2.line(img, (int(xa), int(ya)), (int(xa + (xb - xa) * pr), int(ya + (yb - ya) * pr)), tuple(ln.get('color', [1, .55, .45])), max(2, int(3 * S)), cv2.LINE_AA)
    dots = []
    for p in sh.get('pins', []):
        a = ease((lt - p.get('at', 0)) / 0.5)
        if a <= 0: continue
        x, y = P(p['lon'], p['lat'])
        if p.get('glow', True):
            r = 60 * S * (1 + 0.12 * math.sin(lt * 5)); gg = np.exp(-(((xx - x) ** 2 + (yy - y) ** 2) / (2 * (r * 0.55) ** 2)))[..., None]
            al = np.clip(gg * 1.4, 0, 0.62) * a * 0.8
            img = img * (1 - al) + np.array(p.get('color', [1.0, 0.3, 0.15]), np.float32) * al
        items.append((p['name'], x, y - (80 if p.get('big', True) else 46) * S, F_LABEL if p.get('big', True) else F_LABEL_S, a, (255, 245, 230)))
        if p.get('sub'): items.append((p['sub'], x, y + 34 * S, F_LABEL_S, ease((lt - p.get('sub_at', p.get('at', 0) + 1)) / 0.6), (230, 205, 160)))
        dots.append((x, y, a))
    for t in sh.get('titles', []):
        items.append((t['text'], W * t.get('x', 0.5), PH * t.get('y', 0.05), F_CARD if t.get('size') == 'big' else F_LABEL_S, ease((lt - t.get('at', 0)) / 0.8), tuple(t.get('color', [235, 225, 205]))))
    img = comp(img, label_layer(items))
    for x, y, a in dots:
        cv2.circle(img, (int(x), int(y)), int(9 * S), (1.0, 0.95, 0.88), -1, cv2.LINE_AA)
        cv2.circle(img, (int(x), int(y)), int(9 * S), (0.5, 0.08, 0.06), max(2, int(3 * S)), cv2.LINE_AA)
    return img

# ---------------- shots
CACHE = {}
def prep(i, s):
    if i in CACHE: return CACHE[i]
    d = {}
    if s['type'] == 'photo':
        a = load(s['img'], s.get('crop'))
        z = s.get('z', [1.0, 1.06]); zmax = max(z) * 1.02
        if s.get('fit'):  # portrait: blurred background + framed print
            h0, w0 = a.shape[:2]
            bg = cover(a, 1.0); bh, bw = bg.shape[:2]
            bg = cv2.GaussianBlur(bg[(bh - PH) // 2:(bh - PH) // 2 + PH, (bw - W) // 2:(bw - W) // 2 + W], (0, 0), 30) * 0.45
            sc = PH * 0.96 / h0; fg = cv2.resize(a, (int(w0 * sc), int(h0 * sc)), interpolation=cv2.INTER_AREA)
            fh, fw = fg.shape[:2]; x0 = (W - fw) // 2; y0 = (PH - fh) // 2
            bg[y0:y0 + fh, x0:x0 + fw] = fg
            cv2.rectangle(bg, (x0 - 2, y0 - 2), (x0 + fw + 1, y0 + fh + 1), (0.85, 0.80, 0.70), 2)
            a = bg
        col = grade(cover(a, zmax))
        lum = col @ np.array([0.299, 0.587, 0.114], np.float32)
        d.update(col=col, bw=np.repeat(lum[..., None], 3, 2) * np.array([1.0, 0.985, 0.95], np.float32), z=z)
        if s.get('rib'): d['rib'] = ribbon(*s['rib'])
        if s.get('parallax'):
            m = np.zeros((PH, W), np.float32); m[int(PH * 0.62):] = 1
            d['fgmask'] = cv2.GaussianBlur(m, (0, 0), PH * 0.06)[..., None]
    elif s['type'] == 'card':
        def fn(dr, im):
            bw_ = dr.textlength(s['big'], font=F_CARD)
            dr.text(((W - bw_) / 2, PH / 2 - 150 * S), s['big'], font=F_CARD, fill=(242, 236, 222, 255))
            if s.get('cap'):
                cw = dr.textlength(s['cap'], font=F_CAP)
                dr.text(((W - cw) / 2, PH / 2 + 36 * S), s['cap'], font=F_CAP, fill=(200, 188, 160, 255))
            dr.rectangle((W / 2 - 160 * S, PH / 2 + 18 * S, W / 2 + 160 * S, PH / 2 + 20 * S), fill=(180, 150, 90, 255))
        d['layer'] = text_layer(fn)
    CACHE[i] = d
    return d

def render_photo(s, lt, d):
    p = lt / (s['t1'] - s['t0']); z0, z1 = d['z']; c = s.get('c', [[.5, .5], [.5, .5]])
    col = kb(d['col'], p, z0, z1, c[0], c[1])
    f = 1.0 if s.get('bw2c') is None else ease((lt - s['bw2c']) / 1.1)
    if f < 1: col = kb(d['bw'], p, z0, z1, c[0], c[1]) * (1 - f) + col * f
    if s.get('parallax'):
        c0 = (c[0][0] + .02, c[0][1]); c1 = (c[1][0] - .02, c[1][1])
        fg = kb(d['col'], p, z0, z1 + .06, c0, c1)
        if f < 1: fg = kb(d['bw'], p, z0, z1 + .06, c0, c1) * (1 - f) + fg * f
        col = col * (1 - d['fgmask']) + fg * d['fgmask']
    if 'rib' in d: col = comp(col, d['rib'], ease((lt - s.get('rib_at', 0.15)) / 0.35))
    return col

def render_card(s, lt, d):
    dur = s['t1'] - s['t0']
    a = ease((lt - 0.15) / 0.45) * (1 if s.get('hold') else 1 - ease((lt - (dur - 0.35)) / 0.3))
    return comp(np.zeros((PH, W, 3), np.float32), d['layer'], a)

SUBL = {}
def sub_layer(text):
    if text in SUBL: return SUBL[text]
    bh = max(H - TOP - PH, int(120 * S))
    im = Image.new('RGBA', (W, bh), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    lines, cur = [], ''
    for wd in text.split():
        tr = (cur + ' ' + wd).strip()
        if d.textlength(tr, font=F_SUB) > 1500 * S: lines.append(cur); cur = wd
        else: cur = tr
    lines.append(cur); lh = 42 * S; y = (bh - lh * len(lines)) / 2 - 2
    for ln in lines:
        if not LETTERBOX:  # no bar: add a soft shadow so text reads over the picture
            d.text(((W - d.textlength(ln, font=F_SUB)) / 2 + 2, y + 2), ln, font=F_SUB, fill=(0, 0, 0, 200))
        d.text(((W - d.textlength(ln, font=F_SUB)) / 2, y), ln, font=F_SUB, fill=(255, 255, 255, 255)); y += lh
    SUBL[text] = np.asarray(im).astype(np.float32) / 255.0
    return SUBL[text]

def frame(t):
    pic = np.zeros((PH, W, 3), np.float32)
    for i, s in enumerate(TL['shots']):
        if s['t0'] <= t < s['t1']:
            lt = t - s['t0']; d = prep(i, s)
            if s['type'] == 'photo': pic = render_photo(s, lt, d)
            elif s['type'] == 'card': pic = render_card(s, lt, d)
            elif s['type'] == 'map': pic = map_frame(s, lt)
            if s.get('fade_out'):
                a, b = s['fade_out']; pic = pic * (1 - ease((t - a) / (b - a)))
            break
    pic = pic * VIG + GRAIN[int(t * FPS) % len(GRAIN)] * (pic.mean() > 0.01)
    out = np.zeros((H, W, 3), np.float32); out[TOP:TOP + PH] = np.clip(pic, 0, 1)
    if TL.get('subtitles', True):
        for a, b, txt in TL.get('subs', []):
            if a <= t < b:
                L = sub_layer(txt); al = min(1.0, (t - a) / 0.12, (b - t) / 0.12)
                y0 = TOP + PH if LETTERBOX else H - L.shape[0] - int(30 * S)
                reg = out[y0:y0 + L.shape[0]]
                out[y0:y0 + L.shape[0]] = reg * (1 - L[..., 3:4] * al) + L[..., :3] * L[..., 3:4] * al
    return (out * 255 + 0.5).astype(np.uint8)

if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[2] == 'preview':
        os.makedirs(f'{ROOT}/work/prev', exist_ok=True)
        for t in [float(x) for x in sys.argv[3:]]:
            Image.fromarray(frame(t)).save(f'{ROOT}/work/prev/f_{t:06.2f}.jpg', quality=85)
        sys.exit()
    os.makedirs(f'{ROOT}/out', exist_ok=True)
    out = f'{ROOT}/out/video_noaudio.mp4'
    p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
    n = int(DUR * FPS)
    for i in range(n):
        p.stdin.write(frame(i / FPS).tobytes())
        if i % 150 == 0: print(f'{i}/{n}', flush=True)
    p.stdin.close(); p.wait(); print('done', out)
