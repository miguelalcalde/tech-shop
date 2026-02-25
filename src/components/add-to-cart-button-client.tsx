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
      className="flex-1 bg-primary text-primary-foreground py-3 px-6 font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
}

