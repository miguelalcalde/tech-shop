import Image from "next/image"
import { notFound } from "next/navigation"
import { Heart, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getContentfulProductByIdAction, getContentfulProductsAction } from "@/actions/contentful-actions"
import ProductCardWithCart from "@/components/product-card-with-cart"
import AddToCartButtonClient from "@/components/add-to-cart-button-client"
import { Product } from "@/types"

// Set revalidation period (in seconds) for ISR
export const revalidate = 30

// Pre-render these paths at build time
export async function generateStaticParams() {
  const { isSuccess, data } = await getContentfulProductsAction()

  if (!isSuccess || !data?.products) {
    return []
  }

  return data.products.map((product) => ({
    id: String(product.id),
  }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!id) {
    notFound()
  }

  const { isSuccess, data, message } = await getContentfulProductByIdAction(id)

  if (!isSuccess || !data?.product) {
    notFound()
  }

  const product = data.product

  // Get related products (excluding current product)
  const { isSuccess: productsSuccess, data: productsData } = await getContentfulProductsAction()
  const relatedProducts = productsSuccess && productsData?.products
    ? productsData.products.filter((p) => p.id !== product.id).slice(0, 4)
    : []

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Product Image */}
          <div className="w-full md:w-1/2 relative h-[500px] bg-muted rounded-xl overflow-hidden">
            <Image
              src={product.image || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 border border-border rounded-xl p-8 bg-card">
            <div className="flex justify-between items-start mb-4">
              <h1 className="font-semibold text-2xl tracking-tight flex-1 pr-4 text-foreground">
                {product.name}
              </h1>
              <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4"
                    fill={star <= 4 ? "currentColor" : "none"}
                    color={star <= 4 ? "hsl(var(--foreground))" : "hsl(var(--muted))"}
                  />
                ))}
              </div>
              <span className="ml-2 text-xs text-muted-foreground">(42 reviews)</span>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-semibold text-2xl text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base line-through text-muted-foreground">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="mb-6 border border-border rounded-lg p-4 bg-muted/30">
              <p className="text-sm mb-1 text-foreground">
                Availability:{" "}
                <span className={product.stock > 0 ? "text-foreground font-medium" : "text-destructive font-medium"}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Category: <span className="font-medium text-foreground">{product.category}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <AddToCartButtonClient
                product={product}
                quantity={1}
                disabled={product.stock <= 0}
              />
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12 mb-12 border border-border rounded-xl p-8 bg-card">
          <h2 className="font-semibold text-xl mb-6 pb-4 border-b border-border text-foreground">
            Product Details
          </h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <h3 className="font-medium text-base mb-4 text-foreground">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-foreground/40">-</span> Premium Quality Materials</li>
                <li className="flex items-start gap-2"><span className="text-foreground/40">-</span> Latest Technology</li>
                <li className="flex items-start gap-2"><span className="text-foreground/40">-</span> Warranty Included</li>
              </ul>
            </div>
            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <h3 className="font-medium text-base mb-4 text-foreground">Specifications</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Dimensions:</span> 10 x 5 x 2 inches
                </li>
                <li>
                  <span className="font-medium text-foreground">Weight:</span> 2 lbs
                </li>
                <li>
                  <span className="font-medium text-foreground">Material:</span> Aluminum
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-semibold text-xl mb-8 text-foreground">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: Product) => (
                <ProductCardWithCart key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
