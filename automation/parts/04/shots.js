// Part 4: Dasharatha decides to crown Rama; Manthara and Kaikeyi; the two boons; Rama accepts the forest.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

import { NIGHT, GROUND, nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, cutAt, pop, boulder, hut, forest, sparkles, bow, stand } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);
  const hall = () => { K.hall(); };
  const SHAT = '#9A5B2E';

  // 1 · four brothers return to Ayodhya
  { const st = 0, vv = Wd('विवाह', 0) - st, ay = Wd('अयोध्या', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Ayodhya palace, four princes walk home', draw(lt, d, t) {
      dayPage(21); tree(110, 1340, 0.9); ground(1340, P.land); palace(830, 1340, 0.9, t);
      const w = eio(clamp(lt / 2.6)), dx = w * 150;
      [[P.royal, 40], [P.wine, 150], [P.green, 260], [SHAT, 370]].forEach((c, i) => prince(c[1] + dx - 60, 1500, 470, c[0], 1, 0));
      K.slip('विवाह के बाद', 330, 640, pop(lt, vv, 0.35), -0.03, 56);
      K.ribbon('अयोध्या', 540, 340, pop(lt, ay, 0.4), 110);
    } });
    cue(0.1, 'whoosh'); cue(st + vv, 'pop', { gain: 0.5 }); cue(st + ay, 'pop'); }

  // 2 · Dasharatha decides to crown Rama
  { const st = st_(1), ds = Wd('दशरथ', 1) - st, rj = Wd('राजा', 1) - st, ns = Wd('निश्चय', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'hall: king gestures to Rama, gold crown floats above Rama', draw(lt, d, t) {
      hall(); K.figure({ x: 200, y: 1500, h: 700, role: 'king', arm: 30 }); prince(620, 1500, 600, P.royal, -1, 0);
      const c = pop(lt, rj + 0.4, 0.5); if (c > 0) crown(620, 740 + (1 - c) * -120 - 30 * Math.sin(lt * 2), 1.0 * c);
      K.slip('राजा दशरथ', 300, 450, pop(lt, ds, 0.35), -0.03, 56);
      const p = pop(lt, ns, 0.4); if (p > 0) K.ribbon('निश्चय', 640, 270, p, 100);
    } });
    cue(st, 'whoosh'); cue(st + ds, 'pop'); cue(st + rj + 0.4, 'sparkle', { dur: 0.8 }); cue(st + ns, 'thud', { gain: 0.5 }); }

  // 3 · Ayodhya celebrates
  { const st = st_(2), ay = Wd('अयोध्या', 2) - st, kh = Wd('खुशी', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: palace with flags and sparkles', draw(lt, d, t) {
      dayPage(23); ground(1360, P.land); tree(100, 1360, 1.0); tree(980, 1360, 1.0); palace(540, 1360, 1.15, t);
      for (const x of [220, 860]) flame(x, 1330, 0.9, t, x);
      if (lt > kh - 0.2) { sparkles(300, 800, lt, 8, 220); sparkles(780, 800, lt + 1, 8, 220); }
      K.ribbon('अयोध्या', 540, 340, pop(lt, ay, 0.4), 110);
    } });
    cue(st, 'whoosh'); cue(st + ay, 'pop'); cue(st + kh, 'sparkle', { dur: 1.2 }); }

  // 4 · Manthara whispers to Kaikeyi
  { const st = st_(3), kk = Wd('कैकेयी', 3) - st, mn = Wd('मंथरा', 3) - st, kn = Wd('कान', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'night hall: queen Kaikeyi and Manthara (worker) whispering, smoke puff', draw(lt, d, t) {
      nightPage(41, 0.7); ground(1380, GROUND);
      K.figure({ x: 270, y: 1500, h: 720, role: 'queen', arm: 0 });
      K.figure({ x: 700, y: 1500, h: 560, role: 'worker', dir: -1, arm: 40 + Math.sin(lt * 4) * 6 });
      K.slip('रानी कैकेयी', 300, 380, pop(lt, kk, 0.35), -0.03, 56);
      K.slip('मंथरा', 760, 560, pop(lt, mn, 0.35), 0.03, 58);
      const p = pop(lt, kn, 0.4); if (p > 0) smoke(520, 880 - 20 * p, 0.7 * p, 0.9);
    } });
    cue(st, 'whoosh'); cue(st + kk, 'pop'); cue(st + mn, 'pop'); cue(st + kn, 'thud', { gain: 0.4 }); }

  // 5 · two boons remembered
  { const st = st_(4), kk = Wd('कैकेयी', 4) - st, dv = Wd('दो', 4) - st, vr = Wd('वरदान', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.1, note: 'two gold seals glow above Kaikeyi', draw(lt, d, t) {
      nightPage(5, 0.75); ground(1380, GROUND);
      K.figure({ x: 540, y: 1500, h: 700, role: 'queen', arm: 20 });
      const a = pop(lt, dv, 0.4); if (a > 0) { K.seal(300, 760, 0.9 * a, '१'); K.seal(780, 760, 0.9 * a, '२'); }
      K.slip('कैकेयी', 540, 330, pop(lt, kk, 0.35), -0.03, 60);
      const p = pop(lt, vr, 0.4); if (p > 0) K.ribbon('दो वरदान', 540, 1130, p, 100);
    } });
    cue(st, 'whoosh'); cue(st + kk, 'pop', { gain: 0.5 }); cue(st + dv, 'thud', { gain: 0.7 }); cue(st + vr, 'pop'); }

  // 6 · first boon: Bharata king
  { const st = st_(5), ph = Wd('पहला', 5) - st, bh = Wd('भरत', 5) - st, rg = Wd('राजगद्दी', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'hall: Bharata (green) by the throne, crown', draw(lt, d, t) {
      hall(); prince(250, 1500, 600, P.green, 1, 0);
      const c = pop(lt, rg - 0.1, 0.5); if (c > 0) crown(540, 860, 0.9 * c);
      K.slip('पहला वर', 300, 380, pop(lt, ph, 0.35), -0.03, 62);
      K.slip('भरत', 760, 560, pop(lt, bh, 0.35), 0.03, 62);
      const p = pop(lt, rg, 0.4); if (p > 0) K.ribbon('राजगद्दी', 540, 1120 - 700 + 80, p, 100);
    } });
    cue(st, 'whoosh'); cue(st + ph, 'pop'); cue(st + bh, 'pop', { gain: 0.6 }); cue(st + rg, 'thud', { gain: 0.6 }); }

  // 7 · second boon: fourteen years in the forest
  { const st = st_(6), ds = Wd('दूसरा', 6) - st, ch = Wd('चौदह', 6) - st, vn = Wd('वनवास', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Rama walks to the forest, seal १४', draw(lt, d, t) {
      dayPage(27); ground(1380, P.land); forest(t, 0.7, 1380);
      const w = eio(clamp(lt / 3.2)); prince(lerp(150, 560, w), 1500, 600, P.royal, 1, 0);
      K.slip('दूसरा वर', 300, 340, pop(lt, ds, 0.35), -0.03, 60);
      const s = pop(lt, ch, 0.4); if (s > 0) K.seal(780, 560, 0.95 * s, '१४');
      const p = pop(lt, vn, 0.4); if (p > 0) K.ribbon('वनवास', 540, 880, p, 110);
    } });
    cue(st, 'whoosh'); cue(st + ds, 'pop', { gain: 0.6 }); cue(st + ch, 'thud', { gain: 0.8 }); cue(st + vn, 'pop'); }

  // 8 · Dasharatha broken with grief
  { const st = st_(7), ds = Wd('दशरथ', 7) - st, dk = Wd('दुख', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.1, note: 'night: king alone, crown fallen on the floor', draw(lt, d, t) {
      nightPage(81, 0.85); ground(1380, GROUND);
      K.figure({ x: 540, y: 1500, h: 640, role: 'king', arm: -10 });
      ctx.save(); ctx.translate(0, 0); crown(800, 1470, 0.7); ctx.restore();
      K.slip('दशरथ', 540, 380, pop(lt, ds, 0.35), -0.03, 70);
      const p = pop(lt, dk, 0.4); if (p > 0) { K.ribbon('दुख', 540, 640, p, 110); smoke(780, 840, 0.6 * p, 0.6); }
    } });
    cue(st, 'whoosh'); cue(st + ds, 'pop', { gain: 0.6 }); cue(st + dk, 'thud', { gain: 0.6 }); }

  // 9 · Rama accepts, smiling
  { const st = st_(8), rm = Wd('राम', 8) - st, vc = Wd('वचन', 8) - st, sv = Wd('स्वीकार', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Dasharatha (left) and Rama walking to forest edge', draw(lt, d, t) {
      dayPage(29); ground(1380, P.land); forest(t, 1, 1380);
      K.figure({ x: 130, y: 1500, h: 620, role: 'king', arm: 10 });
      const w = eio(clamp((lt - 0.4) / 3.0)); prince(lerp(430, 700, w), 1500, 600, P.royal, 1, 0);
      K.slip('राम', 300, 340, pop(lt, rm, 0.35), -0.03, 64);
      K.slip('पिता का वचन', 760, 540, pop(lt, vc, 0.35), 0.03, 54);
      const p = pop(lt, sv, 0.4); if (p > 0) K.ribbon('स्वीकार', 540, 820, p, 110);
      if (lt > sv) sparkles(700, 1000, lt - sv, 8, 260);
    } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.6 }); cue(st + vc, 'pop'); cue(st + sv, 'sparkle', { dur: 1 }); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal ५, teaser slip', draw(lt, d, t) {
      nightPage(11, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '५');
      K.slip('अगला भाग: वनवास की यात्रा', 540, 1330, pop(lt, bh, 0.3), 0.02, 56);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
