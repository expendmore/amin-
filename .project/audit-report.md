# ExpendMore — Complete Project Audit Report

**Audit Date**: 2026-07-01  
**Auditor**: Lead Architect (AI)  
**Scope**: Full codebase — all files, configs, infra, and documentation

---

## 🏥 Overall Project Health Score: 42 / 100

| Category | Score | Grade |
|----------|-------|-------|
| Architecture Coherence | 3/10 | ❌ F |
| Authentication & Security | 4/10 | ❌ F |
| Database Consistency | 2/10 | ❌ F |
| Core Feature Completeness | 5/10 | ⚠️ D |
| UI / Component Quality | 8/10 | ✅ B+ |
| Code Quality | 5/10 | ⚠️ D |
| Test Coverage | 2/10 | ❌ F |
| Deployment Readiness | 4/10 | ❌ F |
| Documentation | 7/10 | ✅ B |
| Performance | 5/10 | ⚠️ D |

> **Verdict**: The UI layer is genuinely excellent. The backend/infrastructure layer is critically broken with multiple P0 architecture conflicts that will prevent the app from functioning correctly in production.

---

## ✅ Completed & Working Features

### Authentication (Partial — Client Side Only)
- ✅ Firebase client SDK correctly initialized (`src/lib/firebase-client.ts`)
- ✅ Google Sign-in implemented and working
- ✅ Email + Password login implemented
- ✅ `AuthProvider` (`src/components/providers/auth-provider.tsx`) — **excellent implementation**
  - Correctly uses `onIdTokenChanged` (catches token refresh, not just login)
  - Sets `firebase-token` cookie using `document.cookie` after each token refresh ✅
  - Creates user profile in Firestore on first login ✅
  - Loads user role from Firestore on subsequent logins ✅
  - Clears cookie on logout ✅
- ✅ `RoleGuard` component — clean and correct implementation
- ✅ Login page — premium, dark, accessible, responsive

### UI / Components
- ✅ `Sidebar` — collapsible, animated, tooltips, badge system — **very well built**
- ✅ `DashboardShell` — double-render prevention via context — clever solution
- ✅ `WorkspaceSwitcher` — Radix UI dropdown, clean styling
- ✅ `CommandPalette` — Cmd+K global search integration
- ✅ Tailwind config — extensive design token system (Material Design 3 compatible)
- ✅ globals.css — complete light/dark CSS variable system
- ✅ Landing page (`page.tsx`) — 688 lines, interactive demo, pricing, FAQ
- ✅ WhatsApp Hub page — 1043 lines, 7 tabs, rich UI mockups
- ✅ Framer Motion animations throughout
- ✅ `@vercel/analytics` + `@vercel/speed-insights` integrated

### Architecture Foundations (Library Layer)
- ✅ RBAC: `authorization.ts` — clean Role + Permission enum system
- ✅ WhatsApp Meta API wrappers (`whatsapp.ts`) — send, templates, register phone
- ✅ Redis cache layer (`redis.ts`) — Upstash, typed wrappers
- ✅ Job queue system (`queue.ts`) — Redis-backed, retry + DLQ support
- ✅ HMAC webhook signing (`webhook-engine.ts`)
- ✅ Notification engine skeleton (`notifications-engine.ts`)
- ✅ Workflow executor engine (`workflow-engine.ts`)
- ✅ Firestore security rules — comprehensive, workspace-isolated
- ✅ Firebase Admin SDK partially initialized (`firebase.js`)
- ✅ 25 TypeScript type files defined
- ✅ 31 Zustand stores (hooks) defined

### DevOps / Infra
- ✅ Vercel deployment configured (`vercel.json`)
- ✅ Dockerfile + docker-compose for local dev
- ✅ Nginx config
- ✅ GitHub Actions CI pipeline
- ✅ Husky + lint-staged pre-commit hooks

---

## ❌ Broken Features (Will Fail at Runtime)

### CRITICAL — P0

#### 1. Cookie Security Vulnerability
**File**: `src/components/providers/auth-provider.tsx` L33-45  
**Issue**: The `setCookie()` helper sets the cookie via `document.cookie` which does NOT support `HttpOnly`. The cookie is readable by JavaScript — defeating XSS protection. Additionally, the cookie is set as `samesite=lax` not `strict`.
```javascript
// CURRENT (INSECURE) — cookie is readable by JS
document.cookie = name + "=" + value + "; path=/; secure; samesite=lax";

// REQUIRED — cookie set server-side via Set-Cookie header (HttpOnly)
// POST /api/auth/session → Server sets HttpOnly cookie
```
**Impact**: XSS attack can steal the token. However, functionality partially works — middleware sees the cookie.

