import type { ConvoApi } from '../engine/conversation';
import type { Lang } from '../i18n/I18nContext';
import { BreathCycle, InfoCard, FinalNote } from '../engine/cards';
import { Icon } from '../engine/icons';
import { LottiePlayer } from '../engine/LottiePlayer';

const pick = (lang: Lang) => (en: string, hi: string) => (lang === 'en' ? en : hi);

/** F4 — Breathe & Calm. `featured` enters via the proactive "Aaj ka exercise" hook. */
export async function runBreathe(api: ConvoApi, lang: Lang, featured = false) {
  const L = pick(lang);

  if (featured) {
    await api.saathi(
      <>
        {L('Evenings can feel heavy after a long day. ', 'लंबे दिन के बाद शाम भारी लग सकती है। ')}
        {L("Here's ", 'ये है ')}
        <b>{L("today's exercise", 'आज का exercise')}</b> 🌙
      </>
    );
    await api.card(
      <InfoCard
        media={<LottiePlayer name="lottie-breathe" size={48} />}
        kicker={L('Aaj ka exercise · 4 min', 'आज का exercise · 4 मिनट')}
        kickTone="sp"
        title={L('4-7-8 Calming Breath', '4-7-8 शांत साँस')}
        body={L(
          'Slows a racing mind and helps you wind down before sleep. No prep — just follow my count.',
          'दौड़ते मन को शांत करता है और सोने से पहले सुकून देता है। कोई तैयारी नहीं — बस मेरी गिनती के साथ चलें।'
        )}
      />
    );
    const go = await api.choices([
      { value: 'go', label: L("Let's do it together →", 'चलिए साथ में करें →') },
      { value: 'other', label: L('I need something else', 'कुछ और चाहिए'), ghost: true },
    ]);
    if (go === 'go') {
      await api.me(L("Let's do it", 'चलिए करते हैं'));
      await session(api, lang);
      return;
    }
    await api.me(L('Something else', 'कुछ और'));
  } else {
    await api.saathi(L('I’m here. What are you feeling the most right now?', 'मैं यहीं हूँ। अभी सबसे ज़्यादा क्या महसूस हो रहा है?'));
  }

  const feel = await api.choices([
    { value: 'stress', label: L('Stressed', 'तनाव') },
    { value: 'anx', label: L('Anxious', 'बेचैनी') },
    { value: 'sleep', label: L("Can't sleep", 'नींद नहीं') },
    { value: 'low', label: L('Feeling low', 'उदास') },
  ]);
  await api.me(
    { stress: L('Stressed', 'तनाव'), anx: L('Anxious', 'बेचैनी'), sleep: L("Can't sleep", 'नींद नहीं'), low: L('Feeling low', 'उदास') }[feel]!,
    true
  );
  await api.saathi(L('Thank you for telling me. How much time can you give yourself?', 'बताने के लिए शुक्रिया। खुद को कितना समय दे सकते हैं?'));
  await api.choices([
    { value: '2', label: L('2 min', '2 मिनट') },
    { value: '5', label: L('5 min', '5 मिनट') },
    { value: 'more', label: L('A little more', 'थोड़ा और'), ghost: true },
  ]);
  await api.saathi(L('Perfect. Let’s breathe together — follow the circle and my voice. 🎧', 'बढ़िया। चलिए साथ में साँस लें — घेरे और मेरी आवाज़ के साथ चलें। 🎧'));
  await session(api, lang);
}

async function session(api: ConvoApi, lang: Lang) {
  const L = pick(lang);
  const cycles = [
    { phase: L('Breathe in', 'साँस लें'), count: '4', note: L('Slowly, through your nose.', 'धीरे-धीरे, नाक से।') },
    { phase: L('Hold', 'रोकें'), count: '7', note: L('Gently, no strain.', 'आराम से, ज़ोर न लगाएँ।') },
    { phase: L('Breathe out', 'छोड़ें'), count: '8', note: L('Let the shoulders drop.', 'कंधे ढीले छोड़ें।') },
  ];
  for (const c of cycles) {
    await api.card(<BreathCycle phase={c.phase} count={c.count} note={c.note} />);
    await api.wait(1900);
  }
  await api.saathi(L('One more, on your own… in… and out. 🌸', 'एक बार और, खुद से… अंदर… और बाहर। 🌸'));
  await api.wait(1200);
  await api.saathi(
    <>
      <Icon.check /> {L('Beautiful. Notice how the body feels a little lighter now.', 'बहुत बढ़िया। महसूस करें, शरीर अब थोड़ा हल्का लग रहा है।')}
    </>
  );
  const fb = await api.choices([
    { value: 'calm', label: L('Much calmer', 'काफ़ी शांत') },
    { value: 'bit', label: L('A little', 'थोड़ा'), ghost: true },
  ]);
  await api.me(fb === 'calm' ? L('Much calmer', 'काफ़ी शांत') : L('A little', 'थोड़ा'));
  await api.saathi(L('That’s enough for today. I’ll check in again this evening. 💜', 'आज के लिए इतना काफ़ी है। शाम को फिर हाल पूछूँगी। 💜'));
  await api.card(
    <FinalNote>
      {L(
        'This is L3: it led with today’s exercise instead of waiting to be asked, matched it to the evening, and guided the breathing live — proactive care, not a menu.',
        'यही L3 है: इसने पूछे जाने का इंतज़ार करने के बजाय आज का exercise खुद सुझाया, शाम के अनुसार चुना, और साँस को live गाइड किया — proactive देखभाल, कोई मेन्यू नहीं।'
      )}
    </FinalNote>
  );
}
