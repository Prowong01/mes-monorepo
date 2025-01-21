// @ts-nocheck
import { db } from "../../database/drizzle";
import {
    productionOrdersTable,
    productionTrackingTable,
    productsTable,
    materialsTable,
} from "../../database/schema";
import { eq, isNotNull } from "drizzle-orm";
import {
    ProductionOrder,
    ProductionTracking,
} from "../../types";

export const fetchProductionOrders = async (): Promise<ProductionOrder[]> => {
    const result = await db
        .select()
        .from(productionOrdersTable)
        .where(isNotNull(productionOrdersTable.product_id));

    return result;
};

export const createProductionOrder = async (
    orderData: Omit<ProductionOrder, "id" | "created_at">
): Promise<ProductionOrder> => {

    const product = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, orderData.product_id))
        .then((result) => result[0]);

    if (!product) {
        console.error("Product not found");
        throw new Error("Product not found");
    }

    // First, validate all materials
    for (const requiredMaterial of product.required_materials) {
        console.log("Checking material:", requiredMaterial);
        const material = await db
            .select()
            .from(materialsTable)
            .where(eq(materialsTable.id, requiredMaterial.material_id))
            .then((result) => result[0]);

        if (!material) {
            console.error(`Material ${requiredMaterial.material_id} not found`);
            throw new Error(`Material ${requiredMaterial.material_id} not found`);
        }

        const requiredQuantity = requiredMaterial.quantity * orderData.quantity;

        if (material.quantity < requiredQuantity) {
            throw new Error(`Insufficient stock for material ${material.name}`);
        }
    }

    // Then, update all materials
    for (const requiredMaterial of product.required_materials) {
        const material = await db
            .select()
            .from(materialsTable)
            .where(eq(materialsTable.id, requiredMaterial.material_id))
            .then((result) => result[0]);

        const requiredQuantity = requiredMaterial.quantity * orderData.quantity;

        await db
            .update(materialsTable)
            .set({ quantity: material.quantity - requiredQuantity })
            .where(eq(materialsTable.id, requiredMaterial.material_id));
    }

    const newOrder = await db
        .insert(productionOrdersTable)
        .values(orderData)
        .returning();

    return newOrder[0];
};

export const updateProductionOrder = async (
    orderId: number,
    orderData: Partial<ProductionOrder>
): Promise<ProductionOrder> => {
    const updatedOrder = await db
        .update(productionOrdersTable)
        .set(orderData)
        .where(eq(productionOrdersTable.id, orderId))
        .returning();
    return updatedOrder[0];
};

export const deleteProductionOrder = async (orderId: number): Promise<void> => {
    await db
        .delete(productionOrdersTable)
        .where(eq(productionOrdersTable.id, orderId));
};

export const fetchProductionTracking = async (): Promise<ProductionTracking[]> => {
    return db.select().from(productionTrackingTable);
};

export const createProductionTracking = async (
    trackingData: Omit<ProductionTracking, "id" | "created_at">
): Promise<ProductionTracking> => {
    const newTracking = await db
        .insert(productionTrackingTable)
        .values(trackingData)
        .returning();
    return newTracking[0];
};
