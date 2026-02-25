import { getBlogPosts } from "@/lib/sanity/queries/blog"
import { BlogPost } from "@/types"
import BlogCard from "./blog-card"
import Link from "next/link"

export default async function BlogPreview() {
  const posts = await getBlogPosts()

  if (posts.length === 0) {
    return null
  }

  const latestPosts = posts.slice(0, 3)

  return (
    <section className="bg-secondary border-y border-border py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-semibold text-2xl text-foreground">Latest from the Blog</h2>
          <Link
            href="/blog"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm
                       hover:bg-primary/90 transition-colors duration-200"
          >
            View All Posts
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post: BlogPost) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
