import express from "express";
import {
    getProductionOrders,
    createProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
} from "./controller";

const router = express.Router();

router.get("/production-orders", getProductionOrders);
router.post("/production-orders", createProductionOrder);
router.put("/production-orders/:id", updateProductionOrder);
router.delete("/production-orders/:id", deleteProductionOrder);

export default router;