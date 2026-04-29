import { Router } from "express";
import { db, registrationsTable, receiptsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateRegistrationBody } from "@workspace/api-zod";

const router = Router();

function generateReceiptNumber(prefix: string): string {
  const timestamp = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${timestamp}-${rand}`;
}

function formatRegistration(reg: typeof registrationsTable.$inferSelect) {
  return {
    ...reg,
    registrationFee: Number(reg.registrationFee),
    monthlyFee: Number(reg.monthlyFee),
    registeredAt: reg.registeredAt.toISOString(),
  };
}

router.get("/registrations", async (req, res) => {
  const registrations = await db
    .select()
    .from(registrationsTable)
    .orderBy(desc(registrationsTable.registeredAt));
  res.json(registrations.map(formatRegistration));
});

router.post("/registrations", async (req, res) => {
  const parsed = CreateRegistrationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  const receiptNumber = generateReceiptNumber("RCA");
  const [reg] = await db.insert(registrationsTable).values({
    receiptNumber,
    studentName: parsed.data.studentName,
    dateOfBirth: parsed.data.dateOfBirth,
    gender: parsed.data.gender,
    parentName: parsed.data.parentName,
    phone: parsed.data.phone,
    email: parsed.data.email ?? null,
    address: parsed.data.address,
    category: parsed.data.category,
    batchTiming: parsed.data.batchTiming,
    registrationFee: parsed.data.registrationFee.toString(),
    monthlyFee: parsed.data.monthlyFee.toString(),
    paymentMode: parsed.data.paymentMode,
  }).returning();

  res.status(201).json(formatRegistration(reg));
});

router.get("/registrations/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [reg] = await db.select().from(registrationsTable).where(eq(registrationsTable.id, id));
  if (!reg) {
    res.status(404).json({ error: "Registration not found" });
    return;
  }

  res.json(formatRegistration(reg));
});

export default router;
