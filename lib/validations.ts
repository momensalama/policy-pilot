import { z } from "zod";

export const shareholderSchema = z.object({
  name: z.string().min(1, "Shareholder name is required"),
  sharePercentage: z
    .number()
    .min(0, "Share must be 0 or more")
    .max(100, "Share cannot exceed 100"),
});

export const assessmentSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.email("Please enter a valid email"),
  companyLocation: z.string().min(1, "Company location is required"),
  primaryActivity: z.string().min(1, "Primary activity is required"),
  shareholders: z
    .array(shareholderSchema)
    .min(1, "At least one shareholder is required")
    .refine(
      (shareholders) => {
        const total = shareholders.reduce(
          (sum, s) => sum + s.sharePercentage,
          0,
        );
        return Math.round(total * 100) === 10000;
      },
      { message: "Total shares must equal 100%" },
    ),
});

export type AssessmentFormData = z.infer<typeof assessmentSchema>;
export type ShareholderFormData = z.infer<typeof shareholderSchema>;
