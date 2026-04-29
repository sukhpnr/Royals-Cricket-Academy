import { Router, type IRouter } from "express";
import healthRouter from "./health";
import registrationsRouter from "./registrations";
import receiptsRouter from "./receipts";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(registrationsRouter);
router.use(receiptsRouter);
router.use(statsRouter);

export default router;
