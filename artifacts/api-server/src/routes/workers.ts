import { Router } from "express";
import { eq, desc, sql, ilike, or, inArray } from "drizzle-orm";
import { db, workersTable, paymentsTable } from "@workspace/db";
import {
  CreateWorkerBody,
  GetWorkerParams,
  UpdateWorkerParams,
  UpdateWorkerBody,
  DeleteWorkerParams,
  ListWorkersQueryParams,
  SearchWorkersQueryParams,
  ListWorkerPaymentsParams,
  AddPaymentParams,
  AddPaymentBody,
  DeletePaymentParams,
  AdminLoginBody,
  AdminLoginResponse,
  AdminVerifyResponse,
  GetLeaderboardResponse,
  GetWorkerStatsParams,
  UpdateWorkerStatsParams,
  UpdateWorkerStatsBody,
} from "@workspace/api-zod";
import jwt from "jsonwebtoken";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const JWT_SECRET = process.env.SESSION_SECRET ?? "secret";
const RATE_PER_IMAGE = 5; // Rs 5 per valid screenshot

function requireAdmin(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

function buildWorkerWithRank(workers: any[]): any[] {
  return workers.map((w, idx) => ({
    id: w.id,
    workerId: w.workerId,
    name: w.name,
    balance: parseFloat(w.balance ?? "0"),
    rank: idx + 1,
    createdAt: w.createdAt,
    totalUploads: w.totalUploads ?? 0,
    validCount: w.validCount ?? 0,
    duplicateCount: w.duplicateCount ?? 0,
  }));
}

function buildWorkerDetail(w: any, rank: number, payments: any[]): any {
  const totalUploads = w.totalUploads ?? 0;
  const validCount = w.validCount ?? 0;
  const duplicateCount = w.duplicateCount ?? 0;
  const payableAmount = validCount * RATE_PER_IMAGE;
  return {
    id: w.id,
    workerId: w.workerId,
    name: w.name,
    balance: parseFloat(w.balance ?? "0"),
    rank,
    createdAt: w.createdAt,
    payments: payments.map((p) => ({
      id: p.id,
      workerId: p.workerId,
      amount: parseFloat(p.amount ?? "0"),
      description: p.description,
      createdAt: p.createdAt,
    })),
    totalUploads,
    validCount,
    duplicateCount,
    payableAmount,
  };
}

// GET /workers
router.get("/workers", async (req, res): Promise<void> => {
  const parsed = ListWorkersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search } = parsed.data;

  let workers;
  if (search) {
    workers = await db
      .select()
      .from(workersTable)
      .where(
        or(
          ilike(workersTable.name, `%${search}%`),
          ilike(workersTable.workerId, `%${search}%`)
        )
      )
      .orderBy(desc(workersTable.balance));
  } else {
    workers = await db
      .select()
      .from(workersTable)
      .orderBy(desc(workersTable.balance));
  }

  res.json(buildWorkerWithRank(workers));
});

// POST /workers
router.post("/workers", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateWorkerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(workersTable)
    .where(eq(workersTable.workerId, parsed.data.workerId));

  if (existing.length > 0) {
    res.status(400).json({ error: "Worker ID already exists" });
    return;
  }

  const [worker] = await db
    .insert(workersTable)
    .values({ name: parsed.data.name, workerId: parsed.data.workerId, balance: "0" })
    .returning();

  res.status(201).json({
    id: worker.id,
    workerId: worker.workerId,
    name: worker.name,
    balance: parseFloat(worker.balance ?? "0"),
    rank: 0,
    createdAt: worker.createdAt,
  });
});

// GET /workers/search
router.get("/workers/search", async (req, res): Promise<void> => {
  const parsed = SearchWorkersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { q } = parsed.data;

  const allWorkers = await db
    .select()
    .from(workersTable)
    .orderBy(desc(workersTable.balance));

  const filtered = allWorkers.filter(
    (w) =>
      w.name.toLowerCase().includes(q.toLowerCase()) ||
      w.workerId.toLowerCase().includes(q.toLowerCase())
  );

  const results = await Promise.all(
    filtered.map(async (w) => {
      const rank = allWorkers.findIndex((r) => r.id === w.id) + 1;
      const payments = await db
        .select()
        .from(paymentsTable)
        .where(eq(paymentsTable.workerId, w.id))
        .orderBy(desc(paymentsTable.createdAt));
      return buildWorkerDetail(w, rank, payments);
    })
  );

  res.json(results);
});

// GET /workers/:id/stats
router.get("/workers/:id/stats", async (req, res): Promise<void> => {
  const params = GetWorkerStatsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [worker] = await db
    .select()
    .from(workersTable)
    .where(eq(workersTable.id, params.data.id));

  if (!worker) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }

  const totalUploads = worker.totalUploads ?? 0;
  const validCount = worker.validCount ?? 0;
  const duplicateCount = worker.duplicateCount ?? 0;
  const payableAmount = validCount * RATE_PER_IMAGE;

  res.json({
    workerId: worker.id,
    totalUploads,
    validCount,
    duplicateCount,
    payableAmount,
    ratePerImage: RATE_PER_IMAGE,
  });
});

