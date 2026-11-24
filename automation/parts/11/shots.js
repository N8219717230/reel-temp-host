// Part 11: Sampati sees Lanka, Hanuman's leap, Ashoka Vatika, ring and chudamani, tail fire, return.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;
import { NIGHT, GROUND, nightPage, dayPage, ground, tree, river, flame, crown, cutAt, pop, hills, vulture, boulder, vanara, ring, lanka, ashoka, chudamani, sparkles, prince } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);
  const Hn = (x, y, h = 520, dir = 1, arm = 0) => vanara(x, y, h, '#E07A1F', dir, false, arm);
  const Sita = (x, y, h = 520, dir = 1, arm = 0) => K.figure({ x, y, h, role: 'queen', dir, arm });
  const R = (x, y, h = 540, dir = 1) => prince(x, y, h, P.royal, dir, 0);
  // slip/ribbon helper: word w of line i, drawn at word-time
  const tx = (lt, st, i, w, text, x, y, size = 58, rot = -0.03, rib = false) => { const a = Wd(w, i) - st, p = pop(lt, a, rib ? 0.4 : 0.35); if (rib) K.ribbon(text, x, y, p, size); else K.slip(text, x, y, p, rot, size); return a; };
  const cues = (st, list) => { cue(st, 'whoosh'); for (const [a, ty, g] of list) cue(st + a, ty, g ? { gain: g } : {}); };

  // 1 · previous part: Hanuman heads south
  { const st = 0;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Hanuman walks right over hills, crimson route south', draw(lt, d, t) {
      dayPage(151); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 1.0);
      const w = eio(clamp(lt / 2.6)); Hn(lerp(200, 440, w), 1500, 560, 1, 0);
      K.dashedRoute([[620, 1320], [740, 1280], [850, 1230], [960, 1170]], clamp((lt - 1.2) / 1.6));
      tx(lt, st, 0, 'पिछले', 'पिछले', 270, 330, 62); tx(lt, st, 0, 'भाग', 'भाग में', 800, 330, 62, 0.03);
      tx(lt, st, 0, 'हनुमान', 'हनुमान', 540, 560, 110, 0, true); tx(lt, st, 0, 'दक्षिण', 'दक्षिण की ओर', 780, 760, 56, 0.03);
      tx(lt, st, 0, 'चले', 'चले थे', 260, 800, 58);
    } });
    cues(st, [[Wd('पिछले', 0) - st, 'pop', 0.5], [Wd('भाग', 0) - st, 'pop', 0.5], [Wd('हनुमान', 0) - st, 'thud', 0.6], [Wd('दक्षिण', 0) - st, 'pop', 0.5], [Wd('चले', 0) - st, 'pop', 0.5]]); }

  // 2 · Sampati on a cliff sees Lanka across the sea
  { const st = st_(1), gd = Wd('गिद्ध', 1) - st, lk = Wd('लंका', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: sea, Sampati the vulture on a cliff at left, Lanka far at right', draw(lt, d, t) {
      dayPage(153); river(t, 1200); lanka(800, 1190, 0.55, 0);
      boulder(190, 1420, 1.3); vulture(190, 1180, 1.0, 1, 0);
      const r = pop(lt, lk - 0.2, 0.4); if (r > 0) K.dashedRoute([[400, 960], [520, 930], [640, 940], [740, 980]], clamp((lt - lk + 0.2) / 0.9));
      tx(lt, st, 1, 'समुद्र', 'समुद्र किनारे', 300, 340, 58); tx(lt, st, 1, 'गिद्ध', 'गिद्ध', 780, 340, 62, 0.03);
      tx(lt, st, 1, 'संपाति', 'संपाति', 300, 520, 110, 0, true); tx(lt, st, 1, 'दूर', 'दूर', 800, 560, 62, 0.03);
      tx(lt, st, 1, 'लंका', 'लंका', 700, 760, 120, 0, true);
    } });
    cues(st, [[Wd('समुद्र', 1) - st, 'pop', 0.5], [gd, 'pop', 0.5], [Wd('संपाति', 1) - st, 'pop', 0.5], [Wd('दूर', 1) - st, 'pop', 0.4], [lk, 'thud', 0.6]]); }

  // 3 · the great leap over the ocean
  { const st = st_(2), hn = Wd('हनुमान', 2) - st, vr = Wd('विशाल', 2) - st, sg = Wd('सागर', 2) - st, ch = Wd('छलाँग', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: giant Hanuman arcs over the sea toward Lanka, crimson arc route', draw(lt, d, t) {
      dayPage(155); river(t, 1220); lanka(830, 1210, 0.5, 0);
      const g = pop(lt, vr, 0.5), w = eio(clamp((lt - sg + 0.2) / 2.2));
      const x = lerp(220, 760, w), y = 1330 - 250 * Math.sin(Math.PI * w);
      K.dashedRoute([[240, 1150], [340, 1000], [480, 940], [620, 1000], [740, 1120]], clamp((lt - sg) / 2.0));
      Hn(x, y, lerp(300, 430, g), 1, 25);
      tx(lt, st, 2, 'हनुमान', 'हनुमान ने', 270, 330, 58); tx(lt, st, 2, 'विशाल', 'विशाल रूप', 790, 330, 58, 0.03);
      tx(lt, st, 2, 'लिया', 'लिया', 270, 460, 62); tx(lt, st, 2, 'सागर', 'सागर पर', 800, 470, 62, 0.03);
      tx(lt, st, 2, 'छलाँग', 'छलाँग', 540, 660, 120, 0, true);
    } });
    cues(st, [[hn, 'pop', 0.5], [vr, 'thud', 0.6], [Wd('लिया', 2) - st, 'pop', 0.4], [sg, 'pop', 0.5], [ch, 'whoosh', 0.8]]); }

  // 4 · Ashoka Vatika, Sita found
  { const st = st_(3), as = Wd('अशोक', 3) - st, sc = Wd('सीता', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Ashoka garden, Sita seated-standing under the tree, Hanuman small at right', draw(lt, d, t) {
      dayPage(157); ground(1360, '#9DB071'); ashoka(210, 1380, 1.1); ashoka(900, 1380, 0.9);
      Sita(540, 1500, 540, 1, 0); const h = eio(clamp(lt / 1.8)); Hn(lerp(1250, 860, h), 1520, 300, -1, 0);
      const sp = pop(lt, sc - 0.1, 0.4); if (sp > 0) sparkles(540, 1050, lt - sc, 8, 260);
      tx(lt, st, 3, 'अशोक', 'अशोक वाटिका में', 330, 330, 54); tx(lt, st, 3, 'उन्हें', 'उन्हें', 800, 330, 62, 0.03);
      tx(lt, st, 3, 'माता', 'माता', 270, 520, 62); tx(lt, st, 3, 'सीता', 'सीता', 640, 560, 120, 0, true);
    } });
    cues(st, [[as, 'pop', 0.5], [Wd('उन्हें', 3) - st, 'pop', 0.4], [Wd('माता', 3) - st, 'pop', 0.5], [sc, 'sparkle']]); }

  // 5 · Hanuman gives Rama's ring to Sita
  { const st = st_(4), hn = Wd('हनुमान', 4) - st, rm = Wd('राम', 4) - st, ag = Wd('अँगूठी', 4) - st, sc = Wd('सीता', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Hanuman at left offers glowing gold ring to Sita at right', draw(lt, d, t) {
      dayPage(159); ground(1360, '#9DB071'); ashoka(540, 1380, 0.9);
      Hn(220, 1500, 480, 1, 40); Sita(840, 1500, 520, -1, 0);
      const r = pop(lt, ag - 0.2, 0.45), mv = eio(clamp((lt - sc + 0.3) / 1.2)); if (r > 0) ring(lerp(400, 700, mv), lerp(1030, 1000, mv), 0.8 * r, 0.8);
      tx(lt, st, 4, 'हनुमान', 'हनुमान ने', 270, 330, 58); tx(lt, st, 4, 'राम', 'राम की', 800, 330, 62, 0.03);
      tx(lt, st, 4, 'अँगूठी', 'अँगूठी', 540, 560, 120, 0, true); tx(lt, st, 4, 'सीता', 'सीता को दी', 780, 740, 56, 0.03);
    } });
    cues(st, [[hn, 'pop', 0.5], [rm, 'pop', 0.5], [ag, 'sparkle'], [sc, 'thud', 0.5]]); }

  // 6 · Sita gives her chudamani as a token
  { const st = st_(5), sc = Wd('सीता', 5) - st, nk = Wd('निशानी', 5) - st, cd = Wd('चूड़ामणि', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Sita at right hands glowing gold jewel to Hanuman at left', draw(lt, d, t) {
      dayPage(161); ground(1360, '#9DB071'); ashoka(540, 1380, 0.9);
      Hn(220, 1500, 480, 1, 40); Sita(840, 1500, 520, -1, 45);
      const j = pop(lt, cd - 0.3, 0.45), mv = eio(clamp((lt - cd) / 1.2)); if (j > 0) chudamani(lerp(700, 400, mv), 1020, 0.8 * j, 0.8);
      tx(lt, st, 5, 'सीता', 'सीता ने', 270, 330, 58); tx(lt, st, 5, 'निशानी', 'निशानी में', 800, 330, 58, 0.03);
      tx(lt, st, 5, 'अपनी', 'अपनी', 270, 520, 62); tx(lt, st, 5, 'चूड़ामणि', 'चूड़ामणि', 560, 660, 100, 0, true);
    } });
    cues(st, [[sc, 'pop', 0.5], [nk, 'pop', 0.5], [Wd('अपनी', 5) - st, 'pop', 0.4], [cd, 'sparkle']]); }

  // 7 · tail set alight
  { const st = st_(6), rv = Wd('रावण', 6) - st, sv = Wd('सेवकों', 6) - st, hn = Wd('हनुमान', 6) - st, ag = Wd('आग', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'night: Lanka, Hanuman stands with a paper-flame lamp on his tail', draw(lt, d, t) {
      nightPage(163, 0.6); ground(1360, GROUND); lanka(760, 1330, 0.75, 0);
      Hn(250, 1500, 560, 1, 0);
      const f = pop(lt, ag, 0.4); if (f > 0) { flame(90, 1200, 0.8 * f, t, 3); }
      tx(lt, st, 6, 'रावण', 'रावण के', 270, 330, 58); tx(lt, st, 6, 'सेवकों', 'सेवकों ने', 800, 330, 58, 0.03);
      tx(lt, st, 6, 'हनुमान', 'हनुमान की', 270, 520, 58); tx(lt, st, 6, 'आग', 'आग', 790, 620, 130, 0, true);
    } });
    cues(st, [[rv, 'pop', 0.5], [sv, 'pop', 0.5], [hn, 'pop', 0.5], [ag, 'thud', 0.7]]); }

  // 8 · Lanka glows with fire from the tail (gentle)
  { const st = st_(7), us = Wd('उसी', 7) - st, pc = Wd('पूँछ', 7) - st, lk = Wd('लंका', 7) - st, ag = Wd('आग', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'night: Lanka towers lit by orange flames, Hanuman small with flame tail', draw(lt, d, t) {
      nightPage(165, 0.7); ground(1380, GROUND);
      const g = clamp(pop(lt, lk, 0.5)); ctx.save(); ctx.translate(0, 0); lanka(540, 1370, 1.15, 0); ctx.restore();
      for (const [fx, fy, fs] of [[300, 1050, 0.6], [540, 800, 0.8], [790, 1050, 0.6]]) flame(fx, fy, fs * g, t, fx);
      Hn(130, 1500, 360, 1, 0); flame(40, 1320, 0.5, t, 9);
      tx(lt, st, 7, 'उसी', 'उसी', 270, 330, 62); tx(lt, st, 7, 'पूँछ', 'जलती पूँछ से', 790, 330, 56, 0.03);
      tx(lt, st, 7, 'लंका', 'लंका में', 270, 520, 58); tx(lt, st, 7, 'आग', 'आग', 790, 540, 120, 0, true);
    } });
    cues(st, [[us, 'pop', 0.4], [pc, 'pop', 0.5], [lk, 'pop', 0.5], [ag, 'thud', 0.6]]); }

  // 9 · Hanuman returns to Rama with the jewel
  { const st = st_(8), hn = Wd('हनुमान', 8) - st, cd = Wd('चूड़ामणि', 8) - st, rm = Wd('राम', 8) - st, ls = Wd('लौटे', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Hanuman walks from left to Rama at right, holding glowing jewel', draw(lt, d, t) {
      dayPage(167); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 0.9);
      const w = eio(clamp(lt / 2.4)); R(840, 1500, 540, -1); Hn(lerp(120, 520, w), 1500, 520, 1, 40);
      const j = pop(lt, cd - 0.2, 0.45); if (j > 0) chudamani(lerp(300, 640, w), 1010, 0.6 * j, 0.8);
      tx(lt, st, 8, 'हनुमान', 'हनुमान', 270, 330, 62); tx(lt, st, 8, 'चूड़ामणि', 'चूड़ामणि', 790, 330, 56, 0.03);
      tx(lt, st, 8, 'लेकर', 'लेकर', 270, 520, 62); tx(lt, st, 8, 'राम', 'राम के पास', 790, 540, 58, 0.03);
      tx(lt, st, 8, 'लौटे', 'लौटे', 540, 740, 120, 0, true);
    } });
    cues(st, [[hn, 'pop', 0.5], [cd, 'sparkle'], [Wd('लेकर', 8) - st, 'pop', 0.4], [rm, 'pop', 0.5], [ls, 'thud', 0.6]]); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal १२, teaser slip', draw(lt, d, t) {
      nightPage(12, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '१२');
      K.slip('अगला भाग: राम सेतु', 540, 1330, pop(lt, bh, 0.3), 0.02, 52);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
