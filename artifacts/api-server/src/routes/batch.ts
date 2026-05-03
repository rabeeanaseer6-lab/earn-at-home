import { Router } from "express";
import { eq, sql } from "drizzle-orm";
import { db, workersTable, paymentsTable } from "@workspace/db";
import multer from "multer";
import AdmZip from "adm-zip";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });
const JWT_SECRET = process.env.SESSION_SECRET ?? "secret";
const RATE_PER_IMAGE = 5;

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff"]);

function requireAdmin(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

function sha256(buf: Buffer): string {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

// POST /admin/batch-upload
router.post("/admin/batch-upload", requireAdmin, upload.single("file"), async (req: any, res: any): Promise<void> => {
  const workerId = req.body?.workerId;
  if (!workerId) {
    res.status(400).json({ error: "workerId is required" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const [worker] = await db
    .select()
    .from(workersTable)
    .where(eq(workersTable.id, parseInt(workerId)));

  if (!worker) {
    res.status(404).json({ error: "Worker not found" });
    return;
  }

  let zip: AdmZip;
  try {
    zip = new AdmZip(req.file.buffer);
  } catch {
    res.status(400).json({ error: "Invalid or corrupted ZIP file" });
    return;
  }

  const entries = zip.getEntries();
  const hashes = new Map<string, string>();
  const duplicateSlugs: string[] = [];
  let totalImages = 0;

  for (const entry of entries) {
    if (entry.isDirectory) continue;
    const name = entry.entryName.toLowerCase();
    const ext = "." + name.split(".").pop();
    if (!IMAGE_EXTS.has(ext)) continue;

    totalImages++;
    const buf = entry.getData();
    const hash = sha256(buf);

    if (hashes.has(hash)) {
      duplicateSlugs.push(entry.entryName);
    } else {
      hashes.set(hash, entry.entryName);
    }
  }

  const uniqueCount = hashes.size;
  const duplicateCount = duplicateSlugs.length;
  const payableAmount = uniqueCount * RATE_PER_IMAGE;

  // 1. Update worker upload stats
  await db
    .update(workersTable)
    .set({
      totalUploads: (worker.totalUploads ?? 0) + totalImages,
      validCount: (worker.validCount ?? 0) + uniqueCount,
      duplicateCount: (worker.duplicateCount ?? 0) + duplicateCount,
    })
    .where(eq(workersTable.id, parseInt(workerId)));

  let payment = null;

  if (payableAmount > 0) {
    // 2. Auto-create a pending payment record
    const [newPayment] = await db
      .insert(paymentsTable)
      .values({
        workerId: parseInt(workerId),
        amount: String(payableAmount),
        description: `Batch: ${uniqueCount} unique screenshots × Rs. ${RATE_PER_IMAGE} (${totalImages} total, ${duplicateCount} duplicates)`,
        status: "pending",
      })
      .returning();

    payment = newPayment;

    // 3. Auto-update worker balance
    await db
      .update(workersTable)
      .set({
        balance: sql`${workersTable.balance} + ${String(payableAmount)}`,
      })
      .where(eq(workersTable.id, parseInt(workerId)));
  }

  res.json({
    workerId: worker.id,
    workerName: worker.name,
    totalImages,
    uniqueCount,
    duplicateCount,
    payableAmount,
    ratePerImage: RATE_PER_IMAGE,
    paymentId: payment?.id ?? null,
    paymentStatus: payment ? "pending" : null,
    message: payableAmount > 0
      ? `Auto-processed: ${uniqueCount} unique screenshots × Rs. ${RATE_PER_IMAGE} = Rs. ${payableAmount} added to ${worker.name}'s balance as a pending payout.`
      : `No payable screenshots found (${totalImages} total, ${duplicateCount} duplicates).`,
  });
});

export default router;
