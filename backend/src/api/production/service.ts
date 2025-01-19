import { db } from "../../database/drizzle";
import { productionOrdersTable } from "../../database/schema";

export const fetchProductionOrders = async () => {
    return await db.select().from(productionOrdersTable);
};

export const addProductionOrder = async (orderData: any) => {
    const newOrder = await db
        .insert(productionOrdersTable)
        .values(orderData)
        .returning();
    return newOrder[0];
};

// 其他服务函数...