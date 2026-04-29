import { Router } from "express";
import { db, receiptsTable, registrationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { GenerateReceiptBody } from "@workspace/api-zod";

const router = Router();

function generateReceiptNumber(prefix: string): string {
  const timestamp = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-RCP-${timestamp}-${rand}`;
}

function formatReceipt(r: typeof receiptsTable.$inferSelect) {
  return {
    ...r,
    amount: Number(r.amount),
    issuedAt: r.issuedAt.toISOString(),
  };
}

router.get("/receipts", async (req, res) => {
  const receipts = await db
    .select()
    .from(receiptsTable)
    .orderBy(desc(receiptsTable.issuedAt));
  res.json(receipts.map(formatReceipt));
});

router.get("/receipts/registration/:registrationId", async (req, res) => {
  const registrationId = parseInt(req.params.registrationId);
  if (isNaN(registrationId)) {
    res.status(400).json({ error: "Invalid registration ID" });
    return;
  }

  const receipts = await db
    .select()
    .from(receiptsTable)
    .where(eq(receiptsTable.registrationId, registrationId))
    .orderBy(desc(receiptsTable.issuedAt));

  res.json(receipts.map(formatReceipt));
});

router.post("/receipts/generate", async (req, res) => {
  const parsed = GenerateReceiptBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  const [reg] = await db
    .select()
    .from(registrationsTable)
    .where(eq(registrationsTable.id, parsed.data.registrationId));

  if (!reg) {
    res.status(404).json({ error: "Registration not found" });
    return;
  }

  const receiptNumber = generateReceiptNumber("RCA");
  const [receipt] = await db.insert(receiptsTable).values({
    receiptNumber,
    registrationId: parsed.data.registrationId,
    studentName: reg.studentName,
    parentName: reg.parentName,
    phone: reg.phone,
    category: reg.category,
    batchTiming: reg.batchTiming,
    feeType: parsed.data.feeType,
    amount: parsed.data.amount.toString(),
    paymentMode: parsed.data.paymentMode,
    paymentDate: parsed.data.paymentDate,
    month: parsed.data.month ?? null,
    notes: parsed.data.notes ?? null,
  }).returning();

  res.status(201).json(formatReceipt(receipt));
});

export default router;
