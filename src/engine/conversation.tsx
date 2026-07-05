import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './icons';

// QA / auto mode: auto-advance choices so a flow can play hands-free (screenshots, demo recording).
const _P = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
const QA = _P.get('qa') === '1' || _P.has('auto');

/* ============================================================
   Conversation engine — imperative "director" for a scripted,
   voice-simulated chat. A flow is an async function that awaits
   api.saathi() / api.me() / api.choices() etc. Mirrors the proven
   pattern from sehat_saathi_L3.html, but in React.
   ============================================================ */

export interface Msg {
  id: number;
  node: ReactNode;
}

export interface Choice<T = string> {
  value: T;
  label: string;
  sub?: string;        // secondary line (member chips)
  condition?: boolean; // highlight (e.g. "diabetic")
  ghost?: boolean;     // muted style
}

export interface ConvoApi {
  clear(): void;
  /** Push any node directly; returns its id (for later removal). */
  push(node: ReactNode): number;
  /** Remove a message by id (e.g. consume a suggestion deck on tap). */
  remove(id: number): void;
  wait(ms: number): Promise<void>;
  /** Saathi speaks: typing indicator, then a bubble. */
  saathi(html: ReactNode): Promise<void>;
  /** User speaks/types. voice=true shows the "spoken" mic tag. */
  me(text: string, voice?: boolean): Promise<void>;
  /** Section divider, e.g. "Next morning". */
  divider(label: string): void;
  /** Push any custom card node into the thread. */
  card(node: ReactNode): Promise<void>;
  /** Render choice chips; resolves with the chosen value, then removes them. */
  choices<T>(options: Choice<T>[]): Promise<T>;
}

export function useConversation(speed = 1) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nextId = () => ++idRef.current;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const push = (node: ReactNode): number => {
    const id = nextId();
    setMessages((m) => [...m, { id, node }]);
    return id;
  };
  const remove = (id: number) => setMessages((m) => m.filter((x) => x.id !== id));

  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms / speed));

  const apiRef = useRef<ConvoApi>(null as unknown as ConvoApi);
  if (!apiRef.current) {
    const api: ConvoApi = {
      clear() {
        idRef.current = 0;
        setMessages([]);
      },
      push: (node: ReactNode) => push(node),
      remove: (id: number) => remove(id),
      wait,
      async saathi(html) {
        // Companion mode (JDS §14.1): typing dots → bare text with a face, no bubble.
        const typingId = push(
          <div className="aitype">
            <span className="aiface">
              <Icon.spark />
            </span>
            <div className="typing">
              <i /><i /><i />
            </div>
          </div>
        );
        await wait(950);
        remove(typingId);
        push(
          <div className="aiturn">
            <span className="aiface">
              <Icon.spark />
            </span>
            <div className="aitext">{html}</div>
          </div>
        );
        await wait(750);
      },
      async me(text, voice) {
        push(
          <div className="row me">
            <div className="bub me">
              {text}
              {voice && (
                <span className="mic">
                  <Icon.mic /> spoken
                </span>
              )}
            </div>
          </div>
        );
        await wait(600);
      },
      divider(label) {
        push(<div className="tdiv">{label}</div>);
      },
      async card(node) {
        push(node);
        await wait(750);
      },
      choices<T>(options: Choice<T>[]) {
        return new Promise<T>((resolve) => {
          const id = nextId();
          const onPick = (val: T) => {
            remove(id);
            resolve(val);
          };
          if (QA) setTimeout(() => onPick(options[0].value), 500);
          const node = (
            <div className="choices" key={id}>
              {options.map((o, i) => (
                <button
                  key={i}
                  className={`chip${o.sub !== undefined ? ' mchip' : ''}${o.ghost ? ' ghost' : ''}`}
                  onClick={() => onPick(o.value)}
                >
                  {o.sub !== undefined ? (
                    <>
                      <span className="mn">{o.label}</span>
                      <span className={`mt${o.condition ? ' cond' : ''}`}>{o.sub}</span>
                    </>
                  ) : (
                    o.label
                  )}
                </button>
              ))}
            </div>
          );
          setMessages((m) => [...m, { id, node }]);
        });
      },
    };
    apiRef.current = api;
  }

  return { messages, api: apiRef.current, scrollRef };
}

/** Renders the message list. Attach scrollRef to enable auto-scroll. */
export function Thread({
  messages,
  scrollRef,
}: {
  messages: Msg[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="thread" ref={scrollRef}>
      {messages.map((m) => (
        <MsgSlot key={m.id}>{m.node}</MsgSlot>
      ))}
    </div>
  );
}

function MsgSlot({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
