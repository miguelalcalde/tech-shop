import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  getAllBlogPostSlugs,
  getBlogPostBySlug,
} from "@/lib/sanity/queries/blog"
import { isDraftMode } from "@/lib/is-draft-mode"

// Force static generation - Draft Mode will automatically switch to dynamic when enabled
export const dynamic = "force-static"

// ISR: Revalidate every 60 seconds - new posts appear without redeploy
export const revalidate = 60

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const isDraft = await isDraftMode()
  const post = await getBlogPostBySlug(slug, isDraft)

  if (!post) {
    return {
      title: "Post Not Found | ACME Tech Shop",
    }
  }

  return {
    title: `${post.title} | ACME Tech Shop Blog`,
    description: post.extract,
  }
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  // Use simple slug fetcher - no draft mode check needed at build time
  const slugs = await getAllBlogPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const isDraft = await isDraftMode()
  const post = await getBlogPostBySlug(slug, isDraft)

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        <article>
          <header className="py-16 bg-secondary border-b border-border">
            <div className="container px-4 mx-auto max-w-4xl">
              <Link
                href="/blog"
                className="inline-flex items-center mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Blog
              </Link>

              <h1
                className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl text-foreground"
                data-sanity-edit-target
              >
                {post.title}
              </h1>

              <div className="flex gap-4 items-center text-sm">
                <span className="text-muted-foreground">
                  {formattedDate}
                </span>
                <span className="text-muted-foreground/60" data-sanity-edit-target>by {post.author}</span>
              </div>
            </div>
          </header>

          <div className="container px-4 py-16 mx-auto max-w-4xl">
            <div className="p-8 bg-card border border-border rounded-xl md:p-12">
              {/* Extract section for Edit Mode */}
              {post.extract && (
                <div
                  className="pb-8 mb-8 text-lg text-foreground/80 border-b border-border leading-relaxed"
                  data-sanity-edit-target
                >
                  {post.extract}
                </div>
              )}

              {/* Body content with field ID for Edit Mode */}
              <div
                className="max-w-none prose prose-lg text-foreground"
                data-sanity-edit-target
              >
                {post.body
                  .split("\n\n")
                  .map((paragraph: string, index: number) => {
                    if (paragraph.startsWith("## ")) {
                      return (
                        <h2
                          key={index}
                          className="pb-2 mt-8 mb-4 text-xl font-semibold border-b border-border text-foreground"
                        >
                          {paragraph.replace("## ", "")}
                        </h2>
                      )
                    }

                    if (
                      paragraph.startsWith("**") &&
                      paragraph.endsWith("**")
                    ) {
                      return (
                        <h3
                          key={index}
                          className="mt-6 mb-3 text-lg font-medium text-foreground"
                        >
                          {paragraph.replace(/\*\*/g, "")}
                        </h3>
                      )
                    }

                    if (
                      paragraph.startsWith("- ") ||
                      paragraph.startsWith("* ")
                    ) {
                      const items = paragraph.split("\n")
                      return (
                        <ul key={index} className="my-4 space-y-2 list-none">
                          {items.map((item: string, i: number) => (
                            <li
                              key={i}
                              className="pl-5 relative text-muted-foreground before:content-['-'] before:absolute before:left-0 before:text-foreground/30"
                            >
                              {item.replace(/^[-*]\s/, "")}
                            </li>
                          ))}
                        </ul>
                      )
                    }

                    if (paragraph.match(/^\d+\.\s/)) {
                      const items = paragraph.split("\n")

                      return (
                        <ol key={index} className="my-4 space-y-2 list-none">
                          {items.map((item: string, i: number) => {
                            return (
                              <li key={i} className="relative pl-8 text-muted-foreground">
                                <span className="flex absolute left-0 justify-center items-center w-6 h-6 text-xs font-medium bg-muted text-muted-foreground rounded-md">
                                  {i + 1}
                                </span>
                                {item.replace(/^\d+\.\s+/g, "")}
                              </li>
                            )
                          })}
                        </ol>
                      )
                    }

                    return (
                      <p key={index} className="my-4 leading-relaxed text-muted-foreground">
                        {paragraph
                          .split(/(\*\*[^*]+\*\*)/)
                          .map((part: string, i: number) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return (
                                <strong key={i} className="font-medium text-foreground">
                                  {part.replace(/\*\*/g, "")}
                                </strong>
                              )
                            }
                            return part
                          })}
                      </p>
                    )
                  })}
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-block px-6 py-2.5 font-medium text-sm text-primary-foreground bg-primary rounded-lg transition-colors duration-200 hover:bg-primary/90"
              >
                Back to All Posts
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
