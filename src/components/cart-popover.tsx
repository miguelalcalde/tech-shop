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
          className="relative cursor-pointer p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Open cart"
        >
          <ShoppingCart className="w-5 h-5 text-foreground" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-semibold">
              {totalItems}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 border border-border rounded-xl bg-card shadow-lg"
        align="end"
        sideOffset={12}
      >
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h3 className="font-medium text-sm text-foreground">
            Your Cart
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-accent transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Your cart is empty
            </p>
            <Link href="/" onClick={() => setOpen(false)}>
              <Button className="mt-4 bg-primary text-primary-foreground px-4 py-2 font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors">
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
                  className="p-3 border-b border-border last:border-b-0 flex items-center gap-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>

                  <span className="font-semibold text-sm text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-semibold text-foreground">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/cart"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  <Button className="w-full bg-secondary text-secondary-foreground border border-border py-2 font-medium text-sm rounded-lg hover:bg-accent transition-colors">
                    View Cart
                  </Button>
                </Link>

                <Link
                  href="/checkout"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  <Button className="w-full bg-primary text-primary-foreground py-2 font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors">
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
