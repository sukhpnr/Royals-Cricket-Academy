import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const registrationsTable = pgTable("registrations", {
  id: serial("id").primaryKey(),
  receiptNumber: text("receipt_number").notNull().unique(),
  studentName: text("student_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  parentName: text("parent_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  category: text("category").notNull(),
  batchTiming: text("batch_timing").notNull(),
  registrationFee: numeric("registration_fee", { precision: 10, scale: 2 }).notNull(),
  monthlyFee: numeric("monthly_fee", { precision: 10, scale: 2 }).notNull(),
  paymentMode: text("payment_mode").notNull(),
  status: text("status").notNull().default("active"),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
});

export const insertRegistrationSchema = createInsertSchema(registrationsTable).omit({ id: true, receiptNumber: true, status: true, registeredAt: true });
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrationsTable.$inferSelect;
