// app/api/leads/become-filer/step2/route.ts
import { NextRequest, NextResponse } from "next/server";
import { becomeFilerStep2Schema } from "@/lib/validations/leads-schema";
import { z } from "zod";

const step2RequestSchema = becomeFilerStep2Schema.extend({
  leadId: z.number().int().positive("Missing lead reference — restart the form."),
});

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const parsed = step2RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid form data", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const rawBaseUrl = process.env.FASTAPI_INTERNAL_URL;

  if (!rawBaseUrl) {
    console.error(
      "[become-filer-step2-proxy] FASTAPI_INTERNAL_URL is not set. " +
        "Check .env.local and restart the dev server.",
    );
    return NextResponse.json(
      { message: "Server is misconfigured. Please try again shortly." },
      { status: 502 },
    );
  }

  const { leadId, ...step2Data } = parsed.data;
  const targetUrl = `${rawBaseUrl.replace(/\/+$/, "")}/api/admin/leads/${leadId}/step2`;

  try {
    const fastapiRes = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(step2Data),
      cache: "no-store",
    });

    const contentType = fastapiRes.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const text = await fastapiRes.text();
      console.error(
        `[become-filer-step2-proxy] Non-JSON response from ${targetUrl} ` +
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
        { message: data.detail ?? "Failed to complete your registration" },
        { status: fastapiRes.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(`[become-filer-step2-proxy] Failed to reach ${targetUrl}`, error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}