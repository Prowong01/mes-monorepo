CREATE TYPE "public"."machine_status" AS ENUM('idle', 'in_use', 'down', 'maintenance');--> statement-breakpoint
CREATE TABLE "machines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" "machine_status" DEFAULT 'idle',
	"last_maintenance_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "operators" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"skill_level" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "unit_cost" integer;--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "reorder_level" integer;--> statement-breakpoint
ALTER TABLE "production_orders" ADD COLUMN "priority" varchar(50);--> statement-breakpoint
ALTER TABLE "production_tracking" ADD COLUMN "start_time" timestamp;--> statement-breakpoint
ALTER TABLE "production_tracking" ADD COLUMN "end_time" timestamp;--> statement-breakpoint
ALTER TABLE "production_tracking" ADD COLUMN "material_usage" json;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "unit_cost" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "production_time" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "required_materials" json;--> statement-breakpoint
ALTER TABLE "quality_checks" ADD COLUMN "check_date" timestamp;--> statement-breakpoint
ALTER TABLE "quality_checks" ADD COLUMN "defect_details" text;