# ExpendMore — Locked Decisions

> 🔒 **IMMUTABLE. These decisions cannot be changed without explicit written approval from the user.**  
> Last updated: 2026-07-01  
> Read this file BEFORE `brain.md`, BEFORE writing any code, BEFORE making any architectural decision.

---

## How This File Works

Every decision below is **permanently locked**.

If you feel a locked decision should change:
1. **STOP. Do not implement the change.**
2. Explain the reason to the user clearly.
3. Wait for explicit written approval.
4. Only then update this file and proceed.

**No exceptions. No "temporary" deviations. No "just this once."**

---

## 🔒 LD-001 — Authentication System

| Field | Value |
|-------|-------|
| **Decision** | Firebase Authentication is the sole auth system |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE |

**What is allowed:**
- Firebase Email/Password sign-in
- Firebase Google OAuth
- Firebase Phone OTP
- Firebase Microsoft OAuth (future)
- Firebase Apple Sign-in (future)

**What is NOT allowed without approval:**
- Supabase Auth ❌
- Clerk ❌
- NextAuth / Auth.js ❌
- Custom JWT system ❌
- Any third-party auth provider ❌

**Reason**: Firebase Auth integrates natively with Firestore Security Rules, Firebase Admin SDK, and FCM. Replacing it would require rewriting the entire auth layer, security rules, and all server-side token verification.

---

## 🔒 LD-002 — Primary Database

| Field | Value |
|-------|-------|
| **Decision** | Firestore is the sole primary database |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE |

**What is allowed:**
- Firestore (all reads, writes, real-time listeners)
- Upstash Redis (cache layer ONLY — not primary storage)

**What is NOT allowed without approval:**
- PostgreSQL / Prisma ❌
- Supabase Database ❌
- MongoDB ❌
- PlanetScale ❌
- Neon ❌
- Any SQL or NoSQL database as primary ❌

**Reason**: Firestore provides native multi-tenant security rules, auto-scaling to millions of documents, offline sync, and real-time listeners — all without infrastructure management. It integrates directly with Firebase Auth for row-level security.

---

## 🔒 LD-003 — File Storage

| Field | Value |
|-------|-------|
| **Decision** | Firebase Storage is the sole file/media storage system |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE |

**What is NOT allowed without approval:**
- AWS S3 ❌
- Cloudflare R2 ❌
- Supabase Storage ❌
- Local file system in production ❌

**Reason**: Firebase Storage uses the same security rules model as Firestore, integrates with Firebase Auth, and is part of the same billing/management console. Eliminates cross-vendor IAM complexity.

---

## 🔒 LD-004 — Payment Gateway

| Field | Value |
|-------|-------|
| **Decision** | PhonePe is the sole payment gateway |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE |

**What PhonePe handles:**
- Monthly/annual subscription billing
- One-time credit purchases
- UPI payments (India-first)
- Webhook-based payment confirmation

**What is NOT allowed without approval:**
- Stripe ❌
- Razorpay ❌
- Cashfree ❌
- PayU ❌
- Any other payment gateway ❌

**Reason**: ExpendMore targets the Indian market. PhonePe offers the best UPI integration, lowest failure rates for Indian cards/UPI, and native INR billing. Stripe is USD-first and adds unnecessary complexity for India.

---

## 🔒 LD-005 — WhatsApp Integration

| Field | Value |
|-------|-------|
| **Decision** | One official ExpendMore Meta App. Customers connect via Facebook OAuth (WABA onboarding). |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE |

**Rules:**
- Use Meta Cloud API v21.0 only
- Never use unofficial WhatsApp libraries (Baileys, whatsapp-web.js, etc.) ❌
- Never create one Meta App per customer ❌
- Always verify `X-Hub-Signature-256` on every incoming webhook
- Store customer access tokens encrypted in Firestore — never expose to client

**Reason**: Creating per-customer Meta Apps is not scalable and violates Meta BSP (Business Solution Provider) model. Unofficial libraries violate Meta TOS and risk account bans.

---

## 🔒 LD-006 — Hosting & Deployment

| Field | Value |
|-------|-------|
| **Decision** | Vercel is the sole production hosting platform |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE |

**What is allowed:**
- Vercel (production deployments)
- Docker + docker-compose (local development only)

**What is NOT allowed without approval:**
- AWS EC2/ECS ❌
- Google Cloud Run ❌
- Railway ❌
- Self-hosted VPS ❌
- Any non-Vercel production deployment ❌

