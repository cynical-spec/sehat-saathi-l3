import { useState } from 'react';
import { useLang } from '../i18n/I18nContext';
import { Icon } from '../engine/icons';

interface Member {
  id: string;
  name: string;
  relation: string;
  age: string;
  color: string;
  avatar: string;
  voice: boolean;
}

const SEED: Member[] = [
  { id: 'aarav', name: 'Aarav', relation: 'Son', age: '3', color: '#6d17ce', avatar: 'आ', voice: false },
  { id: 'ramesh', name: 'Ramesh', relation: 'Father', age: '58', color: '#00ad8b', avatar: 'र', voice: true },
  { id: 'maa', name: 'Maa', relation: 'Mother', age: '72', color: '#0078ad', avatar: 'M', voice: false },
];

const PALETTE = ['#6d17ce', '#00ad8b', '#0078ad', '#f06d0f', '#e11d2e', '#8a3ee0'];

export function FamilyHub({ onBack }: { onBack: () => void }) {
  const { lang } = useLang();
  const L = (en: string, hi: string) => (lang === 'en' ? en : hi);
  const [members, setMembers] = useState<Member[]>(SEED);
  const [editing, setEditing] = useState<Member | null>(null);
  const [open, setOpen] = useState(false);

  const startAdd = () => {
    setEditing({ id: `m${Date.now()}`, name: '', relation: '', age: '', color: PALETTE[members.length % PALETTE.length], avatar: '', voice: false });
    setOpen(true);
  };
  const startEdit = (m: Member) => {
    setEditing({ ...m });
    setOpen(true);
  };
  const save = () => {
    if (!editing) return;
    const m = { ...editing, avatar: editing.avatar || editing.name.trim().charAt(0).toUpperCase() || '•' };
    setMembers((list) => (list.some((x) => x.id === m.id) ? list.map((x) => (x.id === m.id ? m : x)) : [...list, m]));
    setOpen(false);
    setEditing(null);
  };
  const remove = () => {
    if (!editing) return;
    setMembers((list) => list.filter((x) => x.id !== editing.id));
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="screen">
      <div className="flowbar">
        <button className="back" onClick={onBack} aria-label="back">
          <Icon.back />
        </button>
        <b>{L('Your family', 'आपका परिवार')}</b>
      </div>

      <div className="scroll hub">
        <div className="hub-intro">{L('The people you look after. I use this to care for each of them by name.', 'जिनका आप ख्याल रखती हैं। हर एक की देखभाल मैं इनके नाम से करती हूँ।')}</div>

        <div className="hub-list">
          {members.map((m) => (
            <button className="hubcard" key={m.id} onClick={() => startEdit(m)}>
              <span className="hub-av" style={{ background: m.color }}>
                {m.avatar}
              </span>
              <span className="hub-b">
                <span className="hub-n">{m.name}</span>
                <span className="hub-m">
                  {m.relation}
                  {m.age ? ` · ${m.age}` : ''}
                </span>
              </span>
              {m.voice && (
                <span className="hub-voice" title={L('reminders in your voice', 'आपकी आवाज़ में रिमाइंडर')}>
                  <Icon.mic />
                </span>
              )}
              <span className="up-go">
                <Icon.chevron />
              </span>
            </button>
          ))}

          <button className="hub-add" onClick={startAdd}>
            <span className="hub-add-ic">
              <Icon.plus />
            </span>
            {L('Add a family member', 'परिवार का सदस्य जोड़ें')}
          </button>
        </div>
      </div>

      {open && editing && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className="sheet hub-sheet" onClick={(e) => e.stopPropagation()}>
            <button className="x" onClick={() => setOpen(false)}>
              ✕
            </button>
            <h3>{members.some((x) => x.id === editing.id) ? L('Edit member', 'सदस्य बदलें') : L('Add member', 'सदस्य जोड़ें')}</h3>

            <label className="field-l">{L('Name', 'नाम')}</label>
            <input className="field" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder={L('e.g. Aarav', 'जैसे आरव')} />

            <label className="field-l">{L('Relation', 'रिश्ता')}</label>
            <div className="field-chips">
              {['Son', 'Daughter', 'Father', 'Mother', 'Spouse', 'Other'].map((r) => (
                <button key={r} className={`fchip${editing.relation === r ? ' on' : ''}`} onClick={() => setEditing({ ...editing, relation: r })}>
                  {r}
                </button>
              ))}
            </div>

            <label className="field-l">{L('Age', 'उम्र')}</label>
            <input className="field" value={editing.age} onChange={(e) => setEditing({ ...editing, age: e.target.value })} placeholder="—" inputMode="numeric" />

            <button className={`voice-rec${editing.voice ? ' on' : ''}`} onClick={() => setEditing({ ...editing, voice: !editing.voice })}>
              <Icon.mic />
              {editing.voice ? L('Reminder voice recorded ✓', 'रिमाइंडर आवाज़ रिकॉर्ड ✓') : L('Record reminders in your voice', 'रिमाइंडर आपकी आवाज़ में रिकॉर्ड करें')}
            </button>

            <div className="sheet-btns">
              {members.some((x) => x.id === editing.id) && (
                <button className="btn btn--secondary" onClick={remove} style={{ color: 'var(--error)' }}>
                  {L('Remove', 'हटाएँ')}
                </button>
              )}
              <button className="btn btn--primary btn--block" onClick={save} style={{ flex: 1 }}>
                {L('Save', 'सेव करें')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
