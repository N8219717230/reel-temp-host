// Shot list (Paper Atlas). Everything is cut paper. Shared shapes live in ./shapes.js.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

import { NIGHT, GROUND, nightPage, dayPage, ground, tree, palace, river, flame, smoke, altar, cradle, prince, coins, crown, bowl, cutAt, pop, boulder, hut, forest, sparkles, hills, fireAltar, pampa, lotus, vanara, gahne, throne, kishkindha, rain, ring } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);
  const R = (x, y, h = 540, dir = 1) => prince(x, y, h, P.royal, dir, 0), Lk = (x, y, h = 520, dir = 1) => prince(x, y, h, P.wine, dir, 0);
  const Hn = (x, y, h = 520, dir = 1, arm = 0) => vanara(x, y, h, '#E07A1F', dir, false, arm), Sg = (x, y, h = 540, dir = 1, cr = false) => vanara(x, y, h, '#B8892B', dir, cr, 0);
  const Vn = (x, y, h, c, dir = 1) => vanara(x, y, h, c, dir, false, 0);
  const G = ['#6B8F5A', '#8A5E9A', '#4F7F8F'];
  const W_ = (i, w) => Wd(w, i);


  // 1 · previous part: Rama and Sugriva friends
  { const st = 0, pk = Wd('पिछले', 0) - st, bg = Wd('भाग', 0) - st, rm = Wd('राम', 0) - st, sg = Wd('सुग्रीव', 0) - st, mt = Wd('मित्र', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'dusk: sacred fire, Rama left, Sugriva right, gold sparkle on friends', draw(lt, d, t) {
      nightPage(131, 0.45); ground(1360, GROUND); fireAltar(540, 1500, 1.2, t); R(210, 1500, 540, 1); Sg(880, 1500, 520, -1);
      const fr = pop(lt, mt - 0.2, 0.4); if (fr > 0) sparkles(540, 1000, lt - mt, 10, 280);
      K.slip('पिछले', 270, 330, pop(lt, pk, 0.35), -0.03, 62); K.slip('भाग में', 800, 330, pop(lt, bg, 0.35), 0.03, 62);
      K.slip('राम और', 290, 560, pop(lt, rm, 0.35), -0.03, 58); K.slip('सुग्रीव', 800, 560, pop(lt, sg, 0.35), 0.03, 60);
      K.ribbon('मित्र', 540, 800, pop(lt, mt, 0.4), 130);
    } });
    cue(0.1, 'whoosh'); cue(st + pk, 'pop', { gain: 0.5 }); cue(st + bg, 'pop', { gain: 0.5 }); cue(st + rm, 'pop', { gain: 0.5 }); cue(st + sg, 'pop', { gain: 0.5 }); cue(st + mt, 'sparkle', { dur: 0.9 }); }

  // 2 · Vali had driven Sugriva out of Kishkindha
  { const st = st_(1), sg = Wd('सुग्रीव', 1) - st, vl = Wd('वाली', 1) - st, un = Wd('उन्हें', 1) - st, kk = Wd('किष्किंधा', 1) - st, dy = Wd('दिया', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Kishkindha city at right, Sugriva walks away left, crimson route out', draw(lt, d, t) {
      dayPage(133); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 0.8); kishkindha(790, 1420, 1.05);
      const w = eio(clamp((lt - un) / 2.2));
      Sg(lerp(430, 200, w), 1500, 520, -1);
      K.dashedRoute([[640, 1010], [520, 960], [400, 930], [270, 930]], clamp(w * 1.1));
      K.slip('सुग्रीव के', 250, 340, pop(lt, sg, 0.35), -0.03, 60); K.slip('भाई', 800, 330, pop(lt, Wd('भाई', 1) - st, 0.35), 0.03, 62);
      K.ribbon('वाली', 760, 520, pop(lt, vl, 0.4), 100); K.slip('उन्हें', 270, 580, pop(lt, un, 0.35), -0.03, 60);
      K.slip('किष्किंधा से', 500, 740, pop(lt, kk, 0.35), 0.02, 58); K.slip('निकाल दिया था', 300, 860, pop(lt, Wd('निकाल', 1) - st, 0.35), -0.03, 52);
    } });
    cue(st, 'whoosh'); cue(st + sg, 'pop', { gain: 0.5 }); cue(st + vl, 'thud', { gain: 0.6 }); cue(st + un, 'pop', { gain: 0.5 }); cue(st + kk, 'pop'); }

  // 3 · Rama keeps promise, justice in Kishkindha
  { const st = st_(2), rm = Wd('राम', 2) - st, mt = Wd('मित्रता', 2) - st, nb = Wd('निभाई', 2) - st, kk = Wd('किष्किंधा', 2) - st, ny = Wd('न्याय', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Rama at left walks to Kishkindha gate with Sugriva, gold crown above the gate', draw(lt, d, t) {
      dayPage(135); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 0.8); kishkindha(830, 1420, 1.05);
      const w = eio(clamp(lt / 2.4)); R(lerp(100, 220, w), 1500, 540, 1); Sg(lerp(360, 500, w), 1500, 500, 1);
      const c = pop(lt, ny - 0.1, 0.4); if (c > 0) { crown(830, 760, 0.9 * c); sparkles(830, 780, lt - ny, 8, 200); }
      K.slip('राम ने', 260, 330, pop(lt, rm, 0.35), -0.03, 60); K.slip('मित्रता', 790, 330, pop(lt, mt, 0.35), 0.03, 60);
      K.ribbon('निभाई', 330, 520, pop(lt, nb, 0.4), 100); K.slip('किष्किंधा में', 270, 700, pop(lt, kk, 0.35), -0.03, 56);
      K.ribbon('न्याय', 640, 900, pop(lt, ny, 0.4), 100);
    } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.5 }); cue(st + mt, 'pop', { gain: 0.5 }); cue(st + nb, 'thud', { gain: 0.6 }); cue(st + kk, 'pop', { gain: 0.5 }); cue(st + ny, 'sparkle', { dur: 0.8 }); }

  // 4 · peace returns to the vanara city
  { const st = st_(3), vn = Wd('वानरों', 3) - st, ng = Wd('नगर', 3) - st, ph = Wd('फिर', 3) - st, sh = Wd('शांति', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: peaceful Kishkindha city with small vanara folk and trees', draw(lt, d, t) {
      dayPage(137); ground(1360, P.land); tree(90, 1380, 1.0); tree(1000, 1380, 1.1); kishkindha(540, 1260, 1.25);
      Vn(160, 1520, 300, G[0], 1); Vn(330, 1540, 260, G[1], 1); Vn(760, 1540, 270, G[2], -1); Vn(930, 1520, 300, '#B87A4A', -1);
      K.slip('वानरों के', 260, 330, pop(lt, vn, 0.35), -0.03, 60); K.slip('नगर में', 800, 340, pop(lt, ng, 0.35), 0.03, 60);
      K.slip('फिर', 300, 560, pop(lt, ph, 0.35), -0.03, 58); K.ribbon('शांति', 600, 620, pop(lt, sh, 0.4), 120);
      const sp = pop(lt, sh, 0.4); if (sp > 0) sparkles(540, 900, lt - sh, 8, 300);
    } });
    cue(st, 'whoosh'); cue(st + vn, 'pop', { gain: 0.5 }); cue(st + ng, 'pop', { gain: 0.5 }); cue(st + ph, 'pop', { gain: 0.4 }); cue(st + sh, 'sparkle', { dur: 0.8 }); }

  // 5 · Sugriva crowned
  { const st = st_(4), sg = Wd('सुग्रीव', 4) - st, kk = Wd('किष्किंधा', 4) - st, rj = Wd('राजा', 4) - st, bn = Wd('बने', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Sugriva crowned seated before throne arch, gold crown dropping on his head, Kishkindha behind', draw(lt, d, t) {
      dayPage(139); ground(1360, P.land); kishkindha(540, 1230, 1.3, 1);
      throne(540, 1500, 1.15); Sg(540, 1480, 520, 1, pop(lt, rj, 0.4) > 0);
      const cr = pop(lt, rj - 0.2, 0.4); if (cr > 0 && cr < 1.2) crown(540, 700 + (1 - cr) * -160, 0.0 + 0.55 * cr);
      K.slip('सुग्रीव', 250, 330, pop(lt, sg, 0.35), -0.03, 62); K.slip('किष्किंधा के', 800, 380, pop(lt, kk, 0.35), 0.03, 58);
      K.ribbon('राजा', 540, 540, pop(lt, rj, 0.4), 130); K.slip('बने', 800, 700, pop(lt, bn, 0.35), 0.03, 62);
      const sp = pop(lt, rj, 0.4); if (sp > 0) sparkles(540, 960, lt - rj, 10, 340);
    } });
    cue(st, 'whoosh'); cue(st + sg, 'pop', { gain: 0.5 }); cue(st + kk, 'pop', { gain: 0.5 }); cue(st + rj, 'thud', { gain: 0.7 }); cue(st + bn, 'sparkle', { dur: 0.8 }); }

  // 6 · four months of rain
  { const st = st_(5), vr = Wd('वर्षा', 5) - st, ch = Wd('चार', 5) - st, mh = Wd('महीने', 5) - st, bt = Wd('बीत', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'rain: dark cloud and rain over hills, Rama and Lakshmana waiting at a hut, seal ४', draw(lt, d, t) {
      nightPage(141, 0.5); ground(1360, GROUND); hills(1330, ['#5E6A58', '#46523F'], 0.9); hut(820, 1500, 1.0);
      R(380, 1500, 520, 1); Lk(540, 1500, 500, 1);
      rain(t + lt, 330, 1);
      K.slip('वर्षा के', 260, 640, pop(lt, vr, 0.35), -0.03, 60);
      const s = pop(lt, ch, 0.35); if (s > 0) K.seal(540, 680, 1.2 * s, '४');
      K.ribbon('महीने', 540, 890, pop(lt, mh, 0.4), 100); K.slip('बीत गए', 820, 560, pop(lt, bt, 0.35), 0.03, 58);
    } });
    cue(st, 'whoosh'); cue(st + vr, 'pop', { gain: 0.5 }); cue(st + ch, 'thud', { gain: 0.7 }); cue(st + mh, 'pop', { gain: 0.6 }); cue(st + bt, 'pop', { gain: 0.5 }); }

  // 7 · Sugriva summons all vanaras
  { const st = st_(6), ph = Wd('फिर', 6) - st, sg = Wd('सुग्रीव', 6) - st, sr = Wd('सारे', 6) - st, vn = Wd('वानर', 6) - st, bl = Wd('बुलाए', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: crowned Sugriva at left, vanaras of different colours gather toward him from the right', draw(lt, d, t) {
      dayPage(143); ground(1360, P.land); tree(1010, 1360, 1.1); tree(70, 1360, 0.8);
      Sg(230, 1500, 540, 1, true);
      const g = eio(clamp((lt - sr + 0.2) / 1.6));
      Vn(lerp(1160, 520, g), 1500, 420, G[0], -1); Vn(lerp(1240, 700, g), 1510, 380, G[1], -1); Vn(lerp(1320, 860, g), 1500, 400, G[2], -1); Vn(lerp(1400, 990, g), 1510, 360, '#B87A4A', -1);
      K.slip('फिर', 290, 330, pop(lt, ph, 0.3), -0.03, 58); K.slip('सुग्रीव ने', 800, 340, pop(lt, sg, 0.35), 0.03, 60);
      K.slip('सारे', 290, 520, pop(lt, sr, 0.35), -0.03, 62); K.slip('वानर', 800, 560, pop(lt, vn, 0.35), 0.03, 62);
      K.ribbon('बुलाए', 540, 800, pop(lt, bl, 0.4), 110);
    } });
    cue(st, 'whoosh'); cue(st + sg, 'pop', { gain: 0.5 }); cue(st + sr, 'pop', { gain: 0.5 }); cue(st + vn, 'pop', { gain: 0.5 }); cue(st + bl, 'thud', { gain: 0.6 }); }

  // 8 · four search parties in four directions (compass map)
  { const st = st_(7), un = Wd('उन्होंने', 7) - st, ch = Wd('चारों', 7) - st, ds = Wd('दिशाओं', 7) - st, kj = Wd('खोजी', 7) - st, bj = Wd('भेजे', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'map: compass at centre, four vanara parties N/E/W/S, only the south arrow is crimson', draw(lt, d, t) {
      K.parchment(145); ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = P.land; ctx.fillRect(-300, -300, W + 600, 1500); ctx.restore();
      K.compass(540, 860, 1.6);
      const pg = eio(clamp((lt - kj) / 1.6));
      const arrows = [[540, 640, 540, 330, '#3E2C1E'], [680, 860, 980, 860, '#3E2C1E'], [400, 860, 100, 860, '#3E2C1E']];
      ctx.save(); ctx.lineWidth = 8; ctx.lineCap = 'round';
      for (const [x1, y1, x2, y2, c] of arrows) { ctx.strokeStyle = c; ctx.setLineDash([22, 16]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, pg), lerp(y1, y2, pg)); ctx.stroke(); } ctx.restore();
      K.dashedRoute([[540, 1080], [540, 1400]], pg);
      Vn(540, 330 + 130 * 0, 230, G[0], 1); Vn(980, 960, 230, G[1], -1); Vn(100, 960, 230, G[2], 1);
      Hn(540, 1470, 260, 1, 0);
      K.slip('उन्होंने', 800, 330, pop(lt, un, 0.35), 0.03, 58); K.slip('चारों', 270, 450, pop(lt, ch, 0.35), -0.03, 60);
      K.ribbon('दिशाओं', 540, 1200 - 40, pop(lt, ds, 0.4), 100); K.slip('खोजी दल', 800, 560, pop(lt, kj, 0.35), 0.03, 58);
      K.slip('भेजे', 260, 1010, pop(lt, bj, 0.35), -0.03, 62);
    } });
    cue(st, 'whoosh'); cue(st + un, 'pop', { gain: 0.5 }); cue(st + ch, 'pop', { gain: 0.5 }); cue(st + ds, 'thud', { gain: 0.6 }); cue(st + kj, 'pop', { gain: 0.5 }); cue(st + bj, 'whoosh', { gain: 0.6 }); }

  // 9 · Hanuman heads south with Rama's ring
  { const st = st_(8), hn = Wd('हनुमान', 8) - st, dk = Wd('दक्षिण', 8) - st, ch = Wd('चले', 8) - st, rm = Wd('राम', 8) - st, ag = Wd('अँगूठी', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Hanuman walks right/south over hills, gold ring glowing above, crimson route south', draw(lt, d, t) {
      dayPage(147); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 1.0);
      const w = eio(clamp(lt / 2.6));
      Hn(lerp(220, 480, w), 1500, 560, 1, 0);
      const rg = pop(lt, ag - 0.2, 0.45); if (rg > 0) ring(800, 960, 0.9 * rg, 0.8);
      K.dashedRoute([[660, 1320], [770, 1280], [870, 1230], [970, 1170]], clamp((lt - dk + 0.3) / 2.0));
      K.ribbon('हनुमान', 540, 320, pop(lt, hn, 0.4), 100); K.slip('दक्षिण की', 800, 500, pop(lt, dk, 0.35), 0.03, 58);
      K.slip('चले', 260, 560, pop(lt, ch, 0.35), -0.03, 62); K.slip('राम की', 800, 760, pop(lt, rm, 0.35), 0.03, 58);
      K.slip('अँगूठी', 300, 800, pop(lt, ag, 0.35), -0.03, 62);
    } });
    cue(st, 'whoosh'); cue(st + hn, 'thud', { gain: 0.6 }); cue(st + dk, 'pop', { gain: 0.5 }); cue(st + ch, 'whoosh', { gain: 0.4 }); cue(st + rm, 'pop', { gain: 0.5 }); cue(st + ag, 'sparkle', { dur: 0.8 }); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal ११, teaser slip', draw(lt, d, t) {
      nightPage(11, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '११');
      K.slip('अगला भाग: हनुमान की उड़ान', 540, 1330, pop(lt, bh, 0.3), 0.02, 52);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
