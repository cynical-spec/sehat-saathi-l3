import { useState } from 'react';
import { useLang } from '../i18n/I18nContext';
import { Composer } from '../engine/chrome';
import { Icon } from '../engine/icons';
import { LottiePlayer } from '../engine/LottiePlayer';
import { HOUSEHOLD_AVATARS } from '../data/personas';
import type { FlowKey } from '../App';

export type Phase = 'new' | 'returning';

/* Sehat Saathi — Family health home (JBIQ Home Spine · section8_revised).
   Order: Persistent → Updates → For You → Continue → Discover → Moments.
   SAFETY: no medical conditions / diagnoses / vitals shown anywhere.
   Astro = the richness reference (imagery, gradient, Lottie), not the layout.
   All card/tile clicks route into chat (Section 8 · 8a). */

export function HealthHome({ phase, onOpen, onVoice, onHub }: { phase: Phase; onOpen: (f: FlowKey) => void; onVoice: () => void; onHub: () => void }) {
  const { lang, setLang } = useLang();
  const L = (en: string, hi: string) => (lang === 'en' ? en : hi);
  const isNew = phase === 'new';

  const strip: { icon: keyof typeof Icon; label: string; flow: FlowKey }[] = [
    { icon: 'activity', label: L('Not well?', 'ठीक नहीं?'), flow: 'triage' },
    { icon: 'leaf', label: L('Remedies', 'नुस्खे'), flow: 'remedy-featured' },
    { icon: 'bell', label: L('Reminders', 'रिमाइंडर'), flow: 'care' },
    { icon: 'wind', label: L('Breathe', 'साँस'), flow: 'breathe-featured' },
    { icon: 'carePulse', label: L('Family', 'परिवार'), flow: 'care' },
  ];

  return (
    <div className="screen">
      {/* 01 · Persistent — chrome */}
      <div className="hh-head">
        <button className="ps-hub" onClick={onHub} aria-label="family hub">
          <span className="hhav">
            {HOUSEHOLD_AVATARS.map((a, i) => (
              <span key={i} style={{ background: a.color }}>{a.label}</span>
            ))}
          </span>
          <span className="ps-hub-add"><Icon.plus /></span>
          <span className="ps-hub-lb">{L('Family', 'परिवार')}</span>
        </button>
        <div className="langtoggle">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'hi' ? 'on' : ''} onClick={() => setLang('hi')}>हिं</button>
        </div>
      </div>

      <div className="scroll hh-scroll">
        {/* 01 · Persistent — greeting + value ribbon */}
        <div className="hh-hero" style={{ animation: 'fadeInUp 500ms ease-out both' }}>
          <div className="hh-hero-glow" />
          <div className="hh-hero-lot"><LottiePlayer name="lottie-meditation" size={92} /></div>
          <div className="hh-hi">{isNew ? L('Namaste 🙏', 'नमस्ते 🙏') : L('Good evening, Sunita 🙏', 'शुभ संध्या, सुनीता 🙏')}</div>
          <div className="hh-hero-title">{isNew ? L('Your family’s\nhealth companion', 'आपके परिवार का\nहेल्थ साथी') : L('How is everyone\nat home today?', 'घर में सब\nकैसे हैं आज?')}</div>
          <div className="hh-ribbon">
            <Icon.carePulse />
            {isNew ? L('Care, remedies & reminders — in your language', 'देखभाल, नुस्खे व रिमाइंडर — आपकी भाषा में') : L('This week · 12 caring check-ins for your family', 'इस हफ़्ते · परिवार के लिए 12 बार ध्यान')}
          </div>
        </div>

        {/* 01 · Persistent — use-case strip */}
        <div className="strip">
          {strip.map((s, i) => {
            const IconC = Icon[s.icon];
            return (
              <button className="strip-item" key={i} onClick={() => onOpen(s.flow)}>
                <span className={`strip-ic t${i % 3}`}><IconC /></span>
                <span className="strip-lb">{s.label}</span>
              </button>
            );
          })}
        </div>

        {isNew ? <NewSections L={L} onOpen={onOpen} onHub={onHub} /> : <ReturningSections L={L} onOpen={onOpen} />}

        {/* CTA */}
        <div className="hh-cta-wrap">
          <div className="hh-cta">
            <span className="hh-cta-star" style={{ top: 12, right: 18 }}>✨</span>
            <span className="hh-cta-star" style={{ bottom: 16, left: 22, fontSize: 13 }}>⭐</span>
            <div className="hh-cta-kick">{L('Every day', 'हर दिन')}</div>
            <div className="hh-cta-title">{isNew ? L('Set up your family in 30 seconds', '30 सेकंड में परिवार सेट करें') : L('Let me care for your family, daily', 'रोज़ आपके परिवार का ख्याल रखने दें')}</div>
            <div className="hh-cta-sub">{L('Remedies, reminders in your own voice, and gentle daily check-ins — for everyone at home.', 'नुस्खे, आपकी अपनी आवाज़ में रिमाइंडर, और रोज़ हल्की देखभाल — घर में सबके लिए।')}</div>
            <button className="hh-cta-btn" onClick={() => (isNew ? onHub() : onOpen('care'))}>
              <span>💜</span> {isNew ? L('Add your family', 'परिवार जोड़ें') : L('Continue daily care', 'रोज़ की देखभाल जारी रखें')} <span>→</span>
            </button>
          </div>
        </div>
        <div style={{ height: 8 }} />
      </div>

      <Composer onSpeak={onVoice} onSend={() => onOpen('triage')} />
    </div>
  );
}

