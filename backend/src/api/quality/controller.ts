import { Request, Response } from "express";
import {
    fetchQualityChecks,
    createQualityCheck,
    updateQualityCheck,
    deleteQualityCheck,
} from "./service";

export const getQualityChecks = async (req: Request, res: Response) => {
    try {
        const checks = await fetchQualityChecks();
        res.json(checks);
    } catch (err) {
        console.error("Failed to fetch quality checks:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createCheck = async (req: Request, res: Response) => {
    try {
        const newCheck = await createQualityCheck(req.body);
        res.json(newCheck);
    } catch (err) {
        console.error("Failed to create quality check:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateCheck = async (req: Request, res: Response) => {
    try {
        const checkId = parseInt(req.params.id);
        const updatedCheck = await updateQualityCheck(checkId, req.body);
        res.json(updatedCheck);
    } catch (err) {
        console.error("Failed to update quality check:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteCheck = async (req: Request, res: Response) => {
    try {
        const checkId = parseInt(req.params.id);
        await deleteQualityCheck(checkId);
        res.json({ message: "Quality check deleted successfully" });
    } catch (err) {
        console.error("Failed to delete quality check:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
