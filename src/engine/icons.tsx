import type { ReactNode } from 'react';

const s = (children: ReactNode, stroke = true) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={stroke ? 'currentColor' : 'none'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const Icon = {
  heart: () => s(<path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3.2 1.3 4 2.5C10.8 6.3 12 5 14 5c3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9z" />),
  mic: () => s(<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" /></>),
  chevron: () => s(<path d="M9 18l6-6-6-6" />),
  spark: () => s(<><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /><circle cx="12" cy="12" r="3" /></>),
  activity: () => s(<path d="M3 12h4l2 5 4-12 2 7h6" />),
  carePulse: () => s(<><path d="M20 8.5a5 5 0 0 0-8-4 5 5 0 0 0-8 4c0 4.5 8 9.5 8 9.5s8-5 8-9.5z" /><path d="M2 13h4l1.5-3 2 5 1.5-2h3" /></>),
  wind: () => s(<><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" /><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2" /></>),
  shield: () => s(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />),
  alert: () => s(<><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>),
  phone: () => s(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />),
  leaf: () => s(<><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></>),
  back: () => s(<path d="M15 18l-6-6 6-6" />),
  check: () => s(<path d="M20 6 9 17l-5-5" />),
  water: () => s(<path d="M12 2.7S6 9.5 6 14a6 6 0 0 0 12 0c0-4.5-6-11.3-6-11.3z" />),
  clock: () => s(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  plus: () => s(<><path d="M12 5v14M5 12h14" /></>),
  bell: () => s(<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>),
  user: () => s(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  send: () => s(<><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" /></>),
  pill: () => s(<><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(45 12 12)" /><path d="M8.5 8.5 15.5 15.5" /></>),
  file: () => s(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></>),
  steth: () => s(<><path d="M4 3v5a5 5 0 0 0 10 0V3" /><path d="M9 18a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="12" r="2" /></>),
  bowl: () => s(<><path d="M3 11h18a9 9 0 0 1-18 0z" /><path d="M12 4v3M8.5 5v2M15.5 5v2" /></>),
  star: () => s(<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />),
  share: () => s(<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></>),
  clock2: () => s(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
};

export type IconName = keyof typeof Icon;
