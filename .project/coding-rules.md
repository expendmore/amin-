# ExpendMore — Coding Rules

---

## The Golden Rules

1. **Read brain.md before every session** — never restart planning
2. **One feature at a time** — never start multiple major features simultaneously
3. **Review existing code first** — never overwrite working code
4. **Never delete production code without confirmation**
5. **Think before coding** — design → database → backend → frontend → test

---

## File & Folder Structure

```
src/
├── app/              # Next.js pages + API routes ONLY
├── components/       # Pure UI components (no business logic)
│   ├── ui/          # Primitives (Button, Input, Card, etc.)
│   ├── navigation/  # Layout components (Sidebar, Header)
│   ├── providers/   # Context providers
│   └── guards/      # Auth/role guard components
├── lib/             # Utility functions and service wrappers
├── hooks/           # Zustand stores + custom React hooks
├── types/           # TypeScript interfaces and types ONLY
├── services/        # Business logic (no UI imports allowed)
└── middleware.ts    # Edge middleware
```

---

## TypeScript Standards

```typescript
// ✅ Always type function parameters and return values
async function sendCampaign(
  campaignId: string,
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {}

// ✅ Use interfaces for data shapes
interface Campaign {
  id: string;
  workspaceId: string;  // ALWAYS include
  name: string;
  status: CampaignStatus;
}

// ✅ Use enums/union types for finite values
type CampaignStatus = "draft" | "scheduled" | "running" | "completed" | "failed";

// ❌ Never use 'any' unless explicitly justified with comment
const data: any = ...; // BAD

// ❌ Never suppress TypeScript errors with @ts-ignore
// @ts-ignore  // BAD

// ✅ Type assertions only when absolutely necessary
const element = document.getElementById("app") as HTMLDivElement;
```

---

## Component Standards

```tsx
// ✅ Always use named exports for components
export function CampaignCard({ campaign }: CampaignCardProps) {}

// ✅ Define prop types above component
interface CampaignCardProps {
  campaign: Campaign;
  onAction?: (campaignId: string) => void;
}

// ✅ Use "use client" only when needed (event handlers, hooks, browser APIs)
// Default to Server Components

// ❌ Never import server-only code in client components
// "use client"
// import { adminDb } from "@/lib/firebase-admin"; // CRASH

// ✅ Keep components focused — split if > 200 lines
// ✅ No business logic in UI components — extract to hooks/services
// ✅ Always handle loading and error states
```

---

## API Route Standards

Every API route MUST follow this structure:

```typescript
// src/app/api/v1/[resource]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/firebase-admin";
import { validateWorkspaceMembership } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  try {
    // 1. Verify authentication
    const { uid, error: authError } = await verifyAuth(request);
    if (authError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Extract and validate params
    const workspaceId = request.nextUrl.searchParams.get("workspaceId");
    if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

    // 3. Validate workspace access
    const hasAccess = await validateWorkspaceMembership(uid, workspaceId);
    if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // 4. Business logic
    const data = await getResource(workspaceId);

    // 5. Return typed response
    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    // 6. Never expose error details to client
    console.error("[API Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

---

## Firestore Rules

Every Firestore write MUST include `workspaceId`:

```typescript
// ✅ Always set workspaceId
await db.collection("contacts").add({
  workspaceId,          // REQUIRED
  name: contact.name,
  phone: contact.phone,
  createdAt: serverTimestamp()
});

// ❌ Never write without workspaceId
await db.collection("contacts").add({ name: "John" }); // BAD
```

---

## Error Handling

```typescript
// ✅ Use structured error returns
type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

// ✅ Log errors server-side, return generic messages client-side
catch (error) {
  console.error("[Service: sendMessage]", error);
  return { data: null, error: "Failed to send message" };
}

// ❌ Never return stack traces or internal details to client
return NextResponse.json({ error: error.stack }); // SECURITY BUG

// ❌ Never use empty catch blocks
catch (error) {} // BAD
```

---

## No-Console Rule

```typescript
// ❌ No console.log in production code
console.log("user data", user); // Remove before commit

// ✅ Use observability module
import { logger } from "@/lib/observability";
logger.info("User authenticated", { uid });

// ❌ console.error is acceptable only in error handlers (server-side)
// Never in UI components
```

---

## Import Order Convention

```typescript
// 1. React/Next
import React, { useState } from "react";
import { NextRequest } from "next/server";

// 2. Third-party libraries
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";

// 3. Internal — lib utilities
import { adminDb } from "@/lib/firebase-admin";

// 4. Internal — types
import type { Campaign } from "@/types/campaigns";

// 5. Internal — components (in component files)
import { Button } from "@/components/ui/button";
```

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `CampaignCard.tsx` |
| Hooks/stores | camelCase with `use-` prefix | `use-campaigns.ts` |
| Lib utilities | camelCase | `firebase-admin.ts` |
| API routes | kebab-case dirs | `/api/v1/whatsapp-accounts/` |
| Types | PascalCase | `Campaign`, `WorkspaceRole` |
| Enums | PascalCase | `CampaignStatus.RUNNING` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_CREDITS = 10000` |
| Firestore collections | camelCase | `whatsappAccounts`, `auditLogs` |

---

## Git Commit Convention

```
feat: add PhonePe payment integration
fix: correct middleware cookie validation
refactor: migrate workflow engine to Firestore
chore: remove Supabase dependencies
docs: update architecture.md with new API routes
security: add HMAC verification to Meta webhook
```

---

## What NOT to Build

- Do NOT use unofficial WhatsApp libraries (only Meta Cloud API)
- Do NOT use password-based auth (system prompt explicitly bans it — email/password on login page is a temporary exception that should be reviewed)
- Do NOT create per-customer Meta Apps
- Do NOT store access tokens in frontend state or localStorage
- Do NOT write direct Firestore from the browser without Firestore security rules as backup
- Do NOT suppress TypeScript or ESLint errors — fix them