/* ---------- shared bits ---------- */
function SectionHeader({ title, sub, tag }: { title: string; sub?: string; tag?: string }) {
  return (
    <div className="hh-sec" style={{ animation: 'fadeInUp 500ms ease-out both' }}>
      <div className="hh-sec-row">
        <div className="hh-sec-t">{title}</div>
        {tag && <span className="ps-sec-tag"><Icon.star /> {tag}</span>}
      </div>
      {sub && <div className="hh-sec-s">{sub}</div>}
    </div>
  );
}

function FeatureCard({ lottie, kicker, title, sub, cta, grad, onClick }: { lottie: string; kicker: string; title: string; sub: string; cta: string; grad: string; onClick: () => void }) {
  return (
    <button className="featurecard" style={{ background: grad }} onClick={onClick}>
      <div className="featurecard-lot"><LottiePlayer name={lottie} size={88} /></div>
      <div className="featurecard-body">
        <div className="featurecard-kick">{kicker}</div>
        <div className="featurecard-title">{title}</div>
        <div className="featurecard-sub">{sub}</div>
        <span className="featurecard-go">{cta} <Icon.chevron /></span>
      </div>
    </button>
  );
}

function ActionCard({ icon, tone, title, sub, onClick }: { icon: keyof typeof Icon; tone: string; title: string; sub: string; onClick: () => void }) {
  const IconC = Icon[icon];
  return (
    <button className="xcard" onClick={onClick}>
      <span className={`xicon ${tone}`}><IconC /></span>
      <span className="xbody">
        <span className="xtitle">{title}</span>
        <span className="xsub">{sub}</span>
      </span>
      <span className="go"><Icon.chevron /></span>
    </button>
  );
}

/* ---------- NEW user (cold start · discovery-led 70:30 · no family data) ---------- */
function NewSections({ L, onOpen, onHub }: { L: (e: string, h: string) => string; onOpen: (f: FlowKey) => void; onHub: () => void }) {
  return (
    <>
      {/* 02 · Updates — guided */}
      <button className="up up-guide" onClick={onHub}>
        <span className="up-ic"><Icon.plus /></span>
        <span className="up-b">
          <span className="up-t">{L('Set up your family 👋', 'अपना परिवार जोड़ें 👋')}</span>
          <span className="up-s">{L('Add who you care for — I’ll look after each by name.', 'जिनका ख्याल रखती हैं जोड़ें — हर एक की देखभाल नाम से।')}</span>
        </span>
        <span className="up-go"><Icon.chevron /></span>
      </button>

      {/* 03 · For You — magic nutrition hero + daily carousel + actions */}
      <SectionHeader title={L('Start here', 'यहाँ से शुरू करें')} />
      <NutritionHero L={L} onOpen={onOpen} />
      <SectionHeader title={L('Aaj ke liye', 'आज के लिए')} sub={L('Tap to begin — for the whole family', 'शुरू करने दबाएँ — पूरे परिवार के लिए')} />
      <AajKeLiye L={L} onOpen={onOpen} />
      <div className="cards">
        <ActionCard icon="activity" tone="tri" title={L('Someone unwell at home?', 'घर में कोई ठीक नहीं?')} sub={L('Tell me who & what — I’ll guide you, gently.', 'बताइए किसे व क्या — मैं आराम से मार्गदर्शन करूँगी।')} onClick={() => onOpen('triage')} />
        <ActionCard icon="bell" tone="rem" title={L('Reminders in your own voice', 'आपकी आवाज़ में रिमाइंडर')} sub={L('So a loved one never misses what matters.', 'ताकि अपने कभी कुछ ज़रूरी न भूलें।')} onClick={() => onOpen('care')} />
      </div>

      {/* 05 · Discover */}
      <SectionHeader title={L('Explore', 'और भी')} tag={L('discover', 'नया')} />
      <div className="disc">
        <DiscChip icon="wind" label={L('Calm & better sleep', 'सुकून व अच्छी नींद')} onClick={() => onOpen('breathe-featured')} />
        <DiscChip icon="leaf" label={L('More home remedies', 'और घरेलू नुस्खे')} onClick={() => onOpen('remedy')} />
      </div>
    </>
  );
}

