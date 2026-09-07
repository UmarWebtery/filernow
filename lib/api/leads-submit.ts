// Always our own Next.js routes, never the backend's /api/admin/leads path directly.
// lib/api/leads-submit.ts
import type {
  BecomeFilerStep1Values,
  BecomeFilerStep2Values,
  ContactFormValues,
} from "@/lib/validations/leads-schema";

interface LeadSubmitResponse {
  ticketId: string;
  message: string;
}

// Shape BackendDev's step1/step2 endpoints return — the full lead row,
// with unfilled fields as null until step 2 completes them.
export interface LeadStepResponse {
  id: number;
  username: string;
  phone: string;
  city: string;
  email: string | null;
  service_type: string | null;
  cnic: string | null;
  status: string;
  created_at: string;
}

interface FastApiValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface LeadSubmitError {
  message: string | FastApiValidationError[];
  errors?: Record<string, string[]>;
}

function extractErrorMessage(data: LeadSubmitError): string {
  if (typeof data.message === "string") return data.message;
  if (Array.isArray(data.message)) {
    return data.message
      .map((e) => `${e.loc?.[e.loc.length - 1] ?? "field"}: ${e.msg}`)
      .join(", ");
  }
  return "Submission failed";
}

async function request<TPayload, TResponse>(
  endpoint: string,
  payload: TPayload,
  method: "POST" | "PATCH" = "POST",
): Promise<TResponse> {
  const res = await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(extractErrorMessage(data as LeadSubmitError));
  }

  return data as TResponse;
}

export const submitContactForm = (payload: ContactFormValues) =>
  request<ContactFormValues, LeadSubmitResponse>("/api/leads/contact", payload);

export const submitBecomeFilerStep1 = (payload: BecomeFilerStep1Values) =>
  request<BecomeFilerStep1Values, LeadStepResponse>(
    "/api/leads/become-filer/step1",
    payload,
  );

export const submitBecomeFilerStep2 = (leadId: number, payload: BecomeFilerStep2Values) =>
  request<BecomeFilerStep2Values & { leadId: number }, LeadStepResponse>(
    "/api/leads/become-filer/step2",
    { ...payload, leadId },
    "PATCH",
  );