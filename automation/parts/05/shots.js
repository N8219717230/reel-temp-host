// Part 5: exile journey (Guha, Ganga, Chitrakoot), Dasharatha's passing, Bharata refuses the throne and carries Rama's sandals.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

import { NIGHT, GROUND, nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, cutAt, pop, boulder, hut, forest, sparkles, bow, stand, boat, hills, paduka, throne } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);
  const hall = () => { K.hall(); };

  // 1 · three leave Ayodhya for the forest
  { const st = 0, rm = Wd('राम', 0) - st, lk = Wd('लक्ष्मण', 0) - st, vn = Wd('वन', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: palace far left, Rama, Sita, Lakshmana walk toward forest', draw(lt, d, t) {
      dayPage(31); ground(1360, P.land); forest(t, 0.6, 1360); palace(150, 1360, 0.6, t);
      const w = eio(clamp(lt / 3.2)), dx = w * 230;
      prince(380 + dx, 1500, 520, P.royal, 1, 0); K.figure({ x: 560 + dx, y: 1500, h: 480, role: 'queen' }); prince(720 + dx, 1500, 520, P.wine, 1, 0);
      K.slip('राम, सीता', 340, 420, pop(lt, rm, 0.35), -0.03, 58);
      K.slip('लक्ष्मण', 760, 560, pop(lt, lk, 0.35), 0.03, 58);
      const p = pop(lt, vn, 0.4); if (p > 0) K.ribbon('वन', 540, 760, p, 120);
    } });
    cue(0.1, 'whoosh'); cue(st + rm, 'pop', { gain: 0.6 }); cue(st + lk, 'pop'); cue(st + vn, 'thud', { gain: 0.5 }); }

  // 2 · Guha ferries them across the Ganga
  { const st = st_(1), gg = Wd('गंगा', 1) - st, gh = Wd('गुह', 1) - st, pr = Wd('पार', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: boat on the Ganga carrying the three, Guha at the oar', draw(lt, d, t) {
      dayPage(33); ground(1020, P.land); tree(90, 1020, 0.8); tree(990, 1020, 0.8); river(t, 1100);
      const bx = lerp(250, 760, eio(clamp(lt / 2.4))), by = 1290 + Math.sin(t * 2) * 8;
      boat(bx, by, 1.05);
      K.figure({ x: bx - 190, y: by - 20, h: 400, role: 'sailor' }); prince(bx - 70, by - 20, 400, P.royal, 1, 0); K.figure({ x: bx + 40, y: by - 20, h: 380, role: 'queen' }); prince(bx + 150, by - 20, 400, P.wine, 1, 0);
      K.ribbon('गंगा', 540, 340, pop(lt, gg, 0.4), 120);
      K.slip('निषादराज गुह', 330, 600, pop(lt, gh, 0.35), -0.03, 54);
      const p = pop(lt, pr, 0.4); if (p > 0) K.slip('पार', 800, 790, p, 0.03, 70);
    } });
    cue(st, 'whoosh'); cue(st + gg, 'pop'); cue(st + gh, 'pop', { gain: 0.6 }); cue(st + pr, 'thud', { gain: 0.5 }); }

  // 3 · Chitrakoot hut
  { const st = st_(2), ct = Wd('चित्रकूट', 2) - st, ku = Wd('कुटिया', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: hills of Chitrakoot, leaf hut appears, the three beside it', draw(lt, d, t) {
      dayPage(35); hills(1160, ['#8E9B66', '#6F8250']); ground(1360, P.land); tree(90, 1360, 1.1); tree(990, 1360, 1.0);
      const h = pop(lt, ku, 0.5); if (h > 0) hut(720, 1360, 1.05 * h);
      prince(240, 1500, 520, P.royal, 1, 0); K.figure({ x: 400, y: 1500, h: 480, role: 'queen' }); prince(540, 1500, 520, P.wine, 1, 0);
      K.ribbon('चित्रकूट', 540, 330, pop(lt, ct, 0.4), 110);
      K.slip('कुटिया', 800, 560, pop(lt, ku, 0.35), 0.03, 60);
    } });
    cue(st, 'whoosh'); cue(st + ct, 'pop'); cue(st + ku, 'thud', { gain: 0.6 }); }

  // 4 · Dasharatha passes away (gentle): the lamp goes out
  { const st = st_(3), ud = Wd('उधर', 3) - st, vi = Wd('वियोग', 3) - st, ds = Wd('दशरथ', 3) - st, cb = Wd('चल', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.1, note: 'night: king beside a lamp, lamp goes out, crown rests alone', draw(lt, d, t) {
      nightPage(47, 0.85); ground(1380, GROUND);
      K.figure({ x: 380, y: 1500, h: 640, role: 'king', arm: -10 });
      if (lt < cb) flame(780, 1330, 1.1, t, 3); else { smoke(780, 1180 - 60 * eo(clamp((lt - cb) / 1.5)), 0.6, 0.8 * (1 - clamp((lt - cb) / 2))); }
      cut(P_rr(740, 1330, 80, 40, 10), P.gold, { shadow: 0.5, edge: 3 });
      const c = pop(lt, ds, 0.4); if (c > 0) crown(620, 1480, 0.55 * c);
      K.slip('उधर', 280, 330, pop(lt, ud, 0.35), -0.03, 62);
      K.slip('राजा दशरथ', 780, 430, pop(lt, ds, 0.35), 0.03, 56);
      const p = pop(lt, vi, 0.4); if (p > 0) K.ribbon('वियोग', 540, 640, p, 110);
    } });
    cue(st, 'whoosh'); cue(st + ud, 'pop', { gain: 0.5 }); cue(st + vi, 'pop'); cue(st + cb, 'thud', { gain: 0.5 }); }

  // 5 · Bharata returns from his maternal home
  { const st = st_(4), nn = Wd('ननिहाल', 4) - st, bh = Wd('भरत', 4) - st, dk = Wd('दुखी', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Bharata (green) walks home toward the palace, slips', draw(lt, d, t) {
      dayPage(37); ground(1360, P.land); tree(980, 1360, 1.0); palace(260, 1360, 0.85, t);
      const w = eio(clamp(lt / 3.0)); prince(lerp(1000, 640, w), 1500, 560, P.green, -1, 0);
      K.slip('ननिहाल से', 760, 330, pop(lt, nn, 0.35), 0.03, 58);
      K.slip('भरत', 330, 500, pop(lt, bh, 0.35), -0.03, 64);
      const p = pop(lt, dk, 0.4); if (p > 0) { K.ribbon('दुखी', 600, 650, p, 110); smoke(660, 790, 0.45 * p, 0.7); }
    } });
    cue(st, 'whoosh'); cue(st + nn, 'pop', { gain: 0.6 }); cue(st + bh, 'pop'); cue(st + dk, 'thud', { gain: 0.5 }); }

  // 6 · Bharata refuses the crown
  { const st = st_(5), rg = Wd('राजगद्दी', 5) - st, mn = Wd('मना', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'hall: crown above the throne slides away as Bharata raises a hand', draw(lt, d, t) {
      hall(); prince(240, 1500, 600, P.green, 1, 0);
      const c = pop(lt, rg - 0.1, 0.5); const m = eio(clamp((lt - mn) / 0.9));
      if (c > 0) crown(lerp(540, 940, m), lerp(800, 880, m), 0.95 * c);
      K.slip('राजगद्दी', 540, 330, pop(lt, rg, 0.35), -0.03, 66);
      const p = pop(lt, mn, 0.4); if (p > 0) K.ribbon('मना', 760, 470, p, 120);
    } });
    cue(st, 'whoosh'); cue(st + rg, 'pop'); cue(st + mn, 'thud', { gain: 0.6 }); }

  // 7 · Bharata goes to Chitrakoot and asks Rama to return
  { const st = st_(6), bh = Wd('भरत', 6) - st, ct = Wd('चित्रकूट', 6) - st, pa = Wd('प्रार्थना', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Chitrakoot hills, Bharata walks to Rama beside the hut', draw(lt, d, t) {
      dayPage(39); hills(1160, ['#8E9B66', '#6F8250']); ground(1360, P.land); tree(980, 1360, 1.0); hut(880, 1360, 0.8);
      const w = eio(clamp(lt / 3.0)); prince(lerp(60, 380, w), 1500, 560, P.green, 1, 0); prince(640, 1500, 560, P.royal, -1, 0);
      K.slip('भरत', 260, 420, pop(lt, bh, 0.35), -0.03, 62);
      K.ribbon('चित्रकूट', 540, 280, pop(lt, ct, 0.4), 100);
      const p = pop(lt, pa, 0.4); if (p > 0) K.slip('प्रार्थना', 740, 760, p, 0.03, 66);
    } });
    cue(st, 'whoosh'); cue(st + bh, 'pop', { gain: 0.6 }); cue(st + ct, 'pop'); cue(st + pa, 'sparkle', { dur: 0.8 }); }

  // 8 · Rama keeps father's word
  { const st = st_(7), rm = Wd('राम', 7) - st, vc = Wd('वचन', 7) - st, mn = Wd('मना', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Rama (blue) calm, Bharata (green) bows, seal of word', draw(lt, d, t) {
      dayPage(41); hills(1160, ['#8E9B66', '#6F8250']); ground(1360, P.land); tree(980, 1360, 1.0); hut(880, 1360, 0.8);
      prince(640, 1500, 580, P.royal, -1, 0); prince(330, 1500, 540, P.green, 1, 14 * Math.sin(lt * 1.5));
      K.slip('राम', 780, 420, pop(lt, rm, 0.35), 0.03, 64);
      K.slip('पिता का वचन', 330, 600, pop(lt, vc, 0.35), -0.03, 54);
      const s = pop(lt, vc + 0.2, 0.4); if (s > 0) K.seal(800, 610, 0.8 * s, 'व');
      const p = pop(lt, mn, 0.4); if (p > 0) K.ribbon('मना', 540, 770, p, 110);
    } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.6 }); cue(st + vc, 'thud', { gain: 0.7 }); cue(st + mn, 'pop'); }

  // 9 · Bharata carries the sandals and rules in Rama's name
  { const st = st_(8), bh = Wd('भरत', 8) - st, pd = Wd('पादुकाएँ', 8) - st, sn = Wd('सिंहासन', 8) - st, ch = Wd('चलाया', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'hall: Bharata brings the sandals, they rest on the throne, glow', draw(lt, d, t) {
      hall();
      const w = eio(clamp((lt - pd) / 1.6)), placed = lt > sn;
      prince(lerp(900, 330, w), 1500, 560, P.green, -1, 0);
      if (!placed) paduka(lerp(860, 400, w), lerp(1200, 1260, w) - 60, 0.7, 0.6); else paduka(540, 1180, 0.7, 0.9 * pop(lt, sn, 0.5));
      K.slip('भरत', 280, 340, pop(lt, bh, 0.35), -0.03, 64);
      const a = pop(lt, pd, 0.4); if (a > 0) K.slip('राम की पादुकाएँ', 760, 460, a, 0.03, 52);
      const p = pop(lt, sn, 0.4); if (p > 0) K.ribbon('सिंहासन', 540, 640, p, 100);
      if (lt > ch) sparkles(540, 1000, lt - ch, 8, 260);
    } });
    cue(st, 'whoosh'); cue(st + bh, 'pop', { gain: 0.6 }); cue(st + pd, 'pop'); cue(st + sn, 'thud', { gain: 0.7 }); cue(st + ch, 'sparkle', { dur: 1 }); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal ६, teaser slip', draw(lt, d, t) {
      nightPage(11, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '६');
      K.slip('अगला भाग: दंडक वन', 540, 1330, pop(lt, bh, 0.3), 0.02, 56);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
