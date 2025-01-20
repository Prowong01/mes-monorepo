import { Request, Response } from "express";
import { fetchDashboardData } from "./service";

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const data = await fetchDashboardData();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};