import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timetables } from "./timetables";
import { schedules } from "./schedules";

export const subjects = pgTable("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  timetableId: uuid("timetable_id")
    .notNull()
    .references(() => timetables.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  teacher: varchar("teacher", { length: 255 }),
  room: varchar("room", { length: 100 }),
  color: varchar("color", { length: 50 }).default("sage").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  timetable: one(timetables, {
    fields: [subjects.timetableId],
    references: [timetables.id],
  }),
  schedules: many(schedules),
}));

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;
