import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

// 打印环境变量以调试
console.log("DATABASE_URL:", process.env.DATABASE_URL);


export default defineConfig({
    schema: "./src/database/schema.ts",
    out: "./src/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});