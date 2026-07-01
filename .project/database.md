# ExpendMore — Database Reference

---

## Primary Database: Firestore

All application data lives in Firestore. Every document scoped to a workspace MUST include the `workspaceId` field.

---

## Collections

### `users`
Stores user profiles. One document per Firebase Auth user.

```
users/{uid}
├── uid: string                  // Firebase Auth UID (same as doc ID)
├── email: string
├── displayName: string
├── photoURL: string | null
├── activeWorkspaceId: string    // Currently active workspace
├── workspaceIds: string[]       // All workspaces user belongs to
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### `workspaces`
Top-level workspace entity.

```
workspaces/{workspaceId}
├── id: string
├── name: string
├── slug: string                 // URL-safe unique identifier
├── ownerId: string              // Firebase Auth UID
├── plan: "free"|"starter"|"growth"|"enterprise"
├── credits: number              // Remaining credits
├── usedCredits: number          // Consumed this billing period
├── purchasedCredits: number     // Total credits ever purchased
├── status: "active"|"suspended"|"cancelled"
├── createdAt: Timestamp
├── updatedAt: Timestamp
│
├── members/{uid}               // Sub-collection
│   ├── uid: string
│   ├── email: string
│   ├── role: "owner"|"admin"|"staff"|"customer"
│   └── joinedAt: Timestamp
│
└── settings/{settingId}        // Sub-collection
    └── (various settings docs)
```

### `whatsappAccounts`
Stores connected WhatsApp Business Accounts.

```
whatsappAccounts/{accountId}
├── id: string
├── workspaceId: string          // REQUIRED
├── wabaId: string               // WhatsApp Business Account ID
├── phoneNumberId: string        // Meta Phone Number ID
├── displayName: string
├── phoneNumber: string          // E.164 format
├── accessToken: string          // AES-256 encrypted
├── webhookVerifyToken: string
├── status: "active"|"inactive"|"pending"
├── quality: "GREEN"|"YELLOW"|"RED"
└── createdAt: Timestamp
```

### `contacts`
CRM contacts.

```
contacts/{contactId}
├── id: string
├── workspaceId: string          // REQUIRED
├── phone: string                // E.164 format
├── name: string
├── email: string | null
├── tags: string[]
├── attributes: Record<string, any>  // Custom CRM fields
├── optedOut: boolean
├── lastMessageAt: Timestamp | null
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### `templates`
WhatsApp message templates.

```
templates/{templateId}
├── id: string
├── workspaceId: string          // REQUIRED
├── metaTemplateId: string       // Meta's template ID
├── name: string                 // alphanumeric + underscore
├── category: "MARKETING"|"UTILITY"|"AUTHENTICATION"
├── language: string             // e.g. "en_US", "hi"
├── status: "APPROVED"|"PENDING"|"REJECTED"
├── components: any[]            // Meta template component structure
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### `campaigns`
Broadcast campaign records.

```
campaigns/{campaignId}
├── id: string
├── workspaceId: string          // REQUIRED
├── name: string
├── templateId: string
├── whatsappAccountId: string
├── status: "draft"|"scheduled"|"running"|"completed"|"failed"|"paused"
├── scheduledAt: Timestamp | null
├── audienceType: "all"|"tags"|"custom"
├── audienceTags: string[]
├── totalRecipients: number
├── sent: number
├── delivered: number
├── read: number
├── failed: number
├── creditsUsed: number
├── createdAt: Timestamp
├── startedAt: Timestamp | null
└── completedAt: Timestamp | null
```

### `messages`
All WhatsApp messages (inbound + outbound).

```
messages/{messageId}
├── id: string
├── workspaceId: string          // REQUIRED
├── contactId: string
├── whatsappAccountId: string
├── direction: "inbound"|"outbound"
├── type: "text"|"template"|"image"|"video"|"audio"|"document"|"interactive"
├── content: MessageContent      // Type-specific
├── status: "sent"|"delivered"|"read"|"failed"
├── metaMessageId: string | null // Meta's wamid
├── campaignId: string | null
├── assignedAgentId: string | null
├── creditsUsed: number
└── timestamp: Timestamp
```

### `transactions`
Payment and credit transactions.

```
transactions/{txId}
├── id: string
├── workspaceId: string          // REQUIRED
├── userId: string
├── type: "subscription"|"credit_purchase"|"credit_usage"
├── amount: number               // in paise (₹1 = 100)
├── currency: "INR"
├── credits: number | null
├── gateway: "phonepe"
├── gatewayTxId: string
├── status: "pending"|"success"|"failed"|"refunded"
├── taxBreakdown: {
│   subtotal: number
│   cgst: number                 // 9% (intra-state)
│   sgst: number                 // 9% (intra-state)
│   igst: number                 // 18% (inter-state, use instead of CGST+SGST)
│   total: number
│ }
├── invoiceUrl: string | null
└── createdAt: Timestamp
```

### `apiKeys`
API keys for developer integrations.

```
apiKeys/{keyId}
├── id: string
├── workspaceId: string          // REQUIRED
├── name: string
├── keyHash: string              // SHA-256 hash of key (never store plaintext)
├── prefix: string               // First 8 chars for display (e.g. "em_live_")
├── permissions: string[]
├── lastUsedAt: Timestamp | null
├── expiresAt: Timestamp | null
├── status: "active"|"revoked"
└── createdAt: Timestamp
```

### `auditLogs`
Immutable system audit trail.

```
auditLogs/{logId}
├── id: string
├── workspaceId: string          // REQUIRED
├── userId: string               // "system" for automated actions
├── action: string               // Human-readable action description
├── resource: string             // Collection name
├── resourceId: string           // Document ID
├── changes: Record<string, any> // What changed (before/after)
├── ipAddress: string | null
└── timestamp: Timestamp
```

---

## Firestore Indexes Required

```
// For campaigns list by workspace
Collection: campaigns
Fields: workspaceId ASC, createdAt DESC

// For contacts by workspace + tag
Collection: contacts
Fields: workspaceId ASC, tags ARRAY-CONTAINS, createdAt DESC

// For messages by contact (inbox)
Collection: messages
Fields: workspaceId ASC, contactId ASC, timestamp DESC

// For messages by campaign
Collection: messages
Fields: workspaceId ASC, campaignId ASC, timestamp DESC

// For transactions by workspace
Collection: transactions
Fields: workspaceId ASC, createdAt DESC

// For templates by workspace
Collection: templates
Fields: workspaceId ASC, status ASC, createdAt DESC
```

---

## Cache Layer: Upstash Redis

Used for ephemeral, high-frequency data only. TTL always set.

| Key Pattern | TTL | Content |
|-------------|-----|---------|
| `user:session:{uid}` | 3600s | Decoded Firebase token |
| `workspace:credits:{workspaceId}` | 60s | Credit balance |
| `storage:signedurl:{bucket}:{path}` | 3540s | Pre-signed URLs |
| `webhooks:subscriptions:{workspaceId}` | 300s | Webhook subscription list |
| `ratelimit:{uid}:{endpoint}` | 60s | Rate limit counter |

---

## Data Rules

1. Never delete contacts (soft delete with `deletedAt` timestamp)
2. Never delete messages (immutable audit trail)
3. Never delete transactions (financial audit trail)
4. Campaigns can be deleted only if `status === "draft"`
5. Always use `serverTimestamp()` for `createdAt`/`updatedAt` fields
6. Phone numbers always in E.164 format (`+919876543210`)
7. Amounts always in smallest currency unit (paise for INR)
