import { useEffect, useRef, useState, createElement } from 'react';
import { I18nProvider, useLang } from './i18n/I18nContext';
import { useConversation, Thread, type ConvoApi } from './engine/conversation';
import { FlowScreen } from './engine/chrome';
import { Icon } from './engine/icons';
import { Landing } from './screens/Landing';
import { HealthHome, type Phase } from './screens/HealthHome';
import { FamilyHub } from './screens/FamilyHub';
import { SELF } from './data/personas';
import { runRemedies } from './flows/remedies';
import { runBreathe } from './flows/breathe';
import { runTriageSelf } from './flows/triage';
import { runTriageHousehold, runCaregiver } from './flows/household';
import { runNutrition } from './flows/nutrition';
import { runExercise } from './flows/exercise';
import { runDhyan } from './flows/dhyan';
import type { Lang } from './i18n/I18nContext';

export type Story = 'self' | 'household';
export type FlowKey =
  | 'triage'
  | 'remedy'
  | 'remedy-featured'
  | 'breathe'
  | 'breathe-featured'
  | 'care'
  | 'nutrition'
  | 'exercise'
  | 'dhyan';

type Screen = { name: 'landing' } | { name: 'flow'; flow: FlowKey } | { name: 'hub' };

function flowTitle(flow: FlowKey, story: Story, lang: Lang): string {
  const L = (en: string, hi: string) => (lang === 'en' ? en : hi);
  switch (flow) {
    case 'triage':
      return story === 'household' ? L('Someone unwell at home?', 'घर में कोई बीमार है?') : L('Not feeling well?', 'तबीयत ठीक नहीं?');
    case 'remedy':
    case 'remedy-featured':
      return L('Home Remedies', 'घरेलू नुस्खे');
    case 'breathe':
    case 'breathe-featured':
      return L('Breathe & Relax', 'साँस लें, सुकून पाएँ');
    case 'care':
      return L('Reminders', 'रिमाइंडर');
    case 'nutrition':
      return L('Family Nutrition', 'परिवार का पोषण');
    case 'exercise':
      return L('Aaj ka exercise', 'आज का exercise');
    case 'dhyan':
      return L('Aaj ka dhyan', 'आज का ध्यान');
  }
}

function runFlow(flow: FlowKey, story: Story, api: ConvoApi, lang: Lang) {
  switch (flow) {
    case 'triage':
      return story === 'household' ? runTriageHousehold(api, lang) : runTriageSelf(api, lang, SELF);
    case 'remedy':
      return runRemedies(api, lang, false);
    case 'remedy-featured':
      return runRemedies(api, lang, true);
    case 'breathe':
      return runBreathe(api, lang, false);
    case 'breathe-featured':
      return runBreathe(api, lang, true);
    case 'care':
      return runCaregiver(api, lang);
    case 'nutrition':
      return runNutrition(api, lang);
    case 'exercise':
      return runExercise(api, lang);
    case 'dhyan':
      return runDhyan(api, lang);
  }
}

