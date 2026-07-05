import { useLang } from '../i18n/I18nContext';
import { TopBar } from '../engine/chrome';
import { Icon } from '../engine/icons';
import { KaadhaCup, Lotus } from '../engine/illustrations';
import { HOUSEHOLD_AVATARS } from '../data/personas';
import type { Story, FlowKey } from '../App';

export function Landing({
  story,
  onOpen,
  onVoice,
}: {
  story: Story;
  onOpen: (f: FlowKey) => void;
  onVoice: () => void;
}) {
  const { lang } = useLang();
  const L = (en: string, hi: string) => (lang === 'en' ? en : hi);
  const household = story === 'household';

  return (
    <div className="screen">
      <TopBar avatars={household ? HOUSEHOLD_AVATARS : undefined} />

      <div className="scroll">
        <div className="hero">
          <div className="greet">{household ? L('Good evening 🙏', 'शुभ संध्या 🙏') : L('Namaste, Rahul 🙏', 'नमस्ते, राहुल 🙏')}</div>
          <div className="hline">{household ? L('How is everyone\nat home today?', 'घर में सब\nकैसे हैं आज?') : L('How are you\nfeeling today?', 'आज आप कैसा\nमहसूस कर रहे हैं?')}</div>
          <button className="orb" onClick={onVoice} aria-label="voice">
            <Icon.mic />
          </button>
          <div className="orb-label">{L('Ask me anything', 'कुछ भी पूछिए')}</div>
          <div className="orb-sub">{L('In your language — just speak', 'आपकी भाषा में — बस बोलिए')}</div>
        </div>

        {/* Proactive "Aaj ka" hooks — warm illustrated cards */}
        <div className="sectionlabel" style={{ paddingLeft: 22 }}>
          {L('For you today', 'आज आपके लिए')}
        </div>
        <div className="aajka">
          <button className="aajcard remedy" onClick={() => onOpen('remedy-featured')}>
            <span className="aaj-art">
              <KaadhaCup />
            </span>
            <span className="kicker">{L('Aaj ka nuskha', 'आज का नुस्खा')}</span>
            <h3>{L('Haldi–Adrak Kaadha', 'हल्दी–अदरक काढ़ा')}</h3>
            <span className="go2">
              {L('Make it', 'बनाएँ')} <Icon.chevron />
            </span>
          </button>
          <button className="aajcard breathe" onClick={() => onOpen('breathe-featured')}>
            <span className="aaj-art">
              <Lotus />
            </span>
            <span className="kicker">{L('Aaj ka exercise', 'आज का exercise')}</span>
            <h3>{L('4-7-8 Calm Breath', '4-7-8 शांत साँस')}</h3>
            <span className="go2">
              {L('Begin', 'शुरू करें')} <Icon.chevron />
            </span>
          </button>
        </div>

        {/* Primary tiles — decluttered: title + one line */}
        <div className="sectionlabel" style={{ paddingLeft: 22 }}>
          {L('How can I help?', 'किसमें मदद करूँ?')}
        </div>
        <div className="cards">
          <button className="xcard" onClick={() => onOpen('triage')}>
            <span className="xicon tri">
              <Icon.activity />
            </span>
            <span className="xbody">
              <span className="xtitle">{household ? L('Someone unwell at home?', 'घर में कोई बीमार है?') : L('Not feeling well?', 'तबीयत ठीक नहीं?')}</span>
              <span className="xsub">
                {household ? L('Careful triage for kids & elders — I watch till better.', 'बच्चों-बुज़ुर्गों की सावधान जाँच — ठीक होने तक साथ।') : L('Tell me — I’ll guide you and watch till you’re better.', 'बताइए — मैं मार्गदर्शन करूँगी, ठीक होने तक साथ रहूँगी।')}
              </span>
            </span>
            <span className="go">
              <Icon.chevron />
            </span>
          </button>

          {household ? (
            <button className="xcard" onClick={() => onOpen('care')}>
              <span className="xicon care">
                <Icon.carePulse />
              </span>
              <span className="xbody">
                <span className="xtitle">{L('Care for your people', 'अपनों की देखभाल')}</span>
                <span className="xsub">{L('Medicine, sugar & diet — reminders in your own voice.', 'दवा, शुगर, खाना — रिमाइंडर आपकी अपनी आवाज़ में।')}</span>
              </span>
              <span className="go">
                <Icon.chevron />
              </span>
            </button>
          ) : (
            <button className="xcard" onClick={() => onOpen('remedy')}>
              <span className="xicon rem">
                <Icon.leaf />
              </span>
              <span className="xbody">
                <span className="xtitle">{L('Home remedies', 'घरेलू नुस्खे')}</span>
                <span className="xsub">{L('Trusted kitchen remedies, guided by voice.', 'भरोसेमंद रसोई नुस्खे, आवाज़ में।')}</span>
              </span>
              <span className="go">
                <Icon.chevron />
              </span>
            </button>
          )}
        </div>

        <div className="trust">
          <Icon.shield />
          {L('Private & secure · always in your language', 'निजी व सुरक्षित · हमेशा आपकी भाषा में')}
        </div>
      </div>
    </div>
  );
}
