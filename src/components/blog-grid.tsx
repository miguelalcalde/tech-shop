import { BlogPost } from "@/types"
import BlogCard from "./blog-card"

interface BlogGridProps {
  posts: BlogPost[]
}

export default async function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-lg text-gray-600">
          No blog posts available yet. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
