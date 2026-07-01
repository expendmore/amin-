# ExpendMore — Deployment Guide

---

## Infrastructure

| Component | Service |
|-----------|---------|
| Frontend + API | Vercel |
| Database | Firestore (Firebase) |
| Auth | Firebase Auth |
| Storage | Firebase Storage |
| Cache | Upstash Redis |
| Domain | TBD (expendmore.com) |
| CDN | Vercel Edge Network |

---

## Environment Setup

### Required .env.local (Development)
```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Server-only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Meta
META_APP_ID=
META_APP_SECRET=
META_WEBHOOK_VERIFY_TOKEN=

# PhonePe
PHONEPE_MERCHANT_ID=
PHONEPE_MERCHANT_KEY=
PHONEPE_KEY_INDEX=1

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Email (Resend)
RESEND_API_KEY=
```

### Vercel Environment Variables
All variables above must be added to Vercel dashboard:
- Settings → Environment Variables
- Set `NEXT_PUBLIC_APP_URL=https://expendmore.com` for production
- `FIREBASE_ADMIN_PRIVATE_KEY` — must have newlines escaped as `\n`

---

## Deployment Process

### Standard Deploy (Every Feature)
1. Finish feature locally
2. Run `npm run build` — fix ALL errors before proceeding
3. Run `npm run lint` — fix ALL lint errors
4. Manual test on localhost:3000
5. `git add -A && git commit -m "feat: ..."` (follow commit convention)
6. `git push origin main`
7. Vercel auto-deploys from `main` branch
8. Check Vercel build logs — zero errors required
9. Test production URL
10. Update `tasks.md` and `changelog.md`

### Emergency Hotfix
1. Branch from `main`: `git checkout -b hotfix/description`
2. Fix the issue
3. Push and create PR → merge to main
4. Vercel auto-deploys
5. Verify fix in production

---

## Post-Deployment Checklist

After every deployment:
- [ ] Build succeeded (green in Vercel dashboard)
- [ ] No runtime errors in Vercel logs (Function logs tab)
- [ ] Login flow works (Google + Email)
- [ ] Auth redirects working (protected routes → login)
- [ ] WhatsApp module loads
- [ ] API health check: `GET /api/v1/health` returns 200
- [ ] Firestore reads/writes working
- [ ] No 500 errors in monitoring

---

## Firestore Rules Deployment

```bash
# Install Firebase CLI if not present
npm install -g firebase-tools

# Login
firebase login

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only indexes
firebase deploy --only firestore:indexes
```

---

## Rolling Back

If production is broken:
1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"
4. Vercel instantly reverts
5. Investigate the broken deployment logs
6. Fix and redeploy

---

## Monitoring

- **Vercel Analytics**: Performance metrics at vercel.com dashboard
- **Vercel Speed Insights**: Core Web Vitals per route
- **Firebase Console**: Firestore reads/writes, Auth users, Storage usage
- **Upstash Dashboard**: Redis memory, throughput, errors
- **Application logs**: Vercel Function logs (real-time streaming)

---

## Build Optimization Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Largest Contentful Paint | < 2.5s |
| Bundle size (initial JS) | < 200KB gzipped |
| API response time (p95) | < 500ms |

---

## Scaling Notes

- Vercel functions are stateless — no in-memory state between requests
- Use Redis for any state that needs persistence across requests
- Firestore auto-scales — no manual intervention needed
- For high-volume campaign sends, implement a queue system (Redis + background workers)
- Consider Vercel Edge Functions for middleware and auth (faster cold starts)
