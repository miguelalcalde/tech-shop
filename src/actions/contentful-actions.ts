import { ActionState, ProductData, Product } from "@/types";
import {
  contentfulClient,
  mapContentfulProduct,
  ContentfulProduct,
} from "@/lib/contentful";

export async function getContentfulProductsAction(): Promise<
  ActionState<ProductData>
> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "product",
      include: 2,
    });

    const products = entries.items.map((item) =>
      mapContentfulProduct(item as unknown as ContentfulProduct)
    );

    return {
      isSuccess: true,
      message: "Contentful products fetched successfully",
      data: { products },
    };
  } catch (error) {
    console.error("Error fetching Contentful products:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch products from Contentful",
    };
  }
}

export async function getContentfulProductByIdAction(
  id: string
): Promise<ActionState<{ product: Product }>> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "product",
      "fields.id": id,
      include: 2,
    });

    if (entries.items.length === 0) {
      return {
        isSuccess: false,
        message: "Product not found",
      };
    }

    const product = mapContentfulProduct(entries.items[0] as unknown as ContentfulProduct);

    return {
      isSuccess: true,
      message: "Contentful product fetched successfully",
      data: { product },
    };
  } catch (error) {
    console.error("Error fetching Contentful product:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch product from Contentful",
    };
  }
}
