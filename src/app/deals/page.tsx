import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata = {
  title: "Deals | ACME Tech Shop",
  description: "Discover the latest deals and discounts on cutting-edge technology.",
}

export default function DealsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        <section className="border-b-4 border-black bg-yellow-400 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-black text-5xl md:text-6xl uppercase tracking-tight mb-4 border-4 border-black inline-block px-8 py-4 bg-white">
              Deals
            </h1>
            <p className="font-mono text-lg uppercase mt-6">
              Hot Discounts on Premium Tech
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="border-4 border-black p-12 bg-white inline-block">
              <p className="font-mono text-xl uppercase mb-4">
                🔥 No Active Deals Right Now
              </p>
              <p className="font-mono text-gray-600">
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
