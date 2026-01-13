"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { ActionState } from "@/types";

/**
 * Server action to invalidate product cache using tags
 * @param productId The ID of the product to invalidate
 * @returns ActionState indicating success or failure
 */
export async function invalidateProductCacheAction(
  productId: string
): Promise<ActionState<void>> {
  try {
    if (!productId) {
      return {
        isSuccess: false,
        message: "Product ID is required",
      };
    }

    // Revalidate the product-specific cache tag
    revalidateTag(`product-${productId}`);

    // Also revalidate the general products tag
    revalidateTag("products");

    // Revalidate the product path
    revalidatePath(`/product/${productId}`);

    return {
      isSuccess: true,
      message: `Product ${productId} cache has been revalidated`,
      data: undefined,
    };
  } catch (error) {
    console.error("Error revalidating product cache:", error);
    return {
      isSuccess: false,
      message: "Failed to revalidate cache",
    };
  }
}

