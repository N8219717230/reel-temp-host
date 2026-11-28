// Part 14: Kumbhakarna and Indrajit fall, Ravana's end (crown falls), last rites, Hanuman tells Sita, reunion, Vibhishana crowned, peace.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;
import { NIGHT, GROUND, nightPage, dayPage, ground, tree, river, flame, cutAt, pop, hills, vanara, lanka, sparkles, prince, vanaraRow, throne, ravana, torch, sanjeevani, lying, crown, fireAltar, ashoka, smoke, tenCrown } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);
  const R = (x, y, h = 540, dir = 1) => prince(x, y, h, P.royal, dir, 0);
  const LK = (x, y, h = 540, dir = 1) => prince(x, y, h, P.wine, dir, 0);
  const VB = (x, y, h = 520, dir = 1) => prince(x, y, h, '#2F6B73', dir, 0);
  const Sita = (x, y, h = 520, dir = 1, arm = 0) => K.figure({ x, y, h, role: 'queen', dir, arm });
  const Hn = (x, y, h = 520, dir = 1, arm = 0) => vanara(x, y, h, '#E07A1F', dir, false, arm);
  const tx = (lt, st, i, w, text, x, y, size = 58, rot = -0.03, rib = false) => { const a = Wd(w, i) - st, p = pop(lt, a, rib ? 0.4 : 0.35); if (rib) K.ribbon(text, x, y, p, size); else K.slip(text, x, y, p, rot, size); return a; };
  const cues = (st, list) => { cue(st, 'whoosh'); for (const [a, ty, g] of list) cue(st + a, ty, g ? { gain: g } : {}); };
  const W_ = (w, i, st) => Wd(w, i) - st;

  // 1 · previous part: Lakshmana stands again
  { const st = 0;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Rama and Lakshmana standing, sparkles', draw(lt, d, t) {
      dayPage(211); hills(1330, ['#8E9B66', '#6F8250'], 0.9); ground(1400, P.land);
      sanjeevani(900, 1420, 0.5, 1, t); sparkles(480, 1050, t, 8, 230); R(300, 1560, 520, 1); LK(620, 1560, 520, 1);
      tx(lt, st, 0, 'पिछले', 'पिछले', 270, 330, 62); tx(lt, st, 0, 'भाग', 'भाग में', 800, 330, 62, 0.03);
      tx(lt, st, 0, 'लक्ष्मण', 'लक्ष्मण', 270, 520, 62); tx(lt, st, 0, 'फिर', 'फिर', 700, 700, 100, 0, true);
      tx(lt, st, 0, 'खड़े', 'उठ खड़े हुए थे', 700, 860, 52, 0.03);
    } });
    cues(st, [[W_('पिछले', 0, st), 'pop', 0.5], [W_('भाग', 0, st), 'pop', 0.5], [W_('लक्ष्मण', 0, st), 'pop', 0.5], [W_('फिर', 0, st), 'thud', 0.5], [W_('खड़े', 0, st), 'pop', 0.4]]); }

  // 2 · Kumbhakarna and Indrajit: two crowns sink
  { const st = st_(1);
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'night: two crowns sinking, giant and small plum figures standing at sides', draw(lt, d, t) {
      nightPage(213, 0.78); ground(1400, GROUND);
      prince(190, 1560, 820, '#5A4660', 1, 0); prince(900, 1560, 480, '#3A2A38', -1, 0);
      const f = eio(clamp((lt - W_('वीरगति', 1, st) + 0.1) / 1.4));
      crown(480, lerp(560, 1000, f), 1.1); crown(700, lerp(660, 1100, f), 0.75);
      sparkles(540, 860, t, 8, 220);
      tx(lt, st, 1, 'फिर', 'फिर', 540, 330, 62); tx(lt, st, 1, 'कुंभकर्ण', 'कुंभकर्ण', 300, 440, 64);
      tx(lt, st, 1, 'इंद्रजीत', 'इंद्रजीत', 800, 440, 64, 0.03); tx(lt, st, 1, 'दोनों', 'दोनों', 540, 640, 56, 0);
      tx(lt, st, 1, 'वीरगति', 'वीरगति', 540, 780, 100, 0, true);
    } });
    cues(st, [[W_('फिर', 1, st), 'pop', 0.4], [W_('कुंभकर्ण', 1, st), 'pop', 0.5], [W_('इंद्रजीत', 1, st), 'pop', 0.5], [W_('दोनों', 1, st), 'pop', 0.4], [W_('वीरगति', 1, st), 'thud', 0.6]]); }

  // 3 · Ravana himself comes to the field
  { const st = st_(2);
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'night: Ravana large at right facing Rama at left, torches', draw(lt, d, t) {
      nightPage(215, 0.72); ground(1400, GROUND);
      const w = eio(clamp(lt / 1.6)); R(220, 1560, 500, 1); torch(60, 1560, 1.2, t, 1);
      ravana(lerp(1300, 820, w), 1560, 640, -1); torch(1010, 1560, 1.3, t, 3);
      tx(lt, st, 2, 'तब', 'तब', 270, 330, 66); tx(lt, st, 2, 'रावण', 'रावण', 790, 330, 64, 0.03);
      tx(lt, st, 2, 'स्वयं', 'स्वयं', 270, 520, 62); tx(lt, st, 2, 'रणभूमि', 'रणभूमि में', 560, 740, 100, 0, true); tx(lt, st, 2, 'आया', 'आया', 800, 940, 56, 0.03);
    } });
    cues(st, [[W_('तब', 2, st), 'pop', 0.4], [W_('रावण', 2, st), 'pop', 0.5], [W_('स्वयं', 2, st), 'pop', 0.5], [W_('रणभूमि', 2, st), 'thud', 0.6], [W_('आया', 2, st), 'pop', 0.4]]); }

  // 4 · dharma wins: Ravana's ten-headed crown falls, light returns
  { const st = st_(3);
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: ten-peaked crown falls to ground, smoke, sparkles', draw(lt, d, t) {
      dayPage(217); ground(1400, P.land);
      const f = eio(clamp((lt - W_('अंत', 3, st) + 0.3) / 1.2));
      tenCrown(540, lerp(900, 1330, f), 1.0, lerp(0, 0.25, f), 1 - 0.0 * f);
      if (f > 0.9) smoke(540, 1180, 1.1, 0.7);
      sparkles(540, 760, t, 10, 300);
      tx(lt, st, 3, 'और', 'और', 270, 330, 62); tx(lt, st, 3, 'धर्म', 'धर्म की', 560, 330, 62, 0.03);
      tx(lt, st, 3, 'जीत', 'जीत हुई', 700, 470, 100, 0, true); tx(lt, st, 3, 'रावण', 'रावण का', 270, 520, 56);
      tx(lt, st, 3, 'अंत', 'अंत', 820, 760, 70, 0.03);
    } });
    cues(st, [[W_('और', 3, st), 'pop', 0.4], [W_('धर्म', 3, st), 'pop', 0.5], [W_('जीत', 3, st), 'sparkle'], [W_('रावण', 3, st), 'pop', 0.4], [W_('अंत', 3, st), 'thud', 0.8]]); }

  // 5 · Vibhishana performs the last rites
  { const st = st_(4);
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'night: Vibhishana (teal) beside a still fire altar, Rama at right', draw(lt, d, t) {
      nightPage(219, 0.8); ground(1400, GROUND);
      fireAltar(540, 1540, 1.5, t); VB(250, 1560, 540, 1); R(870, 1560, 480, -1);
      tx(lt, st, 4, 'विभीषण', 'विभीषण ने', 330, 330, 62); tx(lt, st, 4, 'अपने', 'अपने भाई का', 780, 330, 54, 0.03);
      tx(lt, st, 4, 'अंतिम', 'अंतिम', 270, 520, 62); tx(lt, st, 4, 'संस्कार', 'संस्कार', 640, 720, 110, 0, true);
    } });
    cues(st, [[W_('विभीषण', 4, st), 'pop', 0.5], [W_('अपने', 4, st), 'pop', 0.4], [W_('अंतिम', 4, st), 'pop', 0.4], [W_('संस्कार', 4, st), 'thud', 0.6]]); }

  // 6 · Hanuman brings Sita the news of victory
  { const st = st_(5);
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Hanuman at left, Sita at right under ashoka tree', draw(lt, d, t) {
      dayPage(221); ground(1360, '#9DB071'); ashoka(540, 1380, 0.9);
      const w = eio(clamp(lt / 1.8)); Hn(lerp(100, 330, w), 1520, 500, 1, 60); Sita(820, 1500, 540, -1, 0);
      tx(lt, st, 5, 'हनुमान', 'हनुमान ने', 300, 330, 62); tx(lt, st, 5, 'सीता', 'सीता को', 800, 330, 62, 0.03);
      tx(lt, st, 5, 'विजय', 'विजय', 300, 540, 120, 0, true); tx(lt, st, 5, 'समाचार', 'का समाचार', 780, 700, 54, 0.03);
    } });
    cues(st, [[W_('हनुमान', 5, st), 'pop', 0.5], [W_('सीता', 5, st), 'pop', 0.5], [W_('विजय', 5, st), 'sparkle'], [W_('समाचार', 5, st), 'pop', 0.4]]); }

  // 7 · Sita and Rama meet again
  { const st = st_(6);
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Rama walks toward Sita, sparkles between', draw(lt, d, t) {
      dayPage(223); hills(1330, ['#8E9B66', '#6F8250'], 0.8); ground(1400, P.land);
      const w = eio(clamp(lt / 2.4)); Sita(lerp(760, 650, w), 1540, 540, -1, 0); R(lerp(170, 440, w), 1560, 540, 1);
      sparkles(550, 1050, t, 10, 260 * w + 40);
      tx(lt, st, 6, 'सीता', 'सीता', 270, 330, 64); tx(lt, st, 6, 'राम', 'और राम', 790, 330, 64, 0.03);
      tx(lt, st, 6, 'बहुत', 'बहुत', 270, 520, 56); tx(lt, st, 6, 'समय', 'समय बाद', 640, 540, 56, 0.03);
      tx(lt, st, 6, 'फिर', 'फिर मिले', 540, 760, 110, 0, true);
    } });
    cues(st, [[W_('सीता', 6, st), 'pop', 0.5], [W_('राम', 6, st), 'pop', 0.5], [W_('बहुत', 6, st), 'pop', 0.4], [W_('समय', 6, st), 'pop', 0.4], [W_('फिर', 6, st), 'sparkle']]); }

  // 8 · Vibhishana made king of Lanka
  { const st = st_(7);
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Lanka at left, Vibhishana (teal) by throne gets a gold crown, Rama at right', draw(lt, d, t) {
      dayPage(225); ground(1400, P.land); lanka(230, 1250, 0.45, 0);
      throne(600, 1520, 0.9); VB(600, 1540, 500, 1); R(940, 1560, 500, -1);
      const c = pop(lt, W_('राजा', 7, st) - 0.1, 0.5); if (c > 0) { crown(600, 840 + (1 - c) * -120, 0.8 * c); sparkles(600, 860, lt, 8, 200); }
      tx(lt, st, 7, 'राम', 'राम ने', 270, 330, 62); tx(lt, st, 7, 'विभीषण', 'विभीषण को', 790, 330, 60, 0.03);
      tx(lt, st, 7, 'लंका', 'लंका का', 280, 520, 58); tx(lt, st, 7, 'राजा', 'राजा', 820, 640, 110, 0, true);
    } });
    cues(st, [[W_('राम', 7, st), 'pop', 0.4], [W_('विभीषण', 7, st), 'pop', 0.5], [W_('लंका', 7, st), 'pop', 0.4], [W_('राजा', 7, st), 'thud', 0.7]]); }

  // 9 · peace returns to Lanka
  { const st = st_(8);
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Lanka large and calm, sparkles, Rama Sita Lakshmana below', draw(lt, d, t) {
      dayPage(227); river(t, 1250); lanka(540, 1180, 0.75, 0); sparkles(540, 800, t, 10, 330);
      tx(lt, st, 8, 'अब', 'अब', 270, 330, 62); tx(lt, st, 8, 'लंका', 'लंका में', 790, 330, 62, 0.03);
      tx(lt, st, 8, 'शांति', 'शांति', 540, 540, 130, 0, true); tx(lt, st, 8, 'लौट', 'लौट आई', 540, 760, 56, 0);
    } });
    cues(st, [[W_('अब', 8, st), 'pop', 0.4], [W_('लंका', 8, st), 'pop', 0.5], [W_('शांति', 8, st), 'sparkle'], [W_('लौट', 8, st), 'pop', 0.4]]); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal १५, teaser slip', draw(lt, d, t) {
      nightPage(15, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '१५');
      K.slip('अगला भाग: अयोध्या वापसी', 540, 1330, pop(lt, bh, 0.3), 0.02, 52);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