**Reason**: Vercel provides zero-config Next.js deployment, Edge Network CDN, automatic SSL, built-in analytics, and Git-based CI/CD. It eliminates DevOps overhead entirely, which is appropriate for this stage.

---

## 🔒 LD-007 — Frontend Framework

| Field | Value |
|-------|-------|
| **Decision** | Next.js 15 (App Router) with React 19 and TypeScript |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE |

**What is NOT allowed without approval:**
- Migrating to Vite/SPA ❌
- Switching to Remix ❌
- Downgrading to Next.js Pages Router ❌
- Removing TypeScript ❌

**Styling stack (locked):**
- TailwindCSS — primary styling
- shadcn/ui — component library
- Framer Motion — animations

---

## 🔒 LD-008 — Multi-Tenancy Model

| Field | Value |
|-------|-------|
| **Decision** | Every document in Firestore MUST contain `workspaceId`. Cross-workspace access is never permitted. |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE |

**Rules:**
- `workspaceId` is mandatory on every Firestore document that belongs to a workspace
- Every API route validates workspace membership before returning or mutating data
- Firestore Security Rules enforce workspace isolation at the database level
- No API shortcut bypasses workspace validation — not even for admins

**Reason**: This is the foundation of the SaaS trust model. A single cross-workspace data leak would destroy customer trust and potentially violate data protection regulations.

---

## 🔒 LD-009 — Secret Management

| Field | Value |
|-------|-------|
| **Decision** | No secrets, credentials, or keys are ever committed to version control. |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE — ALREADY VIOLATED ONCE (see audit-report.md) |

**Rules:**
- All secrets in environment variables only
- `NEXT_PUBLIC_*` variables are browser-visible — never put secrets there
- Firebase Admin credentials → server env only
- Meta App Secret → server env only
- PhonePe Merchant Key → server env only
- `.env.local` in `.gitignore` — always
- Service account JSON files → `.gitignore` — always
- CI/CD secrets → GitHub Secrets — never hardcoded in YAML

**Violation History:**
- 2026-07-01: Firebase Admin service account JSON committed to repo root → **Revoke and rotate required**
- 2026-07-01: Supabase service role key hardcoded in `.github/workflows/ci.yml` → **Rotate required**

---

## 🔒 LD-010 — RBAC System

| Field | Value |
|-------|-------|
| **Decision** | `src/lib/authorization.ts` is the canonical RBAC implementation. `permissions.ts` is deprecated. |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE |

**Canonical role hierarchy (highest → lowest):**
```
SUPER_ADMIN → OWNER → ADMIN → STAFF → CUSTOMER
```

**Canonical permissions:**
```
ALL, READ_CAMPAIGNS, WRITE_CAMPAIGNS, MANAGE_USERS, MANAGE_BILLING, CONNECT_GATEWAY, VIEW_ANALYTICS
```

Any new permission must be added to `authorization.ts` only.  
`permissions.ts` must be deleted (see recovery-plan.md Phase 1).

---

## 🔒 LD-011 — State Management

| Field | Value |
|-------|-------|
| **Decision** | Zustand is the sole client-side state management library |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE |

**What is NOT allowed without approval:**
- Redux / Redux Toolkit ❌
- MobX ❌
- Jotai ❌
- Context API for global state ❌ (allowed for local component trees only)

---

## 🔒 LD-012 — API Design

| Field | Value |
|-------|-------|
| **Decision** | All public APIs are Next.js API Routes under `/api/v1/*`. No separate backend server. |
| **Locked** | 2026-07-01 |
| **Status** | 🔒 IMMUTABLE |

**Rules:**
- Every API route under `/api/v1/*` requires Firebase token verification
- Every API route validates `workspaceId` ownership
- No API route returns stack traces or internal error details to the client
- Rate limiting on all routes via Upstash Redis

**What is NOT allowed without approval:**
- Separate Express/Fastify server ❌
- GraphQL layer ❌
- tRPC ❌
- REST via Firebase Cloud Functions as primary API ❌

---

## Change Request Process

To modify any locked decision:

1. User states the change request explicitly
2. Architect explains trade-offs and impact
3. User provides written approval ("I approve changing LD-XXX from X to Y")
4. This file is updated with:
   - Previous decision
   - New decision
   - Approval date
   - Reason for change
5. `decisions.md` and `changelog.md` are updated
6. Implementation proceeds

**No approval = no change. This protects architectural integrity.**
