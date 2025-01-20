import { db } from "../../database/drizzle";
import { qualityChecksTable } from "../../database/schema";
import { eq } from "drizzle-orm";

export const fetchQualityChecks = async () => {
    return db.select().from(qualityChecksTable);
};

export const createQualityCheck = async (checkData: {
    order_id: number;
    check_type: string;
    result: any;
    notes?: string;
    inspector_id?: number;
}) => {
    const newCheck = await db
        .insert(qualityChecksTable)
        .values(checkData)
        .returning();
    return newCheck[0];
};

export const updateQualityCheck = async (
    checkId: number,
    checkData: { result?: any; notes?: string }
) => {
    const updatedCheck = await db
        .update(qualityChecksTable)
        .set(checkData)
        .where(eq(qualityChecksTable.id, checkId))
        .returning();
    return updatedCheck[0];
};

export const deleteQualityCheck = async (checkId: number) => {
    await db.delete(qualityChecksTable).where(eq(qualityChecksTable.id, checkId));
};
