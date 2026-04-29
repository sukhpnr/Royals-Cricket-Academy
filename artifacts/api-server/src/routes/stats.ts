import { Router } from "express";
import { db, registrationsTable, receiptsTable } from "@workspace/db";
import { eq, gte, sql } from "drizzle-orm";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/stats/summary", async (req, res) => {
  const allRegistrations = await db.select().from(registrationsTable);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalStudents = allRegistrations.length;
  const activeStudents = allRegistrations.filter(r => r.status === "active").length;
  const juniorCount = allRegistrations.filter(r => r.category.toLowerCase().includes("junior")).length;
  const seniorCount = allRegistrations.filter(r => r.category.toLowerCase().includes("senior")).length;
  const eliteCount = allRegistrations.filter(r => r.category.toLowerCase().includes("elite")).length;
  const thisMonthRegistrations = allRegistrations.filter(
    r => new Date(r.registeredAt) >= startOfMonth
  ).length;

  const allReceipts = await db.select().from(receiptsTable);
  const totalFeesCollected = allReceipts.reduce((sum, r) => sum + Number(r.amount), 0);

  res.json({
    totalStudents,
    juniorCount,
    seniorCount,
    eliteCount,
    totalFeesCollected,
    thisMonthRegistrations,
    activeStudents,
  });
});

router.get("/stats/recent", async (req, res) => {
  const recent = await db
    .select()
    .from(registrationsTable)
    .orderBy(desc(registrationsTable.registeredAt))
    .limit(10);

  res.json(recent.map(r => ({
    ...r,
    registrationFee: Number(r.registrationFee),
    monthlyFee: Number(r.monthlyFee),
    registeredAt: r.registeredAt.toISOString(),
  })));
});

export default router;
