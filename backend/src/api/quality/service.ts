// @ts-nocheck
import { db } from "../../database/drizzle";
import { qualityChecksTable } from "../../database/schema";
import { eq } from "drizzle-orm";
import { QualityCheck } from "../../types";

export const fetchQualityChecks = async (): Promise<QualityCheck[]> => {
    return db.select().from(qualityChecksTable);
};

export const createQualityCheck = async (
    checkData: Omit<QualityCheck, "id" | "created_at">
): Promise<QualityCheck> => {
    const newCheck = await db
        .insert(qualityChecksTable)
        .values(checkData)
        .returning();
    return newCheck[0];
};

export const updateQualityCheck = async (
    checkId: number,
    checkData: Partial<QualityCheck>
): Promise<QualityCheck> => {
    const updatedCheck = await db
        .update(qualityChecksTable)
        .set(checkData)
        .where(eq(qualityChecksTable.id, checkId))
        .returning();
    return updatedCheck[0];
};

export const deleteQualityCheck = async (checkId: number): Promise<void> => {
    await db.delete(qualityChecksTable).where(eq(qualityChecksTable.id, checkId));
};