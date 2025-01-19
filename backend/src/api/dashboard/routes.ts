import express from "express";
import { getDashboardData } from "./controller";

const router = express.Router();

router.get("/data", getDashboardData);

export default router;