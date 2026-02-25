import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata = {
  title: "Deals | ACME Tech Shop",
  description: "Discover the latest deals and discounts on cutting-edge technology.",
}

export default function DealsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        <section className="border-b border-border bg-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-semibold text-3xl md:text-4xl tracking-tight mb-3 text-foreground">
              Deals
            </h1>
            <p className="text-muted-foreground">
              Exclusive discounts on premium tech
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="border border-border rounded-xl p-12 bg-card inline-block">
              <p className="text-lg mb-3 text-foreground">
                No Active Deals Right Now
              </p>
              <p className="text-muted-foreground">
                Check back soon for exclusive discounts and promotions.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
