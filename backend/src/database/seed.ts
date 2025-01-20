import { db } from "./drizzle";
import { productsTable, materialsTable, productionOrdersTable, productionTrackingTable, qualityChecksTable } from "./schema";
// @ts-ignore
import dummyData from "../data.json";

type DataWithDates = Record<string, any>;

function convertDates<T extends DataWithDates>(
    data: T[],
    dateFields: (keyof T)[]
): T[] {
    return data.map((item) => {
        dateFields.forEach((field) => {
            if (item[field] && typeof item[field] === "string") {
                // @ts-ignore
                item[field] = new Date(item[field]);
            }
        });
        return item;
    });
}

const productionOrdersWithDates = convertDates(dummyData.productionOrders, ['start_date', 'end_date']);
const productionTrackingWithDates = convertDates(dummyData.productionTracking, ['start_time', 'end_time']);
const qualityChecksWithDates = convertDates(dummyData.qualityChecks, ['check_date']);

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
