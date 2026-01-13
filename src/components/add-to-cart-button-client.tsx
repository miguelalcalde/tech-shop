"use client"

import { Button } from "@/components/acme"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { Product } from "@/types"

interface AddToCartButtonClientProps {
  product: Product
  quantity?: number
  disabled?: boolean
}

export default function AddToCartButtonClient({
  product,
  quantity = 1,
  disabled = false,
}: AddToCartButtonClientProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({ ...product, quantity })
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled}
      className="flex-1 bg-black text-white border-4 border-black py-3 px-6 font-black uppercase rounded-none hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  )
}

