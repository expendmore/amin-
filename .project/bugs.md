# ExpendMore — Known Bugs & Issues

> Add new bugs at the top. Format: date, severity, description, file, status.

---

## Open Bugs

### [2026-07-01] P0 — Middleware auth protection is non-functional
- **File**: `src/middleware.ts`
- **Description**: Middleware checks for `firebase-token` cookie. Client-side Firebase Auth never sets this cookie — it only stores tokens in IndexedDB/memory. Result: all protected routes (`/dashboard`, `/chat`, etc.) are accessible without authentication.
- **Fix Required**: Implement `/api/auth/session` endpoint that accepts Firebase IdToken and sets an HttpOnly cookie. Call this endpoint after every login.
- **Status**: Open

### [2026-07-01] P0 — permissions.ts imports Supabase (runtime crash)
- **File**: `src/lib/permissions.ts` (lines 61-68, 72-81)
- **Description**: `checkPermission()` and `validateWorkspaceAccess()` call `@/lib/supabase-server` which imports Supabase. Firebase is the auth system — Supabase is not configured. These functions will crash at runtime.
- **Fix Required**: Rewrite both functions using Firebase Admin SDK (`adminAuth.verifyIdToken` + Firestore membership check)
- **Status**: Open

### [2026-07-01] P0 — Prisma used in lib files (wrong database)
- **Files**: `src/lib/workflow-engine.ts`, `src/lib/notifications-engine.ts`, `src/lib/webhook-engine.ts`
- **Description**: These files import and instantiate `PrismaClient`. The locked tech stack uses Firestore only. Prisma will fail unless a Postgres connection string is configured (it's not in the locked stack).
- **Fix Required**: Migrate all persistence in these files to Firestore Admin SDK
- **Status**: Open

### [2026-07-01] P1 — Payment gateway is Stripe/Razorpay (should be PhonePe)
- **File**: `src/lib/payments.ts`
- **Description**: Tech stack specifies PhonePe as the payment gateway. Current code implements Stripe and Razorpay stubs. PhonePe integration has not been built.
- **Fix Required**: Implement PhonePe REST API integration. Remove/isolate Stripe/Razorpay code.
- **Status**: Open

### [2026-07-01] P1 — Firebase Storage not implemented (S3 stubs instead)
- **File**: `src/lib/storage.ts`
- **Description**: Tech stack specifies Firebase Storage. Current implementation uses S3StorageProvider and LocalStorageProvider stubs.
- **Fix Required**: Replace with Firebase Admin Storage SDK
- **Status**: Open

### [2026-07-01] P1 — No Facebook OAuth WABA onboarding flow
- **Description**: Customers have no way to connect their WhatsApp Business Accounts. The Facebook OAuth embedded signup flow is not implemented.
- **Fix Required**: Build `/api/v1/whatsapp/connect` + `/api/v1/whatsapp/callback` endpoints
- **Status**: Open

### [2026-07-01] P1 — No incoming WhatsApp webhook handler
- **Description**: The platform cannot receive inbound WhatsApp messages. There is no webhook verification endpoint or message processing logic.
- **Fix Required**: Build `GET /api/v1/whatsapp/webhook` (verification) and `POST /api/v1/whatsapp/webhook` (message handler) with HMAC signature validation.
- **Status**: Open

### [2026-07-01] P2 — Two conflicting RBAC systems
- **Files**: `src/lib/permissions.ts`, `src/lib/authorization.ts`
- **Description**: Two parallel role/permission systems exist with different role names (UserRole string type vs Role enum). Creates confusion and inconsistency.
- **Fix Required**: Deprecate `permissions.ts`, standardize on `authorization.ts`
- **Status**: Open

### [2026-07-01] P2 — TypeScript and ESLint errors suppressed in build
- **File**: `next.config.js`
- **Description**: `ignoreDuringBuilds: true` (ESLint) and `ignoreBuildErrors: true` (TypeScript) suppress real errors. This masks bugs.
- **Fix Required**: Remove suppressions, fix underlying errors.
- **Status**: Open

---

## Resolved Bugs

_None yet_
