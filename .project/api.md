# ExpendMore — API Reference

---

## Base URL
```
Production: https://expendmore.com/api
Development: http://localhost:3000/api
```

## Authentication
All `/api/v1/*` routes require a valid `firebase-token` HttpOnly cookie.
Obtain the cookie by POSTing a Firebase IdToken to `/api/auth/session`.

---

## Auth Endpoints

### POST /api/auth/session
Exchange a Firebase IdToken for an HttpOnly session cookie.

**Request**
```json
{ "idToken": "eyJhbGci..." }
```

**Response 200**
```json
{ "success": true, "uid": "user123" }
```
Sets: `Set-Cookie: firebase-token=...; HttpOnly; Secure; SameSite=Strict`

---

### POST /api/auth/refresh
Refresh the session cookie with a new Firebase IdToken.

**Request** — same as `/api/auth/session`

---

### POST /api/auth/logout
Clear the session cookie.

**Response 200**
```json
{ "success": true }
```

---

## WhatsApp Endpoints

### GET /api/v1/whatsapp/webhook
Meta webhook verification challenge.

**Query params**: `hub.mode`, `hub.verify_token`, `hub.challenge`

**Response**: Returns `hub.challenge` if verify token matches

---

### POST /api/v1/whatsapp/webhook
Incoming WhatsApp message handler.

**Headers**: `X-Hub-Signature-256: sha256=...` (REQUIRED — verified)

**Body**: Meta webhook payload

---

### POST /api/v1/whatsapp/connect
Initiate Facebook OAuth for WABA onboarding.

**Request**
```json
{ "workspaceId": "ws_xxx" }
```

**Response 200**
```json
{ "oauthUrl": "https://www.facebook.com/dialog/oauth?..." }
```

---

### GET /api/v1/whatsapp/callback
Facebook OAuth callback. Exchanges code for access token, stores WABA credentials.

**Query params**: `code`, `state` (workspaceId)

---

### POST /api/v1/whatsapp/send
Send a WhatsApp message.

**Request**
```json
{
  "workspaceId": "ws_xxx",
  "whatsappAccountId": "wa_xxx",
  "to": "+919876543210",
  "type": "template",
  "template": {
    "name": "order_confirmation",
    "language": { "code": "en_US" },
    "components": []
  }
}
```

**Response 200**
```json
{
  "success": true,
  "messageId": "msg_xxx",
  "metaMessageId": "wamid.xxx",
  "creditsDeducted": 1
}
```

---

### GET /api/v1/whatsapp/templates
List approved templates for a workspace.

**Query**: `?workspaceId=ws_xxx`

**Response 200**
```json
{
  "templates": [
    {
      "id": "tpl_xxx",
      "name": "order_confirmation",
      "status": "APPROVED",
      "category": "UTILITY"
    }
  ]
}
```

---

### POST /api/v1/whatsapp/templates/sync
Sync templates from Meta API into Firestore.

**Request**
```json
{ "workspaceId": "ws_xxx", "whatsappAccountId": "wa_xxx" }
```

---

## Contacts Endpoints

### GET /api/v1/contacts
List contacts for a workspace.

**Query**: `?workspaceId=ws_xxx&limit=50&cursor=xxx&tag=customers`

### POST /api/v1/contacts
Create a contact.

**Request**
```json
{
  "workspaceId": "ws_xxx",
  "phone": "+919876543210",
  "name": "Rahul Sharma",
  "tags": ["customer", "delhi"]
}
```

### PATCH /api/v1/contacts/[id]
Update a contact.

### POST /api/v1/contacts/import
Bulk import from CSV.

**Body**: multipart/form-data with CSV file + `workspaceId`

---

## Campaigns Endpoints

### GET /api/v1/campaigns
List campaigns.

**Query**: `?workspaceId=ws_xxx&status=completed`

### POST /api/v1/campaigns
Create a campaign.

**Request**
```json
{
  "workspaceId": "ws_xxx",
  "name": "Diwali Sale 2026",
  "templateId": "tpl_xxx",
  "whatsappAccountId": "wa_xxx",
  "audienceType": "tags",
  "audienceTags": ["customers"],
  "scheduledAt": null
}
```

### POST /api/v1/campaigns/[id]/run
Execute a campaign immediately.

**Request**
```json
{ "workspaceId": "ws_xxx" }
```

---

## Billing Endpoints

### GET /api/v1/billing/plans
List subscription plans.

### POST /api/v1/billing/subscribe
Initiate a PhonePe subscription payment.

**Request**
```json
{
  "workspaceId": "ws_xxx",
  "plan": "growth",
  "billingCycle": "monthly"
}
```

**Response 200**
```json
{
  "paymentUrl": "https://mercury-t2.phonepe.com/...",
  "transactionId": "tx_xxx"
}
```

### POST /api/v1/billing/webhook
PhonePe payment callback. Server-to-server only. Verified by checksum.

### GET /api/v1/billing/credits
Get current credit balance.

**Response 200**
```json
{
  "remaining": 4250,
  "used": 5750,
  "purchased": 10000,
  "percentUsed": 57.5
}
```

---

## Analytics Endpoints

### GET /api/v1/analytics
Get workspace analytics summary.

**Query**: `?workspaceId=ws_xxx&period=30d`

**Response 200**
```json
{
  "period": "30d",
  "campaigns": { "total": 12, "completed": 10, "failed": 2 },
  "messages": { "sent": 15420, "delivered": 15100, "read": 12800 },
  "contacts": { "total": 3200, "newThisPeriod": 450, "optedOut": 23 },
  "credits": { "used": 15420, "remaining": 4580 }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Forbidden / no workspace access |
| 404 | Resource not found |
| 429 | Rate limited |
| 500 | Internal server error |

---

## Rate Limits

| Endpoint | Limit |
|---------|-------|
| `/api/auth/*` | 10 req/min per IP |
| `/api/v1/whatsapp/send` | 100 req/min per workspace |
| `/api/v1/contacts/import` | 5 req/hour per workspace |
| `/api/v1/campaigns/*/run` | 10 req/hour per workspace |
| All other `/api/v1/*` | 60 req/min per workspace |
