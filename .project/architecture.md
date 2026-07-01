# ExpendMore — Architecture

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│          Browser (Next.js App)  /  Mobile (Future)          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                    VERCEL EDGE / CDN                        │
│              Next.js Middleware (Auth Guard)                 │
└──────────┬──────────────────────────────────┬───────────────┘
           │                                  │
┌──────────▼──────────┐          ┌────────────▼──────────────┐
│   Next.js Pages     │          │   Next.js API Routes      │
│   (App Router)      │          │   /api/v1/*               │
│   React + Tailwind  │          │   Server-side only        │
└─────────────────────┘          └──────┬───────────────────-┘
                                        │
                    ┌───────────────────┼────────────────────┐
                    │                   │                    │
          ┌─────────▼──────┐  ┌────────▼──────┐  ┌─────────▼─────┐
          │  Firebase Auth │  │   Firestore   │  │ Firebase Stor │
          │  (Identity)    │  │   (Database)  │  │ (Files/Media) │
          └────────────────┘  └───────────────┘  └───────────────┘
                    │
          ┌─────────▼──────┐  ┌───────────────┐
          │ Upstash Redis  │  │  Meta Graph   │
          │ (Cache Layer)  │  │  API v21.0    │
          └────────────────┘  └───────────────┘
                                      │
                              ┌───────▼───────┐
                              │ Customer WABA │
                              │ (via FB OAuth)│
                              └───────────────┘
```

---

## Multi-Tenancy Model

Every customer operates inside an isolated **Workspace**.

```
users/{uid}
  └── workspaceId (active workspace)
  
workspaces/{workspaceId}
  ├── name, plan, credits, settings
  ├── members/{uid} → { role, joinedAt }
  ├── settings/{settingId}
  └── (all sub-data scoped by workspaceId field)
  
contacts/{contactId}        workspaceId: "ws_xxx"
campaigns/{campaignId}      workspaceId: "ws_xxx"
templates/{templateId}      workspaceId: "ws_xxx"
whatsappAccounts/{id}       workspaceId: "ws_xxx"
messages/{messageId}        workspaceId: "ws_xxx"
apiKeys/{keyId}             workspaceId: "ws_xxx"
transactions/{txId}         workspaceId: "ws_xxx"
auditLogs/{logId}           workspaceId: "ws_xxx"
```

**Rule**: Every Firestore document that belongs to a workspace MUST have a `workspaceId` field. Every API route MUST validate `workspaceId` ownership before returning or mutating data.

---

## Authentication Architecture

### Client-side Flow
1. User signs in via Firebase Auth (Google OAuth / Email+Password)
2. Firebase SDK returns `IdToken` (JWT)
3. Client POSTs token to `/api/auth/session` (Next.js API route)
4. Server validates token with Firebase Admin SDK
5. Server sets `firebase-token` HttpOnly cookie (secure, sameSite: strict)
6. Subsequent requests carry the cookie automatically
7. Middleware reads cookie to determine auth state

### Server-side Validation
Every protected API route:
```typescript
import { adminAuth } from "@/lib/firebase-admin";

const cookie = request.cookies.get("firebase-token")?.value;
const decodedToken = await adminAuth.verifyIdToken(cookie);
const uid = decodedToken.uid;
// Always verify workspace membership before data access
```

### Token Refresh
- Firebase ID tokens expire after 1 hour
- Client-side Firebase SDK auto-refreshes tokens
- Client calls `/api/auth/refresh` to re-issue the HttpOnly cookie

---

## RBAC System (Canonical)

Use ONLY `src/lib/authorization.ts`. The file `src/lib/permissions.ts` is deprecated.

```
Role Hierarchy (highest to lowest):
SUPER_ADMIN > OWNER > ADMIN > STAFF > CUSTOMER

Permissions:
SUPER_ADMIN  → ALL
OWNER        → ALL except super-admin operations
ADMIN        → READ/WRITE campaigns, manage users, connect gateway, view analytics
STAFF        → READ/WRITE campaigns, view analytics
CUSTOMER     → READ campaigns, view analytics
```

---

## Firestore Collections Schema

### users
```
{
  uid: string,              // Firebase Auth UID
  email: string,
  displayName: string,
  photoURL: string,
  activeWorkspaceId: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### workspaces
```
{
  id: string,
  name: string,
  slug: string,             // URL-safe unique name
  ownerId: string,          // Firebase UID
  plan: "free" | "starter" | "growth" | "enterprise",
  credits: number,
  usedCredits: number,
  purchasedCredits: number,
  creditAlerts: [50, 70, 80, 90, 100],
  status: "active" | "suspended" | "cancelled",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### whatsappAccounts
```
{
  id: string,
  workspaceId: string,      // ALWAYS PRESENT
  wabaId: string,           // WhatsApp Business Account ID
  phoneNumberId: string,    // Meta Phone Number ID
  displayName: string,
  phoneNumber: string,
  accessToken: string,      // ENCRYPTED — never expose to client
  webhookVerifyToken: string,
  status: "active" | "inactive" | "pending",
  createdAt: Timestamp
}
```

### contacts
```
{
  id: string,
  workspaceId: string,
  phone: string,            // E.164 format: +919876543210
  name: string,
  email?: string,
  tags: string[],
  attributes: Record<string, any>,  // custom CRM fields
  optedOut: boolean,
  lastMessageAt: Timestamp,
  createdAt: Timestamp
}
```

### templates
```
{
  id: string,
  workspaceId: string,
  metaTemplateId: string,
  name: string,
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION",
  language: string,
  status: "APPROVED" | "PENDING" | "REJECTED",
  components: any[],        // Meta template components
  createdAt: Timestamp
}
```

### campaigns
```
{
  id: string,
  workspaceId: string,
  name: string,
  templateId: string,
  whatsappAccountId: string,
  status: "draft" | "scheduled" | "running" | "completed" | "failed" | "paused",
  scheduledAt?: Timestamp,
  audienceType: "all" | "tags" | "custom",
  audienceTags?: string[],
  totalRecipients: number,
  sent: number,
  delivered: number,
  read: number,
  failed: number,
  creditsUsed: number,
  createdAt: Timestamp,
  completedAt?: Timestamp
}
```

### messages
```
{
  id: string,
  workspaceId: string,
  contactId: string,
  whatsappAccountId: string,
  direction: "inbound" | "outbound",
  type: "text" | "template" | "image" | "video" | "audio" | "document" | "interactive",
  content: any,             // type-specific content
  status: "sent" | "delivered" | "read" | "failed",
  metaMessageId?: string,
  campaignId?: string,
  creditsUsed?: number,
  timestamp: Timestamp
}
```

### transactions
```
{
  id: string,
  workspaceId: string,
  userId: string,
  type: "subscription" | "credit_purchase" | "credit_usage",
  amount: number,           // in paise (₹1 = 100 paise)
  currency: "INR",
  credits?: number,
  gateway: "phonepe",
  gatewayTxId: string,
  status: "pending" | "success" | "failed" | "refunded",
  taxBreakdown: {
    subtotal: number,
    cgst: number,           // 9%
    sgst: number,           // 9%
    igst: number,           // 18% (inter-state)
    total: number
  },
  invoiceUrl?: string,
  createdAt: Timestamp
}
```

---

## API Routes Structure

```
/api/auth/session          POST — exchange Firebase token for HttpOnly cookie
/api/auth/refresh          POST — refresh expired cookie
/api/auth/logout           POST — clear cookie

/api/v1/workspaces         GET, POST
/api/v1/workspaces/[id]    GET, PATCH, DELETE

/api/v1/whatsapp/connect          POST — initiate Facebook OAuth
/api/v1/whatsapp/callback         GET  — Facebook OAuth callback
/api/v1/whatsapp/webhook          GET  — Meta webhook verification
/api/v1/whatsapp/webhook          POST — incoming message handler
/api/v1/whatsapp/send             POST — send message
/api/v1/whatsapp/templates        GET  — list templates
/api/v1/whatsapp/templates/sync   POST — sync from Meta

/api/v1/contacts           GET, POST
/api/v1/contacts/[id]      GET, PATCH, DELETE
/api/v1/contacts/import    POST — bulk CSV import

/api/v1/campaigns          GET, POST
/api/v1/campaigns/[id]     GET, PATCH, DELETE
/api/v1/campaigns/[id]/run POST — start campaign execution

/api/v1/billing/plans      GET
/api/v1/billing/subscribe  POST — initiate PhonePe payment
/api/v1/billing/webhook    POST — PhonePe payment callback
/api/v1/billing/credits    GET  — remaining credits

/api/v1/analytics          GET — workspace analytics aggregation
```

---

## Security Model

1. **No secrets on frontend** — all tokens/keys in server-only env vars
2. **HttpOnly cookies** — Firebase tokens never in localStorage
3. **HMAC webhook signatures** — all incoming webhooks verified
4. **Input sanitization** — all user inputs sanitized before Firestore writes
5. **Firestore Security Rules** — defense-in-depth; rules enforce workspaceId isolation
6. **Rate limiting** — Redis-based rate limiting on all API routes
7. **Audit logs** — all sensitive operations logged to Firestore auditLogs

---

## Frontend Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth-only layout group
│   ├── (dashboard)/       # Dashboard layout group
│   │   ├── layout.tsx     # Sidebar + shell
│   │   ├── dashboard/     # Overview
│   │   ├── whatsapp/      # Core product
│   │   │   ├── campaigns/
│   │   │   ├── contacts/
│   │   │   ├── inbox/
│   │   │   ├── chatbot/
│   │   │   └── manager/
│   │   ├── analytics/
│   │   ├── billing/
│   │   ├── settings/
│   │   └── workflows/
│   ├── api/               # API routes (server-side)
│   ├── login/
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui + custom primitives
│   ├── navigation/        # Sidebar, header, breadcrumbs
│   ├── providers/         # Context providers
│   └── guards/            # Route guard components
├── lib/                   # Shared utilities
├── hooks/                 # Zustand stores / React hooks
├── types/                 # TypeScript type definitions
└── services/              # Business logic services
```

---

## Tech Stack (Locked — Do Not Deviate)

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, TailwindCSS |
| UI Components | shadcn/ui |
| Auth | Firebase Authentication |
| Database | Firestore |
| Storage | Firebase Storage |
| Cache | Upstash Redis |
| Hosting | Vercel |
| Payments | PhonePe Payment Gateway |
| WhatsApp | Meta Cloud API v21.0 |
| Analytics | Vercel Analytics + Speed Insights |
| State | Zustand |
| HTTP | Axios |

**Explicitly NOT in stack**: Supabase, Stripe, Razorpay, MongoDB, Prisma/Postgres, Clerk, NextAuth (beyond what was already stubbed)
