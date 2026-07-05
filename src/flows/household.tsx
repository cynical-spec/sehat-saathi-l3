import type { ConvoApi } from '../engine/conversation';
import type { Lang } from '../i18n/I18nContext';
import { AdviceCard, WatchCard, CallCard, InfoCard, RecordCard, PlayBar, FinalNote } from '../engine/cards';
import { runRemedies } from './remedies';

const pick = (lang: Lang) => (en: string, hi: string) => (lang === 'en' ? en : hi);

/** "Not well?" — gentle, non-diagnostic home-comfort guidance that flows into a soothing remedy.
 *  Safety: no diagnoses, no vitals, no scary escalation — comfort + a clear "see a doctor if". */
export async function runTriageHousehold(api: ConvoApi, lang: Lang) {
  const L = pick(lang);
  await api.saathi(L('Who isn’t feeling their best today?', 'आज किसकी तबीयत थोड़ी ठीक नहीं?'));
  await api.choices([
    { value: 'aarav', label: L('Aarav', 'आरव'), sub: L('son', 'बेटा') },
    { value: 'papa', label: L('Papa', 'पापा'), sub: L('father', 'पिता') },
    { value: 'maa', label: L('Maa', 'माँ'), sub: L('mother', 'माँ') },
  ]);
  await api.me(L('Aarav', 'आरव'));
  await api.saathi(L('Okay. Tell me what you’re noticing — just speak, in your words.', 'ठीक है। बताइए क्या महसूस हो रहा है — बस अपने शब्दों में बोलिए।'));
  await api.me(L('He’s a bit warm and low since evening.', 'शाम से थोड़ा गरम और सुस्त है।'), true);
  await api.saathi(L('A couple of gentle things — is he drinking fluids and able to rest?', 'दो हल्की बातें — क्या वह तरल पी रहा है और आराम कर पा रहा है?'));
  const ok = await api.choices([
    { value: 'yes', label: L('Yes, drinking & resting', 'हाँ, पी रहा व आराम कर रहा') },
    { value: 'no', label: L('Not really', 'ज़्यादा नहीं'), ghost: true },
  ]);
  await api.me(ok === 'yes' ? L('Yes, drinking & resting', 'हाँ, पी रहा व आराम') : L('Not really', 'ज़्यादा नहीं'));

  await api.saathi(L('One moment… 🤔', 'एक पल… 🤔'));
  await api.card(
    <AdviceCard
      kicker={L('Home comfort · keep it gentle', 'घरेलू आराम · हल्का रखें')}
      kickTone="ok"
      title={L('Rest, warmth and fluids should help him feel better', 'आराम, गरमाहट और तरल से उसे बेहतर लगेगा')}
      body={L(
        'Keep him comfortable, offer small sips of water often, a light meal when he’s hungry, and plenty of rest. A warm kaadha can soothe too.',
        'उसे आराम से रखें, थोड़ा-थोड़ा पानी बार-बार दें, भूख लगे तो हल्का खाना, और खूब आराम। एक गरम काढ़ा भी राहत देगा।'
      )}
      redTitle={L('Please see a doctor if:', 'डॉक्टर को दिखाएँ अगर:')}
      redFlags={[
        L('he stops drinking or seems very drowsy', 'वह पीना बंद कर दे या बहुत सुस्त लगे'),
        L('he doesn’t improve in a day or two', 'एक-दो दिन में आराम न हो'),
        L('you feel worried at any point — trust that', 'कभी भी चिंता हो — उस पर भरोसा करें'),
      ]}
    />
  );
  const rem = await api.choices([
    { value: 'yes', label: L('Show a soothing remedy', 'एक राहत भरा नुस्खा दिखाएँ') },
    { value: 'no', label: L('Just keep an eye', 'बस नज़र रखें'), ghost: true },
  ]);
  if (rem === 'yes') {
    await api.me(L('Show a soothing remedy', 'एक राहत भरा नुस्खा दिखाएँ'));
    await runRemedies(api, lang, true);
  }
  await api.saathi(L('I’ll gently check in tomorrow to see how Aarav is doing. 💜', 'कल हल्के से पूछूँगी कि आरव कैसा है। 💜'));
  await api.card(<WatchCard title={L('Aarav · at home', 'आरव · घर पर')} sub={L('I’ll check in tomorrow', 'कल हाल पूछूँगी')} />);
  await api.card(
    <FinalNote>
      {L(
        'Notice what just happened: comfort, a remedy you can make now, a clear line for when to see a doctor, and a promise to check back — care that stays with you, not a one-line answer.',
        'देखिए क्या हुआ: राहत, अभी बनने वाला नुस्खा, डॉक्टर कब दिखाना है इसकी साफ़ बात, और फिर हाल पूछने का वादा — देखभाल जो साथ रहे, कोई एक-लाइन जवाब नहीं।'
      )}
    </FinalNote>
  );
}

