import {db} from "../../database/drizzle";
import {productionOrdersTable, productionTrackingTable, qualityChecksTable,} from "../../database/schema";
import {count, eq} from "drizzle-orm";
import {
    ProductionStatus,
    MachineUtilization,
    DefectRate,
    DashboardData,
} from "../../types";

export const fetchProductionStatus = async (): Promise<ProductionStatus[]> => {
    const result = await db
        .select({
            status: productionOrdersTable.status,
            count: count(),
        })
        .from(productionOrdersTable)
        .groupBy(productionOrdersTable.status);

    return result as ProductionStatus[];
};

export const fetchMachineUtilization = async (): Promise<MachineUtilization[]> => {
    const result = await db
        .select({
            machine_id: productionTrackingTable.machine_id,
            status: productionTrackingTable.status,
        })
        .from(productionTrackingTable);

    const machineStats = result.reduce((acc, { machine_id, status }) => {
        if (machine_id !== null) {
            if (!acc[machine_id]) {
                acc[machine_id] = { total: 0, in_use: 0 };
            }
            acc[machine_id].total += 1;
            if (status === 'in_progress') {
                acc[machine_id].in_use += 1;
            }
        }
        return acc;
    }, {} as Record<number, { total: number; in_use: number }>);

    const machineUtilization = Object.entries(machineStats).map(([machine_id, stats]) => ({
        machine_id: parseInt(machine_id),
        utilization: (stats.in_use / stats.total) * 100,
    }));

    return machineUtilization;
};

export const fetchDefectRate = async (): Promise<DefectRate> => {
    const totalChecks = await db
        .select({ count: count() })
        .from(qualityChecksTable);

    const failedChecks = await db
        .select({ count: count() })
        .from(qualityChecksTable)
        .where(eq(qualityChecksTable.result, "fail"));

    const total = totalChecks[0]?.count || 0;
    const fail = failedChecks[0]?.count || 0;

    return {
        total,
        fail,
        defectRate: (fail / total) * 100,
    };
};


export const fetchDashboardData = async (): Promise<DashboardData> => {
    const [productionStatus, machineUtilization, defectRate] = await Promise.all([
        fetchProductionStatus(),
        fetchMachineUtilization(),
        fetchDefectRate(),
    ]);

    return {
        productionStatus,
        machineUtilization,
        defectRate,
    };
};
