import { Request, Response } from "express";
import {
    fetchQualityChecks,
    createQualityCheck,
    updateQualityCheck,
    deleteQualityCheck,
} from "./service";
import { QualityCheck } from "../../types";

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
        const checkData: Omit<QualityCheck, "id" | "created_at"> = req.body;
        const newCheck = await createQualityCheck(checkData);
        res.status(201).json(newCheck); // 201 Created
    } catch (err) {
        console.error("Failed to create quality check:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateCheck = async (req: Request, res: Response) => {
    try {
        const checkId = parseInt(req.params.id);
        const checkData: Partial<QualityCheck> = req.body;
        const updatedCheck = await updateQualityCheck(checkId, checkData);
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
        res.status(204).json({ message: "Quality check deleted successfully" }); // 204 No Content
    } catch (err) {
        console.error("Failed to delete quality check:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};