#### 2. Middleware — Cookie Presence ≠ Valid Auth
**File**: `src/middleware.ts` L4-5  
**Issue**: Middleware checks `request.cookies.get("firebase-token")?.value` as a truthy/falsy check ONLY. It never verifies the token signature. An attacker can set any arbitrary value for `firebase-token` and bypass all route protection.
```typescript
// CURRENT — trivially bypassable
const firebaseToken = request.cookies.get("firebase-token")?.value;
const isAuthenticated = !!firebaseToken; // "hello" == authenticated!
```
**Impact**: All protected routes (`/dashboard`, `/admin`, `/chat`, etc.) are bypassed by any non-empty cookie value.

#### 3. Prisma in 5 Library Files — Wrong Database
**Files**: `workflow-engine.ts`, `notifications-engine.ts`, `webhook-engine.ts`, `realtime-engine.ts`, `observability.ts`  
**Issue**: All instantiate `new PrismaClient()`. Prisma requires a `DATABASE_URL` (PostgreSQL connection string). The locked tech stack uses Firestore only. No `DATABASE_URL` env var is present in `.env.example`. These 5 files will throw at import time in production.
```typescript
// APPEARS IN 5 FILES — will crash without DATABASE_URL
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); // ❌ crashes without DATABASE_URL
```

#### 4. Vercel Build Will Fail — Prisma Generate Required
**File**: `vercel.json`  
```json
"buildCommand": "npx prisma generate && next build"
```
Prisma schema must exist and `DATABASE_URL` must be set for `prisma generate` to succeed. Neither is configured correctly. **Every production build is currently failing.**

#### 5. `permissions.ts` — Supabase Import (Runtime Crash)
**File**: `src/lib/permissions.ts` L61-68  
**Issue**: `checkPermission()` and `validateWorkspaceAccess()` dynamically import `@/lib/supabase-server` which attempts to connect to Supabase. Supabase is not the auth system.

#### 6. `firebase.js` — Service Account JSON File Hardcoded
**File**: `src/lib/firebase.js` L6-7  
**Issue**: References a file path `whatsapp-automation-cab6c-firebase-adminsdk-fbsvc-84ff7bc448.json` in the project root. This file exists in the repo (2.4KB confirmed). **A Firebase Admin service account JSON file is committed to version control.** This is a critical security incident.

#### 7. GitHub Actions CI — Hardcoded Supabase Keys
**File**: `.github/workflows/ci.yml` L14-16  
**Issue**: Real Supabase API keys (`sb_publishable_...`, `sb_secret_...`) are hardcoded in the CI YAML file. These are committed to git history and are now **exposed in version control**.
```yaml
NEXT_PUBLIC_SUPABASE_URL: https://ojracvgpsmppxtszrjrw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY: sb_publishable_REDACTED
SUPABASE_SERVICE_ROLE_KEY: sb_secret_REDACTED  # SERVICE ROLE = ADMIN!
```

---

## ⚠️ Incomplete Features (P1 — High)

### Payment System
- ❌ **PhonePe not implemented** — `payments.ts` has Stripe + Razorpay stubs (mock data, no real API calls)
- ❌ No transaction storage in Firestore
- ❌ No GST tax calculation implementation (mentioned in changelog)
- ❌ No billing webhook handler
- ❌ No credit system (deduction on message send)
- ❌ No credit alert system (50/70/80/90/100%)

### WhatsApp Business
- ❌ **No Facebook OAuth WABA onboarding** — customers cannot connect their WhatsApp accounts
- ❌ **No incoming webhook handler** — platform cannot receive messages
- ❌ **No credit deduction** on message send
- ❌ Campaign execution not wired to real Meta API
- ❌ Contact import from CSV not built
- ❌ Template submission to Meta not built

### API Routes
- ❌ `/api/auth/session` — missing (cookie needs to be HttpOnly, set server-side)
- ❌ `/api/auth/refresh` — missing
- ❌ `/api/auth/logout` — missing
- ❌ `/api/v1/whatsapp/webhook` — missing (Meta webhook verification + handler)
- ❌ `/api/v1/whatsapp/connect` — missing (Facebook OAuth)
- ❌ `/api/v1/billing/*` — missing (all billing endpoints)
- ❌ `/api/v1/contacts` — missing
- ❌ `/api/v1/campaigns` — missing
- ❌ `/api/v1/analytics` — missing
- ❌ `/api/v1/health` — missing (referenced in deployment docs)

