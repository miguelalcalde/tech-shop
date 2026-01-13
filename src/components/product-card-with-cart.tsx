"use client"

import { NeoProductCard } from "@/components/acme"
import { Product } from "@/types"
import { useCartStore } from "@/store/cartStore"

interface ProductCardWithCartProps {
  product: Product
}

export default function ProductCardWithCart({ product }: ProductCardWithCartProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({ ...product, quantity: 1 })
  }

  return (
    <NeoProductCard
      id={product.id}
      name={product.name}
      description={product.description}
      price={product.price}
      originalPrice={product.originalPrice}
      image={product.image}
      bestSeller={product.bestSeller}
      onAddToCart={handleAddToCart}
    />
  )
}

