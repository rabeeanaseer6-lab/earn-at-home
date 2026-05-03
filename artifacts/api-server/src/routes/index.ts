import { Router } from "express";
import healthRouter from "./health";
import workersRouter from "./workers";
import blogRouter from "./blog";
import batchRouter from "./batch";

const router = Router();

router.use(healthRouter);
router.use(workersRouter);
router.use(blogRouter);
router.use(batchRouter);

export default router;