// PATCH /workers/:id/stats/update
router.patch("/workers/:id/stats/update", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateWorkerStatsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateWorkerStatsBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updates: any = {};
  if (body.data.totalUploads !== undefined) updates.totalUploads = body.data.totalUploads;
  if (body.data.validCount !== undefined) updates.validCount = body.data.validCount;
  if (body.data.duplicateCount !== undefined) updates.duplicateCount = body.data.duplicateCount;

  const [worker] = await db
    .update(workersTable)
    .set(updates)
    .where(eq(workersTable.id, params.data.id))
    .returning();

  if (!worker) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }

  const totalUploads = worker.totalUploads ?? 0;
  const validCount = worker.validCount ?? 0;
  const duplicateCount = worker.duplicateCount ?? 0;
  const payableAmount = validCount * RATE_PER_IMAGE;

  res.json({
    workerId: worker.id,
    totalUploads,
    validCount,
    duplicateCount,
    payableAmount,
    ratePerImage: RATE_PER_IMAGE,
  });
});

// GET /workers/:id
router.get("/workers/:id", async (req, res): Promise<void> => {
  const params = GetWorkerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const allWorkers = await db
    .select()
    .from(workersTable)
    .orderBy(desc(workersTable.balance));

  const workerIdx = allWorkers.findIndex((w) => w.id === params.data.id);
  if (workerIdx === -1) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }

  const worker = allWorkers[workerIdx];
  const payments = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.workerId, worker.id))
    .orderBy(desc(paymentsTable.createdAt));

  res.json(buildWorkerDetail(worker, workerIdx + 1, payments));
});

// PATCH /workers/:id
router.patch("/workers/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateWorkerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateWorkerBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updates: any = {};
  if (body.data.name !== undefined) updates.name = body.data.name;
  if (body.data.balance !== undefined) updates.balance = String(body.data.balance);

  const [updated] = await db
    .update(workersTable)
    .set(updates)
    .where(eq(workersTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }

  const allWorkers = await db
    .select()
    .from(workersTable)
    .orderBy(desc(workersTable.balance));
  const rank = allWorkers.findIndex((w) => w.id === updated.id) + 1;

  res.json({
    id: updated.id,
    workerId: updated.workerId,
    name: updated.name,
    balance: parseFloat(updated.balance ?? "0"),
    rank,
    createdAt: updated.createdAt,
  });
});

// DELETE /workers/:id
router.delete("/workers/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteWorkerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(workersTable)
    .where(eq(workersTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }

  res.sendStatus(204);
});

// GET /workers/:id/payments
router.get("/workers/:id/payments", async (req, res): Promise<void> => {
  const params = ListWorkerPaymentsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [worker] = await db
    .select()
    .from(workersTable)
    .where(eq(workersTable.id, params.data.id));

  if (!worker) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }

  const payments = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.workerId, params.data.id))
    .orderBy(desc(paymentsTable.createdAt));

  res.json(
    payments.map((p) => ({
      id: p.id,
      workerId: p.workerId,
      amount: parseFloat(p.amount ?? "0"),
      description: p.description,
      createdAt: p.createdAt,
    }))
  );
});

// POST /workers/:id/payments
router.post("/workers/:id/payments", requireAdmin, async (req, res): Promise<void> => {
  const params = AddPaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = AddPaymentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [worker] = await db
    .select()
    .from(workersTable)
    .where(eq(workersTable.id, params.data.id));

  if (!worker) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }

  const [payment] = await db
    .insert(paymentsTable)
    .values({
      workerId: params.data.id,
      amount: String(body.data.amount),
      description: body.data.description,
      status: "pending",
    })
    .returning();

  // Update worker balance
  await db
    .update(workersTable)
    .set({
      balance: sql`${workersTable.balance} + ${String(body.data.amount)}`,
    })
    .where(eq(workersTable.id, params.data.id));

  res.status(201).json({
    id: payment.id,
    workerId: payment.workerId,
    amount: parseFloat(payment.amount ?? "0"),
    description: payment.description,
    status: payment.status,
    paymentMethod: payment.paymentMethod ?? null,
    createdAt: payment.createdAt,
  });
});

