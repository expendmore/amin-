# ExpendMore — Project Brain 🧠

> 🔒 **MANDATORY SESSION START ORDER:**
> 1. `.project/LOCKED_DECISIONS.md` ← Read this first. Always. Immutable decisions live here.
> 2. `.project/RULES.md` ← Engineering law for every session.
> 3. This file (`brain.md`) ← Project state and memory.
>
> **Never introduce a new architecture, database, payment gateway, or auth system without explicit user approval of a locked decision.**

> **READ THIS FIRST at the start of every session. Never restart planning. Continue from here.**

---

## Last Updated
2026-07-01 · Session 3 — WhatsApp Web UI & Design System Implemented 🎨

> **Visual Recovery Complete**: Migrated global variables and typography rules to match the logo’s cyan/emerald palette. Formulated visual audits and design tokens. Customized the entire chat log stream to use WhatsApp Web style backgrounds, incoming/outgoing bubbles, blue double checkmarks next to timestamps, and custom green send buttons.

---

## What ExpendMore Is

Enterprise multi-tenant SaaS — WhatsApp Business Marketing Platform with future expansion into AI Agents, CRM, Email, SMS, Workflow Automation, Team Inbox, APIs, Analytics and a full Business OS.

Competitors for design/feature reference: **WATI, Interakt, AiSensy**

---

## Current Project State

### Phase
**WhatsApp UI Customization Completed / Ready for Production Verification**
The styling and chat screen layouts of ExpendMore have been completely updated to emulate the familiar WhatsApp Web layout. All baseline recovery tasks and Firestore Rules fixes are fully staged.

### Deployment & CI
- **Vercel** — active deployment at `whatsapp-automation-eta-six.vercel.app`
- `vercel.json` configured directly with `next build` (removed failing Prisma steps).
- GitHub Actions CI/CD rewritten for Node 20 + Firebase environment configuration secrets.
- `.gitignore` updated and credential JSON files neutralized from the codebase.

---

## What Was Done This Session

- Configured global CSS variables for primary and secondary brand colors in `globals.css`.
- Fixed the `boxShadow` structure placement inside `tailwind.config.js`.
- Injected `aria-current` navigation labels for visual accessibility in the Sidebar.
- Cleaned up brand logo typography header styles on desktop and mobile.
- Corrected landing page copy to reference Firebase edge session auth.
- Created a route-level shimmer loading skeleton under `src/app/(dashboard)/loading.tsx`.
- Formulated the design system specifications, visual audits, and brand analysis documents under `.project/`.
- Styled chat layout stream with custom WhatsApp Web incoming/outgoing bubble themes, double read ticks, and input panel backgrounds.
- Solved first-time login/signup write restriction bug in `firestore.rules`.

---

## Key File Map

| Purpose | File |
|---------|------|
| Brand Design Specs | `.project/ui-design-system.md` |
| UI Audit Tracker | `.project/ui-audit.md` |
| Brand Colors Analysis | `.project/ui-brand-analysis.md` |
| Global Variables | `src/app/globals.css` |
| Tailwind Configurations | `tailwind.config.js` |
| Chat details page | `src/app/(dashboard)/chat/[conversationId]/page.tsx` |
| Global Loading Skeletons | `src/app/(dashboard)/loading.tsx` |
| Sidebar Component | `src/components/navigation/Sidebar.tsx` |
| Navbar Component | `src/components/navigation/Navbar.tsx` |
| Firebase Admin SDK | `src/lib/firebase-admin.ts` |
| Payments (PhonePe) | `src/lib/payments.ts` |
| Storage Manager | `src/lib/storage.ts` |
| Billing Webhook Route | `src/app/api/v1/billing/webhook/route.ts` |
| WhatsApp Webhooks Route | `src/app/api/v1/whatsapp/webhooks/route.ts` |
| Firestore Rules | `firestore.rules` |
