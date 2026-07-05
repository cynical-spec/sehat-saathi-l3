import type { ConvoApi } from '../engine/conversation';
import type { Lang } from '../i18n/I18nContext';
import { InfoCard, StepCard, FinalNote } from '../engine/cards';
import { Icon } from '../engine/icons';
import { LottiePlayer } from '../engine/LottiePlayer';

const pick = (lang: Lang) => (en: string, hi: string) => (lang === 'en' ? en : hi);
const art = (name: string, size = 48) => <LottiePlayer name={name} size={size} />;

interface Remedy {
  title: string;
  meta: string;
  proof: string;
  steps: string[];
  media: string; // lottie asset name (public/lottie/<name>.json)
  arts: string[]; // per-step lottie
}

/** F2 — Home Remedies. `featured` enters via the proactive "Aaj ka nuskha" hook. */
export async function runRemedies(api: ConvoApi, lang: Lang, featured = false) {
  const L = pick(lang);

  if (featured) {
    await api.saathi(
      <>
        {L('Coughs are going around these days.', 'आजकल खाँसी-ज़ुकाम फैल रहा है।')}{' '}
        {L("Here's ", 'ये लीजिए ')}
        <b>{L("today's remedy", 'आज का नुस्खा')}</b> 🌿
      </>
    );
    const kaadha: Remedy = {
      title: L('Haldi–Adrak Kaadha', 'हल्दी–अदरक काढ़ा'),
      meta: L('4 steps · 8 min', '4 चरण · 8 मिनट'),
      proof: L('9,200 people made this today', '9,200 लोगों ने आज बनाया'),
      media: 'motion-warmdrink',
      arts: ['motion-water', 'lottie-mortar', 'motion-warmdrink', 'motion-warmdrink'],
      steps: [
        L('Boil 2 cups water with a thumb of crushed ginger.', '2 कप पानी में कुटा हुआ अदरक डालकर उबालें।'),
        L('Add ¼ tsp haldi and 4–5 tulsi leaves.', '¼ छोटा चम्मच हल्दी और 4–5 तुलसी पत्ते डालें।'),
        L('Simmer 5 minutes until it turns golden.', '5 मिनट तक पकाएँ जब तक सुनहरा न हो जाए।'),
        L('Strain, add honey when warm, and sip slowly.', 'छानकर, गुनगुना होने पर शहद मिलाएँ और धीरे-धीरे पिएँ।'),
      ],
    };
    await api.card(
      <InfoCard
        media={art(kaadha.media, 56)}
        kicker={L('Aaj ka nuskha', 'आज का नुस्खा')}
        kickTone="ok"
        title={kaadha.title}
        body={
          <>
            {L(
              'Warms the throat, eases a dry cough, and gives immunity a gentle boost. ',
              'गला गरम रखता है, सूखी खाँसी में आराम देता है और इम्युनिटी बढ़ाता है। '
            )}
            <b>{kaadha.proof}</b>
          </>
        }
      />
    );
    const choice = await api.choices([
      { value: 'go', label: L('Walk me through it', 'बनाना सिखाइए') },
      { value: 'other', label: L('Show other remedies', 'दूसरे नुस्खे दिखाइए'), ghost: true },
    ]);
    if (choice === 'go') {
      await api.me(L('Walk me through it', 'बनाना सिखाइए'));
      await walkthrough(api, lang, kaadha);
      return;
    }
    await api.me(L('Show other remedies', 'दूसरे नुस्खे दिखाइए'));
  } else {
    await api.saathi(L('Sure — what would you like a remedy for?', 'ज़रूर — किस चीज़ का नुस्खा चाहिए?'));
  }

  // Category browse
  const cat = await api.choices([
    { value: 'digestion', label: L('Digestion', 'पाचन'), sub: L('Gas · Acidity', 'गैस · एसिडिटी') },
    { value: 'immunity', label: L('Immunity', 'इम्युनिटी'), sub: L('Daily · Fatigue', 'रोज़ाना · थकान') },
    { value: 'cold', label: L('Cold & Cough', 'सर्दी–खाँसी'), sub: L('Throat · Seasonal', 'गला · मौसमी') },
    { value: 'skin', label: L('Skin & Hair', 'त्वचा–बाल'), sub: L('Dryness · Glow', 'रूखापन · निखार') },
  ]);
  const catName: Record<string, string> = {
    digestion: L('digestion', 'पाचन'),
    immunity: L('immunity', 'इम्युनिटी'),
    cold: L('cold & cough', 'सर्दी–खाँसी'),
    skin: L('skin & hair', 'त्वचा–बाल'),
  };
  await api.me(catName[cat]);
  await api.saathi(L('How long has this been bothering you?', 'यह परेशानी कब से है?'));
  const dur = await api.choices([
    { value: 'today', label: L('Just today', 'बस आज') },
    { value: 'fewdays', label: L('A few days', 'कुछ दिन') },
    { value: 'often', label: L('Happens often', 'अक्सर होता है') },
  ]);
  await api.me(
    dur === 'today' ? L('Just today', 'बस आज') : dur === 'fewdays' ? L('A few days', 'कुछ दिन') : L('Happens often', 'अक्सर होता है')
  );

  const remedy: Remedy = {
    title: L('Ajwain–Jeera water', 'अजवाइन–जीरा पानी'),
    meta: L('3 steps · 5 min', '3 चरण · 5 मिनट'),
    proof: L('7,400 people found relief', '7,400 लोगों को आराम मिला'),
    media: 'lottie-mortar',
    arts: ['motion-prep', 'motion-water', 'motion-warmdrink'],
    steps: [
      L('Dry-roast 1 tsp ajwain and 1 tsp jeera for a minute.', '1 चम्मच अजवाइन और 1 चम्मच जीरा एक मिनट भूनें।'),
      L('Boil in 2 cups water for 3–4 minutes.', '2 कप पानी में 3–4 मिनट उबालें।'),
      L('Strain and sip warm after your meal.', 'छानकर खाने के बाद गुनगुना पिएँ।'),
    ],
  };
  await api.saathi(
    <>
      {L('For ', '')}
      <b>{catName[cat]}</b>
      {L(', this is what usually helps most:', L('', ' के लिए, आमतौर पर यह सबसे ज़्यादा मदद करता है:'))}
    </>
  );
  await api.card(
    <InfoCard
      media={art(remedy.media, 56)}
      kicker={remedy.meta}
      kickTone="ok"
      title={remedy.title}
      body={
        <>
          {L('Gentle, made from what’s in your kitchen. ', 'सौम्य, आपके रसोई की चीज़ों से बना। ')}
          <b>{remedy.proof}</b>
        </>
      }
    />
  );
  const go = await api.choices([
    { value: 'go', label: L('Try this remedy', 'यह नुस्खा आज़माएँ') },
    { value: 'no', label: L('Not now', 'अभी नहीं'), ghost: true },
  ]);
  if (go === 'go') {
    await api.me(L('Try this remedy', 'यह नुस्खा आज़माएँ'));
    await walkthrough(api, lang, remedy);
  } else {
    await api.saathi(L('No problem. I’m here whenever you need. 🙂', 'कोई बात नहीं। जब भी ज़रूरत हो, मैं यहीं हूँ। 🙂'));
  }
}

