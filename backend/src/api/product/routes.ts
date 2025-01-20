import express from "express";
import {
    getProducts,
    getProductById,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler,
} from "./controller";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProductHandler);
router.put("/:id", updateProductHandler);
router.delete("/:id", deleteProductHandler);

export default router;