/* ---------- RETURNING user (personalized · safe · consumption-led 30:70) ---------- */
function ReturningSections({ L, onOpen }: { L: (e: string, h: string) => string; onOpen: (f: FlowKey) => void }) {
  const defaultLine = L('This week, our family felt looked after 💜', 'इस हफ़्ते, हमारे परिवार को अपनापन मिला 💜');
  const [line, setLine] = useState(defaultLine);
  const [edited, setEdited] = useState(false);

  return (
    <>
      {/* 02 · Updates — carousel (≤2, safe/care) */}
      <SectionHeader title={L('For you now', 'अभी आपके लिए')} />
      <div className="up-carousel hh-scroll">
        <button className="up" onClick={() => onOpen('care')}>
          <span className="up-ic ok"><Icon.check /></span>
          <span className="up-b">
            <span className="up-t">{L('Papa’s reminder played in your voice ✓', 'पापा का रिमाइंडर आपकी आवाज़ में चला ✓')}</span>
            <span className="up-s">{L('Anything you’d like to note?', 'कुछ नोट करना चाहेंगी?')}</span>
          </span>
        </button>
        <button className="up up-warn" onClick={() => onOpen('care')}>
          <span className="up-ic warn"><Icon.bell /></span>
          <span className="up-b">
            <span className="up-t">{L('Time for the evening check-in', 'शाम की हाल-चाल का समय')}</span>
            <span className="up-s">{L('A quick hello to everyone at home?', 'घर में सबका हाल पूछ लें?')}</span>
          </span>
        </button>
      </div>

      {/* 03 · For You — magic nutrition hero + daily carousel + actions */}
      <SectionHeader title={L('For your family today', 'आज आपके परिवार के लिए')} />
      <NutritionHero L={L} onOpen={onOpen} />
      <SectionHeader title={L('Aaj ke liye', 'आज के लिए')} sub={L('Tap to begin — for the whole family', 'शुरू करने दबाएँ — पूरे परिवार के लिए')} />
      <AajKeLiye L={L} onOpen={onOpen} />
      <div className="cards">
        <ActionCard icon="carePulse" tone="care" title={L('Evening walk reminder for Papa', 'पापा के लिए शाम की सैर रिमाइंडर')} sub={L('A gentle nudge, in your own voice.', 'आपकी अपनी आवाज़ में एक प्यारा इशारा।')} onClick={() => onOpen('care')} />
        <ActionCard icon="wind" tone="tri" title={L('Breathe before bed', 'सोने से पहले साँस')} sub={L('4 calm minutes to wind down.', '4 मिनट का सुकून, सोने से पहले।')} onClick={() => onOpen('breathe-featured')} />
      </div>

      {/* 04 · Continue */}
      <SectionHeader title={L('Continue', 'जारी रखें')} />
      <button className="cont" onClick={() => onOpen('care')}>
        <div className="cont-top">
          <span className="cont-lb">{L('Caring for your family', 'परिवार की देखभाल')}</span>
          <span className="cont-streak">🔥 {L('6-day streak', '6 दिन')}</span>
        </div>
        <div className="cont-bar"><i style={{ width: '86%' }} /></div>
        <div className="cont-sub">{L('Reminders & check-ins on track — pick up today.', 'रिमाइंडर व हाल-चाल सही राह पर — आज जारी रखें।')}</div>
      </button>

      {/* 05 · Discover */}
      <SectionHeader title={L('While you’re here', 'जब आप यहाँ हैं')} tag={L('discover', 'नया')} />
      <div className="disc">
        <DiscChip icon="wind" label={L('Breathing for better sleep', 'नींद के लिए साँस')} onClick={() => onOpen('breathe-featured')} />
        <DiscChip icon="leaf" label={L('A remedy for the season', 'मौसम का नुस्खा')} onClick={() => onOpen('remedy')} />
      </div>

      {/* 06 · Moments — editable, share disabled until customised */}
      <SectionHeader title={L('This week', 'इस सप्ताह')} />
      <div className="moment">
        <div className="moment-b">
          <div className="moment-t">{L('A caring week for your family 💜', 'परिवार के लिए एक अपनापन भरा हफ़्ता 💜')}</div>
          <input className="moment-edit" value={line} onChange={(e) => { setLine(e.target.value); setEdited(true); }} aria-label={L('personalise before sharing', 'शेयर से पहले अपने शब्दों में')} />
          {!edited && <div className="moment-hint">{L('Add your words to share ✎', 'शेयर करने के लिए अपने शब्द जोड़ें ✎')}</div>}
        </div>
        <button className="moment-share" aria-label="share" disabled={!edited}><Icon.share /></button>
      </div>
    </>
  );
}