function FlowRunner({ flow, story, onBack, onSpeak, onComplete }: { flow: FlowKey; story: Story; onBack: () => void; onSpeak: () => void; onComplete?: () => void }) {
  const { lang } = useLang();
  const { messages, api, scrollRef } = useConversation();
  const started = useRef(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    if (started.current) return; // guard StrictMode double-invoke
    started.current = true;
    Promise.resolve(runFlow(flow, story, api, lang)).then(() => completeRef.current?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlowScreen title={flowTitle(flow, story, lang)} onBack={onBack} onSpeak={onSpeak}>
      <Thread messages={messages} scrollRef={scrollRef} />
    </FlowScreen>
  );
}

function VoiceOverlay({ story, onClose, onPick }: { story: Story; onClose: () => void; onPick: (f: FlowKey) => void }) {
  const { lang } = useLang();
  const L = (en: string, hi: string) => (lang === 'en' ? en : hi);
  const examples: { icon: keyof typeof Icon; label: string; flow: FlowKey }[] =
    story === 'household'
      ? [
          { icon: 'activity', label: L('“My son has a fever”', '“मेरे बेटे को बुखार है”'), flow: 'triage' },
          { icon: 'carePulse', label: L('“Remind my father about his medicine”', '“पिताजी को दवा याद दिलाओ”'), flow: 'care' },
          { icon: 'leaf', label: L('“A remedy for cough”', '“खाँसी का नुस्खा”'), flow: 'remedy-featured' },
        ]
      : [
          { icon: 'activity', label: L('“I have a headache and fever”', '“मुझे सिरदर्द और बुखार है”'), flow: 'triage' },
          { icon: 'leaf', label: L('“A remedy for cough”', '“खाँसी का नुस्खा”'), flow: 'remedy-featured' },
          { icon: 'wind', label: L('“Help me relax”', '“मुझे सुकून चाहिए”'), flow: 'breathe-featured' },
        ];
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose}>
          ✕
        </button>
        <div className="lmic">
          <Icon.mic />
        </div>
        <h3>{L('Listening…', 'सुन रही हूँ…')}</h3>
        <div className="cansay">{L('Ask me anything — for example:', 'कुछ भी पूछिए — जैसे:')}</div>
        <div className="exlist">
          {examples.map((ex, i) => (
            <button
              key={i}
              className="exchip"
              onClick={() => {
                onClose();
                onPick(ex.flow);
              }}
            >
              <span className="ei">{createElement(Icon[ex.icon])}</span>
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const PARAMS = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
const AUTO: Story | null = PARAMS.get('auto') === 'household' ? 'household' : PARAMS.get('auto') === 'self' ? 'self' : null;
const PRESENT = PARAMS.get('present') === '1' || AUTO !== null;

function initialScreen(): Screen {
  const s = PARAMS.get('screen');
  if (s === 'flow') return { name: 'flow', flow: (PARAMS.get('flow') as FlowKey) || 'triage' };
  if (s === 'hub') return { name: 'hub' };
  return { name: 'landing' };
}

// Hero flows shown, in order, during an auto-play demo session.
const AUTO_FLOWS: Record<Story, FlowKey[]> = {
  self: ['triage', 'remedy-featured'],
  household: ['triage', 'care'],
};

function Experience({ story, phase }: { story: Story; phase: Phase }) {
  const auto = AUTO !== null;
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [voice, setVoice] = useState(false);
  const prevStory = useRef(story);
  const autoIdx = useRef(0);

  useEffect(() => {
    if (prevStory.current !== story) {
      prevStory.current = story;
      setScreen({ name: 'landing' });
      setVoice(false);
    }
  }, [story]);

  // Auto-play director: on the landing, open the next hero flow after a beat.
  useEffect(() => {
    if (!auto || screen.name !== 'landing') return;
    const flows = AUTO_FLOWS[story];
    if (autoIdx.current >= flows.length) return; // demo finished — rest on landing
    const t = setTimeout(() => setScreen({ name: 'flow', flow: flows[autoIdx.current] }), 4000);
    return () => clearTimeout(t);
  }, [screen, auto, story]);

  const onFlowComplete = () => {
    autoIdx.current += 1;
    setTimeout(() => setScreen({ name: 'landing' }), 3000);
  };

  return (
    <div className="phone">
      {screen.name === 'landing' &&
        (story === 'household' ? (
          <HealthHome
            phase={phase}
            onOpen={(f) => setScreen({ name: 'flow', flow: f })}
            onVoice={() => setVoice(true)}
            onHub={() => setScreen({ name: 'hub' })}
          />
        ) : (
          <Landing story={story} onOpen={(f) => setScreen({ name: 'flow', flow: f })} onVoice={() => setVoice(true)} />
        ))}
      {screen.name === 'hub' && <FamilyHub onBack={() => setScreen({ name: 'landing' })} />}
      {screen.name === 'flow' && (
        <FlowRunner
          key={story + screen.flow}
          flow={screen.flow}
          story={story}
          onBack={() => setScreen({ name: 'landing' })}
          onSpeak={() => setVoice(true)}
          onComplete={auto ? onFlowComplete : undefined}
        />
      )}
      {voice && <VoiceOverlay story={story} onClose={() => setVoice(false)} onPick={(f) => setScreen({ name: 'flow', flow: f })} />}
    </div>
  );
}

function Shell() {
  const [phase, setPhase] = useState<Phase>(PARAMS.get('phase') === 'returning' ? 'returning' : 'new');
  return (
    <div className={`stage${PRESENT ? ' present' : ''}`}>
      {!PRESENT && (
        <div className="storyToggle sub">
          <button className={phase === 'new' ? 'active' : ''} onClick={() => setPhase('new')}>
            New user
            <span className="st-sub">Day 0 · discovery</span>
          </button>
          <button className={phase === 'returning' ? 'active' : ''} onClick={() => setPhase('returning')}>
            Returning
            <span className="st-sub">Day 30 · personalised</span>
          </button>
        </div>
      )}
      <Experience story="household" phase={phase} />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  );
}
