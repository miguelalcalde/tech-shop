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
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        <article>
          <header className="py-16 bg-yellow-400 border-b-4 border-black">
            <div className="container px-4 mx-auto max-w-4xl">
              <Link
                href="/blog"
                className="inline-flex items-center mb-6 text-sm font-black uppercase hover:underline"
              >
                ← Back to Blog
              </Link>

              <h1
                className="mb-6 text-4xl font-black tracking-tight uppercase md:text-5xl"
                data-sanity-edit-target
              >
                {post.title}
              </h1>

              <div className="flex gap-4 items-center font-mono text-sm">
                <span className="px-3 py-1 font-bold bg-white border-2 border-black">
                  {formattedDate}
                </span>
                <span data-sanity-edit-target>by {post.author}</span>
              </div>
            </div>
          </header>

          <div className="container px-4 py-16 mx-auto max-w-4xl">
            <div className="p-8 bg-white border-4 border-black md:p-12">
              {/* Extract section for Edit Mode */}
              {post.extract && (
                <div
                  className="pb-8 mb-8 text-xl font-bold border-b-4 border-black"
                  data-sanity-edit-target
                >
                  {post.extract}
                </div>
              )}

              {/* Body content with field ID for Edit Mode */}
              <div
                className="max-w-none font-mono prose prose-lg"
                data-sanity-edit-target
              >
                {post.body
                  .split("\n\n")
                  .map((paragraph: string, index: number) => {
                    if (paragraph.startsWith("## ")) {
                      return (
                        <h2
                          key={index}
                          className="pb-2 mt-8 mb-4 text-2xl font-black uppercase border-b-4 border-black"
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
                          className="mt-6 mb-3 text-xl font-black uppercase"
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
                              className="pl-6 relative before:content-['→'] before:absolute before:left-0 before:font-bold"
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
                              <li key={i} className="relative pl-8">
                                <span className="flex absolute left-0 justify-center items-center w-6 h-6 text-sm font-black bg-yellow-400 border-2 border-black">
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
                      <p key={index} className="my-4 leading-relaxed">
                        {paragraph
                          .split(/(\*\*[^*]+\*\*)/)
                          .map((part: string, i: number) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return (
                                <strong key={i} className="font-bold">
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
                className="inline-block px-8 py-4 font-black text-white uppercase bg-black border-4 border-black transition-colors duration-200 hover:bg-yellow-400 hover:text-black"
              >
                ← Back to All Posts
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
