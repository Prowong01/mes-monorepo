import express from "express";
import dashboardRoutes from "./dashboard/routes";
import productionRoutes from "./production/routes";
import qualityRoutes from "./quality/routes";

const router = express.Router();

router.use("/dashboard", dashboardRoutes);
router.use("/production", productionRoutes);
router.use("/quality", qualityRoutes);

export default router;
