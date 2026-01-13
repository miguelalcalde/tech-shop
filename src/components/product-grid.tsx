import { Suspense } from "react"
import { SkeletonCard } from "@/components/acme"
import { getContentfulProductsAction } from "@/actions/contentful-actions"
import { Product } from "@/types"
import ProductCardWithCart from "./product-card-with-cart"

interface ProductGridProps {
  products: Product[]
}

function ProductGridContent({ products }: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCardWithCart key={product.id} product={product} />
      ))}
    </div>
  )
}

async function CachedProductGrid() {
  "use cache"
  const { isSuccess, data, message } = await getContentfulProductsAction()

  if (!isSuccess) {
    return (
      <div className="p-4 font-bold text-center text-red-500 uppercase border-4 border-red-500">
        {message}
      </div>
    )
  }

  return <ProductGridContent products={data.products} />
}

export default function ProductGrid() {
  return (
    <Suspense
      fallback={
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      }
    >
      <CachedProductGrid />
    </Suspense>
  )
}
