import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { subjects } from "./subjects";

export const schedules = pgTable("schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 1 = Monday, ..., 7 = Sunday
  startTime: varchar("start_time", { length: 5 }).notNull(), // "HH:mm" e.g. "08:30"
  endTime: varchar("end_time", { length: 5 }).notNull(), // "HH:mm" e.g. "10:00"
  room: varchar("room", { length: 100 }), // Room override if different from subject default
  type: varchar("type", { length: 50 }).default("lecture").notNull(), // lecture, lab, tutorial, workshop, seminar
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const schedulesRelations = relations(schedules, ({ one }) => ({
  subject: one(subjects, {
    fields: [schedules.subjectId],
    references: [subjects.id],
  }),
}));

export type Schedule = typeof schedules.$inferSelect;
export type NewSchedule = typeof schedules.$inferInsert;
