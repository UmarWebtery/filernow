// components/common/form/StepProgress.tsx
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface Step {
    label: string;
}

interface StepProgressProps {
    steps: Step[];
    currentStep: number; // 1-indexed
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center">
                {steps.map((step, i) => {
                    const stepNumber = i + 1;
                    const isComplete = stepNumber < currentStep;
                    const isActive = stepNumber === currentStep;

                    return (
                        <div key={step.label} className="flex flex-1 items-center last:flex-none">
                            <div className="flex flex-col items-center gap-1.5">
                                <span
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                                        isComplete && "bg-primary text-white",
                                        isActive && "bg-primary/10 text-primary ring-2 ring-primary",
                                        !isComplete && !isActive && "bg-gray-100 text-gray-400",
                                    )}
                                >
                                    {isComplete ? <Check size={16} /> : stepNumber}
                                </span>
                                <span
                                    className={cn(
                                        "text-xs font-medium",
                                        isActive || isComplete ? "text-text-dark" : "text-gray-400",
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {stepNumber < steps.length && (
                                <div
                                    className={cn(
                                        "mx-2 h-0.5 flex-1",
                                        isComplete ? "bg-primary" : "bg-gray-100",
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}