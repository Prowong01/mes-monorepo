import express from "express";
import dashboardRoutes from "./dashboard/routes";
import orderRoutes from "./order/routes";
import qualityRoutes from "./quality/routes";
import productRoutes from './product/routes'
import materialRoutes from './material/routes';

const router = express.Router();

router.use("/dashboard", dashboardRoutes);
router.use("/order", orderRoutes);
router.use("/quality", qualityRoutes);
router.use("/products", productRoutes);
router.use("/materials", materialRoutes);

export default router;
