import type { ReactNode } from 'react';
import { Icon } from './icons';

/* Reusable cards rendered inside the chat thread. */

export function AdviceCard({
  kicker,
  kickTone = 'ok',
  title,
  body,
  redTitle,
  redFlags,
  buttons,
}: {
  kicker: string;
  kickTone?: 'ok' | 'warn' | 'pk' | 'sp';
  title: string;
  body: ReactNode;
  redTitle?: string;
  redFlags?: string[];
  buttons?: ReactNode;
}) {
  return (
    <div className="card">
      <div className={`kick ${kickTone}`}>{kicker}</div>
      <h4>{title}</h4>
      <div className="why">{body}</div>
      {redFlags && redFlags.length > 0 && (
        <div className="redflags">
          <div className="rt">
            <Icon.alert />
            {redTitle}
          </div>
          <ul>
            {redFlags.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
      {buttons && <div className="cardbtns">{buttons}</div>}
    </div>
  );
}

export function InfoCard({
  kicker,
  kickTone = 'sp',
  title,
  body,
  buttons,
  media,
}: {
  kicker: string;
  kickTone?: 'ok' | 'warn' | 'pk' | 'sp';
  title: string;
  body: ReactNode;
  buttons?: ReactNode;
  media?: ReactNode;
}) {
  return (
    <div className="card">
      <div className={`kick ${kickTone}`}>{kicker}</div>
      {media ? (
        <div className="cardhead">
          <span className="cardmedia">{media}</span>
          <h4 style={{ margin: 0 }}>{title}</h4>
        </div>
      ) : (
        <h4>{title}</h4>
      )}
      <div className="why">{body}</div>
      {buttons && <div className="cardbtns">{buttons}</div>}
    </div>
  );
}

export function StepCard({
  label,
  instruction,
  step,
  total,
  art,
}: {
  label: string;
  instruction: string;
  step: number;
  total: number;
  art?: ReactNode;
}) {
  return (
    <div className="stepcard">
      {art && <div className="step-stage">{art}</div>}
      <div className="sn">{label}</div>
      <div className="si">{instruction}</div>
      <div className="prog">
        {Array.from({ length: total }).map((_, i) => (
          <i key={i} className={i < step ? 'on' : ''} />
        ))}
      </div>
    </div>
  );
}

export function BreathCycle({ phase, count, note }: { phase: string; count: string; note: string }) {
  return (
    <div className="breathcard">
      <div className="breathring">{count}</div>
      <div className="breathphase">{phase}</div>
      <div className="breathnote">{note}</div>
    </div>
  );
}

export function WatchCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="watch">
      <div className="wt">
        <span className="dot" />
        Recovery watch
      </div>
      <div className="wm">{title}</div>
      <div className="ws">{sub}</div>
    </div>
  );
}

export function CallCard({
  initial,
  label,
  name,
  line,
  sub,
  danger,
}: {
  initial: string;
  label: string;
  name: string;
  line: ReactNode;
  sub?: string;
  danger?: boolean;
}) {
  return (
    <div className="call" style={danger ? { background: '#2a1113', border: '1px solid #5a2530' } : undefined}>
      <div className="ch">
        <div className="ca" style={danger ? { background: 'linear-gradient(150deg,#e11d2e,#7a1520)' } : undefined}>
          {initial}
        </div>
        <div className="cinfo">
          <div className="cl" style={danger ? { color: '#ff9ba3' } : undefined}>
            {label}
          </div>
          <div className="cn">{name}</div>
        </div>
      </div>
      <div className="cline" style={danger ? { color: '#ffe1e3' } : undefined}>
        {line}
      </div>
      {sub && <div className="csub">{sub}</div>}
    </div>
  );
}

export function DoctorCard({
  name,
  meta,
  open,
  callLabel,
  dirLabel,
}: {
  name: string;
  meta: string;
  open: string;
  callLabel: string;
  dirLabel: string;
}) {
  return (
    <div className="doc">
      <div className="dh">
        <span className="da">
          <Icon.heart />
        </span>
        <div>
          <div className="dn">{name}</div>
          <div className="dm">{meta}</div>
          <div className="dopen">{open}</div>
        </div>
      </div>
      <div className="cardbtns">
        <button className="btn btn--primary">
          <Icon.phone />
          {callLabel}
        </button>
        <button className="btn btn--secondary">{dirLabel}</button>
      </div>
    </div>
  );
}

export function FinalNote({ children }: { children: ReactNode }) {
  return <div className="note-final">{children}</div>;
}

/* ── Magic chat components ────────────────────────────────── */

/** Embedded YouTube video (real video inside the chat). */
export function YouTubeCard({ id, title }: { id: string; title: string }) {
  return (
    <div className="ytcard">
      <div className="yt-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="yt-cap">
        <Icon.wind />
        {title}
      </div>
    </div>
  );
}

/** Simulated camera scan of the fridge/shelf, with a sweeping scan line. */
export function ScanFrame({ label, foods }: { label: string; foods: string[] }) {
  return (
    <div className="scan">
      <div className="scan-photo">
        <div className="scan-grid">
          {foods.map((f, i) => (
            <span key={i} style={{ animationDelay: `${i * 90}ms` }}>{f}</span>
          ))}
        </div>
        <div className="scan-line" />
        <div className="scan-corners"><i /><i /><i /><i /></div>
      </div>
      <div className="scan-label">
        <span className="scan-dot" />
        {label}
      </div>
    </div>
  );
}

/** Detected-items chip row (AI vision result). */
export function DetectChips({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="det">
      <div className="det-h">{title}</div>
      <div className="det-row">
        {items.map((it, i) => (
          <span key={i} className="det-chip" style={{ animation: `staggerIn 300ms ease-out ${i * 70}ms both` }}>{it}</span>
        ))}
      </div>
    </div>
  );
}

/** Nutrition tags for a recipe (non-medical: iron-rich, protein, fibre). */
export function NutriTags({ tags }: { tags: string[] }) {
  return (
    <div className="nutri">
      {tags.map((t, i) => (
        <span key={i} className="nutri-tag">{t}</span>
      ))}
    </div>
  );
}

/** Live voice-recording card (animated waveform). */
export function RecordCard({ label }: { label: string }) {
  return (
    <div className="rec">
      <span className="rec-dot" />
      <div className="rec-wave">
        {Array.from({ length: 18 }).map((_, i) => (
          <i key={i} style={{ animationDelay: `${(i % 6) * 0.12}s` }} />
        ))}
      </div>
      <div className="rec-lbl">{label}</div>
    </div>
  );
}

/** Playback bar for the recorded voice note. */
export function PlayBar({ text, meta }: { text: string; meta: string }) {
  return (
    <div className="playbar">
      <span className="playbar-btn"><Icon.mic /></span>
      <div className="playbar-body">
        <div className="playbar-text">“{text}”</div>
        <div className="playbar-wave">
          {Array.from({ length: 22 }).map((_, i) => (
            <i key={i} style={{ height: `${4 + ((i * 7) % 14)}px` }} />
          ))}
        </div>
        <div className="playbar-meta">{meta}</div>
      </div>
    </div>
  );
}
