import type { ConvoApi } from '../engine/conversation';
import type { Lang } from '../i18n/I18nContext';
import { AdviceCard, WatchCard, CallCard, DoctorCard, FinalNote } from '../engine/cards';
import { Icon } from '../engine/icons';
import type { SelfProfile } from '../data/personas';

const pick = (lang: Lang) => (en: string, hi: string) => (lang === 'en' ? en : hi);

/** F1 — Symptom triage (self, L3). Uses the profile so it never re-asks known facts,
 *  opens an episodic Recovery Watch, and escalates on its own. No cross-session memory. */
export async function runTriageSelf(api: ConvoApi, lang: Lang, self: SelfProfile) {
  const L = pick(lang);

  await api.saathi(
    <>
      {L('Tell me what’s going on — just speak. ', 'बताइए क्या हो रहा है — बस बोलिए। ')}
      {L('I already know you’re ', 'मुझे पता है आप ')}
      <b>{self.age}</b>
      {L(' and ', ' साल के हैं और ')}
      <b>{L(self.conditionEn, self.conditionHi)}</b>
      {L(', so I’ll keep that in mind.', ', इसलिए यह ध्यान में रखूँगी।')}
    </>
  );
  await api.me(L('Since morning I’ve had a headache and I feel feverish.', 'सुबह से सिरदर्द है और बुखार जैसा लग रहा है।'), true);
  await api.saathi(L('Got it. A few quick things — any of these right now?', 'ठीक है। कुछ जल्दी की बातें — इनमें से कुछ अभी है?'));
  const flag = await api.choices([
    { value: 'stiff', label: L('Stiff neck', 'गर्दन अकड़न'), ghost: true },
    { value: 'vision', label: L('Blurred vision', 'धुंधला दिखना'), ghost: true },
    { value: 'vomit', label: L('Vomiting', 'उल्टी'), ghost: true },
    { value: 'none', label: L('None of these', 'इनमें से कोई नहीं') },
  ]);
  await api.me(flag === 'none' ? L('None of these', 'इनमें से कोई नहीं') : L('One of these', 'इनमें से एक'));
  await api.saathi(L('And how long has the fever feeling been there?', 'और बुखार जैसा कब से लग रहा है?'));
  await api.choices([
    { value: 'today', label: L('Just today', 'बस आज') },
    { value: '2days', label: L('About 2 days', 'करीब 2 दिन') },
  ]);
  await api.me(L('Just today', 'बस आज'));

  await api.saathi(L('One moment… 🤔', 'एक पल… 🤔'));
  await api.card(
    <AdviceCard
      kicker={L('Home care · but let’s keep an eye on it', 'घरेलू देखभाल · पर नज़र रखेंगे')}
      kickTone="warn"
      title={L('Likely a viral fever with a tension headache', 'शायद वायरल बुखार के साथ तनाव-सिरदर्द')}
      body={
        <>
          {L(
            'Rest, sips of water often, a light meal, and the paracetamol dose your doctor advised. ',
            'आराम, थोड़ा-थोड़ा पानी, हल्का खाना, और डॉक्टर की बताई पैरासिटामोल की खुराक। '
          )}
          <b>{L('Because you’re ', 'चूँकि आप ')}{L(self.conditionEn, self.conditionHi)}</b>
          {L(', check your sugar tonight too.', ', आज रात शुगर भी जाँच लें।')}
        </>
      }
      redTitle={L('See a doctor right away if:', 'तुरंत डॉक्टर को दिखाएँ अगर:')}
      redFlags={[
        L('the fever crosses 3 days or 103°F', 'बुखार 3 दिन या 103°F पार करे'),
        L('a stiff neck, rash, or confusion appears', 'गर्दन अकड़न, दाने, या भ्रम हो'),
        L('your sugar readings swing high or low', 'शुगर बहुत ऊपर-नीचे हो'),
      ]}
      buttons={
        <>
          <button className="btn btn--secondary">{L('Got it', 'समझ गया')}</button>
          <button className="btn btn--primary">
            <Icon.heart />
            {L('Find a doctor', 'डॉक्टर खोजें')}
          </button>
        </>
      }
    />
  );
  await api.saathi(L('I’ll check on you tomorrow morning. If it isn’t settling, I’ll help you reach a doctor.', 'कल सुबह हाल पूछूँगी। अगर आराम न हो, तो डॉक्टर तक पहुँचने में मदद करूँगी।'));
  await api.card(<WatchCard title={L('You · fever + headache', 'आप · बुखार + सिरदर्द')} sub={L('Day 1 · watching · I’ll check tomorrow', 'दिन 1 · नज़र में · कल पूछूँगी')} />);

  // Episodic arc — within this illness, not cross-session memory
  api.divider(L('Next morning', 'अगली सुबह'));
  await api.card(
    <CallCard
      initial="S"
      label={L('Checking in', 'हाल पूछ रही')}
      name="Sehat Saathi"
      line={L('Good morning — how is the fever today?', 'सुप्रभात — आज बुखार कैसा है?')}
    />
  );
  await api.me(L('Still there, around 100.', 'अभी भी है, करीब 100।'), true);
  await api.saathi(L('Okay. Keep resting and hydrating — that’s normal for day 2. I’ll check again this evening.', 'ठीक है। आराम और पानी जारी रखें — दिन 2 पर सामान्य है। शाम को फिर पूछूँगी।'));
  await api.card(<WatchCard title={L('You · fever + headache', 'आप · बुखार + सिरदर्द')} sub={L('Day 2 · still watching', 'दिन 2 · नज़र जारी')} />);

  api.divider(L('Day 3 · morning', 'दिन 3 · सुबह'));
  await api.card(
    <CallCard
      danger
      initial="!"
      label={L('Important · calling you', 'ज़रूरी · कॉल कर रही')}
      name={L('Day 3 of fever', 'बुखार का तीसरा दिन')}
      line={
        <>
          {L('Your fever has now lasted 3 days — and with diabetes that needs a check. Please see a doctor ', 'बुखार अब 3 दिन हो गया — और डायबिटीज़ के साथ इसे जाँचना ज़रूरी है। कृपया ')}
          <b>{L('today', 'आज')}</b>{L('.', ' डॉक्टर को दिखाएँ।')}
        </>
      }
    />
  );
  await api.card(
    <DoctorCard
      name={L('Dr. Meera Joshi · Physician', 'डॉ. मीरा जोशी · फिजिशियन')}
      meta={L('Aarogya Clinic · 1.2 km away', 'आरोग्य क्लिनिक · 1.2 किमी')}
      open={L('Open now · till 8 pm', 'अभी खुला · रात 8 बजे तक')}
      callLabel={L('Call clinic', 'क्लिनिक कॉल')}
      dirLabel={L('Directions', 'रास्ता')}
    />
  );
  await api.card(
    <FinalNote>
      {L(
        'This is L3: triage didn’t answer once and vanish. It used your profile (no re-asking), opened a watch, checked back each day, and escalated to a doctor on its own when the fever crossed the safe line for someone with diabetes.',
        'यही L3 है: ट्रायज ने एक बार जवाब देकर गायब नहीं हुआ। इसने आपकी प्रोफ़ाइल इस्तेमाल की (दोबारा नहीं पूछा), नज़र रखी, रोज़ हाल पूछा, और जब डायबिटीज़ वाले के लिए बुखार सुरक्षित सीमा पार कर गया तो खुद डॉक्टर तक पहुँचाया।'
      )}
    </FinalNote>
  );
}
