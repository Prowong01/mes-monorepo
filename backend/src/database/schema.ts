import { pgTable, serial, text, varchar, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
    "planned",
    "in_progress",
    "completed",
]);

export const trackingStatusEnum = pgEnum("tracking_status", [
    "raw_material_loaded",
    "in_progress",
    "completed",
]);

export const checkResultEnum = pgEnum("check_result", [
    "pass",
    "fail",
]);

export const productsTable = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    created_at: timestamp("created_at").defaultNow(),
});

export const materialsTable = pgTable("materials", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    quantity: integer("quantity").notNull(),
    created_at: timestamp("created_at").defaultNow(),
});

export const productionOrdersTable = pgTable("production_orders", {
    id: serial("id").primaryKey(),
    product_id: integer("product_id").references(() => productsTable.id),
    quantity: integer("quantity").notNull(),
    status: orderStatusEnum("status").notNull(),
    start_date: timestamp("start_date"),
    end_date: timestamp("end_date"),
    created_at: timestamp("created_at").defaultNow(),
});

export const productionTrackingTable = pgTable("production_tracking", {
    id: serial("id").primaryKey(),
    order_id: integer("order_id").references(() => productionOrdersTable.id),
    machine_id: integer("machine_id"),
    operator_id: integer("operator_id"),
    status: trackingStatusEnum("status").notNull(),
    notes: text("notes"),
    created_at: timestamp("created_at").defaultNow(),
});

export const qualityChecksTable = pgTable("quality_checks", {
    id: serial("id").primaryKey(),
    order_id: integer("order_id").references(() => productionOrdersTable.id),
    check_type: varchar("check_type", { length: 255 }).notNull(),
    result: checkResultEnum("result").notNull(),
    notes: text("notes"),
    inspector_id: integer("inspector_id"),
    created_at: timestamp("created_at").defaultNow(),
});
