# ExpendMore — Testing Guide

---

## Testing Philosophy

Every feature must pass all 6 test gates before it is considered complete:

1. ✅ Unit tests (business logic)
2. ✅ API tests (endpoint behavior)
3. ✅ Firestore tests (data integrity)
4. ✅ Auth tests (security)
5. ✅ UI tests (user flows)
6. ✅ Mobile responsive tests

---

## Test Stack

| Layer | Tool |
|-------|------|
| Unit + Integration | Vitest |
| Component | @testing-library/react |
| API | Manual / Vitest fetch |
| E2E | (TBD — Playwright recommended) |

---

## What to Test

### Auth
- [ ] Unauthenticated user cannot access protected routes
- [ ] Google OAuth redirects correctly
- [ ] Email login with correct credentials succeeds
- [ ] Email login with wrong credentials shows error
- [ ] Expired token redirects to login
- [ ] Logout clears session cookie

### Workspace Isolation
- [ ] User A cannot read workspace data of User B
- [ ] Firestore security rules block cross-workspace reads
- [ ] API routes return 403 for wrong workspaceId

### WhatsApp
- [ ] Webhook verification challenge succeeds with correct verify token
- [ ] Webhook rejects requests without valid HMAC signature
- [ ] Message send deducts credits
- [ ] Campaign stops when credits = 0

### Billing
- [ ] PhonePe payment creates transaction in Firestore
- [ ] Failed payment does not grant credits
- [ ] Credit alerts fire at 50/70/80/90/100%

### RBAC
- [ ] STAFF cannot MANAGE_BILLING
- [ ] CUSTOMER cannot WRITE_CAMPAIGNS
- [ ] OWNER has all permissions
- [ ] SUPER_ADMIN bypasses all permission checks

---

## Running Tests

```bash
# Run all tests
npm run test

# Run with watch mode
npx vitest

# Run specific file
npx vitest src/lib/authorization.test.ts

# Run with coverage
npx vitest run --coverage
```

---

## Test File Conventions

```
src/
├── lib/
│   ├── authorization.ts
│   └── authorization.test.ts    # Colocated tests
├── tests/                        # Integration tests
│   ├── auth.test.ts
│   ├── workspace.test.ts
│   └── whatsapp.test.ts
```

---

## Production Testing Checklist

After every deployment, manually verify:

### Critical Path
1. Land on home page — loads in < 3s
2. Click "Sign In" — login page loads
3. Sign in with Google — redirects to dashboard
4. Navigate to WhatsApp section
5. Sign out — redirects to login

### WhatsApp Core
6. WhatsApp account shows as connected (if configured)
7. Templates list loads
8. Contact list loads
9. Create a test contact
10. Campaigns section loads

### Billing
11. Settings → Billing shows current plan
12. Credit balance displays correctly
