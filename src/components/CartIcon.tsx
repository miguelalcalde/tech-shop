"use client"

import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cartStore"

export default function CartIcon() {
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <div className="relative">
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-black border-2 border-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">
          {totalItems}
        </span>
      )}
    </div>
  )
}
