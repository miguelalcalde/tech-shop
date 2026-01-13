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
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link
          href="/"
          className="flex items-center text-black hover:opacity-80 mb-6 font-bold uppercase border-4 border-black px-4 py-2 inline-block hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Products
        </Link>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Product Image */}
          <div className="w-full md:w-1/2 relative h-[500px] bg-white border-4 border-black overflow-hidden">
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
          <div className="w-full md:w-1/2 border-4 border-black p-8 bg-white">
            <div className="flex justify-between items-start mb-4">
              <h1 className="font-black text-4xl uppercase tracking-tight flex-1 pr-4">
                {product.name}
              </h1>
              <button className="text-black hover:opacity-80 transition-opacity border-4 border-black p-2">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5"
                    fill={star <= 4 ? "currentColor" : "none"}
                    color={star <= 4 ? "#FFB800" : "#D1D5DB"}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-mono uppercase">(42 reviews)</span>
            </div>

            <p className="font-mono text-base mb-6">{product.description}</p>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="bg-yellow-400 border-4 border-black px-6 py-3 font-black text-3xl">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg line-through text-gray-500 font-bold">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="mb-6 border-4 border-black p-4 bg-gray-50">
              <p className="font-bold uppercase mb-2">
                Availability:{" "}
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </p>
              <p className="font-mono text-sm uppercase">
                Category: <span className="font-black">{product.category}</span>
              </p>
            </div>

            <div className="flex gap-4">
              <AddToCartButtonClient
                product={product}
                quantity={1}
                disabled={product.stock <= 0}
              />
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12 mb-12 border-4 border-black p-8 bg-white">
          <h2 className="font-black text-3xl uppercase mb-6 border-b-4 border-black pb-4 inline-block">
            Product Details
          </h2>
          <p className="font-mono text-base mb-6">{product.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-4 border-black p-6 bg-yellow-400">
              <h3 className="font-black text-xl uppercase mb-4">Features</h3>
              <ul className="list-disc list-inside space-y-2 font-mono">
                <li>Premium Quality Materials</li>
                <li>Latest Technology</li>
                <li>Warranty Included</li>
              </ul>
            </div>
            <div className="border-4 border-black p-6 bg-cyan-400">
              <h3 className="font-black text-xl uppercase mb-4">Specifications</h3>
              <ul className="space-y-2 font-mono">
                <li>
                  <span className="font-black">Dimensions:</span> 10 x 5 x 2 inches
                </li>
                <li>
                  <span className="font-black">Weight:</span> 2 lbs
                </li>
                <li>
                  <span className="font-black">Material:</span> Aluminum
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-black text-3xl uppercase mb-8 border-4 border-black inline-block px-8 py-4">
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
