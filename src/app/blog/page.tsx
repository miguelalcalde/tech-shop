import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogGrid from "@/components/blog-grid"
import { getBlogPosts } from "@/lib/sanity/queries/blog"
import { isDraftMode } from "@/lib/is-draft-mode"

export const metadata = {
  title: "Tech Blog | ACME Tech Shop",
  description: "Latest tech news, reviews, and guides from the Tech Shop team.",
}

// ISR: Revalidate every 60 seconds - Draft Mode will automatically switch to dynamic when enabled
export const revalidate = 60

function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white border-4 border-black p-6 h-64 animate-pulse"
        >
          <div className="h-4 bg-gray-200 w-24 mb-4" />
          <div className="h-6 bg-gray-200 w-full mb-2" />
          <div className="h-6 bg-gray-200 w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 w-full mb-2" />
          <div className="h-4 bg-gray-200 w-full mb-2" />
          <div className="h-4 bg-gray-200 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export default async function BlogPage() {
  const isDraft = await isDraftMode()
  const posts = await getBlogPosts(isDraft)

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        <section className="border-b-4 border-black bg-yellow-400 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-black text-5xl md:text-6xl uppercase tracking-tight mb-4 border-4 border-black inline-block px-8 py-4 bg-white">
              Tech Blog
            </h1>
            <p className="font-mono text-lg uppercase mt-6">
              News, Reviews, and Guides from the Tech Shop Team
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <Suspense fallback={<BlogGridSkeleton />}>
            <BlogGrid posts={posts} />
          </Suspense>
        </section>
      </main>

      <Footer />
    </div>
  )
}
