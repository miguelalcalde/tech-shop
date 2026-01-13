"use server";

// Re-export Sanity blog actions for backward compatibility
// The original Contentful implementation has been replaced with Sanity
// Draft mode is now handled automatically by sanityFetch from defineLive

import {
  getSanityBlogPostsAction,
  getSanityBlogPostBySlugAction,
} from "./sanity-blog-actions";

export async function getBlogPostsAction() {
  return getSanityBlogPostsAction();
}

export async function getBlogPostBySlugAction(slug: string) {
  return getSanityBlogPostBySlugAction(slug);
}

