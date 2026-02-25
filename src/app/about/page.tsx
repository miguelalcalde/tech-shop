import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata = {
  title: "About | ACME Tech Shop",
  description: "Learn more about ACME Tech Shop - your destination for cutting-edge technology.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        <section className="border-b border-border bg-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-semibold text-3xl md:text-4xl tracking-tight mb-3 text-foreground">
              About Us
            </h1>
            <p className="text-muted-foreground">
              Quality technology, thoughtfully curated
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border border-border rounded-xl p-8 bg-card">
              <h2 className="font-medium text-lg mb-4 pb-4 border-b border-border text-foreground">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At ACME Tech Shop, we believe technology should be accessible, 
                powerful, and beautifully designed. We curate the finest tech 
                products that combine form and function.
              </p>
            </div>

            <div className="border border-border rounded-xl p-8 bg-card">
              <h2 className="font-medium text-lg mb-4 pb-4 border-b border-border text-foreground">
                Why Choose Us
              </h2>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-foreground/40 mt-0.5">-</span>
                  <span>Carefully curated selection of premium tech products</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-foreground/40 mt-0.5">-</span>
                  <span>Expert reviews and buying guides</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-foreground/40 mt-0.5">-</span>
                  <span>Fast, reliable shipping worldwide</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-foreground/40 mt-0.5">-</span>
                  <span>Dedicated customer support</span>
                </li>
              </ul>
            </div>

            <div className="border border-border rounded-xl p-8 bg-secondary">
              <h2 className="font-medium text-lg mb-4 pb-4 border-b border-border text-foreground">
                Get In Touch
              </h2>
              <p className="text-muted-foreground">
                Have questions? We&apos;d love to hear from you.
              </p>
              <p className="text-muted-foreground mt-2">
                Email us at{" "}
                <span className="font-medium text-foreground underline underline-offset-4">hello@acme.tech</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
