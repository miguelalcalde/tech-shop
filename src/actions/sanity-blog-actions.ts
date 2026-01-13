"use server"

import { draftMode } from "next/headers"
import { client } from "@/sanity/lib/client"
import { ActionState, BlogPost, BlogPostData } from "@/types"
import { defineQuery } from "next-sanity"

// GROQ Queries - include drafts when in draft mode
const BLOG_POSTS_QUERY = defineQuery(`
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
`)

const BLOG_POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    extract,
    "author": author->name,
    publishedAt,
    "body": pt::text(body),
    "image": mainImage.asset->url
  }
`)

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

// These actions check Draft Mode and adjust fetching accordingly
// When Draft Mode is enabled via Vercel Toolbar:
// - The ISR cache is bypassed
// - We fetch from the 'drafts' perspective to show unpublished content
export async function getSanityBlogPostsAction(): Promise<
  ActionState<BlogPostData>
> {
  try {
    const isDraft = await isDraftModeEnabled()

    const posts = await client.fetch<BlogPost[]>(
      BLOG_POSTS_QUERY,
      {},
      isDraft
        ? {
            // Draft mode: fetch fresh draft content
            perspective: "drafts",
            useCdn: false,
            token: process.env.SANITY_VIEWER_TOKEN,
          }
        : {
            // Normal mode: use ISR
            next: { revalidate: 60 },
          },
    )

    return {
      isSuccess: true,
      message: "Blog posts fetched successfully",
      data: { posts: posts || [] },
    }
  } catch (error) {
    console.error("Error fetching blog posts from Sanity:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch blog posts from Sanity",
    }
  }
}

export async function getSanityBlogPostBySlugAction(
  slug: string,
): Promise<ActionState<{ post: BlogPost }>> {
  try {
    const isDraft = await isDraftModeEnabled()

    const post = await client.fetch<BlogPost | null>(
      BLOG_POST_BY_SLUG_QUERY,
      { slug },
      isDraft
        ? {
            // Draft mode: fetch fresh draft content
            perspective: "drafts",
            useCdn: false,
            token: process.env.SANITY_VIEWER_TOKEN,
          }
        : {
            // Normal mode: use ISR
            next: { revalidate: 60 },
          },
    )

    if (!post) {
      return {
        isSuccess: false,
        message: "Blog post not found",
      }
    }

    return {
      isSuccess: true,
      message: "Blog post fetched successfully",
      data: { post },
    }
  } catch (error) {
    console.error("Error fetching blog post from Sanity:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch blog post from Sanity",
    }
  }
}
