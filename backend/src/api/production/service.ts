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

    return result as ProductionOrder[];
};

export const createProductionOrder = async (
    orderData: Omit<ProductionOrder, "id">
): Promise<ProductionOrder> => {

    const newOrder = await db
        .insert(productionOrdersTable)
        .values(orderData)
        .returning();
    // @ts-ignore
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
    // @ts-ignore
    return updatedOrder[0];
};

export const deleteProductionOrder = async (orderId: number): Promise<void> => {
    await db
        .delete(productionOrdersTable)
        .where(eq(productionOrdersTable.id, orderId));
};

// 获取所有生产跟踪记录
export const fetchProductionTracking = async (): Promise<ProductionTracking[]> => {
    // @ts-ignore
    return db.select().from(productionTrackingTable);
};

// 创建生产跟踪记录
export const createProductionTracking = async (
    trackingData: Omit<ProductionTracking, "id">
): Promise<ProductionTracking> => {
    const newTracking = await db
        .insert(productionTrackingTable)
        .values(trackingData)
        .returning();
    // @ts-ignore
    return newTracking[0];
};
