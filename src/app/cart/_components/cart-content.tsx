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
      <h1 className="font-black text-4xl uppercase mb-8 border-4 border-black inline-block px-8 py-4">
        Your Cart
      </h1>

      {items.length === 0 ? (
        <div className="border-4 border-black p-12 text-center">
          <p className="font-mono text-xl uppercase mb-6">Your cart is empty.</p>
          <Link href="/">
            <Button className="bg-black text-white border-4 border-black px-8 py-4 font-black uppercase rounded-none hover:bg-yellow-400 hover:text-black transition-colors">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="border-4 border-black p-6 bg-white flex justify-between items-center hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              >
                <div className="flex-1">
                  <h2 className="font-black text-xl uppercase mb-2">{item.name}</h2>
                  <p className="font-mono text-base">
                    ${item.price.toFixed(2)} x {item.quantity} = $
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <Button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 text-white border-4 border-black px-4 py-2 font-black uppercase rounded-none hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="border-4 border-black p-6 bg-yellow-400 flex justify-between items-center mb-6">
            <p className="font-black text-2xl uppercase">Total: ${getTotalPrice().toFixed(2)}</p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={clearCart}
              className="bg-red-500 text-white border-4 border-black px-8 py-4 font-black uppercase rounded-none hover:bg-red-600 transition-colors"
            >
              Clear Cart
            </Button>
            <Button
              onClick={handleNextClick}
              className="bg-black text-white border-4 border-black px-8 py-4 font-black uppercase rounded-none hover:bg-yellow-400 hover:text-black transition-colors"
            >
              Checkout
            </Button>
          </div>
        </>
      )}
    </>
  )
}

