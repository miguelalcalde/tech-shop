import { NextRequest, NextResponse } from "next/server";
import { invalidateProductCacheAction } from "@/actions/cache-actions";

// This API endpoint handles Contentful webhook payloads to update product cache
export async function POST(request: NextRequest) {
  try {
    // Debug: Log the request body
    // console.log(
    //   "Received update-product webhook payload:",
    //   await request.clone().text()
    // );

    let id: string | undefined;

    // Extract ID from Contentful webhook payload
    if (
      request.headers.get("content-type")?.includes("application/json") ||
      request.headers
        .get("content-type")
        ?.includes("application/vnd.contentful.management.v1+json")
    ) {
      const payload = await request.json();

      // Debug: Log the parsed payload
      // console.log("Parsed payload:", JSON.stringify(payload, null, 2));

      // Example payload structure:
      // {
      //   "sys": {
      //     "id": "entry-id",
      //     "type": "Entry",
      //     "contentType": { "sys": { "id": "product" } }
      //   },
      //   "fields": {
      //     "id": { "en-US": "product-id" }
      //   }
      // }

      if (
        payload.sys?.type === "Entry" &&
        payload.sys?.contentType?.sys?.id === "product"
      ) {
        // If payload contains the product ID field in fields.id
        if (payload.fields?.id) {
          // Get the product ID from the localized field (assuming default locale is used)
          const locale = Object.keys(payload.fields.id)[0];
          id = payload.fields.id[locale];
          console.log(`Extracted product ID from fields: ${id}`);
        } else {
          // Fallback to the Contentful entry ID
          id = payload.sys.id;
          console.log(`Using Contentful entry ID as fallback: ${id}`);
        }
      } else {
        console.log("Payload is not a product entry:", payload.sys);
      }
    } else {
      console.log(
        "Request doesn't contain JSON content type:",
        request.headers.get("content-type")
      );
    }

    if (!id) {
      console.log("No product ID found in the request");
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Use the server action to invalidate the cache
    console.log(`Invalidating cache for product ID: ${id}`);
    const result = await invalidateProductCacheAction(id);

    if (!result.isSuccess) {
      console.log(`Cache invalidation failed: ${result.message}`);
      return NextResponse.json(
        {
          revalidated: false,
          message: result.message,
        },
        { status: 500 }
      );
    }

    console.log(`Successfully revalidated cache for product ID: ${id}`);
    return NextResponse.json(
      {
        revalidated: true,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        revalidated: false,
        message: "Failed to process request",
      },
      { status: 500 }
    );
  }
}

// Optionally add a GET method for testing
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message:
        "This endpoint only accepts POST requests from Contentful webhooks",
    },
    { status: 405 }
  );
}
