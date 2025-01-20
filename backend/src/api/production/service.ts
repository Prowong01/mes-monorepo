// @ts-nocheck
import { db } from "../../database/drizzle";
import {
    productionOrdersTable,
    productionTrackingTable,
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