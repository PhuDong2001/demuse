import { z } from "zod";
import { SUBJECT_COLORS } from "@/lib/constants";

export const createSubjectSchema = z.object({
  timetableId: z.string().uuid("Invalid timetable ID"),
  name: z.string().trim().min(1, "Subject name is required").max(100),
  code: z.string().trim().max(50).optional(),
  teacher: z.string().trim().max(100).optional(),
  room: z.string().trim().max(50).optional(),
  color: z
    .string()
    .refine((val) => Object.keys(SUBJECT_COLORS).includes(val) || val.startsWith("#"), {
      message: "Invalid color key",
    })
    .default("sage"),
  note: z.string().trim().max(1000).optional(),
});

export const updateSubjectSchema = createSubjectSchema.partial().omit({ timetableId: true });

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
