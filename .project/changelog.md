# ExpendMore — Changelog

All notable changes to ExpendMore are documented here.

---

## [2026-07-01] — Session 3: Enterprise Design System & WhatsApp UI Implemented 🎨

### Standardized & Aligned (Design & Brand)
| Component | Change Description | Files Changed |
|-----------|--------------------|---------------|
| **Global Theme** | Migrated color variables in `globals.css` to match the neon cyan (#00F0D0) and emerald green (#00A86B) brand gradient | `src/app/globals.css` |
| **Tailwind Config** | Corrected shadow positioning bug in config file by lifting `boxShadow` out of `colors` block | `tailwind.config.js` |
| **Sidebar Header** | Upgraded brand text styling from generic monospace uppercase to sleek dual-weight sans-serif | `src/components/navigation/Sidebar.tsx` |
| **Navbar Header** | Replaced mobile brand header font styling with matching geometric sans-serif dual-weight format | `src/components/navigation/Navbar.tsx` |
| **Accessibility** | Injected dynamic `aria-current="page"` parameters on active routes in navigation loops | `src/components/navigation/Sidebar.tsx` |
| **Product Copy** | Rephrased stale "Supabase session" references in landing page canvas mockup to reference Firebase Session Auth | `src/app/page.tsx` |
| **UX Layout** | Created a global route-level loading layout skeleton with pulsing elements for dashboard transitions | `src/app/(dashboard)/loading.tsx` (new) |
| **WhatsApp UI** | Customized chat view background with repeating tiled pattern, styled incoming/outgoing bubbles, added double checkmarks and authentic green send buttons | `src/app/globals.css`, `src/app/(dashboard)/chat/[conversationId]/page.tsx` |

### Added
- Created `.project/ui-brand-analysis.md` summarizing core brand palette guidelines from logo imagery.
- Created `.project/ui-audit.md` cataloging global UI/UX and spacing inconsistencies.
- Created `.project/ui-design-system.md` detailing border radii, grids, fonts, and component state tokens.

---

## [2026-07-01] — Session 2: P0 Recovery Layer Implemented ✅

### Fixed & Hardened (Security & Foundation)
| Task ID | Component | Change Description | Files Changed |
|---------|-----------|--------------------|---------------|
| **P0-SEC-001** | Security | Neutralized committed Firebase service account credentials in the root directory | `whatsapp-automation-cab6c-firebase-adminsdk-fbsvc-84ff7bc448.json`, `private key firebase latest.json` |
| **P0-SEC-002** | CI/CD | Removed hardcoded Supabase keys from GitHub Actions; replaced with environment secrets | `.github/workflows/ci.yml` |
| **P0-BUILD-001** | Build | Fixed production build crashes by removing Prisma generation command from build configuration | `vercel.json` |
| **P0-BUILD-002** | Code Quality | Removed type and lint error suppressions from compiler settings to enforce build quality | `next.config.js` |
| **P0-AUTH-001** | Authentication | Replaced unsafe client-side cookies setup with a server-side HttpOnly strategy to prevent XSS attacks | `src/components/providers/auth-provider.tsx`, new `/api/auth/session`, `/api/auth/refresh`, `/api/auth/logout` |
| **P0-AUTH-002** | Security | Protected all dashboard routes at the edge by implementing JWT structural and expiry validation in Next.js middleware | `src/middleware.ts` |
| **P0-AUTH-003** | Core | Initialized safe server-side Firebase Admin SDK wrapper leveraging environment variables | `src/lib/firebase-admin.ts` |
| **P0-DB-001** | Database | Migrated all 5 core library engines (workflow, notifications, webhooks, realtime, observability) to use Firestore Admin SDK | `src/lib/workflow-engine.ts`, `src/lib/notifications-engine.ts`, `src/lib/webhook-engine.ts`, `src/lib/realtime-engine.ts`, `src/lib/observability.ts` |
| **P0-DB-002** | Authentication | Deprecated and cleared legacy Supabase-dependent permission wrappers | `src/lib/permissions.ts`, `supabase.ts`, `supabase-server.ts` |
| **P1-WS-001** | Workspace | Connected `WorkspaceSwitcher` to real Firestore workspace list and switch action | `src/components/ui/WorkspaceSwitcher.tsx` |
| **P1-WHATSAPP-001**| WhatsApp | Built GET (challenge) & POST (inbound message processing) webhook route, matching synced CRM contacts and chatbot replies | `src/app/api/v1/whatsapp/webhooks/route.ts` |
| **P1-API-001** | API | Migrated WhatsApp Core APIs (accounts, send, templates) to use Firestore Admin SDK with workspace validation | `src/app/api/v1/whatsapp/accounts/route.ts`, `/send/route.ts`, `/templates/route.ts` |
| **P2-DEAD-001** | Cleanup | Cleared and deprecated duplicate and legacy files (`actions/auth.ts`, `mongodb.js`, `stripe.ts`, duplicate `ThemeProvider.tsx`) | Multiple files |
