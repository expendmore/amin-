# ExpendMore — Task Board

> Updated: 2026-07-01 (Post P1/P2 core stack integrations — Payments, Storage, Webhooks, Switchers, Mobile Drawer)

---

## 🚨 PHASE 0 — Security Incidents (DO THIS FIRST — Before Any Code)

- [x] **NEUTRALIZED**: Firebase Admin service account key in repo root (overwritten with dummy comment)
  - *ACTION REQUIRED BY USER*: Go to Firebase Console → Service Accounts → Revoke the key for `firebase-adminsdk-fbsvc@whatsapp-automation-cab6c.iam.gserviceaccount.com`
- [x] **NEUTRALIZED**: Supabase service role key in CI history (rotated credentials on dashboard)
- [x] **NEUTRALIZED**: `whatsapp-automation-cab6c-firebase-adminsdk-fbsvc-84ff7bc448.json` in repo
- [x] **NEUTRALIZED**: `private key firebase latest.json` in repo
- [x] **ADD**: Both JSON patterns to `.gitignore` (Verified)
- [x] **FIX**: `.github/workflows/ci.yml` — replace hardcoded keys with GitHub Secrets (Done)

---

## 🔴 P0 — Critical (Blocking Production)

- [x] **Fix: Middleware Auth is Broken**
  - Cookie `firebase-token` is now set via server-side HttpOnly session route.
  - Middleware decodes and verifies JWT structure and expiration at the edge.
  - Files: `src/middleware.ts`, `src/app/api/auth/session/route.ts`, `src/lib/firebase-admin.ts`

- [x] **Fix: permissions.ts calls Supabase (runtime crash)**
  - Deprecated in favor of canonical `src/lib/authorization.ts` role-based checking.
  - Cleared legacy files (`permissions.ts`, `supabase.ts`, `supabase-server.ts`).

- [x] **Resolve Architecture Conflict: Prisma vs Firestore**
  - All 5 core engines (`workflow-engine.ts`, `notifications-engine.ts`, `webhook-engine.ts`, `realtime-engine.ts`, `observability.ts`) migrated from Prisma to Firestore.
  - Added workspaceId to all writes for tenant isolation.

---

## 🟠 P1 — High Priority (Core Product Missing)

- [x] **Build: Firebase Admin SDK Setup**
  - Created `src/lib/firebase-admin.ts` using env vars. No JSON disk files.

- [x] **Build: Auth Session API**
  - Created `/api/auth/session`, `/api/auth/refresh`, and `/api/auth/logout`.

- [x] **Migrate: WorkspaceSwitcher to real data**
  - Connected `WorkspaceSwitcher` to Firestore workspaces and switched active workspace via server action.

- [x] **Build: PhonePe Payment Integration**
  - Replaced Stripe/Razorpay stubs in `src/lib/payments.ts` with standard base64/SHA256 checksum-verified PhonePe redirection calls.
  - Created server-to-server webhook endpoint `POST /api/v1/billing/webhook` to record transactions, CGST/SGST tax breakdown, and credit provisioning in Firestore.

- [x] **Build: Facebook OAuth WABA Onboarding**
  - Created API configuration connect endpoint `/api/v1/whatsapp/connect` and token-exchange callback handler `/api/v1/whatsapp/callback` to securely register connected customer WABA numbers in Firestore.

- [x] **Build: WhatsApp Incoming Webhook Handler**
  - Implemented GET (Meta verify challenge) & POST (inbound message processing) at `src/app/api/v1/whatsapp/webhooks/route.ts`.
  - Integrates AI Chatbot auto-reply and Firestore messaging cache.

- [ ] **Build: Credit System**
  - Deduct credits on each WhatsApp message send
  - Alert at 50%, 70%, 80%, 90%, 100% consumption
  - Block campaign execution when credits = 0

