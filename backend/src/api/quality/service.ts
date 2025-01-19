// import { db } from "../../database/drizzle";
// import { qualityChecksTable } from "../../database/schema";
//
// export const fetchQualityChecks = async () => {
//     return await db.select().from(qualityChecksTable);
// };
//
// export const addQualityCheck = async (checkData: any) => {
//     const newCheck = await db
//         .insert(qualityChecksTable)
//         .values(checkData)
//         .returning();
//     return newCheck[0];
// };
//
// // 其他服务函数...