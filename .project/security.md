# ExpendMore — Security Policy

---

## Core Principles

1. **Zero client-side secrets** — environment variables prefixed `NEXT_PUBLIC_` are browser-visible. Never put secret keys, tokens, or credentials there.
2. **Defense in depth** — Firestore rules + server-side validation + middleware = 3 layers of protection.
3. **Least privilege** — each role gets the minimum permissions to do its job.
4. **Audit everything** — sensitive operations write to `auditLogs` collection.
5. **Validate all input** — treat all user input as hostile.

---

## Secret Classification

| Secret | Storage | Exposure |
|--------|---------|----------|
| Firebase API Key | `NEXT_PUBLIC_FIREBASE_*` | Browser (safe — Firebase API keys are designed to be public; rules protect data) |
| Firebase Admin Service Account | Server env only | Never expose |
| Meta App Secret | Server env only | Never expose |
| Meta Access Tokens (WABA) | Firestore (encrypted field) | Never to client |
| PhonePe Merchant Key | Server env only | Never expose |
| Upstash Redis URL/Token | Server env only | Never expose |
| Webhook Secrets | Server env only | Never expose |

---

## Required Environment Variables

### Client-side (NEXT_PUBLIC_*)
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_APP_URL
```

### Server-side (never NEXT_PUBLIC_)
```
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY

META_APP_ID
META_APP_SECRET
META_WEBHOOK_VERIFY_TOKEN

PHONEPE_MERCHANT_ID
PHONEPE_MERCHANT_KEY
PHONEPE_KEY_INDEX

UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN

RESEND_API_KEY
```

---

## API Security Checklist

Every API route (`/api/v1/*`) MUST:

- [ ] Verify Firebase token from HttpOnly cookie
- [ ] Extract `uid` from verified token
- [ ] Validate `workspaceId` parameter belongs to `uid`
- [ ] Check user's role permits the operation
- [ ] Sanitize and validate all request body fields
- [ ] Rate-limit the endpoint (Redis)
- [ ] Return minimal error details (never stack traces to client)
- [ ] Log sensitive operations to auditLogs

---

## Webhook Security

All incoming webhooks:
- **Meta webhooks**: Verify `X-Hub-Signature-256` header using app secret HMAC-SHA256
- **PhonePe webhooks**: Verify checksum using merchant key
- **Customer webhooks** (outbound): Sign with per-subscription HMAC-SHA256 secret

Reject any request without a valid signature immediately (return 403).

---

## Firestore Security Rules — Key Points

- `isWorkspaceMember(workspaceId)` — checks sub-collection `/workspaces/{id}/members/{uid}` exists
- `isWorkspaceAdmin(workspaceId)` — checks role in members doc is `admin` or `owner`
- Transactions collection — server-side write only (client create = false)
- Messages collection — immutable once created (update = false, delete = false)
- Audit logs — immutable once created
- Catch-all rule — deny everything not explicitly allowed

---

## Auth Token Strategy

```
Client Login Flow:
1. Firebase signIn() → IdToken (JWT, 1hr expiry)
2. POST /api/auth/session { idToken }
3. Server: adminAuth.verifyIdToken(idToken) → decoded
4. Server: Set-Cookie: firebase-token=<idToken>; HttpOnly; Secure; SameSite=Strict; Path=/
5. Client: Cookie stored by browser, sent on all requests
6. Middleware: Reads cookie, checks presence (not full verify — fast path)
7. API routes: Full adminAuth.verifyIdToken() verification

Token Refresh:
- Firebase client SDK auto-refreshes ID tokens every 55 minutes
- Client calls POST /api/auth/refresh with new token
- Server re-issues HttpOnly cookie
```

---

## CORS Policy

API routes should explicitly set:
```
Access-Control-Allow-Origin: https://expendmore.com (production)
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Input Validation Rules

- Phone numbers: E.164 format only (`+919876543210`)
- Email: RFC 5322 regex validation
- WorkspaceId: `ws_[a-z0-9]{20}` format
- Template names: alphanumeric + underscore only (Meta requirement)
- File uploads: MIME type whitelist, max 16MB
- Free-text fields: max 4096 chars, HTML stripped

---

## Incident Response

If a security incident is detected:
1. Immediately revoke affected Firebase tokens
2. Rotate Meta access tokens for affected WABA
3. Suspend affected workspace
4. Write incident to auditLogs
5. Notify workspace owner via email
6. Document in `.project/bugs.md`
