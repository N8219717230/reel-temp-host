#!/usr/bin/env python3
"""usage: make_cover.py <photo.jpg> "TITLE LINE" "SUBTITLE LINE" <out.jpg>  -> 1280x720 YouTube cover"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); photo, title, sub, out = sys.argv[1:5]
W, H = 1280, 720
bg = Image.open(photo).convert('RGB'); r = max(W / bg.width, H / bg.height); bg = bg.resize((int(bg.width * r), int(bg.height * r)), Image.LANCZOS)
bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
a = np.asarray(bg).astype(float); g = np.clip((np.linspace(0, 1, H) - 0.35) / 0.65, 0, 1)[:, None, None] ** 1.2
im = Image.fromarray((a * (1 - 0.88 * g) * 0.92).astype('uint8')); d = ImageDraw.Draw(im)
size = 124
while True:
    fT = ImageFont.truetype(f'{HERE}/fonts/Cinzel.ttf', size)
    if d.textlength(title, font=fT) < W - 140 or size < 60: break
    size -= 6
fS = ImageFont.truetype(f'{HERE}/fonts/Montserrat.ttf', 40)
try: fS.set_variation_by_axes([700])
except Exception: pass
def txt(t, y, f, fill, st):
    w = d.textlength(t, font=f); d.text(((W - w) / 2, y), t, font=f, fill=fill, stroke_width=st, stroke_fill=(0, 0, 0))
txt(title, 455, fT, (247, 238, 218), 4); d.rectangle((W / 2 - 190, 598, W / 2 + 190, 602), fill=(205, 165, 85)); txt(sub, 626, fS, (240, 222, 180), 2)
im.save(out, quality=92)