function DiscChip({ icon, label, onClick }: { icon: keyof typeof Icon; label: string; onClick: () => void }) {
  const IconC = Icon[icon];
  return (
    <button className="discchip" onClick={onClick}>
      <IconC />
      {label}
    </button>
  );
}

/* Magic nutrition hero — snap fridge → family meal */
function NutritionHero({ L, onOpen }: { L: (e: string, h: string) => string; onOpen: (f: FlowKey) => void }) {
  return (
    <FeatureCard
      lottie="lottie-mortar"
      grad="linear-gradient(145deg,#6d17ce,#8a3ee0 45%,#0078ad)"
      kicker={L('📸 Snap your kitchen · new', '📸 रसोई की फोटो · नया')}
      title={L('Tonight’s family meal', 'आज परिवार का खाना')}
      sub={L('A photo → a nourishing recipe → cook-along, by voice.', 'फोटो → पौष्टिक रेसिपी → साथ बनाएँ, आवाज़ में।')}
      cta={L('Snap & cook', 'फोटो लें')}
      onClick={() => onOpen('nutrition')}
    />
  );
}

/* Aaj ke liye — animated daily carousel: nuskha · exercise · dhyan */
function AajKeLiye({ L, onOpen }: { L: (e: string, h: string) => string; onOpen: (f: FlowKey) => void }) {
  const cards: { flow: FlowKey; lottie: string; kicker: string; title: string; sub: string; grad: string }[] = [
    { flow: 'remedy-featured', lottie: 'motion-warmdrink', kicker: L('Aaj ka nuskha', 'आज का नुस्खा'), title: L('Haldi–Adrak Kaadha', 'हल्दी–अदरक काढ़ा'), sub: L('A warm cup for the season', 'मौसम के लिए गरम कप'), grad: 'linear-gradient(150deg,#12b998,#014c3b)' },
    { flow: 'exercise', lottie: 'lottie-yoga', kicker: L('Aaj ka exercise', 'आज का exercise'), title: L('5-min family stretch', '5 मिनट फैमिली स्ट्रेच'), sub: L('Follow-along video ▶', 'साथ चलने वाला वीडियो ▶'), grad: 'linear-gradient(150deg,#1a90c4,#04355a)' },
    { flow: 'dhyan', lottie: 'lottie-meditation', kicker: L('Aaj ka dhyan', 'आज का ध्यान'), title: L('3-min calm', '3 मिनट सुकून'), sub: L('Reset with your breath', 'साँस से ताज़गी'), grad: 'linear-gradient(150deg,#6d17ce,#310064)' },
  ];
  return (
    <div className="hh-stories hh-scroll">
      {cards.map((c, i) => (
        <button key={i} className="storycard" style={{ background: c.grad }} onClick={() => onOpen(c.flow)}>
          <div className="storycard-lot"><LottiePlayer name={c.lottie} size={72} /></div>
          <div className="storycard-kick">{c.kicker}</div>
          <div className="storycard-title">{c.title}</div>
          <div className="storycard-sub">{c.sub}</div>
          <div className="storycard-go">{L('Begin', 'शुरू करें')} <Icon.chevron /></div>
        </button>
      ))}
    </div>
  );
}
