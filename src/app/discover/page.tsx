import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CategoryCard } from "@/components/discover/category-card"
import { FeaturedBanner } from "@/components/discover/featured-banner"
import { TrendCard } from "@/components/discover/trend-card"
import { SkeletonCard } from "@/components/acme"
import ProductGrid from "@/components/product-grid"

export const metadata = {
  title: "Discover | ACME Tech Shop",
  description:
    "Explore curated categories, trending tech, and featured collections at ACME Tech Shop.",
}

const categories = [
  {
    title: "Audio",
    description: "Premium headphones, earbuds, and speakers for every listener.",
    image: "/images/discover-audio.jpg",
    href: "/search/audio",
    productCount: 24,
  },
  {
    title: "Laptops",
    description: "Powerful machines for work, play, and everything in between.",
    image: "/images/discover-laptops.jpg",
    href: "/search/laptops",
    productCount: 18,
  },
  {
    title: "Wearables",
    description: "Smartwatches and fitness trackers to keep you connected.",
    image: "/images/discover-wearables.jpg",
    href: "/search/wearables",
    productCount: 12,
  },
  {
    title: "Gaming",
    description: "Controllers, peripherals, and gear for serious gamers.",
    image: "/images/discover-gaming.jpg",
    href: "/search/gaming",
    productCount: 31,
  },
  {
    title: "Smart Home",
    description: "Automate and elevate your living space with smart devices.",
    image: "/images/discover-smart-home.jpg",
    href: "/search/smart-home",
    productCount: 15,
  },
  {
    title: "Accessories",
    description: "Cables, cases, chargers, and the essentials you need.",
    image: "/images/discover-accessories.jpg",
    href: "/search/accessories",
    productCount: 42,
  },
]

const trends = [
  {
    number: "01",
    title: "AI-Powered Devices",
    description:
      "Smart assistants and AI-enhanced gadgets are reshaping how we interact with technology.",
    href: "/search/ai",
  },
  {
    number: "02",
    title: "Sustainable Tech",
    description:
      "Eco-friendly materials and energy-efficient designs leading the charge.",
    href: "/search/sustainable",
  },
  {
    number: "03",
    title: "Spatial Computing",
    description:
      "Mixed reality headsets and spatial interfaces are the next frontier.",
    href: "/search/spatial",
  },
  {
    number: "04",
    title: "USB-C Everything",
    description:
      "Universal connectivity is finally here. One cable to rule them all.",
    href: "/search/usb-c",
  },
]

export default function DiscoverPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="border-b-4 border-foreground bg-card">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl">
              <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Explore the catalogue
              </p>
              <h1 className="font-black text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-none mb-6 text-balance">
                Discover
              </h1>
              <p className="font-mono text-lg md:text-xl uppercase tracking-wide text-muted-foreground max-w-xl">
                Browse curated categories, trending tech, and hand-picked
                collections from the ACME catalogue.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-12">
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight mb-2">
              Shop by Category
            </h2>
            <p className="font-mono text-sm uppercase text-muted-foreground">
              Find exactly what you are looking for
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>
        </section>

        {/* Featured Banner */}
        <section className="container mx-auto px-4 pb-16">
          <FeaturedBanner
            title="New Arrivals Drop"
            subtitle="Fresh tech just landed. Be the first to get your hands on the latest releases."
            ctaText="Shop New"
            ctaHref="/search/new"
            accent="yellow"
          />
        </section>

        {/* Trending Section */}
        <section className="border-y-4 border-foreground bg-secondary py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight mb-2">
                Trending Now
              </h2>
              <p className="font-mono text-sm uppercase text-muted-foreground">
                What the tech world is talking about
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trends.map((trend) => (
                <TrendCard key={trend.number} {...trend} />
              ))}
            </div>
          </div>
        </section>

        {/* Staff Picks - Reusing Product Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight mb-2 border-4 border-foreground inline-block px-8 py-4">
              Staff Picks
            </h2>
            <p className="font-mono text-sm uppercase text-muted-foreground mt-4">
              Hand-selected favorites from the ACME team
            </p>
          </div>
          <Suspense
            fallback={
              <div className="product-grid">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            }
          >
            <ProductGrid />
          </Suspense>
        </section>

        {/* Second Featured Banner */}
        <section className="container mx-auto px-4 pb-16">
          <FeaturedBanner
            title="Got Questions?"
            subtitle="Our tech experts are standing by to help you find the perfect product."
            ctaText="Contact Us"
            ctaHref="/about"
            accent="cyan"
          />
        </section>
      </main>

      <Footer />
    </div>
  )
}
