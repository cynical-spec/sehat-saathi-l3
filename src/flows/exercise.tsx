import type { ConvoApi } from '../engine/conversation';
import type { Lang } from '../i18n/I18nContext';
import { YouTubeCard, InfoCard, FinalNote } from '../engine/cards';
import { LottiePlayer } from '../engine/LottiePlayer';
import { Icon } from '../engine/icons';

const pick = (lang: Lang) => (en: string, hi: string) => (lang === 'en' ? en : hi);

/** Aaj ka exercise — a gentle guided stretch with a real embedded video. */
export async function runExercise(api: ConvoApi, lang: Lang) {
  const L = pick(lang);

  await api.saathi(
    <>
      {L('Aaj ka exercise 🧘 — a gentle 5-minute stretch the whole family can do together. ', 'आज का exercise 🧘 — 5 मिनट का हल्का स्ट्रेच जो पूरा परिवार साथ कर सके। ')}
      {L('No equipment, no rush.', 'न कोई सामान, न जल्दी।')}
    </>
  );
  await api.card(
    <InfoCard
      media={<LottiePlayer name="lottie-yoga" size={56} />}
      kicker={L('Aaj ka exercise · 5 min', 'आज का exercise · 5 मिनट')}
      kickTone="sp"
      title={L('Gentle Morning Stretch', 'हल्का मॉर्निंग स्ट्रेच')}
      body={L('Loosens the shoulders, back and legs — perfect before chai or after waking up.', 'कंधे, पीठ व पैर खोलता है — चाय से पहले या उठने के बाद बढ़िया।')}
    />
  );
  await api.saathi(L('Play along with me — follow the video, go slow, breathe easy. ▶️', 'मेरे साथ चलाइए — वीडियो देखें, धीरे चलें, आराम से साँस लें। ▶️'));
  await api.card(<YouTubeCard id="9o0UPuDBM8M" title={L('Follow-along stretch', 'साथ-साथ स्ट्रेच')} />);

  const done = await api.choices([
    { value: 'done', label: L('Done ✓ Felt good', 'हो गया ✓ अच्छा लगा') },
    { value: 'remind', label: L('Remind me daily', 'रोज़ याद दिलाओ'), ghost: true },
  ]);
  if (done === 'remind') {
    await api.me(L('Remind me daily', 'रोज़ याद दिलाओ'));
    await api.saathi(L('Done — I’ll nudge the family every morning at 7. A little movement, together. 🌿', 'हो गया — हर सुबह 7 बजे परिवार को याद दिलाऊँगी। थोड़ी हलचल, साथ में। 🌿'));
  } else {
    await api.me(L('Done ✓ Felt good', 'हो गया ✓ अच्छा लगा'));
    await api.saathi(
      <>
        <Icon.check /> {L('Lovely — that’s movement for the whole family today. 🌿', 'बढ़िया — आज पूरे परिवार के लिए हलचल हो गई। 🌿')}
      </>
    );
  }
  await api.card(
    <FinalNote>
      {L(
        'A real guided video, right inside the conversation — the family follows along together, no app-hopping, no searching.',
        'एक असली गाइडेड वीडियो, बातचीत के अंदर ही — परिवार साथ-साथ करता है, न ऐप बदलना, न खोजना।'
      )}
    </FinalNote>
  );
}
