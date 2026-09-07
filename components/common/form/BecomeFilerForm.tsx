// components/common/form/BecomeFilerForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  becomeFilerStep1Schema,
  becomeFilerStep2Schema,
  BecomeFilerStep1Values,
  BecomeFilerStep2Values,
  FILER_SERVICE_GROUPS,
} from "@/lib/validations/leads-schema";
import { submitBecomeFilerStep1, submitBecomeFilerStep2 } from "@/lib/api/leads-submit";
import { FormField, inputGenericClass } from "./FormField";
import { FormSelectField } from "./FormSelectField";
import { StepProgress } from "./StepProgress";
import { cn } from "@/utils/cn";

const STEPS = [{ label: "Basic Details" }, { label: "Service Details" }];

export function BecomeFilerForm() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [leadId, setLeadId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const step1Form = useForm<BecomeFilerStep1Values>({
    resolver: zodResolver(becomeFilerStep1Schema),
    defaultValues: { username: "", phone: "", city: "" },
  });

  const step2Form = useForm<BecomeFilerStep2Values>({
    resolver: zodResolver(becomeFilerStep2Schema),
    defaultValues: { cnic: "", service_type: undefined, email: "" },
  });

  const onStep1Submit = async (values: BecomeFilerStep1Values) => {
    setServerError(null);

    // Guard against re-POSTing step 1 (e.g. via Back → Next) — it would
    // create a second, duplicate lead row. If we already have a lead_id
    // from an earlier submission in this session, just advance.
    if (leadId != null) {
      setCurrentStep(2);
      return;
    }

    try {
      const response = await submitBecomeFilerStep1(values);
      setLeadId(response.id);
      setCurrentStep(2);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const onStep2Submit = async (values: BecomeFilerStep2Values) => {
    setServerError(null);

    if (leadId == null) {
      // Shouldn't be reachable via normal flow (e.g. page refresh mid-form
      // without persistence) — send the user back rather than failing silently.
      setStatus("error");
      setServerError("Something reset your session — please start again from step 1.");
      setCurrentStep(1);
      return;
    }

    try {
      await submitBecomeFilerStep2(leadId, values);
      setStatus("success");
      step1Form.reset();
      step2Form.reset();
      setLeadId(null);
      setCurrentStep(1);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const goBackToStep1 = () => {
    setServerError(null);
    setCurrentStep(1);
  };

  if (status === "success") {
    return (
      <p role="status" className="text-sm text-green-600">
        Thanks — we've received your details and will be in touch shortly.
      </p>
    );
  }

  return (
    <div>
      <StepProgress steps={STEPS} currentStep={currentStep} />

      {currentStep === 1 && (
        <form onSubmit={step1Form.handleSubmit(onStep1Submit)} noValidate className="space-y-5">
          <FormField
            label="Your Name *"
            htmlFor="username"
            error={step1Form.formState.errors.username?.message}
          >
            <input
              id="username"
              placeholder="Enter Your Name"
              className={cn("w-full", inputGenericClass)}
              {...step1Form.register("username")}
            />
          </FormField>

          <FormField
            label="Phone Number"
            htmlFor="phone"
            error={step1Form.formState.errors.phone?.message}
          >
            <input
              id="phone"
              placeholder="Enter Phone Number"
              className={cn("w-full", inputGenericClass)}
              {...step1Form.register("phone")}
            />
          </FormField>

          <FormField
            label="City"
            htmlFor="city"
            error={step1Form.formState.errors.city?.message}
          >
            <input
              id="city"
              placeholder="Enter Your City"
              className={cn("w-full", inputGenericClass)}
              {...step1Form.register("city")}
            />
          </FormField>

          {status === "error" && serverError && (
            <p role="alert" className="text-sm text-red-600">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={step1Form.formState.isSubmitting}
            className="w-full rounded-md bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60"
          >
            {step1Form.formState.isSubmitting ? "Saving…" : "Next"}
          </button>
        </form>
      )}

      {currentStep === 2 && (
        <form onSubmit={step2Form.handleSubmit(onStep2Submit)} noValidate className="space-y-5">
          <FormField
            label="CNIC"
            htmlFor="cnic"
            error={step2Form.formState.errors.cnic?.message}
          >
            <input
              id="cnic"
              placeholder="12345-1234567-1"
              className={cn("w-full", inputGenericClass)}
              {...step2Form.register("cnic")}
            />
          </FormField>

          <FormSelectField
            id="service_type"
            label="Service"
            error={step2Form.formState.errors.service_type?.message}
            groups={FILER_SERVICE_GROUPS}
            {...step2Form.register("service_type")}
          />

          <FormField
            label="Email"
            htmlFor="email"
            error={step2Form.formState.errors.email?.message}
          >
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              className={cn("w-full", inputGenericClass)}
              {...step2Form.register("email")}
            />
          </FormField>

          {status === "error" && serverError && (
            <p role="alert" className="text-sm text-red-600">
              {serverError}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goBackToStep1}
              className="rounded-md border border-border-clr px-6 py-3 font-semibold text-text-dark"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={step2Form.formState.isSubmitting}
              className="flex-1 rounded-md bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60"
            >
              {step2Form.formState.isSubmitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}