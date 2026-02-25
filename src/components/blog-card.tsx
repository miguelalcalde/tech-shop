"use client"

import Link from "next/link"
import { BlogPost } from "@/types"
import { Icons } from "@/components/icons"

interface BlogCardProps {
  post: BlogPost
}

function DraftBadge() {
  return (
    <div className="flex items-center gap-1.5 bg-[#F03E2F] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <Icons.Sanity className="w-4 h-4" />
      <span className="font-black text-xs text-white uppercase tracking-wide">
        Draft
      </span>
    </div>
  )
}

function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 bg-green-500 border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <Icons.Live className="w-3 h-3 text-white" />
      <span className="font-black text-xs text-white uppercase tracking-wide">
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
        className="relative bg-white border-4 border-black p-6 transition-all duration-200 
                  hover:translate-x-[-8px] hover:translate-y-[-8px] 
                  hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col"
      >
        {showBadges && (isDraftDocument || hasPublishedVersion) && (
          <div className="absolute -top-3 -right-3 z-10 flex items-center gap-1">
            {hasPublishedVersion && <LiveBadge />}
            {isDraftDocument && <DraftBadge />}
          </div>
        )}

        <div className="flex-grow space-y-4">
          <div className="flex items-center gap-3 text-sm font-mono">
            <span className="bg-cyan-400 border-2 border-black px-2 py-1 font-bold uppercase">
              {formattedDate}
            </span>
            <span className="text-gray-600">by {post.author}</span>
          </div>

          <h3 className="font-black text-xl uppercase tracking-tight line-clamp-2">
            {post.title}
          </h3>

          <p className="font-mono text-sm text-gray-700 line-clamp-3">
            {post.extract}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t-2 border-black">
          <span className="font-black text-sm uppercase tracking-wide hover:text-cyan-600 transition-colors">
            Read More →
          </span>
        </div>
      </article>
    </Link>
  )
}
