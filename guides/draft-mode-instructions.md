# Vercel Toolbar Draft Mode: Complete Implementation Guide

## Executive Summary

**Goal:** Show the Vercel Toolbar's Draft Mode option when running `next start` locally (production build).

**Answer:** This is **NOT directly supported out of the box**. The toolbar's localhost features are specifically designed for `next dev` (development mode). However, this document explains the complete inner workings so you can understand what would be needed for a custom implementation.

---

## Table of Contents

1. [How Draft Mode Detection Works](#how-draft-mode-detection-works)
2. [The Eye Icon Logic](#the-eye-icon-logic)
3. [Why `next start` Doesn't Work](#why-next-start-doesnt-work)
4. [Supported Scenarios](#supported-scenarios)
5. [Architecture Deep Dive](#architecture-deep-dive)
6. [Custom Implementation (Advanced)](#custom-implementation-advanced)

---

## How Draft Mode Detection Works

The Vercel Toolbar determines draft mode status through a multi-step communication flow between iframe frames and HTTP headers.

### The Detection Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐     postMessage      ┌─────────────────────┐  │
│  │   Toolbar UI         │ ──────────────────▶  │   Parent Window     │  │
│  │   (Instrument Frame) │  'get-draft-status'  │   (User's Page)     │  │
│  └──────────────────────┘                      └─────────────────────┘  │
│           │                                              │               │
│           │                                              │ HEAD request  │
│           │                                              │ with header:  │
│           │                                              │ x-vercel-draft-status: 1
│           │                                              ▼               │
│           │                                    ┌─────────────────────┐  │
│           │                                    │   Server Response   │  │
│           │                                    │   (Vercel Infra)    │  │
│           │                                    └─────────────────────┘  │
│           │                                              │               │
│           │                                              │ Response header:
│           │                                              │ x-vercel-token-status
│           │                                              ▼               │
│           │      postMessage                   ┌─────────────────────┐  │
│           │ ◀────────────────────────────────  │   'draft-status-    │  │
│           │    'draft-status-result'           │    result' message  │  │
│           ▼                                    └─────────────────────┘  │
│  ┌──────────────────────┐                                               │
│  │  Update UI with      │                                               │
│  │  Eye / EyeDashed     │                                               │
│  │  icon accordingly    │                                               │
│  └──────────────────────┘                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Breakdown

#### Step 1: Toolbar Requests Draft Status

**File:** `packages/collab/utils/draft-mode.ts`

```typescript
export async function getDraftStatus(): Promise<DraftStatus> {
  const fn = (window as unknown as WindowWithUnproxied).unproxied
  const str = await new Promise((resolve) => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data
      if (event.origin !== window.origin) return
      if (data?.type !== "draft-status-result") return
      resolve(data.status)
      fn.removeEventListener("message", onMessage)
    }
    fn.addEventListener("message", onMessage)
    window.parent.postMessage("get-draft-status", "*")
  })
  if (!str) return "unsupported"
  return str as DraftStatus
}
```

The toolbar sends a `get-draft-status` message to the parent window.

#### Step 2: Parent Window Makes HEAD Request

**File:** `packages/feedback/src/zero/active/activate.ts`

```typescript
if (event.data === "get-draft-status") {
  const opts = {
    method: "HEAD",
    headers: { "x-vercel-draft-status": "1" },
  }
  const res = await fetch(location.href, opts)

  frame.contentWindow?.postMessage(
    {
      type: "draft-status-result",
      status: res.headers.get("x-vercel-token-status"),
    },
    window.origin
  )
}
```

The parent window makes a HEAD request to the current page with a special header `x-vercel-draft-status: '1'`.

#### Step 3: Server Responds with Token Status

**On Vercel (Production):** Vercel's infrastructure automatically sets the `x-vercel-token-status` header based on:

- Whether the Next.js app has draft mode enabled
- Whether the `__prerender_bypass` cookie is present

**For Local Development:** The toolbar's dev server (`packages/feedback/dev-server.js`) mocks this:

```javascript
if (req.method === "HEAD" && req.headers["x-vercel-draft-status"] === "1") {
  const isEnabled = new RegExp(
    `__prerender_bypass=${prerenderBypassMock}`,
    "gi"
  ).test(req.headers.cookie)

  res.setHeader("x-vercel-token-status", isEnabled ? "enabled" : "disabled")
  res.statusCode = 204
  res.end()
  return true
}
```

#### Step 4: Toolbar Updates UI

**File:** `packages/collab/toolbar/index.tsx`

```typescript
useEffect(() => {
  if (!canDraft) {
    dispatch({ type: "setDraftStatus", value: "unsupported" })
    return
  }
  const handleDraftStatus = async () => {
    const draft = await getDraftStatus()
    dispatch({ type: "setDraftStatus", value: draft })
  }
  void handleDraftStatus()
}, [canDraft, window, dispatch, page])
```

---

## The Eye Icon Logic

**File:** `packages/collab/utils/use-tools.tsx`

```typescript
draft: {
  icon: draftStatus === 'enabled' ? Eye : EyeDashed,
  label: 'Draft Mode',
  onSelect: () => {
    addRecentTool('draft');
    redirectDraftMode(draftStatus === 'disabled');
  },
  isLoading: mode === 'draft',
  isOverriding: draftStatus === 'enabled',
  isVisible: !isExternal && draftStatus !== 'unsupported',
},
```

### Icon States

| `draftStatus` Value | Icon Shown                | Meaning                                        |
| ------------------- | ------------------------- | ---------------------------------------------- |
| `'enabled'`         | `Eye` (solid)             | Draft mode is ON - viewing unpublished content |
| `'disabled'`        | `EyeDashed` (dashed line) | Draft mode is OFF - viewing published content  |
| `'unsupported'`     | _Hidden_                  | Page doesn't support draft mode                |

### Visibility Conditions

The draft mode button is visible when **ALL** of these are true:

1. `!isExternal` — User is NOT an external user (must be a team member)
2. `draftStatus !== 'unsupported'` — The server responded with a valid status

---

## Why `next start` Doesn't Work

### Issue 1: LocalhostController Returns Null in Production

**File:** `packages/toolbar/src/next/localhost-controller.tsx`

```typescript
export function LocalhostController({ nonce }: { nonce?: string }) {
  if (process.env.NODE_ENV !== "development") {
    return null // ❌ Returns nothing in production mode
  }
  // ... rest of the component
}
```

### Issue 2: Plugin Skips Non-Development Builds

**File:** `packages/toolbar/src/plugins/next.ts`

```typescript
export function withVercelToolbar(config: VercelToolbarConfig = {}) {
  return (nextConfig: NextConfig): NextConfig => {
    // ...
    if (!config.enableInProduction && process.env.NODE_ENV !== "development") {
      return nextConfig // ❌ Returns early, doesn't set up toolbar
    }
    // ...
  }
}
```

### Issue 3: No `x-vercel-token-status` Header Locally

When running `next start`:

- Vercel's infrastructure is not available
- No server is setting the `x-vercel-token-status` header
- The toolbar receives `null` → status becomes `'unsupported'` → icon is hidden

---

## Supported Scenarios

### ✅ Scenario 1: Development with `next dev`

**Setup:**

```javascript
// next.config.js
const withVercelToolbar = require("@vercel/toolbar/plugins/next")()
module.exports = withVercelToolbar(nextConfig)
```

```jsx
// app/layout.tsx or _app.tsx
import { VercelToolbar } from "@vercel/toolbar/next"

export default function Layout({ children }) {
  return (
    <>
      {children}
      <VercelToolbar />
    </>
  )
}
```

**Why it works:**

- Plugin starts a local dev server
- `LocalhostController` connects to it
- Dev server mocks the `x-vercel-token-status` header

### ✅ Scenario 2: Production on Vercel

When deployed to Vercel, the toolbar is automatically injected and:

- Vercel's infrastructure handles `x-vercel-token-status`
- Draft mode cookies are managed by Vercel

### ❌ Scenario 3: `next start` Locally

**Not supported** because:

1. No local dev server running
2. No infrastructure to set `x-vercel-token-status`
3. `LocalhostController` explicitly returns `null`

---

## Architecture Deep Dive

### How Draft Mode Toggle Works

When user clicks the Eye icon:

**File:** `packages/collab/utils/draft-mode.ts`

```typescript
export function redirectDraftMode(draftMode: boolean, newPath?: string) {
  const current = window.parent.location.href
  const pathUrl = newPath ? new URL(newPath, current) : new URL(current)

  // Add draft mode query param
  pathUrl.searchParams.set("__vercel_draft", draftMode ? "1" : "0")

  // Redirect through Vercel's auth endpoint
  const navUrl = new URL(
    "/.well-known/vercel-auth-redirect",
    window.parent.location.origin
  )
  navUrl.searchParams.set("path", path)

  // Store optimistic state
  if (draftMode) {
    sessionStorage.setItem(DRAFT_SESSION_KEY, "1")
  }

  // Navigate
  window.parent.location.href = navUrl.href
}
```

### The Redirect Flow

1. User clicks Eye icon to enable draft mode
2. Toolbar redirects to `/.well-known/vercel-auth-redirect?path=/your-page?__vercel_draft=1`
3. Server handles this route:
   - Sets `__prerender_bypass` cookie
   - Redirects to the target path
4. Page loads with draft mode enabled
5. Next request includes the bypass cookie
6. Toolbar detects `draftStatus === 'enabled'`

---

## Custom Implementation (Advanced)

> ⚠️ **Warning:** This is unsupported and may break with toolbar updates.

If you absolutely need draft mode with `next start` locally, you would need to implement:

### 1. Custom Middleware

Create middleware that handles the draft mode protocol:

```typescript
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PRERENDER_BYPASS_COOKIE = "__prerender_bypass"
const BYPASS_VALUE = "your-secret-value" // Should match your Next.js config

export function middleware(request: NextRequest) {
  const url = request.nextUrl

  // Handle draft status check
  if (
    request.method === "HEAD" &&
    request.headers.get("x-vercel-draft-status") === "1"
  ) {
    const hasBypassCookie =
      request.cookies.get(PRERENDER_BYPASS_COOKIE)?.value === BYPASS_VALUE

    const response = new NextResponse(null, { status: 204 })
    response.headers.set(
      "x-vercel-token-status",
      hasBypassCookie ? "enabled" : "disabled"
    )
    return response
  }

  // Handle draft mode redirect
  if (url.pathname === "/.well-known/vercel-auth-redirect") {
    const targetPath = url.searchParams.get("path") || "/"
    const targetUrl = new URL(targetPath, request.url)
    const shouldEnable = targetUrl.searchParams.get("__vercel_draft") === "1"

    targetUrl.searchParams.delete("__vercel_draft")

    const response = NextResponse.redirect(targetUrl)

    if (shouldEnable) {
      response.cookies.set(PRERENDER_BYPASS_COOKIE, BYPASS_VALUE, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      })
    } else {
      response.cookies.delete(PRERENDER_BYPASS_COOKIE)
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
```

### 2. Environment Configuration

```javascript
// next.config.js
const withVercelToolbar = require("@vercel/toolbar/plugins/next")({
  enableInProduction: true, // Allow plugin to run in production
})

module.exports = withVercelToolbar(nextConfig)
```

### 3. Manual Toolbar Injection

Since `LocalhostController` won't work, you'd need to inject the toolbar script manually:

```jsx
// components/toolbar-wrapper.tsx
"use client"

import { useEffect } from "react"

export function ToolbarWrapper() {
  useEffect(() => {
    // Only run in production local mode
    if (process.env.NODE_ENV !== "production") return
    if (typeof window === "undefined") return

    const script = document.createElement("script")
    script.src = "https://vercel.live/_next-live/feedback/feedback.js"
    script.async = true
    script.dataset.explicitOptIn = "true"
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return null
}
```

### Important Caveats

1. **Authentication**: You still need to be authenticated with Vercel for the toolbar to work
2. **Cookie Security**: The `__prerender_bypass` value must match your Next.js draft mode secret
3. **No Git Branch Info**: Without the dev server, branch-specific features won't work
4. **Unsupported**: This approach may break with future toolbar updates

---

## Recommended Approach

Instead of trying to make `next start` work with draft mode:

1. **Use `next dev`** for local draft mode testing
2. **Deploy to Vercel Preview** to test production draft mode behavior
3. **Use Preview URLs** from Vercel to share draft content with reviewers

---

## Key Files Reference

| File                                                 | Purpose                                             |
| ---------------------------------------------------- | --------------------------------------------------- |
| `packages/collab/utils/use-tools.tsx`                | Defines draft tool with Eye/EyeDashed icon          |
| `packages/collab/utils/draft-mode.ts`                | `getDraftStatus()`, `redirectDraftMode()` functions |
| `packages/collab/toolbar/index.tsx`                  | Toolbar UI, initializes draft status on mount       |
| `packages/feedback/src/zero/active/activate.ts`      | Handles `get-draft-status` postMessage              |
| `packages/toolbar/src/next/localhost-controller.tsx` | Localhost-specific toolbar setup (dev only)         |
| `packages/toolbar/src/plugins/next.ts`               | Next.js plugin configuration                        |
| `packages/feedback/dev-server.js`                    | Development server that mocks Vercel infrastructure |

---

## Summary

| Scenario             | Draft Mode Works? | Why                                       |
| -------------------- | ----------------- | ----------------------------------------- |
| `next dev` + plugin  | ✅ Yes            | Dev server mocks infrastructure           |
| Vercel Preview       | ✅ Yes            | Vercel infrastructure handles it          |
| Vercel Production    | ✅ Yes            | Vercel infrastructure handles it          |
| `next start` locally | ❌ No             | No infrastructure, component returns null |
| Custom middleware    | ⚠️ Maybe          | Possible but unsupported                  |

**Bottom line:** For reliable draft mode testing, use `next dev` locally or deploy to Vercel Preview environments.
