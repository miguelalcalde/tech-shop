import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata = {
  title: "About | ACME Tech Shop",
  description: "Learn more about ACME Tech Shop - your destination for cutting-edge technology.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        <section className="border-b-4 border-black bg-yellow-400 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-black text-5xl md:text-6xl uppercase tracking-tight mb-4 border-4 border-black inline-block px-8 py-4 bg-white">
              About Us
            </h1>
            <p className="font-mono text-lg uppercase mt-6">
              Brutalist Design Meets Cutting-Edge Technology
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="border-4 border-black p-8 bg-white mb-8">
              <h2 className="font-black text-2xl uppercase mb-4 border-b-4 border-black pb-4">
                Our Mission
              </h2>
              <p className="font-mono text-lg leading-relaxed">
                At ACME Tech Shop, we believe technology should be accessible, 
                powerful, and beautifully designed. We curate the finest tech 
                products that combine form and function.
              </p>
            </div>

            <div className="border-4 border-black p-8 bg-white mb-8">
              <h2 className="font-black text-2xl uppercase mb-4 border-b-4 border-black pb-4">
                Why Choose Us
              </h2>
              <ul className="font-mono text-lg space-y-4">
                <li className="flex items-start gap-3">
                  <span className="font-black">→</span>
                  <span>Carefully curated selection of premium tech products</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black">→</span>
                  <span>Expert reviews and buying guides</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black">→</span>
                  <span>Fast, reliable shipping worldwide</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-black">→</span>
                  <span>Dedicated customer support</span>
                </li>
              </ul>
            </div>

            <div className="border-4 border-black p-8 bg-yellow-400">
              <h2 className="font-black text-2xl uppercase mb-4 border-b-4 border-black pb-4">
                Get In Touch
              </h2>
              <p className="font-mono text-lg">
                Have questions? We&apos;d love to hear from you.
              </p>
              <p className="font-mono text-lg mt-2">
                Email us at{" "}
                <span className="font-black underline">hello@acme.tech</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
