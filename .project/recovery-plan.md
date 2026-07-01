# ExpendMore — Recovery Plan

**Created**: 2026-07-01  
**Based on**: Full audit (`audit-report.md`)  
**Philosophy**: Fix foundations first. Never rebuild what works. Never skip a phase.

---

## Recovery Sequence Overview

```
Phase 0 → Security (1-2 hours)
Phase 1 → Build Fixes (2-3 hours)  
Phase 2 → Authentication Hardening (3-4 hours)
Phase 3 → Database Migration (4-6 hours)
Phase 4 → WhatsApp Core (1 week)
Phase 5 → Payments (2-3 days)
Phase 6 → Testing & QA (2 days)
Phase 7 → Production Deployment (1 day)
Phase 8 → Feature Development (ongoing)
```

---

## Phase 0 — Security Incident Response 🔴 IMMEDIATE

**Do this NOW before any other work.**

### 0.1 Revoke Exposed Credentials
- [ ] Go to Firebase Console → Service Accounts → **Revoke** the key for `firebase-adminsdk-fbsvc@whatsapp-automation-cab6c.iam.gserviceaccount.com`
- [ ] Go to Supabase Dashboard → API → **Rotate** the anon key and service role key (they're in CI history)
- [ ] Generate a new Firebase Admin service account JSON

### 0.2 Remove Secrets from Repo
- [ ] Delete `whatsapp-automation-cab6c-firebase-adminsdk-fbsvc-84ff7bc448.json` from repo root
- [ ] Delete `private key firebase latest.json` from repo root  
- [ ] Delete `whatsapp-automation-cab6c-firebase-adminsdk-fbsvc-84ff7bc448.json` reference in `firebase.js`
- [ ] Clean CI YAML: replace hardcoded keys with GitHub Secrets references
- [ ] Add both JSON files to `.gitignore`
- [ ] Run `git filter-repo` or BFG to purge from git history

### 0.3 Update .gitignore
```
# Add to .gitignore
*firebase-adminsdk*.json
*service-account*.json
*.private-key.json
.env.local
.env.production
```

### 0.4 Verify No Other Secrets in Codebase
```bash
# Grep for hardcoded keys
grep -r "sk_live_" src/
grep -r "AIzaSy" src/
grep -r "whsec_" src/
grep -r "sb_secret" .github/
```

---

## Phase 1 — Fix Build Failures 🔴 CRITICAL

**Goal**: `npm run build` must succeed with zero errors.

### 1.1 Fix vercel.json Build Command
**File**: `vercel.json`

```json
// BEFORE
"buildCommand": "npx prisma generate && next build"

// AFTER  
"buildCommand": "next build"
```

### 1.2 Enable TypeScript & ESLint Checks
**File**: `next.config.js`

```javascript
// Remove these suppressions — fix the real errors instead
// typescript: { ignoreBuildErrors: true }    ← REMOVE
// eslint: { ignoreDuringBuilds: true }       ← REMOVE
```

### 1.3 Remove Dead Dependencies
Run after fixing imports:
```bash
npm uninstall @supabase/ssr @supabase/supabase-js prisma @prisma/client stripe
npm uninstall @clerk/nextjs next-auth
```

### 1.4 Remove Dead Code Files
Delete these files:
- `src/lib/mongodb.js`
- `src/lib/stripe.ts`
- `src/lib/supabase.ts`
- `src/lib/supabase-server.ts`
- `src/components/providers/ThemeProvider.tsx` (duplicate of `theme-provider.tsx`)
- `src/lib/permissions.ts` (deprecated — use `authorization.ts`)

### 1.5 Fix CI Pipeline
**File**: `.github/workflows/ci.yml`

```yaml
# Replace entire env block with:
env:
  NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
  UPSTASH_REDIS_REST_URL: ${{ secrets.UPSTASH_REDIS_REST_URL }}
  UPSTASH_REDIS_REST_TOKEN: ${{ secrets.UPSTASH_REDIS_REST_TOKEN }}

# Remove Prisma validation step
# Remove DATABASE_URL, Supabase, Stripe env vars

# Update Node.js version to 20
node-version: 20
```

### 1.6 Fix .env.example
Rewrite to reflect the actual locked tech stack (Firebase + PhonePe + Meta + Redis).

---

## Phase 2 — Authentication Hardening 🔴 CRITICAL

**Goal**: Middleware must cryptographically verify tokens. Cookie must be HttpOnly.

### 2.1 Create Firebase Admin SDK Module
**New File**: `src/lib/firebase-admin.ts`

```typescript
// Server-only — never import in client components
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
```

Delete `src/lib/firebase.js` after this is done.

### 2.2 Create Auth Session API Routes
**New Files**:
- `src/app/api/auth/session/route.ts` — POST: verify IdToken → set HttpOnly cookie
- `src/app/api/auth/refresh/route.ts` — POST: refresh token → re-issue cookie
- `src/app/api/auth/logout/route.ts` — POST: clear cookie

```typescript
// POST /api/auth/session
export async function POST(request: NextRequest) {
  const { idToken } = await request.json();
  const decoded = await adminAuth.verifyIdToken(idToken);
  
  const response = NextResponse.json({ success: true, uid: decoded.uid });
  response.cookies.set("firebase-token", idToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return response;
}
```

### 2.3 Update AuthProvider to Call Session API
**File**: `src/components/providers/auth-provider.tsx`

After Firebase signIn, call `POST /api/auth/session` instead of using `document.cookie`:
```typescript
// Replace setCookie() call with:
const token = await currentUser.getIdToken();
await fetch("/api/auth/session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ idToken: token }),
});
```

### 2.4 Harden Middleware to Verify Token
**File**: `src/middleware.ts`

The middleware cannot use Firebase Admin (edge runtime). Two options:
- **Option A** (Recommended): Use Firebase Admin in middleware with `nodejs` runtime flag
- **Option B**: Use session cookie + separate `/api/auth/verify` check  
- **Option C**: Switch middleware to use Firebase session cookies (Admin creates them client gets them)

**Recommended**: Verify token structure in middleware (JWT decode without verify for fast path), full verify happens in each API route.

```typescript
// middleware.ts — decode JWT to check expiry without full verify
// API routes — full adminAuth.verifyIdToken() for every request
```

### 2.5 Create API Route Auth Helper
**New File**: `src/lib/api-auth.ts`

```typescript
export async function verifyApiAuth(request: NextRequest) {
  const token = request.cookies.get("firebase-token")?.value;
  if (!token) return { uid: null, error: "Unauthorized" };
  
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid, error: null };
  } catch {
    return { uid: null, error: "Token expired or invalid" };
  }
}
```

---

## Phase 3 — Database Cleanup & Migration 🟠 HIGH

**Goal**: Remove all Prisma/Supabase references. Pure Firebase/Firestore everywhere.

### 3.1 Migrate workflow-engine.ts
Replace `prisma.workflowExecution.create()` with Firestore:
```typescript
// Replace Prisma with:
import { adminDb } from "./firebase-admin";
await adminDb.collection("workflowExecutions").add({
  workspaceId, workflowId, status, logs, startedAt, latencyMs,
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});
```

### 3.2 Migrate notifications-engine.ts
Replace `prisma.notification.create()` with Firestore:
```typescript
await adminDb.collection("notifications").add({
  workspaceId, title, body, isRead: false,
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});
```

### 3.3 Migrate webhook-engine.ts
Replace `prisma.auditLog.create()` with Firestore:
```typescript
await adminDb.collection("auditLogs").add({
  workspaceId, userId: "system", action,
  timestamp: admin.firestore.FieldValue.serverTimestamp()
});
```

### 3.4 Migrate realtime-engine.ts
Replace `prisma.auditLog.create()` with Firestore (same as 3.3).

### 3.5 Migrate observability.ts
Replace `prisma.auditLog.create()` + `prisma.$queryRaw` with Firestore health check.

### 3.6 Migrate storage.ts to Firebase Storage
Replace S3/Local providers with Firebase Admin Storage:
```typescript
import { adminStorage } from "./firebase-admin";
const bucket = adminStorage.bucket();
await bucket.upload(localPath, { destination: filePath });
```

### 3.7 Fix Firestore Indexes
**File**: `firestore.indexes.json`

Add all required compound indexes for workspace queries.

### 3.8 Fix Type Definitions
- `types/whatsapp.ts`: Change `userId` → `workspaceId` in `WhatsAppAccount` and `WhatsAppTemplate`
- `types/campaigns.ts`: Remove `owner: "Me" | "John" | "Sarah"` — use `ownerId: string` + `ownerEmail: string`

### 3.9 Fix WorkspaceSwitcher
Connect to real Firestore data via `useWorkspace` store instead of hardcoded names.

---

## Phase 4 — WhatsApp Core Module 🟠 HIGH

**Goal**: The platform's primary product must actually work end-to-end.

### 4.1 Build WhatsApp Webhook Handler (FIRST — allows receiving messages)
- `GET /api/v1/whatsapp/webhook` — Meta hub.challenge verification
- `POST /api/v1/whatsapp/webhook` — Inbound message processor
  - Validate `X-Hub-Signature-256` HMAC signature
  - Parse message payload
  - Store message in Firestore `messages` collection
  - Update contact `lastMessageAt`

### 4.2 Build Facebook OAuth WABA Onboarding
- `GET /api/v1/whatsapp/connect` — Redirect to Facebook embedded signup
- `GET /api/v1/whatsapp/callback` — Handle OAuth callback
  - Exchange code for system user access token
  - Fetch WABA ID and Phone Number ID
  - Store encrypted credentials in Firestore `whatsappAccounts`

### 4.3 Build Template Sync
- `POST /api/v1/whatsapp/templates/sync` — Fetch from Meta, store in Firestore
- `GET /api/v1/whatsapp/templates` — Serve from Firestore

### 4.4 Build Contact CRUD API
- `GET /api/v1/contacts` — Paginated list with filters
- `POST /api/v1/contacts` — Create contact
- `PATCH /api/v1/contacts/[id]` — Update contact
- `POST /api/v1/contacts/import` — CSV bulk import

### 4.5 Build Campaign Execution Engine
- `POST /api/v1/campaigns` — Create campaign
- `POST /api/v1/campaigns/[id]/run` — Execute campaign
  - Check credits before starting
  - Batch contacts
  - Send via Meta API using `whatsapp.ts` wrappers
  - Deduct credits per message
  - Update campaign `stats` in real-time
  - Stop if credits exhausted

### 4.6 Connect UI to Real Data
- `whatsapp/page.tsx` — Replace all mock state with `useWhatsApp` store calls to API
- Split 1043-line file into sub-components

---

## Phase 5 — PhonePe Payments 🟠 HIGH

### 5.1 Implement PhonePe Integration
- Replace `src/lib/payments.ts` with PhonePe REST API
- Create payment initiation (checkout URL generation)
- Create webhook signature verification
- Store transactions in Firestore

### 5.2 Build Credit System
- Credit deduction service: `deductCredits(workspaceId, amount)`
- Credit alert thresholds: 50%, 70%, 80%, 90%, 100%
- Credit exhaustion stop: campaign pauses when credits = 0

### 5.3 Build Billing API Routes
- `GET /api/v1/billing/plans` — subscription plans
- `POST /api/v1/billing/subscribe` — initiate PhonePe payment
- `POST /api/v1/billing/webhook` — PhonePe S2S callback
- `GET /api/v1/billing/credits` — credit balance

---

## Phase 6 — Testing & QA

### 6.1 Fix Test Infrastructure
- Remove Prisma from Vitest setup
- Add Firebase emulator suite for testing

### 6.2 Write Critical Tests
- Auth flow tests (login → cookie → middleware → API)
- Workspace isolation tests (cross-workspace data access denied)
- WhatsApp webhook signature verification tests
- Credit deduction tests
- Campaign execution flow tests

### 6.3 Responsive / UI Testing
- Mobile navigation (currently no mobile sidebar replacement)
- Sidebar collapse behavior
- Form validation across all forms

---

## Phase 7 — Production Deployment

### 7.1 Environment Variables (Vercel)
Set all required env vars in Vercel dashboard:
```
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
NEXT_PUBLIC_FIREBASE_* (all 6)
META_APP_ID, META_APP_SECRET, META_WEBHOOK_VERIFY_TOKEN
PHONEPE_MERCHANT_ID, PHONEPE_MERCHANT_KEY, PHONEPE_KEY_INDEX
UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
RESEND_API_KEY
NEXT_PUBLIC_APP_URL=https://expendmore.com
```

### 7.2 Deploy Firestore Rules & Indexes
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 7.3 Production Verification Checklist
- [ ] Build succeeds (zero errors, zero suppressions)
- [ ] Google Login works
- [ ] Email login works
- [ ] Protected routes redirect unauthenticated users
- [ ] WhatsApp webhook verification challenge passes
- [ ] Firestore reads/writes work
- [ ] Credits system initialized for test workspace
- [ ] PhonePe test payment flows

---

## Phase 8 — Feature Development (Post-Recovery)

Once the foundation is stable, develop in this order:
1. Team Inbox (real-time message display)
2. Analytics Dashboard
3. Campaign scheduling
4. AI Chatbot builder
5. Workflow automation (visual builder)

---

## Time Estimates

| Phase | Estimated Time |
|-------|---------------|
| Phase 0 — Security | 1-2 hours |
| Phase 1 — Build Fix | 2-3 hours |
| Phase 2 — Auth | 3-4 hours |
| Phase 3 — Database | 4-6 hours |
| Phase 4 — WhatsApp | 5-7 days |
| Phase 5 — Payments | 2-3 days |
| Phase 6 — Testing | 2 days |
| Phase 7 — Deploy | 4-8 hours |
| **Total to Production** | **~2 weeks** |

---

## What NOT to Touch

These are working and should be **preserved as-is**:
- ✅ `src/lib/firebase-client.ts` — keep
- ✅ `src/lib/authorization.ts` — keep as canonical RBAC
- ✅ `src/lib/whatsapp.ts` — keep, it's correct
- ✅ `src/lib/redis.ts` — keep (just fix dummy fallback)
- ✅ `src/lib/queue.ts` — keep, good design
- ✅ `src/components/providers/auth-provider.tsx` — keep, only fix cookie strategy
- ✅ `src/components/navigation/Sidebar.tsx` — keep, excellent quality
- ✅ `src/components/guards/RoleGuard.tsx` — keep, correct
- ✅ `src/components/navigation/DashboardShell.tsx` — keep
- ✅ `src/app/login/page.tsx` — keep, premium quality
- ✅ `src/app/globals.css` — keep
- ✅ `tailwind.config.js` — keep
- ✅ `firestore.rules` — keep, only extend
- ✅ All `src/types/*.ts` — keep, only fix `userId` → `workspaceId` issue
