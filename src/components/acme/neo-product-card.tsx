"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface NeoProductCardProps {
  id: string | number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  bestSeller?: boolean
  className?: string
  onAddToCart?: () => void
}

export function NeoProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  bestSeller,
  className,
  onAddToCart,
}: NeoProductCardProps) {
  const productLink = `/product/${id}`

  return (
    <div className={cn("h-full", className)}>
      <Link href={productLink} className="block h-full">
        <div
          className="bg-white border-4 border-black p-4 transition-all duration-200 
                    hover:translate-x-[-8px] hover:translate-y-[-8px] 
                    hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col"
        >
          {/* Product Image */}
          <div className="relative h-64 mb-4 border-4 border-black overflow-hidden">
            <Image
              src={image || "/placeholder.svg?height=400&width=400"}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {bestSeller && (
              <div className="absolute top-2 right-2 bg-yellow-400 border-2 border-black px-2 py-1 font-black text-xs uppercase">
                Best Seller
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3 flex-grow flex flex-col">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-black text-xl uppercase tracking-tight flex-1 line-clamp-2 min-h-[3.5rem]">
                {name}
              </h3>
              <div className="flex flex-col items-end shrink-0">
                <span className="bg-yellow-400 border-2 border-black px-3 py-1 font-bold text-lg whitespace-nowrap">
                  ${price.toFixed(2)}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-xs line-through text-gray-500 mt-1">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <p className="font-mono text-sm line-clamp-2 min-h-[2.5rem]">{description}</p>

            {/* Add to Cart Button */}
            {onAddToCart && (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  onAddToCart()
                }}
                className="w-full bg-black text-white border-2 border-black 
                          hover:bg-white hover:text-black font-bold text-lg py-6 
                          transition-colors duration-200 rounded-none uppercase mt-auto"
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
