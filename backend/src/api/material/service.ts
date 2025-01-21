// @ts-nocheck
import { db } from "../../database/drizzle";
import { materialsTable } from "../../database/schema";
import { eq } from "drizzle-orm";
import { Material } from "../../types";

export const fetchMaterials = async (): Promise<Material[]> => {
    return db.select().from(materialsTable);
};

export const fetchMaterialById = async (materialId: number): Promise<Material> => {
    const result = await db
        .select()
        .from(materialsTable)
        .where(eq(materialsTable.id, materialId));
    return result[0];
};

export const createMaterial = async (
    materialData: Omit<Material, "id" | "created_at">
): Promise<Material> => {
    const newMaterial = await db
        .insert(materialsTable)
        .values(materialData)
        .returning();
    return newMaterial[0];
};

export const updateMaterial = async (
    materialId: number,
    materialData: Partial<Material>
): Promise<Material> => {
    const updatedMaterial = await db
        .update(materialsTable)
        .set(materialData)
        .where(eq(materialsTable.id, materialId))
        .returning();
    return updatedMaterial[0];
};

export const deleteMaterial = async (materialId: number): Promise<void> => {
    await db.delete(materialsTable).where(eq(materialsTable.id, materialId));
};
