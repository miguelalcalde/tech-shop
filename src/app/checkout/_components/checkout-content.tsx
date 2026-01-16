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
          className="inline-flex items-center gap-2 font-bold uppercase text-sm hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
      </div>

      <h1 className="font-black text-4xl uppercase mb-8 border-4 border-black block px-8 py-4 w-fit">
        Checkout
      </h1>

      {items.length === 0 ? (
        <div className="border-4 border-black p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-400" />
          <p className="font-mono text-xl uppercase mb-6">Your cart is empty.</p>
          <Link href="/">
            <Button className="bg-black text-white border-4 border-black px-8 py-4 font-black uppercase rounded-none hover:bg-yellow-400 hover:text-black transition-colors">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="border-4 border-black bg-white">
              <div className="bg-black text-white p-4">
                <h2 className="font-black text-lg uppercase">Contact Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-bold uppercase text-sm mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border-4 border-black bg-white">
              <div className="bg-black text-white p-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <h2 className="font-black text-lg uppercase">Shipping Address</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2">Address</label>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Apt 4B"
                    className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2">City</label>
                    <input
                      type="text"
                      placeholder="New York"
                      className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2">State</label>
                    <input
                      type="text"
                      placeholder="NY"
                      className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2">ZIP Code</label>
                    <input
                      type="text"
                      placeholder="10001"
                      className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="border-4 border-black bg-white">
              <div className="bg-black text-white p-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <h2 className="font-black text-lg uppercase">Payment</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-bold uppercase text-sm mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2">Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full border-4 border-black px-4 py-3 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border-4 border-black bg-white sticky top-24">
              <div className="bg-black text-white p-4">
                <h2 className="font-black text-lg uppercase">Order Summary</h2>
              </div>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto border-b-4 border-black">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border-b-2 border-gray-200 last:border-b-0 flex justify-between items-center"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm uppercase truncate">{item.name}</p>
                      <p className="font-mono text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-black text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between font-mono text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-mono text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-mono text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t-4 border-black bg-yellow-400 p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-lg uppercase">Total</span>
                  <span className="font-black text-2xl">${total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-black text-white border-4 border-black py-4 font-black uppercase rounded-none hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>

                {shipping === 0 && (
                  <p className="text-center font-mono text-xs mt-3 uppercase">
                    🎉 You qualify for free shipping!
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