/** Reminder setup — starts from scratch, records in your own voice, delivered as a call.
 *  Safety: no medicine dosages / no lab / no clinical data. */
export async function runCaregiver(api: ConvoApi, lang: Lang) {
  const L = pick(lang);
  await api.saathi(
    <>
      {L('Let’s set up a reminder in ', 'चलिए एक रिमाइंडर ')}
      <b>{L('your own voice', 'आपकी अपनी आवाज़')}</b>
      {L(' — they’ll get a call that sounds like you. 💜 Who is it for?', ' में सेट करते हैं — उन्हें एक कॉल आएगी जो आपकी तरह लगेगी। 💜 यह किसके लिए है?')}
    </>
  );
  await api.choices([
    { value: 'papa', label: L('Papa', 'पापा'), sub: L('father', 'पिता') },
    { value: 'maa', label: L('Maa', 'माँ'), sub: L('mother', 'माँ') },
    { value: 'aarav', label: L('Aarav', 'आरव'), sub: L('son', 'बेटा') },
  ]);
  await api.me(L('Papa', 'पापा'));
  await api.saathi(L('What should I remind Papa, and when?', 'पापा को क्या और कब याद दिलाऊँ?'));
  await api.choices([
    { value: 'med', label: L('Take medicine · after breakfast', 'दवा लेना · नाश्ते के बाद') },
    { value: 'walk', label: L('Evening walk · 6 pm', 'शाम की सैर · 6 बजे'), ghost: true },
    { value: 'water', label: L('Drink water · through the day', 'पानी पीना · दिन भर'), ghost: true },
  ]);
  await api.me(L('Take medicine · after breakfast', 'दवा लेना · नाश्ते के बाद'));

  await api.saathi(L('Now say it in your own voice — tap to record.', 'अब अपनी आवाज़ में बोलिए — रिकॉर्ड करने के लिए दबाएँ।'));
  await api.choices([{ value: 'rec', label: L('🎙️ Record', '🎙️ रिकॉर्ड करें') }]);
  await api.me(L('🎙️ Recording…', '🎙️ रिकॉर्ड हो रहा…'));
  await api.card(<RecordCard label={L('Listening to your voice…', 'आपकी आवाज़ सुन रही हूँ…')} />);
  await api.wait(1900);
  await api.card(<PlayBar text={L('Papa, nashte ke baad dawai le lena', 'पापा, नाश्ते के बाद दवाई ले लेना')} meta={L('0:05 · your voice ✓', '0:05 · आपकी आवाज़ ✓')} />);
  await api.saathi(L('Perfect — that’s exactly how Papa will hear you.', 'बढ़िया — पापा आपको बिल्कुल ऐसे ही सुनेंगे।'));
  await api.card(
    <InfoCard
      kicker={L('Reminder set ✓', 'रिमाइंडर सेट ✓')}
      kickTone="ok"
      title={L('Every morning at 9:00 · Papa', 'हर सुबह 9:00 · पापा')}
      body={L('Delivered as a gentle phone call — in your own recorded voice, on any phone.', 'एक प्यारी कॉल के रूप में — आपकी अपनी रिकॉर्ड की आवाज़ में, किसी भी फ़ोन पर।')}
    />
  );
  const hear = await api.choices([
    { value: 'hear', label: L('Hear how it’ll sound', 'सुनें कैसी लगेगी') },
    { value: 'done', label: L('All done', 'हो गया'), ghost: true },
  ]);
  if (hear === 'hear') {
    await api.me(L('Hear how it’ll sound', 'सुनें कैसी लगेगी'));
    await api.card(
      <CallCard
        initial="सु"
        label={L('Incoming call · in your voice', 'आती कॉल · आपकी आवाज़ में')}
        name={L('Sunita → Papa', 'सुनीता → पापा')}
        line={<b>{L('“Papa, nashte ke baad dawai le lena.”', '“पापा, नाश्ते के बाद दवाई ले लेना।”')}</b>}
        sub={L('▶ played in your recorded voice · answered ✓', '▶ आपकी रिकॉर्ड आवाज़ में · उठाया ✓')}
      />
    );
  }
  await api.card(
    <FinalNote>
      {L(
        'This is the magic: care that reaches your loved ones even when you’re busy — in the one voice they trust most, yours. No app for them to learn, on any phone.',
        'यही जादू है: देखभाल जो आपके व्यस्त होने पर भी अपनों तक पहुँचे — उस एक आवाज़ में जिस पर वे सबसे ज़्यादा भरोसा करते हैं, आपकी। उन्हें कोई ऐप सीखना नहीं, किसी भी फ़ोन पर।'
      )}
    </FinalNote>
  );
}
