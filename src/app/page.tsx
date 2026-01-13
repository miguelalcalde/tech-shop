import { Suspense } from "react"
import { Hero, Button } from "@/components/acme"
import ProductGrid from "@/components/product-grid"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogPreview from "@/components/blog-preview"

// Enable ISR for Draft Mode support in Vercel Toolbar
export const revalidate = 60

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="border-b-4 border-black">
          <Hero
            title="TECH SHOP"
            subtitle="BRUTALIST DESIGN MEETS CUTTING-EDGE TECHNOLOGY"
            ctaText="SHOP NOW"
            ctaHref="#products"
          />
        </section>

        {/* Featured Products Section */}
        <section id="products" className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="font-black text-4xl md:text-5xl uppercase tracking-tight mb-4 border-4 border-black inline-block px-8 py-4">
              Featured Products
            </h2>
            <p className="font-mono text-lg uppercase mt-4">
              Discover Our Latest Tech Collection
            </p>
          </div>
          <ProductGrid />
        </section>

        {/* Blog Preview Section */}
        <Suspense
          fallback={
            <section className="bg-yellow-400 border-y-4 border-black py-16">
              <div className="container mx-auto px-4">
                <h2 className="font-black text-4xl uppercase mb-12">
                  Latest from the Blog
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white border-4 border-black p-6 h-64 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </section>
          }
        >
          <BlogPreview />
        </Suspense>

        {/* Newsletter CTA */}
        <section className="border-y-4 border-black py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-black text-4xl uppercase mb-4">Stay Updated</h2>
            <p className="font-mono text-lg mb-8">
              Get the latest deals and tech news delivered to your inbox
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
              <Button className="bg-black text-white border-4 border-black px-8 py-3 font-black uppercase rounded-none hover:bg-yellow-400 hover:text-black transition-colors">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
