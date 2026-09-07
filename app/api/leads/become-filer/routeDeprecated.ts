// app/api/leads/become-filer/route.ts
import { NextRequest, NextResponse } from "next/server";
// import { becomeFilerFormSchema, getServiceLabelById } from "@/lib/validations/leads-schema";
import { becomeFilerFormSchema } from "@/lib/validations/leads-schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = becomeFilerFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid form data", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot tripped: return the same 201 shape a real success would get so a
  // scripted bot has nothing to learn from and stops retrying, but never call
  // FastAPI — no row created, no trace of the submission.
  //   if (parsed.data.companyWebsite) {
  //     return NextResponse.json(
  //       { ticketId: "N/A", message: "Thanks — we'll be in touch shortly." },
  //       { status: 201 },
  //     );
  //   }

  const rawBaseUrl = process.env.FASTAPI_INTERNAL_URL;

  if (!rawBaseUrl) {
    console.error(
      "[become-filer-lead-proxy] FASTAPI_INTERNAL_URL is not set. " +
      "Check .env.local and restart the dev server (Next.js only reads " +
      "env files at startup).",
    );
    return NextResponse.json(
      { message: "Server is misconfigured. Please try again shortly." },
      { status: 502 },
    );
  }

  // Strip any trailing slash so pasting a new ngrok link with or without one
  // never produces a double-slash path like ".../dev//api/admin/leads".
  const fastapiBaseUrl = rawBaseUrl.replace(/\/+$/, "");
  const targetUrl = `${fastapiBaseUrl}/api/admin/leads`;

  try {
    const fastapiRes = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Free ngrok tunnels serve an HTML warning page to any request
        // that doesn't send this header, before it reaches the actual
        // FastAPI process behind it. Without this, it throws the same
        // "<!DOCTYPE" JSON-parse error again, but from ngrok this time
        // instead of from Next.js's 404 page.
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        // Required by the backend's Pydantic model for validation to pass,
        // but confirmed (via repeated Postman tests, 2026-08-19) that the
        // server ignores both values and generates its own — auto-incrementing
        // id, server-side timestamp. Not a collision risk. Backend won't be
        // changed to split request/response models, so this is the permanent adapter, not a stopgap.
        id: 0,
        created_at: new Date().toISOString(),

        username: parsed.data.username,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        // Sends the display label directly — matches what the backend stores.
        // Tradeoff: renaming a service label later has no stable key linking
        // old and new leads. Backend's call, not changing it here.
        // service_type: getServiceLabelById(parsed.data.service),
        service_type: parsed.data.service_type,
        city: parsed.data.city,
      }),
      cache: "no-store",
    });

    // if something upstream (ngrok, a proxy, FastAPI itself on
    // an error) still returns HTML instead of JSON, fail with a clear
    // message instead of throwing the cryptic "<!DOCTYPE" parse error.
    const contentType = fastapiRes.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const text = await fastapiRes.text();
      console.error(
        `[become-filer-lead-proxy] Non-JSON response from ${targetUrl} ` +
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
        { message: data.detail ?? "Failed to submit request" },
        { status: fastapiRes.status },
      );
    }

    // /api/admin/leads returns the raw created row, not a
    // { ticket_id, message } contract — there is no ticket_id yet. Using the
    // row id as a stand-in rather than fabricating a ticket number that
    // doesn't exist. Revisit once backend endpoint returns a real ticket_id.
    return NextResponse.json(
      {
        ticketId: data.id != null ? String(data.id) : "N/A",
        message: "Thanks — we'll be in touch shortly.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[become-filer-lead-proxy]", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}