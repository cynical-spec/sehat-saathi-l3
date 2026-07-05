/* Personas for the two stories. First-session data captured in onboarding —
   NOT longitudinal memory. */

export interface SelfProfile {
  nameEn: string;
  nameHi: string;
  age: number;
  conditionEn: string;
  conditionHi: string;
}

export const SELF: SelfProfile = {
  nameEn: 'Rahul',
  nameHi: 'राहुल',
  age: 54,
  conditionEn: 'managing diabetes',
  conditionHi: 'डायबिटीज़ के मरीज़',
};

export interface Member {
  key: string;
  nameEn: string;
  nameHi: string;
  metaEn: string;
  metaHi: string;
  color: string;
  avatar: string;
  condition?: boolean;
}

export const HOUSEHOLD: Member[] = [
  { key: 'aarav', nameEn: 'Aarav', nameHi: 'आरव', metaEn: '3 yrs · son', metaHi: '3 साल · बेटा', color: '#6d17ce', avatar: 'आ' },
  { key: 'ramesh', nameEn: 'Ramesh', nameHi: 'रमेश', metaEn: '58 · diabetic', metaHi: '58 · डायबिटिक', color: '#00ad8b', avatar: 'र', condition: true },
  { key: 'maa', nameEn: 'Maa', nameHi: 'माँ', metaEn: '72 · BP', metaHi: '72 · बीपी', color: '#0078ad', avatar: 'M', condition: true },
  { key: 'self', nameEn: 'Myself', nameHi: 'खुद', metaEn: 'You · caregiver', metaHi: 'आप · देखभालकर्ता', color: '#f06d0f', avatar: 'सु' },
];

export const HOUSEHOLD_AVATARS = HOUSEHOLD.slice(0, 3).map((m) => ({ label: m.avatar, color: m.color }));
