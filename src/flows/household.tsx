import type { ConvoApi } from '../engine/conversation';
import type { Lang } from '../i18n/I18nContext';
import { AdviceCard, WatchCard, CallCard, DoctorCard, InfoCard, FinalNote } from '../engine/cards';
import { Icon } from '../engine/icons';
import { HOUSEHOLD } from '../data/personas';

const pick = (lang: Lang) => (en: string, hi: string) => (lang === 'en' ? en : hi);

/** F1 (household) — pick who's unwell; toddler path shows careful triage + auto-escalation. */
export async function runTriageHousehold(api: ConvoApi, lang: Lang) {
  const L = pick(lang);
  await api.saathi(L('Who isn’t well?', 'किसकी तबीयत ठीक नहीं?'));
  await api.choices(
    HOUSEHOLD.map((m) => ({
      value: m.key,
      label: L(m.nameEn, m.nameHi),
      sub: L(m.metaEn, m.metaHi),
      condition: m.condition,
    }))
  );
  // Demo anchors on Aarav (3 yrs) — the highest-stakes, most L3-defining case.
  await api.me(L('Aarav', 'आरव'));
  await api.saathi(L('Okay — Aarav, 3. Because he’s little, I’ll be extra careful. What’s happening?', 'ठीक है — आरव, 3 साल। छोटा है इसलिए मैं ज़्यादा सावधानी रखूँगी। क्या हो रहा है?'));
  await api.me(L('Fever since evening, feels hot and cranky.', 'शाम से बुखार है, गरम है और चिड़चिड़ा है।'), true);
  await api.saathi(L('A few quick things — any of these right now?', 'कुछ जल्दी की बातें — इनमें से कुछ अभी है?'));
  const flag = await api.choices([
    { value: 'rash', label: L('Rash on skin', 'त्वचा पर दाने'), ghost: true },
    { value: 'breath', label: L('Fast breathing', 'तेज़ साँस'), ghost: true },
    { value: 'fluids', label: L('Refusing fluids', 'पानी नहीं पी रहा'), ghost: true },
    { value: 'none', label: L('None of these', 'इनमें से कोई नहीं') },
  ]);
  await api.me(flag === 'none' ? L('None of these — he’s drinking a little.', 'कोई नहीं — थोड़ा पी रहा है।') : L('One of these', 'इनमें से एक'));

  await api.saathi(L('One moment… 🤔', 'एक पल… 🤔'));
  await api.card(
    <AdviceCard
      kicker={L('Home care · but watch closely (he’s 3)', 'घरेलू देखभाल · पर करीब से नज़र (3 साल)')}
      kickTone="warn"
      title={L('Likely a viral fever — you can care for him at home tonight', 'शायद वायरल बुखार — आज रात घर पर देखभाल हो सकती है')}
      body={L(
        'Small sips of water often, light clothing (don’t over-cover), rest, and the fever medicine your doctor advised by his weight.',
        'थोड़ा-थोड़ा पानी बार-बार, हल्के कपड़े (ज़्यादा न ढकें), आराम, और डॉक्टर की बताई वज़न के हिसाब से बुखार की दवा।'
      )}
      redTitle={L('See a doctor right away if:', 'तुरंत डॉक्टर को दिखाएँ अगर:')}
      redFlags={[
        L('a rash appears, or lips/nails look bluish', 'दाने निकलें, या होंठ/नाखून नीले दिखें'),
        L('breathing becomes fast or difficult', 'साँस तेज़ या मुश्किल हो'),
        L('he stops drinking, or no urine for 8+ hours', 'पीना बंद कर दे, या 8+ घंटे पेशाब न आए'),
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
  await api.saathi(L('I’ll check on Aarav tomorrow morning. If the fever isn’t settling, I’ll help you get to a doctor.', 'कल सुबह आरव का हाल पूछूँगी। अगर बुखार कम न हो, तो डॉक्टर तक पहुँचने में मदद करूँगी।'));
  await api.card(<WatchCard title={L('Aarav · fever', 'आरव · बुखार')} sub={L('Day 1 · watching · I’ll call tomorrow', 'दिन 1 · नज़र में · कल कॉल करूँगी')} />);

  api.divider(L('Next morning', 'अगली सुबह'));
  await api.card(<CallCard initial="S" label={L('Checking in', 'हाल पूछ रही')} name="Sehat Saathi" line={L('How is Aarav’s fever this morning?', 'आज सुबह आरव का बुखार कैसा है?')} />);
  await api.me(L('Still there — around 101.', 'अभी भी है — करीब 101।'), true);
  await api.saathi(L('Okay. Keep up fluids and rest — normal for day 2. I’ll check again this evening.', 'ठीक है। पानी और आराम जारी रखें — दिन 2 पर सामान्य। शाम को फिर पूछूँगी।'));
  await api.card(<WatchCard title={L('Aarav · fever', 'आरव · बुखार')} sub={L('Day 2 · still watching', 'दिन 2 · नज़र जारी')} />);

  api.divider(L('Day 3 · morning', 'दिन 3 · सुबह'));
  await api.card(
    <CallCard
      danger
      initial="!"
      label={L('Important · calling you', 'ज़रूरी · कॉल कर रही')}
      name={L('Aarav — day 3 of fever', 'आरव — बुखार का तीसरा दिन')}
      line={
        <>
          {L('Aarav’s fever has now lasted 3 days. This is beyond home care — please have a doctor see him ', 'आरव का बुखार अब 3 दिन हो गया। यह घरेलू देखभाल से आगे है — कृपया ')}
          <b>{L('today', 'आज')}</b>{L('.', ' डॉक्टर को दिखाएँ।')}
        </>
      }
    />
  );
  await api.card(
    <DoctorCard
      name={L('Dr. Meera Joshi · Pediatrician', 'डॉ. मीरा जोशी · बाल रोग विशेषज्ञ')}
      meta={L('Aarogya Clinic · 1.2 km away', 'आरोग्य क्लिनिक · 1.2 किमी')}
      open={L('Open now · till 8 pm', 'अभी खुला · रात 8 बजे तक')}
      callLabel={L('Call clinic', 'क्लिनिक कॉल')}
      dirLabel={L('Directions', 'रास्ता')}
    />
  );
  await api.card(
    <FinalNote>
      {L(
        'This is L3: triage knows who Aarav is, adjusts its caution because he’s 3, opens a watch, and escalates to a doctor on its own the moment the fever crosses the safe line — across the whole household, not just you.',
        'यही L3 है: ट्रायज जानता है आरव कौन है, 3 साल का होने से सावधानी बढ़ाता है, नज़र रखता है, और बुखार के सुरक्षित सीमा पार करते ही खुद डॉक्टर तक पहुँचाता है — पूरे परिवार के लिए, सिर्फ़ आपके लिए नहीं।'
      )}
    </FinalNote>
  );
}

/** Caregiver daily loop — first-day setup + proactive orchestration across the household.
 *  Power comes from the household graph + proactivity, not from remembered weeks. */
export async function runCaregiver(api: ConvoApi, lang: Lang) {
  const L = pick(lang);
  api.divider(L('This morning', 'आज सुबह'));
  await api.card(
    <CallCard
      initial="सु"
      label={L('Voice reminder · Ramesh’s phone', 'आवाज़ रिमाइंडर · रमेश का फ़ोन')}
      name={L('Sunita → Ramesh', 'सुनीता → रमेश')}
      line={<b>{L('“Ramesh, take your medicine after breakfast.”', '“रमेश, नाश्ते के बाद दवा ले लेना।”')}</b>}
      sub={L('▶ played in your own recorded voice · Ramesh answered · ✓ taken', '▶ आपकी रिकॉर्ड की आवाज़ में · रमेश ने उठाया · ✓ ली')}
    />
  );
  await api.saathi(L('Ramesh took his medicine ✓. Shall I log this morning’s sugar too?', 'रमेश ने दवा ले ली ✓। आज सुबह की शुगर भी दर्ज कर दूँ?'));
  await api.me(L('Yes — it’s 140.', 'हाँ — 140 है।'), true);
  await api.saathi(L('Noted, 140. 👍 One thing I’ve connected —', 'दर्ज किया, 140। 👍 एक बात जो मैंने जोड़ी —'));
  await api.card(
    <InfoCard
      kicker={L('I connected a few things', 'मैंने कुछ बातें जोड़ीं')}
      kickTone="sp"
      title={L('Today’s reading is a touch high, and lunch is planned rice-heavy', 'आज की रीडिंग थोड़ी ऊँची है, और दोपहर में चावल ज़्यादा है')}
      body={L(
        'Nothing alarming — but we can ease it today with a lighter plate.',
        'घबराने की बात नहीं — पर आज हल्की थाली से इसे संभाल सकते हैं।'
      )}
    />
  );
  await api.card(
    <InfoCard
      kicker={L('For lunch today · from what’s usually home', 'आज दोपहर · घर की चीज़ों से')}
      kickTone="ok"
      title={L('Toor dal · one jowar roti · light bhindi sabzi', 'तूर दाल · एक ज्वार रोटी · हल्की भिंडी सब्ज़ी')}
      body={L('Lighter on his sugar than rice, and high on fibre.', 'चावल से हल्का, और फाइबर से भरपूर।')}
      buttons={
        <>
          <button className="btn btn--teal">{L('Show the recipe', 'रेसिपी दिखाएँ')}</button>
          <button className="btn btn--secondary">{L('Not now', 'अभी नहीं')}</button>
        </>
      }
    />
  );
  await api.saathi(L('His HbA1c lab is also due. Shall I book a home sample collection?', 'उनका HbA1c टेस्ट भी due है। घर से सैंपल लेने की बुकिंग कर दूँ?'));
  const book = await api.choices([
    { value: 'yes', label: L('Book it', 'बुक कर दो') },
    { value: 'later', label: L('Later', 'बाद में'), ghost: true },
  ]);
  if (book === 'yes') {
    await api.me(L('Yes, book it.', 'हाँ, बुक कर दो।'));
    await api.saathi(L('Done — sample collection tomorrow, 8 am. I’ll add the result to his profile when it’s in. ✓', 'हो गया — कल सुबह 8 बजे सैंपल। रिज़ल्ट आने पर उनकी प्रोफ़ाइल में जोड़ दूँगी। ✓'));
  } else {
    await api.me(L('Later', 'बाद में'));
    await api.saathi(L('No problem, I’ll remind you tomorrow.', 'कोई बात नहीं, कल याद दिला दूँगी।'));
  }

  // Self-care nudge for the caregiver
  await api.wait(200);
  await api.saathi(L('And one more — for you. You look after everyone; shall I keep Sunday free for your own check-up?', 'और एक बात — आपके लिए। आप सबका ख्याल रखती हैं; रविवार आपके अपने चेक-अप के लिए रख दूँ?'));
  const me = await api.choices([
    { value: 'ok', label: L('Okay, Sunday', 'ठीक है, रविवार') },
    { value: 'no', label: L('Not yet', 'अभी नहीं'), ghost: true },
  ]);
  await api.me(me === 'ok' ? L('Okay, Sunday.', 'ठीक है, रविवार।') : L('Not yet.', 'अभी नहीं।'));
  await api.saathi(L('Sunday it is. Someone should look after you too. 💜', 'तो रविवार तय। किसी को आपका भी ख्याल रखना चाहिए। 💜'));
  await api.card(
    <InfoCard
      kicker={L('Today · the household at a glance', 'आज · परिवार एक नज़र में')}
      kickTone="ok"
      title={L('Everyone’s on track', 'सब ठीक चल रहा है')}
      body={
        <>
          <b>{L('Ramesh', 'रमेश')}</b>{L(' — medicine ✓ · sugar logged · lab booked', ' — दवा ✓ · शुगर दर्ज · लैब बुक')}
          <br />
          <b>{L('You', 'आप')}</b>{L(' — check-up set for Sunday ✓', ' — रविवार चेक-अप तय ✓')}
        </>
      }
    />
  );
  await api.card(
    <FinalNote>
      {L(
        'This is L3: none of it needed weeks of history. In one morning it connected the household — his reminder in your voice, today’s sugar, the planned lunch, the due lab, and your own health — into one caring, proactive loop.',
        'यही L3 है: इसमें हफ़्तों के इतिहास की ज़रूरत नहीं पड़ी। एक ही सुबह में इसने पूरे परिवार को जोड़ा — आपकी आवाज़ में उनका रिमाइंडर, आज की शुगर, तय दोपहर का खाना, due लैब, और आपकी अपनी सेहत — एक देखभाल भरे, proactive loop में।'
      )}
    </FinalNote>
  );
}
