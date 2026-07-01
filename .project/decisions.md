# ExpendMore — Architecture Decisions Log

> Permanent record of WHY decisions were made. Never delete entries.

---

## [2026-07-01] Firebase as sole auth and database system

**Context**: Multiple auth systems (Firebase, Supabase, Clerk, NextAuth) and databases (Firestore, Postgres/Prisma, MongoDB, Supabase) were found in the codebase simultaneously.

**Decision**: Firebase Auth + Firestore is the locked stack. All other auth/DB systems are to be removed.

**Reasoning**:
- Firebase is serverless, auto-scaling, and tightly integrated with Firestore security rules
- Firestore security rules provide defense-in-depth without additional server logic
- Supabase, Prisma, Clerk add complexity and deviate from the locked tech stack specified in the master system prompt
- Firebase has a generous free tier and predictable scaling costs
- All Firebase services (Auth, Firestore, Storage, FCM) integrate natively

**Alternatives Considered**:
- Supabase — rejected (not in locked stack)
- Postgres + Prisma — rejected (not in locked stack; too much DevOps overhead for a Vercel deployment)
- NextAuth — rejected (not in locked stack; Firebase Auth is already implemented)

**Impact**: Requires migration of `workflow-engine.ts`, `notifications-engine.ts`, and `webhook-engine.ts` from Prisma to Firestore.

---

## [2026-07-01] PhonePe as sole payment gateway

**Context**: `payments.ts` implemented Stripe and Razorpay. Tech stack specifies PhonePe.

**Decision**: PhonePe only for production payments.

**Reasoning**:
- ExpendMore targets the Indian market primarily
- PhonePe has the best UPI integration and Indian merchant support
- Stripe has USD-first design and complexity for INR billing
- Master system prompt explicitly specifies PhonePe

**Impact**: Stripe and Razorpay code must be replaced. New PhonePe REST API integration required.

---

## [2026-07-01] HttpOnly Cookie for Firebase Session

**Context**: Middleware checks for `firebase-token` cookie but client-side Firebase SDK never sets this cookie (it uses IndexedDB).

**Decision**: Implement `/api/auth/session` endpoint. Client POSTs Firebase IdToken after login. Server validates with Firebase Admin, sets HttpOnly cookie.

**Reasoning**:
- HttpOnly cookies prevent XSS token theft
- SameSite=Strict prevents CSRF
- Aligns with Next.js best practices for server-side auth
- Allows middleware to perform fast cookie-presence check without full JWT validation

**Impact**: Login component must call `/api/auth/session` after Firebase signIn(). Token refresh needs corresponding endpoint.

---

## [2026-07-01] Single Meta App (not per-customer)

**Context**: WhatsApp Business API requires a Meta App.

**Decision**: One official ExpendMore Meta App. Customers connect their own WABA through Facebook OAuth embedded signup.

**Reasoning**:
- Creating per-customer Meta Apps is operationally impossible at scale
- Official Meta BSP model uses embedded signup
- Tokens are scoped to specific WABA — one app can manage multiple customer accounts
- Matches the model used by WATI, Interakt, AiSensy

**Impact**: Requires Facebook OAuth flow at `/api/v1/whatsapp/connect`. Requires secure WABA token storage in Firestore (encrypted).

---

## [2026-07-01] Firebase Storage (not S3)

**Context**: `storage.ts` implemented S3 provider stubs.

**Decision**: Firebase Storage for all file/media storage.

**Reasoning**:
- Firebase Storage integrates natively with Firebase Auth (same identity system)
- Firebase Storage security rules share the same model as Firestore
- Eliminates need for AWS credentials and IAM management
- Simpler for a Vercel + Firebase stack

**Impact**: `storage.ts` needs to be rewritten using Firebase Admin Storage SDK.

---

## [2026-07-01] Deprecate permissions.ts in favor of authorization.ts

**Context**: Two parallel RBAC systems exist with different role models and inconsistent designs.

**Decision**: `authorization.ts` is canonical. `permissions.ts` is deprecated.

**Reasoning**:
- `authorization.ts` uses proper TypeScript enums (Role, Permission)
- `authorization.ts` has clean sync functions without database dependencies
- `permissions.ts` has Supabase imports that will crash (wrong auth system)
- Consolidation reduces cognitive overhead

**Impact**: Any code importing from `permissions.ts` must be updated to use `authorization.ts`.

---

## [2026-07-01] Vercel as sole hosting platform

**Decision**: Deploy to Vercel only. No Docker, no self-hosted servers in production.

**Reasoning**:
- Native Next.js integration
- Zero-config serverless functions
- Edge network + CDN included
- No DevOps maintenance burden
- GitHub auto-deploy pipeline

**Note**: Dockerfile and docker-compose exist for local development parity only.
