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

// Force static generation - Draft Mode will automatically switch to dynamic when enabled
export const dynamic = "force-static"

// ISR: Revalidate every 60 seconds - new posts appear without redeploy
export const revalidate = 60

function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border border-border rounded-xl p-6 h-64 animate-pulse bg-card">
          <div className="h-3 bg-muted rounded w-24 mb-4" />
          <div className="h-5 bg-muted rounded w-full mb-2" />
          <div className="h-5 bg-muted rounded w-3/4 mb-4" />
          <div className="h-3.5 bg-muted rounded w-full mb-2" />
          <div className="h-3.5 bg-muted rounded w-full mb-2" />
          <div className="h-3.5 bg-muted rounded w-2/3" />
        </div>
      ))}
    </div>
  )
}

export default async function BlogPage() {
  const isDraft = await isDraftMode()
  const posts = await getBlogPosts(isDraft)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <section className="border-b border-border bg-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-semibold text-3xl md:text-4xl tracking-tight mb-3 text-foreground">
              Tech Blog
            </h1>
            <p className="text-muted-foreground">
              News, reviews, and guides from the Tech Shop team
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
