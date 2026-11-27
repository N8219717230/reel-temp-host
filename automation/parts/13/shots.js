// Part 13: Angada's message, armies meet, Lakshmana wounded, Hanuman brings Sanjeevani.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;
import { NIGHT, GROUND, nightPage, dayPage, ground, tree, river, flame, cutAt, pop, hills, vanara, lanka, sparkles, prince, setu, vanaraRow, throne, ravana, torch, sanjeevani, lying } from './shapes.js';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const st_ = (i) => cutAt(i);
  const R = (x, y, h = 540, dir = 1) => prince(x, y, h, P.royal, dir, 0);
  const LK = (x, y, h = 540, dir = 1) => prince(x, y, h, P.wine, dir, 0);
  const Hn = (x, y, h = 520, dir = 1, arm = 0) => vanara(x, y, h, '#E07A1F', dir, false, arm);
  const tx = (lt, st, i, w, text, x, y, size = 58, rot = -0.03, rib = false) => { const a = Wd(w, i) - st, p = pop(lt, a, rib ? 0.4 : 0.35); if (rib) K.ribbon(text, x, y, p, size); else K.slip(text, x, y, p, rot, size); return a; };
  const cues = (st, list) => { cue(st, 'whoosh'); for (const [a, ty, g] of list) cue(st + a, ty, g ? { gain: g } : {}); };
  const W_ = (w, i, st) => Wd(w, i) - st;

  // 1 · previous part: army reached Lanka
  { const st = 0;
    add({ id: 'S01', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: army at left shore, Lanka right across the sea', draw(lt, d, t) {
      dayPage(191); river(t, 1200); lanka(850, 1160, 0.5, 0); ground(1440, '#C9B27A');
      R(400, 1580, 480, 1); vanaraRow(110, 1580, 2, 110, 380, 1, t);
      tx(lt, st, 0, 'पिछले', 'पिछले', 270, 330, 62); tx(lt, st, 0, 'भाग', 'भाग में', 800, 330, 62, 0.03);
      tx(lt, st, 0, 'सेना', 'सेना', 270, 520, 62); tx(lt, st, 0, 'लंका', 'लंका', 640, 700, 110, 0, true);
      tx(lt, st, 0, 'पहुँची', 'पहुँची थी', 280, 760, 54, 0.03);
    } });
    cues(st, [[W_('पिछले', 0, st), 'pop', 0.5], [W_('भाग', 0, st), 'pop', 0.5], [W_('सेना', 0, st), 'pop', 0.5], [W_('लंका', 0, st), 'thud', 0.6], [W_('पहुँची', 0, st), 'pop', 0.4]]); }

  // 2 · Angada goes to Ravana's court with a peace message
  { const st = st_(1);
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Angada (purple vanara) walks to Ravana on throne at right', draw(lt, d, t) {
      dayPage(193); ground(1420, P.land); throne(850, 1500, 1.0);
      const w = eio(clamp(lt / 3)); vanara(lerp(120, 390, w), 1560, 500, '#6B4A8A', 1, false, 20);
      ravana(850, 1500, 480, -1);
      tx(lt, st, 1, 'पहले', 'पहले', 270, 330, 62); tx(lt, st, 1, 'अंगद', 'अंगद', 420, 520, 120, 0, true);
      tx(lt, st, 1, 'शांति', 'शांति का', 780, 330, 58, 0.03); tx(lt, st, 1, 'संदेश', 'संदेश', 270, 720, 62);
      tx(lt, st, 1, 'रावण', 'रावण के दरबार', 700, 740, 52, 0.03);
    } });
    cues(st, [[W_('पहले', 1, st), 'pop', 0.5], [W_('अंगद', 1, st), 'thud', 0.6], [W_('शांति', 1, st), 'pop', 0.5], [W_('संदेश', 1, st), 'pop', 0.5], [W_('रावण', 1, st), 'pop', 0.4]]); }

  // 3 · Ravana does not agree
  { const st = st_(2);
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Ravana large on throne, turned away from Angada small at left', draw(lt, d, t) {
      dayPage(195); ground(1420, P.land); throne(700, 1500, 1.1);
      ravana(700, 1500, 560, -1); vanara(160, 1560, 380, '#6B4A8A', 1, false, 0);
      tx(lt, st, 2, 'रावण', 'रावण', 270, 330, 66); tx(lt, st, 2, 'नहीं', 'नहीं', 800, 330, 66, 0.03);
      tx(lt, st, 2, 'माना', 'नहीं माना', 540, 560, 120, 0, true);
    } });
    cues(st, [[W_('रावण', 2, st), 'pop', 0.5], [W_('नहीं', 2, st), 'pop', 0.5], [W_('माना', 2, st), 'thud', 0.7]]); }

  // 4 · two armies face each other
  { const st = st_(3);
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'night: vanara army with torches left, Ravana soldiers right, facing', draw(lt, d, t) {
      nightPage(197, 0.7); ground(1400, GROUND);
      const w = eio(clamp(lt / 1.8));
      vanaraRow(lerp(-100, 60, w), 1580, 3, 150, 400, 1, t); torch(lerp(-100, 60, w) + 480, 1580, 1.3, t, 1);
      for (let i = 0; i < 3; i++) prince(lerp(1180, 1010, w) - i * 130, 1580, 400, '#3A2A38', -1, 0); torch(lerp(1180, 1010, w) - 400, 1580, 1.3, t, 2);
      tx(lt, st, 3, 'तब', 'तब', 270, 330, 66); tx(lt, st, 3, 'दोनों', 'दोनों', 790, 330, 62, 0.03);
      tx(lt, st, 3, 'सेनाएँ', 'सेनाएँ', 280, 520, 60); tx(lt, st, 3, 'आमने', 'आमने सामने', 560, 720, 100, 0, true);
    } });
    cues(st, [[W_('तब', 3, st), 'pop', 0.5], [W_('दोनों', 3, st), 'pop', 0.4], [W_('सेनाएँ', 3, st), 'pop', 0.5], [W_('आमने', 3, st), 'thud', 0.6]]); }

  // 5 · Lakshmana falls unconscious
  { const st = st_(4);
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.08, note: 'night: Lakshmana (wine) lying on ground, Rama kneeling beside', draw(lt, d, t) {
      nightPage(199, 0.75); ground(1400, GROUND);
      const f = eio(clamp(lt / 1.2)); lying(760, 1560, 520, P.wine, lerp(0, -Math.PI / 2, f)); R(190, 1560, 480, 1);
      tx(lt, st, 4, 'युद्ध', 'युद्ध में', 270, 330, 60); tx(lt, st, 4, 'लक्ष्मण', 'लक्ष्मण', 790, 330, 64, 0.03);
      tx(lt, st, 4, 'घायल', 'घायल', 270, 520, 62); tx(lt, st, 4, 'मूर्छित', 'मूर्छित', 700, 760, 110, 0, true);
    } });
    cues(st, [[W_('युद्ध', 4, st), 'pop', 0.5], [W_('लक्ष्मण', 4, st), 'pop', 0.5], [W_('घायल', 4, st), 'pop', 0.4], [W_('मूर्छित', 4, st), 'thud', 0.7]]); }

  // 6 · Rama is sad
  { const st = st_(5);
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'night: Rama large, head bowed beside Lakshmana lying', draw(lt, d, t) {
      nightPage(201, 0.78); ground(1400, GROUND);
      lying(860, 1560, 420, P.wine, -Math.PI / 2); R(300, 1580, 640, 1);
      tx(lt, st, 5, 'राम', 'राम का', 270, 330, 62); tx(lt, st, 5, 'मन', 'मन', 790, 330, 66, 0.03);
      tx(lt, st, 5, 'बहुत', 'बहुत', 280, 520, 58); tx(lt, st, 5, 'दुखी', 'दुखी', 640, 700, 120, 0, true);
    } });
    cues(st, [[W_('राम', 5, st), 'pop', 0.5], [W_('मन', 5, st), 'pop', 0.4], [W_('बहुत', 5, st), 'pop', 0.4], [W_('दुखी', 5, st), 'thud', 0.6]]); }

  // 7 · Jambavan sends Hanuman toward the Himalaya
  { const st = st_(6);
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Jambavan and Hanuman at bottom left, Himalaya peaks top right, crimson route', draw(lt, d, t) {
      dayPage(203); ground(1420, P.land);
      cut(P_poly([[540, 1000], [760, 560], [880, 760], [980, 460], [1180, 1000]]), '#C9CED6', { shadow: 0.7, edge: 5 });
      cut(P_poly([[760, 560], [830, 690], [700, 680]]), '#F3E9D2', { shadow: 0.3, edge: 3 }); cut(P_poly([[980, 460], [1050, 620], [920, 620]]), '#F3E9D2', { shadow: 0.3, edge: 3 });
      vanara(150, 1560, 520, '#6E5A4A', 1, false, 0); Hn(420, 1560, 520, 1, 40);
      K.dashedRoute([[500, 1150], [560, 1000], [620, 880], [700, 800]], clamp((lt - W_('हिमालय', 6, st) + 0.1) / 1.2));
      tx(lt, st, 6, 'जांबवान', 'जांबवान ने', 330, 330, 58); tx(lt, st, 6, 'हनुमान', 'हनुमान को', 800, 330, 58, 0.03);
      tx(lt, st, 6, 'हिमालय', 'हिमालय', 300, 520, 110, 0, true); tx(lt, st, 6, 'की', 'की ओर भेजा', 700, 1000, 52, 0.03);
    } });
    cues(st, [[W_('जांबवान', 6, st), 'pop', 0.5], [W_('हनुमान', 6, st), 'pop', 0.5], [W_('हिमालय', 6, st), 'thud', 0.6], [W_('की', 6, st), 'pop', 0.4]]); }

  // 8 · Hanuman flies and lifts the whole mountain
  { const st = st_(7);
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Hanuman flying high holding Sanjeevani mountain overhead', draw(lt, d, t) {
      dayPage(205); hills(1330, ['#8E9B66', '#6F8250'], 1.0); ground(1400, P.land);
      const w = eio(clamp(lt / 2.8)); const ys = lerp(1450, 1050, w);
      sanjeevani(770, ys - 480, 0.9, clamp((lt - 1.5) / 1.0), t); Hn(770, ys + 50, 520, 1, 120);
      tx(lt, st, 7, 'हनुमान', 'हनुमान', 250, 330, 62); tx(lt, st, 7, 'उड़कर', 'उड़कर', 250, 480, 62, 0.03);
      tx(lt, st, 7, 'पहुँचे', 'पहुँचे', 250, 630, 58); tx(lt, st, 7, 'पर्वत', 'पूरा पर्वत', 300, 860, 100, 0, true);
    } });
    cues(st, [[W_('हनुमान', 7, st), 'pop', 0.5], [W_('उड़कर', 7, st), 'pop', 0.5], [W_('पहुँचे', 7, st), 'pop', 0.4], [W_('पर्वत', 7, st), 'thud', 0.7]]); }

  // 9 · Lakshmana rises again
  { const st = st_(8);
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'day: Lakshmana standing, Rama beside, glowing mountain, sparkles', draw(lt, d, t) {
      dayPage(207); hills(1330, ['#8E9B66', '#6F8250'], 0.9); ground(1400, P.land);
      sanjeevani(880, 1420, 0.55, 1, t); sparkles(540, 1050, t, 8, 240);
      const u = eio(clamp((lt - W_('फिर', 8, st) + 0.2) / 0.8)); R(170, 1560, 520, 1);
      if (u < 1) lying(700, 1560, 520, P.wine, lerp(-Math.PI / 2, 0, u)); else LK(700, 1560, 520, 1);
      tx(lt, st, 8, 'संजीवनी', 'संजीवनी से', 340, 330, 62); tx(lt, st, 8, 'लक्ष्मण', 'लक्ष्मण', 800, 330, 62, 0.03);
      tx(lt, st, 8, 'फिर', 'फिर', 270, 520, 60); tx(lt, st, 8, 'खड़े', 'उठ खड़े हुए', 640, 700, 100, 0, true);
    } });
    cues(st, [[W_('संजीवनी', 8, st), 'sparkle'], [W_('लक्ष्मण', 8, st), 'pop', 0.5], [W_('फिर', 8, st), 'pop', 0.4], [W_('खड़े', 8, st), 'thud', 0.7]]); }

  // 10 · next part
  { const st = st_(9), bh = Wd('भाग', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 950], zoom: 0.06, note: 'क्रमशः ribbon, seal १४, teaser slip', draw(lt, d, t) {
      nightPage(14, 0.9); K.ribbon('क्रमशः', 540, 600, pop(lt, 0.05, 0.4), 130);
      const s = pop(lt, 0.3, 0.35); if (s > 0) K.seal(540, 1030, 1.3 * s, '१४');
      K.slip('अगला भाग: रावण का अंत', 540, 1330, pop(lt, bh, 0.3), 0.02, 52);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + 0.3, 'thud', { gain: 0.7 }); cue(st + bh, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
