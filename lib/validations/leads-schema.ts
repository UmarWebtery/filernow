// lib/validations/leads-schema.ts
import { z } from "zod";
import { groupServicesByCategory } from "@/lib/services/groupServicesByCategory";

const PK_PHONE_REGEX = /^(?:\+92|0)3\d{9}$/;
const CNIC_REGEX = /^\d{5}-?\d{7}-?\d{1}$/; // 13 digits, dashes optional: 12345-1234567-1 or 1234512345671

// const honeypot = {
//   // Invisible to real users, only bots fill this. Tripping it short-circuits
//   // to a fake success in the route handler instead of surfacing a rejection
//   // a bot could learn from.
//   companyWebsite: z.string().max(0, "Spam detected").optional(),
// };

// -----------------------------------------------------------------------
// Contact form — targets /leads/contact. Deliberately independent from
// Become-Filer below; the two forms talk to different backend contracts
// right now and sharing a base schema means a rename on one silently
// breaks the other.
// -----------------------------------------------------------------------
export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .regex(PK_PHONE_REGEX, "Enter a valid Pakistani number, e.g. 03041110555"),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Subject is required").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
// -----------------------------------------------------------------------
// Become-Filer form — field names match fastApi's /api/admin/leads payload
// (username, service_type, city) as a deliberate, isolated adaptation.
// Everything here is provisional pending confirmation that this endpoint
// is actually public.
// -----------------------------------------------------------------------
export const FILER_SERVICE_GROUPS = groupServicesByCategory().map((group) => ({
  label: group.label,
  // options: group.items.map((item) => ({ value: item.id, label: item.label })),
  options: group.items.map((item) => ({ value: item.label, label: item.label })),
}));

const filerServiceValues = FILER_SERVICE_GROUPS.flatMap((g) =>
  g.options.map((o) => o.value),
) as [string, ...string[]];

// fast api sample payload shows a human-readable label ("Filer Registration"),
// not the stable svc1–svc16 id. this is fragile — a label rename in
// appData.tsx silently stops matching whatever his DB has stored.

const serviceLabelById = new Map(
  FILER_SERVICE_GROUPS.flatMap((g) => g.options).map((o) => [o.value, o.label]),
);

export function getServiceLabelById(id: string): string {
  return serviceLabelById.get(id) ?? id;
}

export const becomeFilerStep1Schema = z.object({
  username: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .regex(PK_PHONE_REGEX, "Enter a valid Pakistani number, e.g. 03041110555"),
  city: z.string().trim().min(2, "Enter your city").max(100),
});

export type BecomeFilerStep1Values = z.infer<typeof becomeFilerStep1Schema>;

export const becomeFilerStep2Schema = z.object({
  cnic: z
    .string()
    .trim()
    .regex(CNIC_REGEX, "Enter a valid CNIC, e.g. 12345-1234567-1"),
  service_type: z.enum(filerServiceValues, {
    message: "Select a service",
  }),
  // Required per BackendDev's step2 schema (no nullable/optional marker).
  // Was optional on the old single-step form — flag if that's not intended.
  email: z.string().trim().email("Enter a valid email address"),
});

export type BecomeFilerStep2Values = z.infer<typeof becomeFilerStep2Schema>;
