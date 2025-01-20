import { Request, Response } from "express";
import {
    fetchProductionOrders,
    createProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
    fetchProductionTracking,
    createProductionTracking,
} from "./service";

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
        const newOrder = await createProductionOrder(req.body);
        res.json(newOrder);
    } catch (err) {
        console.error("Failed to create production order:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id);
        const updatedOrder = await updateProductionOrder(orderId, req.body);
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
        res.json({ message: "Production order deleted successfully" });
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
        const newTracking = await createProductionTracking(req.body);
        res.json(newTracking);
    } catch (err) {
        console.error("Failed to create production tracking:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
