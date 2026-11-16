// Part 3: Mithila, Shiva's bow, Sita's swayamvara, the four weddings.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

import { NIGHT, GROUND, nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, cutAt, pop, boulder, hut, forest, sparkles, bow, stand } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);
  const hall = () => { K.hall(); };

  // 1 · arrival at Mithila
  { const st = 0, mt = Wd('मिथिला', 0) - st, rm = Wd('राम', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Mithila palace, three travellers walk in, slip', draw(lt, d, t) {
      dayPage(1); tree(960, 1340, 0.9); ground(1340, P.land); palace(760, 1340, 1.0, t);
      const w = eio(clamp(lt / 2.6)), dx = w * 330;
      K.figure({ x: 60 + dx, y: 1500, h: 580, role: 'scholar', dir: 1, walk: lt * 6 }); prince(210 + dx, 1500, 480, P.royal, 1, 0); prince(340 + dx, 1500, 480, P.wine, 1, 0);
      K.slip('राम', 300, 700, pop(lt, rm, 0.3), -0.03, 52);
      K.ribbon('मिथिला', 540, 340, pop(lt, mt, 0.4), 110);
    } });
    cue(0.1, 'whoosh'); cue(st + rm, 'pop', { gain: 0.5 }); cue(st + mt, 'pop'); }

  // 2 · Janaka and Shiva's bow
  { const st = st_(1), rj = Wd('राजा', 1) - st, sh = Wd('शिव', 1) - st, dh = Wd('धनुष', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'hall: King Janaka beside a stand with the great bow', draw(lt, d, t) {
      hall(); K.figure({ x: 190, y: 1500, h: 700, role: 'king', arm: 4 });
      stand(660, 1430, 1.0); const p = pop(lt, dh - 0.3, 0.5); bow(660, 1010 + (1 - p) * 150, 1.05 * Math.max(p, 0.01), 0, 0.5 * p, -Math.PI / 2);
      K.slip('राजा जनक', 300, 380, pop(lt, rj, 0.35), -0.03, 56);
      K.slip('शिव का धनुष', 700, 560, pop(lt, sh, 0.35), 0.03, 58);
    } });
    cue(st, 'whoosh'); cue(st + rj, 'pop'); cue(st + sh, 'pop'); cue(st + dh, 'thud', { gain: 0.6 }); }

  // 3 · the vow
  { const st = st_(2), pr = Wd('प्रण', 2) - st, ch = Wd('चढ़ाएगा', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.1, note: 'the bow glows large; seal प्रण; ribbon', draw(lt, d, t) {
      nightPage(3, 0.6); bow(540, 940, 1.5, 0, 0.8 + Math.sin(lt * 3) * 0.15, -Math.PI / 2);
      const s = pop(lt, pr, 0.4); if (s > 0) K.seal(540, 440, 1.0 * s, 'प्र');
      K.ribbon('चढ़ाएगा', 540, 1300, pop(lt, ch, 0.4), 100);
    } });
    cue(st, 'whoosh'); cue(st + pr, 'thud', { gain: 0.7 }); cue(st + ch, 'pop'); }

  // 4 · Sita
  { const st = st_(3), sc = Wd('सीता', 3) - st, vr = Wd('वर', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'Sita (queen figure) beside the bow; slips', draw(lt, d, t) {
      hall(); stand(250, 1430, 0.6); bow(250, 1160, 0.65, 0, 0.3, -Math.PI / 2);
      K.figure({ x: 700, y: 1500, h: 720, role: 'queen', arm: 0 });
      K.slip('सीता', 700, 420, pop(lt, sc, 0.35), -0.03, 70);
      const p = pop(lt, vr, 0.4); if (p > 0) K.ribbon('वर', 700, 620, p, 100);
      if (lt > vr) sparkles(700, 1000, lt - vr, 8, 280);
    } });
    cue(st, 'whoosh'); cue(st + sc, 'pop'); cue(st + vr, 'sparkle', { dur: 1 }); }

  // 5 · many kings try
  { const st = st_(4), rj = Wd('राजा', 4) - st, hl = Wd('हिला', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'row of kings around the unmoved bow', draw(lt, d, t) {
      hall(); stand(540, 1430, 0.9); bow(540, 1100, 0.9, 0, 0, -Math.PI / 2);
      [[120, 1500, 560, 1], [330, 1500, 520, 1], [750, 1500, 520, -1], [960, 1500, 560, -1]].forEach((f, i) => { const a = pop(lt, 0.2 + i * 0.35 + (rj > 0 ? 0 : 0), 0.35); if (a > 0) { ctx.save(); ctx.globalAlpha = clamp(a); K.figure({ x: f[0], y: f[1] + (1 - a) * 90, h: f[2], role: i % 2 ? 'merchant' : 'king', dir: f[3], arm: 20 }); ctx.restore(); } });
      K.slip('कई राजा', 540, 360, pop(lt, rj, 0.35), -0.03, 64);
      const p = pop(lt, hl, 0.4); if (p > 0) K.slip('हिला न सका', 540, 520, p, 0.03, 56);
    } });
    cue(st, 'whoosh'); cue(st + rj, 'pop'); cue(st + hl, 'thud', { gain: 0.5 }); }

  // 6 · Rama steps forward at the guru's word
  { const st = st_(5), aj = Wd('आज्ञा', 5) - st, rm = Wd('राम', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'sage gestures, Rama walks to the bow', draw(lt, d, t) {
      hall(); stand(720, 1430, 0.8); bow(720, 1130, 0.8, 0, 0.3, -Math.PI / 2);
      K.figure({ x: 130, y: 1500, h: 640, role: 'scholar', arm: 14 + Math.sin(lt * 3) * 4 });
      const w = eio(clamp((lt - rm + 0.2) / 1.6)); prince(lerp(300, 520, w), 1500, 560, P.royal, 1, 0);
      K.ribbon('आज्ञा', 540, 340, pop(lt, aj, 0.4), 110);
    } });
    cue(st, 'whoosh'); cue(st + aj, 'pop'); cue(st + rm, 'pop', { gain: 0.5 }); }

  // 7 · the bow breaks
  { const st = st_(6), dh = Wd('धनुष', 6) - st, tt = Wd('टूट', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.1, note: 'Rama lifts the bow; it splits in two with sparkles', draw(lt, d, t) {
      hall(); const lift = eio(clamp((lt - dh) / 1.0)), br = eio(clamp((lt - tt) / 0.5));
      prince(300, 1500, 600, P.royal, 1, 0);
      bow(640, 1250 - lift * 330, 1.0, br, 0.4 * (1 - br), -Math.PI / 2);
      if (lt > tt) sparkles(640, 940, lt - tt, 12, 330);
      const p = pop(lt, tt, 0.4); if (p > 0) K.ribbon('टूट गया', 540, 360, p, 110);
    } });
    cue(st, 'whoosh'); cue(st + dh, 'pop', { gain: 0.5 }); cue(st + tt, 'thud'); cue(st + tt, 'sparkle', { dur: 1.2 }); }

  // 8 · four weddings
  { const st = st_(7), sc = Wd('सीता', 7) - st, vv = Wd('विवाह', 7) - st, bh = Wd('भाइयों', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'Rama+Sita centre, then three more couples appear', draw(lt, d, t) {
      dayPage(8); ground(1360, P.land);
      const A = pop(lt, 0.1, 0.4); if (A > 0) { prince(400, 1480, 560, P.royal, 1, 0); K.figure({ x: 540, y: 1480, h: 560, role: 'queen' }); }
      const cols = [[P.wine, 130], [P.green, 770], ['#9A5B2E', 940]];
      cols.forEach((c, i) => { const a = pop(lt, bh + 0.1 + i * 0.35, 0.35); if (a > 0) { ctx.save(); ctx.globalAlpha = clamp(a); prince(c[1] - 60, 1480 + (1 - a) * 80, 440, c[0], 1, 0); K.figure({ x: c[1] + 40, y: 1480 + (1 - a) * 80, h: 440, role: 'queen' }); ctx.restore(); } });
      K.slip('सीता और राम', 470, 380, pop(lt, sc, 0.35), -0.03, 58);
      const p = pop(lt, vv, 0.4); if (p > 0) K.ribbon('विवाह', 540, 600, p, 110);
      const q = pop(lt, bh, 0.35); if (q > 0) K.slip('चारों भाई', 540, 780, q, 0.03, 52);
    } });
    cue(st, 'whoosh'); cue(st + sc, 'pop'); cue(st + vv, 'sparkle', { dur: 1 }); cue(st + vv, 'pop'); cue(st + bh, 'pop', { gain: 0.6 }); }

  // 9 · Mithila celebrates
  { const st = st_(8), mt = Wd('मिथिला', 8) - st, kh = Wd('खुशी', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'palace with sparkles and flames of celebration', draw(lt, d, t) {
      nightPage(9, 0.55); ground(1360, GROUND); palace(540, 1360, 1.15, t);
      for (const x of [140, 940]) flame(x, 1300, 1.0, t, x);
      if (lt > kh - 0.2) { sparkles(300, 800, lt, 8, 220); sparkles(780, 800, lt + 1, 8, 220); }
      K.ribbon('मिथिला', 540, 340, pop(lt, mt, 0.4), 110);
    } });
    cue(st, 'whoosh'); cue(st + mt, 'pop'); cue(st + kh, 'sparkle', { dur: 1.4 }); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal ४, teaser slip', draw(lt, d, t) {
      nightPage(11, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '४');
      K.slip('अगला भाग: राजतिलक की तैयारी', 540, 1330, pop(lt, bh, 0.3), 0.02, 56);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
