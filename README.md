# Sehat Saathi — L3 hero prototypes

Two **L3, best-in-class** hero experiences for the **Health** assistant inside **JioBharatIQ**,
built as **one React web app** with an **A / B toggle**:

- **Option A — Self (L3):** the SIT experience lifted to L3, for a single user. No household.
- **Option B — Household (L3):** family profile + caregiver daily loop.

They share one design principle: **L3 = proactive, voice-first, and rewarding in a new user's
first session — not longitudinal memory.** See [`USER_STORIES.md`](./USER_STORIES.md).

> This is a **standalone prototype**. It only *read* the real repos
> (`jio-omni-app`, `aivert-health-companion-mcp`) for context — nothing was written back.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
```

Use the **Option A / Option B** toggle above the phone. Switch **EN / हिं** top-right.
Each story runs: **voice onboarding → multi-hook landing → conversational flows**.

## What to click

- **"Aaj ka nuskha"** / **"Aaj ka exercise"** cards — the proactive hooks.
- The **mic orb** — voice examples that route into flows.
- **Triage tile** — A: profile-aware self triage with auto-escalation. B: pick a family member
  (demo anchors on Aarav, 3 yrs) → careful triage + day-3 doctor escalation.
- **Care for your people** (B only) — the caregiver daily loop.

## Architecture

It's a **single conversational surface** — the home *is* the chat. After onboarding you land in
a chat thread with a warm greeting + inline suggestion deck and an always-on composer; every flow
(triage, remedies, breathe, care) runs **inline in the same thread**.

```
src/
  App.tsx                 story toggle · onboarding → ChatHome
  i18n/I18nContext.tsx    EN/हिं provider + toggle
  engine/
    conversation.tsx      async "director": typing, companion bare-text, chips, choices, push/remove
    cards.tsx             thread cards (advice, step+media, watch, call, doctor, summary)
    chrome.tsx            Composer (text pill mic↔send + Speak FAB)
    icons.tsx             inline SVG icon set
    illustrations.tsx     filled remedy SVGs (kaadha cup, spice bowl, tulsi, water) + companion art
  data/personas.ts        SELF profile · HOUSEHOLD members
  screens/
    Onboarding.tsx        warm welcome + guided one-by-one voice onboarding
    ChatHome.tsx          the chat surface: header + greeting + suggestion deck + composer + voice
  flows/
    triage.tsx            F1 self triage (profile-aware, episodic watch, escalation)
    remedies.tsx          F2 remedies ("Aaj ka nuskha" + browse + illustrated voice walkthrough)
    breathe.tsx           F4 breathe ("Aaj ka exercise" + guided session)
    household.tsx         B: member-aware triage + caregiver daily loop
```

**JDS-aligned** (via the design-system MCP): companion chat = AI as **bare text with a face** (no
grey bubbles), user bubbles right; tokens/radii/easing per JDS; composer follows the HubChatInput
companion pattern. Tokens live in `src/index.css`.

**Voice is simulated** (animated mic + scripted "spoken" STT/TTS turns) for reliable demos, with a
clean seam (`Composer` mic/Speak) to swap in the real Web Speech API later.