### Storage
- ❌ Storage uses S3 stubs — Firebase Storage not implemented

---

## 🔁 Duplicate & Conflicting Code

| Issue | Files | Severity |
|-------|-------|----------|
| Two RBAC systems | `permissions.ts` vs `authorization.ts` | High |
| Two Firebase inits | `firebase.js` (Admin, .js) + `firebase-client.ts` (Client, .ts) — both exist, only client.ts is correct | Medium |
| `cn()` utility defined locally in Sidebar instead of shared | `Sidebar.tsx` L49-51 | Low |
| `WorkspaceSwitcher` uses hardcoded static workspace list | `WorkspaceSwitcher.tsx` L12-15 — not connected to Firestore | High |
| WhatsApp types use `userId` instead of `workspaceId` | `types/whatsapp.ts` — violates multi-tenant isolation rule | High |

---

## 🧟 Dead Code

| File | Issue |
|------|-------|
| `src/lib/mongodb.js` | 144-byte stub — MongoDB not in stack, never used |
| `src/lib/stripe.ts` | Stripe wrapper stub — PhonePe is gateway |
| `src/lib/supabase.ts` | Supabase client — not in stack |
| `src/lib/supabase-server.ts` | Supabase server client — not in stack |
| `src/providers/ThemeProvider.tsx` | Duplicate of `theme-provider.tsx` |
| `src/lib/rag.ts` | RAG embedding pipeline — no upstream consumer found |
| `src/lib/embeddings.ts` | Embedding vector utils — no upstream consumer found |
| `src/lib/chunker.ts` | Text chunker — only used by `rag.ts` which has no consumer |

---

## 🔒 Security Issues

| Severity | Issue | File |
|----------|-------|------|
| 🔴 CRITICAL | Firebase Admin service account JSON committed to git | `whatsapp-automation-cab6c-firebase-adminsdk-fbsvc-84ff7bc448.json` |
| 🔴 CRITICAL | Supabase service role key in CI YAML | `.github/workflows/ci.yml` |
| 🔴 CRITICAL | Middleware doesn't verify token signature | `src/middleware.ts` |
| 🔴 HIGH | Session cookie not HttpOnly — XSS vulnerable | `auth-provider.tsx` |
| 🟠 HIGH | TypeScript errors silenced in production builds | `next.config.js` |
| 🟠 HIGH | `auth.ts` marked `"use client"` but exports email/password login — password login should be server-side | `src/lib/auth.ts` |
| 🟡 MEDIUM | No rate limiting on any route | All API routes |
| 🟡 MEDIUM | WhatsApp access tokens stored in Firestore unencrypted (per schema) | `whatsappAccounts` collection |
| 🟡 MEDIUM | Redis URL has dummy fallback — will silently connect to wrong endpoint | `redis.ts` L5-6 |

---

## ⚡ Performance Issues

| Issue | Location | Impact |
|-------|----------|--------|
| `page.tsx` (landing) is 35KB in a `"use client"` component | `src/app/page.tsx` | Forces large JS bundle on initial page load |
| `whatsapp/page.tsx` is 1043 lines, single `"use client"` component | Inbox/Campaign tabs | No code splitting, massive bundle |
| Tailwind font families reference `Inter` and `JetBrains Mono` but CSS loads from CDN `geist` fonts | Mismatch | Different fonts loading vs configured |
| No `next/image` used anywhere observed | Multiple pages | Missing image optimization |
| No `loading.tsx` implemented at route level for dashboard sections | Dashboard routes | No streaming/loading states |

---

## ♿ Accessibility Issues

| Issue | File |
|-------|------|
| Sidebar nav links have no `aria-current="page"` on active item | `Sidebar.tsx` |
| Campaign count badge `"3"` has no accessible label | `Sidebar.tsx` L106 |
| Login form labels not associated with inputs via `htmlFor` | `login/page.tsx` |
| Command palette — unknown if focus trap + ARIA roles implemented | `CommandPalette.tsx` (not audited) |

---

## 📱 Responsive Design Issues

| Issue | Location |
|-------|----------|
| Sidebar hidden on mobile (`hidden md:flex`) but no mobile nav replacement visible | `DashboardShell.tsx` L32 |
| Landing page uses fixed pixel widths for some sections | `page.tsx` |
| WhatsApp hub 7-tab layout — mobile tab behavior unknown | `whatsapp/page.tsx` |

---

## 🚀 Deployment Issues

