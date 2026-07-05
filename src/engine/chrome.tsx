import { useState, type ReactNode } from 'react';
import { Icon } from './icons';
import { useLang } from '../i18n/I18nContext';

/** Brand + language toggle. Optional household avatars on the right. */
export function TopBar({ avatars }: { avatars?: { label: string; color: string }[] }) {
  const { lang, setLang } = useLang();
  return (
    <div className="topbar">
      <div className="brand">
        <span className="mark">
          <Icon.heart />
        </span>
        <div>
          <b>Sehat Saathi</b>
          <div className="tag">on JioBharatIQ</div>
        </div>
      </div>
      <div className="topright">
        {avatars && (
          <div className="hhav">
            {avatars.map((a, i) => (
              <span key={i} style={{ background: a.color }}>
                {a.label}
              </span>
            ))}
          </div>
        )}
        <div className="langtoggle">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
            EN
          </button>
          <button className={lang === 'hi' ? 'on' : ''} onClick={() => setLang('hi')}>
            हिं
          </button>
        </div>
      </div>
    </div>
  );
}

/** Sticky chat composer (JDS HubChatInput · companion variant): text pill (mic↔send) + Speak FAB. */
export function Composer({ onSpeak, onSend }: { onSpeak: () => void; onSend?: (text: string) => void }) {
  const { lang } = useLang();
  const [text, setText] = useState('');
  const typing = text.trim().length > 0;

  const submit = () => {
    if (!typing) return;
    onSend?.(text);
    setText('');
  };

  return (
    <div className="composer">
      <div className="pill">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={lang === 'en' ? 'Type your message…' : 'अपना संदेश लिखें…'}
          aria-label="message"
        />
        {typing ? (
          <button className="sendbtn" onClick={submit} aria-label="send">
            <Icon.send />
          </button>
        ) : (
          <button className="micbtn" onClick={onSpeak} aria-label="dictate">
            <Icon.mic />
          </button>
        )}
      </div>
      <button className="speakfab" onClick={onSpeak} aria-label="speak">
        <Icon.mic />
      </button>
    </div>
  );
}

/** A flow = the chat window: back bar + companion thread + sticky composer. */
export function FlowScreen({
  title,
  onBack,
  onSpeak,
  onSend,
  children,
}: {
  title: string;
  onBack: () => void;
  onSpeak: () => void;
  onSend?: (text: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="screen">
      <div className="flowbar">
        <button className="back" onClick={onBack} aria-label="back">
          <Icon.back />
        </button>
        <b>{title}</b>
        <span className="l3">L3</span>
      </div>
      {children}
      <Composer onSpeak={onSpeak} onSend={onSend} />
    </div>
  );
}