// PATCH /admin/payments/:paymentId/status  — mark as paid
router.patch("/admin/payments/:paymentId/status", requireAdmin, async (req, res): Promise<void> => {
  const paymentId = parseInt(req.params.paymentId);
  if (isNaN(paymentId)) {
    res.status(400).json({ error: "Invalid paymentId" });
    return;
  }

  const { paymentMethod } = req.body as { paymentMethod?: string };

  const [payment] = await db
    .update(paymentsTable)
    .set({ status: "paid", paymentMethod: paymentMethod ?? null })
    .where(eq(paymentsTable.id, paymentId))
    .returning();

  res.json({
    id: payment.id,
    workerId: payment.workerId,
    amount: parseFloat(payment.amount ?? "0"),
    description: payment.description,
    status: payment.status,
    paymentMethod: payment.paymentMethod ?? null,
    createdAt: payment.createdAt,
  });
});

// GET /admin/pending-payouts — grouped by worker, one row per worker with summed total
router.get("/admin/pending-payouts", requireAdmin, async (_req, res): Promise<void> => {
  const payments = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.status, "pending"))
    .orderBy(desc(paymentsTable.createdAt));

  const workers = await db.select().from(workersTable);
  const workerMap = new Map<number, any>();
  workers.forEach((w) => workerMap.set(w.id, w));

  // Group by workerId
  const grouped = new Map<number, { paymentIds: number[]; totalAmount: number; latestDate: any; descriptions: string[] }>();
  for (const p of payments) {
    const wid = p.workerId;
    if (!grouped.has(wid)) {
      grouped.set(wid, { paymentIds: [], totalAmount: 0, latestDate: p.createdAt, descriptions: [] });
    }
    const g = grouped.get(wid)!;
    g.paymentIds.push(p.id);
    g.totalAmount += parseFloat(p.amount ?? "0");
    if (p.description) g.descriptions.push(p.description);
    if (new Date(p.createdAt) > new Date(g.latestDate)) g.latestDate = p.createdAt;
  }

  const result = Array.from(grouped.entries()).map(([wid, g]) => ({
    workerId: wid,
    workerName: workerMap.get(wid)?.name ?? "Unknown",
    workerPublicId: workerMap.get(wid)?.workerId ?? "",
    totalAmount: g.totalAmount,
    batchCount: g.paymentIds.length,
    paymentIds: g.paymentIds,
    descriptions: g.descriptions,
    latestDate: g.latestDate,
  }));

  // Sort by latestDate desc
  result.sort((a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime());

  res.json(result);
});

// POST /admin/payments/bulk-mark-paid — mark multiple payments as paid at once
router.post("/admin/payments/bulk-mark-paid", requireAdmin, async (req: any, res: any): Promise<void> => {
  const { paymentIds, paymentMethod } = req.body;
  if (!Array.isArray(paymentIds) || paymentIds.length === 0) {
    res.status(400).json({ error: "paymentIds must be a non-empty array" });
    return;
  }
  if (!paymentMethod) {
    res.status(400).json({ error: "paymentMethod is required" });
    return;
  }

  await db
    .update(paymentsTable)
    .set({ status: "paid", paymentMethod })
    .where(inArray(paymentsTable.id, paymentIds));

  res.json({ success: true, updated: paymentIds.length });
});

// DELETE /workers/:id/payments/:paymentId
router.delete("/workers/:id/payments/:paymentId", requireAdmin, async (req, res): Promise<void> => {
  const params = DeletePaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.id, params.data.paymentId));

  if (!payment) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }

  await db
    .delete(paymentsTable)
    .where(eq(paymentsTable.id, params.data.paymentId));

  // Subtract amount from worker balance
  await db
    .update(workersTable)
    .set({
      balance: sql`${workersTable.balance} - ${payment.amount}`,
    })
    .where(eq(workersTable.id, params.data.id));

  res.sendStatus(204);
});

// POST /admin/login
router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "7d" });
  res.json(AdminLoginResponse.parse({ success: true, token }));
});

// GET /admin/verify
router.get("/admin/verify", requireAdmin, async (_req, res): Promise<void> => {
  res.json(AdminVerifyResponse.parse({ success: true, token: "valid" }));
});

// GET /leaderboard
router.get("/leaderboard", async (_req, res): Promise<void> => {
  const workers = await db
    .select()
    .from(workersTable)
    .orderBy(desc(workersTable.balance));

  const totalWorkers = workers.length;
  const totalPaid = workers.reduce((sum, w) => sum + parseFloat(w.balance ?? "0"), 0);
  const screenshotsProcessed = workers.reduce((sum, w) => sum + (w.totalUploads ?? 0), 0);

  const topWorkers = buildWorkerWithRank(workers.slice(0, 10));

  const recentPayments = await db
    .select()
    .from(paymentsTable)
    .orderBy(desc(paymentsTable.createdAt))
    .limit(10);

  res.json(
    GetLeaderboardResponse.parse({
      totalWorkers,
      totalPaid,
      screenshotsProcessed,
      topWorkers,
      recentPayments: recentPayments.map((p) => ({
        id: p.id,
        workerId: p.workerId,
        amount: parseFloat(p.amount ?? "0"),
        description: p.description,
        createdAt: p.createdAt,
      })),
    })
  );
});

export default router;
