import Header from "@/components/header"
import Footer from "@/components/footer"
import CartContent from "./_components/cart-content"

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <CartContent />
      </main>
      <Footer />
    </div>
  )
}
