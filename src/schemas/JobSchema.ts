import z from "zod";

export const createJobSchema = z.object({
  company: z.string().min(1, "Company name is required").trim(),
  role: z.string().min(1, { message: "Role is required" }).trim(),
  status: z
    .enum(["applied", "interview", "offer", "reject"])
    .default("applied"),
  jobDescription: z.string().min(1, { message: "Job Description is required" }),
  notes: z.string().optional(),
  appliedDate: z.string().optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const analyzeResumeSchema = z.object({
  jobDescription: z.string().max(5000, { message: "Too Long" }).optional(),
});

export type createJobInput = z.infer<typeof createJobSchema>;
export type updateJobInput = z.infer<typeof updateJobSchema>;
export type analyzeResumeInput = z.infer<typeof analyzeResumeSchema>;
