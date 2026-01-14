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
