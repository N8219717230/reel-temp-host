#!/usr/bin/env python3
"""Project 4 video builder.  usage: python3 build_video.py <workdir> <story.json>
Builds narration (Kokoro, local), music, map timeline, renders and muxes -> <workdir>/out/video.mp4
story.json schema: see RUNBOOK.md"""
import json, os, subprocess, sys, urllib.request
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(sys.argv[1]); STORY = json.load(open(sys.argv[2]))
os.environ['P4_ROOT'] = ROOT
for d in ['work', 'maps', 'audio', 'out', 'img', 'color', 'fonts', 'models']: os.makedirs(f'{ROOT}/{d}', exist_ok=True)
def sh(*a, **k): subprocess.run(list(a), check=True, **k)
def fetch(url, dst):
    if not os.path.exists(dst) or os.path.getsize(dst) < 1000:
        sh('curl', '-sSL', '-m', '280', '-o', dst, url)
# --- assets
for f in os.listdir(f'{HERE}/fonts'): sh('cp', '-n', f'{HERE}/fonts/{f}', f'{ROOT}/fonts/{f}')
NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
for n in ['ne_50m_land', 'ne_50m_admin_0_countries']: fetch(f'{NE}{n}.geojson', f'{ROOT}/work/{n}.geojson')
if not os.path.exists(f'{ROOT}/maps/world.jpg'): sh('python3', f'{HERE}/make_map.py')
KB = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
for n in ['kokoro-v1.0.int8.onnx', 'voices-v1.0.bin']: fetch(KB + n, f'{ROOT}/models/{n}')
# --- narration, one sentence at a time so timings are exact
from kokoro_onnx import Kokoro
k = Kokoro(f'{ROOT}/models/kokoro-v1.0.int8.onnx', f'{ROOT}/models/voices-v1.0.bin')
SR = 24000; GAP = 0.6; OFF = 2.0
parts, times, t = [], [], 0.0
for s in STORY['sentences']:
    a, sr = k.create(s['text'], voice=STORY.get('voice', 'am_michael'), speed=STORY.get('speed', 0.95), lang='en-us')
    a = np.asarray(a, np.float32); times.append((t, t + len(a) / sr)); parts.append(a); t += len(a) / sr + GAP
    parts.append(np.zeros(int(GAP * sr), np.float32))
vo = np.concatenate(parts); sf.write(f'{ROOT}/audio/vo24.wav', vo, SR)
sh('ffmpeg', '-y', '-loglevel', 'error', '-i', f'{ROOT}/audio/vo24.wav', '-ar', '48000', '-ac', '2', f'{ROOT}/audio/vo.wav')
DUR = round(OFF + times[-1][1] + 5.0, 1)
# --- timeline
subs = [[round(a + OFF - 0.05, 2), round(b + OFF + 0.25, 2), STORY['sentences'][i].get('display', STORY['sentences'][i]['text'])] for i, (a, b) in enumerate(times)]
shots = []
for i, s in enumerate(STORY['sentences']):
    t0 = 0.0 if i == 0 else round(times[i][0] + OFF - 0.3, 2)
    t1 = DUR if i == len(times) - 1 else round(times[i + 1][0] + OFF - 0.3, 2)
    sp = s.get('shot', {})
    if sp.get('img') and (os.path.exists(f"{ROOT}/img/{sp['img']}.jpg") or os.path.exists(f"{ROOT}/color/{sp['img']}.png")):
        d = {'t0': t0, 't1': t1, 'type': 'photo', 'img': sp['img'], 'bw2c': 1.0, 'z': [1.0, 1.1]}
        try:
            from PIL import Image as _I
            _f = f"{ROOT}/img/{sp['img']}.jpg" if os.path.exists(f"{ROOT}/img/{sp['img']}.jpg") else f"{ROOT}/color/{sp['img']}.png"
            _w, _h = _I.open(_f).size
            if sp.get('fit', _w / _h < 1.45): d['fit'] = True   # portrait / narrow images are framed on a blurred backdrop
        except Exception: pass
        if sp.get('rib'): d['rib'] = sp['rib']
    else:
        cam = sp.get('cam', [20, 30, 140]); d = {'t0': t0, 't1': t1, 'type': 'map', 'cam0': cam, 'cam1': sp.get('cam_end', [cam[0], cam[1], cam[2] * 0.8])}
        if sp.get('title'): d['titles'] = [{'text': sp['title'], 'y': 0.07, 'at': 0.6 if i else 2.3}]
        d['pins'] = [dict({'at': 0.8 + 0.7 * j, 'big': False}, **p) for j, p in enumerate(sp.get('pins', []))]
        d['lines'] = [dict({'at': 0.5 + 0.9 * j, 'dur': 1.4}, **l) for j, l in enumerate(sp.get('lines', []))]
        d['glows'] = sp.get('glows', [])
        if i == 0: d['fade_in'] = 2.0
    if i == len(times) - 1: d['fade_out'] = [DUR - 2.5, DUR]
    shots.append(d)
json.dump({'duration': DUR, 'width': 1920, 'height': 1080, 'fps': 30, 'letterbox': True, 'subtitles': True, 'subs': subs, 'shots': shots}, open(f'{ROOT}/timeline.json', 'w'), indent=1)
# --- music + render + mix
env = dict(os.environ, P4_DUR=str(DUR))
sh('python3', f'{HERE}/make_audio.py', env=env)
sh('python3', f'{HERE}/b2n_render.py', ROOT)
fo = DUR - 6
sh('ffmpeg', '-y', '-loglevel', 'error', '-i', f'{ROOT}/audio/vo.wav', '-i', f'{ROOT}/audio/music.wav', '-i', f'{ROOT}/audio/sfx_wind.wav', '-filter_complex',
   f'[0:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay=2000|2000,apad=whole_dur={DUR}[vo];[vo]asplit=2[v1][vsc];'
   f'[1:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{DUR},asetpts=PTS-STARTPTS,afade=t=in:d=3,afade=t=out:st={fo}:d=6,volume=0.55[m];'
   f'[m][vsc]sidechaincompress=threshold=0.02:ratio=8:attack=80:release=600[md];[2:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{DUR},volume=0.2[w];'
   f'[v1][md][w]amix=inputs=3:normalize=0:duration=first,atrim=0:{DUR},loudnorm=I=-14:TP=-1.5:LRA=11[out]', '-map', '[out]', '-ar', '48000', f'{ROOT}/audio/mix.wav')
sh('ffmpeg', '-y', '-loglevel', 'error', '-i', f'{ROOT}/out/video_noaudio.mp4', '-i', f'{ROOT}/audio/mix.wav', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '27', '-maxrate', '4M', '-bufsize', '8M',
   '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', f'{ROOT}/out/video.mp4')
print('DONE', f'{ROOT}/out/video.mp4', DUR)
