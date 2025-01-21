import { Request, Response } from "express";
import {
    fetchMaterials,
    fetchMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
} from "./service";
import { Material } from "../../types";

export const getMaterials = async (req: Request, res: Response) => {
    try {
        const materials = await fetchMaterials();
        res.json(materials);
    } catch (err) {
        console.error("Failed to fetch materials:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMaterialById = async (req: Request, res: Response) => {
    try {
        const materialId = parseInt(req.params.id);
        const material = await fetchMaterialById(materialId);
        res.json(material);
    } catch (err) {
        console.error("Failed to fetch material:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createMaterialHandler = async (req: Request, res: Response) => {
    try {
        const materialData: Omit<Material, "id" | "created_at"> = req.body;
        const newMaterial = await createMaterial(materialData);
        res.status(201).json(newMaterial); // 201 Created
    } catch (err) {
        console.error("Failed to create material:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateMaterialHandler = async (req: Request, res: Response) => {
    try {
        const materialId = parseInt(req.params.id);
        const materialData: Partial<Material> = req.body;
        const updatedMaterial = await updateMaterial(materialId, materialData);
        res.json(updatedMaterial);
    } catch (err) {
        console.error("Failed to update material:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteMaterialHandler = async (req: Request, res: Response) => {
    try {
        const materialId = parseInt(req.params.id);
        await deleteMaterial(materialId);
        res.status(204).json({ message: "Material deleted successfully" });
    } catch (err) {
        console.error("Failed to delete material:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
