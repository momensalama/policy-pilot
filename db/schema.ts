import {
  pgTable,
  text,
  uuid,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const assessments = pgTable("assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: text("company_name").notNull(),
  companyEmail: text("company_email").notNull(),
  companyLocation: text("company_location").notNull(),
  primaryActivity: text("primary_activity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shareholders = pgTable("shareholders", {
  id: uuid("id").defaultRandom().primaryKey(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sharePercentage: numeric("share_percentage", {
    precision: 5,
    scale: 2,
  }).notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const policies = pgTable("policies", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const assessmentsRelations = relations(assessments, ({ many }) => ({
  shareholders: many(shareholders),
}));

export const shareholdersRelations = relations(shareholders, ({ one }) => ({
  assessment: one(assessments, {
    fields: [shareholders.assessmentId],
    references: [assessments.id],
  }),
}));

// Types
export type Assessment = typeof assessments.$inferSelect;
export type NewAssessment = typeof assessments.$inferInsert;
export type Shareholder = typeof shareholders.$inferSelect;
export type NewShareholder = typeof shareholders.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Policy = typeof policies.$inferSelect;
export type NewPolicy = typeof policies.$inferInsert;

export type AssessmentWithShareholders = Assessment & {
  shareholders: Shareholder[];
};
