CREATE TYPE "public"."check_result" AS ENUM('pass', 'fail');--> statement-breakpoint
CREATE TYPE "public"."machine_status" AS ENUM('idle', 'in_use', 'down', 'maintenance');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('planned', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."tracking_status" AS ENUM('raw_material_loaded', 'in_progress', 'completed');--> statement-breakpoint
CREATE TABLE "machines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" "machine_status" DEFAULT 'idle',
	"last_maintenance_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"quantity" integer NOT NULL,
	"unit_cost" integer,
	"reorder_level" integer,
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
CREATE TABLE "production_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"quantity" integer NOT NULL,
	"status" "order_status" NOT NULL,
	"start_date" varchar(255),
	"end_date" varchar(255),
	"priority" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "production_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"machine_id" integer,
	"operator_id" integer,
	"status" "tracking_status" NOT NULL,
	"start_time" timestamp,
	"end_time" timestamp,
	"material_usage" json,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"unit_cost" integer,
	"production_time" integer,
	"required_materials" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quality_checks" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"check_type" varchar(255) NOT NULL,
	"result" "check_result" NOT NULL,
	"check_date" timestamp,
	"defect_details" text,
	"inspector_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_tracking" ADD CONSTRAINT "production_tracking_order_id_production_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."production_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quality_checks" ADD CONSTRAINT "quality_checks_order_id_production_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."production_orders"("id") ON DELETE no action ON UPDATE no action;