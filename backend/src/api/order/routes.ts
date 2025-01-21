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

router.get("/", getProductionOrders);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

router.get("/tracking", getProductionTracking);
router.post("/tracking", createTracking);

export default router;
