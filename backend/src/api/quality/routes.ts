import express from "express";
import {
    getQualityChecks,
    createCheck,
    updateCheck,
    deleteCheck,
} from "./controller";

const router = express.Router();

router.get("/", getQualityChecks);
router.post("/", createCheck);
router.put("/:id", updateCheck);
router.delete("/:id", deleteCheck);

export default router;
