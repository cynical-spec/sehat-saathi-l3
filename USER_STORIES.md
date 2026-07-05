# Sehat Saathi — two L3 hero user stories

The Health assistant inside **JioBharatIQ**, taken from its shipped **L1** (SIT) baseline to a
best-in-class **L3** experience — **proactive**, voice-first, and rewarding **from a new user's
very first session** (no dependence on longitudinal memory / history).

The axis between the two stories is **self vs. household**.

---

## Baseline being lifted (what's live in SIT = L1)

From `aivert-health-companion-mcp` (`vertical_tools.yaml` + agent prompt), the SIT home shows 4
stateless cards for a single user: **F1 Symptom triage**, **F2 Home Remedies**, **F3 Reminders
(stub)**, **F4 Breathe**. Each flow answers once and resets. Reminders is not built.

L3 keeps the same simple surface but makes it **anticipate** instead of **react**, and (in B)
**span the household** instead of one person. Reminders is intentionally dropped.

---

## Option A — "My own Sehat Saathi" (self, L3)

**As a** first-time user managing my own everyday health,
**I want** an assistant that greets me by voice, already understands my basics, and proactively
offers what's useful today,
**so that** I feel genuinely cared for and in control from the first minute — without hunting
through menus.

**L3 acceptance moments (all first-session, no history needed):**
1. **Voice onboarding** captures name + condition by speaking, not forms.
2. Landing leads with **proactive "Aaj ka" hooks** — *Aaj ka nuskha* (seasonal remedy) and
   *Aaj ka exercise* (evening calm breath) — before I ask anything.
3. **Triage** uses my profile (never re-asks my age/condition), gives home-care vs doctor advice
   with **red-flags**, opens an **episodic Recovery Watch**, checks back each day, and
   **escalates to a doctor on its own** when a 3-day fever crosses the safe line for a diabetic.
4. **Remedies** open with today's most relevant remedy and guide it **step-by-step by voice**.
5. **Breathe** offers today's session up front and guides the breathing live.
6. Full **EN / हिं** toggle; every line is bilingual.

---

## Option B — "Care for my people" (household, L3)

**As a** caregiver setting up for my family,
**I want** one assistant that knows each family member and proactively connects their daily care,
**so that** in a single morning I can look after everyone — and be looked after too.

**L3 acceptance moments (first-day setup, power = household graph + proactivity, not memory):**
1. **Household voice onboarding** names the family and records **my own voice** for reminders.
2. **Member-aware triage**: I pick who's unwell (Aarav 3 · Ramesh 58 diabetic · Maa 72 BP · me);
   for the toddler it raises caution, opens a watch, and **auto-escalates to a pediatrician**.
3. **Caregiver loop** in one morning: a medicine reminder delivered as a **call in my recorded
   voice**, today's sugar logged, a trend + planned-lunch connection, a **meal nudge** from what's
   home, a **home lab booking** for the due HbA1c, and a **self-care nudge for me**.
4. **Weekly-glance** summary of the whole household.
5. Full **EN / हिं** toggle.

---

### What makes both "L3" (not just prettier L1)
- **Proactive, not reactive** — it opens with "today's" offers instead of waiting to be asked.
- **Context-aware in-session** — profile / household graph removes re-asking.
- **It doesn't vanish** — episodic watch + self-driven escalation within an illness.
- **Voice-first** — onboarding and every guided flow are spoken.
- **New-user-first** — every wow lands in session one; nothing needs weeks of history.
