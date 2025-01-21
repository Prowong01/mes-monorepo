import express from "express";
import {
    getMaterials,
    getMaterialById,
    createMaterialHandler,
    updateMaterialHandler,
    deleteMaterialHandler,
} from "./controller";

const router = express.Router();

router.get("/", getMaterials);
router.get("/:id", getMaterialById);
router.post("/", createMaterialHandler);
router.put("/:id", updateMaterialHandler);
router.delete("/:id", deleteMaterialHandler);

export default router;
