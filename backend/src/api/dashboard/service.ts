import { db } from "../../database/drizzle";
import { productionOrders, productionTracking, qualityChecks } from "../../database/schema";
import {eq} from "drizzle-orm";

export const fetchDashboardData = async () => {
    const productionStatus = await db
        .select()
        .from(productionOrders)
        .where(eq(productionOrders.status, "in_progress"));

    const machineUtilization = await db
        .select()
        .from(productionTracking)
        .where(eq(productionTracking.status, "in_progress"));

    const defectRate = await db
        .select()
        .from(qualityChecks)
        .where(eq(qualityChecks.result, "fail"));

    return {
        productionStatus: productionStatus.length,
        machineUtilization: machineUtilization.length,
        defectRate: defectRate.length,
    };
};