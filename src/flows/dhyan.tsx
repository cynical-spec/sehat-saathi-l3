import type { ConvoApi } from '../engine/conversation';
import type { Lang } from '../i18n/I18nContext';
import { InfoCard, FinalNote } from '../engine/cards';
import { LottiePlayer } from '../engine/LottiePlayer';
import { Icon } from '../engine/icons';

const pick = (lang: Lang) => (en: string, hi: string) => (lang === 'en' ? en : hi);

/** Aaj ka dhyan — a short guided meditation with a calm animation. */
export async function runDhyan(api: ConvoApi, lang: Lang) {
  const L = pick(lang);

  await api.saathi(
    <>
      {L('Aaj ka dhyan 🕉️ — three quiet minutes, just for you. ', 'आज का ध्यान 🕉️ — तीन शांत मिनट, सिर्फ़ आपके लिए। ')}
      {L('Sit comfortably, and let’s begin.', 'आराम से बैठिए, और शुरू करते हैं।')}
    </>
  );
  await api.card(
    <InfoCard
      media={<LottiePlayer name="lottie-meditation" size={56} />}
      kicker={L('Aaj ka dhyan · 3 min', 'आज का ध्यान · 3 मिनट')}
      kickTone="pk"
      title={L('Stillness & breath', 'ठहराव और साँस')}
      body={L('A gentle body-and-breath reset — no experience needed. Just follow my voice.', 'शरीर और साँस का हल्का reset — किसी अनुभव की ज़रूरत नहीं। बस मेरी आवाज़ के साथ चलें।')}
    />
  );

  const go = await api.choices([{ value: 'go', label: L('Begin', 'शुरू करें') }]);
  if (go) await api.me(L('Begin', 'शुरू करें'));

  await api.card(<div className="dhyan-stage"><LottiePlayer name="lottie-meditation" size={150} /></div>);
  const lines: string[] = [
    L('Close your eyes… and let the shoulders soften.', 'आँखें बंद करें… और कंधों को ढीला छोड़ें।'),
    L('Breathe in slowly… feel the chest rise.', 'धीरे साँस लें… महसूस करें छाती उठती है।'),
    L('Breathe out… let the day’s weight go.', 'साँस छोड़ें… दिन का बोझ जाने दें।'),
    L('Rest here a moment… nothing to do, nowhere to be.', 'यहीं ठहरें… कुछ करना नहीं, कहीं जाना नहीं।'),
  ];
  for (const line of lines) {
    await api.saathi(line);
    await api.wait(1600);
  }
  await api.saathi(
    <>
      <Icon.check /> {L('Gently open your eyes. Notice how much lighter you feel. 💜', 'धीरे से आँखें खोलें। महसूस करें कितना हल्कापन है। 💜')}
    </>
  );
  await api.card(
    <FinalNote>
      {L(
        'This is L3 care — it didn’t wait to be asked. It gave the caregiver a moment of calm too, because looking after everyone starts with you.',
        'यही L3 देखभाल है — इसने पूछे जाने का इंतज़ार नहीं किया। देखभाल करने वाले को भी सुकून का एक पल दिया, क्योंकि सबका ख्याल आपसे शुरू होता है।'
      )}
    </FinalNote>
  );
}
