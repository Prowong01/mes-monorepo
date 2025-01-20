import express from "express";
import dashboardRoutes from "./dashboard/routes";
import productionRoutes from "./production/routes";
import qualityRoutes from "./quality/routes";
import productRoutes from './product/routes'

const router = express.Router();

router.use("/dashboard", dashboardRoutes);
router.use("/production", productionRoutes);
router.use("/quality", qualityRoutes);
router.use("/products", productRoutes);

export default router;
