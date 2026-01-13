import Header from "@/components/header"
import Footer from "@/components/footer"
import CheckoutContent from "./_components/checkout-content"

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <CheckoutContent />
      </main>
      <Footer />
    </div>
  )
}
