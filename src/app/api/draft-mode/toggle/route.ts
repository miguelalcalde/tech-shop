import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

// Simple toggle for local development only
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 403 });
  }

  const draft = await draftMode();
  
  if (draft.isEnabled) {
    draft.disable();
    return NextResponse.json({ draftMode: false, message: "Draft mode disabled" });
  } else {
    draft.enable();
    return NextResponse.json({ draftMode: true, message: "Draft mode enabled" });
  }
}

