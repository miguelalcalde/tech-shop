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
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="border-b border-border">
          <Hero
            title="Tech Shop"
            subtitle="Beautifully designed technology, curated for you. Discover our latest collection of premium gadgets and accessories."
            ctaText="Shop Now"
            ctaHref="#products"
          />
        </section>

        {/* Featured Products Section */}
        <section id="products" className="container mx-auto px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="font-semibold text-2xl md:text-3xl tracking-tight mb-3 text-foreground">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-base">
              Discover our latest tech collection
            </p>
          </div>
          <ProductGrid />
        </section>

        {/* Blog Preview Section */}
        <Suspense
          fallback={
            <section className="bg-secondary border-y border-border py-16">
              <div className="container mx-auto px-4">
                <h2 className="font-semibold text-2xl mb-10 text-foreground">
                  Latest from the Blog
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-card border border-border rounded-xl p-6 h-64 animate-pulse"
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
        <section className="border-y border-border py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-semibold text-2xl mb-3 text-foreground">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Get the latest deals and tech news delivered to your inbox
            </p>
            <div className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              />
              <Button className="bg-primary text-primary-foreground px-6 py-2.5 font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors">
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
