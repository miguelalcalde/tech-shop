"use client"

import { useCartStore } from "@/store/cartStore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/acme"
import { Trash2 } from "lucide-react"

export default function CartContent() {
  const { items, removeItem, clearCart, getTotalPrice } = useCartStore()
  const router = useRouter()

  const handleNextClick = () => {
    router.push("/checkout")
  }

  return (
    <>
      <h1 className="font-semibold text-2xl mb-8 text-foreground">
        Your Cart
      </h1>

      {items.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center bg-card">
          <p className="text-muted-foreground mb-6">Your cart is empty.</p>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground px-6 py-2.5 font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="border border-border rounded-xl p-5 bg-card flex justify-between items-center hover:shadow-sm transition-all duration-200"
              >
                <div className="flex-1">
                  <h2 className="font-medium text-base text-foreground mb-1">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} x {item.quantity} = $
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <Button
                  onClick={() => removeItem(item.id)}
                  className="bg-destructive/10 text-destructive hover:bg-destructive/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="border border-border rounded-xl p-5 bg-card flex justify-between items-center mb-6">
            <p className="font-semibold text-lg text-foreground">Total: ${getTotalPrice().toFixed(2)}</p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={clearCart}
              className="bg-destructive/10 text-destructive hover:bg-destructive/20 px-6 py-2.5 font-medium text-sm rounded-lg transition-colors"
            >
              Clear Cart
            </Button>
            <Button
              onClick={handleNextClick}
              className="bg-primary text-primary-foreground px-6 py-2.5 font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors"
            >
              Checkout
            </Button>
          </div>
        </>
      )}
    </>
  )
}