async function walkthrough(api: ConvoApi, lang: Lang, remedy: Remedy) {
  const L = pick(lang);
  await api.saathi(L("Let's make it together — I'll guide each step by voice. 🎧", 'चलिए साथ में बनाते हैं — हर चरण आवाज़ में बताऊँगी। 🎧'));
  for (let i = 0; i < remedy.steps.length; i++) {
    await api.card(
      <StepCard
        art={art(remedy.arts[i] ?? remedy.media, 132)}
        label={L(`Step ${i + 1} of ${remedy.steps.length}`, `चरण ${i + 1} / ${remedy.steps.length}`)}
        instruction={remedy.steps[i]}
        step={i + 1}
        total={remedy.steps.length}
      />
    );
    await api.wait(700);
  }
  await api.saathi(L('Done! Sip it slowly while it’s warm. How do you feel?', 'हो गया! गुनगुना रहते धीरे-धीरे पिएँ। अब कैसा लग रहा है?'));
  const fb = await api.choices([
    { value: 'better', label: L('Feeling better', 'बेहतर लग रहा है') },
    { value: 'little', label: L('A little', 'थोड़ा'), ghost: true },
    { value: 'notyet', label: L('Not yet', 'अभी नहीं'), ghost: true },
  ]);
  await api.me(fb === 'better' ? L('Feeling better', 'बेहतर लग रहा है') : fb === 'little' ? L('A little', 'थोड़ा') : L('Not yet', 'अभी नहीं'));
  await api.saathi(
    <>
      <Icon.check /> {L('Lovely. Take rest, stay warm, and have it again tonight if needed.', 'बढ़िया। आराम करें, गरम रहें, और ज़रूरत हो तो रात में दोबारा लें।')}
    </>
  );
  await api.card(
    <FinalNote>
      {L(
        'This is L3: it didn’t wait to be asked — it opened with today’s most relevant remedy, then made it, step by voice, right here.',
        'यही L3 है: इसने पूछे जाने का इंतज़ार नहीं किया — आज का सबसे सही नुस्खा खुद सामने रखा, फिर आवाज़ में यहीं बनवाया।'
      )}
    </FinalNote>
  );
}
