// app/api/leads/become-filer/step1/route.ts
import { NextRequest, NextResponse } from "next/server";
import { becomeFilerStep1Schema } from "@/lib/validations/leads-schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = becomeFilerStep1Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid form data", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const rawBaseUrl = process.env.FASTAPI_INTERNAL_URL;

  if (!rawBaseUrl) {
    console.error(
      "[become-filer-step1-proxy] FASTAPI_INTERNAL_URL is not set. " +
        "Check .env.local and restart the dev server.",
    );
    return NextResponse.json(
      { message: "Server is misconfigured. Please try again shortly." },
      { status: 502 },
    );
  }

  const targetUrl = `${rawBaseUrl.replace(/\/+$/, "")}/api/admin/leads/step1`;

  try {
    const fastapiRes = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        username: parsed.data.username,
        phone: parsed.data.phone,
        city: parsed.data.city,
      }),
      cache: "no-store",
    });

    const contentType = fastapiRes.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const text = await fastapiRes.text();
      console.error(
        `[become-filer-step1-proxy] Non-JSON response from ${targetUrl} ` +
          `(status ${fastapiRes.status}):`,
        text.slice(0, 500),
      );
      return NextResponse.json(
        { message: "Backend returned an unexpected response. Please try again." },
        { status: 502 },
      );
    }

    const data = await fastapiRes.json();

    if (!fastapiRes.ok) {
      return NextResponse.json(
        { message: data.detail ?? "Failed to save your details" },
        { status: fastapiRes.status },
      );
    }

    // Pass the backend's row straight through — the frontend needs data.id
    // as the lead_id for step 2.
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(`[become-filer-step1-proxy] Failed to reach ${targetUrl}`, error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}