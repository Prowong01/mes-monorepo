import { db } from "./drizzle";
import { productsTable, materialsTable, productionOrdersTable, productionTrackingTable, qualityChecksTable } from "./schema";
// @ts-ignore
import dummyData from "../data.json";

async function seedDatabase() {
    try {
        console.log("Seeding products...");
        await db.insert(productsTable).values(dummyData.products);

        console.log("Seeding materials...");
        await db.insert(materialsTable).values(dummyData.materials);

        console.log("Seeding production orders...");
        await db.insert(productionOrdersTable).values(dummyData.productionOrders);

        console.log("Seeding production tracking...");
        await db.insert(productionTrackingTable).values(dummyData.productionTracking);

        console.log("Seeding quality checks...");
        await db.insert(qualityChecksTable).values(dummyData.qualityChecks);

        console.log("Database seeded successfully!");
    } catch (err) {
        console.error("Failed to seed database:", err);
    } finally {
        process.exit();
    }
}

seedDatabase();
