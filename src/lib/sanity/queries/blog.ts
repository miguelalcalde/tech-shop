import { draftMode } from "next/headers"
import { client } from "@/sanity/lib/client"
import { BlogPost } from "@/types"

// GROQ Queries
// Query to include all posts (regardless of published state)
const BLOG_POSTS_QUERY = `
  *[_type == "post" && defined(slug.current)]
  | order(publishedAt desc) {
    "slug": slug.current,
    title,
    extract,
    "author": author->name,
    publishedAt,
    "body": pt::text(body),
    "image": mainImage.asset->url
  }
`

// Query to include only published posts
const BLOG_POSTS_QUERY_PROD = `
  *[
    _type == "post" &&
    defined(slug.current) &&
    publishedAt < now() &&
    !(_id in path("drafts.**"))
  ]
  | order(publishedAt desc) {
    "slug": slug.current,
    title,
    extract,
    "author": author->name,
    publishedAt,
    "body": pt::text(body),
    "image": mainImage.asset->url
  }
`

const BLOG_POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    extract,
    "author": author->name,
    publishedAt,
    "body": pt::text(body),
    "image": mainImage.asset->url
  }
`

// Helper to safely check draft mode (returns false during build/SSG)
async function isDraftModeEnabled(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode()
    return isEnabled
  } catch {
    // draftMode() throws when called outside request scope (e.g., during build)
    return false
  }
}

// Fetch options based on draft mode
async function getFetchOptions() {
  const isDraft = await isDraftModeEnabled()

  if (isDraft) {
    return {
      perspective: "drafts" as const,
      useCdn: false,
      token: process.env.SANITY_VIEWER_TOKEN,
    }
  }

  return {
    next: { revalidate: 60 },
  }
}

/**
 * Fetch all blog posts ordered by publish date
 * @throws Error if fetch fails
 */
export async function getBlogPosts(isDraft: boolean): Promise<BlogPost[]> {
  const options = await getFetchOptions()
  const posts = await client.fetch<BlogPost[]>(
    isDraft ? BLOG_POSTS_QUERY_PROD : BLOG_POSTS_QUERY,
    {},
    options
  )
  return posts ?? []
}

/**
 * Fetch a single blog post by slug
 * @throws Error if fetch fails
 * @returns BlogPost or null if not found
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const options = await getFetchOptions()
  const post = await client.fetch<BlogPost | null>(
    BLOG_POST_BY_SLUG_QUERY,
    { slug },
    options
  )
  return post
}
