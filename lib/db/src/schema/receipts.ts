import { pgTable, serial, text, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { registrationsTable } from "./registrations";

export const receiptsTable = pgTable("receipts", {
  id: serial("id").primaryKey(),
  receiptNumber: text("receipt_number").notNull().unique(),
  registrationId: integer("registration_id").notNull().references(() => registrationsTable.id),
  studentName: text("student_name").notNull(),
  parentName: text("parent_name").notNull(),
  phone: text("phone").notNull(),
  category: text("category").notNull(),
  batchTiming: text("batch_timing").notNull(),
  feeType: text("fee_type").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMode: text("payment_mode").notNull(),
  paymentDate: text("payment_date").notNull(),
  month: text("month"),
  notes: text("notes"),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
});

export const insertReceiptSchema = createInsertSchema(receiptsTable).omit({ id: true, receiptNumber: true, issuedAt: true });
export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type Receipt = typeof receiptsTable.$inferSelect;
