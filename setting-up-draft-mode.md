# Setting Up Draft Mode with Vercel Toolbar & Next.js

This guide walks through the process of setting up Draft Mode for a Next.js application with the Vercel Toolbar. It covers the correct implementation pattern, common pitfalls, and important caveats discovered through real-world implementation.

---

## Table of Contents

1. [What is Draft Mode?](#what-is-draft-mode)
2. [Prerequisites](#prerequisites)
3. [Implementation Pattern](#implementation-pattern)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Common Pitfalls](#common-pitfalls)
6. [Testing Draft Mode](#testing-draft-mode)
7. [Local Development Caveats](#local-development-caveats)
8. [Architecture Deep Dive](#architecture-deep-dive)
9. [Troubleshooting](#troubleshooting)

---

## What is Draft Mode?

Draft Mode is a Next.js feature that allows you to preview unpublished content from your headless CMS directly on your production site. When enabled:

- **Static pages** (ISR/SSG) temporarily switch to **dynamic rendering**
- The ISR cache is bypassed, fetching fresh data on each request
- You can see draft/unpublished content before it goes live

The **Vercel Toolbar** provides a convenient UI toggle (eye icon) to enable/disable Draft Mode without manually visiting API routes.

---

## Prerequisites

- Next.js 15+ with App Router
- `@vercel/toolbar` package installed
- A headless CMS (Sanity, Contentful, etc.)
- Project deployed to Vercel (for full toolbar functionality)

```bash
npm install @vercel/toolbar
```

---

## Implementation Pattern

### Recommended Pattern

The correct pattern for Draft Mode follows these principles:

| **Step** | **Correct Pattern**                                                 | **Comments**                                                                                                             |
| -------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1        | Page declares: `export const dynamic = 'force-static'`              | Tells Next.js to statically generate the page, but will switch to dynamic when Draft Mode cookie is present              |
| 2        | `generateStaticParams()` uses SIMPLE function (no draft mode check) | Runs at build time (no request context), so checking draft mode here would error                                         |
| 3        | Page component EXPLICITLY calls `isDraftMode()`                     | Ensures the draft mode check is visible in the page component, giving clear control over rendering behavior              |
| 4        | `isDraft` is PASSED to data fetching functions as parameter         | Keeps data fetching logic pure and testable, instead of reading draft state internally                                   |
| 5        | `isDraftMode()` helper uses try/catch for safety                    | Prevents errors if called when there is no request context, which can happen at build time or in static generation cases |

---

## Step-by-Step Setup

### Step 1: Configure Next.js

```javascript
// next.config.mjs
import { withVercelToolbar } from "@vercel/toolbar/plugins/next"

const nextConfig = {
  // your config
}

export default withVercelToolbar({
  enableInProduction: true, // Required for local production testing
})(nextConfig)
```

### Step 2: Add Vercel Toolbar to Layout

```tsx
// src/app/layout.tsx
import { VercelToolbar } from "@vercel/toolbar/next"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <VercelToolbar />
      </body>
    </html>
  )
}
```

### Step 3: Create Safe Draft Mode Helper

```typescript
// src/lib/is-draft-mode.ts
import "server-only"
import { draftMode } from "next/headers"
import { cache } from "react"

/**
 * Safe draft mode check that works both at build time and request time.
 * Returns false during build/SSG (outside request scope).
 * Cached per request to avoid multiple draftMode() calls.
 */
export const isDraftMode = cache(async (): Promise<boolean> => {
  try {
    const { isEnabled } = await draftMode()
    return isEnabled
  } catch {
    // draftMode() throws when called outside request scope (e.g., during build)
    return false
  }
})
```

### Step 4: Create Draft Mode API Routes

```typescript
// src/app/api/draft-mode/enable/route.ts
import { draftMode } from "next/headers"
import { redirect } from "next/navigation"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug") || "/"

  const draft = await draftMode()
  draft.enable()

  redirect(slug)
}
```

```typescript
// src/app/api/draft-mode/disable/route.ts
import { draftMode } from "next/headers"
import { redirect } from "next/navigation"

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()

  redirect("/")
}
```

### Step 5: Create Data Fetching Functions

**Key:** Create separate functions for different purposes:

```typescript
// src/lib/sanity/queries/blog.ts
import { client } from "@/sanity/lib/client"

// Simple query for slugs - used in generateStaticParams (NO draft mode)
const BLOG_POST_SLUGS_QUERY = `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`

// Full query for posts
const BLOG_POSTS_QUERY = `
  *[_type == "post" && defined(slug.current)]
  | order(publishedAt desc) {
    "slug": slug.current,
    title,
    // ... other fields
  }
`

/**
 * Get all slugs for generateStaticParams.
 * Does NOT check draft mode - runs at build time.
 */
export async function getAllBlogPostSlugs(): Promise<string[]> {
  const posts = await client.fetch<{ slug: string }[]>(
    BLOG_POST_SLUGS_QUERY,
    {},
    { next: { revalidate: 60 } }
  )
  return posts?.map((post) => post.slug) ?? []
}

/**
 * Fetch blog posts.
 * @param isDraft - Whether to fetch draft content (passed explicitly)
 */
export async function getBlogPosts(isDraft: boolean): Promise<BlogPost[]> {
  const posts = await client.fetch<BlogPost[]>(
    BLOG_POSTS_QUERY,
    {},
    isDraft
      ? {
          perspective: "drafts",
          useCdn: false,
          token: process.env.SANITY_VIEWER_TOKEN,
        }
      : {
          next: { revalidate: 60 },
        }
  )
  return posts ?? []
}
```

### Step 6: Implement the Page Component

```tsx
// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation"
import {
  getAllBlogPostSlugs,
  getBlogPostBySlug,
} from "@/lib/sanity/queries/blog"
import { isDraftMode } from "@/lib/is-draft-mode"

// ✅ Force static generation - auto-switches to dynamic when Draft Mode enabled
export const dynamic = "force-static"

interface PageProps {
  params: Promise<{ slug: string }>
}

// ✅ Use simple function that does NOT call draftMode()
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllBlogPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const isDraft = await isDraftMode() // ✅ Explicit call
  const post = await getBlogPostBySlug(slug, isDraft) // ✅ Pass as parameter

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const isDraft = await isDraftMode() // ✅ Explicit call
  const post = await getBlogPostBySlug(slug, isDraft) // ✅ Pass as parameter

  if (!post) {
    notFound()
  }

  return (
    <article>
      <h1>{post.title}</h1>
      {/* ... */}
    </article>
  )
}
```

---

## Common Pitfalls

### ❌ Pitfall 1: Calling `draftMode()` in `generateStaticParams`

```typescript
// ❌ WRONG - Will throw "draftMode was called outside a request scope"
export async function generateStaticParams() {
  const posts = await getBlogPosts() // If this calls draftMode() internally
  return posts.map((post) => ({ slug: post.slug }))
}

// ✅ CORRECT - Use simple function without draft mode
export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs() // Simple function, no draft mode
  return slugs.map((slug) => ({ slug }))
}
```

### ❌ Pitfall 2: Hiding Draft Mode Check Inside Data Fetching

```typescript
// ❌ WRONG - Draft mode check is hidden
export async function getBlogPosts() {
  const isDraft = await isDraftMode() // Hidden inside
  // ...
}

// ✅ CORRECT - Accept isDraft as parameter
export async function getBlogPosts(isDraft: boolean) {
  // ...
}
```

### ❌ Pitfall 3: Using `revalidate` Instead of `dynamic = 'force-static'`

```typescript
// ❌ Less explicit - page may still become dynamic
export const revalidate = 60

// ✅ CORRECT - Explicitly declares static, auto-switches for draft mode
export const dynamic = "force-static"
```

### ❌ Pitfall 4: Missing try/catch in Draft Mode Helper

```typescript
// ❌ WRONG - Throws at build time
export const isDraftMode = cache(async () => {
  const { isEnabled } = await draftMode()
  return isEnabled
})

// ✅ CORRECT - Handles build-time gracefully
export const isDraftMode = cache(async () => {
  try {
    const { isEnabled } = await draftMode()
    return isEnabled
  } catch {
    return false
  }
})
```

---

## Testing Draft Mode

### Option 1: Via API Route (Works Everywhere)

```bash
# Enable draft mode
curl http://localhost:3000/api/draft-mode/enable?slug=/blog

# Disable draft mode
curl http://localhost:3000/api/draft-mode/disable
```

Or simply visit these URLs in your browser.

### Option 2: Via Vercel Toolbar (Vercel Deployments Only)

1. Deploy to Vercel (Preview or Production)
2. Navigate to your page
3. Click the Vercel Toolbar
4. Click the **eye icon** to toggle Draft Mode

---

## Local Development Caveats

### ⚠️ Important: Vercel Toolbar Draft Mode Toggle

| Environment          | Toolbar Visible? | Draft Mode Toggle? | Why                                    |
| -------------------- | ---------------- | ------------------ | -------------------------------------- |
| `next dev`           | ✅ Yes           | ✅ Yes             | Dev server mocks Vercel infrastructure |
| `next start` (local) | ✅ Yes\*         | ❌ No              | No `x-vercel-token-status` header      |
| Vercel Preview       | ✅ Yes           | ✅ Yes             | Vercel infrastructure handles it       |
| Vercel Production    | ✅ Yes           | ✅ Yes             | Vercel infrastructure handles it       |

\*Requires `enableInProduction: true` in next.config.mjs

### Why `next start` Doesn't Show Draft Mode Toggle

The Vercel Toolbar's Draft Mode toggle requires Vercel's infrastructure:

1. **Toolbar sends** HEAD request with `x-vercel-draft-status: 1` header
2. **Vercel responds** with `x-vercel-token-status: enabled|disabled` header
3. **Toolbar shows** eye icon based on response

When running `next start` locally, there's no server setting this header, so:

- Response header is `null`
- Toolbar status becomes `'unsupported'`
- Draft Mode icon is **hidden**

### Making Toolbar Visible Locally in Production Mode

Even without the Draft Mode toggle, you can see the toolbar:

```javascript
// next.config.mjs
export default withVercelToolbar({
  enableInProduction: true, // Shows toolbar in `next start`
})(nextConfig)
```

### Alternative: Manual Draft Mode Testing Locally

Since the toolbar toggle won't work with `next start`, test draft mode manually:

```bash
# 1. Build and start production server
pnpm build && pnpm start

# 2. Enable draft mode via API route
# Visit: http://localhost:3000/api/draft-mode/enable?slug=/blog

# 3. You're now in draft mode - page will show draft content

# 4. Disable when done
# Visit: http://localhost:3000/api/draft-mode/disable
```

---

## Architecture Deep Dive

### How Draft Mode Detection Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DETECTION FLOW                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐     postMessage      ┌─────────────────────┐      │
│  │   Toolbar UI     │ ──────────────────▶  │   Parent Window     │      │
│  │   (iframe)       │  'get-draft-status'  │   (Your Page)       │      │
│  └──────────────────┘                      └─────────────────────┘      │
│           │                                          │                   │
│           │                                          │ HEAD request      │
│           │                                          │ x-vercel-draft-   │
│           │                                          │ status: 1         │
│           │                                          ▼                   │
│           │                                ┌─────────────────────┐      │
│           │                                │   Vercel Infra      │      │
│           │                                │   (or middleware)   │      │
│           │                                └─────────────────────┘      │
│           │                                          │                   │
│           │                                          │ x-vercel-token-   │
│           │                                          │ status: enabled   │
│           │                                          ▼                   │
│           │      postMessage               ┌─────────────────────┐      │
│           │ ◀────────────────────────────  │  'draft-status-     │      │
│           │    'draft-status-result'       │   result' message   │      │
│           ▼                                └─────────────────────┘      │
│  ┌──────────────────┐                                                   │
│  │  Show Eye icon   │                                                   │
│  │  (solid/dashed)  │                                                   │
│  └──────────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### How Draft Mode Toggle Works

When you click the eye icon:

1. Toolbar redirects to `/.well-known/vercel-auth-redirect?path=/blog?__vercel_draft=1`
2. Vercel handles this route:
   - Sets `__prerender_bypass` cookie
   - Redirects to target path
3. Page loads with draft mode enabled
4. Next.js detects cookie → switches to dynamic rendering
5. Your code checks `isDraftMode()` → fetches draft content

---

## Troubleshooting

### Draft Mode Toggle Not Appearing

1. **Check if page is static:** Run `pnpm build` and look for `●` (SSG) or `○` (Static) next to your route, not `ƒ` (Dynamic)

2. **Check toolbar is enabled:** Ensure `<VercelToolbar />` is in your layout

3. **Check you're on Vercel:** The toggle only works on Vercel deployments

4. **Check you're logged in:** Must be a team member on the Vercel project

### Build Error: "draftMode was called outside a request scope"

This means `draftMode()` is being called during build time. Check:

1. `generateStaticParams()` — should NOT call any function that uses `draftMode()`
2. Data fetching functions — should accept `isDraft` as parameter, not check internally

### Draft Content Not Showing

1. **Check cookie exists:** Look for `__prerender_bypass` in browser DevTools
2. **Check API route:** Visit `/api/draft-mode/enable` directly
3. **Check data fetching:** Ensure you're passing `isDraft` to your CMS client

---

## Summary

| What                   | How                                       |
| ---------------------- | ----------------------------------------- |
| Page rendering         | `export const dynamic = "force-static"`   |
| `generateStaticParams` | Use simple function, NO draft mode check  |
| Page component         | Call `isDraftMode()` explicitly           |
| Data fetching          | Accept `isDraft` as parameter             |
| Draft mode helper      | Use `cache()` + try/catch                 |
| Local testing          | Use API routes (`/api/draft-mode/enable`) |
| Production testing     | Use Vercel Toolbar eye icon               |

---

## References

- [Next.js Draft Mode Documentation](https://nextjs.org/docs/app/guides/draft-mode)
- [Vercel Toolbar Documentation](https://vercel.com/docs/workflow-collaboration/vercel-toolbar)
- [Vercel Draft Mode Documentation](https://vercel.com/docs/draft-mode)
