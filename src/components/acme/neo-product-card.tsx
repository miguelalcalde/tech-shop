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
          className="bg-card border border-border rounded-xl p-4 transition-all duration-200 
                    hover:shadow-md hover:border-foreground/20 h-full flex flex-col"
        >
          {/* Product Image */}
          <div className="relative h-64 mb-4 rounded-lg bg-muted overflow-hidden">
            <Image
              src={image || "/placeholder.svg?height=400&width=400"}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {bestSeller && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2.5 py-1 rounded-md text-xs font-medium">
                Best Seller
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2 flex-grow flex flex-col">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-medium text-base text-foreground flex-1 line-clamp-2 min-h-[3rem]">
                {name}
              </h3>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-semibold text-foreground text-lg whitespace-nowrap">
                  ${price.toFixed(2)}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-xs line-through text-muted-foreground mt-0.5">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{description}</p>

            {/* Add to Cart Button */}
            {onAddToCart && (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  onAddToCart()
                }}
                className="w-full bg-primary text-primary-foreground 
                          hover:bg-primary/90 font-medium text-sm py-5 
                          transition-colors duration-200 rounded-lg mt-auto"
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
