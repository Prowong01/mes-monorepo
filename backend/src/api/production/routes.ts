import express from "express";
import {
    getProductionOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getProductionTracking,
    createTracking,
} from "./controller";

const router = express.Router();

router.get("/production-orders", getProductionOrders);
router.post("/production-orders", createOrder);
router.put("/production-orders/:id", updateOrder);
router.delete("/production-orders/:id", deleteOrder);

router.get("/production-tracking", getProductionTracking);
router.post("/production-tracking", createTracking);

export default router;
