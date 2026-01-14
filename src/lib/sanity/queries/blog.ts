import { client } from "@/sanity/lib/client"
import { BlogPost } from "@/types"

// GROQ Queries
// Query to include all posts (regardless of published state) - for draft mode
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

// Query to include only published posts - for production
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

// Simple query for just slugs - used in generateStaticParams (no draft mode check)
const BLOG_POST_SLUGS_QUERY = `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
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

/**
 * Get all blog post slugs for generateStaticParams.
 * This function does NOT check draft mode - it runs at build time.
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
 * Fetch all blog posts ordered by publish date.
 * @param isDraft - Whether to fetch draft content (passed explicitly from page)
 */
export async function getBlogPosts(isDraft: boolean): Promise<BlogPost[]> {
  const posts = await client.fetch<BlogPost[]>(
    isDraft ? BLOG_POSTS_QUERY : BLOG_POSTS_QUERY_PROD,
    {},
    isDraft
      ? {
          perspective: "drafts" as const,
          useCdn: false,
          token: process.env.SANITY_VIEWER_TOKEN,
        }
      : {
          next: { revalidate: 60 },
        }
  )
  return posts ?? []
}

/**
 * Fetch a single blog post by slug.
 * @param slug - The post slug
 * @param isDraft - Whether to fetch draft content (passed explicitly from page)
 * @returns BlogPost or null if not found
 */
export async function getBlogPostBySlug(
  slug: string,
  isDraft: boolean
): Promise<BlogPost | null> {
  const post = await client.fetch<BlogPost | null>(
    BLOG_POST_BY_SLUG_QUERY,
    { slug },
    isDraft
      ? {
          perspective: "drafts" as const,
          useCdn: false,
          token: process.env.SANITY_VIEWER_TOKEN,
        }
      : {
          next: { revalidate: 60 },
        }
  )
  return post
}
