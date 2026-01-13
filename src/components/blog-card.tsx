"use client";

import Link from "next/link";
import { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <article
        className="bg-white border-4 border-black p-6 transition-all duration-200 
                  hover:translate-x-[-8px] hover:translate-y-[-8px] 
                  hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col"
      >
        <div className="flex-grow space-y-4">
          <div className="flex items-center gap-3 text-sm font-mono">
            <span className="bg-yellow-400 border-2 border-black px-2 py-1 font-bold uppercase">
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
          <span className="font-black text-sm uppercase tracking-wide hover:text-yellow-600 transition-colors">
            Read More →
          </span>
        </div>
      </article>
    </Link>
  );
}

