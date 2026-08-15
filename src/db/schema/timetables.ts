import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { subjects } from "./subjects";

export const timetables = pgTable("timetables", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  academicTerm: varchar("academic_term", { length: 100 }),
  isPublic: boolean("is_public").default(false).notNull(),
  isDefault: boolean("is_default").default(true).notNull(),
  shareToken: varchar("share_token", { length: 64 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const timetablesRelations = relations(timetables, ({ one, many }) => ({
  user: one(users, {
    fields: [timetables.userId],
    references: [users.id],
  }),
  subjects: many(subjects),
}));

export type Timetable = typeof timetables.$inferSelect;
export type NewTimetable = typeof timetables.$inferInsert;
