# ExpendMore — Product Roadmap

---

## Status Legend
🔴 Not started | 🟡 In progress | 🟢 Complete | ⚪ Deferred

---

## Q3 2026 — Foundation Hardening (NOW)

### Infrastructure
| Item | Status | Notes |
|------|--------|-------|
| Firebase Auth (client) | 🟢 | Login + Google OAuth working |
| Firebase Admin SDK setup | 🔴 | Needed for server-side auth |
| Auth session cookie system | 🔴 | Middleware currently broken |
| Firestore security rules | 🟡 | Initial pass done; needs audit |
| Migrate Prisma → Firestore | 🔴 | Critical architecture conflict |
| Firebase Storage (replace S3) | 🔴 | Currently using S3 stubs |
| Remove Supabase | 🔴 | Not in locked tech stack |
| Fix TypeScript suppression | 🔴 | next.config.js hides bugs |
| Rate limiting (Redis) | 🔴 | Not implemented yet |

### WhatsApp Core
| Item | Status | Notes |
|------|--------|-------|
| Meta Cloud API wrappers | 🟢 | sendMessage, syncTemplates, registerPhone |
| Facebook OAuth WABA onboarding | 🔴 | Customers can't connect accounts yet |
| Incoming webhook handler | 🔴 | Cannot receive messages yet |
| Credit deduction on send | 🔴 | No credit system implemented |

### Payments
| Item | Status | Notes |
|------|--------|-------|
| PhonePe integration | 🔴 | Currently Stripe/Razorpay stubs |
| Transaction storage | 🔴 | Prisma-based — needs Firestore |
| Tax calculation (GST) | 🔴 | Logic referenced but not built |

---

## Q4 2026 — Core WhatsApp Product

### Contacts
| Item | Status |
|------|--------|
| Contact CRUD | 🔴 |
| Tag system | 🔴 |
| CSV import | 🔴 |
| Opt-out management | 🔴 |
| Contact search/filter | 🔴 |

### Templates
| Item | Status |
|------|--------|
| List templates | 🔴 |
| Sync from Meta | 🔴 |
| Submit new template | 🔴 |
| Status tracking | 🔴 |
| Template preview | 🔴 |

### Campaigns
| Item | Status |
|------|--------|
| Create campaign | 🔴 |
| Audience selection | 🔴 |
| Schedule campaigns | 🔴 |
| Execution engine | 🔴 |
| Credit deduction per send | 🔴 |
| Real-time progress | 🔴 |
| Campaign analytics | 🔴 |

### Team Inbox
| Item | Status |
|------|--------|
| Real-time message display | 🔴 |
| Agent assignment | 🔴 |
| Conversation threading | 🔴 |
| Quick actions | 🔴 |
| Read receipts | 🔴 |

---

## Q1 2027 — Analytics & Billing Full Launch

| Item | Status |
|------|--------|
| Analytics dashboard | 🔴 |
| Credit usage charts | 🔴 |
| PhonePe subscription plans | 🔴 |
| Invoice generation | 🔴 |
| Credit purchase (top-up) | 🔴 |
| Usage alerts (50/70/80/90/100%) | 🔴 |
| Billing history | 🔴 |

---

## Q2 2027 — AI & Automation

| Item | Status |
|------|--------|
| AI Chatbot builder | ⚪ |
| Workflow automation (visual) | ⚪ |
| AI response suggestions | ⚪ |
| Auto-routing rules | ⚪ |
| GPT integration | ⚪ |

---

## Future (Unscheduled)

- Email marketing
- SMS marketing
- Full CRM module
- Developer API + webhooks
- White-label
- Mobile app
- Enterprise SSO (SAML/OIDC)
