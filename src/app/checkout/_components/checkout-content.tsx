"use client"

import { useCartStore } from "@/store/cartStore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/acme"
import { ArrowLeft, CreditCard, Truck, ShoppingBag } from "lucide-react"
import { useState } from "react"

export default function CheckoutContent() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    clearCart()
    router.push("/")
    // In a real app, you would redirect to an order confirmation page
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <>
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
      </div>

      <h1 className="font-semibold text-2xl mb-8 text-foreground">
        Checkout
      </h1>

      {items.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center bg-card">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-muted-foreground mb-6">Your cart is empty.</p>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground px-6 py-2.5 font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-medium text-base text-foreground">Contact Information</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-medium text-base text-foreground">Shipping Address</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Address</label>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Apt 4B"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">City</label>
                    <input
                      type="text"
                      placeholder="New York"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">State</label>
                    <input
                      type="text"
                      placeholder="NY"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">ZIP Code</label>
                    <input
                      type="text"
                      placeholder="10001"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-medium text-base text-foreground">Payment</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-xl bg-card sticky top-24 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-medium text-base text-foreground">Order Summary</h2>
              </div>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto border-b border-border">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="px-5 py-3 border-b border-border last:border-b-0 flex justify-between items-center"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-sm text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-border px-5 py-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-semibold text-lg text-foreground">${total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-primary text-primary-foreground py-2.5 font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>

                {shipping === 0 && (
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    You qualify for free shipping
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

