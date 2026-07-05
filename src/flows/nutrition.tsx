import type { ConvoApi } from '../engine/conversation';
import type { Lang } from '../i18n/I18nContext';
import { ScanFrame, DetectChips, InfoCard, NutriTags, StepCard, FinalNote } from '../engine/cards';
import { LottiePlayer } from '../engine/LottiePlayer';
import { Icon } from '../engine/icons';

const pick = (lang: Lang) => (en: string, hi: string) => (lang === 'en' ? en : hi);
const art = (name: string, size = 48) => <LottiePlayer name={name} size={size} />;

/** F — Kitchen nutrition: snap the fridge → AI sees ingredients → a nourishing meal → cook-along.
 *  The headline "magic" flow. No medical claims — nutrition framing only. */
export async function runNutrition(api: ConvoApi, lang: Lang) {
  const L = pick(lang);

  await api.saathi(
    <>
      {L('Let’s turn what’s already in your kitchen into a nourishing meal for tonight. ', 'जो आपकी रसोई में है उसी से आज रात के लिए एक पौष्टिक खाना बनाते हैं। ')}
      <b>{L('Snap a photo of your fridge or shelf 📸', 'फ्रिज या शेल्फ की फोटो लीजिए 📸')}</b>
    </>
  );
  const snap = await api.choices([
    { value: 'snap', label: L('📸 Take a photo', '📸 फोटो लें') },
    { value: 'gallery', label: L('Choose from gallery', 'गैलरी से चुनें'), ghost: true },
  ]);
  await api.me(snap === 'snap' ? L('📸 Photo taken', '📸 फोटो ली') : L('🖼️ Chosen from gallery', '🖼️ गैलरी से चुनी'), true);

  await api.card(<ScanFrame label={L('Looking inside your kitchen…', 'रसोई में देख रही हूँ…')} foods={['🍅', '🧅', '🥬', '🧄', '🫙', '🥛', '🫚', '🥔']} />);
  await api.wait(1700);
  await api.card(
    <DetectChips
      title={L('I can see:', 'मुझे दिख रहा है:')}
      items={[L('🍅 Tomatoes', '🍅 टमाटर'), L('🥬 Spinach', '🥬 पालक'), L('🧅 Onion', '🧅 प्याज़'), L('🧄 Garlic', '🧄 लहसुन'), L('🧀 Paneer', '🧀 पनीर'), L('🥛 Curd', '🥛 दही')]}
    />
  );
  await api.saathi(L('Lovely — plenty of iron and protein here. Here’s a wholesome dinner for tonight:', 'बढ़िया — यहाँ खूब आयरन और प्रोटीन है। आज रात के लिए एक पौष्टिक डिनर:'));

  await api.card(
    <InfoCard
      media={art('lottie-mortar', 56)}
      kicker={L('Tonight’s meal · from your kitchen', 'आज का खाना · आपकी रसोई से')}
      kickTone="ok"
      title={L('Palak Paneer + Jeera Rice', 'पालक पनीर + जीरा चावल')}
      body={
        <>
          {L('Ready in ~30 min · serves 4. Gentle, home-style, and full of greens. ', 'लगभग 30 मिनट · 4 लोगों के लिए। हल्का, घर जैसा, और हरी सब्ज़ी से भरपूर। ')}
          <NutriTags tags={[L('Iron-rich', 'आयरन'), L('High protein', 'प्रोटीन'), L('Good fibre', 'फाइबर')]} />
        </>
      }
    />
  );
  const go = await api.choices([
    { value: 'go', label: L('Cook it with me', 'मेरे साथ बनाएँ') },
    { value: 'other', label: L('Suggest another', 'दूसरा सुझाएँ'), ghost: true },
  ]);
  if (go !== 'go') {
    await api.me(L('Suggest another', 'दूसरा सुझाएँ'));
    await api.saathi(L('Sure — I can also do a light khichdi or a veg pulao with the same things. Just say the word. 🙂', 'ज़रूर — इन्हीं चीज़ों से हल्की खिचड़ी या वेज पुलाव भी बन सकता है। बस बताइए। 🙂'));
    return;
  }
  await api.me(L('Cook it with me', 'मेरे साथ बनाएँ'));
  await api.saathi(L('Let’s make it together — I’ll guide each step, hands-free. 🎧', 'चलिए साथ बनाते हैं — हर चरण बताऊँगी, बिना हाथ लगाए। 🎧'));

  const steps: [string, string][] = [
    ['motion-prep', L('Sauté onion, garlic & tomato till soft.', 'प्याज़, लहसुन व टमाटर नरम होने तक भूनें।')],
    ['lottie-mortar', L('Add chopped spinach; cook 3–4 min.', 'कटी पालक डालें; 3–4 मिनट पकाएँ।')],
    ['motion-warmdrink', L('Fold in paneer cubes; simmer gently.', 'पनीर के टुकड़े मिलाएँ; धीमी आँच पर पकाएँ।')],
    ['motion-water', L('Serve hot with jeera rice. Done!', 'जीरा चावल के साथ गरम परोसें। हो गया!')],
  ];
  for (let i = 0; i < steps.length; i++) {
    await api.card(<StepCard art={art(steps[i][0], 130)} label={L(`Step ${i + 1} of ${steps.length}`, `चरण ${i + 1} / ${steps.length}`)} instruction={steps[i][1]} step={i + 1} total={steps.length} />);
    await api.wait(750);
  }
  await api.saathi(
    <>
      <Icon.check /> {L('Enjoy the meal — a photo just became a home-cooked dinner. 💜', 'खाने का आनंद लें — एक फोटो घर के बने डिनर में बदल गई। 💜')}
    </>
  );
  await api.card(
    <FinalNote>
      {L(
        'This is the magic: no typing, no searching. A photo of your kitchen became a nourishing, home-style meal you can cook tonight.',
        'यही जादू है: न टाइपिंग, न खोज। रसोई की एक फोटो आज रात के पौष्टिक, घर जैसे खाने में बदल गई।'
      )}
    </FinalNote>
  );
}
