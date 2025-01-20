import { Request, Response } from "express";
import {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "./service";
import { Product } from "../../types";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await fetchProducts();
        res.json(products);
    } catch (err) {
        console.error("Failed to fetch products:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await fetchProductById(productId);
        res.json(product);
    } catch (err) {
        console.error("Failed to fetch product:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createProductHandler = async (req: Request, res: Response) => {
    try {
        const productData: Omit<Product, "id" | "created_at"> = req.body;
        const newProduct = await createProduct(productData);
        res.status(201).json(newProduct); // 201 Created
    } catch (err) {
        console.error("Failed to create product:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProductHandler = async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id);
        const productData: Partial<Product> = req.body;
        const updatedProduct = await updateProduct(productId, productData);
        res.json(updatedProduct);
    } catch (err) {
        console.error("Failed to update product:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id);
        await deleteProduct(productId);
        res.status(204).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("Failed to delete product:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};