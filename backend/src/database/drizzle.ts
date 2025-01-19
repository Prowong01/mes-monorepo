import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema"; // 导入所有表结构

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in .env.local");
}

const sql = neon(databaseUrl);

// 初始化 Drizzle ORM
export const db = drizzle(sql, {
    schema, // 将所有表结构传递给 drizzle
    casing: "snake_case", // 将字段名转换为 snake_case（可选）
});