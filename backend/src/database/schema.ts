import { pgTable, serial, text, varchar, integer, timestamp, pgEnum, json } from "drizzle-orm/pg-core";

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

export const machineStatusEnum = pgEnum("machine_status", [
    "idle",
    "in_use",
    "down",
    "maintenance",
])

export const productsTable = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    unit_cost: integer("unit_cost"),
    production_time: integer("production_time"),
    required_materials: json("required_materials"),
    created_at: timestamp("created_at").defaultNow(),
});

export const materialsTable = pgTable("materials", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    quantity: integer("quantity").notNull(),
    unit_cost: integer("unit_cost"),
    reorder_level: integer("reorder_level"),
    created_at: timestamp("created_at").defaultNow(),
});

export const productionOrdersTable = pgTable("production_orders", {
    id: serial("id").primaryKey(),
    product_id: integer("product_id").references(() => productsTable.id),
    quantity: integer("quantity").notNull(),
    status: orderStatusEnum("status").notNull(),
    start_date: varchar("start_date", { length: 255 }),
    end_date: varchar("end_date", { length: 255 }),
    priority: varchar("priority", { length: 50 }),
    created_at: timestamp("created_at").defaultNow(),
});

export const productionTrackingTable = pgTable("production_tracking", {
    id: serial("id").primaryKey(),
    order_id: integer("order_id").references(() => productionOrdersTable.id),
    machine_id: integer("machine_id"),
    operator_id: integer("operator_id"),
    status: trackingStatusEnum("status").notNull(),
    start_time: timestamp("start_time"),
    end_time: timestamp("end_time"),
    material_usage: json("material_usage"),
    notes: text("notes"),
    created_at: timestamp("created_at").defaultNow(),
})

export const qualityChecksTable = pgTable("quality_checks", {
    id: serial("id").primaryKey(),
    order_id: integer("order_id").references(() => productionOrdersTable.id),
    check_type: varchar("check_type", { length: 255 }).notNull(),
    result: checkResultEnum("result").notNull(),
    check_date: timestamp("check_date"),
    defect_details: text("defect_details"),
    inspector_id: integer("inspector_id"),
    notes: text("notes"),
    created_at: timestamp("created_at").defaultNow(),
});

export const machinesTable = pgTable("machines", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    status: machineStatusEnum("status").default("idle"),
    last_maintenance_date: timestamp("last_maintenance_date"),
    created_at: timestamp("created_at").defaultNow(),
});

export const operatorsTable = pgTable("operators", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    skill_level: varchar("skill_level", { length: 50 }), // 操作员的技能等级（初级、中级、高级）
    created_at: timestamp("created_at").defaultNow(),
})
