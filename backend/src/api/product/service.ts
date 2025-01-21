// @ts-nocheck
import { db } from "../../database/drizzle";
import { productsTable } from "../../database/schema";
import { eq } from "drizzle-orm";
import { Product } from "../../types";

export const fetchProducts = async (): Promise<Product[]> => {
    return db.select().from(productsTable);
};

export const fetchProductById = async (productId: number): Promise<Product> => {
    const result = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, productId));
    return result[0];
};

export const createProduct = async (
    productData: Omit<Product, "id" | "created_at">
): Promise<Product> => {
    const newProduct = await db
        .insert(productsTable)
        .values(productData)
        .returning();
    return newProduct[0];
};

export const updateProduct = async (
    productId: number,
    productData: Partial<Product>
): Promise<Product> => {
    const updatedProduct = await db
        .update(productsTable)
        .set(productData)
        .where(eq(productsTable.id, productId))
        .returning();
    return updatedProduct[0];
};

export const deleteProduct = async (productId: number): Promise<void> => {
    await db.delete(productsTable).where(eq(productsTable.id, productId));
};
