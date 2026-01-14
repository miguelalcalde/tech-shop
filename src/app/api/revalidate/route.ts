import { revalidatePath, revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { parseBody } from "next-sanity/webhook"

// Secret to validate webhook requests from Sanity
const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET

type WebhookPayload = {
  _type: string
  slug?: { current: string }
}

export async function POST(request: NextRequest) {
  try {
    // If no secret is configured, reject all requests
    if (!SANITY_REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: "Missing SANITY_REVALIDATE_SECRET environment variable" },
        { status: 500 }
      )
    }

    // Parse and verify the webhook payload
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      request,
      SANITY_REVALIDATE_SECRET
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      )
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Missing document type" },
        { status: 400 }
      )
    }

    // Revalidate based on document type
    switch (body._type) {
      case "post":
        // Revalidate the blog index page
        revalidatePath("/blog")
        
        // If slug is provided, revalidate the specific post page
        if (body.slug?.current) {
          revalidatePath(`/blog/${body.slug.current}`)
        }
        
        // Also revalidate by tag if you use tags
        revalidateTag("posts")
        break

      case "author":
        // Authors appear on blog posts, revalidate all blog content
        revalidatePath("/blog")
        revalidateTag("posts")
        break

      default:
        // For other types, you can add more cases or do a general revalidation
        console.log(`Unhandled document type: ${body._type}`)
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (error) {
    console.error("Revalidation error:", error)
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    )
  }
}
