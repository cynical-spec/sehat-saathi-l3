/* Illustrative, filled SVGs (not line icons) for remedies + the companion.
   Colors drawn from the JDS palette. Each is square, scales via width/height. */

export function KaadhaCup() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      {/* steam */}
      <path d="M26 12c2-2-1-4 1-7M32 11c2-2-1-4 1-7M38 12c2-2-1-4 1-7" stroke="#c9a227" strokeWidth="2.2" strokeLinecap="round" opacity=".7" />
      {/* saucer */}
      <ellipse cx="32" cy="54" rx="20" ry="4" fill="#e7cf8f" />
      {/* cup body */}
      <path d="M16 24h30v14a15 15 0 0 1-30 0V24z" fill="#fff" stroke="#e0b84a" strokeWidth="2.5" />
      {/* liquid */}
      <path d="M19 27h24v11a12 12 0 0 1-24 0V27z" fill="#e3a72e" />
      <ellipse cx="31" cy="27" rx="12" ry="2.6" fill="#f0c14b" />
      {/* handle */}
      <path d="M46 27c6 0 8 4 8 7s-3 7-9 7" stroke="#e0b84a" strokeWidth="2.5" fill="none" />
      {/* ginger slice */}
      <ellipse cx="31" cy="28" rx="3" ry="1.4" fill="#f6d98a" />
    </svg>
  );
}

export function SpiceBowl() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <ellipse cx="32" cy="52" rx="19" ry="4" fill="#e6ddcf" />
      {/* bowl */}
      <path d="M12 34h40a20 20 0 0 1-40 0z" fill="#00ad8b" />
      <path d="M12 34h40a20 20 0 0 1-40 0z" stroke="#014c3b" strokeWidth="2" />
      {/* seeds mound */}
      <ellipse cx="32" cy="34" rx="20" ry="6" fill="#b98a3e" />
      <g fill="#7a5320">
        <ellipse cx="24" cy="33" rx="1.6" ry="1" /><ellipse cx="30" cy="35" rx="1.6" ry="1" /><ellipse cx="36" cy="33" rx="1.6" ry="1" />
        <ellipse cx="40" cy="35" rx="1.6" ry="1" /><ellipse cx="27" cy="35.5" rx="1.6" ry="1" /><ellipse cx="33" cy="32.5" rx="1.6" ry="1" />
        <ellipse cx="21" cy="34.5" rx="1.4" ry=".9" /><ellipse cx="43" cy="33.5" rx="1.4" ry=".9" />
      </g>
    </svg>
  );
}

export function TulsiLeaf() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M32 8C20 16 14 28 16 40c1 8 7 14 16 16 9-2 15-8 16-16 2-12-4-24-16-32z" fill="#25ab21" />
      <path d="M32 12v42" stroke="#0f7a1f" strokeWidth="2.2" />
      <path d="M32 22c-4 2-7 5-8 9M32 30c4 2 7 5 8 9M32 38c-3 2-5 4-6 7" stroke="#0f7a1f" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

export function WaterGlass() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M20 14h24l-3 38a4 4 0 0 1-4 3.5H27a4 4 0 0 1-4-3.5L20 14z" fill="#ecf7ff" stroke="#0078ad" strokeWidth="2.4" />
      <path d="M22 30h20l-2 22a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2L22 30z" fill="#8fd4f5" />
      <path d="M27 20c-1 2-2 3 0 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}

export function Poultice() {
  // warm compress / general remedy
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="34" r="18" fill="#f6f3ff" stroke="#6d17ce" strokeWidth="2.4" />
      <path d="M32 24v20M22 34h20" stroke="#6d17ce" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 14c2-2 10-2 12 0" stroke="#8a3ee0" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Lotus() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <ellipse cx="32" cy="52" rx="20" ry="4" fill="#d9e9f2" />
      {/* petals */}
      <path d="M32 20c5 6 5 16 0 24-5-8-5-18 0-24z" fill="#0078ad" />
      <path d="M32 26c8 2 13 9 14 18-9-1-16-6-19-13 1-2 3-4 5-5z" fill="#3ea3d0" />
      <path d="M32 26c-8 2-13 9-14 18 9-1 16-6 19-13-1-2-3-4-5-5z" fill="#3ea3d0" />
      <path d="M20 30c-4 4-6 10-5 16 6-1 11-4 14-9-2-3-6-6-9-7z" fill="#8fd4f5" />
      <path d="M44 30c4 4 6 10 5 16-6-1-11-4-14-9 2-3 6-6 9-7z" fill="#8fd4f5" />
      <circle cx="32" cy="42" r="4" fill="#f0c14b" />
    </svg>
  );
}

/** Warm caring companion — a soft face with a heart-pulse, for onboarding. */
export function CompanionArt() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden>
      <circle cx="48" cy="48" r="46" fill="url(#cg)" />
      <defs>
        <radialGradient id="cg" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#8a3ee0" />
          <stop offset="0.55" stopColor="#6d17ce" />
          <stop offset="1" stopColor="#0078ad" />
        </radialGradient>
      </defs>
      {/* soft face */}
      <circle cx="48" cy="44" r="26" fill="#fff" opacity=".96" />
      {/* eyes (gentle) */}
      <path d="M38 42c1.5-2 4.5-2 6 0M52 42c1.5-2 4.5-2 6 0" stroke="#310064" strokeWidth="3" strokeLinecap="round" />
      {/* caring smile */}
      <path d="M40 52c3 4 13 4 16 0" stroke="#310064" strokeWidth="3" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="36" cy="50" r="2.6" fill="#ffb3c7" opacity=".8" />
      <circle cx="60" cy="50" r="2.6" fill="#ffb3c7" opacity=".8" />
      {/* heartbeat badge */}
      <g transform="translate(60 62)">
        <circle cx="9" cy="9" r="12" fill="#00ad8b" stroke="#fff" strokeWidth="3" />
        <path d="M3 9h3l1.5 3 2-6 1.5 3H15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

export const RemedyArt = { KaadhaCup, SpiceBowl, TulsiLeaf, WaterGlass, Poultice, Lotus };
export type RemedyArtName = keyof typeof RemedyArt;