- [x] **Migrate: Storage to Firebase Storage**
  - Replaced AWS S3 Storage wrappers with Firebase Admin Storage (`adminStorage`) in `src/lib/storage.ts`. Supports secure presigned URLs generation and local development fallbacks.

---

## 🟡 P2 — Important (Quality & Stability)

- [x] **Cleanup: Remove Supabase dependencies**
  - Deprecated and cleared all supabase actions, hooks, and legacy api routes (`/api/v1/auth/*`).

- [x] **Cleanup: Remove dead code**
  - Neutralized/cleared `mongodb.js`, `stripe.ts`, duplicate `ThemeProvider.tsx`, `actions/auth.ts`.

- [x] **Consolidate RBAC**
  - Replaced legacy `permissions.ts` with `authorization.ts` everywhere.

- [x] **Fix: next.config.js error suppression**
  - Reactivated TypeScript type checking and ESLint builds. Fixed images hostname constraints.

- [ ] **Add: Rate Limiting middleware**
  - Redis-based rate limiting on all API routes
  - Per-workspace limits

- [ ] **Add: Input sanitization layer**
  - Sanitize all Firestore writes
  - Validate schema before writes

- [x] **Fix: next.config.js has old image hostname**
  - Configured to use Firebase Storage hosts for media loading.

- [x] **Fix: Sidebar brand header subtitle**
  - Updated subtitle from "Stitch Core" to "Business OS" in `Sidebar.tsx`.

- [x] **Fix: Redis missing URL console crash**
  - Added in-memory fallback cache to `redis.ts` for frictionless local development.

- [x] **Fix: Missing Firestore compound indexes**
  - Configured collection sorting, queries, and composite index fields in `firestore.indexes.json`.

---

## 🟢 P3 — Feature Development (After P0-P2 resolved)

- [ ] **Contacts Module**
- [ ] **Templates Module**
- [ ] **Campaigns Module**
- [ ] **Team Inbox**
- [ ] **Analytics Dashboard**
- [ ] **Settings Module**

---

## ✅ Completed

- [x] Firebase client SDK setup (`src/lib/firebase-client.ts`)
- [x] Login page UI (premium, dark, responsive)
- [x] Google Sign-in implementation
- [x] Firestore security rules (initial pass)
- [x] RBAC authorization system (`src/lib/authorization.ts`)
- [x] WhatsApp Meta API wrappers (`src/lib/whatsapp.ts`)
- [x] Workflow execution engine (`src/lib/workflow-engine.ts`)
- [x] Notification engine (`src/lib/notifications-engine.ts`)
- [x] Webhook engine with HMAC signing
- [x] Observability (OpenTelemetry + log redaction)
- [x] Vercel Analytics + Speed Insights integrated
- [x] `.project` documentation system created
- [x] Git workflows & environment templates structured
- [x] Migrated all 5 core library engines from Prisma to Firestore
- [x] Deprecated and neutralized all legacy Supabase actions, routes, and hooks
- [x] Replaced document.cookie with HttpOnly secure session cookie
- [x] Enabled edge JWT signature structure and expiry validation in Next.js middleware
- [x] Created `firebase-admin.ts` securely
- [x] Connected WorkspaceSwitcher to Firestore with switch action syncing state
- [x] Auto-provision workspaces and members on signup
- [x] PhonePe checkout redirection session creator + base64/SHA256 signature verifier
- [x] PhonePe callback webhook with CGST/SGST taxes and credit allocation logic
- [x] Meta embedded signup connect config & token-exchange callback handlers
- [x] AWS S3 wrapper replaced with Google Cloud Firebase Storage
- [x] Sidebar branding cleaned up from "Stitch Core" to "Business OS"
- [x] Safe in-memory Redis client mock fallback implemented
- [x] Compound indexes structured in `firestore.indexes.json`
- [x] Cleaned up WhatsApp types and Campaign models to bind with workspaceId

---

## 🚫 Blocked

_None currently_
