"use client"

import { useCartStore } from "@/store/cartStore"
import { Button } from "@/components/acme"
import { ShoppingCart, Trash2, X } from "lucide-react"
import Link from "next/link"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

export default function CartPopover() {
  const { items, removeItem, getTotalItems, getTotalPrice } = useCartStore()
  const [open, setOpen] = useState(false)
  const totalItems = getTotalItems()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative cursor-pointer p-2 hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-black"
          aria-label="Open cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black border-2 border-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">
              {totalItems}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0 border-4 border-black rounded-none bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        align="end"
        sideOffset={12}
      >
        <div className="border-b-4 border-black bg-black text-white p-4 flex items-center justify-between">
          <h3 className="font-black text-lg uppercase tracking-tight">
            Your Cart
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="hover:bg-white/20 p-1 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="font-mono text-sm uppercase text-gray-500">
              Your cart is empty
            </p>
            <Link href="/" onClick={() => setOpen(false)}>
              <Button className="mt-4 bg-black text-white border-2 border-black px-4 py-2 font-bold uppercase text-sm rounded-none hover:bg-yellow-400 hover:text-black transition-colors">
                Shop Now
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-b-2 border-black last:border-b-0 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm uppercase truncate">
                      {item.name}
                    </h4>
                    <p className="font-mono text-xs text-gray-600">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>

                  <span className="font-black text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 bg-red-500 text-white border-2 border-black hover:bg-red-600 transition-colors"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t-4 border-black bg-yellow-400 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold uppercase text-sm">Total</span>
                <span className="font-black text-xl">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/cart"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  <Button className="w-full bg-white text-black border-2 border-black py-2.5 font-bold uppercase text-sm rounded-none hover:bg-gray-100 transition-colors">
                    View Cart
                  </Button>
                </Link>

                <Link
                  href="/checkout"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  <Button className="w-full bg-black text-white border-2 border-black py-2.5 font-bold uppercase text-sm rounded-none hover:bg-gray-800 transition-colors">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
