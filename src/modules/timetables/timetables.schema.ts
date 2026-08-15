import { z } from "zod";

export const createTimetableSchema = z.object({
  name: z.string().trim().min(1, "Timetable name is required").max(100),
  description: z.string().trim().max(500).optional(),
  academicTerm: z.string().trim().max(100).optional(),
  isPublic: z.boolean().optional().default(false),
});

export const updateTimetableSchema = createTimetableSchema.partial().extend({
  isDefault: z.boolean().optional(),
});

export type CreateTimetableInput = z.infer<typeof createTimetableSchema>;
export type UpdateTimetableInput = z.infer<typeof updateTimetableSchema>;