| Issue | File | Severity |
|-------|------|----------|
| `vercel.json` runs `prisma generate` — this WILL FAIL without DATABASE_URL | `vercel.json` | 🔴 Critical |
| ESLint disabled during builds — real errors hidden | `next.config.js` | 🟠 High |
| TypeScript errors ignored in builds | `next.config.js` | 🟠 High |
| CI pipeline uses wrong tech stack (Supabase, Stripe, Prisma) | `.github/workflows/ci.yml` | 🟠 High |
| `.env.example` references Clerk, Supabase, Stripe — wrong stack | `.env.example` | 🟡 Medium |
| No production environment variables documented for Firebase | `.env.example` | 🟡 Medium |
| Node.js version `18` in CI — should be `20` for Next.js 15 | `ci.yml` | 🟡 Medium |

---

## 🔥 Firestore Issues

| Issue | File | Severity |
|-------|------|----------|
| `WhatsAppAccount` type uses `userId` not `workspaceId` | `types/whatsapp.ts` | 🟠 High |
| `Campaign` type has `owner: "Me" | "John" | "Sarah"` (hardcoded names) | `types/campaigns.ts` | 🟠 High |
| No Firestore indexes file with required compound indexes | `firestore.indexes.json` (44 bytes = empty) | 🟠 High |
| `WorkspaceSwitcher` uses hardcoded static workspaces, not Firestore | `WorkspaceSwitcher.tsx` | 🟠 High |

---

## 🔑 Missing Environment Variables

The following are required but NOT in `.env.example`:

```
# MISSING — Firebase Admin (correct variable names)
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL  
FIREBASE_ADMIN_PRIVATE_KEY

# MISSING — Meta WhatsApp
META_APP_ID
META_APP_SECRET
META_WEBHOOK_VERIFY_TOKEN

# MISSING — PhonePe
PHONEPE_MERCHANT_ID
PHONEPE_MERCHANT_KEY
PHONEPE_KEY_INDEX

# MISSING — App
NEXT_PUBLIC_APP_URL
```

---

## 🐛 Potential Bugs

| Bug | File | Risk |
|-----|------|------|
| `auth-provider.tsx` catches all errors and silently sets `Role.CUSTOMER` — auth failure looks like guest login | `auth-provider.tsx` L97-100 | High |
| `WorkflowExecutor` has infinite loop risk if `nextStepIds` creates circular graph | `workflow-engine.ts` L50 | Medium |
| `Queue.ts` uses `Math.random()` for job IDs — not collision-safe at scale | `queue.ts` L23 | Medium |
| `redis.ts` defaults to `dummy-token` — if env var missing, silently uses fake Redis | `redis.ts` L5-6 | High |
| `realtime-engine.ts` uses `simulateAiTokenStream` yielding random text — mock still in production file | `realtime-engine.ts` L75-82 | Medium |
| Sidebar branding says "Stitch Core" (old name?) not "ExpendMore" | `Sidebar.tsx` L166 | Low |
| `version.md` — `VERSION.md` says version but sidebar says `1.2.0` — inconsistent | Multiple | Low |

---

## 📊 Code Smells & Technical Debt

| Smell | Severity |
|-------|----------|
| 5 files instantiate `new PrismaClient()` at module level — connection leak risk | Critical |
| `page.tsx` is `"use client"` with 688 lines — should be split into Server + Client components | High |
| `whatsapp/page.tsx` is 1043 lines — violates single responsibility principle | High |
| `useWhatsApp` store returns `accounts` from Zustand but WhatsApp hub page uses mock static data in `apiKeys` state | High |
| `Campaign.owner` type is hardcoded `"Me" | "John" | "Sarah"` — not dynamic | Medium |
| 31 Zustand stores defined — many likely never connected to real Firestore data | Medium |
| Firebase Admin initialized from JSON file path (development hack left in production code) | High |
| `console.error/log/warn` in 15+ production files | Medium |
| `any` type used in multiple places (`Sidebar.tsx` L49, `workflow-engine.ts` L9) | Medium |

---

## 🔮 Future Risks

| Risk | Impact |
|------|--------|
| Prisma schema conflicts if any real Postgres DB is connected | Architecture collapse |
| Supabase keys in CI history — if Supabase project is real, data exposure | Security |
| Service account JSON in repo — Google may have already detected and invalidated it, but rotation needed | Security |
| 31 Zustand stores will create massive memory overhead if all loaded simultaneously | Performance |
| No pagination implemented in any list view — will break at >1000 contacts/campaigns | Scalability |
| No Firestore indexes — compound queries will fail or return wrong results | Data integrity |
| `whatsapp/page.tsx` 1043 lines — will become unmaintainable | Maintainability |
