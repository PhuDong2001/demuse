import { z } from "zod";
import { timeToMinutes } from "@/lib/time";
import { SUBJECT_COLORS } from "@/lib/constants";

const timeStringRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Base unrefined object schema so .extend() and .partial() are fully supported
export const baseScheduleSlotObject = z.object({
  dayOfWeek: z.number().int().min(1).max(7),
  startTime: z.string().regex(timeStringRegex, "Time must be in HH:mm format (e.g. 09:30)"),
  endTime: z.string().regex(timeStringRegex, "Time must be in HH:mm format (e.g. 11:00)"),
  room: z.string().trim().max(100).optional(),
  type: z.enum(["lecture", "lab", "tutorial", "seminar", "workshop", "study"]).default("lecture"),
});

export const scheduleSlotSchema = baseScheduleSlotObject.refine(
  (data) => timeToMinutes(data.endTime) > timeToMinutes(data.startTime),
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

export const createScheduleSchema = baseScheduleSlotObject
  .extend({
    subjectId: z.string().uuid("Invalid subject ID"),
  })
  .refine(
    (data) => timeToMinutes(data.endTime) > timeToMinutes(data.startTime),
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export const updateScheduleSchema = baseScheduleSlotObject
  .partial()
  .extend({
    subjectId: z.string().uuid("Invalid subject ID").optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return timeToMinutes(data.endTime) > timeToMinutes(data.startTime);
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

// Unified form schema for adding/editing a class with subject details & schedule timing
export const createClassModalSchema = z
  .object({
    timetableId: z.string().uuid("Invalid timetable ID"),
    // If subjectId is provided, link to existing subject; otherwise create new
    subjectId: z.string().uuid().optional(),
    name: z.string().trim().min(1, "Subject name is required").max(100),
    code: z.string().trim().max(50).optional(),
    teacher: z.string().trim().max(100).optional(),
    room: z.string().trim().max(100).optional(),
    color: z
      .string()
      .refine((val) => Object.keys(SUBJECT_COLORS).includes(val) || val.startsWith("#"), {
        message: "Invalid color",
      })
      .default("sage"),
    note: z.string().trim().max(1000).optional(),
    daysOfWeek: z.array(z.number().int().min(1).max(7)).min(1, "Select at least one day"),
    startTime: z.string().regex(timeStringRegex, "Start time format must be HH:mm"),
    endTime: z.string().regex(timeStringRegex, "End time format must be HH:mm"),
    type: z.enum(["lecture", "lab", "tutorial", "seminar", "workshop", "study"]).default("lecture"),
  })
  .refine(
    (data) => timeToMinutes(data.endTime) > timeToMinutes(data.startTime),
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type ScheduleSlotInput = z.infer<typeof scheduleSlotSchema>;
export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
export type CreateClassModalInput = z.infer<typeof createClassModalSchema>;
