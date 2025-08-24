import { Router } from "express";
import aiRoutes from "./ai.route";
import historyRoutes from "./history.route";

const router = Router();

router.use("/ai", aiRoutes);
router.use("/history", historyRoutes);

export default router;
