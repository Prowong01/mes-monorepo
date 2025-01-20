import { Request, Response } from "express";
import {
    fetchProductionOrders,
    createProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
    fetchProductionTracking,
    createProductionTracking,
} from "./service";
import { ProductionOrder, ProductionTracking } from "../../types";

export const getProductionOrders = async (req: Request, res: Response) => {
    try {
        const orders = await fetchProductionOrders();
        res.json(orders);
    } catch (err) {
        console.error("Failed to fetch production orders:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const orderData: Omit<ProductionOrder, "id" | "created_at"> = req.body;
        const newOrder = await createProductionOrder(orderData);
        res.status(201).json(newOrder); // 201 Created
    } catch (err) {
        console.error("Failed to create production order:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id);
        const orderData: Partial<ProductionOrder> = req.body;
        const updatedOrder = await updateProductionOrder(orderId, orderData);
        res.json(updatedOrder);
    } catch (err) {
        console.error("Failed to update production order:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id);
        await deleteProductionOrder(orderId);
        res.status(204).json({ message: "Production order deleted successfully" }); // 204 No Content
    } catch (err) {
        console.error("Failed to delete production order:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getProductionTracking = async (req: Request, res: Response) => {
    try {
        const tracking = await fetchProductionTracking();
        res.json(tracking);
    } catch (err) {
        console.error("Failed to fetch production tracking:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createTracking = async (req: Request, res: Response) => {
    try {
        const trackingData: Omit<ProductionTracking, "id" | "created_at"> = req.body;
        const newTracking = await createProductionTracking(trackingData);
        res.status(201).json(newTracking); // 201 Created
    } catch (err) {
        console.error("Failed to create production tracking:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};