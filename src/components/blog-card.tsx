"use client"

import Link from "next/link"
import { BlogPost } from "@/types"
import { Icons } from "@/components/icons"

interface BlogCardProps {
  post: BlogPost
}

function DraftBadge() {
  return (
    <div className="flex items-center gap-1.5 bg-destructive text-destructive-foreground px-2 py-1 rounded-md shadow-sm">
      <Icons.Sanity className="w-3.5 h-3.5" />
      <span className="text-[10px] font-medium tracking-wide">
        Draft
      </span>
    </div>
  )
}

function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 bg-primary text-primary-foreground px-2 py-1 rounded-md shadow-sm">
      <Icons.Live className="w-2.5 h-2.5" />
      <span className="text-[10px] font-medium tracking-wide">
        Live
      </span>
    </div>
  )
}

export default function BlogCard({ post }: BlogCardProps) {
  // Check if document has unpublished changes using _originalId from Sanity's drafts perspective
  const isDraftDocument = post._originalId?.startsWith("drafts.")
  // Check if a published version exists
  const hasPublishedVersion = post.hasPublishedVersion

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Show badges only in draft mode (when _originalId is present)
  const showBadges = post._originalId !== undefined

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <article
        className="relative bg-card border border-border rounded-xl p-6 transition-all duration-200 
                  hover:shadow-md hover:border-foreground/20 h-full flex flex-col"
      >
        {showBadges && (isDraftDocument || hasPublishedVersion) && (
          <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
            {hasPublishedVersion && <LiveBadge />}
            {isDraftDocument && <DraftBadge />}
          </div>
        )}

        <div className="flex-grow space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground text-xs">
              {formattedDate}
            </span>
            <span className="text-muted-foreground/60 text-xs">by {post.author}</span>
          </div>

          <h3 className="font-medium text-base text-foreground line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.extract}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <span className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
            Read More
          </span>
        </div>
      </article>
    </Link>
  )
}
