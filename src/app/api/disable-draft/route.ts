import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  // Redirect to the referrer or home page
  const referer = request.headers.get("referer") || "/blog";
  redirect(referer);
}
