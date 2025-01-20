import express from "express";
import {
    getQualityChecks,
    createCheck,
    updateCheck,
    deleteCheck,
} from "./controller";

const router = express.Router();

router.get("/quality-checks", getQualityChecks);
router.post("/quality-checks", createCheck);
router.put("/quality-checks/:id", updateCheck);
router.delete("/quality-checks/:id", deleteCheck);

export default router;
