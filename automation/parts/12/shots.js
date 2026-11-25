// Part 12: Vibhishana joins Rama, Rama asks the ocean, Nala-Nila build the setu, army crosses to Lanka.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;
import { NIGHT, GROUND, nightPage, dayPage, ground, tree, river, flame, crown, cutAt, pop, hills, boulder, vanara, lanka, chudamani, sparkles, prince, setu, vanaraRow } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);
  const Hn = (x, y, h = 520, dir = 1, arm = 0) => vanara(x, y, h, '#E07A1F', dir, false, arm);
  const R = (x, y, h = 540, dir = 1) => prince(x, y, h, P.royal, dir, 0);
  const tx = (lt, st, i, w, text, x, y, size = 58, rot = -0.03, rib = false) => { const a = Wd(w, i) - st, p = pop(lt, a, rib ? 0.4 : 0.35); if (rib) K.ribbon(text, x, y, p, size); else K.slip(text, x, y, p, rot, size); return a; };
  const cues = (st, list) => { cue(st, 'whoosh'); for (const [a, ty, g] of list) cue(st + a, ty, g ? { gain: g } : {}); };
  const W_ = (w, i, st) => Wd(w, i) - st;

  // 1 · previous part: Hanuman with the jewel
  { const st = 0;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Hanuman with glowing chudamani', draw(lt, d, t) {
      dayPage(171); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 1.0);
      const w = eio(clamp(lt / 2.4)); Hn(lerp(180, 520, w), 1500, 560, 1, 40);
      const j = pop(lt, W_('चूड़ामणि', 0, st) - 0.2, 0.45); if (j > 0) chudamani(lerp(330, 680, w), 1010, 0.8 * j, 0.8);
      tx(lt, st, 0, 'पिछले', 'पिछले', 270, 330, 62); tx(lt, st, 0, 'भाग', 'भाग में', 800, 330, 62, 0.03);
      tx(lt, st, 0, 'हनुमान', 'हनुमान', 270, 520, 62); tx(lt, st, 0, 'चूड़ामणि', 'चूड़ामणि', 760, 600, 100, 0, true);
      tx(lt, st, 0, 'लाए', 'लाए थे', 280, 760, 58);
    } });
    cues(st, [[W_('पिछले', 0, st), 'pop', 0.5], [W_('भाग', 0, st), 'pop', 0.5], [W_('हनुमान', 0, st), 'pop', 0.5], [W_('चूड़ामणि', 0, st), 'sparkle'], [W_('लाए', 0, st), 'pop', 0.5]]); }

  // 2 · Vibhishana comes to Rama
  { const st = st_(1);
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Lanka far left, Vibhishana (teal) walks to Rama (blue) at right', draw(lt, d, t) {
      dayPage(173); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 0.8); lanka(200, 1250, 0.4, 0);
      const w = eio(clamp(lt / 2.6)); prince(lerp(300, 560, w), 1500, 520, '#2F6B73', 1, 0); R(860, 1500, 540, -1);
      tx(lt, st, 1, 'रावण', 'रावण के', 270, 330, 58); tx(lt, st, 1, 'भाई', 'भाई', 800, 330, 62, 0.03);
      tx(lt, st, 1, 'विभीषण', 'विभीषण', 400, 540, 110, 0, true); tx(lt, st, 1, 'शरण', 'राम की शरण में', 760, 760, 54, 0.03);
    } });
    cues(st, [[W_('रावण', 1, st), 'pop', 0.5], [W_('भाई', 1, st), 'pop', 0.4], [W_('विभीषण', 1, st), 'thud', 0.6], [W_('शरण', 1, st), 'pop', 0.5]]); }

  // 3 · Rama sits by the sea and asks for a path
  { const st = st_(2);
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Rama on shore at left, sea, Lanka far right, crimson route over sea', draw(lt, d, t) {
      dayPage(175); river(t, 1200); lanka(840, 1160, 0.45, 0); ground(1420, P.land);
      R(220, 1560, 520, 1);
      K.dashedRoute([[360, 1130], [500, 1090], [640, 1100], [740, 1130]], clamp((lt - W_('रास्ता', 2, st)) / 1.2));
      tx(lt, st, 2, 'राम', 'राम', 270, 330, 62); tx(lt, st, 2, 'किनारे', 'समुद्र किनारे', 780, 330, 56, 0.03);
      tx(lt, st, 2, 'बैठे', 'बैठे', 270, 520, 62); tx(lt, st, 2, 'सागर', 'सागर से', 800, 520, 58, 0.03);
      tx(lt, st, 2, 'रास्ता', 'रास्ता', 540, 740, 120, 0, true);
    } });
    cues(st, [[W_('राम', 2, st), 'pop', 0.5], [W_('किनारे', 2, st), 'pop', 0.4], [W_('बैठे', 2, st), 'pop', 0.4], [W_('सागर', 2, st), 'pop', 0.5], [W_('रास्ता', 2, st), 'thud', 0.6]]); }

  // 4 · Nala and Nila begin the bridge
  { const st = st_(3);
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Nala and Nila vanaras on shore laying first stones into the sea', draw(lt, d, t) {
      dayPage(177); river(t, 1200); lanka(850, 1160, 0.4, 0); ground(1420, P.land);
      vanara(170, 1560, 480, '#5E8A4B', 1, false, 30); vanara(380, 1560, 480, '#8A6A3F', 1, false, 30);
      setu(500, 1100, 1250, clamp((lt - W_('पुल', 3, st)) / 1.5) * 0.5);
      tx(lt, st, 3, 'नल', 'नल और नील ने', 540, 330, 66); tx(lt, st, 3, 'पुल', 'पुल', 270, 520, 120, 0, true);
      tx(lt, st, 3, 'बनाना', 'बनाना', 800, 540, 60, 0.03); tx(lt, st, 3, 'शुरू', 'शुरू किया', 540, 720, 58);
    } });
    cues(st, [[W_('नल', 3, st), 'pop', 0.5], [W_('पुल', 3, st), 'thud', 0.6], [W_('बनाना', 3, st), 'pop', 0.4], [W_('शुरू', 3, st), 'pop', 0.4]]); }

  // 5 · vanaras bring stones and trees
  { const st = st_(4);
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: vanaras with boulders and trees walking to shore', draw(lt, d, t) {
      dayPage(179); ground(1360, P.land); hills(1330, ['#8E9B66', '#6F8250'], 0.8);
      tree(120, 1380, 1.1); tree(960, 1380, 1.0); boulder(540, 1400, 0.5);
      const w = eio(clamp(lt / 1.6)); vanaraRow(lerp(-80, 120, w), 1580, 3, 300, 380, 1, t);
      tx(lt, st, 4, 'वानर', 'वानर', 270, 330, 64); tx(lt, st, 4, 'पत्थर', 'पत्थर', 790, 330, 62, 0.03);
      tx(lt, st, 4, 'पेड़', 'और पेड़', 280, 520, 60); tx(lt, st, 4, 'लाते', 'लाते गए', 780, 700, 120, 0, true);
    } });
    cues(st, [[W_('वानर', 4, st), 'pop', 0.5], [W_('पत्थर', 4, st), 'thud', 0.5], [W_('पेड़', 4, st), 'pop', 0.4], [W_('लाते', 4, st), 'pop', 0.5]]); }

  // 6 · bridge complete in five days
  { const st = st_(5);
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: complete stone bridge across sea to Lanka', draw(lt, d, t) {
      dayPage(181); river(t, 1200); lanka(870, 1150, 0.45, 0); ground(1440, P.land);
      setu(40, 760, 1240, clamp((lt - W_('सौ', 5, st) + 0.6) / 1.6));
      tx(lt, st, 5, 'पाँच', 'पाँच दिनों', 270, 330, 62); tx(lt, st, 5, 'सौ', 'में सौ', 790, 330, 62, 0.03);
      tx(lt, st, 5, 'योजन', 'योजन लंबा', 540, 520, 58); tx(lt, st, 5, 'सेतु', 'सेतु', 540, 740, 130, 0, true);
    } });
    cues(st, [[W_('पाँच', 5, st), 'pop', 0.5], [W_('सौ', 5, st), 'pop', 0.4], [W_('योजन', 5, st), 'pop', 0.4], [W_('सेतु', 5, st), 'thud', 0.7]]); }

  // 7 · army crosses
  { const st = st_(6);
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Rama and vanara army walking across the bridge toward Lanka', draw(lt, d, t) {
      dayPage(183); river(t, 1260); lanka(880, 1180, 0.45, 0); setu(40, 860, 1240, 1);
      const w = eio(clamp(lt / 4)); const x0 = lerp(80, 360, w);
      R(x0 + 260, 1150, 300, 1); vanaraRow(x0, 1170, 3, 110, 240, 1, t);
      tx(lt, st, 6, 'राम', 'राम की', 270, 330, 62); tx(lt, st, 6, 'सेना', 'सेना ने', 790, 330, 62, 0.03);
      tx(lt, st, 6, 'पुल', 'पुल से', 270, 520, 58); tx(lt, st, 6, 'सागर', 'सागर पार', 740, 620, 120, 0, true);
    } });
    cues(st, [[W_('राम', 6, st), 'pop', 0.5], [W_('सेना', 6, st), 'pop', 0.4], [W_('पुल', 6, st), 'pop', 0.4], [W_('सागर', 6, st), 'thud', 0.6]]); }

  // 8 · arrive on Lanka shore
  { const st = st_(7);
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: army on beach at left, Lanka shore right', draw(lt, d, t) {
      dayPage(185); river(t, 1300); ground(1440, '#C9B27A'); lanka(790, 1300, 0.7, 0);
      R(430, 1580, 480, 1); vanaraRow(120, 1580, 2, 110, 380, 1, t);
      tx(lt, st, 7, 'सब', 'सब', 270, 330, 66); tx(lt, st, 7, 'लंका', 'लंका के', 780, 330, 60, 0.03);
      tx(lt, st, 7, 'तट', 'तट पर', 270, 520, 58); tx(lt, st, 7, 'पहुँच', 'पहुँच गए', 780, 600, 110, 0, true);
    } });
    cues(st, [[W_('सब', 7, st), 'pop', 0.5], [W_('लंका', 7, st), 'pop', 0.5], [W_('तट', 7, st), 'pop', 0.4], [W_('पहुँच', 7, st), 'thud', 0.6]]); }

  // 9 · golden Lanka ahead (dusk)
  { const st = st_(8);
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'night: golden Lanka large, small Rama silhouette at left', draw(lt, d, t) {
      nightPage(187, 0.6); ground(1380, GROUND); lanka(560, 1360, 1.1, 0);
      R(130, 1560, 380, 1);
      tx(lt, st, 8, 'सामने', 'सामने थी', 270, 330, 62); tx(lt, st, 8, 'सोने', 'सोने की', 790, 330, 62, 0.03);
      tx(lt, st, 8, 'लंका', 'लंका', 540, 560, 130, 0, true);
    } });
    cues(st, [[W_('सामने', 8, st), 'pop', 0.5], [W_('सोने', 8, st), 'sparkle'], [W_('लंका', 8, st), 'thud', 0.7]]); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal १३, teaser slip', draw(lt, d, t) {
      nightPage(13, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '१३');
      K.slip('अगला भाग: लंका का युद्ध', 540, 1330, pop(lt, bh, 0.3), 0.02, 52);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
